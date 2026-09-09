"use client"

import { createContext, useContext } from "react"
import type { StripePackage } from "./types"

const StripePackagesContext = createContext<StripePackage[]>([])

interface StripePackagesProviderProps {
  packages: StripePackage[]
  children: React.ReactNode
}

/**
 * Makes the Stripe package list available to admin client components. Fetched
 * once per admin page render on the server, so dialogs and table rows never
 * fall back to hardcoded prices.
 */
export const StripePackagesProvider = ({ packages, children }: StripePackagesProviderProps) => (
  <StripePackagesContext.Provider value={packages}>{children}</StripePackagesContext.Provider>
)

export const useStripePackages = () => useContext(StripePackagesContext)

export const findPackageByName = (packages: StripePackage[], name: string) =>
  packages.find((p) => p.name === name)
