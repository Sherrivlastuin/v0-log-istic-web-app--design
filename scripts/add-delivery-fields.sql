-- Add delivery-related fields to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_placed_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'pending';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS current_details TEXT DEFAULT 'PENDING';

-- Create indexes for filtering by delivery fields
CREATE INDEX IF NOT EXISTS idx_orders_delivery_status ON orders(delivery_status);
CREATE INDEX IF NOT EXISTS idx_orders_current_details ON orders(current_details);
