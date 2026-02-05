"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MainLayout } from "@/components/main-layout"
import { ShipmentForm, type ShipmentData } from "@/components/shipment-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Order {
  id: string
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
  weight: string
  quantity: string
  shipping_speed: string
  status: string
  notes: string
}

export default function EditOrderPage({ params }: { params: { orderId: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/orders/${params.orderId}`)
        if (!response.ok) throw new Error("Failed to fetch order")
        const data = await response.json()
        setOrder(data)
      } catch (error) {
        console.error("Error fetching order:", error)
        toast.error("Failed to load order")
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrder()
  }, [params.orderId])

  const handleSubmit = async (data: ShipmentData) => {
    // Form submission is handled by ShipmentForm component
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

  if (!order) {
    return (
      <MainLayout userRole="admin" userName="Admin User">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Order not found</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout userRole="admin" userName="Admin User">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/admin/orders/${params.orderId}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Edit Order</h2>
            <p className="text-muted-foreground">Update shipment details for order {params.orderId.slice(0, 8)}...</p>
          </div>
        </div>

        <div className="max-w-4xl">
          <ShipmentForm
            onSubmit={handleSubmit}
            initialData={{
              senderName: order.sender_name,
              senderAddress: order.sender_address,
              senderContact: order.sender_contact,
              senderEmail: order.sender_email,
              recipientName: order.recipient_name,
              recipientAddress: order.recipient_address,
              recipientContact: order.recipient_contact,
              recipientEmail: order.recipient_email,
              packageType: order.package_type,
              contentsDescription: order.contents_description,
              weight: order.weight,
              quantity: order.quantity,
              shippingSpeed: order.shipping_speed,
              status: order.status,
              notes: order.notes,
            }}
            orderId={params.orderId}
          />
        </div>
      </div>
    </MainLayout>
  )
}
