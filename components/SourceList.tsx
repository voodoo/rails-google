import React from 'react';
import type { GroundingChunk } from '../types';

interface SourceListProps {
  sources: GroundingChunk[];
}

export const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  return (
    <div className="bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-red-500 dark:text-red-400">Sources</h3>
      <ul className="space-y-3">
        {sources.map((source, index) => (
          <li key={index} className="flex items-start">
            <span className="text-red-500 mr-3 mt-1">&#10142;</span>
            <a
              href={source.web.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors break-all"
            >
              {source.web.title || source.web.uri}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};