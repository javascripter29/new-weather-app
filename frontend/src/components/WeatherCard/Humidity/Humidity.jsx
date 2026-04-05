import PropTypes from 'prop-types'
import { Skeleton, Typography } from 'antd'
import styles from '../WeatherCard.module.css'

export const Humidity = ({ humidity }) => {
  if (humidity == null) return <Skeleton active paragraph={false} />

  return (
    <div className={styles.block}>
      <div className={styles.blockTitle}>Влажность</div>
      <div className={styles.blockValue}>
        {Math.round(humidity)}
        %
      </div>
    </div>
  )
}

Humidity.propTypes = {
  humidity: PropTypes.number,
}

