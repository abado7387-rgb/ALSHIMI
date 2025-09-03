
import { Priority, Status } from './types';

export const PRIORITIES = [Priority.Low, Priority.Medium, Priority.High];
export const STATUSES = [Status.Todo, Status.InProgress, Status.Done];

export const PRIORITY_COLORS: { [key in Priority]: string } = {
  [Priority.Low]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  [Priority.Medium]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  [Priority.High]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export const STATUS_COLORS: { [key in Status]: string } = {
  [Status.Todo]: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  [Status.InProgress]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  [Status.Done]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
};

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
