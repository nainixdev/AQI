import { useQuery } from '@tanstack/react-query';
import type { CombinedData } from '@shared/schema';

interface UseAirQualityProps {
  lat?: number;
  lon?: number;
  enabled?: boolean;
}

export function useAirQuality({ lat, lon, enabled = true }: UseAirQualityProps) {
  return useQuery<CombinedData>({
    queryKey: ['/api/air-quality', lat, lon],
    enabled: enabled && lat !== undefined && lon !== undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    queryFn: async () => {
      if (!lat || !lon) {
        throw new Error('Location is required');
      }
      
      const response = await fetch(`/api/air-quality?lat=${lat}&lon=${lon}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch air quality data');
      }
      
      return response.json();
    }
  });
}

export function useSearchCities(query: string) {
  return useQuery({
    queryKey: ['/api/cities/search', query],
    enabled: query.length >= 2,
    staleTime: 30 * 60 * 1000, // 30 minutes
    queryFn: async () => {
      const response = await fetch(`/api/cities/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search cities');
      }
      
      return response.json();
    }
  });
}
