"use client";

import { Phone } from "lucide-react";
import { useLocale } from "next-intl";
import "./floating-contact.css";

const phoneNumber = "+971503420157";
const displayNumber = "+971 50 342 0157";

export function FloatingContact() {
  const isArabic = useLocale() === "ar";

  return (
    <nav
      className="sfgt-floating-contact"
      dir={isArabic ? "rtl" : "ltr"}
      aria-label={isArabic ? "تواصل سريع" : "Quick contact"}
    >
      <a
        className="sfgt-contact-action sfgt-contact-whatsapp"
        href={`https://wa.me/${phoneNumber.slice(1)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={
          isArabic
            ? `تواصل عبر واتساب على ${displayNumber} (يفتح في علامة تبويب جديدة)`
            : `Chat on WhatsApp at ${displayNumber} (opens in a new tab)`
        }
        title={`${isArabic ? "واتساب" : "WhatsApp"}: ${displayNumber}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M20.52 3.48A11.84 11.84 0 0 0 12.1 0C5.56 0 .24 5.32.24 11.86c0 2.09.55 4.13 1.59 5.93L.14 24l6.36-1.67a11.85 11.85 0 0 0 5.6 1.42h.01c6.54 0 11.86-5.32 11.86-11.86 0-3.17-1.23-6.15-3.47-8.41Zm-8.42 18.27c-1.76 0-3.48-.47-4.98-1.36l-.36-.22-3.77.99 1-3.68-.24-.38a9.84 9.84 0 0 1-1.51-5.24c0-5.44 4.43-9.87 9.88-9.87 2.64 0 5.12 1.03 6.98 2.89a9.8 9.8 0 0 1 2.89 6.99c0 5.45-4.43 9.88-9.89 9.88Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.76-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.66-1.61-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.87 1.21 3.07.15.2 2.1 3.21 5.08 4.51.71.31 1.27.49 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
        </svg>
      </a>
      <a
        className="sfgt-contact-action sfgt-contact-call"
        href={`tel:${phoneNumber}`}
        aria-label={
          isArabic
            ? `اتصل بنا على ${displayNumber}`
            : `Call now at ${displayNumber}`
        }
        title={`${isArabic ? "اتصال" : "Call"}: ${displayNumber}`}
      >
        <Phone aria-hidden="true" focusable="false" strokeWidth={1.7} />
      </a>
    </nav>
  );
}
