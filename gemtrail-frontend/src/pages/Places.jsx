import { useEffect, useState } from 'react';
import PlaceCard from '../components/PlaceCard';

const API_URL = 'http://localhost:5000/api/places';

function Places() {
  const [places, setPlaces] = useState([]);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [distance, setDistance] = useState('25');

  const [userLocation, setUserLocation] = useState(null);

  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState('');

  // =====================================================
  // GET USER LOCATION
  // =====================================================

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLocationLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setUserLocation({
          latitude,
          longitude,
        });

        setLocationLoading(false);
      },

      (error) => {
        console.error('Location error:', error);

        setLocationLoading(false);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError(
              'Location permission was denied. Showing available places instead.',
            );
            break;

          case error.POSITION_UNAVAILABLE:
            setError('Your location could not be determined.');
            break;

          case error.TIMEOUT:
            setError('Location request timed out.');
            break;

          default:
            setError('Unable to get your location.');
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  };

  // =====================================================
  // GET PLACES FROM BACKEND
  // =====================================================

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      setError('');

      let url = API_URL;

      // -----------------------------------------------
      // If we have user location
      // -----------------------------------------------

      if (userLocation) {
        url +=
          `?latitude=${userLocation.latitude}` +
          `&longitude=${userLocation.longitude}`;
      }

      // -----------------------------------------------
      // Category
      // -----------------------------------------------

      if (category !== 'All') {
        url += url.includes('?') ? '&' : '?';

        url += `category=${encodeURIComponent(category)}`;
      }

      // -----------------------------------------------
      // Search
      // -----------------------------------------------

      if (search.trim() !== '') {
        url += url.includes('?') ? '&' : '?';

        url += `search=${encodeURIComponent(search.trim())}`;
      }

      console.log('Fetching:', url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch places');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to load places');
      }

      setPlaces(result.data || []);
    } catch (error) {
      console.error('Places API error:', error);

      setError(
        'Unable to load places. Please make sure the backend server is running.',
      );

      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REQUEST USER LOCATION ON PAGE LOAD
  // =====================================================

  useEffect(() => {
    getUserLocation();
  }, []);

  // =====================================================
  // FETCH PLACES WHEN FILTERS / LOCATION CHANGE
  // =====================================================

  useEffect(() => {
    fetchPlaces();
  }, [userLocation, category, search]);

  // =====================================================
  // CLIENT-SIDE DISTANCE FILTER
  // =====================================================

  const displayedPlaces = places.filter((place) => {
    if (!place.distance_km) {
      return true;
    }

    return place.distance_km <= Number(distance);
  });

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setDistance('25');
  };

  // =====================================================
  // LOADING UI
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-green-200 border-t-green-700 rounded-full animate-spin mx-auto"></div>

              <p className="mt-4 text-gray-600">Loading places...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Explore Places
          </h1>

          <p className="mt-2 text-gray-600">
            Discover tourist attractions around you in the Ratnapura area.
          </p>
        </div>

        {/* ================================================= */}
        {/* LOCATION STATUS */}
        {/* ================================================= */}

        <div className="mb-6">
          {locationLoading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg px-4 py-3">
              📍 Getting your location...
            </div>
          )}

          {userLocation && !locationLoading && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3">
              📍 Showing places within 25 km of your location.
            </div>
          )}

          {!userLocation && !locationLoading && (
            <button
              onClick={getUserLocation}
              className="bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-lg font-semibold transition"
            >
              📍 Use My Location
            </button>
          )}
        </div>

        {/* ================================================= */}
        {/* ERROR */}
        {/* ================================================= */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {/* ================================================= */}
        {/* FILTER SECTION */}
        {/* ================================================= */}

        <div className="bg-white rounded-2xl shadow-sm p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* SEARCH */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search places..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* CATEGORY */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="All">All Categories</option>

                <option value="Nature">Nature</option>

                <option value="Religious">Religious</option>

                <option value="Heritage">Heritage</option>

                <option value="Wildlife">Wildlife</option>

                <option value="Food">Food</option>

                <option value="Parks">Parks</option>
              </select>
            </div>

            {/* DISTANCE */}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Distance
              </label>

              <select
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="5">Within 5 km</option>

                <option value="10">Within 10 km</option>

                <option value="15">Within 15 km</option>

                <option value="25">Within 25 km</option>
              </select>
            </div>

            {/* CLEAR */}

            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* RESULT SUMMARY */}
        {/* ================================================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Tourist Places</h2>

            <p className="text-sm text-gray-500 mt-1">
              {displayedPlaces.length} place
              {displayedPlaces.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {userLocation && (
            <div className="text-sm text-green-700 font-medium">
              📍 Within {distance} km
            </div>
          )}
        </div>

        {/* ================================================= */}
        {/* PLACES GRID */}
        {/* ================================================= */}

        {displayedPlaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPlaces.map((place) => (
              <div key={place.id} className="relative">
                <PlaceCard place={place} />

                {/* DISTANCE */}

                {place.distance_km !== undefined &&
                  place.distance_km !== null && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm text-sm font-semibold text-green-700">
                      📍 {Number(place.distance_km).toFixed(1)} km
                    </div>
                  )}
              </div>
            ))}
          </div>
        ) : (
          /* ================================================= */
          /* NO RESULTS */
          /* ================================================= */

          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-5xl mb-4">🔍</div>

            <h3 className="text-xl font-bold text-gray-900">No places found</h3>

            <p className="mt-2 text-gray-500">
              Try changing your search or filter options.
            </p>

            <button
              onClick={clearFilters}
              className="mt-5 px-5 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800 transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default Places;
