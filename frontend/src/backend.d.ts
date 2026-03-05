import { type HttpAgentOptions, type ActorConfig, type Agent } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";
import { CreateActorOptions } from "declarations/backend";
import { _SERVICE } from "declarations/backend/backend.did.d.js";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface GrantProgram {
    contactInfo: string;
    blockchainId: string;
    name: string;
    processDetails: string;
    description: string;
    deadline: string;
    applicationRequirements: string;
    eligibilityCriteria: string;
    grantAmount: string;
}
export interface TeamAssignment {
    role: TeamRole;
    memberName: string;
}
export interface FileReference {
    hash: string;
    path: string;
}
export interface Blockchain {
    twitter: string;
    documentation: string;
    name: string;
    description: string;
    website: string;
    logoPath: string;
    discord: string;
    telegram: string;
    github: string;
}
export interface ShareableLink {
    createdAt: Time;
    projectId: string;
}
export interface Client {
    linkedin: string;
    contactInfo: string;
    twitter: string;
    name: string;
    website: string;
    logoPath: string;
    company: string;
}
export interface RSVP {
    name: string;
    inviteCode: string;
    timestamp: Time;
    attending: boolean;
}
export type Time = bigint;
export interface Project {
    clientId: string;
    googleDocLinks: Array<string>;
    projectType: string;
    twitter: string;
    blockchainId: string;
    pitchDeck: string;
    documentation: string;
    name: string;
    description: string;
    videoDemo: string;
    documentPaths: Array<string>;
    website: string;
    logoPath: string;
    workflowState: WorkflowState;
    discord: string;
    teamAssignments: Array<TeamAssignment>;
    telegram: string;
    github: string;
    grantProgramIds: Array<string>;
}
export interface InviteCode {
    created: Time;
    code: string;
    used: boolean;
}
export interface UserProfile {
    name: string;
}
export declare const createActor: (canisterId: string | Principal, options?: CreateActorOptions, processError?: (error: unknown) => never) => backendInterface;
export declare const canisterId: string;
export enum TeamRole {
    responsible = "responsible",
    workingOn = "workingOn"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum WorkflowState {
    submitted = "submitted",
    rejected = "rejected",
    accepted = "accepted",
    inProgress = "inProgress"
}
export interface backendInterface {
    addBlockchain(id: string, blockchain: Blockchain): Promise<void>;
    addClient(id: string, client: Client): Promise<void>;
    addGrantProgram(id: string, grantProgram: GrantProgram): Promise<void>;
    addProject(id: string, project: Project): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteBlockchain(id: string): Promise<void>;
    deleteClient(id: string): Promise<void>;
    deleteGrantProgram(id: string): Promise<void>;
    deleteProject(id: string): Promise<void>;
    deleteShareableLink(linkId: string): Promise<void>;
    dropFileReference(path: string): Promise<void>;
    generateInviteCode(): Promise<string>;
    generateShareableLink(projectId: string): Promise<string>;
    getAllBlockchains(): Promise<Array<[string, Blockchain]>>;
    getAllClients(): Promise<Array<[string, Client]>>;
    getAllGrantPrograms(): Promise<Array<[string, GrantProgram]>>;
    getAllProjects(): Promise<Array<[string, Project]>>;
    getAllRSVPs(): Promise<Array<RSVP>>;
    getAllShareableLinks(): Promise<Array<[string, ShareableLink]>>;
    getBlockchain(id: string): Promise<Blockchain | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClient(id: string): Promise<Client | null>;
    getClientsByGrantProgram(grantProgramId: string): Promise<Array<[string, Client]>>;
    getFileReference(path: string): Promise<FileReference>;
    getFilteredProjects(projectType: string | null, blockchainId: string | null, clientId: string | null, workflowState: WorkflowState | null, teamMember: string | null): Promise<Array<[string, Project]>>;
    getGrantProgram(id: string): Promise<GrantProgram | null>;
    getGrantProgramsByBlockchain(blockchainId: string): Promise<Array<[string, GrantProgram]>>;
    getInviteCodes(): Promise<Array<InviteCode>>;
    getProject(id: string): Promise<Project | null>;
    getProjectTeamAssignments(id: string): Promise<Array<TeamAssignment>>;
    getProjectsByGrantProgram(grantProgramId: string): Promise<Array<[string, Project]>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    linkGrantProgramToProject(projectId: string, grantProgramId: string): Promise<void>;
    listFileReferences(): Promise<Array<FileReference>>;
    registerFileReference(path: string, hash: string): Promise<void>;
    resolveSharedProjectLink(linkId: string): Promise<{
        __kind__: "projectNotFound";
        projectNotFound: null;
    } | {
        __kind__: "invalidLink";
        invalidLink: null;
    } | {
        __kind__: "success";
        success: Project;
    }>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitRSVP(name: string, attending: boolean, inviteCode: string): Promise<void>;
    unlinkGrantProgramFromProject(projectId: string, grantProgramId: string): Promise<void>;
    updateBlockchain(id: string, updatedBlockchain: Blockchain): Promise<void>;
    updateClient(id: string, updatedClient: Client): Promise<void>;
    updateGrantProgram(id: string, updatedGrantProgram: GrantProgram): Promise<void>;
    updateProject(id: string, updatedProject: Project): Promise<void>;
    updateProjectTeamAssignments(id: string, teamAssignments: Array<TeamAssignment>): Promise<void>;
    updateProjectWorkflow(id: string, newState: WorkflowState): Promise<void>;
}

