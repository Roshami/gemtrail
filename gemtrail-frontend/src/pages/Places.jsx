import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  GeoJSON,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import { mask } from "@turf/turf";

import PlaceCard from "../components/PlaceCard";
import ratnapuraDistrict from "../data/ratnapuraDistrict.json";

const API_URL = "http://localhost:5000/api/places";


// =====================================================
// Leaflet default marker fix
// =====================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


// =====================================================
// User location icon
// =====================================================

const userLocationIcon = L.divIcon({
  className: "user-location-marker",

  html: `
    <div class="user-marker">
      <span>📍</span>
    </div>
  `,

  iconSize: [45, 45],
  iconAnchor: [22, 40],
  popupAnchor: [0, -40],
});


// =====================================================
// Selected location icon
// =====================================================

const selectedLocationIcon = L.divIcon({
  className: "selected-location-marker",

  html: `
    <div class="selected-marker">
      <span>📍</span>
    </div>
  `,

  iconSize: [45, 45],
  iconAnchor: [22, 40],
  popupAnchor: [0, -40],
});


// =====================================================
// Default Ratnapura map center
//
// This is NOT user's location.
// It is only the initial map view.
// =====================================================

const RATNAPURA_CENTER = [6.6828, 80.3992];


// =====================================================
// Create outside-district mask
// =====================================================

function createDistrictMask() {
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

    let districtFeatures = [];

    if (ratnapuraDistrict.type === "FeatureCollection") {
      districtFeatures = ratnapuraDistrict.features;
    } else {
      districtFeatures = [ratnapuraDistrict];
    }

    const collection = {
      type: "FeatureCollection",

      features: [
        worldPolygon,
        ...districtFeatures,
      ],
    };

    return mask(collection);

  } catch (error) {
    console.error(
      "District mask creation failed:",
      error
    );

    return null;
  }
}


const districtMask = createDistrictMask();


// =====================================================
// Map controller
// =====================================================

function MapController({ selectedLocation }) {
  const map = useMap();

  useEffect(() => {

    map.invalidateSize();

    const timer = setTimeout(() => {

      map.invalidateSize();

      if (selectedLocation) {

        map.flyTo(
          [
            selectedLocation.latitude,
            selectedLocation.longitude,
          ],

          12,

          {
            duration: 1.2,
          }
        );

      } else {

        map.setView(
          RATNAPURA_CENTER,
          11
        );

      }

    }, 300);

    return () => {
      clearTimeout(timer);
    };

  }, [selectedLocation, map]);

  return null;
}


// =====================================================
// Map click handler
// =====================================================

function MapClickHandler({
  pickMode,
  onLocationPick,
}) {

  useMapEvents({

    click(event) {

      if (!pickMode) {
        return;
      }

      const latitude =
        event.latlng.lat;

      const longitude =
        event.latlng.lng;

      onLocationPick({
        latitude,
        longitude,
      });

    },

  });

  return null;
}


// =====================================================
// Places Page
// =====================================================

function Places() {

  // ---------------------------------------------------
  // Places
  // ---------------------------------------------------

  const [places, setPlaces] = useState([]);


  // ---------------------------------------------------
  // Search
  // ---------------------------------------------------

  const [search, setSearch] = useState("");


  // ---------------------------------------------------
  // Category
  // ---------------------------------------------------

  const [category, setCategory] =
    useState("All");


  // ---------------------------------------------------
  // Radius
  // ---------------------------------------------------

  const [radius, setRadius] =
    useState(25);


  // ---------------------------------------------------
  // Selected location
  //
  // This is the location used for searching.
  // ---------------------------------------------------

  const [selectedLocation, setSelectedLocation] =
    useState(null);


  // ---------------------------------------------------
  // Actual browser GPS location
  // ---------------------------------------------------

  const [currentLocation, setCurrentLocation] =
    useState(null);


  // ---------------------------------------------------
  // Pick mode
  // ---------------------------------------------------

  const [pickMode, setPickMode] =
    useState(false);


  // ---------------------------------------------------
  // Loading
  // ---------------------------------------------------

  const [loading, setLoading] =
    useState(false);


  const [locationLoading, setLocationLoading] =
    useState(false);


  // ---------------------------------------------------
  // Errors
  // ---------------------------------------------------

  const [error, setError] =
    useState("");

  const [locationError, setLocationError] =
    useState("");


  // ---------------------------------------------------
  // Categories
  // ---------------------------------------------------

  const [categories, setCategories] =
    useState([]);


  // ===================================================
  // Get categories
  // ===================================================

  useEffect(() => {

    const fetchCategories = async () => {

      try {

        const response = await fetch(
          "http://localhost:5000/api/categories"
        );

        const result =
          await response.json();

        if (result.success) {

          setCategories(
            result.data || []
          );

        }

      } catch (error) {

        console.error(
          "Category error:",
          error
        );

      }

    };

    fetchCategories();

  }, []);


  // ===================================================
  // Get user's current location
  // ===================================================

  const getCurrentLocation = () => {

    setLocationError("");
    setLocationLoading(true);

    if (!navigator.geolocation) {

      setLocationError(
        "Your browser does not support location services."
      );

      setLocationLoading(false);

      return;
    }


    navigator.geolocation.getCurrentPosition(

      (position) => {

        const location = {

          latitude:
            position.coords.latitude,

          longitude:
            position.coords.longitude,

        };


        // Save actual GPS location
        setCurrentLocation(location);


        // Use GPS location for searching
        setSelectedLocation(location);


        // Exit pick mode
        setPickMode(false);


        setLocationLoading(false);

      },


      (error) => {

        console.error(
          "Geolocation error:",
          error
        );


        let message =
          "Unable to get your current location.";


        if (error.code === 1) {

          message =
            "Location permission was denied. Please allow location access in your browser.";

        }

        if (error.code === 2) {

          message =
            "Your location is currently unavailable.";

        }

        if (error.code === 3) {

          message =
            "Location request timed out. Please try again.";

        }


        setLocationError(message);

        setLocationLoading(false);

      },


      {
        enableHighAccuracy: true,

        timeout: 15000,

        maximumAge: 0,
      }
    );
  };


  // ===================================================
  // Pick location from map
  // ===================================================

  const handleLocationPick = (
    location
  ) => {

    setSelectedLocation(location);

    setPickMode(false);

    setLocationError("");

  };


  // ===================================================
  // Fetch places
  // ===================================================

  useEffect(() => {

    const fetchPlaces = async () => {

      try {

        setLoading(true);
        setError("");


        const params =
          new URLSearchParams();


        // ---------------------------------------------
        // Selected location
        // ---------------------------------------------

        if (selectedLocation) {

          params.append(
            "latitude",
            selectedLocation.latitude
          );

          params.append(
            "longitude",
            selectedLocation.longitude
          );

          params.append(
            "radius",
            radius
          );

        }


        // ---------------------------------------------
        // Search
        // ---------------------------------------------

        if (search.trim()) {

          params.append(
            "search",
            search.trim()
          );

        }


        // ---------------------------------------------
        // Category
        // ---------------------------------------------

        if (
          category &&
          category !== "All"
        ) {

          params.append(
            "category",
            category
          );

        }


        const url =
          `${API_URL}?${params.toString()}`;


        const response =
          await fetch(url);


        if (!response.ok) {

          throw new Error(
            "Failed to load places"
          );

        }


        const result =
          await response.json();


        if (!result.success) {

          throw new Error(
            result.message ||
            "Failed to load places"
          );

        }


        setPlaces(
          result.data || []
        );

      } catch (error) {

        console.error(
          "Places API error:",
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
    selectedLocation,
    radius,
    search,
    category,
  ]);


  // ===================================================
  // Frontend filtering
  // ===================================================

  const displayedPlaces =
    useMemo(() => {

      let result =
        [...places];


      // ---------------------------------------------
      // Radius
      // ---------------------------------------------

      if (selectedLocation) {

        result =
          result.filter((place) => {

            if (
              place.distance_km ===
                undefined ||
              place.distance_km ===
                null
            ) {

              return true;

            }

            return (
              Number(
                place.distance_km
              ) <= radius
            );

          });

      }


      // ---------------------------------------------
      // Search
      // ---------------------------------------------

      if (search.trim()) {

        const text =
          search
            .trim()
            .toLowerCase();


        result =
          result.filter((place) => {

            return (

              place.name
                ?.toLowerCase()
                .includes(text)

              ||

              place.description
                ?.toLowerCase()
                .includes(text)

              ||

              place.location
                ?.toLowerCase()
                .includes(text)

            );

          });

      }


      // ---------------------------------------------
      // Category
      // ---------------------------------------------

      if (
        category &&
        category !== "All"
      ) {

        result =
          result.filter(
            (place) =>
              place.category ===
              category
          );

      }


      // ---------------------------------------------
      // Distance sorting
      // ---------------------------------------------

      if (selectedLocation) {

        result.sort(
          (a, b) =>
            Number(
              a.distance_km || 9999
            ) -
            Number(
              b.distance_km || 9999
            )
        );

      }


      return result;

    }, [

      places,

      selectedLocation,

      radius,

      search,

      category,

    ]);


  // ===================================================
  // Clear filters
  // ===================================================

  const clearFilters = () => {

    setSearch("");

    setCategory("All");

    setRadius(25);

  };


  // ===================================================
  // Reset selected location
  // ===================================================

  const resetLocation = () => {

    setSelectedLocation(null);

    setPickMode(false);

  };


  // ===================================================
  // Render
  // ===================================================

  return (

    <div className="min-h-screen bg-gray-50">


      {/* ============================================ */}
      {/* Page Header */}
      {/* ============================================ */}

      <section className="bg-white border-b">

        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            py-10
          "
        >

          <p className="text-green-700 font-semibold text-sm uppercase tracking-wide">
            Explore Ratnapura
          </p>

          <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
            Tourist Places
          </h1>

          <p className="mt-3 text-gray-600 max-w-2xl">
            Find tourist places around your current
            location or choose any location on the map.
          </p>

        </div>

      </section>


      {/* ============================================ */}
      {/* Location controls */}
      {/* ============================================ */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          pt-6
        "
      >

        <div
          className="
            bg-white
            rounded-2xl
            shadow-sm
            border
            border-gray-100
            p-5
          "
        >

          <div className="flex flex-col lg:flex-row gap-4">


            {/* Current Location */}

            <button
              onClick={getCurrentLocation}
              disabled={locationLoading}

              className="
                flex-1
                flex
                items-center
                justify-center
                gap-2
                px-5
                py-3
                bg-green-700
                text-white
                rounded-xl
                font-semibold
                hover:bg-green-800
                disabled:opacity-60
                disabled:cursor-not-allowed
                transition
              "
            >

              {locationLoading
                ? "Getting Location..."
                : "📍 Use My Current Location"}

            </button>


            {/* Pick on map */}

            <button
              onClick={() =>
                setPickMode(
                  !pickMode
                )
              }

              className={`
                flex-1
                flex
                items-center
                justify-center
                gap-2
                px-5
                py-3
                rounded-xl
                font-semibold
                border
                transition

                ${
                  pickMode
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                }
              `}
            >

              🗺️{" "}
              {pickMode
                ? "Click Map to Select"
                : "Pick Location on Map"}

            </button>


            {/* Reset */}

            {selectedLocation && (

              <button
                onClick={resetLocation}

                className="
                  px-5
                  py-3
                  rounded-xl
                  font-semibold
                  text-gray-600
                  bg-gray-100
                  hover:bg-gray-200
                "
              >
                Reset Location
              </button>

            )}

          </div>


          {/* Pick mode message */}

          {pickMode && (

            <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">

              <p className="text-sm text-blue-800 font-medium">
                🗺️ Pick Location mode is active.
                Click anywhere on the map to search
                for tourist places around that location.
              </p>

            </div>

          )}


          {/* Location error */}

          {locationError && (

            <div className="mt-4 bg-yellow-50 border border-yellow-100 rounded-xl p-4">

              <p className="text-sm text-yellow-800">
                ⚠️ {locationError}
              </p>

            </div>

          )}


          {/* Selected location */}

          {selectedLocation && (

            <div className="mt-4 flex flex-wrap gap-2">

              <span className="px-3 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">

                📍 Lat:{" "}
                {selectedLocation.latitude.toFixed(5)}

              </span>

              <span className="px-3 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">

                Lng:{" "}
                {selectedLocation.longitude.toFixed(5)}

              </span>


              {currentLocation &&
                selectedLocation.latitude ===
                  currentLocation.latitude &&
                selectedLocation.longitude ===
                  currentLocation.longitude && (

                <span className="px-3 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">

                  📡 Current GPS Location

                </span>

              )}

            </div>

          )}

        </div>

      </section>


      {/* ============================================ */}
      {/* Search / filters */}
      {/* ============================================ */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-6
        "
      >

        <div
          className="
            bg-white
            rounded-2xl
            shadow-sm
            border
            border-gray-100
            p-5
          "
        >

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-4
              gap-4
            "
          >


            {/* Search */}

            <div className="md:col-span-2">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search places
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search tourist places..."
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
                "
              />

            </div>


            {/* Category */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(
                    e.target.value
                  )
                }

                className="
                  w-full
                  px-4
                  py-3
                  border
                  border-gray-200
                  rounded-xl
                  bg-white
                  outline-none
                  focus:ring-2
                  focus:ring-green-500
                "
              >

                <option value="All">
                  All Categories
                </option>

                {categories.map(
                  (item) => (

                    <option
                      key={item.id}
                      value={item.name}
                    >
                      {item.name}
                    </option>

                  )
                )}

              </select>

            </div>


            {/* Radius */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Radius
              </label>

              <select
                value={radius}
                onChange={(e) =>
                  setRadius(
                    Number(
                      e.target.value
                    )
                  )
                }

                className="
                  w-full
                  px-4
                  py-3
                  border
                  border-gray-200
                  rounded-xl
                  bg-white
                  outline-none
                  focus:ring-2
                  focus:ring-green-500
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


          {/* Filter summary */}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">

            <div className="flex flex-wrap gap-2">

              <span className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                📍 Ratnapura District
              </span>

              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                📏 {radius} km
              </span>

              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {displayedPlaces.length} places
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


      {/* ============================================ */}
      {/* Map */}
      {/* ============================================ */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
        "
      >

        <div
          className="
            bg-white
            rounded-2xl
            overflow-hidden
            shadow-sm
            border
            border-gray-100
          "
        >

          <div className="h-137.5">

            <MapContainer

              center={RATNAPURA_CENTER}

              zoom={11}

              minZoom={9}

              maxZoom={18}

              scrollWheelZoom={true}

              className="w-full h-full"
            >

              {/* OpenStreetMap */}

              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />


              {/* Map controller */}

              <MapController
                selectedLocation={
                  selectedLocation
                }
              />


              {/* Map click */}

              <MapClickHandler
                pickMode={pickMode}
                onLocationPick={
                  handleLocationPick
                }
              />


              {/* ================================= */}
              {/* Outside Ratnapura mask */}
              {/* ================================= */}

              {districtMask && (

                <GeoJSON
                  data={districtMask}

                  style={{
                    fillColor:
                      "#111827",

                    fillOpacity:
                      0.60,

                    color:
                      "transparent",

                    weight: 0,
                  }}
                />

              )}


              {/* ================================= */}
              {/* District boundary */}
              {/* ================================= */}

              <GeoJSON
                data={
                  ratnapuraDistrict
                }

                style={{
                  color:
                    "#15803d",

                  weight: 3,

                  fillColor:
                    "#22c55e",

                  fillOpacity:
                    0.05,
                }}
              />


              {/* ================================= */}
              {/* Selected location */}
              {/* ================================= */}

              {selectedLocation && (

                <>

                  <Marker
                    position={[
                      selectedLocation.latitude,
                      selectedLocation.longitude,
                    ]}

                    icon={
                      selectedLocation ===
                      currentLocation
                        ? userLocationIcon
                        : selectedLocationIcon
                    }
                  >

                    <Popup>

                      <div className="text-center">

                        <strong>
                          {selectedLocation ===
                          currentLocation
                            ? "📍 Your Current Location"
                            : "📍 Selected Location"}
                        </strong>

                        <p className="text-xs text-gray-500 mt-1">
                          Search center
                        </p>

                      </div>

                    </Popup>

                  </Marker>


                  {/* Radius */}

                  <Circle
                    center={[
                      selectedLocation.latitude,
                      selectedLocation.longitude,
                    ]}

                    radius={
                      radius * 1000
                    }

                    pathOptions={{
                      color:
                        "#15803d",

                      fillColor:
                        "#22c55e",

                      fillOpacity:
                        0.08,

                      weight: 2,
                    }}
                  />

                </>

              )}


              {/* ================================= */}
              {/* Tourist places */}
              {/* ================================= */}

              {displayedPlaces.map(
                (place) => {

                  if (
                    place.latitude ===
                      null ||
                    place.longitude ===
                      null ||
                    place.latitude ===
                      undefined ||
                    place.longitude ===
                      undefined
                  ) {

                    return null;

                  }


                  return (

                    <Marker
                      key={place.id}

                      position={[
                        Number(
                          place.latitude
                        ),

                        Number(
                          place.longitude
                        ),
                      ]}
                    >

                      <Popup>

                        <div className="min-w-55">

                          <h3 className="font-bold text-gray-900">
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
                              ).toFixed(2)}{" "}
                              km

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

                }
              )}

            </MapContainer>

          </div>


          {/* Map information */}

          <div className="p-4 border-t">

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">

              <span>
                🟢 Ratnapura District
              </span>

              <span>
                ⚫ Outside District
              </span>

              <span>
                📍 Selected Location
              </span>

              <span>
                🌿 Tourist Places
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* ============================================ */}
      {/* Places */}
      {/* ============================================ */}

      <section
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-10
        "
      >

        <div className="flex justify-between items-center mb-6">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Nearby Tourist Places
            </h2>

            <p className="text-gray-500 mt-1">

              {selectedLocation
                ? `Places within ${radius} km of the selected location`
                : "Select a location to find nearby places"}

            </p>

          </div>

        </div>


        {/* Loading */}

        {loading && (

          <div className="mb-6">

            <div className="flex items-center gap-2 text-green-700">

              <div
                className="
                  w-5
                  h-5
                  border-2
                  border-green-200
                  border-t-green-700
                  rounded-full
                  animate-spin
                "
              />

              <span className="text-sm">
                Updating tourist places...
              </span>

            </div>

          </div>

        )}


        {/* Error */}

        {error && (

          <div
            className="
              mb-6
              bg-red-50
              border
              border-red-100
              rounded-xl
              p-4
            "
          >

            <p className="text-red-700 text-sm">
              ⚠️ {error}
            </p>

          </div>

        )}


        {/* No location */}

        {!selectedLocation && (

          <div
            className="
              bg-white
              rounded-2xl
              border
              border-gray-100
              p-10
              text-center
            "
          >

            <div className="text-5xl">
              📍
            </div>

            <h3 className="mt-4 text-xl font-bold text-gray-900">
              Select a Location
            </h3>

            <p className="mt-2 text-gray-500 max-w-lg mx-auto">
              Use your current location or pick a
              location directly from the map to find
              nearby tourist places.
            </p>

          </div>

        )}


        {/* No places */}

        {selectedLocation &&
          !loading &&
          displayedPlaces.length === 0 && (

            <div
              className="
                bg-white
                rounded-2xl
                border
                border-gray-100
                p-10
                text-center
              "
            >

              <div className="text-5xl">
                🗺️
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-900">
                No places found
              </h3>

              <p className="mt-2 text-gray-500">
                Try increasing the search radius or
                selecting another location.
              </p>

            </div>

          )}


        {/* Cards */}

        {selectedLocation &&
          displayedPlaces.length > 0 && (

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                gap-6
              "
            >

              {displayedPlaces.map(
                (place) => (

                  <div
                    key={place.id}
                    className="relative"
                  >

                    {/* Distance badge */}

                    {place.distance_km !==
                      undefined &&
                      place.distance_km !==
                        null && (

                      <div
                        className="
                          absolute
                          top-3
                          right-3
                          z-10
                          px-3
                          py-1.5
                          bg-white/95
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

                )
              )}

            </div>

          )}

      </section>

    </div>

  );
}

export default Places;