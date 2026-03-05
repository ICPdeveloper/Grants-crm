import React, { useEffect } from 'react';
import { useResolveSharedProjectLink, useGetAllBlockchains, useGetAllClients, useGetAllGrantPrograms } from '../hooks/useQueries';
import { useFileUrl } from '../blob-storage/FileStorage';
import { Building2, User, Tag, ExternalLink, Github, MessageCircle, Play, FileText, Award, FolderOpen, AlertTriangle, RefreshCw, Users, Crown, Globe, BookOpen } from 'lucide-react';
import { TeamRole } from '../backend';
import LoadingSpinner from '../components/LoadingSpinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface SharedProjectProps {
  linkId: string;
}

export default function SharedProject({ linkId }: SharedProjectProps) {
  const { data: linkResult, isLoading, error, refetch } = useResolveSharedProjectLink(linkId || '');
  const { data: blockchains = [] } = useGetAllBlockchains();
  const { data: clients = [] } = useGetAllClients();
  const { data: grantPrograms = [] } = useGetAllGrantPrograms();

  const project = linkResult?.project;
  const linkError = linkResult?.error;

  const blockchainsMap = new Map(blockchains);
  const clientsMap = new Map(clients);
  const grantProgramsMap = new Map(grantPrograms);

  // Get image URLs
  const { data: projectLogoUrl } = useFileUrl(project?.logoPath || '');
  const { data: clientLogoUrl } = useFileUrl(clientsMap.get(project?.clientId || '')?.logoPath || '');
  const { data: blockchainLogoUrl } = useFileUrl(blockchainsMap.get(project?.blockchainId || '')?.logoPath || '');

  const getWorkflowStateColor = (state: string) => {
    switch (state) {
      case 'inProgress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'submitted': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
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

  const getRoleLabel = (role: TeamRole) => {
    switch (role) {
      case TeamRole.responsible: return 'Responsible';
      case TeamRole.workingOn: return 'Working On';
      default: return role;
    }
  };

  const getErrorMessage = (errorType: string) => {
    switch (errorType) {
      case 'invalidLink':
        return {
          title: 'Invalid Link',
          message: 'The shared project link is invalid or has expired.',
          suggestion: 'Please check the link and try again, or contact the person who shared it with you.'
        };
      case 'projectNotFound':
        return {
          title: 'Project Not Found',
          message: 'The project associated with this link no longer exists.',
          suggestion: 'The project may have been deleted. Please contact the person who shared this link.'
        };
      default:
        return {
          title: 'Link Not Found',
          message: 'The shared project link could not be found.',
          suggestion: 'Please check the link or contact the person who shared it with you.'
        };
    }
  };

  useEffect(() => {
    if (project) {
      document.title = `${project.name} - Shared Project`;
    } else {
      document.title = 'Shared Project - Altemis CRM';
    }
  }, [project]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <LoadingSpinner size="lg" text="Loading shared project..." className="py-12" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h1>
            <p className="text-gray-600 mb-4">
              Unable to load the shared project due to a connection error.
            </p>
            <div className="space-y-2">
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <p className="text-sm text-gray-500">
                If the problem persists, please check your internet connection.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (linkError || !project) {
    const errorInfo = getErrorMessage(linkError || 'default');
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center space-x-3 mb-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Altemis CRM</h1>
            </div>
            <p className="text-gray-600">Shared Project View</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center py-12">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{errorInfo.title}</h1>
            <p className="text-gray-600 mb-4">{errorInfo.message}</p>
            
            <Alert className="max-w-md mx-auto mb-6">
              <AlertDescription>
                <strong>Suggestion:</strong> {errorInfo.suggestion}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <div className="text-sm text-gray-500">
                <p>Having trouble? Contact the person who shared this link.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            © 2025. Built with <span className="text-red-500">♥</span> using{' '}
            <a href="https://caffeine.ai" className="text-blue-600 hover:text-blue-700 transition-colors">
              caffeine.ai
            </a>
          </div>
        </div>
      </div>
    );
  }

  const blockchain = blockchainsMap.get(project.blockchainId);
  const client = clientsMap.get(project.clientId);
  const projectGrantPrograms = project.grantProgramIds.map(grantId => 
    [grantId, grantProgramsMap.get(grantId)]
  ).filter(([_, grant]) => grant) as [string, any][];

  const responsibleMembers = project.teamAssignments.filter(a => a.role === TeamRole.responsible);
  const workingOnMembers = project.teamAssignments.filter(a => a.role === TeamRole.workingOn);

  const socialLinks = [
    { url: project.website, icon: Globe, label: 'Website' },
    { url: project.documentation, icon: BookOpen, label: 'Documentation' },
    { url: project.github, icon: Github, label: 'GitHub' },
    { url: project.twitter, icon: ExternalLink, label: 'Twitter' },
    { url: project.discord, icon: MessageCircle, label: 'Discord' },
    { url: project.telegram, icon: MessageCircle, label: 'Telegram' },
    { url: project.videoDemo, icon: Play, label: 'Video Demo' },
    { url: project.pitchDeck, icon: FileText, label: 'Pitch Deck' },
  ].filter(link => link.url);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Building2 className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Altemis CRM</h1>
              </div>
              <p className="text-gray-600">Shared Project View</p>
            </div>
            <div className="text-sm text-gray-500">
              <p>Read-only access</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <Card className="shadow-sm border-0 mb-8">
          <CardContent className="p-8">
            <div className="flex items-start space-x-6 mb-8">
              <div className="flex-shrink-0">
                {projectLogoUrl ? (
                  <img
                    src={projectLogoUrl}
                    alt={`${project.name} logo`}
                    className="w-20 h-20 object-cover rounded-xl border-2 border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                    <FolderOpen className="h-10 w-10 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      {project.name}
                    </h2>
                    <p className="text-lg text-gray-600 mb-4 leading-relaxed">{project.description}</p>
                  </div>
                  <Badge className={`px-4 py-2 font-medium border text-sm ${getWorkflowStateColor(project.workflowState)}`}>
                    {getWorkflowStateLabel(project.workflowState)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Tag className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Project Type</p>
                      <p className="font-semibold text-gray-900">{project.projectType}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Internal Team Assignments */}
            {project.teamAssignments.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Users className="h-6 w-6 mr-3 text-purple-600" />
                  Internal Altemis Support Team
                </h3>
                <div className="space-y-4">
                  {/* Responsible Members - Highlighted */}
                  {responsibleMembers.map((assignment, index) => (
                    <div key={`responsible-${index}`} className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                          <Crown className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-amber-900">{assignment.memberName}</p>
                          <p className="text-sm text-amber-700 font-medium">Project Lead - Responsible for oversight</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Working On Members - Regular styling */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workingOnMembers.map((assignment, index) => (
                      <div key={`working-${index}`} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-blue-900">{assignment.memberName}</p>
                            <p className="text-sm text-blue-600">Supporting Team Member</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Project Links */}
            {socialLinks.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Project Links & Resources</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {socialLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group border border-gray-200"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{link.label}</p>
                          <p className="text-xs text-gray-500 truncate">
                            {link.url.replace(/^https?:\/\//, '')}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Grant Programs */}
            {projectGrantPrograms.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Associated Grant Programs ({projectGrantPrograms.length})
                </h3>
                <div className="space-y-4">
                  {projectGrantPrograms.map(([grantId, grant]) => (
                    <div key={grantId} className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Award className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-green-900 mb-2">{grant.name}</h4>
                          <p className="text-sm text-green-700 mb-4 leading-relaxed">{grant.description}</p>
                          <div className="flex flex-wrap gap-3">
                            {grant.grantAmount && (
                              <Badge variant="outline" className="text-green-700 border-green-300 bg-green-100">
                                Amount: {grant.grantAmount}
                              </Badge>
                            )}
                            {grant.deadline && (
                              <Badge variant="outline" className="text-green-700 border-green-300 bg-green-100">
                                Deadline: {grant.deadline}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            {(project.documentPaths.length > 0 || project.googleDocLinks.length > 0) && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Project Documents</h3>
                <div className="space-y-4">
                  {/* Uploaded Files */}
                  {project.documentPaths.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Uploaded Files</h4>
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
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Google Documents</h4>
                      <div className="space-y-2">
                        {project.googleDocLinks.map((link, index) => (
                          <div key={index} className="flex items-center justify-between bg-green-50 border border-green-200 px-4 py-3 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <ExternalLink className="h-4 w-4 text-green-600" />
                              <div>
                                <p className="text-sm font-medium text-green-900">
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
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          © 2025. Built with <span className="text-red-500">♥</span> using{' '}
          <a href="https://caffeine.ai" className="text-blue-600 hover:text-blue-700 transition-colors">
            caffeine.ai
          </a>
        </div>
      </div>
    </div>
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
