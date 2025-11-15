import React from 'react';
import { User } from '../types';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { TrashIcon } from '../icons/TrashIcon';

interface UsersPageProps {
    users: User[];
    onAddUser: () => void;
    onEditUser: (user: User) => void;
    onDeleteUser: (user: User) => void;
}

const UsersPage: React.FC<UsersPageProps> = ({ users, onAddUser, onEditUser, onDeleteUser }) => {

    const formatCurrency = (value: number) => {
        if (value === 0) return 'N/A';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    }

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                <button 
                    onClick={onAddUser}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all"
                >
                    <PlusIcon className="w-5 h-5"/>
                    New User
                </button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Role</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Department</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Manager Email</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Approval Limit</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">{user.role}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{user.dept}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-gray-400">{user.managerId || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-gray-700 dark:text-gray-300">{formatCurrency(500000)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => onEditUser(user)} className="p-1 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-2" title="Edit User">
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => onDeleteUser(user)} disabled={users.length <= 1} className="p-1 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed" title="Delete User">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersPage;