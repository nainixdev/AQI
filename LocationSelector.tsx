import React, { useState, useEffect } from 'react';
import { Search, MapPin, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearchCities } from '@/hooks/useAirQuality';
import { useLocation } from '@/hooks/useLocation';
import { translations, type Language } from '@/lib/translations';

interface LocationSelectorProps {
  language: Language;
  onLocationChange: (location: { lat: number; lon: number; city: string }) => void;
}

export function LocationSelector({ language, onLocationChange }: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { location, loading, error, detectLocation } = useLocation();
  const { data: cities, isLoading: searchLoading } = useSearchCities(searchQuery);
  const t = translations[language];

  useEffect(() => {
    if (location) {
      onLocationChange(location as { lat: number; lon: number; city: string });
    }
  }, [location, onLocationChange]);

  const handleCitySelect = (city: any) => {
    const locationData = {
      lat: city.lat,
      lon: city.lon,
      city: city.name
    };
    onLocationChange(locationData);
    setSearchQuery(city.name);
    setShowResults(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
          <MapPin className="h-5 w-5 text-blue-500" />
          <span className="font-medium">{t.location}</span>
        </div>
        
        <div className="flex flex-1 gap-3 relative">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={t.selectCity}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="pl-10"
            />
            
            {/* Search Results */}
            {showResults && searchQuery.length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {searchLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                  </div>
                ) : cities && cities.length > 0 ? (
                  cities.map((city: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleCitySelect(city)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{city.name}</span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No cities found
                  </div>
                )}
              </div>
            )}
          </div>
          
          <Button 
            onClick={detectLocation}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 whitespace-nowrap"
          >
            {loading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                {t.detectLocation}
              </>
            )}
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="mt-2 text-red-500 text-sm flex items-center space-x-1">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
      
      {/* Close search results when clicking outside */}
      {showResults && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowResults(false)}
        />
      )}
    </div>
  );
}
