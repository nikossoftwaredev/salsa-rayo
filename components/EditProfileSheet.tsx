"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { IoPersonOutline, IoCallOutline, IoLogoInstagram, IoGlobeOutline } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { updateProfile } from "@/server-actions/profile/update-profile";
import { getOwnProfile } from "@/server-actions/profile/get-own-profile";
import { toast } from "sonner";
import { BIO_MAX_LENGTH } from "@/data/config";
import { orishas } from "@/data/orishas";
import { cn } from "@/lib/utils";

interface ProfileData {
  name: string;
  bio: string;
  phone: string;
  instagram: string;
  website: string;
  avatarImage: string | null;
}

interface EditProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FIELDS = [
  { key: "name", label: "Name", icon: IoPersonOutline, placeholder: "Your name", maxLength: 100 },
  { key: "phone", label: "Phone", icon: IoCallOutline, placeholder: "+30 000 000 0000", maxLength: 20 },
  { key: "instagram", label: "Instagram", icon: IoLogoInstagram, placeholder: "username", maxLength: 50 },
  { key: "website", label: "Website", icon: IoGlobeOutline, placeholder: "https://yoursite.com", maxLength: 200 },
] as const;

const AVATAR_OPTIONS = [
  { id: "default", name: "Default", image: null },
  ...orishas.map((o) => ({ id: o.id, name: o.name, image: o.image })),
];

const EMPTY_FORM: ProfileData = { name: "", bio: "", phone: "", instagram: "", website: "", avatarImage: null };

export const EditProfileSheet = ({ open, onOpenChange }: EditProfileSheetProps) => {
  const [form, setForm] = useState<ProfileData>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const isMountedRef = useRef(true);

  const handleChange = useCallback((key: keyof ProfileData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await updateProfile(form);
      toast.success("Profile updated!");
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Failed to update profile");
    } finally {
      if (isMountedRef.current) setIsSaving(false);
    }
  }, [form, onOpenChange, router]);

  useEffect(() => {
    isMountedRef.current = true;

    if (!open) return;

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const data = await getOwnProfile();
        if (!isMountedRef.current) return;

        if (data) {
          setForm({
            name: data.name || "",
            bio: data.bio || "",
            phone: data.phone || "",
            instagram: data.instagram || "",
            website: data.website || "",
            avatarImage: data.avatarImage || null,
          });
        }
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMountedRef.current = false;
    };
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MdOutlineEdit size={18} />
            Edit Profile
          </SheetTitle>
          <SheetDescription>
            Update your profile information
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto px-4">
          {isLoading ? (
            <div className="space-y-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Avatar Picker */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">
                  Profile Avatar
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-3 cursor-pointer rounded-lg border border-border/50 px-3 py-2 transition-colors hover:bg-accent"
                    >
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-full border-2 border-primary/30">
                        {form.avatarImage ? (
                          <Image
                            src={form.avatarImage}
                            alt="Avatar"
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center bg-muted text-xs text-muted-foreground">
                            ?
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {AVATAR_OPTIONS.find((o) => o.image === form.avatarImage)?.name || "Default"}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" side="bottom" className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {AVATAR_OPTIONS.map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, avatarImage: option.image }))}
                          className={cn(
                            "relative size-12 cursor-pointer overflow-hidden rounded-full border-2 transition-all hover:scale-110",
                            form.avatarImage === option.image
                              ? "border-primary ring-2 ring-primary/30"
                              : "border-border/30 hover:border-border"
                          )}
                        >
                          {option.image ? (
                            <Image
                              src={option.image}
                              alt={option.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center bg-muted text-[9px] text-muted-foreground">
                              Default
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {FIELDS.map(({ key, label, icon: Icon, placeholder, maxLength }) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={key} className="text-xs text-muted-foreground">
                    {label}
                  </Label>
                  <div className="relative">
                    <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id={key}
                      value={form[key]}
                      onChange={(e) => handleChange(key, e.target.value.slice(0, maxLength))}
                      placeholder={placeholder}
                      className="pl-9"
                    />
                  </div>
                </div>
              ))}

              <div className="space-y-1.5">
                <Label htmlFor="bio" className="text-xs text-muted-foreground">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={form.bio}
                  onChange={(e) => handleChange("bio", e.target.value.slice(0, BIO_MAX_LENGTH))}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="resize-none"
                />
                <span className="text-xs text-muted-foreground">
                  {form.bio.length}/{BIO_MAX_LENGTH}
                </span>
              </div>
            </>
          )}
        </div>

        <SheetFooter>
          <Button
            variant="gradient"
            size="lg"
            onClick={handleSave}
            disabled={isSaving || isLoading || !form.name.trim()}
            className="w-full"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
