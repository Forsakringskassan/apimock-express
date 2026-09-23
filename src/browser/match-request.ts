import { parseDelay } from "../common";
import { type Mock, type StaticMockResponse } from "../mockfile";
import { type HttpMethod } from "./http-method";
import { matchResponseBrowser } from "./match-response-browser";
import { type MatchResponseBrowserInterface } from "./match-response-browser-interface";

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
    const mockResponse = (await matchResponseBrowser(
        options,
    )) as StaticMockResponse;

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
