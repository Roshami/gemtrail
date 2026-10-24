-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 23, 2026 at 08:44 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gemtrail`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`) VALUES
(1, 'Waterfalls & Nature', NULL, '2026-10-22 13:45:23'),
(2, 'Cultural & Heritage', NULL, '2026-10-22 13:45:23'),
(3, 'Rainforest & Nature', NULL, '2026-10-22 13:45:23'),
(4, 'Tea & Agro Heritage', NULL, '2026-10-22 13:45:23');

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `tourist_place_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `itineraries`
--

CREATE TABLE `itineraries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(180) NOT NULL,
  `trip_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `start_location` varchar(255) DEFAULT NULL,
  `radius_km` decimal(6,2) DEFAULT NULL,
  `transport_method` varchar(80) DEFAULT NULL,
  `estimated_cost` decimal(10,2) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('draft','saved','completed') NOT NULL DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `itinerary_places`
--

CREATE TABLE `itinerary_places` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `itinerary_id` bigint(20) UNSIGNED NOT NULL,
  `tourist_place_id` bigint(20) UNSIGNED NOT NULL,
  `visit_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `place_reviews`
--

CREATE TABLE `place_reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `tourist_place_id` bigint(20) UNSIGNED NOT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `review_text` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

-- --------------------------------------------------------

--
-- Table structure for table `tourist_places`
--

CREATE TABLE `tourist_places` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` int(10) UNSIGNED DEFAULT NULL,
  `name` varchar(180) NOT NULL,
  `short_description` text DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `opening_hours` varchar(255) DEFAULT NULL,
  `entrance_fee` varchar(255) DEFAULT NULL,
  `transport_info` text DEFAULT NULL,
  `travel_time` varchar(100) DEFAULT NULL,
  `visit_duration` varchar(100) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT NULL,
  `district` varchar(100) NOT NULL DEFAULT 'Ratnapura',
  `image_url` text DEFAULT NULL,
  `secondary_image_url` text DEFAULT NULL,
  `best_time` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `elevation_meters` int(11) DEFAULT NULL,
  `mining_context` text DEFAULT NULL,
  `visiting_tips` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`visiting_tips`)),
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tourist_places`
--

INSERT INTO `tourist_places` (`id`, `category_id`, `name`, `short_description`, `description`, `location`, `latitude`, `longitude`, `opening_hours`, `entrance_fee`, `transport_info`, `travel_time`, `visit_duration`, `rating`, `district`, `image_url`, `secondary_image_url`, `best_time`, `contact`, `elevation_meters`, `mining_context`, `visiting_tips`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Bopath Ella Waterfall', 'Dramatic water cascade famously shaped like a sacred Bo leaf with natural plunge pools.', 'Cascading down a 30-meter precipice near Kuruvita, Bopath Ella derives its name from its unmistakable resemblance to the leaf of the sacred Bo tree (Ficus religiosa). The stream gushes through a narrow chasm at the top and blossoms into a billowing cataract that plunges into deep emerald rock pools, creating a mesmerizing natural spectacle nestled among lush green forests.', 'Ratnapura District, Sri Lanka', 6.7925000, 80.3702000, '• Open Now • 7:00 AM – 6:00 PM', 'LKR 100', NULL, NULL, NULL, 4.80, 'Ratnapura', 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80', 'Morning (8:00 AM – 11:30 AM)', '+94 45 222 3411 (Kuruvita Pradeshiya Sabha)', 140, 'Secondary alluvial gravels washed down from the Kuruvita watershed contain corundum and quartz pebbles.', '[\"Best light for photography is morning between 8:00 AM and 11:00 AM\", \"Wear sturdy water-resistant footwear as rocks can be slippery\", \"Follow safety advisories regarding deep currents in the outer basin\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(2, 2, 'Delgamuwa Rajamaha Viharaya', 'Historic temple where the Sacred Tooth Relic of the Buddha was secretly safeguarded for over 43 years inside a grinding stone (Kurahan Gala).', 'Delgamuwa Rajamaha Viharaya in Kuruwita is one of Sri Lanka’s most revered historical sanctuaries. During the Portuguese invasion of the Kotte Kingdom in the 16th century, the Sacred Tooth Relic of the Buddha was smuggled out of Kotte by Venerable Mahathera Keerawelle Hiripitiye Diyawadana Nilame. It was secretly protected here concealed inside a hollowed Kurahan Gala (granite grain-grinding stone) for 43 years before being relocated to the Kingdom of Kandy.', 'Ratnapura District, Sri Lanka', 6.7197000, 80.3745000, '• Open Now • 6:00 AM – 8:00 PM', 'Free Entry', NULL, NULL, NULL, 4.90, 'Ratnapura', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'Early Morning (6:30 AM – 9:00 AM) or Late Afternoon (4:30 PM – 6:30 PM)', '+94 45 226 2110 (Temple Custodian Office)', 125, 'Surrounded by historic gem-bearing river basins of the Denawaka and Kuruvita tributaries.', '[\"View the preserved original historic Kurahan Gala displayed in the special relic chamber\", \"Modest white temple attire covering shoulders and knees is strictly requested\", \"Evening Chanting and oil-lamp offerings create a tranquil spiritual atmosphere\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(3, 2, 'Batatota Lena (Diva Guhava)', 'Vast cavern sanctified in Buddhist traditions as Diva Guhava, where Lord Buddha rested after placing the Sacred Footprint atop Sri Pada.', 'Perched in Erathna along the ancient pilgrim route to Adam\'s Peak, Batatota Lena is a cavernous natural cave shelter steeped in deep antiquity. Buddhist chronicles associate it with Diva Guhava, the legendary shelter where the Buddha and five hundred Arahants rested upon returning from the summit of Sri Pada. The main chamber accommodates hundreds and houses a serene reclining Buddha statue and Kandyan-era drip-ledge murals.', 'Ratnapura District, Sri Lanka', 6.7869000, 80.4075000, '• Open Now • 6:30 AM – 6:00 PM', 'Free Entry', NULL, NULL, NULL, 4.80, 'Ratnapura', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', 'Morning (7:30 AM – 11:00 AM)', '+94 45 222 1890 (Erathna Pilgrim Information Bureau)', 460, 'Set into ancient Precambrian metamorphic gneiss cliffs rich in crystalline quartz and spinel deposits.', '[\"The walk up includes scenic stepped trails shaded by tropical canopy\", \"Carry a small torch to admire inner cave stalactites and natural rock features\", \"Spectacular views across the misty peak wilderness valley below\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(4, 2, 'Batadomba Lena', 'World-renowned prehistoric rock shelter revealing Balangoda Man fossils and microlithic stone tools dating back over 36,000 years.', 'Batadomba Lena near Kuruwita is one of South Asia’s most critically important prehistoric archaeological excavations. Excavations directed by Dr. Shiran Deraniyagala unmasked skeletal remains of Homo sapiens balangodensis (Balangoda Man), geometric microliths, geometric bone implements, pierced sea shells indicating prehistoric trade networks, and charred floral remnants dating back over 36,000 to 40,000 years Before Present.', 'Ratnapura District, Sri Lanka', 6.7725000, 80.4358000, '• Open Now • 7:00 AM – 5:30 PM', 'Free Entry', NULL, NULL, NULL, 4.70, 'Ratnapura', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80', 'Morning (8:00 AM – 11:00 AM)', '+94 11 269 2841 (Department of Archaeology Sri Lanka)', 420, 'Ancient hunter-gatherers exploited local chert, quartz crystals, and hard river pebbles for cutting tools.', '[\"Moderate 45-minute uphill trek through rubber plantations and evergreen forest\", \"Interpretive archaeological signage guides you along the stratigraphic levels\", \"Wear sturdy walking boots suitable for earthen forest paths\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(5, 2, 'Pothgul Rajamaha Viharaya', 'Ancient cave monastery situated on a hillock near Ratnapura, associated with King Vattagamani Abhaya (Walagamba).', 'Pothgul Rajamaha Viharaya at Hidellana is built into a lofty granite cave overhang dating back to the 1st century BC reign of King Walagamba. The temple complex houses an impressive 27-foot reclining Buddha image, beautifully conserved drip ledges, and painted rock ceilings depicting Jataka tales created during the Kandyan revival under King Kirti Sri Rajasinha.', 'Ratnapura District, Sri Lanka', 6.6432000, 80.4178000, '• Open Now • 6:00 AM – 7:00 PM', 'Free Entry', NULL, NULL, NULL, 4.60, 'Ratnapura', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'Late Afternoon (4:00 PM – 6:30 PM)', '+94 45 222 2490 (Hidellana Temple Trustees)', 180, 'Commands elevated views over the gem-yielding alluvium of the Kalu Ganga basin.', '[\"Climb approximately 450 stone steps flanked by flowering Araliya frangipani trees\", \"Panoramic 360-degree vista of Ratnapura town and the Adam’s Peak mountain ridge\", \"Pleasant and peaceful retreat for meditation and photography\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(6, 3, 'Sri Pada (Adam’s Peak)', 'Conical sacred mountain (2,243m) revered by four world religions, crowned by the Sacred Footprint and breathtaking dawn shadow.', 'Sri Pada, rising 2,243 meters into the highland mist, is one of the world\'s most venerated pilgrimage peaks. Revered by Buddhists as the footprint of Gautama Buddha (Sri Pada), by Hindus as Lord Shiva\'s footprint, and by Muslims and Christians as Adam\'s footprint, the summit has drawn travelers for over a millennium. The classical Ratnapura-Palabaddala trail is the most historic and scenic route, winding through ancient cloud forests.', 'Ratnapura District, Sri Lanka', 6.8096000, 80.4994000, '• Open 24 Hours • Pilgrimage Season: Dec–May', 'Free Entry', NULL, NULL, NULL, 4.90, 'Ratnapura', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', 'Night to Dawn Ascent (Midnight – 6:30 AM)', '+94 45 222 2235 (Sabaragamuwa Pilgrimage Operations)', 2243, 'Waters cascading from Sri Pada feed all major gem gravel rivers in Sabaragamuwa province.', '[\"Start the night ascent around 1:00 AM from Palabaddala to witness the iconic sunrise (Ira Sevaya)\", \"Prepare warm layers as summit temperatures can drop to 8°C–12°C with strong gusts\", \"Season runs from Unduvap Poya (December) to Vesak Poya (May) with lit pathways\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(7, 2, 'Rathganga Viharaya (Punchi Dambulla)', 'Picturesque cave monastery affectionately known as \"Punchi Dambulla\" nestled near the crystal-clear Rath Ganga river.', 'Rathganga Asokaramaya Rajamaha Viharaya is lovingly referred to by locals as \"Punchi Dambulla\" (Little Dambulla) due to its striking golden cave murals and expansive rock shrine chambers. Situated in a scenic village where gemstone panners harvest the cool Rath Ganga gravels, the temple features an imposing standing Buddha statue and tranquil riverfront meditation paths.', 'Ratnapura District, Sri Lanka', 6.7423000, 80.4489000, '• Open Now • 6:00 AM – 7:30 PM', 'Free Entry', NULL, NULL, NULL, 4.70, 'Ratnapura', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'Morning (8:30 AM – 11:30 AM)', '+94 45 226 7102 (Rathganga Temple Office)', 310, 'The Rath Ganga (Gem River) is one of the most celebrated historical watercourses for corundum extraction.', '[\"Combine your visit with observing traditional river gem washing in the adjacent stream\", \"Peaceful sanctuary away from commercial tourist crowds\", \"Modest attire required within the shrine\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(8, 4, 'Tea Research Institute (Ratnapura Centre)', 'National agronomy research station advancing low-country Ceylon tea cultivation, soil science, and estate technology.', 'The Tea Research Institute (TRI) Ratnapura Sub-Station specializes in research and extension services for Sri Lanka\'s vibrant low-grown tea sector (known internationally for bold, malty, and deep-amber liquors). Set against terraced green hills, the facility demonstrates clone testing nurseries, organic pest management, and innovative agricultural practices tailored for Sabaragamuwa’s tropical climate.', 'Ratnapura District, Sri Lanka', 6.6958000, 80.4189000, '• Open Weekdays • 8:30 AM – 4:30 PM', 'Free Entry / Tour by prior notice', NULL, NULL, NULL, 4.50, 'Ratnapura', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'Morning (9:00 AM – 12:00 PM)', '+94 45 222 2341 (TRI Ratnapura Extension)', 165, 'Tea estates in Ratnapura coexist with regulated underground alluvial gem mining leases.', '[\"Educational visits can be arranged by calling ahead on official business days\", \"Walk through the demonstration tea garden featuring certified high-yield Ceylon tea cultivars\", \"Splendid photography spots across rolling emerald tea plantations\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(9, 1, 'Katugas Ella Waterfall', '6-meter tiered waterfall hidden within pristine forest foliage close to Ratnapura town.', 'Katugas Ella is a scenic, cascading waterfall formed by the Katugas Ela stream flowing down from the high ridges of the Peak Wilderness sanctuary. Cascading over split granite shelves into a natural rock pool shaded by dense bamboo groves and giant ferns, it is a favored tranquil retreat for nature enthusiasts, picnickers, and landscape photographers.', 'Ratnapura District, Sri Lanka', 6.7025000, 80.4285000, '• Open Now • Sunrise to Sunset', 'Free Entry', NULL, NULL, NULL, 4.60, 'Ratnapura', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80', 'Morning (8:00 AM – 11:00 AM)', '+94 45 222 2275 (District Tourism Secretariat)', 175, 'The stream bed contains washed quartz crystals, tourmaline fragments, and iron-bearing heavy sands.', '[\"Located just a 15-minute drive from Ratnapura town followed by a short nature walk\", \"Exercise caution when walking on moss-covered granite slabs during the monsoon\", \"Keep the nature reserve pristine by taking all litter with you\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(10, 2, 'Malwala Viharaya', 'Serene riverside village temple on the traditional pilgrim road to Sri Pada through Malwala valley.', 'Malwala Rajamaha Viharaya is located in the charming riverside village of Malwala along the historic pilgrim thoroughfare. Known for its peaceful setting amidst coconut palms and rubber groves, the temple preserves traditional Sabaragamuwa Buddhist architecture, an antique bell tower, and a well-curated image hall containing mural paintings depicting the local Buddhist history.', 'Ratnapura District, Sri Lanka', 6.7214000, 80.4412000, '• Open Now • 6:00 AM – 7:00 PM', 'Free Entry', NULL, NULL, NULL, 4.50, 'Ratnapura', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'Morning (7:30 AM – 10:30 AM)', '+94 45 222 8412 (Malwala Temple)', 190, 'Close to the historic Malwala gem trading outposts along the Kalu Ganga tributaries.', '[\"Stop by during the journey along the scenic Malwala-Gilimale mountain road\", \"Respectful temple attire required\", \"The resident monks are welcoming and often share stories of ancient pilgrimage travelers\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(11, 2, 'Gilimale Rankoth Viharaya', 'Ancient monastery in Gilimale linked to King Vijayabahu I and historic pilgrim rest houses (Ambalama).', 'Gilimale has served as a pivotal staging post for pilgrims trekking to Sri Pada since royal antiquity. Epigraphical records reveal that King Vijayabahu I (1055–1110 AD) granted the fertile village of Gilimale to maintain pilgrim ambalamas and provide food for travelers. Rankoth Viharaya stands at the spiritual heart of this ancient village, featuring a historic stupa, bodhi tree courtyard, and Kandyan period wood carvings.', 'Ratnapura District, Sri Lanka', 6.7485000, 80.4578000, '• Open Now • 6:00 AM – 7:30 PM', 'Free Entry', NULL, NULL, NULL, 4.70, 'Ratnapura', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'Morning (8:00 AM – 11:00 AM)', '+94 45 226 9104 (Gilimale Heritage Trust)', 230, 'Famous for river sandbars where sparkling spinels and garnets have been gathered for centuries.', '[\"Explore the ancient stone inscriptions commemorating royal land grants\", \"Picturesque river swimming spots nearby at Gilimale bridge\", \"Quiet, deeply contemplative spiritual aura\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(12, 2, 'Nedun Viharaya', 'Historic temple with centuries-old architecture, timber carvings, and deep spiritual heritage.', 'Nedun Rajamaha Viharaya is a distinguished ancient shrine in the Kuruwita valley. Notable for its serene natural environs and architectural relics dating from the transitional medieval kingdom period, the temple features an antique preaching hall (Bana Maduwa) constructed with heavy hardwood pillars, and a tranquil Bo tree courtyard overlooking lush paddy lands.', 'Ratnapura District, Sri Lanka', 6.7112000, 80.3421000, '• Open Now • 6:00 AM – 6:30 PM', 'Free Entry', NULL, NULL, NULL, 4.50, 'Ratnapura', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'Morning (7:00 AM – 10:00 AM)', '+94 45 226 1502 (Nedun Viharaya Office)', 130, 'Situated along the rich gravel plains between Kuruwita and Eheliyagoda.', '[\"Observe the intricate wood joinery of the historic preaching hall\", \"Great stop when traveling between Colombo and Ratnapura on the High Level Road\", \"Please maintain customary quietude and respectful attire\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(13, 2, 'Kukuluwagala Rajamaha Viharaya', 'Elevated rock cave temple offering breathtaking vistas over the western Sabaragamuwa plains.', 'Kukuluwagala Rajamaha Viharaya is perched dramatically on a high rocky prominence near Eheliyagoda. Legendary tales connect the site to King Walagamba’s refuge period. The temple features ancient drip-ledge caves, antique stone stairs, rock-carved water cisterns (Kem), and a modern scenic viewing terrace that rewards climbers with expansive panoramic vistas of rubber estates, coconut groves, and distant blue mountain ranges.', 'Ratnapura District, Sri Lanka', 6.7324000, 80.2845000, '• Open Now • 6:30 AM – 6:30 PM', 'Free Entry', NULL, NULL, NULL, 4.60, 'Ratnapura', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'Late Afternoon (3:30 PM – 6:00 PM)', '+94 36 225 8120 (Eheliyagoda Pradeshiya Sabha)', 290, 'Surrounding granite massifs exhibit classic quartz pegmatite dykes and tourmaline crystals.', '[\"Wear good footwear for climbing the scenic rock-cut staircase\", \"Stunning panorama at sunset when the western sky glows golden-orange\", \"Carry drinking water during sunny midday hours\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(14, 3, 'Sinharaja Forest Reserve', 'UNESCO World Heritage virgin tropical rainforest harboring over 50% of Sri Lanka\'s endemic flora and fauna species.', 'Sinharaja Forest Reserve is Sri Lanka’s last viable primary tropical rainforest and a celebrated UNESCO World Heritage Site and Biosphere Reserve. Spanning rugged ridges in the southern quadrant of Ratnapura District, this ecological paradise is home to dense primary canopies, towering dipterocarps, elusive purple-faced langurs, Sri Lanka blue magpies, red-faced malkohas, and mixed-species bird feeding flocks found nowhere else on Earth.', 'Ratnapura District, Sri Lanka', 6.4258000, 80.4578000, '• Open Daily • 6:30 AM – 5:30 PM', 'Foreign: LKR 2,000 / Local: LKR 100', NULL, NULL, NULL, 4.90, 'Ratnapura', 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', 'Early Morning (6:30 AM – 10:30 AM)', '+94 45 225 5454 (Sinharaja Forest Office Kudawa)', 550, 'The rainforest preserves pristine un-mined geological stratigraphy and crystal-clear mountain streams.', '[\"Official Forest Department guides are mandatory and available at the Kudawa/Kalawana gate\", \"Wear leech socks and carry rain gear as tropical showers are frequent year-round\", \"Bring binoculars and a telephoto lens for spectacular bird and butterfly sightings\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(15, 2, 'Budulena Rajamaha Viharaya', 'Cave sanctuary nestled in rocky hills featuring ancient rock inscriptions and secluded meditation hermitages.', 'Budulena Rajamaha Viharaya is an ancient rock-shelter monastery in the Pelmadulla valley. Set amid towering granite boulders and shaded groves of mahogany and ironwood (Na), this tranquil retreat holds pre-Christian Brahmi inscriptions proving monastic occupation over 2,100 years ago. The cavern shrine features historic statues, rock drip ledges, and quiet meditation halls used by resident Theravada monks.', 'Ratnapura District, Sri Lanka', 6.6412000, 80.4956000, '• Open Now • 6:00 AM – 6:30 PM', 'Free Entry', NULL, NULL, NULL, 4.60, 'Ratnapura', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'Morning (8:00 AM – 11:00 AM)', '+94 45 226 3120 (Pelmadulla Heritage Guild)', 260, 'Situated in the heart of the Pelmadulla corundum mining corridor.', '[\"Observe the ancient Brahmi inscriptions etched underneath the exterior cave brow\", \"Quiet demeanor expected around active meditation hermitages\", \"Combine with visits to nearby Pelmadulla Rajamaha Viharaya and Kirindi Ella\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(16, 2, 'Pelmadulla Rajamaha Viharaya', 'Cradle of modern Buddhist scholarship where the historic Fifth Buddhist Council was convened in 1865.', 'Pelmadulla Rajamaha Viharaya is one of the most intellectually influential Buddhist establishments in Sri Lanka’s modern history. In July 1865, under the patronage of Venerable Hikkaduwe Sri Sumangala Nayaka Thera and the wealthy gem-mine owning philanthropist Iddamalgoda Basnayake Nilame, the historic Tripitaka Revision Council (Fifth Buddhist Council) was convened here for five months to produce authentic palm-leaf editions of the Pali Canon.', 'Ratnapura District, Sri Lanka', 6.6212000, 80.5489000, '• Open Now • 6:00 AM – 8:00 PM', 'Free Entry', NULL, NULL, NULL, 4.80, 'Ratnapura', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'Morning (8:30 AM – 11:30 AM) or Afternoon (3:00 PM – 5:30 PM)', '+94 45 226 4210 (Pelmadulla Viharaya Trust)', 210, 'Patronized historically by the legendary gem mine proprietors of Pelmadulla.', '[\"Visit the historical library archive displaying ancient Ola-leaf palm manuscripts\", \"Magnificent painted ceiling mandalas from the 19th-century revival\", \"Easily accessible directly on the Colombo-Batticaloa (A4) Highway\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(17, 1, 'Kirindi Ella Waterfall', 'Majestic 116m multi-tiered waterfall cascading into a deep pool shrouded in folklore.', 'Plunging 116 meters in two distinct stages into an ancient forested gorge near Pelmadulla, Kirindi Ella is among the highest and most awe-inspiring waterfalls in Sabaragamuwa Province. The torrent originates in the Kuttapitiya tea mountains and crashes into the deep \"Diyagala Pool\". Folklore relates that medieval Queen Sugala safeguarded royal jewels and uncut blue sapphires in hidden caverns behind this thundering curtain of water.', 'Ratnapura District, Sri Lanka', 6.6214000, 80.5284000, '• Open Now • Sunrise to Sunset', 'Free Entry', NULL, NULL, NULL, 4.80, 'Ratnapura', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80', 'Early Morning (7:00 AM – 10:00 AM)', '+94 45 226 4301 (Pelmadulla Forest Division)', 380, 'Upper headwaters filter through virgin rainforest quartz gravel beds.', '[\"Take the stone stairway down to the observation wooden deck (about 15 mins walk)\", \"Swimming in the deep plunge pool is strongly discouraged due to underwater eddies\", \"Ideal for birdwatching; crested serpent eagles frequently soar above the gorge\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(18, 2, 'College of Education (Sabaragamuwa / Kahawatte)', 'Major national higher education institution training teachers and academic scholars for the Sabaragamuwa region.', 'The National College of Education serving the Sabaragamuwa Province is an expansive tertiary campus dedicated to training future educators. Situated in a lush valley setting surrounded by tea and rubber landscapes, the institution features handsome modernist campus buildings, lecture theaters, botanical grounds, and extensive sporting facilities representing modern regional development.', 'Ratnapura District, Sri Lanka', 6.5824000, 80.5645000, '• Open Weekdays • 8:00 AM – 4:30 PM', 'Free Entry', NULL, NULL, NULL, 4.50, 'Ratnapura', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80', 'Morning (9:00 AM – 1:00 PM)', '+94 45 227 0214 (Academic Registrar)', 220, 'Situated in the central gem trade corridor linking Pelmadulla, Kahawatte, and Nivithigala.', '[\"Campus visits generally require registration at the main administrative gate\", \"Lush scenic gardens provide pleasant walks and leafy scenery\", \"Close to central Kahawatte gem auction markets\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(19, 3, 'Giant Pus Wela (Giant Creeper)', 'Centuries-old botanical wonder: a mammoth tropical woody liana spanning across forest canopies.', 'The Giant Pus Wela (Entada phaseoloides / Giant Creeper) is an astonishing botanical treasure of Sabaragamuwa\'s tropical rainforest ecosystems. Believed to be several centuries old, the twisting, elephantine woody vine measures over a meter in diameter at its base and coils snakes-like through the crowns of multiple ancient canopy trees. The vine bears massive seed pods exceeding one meter in length containing smooth, dark mahogany-colored seeds.', 'Ratnapura District, Sri Lanka', 6.5512000, 80.5894000, '• Open Now • Sunrise to Sunset', 'Free Entry', NULL, NULL, NULL, 4.70, 'Ratnapura', 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', 'Morning (8:00 AM – 11:30 AM)', '+94 45 227 8219 (Sabaragamuwa Nature Watch)', 240, 'Thrives in pristine alluvial soil banks rich in groundwater and mineral nutrients.', '[\"A true paradise for nature photographers, botanists, and traveling families\", \"Please treat the ancient vine with care; climbing on its coils is strictly prohibited\", \"Follow local forest trails accompanied by a village naturalist\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(20, 2, 'Opathanayaka Kande Ancient Viharaya', 'Ancient mountain summit hermitage with panoramic views, meditation cells, and boulder shrines.', 'Opathanayaka Kande Ancient Viharaya crowns a lofty forested ridge in the southern reaches of the district. Dating back to the era of the Kandyan monarchs with older Anuradhapura roots, the temple features natural granite rock shelters converted into shrine rooms, a peaceful white stupa that gleams against the green forest canopy, and tranquil open rocky ledges that invite deep spiritual reflection.', 'Ratnapura District, Sri Lanka', 6.5389000, 80.6124000, '• Open Now • 6:00 AM – 6:30 PM', 'Free Entry', NULL, NULL, NULL, 4.60, 'Ratnapura', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'Early Morning (6:30 AM – 9:00 AM)', '+94 45 227 3410 (Opathanayaka Trustees)', 410, 'Mountain ridge overlooks downstream ruby and spinel bearing gravel river valleys.', '[\"A short uphill walk leads to the summit viewpoint commanding breathtaking views\", \"Great location for sunrise or quiet early evening meditation\", \"Remove hats and shoes before stepping onto the sacred rock terrace\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(21, 2, 'Balangoda Municipal Council & Historic Town', 'Charming upland hub synonymous with the Balangoda Man culture, historic tea commerce, and civic heritage.', 'Balangoda is a renowned highland plateau town celebrated globally for archaeological discoveries that gave modern anthropology the term \"Balangoda Culture\". Located on the scenic A4 highway against the backdrop of the Horton Plains escarpment, the town serves as an administrative and cultural crossroad with historic colonial-era architecture, vibrant fresh-produce and spice markets, and charming mountain climate.', 'Ratnapura District, Sri Lanka', 6.6498000, 80.7025000, '• Open Daily • Civic Hours', 'Free Entry', NULL, NULL, NULL, 4.50, 'Ratnapura', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80', 'Morning (8:30 AM – 1:00 PM)', '+94 45 228 7275 (Balangoda Urban Council)', 530, 'Gateway between low-country gem gravel belts and highland tea plantation belts.', '[\"Explore the vibrant weekly highland spice and agricultural fair in the center of town\", \"Try authentic regional sweets and mountain tea at roadside traditional bakeries\", \"The town provides excellent tourist facilities, banks, fuel stations, and restaurants\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(22, 2, 'Bolthumbe Saman Devalaya', 'Sacred 16th-century devalaya founded by King Mayadunne to protect the sacred ornaments of God Sumana Saman.', 'Bolthumbe Saman Devalaya is a deeply sacred historical shrine situated near Balangoda. During the 16th century, when Portuguese armies attacked and desecrated the Maha Saman Devalaya in Ratnapura, the chief custodians secretly transported the sacred weapons, jewelry, and insignia of deity Sumana Saman here to the mountain stronghold of Bolthumbe. King Mayadunne of Sitawaka consecrated this shrine, which has preserved ancient rituals, drumming styles, and an annual Perahera for over 450 years.', 'Ratnapura District, Sri Lanka', 6.6712000, 80.6874000, '• Open Now • 6:00 AM – 7:30 PM', 'Free Entry', NULL, NULL, NULL, 4.80, 'Ratnapura', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'Late Afternoon to Evening (4:30 PM – 6:30 PM)', '+94 45 228 7320 (Bolthumbe Devalaya Trustees)', 510, 'Historic spiritual sanctuary where traditional highland gem seekers offer vows before excavation.', '[\"Admire the authentic Kandyan-Sitawaka wooden pillars, clay tile roofs, and stone doorways\", \"Attend the evening drumming and puja ritual at 6:00 PM\", \"Traditional white clothing recommended\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(23, 3, 'Belihuloya River & Mountain Valley', 'Idyllic mountain destination where crystal mountain streams meet cool highland breezes; famous for hiking and nature.', 'Belihuloya is a postcard-perfect nature hamlet situated at an elevation of 600m in the Balangoda mountain basin. It links the wet and intermediate climatic zones, generating unique microclimates and remarkable ecological biodiversity. The clear, boulder-strewn waters of the Belihuloya River flow down from Horton Plains, providing exhilarating opportunities for natural river bathing, canoeing, mountain trekking, and scenic photography.', 'Ratnapura District, Sri Lanka', 6.7145000, 80.7712000, '• Open 24 Hours • Scenic Spot', 'Free Entry', NULL, NULL, NULL, 4.90, 'Ratnapura', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80', 'Morning (8:00 AM – 11:30 AM) or Late Afternoon (3:00 PM – 5:30 PM)', '+94 45 228 0100 (Belihuloya Tourist Information)', 620, 'Ancient metallurgical smelting sites found in Belihuloya proved wind-powered iron smelting took place here in 300 BC.', '[\"Sample the fresh mountain stream waters in designated shallow bathing pools\", \"Outstanding base camp for trekking up toward Horton Plains and Baker’s Bend\", \"Lined with scenic eco-lodges, riverside cafes, and camping sites\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(24, 2, 'Sabaragamuwa University of Sri Lanka', 'Premier national university set against the majestic Balangoda mountain escarpment in Belihuloya.', 'Established in 1995, the Sabaragamuwa University of Sri Lanka (SUSL) is located in one of the most picturesque university settings in South Asia. Overlooking the cloud-draped mountain range of Samanalawewa and Belihuloya, the university is renowned for faculties in Applied Sciences, Geomatics (Surveying and Remote Sensing), Agricultural Sciences, and Sabaragamuwa cultural preservation.', 'Ratnapura District, Sri Lanka', 6.7125000, 80.7892000, '• Campus Hours • 8:00 AM – 5:00 PM', 'Free Entry / Visitors Gate Pass', NULL, NULL, NULL, 4.70, 'Ratnapura', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80', 'Morning (9:00 AM – 1:00 PM)', '+94 45 228 0014 (Sabaragamuwa University General Inquiry)', 650, 'Faculty of Geomatics and Applied Sciences conducts specialized research in gemology, GIS, and geological mapping.', '[\"Visitors may register at the main security pavilion to tour public university spaces\", \"The Faculty of Geomatics planetarium and campus viewpoints provide breath-taking highland vistas\", \"Quiet and studious environment with pleasant mountain breezes year-round\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(25, 3, 'World’s End (Horton Plains Border)', 'Stupendous sheer cliff sheer drop of 870m terminating the Central Highlands and overlooking the southern sea.', 'World’s End is a sheer precipice located at the southern edge of the Horton Plains plateau, directly marking the northern boundary of Ratnapura District. The cliff drops perpendicularly for 870 meters (nearly 4,000 feet) down into the tea and paddy plains of Balangoda and southern Sri Lanka. On clear mornings before clouds roll in, observers can view the Indian Ocean glistening 80 kilometers away.', 'Ratnapura District, Sri Lanka', 6.8042000, 80.7936000, '• Open Daily • 6:00 AM – 4:00 PM', 'Wildlife Dept Ticket: Foreign LKR 4,000 / Local LKR 150', NULL, NULL, NULL, 4.90, 'Ratnapura', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', 'Early Morning (6:30 AM – 9:00 AM)', '+94 52 222 3125 (Horton Plains Wildlife Office)', 2140, 'Rainfall on this escarpment feeds the upper catchment of the Walawe River and alluvial gem plains.', '[\"Arrive early at the viewing deck between 6:30 AM and 9:00 AM before dense clouds veil the drop\", \"The 9.5 km circular trail covers Baker’s Falls, Chimney Pool, and Lesser World’s End\", \"Strictly polythene-free national park; please cooperate with wildlife bag checks\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(26, 4, 'Rajawaka Traditional Medicinal Garden', 'Authentic Ayurvedic botanical conservation sanctuary cultivating hundreds of rare indigenous healing flora.', 'Rajawaka Traditional Medicinal Garden is situated in the scenic intermediate zone of Balangoda. Preserving centuries of traditional Hela Wedakama (indigenous Sri Lankan healing) traditions, the gardens cultivate rare and endangered medicinal herbs, roots, climbers, and medicinal trees like Aralu, Bulu, Nelli, Sandalwood, and rare orchids used in ancient pharmacopeia.', 'Ratnapura District, Sri Lanka', 6.6345000, 80.7812000, '• Open Daily • 8:00 AM – 5:00 PM', 'LKR 300', NULL, NULL, NULL, 4.60, 'Ratnapura', 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80', 'Morning (8:30 AM – 11:30 AM)', '+94 45 228 9110 (Rajawaka Ayurvedic Centre)', 480, 'Botanical flora often serve as natural bio-indicators of subsurface mineral deposits.', '[\"Guided educational walks explain the properties and healing uses of traditional plants\", \"Herbal infusions and pure wild honey available at the traditional dispensary\", \"Peaceful, fragrance-filled garden pathways perfect for gentle walking\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(27, 2, 'Mahawalathenna Walawwa', 'Ancestral manor home of Sirimavo Bandaranaike, the world\'s first female Prime Minister.', 'Mahawalathenna Walawwa in Balangoda is an iconic architectural monument of modern Sri Lankan history. It was the ancestral seat of the aristocratic Mahawalatenne family and the birthplace of Madame Sirimavo Bandaranaike (née Ratwatte), who in 1960 became the world\'s first elected female Prime Minister. The stately manor displays classic colonial-Kandyan architecture with expansive central courtyards, carved timber verandas, and manicured lawns.', 'Ratnapura District, Sri Lanka', 6.6412000, 80.7189000, '• Daylight Viewing • Historic Landmark', 'Free Entry / Exterior viewing', NULL, NULL, NULL, 4.60, 'Ratnapura', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80', 'Morning (9:00 AM – 11:30 AM)', '+94 45 228 7210 (Balangoda Heritage Association)', 520, 'Historic feudal estates in Balangoda held major mineral and agricultural concessions.', '[\"Maintained with pride as a historic landmark of global political significance\", \"Photography of the exterior colonial façade and manicured grounds is permitted\", \"Located just a 5-minute drive from Balangoda town center\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(28, 2, 'Kuragala Ancient Buddhist Monastery', 'Monumental rock hermitage dating to the 2nd century BC with drip-ledge caves and a magnificent illuminated stupa.', 'Kuragala is a breathtaking ancient Buddhist cave monastery complex rising above the dry-zone plains near Kaltota. Inscriptions in early Brahmi script date its establishment to the 2nd century BC under Buddhist monastic patronage. The site features the soaring Asadhrusha Stupa atop a massive monolith, cavernous caves (such as Hituwangala), and panoramic viewpoints overlooking the southern horizon towards Kaltota and Udawalawe.', 'Ratnapura District, Sri Lanka', 6.6189000, 80.8654000, '• Open 24 Hours • 5:00 AM – 9:00 PM recommended', 'Free Entry', NULL, NULL, NULL, 4.90, 'Ratnapura', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'Sunrise (5:30 AM – 7:30 AM) or Sunset (5:00 PM – 7:00 PM)', '+94 45 228 6500 (Kuragala Monastery Secretariat)', 380, 'Situated along the geological boundary where the Central Highlands plunge into the southern plains.', '[\"Climb to the summit stupa terrace for magnificent sunrise or sunset vistas\", \"The illuminated stupa at dusk is a spectacular sight visible for miles across the plains\", \"Well-paved walking pathways and facilities for pilgrims of all ages\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(29, 2, 'Budugala Ancient Hermitage', 'Ancient forest hermitage with rock-cut caves, ancient ruins, and undisturbed natural beauty.', 'Budugala is a tranquil ancient forest monastery located south of Balangoda in the Kaltota valley. Similar to the classical monastic architecture of Ritigala and Arankele, the complex preserves stone meditation platforms (Padhanaghara), ancient stone bridges, lotus ponds, and ancient drip-ledge caves once inhabited by meditating forest-dwelling Buddhist monks.', 'Ratnapura District, Sri Lanka', 6.6025000, 80.8542000, '• Open Now • 6:30 AM – 6:00 PM', 'Free Entry', NULL, NULL, NULL, 4.70, 'Ratnapura', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'Morning (8:00 AM – 11:00 AM)', '+94 45 228 6200 (Budugala Hermitage)', 310, 'Crystal-clear jungle streams run over polished pink quartz and crystalline limestone beds.', '[\"Maintain complete quiet and serenity in this active meditation monastery\", \"Walk softly along ancient stone pathways through the thick dry evergreen canopy\", \"Carry drinking water and modest temple attire\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(30, 2, 'Kottimbulwala Rajamaha Viharaya', 'Centuries-old rock cave temple known for exquisite Kandyan murals and serene mountain backdrop.', 'Kottimbulwala Rajamaha Viharaya is located on a rocky bluff between Balangoda and Weligepola. Established during the medieval royal era and refurbished under King Kirti Sri Rajasinha, the rock shrine features vibrant murals depicting Buddhist cosmology, floral creepers, and Jataka tales alongside rock drip-ledges and a panoramic Bo tree platform.', 'Ratnapura District, Sri Lanka', 6.6112000, 80.7324000, '• Open Now • 6:00 AM – 6:30 PM', 'Free Entry', NULL, NULL, NULL, 4.60, 'Ratnapura', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'Morning (8:00 AM – 10:30 AM)', '+94 45 228 4110 (Kottimbulwala Temple Committee)', 410, 'Bordered by traditional gem-panning waterways descending from the Weligepola hills.', '[\"Study the vivid natural vegetable-dye murals inside the main cave image hall\", \"Enjoy scenic views over the southern valleys of Sabaragamuwa\", \"Modest white clothing required for entering the sanctum\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(31, 2, 'Godakawela Mahinda Maha Viharaya', 'Prominent Buddhist educational and monastic hub serving the Godakawela trading valley.', 'Godakawela Mahinda Maha Viharaya stands as a landmark religious and community center in the thriving commercial town of Godakawela. Positioned along the Colombo-Batticaloa highway, the temple complex features a grand white stupa, an expansive monastic pirivena (seminary) providing high-level Buddhist philosophy education, and an elaborately sculpted Makara Torana (dragon arch) gateway.', 'Ratnapura District, Sri Lanka', 6.5412000, 80.6489000, '• Open Now • 6:00 AM – 8:00 PM', 'Free Entry', NULL, NULL, NULL, 4.60, 'Ratnapura', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'Morning (7:30 AM – 10:30 AM) or Late Afternoon (4:30 PM – 6:30 PM)', '+94 45 224 0210 (Godakawela Temple Office)', 180, 'Godakawela represents an important regional gem marketplace connecting Kahawatte and Embilipitiya.', '[\"A welcoming and peaceful stop when traveling along the southern highway route\", \"Explore the vibrant weekly Godakawela farmer and gem trader markets nearby\", \"Evening oil lamp offerings create a peaceful atmosphere\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(32, 3, 'Wavulpane Limestone Cave & Waterfall', 'Prehistoric limestone cavern housing hundreds of thousands of bats and an extraordinary subterranean waterfall.', 'Wavulpane (meaning \"Cave of Bats\") is one of Sri Lanka’s most astonishing geological treasures. Located in the Kolonne range, this massive pre-Cambrian limestone cave system is estimated to be over 500 million years old. Inside its pitch-dark caverns, an underground stream plunges as a subterranean waterfall, while colonies of over 250,000 bats cling to stalactite-studded ceilings. Fossilized sea-creature impressions can be observed in the cavern walls.', 'Ratnapura District, Sri Lanka', 6.4712000, 80.7025000, '• Daylight Hours • 7:00 AM – 4:30 PM', 'Free Entry / Local guide tip recommended', NULL, NULL, NULL, 4.80, 'Ratnapura', 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80', 'Morning (8:00 AM – 12:00 PM)', '+94 45 226 0100 (Kolonne Regional Information)', 280, 'Uncommon high-purity crystalline limestone and marble bedrock formations.', '[\"Carry powerful waterproof flashlights or headlamps to navigate the cavern interior\", \"Wear waterproof boots or shoes you don’t mind getting wet; the cave stream is knee-deep\", \"Hiring a knowledgeable local village guide at the entrance is strongly advised\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(33, 1, 'Duvili Ella Waterfall (Kaltota)', 'Spectacular 40m waterfall that atomizes into a shimmering cloud of dust-like mist (\"Duvili\").', 'Duvili Ella (meaning \"Dust Falls\") at Kaltota is one of the most picturesque natural waterfalls in southern Sabaragamuwa. Formed by the Walawe River cascade rushing off the highland shelf into the dry-zone plains, the falls plunge 40 meters into a wide amphitheater basin. The immense force with which the torrent strikes the rocks below throws up a perpetual fine spray of dust-like mist that shimmers with rainbows under sunlight.', 'Ratnapura District, Sri Lanka', 6.6432000, 80.8856000, '• Open Daily • Sunrise to Sunset', 'Free Entry', NULL, NULL, NULL, 4.80, 'Ratnapura', 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80', 'Morning (8:00 AM – 11:30 AM)', '+94 45 228 7275 (Balangoda Regional Secretariat)', 270, 'Fed by the mineral-rich upper catchment of the Walawe River basin.', '[\"Accessible via a paved road from Balangoda through Kaltota with a short scenic trail\", \"Keep cameras protected in waterproof bags when approaching the misty spray zone\", \"Marvelous viewpoint pavilion suitable for family picnics and photography\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(34, 2, 'Bambarakanda Aranya Senasanaya', 'Secluded forest hermitage nestled in mountain pines near Sri Lanka\'s highest waterfall.', 'Bambarakanda Aranya Senasanaya is a tranquil forest monastery nestled in the mountain folds of the southern escarpment near Kalupahana. Shaded by pine groves, native ironwood trees, and wild bamboo, the hermitage provides solitary meditation kutis (cells) for Buddhist ascetics practicing Vipassana mindfulness meditation in total harmony with nature.', 'Ratnapura District, Sri Lanka', 6.7624000, 80.8289000, '• Meditation Hours • Daylight', 'Free Entry', NULL, NULL, NULL, 4.70, 'Ratnapura', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'Morning (7:30 AM – 10:30 AM)', '+94 45 228 1200 (Aranya Hermitage Committee)', 780, 'Granite escarpments reveal veins of high-grade pegmatite quartz and feldspar.', '[\"Strict silence and respectful monastic decorum must be observed at all times\", \"Suitable for travelers seeking deep spiritual stillness and mindful meditation\", \"Wear covered white attire and remove footwear when entering the sacred premises\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(35, 2, 'Sankapala Rajamaha Viharaya', 'Epic historical cave monastery linked to King Dutugemunu’s giant warrior Phussadeva in the 2nd century BC.', 'Sankapala Rajamaha Viharaya is one of the most celebrated ancient rock temples in Sri Lanka. Situated on the Pelmadulla-Embilipitiya road (A18), the temple’s origins date to the 2nd century BC. After the historic victory of King Dutugemunu, his chief warrior giant Phussadeva—whose conch-shell trumpet call inspired victorious armies—renounced warfare, entered the Buddhist monastic order, and lived here as an Arahant monk. Phussadeva’s burial stupa and prehistoric caves crown the rock cliffs.', 'Ratnapura District, Sri Lanka', 6.4789000, 80.7512000, '• Open Now • 6:00 AM – 8:00 PM', 'Free Entry', NULL, NULL, NULL, 4.80, 'Ratnapura', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'Morning (7:30 AM – 10:30 AM) or Sunset (4:30 PM – 6:30 PM)', '+94 45 224 8110 (Sankapala Viharaya Secretariat)', 220, 'Ancient epigraphs here record royal donations of gem-rich lands to the Sangha.', '[\"Climb the historic rock steps to visit Warrior Phussadeva’s tomb stupa and caves\", \"View the cave frescoes dating from the Anuradhapura and Kandyan kingdoms\", \"Convenient roadside access with parking, refreshment stalls, and flower kiosks\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55');
INSERT INTO `tourist_places` (`id`, `category_id`, `name`, `short_description`, `description`, `location`, `latitude`, `longitude`, `opening_hours`, `entrance_fee`, `transport_info`, `travel_time`, `visit_duration`, `rating`, `district`, `image_url`, `secondary_image_url`, `best_time`, `contact`, `elevation_meters`, `mining_context`, `visiting_tips`, `is_active`, `created_at`, `updated_at`) VALUES
(36, 3, 'Udawalawe Forest Reserve & National Park', 'Sri Lanka’s premier open savannah national park, home to over 500 wild Asian elephants, leopards, and birdlife.', 'Spanning the southern frontier of Ratnapura District, Udawalawe National Park provides an East African savannah-like landscape centered on the massive Udawalawe reservoir. Renowned worldwide for its flourishing population of over 500 wild Asian elephants, safari-goers are virtually guaranteed to witness herds of elephants, water buffalo, spotted deer, wild boar, mugger crocodiles, and majestic birds of prey.', 'Ratnapura District, Sri Lanka', 6.4524000, 80.8984000, '• Open Daily • 6:00 AM – 6:00 PM', 'Wildlife Ticket: Foreign LKR 4,500 / Local LKR 250', NULL, NULL, NULL, 4.90, 'Ratnapura', 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80', 'Early Morning (6:00 AM – 9:30 AM) or Afternoon (3:30 PM – 6:00 PM)', '+94 47 223 3230 (Udawalawe Wildlife Park HQ)', 100, 'The southern dry-zone boundary of the Sabaragamuwa gemological province.', '[\"Book a 4x4 open safari jeep with an experienced wildlife tracker at the entrance\", \"The early morning (6:00 AM) or late afternoon (3:30 PM) safaris offer best animal sightings\", \"Bring binoculars, telephoto camera lenses, sunscreen, and wide-brim hats\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(37, 3, 'Udawalawe Elephant Transit Home (Ath Athuru Sevana)', 'Globally celebrated rehabilitation sanctuary rescuing orphaned baby elephants and releasing them into the wild.', 'Established in 1995 by the Department of Wildlife Conservation, the Elephant Transit Home (Ath Athuru Sevana) rescues, rehabilitates, and nurses orphaned baby elephants from all across Sri Lanka. Unlike commercial elephant centers, human contact is strictly minimized to ensure the calves maintain natural instincts before they are released in social herds back into Udawalawe National Park with satellite tracking collars.', 'Ratnapura District, Sri Lanka', 6.4412000, 80.8845000, '• Milk Feeding Sessions • 9:00 AM, 12:00 PM, 3:00 PM, 6:00 PM', 'Foreign: LKR 1,000 / Local: LKR 100', NULL, NULL, NULL, 4.90, 'Ratnapura', 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80', 'Milk Feeding Times (9:00 AM, 12:00 PM, 3:00 PM, or 6:00 PM)', '+94 47 223 3233 (Elephant Transit Home Office)', 95, 'Border zone of the Walawe basin where environmental conservation protects regional watersheds.', '[\"Watch dozens of baby elephants joyfully run out for warm milk from the viewing platform\", \"Feeding sessions take place strictly at 9:00 AM, 12:00 PM, 3:00 PM, and 6:00 PM (arrive 20 mins early)\", \"Educational visitor center provides insights into elephant biology and conservation challenges\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(38, 3, 'Udawalawe Irrigation Scheme & Dam', 'Monumental 4km earth dam and reservoir transforming dry southern lands into lush paddy and sugarcane basins.', 'The Udawalawe Reservoir Dam was constructed across the Walawe River in the late 1960s as a monumental engineering milestone of modern Sri Lanka. The 3.9 km earth-fill dam holds back a massive reservoir with a surface area of over 3,400 hectares, providing hydroelectric power and life-giving irrigation to over 30,000 hectares of downstream agricultural farmland in Ratnapura, Monaragala, and Hambantota districts.', 'Ratnapura District, Sri Lanka', 6.4289000, 80.8924000, '• Open 24 Hours • Daylight Viewing', 'Free Entry', NULL, NULL, NULL, 4.70, 'Ratnapura', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', 'Late Afternoon to Sunset (4:30 PM – 6:15 PM)', '+94 47 223 3210 (Mahaweli Authority Udawalawe)', 90, 'The Walawe river basin has served as a primary conduit for mineral and gem deposits since prehistoric times.', '[\"Drive or walk across the top of the massive dam road with views of the vast water expanse\", \"At sunset, the reflections of the mountains of Sabaragamuwa in the reservoir waters are sublime\", \"Fresh fruit stalls and local king-coconut vendors line the southern side of the causeway\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(39, 4, 'Sugarcane Research Institute (Uda Walawe)', 'National agricultural research center leading cane breeding, bio-energy, and sweet cane agronomy in Sri Lanka.', 'The Sugarcane Research Institute (SRI) located at Uda Walawe is the statutory national body dedicated to sugarcane cultivation, sugar manufacturing technology, and by-product utilization. The sprawling campus features experimental cane plantations, genetic germplasm banks with cane varieties from around the globe, and demonstration facilities showcasing brown jaggery and syrup processing.', 'Ratnapura District, Sri Lanka', 6.4189000, 80.8675000, '• Weekdays • 8:30 AM – 4:30 PM', 'Free Entry / Prior arrangement for tours', NULL, NULL, NULL, 4.50, 'Ratnapura', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80', 'Morning (9:00 AM – 12:00 PM)', '+94 47 223 3281 (Sugarcane Research Institute)', 85, 'Cultivated on deep alluvial river terrace deposits formed by ancient Walawe river courses.', '[\"Visit the demonstration fields showcasing towering commercial sugarcane cultivars\", \"Taste authentic fresh sugarcane juice and traditional jaggery (Hakkuru) from local cooperatives\", \"Educational visits can be arranged by contacting the extension division\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(40, 2, 'Embilipitiya Town & Cultural Hub', 'Dynamic urban hub of southern Ratnapura featuring modern shopping, vibrant markets, and parklands.', 'Embilipitiya is the largest urban center in the southern part of Ratnapura District. Originally developed as a planned modern settlement under the Mahaweli and Walawe development schemes, Embilipitiya is today a bustling commercial, cultural, and educational metropolis. It offers modern hotels, restaurants serving spicy southern Sabaragamuwa cuisine, and easy access to both Udawalawe National Park and regional heritage monuments.', 'Ratnapura District, Sri Lanka', 6.3458000, 80.8492000, '• Open 24 Hours • Commercial Town', 'Free Entry', NULL, NULL, NULL, 4.60, 'Ratnapura', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'Morning or Evening (8:00 AM – 8:00 PM)', '+94 47 226 1275 (Embilipitiya Urban Council)', 80, 'Major commercial trade center connecting Sabaragamuwa gem belts with Southern Province ports.', '[\"Ideal urban base with comfortable boutique hotels for travelers touring Udawalawe and Kolonne\", \"Enjoy authentic regional Sabaragamuwa meals including buffalo curd with kithul treacle\", \"Bustling weekend produce market showcases organic produce from Walawe farmers\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(41, 2, 'Walalgoda Viharaya', 'Peaceful rural temple near Panamura featuring historical stupa and tranquil bodhi tree courtyard.', 'Walalgoda Rajamaha Viharaya is situated in the serene countryside near Panamura in the Kolonne-Embilipitiya basin. Revered by local villagers for over two centuries, this picturesque temple preserves traditional Sabaragamuwa temple craftsmanship, stone water fonts, and an ancient preaching hall constructed with indigenous timber trusses.', 'Ratnapura District, Sri Lanka', 6.3812000, 80.7925000, '• Open Now • 6:00 AM – 6:30 PM', 'Free Entry', NULL, NULL, NULL, 4.50, 'Ratnapura', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'Morning (7:30 AM – 10:30 AM)', '+94 47 226 4100 (Walalgoda Temple Committee)', 110, 'Close to the historic Panamura elephant kraal and old mineral trading crossroads.', '[\"Stop by for peaceful meditation away from main tourist thoroughfares\", \"The resident chief monk warmly shares local oral histories with interested visitors\", \"Wear simple modest white temple clothing\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(42, 2, 'Madunwala Tampita Viharaya', 'Rare temple-on-pillars (Tampita Viharaya) built on raised stone stilts to protect Buddhist scriptures.', 'Madunwala Tampita Viharaya is an architectural masterpiece of traditional Sri Lankan building techniques. Built during the Kandyan era, the sanctum sanctorum is constructed entirely atop raised granite pillars (Tampita), a specialized style designed to protect sacred palm-leaf scriptures and clay statues from termites, moisture, and flooding. The inner sanctum features vibrant polychrome frescoes, wooden door lintels, and antique Buddha statues.', 'Ratnapura District, Sri Lanka', 6.4125000, 80.7289000, '• Open Now • 6:00 AM – 6:00 PM', 'Free Entry', NULL, NULL, NULL, 4.70, 'Ratnapura', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'Morning (8:00 AM – 11:30 AM)', '+94 45 226 8110 (Kolonne Heritage Society)', 130, 'Patronized by the historic Maduwanwela aristocratic family whose estates yielded prized gems.', '[\"Examine the elevated timber floor construction supported by massive stone pillars\", \"The painted wooden ceiling beams depict lotus rosettes and traditional floral motifs\", \"Combine your tour with the famous Madunwala Walawwa located just a short drive away\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(43, 2, 'Madunwala Walawwa (Maduwanwela Manor)', 'Legendary 17th-century feudal manor mansion featuring 21 inner courtyards and floor mosaics made of British coins.', 'Madunwala Walawwa (Maduwanwela Maha Walawwa) is one of the most remarkable and storied feudal ancestral mansions in Sri Lanka. Built in 1723 during the reign of King Sri Vira Parakrama Narendrasinha and expanded by the fiercely independent chieftain Maduwanwela Maha Disawa, the estate once boasted 21 inner courtyards (Meda Midula) and 84 rooms. The Disawa famously paved his floors with British sovereign coins and Victoria ceramic tiles so that anyone entering had to step on the emblems of the British Empire.', 'Ratnapura District, Sri Lanka', 6.4189000, 80.7245000, '• Open Daily • 8:30 AM – 5:00 PM', 'Local: LKR 50 / Foreign: LKR 500', NULL, NULL, NULL, 4.80, 'Ratnapura', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80', 'Morning (9:00 AM – 1:00 PM)', '+94 45 226 8200 (Department of Archaeology Kolonne)', 135, 'Seat of the powerful Disawa who commanded thousands of acres of gem-rich estates and elephant kraals.', '[\"Walk through the remaining 43 preserved rooms, courtyards, and ancient stone gateways\", \"Observe the famous ceramic mosaic floors embedded with genuine British coins and Victorian tiles\", \"Maintained under the care of the Department of Archaeology Sri Lanka\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55'),
(44, 2, 'Omalpe Tampita Viharaya', 'Exquisite temple on stone pillars in Omalpe village preserving pristine 18th-century Kandyan murals and woodcraft.', 'Omalpe Tampita Viharaya is a precious architectural jewel of the Sabaragamuwa rural landscape. Built during the Kandyan era on solid monolithic granite pillars, the elevated timber shrine room protects exquisite period wall paintings depicting the Suwisi Vivarana (twenty-four prognostications of past Buddhas), lotus-medallion ceilings, and ancient wooden statuary of supreme artistic delicacy.', 'Ratnapura District, Sri Lanka', 6.5189000, 80.6289000, '• Open Now • 6:00 AM – 6:30 PM', 'Free Entry', NULL, NULL, NULL, 4.60, 'Ratnapura', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'Morning (8:00 AM – 11:00 AM)', '+94 45 224 1500 (Omalpe Cultural Heritage Guild)', 170, 'Bordering the fertile gravel streams between Pelmadulla and Godakawela.', '[\"A true treasure for enthusiasts of traditional Asian architectural heritage\", \"Observe the hand-carved wooden balustrades and the clever mortise-and-tenon joints\", \"Please seek permission from the resident monk before photographing the inner murals\"]', 1, '2026-10-22 13:45:55', '2026-10-22 13:45:55');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `email` varchar(190) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('visitor','admin') NOT NULL DEFAULT 'visitor',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@email.com', '123', 'admin', '2026-10-22 16:10:54', '2026-10-22 16:10:54'),
(2, 'admin', 'admin@example.com', '$2a$12$B8cIRqa0h9RjQmBRG/w5K.KBHts2nXhy3eX6Jj9dWaEVuS63sYs5W', 'admin', '2026-10-22 16:51:57', '2026-10-22 16:52:13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_categories_name` (`name`);

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_favorite` (`user_id`,`tourist_place_id`);

--
-- Indexes for table `itineraries`
--
ALTER TABLE `itineraries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_itineraries_user` (`user_id`),
  ADD KEY `idx_itineraries_date` (`trip_date`);

--
-- Indexes for table `itinerary_places`
--
ALTER TABLE `itinerary_places`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_itinerary_place` (`itinerary_id`,`tourist_place_id`),
  ADD KEY `idx_itinerary` (`itinerary_id`),
  ADD KEY `idx_tourist_place` (`tourist_place_id`);

--
-- Indexes for table `place_reviews`
--
ALTER TABLE `place_reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_user_place_review` (`user_id`,`tourist_place_id`),
  ADD KEY `idx_place_reviews_place` (`tourist_place_id`);

--
-- Indexes for table `tourist_places`
--
ALTER TABLE `tourist_places`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tourist_places_category` (`category_id`),
  ADD KEY `idx_tourist_places_district` (`district`),
  ADD KEY `idx_tourist_places_active` (`is_active`),
  ADD KEY `idx_tourist_places_name` (`name`),
  ADD KEY `idx_tourist_places_coordinates` (`latitude`,`longitude`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_users_email` (`email`),
  ADD KEY `idx_users_role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `itineraries`
--
ALTER TABLE `itineraries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `itinerary_places`
--
ALTER TABLE `itinerary_places`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `place_reviews`
--
ALTER TABLE `place_reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tourist_places`
--
ALTER TABLE `tourist_places`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `itineraries`
--
ALTER TABLE `itineraries`
  ADD CONSTRAINT `fk_itineraries_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `itinerary_places`
--
ALTER TABLE `itinerary_places`
  ADD CONSTRAINT `fk_itinerary_places_itinerary` FOREIGN KEY (`itinerary_id`) REFERENCES `itineraries` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_itinerary_places_place` FOREIGN KEY (`tourist_place_id`) REFERENCES `tourist_places` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `place_reviews`
--
ALTER TABLE `place_reviews`
  ADD CONSTRAINT `fk_place_reviews_place` FOREIGN KEY (`tourist_place_id`) REFERENCES `tourist_places` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_place_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tourist_places`
--
ALTER TABLE `tourist_places`
  ADD CONSTRAINT `fk_tourist_places_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
