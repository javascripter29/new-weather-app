import PropTypes from 'prop-types'
import { Skeleton } from 'antd'
import styles from '../WeatherCard.module.css'
import { tempFromC } from '../../../utils/formatters.js'

export const FeelsLike = ({ tempC, units }) => {
  if (tempC == null) return <Skeleton active paragraph={false} />

  const value = Math.round(tempFromC(tempC, units))

  return (
    <div className={styles.block} aria-label="Ощущается как">
      <div className={styles.blockTitle}>Ощущается как</div>
      <div className={styles.blockValue}>
        {value}
        {units === 'f' ? '°F' : '°C'}
      </div>
    </div>
  )
}

FeelsLike.propTypes = {
  tempC: PropTypes.number,
  units: PropTypes.oneOf(['c', 'f']).isRequired,
}

