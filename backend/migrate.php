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
    ['Santorini',    'Greece',    'Europe',   'Iconic white-washed cliffs, volcanic beaches and breathtaking sunsets.',    1],
    ['Bali',         'Indonesia', 'Asia',     'Lush rice terraces, ancient temples and world-class surf.',                 1],
    ['Kyoto',        'Japan',     'Asia',     'Timeless temples, cherry blossoms and traditional tea ceremonies.',         1],
    ['Maldives',     'Maldives',  'Islands',  'Overwater bungalows, crystal lagoons and vibrant coral reefs.',             1],
    ['Machu Picchu', 'Peru',      'Americas', 'Lost city of the Incas perched high in the Andes Mountains.',              0],
    ['Marrakech',    'Morocco',   'Africa',   'Vibrant souks, fragrant spice markets and Sahara desert adventures.',       0],
    ['Amalfi Coast', 'Italy',     'Europe',   'Dramatic clifftop villages, turquoise waters and Italian cuisine.',         1],
    ['Paris',        'France',    'Europe',   'City of lights, Michelin dining, art, fashion and the Eiffel Tower.',       0],
];

$destCheck = $db->prepare('SELECT id FROM destinations WHERE name = ?');
$destIns   = $db->prepare(
    'INSERT INTO destinations (name, country, region, description, featured) VALUES (?, ?, ?, ?, ?)'
);
$destNameMap = [];
foreach ($destinations as [$name, $country, $region, $desc, $featured]) {
    $destCheck->execute([$name]);
    $row = $destCheck->fetch();
    if (!$row) {
        $destIns->execute([$name, $country, $region, $desc, $featured]);
        $destNameMap[$name] = (int)$db->lastInsertId();
    } else {
        $destNameMap[$name] = (int)$row['id'];
    }
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
    ],
];

$pkgStmt = $db->prepare('SELECT id FROM packages WHERE slug = ?');
$ins     = $db->prepare(
    'INSERT INTO packages (title, slug, category, destination_id, duration, starting_price, status, featured,
     rating, review_count, tags, highlights, inclusions, exclusions,
     policy_cancellation, policy_refund, policy_payment, meta_title, meta_description, gallery)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

foreach ($packages as $p) {
    $pkgStmt->execute([$p['slug']]);
    if (!$pkgStmt->fetch()) {
        $destId = $destNameMap[$p['destination_name']] ?? null;
        $ins->execute([
            $p['title'], $p['slug'], $p['category'], $destId, $p['duration'],
            $p['starting_price'], $p['status'], $p['featured'], $p['rating'], $p['review_count'],
            $p['tags'], $p['highlights'], $p['inclusions'], $p['exclusions'],
            $p['policy_cancellation'], $p['policy_refund'], $p['policy_payment'],
            $p['meta_title'], $p['meta_description'], json_encode([]),
        ]);
    }
}
echo "Packages seeded.\n";

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

echo "\nMigration complete. Database is ready.\n";
echo "Admin login: admin@boomerang.com / admin123\n";
