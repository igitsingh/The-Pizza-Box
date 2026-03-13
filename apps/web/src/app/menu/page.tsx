'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, ShoppingCart, Search, ChevronDown } from 'lucide-react';
import { useStore } from '@/store/useStore';
import MenuCard from '@/components/MenuCard';
import { toast } from 'sonner'; // Assuming sonner or similar is available, or use alert/console for now if not installed. Actually I'll just use console/alert or nothing for simplicity as I don't want to install new deps if not needed. I'll use a simple alert or just UI feedback. Wait, I can use the store.

interface OptionChoice {
    id: string;
    name: string;
    price: number;
}

interface ItemOption {
    id: string;
    name: string;
    choices: OptionChoice[];
}

interface ItemAddon {
    id: string;
    name: string;
    price: number;
}

interface Item {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    isVeg: boolean;
    options: ItemOption[];
    addons: ItemAddon[];
}

interface Category {
    id: string;
    name: string;
    items: Item[];
}

export default function MenuPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>('');
    const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isSlowLoading, setIsSlowLoading] = useState(false);
    const addToCart = useStore((state) => state.addToCart);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) setIsSlowLoading(true);
        }, 3000);
        return () => clearTimeout(timer);
    }, [loading]);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const res = await api.get('/menu');
                setCategories(res.data);
                if (res.data.length > 0) {
                    setActiveCategory(res.data[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch menu', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    // Close sort dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('#sort-dropdown')) {
                setIsSortOpen(false);
            }
        };
        if (isSortOpen) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isSortOpen]);

    const handleAddToCart = (item: Item) => {
        addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            options: {}, // Default options
            addons: []
        });
        // Optional: Show feedback
    };

    const getSortedItems = (items: Item[]) => {
        if (sortBy === 'default') return items;
        return [...items].sort((a, b) => {
            if (sortBy === 'price-asc') return a.price - b.price;
            if (sortBy === 'price-desc') return b.price - a.price;
            return 0;
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-orange-600" />
                {isSlowLoading && (
                    <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <p className="text-gray-600 font-bold text-lg">Waking up our ovens... 🍕</p>
                        <p className="text-gray-400 text-sm max-w-xs mx-auto mt-2">
                            The server is starting up. This usually takes about 30-50 seconds. Thank you for your patience!
                        </p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Top Filter Bar */}
            <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
                {/* Row 1: Veg/Non-Veg + Sort + Search (Desktop) */}
                <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 border-r pr-4">
                            <div className="border rounded px-2 py-1 flex items-center gap-1 cursor-pointer hover:bg-gray-50">
                                <div className="border border-green-600 w-3 h-3 flex items-center justify-center p-0.5"><div className="bg-green-600 w-full h-full rounded-full"></div></div>
                                <span className="text-xs font-bold text-gray-600">Veg Only</span>
                            </div>
                            <div className="border rounded px-2 py-1 flex items-center gap-1 cursor-pointer hover:bg-gray-50">
                                <div className="border border-red-600 w-3 h-3 flex items-center justify-center p-0.5"><div className="bg-red-600 w-full h-full rounded-full"></div></div>
                                <span className="text-xs font-bold text-gray-600">Non Veg Only</span>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center gap-2 relative" id="sort-dropdown">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs font-bold text-gray-600"
                                onClick={() => setIsSortOpen(!isSortOpen)}
                            >
                                Sort by <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                            </Button>

                            {isSortOpen && (
                                <div className="absolute top-full left-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-50 py-1">
                                    <button
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'price-asc' ? 'text-primary font-bold' : 'text-gray-700'}`}
                                        onClick={() => { setSortBy('price-asc'); setIsSortOpen(false); }}
                                    >
                                        Price: Low to High
                                    </button>
                                    <button
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${sortBy === 'price-desc' ? 'text-primary font-bold' : 'text-gray-700'}`}
                                        onClick={() => { setSortBy('price-desc'); setIsSortOpen(false); }}
                                    >
                                        Price: High to Low
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for items..."
                                className="w-full pl-9 pr-4 py-1.5 text-sm border rounded-full bg-gray-100 focus:bg-white focus:ring-1 focus:ring-primary outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Row 2: Categories (Scrollable) */}
                <div className="container mx-auto px-4 pb-3 pt-1 overflow-x-auto scrollbar-hide border-t md:border-t-0 mt-2 md:mt-0">
                    <div className="flex items-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => {
                                    setActiveCategory(category.id);
                                    document.getElementById(category.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}
                                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${activeCategory === category.id
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-500 hover:bg-gray-100'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 w-full">
                {/* Menu Sections */}
                <div className="space-y-12">
                    {categories.map((category) => (
                        <section key={category.id} id={category.id} className="scroll-mt-48">
                            <div className="flex items-center gap-4 mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
                                <div className="h-px bg-gray-200 flex-grow"></div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {getSortedItems(category.items).map((item) => (
                                    <MenuCard key={item.id} item={item} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}
