import React, { useState } from 'react';

interface FeedbackProps {
  query: string;
}

const FEEDBACK_STORAGE_KEY = 'rails8-info-hub-feedback';

interface FeedbackEntry {
  query: string;
  feedback: 'yes' | 'no';
  timestamp: number;
}

export const Feedback: React.FC<FeedbackProps> = ({ query }) => {
  const [feedbackState, setFeedbackState] = useState<'prompt' | 'submitted'>('prompt');

  const handleFeedback = (feedback: 'yes' | 'no') => {
    try {
      const existingFeedbackStr = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      const allFeedback: FeedbackEntry[] = existingFeedbackStr ? JSON.parse(existingFeedbackStr) : [];
      
      const newFeedback: FeedbackEntry = {
        query,
        feedback,
        timestamp: Date.now(),
      };
      
      allFeedback.push(newFeedback);
      
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(allFeedback));
    } catch (error) {
      console.error("Failed to save feedback to localStorage:", error);
    }
    
    setFeedbackState('submitted');
  };

  if (feedbackState === 'submitted') {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
        <p>Thank you for your feedback!</p>
      </div>
    );
  }

  return (
    <div className="text-center mt-4 flex items-center justify-center gap-4">
      <p className="text-gray-600 dark:text-gray-400">Was this response helpful?</p>
      <div className="flex gap-2">
        <button
          onClick={() => handleFeedback('yes')}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-green-200 dark:hover:bg-green-700/50 hover:border-green-400 dark:hover:border-green-600 border border-transparent transition-colors"
          aria-label="Yes, this response was helpful"
        >
          Yes
        </button>
        <button
          onClick={() => handleFeedback('no')}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-sm rounded-md hover:bg-red-200 dark:hover:bg-red-800/50 hover:border-red-400 dark:hover:border-red-700 border border-transparent transition-colors"
          aria-label="No, this response was not helpful"
        >
          No
        </button>
      </div>
    </div>
  );
};