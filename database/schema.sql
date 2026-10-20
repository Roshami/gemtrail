-- ==============================================================================
-- GemTrail: Ratnapura Heritage & Tourism Explorer
-- MySQL Database Schema & Seed Data
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS gemtrail_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gemtrail_db;

-- ------------------------------------------------------------------------------
-- 1. Admins Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) DEFAULT 'District Administrator',
  email VARCHAR(120),
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Default administrator (Username: admin, Default password reference)
INSERT INTO admins (username, password_hash, display_name, email, role)
VALUES ('admin', 'GemTrail#2025', 'GemTrail Lead Admin', 'admin@gemtrail.lk', 'superadmin')
ON DUPLICATE KEY UPDATE display_name = VALUES(display_name);

-- ------------------------------------------------------------------------------
-- 2. Categories Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50),
  color VARCHAR(20),
  sort_order INT DEFAULT 0
) ENGINE=InnoDB;

INSERT INTO categories (id, name, icon, color, sort_order) VALUES
('waterfalls', 'Waterfalls & Nature', 'Droplets', '#0ea5e9', 1),
('heritage', 'Cultural & Heritage', 'Landmark', '#d97706', 2),
('gem-mines', 'Gem Mines & Geology', 'Gem', '#8b5cf6', 3),
('hiking', 'Trekking & Mountains', 'Mountain', '#10b981', 4)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ------------------------------------------------------------------------------
-- 3. Places / Landmarks Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS places (
  id VARCHAR(80) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(50) NOT NULL,
  category_label VARCHAR(100) NOT NULL,
  rating DECIMAL(2, 1) DEFAULT 4.5,
  distance_km DECIMAL(5, 2) DEFAULT 0.00,
  entrance_fee VARCHAR(80) DEFAULT 'Free Entry',
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  open_status VARCHAR(120) DEFAULT 'Open Daily',
  short_description TEXT NOT NULL,
  detailed_description LONGTEXT,
  image VARCHAR(500) NOT NULL,
  secondary_image VARCHAR(500),
  mining_context TEXT,
  elevation_meters INT DEFAULT 0,
  best_time VARCHAR(120),
  contact VARCHAR(120),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_lat_lng (lat, lng)
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 4. Visiting Tips Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS visiting_tips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  place_id VARCHAR(80) NOT NULL,
  tip TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------------------------
-- 5. District Stats Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS district_stats (
  stat_key VARCHAR(50) PRIMARY KEY,
  stat_value VARCHAR(100) NOT NULL,
  label VARCHAR(100) NOT NULL,
  subtext VARCHAR(150),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO district_stats (stat_key, stat_value, label, subtext) VALUES
('area_sqkm', '3,275 km²', 'District Territory', 'Largest district in Sabaragamuwa'),
('gem_corridors', '14 Active', 'Gem-Bearing Basins', 'Kalu Ganga & Denawaka valleys'),
('heritage_sites', '42 Sites', 'Ancient Sanctuaries', 'Dating from 3rd century BCE to Kandy era'),
('annual_explorers', '120k+', 'Annual Explorers', 'Eco-tourists, pilgrims & gemologists')
ON DUPLICATE KEY UPDATE stat_value = VALUES(stat_value);

-- ------------------------------------------------------------------------------
-- 6. Initial Verified Seed Places
-- ------------------------------------------------------------------------------
INSERT INTO places (
  id, name, category, category_label, rating, distance_km, entrance_fee,
  lat, lng, open_status, short_description, detailed_description,
  image, secondary_image, mining_context, elevation_meters, best_time, contact
) VALUES
(
  'bopath-ella',
  'Bopath Ella Waterfall',
  'waterfalls',
  'Waterfalls & Nature',
  4.8,
  14.2,
  'LKR 100',
  6.7925,
  80.3702,
  '• Open Now • 7:00 AM – 6:00 PM',
  'Dramatic water cascade famously shaped like a sacred Bo leaf with natural plunge pools.',
  'Cascading down a 30-meter precipice near Kuruvita, Bopath Ella derives its name from its unmistakable resemblance to the leaf of the sacred Bo tree. The stream gushes through a narrow chasm at the top and blossoms into a billowing cataract plunging into deep emerald rock pools.',
  'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80',
  'Secondary alluvial gravels washed down from the Kuruvita watershed contain corundum and quartz pebbles.',
  140,
  'Morning (8:00 AM – 11:30 AM)',
  '+94 45 222 3411 (Kuruvita Pradeshiya Sabha)'
),
(
  'delgamuwa-rajamaha-viharaya',
  'Delgamuwa Rajamaha Viharaya',
  'heritage',
  'Cultural & Heritage',
  4.9,
  8.5,
  'Free Entry',
  6.7197,
  80.3745,
  '• Open Now • 6:00 AM – 8:00 PM',
  'Historic temple where the Sacred Tooth Relic was secretly safeguarded for over 43 years inside a grinding stone.',
  'Delgamuwa Rajamaha Viharaya in Kuruwita is one of Sri Lanka’s most revered historical sanctuaries. The Sacred Tooth Relic of the Buddha was secretly protected here concealed inside a hollowed Kurahan Gala (granite grain-grinding stone) for 43 years before being relocated to Kandy.',
  'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
  'Surrounded by historic gem-bearing river basins of the Denawaka and Kuruvita tributaries.',
  125,
  'Early Morning (6:30 AM – 9:00 AM) or Late Afternoon (4:30 PM – 6:30 PM)',
  '+94 45 226 2110 (Temple Custodian Office)'
),
(
  'batatota-lena',
  'Batatota Lena (Diva Guhava)',
  'heritage',
  'Cultural & Heritage',
  4.8,
  14.8,
  'Free Entry',
  6.7869,
  80.4075,
  '• Open Now • 6:30 AM – 6:00 PM',
  'Vast cavern sanctified in Buddhist traditions as Diva Guhava, where Lord Buddha rested after visiting Sri Pada.',
  'Batatota Cave is a massive limestone cavern measuring over 50 feet high and sheltering a subterranean temple shrine. Geological formations within reveal stalactites and natural karst spring trickles.',
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  'Karst cavern embedded within crystalline limestone bands known for spinel and chrysoberyl occurrences in adjacent streams.',
  460,
  'Morning to Midday (8:00 AM – 2:00 PM)',
  '+94 45 226 3100'
),
(
  'maha-saman-devalaya',
  'Sabaragamu Maha Saman Devalaya',
  'heritage',
  'Cultural & Heritage',
  4.9,
  4.1,
  'Free Entry',
  6.6775,
  80.3802,
  '• Open Now • 5:00 AM – 9:00 PM',
  'The epic spiritual heart of Sabaragamuwa dedicated to Guardian Deity God Sumana Saman.',
  'Erected during the reign of King Parakramabahu II in the 13th century on the banks of the Kalu Ganga, Maha Saman Devalaya is the paramount shrine dedicated to God Sumana Saman.',
  'https://images.unsplash.com/photo-1588598198321-9735fd52455f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
  'Overlooks the revered Kalu Ganga gem trading fords where alluvial pits have yielded blue sapphires for over two millennia.',
  50,
  'Early Morning Puja (5:30 AM – 7:00 AM) or Evening Puja (6:00 PM – 8:00 PM)',
  '+94 45 222 2252 (Devalaya Secretariat)'
),
(
  'traditional-gem-pit',
  'Traditional Gem Pit Experience (Ilama Mining)',
  'gem-mines',
  'Gem Mines & Geology',
  4.9,
  3.2,
  'LKR 1,500 (Guided Tour)',
  6.6882,
  80.4045,
  '• Active Shifts • 8:00 AM – 4:00 PM',
  'Witness active timbered gem shafts and centuries-old bamboo basket washing (Wattiya) for rare Ceylon sapphires.',
  'Descend into the authentic heritage of Ratnapura’s artisanal gemstone extraction. Visitors witness the master craft of shoring vertical shafts with kekilla fern fronds and areca palm timbers.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
  'Active illama stratum yielding padparadscha, royal blue sapphire, star ruby, and alexandrite chrysoberyl.',
  130,
  'Morning shift washing (9:30 AM – 1:00 PM)',
  '+94 45 222 8910 (Ratnapura Artisanal Miners Guild)'
)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ------------------------------------------------------------------------------
-- 7. Initial Visiting Tips Seed
-- ------------------------------------------------------------------------------
INSERT INTO visiting_tips (place_id, tip, sort_order) VALUES
('bopath-ella', 'Best light for photography is morning between 8:00 AM and 11:00 AM', 1),
('bopath-ella', 'Wear sturdy water-resistant footwear as rocks can be slippery', 2),
('bopath-ella', 'Follow safety advisories regarding deep currents in the outer basin', 3),
('delgamuwa-rajamaha-viharaya', 'View the preserved original historic Kurahan Gala displayed in the relic chamber', 1),
('delgamuwa-rajamaha-viharaya', 'Modest white temple attire covering shoulders and knees is strictly requested', 2),
('batatota-lena', 'Carry a dependable flashlight or headlamp to explore darker cavern chambers', 1),
('maha-saman-devalaya', 'Attend the morning puja at 6:00 AM for traditional drums and chimes', 1),
('traditional-gem-pit', 'Wear comfortable clothes and rubber boots or flip-flops for mud walking', 1),
('traditional-gem-pit', 'Ask the pit supervisor before stepping close to the shaft edge', 2);
