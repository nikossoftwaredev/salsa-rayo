import { BasePageProps } from "@/types/pageprops"
import { prisma } from "@/lib/db"

export default async function AdminDashboard({ params }: BasePageProps) {
  // Get actual client count from database
  const clientCount = await prisma.client.count()
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Total Clients</h3>
          <p className="text-3xl font-bold text-primary">{clientCount}</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Active Products</h3>
          <p className="text-3xl font-bold text-primary">0</p>
        </div>
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-primary">0</p>
        </div>
      </div>
    </div>
  )
}