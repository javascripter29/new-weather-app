import { useQuery } from "@tanstack/react-query";
import {
  getCurrentWeather,
  getForecast,
  getUvIndex,
} from "../api/weatherApi.js";
import { getAirQuality } from "../api/airQualityApi.js";

const defaultQueryOptions = {
  retry: 2,
  refetchOnWindowFocus: false,
};

export const useWeather = ({ lat, lon, enabled }) => {
  const current = useQuery({
    ...defaultQueryOptions,
    queryKey: ["owm-current", lat, lon],
    enabled: Boolean(enabled && lat != null && lon != null),
    queryFn: () => getCurrentWeather(lat, lon, "metric", "ru"),
    staleTime: 10 * 60 * 1000,
  });

  const forecast = useQuery({
    ...defaultQueryOptions,
    queryKey: ["owm-forecast", lat, lon],
    enabled: Boolean(enabled && lat != null && lon != null),
    queryFn: () => getForecast(lat, lon, 40, "metric", "ru"),
    staleTime: 30 * 60 * 1000,
  });

  const airQuality = useQuery({
    ...defaultQueryOptions,
    queryKey: ["owm-air-quality", lat, lon],
    enabled: Boolean(enabled && lat != null && lon != null),
    queryFn: () => getAirQuality(lat, lon),
    staleTime: 60 * 60 * 1000,
  });

  const uvIndex = useQuery({
    ...defaultQueryOptions,
    queryKey: ["owm-uv", lat, lon],
    enabled: Boolean(enabled && lat != null && lon != null),
    queryFn: () => getUvIndex(lat, lon),
    staleTime: 60 * 60 * 1000,
  });

  return {
    current,
    forecast,
    airQuality,
    uvIndex,
    isLoading:
      current.isLoading ||
      forecast.isLoading ||
      airQuality.isLoading ||
      uvIndex.isLoading,
    isError:
      current.isError ||
      forecast.isError ||
      uvIndex.isError ||
      airQuality.isError,
  };
};
