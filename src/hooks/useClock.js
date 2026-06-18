import { useEffect, useState } from 'react'

export function useClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => window.clearInterval(timerId)
  }, [])

  return now
}
