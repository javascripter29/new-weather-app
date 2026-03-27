import PropTypes from "prop-types";
import { Alert, Button, Skeleton } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { useWeatherStore, WEATHER_STORE } from "../../store/weatherStore.js";
import { useWeather } from "../../hooks/useWeather.js";
import { useFavorites } from "../../hooks/useFavorites.js";
import { getOwmIconUrl } from "../../utils/icons.js";
import {
  degToCompass,
  pressureFromHpa,
  tempFromC,
  toFixedSmart,
  visibilityFromMeters,
  windFromMps,
  windSpeedUnit,
  pressureUnit,
  visibilityUnit,
} from "../../utils/formatters.js";
import { ForecastHourList } from "./ForecastHourList/ForecastHourList.jsx";
import { ForecastList } from "./ForecastList/ForecastList.jsx";
import { AirQuality } from "./AirQuality/AirQuality.jsx";
import { Sunrise } from "./Sunrise/Sunrise.jsx";
import { Sunset } from "./Sunset/Sunset.jsx";
import { Humidity } from "./Humidity/Humidity.jsx";
import { FeelsLike } from "./FeelsLike/FeelsLike.jsx";
import { WindLevel } from "./WindLevel/WindLevel.jsx";
import { NormalRain } from "./NormalRain/NormalRain.jsx";
import { UVLightLevel } from "./UVLightLevel/UVLightLevel.jsx";
import styles from "./WeatherCard.module.css";
import { useNow } from "../../hooks/useNow.js";

const NO_DATA = "—";

export const WeatherCard = ({ compact }) => {
  const { city, units } = useWeatherStore();
  const { toggleFavorite, isFavorite } = useFavorites();
  const nowMs = useNow();
  const nowUnixSeconds = nowMs != null ? Math.floor(nowMs / 1000) : null;
  const { current, forecast, airQuality, uvIndex, isLoading } = useWeather({
    lat: city?.lat,
    lon: city?.lon,
    enabled: Boolean(city?.lat != null && city?.lon != null),
  });

  const criticalError = current.error || forecast.error;
  const isCriticalError = Boolean(current.isError || forecast.isError);
  const errorMessage = useMemo(() => {
    return criticalError?.message ?? "";
  }, [criticalError?.message]);

  const data = current.data;
  const forecastData = forecast.data;

  const timezoneOffsetSeconds =
    data?.timezone ?? forecastData?.city?.timezone ?? 0;

  const hourlyToday = (() => {
    if (!forecastData?.list?.length) return [];
    if (nowUnixSeconds == null) return [];

    const getLocalYMD = (unixSeconds) => {
      const dt = new Date((unixSeconds + timezoneOffsetSeconds) * 1000);
      return {
        yy: dt.getUTCFullYear(),
        mm: dt.getUTCMonth(),
        dd: dt.getUTCDate(),
      };
    };

    const today = getLocalYMD(nowUnixSeconds);

    return forecastData.list
      .filter((item) => {
        const date = getLocalYMD(item.dt);
        return (
          date.yy === today.yy && date.mm === today.mm && date.dd === today.dd
        );
      })
      .sort((a, b) => a.dt - b.dt);
  })();

  const morningEveningTemps = useMemo(() => {
    const list = hourlyToday;
    if (!list.length) return { morning: null, evening: null };

    const getClosestByHour = (targetHour) => {
      let best = list[0];
      let bestDiff = Infinity;

      for (const item of list) {
        const local = new Date((item.dt + timezoneOffsetSeconds) * 1000);
        const hour = local.getUTCHours();
        const diff = Math.abs(hour - targetHour);
        if (diff < bestDiff) {
          bestDiff = diff;
          best = item;
        }
      }

      return best?.main?.temp;
    };

    const morningC = getClosestByHour(9);
    const eveningC = getClosestByHour(18);

    return {
      morning: morningC,
      evening: eveningC,
    };
  }, [hourlyToday, timezoneOffsetSeconds]);

  const currentCondition = data?.weather?.[0];
  const currentIconUrl = getOwmIconUrl(currentCondition?.icon, 2);
  const isFav = city ? isFavorite(city) : false;

  const unitsTempSign = units === WEATHER_STORE.UNITS.f ? "°F" : "°C";

  const morningTempValue = morningEveningTemps.morning
    ? toFixedSmart(tempFromC(morningEveningTemps.morning, units), 0)
    : NO_DATA;
  const eveningTempValue = morningEveningTemps.evening
    ? toFixedSmart(tempFromC(morningEveningTemps.evening, units), 0)
    : NO_DATA;

  const tempValue =
    data?.main?.temp != null
      ? toFixedSmart(tempFromC(data.main.temp, units), 0)
      : NO_DATA;

  const humidityValue = data?.main?.humidity;

  const windSpeedValue =
    data?.wind?.speed != null ? windFromMps(data.wind.speed, units) : null;
  const windDirText =
    data?.wind?.deg != null ? degToCompass(data.wind.deg) : "";

  const pressureValue =
    data?.main?.pressure != null
      ? pressureFromHpa(data.main.pressure, units)
      : null;
  const visibilityValue =
    data?.visibility != null
      ? visibilityFromMeters(data.visibility, units)
      : null;

  return (
    <div className={styles.root}>
      {isCriticalError && errorMessage ? (
        <Alert type="error" showIcon title={errorMessage} />
      ) : null}

      <div className={styles.mainCard}>
        <div className={`${styles.fadeIn300}`} aria-label="Карточка погоды">
          {isLoading || !data ? (
            <div>
              <Skeleton
                active
                title={{ width: "60%" }}
                paragraph={{ rows: 3 }}
              />
              <div style={{ marginTop: 12 }}>
                <Skeleton active />
              </div>
            </div>
          ) : (
            <>
              <div className={styles.mainTop}>
                <div>
                  <h1 className={styles.temp} aria-label="Температура">
                    {tempValue}
                    {unitsTempSign}
                  </h1>
                  <div className={styles.iconRow}>
                    {currentIconUrl ? (
                      <img
                        className={styles.condIcon}
                        src={currentIconUrl}
                        alt=""
                      />
                    ) : null}
                    <h3 className={styles.desc}>
                      {data.name ?? city?.name ?? ""}
                      {currentCondition?.description
                        ? ` • ${currentCondition.description}`
                        : ""}
                    </h3>
                  </div>
                  <h6 className={styles.subTemps}>
                    Утро: {morningTempValue}
                    {unitsTempSign} • Вечер: {eveningTempValue}
                    {unitsTempSign}
                  </h6>
                  <div
                    style={{
                      marginTop: 6,
                      color: "var(--text-muted)",
                      fontSize: 13,
                    }}
                  >
                    Давление:{" "}
                    {pressureValue != null
                      ? `${Math.round(pressureValue)} ${pressureUnit(units)}`
                      : NO_DATA}{" "}
                    • Видимость:{" "}
                    {visibilityValue != null
                      ? `${Math.round(visibilityValue)} ${visibilityUnit(units)}`
                      : NO_DATA}
                  </div>
                </div>

                <Button
                  aria-label={
                    isFav ? "Убрать из избранного" : "Добавить в избранное"
                  }
                  icon={isFav ? <HeartFilled /> : <HeartOutlined />}
                  onClick={() => toggleFavorite(city)}
                />
              </div>

              {!compact ? (
                <ForecastHourList
                  timezoneOffsetSeconds={timezoneOffsetSeconds}
                  forecast={forecastData}
                  units={units}
                  nowUnixSeconds={nowUnixSeconds}
                />
              ) : null}

              <div className={styles.blocksGrid} style={{ marginTop: 14 }}>
                <Humidity humidity={humidityValue} />
                <FeelsLike tempC={data.main.feels_like} units={units} />
                <WindLevel
                  speed={windSpeedValue}
                  degText={windDirText}
                  unit={windSpeedUnit(units)}
                />
                <NormalRain pop={hourlyToday?.[0]?.pop ?? null} />
                <UVLightLevel
                  uvi={uvIndex.data?.current?.uvi}
                  isLoading={uvIndex.isLoading}
                  isError={uvIndex.isError}
                />
                <AirQuality aqiData={airQuality.data?.list?.[0]} />
                <Sunrise
                  sunriseUnix={data.sys?.sunrise}
                  timezoneOffsetSeconds={timezoneOffsetSeconds}
                />
                <Sunset
                  sunsetUnix={data.sys?.sunset}
                  timezoneOffsetSeconds={timezoneOffsetSeconds}
                />
              </div>

              {!compact ? (
                <div style={{ marginTop: 14 }}>
                  <ForecastList
                    timezoneOffsetSeconds={timezoneOffsetSeconds}
                    forecast={forecastData}
                    units={units}
                  />
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

WeatherCard.propTypes = {
  compact: PropTypes.bool,
};

WeatherCard.defaultProps = {
  compact: false,
};
