import { Link, useParams } from "react-router-dom";

function PlaceDetails() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-10">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          to="/places"
          className="inline-flex items-center text-green-700 font-medium hover:text-green-900"
        >
          ← Back to Places
        </Link>

        <div className="mt-6 bg-white rounded-2xl shadow-sm overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Image */}
            <div className="min-h-75 lg:min-h-125 bg-linear-to-br from-green-800 to-emerald-400 flex items-center justify-center">
              <span className="text-8xl">🌿</span>
            </div>

            {/* Details */}
            <div className="p-6 sm:p-8 lg:p-10">

              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                Nature
              </span>

              <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-gray-900">
                Bopath Ella Waterfall
              </h1>

              <p className="mt-3 text-gray-500">
                📍 Kuruwita, Ratnapura
              </p>

              <div className="mt-5 flex flex-wrap gap-3">

                <span className="px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg font-semibold">
                  ★ 4.7 Rating
                </span>

                <span className="px-4 py-2 bg-green-50 text-green-700 rounded-lg font-semibold">
                  Free Entry
                </span>

              </div>

              <div className="mt-7">

                <h2 className="text-xl font-bold text-gray-900">
                  About this place
                </h2>

                <p className="mt-3 text-gray-600 leading-relaxed">
                  Bopath Ella is a scenic waterfall surrounded by natural
                  greenery. It is a popular attraction for visitors looking
                  for a relaxing nature experience in the Ratnapura area.
                </p>

              </div>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">
                    Opening Hours
                  </p>
                  <p className="mt-1 font-semibold">
                    7:00 AM - 6:00 PM
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500">
                    Entrance Fee
                  </p>
                  <p className="mt-1 font-semibold">
                    Free
                  </p>
                </div>

              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">

                <button className="w-full sm:w-auto px-6 py-3 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800">
                  🗺️ Get Directions
                </button>

                <Link
                  to="/itinerary"
                  className="w-full sm:w-auto px-6 py-3 border border-green-700 text-green-700 font-semibold rounded-lg text-center hover:bg-green-50"
                >
                  + Add to Plan
                </Link>

              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default PlaceDetails;