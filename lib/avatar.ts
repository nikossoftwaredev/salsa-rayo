export const getAvatarUrl = (imageUrl: string) =>
  `/api/avatar?url=${encodeURIComponent(imageUrl)}`

export const resolveAvatarSrc = (
  avatarImage: string | null | undefined,
  fallbackImage: string | null | undefined,
): string | undefined =>
  avatarImage || (fallbackImage ? getAvatarUrl(fallbackImage) : undefined)
