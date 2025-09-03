
import React from 'react';
import { PRIORITIES, STATUSES } from '../constants';
import { SearchIcon } from './icons/Icons';
import type { Status, Priority } from '../types';

interface FilterControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: Status | 'all';
  setStatusFilter: (status: Status | 'all') => void;
  priorityFilter: Priority | 'all';
  setPriorityFilter: (priority: Priority | 'all') => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative col-span-1 md:col-span-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-primary focus:border-primary"
          />
        </div>
        <div className="col-span-1">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as Status | 'all')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="col-span-1">
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as Priority | 'all')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Priorities</option>
            {PRIORITIES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
