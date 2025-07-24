import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { locationSchema, combinedDataSchema } from "@shared/schema";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || process.env.VITE_OPENWEATHER_API_KEY || "demo_key";
const AQICN_TOKEN = process.env.AQICN_TOKEN || process.env.VITE_AQICN_TOKEN || "demo_token";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get combined air quality and weather data
  app.get("/api/air-quality", async (req, res) => {
    try {
      const { lat, lon, city } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);

      const [aqiData, weatherData, hourlyData] = await Promise.all([
        fetchAirQualityData(latitude, longitude),
        fetchWeatherData(latitude, longitude),
        fetchHourlyAQIData(latitude, longitude)
      ]);

      const response = {
        aqi: aqiData,
        weather: weatherData,
        hourlyData: hourlyData
      };

      res.json(response);
    } catch (error) {
      console.error("Error fetching air quality data:", error);
      res.status(500).json({ error: "Failed to fetch air quality data" });
    }
  });

  // Get city name from coordinates
  app.get("/api/geocode", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
      }

      const latitude = parseFloat(lat as string);
      const longitude = parseFloat(lon as string);

      const cityName = await getCityName(latitude, longitude);
      res.json({ city: cityName });
    } catch (error) {
      console.error("Error geocoding:", error);
      res.status(500).json({ error: "Failed to geocode location" });
    }
  });

  // Search cities
  app.get("/api/cities/search", async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q || (q as string).length < 2) {
        return res.status(400).json({ error: "Query must be at least 2 characters" });
      }

      const cities = await searchCities(q as string);
      res.json(cities);
    } catch (error) {
      console.error("Error searching cities:", error);
      res.status(500).json({ error: "Failed to search cities" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function fetchAirQualityData(lat: number, lon: number) {
  try {
    // Try OpenWeatherMap first
    const owmResponse = await fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (owmResponse.ok) {
      const data = await owmResponse.json();
      return parseOpenWeatherAQI(data);
    }
  } catch (error) {
    console.error("OpenWeatherMap AQI failed:", error);
  }

  try {
    // Fallback to AQICN
    const aqicnResponse = await fetch(
      `http://api.waqi.info/feed/geo:${lat};${lon}/?token=${AQICN_TOKEN}`
    );
    
    if (aqicnResponse.ok) {
      const data = await aqicnResponse.json();
      return parseAQICNData(data);
    }
  } catch (error) {
    console.error("AQICN failed:", error);
  }

  throw new Error("All AQI data sources failed");
}

async function fetchWeatherData(lat: number, lon: number) {
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }
  
  const data = await response.json();
  return parseWeatherData(data);
}

async function fetchHourlyAQIData(lat: number, lon: number) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (response.ok) {
      const data = await response.json();
      return parseHourlyAQI(data);
    }
  } catch (error) {
    console.error("Failed to fetch hourly AQI:", error);
  }

  // Return empty array if forecast fails
  return [];
}

async function getCityName(lat: number, lon: number): Promise<string> {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (response.ok) {
      const data = await response.json();
      if (data.length > 0) {
        const location = data[0];
        return `${location.name}, ${location.country}`;
      }
    }
  } catch (error) {
    console.error("Failed to get city name:", error);
  }
  
  return "Unknown Location";
}

async function searchCities(query: string) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=10&appid=${OPENWEATHER_API_KEY}`
    );
    
    if (response.ok) {
      const data = await response.json();
      return data.map((city: any) => ({
        name: `${city.name}, ${city.country}`,
        lat: city.lat,
        lon: city.lon
      }));
    }
  } catch (error) {
    console.error("Failed to search cities:", error);
  }
  
  return [];
}

function parseOpenWeatherAQI(data: any) {
  const aqi = data.list[0].main.aqi;
  const components = data.list[0].components;
  
  // Convert OpenWeatherMap AQI (1-5) to US AQI scale
  const aqiValue = Math.round(aqi * 50);
  
  const status = getAQIStatus(aqiValue);
  
  return {
    aqi: aqiValue,
    pm25: components.pm2_5 || 0,
    pm10: components.pm10 || 0,
    co: components.co || 0,
    no2: components.no2 || 0,
    so2: components.so2 || 0,
    o3: components.o3 || 0,
    status: status.level,
    healthAlert: status.healthAlert,
    emoji: status.emoji,
    color: status.color
  };
}

function parseAQICNData(data: any) {
  if (data.status !== "ok") {
    throw new Error("AQICN API returned error");
  }
  
  const aqi = data.data.aqi;
  const iaqi = data.data.iaqi || {};
  
  const status = getAQIStatus(aqi);
  
  return {
    aqi: aqi,
    pm25: iaqi.pm25?.v || 0,
    pm10: iaqi.pm10?.v || 0,
    co: iaqi.co?.v || 0,
    no2: iaqi.no2?.v || 0,
    so2: iaqi.so2?.v || 0,
    o3: iaqi.o3?.v || 0,
    status: status.level,
    healthAlert: status.healthAlert,
    emoji: status.emoji,
    color: status.color
  };
}

function parseWeatherData(data: any) {
  const main = data.main;
  const wind = data.wind;
  const sys = data.sys;
  
  return {
    temperature: Math.round(main.temp),
    feelsLike: Math.round(main.feels_like),
    humidity: main.humidity,
    windSpeed: Math.round((wind.speed || 0) * 3.6), // Convert m/s to km/h
    windDirection: getWindDirection(wind.deg || 0),
    visibility: Math.round((data.visibility || 10000) / 1000), // Convert to km
    sunrise: formatTime(new Date(sys.sunrise * 1000)),
    sunset: formatTime(new Date(sys.sunset * 1000)),
    weatherCondition: data.weather[0].main,
    icon: getWeatherIcon(data.weather[0].id, data.weather[0].icon)
  };
}

function parseHourlyAQI(data: any) {
  const hourlyData = [];
  const list = data.list.slice(0, 24); // Get next 24 hours
  
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const date = new Date(item.dt * 1000);
    const aqi = Math.round(item.main.aqi * 50); // Convert to US AQI scale
    
    hourlyData.push({
      time: date.getHours() + ":00",
      aqi: aqi
    });
  }
  
  return hourlyData;
}

function getAQIStatus(aqi: number) {
  if (aqi <= 50) {
    return {
      level: 'good',
      emoji: '😊',
      color: '#22c55e',
      healthAlert: '🌿 Air is clean, perfect for outdoor activities!'
    };
  } else if (aqi <= 100) {
    return {
      level: 'moderate',
      emoji: '😐',
      color: '#facc15',
      healthAlert: '😊 Air quality is acceptable for most people.'
    };
  } else if (aqi <= 200) {
    return {
      level: 'unhealthy',
      emoji: '😷',
      color: '#f97316',
      healthAlert: '😷 Consider wearing a mask when going outside.'
    };
  } else {
    return {
      level: 'hazardous',
      emoji: '😨',
      color: '#dc2626',
      healthAlert: '⚠️ Avoid outdoor activities. Stay indoors!'
    };
  }
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

function getWeatherIcon(weatherId: number, iconCode: string): string {
  if (weatherId >= 200 && weatherId < 300) return 'fas fa-bolt';
  if (weatherId >= 300 && weatherId < 600) return 'fas fa-cloud-rain';
  if (weatherId >= 600 && weatherId < 700) return 'fas fa-snowflake';
  if (weatherId >= 700 && weatherId < 800) return 'fas fa-smog';
  if (weatherId === 800) return iconCode.includes('d') ? 'fas fa-sun' : 'fas fa-moon';
  return 'fas fa-cloud';
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}
