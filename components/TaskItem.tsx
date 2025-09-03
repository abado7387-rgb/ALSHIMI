import React from 'react';
import { useAppContext } from '../context/AppContext';
import type { Task, Attachment } from '../types';
import { Status } from '../types';
import { PRIORITY_COLORS, STATUS_COLORS } from '../constants';
import { CalendarIcon, EditIcon, TrashIcon, DescriptionIcon, ClockIcon, BellIcon, AttachmentIcon } from './icons/Icons';

interface TaskItemProps {
  task: Task;
  onEdit: () => void;
}

const AttachmentPreview: React.FC<{ attachment: Attachment }> = ({ attachment }) => {
    if (attachment.type.startsWith('image/')) {
        return <img src={attachment.dataUrl} alt={attachment.name} className="w-16 h-16 object-cover rounded-md border border-gray-200 dark:border-gray-600" />;
    }
    if (attachment.type.startsWith('video/')) {
        return (
            <div className="w-16 h-16 rounded-md border border-gray-200 dark:border-gray-600 bg-gray-900 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
            </div>
        );
    }
    return null;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { deleteTask, updateTask } = useAppContext();

  const formattedDate = new Date(task.dueDate + 'T00:00:00').toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  
  const isCompleted = task.status === Status.Done;

  const handleToggleStatus = () => {
    const newStatus = isCompleted ? Status.Todo : Status.Done;
    updateTask({ ...task, status: newStatus });
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between p-5 space-y-4 ${isCompleted ? 'opacity-70' : ''}`}>
        <div>
            <div className="flex justify-between items-start">
                 <div className="flex items-start space-x-3 flex-grow min-w-0">
                    <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={handleToggleStatus}
                        aria-label={`Mark "${task.title}" as ${isCompleted ? 'not completed' : 'completed'}`}
                        className="mt-1.5 h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary-500 dark:bg-gray-700 dark:ring-offset-gray-800 cursor-pointer flex-shrink-0"
                    />
                    <h3 className={`font-bold text-lg text-gray-900 dark:text-white pr-2 break-words ${isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>{task.title}</h3>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${PRIORITY_COLORS[task.priority]}`}>
                        {task.priority}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[task.status]}`}>
                        {task.status}
                    </span>
                </div>
            </div>
            {task.description && (
                <p className={`text-sm text-gray-600 dark:text-gray-400 mt-2 flex items-start pl-8 ${isCompleted ? 'line-through' : ''}`}>
                    <DescriptionIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="break-words">{task.description}</span>
                </p>
            )}
            <div className={`text-sm text-gray-500 dark:text-gray-400 mt-3 flex items-center pl-8 flex-wrap gap-x-4 gap-y-2`}>
                <div className={`flex items-center ${isCompleted ? 'line-through' : ''}`}>
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>{formattedDate}</span>
                </div>
                {task.dueTime && (
                    <div className={`flex items-center ${isCompleted ? 'line-through' : ''}`}>
                        <ClockIcon className="h-4 w-4 mr-2" />
                        <span>{task.dueTime}</span>
                    </div>
                )}
                {task.reminderMinutes && <div className="flex items-center"><BellIcon className="h-4 w-4 text-primary"/></div>}
                {task.attachments && task.attachments.length > 0 && <div className="flex items-center"><AttachmentIcon className="h-4 w-4"/></div>}
            </div>

            {task.attachments && task.attachments.length > 0 && (
                <div className="pl-8 pt-3 mt-3 border-t border-gray-100 dark:border-gray-700/50">
                    <div className="flex flex-wrap gap-2">
                        {task.attachments.map(att => <AttachmentPreview key={att.id} attachment={att} />)}
                    </div>
                </div>
            )}
        </div>

        <div className="flex justify-end items-center space-x-2 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
                onClick={onEdit}
                className="p-2 text-gray-500 hover:text-primary dark:hover:text-primary-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Edit task"
            >
                <EditIcon className="h-5 w-5" />
            </button>
            <button
                onClick={() => deleteTask(task.id)}
                className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Delete task"
            >
                <TrashIcon className="h-5 w-5" />
            </button>
        </div>
    </div>
  );
};