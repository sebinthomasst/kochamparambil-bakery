"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getSettings } from '@/lib/api';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [bakeryName, setBakeryName] = useState('Kochamparambil');
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    getSettings().then(data => {
        if (data && data.bakery_name) setBakeryName(data.bakery_name);
    });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const textColor = (scrolled || !isHome) ? 'text-secondary' : 'text-white';
  const navBg = scrolled ? 'glass py-2' : (isHome ? 'bg-transparent py-4' : 'bg-white py-4 shadow-sm');

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${navBg}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className={`text-2xl font-bold transition-colors ${textColor}`}>
          {bakeryName}
        </Link>
        <div className={`hidden md:flex space-x-8 items-center transition-colors ${textColor}`}>
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

