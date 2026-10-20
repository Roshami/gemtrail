import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Plus, 
  Minus, 
  MapPin, 
  Check, 
  Eye, 
  Compass, 
  Navigation, 
  Layers, 
  Fullscreen 
} from 'lucide-react';

// Accurate outer boundary polygon for Ratnapura District in Sabaragamuwa Province
const RATNAPURA_BOUNDARY_COORDS = [
  [6.8800, 80.3100],
  [6.8950, 80.4500],
  [6.8200, 80.5200],
  [6.8250, 80.7950],
  [6.7500, 80.8400],
  [6.6500, 80.8950],
  [6.4900, 80.9300],
  [6.4200, 80.9100],
  [6.3200, 80.8800],
  [6.3200, 80.7500],
  [6.3600, 80.6500],
  [6.4000, 80.4500],
  [6.4800, 80.3200],
  [6.6200, 80.2500],
  [6.7500, 80.2600],
  [6.8800, 80.3100]
];

export const PlacesMap = ({
  places,
  activePlace,
  onSelectPlace,
  center,
  centerName,
  radiusKm,
  onCenterChange,
  isPickingOnMap,
  onPickOnMapToggle,
  plannedIds = [],
  onTogglePlan,
  onOpenDetails,
  onOpenDirections,
  radarMode = 'radar',
  onRadarModeChange,
  isGpsLive = false,
  placesWithin25Count = 0,
  onGpsLocate
}) => {
  const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const markersLayerRef = useRef(null);
  const circlesLayerRef = useRef(null);
  const centerMarkerRef = useRef(null);

  const [mapLayer, setMapLayer] = useState('terrain');
  const [currentZoom, setCurrentZoom] = useState(10);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Tile layer URLs
  const TILE_URLS = {
    terrain: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'Map: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    },
    streets: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Sabaragamuwa GIS'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP'
    }
  };

  const getCategoryPinConfig = (category) => {
    switch (category) {
      case 'waterfalls':
        return { bg: '#0284c7', icon: 'water_drop' };
      case 'nature':
        return { bg: '#16a34a', icon: 'forest' };
      case 'mines':
        return { bg: '#d97706', icon: 'diamond' };
      case 'heritage':
        return { bg: '#b45309', icon: 'temple_buddhist' };
      case 'museums':
        return { bg: '#7e22ce', icon: 'museum' };
      case 'tea_spice':
        return { bg: '#059669', icon: 'eco' };
      default:
        return { bg: '#4a7c59', icon: 'pin_drop' };
    }
  };

  // 1. Initialize Leaflet Map once
  useEffect(() => {
    if (!mapElementRef.current || mapInstanceRef.current) return;

    const map = L.map(mapElementRef.current, {
      center: [center.lat, center.lng],
      zoom: 10,
      zoomControl: false,
      attributionControl: true
    });

    const initialTile = L.tileLayer(TILE_URLS.terrain.url, {
      maxZoom: 17,
      attribution: TILE_URLS.terrain.attribution
    }).addTo(map);

    tileLayerRef.current = initialTile;

    const circlesGroup = L.layerGroup().addTo(map);
    circlesLayerRef.current = circlesGroup;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // District Boundary Polygon
    L.polygon(RATNAPURA_BOUNDARY_COORDS, {
      color: '#4a7c59',
      weight: 2.5,
      dashArray: '8, 5',
      fillColor: '#4a7c59',
      fillOpacity: 0.05
    }).addTo(map);

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    mapInstanceRef.current = map;

    // Ensure map tiles calculate container bounds properly
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 250);

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Handle map layer tile change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const newConfig = TILE_URLS[mapLayer];
    const newTile = L.tileLayer(newConfig.url, {
      maxZoom: 18,
      attribution: newConfig.attribution
    }).addTo(map);

    tileLayerRef.current = newTile;
  }, [mapLayer]);

  // 3. Handle Center & 25km Dynamic Radar Circle update
  useEffect(() => {
    if (!mapInstanceRef.current || !circlesLayerRef.current) return;
    const map = mapInstanceRef.current;
    const circlesGroup = circlesLayerRef.current;
    circlesGroup.clearLayers();

    const centerLatLng = [center.lat, center.lng];

    // Inner 10km proximity reference circle
    L.circle(centerLatLng, {
      radius: 10000,
      color: '#0284c7',
      weight: 1,
      dashArray: '4, 4',
      fillColor: 'transparent',
      fillOpacity: 0
    }).addTo(circlesGroup);

    // 25km Dynamic Radar Circle (radius: 25,000 meters) with visible boundary and light fill color
    L.circle(centerLatLng, {
      radius: 25000,
      color: '#2563eb', // visible blue boundary
      weight: 2.5,
      dashArray: '6, 6',
      fillColor: '#3b82f6', // light fill color
      fillOpacity: 0.12
    }).addTo(circlesGroup);

    // If viewing in "Show All" with custom radius > 25km
    if (radarMode === 'all' && radiusKm > 25 && radiusKm < 100) {
      L.circle(centerLatLng, {
        radius: radiusKm * 1000,
        color: '#4a7c59',
        weight: 1.5,
        dashArray: '4, 4',
        fillColor: '#4a7c59',
        fillOpacity: 0.05
      }).addTo(circlesGroup);
    }

    // Distinctive Pulse / Circle Marker labeled "Your Location (Center Point)"
    if (centerMarkerRef.current) {
      map.removeLayer(centerMarkerRef.current);
    }

    const centerDivIcon = L.divIcon({
      className: 'custom-user-live-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -50%); pointer-events: auto;">
          <!-- Dual continuous pulsating radar rings -->
          <div class="live-pulse-ring"></div>
          <div class="live-pulse-ring-delayed"></div>
          
          <!-- Distinctive Center Pin Head -->
          <div style="
            position: relative;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            background: #2563eb;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 16px rgba(37, 99, 235, 0.8), 0 3px 8px rgba(0,0,0,0.35);
            border: 2.5px solid #ffffff;
            z-index: 10;
          ">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: #ffffff;"></div>
          </div>
          
          <!-- Distinctive Label -->
          <span style="
            margin-top: 5px;
            background: rgba(15, 23, 42, 0.95);
            color: #ffffff;
            padding: 3px 9px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
            box-shadow: 0 2px 8px rgba(0,0,0,0.35);
            border: 1px solid rgba(255,255,255,0.25);
            letter-spacing: -0.2px;
            z-index: 10;
          ">
            Your Location (Center Point)
          </span>
        </div>
      `,
      iconSize: [26, 26]
    });

    const newCenterMarker = L.marker(centerLatLng, {
      icon: centerDivIcon,
      zIndexOffset: 1000
    }).addTo(map);

    centerMarkerRef.current = newCenterMarker;
  }, [center, centerName, radiusKm, radarMode]);

  // 4. Handle Markers Update (Dynamically filtered by 25km boundary and recalculating on movement)
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    // In 25km Live Radar mode, strictly enforce distance <= 25km; in Show All, show all places
    const visiblePlaces = radarMode === 'radar'
      ? places.filter((p) => p.distanceKm <= 25)
      : places;

    visiblePlaces.forEach((place) => {
      const isSelected = activePlace?.id === place.id;
      const isPlanned = plannedIds.includes(place.id);
      const pinConfig = getCategoryPinConfig(place.category);

      const divIcon = L.divIcon({
        className: 'custom-place-pin',
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -100%);">
            <div style="
              width: ${isSelected ? '36px' : '30px'};
              height: ${isSelected ? '36px' : '30px'};
              border-radius: 50%;
              background: ${pinConfig.bg};
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 4px 12px rgba(0,0,0,0.35);
              border: 2px solid #ffffff;
              transition: all 0.2s ease;
              ${isSelected ? 'transform: scale(1.15);' : ''}
            ">
              <span class="material-symbols-outlined" style="color: white; font-size: 16px;">${pinConfig.icon}</span>
            </div>
            <div style="
              width: 0; 
              height: 0; 
              border-left: 5px solid transparent;
              border-right: 5px solid transparent;
              border-top: 7px solid ${pinConfig.bg};
              margin-top: -1px;
            "></div>
          </div>
        `,
        iconSize: [32, 38],
        iconAnchor: [16, 38]
      });

      const marker = L.marker([place.coordinates.lat, place.coordinates.lng], {
        icon: divIcon,
        title: place.name
      }).addTo(markersGroup);

      const popupHtml = `
        <div style="font-family: 'Nunito Sans', sans-serif; min-width: 230px; padding: 2px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 9px; font-weight: 700; text-transform: uppercase; color: ${pinConfig.bg}; background: rgba(0,0,0,0.06); padding: 2px 6px; border-radius: 4px;">
              ${place.categoryLabel}
            </span>
            <span style="color: #d97706; font-size: 11px; font-weight: 700;">★ ${place.rating}</span>
          </div>
          <h4 style="font-family: 'Literata', Georgia, serif; font-size: 13.5px; font-weight: 700; color: #1f2622; margin: 2px 0 4px 0; line-height: 1.25;">
            ${place.name}
          </h4>
          
          <!-- Marker Popups & Distance Badge: Place Name, Category, Calculated Distance (Distance: XX km) -->
          <div style="display: inline-flex; align-items: center; gap: 4px; background: #e0f2fe; color: #0284c7; padding: 2.5px 7px; border-radius: 5px; font-size: 11px; font-weight: 700; margin-bottom: 6px; border: 1px solid #bae6fd;">
            <span class="material-symbols-outlined" style="font-size: 13px;">near_me</span>
            <span>Distance: ${place.distanceKm} km</span>
            ${place.distanceKm <= 25 ? '<span style="font-size: 9.5px; color: #0369a1; margin-left: 2px; font-weight: 800;">(Within 25km)</span>' : ''}
          </div>

          <p style="font-size: 11px; color: #555d56; margin: 0 0 8px 0;">
            <strong style="color: #705c30;">Fee: ${place.entranceFee}</strong>
          </p>
          <div style="display: flex; gap: 6px; border-top: 1px solid #eee; padding-top: 6px;">
            <button id="plan-btn-${place.id}" style="
              flex: 1; 
              padding: 5px 8px; 
              background: ${isPlanned ? '#2e683e' : '#4a7c59'}; 
              color: white; 
              border: none; 
              border-radius: 6px; 
              font-size: 10px; 
              font-weight: 600; 
              cursor: pointer;
            ">
              ${isPlanned ? '✓ Planned' : '+ Plan'}
            </button>
            <button id="dir-btn-${place.id}" style="
              padding: 5px 8px; 
              background: #f4efe5; 
              color: #333; 
              border: 1px solid #ded5c5; 
              border-radius: 6px; 
              font-size: 10px; 
              font-weight: 600; 
              cursor: pointer;
            ">
              Directions
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        closeButton: true,
        className: 'custom-leaflet-popup',
        autoPan: true,
        autoClose: true,
        closeOnClick: true
      });

      // Pop up ONLY when touched or clicked by the user
      marker.on('click', () => {
        onSelectPlace?.(place);
        marker.openPopup();
      });

      marker.on('popupclose', () => {
        // Clear selection when popup is closed
        if (activePlace?.id === place.id) {
          onSelectPlace?.(null);
        }
      });

      marker.on('popupopen', () => {
        const planBtn = document.getElementById(`plan-btn-${place.id}`);
        const dirBtn = document.getElementById(`dir-btn-${place.id}`);

        if (planBtn) {
          planBtn.onclick = (e) => {
            e.stopPropagation();
            onTogglePlan(place);
          };
        }

        if (dirBtn) {
          dirBtn.onclick = (e) => {
            e.stopPropagation();
            onOpenDirections(place);
          };
        }
      });
    });
  }, [places, plannedIds, radarMode]);

  // Smoothly pan map to selected attraction when selected, without auto popup
  useEffect(() => {
    if (!activePlace || !mapInstanceRef.current) return;
    mapInstanceRef.current.panTo([activePlace.coordinates.lat, activePlace.coordinates.lng], {
      animate: true,
      duration: 0.5
    });
  }, [activePlace]);

  // 5. Handle Click on Map for picking
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const onMapClick = (e) => {
      if (!isPickingOnMap) return;

      const lat = Number(e.latlng.lat.toFixed(4));
      const lng = Number(e.latlng.lng.toFixed(4));

      onCenterChange({ lat, lng }, `Custom Pin (${lat}°N, ${lng}°E)`);
      onPickOnMapToggle();
    };

    map.on('click', onMapClick);

    return () => {
      map.off('click', onMapClick);
    };
  }, [isPickingOnMap]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const toggleFullscreen = () => {
    if (!mapElementRef.current) return;
    if (!isFullscreen) {
      if (mapElementRef.current.requestFullscreen) {
        mapElementRef.current.requestFullscreen().catch(() => {});
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 300);
  };

  const currentSelected = activePlace;

  return (
    <div className="bg-[#f5f1ea] rounded-[12px] p-3 md:p-5 shadow-lg border border-[#c4c8bc]/40 relative overflow-hidden mb-8">
      
      {/* Map Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 mb-3 bg-[#f0ece4] rounded-[12px] border border-[#c4c8bc]/30">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isGpsLive ? 'bg-blue-500' : 'bg-[#4a7c59]'} opacity-75`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isGpsLive ? 'bg-blue-600' : 'bg-[#4a7c59]'}`}></span>
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2.5">
            <span className="text-sm font-serif font-bold text-[#2e3230] tracking-tight">
              Ratnapura Real Interactive Map (Leaflet &amp; OpenStreetMap)
            </span>
            <span className="hidden sm:inline text-[#74796e] text-xs">·</span>
            <span className="text-xs font-mono text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-blue-600">my_location</span>
              <span>{center.lat.toFixed(4)}° N, {center.lng.toFixed(4)}° E</span>
            </span>
          </div>
        </div>

        {/* Mode Switcher Buttons (25km Live Radar vs Show All) & Tile Layer Mode */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Radar Mode Switcher */}
          <div className="inline-flex items-center bg-[#eae6de] rounded-lg p-0.5 text-[11px] font-semibold text-[#4a4e4a] shadow-inner">
            <button
              onClick={() => onRadarModeChange && onRadarModeChange('radar')}
              className={`min-h-[44px] px-3 py-2 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                radarMode === 'radar'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'hover:text-[#2e3230]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">radar</span>
              <span>25km Live Radar</span>
            </button>

            <button
              onClick={() => onRadarModeChange && onRadarModeChange('all')}
              className={`min-h-[44px] px-3 py-2 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                radarMode === 'all'
                  ? 'bg-[#4a7c59] text-white shadow-sm font-bold'
                  : 'hover:text-[#2e3230]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">public</span>
              <span>Show All</span>
            </button>
          </div>

          {/* Layer Selector */}
          <div className="inline-flex items-center bg-[#eae6de] rounded-lg p-0.5 text-[11px] font-semibold text-[#4a4e4a] shadow-inner">
            <button
              onClick={() => setMapLayer('terrain')}
              className={`min-h-[44px] px-2.5 py-2 rounded-md flex items-center gap-1 transition-all cursor-pointer ${
                mapLayer === 'terrain'
                  ? 'bg-white text-[#4a7c59] shadow-sm font-bold'
                  : 'hover:text-[#2e3230]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Terrain</span>
            </button>

            <button
              onClick={() => setMapLayer('streets')}
              className={`min-h-[44px] px-2.5 py-2 rounded-md transition-all cursor-pointer ${
                mapLayer === 'streets'
                  ? 'bg-white text-[#4a7c59] shadow-sm font-bold'
                  : 'hover:text-[#2e3230]'
              }`}
            >
              Streets
            </button>

            <button
              onClick={() => setMapLayer('satellite')}
              className={`min-h-[44px] px-2.5 py-2 rounded-md transition-all cursor-pointer ${
                mapLayer === 'satellite'
                  ? 'bg-white text-[#4a7c59] shadow-sm font-bold'
                  : 'hover:text-[#2e3230]'
              }`}
            >
              Satellite
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg bg-[#eae6de] text-[#4a4e4a] hover:text-[#4a7c59] hover:bg-white transition-colors shadow-sm cursor-pointer"
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            <Fullscreen className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Pick on Map Banner Overlay */}
      {isPickingOnMap && (
        <div className="absolute top-20 left-4 right-4 z-[1000] bg-[#2e3230]/95 backdrop-blur text-[#f5f0e8] px-4 py-3 rounded-xl text-xs shadow-xl flex items-center justify-between border border-white/10">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#8ecf9e] animate-bounce" />
            <span>Touch or click anywhere on the map to set your custom center coordinates.</span>
          </span>
          <button
            className="min-h-[44px] px-3 flex items-center text-[#8ecf9e] font-bold text-xs underline cursor-pointer"
            onClick={onPickOnMapToggle}
          >
            Done
          </button>
        </div>
      )}

      {/* Real Leaflet Map Container */}
      <div className="relative w-full h-[480px] sm:h-[520px] rounded-[12px] overflow-hidden shadow-inner border border-[#c4c8bc]/50">
        
        {/* Leaflet DOM Node */}
        <div 
          ref={mapElementRef} 
          className="w-full h-full z-10" 
          style={{ cursor: isPickingOnMap ? 'crosshair' : 'grab' }}
        />

        {/* Custom Zoom Controls (Top-Left) with >= 44px hitboxes */}
        <div className="absolute top-3 left-3 flex flex-col rounded-[12px] bg-white/95 backdrop-blur shadow-md border border-[#c4c8bc]/40 z-[900] overflow-hidden text-xs">
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="w-11 h-11 flex items-center justify-center text-[#2e3230] hover:bg-[#f0ece4] transition-colors border-b border-[#c4c8bc]/30 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="w-11 h-11 flex items-center justify-center text-[#2e3230] hover:bg-[#f0ece4] transition-colors cursor-pointer"
          >
            <Minus className="w-5 h-5" />
          </button>
          <div className="bg-[#f0ece4] px-1 py-1 text-[9px] font-mono text-center text-[#4a4e4a] font-bold border-t border-[#c4c8bc]/30">
            Z:{currentZoom}
          </div>
        </div>

        {/* North Arrow Compass */}
        <button 
          onClick={() => mapInstanceRef.current?.setView([center.lat, center.lng], 10)}
          className="absolute top-28 left-3 z-[900] bg-white/95 backdrop-blur rounded-xl shadow-md border border-[#c4c8bc]/40 flex items-center justify-center w-11 h-11 text-[#4a7c59] cursor-pointer hover:bg-[#f0ece4] transition-colors" 
          title="Reset to center point"
          aria-label="Reset to center point"
        >
          <Compass className="w-5 h-5" />
        </button>

        {/* GPS Recenter on Live Position Button */}
        <button
          onClick={() => {
            if (onGpsLocate) onGpsLocate();
            mapInstanceRef.current?.setView([center.lat, center.lng], 11, { animate: true });
          }}
          className="absolute top-41 left-3 z-[900] bg-white/95 backdrop-blur rounded-xl shadow-md border border-[#c4c8bc]/40 flex items-center justify-center w-11 h-11 text-blue-600 hover:text-blue-800 hover:bg-blue-50 cursor-pointer transition-colors"
          title="Recenter Map to Live Location (Your Position)"
          aria-label="Recenter Map to Live Location"
        >
          <Navigation className="w-5 h-5" />
        </button>

        {/* Floating Quick Pick Location Banner (Top-Right) */}
        <div className="absolute top-3 right-3 z-[900]">
          <button
            onClick={onPickOnMapToggle}
            className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
              isPickingOnMap
                ? 'bg-[#705c30] text-white ring-2 ring-white animate-pulse'
                : 'bg-white/95 backdrop-blur border border-[#c4c8bc]/40 text-[#4a4e4a] hover:text-[#4a7c59]'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#4a7c59]" />
            <span className="hidden sm:inline">
              {isPickingOnMap ? 'Touch anywhere on map now' : 'Pick Location on Map'}
            </span>
          </button>
        </div>

        {/* Category Legend Bar (Bottom-Left) */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg shadow-md border border-[#c4c8bc]/30 text-[10px] text-[#4a4e4a] flex items-center gap-2.5 z-[900] flex-wrap">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]"></span>
            <span>Waterfalls</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]"></span>
            <span>Nature</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d97706]"></span>
            <span>Gem Mines</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b45309]"></span>
            <span>Heritage</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7e22ce]"></span>
            <span>Museums</span>
          </div>
          <span className="text-[#aaa]">·</span>
          <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
            {radarMode === 'radar' 
              ? `25km Live Radar (${placesWithin25Count} sites within 25km)` 
              : `Show All (44 Landmarks)`}
          </span>
        </div>

      </div>

      {/* Selected Place Popover Footer - Only appears when a place is actively touched/selected */}
      {currentSelected && (
        <div className="mt-3 bg-[#f0ece4] p-3 rounded-[12px] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-[#c4c8bc]/40 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-[12px] bg-[#eae6de] overflow-hidden shrink-0 shadow-sm border border-[#c4c8bc]/30">
              <img
                src={currentSelected.image}
                alt={currentSelected.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-sm text-[#2e3230]">
                  {currentSelected.name}
                </h4>
                {currentSelected.distanceKm <= 25 && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-1.5 py-0.5 rounded">
                    Within 25km
                  </span>
                )}
              </div>
              <p className="text-xs text-[#4a4e4a] mt-0.5">
                {currentSelected.categoryLabel} · ★ {currentSelected.rating} · {currentSelected.distanceKm} km away
              </p>
              <p className="text-[11px] text-[#705c30] font-medium mt-0.5">
                Entrance Fee: {currentSelected.entranceFee}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              onClick={() => onTogglePlan(currentSelected)}
              className={`min-h-[44px] px-3.5 py-2 rounded-[12px] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                plannedIds.includes(currentSelected.id)
                  ? 'bg-[#2e683e] text-white'
                  : 'bg-[#4a7c59] hover:bg-[#3b6548] text-white'
              }`}
            >
              {plannedIds.includes(currentSelected.id) ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>In Plan</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">bookmark_add</span>
                  <span>+ Plan</span>
                </>
              )}
            </button>

            <button
              onClick={() => onOpenDetails(currentSelected)}
              className="min-h-[44px] px-3 rounded-[12px] bg-[#e4e0d8] text-[#2e3230] hover:text-[#4a7c59] transition-colors flex items-center justify-center gap-1 text-xs font-semibold cursor-pointer"
              title="View full place story"
            >
              <Eye className="w-4 h-4" />
              <span>Details</span>
            </button>

            {/* Dismiss touch card button */}
            <button
              onClick={() => onSelectPlace?.(null)}
              className="min-h-[44px] min-w-[44px] rounded-[12px] bg-[#e4e0d8] text-[#74796e] hover:text-[#2e3230] transition-colors flex items-center justify-center cursor-pointer"
              title="Close card"
              aria-label="Close card"
            >
              <span className="text-base font-bold">✕</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
