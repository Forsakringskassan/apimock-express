import { getCookies } from "./browser/get-cookies";
import { matchResponse } from "./common";
import { type Mock, type MockResponse } from "./mockfile";

export {
    type Mock,
    type MockMatcher,
    type MockMeta,
    type MockResponse,
    type MockRequest,
} from "./mockfile";
export { selectResponse, matchResponse } from "./common";

/**
 * Respond the given mockdata based by url, cookie, request parameters and headers-
 * This function will automagically retrieve cookies and request parameters
 * @public
 */
export function matchResponseBrowser(options: {
    mockdata: Mock[];
    requestUrl: string;
    method: "GET" | "DELETE" | "PUT" | "DELETE";
    bodyParameters: Record<string, unknown>;
    headers: Record<string, string | string[] | undefined>;
}): MockResponse | undefined {
    const requestParameters = {};

    return matchResponse({
        mockdata: options.mockdata,
        requestUrl: options.requestUrl,
        method: options.method,
        requestParameters: requestParameters,
        bodyParameters: options.bodyParameters,
        headers: options.headers,
        cookies: getCookies(),
    });
}
