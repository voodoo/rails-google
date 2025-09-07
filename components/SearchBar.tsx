import React from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: (query: string) => void;
  isLoading: boolean;
  suggestions: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, onSearch, isLoading, suggestions }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., What is the release date for Rails 8?"
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400 dark:text-gray-500"/>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-red-400 dark:disabled:bg-red-800 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900 focus:ring-red-500"
        >
          {isLoading ? 'Thinking...' : 'Ask'}
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2 items-center justify-center sm:justify-start">
        <span className="text-sm text-gray-600 dark:text-gray-500 mr-2">Try:</span>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={isLoading}
            className="px-3 py-1 bg-gray-200 text-gray-700 dark:bg-gray-700/50 dark:text-gray-300 text-sm rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};