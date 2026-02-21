import { useThemeStore } from '../../store/useThemeStore'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeStore()
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
