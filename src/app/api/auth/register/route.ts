import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";

const MALAYSIAN_STATES = [
  "Johor", "Kedah", "Kelantan", "Melaka", "Negeri Sembilan", "Pahang",
  "Perak", "Perlis", "Pulau Pinang", "Sabah", "Sarawak", "Selangor",
  "Terengganu", "Kuala Lumpur", "Labuan", "Putrajaya",
] as const;

const BUSINESS_TYPES = [
  "Photography", "Venues", "Food Catering", "Decorations & Venue Setup",
  "Entertainment", "Logistics", "Guest Management", "Attire & Styling",
] as const;

const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
    role: z.enum(["ORGANIZER", "VENDOR"]),
    phoneNumber: z
      .string()
      .min(8)
      .regex(/^[0-9+\-\s()]+$/, "Invalid phone number"),
    location: z.enum(MALAYSIAN_STATES),
    description: z.string().optional(),
    category: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "VENDOR") {
      if (!data.category || !BUSINESS_TYPES.includes(data.category as any)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["category"],
          message: "A valid business type is required",
        });
      }
      if (!data.description || data.description.trim().length < 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["description"],
          message: "Business description must be at least 20 characters",
        });
      }
    }
  });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      password,
      name,
      role,
      phoneNumber,
      location,
      description,
      category,
    } = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role,
        phoneNumber,
        location,
        ...(role === "VENDOR" && {
          vendorProfile: {
            create: {
              businessName: name,
              description: description ?? null,
              category: category!,
              location,
              phoneNumber,
            },
          },
        }),
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: { id: user.id, email: user.email, role: user.role },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}