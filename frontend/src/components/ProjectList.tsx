import React, { useState, useMemo } from 'react';
import { useGetAllProjects, useGetAllBlockchains, useGetAllClients, useGetAllGrantPrograms, useGetGrantProgramsByBlockchain, useAddProject, useUpdateProject, useDeleteProject, useGetFilteredProjects, useLinkGrantProgramToProject, useUnlinkGrantProgramFromProject, useGenerateShareableLink } from '../hooks/useQueries';
import { useFileUrl } from '../blob-storage/FileStorage';
import { WorkflowState, type Project, TeamRole } from '../backend';
import { Plus, FolderOpen, X, Building2, User, Tag, Edit2, ExternalLink, Github, MessageCircle, Play, FileText, Trash2, Award, Link, Unlink, Share, Copy, Check, Users, Crown, Image as ImageIcon } from 'lucide-react';
import ProjectFilters from './ProjectFilters';
import TeamAssignmentForm from './TeamAssignmentForm';
import ImageUpload from './ImageUpload';
import DocumentsSection from './DocumentsSection';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from './LoadingSpinner';

export default function ProjectList() {
  const [projectTypeFilter, setProjectTypeFilter] = useState<string | null>(null);
  const [blockchainFilter, setBlockchainFilter] = useState<string | null>(null);
  const [clientFilter, setClientFilter] = useState<string | null>(null);
  const [workflowStateFilter, setWorkflowStateFilter] = useState<WorkflowState | null>(null);
  const [teamMemberFilter, setTeamMemberFilter] = useState<string | null>(null);

  const { data: allProjects = [] } = useGetAllProjects();
  const { data: filteredProjects = [], isLoading: projectsLoading } = useGetFilteredProjects(
    projectTypeFilter,
    blockchainFilter,
    clientFilter,
    workflowStateFilter,
    teamMemberFilter
  );
  const { data: blockchains = [] } = useGetAllBlockchains();
  const { data: clients = [] } = useGetAllClients();
  const { data: allGrantPrograms = [] } = useGetAllGrantPrograms();
  const addProject = useAddProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const linkGrantProgram = useLinkGrantProgramToProject();
  const unlinkGrantProgram = useUnlinkGrantProgramFromProject();
  const generateShareableLink = useGenerateShareableLink();
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [linkingProjectId, setLinkingProjectId] = useState<string | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [sharingProjectId, setSharingProjectId] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectType: '',
    blockchainId: '',
    clientId: '',
    twitter: '',
    discord: '',
    telegram: '',
    github: '',
    videoDemo: '',
    pitchDeck: '',
    website: '',
    documentation: '',
    grantProgramIds: [] as string[],
    teamAssignments: [] as any[],
    logoPath: '',
    documentPaths: [] as string[],
    googleDocLinks: [] as string[],
  });

  // Get grant programs filtered by blockchain for the form
  const { data: blockchainGrantPrograms = [] } = useGetGrantProgramsByBlockchain(formData.blockchainId);

  // Get unique project types from all projects for filter options
  const availableProjectTypes = useMemo(() => {
    const types = new Set<string>();
    allProjects.forEach(([_, project]) => {
      if (project.projectType.trim()) {
        types.add(project.projectType);
      }
    });
    return Array.from(types).sort();
  }, [allProjects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.description.trim() && formData.projectType.trim() && 
        formData.blockchainId && formData.clientId) {
      
      if (editingId) {
        // Update existing project
        // Get the current project to preserve its workflow state
        const currentProject = filteredProjects.find(([id]) => id === editingId)?.[1];
        if (currentProject) {
          const updatedProject = {
            ...formData,
            workflowState: currentProject.workflowState,
          };
          
          updateProject.mutate(
            { id: editingId, project: updatedProject },
            {
              onSuccess: () => {
                setFormData({
                  name: '',
                  description: '',
                  projectType: '',
                  blockchainId: '',
                  clientId: '',
                  twitter: '',
                  discord: '',
                  telegram: '',
                  github: '',
                  videoDemo: '',
                  pitchDeck: '',
                  website: '',
                  documentation: '',
                  grantProgramIds: [],
                  teamAssignments: [],
                  logoPath: '',
                  documentPaths: [],
                  googleDocLinks: [],
                });
                setShowForm(false);
                setEditingId(null);
              },
            }
          );
        }
      } else {
        // Add new project
        const id = Date.now().toString();
        const project = {
          ...formData,
          workflowState: WorkflowState.inProgress,
        };
        
        addProject.mutate(
          { id, project },
          {
            onSuccess: () => {
              setFormData({
                name: '',
                description: '',
                projectType: '',
                blockchainId: '',
                clientId: '',
                twitter: '',
                discord: '',
                telegram: '',
                github: '',
                videoDemo: '',
                pitchDeck: '',
                website: '',
                documentation: '',
                grantProgramIds: [],
                teamAssignments: [],
                logoPath: '',
                documentPaths: [],
                googleDocLinks: [],
              });
              setShowForm(false);
            },
          }
        );
      }
    }
  };

  const handleEdit = (id: string, project: Project) => {
    setEditingId(id);
    setFormData({
      name: project.name,
      description: project.description,
      projectType: project.projectType,
      blockchainId: project.blockchainId,
      clientId: project.clientId,
      twitter: project.twitter,
      discord: project.discord,
      telegram: project.telegram,
      github: project.github,
      videoDemo: project.videoDemo,
      pitchDeck: project.pitchDeck,
      website: project.website,
      documentation: project.documentation,
      grantProgramIds: project.grantProgramIds,
      teamAssignments: project.teamAssignments,
      logoPath: project.logoPath,
      documentPaths: project.documentPaths,
      googleDocLinks: project.googleDocLinks,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteProject.mutate(id);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      projectType: '',
      blockchainId: '',
      clientId: '',
      twitter: '',
      discord: '',
      telegram: '',
      github: '',
      videoDemo: '',
      pitchDeck: '',
      website: '',
      documentation: '',
      grantProgramIds: [],
      teamAssignments: [],
      logoPath: '',
      documentPaths: [],
      googleDocLinks: [],
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleClearFilters = () => {
    setProjectTypeFilter(null);
    setBlockchainFilter(null);
    setClientFilter(null);
    setWorkflowStateFilter(null);
    setTeamMemberFilter(null);
  };

  const toggleProjectExpansion = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const handleLinkGrantProgram = (projectId: string, grantProgramId: string) => {
    linkGrantProgram.mutate({ projectId, grantProgramId });
    setLinkingProjectId(null);
  };

  const handleUnlinkGrantProgram = (projectId: string, grantProgramId: string) => {
    unlinkGrantProgram.mutate({ projectId, grantProgramId });
  };

  const handleShareProject = (projectId: string) => {
    setSharingProjectId(projectId);
    setGeneratedLink(null);
    setLinkCopied(false);
    setShareDialogOpen(true);
  };

  const handleGenerateLink = async () => {
    if (!sharingProjectId) return;
    
    try {
      const linkId = await generateShareableLink.mutateAsync(sharingProjectId);
      const shareableUrl = `${window.location.origin}/shared/${linkId}`;
      setGeneratedLink(shareableUrl);
    } catch (error) {
      console.error('Failed to generate shareable link:', error);
    }
  };

  const handleCopyLink = async () => {
    if (!generatedLink) return;
    
    try {
      await navigator.clipboard.writeText(generatedLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const getRoleLabel = (role: TeamRole) => {
    switch (role) {
      case TeamRole.responsible: return 'Responsible';
      case TeamRole.workingOn: return 'Working On';
      default: return role;
    }
  };

  const blockchainsMap = new Map(blockchains);
  const clientsMap = new Map(clients);
  const grantProgramsMap = new Map(allGrantPrograms);

  const getWorkflowStateColor = (state: string) => {
    switch (state) {
      case 'inProgress': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkflowStateLabel = (state: string) => {
    switch (state) {
      case 'inProgress': return 'In Progress';
      case 'submitted': return 'Submitted';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return state;
    }
  };

  const isSubmitting = addProject.isPending || updateProject.isPending;

  if (projectsLoading) {
    return (
      <div className="p-6">
        <LoadingSpinner size="lg" text="Loading projects..." className="py-12" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600">Manage your blockchain grant projects</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </Button>
      </div>

      <ProjectFilters
        projectType={projectTypeFilter}
        blockchainId={blockchainFilter}
        clientId={clientFilter}
        workflowState={workflowStateFilter}
        teamMember={teamMemberFilter}
        onProjectTypeChange={setProjectTypeFilter}
        onBlockchainChange={setBlockchainFilter}
        onClientChange={setClientFilter}
        onWorkflowStateChange={setWorkflowStateFilter}
        onTeamMemberChange={setTeamMemberFilter}
        onClearFilters={handleClearFilters}
        availableProjectTypes={availableProjectTypes}
      />

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="team">Team & Programs</TabsTrigger>
                <TabsTrigger value="links">Links & Media</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., DeFi Protocol Grant"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Type
                    </label>
                    <input
                      type="text"
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., DeFi, Gaming, NFT"
                      required
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
                    placeholder="Brief description of the project"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blockchain
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client
                    </label>
                    <select
                      value={formData.clientId}
                      onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select a client</option>
                      {clients.map(([id, client]) => (
                        <option key={id} value={id}>{client.name} - {client.company}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <ImageUpload
                  label="Project Logo"
                  currentImagePath={formData.logoPath}
                  onImagePathChange={(path) => setFormData({ ...formData, logoPath: path })}
                />
              </TabsContent>

              <TabsContent value="team" className="space-y-6">
                {/* Team Assignments */}
                <TeamAssignmentForm
                  teamAssignments={formData.teamAssignments}
                  onChange={(assignments) => setFormData({ ...formData, teamAssignments: assignments })}
                />

                {/* Grant Program Selection */}
                {formData.blockchainId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grant Programs (Optional)
                    </label>
                    <Select
                      value=""
                      onValueChange={(value) => {
                        if (value && !formData.grantProgramIds.includes(value)) {
                          setFormData({
                            ...formData,
                            grantProgramIds: [...formData.grantProgramIds, value]
                          });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Add grant program" />
                      </SelectTrigger>
                      <SelectContent>
                        {blockchainGrantPrograms
                          .filter(([id]) => !formData.grantProgramIds.includes(id))
                          .map(([id, grantProgram]) => (
                            <SelectItem key={id} value={id}>
                              {grantProgram.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Selected Grant Programs */}
                    {formData.grantProgramIds.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {formData.grantProgramIds.map((grantProgramId) => {
                          const grantProgram = grantProgramsMap.get(grantProgramId);
                          return (
                            <div key={grantProgramId} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                              <span className="text-sm">{grantProgram?.name || 'Unknown Grant Program'}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    grantProgramIds: formData.grantProgramIds.filter(id => id !== grantProgramId)
                                  });
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="links" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://project.com"
                    />
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
                      placeholder="https://docs.project.com"
                    />
                  </div>
                </div>

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
                      placeholder="https://twitter.com/project"
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
                      placeholder="https://discord.gg/project"
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
                      placeholder="https://t.me/project"
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
                      placeholder="https://github.com/project"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video Demo
                    </label>
                    <input
                      type="url"
                      value={formData.videoDemo}
                      onChange={(e) => setFormData({ ...formData, videoDemo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pitch Deck
                    </label>
                    <input
                      type="url"
                      value={formData.pitchDeck}
                      onChange={(e) => setFormData({ ...formData, pitchDeck: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-4">
                <DocumentsSection
                  documentPaths={formData.documentPaths}
                  googleDocLinks={formData.googleDocLinks}
                  onDocumentPathsChange={(paths) => setFormData({ ...formData, documentPaths: paths })}
                  onGoogleDocLinksChange={(links) => setFormData({ ...formData, googleDocLinks: links })}
                />
              </TabsContent>
            </Tabs>
            
            <div className="flex space-x-3 pt-4 border-t">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2"
              >
                {isSubmitting && <LoadingSpinner size="sm" />}
                <span>
                  {isSubmitting 
                    ? (editingId ? 'Updating...' : 'Adding...') 
                    : (editingId ? 'Update Project' : 'Add Project')
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

      {/* Share Project Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Project</DialogTitle>
            <DialogDescription>
              Generate a secure link to share this project with collaborators. The link provides view-only access.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!generatedLink ? (
              <Button 
                onClick={handleGenerateLink} 
                disabled={generateShareableLink.isPending}
                className="w-full"
              >
                {generateShareableLink.isPending ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Generating...</span>
                  </>
                ) : (
                  <>
                    <Share className="h-4 w-4 mr-2" />
                    Generate Shareable Link
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-3">
                <Label htmlFor="share-link">Shareable Link</Label>
                <div className="flex space-x-2">
                  <Input
                    id="share-link"
                    value={generatedLink}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                  >
                    {linkCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {linkCopied && (
                  <p className="text-sm text-green-600">Link copied to clipboard!</p>
                )}
                <p className="text-sm text-gray-500">
                  Anyone with this link can view the project details without logging in.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {filteredProjects.map(([id, project]) => (
          <ProjectCard
            key={id}
            id={id}
            project={project}
            blockchain={blockchainsMap.get(project.blockchainId)}
            client={clientsMap.get(project.clientId)}
            grantProgramsMap={grantProgramsMap}
            isExpanded={expandedProjects.has(id)}
            onToggleExpansion={() => toggleProjectExpansion(id)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onShare={handleShareProject}
            onLinkGrantProgram={handleLinkGrantProgram}
            onUnlinkGrantProgram={handleUnlinkGrantProgram}
            linkingProjectId={linkingProjectId}
            setLinkingProjectId={setLinkingProjectId}
            allGrantPrograms={allGrantPrograms}
            isDeleting={deleteProject.isPending}
            unlinkGrantProgram={unlinkGrantProgram}
          />
        ))}

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-4">
              {projectTypeFilter || blockchainFilter || clientFilter || workflowStateFilter || teamMemberFilter
                ? 'Try adjusting your filters or add a new project'
                : 'Add your first project to get started'
              }
            </p>
            <Button onClick={() => setShowForm(true)}>
              Add Project
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

// Separate component for project cards
function ProjectCard({ 
  id, 
  project, 
  blockchain, 
  client, 
  grantProgramsMap, 
  isExpanded, 
  onToggleExpansion, 
  onEdit, 
  onDelete, 
  onShare,
  onLinkGrantProgram,
  onUnlinkGrantProgram,
  linkingProjectId,
  setLinkingProjectId,
  allGrantPrograms,
  isDeleting,
  unlinkGrantProgram
}: {
  id: string;
  project: Project;
  blockchain?: any;
  client?: any;
  grantProgramsMap: Map<string, any>;
  isExpanded: boolean;
  onToggleExpansion: () => void;
  onEdit: (id: string, project: Project) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  onLinkGrantProgram: (projectId: string, grantProgramId: string) => void;
  onUnlinkGrantProgram: (projectId: string, grantProgramId: string) => void;
  linkingProjectId: string | null;
  setLinkingProjectId: (id: string | null) => void;
  allGrantPrograms: Array<[string, any]>;
  isDeleting: boolean;
  unlinkGrantProgram: any;
}) {
  const { data: logoUrl } = useFileUrl(project.logoPath || '');
  const projectGrantPrograms = project.grantProgramIds.map(grantId => 
    [grantId, grantProgramsMap.get(grantId)]
  ).filter(([_, grant]) => grant) as [string, any][];

  const responsibleMembers = project.teamAssignments.filter(a => a.role === TeamRole.responsible);
  const workingOnMembers = project.teamAssignments.filter(a => a.role === TeamRole.workingOn);

  const getWorkflowStateColor = (state: string) => {
    switch (state) {
      case 'inProgress': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkflowStateLabel = (state: string) => {
    switch (state) {
      case 'inProgress': return 'In Progress';
      case 'submitted': return 'Submitted';
      case 'accepted': return 'Accepted';
      case 'rejected': return 'Rejected';
      default: return state;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4 flex-1">
          <div className="flex-shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${project.name} logo`}
                className="w-12 h-12 object-cover rounded-lg border border-gray-200"
              />
            ) : (
              <div className="p-2 bg-purple-100 rounded-lg">
                <FolderOpen className="h-8 w-8 text-purple-600" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {project.name}
            </h3>
            <p className="text-gray-600 mb-3">{project.description}</p>
            
            {/* Internal Team Assignments */}
            {project.teamAssignments.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Internal Altemis Support Team</span>
                </div>
                <div className="space-y-2">
                  {/* Responsible Members - Highlighted */}
                  {responsibleMembers.map((assignment, index) => (
                    <div key={`responsible-${index}`} className="bg-amber-50 border-2 border-amber-200 rounded-lg px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <Crown className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-semibold text-amber-900">{assignment.memberName}</span>
                        <span className="text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-medium">
                          Responsible
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {/* Working On Members - Regular styling */}
                  <div className="flex flex-wrap gap-2">
                    {workingOnMembers.map((assignment, index) => (
                      <div key={`working-${index}`} className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-blue-900">{assignment.memberName}</span>
                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                            Working On
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Links Section */}
            <div className="flex flex-wrap gap-3 mb-3">
              {project.website && (
                <a
                  href={project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Website</span>
                </a>
              )}
              {project.documentation && (
                <a
                  href={project.documentation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Docs</span>
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Github className="h-3 w-3" />
                  <span>GitHub</span>
                </a>
              )}
              {project.twitter && (
                <a
                  href={project.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Twitter</span>
                </a>
              )}
              {project.discord && (
                <a
                  href={project.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <MessageCircle className="h-3 w-3" />
                  <span>Discord</span>
                </a>
              )}
              {project.telegram && (
                <a
                  href={project.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <MessageCircle className="h-3 w-3" />
                  <span>Telegram</span>
                </a>
              )}
              {project.videoDemo && (
                <a
                  href={project.videoDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Play className="h-3 w-3" />
                  <span>Demo</span>
                </a>
              )}
              {project.pitchDeck && (
                <a
                  href={project.pitchDeck}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <FileText className="h-3 w-3" />
                  <span>Pitch Deck</span>
                </a>
              )}
            </div>

            {/* Documents Section */}
            {(project.documentPaths.length > 0 || project.googleDocLinks.length > 0) && (
              <div className="mb-3">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Documents ({project.documentPaths.length + project.googleDocLinks.length})
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {project.documentPaths.length > 0 && (
                    <span>{project.documentPaths.length} uploaded file{project.documentPaths.length !== 1 ? 's' : ''}</span>
                  )}
                  {project.documentPaths.length > 0 && project.googleDocLinks.length > 0 && <span>, </span>}
                  {project.googleDocLinks.length > 0 && (
                    <span>{project.googleDocLinks.length} Google Doc{project.googleDocLinks.length !== 1 ? 's' : ''}</span>
                  )}
                </div>
              </div>
            )}

            {/* Grant Programs Section */}
            {projectGrantPrograms.length > 0 && (
              <div className="border-t pt-3 mb-3">
                <button
                  onClick={onToggleExpansion}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 mb-2"
                >
                  <Award className="h-4 w-4" />
                  <span>Grant Programs ({projectGrantPrograms.length})</span>
                  {isExpanded ? (
                    <X className="h-3 w-3" />
                  ) : (
                    <Plus className="h-3 w-3" />
                  )}
                </button>

                {isExpanded && (
                  <div className="space-y-2">
                    {projectGrantPrograms.map(([grantId, grant]) => (
                      <div key={grantId} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                        <div>
                          <span className="text-sm font-medium">{grant.name}</span>
                          {grant.grantAmount && (
                            <span className="text-xs text-gray-500 ml-2">({grant.grantAmount})</span>
                          )}
                        </div>
                        <button
                          onClick={() => onUnlinkGrantProgram(id, grantId)}
                          disabled={unlinkGrantProgram.isPending}
                          className="text-red-600 hover:text-red-700 disabled:opacity-50"
                          title="Unlink grant program"
                        >
                          <Unlink className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Add Grant Program Button */}
            <div className="border-t pt-3">
              {linkingProjectId === id ? (
                <div className="flex items-center space-x-2">
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (value) {
                        onLinkGrantProgram(id, value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select grant program" />
                    </SelectTrigger>
                    <SelectContent>
                      {allGrantPrograms
                        .filter(([grantId, grant]) => 
                          grant.blockchainId === project.blockchainId && 
                          !project.grantProgramIds.includes(grantId)
                        )
                        .map(([grantId, grant]) => (
                          <SelectItem key={grantId} value={grantId}>
                            {grant.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <button
                    onClick={() => setLinkingProjectId(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setLinkingProjectId(id)}
                  className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Link className="h-3 w-3" />
                  <span>Link Grant Program</span>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getWorkflowStateColor(project.workflowState)}`}>
            {getWorkflowStateLabel(project.workflowState)}
          </span>
          <button
            onClick={() => onShare(id)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Share project"
          >
            <Share className="h-4 w-4" />
          </button>
          <button
            onClick={() => onEdit(id, project)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit project"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete project"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{project.name}"? This action cannot be undone.
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center text-gray-600">
          <Building2 className="h-4 w-4 mr-2" />
          <span>{blockchain?.name || 'Unknown Blockchain'}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <User className="h-4 w-4 mr-2" />
          <span>{client?.name || 'Unknown Client'}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Tag className="h-4 w-4 mr-2" />
          <span>{project.projectType}</span>
        </div>
      </div>
    </div>
  );
}
