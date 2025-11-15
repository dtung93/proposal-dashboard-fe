import React, { useEffect, useState } from "react";
import { ToastType } from "../services/ToastContext";
import { CheckCircleIcon } from "../icons/CheckCircleIcon";
import { XCircleIcon } from "../icons/XCircleIcon";
import { InfoIcon } from "../icons/InfoIcon";
import { CloseIcon } from "../icons/CloseIcon";

interface ToastProps {
  message: string;
  type: ToastType;
  onDismiss: () => void;
}

const toastConfig = {
  success: {
    icon: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
    bg: "bg-green-50 dark:bg-green-900/50",
    border: "border-green-300 dark:border-green-700",
    text: "text-green-800 dark:text-green-200",
  },
  error: {
    icon: <XCircleIcon className="w-6 h-6 text-red-500" />,
    bg: "bg-red-50 dark:bg-red-900/50",
    border: "border-red-300 dark:border-red-700",
    text: "text-red-800 dark:text-red-200",
  },
  info: {
    icon: <InfoIcon className="w-6 h-6 text-blue-500" />,
    bg: "bg-blue-50 dark:bg-blue-900/50",
    border: "border-blue-300 dark:border-blue-700",
    text: "text-blue-800 dark:text-blue-200",
  },
};

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    setShow(false);
    // Allow time for fade-out animation before removing from DOM
    setTimeout(onDismiss, 300);
  };

  const config = toastConfig[type];

  return (
    <div
      className={`
            w-full max-w-sm p-4 rounded-lg shadow-lg border-l-4 flex items-start gap-3 transition-all duration-300
            ${config.bg} ${config.border} ${config.text}
            ${show ? "animate-toast-in" : "animate-toast-out"}
          `}
      role="alert"
    >
      <div className="flex-shrink-0">{config.icon}</div>
      <div className="flex-grow text-sm font-semibold">{message}</div>
      <button
        onClick={handleDismiss}
        className="ml-auto -mr-1 -mt-1 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
        aria-label="Dismiss"
      >
        <CloseIcon className="w-5 h-5" />
      </button>
      <style>{`
              @keyframes toast-in {
                from { opacity: 0; transform: translateX(100%); }
                to { opacity: 1; transform: translateX(0); }
              }
              .animate-toast-in { animation: toast-in 0.3s ease-out forwards; }

              @keyframes toast-out {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(100%); }
              }
              .animate-toast-out { animation: toast-out 0.3s ease-in forwards; }
            `}</style>
    </div>
  );
};

export default Toast;
