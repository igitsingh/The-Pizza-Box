'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, Tag, X } from 'lucide-react';
import { toast } from 'sonner';
import PaymentMethodSelector from '@/components/PaymentMethodSelector';
import UPIPayment from '@/components/UPIPayment';
import CardPayment from '@/components/CardPayment';

interface Address {
    id: string;
    street: string;
    city: string;
    zip: string;
    isDefault: boolean;
}

export default function CheckoutPage() {
    const { cart, user, clearCart, deliveryAddress, selectedAddressId, setSelectedAddressId } = useStore();
    const router = useRouter();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [creatingOrder, setCreatingOrder] = useState(false);

    // Coupon State
    const [couponInput, setCouponInput] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [validatingCoupon, setValidatingCoupon] = useState(false);

    // Payment State
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [paymentDetails, setPaymentDetails] = useState<any>({});
    const [isPaymentValid, setIsPaymentValid] = useState(true); // Default true for COD

    // Redirect if empty cart
    useEffect(() => {
        if (cart.length === 0) router.push('/menu');
    }, [cart, router]);

    useEffect(() => {
        const fetchAddresses = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get('/users/addresses');
                setAddresses(res.data);
            } catch (error) {
                console.error('Failed to fetch addresses', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAddresses();
    }, [user]);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Calculate final total with discount
    // Logic: (Subtotal - Discount) + 5% Tax on (Subtotal - Discount)
    const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
    const taxableAmount = Math.max(0, total - discountAmount);
    const tax = Math.round(taxableAmount * 0.05); // 5% tax
    const finalTotal = taxableAmount + tax;

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return;

        setValidatingCoupon(true);
        try {
            const res = await api.post('/coupons/validate', {
                code: couponInput,
                cartTotal: total
            });

            setAppliedCoupon({
                ...res.data,
                code: couponInput // Ensure code is preserved
            });
            toast.success(`Coupon '${couponInput}' applied! You saved ₹${res.data.discount}`);
        } catch (error: any) {
            console.error('Coupon validation error:', error);
            const msg = error.response?.data?.message || 'Invalid coupon code';
            toast.error(msg);
            setAppliedCoupon(null);
        } finally {
            setValidatingCoupon(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponInput('');
        toast.info('Coupon removed');
    };

    const handlePaymentMethodChange = (method: string) => {
        setPaymentMethod(method);
        setPaymentDetails({});
        // COD is always valid, others need validation
        setIsPaymentValid(method === 'COD');
    };

    const handleUPIChange = (upiId: string) => {
        setPaymentDetails({ upiId });
        setIsPaymentValid(!!upiId && upiId.includes('@'));
    };

    const handleCardChange = (details: { last4: string; cardType: string }) => {
        setPaymentDetails(details);
        setIsPaymentValid(!!details.last4);
    };

    // Order Type State
    const [orderType, setOrderType] = useState<'INSTANT' | 'SCHEDULED'>('INSTANT');
    const [scheduledFor, setScheduledFor] = useState('');

    const [guestDetails, setGuestDetails] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        zip: ''
    });

    // ... existing address/coupon effects ...

    // Validate Scheduled Time
    const isValidSchedule = () => {
        if (orderType === 'INSTANT') return true;
        if (!scheduledFor) return false;
        const selected = new Date(scheduledFor);
        const now = new Date();
        // Must be at least 30 mins in future
        const minTime = new Date(now.getTime() + 30 * 60000);
        return selected >= minTime;
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId && user) {
            alert('Please select an address');
            return;
        }

        // Guest Validation
        if (!user) {
            if (!guestDetails.name || !guestDetails.phone || !guestDetails.street || !guestDetails.zip) {
                toast.error('Please fill in all guest details');
                return;
            }
        }

        // DELIVERY ELIGIBILITY CHECK (Strict)
        try {
            const validationPayload = user
                ? { addressId: selectedAddressId }
                : { guestAddress: guestDetails };

            await api.post('/orders/validate-delivery', validationPayload);
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Delivery not available for this location';
            toast.error(msg);
            return; // STOP ORDER
        }

        if (orderType === 'SCHEDULED' && !isValidSchedule()) {
            alert('Please select a valid future time (at least 30 mins from now)');
            return;
        }

        if (!isPaymentValid) {
            alert('Please enter valid payment details');
            return;
        }

        setCreatingOrder(true);
        try {
            let paymentData = paymentDetails;
            let currentPaymentStatus = 'PENDING';

            // -------------------------------------------------------------
            // RAZORPAY FLOW FOR ONLINE PAYMENTS
            // -------------------------------------------------------------
            if (paymentMethod !== 'COD') {
                // 1. Create Order on Razorpay
                const orderRes = await api.post('/payment/create-order', { amount: finalTotal });
                const { id: order_id, amount, currency } = orderRes.data;

                // 2. Open Razorpay Modal
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Fallback for dev, but requires real key to work
                    amount,
                    currency,
                    name: 'The Pizza Box',
                    description: 'Order Payment',
                    order_id,
                    handler: async function (response: any) {
                        // 3. Payment Success - Create Order in Backend
                        try {
                            // Verify and Create Order
                            const payload = {
                                items: cart.map(item => ({
                                    itemId: item.id,
                                    name: item.name,
                                    price: item.price,
                                    quantity: item.quantity,
                                    options: item.options,
                                    addons: item.addons,
                                    variants: item.type === 'variational' ? item.variants : undefined,
                                })),
                                total: finalTotal,
                                addressId: selectedAddressId,
                                paymentMethod, // 'CARD', 'UPI', etc.
                                paymentStatus: 'PAID', // Backend will verify proof
                                paymentDetails: {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature
                                },
                                couponCode: appliedCoupon ? appliedCoupon.code : undefined,
                                discountAmount: appliedCoupon ? appliedCoupon.discount : 0,
                                orderType,
                                scheduledFor: orderType === 'SCHEDULED' ? new Date(scheduledFor).toISOString() : undefined
                            };

                            const createOrderRes = await api.post('/orders', payload);

                            clearCart();
                            toast.success(orderType === 'SCHEDULED' ? 'Order scheduled successfully!' : 'Order placed successfully!');
                            window.location.href = `/order-confirmation/${createOrderRes.data.id}`;

                        } catch (err: any) {
                            console.error('Backend order creation failed after payment', err);
                            toast.error('Payment successful but order creation failed. Please contact support.');
                            setCreatingOrder(false);
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setCreatingOrder(false);
                            toast.error('Payment cancelled');
                        }
                    },
                    prefill: {
                        name: user?.name,
                        email: user?.email,
                        contact: user?.phone
                    },
                    theme: {
                        color: "#EA580C"
                    }
                };

                // @ts-ignore
                const rzp = new window.Razorpay(options);
                rzp.open();
                return; // Stop here, wait for handler
            }

            // -------------------------------------------------------------
            // COD FLOW
            // -------------------------------------------------------------
            const orderRes = await api.post('/orders', {
                items: cart.map(item => ({
                    itemId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    options: item.options,
                    addons: item.addons,
                    variants: item.type === 'variational' ? item.variants : undefined,
                })),
                total: finalTotal,
                addressId: selectedAddressId,
                paymentMethod,
                paymentStatus: 'PENDING',
                paymentDetails,
                couponCode: appliedCoupon ? appliedCoupon.code : undefined,
                discountAmount: appliedCoupon ? appliedCoupon.discount : 0,
                orderType,
                scheduledFor: orderType === 'SCHEDULED' ? new Date(scheduledFor).toISOString() : undefined
            });

            clearCart();
            toast.success(orderType === 'SCHEDULED' ? 'Order scheduled successfully!' : 'Order placed successfully!');
            setTimeout(() => {
                window.location.href = `/order-confirmation/${orderRes.data.id}`;
            }, 500);
        } catch (error: any) {
            console.error('Failed to place order', error);
            const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.message || 'Failed to place order. Please try again.';
            toast.error(message);
            setCreatingOrder(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Address Selection */}
                {/* Address Selection */}
                <div>
                    <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
                    {user ? (
                        <div>
                            {selectedAddressId && addresses.length > 0 ? (
                                <div className="p-4 rounded-lg border-2 border-primary bg-orange-50">
                                    <p className="font-bold">{user.name}</p>
                                    <p>{addresses.find(a => a.id === selectedAddressId)?.street}</p>
                                    <p>{addresses.find(a => a.id === selectedAddressId)?.city}, {addresses.find(a => a.id === selectedAddressId)?.zip}</p>
                                    <Link href="/cart">
                                        <Button variant="link" className="text-orange-700 p-0 h-auto font-bold mt-2">
                                            Change Address
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="mt-4 p-4 bg-orange-50 text-orange-800 rounded-lg text-sm border border-orange-200">
                                    <p>No address selected. Please go back to cart to select an address.</p>
                                    <Button
                                        variant="link"
                                        className="text-orange-700 p-0 h-auto font-bold mt-1"
                                        onClick={() => router.push('/cart')}
                                    >
                                        Go to Cart
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-slate-700">Guest Checkout</h3>
                                <Link href="/login" className="text-sm text-orange-600 hover:underline">
                                    Login for faster checkout
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="Full Name"
                                    className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={guestDetails.name}
                                    onChange={e => setGuestDetails({ ...guestDetails, name: e.target.value })}
                                />
                                <input
                                    placeholder="Phone Number"
                                    className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={guestDetails.phone}
                                    onChange={e => setGuestDetails({ ...guestDetails, phone: e.target.value })}
                                />
                            </div>
                            <input
                                placeholder="Street Address / Flat No"
                                className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-orange-500 outline-none"
                                value={guestDetails.street}
                                onChange={e => setGuestDetails({ ...guestDetails, street: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="City"
                                    className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={guestDetails.city}
                                    onChange={e => setGuestDetails({ ...guestDetails, city: e.target.value })}
                                />
                                <input
                                    placeholder="Pincode"
                                    className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-orange-500 outline-none"
                                    value={guestDetails.zip}
                                    onChange={e => setGuestDetails({ ...guestDetails, zip: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                    {/* Order Timing Section */}
                    <div className="bg-white border rounded-xl p-6 shadow-sm">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Loader2 className="h-5 w-5 text-orange-600" />
                            Order Timing
                        </h2>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <button
                                className={`p-3 rounded-lg border-2 font-medium transition-all ${orderType === 'INSTANT'
                                    ? 'border-orange-600 bg-orange-50 text-orange-700'
                                    : 'border-slate-200 hover:border-orange-200'
                                    }`}
                                onClick={() => setOrderType('INSTANT')}
                            >
                                Order Now
                            </button>
                            <button
                                className={`p-3 rounded-lg border-2 font-medium transition-all ${orderType === 'SCHEDULED'
                                    ? 'border-orange-600 bg-orange-50 text-orange-700'
                                    : 'border-slate-200 hover:border-orange-200'
                                    }`}
                                onClick={() => setOrderType('SCHEDULED')}
                            >
                                Schedule for Later
                            </button>
                        </div>

                        {orderType === 'SCHEDULED' && (
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2">
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Select Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                    min={new Date(Date.now() + 30 * 60000).toISOString().slice(0, 16)}
                                    onChange={(e) => setScheduledFor(e.target.value)}
                                />
                                <p className="text-xs text-slate-500 mt-2">
                                    * Must be at least 30 minutes in advance
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Payment Details Section */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Payment Details</h2>

                        {/* Coupon Input */}
                        <div className="bg-white border rounded-xl p-4 mb-6 shadow-sm">
                            <div className="flex items-center gap-2 mb-2 font-medium text-gray-700">
                                <Tag className="w-4 h-4" />
                                Apply Coupon
                            </div>
                            {appliedCoupon ? (
                                <div className="flex items-center justify-between bg-green-50 text-green-700 px-3 py-2 rounded-lg border border-green-200">
                                    <div className="flex flex-col">
                                        <span className="font-bold flex items-center gap-2">
                                            {appliedCoupon.code}
                                            <span className="text-xs bg-green-200 px-1.5 py-0.5 rounded text-green-800">APPLIED</span>
                                        </span>
                                        <span className="text-xs">You saved ₹{appliedCoupon.discount}</span>
                                    </div>
                                    <button onClick={removeCoupon} className="p-1 hover:bg-green-100 rounded-full transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Enter Code (e.g. NY2026)"
                                        className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase"
                                        value={couponInput}
                                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                    />
                                    <Button
                                        onClick={handleApplyCoupon}
                                        disabled={validatingCoupon || !couponInput.trim()}
                                        variant="outline"
                                        className="border-orange-200 text-orange-700 hover:bg-orange-50"
                                    >
                                        {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl mb-6">
                            <div className="flex justify-between mb-2 text-gray-600">
                                <span>Subtotal</span>
                                <span>₹{total}</span>
                            </div>

                            {appliedCoupon && (
                                <div className="flex justify-between mb-2 text-green-600 font-medium">
                                    <span>Discount ({appliedCoupon.code})</span>
                                    <span>-₹{appliedCoupon.discount}</span>
                                </div>
                            )}

                            <div className="flex justify-between mb-2 text-gray-600">
                                <span>Tax (5%)</span>
                                <span>₹{tax}</span>
                            </div>

                            <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-3 mt-2">
                                <span>Total to Pay</span>
                                <span>₹{finalTotal}</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <PaymentMethodSelector
                                selectedMethod={paymentMethod}
                                onMethodChange={handlePaymentMethodChange}
                            />

                            {paymentMethod === 'UPI' && (
                                <UPIPayment onUPIChange={handleUPIChange} />
                            )}

                            {paymentMethod === 'CARD' && (
                                <CardPayment onCardChange={handleCardChange} />
                            )}

                            {paymentMethod === 'NET_BANKING' && (
                                <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                                    You will be redirected to your bank's website to complete the payment.
                                </div>
                            )}
                        </div>

                        <Button
                            className="w-full py-6 text-lg font-bold bg-[#C62828] hover:bg-[#B71C1C]"
                            onClick={handlePlaceOrder}
                            disabled={creatingOrder || (!!user && !selectedAddressId) || !isPaymentValid}
                        >
                            {creatingOrder ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                                </>
                            ) : (
                                `Pay ₹${finalTotal}`
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
