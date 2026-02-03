import React from 'react';
import { useApp } from '../context/AppContext';
import BusinessCard from '../components/BusinessCard';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = () => {
    const { businesses, getTotalRevenue, getAllTasks } = useApp();

    const totalRevenue = getTotalRevenue();
    const allTasks = getAllTasks();
    const pendingTasks = allTasks.filter(t => !t.isCompleted).length;
    // Calculate average completion
    const avgCompletion = Math.round(businesses.reduce((acc, b) => acc + (b.completion || 0), 0) / businesses.length);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const chartData = businesses.map(b => ({
        name: b.name.split(' ')[0], // Short name
        completion: b.completion,
        color: b.color
    }));

    return (
        <div className="space-y-8 pb-20 md:pb-0">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Potential Revenue"
                    value={`₹${totalRevenue.toLocaleString()}`}
                    icon={<TrendingUp size={24} className="text-green-400" />}
                    subtitle="Across 10 Verticals"
                    color="border-green-500/20 bg-green-500/5"
                />
                <StatCard
                    title="Empire Health"
                    value={`${avgCompletion}%`}
                    icon={<AlertCircle size={24} className="text-gold-400" />}
                    subtitle="Overall Goal Completion"
                    color="border-gold-500/20 bg-gold-500/5"
                />
                <StatCard
                    title="Pending Actions"
                    value={pendingTasks}
                    icon={<CheckCircle size={24} className="text-blue-400" />}
                    subtitle="Tasks awaiting attention"
                    color="border-blue-500/20 bg-blue-500/5"
                />
            </div>

            {/* Analytics Chart */}
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-6">Performance Distribution</h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#64748b" fileName="false" tick={{ fill: '#94a3b8', fontSize: 10 }} interval={0} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                                itemStyle={{ color: '#fff' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="completion" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-8 bg-gold-500 rounded-full"></span>
                    Business Verticals
                </h2>
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {businesses.map(business => (
                        <BusinessCard key={business.id} business={business} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, subtitle, color }) => (
    <div className={`p-6 rounded-2xl glass-card border ${color} flex items-center justify-between group`}>
        <div>
            <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-white group-hover:scale-105 transition-transform origin-left">{value}</h3>
            <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700/50">
            {icon}
        </div>
    </div>
);

export default Dashboard;
