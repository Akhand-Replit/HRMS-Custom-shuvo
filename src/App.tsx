import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Layout
import AdminLayout from "./components/layout/AdminLayout";
import CompanyLayout from "./components/layout/CompanyLayout";
import ManagerLayout from "./components/layout/ManagerLayout";
import AsstManagerLayout from "./components/layout/AsstManagerLayout";
import EmployeeLayout from "./components/layout/EmployeeLayout";

// Pages
import Login from "./pages/Login";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import CompanyManagement from "./pages/admin/CompanyManagement";
import AdminMessages from "./pages/admin/Messages";
import AdminProfile from "./pages/admin/Profile";

// Company pages
import CompanyDashboard from "./pages/company/Dashboard";
import BranchManagement from "./pages/company/BranchManagement";
import CompanyEmployeeManagement from "./pages/company/EmployeeManagement";
import CompanyTaskManagement from "./pages/company/TaskManagement";
import CompanyReports from "./pages/company/Reports";
import CompanyMessages from "./pages/company/Messages";
import CompanyProfile from "./pages/company/Profile";

// Manager pages
import ManagerDashboard from "./pages/manager/Dashboard";
import ManagerEmployeeManagement from "./pages/manager/EmployeeManagement";
import ManagerTaskManagement from "./pages/manager/TaskManagement";
import ManagerReports from "./pages/manager/Reports";
import ManagerMessages from "./pages/manager/Messages";
import ManagerProfile from "./pages/manager/Profile";

// Assistant Manager pages
import AsstManagerDashboard from "./pages/asst_manager/Dashboard";
import AsstManagerEmployeeManagement from "./pages/asst_manager/EmployeeManagement";
import AsstManagerTaskManagement from "./pages/asst_manager/TaskManagement";
import AsstManagerReports from "./pages/asst_manager/Reports";
import AsstManagerMessages from "./pages/asst_manager/Messages";
import AsstManagerProfile from "./pages/asst_manager/Profile";

// Employee pages
import EmployeeDashboard from "./pages/employee/Dashboard";
import EmployeeTasks from "./pages/employee/Tasks";
import EmployeeReports from "./pages/employee/Reports";
import EmployeeMessages from "./pages/employee/Messages";
import EmployeeProfile from "./pages/employee/Profile";

// Route protection component
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles: string[];
}> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="company-management" element={<CompanyManagement />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* Company routes */}
          <Route
            path="/company"
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                <CompanyLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<CompanyDashboard />} />
            <Route path="branch-management" element={<BranchManagement />} />
            <Route
              path="employee-management"
              element={<CompanyEmployeeManagement />}
            />
            <Route path="task-management" element={<CompanyTaskManagement />} />
            <Route path="reports" element={<CompanyReports />} />
            <Route path="messages" element={<CompanyMessages />} />
            <Route path="profile" element={<CompanyProfile />} />
          </Route>

          {/* Manager routes */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute allowedRoles={["manager"]}>
                <ManagerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route
              path="employee-management"
              element={<ManagerEmployeeManagement />}
            />
            <Route path="task-management" element={<ManagerTaskManagement />} />
            <Route path="reports" element={<ManagerReports />} />
            <Route path="messages" element={<ManagerMessages />} />
            <Route path="profile" element={<ManagerProfile />} />
          </Route>

          {/* Assistant Manager routes */}
          <Route
            path="/asst-manager"
            element={
              <ProtectedRoute allowedRoles={["asst_manager"]}>
                <AsstManagerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AsstManagerDashboard />} />
            <Route
              path="employee-management"
              element={<AsstManagerEmployeeManagement />}
            />
            <Route
              path="task-management"
              element={<AsstManagerTaskManagement />}
            />
            <Route path="reports" element={<AsstManagerReports />} />
            <Route path="messages" element={<AsstManagerMessages />} />
            <Route path="profile" element={<AsstManagerProfile />} />
          </Route>

          {/* Employee routes */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <EmployeeLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<EmployeeDashboard />} />
            <Route path="tasks" element={<EmployeeTasks />} />
            <Route path="reports" element={<EmployeeReports />} />
            <Route path="messages" element={<EmployeeMessages />} />
            <Route path="profile" element={<EmployeeProfile />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
