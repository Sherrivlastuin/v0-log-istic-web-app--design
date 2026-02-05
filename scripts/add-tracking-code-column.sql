-- Add tracking_code column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_code VARCHAR(12) UNIQUE;

-- Create index on tracking_code for efficient lookups
CREATE INDEX IF NOT EXISTS idx_orders_tracking_code ON orders(tracking_code);
