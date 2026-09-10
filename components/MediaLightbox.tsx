"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { X, Loader2 } from "lucide-react";

export type LightboxMedia =
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "video"; youtubeId: string; title?: string };

interface MediaLightboxProps {
  media: LightboxMedia | null;
  onClose: () => void;
}

/**
 * Full-screen viewer shared by the gallery, the schedule's instructor avatars
 * and the team section. Images get an optional caption (e.g. the teacher's
 * name) under the picture; videos play the YouTube embed.
 *
 * Portalled to <body>: rendered in place it would inherit its host section's
 * layout (the schedule's space-y margins shifted the page behind it) and a
 * transformed ancestor would stop `fixed` from covering the viewport.
 */
const MediaLightbox = ({ media, onClose }: MediaLightboxProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // Which image has settled (loaded or failed), so the spinner shows per image
  // without resetting state in an effect when `media` changes.
  const [settledSrc, setSettledSrc] = useState<string | null>(null);
  const isImageLoading = media?.type === "image" && settledSrc !== media.src;

  useEffect(() => {
    if (!media) return;

    // Move focus into the dialog, and hand it back to whatever opened it.
    const opener = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      // preventScroll: the page can be wheel-scrolled behind the backdrop, and
      // closing should not yank it back to the thumbnail
      opener?.focus?.({ preventScroll: true });
    };
  }, [media, onClose]);

  // Only ever non-null after a click, so `document` is always defined here.
  if (!media) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={media.type === "image" ? media.caption ?? media.alt : media.title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background hover:scale-110 transition-all duration-200 cursor-pointer"
        >
          <X className="size-6 text-foreground" />
        </button>

        {media.type === "video" ? (
          <div className="relative w-full max-w-6xl aspect-video">
            <iframe
              className="absolute inset-0 w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${media.youtubeId}?autoplay=1`}
              title={media.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : (
          <>
            {isImageLoading && (
              <div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                <Loader2 className="size-12 animate-spin text-primary" />
              </div>
            )}
            <figure className="relative flex flex-col items-center gap-4">
              <Image
                key={media.src}
                src={media.src}
                alt={media.alt}
                width={2400}
                height={2400}
                className={twMerge(
                  "max-w-full w-auto h-auto object-contain rounded-lg transition-opacity duration-300",
                  media.caption ? "max-h-[80vh]" : "max-h-[90vh]",
                  isImageLoading ? "opacity-0" : "opacity-100"
                )}
                quality={100}
                priority
                onLoad={() => setSettledSrc(media.src)}
                // A broken URL (instructor photos are typed into the admin)
                // must not leave the spinner up and the caption hidden forever
                onError={() => setSettledSrc(media.src)}
              />
              {media.caption && !isImageLoading && (
                <figcaption className="px-5 py-2 rounded-full bg-background/80 backdrop-blur-md border border-border/50 text-lg font-semibold text-foreground">
                  {media.caption}
                </figcaption>
              )}
            </figure>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default MediaLightbox;
