import React, { useState } from 'react';
import { useGetAllClients, useAddClient, useUpdateClient, useDeleteClient } from '../hooks/useQueries';
import { useFileUrl } from '../blob-storage/FileStorage';
import { Plus, Users, X, Building, Mail, Edit2, ExternalLink, Trash2, Image as ImageIcon } from 'lucide-react';
import { type Client } from '../backend';
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
import { Button } from '@/components/ui/button';
import LoadingSpinner from './LoadingSpinner';
import ImageUpload from './ImageUpload';

export default function ClientList() {
  const { data: clients = [], isLoading } = useGetAllClients();
  const addClient = useAddClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    company: '', 
    contactInfo: '',
    twitter: '',
    linkedin: '',
    website: '',
    logoPath: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.company.trim() && formData.contactInfo.trim()) {
      if (editingId) {
        // Update existing client
        updateClient.mutate(
          { id: editingId, client: formData },
          {
            onSuccess: () => {
              setFormData({ 
                name: '', 
                company: '', 
                contactInfo: '',
                twitter: '',
                linkedin: '',
                website: '',
                logoPath: ''
              });
              setShowForm(false);
              setEditingId(null);
            },
          }
        );
      } else {
        // Add new client
        const id = Date.now().toString();
        addClient.mutate(
          { id, client: formData },
          {
            onSuccess: () => {
              setFormData({ 
                name: '', 
                company: '', 
                contactInfo: '',
                twitter: '',
                linkedin: '',
                website: '',
                logoPath: ''
              });
              setShowForm(false);
            },
          }
        );
      }
    }
  };

  const handleEdit = (id: string, client: Client) => {
    setEditingId(id);
    setFormData({ 
      name: client.name, 
      company: client.company, 
      contactInfo: client.contactInfo,
      twitter: client.twitter,
      linkedin: client.linkedin,
      website: client.website,
      logoPath: client.logoPath
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteClient.mutate(id);
  };

  const handleCancel = () => {
    setFormData({ 
      name: '', 
      company: '', 
      contactInfo: '',
      twitter: '',
      linkedin: '',
      website: '',
      logoPath: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  const isSubmitting = addClient.isPending || updateClient.isPending;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600">Manage your client relationships</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Client</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Client' : 'Add New Client'}
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
                  Contact Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., John Smith"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Blockchain Innovations Inc."
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Information
              </label>
              <input
                type="text"
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., john@company.com or +1-555-0123"
                required
              />
            </div>

            <ImageUpload
              label="Company Logo"
              currentImagePath={formData.logoPath}
              onImagePathChange={(path) => setFormData({ ...formData, logoPath: path })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://company.com"
                />
              </div>
              
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Client' : 'Add Client')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {clients.map(([id, client]) => (
          <ClientCard
            key={id}
            id={id}
            client={client}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={deleteClient.isPending}
          />
        ))}

        {clients.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients yet</h3>
            <p className="text-gray-600 mb-4">Add your first client to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Client
            </button>
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

// Separate component for client cards
function ClientCard({ 
  id, 
  client, 
  onEdit, 
  onDelete, 
  isDeleting 
}: {
  id: string;
  client: Client;
  onEdit: (id: string, client: Client) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const { data: logoUrl } = useFileUrl(client.logoPath || '');

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="flex-shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${client.company} logo`}
                className="w-12 h-12 object-cover rounded-lg border border-gray-200"
              />
            ) : (
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {client.name}
            </h3>
            <div className="space-y-1 mb-4">
              <div className="flex items-center text-gray-600">
                <Building className="h-4 w-4 mr-2" />
                <span>{client.company}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span>{client.contactInfo}</span>
              </div>
            </div>
            
            {/* Links Section */}
            <div className="flex flex-wrap gap-3">
              {client.website && (
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Website</span>
                </a>
              )}
              {client.twitter && (
                <a
                  href={client.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Twitter</span>
                </a>
              )}
              {client.linkedin && (
                <a
                  href={client.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(id, client)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit client"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete client"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Client</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{client.name}" from {client.company}? This action cannot be undone.
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
