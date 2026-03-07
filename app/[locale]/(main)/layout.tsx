import Header from "@/components/layout/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getDanceSchoolSchema, getWebSiteSchema } from "@/lib/schema";

const MainLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <JsonLd data={[getDanceSchoolSchema(), getWebSiteSchema()]} />
      <Header />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <Footer />
    </>
  );
}

export default MainLayout
