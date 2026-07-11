import PropTypes from "prop-types";
import { Skeleton } from "antd";
import { formatTimeHHmmInZone } from "../../../utils/formatters.js";
import styles from "../WeatherCard.module.css";

export const Sunset = ({ sunsetUnix, timezoneOffsetSeconds }) => {
  if (!sunsetUnix) return <Skeleton active paragraph={false} />;

  const sunsetText = formatTimeHHmmInZone(sunsetUnix, timezoneOffsetSeconds);

  return (
    <div className={styles.block} aria-label="Закат солнца">
      <div className={styles.blockTitle}>Закат</div>
      <div className={styles.blockValue}>{sunsetText}</div>
      <div className={`${styles.sunArc} ${styles.sunArcSet}`} aria-hidden="true">
        <span />
      </div>
    </div>
  );
};

Sunset.propTypes = {
  sunsetUnix: PropTypes.number,
  timezoneOffsetSeconds: PropTypes.number.isRequired,
};
