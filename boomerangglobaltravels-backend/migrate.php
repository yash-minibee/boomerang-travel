<?php

declare(strict_types=1);

require_once __DIR__ . '/config/Env.php';
Env::load(__DIR__ . '/.env');

require_once __DIR__ . '/config/Database.php';

$db = Database::getInstance();

// ── Create tables ───────────────────────────────────────────────────────────
$schema = file_get_contents(__DIR__ . '/migrations/schema.sql');
$db->exec($schema);
echo "Tables created.\n";

// Add destination_id to packages table if it does not exist (for existing DBs)
try {
    $db->query("SELECT destination_id FROM packages LIMIT 1");
} catch (PDOException $e) {
    try {
        $db->exec("ALTER TABLE packages ADD COLUMN destination_id INTEGER REFERENCES destinations(id)");
        echo "Added destination_id column to packages table.\n";
    } catch (PDOException $ex) {
        echo "Could not alter packages table: " . $ex->getMessage() . "\n";
    }
}

// Safely drop legacy destination_region column
try {
    $db->query("SELECT destination_region FROM packages LIMIT 1");
    // If it did not throw, column exists. Try to drop it.
    $db->exec("ALTER TABLE packages DROP COLUMN destination_region");
    echo "Dropped legacy destination_region column from packages table.\n";
} catch (PDOException $e) {
    // If it threw "no such column", it is already dropped. Otherwise, DROP COLUMN is unsupported.
}

// Add customer_country to inquiries table if it does not exist (for existing DBs)
try {
    $db->query("SELECT customer_country FROM inquiries LIMIT 1");
} catch (PDOException $e) {
    try {
        $db->exec("ALTER TABLE inquiries ADD COLUMN customer_country TEXT");
        echo "Added customer_country column to inquiries table.\n";
    } catch (PDOException $ex) {
        echo "Could not alter inquiries table: " . $ex->getMessage() . "\n";
    }
}

// Add children to inquiries table if it does not exist (for existing DBs)
try {
    $db->query("SELECT children FROM inquiries LIMIT 1");
} catch (PDOException $e) {
    try {
        $db->exec("ALTER TABLE inquiries ADD COLUMN children INTEGER DEFAULT 0");
        echo "Added children column to inquiries table.\n";
    } catch (PDOException $ex) {
        echo "Could not alter inquiries table: " . $ex->getMessage() . "\n";
    }
}

// ── Seed: Admin User ────────────────────────────────────────────────────────
$stmt = $db->prepare('SELECT id FROM admin_users WHERE email = ?');
$stmt->execute(['admin@boomerang.com']);
if (!$stmt->fetch()) {
    $db->prepare(
        'INSERT INTO admin_users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
    )->execute(['Aryan Kapoor', 'admin@boomerang.com', password_hash('admin123', PASSWORD_BCRYPT), 'super_admin']);
    echo "Admin user seeded.\n";
}

// ── Seed: Destinations ──────────────────────────────────────────────────────
$destinations = [
    [
        'name'        => 'Santorini',
        'country'     => 'Greece',
        'region'      => 'Europe',
        'description' => 'Iconic white-washed cliffs, volcanic beaches and breathtaking sunsets.',
        'featured'    => 1,
        'hero_image'  => 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80',
        'gallery'     => json_encode([
            "https://images.unsplash.com/photo-1469796466635-455edd0287ab?w=800&q=80",
            "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
            "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80"
        ])
    ],
    [
        'name'        => 'Bali',
        'country'     => 'Indonesia',
        'region'      => 'Asia',
        'description' => 'Lush rice terraces, ancient temples and world-class surf.',
        'featured'    => 1,
        'hero_image'  => 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80',
        'gallery'     => json_encode([
            "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80",
            "https://images.unsplash.com/photo-1518548419070-2c5999a3ed57?w=800&q=80",
            "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&q=80"
        ])
    ],
    [
        'name'        => 'Kyoto',
        'country'     => 'Japan',
        'region'      => 'Asia',
        'description' => 'Timeless temples, cherry blossoms and traditional tea ceremonies.',
        'featured'    => 1,
        'hero_image'  => 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80',
        'gallery'     => json_encode([
            "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80",
            "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&q=80",
            "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80"
        ])
    ],
    [
        'name'        => 'Maldives',
        'country'     => 'Maldives',
        'region'      => 'Islands',
        'description' => 'Overwater bungalows, crystal lagoons and vibrant coral reefs.',
        'featured'    => 1,
        'hero_image'  => 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80',
        'gallery'     => json_encode([
            "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80",
            "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
        ])
    ],
    [
        'name'        => 'Machu Picchu',
        'country'     => 'Peru',
        'region'      => 'Americas',
        'description' => 'Lost city of the Incas perched high in the Andes Mountains.',
        'featured'    => 0,
        'hero_image'  => 'https://images.unsplash.com/photo-1587595427660-e7482aa21840?w=1200&q=80',
        'gallery'     => json_encode([
            "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80",
            "https://images.unsplash.com/photo-1587595427660-e7482aa21840?w=800&q=80",
            "https://images.unsplash.com/photo-1509216242873-7786f446f465?w=800&q=80"
        ])
    ],
    [
        'name'        => 'Marrakech',
        'country'     => 'Morocco',
        'region'      => 'Africa',
        'description' => 'Vibrant souks, fragrant spice markets and Sahara desert adventures.',
        'featured'    => 0,
        'hero_image'  => 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1200&q=80',
        'gallery'     => json_encode([
            "https://images.unsplash.com/photo-1597212618440-806262de474b?w=800&q=80",
            "https://images.unsplash.com/photo-1489493887462-402b7264e919?w=800&q=80",
            "https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80"
        ])
    ],
    [
        'name'        => 'Amalfi Coast',
        'country'     => 'Italy',
        'region'      => 'Europe',
        'description' => 'Dramatic clifftop villages, turquoise waters and Italian cuisine.',
        'featured'    => 1,
        'hero_image'  => 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=1200&q=80',
        'gallery'     => json_encode([
            "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80",
            "https://images.unsplash.com/photo-1486848521219-2078a5996541?w=800&q=80",
            "https://images.unsplash.com/photo-1522083165195-342750297f46?w=800&q=80"
        ])
    ],
    [
        'name'        => 'Paris',
        'country'     => 'France',
        'region'      => 'Europe',
        'description' => 'City of lights, Michelin dining, art, fashion and the Eiffel Tower.',
        'featured'    => 0,
        'hero_image'  => 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80',
        'gallery'     => json_encode([
            "https://images.unsplash.com/photo-1499856871958-5b9647a6406a?w=800&q=80",
            "https://images.unsplash.com/photo-1508050919130-e11551779f1a?w=800&q=80",
            "https://images.unsplash.com/photo-1499856871958-5b9647a6406a?w=800&q=80"
        ])
    ],
];

$destCheck = $db->prepare('SELECT id FROM destinations WHERE name = ?');
$destIns   = $db->prepare(
    'INSERT INTO destinations (name, country, region, description, featured, hero_image, gallery) VALUES (?, ?, ?, ?, ?, ?, ?)'
);
$destNameMap = [];
foreach ($destinations as $d) {
    $destCheck->execute([$d['name']]);
    $row = $destCheck->fetch();
    if (!$row) {
        $destIns->execute([$d['name'], $d['country'], $d['region'], $d['description'], $d['featured'], $d['hero_image'], $d['gallery']]);
        $destId = (int)$db->lastInsertId();
    } else {
        $destId = (int)$row['id'];
        $db->prepare('UPDATE destinations SET hero_image = ?, gallery = ? WHERE id = ?')
           ->execute([$d['hero_image'], $d['gallery'], $destId]);
    }
    $destNameMap[$d['name']] = $destId;
}
echo "Destinations seeded.\n";

// ── Seed: Packages ──────────────────────────────────────────────────────────
$packages = [
    [
        'title'              => 'European Grand Tour',
        'slug'               => 'european-grand-tour',
        'category'           => 'Cultural',
        'destination_name'   => 'Paris',
        'duration'           => '14 Days / 13 Nights',
        'starting_price'     => 3299,
        'status'             => 'active',
        'featured'           => 1,
        'rating'             => 4.9,
        'review_count'       => 312,
        'tags'               => json_encode(['Best Seller', 'Cultural']),
        'highlights'         => json_encode(['Colosseum private tour', 'Gondola ride in Venice', 'Eiffel Tower dinner', 'Swiss Alps day trip']),
        'inclusions'         => json_encode(['13 nights luxury hotels', 'Daily breakfast', 'All high-speed train tickets', 'Private guided tours', 'Skip-the-line entry tickets']),
        'exclusions'         => json_encode(['International flights', 'Travel insurance', 'Personal expenses', 'Visa fees']),
        'policy_cancellation'=> 'Free cancellation up to 30 days before departure. 50% refund 15-29 days prior. No refund within 14 days.',
        'policy_refund'      => 'Refunds processed within 7-10 business days.',
        'policy_payment'     => '30% deposit at booking. Balance due 45 days before departure.',
        'meta_title'         => 'European Grand Tour | Boomerang Travel',
        'meta_description'   => 'Explore Rome, Venice, Paris, Amsterdam on a 14-day luxury European journey.',
        'cover_image'        => 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
        'gallery'            => json_encode([
            'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
            'https://images.unsplash.com/photo-1499856871958-5b9647a6406a?w=800&q=80'
        ]),
    ],
    [
        'title'              => 'Bali Bliss Retreat',
        'slug'               => 'bali-bliss-retreat',
        'category'           => 'Wellness',
        'destination_name'   => 'Bali',
        'duration'           => '8 Days / 7 Nights',
        'starting_price'     => 1299,
        'status'             => 'active',
        'featured'           => 1,
        'rating'             => 4.8,
        'review_count'       => 245,
        'tags'               => json_encode(['Popular', 'Wellness', 'Honeymoon Special']),
        'highlights'         => json_encode(['Private villa stay', 'Rice terrace trek', 'Temple hopping', 'Kecak fire dance']),
        'inclusions'         => json_encode(['7 nights villa accommodation', 'Daily breakfast', 'All private transfers', 'Cooking class', 'Nusa Penida day trip']),
        'exclusions'         => json_encode(['International flights', 'Travel insurance', 'Visa on arrival fees']),
        'policy_cancellation'=> 'Free cancellation up to 21 days before departure. 50% refund 10-20 days. No refund within 9 days.',
        'policy_refund'      => 'Refunds within 5-7 business days.',
        'policy_payment'     => '25% deposit at booking. Balance 30 days before departure.',
        'meta_title'         => 'Bali Bliss Retreat | Boomerang Travel',
        'meta_description'   => 'Luxury Bali escape with private villa, rice terraces, and Uluwatu sunsets.',
        'cover_image'        => 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
        'gallery'            => json_encode([
            'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
            'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80'
        ]),
    ],
    [
        'title'              => 'Japan Cherry Blossom Trail',
        'slug'               => 'japan-cherry-blossom',
        'category'           => 'Cultural',
        'destination_name'   => 'Kyoto',
        'duration'           => '10 Days / 9 Nights',
        'starting_price'     => 2499,
        'status'             => 'active',
        'featured'           => 0,
        'rating'             => 4.9,
        'review_count'       => 189,
        'tags'               => json_encode(['Seasonal', 'Cultural']),
        'highlights'         => json_encode(['Shibuya Crossing', 'Mt. Fuji views', 'Geisha district', 'Bullet train', 'Osaka street food']),
        'inclusions'         => json_encode(['9 nights hotels', 'JR Pass for bullet trains', 'Daily breakfast', 'All guided tours', 'Mt. Fuji day trip']),
        'exclusions'         => json_encode(['International flights', 'Travel insurance', 'Dinner & personal expenses']),
        'policy_cancellation'=> 'Free cancellation 30 days prior. 50% refund 15-29 days. No refund within 14 days.',
        'policy_refund'      => 'Refunds within 7-10 business days.',
        'policy_payment'     => '30% deposit. Balance 45 days before.',
        'meta_title'         => 'Japan Cherry Blossom Trail | Boomerang Travel',
        'meta_description'   => 'Experience Japan during cherry blossom season across Tokyo, Hakone, Kyoto and Osaka.',
        'cover_image'        => 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
        'gallery'            => json_encode([
            'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
            'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80'
        ]),
    ],
    [
        'title'              => 'Maldives Luxury Escape',
        'slug'               => 'maldives-luxury-escape',
        'category'           => 'Luxury',
        'destination_name'   => 'Maldives',
        'duration'           => '6 Days / 5 Nights',
        'starting_price'     => 3499,
        'status'             => 'active',
        'featured'           => 1,
        'rating'             => 5.0,
        'review_count'       => 97,
        'tags'               => json_encode(['Ultra Luxury', 'Honeymoon Special']),
        'highlights'         => json_encode(['Overwater villa', 'Private beach', 'Dolphin cruise', 'Whale shark snorkeling', 'Underwater dining']),
        'inclusions'         => json_encode(['5 nights overwater villa', 'All meals (Full Board)', 'Seaplane transfers', 'Snorkeling gear', 'Dolphin cruise', 'Spa credit']),
        'exclusions'         => json_encode(['International flights', 'Diving courses', 'Personal shopping']),
        'policy_cancellation'=> '50% refund 30+ days prior. No refund within 29 days.',
        'policy_refund'      => 'Refunds within 10 business days.',
        'policy_payment'     => '50% deposit. Balance 60 days before.',
        'meta_title'         => 'Maldives Luxury Escape | Boomerang Travel',
        'meta_description'   => 'Overwater villa stay, crystal lagoons and whale shark snorkeling in the Maldives.',
        'cover_image'        => 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
        'gallery'            => json_encode([
            'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
            'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80'
        ]),
    ],
    [
        'title'              => 'Patagonia Adventure Trek',
        'slug'               => 'patagonia-adventure-trek',
        'category'           => 'Adventure',
        'destination_name'   => 'Machu Picchu',
        'duration'           => '12 Days / 11 Nights',
        'starting_price'     => 2899,
        'status'             => 'active',
        'featured'           => 0,
        'rating'             => 4.7,
        'review_count'       => 142,
        'tags'               => json_encode(['Adventure', 'Trekking']),
        'highlights'         => json_encode(['Torres del Paine W Trek', 'Perito Moreno Glacier', 'End of the world train', 'Condor watching', 'Glacier boat cruise']),
        'inclusions'         => json_encode(['11 nights lodges & hotels', 'All park entry fees', 'Guided treks', 'Glacier cruise', 'Daily breakfast', 'Internal flights']),
        'exclusions'         => json_encode(['International flights to Buenos Aires', 'Personal gear', 'Travel insurance']),
        'policy_cancellation'=> 'Free cancellation 45 days prior. 30% refund 20-44 days. No refund within 19 days.',
        'policy_refund'      => 'Refunds within 10 business days.',
        'policy_payment'     => '35% deposit. Balance 60 days before.',
        'meta_title'         => 'Patagonia Adventure Trek | Boomerang Travel',
        'meta_description'   => 'Trek through Torres del Paine and witness Perito Moreno Glacier in epic Patagonia.',
        'cover_image'        => 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80',
        'gallery'            => json_encode([
            'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&q=80',
            'https://images.unsplash.com/photo-1587595427660-e7482aa21840?w=800&q=80'
        ]),
    ],
    [
        'title'              => 'Morocco Desert & Medinas',
        'slug'               => 'morocco-desert-medinas',
        'category'           => 'Cultural',
        'destination_name'   => 'Marrakech',
        'duration'           => '9 Days / 8 Nights',
        'starting_price'     => 1599,
        'status'             => 'active',
        'featured'           => 0,
        'rating'             => 4.8,
        'review_count'       => 203,
        'tags'               => json_encode(['Cultural', 'Adventure']),
        'highlights'         => json_encode(['Sahara camel trek', 'Fes medina tour', 'Riad stay', 'Djemaa el-Fna night market', 'Atlas Mountains']),
        'inclusions'         => json_encode(['8 nights riad & desert camp', 'Daily breakfast + 4 dinners', 'Private driver/guide', 'Camel trek', 'All transfers']),
        'exclusions'         => json_encode(['International flights', 'Lunch', 'Personal expenses']),
        'policy_cancellation'=> 'Free cancellation 21 days prior. 50% refund 10-20 days. No refund within 9 days.',
        'policy_refund'      => 'Refunds within 7 business days.',
        'policy_payment'     => '25% deposit. Balance 30 days before.',
        'meta_title'         => 'Morocco Desert & Medinas | Boomerang Travel',
        'meta_description'   => 'Discover Sahara dunes, ancient medinas and vibrant souks across Morocco.',
        'cover_image'        => 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80',
        'gallery'            => json_encode([
            'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80',
            'https://images.unsplash.com/photo-1597212618440-806262de474b?w=800&q=80'
        ]),
    ],
];

$pkgStmt = $db->prepare('SELECT id FROM packages WHERE slug = ?');
$ins     = $db->prepare(
    'INSERT INTO packages (title, slug, category, destination_id, duration, starting_price, status, featured,
     rating, review_count, tags, highlights, inclusions, exclusions,
     policy_cancellation, policy_refund, policy_payment, meta_title, meta_description, gallery, cover_image)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

$pkgNameMap = [];
foreach ($packages as $p) {
    $pkgStmt->execute([$p['slug']]);
    $row = $pkgStmt->fetch();
    if (!$row) {
        $destId = $destNameMap[$p['destination_name']] ?? null;
        $ins->execute([
            $p['title'], $p['slug'], $p['category'], $destId, $p['duration'],
            $p['starting_price'], $p['status'], $p['featured'], $p['rating'], $p['review_count'],
            $p['tags'], $p['highlights'], $p['inclusions'], $p['exclusions'],
            $p['policy_cancellation'], $p['policy_refund'], $p['policy_payment'],
            $p['meta_title'], $p['meta_description'], $p['gallery'], $p['cover_image']
        ]);
        $pkgId = (int)$db->lastInsertId();
    } else {
        $pkgId = (int)$row['id'];
        $db->prepare('UPDATE packages SET cover_image = ?, gallery = ? WHERE id = ?')
           ->execute([$p['cover_image'], $p['gallery'], $pkgId]);
    }
    $pkgNameMap[$p['slug']] = $pkgId;
}
echo "Packages seeded.\n";

// ── Seed: Package Itinerary Days ──────────────────────────────────────────────
$packageItineraries = [
    [
        'package_slug' => 'european-grand-tour',
        'day_number'   => 1,
        'title'        => 'Welcome to Paris',
        'city'         => 'Paris, France',
        'description'  => 'Arrive in the city of lights. Transfer to your luxury hotel and enjoy a welcome dinner.',
        'hotel'        => 'Grand Hotel du Palais Royal',
        'meals'        => json_encode(['Dinner']),
        'transport'    => json_encode(['Private Transfer']),
    ],
    [
        'package_slug' => 'european-grand-tour',
        'day_number'   => 2,
        'title'        => 'Louvre Museum & Eiffel Tower',
        'city'         => 'Paris, France',
        'description'  => 'Enjoy a private guided tour of the Louvre, followed by dinner at the Eiffel Tower.',
        'hotel'        => 'Grand Hotel du Palais Royal',
        'meals'        => json_encode(['Breakfast', 'Dinner']),
        'transport'    => json_encode(['Private Car']),
    ],
    [
        'package_slug' => 'european-grand-tour',
        'day_number'   => 3,
        'title'        => 'Journey to Rome',
        'city'         => 'Rome, Italy',
        'description'  => 'Take the high-speed train to Rome. Check in to your hotel and explore the city center at night.',
        'hotel'        => 'Hotel Splendide Royal',
        'meals'        => json_encode(['Breakfast']),
        'transport'    => json_encode(['High-speed Train']),
    ],
    [
        'package_slug' => 'bali-bliss-retreat',
        'day_number'   => 1,
        'title'        => 'Arrival in Ubud',
        'city'         => 'Ubud, Bali',
        'description'  => 'Arrive in Bali. Private transfer to your luxury jungle villa. Settle in and enjoy a couples massage.',
        'hotel'        => 'Hanging Gardens of Bali',
        'meals'        => json_encode(['Dinner']),
        'transport'    => json_encode(['Private SUV']),
    ],
    [
        'package_slug' => 'bali-bliss-retreat',
        'day_number'   => 2,
        'title'        => 'Sacred Monkey Forest & Rice Terraces',
        'city'         => 'Ubud, Bali',
        'description'  => 'Visit the Sacred Monkey Forest sanctuary and trek through Tegallalang Rice Terraces.',
        'hotel'        => 'Hanging Gardens of Bali',
        'meals'        => json_encode(['Breakfast', 'Lunch']),
        'transport'    => json_encode(['Private SUV']),
    ],
    [
        'package_slug' => 'bali-bliss-retreat',
        'day_number'   => 3,
        'title'        => 'Uluwatu Temple & Sunset Dinner',
        'city'         => 'Uluwatu, Bali',
        'description'  => 'Travel to Uluwatu Cliff Temple. Watch the Kecak fire dance and enjoy a seafood dinner on Jimbaran beach.',
        'hotel'        => 'The Edge Bali',
        'meals'        => json_encode(['Breakfast', 'Dinner']),
        'transport'    => json_encode(['Private SUV']),
    ],
    [
        'package_slug' => 'japan-cherry-blossom',
        'day_number'   => 1,
        'title'        => 'Welcome to Tokyo',
        'city'         => 'Tokyo, Japan',
        'description'  => 'Arrive at Tokyo Narita/Haneda airport. Private transfer to your luxury hotel.',
        'hotel'        => 'Aman Tokyo',
        'meals'        => json_encode(['Dinner']),
        'transport'    => json_encode(['Private Sedan']),
    ],
    [
        'package_slug' => 'japan-cherry-blossom',
        'day_number'   => 2,
        'title'        => 'Shibuya & Meiji Shrine',
        'city'         => 'Tokyo, Japan',
        'description'  => 'Explore Shibuya crossing, Harajuku, and the serene Meiji Jingu Shrine.',
        'hotel'        => 'Aman Tokyo',
        'meals'        => json_encode(['Breakfast', 'Lunch']),
        'transport'    => json_encode(['Subway/Walking Tour']),
    ],
    [
        'package_slug' => 'japan-cherry-blossom',
        'day_number'   => 3,
        'title'        => 'Bullet Train to Kyoto',
        'city'         => 'Kyoto, Japan',
        'description'  => 'Board the Shinkansen (bullet train) to Kyoto. Tour the Gion district and historic temples.',
        'hotel'        => 'The Ritz-Carlton Kyoto',
        'meals'        => json_encode(['Breakfast', 'Dinner']),
        'transport'    => json_encode(['Bullet Train (Shinkansen)']),
    ],
    [
        'package_slug' => 'maldives-luxury-escape',
        'day_number'   => 1,
        'title'        => 'Seaplane to Paradise',
        'city'         => 'Noonu Atoll, Maldives',
        'description'  => 'Scenic seaplane transfer to your luxury overwater villa. Welcome cocktails and private beach dinner.',
        'hotel'        => 'Soneva Jani',
        'meals'        => json_encode(['Dinner']),
        'transport'    => json_encode(['Seaplane']),
    ],
    [
        'package_slug' => 'maldives-luxury-escape',
        'day_number'   => 2,
        'title'        => 'Snorkeling with Whale Sharks',
        'city'         => 'South Ari Atoll, Maldives',
        'description'  => 'Embark on a private yacht excursion to swim with whale sharks and manta rays.',
        'hotel'        => 'Soneva Jani',
        'meals'        => json_encode(['Breakfast', 'Lunch', 'Dinner']),
        'transport'    => json_encode(['Luxury Yacht']),
    ],
    [
        'package_slug' => 'maldives-luxury-escape',
        'day_number'   => 3,
        'title'        => 'Spa Treatment & Sunset Cruise',
        'city'         => 'Noonu Atoll, Maldives',
        'description'  => 'Indulge in an overwater spa treatment, followed by a private sunset dolphin cruise.',
        'hotel'        => 'Soneva Jani',
        'meals'        => json_encode(['Breakfast', 'Lunch', 'Dinner']),
        'transport'    => json_encode(['Luxury Dhoni Boat']),
    ],
    [
        'package_slug' => 'patagonia-adventure-trek',
        'day_number'   => 1,
        'title'        => 'Arrive in El Calafate',
        'city'         => 'El Calafate, Argentina',
        'description'  => 'Arrive in Argentine Patagonia. Settle in at your luxury lake lodge and enjoy local cuisine.',
        'hotel'        => 'EOLO Patagonia\'s Spirit',
        'meals'        => json_encode(['Dinner']),
        'transport'    => json_encode(['Private Transfer']),
    ],
    [
        'package_slug' => 'patagonia-adventure-trek',
        'day_number'   => 2,
        'title'        => 'Perito Moreno Glacier Trek',
        'city'         => 'Perito Moreno, Argentina',
        'description'  => 'Crampon trek across the massive Perito Moreno Glacier with expert guides.',
        'hotel'        => 'EOLO Patagonia\'s Spirit',
        'meals'        => json_encode(['Breakfast', 'Lunch']),
        'transport'    => json_encode(['Private SUV']),
    ],
    [
        'package_slug' => 'patagonia-adventure-trek',
        'day_number'   => 3,
        'title'        => 'Scenic Drive to El Chalten',
        'city'         => 'El Chalten, Argentina',
        'description'  => 'Drive to the trekking capital of Argentina, catching breathtaking views of Mt. Fitz Roy.',
        'hotel'        => 'Destino Sur Hotel',
        'meals'        => json_encode(['Breakfast', 'Dinner']),
        'transport'    => json_encode(['Private SUV']),
    ],
    [
        'package_slug' => 'morocco-desert-medinas',
        'day_number'   => 1,
        'title'        => 'Magical Marrakech',
        'city'         => 'Marrakech, Morocco',
        'description'  => 'Settle into your boutique riad in the heart of the Medina. Evening tour of Djemaa el-Fna square.',
        'hotel'        => 'La Mamounia',
        'meals'        => json_encode(['Dinner']),
        'transport'    => json_encode(['Private Car']),
    ],
    [
        'package_slug' => 'morocco-desert-medinas',
        'day_number'   => 2,
        'title'        => 'Jardin Majorelle & Bahia Palace',
        'city'         => 'Marrakech, Morocco',
        'description'  => 'Explore the vibrant blue gardens of Jardin Majorelle and the intricate architecture of Bahia Palace.',
        'hotel'        => 'La Mamounia',
        'meals'        => json_encode(['Breakfast', 'Lunch']),
        'transport'    => json_encode(['Private Car']),
    ],
    [
        'package_slug' => 'morocco-desert-medinas',
        'day_number'   => 3,
        'title'        => 'Sahara Desert Gateway',
        'city'         => 'Ouarzazate, Morocco',
        'description'  => 'Cross the High Atlas Mountains via Tizi n\'Tichka pass to the gateway of the Sahara.',
        'hotel'        => 'Le Berbere Palace',
        'meals'        => json_encode(['Breakfast', 'Dinner']),
        'transport'    => json_encode(['4x4 Vehicle']),
    ],
];

$pkgItinCheck = $db->prepare('SELECT id FROM itinerary_days WHERE package_id = ? AND day_number = ?');
$pkgItinIns   = $db->prepare(
    'INSERT INTO itinerary_days (package_id, day_number, title, city, description, hotel, meals, transport)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
);

foreach ($packageItineraries as $it) {
    $pkgId = $pkgNameMap[$it['package_slug']] ?? null;
    if ($pkgId) {
        $pkgItinCheck->execute([$pkgId, $it['day_number']]);
        if (!$pkgItinCheck->fetch()) {
            $pkgItinIns->execute([
                $pkgId,
                $it['day_number'],
                $it['title'],
                $it['city'],
                $it['description'],
                $it['hotel'],
                $it['meals'],
                $it['transport']
            ]);
        }
    }
}
echo "Package Itineraries seeded.\n";

// ── Seed: Package Hotels ────────────────────────────────────────────────────
$packageHotels = [
    [
        'package_slug' => 'european-grand-tour',
        'name'         => 'Grand Hotel du Palais Royal',
        'city'         => 'Paris',
        'star_rating'  => 5,
        'image_url'    => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        'amenities'    => json_encode(['Free Wi-Fi', 'Spa & Wellness', 'Michelin Restaurant', '24-hour Room Service']),
    ],
    [
        'package_slug' => 'bali-bliss-retreat',
        'name'         => 'Hanging Gardens of Bali',
        'city'         => 'Ubud',
        'star_rating'  => 5,
        'image_url'    => 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80',
        'amenities'    => json_encode(['Twin-tiered Infinity Pool', 'Luxury Spa', 'Free Shuttle to Town Center', 'Poolside Bar']),
    ],
    [
        'package_slug' => 'japan-cherry-blossom',
        'name'         => 'Aman Tokyo',
        'city'         => 'Tokyo',
        'star_rating'  => 5,
        'image_url'    => 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80',
        'amenities'    => json_encode(['30m Heated Indoor Pool', 'World-Class Spa', 'Skyline Panorama Restaurant', 'Japanese Soaking Tubs']),
    ],
    [
        'package_slug' => 'maldives-luxury-escape',
        'name'         => 'Soneva Jani',
        'city'         => 'Noonu Atoll',
        'star_rating'  => 5,
        'image_url'    => 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&q=80',
        'amenities'    => json_encode(['Overwater Luxury Villas', 'Private Water Slides', 'Personal 24/7 Butler Service', 'Retractable Villa Roofs']),
    ],
    [
        'package_slug' => 'patagonia-adventure-trek',
        'name'         => 'EOLO Patagonia\'s Spirit',
        'city'         => 'El Calafate',
        'star_rating'  => 5,
        'image_url'    => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
        'amenities'    => json_encode(['Panoramic Lake Views', 'Guided Excursions Included', 'Indoor Heated Pool', 'Wine Tasting Cellar']),
    ],
    [
        'package_slug' => 'morocco-desert-medinas',
        'name'         => 'La Mamounia',
        'city'         => 'Marrakech',
        'star_rating'  => 5,
        'image_url'    => 'https://images.unsplash.com/photo-1597212618440-806262de474b?w=800&q=80',
        'amenities'    => json_encode(['8-Hectare Royal Gardens', 'Traditional Hammam & Spa', 'Indoor & Outdoor Pools', 'Four Signature Restaurants']),
    ],
];

$pkgHotelCheck = $db->prepare('SELECT id FROM package_hotels WHERE package_id = ? AND name = ?');
$pkgHotelIns   = $db->prepare(
    'INSERT INTO package_hotels (package_id, name, city, star_rating, image_url, amenities)
     VALUES (?, ?, ?, ?, ?, ?)'
);

foreach ($packageHotels as $h) {
    $pkgId = $pkgNameMap[$h['package_slug']] ?? null;
    if ($pkgId) {
        $pkgHotelCheck->execute([$pkgId, $h['name']]);
        if (!$pkgHotelCheck->fetch()) {
            $pkgHotelIns->execute([
                $pkgId,
                $h['name'],
                $h['city'],
                $h['star_rating'],
                $h['image_url'],
                $h['amenities']
            ]);
        }
    }
}
echo "Package Hotels seeded.\n";


// ── Seed: Cruise Destinations ───────────────────────────────────────────────
$cruiseDestinations = [
    ['Mediterranean Cruise', 'Greece & Italy', 'Europe',   'Cruise along the historic ports of the Mediterranean, from Santorini to Rome.', 1],
    ['Caribbean Cruise',     'Bahamas & Mexico', 'Americas', 'Sail through turquoise waters, tropical ports, and private island paradises.',   1],
    ['Alaskan Glaciers',     'United States',    'Americas', 'Witness majestic fjords, tidewater glaciers, and wild coastal frontiers.',      1],
];

$cDestCheck = $db->prepare('SELECT id FROM cruise_destinations WHERE name = ?');
$cDestIns   = $db->prepare(
    'INSERT INTO cruise_destinations (name, country, region, description, featured) VALUES (?, ?, ?, ?, ?)'
);
$cDestNameMap = [];
foreach ($cruiseDestinations as [$name, $country, $region, $desc, $featured]) {
    $cDestCheck->execute([$name]);
    $row = $cDestCheck->fetch();
    if (!$row) {
        $cDestIns->execute([$name, $country, $region, $desc, $featured]);
        $cDestNameMap[$name] = (int)$db->lastInsertId();
    } else {
        $cDestNameMap[$name] = (int)$row['id'];
    }
}
echo "Cruise Destinations seeded.\n";

// ── Seed: Cruises ───────────────────────────────────────────────────────────
$cruises = [
    [
        'title'              => 'Greek Isles & Adriatic Luxury Cruise',
        'slug'               => 'greek-isles-adriatic-cruise',
        'category'           => 'Luxury',
        'destination_name'   => 'Mediterranean Cruise',
        'duration'           => '10 Days / 9 Nights',
        'starting_price'     => 4299,
        'status'             => 'active',
        'featured'           => 1,
        'rating'             => 4.9,
        'review_count'       => 148,
        'tags'               => json_encode(['Bestseller', 'Romantic', 'Luxury']),
        'highlights'         => json_encode(['Sail from Venice canals', 'Santorini sunset caldera deck view', 'Dubrovnik Old Town walking tour', 'Gourmet dining by Michelin chefs']),
        'inclusions'         => json_encode(['9 Nights stateroom/suite accommodation', 'All gourmet dining on board', 'Premium beverages package', 'Private excursions in Venice & Dubrovnik', 'High-speed shipboard Wi-Fi', 'All port taxes & staff gratuities']),
        'exclusions'         => json_encode(['International flights to Venice', 'Pre-cruise hotel stays', 'Spa treatment services', 'Personal shopping']),
        'policy_cancellation'=> 'Free cancellation up to 45 days before sail date. 50% refund 30-44 days prior. No refund within 29 days.',
        'policy_refund'      => 'Refunds processed within 7-10 business days.',
        'policy_payment'     => '30% deposit to confirm booking. Balance payment due 60 days before sail date.',
        'meta_title'         => 'Greek Isles & Adriatic Luxury Cruise | Boomerang Travel',
        'meta_description'   => 'Experience the best of Greece, Croatia, and Italy on an ultra-luxury 10-day boutique cruise.',
    ],
    [
        'title'              => 'Caribbean Tropical Escape Cruise',
        'slug'               => 'caribbean-tropical-escape',
        'category'           => 'Family',
        'destination_name'   => 'Caribbean Cruise',
        'duration'           => '8 Days / 7 Nights',
        'starting_price'     => 1899,
        'status'             => 'active',
        'featured'           => 1,
        'rating'             => 4.8,
        'review_count'       => 94,
        'tags'               => json_encode(['Popular', 'Family Friendly']),
        'highlights'         => json_encode(['Cozy Bahamian beaches', 'St. Maarten snorkeling adventure', 'Private island beach BBQ', 'Broadway-style shipboard theater']),
        'inclusions'         => json_encode(['7 Nights oceanview stateroom', 'All dining room and buffet meals', 'Access to pools and fitness centers', 'Youth programs and theater shows', 'Port fees and taxes']),
        'exclusions'         => json_encode(['Flights to Miami', 'Specialty dining restaurants', 'Alcoholic beverages', 'Shore excursions']),
        'policy_cancellation'=> 'Free cancellation 30 days prior. 50% refund 15-29 days. No refund within 14 days.',
        'policy_refund'      => 'Refunds processed within 5-7 business days.',
        'policy_payment'     => '25% deposit at booking. Balance 45 days before sail date.',
        'meta_title'         => 'Caribbean Tropical Escape Cruise | Boomerang Travel',
        'meta_description'   => 'Unwind on a beautiful 8-day family-friendly Caribbean cruise from Miami to Cozumel and Nassau.',
    ]
];

$cruiseStmt = $db->prepare('SELECT id FROM cruises WHERE slug = ?');
$cruiseIns   = $db->prepare(
    'INSERT INTO cruises (title, slug, category, cruise_destination_id, duration, starting_price, status, featured,
     rating, review_count, tags, highlights, inclusions, exclusions,
     policy_cancellation, policy_refund, policy_payment, meta_title, meta_description, gallery)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

$cruiseIdsMap = [];
foreach ($cruises as $c) {
    $cruiseStmt->execute([$c['slug']]);
    $row = $cruiseStmt->fetch();
    if (!$row) {
        $destId = $cDestNameMap[$c['destination_name']] ?? null;
        $cruiseIns->execute([
            $c['title'], $c['slug'], $c['category'], $destId, $c['duration'],
            $c['starting_price'], $c['status'], $c['featured'], $c['rating'], $c['review_count'],
            $c['tags'], $c['highlights'], $c['inclusions'], $c['exclusions'],
            $c['policy_cancellation'], $c['policy_refund'], $c['policy_payment'],
            $c['meta_title'], $c['meta_description'], json_encode([]),
        ]);
        $cruiseIdsMap[$c['slug']] = (int)$db->lastInsertId();
    } else {
        $cruiseIdsMap[$c['slug']] = (int)$row['id'];
    }
}
echo "Cruises seeded.\n";

// ── Seed: Cruise Cabins ─────────────────────────────────────────────────────
$cabins = [
    [
        'cruise_slug'  => 'greek-isles-adriatic-cruise',
        'name'         => 'Oceanview Balcony Stateroom',
        'type'         => 'Balcony',
        'capacity'     => '2 Adults',
        'size'         => '260 sq ft',
        'star_rating'  => 5,
        'image_url'    => 'https://images.unsplash.com/photo-1548546738-8509cb246ed3?w=800&q=80',
        'amenities'    => json_encode(['Floor-to-ceiling balcony windows', 'King-size premium bed', 'En-suite marble bathroom', '24-hour cabin service']),
    ],
    [
        'cruise_slug'  => 'greek-isles-adriatic-cruise',
        'name'         => 'Royal Penthouse Suite',
        'type'         => 'Suite',
        'capacity'     => '4 Adults',
        'size'         => '680 sq ft',
        'star_rating'  => 5,
        'image_url'    => 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
        'amenities'    => json_encode(['Private jacuzzi deck', 'Butler service included', 'Walk-in wardrobe', 'Complimentary minibar restocked daily']),
    ],
    [
        'cruise_slug'  => 'caribbean-tropical-escape',
        'name'         => 'Deluxe Oceanview Cabin',
        'type'         => 'Oceanview',
        'capacity'     => '3 Adults',
        'size'         => '210 sq ft',
        'star_rating'  => 4,
        'image_url'    => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        'amenities'    => json_encode(['Large oceanview window', 'Twin/Queen convertible beds', 'Smart TV', 'Interactive tablet controls']),
    ]
];

$cabinCheck = $db->prepare('SELECT id FROM cruise_cabins WHERE cruise_id = ? AND name = ?');
$cabinIns   = $db->prepare(
    'INSERT INTO cruise_cabins (cruise_id, name, type, capacity, size, star_rating, image_url, amenities)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
);
foreach ($cabins as $cab) {
    $cruiseId = $cruiseIdsMap[$cab['cruise_slug']] ?? null;
    if ($cruiseId) {
        $cabinCheck->execute([$cruiseId, $cab['name']]);
        if (!$cabinCheck->fetch()) {
            $cabinIns->execute([
                $cruiseId,
                $cab['name'],
                $cab['type'],
                $cab['capacity'],
                $cab['size'],
                $cab['star_rating'],
                $cab['image_url'],
                $cab['amenities']
            ]);
        }
    }
}
echo "Cruise Cabins seeded.\n";

// ── Seed: Cruise Itinerary Days ──────────────────────────────────────────────
$itineraries = [
    // greek-isles-adriatic-cruise
    [
        'cruise_slug' => 'greek-isles-adriatic-cruise',
        'day_number'  => 1,
        'title'       => 'Embarkation in Venice',
        'city'        => 'Venice, Italy',
        'description' => 'Welcome on board our ultra-luxury cruise ship. Enjoy a welcome dinner as we sail out of Venice.',
        'meals'       => json_encode(['Dinner']),
        'transport'   => json_encode(['Cruise Ship']),
    ],
    [
        'cruise_slug' => 'greek-isles-adriatic-cruise',
        'day_number'  => 2,
        'title'       => 'Historic Split & Diocletian\'s Palace',
        'city'        => 'Split, Croatia',
        'description' => 'Explore the stunning coastal city of Split and its ancient Roman palace.',
        'meals'       => json_encode(['Breakfast', 'Lunch', 'Dinner']),
        'transport'   => json_encode(['Cruise Ship']),
    ],
    [
        'cruise_slug' => 'greek-isles-adriatic-cruise',
        'day_number'  => 3,
        'title'       => 'Breathtaking Bay of Kotor',
        'city'        => 'Kotor, Montenegro',
        'description' => 'Sail into the fjord-like Bay of Kotor and explore the medieval walled town.',
        'meals'       => json_encode(['Breakfast', 'Lunch', 'Dinner']),
        'transport'   => json_encode(['Cruise Ship', 'Tender Boat']),
    ],
    [
        'cruise_slug' => 'greek-isles-adriatic-cruise',
        'day_number'  => 4,
        'title'       => 'Corfu Emerald Island',
        'city'        => 'Corfu, Greece',
        'description' => 'Relax on beautiful sandy beaches and tour the old Town\'s Venetian fortresses.',
        'meals'       => json_encode(['Breakfast', 'Lunch', 'Dinner']),
        'transport'   => json_encode(['Cruise Ship']),
    ],
    [
        'cruise_slug' => 'greek-isles-adriatic-cruise',
        'day_number'  => 5,
        'title'       => 'Volcanic Cliffs & Caldera Views',
        'city'        => 'Santorini, Greece',
        'description' => 'Stroll through white-washed villages and watch the sunset over the caldera.',
        'meals'       => json_encode(['Breakfast', 'Lunch', 'Dinner']),
        'transport'   => json_encode(['Cruise Ship', 'Tender Boat']),
    ],
    [
        'cruise_slug' => 'greek-isles-adriatic-cruise',
        'day_number'  => 6,
        'title'       => 'Cradle of Western Civilization',
        'city'        => 'Athens, Greece',
        'description' => 'Visit the world-famous Acropolis and Parthenon.',
        'meals'       => json_encode(['Breakfast', 'Lunch', 'Dinner']),
        'transport'   => json_encode(['Cruise Ship']),
    ],
    [
        'cruise_slug' => 'greek-isles-adriatic-cruise',
        'day_number'  => 7,
        'title'       => 'Iconic Windmills & Beach Clubs',
        'city'        => 'Mykonos, Greece',
        'description' => 'Discover the cosmopolitan streets, boutique shops, and iconic windmills.',
        'meals'       => json_encode(['Breakfast', 'Lunch', 'Dinner']),
        'transport'   => json_encode(['Cruise Ship', 'Tender Boat']),
    ],
    [
        'cruise_slug' => 'greek-isles-adriatic-cruise',
        'day_number'  => 8,
        'title'       => 'Pearl of the Adriatic',
        'city'        => 'Dubrovnik, Croatia',
        'description' => 'Walk the spectacular city walls and explore the Game of Thrones locations.',
        'meals'       => json_encode(['Breakfast', 'Lunch', 'Dinner']),
        'transport'   => json_encode(['Cruise Ship']),
    ],
    [
        'cruise_slug' => 'greek-isles-adriatic-cruise',
        'day_number'  => 9,
        'title'       => 'Return to Venice',
        'city'        => 'Venice, Italy',
        'description' => 'Return to Venice and disembark with unforgettable memories.',
        'meals'       => json_encode(['Breakfast']),
        'transport'   => json_encode(['Cruise Ship']),
    ],

    // caribbean-tropical-escape
    [
        'cruise_slug' => 'caribbean-tropical-escape',
        'day_number'  => 1,
        'title'       => 'Departure from Miami',
        'city'        => 'Miami, USA',
        'description' => 'Welcome aboard! Settle into your stateroom as we depart from the Cruise Capital of the World.',
        'meals'       => json_encode(['Dinner']),
        'transport'   => json_encode(['Cruise Ship']),
    ],
    [
        'cruise_slug' => 'caribbean-tropical-escape',
        'day_number'  => 2,
        'title'       => 'Paradise Island Beaches',
        'city'        => 'Nassau, Bahamas',
        'description' => 'Enjoy snorkeling in turquoise waters or visit the famous Atlantis Resort.',
        'meals'       => json_encode(['Breakfast', 'Lunch', 'Dinner']),
        'transport'   => json_encode(['Cruise Ship']),
    ],
    [
        'cruise_slug' => 'caribbean-tropical-escape',
        'day_number'  => 3,
        'title'       => 'Fun Day at Sea',
        'city'        => 'At Sea',
        'description' => 'Relax by the pool, try the water slides, or watch a Broadway-style show.',
        'meals'       => json_encode(['Breakfast', 'Lunch', 'Dinner']),
        'transport'   => json_encode(['Cruise Ship']),
    ],
    [
        'cruise_slug' => 'caribbean-tropical-escape',
        'day_number'  => 4,
        'title'       => 'Mayan Ruins & Diving reefs',
        'city'        => 'Cozumel, Mexico',
        'description' => 'Discover ancient Mayan heritage or go diving at world-famous Palancar Reef.',
        'meals'       => json_encode(['Breakfast', 'Lunch', 'Dinner']),
        'transport'   => json_encode(['Cruise Ship']),
    ],
    [
        'cruise_slug' => 'caribbean-tropical-escape',
        'day_number'  => 5,
        'title'       => 'Rainforest Excursion',
        'city'        => 'Costa Maya, Mexico',
        'description' => 'Trek through lush jungles or swim in crystal lagoons.',
        'meals'       => json_encode(['Breakfast', 'Lunch', 'Dinner']),
        'transport'   => json_encode(['Cruise Ship']),
    ],
    [
        'cruise_slug' => 'caribbean-tropical-escape',
        'day_number'  => 6,
        'title'       => 'Roatan Coral Reefs',
        'city'        => 'Roatan, Honduras',
        'description' => 'Go zip-lining or relax on the white sands of West Bay Beach.',
        'meals'       => json_encode(['Breakfast', 'Lunch', 'Dinner']),
        'transport'   => json_encode(['Cruise Ship']),
    ],
    [
        'cruise_slug' => 'caribbean-tropical-escape',
        'day_number'  => 7,
        'title'       => 'Relaxation & Spa Day at Sea',
        'city'        => 'At Sea',
        'description' => 'Indulge in spa treatments and gourmet dining on board.',
        'meals'       => json_encode(['Breakfast', 'Lunch', 'Dinner']),
        'transport'   => json_encode(['Cruise Ship']),
    ],
    [
        'cruise_slug' => 'caribbean-tropical-escape',
        'day_number'  => 8,
        'title'       => 'Disembarkation in Miami',
        'city'        => 'Miami, USA',
        'description' => 'Return to Miami and disembark.',
        'meals'       => json_encode(['Breakfast']),
        'transport'   => json_encode(['Cruise Ship']),
    ],
];

$itinCheck = $db->prepare('SELECT id FROM cruise_itinerary_days WHERE cruise_id = ? AND day_number = ?');
$itinIns   = $db->prepare(
    'INSERT INTO cruise_itinerary_days (cruise_id, day_number, title, city, description, meals, transport)
     VALUES (?, ?, ?, ?, ?, ?, ?)'
);

foreach ($itineraries as $it) {
    $cruiseId = $cruiseIdsMap[$it['cruise_slug']] ?? null;
    if ($cruiseId) {
        $itinCheck->execute([$cruiseId, $it['day_number']]);
        if (!$itinCheck->fetch()) {
            $itinIns->execute([
                $cruiseId,
                $it['day_number'],
                $it['title'],
                $it['city'],
                $it['description'],
                $it['meals'],
                $it['transport']
            ]);
        }
    }
}
echo "Cruise Itineraries seeded.\n";

// ── Seed: Inquiries ─────────────────────────────────────────────────────────
$inquiries = [
    ['Priya Sharma',   'priya@email.com',   '+91 98765 43210', 'India', 'European Grand Tour',       '2025-09-15', 2, '4000', 'Looking for a honeymoon trip.',    'New'],
    ['Rahul Mehta',    'rahul@email.com',   '+91 87654 32109', 'India', 'Bali Bliss Retreat',        '2025-08-20', 4, '1500', 'Family trip to Bali.',              'Contacted'],
    ['Ananya Patel',   'ananya@email.com',  '+91 76543 21098', 'India', 'Japan Cherry Blossom Trail','2026-03-25', 2, '3000', 'Japan during cherry blossom.',     'Proposal Sent'],
    ['Vikram Singh',   'vikram@email.com',  '+91 65432 10987', 'USA',   'Maldives Luxury Escape',    '2025-07-10', 2, '6000', 'Anniversary trip to Maldives.',     'Confirmed'],
    ['Sneha Iyer',     'sneha@email.com',   '+91 54321 09876', 'India', 'Morocco Desert & Medinas',  '2025-10-01', 3, '1800', 'Girls trip to Morocco.',            'Closed'],
    ['Arjun Nair',     'arjun@email.com',   '+91 43210 98765', 'India', 'Patagonia Adventure Trek',  '2025-11-15', 5, '2800', 'Adventure group trip.',             'New'],
];

$inqCheck = $db->prepare('SELECT id FROM inquiries WHERE customer_email = ? AND package_name = ?');
$inqIns   = $db->prepare(
    'INSERT INTO inquiries (customer_name, customer_email, customer_phone, customer_country, package_name, travel_date, travellers, budget_range, message, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);
foreach ($inquiries as [$name, $email, $phone, $country, $pkg, $date, $travellers, $budget, $msg, $status]) {
    $inqCheck->execute([$email, $pkg]);
    if (!$inqCheck->fetch()) {
        $inqIns->execute([$name, $email, $phone, $country, $pkg, $date, $travellers, $budget, $msg, $status]);
        // Upsert customer
        $custCheck = $db->prepare('SELECT id FROM customers WHERE email = ?');
        $custCheck->execute([$email]);
        if (!$custCheck->fetch()) {
            $db->prepare('INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)')->execute([$name, $email, $phone]);
        }
    }
}
echo "Inquiries seeded.\n";

// ── Seed: Testimonials ──────────────────────────────────────────────────────
$testimonials = [
    ['Sarah Mitchell',      'New York, USA',  5, 'European Grand Tour',        'Boomerang made our European dream trip seamless. Every hotel was exceptional and the guides incredibly knowledgeable.',  'Approved'],
    ['Rahul & Priya Sharma','Mumbai, India',  5, 'Bali Bliss Retreat',         'Our honeymoon in Bali was absolutely magical. The private villa and curated experiences were beyond expectations.',      'Approved'],
    ['James & Emma Chen',   'Singapore',      5, 'Japan Cherry Blossom Trail', 'Japan during cherry blossom season was on our bucket list for years. Boomerang made it happen flawlessly.',             'Pending'],
    ['Maria Gonzalez',      'Madrid, Spain',  4, 'Morocco Desert & Medinas',   'An incredible cultural experience. The riad stay and Sahara camel trek were unforgettable highlights.',                  'Pending'],
];

$testCheck = $db->prepare('SELECT id FROM testimonials WHERE customer_name = ?');
$testIns   = $db->prepare(
    'INSERT INTO testimonials (customer_name, customer_location, rating, package_name, review_text, status) VALUES (?, ?, ?, ?, ?, ?)'
);
foreach ($testimonials as [$name, $location, $rating, $pkg, $review, $status]) {
    $testCheck->execute([$name]);
    if (!$testCheck->fetch()) {
        $testIns->execute([$name, $location, $rating, $pkg, $review, $status]);
    }
}
echo "Testimonials seeded.\n";

// ── Seed: Site Content ──────────────────────────────────────────────────────
$content = [
    ['home',    'hero_title_line1',    'The World Awaits'],
    ['home',    'hero_title_line2',    'Your Next Adventure'],
    ['home',    'hero_subtitle',       'Luxury curated travel packages to the world\'s most breathtaking destinations.'],
    ['home',    'hero_badge',          '✈️ Crafting Extraordinary Journeys Since 2010'],
    ['home',    'packages_title',      'Featured Packages'],
    ['home',    'packages_subtitle',   'Our most loved luxury travel packages, curated for the discerning explorer.'],
    ['home',    'newsletter_title',    'Travel Inspiration, Delivered'],
    ['home',    'home_continent_sections',  '[{"id":"sec-europe","continent":"Europe","title":"European Escapes","subtitle":"Indulge in iconic landmarks, clifftop vistas, and luxury cultural excursions across Europe.","badge":"Romance & History"},{"id":"sec-asia","continent":"Asia","title":"Asian Adventures","subtitle":"Immerse yourself in lush gardens, ancient temples, tropical retreats, and vibrant local cuisines.","badge":"Cultures & Paradises"}]'],
    ['about',   'about_title',         'About Boomerang Travel'],
    ['about',   'about_tagline',       'Born from a love of exploration. Built on a promise of excellence.'],
    ['about',   'about_story',         'Boomerang Global Travel was founded in 2010 with one simple belief: travel should feel like the best chapter of your life.'],
    ['about',   'years_experience',    '15+'],
    ['about',   'destinations_count',  '50+'],
    ['about',   'travelers_count',     '10K+'],
    ['contact', 'contact_title',       'Plan Your Dream Trip'],
    ['contact', 'contact_subtitle',    'Our travel experts will craft a personalized itinerary within 24 hours.'],
    ['contact', 'office_hours',        'Mon–Sat: 9AM–8PM IST. Sunday: 10AM–5PM IST'],
];

$contentStmt = $db->prepare(
    'INSERT INTO site_content (page, key, value) VALUES (?, ?, ?)
     ON CONFLICT(page, key) DO NOTHING'
);
foreach ($content as [$page, $key, $value]) {
    $contentStmt->execute([$page, $key, $value]);
}
echo "Site content seeded.\n";

// ── Seed: Settings ──────────────────────────────────────────────────────────
$settings = [
    ['company_name',    'Boomerang Global Travel'],
    ['phone',           '+91 98765 43210'],
    ['email',           'hello@boomerangtravel.com'],
    ['address',         'Level 12, Cyber Hub, DLF Phase 2, Gurugram — 122002'],
    ['whatsapp_number', '919876543210'],
];

$settingStmt = $db->prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO NOTHING'
);
foreach ($settings as [$key, $value]) {
    $settingStmt->execute([$key, $value]);
}
echo "Settings seeded.\n";

// ── Seed: Currency Rates ────────────────────────────────────────────────────
$rateCheck = $db->prepare('SELECT rate FROM currency_rates WHERE currency = ?');
$rateCheck->execute(['AUD']);
if (!$rateCheck->fetch()) {
    $db->prepare(
        'INSERT INTO currency_rates (currency, rate) VALUES (?, ?)'
    )->execute(['AUD', 1.50]);
    echo "Default AUD exchange rate seeded.\n";
}

// ── Seed: Global Hotels ──────────────────────────────────────────────────────
$globalHotels = [
    [
        'name'        => 'The Mulia Resort & Villa',
        'city'        => 'Bali',
        'star_rating' => 5,
        'image_url'   => 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
        'amenities'   => json_encode(['Pool', 'Spa', 'Gym', 'WiFi', 'Beach Access', 'Fine Dining'])
    ],
    [
        'name'        => 'Hotel de Russie',
        'city'        => 'Rome',
        'star_rating' => 5,
        'image_url'   => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        'amenities'   => json_encode(['Spa', 'Concierge', 'WiFi', 'Bar', 'Fine Dining'])
    ],
    [
        'name'        => 'Marina Bay Sands',
        'city'        => 'Singapore',
        'star_rating' => 5,
        'image_url'   => 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
        'amenities'   => json_encode(['Rooftop', 'Pool', 'WiFi', 'Concierge', 'Gym'])
    ],
    [
        'name'        => 'Amangiri Resort',
        'city'        => 'Canyon Point',
        'star_rating' => 5,
        'image_url'   => 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
        'amenities'   => json_encode(['Pool', 'Spa', 'Butler Service', 'WiFi', 'Fine Dining'])
    ],
    [
        'name'        => 'The Ritz-Carlton',
        'city'        => 'Tokyo',
        'star_rating' => 5,
        'image_url'   => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
        'amenities'   => json_encode(['Spa', 'Gym', 'WiFi', 'Bar', 'Fine Dining'])
    ]
];

$hotelCheck = $db->prepare('SELECT id FROM hotels WHERE name = ?');
$hotelInsert = $db->prepare(
    'INSERT INTO hotels (name, city, star_rating, image_url, amenities) VALUES (?, ?, ?, ?, ?)'
);
foreach ($globalHotels as $gh) {
    $hotelCheck->execute([$gh['name']]);
    if (!$hotelCheck->fetch()) {
        $hotelInsert->execute([
            $gh['name'],
            $gh['city'],
            $gh['star_rating'],
            $gh['image_url'],
            $gh['amenities']
        ]);
    }
}
echo "Global Hotels seeded.\n";

// ── Seed: Global Cabins ──────────────────────────────────────────────────────
$globalCabins = [
    [
        'name'        => "Owner's Balcony Suite",
        'type'        => 'Suite',
        'capacity'    => '2 guests',
        'size'        => '350 sq ft',
        'star_rating' => 5,
        'image_url'   => 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
        'amenities'   => json_encode(['Floor-to-ceiling balcony windows', 'King-size premium bed', 'En-suite marble bathroom', '24-hour cabin service'])
    ],
    [
        'name'        => 'Deluxe Oceanview Cabin',
        'type'        => 'Oceanview',
        'capacity'    => '2 guests',
        'size'        => '220 sq ft',
        'star_rating' => 4,
        'image_url'   => 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        'amenities'   => json_encode(['Panoramic ocean window', 'Queen-size bed', 'Sitting area', 'WiFi', 'Mini-bar'])
    ],
    [
        'name'        => 'Grand Penthouse Suite',
        'type'        => 'Suite',
        'capacity'    => '4 guests',
        'size'        => '600 sq ft',
        'star_rating' => 5,
        'image_url'   => 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80',
        'amenities'   => json_encode(['Private jacuzzi on balcony', 'Separate living area', 'Dining table', 'Personal butler service', 'Priority boarding'])
    ],
    [
        'name'        => 'Premium Balcony Stateroom',
        'type'        => 'Balcony',
        'capacity'    => '2 guests',
        'size'        => '280 sq ft',
        'star_rating' => 4,
        'image_url'   => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
        'amenities'   => json_encode(['Private veranda with loungers', 'Convertible twin/queen beds', 'Writing desk', 'Flat-screen TV'])
    ],
    [
        'name'        => 'Classic Inside Cabin',
        'type'        => 'Inside',
        'capacity'    => '2 guests',
        'size'        => '160 sq ft',
        'star_rating' => 3,
        'image_url'   => 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
        'amenities'   => json_encode(['Smart TV with virtual window view', 'Two twin beds', 'Compact desk', 'En-suite bathroom'])
    ]
];

$cabinCheck = $db->prepare('SELECT id FROM cabins WHERE name = ?');
$cabinInsert = $db->prepare(
    'INSERT INTO cabins (name, type, capacity, size, star_rating, image_url, amenities) VALUES (?, ?, ?, ?, ?, ?, ?)'
);
foreach ($globalCabins as $gc) {
    $cabinCheck->execute([$gc['name']]);
    if (!$cabinCheck->fetch()) {
        $cabinInsert->execute([
            $gc['name'],
            $gc['type'],
            $gc['capacity'],
            $gc['size'],
            $gc['star_rating'],
            $gc['image_url'],
            $gc['amenities']
        ]);
    }
}
echo "Global Cabins seeded.\n";

// Update legacy regions if any exist
$db->exec("UPDATE destinations SET region = 'Australia/Oceania/Pacific' WHERE region = 'Australia/Oceania'");
echo "Updated legacy destination regions.\n";

echo "\nMigration complete. Database is ready.\n";
echo "Admin login: admin@boomerang.com / admin123\n";
