import { useState, useCallback } from 'react';

interface LocationData {
  lat: number;
  lon: number;
  city?: string;
}

interface UseLocationReturn {
  location: LocationData | null;
  loading: boolean;
  error: string | null;
  detectLocation: () => void;
  setManualLocation: (location: LocationData) => void;
  getCityName: (lat: number, lon: number) => Promise<string>;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const cityName = await getCityName(latitude, longitude);
          setLocation({
            lat: latitude,
            lon: longitude,
            city: cityName
          });
        } catch (err) {
          setLocation({
            lat: latitude,
            lon: longitude,
            city: 'Unknown Location'
          });
        }
        
        setLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Unable to detect location. Please select a city manually.');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }, []);

  const setManualLocation = useCallback((newLocation: LocationData) => {
    setLocation(newLocation);
    setError(null);
  }, []);

  const getCityName = useCallback(async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(`/api/geocode?lat=${lat}&lon=${lon}`);
      if (!response.ok) {
        throw new Error('Failed to geocode');
      }
      const data = await response.json();
      return data.city || 'Unknown Location';
    } catch (error) {
      console.error('Geocoding error:', error);
      return 'Unknown Location';
    }
  }, []);

  return {
    location,
    loading,
    error,
    detectLocation,
    setManualLocation,
    getCityName
  };
}
