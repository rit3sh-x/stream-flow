namespace NodeJS {
    interface ProcessEnv {
        DATABASE_URL: string;

        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
        CLERK_SECRET_KEY: string;

        NEXT_PUBLIC_CLERK_SIGN_IN_URL: string;
        NEXT_PUBLIC_CLERK_SIGN_UP_URL: string;
        NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: string;
        NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: string;

        MAILER_EMAIL: string;
        MAILER_PASSWORD: string;

        NEXT_PUBLIC_HOST_URL: string;

        WIX_OAUTH_KEY: string;

        NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL: string;

        GLADIA_API_KEY: string;

        OPENROUTER_API_KEY: string;
    }
}