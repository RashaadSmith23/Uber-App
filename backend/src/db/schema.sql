CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(10) CHECK (role IN ('rider','driver')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE drivers (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  vehicle_model VARCHAR(100),
  license_plate VARCHAR(20),
  is_online BOOLEAN DEFAULT false,
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  rating DECIMAL(2,1) DEFAULT 5.0
);

CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rider_id UUID REFERENCES users(id),
  driver_id UUID REFERENCES users(id),
  pickup_lat DOUBLE PRECISION NOT NULL,
  pickup_lng DOUBLE PRECISION NOT NULL,
  dropoff_lat DOUBLE PRECISION NOT NULL,
  dropoff_lng DOUBLE PRECISION NOT NULL,
  ride_type VARCHAR(20) DEFAULT 'UberX',
  status VARCHAR(20) CHECK (status IN ('requested','accepted','arrived','in_progress','completed','cancelled')) DEFAULT 'requested',
  fare_estimate DECIMAL(10,2),
  actual_fare DECIMAL(10,2),
  payment_intent_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID REFERENCES trips(id),
  rater_id UUID REFERENCES users(id),
  rated_user_id UUID REFERENCES users(id),
  score INT CHECK (score BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);