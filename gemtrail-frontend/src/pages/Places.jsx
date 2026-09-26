import { useState } from "react";
import PlaceCard from "../components/PlaceCard";
import places from "../data/places";

function Places() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredPlaces = places.filter((place) => {

    const searchText = search.toLowerCase();

    const matchesSearch =
      place.name.toLowerCase().includes(searchText) ||
      place.location.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" ||
      place.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-10">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center">

          <p className="text-green-600 font-semibold">
            Explore Ratnapura
          </p>

          <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-gray-900">
            Tourist Places
          </h1>

          <p className="mt-3 max-w-2xl mx-auto text-gray-600">
            Discover beautiful places, historical sites and natural
            attractions around Ratnapura.
          </p>

        </div>

        {/* Search & Filter */}
        <div className="mt-8 bg-white p-4 sm:p-6 rounded-2xl shadow-sm">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Search */}
            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Places
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by place or location..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />

            </div>

            {/* Category */}
            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="All">All Categories</option>
                <option value="Nature">Nature</option>
                <option value="Religious">Religious</option>
                <option value="Heritage">Heritage</option>
                <option value="Wildlife">Wildlife</option>
                <option value="Food">Food</option>
              </select>

            </div>

          </div>

        </div>

        {/* Results */}
        <div className="mt-8">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">

            <h2 className="text-lg font-semibold text-gray-900">
              Tourist Attractions
            </h2>

            <p className="text-sm text-gray-500">
              {filteredPlaces.length} places found
            </p>

          </div>

          {/* Cards */}
          {filteredPlaces.length > 0 ? (

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                />
              ))}

            </div>

          ) : (

            <div className="bg-white rounded-2xl p-10 text-center">

              <div className="text-5xl">
                🔍
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-900">
                No places found
              </h3>

              <p className="mt-2 text-gray-500">
                Try another search or category.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Places;