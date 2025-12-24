import React from 'react';
import { useUserStats } from '../../hooks/useUserStats';

const StatsGrid: React.FC = () => {
    const { stats, loading } = useUserStats();

    const displayClients = loading ? '--' : (stats?.clients_count !== undefined ? stats.clients_count : '--');
    const displayPlans = loading ? '--' : (stats?.plans_count !== undefined ? stats.plans_count : '--');

    return (
        <section className="relative z-10 px-4 mb-8">
            <div className="bg-white rounded-[24px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex justify-around">
                <div className="text-center flex-1 border-r border-gray-100">
                    <div className="text-2xl font-black text-gray-900">{displayClients}</div>
                    <div className="text-xs font-bold text-gray-400 mt-0.5">累计客户</div>
                </div>
                <div className="text-center flex-1 border-r border-gray-100">
                    <div className="text-2xl font-black text-gray-900">{displayPlans}</div>
                    <div className="text-xs font-bold text-gray-400 mt-0.5">生成方案</div>
                </div>
                <div className="text-center flex-1">
                    <div className="text-2xl font-black text-gray-900">未知</div>
                    <div className="text-xs font-bold text-gray-400 mt-0.5">节省时间</div>
                </div>
            </div>
        </section>
    );
};

export default StatsGrid;
