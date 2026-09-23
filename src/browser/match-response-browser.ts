import { getPathParameters, selectResponse } from "../common";
import { type MockResponse } from "../mockfile";
import { getCookies } from "./get-cookies";
import { getRequestParamsFromUrl } from "./get-request-params-from-url";
import { type MatchResponseBrowserInterface } from "./match-response-browser-interface";

/**
 * Respond the given mockdata based by url, cookie, request parameters and headers-
 *
 * Major differences between this function and matchResponse is:
 * This function will automagically retrieve cookies and request parameters
 * Function will always return in a mock-response, the fallback will be a mocked 404 request if no given mock is matched
 *
 * @internal
 */
export async function matchResponseBrowser(
    options: MatchResponseBrowserInterface,
): Promise<MockResponse> {
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

        const pathParameters = getPathParameters(meta.url, relativeUrl);
        if (pathParameters === undefined || meta.method !== options.method) {
            continue;
        }

        const mockResponse = await selectResponse(
            mock,
            options.body,
            { ...pathParameters, ...requestParameters },
            options.bodyParameters,
            options.headers,
            cookies,
        );

        if (mockResponse) {
            return mockResponse;
        }
    }

    return {
        label: "Mock 404 response",
        status: 404,
        delay: 0,
        body: { response: "default 404 - @forsakringskassan/apimock-express" },
    } satisfies MockResponse;
}
