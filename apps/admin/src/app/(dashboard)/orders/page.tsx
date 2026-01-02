"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Eye, Bike, Bell, FileText, ExternalLink, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { format } from "date-fns"

export const dynamic = 'force-dynamic'


import api from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type OrderItem = {
    id: string
    name: string
    quantity: number
    price: number
    options?: any
    addons?: any
}

type Order = {
    id: string
    orderNumber: number
    user?: {
        name: string
        email: string
        phone?: string
    }
    customerName?: string
    customerPhone?: string
    status: "SCHEDULED" | "PENDING" | "ACCEPTED" | "PREPARING" | "BAKING" | "READY_FOR_PICKUP" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED"
    total: number
    subtotal?: number
    tax?: number
    items: OrderItem[]
    createdAt: string
    paymentMethod: string
    paymentStatus: string
    deliveryPartnerId?: string
    deliveryPartner?: {
        name: string
        phone: string
    }
    orderType: "INSTANT" | "SCHEDULED"
    scheduledFor?: string
    invoiceNumber?: string
    taxBreakup?: {
        cgstRate: number
        cgstAmount: number
        sgstRate: number
        sgstAmount: number
        totalTax: number
    }
}

type DeliveryPartner = {
    id: string
    name: string
    status: "AVAILABLE" | "BUSY" | "OFFLINE"
}

const ORDER_STATUSES = [
    { value: "ALL", label: "All Orders" },
    { value: "SCHEDULED", label: "Scheduled", color: "bg-blue-50 text-blue-700" },
    { value: "PENDING", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    { value: "ACCEPTED", label: "Accepted", color: "bg-blue-100 text-blue-800" },
    { value: "PREPARING", label: "Preparing", color: "bg-orange-100 text-orange-800" },
    { value: "BAKING", label: "Baking", color: "bg-orange-200 text-orange-900" },
    { value: "READY_FOR_PICKUP", label: "Ready", color: "bg-purple-100 text-purple-800" },
    { value: "OUT_FOR_DELIVERY", label: "Out for Delivery", color: "bg-indigo-100 text-indigo-800" },
    { value: "DELIVERED", label: "Delivered", color: "bg-green-100 text-green-800" },
    { value: "CANCELLED", label: "Cancelled", color: "bg-red-100 text-red-800" },
]

export default function OrdersPage() {
    const searchParams = useSearchParams()
    const statusParam = searchParams.get('status')

    const getInitialFilter = () => {
        if (statusParam === 'active') {
            return 'ACTIVE'
        }
        return statusParam?.toUpperCase() || 'ALL'
    }

    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>(getInitialFilter())
    const [activeTab, setActiveTab] = useState("active") // 'active' (Instant) or 'scheduled'
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isAssignPartnerOpen, setIsAssignPartnerOpen] = useState(false)
    const [deliveryPartners, setDeliveryPartners] = useState<DeliveryPartner[]>([])
    const [selectedPartnerId, setSelectedPartnerId] = useState<string>("")
    const [notificationLogs, setNotificationLogs] = useState<any[]>([])

    const audioRef = useRef<HTMLAudioElement | null>(null)
    const prevOrdersCountRef = useRef(0)

    useEffect(() => {
        audioRef.current = new Audio("/sounds/notification.mp3")
        fetchOrders()
        fetchDeliveryPartners()

        const interval = setInterval(fetchOrders, 30000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (isDetailsOpen && selectedOrder) {
            fetchNotificationLogs(selectedOrder.id)
        }
    }, [isDetailsOpen, selectedOrder])

    const fetchOrders = async () => {
        try {
            const res = await api.get("/orders")
            const newOrders = res.data
            if (prevOrdersCountRef.current > 0 && newOrders.length > prevOrdersCountRef.current) {
                toast.info("New order received!", { icon: <Bell className="h-4 w-4" /> })
                audioRef.current?.play().catch(e => console.log("Audio play failed", e))
            }
            prevOrdersCountRef.current = newOrders.length
            setOrders(newOrders)
        } catch (error) {
            console.error("Failed to fetch orders", error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchDeliveryPartners = async () => {
        try {
            const res = await api.get("/delivery-partners")
            setDeliveryPartners(res.data)
        } catch (error) {
            console.error("Failed to fetch delivery partners", error)
        }
    }

    const fetchNotificationLogs = async (orderId: string) => {
        try {
            const res = await api.get(`/orders/${orderId}/notifications`)
            setNotificationLogs(res.data)
        } catch (error) {
            console.error("Failed to fetch notification logs", error)
            setNotificationLogs([])
        }
    }

    const [isUpdating, setIsUpdating] = useState(false)



    const updateStatus = async (id: string, newStatus: string) => {
        if (isUpdating) return
        setIsUpdating(true)
        try {
            await api.put(`/orders/${id}/status`, { status: newStatus })
            toast.success(`Order status updated to ${newStatus}`)
            fetchOrders()
        } catch (error) {
            toast.error("Failed to update status")
        } finally {
            setIsUpdating(false)
        }
    }

    const assignPartner = async () => {
        if (!selectedOrder || !selectedPartnerId || isUpdating) return
        setIsUpdating(true)
        try {
            await api.put(`/orders/${selectedOrder.id}/assign-partner`, { deliveryPartnerId: selectedPartnerId })
            toast.success("Delivery partner assigned")
            setIsAssignPartnerOpen(false)
            fetchOrders()
        } catch (error) {
            toast.error("Failed to assign partner")
        } finally {
            setIsUpdating(false)
        }
    }



    const filteredOrders = orders.filter(order => {
        // Tab Filter
        if (activeTab === 'scheduled') {
            if (order.orderType !== 'SCHEDULED' && order.status !== 'SCHEDULED') return false;
        } else {
            if (order.status === 'SCHEDULED') return false;
        }

        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            `TPB${String(order.orderNumber).padStart(5, '0')}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.user?.name || order.customerName || "Guest").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (order.user?.email || "").toLowerCase().includes(searchQuery.toLowerCase())

        let matchesStatus = false
        if (statusFilter === "ACTIVE") {
            matchesStatus = order.status !== "DELIVERED" && order.status !== "CANCELLED" && order.status !== "PENDING"
        } else if (statusFilter === "ALL") {
            matchesStatus = true
        } else {
            matchesStatus = order.status === statusFilter
        }

        return matchesSearch && matchesStatus
    })

    const getStatusColor = (status: string) => {
        return ORDER_STATUSES.find(s => s.value === status)?.color || "bg-gray-100 text-gray-800"
    }

    const handleDownloadInvoice = async (orderId: string) => {
        try {
            const response = await api.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice-${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to download invoice', error);
            toast.error('Failed to download invoice');
        }
    };

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Orders</h2>
                    <p className="text-slate-500 mt-1">Manage and track customer orders.</p>
                </div>
                <Button onClick={fetchOrders} variant="outline" size="sm">
                    Refresh
                </Button>
            </div>

            <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="active">Active / Instant</TabsTrigger>
                    <TabsTrigger value="scheduled">
                        Scheduled
                        <Badge className="ml-2 bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">
                            {orders.filter(o => o.status === 'SCHEDULED').length}
                        </Badge>
                    </TabsTrigger>
                </TabsList>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Search orders..."
                                className="pl-9 bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {activeTab === 'active' && (
                        <div className="w-full overflow-x-auto bg-white p-1 border rounded-md mb-2">
                            <div className="flex gap-2">
                                {ORDER_STATUSES.filter(s => s.value !== 'SCHEDULED').map(status => (
                                    <button
                                        key={status.value}
                                        onClick={() => setStatusFilter(status.value)}
                                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${statusFilter === status.value
                                            ? 'bg-orange-100 text-orange-900'
                                            : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        {status.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="rounded-xl border bg-white shadow-sm overflow-hidden mt-4">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Items</TableHead>
                                {activeTab === 'scheduled' ? (
                                    <TableHead>Scheduled For</TableHead>
                                ) : (
                                    <TableHead>Date</TableHead>
                                )}
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                {activeTab === 'active' && <TableHead>Delivery</TableHead>}
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-10">Loading...</TableCell>
                                </TableRow>
                            ) : filteredOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-10 text-slate-500">No orders found</TableCell>
                                </TableRow>
                            ) : (
                                filteredOrders.map((order) => (
                                    <TableRow key={order.id} className="hover:bg-slate-50/50">
                                        <TableCell className="font-mono text-xs font-bold text-orange-600">
                                            TPB{String(order.orderNumber).padStart(5, '0')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{order.user?.name || order.customerName || "Guest"}</div>
                                            <div className="text-xs text-slate-500">{order.user?.email || order.customerPhone || "Walk-in"}</div>
                                        </TableCell>
                                        <TableCell className="max-w-[300px]">
                                            <div className="text-sm text-slate-700 line-clamp-2">
                                                {order.items.map(i => `${i.name} x${i.quantity}`).join(", ")}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {activeTab === 'scheduled' && order.scheduledFor ? (
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-blue-700">
                                                        {format(new Date(order.scheduledFor), "MMM d, h:mm a")}
                                                    </span>
                                                    {/* Simple Countdown helper */}
                                                    <span className="text-[10px] text-slate-500">
                                                        {(() => {
                                                            const diff = new Date(order.scheduledFor).getTime() - Date.now();
                                                            const hours = Math.floor(diff / (1000 * 60 * 60));
                                                            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                                            if (diff < 0) return "Past due";
                                                            return `in ${hours}h ${mins}m`;
                                                        })()}
                                                    </span>
                                                </div>
                                            ) : (
                                                format(new Date(order.createdAt), "MMM d, h:mm a")
                                            )}
                                        </TableCell>
                                        <TableCell>{formatCurrency(order.total)}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`${getStatusColor(order.status)} border-0`}>
                                                {ORDER_STATUSES.find(s => s.value === order.status)?.label}
                                            </Badge>
                                        </TableCell>
                                        {activeTab === 'active' && (
                                            <TableCell>
                                                {order.deliveryPartner ? (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Bike className="h-4 w-4" />
                                                        {order.deliveryPartner.name}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400">Unassigned</span>
                                                )}
                                            </TableCell>
                                        )}
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {order.status === 'SCHEDULED' && (
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700 h-8 text-xs"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (confirm('Activate this order now? It will move to Pending.')) {
                                                                updateStatus(order.id, 'PENDING');
                                                            }
                                                        }}
                                                    >
                                                        Activate
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSelectedOrder(order)
                                                        setIsDetailsOpen(true)
                                                    }}
                                                >
                                                    <Eye className="h-4 w-4 text-slate-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link href={`/orders/${order.id}`}>
                                                        <ExternalLink className="h-4 w-4 text-orange-600" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </Tabs>

            {/* Order Details Dialog */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <div className="flex justify-between items-start mr-4">
                            <div className="space-y-1">
                                <DialogTitle className="flex items-center gap-2">
                                    Order Details
                                    {/* @ts-ignore */}
                                    {selectedOrder?.isRepeated && (
                                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-[10px] uppercase">
                                            Repeated Order
                                        </Badge>
                                    )}
                                    {/* @ts-ignore */}
                                    {selectedOrder?.status === 'SCHEDULED' && (
                                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-[10px] uppercase">
                                            Scheduled
                                        </Badge>
                                    )}
                                </DialogTitle>
                                <DialogDescription>
                                    Order ID: TPB{String(selectedOrder?.orderNumber).padStart(5, '0')}
                                </DialogDescription>
                            </div>
                            {selectedOrder && (
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2 h-8 text-xs bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                                        onClick={() => handleDownloadInvoice(selectedOrder.id)}
                                    >
                                        <FileText className="h-3 w-3" />
                                        Invoice
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center gap-2 h-8 text-xs bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100"
                                        asChild
                                    >
                                        <Link href={`/orders/${selectedOrder.id}`}>
                                            <ExternalLink className="h-3 w-3" />
                                            Full Page
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </DialogHeader>

                    {selectedOrder && (
                        <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="details">Details</TabsTrigger>
                                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                            </TabsList>
                            <TabsContent value="details" className="space-y-6 mt-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="font-semibold text-slate-500">Customer</div>
                                        <div>{selectedOrder.user?.name || selectedOrder.customerName || "Guest"}</div>
                                        <div>{selectedOrder.user?.email}</div>
                                        <div>{selectedOrder.user?.phone || selectedOrder.customerPhone || "No phone"}</div>
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-500">Payment</div>
                                        <div className="flex items-center gap-2">
                                            {selectedOrder.paymentMethod}
                                            {/* @ts-ignore */}
                                            {selectedOrder.paymentDetails?.razorpay_payment_id && (
                                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px] flex gap-1 items-center">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                    Razorpay Verified
                                                </Badge>
                                            )}
                                        </div>
                                        <Badge variant={selectedOrder.paymentStatus === "PAID" ? "default" : "secondary"}>
                                            {selectedOrder.paymentStatus}
                                        </Badge>
                                    </div>
                                </div>

                                {/* @ts-ignore */}
                                {selectedOrder.scheduledFor && (
                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                        <div className="text-xs font-bold text-blue-800 uppercase mb-1">Scheduled For</div>
                                        <div className="text-lg font-bold text-blue-900">
                                            {/* @ts-ignore */}
                                            {format(new Date(selectedOrder.scheduledFor), "MMMM d, yyyy 'at' h:mm a")}
                                        </div>
                                    </div>
                                )}

                                {/* Delivery & Delay Warning */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    {selectedOrder.deliveryPartner ? (
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Delivery Partner</div>
                                            <div className="flex items-center gap-2">
                                                <Bike className="h-4 w-4 text-slate-700" />
                                                <div className="font-semibold text-slate-900">{selectedOrder.deliveryPartner.name}</div>
                                            </div>
                                            <div className="text-xs text-slate-500 mt-1">{selectedOrder.deliveryPartner.phone}</div>
                                        </div>
                                    ) : (
                                        selectedOrder.status !== "DELIVERED" && selectedOrder.status !== "CANCELLED" && selectedOrder.orderType !== "SCHEDULED" && (
                                            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                                                <div className="flex items-center gap-2 text-yellow-800">
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <span className="text-sm font-medium">No Delivery Partner</span>
                                                </div>
                                                <Button size="sm" variant="outline" className="mt-2 w-full h-8 text-xs bg-white hover:bg-yellow-50" onClick={() => {
                                                    setIsDetailsOpen(false)
                                                    setIsAssignPartnerOpen(true)
                                                }}>
                                                    Assign Now
                                                </Button>
                                            </div>
                                        )
                                    )}

                                    {/* Delay Warning */}
                                    {(() => {
                                        const created = new Date(selectedOrder.createdAt).getTime();
                                        const now = Date.now();
                                        const diffMinutes = Math.floor((now - created) / 60000);
                                        // Warning if > 45 mins and not delivered/cancelled/out
                                        const isActive = ['PENDING', 'ACCEPTED', 'PREPARING', 'BAKING', 'READY_FOR_PICKUP'].includes(selectedOrder.status);
                                        if (isActive && diffMinutes > 45) {
                                            return (
                                                <div className="bg-red-50 p-3 rounded-lg border border-red-100 animate-pulse">
                                                    <div className="flex items-center gap-2 text-red-800">
                                                        <AlertTriangle className="h-4 w-4" />
                                                        <span className="text-sm font-bold">Delay Warning</span>
                                                    </div>
                                                    <div className="text-xs text-red-600 mt-1">
                                                        Placed {diffMinutes} mins ago. Check Status!
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return null;
                                    })()}
                                </div>

                                <div>
                                    <div className="font-semibold text-slate-500 mb-2">Items</div>
                                    <div className="space-y-3">
                                        {selectedOrder.items.map((item, index) => (
                                            <div key={index} className="flex justify-between items-start border-b pb-3 last:border-0">
                                                <div>
                                                    <div className="font-medium">{item.name} <span className="text-slate-500">x{item.quantity}</span></div>
                                                    {/* @ts-ignore */}
                                                    {item.variants && Object.values(item.variants).length > 0 && (
                                                        <div className="text-xs text-slate-500 mt-1">
                                                            {/* @ts-ignore */}
                                                            {Object.values(item.variants).map((v: any) => v.label).join(' | ')}
                                                        </div>
                                                    )}
                                                    {/* @ts-ignore */}
                                                    {item.options && Object.values(item.options).length > 0 && (
                                                        <div className="text-xs text-slate-500 mt-1">
                                                            {/* @ts-ignore */}
                                                            {Object.values(item.options).map((opt: any) => opt.name).join(', ')}
                                                        </div>
                                                    )}
                                                    {/* @ts-ignore */}
                                                    {item.addons && item.addons.length > 0 && (
                                                        <div className="text-xs text-slate-500 mt-1">
                                                            {/* @ts-ignore */}
                                                            + {item.addons.map((addon: any) => addon.name).join(', ')}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>{formatCurrency(item.price * item.quantity)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2 pt-4 border-t">
                                    <div className="flex justify-between items-center text-sm text-slate-600">
                                        <div>Subtotal</div>
                                        {/* If subtotal exists use it, else assume total is subtotal if no tax */}
                                        <div>{formatCurrency(selectedOrder.subtotal ?? selectedOrder.total)}</div>
                                    </div>

                                    {selectedOrder.taxBreakup ? (
                                        <>
                                            <div className="flex justify-between items-center text-sm text-slate-500">
                                                <div>CGST ({selectedOrder.taxBreakup.cgstRate}%)</div>
                                                <div>{formatCurrency(selectedOrder.taxBreakup.cgstAmount)}</div>
                                            </div>
                                            <div className="flex justify-between items-center text-sm text-slate-500">
                                                <div>SGST ({selectedOrder.taxBreakup.sgstRate}%)</div>
                                                <div>{formatCurrency(selectedOrder.taxBreakup.sgstAmount)}</div>
                                            </div>
                                        </>
                                    ) : (
                                        selectedOrder.tax ? (
                                            <div className="flex justify-between items-center text-sm text-slate-500">
                                                <div>Tax</div>
                                                <div>{formatCurrency(selectedOrder.tax)}</div>
                                            </div>
                                        ) : null
                                    )}

                                    <div className="flex justify-between items-center text-lg font-bold border-t pt-2 mt-2">
                                        <div>Total</div>
                                        <div className="text-orange-600">{formatCurrency(selectedOrder.total)}</div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t space-y-4">
                                    <div className="font-semibold text-slate-500">Actions</div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedOrder.status === "SCHEDULED" && (
                                            <Button onClick={() => updateStatus(selectedOrder.id, "PENDING")} disabled={isUpdating} className="bg-green-600 hover:bg-green-700">
                                                Activate / Move to Pending
                                            </Button>
                                        )}
                                        {selectedOrder.status === "PENDING" && (
                                            <Button onClick={() => updateStatus(selectedOrder.id, "ACCEPTED")} disabled={isUpdating} className="bg-blue-500 hover:bg-blue-600">
                                                Accept Order
                                            </Button>
                                        )}
                                        {selectedOrder.status === "ACCEPTED" && (
                                            <Button onClick={() => updateStatus(selectedOrder.id, "PREPARING")} disabled={isUpdating} className="bg-yellow-500 hover:bg-yellow-600">
                                                Start Preparing
                                            </Button>
                                        )}
                                        {selectedOrder.status === "PREPARING" && (
                                            <Button onClick={() => updateStatus(selectedOrder.id, "BAKING")} disabled={isUpdating} className="bg-orange-500 hover:bg-orange-600">
                                                Start Baking
                                            </Button>
                                        )}
                                        {selectedOrder.status === "BAKING" && (
                                            <Button onClick={() => updateStatus(selectedOrder.id, "READY_FOR_PICKUP")} disabled={isUpdating} className="bg-purple-500 hover:bg-purple-600">
                                                Ready for Pickup
                                            </Button>
                                        )}
                                        {selectedOrder.status === "READY_FOR_PICKUP" && (
                                            <Button
                                                onClick={() => {
                                                    setIsDetailsOpen(false)
                                                    setIsAssignPartnerOpen(true)
                                                }}
                                                disabled={isUpdating}
                                                className="bg-indigo-500 hover:bg-indigo-600"
                                            >
                                                Assign Delivery Partner
                                            </Button>
                                        )}
                                        {selectedOrder.status === "OUT_FOR_DELIVERY" && (
                                            <Button onClick={() => updateStatus(selectedOrder.id, "DELIVERED")} disabled={isUpdating} className="bg-green-500 hover:bg-green-600">
                                                Mark Delivered
                                            </Button>
                                        )}
                                        {selectedOrder.status !== "DELIVERED" && selectedOrder.status !== "CANCELLED" && (
                                            <Button variant="destructive" disabled={isUpdating} onClick={() => updateStatus(selectedOrder.id, "CANCELLED")}>
                                                Cancel Order
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="notifications" className="space-y-4 mt-4">
                                <div className="space-y-4">
                                    {notificationLogs.length === 0 ? (
                                        <div className="text-center text-slate-500 py-8">No notifications sent yet</div>
                                    ) : (
                                        notificationLogs.map((log) => (
                                            <div key={log.id} className="border rounded-lg p-3 bg-white text-sm">
                                                <div className="flex justify-between items-center mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className={`
                                                                ${log.channel === 'LOG' ? 'bg-gray-100' : ''}
                                                                ${log.channel === 'SMS' ? 'bg-blue-50 text-blue-700' : ''}
                                                                ${log.channel === 'WHATSAPP' ? 'bg-green-50 text-green-700' : ''}
                                                                ${log.channel === 'EMAIL' ? 'bg-yellow-50 text-yellow-700' : ''}
                                                            `}>{log.channel}</Badge>
                                                        <span className="font-semibold text-slate-700">{log.event.replace(/_/g, ' ')}</span>
                                                    </div>
                                                    <span className="text-xs text-slate-400">
                                                        {format(new Date(log.createdAt), 'MMM d, h:mm a')}
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 mt-2 bg-slate-50 p-2 rounded italic">
                                                    "{log.message}"
                                                </p>
                                                <div className="mt-2 flex justify-end">
                                                    <Badge className={`
                                                            ${log.status === 'SENT' ? 'bg-green-100 text-green-800' : ''}
                                                            ${log.status === 'FAILED' ? 'bg-red-100 text-red-800' : ''}
                                                            ${log.status === 'SKIPPED' ? 'bg-gray-200 text-gray-800' : ''}
                                                            ${log.status === 'QUEUED' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                        `}>
                                                        {log.status}
                                                    </Badge>
                                                </div>
                                                {log.error && (
                                                    <div className="mt-2 text-xs text-red-600 font-mono bg-red-50 p-1 rounded">
                                                        Error: {log.error}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                </DialogContent>
            </Dialog>

            {/* Assign Partner Dialog */}
            <Dialog open={isAssignPartnerOpen} onOpenChange={setIsAssignPartnerOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Delivery Partner</DialogTitle>
                        <DialogDescription>
                            Select a delivery partner for order TPB{String(selectedOrder?.orderNumber).padStart(5, '0')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Select value={selectedPartnerId} onValueChange={setSelectedPartnerId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a partner" />
                            </SelectTrigger>
                            <SelectContent>
                                {deliveryPartners.map(partner => (
                                    <SelectItem
                                        key={partner.id}
                                        value={partner.id}
                                        disabled={partner.status !== "AVAILABLE"}
                                    >
                                        {partner.name} ({partner.status})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAssignPartnerOpen(false)}>Cancel</Button>
                        <Button onClick={assignPartner} disabled={!selectedPartnerId}>Assign Partner</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
