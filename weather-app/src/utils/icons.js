export const getOwmIconUrl = (iconCode, size = 2) => {
  if (!iconCode) return ''
  return `https://openweathermap.org/img/wn/${iconCode}@${size}x.png`
}

