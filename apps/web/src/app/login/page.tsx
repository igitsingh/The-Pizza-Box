'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useStore } from '@/store/useStore';
import { Smartphone, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AuthPage() {
    const router = useRouter();
    const { setUser } = useStore();
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    // Start resend timer
    const startResendTimer = () => {
        setResendTimer(30);
        const interval = setInterval(() => {
            setResendTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Send OTP
    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate phone number
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/send-otp', { phone });
            toast.success('OTP sent to your mobile number!');
            setStep('otp');
            startResendTimer();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP and Login/Signup
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/verify-otp', { phone, otp });

            // Save token and user
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);

            toast.success(res.data.isNewUser ? 'Account created successfully!' : 'Welcome back!');

            // Redirect to home or previous page
            const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/';
            router.push(redirectTo);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        if (resendTimer > 0) return;

        setLoading(true);
        try {
            await api.post('/auth/send-otp', { phone });
            toast.success('OTP resent successfully!');
            startResendTimer();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    // Quick Login with Test Account
    const handleQuickLogin = async (accountNum: number) => {
        try {
            setLoading(true);
            const email = `test${accountNum}@thepizzabox.com`;
            const password = 'test123';

            const res = await api.post('/auth/login', { email, password });

            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);

            toast.success(`✅ Logged in as Test Customer ${accountNum}!`);

            const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/';
            router.push(redirectTo);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/">
                        <h1 className="text-4xl font-bold text-orange-600 mb-2">🍕 The Pizza Box</h1>
                    </Link>
                    <p className="text-gray-600">
                        {step === 'phone' ? 'Login or Sign up' : 'Verify your number'}
                    </p>
                </div>

                {/* Auth Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {step === 'phone' ? (
                        // Step 1: Phone Number
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mobile Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Smartphone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        type="tel"
                                        placeholder="Enter 10-digit mobile number"
                                        value={phone}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        className="pl-12 h-12 text-lg"
                                        maxLength={10}
                                        autoFocus
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    We'll send you a 6-digit OTP to verify your number
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold"
                                disabled={loading || phone.length !== 10}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Sending OTP...
                                    </>
                                ) : (
                                    'Send OTP'
                                )}
                            </Button>

                            <div className="text-center text-sm text-gray-500">
                                By continuing, you agree to our{' '}
                                <Link href="/terms" className="text-orange-600 hover:underline">
                                    Terms
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="text-orange-600 hover:underline">
                                    Privacy Policy
                                </Link>
                            </div>
                        </form>
                    ) : (
                        // Step 2: OTP Verification
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <button
                                type="button"
                                onClick={() => setStep('phone')}
                                className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Change number
                            </button>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter OTP
                                </label>
                                <p className="text-sm text-gray-600 mb-4">
                                    Sent to <span className="font-semibold">+91 {phone}</span>
                                </p>
                                <Input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="h-12 text-center text-2xl tracking-widest font-mono"
                                    maxLength={6}
                                    autoFocus
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold"
                                disabled={loading || otp.length !== 6}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    'Verify & Continue'
                                )}
                            </Button>

                            <div className="text-center">
                                {resendTimer > 0 ? (
                                    <p className="text-sm text-gray-500">
                                        Resend OTP in <span className="font-semibold text-orange-600">{resendTimer}s</span>
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={loading}
                                        className="text-sm text-orange-600 hover:text-orange-700 font-semibold"
                                    >
                                        Resend OTP
                                    </button>
                                )}
                            </div>
                        </form>
                    )}

                    {/* 10 Test Account Buttons */}
                    <div className="mt-6 pt-6 border-t border-dashed">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 font-bold text-center">
                            🎯 Demo Accounts - Click to Login
                        </p>
                        <div className="grid grid-cols-5 gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <Button
                                    key={num}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="border-dashed border-orange-200 hover:bg-orange-50 hover:text-orange-600 transition-all text-xs h-10"
                                    onClick={() => handleQuickLogin(num)}
                                    disabled={loading}
                                >
                                    Test {num}
                                </Button>
                            ))}
                        </div>
                        <p className="text-[9px] text-gray-400 mt-2 text-center">
                            Each account has unique addresses & order history
                        </p>
                    </div>
                </div>

                {/* Benefits */}
                <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Why sign up?</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center">
                            <span className="text-green-600 mr-2">✓</span>
                            Track your orders in real-time
                        </li>
                        <li className="flex items-center">
                            <span className="text-green-600 mr-2">✓</span>
                            Save addresses for faster checkout
                        </li>
                        <li className="flex items-center">
                            <span className="text-green-600 mr-2">✓</span>
                            Earn rewards and get exclusive offers
                        </li>
                        <li className="flex items-center">
                            <span className="text-green-600 mr-2">✓</span>
                            Refer friends and earn ₹100 per referral
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
