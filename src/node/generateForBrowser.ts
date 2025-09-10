import { join } from "node:path";
import { globSync } from "glob";
import { type Mock } from "../main";
import { extractFileContent } from "./extract-file-content";

/**
 * @public
 */
export interface generateForBrowserOptions {
    /**
     * Path to start search for files
     *
     * defaults to process.cwd()
     */
    rootPath?: string;
    /**
     * If you want to add a prefix to your api calls
     *
     */
    baseApiPath?: string;
}

/**
 * @internal
 */
interface normalizedBrowserOptions {
    rootPath: string;
    baseApiPath: string;
}

const defaultOptions: normalizedBrowserOptions = {
    rootPath: process.cwd(),
    baseApiPath: "",
};

/**
 * Create a list of responses from your file system to be used in a browser environment
 * @experimental
 */
export async function generateForBrowser(
    apiDirectory: string,
    userOptions: generateForBrowserOptions = defaultOptions,
): Promise<Mock[]> {
    const options: normalizedBrowserOptions = {
        ...defaultOptions,
        ...userOptions,
    };
    const apiFiles = globSync([`${apiDirectory}/**/*.{js,json,cjs}`], {
        posix: true,
        cwd: options.rootPath,
    });

    const data: Mock[] = [];
    for (const file of apiFiles) {
        let apiPath = file
            .replace(apiDirectory, "")
            .replace(".cjs", "")
            .replace(".json", "")
            .replace(".js", "");

        const findMethod = file.match(/.+_(?<method>.+).js/);
        let methodType = "GET";
        if (findMethod) {
            methodType = findMethod.groups?.method.toLocaleUpperCase() ?? "GET";

            if (methodType !== "GET") {
                apiPath = apiPath.replace(
                    `_${methodType.toLocaleLowerCase()}`,
                    "",
                );
            }
        }

        const filePath = join(options.rootPath, file);
        const content = await extractFileContent(filePath);
        content.meta = {
            url: `${options.baseApiPath}${apiPath}`,
            method: methodType,
        };
        data.push(content);
    }
    return data;
}
