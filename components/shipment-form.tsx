"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface ShipmentFormProps {
  onSubmit?: (data: ShipmentData) => void
  initialData?: Partial<ShipmentData>
  orderId?: string
}

export interface ShipmentData {
  // Sender Information
  senderName: string
  senderAddress: string
  senderContact: string
  senderEmail: string

  // Recipient Information
  recipientName: string
  recipientAddress: string
  recipientContact: string
  recipientEmail: string

  // Package Details
  packageType: string
  contentsDescription: string
  weight: string
  quantity: string

  // Service Details
  shippingSpeed: string

  // Status
  status: string

  // Delivery Information
  orderPlacedDate: string
  deliveryStatus: string
  currentDetails: string

  // Notes
  notes: string
}

const initialFormData: ShipmentData = {
  senderName: "",
  senderAddress: "",
  senderContact: "",
  senderEmail: "",
  recipientName: "",
  recipientAddress: "",
  recipientContact: "",
  recipientEmail: "",
  packageType: "",
  contentsDescription: "",
  weight: "",
  quantity: "",
  shippingSpeed: "",
  status: "Processing",
  orderPlacedDate: new Date().toISOString().split('T')[0],
  deliveryStatus: "pending",
  currentDetails: "PENDING",
  notes: "",
}

export function ShipmentForm({ onSubmit, initialData, orderId }: ShipmentFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<ShipmentData>({
    ...initialFormData,
    ...initialData,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const convertToSnakeCase = (data: ShipmentData) => {
    return {
      sender_name: data.senderName,
      sender_address: data.senderAddress,
      sender_contact: data.senderContact,
      sender_email: data.senderEmail,
      recipient_name: data.recipientName,
      recipient_address: data.recipientAddress,
      recipient_contact: data.recipientContact,
      recipient_email: data.recipientEmail,
      package_type: data.packageType,
      contents_description: data.contentsDescription,
      weight: Number.parseFloat(data.weight) || 0,
      quantity: Number.parseInt(data.quantity) || 0,
      shipping_speed: data.shippingSpeed,
      status: data.status,
      order_placed_date: data.orderPlacedDate,
      delivery_status: data.deliveryStatus,
      current_details: data.currentDetails,
      notes: data.notes,
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const endpoint = orderId ? `/api/orders/${orderId}` : "/api/orders"
      const method = orderId ? "PATCH" : "POST"

      const dbData = convertToSnakeCase(formData)

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dbData),
      })

      if (!response.ok) {
        throw new Error("Failed to save order")
      }

      const savedOrder = await response.json()

      if (onSubmit) {
        onSubmit(formData)
      }

      toast.success(orderId ? "Order updated successfully" : "Order created successfully")

      // Navigate back to orders page after successful save
      setTimeout(() => {
        router.push("/admin/orders")
      }, 1500)
    } catch (error) {
      console.error("Error saving order:", error)
      toast.error("Failed to save order")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sender Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Sender Information</CardTitle>
          <CardDescription>Enter the details of the sender</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="senderName">Name</Label>
              <Input
                id="senderName"
                name="senderName"
                placeholder="Sender's full name"
                value={formData.senderName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderContact">Contact Number</Label>
              <Input
                id="senderContact"
                name="senderContact"
                placeholder="+1 (555) 000-0000"
                value={formData.senderContact}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="senderAddress">Address</Label>
              <Input
                id="senderAddress"
                name="senderAddress"
                placeholder="Full address"
                value={formData.senderAddress}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderEmail">Email Address</Label>
              <Input
                id="senderEmail"
                name="senderEmail"
                type="email"
                placeholder="sender@example.com"
                value={formData.senderEmail}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipient Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recipient Information</CardTitle>
          <CardDescription>Enter the details of the recipient</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Name</Label>
              <Input
                id="recipientName"
                name="recipientName"
                placeholder="Recipient's full name"
                value={formData.recipientName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientContact">Contact Number</Label>
              <Input
                id="recipientContact"
                name="recipientContact"
                placeholder="+1 (555) 000-0000"
                value={formData.recipientContact}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="recipientAddress">Address</Label>
              <Input
                id="recipientAddress"
                name="recipientAddress"
                placeholder="Full address"
                value={formData.recipientAddress}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Email Address</Label>
              <Input
                id="recipientEmail"
                name="recipientEmail"
                type="email"
                placeholder="recipient@example.com"
                value={formData.recipientEmail}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Package Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Package Details</CardTitle>
          <CardDescription>Enter information about the package</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="packageType">Type of Goods</Label>
              <Select value={formData.packageType} onValueChange={(value) => handleSelectChange("packageType", value)}>
                <SelectTrigger id="packageType">
                  <SelectValue placeholder="Select package type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                  <SelectItem value="pallet">Pallet</SelectItem>
                  <SelectItem value="envelope">Envelope</SelectItem>
                  <SelectItem value="parcel">Parcel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                placeholder="0.00"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                placeholder="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contentsDescription">Contents Description</Label>
              <Input
                id="contentsDescription"
                name="contentsDescription"
                placeholder="Describe the contents"
                value={formData.contentsDescription}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Service Details</CardTitle>
          <CardDescription>Select the desired shipping speed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shippingSpeed">Desired Shipping Speed</Label>
            <Select
              value={formData.shippingSpeed}
              onValueChange={(value) => handleSelectChange("shippingSpeed", value)}
            >
              <SelectTrigger id="shippingSpeed">
                <SelectValue placeholder="Select shipping speed" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="international">International</SelectItem>
                <SelectItem value="offshore">Offshore</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Status Section */}
      <Card>
        <CardHeader>
          <CardTitle>Shipment Status</CardTitle>
          <CardDescription>Select the current status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
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
        </CardContent>
      </Card>

      {/* Delivery Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Information</CardTitle>
          <CardDescription>Set order placement date and delivery status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="orderPlacedDate">Order Placed Date</Label>
              <Input
                id="orderPlacedDate"
                name="orderPlacedDate"
                type="date"
                value={formData.orderPlacedDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryStatus">Delivery Status</Label>
              <Select value={formData.deliveryStatus} onValueChange={(value) => handleSelectChange("deliveryStatus", value)}>
                <SelectTrigger id="deliveryStatus">
                  <SelectValue placeholder="Select delivery status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentDetails">Current Details</Label>
            <Select value={formData.currentDetails} onValueChange={(value) => handleSelectChange("currentDetails", value)}>
              <SelectTrigger id="currentDetails">
                <SelectValue placeholder="Select current details" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="ON HOLD">ON HOLD</SelectItem>
                <SelectItem value="AWAITING DELIVERY">AWAITING DELIVERY</SelectItem>
                <SelectItem value="UNDERGOING CUSTOM CHECK">UNDERGOING CUSTOM CHECK</SelectItem>
                <SelectItem value="MISSING">MISSING</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
          <CardDescription>Add any additional information or special instructions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Enter any additional notes or special instructions..."
              value={formData.notes}
              onChange={handleChange}
              className="min-h-24"
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button type="submit" className="flex-1" disabled={isLoading}>
          {isLoading ? "Saving..." : orderId ? "Update Shipment" : "Save Shipment"}
        </Button>
        <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
