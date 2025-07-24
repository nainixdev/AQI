import React from 'react';
import { Wind, Clock } from 'lucide-react';
import type { AQIResponse } from '@shared/schema';
import { translations, type Language } from '@/lib/translations';

interface AQICardProps {
  data: AQIResponse;
  location: string;
  language: Language;
}

export function AQICard({ data, location, language }: AQICardProps) {
  const t = translations[language];
  
  const getGradientClass = (status: string) => {
    switch (status) {
      case 'good':
        return 'from-green-500 to-green-400';
      case 'moderate':
        return 'from-yellow-500 to-yellow-400';
      case 'unhealthy':
        return 'from-orange-500 to-orange-400';
      case 'hazardous':
        return 'from-red-500 to-red-400';
      default:
        return 'from-green-500 to-green-400';
    }
  };

  const getProgressOffset = (aqi: number) => {
    const maxAqi = 300;
    const progress = Math.min((aqi / maxAqi), 1);
    const circumference = 2 * Math.PI * 32;
    return circumference - (progress * circumference);
  };

  return (
    <div className={`bg-gradient-to-br ${getGradientClass(data.status)} rounded-2xl shadow-xl p-6 text-white relative overflow-hidden animate-in slide-in-from-bottom-4 duration-500`}>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-medium opacity-90 mb-1">{t.airQualityIndex}</h2>
            <p className="text-sm opacity-75">{location}</p>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-75">{t.justNow}</div>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm">{t.live}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-6xl font-bold mb-2">{data.aqi}</div>
            <div className="flex items-center space-x-3">
              <span className="text-xl font-semibold">{t[data.status as keyof typeof t] || data.status}</span>
              <span className="text-2xl">{data.emoji}</span>
            </div>
          </div>
          
          <div className="text-right">
            {/* Circular progress indicator */}
            <div className="w-20 h-20 relative">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle 
                  cx="40" 
                  cy="40" 
                  r="32" 
                  stroke="rgba(255,255,255,0.2)" 
                  strokeWidth="6" 
                  fill="none"
                />
                <circle 
                  cx="40" 
                  cy="40" 
                  r="32" 
                  stroke="white" 
                  strokeWidth="6" 
                  fill="none" 
                  strokeDasharray={2 * Math.PI * 32}
                  strokeDashoffset={getProgressOffset(data.aqi)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Wind className="text-white h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
          <p className="text-sm font-medium">{data.healthAlert}</p>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
        <Wind className="w-32 h-32" />
      </div>
    </div>
  );
}
