import supabase from './supabase';
import { Branch } from '../types/models';

/**
 * Get all branches for a company
 * @param companyId - The ID of the company
 * @returns Array of branches
 */
export const getBranches = async (companyId: string) => {
  const { data, error } = await supabase
    .from('branch')
    .select('*')
    .eq('company_id', companyId)
    // Sort by main branch first, then creation date
    .order('is_main_branch', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Get a single branch by ID
 * @param branchId - The ID of the branch
 * @returns Branch object
 */
export const getBranchById = async (branchId: string) => {
  const { data, error } = await supabase
    .from('branch')
    .select('*')
    .eq('id', branchId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Create a new branch
 * @param branchName - Name of the branch
 * @param companyId - ID of the company
 * @param isMainBranch - Whether this is a main branch (defaults to false)
 * @returns The created branch
 */
export const createBranch = async (
  branchName: string, 
  companyId: string,
  isMainBranch: boolean = false
) => {
  const { data, error } = await supabase
    .from('branch')
    .insert([
      {
        branch_name: branchName,
        company_id: companyId,
        is_main_branch: isMainBranch
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Toggle branch active status
 * @param branchId - ID of the branch
 * @param isActive - New active status
 * @returns True if operation was successful
 */
export const toggleBranchStatus = async (branchId: string, isActive: boolean) => {
  // First update branch status
  const { error: branchError } = await supabase
    .from('branch')
    .update({ 
      is_active: isActive, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', branchId);

  if (branchError) throw branchError;

  // Then update employees in this branch
  const { error: employeeError } = await supabase
    .from('employee')
    .update({ 
      is_active: isActive, 
      updated_at: new Date().toISOString() 
    })
    .eq('branch_id', branchId);

  if (employeeError) throw employeeError;

  return true;
};

/**
 * Get branch with employee counts
 * @param branchId - ID of the branch
 * @returns Branch object with employee counts
 */
export const getBranchWithEmployeeCounts = async (branchId: string) => {
  const { data: branch, error: branchError } = await supabase
    .from('branch')
    .select('*')
    .eq('id', branchId)
    .single();

  if (branchError) throw branchError;

  // Get employees in this branch
  const { data: employees, error: employeeError } = await supabase
    .from('employee')
    .select('id, role')
    .eq('branch_id', branchId);

  if (employeeError) throw employeeError;

  // Count employees by role
  const managerCount = employees.filter(e => e.role === 'manager').length;
  const asstManagerCount = employees.filter(e => e.role === 'asst_manager').length;
  const generalEmployeeCount = employees.filter(e => e.role === 'employee').length;

  return {
    ...branch,
    employeeCounts: {
      total: employees.length,
      managers: managerCount,
      asstManagers: asstManagerCount,
      generalEmployees: generalEmployeeCount
    }
  };
};