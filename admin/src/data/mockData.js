export const stats = {
  totalPackages: 24,
  totalDestinations: 18,
  totalInquiries: 342,
  totalCustomers: 1248,
  monthlyRevenue: 284500,
  conversionRate: 34.2,
  revenueGrowth: 12.4,
  inquiryGrowth: 8.7,
};

export const recentInquiries = [
  { id: "INQ-001", customer: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80", package: "European Grand Tour", date: "2025-06-08", status: "New", phone: "+91 98765 43210", email: "priya@email.com", travelDate: "2025-09-15", travellers: 2, budget: "$3,000–$5,000", message: "Looking for a honeymoon trip to Europe." },
  { id: "INQ-002", customer: "Rahul Mehta", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80", package: "Bali Bliss Retreat", date: "2025-06-07", status: "Contacted", phone: "+91 87654 32109", email: "rahul@email.com", travelDate: "2025-08-20", travellers: 4, budget: "$1,000–$2,000", message: "Family trip to Bali for 4 adults." },
  { id: "INQ-003", customer: "Ananya Patel", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80", package: "Japan Cherry Blossom", date: "2025-06-06", status: "Proposal Sent", phone: "+91 76543 21098", email: "ananya@email.com", travelDate: "2026-03-25", travellers: 2, budget: "$2,000–$3,500", message: "Japan during cherry blossom season." },
  { id: "INQ-004", customer: "Vikram Singh", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80", package: "Maldives Luxury Escape", date: "2025-06-05", status: "Confirmed", phone: "+91 65432 10987", email: "vikram@email.com", travelDate: "2025-07-10", travellers: 2, budget: "$5,000+", message: "Anniversary trip to Maldives." },
  { id: "INQ-005", customer: "Sneha Iyer", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80", package: "Morocco Desert & Medinas", date: "2025-06-04", status: "Closed", phone: "+91 54321 09876", email: "sneha@email.com", travelDate: "2025-10-01", travellers: 3, budget: "$1,000–$2,000", message: "Girls trip to Morocco." },
  { id: "INQ-006", customer: "Arjun Nair", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80", package: "Patagonia Adventure Trek", date: "2025-06-03", status: "New", phone: "+91 43210 98765", email: "arjun@email.com", travelDate: "2025-11-15", travellers: 5, budget: "$2,000–$3,500", message: "Adventure group trip to Patagonia." },
];

export const packages = [
  { id: 1, name: "European Grand Tour", slug: "european-grand-tour", destination: "Europe", duration: "14D/13N", price: 3299, status: "Active", featured: true, image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=300&q=80", category: "Cultural", rating: 4.9, bookings: 48 },
  { id: 2, name: "Bali Bliss Retreat", slug: "bali-bliss-retreat", destination: "Asia", duration: "8D/7N", price: 1299, status: "Active", featured: true, image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&q=80", category: "Wellness", rating: 4.8, bookings: 62 },
  { id: 3, name: "Japan Cherry Blossom Trail", slug: "japan-cherry-blossom", destination: "Asia", duration: "10D/9N", price: 2499, status: "Active", featured: false, image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&q=80", category: "Cultural", rating: 4.9, bookings: 35 },
  { id: 4, name: "Maldives Luxury Escape", slug: "maldives-luxury-escape", destination: "Islands", duration: "6D/5N", price: 3499, status: "Active", featured: true, image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=300&q=80", category: "Luxury", rating: 5.0, bookings: 29 },
  { id: 5, name: "Patagonia Adventure Trek", slug: "patagonia-adventure-trek", destination: "Americas", duration: "12D/11N", price: 2899, status: "Draft", featured: false, image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=300&q=80", category: "Adventure", rating: 4.7, bookings: 18 },
  { id: 6, name: "Morocco Desert & Medinas", slug: "morocco-desert-medinas", destination: "Africa", duration: "9D/8N", price: 1599, status: "Active", featured: false, image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=300&q=80", category: "Cultural", rating: 4.8, bookings: 41 },
  { id: 7, name: "Santorini Sunset Escape", slug: "santorini-sunset", destination: "Europe", duration: "7D/6N", price: 2199, status: "Active", featured: false, image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=300&q=80", category: "Luxury", rating: 4.8, bookings: 33 },
  { id: 8, name: "Peru Inca Discovery", slug: "peru-inca-discovery", destination: "Americas", duration: "11D/10N", price: 2799, status: "Draft", featured: false, image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=300&q=80", category: "Adventure", rating: 4.6, bookings: 12 },
];

export const destinations = [
  { id: 1, name: "Santorini", country: "Greece", region: "Europe", image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&q=80", packages: 3, featured: true, description: "Iconic white-washed cliffs and volcanic beaches." },
  { id: 2, name: "Bali", country: "Indonesia", region: "Asia", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", packages: 4, featured: true, description: "Lush rice terraces and ancient temples." },
  { id: 3, name: "Kyoto", country: "Japan", region: "Asia", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80", packages: 2, featured: true, description: "Timeless temples and cherry blossoms." },
  { id: 4, name: "Maldives", country: "Maldives", region: "Islands", image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80", packages: 2, featured: true, description: "Crystal lagoons and overwater villas." },
  { id: 5, name: "Machu Picchu", country: "Peru", region: "Americas", image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&q=80", packages: 2, featured: false, description: "Lost city of the Incas in the Andes." },
  { id: 6, name: "Marrakech", country: "Morocco", region: "Africa", image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80", packages: 2, featured: false, description: "Vibrant souks and desert adventures." },
  { id: 7, name: "Amalfi Coast", country: "Italy", region: "Europe", image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80", packages: 3, featured: true, description: "Dramatic clifftop villages and turquoise waters." },
  { id: 8, name: "Paris", country: "France", region: "Europe", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80", packages: 2, featured: false, description: "City of lights and Michelin dining." },
];

export const customers = [
  { id: 1, name: "Priya Sharma", email: "priya@email.com", phone: "+91 98765 43210", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80", inquiries: 3, lastActivity: "2025-06-08", status: "Active", totalSpent: 6598 },
  { id: 2, name: "Rahul Mehta", email: "rahul@email.com", phone: "+91 87654 32109", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80", inquiries: 1, lastActivity: "2025-06-07", status: "Active", totalSpent: 1299 },
  { id: 3, name: "Ananya Patel", email: "ananya@email.com", phone: "+91 76543 21098", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80", inquiries: 2, lastActivity: "2025-06-06", status: "Active", totalSpent: 4998 },
  { id: 4, name: "Vikram Singh", email: "vikram@email.com", phone: "+91 65432 10987", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80", inquiries: 4, lastActivity: "2025-06-05", status: "VIP", totalSpent: 13996 },
  { id: 5, name: "Sneha Iyer", email: "sneha@email.com", phone: "+91 54321 09876", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80", inquiries: 1, lastActivity: "2025-06-04", status: "Inactive", totalSpent: 1599 },
  { id: 6, name: "Arjun Nair", email: "arjun@email.com", phone: "+91 43210 98765", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80", inquiries: 2, lastActivity: "2025-06-03", status: "Active", totalSpent: 5798 },
];

export const testimonials = [
  { id: 1, name: "Sarah Mitchell", location: "New York, USA", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80", rating: 5, package: "European Grand Tour", review: "Boomerang made our European dream trip seamless. Every hotel was exceptional, the guides were incredibly knowledgeable.", status: "Approved", date: "2025-05-20" },
  { id: 2, name: "Rahul & Priya Sharma", location: "Mumbai, India", avatar: "https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=150&q=80", rating: 5, package: "Bali Bliss Retreat", review: "Our honeymoon in Bali was absolutely magical. The private villa, the curated experiences — everything was beyond expectations.", status: "Approved", date: "2025-05-18" },
  { id: 3, name: "James & Emma Chen", location: "Singapore", avatar: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&q=80", rating: 5, package: "Japan Cherry Blossom Trail", review: "Japan during cherry blossom season was on our bucket list for years. Boomerang made it happen flawlessly.", status: "Pending", date: "2025-06-01" },
  { id: 4, name: "Maria Gonzalez", location: "Madrid, Spain", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80", rating: 4, package: "Morocco Desert & Medinas", review: "An incredible cultural experience. The riad stay and Sahara camel trek were unforgettable highlights.", status: "Pending", date: "2025-06-05" },
];

export const blogs = [
  { id: 1, title: "10 Hidden Gems in Santorini You Must Visit", slug: "hidden-gems-santorini", category: "Europe", status: "Published", image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=300&q=80", date: "2025-05-25", views: 2840 },
  { id: 2, title: "The Ultimate Bali Travel Guide for 2025", slug: "bali-travel-guide-2025", category: "Asia", status: "Published", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&q=80", date: "2025-05-18", views: 4120 },
  { id: 3, title: "Japan Cherry Blossom Season: When and Where", slug: "japan-cherry-blossom-guide", category: "Asia", status: "Draft", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&q=80", date: "2025-06-01", views: 0 },
  { id: 4, title: "Top Luxury Overwater Villas in the Maldives", slug: "maldives-overwater-villas", category: "Islands", status: "Published", image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=300&q=80", date: "2025-04-10", views: 5680 },
];

export const mediaItems = [
  { id: 1, url: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80", name: "europe-paris.jpg", size: "1.2 MB", type: "image" },
  { id: 2, url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", name: "bali-rice-terrace.jpg", size: "980 KB", type: "image" },
  { id: 3, url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80", name: "kyoto-temple.jpg", size: "1.4 MB", type: "image" },
  { id: 4, url: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80", name: "maldives-villa.jpg", size: "2.1 MB", type: "image" },
  { id: 5, url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80", name: "patagonia-mountains.jpg", size: "1.8 MB", type: "image" },
  { id: 6, url: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=80", name: "morocco-desert.jpg", size: "1.1 MB", type: "image" },
  { id: 7, url: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=600&q=80", name: "santorini-sunset.jpg", size: "1.6 MB", type: "image" },
  { id: 8, url: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&q=80", name: "amalfi-coast.jpg", size: "1.3 MB", type: "image" },
  { id: 9, url: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&q=80", name: "machu-picchu.jpg", size: "2.0 MB", type: "image" },
];

export const revenueData = [
  { month: "Jan", revenue: 142000, inquiries: 48 },
  { month: "Feb", revenue: 168000, inquiries: 56 },
  { month: "Mar", revenue: 195000, inquiries: 71 },
  { month: "Apr", revenue: 221000, inquiries: 83 },
  { month: "May", revenue: 258000, inquiries: 94 },
  { month: "Jun", revenue: 284500, inquiries: 102 },
];
