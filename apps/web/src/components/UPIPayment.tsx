'use client';

import { useState } from 'react';
import Image from 'next/image';

interface UPIPaymentProps {
    onUPIChange: (upiId: string) => void;
}

const upiApps = [
    { name: 'Google Pay', logo: '🟢', color: 'bg-green-100' },
    { name: 'PhonePe', logo: '🟣', color: 'bg-purple-100' },
    { name: 'Paytm', logo: '🔵', color: 'bg-blue-100' },
    { name: 'BHIM', logo: '🟠', color: 'bg-orange-100' },
];

export default function UPIPayment({ onUPIChange }: UPIPaymentProps) {
    // Auto-confirm validity since we don't take input anymore
    useState(() => {
        onUPIChange('secure@upi');
    });

    return (
        <div className="space-y-4 mt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 flex items-center gap-2">
                    <span className="text-lg">📱</span>
                    <strong>Secure Payment:</strong> You will be redirected to a secure payment gateway (Razorpay) where you can use Google Pay, PhonePe, Paytm, etc.
                </p>
            </div>
        </div>
    );
}
