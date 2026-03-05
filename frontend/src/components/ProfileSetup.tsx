import React, { useState } from 'react';
import { useSaveUserProfile } from '../hooks/useQueries';
import { User, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LoadingSpinner from './LoadingSpinner';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const saveProfile = useSaveUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      try {
        await saveProfile.mutateAsync({ name: name.trim() });
      } catch (error) {
        // Error is handled by the mutation
        console.error('Profile setup error:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to Altemis CRM
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please enter your name to complete your profile setup
          </p>
        </div>
        
        {saveProfile.error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {saveProfile.error.message}
            </AlertDescription>
          </Alert>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="mt-1"
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={!name.trim() || saveProfile.isPending}
              className="w-full flex items-center justify-center space-x-2"
            >
              {saveProfile.isPending ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Setting up...</span>
                </>
              ) : (
                <span>Complete Setup</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
