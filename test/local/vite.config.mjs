import { cp } from "node:fs/promises";
import { join } from "node:path";
import { defineConfig } from "vite";

await cp(
    new URL(import.meta.resolve("msw/mockServiceWorker.js")),
    join(import.meta.dirname, "./mockServiceWorker.js"),
);
/*
await cp(
    "../../node_modules/msw/lib/mockServiceWorker.js",
    "./mockServiceWorker.js",
);*/

export default defineConfig({
    server: {
        host: "0.0.0.0",
        port: process.env.PORT ? Number(process.env.PORT) : undefined,
    },
});
