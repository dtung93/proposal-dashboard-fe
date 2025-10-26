import React from 'react';
import { DocumentTextIcon } from '../icons/DocumentTextIcon';

interface HeaderProps {
  currentPage: 'dashboard' | 'stats' | 'users';
  onNavigate: (page: 'dashboard' | 'stats' | 'users') => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeLinkClasses = "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300";
  const inactiveLinkClasses = "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700";

  return (
    <header className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <DocumentTextIcon className="h-8 w-8 text-indigo-500" />
                <div>
                    <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Proposal Dashboard
                    </h1>
                </div>
            </div>
            <nav className="flex items-center space-x-2 p-1 bg-gray-200/50 dark:bg-slate-900/50 rounded-lg">
                 <button 
                    onClick={() => onNavigate('dashboard')}
                    className={`${navLinkClasses} ${currentPage === 'dashboard' ? activeLinkClasses : inactiveLinkClasses}`}
                 >
                    Dashboard
                 </button>
                 <button 
                    onClick={() => onNavigate('stats')}
                    className={`${navLinkClasses} ${currentPage === 'stats' ? activeLinkClasses : inactiveLinkClasses}`}
                 >
                    Statistics & History
                 </button>
                  <button 
                    onClick={() => onNavigate('users')}
                    className={`${navLinkClasses} ${currentPage === 'users' ? activeLinkClasses : inactiveLinkClasses}`}
                 >
                    Users
                 </button>
            </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;