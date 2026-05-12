import fs from "node:fs";
import { type IncomingMessage, type ServerResponse } from "node:http";
import { type Plugin } from "vite";
import createDebug from "debug";
import { version } from "../package.json";
import { parseDelay } from "./common";
import { type MiddlewareConfiguration } from "./middleware-configuration";
import { type MockEntry } from "./mock-entry";
import { type Mock } from "./mockfile";
import { extractFileContent, getFilepath, respondWithMock } from "./node";
import { respondData } from "./node/respond-data";
import { type NormalizedEntry } from "./normalized-entry";
import { type VitePluginOptions } from "./vite-plugin-options";

export {
    type GenerateForBrowserOptions,
    generateForBrowser,
} from "./node/generate-for-browser";
export { selectResponse } from "./common";
export { type MiddlewareConfiguration } from "./middleware-configuration";
export {
    type DynamicMockResponse,
    type Mock,
    type MockMatcher,
    type MockMeta,
    type MockRequest,
    type MockResponse,
    type StaticMockResponse,
} from "./mockfile";
export { type MockEntry } from "./mock-entry";
export { type VitePluginOptions } from "./vite-plugin-options";

declare module "node:http" {
    interface IncomingMessage {
        originalUrl?: string;
    }
}

const debug = createDebug("apimock");

let mockOptions: NormalizedEntry[] = [];

const defaultConfig: MiddlewareConfiguration = {
    verbose: true,
};

/**
 * @returns List of matching index or empty list if no match was found
 */
function findMachingIndex(url: string): number[] {
    const found: number[] = [];
    /* eslint-disable-next-line @typescript-eslint/no-for-in-array -- technical debt */
    for (const i in mockOptions) {
        const config = mockOptions[i];
        if (!url.startsWith(config.mockurl)) {
            continue;
        }
        if (found.length === 0) {
            debug(`Found matching mock at ${i}:`, config);
        } else {
            debug(`Found another matching mock at ${i}:`, config);
        }
        found.push(Number.parseInt(i, 10));
    }
    return found;
}

function toArray<T>(value: T | T[]): T[] {
    return Array.isArray(value) ? value : [value];
}

function isMockEntry(mock: MockEntry | Mock): mock is MockEntry {
    return "dir" in mock;
}

interface Table {
    url: string;
    directory: string;
    delay: string;
}

function normalizeMockEntry(
    option: MockEntry,
    table: Table[],
): NormalizedEntry {
    table.push({
        url: option.url,
        directory: option.dir,
        delay: option.delay ? `${String(option.delay)} ms` : "-",
    });
    return {
        mockurl: option.url,
        mockdir: option.dir,
        delay: option.delay,
    };
}

function normalizeInlineMock(option: Mock, table: Table[]): NormalizedEntry {
    if (!option.meta?.url) {
        throw new Error("Inline Mock must have meta.url defined");
    }
    table.push({
        url: option.meta.url,
        directory: "(inline)",
        delay: "-",
    });
    return {
        mockurl: option.meta.url,
        mockdir: "",
        delay: undefined,
        inlineMock: option,
    };
}

function findInlineMatch(
    matches: number[],
    method: string | undefined,
): NormalizedEntry | undefined {
    if (method === undefined) {
        throw new Error("Request method is missing");
    }
    const index = matches.find((i) => {
        const entry = mockOptions[i];
        if (entry.inlineMock === undefined) {
            return false;
        }
        const entryMethod = entry.inlineMock.meta?.method;
        if (entryMethod === undefined) {
            throw new Error("Inline Mock must have meta.method defined");
        }
        return entryMethod === method;
    });
    return index !== undefined ? mockOptions[index] : undefined;
}

/**
 * @public
 */
const apimock = {
    /**
     * Configure apimock-express.
     */
    config(
        mocks: MockEntry | MockEntry[] | Mock | Mock[],
        userConfig: Partial<MiddlewareConfiguration> = {},
    ): void {
        const config = { ...defaultConfig, ...userConfig };
        const table: Table[] = [];

        mockOptions = toArray(mocks).map((option) => {
            if (isMockEntry(option)) {
                return normalizeMockEntry(option, table);
            } else {
                return normalizeInlineMock(option, table);
            }
        });

        if (config.verbose) {
            console.group(`apimock-express v${version} configuration`);
            console.table(table);
            console.log("Use DEBUG=apimock to see debugging messages");
            console.groupEnd();
        }
    },

    /**
     * Express/Connect middleware.
     *
     * Usage:
     *
     * ```ts
     * app.use("/", mockRequest);
     * ```
     */
    async mockRequest(
        req: IncomingMessage,
        res: ServerResponse,
        next: () => void,
    ): Promise<void> {
        try {
            const url = req.originalUrl ?? "";
            const matches = findMachingIndex(url);
            if (matches.length === 0) {
                const config = JSON.stringify(mockOptions, null, 4);
                debug(`Found no matching mocks for ${url} in:\n${config}`);
                next();
                return;
            }

            //req.originalUrl matches some mockurl
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader(
                "Access-Control-Allow-Methods",
                "GET,PUT,POST,DELETE",
            );
            res.setHeader("Access-Control-Allow-Headers", "Content-Type");

            const inlineMatch = findInlineMatch(matches, req.method);
            if (inlineMatch !== undefined) {
                const baseDelay = parseDelay(inlineMatch.delay);
                const inlineMock = inlineMatch.inlineMock;
                if (inlineMock !== undefined) {
                    respondWithMock(req, res, inlineMock, "", baseDelay);
                    return;
                }
            }

            const { filepath, index } = await getFilepath(
                mockOptions,
                req,
                url,
                matches,
            );

            if (fs.existsSync(filepath)) {
                const mockdata = await extractFileContent(filepath);
                const baseDelay = parseDelay(mockOptions[index].delay);
                respondWithMock(req, res, mockdata, filepath, baseDelay);
            } else {
                console.error(
                    `Can not find mock filename "${process.cwd()}/${filepath.replace(
                        /^(?:\.\.\/)+/,
                        "",
                    )}" for url "${url}"`,
                );
                console.error(`Searched in "${mockOptions[index].mockdir}"`);
                console.error("Use DEBUG=apimock to see debugging messages");
                const response = {
                    status: 404,
                    body: { error: "Can not find mockfile. See server log" },
                };
                respondData(res, response);
            }
        } catch (err) {
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.writeHead(500);
            res.write(
                err instanceof Error
                    ? `${err.name}: ${err.message}`
                    : String(err),
            );
            res.end();
        }
    },

    /**
     * Vite plugin for apimock-express.
     *
     * @param mocks - Mock configuration
     * @param options - Options
     */
    vitePlugin(
        mocks: MockEntry | MockEntry[] | Mock | Mock[],
        options: Partial<VitePluginOptions> = {},
    ): { name: string } {
        const { enabled = true } = options;
        const plugin: Plugin = {
            name: "apimock-plugin",
            configureServer(server) {
                if (enabled === true || enabled === "serve") {
                    apimock.config(mocks, options);
                    /* eslint-disable-next-line @typescript-eslint/unbound-method -- technical debt */
                    server.middlewares.use("/", apimock.mockRequest);
                }
            },
            configurePreviewServer(server) {
                if (enabled === true || enabled === "preview") {
                    apimock.config(mocks, options);
                    /* eslint-disable-next-line @typescript-eslint/unbound-method -- technical debt */
                    server.middlewares.use("/", apimock.mockRequest);
                }
            },
        };
        return plugin;
    },
};

/**
 * Vite plugin for apimock-express.
 *
 * @public
 * @param mocks - Mock configuration
 * @param options - Options
 */
export function vitePlugin(
    mocks: MockEntry | MockEntry[] | Mock | Mock[],
    options: Partial<VitePluginOptions> = {},
): { name: string } {
    return apimock.vitePlugin(mocks, options);
}

export default apimock;
