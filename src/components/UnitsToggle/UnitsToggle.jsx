import { Button } from 'antd'
import { useWeatherStore, WEATHER_STORE } from '../../store/weatherStore.js'

export const UnitsToggle = () => {
  const { units, dispatch } = useWeatherStore()

  const handleToggle = () => {
    dispatch({ type: 'toggleUnits' })
  }

  return (
    <Button aria-label="Переключить единицы" onClick={handleToggle}>
      <span style={{ fontWeight: units === WEATHER_STORE.UNITS.c ? 800 : 500 }}>°C</span>
      <span style={{ margin: '0 6px', color: 'var(--text-muted)' }}>/</span>
      <span style={{ fontWeight: units === WEATHER_STORE.UNITS.f ? 800 : 500 }}>°F</span>
    </Button>
  )
}

