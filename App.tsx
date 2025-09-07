import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ResultDisplay } from './components/ResultDisplay';
import { SourceList } from './components/SourceList';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Feedback } from './components/Feedback';
import { fetchRailsInfo } from './services/geminiService';
import type { GroundingChunk } from './types';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('What are the expected features in Rails 8?');
  const [result, setResult] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackKey, setFeedbackKey] = useState<number>(0);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme') as Theme;
      // Also respect user's OS preference
      const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
      if (storedTheme) return storedTheme;
      if (userMedia.matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const suggestedTopics = [
    'Rails 8 release date',
    'New features in Rails 8',
    'Rails 8 performance improvements',
    'Upgrading to Rails 8',
  ];

  const handleSearch = useCallback(async (currentQuery: string) => {
    if (!currentQuery.trim()) {
      setError('Please enter a question about Rails 8.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setSources([]);
    setQuery(currentQuery);
    setFeedbackKey(key => key + 1); // Reset feedback component for new search

    try {
      const { text, groundingChunks } = await fetchRailsInfo(currentQuery);
      setResult(text);
      setSources(groundingChunks || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    handleSearch('What are the expected features in Rails 8?');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header theme={theme} toggleTheme={toggleTheme} />
        
        <main>
          <SearchBar
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            isLoading={isLoading}
            suggestions={suggestedTopics}
          />

          {isLoading && <LoadingSpinner />}

          {error && (
            <div className="mt-8 bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/50 dark:border-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {result && !isLoading && (
            <div className="mt-8 space-y-8">
              <ResultDisplay result={result} />
              {sources.length > 0 && <SourceList sources={sources} />}
            </div>
          )}
          
          {!isLoading && !result && !error && (
             <div className="mt-8 text-center text-gray-500 dark:text-gray-400">
               <p>Ask a question about Ruby on Rails 8 to get started.</p>
             </div>
          )}
        </main>
        
        <footer className="text-center text-gray-500 dark:text-gray-600 mt-12 text-sm">
          {result && !isLoading && (
            <Feedback key={feedbackKey} query={query} />
          )}
          <div className="space-y-1 mt-4">
            <p>Powered by Google Gemini API. Information is AI-generated and may require verification.</p>
            <p>
              Model: gemini-2.5-flash |{' '}
              <a 
                href="https://ai.google.dev/gemini-api/docs" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="underline hover:text-gray-700 dark:hover:text-gray-400 transition-colors"
              >
                Gemini API Docs
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;