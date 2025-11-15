import React from 'react';
import { ProposalType, ProposalStatus } from '../types';
import { SearchIcon } from '../icons/SearchIcon';
import DateRangeFilter from './DateRangeFilter';

interface FilterBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  onClearFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
    searchTerm, onSearchTermChange, 
    statusFilter, onStatusFilterChange,
    typeFilter, onTypeFilterChange,
    startDate, onStartDateChange,
    endDate, onEndDateChange,
    onClearFilters
}) => {
  return (
    <div className="mb-8 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative lg:col-span-2">
                <label htmlFor="search-proposals" className="sr-only">Search proposals</label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    id="search-proposals"
                    type="text"
                    placeholder="Tìm kiếm theo tên đề xuất, người đề xuất, trạng thái..."
                    value={searchTerm}
                    onChange={(e) => onSearchTermChange(e.target.value)}
                    className="form-input pl-10"
                />
            </div>

            {/* Status Filter */}
            <div>
                <label htmlFor="status-filter" className="sr-only">Filter by status</label>
                <select 
                    id="status-filter"
                    value={statusFilter} 
                    onChange={(e) => onStatusFilterChange(e.target.value)}
                    className="form-input"
                >
                    <option value="">Tình trạng</option>
                    {Object.values(ProposalStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            {/* Type Filter */}
            <div>
                <label htmlFor="type-filter" className="sr-only">Kiểu</label>
                <select 
                    id="type-filter"
                    value={typeFilter}
                    onChange={(e) => onTypeFilterChange(e.target.value)}
                    className="form-input"
                >
                    <option value="">Mục</option>
                    {Object.values(ProposalType).map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
        </div>
        <div className="mt-4 flex flex-col md:flex-row justify-between items-center gap-4">
             <DateRangeFilter 
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={onStartDateChange}
                onEndDateChange={onEndDateChange}
             />
             <button onClick={onClearFilters} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
                Clear All Filters
            </button>
        </div>
         <style>{`
          .form-input {
              display: block;
              width: 100%;
              padding: 0.625rem 0.75rem;
              border: 1px solid;
              border-color: rgb(209 213 219 / 1);
              border-radius: 0.5rem;
              background-color: rgb(249 250 251 / 1);
              color: rgb(17 24 39 / 1);
              transition: all 0.2s;
          }
          .dark .form-input {
              border-color: rgb(51 65 85 / 1);
              background-color: rgb(30 41 59 / 1);
              color: rgb(226 232 240 / 1);
          }
          .form-input:focus {
              outline: 2px solid transparent;
              outline-offset: 2px;
              --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
              --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
              box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
              border-color: rgb(99 102 241 / 1);
              --tw-ring-color: rgb(99 102 241 / 1);
          }
        `}</style>
    </div>
  );
};

export default FilterBar;
