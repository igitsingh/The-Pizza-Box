"use client"
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';

const Footer = () => {
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                if (res.data) setSettings(res.data);
            } catch (err) {
                console.error("Failed to load settings", err);
            }
        };
        fetchSettings();
    }, []);

    const name = settings?.restaurantName || "The Pizza Box";
    const address = settings?.address || "433, Prabhat Nagar, Meerut, Uttar Pradesh 250001";
    const phone = settings?.contactPhone || "+91 1234567890";
    const email = settings?.contactEmail || "hello@thepizzabox.com";

    return (
        <footer className="bg-gray-900 text-white py-8 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">{name}</h3>
                        <p className="text-gray-400 whitespace-pre-line">
                            {address}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="/menu" className="hover:text-white">Order Online</a></li>
                            <li><a href="/menu" className="hover:text-white">Veg Pizza Menu</a></li>
                            <li><a href="/orders" className="hover:text-white">Track Order</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Contact Us</h4>
                        <p className="text-gray-400">Phone: <a href={`tel:${phone}`} className="hover:text-white">{phone}</a></p>
                        <p className="text-gray-400">Email: <a href={`mailto:${email}`} className="hover:text-white">{email}</a></p>
                        <div className="flex gap-4 mt-4">
                            {/* Social Placeholders */}
                            <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
                            <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
                    <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>

                    <div className="mt-6 flex flex-col items-center gap-1">
                        <p className="text-xs font-bold tracking-widest uppercase text-gray-600">
                            <span style={{ color: '#f20707' }}>HOUSE OF FLOYDS</span> CREATION
                        </p>
                        <p className="text-[10px] text-gray-600 uppercase tracking-wider">
                            BUILT IN MEERUT 🇮🇳
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
