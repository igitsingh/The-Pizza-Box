'use client';

import { useEffect } from 'react';

export const dynamic = 'force-dynamic';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">
            <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
            <button
                onClick={() => reset()}
                className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
            >
                Try again
            </button>
        </div>
    );
}
