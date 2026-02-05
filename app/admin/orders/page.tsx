"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ArrowDown, ArrowUp, Download, Filter, MoreHorizontal, Plus, Search, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Order {
  id: string
  tracking_code: string
  sender_name: string
  recipient_name: string
  shipping_speed: string
  status: string
  created_at: string
  weight: number
  quantity: number
}

export default function OrdersPage() {
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [editingOrder, setEditingOrder] = useState<string | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("all")

  const [formData, setFormData] = useState({
    status: "Processing",
    notes: "",
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
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

  const toggleSort = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
  }

  const openEditDialog = (order: Order) => {
    setFormData({
      status: order.status,
      notes: "",
    })
    setEditingOrder(order.id)
  }

  const saveOrderChanges = async () => {
    if (editingOrder) {
      try {
        const response = await fetch(`/api/orders/${editingOrder}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: formData.status }),
        })

        if (!response.ok) throw new Error("Failed to update order")

        setOrders(orders.map((order) => (order.id === editingOrder ? { ...order, status: formData.status } : order)))
        setEditingOrder(null)
        toast.success("Order updated successfully")
      } catch (error) {
        console.error("Error updating order:", error)
        toast.error("Failed to update order")
      }
    }
  }

  const closeDialog = () => {
    setEditingOrder(null)
    setFormData({ status: "Processing", notes: "" })
  }

  const filteredOrders = orders.filter((order) => (statusFilter === "all" ? true : order.status === statusFilter))

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "In Transit":
        return "bg-blue-100 text-blue-800"
      case "Processing":
        return "bg-gray-100 text-gray-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Undergoing custom clearance":
        return "bg-purple-100 text-purple-800"
      case "On hold":
        return "bg-orange-100 text-orange-800"
      case "Missing":
        return "bg-red-100 text-red-800"
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
            <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
            <p className="text-muted-foreground">Manage and track all customer orders in the system.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/admin/orders/new">
                <Plus className="mr-2 h-4 w-4" />
                New Order
              </Link>
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex w-full items-center space-x-2 md:w-1/3">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search orders..." className="w-full pl-8" />
            </div>
          </div>

          <div className="flex flex-1 items-center space-x-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Undergoing custom clearance">Custom Clearance</SelectItem>
                <SelectItem value="On hold">On Hold</SelectItem>
                <SelectItem value="Missing">Missing</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>

            <Button variant="outline" size="icon" onClick={toggleSort}>
              {sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              <span className="sr-only">Sort</span>
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">Tracking Code</TableHead>
                <TableHead className="w-[140px]">Order ID</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Speed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-semibold text-orange-600">{order.tracking_code}</TableCell>
                    <TableCell className="font-medium">
                      <Link href={`/admin/orders/${order.id}`} className="text-orange-600 hover:underline">
                        {order.id.slice(0, 8)}...
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{order.sender_name}</TableCell>
                    <TableCell className="text-sm">{order.recipient_name}</TableCell>
                    <TableCell className="text-sm">{formatDate(order.created_at)}</TableCell>
                    <TableCell className="text-sm capitalize">{order.shipping_speed}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditDialog(order)}>Edit Order</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Assign Driver</DropdownMenuItem>
                          <DropdownMenuItem>Print Label</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Cancel Order</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> orders
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      <Dialog open={!!editingOrder} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Order Status</DialogTitle>
            <DialogDescription>Update the order status and save changes.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Order Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Undergoing custom clearance">Undergoing custom clearance</SelectItem>
                  <SelectItem value="On hold">On hold</SelectItem>
                  <SelectItem value="Missing">Missing</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={saveOrderChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  )
}
