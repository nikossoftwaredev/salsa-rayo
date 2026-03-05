"use client";

import { AuthButton } from "@/components/AuthButton";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const AdminHeader = () => {
  return (
    <header className="z-50 flex h-16 shrink-0 items-center">
      <div className="relative flex h-full w-full items-center gap-3 p-4 sm:gap-4">
        <SidebarTrigger variant="outline" className="max-md:scale-125" />
        <Separator orientation="vertical" className="h-6" />
        <div className="flex-1" />
        <AuthButton />
      </div>
    </header>
  );
};
