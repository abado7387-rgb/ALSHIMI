import React from 'react';
import { View } from '../types';
import { ListIcon, CalendarIcon, SunIcon, MoonIcon } from './icons/Icons';
import { SyncStatus } from './SyncStatus';
import { Logo } from './icons/Logo';
import { InstallPWAButton } from './InstallPWAButton';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView, isDarkMode, toggleDarkMode }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Logo className="h-8 w-8" />
            <h1 className="text-2xl font-bold text-primary hidden sm:block">DailyTasks Pro</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <nav className="hidden sm:flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              <button
                onClick={() => setCurrentView(View.List)}
                className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  currentView === View.List ? 'bg-primary text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <ListIcon className="h-5 w-5 mr-2" />
                List
              </button>
              <button
                onClick={() => setCurrentView(View.Calendar)}
                className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  currentView === View.Calendar ? 'bg-primary text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <CalendarIcon className="h-5 w-5 mr-2" />
                Calendar
              </button>
            </nav>
            <InstallPWAButton />
            <SyncStatus />
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isDarkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};