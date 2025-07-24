import React, { useState, useEffect } from 'react';
import { MapPin, X, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { translations, type Language } from '@/lib/translations';

interface SavedCity {
  name: string;
  aqi: number;
  timestamp: string;
  coordinates: { lat: number; lon: number };
}

interface SavedCitiesProps {
  language: Language;
  currentLocation: string;
  currentAQI?: number;
  currentCoordinates?: { lat: number; lon: number };
  onCitySelect: (coordinates: { lat: number; lon: number }, name: string) => void;
}

export function SavedCities({ 
  language, 
  currentLocation, 
  currentAQI, 
  currentCoordinates,
  onCitySelect 
}: SavedCitiesProps) {
  const [savedCities, setSavedCities] = useState<SavedCity[]>([]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const t = translations[language];

  useEffect(() => {
    loadSavedCities();
  }, []);

  const loadSavedCities = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedCities') || '[]');
      setSavedCities(saved);
    } catch (error) {
      console.error('Error loading saved cities:', error);
    }
  };

  const saveCurrentCity = async () => {
    if (!currentLocation || currentLocation === 'Detecting location...' || !currentCoordinates) {
      toast({
        title: "Error",
        description: "Please select a location first.",
        variant: "destructive"
      });
      return;
    }

    if (!currentAQI) {
      toast({
        title: "Error", 
        description: "No AQI data available to save.",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);

    try {
      const cityData: SavedCity = {
        name: currentLocation,
        aqi: currentAQI,
        timestamp: new Date().toISOString(),
        coordinates: currentCoordinates
      };

      const existingIndex = savedCities.findIndex(city => city.name === currentLocation);
      let updatedCities;
      
      if (existingIndex >= 0) {
        updatedCities = [...savedCities];
        updatedCities[existingIndex] = cityData;
      } else {
        updatedCities = [...savedCities, cityData];
      }

      localStorage.setItem('savedCities', JSON.stringify(updatedCities));
      setSavedCities(updatedCities);

      toast({
        title: "Success",
        description: `${currentLocation} ${t.saved}`,
      });
    } catch (error) {
      console.error('Error saving city:', error);
      toast({
        title: "Error",
        description: "Failed to save city. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const removeSavedCity = (index: number) => {
    const updatedCities = savedCities.filter((_, i) => i !== index);
    localStorage.setItem('savedCities', JSON.stringify(updatedCities));
    setSavedCities(updatedCities);
    
    toast({
      title: "Success",
      description: "City removed from saved cities.",
    });
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return '#22c55e';
    if (aqi <= 100) return '#facc15';
    if (aqi <= 200) return '#f97316';
    return '#dc2626';
  };

  const getAQIEmoji = (aqi: number) => {
    if (aqi <= 50) return '😊';
    if (aqi <= 100) return '😐';
    if (aqi <= 200) return '😷';
    return '😨';
  };

  return (
    <>
      {/* Save City Button */}
      <div className="mb-6">
        <Button
          onClick={saveCurrentCity}
          disabled={saving}
          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {saving ? (
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
          ) : (
            <>
              <Bookmark className="h-4 w-4" />
              <span>{t.saveCity}</span>
            </>
          )}
        </Button>
      </div>

      {/* Saved Cities List */}
      {savedCities.length > 0 && (
        <div className="mb-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t.savedCities}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedCities.map((city, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 group"
                  onClick={() => onCitySelect(city.coordinates, city.name)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 flex-1">
                      {city.name}
                    </h4>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSavedCity(index);
                      }}
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-400 hover:text-red-500 p-1 h-auto"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span 
                      className="text-lg font-bold"
                      style={{ color: getAQIColor(city.aqi) }}
                    >
                      {city.aqi}
                    </span>
                    <span className="text-xs">{getAQIEmoji(city.aqi)}</span>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {new Date(city.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
