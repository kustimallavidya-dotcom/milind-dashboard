import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckSquare, Filter, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AllTasks = () => {
    const { getAllTasks, toggleTask } = useApp();
    const [filter, setFilter] = useState('All'); // All, Daily, Weekly, Monthly

    const allTasks = getAllTasks();

    const filteredTasks = allTasks.filter(t => {
        if (filter === 'All') return true;
        return t.dateType === filter;
    });

    return (
        <div className="max-w-4xl mx-auto pb-20 md:pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <CheckSquare size={32} className="text-gold-400" />
                        Master Task List
                    </h1>
                    <p className="text-slate-400 mt-1">Aggregated view across all 10 verticals</p>
                </div>

                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700/50">
                    {['All', 'Daily', 'Weekly', 'Monthly'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f ? 'bg-gold-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-3">
                {filteredTasks.length === 0 && (
                    <div className="text-center py-20 text-slate-600 glass-panel rounded-2xl">
                        <Filter size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No tasks found for this filter.</p>
                    </div>
                )}

                <AnimatePresence>
                    {filteredTasks.map(task => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`glass-panel p-4 rounded-xl flex items-center gap-4 transition-all hover:border-slate-600 ${task.isCompleted ? 'opacity-50' : ''}`}
                            style={{ borderLeft: `4px solid ${task.color}` }}
                        >
                            <button
                                onClick={() => toggleTask(task.businessId, task.id)}
                                className={`flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-colors ${task.isCompleted ? 'bg-green-500 border-green-500 text-slate-900' : 'border-slate-500 hover:border-gold-400'}`}
                            >
                                <CheckSquare size={14} />
                            </button>

                            <div className="flex-1">
                                <p className={`font-medium ${task.isCompleted ? 'text-slate-500 line-through' : 'text-white'}`}>{task.content}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50">
                                        {task.businessName}
                                    </span>
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <Calendar size={10} /> {task.dateType}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AllTasks;
