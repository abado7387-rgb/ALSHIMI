
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { PRIORITIES, STATUSES } from '../constants';
import { Priority, Status, Attachment } from '../types';
import type { Task } from '../types';
import { XCircleIcon } from './icons/Icons';

interface TaskFormModalProps {
  task: Task | null;
  onClose: () => void;
}

const REMINDER_OPTIONS = [
    { label: 'No reminder', value: 0 },
    { label: '5 minutes before', value: 5 },
    { label: '15 minutes before', value: 15 },
    { label: '30 minutes before', value: 30 },
    { label: '1 hour before', value: 60 },
];

export const TaskFormModal: React.FC<TaskFormModalProps> = ({ task, onClose }) => {
  const { addTask, updateTask } = useAppContext();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(task?.dueDate || new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState(task?.dueTime || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || Priority.Medium);
  const [status, setStatus] = useState<Status>(task?.status || Status.Todo);
  const [reminderMinutes, setReminderMinutes] = useState(task?.reminderMinutes || 0);
  const [attachments, setAttachments] = useState<Attachment[]>(task?.attachments || []);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        setError('');
        const files = Array.from(e.target.files);
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB

        files.forEach(file => {
            if (file.size > MAX_SIZE) {
                setError(`File "${file.name}" is too large. Max size is 5MB.`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const newAttachment: Attachment = {
                    id: new Date().toISOString() + file.name,
                    name: file.name,
                    type: file.type,
                    dataUrl: event.target?.result as string,
                };
                setAttachments(prev => [...prev, newAttachment]);
            };
            reader.readAsDataURL(file);
        });
    }
  };
  
  const removeAttachment = (id: string) => {
      setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const taskData = { 
        title, 
        description, 
        dueDate, 
        dueTime: dueTime || undefined,
        priority, 
        status,
        reminderMinutes: reminderMinutes > 0 ? reminderMinutes : undefined,
        attachments
    };
    if (task) {
      updateTask({ ...taskData, id: task.id });
    } else {
      addTask(taskData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{task ? 'Edit Task' : 'Add New Task'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Time (Optional)</label>
              <input
                id="dueTime"
                type="time"
                value={dueTime}
                onChange={e => setDueTime(e.target.value)}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
                <select id="priority" value={priority} onChange={e => setPriority(e.target.value as Priority)} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary">
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select id="status" value={status} onChange={e => setStatus(e.target.value as Status)} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary">
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
              <label htmlFor="reminder" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reminder</label>
              <select id="reminder" value={reminderMinutes} onChange={e => setReminderMinutes(Number(e.target.value))} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary">
                  {REMINDER_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Attachments</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-primary hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 dark:ring-offset-gray-800 focus-within:ring-primary">
                            <span>Upload files</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*,video/*" onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Images and videos up to 5MB</p>
                </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {attachments.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {attachments.map(att => (
                        <div key={att.id} className="relative group">
                            {att.type.startsWith('image/') ? (
                                <img src={att.dataUrl} alt={att.name} className="h-24 w-full object-cover rounded-md" />
                            ) : (
                                <div className="h-24 w-full rounded-md bg-gray-800 flex flex-col items-center justify-center p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                                    <span className="text-xs text-white truncate w-full text-center mt-1">{att.name}</span>
                                </div>
                            )}
                            <button type="button" onClick={() => removeAttachment(att.id)} className="absolute top-0 right-0 -mt-2 -mr-2 bg-white dark:bg-gray-600 rounded-full p-0.5 text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                <XCircleIcon className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
          </div>
          <div className="pt-4 flex justify-end space-x-3 sticky bottom-0 bg-white dark:bg-gray-800 py-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 transition-colors"
            >
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};