export enum ProposalStatus {
    PENDING = 'Pending',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
  }
  
  export enum ProposalWorkflowStatus {
    ACCOUNTANT_REVIEW = 'Accountant Review',
    MANAGER_REVIEW = 'Manager Review',
    DIRECTOR_REVIEW = 'Director Review',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
  }
  
  
  export enum ProposalType {
    SALARY_BONUS = 'Lương Thưởng',
    MARKETING = 'Marketing',
    SUPPLIES = 'Vật Tư',
    MACHINERY_EQUIPMENT = 'Máy & Dụng Cụ',
    OFFICE = 'Văn Phòng',
    OTHER = 'Khác',
  }
  
  export enum UserRole {
      REQUESTER = 'Requester',
      ACCOUNTANT = 'Accountant',
      MANAGER = 'Manager',
      DIRECTOR = 'Director',
  }
  
  export interface User {
      id: string;
      email: string;
      name: string;
      role: UserRole;
      dept: string;
      managerEmail?: string;
      approvalLimit: number;
  }
  
  export interface ApprovalRecord {
      userId: string;
      userName: string;
      userRole: UserRole;
      status: ProposalWorkflowStatus;
      timestamp: string;
      comment?: string;
  }
  
  export interface Proposal {
    proposalId: string;
    title: string;
    proposerId: string;
    proposer: string;
    organization: string;
    submittedDate: string;
    summary: string;
    fullText: string;
    status: ProposalWorkflowStatus;
    budget: number;
    type: ProposalType;
    rejectionReason?: string;
    approvalHistory: ApprovalRecord[];
    attachment?: {
      name: string;
      size: number;
      type: string;
    };
  }
  
  export interface HistoryEntry {
    id: string;
    proposalTitle: string;
    previousStatus: ProposalStatus | ProposalWorkflowStatus;
    newStatus: ProposalStatus | ProposalWorkflowStatus;
    timestamp: Date;
  }