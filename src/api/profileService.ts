import supabase from './supabase';
import bcrypt from 'bcryptjs';

/**
 * Update admin profile
 * @param adminId - ID of the admin
 * @param profileName - New profile name
 * @param profilePic - New profile picture URL
 * @returns True if operation was successful
 */
export const updateAdminProfile = async (
  adminId: string,
  profileName: string,
  profilePic: string | null
) => {
  const { error } = await supabase
    .from('admin')
    .update({ 
      profile_name: profileName,
      profile_pic: profilePic,
      updated_at: new Date().toISOString()
    })
    .eq('id', adminId);

  if (error) throw error;
  return true;
};

/**
 * Update company profile
 * @param companyId - ID of the company
 * @param companyName - New company name
 * @param profilePic - New profile picture URL
 * @returns Updated company data
 */
export const updateCompanyProfile = async (
  companyId: string,
  companyName: string,
  profilePic: string | null
) => {
  const { data, error } = await supabase
    .from('company')
    .update({ 
      company_name: companyName,
      profile_pic: profilePic,
      updated_at: new Date().toISOString()
    })
    .eq('id', companyId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update employee profile
 * @param employeeId - ID of the employee
 * @param employeeName - New employee name
 * @param profilePic - New profile picture URL
 * @returns Updated employee data
 */
export const updateEmployeeProfile = async (
  employeeId: string,
  employeeName: string,
  profilePic: string | null
) => {
  const { data, error } = await supabase
    .from('employee')
    .update({ 
      employee_name: employeeName,
      profile_pic: profilePic,
      updated_at: new Date().toISOString()
    })
    .eq('id', employeeId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update company password
 * @param companyId - ID of the company
 * @param currentPassword - Current password
 * @param newPassword - New password
 * @returns Object with success status and message
 */
export const updateCompanyPassword = async (
  companyId: string,
  currentPassword: string,
  newPassword: string
) => {
  try {
    // Verify current password
    const { data: company, error: getError } = await supabase
      .from('company')
      .select('password_hash')
      .eq('id', companyId)
      .single();

    if (getError || !company) {
      return {
        success: false,
        message: 'Company not found'
      };
    }

    const passwordMatch = await bcrypt.compare(currentPassword, company.password_hash);
    if (!passwordMatch) {
      return {
        success: false,
        message: 'Current password is incorrect'
      };
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    const { error: updateError } = await supabase
      .from('company')
      .update({ 
        password_hash: passwordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', companyId);

    if (updateError) {
      return {
        success: false,
        message: 'Failed to update password'
      };
    }

    return {
      success: true,
      message: 'Password updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
};

/**
 * Update employee password
 * @param employeeId - ID of the employee
 * @param currentPassword - Current password
 * @param newPassword - New password
 * @returns Object with success status and message
 */
export const updateEmployeePassword = async (
  employeeId: string,
  currentPassword: string,
  newPassword: string
) => {
  try {
    // Verify current password
    const { data: employee, error: getError } = await supabase
      .from('employee')
      .select('password_hash')
      .eq('id', employeeId)
      .single();

    if (getError || !employee) {
      return {
        success: false,
        message: 'Employee not found'
      };
    }

    const passwordMatch = await bcrypt.compare(currentPassword, employee.password_hash);
    if (!passwordMatch) {
      return {
        success: false,
        message: 'Current password is incorrect'
      };
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    const { error: updateError } = await supabase
      .from('employee')
      .update({ 
        password_hash: passwordHash,
        updated_at: new Date().toISOString()
      })
      .eq('id', employeeId);

    if (updateError) {
      return {
        success: false,
        message: 'Failed to update password'
      };
    }

    return {
      success: true,
      message: 'Password updated successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
};

/**
 * Get user profile data
 * @param userType - Type of user ('admin', 'company', 'employee')
 * @param userId - ID of the user
 * @returns Profile data for the user
 */
export const getUserProfile = async (userType: string, userId: string) => {
  if (userType === 'admin') {
    const { data, error } = await supabase
      .from('admin')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } else if (userType === 'company') {
    const { data, error } = await supabase
      .from('company')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } else { // employee, manager, asst_manager
    const { data, error } = await supabase
      .from('employee')
      .select(`
        *,
        branch:branch_id (branch_name),
        company:company_id (company_name)
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }
};