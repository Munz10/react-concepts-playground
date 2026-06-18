import { useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { ThemeContext } from './theme-context.js'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage(
    'react-concepts-playground.theme',
    'sunrise',
  )

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme === 'night' ? 'night' : 'sunrise'
  }, [theme])

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === 'night' ? 'sunrise' : 'night',
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
