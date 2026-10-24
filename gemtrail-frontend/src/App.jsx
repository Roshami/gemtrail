import React, { useState, useMemo, useRef, useEffect } from 'react';

import { ThemeProvider, CssBaseline } from '@mui/material';

import { getMuiTheme } from './theme/muiTheme.js';

import { Header } from './components/Header.jsx';
import { HeroSection } from './components/HeroSection.jsx';
import { Places } from './components/Places.jsx';
import { PlaceDetailModal } from './components/PlaceDetailModal.jsx';
import { DirectionsModal } from './components/DirectionsModal.jsx';

import AllItineraryPlans from './pages/AllItineraryPlans.jsx';
import { GemTrailsView } from './pages/GemTrailsView.jsx';
import { StoriesGuidesView } from './pages/StoriesGuidesView.jsx';
import { AboutSabaragamuwaView } from './pages/AboutSabaragamuwaView.jsx';
import { MapPageView } from './pages/MapPageView.jsx';
import AdminPanelView from './pages/AdminPanelView.jsx';
import { LoginView } from './pages/LoginView.jsx';

import { Footer } from './components/Footer.jsx';
import { MobileBottomNav } from './components/MobileBottomNav.jsx';

import { getAdminSession, logoutAdmin } from './utils/adminAuth.js';

import { DISTRICT_INFO } from './data/ratnapuraPlaces.js';

import {
  getStoredPlaces,
  resetStoredPlaces,
  getStoredDistrictInfo,
  saveStoredDistrictInfo,
} from './utils/placesStorage.js';
import UserProfileView from './pages/UserProfileView.jsx';
import BookmarkPage from './pages/BookmarkPage.jsx';

// ------------------------------------------------------
// API CONFIGURATION
// ------------------------------------------------------

// Add VITE_API_URL=http://localhost:5000 to your frontend .env
// file if your Express backend runs on port 5000.
// Leave it empty to use a Vite proxy or same-origin backend.

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000')
  .replace(/\/+$/, '')
  .replace(/\/api$/, '');

async function loadBackendData() {
  try {
    const [placesResponse, categoriesResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/api/places`),
      fetch(`${API_BASE_URL}/api/categories`),
    ]);

    if (!placesResponse.ok) {
      throw new Error(`Places API returned HTTP ${placesResponse.status}`);
    }

    if (!categoriesResponse.ok) {
      throw new Error(
        `Categories API returned HTTP ${categoriesResponse.status}`,
      );
    }

    const [placesResult, categoriesResult] = await Promise.all([
      placesResponse.json(),
      categoriesResponse.json(),
    ]);

    const placesData = placesResult.data ?? placesResult.places ?? [];
    const categoriesData =
      categoriesResult.data ?? categoriesResult.categories ?? [];

    // Continue with your existing normalization and state updates here.
    //console.log('Places loaded:', placesData);
    // console.log('Categories loaded:', categoriesData);
  } catch (error) {
    console.error('Backend loading error:', error);
  }
}

// ------------------------------------------------------
// API RESPONSE HELPERS
// ------------------------------------------------------

function getApiRows(response, key) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.[key])) {
    return response[key];
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
}

// Converts a database category name to a category key used by
// the existing frontend filters.

function normalizeCategory(value) {
  if (!value) return '';

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

// ------------------------------------------------------
// TOURIST PLACE NORMALIZATION
// ------------------------------------------------------

function normalizePlace(place, categories = []) {
  const latitude = place?.latitude ?? place?.coordinates?.lat ?? null;

  const longitude = place?.longitude ?? place?.coordinates?.lng ?? null;

  const lat = latitude === null || latitude === '' ? NaN : Number(latitude);

  const lng = longitude === null || longitude === '' ? NaN : Number(longitude);

  const hasValidCoordinates =
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180;

  const categoryId = place?.category_id ?? place?.categoryId ?? null;

  const matchedCategory = categories.find(
    (category) => String(category.id) === String(categoryId),
  );

  const categoryName =
    place?.category_name ??
    place?.categoryName ??
    matchedCategory?.name ??
    place?.categoryLabel ??
    place?.category ??
    '';

  let visitingTips = [];

  const rawTips = place?.visiting_tips ?? place?.visitingTips ?? [];

  if (Array.isArray(rawTips)) {
    visitingTips = rawTips;
  } else if (typeof rawTips === 'string') {
    try {
      const parsed = JSON.parse(rawTips);
      visitingTips = Array.isArray(parsed) ? parsed : [];
    } catch {
      visitingTips = rawTips ? [rawTips] : [];
    }
  }

  return {
    ...place,

    // Keep database IDs as strings so they are consistent across
    // database records, bookmark IDs, and component comparisons.
    id: String(place.id),

    name: place.name ?? '',

    categoryId,

    category: normalizeCategory(
      place?.category_slug ??
        place?.categorySlug ??
        place?.category_key ??
        place?.categoryKey ??
        categoryName,
    ),

    categoryLabel: categoryName,

    shortDescription: place?.short_description ?? place?.shortDescription ?? '',

    description: place?.description ?? '',

    location: place?.location ?? '',

    coordinates: hasValidCoordinates ? { lat, lng } : null,

    openingHours: place?.opening_hours ?? place?.openingHours ?? '',

    entranceFee: place?.entrance_fee ?? place?.entranceFee ?? 'Free',

    transportInfo: place?.transport_info ?? place?.transportInfo ?? '',

    travelTime: place?.travel_time ?? place?.travelTime ?? '',

    visitDuration: place?.visit_duration ?? place?.visitDuration ?? '',

    rating:
      place?.rating == null || place.rating === ''
        ? 0
        : Number(place.rating) || 0,

    district: place?.district ?? 'Ratnapura',

    imageUrl: place?.image_url ?? place?.imageUrl ?? '',

    secondaryImageUrl:
      place?.secondary_image_url ?? place?.secondaryImageUrl ?? '',

    bestTime: place?.best_time ?? place?.bestTime ?? '',

    contact: place?.contact ?? '',

    elevationMeters: place?.elevation_meters ?? place?.elevationMeters ?? null,

    miningContext: place?.mining_context ?? place?.miningContext ?? '',

    visitingTips,

    isActive: Number(place?.is_active ?? place?.isActive ?? 1) === 1,
  };
}

// ------------------------------------------------------
// COORDINATE VALIDATION
// ------------------------------------------------------

function hasValidCoordinates(place) {
  const coordinates = place?.coordinates;

  if (!coordinates) return false;

  const lat = Number(coordinates.lat);
  const lng = Number(coordinates.lng);

  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

// ------------------------------------------------------
// MAIN APP
// ------------------------------------------------------

export default function App() {
  // Theme
  const [themeMode, setThemeMode] = useState('light');

  const muiTheme = useMemo(() => getMuiTheme(themeMode), [themeMode]);

  const toggleTheme = () => {
    setThemeMode((previous) => (previous === 'light' ? 'dark' : 'light'));
  };

  // ----------------------------------------------------
  // BACKEND PLACES AND CATEGORIES
  // ----------------------------------------------------

  const [places, setPlaces] = useState(() => {
    try {
      const storedPlaces = getStoredPlaces();

      return Array.isArray(storedPlaces)
        ? storedPlaces.map((place) => normalizePlace(place))
        : [];
    } catch (error) {
      console.error('Could not read locally stored places:', error);
      return [];
    }
  });

  const [categories, setCategories] = useState([]);

  const [placesLoading, setPlacesLoading] = useState(true);

  const [apiError, setApiError] = useState('');

  const [districtInfo, setDistrictInfo] = useState(() =>
    getStoredDistrictInfo(),
  );

  // Load tourist places and categories from Express/MySQL.
  useEffect(() => {
    const controller = new AbortController();

    async function loadBackendData() {
      setPlacesLoading(true);
      setApiError('');

      try {
        const [placesResponse, categoriesResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/places`, {
            signal: controller.signal,
          }),

          fetch(`${API_BASE_URL}/api/categories`, {
            signal: controller.signal,
          }),
        ]);

        if (!placesResponse.ok) {
          throw new Error(`Places API returned HTTP ${placesResponse.status}`);
        }

        if (!categoriesResponse.ok) {
          throw new Error(
            `Categories API returned HTTP ${categoriesResponse.status}`,
          );
        }

        const placesJson = await placesResponse.json();

        const categoriesJson = await categoriesResponse.json();

        const backendCategories = getApiRows(categoriesJson, 'categories');

        const backendPlaces = getApiRows(placesJson, 'places')
          .filter((place) => Number(place?.is_active ?? 1) === 1)
          .map((place) => normalizePlace(place, backendCategories));

        setCategories(backendCategories);
        setPlaces(backendPlaces);
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }

        console.error('Backend loading error:', error);

        setApiError(
          'Unable to load tourist places from the backend. ' +
            'Check your Express server, API routes, and database connection.',
        );
      } finally {
        if (!controller.signal.aborted) {
          setPlacesLoading(false);
        }
      }
    }

    loadBackendData();

    return () => {
      controller.abort();
    };
  }, []);

  // ----------------------------------------------------
  // PLACE HANDLERS
  // ----------------------------------------------------

  // The AdminPanelView currently receives the same props as in
  // the original app. These handlers preserve local behavior.
  //
  // To persist admin changes in MySQL, connect these handlers
  // to the POST/PUT/DELETE endpoints implemented in routes/places.js.

  const handleUpdatePlaces = (newPlaces) => {
    if (!Array.isArray(newPlaces)) return;

    const normalizedPlaces = newPlaces.map((place) =>
      normalizePlace(place, categories),
    );

    setPlaces(normalizedPlaces);
  };

  const handleResetPlaces = () => {
    const defaults = resetStoredPlaces();

    if (Array.isArray(defaults)) {
      setPlaces(defaults.map((place) => normalizePlace(place, categories)));
    }
  };

  const handleUpdateDistrictInfo = (newInfo) => {
    setDistrictInfo(newInfo);
    saveStoredDistrictInfo(newInfo);
  };

  // ----------------------------------------------------
  // ADMIN AUTHENTICATION
  // ----------------------------------------------------

  const [adminUser, setAdminUser] = useState(() => {
    const session = getAdminSession();

    return session ? session.user : null;
  });

  const handleAdminLogin = (user) => {
    setAdminUser(user);
  };

  const handleAdminLogout = () => {
    logoutAdmin();
    setAdminUser(null);
  };

  // ----------------------------------------------------
  // NAVIGATION
  // ----------------------------------------------------

  const [activeTab, setActiveTab] = useState('explore');

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser =
      localStorage.getItem('user') || sessionStorage.getItem('user');

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [authToken, setAuthToken] = useState(
    () =>
      localStorage.getItem('token') || sessionStorage.getItem('token') || null,
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Visitor login success
  const handleVisitorLogin = (user) => {
    setCurrentUser(user);

    const token =
      localStorage.getItem('token') || sessionStorage.getItem('token');

    setAuthToken(token);
    setActiveTab('explore');
  };

  // Visitor logout
  const handleVisitorLogout = () => {
    setCurrentUser(null);
    setAuthToken(null);

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    setActiveTab('explore');
  };
  // ----------------------------------------------------
  // GEOLOCATION AND DISTANCE
  // ----------------------------------------------------

  const [center, setCenter] = useState(DISTRICT_INFO.coordinates);

  const [centerName, setCenterName] = useState('Your Location (Center Point)');

  const [radiusKm, setRadiusKm] = useState(25);

  const [isPickingOnMap, setIsPickingOnMap] = useState(false);

  const [radarMode, setRadarMode] = useState('radar');

  const [isGpsLive, setIsGpsLive] = useState(false);

  const [geoError, setGeoError] = useState(null);

  const [, setHasReceivedFirstGps] = useState(false);

  // ----------------------------------------------------
  // SEARCH AND FILTERING
  // ----------------------------------------------------

  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('all');

  const [sortBy, setSortBy] = useState('distance');

  const [viewMode, setViewMode] = useState('map_and_cards');

  // ----------------------------------------------------
  // SELECTED PLACES AND MODALS
  // ----------------------------------------------------

  const [activePlace, setActivePlace] = useState(null);

  const [detailModalPlace, setDetailModalPlace] = useState(null);

  const [directionsModalPlace, setDirectionsModalPlace] = useState(null);

  // ----------------------------------------------------
  // PLANNED / BOOKMARKED PLACES
  // ----------------------------------------------------

  const [plannedIds, setPlannedIds] = useState([
    'bopath-ella',
    'sri-pada',
    'delgamuwa-rajamaha-viharaya',
  ]);

  const gridRef = useRef(null);

  // ----------------------------------------------------
  // REAL-TIME GEOLOCATION TRACKING
  // ----------------------------------------------------

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError(
        'Geolocation is not supported by your browser. ' +
          'Defaulting to Ratnapura Town Center.',
      );

      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const newCoords = {
          lat: Number(latitude.toFixed(6)),
          lng: Number(longitude.toFixed(6)),
        };

        setCenter(newCoords);

        setCenterName(
          `Your Location (${newCoords.lat.toFixed(4)}° N, ` +
            `${newCoords.lng.toFixed(4)}° E)`,
        );

        setIsGpsLive(true);
        setGeoError(null);
        setHasReceivedFirstGps(true);
      },

      (error) => {
        console.warn('Geolocation watch error:', error);

        let errorMsg =
          'Location permission denied. Defaulting to Ratnapura Town Center.';

        if (error.code === error.TIMEOUT) {
          errorMsg =
            'Location request timed out. Defaulting to Ratnapura Town Center.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg =
            'Location position unavailable. Defaulting to Ratnapura Town Center.';
        }

        setGeoError(errorMsg);
        setIsGpsLive(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // ----------------------------------------------------
  // HAVERSINE DISTANCE CALCULATION
  // ----------------------------------------------------

  const calculateHaversine = (lat1, lon1, lat2, lon2) => {
    const values = [lat1, lon1, lat2, lon2].map(Number);

    if (!values.every(Number.isFinite)) {
      return Infinity;
    }

    const [latitude1, longitude1, latitude2, longitude2] = values;

    const R = 6371;

    const toRad = (degrees) => (degrees * Math.PI) / 180;

    const dLat = toRad(latitude2 - latitude1);

    const dLon = toRad(longitude2 - longitude1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(latitude1)) *
        Math.cos(toRad(latitude2)) *
        Math.sin(dLon / 2) ** 2;

    const safeA = Math.min(1, Math.max(0, a));

    const c = 2 * Math.atan2(Math.sqrt(safeA), Math.sqrt(1 - safeA));

    return Number((R * c).toFixed(2));
  };

  const calculateDistance = (coord1, coord2) => {
    if (!coord1 || !coord2) {
      return Infinity;
    }

    return calculateHaversine(coord1.lat, coord1.lng, coord2.lat, coord2.lng);
  };

  // ----------------------------------------------------
  // LANDMARK COUNT WITHIN 25 KM
  // ----------------------------------------------------

  const placesWithin25Count = useMemo(() => {
    return places.filter((place) => {
      if (!hasValidCoordinates(place)) {
        return false;
      }

      const distance = calculateHaversine(
        center.lat,
        center.lng,
        place.coordinates.lat,
        place.coordinates.lng,
      );

      return distance <= 25;
    }).length;
  }, [center, places]);

  // ----------------------------------------------------
  // FILTERED AND SORTED PLACES
  // ----------------------------------------------------

  const filteredPlaces = useMemo(() => {
    // Exclude records with missing or invalid coordinates
    // before using them for map or distance calculations.
    let result = places.filter(hasValidCoordinates).map((place) => {
      const liveDistance = calculateHaversine(
        center.lat,
        center.lng,
        place.coordinates.lat,
        place.coordinates.lng,
      );

      return {
        ...place,
        distanceKm: liveDistance,
      };
    });

    // Radar / radius filtering
    if (radarMode === 'radar') {
      result = result.filter((place) => place.distanceKm <= 25);
    } else if (radiusKm < 100) {
      result = result.filter((place) => place.distanceKm <= radiusKm);
    }

    // Category filtering
    if (selectedCategory !== 'all') {
      result = result.filter((place) => {
        const placeCategory = normalizeCategory(place.category);

        const selected = normalizeCategory(selectedCategory);

        return (
          placeCategory === selected ||
          String(place.categoryId) === String(selectedCategory)
        );
      });
    }

    // Search filtering
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();

      result = result.filter((place) => {
        const searchableFields = [
          place.name,
          place.shortDescription,
          place.categoryLabel,
          place.location,
          place.district,
          place.miningContext,
        ];

        return searchableFields.some((field) =>
          String(field ?? '')
            .toLowerCase()
            .includes(query),
        );
      });
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'distance') {
        return a.distanceKm - b.distanceKm;
      }

      if (sortBy === 'rating') {
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      }

      if (sortBy === 'name') {
        return String(a.name ?? '').localeCompare(String(b.name ?? ''));
      }

      if (sortBy === 'fee') {
        const feeA =
          parseInt(String(a.entranceFee ?? '').replace(/[^0-9]/g, ''), 10) || 0;

        const feeB =
          parseInt(String(b.entranceFee ?? '').replace(/[^0-9]/g, ''), 10) || 0;

        return feeA - feeB;
      }

      return 0;
    });

    return result;
  }, [
    center,
    radarMode,
    radiusKm,
    selectedCategory,
    searchQuery,
    sortBy,
    places,
  ]);

  // ----------------------------------------------------
  // PLANNED PLACES
  // ----------------------------------------------------

  const plannedPlaces = useMemo(() => {
    return places.filter((place) => plannedIds.includes(place.id));
  }, [plannedIds, places]);

  const handleTogglePlan = (place) => {
    setPlannedIds((previous) =>
      previous.includes(place.id)
        ? previous.filter((id) => id !== place.id)
        : [...previous, place.id],
    );
  };

  // ----------------------------------------------------
  // MAP CENTER HANDLERS
  // ----------------------------------------------------

  const handleResetCenter = () => {
    setCenter(DISTRICT_INFO.coordinates);

    setCenterName('Ratnapura Town Center');

    setIsPickingOnMap(false);
  };

  const handleGpsLocate = () => {
    if (!navigator.geolocation) {
      setCenter({ lat: 6.6828, lng: 80.3992 });

      setCenterName('Ratnapura Clock Tower (GPS: 6.6828° N, 80.3992° E)');

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const newCoords = {
          lat: Number(latitude.toFixed(6)),
          lng: Number(longitude.toFixed(6)),
        };

        setCenter(newCoords);

        setCenterName(
          `Your Location (${newCoords.lat.toFixed(4)}° N, ` +
            `${newCoords.lng.toFixed(4)}° E)`,
        );

        setIsGpsLive(true);
        setGeoError(null);
      },

      (error) => {
        console.warn('GPS location request failed:', error);

        setCenter({ lat: 6.6828, lng: 80.3992 });

        setCenterName('Ratnapura Clock Tower (GPS: 6.6828° N, 80.3992° E)');

        setGeoError(
          'Location permission denied. Defaulting to Ratnapura Town Center.',
        );
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // ----------------------------------------------------
  // FILTER AND SCROLL HANDLERS
  // ----------------------------------------------------

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setRadiusKm(25);
    setRadarMode('radar');
  };

  const handleScrollToGrid = () => {
    if (gridRef.current) {
      gridRef.current.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

  const handleSelectAttractionByName = (name) => {
    const found = places.find((place) => place.name === name);

    if (found) {
      setActivePlace(found);
      setDetailModalPlace(found);
      setActiveTab('explore');

      window.scrollTo({
        top: 400,
        behavior: 'smooth',
      });
    }
  };

  // ----------------------------------------------------
  // RENDER
  // ----------------------------------------------------

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />

      <div
        className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
          themeMode === 'dark'
            ? 'bg-[#0f172a] text-[#f8fafc] selection:bg-[#4ade80]/20 selection:text-[#ffffff]'
            : 'bg-[#faf6f0] text-[#2e3230] selection:bg-[#4a7c59]/20 selection:text-[#1f2622]'
        }`}
      >
        {/* Header */}
        <Header
          activeTab={activeTab}
          onTabChange={handleTabChange}
          planCount={plannedIds.length}
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
          onProfileClick={() => setActiveTab('profile')}
          isAdminLoggedIn={adminUser?.role === 'admin'}
          onAdminLogout={handleAdminLogout}
          currentUser={currentUser}
          onLogout={handleVisitorLogout}
          authToken={authToken}
        />

        {/* Main content */}
        <main
          className={`w-full pt-16 pb-20 lg:pb-0 min-h-[calc(100vh-280px)] flex-1 transition-colors duration-300 ${
            themeMode === 'dark' ? 'bg-[#0f172a]' : 'bg-[#faf6f0]'
          }`}
        >
          {/* Backend loading and error messages */}
          {placesLoading && (
            <div role="status" className="p-4 text-center">
              Loading tourist places...
            </div>
          )}

          {apiError && (
            <div
              role="alert"
              className="mx-4 my-3 rounded-lg border border-red-300 bg-red-50 p-4 text-red-700"
            >
              <p>{apiError}</p>

              <button
                type="button"
                className="mt-2 underline"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          {/* Explore tab */}
          {activeTab === 'explore' && (
            <div className="flex flex-col w-full">
              <HeroSection
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                radiusKm={radiusKm}
                onRadiusChange={setRadiusKm}
                onExploreClick={handleScrollToGrid}
                onOpenMapClick={() => setActiveTab('map')}
              />

              <div ref={gridRef} className="w-full pt-4">
                <Places
                  places={filteredPlaces}
                  totalInBoundary={places.length}
                  activePlace={activePlace}
                  onSelectPlace={setActivePlace}
                  center={center}
                  centerName={centerName}
                  radiusKm={radiusKm}
                  onRadiusChange={setRadiusKm}
                  onCenterChange={(coords, name) => {
                    setCenter(coords);

                    if (name) {
                      setCenterName(name);
                    }
                  }}
                  isPickingOnMap={isPickingOnMap}
                  onPickOnMapToggle={() =>
                    setIsPickingOnMap((previous) => !previous)
                  }
                  onGpsLocate={handleGpsLocate}
                  onResetCenter={handleResetCenter}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  onClearFilters={handleClearFilters}
                  plannedIds={plannedIds}
                  onTogglePlan={handleTogglePlan}
                  onOpenDetails={setDetailModalPlace}
                  onOpenDirections={setDirectionsModalPlace}
                  onViewInPlanner={() => setActiveTab('planner')}
                  radarMode={radarMode}
                  onRadarModeChange={setRadarMode}
                  isGpsLive={isGpsLive}
                  geoError={geoError}
                  onRetryGps={handleGpsLocate}
                  placesWithin25Count={placesWithin25Count}
                  userLocation={center}
                  onOpenMapPage={() => setActiveTab('map')}
                />
              </div>
            </div>
          )}

          {/* Interactive map */}
          {activeTab === 'map' && (
            <MapPageView
              places={filteredPlaces}
              totalInBoundary={places.length}
              activePlace={activePlace}
              onSelectPlace={setActivePlace}
              center={center}
              centerName={centerName}
              radiusKm={radiusKm}
              onRadiusChange={setRadiusKm}
              onCenterChange={(coords, name) => {
                setCenter(coords);

                if (name) {
                  setCenterName(name);
                }
              }}
              isPickingOnMap={isPickingOnMap}
              onPickOnMapToggle={() =>
                setIsPickingOnMap((previous) => !previous)
              }
              onGpsLocate={handleGpsLocate}
              onResetCenter={handleResetCenter}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              plannedIds={plannedIds}
              onTogglePlan={handleTogglePlan}
              onOpenDetails={setDetailModalPlace}
              onOpenDirections={setDirectionsModalPlace}
              radarMode={radarMode}
              onRadarModeChange={setRadarMode}
              isGpsLive={isGpsLive}
              geoError={geoError}
              placesWithin25Count={placesWithin25Count}
              onClearFilters={handleClearFilters}
              onNavigateToExplore={() => setActiveTab('explore')}
            />
          )}

          {/* Gem trails and mines */}
          {activeTab === 'trails' && <GemTrailsView />}

          {/* Trip planner */}
          {activeTab === 'planner' && (
            <AllItineraryPlans
              places={places}
              plannedIds={plannedIds}
              setPlannedIds={setPlannedIds}
              onSelectPlace={setActivePlace}
              onOpenDetails={setDetailModalPlace}
              onOpenDirections={setDirectionsModalPlace}
            />
          )}

          {activeTab === 'trip-planner' && (
            <AllItineraryPlans
              places={places}
              plannedIds={plannedIds}
              setPlannedIds={setPlannedIds}
              onSelectPlace={setActivePlace}
              onOpenDetails={setDetailModalPlace}
              onOpenDirections={setDirectionsModalPlace}
            />
          )}

          {/* Stories and guides */}
          {activeTab === 'stories' && <StoriesGuidesView />}

          {/* About Sabaragamuwa */}
          {activeTab === 'about' && <AboutSabaragamuwaView />}

          {/* Bookmarks / favorited places */}
          {activeTab === 'bookmarks' && <BookmarkPage />}

          {/* User profile */}
          {activeTab === 'profile' && (
            <UserProfileView onBack={() => setActiveTab('explore')} />
          )}

          {/* Admin panel */}
          {activeTab === 'admin' &&
            (adminUser?.role === 'admin' ? (
              <AdminPanelView
                places={places}
                onUpdatePlaces={handleUpdatePlaces}
                districtInfo={districtInfo}
                onUpdateDistrictInfo={handleUpdateDistrictInfo}
                onResetPlaces={handleResetPlaces}
                adminUser={adminUser}
                onLogout={handleAdminLogout}
                onNavigateToExplore={() => setActiveTab('explore')}
                onNavigateToMap={() => setActiveTab('map')}
                onPreviewPlace={(place) => {
                  setActivePlace(place);
                  setDetailModalPlace(place);
                }}
              />
            ) : (
              <LoginView
                onLoginSuccess={handleAdminLogin}
                onUserLoginSuccess={handleVisitorLogin}
                onBackToExplore={() => setActiveTab('explore')}
              />
            ))}
        </main>

        {/* Footer */}
        <Footer
          onNavigateTab={setActiveTab}
          onSelectAttractionByName={handleSelectAttractionByName}
        />

        {/* Place details modal */}
        <PlaceDetailModal
          place={detailModalPlace}
          onClose={() => setDetailModalPlace(null)}
          isPlanned={
            detailModalPlace ? plannedIds.includes(detailModalPlace.id) : false
          }
          onTogglePlan={handleTogglePlan}
          onOpenDirections={(place) => {
            setDetailModalPlace(null);
            setDirectionsModalPlace(place);
          }}
        />

        {/* Directions modal */}
        <DirectionsModal
          place={directionsModalPlace}
          fromCenterName={centerName}
          fromCenterCoords={center}
          onClose={() => setDirectionsModalPlace(null)}
        />

        {/* Mobile bottom navigation */}
        <MobileBottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          planCount={plannedIds.length}
          radarMode={radarMode}
          onRadarModeChange={setRadarMode}
          placesWithin25Count={placesWithin25Count}
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
          onScrollToMap={() => setActiveTab('map')}
          isAdminLoggedIn={adminUser?.role === 'admin'}
          onAdminLogout={handleAdminLogout}
        />
      </div>
    </ThemeProvider>
  );
}
