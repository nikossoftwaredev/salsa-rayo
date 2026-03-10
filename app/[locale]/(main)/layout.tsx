import Header from "@/components/layout/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getDanceSchoolSchema, getWebSiteSchema } from "@/lib/schema";
import { PhonePromptBanner } from "@/components/PhonePromptBanner";
import { WelcomeConfetti } from "@/components/WelcomeConfetti";

const MainLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <JsonLd data={[getDanceSchoolSchema(), getWebSiteSchema()]} />
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
