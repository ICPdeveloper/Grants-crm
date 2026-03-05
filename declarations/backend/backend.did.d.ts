import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Blockchain {
  'twitter' : string,
  'documentation' : string,
  'name' : string,
  'description' : string,
  'website' : string,
  'logoPath' : string,
  'discord' : string,
  'telegram' : string,
  'github' : string,
}
export interface Client {
  'linkedin' : string,
  'contactInfo' : string,
  'twitter' : string,
  'name' : string,
  'website' : string,
  'logoPath' : string,
  'company' : string,
}
export interface FileReference { 'hash' : string, 'path' : string }
export interface GrantProgram {
  'contactInfo' : string,
  'blockchainId' : string,
  'name' : string,
  'processDetails' : string,
  'description' : string,
  'deadline' : string,
  'applicationRequirements' : string,
  'eligibilityCriteria' : string,
  'grantAmount' : string,
}
export interface InviteCode {
  'created' : Time,
  'code' : string,
  'used' : boolean,
}
export interface Project {
  'clientId' : string,
  'googleDocLinks' : Array<string>,
  'projectType' : string,
  'twitter' : string,
  'blockchainId' : string,
  'pitchDeck' : string,
  'documentation' : string,
  'name' : string,
  'description' : string,
  'videoDemo' : string,
  'documentPaths' : Array<string>,
  'website' : string,
  'logoPath' : string,
  'workflowState' : WorkflowState,
  'discord' : string,
  'teamAssignments' : Array<TeamAssignment>,
  'telegram' : string,
  'github' : string,
  'grantProgramIds' : Array<string>,
}
export interface RSVP {
  'name' : string,
  'inviteCode' : string,
  'timestamp' : Time,
  'attending' : boolean,
}
export interface ShareableLink { 'createdAt' : Time, 'projectId' : string }
export interface TeamAssignment { 'role' : TeamRole, 'memberName' : string }
export type TeamRole = { 'responsible' : null } |
  { 'workingOn' : null };
export type Time = bigint;
export interface UserProfile { 'name' : string }
export type UserRole = { 'admin' : null } |
  { 'user' : null } |
  { 'guest' : null };
export type WorkflowState = { 'submitted' : null } |
  { 'rejected' : null } |
  { 'accepted' : null } |
  { 'inProgress' : null };
export interface _SERVICE {
  'addBlockchain' : ActorMethod<[string, Blockchain], undefined>,
  'addClient' : ActorMethod<[string, Client], undefined>,
  'addGrantProgram' : ActorMethod<[string, GrantProgram], undefined>,
  'addProject' : ActorMethod<[string, Project], undefined>,
  'assignCallerUserRole' : ActorMethod<[Principal, UserRole], undefined>,
  'deleteBlockchain' : ActorMethod<[string], undefined>,
  'deleteClient' : ActorMethod<[string], undefined>,
  'deleteGrantProgram' : ActorMethod<[string], undefined>,
  'deleteProject' : ActorMethod<[string], undefined>,
  'deleteShareableLink' : ActorMethod<[string], undefined>,
  'dropFileReference' : ActorMethod<[string], undefined>,
  'generateInviteCode' : ActorMethod<[], string>,
  'generateShareableLink' : ActorMethod<[string], string>,
  'getAllBlockchains' : ActorMethod<[], Array<[string, Blockchain]>>,
  'getAllClients' : ActorMethod<[], Array<[string, Client]>>,
  'getAllGrantPrograms' : ActorMethod<[], Array<[string, GrantProgram]>>,
  'getAllProjects' : ActorMethod<[], Array<[string, Project]>>,
  'getAllRSVPs' : ActorMethod<[], Array<RSVP>>,
  'getAllShareableLinks' : ActorMethod<[], Array<[string, ShareableLink]>>,
  'getBlockchain' : ActorMethod<[string], [] | [Blockchain]>,
  'getCallerUserProfile' : ActorMethod<[], [] | [UserProfile]>,
  'getCallerUserRole' : ActorMethod<[], UserRole>,
  'getClient' : ActorMethod<[string], [] | [Client]>,
  'getClientsByGrantProgram' : ActorMethod<[string], Array<[string, Client]>>,
  'getFileReference' : ActorMethod<[string], FileReference>,
  'getFilteredProjects' : ActorMethod<
    [
      [] | [string],
      [] | [string],
      [] | [string],
      [] | [WorkflowState],
      [] | [string],
    ],
    Array<[string, Project]>
  >,
  'getGrantProgram' : ActorMethod<[string], [] | [GrantProgram]>,
  'getGrantProgramsByBlockchain' : ActorMethod<
    [string],
    Array<[string, GrantProgram]>
  >,
  'getInviteCodes' : ActorMethod<[], Array<InviteCode>>,
  'getProject' : ActorMethod<[string], [] | [Project]>,
  'getProjectTeamAssignments' : ActorMethod<[string], Array<TeamAssignment>>,
  'getProjectsByGrantProgram' : ActorMethod<[string], Array<[string, Project]>>,
  'getUserProfile' : ActorMethod<[Principal], [] | [UserProfile]>,
  'initializeAccessControl' : ActorMethod<[], undefined>,
  'isCallerAdmin' : ActorMethod<[], boolean>,
  'linkGrantProgramToProject' : ActorMethod<[string, string], undefined>,
  'listFileReferences' : ActorMethod<[], Array<FileReference>>,
  'registerFileReference' : ActorMethod<[string, string], undefined>,
  'resolveSharedProjectLink' : ActorMethod<
    [string],
    { 'projectNotFound' : null } |
      { 'invalidLink' : null } |
      { 'success' : Project }
  >,
  'saveCallerUserProfile' : ActorMethod<[UserProfile], undefined>,
  'submitRSVP' : ActorMethod<[string, boolean, string], undefined>,
  'unlinkGrantProgramFromProject' : ActorMethod<[string, string], undefined>,
  'updateBlockchain' : ActorMethod<[string, Blockchain], undefined>,
  'updateClient' : ActorMethod<[string, Client], undefined>,
  'updateGrantProgram' : ActorMethod<[string, GrantProgram], undefined>,
  'updateProject' : ActorMethod<[string, Project], undefined>,
  'updateProjectTeamAssignments' : ActorMethod<
    [string, Array<TeamAssignment>],
    undefined
  >,
  'updateProjectWorkflow' : ActorMethod<[string, WorkflowState], undefined>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
