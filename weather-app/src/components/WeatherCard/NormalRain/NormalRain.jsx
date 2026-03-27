import PropTypes from 'prop-types'
import { Skeleton } from 'antd'
import styles from '../WeatherCard.module.css'
import { percentFromPop } from '../../../utils/formatters.js'

export const NormalRain = ({ pop }) => {
  if (pop == null) return <Skeleton active paragraph={false} />

  const percentText = percentFromPop(pop)

  return (
    <div className={styles.block} aria-label="Норма дождя">
      <div className={styles.blockTitle}>Норма дождя</div>
      <div className={styles.blockValue}>{percentText}</div>
      <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>
        Вероятность осадков
      </div>
    </div>
  )
}

NormalRain.propTypes = {
  pop: PropTypes.number,
}

