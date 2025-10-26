import React from 'react';
import { Proposal } from '../types';
import ProposalCard from './ProposalCard';
import { EmptyStateIcon } from '../icons/EmptyStateIcon';

interface ProposalListProps {
  proposals: Proposal[];
  onSelectProposal: (proposal: Proposal) => void;
}

const ProposalList: React.FC<ProposalListProps> = ({ proposals, onSelectProposal }) => {
  if (proposals.length === 0) {
    return (
        <div className="text-center py-20 px-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
            <EmptyStateIcon className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500" />
            <h2 className="mt-6 text-xl font-semibold text-gray-800 dark:text-gray-200">No Proposals Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Try adjusting your search or filter criteria.</p>
        </div>
    );
  }
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {proposals.map(proposal => (
        <ProposalCard key={proposal.proposalId} proposal={proposal} onSelect={onSelectProposal} />
      ))}
    </div>
  );
};

export default ProposalList;