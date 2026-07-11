import PropTypes from "prop-types";
import { Skeleton } from "antd";
import { useMemo } from "react";
import styles from "../WeatherCard.module.css";

const aqiToLabel = (aqi) => {
  if (aqi <= 1) return { label: "Хорошее", color: "#22c55e" };
  if (aqi === 2) return { label: "Удовлетворительное", color: "#84cc16" };
  if (aqi === 3) return { label: "Умеренное", color: "#f59e0b" };
  if (aqi === 4) return { label: "Плохое", color: "#f97316" };
  return { label: "Очень плохое", color: "#ef4444" };
};

export const AirQuality = ({ aqiData }) => {
  const label = useMemo(() => {
    if (!aqiData) return null;
    return aqiToLabel(aqiData.main?.aqi);
  }, [aqiData]);

  if (!aqiData) return <Skeleton active paragraph={false} />;

  const components = aqiData.components ?? {};

  return (
    <div className={styles.block} aria-label="Качество воздуха">
      <div className={styles.blockTitle}>Качество воздуха</div>
      <div className={styles.blockValue}>
        <span className={styles.aqiBadge} style={{ color: label?.color }}>
          {aqiData.main?.aqi}
        </span>
        <span className={styles.inlineLevel}>{label?.label}</span>
      </div>

      <div className={styles.airDetails}>
        {typeof components.pm2_5 === "number" ? (
          <div>PM2.5: {Math.round(components.pm2_5)} мкг/м3</div>
        ) : null}
        {typeof components.pm10 === "number" ? (
          <div>PM10: {Math.round(components.pm10)} мкг/м3</div>
        ) : null}
        {typeof components.no2 === "number" ? (
          <div>NO2: {Math.round(components.no2)} мкг/м3</div>
        ) : null}
      </div>
    </div>
  );
};

AirQuality.propTypes = {
  aqiData: PropTypes.shape({
    main: PropTypes.shape({ aqi: PropTypes.number }),
    components: PropTypes.object,
  }),
};
