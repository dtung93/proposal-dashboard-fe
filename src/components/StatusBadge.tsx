import React from 'react';
import { ProposalStatus, ProposalWorkflowStatus } from '../types';

interface StatusBadgeProps {
  status: ProposalStatus | ProposalWorkflowStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<ProposalStatus | ProposalWorkflowStatus, { dot: string; text: string; bg: string; }> = {
    [ProposalStatus.PENDING]: { dot: 'bg-yellow-400', text: 'text-yellow-800 dark:text-yellow-300', bg: 'bg-yellow-100 dark:bg-yellow-400/20' },
    [ProposalWorkflowStatus.ACCOUNTANT_REVIEW]: { dot: 'bg-yellow-400', text: 'text-yellow-800 dark:text-yellow-300', bg: 'bg-yellow-100 dark:bg-yellow-400/20' },
    [ProposalWorkflowStatus.MANAGER_REVIEW]: { dot: 'bg-blue-400', text: 'text-blue-800 dark:text-blue-300', bg: 'bg-blue-100 dark:bg-blue-400/20' },
    [ProposalWorkflowStatus.DIRECTOR_REVIEW]: { dot: 'bg-purple-400', text: 'text-purple-800 dark:text-purple-300', bg: 'bg-purple-100 dark:bg-purple-400/20' },
    [ProposalWorkflowStatus.APPROVED]: { dot: 'bg-green-400', text: 'text-green-800 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-400/20' },
    // FX: The following keys were duplicates because their string values are the same as in ProposalWorkflowStatus.
    // [ProposalStatus.APPROVED]: { dot: 'bg-green-400', text: 'text-green-800 dark:text-green-300', bg: 'bg-green-100 dark:bg-green-400/20' },
    [ProposalWorkflowStatus.REJECTED]: { dot: 'bg-red-400', text: 'text-red-800 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-400/20' },
    // [ProposalStatus.REJECTED]: { dot: 'bg-red-400', text: 'text-red-800 dark:text-red-300', bg: 'bg-red-100 dark:bg-red-400/20' },
  };
  
  const config = statusConfig[status];

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
      <span className={`h-2 w-2 rounded-full ${config.dot}`}></span>
      <span>{status}</span>
    </div>
  );
};

export default StatusBadge;