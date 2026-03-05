import React from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Building2, Shield, Users, BarChart3 } from 'lucide-react';

export default function LoginPage() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
          <div className="max-w-md w-full space-y-8">
            <div>
              <div className="flex items-center space-x-3 mb-8">
                <Building2 className="h-10 w-10 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">Altemis CRM</h1>
              </div>
              <h2 className="text-xl text-gray-600 mb-8">
                Grants Facilitator Management System
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Secure blockchain project management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Client relationship management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">Grant application tracking</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={login}
                disabled={isLoggingIn}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Logging in...
                  </div>
                ) : (
                  'Login to Access CRM'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right side - Visual */}
        <div className="hidden lg:block relative w-0 flex-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center">
            <div className="text-center text-white">
              <Building2 className="h-32 w-32 mx-auto mb-8 opacity-80" />
              <h3 className="text-2xl font-semibold mb-4">Streamline Your Grant Process</h3>
              <p className="text-lg opacity-90 max-w-md">
                Manage blockchain projects, track grant applications, and maintain client relationships all in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
