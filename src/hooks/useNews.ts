import { useState, useEffect } from 'react';
import type { NewsArticle } from '../types';

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const MAX_NEWS_ITEMS = 10;

export function useNews(rssUrl: string) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`${CORS_PROXY}${encodeURIComponent(rssUrl)}`, {
          signal: abortController.signal
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
          throw new Error('Failed to parse RSS feed');
        }

        const items = Array.from(xmlDoc.querySelectorAll('item')).slice(0, MAX_NEWS_ITEMS);
        const feedTitle = xmlDoc.querySelector('channel > title')?.textContent || '';
        
        const formattedArticles: NewsArticle[] = items.map(item => ({
          title: item.querySelector('title')?.textContent || '',
          url: item.querySelector('link')?.textContent || '',
          publishedAt: item.querySelector('pubDate')?.textContent || new Date().toISOString(),
          source: {
            name: feedTitle,
          },
        })).filter(article => article.title && article.url);

        if (!abortController.signal.aborted) {
          setArticles(formattedArticles);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error('Error fetching news:', err);
          setError(err instanceof Error ? err.message : 'Failed to fetch news');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => {
      abortController.abort();
      clearInterval(interval);
    };
  }, [rssUrl]);

  return { articles, isLoading, error };
}