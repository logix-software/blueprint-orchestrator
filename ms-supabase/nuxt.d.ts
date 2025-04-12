// Estende i tipi per Nuxt
declare module '#app' {
  interface RuntimeConfig {
    public: {
      apiUrl: string;
    }
  }
}

// Dichiarazione per defineNuxtConfig
declare function defineNuxtConfig(config: any): any;

// Necessario per l'accesso a process.env
declare namespace NodeJS {
  interface ProcessEnv {
    NUXT_PUBLIC_API_URL?: string;
  }
}

// Esporta i tipi per permettere a TypeScript di riconoscerli
export {}; 