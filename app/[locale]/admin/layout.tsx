import { getServerSession } from "next-auth/next";

import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DialogProvider } from "@/components/dialogs/DialogProvider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/server-actions/is-admin";
import { BaseLayoutProps } from "@/types/pageprops";
import { Toaster } from "sonner";

const AdminLayout = async ({ children }: BaseLayoutProps) => {
  const [isUserAdmin, session] = await Promise.all([
    isAdmin(),
    getServerSession(authOptions),
  ]);

  if (!isUserAdmin) {
    return <AdminAuthGuard isSignedIn={!!session} />;
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="h-svh max-h-svh overflow-hidden">
        <AdminHeader />
        <ScrollArea className="h-0 flex-1">
          <main className="mx-auto max-w-6xl px-6 py-6">
            {children}
          </main>
        </ScrollArea>
      </SidebarInset>
      <DialogProvider />
      <Toaster theme="dark" position="bottom-right" />
    </SidebarProvider>
  );
};

export default AdminLayout;
