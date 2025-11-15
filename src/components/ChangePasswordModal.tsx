import React, { useState } from "react";
import { CloseIcon } from "../icons/CloseIcon";
import { PencilIcon } from "../icons/PencilIcon";
import { useConfirmModal } from "../services/ConfirmModalContext";
import { changePassword } from "../services/api";
import { useToast } from "../services/useToast";
import { getServerMessage } from "../services/utilities";
import { EyeToggleIcon } from "../icons/EyeToggleIcon";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  logOut: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  logOut,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { handleOpenConfirmModal } = useConfirmModal();
  const { addToast } = useToast();

  const isFormValid = currentPassword.length > 0 && newPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const confirmed = await handleOpenConfirmModal({
      title: "Xác nhận đổi mật khẩu",
      message: "Bạn có chắc chắn muốn đổi mật khẩu không?",
      confirmText: "Yes",
      cancelText: "No",
    });

    if (confirmed) {
      if (newPassword !== confirmPassword) {
        addToast("Mật khẩu mới không chính xác", "error");
        resetAllPasswordStates();
        return;
      }
      try {
        const changePasswordResp = await changePassword({
          currentPassword,
          newPassword,
        });
        if (changePasswordResp) {
          addToast("Mật khẩu đã thay đổi, vui lòng đăng nhập lại", "success");
          setTimeout(() => {
            logOut();
          }, 4000);
        }
      } catch (err: any) {
        const message = getServerMessage(err);
        addToast(message, "error");
        resetAllPasswordStates();
      } finally {
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  const resetAllPasswordStates = () => {
    setNewPassword("");
    setCurrentPassword("");
    setConfirmPassword("");
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col m-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Đổi Mật Khẩu
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
          className="flex flex-col flex-grow overflow-hidden p-6 space-y-4"
        >
          <label className="flex flex-col">
            Mật khẩu hiện tại
            <div className="grid grid-cols-12 gap-2 items-center">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="form-input col-span-11"
              />
              <button
                type="button"
                className="col-span-1 flex justify-center"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
              >
                <EyeToggleIcon
                  open={showCurrentPassword}
                  className="w-5 h-5 text-gray-500"
                />
              </button>
            </div>
          </label>

          <label className="flex flex-col">
            Mật khẩu mới
            <div className="grid grid-cols-12 gap-2 items-center">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="form-input col-span-11"
              />
              <button
                type="button"
                className="col-span-1 flex justify-center"
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                <EyeToggleIcon
                  open={showNewPassword}
                  className="w-5 h-5 text-gray-500"
                />
              </button>
            </div>
          </label>

          <label className="flex flex-col">
            Xác nhận mật khẩu mới
            <div className="grid grid-cols-12 gap-2 items-center">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="form-input col-span-11"
              />
              <button
                type="button"
                className="col-span-1 flex justify-center"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                <EyeToggleIcon
                  open={showConfirmPassword}
                  className="w-5 h-5 text-gray-500"
                />
              </button>
            </div>
          </label>

          {/* Footer */}
          <footer className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-600"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PencilIcon className="w-5 h-5" />
              Đổi Mật Khẩu
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

export default ChangePasswordModal;
