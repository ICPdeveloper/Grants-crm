import React, { useState } from 'react';
import { useFileUpload, useFileUrl } from '../blob-storage/FileStorage';
import { Upload, X, FileText, ExternalLink, Plus, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import LoadingSpinner from './LoadingSpinner';

interface DocumentsSectionProps {
  documentPaths: string[];
  googleDocLinks: string[];
  onDocumentPathsChange: (paths: string[]) => void;
  onGoogleDocLinksChange: (links: string[]) => void;
}

export default function DocumentsSection({
  documentPaths,
  googleDocLinks,
  onDocumentPathsChange,
  onGoogleDocLinksChange,
}: DocumentsSectionProps) {
  const { uploadFile, isUploading } = useFileUpload();
  const [newGoogleDocLink, setNewGoogleDocLink] = useState('');
  const [googleDocDialogOpen, setGoogleDocDialogOpen] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const documentPath = `documents/${fileName}`;
      
      await uploadFile(documentPath, file);
      onDocumentPathsChange([...documentPaths, documentPath]);
    } catch (error) {
      console.error('Failed to upload document:', error);
      alert('Failed to upload document. Please try again.');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveDocument = (index: number) => {
    const updatedPaths = documentPaths.filter((_, i) => i !== index);
    onDocumentPathsChange(updatedPaths);
  };

  const handleAddGoogleDocLink = () => {
    if (newGoogleDocLink.trim()) {
      onGoogleDocLinksChange([...googleDocLinks, newGoogleDocLink.trim()]);
      setNewGoogleDocLink('');
      setGoogleDocDialogOpen(false);
    }
  };

  const handleRemoveGoogleDocLink = (index: number) => {
    const updatedLinks = googleDocLinks.filter((_, i) => i !== index);
    onGoogleDocLinksChange(updatedLinks);
  };

  const getFileName = (path: string) => {
    const parts = path.split('/');
    const fileName = parts[parts.length - 1];
    // Remove timestamp prefix if present
    return fileName.replace(/^\d+-/, '');
  };

  const isGoogleLink = (url: string) => {
    return url.includes('docs.google.com') || url.includes('sheets.google.com') || url.includes('drive.google.com');
  };

  const getLinkType = (url: string) => {
    if (url.includes('sheets.google.com')) return 'Google Sheets';
    if (url.includes('docs.google.com')) return 'Google Docs';
    if (url.includes('drive.google.com')) return 'Google Drive';
    return 'Link';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-gray-700">
          Project Documents
        </Label>
        <div className="flex space-x-2">
          <Dialog open={googleDocDialogOpen} onOpenChange={setGoogleDocDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <Link className="h-3 w-3" />
                <span>Add Google Doc/Sheet</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Google Doc/Sheet Link</DialogTitle>
                <DialogDescription>
                  Add a link to a shared Google Doc, Sheet, or Drive file.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="google-doc-link">Google Doc/Sheet URL</Label>
                  <Input
                    id="google-doc-link"
                    value={newGoogleDocLink}
                    onChange={(e) => setNewGoogleDocLink(e.target.value)}
                    placeholder="https://docs.google.com/..."
                    className="mt-1"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleAddGoogleDocLink} disabled={!newGoogleDocLink.trim()}>
                    Add Link
                  </Button>
                  <Button variant="outline" onClick={() => setGoogleDocDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" size="sm" className="flex items-center space-x-1" asChild>
            <label>
              <Upload className="h-3 w-3" />
              <span>Upload File</span>
              <input
                type="file"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={isUploading}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
              />
            </label>
          </Button>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Upload documents (Excel, Word, PDF, etc.) or add links to shared Google Docs and Sheets.
      </p>

      {/* Uploaded Files */}
      {documentPaths.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h4>
          <div className="space-y-2">
            {documentPaths.map((path, index) => (
              <DocumentItem
                key={path}
                path={path}
                onRemove={() => handleRemoveDocument(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Google Doc Links */}
      {googleDocLinks.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Google Docs & Sheets</h4>
          <div className="space-y-2">
            {googleDocLinks.map((link, index) => (
              <div key={index} className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2 rounded-md">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <ExternalLink className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-900 truncate">
                      {getLinkType(link)}
                    </p>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-600 hover:text-green-700 truncate block"
                    >
                      {link}
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveGoogleDocLink(index)}
                  className="text-red-600 hover:text-red-700 flex-shrink-0 ml-2"
                  title="Remove link"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {documentPaths.length === 0 && googleDocLinks.length === 0 && (
        <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No documents added yet</p>
          <p className="text-xs text-gray-500">Upload files or add Google Doc/Sheet links to get started</p>
        </div>
      )}

      {isUploading && (
        <div className="flex items-center space-x-2 text-sm text-blue-600">
          <LoadingSpinner size="sm" />
          <span>Uploading document...</span>
        </div>
      )}
    </div>
  );
}

// Separate component for document items to handle file URLs
function DocumentItem({ path, onRemove }: { path: string; onRemove: () => void }) {
  const { data: fileUrl } = useFileUrl(path);

  const getFileName = (path: string) => {
    const parts = path.split('/');
    const fileName = parts[parts.length - 1];
    // Remove timestamp prefix if present
    return fileName.replace(/^\d+-/, '');
  };

  const getFileExtension = (fileName: string) => {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
  };

  const fileName = getFileName(path);
  const fileExtension = getFileExtension(fileName);

  return (
    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 px-3 py-2 rounded-md">
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <FileText className="h-4 w-4 text-blue-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-blue-900 truncate">{fileName}</p>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-blue-600 bg-blue-100 px-1 py-0.5 rounded">
              {fileExtension}
            </span>
            {fileUrl && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Download
              </a>
            )}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="text-red-600 hover:text-red-700 flex-shrink-0 ml-2"
        title="Remove document"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
