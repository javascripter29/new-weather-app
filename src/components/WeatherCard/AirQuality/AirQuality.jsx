import PropTypes from 'prop-types'
import { Skeleton } from 'antd'
import styles from '../WeatherCard.module.css'
import { useMemo } from 'react'

const aqiToLabel = (aqi) => {
  if (aqi <= 1) return { label: 'Хорошее', color: '#22c55e' }
  if (aqi === 2) return { label: 'Удовлетворительное', color: '#84cc16' }
  if (aqi === 3) return { label: 'Умеренное', color: '#f59e0b' }
  if (aqi === 4) return { label: 'Плохое', color: '#f97316' }
  return { label: 'Очень плохое', color: '#ef4444' }
}

export const AirQuality = ({ aqiData }) => {
  const normalized = aqiData
  const isMissing = !normalized

  const label = useMemo(() => {
    if (!normalized) return null
    const main = normalized.main?.aqi
    return aqiToLabel(main)
  }, [normalized])

  const components = normalized?.components ?? {}

  const pm25 = components.pm2_5
  const pm10 = components.pm10
  const no2 = components.no2

  if (isMissing) return <Skeleton active paragraph={false} />

  return (
    <div className={styles.block} aria-label="Качество воздуха">
      <div className={styles.blockTitle}>Качество воздуха (AQI)</div>
      <div className={styles.blockValue}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 42,
            height: 26,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid var(--border)`,
            color: label?.color ?? 'var(--text)',
            fontWeight: 800,
          }}
        >
          {normalized.main?.aqi}
        </span>
        <span style={{ marginLeft: 10, color: 'var(--text-muted)', fontSize: 12 }}>{label?.label}</span>
      </div>

      <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
        {typeof pm25 === 'number' ? (
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>PM2.5: {Math.round(pm25)} мкг/м3</div>
        ) : null}
        {typeof pm10 === 'number' ? (
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>PM10: {Math.round(pm10)} мкг/м3</div>
        ) : null}
        {typeof no2 === 'number' ? (
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>NO₂: {Math.round(no2)} мкг/м3</div>
        ) : null}
      </div>
    </div>
  )
}

AirQuality.propTypes = {
  aqiData: PropTypes.shape({
    main: PropTypes.shape({ aqi: PropTypes.number }),
    components: PropTypes.object,
  }),
}

