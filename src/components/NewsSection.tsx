// import React from 'react';
import { Loader2 } from 'lucide-react';
import type { NewsArticle, NewsSection as NewsSectionType } from '../types';
import { NewsCard } from './NewsCard';

interface NewsSectionProps {
  section: NewsSectionType;
  articles: NewsArticle[];
  isLoading: boolean;
  error: string | null;
}
//news section 
export function NewsSection({ section, articles, isLoading, error }: NewsSectionProps) {
  return (
    <>
      <style>{`
        .custom-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
          scroll-behavior: smooth; /* Smooth scrolling */
        }
        .custom-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, and Opera */
        }
      `}</style>
      <div className="flex-1 min-w-0 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className={`text-xl font-bold mb-4 ${section.color} font-serif`}>{section.name}</h2>
        <div className="h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : articles.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No articles found</div>
          ) : (
            <div className="space-y-4">
              {articles.map((article, index) => (
                <NewsCard key={index} article={article} color={section.color} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}