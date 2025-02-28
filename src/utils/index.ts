import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { routing } from "@/i18n/routing";

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
  if (typeof window !== undefined) return "";

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return "http://localhost:3000";
}

// export const getI18nPath = (url: string, locale: string) => {
//   console.log("/${locale}${url}", `/${locale}${url}`);

//   return `/${locale}${url}`;
// };
