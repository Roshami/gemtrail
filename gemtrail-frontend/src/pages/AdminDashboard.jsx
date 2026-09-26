import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-green-600 font-semibold">Administration</p>

            <h1 className="mt-1 text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>

          <Link
            to="/home"
            className="px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium text-center"
          >
            View Website
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Total Places</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">10</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Categories</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">5</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Rated Places</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">8</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-gray-500 text-sm">Admin Users</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">1</p>
          </div>
        </div>

        {/* Management */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b">
            <h2 className="text-xl font-bold">Tourist Place Management</h2>

            <p className="mt-1 text-sm text-gray-500">
              Add, edit or delete tourist places.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-175">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    Place
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    Category
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    Rating
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="px-6 py-4 font-medium">Bopath Ella</td>

                  <td className="px-6 py-4">Nature</td>

                  <td className="px-6 py-4">★ 4.7</td>

                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button className="text-blue-600">Edit</button>

                      <button className="text-red-600">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-5">
            <button className="w-full sm:w-auto px-5 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800">
              + Add Tourist Place
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
