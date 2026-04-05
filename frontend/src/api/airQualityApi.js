import axios from "axios";

const OWM_API_KEY = import.meta.env.VITE_OWM_API_KEY;
const OWM_BASE_URL = import.meta.env.VITE_OWM_BASE_URL;

const airClient = axios.create({
  baseURL: OWM_BASE_URL,
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

export const getAirQuality = async (lat, lon) => {
  requireApiKey();
  let response;
  try {
    response = await airClient.get("/air_pollution", {
      params: {
        lat,
        lon,
        appid: OWM_API_KEY,
      },
    });
  } catch (error) {
    throw new Error(mapAxiosErrorToMessage(error));
  }

  return response.data;
};
