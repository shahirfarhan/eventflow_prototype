import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, ArrowLeft, Globe, Phone, Star, Calendar, Mail } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";

export default async function PublicVendorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const vendor = await prisma.vendorProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          email: true,
        },
      },
      services: {
        include: {
          packages: true,
        },
      },
      reviews: {
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
            createdAt: 'desc'
        }
      }
    },
  });

  if (!vendor) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div>
        <Link href="/vendors" className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Vendors
        </Link>
        {vendor.imageUrl && (
          <img
            src={vendor.imageUrl}
            alt={vendor.businessName}
            className="w-full h-64 object-cover rounded-md mb-6"
          />
        )}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{vendor.businessName}</h1>
            <div className="flex flex-wrap items-center mt-2 text-gray-500 gap-4">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                {vendor.location}
              </div>
              <Badge variant="outline">
                {vendor.category}
              </Badge>
              {vendor.rating > 0 && (
                 <div className="flex items-center">
                    <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-black">{vendor.rating.toFixed(1)}</span>
                    <span className="ml-1 text-gray-400">({vendor.reviews.length} reviews)</span>
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {vendor.description || "No description provided."}
              </p>
              
              {vendor.occasions && (
                <div className="pt-4 border-t">
                    <h3 className="text-sm font-semibold mb-2 flex items-center">
                        <Calendar className="mr-2 h-4 w-4" /> Perfect for Occasions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {vendor.occasions.split(',').map((occ, i) => (
                            <Badge key={i} variant="secondary">{occ.trim()}</Badge>
                        ))}
                    </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div>
            <h2 className="text-2xl font-bold mb-4">Services</h2>
            <div className="grid gap-4">
              {vendor.services.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription className="mt-1">
                          Starting at <span className="font-semibold text-primary">RM {service.basePrice.toLocaleString()}</span>
                        </CardDescription>
                      </div>
                      {/* Public page action */}
                      <Button asChild>
                        <Link href={`/vendors/${vendor.id}/book?serviceId=${service.id}`}>
                          Book Now
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      {service.description || "No description provided."}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
             <h2 className="text-2xl font-bold mb-4">Reviews</h2>
             {vendor.reviews.length > 0 ? (
                 <div className="grid gap-4">
                     {vendor.reviews.map((review) => (
                         <Card key={review.id}>
                             <CardHeader className="pb-2">
                                 <div className="flex justify-between items-center">
                                     <div className="font-semibold">{review.author.name}</div>
                                     <div className="flex">
                                         {Array.from({ length: 5 }).map((_, i) => (
                                             <Star 
                                                key={i} 
                                                className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                                             />
                                         ))}
                                     </div>
                                 </div>
                             </CardHeader>
                             <CardContent>
                                 <p className="text-sm text-gray-600">{review.comment}</p>
                             </CardContent>
                         </Card>
                     ))}
                 </div>
             ) : (
                 <p className="text-gray-500 italic">No reviews yet.</p>
             )}
          </div>

        </div>
        
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {vendor.website && (
                         <div className="flex items-center text-sm">
                             <Globe className="mr-2 h-4 w-4 text-gray-500" />
                             <a href={`http://${vendor.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                 {vendor.website}
                             </a>
                         </div>
                     )}
                     
                     {vendor.phoneNumber && (
                          <div className="flex items-center text-sm">
                              <Phone className="mr-2 h-4 w-4 text-gray-500" />
                              <span>{vendor.phoneNumber}</span>
                          </div>
                      )}

                      {vendor.user.email && (
                          <div className="flex items-center text-sm">
                              <Mail className="mr-2 h-4 w-4 text-gray-500" />
                              <a href={`mailto:${vendor.user.email}`} className="text-blue-600 hover:underline">
                                  {vendor.user.email}
                              </a>
                          </div>
                      )}

                     {!session?.user && (
                         <div className="pt-4 mt-4 border-t">
                            <p className="text-sm text-gray-500 mb-4">
                                Login to view full details and book services.
                            </p>
                            <Button asChild className="w-full">
                                <Link href="/login">Login</Link>
                            </Button>
                         </div>
                     )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
