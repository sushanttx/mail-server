import React from 'react'
import { InboxIcon, StarIcon, ExclamationTriangleIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  activeTab: 'all' | 'inbox' | 'spam' | 'trash'
  onTabChange: (tab: 'all' | 'inbox' | 'spam' | 'trash') => void
}

const Sidebar = ({ isCollapsed, onToggle, activeTab, onTabChange }: SidebarProps) => {
  const tabs = [
    { id: 'all', label: 'All', icon: InboxIcon },
    { id: 'inbox', label: 'Inbox', icon: InboxIcon },
    { id: 'spam', label: 'Spam', icon: ExclamationTriangleIcon },
    { id: 'trash', label: 'Recycle Bin', icon: TrashIcon }
  ]

  return (
    <aside
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } bg-sidebar-light dark:bg-sidebar-dark border-r border-gray-200 dark:border-gray-700 transition-all duration-300 relative`}
    >
      <nav className="mt-4">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id as 'all' | 'inbox' | 'spam' | 'trash')}
            className={`w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              activeTab === id ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
          >
            <Icon className="h-5 w-5" />
            {!isCollapsed && (
              <span className="ml-3 flex-1 text-left">{label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Toggle button positioned at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
          {!isCollapsed && (
            <span className="ml-2 text-sm">Collapse</span>
          )}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar 