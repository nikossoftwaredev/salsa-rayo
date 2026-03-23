"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { getInitials } from "@/lib/format";
import { Home, LogIn, LogOut, User, Calendar, Images, HelpCircle, Newspaper, ShieldCheck, Info, DollarSign, Menu, Pencil, Orbit } from "lucide-react";
import { EditProfileSheet } from "@/components/EditProfileSheet";
import { SignInDialog } from "@/components/SignInDialog";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { headerLinks } from "@/data/config";
import { LanguageSwitcherTabs } from "@/components/LanguageSwitcher";
import { UserCard } from "@/components/ui/user-card";

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
import { resolveAvatarSrc } from "@/lib/avatar";
import type { ReactNode } from "react";

const NAV_ICONS: Record<string, ReactNode> = {
  "/#about": <Info className="size-4" />,
  "/#schedule": <Calendar className="size-4" />,
  "/pricing": <DollarSign className="size-4" />,
  "/#gallery": <Images className="size-4" />,
  "/faq": <HelpCircle className="size-4" />,
  "/orishas": <Orbit className="size-4" />,
  "/blog": <Newspaper className="size-4" />,
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
  const [signInOpen, setSignInOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const locale = useLocale();
  const isOnAdmin = pathname.includes("/admin");
  const isAuthenticated = !!session;

  const fullName = session?.user?.name || session?.user?.email?.split("@")[0] || "";
  const firstName = fullName.split(" ")[0];
  const userImage = resolveAvatarSrc(session?.user?.avatarImage, session?.user?.image);
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
      <Menu className="size-5" />
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
            <DropdownMenuLabel className="font-normal overflow-hidden">
              <UserCard
                name={fullName}
                email={userEmail}
                image={userImage}
                subscriptionExpiresAt={session?.user?.subscriptionExpiresAt}
              />
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
          </>
        )}

        {/* Profile / Admin / Home — authenticated only */}
        {isAuthenticated && (
          <>
            <DropdownMenuGroup>
              {session?.user?.id && (
                <DropdownMenuItem asChild>
                  <Link href={`/profile/${session.user.id}`}>
                    <User className="size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Pencil className="size-4" />
                Edit Profile
              </DropdownMenuItem>
              {isOnAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <Home className="size-4" />
                    Home
                  </Link>
                </DropdownMenuItem>
              )}
              {!isOnAdmin && session?.user?.isAdmin && (
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <ShieldCheck className="size-4" />
                    Admin
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </>
        )}

        {/* Sign in — unauthenticated only */}
        {!isAuthenticated && (
          <DropdownMenuItem onClick={() => setSignInOpen(true)}>
            <LogIn className="size-4" />
            Sign in
          </DropdownMenuItem>
        )}

        {/* Language switcher — always at the bottom */}
        <DropdownMenuSeparator />
        <LanguageSwitcherTabs />
      </DropdownMenuContent>
      {isAuthenticated && (
        <EditProfileSheet open={editOpen} onOpenChange={setEditOpen} />
      )}
      <SignInDialog open={signInOpen} onOpenChange={setSignInOpen} />
    </DropdownMenu>
  );
};
