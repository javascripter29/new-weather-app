import { Button } from 'antd'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { useWeatherStore, WEATHER_STORE } from '../../store/weatherStore.js'

export const ThemeToggle = () => {
  const { theme, dispatch } = useWeatherStore()

  const handleToggle = () => {
    dispatch({ type: 'toggleTheme' })
  }

  const isDark = theme === WEATHER_STORE.THEMES.dark

  return (
    <Button
      aria-label="Переключить тему"
      icon={isDark ? <SunOutlined /> : <MoonOutlined />}
      onClick={handleToggle}
    />
  )
}

