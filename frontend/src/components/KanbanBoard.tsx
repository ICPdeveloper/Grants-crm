import React, { useState, useMemo } from 'react';
import { useGetAllProjects, useGetAllBlockchains, useGetAllClients, useUpdateProjectWorkflow, useGetFilteredProjects } from '../hooks/useQueries';
import { useFileUrl } from '../blob-storage/FileStorage';
import { WorkflowState, TeamRole, Project } from '../backend';
import { ChevronDown, Building2, User, ArrowRight, ExternalLink, Github, MessageCircle, Play, FileText, Users, Crown, Eye } from 'lucide-react';
import ProjectFilters from './ProjectFilters';
import ProjectDetailModal from './ProjectDetailModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function KanbanBoard() {
  const [projectTypeFilter, setProjectTypeFilter] = useState<string | null>(null);
  const [blockchainFilter, setBlockchainFilter] = useState<string | null>(null);
  const [clientFilter, setClientFilter] = useState<string | null>(null);
  const [workflowStateFilter, setWorkflowStateFilter] = useState<WorkflowState | null>(null);
  const [teamMemberFilter, setTeamMemberFilter] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<{ project: Project; id: string } | null>(null);

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
  const updateWorkflow = useUpdateProjectWorkflow();
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  const blockchainsMap = new Map(blockchains);
  const clientsMap = new Map(clients);

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

  const columns = [
    { 
      id: 'inProgress', 
      title: 'In Progress', 
      color: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200', 
      state: WorkflowState.inProgress,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    { 
      id: 'submitted', 
      title: 'Submitted', 
      color: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200', 
      state: WorkflowState.submitted,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    { 
      id: 'accepted', 
      title: 'Accepted', 
      color: 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200', 
      state: WorkflowState.accepted,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    { 
      id: 'rejected', 
      title: 'Rejected', 
      color: 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200', 
      state: WorkflowState.rejected,
      badgeColor: 'bg-red-100 text-red-800 border-red-200'
    },
  ];

  const getProjectsByState = (state: string) => {
    return filteredProjects.filter(([_, project]) => project.workflowState === state);
  };

  const handleMoveProject = (projectId: string, newState: WorkflowState) => {
    updateWorkflow.mutate({ id: projectId, newState });
    setOpenDropdowns(new Set());
  };

  const toggleDropdown = (projectId: string) => {
    const newOpenDropdowns = new Set(openDropdowns);
    if (newOpenDropdowns.has(projectId)) {
      newOpenDropdowns.delete(projectId);
    } else {
      newOpenDropdowns.add(projectId);
    }
    setOpenDropdowns(newOpenDropdowns);
  };

  const getAvailableStates = (currentState: string) => {
    return columns.filter(col => col.id !== currentState);
  };

  const handleClearFilters = () => {
    setProjectTypeFilter(null);
    setBlockchainFilter(null);
    setClientFilter(null);
    setWorkflowStateFilter(null);
    setTeamMemberFilter(null);
  };

  const getRoleLabel = (role: TeamRole) => {
    switch (role) {
      case TeamRole.responsible: return 'Responsible';
      case TeamRole.workingOn: return 'Working On';
      default: return role;
    }
  };

  if (projectsLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-80"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Grant Application Dashboard</h1>
        <p className="text-gray-600 text-lg">Track the progress of your blockchain grant applications</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnProjects = getProjectsByState(column.id);
          
          return (
            <div key={column.id} className={`rounded-xl border-2 ${column.color} p-6 shadow-sm`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-lg">{column.title}</h3>
                <Badge className={`px-3 py-1 font-semibold border ${column.badgeColor}`}>
                  {columnProjects.length}
                </Badge>
              </div>

              <div className="space-y-4">
                {columnProjects.map(([projectId, project]) => {
                  const blockchain = blockchainsMap.get(project.blockchainId);
                  const client = clientsMap.get(project.clientId);
                  const availableStates = getAvailableStates(column.id);
                  const isDropdownOpen = openDropdowns.has(projectId);
                  const responsibleMembers = project.teamAssignments.filter(a => a.role === TeamRole.responsible);
                  const workingOnMembers = project.teamAssignments.filter(a => a.role === TeamRole.workingOn);

                  return (
                    <ProjectCard
                      key={projectId}
                      projectId={projectId}
                      project={project}
                      blockchain={blockchain}
                      client={client}
                      availableStates={availableStates}
                      isDropdownOpen={isDropdownOpen}
                      responsibleMembers={responsibleMembers}
                      workingOnMembers={workingOnMembers}
                      onToggleDropdown={() => toggleDropdown(projectId)}
                      onMoveProject={handleMoveProject}
                      onViewProject={() => setSelectedProject({ project, id: projectId })}
                      updateWorkflow={updateWorkflow}
                    />
                  );
                })}

                {columnProjects.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium">No projects in this stage</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Click outside to close dropdowns */}
      {openDropdowns.size > 0 && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setOpenDropdowns(new Set())}
        />
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject.project}
          projectId={selectedProject.id}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
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
  projectId, 
  project, 
  blockchain, 
  client, 
  availableStates,
  isDropdownOpen,
  responsibleMembers,
  workingOnMembers,
  onToggleDropdown,
  onMoveProject,
  onViewProject,
  updateWorkflow
}: {
  projectId: string;
  project: Project;
  blockchain?: any;
  client?: any;
  availableStates: any[];
  isDropdownOpen: boolean;
  responsibleMembers: any[];
  workingOnMembers: any[];
  onToggleDropdown: () => void;
  onMoveProject: (projectId: string, newState: WorkflowState) => void;
  onViewProject: () => void;
  updateWorkflow: any;
}) {
  const { data: logoUrl } = useFileUrl(project.logoPath || '');

  const socialLinks = [
    { url: project.website, icon: ExternalLink, label: 'Website' },
    { url: project.github, icon: Github, label: 'GitHub' },
    { url: project.discord, icon: MessageCircle, label: 'Discord' },
    { url: project.videoDemo, icon: Play, label: 'Demo' },
  ].filter(link => link.url);

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-all duration-200 border-0 relative group">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${project.name} logo`}
                  className="w-10 h-10 object-cover rounded-lg border border-gray-200 shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                  <FileText className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-base leading-tight mb-1">{project.name}</h4>
              <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{project.description}</p>
            </div>
          </div>
          <Button
            onClick={onViewProject}
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto ml-2"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-xs text-gray-500">
            <Building2 className="h-3 w-3 mr-2 text-blue-500" />
            <span className="font-medium">{blockchain?.name || 'Unknown Blockchain'}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <User className="h-3 w-3 mr-2 text-green-500" />
            <span className="font-medium">{client?.name || 'Unknown Client'}</span>
          </div>
          <div className="text-xs text-gray-500">
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              {project.projectType}
            </Badge>
          </div>
        </div>

        {/* Internal Team Assignments */}
        {project.teamAssignments.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center text-xs text-gray-500 mb-2">
              <Users className="h-3 w-3 mr-1" />
              <span className="font-medium">Internal Team ({project.teamAssignments.length})</span>
            </div>
            <div className="space-y-1">
              {/* Responsible Members - Highlighted */}
              {responsibleMembers.slice(0, 1).map((assignment, index) => (
                <div key={`responsible-${index}`} className="bg-amber-50 border border-amber-200 rounded px-2 py-1">
                  <div className="flex items-center space-x-1">
                    <Crown className="h-3 w-3 text-amber-600" />
                    <div className="text-xs font-semibold text-amber-900 truncate">{assignment.memberName}</div>
                  </div>
                </div>
              ))}
              
              {/* Working On Members - Regular styling */}
              {workingOnMembers.slice(0, 1).map((assignment, index) => (
                <div key={`working-${index}`} className="bg-blue-50 rounded px-2 py-1">
                  <div className="text-xs font-medium text-blue-900 truncate">{assignment.memberName}</div>
                </div>
              ))}
              
              {project.teamAssignments.length > 2 && (
                <div className="text-xs text-gray-500 px-2">
                  +{project.teamAssignments.length - 2} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Project Links */}
        {socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {socialLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded"
                  title={link.label}
                >
                  <Icon className="h-2.5 w-2.5" />
                </a>
              );
            })}
          </div>
        )}

        <div className="relative">
          <Button
            onClick={onToggleDropdown}
            disabled={updateWorkflow.isPending}
            className="w-full flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
            size="sm"
          >
            <span>Move to Stage</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </Button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {availableStates.map((targetColumn) => (
                <button
                  key={targetColumn.id}
                  onClick={() => onMoveProject(projectId, targetColumn.state)}
                  disabled={updateWorkflow.isPending}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  <span>{targetColumn.title}</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
