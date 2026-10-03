
"use client";

import { useState } from "react";
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

export default function ServiceForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [pricingModel, setPricingModel] = useState("FIXED");

  const [occasions, setOccasions] = useState<string[]>([]);
  const [locationsCovered, setLocationsCovered] = useState<string[]>([]);
  const [includedItems, setIncludedItems] = useState<string[]>([]);
  const [includedInput, setIncludedInput] = useState("");

  const [minGuests, setMinGuests] = useState("");
  const [maxGuests, setMaxGuests] = useState("");

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
      const response = await fetch("/api/vendor/services", {
        method: "POST",
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
      });

      if (!response.ok) {
        throw new Error("Failed to create service");
      }

      toast.success("Service created successfully.");

      router.push("/dashboard/services");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-8 lg:grid-cols-3"
    >
      {/* Main form */}
      <div className="space-y-6 lg:col-span-2">
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

          <h1 className="text-3xl font-bold tracking-tight">
            Add New Service
          </h1>

          <p className="text-muted-foreground">
            Create a service listing for event organizers.
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

        <div className="flex justify-end gap-3">
          <Button variant="outline" type="button" asChild>
            <Link href="/dashboard/services">Cancel</Link>
          </Button>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Service"}
          </Button>
        </div>
      </div>

      {/* Summary sidebar */}
      <div className="space-y-6">
        <Card className="lg:sticky lg:top-6">
          <CardHeader>
            <CardTitle className="text-lg">
              Service Summary
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
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