// 'use client'

// import { useState, useEffect } from 'react'
// import { Input } from '@/components/ui/input'
// import { Button } from '@/components/ui/button'
// import { Search } from 'lucide-react'
// import { VendorCard } from './vendor-card'
// import { useSearchParams, useRouter, usePathname } from 'next/navigation'

// interface Service {
//   id: string
//   name: string
//   basePrice: number
// }

// interface Vendor {
//   id: string
//   businessName: string
//   description: string | null
//   category: string
//   location: string
//   services: Service[]
// }

// export default function VendorSearch() {
//   const searchParams = useSearchParams()
//   const pathname = usePathname()
//   const { replace } = useRouter()
  
//   const [searchTerm, setSearchTerm] = useState(searchParams.get('query')?.toString() || '')
//   const [vendors, setVendors] = useState<Vendor[]>([])
//   const [loading, setLoading] = useState(false)
  
//   // Basic debounce implementation or use a library. 
//   // Since I don't have use-debounce hook, I'll implement a simple effect.

//   useEffect(() => {
//     const fetchVendors = async () => {
//       setLoading(true)
//       try {
//         const params = new URLSearchParams()
//         if (searchTerm) params.set('query', searchTerm)
        
//         const res = await fetch(`/api/vendors?${params.toString()}`)
//         if (res.ok) {
//           const data = await res.json()
//           setVendors(data)
//         }
//       } catch (error) {
//         console.error('Failed to fetch vendors', error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     const timeoutId = setTimeout(() => {
//       fetchVendors()
//     }, 300)

//     return () => clearTimeout(timeoutId)
//   }, [searchTerm])

//   const handleSearch = (term: string) => {
//     setSearchTerm(term)
//     const params = new URLSearchParams(searchParams)
//     if (term) {
//       params.set('query', term)
//     } else {
//       params.delete('query')
//     }
//     replace(`${pathname}?${params.toString()}`)
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex gap-2">
//         <div className="relative flex-1">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             type="search"
//             placeholder="Search vendors by name, category, or location..."
//             className="pl-8"
//             value={searchTerm}
//             onChange={(e) => handleSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="text-center py-12 text-gray-500">Loading vendors...</div>
//       ) : vendors.length === 0 ? (
//         <div className="text-center py-12 text-gray-500">
//           No vendors found matching your search.
//         </div>
//       ) : (
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {vendors.map((vendor) => (
//             <VendorCard key={vendor.id} vendor={vendor} />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }


'use client'
import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, MapPin } from 'lucide-react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

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
  imageUrl?: string | null
  services: Service[]
}

export default function VendorSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query')?.toString() || '')
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (searchTerm) params.set('query', searchTerm)
        const res = await fetch(`/api/vendors?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          setVendors(data)
        }
      } catch (error) {
        console.error('Failed to fetch vendors', error)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(() => {
      fetchVendors()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }
    replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search vendors by name, category, or location..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading vendors...</div>
      ) : vendors.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No vendors found matching your search.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => {
            const minPrice = vendor.services.length > 0
              ? Math.min(...vendor.services.map(s => s.basePrice))
              : null

            return (
              <Link key={vendor.id} href={`/vendors/${vendor.id}`} className="block h-full">
                <Card className="flex flex-col h-full hover:shadow-md transition-shadow cursor-pointer overflow-hidden p-0 gap-0">
                  {vendor.imageUrl && (
                    <img
                      src={vendor.imageUrl}
                      alt={vendor.businessName}
                      className="w-full h-40 object-cover block"
                    />
                  )}
                  <div className="flex flex-col gap-6 py-6">
                    <CardHeader className="py-0">
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
                        <Button className="w-full">View Details</Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}