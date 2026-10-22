import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getMuiTheme } from './theme/muiTheme.js';
import { Header } from './components/Header.jsx';
import { HeroSection } from './components/HeroSection.jsx';
import { Places } from './components/Places.jsx';
import { PlaceDetailModal } from './components/PlaceDetailModal.jsx';
import { DirectionsModal } from './components/DirectionsModal.jsx';
import { TripPlannerView } from './components/TripPlannerView.jsx';
import { GemTrailsView } from './components/GemTrailsView.jsx';
import { StoriesGuidesView } from './components/StoriesGuidesView.jsx';
import { AboutSabaragamuwaView } from './components/AboutSabaragamuwaView.jsx';
import { MapPageView } from './components/MapPageView.jsx';
import { AdminPanelView } from './components/AdminPanelView.jsx';
import { AdminLoginView } from './components/LoginView.jsx';
import { Footer } from './components/Footer.jsx';
import { MobileBottomNav } from './components/MobileBottomNav.jsx';
import { getAdminSession, logoutAdmin } from './utils/adminAuth.js';
import { DISTRICT_INFO } from './data/ratnapuraPlaces.js';
import {
  getStoredPlaces,
  saveStoredPlaces,
  resetStoredPlaces,
  getStoredDistrictInfo,
  saveStoredDistrictInfo
} from './utils/placesStorage.js';

export default function App() {
  // Theme Mode (Material UI Light / Dark mode)
  const [themeMode, setThemeMode] = useState('light');
  const muiTheme = useMemo(() => getMuiTheme(themeMode), [themeMode]);
  const toggleTheme = () => setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  // Persistent Places and District State (maintained via Admin Panel)
  const [places, setPlaces] = useState(() => getStoredPlaces());
  const [districtInfo, setDistrictInfo] = useState(() => getStoredDistrictInfo());

  const handleUpdatePlaces = (newPlaces) => {
    setPlaces(newPlaces);
    saveStoredPlaces(newPlaces);
  };

  const handleResetPlaces = () => {
    const defaults = resetStoredPlaces();
    setPlaces(defaults);
  };

  const handleUpdateDistrictInfo = (newInfo) => {
    setDistrictInfo(newInfo);
    saveStoredDistrictInfo(newInfo);
  };

  // Admin Authentication State
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

  // Navigation
  const [activeTab, setActiveTab] = useState('explore');

  // Unified Geolocation & Proximity State
  const [center, setCenter] = useState(DISTRICT_INFO.coordinates);
  const [centerName, setCenterName] = useState('Your Location (Center Point)');
  const [radiusKm, setRadiusKm] = useState(25);
  const [isPickingOnMap, setIsPickingOnMap] = useState(false);

  // Radar Proximity Mode: 'radar' (25km Live Radar, Default) | 'all' (Show All Landmarks)
  const [radarMode, setRadarMode] = useState('radar');
  const [isGpsLive, setIsGpsLive] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [hasReceivedFirstGps, setHasReceivedFirstGps] = useState(false);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('distance');
  const [viewMode, setViewMode] = useState('map_and_cards');

  // Selected Place & Modals (Starts as null so no card automatically pops up until touched)
  const [activePlace, setActivePlace] = useState(null);
  const [detailModalPlace, setDetailModalPlace] = useState(null);
  const [directionsModalPlace, setDirectionsModalPlace] = useState(null);

  // Planned / Bookmarked Places
  const [plannedIds, setPlannedIds] = useState(['bopath-ella', 'sri-pada', 'delgamuwa-rajamaha-viharaya']);

  const gridRef = useRef(null);

  // 1. Continuous Real-Time Geolocation Tracking (watchPosition with high accuracy)
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser. Defaulting to Ratnapura Town Center.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCoords = {
          lat: Number(latitude.toFixed(6)),
          lng: Number(longitude.toFixed(6))
        };
        setCenter(newCoords);
        setCenterName(`Your Location (${newCoords.lat.toFixed(4)}° N, ${newCoords.lng.toFixed(4)}° E)`);
        setIsGpsLive(true);
        setGeoError(null);
        setHasReceivedFirstGps(true);
      },
      (error) => {
        console.warn('Geolocation watch error:', error);
        let errorMsg = 'Location permission denied. Defaulting to Ratnapura Town Center (Clock Tower).';
        if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out. Defaulting to Ratnapura Town Center.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location position unavailable. Defaulting to Ratnapura Town Center.';
        }
        setGeoError(errorMsg);
        setIsGpsLive(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // 2. Haversine Formula for Client-Side Distance Calculation (km)
  const calculateHaversine = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's mean radius in km
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(2));
  };

  // Distance calculator helper between two {lat, lng} objects
  const calculateDistance = (coord1, coord2) => {
    return calculateHaversine(coord1.lat, coord1.lng, coord2.lat, coord2.lng);
  };

  // Count of landmarks within 25km of the user's moving center
  const placesWithin25Count = useMemo(() => {
    return places.filter((p) => {
      const dist = calculateHaversine(center.lat, center.lng, p.coordinates.lat, p.coordinates.lng);
      return dist <= 25;
    }).length;
  }, [center, places]);

  // Dynamic Filtering within 25km (Haversine distance recalculation whenever center updates)
  const filteredPlaces = useMemo(() => {
    let result = places.map((place) => {
      const liveDistance = calculateHaversine(center.lat, center.lng, place.coordinates.lat, place.coordinates.lng);
      return {
        ...place,
        distanceKm: liveDistance
      };
    });

    // Radar Mode Filter: Mode A ("radar") only keeps landmarks where distance <= 25km
    if (radarMode === 'radar') {
      result = result.filter((p) => p.distanceKm <= 25);
    } else if (radiusKm < 100) {
      // In "Show All Landmarks" mode, allow secondary radius filter if specified
      result = result.filter((p) => p.distanceKm <= radiusKm);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => {
        if (selectedCategory === 'waterfalls' && p.category === 'waterfalls') return true;
        if (selectedCategory === 'mines' && p.category === 'mines') return true;
        if (selectedCategory === 'heritage' && p.category === 'heritage') return true;
        if (selectedCategory === 'museums' && p.category === 'museums') return true;
        if (selectedCategory === 'tea_spice' && p.category === 'tea_spice') return true;
        return p.category === selectedCategory;
      });
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.miningContext?.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'fee') {
        const feeA = parseInt(a.entranceFee.replace(/[^0-9]/g, '')) || 0;
        const feeB = parseInt(b.entranceFee.replace(/[^0-9]/g, '')) || 0;
        return feeA - feeB;
      }
      return 0;
    });

    return result;
  }, [center, radarMode, radiusKm, selectedCategory, searchQuery, sortBy, places]);

  const plannedPlaces = useMemo(() => {
    return places.filter((p) => plannedIds.includes(p.id));
  }, [plannedIds, places]);

  const handleTogglePlan = (place) => {
    setPlannedIds((prev) =>
      prev.includes(place.id) ? prev.filter((id) => id !== place.id) : [...prev, place.id]
    );
  };

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
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newCoords = {
          lat: Number(latitude.toFixed(6)),
          lng: Number(longitude.toFixed(6))
        };
        setCenter(newCoords);
        setCenterName(`Your Location (${newCoords.lat.toFixed(4)}° N, ${newCoords.lng.toFixed(4)}° E)`);
        setIsGpsLive(true);
        setGeoError(null);
      },
      (err) => {
        console.warn('GPS location request failed:', err);
        setCenter({ lat: 6.6828, lng: 80.3992 });
        setCenterName('Ratnapura Clock Tower (GPS: 6.6828° N, 80.3992° E)');
        setGeoError('Location permission denied. Defaulting to Ratnapura Town Center.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setRadiusKm(25);
    setRadarMode('radar');
  };

  const handleScrollToGrid = () => {
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectAttractionByName = (name) => {
    const found = places.find((p) => p.name === name);
    if (found) {
      setActivePlace(found);
      setDetailModalPlace(found);
      setActiveTab('explore');
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
        themeMode === 'dark' 
          ? 'bg-[#0f172a] text-[#f8fafc] selection:bg-[#4ade80]/20 selection:text-[#ffffff]' 
          : 'bg-[#faf6f0] text-[#2e3230] selection:bg-[#4a7c59]/20 selection:text-[#1f2622]'
      }`}>
        
        {/* 1. Header with Material UI */}
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          planCount={plannedIds.length}
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
          isAdminLoggedIn={Boolean(adminUser)}
          onAdminLogout={handleAdminLogout}
        />

        {/* Main Content Area */}
        <main className={`w-full pt-16 pb-20 lg:pb-0 min-h-[calc(100vh-280px)] flex-1 transition-colors duration-300 ${
          themeMode === 'dark' ? 'bg-[#0f172a]' : 'bg-[#faf6f0]'
        }`}>
          {activeTab === 'explore' && (
            <div className="flex flex-col w-full">
              
              {/* Top Panoramic Hero Section */}
              <HeroSection
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                radiusKm={radiusKm}
                onRadiusChange={setRadiusKm}
                onExploreClick={handleScrollToGrid}
                onOpenMapClick={() => setActiveTab('map')}
              />

              {/* Places.jsx Modular Separation */}
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
                    if (name) setCenterName(name);
                  }}
                  isPickingOnMap={isPickingOnMap}
                  onPickOnMapToggle={() => setIsPickingOnMap(!isPickingOnMap)}
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

          {/* Tab: Interactive Map Page */}
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
                if (name) setCenterName(name);
              }}
              isPickingOnMap={isPickingOnMap}
              onPickOnMapToggle={() => setIsPickingOnMap(!isPickingOnMap)}
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

          {/* Tab 2: Gem Trails & Mines */}
          {activeTab === 'trails' && <GemTrailsView />}

          {/* Tab 3: Trip Planner */}
          {activeTab === 'planner' && (
            <TripPlannerView
              plannedPlaces={plannedPlaces}
              onRemoveFromPlan={(id) => setPlannedIds((prev) => prev.filter((p) => p !== id))}
              onClearPlan={() => setPlannedIds([])}
              onAddRecommended={() => setPlannedIds(['bopath-ella', 'kahawatte-mines', 'saman-devalaya', 'national-gem-museum'])}
              onOpenDetails={setDetailModalPlace}
              onOpenDirections={setDirectionsModalPlace}
            />
          )}

          {/* Tab 4: Stories & Guides */}
          {activeTab === 'stories' && <StoriesGuidesView />}

          {/* Tab 5: About Sabaragamuwa */}
          {activeTab === 'about' && <AboutSabaragamuwaView />}

          {/* Tab 6: Admin Control Panel (Protected CMS) */}
          {activeTab === 'admin' && (
            adminUser ? (
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
              <AdminLoginView
                onLoginSuccess={handleAdminLogin}
                onBackToExplore={() => setActiveTab('explore')}
              />
            )
          )}
        </main>

        {/* Footer */}
        <Footer
          onNavigateTab={setActiveTab}
          onSelectAttractionByName={handleSelectAttractionByName}
        />

        {/* Modals */}
        <PlaceDetailModal
          place={detailModalPlace}
          onClose={() => setDetailModalPlace(null)}
          isPlanned={detailModalPlace ? plannedIds.includes(detailModalPlace.id) : false}
          onTogglePlan={handleTogglePlan}
          onOpenDirections={(p) => {
            setDetailModalPlace(null);
            setDirectionsModalPlace(p);
          }}
        />

        <DirectionsModal
          place={directionsModalPlace}
          fromCenterName={centerName}
          fromCenterCoords={center}
          onClose={() => setDirectionsModalPlace(null)}
        />

        {/* Mobile Sticky Thumb-Zone Bottom Navigation */}
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
          isAdminLoggedIn={Boolean(adminUser)}
          onAdminLogout={handleAdminLogout}
        />

      </div>
    </ThemeProvider>
  );
}
