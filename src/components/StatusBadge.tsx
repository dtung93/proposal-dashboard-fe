import React from "react";
import { ProposalStatus } from "../types";
import { getVietnameseStatus } from "../services/utilities";

interface StatusBadgeProps {
  status: ProposalStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig: Record<
    string,
    { dot: string; text: string; bg: string }
  > = {
    [ProposalStatus.Approved]: {
      dot: "bg-green-400",
      text: "text-green-800 dark:text-green-300",
      bg: "bg-green-100 dark:bg-green-400/20",
    },
    [ProposalStatus.ACCOUNTANT_REVIEW]: {
      dot: "bg-yellow-400",
      text: "text-yellow-800 dark:text-yellow-300",
      bg: "bg-yellow-100 dark:bg-yellow-400/20",
    },
    [ProposalStatus.ACCOUNTANT_REJECTED]: {
      dot: "bg-yellow-400",
      text: "text-yellow-800 dark:text-yellow-300",
      bg: "bg-yellow-100 dark:bg-yellow-400/20",
    },
    [ProposalStatus.ACCOUNTANT_REVIEWED]: {
      dot: "bg-yellow-400",
      text: "text-yellow-800 dark:text-yellow-300",
      bg: "bg-yellow-100 dark:bg-yellow-400/20",
    },

    [ProposalStatus.MANAGER_REJECTED]: {
      dot: "bg-blue-400",
      text: "text-blue-800 dark:text-blue-300",
      bg: "bg-blue-100 dark:bg-blue-400/20",
    },
    [ProposalStatus.MANAGER_REVIEW]: {
      dot: "bg-blue-400",
      text: "text-blue-800 dark:text-blue-300",
      bg: "bg-blue-100 dark:bg-blue-400/20",
    },
    [ProposalStatus.MANAGER_REVIEWED]: {
      dot: "bg-blue-400",
      text: "text-blue-800 dark:text-blue-300",
      bg: "bg-blue-100 dark:bg-blue-400/20",
    },

    [ProposalStatus.DIRECTOR_REVIEW]: {
      dot: "bg-purple-400",
      text: "text-purple-800 dark:text-purple-300",
      bg: "bg-purple-100 dark:bg-purple-400/20",
    },
    [ProposalStatus.DIRECTOR_REJECTED]: {
      dot: "bg-purple-400",
      text: "text-purple-800 dark:text-purple-300",
      bg: "bg-purple-100 dark:bg-purple-400/20",
    },
    [ProposalStatus.DIRECTOR_REVIEWED]: {
      dot: "bg-purple-400",
      text: "text-purple-800 dark:text-purple-300",
      bg: "bg-purple-100 dark:bg-purple-400/20",
    },

    // FIX: An object literal cannot have multiple properties with the same name. `ProposalStatus.APPROVED` was a duplicate key for "Approved".
    [ProposalStatus.Rejected]: {
      dot: "bg-red-400",
      text: "text-red-800 dark:text-red-300",
      bg: "bg-red-100 dark:bg-red-400/20",
    },
    // FIX: An object literal cannot have multiple properties with the same name. `ProposalStatus.REJECTED` was a duplicate key for "Rejected".
  };

  const config = statusConfig[status];

  if (!config) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200`}
      >
        <span className={`h-2 w-2 rounded-full bg-gray-400`}></span>
        <span>{getVietnameseStatus(status) || "Unknown"}</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}
    >
      <span className={`h-2 w-2 rounded-full ${config.dot}`}></span>
      <span>{getVietnameseStatus(status)}</span>
    </div>
  );
};

export default StatusBadge;
