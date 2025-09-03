
import React, { createContext, useContext, ReactNode } from 'react';
import { useTasks } from '../hooks/useTasks';
import type { AppContextType } from '../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const taskManager = useTasks();

  return (
    <AppContext.Provider value={taskManager}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
