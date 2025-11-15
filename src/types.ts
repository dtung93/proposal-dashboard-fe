import { ApprovalRecordResponse } from "./services/api";

export enum ProposalStatus {
  ACCOUNTANT_REVIEW = "Accountant_Review",
  ACCOUNTANT_REVIEWED = "Accountant_Reviewed",
  ACCOUNTANT_REJECTED = "Accountant_Rejected",
  MANAGER_REVIEW = "Manager_Review",
  MANAGER_REVIEWED = "Manager_Reviewed",
  MANAGER_REJECTED = "Manager_Rejected",
  DIRECTOR_REVIEW = "Director_Review",
  DIRECTOR_REVIEWED = "Director_Reviewed",
  DIRECTOR_REJECTED = "Director_Rejected",
  Approved = "Approved",
  Rejected = "Rejected",
}

export enum ProposalType {
  Salary_Bonus = "Lương Thưởng",
  Marketing = "Marketing",
  Supplies = "Vật Tư",
  Machinery_Equipment = "Máy & Dụng Cụ",
  Office = "Văn Phòng",
  Other = "Khác",
}

export const ProposalTypeLabels: Record<ProposalType, string> = {
  [ProposalType.Salary_Bonus]: "Lương Thưởng",
  [ProposalType.Marketing]: "Marketing",
  [ProposalType.Supplies]: "Vật Tư",
  [ProposalType.Machinery_Equipment]: "Máy & Dụng Cụ",
  [ProposalType.Office]: "Văn Phòng",
  [ProposalType.Other]: "Khác",
};

export enum UserRole {
  STAFF = "Staff",
  ACCOUNTANT = "Accountant",
  MANAGER = "Manager",
  DIRECTOR = "Director",
}

export interface User {
  id: number;
  staffId: string;
  email: string;
  name: string;
  role: any;
  dept: string;
  deptId: number;
  managerId?: string;
}

export interface ApprovalRecord {
  userId: string;
  userName: string;
  userRole: UserRole;
  status: ProposalStatus;
  timestamp: string;
  comment?: string;
}

export interface Proposal {
  id: number;
  proposalId: number;
  title: string;
  proposerId: number;
  proposer: User;
  dept: string;
  deptId: number;
  submittedDate: string;
  summary: string;
  fullText: string;
  status: ProposalStatus;
  budget: number;
  type: ProposalType;
  rejectionReason?: string;
  approvalHistory: {
    data: ApprovalRecordResponse[];
  };
  attachment?: {
    name: string;
    size: number;
    type: string;
  };
}

export interface CreateProposalRequest {
  title: string;
  proposerId: number;
  dept: string;
  summary: string;
  fullText: string;
  status: string;
  budget: number;
  type: string;
  rejectionReason?: string | null;
  approvalHistory?: any;
  createdBy: string;
  modifiedBy: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: any;
  dept: string;
  managerEmail?: string;
  approvalLimit: number;
}

export interface ApprovalRecord {
  userId: string;
  userName: string;
  userRole: UserRole;
  status: ProposalStatus;
  timestamp: string;
  comment?: string;
}

export interface Proposal {
  id: number;
  proposalId: number;
  title: string;
  proposerId: number;
  proposer: User;
  dept: string;
  deptId: number;
  submittedDate: string;
  summary: string;
  fullText: string;
  status: ProposalStatus;
  budget: number;
  type: ProposalType;
  rejectionReason?: string;
  approvalHistory: {
    data: ApprovalRecordResponse[];
  };
  attachment?: {
    name: string;
    size: number;
    type: string;
  };
}

export interface AttachmentResponse {
  filedId: number;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploader: string;
  url: string;
}

export interface Attachment {
  id: number;
  name: string;
  size: number;
  type: string;
  path: string;
  createdBy: string;
  modifiedBy: string;
  proposalId: number;
  proposal?: Proposal;
}

export interface ProposalAttachmentUploadResponse {
  proposalId: number;
  attachments: Attachment[];
}

export interface ProcessRequest {
  name: string;
  roleName: string;
  userId: number;
  request: ApproveProposal;
}

export interface ApproveProposal {
  proposalId: number;
  action: ActionType;
  comment: string;
}

export enum ActionType {
  APPROVE = "approve",
  REJECT = "reject",
}
