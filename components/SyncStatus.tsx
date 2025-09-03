import React, { useState, useEffect } from 'react';
import { CloudIcon, CloudOffIcon } from './icons/Icons';

export const SyncStatus: React.FC = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setIsSyncing(true);
            // Simulate a sync process after coming back online
            setTimeout(() => setIsSyncing(false), 2000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setIsSyncing(false);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const getStatus = () => {
        if (isSyncing) {
            return {
                text: 'Syncing...',
                icon: <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 dark:border-gray-400"></div>,
                color: 'text-yellow-600 dark:text-yellow-400',
            };
        }
        if (isOnline) {
            return {
                text: 'Synced',
                icon: <CloudIcon className="h-5 w-5" />,
                color: 'text-green-600 dark:text-green-400',
            };
        }
        return {
            text: 'Offline',
            icon: <CloudOffIcon className="h-5 w-5" />,
            color: 'text-gray-500 dark:text-gray-400',
        };
    };

    const status = getStatus();

    return (
        <div className={`flex items-center space-x-2 text-sm font-medium ${status.color}`}>
            {status.icon}
            <span className="hidden md:inline">{status.text}</span>
        </div>
    );
};
