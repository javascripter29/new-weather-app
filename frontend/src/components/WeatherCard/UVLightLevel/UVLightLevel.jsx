import PropTypes from "prop-types";
import { uviToLevel } from "../../../utils/formatters.js";
import styles from "../WeatherCard.module.css";

export const UVLightLevel = ({ uvi, isLoading, isError }) => {
  const hasValue = uvi != null && !Number.isNaN(uvi);
  const level = hasValue ? uviToLevel(uvi) : null;

  const valueElement = (() => {
    if (isLoading) return <span>Загрузка...</span>;
    if (isError || !hasValue) return <span>Нет данных</span>;

    return (
      <>
        {Math.round(uvi * 10) / 10}
        <span className={styles.inlineLevel}>{level.label}</span>
      </>
    );
  })();

  return (
    <div className={styles.block} aria-label="Уровень ультрафиолета">
      <div className={styles.blockTitle}>УФ-индекс</div>
      <div className={styles.blockValue}>{valueElement}</div>

      {hasValue && !isLoading && !isError ? (
        <div className={styles.meterTrack}>
          <div
            className={styles.meterFill}
            style={{
              width: `${Math.min(100, (uvi / 12) * 100)}%`,
              background: level.color,
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
