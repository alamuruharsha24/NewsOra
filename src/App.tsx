import { useState, useEffect } from 'react';
import { Moon, Sun, Newspaper } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { NewsSection } from './components/NewsSection';
import { useNews } from './hooks/useNews';
import type { NewsSection as NewsSectionType } from './types';

const NEWS_SECTIONS: NewsSectionType[] = [
  {
    id: 'hindu',
    name: 'The Hindu',
    color: 'text-blue-600 dark:text-blue-400',
    rssUrl: 'https://www.thehindu.com/news/feeder/default.rss',
  },
  {
    id: 'express',
    name: 'The Indian Express',
    color: 'text-red-600 dark:text-red-400',
    rssUrl: 'https://indianexpress.com/feed/',
  },
  {
    id: 'toi',
    name: 'Times of India',
    color: 'text-purple-600 dark:text-purple-400',
    rssUrl: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
  },
];

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [search, setSearch] = useState('');

  // Fetch news for each section
  const sections = NEWS_SECTIONS.map(section => ({
    ...section,
    ...useNews(section.rssUrl),
  }));

  // Apply and persist dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Filter articles with optional chaining
  const filteredSections = sections.map(section => ({
    ...section,
    articles: section.articles.filter(article =>
      article.title?.toLowerCase().includes(search.toLowerCase()) ||
      article.description?.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  return (
    <>
      <style>{`
        html, body {
          scroll-behavior: smooth;
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar {
          display: none;
        }
        html, body {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;     /* Firefox */
        }
      `}</style>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Responsive Header */}
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-3">
                <Newspaper className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold">NewsOra</h1>
              </div>
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <div className="flex-1 max-w-xl">
                  <SearchBar search={search} onSearchChange={setSearch} />
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSections.map(section => (
              <NewsSection
                key={section.id}
                section={section}
                articles={section.articles}
                isLoading={section.isLoading}
                error={section.error}
              />
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 shadow-md mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-gray-600 dark:text-gray-400">
              © 2025 NewsOra. Powered by RSS feeds from The Hindu, The Indian Express, and Times of India.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;