import supabase from "./supabase";
import { Report } from "../types/models";

/**
 * Get reports based on filters
 * @param filters - Object containing various filter options
 * @returns Array of reports with employee and branch information
 */
export const getReports = async (
  filters: {
    employeeId?: string;
    branchId?: string;
    companyId?: string;
    startDate?: string;
    endDate?: string;
  } = {},
) => {
  let query = supabase.from("report").select(`
      *,
      employee:employee_id (
        employee_name, 
        role,
        branch:branch_id (branch_name)
      )
    `);

  // Apply filters
  if (filters.employeeId) {
    query = query.eq("employee_id", filters.employeeId);
  }

  if (filters.branchId) {
    // Need to join with employee to filter by branch
    query = query.eq("employee.branch_id", filters.branchId);
  }

  if (filters.companyId) {
    // Need to join with employee to filter by company
    query = query.eq("employee.company_id", filters.companyId);
  }

  if (filters.startDate) {
    query = query.gte("report_date", filters.startDate);
  }

  if (filters.endDate) {
    query = query.lte("report_date", filters.endDate);
  }

  query = query.order("report_date", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;

  // Transform data to match expected format
  return (
    data?.map((report) => ({
      id: report.id,
      employee_id: report.employee_id,
      employee_name: report.employee.employee_name,
      employee_role: report.employee.role,
      report_date: report.report_date,
      content: report.content,
      created_at: report.created_at,
      branch_name: report.employee.branch.branch_name,
    })) || []
  );
};

/**
 * Submit a daily report
 * @param employeeId - ID of the employee
 * @param reportDate - Date of the report
 * @param content - Report content
 * @returns The created/updated report
 */
export const submitReport = async (
  employeeId: string,
  reportDate: string,
  content: string,
) => {
  // Check if a report already exists for this date
  const { data: existingReport, error: checkError } = await supabase
    .from("report")
    .select("id")
    .eq("employee_id", employeeId)
    .eq("report_date", reportDate)
    .maybeSingle();

  if (checkError) throw checkError;

  if (existingReport) {
    // Update existing report
    const { data, error } = await supabase
      .from("report")
      .update({
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingReport.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Create new report
    const { data, error } = await supabase
      .from("report")
      .insert([
        {
          employee_id: employeeId,
          report_date: reportDate,
          content,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

/**
 * Get report by ID
 * @param reportId - ID of the report
 * @returns Report with employee and branch information
 */
export const getReportById = async (reportId: string) => {
  const { data, error } = await supabase
    .from("report")
    .select(
      `
      *,
      employee:employee_id (
        employee_name, 
        role,
        branch:branch_id (branch_name)
      )
    `,
    )
    .eq("id", reportId)
    .single();

  if (error) throw error;

  // Transform data to match expected format
  return {
    id: data.id,
    employee_id: data.employee_id,
    employee_name: data.employee.employee_name,
    employee_role: data.employee.role,
    report_date: data.report_date,
    content: data.content,
    created_at: data.created_at,
    branch_name: data.employee.branch.branch_name,
  };
};

/**
 * Get reports summary
 * @param filters - Object containing various filter options
 * @returns Summary information about reports
 */
export const getReportsSummary = async (
  filters: {
    branchId?: string;
    companyId?: string;
    startDate?: string;
    endDate?: string;
  } = {},
) => {
  // Get reports based on filters
  const reports = await getReports(filters);

  // Get unique employees
  const employeeIds = [...new Set(reports.map((r) => r.employee_id))];

  // Get unique branches
  const branchNames = [...new Set(reports.map((r) => r.branch_name))];

  return {
    totalReports: reports.length,
    employeeCount: employeeIds.length,
    branchCount: branchNames.length,
    startDate: filters.startDate,
    endDate: filters.endDate,
  };
};
