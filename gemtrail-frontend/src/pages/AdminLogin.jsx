import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Backend authentication will be added later
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">

          <div className="text-center">

            <div className="w-16 h-16 mx-auto rounded-full bg-green-700 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                G
              </span>
            </div>

            <h1 className="mt-5 text-2xl sm:text-3xl font-bold text-gray-900">
              Admin Login
            </h1>

            <p className="mt-2 text-gray-500">
              Sign in to manage tourist places.
            </p>

          </div>

          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-5"
          >

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition"
            >
              Login
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;