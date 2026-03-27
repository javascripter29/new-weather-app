const ruLocale = 'ru-RU'

export const formatTimeHHmm = (date) =>
  new Intl.DateTimeFormat(ruLocale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  }).format(date)

export const formatTimeHHmmInZone = (unixSeconds, timeZoneOffsetSeconds) => {
  const ms = (unixSeconds + timeZoneOffsetSeconds) * 1000
  const date = new Date(ms)
  return formatTimeHHmm(date)
}

export const formatDayOfWeekShort = (date) =>
  new Intl.DateTimeFormat(ruLocale, { weekday: 'short' }).format(date)

export const formatDateDM = (date) => {
  const d = new Intl.DateTimeFormat(ruLocale, { day: '2-digit' }).format(date)
  const m = new Intl.DateTimeFormat(ruLocale, { month: '2-digit' }).format(date)
  return `${d}.${m}`
}

export const cToF = (c) => c * (9 / 5) + 32

export const tempFromC = (tempC, units) => {
  if (units === 'f') return cToF(tempC)
  return tempC
}

export const windMpsToMph = (mps) => mps * 2.236936
export const windFromMps = (speedMps, units) => {
  if (units === 'f') return windMpsToMph(speedMps)
  return speedMps
}

export const windSpeedUnit = (units) => (units === 'f' ? 'mph' : 'м/с')

export const metersToMiles = (m) => m / 1609.344
export const visibilityFromMeters = (meters, units) => {
  if (units === 'f') return metersToMiles(meters)
  return meters
}

export const visibilityUnit = (units) => (units === 'f' ? 'mi' : 'м')

export const hPaToInHg = (hPa) => hPa * 0.0295299830714
export const pressureFromHpa = (hPa, units) => {
  if (units === 'f') return hPaToInHg(hPa)
  return hPa
}

export const pressureUnit = (units) => (units === 'f' ? 'inHg' : 'hPa')

export const degToCompass = (deg) => {
  if (typeof deg !== 'number') return ''
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(deg / 45) % 8
  return directions[index]
}

export const kelvinToC = (k) => k - 273.15

export const toFixedSmart = (value, digits = 0) => {
  const num = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(num)) return '—'
  return num.toFixed(digits)
}

export const percentFromPop = (pop) => {
  if (typeof pop !== 'number') return '—'
  return `${Math.round(pop * 100)}%`
}

export const uviToLevel = (uvi) => {
  if (typeof uvi !== 'number') return { label: '—', color: 'var(--border)' }
  if (uvi < 3) return { label: 'Низкий', color: '#22c55e' }
  if (uvi < 6) return { label: 'Умеренный', color: '#f59e0b' }
  if (uvi < 8) return { label: 'Высокий', color: '#f97316' }
  if (uvi < 11) return { label: 'Очень высокий', color: '#ef4444' }
  return { label: 'Экстремальный', color: '#b91c1c' }
}

