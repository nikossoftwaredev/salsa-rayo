"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { IoCheckmark, IoClose } from "react-icons/io5"
import { getClients } from "@/server-actions/clients/get-clients"

interface Client {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  isActive: boolean
  createdAt: Date
}

export const ClientsTable = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const result = await getClients()
      if (result.success && result.data) {
        setClients(result.data)
      } else {
        console.error("Error fetching clients:", result.error)
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Loading...</div>
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No clients found. Add your first client to get started.
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.name}</TableCell>
              <TableCell>{client.email}</TableCell>
              <TableCell>{client.company || "-"}</TableCell>
              <TableCell>{client.phone || "-"}</TableCell>
              <TableCell>
                {client.isActive ? (
                  <span className="flex items-center text-green-600">
                    <IoCheckmark className="mr-1" /> Active
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <IoClose className="mr-1" /> Inactive
                  </span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}