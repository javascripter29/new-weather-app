import PropTypes from 'prop-types'
import { Skeleton } from 'antd'
import styles from '../WeatherCard.module.css'
import { formatTimeHHmmInZone } from '../../../utils/formatters.js'

export const SunriseSunset = ({ sunriseUnix, sunsetUnix, timezoneOffsetSeconds, nowUnixSeconds }) => {
  if (!sunriseUnix || !sunsetUnix) return <Skeleton active paragraph={false} />

  const sunriseLocalSeconds = sunriseUnix + timezoneOffsetSeconds
  const sunsetLocalSeconds = sunsetUnix + timezoneOffsetSeconds
  const nowLocalSeconds = nowUnixSeconds != null ? nowUnixSeconds : 0

  const totalCycleSeconds = 24 * 60 * 60
  const dayLengthSeconds = Math.max(1, sunsetLocalSeconds - sunriseLocalSeconds)
  const nightLengthSeconds = totalCycleSeconds - dayLengthSeconds

  const isDay = nowLocalSeconds >= sunriseLocalSeconds && nowLocalSeconds <= sunsetLocalSeconds

  const progressDay = (nowLocalSeconds - sunriseLocalSeconds) / dayLengthSeconds
  const progressNight = (() => {
    if (nowLocalSeconds >= sunsetLocalSeconds) {
      return (nowLocalSeconds - sunsetLocalSeconds) / nightLengthSeconds
    }
    return (nowLocalSeconds + totalCycleSeconds - sunsetLocalSeconds) / nightLengthSeconds
  })()

  const cx = 110
  const cy = 44
  const r = 76

  const marker = (() => {
    if (isDay) {
      const clamped = Math.min(1, Math.max(0, progressDay))
      const angle = Math.PI - clamped * Math.PI
      return {
        x: cx + r * Math.cos(angle),
        y: cy - r * Math.sin(angle),
      }
    }

    const clamped = Math.min(1, Math.max(0, progressNight))
    const angle = clamped * Math.PI
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    }
  })()

  const iconColor = isDay ? '#fbbf24' : '#e0e7ff'
  const statusText = isDay ? 'Сейчас: Солнце' : 'Сейчас: Луна'

  const sunriseText = formatTimeHHmmInZone(sunriseUnix, timezoneOffsetSeconds)
  const sunsetText = formatTimeHHmmInZone(sunsetUnix, timezoneOffsetSeconds)

  return (
    <div className={styles.block} aria-label="Восход и закат">
      <div className={styles.blockTitle}>Восход и закат</div>
      <div className={styles.blockValue} style={{ marginTop: 8 }}>
        Восход: {sunriseText} • Закат: {sunsetText}
      </div>
      <div style={{ marginTop: 10 }}>
        <svg width="220" height="90" viewBox="0 0 220 90" aria-label="Дуга солнца/луны" role="img">
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            stroke="rgba(100,116,139,0.35)"
            strokeWidth="6"
            fill="none"
          />
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy}`}
            stroke="rgba(100,116,139,0.25)"
            strokeWidth="6"
            fill="none"
          />
          <circle cx={marker.x} cy={marker.y} r="8" fill={iconColor} />
          <circle cx={marker.x} cy={marker.y} r="14" fill={iconColor} opacity="0.12" />
        </svg>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>{statusText}</div>
    </div>
  )
}

SunriseSunset.propTypes = {
  sunriseUnix: PropTypes.number,
  sunsetUnix: PropTypes.number,
  timezoneOffsetSeconds: PropTypes.number.isRequired,
  nowUnixSeconds: PropTypes.number,
}

