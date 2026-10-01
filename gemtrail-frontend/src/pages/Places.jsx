import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  GeoJSON,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import { mask } from "@turf/turf";

import PlaceCard from "../components/PlaceCard";
import ratnapuraDistrict from "../data/ratnapuraDistrict.json";

const API_URL = "http://localhost:5000/api/places";


// --------------------------------------------------
// Fix default Leaflet marker icons
// --------------------------------------------------

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// --------------------------------------------------
// User location custom icon
// --------------------------------------------------

const userLocationIcon = L.divIcon({
  className: "user-location-marker",

  html: `
    <div class="user-marker">
      <span>🧍</span>
    </div>
  `,

  iconSize: [45, 45],
  iconAnchor: [22, 40],
  popupAnchor: [0, -40],
});


// --------------------------------------------------
// Ratnapura District center
// --------------------------------------------------

const RATNAPURA_CENTER = [6.6828, 80.3992];


// --------------------------------------------------
// Create map mask
//
// Outside Ratnapura District = grey
// Inside Ratnapura District = visible
// --------------------------------------------------

const createDistrictMask = () => {
  try {
    const worldPolygon = {
      type: "Feature",
      properties: {},

      geometry: {
        type: "Polygon",

        coordinates: [
          [
            [-180, -90],
            [180, -90],
            [180, 90],
            [-180, 90],
            [-180, -90],
          ],
        ],
      },
    };

    const districtFeatures =
      ratnapuraDistrict.type === "FeatureCollection"
        ? ratnapuraDistrict.features
        : [ratnapuraDistrict];

    const featureCollection = {
      type: "FeatureCollection",

      features: [
        worldPolygon,
        ...districtFeatures,
      ],
    };

    return mask(featureCollection);

  } catch (error) {
    console.error("Failed to create district mask:", error);
    return null;
  }
};


// Create once
const districtMask = createDistrictMask();


// --------------------------------------------------
// Map Controller
// --------------------------------------------------

function MapController({ location }) {
  const map = useMap();

  useEffect(() => {
    const resizeMap = () => {
      map.invalidateSize();
    };

    resizeMap();

    const timer = setTimeout(() => {
      map.invalidateSize();

      if (location) {
        map.flyTo(
          [location.latitude, location.longitude],
          12,
          {
            duration: 1.2,
          }
        );
      } else {
        map.setView(RATNAPURA_CENTER, 11);
      }
    }, 500);

    window.addEventListener("resize", resizeMap);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", resizeMap);
    };
  }, [location, map]);

  return null;
}


// --------------------------------------------------
// Places Page
// --------------------------------------------------

function Places() {

  // ------------------------------------------------
  // State
  // ------------------------------------------------

  const [places, setPlaces] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [radius, setRadius] = useState(25);

  const [userLocation, setUserLocation] = useState(null);

  const [loading, setLoading] = useState(true);

  const [locationLoading, setLocationLoading] = useState(true);

  const [error, setError] = useState("");

  const [locationError, setLocationError] = useState("");

  const [categories, setCategories] = useState([]);


  // ------------------------------------------------
  // Get user's current location
  // ------------------------------------------------

  useEffect(() => {

    if (!navigator.geolocation) {

      setLocationError(
        "Your browser does not support location services."
      );

      setLocationLoading(false);

      return;
    }


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

        console.error("Location error:", error);

        setLocationError(
          "Unable to get your current location. Please allow location access."
        );

        setLocationLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

  }, []);


  // ------------------------------------------------
  // Fetch categories
  // ------------------------------------------------

  useEffect(() => {

    const fetchCategories = async () => {

      try {

        const response = await fetch(
          "http://localhost:5000/api/categories"
        );

        const result = await response.json();

        if (result.success) {

          setCategories(result.data || []);

        }

      } catch (error) {

        console.error(
          "Category loading error:",
          error
        );

      }

    };

    fetchCategories();

  }, []);


  // ------------------------------------------------
  // Fetch places
  // ------------------------------------------------

  useEffect(() => {

    const fetchPlaces = async () => {

      try {

        setLoading(true);

        setError("");


        const params = new URLSearchParams();


        // Search
        if (search.trim()) {

          params.append(
            "search",
            search.trim()
          );

        }


        // Category
        if (
          category &&
          category !== "All"
        ) {

          params.append(
            "category",
            category
          );

        }


        // User location
        if (userLocation) {

          params.append(
            "latitude",
            userLocation.latitude
          );

          params.append(
            "longitude",
            userLocation.longitude
          );

          // Maximum radius sent to backend
          params.append(
            "radius",
            25
          );

        }


        const url = `${API_URL}?${params.toString()}`;


        const response = await fetch(url);


        if (!response.ok) {

          throw new Error(
            "Failed to fetch places"
          );

        }


        const result = await response.json();


        if (result.success) {

          setPlaces(result.data || []);

        } else {

          throw new Error(
            result.message ||
            "Failed to load places"
          );

        }

      } catch (error) {

        console.error(
          "Places loading error:",
          error
        );

        setError(
          "Unable to load tourist places."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchPlaces();

  }, [
    search,
    category,
    userLocation,
  ]);


  // ------------------------------------------------
  // Filter places by selected radius
  // ------------------------------------------------

  const displayedPlaces = useMemo(() => {

    let filtered = [...places];


    // ----------------------------------------------
    // Radius filtering
    // ----------------------------------------------

    if (userLocation) {

      filtered = filtered.filter((place) => {

        if (
          place.distance_km === undefined ||
          place.distance_km === null
        ) {

          return true;

        }

        return (
          Number(place.distance_km) <=
          Number(radius)
        );

      });

    }


    // ----------------------------------------------
    // Search filtering
    // ----------------------------------------------

    if (search.trim()) {

      const searchText =
        search.toLowerCase().trim();


      filtered = filtered.filter((place) => {

        return (

          place.name
            ?.toLowerCase()
            .includes(searchText)

          ||

          place.description
            ?.toLowerCase()
            .includes(searchText)

          ||

          place.location
            ?.toLowerCase()
            .includes(searchText)

        );

      });

    }


    // ----------------------------------------------
    // Category filtering
    // ----------------------------------------------

    if (
      category &&
      category !== "All"
    ) {

      filtered = filtered.filter(
        (place) =>
          place.category === category
      );

    }


    // ----------------------------------------------
    // Sort by distance
    // ----------------------------------------------

    if (userLocation) {

      filtered.sort((a, b) => {

        return (
          Number(a.distance_km || 9999) -
          Number(b.distance_km || 9999)
        );

      });

    }


    return filtered;

  }, [
    places,
    radius,
    search,
    category,
    userLocation,
  ]);


  // ------------------------------------------------
  // Clear filters
  // ------------------------------------------------

  const clearFilters = () => {

    setSearch("");

    setCategory("All");

    setRadius(25);

  };


  // ------------------------------------------------
  // Loading state
  // ------------------------------------------------

  if (
    loading &&
    places.length === 0
  ) {

    return (
      <div className="min-h-screen bg-gray-50">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="flex flex-col items-center justify-center">

            <div
              className="
                w-12
                h-12
                border-4
                border-green-200
                border-t-green-700
                rounded-full
                animate-spin
              "
            />

            <p className="mt-4 text-gray-600">
              Loading tourist places...
            </p>

          </div>

        </div>

      </div>
    );

  }


  // ------------------------------------------------
  // Main UI
  // ------------------------------------------------

  return (

    <div className="min-h-screen bg-gray-50">

      {/* ========================================= */}
      {/* Header */}
      {/* ========================================= */}

      <section className="bg-white border-b">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <div className="max-w-3xl">

            <p className="text-green-700 font-semibold text-sm uppercase tracking-wide">
              Explore Ratnapura
            </p>

            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
              Tourist Places
            </h1>

            <p className="mt-3 text-gray-600 leading-relaxed">
              Discover tourist attractions around your
              current location within Ratnapura District.
            </p>

          </div>

        </div>

      </section>


      {/* ========================================= */}
      {/* Location status */}
      {/* ========================================= */}

      {locationLoading && (

        <div className="bg-blue-50 border-b border-blue-100">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">

            <p className="text-sm text-blue-700">
              📍 Getting your current location...
            </p>

          </div>

        </div>

      )}


      {locationError && (

        <div className="bg-yellow-50 border-b border-yellow-100">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">

            <p className="text-sm text-yellow-800">
              ⚠️ {locationError}
            </p>

          </div>

        </div>

      )}


      {/* ========================================= */}
      {/* Search and filters */}
      {/* ========================================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* Search */}

            <div className="md:col-span-2">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search places
              </label>

              <div className="relative">

                <span
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                >
                  🔎
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search tourist places..."
                  className="
                    w-full
                    pl-11
                    pr-4
                    py-3
                    border
                    border-gray-200
                    rounded-xl
                    outline-none
                    focus:ring-2
                    focus:ring-green-500
                    focus:border-green-500
                  "
                />

              </div>

            </div>


            {/* Category */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="
                  w-full
                  px-4
                  py-3
                  border
                  border-gray-200
                  rounded-xl
                  outline-none
                  focus:ring-2
                  focus:ring-green-500
                  bg-white
                "
              >

                <option value="All">
                  All Categories
                </option>

                {categories.map((item) => (

                  <option
                    key={item.id}
                    value={item.name}
                  >
                    {item.name}
                  </option>

                ))}

              </select>

            </div>


            {/* Radius */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search radius
              </label>

              <select
                value={radius}
                onChange={(e) =>
                  setRadius(
                    Number(e.target.value)
                  )
                }
                className="
                  w-full
                  px-4
                  py-3
                  border
                  border-gray-200
                  rounded-xl
                  outline-none
                  focus:ring-2
                  focus:ring-green-500
                  bg-white
                "
              >

                <option value={5}>
                  Within 5 km
                </option>

                <option value={10}>
                  Within 10 km
                </option>

                <option value={15}>
                  Within 15 km
                </option>

                <option value={20}>
                  Within 20 km
                </option>

                <option value={25}>
                  Within 25 km
                </option>

              </select>

            </div>

          </div>


          {/* Filter information */}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">

            <div className="flex flex-wrap gap-2">

              <span className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                📍 Ratnapura District
              </span>

              <span className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                📏 {radius} km radius
              </span>

              <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {displayedPlaces.length} places found
              </span>

            </div>


            <button
              onClick={clearFilters}
              className="
                text-sm
                font-semibold
                text-green-700
                hover:text-green-900
              "
            >
              Clear Filters
            </button>

          </div>

        </div>

      </section>


      {/* ========================================= */}
      {/* Map */}
      {/* ========================================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div
          className="
            bg-white
            rounded-2xl
            shadow-sm
            overflow-hidden
            border
            border-gray-100
          "
        >

          <div className="h-125 md:h-150">

            <MapContainer
              center={
                userLocation
                  ? [
                      userLocation.latitude,
                      userLocation.longitude,
                    ]
                  : RATNAPURA_CENTER
              }
              zoom={11}
              scrollWheelZoom={true}
              className="w-full h-full"
            >

              {/* ----------------------------------- */}
              {/* OpenStreetMap */}
              {/* ----------------------------------- */}

              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />


              {/* ----------------------------------- */}
              {/* Map controller */}
              {/* ----------------------------------- */}

              <MapController
                location={userLocation}
              />


              {/* ----------------------------------- */}
              {/* Outside Ratnapura District mask */}
              {/* ----------------------------------- */}

              {districtMask && (

                <GeoJSON
                  data={districtMask}

                  style={{
                    fillColor: "#111827",
                    fillOpacity: 0.60,
                    color: "transparent",
                    weight: 0,
                  }}
                />

              )}


              {/* ----------------------------------- */}
              {/* Ratnapura District boundary */}
              {/* ----------------------------------- */}

              <GeoJSON
                data={ratnapuraDistrict}

                style={{
                  color: "#15803d",
                  weight: 3,
                  fillColor: "#22c55e",
                  fillOpacity: 0.05,
                }}
              />


              {/* ----------------------------------- */}
              {/* User location */}
              {/* ----------------------------------- */}

              {userLocation && (

                <>

                  <Marker
                    position={[
                      userLocation.latitude,
                      userLocation.longitude,
                    ]}
                    icon={userLocationIcon}
                  >

                    <Popup>

                      <div className="text-center">

                        <strong>
                          🧍 You are here
                        </strong>

                        <p className="text-sm text-gray-500 mt-1">
                          Your current location
                        </p>

                      </div>

                    </Popup>

                  </Marker>


                  {/* Radius circle */}

                  <Circle
                    center={[
                      userLocation.latitude,
                      userLocation.longitude,
                    ]}
                    radius={radius * 1000}

                    pathOptions={{
                      color: "#15803d",
                      fillColor: "#22c55e",
                      fillOpacity: 0.08,
                      weight: 2,
                    }}
                  />

                </>

              )}


              {/* ----------------------------------- */}
              {/* Tourist place markers */}
              {/* ----------------------------------- */}

              {displayedPlaces.map((place) => {

                if (
                  place.latitude === null ||
                  place.longitude === null ||
                  place.latitude === undefined ||
                  place.longitude === undefined
                ) {
                  return null;
                }


                return (

                  <Marker
                    key={place.id}
                    position={[
                      Number(place.latitude),
                      Number(place.longitude),
                    ]}
                  >

                    <Popup>

                      <div className="min-w-55">

                        <h3 className="font-bold text-gray-900 text-base">
                          {place.name}
                        </h3>


                        <p className="text-xs text-green-700 font-semibold mt-1">
                          {place.category}
                        </p>


                        <p className="text-sm text-gray-500 mt-2">
                          📍 {place.location}
                        </p>


                        {place.distance_km !==
                          undefined &&
                          place.distance_km !==
                            null && (

                          <p className="text-sm text-blue-600 font-semibold mt-2">
                            📏{" "}
                            {Number(
                              place.distance_km
                            ).toFixed(1)}{" "}
                            km away
                          </p>

                        )}


                        <Link
                          to={`/places/${place.id}`}
                          className="
                            block
                            mt-3
                            text-center
                            bg-green-700
                            text-white
                            px-3
                            py-2
                            rounded-lg
                            text-sm
                            font-semibold
                            hover:bg-green-800
                          "
                        >
                          View Details
                        </Link>

                      </div>

                    </Popup>

                  </Marker>

                );

              })}

            </MapContainer>

          </div>


          {/* Map legend */}

          <div className="p-4 border-t bg-white">

            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600">

              <div className="flex items-center gap-2">

                <span className="w-3 h-3 rounded-full bg-green-600"></span>

                <span>
                  Ratnapura District
                </span>

              </div>


              <div className="flex items-center gap-2">

                <span className="w-3 h-3 rounded-full bg-gray-800"></span>

                <span>
                  Outside District
                </span>

              </div>


              <div className="flex items-center gap-2">

                <span className="w-3 h-3 rounded-full bg-blue-600"></span>

                <span>
                  Your Location
                </span>

              </div>


              <div className="flex items-center gap-2">

                <span className="w-3 h-3 rounded-full bg-green-400"></span>

                <span>
                  Tourist Places
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================= */}
      {/* Places */}
      {/* ========================================= */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex items-center justify-between mb-6">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Nearby Tourist Places
            </h2>

            <p className="text-gray-500 mt-1">
              Places within {radius} km of your
              current location
            </p>

          </div>

        </div>


        {/* Error */}

        {error && (

          <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-4">

            <p className="text-red-700 text-sm">
              ⚠️ {error}
            </p>

          </div>

        )}


        {/* No places */}

        {!loading &&
          displayedPlaces.length === 0 && (

            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">

              <div className="text-5xl">
                🗺️
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-900">
                No places found
              </h3>

              <p className="mt-2 text-gray-500">
                No tourist places were found
                using your current filters.
              </p>

              <button
                onClick={clearFilters}
                className="
                  mt-5
                  px-5
                  py-3
                  bg-green-700
                  text-white
                  rounded-lg
                  font-semibold
                  hover:bg-green-800
                "
              >
                Clear Filters
              </button>

            </div>

          )}


        {/* Place cards */}

        {displayedPlaces.length > 0 && (

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-6
            "
          >

            {displayedPlaces.map((place) => (

              <div
                key={place.id}
                className="relative"
              >

                {/* Distance badge */}

                {place.distance_km !==
                  undefined &&
                  place.distance_km !== null && (

                  <div
                    className="
                      absolute
                      top-3
                      right-3
                      z-10
                      px-3
                      py-1.5
                      bg-white/95
                      backdrop-blur-sm
                      rounded-full
                      text-xs
                      font-bold
                      text-blue-700
                      shadow-sm
                    "
                  >
                    📏{" "}
                    {Number(
                      place.distance_km
                    ).toFixed(1)}{" "}
                    km
                  </div>

                )}


                <PlaceCard
                  place={place}
                />

              </div>

            ))}

          </div>

        )}

      </section>

    </div>

  );
}

export default Places;