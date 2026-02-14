import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const dynamic = 'force-dynamic';

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;

  let where: any = {};
  if (category && category !== 'All') {
    where.category = category;
  }
  if (q && q.trim().length > 0) {
    where.OR = [
      { businessName: { contains: q } },
      { category: { contains: q } },
    ];
  }

  const vendors = await prisma.vendorProfile.findMany({
    where,
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      services: {
        select: {
          basePrice: true,
        },
      },
    },
    orderBy: {
      category: 'asc',
    },
  });

  // Get all unique categories for the filter
  const allVendors = await prisma.vendorProfile.findMany({
    select: { category: true },
    distinct: ['category'],
  });
  const categories = ['All', ...allVendors.map(v => v.category).filter(Boolean)];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Find Service Providers</h1>
          <p className="text-muted-foreground mt-2">
            Browse our curated list of vendors for your next event.
          </p>
        </div>
      </div>

      <form action="/vendors" method="GET" className="mb-6 flex gap-2">
        <Input
          type="search"
          name="q"
          placeholder="Search vendors by name or category..."
          defaultValue={q || ""}
          className="flex-1"
        />
        {category && category !== 'All' && (
          <input type="hidden" name="category" value={category} />
        )}
        <Button type="submit">Search Vendors</Button>
      </form>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={
              cat === 'All'
                ? '/vendors'
                : `/vendors?category=${encodeURIComponent(cat)}`
            }


          >
            <Button
              variant={category === cat || (!category && cat === 'All') ? "default" : "outline"}
              size="sm"
            >
              {cat}
            </Button>
          </Link>
        ))}
      </div>

      {vendors.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No vendors found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => {
            const minPrice = vendor.services.length > 0 
              ? Math.min(...vendor.services.map(s => s.basePrice))
              : null;

            return (
              <Link key={vendor.id} href={`/vendors/${vendor.id}`} className="block h-full">
                <Card className="flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer">
                  {vendor.imageUrl && (
                    <img
                      src={vendor.imageUrl}
                      alt={vendor.businessName}
                      className="h-40 w-full object-cover rounded-t-md"
                    />
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{vendor.businessName}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="mr-1 h-3 w-3" />
                          {vendor.location}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{vendor.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {vendor.description || "No description provided."}
                    </p>
                    <div className="space-y-4">
                      {minPrice !== null && (
                        <p className="text-sm font-medium">
                          Starts from <span className="text-primary">RM {minPrice.toLocaleString()}</span>
                        </p>
                      )}
                      <div className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                        View Details
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
