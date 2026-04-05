import PropTypes from 'prop-types'
import { Skeleton, Typography } from 'antd'
import { useMemo } from 'react'
import { getOwmIconUrl } from '../../../utils/icons.js'
import { formatTimeHHmmInZone, tempFromC, percentFromPop } from '../../../utils/formatters.js'
import styles from './ForecastHourList.module.css'

export const ForecastHourList = ({ timezoneOffsetSeconds, forecast, units, nowUnixSeconds }) => {
  const hourlyToday = useMemo(() => {
    const list = forecast?.list ?? []
    if (!list.length) return []

    if (nowUnixSeconds == null) return []

    const today = new Date((nowUnixSeconds + timezoneOffsetSeconds) * 1000)
    const y = today.getUTCFullYear()
    const m = today.getUTCMonth()
    const d = today.getUTCDate()

    return list
      .filter((item) => {
        const local = new Date((item.dt + timezoneOffsetSeconds) * 1000)
        return (
          local.getUTCFullYear() === y &&
          local.getUTCMonth() === m &&
          local.getUTCDate() === d
        )
      })
      .sort((a, b) => a.dt - b.dt)
  }, [forecast?.list, nowUnixSeconds, timezoneOffsetSeconds])

  const list = hourlyToday.slice(0, 12)

  if (!forecast) {
    return <Skeleton active />
  }

  return (
    <div className={styles.wrap} aria-label="Почасовой прогноз на сегодня">
      <div className={styles.row} role="list">
        {list.length ? (
          list.map((item) => {
            const iconUrl = getOwmIconUrl(item?.weather?.[0]?.icon, 2)
            const timeText = formatTimeHHmmInZone(item.dt, timezoneOffsetSeconds)
            const tempC = item?.main?.temp
            const tempValue = tempC != null ? Math.round(tempFromC(tempC, units)) : '—'
            const popText = item?.pop != null ? percentFromPop(item.pop) : ''

            return (
              <div key={item.dt} className={styles.item} role="listitem">
                <div className={styles.time}>{timeText}</div>
                {iconUrl ? <img className={styles.icon} src={iconUrl} alt="" /> : null}
                <div className={styles.temp}>
                  {tempValue} {units === 'f' ? '°F' : '°C'}
                </div>
                {popText ? <div className={styles.pop}>Осадки: {popText}</div> : null}
              </div>
            )
          })
        ) : (
          <Typography.Text type="secondary">Нет данных</Typography.Text>
        )}
      </div>
    </div>
  )
}

ForecastHourList.propTypes = {
  timezoneOffsetSeconds: PropTypes.number.isRequired,
  forecast: PropTypes.object,
  units: PropTypes.oneOf(['c', 'f']).isRequired,
  nowUnixSeconds: PropTypes.number,
}

