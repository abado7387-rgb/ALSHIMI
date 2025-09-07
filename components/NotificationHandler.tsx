import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Task } from '../types';

export const NotificationHandler = () => {
    const { tasks } = useAppContext();

    useEffect(() => {
        if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        const checkReminders = () => {
            if (Notification.permission !== 'granted') return;

            const now = new Date();

            tasks.forEach((task: Task) => {
                if (task.status === 'Done' || !task.dueTime || !task.reminderMinutes) {
                    return;
                }

                const notificationKey = `notified_${task.id}`;
                const hasBeenNotified = sessionStorage.getItem(notificationKey);

                if (hasBeenNotified) {
                    return;
                }
                
                try {
                    const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
                    const reminderTime = new Date(dueDateTime.getTime() - task.reminderMinutes * 60 * 1000);

                    // Check if reminder time is in the past, but due time is in the future
                    if (now >= reminderTime && now < dueDateTime) {
                        new Notification('Task Reminder', {
                            body: `Your task "${task.title}" is due soon.`,
                            icon: './logo192.png', // Optional: replace with your app's icon
                        });
                        sessionStorage.setItem(notificationKey, 'true');
                    }
                } catch(e) {
                    console.error("Error creating date for notification", e);
                }

            });
        };

        const intervalId = setInterval(checkReminders, 30000); // Check every 30 seconds

        return () => clearInterval(intervalId);
    }, [tasks]);

    return null; // This component does not render anything
};