import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Proposal,
  User,
  UserRole,
  ProposalStatus,
  ProposalAttachmentUploadResponse,
} from "../types";
import Header from "../components/Header";
import FilterBar from "../components/FilterBar";
import ProposalList from "../components/ProposalList";
import StatsPage from "./StatsPage";
import UsersPage from "./UsersPage";
import UserFormModal from "../components/UserFormModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { PlusIcon } from "../icons/PlusIcon";
import {
  createProposal,
  getProposals,
  getUsers,
  uploadProposalAttachments,
} from "../services/api";
import { XCircleIcon } from "../icons/XCircleIcon";
import { useAuth } from "../services/useAuth";
import { useToast } from "../services/useToast";
import ProposalFormModal from "../components/ProposeFormModal";
import ProposalDetailModal from "../components/ProposeDetailModal";
import { MAX_FILE_SIZE_MB, MAX_TOTAL_SIZE_MB } from "../constants";
const DashboardPage: React.FC = () => {
  const { user: loggedInUser } = useAuth(); // This is the authenticated user.

  // Page Navigation State
  const [currentPage, setCurrentPage] = useState<
    "dashboard" | "stats" | "users"
  >("dashboard");

  // Data State
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [currentUser, setCurrentUser] = useState<User | null>(loggedInUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Shared form state for ProposalFormModal (persists even when modal closes)
  const [proposalFormState, setProposalFormState] = useState<any>(null);

  // Modal State
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null
  );
  const [formModalState, setFormModalState] = useState<{
    isOpen: boolean;
    mode: "new" | "edit" | "resubmit";
    data?: Proposal;
  }>({ isOpen: false, mode: "new" });
  const [userFormModalState, setUserFormModalState] = useState<{
    isOpen: boolean;
    mode: "new" | "edit";
    data?: User;
  }>({ isOpen: false, mode: "new" });
  const [confirmationModalState, setConfirmationModalState] = useState<{
    isOpen: boolean;
    onConfirm: () => void;
    title: string;
    message: string;
  }>({ isOpen: false, onConfirm: () => {}, title: "", message: "" });
  const { addToast } = useToast();

  useEffect(() => {
    if (!loggedInUser) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [proposalsData] = await Promise.all([getProposals()]);

        // Sort by newest submittedDate first
        const sortedProposals = proposalsData.sort((a, b) => {
          return (
            new Date(b.submittedDate).getTime() -
            new Date(a.submittedDate).getTime()
          );
        });

        setProposals(sortedProposals);
      } catch (err) {
        setError(
          "Failed to load data. Please check your network connection and if the API is running."
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [loggedInUser]);

  // Handle direct access via shareable link
  useEffect(() => {
    if (proposals.length === 0) return; // Don't run if proposals are not loaded yet
    const params = new URLSearchParams(window.location.search);
    const getParamAsInt = (
      paramName: string,
      defaultValue: number = 0
    ): number => {
      const value = params.get(paramName);
      // Check if value exists, if so, parse it, otherwise return the default
      return value ? parseInt(value, 10) : defaultValue;
    };

    // Usage:
    const proposalIdFromUrl = getParamAsInt("proposal");
    if (proposalIdFromUrl) {
      const proposalToOpen = proposals.find(
        (p) => p.proposalId === proposalIdFromUrl
      );
      if (proposalToOpen) {
        setSelectedProposal(proposalToOpen);
      }
    }
  }, [proposals]);

  // Filtering Logic
  const filteredProposals = useMemo(() => {
    return proposals.filter((p) => {
      const proposalDate = new Date(p.submittedDate);
      const matchesSearch =
        searchTerm === "" ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.proposer?.name.toLowerCase().includes(searchTerm.toLowerCase());
      // p.proposalId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "" || p.status === statusFilter;
      const matchesType = typeFilter === "" || p.type === typeFilter;
      const matchesStartDate =
        startDate === "" || proposalDate >= new Date(startDate);
      const matchesEndDate =
        endDate === "" || proposalDate <= new Date(endDate);
      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [proposals, searchTerm, statusFilter, typeFilter, startDate, endDate]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("");
    setTypeFilter("");
    setStartDate("");
    setEndDate("");
  }, []);

  // Handlers
  const handleNavigate = (page: "dashboard" | "stats" | "users") =>
    setCurrentPage(page);
  const handleSelectProposal = (proposal: Proposal) =>
    setSelectedProposal(proposal);
  const handleCloseDetailModal = () => setSelectedProposal(null);

  const handleOpenFormModal = (
    mode: "new" | "edit" | "resubmit",
    data?: Proposal
  ) => setFormModalState({ isOpen: true, mode, data });
  const handleOpenUserFormModal = (mode: "new" | "edit", data?: User) =>
    setUserFormModalState({ isOpen: true, mode, data });

  
  const handleCloseModals = () => {
    setFormModalState({ isOpen: false, mode: "new" });
    setUserFormModalState({ isOpen: false, mode: "new" });
    setConfirmationModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSaveProposal = async (
    proposalData: Omit<
      Proposal,
      | "proposalId"
      | "id"
      | "status"
      | "submittedDate"
      | "proposerId"
      | "approvalHistory"
    >,
    mode: "new" | "edit" | "resubmit",
    proposalId?: number,
    attachments?: File[]
  ) => {
    if (!currentUser) return;

    if (mode === "new") {
      const newProposal = await createProposal({
        ...proposalData,
        proposerId: currentUser.id,
        status: ProposalStatus.ACCOUNTANT_REVIEW,
        approvalHistory: [],
        createdBy: currentUser.email,
        modifiedBy: currentUser.email,
      });

      if (attachments) {
        const uploadResponse: ProposalAttachmentUploadResponse =
          await uploadProposalAttachments(newProposal.id, attachments);
      }

      setProposals((prev) => [newProposal, ...prev]);
      addToast(
        `Đã tạo đề xuất thành công!`,
        "success"
      );
    } else if (proposalId) {
      setProposals((prev) =>
        prev.map((p) => {
          if (p.proposalId === proposalId) {
            const updatedProposal = { ...p, ...proposalData };
            if (mode === "resubmit") {
              updatedProposal.status = ProposalStatus.ACCOUNTANT_REVIEW;
              updatedProposal.approvalHistory = { data: [] };
            }
            return updatedProposal;
          }
          return p;
        })
      );
    }

    handleCloseModals();
  };

  const handleSaveUser = (
    userData: Omit<User, "id">,
    mode: "new" | "edit",
    userId?: number
  ) => {
    if (mode === "new") {
      const newUser: User = { ...userData, id: userId ?? 993 };
      setUsers((prev) => [...prev, newUser]);
    } else if (userId) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, ...userData } : u))
      );
    }
    handleCloseModals();
  };

  const handleDeleteUser = (userToDelete: User) => {
    setConfirmationModalState({
      isOpen: true,
      onConfirm: () => {
        const remainingUsers = users.filter((u) => u.id !== userToDelete.id);
        setUsers(remainingUsers);
        if (currentUser && currentUser.id === userToDelete.id) {
          setCurrentUser(remainingUsers.length > 0 ? remainingUsers[0] : null);
        }
        handleCloseModals();
      },
      title: "Delete User",
      message: `Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`,
    });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "stats":
        return <StatsPage proposals={proposals} />;
      case "users":
        return (
          <UsersPage
            users={users}
            onAddUser={() => handleOpenUserFormModal("new")}
            onEditUser={(user) => handleOpenUserFormModal("edit", user)}
            onDeleteUser={handleDeleteUser}
          />
        );
      case "dashboard":
      default:
        return (
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Bảng Đề Xuất
              </h1>
              {currentUser && (
                <button
                  onClick={() => handleOpenFormModal("new")}
                  className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all"
                >
                  <PlusIcon className="w-5 h-5" />
                  New Proposal
                </button>
              )}
            </div>
            <FilterBar
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              startDate={startDate}
              onStartDateChange={setStartDate}
              endDate={endDate}
              onEndDateChange={setEndDate}
              onClearFilters={clearFilters}
            />
            <ProposalList
              proposals={filteredProposals}
              onSelectProposal={handleSelectProposal}
            />
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen font-sans">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <p className="text-xl text-gray-500 dark:text-gray-400 animate-pulse">
              Loading data...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col justify-center items-center h-[50vh] text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-500/30">
            <XCircleIcon className="w-12 h-12 text-red-400 mb-4" />
            <h2 className="text-xl font-bold text-red-700 dark:text-red-300">
              An Error Occurred
            </h2>
            <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
          </div>
        ) : (
          renderPage()
        )}
      </main>

      {selectedProposal && currentUser && (
        <ProposalDetailModal
          proposal={selectedProposal}
          currentUser={currentUser}
          onClose={handleCloseDetailModal}
          onEdit={() => handleOpenFormModal("edit", selectedProposal)}
          onResubmit={() => handleOpenFormModal("resubmit", selectedProposal)}
        />
      )}
      {formModalState.isOpen && currentUser && (
        <ProposalFormModal
          mode={formModalState.mode}
          initialData={formModalState.data}
          currentUser={currentUser}
          onClose={handleCloseModals}
          onSave={handleSaveProposal}
        />
      )}
      {userFormModalState.isOpen && (
        <UserFormModal
          mode={userFormModalState.mode}
          initialData={userFormModalState.data}
          onClose={handleCloseModals}
          onSave={handleSaveUser}
        />
      )}
      <ConfirmationModal
        isOpen={confirmationModalState.isOpen}
        onClose={handleCloseModals}
        onConfirm={confirmationModalState.onConfirm}
        title={confirmationModalState.title}
        message={confirmationModalState.message}
      />
    </div>
  );
};

export default DashboardPage;
