export type Vendor = {
  name: string
  location: string
  rating: number
  reviews: number
  image: string
  category: string
}

export const heroVendors: Vendor[] = [
  {
    name: "Flashpoint Studio",
    location: "Kuala Lumpur",
    rating: 4.9,
    reviews: 214,
    image: "/vendor_profile_photography.jpg",
    category: "Photo & Video",
  },
  {
    name: "Vasanta Hall",
    location: "KLCC, Kuala Lumpur",
    rating: 4.6,
    reviews: 58,
    image: "/vendor_profile_venues.jpg",
    category: "Venue",
  },
  {
    name: "Arabelle Bridal",
    location: "Shah Alam, Selangor",
    rating: 5.0,
    reviews: 142,
    image: "/vendor_profile_attire.jpg",
    category: "Bridal",
  },
  {
    name: "Kanan Kitchen",
    location: "Petaling Jaya",
    rating: 4.8,
    reviews: 97,
    image: "/vendor_profile_food.jpg",
    category: "Catering",
  },
]

export const featuredVendors: (Vendor & { description: string })[] = [
  {
    name: "Seating Planner Pro",
    location: "Kota Kinabalu",
    rating: 5.0,
    reviews: 3,
    image: "/vendors/guestManagement/guest2.jpg",
    category: "Coordination",
    description:
      "Day-of coordinators who own the run sheet so you don't have to. From guest seating charts to vendor timing, they keep the whole floor moving on schedule.",
  },
  {
    name: "Grand Oak Ballroom",
    location: "Ipoh, Subang Jaya",
    rating: 5.0,
    reviews: 3,
    image: "/vendors/venues/venues3.png",
    category: "Venue",
    description:
      "A light-filled glass conservatory seating up to 400 guests, with in-house AV, flexible floor plans, and a dedicated events team for weddings and galas.",
  },
  {
    name: "Capture The Moment",
    location: "Johor Bahru, Shah Alam, Malacca City",
    rating: 5.0,
    reviews: 2,
    image: "/vendors/photography/photography3.jpg",
    category: "Photo & Video",
    description:
      "A multi-city photography collective specialising in candid event coverage. Same-day previews, full-resolution galleries, and optional cinematic highlight films.",
  },
]

export const categories = [
  "Photographers",
  "Venues",
  "Caterers",
  "Bridal",
  "Florists",
  "Entertainment",
  "Decor",
  "Coordination",
]