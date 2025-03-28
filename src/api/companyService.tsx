import supabase from "./supabase";
import bcrypt from "bcryptjs";
import { Company } from "../types/models";

export const getCompanies = async () => {
  const { data, error } = await supabase
    .from("company")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getCompanyById = async (id: string) => {
  const { data, error } = await supabase
    .from("company")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const createCompany = async (
  company_name: string,
  username: string,
  password: string,
  profile_pic: string | null,
  created_by: string,
) => {
  const password_hash = await bcrypt.hash(password, 10);

  // Create the company
  const { data: companyData, error: companyError } = await supabase
    .from("company")
    .insert([
      {
        company_name,
        username,
        password_hash,
        profile_pic,
        created_by,
      },
    ])
    .select()
    .single();

  if (companyError) throw companyError;

  // Create main branch for the company
  const { data: branchData, error: branchError } = await supabase
    .from("branch")
    .insert([
      {
        branch_name: "Main Branch",
        company_id: companyData.id,
        is_main_branch: true,
      },
    ])
    .select()
    .single();

  if (branchError) throw branchError;

  return companyData;
};

export const updateCompanyProfile = async (
  id: string,
  company_name: string,
  profile_pic: string | null,
) => {
  const { data, error } = await supabase
    .from("company")
    .update({
      company_name,
      profile_pic,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCompanyPassword = async (
  id: string,
  current_password: string,
  new_password: string,
) => {
  // First verify current password
  const { data: company, error: getError } = await supabase
    .from("company")
    .select("password_hash")
    .eq("id", id)
    .single();

  if (getError || !company) {
    throw new Error("Company not found");
  }

  const passwordMatch = await bcrypt.compare(
    current_password,
    company.password_hash,
  );
  if (!passwordMatch) {
    throw new Error("Current password is incorrect");
  }

  // Hash new password
  const password_hash = await bcrypt.hash(new_password, 10);

  // Update password
  const { data, error } = await supabase
    .from("company")
    .update({
      password_hash,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
  return true;
};

export const toggleCompanyStatus = async (id: string, is_active: boolean) => {
  // Start a transaction to update company, branches, and employees
  // Supabase doesn't directly support transactions, so we'll do these updates in sequence

  // Update company
  const { error: companyError } = await supabase
    .from("company")
    .update({
      is_active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (companyError) throw companyError;

  // Update branches
  const { error: branchError } = await supabase
    .from("branch")
    .update({
      is_active,
      updated_at: new Date().toISOString(),
    })
    .eq("company_id", id);

  if (branchError) throw branchError;

  // Update employees
  const { error: employeeError } = await supabase
    .from("employee")
    .update({
      is_active,
      updated_at: new Date().toISOString(),
    })
    .eq("company_id", id);

  if (employeeError) throw employeeError;

  return true;
};
