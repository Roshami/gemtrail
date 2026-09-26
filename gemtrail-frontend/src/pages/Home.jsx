import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-linear-to-br from-green-950 via-green-800 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[calc(100vh-64px)] py-16 lg:py-20">

            {/* Hero Content */}
            <div className="text-center lg:text-left">

              <p className="text-green-200 font-medium mb-4">
                Explore Ratnapura
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                Discover Your
                <span className="block text-emerald-300">
                  Perfect Day Trip
                </span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-green-100 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Explore beautiful places around Ratnapura, discover hidden
                attractions, and create your perfect one-day travel plan
                with GemTrail.
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

                <Link
                  to="/places"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white text-green-800 font-semibold rounded-lg hover:bg-green-50 transition duration-300 text-center shadow-lg"
                >
                  Explore Places
                </Link>

                <Link
                  to="/itinerary"
                  className="w-full sm:w-auto px-6 py-3.5 border border-white/50 text-white font-semibold rounded-lg hover:bg-white/10 transition duration-300 text-center"
                >
                  Plan My Day
                </Link>

              </div>

            </div>

            {/* Hero Visual */}
            <div className="flex justify-center lg:justify-end">

              <div className="relative w-full max-w-md">

                {/* Main Card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 sm:p-7 shadow-2xl">

                  <div className="aspect-4/3 rounded-2xl bg-green-700/50 flex items-center justify-center">

                    <div className="text-center">

                      <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full bg-white flex items-center justify-center shadow-xl">
                        <img
                          src="/logo.png"
                          alt="GemTrail Logo"
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                        /> 
                      
                        {/*<span className="text-5xl sm:text-6xl font-extrabold text-green-700">
                          G
                        </span>*/}
                      </div>

                      <h2 className="mt-5 text-2xl sm:text-3xl font-bold">
                        GemTrail
                      </h2>

                      <p className="mt-2 text-green-100">
                        Discover. Explore. Plan.
                      </p>

                    </div>

                  </div>

                </div>

                {/* Floating Card */}
                <div className="absolute -bottom-5 -left-3 sm:-left-8 bg-white text-gray-800 rounded-xl shadow-xl px-4 py-3">
                  <p className="text-xs text-gray-500">
                    Plan your journey
                  </p>

                  <p className="font-bold text-green-700">
                    One Day • Many Memories
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto">

            <p className="text-green-600 font-semibold">
              Why GemTrail?
            </p>

            <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
              Everything for Your Day Trip
            </h2>

            <p className="mt-4 text-gray-600">
              Find places, explore details, and plan your journey easily.
            </p>

          </div>


          {/* Feature Cards */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-green-50 border border-green-100 hover:shadow-lg transition duration-300">

              <div className="w-12 h-12 rounded-xl bg-green-700 text-white flex items-center justify-center text-2xl">
                🔍
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Discover Places
              </h3>

              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Find interesting tourist attractions around Ratnapura.
              </p>

            </div>


            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 hover:shadow-lg transition duration-300">

              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-2xl">
                🗺️
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Maps & Directions
              </h3>

              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                View locations and get directions for your selected places.
              </p>

            </div>


            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-yellow-50 border border-yellow-100 hover:shadow-lg transition duration-300">

              <div className="w-12 h-12 rounded-xl bg-yellow-500 text-white flex items-center justify-center text-2xl">
                📅
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Plan Your Day
              </h3>

              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Create a simple one-day itinerary based on your selected places.
              </p>

            </div>


            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-purple-50 border border-purple-100 hover:shadow-lg transition duration-300">

              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center text-2xl">
                💰
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Estimate Cost
              </h3>

              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Get an estimated budget for entrance fees and your day trip.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* CTA Section */}
      <section className="py-16 bg-green-800 text-white">

        <div className="max-w-4xl mx-auto px-4 text-center">

          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to Explore Ratnapura?
          </h2>

          <p className="mt-4 text-green-100">
            Start discovering amazing places and create your one-day journey.
          </p>

          <Link
            to="/places"
            className="inline-block mt-7 px-7 py-3.5 bg-white text-green-800 font-semibold rounded-lg hover:bg-green-50 transition duration-300"
          >
            Start Exploring
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Home;