import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Time "mo:base/Time";
import Random "mo:base/Random";
import Blob "mo:base/Blob";
import Nat8 "mo:base/Nat8";

import InviteLinksModule "invite-links/invite-links-module";
import Registry "blob-storage/registry";

persistent actor {
    // Initialize the user system state
    let accessControlState = AccessControl.initState();

    // Initialize auth (first caller becomes admin, others become users)
    public shared ({ caller }) func initializeAccessControl() : async () {
        AccessControl.initialize(accessControlState, caller);
    };

    public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
        AccessControl.getUserRole(accessControlState, caller);
    };

    public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
        AccessControl.assignRole(accessControlState, caller, user, role);
    };

    public query ({ caller }) func isCallerAdmin() : async Bool {
        AccessControl.isAdmin(accessControlState, caller);
    };

    public type UserProfile = {
        name : Text;
        // Other user metadata if needed
    };

    transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
    var userProfiles = principalMap.empty<UserProfile>();

    public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
        principalMap.get(userProfiles, caller);
    };

    public query func getUserProfile(user : Principal) : async ?UserProfile {
        principalMap.get(userProfiles, user);
    };

    public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
        userProfiles := principalMap.put(userProfiles, caller, profile);
    };

    // Blockchain Management
    public type Blockchain = {
        name : Text;
        description : Text;
        twitter : Text;
        discord : Text;
        telegram : Text;
        website : Text;
        documentation : Text;
        github : Text;
        logoPath : Text;
    };

    transient let textMap = OrderedMap.Make<Text>(Text.compare);
    var blockchains = textMap.empty<Blockchain>();

    public shared ({ caller }) func addBlockchain(id : Text, blockchain : Blockchain) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can add blockchains");
        };
        blockchains := textMap.put(blockchains, id, blockchain);
    };

    public shared ({ caller }) func updateBlockchain(id : Text, updatedBlockchain : Blockchain) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can update blockchains");
        };
        switch (textMap.get(blockchains, id)) {
            case (null) { Debug.trap("Blockchain not found") };
            case (?_) {
                blockchains := textMap.put(blockchains, id, updatedBlockchain);
            };
        };
    };

    public shared ({ caller }) func deleteBlockchain(id : Text) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can delete blockchains");
        };
        switch (textMap.get(blockchains, id)) {
            case (null) { Debug.trap("Blockchain not found") };
            case (?_) {
                blockchains := textMap.delete(blockchains, id);
            };
        };
    };

    public query func getBlockchain(id : Text) : async ?Blockchain {
        textMap.get(blockchains, id);
    };

    public query func getAllBlockchains() : async [(Text, Blockchain)] {
        Iter.toArray(textMap.entries(blockchains));
    };

    // Project Management
    public type Project = {
        name : Text;
        description : Text;
        projectType : Text;
        blockchainId : Text;
        clientId : Text;
        workflowState : WorkflowState;
        twitter : Text;
        discord : Text;
        telegram : Text;
        github : Text;
        videoDemo : Text;
        pitchDeck : Text;
        website : Text;
        documentation : Text;
        grantProgramIds : [Text];
        teamAssignments : [TeamAssignment];
        logoPath : Text;
        documentPaths : [Text];
        googleDocLinks : [Text];
    };

    public type WorkflowState = {
        #inProgress;
        #submitted;
        #accepted;
        #rejected;
    };

    public type TeamAssignment = {
        memberName : Text;
        role : TeamRole;
    };

    public type TeamRole = {
        #responsible;
        #workingOn;
    };

    var projects = textMap.empty<Project>();

    public shared ({ caller }) func addProject(id : Text, project : Project) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can add projects");
        };
        projects := textMap.put(projects, id, project);
    };

    public shared ({ caller }) func updateProject(id : Text, updatedProject : Project) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can update projects");
        };
        switch (textMap.get(projects, id)) {
            case (null) { Debug.trap("Project not found") };
            case (?_) {
                projects := textMap.put(projects, id, updatedProject);
            };
        };
    };

    public shared ({ caller }) func deleteProject(id : Text) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can delete projects");
        };
        switch (textMap.get(projects, id)) {
            case (null) { Debug.trap("Project not found") };
            case (?_) {
                projects := textMap.delete(projects, id);
            };
        };
    };

    public query func getProject(id : Text) : async ?Project {
        textMap.get(projects, id);
    };

    public query func getAllProjects() : async [(Text, Project)] {
        Iter.toArray(textMap.entries(projects));
    };

    public shared ({ caller }) func updateProjectWorkflow(id : Text, newState : WorkflowState) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can update project workflow");
        };
        switch (textMap.get(projects, id)) {
            case (null) { Debug.trap("Project not found") };
            case (?project) {
                let updatedProject = {
                    name = project.name;
                    description = project.description;
                    projectType = project.projectType;
                    blockchainId = project.blockchainId;
                    clientId = project.clientId;
                    workflowState = newState;
                    twitter = project.twitter;
                    discord = project.discord;
                    telegram = project.telegram;
                    github = project.github;
                    videoDemo = project.videoDemo;
                    pitchDeck = project.pitchDeck;
                    website = project.website;
                    documentation = project.documentation;
                    grantProgramIds = project.grantProgramIds;
                    teamAssignments = project.teamAssignments;
                    logoPath = project.logoPath;
                    documentPaths = project.documentPaths;
                    googleDocLinks = project.googleDocLinks;
                };
                projects := textMap.put(projects, id, updatedProject);
            };
        };
    };

    public shared ({ caller }) func updateProjectTeamAssignments(id : Text, teamAssignments : [TeamAssignment]) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can update team assignments");
        };
        switch (textMap.get(projects, id)) {
            case (null) { Debug.trap("Project not found") };
            case (?project) {
                let updatedProject = {
                    name = project.name;
                    description = project.description;
                    projectType = project.projectType;
                    blockchainId = project.blockchainId;
                    clientId = project.clientId;
                    workflowState = project.workflowState;
                    twitter = project.twitter;
                    discord = project.discord;
                    telegram = project.telegram;
                    github = project.github;
                    videoDemo = project.videoDemo;
                    pitchDeck = project.pitchDeck;
                    website = project.website;
                    documentation = project.documentation;
                    grantProgramIds = project.grantProgramIds;
                    teamAssignments = teamAssignments;
                    logoPath = project.logoPath;
                    documentPaths = project.documentPaths;
                    googleDocLinks = project.googleDocLinks;
                };
                projects := textMap.put(projects, id, updatedProject);
            };
        };
    };

    public query func getProjectTeamAssignments(id : Text) : async [TeamAssignment] {
        switch (textMap.get(projects, id)) {
            case (null) { [] };
            case (?project) { project.teamAssignments };
        };
    };

    // Client Management
    public type Client = {
        name : Text;
        contactInfo : Text;
        company : Text;
        twitter : Text;
        linkedin : Text;
        website : Text;
        logoPath : Text;
    };

    var clients = textMap.empty<Client>();

    public shared ({ caller }) func addClient(id : Text, client : Client) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can add clients");
        };
        clients := textMap.put(clients, id, client);
    };

    public shared ({ caller }) func updateClient(id : Text, updatedClient : Client) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can update clients");
        };
        switch (textMap.get(clients, id)) {
            case (null) { Debug.trap("Client not found") };
            case (?_) {
                clients := textMap.put(clients, id, updatedClient);
            };
        };
    };

    public shared ({ caller }) func deleteClient(id : Text) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can delete clients");
        };
        switch (textMap.get(clients, id)) {
            case (null) { Debug.trap("Client not found") };
            case (?_) {
                clients := textMap.delete(clients, id);
            };
        };
    };

    public query func getClient(id : Text) : async ?Client {
        textMap.get(clients, id);
    };

    public query func getAllClients() : async [(Text, Client)] {
        Iter.toArray(textMap.entries(clients));
    };

    // Grant Program Management
    public type GrantProgram = {
        name : Text;
        description : Text;
        blockchainId : Text;
        grantAmount : Text;
        processDetails : Text;
        eligibilityCriteria : Text;
        deadline : Text;
        contactInfo : Text;
        applicationRequirements : Text;
    };

    var grantPrograms = textMap.empty<GrantProgram>();

    public shared ({ caller }) func addGrantProgram(id : Text, grantProgram : GrantProgram) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can add grant programs");
        };
        grantPrograms := textMap.put(grantPrograms, id, grantProgram);
    };

    public shared ({ caller }) func updateGrantProgram(id : Text, updatedGrantProgram : GrantProgram) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can update grant programs");
        };
        switch (textMap.get(grantPrograms, id)) {
            case (null) { Debug.trap("Grant program not found") };
            case (?_) {
                grantPrograms := textMap.put(grantPrograms, id, updatedGrantProgram);
            };
        };
    };

    public shared ({ caller }) func deleteGrantProgram(id : Text) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can delete grant programs");
        };
        switch (textMap.get(grantPrograms, id)) {
            case (null) { Debug.trap("Grant program not found") };
            case (?_) {
                grantPrograms := textMap.delete(grantPrograms, id);
            };
        };
    };

    public query func getGrantProgram(id : Text) : async ?GrantProgram {
        textMap.get(grantPrograms, id);
    };

    public query func getAllGrantPrograms() : async [(Text, GrantProgram)] {
        Iter.toArray(textMap.entries(grantPrograms));
    };

    public query func getGrantProgramsByBlockchain(blockchainId : Text) : async [(Text, GrantProgram)] {
        let filteredGrantPrograms = Iter.filter<(Text, GrantProgram)>(
            textMap.entries(grantPrograms),
            func((id, grantProgram)) {
                grantProgram.blockchainId == blockchainId;
            },
        );
        Iter.toArray(filteredGrantPrograms);
    };

    // Project Filtering
    public query func getFilteredProjects(projectType : ?Text, blockchainId : ?Text, clientId : ?Text, workflowState : ?WorkflowState, teamMember : ?Text) : async [(Text, Project)] {
        let filteredProjects = Iter.filter<(Text, Project)>(
            textMap.entries(projects),
            func((id, project)) {
                let typeMatch = switch (projectType) {
                    case (null) { true };
                    case (?t) { project.projectType == t };
                };
                let blockchainMatch = switch (blockchainId) {
                    case (null) { true };
                    case (?b) { project.blockchainId == b };
                };
                let clientMatch = switch (clientId) {
                    case (null) { true };
                    case (?c) { project.clientId == c };
                };
                let workflowMatch = switch (workflowState) {
                    case (null) { true };
                    case (?w) { project.workflowState == w };
                };
                let teamMatch = switch (teamMember) {
                    case (null) { true };
                    case (?member) {
                        List.some<TeamAssignment>(
                            List.fromArray(project.teamAssignments),
                            func(assignment) { assignment.memberName == member },
                        );
                    };
                };
                typeMatch and blockchainMatch and clientMatch and workflowMatch and teamMatch;
            },
        );
        Iter.toArray(filteredProjects);
    };

    // Grant Program Integration
    public shared ({ caller }) func linkGrantProgramToProject(projectId : Text, grantProgramId : Text) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can link grant programs to projects");
        };
        switch (textMap.get(projects, projectId)) {
            case (null) { Debug.trap("Project not found") };
            case (?project) {
                let updatedGrantProgramIds = List.toArray(List.push(grantProgramId, List.fromArray(project.grantProgramIds)));
                let updatedProject = {
                    name = project.name;
                    description = project.description;
                    projectType = project.projectType;
                    blockchainId = project.blockchainId;
                    clientId = project.clientId;
                    workflowState = project.workflowState;
                    twitter = project.twitter;
                    discord = project.discord;
                    telegram = project.telegram;
                    github = project.github;
                    videoDemo = project.videoDemo;
                    pitchDeck = project.pitchDeck;
                    website = project.website;
                    documentation = project.documentation;
                    grantProgramIds = updatedGrantProgramIds;
                    teamAssignments = project.teamAssignments;
                    logoPath = project.logoPath;
                    documentPaths = project.documentPaths;
                    googleDocLinks = project.googleDocLinks;
                };
                projects := textMap.put(projects, projectId, updatedProject);
            };
        };
    };

    public shared ({ caller }) func unlinkGrantProgramFromProject(projectId : Text, grantProgramId : Text) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can unlink grant programs from projects");
        };
        switch (textMap.get(projects, projectId)) {
            case (null) { Debug.trap("Project not found") };
            case (?project) {
                let filteredGrantProgramIds = List.toArray(
                    List.filter<Text>(
                        List.fromArray(project.grantProgramIds),
                        func(id) { id != grantProgramId },
                    )
                );
                let updatedProject = {
                    name = project.name;
                    description = project.description;
                    projectType = project.projectType;
                    blockchainId = project.blockchainId;
                    clientId = project.clientId;
                    workflowState = project.workflowState;
                    twitter = project.twitter;
                    discord = project.discord;
                    telegram = project.telegram;
                    github = project.github;
                    videoDemo = project.videoDemo;
                    pitchDeck = project.pitchDeck;
                    website = project.website;
                    documentation = project.documentation;
                    grantProgramIds = filteredGrantProgramIds;
                    teamAssignments = project.teamAssignments;
                    logoPath = project.logoPath;
                    documentPaths = project.documentPaths;
                    googleDocLinks = project.googleDocLinks;
                };
                projects := textMap.put(projects, projectId, updatedProject);
            };
        };
    };

    public query func getProjectsByGrantProgram(grantProgramId : Text) : async [(Text, Project)] {
        let filteredProjects = Iter.filter<(Text, Project)>(
            textMap.entries(projects),
            func((id, project)) {
                List.some<Text>(
                    List.fromArray(project.grantProgramIds),
                    func(id) { id == grantProgramId },
                );
            },
        );
        Iter.toArray(filteredProjects);
    };

    public query func getClientsByGrantProgram(grantProgramId : Text) : async [(Text, Client)] {
        let projectEntries = Iter.filter<(Text, Project)>(
            textMap.entries(projects),
            func((id, project)) {
                List.some<Text>(
                    List.fromArray(project.grantProgramIds),
                    func(id) { id == grantProgramId },
                );
            },
        );

        var clientList = List.nil<(Text, Client)>();
        for ((_, project) in projectEntries) {
            switch (textMap.get(clients, project.clientId)) {
                case (null) {};
                case (?client) {
                    clientList := List.push((project.clientId, client), clientList);
                };
            };
        };
        List.toArray(clientList);
    };

    // Shareable Project Links
    public type ShareableLink = {
        projectId : Text;
        createdAt : Time.Time;
    };

    var shareableLinks = textMap.empty<ShareableLink>();

    public shared ({ caller }) func generateShareableLink(projectId : Text) : async Text {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can generate shareable links");
        };
        switch (textMap.get(projects, projectId)) {
            case (null) { Debug.trap("Project not found") };
            case (?_) {
                let random = await Random.blob();
                let randomBytes = Blob.toArray(random);
                let randomText = Nat8.toText(randomBytes[0]);
                let linkId = Text.concat(projectId, randomText);
                let shareableLink = {
                    projectId = projectId;
                    createdAt = Time.now();
                };
                shareableLinks := textMap.put(shareableLinks, linkId, shareableLink);
                linkId;
            };
        };
    };

    public query func resolveSharedProjectLink(linkId : Text) : async {
        #success : Project;
        #invalidLink;
        #projectNotFound;
    } {
        switch (textMap.get(shareableLinks, linkId)) {
            case (null) { #invalidLink };
            case (?shareableLink) {
                switch (textMap.get(projects, shareableLink.projectId)) {
                    case (null) { #projectNotFound };
                    case (?project) { #success(project) };
                };
            };
        };
    };

    public shared ({ caller }) func deleteShareableLink(linkId : Text) : async () {
        if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
            Debug.trap("Unauthorized: Only users can delete shareable links");
        };
        switch (textMap.get(shareableLinks, linkId)) {
            case (null) { Debug.trap("Shareable link not found") };
            case (?_) {
                shareableLinks := textMap.delete(shareableLinks, linkId);
            };
        };
    };

    public query func getAllShareableLinks() : async [(Text, ShareableLink)] {
        Iter.toArray(textMap.entries(shareableLinks));
    };

    // Invite Links System
    let inviteState = InviteLinksModule.initState();

    public shared ({ caller }) func generateInviteCode() : async Text {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can generate invite codes");
        };
        let blob = await Random.blob();
        let code = InviteLinksModule.generateUUID(blob);
        InviteLinksModule.generateInviteCode(inviteState, code);
        code;
    };

    public func submitRSVP(name : Text, attending : Bool, inviteCode : Text) : async () {
        InviteLinksModule.submitRSVP(inviteState, name, attending, inviteCode);
    };

    public query ({ caller }) func getAllRSVPs() : async [InviteLinksModule.RSVP] {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can view RSVPs");
        };
        InviteLinksModule.getAllRSVPs(inviteState);
    };

    public query ({ caller }) func getInviteCodes() : async [InviteLinksModule.InviteCode] {
        if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
            Debug.trap("Unauthorized: Only admins can view invite codes");
        };
        InviteLinksModule.getInviteCodes(inviteState);
    };

    // File Reference Registry
    let registry = Registry.new();

    public shared ({ caller }) func registerFileReference(path : Text, hash : Text) : async () {
        Registry.add(registry, path, hash);
    };

    public query ({ caller }) func getFileReference(path : Text) : async Registry.FileReference {
        Registry.get(registry, path);
    };

    public query ({ caller }) func listFileReferences() : async [Registry.FileReference] {
        Registry.list(registry);
    };

    public shared ({ caller }) func dropFileReference(path : Text) : async () {
        Registry.remove(registry, path);
    };
};
