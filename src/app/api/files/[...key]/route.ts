import { getCloudflareContext } from "@opennextjs/cloudflare"

/**
 * GET /api/files/<key>
 * Serves an uploaded image from R2. Images never change (each upload gets a new
 * random name), so browsers and Cloudflare can cache them for a year.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key: parts } = await params
  const key = (parts ?? []).join("/")

  // Only serve things the upload route created
  if (!key.startsWith("uploads/") || key.includes("..")) {
    return new Response("Not found", { status: 404 })
  }

  const { env } = await getCloudflareContext({ async: true })
  const bucket = (env as unknown as { UPLOADS?: R2Bucket }).UPLOADS
  if (!bucket) return new Response("Uploads are not set up", { status: 500 })

  const object = await bucket.get(key)
  if (!object) return new Response("Not found", { status: 404 })

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set("etag", object.httpEtag)
  if (!headers.has("cache-control")) {
    headers.set("cache-control", "public, max-age=31536000, immutable")
  }

  if (req.headers.get("if-none-match") === object.httpEtag) {
    return new Response(null, { status: 304, headers })
  }

  return new Response(object.body, { headers })
}
