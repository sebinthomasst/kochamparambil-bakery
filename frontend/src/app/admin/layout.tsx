"use client";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token && pathname !== '/admin/login') {
            router.push('/admin/login');
        } else if (token) {
            setIsLoggedIn(true);
        }
    }, [pathname, router]);

    if (pathname === '/admin/login') return <>{children}</>;
    if (!isLoggedIn) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;

    const navItems = [
        { label: 'Dashboard', href: '/admin', icon: '📊' },
        { label: 'Cake Menu', href: '/admin/cakes', icon: '🎂' },
        { label: 'Orders', href: '/admin/orders', icon: '🧾' },
        { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-secondary text-white p-6 md:fixed md:h-full z-20">
                <div className="mb-10 text-center md:text-left">
                    <h2 className="text-2xl font-bold">Admin Panel</h2>
                    <p className="text-primary text-xs mt-1">Bakery Management</p>
                </div>
                
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <Link 
                            key={item.href} 
                            href={item.href}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${pathname === item.href ? 'bg-primary text-secondary font-bold' : 'hover:bg-white hover:bg-opacity-10 text-gray-300'}`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto pt-10">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-red-300 hover:bg-red-500 hover:bg-opacity-10 transition"
                    >
                        <span>logout</span>
                        <span>Sign Out</span>
                    </button>
                    <Link href="/" className="block mt-4 text-center text-xs text-gray-500 hover:text-white">
                        View Live Website
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-6 md:p-12">
                {children}
            </main>
        </div>
    );
}
