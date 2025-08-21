import React, { useState } from 'react';
import { Users, Database, BarChart3 } from 'lucide-react';
import { UserManagement } from './UserManagement';
import { DataManagement } from './DataManagement';
import { Analytics } from './Analytics';

type AdminTab = 'users' | 'data' | 'analytics';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');

  const tabs = [
    { id: 'users' as AdminTab, label: 'User Management', icon: Users },
    { id: 'data' as AdminTab, label: 'Data Management', icon: Database },
    { id: 'analytics' as AdminTab, label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'data' && <DataManagement />}
          {activeTab === 'analytics' && <Analytics />}
        </div>
      </div>
    </div>
  );
};