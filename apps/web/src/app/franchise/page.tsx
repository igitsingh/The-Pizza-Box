'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    TrendingUp,
    Users,
    ShieldCheck,
    Award,
    PieChart,
    CheckCircle2,
    MessageSquare,
    Store,
    Truck,
    ChefHat,
    Utensils
} from 'lucide-react';
import { toast } from 'sonner';

const FranchisePage = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        city: '',
        investment: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here we would normally send to an API
        console.log('Franchise Enquiry:', formData);
        toast.success("Thank you for your interest! Our franchise team will contact you shortly.");
        setFormData({
            name: '',
            phone: '',
            email: '',
            city: '',
            investment: '',
            message: ''
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const features = [
        {
            icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
            title: "High ROI",
            description: "Proven business model with quick break-even and high profit margins in the fast-growing QSR segment."
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-orange-600" />,
            title: "Standardized Operations",
            description: "End-to-end SOPs, supply chain management, and quality control systems to ensure brand consistency."
        },
        {
            icon: <Award className="w-8 h-8 text-orange-600" />,
            title: "Brand Recognition",
            description: "Partner with one of Meerut's most loved pizza brands with a loyal customer base and strong digital presence."
        },
        {
            icon: <Users className="w-8 h-8 text-orange-600" />,
            title: "Comprehensive Training",
            description: "Full staff training, management guidance, and ongoing operational support for your success."
        }
    ];

    const models = [
        {
            name: "Express Model",
            space: "150 - 250 Sq. Ft.",
            investment: "₹10 - 15 Lakhs",
            focus: "Takeaway & Delivery",
            icon: <Store className="w-10 h-10" />
        },
        {
            name: "Dine-In Cafe",
            space: "500 - 800 Sq. Ft.",
            investment: "₹20 - 25 Lakhs+",
            focus: "Dining, Takeaway & Delivery",
            icon: <Utensils className="w-10 h-10" />
        }
    ];

    const supportItems = [
        { icon: <ChefHat className="w-5 h-5" />, text: "Recipe Secrets & Menu Development" },
        { icon: <Truck className="w-5 h-5" />, text: "Supply Chain & Raw Material Sourcing" },
        { icon: <PieChart className="w-5 h-5" />, text: "Marketing & Digital Promotions" },
        { icon: <MessageSquare className="w-5 h-5" />, text: "Customer Relationship Management" }
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/franchise-hero.png"
                        alt="The Pizza Box Franchise"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center text-white">
                    <div className="inline-block px-4 py-1 rounded-full bg-orange-600 text-sm font-bold tracking-widest uppercase mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        Expansion Opportunity 2026
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
                        GROW WITH THE <br />
                        <span className="text-orange-500">PIZZA BOX</span> FAMILY
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 font-medium">
                        Partner with India's fastest growing veg pizza brand.
                        Low investment, high returns, and absolute pizza perfection.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-orange-600 hover:bg-orange-700 text-white font-bold h-14 px-10 text-lg rounded-xl shadow-xl shadow-orange-900/20"
                            onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Enquire Now
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-bold h-14 px-10 text-lg rounded-xl backdrop-blur-md"
                        >
                            Download Brochure
                        </Button>
                    </div>
                </div>
            </section>

            {/* Why Us Section */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 uppercase tracking-tight">Why Partner With Us?</h2>
                        <div className="h-2 w-20 bg-orange-600 mx-auto rounded-full mb-6"></div>
                        <p className="text-gray-600 text-lg">
                            We don't just sell pizzas; we deliver experiences. Join a brand that prioritizes quality, taste, and partner profitability.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="mb-6 p-4 bg-orange-50 w-fit rounded-2xl group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Support Section */}
            <section className="py-24 overflow-hidden relative">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 uppercase tracking-tight">Our Support Ecosystem</h2>
                            <p className="text-gray-600 text-xl mb-10 leading-relaxed">
                                From the day you sign the agreement to your grand opening and beyond, we are with you every step of the way.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {supportItems.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                        <div className="bg-orange-600 text-white p-2 rounded-lg">
                                            {item.icon}
                                        </div>
                                        <span className="font-bold text-gray-800">{item.text}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 bg-orange-600 rounded-3xl p-8 text-white">
                                <h4 className="text-2xl font-bold mb-4 flex items-center gap-3">
                                    <CheckCircle2 className="w-8 h-8" />
                                    The 100% Quality Promise
                                </h4>
                                <p className="opacity-90 leading-relaxed">
                                    We provide centralized kitchen support and standardized ingredients to ensure every outlet tastes exactly like the original Meerut outlet.
                                </p>
                            </div>
                        </div>

                        <div className="lg:w-1/2 relative">
                            <div className="absolute -inset-4 bg-orange-400/20 blur-3xl rounded-full"></div>
                            <img
                                src="/images/franchise-hero.png"
                                alt="Support"
                                className="relative rounded-[3rem] shadow-2xl border-8 border-white object-cover aspect-square"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Franchise Models */}
            <section className="py-24 bg-gray-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 uppercase tracking-tight">Franchise Models</h2>
                        <div className="h-2 w-20 bg-orange-600 mx-auto rounded-full mb-6"></div>
                        <p className="text-gray-400 text-lg">Choose a model that fits your budget and location aspirations.</p>
                    </div>

                    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                        {models.map((model, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/10 p-12 rounded-[2.5rem] backdrop-blur-sm hover:border-orange-600/50 transition-all group">
                                <div className="text-orange-500 mb-8 p-4 bg-orange-500/10 w-fit rounded-3xl">
                                    {model.icon}
                                </div>
                                <h3 className="text-3xl font-black mb-6 uppercase">{model.name}</h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between border-b border-white/10 pb-4">
                                        <span className="text-gray-400">Required Space</span>
                                        <span className="font-bold text-xl">{model.space}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/10 pb-4">
                                        <span className="text-gray-400">Total Investment</span>
                                        <span className="font-bold text-xl text-orange-500">{model.investment}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-white/10 pb-4">
                                        <span className="text-gray-400">Focus</span>
                                        <span className="font-bold text-xl">{model.focus}</span>
                                    </div>
                                </div>
                                <Button
                                    className="w-full mt-10 bg-white text-gray-900 hover:bg-orange-600 hover:text-white font-black py-8 rounded-2xl text-lg transition-all"
                                    onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    GET STARTED
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form Section */}
            <section id="enquiry-form" className="py-24 container mx-auto px-4">
                <div className="max-w-6xl mx-auto bg-white rounded-[3rem] shadow-2xl overflow-hidden shadow-orange-900/10 flex flex-col lg:flex-row border border-gray-100">
                    <div className="lg:w-1/3 bg-orange-600 p-12 md:p-16 text-white flex flex-col justify-between">
                        <div>
                            <h2 className="text-4xl font-black mb-6 leading-tight uppercase">Let's Talk Business</h2>
                            <p className="text-orange-100 text-lg mb-8 leading-relaxed">
                                Our franchise directors are looking for passionate partners in new cities. Fill the form to get a callback within 24 hours.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/10 rounded-lg"><Store className="w-5 h-5" /></div>
                                <span>Head Office: Meerut, UP</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/10 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
                                <span>Growing to 50+ Stores by Dec 2026</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-2/3 p-8 md:p-16">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Full Name</label>
                                <input
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full h-14 px-6 rounded-2xl border-2 border-gray-100 focus:border-orange-600 focus:outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Phone Number</label>
                                <input
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 99999 00000"
                                    className="w-full h-14 px-6 rounded-2xl border-2 border-gray-100 focus:border-orange-600 focus:outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full h-14 px-6 rounded-2xl border-2 border-gray-100 focus:border-orange-600 focus:outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Preferred City</label>
                                <input
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="e.g. Noida, Delhi, etc."
                                    className="w-full h-14 px-6 rounded-2xl border-2 border-gray-100 focus:border-orange-600 focus:outline-none transition-all placeholder:text-gray-300"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Investment Capacity</label>
                                <select
                                    name="investment"
                                    required
                                    value={formData.investment}
                                    onChange={handleChange}
                                    className="w-full h-14 px-6 rounded-2xl border-2 border-gray-100 focus:border-orange-600 focus:outline-none transition-all bg-white"
                                >
                                    <option value="">Select range</option>
                                    <option value="10-15">₹10L - ₹15L</option>
                                    <option value="15-25">₹15L - ₹25L</option>
                                    <option value="25+">₹25L+</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Additional Message</label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us about your background or location..."
                                    className="w-full p-6 rounded-2xl border-2 border-gray-100 focus:border-orange-600 focus:outline-none transition-all placeholder:text-gray-300 resize-none"
                                ></textarea>
                            </div>
                            <Button
                                type="submit"
                                className="md:col-span-2 bg-gray-900 border-2 border-gray-900 hover:bg-orange-600 hover:border-orange-600 text-white font-black py-8 rounded-2xl text-xl shadow-2xl transition-all uppercase tracking-widest"
                            >
                                Send Enquiry Request
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FranchisePage;
