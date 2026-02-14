import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

// Helper to generate Malaysian phone numbers
const getRandomPhone = () => {
  const prefixes = ['012', '013', '014', '016', '017', '018', '019']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const number = Math.floor(Math.random() * 9000000) + 1000000
  return `${prefix}-${number}`
}

// Helper to generate Malaysian locations
const getLocations = () => {
  const cities = ['Kuala Lumpur', 'Petaling Jaya', 'Subang Jaya', 'Shah Alam', 'George Town', 'Johor Bahru', 'Ipoh', 'Malacca City', 'Kota Kinabalu', 'Kuching', 'Cyberjaya', 'Putrajaya', 'Bangsar', 'Damansara']
  // Pick 1-3 random cities
  const num = Math.floor(Math.random() * 3) + 1
  const selected: string[] = []
  for (let i = 0; i < num; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)]
    if (!selected.includes(city)) selected.push(city)
  }
  return selected.join(', ')
}

// Helper to generate occasions
const getOccasions = (category: string) => {
  const base = ['Weddings', 'Corporate Events', 'Birthdays', 'Anniversaries']
  const extras = ['Graduations', 'Baby Showers', 'Product Launches', 'Galas', 'Festivals']
  
  // Mix base with some extras
  const result = [...base]
  // Add 1-3 extras
  const num = Math.floor(Math.random() * 3) + 1
  for (let i = 0; i < num; i++) {
    const extra = extras[Math.floor(Math.random() * extras.length)]
    if (!result.includes(extra)) result.push(extra)
  }
  return result.join(', ')
}

// Helper to get relevant image URLs per category
// const getImageUrl = (category: string, name: string) => {
//   const photos: Record<string, string[]> = {
//     'Venues': [
//       'https://source.unsplash.com/featured/1600x900/?wedding-venue',
//       'https://source.unsplash.com/featured/1600x900/?banquet-hall',
//       'https://source.unsplash.com/featured/1600x900/?ballroom',
//       'https://source.unsplash.com/featured/1600x900/?garden-venue',
//       'https://source.unsplash.com/featured/1600x900/?rooftop-venue',
//     ],
//     'Photography': [
//       'https://source.unsplash.com/featured/1600x900/?wedding-photography',
//       'https://source.unsplash.com/featured/1600x900/?portrait-photography',
//       'https://source.unsplash.com/featured/1600x900/?event-photography',
//       'https://source.unsplash.com/featured/1600x900/?camera',
//       'https://source.unsplash.com/featured/1600x900/?studio-photography',
//     ],
//     'Food Catering': [
//       'https://source.unsplash.com/featured/1600x900/?catering',
//       'https://source.unsplash.com/featured/1600x900/?buffet',
//       'https://source.unsplash.com/featured/1600x900/?wedding-catering',
//       'https://source.unsplash.com/featured/1600x900/?chef',
//       'https://source.unsplash.com/featured/1600x900/?banquet-food',
//     ],
//     'Decorations & Venue Setup': [
//       'https://source.unsplash.com/featured/1600x900/?wedding-decor',
//       'https://source.unsplash.com/featured/1600x900/?event-decor',
//       'https://source.unsplash.com/featured/1600x900/?floral-decor',
//       'https://source.unsplash.com/featured/1600x900/?lighting-decor',
//       'https://source.unsplash.com/featured/1600x900/?balloon-decor',
//     ],
//     'Entertainment': [
//       'https://source.unsplash.com/featured/1600x900/?live-band',
//       'https://source.unsplash.com/featured/1600x900/?dj',
//       'https://source.unsplash.com/featured/1600x900/?stage-performance',
//       'https://source.unsplash.com/featured/1600x900/?party-entertainment',
//       'https://source.unsplash.com/featured/1600x900/?concert',
//     ],
//     'Logistics': [
//       'https://source.unsplash.com/featured/1600x900/?event-logistics',
//       'https://source.unsplash.com/featured/1600x900/?transportation',
//       'https://source.unsplash.com/featured/1600x900/?equipment-setup',
//       'https://source.unsplash.com/featured/1600x900/?moving-truck',
//       'https://source.unsplash.com/featured/1600x900/?delivery',
//     ],
//     'Guest Management': [
//       'https://source.unsplash.com/featured/1600x900/?registration-desk',
//       'https://source.unsplash.com/featured/1600x900/?event-checkin',
//       'https://source.unsplash.com/featured/1600x900/?concierge',
//       'https://source.unsplash.com/featured/1600x900/?crowd',
//       'https://source.unsplash.com/featured/1600x900/?hospitality',
//     ],
//     'Attire & Styling': [
//       'https://source.unsplash.com/featured/1600x900/?wedding-dress',
//       'https://source.unsplash.com/featured/1600x900/?tuxedo',
//       'https://source.unsplash.com/featured/1600x900/?makeup-artist',
//       'https://source.unsplash.com/featured/1600x900/?fashion-styling',
//       'https://source.unsplash.com/featured/1600x900/?bridal-fashion',
//     ],
//   }
//   const list = photos[category] || photos['Venues']
//   return list[Math.floor(Math.random() * list.length)]
// }

const categoryImageFolders: Record<string, string[]> = {
  'Venues': [
    '/vendors/venues/venues1.webp',
    '/vendors/venues/venues2.png',
    '/vendors/venues/venues3.png',
  ],
  'Photography': [
    '/vendors/photography/photography1.jpg.avif',
    '/vendors/photography/photography2.jpg',
    '/vendors/photography/photography3.jpg',
  ],
  'Food Catering': [
    '/vendors/foodCatering/food1.jpg',
    '/vendors/foodCatering/food2.jpg',
    '/vendors/foodCatering/food3.jpg',
    '/vendors/foodCatering/food4.jpeg',
  ],
  'Decorations & Venue Setup': [
    '/vendors/decorations/deco1.jpg',
    '/vendors/decorations/deco2.jpg',
    '/vendors/decorations/deco3.jpg',
  ],
  'Entertainment': [
    '/vendors/ent/ent1.jpg',
    '/vendors/ent/ent2.jpg',
    '/vendors/ent/ent3.jpg',
  ],
  'Logistics': [
    '/vendors/logistics/logistics1.jpg',
    '/vendors/logistics/logistics2.jpeg',
    '/vendors/logistics/logistics3.webp',
  ],
  'Guest Management': [
    '/vendors/guestManagement/guest1.jpg',
    '/vendors/guestManagement/guest2.jpg',
    '/vendors/guestManagement/guest3.jpg.webp',
  ],
  'Attire & Styling': [
    '/vendors/attire/attire1.jpg.webp',
    '/vendors/attire/attire2.jpg',
    '/vendors/attire/attire3.jpeg',
  ],
}

const getImageUrl = (category: string) => {
  const list = categoryImageFolders[category] || categoryImageFolders['Venues']
  return list[Math.floor(Math.random() * list.length)]
}


// Helper for realistic descriptions
const getElaborateDesc = (name: string, category: string) => {
    const intros = [
        `At ${name}, we are passionate about making your event unforgettable.`,
        `${name} has been a leading provider of ${category.toLowerCase()} services in Malaysia for over a decade.`,
        `Welcome to ${name}, where we turn your dream event into reality with our premium ${category.toLowerCase()} solutions.`,
        `Experience the best in class ${category.toLowerCase()} with ${name}, trusted by thousands of happy clients.`,
    ]
    const middles = [
        "Our team of dedicated professionals works tirelessly to ensure every detail is perfect.",
        "We pride ourselves on our attention to detail and personalized service tailored to your unique needs.",
        "Using only the highest quality materials and equipment, we guarantee satisfaction.",
        "Whether it's an intimate gathering or a grand celebration, we have the expertise to handle it all.",
    ]
    const outros = [
        "Contact us today to start planning your perfect event!",
        "Let us take the stress out of planning so you can enjoy your special day.",
        "Book with us and experience the difference of true professionalism.",
        "Your satisfaction is our top priority.",
    ]
    
    return `${intros[Math.floor(Math.random() * intros.length)]} ${middles[Math.floor(Math.random() * middles.length)]} ${outros[Math.floor(Math.random() * outros.length)]}`
}

const categories = [
  {
    name: 'Venues',
    businesses: [
      { name: 'Grand Oak Ballroom', price: 5000 },
      { name: 'Sunset Garden Estate', price: 3500 },
      { name: 'The Industrial Loft', price: 2800 },
      { name: 'Lakeside Pavilion', price: 4200 },
      { name: 'Historic Manor House', price: 6000 },
      { name: 'Skyline Rooftop Terrace', price: 5500 },
      { name: 'Rustic Barn & Farm', price: 3000 },
    ]
  },
  {
    name: 'Photography',
    businesses: [
      { name: 'Capture The Moment', price: 2500 },
      { name: 'Vivid Lens Studio', price: 3000 },
      { name: 'Timeless Portraits', price: 2000 },
      { name: 'Golden Hour Snaps', price: 1800 },
      { name: 'Epic Drone Shots', price: 1500 },
      { name: 'Black & White Co.', price: 2200 },
      { name: 'Storyteller Visuals', price: 2800 },
    ]
  },
  {
    name: 'Food Catering',
    businesses: [
      { name: 'Gourmet Delights', price: 100 },
      { name: 'Taste of Italy', price: 45 },
      { name: 'Spice Route Catering', price: 55 },
      { name: 'Organic Harvest', price: 70 },
      { name: 'BBQ Pitmasters', price: 35 },
      { name: 'Sushi & Sashimi Bar', price: 80 },
      { name: 'Sweet Tooth Desserts', price: 20 },
    ]
  },
  {
    name: 'Decorations & Venue Setup',
    businesses: [
      { name: 'Floral Fantasies', price: 1500 },
      { name: 'Elegant Drapes', price: 800 },
      { name: 'Vintage Vibes Decor', price: 1200 },
      { name: 'Modern Minimalist', price: 1000 },
      { name: 'Balloon Artistry', price: 500 },
      { name: 'Rustic Charm Rentals', price: 900 },
      { name: 'Luminous Lights', price: 1100 },
      { name: 'Grand Gala Setups', price: 2500 },
      { name: 'Tropical Paradise Decor', price: 1300 },
      { name: 'Crystal Clear Designs', price: 1800 },
    ]
  },
  {
    name: 'Entertainment',
    businesses: [
      { name: 'The Groove Band', price: 4000 },
      { name: 'DJ Spinmaster', price: 1200 },
      { name: 'Classical Strings Quartet', price: 800 },
      { name: 'Jazz Trio Live', price: 1000 },
      { name: 'Magic & Mystery', price: 600 },
      { name: 'Acoustic Soul', price: 500 },
      { name: 'Comedy Hour', price: 1500 },
    ]
  },
  {
    name: 'Logistics',
    businesses: [
      { name: 'Smooth Moves Transport', price: 1000 },
      { name: 'Event Valet Pro', price: 800 },
      { name: 'Equipment Haulers', price: 600 },
      { name: 'Luxury Car Rentals', price: 1200 },
      { name: 'Safe Ride Home', price: 400 },
      { name: 'Cargo Logistics', price: 2000 },
      { name: 'Setup Crew', price: 500 },
    ]
  },
  {
    name: 'Guest Management',
    businesses: [
      { name: 'RSVP Masters', price: 300 },
      { name: 'Welcome Crew', price: 400 },
      { name: 'Seating Planner Pro', price: 200 },
      { name: 'Event App Solutions', price: 1500 },
      { name: 'VIP Concierge', price: 1000 },
      { name: 'Gift Bag Curators', price: 600 },
      { name: 'Security Guard Team', price: 800 },
    ]
  },
  {
    name: 'Attire & Styling',
    businesses: [
      { name: 'Bridal Boutique', price: 2000 },
      { name: 'The Tuxedo Shop', price: 250 },
      { name: 'Glamour Squad', price: 500 },
      { name: 'Vintage Dress Hire', price: 300 },
      { name: 'Personal Stylist', price: 800 },
      { name: 'Accessory Haven', price: 150 },
      { name: 'Tailor Made', price: 3000 },
      { name: 'Couture Creations', price: 4500 },
      { name: 'Traditional Malay Attire', price: 600 },
      { name: 'Modern Groom', price: 1200 },
    ]
  }
];

const reviews = [
    { comment: "Absolutely amazing service! Would recommend to anyone.", rating: 5 },
    { comment: "Very professional and easy to work with.", rating: 5 },
    { comment: "Great value for money, though they were a bit late.", rating: 4 },
    { comment: "Exceeded our expectations in every way.", rating: 5 },
    { comment: "Good service but communication could be improved.", rating: 3 },
    { comment: "Simply the best in town!", rating: 5 },
    { comment: "Helped make our wedding day perfect.", rating: 5 },
    { comment: "Decent experience, nothing special.", rating: 3 },
    { comment: "Friendly staff and great attention to detail.", rating: 4 },
    { comment: "Will definitely hire them again for our next event.", rating: 5 },
]

async function main() {
  const password = await hash('password123', 12)

  // Cleanup: Remove unwanted categories
  // await prisma.vendorProfile.deleteMany({
  //   where: {
  //     category: {
  //       in: ['Decorator', 'Uncategorized']
  //     }
  //   }
  // })
  // console.log('Cleaned up unwanted categories')

  // 1. Create Admin
  await prisma.user.upsert({
    where: { email: 'admin@eventflow.com' },
    update: {},
    create: {
      email: 'admin@eventflow.com',
      name: 'Admin User',
      passwordHash: password,
      role: 'ADMIN',
    },
  })

  // 2. Create Organizer
  await prisma.user.upsert({
    where: { email: 'organizer@eventflow.com' },
    update: {},
    create: {
      email: 'organizer@eventflow.com',
      name: 'Sarah Planner',
      passwordHash: password,
      role: 'ORGANIZER',
    },
  })

  // 3. Create some dummy customers for reviews
  const customers = []
  for (let i = 1; i <= 5; i++) {
    const customer = await prisma.user.upsert({
        where: { email: `customer${i}@example.com` },
        update: {},
        create: {
            email: `customer${i}@example.com`,
            name: `Customer ${i}`,
            passwordHash: password,
            role: 'ORGANIZER', // Assuming customers act like organizers/clients
        }
    })
    customers.push(customer)
  }

  // 4. Create Vendors for each category
  for (const category of categories) {
    console.log(`Seeding category: ${category.name}`)
    for (let i = 0; i < category.businesses.length; i++) {
      const biz = category.businesses[i]
      const email = `${biz.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`
      
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          name: `Owner of ${biz.name}`,
          passwordHash: password,
          role: 'VENDOR',
        },
      })

      const location = getLocations()
      const description = getElaborateDesc(biz.name, category.name)
      const occasions = getOccasions(category.name)
      const phoneNumber = getRandomPhone()
      const website = `www.${biz.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com.my`

      const vendorProfile = await prisma.vendorProfile.upsert({
        where: { userId: user.id },
        update: {
            category: category.name,
            description, // Update description to be elaborate
            location, // Update location
            occasions,
            phoneNumber,
            website,
            imageUrl: getImageUrl(category.name),
        },
        create: {
          userId: user.id,
          businessName: biz.name,
          description,
          category: category.name,
          location,
          occasions,
          phoneNumber,
          website,
          imageUrl: getImageUrl(category.name),
          rating: 4.0 + Math.random(),
        },
      })

      // Create a default service for each vendor if it doesn't exist
      const serviceName = `Standard ${category.name} Service`
      const existingService = await prisma.service.findFirst({
        where: {
          vendorId: vendorProfile.id,
          name: serviceName
        }
      })

      if (!existingService) {
        await prisma.service.create({
          data: {
            vendorId: vendorProfile.id,
            name: serviceName,
            description: `Professional ${category.name.toLowerCase()} services for your event.`,
            basePrice: biz.price,
          },
        })
      }

      // Add reviews
      // Check if reviews exist, if not add 2-4 random reviews
      const existingReviews = await prisma.review.findMany({
        where: { vendorId: vendorProfile.id }
      })

      if (existingReviews.length === 0) {
        const numReviews = Math.floor(Math.random() * 3) + 2 // 2 to 4 reviews
        for (let j = 0; j < numReviews; j++) {
            const randomReview = reviews[Math.floor(Math.random() * reviews.length)]
            const randomCustomer = customers[Math.floor(Math.random() * customers.length)]
            
            // Need a booking to link the review? Schema says Review has unique bookingId.
            // So we must create a dummy completed booking first.
            const dummyEvent = await prisma.event.create({
              data: {
                organizerId: randomCustomer.id,
                title: 'Past Event',
                date: new Date(),
                location: 'Kuala Lumpur',
                type: 'Wedding',
                budget: 10000
              }
            })

            const booking = await prisma.booking.create({
                data: {
                    eventId: dummyEvent.id,
                    vendorId: vendorProfile.id,
                    organizerId: randomCustomer.id,
                    status: 'COMPLETED',
                    date: new Date(),
                    price: biz.price,
                }
            })

            await prisma.review.create({
                data: {
                    bookingId: booking.id,
                    vendorId: vendorProfile.id,
                    authorId: randomCustomer.id,
                    rating: randomReview.rating,
                    comment: randomReview.comment
                }
            })
        }
      }
    }
  }

  console.log('Seeding completed!')

  // 5. Create dummy messages for the Sarah Planner
  const sarah = await prisma.user.findUnique({ where: { email: 'organizer@eventflow.com' } })
  if (sarah) {
    const venuesVendor = await prisma.vendorProfile.findFirst({ where: { category: 'Venues' }, include: { user: true } })
    const photoVendor = await prisma.vendorProfile.findFirst({ where: { category: 'Photography' }, include: { user: true } })

    if (venuesVendor && photoVendor) {
      // Chat with Venue Vendor
      await prisma.message.createMany({
        data: [
          {
            senderId: sarah.id,
            receiverId: venuesVendor.user.id,
            content: "Hi, I'm interested in booking your venue for a wedding in July. Is July 15th available?",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
          },
          {
            senderId: venuesVendor.user.id,
            receiverId: sarah.id,
            content: "Hi Sarah! Yes, July 15th is currently available. For a wedding of 300 guests, the base price would be RM 5,000 including basic decor.",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1), // 1 day ago
          },
          {
            senderId: sarah.id,
            receiverId: venuesVendor.user.id,
            content: "That sounds great. Do you provide catering as well or should I bring my own?",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          }
        ]
      })

      // Chat with Photo Vendor
      await prisma.message.createMany({
        data: [
          {
            senderId: sarah.id,
            receiverId: photoVendor.user.id,
            content: "Hello! I saw your portfolio and love your style. What are your rates for a full-day wedding coverage?",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
          },
          {
            senderId: photoVendor.user.id,
            receiverId: sarah.id,
            content: "Thank you Sarah! Our full-day packages start from RM 3,000. This includes 2 photographers and a premium album.",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
          }
        ]
      })
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
