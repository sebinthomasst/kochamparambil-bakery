"use client";
import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '@/lib/api';

export default function SettingsManagement() {
    const [settings, setSettings] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        async function fetchSettings() {
            const data = await getSettings();
            setSettings(data);
        }
        fetchSettings();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await updateSettings(settings);
            setMessage('Settings updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            alert('Failed to update settings');
        } finally {
            setSubmitting(false);
        }
    };

    if (!settings) return <div>Loading settings...</div>;

    return (
        <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-secondary mb-8">Website Settings</h1>

            {message && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 border border-green-100">
                    ✅ {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm p-8 space-y-6">
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Bakery Name</label>
                    <input type="text" name="bakery_name" value={settings.bakery_name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary transition" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Phone Number</label>
                        <input type="text" name="phone" value={settings.phone || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary transition" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">WhatsApp Number</label>
                        <input type="text" name="whatsapp" value={settings.whatsapp || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary transition" />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-gray-700">Instagram Link</label>
                        <input type="text" name="instagram" value={settings.instagram || ''} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary transition" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Email Address</label>
                    <input type="email" name="email" value={settings.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary transition" />
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Bakery Address</label>
                    <textarea name="address" value={settings.address} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary transition"></textarea>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Opening Hours</label>
                    <input type="text" name="hours" value={settings.hours} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary transition" />
                </div>

                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={submitting}
                        className={`btn-primary w-full md:w-auto px-12 ${submitting ? 'bg-gray-400' : ''}`}
                    >
                        {submitting ? 'Saving...' : 'Save All Settings'}
                    </button>
                </div>
            </form>
        </div>
    );
}
