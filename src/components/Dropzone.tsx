import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';

interface DropzoneProps {
  files: File[];
  onDrop: (acceptedFiles: File[]) => void;
  onRemove: (file: File) => void;
  disabled?: boolean;
}

/**
 * A component that provides a drag-and-drop zone for file uploads.
 * It displays the list of selected files and allows for their removal.
 * @param {DropzoneProps} props - The props for the component.
 * @param {File[]} props.files - The list of files that have been selected.
 * @param {(acceptedFiles: File[]) => void} props.onDrop - Callback function for when files are dropped.
 * @param {(file: File) => void} props.onRemove - Callback function for when a file is removed.
 * @param {boolean} [props.disabled=false] - Whether the dropzone is disabled.
 */
export default function Dropzone({ files, onDrop, onRemove, disabled = false }: DropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: true,
    disabled
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive ? 'Drop the files here...' : 
           disabled ? 'Please wait while processing...' :
           'Drag & drop images here, or click to select files'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Supports PNG, JPG, JPEG, GIF, WEBP (max 10MB per file)
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 bg-white rounded-lg border"
            >
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700 truncate">
                  {file.name}
                </span>
                <span className="text-xs text-gray-500">
                  ({Math.round(file.size / 1024)} KB)
                </span>
              </div>
              <button
                onClick={() => onRemove(file)}
                disabled={disabled}
                className={`text-gray-400 hover:text-red-500 transition-colors
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}