"use client"

import { DataTable } from "@/components/data-table/data-table"
import { columns } from "./columns"
import { SubscriptionsToolbar } from "./subscriptions-toolbar"
import { type SubscriptionWithDetails } from "@/server-actions/subscriptions/get-subscriptions"

interface SubscriptionsTableProps {
  data: SubscriptionWithDetails[]
}

export const SubscriptionsTable = ({ data }: SubscriptionsTableProps) => (
  <DataTable
    columns={columns}
    data={data}
    toolbar={(table) => <SubscriptionsToolbar table={table} />}
  />
)
