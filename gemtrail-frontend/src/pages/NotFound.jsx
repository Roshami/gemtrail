import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

      <div className="text-center">

        <p className="text-7xl sm:text-8xl font-extrabold text-green-700">
          404
        </p>

        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-900">
          Page Not Found
        </h1>

        <p className="mt-3 text-gray-600">
          Sorry, the page you are looking for does not exist.
        </p>

        <Link
          to="/home"
          className="inline-block mt-7 px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800"
        >
          Back to Home
        </Link>

      </div>

    </div>
  );
}

export default NotFound;