import supabase from './supabase';
import { Task, TaskCompletion } from '../types/models';

/**
 * Get tasks based on filters
 * @param filters - Object containing various filter options
 * @returns Array of tasks
 */
export const getTasks = async (filters: {
  companyId?: string;
  branchId?: string;
  employeeId?: string;
  assignedTo?: 'branch' | 'employee';
  assignedId?: string;
  isCompleted?: boolean;
  assignedBy?: 'company' | 'manager' | 'asst_manager';
  assignedById?: string;
} = {}) => {
  let query = supabase.from('task').select('*');

  // Apply filters
  if (filters.companyId) {
    query = query.eq('assigned_by', 'company').eq('assigned_by_id', filters.companyId);
  }

  if (filters.branchId) {
    query = query.eq('assigned_to', 'branch').eq('assigned_id', filters.branchId);
  }

  if (filters.employeeId) {
    // Need to join with task_completion to get tasks assigned to this employee
    // This is a more complex query that depends on Supabase capabilities
    // For simplicity, we'll fetch all tasks and filter client-side
    const { data: allTasks, error: tasksError } = await supabase
      .from('task')
      .select('*')
      .order('created_at', { ascending: false });

    if (tasksError) throw tasksError;

    // Get task completions for this employee
    const { data: completions, error: completionsError } = await supabase
      .from('task_completion')
      .select('*')
      .eq('employee_id', filters.employeeId);

    if (completionsError) throw completionsError;

    // Find tasks that are in the task_completion table for this employee
    const taskIds = completions.map(c => c.task_id);
    return allTasks.filter(task => taskIds.includes(task.id));
  }

  if (filters.assignedTo) {
    query = query.eq('assigned_to', filters.assignedTo);
    if (filters.assignedId) {
      query = query.eq('assigned_id', filters.assignedId);
    }
  }

  if (filters.isCompleted !== undefined) {
    query = query.eq('is_completed', filters.isCompleted);
  }

  if (filters.assignedBy) {
    query = query.eq('assigned_by', filters.assignedBy);
    if (filters.assignedById) {
      query = query.eq('assigned_by_id', filters.assignedById);
    }
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

/**
 * Get task by ID
 * @param taskId - ID of the task
 * @returns Task object
 */
export const getTaskById = async (taskId: string) => {
  const { data, error } = await supabase
    .from('task')
    .select('*')
    .eq('id', taskId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Create a new task
 * @param title - Task title
 * @param description - Task description
 * @param assignedTo - Entity type ('branch' or 'employee')
 * @param assignedId - ID of the assigned entity
 * @param assignedBy - Role of creator ('company', 'manager', or 'asst_manager')
 * @param assignedById - ID of creator
 * @returns The created task
 */
export const createTask = async (
  title: string,
  description: string,
  assignedTo: 'branch' | 'employee',
  assignedId: string,
  assignedBy: 'company' | 'manager' | 'asst_manager',
  assignedById: string
) => {
  // Start a transaction (note: Supabase doesn't support true transactions, so we'll do sequential operations)
  // 1. Create the task
  const { data: task, error: taskError } = await supabase
    .from('task')
    .insert([
      {
        title,
        description,
        assigned_to: assignedTo,
        assigned_id: assignedId,
        assigned_by: assignedBy,
        assigned_by_id: assignedById
      }
    ])
    .select()
    .single();

  if (taskError) throw taskError;

  // 2. Create task completion records
  if (assignedTo === 'branch') {
    // Get all active employees in the branch
    const { data: employees, error: employeesError } = await supabase
      .from('employee')
      .select('id')
      .eq('branch_id', assignedId)
      .eq('is_active', true);

    if (employeesError) throw employeesError;

    // Create task completion record for each employee
    for (const employee of employees) {
      const { error: completionError } = await supabase
        .from('task_completion')
        .insert([
          {
            task_id: task.id,
            employee_id: employee.id,
            is_completed: false
          }
        ]);

      if (completionError) throw completionError;
    }
  } else { // assignedTo === 'employee'
    // Create single task completion record
    const { error: completionError } = await supabase
      .from('task_completion')
      .insert([
        {
          task_id: task.id,
          employee_id: assignedId,
          is_completed: false
        }
      ]);

    if (completionError) throw completionError;
  }

  return task;
};

/**
 * Complete a task by an employee
 * @param taskId - ID of the task
 * @param employeeId - ID of the employee completing the task
 * @returns True if operation was successful
 */
export const completeTask = async (taskId: string, employeeId: string) => {
  // 1. Update task completion record
  const { data: completion, error: completionError } = await supabase
    .from('task_completion')
    .select('*')
    .eq('task_id', taskId)
    .eq('employee_id', employeeId)
    .maybeSingle();

  if (completionError) throw completionError;

  if (completion) {
    // Update existing record
    const { error: updateError } = await supabase
      .from('task_completion')
      .update({ 
        is_completed: true, 
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', completion.id);

    if (updateError) throw updateError;
  } else {
    // Create new record
    const { error: insertError } = await supabase
      .from('task_completion')
      .insert([
        {
          task_id: taskId,
          employee_id: employeeId,
          is_completed: true,
          completed_at: new Date().toISOString()
        }
      ]);

    if (insertError) throw insertError;
  }

  // 2. Get task details
  const { data: task, error: taskError } = await supabase
    .from('task')
    .select('*')
    .eq('id', taskId)
    .single();

  if (taskError) throw taskError;

  // 3. Check if all employees have completed the task (for branch tasks)
  if (task.assigned_to === 'employee') {
    // For individual task, mark as completed directly
    const { error: updateError } = await supabase
      .from('task')
      .update({ 
        is_completed: true, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', taskId);

    if (updateError) throw updateError;
  } else { // task.assigned_to === 'branch'
    // For branch task, check if all employees have completed it
    const { data: activeEmployees, error: employeesError } = await supabase
      .from('employee')
      .select('id')
      .eq('branch_id', task.assigned_id)
      .eq('is_active', true);

    if (employeesError) throw employeesError;

    const { data: completions, error: completionsError } = await supabase
      .from('task_completion')
      .select('*')
      .eq('task_id', taskId)
      .eq('is_completed', true);

    if (completionsError) throw completionsError;

    // If all active employees have completed the task, mark it as completed
    if (completions.length >= activeEmployees.length) {
      const { error: updateError } = await supabase
        .from('task')
        .update({ 
          is_completed: true, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', taskId);

      if (updateError) throw updateError;
    }
  }

  return true;
};

/**
 * Manager completes a task for all employees in a branch
 * @param taskId - ID of the task
 * @param branchId - ID of the branch
 * @returns True if operation was successful
 */
export const managerCompleteTask = async (taskId: string, branchId: string) => {
  // 1. Get all employees in the branch
  const { data: employees, error: employeesError } = await supabase
    .from('employee')
    .select('id')
    .eq('branch_id', branchId);

  if (employeesError) throw employeesError;

  // 2. Mark task as completed for all employees
  for (const employee of employees) {
    await completeTask(taskId, employee.id);
  }

  // 3. Mark the task itself as completed
  const { error: updateError } = await supabase
    .from('task')
    .update({ 
      is_completed: true, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', taskId);

  if (updateError) throw updateError;

  return true;
};

/**
 * Get task completion status for an employee
 * @param taskId - ID of the task
 * @param employeeId - ID of the employee
 * @returns Completion status
 */
export const getTaskCompletionStatus = async (taskId: string, employeeId: string) => {
  const { data, error } = await supabase
    .from('task_completion')
    .select('*')
    .eq('task_id', taskId)
    .eq('employee_id', employeeId)
    .maybeSingle();

  if (error) throw error;
  return data?.is_completed || false;
};

/**
 * Get task with detailed information
 * @param taskId - ID of the task
 * @returns Task with additional details
 */
export const getTaskWithDetails = async (taskId: string) => {
  const { data: task, error: taskError } = await supabase
    .from('task')
    .select('*')
    .eq('id', taskId)
    .single();

  if (taskError) throw taskError;

  // Get completion data
  const { data: completions, error: completionsError } = await supabase
    .from('task_completion')
    .select('*, employee:employee_id (*)')
    .eq('task_id', taskId);

  if (completionsError) throw completionsError;

  return {
    ...task,
    completions
  };
};