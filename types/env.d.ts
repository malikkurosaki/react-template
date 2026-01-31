declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL?: string;
    BETTER_AUTH_SECRET?: string;
    BUN_PUBLIC_BASE_URL?: string;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
    JWT_SECRET?: string;
  }
}
