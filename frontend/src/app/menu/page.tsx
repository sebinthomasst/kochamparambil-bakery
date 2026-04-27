"use client";
import { useState, useEffect } from 'react';
import { getCakes, getCategories } from '@/lib/api';
import CakeCard from '@/components/CakeCard';

export default function MenuPage() {
    const [cakes, setCakes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            // test
            try {
                const [cats, cakeData] = await Promise.all([
                    getCategories(),
                    getCakes(selectedCategory || undefined)
                ]);
                setCategories(cats);
                setCakes(cakeData);
            } catch (err) {
                console.error("Error fetching menu:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [selectedCategory]);

    return (
        <div className="pt-32 pb-20 bg-background min-h-screen">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">Our Sweet Menu</h1>
                    <p className="text-gray-600">Discover our range of freshly baked delights</p>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <button 
                        onClick={() => setSelectedCategory(null)}
                        className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === null ? 'bg-secondary text-white' : 'bg-white text-secondary hover:bg-primary border border-gray-200'}`}
                    >
                        All
                    </button>
                    {categories.map((cat: any) => (
                        <button 
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-6 py-2 rounded-full font-medium transition ${selectedCategory === cat.id ? 'bg-secondary text-white' : 'bg-white text-secondary hover:bg-primary border border-gray-200'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {cakes.length > 0 ? (
                            cakes.map((cake: any) => (
                                <CakeCard key={cake.id} cake={cake} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                No cakes found in this category.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
