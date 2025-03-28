import supabase from "./supabase";
import bcrypt from "bcryptjs";

export const verifyAdmin = async (username: string, password: string) => {
  const { data, error } = await supabase
    .from("admin")
    .select("id, username, profile_name, profile_pic")
    .eq("username", username)
    .single();

  if (error || !data) return null;

  // For demo, check against hardcoded password
  // In production, use proper password verification
  if (password === "admin_password") {
    return {
      id: data.id,
      username: data.username,
      profile_name: data.profile_name,
      profile_pic: data.profile_pic,
      role: "admin",
    };
  }

  return null;
};

export const verifyCompany = async (username: string, password: string) => {
  const { data, error } = await supabase
    .from("company")
    .select("id, company_name, password_hash, profile_pic, is_active")
    .eq("username", username)
    .single();

  if (error || !data || !data.is_active) return null;

  // Check password
  const passwordMatch = await bcrypt.compare(password, data.password_hash);
  if (!passwordMatch) return null;

  return {
    id: data.id,
    username,
    name: data.company_name,
    profile_pic: data.profile_pic,
    role: "company",
    company_id: data.id,
  };
};

export const verifyEmployee = async (username: string, password: string) => {
  // Get employee with company and branch active status
  const { data, error } = await supabase
    .from("employee")
    .select(
      `
      id, employee_name, password_hash, profile_pic, role, 
      company_id, branch_id, is_active,
      company!inner(is_active),
      branch!inner(is_active)
    `,
    )
    .eq("username", username)
    .single();

  if (
    error ||
    !data ||
    !data.is_active ||
    !data.company.is_active ||
    !data.branch.is_active
  ) {
    return null;
  }

  // Check password
  const passwordMatch = await bcrypt.compare(password, data.password_hash);
  if (!passwordMatch) return null;

  return {
    id: data.id,
    username,
    name: data.employee_name,
    profile_pic: data.profile_pic,
    role: data.role,
    company_id: data.company_id,
    branch_id: data.branch_id,
  };
};
