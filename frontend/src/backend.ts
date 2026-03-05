import { type HttpAgentOptions, type ActorConfig, type Agent, type ActorSubclass } from "@dfinity/agent";
import type { Principal } from "@dfinity/principal";
import { backend as _backend, createActor as _createActor, canisterId as _canisterId, CreateActorOptions } from "declarations/backend";
import { _SERVICE } from "declarations/backend/backend.did.d.js";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
function some<T>(value: T): Some<T> {
    return {
        __kind__: "Some",
        value: value
    };
}
function none(): None {
    return {
        __kind__: "None"
    };
}
function isNone<T>(option: Option<T>): option is None {
    return option.__kind__ === "None";
}
function isSome<T>(option: Option<T>): option is Some<T> {
    return option.__kind__ === "Some";
}
function unwrap<T>(option: Option<T>): T {
    if (isNone(option)) {
        throw new Error("unwrap: none");
    }
    return option.value;
}
function candid_some<T>(value: T): [T] {
    return [
        value
    ];
}
function candid_none<T>(): [] {
    return [];
}
function record_opt_to_undefined<T>(arg: T | null): T | undefined {
    return arg == null ? undefined : arg;
}
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
export function createActor(canisterId: string | Principal, options?: CreateActorOptions, processError?: (error: unknown) => never): backendInterface {
    const actor = _createActor(canisterId, options);
    return new Backend(actor, processError);
}
export const canisterId = _canisterId;
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
import type { Blockchain as _Blockchain, Client as _Client, GrantProgram as _GrantProgram, Project as _Project, TeamAssignment as _TeamAssignment, TeamRole as _TeamRole, UserProfile as _UserProfile, UserRole as _UserRole, WorkflowState as _WorkflowState } from "declarations/backend/backend.did.d.ts";
class Backend implements backendInterface {
    private actor: ActorSubclass<_SERVICE>;
    constructor(actor?: ActorSubclass<_SERVICE>, private processError?: (error: unknown) => never){
        this.actor = actor ?? _backend;
    }
    async addBlockchain(arg0: string, arg1: Blockchain): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.addBlockchain(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.addBlockchain(arg0, arg1);
            return result;
        }
    }
    async addClient(arg0: string, arg1: Client): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.addClient(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.addClient(arg0, arg1);
            return result;
        }
    }
    async addGrantProgram(arg0: string, arg1: GrantProgram): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.addGrantProgram(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.addGrantProgram(arg0, arg1);
            return result;
        }
    }
    async addProject(arg0: string, arg1: Project): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.addProject(arg0, to_candid_Project_n1(arg1));
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.addProject(arg0, to_candid_Project_n1(arg1));
            return result;
        }
    }
    async assignCallerUserRole(arg0: Principal, arg1: UserRole): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n10(arg1));
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.assignCallerUserRole(arg0, to_candid_UserRole_n10(arg1));
            return result;
        }
    }
    async deleteBlockchain(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.deleteBlockchain(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.deleteBlockchain(arg0);
            return result;
        }
    }
    async deleteClient(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.deleteClient(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.deleteClient(arg0);
            return result;
        }
    }
    async deleteGrantProgram(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.deleteGrantProgram(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.deleteGrantProgram(arg0);
            return result;
        }
    }
    async deleteProject(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.deleteProject(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.deleteProject(arg0);
            return result;
        }
    }
    async deleteShareableLink(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.deleteShareableLink(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.deleteShareableLink(arg0);
            return result;
        }
    }
    async dropFileReference(arg0: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.dropFileReference(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.dropFileReference(arg0);
            return result;
        }
    }
    async generateInviteCode(): Promise<string> {
        if (this.processError) {
            try {
                const result = await this.actor.generateInviteCode();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.generateInviteCode();
            return result;
        }
    }
    async generateShareableLink(arg0: string): Promise<string> {
        if (this.processError) {
            try {
                const result = await this.actor.generateShareableLink(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.generateShareableLink(arg0);
            return result;
        }
    }
    async getAllBlockchains(): Promise<Array<[string, Blockchain]>> {
        if (this.processError) {
            try {
                const result = await this.actor.getAllBlockchains();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getAllBlockchains();
            return result;
        }
    }
    async getAllClients(): Promise<Array<[string, Client]>> {
        if (this.processError) {
            try {
                const result = await this.actor.getAllClients();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getAllClients();
            return result;
        }
    }
    async getAllGrantPrograms(): Promise<Array<[string, GrantProgram]>> {
        if (this.processError) {
            try {
                const result = await this.actor.getAllGrantPrograms();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getAllGrantPrograms();
            return result;
        }
    }
    async getAllProjects(): Promise<Array<[string, Project]>> {
        if (this.processError) {
            try {
                const result = await this.actor.getAllProjects();
                return from_candid_vec_n12(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getAllProjects();
            return from_candid_vec_n12(result);
        }
    }
    async getAllRSVPs(): Promise<Array<RSVP>> {
        if (this.processError) {
            try {
                const result = await this.actor.getAllRSVPs();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getAllRSVPs();
            return result;
        }
    }
    async getAllShareableLinks(): Promise<Array<[string, ShareableLink]>> {
        if (this.processError) {
            try {
                const result = await this.actor.getAllShareableLinks();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getAllShareableLinks();
            return result;
        }
    }
    async getBlockchain(arg0: string): Promise<Blockchain | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getBlockchain(arg0);
                return from_candid_opt_n23(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getBlockchain(arg0);
            return from_candid_opt_n23(result);
        }
    }
    async getCallerUserProfile(): Promise<UserProfile | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getCallerUserProfile();
                return from_candid_opt_n24(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getCallerUserProfile();
            return from_candid_opt_n24(result);
        }
    }
    async getCallerUserRole(): Promise<UserRole> {
        if (this.processError) {
            try {
                const result = await this.actor.getCallerUserRole();
                return from_candid_UserRole_n25(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getCallerUserRole();
            return from_candid_UserRole_n25(result);
        }
    }
    async getClient(arg0: string): Promise<Client | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getClient(arg0);
                return from_candid_opt_n27(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getClient(arg0);
            return from_candid_opt_n27(result);
        }
    }
    async getClientsByGrantProgram(arg0: string): Promise<Array<[string, Client]>> {
        if (this.processError) {
            try {
                const result = await this.actor.getClientsByGrantProgram(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getClientsByGrantProgram(arg0);
            return result;
        }
    }
    async getFileReference(arg0: string): Promise<FileReference> {
        if (this.processError) {
            try {
                const result = await this.actor.getFileReference(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getFileReference(arg0);
            return result;
        }
    }
    async getFilteredProjects(arg0: string | null, arg1: string | null, arg2: string | null, arg3: WorkflowState | null, arg4: string | null): Promise<Array<[string, Project]>> {
        if (this.processError) {
            try {
                const result = await this.actor.getFilteredProjects(to_candid_opt_n28(arg0), to_candid_opt_n28(arg1), to_candid_opt_n28(arg2), to_candid_opt_n29(arg3), to_candid_opt_n28(arg4));
                return from_candid_vec_n12(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getFilteredProjects(to_candid_opt_n28(arg0), to_candid_opt_n28(arg1), to_candid_opt_n28(arg2), to_candid_opt_n29(arg3), to_candid_opt_n28(arg4));
            return from_candid_vec_n12(result);
        }
    }
    async getGrantProgram(arg0: string): Promise<GrantProgram | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getGrantProgram(arg0);
                return from_candid_opt_n30(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getGrantProgram(arg0);
            return from_candid_opt_n30(result);
        }
    }
    async getGrantProgramsByBlockchain(arg0: string): Promise<Array<[string, GrantProgram]>> {
        if (this.processError) {
            try {
                const result = await this.actor.getGrantProgramsByBlockchain(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getGrantProgramsByBlockchain(arg0);
            return result;
        }
    }
    async getInviteCodes(): Promise<Array<InviteCode>> {
        if (this.processError) {
            try {
                const result = await this.actor.getInviteCodes();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getInviteCodes();
            return result;
        }
    }
    async getProject(arg0: string): Promise<Project | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getProject(arg0);
                return from_candid_opt_n31(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getProject(arg0);
            return from_candid_opt_n31(result);
        }
    }
    async getProjectTeamAssignments(arg0: string): Promise<Array<TeamAssignment>> {
        if (this.processError) {
            try {
                const result = await this.actor.getProjectTeamAssignments(arg0);
                return from_candid_vec_n18(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getProjectTeamAssignments(arg0);
            return from_candid_vec_n18(result);
        }
    }
    async getProjectsByGrantProgram(arg0: string): Promise<Array<[string, Project]>> {
        if (this.processError) {
            try {
                const result = await this.actor.getProjectsByGrantProgram(arg0);
                return from_candid_vec_n12(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getProjectsByGrantProgram(arg0);
            return from_candid_vec_n12(result);
        }
    }
    async getUserProfile(arg0: Principal): Promise<UserProfile | null> {
        if (this.processError) {
            try {
                const result = await this.actor.getUserProfile(arg0);
                return from_candid_opt_n24(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.getUserProfile(arg0);
            return from_candid_opt_n24(result);
        }
    }
    async initializeAccessControl(): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.initializeAccessControl();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.initializeAccessControl();
            return result;
        }
    }
    async isCallerAdmin(): Promise<boolean> {
        if (this.processError) {
            try {
                const result = await this.actor.isCallerAdmin();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.isCallerAdmin();
            return result;
        }
    }
    async linkGrantProgramToProject(arg0: string, arg1: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.linkGrantProgramToProject(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.linkGrantProgramToProject(arg0, arg1);
            return result;
        }
    }
    async listFileReferences(): Promise<Array<FileReference>> {
        if (this.processError) {
            try {
                const result = await this.actor.listFileReferences();
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.listFileReferences();
            return result;
        }
    }
    async registerFileReference(arg0: string, arg1: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.registerFileReference(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.registerFileReference(arg0, arg1);
            return result;
        }
    }
    async resolveSharedProjectLink(arg0: string): Promise<{
        __kind__: "projectNotFound";
        projectNotFound: null;
    } | {
        __kind__: "invalidLink";
        invalidLink: null;
    } | {
        __kind__: "success";
        success: Project;
    }> {
        if (this.processError) {
            try {
                const result = await this.actor.resolveSharedProjectLink(arg0);
                return from_candid_variant_n32(result);
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.resolveSharedProjectLink(arg0);
            return from_candid_variant_n32(result);
        }
    }
    async saveCallerUserProfile(arg0: UserProfile): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.saveCallerUserProfile(arg0);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.saveCallerUserProfile(arg0);
            return result;
        }
    }
    async submitRSVP(arg0: string, arg1: boolean, arg2: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.submitRSVP(arg0, arg1, arg2);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.submitRSVP(arg0, arg1, arg2);
            return result;
        }
    }
    async unlinkGrantProgramFromProject(arg0: string, arg1: string): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.unlinkGrantProgramFromProject(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.unlinkGrantProgramFromProject(arg0, arg1);
            return result;
        }
    }
    async updateBlockchain(arg0: string, arg1: Blockchain): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.updateBlockchain(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.updateBlockchain(arg0, arg1);
            return result;
        }
    }
    async updateClient(arg0: string, arg1: Client): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.updateClient(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.updateClient(arg0, arg1);
            return result;
        }
    }
    async updateGrantProgram(arg0: string, arg1: GrantProgram): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.updateGrantProgram(arg0, arg1);
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.updateGrantProgram(arg0, arg1);
            return result;
        }
    }
    async updateProject(arg0: string, arg1: Project): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.updateProject(arg0, to_candid_Project_n1(arg1));
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.updateProject(arg0, to_candid_Project_n1(arg1));
            return result;
        }
    }
    async updateProjectTeamAssignments(arg0: string, arg1: Array<TeamAssignment>): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.updateProjectTeamAssignments(arg0, to_candid_vec_n5(arg1));
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.updateProjectTeamAssignments(arg0, to_candid_vec_n5(arg1));
            return result;
        }
    }
    async updateProjectWorkflow(arg0: string, arg1: WorkflowState): Promise<void> {
        if (this.processError) {
            try {
                const result = await this.actor.updateProjectWorkflow(arg0, to_candid_WorkflowState_n3(arg1));
                return result;
            } catch (e) {
                this.processError(e);
                throw new Error("unreachable");
            }
        } else {
            const result = await this.actor.updateProjectWorkflow(arg0, to_candid_WorkflowState_n3(arg1));
            return result;
        }
    }
}
export const backend: backendInterface = new Backend();
function from_candid_Project_n14(value: _Project): Project {
    return from_candid_record_n15(value);
}
function from_candid_TeamAssignment_n19(value: _TeamAssignment): TeamAssignment {
    return from_candid_record_n20(value);
}
function from_candid_TeamRole_n21(value: _TeamRole): TeamRole {
    return from_candid_variant_n22(value);
}
function from_candid_UserRole_n25(value: _UserRole): UserRole {
    return from_candid_variant_n26(value);
}
function from_candid_WorkflowState_n16(value: _WorkflowState): WorkflowState {
    return from_candid_variant_n17(value);
}
function from_candid_opt_n23(value: [] | [_Blockchain]): Blockchain | null {
    return value.length === 0 ? null : value[0];
}
function from_candid_opt_n24(value: [] | [_UserProfile]): UserProfile | null {
    return value.length === 0 ? null : value[0];
}
function from_candid_opt_n27(value: [] | [_Client]): Client | null {
    return value.length === 0 ? null : value[0];
}
function from_candid_opt_n30(value: [] | [_GrantProgram]): GrantProgram | null {
    return value.length === 0 ? null : value[0];
}
function from_candid_opt_n31(value: [] | [_Project]): Project | null {
    return value.length === 0 ? null : from_candid_Project_n14(value[0]);
}
function from_candid_record_n15(value: {
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
    workflowState: _WorkflowState;
    discord: string;
    teamAssignments: Array<_TeamAssignment>;
    telegram: string;
    github: string;
    grantProgramIds: Array<string>;
}): {
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
} {
    return {
        clientId: value.clientId,
        googleDocLinks: value.googleDocLinks,
        projectType: value.projectType,
        twitter: value.twitter,
        blockchainId: value.blockchainId,
        pitchDeck: value.pitchDeck,
        documentation: value.documentation,
        name: value.name,
        description: value.description,
        videoDemo: value.videoDemo,
        documentPaths: value.documentPaths,
        website: value.website,
        logoPath: value.logoPath,
        workflowState: from_candid_WorkflowState_n16(value.workflowState),
        discord: value.discord,
        teamAssignments: from_candid_vec_n18(value.teamAssignments),
        telegram: value.telegram,
        github: value.github,
        grantProgramIds: value.grantProgramIds
    };
}
function from_candid_record_n20(value: {
    role: _TeamRole;
    memberName: string;
}): {
    role: TeamRole;
    memberName: string;
} {
    return {
        role: from_candid_TeamRole_n21(value.role),
        memberName: value.memberName
    };
}
function from_candid_tuple_n13(value: [string, _Project]): [string, Project] {
    return [
        value[0],
        from_candid_Project_n14(value[1])
    ];
}
function from_candid_variant_n17(value: {
    submitted: null;
} | {
    rejected: null;
} | {
    accepted: null;
} | {
    inProgress: null;
}): WorkflowState {
    return "submitted" in value ? WorkflowState.submitted : "rejected" in value ? WorkflowState.rejected : "accepted" in value ? WorkflowState.accepted : "inProgress" in value ? WorkflowState.inProgress : value;
}
function from_candid_variant_n22(value: {
    responsible: null;
} | {
    workingOn: null;
}): TeamRole {
    return "responsible" in value ? TeamRole.responsible : "workingOn" in value ? TeamRole.workingOn : value;
}
function from_candid_variant_n26(value: {
    admin: null;
} | {
    user: null;
} | {
    guest: null;
}): UserRole {
    return "admin" in value ? UserRole.admin : "user" in value ? UserRole.user : "guest" in value ? UserRole.guest : value;
}
function from_candid_variant_n32(value: {
    projectNotFound: null;
} | {
    invalidLink: null;
} | {
    success: _Project;
}): {
    __kind__: "projectNotFound";
    projectNotFound: null;
} | {
    __kind__: "invalidLink";
    invalidLink: null;
} | {
    __kind__: "success";
    success: Project;
} {
    return "projectNotFound" in value ? {
        __kind__: "projectNotFound",
        projectNotFound: value.projectNotFound
    } : "invalidLink" in value ? {
        __kind__: "invalidLink",
        invalidLink: value.invalidLink
    } : "success" in value ? {
        __kind__: "success",
        success: from_candid_Project_n14(value.success)
    } : value;
}
function from_candid_vec_n12(value: Array<[string, _Project]>): Array<[string, Project]> {
    return value.map((x)=>from_candid_tuple_n13(x));
}
function from_candid_vec_n18(value: Array<_TeamAssignment>): Array<TeamAssignment> {
    return value.map((x)=>from_candid_TeamAssignment_n19(x));
}
function to_candid_Project_n1(value: Project): _Project {
    return to_candid_record_n2(value);
}
function to_candid_TeamAssignment_n6(value: TeamAssignment): _TeamAssignment {
    return to_candid_record_n7(value);
}
function to_candid_TeamRole_n8(value: TeamRole): _TeamRole {
    return to_candid_variant_n9(value);
}
function to_candid_UserRole_n10(value: UserRole): _UserRole {
    return to_candid_variant_n11(value);
}
function to_candid_WorkflowState_n3(value: WorkflowState): _WorkflowState {
    return to_candid_variant_n4(value);
}
function to_candid_opt_n28(value: string | null): [] | [string] {
    return value === null ? candid_none() : candid_some(value);
}
function to_candid_opt_n29(value: WorkflowState | null): [] | [_WorkflowState] {
    return value === null ? candid_none() : candid_some(to_candid_WorkflowState_n3(value));
}
function to_candid_record_n2(value: {
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
}): {
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
    workflowState: _WorkflowState;
    discord: string;
    teamAssignments: Array<_TeamAssignment>;
    telegram: string;
    github: string;
    grantProgramIds: Array<string>;
} {
    return {
        clientId: value.clientId,
        googleDocLinks: value.googleDocLinks,
        projectType: value.projectType,
        twitter: value.twitter,
        blockchainId: value.blockchainId,
        pitchDeck: value.pitchDeck,
        documentation: value.documentation,
        name: value.name,
        description: value.description,
        videoDemo: value.videoDemo,
        documentPaths: value.documentPaths,
        website: value.website,
        logoPath: value.logoPath,
        workflowState: to_candid_WorkflowState_n3(value.workflowState),
        discord: value.discord,
        teamAssignments: to_candid_vec_n5(value.teamAssignments),
        telegram: value.telegram,
        github: value.github,
        grantProgramIds: value.grantProgramIds
    };
}
function to_candid_record_n7(value: {
    role: TeamRole;
    memberName: string;
}): {
    role: _TeamRole;
    memberName: string;
} {
    return {
        role: to_candid_TeamRole_n8(value.role),
        memberName: value.memberName
    };
}
function to_candid_variant_n11(value: UserRole): {
    admin: null;
} | {
    user: null;
} | {
    guest: null;
} {
    return value == UserRole.admin ? {
        admin: null
    } : value == UserRole.user ? {
        user: null
    } : value == UserRole.guest ? {
        guest: null
    } : value;
}
function to_candid_variant_n4(value: WorkflowState): {
    submitted: null;
} | {
    rejected: null;
} | {
    accepted: null;
} | {
    inProgress: null;
} {
    return value == WorkflowState.submitted ? {
        submitted: null
    } : value == WorkflowState.rejected ? {
        rejected: null
    } : value == WorkflowState.accepted ? {
        accepted: null
    } : value == WorkflowState.inProgress ? {
        inProgress: null
    } : value;
}
function to_candid_variant_n9(value: TeamRole): {
    responsible: null;
} | {
    workingOn: null;
} {
    return value == TeamRole.responsible ? {
        responsible: null
    } : value == TeamRole.workingOn ? {
        workingOn: null
    } : value;
}
function to_candid_vec_n5(value: Array<TeamAssignment>): Array<_TeamAssignment> {
    return value.map((x)=>to_candid_TeamAssignment_n6(x));
}

