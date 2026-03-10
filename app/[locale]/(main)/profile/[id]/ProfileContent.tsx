"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IoCalendar, IoFlame, IoPencil, IoArrowRedoOutline, IoLogoInstagram, IoGlobeOutline, IoMusicalNotes } from "react-icons/io5";
import { RayoPoints } from "@/components/ui/rayo-points";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EditProfileSheet } from "@/components/EditProfileSheet";
import { getInitials } from "@/lib/format";
import { resolveAvatarSrc } from "@/lib/avatar";
import type { getProfile } from "@/server-actions/profile/get-profile";

type User = NonNullable<Awaited<ReturnType<typeof getProfile>>>;

interface ProfileContentProps {
  user: User;
  isOwnProfile?: boolean;
}

const BASE_STATS = [
  { key: "classes", icon: IoFlame, label: "Classes", color: "#fb923c" },
  { key: "joined", icon: IoCalendar, label: "Member Since", color: "#5b4fdb" },
] as const;

export const ProfileContent = ({ user, isOwnProfile = false }: ProfileContentProps) => {
  const fullName = user.name || user.student?.name || "Dancer";
  const userInitials = getInitials(fullName);

  const student = user.student;
  const totalClasses = student?._count.attendances ?? 0;
  const bio = student?.bio || "";
  const avatarSrc = resolveAvatarSrc(student?.avatarImage, user.image);

  const [editOpen, setEditOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const title = `${fullName} | Salsa Rayo`;

    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [fullName]);

  const statsValues = student
    ? [
        totalClasses,
        new Date(student.createdAt).toLocaleDateString(undefined, {
          month: "short",
          year: "numeric",
        }),
      ]
    : [];

  return (
    <div className="flex flex-col items-center px-6 pb-16">
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="rounded-full p-1 bg-gradient-to-br from-primary to-brand-pink shadow-[0_0_30px_rgba(91,79,219,0.3)]">
          <Avatar className="size-28 border-2 border-background">
            {avatarSrc && <AvatarImage src={avatarSrc} alt={fullName} />}
            <AvatarFallback className="text-3xl font-bold bg-card text-foreground">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </div>
      </motion.div>

      {/* Name + Rayo Points */}
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mt-5 flex items-center gap-2"
      >
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {fullName}
        </h1>
        {student && <RayoPoints points={student.rayoPoints} showPopover />}
      </motion.div>

      {/* Social Icons */}
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-2 flex items-center gap-0.5"
      >
        {student?.instagram && (
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={`https://instagram.com/${student.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center size-7 rounded-full text-muted-foreground/50 hover:text-pink-500 hover:bg-pink-500/10 transition-colors"
              >
                <IoLogoInstagram size={15} />
              </a>
            </TooltipTrigger>
            <TooltipContent>@{student.instagram}</TooltipContent>
          </Tooltip>
        )}
        {student?.website && (
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                href={student.website.startsWith("http") ? student.website : `https://${student.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center size-7 rounded-full text-muted-foreground/50 hover:text-primary hover:bg-primary/10 transition-colors"
              >
                <IoGlobeOutline size={15} />
              </a>
            </TooltipTrigger>
            <TooltipContent>{student.website}</TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleShare}
              className="inline-flex items-center justify-center size-7 rounded-full text-muted-foreground/50 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            >
              <IoArrowRedoOutline size={15} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            {copied ? "Link copied!" : "Share profile"}
          </TooltipContent>
        </Tooltip>
      </motion.div>

      {/* Bio */}
      {bio && (
        <motion.p
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-3 text-center text-sm text-muted-foreground leading-relaxed max-w-xs"
        >
          {bio}
        </motion.p>
      )}

      {/* Dancing Years */}
      {student?.dancingYears && (
        <motion.p
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground/70"
        >
          <IoMusicalNotes size={12} className="text-pink-500" />
          Dancing for {student.dancingYears} {student.dancingYears === 1 ? "year" : "years"}
        </motion.p>
      )}

      {/* Stats */}
      {student && (
        <div className="mt-10 grid grid-cols-2 gap-3 w-full max-w-xs">
          {BASE_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.key}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                className="rounded-xl border border-border/20 bg-card p-4"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon size={16} style={{ color: stat.color }} />
                  <span className="text-xs">{stat.label}</span>
                </div>
                <span className="mt-2 block text-lg font-bold text-foreground">
                  {statsValues[i]}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Edit Profile */}
      {isOwnProfile && (
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="mt-8"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
          >
            <IoPencil size={14} />
            Edit Profile
          </Button>
        </motion.div>
      )}
      {isOwnProfile && (
        <EditProfileSheet open={editOpen} onOpenChange={setEditOpen} />
      )}
    </div>
  );
};
