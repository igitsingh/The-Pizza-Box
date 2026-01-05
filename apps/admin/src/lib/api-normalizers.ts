/**
 * PRODUCTION RUNTIME SAFETY - API Response Normalization
 * 
 * ZERO TOLERANCE RULES:
 * 1. NO raw API data consumed by components
 * 2. ALL arrays default to []
 * 3. ALL objects default to {}
 * 4. ALL nullable fields explicitly handled
 */

import { AxiosResponse } from 'axios';

// Dashboard Stats Schema
export interface DashboardStats {
    totalSales: number;
    pending: number;
    preparing: number;
    onDelivery: number;
    lowStock: number;
    complaints: number;
    feedbacks: number;
}

export function normalizeDashboardStats(data: any): DashboardStats {
    // ✅ FIXED: Map actual backend field names
    return {
        totalSales: Number(data?.totalSalesToday) || 0,        // backend: totalSalesToday
        pending: Number(data?.pendingOrders) || 0,             // backend: pendingOrders
        preparing: Number(data?.preparingOrders) || 0,         // backend: preparingOrders
        onDelivery: Number(data?.outForDeliveryOrders) || 0,   // backend: outForDeliveryOrders
        lowStock: Number(data?.lowStockItems) || 0,            // backend: lowStockItems
        complaints: Number(data?.newComplaints) || 0,          // backend: newComplaints
        feedbacks: Number(data?.newFeedbacks) || 0,            // backend: newFeedbacks
    };
}

// Sales Trend Schema
export interface SalesTrendPoint {
    date: string;
    sales: number;
}

export function normalizeSalesTrend(data: any): SalesTrendPoint[] {
    if (!Array.isArray(data)) return [];

    return data.map(point => ({
        date: String(point?.date || point?._id || ''),
        sales: Number(point?.sales || point?.total || 0),
    }));
}

// Top Items Schema
export interface TopItem {
    id: string;
    name: string;
    sales: number;
    revenue: number;
}

export function normalizeTopItems(data: any): TopItem[] {
    if (!Array.isArray(data)) return [];

    return data.map(item => ({
        id: String(item?.id || item?._id || ''),
        name: String(item?.name || 'Unknown Item'),
        sales: Number(item?.sales || item?.count || 0),
        revenue: Number(item?.revenue || item?.total || 0),
    }));
}

// Delivery Partner Schema
export interface DeliveryPartner {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    vehicleType: string;
    vehicleNumber: string;
    isActive: boolean;
    currentOrders: number;
}

export function normalizeDeliveryPartner(data: any): DeliveryPartner {
    return {
        id: String(data?.id || ''),
        name: String(data?.name || 'Unknown'),
        phone: String(data?.phone || ''),
        email: data?.email || null,
        vehicleType: String(data?.vehicleType || 'BIKE'),
        vehicleNumber: String(data?.vehicleNumber || ''),
        isActive: Boolean(data?.isActive ?? true),
        currentOrders: Number(data?.currentOrders || data?._count?.orders || 0),
    };
}

export function normalizeDeliveryPartners(data: any): DeliveryPartner[] {
    if (!Array.isArray(data)) return [];
    return data.map(normalizeDeliveryPartner);
}

// Customer Schema
export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    createdAt: string;
    orderCount: number;
}

export function normalizeCustomer(data: any): Customer {
    return {
        id: String(data?.id || ''),
        name: String(data?.name || 'Unknown'),
        email: String(data?.email || ''),
        phone: data?.phone || null,
        role: String(data?.role || 'CUSTOMER'),
        createdAt: String(data?.createdAt || new Date().toISOString()),
        orderCount: Number(data?._count?.orders || 0),
    };
}

export function normalizeCustomers(data: any): Customer[] {
    if (!Array.isArray(data)) return [];
    return data.map(normalizeCustomer);
}

// Generic API Response Normalizer
export function normalizeApiResponse<T>(
    response: AxiosResponse,
    normalizer: (data: any) => T,
    defaultValue: T
): T {
    try {
        if (!response || !response.data) {
            console.warn('API response missing data, using default');
            return defaultValue;
        }
        return normalizer(response.data);
    } catch (error) {
        console.error('Failed to normalize API response:', error);
        return defaultValue;
    }
}

// Error Response Schema
export interface ApiError {
    message: string;
    status: number;
    endpoint: string;
    timestamp: string;
}

export function normalizeApiError(error: any, endpoint: string): ApiError {
    return {
        message: error?.response?.data?.message || error?.message || 'Unknown error',
        status: error?.response?.status || 500,
        endpoint,
        timestamp: new Date().toISOString(),
    };
}
