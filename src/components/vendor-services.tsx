"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { ServicePhotoStrip } from "@/components/service-photos";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import BookingChatDialog, {
  ChatContextService,
} from "@/app/dashboard/bookings/booking-chat-dialog";

type VendorServicesProps = {
  vendor: {
    id: string;
    businessName: string;
    location: string;
    user: {
      id: string;
    };
    services: any[];
  };
};

export default function VendorServices({ vendor }: VendorServicesProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<ChatContextService | null>(null);

  const openChat = (service: any) => {
    setSelectedService({
      id: service.id,
      name: service.name,
      description: service.description,
      basePrice: service.basePrice,
      vendorId: vendor.id,
      vendorBusinessName: vendor.businessName,
      vendorLocation: vendor.location,
      occasions: service.occasions,
    });

    setChatOpen(true);
  };

  if (vendor.services.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        No services listed yet.
      </div>
    );
  }

  return (
    <>
      {/* grid-cols-1 + min-w-0 keep every card inside the screen on phones */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {vendor.services.map((service) => {
          const bookHref = `/vendors/${vendor.id}/book?serviceId=${service.id}`;

          return (
            <Card key={service.id} className="min-w-0 overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  {/* Title + price (allowed to shrink and wrap) */}
                  <div className="min-w-0 flex-1">
                    <CardTitle className="break-words text-base leading-snug sm:text-lg">
                      {service.name}
                    </CardTitle>

                    <CardDescription className="mt-1">
                      Starting at{" "}
                      <span className="font-semibold text-primary">
                        RM {Number(service.basePrice ?? 0).toLocaleString()}
                      </span>
                    </CardDescription>
                  </div>

                  {/* Message + Book: top right on desktop */}
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => openChat(service)}
                      aria-label={`Message ${vendor.businessName} about ${service.name}`}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>

                    <Button asChild className="hidden sm:inline-flex">
                      <Link href={bookHref}>Book Now</Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="min-w-0 space-y-4">
                {/* pre-line keeps the vendor's line breaks but still wraps long lines */}
                <p className="whitespace-pre-line break-words text-sm leading-relaxed text-muted-foreground">
                  {service.description || "No description provided."}
                </p>

                {service.images?.length > 0 && (
                  <div className="min-w-0">
                    <ServicePhotoStrip name={service.name} images={service.images} />
                  </div>
                )}

                {/* Book: full width at the bottom on phones */}
                <Button asChild className="h-11 w-full sm:hidden">
                  <Link href={bookHref}>Book Now</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ONE chat dialog for this vendor */}
      <BookingChatDialog
        open={chatOpen}
        onOpenChange={setChatOpen}
        title={`Chat with ${vendor.businessName}`}
        description="Discuss your requirements with the vendor."
        peerId={vendor.user.id}
        contextService={selectedService || undefined}
        contextVendorBusinessName={vendor.businessName}
      />
    </>
  );
}
