/*
  # Initial Schema Setup for Restaurant Analytics

  1. New Tables
    - dishes
      - id (uuid, primary key)
      - name (text)
      - category (text)
      - price (integer)
      - is_available (boolean)
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - waiters
      - id (uuid, primary key)
      - name (text)
      - phone (text)
      - hired_at (date)
      - created_at (timestamp)
    
    - orders
      - id (uuid, primary key)
      - table_number (integer)
      - waiter_id (uuid, references waiters)
      - total_amount (integer)
      - status (text)
      - created_at (timestamp)
    
    - order_items
      - id (uuid, primary key)
      - order_id (uuid, references orders)
      - dish_id (uuid, references dishes)
      - quantity (integer)
      - price (integer)
      - created_at (timestamp)
    
    - uploads
      - id (uuid, primary key)
      - file_name (text)
      - file_path (text)
      - user_id (uuid, references auth.users)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create dishes table
CREATE TABLE dishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  price integer NOT NULL,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create waiters table
CREATE TABLE waiters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  hired_at date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number integer NOT NULL,
  waiter_id uuid REFERENCES waiters(id),
  total_amount integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create order_items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  dish_id uuid REFERENCES dishes(id),
  quantity integer NOT NULL,
  price integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create uploads table
CREATE TABLE uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_path text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE waiters ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read dishes" ON dishes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read waiters" ON waiters
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read orders" ON orders
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read order_items" ON order_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow users to read their own uploads" ON uploads
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX idx_dishes_category ON dishes(category);
CREATE INDEX idx_orders_waiter_id ON orders(waiter_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_dish_id ON order_items(dish_id);