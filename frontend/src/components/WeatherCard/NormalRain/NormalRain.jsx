import PropTypes from "prop-types";
import { Skeleton } from "antd";
import { percentFromPop } from "../../../utils/formatters.js";
import styles from "../WeatherCard.module.css";

export const NormalRain = ({ pop }) => {
  if (pop == null) return <Skeleton active paragraph={false} />;

  return (
    <div className={styles.block} aria-label="Вероятность осадков">
      <div className={styles.blockTitle}>Осадки</div>
      <div className={styles.blockValue}>{percentFromPop(pop)}</div>
      <div className={styles.blockNote}>Вероятность осадков</div>
    </div>
  );
};

NormalRain.propTypes = {
  pop: PropTypes.number,
};
