import React, { useState, useEffect } from "react";
import { Proposal, ProposalType, ProposalTypeLabels, User } from "../types";
import { CloseIcon } from "../icons/CloseIcon";
import { PlusIcon } from "../icons/PlusIcon";
import { PaperClipIcon } from "../icons/PaperClipIcon";
import { PencilIcon } from "../icons/PencilIcon";
import { XIcon } from "../icons/XIcon";
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE_MB,
  MAX_FILES,
  MAX_TOTAL_SIZE_MB,
} from "../constants";
import { useToast } from "../services/useToast";
import { useConfirmModal } from "../services/ConfirmModalContext";

interface ProposalFormModalProps {
  mode: "new" | "edit" | "resubmit";
  initialData?: Proposal;
  currentUser: User;
  onClose: () => void;
  onSave: (
    proposalData: Omit<
      Proposal,
      | "id"
      | "proposalId"
      | "status"
      | "submittedDate"
      | "proposerId"
      | "approvalHistory"
    >,
    mode: "new" | "edit" | "resubmit",
    proposalId?: number,
    attachments?: File[]
  ) => void;
}

const ProposalFormModal: React.FC<ProposalFormModalProps> = ({
  mode,
  initialData,
  currentUser,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState("");
  const [proposer, setProposer] = useState<User | null>(null);
  const [dept, setDept] = useState("");
  const [budget, setBudget] = useState("");
  const [type, setType] = useState<ProposalType>(ProposalType.Other);
  const [summary, setSummary] = useState("");
  const [fullText, setFullText] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const { handleOpenConfirmModal } = useConfirmModal();

  const { addToast } = useToast();

  useEffect(() => {
    if (mode === "new") {
      setProposer(currentUser.name as any);
      setDept(currentUser.dept);
    }
    if (initialData) {
      setTitle(initialData.title);
      setProposer(initialData.proposer);
      setDept(initialData.dept);
      setBudget(initialData.budget.toString());
      setType(initialData.type);
      setSummary(initialData.summary);
      setFullText(initialData.fullText);
    }
  }, [initialData, mode, currentUser]);

  const isFormValid =
    title && proposer && dept && budget && summary && fullText;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const confirmed = await handleOpenConfirmModal({
      title:
        mode === "new"
          ? "Gửi Đề Xuất"
          : mode === "edit"
          ? "Save Changes"
          : "Duyệt Đề Xuất",
      message:
        mode === "new"
          ? "Xác nhận gửi đề xuất"
          : mode === "edit"
          ? "Are you sure you want to save changes?"
          : "Are you sure you want to re-submit this proposal?",
      confirmText: "Yes",
      cancelText: "No",
    });

    if (confirmed) {
      const proposalData: Omit<
        Proposal,
        | "id"
        | "proposalId"
        | "status"
        | "submittedDate"
        | "proposerId"
        | "approvalHistory"
      > = {
        title,
        proposer,
        dept,
        deptId: currentUser.deptId,
        budget: Number(budget),
        type,
        summary,
        fullText,
      };
      proposalData.type = getTypeKey(proposalData.type) as ProposalType;
      onSave(proposalData, mode, initialData?.proposalId, attachments);
    } else {
      onClose();
    }
  };

  function getTypeKey(type: string): String {
    switch (type) {
      case "Lương Thưởng":
        return "Salary_Bonus";
      case "Marketing":
        return "Marketing";
      case "Vật Tư":
        return "Supplies";
      case "Máy & Dụng Cụ":
        return "Machinery_Equipment";
      case "Văn Phòng":
        return "Office";
      case "Khác":
        return "Other";
      default:
        throw new Error(`Unknown type label: ${type}`);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);
    const newAttachments = [...attachments, ...selectedFiles];

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

    // All checks passed, update attachments
    setAttachments(newAttachments);
    e.target.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col m-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === "new"
              ? "Bảng Tạo Đề Xuất Mới"
              : mode === "edit"
              ? "Edit Proposal"
              : "Edit and Re-submit Proposal"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-grow overflow-hidden"
        >
          <main className="p-6 flex-grow overflow-y-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tên Đề Xuất
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              {/* Proposer */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Người đề xuất
                </label>
                <input
                  type="text"
                  value={currentUser ? currentUser.name : ""}
                  readOnly
                  className="form-input read-only:bg-gray-100 dark:read-only:bg-slate-700"
                />
              </div>

              {/* Department */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bộ Phận
                </label>
                <input
                  readOnly
                  type="text"
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              {/* Budget */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ngân Sách (VND)
                </label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min="0"
                  required
                  className="form-input"
                />
              </div>

              {/* Type */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Mục
                </label>
                <select
                  value={type} // this is the enum key
                  onChange={(e) => setType(e.target.value as ProposalType)}
                  className="form-input"
                >
                  {Object.entries(ProposalTypeLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sơ Lược
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                required
                className="form-input"
              />
            </div>

            {/* Full Text */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nội Dung
              </label>
              <textarea
                value={fullText}
                onChange={(e) => setFullText(e.target.value)}
                rows={6}
                required
                className="form-input"
              />
            </div>

            {/* Attachments */}
            <div className="flex flex-col gap-2">
              <label className="cursor-pointer flex items-center gap-1">
                <PaperClipIcon className="w-5 h-5" /> File đính kèm
                <input
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                />
              </label>

              <div className="flex flex-wrap gap-1">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded"
                  >
                    <span className="truncate max-w-xs text-sm">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                    >
                      <XIcon className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="p-6 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600"
            >
              Hủy
            </button>
            {/* <button
              type="submit"
              disabled={!isFormValid}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === "new" ? (
                <PlusIcon className="w-5 h-5" />
              ) : (
                <PencilIcon className="w-5 h-5" />
              )}
              {mode === "new"
                ? "Gửi yêu cầu"
                : mode === "edit"
                ? "Save Changes"
                : "Re-submit Proposal"}
            </button> */}
            <button
              type="button"
              disabled={!isFormValid}
              onClick={handleSubmit}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === "new" ? (
                <PlusIcon className="w-5 h-5" />
              ) : (
                <PencilIcon className="w-5 h-5" />
              )}
              {mode === "new"
                ? "Gửi yêu cầu"
                : mode === "edit"
                ? "Save Changes"
                : "Re-submit Proposal"}
            </button>
          </footer>
        </form>
      </div>

      <style>{`
        .form-input {
          display: block;
          width: 100%;
          padding: 0.625rem 0.75rem;
          border: 1px solid rgb(209 213 219);
          border-radius: 0.5rem;
          background-color: rgb(249 250 251);
          color: rgb(17 24 39);
          transition: all 0.2s;
        }
        .dark .form-input {
          border-color: rgb(51 65 85);
          background-color: rgb(15 23 42);
          color: rgb(226 232 240);
        }
        .form-input:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          box-shadow: 0 0 0 2px rgb(99 102 241);
          border-color: rgb(99 102 241);
        }
      `}</style>
    </div>
  );
};

export default ProposalFormModal;
