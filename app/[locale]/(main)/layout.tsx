import Header from "@/components/layout/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import {
  getDanceSchoolSchema,
  getWebSiteSchema,
  getInstructorSchemas,
  getServiceSchemas,
} from "@/lib/schema";
import { getStripePackages } from "@/lib/stripe/products";
import { PhonePromptBanner } from "@/components/PhonePromptBanner";
import { WelcomeConfetti } from "@/components/WelcomeConfetti";

const MainLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const stripePackages = await getStripePackages();

  return (
    <>
      <JsonLd
        data={[
          getDanceSchoolSchema(stripePackages),
          getWebSiteSchema(),
          ...getInstructorSchemas(),
          ...getServiceSchemas(),
        ]}
      />
      <Header />
      <PhonePromptBanner />
      <WelcomeConfetti />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <Footer />
    </>
  );
}

export default MainLayout
