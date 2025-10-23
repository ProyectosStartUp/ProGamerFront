/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_CLIENTID_AUTH_GOOGLE: string
  readonly VITE_REACT_APP_FACEBOOK_APP_ID: string
  // Agrega más variables según necesites
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}