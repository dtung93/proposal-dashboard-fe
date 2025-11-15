import React, { useMemo, useState } from "react";
import { Proposal, ProposalStatus } from "../types";
import StatCard from "../components/StatCard";
import DateRangeFilter from "../components/DateRangeFilter";
import { CheckCircleIcon } from "../icons/CheckCircleIcon";
import { XCircleIcon } from "../icons/XCircleIcon";
import { ClockIcon } from "../icons/ClockIcon";
import { ScaleIcon } from "../icons/ScaleIcon";
import { ArrowDownTrayIcon } from "../icons/ArrowDownTrayIcon";
declare const XLSX: any;

interface StatsPageProps {
  proposals: Proposal[];
}

const StatsPage: React.FC<StatsPageProps> = ({ proposals }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredProposals = useMemo(() => {
    if (!startDate && !endDate) return proposals;
    return proposals.filter((p) => {
      const proposalDate = new Date(p.submittedDate);
      const matchesStartDate =
        startDate === "" || proposalDate >= new Date(startDate);
      const matchesEndDate =
        endDate === "" || proposalDate <= new Date(endDate);
      return matchesStartDate && matchesEndDate;
    });
  }, [proposals, startDate, endDate]);

  const stats = useMemo(() => {
    const approved = filteredProposals.filter(
      (p) => p.status === ProposalStatus.Approved
    ).length;
    const rejected = filteredProposals.filter(
      (p) => p.status === ProposalStatus.Rejected
    ).length;
    const pending = filteredProposals.filter(
      (p) =>
        p.status !== ProposalStatus.Approved &&
        p.status !== ProposalStatus.Rejected
    ).length;
    const totalBudget = filteredProposals.reduce((acc, p) => acc + p.budget, 0);

    return {
      approved,
      rejected,
      pending,
      totalBudget: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(totalBudget),
    };
  }, [filteredProposals]);

  const handleExportToExcel = () => {
    const dataToExport = filteredProposals.map((p) => ({
      "Proposal ID": p.proposalId,
      Title: p.title,
      Proposer: p.proposer,
      Department: p.dept,
      "Submitted Date": p.submittedDate,
      Status: p.status,
      Type: p.type,
      "Budget (VND)": p.budget,
      Attachment: p.attachment?.name || "N/A",
      "Rejection Reason": p.rejectionReason || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Set column widths for better readability
    worksheet["!cols"] = [
      { wch: 15 }, // Proposal ID
      { wch: 50 }, // Title
      { wch: 20 }, // Proposer
      { wch: 20 }, // Dept
      { wch: 15 }, // Submitted Date
      { wch: 20 }, // Status
      { wch: 20 }, // Type
      { wch: 20 }, // Budget (VND)
      { wch: 30 }, // Attachment
      { wch: 50 }, // Rejection Reason
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Proposals");

    // Trigger the download
    const fileName = `proposals_export_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Statistics & History
          </h1>
          <button
            onClick={handleExportToExcel}
            className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-slate-900 focus:ring-green-500 transition-all"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Export to Excel
          </button>
        </div>
        <div className="mb-8 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <DateRangeFilter
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />
          <button
            onClick={handleClearFilters}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
          >
            Clear Date Filters
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Approved Proposals"
            value={stats.approved.toString()}
            icon={<CheckCircleIcon />}
            color="green"
          />
          <StatCard
            title="Rejected Proposals"
            value={stats.rejected.toString()}
            icon={<XCircleIcon />}
            color="red"
          />
          <StatCard
            title="Pending Review"
            value={stats.pending.toString()}
            icon={<ClockIcon />}
            color="yellow"
          />
          <StatCard
            title="Total Budget in Period"
            value={stats.totalBudget}
            icon={<ScaleIcon />}
            color="indigo"
          />
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
