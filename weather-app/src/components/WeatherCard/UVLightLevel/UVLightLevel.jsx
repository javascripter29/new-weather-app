import PropTypes from "prop-types";
import styles from "../WeatherCard.module.css";
import { uviToLevel } from "../../../utils/formatters.js";

export const UVLightLevel = ({ uvi, isLoading, isError }) => {
  const hasValue = uvi != null && !Number.isNaN(uvi);

  const level = hasValue ? uviToLevel(uvi) : null;

  const valueElement = (() => {
    if (isLoading) return <span>Загрузка...</span>;
    if (isError || !hasValue) return <span>Нет данных</span>;

    return (
      <>
        {Math.round(uvi * 10) / 10}
        <span
          style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 6 }}
        >
          {level.label}
        </span>
      </>
    );
  })();

  return (
    <div className={styles.block} aria-label="Уровень ультрафиолетового света">
      <div className={styles.blockTitle}>УФ-индекс</div>
      <div className={styles.blockValue}>{valueElement}</div>

      {hasValue && !isLoading && !isError ? (
        <div
          style={{
            marginTop: 10,
            height: 8,
            borderRadius: 999,
            background: "var(--border)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.min(100, (uvi / 12) * 100)}%`,
              height: "100%",
              background: level.color,
              transition: "width 200ms ease",
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

UVLightLevel.propTypes = {
  uvi: PropTypes.number,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
};
