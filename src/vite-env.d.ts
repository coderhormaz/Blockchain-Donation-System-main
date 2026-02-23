/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DONATION_ADDRESS: string;
  readonly VITE_BASE_RPC_URL: string;
  readonly VITE_BASE_CHAIN_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
