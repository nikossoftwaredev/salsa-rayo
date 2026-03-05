"use client";

import { signOut, useSession } from "next-auth/react";
import { IoHome, IoLogOutOutline, IoPerson } from "react-icons/io5";
import { MdAdminPanelSettings } from "react-icons/md";
import { usePathname } from "next/navigation";

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

interface ProfileDropdownProps {
  children?: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

export const ProfileDropdown = ({
  children,
  align = "end",
  side = "bottom",
  sideOffset = 4,
}: ProfileDropdownProps) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isOnAdmin = pathname.includes("/admin");

  const fullName = session?.user?.name || "Admin";
  const firstName = fullName.split(" ")[0];
  const userImage = session?.user?.image;
  const userEmail = session?.user?.email || "";
  const userInitials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const defaultTrigger = (
    <Button variant="ghost" className="relative size-8 rounded-full">
      <Avatar className="size-8">
        {userImage && <AvatarImage src={userImage} alt={firstName} />}
        <AvatarFallback>{userInitials}</AvatarFallback>
      </Avatar>
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
        <DropdownMenuGroup>
          {session?.user?.id && (
            <DropdownMenuItem asChild>
              <Link href={`/profile/${session.user.id}`}>
                <IoPerson size={16} />
                Profile
              </Link>
            </DropdownMenuItem>
          )}
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
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
          <IoLogOutOutline size={16} />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
