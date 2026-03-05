export const idlFactory = ({ IDL }) => {
  const Blockchain = IDL.Record({
    'twitter' : IDL.Text,
    'documentation' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'website' : IDL.Text,
    'logoPath' : IDL.Text,
    'discord' : IDL.Text,
    'telegram' : IDL.Text,
    'github' : IDL.Text,
  });
  const Client = IDL.Record({
    'linkedin' : IDL.Text,
    'contactInfo' : IDL.Text,
    'twitter' : IDL.Text,
    'name' : IDL.Text,
    'website' : IDL.Text,
    'logoPath' : IDL.Text,
    'company' : IDL.Text,
  });
  const GrantProgram = IDL.Record({
    'contactInfo' : IDL.Text,
    'blockchainId' : IDL.Text,
    'name' : IDL.Text,
    'processDetails' : IDL.Text,
    'description' : IDL.Text,
    'deadline' : IDL.Text,
    'applicationRequirements' : IDL.Text,
    'eligibilityCriteria' : IDL.Text,
    'grantAmount' : IDL.Text,
  });
  const WorkflowState = IDL.Variant({
    'submitted' : IDL.Null,
    'rejected' : IDL.Null,
    'accepted' : IDL.Null,
    'inProgress' : IDL.Null,
  });
  const TeamRole = IDL.Variant({
    'responsible' : IDL.Null,
    'workingOn' : IDL.Null,
  });
  const TeamAssignment = IDL.Record({
    'role' : TeamRole,
    'memberName' : IDL.Text,
  });
  const Project = IDL.Record({
    'clientId' : IDL.Text,
    'googleDocLinks' : IDL.Vec(IDL.Text),
    'projectType' : IDL.Text,
    'twitter' : IDL.Text,
    'blockchainId' : IDL.Text,
    'pitchDeck' : IDL.Text,
    'documentation' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'videoDemo' : IDL.Text,
    'documentPaths' : IDL.Vec(IDL.Text),
    'website' : IDL.Text,
    'logoPath' : IDL.Text,
    'workflowState' : WorkflowState,
    'discord' : IDL.Text,
    'teamAssignments' : IDL.Vec(TeamAssignment),
    'telegram' : IDL.Text,
    'github' : IDL.Text,
    'grantProgramIds' : IDL.Vec(IDL.Text),
  });
  const UserRole = IDL.Variant({
    'admin' : IDL.Null,
    'user' : IDL.Null,
    'guest' : IDL.Null,
  });
  const Time = IDL.Int;
  const RSVP = IDL.Record({
    'name' : IDL.Text,
    'inviteCode' : IDL.Text,
    'timestamp' : Time,
    'attending' : IDL.Bool,
  });
  const ShareableLink = IDL.Record({
    'createdAt' : Time,
    'projectId' : IDL.Text,
  });
  const UserProfile = IDL.Record({ 'name' : IDL.Text });
  const FileReference = IDL.Record({ 'hash' : IDL.Text, 'path' : IDL.Text });
  const InviteCode = IDL.Record({
    'created' : Time,
    'code' : IDL.Text,
    'used' : IDL.Bool,
  });
  return IDL.Service({
    'addBlockchain' : IDL.Func([IDL.Text, Blockchain], [], []),
    'addClient' : IDL.Func([IDL.Text, Client], [], []),
    'addGrantProgram' : IDL.Func([IDL.Text, GrantProgram], [], []),
    'addProject' : IDL.Func([IDL.Text, Project], [], []),
    'assignCallerUserRole' : IDL.Func([IDL.Principal, UserRole], [], []),
    'deleteBlockchain' : IDL.Func([IDL.Text], [], []),
    'deleteClient' : IDL.Func([IDL.Text], [], []),
    'deleteGrantProgram' : IDL.Func([IDL.Text], [], []),
    'deleteProject' : IDL.Func([IDL.Text], [], []),
    'deleteShareableLink' : IDL.Func([IDL.Text], [], []),
    'dropFileReference' : IDL.Func([IDL.Text], [], []),
    'generateInviteCode' : IDL.Func([], [IDL.Text], []),
    'generateShareableLink' : IDL.Func([IDL.Text], [IDL.Text], []),
    'getAllBlockchains' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, Blockchain))],
        ['query'],
      ),
    'getAllClients' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, Client))],
        ['query'],
      ),
    'getAllGrantPrograms' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, GrantProgram))],
        ['query'],
      ),
    'getAllProjects' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, Project))],
        ['query'],
      ),
    'getAllRSVPs' : IDL.Func([], [IDL.Vec(RSVP)], ['query']),
    'getAllShareableLinks' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, ShareableLink))],
        ['query'],
      ),
    'getBlockchain' : IDL.Func([IDL.Text], [IDL.Opt(Blockchain)], ['query']),
    'getCallerUserProfile' : IDL.Func([], [IDL.Opt(UserProfile)], ['query']),
    'getCallerUserRole' : IDL.Func([], [UserRole], ['query']),
    'getClient' : IDL.Func([IDL.Text], [IDL.Opt(Client)], ['query']),
    'getClientsByGrantProgram' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Tuple(IDL.Text, Client))],
        ['query'],
      ),
    'getFileReference' : IDL.Func([IDL.Text], [FileReference], ['query']),
    'getFilteredProjects' : IDL.Func(
        [
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(IDL.Text),
          IDL.Opt(WorkflowState),
          IDL.Opt(IDL.Text),
        ],
        [IDL.Vec(IDL.Tuple(IDL.Text, Project))],
        ['query'],
      ),
    'getGrantProgram' : IDL.Func(
        [IDL.Text],
        [IDL.Opt(GrantProgram)],
        ['query'],
      ),
    'getGrantProgramsByBlockchain' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Tuple(IDL.Text, GrantProgram))],
        ['query'],
      ),
    'getInviteCodes' : IDL.Func([], [IDL.Vec(InviteCode)], ['query']),
    'getProject' : IDL.Func([IDL.Text], [IDL.Opt(Project)], ['query']),
    'getProjectTeamAssignments' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(TeamAssignment)],
        ['query'],
      ),
    'getProjectsByGrantProgram' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(IDL.Tuple(IDL.Text, Project))],
        ['query'],
      ),
    'getUserProfile' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(UserProfile)],
        ['query'],
      ),
    'initializeAccessControl' : IDL.Func([], [], []),
    'isCallerAdmin' : IDL.Func([], [IDL.Bool], ['query']),
    'linkGrantProgramToProject' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'listFileReferences' : IDL.Func([], [IDL.Vec(FileReference)], ['query']),
    'registerFileReference' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'resolveSharedProjectLink' : IDL.Func(
        [IDL.Text],
        [
          IDL.Variant({
            'projectNotFound' : IDL.Null,
            'invalidLink' : IDL.Null,
            'success' : Project,
          }),
        ],
        ['query'],
      ),
    'saveCallerUserProfile' : IDL.Func([UserProfile], [], []),
    'submitRSVP' : IDL.Func([IDL.Text, IDL.Bool, IDL.Text], [], []),
    'unlinkGrantProgramFromProject' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'updateBlockchain' : IDL.Func([IDL.Text, Blockchain], [], []),
    'updateClient' : IDL.Func([IDL.Text, Client], [], []),
    'updateGrantProgram' : IDL.Func([IDL.Text, GrantProgram], [], []),
    'updateProject' : IDL.Func([IDL.Text, Project], [], []),
    'updateProjectTeamAssignments' : IDL.Func(
        [IDL.Text, IDL.Vec(TeamAssignment)],
        [],
        [],
      ),
    'updateProjectWorkflow' : IDL.Func([IDL.Text, WorkflowState], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
