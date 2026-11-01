import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetchCallback = ({
  setIsLoading,
}: {
  setIsLoading: (value: boolean) => void;
}) => {
  return {
    onRequest: () => {
      setIsLoading(true);
    },
    onResponse: () => {
      setIsLoading(false);
    },
  };
};

export function getBaseUrl() {
  // In the browser, use relative URLs
  if (typeof window !== "undefined") return "";

  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}
