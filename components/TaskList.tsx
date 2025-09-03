
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { TaskItem } from './TaskItem';
import { FilterControls } from './FilterControls';
import type { Task } from '../types';
import { Status, Priority } from '../types';

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ onEditTask }) => {
  const { tasks } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  return (
    <div className="space-y-6">
      <FilterControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />
      {filteredTasks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} onEdit={() => onEditTask(task)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters or creating a new task.</p>
        </div>
      )}
    </div>
  );
};
