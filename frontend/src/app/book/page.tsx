"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCakes, submitBooking } from '@/lib/api';

function BookingForm() {
    const searchParams = useSearchParams();
    const [cakes, setCakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    
    const [formData, setFormData] = useState({
        customer_name: '',
        phone_number: '',
        email: '',
        cake_id: '',
        weight: '1kg',
        message_on_cake: '',
        delivery_date: '',
        delivery_time: '',
        delivery_option: 'pickup',
        notes: ''
    });

    useEffect(() => {
        async function fetchCakes() {
            try {
                const data = await getCakes();
                setCakes(data);
                const preSelected = searchParams.get('cake_id');
                if (preSelected) {
                    setFormData(prev => ({ ...prev, cake_id: preSelected }));
                }
            } catch (err) {
                console.error("Error fetching cakes:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchCakes();
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await submitBooking(formData);
            setSubmitted(true);
            window.scrollTo(0, 0);
        } catch (err) {
            alert("Failed to submit booking. Please try again or call us.");
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl shadow-xl p-10 max-w-2xl mx-auto">
                <div className="text-6xl mb-6">🎂</div>
                <h2 className="text-3xl font-bold text-secondary mb-4">Booking Received!</h2>
                <p className="text-gray-600 mb-8">
                    Thank you, {formData.customer_name}. We have received your order for {cakes.find(c => c.id == formData.cake_id)?.name || 'your cake'}. We will CONTACT YOU SHORTLY to confirm the details.
                </p>
                <div className="flex flex-col space-y-4">
                    <button onClick={() => window.location.href = '/'} className="btn-primary">
                        Return to Home
                    </button>
                    <a href={`https://wa.me/91XXXXXXXXXX?text=Hi, I just placed an order for ${formData.customer_name}`} className="text-secondary font-bold hover:underline">
                        Message us on WhatsApp
                    </a>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-secondary mb-8">Reserve Your Cake</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Full Name *</label>
                    <input type="text" name="customer_name" required value={formData.customer_name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary outline-none transition" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Phone Number *</label>
                    <input type="tel" name="phone_number" required value={formData.phone_number} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary outline-none transition" placeholder="WhatsApp preferred" />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Email (Optional)</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary outline-none transition" placeholder="For receipt" />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Select Cake *</label>
                    <select name="cake_id" required value={formData.cake_id} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary outline-none transition">
                        <option value="">-- Choose a Cake --</option>
                        {cakes.map((cake: any) => (
                            <option key={cake.id} value={cake.id}>{cake.name} - ₹{cake.price}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Weight *</label>
                    <select name="weight" required value={formData.weight} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary outline-none transition">
                        <option value="500g">500g</option>
                        <option value="1kg">1kg</option>
                        <option value="1.5kg">1.5kg</option>
                        <option value="2kg">2kg</option>
                        <option value="Above 2kg">Above 2kg (Custom)</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Delivery Date *</label>
                    <input type="date" name="delivery_date" required value={formData.delivery_date} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary outline-none transition" />
                </div>
            </div>

            <div className="space-y-6 mb-8">
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Message on Cake</label>
                    <input type="text" name="message_on_cake" value={formData.message_on_cake} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary outline-none transition" placeholder="e.g. Happy Birthday" />
                </div>
                


                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">Notes (Allergies, design requests etc.)</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary outline-none transition" rows={2} placeholder="Any special instructions..."></textarea>
                </div>
            </div>

            <button 
                type="submit" 
                disabled={submitting}
                className={`w-full py-4 rounded-xl font-bold text-xl transition shadow-lg ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'btn-primary'}`}
            >
                {submitting ? 'Processing...' : 'Confirm Booking'}
            </button>
            <p className="text-center text-gray-500 mt-4 text-sm italic">
                No payment required now. We will call you to confirm.
            </p>
        </form>
    );
}

export default function BookPage() {
    return (
        <div className="pt-32 pb-20 bg-background min-h-screen">
            <div className="container mx-auto px-6">
                <Suspense fallback={<div className="text-center py-20">Loading order form...</div>}>
                    <BookingForm />
                </Suspense>
            </div>
        </div>
    );
}
