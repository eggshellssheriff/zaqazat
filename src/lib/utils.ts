
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-KZ", {
    style: "currency",
    currency: "KZT",
  }).format(price);
}

export function isValidImage(file: File): boolean {
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  return validTypes.includes(file.type);
}

export function validatePhoneNumber(phone: string): boolean {
  // Basic validation for phone numbers
  // Accepts formats: +XXXXXXXXXXX, (XXX) XXX-XXXX, XXX-XXX-XXXX, etc.
  return /^\+?[0-9()\s-]{7,20}$/.test(phone);
}
