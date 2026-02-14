import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(["ORGANIZER", "VENDOR"]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, role } = registerSchema.parse(body);

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
      },
    });

    // If vendor, create empty profile
    if (role === "VENDOR") {
      await prisma.vendorProfile.create({
        data: {
          userId: user.id,
          businessName: `${name}'s Business`,
          category: "Uncategorized",
          location: "Unknown",
        },
      });
    }

    return NextResponse.json(
      { message: "User created successfully", user: { id: user.id, email: user.email, role: user.role } },
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
