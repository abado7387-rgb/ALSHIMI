
import React from 'react';
import { PlusIcon } from './icons/Icons';

interface AddTaskButtonProps {
    onClick: () => void;
}

export const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-8 right-8 bg-primary hover:bg-primary-700 text-white font-bold w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
            aria-label="Add new task"
        >
            <PlusIcon className="h-7 w-7" />
        </button>
    );
}
