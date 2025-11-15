import React from "react";
import { AuthProvider } from "./services/AuthContext";
import { useAuth } from "./services/useAuth";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/main";
import { ToastProvider } from "./services/ToastContext";
import ToastContainer from "./components/ToastContainer";
import { ConfirmProvider } from "./services/ConfirmModalContext";

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="bg-gray-50 dark:bg-slate-900 min-h-screen flex justify-center items-center">
        <p className="text-xl text-gray-500 dark:text-gray-400 animate-pulse">
          Xác thực user...
        </p>
      </div>
    );
  }

  return isAuthenticated && user ? <DashboardPage /> : <LoginPage />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          {" "}
          {/* <-- wrap here */}
          <ToastContainer />
          <AppContent />
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
