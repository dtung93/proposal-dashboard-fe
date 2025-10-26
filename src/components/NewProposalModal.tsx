import React, { useState, useEffect } from 'react';
import { Proposal, ProposalType } from '../types';
import { CloseIcon } from '../icons/CloseIcon';
import { PlusIcon } from '../icons/PlusIcon';
import { PaperClipIcon } from '../icons/PaperClipIcon';
import { PencilIcon } from '../icons/PencilIcon';

interface ProposalFormModalProps {
  mode: 'new' | 'edit' | 'resubmit';
  initialData?: Proposal;
  onClose: () => void;
  // FX: Corrected the Omit type to match what the parent component `handleSaveProposal` function expects.
  // FIX: The Omit type was incorrect. Changed 'id' to 'proposalId' to match the 'Proposal' interface.
  onSave: (proposalData: Omit<Proposal, 'proposalId' | 'status' | 'submittedDate' | 'proposerId' | 'approvalHistory'>, mode: 'new' | 'edit' | 'resubmit', proposalId?: string) => void;
}

const ProposalFormModal: React.FC<ProposalFormModalProps> = ({ mode, initialData, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [proposer, setProposer] = useState('');
    const [organization, setOrganization] = useState('');
    const [budget, setBudget] = useState('');
    const [type, setType] = useState<ProposalType>(ProposalType.OTHER);
    const [summary, setSummary] = useState('');
    const [fullText, setFullText] = useState('');
    const [attachment, setAttachment] = useState<File | null>(null);
    const [existingAttachment, setExistingAttachment] = useState(initialData?.attachment);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setProposer(initialData.proposer);
            setOrganization(initialData.organization);
            setBudget(initialData.budget.toString());
            setType(initialData.type);
            setSummary(initialData.summary);
            setFullText(initialData.fullText);
            setExistingAttachment(initialData.attachment)
        }
    }, [initialData]);

    const isFormValid = title && proposer && organization && budget && summary && fullText;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        let attachmentData;
        if (attachment) { // New file is attached
            attachmentData = { name: attachment.name, size: attachment.size, type: attachment.type };
        } else if (existingAttachment) { // Existing file is kept
            attachmentData = existingAttachment;
        }


        // FX: Corrected the Omit type to match the `onSave` prop.
        // FIX: The Omit type was incorrect. Changed 'id' to 'proposalId' to match the 'Proposal' interface.
        const proposalData: Omit<Proposal, 'proposalId' | 'status' | 'submittedDate' | 'proposerId' | 'approvalHistory'> = {
            title,
            proposer,
            organization,
            budget: Number(budget),
            type,
            summary,
            fullText,
            ...(attachmentData && { attachment: attachmentData }),
        };
        // FIX: The Proposal type has 'proposalId', not 'id'. Updated to pass the correct property.
        onSave(proposalData, mode, initialData?.proposalId);
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAttachment(e.target.files[0]);
            setExistingAttachment(undefined); // Clear existing attachment if new one is selected
        }
    };
    
    const removeAttachment = () => {
        setAttachment(null);
        setExistingAttachment(undefined);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    const currentAttachment = attachment ? { name: attachment.name, size: attachment.size } : existingAttachment;
    
    const modalTitle = {
        new: 'Create New Proposal',
        edit: 'Edit Proposal',
        resubmit: 'Edit and Re-submit Proposal'
    }[mode];

    const submitButtonText = {
        new: 'Submit Proposal',
        edit: 'Save Changes',
        resubmit: 'Re-submit Proposal'
    }[mode];

  return (
    <div
      className="fixed inset-0 bg-slate-900 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="proposal-form-title"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col m-4 transform animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <h2 id="proposal-form-title" className="text-2xl font-bold text-gray-900 dark:text-white">{modalTitle}</h2>
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
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="proposer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proposer</label>
                        <input type="text" id="proposer" value={proposer} onChange={e => setProposer(e.target.value)} required className="form-input" />
                    </div>
                    <div>
                        <label htmlFor="organization" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Organization</label>
                        <input type="text" id="organization" value={organization} onChange={e => setOrganization(e.target.value)} required className="form-input" />
                    </div>
                     <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ngân sách (VND)</label>
                        <input type="number" id="budget" value={budget} onChange={e => setBudget(e.target.value)} required className="form-input" min="0" />
                    </div>
                     <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                        <select id="type" value={type} onChange={e => setType(e.target.value as ProposalType)} required className="form-input">
                            {Object.values(ProposalType).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
                 <div>
                    <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Summary</label>
                    <textarea id="summary" value={summary} onChange={e => setSummary(e.target.value)} required className="form-input" rows={3}></textarea>
                </div>
                <div>
                    <label htmlFor="fullText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Proposal Text</label>
                    <textarea id="fullText" value={fullText} onChange={e => setFullText(e.target.value)} required className="form-input" rows={6}></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attachment (Optional)</label>
                    {!currentAttachment ? (
                         <label htmlFor="attachment-input" className="relative cursor-pointer bg-gray-50 dark:bg-slate-900 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-indigo-500 transition-colors">
                            <PaperClipIcon className="w-8 h-8 text-gray-400" />
                            <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">Click to upload a file</span>
                            <input id="attachment-input" type="file" className="sr-only" onChange={handleFileChange} />
                        </label>
                    ) : (
                        <div className="flex items-center gap-3 bg-gray-100 dark:bg-slate-700/50 p-3 rounded-lg">
                            <PaperClipIcon className="w-6 h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                            <div className="flex-grow">
                                <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{currentAttachment.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(currentAttachment.size)}</p>
                            </div>
                             <button type="button" onClick={removeAttachment} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 font-semibold text-sm">Remove</button>
                        </div>
                    )}
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

export default ProposalFormModal;
