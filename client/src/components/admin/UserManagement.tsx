/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { User, Shield, ShieldOff, UserX, RefreshCw } from 'lucide-react';
import { usersApi } from '../../services/api';
import type { User as UserType } from '../../types';
import axios from 'axios';
import { useAuthStore } from '@/features/auth/store';

export const UserManagement: React.FC = () => {
  const { token } = useAuthStore();
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setError('');
    } catch (err: any) {
      setError('Failed to load users');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      await axios.put(`/api/users/${userId}/role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err: any) {
      alert('Failed to update user role');
      console.error(err);
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    // if (!confirm('Are you sure you want to deactivate this user?')) return;

    try {
      await axios.put(`/api/users/${userId}/deactive`, undefined, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: false } : user
      ));
    } catch (err: any) {
      alert('Failed to deactivate user');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadUsers}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">User Management</h3>
        <button
          onClick={loadUsers}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.username}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as 'user' | 'admin')}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    user.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {user.role === 'user' ? (
                      <button
                        onClick={() => handleRoleChange(user.id, 'admin')}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Promote to Admin"
                      >
                        <Shield className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRoleChange(user.id, 'user')}
                        className="text-orange-600 hover:text-orange-900 p-1"
                        title="Demote to User"
                      >
                        <ShieldOff className="h-4 w-4" />
                      </button>
                    )}
                    
                    {user.is_active && (
                      <button
                        onClick={() => handleDeactivateUser(user.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Deactivate User"
                      >
                        <UserX className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-gray-500">
        Total users: {users.length} | Active: {users.filter(u => u.is_active).length} | Admins: {users.filter(u => u.role === 'admin').length}
      </div>
    </div>
  );
};