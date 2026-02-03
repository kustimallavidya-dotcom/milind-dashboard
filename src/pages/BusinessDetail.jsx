import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
    ArrowLeft, Save, Plus, Trash2, CheckSquare, Square,
    BrainCircuit, DollarSign, Calendar, Target, Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';

const BusinessDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { businesses, updateBusiness, addTask, toggleTask, deleteTask } = useApp();

    const [business, setBusiness] = useState(null);
    const [activeTab, setActiveTab] = useState('Daily'); // Daily, Weekly, Monthly
    const [newTask, setNewTask] = useState("");
    const [isAiLoading, setIsAiLoading] = useState(false);

    useEffect(() => {
        const found = businesses.find(b => b.id === id);
        if (found) setBusiness(found);
        else navigate('/');
    }, [id, businesses, navigate]);

    if (!business) return null;

    const handleSavePlan = (e) => {
        updateBusiness(business.id, { plan: e.target.value });
    };

    const handleRevenueChange = (e) => {
        updateBusiness(business.id, { revenue: e.target.value });
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;
        addTask(business.id, newTask, 'Medium', activeTab);
        setNewTask("");
    };

    const handleGenerateAiStrategy = () => {
        setIsAiLoading(true);
        setTimeout(() => {
            const ideas = [
                "Leverage micro-influencers for niche targeting.",
                "Implement a subscription tier for recurring revenue.",
                "Bundle products to increase average order value.",
                "Focus on SEO-driven content marketing.",
                "Collaborate with complementary local businesses."
            ];
            const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];
            const currentPlan = business.plan || "";
            updateBusiness(business.id, { plan: currentPlan + `\n\n[AI Setup]: ${randomIdea}` });
            setIsAiLoading(false);
        }, 1500);
    };

    const filteredTasks = business.tasks.filter(t => t.dateType === activeTab);

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={20} /> Back to Command Center
            </button>

            {/* Header Section */}
            <div className="glass-panel p-6 rounded-2xl border-l-4" style={{ borderColor: business.color }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400">{business.category}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{business.name}</h1>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                            <div className="flex items-center gap-1"><Target size={16} /> {business.goal}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-slate-800 text-green-400">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 block">Monthly Revenue</label>
                            <div className="flex items-center text-white font-mono text-xl">
                                ₹ <input
                                    type="number"
                                    value={business.revenue}
                                    onChange={handleRevenueChange}
                                    className="bg-transparent border-none focus:ring-0 w-24 p-0 ml-1 font-bold placeholder-slate-600"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Strategy Column */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Strategic Roadmap */}
                    <div className="glass-panel p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Briefcase size={20} className="text-gold-400" /> Strategic Roadmap
                            </h2>
                            <button
                                onClick={handleGenerateAiStrategy}
                                disabled={isAiLoading}
                                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-sm font-bold hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50"
                            >
                                <BrainCircuit size={16} />
                                {isAiLoading ? 'Analyzing...' : 'AI Strategy'}
                            </button>
                        </div>
                        <textarea
                            value={business.plan}
                            onChange={handleSavePlan}
                            className="w-full h-64 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-300 focus:border-gold-500/50 focus:ring-0 resize-none font-sans leading-relaxed"
                            placeholder="Outline your master plan here..."
                        />
                    </div>

                    {/* Task Manager */}
                    <div className="glass-panel p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <CheckSquare size={20} className="text-gold-400" /> Task Operations
                            </h2>
                            <div className="flex bg-slate-900 p-1 rounded-lg">
                                {['Daily', 'Weekly', 'Monthly'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleAddTask} className="flex gap-2 mb-6">
                            <input
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder={`Add a ${activeTab.toLowerCase()} task...`}
                                className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 focus:border-gold-500/50 focus:outline-none"
                            />
                            <button type="submit" className="bg-gold-500 hover:bg-gold-600 text-slate-900 p-3 rounded-xl transition-colors">
                                <Plus size={24} />
                            </button>
                        </form>

                        <div className="space-y-2">
                            {filteredTasks.length === 0 && (
                                <p className="text-center text-slate-600 py-8 italic">No tasks planned for {activeTab}.</p>
                            )}
                            {filteredTasks.map(task => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${task.isCompleted ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'}`}
                                >
                                    <button
                                        onClick={() => toggleTask(business.id, task.id)}
                                        className={`flex-shrink-0 w-6 h-6 rounded border flex items-center justify-center transition-colors ${task.isCompleted ? 'bg-green-500 border-green-500 text-slate-900' : 'border-slate-500 text-transparent hover:border-gold-400'}`}
                                    >
                                        <CheckSquare size={14} />
                                    </button>
                                    <span className={`flex-1 ${task.isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                        {task.content}
                                    </span>
                                    <button
                                        onClick={() => deleteTask(business.id, task.id)}
                                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Sidebar Info Column */}
                <div className="space-y-6">
                    <div className="glass-panel p-6 rounded-2xl bg-gradient-to-b from-slate-800/40 to-slate-900/40">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400">Completion</span>
                                <span className="text-xl font-bold text-white">{business.completion}%</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-gold-500 h-2 rounded-full" style={{ width: `${business.completion}%` }}></div>
                            </div>

                            <div className="pt-4 border-t border-slate-700/50">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-slate-400">Total Tasks</span>
                                    <span className="text-white font-mono">{business.tasks.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Pending</span>
                                    <span className="text-white font-mono">{business.tasks.filter(t => !t.isCompleted).length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aesthetic Image/Illustration Placeholder */}
                    <div className="glass-panel p-1 rounded-2xl overflow-hidden relative h-48 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/20 to-purple-600/20 mix-blend-overlay z-10"></div>
                        {/* We use a colored block to represent the theme since we don't have images yet */}
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center relative">
                            <div className="absolute inset-0 opacity-20" style={{ backgroundColor: business.color }}></div>
                            <BrainCircuit size={48} className="text-white/20 group-hover:scale-110 transition-transform duration-700" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BusinessDetail;
