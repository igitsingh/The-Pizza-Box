'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';

interface CardPaymentProps {
    onCardChange: (cardDetails: { last4: string; cardType: string }) => void;
}

export default function CardPayment({ onCardChange }: CardPaymentProps) {
    // Auto-confirm validity since we don't take input anymore
    useState(() => {
        onCardChange({ last4: '1111', cardType: 'Secure' });
    });

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardholderName, setCardholderName] = useState('');

    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\s/g, '');
        const chunks = cleaned.match(/.{1,4}/g);
        return chunks ? chunks.join(' ') : cleaned;
    };

    const formatExpiry = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
        }
        return cleaned;
    };

    const detectCardType = (number: string) => {
        const cleaned = number.replace(/\s/g, '');
        if (cleaned.startsWith('4')) return 'Visa';
        if (cleaned.startsWith('5')) return 'Mastercard';
        if (cleaned.startsWith('6')) return 'RuPay';
        return 'Unknown';
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s/g, '');
        if (value.length <= 16 && /^\d*$/.test(value)) {
            setCardNumber(formatCardNumber(value));
            if (value.length >= 4) {
                onCardChange({
                    last4: value.slice(-4),
                    cardType: detectCardType(value),
                });
            }
        }
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 4) {
            setExpiry(formatExpiry(value));
        }
    };

    const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 3 && /^\d*$/.test(value)) {
            setCvv(value);
        }
    };

    return (
        <div className="space-y-4 mt-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-800 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <strong>Secure Payment:</strong> You will be redirected to a secure payment gateway to complete this transaction.
                </p>
            </div>
        </div>
    );
}
