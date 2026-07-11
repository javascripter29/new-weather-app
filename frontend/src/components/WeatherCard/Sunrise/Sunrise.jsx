import PropTypes from "prop-types";
import { Skeleton } from "antd";
import { formatTimeHHmmInZone } from "../../../utils/formatters.js";
import styles from "../WeatherCard.module.css";

export const Sunrise = ({ sunriseUnix, timezoneOffsetSeconds }) => {
  if (!sunriseUnix) return <Skeleton active paragraph={false} />;

  const sunriseText = formatTimeHHmmInZone(sunriseUnix, timezoneOffsetSeconds);

  return (
    <div className={styles.block} aria-label="Восход солнца">
      <div className={styles.blockTitle}>Восход</div>
      <div className={styles.blockValue}>{sunriseText}</div>
      <div className={styles.sunArc} aria-hidden="true">
        <span />
      </div>
    </div>
  );
};

Sunrise.propTypes = {
  sunriseUnix: PropTypes.number,
  timezoneOffsetSeconds: PropTypes.number.isRequired,
};
