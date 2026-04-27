"use client";
import { useState, useEffect } from 'react';
import { getCakes, getCategories, saveCake, deleteCake, uploadImage } from '@/lib/api';

export default function CakesManagement() {
    const [cakes, setCakes] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCake, setCurrentCake] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const [cakeData, catData] = await Promise.all([getCakes(), getCategories()]);
            setCakes(cakeData);
            setCategories(catData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleEdit = (cake?: any) => {
        setCurrentCake(cake || { name: '', description: '', price: 0, category_id: categories[0]?.id, image_url: '', weight_options: '500g, 1kg' });
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this cake?')) {
            await deleteCake(id);
            fetchData();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await saveCake(currentCake, currentCake.id);
        setIsEditing(false);
        fetchData();
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const res = await uploadImage(e.target.files[0]);
            setCurrentCake({ ...currentCake, image_url: res.imageUrl });
        }
    };

    if (loading) return <div>Loading cakes...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-secondary">Cake Menu Management</h1>
                <button onClick={() => handleEdit()} className="btn-primary">Add New Cake</button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">{currentCake.id ? 'Edit Cake' : 'Add New Cake'}</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Cake Name</label>
                                <input type="text" required value={currentCake.name} onChange={e => setCurrentCake({...currentCake, name: e.target.value})} className="w-full border rounded-xl p-3" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Price (₹)</label>
                                    <input type="number" required value={currentCake.price} onChange={e => setCurrentCake({...currentCake, price: e.target.value})} className="w-full border rounded-xl p-3" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Category</label>
                                    <select value={currentCake.category_id} onChange={e => setCurrentCake({...currentCake, category_id: e.target.value})} className="w-full border rounded-xl p-3">
                                        {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Description</label>
                                <textarea value={currentCake.description} onChange={e => setCurrentCake({...currentCake, description: e.target.value})} className="w-full border rounded-xl p-3" rows={3}></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Weight Options (comma separated)</label>
                                <input type="text" value={currentCake.weight_options} onChange={e => setCurrentCake({...currentCake, weight_options: e.target.value})} className="w-full border rounded-xl p-3" placeholder="500g, 1kg, 2kg" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Cake Image</label>
                                <input type="file" onChange={handleImageUpload} className="mb-2" />
                                {currentCake.image_url && <img src={currentCake.image_url.startsWith('https') ? currentCake.image_url : `http://localhost:5000${currentCake.image_url}`} className="h-32 rounded-lg" />}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-8">
                            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2">Cancel</button>
                            <button type="submit" className="btn-primary">Save Changes</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4">Image</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {cakes.map((cake: any) => (
                            <tr key={cake.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">
                                    <img src={cake.image_url.startsWith('https') ? cake.image_url : `http://localhost:5000${cake.image_url}`} className="h-12 w-12 rounded-lg object-cover" />
                                </td>
                                <td className="px-6 py-4 font-bold">{cake.name}</td>
                                <td className="px-6 py-4">{cake.category_name}</td>
                                <td className="px-6 py-4">₹{cake.price}</td>
                                <td className="px-6 py-4 space-x-4">
                                    <button onClick={() => handleEdit(cake)} className="text-blue-600 hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(cake.id)} className="text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
