"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getSettings } from '@/lib/api';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [bakeryName, setBakeryName] = useState('Kochamparambil');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    getSettings().then(data => {
        if (data.bakery_name) setBakeryName(data.bakery_name);
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className={`text-2xl font-bold transition-colors ${scrolled ? 'text-secondary' : 'text-white'}`}>
          {bakeryName}
        </Link>
        <div className={`hidden md:flex space-x-8 items-center transition-colors ${scrolled ? 'text-secondary' : 'text-white'}`}>
          <Link href="/" className="hover:text-accent font-medium">Home</Link>
          <Link href="/menu" className="hover:text-accent font-medium">Menu</Link>
          <Link href="/book" className="hover:text-accent font-medium">Book Now</Link>
          <Link href="/contact" className="hover:text-accent font-medium">Contact</Link>
          <Link href="/book" className="btn-primary !text-secondary hover:!text-white">Order Online</Link>
        </div>
      </div>
    </nav>
  );
}
