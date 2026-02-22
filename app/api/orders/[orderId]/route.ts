import { NextRequest, NextResponse } from 'next/server'
import { isUserAdmin, validateTimestamp, type UserRole } from '@/lib/auth-utils'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const userRole = req.headers.get('X-User-Role') as UserRole
    const body = await req.json()

    // CRITICAL: Verify admin authorization for status updates
    if (!isUserAdmin(userRole)) {
      return NextResponse.json(
        {
          error: 'Unauthorized: Only administrators can modify shipment tracking status',
          code: 'ADMIN_ONLY_ACCESS',
        },
        { status: 403 }
      )
    }

    // Validate all timestamp fields before updating
    const timestampFields = [
      'processing_date',
      'in_transit_date',
      'out_for_delivery_date',
      'delivered_date',
    ]

    for (const field of timestampFields) {
      if (body[field]) {
        const validation = validateTimestamp(body[field])
        if (!validation.valid) {
          return NextResponse.json(
            { error: `Invalid ${field}: ${validation.error}` },
            { status: 400 }
          )
        }
      }
    }

    // Perform database update (replace with your database logic)
    const updatedOrder = {
      id: params.orderId,
      ...body,
      updated_at: new Date().toISOString(),
      updated_by_role: userRole,
    }

    // TODO: Save to database
    // const result = await db.orders.update(params.orderId, updatedOrder)

    return NextResponse.json(
      {
        success: true,
        message: 'Shipment status updated successfully',
        data: updatedOrder,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update shipment status' },
      { status: 500 }
    )
  }
}