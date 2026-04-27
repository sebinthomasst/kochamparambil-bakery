import Link from 'next/link';

interface CakeCardProps {
    cake: {
        id: number;
        name: string;
        description: string;
        price: number;
        image_url: string;
        weight_options: string;
    };
}

export default function CakeCard({ cake }: CakeCardProps) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-md pastel-hover group border border-gray-100">
            <div className="h-64 overflow-hidden relative">
                <img 
                    src={(cake.image_url || '').startsWith('http') ? cake.image_url : `http://localhost:5000${cake.image_url || ''}`} 
                    alt={cake.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-4 right-4 bg-primary text-secondary px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                    {cake.weight_options.split(',')[0]}
                </div>
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-secondary mb-2">{cake.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{cake.description}</p>
                <div className="flex justify-between items-center mt-auto">
                    <span className="text-lg font-bold text-accent">₹{cake.price}</span>
                    <Link 
                        href={`/book?cake_id=${cake.id}`} 
                        className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
