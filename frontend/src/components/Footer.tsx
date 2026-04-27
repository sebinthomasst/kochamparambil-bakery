"use client";
import { useState, useEffect } from 'react';
import { getSettings } from '@/lib/api';

export default function Footer() {
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        getSettings().then(setSettings);
    }, []);

    return (
      <footer className="bg-secondary text-white py-12">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-4">{settings?.bakery_name || 'Kochamparambil Bakery'}</h3>
            <p className="text-gray-300">
              Spreading sweetness since years in the heart of Poopally, Alappuzha.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/" className="hover:text-primary">Home</a></li>
              <li><a href="/menu" className="hover:text-primary">Cake Menu</a></li>
              <li><a href="/book" className="hover:text-primary">Book a Cake</a></li>
              <li><a href="/contact" className="hover:text-primary">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Contact Info</h4>
            <address className="not-italic text-gray-300 space-y-2">
              <p>{settings?.address || 'Pooppally Junction, Nedumudy, Alappuzha'}</p>
              <p>Phone: {settings?.phone || '+91 XXXXX XXXXX'}</p>
              <p>WhatsApp: {settings?.whatsapp || '+91 XXXXX XXXXX'}</p>
            </address>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {settings?.bakery_name || 'Kochamparambil Bakery and Cakes'}. All rights reserved.</p>
        </div>
      </footer>
    );
  }
