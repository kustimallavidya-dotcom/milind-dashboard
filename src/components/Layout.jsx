import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Lightbulb, Zap, Clock, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

const Layout = ({ children }) => {
    const { isFocusMode, setIsFocusMode, businesses, getAllTasks } = useApp();
    const location = useLocation();
    const [showIdeaVault, setShowIdeaVault] = useState(false);
    const [ideaText, setIdeaText] = useState("");

    const todayPending = getAllTasks().filter(t => !t.isCompleted && t.dateType === 'Daily').length;

    return (
        <div className="flex h-screen bg-slate-950 text-white overflow-hidden selection:bg-gold-500/30">

            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col w-64 glass-panel m-4 rounded-2xl border-slate-700/50">
                <div className="p-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center shadow-lg shadow-gold-500/20">
                        <Zap className="text-white" size={24} />
                    </div>
                    <h1 className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        Milind<span className="text-gold-400">Corp</span>
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Command Center" active={location.pathname === '/'} />
                    <NavItem to="/tasks" icon={<CheckSquare size={20} />} label="Master Tasks" active={location.pathname === '/tasks'} badge={todayPending} />
                </nav>

                <div className="p-4">
                    <button
                        onClick={() => setIsFocusMode(!isFocusMode)}
                        className={`w-full flex items-center gap-2 p-3 rounded-xl transition-all duration-300 ${isFocusMode ? 'bg-red-500/20 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'}`}
                    >
                        <Clock size={18} className={isFocusMode ? "animate-pulse" : ""} />
                        <span className="font-medium text-sm">{isFocusMode ? "Focus Active (25:00)" : "Start Focus Mode"}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-16 md:hidden flex items-center justify-between px-4 glass-panel border-b border-slate-700/50 z-20">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-amber-600 flex items-center justify-center">
                            <Zap className="text-white" size={18} />
                        </div>
                        <span className="font-bold text-lg">MilindCorp</span>
                    </div>
                    <button onClick={() => setIsFocusMode(!isFocusMode)} className={`${isFocusMode ? 'text-red-400' : 'text-slate-400'}`}>
                        <Clock size={24} />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto px-4 py-6 md:p-8 relative scroll-smooth">
                    {children}
                </div>

                {/* Mobile Bottom Nav */}
                <nav className="md:hidden glass-panel h-16 flex items-center justify-around px-2 border-t border-slate-700/50 z-20">
                    <MobileNavItem to="/" icon={<LayoutDashboard size={24} />} active={location.pathname === '/'} />
                    <div className="relative">
                        <button
                            onClick={() => setShowIdeaVault(true)}
                            className="w-14 h-14 -mt-8 rounded-full bg-gradient-to-r from-gold-400 to-amber-600 flex items-center justify-center shadow-lg shadow-gold-500/30 text-white transform active:scale-95 transition-transform"
                        >
                            <Lightbulb size={28} />
                        </button>
                    </div>
                    <MobileNavItem to="/tasks" icon={<CheckSquare size={24} />} active={location.pathname === '/tasks'} badge={todayPending} />
                </nav>
            </main>

            {/* Idea Vault Floating Button (Desktop) */}
            <div className="hidden md:block fixed bottom-8 right-8 z-50">
                <button
                    onClick={() => setShowIdeaVault(true)}
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-gold-400 to-amber-600 flex items-center justify-center shadow-lg shadow-gold-500/30 text-white hover:scale-110 transition-transform group"
                >
                    <Lightbulb size={24} className="group-hover:animate-wiggle" />
                </button>
            </div>

            {/* Idea Vault Modal */}
            <AnimatePresence>
                {showIdeaVault && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                        onClick={() => setShowIdeaVault(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md shadow-2xl relative"
                        >
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gold-400">
                                <Lightbulb size={24} /> Idea Vault
                            </h2>
                            <textarea
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-gold-500/50 h-32 resize-none"
                                placeholder="Capture a lightning thought..."
                                value={ideaText}
                                onChange={e => setIdeaText(e.target.value)}
                            />
                            <div className="flex justify-end gap-2 mt-4">
                                <button onClick={() => setShowIdeaVault(false)} className="px-4 py-2 hover:bg-slate-800 rounded-lg text-slate-400">Cancel</button>
                                <button onClick={() => { setIdeaText(""); setShowIdeaVault(false); alert("Idea Saved! (Mock)"); }} className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-slate-900 font-bold rounded-lg flex items-center gap-2">
                                    <Save size={18} /> Save
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

const NavItem = ({ to, icon, label, active, badge }) => (
    <NavLink to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-gradient-to-r from-gold-500/20 to-transparent text-gold-400 border-l-2 border-gold-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
        <span className={`${active ? 'text-gold-400' : 'group-hover:text-white'}`}>{icon}</span>
        <span className="font-medium">{label}</span>
        {badge > 0 && <span className="ml-auto text-xs font-bold bg-gold-500 text-slate-900 px-2 py-0.5 rounded-full">{badge}</span>}
    </NavLink>
);

const MobileNavItem = ({ to, icon, active, badge }) => (
    <NavLink to={to} className={`relative p-2 rounded-xl ${active ? 'text-gold-400 bg-gold-500/10' : 'text-slate-400'}`}>
        {icon}
        {badge > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border border-slate-900">{badge}</span>}
    </NavLink>
)

export default Layout;
