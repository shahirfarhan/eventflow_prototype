 'use client'
 
 import { useEffect, useState } from 'react'
 import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
 import { Button } from '@/components/ui/button'
 
 export default function SurveyPopup() {
   const [open, setOpen] = useState(false)
 
   useEffect(() => {
    setOpen(true)
   }, [])
 
   const close = () => {
     setOpen(false)
   }
 
   return (
     <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
       <DialogContent>
         <DialogHeader>
           <DialogTitle>Quick Survey</DialogTitle>
           <DialogDescription>Help us improve EventFlow. It only takes 1–2 minutes.</DialogDescription>
         </DialogHeader>
         <div className="flex justify-end gap-3">
           <Button variant="outline" onClick={close}>Close</Button>
           <Button onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfc4s1uwvmKGRDuwF_1pJ7Av8x3My4lfDQxFeL598UlTCINcw/viewform', '_blank')}>Fill Survey</Button>
         </div>
       </DialogContent>
     </Dialog>
   )
 }
