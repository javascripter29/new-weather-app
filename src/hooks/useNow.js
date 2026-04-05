import { useEffect, useState } from 'react'

export const useNow = (intervalMs = 60_000) => {
  const [nowMs, setNowMs] = useState(null)

  useEffect(() => {
    const tick = () => setNowMs(Date.now())
    tick()
    const id = setInterval(tick, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return nowMs
}

