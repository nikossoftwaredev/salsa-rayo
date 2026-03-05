"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IoCalendar, IoFlame, IoFlash, IoPencil, IoCheckmark, IoClose } from "react-icons/io5";
import { updateBio } from "@/server-actions/profile/update-bio";
import type { getProfile } from "@/server-actions/profile/get-profile";

type User = NonNullable<Awaited<ReturnType<typeof getProfile>>>;

interface ProfileContentProps {
  user: User;
  isOwnProfile?: boolean;
}

const BIO_MAX_LENGTH = 150;

const STATS_CONFIG = [
  { key: "classes", icon: IoFlame, label: "Classes", color: "#fb923c" },
  { key: "joined", icon: IoCalendar, label: "Joined", color: "#5b4fdb" },
] as const;

export const ProfileContent = ({ user, isOwnProfile = false }: ProfileContentProps) => {
  const fullName = user.name || user.student?.name || "Dancer";
  const userInitials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const student = user.student;
  const totalClasses = student?._count.attendances ?? 0;

  const [bio, setBio] = useState(student?.bio || "");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioValue, setBioValue] = useState(bio);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleEditBio = useCallback(() => {
    setBioValue(bio);
    setIsEditingBio(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }, [bio]);

  const handleCancelBio = useCallback(() => {
    setIsEditingBio(false);
    setBioValue(bio);
  }, [bio]);

  const handleSaveBio = useCallback(async () => {
    setIsSaving(true);
    try {
      await updateBio(bioValue);
      setBio(bioValue.trim().slice(0, BIO_MAX_LENGTH));
      setIsEditingBio(false);
    } catch {
      // silent fail — keep editing state
    } finally {
      setIsSaving(false);
    }
  }, [bioValue]);

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
        className="relative"
      >
        <div className="rounded-full p-1 bg-gradient-to-br from-primary to-brand-pink shadow-[0_0_30px_rgba(91,79,219,0.3)]">
          <Avatar className="size-28 border-2 border-background">
            {user.image && <AvatarImage src={user.image} alt={fullName} />}
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
        {student && (
          <span className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
            <IoFlash size={14} />
            {student.rayoPoints}
          </span>
        )}
      </motion.div>

      {/* Bio */}
      <motion.div
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="mt-2 min-h-[2rem] text-center max-w-xs"
      >
        {isEditingBio ? (
          <div className="space-y-2">
            <textarea
              ref={textareaRef}
              value={bioValue}
              onChange={(e) => setBioValue(e.target.value.slice(0, BIO_MAX_LENGTH))}
              placeholder="Tell us about yourself..."
              className="w-full resize-none rounded-lg border border-border/50 bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              rows={3}
              maxLength={BIO_MAX_LENGTH}
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {bioValue.length}/{BIO_MAX_LENGTH}
              </span>
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleCancelBio}
                  disabled={isSaving}
                >
                  <IoClose size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={handleSaveBio}
                  disabled={isSaving}
                  className="text-primary hover:text-primary"
                >
                  <IoCheckmark size={14} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5">
            {bio && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {bio}
              </p>
            )}
            {!bio && isOwnProfile && (
              <p className="text-sm text-muted-foreground/40 italic">
                Add a bio...
              </p>
            )}
            {isOwnProfile && (
              <button
                onClick={handleEditBio}
                className="inline-flex items-center justify-center size-5 rounded-full text-muted-foreground/40 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
              >
                <IoPencil size={10} />
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Stats */}
      {student && (
        <div className="mt-10 grid grid-cols-2 gap-3 w-full max-w-xs">
          {STATS_CONFIG.map((stat, i) => {
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
    </div>
  );
};
