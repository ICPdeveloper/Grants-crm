import React, { useState, useRef } from 'react';
import { useFileUpload, useFileUrl } from '../blob-storage/FileStorage';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import LoadingSpinner from './LoadingSpinner';

interface ImageUploadProps {
  label: string;
  currentImagePath?: string;
  onImagePathChange: (path: string) => void;
  className?: string;
}

export default function ImageUpload({ 
  label, 
  currentImagePath, 
  onImagePathChange, 
  className = '' 
}: ImageUploadProps) {
  const { uploadFile, isUploading } = useFileUpload();
  const { data: imageUrl } = useFileUrl(currentImagePath || '');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const imagePath = `images/${fileName}`;
      
      await uploadFile(imagePath, file);
      onImagePathChange(imagePath);
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemoveImage = () => {
    onImagePathChange('');
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <Label className="text-sm font-medium text-gray-700 mb-2 block">
        {label}
      </Label>
      
      <div className="space-y-3">
        {/* Current Image Display */}
        {currentImagePath && imageUrl && (
          <div className="relative inline-block">
            <img
              src={imageUrl}
              alt={label}
              className="w-24 h-24 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isUploading}
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <LoadingSpinner size="sm" />
              <p className="text-sm text-gray-600">Uploading image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5 text-gray-400" />
                <Upload className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Drop an image here or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>

        {currentImagePath && !imageUrl && (
          <p className="text-sm text-gray-500">Loading image...</p>
        )}
      </div>
    </div>
  );
}
