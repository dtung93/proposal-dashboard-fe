import React, { useEffect, useState } from "react";
import { DocumentTextIcon } from "../icons/DocumentTextIcon";
import { useAuth } from "../services/useAuth";
import { LogoutIcon } from "../icons/LogOutIcon";
import { BriefcaseIcon } from "./BriefCaseIcon";
import { BuildingOfficeIcon } from "./BuildingOfficeIcon";
import { getVietnameseRole } from "../services/utilities";
import { XIcon } from "../icons/XIcon";
import { CollectionIcon } from "../icons/CollectionIcon";
import { useConfirmModal } from "../services/ConfirmModalContext";
import { PencilIcon } from "../icons/PencilIcon";
import ChangePasswordModal from "../components/ChangePasswordModal";

interface HeaderProps {
  currentPage: "dashboard" | "stats" | "users";
  onNavigate: (page: "dashboard" | "stats" | "users") => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [changePassOpen, setChangePassOpen] = useState(false);
  const { handleOpenConfirmModal } = useConfirmModal();
  const [isMediumScreen, setIsMediumScreen] = useState(false);

  const handleLogOut = async () => {
    const confirmed = await handleOpenConfirmModal({
      title: "Xác nhận đăng xuất",
      message: "Bạn muốn đăng xuất? ",
      confirmText: "Yes",
      cancelText: "No",
    });
    if (confirmed) {
      logout();
    }
  };

  useEffect(() => {
    const checkScreen = () => {
      const width = window.innerWidth;
      setIsMediumScreen(width >= 768 && width <= 1023);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const navLinkClasses =
    "px-3 py-2 rounded-md text-sm font-medium transition-colors w-full text-left md:w-auto md:text-center";
  const activeLinkClasses =
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300";
  const inactiveLinkClasses =
    "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700";

  const NavButtons = () => (
    <>
      <button
        onClick={() => {
          onNavigate("dashboard");
          setMenuOpen(false);
        }}
        className={`${navLinkClasses} ${
          currentPage === "dashboard" ? activeLinkClasses : inactiveLinkClasses
        }`}
      >
        Dashboard
      </button>

      <button
        onClick={() => {
          onNavigate("stats");
          setMenuOpen(false);
        }}
        className={`${navLinkClasses} ${
          currentPage === "stats" ? activeLinkClasses : inactiveLinkClasses
        }`}
      >
        Statistics & History
      </button>

      <button
        onClick={() => {
          onNavigate("users");
          setMenuOpen(false);
        }}
        className={`${navLinkClasses} ${
          currentPage === "users" ? activeLinkClasses : inactiveLinkClasses
        }`}
      >
        Users
      </button>
    </>
  );

  const MobileUserSection = () => (
    <>
      {user && (
        <div className="px-3 py-2 border-t border-gray-200 dark:border-slate-700 flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            Welcome, {user.name}
          </span>

          <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1.5 truncate">
              <BriefcaseIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">
                {getVietnameseRole(user?.role.name)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <BuildingOfficeIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{user?.dept}</span>
            </div>
          </div>

          <button
            onClick={() => setChangePassOpen(true)}
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold border-2 border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <PencilIcon className="w-4 h-4 flex-shrink-0" />
            Đổi mật khẩu
          </button>

          <button
            onClick={async () => {
              setMenuOpen(false);
              await handleLogOut();
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-300 transition-colors"
          >
            <LogoutIcon className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      <header className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Title */}
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="h-8 w-8 text-indigo-500" />
              <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Proposal Dashboard
              </h1>
            </div>

            {/* --- Desktop Navigation --- */}
            <nav className="hidden md:flex items-center space-x-2 p-1 bg-gray-200/50 dark:bg-slate-900/50 rounded-lg">
              <NavButtons />
            </nav>

            {/* --- Mobile Hamburger --- */}
            <div className="md:hidden relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-lg bg-gray-200/50 dark:bg-slate-900/50"
              >
                {menuOpen ? (
                  <XIcon className="w-6 h-6" />
                ) : (
                  <CollectionIcon className="w-6 h-6" />
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 shadow-lg rounded-lg flex flex-col z-50">
                  <div className="p-2 flex flex-col gap-1">
                    <NavButtons />
                    <MobileUserSection />
                  </div>
                </div>
              )}
            </div>

            {/* Right User Section (Desktop) */}
            <div
              className={`hidden md:flex items-center ${
                !isMediumScreen ? "gap-4" : ""
              } flex-wrap justify-end`}
            >
              {user && (
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px] sm:max-w-none">
                  Welcome, {user.name}
                </span>
              )}

              <div
                className={`flex items-center ${
                  !isMediumScreen ? "gap-4" : ""
                } text-sm text-gray-600 dark:text-gray-400 flex-wrap`}
              >
                <div className="flex items-center gap-1.5 truncate max-w-[120px] sm:max-w-none">
                  <BriefcaseIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">
                    {getVietnameseRole(user?.role.name)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 truncate max-w-[120px] sm:max-w-none">
                  <BuildingOfficeIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{user?.dept}</span>
                </div>
              </div>

              <button
                onClick={() => setChangePassOpen(true)}
                className="flex items-center gap-1 px-2 py-1 text-xs font-semibold border-2 border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                <PencilIcon className="w-4 h-4 flex-shrink-0" />
                <span>Đổi mật khẩu</span>
              </button>

              <button
                onClick={handleLogOut}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg text-gray-600 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-300 transition-colors flex-shrink-0"
                title="Sign Out"
              >
                <LogoutIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <ChangePasswordModal
        isOpen={changePassOpen}
        onClose={() => setChangePassOpen(false)}
        logOut={logout}
      />
    </>
  );
};

export default Header;
