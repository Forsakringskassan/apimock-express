import "vitest";

declare module "vitest" {
    export interface ProvidedContext {
        hostname: string;
    }
}
