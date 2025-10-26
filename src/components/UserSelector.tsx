import React from 'react';
import { User } from '../types';
import { UserCircleIcon } from '../icons/UserCircleIcon';

interface UserSelectorProps {
    users: User[];
    currentUser: User;
    onUserChange: (user: User) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({ users, currentUser, onUserChange }) => {
    
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedUser = users.find(u => u.id === e.target.value);
        if (selectedUser) {
            onUserChange(selectedUser);
        }
    };

    return (
        <div className="mb-6 p-4 bg-indigo-50 dark:bg-slate-800 border-2 border-dashed border-indigo-200 dark:border-indigo-500/30 rounded-xl flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-shrink-0 flex items-center gap-3">
                <UserCircleIcon className="w-8 h-8 text-indigo-500" />
                <div className="text-sm">
                    <p className="font-bold text-gray-800 dark:text-gray-200">Simulating Logged-in User</p>
                    <p className="text-gray-600 dark:text-gray-400">Switch user to test different roles.</p>
                </div>
            </div>
            <div className="w-full sm:w-auto sm:ml-auto">
                 <select
                    value={currentUser.id}
                    onChange={handleSelectChange}
                    className="w-full md:w-auto p-2.5 border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    aria-label="Select current user"
                >
                    {users.map(user => (
                        <option key={user.id} value={user.id}>
                            {user.name} ({user.role})
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default UserSelector;