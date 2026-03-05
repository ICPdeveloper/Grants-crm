import React, { useEffect, useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import SharedProject from './pages/SharedProject';
import ProfileSetup from './components/ProfileSetup';
import ErrorBoundary from './components/ErrorBoundary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';

function AuthenticatedApp() {
  const { identity, isInitializing, loginError } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched, error: profileError } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Initializing application...</p>
        </div>
      </div>
    );
  }

  if (loginError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Authentication failed: {loginError.message}. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (profileLoading && !isFetched) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (profileError && isFetched) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load your profile. Please try refreshing the page or contact support if the problem persists.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const showProfileSetup = isAuthenticated && isFetched && userProfile === null && !profileError;
  
  if (showProfileSetup) {
    return <ProfileSetup />;
  }

  if (isAuthenticated && isFetched && (userProfile || profileError)) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<{ type: 'shared' | 'app'; linkId?: string }>({ type: 'app' });

  useEffect(() => {
    const path = window.location.pathname;
    const sharedMatch = path.match(/^\/shared\/(.+)$/);
    
    if (sharedMatch) {
      setCurrentRoute({ type: 'shared', linkId: sharedMatch[1] });
    } else {
      setCurrentRoute({ type: 'app' });
    }

    const handlePopState = () => {
      const newPath = window.location.pathname;
      const newSharedMatch = newPath.match(/^\/shared\/(.+)$/);
      
      if (newSharedMatch) {
        setCurrentRoute({ type: 'shared', linkId: newSharedMatch[1] });
      } else {
        setCurrentRoute({ type: 'app' });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <ErrorBoundary>
      {currentRoute.type === 'shared' && currentRoute.linkId ? (
        <SharedProject linkId={currentRoute.linkId} />
      ) : (
        <AuthenticatedApp />
      )}
    </ErrorBoundary>
  );
}
