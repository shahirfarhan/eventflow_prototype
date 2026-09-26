// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { prisma } from "@/lib/prisma";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Star, MapPin } from "lucide-react";
// import { auth } from "@/auth";
// import { Plus } from "lucide-react"
// import SurveyPopup from "@/components/survey-popup";
// import AudienceToggle from "@/components/audience-toggle";

// export default async function Home() {
//   const allCategories = await prisma.vendorProfile.findMany({
//     select: { category: true },
//     distinct: ['category'],
//   });
//   const categories = allCategories.map(c => c.category).filter(Boolean);

//   const session = await auth();

//   const featuredVendors = await prisma.vendorProfile.findMany({
//     orderBy: { rating: 'desc' },
//     take: 6,
//     include: {
//       reviews: {
//         select: { id: true },
//       },
//       services: {
//         select: { basePrice: true },
//       },
//     },
//   });

//   const shortDesc: Record<string, string> = {
//     'Photography': 'Capture moments',
//     'Venues': 'Find perfect spaces',
//     'Food Catering': 'Delicious menus',
//     'Decorations & Venue Setup': 'Stylish decor',
//     'Entertainment': 'Make it lively',
//     'Logistics': 'Smooth operations',
//     'Guest Management': 'Seamless check-ins',
//     'Attire & Styling': 'Dress to impress',
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       <main className="flex-1">
//         {/* <SurveyPopup /> */}
//         <section className="w-full py-8 pb-8  md:py-16 lg:py-24 xl:py-32">
//           <div className="container mx-auto px-4 md:px-6">
//             <div className="grid grid-cols-2 gap-8 items-center">

//               {/* LEFT SIDE */}
//               <div className="flex flex-col items-start space-y-4 text-left">
                
//                 <div className="space-y-2">
//                   <h1 className="text-5xl font-bold tracking-tighter sm:text-5xl md:text-8xl lg:text-6xl/none">
//                     What Are We <br/> Planning Today?
//                   </h1>

//                   <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
//                     All your vendors and bookings. Now in one app.
//                   </p>
//                 </div>

//                 {/* CREATE EVENT */}
//                 <div>
//                   {session?.user?.role === "ORGANIZER" ? (
//                     <Link href="/dashboard/events/new">
//                       <Button>
//                         <Plus className="mr-2 h-4 w-4" />
//                         Create Event
//                       </Button>
//                     </Link>
//                   ) : null}
//                 </div>

//                 {/* SEARCH */}
//                 <form
//                   action="/vendors"
//                   method="GET"
//                   className="w-full max-w-xl mt-6 flex gap-2"
//                 >
//                   <Input
//                     type="search"
//                     name="q"
//                     placeholder="Search vendors by name or category..."
//                     className="flex-1"
//                   />

//                   <Button type="submit">
//                     Search Vendors
//                   </Button>
//                 </form>

//               </div>

//               {/* RIGHT SIDE */}
//               <div className="w-full flex justify-center items-center">
//                 <div className="grid grid-cols-2 gap-4 w-fit">

//                   {/* LEFT COLUMN */}
//                   <div className="w-[180px] flex flex-col gap-4">
                    
//                     {/* Vendor 1 */}
//                     <div className="w-[160px] h-[160px] bg-white rounded-2xl overflow-hidden border shadow-sm">
//                       <img
//                         src="/vendor_profile_photography.jpg"
//                         alt="Vendor"
//                         className="w-full aspect-[3/5] object-cover"
//                       />

//                       <div className="p-3">
//                         <p className="font-semibold text-lg">Flashpoint Studio</p>
//                         <p className="text-sm text-gray-500">Kuala Lumpur</p>

//                         <div className="flex items-center gap-1 mt-2">
//                           <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                           <span className="text-sm font-semibold">4.9</span>
//                           <span className="text-sm text-gray-500">(214)</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Vendor 2 */}
//                     <div className="w-[160px] bg-white rounded-2xl overflow-hidden border shadow-sm">
//                       <img
//                         src="/vendor_profile_food.jpg"
//                         alt="Vendor"
//                         className="w-full aspect-[4/3] object-cover"
//                       />

//                       <div className="p-4">
//                         <p className="font-semibold text-lg">Kanan Kitchen</p>
//                         <p className="text-sm text-gray-500">Petaling Jaya</p>

//                         <div className="flex items-center gap-1 mt-2">
//                           <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                           <span className="text-sm font-semibold">4.8</span>
//                           <span className="text-sm text-gray-500">(97)</span>
//                         </div>
//                       </div>
//                     </div>

//                   </div>

//                   {/* RIGHT COLUMN */}
//                   <div className="w-[180px] flex flex-col items-center gap-4 pt-14">

//                     {/* Vendor 3 */}
//                     <div className="w-[160px] h-[300px] bg-white rounded-2xl overflow-hidden border shadow-sm">
//                       <img
//                         src="/vendor_profile_venues.jpg"
//                         alt="Vendor"
//                         className="w-full aspect-[4/3] object-cover"
//                       />

//                       <div className="p-4">
//                         <p className="font-semibold text-lg">Vasanta Hall</p>
//                         <p className="text-sm text-gray-500">KLCC, Kuala Lumpur</p>

//                         <div className="flex items-center gap-1 mt-2">
//                           <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                           <span className="text-sm font-semibold">4.6</span>
//                           <span className="text-sm text-gray-500">(58)</span>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Vendor 4 */}
//                     <div className="w-[160px] bg-white rounded-2xl overflow-hidden border shadow-sm">
//                       <img
//                         src="/vendor_profile_attire.jpg"
//                         alt="Vendor"
//                         className="w-full aspect-[4/5] object-cover"
//                       />

//                       <div className="p-4">
//                         <p className="font-semibold text-lg">Arabelle Bridal</p>
//                         <p className="text-sm text-gray-500">Shah Alam, Selangor</p>

//                         <div className="flex items-center gap-1 mt-2">
//                           <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                           <span className="text-sm font-semibold">5.0</span>
//                           <span className="text-sm text-gray-500">(142)</span>
//                         </div>
//                       </div>
//                     </div>

//                   </div>

//                 </div>
//               </div>

//             </div>
//           </div>
//         </section>

//         <AudienceToggle />

//         <section className="w-full py-12 md:py-24 lg:py-32">
//           <div className="container mx-auto px-4 md:px-6">
//             <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
//               <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
//                 <div className="p-2 bg-secondary/20 rounded-full">
//                   <svg
//                     className=" text-secondary h-6 w-6 mb-2 opacity-75"
//                     fill="none"
//                     height="24"
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     viewBox="0 0 24 24"
//                     width="24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <polyline points="20 6 9 17 4 12" />
//                   </svg>
//                 </div>
//                 <h2 className="text-xl font-bold">Discover Vendors</h2>
//                 <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
//                   Find the best photographers, caterers, and venues for your event.
//                 </p>
//               </div>
//               <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
//                 <div className="p-2 bg-secondary/20 rounded-full">
//                   <svg
//                     className=" text-secondary h-6 w-6 mb-2 opacity-75"
//                     fill="none"
//                     height="24"
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     viewBox="0 0 24 24"
//                     width="24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
//                   </svg>
//                 </div>
//                 <h2 className="text-xl font-bold">Secure Bookings</h2>
//                 <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
//                   Book services with confidence using our secure payment system.
//                 </p>
//               </div>
//               <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
//                 <div className="p-2 bg-secondary/20 rounded-full">
//                    <svg
//                     className=" text-secondary h-6 w-6 mb-2 opacity-75"
//                     fill="none"
//                     height="24"
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     viewBox="0 0 24 24"
//                     width="24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
//                     <circle cx="8.5" cy="7" r="4" />
//                     <line x1="20" x2="23" y1="8" y2="11" />
//                     <line x1="23" x2="20" y1="8" y2="11" />
//                   </svg>
//                 </div>
//                 <h2 className="text-xl font-bold">Manage Everything</h2>
//                 <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
//                   Keep track of quotes, payments, and timelines in one place.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
//           <div className="container mx-auto px-4 md:px-6">
//             <h2 className="text-2xl font-bold mb-6">Featured Vendors</h2>
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {featuredVendors.map((vendor) => {
//                 const minPrice = vendor.services.length > 0 
//                   ? Math.min(...vendor.services.map(s => s.basePrice))
//                   : null;
//                 return (
//                   <Link key={vendor.id} href={`/vendors/${vendor.id}`} className="block h-full">
//                     <Card className="flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer p-0 gap-0 overflow-hidden">
//                       {vendor.imageUrl && (
//                         <img
//                           src={vendor.imageUrl}
//                           alt={vendor.businessName}
//                           className="h-40 w-full object-cover"
//                         />
//                       )}
//                       <div className="flex flex-col gap-6 py-6">
//                         <CardHeader className="py-0">
//                           <CardTitle className="text-xl">{vendor.businessName}</CardTitle>
//                           <CardDescription className="flex items-center mt-1">
//                             <MapPin className="mr-1 h-3 w-3" />
//                             {vendor.location}
//                           </CardDescription>
//                         </CardHeader>
//                         <CardContent className="flex-1 py-0">
//                           <div className="flex items-center mb-2">
//                             <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
//                             <span className="font-medium">{vendor.rating.toFixed(1)}</span>
//                             <span className="ml-1 text-gray-500">({vendor.reviews.length} reviews)</span>
//                           </div>
//                           <p className="text-sm text-gray-600 line-clamp-3 mb-4">
//                             {vendor.description || "No description provided."}
//                           </p>
//                           {minPrice !== null && (
//                             <p className="text-sm font-medium">
//                               Starts from <span className="text-primary">RM {minPrice.toLocaleString()}</span>
//                             </p>
//                           )}
//                         </CardContent>
//                       </div>
//                     </Card>
//                   </Link>
//                 )
//               })}
//             </div>
//           </div>
//         </section>
//       </main>
//       <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
//         <p className="text-xs text-gray-500 dark:text-gray-400">© 2026 Gaffers. All rights reserved.</p>
//         <nav className="sm:ml-auto flex gap-4 sm:gap-6">
//           <Link className="text-xs" href="#">
//             gaffers@gmail.com
//           </Link>
//           <Link className="text-xs hover:underline underline-offset-4" href="#">
//             Terms of Service
//           </Link>
//           <Link className="text-xs hover:underline underline-offset-4" href="#">
//             Privacy
//           </Link>
//         </nav>
//       </footer>
//     </div>
//   );
// }




import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { FeaturedVendors } from "@/components/featured-vendors"
import { SiteFooter } from "@/components/site-footer"

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* <SiteHeader /> */}
      <main className="flex-1">
        <Hero />
        <Features />
        <FeaturedVendors />
      </main>
      <SiteFooter />
    </div>
  )
}