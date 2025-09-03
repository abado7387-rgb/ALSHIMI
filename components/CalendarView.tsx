
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { DAY_NAMES, PRIORITY_COLORS } from '../constants';
import type { Task } from '../types';
import { ChevronLeftIcon, ChevronRightIcon } from './icons/Icons';

interface CalendarViewProps {
  onEditTask: (task: Task) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onEditTask }) => {
  const { getTasksForDate } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }
    return days;
  }, [currentDate, startingDay, daysInMonth]);

  const changeMonth = (offset: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };
  
  const isToday = (date: Date) => {
      const today = new Date();
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear();
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeftIcon className="h-6 w-6" /></button>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRightIcon className="h-6 w-6" /></button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-sm text-gray-600 dark:text-gray-400 mb-2">
        {DAY_NAMES.map(day => <div key={day}>{day}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (!day) return <div key={`empty-${index}`} className="border border-gray-200 dark:border-gray-700 rounded-md min-h-[120px]"></div>;

          const dateString = day.toISOString().split('T')[0];
          const tasksForDay = getTasksForDate(dateString);

          return (
            <div key={dateString} className="border border-gray-200 dark:border-gray-700 rounded-md min-h-[120px] p-2 flex flex-col">
              <span className={`font-semibold ${isToday(day) ? 'bg-primary text-white rounded-full w-7 h-7 flex items-center justify-center' : ''}`}>
                {day.getDate()}
              </span>
              <div className="mt-1 space-y-1 overflow-y-auto">
                {tasksForDay.slice(0, 3).map(task => (
                  <div key={task.id} onClick={() => onEditTask(task)} className={`p-1 rounded-md text-xs cursor-pointer truncate ${PRIORITY_COLORS[task.priority]}`}>
                    {task.title}
                  </div>
                ))}
                 {tasksForDay.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        + {tasksForDay.length - 3} more
                    </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
