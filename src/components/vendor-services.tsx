"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

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

export default function VendorServices({
  vendor,
}: VendorServicesProps) {
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

  return (
    <>
      <div className="grid gap-4">
        {vendor.services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{service.name}</CardTitle>

                  <CardDescription className="mt-1">
                    Starting at{" "}
                    <span className="font-semibold text-primary">
                      RM {service.basePrice.toLocaleString()}
                    </span>
                  </CardDescription>
                </div>

                <div className="flex gap-2">
                  {/* Message */}
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => openChat(service)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>

                  {/* Book */}
                  <Button asChild>
                    <Link
                      href={`/vendors/${vendor.id}/book?serviceId=${service.id}`}
                    >
                      Book Now
                    </Link>
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-gray-500">
                {service.description || "No description provided."}
              </p>

              {/* Your images/packages can remain here */}
            </CardContent>
          </Card>
        ))}
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