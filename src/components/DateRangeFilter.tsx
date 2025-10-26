import React from 'react';
import { CalendarDaysIcon } from '../icons/CalendarDaysIcon';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
        <div className="relative w-full sm:w-auto">
            <label htmlFor="start-date" className="sr-only">Start Date</label>
            <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="form-input pl-3 pr-2 py-2"
            />
        </div>
        <span className="text-gray-500 dark:text-gray-400 hidden sm:block">-</span>
        <div className="relative w-full sm:w-auto">
             <label htmlFor="end-date" className="sr-only">End Date</label>
             <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                min={startDate}
                className="form-input pl-3 pr-2 py-2"
            />
        </div>
         <style>{`
          .form-input {
              display: block;
              width: 100%;
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

export default DateRangeFilter;
