namespace NodeJS {
    interface ProcessEnv {
        PORT?: number;
        ENV_MODE: "development" | "production";
    }
}