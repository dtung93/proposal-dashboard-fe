import React from "react";
import { Proposal, ProposalStatus } from "../types";
import StatusBadge from "./StatusBadge";
import { BudgetIcon } from "../icons/BudgetIcon";
import { TagIcon } from "../icons/TagIcon";
import { PaperClipIcon } from "../icons/PaperClipIcon";
import { CalendarIcon } from "../icons/CalendarIcon";
import { formatUTC7Date } from "../services/utilities";
import { UserCircleIcon } from "../icons/UserCircleIcon";

interface ProposalCardProps {
  index: number;
  proposal: Proposal;
  onSelect: (proposal: Proposal) => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ proposal, onSelect }) => {
  const {
    proposalId,
    title,
    proposer,
    dept,
    summary,
    status,
    budget,
    type,
    attachment,
    submittedDate,
  } = proposal;
  const formattedBudget = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(budget);

  const statusBorderColors: Record<ProposalStatus, string> = {
    [ProposalStatus.ACCOUNTANT_REVIEW]: "border-t-yellow-400",
    [ProposalStatus.ACCOUNTANT_REVIEWED]: "border-t-green-400",
    [ProposalStatus.ACCOUNTANT_REJECTED]: "border-t-red-400",

    [ProposalStatus.MANAGER_REVIEW]: "border-t-yellow-400",
    [ProposalStatus.MANAGER_REVIEWED]: "border-t-green-400",
    [ProposalStatus.MANAGER_REJECTED]: "border-t-red-400",

    [ProposalStatus.DIRECTOR_REVIEW]: "border-t-yellow-400",
    [ProposalStatus.DIRECTOR_REVIEWED]: "border-t-green-400",
    [ProposalStatus.DIRECTOR_REJECTED]: "border-t-red-400",
    [ProposalStatus.Approved]: "border-t-green-400",

    [ProposalStatus.Rejected]: "border-t-red-400",
  };

  return (
    <div
      onClick={() => onSelect(proposal)}
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out cursor-pointer flex flex-col overflow-hidden border-t-4 ${statusBorderColors[status]} hover:-translate-y-1`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect(proposal)}
      aria-label={`View details for ${title}`}
    >
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-mono text-gray-400 dark:text-gray-500">
            {formatUTC7Date(submittedDate)}
          </p>
          <StatusBadge status={status} />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 pr-2 leading-tight">
          {title}
        </h2>
        <div className="mb-4 space-y-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold">{proposal.dept}</span>
          </p>
          <div className="flex items-center flex-wrap gap-x-4 gap-y-1 pt-2">
            <div className="flex items-center gap-1.5">
              <TagIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                {proposal.type}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <UserCircleIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                {proposal.proposer?.name}
              </p>
            </div>
          </div>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mt-4 text-sm leading-relaxed line-clamp-3">
          {summary}
        </p>
      </div>
      <div className="bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BudgetIcon className="w-5 h-5 text-indigo-500" />
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Ngân sách:{" "}
            <span className="text-gray-900 dark:text-gray-100 font-bold">
              {formattedBudget}
            </span>
          </p>
        </div>
        {attachment && (
          // FIX: Wrapped the icon in a span to correctly apply the title attribute for tooltips.
          <span title="This proposal has an attachment">
            <PaperClipIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          </span>
        )}
      </div>
    </div>
  );
};

export default ProposalCard;
