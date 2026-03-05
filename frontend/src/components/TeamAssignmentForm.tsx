import React, { useState } from 'react';
import { TeamAssignment, TeamRole } from '../backend';
import { Plus, X, Users, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TeamAssignmentFormProps {
  teamAssignments: TeamAssignment[];
  onChange: (assignments: TeamAssignment[]) => void;
}

export default function TeamAssignmentForm({ teamAssignments, onChange }: TeamAssignmentFormProps) {
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<TeamRole | ''>('');

  const teamRoles = [
    { value: TeamRole.responsible, label: 'Responsible' },
    { value: TeamRole.workingOn, label: 'Working On' },
  ];

  const handleAddTeamMember = () => {
    if (newMemberName.trim() && newMemberRole) {
      const newAssignment: TeamAssignment = {
        memberName: newMemberName.trim(),
        role: newMemberRole,
      };
      onChange([...teamAssignments, newAssignment]);
      setNewMemberName('');
      setNewMemberRole('');
    }
  };

  const handleRemoveTeamMember = (index: number) => {
    const updatedAssignments = teamAssignments.filter((_, i) => i !== index);
    onChange(updatedAssignments);
  };

  const getRoleLabel = (role: TeamRole) => {
    const roleObj = teamRoles.find(r => r.value === role);
    return roleObj ? roleObj.label : role;
  };

  const responsibleMembers = teamAssignments.filter(a => a.role === TeamRole.responsible);
  const workingOnMembers = teamAssignments.filter(a => a.role === TeamRole.workingOn);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Users className="h-4 w-4 text-gray-600" />
        <Label className="text-sm font-medium text-gray-700">
          Internal Altemis Support Team
        </Label>
      </div>
      <p className="text-sm text-gray-500">
        Assign internal Altemis team members to support this grant application. This refers to our internal staff, not the external project team.
      </p>

      {/* Existing Team Assignments */}
      {teamAssignments.length > 0 && (
        <div className="space-y-3">
          {/* Responsible Members - Highlighted */}
          {responsibleMembers.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Crown className="h-3 w-3 mr-1 text-amber-500" />
                Responsible
              </h4>
              <div className="space-y-2">
                {responsibleMembers.map((assignment, index) => (
                  <div key={`responsible-${index}`} className="flex items-center justify-between bg-amber-50 border-2 border-amber-200 px-3 py-2 rounded-md">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-amber-600" />
                      <span className="font-semibold text-amber-900">{assignment.memberName}</span>
                      <span className="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded font-medium">
                        {getRoleLabel(assignment.role)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTeamMember(teamAssignments.findIndex(a => a === assignment))}
                      className="text-red-600 hover:text-red-700"
                      title="Remove team member"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Working On Members - Regular styling */}
          {workingOnMembers.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Other Team Members</h4>
              <div className="space-y-2">
                {workingOnMembers.map((assignment, index) => (
                  <div key={`working-${index}`} className="flex items-center justify-between bg-blue-50 border border-blue-200 px-3 py-2 rounded-md">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-blue-900">{assignment.memberName}</span>
                      <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {getRoleLabel(assignment.role)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTeamMember(teamAssignments.findIndex(a => a === assignment))}
                      className="text-red-600 hover:text-red-700"
                      title="Remove team member"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add New Team Member */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="memberName" className="text-sm font-medium text-gray-700">
              Altemis Team Member Name
            </Label>
            <Input
              id="memberName"
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Enter team member name"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="memberRole" className="text-sm font-medium text-gray-700">
              Internal Role
            </Label>
            <Select
              value={newMemberRole}
              onValueChange={(value) => setNewMemberRole(value as TeamRole)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {teamRoles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-end">
            <Button
              type="button"
              onClick={handleAddTeamMember}
              disabled={!newMemberName.trim() || !newMemberRole}
              className="w-full flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Member</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
