import { useDebugValue, useEffect, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    const existingValue = window.localStorage.getItem(key)
    if (existingValue !== null) {
      return JSON.parse(existingValue)
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue
  })

  // useDebugValue: shows a readable label for this hook in React DevTools.
  // The formatter function is only called when DevTools is open.
  useDebugValue(storedValue, (v) =>
    Array.isArray(v)
      ? `${key} — ${v.length} item${v.length !== 1 ? 's' : ''}`
      : `${key}: ${JSON.stringify(v).slice(0, 30)}`,
  )

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue))
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
