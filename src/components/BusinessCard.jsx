import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    BookOpen, Smartphone, Music, GraduationCap, Youtube,
    Train, Palette, Dumbbell, Trophy, Clapperboard, Briefcase, ArrowRight
} from 'lucide-react';

const iconMap = {
    'BookOpen': BookOpen,
    'Smartphone': Smartphone,
    'Music': Music,
    'GraduationCap': GraduationCap,
    'Youtube': Youtube,
    'Train': Train,
    'Palette': Palette,
    'Dumbbell': Dumbbell,
    'Trophy': Trophy,
    'Clapperboard': Clapperboard,
};

const BusinessCard = ({ business }) => {
    const navigate = useNavigate();
    const Icon = iconMap[business.icon] || Briefcase;

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={item}
            whileHover={{ y: -5 }}
            onClick={() => navigate(`/business/${business.id}`)}
            className="glass-card rounded-2xl p-6 cursor-pointer relative overflow-hidden group"
        >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full -mr-10 -mt-10 blur-2xl group-hover:from-gold-500/10 transition-colors duration-500"></div>

            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-gold-400 group-hover:text-white group-hover:bg-gold-500 transition-all duration-300 shadow-lg shadow-black/20">
                    <Icon size={24} />
                </div>
                <div className="relative w-12 h-12 flex items-center justify-center">
                    {/* Circular Progress (Approximate visual) */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                        <circle cx="24" cy="24" r="18" stroke={business.color} strokeWidth="4" fill="transparent"
                            strokeDasharray={113} strokeDashoffset={113 - (113 * business.completion) / 100}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <span className="absolute text-[10px] font-bold">{business.completion}%</span>
                </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-1 leading-tight group-hover:text-gold-400 transition-colors">{business.name}</h3>
            <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold mb-4">{business.category}</p>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500"></div>
                    <span>Goal: {business.goal}</span>
                </div>
                {business.tasks.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                        <span>{business.tasks.filter(t => !t.isCompleted).length} tasks pending</span>
                    </div>
                )}
            </div>

            <div className="mt-6 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs text-gold-500 font-bold uppercase tracking-wider">View Strategy</span>
                <ArrowRight size={16} className="text-gold-500" />
            </div>
        </motion.div>
    );
};

export default BusinessCard;
