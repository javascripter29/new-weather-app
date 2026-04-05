import { useState } from 'react'
import { reverseGeocode } from '../api/weatherApi.js'

export const useGeolocation = () => {
  const [isLoading, setIsLoading] = useState(false)

  const getMyLocation = async () => {
    if (!navigator.geolocation) {
      throw new Error('Геолокация недоступна в этом браузере.')
    }

    setIsLoading(true)

    const coords = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        },
        (error) => reject(error),
        { enableHighAccuracy: true, maximumAge: 60_000, timeout: 15_000 },
      )
    })

    try {
      const geo = await reverseGeocode(coords.lat, coords.lon)
      if (!geo) throw new Error('Не удалось определить название города.')
      return geo
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, getMyLocation }
}

