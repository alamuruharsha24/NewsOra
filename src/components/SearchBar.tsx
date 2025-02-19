import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function SearchBar({ search, onSearchChange }: SearchBarProps) {
  return (
    <div className="relative max-w-md w-full">
      <input
        type="text"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search news..."
        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                 bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    </div>
  );
}