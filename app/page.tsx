import SocialsSection from "@/components/SocialsSection";

export const revalidate = 0;

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-2 bg-base-100 gap-16 max-w-xl">
      <SocialsSection />
    </main>
  );
}
