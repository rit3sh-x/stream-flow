/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL: string;
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_SOCKET_URL: string;
  readonly VITE_HOST_URL: string;
  readonly INTERNAL_ELECTRON_APP_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}