import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import KanbanBoard from '../components/KanbanBoard';
import BlockchainList from '../components/BlockchainList';
import ClientList from '../components/ClientList';
import ProjectList from '../components/ProjectList';
import GrantProgramList from '../components/GrantProgramList';

type ActiveView = 'dashboard' | 'blockchains' | 'clients' | 'projects' | 'grantPrograms';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <KanbanBoard />;
      case 'blockchains':
        return <BlockchainList />;
      case 'clients':
        return <ClientList />;
      case 'projects':
        return <ProjectList />;
      case 'grantPrograms':
        return <GrantProgramList />;
      default:
        return <KanbanBoard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
}
