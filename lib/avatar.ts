export const getAvatarUrl = (imageUrl: string) =>
  `/api/avatar?url=${encodeURIComponent(imageUrl)}`
