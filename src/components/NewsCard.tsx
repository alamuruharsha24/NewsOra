import React, { useState } from 'react';
import { Share2, ExternalLink, Clock } from 'lucide-react';
import type { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
  color: string;
}

export function NewsCard({ article, color }: NewsCardProps) {
  const [isSharing, setIsSharing] = useState(false);
  const formattedDate = new Date(article.publishedAt).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const shareNews = async () => {
    if (isSharing) return;

    try {
      setIsSharing(true);
      
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          url: article.url,
        });
      } else {
        await navigator.clipboard.writeText(`${article.title}\n${article.url}`);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="p-3 border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
      <div className="flex justify-between items-start gap-3">
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex-1"
        >
          <h3 className={`font-serif text-base leading-tight hover:${color} transition-colors`}>
            {article.title}
          </h3>
        </a>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={shareNews}
            disabled={isSharing}
            className={`p-1.5 rounded-full transition-colors ${
              isSharing 
                ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={navigator.share ? 'Share' : 'Copy link'}
          >
            <Share2 className={`w-3.5 h-3.5 ${
              isSharing 
                ? 'text-gray-400 dark:text-gray-500' 
                : 'text-gray-600 dark:text-gray-400'
            }`} />
          </button>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Open article"
          >
            <ExternalLink className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
          </a>
        </div>
      </div>
      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
        <Clock className="w-3 h-3 mr-1" />
        <span>{formattedDate}</span>
      </div>
    </div>
  );
}