import React from 'react';
import { HistoryEntry } from '../types';
import StatusBadge from '../components/StatusBadge';
import { CollectionIcon } from '../icons/CollectionIcon';
import { EmptyStateIcon } from '../icons/EmptyStateIcon';

interface HistoryListProps {
  history: HistoryEntry[];
}

const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
    const formatTimestamp = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(date);
    };

    if (history.length === 0) {
        return (
             <div className="text-center mt-12 py-20 px-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
                <EmptyStateIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
                <h2 className="mt-6 text-xl font-semibold text-gray-800 dark:text-gray-200">No Activity Yet</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Approve or reject a proposal to see the history here.</p>
            </div>
        )
    }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-6">
            <CollectionIcon className="h-6 w-6 text-indigo-500" />
            <h2 id="activity-history" className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
        </div>
        <ul className="space-y-4">
            {history.map(entry => (
                <li key={entry.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border-l-4 border-indigo-400">
                   <div>
                        <p className="text-gray-800 dark:text-gray-200">
                            Proposal <span className="font-semibold text-indigo-600 dark:text-indigo-400">"{entry.proposalTitle}"</span> status changed to:
                        </p>
                        <div className="mt-2 sm:mt-0">
                           <StatusBadge status={entry.newStatus} />
                        </div>
                   </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0 sm:text-right">
                        {formatTimestamp(entry.timestamp)}
                    </p>
                </li>
            ))}
        </ul>
    </div>
  );
};

export default HistoryList;