import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const body = await request.json()

  const { generateTrackingCode } = await import("@/lib/utils/tracking-code")
  const trackingCode = generateTrackingCode()

  const orderData = {
    tracking_code: trackingCode,
    sender_name: body.sender_name,
    sender_address: body.sender_address,
    sender_contact: body.sender_contact,
    sender_email: body.sender_email,
    recipient_name: body.recipient_name,
    recipient_address: body.recipient_address,
    recipient_contact: body.recipient_contact,
    recipient_email: body.recipient_email,
    package_type: body.package_type,
    contents_description: body.contents_description,
    weight: body.weight,
    quantity: body.quantity,
    shipping_speed: body.shipping_speed,
    status: body.status,
    order_placed_date: body.order_placed_date,
    delivery_status: body.delivery_status,
    current_details: body.current_details,
    notes: body.notes,
  }

  const { data, error } = await supabase.from("orders").insert([orderData]).select()

  if (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0], { status: 201 })
}
