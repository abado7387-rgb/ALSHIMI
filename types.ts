export enum Priority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export enum Status {
  Todo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done',
}

export interface Attachment {
  id: string;
  name: string;
  type: string; // MIME type
  dataUrl: string;
}

export interface Task {
  id:string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: Priority;
  status: Status;
  attachments?: Attachment[];
  reminderMinutes?: number;
}

export enum View {
    List = 'List',
    Calendar = 'Calendar',
}

export interface AppContextType {
    tasks: Task[];
    addTask: (task: Omit<Task, 'id'>) => void;
    updateTask: (task: Task) => void;
    deleteTask: (id: string) => void;
    getTasksForDate: (date: string) => Task[];
}