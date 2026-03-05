import React from 'react';
import { useGetAllBlockchains, useGetAllClients, useGetAllProjects } from '../hooks/useQueries';
import { WorkflowState } from '../backend';
import { Filter, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ProjectFiltersProps {
  projectType: string | null;
  blockchainId: string | null;
  clientId: string | null;
  workflowState: WorkflowState | null;
  teamMember: string | null;
  onProjectTypeChange: (value: string | null) => void;
  onBlockchainChange: (value: string | null) => void;
  onClientChange: (value: string | null) => void;
  onWorkflowStateChange: (value: WorkflowState | null) => void;
  onTeamMemberChange: (value: string | null) => void;
  onClearFilters: () => void;
  availableProjectTypes: string[];
}

export default function ProjectFilters({
  projectType,
  blockchainId,
  clientId,
  workflowState,
  teamMember,
  onProjectTypeChange,
  onBlockchainChange,
  onClientChange,
  onWorkflowStateChange,
  onTeamMemberChange,
  onClearFilters,
  availableProjectTypes,
}: ProjectFiltersProps) {
  const { data: blockchains = [] } = useGetAllBlockchains();
  const { data: clients = [] } = useGetAllClients();
  const { data: allProjects = [] } = useGetAllProjects();

  const workflowStates = [
    { value: WorkflowState.inProgress, label: 'In Progress' },
    { value: WorkflowState.submitted, label: 'Submitted' },
    { value: WorkflowState.accepted, label: 'Accepted' },
    { value: WorkflowState.rejected, label: 'Rejected' },
  ];

  // Get unique internal team members from all projects
  const availableTeamMembers = React.useMemo(() => {
    const members = new Set<string>();
    allProjects.forEach(([_, project]) => {
      project.teamAssignments.forEach(assignment => {
        if (assignment.memberName.trim()) {
          members.add(assignment.memberName);
        }
      });
    });
    return Array.from(members).sort();
  }, [allProjects]);

  const hasActiveFilters = projectType || blockchainId || clientId || workflowState || teamMember;

  return (
    <Card className="mb-8 shadow-sm border-0 bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Filter className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Filter Projects</h3>
              <p className="text-sm text-gray-500">Refine your view to find specific projects</p>
            </div>
          </div>
          {hasActiveFilters && (
            <Button
              onClick={onClearFilters}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Clear All</span>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Project Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Type
            </label>
            <Select
              value={projectType || undefined}
              onValueChange={(value) => onProjectTypeChange(value || null)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                {availableProjectTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Blockchain Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blockchain
            </label>
            <Select
              value={blockchainId || undefined}
              onValueChange={(value) => onBlockchainChange(value || null)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All blockchains" />
              </SelectTrigger>
              <SelectContent>
                {blockchains.map(([id, blockchain]) => (
                  <SelectItem key={id} value={id}>
                    {blockchain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Client Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client
            </label>
            <Select
              value={clientId || undefined}
              onValueChange={(value) => onClientChange(value || null)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All clients" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(([id, client]) => (
                  <SelectItem key={id} value={id}>
                    {client.name} - {client.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Workflow State Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workflow Stage
            </label>
            <Select
              value={workflowState || undefined}
              onValueChange={(value) => onWorkflowStateChange((value as WorkflowState) || null)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All stages" />
              </SelectTrigger>
              <SelectContent>
                {workflowStates.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Internal Team Member Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Team Member
            </label>
            <Select
              value={teamMember || undefined}
              onValueChange={(value) => onTeamMemberChange(value || null)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All team members" />
              </SelectTrigger>
              <SelectContent>
                {availableTeamMembers.map((member) => (
                  <SelectItem key={member} value={member}>
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
