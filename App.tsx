
import React, { useState, useMemo } from 'react';
import { AppProvider } from './context/AppContext';
import { useDarkMode } from './hooks/useDarkMode';
import { Header } from './components/Header';
import { TaskList } from './components/TaskList';
import { CalendarView } from './components/CalendarView';
import { AddTaskButton } from './components/AddTaskButton';
import { TaskFormModal } from './components/TaskFormModal';
import { NotificationHandler } from './components/NotificationHandler';
import { View } from './types';
import type { Task } from './types';

export default function App() {
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const [currentView, setCurrentView] = useState<View>(View.List);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleOpenModal = (task: Task | null = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTask(null);
    setIsModalOpen(false);
  };

  const appComponent = useMemo(() => {
    return (
      <div className={`min-h-screen font-sans antialiased text-gray-800 dark:text-gray-200 transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
          <Header
            currentView={currentView}
            setCurrentView={setCurrentView}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
          <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {currentView === View.List && <TaskList onEditTask={handleOpenModal} />}
            {currentView === View.Calendar && <CalendarView onEditTask={handleOpenModal} />}
          </main>
          <AddTaskButton onClick={() => handleOpenModal()} />
          {isModalOpen && <TaskFormModal task={editingTask} onClose={handleCloseModal} />}
        </div>
      </div>
    );
  }, [isDarkMode, currentView, isModalOpen, editingTask, toggleDarkMode]);

  return (
    <AppProvider>
      <NotificationHandler />
      {appComponent}
    </AppProvider>
  );
}