import React, { useState, useCallback } from 'react';
import { FileSpreadsheet, Download } from 'lucide-react';
import Dropzone from './components/Dropzone';
import ConversionProgress from './components/ConversionProgress';
import ErrorDisplay from './components/ErrorDisplay';
import { processImage } from './utils/imageProcessing';

interface ProcessingError {
  fileName: string;
  message: string;
}

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processingErrors, setProcessingErrors] = useState<Record<string, string>>({});

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    if (converting) return;
    
    setFiles(prev => [...prev, ...acceptedFiles]);
    setError(null);
    setProcessingErrors({});
    setDownloadUrl(null);
  }, [converting]);

  const handleRemove = useCallback((fileToRemove: File) => {
    if (converting) return;
    
    setFiles(prev => prev.filter(file => file !== fileToRemove));
    setError(null);
    setProcessingErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fileToRemove.name];
      return newErrors;
    });
    setDownloadUrl(null);
  }, [converting]);

  const handleConvert = async () => {
    if (!import.meta.env.VITE_TOGETHER_API_KEY) {
      setError('API key not configured. Please add VITE_TOGETHER_API_KEY to your environment.');
      return;
    }

    if (files.length === 0) {
      setError('Please select at least one invoice image to process.');
      return;
    }

    setConverting(true);
    setProgress(0);
    setError(null);
    setProcessingErrors({});
    setDownloadUrl(null);
    
    let csvContent = '';
    const errors: ProcessingError[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        try {
          const result = await processImage(files[i]);
          // Only add headers from the first successful result
          if (csvContent === '' && result.includes('date opération')) {
            csvContent = result;
          } else {
            // For subsequent results, skip the header line
            const lines = result.split('\n');
            if (lines.length > 1) {
              csvContent += lines.slice(1).join('\n');
            }
          }
        } catch (err) {
          errors.push({
            fileName: files[i].name,
            message: err instanceof Error ? err.message : 'Failed to process image'
          });
        }
        setProgress(i + 1);
      }
      
      if (errors.length > 0) {
        const errorMap = errors.reduce((acc, { fileName, message }) => {
          acc[fileName] = message;
          return acc;
        }, {} as Record<string, string>);
        setProcessingErrors(errorMap);
      }

      if (!csvContent || csvContent.trim() === '') {
        throw new Error('No valid data could be extracted from any of the images');
      }
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing images. Please try again.');
    } finally {
      setConverting(false);
    }
  };

  const resetState = useCallback(() => {
    setFiles([]);
    setDownloadUrl(null);
    setProcessingErrors({});
    setError(null);
    setProgress(0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FileSpreadsheet className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Invoice Scanner
          </h1>
          <p className="text-lg text-gray-600">
            Convert invoice images to CSV with AI-powered OCR
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8">
          <Dropzone
            files={files}
            onDrop={handleDrop}
            onRemove={handleRemove}
            disabled={converting}
          />

          <ErrorDisplay error={error} processingErrors={processingErrors} />

          {files.length > 0 && !converting && !downloadUrl && (
            <button
              onClick={handleConvert}
              className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg
                hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={files.length === 0 || converting}
            >
              Process {files.length} {files.length === 1 ? 'Invoice' : 'Invoices'}
            </button>
          )}

          {converting && (
            <div className="mt-6">
              <ConversionProgress progress={progress} total={files.length} />
            </div>
          )}

          {downloadUrl && (
            <div className="mt-6">
              <a
                href={downloadUrl}
                download="processed_invoices.csv"
                className="flex items-center justify-center w-full bg-green-600 text-white
                  py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Download className="h-5 w-5 mr-2" />
                Download CSV
              </a>
              <button
                onClick={resetState}
                className="mt-4 w-full text-gray-600 py-2 px-4 rounded-lg
                  hover:bg-gray-100 transition-colors text-sm"
              >
                Process More Invoices
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;