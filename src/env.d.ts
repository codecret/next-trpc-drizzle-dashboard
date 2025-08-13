declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    BETTER_AUTH_EMAIL: string;
    BETTER_AUTH_SECRET: string;
    NEXT_PUBLIC_BETTER_AUTH_URL: string;
    // RESEND_API_KEY: string;
  }
}
