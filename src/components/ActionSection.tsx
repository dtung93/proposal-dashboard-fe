import { useState } from "react";
import { PaperClipIcon } from "../icons/PaperClipIcon";
import { XIcon } from "../icons/XIcon";
import { CheckIcon } from "../icons/CheckIcon";
import {
  ActionType,
  ProcessRequest,
  Proposal,
  ProposalAttachmentUploadResponse,
  ProposalStatus,
  User,
  UserRole,
} from "../types";
import {
  processApprovalRequest,
  uploadProposalAttachments,
} from "../services/api";
import { useToast } from "../services/useToast";
import {
  disabledProcessButton,
  getVietnameseStatus,
  isDisabled,
} from "../services/utilities";
import { useConfirmModal } from "../services/ConfirmModalContext";
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE_MB,
  MAX_FILES,
  MAX_TOTAL_SIZE_MB,
} from "../constants";

interface ActionSectionProps {
  onAttachmentsChange?: (files: File[]) => void;
  currentUser: User;
  actionComment: string;
  proposal: Proposal;
  onClose: () => void;
}

const ActionSection: React.FC<ActionSectionProps> = ({
  onAttachmentsChange,
  currentUser,
  actionComment,
  proposal,
  onClose,
}) => {
  const { addToast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const { handleOpenConfirmModal } = useConfirmModal();

  const handleProcessRequest = async (action: ActionType): Promise<void> => {
    const confirmed = await handleOpenConfirmModal({
      title: "Xử Lý Đề Xuất",
      message: "Xác nhận xử lý đề xuất",
      confirmText: "Yes",
      cancelText: "No",
    });
    if (confirmed) {
      if (files?.length && files.length > 0) {
        const fileNames = files.map((f) => f.name).join(", ");

        actionComment += `\n\n.  --- Đã gửi: ${fileNames}`;
      }
      const processRequest: ProcessRequest = {
        name: currentUser.name,
        roleName: currentUser.role.name,
        userId: currentUser.id,
        request: {
          proposalId: proposal.id,
          action,
          comment: actionComment,
        },
      };

      const updatedProposal = await processApprovalRequest(processRequest);
      if (updatedProposal) {
        if (files?.length && files.length > 0) {
          const uploadResponse: ProposalAttachmentUploadResponse =
            await uploadProposalAttachments(updatedProposal.id, files);
        }
        addToast(`Xử lý đề xuất thành công!`, "success");
      }
      onClose();
    } else {
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const newAttachments = [...selectedFiles];

    // Filter by allowed extensions
    const invalidFiles = selectedFiles.filter((file) => {
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      return !ALLOWED_FILE_TYPES.includes(ext);
    });

    if (invalidFiles.length > 0) {
      addToast(
        `Các định dạng cho phép file Excel, Word, PDF hoặc ảnh`,
        "error"
      );
      e.target.value = "";
      return;
    }
    if (newAttachments.length > MAX_FILES) {
      addToast(`Đính kèm tối đa ${MAX_TOTAL_SIZE_MB} file`, "error");
      e.target.value = "";
      return;
    }

    // Check per-file size
    const oversizedFiles = selectedFiles.filter(
      (f) => f.size > MAX_FILE_SIZE_MB * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      addToast(`Dung lượng file tối đa ${MAX_FILE_SIZE_MB}MB`, "error");
      e.target.value = "";
      return;
    }

    // Check total size
    const totalSizeMB =
      newAttachments.reduce((sum, f) => sum + f.size, 0) / (1024 * 1024);
    if (totalSizeMB > MAX_TOTAL_SIZE_MB) {
      addToast(`Tổng dung lượng file vượt quá ${MAX_TOTAL_SIZE_MB}MB`, "error");
      e.target.value = "";
      return;
    }

    const newFiles = [...files, ...Array.from(e.target.files)];
    setFiles(newFiles);
    onAttachmentsChange?.(newFiles);
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onAttachmentsChange?.(updated);
  };

  return isDisabled(proposal.status) ||
    currentUser.role.name === UserRole.STAFF ? (
    <div className="mt-4 w-full bg-gray-200/50 backdrop-blur-sm text-gray-700 font-bold text-center py-2 rounded">
      <div className="flex justify-center items-center gap-1 text-lg font-bold">
        {getVietnameseStatus(proposal.status)}
        {proposal.status.toString().includes("Rejected") ? (
          <XIcon className="w-5 h-5 text-red-500" />
        ) : (
          <CheckIcon className="w-5 h-5 text-green-500" />
        )}
      </div>
    </div>
  ) : (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
        <label className="action-button secondary-button flex items-center gap-1 cursor-pointer">
          <PaperClipIcon className="w-5 h-5" />
          File đính kèm
          <input
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
        </label>

        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0 max-w-full">
            {files.map((file, index) => (
              <div
                key={index}
                className="relative flex items-center gap-2 bg-gray-100 dark:bg-slate-700 rounded-lg px-3 py-1 shadow-sm"
              >
                <span className="text-xs truncate max-w-[10rem] text-gray-700 dark:text-gray-300">
                  {file.name}
                </span>

                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition"
                  title="Remove file"
                >
                  <XIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Buttons Section */}
      <div className="flex gap-3 w-full sm:w-auto justify-end mt-2 sm:mt-0">
        <button
          type="button"
          onClick={() => handleProcessRequest(ActionType.REJECT)}
          className="action-button reject-button flex items-center justify-center gap-2 min-w-[120px] px-4 py-2 text-sm font-medium rounded-lg"
        >
          <XIcon className="w-5 h-5" /> Từ chối
        </button>

        <button
          type="button"
          onClick={() => handleProcessRequest(ActionType.APPROVE)}
          className="action-button approve-button flex items-center justify-center gap-2 min-w-[120px] px-4 py-2 text-sm font-medium rounded-lg"
        >
          <CheckIcon className="w-5 h-5" /> Duyệt
        </button>
      </div>
    </div>
  );
};

export default ActionSection;
