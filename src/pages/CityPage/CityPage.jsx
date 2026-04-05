import { Space, Typography, Alert } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { SearchBar } from '../../components/SearchBar/SearchBar.jsx'
import { WeatherCard } from '../../components/WeatherCard/WeatherCard.jsx'
import { useWeatherStore } from '../../store/weatherStore.js'
import { getCitiesByQuery } from '../../api/weatherApi.js'
import styles from './CityPage.module.css'

export const CityPage = () => {
  const { name } = useParams()
  const { city, dispatch } = useWeatherStore()
  const [errorMessage, setErrorMessage] = useState('')
  const [isResolving, setIsResolving] = useState(false)

  const decodedName = useMemo(() => decodeURIComponent(name ?? ''), [name])

  useEffect(() => {
    setErrorMessage('')
    if (!decodedName) return
    if (city?.name) return
    // На случай прямой загрузки `/city/:name` без выбора на главной.
    const resolveByName = async () => {
      setIsResolving(true)
      try {
        const results = await getCitiesByQuery(decodedName, 5)
        const first = results?.[0]
        if (!first) {
          setErrorMessage('Город не найден')
          return
        }
        dispatch({
          type: 'setCity',
          value: {
            name: first.name,
            state: first.state,
            country: first.country,
            lat: first.lat,
            lon: first.lon,
          },
        })
      } catch (error) {
        setErrorMessage(error?.message ?? 'Не удалось загрузить данные')
      } finally {
        setIsResolving(false)
      }
    }

    resolveByName()
  }, [city?.name, decodedName, dispatch])

  return (
    <div className={styles.page}>
      <Space orientation="vertical" size={12} style={{ width: '100%' }}>
        <Typography.Title level={2} className={styles.title}>
          {city?.name ?? decodedName}
        </Typography.Title>
        <SearchBar placeholder="Найти другой город" />
        {errorMessage ? <Alert type="error" showIcon message={errorMessage} /> : null}
        {isResolving ? (
          <Typography.Text type="secondary">Загружаем город...</Typography.Text>
        ) : null}
        {city ? <WeatherCard /> : null}
      </Space>
    </div>
  )
}

