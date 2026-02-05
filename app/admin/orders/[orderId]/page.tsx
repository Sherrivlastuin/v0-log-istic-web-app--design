"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MainLayout } from "@/components/main-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, Download, Edit, MapPin, Package, Printer, Truck, User, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Order {
  id: string
  tracking_code: string
  sender_name: string
  sender_address: string
  sender_contact: string
  sender_email: string
  recipient_name: string
  recipient_address: string
  recipient_contact: string
  recipient_email: string
  package_type: string
  contents_description: string
  weight: number
  quantity: number
  shipping_speed: string
  status: string
  notes: string
  created_at: string
}

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [driverStatus, setDriverStatus] = useState("Assigned")

  useEffect(() => {
    if (params.orderId === "new") {
      router.push("/admin/orders/new")
      return
    }

    const fetchOrder = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/orders/${params.orderId}`)
        if (!response.ok) throw new Error("Failed to fetch order")
        const data = await response.json()
        setOrder(data)
      } catch (error) {
        console.error("Error fetching order:", error)
        toast.error("Failed to load order details")
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrder()
  }, [params.orderId, router])

  if (isLoading) {
    return (
      <MainLayout userRole="admin" userName="Admin User">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      </MainLayout>
    )
  }

  if (!order) {
    return (
      <MainLayout userRole="admin" userName="Admin User">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Order not found</p>
        </div>
      </MainLayout>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <MainLayout userRole="admin" userName="Admin User">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/admin/orders">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Tracking Code: <span className="text-orange-600">{order.tracking_code}</span>
              </h2>
              <p className="text-muted-foreground">
                Placed on {formatDate(order.created_at)} • <span className="font-medium">{order.status}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/admin/orders/${order.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Order
              </Link>
            </Button>
            <Button>
              <Truck className="mr-2 h-4 w-4" />
              Update Status
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Sender Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">{order.sender_name}</h3>
                <p className="text-sm text-muted-foreground">{order.sender_email}</p>
                <p className="text-sm text-muted-foreground">{order.sender_contact}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </h3>
                <p className="text-sm">{order.sender_address}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Recipient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">{order.recipient_name}</h3>
                <p className="text-sm text-muted-foreground">{order.recipient_email}</p>
                <p className="text-sm text-muted-foreground">{order.recipient_contact}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </h3>
                <p className="text-sm">{order.recipient_address}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Package Type</h3>
                <p className="text-sm capitalize">{order.package_type}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold">Contents</h3>
                <p className="text-sm">{order.contents_description}</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Weight</h3>
                  <p className="text-sm">{order.weight} kg</p>
                </div>
                <div>
                  <h3 className="font-semibold">Quantity</h3>
                  <p className="text-sm">{order.quantity}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Shipping Speed</h3>
                <p className="text-sm capitalize">{order.shipping_speed}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold">Current Status</h3>
                <p className="text-sm font-medium text-orange-600">{order.status}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {order.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
