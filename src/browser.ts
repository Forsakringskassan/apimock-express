import { getCookies } from "./browser/get-cookies";
import { getRequestParamsFromUrl } from "./browser/get-request-params-from-url";
import { parseDelay, selectResponse } from "./common";
import {
    type Mock,
    type MockResponse,
    type StaticMockResponse,
} from "./mockfile";

export {
    type DynamicMockResponse,
    type Mock,
    type MockMatcher,
    type MockMeta,
    type MockRequest,
    type MockResponse,
    type StaticMockResponse,
} from "./mockfile";
export { appendBasePath, selectResponse } from "./common";

/**
 * @public
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

/**
 * Match a Fetch `Request` against provided mock array
 *
 * @param mockdata - List of mock definitions
 * @param request - A Fetch API `Request`
 * @returns A Fetch API `Response`. Will return a default 404 if no match is found
 * @public
 */
export async function matchRequest(
    mockdata: Mock[],
    request: Request,
): Promise<Response> {
    const url = request.url;
    const method = request.method as HttpMethod;
    const headers: Record<string, string | string[] | undefined> = {};
    const bodyText = await request.text();

    request.headers.forEach((value, key) => {
        headers[key] = value;
    });

    const options: MatchResponseBrowserInterface = {
        mockdata,
        requestUrl: url,
        method,
        body: bodyText,
        bodyParameters: {},
        headers,
    };
    const mockResponse = matchResponseBrowser(options) as StaticMockResponse;

    const delay = parseDelay(mockResponse.delay);
    if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
    }

    const fetchOptions: ResponseInit = {
        status: mockResponse.status,
        headers: mockResponse.headers,
    };
    let body = mockResponse.body;
    if (typeof body !== "string") {
        body = JSON.stringify(body);
    }
    return new Response(body as BodyInit, fetchOptions);
}
/**
 * @public
 */
export interface MatchResponseBrowserInterface {
    mockdata: Mock[];
    requestUrl: string;
    method: HttpMethod;
    body: string;
    bodyParameters: Record<string, unknown>;
    headers: Record<string, string | string[] | undefined>;
}

/**
 * Respond the given mockdata based by url, cookie, request parameters and headers-
 *
 * Major differences between this function and matchResponse is:
 * This function will automagically retrieve cookies and request parameters
 * Function will always return in a mock-response, the fallback will be a mocked 404 request if no given mock is matched
 * @public
 */
export function matchResponseBrowser(
    options: MatchResponseBrowserInterface,
): MockResponse {
    let relativeUrl: string;
    const fullUrl = URL.parse(options.requestUrl);
    if (fullUrl) {
        relativeUrl = fullUrl.pathname;
    } else {
        relativeUrl = options.requestUrl.split("?", 1)[0];
    }

    const requestParameters = getRequestParamsFromUrl(options.requestUrl);
    const cookies = getCookies();

    for (const mock of options.mockdata) {
        const meta = mock.meta;
        if (!meta) {
            continue;
        }
        /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- technical debt */
        if (!meta?.url || !meta?.method) {
            continue;
        }

        if (meta.url === relativeUrl && meta.method === options.method) {
            const mockResponse = selectResponse(
                mock,
                options.body,
                requestParameters,
                options.bodyParameters,
                options.headers,
                cookies,
            );
            if (mockResponse) {
                return mockResponse;
            }
        }
    }

    return {
        label: "Mock 404 response",
        status: 404,
        delay: 0,
        body: { response: "default 404 - @forsakringskassan/apimock-express" },
    } satisfies MockResponse;
}
