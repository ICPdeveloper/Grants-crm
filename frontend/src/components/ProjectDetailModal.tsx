import React, { useState } from 'react';
import { useGetAllBlockchains, useGetAllClients, useGetAllGrantPrograms, useLinkGrantProgramToProject, useUnlinkGrantProgramFromProject, useGenerateShareableLink } from '../hooks/useQueries';
import { useFileUrl } from '../blob-storage/FileStorage';
import { Project, TeamRole } from '../backend';
import { 
  X, 
  Building2, 
  User, 
  Tag, 
  ExternalLink, 
  Github, 
  MessageCircle, 
  Play, 
  FileText, 
  Award, 
  Link, 
  Unlink, 
  Share, 
  Copy, 
  Check, 
  Users, 
  Crown,
  Globe,
  BookOpen,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingSpinner from './LoadingSpinner';

interface ProjectDetailModalProps {
  project: Project;
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDetailModal({ project, projectId, isOpen, onClose }: ProjectDetailModalProps) {
  const { data: blockchains = [] } = useGetAllBlockchains();
  const { data: clients = [] } = useGetAllClients();
  const { data: allGrantPrograms = [] } = useGetAllGrantPrograms();
  const linkGrantProgram = useLinkGrantProgramToProject();
  const unlinkGrantProgram = useUnlinkGrantProgramFromProject();
  const generateShareableLink = useGenerateShareableLink();
  
  // Get image URLs
  const { data: projectLogoUrl } = useFileUrl(project.logoPath || '');
  const { data: clientLogoUrl } = useFileUrl(clients.find(([id]) => id === project.clientId)?.[1]?.logoPath || '');
  const { data: blockchainLogoUrl } = useFileUrl(blockchains.find(([id]) => id === project.blockchainId)?.[1]?.logoPath || '');

  const [linkingGrantProgram, setLinkingGrantProgram] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  const blockchainsMap = new Map(blockchains);
  const clientsMap = new Map(clients);
  const grantProgramsMap = new Map(allGrantPrograms);

  const blockchain = blockchainsMap.get(project.blockchainId);
  const client = clientsMap.get(project.clientId);
  const projectGrantPrograms = project.grantProgramIds.map(grantId => 
    [grantId, grantProgramsMap.get(grantId)]
  ).filter(([_, grant]) => grant) as [string, any][];

  const responsibleMembers = project.teamAssignments.filter(a => a.role === TeamRole.responsible);
  const workingOnMembers = project.teamAssignments.filter(a => a.role === TeamRole.workingOn);

  const getWorkflowStateColor = (state: string) => {
    switch (state) {
      case 'inProgress': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const handleLinkGrantProgram = (grantProgramId: string) => {
    linkGrantProgram.mutate({ projectId, grantProgramId });
    setLinkingGrantProgram(false);
  };

  const handleUnlinkGrantProgram = (grantProgramId: string) => {
    unlinkGrantProgram.mutate({ projectId, grantProgramId });
  };

  const handleGenerateLink = async () => {
    try {
      const linkId = await generateShareableLink.mutateAsync(projectId);
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

  const availableGrantPrograms = allGrantPrograms
    .filter(([grantId, grant]) => 
      grant.blockchainId === project.blockchainId && 
      !project.grantProgramIds.includes(grantId)
    );

  const socialLinks = [
    { url: project.website, icon: Globe, label: 'Website' },
    { url: project.documentation, icon: BookOpen, label: 'Documentation' },
    { url: project.github, icon: Github, label: 'GitHub' },
    { url: project.twitter, icon: ExternalLink, label: 'Twitter' },
    { url: project.discord, icon: MessageCircle, label: 'Discord' },
    { url: project.telegram, icon: MessageCircle, label: 'Telegram' },
    { url: project.videoDemo, icon: Play, label: 'Demo Video' },
    { url: project.pitchDeck, icon: FileText, label: 'Pitch Deck' },
  ].filter(link => link.url);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {projectLogoUrl ? (
                  <img
                    src={projectLogoUrl}
                    alt={`${project.name} logo`}
                    className="w-16 h-16 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-gray-900 mb-3">
                  {project.name}
                </DialogTitle>
                <p className="text-gray-600 text-lg mb-4 leading-relaxed">{project.description}</p>
                <div className="flex items-center space-x-3">
                  <Badge className={`px-3 py-1 font-medium border ${getWorkflowStateColor(project.workflowState)}`}>
                    {getWorkflowStateLabel(project.workflowState)}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    <Tag className="h-3 w-3 mr-1" />
                    {project.projectType}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleGenerateLink}
                variant="outline"
                size="sm"
                disabled={generateShareableLink.isPending}
              >
                {generateShareableLink.isPending ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Share className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="grants">Grant Programs</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="links">Links & Media</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span>Project Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {blockchainLogoUrl ? (
                        <img
                          src={blockchainLogoUrl}
                          alt={`${blockchain?.name} logo`}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Blockchain</p>
                      <p className="font-semibold text-gray-900">{blockchain?.name || 'Unknown Blockchain'}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {clientLogoUrl ? (
                        <img
                          src={clientLogoUrl}
                          alt={`${client?.name} logo`}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <User className="h-6 w-6 text-green-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Client</p>
                      <p className="font-semibold text-gray-900">{client?.name || 'Unknown Client'}</p>
                      {client?.company && (
                        <p className="text-sm text-gray-500">{client.company}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client Information */}
              {client && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-green-600" />
                      <span>Client Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{client.contactInfo}</span>
                    </div>
                    {client.website && (
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <a
                          href={client.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          {client.website}
                        </a>
                      </div>
                    )}
                    {client.linkedin && (
                      <div className="flex items-center space-x-2">
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                        <a
                          href={client.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Internal Altemis Support Team</span>
                </CardTitle>
                <CardDescription>
                  Internal team members assigned to support this grant application
                </CardDescription>
              </CardHeader>
              <CardContent>
                {project.teamAssignments.length > 0 ? (
                  <div className="space-y-6">
                    {/* Responsible Members */}
                    {responsibleMembers.length > 0 && (
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <Crown className="h-5 w-5 mr-2 text-amber-500" />
                          Project Lead
                        </h4>
                        <div className="space-y-3">
                          {responsibleMembers.map((assignment, index) => (
                            <div key={`responsible-${index}`} className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-5">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                                  <Crown className="h-6 w-6 text-amber-600" />
                                </div>
                                <div>
                                  <p className="text-lg font-bold text-amber-900">{assignment.memberName}</p>
                                  <p className="text-sm text-amber-700 font-medium">Responsible for project oversight and coordination</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Working On Members */}
                    {workingOnMembers.length > 0 && (
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <Users className="h-5 w-5 mr-2 text-blue-500" />
                          Supporting Team Members
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {workingOnMembers.map((assignment, index) => (
                            <div key={`working-${index}`} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-blue-900">{assignment.memberName}</p>
                                  <p className="text-sm text-blue-600">Supporting team member</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No team members assigned yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-green-600" />
                    <span>Associated Grant Programs</span>
                  </div>
                  {availableGrantPrograms.length > 0 && (
                    <Button
                      onClick={() => setLinkingGrantProgram(true)}
                      variant="outline"
                      size="sm"
                    >
                      <Link className="h-4 w-4 mr-2" />
                      Link Program
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {linkingGrantProgram && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">
                      Select Grant Program to Link
                    </Label>
                    <div className="flex space-x-2">
                      <Select
                        onValueChange={(value) => {
                          if (value) {
                            handleLinkGrantProgram(value);
                          }
                        }}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Choose a grant program" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableGrantPrograms.map(([grantId, grant]) => (
                            <SelectItem key={grantId} value={grantId}>
                              {grant.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => setLinkingGrantProgram(false)}
                        variant="outline"
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {projectGrantPrograms.length > 0 ? (
                  <div className="space-y-4">
                    {projectGrantPrograms.map(([grantId, grant]) => (
                      <div key={grantId} className="bg-green-50 border border-green-200 rounded-xl p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <Award className="h-5 w-5 text-green-600" />
                              </div>
                              <h4 className="text-lg font-bold text-green-900">{grant.name}</h4>
                            </div>
                            <p className="text-sm text-green-700 mb-4 leading-relaxed">{grant.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {grant.grantAmount && (
                                <Badge variant="outline" className="text-green-700 border-green-300 bg-green-100">
                                  <DollarSign className="h-3 w-3 mr-1" />
                                  {grant.grantAmount}
                                </Badge>
                              )}
                              {grant.deadline && (
                                <Badge variant="outline" className="text-green-700 border-green-300 bg-green-100">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {grant.deadline}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            onClick={() => handleUnlinkGrantProgram(grantId)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Unlink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No grant programs linked yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Project Documents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(project.documentPaths.length > 0 || project.googleDocLinks.length > 0) ? (
                  <div className="space-y-6">
                    {/* Uploaded Files */}
                    {project.documentPaths.length > 0 && (
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4">Uploaded Files</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {project.documentPaths.map((path, index) => (
                            <DocumentItem key={path} path={path} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Google Doc Links */}
                    {project.googleDocLinks.length > 0 && (
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4">Google Documents</h4>
                        <div className="space-y-3">
                          {project.googleDocLinks.map((link, index) => (
                            <div key={index} className="flex items-center justify-between bg-green-50 border border-green-200 px-4 py-4 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <ExternalLink className="h-5 w-5 text-green-600" />
                                <div>
                                  <p className="text-sm font-semibold text-green-900">
                                    {link.includes('sheets.google.com') ? 'Google Sheets' : 
                                     link.includes('docs.google.com') ? 'Google Docs' : 'Google Drive'}
                                  </p>
                                  <p className="text-xs text-green-600 truncate max-w-xs">{link}</p>
                                </div>
                              </div>
                              <Button
                                onClick={() => window.open(link, '_blank')}
                                variant="ghost"
                                size="sm"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No documents uploaded yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="links" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span>Links & Media</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {socialLinks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {socialLinks.map((link, index) => {
                      const Icon = link.icon;
                      return (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                        >
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <Icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{link.label}</p>
                            <p className="text-xs text-gray-500 truncate max-w-32">
                              {link.url.replace(/^https?:\/\//, '')}
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Globe className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No links or media added yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Share Project Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Share className="h-5 w-5 text-purple-600" />
                  <span>Share Project</span>
                </CardTitle>
                <CardDescription>
                  Generate a secure link to share this project with collaborators
                </CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Helper component for document items
function DocumentItem({ path }: { path: string }) {
  const { data: fileUrl } = useFileUrl(path);

  const getFileName = (path: string) => {
    const parts = path.split('/');
    const fileName = parts[parts.length - 1];
    return fileName.replace(/^\d+-/, '');
  };

  const getFileExtension = (fileName: string) => {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
  };

  const fileName = getFileName(path);
  const fileExtension = getFileExtension(fileName);

  return (
    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-3 rounded-lg">
      <div className="flex items-center space-x-3">
        <FileText className="h-4 w-4 text-blue-600" />
        <div>
          <p className="text-sm font-medium text-blue-900 truncate max-w-32">{fileName}</p>
          <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
            {fileExtension}
          </Badge>
        </div>
      </div>
      {fileUrl && (
        <Button
          onClick={() => window.open(fileUrl, '_blank')}
          variant="ghost"
          size="sm"
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
