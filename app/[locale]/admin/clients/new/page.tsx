import { BasePageProps } from "@/types/pageprops"
import { ClientForm } from "@/components/admin/clients/ClientForm"

export default async function NewClientPage({ params }: BasePageProps) {
  const { locale } = await params
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Add New Client</h2>
      <div className="max-w-2xl">
        <ClientForm locale={locale} />
      </div>
    </div>
  )
}