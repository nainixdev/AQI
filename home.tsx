import React, { useState, useEffect } from 'react';
import { Moon, Sun, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { LocationSelector } from '@/components/LocationSelector';
import { AQICard } from '@/components/AQICard';
import { WeatherGrid } from '@/components/WeatherGrid';
import { AQIChart } from '@/components/AQIChart';
import { LanguageToggle } from '@/components/LanguageToggle';
import { VoiceAssistant } from '@/components/VoiceAssistant';
import { SavedCities } from '@/components/SavedCities';
import { useAirQuality } from '@/hooks/useAirQuality';
import { translations, tips, type Language } from '@/lib/translations';

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lon: number; city: string } | null>(null);
  const [showMaskReminder, setShowMaskReminder] = useState(false);
  const { toast } = useToast();
  const t = translations[language];

  const { data, isLoading, error } = useAirQuality({
    lat: location?.lat,
    lon: location?.lon,
    enabled: !!location
  });

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Check for mask reminder when AQI data updates
  useEffect(() => {
    if (data?.aqi && data.aqi.aqi > 150) {
      setShowMaskReminder(true);
    }
  }, [data]);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const handleLocationChange = (newLocation: { lat: number; lon: number; city: string }) => {
    setLocation(newLocation);
  };

  const shareOnWhatsApp = () => {
    if (!data || !location) {
      toast({
        title: "Error",
        description: "No data available to share",
        variant: "destructive"
      });
      return;
    }

    const template = t.whatsappTemplate;
    const message = template
      .replace('{location}', location.city)
      .replace('{aqi}', data.aqi.aqi.toString())
      .replace('{status}', t[data.aqi.status as keyof typeof t] || data.aqi.status)
      .replace('{temperature}', `${data.weather.temperature}°C`);
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getRandomTip = () => {
    const tipsList = tips[language];
    return tipsList[Math.floor(Math.random() * tipsList.length)];
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t.error}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error.message}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">🌬️</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.myAir}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageToggle language={language} onToggle={toggleLanguage} />
              
              <Button
                onClick={toggleDarkMode}
                variant="outline"
                size="sm"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 border-none"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <VoiceAssistant 
                aqiData={data?.aqi} 
                location={location?.city || t.currentLocation}
                language={language}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Location Selector */}
        <div className="mb-6">
          <LocationSelector language={language} onLocationChange={handleLocationChange} />
        </div>

        {isLoading && (
          <div className="mb-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-200 border-t-blue-500 rounded-full mx-auto mb-4"></div>
            <div className="text-gray-600 dark:text-gray-400 font-medium">{t.loading}</div>
          </div>
        )}

        {data && location && (
          <>
            {/* Main AQI Card */}
            <div className="mb-6">
              <AQICard 
                data={data.aqi} 
                location={location.city} 
                language={language}
              />
            </div>

            {/* Weather Grid */}
            <WeatherGrid data={data.weather} language={language} />

            {/* AQI Chart */}
            <div className="mb-6">
              <AQIChart data={data.hourlyData} language={language} />
            </div>

            {/* Tip of the Day */}
            <div className="mb-6 animate-in slide-in-from-bottom-4 duration-500 delay-1200">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 rounded-2xl shadow-lg p-6 border border-green-200 dark:border-green-700 transition-colors duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 dark:text-green-400 text-xl">💡</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {t.tipOfDay}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {getRandomTip()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Button
                onClick={shareOnWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Share className="h-4 w-4" />
                <span>{t.shareWhatsApp}</span>
              </Button>
            </div>

            {/* Saved Cities */}
            <SavedCities
              language={language}
              currentLocation={location.city}
              currentAQI={data.aqi.aqi}
              currentCoordinates={location}
              onCitySelect={(coords, name) => handleLocationChange({ ...coords, city: name })}
            />
          </>
        )}

        {/* Mask Reminder Modal */}
        <Dialog open={showMaskReminder} onOpenChange={setShowMaskReminder}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-500 text-2xl">⚠️</span>
                </div>
                {t.maskReminder}
              </DialogTitle>
            </DialogHeader>
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t.maskMessage}
              </p>
              <Button
                onClick={() => setShowMaskReminder(false)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
              >
                {t.gotIt}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
