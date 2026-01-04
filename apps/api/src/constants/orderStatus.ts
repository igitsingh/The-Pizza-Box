/**
 * SINGLE SOURCE OF TRUTH FOR ORDER STATUS
 * 
 * This file defines the canonical order status values used throughout the system.
 * ALL status references must use these constants to prevent enum mismatches.
 * 
 * CRITICAL: These values MUST match the Prisma OrderStatus enum exactly.
 */

import { OrderStatus } from '@prisma/client';

/**
 * Order Status Constants
 * Use these instead of hardcoded strings
 */
export const ORDER_STATUS = {
    SCHEDULED: 'SCHEDULED' as OrderStatus,
    PENDING: 'PENDING' as OrderStatus,
    ACCEPTED: 'ACCEPTED' as OrderStatus,
    PREPARING: 'PREPARING' as OrderStatus,
    BAKING: 'BAKING' as OrderStatus,
    READY_FOR_PICKUP: 'READY_FOR_PICKUP' as OrderStatus,
    OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY' as OrderStatus,
    DELIVERED: 'DELIVERED' as OrderStatus,
    CANCELLED: 'CANCELLED' as OrderStatus,
    REFUNDED: 'REFUNDED' as OrderStatus,
} as const;

/**
 * Status Groups for Kitchen Board
 */
export const KITCHEN_STATUS_GROUPS = {
    // New orders awaiting acceptance
    PENDING: [ORDER_STATUS.PENDING],

    // Orders being prepared in kitchen
    KITCHEN: [
        ORDER_STATUS.ACCEPTED,
        ORDER_STATUS.PREPARING,
        ORDER_STATUS.BAKING,
    ],

    // Orders ready for pickup/delivery
    READY: [ORDER_STATUS.READY_FOR_PICKUP],

    // Orders out for delivery
    OUT_FOR_DELIVERY: [ORDER_STATUS.OUT_FOR_DELIVERY],

    // Active orders (not completed/cancelled)
    ACTIVE: [
        ORDER_STATUS.PENDING,
        ORDER_STATUS.ACCEPTED,
        ORDER_STATUS.PREPARING,
        ORDER_STATUS.BAKING,
        ORDER_STATUS.READY_FOR_PICKUP,
        ORDER_STATUS.OUT_FOR_DELIVERY,
    ],

    // Completed orders
    COMPLETED: [
        ORDER_STATUS.DELIVERED,
        ORDER_STATUS.CANCELLED,
        ORDER_STATUS.REFUNDED,
    ],
} as const;

/**
 * Validate if a string is a valid OrderStatus
 */
export function isValidOrderStatus(status: string): status is OrderStatus {
    return Object.values(ORDER_STATUS).includes(status as OrderStatus);
}

/**
 * Safely parse order status from query parameter
 * Returns the status if valid, undefined otherwise
 */
export function parseOrderStatus(status: string | undefined): OrderStatus | undefined {
    if (!status) return undefined;

    const upperStatus = status.toUpperCase();

    // Try exact match first
    if (isValidOrderStatus(upperStatus)) {
        return upperStatus as OrderStatus;
    }

    // Try common variations
    const statusMap: Record<string, OrderStatus> = {
        'READY': ORDER_STATUS.READY_FOR_PICKUP,
        'OUT': ORDER_STATUS.OUT_FOR_DELIVERY,
        'DELIVERY': ORDER_STATUS.OUT_FOR_DELIVERY,
        'IN_KITCHEN': ORDER_STATUS.PREPARING,
        'KITCHEN': ORDER_STATUS.PREPARING,
    };

    return statusMap[upperStatus];
}

/**
 * Get human-readable status label
 */
export function getStatusLabel(status: OrderStatus): string {
    const labels: Record<OrderStatus, string> = {
        SCHEDULED: 'Scheduled',
        PENDING: 'Pending',
        ACCEPTED: 'Accepted',
        PREPARING: 'Preparing',
        BAKING: 'Baking',
        READY_FOR_PICKUP: 'Ready for Pickup',
        OUT_FOR_DELIVERY: 'Out for Delivery',
        DELIVERED: 'Delivered',
        CANCELLED: 'Cancelled',
        REFUNDED: 'Refunded',
    };

    return labels[status] || status;
}
