CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

CREATE TABLE IF NOT EXISTS medicines (
  id TEXT PRIMARY KEY,
  commercial_name VARCHAR(255) NOT NULL,
  registry_code VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  description TEXT NOT NULL,
  leaflet_data JSONB
);

CREATE TABLE IF NOT EXISTS medicine_images (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  medicine_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  all_days BOOLEAN DEFAULT FALSE, -- se for tomar todos os dias
  start_time TIMESTAMP NOT NULL, -- quando começa
  end_time TIMESTAMP, -- quando termina
  repetition REAL NOT NULL, -- se repete a cada x dias/horas/semanas
  repetition_unit TEXT NOT NULL, -- 'HOUR', 'DAY', 'WEEK', etc.
  color TEXT NOT NULL, -- apenas uma cor,
  amount REAL, -- dose (ex: 3 comprimidos, 2 ml, 5 gotas)
  dosage_unit TEXT NOT NULL, -- tipo de dose (gotas, ml ou comprimidos)
  medicine_id TEXT NOT NULL, -- id do medicamento
  user_id TEXT NOT NULL, -- id do usuário
  FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dose_records (
  id TEXT PRIMARY KEY,
  appointment_id TEXT NOT NULL,
  taken_at TIMESTAMP NOT NULL,
  notes TEXT,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE CASCADE
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