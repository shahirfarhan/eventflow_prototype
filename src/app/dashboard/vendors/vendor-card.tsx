import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase } from "lucide-react"
import Link from "next/link"

interface Service {
  id: string
  name: string
  basePrice: number
}

interface Vendor {
  id: string
  businessName: string
  description: string | null
  category: string
  location: string
  services: Service[]
}

export function VendorCard({ vendor }: { vendor: Vendor }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{vendor.businessName}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {vendor.location}
            </CardDescription>
          </div>
          <Badge variant="secondary">{vendor.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-gray-500 line-clamp-3 mb-4">
          {vendor.description || "No description provided."}
        </p>
        
        {vendor.services.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Top Services</h4>
            <div className="flex flex-wrap gap-2">
              {vendor.services.map(service => (
                <Badge key={service.id} variant="outline" className="text-xs font-normal">
                  {service.name} (${service.basePrice})
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link href={`/dashboard/vendors/${vendor.id}`} className="w-full">
          <Button className="w-full">View Profile</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
