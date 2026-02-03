import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialBusinesses } from '../data/initialData';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [businesses, setBusinesses] = useState(() => {
        const saved = localStorage.getItem('milind-dashboard-data');
        return saved ? JSON.parse(saved) : initialBusinesses;
    });

    const [isFocusMode, setIsFocusMode] = useState(false);
    const [activeIdeaId, setActiveIdeaId] = useState(null); // For connecting ideas to business

    useEffect(() => {
        localStorage.setItem('milind-dashboard-data', JSON.stringify(businesses));
    }, [businesses]);

    // Business Actions
    const updateBusiness = (id, updates) => {
        setBusinesses(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    };

    const cleanReset = () => {
        if (confirm("Are you sure? This will wipe all data and reset to default.")) {
            setBusinesses(initialBusinesses);
        }
    }

    // Task Actions
    const addTask = (businessId, taskContent, priority = 'Medium', dateType = 'Daily') => {
        const newTask = {
            id: uuidv4(),
            content: taskContent,
            priority, // High, Medium, Low
            dateType, // Daily, Weekly, Monthly
            isCompleted: false,
            createdAt: new Date().toISOString()
        };

        setBusinesses(prev => prev.map(b => {
            if (b.id === businessId) {
                // Auto update progress if needed, simple logic:
                return { ...b, tasks: [newTask, ...b.tasks] };
            }
            return b;
        }));
    };

    const toggleTask = (businessId, taskId) => {
        setBusinesses(prev => prev.map(b => {
            if (b.id === businessId) {
                const newTasks = b.tasks.map(t =>
                    t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
                );
                // Calculate new completion/health based on tasks? 
                // Or keep completion manual? Prompt says "Auto-update... based on completed tasks".
                // Let's do a simple ratio for now if tasks exist.

                let completion = b.completion;
                if (newTasks.length > 0) {
                    const completed = newTasks.filter(t => t.isCompleted).length;
                    // Weighted? No, simple.
                    // But 'completion' was Business Goal %, distinct from Task %. 
                    // Let's update a separate 'taskProgress' or mix them. 
                    // For now, let's just complete the task. The user can manually edit the main "Completion %" for the big goal.
                    // Or we strictly follow: "Auto-update the Main Dashboard's progress percentage based on completed tasks."
                    // Okay, let's try to infer progress.
                    completion = Math.round((completed / newTasks.length) * 100);
                }

                return { ...b, tasks: newTasks, completion: newTasks.length > 0 ? completion : b.completion };
            }
            return b;
        }));
    };

    const deleteTask = (businessId, taskId) => {
        setBusinesses(prev => prev.map(b => {
            if (b.id === businessId) {
                return { ...b, tasks: b.tasks.filter(t => t.id !== taskId) };
            }
            return b;
        }));
    };

    const getTotalRevenue = () => {
        return businesses.reduce((acc, b) => acc + (parseFloat(b.revenue) || 0), 0);
    };

    const getAllTasks = () => {
        let all = [];
        businesses.forEach(b => {
            b.tasks.forEach(t => {
                all.push({ ...t, businessId: b.id, businessName: b.name, color: b.color });
            });
        });
        return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    return (
        <AppContext.Provider value={{
            businesses,
            updateBusiness,
            addTask,
            toggleTask,
            deleteTask,
            getTotalRevenue,
            getAllTasks,
            isFocusMode,
            setIsFocusMode,
            cleanReset
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
