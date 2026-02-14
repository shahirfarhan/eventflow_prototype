'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { VendorCard } from './vendor-card'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

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

export default function VendorSearch() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('query')?.toString() || '')
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(false)
  
  // Basic debounce implementation or use a library. 
  // Since I don't have use-debounce hook, I'll implement a simple effect.

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
          {vendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  )
}
