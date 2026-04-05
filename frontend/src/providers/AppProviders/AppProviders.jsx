import PropTypes from 'prop-types'
import { ConfigProvider, theme as antdTheme } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WeatherStoreProvider, useWeatherStore } from '../../store/weatherStore.js'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

const AntdThemeBridge = ({ children }) => {
  const { theme } = useWeatherStore()

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: 'var(--accent)',
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

AntdThemeBridge.propTypes = {
  children: PropTypes.node,
}

export const AppProviders = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WeatherStoreProvider>
        <AntdThemeBridge>{children}</AntdThemeBridge>
      </WeatherStoreProvider>
    </QueryClientProvider>
  )
}

AppProviders.propTypes = {
  children: PropTypes.node,
}

