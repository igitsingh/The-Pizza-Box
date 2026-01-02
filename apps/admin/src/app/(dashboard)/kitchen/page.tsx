"use client"

import { useState, useEffect, useCallback } from "react"
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from "@hello-pangea/dnd"
import {
    Clock,
    ChefHat,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    PackageCheck,
    RefreshCcw,
    MapPin,
    Phone,
    Info,
    ArrowRight,
    ExternalLink
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

import api from "@/lib/api"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type OrderStatus = "SCHEDULED" | "PENDING" | "ACCEPTED" | "PREPARING" | "BAKING" | "READY_FOR_PICKUP" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED"

interface OrderItem {
    id: string
    itemId: string
    name: string
    quantity: number
    price: number
}

interface Order {
    id: string
    orderNumber: number // Update this to number as per schema, though string worked likely due to loose typing
    status: OrderStatus
    total: number
    createdAt: string
    customerName?: string
    customerPhone?: string
    user?: {
        name: string
        phone: string | null
    }
    deliveryType: string // This probably maps to orderType or is derived
    locationName?: string
    items: OrderItem[]
    notes?: string
}

const COLUMNS = {
    QUEUED: {
        id: "QUEUED",
        title: "Queued Orders",
        icon: <Clock className="h-5 w-5 text-blue-500" />,
        statuses: ["PENDING", "ACCEPTED"] as OrderStatus[],
        accent: "border-t-blue-500"
    },
    KITCHEN: {
        id: "KITCHEN",
        title: "In Kitchen",
        icon: <ChefHat className="h-5 w-5 text-orange-500" />,
        statuses: ["PREPARING", "BAKING"] as OrderStatus[],
        accent: "border-t-orange-500"
    },
    PACKAGING: {
        id: "PACKAGING",
        title: "Packaging / Ready",
        icon: <PackageCheck className="h-5 w-5 text-green-500" />,
        statuses: ["READY_FOR_PICKUP"] as OrderStatus[],
        accent: "border-t-green-500"
    }
}

export default function KitchenPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchOrders = useCallback(async () => {
        try {
            // Get active orders (not delivered or cancelled)
            const res = await api.get("/orders?active=true")
            // The API returns differently structured data sometimes, let's normalize
            // assuming /api/admin/orders
            setOrders(res.data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to sync with kitchen")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchOrders()
        const interval = setInterval(fetchOrders, 10000) // Poll every 10s for real-time feel
        return () => clearInterval(interval)
    }, [fetchOrders])

    const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
        const previousOrders = [...orders]
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))

        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus })
            toast.success(`Order updated to ${newStatus.toLowerCase().replace(/_/g, ' ')}`)
        } catch (error) {
            toast.error("Update failed. Reverting...")
            setOrders(previousOrders)
        }
    }

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result

        if (!destination) return
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return

        const orderId = draggableId
        const newColId = destination.droppableId

        // Map column ID to status
        let newStatus: OrderStatus = "PENDING"
        if (newColId === "QUEUED") newStatus = "ACCEPTED"
        else if (newColId === "KITCHEN") newStatus = "PREPARING"
        else if (newColId === "PACKAGING") newStatus = "READY_FOR_PICKUP"

        handleStatusUpdate(orderId, newStatus)
    }

    const getColumnOrders = (statuses: OrderStatus[]) => {
        return orders.filter(o => statuses.includes(o.status))
    }

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50/50">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCcw className="h-10 w-10 text-orange-600 animate-spin" />
                    <p className="text-slate-500 font-medium tracking-wide">Initializing Kitchen Comms...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-screen bg-slate-50/50 overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-600 p-2 rounded-lg">
                        <ChefHat className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kitchen Mission Control</h1>
                        <p className="text-slate-500 text-sm">Real-time "Day Boarding" Ops Board</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-semibold text-green-700 uppercase tracking-widest">Live Sync</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchOrders} className="gap-2">
                        <RefreshCcw className="h-4 w-4" />
                        Manual Sync
                    </Button>
                </div>
            </header>

            {/* Kanban Board */}
            <main className="flex-1 p-6 overflow-hidden">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex gap-6 h-full overflow-x-auto pb-4">
                        {Object.values(COLUMNS).map((column) => (
                            <div
                                key={column.id}
                                className="flex flex-col w-[350px] min-w-[350px] bg-slate-200/50 rounded-2xl border border-slate-200/60 shadow-inner"
                            >
                                <div className={cn(
                                    "px-5 py-4 flex items-center justify-between border-t-4 rounded-t-2xl bg-white/80 backdrop-blur-sm",
                                    column.accent
                                )}>
                                    <div className="flex items-center gap-2">
                                        {column.icon}
                                        <h2 className="font-bold text-slate-800 uppercase tracking-wider text-sm">{column.title}</h2>
                                    </div>
                                    <Badge variant="secondary" className="bg-slate-200 text-slate-700 font-bold px-2.5">
                                        {getColumnOrders(column.statuses).length}
                                    </Badge>
                                </div>

                                <Droppable droppableId={column.id}>
                                    {(provided, snapshot) => (
                                        <ScrollArea
                                            className={cn(
                                                "flex-1 p-3 transition-colors duration-200",
                                                snapshot.isDraggingOver ? "bg-orange-50/50" : ""
                                            )}
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            <div className="space-y-4 min-h-[500px]">
                                                {getColumnOrders(column.statuses).map((order, index) => (
                                                    <Draggable key={order.id} draggableId={order.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className={cn(
                                                                    "bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 active:scale-[0.98]",
                                                                    snapshot.isDragging ? "shadow-2xl ring-2 ring-orange-400 rotate-2 z-50 scale-105" : ""
                                                                )}
                                                            >
                                                                <CardContent className="p-4">
                                                                    <div className="flex justify-between items-start mb-3">
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <span className="text-[10px] font-black text-white bg-slate-900 px-1.5 py-0.5 rounded tracking-widest uppercase">
                                                                                    #{order.orderNumber || order.id.slice(-4).toUpperCase()}
                                                                                </span>
                                                                                <Badge variant="outline" className="text-[9px] border-orange-200 text-orange-700 bg-orange-50 font-bold px-1 py-0">
                                                                                    {order.status}
                                                                                </Badge>
                                                                            </div>
                                                                            <h3 className="font-bold text-slate-900 leading-tight">
                                                                                {order.user?.name || order.customerName || "Walk-in Guest"}
                                                                            </h3>
                                                                            {(order.user?.phone || order.customerPhone) && (
                                                                                <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                                                                                    <Phone className="h-3 w-3" />
                                                                                    <span className="text-xs font-medium">{order.user?.phone || order.customerPhone}</span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex flex-col items-end gap-2">
                                                                            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                                                <Clock className="h-3 w-3 text-slate-400" />
                                                                                <span className="text-xs font-bold text-slate-600">
                                                                                    {formatDistanceToNow(new Date(order.createdAt), { addSuffix: false })}
                                                                                </span>
                                                                            </div>
                                                                            <Link
                                                                                href={`/orders/${order.id}`}
                                                                                className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-orange-600"
                                                                            >
                                                                                <ExternalLink className="h-3.5 w-3.5" />
                                                                            </Link>
                                                                        </div>
                                                                    </div>

                                                                    <div className="space-y-2 mb-4">
                                                                        {order.items.map((item, idx) => (
                                                                            <div key={idx} className="flex items-center gap-2 group">
                                                                                <div className="h-5 w-5 rounded bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-black group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                                                                    {item.quantity}
                                                                                </div>
                                                                                <span className="text-sm font-semibold text-slate-700 flex-1 truncate uppercase">
                                                                                    {item.name}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>

                                                                    {order.notes && (
                                                                        <div className="bg-yellow-50 p-2.5 rounded-lg border border-yellow-100 flex gap-2 mb-4">
                                                                            <Info className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                                                                            <p className="text-[11px] text-yellow-800 font-bold italic leading-relaxed">
                                                                                "{order.notes}"
                                                                            </p>
                                                                        </div>
                                                                    )}

                                                                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-50">
                                                                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-slate-50 text-slate-500 border-slate-200">
                                                                            {order.deliveryType === "DELIVERY" ? <MapPin className="h-2 w-2 mr-1" /> : ""}
                                                                            {order.deliveryType}
                                                                        </Badge>

                                                                        <div className="flex gap-1">
                                                                            {order.status === "ACCEPTED" && (
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="ghost"
                                                                                    className="h-7 px-2 text-[10px] font-black uppercase text-orange-600 hover:bg-orange-50 hover:text-orange-700 gap-1"
                                                                                    onClick={() => handleStatusUpdate(order.id, "PREPARING")}
                                                                                >
                                                                                    Cook <ArrowRight className="h-3 w-3" />
                                                                                </Button>
                                                                            )}
                                                                            {order.status === "PREPARING" && (
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="ghost"
                                                                                    className="h-7 px-2 text-[10px] font-black uppercase text-orange-600 hover:bg-orange-50 hover:text-orange-700 gap-1"
                                                                                    onClick={() => handleStatusUpdate(order.id, "BAKING")}
                                                                                >
                                                                                    Bake <ArrowRight className="h-3 w-3" />
                                                                                </Button>
                                                                            )}
                                                                            {order.status === "BAKING" && (
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="ghost"
                                                                                    className="h-7 px-2 text-[10px] font-black uppercase text-green-600 hover:bg-green-50 hover:text-green-700 gap-1"
                                                                                    onClick={() => handleStatusUpdate(order.id, "READY_FOR_PICKUP")}
                                                                                >
                                                                                    Ready <ArrowRight className="h-3 w-3" />
                                                                                </Button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </CardContent>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        </ScrollArea>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </main>
        </div>
    )
}
