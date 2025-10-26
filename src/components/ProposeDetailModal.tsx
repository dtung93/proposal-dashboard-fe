import React, { useState, useMemo } from 'react';
import { Proposal, User, UserRole, ProposalWorkflowStatus, ApprovalRecord } from '../types';
import StatusBadge from './StatusBadge';
import { CloseIcon } from '../icons/CloseIcon';
import { BudgetIcon } from '../icons/BudgetIcon';
import { TagIcon } from '../icons/TagIcon';
import { PaperClipIcon } from '../icons/PaperClipIcon';
import { CalendarIcon } from '../icons/CalendarIcon';
import { ShareIcon } from '../icons/ShareIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { CheckIcon } from '../icons/CheckIcon';
import { XIcon } from '../icons/XIcon';
import { XCircleIcon } from '../icons/XCircleIcon';
import { ArrowUturnLeftIcon } from '../icons/ArrowUturnLeftIcon';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';


interface ProposalDetailModalProps {
  proposal: Proposal;
  currentUser: User;
  onClose: () => void;
  onAdvanceWorkflow: (proposalId: string, action: 'approve' | 'confirm' | 'reject', comment: string) => void;
  onEdit: (proposal: Proposal) => void;
  onResubmit: (proposal: Proposal) => void;
}

const ProposalDetailModal: React.FC<ProposalDetailModalProps> = ({
  proposal,
  currentUser,
  onClose,
  onAdvanceWorkflow,
  onEdit,
  onResubmit,
}) => {
  const [actionComment, setActionComment] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const formattedBudget = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(proposal.budget);

  const canTakeAction = useMemo(() => {
    const { role, approvalLimit } = currentUser;
    const { status, budget, proposerId } = proposal;

    if (proposerId === currentUser.id) return false; // Cannot approve own proposal

    switch(role) {
      case UserRole.ACCOUNTANT: 
        return status === ProposalWorkflowStatus.ACCOUNTANT_REVIEW;
      case UserRole.MANAGER: 
        return status === ProposalWorkflowStatus.MANAGER_REVIEW && budget <= approvalLimit;
      case UserRole.DIRECTOR: 
        return status === ProposalWorkflowStatus.DIRECTOR_REVIEW && budget <= approvalLimit;
      default: 
        return false;
    }
  }, [currentUser, proposal]);

  const canEdit = useMemo(() => {
    return proposal.proposerId === currentUser.id && proposal.status === ProposalWorkflowStatus.REJECTED;
  }, [currentUser, proposal]);
  
  const handleAction = (action: 'approve' | 'confirm' | 'reject') => {
    if (action === 'reject' && !actionComment.trim()) {
        alert("Rejection reason is required.");
        return;
    }
    onAdvanceWorkflow(proposal.proposalId, action, actionComment);
  };
  
  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?proposal=${proposal.proposalId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const ApprovalTimeline: React.FC<{ history: ApprovalRecord[] }> = ({ history }) => (
    <div className="space-y-4">
        {history.map((record, index) => (
            <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${record.status === ProposalWorkflowStatus.REJECTED ? 'bg-red-100 dark:bg-red-500/20' : 'bg-indigo-100 dark:bg-indigo-500/20'}`}>
                        {record.status === ProposalWorkflowStatus.REJECTED ? <XIcon className="w-5 h-5 text-red-500"/> : <CheckIcon className="w-5 h-5 text-indigo-500" />}
                    </div>
                    {index < history.length - 1 && <div className="w-px h-12 bg-gray-300 dark:bg-slate-600 mt-1"></div>}
                </div>
                <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {record.userName} <span className="text-gray-500 dark:text-gray-400 font-normal">({record.userRole})</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Status changed to <span className="font-medium">{record.status}</span>
                    </p>
                    {record.comment && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">"{record.comment}"</p>}
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{new Date(record.timestamp).toLocaleString()}</p>
                </div>
            </div>
        ))}
    </div>
  );
  
  const getActionVerb = () => {
      if(currentUser.role === UserRole.ACCOUNTANT) return 'Confirm';
      return 'Approve';
  }

  return (
    <div
      className="fixed inset-0 bg-slate-900 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col m-4 transform animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 sm:p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
            <div className="flex-grow min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate" title={proposal.title}>{proposal.title}</h2>
                <p className="text-xs font-mono text-gray-400 dark:text-gray-500 mt-1">{proposal.proposalId}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-4 relative">
                <button onClick={handleShare} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"><ShareIcon className="w-5 h-5"/></button>
                {isCopied && <span className="absolute -top-7 right-0 text-xs bg-gray-800 text-white px-2 py-1 rounded">Copied!</span>}
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors" aria-label="Close modal"><CloseIcon className="w-6 h-6" /></button>
            </div>
        </header>

        <main className="p-6 overflow-y-auto flex-grow space-y-6">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <StatusBadge status={proposal.status} />
                <div className="flex items-center gap-2"><p className="text-sm font-medium text-gray-500 dark:text-gray-400">Proposer:</p><p className="font-semibold text-gray-800 dark:text-gray-200">{proposal.proposer}</p></div>
                <div className="flex items-center gap-2"><p className="text-sm font-medium text-gray-500 dark:text-gray-400">Organization:</p><p className="font-semibold text-gray-800 dark:text-gray-200">{proposal.organization}</p></div>
                <div className="flex items-center gap-2"><CalendarIcon className="w-5 h-5 text-gray-400"/><p className="font-medium text-gray-800 dark:text-gray-200">{proposal.submittedDate}</p></div>
                <div className="flex items-center gap-2"><TagIcon className="w-5 h-5 text-gray-400"/><p className="font-medium text-gray-800 dark:text-gray-200">{proposal.type}</p></div>
                <div className="flex items-center gap-2"><BudgetIcon className="w-5 h-5 text-gray-400"/><p className="font-bold text-gray-800 dark:text-gray-200">{formattedBudget}</p></div>
            </div>

            <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Summary</h3>
                <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-800/50 p-3 rounded-lg">{proposal.summary}</p>
            </div>
            <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Full Text</h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{proposal.fullText}</p>
            </div>

            {proposal.attachment && (
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Attachment</h3>
                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-slate-700/50 p-3 rounded-lg">
                        <PaperClipIcon className="w-6 h-6 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <p className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer truncate">{proposal.attachment.name}</p>
                    </div>
                </div>
            )}

            {proposal.status === ProposalWorkflowStatus.REJECTED && proposal.rejectionReason && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                    <div className="flex items-start gap-3">
                        <XCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                             <h3 className="text-lg font-bold text-red-800 dark:text-red-300">Rejection Reason</h3>
                            <p className="text-red-700 dark:text-red-200 mt-1">{proposal.rejectionReason}</p>
                        </div>
                    </div>
                </div>
            )}
            
            {proposal.approvalHistory.length > 0 && (
                 <div className="space-y-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Approval History</h3>
                    <ApprovalTimeline history={proposal.approvalHistory} />
                </div>
            )}
        </main>

        {(canTakeAction || canEdit) && (
            <footer className="p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex-shrink-0">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Actions</h3>
                {canTakeAction && (
                     <textarea
                        value={actionComment}
                        onChange={(e) => setActionComment(e.target.value)}
                        placeholder={currentUser.role === UserRole.ACCOUNTANT ? "Optional comment for confirmation..." : "Optional comment for approval..."}
                        className="form-input mb-4"
                        rows={3}
                    />
                )}
               
                <div className="flex flex-col sm:flex-row justify-end items-center gap-3">
                    {canEdit && <button onClick={() => onEdit(proposal)} className="action-button secondary-button"><PencilIcon className="w-5 h-5"/> Edit</button>}
                    {canEdit && <button onClick={() => onResubmit(proposal)} className="action-button secondary-button"><ArrowUturnLeftIcon className="w-5 h-5"/> Re-submit</button>}
                    {canTakeAction && <button onClick={() => handleAction('reject')} className="action-button reject-button"><XIcon className="w-5 h-5"/> Reject</button>}
                    {canTakeAction && <button onClick={() => handleAction(getActionVerb().toLowerCase() as 'approve' | 'confirm')} className="action-button approve-button"><CheckIcon className="w-5 h-5"/> {getActionVerb()}</button>}
                </div>
            </footer>
        )}
      </div>
      <style>{`
          .form-input {
              display: block; width: 100%; padding: 0.625rem 0.75rem; border: 1px solid rgb(209 213 219); border-radius: 0.5rem; background-color: white; color: rgb(17 24 39); transition: all 0.2s;
          }
          .dark .form-input {
              border-color: rgb(51 65 85); background-color: rgb(30 41 59); color: rgb(226 232 240);
          }
          .form-input:focus {
              outline: 2px solid transparent; outline-offset: 2px; box-shadow: 0 0 0 2px var(--tw-ring-color); border-color: rgb(99 102 241); --tw-ring-color: rgb(99 102 241);
          }
          .action-button {
              display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.625rem 1.25rem; font-semibold; border-radius: 0.5rem; transition: all 0.2s; width: 100%; sm:width: auto;
          }
          .approve-button { background-color: #10B981; color: white; }
          .approve-button:hover { background-color: #059669; }
          .reject-button { background-color: #EF4444; color: white; }
          .reject-button:hover { background-color: #DC2626; }
          .secondary-button { background-color: white; color: #4F46E5; border: 1px solid #A5B4FC; }
          .secondary-button:hover { background-color: #EEF2FF; }
          .dark .secondary-button { background-color: transparent; color: #A78BFA; border-color: #6D28D9; }
          .dark .secondary-button:hover { background-color: #4C1D95; }

           @keyframes scale-in {
            from { transform: scale(0.95) translateY(10px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
          }
          .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
        `}</style>
    </div>
  );
};

export default ProposalDetailModal;
