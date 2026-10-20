import React, { useRef } from 'react';
import { DistrictStatusHeader } from './DistrictStatusHeader.jsx';
import { LocationControls } from './LocationControls.jsx';
import { FilterBar } from './FilterBar.jsx';
import { PlacesGrid } from './PlacesGrid.jsx';

export const Places = ({
  places,
  totalInBoundary,
  activePlace,
  onSelectPlace,
  center,
  centerName,
  radiusKm,
  onRadiusChange,
  onCenterChange,
  isPickingOnMap,
  onPickOnMapToggle,
  onGpsLocate,
  onResetCenter,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  onClearFilters,
  plannedIds,
  onTogglePlan,
  onOpenDetails,
  onOpenDirections,
  onViewInPlanner,
  radarMode,
  onRadarModeChange,
  isGpsLive,
  geoError,
  onRetryGps,
  placesWithin25Count,
  userLocation,
  onOpenMapPage
}) => {
  const gridRef = useRef(null);

  return (
    <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-12">
      {/* 1. District Header & Live 25km Status Banner */}
      <DistrictStatusHeader 
        userLocation={userLocation || center}
        isGpsLive={isGpsLive}
        geoError={geoError}
        radarMode={radarMode}
        onRadarModeChange={onRadarModeChange}
        placesWithin25Count={placesWithin25Count}
        totalPlaces={totalInBoundary}
        onRetryGps={onRetryGps}
      />

      {/* 2. Location Controls */}
      <LocationControls
        center={center}
        centerName={centerName}
        radiusKm={radiusKm}
        isPickingOnMap={isPickingOnMap}
        onPickOnMapToggle={onPickOnMapToggle}
        onGpsLocate={onGpsLocate}
        onResetCenter={onResetCenter}
        isGpsLive={isGpsLive}
        radarMode={radarMode}
        onRadarModeChange={onRadarModeChange}
        placesWithin25Count={placesWithin25Count}
      />

      {/* 3. Filter Bar (Cards Only view with shortcut to open Map Page) */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        radiusKm={radiusKm}
        onRadiusChange={onRadiusChange}
        totalFilteredCount={places.length}
        onClearFilters={onClearFilters}
        radarMode={radarMode}
        onRadarModeChange={onRadarModeChange}
        placesWithin25Count={placesWithin25Count}
        onOpenMapPage={onOpenMapPage}
      />

      {/* 4. Verified Attractions Grid (Cards Only) */}
      <div ref={gridRef}>
        <PlacesGrid
          places={places}
          totalInBoundary={totalInBoundary}
          sortBy={sortBy}
          onSortChange={onSortChange}
          plannedIds={plannedIds}
          onTogglePlan={onTogglePlan}
          onOpenDetails={onOpenDetails}
          onOpenDirections={onOpenDirections}
          onViewInPlanner={onViewInPlanner}
          radarMode={radarMode}
          placesWithin25Count={placesWithin25Count}
        />
      </div>
    </div>
  );
};
