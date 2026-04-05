import PropTypes from 'prop-types'
import { Skeleton } from 'antd'
import styles from '../WeatherCard.module.css'

export const WindLevel = ({ speed, degText, unit }) => {
  if (speed == null) return <Skeleton active paragraph={false} />

  return (
    <div className={styles.block} aria-label="Уровень ветра">
      <div className={styles.blockTitle}>Уровень ветра</div>
      <div className={styles.blockValue}>
        {Math.round(speed)} {unit}
        {degText ? ` • ${degText}` : ''}
      </div>
    </div>
  )
}

WindLevel.propTypes = {
  speed: PropTypes.number,
  degText: PropTypes.string,
  unit: PropTypes.string.isRequired,
}

