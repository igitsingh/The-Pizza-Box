"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Bar,
    BarChart,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts"
import api from "@/lib/api"
import { toast } from "sonner"
import { formatCurrency } from "@/lib/utils"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function AnalyticsPage() {
    const [salesTrend, setSalesTrend] = useState([])
    const [topItems, setTopItems] = useState([])
    const [orderStatusData, setOrderStatusData] = useState([])
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [trendRes, topItemsRes, statusRes, statsRes] = await Promise.all([
                    api.get('/metrics/sales-trend?range=month'),
                    api.get('/metrics/top-items'),
                    api.get('/metrics/orders-by-status'),
                    api.get('/metrics/stats')
                ]);

                setSalesTrend(trendRes.data);
                setTopItems(topItemsRes.data);
                setOrderStatusData(statusRes.data);
                setStats(statsRes.data);
            } catch (error) {
                console.error("Failed to fetch analytics", error);
                toast.error("Failed to load analytics data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6 bg-slate-50/50 min-h-screen">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Analytics</h2>
                    <p className="text-slate-500 mt-1">Deep dive into your restaurant's performance metrics.</p>
                </div>
            </div>

            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider text-[10px]">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.totalSalesToday)}</div>
                            <p className="text-xs text-slate-400 mt-1">Generated today</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider text-[10px]">Total Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalOrdersToday}</div>
                            <p className="text-xs text-slate-400 mt-1">Placed today</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider text-[10px]">Repeat Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats.repeatCustomerRate}%</div>
                            <p className="text-xs text-slate-400 mt-1">Loyalty strength</p>
                        </CardContent>
                    </Card>
                    <Card className="border-none shadow-sm bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider text-[10px]">Active Customers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers}</div>
                            <p className="text-xs text-slate-400 mt-1">Total registered base</p>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Sales Trend Chart */}
                <Card className="col-span-4 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Revenue Trend (Last 30 Days)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={salesTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `₹${value}`}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number) => [`₹${value}`, 'Revenue']}
                                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                />
                                <Line type="monotone" dataKey="sales" stroke="#ea580c" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Order Status Distribution */}
                <Card className="col-span-3 border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Order Status Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={orderStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-1">
                {/* Top Items Bar Chart */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle>Top Selling Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topItems} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="count" fill="#ea580c" radius={[0, 4, 4, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
