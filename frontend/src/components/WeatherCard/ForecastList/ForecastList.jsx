import PropTypes from 'prop-types'
import { Skeleton, Typography } from 'antd'
import { useMemo } from 'react'
import { getOwmIconUrl } from '../../../utils/icons.js'
import {
  formatDayOfWeekShort,
  formatDateDM,
  percentFromPop,
  tempFromC,
} from '../../../utils/formatters.js'
import styles from './ForecastList.module.css'

const dayKey = (unixSeconds, tz) => {
  const dt = new Date((unixSeconds + tz) * 1000)
  const y = dt.getUTCFullYear()
  const m = dt.getUTCMonth() + 1
  const d = dt.getUTCDate()
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export const ForecastList = ({ timezoneOffsetSeconds, forecast, units }) => {
  const days = useMemo(() => {
    const list = forecast?.list ?? []
    if (!list.length) return []

    const groups = new Map()

    for (const item of list) {
      const key = dayKey(item.dt, timezoneOffsetSeconds)
      if (!groups.has(key)) {
        groups.set(key, {
          key,
          items: [],
        })
      }
      groups.get(key).items.push(item)
    }

    const results = Array.from(groups.values()).map((group) => {
      const items = group.items
      const temps = items.map((i) => i?.main?.temp_max).filter((t) => typeof t === 'number')
      const mins = items.map((i) => i?.main?.temp_min).filter((t) => typeof t === 'number')
      const maxTempC = temps.length ? Math.max(...temps) : null
      const minTempC = mins.length ? Math.min(...mins) : null

      const pops = items.map((i) => i?.pop).filter((p) => typeof p === 'number')
      const popAvg = pops.length ? pops.reduce((a, b) => a + b, 0) / pops.length : null

      const iconCode = items[0]?.weather?.[0]?.icon
      const dtFirst = items[0]?.dt

      const date = dtFirst ? new Date((dtFirst + timezoneOffsetSeconds) * 1000) : null

      return {
        dayKey: group.key,
        date,
        maxTempC,
        minTempC,
        popAvg,
        iconCode,
      }
    })

    results.sort((a, b) => (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0))
    return results.slice(0, 7)
  }, [forecast?.list, timezoneOffsetSeconds])

  if (!forecast) return <Skeleton active />

  return (
    <div className={styles.wrap} aria-label="Прогноз на 7 дней">
      {days.length ? (
        days.map((d) => {
          const dow = d.date ? formatDayOfWeekShort(d.date) : ''
          const dm = d.date ? formatDateDM(d.date) : ''
          const iconUrl = getOwmIconUrl(d.iconCode, 2)
          const maxValue = d.maxTempC != null ? Math.round(tempFromC(d.maxTempC, units)) : '—'
          const minValue = d.minTempC != null ? Math.round(tempFromC(d.minTempC, units)) : '—'
          const popText = d.popAvg != null ? percentFromPop(d.popAvg) : ''

          return (
            <div key={d.dayKey || d.date?.toISOString()} className={styles.day}>
              <div className={styles.dayMeta}>
                <div className={styles.dow}>{dow}</div>
                <div className={styles.dateDM}>{dm}</div>
              </div>
              <div className={styles.main}>
                <div className={styles.left}>
                  {iconUrl ? <img className={styles.icon} src={iconUrl} alt="" /> : null}
                  <div className={styles.temps}>
                    <span className={styles.max}>
                      {maxValue} {units === 'f' ? '°F' : '°C'}
                    </span>
                    <span className={styles.min}>
                      {minValue} {units === 'f' ? '°F' : '°C'}
                    </span>
                  </div>
                </div>
                {popText ? <div className={styles.pop}>Вероятность: {popText}</div> : null}
              </div>
            </div>
          )
        })
      ) : (
        <Typography.Text type="secondary">Нет данных</Typography.Text>
      )}
    </div>
  )
}

ForecastList.propTypes = {
  timezoneOffsetSeconds: PropTypes.number.isRequired,
  forecast: PropTypes.object,
  units: PropTypes.oneOf(['c', 'f']).isRequired,
}

