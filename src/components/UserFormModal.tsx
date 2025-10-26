import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { CloseIcon } from '../icons/CloseIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { PencilIcon } from '../icons/PencilIcon';

interface UserFormModalProps {
  mode: 'new' | 'edit';
  initialData?: User;
  onClose: () => void;
  onSave: (userData: Omit<User, 'id'>, mode: 'new' | 'edit', userId?: string) => void;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ mode, initialData, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.REQUESTER);
    const [dept, setDept] = useState('');
    const [managerEmail, setManagerEmail] = useState('');
    const [approvalLimit, setApprovalLimit] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setEmail(initialData.email);
            setRole(initialData.role);
            setDept(initialData.dept);
            setManagerEmail(initialData.managerEmail || '');
            setApprovalLimit(initialData.approvalLimit.toString());
        }
    }, [initialData]);

    const isFormValid = name && email && role && dept && approvalLimit;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        const userData: Omit<User, 'id'> = {
            name,
            email,
            role,
            dept,
            managerEmail: managerEmail || undefined,
            approvalLimit: Number(approvalLimit),
        };
        onSave(userData, mode, initialData?.id);
    };
    
    const modalTitle = mode === 'new' ? 'Create New User' : 'Edit User';
    const submitButtonText = mode === 'new' ? 'Create User' : 'Save Changes';

  return (
    <div
      className="fixed inset-0 bg-slate-900 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-form-title"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col m-4 transform animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <h2 id="user-form-title" className="text-2xl font-bold text-gray-900 dark:text-white">{modalTitle}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
            aria-label="Close modal"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
            <main className="p-6 overflow-y-auto flex-grow space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="form-input" />
                    </div>
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="form-input" />
                    </div>
                     <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                        <select id="role" value={role} onChange={e => setRole(e.target.value as UserRole)} required className="form-input">
                            {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="dept" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                        <input type="text" id="dept" value={dept} onChange={e => setDept(e.target.value)} required className="form-input" />
                    </div>
                     <div>
                        <label htmlFor="managerEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Manager's Email (Optional)</label>
                        <input type="email" id="managerEmail" value={managerEmail} onChange={e => setManagerEmail(e.target.value)} className="form-input" />
                    </div>
                     <div>
                        <label htmlFor="approvalLimit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Approval Limit (VND)</label>
                        <input type="number" id="approvalLimit" value={approvalLimit} onChange={e => setApprovalLimit(e.target.value)} required className="form-input" min="0" />
                    </div>
                </div>
            </main>

            <footer className="p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex justify-end items-center gap-4 rounded-b-xl">
                <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-semibold rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
                    Cancel
                </button>
                <button type="submit" disabled={!isFormValid} className="px-5 py-2.5 text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-slate-800 focus:ring-indigo-500 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {mode === 'new' ? <PlusIcon className="w-5 h-5"/> : <PencilIcon className="w-5 h-5" />} {submitButtonText}
                </button>
            </footer>
        </form>
      </div>
      <style>{`
          .form-input {
              display: block;
              width: 100%;
              padding: 0.625rem 0.75rem;
              border: 1px solid;
              border-color: rgb(209 213 219 / 1);
              border-radius: 0.5rem;
              background-color: rgb(249 250 251 / 1);
              color: rgb(17 24 39 / 1);
              transition: all 0.2s;
          }
          .dark .form-input {
              border-color: rgb(51 65 85 / 1);
              background-color: rgb(15 23 42 / 1);
              color: rgb(226 232 240 / 1);
          }
          .form-input:focus {
              outline: 2px solid transparent;
              outline-offset: 2px;
              --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
              --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
              box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
              border-color: rgb(99 102 241 / 1);
              --tw-ring-color: rgb(99 102 241 / 1);
          }
           @keyframes scale-in {
            from { transform: scale(0.95) translateY(10px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
          }
          .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default UserFormModal;
