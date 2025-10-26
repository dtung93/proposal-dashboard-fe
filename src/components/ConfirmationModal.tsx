import React from 'react';
import { XCircleIcon } from '../icons/XCircleIcon';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-900 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col m-4 transform animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex items-start">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20 mr-4">
                <XCircleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-grow">
                <h2 id="confirmation-title" className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">{message}</p>
            </div>
        </div>
        <footer className="p-4 border-t border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 flex justify-end items-center gap-3 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600 border border-gray-300 dark:border-slate-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-white bg-red-600 hover:bg-red-700"
          >
            Confirm
          </button>
        </footer>
         <style>{`
           @keyframes scale-in {
            from { transform: scale(0.95) translateY(10px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
          }
          .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
        `}</style>
      </div>
    </div>
  );
};

export default ConfirmationModal;
