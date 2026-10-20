import { RATNAPURA_PLACES, DISTRICT_INFO } from '../data/ratnapuraPlaces.js';

const STORAGE_KEY_PLACES = 'gemtrail_places_v2';
const STORAGE_KEY_DISTRICT = 'gemtrail_district_v2';

/**
 * Retrieves the current places from localStorage, falling back to RATNAPURA_PLACES.
 */
export function getStoredPlaces() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLACES);
    if (!raw) {
      // Initialize with default dataset
      localStorage.setItem(STORAGE_KEY_PLACES, JSON.stringify(RATNAPURA_PLACES));
      return RATNAPURA_PLACES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return RATNAPURA_PLACES;
  } catch (err) {
    console.error('Error reading places from localStorage:', err);
    return RATNAPURA_PLACES;
  }
}

/**
 * Saves places array to localStorage.
 */
export function saveStoredPlaces(places) {
  try {
    localStorage.setItem(STORAGE_KEY_PLACES, JSON.stringify(places));
    return true;
  } catch (err) {
    console.error('Error saving places to localStorage:', err);
    return false;
  }
}

/**
 * Resets stored places to the original 44 verified landmarks.
 */
export function resetStoredPlaces() {
  try {
    localStorage.setItem(STORAGE_KEY_PLACES, JSON.stringify(RATNAPURA_PLACES));
    return RATNAPURA_PLACES;
  } catch (err) {
    console.error('Error resetting places:', err);
    return RATNAPURA_PLACES;
  }
}

/**
 * Retrieves stored district metadata, falling back to DISTRICT_INFO.
 */
export function getStoredDistrictInfo() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_DISTRICT);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_DISTRICT, JSON.stringify(DISTRICT_INFO));
      return DISTRICT_INFO;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading district info from localStorage:', err);
    return DISTRICT_INFO;
  }
}

/**
 * Saves district metadata to localStorage.
 */
export function saveStoredDistrictInfo(info) {
  try {
    localStorage.setItem(STORAGE_KEY_DISTRICT, JSON.stringify(info));
    return true;
  } catch (err) {
    console.error('Error saving district info to localStorage:', err);
    return false;
  }
}

/**
 * Resets district metadata to default DISTRICT_INFO.
 */
export function resetStoredDistrictInfo() {
  try {
    localStorage.setItem(STORAGE_KEY_DISTRICT, JSON.stringify(DISTRICT_INFO));
    return DISTRICT_INFO;
  } catch (err) {
    console.error('Error resetting district info:', err);
    return DISTRICT_INFO;
  }
}
