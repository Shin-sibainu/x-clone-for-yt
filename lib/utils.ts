import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) {
      return "";
    }
    return new Intl.DateTimeFormat("ja-JP", {
      month: "short",
      day: "numeric",
    }).format(d);
  } catch (error) {
    return "";
  }
}

export function formatId(id: string | undefined) {
  if (!id) return "";
  return id.slice(0, 8);
}

export function formatUsername(username: string | undefined) {
  if (!username) return "";
  const shortUsername = username.length > 8 ? username.slice(0, 8) : username;
  return `@${shortUsername}`;
}
