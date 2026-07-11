import PropTypes from "prop-types";
import { Alert, Button, Skeleton } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { useWeather } from "../../hooks/useWeather.js";
import { useNow } from "../../hooks/useNow.js";
import { useFavorites } from "../../hooks/useFavorites.js";
import { useWeatherStore, WEATHER_STORE } from "../../store/weatherStore.js";
import {
  degToCompass,
  pressureFromHpa,
  pressureUnit,
  tempFromC,
  toFixedSmart,
  visibilityFromMeters,
  visibilityUnit,
  windFromMps,
  windSpeedUnit,
} from "../../utils/formatters.js";
import { getOwmIconUrl } from "../../utils/icons.js";
import { AirQuality } from "./AirQuality/AirQuality.jsx";
import { FeelsLike } from "./FeelsLike/FeelsLike.jsx";
import { ForecastHourList } from "./ForecastHourList/ForecastHourList.jsx";
import { ForecastList } from "./ForecastList/ForecastList.jsx";
import { Humidity } from "./Humidity/Humidity.jsx";
import { NormalRain } from "./NormalRain/NormalRain.jsx";
import { Sunrise } from "./Sunrise/Sunrise.jsx";
import { Sunset } from "./Sunset/Sunset.jsx";
import { UVLightLevel } from "./UVLightLevel/UVLightLevel.jsx";
import { WindLevel } from "./WindLevel/WindLevel.jsx";
import styles from "./WeatherCard.module.css";

const NO_DATA = "Нет данных";

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
  const errorMessage = useMemo(
    () => criticalError?.message ?? "",
    [criticalError?.message],
  );

  const data = current.data;
  const forecastData = forecast.data;
  const timezoneOffsetSeconds =
    data?.timezone ?? forecastData?.city?.timezone ?? 0;

  const hourlyToday = useMemo(() => {
    if (!forecastData?.list?.length || nowUnixSeconds == null) return [];

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
  }, [forecastData?.list, nowUnixSeconds, timezoneOffsetSeconds]);

  const morningEveningTemps = useMemo(() => {
    if (!hourlyToday.length) return { morning: null, evening: null };

    const getClosestByHour = (targetHour) => {
      let best = hourlyToday[0];
      let bestDiff = Infinity;

      for (const item of hourlyToday) {
        const local = new Date((item.dt + timezoneOffsetSeconds) * 1000);
        const diff = Math.abs(local.getUTCHours() - targetHour);
        if (diff < bestDiff) {
          bestDiff = diff;
          best = item;
        }
      }

      return best?.main?.temp;
    };

    return {
      morning: getClosestByHour(9),
      evening: getClosestByHour(18),
    };
  }, [hourlyToday, timezoneOffsetSeconds]);

  const currentCondition = data?.weather?.[0];
  const currentIconUrl = getOwmIconUrl(currentCondition?.icon, 2);
  const isFav = city ? isFavorite(city) : false;
  const unitsTempSign = units === WEATHER_STORE.UNITS.f ? "°F" : "°C";

  const morningTempValue =
    morningEveningTemps.morning != null
      ? toFixedSmart(tempFromC(morningEveningTemps.morning, units), 0)
      : NO_DATA;
  const eveningTempValue =
    morningEveningTemps.evening != null
      ? toFixedSmart(tempFromC(morningEveningTemps.evening, units), 0)
      : NO_DATA;
  const tempValue =
    data?.main?.temp != null
      ? toFixedSmart(tempFromC(data.main.temp, units), 0)
      : NO_DATA;
  const windSpeedValue =
    data?.wind?.speed != null ? windFromMps(data.wind.speed, units) : null;
  const windDirText = data?.wind?.deg != null ? degToCompass(data.wind.deg) : "";
  const pressureValue =
    data?.main?.pressure != null
      ? pressureFromHpa(data.main.pressure, units)
      : null;
  const visibilityValue =
    data?.visibility != null ? visibilityFromMeters(data.visibility, units) : null;

  return (
    <div className={styles.root}>
      {isCriticalError && errorMessage ? (
        <Alert type="error" showIcon message={errorMessage} />
      ) : null}

      <section className={styles.mainCard} aria-label="Карточка погоды">
        {isLoading || !data ? (
          <div className={styles.loadingState}>
            <Skeleton active title={{ width: "45%" }} paragraph={{ rows: 4 }} />
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        ) : (
          <div className={styles.fadeIn300}>
            <div className={styles.mainTop}>
              <div className={styles.summary}>
                <div className={styles.locationRow}>
                  <div>
                    <p className={styles.label}>Сейчас</p>
                    <h2 className={styles.cityName}>
                      {data.name ?? city?.name ?? ""}
                    </h2>
                  </div>
                  {currentIconUrl ? (
                    <img className={styles.condIcon} src={currentIconUrl} alt="" />
                  ) : null}
                </div>

                <div className={styles.tempRow}>
                  <h1 className={styles.temp} aria-label="Температура">
                    {tempValue}
                    <span>{unitsTempSign}</span>
                  </h1>
                  <p className={styles.desc}>
                    {currentCondition?.description ?? "Прогноз загружен"}
                  </p>
                </div>
              </div>

              <Button
                className={styles.favoriteButton}
                aria-label={
                  isFav ? "Убрать из избранного" : "Добавить в избранное"
                }
                icon={isFav ? <HeartFilled /> : <HeartOutlined />}
                onClick={() => toggleFavorite(city)}
              />
            </div>

            <div className={styles.quickFacts}>
              <div>
                <span>Утро</span>
                <strong>
                  {morningTempValue}
                  {morningTempValue === NO_DATA ? "" : unitsTempSign}
                </strong>
              </div>
              <div>
                <span>Вечер</span>
                <strong>
                  {eveningTempValue}
                  {eveningTempValue === NO_DATA ? "" : unitsTempSign}
                </strong>
              </div>
              <div>
                <span>Давление</span>
                <strong>
                  {pressureValue != null
                    ? `${Math.round(pressureValue)} ${pressureUnit(units)}`
                    : NO_DATA}
                </strong>
              </div>
              <div>
                <span>Видимость</span>
                <strong>
                  {visibilityValue != null
                    ? `${Math.round(visibilityValue)} ${visibilityUnit(units)}`
                    : NO_DATA}
                </strong>
              </div>
            </div>

            {!compact ? (
              <ForecastHourList
                timezoneOffsetSeconds={timezoneOffsetSeconds}
                forecast={forecastData}
                units={units}
                nowUnixSeconds={nowUnixSeconds}
              />
            ) : null}

            <div className={styles.blocksGrid}>
              <Humidity humidity={data?.main?.humidity} />
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
              <div className={styles.forecastWrap}>
                <ForecastList
                  timezoneOffsetSeconds={timezoneOffsetSeconds}
                  forecast={forecastData}
                  units={units}
                />
              </div>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
};

WeatherCard.propTypes = {
  compact: PropTypes.bool,
};

WeatherCard.defaultProps = {
  compact: false,
};
