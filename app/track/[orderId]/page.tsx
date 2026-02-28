"use client"

import { Calendar } from "@/components/ui/calendar"
import { ArrowLeft } from "lucide-react" // Import ArrowLeft

import { useState, useEffect } from "react"
import Link from "next/link"
import { Package, Calendar as calender, MessageSquare, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { toast } from "sonner"

interface Order {
  id: string
  tracking_code: string
  recipient_name: string
  recipient_address: string
  status: string
  contents_description: string
  weight: number
  quantity: number
  created_at: string
}

export default function TrackingPage({ params }: { params: { orderId: string } }) {
  const [date, setDate] = useState<Date>()
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [rescheduleSubmitted, setRescheduleSubmitted] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [editingDates, setEditingDates] = useState<{ [key: string]: string }>({})

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
        toast.error("Failed to load tracking information")
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrder()
  }, [params.orderId])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="flex h-16 items-center border-b px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">MSM Courier</span>
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-muted-foreground">Order not found</p>
            <Button asChild className="mt-4">
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const handleDateChange = (status: string, newDate: string) => {
    setEditingDates((prev) => ({
      ...prev,
      [status]: newDate,
    }))
  }

  const handleSaveDate = async (status: string) => {
    const newDate = editingDates[status]
    if (!newDate) return

    try {
      const response = await fetch(`/api/orders/${order?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [`${status}_date`]: newDate }),
      })
      if (response.ok) {
        toast.success(`${status} date updated`)
        setEditingDates((prev) => ({
          ...prev,
          [status]: undefined,
        }))
      }
    } catch (error) {
      toast.error("Failed to update date")
    }
  }

  const timeline = [
    { status: "Order Placed", date: format(new Date(order.created_at), "MMM dd, yyyy, h:mm a"), completed: false },
    { status: "Processing", date: editingDates["Processing"] || "Processing", completed: order.status !== "Processing" },
    { status: "In Transit", date: editingDates["In Transit"] || "In Transit", completed: ["In Transit", "Delivered"].includes(order.status) },
    { status: "Out for Delivery", date: editingDates["Out for Delivery"] || "Expected soon", completed: order.status === "Delivered" },
    { status: "Delivered", date: editingDates["Delivered"] || "Expected", completed: false },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-16 items-center border-b px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">MSM Courier</span>
        </Link>
      </header>
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                Tracking Code: <span className="text-orange-600">{order.tracking_code}</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Current Status: <span className="font-medium">{order.status}</span>
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Status</CardTitle>
                <CardDescription>Tracking timeline for your shipment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="space-y-4">
                    {timeline.map((step, index) => (
                      <div key={index} className="relative flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-full ${
                              step.completed ? "bg-orange-600" : "border border-muted-foreground bg-background"
                            }`}
                          >
                            {step.completed && <div className="h-2 w-2 rounded-full bg-white" />}
                          </div>
                          {index < timeline.length - 1 && (
                            <div
                              className={`h-full w-px ${step.completed ? "bg-orange-600" : "bg-muted-foreground"}`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <p className="font-medium">{step.status}</p>
                          {step.status !== "Order Placed" ? (
                            <div className="flex items-center gap-2 mt-2">
                              
                              {editingDates[step.status] && (
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveDate(step.status)}
                                  className="h-8 text-xs"
                                >
                                  Save
                                </Button>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">{step.date}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Delivery Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Delivery Address</h3>
                    <p className="text-sm">{order.recipient_address}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold">Recipient Name</h3>
                    <p className="text-sm">{order.recipient_name}</p>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-semibold">Package Details</h3>
                    <p className="text-sm">{order.contents_description}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Weight: {order.weight} kg | Quantity: {order.quantity}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Calendar className="mr-2 h-4 w-4" />
                      Reschedule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reschedule Delivery</DialogTitle>
                      <DialogDescription>Select a new delivery date for your order.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            {date ? format(date, "PPP") : "Select a date"}
                            <Calendar className="ml-auto h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <DialogFooter>
                      <Button onClick={() => setRescheduleSubmitted(true)} disabled={!date || rescheduleSubmitted}>
                        {rescheduleSubmitted ? "Rescheduled" : "Confirm Reschedule"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full bg-transparent">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Feedback
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Provide Feedback</DialogTitle>
                      <DialogDescription>Share your thoughts about your delivery experience.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Textarea placeholder="Type your feedback here..." className="min-h-[120px]" />
                    </div>
                    <DialogFooter>
                      <Button onClick={() => setFeedbackSubmitted(true)} disabled={feedbackSubmitted}>
                        {feedbackSubmitted ? "Submitted" : "Submit Feedback"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <p className="text-sm text-muted-foreground">© 2025 MSM Courier. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
