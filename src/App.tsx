import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Proposal, User, HistoryEntry, ProposalWorkflowStatus, UserRole, ProposalType } from './types';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import ProposalList from './components/ProposalList';
import ProposalDetailModal from './components/ProposeDetailModal';
import StatsPage from './pages/StatsPage';
import UsersPage from './pages/UsersPage';
import UserSelector from './components/UserSelector';
import ProposalFormModal from './components/NewProposalModal';
import UserFormModal from './components/UserFormModal';
import ConfirmationModal from './components/ConfirmationModal';
import { PlusIcon } from './icons/PlusIcon';

// Mock Data is now defined directly in the file
const initialUsers: User[] = [
    { id: 'user-requester', name: 'Anh Nguyễn', email: 'anh.nguyen@example.com', role: UserRole.REQUESTER, dept: 'Marketing', approvalLimit: 0 },
    { id: 'user-accountant', name: 'Bình Trần', email: 'binh.tran@example.com', role: UserRole.ACCOUNTANT, dept: 'Finance', approvalLimit: 50000000 },
    { id: 'user-manager', name: 'Chi Lê', email: 'chi.le@example.com', role: UserRole.MANAGER, dept: 'Marketing', managerEmail: 'dung.pham@example.com', approvalLimit: 200000000 },
    { id: 'user-director', name: 'Dũng Phạm', email: 'dung.pham@example.com', role: UserRole.DIRECTOR, dept: 'Executive', approvalLimit: 10000000000 },
];
const initialProposals: Proposal[] = [
    {
      proposalId: 'PROP-2401',
      title: 'Chiến dịch Marketing Quý 3/2024',
      proposerId: 'user-requester',
      proposer: 'Anh Nguyễn',
      organization: 'Phòng Marketing',
      submittedDate: '2024-07-01',
      summary: 'Đề xuất kế hoạch và ngân sách cho các hoạt động marketing trong Quý 3, tập trung vào việc ra mắt sản phẩm mới và tăng nhận diện thương hiệu.',
      fullText: 'Nội dung chi tiết của đề xuất bao gồm phân tích thị trường, mục tiêu, chiến lược triển khai trên các kênh digital, và dự kiến kết quả.',
      status: ProposalWorkflowStatus.MANAGER_REVIEW,
      budget: 180000000,
      type: ProposalType.MARKETING,
      approvalHistory: [
        { userId: 'user-accountant', userName: 'Bình Trần', userRole: UserRole.ACCOUNTANT, status: ProposalWorkflowStatus.MANAGER_REVIEW, timestamp: '2024-07-02T10:00:00Z', comment: 'Ngân sách hợp lệ, đã kiểm tra.'},
      ],
      attachment: { name: 'Marketing_Plan_Q3.pdf', size: 2560000, type: 'application/pdf' }
    },
     {
      proposalId: 'PROP-2402',
      title: 'Mua sắm vật tư văn phòng',
      proposerId: 'user-requester',
      proposer: 'Anh Nguyễn',
      organization: 'Phòng Hành chính',
      submittedDate: '2024-07-05',
      summary: 'Đề xuất mua sắm vật tư văn phòng cần thiết cho quý 3, bao gồm giấy, mực in, và các dụng cụ khác.',
      fullText: 'Danh sách chi tiết các vật tư cần mua và báo giá từ nhà cung cấp được đính kèm.',
      status: ProposalWorkflowStatus.ACCOUNTANT_REVIEW,
      budget: 25000000,
      type: ProposalType.SUPPLIES,
      approvalHistory: [],
    },
    {
      proposalId: 'PROP-2403',
      title: 'Đề xuất thưởng hiệu suất cho nhân viên',
      proposerId: 'user-requester',
      proposer: 'Anh Nguyễn',
      organization: 'Phòng Nhân sự',
      submittedDate: '2024-06-20',
      summary: 'Đề xuất chính sách thưởng dựa trên hiệu suất công việc của nhân viên trong nửa đầu năm 2024.',
      fullText: 'Chính sách này nhằm mục đích ghi nhận và khuyến khích những đóng góp xuất sắc của nhân viên, góp phần thúc đẩy động lực làm việc.',
      status: ProposalWorkflowStatus.REJECTED,
      budget: 500000000,
      type: ProposalType.SALARY_BONUS,
      rejectionReason: 'Ngân sách hiện tại không đủ. Vui lòng điều chỉnh lại chính sách hoặc đợi đến kỳ đánh giá tiếp theo.',
      approvalHistory: [
        { userId: 'user-accountant', userName: 'Bình Trần', userRole: UserRole.ACCOUNTANT, status: ProposalWorkflowStatus.MANAGER_REVIEW, timestamp: '2024-06-21T11:00:00Z', comment: 'Ngân sách lớn, cần manager xem xét kỹ.' },
        { userId: 'user-manager', userName: 'Chi Lê', userRole: UserRole.MANAGER, status: ProposalWorkflowStatus.REJECTED, timestamp: '2024-06-22T15:00:00Z', comment: 'Ngân sách hiện tại không đủ. Vui lòng điều chỉnh lại chính sách hoặc đợi đến kỳ đánh giá tiếp theo.' }
      ],
    },
];

const App: React.FC = () => {
  // Page Navigation State
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'stats' | 'users'>('dashboard');

  // Data State
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0]);

  // Dashboard Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modal State
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [formModalState, setFormModalState] = useState<{ isOpen: boolean; mode: 'new' | 'edit' | 'resubmit'; data?: Proposal; }>({ isOpen: false, mode: 'new' });
  const [userFormModalState, setUserFormModalState] = useState<{ isOpen: boolean; mode: 'new' | 'edit'; data?: User; }>({ isOpen: false, mode: 'new' });
  const [confirmationModalState, setConfirmationModalState] = useState<{ isOpen: boolean; onConfirm: () => void; title: string; message: string; }>({ isOpen: false, onConfirm: () => {}, title: '', message: '' });

  // Handle direct access via shareable link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const proposalIdFromUrl = params.get('proposal');
    if (proposalIdFromUrl) {
      const proposalToOpen = proposals.find(p => p.proposalId === proposalIdFromUrl);
      if (proposalToOpen) {
        setSelectedProposal(proposalToOpen);
      }
    }
  }, [proposals]);

  // Filtering Logic
  const filteredProposals = useMemo(() => {
    return proposals.filter(p => {
      const proposalDate = new Date(p.submittedDate);
      const matchesSearch = searchTerm === '' ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.proposer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.proposalId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === '' || p.status === statusFilter;
      const matchesType = typeFilter === '' || p.type === typeFilter;
      const matchesStartDate = startDate === '' || proposalDate >= new Date(startDate);
      const matchesEndDate = endDate === '' || proposalDate <= new Date(endDate);
      return matchesSearch && matchesStatus && matchesType && matchesStartDate && matchesEndDate;
    });
  }, [proposals, searchTerm, statusFilter, typeFilter, startDate, endDate]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('');
    setTypeFilter('');
    setStartDate('');
    setEndDate('');
  }, []);

  // Handlers
  const handleNavigate = (page: 'dashboard' | 'stats' | 'users') => setCurrentPage(page);
  const handleSelectProposal = (proposal: Proposal) => setSelectedProposal(proposal);
  const handleCloseDetailModal = () => setSelectedProposal(null);
  
  const handleOpenFormModal = (mode: 'new' | 'edit' | 'resubmit', data?: Proposal) => setFormModalState({ isOpen: true, mode, data });
  const handleOpenUserFormModal = (mode: 'new' | 'edit', data?: User) => setUserFormModalState({ isOpen: true, mode, data });
  const handleCloseModals = () => {
      setFormModalState({ isOpen: false, mode: 'new' });
      setUserFormModalState({ isOpen: false, mode: 'new' });
      setConfirmationModalState(prev => ({ ...prev, isOpen: false }));
  };

  const addHistoryEntry = (proposalTitle: string, previousStatus: ProposalWorkflowStatus, newStatus: ProposalWorkflowStatus) => {
    setHistory(prev => [{
      id: `hist-${Date.now()}`,
      proposalTitle,
      previousStatus,
      newStatus,
      timestamp: new Date()
    }, ...prev]);
  };

  const handleSaveProposal = (
    proposalData: Omit<Proposal, 'proposalId' | 'status' | 'submittedDate' | 'proposerId' | 'approvalHistory'>,
    mode: 'new' | 'edit' | 'resubmit',
    proposalId?: string
  ) => {
    if (mode === 'new') {
        const newProposal: Proposal = {
            ...proposalData,
            proposalId: `PROP-${Date.now()}`,
            proposerId: currentUser.id,
            submittedDate: new Date().toISOString().split('T')[0],
            status: ProposalWorkflowStatus.ACCOUNTANT_REVIEW,
            approvalHistory: [],
        };
        setProposals(prev => [newProposal, ...prev]);
    } else if (proposalId) {
        setProposals(prev => prev.map(p => {
            if (p.proposalId === proposalId) {
                const updatedProposal = { ...p, ...proposalData };
                if (mode === 'resubmit') {
                    updatedProposal.status = ProposalWorkflowStatus.ACCOUNTANT_REVIEW;
                    updatedProposal.rejectionReason = undefined;
                    updatedProposal.approvalHistory = [];
                    addHistoryEntry(updatedProposal.title, p.status, updatedProposal.status);
                }
                return updatedProposal;
            }
            return p;
        }));
    }
    handleCloseModals();
  };

  const handleSaveUser = (userData: Omit<User, 'id'>, mode: 'new' | 'edit', userId?: string) => {
    if (mode === 'new') {
        const newUser: User = { ...userData, id: `user-${Date.now()}` };
        setUsers(prev => [...prev, newUser]);
    } else if (userId) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...userData } : u));
    }
    handleCloseModals();
  };

  const handleDeleteUser = (userToDelete: User) => {
    setConfirmationModalState({
        isOpen: true,
        onConfirm: () => {
            setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
            if(currentUser.id === userToDelete.id) {
                setCurrentUser(users[0]);
            }
            handleCloseModals();
        },
        title: 'Delete User',
        message: `Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`
    });
  };

  const handleAdvanceWorkflow = (proposalId: string, action: 'approve' | 'confirm' | 'reject', comment: string) => {
    setProposals(prev => prev.map(p => {
        if (p.proposalId === proposalId) {
            const oldStatus = p.status;
            let nextStatus = oldStatus;
            
            if (action === 'reject') {
                nextStatus = ProposalWorkflowStatus.REJECTED;
            } else {
                 switch(oldStatus) {
                    case ProposalWorkflowStatus.ACCOUNTANT_REVIEW: nextStatus = ProposalWorkflowStatus.MANAGER_REVIEW; break;
                    case ProposalWorkflowStatus.MANAGER_REVIEW: nextStatus = ProposalWorkflowStatus.DIRECTOR_REVIEW; break;
                    case ProposalWorkflowStatus.DIRECTOR_REVIEW: nextStatus = ProposalWorkflowStatus.APPROVED; break;
                }
            }
            
            const newHistoryRecord = { 
                userId: currentUser.id, 
                userName: currentUser.name, 
                userRole: currentUser.role, 
                status: nextStatus, 
                timestamp: new Date().toISOString(), 
                comment: comment || undefined 
            };

            addHistoryEntry(p.title, oldStatus, nextStatus);

            return { 
                ...p, 
                status: nextStatus, 
                approvalHistory: [...p.approvalHistory, newHistoryRecord],
                ...(nextStatus === ProposalWorkflowStatus.REJECTED && { rejectionReason: comment })
            };
        }
        return p;
    }));
    handleCloseDetailModal();
  };
  
  const renderPage = () => {
    switch (currentPage) {
      case 'stats':
        return <StatsPage proposals={proposals} history={history} />;
      case 'users':
        return <UsersPage users={users} onAddUser={() => handleOpenUserFormModal('new')} onEditUser={(user) => handleOpenUserFormModal('edit', user)} onDeleteUser={handleDeleteUser} />;
      case 'dashboard':
      default:
        return (
          <>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Proposals Dashboard</h1>
                 {currentUser.role === UserRole.REQUESTER && (
                    <button
                        onClick={() => handleOpenFormModal('new')}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all"
                    >
                        <PlusIcon className="w-5 h-5"/>
                        New Proposal
                    </button>
                 )}
            </div>
            <UserSelector users={users} currentUser={currentUser} onUserChange={setCurrentUser} />
            <FilterBar
              searchTerm={searchTerm} onSearchTermChange={setSearchTerm}
              statusFilter={statusFilter} onStatusFilterChange={setStatusFilter}
              typeFilter={typeFilter} onTypeFilterChange={setTypeFilter}
              startDate={startDate} onStartDateChange={setStartDate}
              endDate={endDate} onEndDateChange={setEndDate}
              onClearFilters={clearFilters}
            />
            <ProposalList proposals={filteredProposals} onSelectProposal={handleSelectProposal} />
          </>
        );
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen font-sans">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>

      {selectedProposal && (
        <ProposalDetailModal
          proposal={selectedProposal}
          currentUser={currentUser}
          onClose={handleCloseDetailModal}
          onAdvanceWorkflow={handleAdvanceWorkflow}
          onEdit={() => handleOpenFormModal('edit', selectedProposal)}
          onResubmit={() => handleOpenFormModal('resubmit', selectedProposal)}
        />
      )}
      {formModalState.isOpen && (
        <ProposalFormModal
            mode={formModalState.mode}
            initialData={formModalState.data}
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

export default App;