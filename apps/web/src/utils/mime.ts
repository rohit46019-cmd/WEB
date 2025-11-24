export function iconForType(type: string) {
  if (!type) return "/icons/text.svg";
  if (type.includes("pdf")) return "/icons/pdf.svg";
  if (type.startsWith("image")) return "/icons/image.svg";
  if (type.startsWith("video")) return "/icons/video.svg";
  if (type.includes("zip")) return "/icons/zip.svg";
  if (type.startsWith("audio")) return "/icons/audio.svg";
  if (type.startsWith("text")) return "/icons/text.svg";
  return "/icons/text.svg";
}
