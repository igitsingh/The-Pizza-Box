"use client"
import { useState, useEffect } from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    ShoppingBag,
    UtensilsCrossed,
    List,
    Ticket,
    Settings,
    Users,
    LogOut,
    Bike,
    BarChart3,
    CreditCard,
    MessageSquareWarning,
    MapPin,
    UserCircle,
    Pizza,
    Trophy,
    Package,
    MessageSquare,
    ChefHat,
    Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { logout } from "@/lib/auth" // ✅ ADDED: Production-safe logout
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Kitchen Board",
        href: "/kitchen",
        icon: ChefHat,
    },
    {
        title: "Orders",
        href: "/orders",
        icon: ShoppingBag,
    },
    {
        title: "Menu Items",
        href: "/menu",
        icon: UtensilsCrossed,
    },
    {
        title: "Categories",
        href: "/categories",
        icon: List,
    },
    {
        title: "Locations",
        href: "/locations",
        icon: MapPin,
    },
    {
        title: "Inventory",
        href: "/stock",
        icon: Package,
    },
    {
        title: "Coupons",
        href: "/coupons",
        icon: Ticket,
    },
    {
        title: "Referrals",
        href: "/referrals",
        icon: Users,
    },
    {
        title: "Memberships",
        href: "/memberships",
        icon: Trophy,
    },
    {
        title: "Delivery Partners",
        href: "/delivery-partners",
        icon: Bike,
    },
    {
        title: "Customers",
        href: "/customers",
        icon: UserCircle,
    },
    {
        title: "Analytics",
        href: "/analytics",
        icon: BarChart3,
    },
    {
        title: "Payments",
        href: "/payments",
        icon: CreditCard,
    },
    {
        title: "Complaints",
        href: "/complaints",
        icon: MessageSquareWarning,
    },
    {
        title: "Feedbacks",
        href: "/feedbacks",
        icon: Star,
    },
    {
        title: "Enquiries",
        href: "/enquiries",
        icon: MessageSquare,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
]

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
    const pathname = usePathname()
    const router = useRouter()
    const [orderStats, setOrderStats] = useState<{
        pending: number,
        active: number,
        complaintsOpen: number,
        feedbacksNew: number,
        enquiriesNew: number
    }>({
        pending: 0,
        active: 0,
        complaintsOpen: 0,
        feedbacksNew: 0,
        enquiriesNew: 0
    })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/orders/stats")
                setOrderStats(res.data)
            } catch (error) {
                console.error("Failed to fetch stats", error)
            }
        }

        fetchStats()
        // Poll every 30 seconds (Smart Polling - Reduced from 15s)
        const interval = setInterval(fetchStats, 30000)
        return () => clearInterval(interval)
    }, [])

    // ✅ FIXED: Frontend-authoritative logout - ALWAYS succeeds
    const handleLogout = async () => {
        toast.info("Logging out...");
        await logout(api); // Clears auth, tries API, redirects - NEVER fails
        // Note: redirect happens in logout(), this code won't execute
    }

    return (
        <div className="flex h-full w-64 flex-col bg-[#111827] text-white border-r border-gray-800">
            <div className="flex h-20 items-center px-6 border-b border-gray-800">
                <Link href="/" className="flex items-center gap-3 font-bold text-xl tracking-tight">
                    <div className="h-10 w-10 rounded-xl bg-orange-600 flex items-center justify-center shadow-lg shadow-orange-900/20">
                        <Pizza className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-white">The Pizza Box</span>
                </Link>
            </div>
            <div className="flex-1 overflow-y-auto py-6">
                <nav className="grid gap-2 px-4">
                    {sidebarItems.map((item, index) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                onClick={onNavigate}
                                className={cn(
                                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-orange-600 text-white shadow-md shadow-orange-900/20"
                                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-400")} />
                                <span className="flex-1">{item.title}</span>
                                {item.title === 'Orders' && orderStats.pending > 0 && (
                                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center animate-pulse">
                                        {orderStats.pending}
                                    </span>
                                )}
                                {item.title === 'Kitchen Board' && orderStats.active > 0 && (
                                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                        {orderStats.active}
                                    </span>
                                )}
                                {item.title === 'Complaints' && orderStats.complaintsOpen > 0 && (
                                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                        {orderStats.complaintsOpen}
                                    </span>
                                )}
                                {item.title === 'Feedbacks' && orderStats.feedbacksNew > 0 && (
                                    <span className="bg-yellow-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                        {orderStats.feedbacksNew}
                                    </span>
                                )}
                                {item.title === 'Enquiries' && orderStats.enquiriesNew > 0 && (
                                    <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                        {orderStats.enquiriesNew}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>
            </div>
            <div className="p-4 border-t border-gray-800">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-xl py-6"
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
