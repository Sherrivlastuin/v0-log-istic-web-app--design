"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, TrendingUp, Package, Truck, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Order {
  id: string
  sender_name: string
  recipient_name: string
  shipping_speed: string
  status: string
  created_at: string
  weight: number
  quantity: number
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (!response.ok) throw new Error("Failed to fetch orders")
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to load orders")
    } finally {
      setIsLoading(false)
    }
  }

  const totalOrders = orders.length
  const deliveredOrders = orders.filter((o) => o.status === "Delivered").length
  const inTransitOrders = orders.filter((o) => o.status === "In Transit").length
  const processingOrders = orders.filter((o) => o.status === "Processing").length
  const onTimeDeliveryRate = totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(1) : "0"

  const recentOrders = orders.slice(0, 5)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Transit":
        return "bg-blue-100 text-blue-800"
      case "Processing":
        return "bg-gray-100 text-gray-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <MainLayout userRole="admin" userName="Admin User">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout userRole="admin" userName="Admin User">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">Welcome back! Here's an overview of your logistics operations.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/admin/orders/new">New Order</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">All orders in system</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inTransitOrders}</div>
              <div className="flex items-center text-xs text-green-500">
                <TrendingUp className="mr-1 h-3 w-3" />
                {inTransitOrders > 0 ? "In progress" : "None active"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{processingOrders}</div>
              <div className="flex items-center text-xs text-orange-500">
                <TrendingUp className="mr-1 h-3 w-3" />
                Awaiting dispatch
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onTimeDeliveryRate}%</div>
              <div className="flex items-center text-xs text-green-500">
                <TrendingUp className="mr-1 h-3 w-3" />
                {deliveredOrders} delivered
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Live Deliveries</CardTitle>
              <CardDescription>Map view of all active deliveries</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-video bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders created in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-start gap-4">
                      <div className="mt-0.5 rounded-full p-1.5 bg-blue-100">
                        <Package className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-medium truncate">Order from {order.sender_name}</p>
                        <p className="text-xs text-muted-foreground">To: {order.recipient_name}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No orders yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="upcoming">Recent Orders</TabsTrigger>
              <TabsTrigger value="issues">Pending Issues</TabsTrigger>
              <TabsTrigger value="inventory">Inventory Status</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm" className="ml-auto gap-1 bg-transparent">
              View All
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <TabsContent value="upcoming" className="border rounded-md mt-2">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Sender</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Recipient</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Speed</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b">
                        <td className="px-4 py-3 text-sm font-medium text-orange-600">{order.id.slice(0, 8)}...</td>
                        <td className="px-4 py-3 text-sm">{order.sender_name}</td>
                        <td className="px-4 py-3 text-sm">{order.recipient_name}</td>
                        <td className="px-4 py-3 text-sm capitalize">{order.shipping_speed}</td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{formatDate(order.created_at)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No orders yet. Create one to get started!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="issues" className="border rounded-md mt-2">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium">Issue ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Reported By</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Issue Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: "ISS-001",
                      orderId: "ORD-12345",
                      reporter: "Michael Johnson (Driver)",
                      type: "Address Not Found",
                      description: "Unable to locate the address",
                      status: "Pending",
                    },
                  ].map((issue, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-3 text-sm">{issue.id}</td>
                      <td className="px-4 py-3 text-sm">{issue.orderId}</td>
                      <td className="px-4 py-3 text-sm">{issue.reporter}</td>
                      <td className="px-4 py-3 text-sm">{issue.type}</td>
                      <td className="px-4 py-3 text-sm">{issue.description}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-800">
                          {issue.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="inventory" className="border rounded-md mt-2">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left text-sm font-medium">Item ID</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Quantity</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      id: "ITM-001",
                      name: "Standard Box (Small)",
                      category: "Packaging",
                      quantity: 245,
                      status: "In Stock",
                      location: "Warehouse A",
                    },
                  ].map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-3 text-sm">{item.id}</td>
                      <td className="px-4 py-3 text-sm">{item.name}</td>
                      <td className="px-4 py-3 text-sm">{item.category}</td>
                      <td className="px-4 py-3 text-sm">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{item.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
