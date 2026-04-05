import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'weather.favorites'
const MAX_FAVORITES = 10

const normalizeCoord = (value) => Math.round(Number(value) * 1000) / 1000

const getKey = (city) => {
  if (!city) return ''
  const lat = normalizeCoord(city.lat)
  const lon = normalizeCoord(city.lon)
  return `${lat},${lon}`
}

const toCityData = (city) => {
  if (!city) return null
  return {
    name: city.name,
    state: city.state,
    country: city.country,
    lat: Number(city.lat),
    lon: Number(city.lon),
  }
}

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(toCityData).filter(Boolean)
  } catch {
    return []
  }
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => readStorage())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const favoritesByKey = useMemo(() => {
    const map = new Map()
    favorites.forEach((city) => map.set(getKey(city), city))
    return map
  }, [favorites])

  const isFavorite = (city) => {
    if (!city) return false
    return favoritesByKey.has(getKey(city))
  }

  const addFavorite = (city) => {
    const nextCity = toCityData(city)
    if (!nextCity) return
    const key = getKey(nextCity)

    if (favoritesByKey.has(key)) return

    setFavorites((prev) => {
      const existing = prev.filter((c) => getKey(c) !== key)
      const next = [nextCity, ...existing]
      return next.slice(0, MAX_FAVORITES)
    })
  }

  const removeFavorite = (city) => {
    const nextCity = toCityData(city)
    if (!nextCity) return
    const key = getKey(nextCity)
    setFavorites((prev) => prev.filter((c) => getKey(c) !== key))
  }

  const toggleFavorite = (city) => {
    if (isFavorite(city)) removeFavorite(city)
    else addFavorite(city)
  }

  const clearFavorites = () => setFavorites([])

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
  }
}

