import React from 'react';
import { Loader2 } from 'lucide-react';

interface ConversionProgressProps {
  progress: number;
  total: number;
}

export default function ConversionProgress({ progress, total }: ConversionProgressProps) {
  const percentage = Math.round((progress / total) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Converting images...</span>
        <span className="text-sm text-gray-500">{`${progress} of ${total}`}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center justify-center mt-4 text-blue-600">
        <Loader2 className="animate-spin h-5 w-5 mr-2" />
        <span className="text-sm">Processing...</span>
      </div>
    </div>
  );
}