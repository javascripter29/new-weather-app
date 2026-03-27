import PropTypes from 'prop-types'
import { createContext, createElement, useContext, useEffect, useMemo, useReducer } from 'react'

const STORAGE_KEYS = {
  theme: 'weather.theme',
  units: 'weather.units',
}

const THEMES = /** @type {const} */ ({
  light: 'light',
  dark: 'dark',
})

const UNITS = /** @type {const} */ ({
  c: 'c',
  f: 'f',
})

const getInitialTheme = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.theme)
  if (stored === THEMES.light || stored === THEMES.dark) return stored

  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches
  return prefersDark ? THEMES.dark : THEMES.light
}

const getInitialUnits = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.units)
  if (stored === UNITS.c || stored === UNITS.f) return stored
  return UNITS.c
}

const initialState = {
  theme: THEMES.light,
  units: UNITS.c,
  city: null,
}

const WeatherStoreContext = createContext(null)

const reducer = (state, action) => {
  switch (action.type) {
    case 'setTheme':
      return { ...state, theme: action.value }
    case 'toggleTheme':
      return { ...state, theme: state.theme === THEMES.dark ? THEMES.light : THEMES.dark }
    case 'setUnits':
      return { ...state, units: action.value }
    case 'toggleUnits':
      return { ...state, units: state.units === UNITS.c ? UNITS.f : UNITS.c }
    case 'setCity':
      return { ...state, city: action.value }
    case 'clearCity':
      return { ...state, city: null }
    default:
      return state
  }
}

export const WeatherStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, () => ({
    theme: getInitialTheme(),
    units: getInitialUnits(),
  }))

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
    localStorage.setItem(STORAGE_KEYS.theme, state.theme)
  }, [state.theme])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.units, state.units)
  }, [state.units])

  const value = useMemo(() => ({ ...state, dispatch }), [state])

  return createElement(WeatherStoreContext.Provider, { value }, children)
}

WeatherStoreProvider.propTypes = {
  children: PropTypes.node,
}

export const useWeatherStore = () => {
  const ctx = useContext(WeatherStoreContext)
  if (!ctx) throw new Error('useWeatherStore must be used within WeatherStoreProvider')
  return ctx
}

export const WEATHER_STORE = {
  THEMES,
  UNITS,
}

