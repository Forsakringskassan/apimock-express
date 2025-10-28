/**
 * API metadata.
 *
 * @public
 */
export interface MockMeta {
    /** Human readable title of this endpoint */
    title?: string;

    /** Unique key for this endpoint, if present it should be used as the cookie
     * for all requests */
    key?: string;

    /** Unique url for mock, not in use for file based mocks, example: /path/subpath */
    url?: string;

    /** HTTP Method, not in use for file based mocks.
     * Valid values: GET / POST / DELETE / PUT
     */
    method?: string;
}

/**
 * A description of a static mock response.
 *
 * @public
 * @typeParam T - The type of the response body.
 */
export interface StaticMockResponse<T = unknown> {
    /** Human readable label for this mock entry. */
    label?: string;

    /** Human readable description for this mock entry. */
    description?: string;

    /**
     * Number of milliseconds of delay before responding.
     */
    delay?: number;

    /**
     * The HTTP status code to respond with.
     */
    status?: number;

    /**
     * A key to value mapping of HTTP headers to respond with.
     */
    headers?: Record<string, string>;

    /**
     * The response body.
     */
    body?: T | ((req: MockRequest) => T);
}

/**
 * A callback function for dynamically loading a mock response.
 *
 * @public
 * @typeParam T - The type of the response body.
 */
export type DynamicMockResponse<T = unknown> = (
    req: MockRequest,
) => StaticMockResponse<T>;

/**
 * Describes a mock response.
 *
 * @public
 * @typeParam T - The type of the response body.
 */
export type MockResponse<T = unknown> =
    | StaticMockResponse<T>
    | DynamicMockResponse<T>;

/**
 * Describes a request for the mock server to listen for.
 *
 * @public
 * @typeParam T - The type of the request body.
 */
export interface MockRequest<T = unknown> {
    /**
     * A key to value mapping of cookies to match.
     */
    cookies?: Record<string, string>;

    /**
     * A key to value mapping of parameters to match.
     */
    parameters?: Record<string, string | string[] | undefined>;

    /**
     * A key to value mapping of headers to match.
     */
    headers?: Record<string, string | string[] | undefined>;

    /**
     * The request body to match.
     */
    body?: T;
}

/**
 * Describes a mapping of a request to a specific mock response.
 *
 * @public
 * @typeParam T - The type of the response body.
 * @typeParam U - The type of the request body.
 */
export interface MockMatcher<T = unknown, U = unknown> {
    /**
     * The response (value) for this mock match.
     */
    response: MockResponse<T>;

    /**
     * The request (key) for this mock match.
     */
    request: MockRequest<U>;
}

/**
 * A complete mock description.
 *
 * @public
 * @typeParam T - The type of the response bodies.
 * @typeParam U - The type of the request bodies.
 */
export interface Mock<T = unknown, U = unknown> {
    meta?: MockMeta;

    /**
     * An array of mappings between requests and corresponding mock responses.
     */
    responses?: Array<MockMatcher<T, U>>;

    /**
     * The default response if no other match (from responses) could be found.
     */
    defaultResponse: MockResponse<T>;
}

/**
 * Describes possible values for a cookie used to select a mock response.
 *
 * @public
 * @typeParam TMockCookieValue - A (narrowed) string type constraint for possible values for the cookie.
 */
export interface MockCookie<TMockCookieValue extends string = string> {
    /**
     * The name of the cookie that specifies which mock response to use.
     */
    name: string;
    /**
     * A dictionary of possible values this cookie can be set to.
     */
    values: Record<string, TMockCookieValue>;
}

/**
 * A value for a cookie specifying which mock response to use.
 *
 * @public
 * @typeParam T - A mock cookie description defining the possible values for the cookie.
 */
export type MockCookieValue<T extends MockCookie> =
    T["values"][keyof T["values"]];

/**
 * Describes a complete mock depending on the value of a cookie.
 *
 * @public
 * @typeParam TMockCookieValue - Possible values for the cookie.
 * @typeParam TResponse - The type of the response bodies.
 */
export interface MockCookieByOptions<
    TMockCookieValue extends string = string,
    TResponse = unknown,
> {
    /**
     * Meta data for the mock.
     */
    meta?: MockMeta;
    /**
     * The name of the cookie that specifies which mock response to use.
     */
    cookieName: string;
    /**
     * The default response to use if the cookie is not set to a value with a defined mapping.
     */
    defaultResponse: MockResponse<TResponse>;
    /**
     * A dictionary of possible cookie values and their respective mock response.
     */
    responses: Record<TMockCookieValue, MockResponse<TResponse>>;
}
