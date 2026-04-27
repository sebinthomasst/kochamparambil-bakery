"use client";
import { useEffect, useState } from 'react';
import { getAdminBookings, getCakes } from '@/lib/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        totalCakes: 0,
    });

    useEffect(() => {
        async function fetchStats() {
            try {
                const [bookings, cakes] = await Promise.all([
                    getAdminBookings(),
                    getCakes()
                ]);
                setStats({
                    totalOrders: bookings.length,
                    pendingOrders: bookings.filter((b: any) => b.status === 'pending').length,
                    totalCakes: cakes.length
                });
            } catch (err) {
                console.error("Error fetching stats:", err);
            }
        }
        fetchStats();
    }, []);

    const cards = [
        { label: 'Total Bookings', value: stats.totalOrders, icon: '🧾', color: 'bg-blue-500' },
        { label: 'Pending Orders', value: stats.pendingOrders, icon: '⏳', color: 'bg-orange-500' },
        { label: 'Cakes in Menu', value: stats.totalCakes, icon: '🎂', color: 'bg-pink-500' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-secondary mb-8">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-3xl shadow-sm p-8 flex items-center space-x-6">
                        <div className={`${card.color} text-white w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-gray-500 font-medium">{card.label}</p>
                            <p className="text-3xl font-bold text-secondary">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-xl font-bold text-secondary mb-6">Recent Activity</h2>
                <p className="text-gray-500 italic">No recent activity to show.</p>
            </div>
        </div>
    );
}
