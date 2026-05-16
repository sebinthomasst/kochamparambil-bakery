"use client";
import { useState, useEffect } from 'react';
import { getCategories, saveCategory, deleteCategory } from '@/lib/api';

export default function CategoriesManagement() {
    const [categories, setCategories] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const handleEdit = (category?: any) => {
        setCurrentCategory(category || { name: '' });
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this category? Note: Deleting a category might affect cakes linked to it.')) {
            await deleteCategory(id);
            fetchData();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await saveCategory(currentCategory, currentCategory.id);
        setIsEditing(false);
        fetchData();
    };

    if (loading) return <div>Loading categories...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-secondary">Category Management</h1>
                <button onClick={() => handleEdit()} className="btn-primary">Add New Category</button>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6">
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">{currentCategory.id ? 'Edit Category' : 'Add New Category'}</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Category Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={currentCategory.name} 
                                    onChange={e => setCurrentCategory({...currentCategory, name: e.target.value})} 
                                    className="w-full border rounded-xl p-3" 
                                    placeholder="e.g. Birthday Cakes"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-4 mt-8">
                            <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 text-gray-600 hover:text-gray-900">Cancel</button>
                            <button type="submit" className="btn-primary">Save Category</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Category Name</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {categories.map((category: any) => (
                            <tr key={category.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4">{category.id}</td>
                                <td className="px-6 py-4 font-bold">{category.name}</td>
                                <td className="px-6 py-4 space-x-4">
                                    <button onClick={() => handleEdit(category)} className="text-blue-600 hover:underline">Edit</button>
                                    <button onClick={() => handleDelete(category.id)} className="text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {categories.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No categories found. Click "Add New Category" to create one.
                    </div>
                )}
            </div>
        </div>
    );
}
