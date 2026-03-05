import Header from "@/components/layout/Header";
import Footer from "@/components/Footer";

const MainLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <Footer />
    </>
  );
}

export default MainLayout
