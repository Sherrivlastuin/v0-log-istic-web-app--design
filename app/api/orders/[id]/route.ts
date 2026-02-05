import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  let query = supabase.from("orders").select("*")

  if (id.startsWith("MSM") && id.length === 9) {
    // This is a tracking code
    query = query.eq("tracking_code", id)
  } else {
    // This is a UUID (admin order detail page)
    query = query.eq("id", id)
  }

  const { data, error } = await query.single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params
  const body = await request.json()

  const orderData: Record<string, any> = {}

  if (body.senderName) orderData.sender_name = body.senderName
  if (body.senderAddress) orderData.sender_address = body.senderAddress
  if (body.senderContact) orderData.sender_contact = body.senderContact
  if (body.senderEmail) orderData.sender_email = body.senderEmail
  if (body.recipientName) orderData.recipient_name = body.recipientName
  if (body.recipientAddress) orderData.recipient_address = body.recipientAddress
  if (body.recipientContact) orderData.recipient_contact = body.recipientContact
  if (body.recipientEmail) orderData.recipient_email = body.recipientEmail
  if (body.packageType) orderData.package_type = body.packageType
  if (body.contentsDescription) orderData.contents_description = body.contentsDescription
  if (body.weight) orderData.weight = Number.parseFloat(body.weight)
  if (body.quantity) orderData.quantity = Number.parseInt(body.quantity)
  if (body.shippingSpeed) orderData.shipping_speed = body.shippingSpeed
  if (body.status) orderData.status = body.status
  if (body.notes !== undefined) orderData.notes = body.notes

  const { data, error } = await supabase.from("orders").update(orderData).eq("id", id).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params

  const { error } = await supabase.from("orders").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
