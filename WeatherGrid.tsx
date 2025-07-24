import React from 'react';
import { Thermometer, Droplets, Wind, Eye, Sunrise, Sunset } from 'lucide-react';
import type { WeatherResponse } from '@shared/schema';
import { translations, type Language } from '@/lib/translations';

interface WeatherGridProps {
  data: WeatherResponse;
  language: Language;
}

export function WeatherGrid({ data, language }: WeatherGridProps) {
  const t = translations[language];

  const weatherCards = [
    {
      title: t.temperature,
      value: `${data.temperature}°C`,
      subtitle: `${t.feelsLike} ${data.feelsLike}°C`,
      icon: <Thermometer className="h-5 w-5 text-yellow-500" />,
      delay: 'delay-100'
    },
    {
      title: t.humidity,
      value: `${data.humidity}%`,
      icon: <Droplets className="h-5 w-5 text-blue-500" />,
      progress: data.humidity,
      delay: 'delay-200'
    },
    {
      title: t.windSpeed,
      value: `${data.windSpeed} km/h`,
      subtitle: data.windDirection,
      icon: <Wind className="h-5 w-5 text-gray-500" />,
      delay: 'delay-300'
    },
    {
      title: t.visibility,
      value: `${data.visibility} km`,
      subtitle: t.clear,
      icon: <Eye className="h-5 w-5 text-purple-500" />,
      delay: 'delay-500'
    }
  ];

  return (
    <>
      {/* Weather Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {weatherCards.map((card, index) => (
          <div 
            key={index}
            className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300 animate-in slide-in-from-bottom-4 duration-500 ${card.delay}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 dark:text-gray-400 font-medium">{card.title}</h3>
              {card.icon}
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{card.value}</div>
            {card.subtitle && (
              <div className="text-sm text-gray-500 dark:text-gray-400">{card.subtitle}</div>
            )}
            {card.progress !== undefined && (
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${card.progress}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sun Times */}
      <div className="mb-6 animate-in slide-in-from-bottom-4 duration-500 delay-700">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sun Times</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <Sunrise className="text-orange-500 h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t.sunrise}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{data.sunrise}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <Sunset className="text-red-500 h-5 w-5" />
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{t.sunset}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{data.sunset}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
