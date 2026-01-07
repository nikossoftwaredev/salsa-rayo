import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { isAdmin } from "@/server-actions/is-admin";
import { BaseLayoutProps } from "@/types/pageprops";

export default async function AdminLayout({
  children,
  params,
}: BaseLayoutProps) {
  const { locale } = await params;
  const isUserAdmin = await isAdmin();
  
  if (!isUserAdmin) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Whoops!</h1>
          <p className="text-muted-foreground">You are not an admin.</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AdminSidebar locale={locale} />
        <main className="flex-1 overflow-y-auto">
          <div className="flex items-center gap-2 border-b px-4 py-2">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
