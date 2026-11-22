"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { ServicePhotoStrip } from "@/components/service-photos";
import { ServiceTitle, type ServiceTitleLabels } from "@/components/service-title";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getDictionary, type Locale } from "@/lib/i18n";

import BookingChatDialog, {
  ChatContextService,
} from "@/app/dashboard/bookings/booking-chat-dialog";

// "What's included" labels for each language
const INCLUDED_LABELS: Record<string, Partial<ServiceTitleLabels>> = {
  ms: {
    whatsIncluded: "Apa yang termasuk",
    seeWhatsIncluded: "Lihat apa yang termasuk",
    guestsRange: (min, max) => `${min}–${max} tetamu`,
    guestsFrom: (min) => `Dari ${min} tetamu`,
    guestsUpTo: (max) => `Sehingga ${max} tetamu`,
  },
};

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
  /** "en" or "ms" (defaults to English) */
  locale?: Locale;
};

export default function VendorServices({ vendor, locale = "en" }: VendorServicesProps) {
  const t = getDictionary(locale).services;
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
        {t.noServices}
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
                  {/* Click the name to show "What's included" */}
                  <div className="min-w-0 flex-1">
                    <ServiceTitle
                      name={service.name}
                      includedItems={service.includedItems}
                      minGuests={service.minGuests}
                      maxGuests={service.maxGuests}
                      labels={INCLUDED_LABELS[locale]}
                    >
                      <span className="text-sm text-muted-foreground">
                        {t.startingAt}{" "}
                        <span className="font-semibold text-primary">
                          RM {Number(service.basePrice ?? 0).toLocaleString("en-MY")}
                        </span>
                      </span>
                    </ServiceTitle>
                  </div>

                  {/* Message + Book: top right on desktop */}
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10"
                      onClick={() => openChat(service)}
                      aria-label={t.messageAbout(vendor.businessName, service.name)}
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>

                    <Button asChild className="hidden sm:inline-flex">
                      <Link href={bookHref}>{t.bookNow}</Link>
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="min-w-0 space-y-4">
                {/* pre-line keeps the vendor's line breaks but still wraps long lines */}
                <p className="whitespace-pre-line break-words text-sm leading-relaxed text-muted-foreground">
                  {service.description || t.noDescription}
                </p>

                {service.images?.length > 0 && (
                  <div className="min-w-0">
                    <ServicePhotoStrip name={service.name} images={service.images} />
                  </div>
                )}

                {/* Book: full width at the bottom on phones */}
                <Button asChild className="h-11 w-full sm:hidden">
                  <Link href={bookHref}>{t.bookNow}</Link>
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
        title={t.chatTitle(vendor.businessName)}
        description={t.chatDescription}
        peerId={vendor.user.id}
        contextService={selectedService || undefined}
        contextVendorBusinessName={vendor.businessName}
      />
    </>
  );
}
