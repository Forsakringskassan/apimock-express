import path from "node:path";
import { glob } from "glob";
import { type NormalizedEntry } from "../normalized-entry";
import { appendMethodType } from "./append-method-type";

export interface GetFilepathResponse {
    index: number;
    filepath: string;
}

/**
 * Create the path to the mockfile depending on the request url and the http method.
 *
 * @internal
 * @param indices - Indices of the mock entries matching the url prefix.
 */
export async function getFilepath(
    mockOptions: NormalizedEntry[],
    req: { method?: string },
    url: string,
    indices: number[],
): Promise<GetFilepathResponse> {
    const errors: unknown[] = [];
    for (const index of indices) {
        try {
            const filepath = await getFilepathInternal(
                mockOptions,
                req,
                url,
                index,
            );
            return { index, filepath };
        } catch (e: unknown) {
            errors.push(e);
        }
    }
    throw Error(errors.toString());
}

/**
 * Remove trailing slash if present.
 */
function stripTrailingSlash(filepath: string): string {
    return filepath.endsWith("/") ? filepath.slice(0, -1) : filepath;
}

/**
 * Remove queryparamets (including the `?` delimiter) if present.
 */
function stripQueryParams(filepath: string): string {
    const index = filepath.indexOf("?");
    if (index !== -1) {
        return filepath.slice(0, index);
    } else {
        return filepath;
    }
}

/**
 * Convert posix `/` to native path delimiter.
 */
function normalizeSeparator(filepath: string): string {
    return filepath.replaceAll("/", path.sep);
}

/**
 * Creates a glob pattern to match directory with a `dir/__default.json` mock.
 */
function wildcardPattern(filepath: string, req: { method?: string }): string {
    return path.join(
        path.dirname(filepath),
        `${appendMethodType(req, "__default")}.*{js,json}`,
    );
}

/**
 * Creates a glob pattern to match directory with a `dir/endpoint.json` mock.
 */
function globPattern(filepath: string, req: { method?: string }): string {
    return `${appendMethodType(req, filepath)}.*{js,json}`;
}

/**
 * Create a glob pattern to match a diretory with a `dir/__method.json` mock.
 */
function dirPattern(filepath: string, req: { method?: string }): string {
    return path.join(
        filepath,
        `__${req.method?.toLowerCase() ?? "get"}.*{js,json}`,
    );
}

async function getFilepathInternal(
    mockOptions: NormalizedEntry[],
    req: { method?: string },
    url: string,
    optionIndex: number,
): Promise<string> {
    const { mockurl, mockdir } = mockOptions[optionIndex];

    let filepath = url;
    filepath = filepath.slice(mockurl.length);
    filepath = stripTrailingSlash(filepath);
    filepath = stripQueryParams(filepath);
    filepath = normalizeSeparator(filepath);
    filepath = path.join(mockdir, filepath);

    const options = { windowsPathsNoEscape: true };
    const wildcard = await glob(wildcardPattern(filepath, req), options);
    const files = await glob(globPattern(filepath, req), options);
    const dirFiles = await glob(dirPattern(filepath, req), options);
    const resolvedPath = path.resolve(
        process.cwd(),
        globPattern(filepath, req),
    );

    if (dirFiles.length > 0) {
        return dirFiles[0];
    }

    if (files.length === 0) {
        if (wildcard.length === 1) {
            return wildcard[0];
        }
        throw Error(`Cannot find file matching glob "${resolvedPath}"`);
    } else if (files.length > 1) {
        console.warn(
            `Found multiple files matching glob "%s", using "%s", found:`,
            resolvedPath,
            files[0],
            files,
        );
    }
    return files[0];
}
