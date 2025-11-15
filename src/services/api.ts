import {
  AttachmentResponse,
  CreateProposalRequest,
  ProcessRequest,
  Proposal,
  ProposalAttachmentUploadResponse,
  ProposalStatus,
  User,
} from "../types";
import localApi from "./apiConfig";

interface LoginCredentials {
  email: string;
  password: string;
}

export enum ApiStatus {
  FAILED = "Failed",
  SUCCESS = "Success",
}

interface AuthResponse {
  access_token: string;
}

// Generic response wrapper from the backend
interface ApiResponse<T> {
  data: T;
  status: ApiStatus;
  code: number;
  message: string;
}

export interface ApprovalRecordResponse {
  status?: ProposalStatus;
  reviewer?: string | null;
  comment?: string | null;
  role?: string;
  date?: Date;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// --- Auth Endpoints --
export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const response = await localApi.post<ApiResponse<AuthResponse>>(
    "/auth/login",
    credentials
  );
  return response.data.data;
}

export async function getMe(): Promise<User> {
  const response = await localApi.get<ApiResponse<User>>("/user/me");
  return response.data.data;
}

export async function loginAsGuest(): Promise<AuthResponse> {
  const response = await localApi.post<ApiResponse<AuthResponse>>(
    "/auth/guest"
  );
  return response.data.data;
}

export async function getProposals(): Promise<Proposal[]> {
  const response = await localApi.get<ApiResponse<Proposal[]>>("/proposal/all");
  return response.data.data;
}

export async function getUsers(): Promise<User[]> {
  const response = await localApi.get<ApiResponse<User[]>>("/user/all");
  return response.data.data;
}

export async function createProposal(
  request: CreateProposalRequest
): Promise<Proposal> {
  const response = await localApi.post<ApiResponse<Proposal>>(
    "/proposal/create",
    request,
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  );
  return response.data.data;
}

export async function getApprovals(
  proposalId: number
): Promise<ApprovalRecordResponse[]> {
  const response = await localApi.get<ApiResponse<ApprovalRecordResponse[]>>(
    `/approval/history/${proposalId}`
  );
  return response.data.data;
}

export async function uploadProposalAttachments(
  proposalId: number,
  files: File[]
): Promise<ProposalAttachmentUploadResponse> {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await localApi.post<ProposalAttachmentUploadResponse>(
    `/attachment/upload/${proposalId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function getAttachmentsByProposal(
  proposalId: number
): Promise<AttachmentResponse[]> {
  const response = await localApi.get<ApiResponse<AttachmentResponse[]>>(
    `/attachment/attachments/${proposalId}`
  );
  return response.data.data;
}

export async function processApprovalRequest(
  request: ProcessRequest
): Promise<Proposal> {
  const response = await localApi.post<ApiResponse<Proposal>>(
    "/proposal/process-request",
    request,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
}

export async function changePassword(
  request: ChangePasswordRequest
): Promise<User> {
  const response = await localApi.put<ApiResponse<User>>(
    "/user/change-password",
    request,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
}
