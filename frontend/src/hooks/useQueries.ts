import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { 
  type UserProfile, 
  type Blockchain, 
  type Project, 
  type Client, 
  type GrantProgram,
  type WorkflowState,
  type TeamAssignment 
} from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCallerUserProfile();
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        throw new Error('Failed to load user profile. Please try again.');
      }
    },
    enabled: !!actor && !actorFetching,
    retry: (failureCount, error) => {
      if (error?.message?.includes('Unauthorized')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.saveCallerUserProfile(profile);
      } catch (error) {
        console.error('Failed to save user profile:', error);
        throw new Error('Failed to save profile. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Blockchain Queries
export function useGetAllBlockchains() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, Blockchain]>>({
    queryKey: ['blockchains'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllBlockchains();
      } catch (error) {
        console.error('Failed to fetch blockchains:', error);
        throw new Error('Failed to load blockchains. Please try again.');
      }
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useAddBlockchain() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, blockchain }: { id: string; blockchain: Blockchain }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.addBlockchain(id, blockchain);
      } catch (error) {
        console.error('Failed to add blockchain:', error);
        throw new Error('Failed to add blockchain. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockchains'] });
    },
  });
}

export function useUpdateBlockchain() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, blockchain }: { id: string; blockchain: Blockchain }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.updateBlockchain(id, blockchain);
      } catch (error) {
        console.error('Failed to update blockchain:', error);
        throw new Error('Failed to update blockchain. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockchains'] });
    },
  });
}

export function useDeleteBlockchain() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.deleteBlockchain(id);
      } catch (error) {
        console.error('Failed to delete blockchain:', error);
        throw new Error('Failed to delete blockchain. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockchains'] });
    },
  });
}

// Project Queries
export function useGetAllProjects() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, Project]>>({
    queryKey: ['projects'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllProjects();
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        throw new Error('Failed to load projects. Please try again.');
      }
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useGetFilteredProjects(
  projectType?: string | null,
  blockchainId?: string | null,
  clientId?: string | null,
  workflowState?: WorkflowState | null,
  teamMember?: string | null
) {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, Project]>>({
    queryKey: ['filteredProjects', projectType, blockchainId, clientId, workflowState, teamMember],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getFilteredProjects(
          projectType || null,
          blockchainId || null,
          clientId || null,
          workflowState || null,
          teamMember || null
        );
      } catch (error) {
        console.error('Failed to fetch filtered projects:', error);
        throw new Error('Failed to load projects. Please try again.');
      }
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useAddProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, project }: { id: string; project: Project }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.addProject(id, project);
      } catch (error) {
        console.error('Failed to add project:', error);
        throw new Error('Failed to add project. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['filteredProjects'] });
      queryClient.invalidateQueries({ queryKey: ['projectsByGrantProgram'] });
      queryClient.invalidateQueries({ queryKey: ['clientsByGrantProgram'] });
    },
  });
}

export function useUpdateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, project }: { id: string; project: Project }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.updateProject(id, project);
      } catch (error) {
        console.error('Failed to update project:', error);
        throw new Error('Failed to update project. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['filteredProjects'] });
      queryClient.invalidateQueries({ queryKey: ['projectsByGrantProgram'] });
      queryClient.invalidateQueries({ queryKey: ['clientsByGrantProgram'] });
    },
  });
}

export function useDeleteProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.deleteProject(id);
      } catch (error) {
        console.error('Failed to delete project:', error);
        throw new Error('Failed to delete project. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['filteredProjects'] });
      queryClient.invalidateQueries({ queryKey: ['projectsByGrantProgram'] });
      queryClient.invalidateQueries({ queryKey: ['clientsByGrantProgram'] });
    },
  });
}

export function useUpdateProjectWorkflow() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newState }: { id: string; newState: WorkflowState }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.updateProjectWorkflow(id, newState);
      } catch (error) {
        console.error('Failed to update project workflow:', error);
        throw new Error('Failed to update project status. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['filteredProjects'] });
    },
  });
}

export function useUpdateProjectTeamAssignments() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, teamAssignments }: { id: string; teamAssignments: TeamAssignment[] }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.updateProjectTeamAssignments(id, teamAssignments);
      } catch (error) {
        console.error('Failed to update team assignments:', error);
        throw new Error('Failed to update team assignments. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['filteredProjects'] });
    },
  });
}

export function useGetProjectTeamAssignments(projectId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<TeamAssignment[]>({
    queryKey: ['projectTeamAssignments', projectId],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getProjectTeamAssignments(projectId);
      } catch (error) {
        console.error('Failed to fetch team assignments:', error);
        throw new Error('Failed to load team assignments. Please try again.');
      }
    },
    enabled: !!actor && !isFetching && !!projectId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

// Client Queries
export function useGetAllClients() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, Client]>>({
    queryKey: ['clients'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllClients();
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        throw new Error('Failed to load clients. Please try again.');
      }
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useAddClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, client }: { id: string; client: Client }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.addClient(id, client);
      } catch (error) {
        console.error('Failed to add client:', error);
        throw new Error('Failed to add client. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useUpdateClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, client }: { id: string; client: Client }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.updateClient(id, client);
      } catch (error) {
        console.error('Failed to update client:', error);
        throw new Error('Failed to update client. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

export function useDeleteClient() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.deleteClient(id);
      } catch (error) {
        console.error('Failed to delete client:', error);
        throw new Error('Failed to delete client. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}

// Grant Program Queries
export function useGetAllGrantPrograms() {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, GrantProgram]>>({
    queryKey: ['grantPrograms'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllGrantPrograms();
      } catch (error) {
        console.error('Failed to fetch grant programs:', error);
        throw new Error('Failed to load grant programs. Please try again.');
      }
    },
    enabled: !!actor && !isFetching,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useGetGrantProgramsByBlockchain(blockchainId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, GrantProgram]>>({
    queryKey: ['grantProgramsByBlockchain', blockchainId],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getGrantProgramsByBlockchain(blockchainId);
      } catch (error) {
        console.error('Failed to fetch grant programs by blockchain:', error);
        throw new Error('Failed to load grant programs. Please try again.');
      }
    },
    enabled: !!actor && !isFetching && !!blockchainId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useAddGrantProgram() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, grantProgram }: { id: string; grantProgram: GrantProgram }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.addGrantProgram(id, grantProgram);
      } catch (error) {
        console.error('Failed to add grant program:', error);
        throw new Error('Failed to add grant program. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grantPrograms'] });
      queryClient.invalidateQueries({ queryKey: ['grantProgramsByBlockchain'] });
    },
  });
}

export function useUpdateGrantProgram() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, grantProgram }: { id: string; grantProgram: GrantProgram }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.updateGrantProgram(id, grantProgram);
      } catch (error) {
        console.error('Failed to update grant program:', error);
        throw new Error('Failed to update grant program. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grantPrograms'] });
      queryClient.invalidateQueries({ queryKey: ['grantProgramsByBlockchain'] });
    },
  });
}

export function useDeleteGrantProgram() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.deleteGrantProgram(id);
      } catch (error) {
        console.error('Failed to delete grant program:', error);
        throw new Error('Failed to delete grant program. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grantPrograms'] });
      queryClient.invalidateQueries({ queryKey: ['grantProgramsByBlockchain'] });
      queryClient.invalidateQueries({ queryKey: ['projectsByGrantProgram'] });
      queryClient.invalidateQueries({ queryKey: ['clientsByGrantProgram'] });
    },
  });
}

// Grant Program Integration Queries
export function useGetProjectsByGrantProgram(grantProgramId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, Project]>>({
    queryKey: ['projectsByGrantProgram', grantProgramId],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getProjectsByGrantProgram(grantProgramId);
      } catch (error) {
        console.error('Failed to fetch projects by grant program:', error);
        throw new Error('Failed to load projects. Please try again.');
      }
    },
    enabled: !!actor && !isFetching && !!grantProgramId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useGetClientsByGrantProgram(grantProgramId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Array<[string, Client]>>({
    queryKey: ['clientsByGrantProgram', grantProgramId],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getClientsByGrantProgram(grantProgramId);
      } catch (error) {
        console.error('Failed to fetch clients by grant program:', error);
        throw new Error('Failed to load clients. Please try again.');
      }
    },
    enabled: !!actor && !isFetching && !!grantProgramId,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useLinkGrantProgramToProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, grantProgramId }: { projectId: string; grantProgramId: string }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.linkGrantProgramToProject(projectId, grantProgramId);
      } catch (error) {
        console.error('Failed to link grant program to project:', error);
        throw new Error('Failed to link grant program. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['filteredProjects'] });
      queryClient.invalidateQueries({ queryKey: ['projectsByGrantProgram'] });
      queryClient.invalidateQueries({ queryKey: ['clientsByGrantProgram'] });
    },
  });
}

export function useUnlinkGrantProgramFromProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, grantProgramId }: { projectId: string; grantProgramId: string }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.unlinkGrantProgramFromProject(projectId, grantProgramId);
      } catch (error) {
        console.error('Failed to unlink grant program from project:', error);
        throw new Error('Failed to unlink grant program. Please try again.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['filteredProjects'] });
      queryClient.invalidateQueries({ queryKey: ['projectsByGrantProgram'] });
      queryClient.invalidateQueries({ queryKey: ['clientsByGrantProgram'] });
    },
  });
}

// Shareable Links Queries
export function useGenerateShareableLink() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (projectId: string) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.generateShareableLink(projectId);
      } catch (error) {
        console.error('Failed to generate shareable link:', error);
        throw new Error('Failed to generate shareable link. Please try again.');
      }
    },
  });
}

export function useResolveSharedProjectLink(linkId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<{
    project: Project | null;
    error: 'invalidLink' | 'projectNotFound' | null;
  }>({
    queryKey: ['sharedProject', linkId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      if (!linkId || linkId.trim() === '') {
        return { project: null, error: 'invalidLink' as const };
      }
      
      try {
        const result = await actor.resolveSharedProjectLink(linkId);
        
        if (result.__kind__ === 'success') {
          return { project: result.success, error: null };
        } else if (result.__kind__ === 'invalidLink') {
          return { project: null, error: 'invalidLink' as const };
        } else if (result.__kind__ === 'projectNotFound') {
          return { project: null, error: 'projectNotFound' as const };
        } else {
          return { project: null, error: 'invalidLink' as const };
        }
      } catch (error) {
        console.error('Failed to resolve shared project link:', error);
        return { project: null, error: 'invalidLink' as const };
      }
    },
    enabled: !!actor && !isFetching && !!linkId,
    retry: (failureCount, error) => {
      if (error?.message?.includes('Actor not available')) {
        return failureCount < 2;
      }
      return false;
    },
    retryDelay: 1000,
  });
}
