import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import BackgroundEffects from "@/components/BackgroundEffects";
import { CheckoutConfetti } from "./CheckoutConfetti";
import { getTranslations } from "next-intl/server";

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

const CheckoutSuccessPage = async ({
  searchParams,
}: CheckoutSuccessPageProps) => {
  const { session_id } = await searchParams;
  const t = await getTranslations("CheckoutSuccess");

  if (!session_id) redirect("/pricing");

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items.data.price.product"],
    });
  } catch {
    redirect("/pricing");
  }

  if (session.payment_status !== "paid") redirect("/pricing");

  const lineItem = session.line_items?.data[0];
  const product = lineItem?.price?.product as import("stripe").Stripe.Product | undefined;
  const studentId = session.metadata?.studentId;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <BackgroundEffects />
      <CheckoutConfetti />
      <div className="relative pt-32 pb-16 px-4 md:px-8 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-lg mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-brand-pink flex items-center justify-center">
              <Zap className="size-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t("title")}
          </h1>

          {product && (
            <p className="text-xl text-muted-foreground mb-2">
              {product.name}
            </p>
          )}

          <p className="text-muted-foreground mb-8">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {studentId && (
              <Button variant="gradient" asChild>
                <Link href={`/profile/${studentId}`}>{t("viewProfile")}</Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/#schedule">{t("viewSchedule")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
