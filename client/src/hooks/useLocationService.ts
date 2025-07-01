
import { useState, useEffect, useCallback } from 'react';

interface Location {
  lat: number;
  lng: number;
  address: string;
}

interface UseLocationServiceReturn {
  currentLocation: Location | null;
  isLoading: boolean;
  error: string | null;
  setLocation: (location: Location) => void;
  getCurrentLocation: () => Promise<void>;
  clearLocation: () => void;
  calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => number;
}

export const useLocationService = (): UseLocationServiceReturn => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('servicehub_location');
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        setCurrentLocation(location);
      } catch (error) {
        console.error('Error parsing saved location:', error);
        localStorage.removeItem('servicehub_location');
      }
    }
  }, []);

  // Save location to localStorage whenever it changes
  useEffect(() => {
    if (currentLocation) {
      localStorage.setItem('servicehub_location', JSON.stringify(currentLocation));
    }
  }, [currentLocation]);

  const setLocation = useCallback((location: Location) => {
    setCurrentLocation(location);
    setError(null);
  }, []);

  const getCurrentLocation = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setIsLoading(false);
      return;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding to get address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const data = await response.json();
            
            const location: Location = {
              lat: latitude,
              lng: longitude,
              address: data.display_name || `${latitude}, ${longitude}`
            };
            
            setCurrentLocation(location);
            setIsLoading(false);
            resolve();
          } catch (error) {
            console.error('Reverse geocoding error:', error);
            const location: Location = {
              lat: latitude,
              lng: longitude,
              address: `${latitude}, ${longitude}`
            };
            
            setCurrentLocation(location);
            setIsLoading(false);
            resolve();
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to get your current location');
          setIsLoading(false);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }, []);

  const clearLocation = useCallback(() => {
    setCurrentLocation(null);
    setError(null);
    localStorage.removeItem('servicehub_location');
  }, []);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = useCallback((lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  return {
    currentLocation,
    isLoading,
    error,
    setLocation,
    getCurrentLocation,
    clearLocation,
    calculateDistance
  };
};
