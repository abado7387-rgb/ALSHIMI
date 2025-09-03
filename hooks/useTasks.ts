
import { useState, useEffect, useCallback } from 'react';
import type { Task } from '../types';
import { Priority, Status } from '../types';

const getInitialTasks = (): Task[] => {
    try {
        const item = window.localStorage.getItem('tasks');
        if (item) {
            return JSON.parse(item);
        }
    } catch (error) {
        console.error("Error reading tasks from localStorage", error);
    }

    // Return sample data if localStorage is empty or fails
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2)

    return [
        { id: '1', title: 'Design the new dashboard', description: 'Create mockups for the new dashboard design in Figma.', dueDate: today.toISOString().split('T')[0], dueTime: '14:00', reminderMinutes: 15, priority: Priority.High, status: Status.InProgress, attachments: [] },
        { id: '2', title: 'Develop the API endpoints', description: 'Set up the necessary API endpoints for task management.', dueDate: tomorrow.toISOString().split('T')[0], priority: Priority.High, status: Status.Todo },
        { id: '3', title: 'Review PR from John', description: 'Go through the pull request for the new authentication feature.', dueDate: today.toISOString().split('T')[0], dueTime: '10:30', priority: Priority.Medium, status: Status.Todo },
        { id: '4', title: 'Weekly team meeting', description: 'Prepare slides for the weekly sync-up.', dueDate: dayAfter.toISOString().split('T')[0], priority: Priority.Low, status: Status.Todo },
        { id: '5', title: 'Fix bug #1024', description: 'Investigate and fix the critical bug reported by QA.', dueDate: today.toISOString().split('T')[0], priority: Priority.High, status: Status.Done },
    ];
};


export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks);

  useEffect(() => {
    try {
        // A simple check to prevent storing massive amounts of data
        if (JSON.stringify(tasks).length > 4 * 1024 * 1024) { // 4MB limit
             console.warn("Tasks data is getting large, attachments might not be saved correctly.");
        }
      window.localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks to localStorage", error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert("Could not save tasks. Storage limit exceeded. Please remove some attachments from your tasks.");
      }
    }
  }, [tasks]);

  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    setTasks(prevTasks => [...prevTasks, { ...task, id: new Date().toISOString() }]);
  }, []);

  const updateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks => prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  const getTasksForDate = useCallback((date: string): Task[] => {
    return tasks.filter(task => task.dueDate === date);
  }, [tasks]);


  return { tasks, addTask, updateTask, deleteTask, getTasksForDate };
};