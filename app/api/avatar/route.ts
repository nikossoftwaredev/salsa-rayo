import { NextRequest, NextResponse } from "next/server"

const CACHE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
const STALE_WHILE_REVALIDATE = 60 * 60 * 24 // 1 day

export const GET = async (request: NextRequest) => {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) return new NextResponse("Missing url parameter", { status: 400 })

  try {
    const decoded = decodeURIComponent(url)
    const parsed = new URL(decoded)

    const allowedHosts = ["lh3.googleusercontent.com", "googleusercontent.com"]
    if (!allowedHosts.some((h) => parsed.hostname.endsWith(h)))
      return new NextResponse("Host not allowed", { status: 403 })

    const response = await fetch(decoded, {
      next: { revalidate: CACHE_MAX_AGE },
    })

    if (!response.ok) return new NextResponse("Failed to fetch image", { status: 502 })

    const contentType = response.headers.get("content-type") || "image/jpeg"
    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=${STALE_WHILE_REVALIDATE}`,
      },
    })
  } catch {
    return new NextResponse("Invalid URL", { status: 400 })
  }
}
