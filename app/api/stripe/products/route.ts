import { NextResponse } from "next/server"
import { listActiveProducts } from "@/lib/stripe/products"

export const GET = async () => {
  try {
    const products = await listActiveProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("[Stripe Products]", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}
