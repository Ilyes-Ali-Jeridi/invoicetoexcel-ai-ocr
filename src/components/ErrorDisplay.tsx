import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
  processingErrors: Record<string, string>;
}

export default function ErrorDisplay({ error, processingErrors }: ErrorDisplayProps) {
  if (!error && Object.keys(processingErrors).length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mt-4">
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {Object.keys(processingErrors).length > 0 && (
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Processing Warnings:</h3>
          <ul className="list-disc list-inside text-sm text-yellow-700">
            {Object.entries(processingErrors).map(([filename, error]) => (
              <li key={filename}>
                <span className="font-medium">{filename}</span>: {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}