import React, { createContext, useContext, useState, ReactNode } from "react";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmContextType {
  handleOpenConfirmModal: (options: ConfirmOptions) => Promise<boolean>;
}

interface ConfirmState extends ConfirmOptions {
  isOpen: boolean;
  resolve?: (result: boolean) => void;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirmModal = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};

export const ConfirmProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false,
    message: "",
  });

  const handleOpenConfirmModal = (options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ isOpen: true, ...options, resolve });
    });
  };

  const handleConfirm = () => {
    confirmState.resolve?.(true);
    setConfirmState({ ...confirmState, isOpen: false, resolve: undefined });
  };

  const handleCancel = () => {
    confirmState.resolve?.(false);
    setConfirmState({ ...confirmState, isOpen: false, resolve: undefined });
  };

  return (
    <ConfirmContext.Provider value={{ handleOpenConfirmModal }}>
      {children}

      {confirmState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg max-w-sm sm:max-w-md w-full p-6 text-center transform transition-all duration-200 scale-95 animate-fade-in">
            {confirmState.title && (
              <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                {confirmState.title}
              </h2>
            )}
            <p className="mb-6 text-sm sm:text-base text-gray-700 dark:text-gray-300">
              {confirmState.message}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-2">
              {/* Cancel Button */}
              <button
                onClick={handleCancel}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-gray-700 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all"
              >
                {confirmState.cancelText || "No"}
              </button>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all"
              >
                {confirmState.confirmText || "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
