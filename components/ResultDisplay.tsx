import React, { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ResultDisplayProps {
  result: string;
}

// Helper function to parse inline markdown for bold and italic text
const parseInlineMarkdown = (text: string): React.ReactNode => {
    // Regex to find either bold (**text**) or italic (*text*).
    const combinedRegex = /(\*\*(.*?)\*\*)|(\*(.*?)\*)/g;
    const segments = [];
    let lastIndex = 0;
    let match;

    while ((match = combinedRegex.exec(text)) !== null) {
        // Add the plain text before the match
        if (match.index > lastIndex) {
            segments.push(text.substring(lastIndex, match.index));
        }

        // Check if it was a bold match (groups 1 & 2) or italic (groups 3 & 4)
        if (match[1]) { // Bold match: **text**
            segments.push(<strong key={lastIndex}>{match[2]}</strong>);
        } else if (match[3]) { // Italic match: *text*
            segments.push(<em key={lastIndex}>{match[4]}</em>);
        }
        
        lastIndex = match.index + match[0].length;
    }

    // Add any remaining text after the last match
    if (lastIndex < text.length) {
        segments.push(text.substring(lastIndex));
    }
    
    // Wrap in fragments with keys for React
    return segments.map((segment, index) => <React.Fragment key={index}>{segment}</React.Fragment>);
};

// Helper function to format the entire text block, handling headings, paragraphs and lists
const formatText = (text: string): React.ReactNode[] => {
    const blocks: React.ReactNode[] = [];
    const lines = text.split('\n');
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // Check for headings
        if (trimmedLine.startsWith('### ')) {
            blocks.push(<h3 key={`h3-${i}`}>{parseInlineMarkdown(trimmedLine.substring(4))}</h3>);
            i++;
        } else if (trimmedLine.startsWith('## ')) {
            blocks.push(<h2 key={`h2-${i}`}>{parseInlineMarkdown(trimmedLine.substring(3))}</h2>);
            i++;
        } else if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
            // Check for list items
            const listItems = [];
            // Group all consecutive list items
            while (i < lines.length && (lines[i].trim().startsWith('* ') || lines[i].trim().startsWith('- '))) {
                const currentLine = lines[i].trim();
                // Remove the list marker ('* ' or '- ') before parsing inline styles
                listItems.push(
                    <li key={`li-${i}`}>{parseInlineMarkdown(currentLine.substring(2))}</li>
                );
                i++;
            }
            blocks.push(<ul key={`ul-${i}`} className="list-disc space-y-1 pl-5 mb-4">{listItems}</ul>);
        } else if (trimmedLine !== '') {
            // It's a paragraph
            blocks.push(<p key={`p-${i}`} className="mb-4">{parseInlineMarkdown(line)}</p>);
            i++;
        } else {
            // It's an empty line, so we skip it
            i++;
        }
    }

    return blocks;
};


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (isCopied) return;

    try {
      await navigator.clipboard.writeText(result);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500); // Revert back after 2.5 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative group bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-6 rounded-lg">
      <button
        onClick={handleCopy}
        className={`absolute top-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-gray-200/60 dark:bg-gray-700/60 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-600 dark:text-gray-300
                    opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200
                    hover:bg-gray-300/80 dark:hover:bg-gray-600/80 hover:text-black dark:hover:text-white
                    disabled:cursor-not-allowed`}
        disabled={isCopied}
        aria-label="Copy AI analysis to clipboard"
      >
        {isCopied ? (
          <>
            <CheckIcon className="h-4 w-4 text-green-500 dark:text-green-400" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <CopyIcon className="h-4 w-4" />
            <span>Copy</span>
          </>
        )}
      </button>

      <h2 className="text-2xl font-bold mb-4 text-red-500 dark:text-red-400">AI Analysis</h2>
      <div className="prose prose-gray dark:prose-invert max-w-none">
          {formatText(result)}
      </div>
    </div>
  );
};