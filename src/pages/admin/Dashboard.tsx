import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageTitle from "../../components/layout/PageTitle";
import { getCompanies } from "../../api/companyService";
import { getBranches } from "../../api/branchService";
import { getEmployees } from "../../api/employeeService";
import { Company } from "../../types/models";

const AdminDashboard: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalBranches, setTotalBranches] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeCompanies, setActiveCompanies] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch companies
        const companiesData = await getCompanies();
        setCompanies(companiesData);

        // Count active companies
        const active = companiesData.filter((c) => c.is_active).length;
        setActiveCompanies(active);

        // Get branches and employees count
        let branchCount = 0;
        let employeeCount = 0;

        for (const company of companiesData) {
          const branches = await getBranches(company.id);
          branchCount += branches.length;

          const employees = await getEmployees(company.id);
          employeeCount += employees.length;
        }

        setTotalBranches(branchCount);
        setTotalEmployees(employeeCount);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <PageTitle
        title="Admin Dashboard"
        description="Overview of system statistics"
        icon="🏠"
      />

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            System Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-500">Total Companies</div>
              <div className="text-2xl font-semibold">{companies.length}</div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-500">Active Companies</div>
              <div className="text-2xl font-semibold">{activeCompanies}</div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-500">Total Branches</div>
              <div className="text-2xl font-semibold">{totalBranches}</div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-500">Total Employees</div>
              <div className="text-2xl font-semibold">{totalEmployees}</div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Companies
          </h2>

          <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
            {companies.length > 0 ? (
              companies.slice(0, 5).map((company, index) => (
                <React.Fragment key={company.id}>
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {company.company_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Username: {company.username}
                        </p>
                      </div>

                      <div className="flex-shrink-0 flex flex-col items-end">
                        <div className="mb-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              company.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {company.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <Link
                          to={`/admin/company-management?view=${company.id}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                  {index < Math.min(companies.length, 5) - 1 && (
                    <div className="border-t border-gray-200"></div>
                  )}
                </React.Fragment>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No companies found. Create your first company from the Company
                Management page.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
