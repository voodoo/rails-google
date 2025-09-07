import React from 'react';
import { RailsIcon } from './icons/RailsIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <header className="relative text-center mb-8">
      <div className="flex items-center justify-center gap-4 mb-4">
        <RailsIcon className="h-16 w-16 text-red-600" />
        <h1 className="text-5xl font-bold tracking-tight text-black dark:text-white">
          Rails 8 <span className="text-red-600">Info Hub</span>
        </h1>
      </div>
      <p className="text-lg text-gray-600 dark:text-gray-400">
        Your AI-powered source for the latest on Ruby on Rails 8.
      </p>
      <button
        onClick={toggleTheme}
        className="absolute top-0 right-0 p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <MoonIcon className="h-6 w-6" />
        ) : (
          <SunIcon className="h-6 w-6" />
        )}
      </button>
    </header>
  );
};