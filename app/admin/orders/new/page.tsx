"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/main-layout"
import { ShipmentForm, type ShipmentData } from "@/components/shipment-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function CreateOrderPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: ShipmentData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create order")
      }

      const result = await response.json()
      toast.success("Order created successfully!")

      // Redirect back to orders list
      router.push("/admin/orders")
    } catch (error) {
      console.error("Error creating order:", error)
      toast.error("Failed to create order")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MainLayout userRole="admin" userName="Admin User">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Create New Order</h2>
            <p className="text-muted-foreground">Fill in all the required information to create a new shipment order</p>
          </div>
        </div>

        <div className="max-w-4xl">
          <ShipmentForm onSubmit={handleSubmit} />
        </div>
      </div>
    </MainLayout>
  )
}
