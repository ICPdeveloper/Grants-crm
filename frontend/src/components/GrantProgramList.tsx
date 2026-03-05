import React, { useState } from 'react';
import { useGetAllGrantPrograms, useGetAllBlockchains, useAddGrantProgram, useUpdateGrantProgram, useDeleteGrantProgram, useGetProjectsByGrantProgram, useGetClientsByGrantProgram } from '../hooks/useQueries';
import { Plus, Award, X, Edit2, Trash2, Building2, DollarSign, Calendar, Users, FileText, Clock, FolderOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { type GrantProgram } from '../backend';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
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

export default function GrantProgramList() {
  const { data: grantPrograms = [], isLoading, error, refetch } = useGetAllGrantPrograms();
  const { data: blockchains = [] } = useGetAllBlockchains();
  const addGrantProgram = useAddGrantProgram();
  const updateGrantProgram = useUpdateGrantProgram();
  const deleteGrantProgram = useDeleteGrantProgram();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedPrograms, setExpandedPrograms] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    blockchainId: '',
    grantAmount: '',
    processDetails: '',
    eligibilityCriteria: '',
    deadline: '',
    contactInfo: '',
    applicationRequirements: '',
  });

  const blockchainsMap = new Map(blockchains);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.description.trim() && formData.blockchainId) {
      try {
        if (editingId) {
          await updateGrantProgram.mutateAsync({ id: editingId, grantProgram: formData });
        } else {
          const id = Date.now().toString();
          await addGrantProgram.mutateAsync({ id, grantProgram: formData });
        }
        
        setFormData({
          name: '',
          description: '',
          blockchainId: '',
          grantAmount: '',
          processDetails: '',
          eligibilityCriteria: '',
          deadline: '',
          contactInfo: '',
          applicationRequirements: '',
        });
        setShowForm(false);
        setEditingId(null);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
  };

  const handleEdit = (id: string, grantProgram: GrantProgram) => {
    setEditingId(id);
    setFormData({
      name: grantProgram.name,
      description: grantProgram.description,
      blockchainId: grantProgram.blockchainId,
      grantAmount: grantProgram.grantAmount,
      processDetails: grantProgram.processDetails,
      eligibilityCriteria: grantProgram.eligibilityCriteria,
      deadline: grantProgram.deadline,
      contactInfo: grantProgram.contactInfo,
      applicationRequirements: grantProgram.applicationRequirements,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteGrantProgram.mutate(id);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      blockchainId: '',
      grantAmount: '',
      processDetails: '',
      eligibilityCriteria: '',
      deadline: '',
      contactInfo: '',
      applicationRequirements: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const toggleProgramExpansion = (programId: string) => {
    const newExpanded = new Set(expandedPrograms);
    if (newExpanded.has(programId)) {
      newExpanded.delete(programId);
    } else {
      newExpanded.add(programId);
    }
    setExpandedPrograms(newExpanded);
  };

  const isSubmitting = addGrantProgram.isPending || updateGrantProgram.isPending;

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading grant programs..." className="py-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grant Programs</h1>
            <p className="text-gray-600">Manage grant program information and funding opportunities</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Grant Programs</h1>
          <p className="text-gray-600">Manage grant program information and funding opportunities</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Grant Program</span>
        </Button>
      </div>

      {/* Show mutation errors */}
      {(addGrantProgram.error || updateGrantProgram.error || deleteGrantProgram.error) && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {addGrantProgram.error?.message || updateGrantProgram.error?.message || deleteGrantProgram.error?.message}
          </AlertDescription>
        </Alert>
      )}

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Grant Program' : 'Add New Grant Program'}
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
                  Program Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Ecosystem Development Grant"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Associated Blockchain
                </label>
                <select
                  value={formData.blockchainId}
                  onChange={(e) => setFormData({ ...formData, blockchainId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a blockchain</option>
                  {blockchains.map(([id, blockchain]) => (
                    <option key={id} value={id}>{blockchain.name}</option>
                  ))}
                </select>
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
                placeholder="Brief description of the grant program"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grant Amount
                </label>
                <input
                  type="text"
                  value={formData.grantAmount}
                  onChange={(e) => setFormData({ ...formData, grantAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., $10,000 - $100,000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Deadline
                </label>
                <input
                  type="text"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Rolling basis, Q2 2025"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Eligibility Criteria
              </label>
              <textarea
                value={formData.eligibilityCriteria}
                onChange={(e) => setFormData({ ...formData, eligibilityCriteria: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Who is eligible to apply for this grant?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Process Details
              </label>
              <textarea
                value={formData.processDetails}
                onChange={(e) => setFormData({ ...formData, processDetails: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe the application process and timeline"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Requirements
              </label>
              <textarea
                value={formData.applicationRequirements}
                onChange={(e) => setFormData({ ...formData, applicationRequirements: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="What documents and information are required?"
              />
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
                placeholder="e.g., grants@blockchain.org"
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
                    : (editingId ? 'Update Grant Program' : 'Add Grant Program')
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

      <div className="grid gap-6">
        {grantPrograms.map(([id, grantProgram]) => (
          <GrantProgramCard 
            key={id} 
            id={id} 
            grantProgram={grantProgram} 
            blockchain={blockchainsMap.get(grantProgram.blockchainId)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={deleteGrantProgram.isPending}
            isExpanded={expandedPrograms.has(id)}
            onToggleExpansion={() => toggleProgramExpansion(id)}
          />
        ))}

        {grantPrograms.length === 0 && (
          <div className="text-center py-12">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No grant programs yet</h3>
            <p className="text-gray-600 mb-4">Add your first grant program to get started</p>
            <Button onClick={() => setShowForm(true)}>
              Add Grant Program
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

// Separate component for grant program card with projects and clients
function GrantProgramCard({ 
  id, 
  grantProgram, 
  blockchain,
  onEdit, 
  onDelete, 
  isDeleting, 
  isExpanded, 
  onToggleExpansion 
}: {
  id: string;
  grantProgram: GrantProgram;
  blockchain?: any;
  onEdit: (id: string, grantProgram: GrantProgram) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
  isExpanded: boolean;
  onToggleExpansion: () => void;
}) {
  const { data: projects = [], isLoading: projectsLoading } = useGetProjectsByGrantProgram(id);
  const { data: clients = [], isLoading: clientsLoading } = useGetClientsByGrantProgram(id);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          <div className="p-2 bg-green-100 rounded-lg">
            <Award className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {grantProgram.name}
            </h3>
            <p className="text-gray-600 mb-4">{grantProgram.description}</p>
            
            {/* Grant Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Building2 className="h-4 w-4 mr-2" />
                <span>{blockchain?.name || 'Unknown Blockchain'}</span>
              </div>
              
              {grantProgram.grantAmount && (
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>{grantProgram.grantAmount}</span>
                </div>
              )}
              
              {grantProgram.deadline && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{grantProgram.deadline}</span>
                </div>
              )}
              
              {grantProgram.contactInfo && (
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{grantProgram.contactInfo}</span>
                </div>
              )}
            </div>

            {/* Expandable Details */}
            <div className="space-y-3 mb-4">
              {grantProgram.eligibilityCriteria && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1 flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    Eligibility Criteria
                  </h4>
                  <p className="text-sm text-gray-600">{grantProgram.eligibilityCriteria}</p>
                </div>
              )}
              
              {grantProgram.processDetails && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Application Process
                  </h4>
                  <p className="text-sm text-gray-600">{grantProgram.processDetails}</p>
                </div>
              )}
              
              {grantProgram.applicationRequirements && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-1 flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    Requirements
                  </h4>
                  <p className="text-sm text-gray-600">{grantProgram.applicationRequirements}</p>
                </div>
              )}
            </div>

            {/* Associated Projects and Clients Section */}
            {(projects.length > 0 || clients.length > 0) && (
              <div className="border-t pt-4">
                <button
                  onClick={onToggleExpansion}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 mb-3"
                >
                  <FolderOpen className="h-4 w-4" />
                  <span>Associated Projects & Clients ({projects.length} projects, {clients.length} clients)</span>
                  {isExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>

                {isExpanded && (
                  <div className="space-y-4">
                    {/* Projects */}
                    {projects.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Projects ({projects.length})</h5>
                        {projectsLoading ? (
                          <div className="text-sm text-gray-500">Loading projects...</div>
                        ) : (
                          <div className="space-y-2">
                            {projects.map(([projectId, project]) => (
                              <div key={projectId} className="bg-blue-50 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="text-sm font-medium text-blue-900">{project.name}</span>
                                    <p className="text-xs text-blue-700 mt-1">{project.description}</p>
                                  </div>
                                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                    {project.projectType}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Clients */}
                    {clients.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Clients ({clients.length})</h5>
                        {clientsLoading ? (
                          <div className="text-sm text-gray-500">Loading clients...</div>
                        ) : (
                          <div className="space-y-2">
                            {clients.map(([clientId, client]) => (
                              <div key={clientId} className="bg-green-50 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="text-sm font-medium text-green-900">{client.name}</span>
                                    <p className="text-xs text-green-700 mt-1">{client.company}</p>
                                  </div>
                                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                    Client
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(id, grantProgram)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit grant program"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete grant program"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Grant Program</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{grantProgram.name}"? This action cannot be undone and will unlink all associated projects.
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
