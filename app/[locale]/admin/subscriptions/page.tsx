import { SubscriptionsView } from "@/components/admin/subscriptions/SubscriptionsView"
import { getSubscriptions } from "@/server-actions/subscriptions/get-subscriptions"

const SubscriptionsPage = async () => {
  const result = await getSubscriptions()
  const subscriptions = result.success ? result.data ?? [] : []

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Subscriptions</h2>
        <p className="text-muted-foreground">
          Manage student subscriptions and track class usage.
        </p>
      </div>
      <SubscriptionsView data={subscriptions} />
    </div>
  )
}

export default SubscriptionsPage
