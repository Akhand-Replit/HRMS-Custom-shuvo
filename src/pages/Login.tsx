import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import loginIllustration from "../assets/login-illustration.png";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const success = await login(username, password, role);

      if (success) {
        // Redirect based on role
        if (role === "admin") navigate("/admin/dashboard");
        else if (role === "company") navigate("/company/dashboard");
        else if (role === "manager") navigate("/manager/dashboard");
        else if (role === "asst_manager") navigate("/asst-manager/dashboard");
        else navigate("/employee/dashboard");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Log In
            </h1>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div>
                  <div className="flex items-center mb-1">
                    <span className="mr-2 text-gray-600">👤</span>
                    <label
                      htmlFor="username"
                      className="font-medium text-gray-600"
                    >
                      Your Name
                    </label>
                  </div>
                  <div className="mt-1">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-1">
                    <span className="mr-2 text-gray-600">🔒</span>
                    <label
                      htmlFor="password"
                      className="font-medium text-gray-600"
                    >
                      Password
                    </label>
                  </div>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <details className="mb-4">
                    <summary className="text-sm text-gray-600 cursor-pointer">
                      Select your role
                    </summary>
                    <div className="mt-2">
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      >
                        <option value="admin">Admin</option>
                        <option value="company">Company</option>
                        <option value="employee">Employee</option>
                      </select>
                    </div>
                  </details>
                </div>

                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="remember_me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-blue-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    {isLoading ? "Logging in..." : "Log In"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-contain"
          src={loginIllustration}
          alt="Login illustration"
        />
      </div>
    </div>
  );
};

export default Login;
