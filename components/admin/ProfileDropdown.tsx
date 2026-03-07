"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { getInitials } from "@/lib/format";
import { IoHome, IoLogInOutline, IoLogOutOutline, IoPerson, IoCalendar, IoImages, IoHelpCircle } from "react-icons/io5";
import { MdAdminPanelSettings, MdInfo, MdAttachMoney, MdMenu, MdOutlineEdit } from "react-icons/md";
import { EditProfileSheet } from "@/components/EditProfileSheet";
import { GiOrbDirection } from "react-icons/gi";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { headerLinks } from "@/data/config";
import { LanguageSwitcherTabs } from "@/components/LanguageSwitcher";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

const NAV_ICONS: Record<string, ReactNode> = {
  "/#about": <MdInfo size={16} />,
  "/#schedule": <IoCalendar size={16} />,
  "/pricing": <MdAttachMoney size={16} />,
  "/#gallery": <IoImages size={16} />,
  "/faq": <IoHelpCircle size={16} />,
  "/orishas": <GiOrbDirection size={16} />,
};

interface ProfileDropdownProps {
  children?: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  showNavRoutes?: boolean;
}

export const ProfileDropdown = ({
  children,
  align = "end",
  side = "bottom",
  sideOffset = 4,
  showNavRoutes = false,
}: ProfileDropdownProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const locale = useLocale();
  const isOnAdmin = pathname.includes("/admin");
  const isAuthenticated = !!session;

  const fullName = session?.user?.name || "Admin";
  const firstName = fullName.split(" ")[0];
  const userImage = session?.user?.image;
  const userEmail = session?.user?.email || "";
  const userInitials = getInitials(fullName);

  const defaultTrigger = isAuthenticated ? (
    <Button variant="ghost" className="relative size-8 rounded-full">
      <Avatar className="size-8">
        {userImage && <AvatarImage src={userImage} alt={firstName} />}
        <AvatarFallback>{userInitials}</AvatarFallback>
      </Avatar>
    </Button>
  ) : (
    <Button
      variant="ghost"
      className="relative size-8 rounded-full"
      aria-label="Open menu"
    >
      <MdMenu size={20} />
    </Button>
  );

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {children || defaultTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64"
        align={align}
        side={side}
        sideOffset={sideOffset}
        forceMount
      >
        {/* User info — authenticated only */}
        {isAuthenticated && (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-center gap-2 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  {userImage && <AvatarImage src={userImage} alt={firstName} />}
                  <AvatarFallback className="rounded-lg text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid min-w-0 flex-1 leading-tight">
                  <span className="truncate font-semibold">{firstName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {userEmail}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Nav routes — mobile only */}
        {showNavRoutes && (
          <>
            <DropdownMenuGroup>
              {headerLinks.map((linkConfig) => (
                <DropdownMenuItem key={linkConfig.path} asChild>
                  <Link href={linkConfig.path}>
                    {NAV_ICONS[linkConfig.path]}
                    {linkConfig.text[locale as "en" | "el" | "es"] || linkConfig.text.en}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <LanguageSwitcherTabs />
            <DropdownMenuSeparator />
          </>
        )}

        {/* Profile / Admin / Home — authenticated only */}
        {isAuthenticated && (
          <>
            <DropdownMenuGroup>
              {session?.user?.id && (
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${session.user.id}`}>
                    <IoPerson size={16} />
                    Profile
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <MdOutlineEdit size={16} />
                Edit Profile
              </DropdownMenuItem>
              {isOnAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <IoHome size={16} />
                    Home
                  </Link>
                </DropdownMenuItem>
              )}
              {!isOnAdmin && session?.user?.isAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <MdAdminPanelSettings size={16} />
                    Admin
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
              <IoLogOutOutline size={16} />
              Sign out
            </DropdownMenuItem>
            {!showNavRoutes && (
              <>
                <DropdownMenuSeparator />
                <LanguageSwitcherTabs />
              </>
            )}
          </>
        )}

        {/* Sign in — unauthenticated only */}
        {!isAuthenticated && (
          <DropdownMenuItem onClick={() => signIn("google")}>
            <IoLogInOutline size={16} />
            Sign in
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
      {isAuthenticated && (
        <EditProfileSheet open={editOpen} onOpenChange={setEditOpen} />
      )}
    </DropdownMenu>
  );
};
