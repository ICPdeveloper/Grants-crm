import React, { useState } from 'react';
import { useGetAllBlockchains, useAddBlockchain, useUpdateBlockchain, useDeleteBlockchain, useGetGrantProgramsByBlockchain } from '../hooks/useQueries';
import { useFileUrl } from '../blob-storage/FileStorage';
import { Plus, Blocks, X, Edit2, ExternalLink, Github, MessageCircle, Trash2, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { type Blockchain } from '../backend';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import ImageUpload from './ImageUpload';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function BlockchainList() {
  const { data: blockchains = [], isLoading, error, refetch } = useGetAllBlockchains();
  const addBlockchain = useAddBlockchain();
  const updateBlockchain = useUpdateBlockchain();
  const deleteBlockchain = useDeleteBlockchain();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedGrants, setExpandedGrants] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '',
    twitter: '',
    discord: '',
    telegram: '',
    website: '',
    documentation: '',
    github: '',
    logoPath: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.description.trim()) {
      try {
        if (editingId) {
          await updateBlockchain.mutateAsync({ id: editingId, blockchain: formData });
        } else {
          const id = Date.now().toString();
          await addBlockchain.mutateAsync({ id, blockchain: formData });
        }
        
        setFormData({ 
          name: '', 
          description: '',
          twitter: '',
          discord: '',
          telegram: '',
          website: '',
          documentation: '',
          github: '',
          logoPath: ''
        });
        setShowForm(false);
        setEditingId(null);
      } catch (error) {
        // Error is handled by the mutation
        console.error('Form submission error:', error);
      }
    }
  };

  const handleEdit = (id: string, blockchain: Blockchain) => {
    setEditingId(id);
    setFormData({ 
      name: blockchain.name, 
      description: blockchain.description,
      twitter: blockchain.twitter,
      discord: blockchain.discord,
      telegram: blockchain.telegram,
      website: blockchain.website,
      documentation: blockchain.documentation,
      github: blockchain.github,
      logoPath: blockchain.logoPath
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteBlockchain.mutate(id);
  };

  const handleCancel = () => {
    setFormData({ 
      name: '', 
      description: '',
      twitter: '',
      discord: '',
      telegram: '',
      website: '',
      documentation: '',
      github: '',
      logoPath: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  const toggleGrantsExpansion = (blockchainId: string) => {
    const newExpanded = new Set(expandedGrants);
    if (newExpanded.has(blockchainId)) {
      newExpanded.delete(blockchainId);
    } else {
      newExpanded.add(blockchainId);
    }
    setExpandedGrants(newExpanded);
  };

  const isSubmitting = addBlockchain.isPending || updateBlockchain.isPending;

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading blockchains..." className="py-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blockchains</h1>
            <p className="text-gray-600">Manage blockchain networks for your projects</p>
          </div>
        </div>
        <ErrorMessage 
          message={error.message} 
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blockchains</h1>
          <p className="text-gray-600">Manage blockchain networks for your projects</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Blockchain</span>
        </Button>
      </div>

      {/* Show mutation errors */}
      {(addBlockchain.error || updateBlockchain.error || deleteBlockchain.error) && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {addBlockchain.error?.message || updateBlockchain.error?.message || deleteBlockchain.error?.message}
          </AlertDescription>
        </Alert>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Blockchain' : 'Add New Blockchain'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blockchain Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Ethereum, Polygon, Solana"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Brief description of the blockchain network"
                required
              />
            </div>

            <ImageUpload
              label="Blockchain Logo"
              currentImagePath={formData.logoPath}
              onImagePathChange={(path) => setFormData({ ...formData, logoPath: path })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter/X
                </label>
                <input
                  type="url"
                  value={formData.twitter}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://twitter.com/username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discord
                </label>
                <input
                  type="url"
                  value={formData.discord}
                  onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://discord.gg/invite"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telegram
                </label>
                <input
                  type="url"
                  value={formData.telegram}
                  onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://t.me/channel"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub
                </label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/organization"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Documentation
              </label>
              <input
                type="url"
                value={formData.documentation}
                onChange={(e) => setFormData({ ...formData, documentation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://docs.example.com"
              />
            </div>
            
            <div className="flex space-x-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2"
              >
                {isSubmitting && <LoadingSpinner size="sm" />}
                <span>
                  {isSubmitting 
                    ? (editingId ? 'Updating...' : 'Adding...') 
                    : (editingId ? 'Update Blockchain' : 'Add Blockchain')
                  }
                </span>
              </Button>
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {blockchains.map(([id, blockchain]) => (
          <BlockchainCard 
            key={id} 
            id={id} 
            blockchain={blockchain} 
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={deleteBlockchain.isPending}
            isExpanded={expandedGrants.has(id)}
            onToggleExpansion={() => toggleGrantsExpansion(id)}
          />
        ))}

        {blockchains.length === 0 && (
          <div className="text-center py-12">
            <Blocks className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blockchains yet</h3>
            <p className="text-gray-600 mb-4">Add your first blockchain to get started</p>
            <Button onClick={() => setShowForm(true)}>
              Add Blockchain
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
        © 2025. Built with <span className="text-red-500">♥</span> using{' '}
        <a href="https://caffeine.ai" className="text-blue-600 hover:text-blue-700 transition-colors">
          caffeine.ai
        </a>
      </div>
    </div>
  );
}

// Separate component for blockchain card with grant programs
function BlockchainCard({ 
  id, 
  blockchain, 
  onEdit, 
  onDelete, 
  isDeleting, 
  isExpanded, 
  onToggleExpansion 
}: {
  id: string;
  blockchain: Blockchain;
  onEdit: (id: string, blockchain: Blockchain) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  isExpanded: boolean;
  onToggleExpansion: () => void;
}) {
  const { data: grantPrograms = [], isLoading: grantsLoading } = useGetGrantProgramsByBlockchain(id);
  const { data: logoUrl } = useFileUrl(blockchain.logoPath || '');

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="flex-shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${blockchain.name} logo`}
                className="w-12 h-12 object-cover rounded-lg border border-gray-200"
              />
            ) : (
              <div className="p-2 bg-blue-100 rounded-lg">
                <Blocks className="h-8 w-8 text-blue-600" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {blockchain.name}
            </h3>
            <p className="text-gray-600 mb-4">{blockchain.description}</p>
            
            {/* Links Section */}
            <div className="flex flex-wrap gap-3 mb-4">
              {blockchain.website && (
                <a
                  href={blockchain.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Website</span>
                </a>
              )}
              {blockchain.documentation && (
                <a
                  href={blockchain.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Docs</span>
                </a>
              )}
              {blockchain.github && (
                <a
                  href={blockchain.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Github className="h-3 w-3" />
                  <span>GitHub</span>
                </a>
              )}
              {blockchain.twitter && (
                <a
                  href={blockchain.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Twitter</span>
                </a>
              )}
              {blockchain.discord && (
                <a
                  href={blockchain.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <MessageCircle className="h-3 w-3" />
                  <span>Discord</span>
                </a>
              )}
              {blockchain.telegram && (
                <a
                  href={blockchain.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <MessageCircle className="h-3 w-3" />
                  <span>Telegram</span>
                </a>
              )}
            </div>

            {/* Grant Programs Section */}
            {grantPrograms.length > 0 && (
              <div className="border-t pt-4">
                <button
                  onClick={onToggleExpansion}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 mb-3"
                >
                  <Award className="h-4 w-4" />
                  <span>Grant Programs ({grantPrograms.length})</span>
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>

                {isExpanded && (
                  <div className="space-y-3">
                    {grantsLoading ? (
                      <div className="text-sm text-gray-500">Loading grant programs...</div>
                    ) : (
                      grantPrograms.map(([grantId, grant]) => (
                        <div key={grantId} className="bg-gray-50 rounded-lg p-3">
                          <h4 className="font-medium text-gray-900 mb-1">{grant.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{grant.description}</p>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                            {grant.grantAmount && (
                              <span className="bg-white px-2 py-1 rounded">
                                Amount: {grant.grantAmount}
                              </span>
                            )}
                            {grant.deadline && (
                              <span className="bg-white px-2 py-1 rounded">
                                Deadline: {grant.deadline}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(id, blockchain)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit blockchain"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete blockchain"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Blockchain</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{blockchain.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(id)}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isDeleting ? (
                    <div className="flex items-center space-x-2">
                      <LoadingSpinner size="sm" />
                      <span>Deleting...</span>
                    </div>
                  ) : (
                    'Delete'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
