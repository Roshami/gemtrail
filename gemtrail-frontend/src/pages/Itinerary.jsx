import { Link } from "react-router-dom";

function Itinerary() {
  const selectedPlaces = [
    {
      id: 1,
      name: "Maha Saman Devalaya",
      time: "8:00 AM",
    },
    {
      id: 2,
      name: "Ratnapura National Museum",
      time: "10:00 AM",
    },
    {
      id: 3,
      name: "Bopath Ella Waterfall",
      time: "1:00 PM",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-10">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div>
          <p className="text-green-600 font-semibold">
            Your Journey
          </p>

          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            My One-Day Plan
          </h1>

          <p className="mt-3 text-gray-600">
            Organize your selected places into a simple one-day itinerary.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Places */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-5 sm:p-7">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

              <h2 className="text-xl font-bold">
                Selected Places
              </h2>

              <button className="text-sm text-red-600 font-medium">
                Clear All
              </button>

            </div>

            <div className="mt-6 space-y-4">

              {selectedPlaces.map((place, index) => (
                <div
                  key={place.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-200 rounded-xl"
                >

                  <div className="w-10 h-10 shrink-0 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {place.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Planned time: {place.time}
                    </p>
                  </div>

                  <button className="text-red-500 text-sm font-medium self-start sm:self-center">
                    Remove
                  </button>

                </div>
              ))}

            </div>

            <Link
              to="/places"
              className="inline-block mt-6 text-green-700 font-semibold"
            >
              + Add More Places
            </Link>

          </div>

          {/* Summary */}
          <div className="bg-green-800 text-white rounded-2xl p-6 sm:p-7 h-fit">

            <h2 className="text-xl font-bold">
              Trip Summary
            </h2>

            <div className="mt-6 space-y-5">

              <div className="flex justify-between gap-4">
                <span className="text-green-200">
                  Places
                </span>
                <span className="font-semibold">
                  3
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-green-200">
                  Estimated Time
                </span>
                <span className="font-semibold">
                  8 hrs
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-green-200">
                  Estimated Distance
                </span>
                <span className="font-semibold">
                  42 km
                </span>
              </div>

              <div className="border-t border-green-600 pt-5 flex justify-between">
                <span className="font-semibold">
                  Estimated Cost
                </span>

                <span className="text-xl font-bold">
                  Rs. 1,500
                </span>
              </div>

            </div>

            <button className="w-full mt-7 bg-white text-green-800 py-3 rounded-lg font-semibold hover:bg-green-50">
              Generate My Plan
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Itinerary;