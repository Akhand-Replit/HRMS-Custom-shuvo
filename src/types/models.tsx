export interface Admin {
  id: string;
  username: string;
  profile_name: string;
  profile_pic?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  company_name: string;
  username: string;
  profile_pic?: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Branch {
  id: string;
  branch_name: string;
  company_id: string;
  is_main_branch: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  employee_name: string;
  username: string;
  profile_pic?: string;
  role: "manager" | "asst_manager" | "employee";
  company_id: string;
  branch_id: string;
  is_active: boolean;
  created_by: string;
  created_by_id: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: "branch" | "employee";
  assigned_id: string;
  assigned_by: "company" | "manager" | "asst_manager";
  assigned_by_id: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskCompletion {
  id: string;
  task_id: string;
  employee_id: string;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  employee_id: string;
  report_date: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_type: "admin" | "company" | "manager" | "asst_manager" | "employee";
  sender_id: string;
  receiver_type: "company" | "branch" | "employee";
  receiver_id: string;
  message_text: string;
  attachment_link?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserAuth {
  id: string;
  username: string;
  role: "admin" | "company" | "manager" | "asst_manager" | "employee";
  profile_pic?: string;
  company_id?: string;
  branch_id?: string;
}

// For enriched data from joins
export interface TaskWithDetails extends Task {
  branch_name?: string;
  employee_name?: string;
  completed_count?: number;
  total_count?: number;
}

export interface ReportWithDetails extends Report {
  employee_name: string;
  employee_role: string;
  branch_name: string;
}

export interface MessageWithDetails extends Message {
  sender_name: string;
  receiver_name: string;
}
