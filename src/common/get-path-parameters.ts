/**
 * Match a mock URL against a request path and return captured path parameters.
 * @internal
 */
export function getPathParameters(
    mockUrl: string,
    requestPath: string,
): Record<string, string> | undefined {
    const mockSegments = mockUrl.split("/");
    const requestSegments = requestPath.split("/");

    if (mockSegments.length !== requestSegments.length) {
        return undefined;
    }

    const parameters: Record<string, string> = {};
    for (const [index, mockSegment] of mockSegments.entries()) {
        const requestSegment = requestSegments[index];
        if (mockSegment.startsWith(":") && mockSegment.length > 1) {
            if (requestSegment.length === 0) {
                return undefined;
            }
            parameters[mockSegment.slice(1)] = requestSegment;
        } else if (mockSegment !== requestSegment) {
            return undefined;
        }
    }

    return parameters;
}
