'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import { io } from 'socket.io-client';
import { Loader2, CheckCircle, Clock, ChefHat, Truck, Package } from 'lucide-react';
import FeedbackCard from '@/components/FeedbackCard';

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    orderNumber: number;
    status: string;
    total: number;
    items: OrderItem[];
    createdAt: string;
    customerPhone?: string;
    deliveryPartner?: {
        name: string;
        phone: string;
        vehicleType: string;
        vehicleNumber: string;
    };
}

const steps = [
    { status: 'PLACED', label: 'Order Placed', icon: Clock },
    { status: 'PREPARING', label: 'Preparing', icon: ChefHat },
    { status: 'BAKING', label: 'Baking', icon: ChefHat },
    { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
    { status: 'DELIVERED', label: 'Delivered', icon: Package },
];

export default function OrderTrackingPage() {
    const { id } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/orders/${id}`);
                setOrder(res.data);
            } catch (error) {
                console.error('Failed to fetch order', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchOrder();

        // Socket.io connection
        const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '/orders') || 'http://localhost:5000/orders');

        socket.on('connect', () => {
            console.log('Connected to socket');
            socket.emit('join_order', id);
        });

        socket.on('order_status_updated', (data: { orderId: string; status: string }) => {
            if (data.orderId === id) {
                setOrder((prev) => prev ? { ...prev, status: data.status } : null);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!order) {
        return <div className="text-center py-20">Order not found</div>;
    }

    const currentStepIndex = steps.findIndex((s) => s.status === order.status);

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold mb-8 text-center">Order Tracking</h1>

            <div className="bg-white p-8 rounded-xl shadow-sm border mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-gray-500 text-sm">Order ID</p>
                        <p className="font-mono font-bold text-lg text-orange-600">
                            TPB{String(order.orderNumber).padStart(5, '0')}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-500 text-sm mb-1">Status</p>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${{
                            'PENDING': 'bg-yellow-100 text-yellow-800',
                            'ACCEPTED': 'bg-blue-100 text-blue-800',
                            'PREPARING': 'bg-orange-100 text-orange-800',
                            'BAKING': 'bg-orange-200 text-orange-900',
                            'READY_FOR_PICKUP': 'bg-purple-100 text-purple-800',
                            'OUT_FOR_DELIVERY': 'bg-indigo-100 text-indigo-800',
                            'DELIVERED': 'bg-green-100 text-green-800',
                            'CANCELLED': 'bg-red-100 text-red-800'
                        }[order.status] || 'bg-gray-100 text-gray-800'
                            }`}>
                            {order.status.replace(/_/g, ' ')}
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative mb-12">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-green-500 -translate-y-1/2 z-0 transition-all duration-500"
                        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                    ></div>

                    <div className="relative z-10 flex justify-between">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;

                            return (
                                <div key={step.status} className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${isActive ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <p className={`text-xs mt-2 font-medium ${isActive ? 'text-green-600' : 'text-gray-400'}`}>{step.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Delivery Partner Info */}
                {order.status === 'OUT_FOR_DELIVERY' && order.deliveryPartner && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Truck className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-bold text-blue-900">Out for Delivery</p>
                                <p className="text-sm text-blue-700">
                                    {order.deliveryPartner.name} is on the way!
                                </p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Vehicle: {order.deliveryPartner.vehicleNumber} ({order.deliveryPartner.vehicleType})
                                </p>
                            </div>
                        </div>
                        <a href={`tel:${order.deliveryPartner.phone}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                            Call Partner
                        </a>
                    </div>
                )}

                {/* Items */}
                <div>
                    <h3 className="font-bold mb-4">Items Ordered</h3>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between items-center border-b pb-4 last:border-0">
                                <div className="flex items-center gap-4">
                                    <div className="bg-gray-100 w-12 h-12 rounded flex items-center justify-center text-lg">🍕</div>
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-bold">₹{item.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center pt-6 mt-4 border-t">
                        <p className="font-bold text-lg">Total Amount</p>
                        <p className="font-bold text-xl text-orange-600">₹{order.total}</p>
                    </div>
                </div>
            </div>

            {/* Feedback Card */}
            <FeedbackCard
                orderId={order.id}
                orderStatus={order.status}
                customerPhone={order.customerPhone}
            />
        </div>
    );
}
