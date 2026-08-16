import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export const runtime = "nodejs";
export const maxDuration = 30;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
]);

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

function extFor(mime: string, fallbackName: string): string {
  const fromName = path.extname(fallbackName || "").toLowerCase();
  if (fromName && /^\.[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  switch (mime) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/gif":
      return ".gif";
    case "image/webp":
      return ".webp";
    case "image/heic":
      return ".heic";
    default:
      return ".bin";
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "ORGANIZER" && session.user.role !== "VENDOR") {
      return NextResponse.json(
        { error: "Only organizers and vendors can upload" },
        { status: 403 }
      );
    }

    const ct = req.headers.get("content-type") || "";
    if (!ct.toLowerCase().startsWith("multipart/form-data")) {
      return NextResponse.json(
        { error: "Expected multipart/form-data" },
        { status: 400 }
      );
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file || typeof (file as any).arrayBuffer !== "function") {
      return NextResponse.json(
        { error: "Missing 'file' field in form" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        {
          error:
            "Unsupported file type. Allowed: JPG, PNG, GIF, WEBP, HEIC.",
        },
        { status: 415 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large. Max 8 MB." },
        { status: 413 }
      );
    }

    const now = new Date();
    const yyyyMm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    const relDir = `uploads/messages/${yyyyMm}`;
    const absDir = path.join(process.cwd(), "public", relDir);
    if (!existsSync(absDir)) {
      await mkdir(absDir, { recursive: true });
    }

    const id = randomUUID().replace(/-/g, "");
    const ext = extFor(file.type, file.name || "");
    const fileName = `${id}${ext}`;
    const relPath = `/${relDir}/${fileName}`;
    const absPath = path.join(absDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(absPath, buffer);

    return NextResponse.json(
      {
        url: relPath,
        name: file.name || null,
        size: file.size,
        type: file.type,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/upload] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
