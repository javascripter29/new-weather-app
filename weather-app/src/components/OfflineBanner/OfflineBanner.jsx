import { Alert } from 'antd'
import { useEffect, useState } from 'react'

export const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <Alert
      style={{ marginBottom: 12 }}
      title="Данные могут быть устаревшими"
      type="warning"
      showIcon
    />
  )
}

