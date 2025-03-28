import supabase from './supabase';
import bcrypt from 'bcryptjs';
import { Employee } from '../types/models';

/**
 * Get employees based on filters
 * @param companyId - Optional company ID filter
 * @param branchId - Optional branch ID filter
 * @param role - Optional role filter
 * @returns Array of employees
 */
export const getEmployees = async (
  companyId?: string,
  branchId?: string,
  role?: 'manager' | 'asst_manager' | 'employee'
) => {
  let query = supabase
    .from('employee')
    .select(`
      *,
      branch:branch_id (branch_name)
    `);

  if (companyId) {
    query = query.eq('company_id', companyId);
  }

  if (branchId) {
    query = query.eq('branch_id', branchId);
  }

  if (role) {
    query = query.eq('role', role);
  }

  const { data, error } = await query.order('role').order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Get employee by ID
 * @param employeeId - ID of the employee
 * @returns Employee object
 */
export const getEmployeeById = async (employeeId: string) => {
  const { data, error } = await supabase
    .from('employee')
    .select(`
      *,
      branch:branch_id (branch_name)
    `)
    .eq('id', employeeId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Create a new employee
 * @param employeeName - Name of the employee
 * @param username - Username for login
 * @param password - Password (will be hashed)
 * @param profilePic - Optional profile picture URL
 * @param role - Employee role
 * @param companyId - ID of the company
 * @param branchId - ID of the branch
 * @param createdBy - Role of creator
 * @param createdById - ID of creator
 * @returns The created employee
 */
export const createEmployee = async (
  employeeName: string,
  username: string,
  password: string,
  profilePic: string | null,
  role: 'manager' | 'asst_manager' | 'employee',
  companyId: string,
  branchId: string,
  createdBy: string,
  createdById: string
) => {
  // Hash the password
  const passwordHash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('employee')
    .insert([
      {
        employee_name: employeeName,
        username,
        password_hash: passwordHash,
        profile_pic: profilePic,
        role,
        company_id: companyId,
        branch_id: branchId,
        created_by: createdBy,
        created_by_id: createdById
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Toggle employee active status
 * @param employeeId - ID of the employee
 * @param isActive - New active status
 * @returns True if operation was successful
 */
export const toggleEmployeeStatus = async (employeeId: string, isActive: boolean) => {
  const { error } = await supabase
    .from('employee')
    .update({ 
      is_active: isActive, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', employeeId);

  if (error) throw error;
  return true;
};

/**
 * Update employee role
 * @param employeeId - ID of the employee
 * @param role - New role
 * @returns True if operation was successful
 */
export const updateEmployeeRole = async (
  employeeId: string,
  role: 'manager' | 'asst_manager' | 'employee'
) => {
  const { error } = await supabase
    .from('employee')
    .update({ 
      role, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', employeeId);

  if (error) throw error;
  return true;
};

/**
 * Update employee branch
 * @param employeeId - ID of the employee
 * @param branchId - ID of the new branch
 * @returns True if operation was successful
 */
export const updateEmployeeBranch = async (employeeId: string, branchId: string) => {
  const { error } = await supabase
    .from('employee')
    .update({ 
      branch_id: branchId, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', employeeId);

  if (error) throw error;
  return true;
};

/**
 * Get active employees in a branch
 * @param branchId - ID of the branch
 * @returns Array of active employees
 */
export const getActiveEmployeesInBranch = async (branchId: string) => {
  const { data, error } = await supabase
    .from('employee')
    .select('*')
    .eq('branch_id', branchId)
    .eq('is_active', true)
    .order('role')
    .order('employee_name');

  if (error) throw error;
  return data || [];
};