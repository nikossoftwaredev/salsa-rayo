"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { IoLogOutOutline } from "react-icons/io5"
import { MdAdminPanelSettings } from "react-icons/md"
import { useRouter } from "next/navigation"

export const AuthButton = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
  }

  if (!session) {
    return (
      <Button 
        onClick={() => signIn("google")} 
        variant="ghost" 
        size="sm"
        className="text-muted-foreground hover:text-foreground border border-border/50 hover:border-border hover:bg-muted/50 transition-all duration-300"
      >
        Sign In
      </Button>
    )
  }

  const initials = session.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "?"

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user?.image || ""} alt={session.user?.name || ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {session.user.isAdmin && (
          <>
            <DropdownMenuItem onClick={() => router.push('/admin')}>
              <MdAdminPanelSettings className="mr-2 h-4 w-4" />
              <span>Admin</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={() => signOut()}>
          <IoLogOutOutline className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}