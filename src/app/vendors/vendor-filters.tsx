"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type VendorFiltersProps = {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  location?: string;
  date?: string;
  guests?: string;
  type?: string;
};

export default function VendorFilters({
  category,
  minPrice,
  maxPrice,
  location,
  date,
  guests,
  type,
}: VendorFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Filter
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filter Vendors</DialogTitle>
          <DialogDescription>
            Refine by price, date, location, and more.
          </DialogDescription>
        </DialogHeader>

        <form
          action="/vendors"
          method="GET"
          className="space-y-4"
        >
          {/* Preserve category */}
          {category && category !== "All" && (
            <input
              type="hidden"
              name="category"
              value={category}
            />
          )}

          {/* Min / Max Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Min Price</Label>
              <Input
                type="number"
                name="minPrice"
                defaultValue={minPrice || ""}
              />
            </div>

            <div className="space-y-2">
              <Label>Max Price</Label>
              <Input
                type="number"
                name="maxPrice"
                defaultValue={maxPrice || ""}
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date Availability</Label>
            <Input
              type="date"
              name="date"
              defaultValue={date || ""}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              type="text"
              name="location"
              defaultValue={location || ""}
              placeholder="City or area"
            />
          </div>

          {/* Guests / Event Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Guest Size</Label>
              <Input
                type="number"
                name="guests"
                defaultValue={guests || ""}
                placeholder="e.g. 100"
              />
            </div>

            <div className="space-y-2">
              <Label>Event Type</Label>

              <Select
                name="type"
                defaultValue={type || undefined}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Wedding">
                    Wedding
                  </SelectItem>
                  <SelectItem value="Corporate">
                    Corporate
                  </SelectItem>
                  <SelectItem value="Birthday">
                    Birthday
                  </SelectItem>
                  <SelectItem value="Other">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <Link
              href="/vendors"
              onClick={() => setOpen(false)}
            >
              <Button type="button">
                Clear Filters
              </Button>
            </Link>

            <Button type="submit">
              Apply Filters
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}