
import React, { useState, useMemo, useRef, useEffect } from 'react';

import { ThemeProvider, CssBaseline } from '@mui/material';

import { getMuiTheme } from './theme/muiTheme.js';

import { Header } from './components/Header.jsx';
import { HeroSection } from './components/HeroSection.jsx';
import { Places } from './pages/Places.jsx';
import { PlaceDetailModal } from './components/PlaceDetailModal.jsx';
import { DirectionsModal } from './components/DirectionsModal.jsx';
import { TripPlannerView } from './pages/TripPlannerView.jsx';
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
  saveStoredPlaces,
  resetStoredPlaces,
  getStoredDistrictInfo,
  saveStoredDistrictInfo,
} from './utils/placesStorage.js';

// Safely validate geographic coordinates.
const isValidCoordinate = (value, min, max) => {
  if (value === null || value === undefined || value === '') {
    return false;
  }

  const number = Number(value);

  return (
    Number.isFinite(number) &&
    number >= min &&
    number <= max
  );
};

const hasValidCoordinates = (place) => {
  return (
    place?.coordinates != null &&
    isValidCoordinate(place.coordinates.lat, -90, 90) &&
    isValidCoordinate(place.coordinates.lng, -180, 180)
  );
};

// Haversine distance calculator: returns distance in kilometers.
const calculateHaversine = (lat1, lon1, lat2, lon2) => {
  if (
    !isValidCoordinate(lat1, -90, 90) ||
    !isValidCoordinate(lon1, -180, 180) ||
    !isValidCoordinate(lat2, -90, 90) ||
    !isValidCoordinate(lon2, -180, 180)
  ) {
    return Infinity;
  }

  const R = 6371;
  const toRad = (degrees) => (degrees * Math.PI) / 180;

  const latitude1 = Number(lat1);
  const longitude1 = Number(lon1);
  const latitude2 = Number(lat2);
  const longitude2 = Number(lon2);

  const dLat = toRad(latitude2 - latitude1);
  const dLon = toRad(longitude2 - longitude1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(latitude1)) *
      Math.cos(toRad(latitude2)) *
      Math.sin(dLon / 2) ** 2;

  // Clamp floating-point rounding errors.
  const safeA = Math.min(1, Math.max(0, a));

  const c =
    2 * Math.atan2(Math.sqrt(safeA), Math.sqrt(1 - safeA));

  return Number((R * c).toFixed(2));
};

const getPlaceName = (place) =>
  typeof place?.name === 'string' ? place.name : '';

const getPlaceDescription = (place) =>
  typeof place?.shortDescription === 'string'
    ? place.shortDescription
    : '';

const getCategoryLabel = (place) =>
  typeof place?.categoryLabel === 'string'
    ? place.categoryLabel
    : '';

const getEntranceFee = (place) =>
  typeof place?.entranceFee === 'string'
    ? place.entranceFee
    : '';

const getFeeAmount = (place) =>
  parseInt(getEntranceFee(place).replace(/[^0-9]/g, ''), 10) || 0;

export default function App() {
  // --------------------------------------------------
  // Theme
  // --------------------------------------------------

  const [themeMode, setThemeMode] = useState('light');

  const muiTheme = useMemo(
    () => getMuiTheme(themeMode),
    [themeMode],
  );

  const toggleTheme = () => {
    setThemeMode((previous) =>
      previous === 'light' ? 'dark' : 'light',
    );
  };

  // --------------------------------------------------
  // Places and district information
  // --------------------------------------------------

  const [places, setPlaces] = useState(() => {
    const storedPlaces = getStoredPlaces();
    return Array.isArray(storedPlaces) ? storedPlaces : [];
  });

  const [districtInfo, setDistrictInfo] = useState(() =>
    getStoredDistrictInfo(),
  );

  const handleUpdatePlaces = (newPlaces) => {
    if (!Array.isArray(newPlaces)) {
      console.error('Invalid places data: expected an array.');
      return;
    }

    setPlaces(newPlaces);
    saveStoredPlaces(newPlaces);
  };

  const handleResetPlaces = () => {
    const defaults = resetStoredPlaces();

    setPlaces(Array.isArray(defaults) ? defaults : []);
  };

  const handleUpdateDistrictInfo = (newInfo) => {
    setDistrictInfo(newInfo);
    saveStoredDistrictInfo(newInfo);
  };

  // Report malformed place records during development.
  useEffect(() => {
    const invalidPlaces = places.filter(
      (place) => !hasValidCoordinates(place),
    );

    if (invalidPlaces.length > 0) {
      console.warn(
        'Places with missing or invalid coordinates:',
        invalidPlaces.map((place) => ({
          id: place?.id,
          name: place?.name,
          coordinates: place?.coordinates,
        })),
      );
    }
  }, [places]);

  // --------------------------------------------------
  // Admin authentication
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Navigation
  // --------------------------------------------------

  const [activeTab, setActiveTab] = useState('explore');

  // --------------------------------------------------
  // Location and radar settings
  // --------------------------------------------------

  const [center, setCenter] = useState(DISTRICT_INFO.coordinates);

  const [centerName, setCenterName] = useState(
    'Ratnapura Town Center',
  );

  const [radiusKm, setRadiusKm] = useState(25);
  const [isPickingOnMap, setIsPickingOnMap] = useState(false);

  const [radarMode, setRadarMode] = useState('radar');
  const [isGpsLive, setIsGpsLive] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [hasReceivedFirstGps, setHasReceivedFirstGps] = useState(false);

  // --------------------------------------------------
  // Search and filters
  // --------------------------------------------------

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [viewMode, setViewMode] = useState('map_and_cards');

  // --------------------------------------------------
  // Selected places and modals
  // --------------------------------------------------

  const [activePlace, setActivePlace] = useState(null);
  const [detailModalPlace, setDetailModalPlace] = useState(null);
  const [directionsModalPlace, setDirectionsModalPlace] = useState(null);

  // --------------------------------------------------
  // Planned places
  // --------------------------------------------------

  const [plannedIds, setPlannedIds] = useState([
    'bopath-ella',
    'sri-pada',
    'delgamuwa-rajamaha-viharaya',
  ]);

  const gridRef = useRef(null);

  // --------------------------------------------------
  // Continuous GPS tracking
  // --------------------------------------------------

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError(
        'Geolocation is not supported by your browser. Defaulting to Ratnapura Town Center.',
      );
      return undefined;
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
          `Your Location (${newCoords.lat.toFixed(4)}° N, ${newCoords.lng.toFixed(4)}° E)`,
        );

        setIsGpsLive(true);
        setGeoError(null);
        setHasReceivedFirstGps(true);
      },
      (error) => {
        console.warn('Geolocation watch error:', error);

        let errorMessage =
          'Location permission denied. Defaulting to Ratnapura Town Center (Clock Tower).';

        if (error.code === error.TIMEOUT) {
          errorMessage =
            'Location request timed out. Defaulting to Ratnapura Town Center.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage =
            'Location position unavailable. Defaulting to Ratnapura Town Center.';
        } else if (error.code === error.PERMISSION_DENIED) {
          errorMessage =
            'Location permission denied. Defaulting to Ratnapura Town Center.';
        }

        setGeoError(errorMessage);
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

  // --------------------------------------------------
  // Count landmarks within 25 km
  // FIX: never access coordinates without validation.
  // --------------------------------------------------

  const placesWithin25Count = useMemo(() => {
    return places.filter((place) => {
      if (!hasValidCoordinates(place)) {
        return false;
      }

      const distance = calculateHaversine(
        center?.lat,
        center?.lng,
        place.coordinates.lat,
        place.coordinates.lng,
      );

      return distance <= 25;
    }).length;
  }, [center, places]);

  // --------------------------------------------------
  // Filter, search and sort places
  // --------------------------------------------------

  const filteredPlaces = useMemo(() => {
    // Remove malformed records before calculating distances.
    let result = places
      .filter((place) => hasValidCoordinates(place))
      .map((place) => {
        const liveDistance = calculateHaversine(
          center?.lat,
          center?.lng,
          place.coordinates.lat,
          place.coordinates.lng,
        );

        return {
          ...place,
          distanceKm: liveDistance,
        };
      })
      .filter((place) => Number.isFinite(place.distanceKm));

    // Radar mode: only places within 25 km.
    if (radarMode === 'radar') {
      result = result.filter((place) => place.distanceKm <= 25);
    } else if (radiusKm < 100) {
      result = result.filter(
        (place) => place.distanceKm <= radiusKm,
      );
    }

    // Category filtering.
    if (selectedCategory !== 'all') {
      result = result.filter(
        (place) => place.category === selectedCategory,
      );
    }

    // Search filtering.
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      result = result.filter((place) => {
        return (
          getPlaceName(place).toLowerCase().includes(query) ||
          getPlaceDescription(place).toLowerCase().includes(query) ||
          getCategoryLabel(place).toLowerCase().includes(query) ||
          (typeof place.miningContext === 'string' &&
            place.miningContext.toLowerCase().includes(query))
        );
      });
    }

    // Sorting.
    result.sort((a, b) => {
      if (sortBy === 'distance') {
        return a.distanceKm - b.distanceKm;
      }

      if (sortBy === 'rating') {
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      }

      if (sortBy === 'name') {
        return getPlaceName(a).localeCompare(getPlaceName(b));
      }

      if (sortBy === 'fee') {
        return getFeeAmount(a) - getFeeAmount(b);
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

  // --------------------------------------------------
  // Planned places
  // --------------------------------------------------

  const plannedPlaces = useMemo(() => {
    return places.filter(
      (place) => plannedIds.includes(place.id),
    );
  }, [plannedIds, places]);

  const handleTogglePlan = (place) => {
    if (!place?.id) {
      return;
    }

    setPlannedIds((previous) =>
      previous.includes(place.id)
        ? previous.filter((id) => id !== place.id)
        : [...previous, place.id],
    );
  };

  // --------------------------------------------------
  // Location controls
  // --------------------------------------------------

  const handleResetCenter = () => {
    setCenter(DISTRICT_INFO.coordinates);
    setCenterName('Ratnapura Town Center');
    setIsPickingOnMap(false);
  };

  const handleGpsLocate = () => {
    if (!navigator.geolocation) {
      setCenter(DISTRICT_INFO.coordinates);
      setCenterName('Ratnapura Town Center');

      setGeoError(
        'Geolocation is not supported by your browser.',
      );

      setIsGpsLive(false);
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
          `Your Location (${newCoords.lat.toFixed(4)}° N, ${newCoords.lng.toFixed(4)}° E)`,
        );

        setIsGpsLive(true);
        setGeoError(null);
        setHasReceivedFirstGps(true);
      },
      (error) => {
        console.warn('GPS location request failed:', error);

        setCenter(DISTRICT_INFO.coordinates);
        setCenterName('Ratnapura Town Center');

        setIsGpsLive(false);

        setGeoError(
          error.code === error.TIMEOUT
            ? 'Location request timed out. Defaulting to Ratnapura Town Center.'
            : 'Unable to access your location. Defaulting to Ratnapura Town Center.',
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // --------------------------------------------------
  // Filter controls
  // --------------------------------------------------

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setRadiusKm(25);
    setRadarMode('radar');
    setSortBy('distance');
  };

  const handleScrollToGrid = () => {
    gridRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  const handleSelectAttractionByName = (name) => {
    const found = places.find(
      (place) => place.name === name,
    );

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

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

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
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          planCount={plannedIds.length}
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
          isAdminLoggedIn={adminUser?.role === 'admin'}
          onAdminLogout={handleAdminLogout}
        />

        <main
          className={`w-full pt-16 pb-20 lg:pb-0 min-h-[calc(100vh-280px)] flex-1 transition-colors duration-300 ${
            themeMode === 'dark'
              ? 'bg-[#0f172a]'
              : 'bg-[#faf6f0]'
          }`}
        >
          {/* Explore page */}
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
                    if (
                      !isValidCoordinate(coords?.lat, -90, 90) ||
                      !isValidCoordinate(coords?.lng, -180, 180)
                    ) {
                      return;
                    }

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
                if (
                  !isValidCoordinate(coords?.lat, -90, 90) ||
                  !isValidCoordinate(coords?.lng, -180, 180)
                ) {
                  return;
                }

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
            <TripPlannerView
              plannedPlaces={plannedPlaces}
              onRemoveFromPlan={(id) =>
                setPlannedIds((previous) =>
                  previous.filter((placeId) => placeId !== id),
                )
              }
              onClearPlan={() => setPlannedIds([])}
              onAddRecommended={() =>
                setPlannedIds([
                  'bopath-ella',
                  'kahawatte-mines',
                  'saman-devalaya',
                  'national-gem-museum',
                ])
              }
              onOpenDetails={setDetailModalPlace}
              onOpenDirections={setDirectionsModalPlace}
            />
          )}

          {/* Stories and guides */}
          {activeTab === 'stories' && <StoriesGuidesView />}

          {/* About Sabaragamuwa */}
          {activeTab === 'about' && <AboutSabaragamuwaView />}

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
            detailModalPlace
              ? plannedIds.includes(detailModalPlace.id)
              : false
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
