import { type HttpRequestHandler } from "msw";
import { type Mock } from "../mockfile";
import { matchRequest } from "./match-request";

/**
 * Instantiate and set up service worker to intercept and mock network requests.
 *
 * @public
 * @param workerUrl - URL to the MSW service worker
 * @param mocks - List of mocks
 * @param options - Optional service worker registration options
 * @returns A promise resolved when the service worker is ready to accept requests.
 */
export async function setupWorker(
    workerUrl: string | URL,
    mocks: Mock[],
    options?: RegistrationOptions,
): Promise<void> {
    const { http } = await import("msw");
    const { setupWorker: mswSetupWorker } = await import("msw/browser");

    function getFunctionFor(
        method: string | undefined,
    ): HttpRequestHandler | null {
        switch (method) {
            case "GET":
                return http.get;
            case "POST":
                return http.post;
            case "PUT":
                return http.put;
            case "DELETE":
                return http.delete;
            default:
                return null;
        }
    }

    const handlers = mocks.flatMap((mock) => {
        const { url, method } = mock.meta ?? {};
        if (!url) {
            return [];
        }

        const fn = getFunctionFor(method);
        if (!fn) {
            return [];
        }

        return fn(url, async (req) => matchRequest([mock], req.request));
    });

    const worker = mswSetupWorker(...handlers);

    const url = typeof workerUrl === "string" ? workerUrl : workerUrl.href;
    await worker.start({
        serviceWorker: { url, options },
    });
}
