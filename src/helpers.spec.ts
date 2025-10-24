import { describe, expect, test } from "vitest";
import { type MockCookieValue, createMockByCookie } from "./helpers";

describe("createMockByCookie", () => {
    test("should succesfully create mock with static responses", () => {
        // Given
        const getSomethingMockCookie = {
            name: "api-get-something",
            values: {
                foo: "foo-200",
                bar: "bar-200",
                broken: "broken-500",
            },
        } as const;
        type GetSomethingMockCookie = typeof getSomethingMockCookie;
        interface SomeResponse {
            message: string;
        }

        // When
        const mock = createMockByCookie<
            MockCookieValue<GetSomethingMockCookie>,
            SomeResponse
        >({
            meta: {
                title: "GET /something",
                method: "GET",
                url: "/something",
            },
            cookieName: getSomethingMockCookie.name,
            responses: {
                [getSomethingMockCookie.values.foo]: {
                    label: "Foo (200)",
                    body: { message: "foo" },
                },
                "bar-200": {
                    label: "Bar (200)",
                    body: { message: "bar" },
                },
                "broken-500": {
                    label: "Error (500)",
                    status: 500,
                },
            },
            defaultResponse: {
                label: "Default (200)",
                body: { message: "hejsan" },
            },
        });

        // Then
        expect(mock).toEqual({
            meta: {
                method: "GET",
                title: "GET /something",
                url: "/something",
            },
            responses: [
                {
                    request: {
                        cookies: { "api-get-something": "foo-200" },
                    },
                    response: {
                        label: "Foo (200)",
                        body: { message: "foo" },
                    },
                },
                {
                    request: {
                        cookies: { "api-get-something": "bar-200" },
                    },
                    response: {
                        label: "Bar (200)",
                        body: { message: "bar" },
                    },
                },
                {
                    request: {
                        cookies: { "api-get-something": "broken-500" },
                    },
                    response: {
                        label: "Error (500)",
                        status: 500,
                    },
                },
            ],
            defaultResponse: {
                label: "Default (200)",
                body: { message: "hejsan" },
            },
        });
    });

    test("should successfully create mock with a dynamic response", () => {
        // Given
        const postDynamicMockCookie = {
            name: "api-post-dynamic",
            values: {
                foo: "foo-201",
            },
        } as const;
        type PostDynamicMockCookie = typeof postDynamicMockCookie;

        // When
        const mock = createMockByCookie<MockCookieValue<PostDynamicMockCookie>>(
            {
                meta: {
                    title: "POST /dynamic",
                    method: "POST",
                    url: "/dynamic",
                },
                cookieName: postDynamicMockCookie.name,
                responses: {
                    "foo-201": {
                        label: "Foo (201)",
                        status: 201,
                    },
                },
                defaultResponse() {
                    return {
                        status: 201,
                    };
                },
            },
        );

        // Then
        const { defaultResponse, ...restOfMock } = mock;
        expect(defaultResponse).toBeTypeOf("function");
        expect(restOfMock).toEqual({
            meta: {
                title: "POST /dynamic",
                method: "POST",
                url: "/dynamic",
            },
            responses: [
                {
                    request: {
                        cookies: { "api-post-dynamic": "foo-201" },
                    },
                    response: {
                        label: "Foo (201)",
                        status: 201,
                    },
                },
            ],
        });
    });
});
