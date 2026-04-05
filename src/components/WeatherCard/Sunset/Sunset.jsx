import PropTypes from "prop-types";
import { Skeleton } from "antd";
import styles from "../WeatherCard.module.css";
import { formatTimeHHmmInZone } from "../../../utils/formatters.js";

export const Sunset = ({ sunsetUnix, timezoneOffsetSeconds }) => {
  if (!sunsetUnix) return <Skeleton active paragraph={false} />;

  const sunsetText = formatTimeHHmmInZone(sunsetUnix, timezoneOffsetSeconds);

  const cx = 44;
  const cy = 44;
  const r = 36;

  const angle = (Math.PI * 3) / 2;
  const sunX = cx + r * Math.cos(angle);
  const sunY = cy - r * Math.sin(angle);

  return (
    <div className={styles.block} aria-label="Закат солнца">
      <div className={styles.blockTitle}>Закат</div>
      <div className={styles.blockValue} style={{ marginTop: 8 }}>
        {sunsetText}
      </div>
      <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
        <svg
          width="100"
          height="60"
          viewBox="0 0 100 60"
          aria-label="Закат солнца"
          role="img"
        >
          <defs>
            <linearGradient
              id="sunsetGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#f97316", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#ea580c", stopOpacity: 0.3 }}
              />
            </linearGradient>
          </defs>
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            stroke="rgba(100,116,139,0.2)"
            strokeWidth="3"
            fill="none"
          />
          <circle cx={sunX} cy={sunY} r="6" fill="url(#sunsetGradient)" />
          <circle cx={sunX} cy={sunY} r="10" fill="#f97316" opacity="0.2" />
        </svg>
      </div>
    </div>
  );
};

Sunset.propTypes = {
  sunsetUnix: PropTypes.number,
  timezoneOffsetSeconds: PropTypes.number.isRequired,
};
