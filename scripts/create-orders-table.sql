-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Sender Information
  sender_name TEXT NOT NULL,
  sender_address TEXT NOT NULL,
  sender_contact TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  
  -- Recipient Information
  recipient_name TEXT NOT NULL,
  recipient_address TEXT NOT NULL,
  recipient_contact TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  
  -- Package Details
  package_type TEXT NOT NULL,
  contents_description TEXT NOT NULL,
  weight DECIMAL NOT NULL,
  quantity INTEGER NOT NULL,
  
  -- Service Details
  shipping_speed TEXT NOT NULL,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'Processing',
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view orders
CREATE POLICY "Allow anyone to view orders" ON orders
  FOR SELECT USING (true);

-- Create policy to allow anyone to insert orders
CREATE POLICY "Allow anyone to insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Create policy to allow anyone to update orders
CREATE POLICY "Allow anyone to update orders" ON orders
  FOR UPDATE USING (true);

-- Create policy to allow anyone to delete orders
CREATE POLICY "Allow anyone to delete orders" ON orders
  FOR DELETE USING (true);

-- Create index on created_at for efficient sorting
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
