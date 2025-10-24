import {
    type Mock,
    type MockCookieByOptions,
    type MockMatcher,
    type MockResponse,
} from "./mockfile";

export {
    type DynamicMockResponse,
    type Mock,
    type MockCookie,
    type MockCookieByOptions,
    type MockCookieValue,
    type MockMatcher,
    type MockMeta,
    type MockRequest,
    type MockResponse,
    type StaticMockResponse,
} from "./mockfile";

/**
 * @public
 */
export function defineMock<T = unknown, U = unknown>(
    mock: Mock<T, U>,
): Mock<T, U> {
    return mock;
}

/**
 * @public
 */
export function createResponseByCookie<T, U = unknown>(
    cookieName: string,
    cookieValue: string,
    response: MockResponse<T>,
): MockMatcher<T, U> {
    return {
        request: {
            cookies: {
                [cookieName]: cookieValue,
            },
        },
        response,
    };
}

/**
 * Create a mock where the responses are determined by the value of a specific cookie.
 * @public
 * @typeParam TMockCookieValue - Possible values for the cookie.
 * @typeParam TResponse - The type of the response bodies.
 * @param options - The options for the mock setup.
 * @returns A complete mock.
 */
export function createMockByCookie<
    TMockCookieValue extends string = string,
    TResponse = unknown,
>(options: MockCookieByOptions<TMockCookieValue, TResponse>): Mock<TResponse> {
    const { meta, cookieName, defaultResponse, responses } = options;
    const responseArray = (
        Object.keys(responses) as Array<keyof typeof responses>
    ).map((cookieValue) => ({
        request: {
            cookies: {
                [cookieName]: cookieValue,
            },
        },
        response: responses[cookieValue],
    }));

    return {
        meta,
        responses: responseArray,
        defaultResponse,
    };
}
