import { getServerSession } from "next-auth/next";

import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DialogProvider } from "@/components/dialogs/DialogProvider";
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
        <div className="flex-1 overflow-y-auto">
          <main className="mx-auto min-w-0 max-w-6xl px-3 py-4 sm:px-6 sm:py-6">
            {children}
          </main>
        </div>
      </SidebarInset>
      <DialogProvider />
      <Toaster theme="dark" position="bottom-right" />
    </SidebarProvider>
  );
};

export default AdminLayout;
