import { pgTable, text, serial, integer, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const airQualityData = pgTable("air_quality_data", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  aqi: integer("aqi").notNull(),
  pm25: real("pm25"),
  pm10: real("pm10"),
  co: real("co"),
  no2: real("no2"),
  so2: real("so2"),
  o3: real("o3"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  city: text("city").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  temperature: real("temperature").notNull(),
  feelsLike: real("feels_like"),
  humidity: integer("humidity"),
  windSpeed: real("wind_speed"),
  windDirection: text("wind_direction"),
  visibility: real("visibility"),
  sunrise: text("sunrise"),
  sunset: text("sunset"),
  weatherCondition: text("weather_condition"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertAirQualitySchema = createInsertSchema(airQualityData).omit({
  id: true,
  timestamp: true,
});

export const insertWeatherSchema = createInsertSchema(weatherData).omit({
  id: true,
  timestamp: true,
});

export type InsertAirQuality = z.infer<typeof insertAirQualitySchema>;
export type InsertWeather = z.infer<typeof insertWeatherSchema>;
export type AirQuality = typeof airQualityData.$inferSelect;
export type Weather = typeof weatherData.$inferSelect;

// API Response types
export const locationSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  city: z.string().optional(),
});

export type Location = z.infer<typeof locationSchema>;

export const aqiResponseSchema = z.object({
  aqi: z.number(),
  pm25: z.number().optional(),
  pm10: z.number().optional(),
  co: z.number().optional(),
  no2: z.number().optional(),
  so2: z.number().optional(),
  o3: z.number().optional(),
  status: z.string(),
  healthAlert: z.string(),
  emoji: z.string(),
  color: z.string(),
});

export const weatherResponseSchema = z.object({
  temperature: z.number(),
  feelsLike: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  windDirection: z.string(),
  visibility: z.number(),
  sunrise: z.string(),
  sunset: z.string(),
  weatherCondition: z.string(),
  icon: z.string(),
});

export const combinedDataSchema = z.object({
  aqi: aqiResponseSchema,
  weather: weatherResponseSchema,
  hourlyData: z.array(z.object({
    time: z.string(),
    aqi: z.number(),
  })),
});

export type AQIResponse = z.infer<typeof aqiResponseSchema>;
export type WeatherResponse = z.infer<typeof weatherResponseSchema>;
export type CombinedData = z.infer<typeof combinedDataSchema>;
