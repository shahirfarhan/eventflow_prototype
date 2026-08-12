 import { Button } from "@/components/ui/button";
 import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import Link from "next/link";
 
 export const dynamic = 'force-dynamic';
 
 export default function RegisterVendorPage() {
   return (
     <div className="container mx-auto py-10 px-4 space-y-10">
       <div className="max-w-3xl mx-auto">
         <h1 className="text-3xl font-bold tracking-tight">Register as a Vendor</h1>
         <p className="text-muted-foreground mt-2">
           Tell us about your business. We’ll review your application and follow up via email.
         </p>
 
         <form className="mt-8 space-y-6">
           <div className="grid md:grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label htmlFor="businessName">Business Name</Label>
               <Input id="businessName" required />
             </div>
             <div className="space-y-2">
               <Label htmlFor="category">Category</Label>
               <Input id="category" placeholder="e.g. Photography, Catering" required />
             </div>
           </div>
           <div className="grid md:grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label htmlFor="location">Location</Label>
               <Input id="location" placeholder="City, State" required />
             </div>
             <div className="space-y-2">
               <Label htmlFor="phone">Phone Number</Label>
               <Input id="phone" placeholder="e.g. 012-3456789" />
             </div>
           </div>
           <div className="grid md:grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label htmlFor="website">Website</Label>
               <Input id="website" placeholder="www.example.com" />
             </div>
             <div className="space-y-2">
               <Label htmlFor="email">Contact Email</Label>
               <Input id="email" type="email" />
             </div>
           </div>
           <div className="space-y-2">
             <Label htmlFor="description">Business Description</Label>
             <Textarea id="description" placeholder="Describe your services, experience, and unique selling points." />
           </div>
           <div className="grid md:grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label htmlFor="serviceName">Primary Service</Label>
               <Input id="serviceName" placeholder="e.g. Wedding Photography" />
             </div>
             <div className="space-y-2">
               <Label htmlFor="basePrice">Base Price (RM)</Label>
               <Input id="basePrice" type="number" placeholder="e.g. 3000" />
             </div>
           </div>
 
           <div className="flex justify-end gap-3">
             <Link href="/vendors">
               <Button variant="outline">Cancel</Button>
             </Link>
             <Button type="button">Submit Application</Button>
           </div>
         </form>
       </div>
 
       <section className="max-w-5xl mx-auto">
         <h2 className="text-2xl font-bold mb-6">Grow with EventFlow</h2>
         <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
           <Card>
             <CardHeader>
               <CardTitle>Protected Payment</CardTitle>
               <CardDescription>Secure, escrow-like flow until service is delivered.</CardDescription>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-gray-600">Fraud checks, payout tracking, and dispute assistance.</p>
             </CardContent>
           </Card>
           <Card>
             <CardHeader>
               <CardTitle>Customer Reviews</CardTitle>
               <CardDescription>Build trust with verified post-event reviews.</CardDescription>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-gray-600">Highlight your best work with ratings and testimonials.</p>
             </CardContent>
           </Card>
           <Card>
             <CardHeader>
               <CardTitle>Data Analytics</CardTitle>
               <CardDescription>Track GMV, repeat customers, and conversion rates.</CardDescription>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-gray-600">Segment by event types and customer profiles.</p>
             </CardContent>
           </Card>
           <Card>
             <CardHeader>
               <CardTitle>Boosted Marketing</CardTitle>
               <CardDescription>Get featured placement to reach more organizers.</CardDescription>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-gray-600">Seasonal promos, targeted listings, and category highlights.</p>
             </CardContent>
           </Card>
         </div>
       </section>
     </div>
   )
 }
