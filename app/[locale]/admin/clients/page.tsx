import { BasePageProps } from "@/types/pageprops"
import { ClientsTable } from "@/components/admin/clients/ClientsTable"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ClientsPage({ params }: BasePageProps) {
  const { locale } = await params
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Clients</h2>
        <Button asChild>
          <Link href={`/${locale}/admin/clients/new`}>Add Client</Link>
        </Button>
      </div>
      <ClientsTable />
    </div>
  )
}