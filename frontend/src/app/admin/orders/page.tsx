"use client";
import { useState, useEffect } from 'react';
import { getAdminBookings, updateBookingStatus } from '@/lib/api';

export default function OrdersManagement() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        setLoading(true);
        try {
            const data = await getAdminBookings();
            setBookings(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleStatusUpdate = async (id: number, status: string) => {
        await updateBookingStatus(id, status);
        fetchBookings();
    };

    if (loading) return <div>Loading orders...</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold text-secondary mb-8">Customer Bookings</h1>

            <div className="bg-white rounded-3xl shadow-sm overflow-x-auto">
                <table className="w-full text-left min-w-[1000px]">
                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Cake</th>
                            <th className="px-6 py-4">Delivery</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {bookings.map((order: any) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 text-sm">
                                    <div className="font-bold">{order.delivery_date}</div>
                                    <div className="text-gray-400">{order.delivery_time}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold">{order.customer_name}</div>
                                    <div className="text-sm text-blue-600">{order.phone_number}</div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="font-bold">{order.cake_name} ({order.weight})</div>
                                    <div className="text-gray-500 italic">"{order.message_on_cake}"</div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${order.delivery_option === 'delivery' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                        {order.delivery_option}
                                    </span>
                                    {order.address && <div className="mt-1 text-gray-500 max-w-xs truncate">{order.address}</div>}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                        order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                                        'bg-orange-100 text-orange-700'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={order.status} 
                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                        className="text-sm border rounded-lg p-1"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
