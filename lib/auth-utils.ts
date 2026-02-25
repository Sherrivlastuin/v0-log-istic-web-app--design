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
