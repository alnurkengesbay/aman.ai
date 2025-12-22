import React, { useRef, useState } from 'react';
import { Icons } from './Icons';
import { BloodTestInput } from '../types';
import { parseFile } from '../services/fileParser';

interface FileUploadProps {
  onFileParsed: (data: BloodTestInput) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileParsed, onError, isLoading = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    const fileName = file.name.toLowerCase();
    const isValidType = fileName.endsWith('.csv');
    
    if (!isValidType) {
      onError('Please upload a CSV file');
      return;
    }

    // Validate file size (20 MB limit)
    if (file.size > 20 * 1024 * 1024) {
      onError('File size must be less than 20 MB');
      return;
    }

    setSelectedFile(file);

    try {
      // Show loading state
      const result = await parseFile(file);
      
      if (result.success && result.data) {
        // Automatically trigger analysis after successful parsing
        onFileParsed(result.data);
      } else {
        onError(result.error || 'Failed to parse file. Please ensure your file contains all required blood test values: WBC, RBC, HGB, PLT, NEUT, LYMPH, MONO, EO, BASO');
        setSelectedFile(null);
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Error processing file');
      setSelectedFile(null);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div
        className={`border-2 border-dashed rounded-2xl p-12 md:p-16 bg-white transition-colors ${
          dragActive
            ? 'border-slate-400 bg-slate-50'
            : selectedFile
            ? 'border-slate-400'
            : 'border-slate-300 hover:border-slate-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          {/* Upload Icon */}
          <div className="w-16 h-16 flex items-center justify-center">
            <Icons.UploadCloud className="w-full h-full text-slate-400" />
          </div>
          
          {/* Upload Text */}
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-slate-900">
              {selectedFile ? selectedFile.name : 'Upload blood test results'}
            </h3>
            {!selectedFile && (
              <p className="text-sm text-slate-500">CSV file (up to 20 MB)</p>
            )}
          </div>
          
          {/* Select File Button */}
          <button
            type="button"
            onClick={handleClick}
            disabled={isLoading}
            className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : selectedFile ? 'Change file' : 'Select file'}
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Processing indicator */}
      {selectedFile && isLoading && (
        <div className="flex justify-center">
          <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
            Processing file...
          </div>
        </div>
      )}
    </div>
  );
};

