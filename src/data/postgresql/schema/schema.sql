CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  all_days BOOLEAN DEFAULT FALSE,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  repetition INTEGER NOT NULL,
  color TEXT NOT NULL,
  medicine_id TEXT NOT NULL,
  medicine_name TEXT NOT NULL,
  user_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS medicines (
  id TEXT PRIMARY KEY,
  commercial_name VARCHAR(255) NOT NULL,
  registry_code VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description TEXT NOT NULL,
  leaflet_data JSONB
);

CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  medicine_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE,
  color_code TEXT
);

CREATE TABLE IF NOT EXISTS medicine_category (
  medicine_id TEXT NOT NULL,
  category_id TEXT NOT NULL,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);