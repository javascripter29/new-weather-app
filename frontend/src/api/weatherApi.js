import axios from "axios";

const OWM_API_KEY = import.meta.env.VITE_OWM_API_KEY;
const OWM_BASE_URL = "https://api.openweathermap.org/data/2.5";
const OWM_GEO_URL = "https://api.openweathermap.org/geo/1.0";

const weatherClient = axios.create({
  baseURL: OWM_BASE_URL,
  timeout: 10000,
});

const geoClient = axios.create({
  baseURL: OWM_GEO_URL,
  timeout: 10000,
});

const mapAxiosErrorToMessage = (error) => {
  const status = error?.response?.status;

  if (status === 401)
    return "Ошибка доступа к OpenWeatherMap API. Проверьте API-ключ в .env";
  if (status === 429) return "Превышен лимит запросов. Подождите минуту.";
  if (status) return "Не удалось загрузить данные. Проверьте подключение.";
  return "Не удалось загрузить данные. Проверьте подключение.";
};

const requireApiKey = () => {
  if (!OWM_API_KEY || OWM_API_KEY.trim() === "") {
    throw new Error(
      "API ключ OpenWeatherMap не найден. Проверьте переменную VITE_OWM_API_KEY в .env файле.",
    );
  }
};

export const getCitiesByQuery = async (q, limit = 5) => {
  requireApiKey();
  const trimmed = String(q ?? "").trim();
  if (!trimmed) return [];

  let response;
  try {
    response = await geoClient.get("/direct", {
      params: {
        q: trimmed,
        limit,
        appid: OWM_API_KEY,
      },
    });
  } catch (error) {
    throw new Error(mapAxiosErrorToMessage(error));
  }

  return response.data ?? [];
};

export const reverseGeocode = async (lat, lon) => {
  requireApiKey();
  let response;
  try {
    response = await geoClient.get("/reverse", {
      params: {
        lat,
        lon,
        limit: 1,
        appid: OWM_API_KEY,
      },
    });
  } catch (error) {
    throw new Error(mapAxiosErrorToMessage(error));
  }

  const item = (response.data ?? [])[0];
  if (!item) return null;

  return {
    name: item.name,
    state: item.state,
    country: item.country,
    lat: item.lat,
    lon: item.lon,
  };
};

export const getCurrentWeather = async (
  lat,
  lon,
  units = "metric",
  lang = "ru",
) => {
  requireApiKey();
  let response;
  try {
    response = await weatherClient.get("/weather", {
      params: {
        lat,
        lon,
        units,
        lang,
        appid: OWM_API_KEY,
      },
    });
  } catch (error) {
    throw new Error(mapAxiosErrorToMessage(error));
  }

  return response.data;
};

export const getForecast = async (
  lat,
  lon,
  cnt = 40,
  units = "metric",
  lang = "ru",
) => {
  requireApiKey();
  let response;
  try {
    response = await weatherClient.get("/forecast", {
      params: {
        lat,
        lon,
        units,
        cnt,
        lang,
        appid: OWM_API_KEY,
      },
    });
  } catch (error) {
    throw new Error(mapAxiosErrorToMessage(error));
  }

  return response.data;
};

export const getUvIndex = async (lat, lon) => {
  requireApiKey();
  try {
    const response = await weatherClient.get("/uvi", {
      params: {
        lat,
        lon,
        appid: OWM_API_KEY,
      },
    });

    return { current: { uvi: response.data.value } };
  } catch (error) {
    throw new Error(mapAxiosErrorToMessage(error));
  }
};
