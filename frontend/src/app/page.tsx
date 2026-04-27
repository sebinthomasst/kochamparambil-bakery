"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getCakes } from '@/lib/api';

export default function Home() {
  const [featuredCakes, setFeaturedCakes] = useState<any[]>([]);

  useEffect(() => {
    getCakes().then(data => setFeaturedCakes(data.slice(0, 3)));
  }, []);
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 transform hover:scale-105" 
             style={{ backgroundImage: "url('/images/hero_cake.png')" }}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            Kochamparambil <br/> Bakery & Cakes
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light text-gray-100">
            Handcrafted cakes for your most precious moments. From our oven to your heart.
          </p>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 justify-center">
            <Link href="/menu" className="btn-primary text-xl">
              Explore Our Menu
            </Link>
            <Link href="/book" className="bg-white text-secondary px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg text-xl">
              Order Custom Cake
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Cakes Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-secondary mb-4">Our Featured Delicacies</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each cake is a masterpiece, crafted with the finest ingredients and a pinch of love.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {featuredCakes.length > 0 ? featuredCakes.map((cake) => (
              <div key={cake.id} className="bg-white rounded-2xl overflow-hidden shadow-lg pastel-hover group">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={(cake.image_url || '').startsWith('http') ? cake.image_url : `http://localhost:5000${cake.image_url || ''}`} 
                    alt={cake.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="p-6 text-left">
                  <h3 className="text-2xl font-bold text-secondary mb-2">{cake.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{cake.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-accent">₹{cake.price}</span>
                    <Link href={`/book?cake_id=${cake.id}`} className="text-secondary font-bold hover:underline">Book Now →</Link>
                  </div>
                </div>
              </div>
            )) : (
                <div className="col-span-full py-10">
                    <p className="text-gray-400">Loading our finest cakes...</p>
                </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/menu" className="text-secondary font-bold hover:underline text-lg">
              View All Cakes & Pastries →
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 glass relative">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-secondary mb-6">The Heart of Poopally</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              For years, Kochamparambil has been a beloved name in Poopally, known for our traditional bakery and coolbar. Our journey started with a simple mission: to serve quality treats to our community.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Today, we are proud to introduce our specialized <strong>Bakery and Cakes</strong> section. We bring the same dedication and quality to our new range of custom cakes, pastries, and gourmet delights.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Every slice tells a story of quality and tradition. We use only the freshest ingredients to ensure that every bite is as delicious as it looks.
            </p>
            <Link href="/contact" className="btn-primary">Visit Our Shop</Link>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img src="/images/kerala_bakery.png" alt="Bakery Interior" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center mb-12">
            <h2 className="text-4xl font-bold text-secondary mb-4">Find Us</h2>
            <p className="text-gray-600">Poopally Junction, Nedumudy, Ponga PO, Alappuzha</p>
        </div>
        <div className="w-full h-[500px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15735.667794017355!2d76.3768798!3d9.432657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b08836df3f48a7b%3A0xe67ce96769e59d99!2sPooppally%20Junction!5e0!3m2!1sen!2sin!4v1711283647000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
