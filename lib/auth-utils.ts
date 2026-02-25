/**
 * Authorization and permission utilities for shipment tracking
 */

export type UserRole = 'admin' | 'driver' | 'warehouse' | 'customer' | null

interface AuthorizationResult {
  authorized: boolean
  message: string
}

/**
 * Check if user has admin privileges
 */
export function isUserAdmin(userRole: UserRole): boolean {
  return userRole?.toLowerCase() === 'admin'
}

/**
 * Verify admin privileges before status updates
 */
export async function verifyAdminAccess(userRole: UserRole): Promise<AuthorizationResult> {
  if (!isUserAdmin(userRole)) {
    return {
      authorized: false,
      message: 'Only administrators can modify shipment tracking status',
    }
  }

  return {
    authorized: true,
    message: 'Admin access verified',
  }
}

/**
 * Format timestamp to user-friendly format
 * @param timestamp - ISO timestamp string or Date object
 * @returns Formatted string: "Feb 20, 2026 at 17:32"
 */
export function formatTimestamp(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp

  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }

  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }

  return date.toLocaleString('en-US', options)
}

/**
 * Create timeline entry with formatted timestamp
 */
export interface TimelineEntry {
  status: string
  date: string
  timestamp: string
  completed: boolean
  canEdit?: boolean
}

export function createTimelineEntry(
  status: string,
  timestamp: string | null,
  currentStatus: string,
  userRole: UserRole
): TimelineEntry {
  const isCompleted = ['Processing', 'In Transit', 'Out for Delivery', 'Delivered'].some(
    (s) => s === currentStatus && ['In Transit', 'Out for Delivery', 'Delivered'].includes(status)
  )

  return {
    status,
    date: timestamp ? formatTimestamp(timestamp) : 'Pending',
    timestamp: timestamp || '',
    completed: isCompleted,
    canEdit: isUserAdmin(false),
  }
}
