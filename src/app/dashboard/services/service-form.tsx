"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImagePlus, Loader2, Star, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EVENT_CATEGORIES = [
  "Wedding",
  "Birthday",
  "Corporate",
  "Anniversary",
  "Engagement",
  "Graduation",
  "Baby Shower",
  "Private Party",
  "Festival",
  "Other",
];

const MALAYSIAN_STATES = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Kuala Lumpur",
  "Labuan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Penang",
  "Perak",
  "Perlis",
  "Putrajaya",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
];

const PRICING_MODELS = [
  { value: "FIXED", label: "Fixed Price" },
  { value: "PER_HOUR", label: "Per Hour" },
  { value: "PER_PAX", label: "Per Guest (Pax)" },
  { value: "PER_DAY", label: "Per Day" },
  { value: "CUSTOM", label: "Custom / Quote" },
];

const MAX_PHOTOS = 8;
const MAX_FILE_MB = 5;

/** Uploads one image with your existing /api/upload route (same as the profile photos). */
async function uploadImage(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file");
  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    throw new Error(`Images must be smaller than ${MAX_FILE_MB} MB`);
  }
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to upload image");
  }
  const json = await res.json();
  if (!json?.url) throw new Error("Upload succeeded but no URL returned");
  return json.url as string;
}

/** The saved service, when editing. Leave it out to create a new one. */
export type EditableService = {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  pricingModel: string;
  occasions: string | null;
  locationsCovered: string[];
  includedItems: string[];
  minGuests: number | null;
  maxGuests: number | null;
  /** Photo URLs in order; the first one is the cover */
  images?: string[];
};

export default function ServiceForm({ service }: { service?: EditableService }) {
  const router = useRouter();
  const isEditing = Boolean(service);

  const [isLoading, setIsLoading] = useState(false);

  // Everything starts from the saved values when editing, or empty when creating
  const [name, setName] = useState(service?.name ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [basePrice, setBasePrice] = useState(
    service ? String(service.basePrice ?? "") : ""
  );
  const [pricingModel, setPricingModel] = useState(service?.pricingModel || "FIXED");

  const [occasions, setOccasions] = useState<string[]>(
    (service?.occasions ?? "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean)
  );
  const [locationsCovered, setLocationsCovered] = useState<string[]>(
    service?.locationsCovered ?? []
  );
  const [includedItems, setIncludedItems] = useState<string[]>(
    service?.includedItems ?? []
  );
  const [includedInput, setIncludedInput] = useState("");

  const [minGuests, setMinGuests] = useState(
    service?.minGuests != null ? String(service.minGuests) : ""
  );
  const [maxGuests, setMaxGuests] = useState(
    service?.maxGuests != null ? String(service.maxGuests) : ""
  );

  /* ---------- Photos (max 8, first = cover) ---------- */

  const [photos, setPhotos] = useState<string[]>((service?.images ?? []).slice(0, MAX_PHOTOS));
  const [uploading, setUploading] = useState(0);
  const photoInput = useRef<HTMLInputElement>(null);

  async function onPhotosChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const files: File[] = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;

    const room = MAX_PHOTOS - photos.length - uploading;
    if (room <= 0) {
      toast.error(`You can add up to ${MAX_PHOTOS} photos`);
      return;
    }
    const batch = files.slice(0, room);
    if (files.length > room) toast.message(`Only the first ${room} photo(s) were added`);

    setUploading((n) => n + batch.length);
    for (const file of batch) {
      try {
        const url = await uploadImage(file);
        setPhotos((current) =>
          current.length >= MAX_PHOTOS || current.includes(url) ? current : [...current, url]
        );
      } catch (err) {
        toast.error(`${file.name}: ${(err as Error).message}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
  }

  const removePhoto = (index: number) =>
    setPhotos((current) => current.filter((_, i) => i !== index));

  const movePhoto = (index: number, dir: -1 | 1) =>
    setPhotos((current) => {
      const target = index + dir;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const makeCover = (index: number) =>
    setPhotos((current) => {
      const next = [...current];
      const [picked] = next.splice(index, 1);
      return [picked, ...next];
    });

  /** Saves the photo list for a service (replaces whatever was there). */
  async function savePhotos(serviceId: string) {
    const res = await fetch(`/api/vendor/services/${serviceId}/images`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls: photos }),
    });
    if (!res.ok) throw new Error("Service saved, but the photos could not be saved");
  }

  const toggleItem = (
    value: string,
    selected: string[],
    setter: (values: string[]) => void
  ) => {
    setter(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value]
    );
  };

  const addIncludedItem = () => {
    const item = includedInput.trim();

    if (!item) return;

    if (includedItems.includes(item)) {
      toast.error("This item has already been added.");
      return;
    }

    setIncludedItems((prev) => [...prev, item]);
    setIncludedInput("");
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!name.trim() || name.trim().length < 2) {
      toast.error("Service name must be at least 2 characters.");
      return;
    }

    if (occasions.length === 0) {
      toast.error("Please select at least one event category.");
      return;
    }

    if (
      minGuests &&
      maxGuests &&
      Number(maxGuests) < Number(minGuests)
    ) {
      toast.error("Maximum guests must be greater than minimum guests.");
      return;
    }

    setIsLoading(true);

    try {
      // Same API the old edit dialog used: PUT to update, POST to create
      const response = await fetch(
        isEditing ? `/api/vendor/services/${service!.id}` : "/api/vendor/services",
        {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          description,
          basePrice: Number(basePrice || 0),
          pricingModel,
          occasions: occasions.join(", "),
          locationsCovered,
          includedItems,
          minGuests: minGuests ? Number(minGuests) : null,
          maxGuests: maxGuests ? Number(maxGuests) : null,
        }),
        }
      );

      if (!response.ok) {
        throw new Error(isEditing ? "Failed to update service" : "Failed to create service");
      }

      // Then save the photos against the service (new services: use the id the API returns)
      const saved = await response.json().catch(() => null);
      const serviceId: string | undefined =
        service?.id ?? saved?.id ?? saved?.service?.id;

      if (serviceId) {
        await savePhotos(serviceId);
      } else if (photos.length > 0) {
        toast.message("Service created. Open it with Edit to add your photos.");
      }

      toast.success(isEditing ? "Service updated." : "Service created successfully.");

      router.push("/dashboard/services");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error && error.message.startsWith("Service saved")
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-8 lg:grid-cols-3"
    >
      {/* Main form */}
      <div className="min-w-0 space-y-6 lg:col-span-2">
        <div className="space-y-2">
          <Button
            type="button"
            variant="ghost"
            asChild
            className="-ml-4"
          >
            <Link href="/dashboard/services">
              ← Back to Services
            </Link>
          </Button>

          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            {isEditing ? "Edit service" : "Add new service"}
          </h1>

          <p className="text-muted-foreground">
            {isEditing
              ? "Update the details planners see for this service."
              : "Create a service listing for event organizers."}
          </p>
        </div>

        {/* Basic information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Basic Information
            </CardTitle>
            <CardDescription>
              Tell organizers what service you offer.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wedding Photography"
                required
                minLength={2}
                className="h-11"
              />
            </div>

            <div className="space-y-3">
              <Label>Suitable For</Label>

              <div className="flex flex-wrap gap-2">
                {EVENT_CATEGORIES.map((occasion) => (
                  <Button
                    key={occasion}
                    type="button"
                    variant={
                      occasions.includes(occasion)
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      toggleItem(
                        occasion,
                        occasions,
                        setOccasions
                      )
                    }
                    className="rounded-full"
                  >
                    {occasion}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your service..."
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg">Photos</CardTitle>
                <CardDescription>
                  Add up to {MAX_PHOTOS} photos. The first one is the cover planners see first.
                  Listings with 3 or more photos get far more bookings.
                </CardDescription>
              </div>
              <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">
                {photos.length}/{MAX_PHOTOS}
              </span>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {photos.map((url, i) => (
                <div
                  key={url}
                  className={
                    "relative aspect-square overflow-hidden rounded-xl " +
                    (i === 0 ? "ring-2 ring-brand ring-offset-2 ring-offset-card" : "border border-border")
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />

                  <span
                    className={
                      "absolute left-1.5 top-1.5 rounded-full px-2 py-0.5 text-[11px] font-bold " +
                      (i === 0 ? "bg-brand text-brand-foreground" : "bg-black/60 text-white")
                    }
                  >
                    {i === 0 ? "Cover" : i + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    aria-label="Remove photo"
                    className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/75"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>

                  {/* Move left · make cover · move right */}
                  <div className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-between gap-1">
                    <button
                      type="button"
                      onClick={() => movePhoto(i, -1)}
                      disabled={i === 0}
                      aria-label="Move left"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-30"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {i !== 0 && (
                      <button
                        type="button"
                        onClick={() => makeCover(i)}
                        className="inline-flex h-7 items-center gap-1 rounded-full bg-black/60 px-2 text-[11px] font-semibold text-white"
                      >
                        <Star className="h-3 w-3" />
                        Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => movePhoto(i, 1)}
                      disabled={i === photos.length - 1}
                      aria-label="Move right"
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-30"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {Array.from({ length: uploading }).map((_, i) => (
                <div
                  key={`uploading-${i}`}
                  className="flex aspect-square items-center justify-center rounded-xl border border-border bg-muted/40"
                >
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ))}

              {photos.length + uploading < MAX_PHOTOS && (
                <button
                  type="button"
                  onClick={() => photoInput.current?.click()}
                  className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ImagePlus className="h-6 w-6" />
                  {photos.length === 0 ? "Add photos" : "Add more"}
                </button>
              )}
            </div>

            <input
              ref={photoInput}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={onPhotosChosen}
            />
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pricing</CardTitle>
            <CardDescription>
              Choose how your service is priced.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-3">
              <Label>Pricing Model</Label>

              <Select
                value={pricingModel}
                onValueChange={setPricingModel}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select pricing model" />
                </SelectTrigger>

                <SelectContent>
                  {PRICING_MODELS.map((model) => (
                    <SelectItem
                      key={model.value}
                      value={model.value}
                    >
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="basePrice">
                Base Price (RM)
              </Label>

              <Input
                id="basePrice"
                type="number"
                min={0}
                step="0.01"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                placeholder="e.g. 250"
                className="h-11"
                required
              />

              <p className="text-xs text-muted-foreground">
                {pricingModel === "FIXED"
                  ? "Enter the total fixed price."
                  : pricingModel === "PER_HOUR"
                    ? "Enter the price per hour."
                    : pricingModel === "PER_PAX"
                      ? "Enter the price per guest."
                      : pricingModel === "PER_DAY"
                        ? "Enter the price per day."
                        : "Enter a starting price for custom quotations."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Locations Covered
            </CardTitle>
            <CardDescription>
              Select all Malaysian states and federal territories
              where you provide your service.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {MALAYSIAN_STATES.map((state) => (
                <label
                  key={state}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm hover:bg-muted/50"
                >
                  <input
                    type="checkbox"
                    checked={locationsCovered.includes(state)}
                    onChange={() =>
                      toggleItem(
                        state,
                        locationsCovered,
                        setLocationsCovered
                      )
                    }
                    className="h-4 w-4 accent-primary"
                  />
                  {state}
                </label>
              ))}
            </div>

            {locationsCovered.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {locationsCovered.map((state) => (
                  <Badge key={state} variant="secondary">
                    {state}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Package details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Package Details
            </CardTitle>
            <CardDescription>
              Explain what's included and the guest capacity.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>What's Included?</Label>

              <div className="flex gap-2">
                <Input
                  value={includedInput}
                  onChange={(e) => setIncludedInput(e.target.value)}
                  placeholder="e.g. 4 hours of photography"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addIncludedItem();
                    }
                  }}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={addIncludedItem}
                >
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {includedItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm"
                  >
                    <span>{item}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setIncludedItems((prev) =>
                          prev.filter((value) => value !== item)
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Guest Capacity</Label>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minGuests" className="text-sm">
                    Minimum Guests
                  </Label>
                  <Input
                    id="minGuests"
                    type="number"
                    min={0}
                    value={minGuests}
                    onChange={(e) => setMinGuests(e.target.value)}
                    placeholder="e.g. 50"
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxGuests" className="text-sm">
                    Maximum Guests
                  </Label>
                  <Input
                    id="maxGuests"
                    type="number"
                    min={0}
                    value={maxGuests}
                    onChange={(e) => setMaxGuests(e.target.value)}
                    placeholder="e.g. 300"
                    className="h-11"
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Leave either field empty if there is no limit.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" type="button" asChild className="h-11 w-full sm:w-auto">
            <Link href="/dashboard/services">Cancel</Link>
          </Button>

          <Button type="submit" disabled={isLoading || uploading > 0} className="h-11 w-full sm:w-auto">
            {uploading > 0
              ? "Uploading photos..."
              : isLoading
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Save Service"}
          </Button>
        </div>
      </div>

      {/* Summary sidebar */}
      <div className="hidden min-w-0 space-y-6 lg:block">
        <Card className="lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle className="text-lg">
              Service Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {photos[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photos[0]} alt="" className="aspect-[16/10] w-full rounded-xl object-cover" />
            )}
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Service Name
              </p>
              <p className="font-semibold">
                {name || "Your service name"}
              </p>
            </div>

            <div className="border-t pt-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Pricing
              </p>
              <p className="mt-2 text-2xl font-bold text-primary">
                RM {Number(basePrice || 0).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                {PRICING_MODELS.find(
                  (model) => model.value === pricingModel
                )?.label}
              </p>
            </div>

            <div className="border-t pt-4">
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                Locations
              </p>
              <div className="flex flex-wrap gap-2">
                {locationsCovered.length > 0 ? (
                  locationsCovered.map((state) => (
                    <Badge key={state} variant="secondary">
                      {state}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No locations selected
                  </p>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                Guest Capacity
              </p>
              <p className="text-sm">
                {minGuests || "—"} – {maxGuests || "—"} guests
              </p>
            </div>

            <div className="rounded-xl bg-muted/60 p-4 text-xs leading-relaxed text-muted-foreground">
              Your service details will be saved to your vendor profile.
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}