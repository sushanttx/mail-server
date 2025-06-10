import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'

interface NavbarProps {
  isDarkMode: boolean
  onThemeToggle: () => void
}

const Navbar = ({ isDarkMode, onThemeToggle }: NavbarProps) => {
  return (
    <nav className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-background-dark">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary-light dark:text-primary-dark">
            Inboxtor
          </h1>
        </div>
        <button
          onClick={onThemeToggle}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <SunIcon className="h-6 w-6 text-gray-200" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>
    </nav>
  )
}

export default Navbar 