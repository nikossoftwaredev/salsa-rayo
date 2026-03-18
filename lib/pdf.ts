export const openPdfInNewTab = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to generate PDF")
  const blob = await res.blob()
  const blobUrl = URL.createObjectURL(blob)
  window.open(blobUrl, "_blank")
  // Revoke after brief delay to avoid memory leak while browser loads the URL
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000)
}
