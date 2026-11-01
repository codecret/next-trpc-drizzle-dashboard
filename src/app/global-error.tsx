"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1>Something went wrong</h1>
        {error.digest && (
          <p style={{ fontSize: 12 }}>Error ID: {error.digest}</p>
        )}
        <button
          onClick={reset}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: 6,
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
