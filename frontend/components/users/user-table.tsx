'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface UserTableProps {
  users: User[];
  currentUserId: string;
}

export function UserTable({ users, currentUserId }: UserTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = async (userId: string, currentStatus: boolean) => {
    if (userId === currentUserId) return;
    
    setIsToggling(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to update status');
      }

      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsToggling(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-red-50 text-red-600 border-red-200';
      case 'TECH_ADMIN': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'SALES_ADMIN': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'STAFF': return 'bg-green-50 text-green-600 border-green-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="rounded-[24px] bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)] overflow-hidden flex flex-col transition-all">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight">User Directory</h3>
        <div className="relative group/search">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] transition-colors group-focus-within/search:text-[#abc4ff]">search</span>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-[12px] text-[13px] font-medium text-slate-900 focus:ring-4 focus:ring-[#abc4ff]/20 focus:border-[#abc4ff] outline-none w-[280px] transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30 text-[11px] uppercase tracking-widest font-semibold text-slate-500 border-b border-slate-100">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Added</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-[14px] font-medium text-slate-400">
                  No users found matching your search.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className={`transition-colors duration-200 group ${!user.isActive ? 'bg-slate-50/50 opacity-80' : 'hover:bg-slate-50/80'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[10px] bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[13px] uppercase border border-slate-200 shadow-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-[14px] tracking-tight flex items-center gap-2">
                          {user.name}
                          {user.id === currentUserId && (
                            <span className="text-[9px] bg-slate-900 text-white px-1.5 py-0.5 rounded-[4px] font-bold uppercase tracking-wider shadow-sm">You</span>
                          )}
                        </p>
                        <p className="text-[12px] font-medium text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-md border ${getRoleBadge(user.role)} shadow-[0_1px_2px_rgba(0,0,0,0.02)]`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)] ${user.isActive ? 'bg-emerald-500 shadow-emerald-500/40' : 'bg-slate-300'}`}></div>
                      <span className="text-[13px] font-semibold text-slate-600">
                        {user.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {user.id !== currentUserId && (
                      <button
                        onClick={() => toggleStatus(user.id, user.isActive)}
                        disabled={isToggling === user.id}
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold rounded-[8px] transition-all duration-200 border shadow-[0_1px_2px_rgba(0,0,0,0.02)] disabled:opacity-50 ${
                          user.isActive 
                            ? 'text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border-red-100 hover:border-red-600' 
                            : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-600 hover:text-white border-emerald-100 hover:border-emerald-600'
                        }`}
                      >
                        {isToggling === user.id ? (
                          <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                        ) : (
                          <span className="material-symbols-outlined text-[14px]">
                            {user.isActive ? 'block' : 'check_circle'}
                          </span>
                        )}
                        {user.isActive ? 'Suspend' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
