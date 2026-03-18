// @vitest-environment happy-dom
/* global document */

import { describe, expect, it, vi } from "vitest";
import { matchResponseBrowser } from "../../src/browser";
import advancedGetMock from "../api/js/body-fn.mjs";
import advancedPostMock from "../api/js/body-fn_post.mjs";
import basicMockPost from "./basic-mock-post.mjs";
import basicMock from "./basic-mock.mjs";

describe("browser", function () {
    describe("matchResponseBrowser", function () {
        const config = {
            mockdata: [
                basicMock,
                basicMockPost,
                advancedPostMock,
                advancedGetMock,
            ],
            requestUrl: "/private/foo/basic",
            method: "GET",
            bodyParameters: {},
            headers: undefined,
        };

        it("should return 404 response if no match", async () => {
            expect.assertions(1);
            const customConfig = {
                ...config,
                requestUrl: "404",
            };
            const response = matchResponseBrowser(customConfig);
            expect(response).to.deep.equal({
                body: {
                    response:
                        "default 404 - @forsakringskassan/apimock-express",
                },
                delay: 0,
                label: "Mock 404 response",
                status: 404,
            });
        });

        it("should be able to send in full url", async () => {
            expect.assertions(2);
            const customConfig = {
                ...config,
                requestUrl: "https://example.net/private/foo/basic?foo=bar",
            };

            expect(matchResponseBrowser(customConfig)).to.deep.equal({
                body: { foo: "bar" },
                delay: 0,
                status: 200,
            });

            customConfig.requestUrl =
                "https://example.net:1337/private/foo/basic?foo=bar";
            expect(matchResponseBrowser(customConfig)).to.deep.equal({
                body: { foo: "bar" },
                delay: 0,
                status: 200,
            });
        });

        it("should get default GET-response", async () => {
            expect.assertions(1);
            const response = matchResponseBrowser(config);
            expect(response).to.deep.equal({
                body: { foo: "bar" },
                delay: 0,
                status: 200,
            });
        });

        it("should be able to find mocks based on cookies", async () => {
            expect.assertions(1);
            vi.spyOn(document, "cookie", "get").mockImplementation(
                () => "foo=bar",
            );
            const response = matchResponseBrowser(config);
            expect(response).to.deep.equal({
                body: "cookies",
                status: 200,
                delay: 0,
            });
        });

        it("should be able to find mocks query params", async () => {
            expect.assertions(1);
            const customConfig = {
                ...config,
                requestUrl: "/private/foo/basic?bar=foo&foo=bar",
            };
            const response = matchResponseBrowser(customConfig);
            expect(response).to.deep.equal({
                body: { message: "foobar" },
                status: 401,
                delay: 0,
            });
        });

        describe("mock saving values to a global state", () => {
            it("should get default value when no data saved", async () => {
                expect.assertions(1);
                const customConfig = {
                    ...config,
                    requestUrl: "/advanced/reading-mock",
                };
                const response = matchResponseBrowser(customConfig);
                expect(response).to.deep.equal({
                    body: { no: "data-saved" },
                    status: 200,
                    delay: 0,
                });
            });

            it("should be able to post data and then retrieve the value", async () => {
                expect.assertions(1);
                let customConfig = {
                    ...config,
                    requestUrl: "/advanced/post-mock",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "BREADCRUMB-ID": "foo",
                    },
                    body: JSON.stringify({ hej: "1" }),
                };
                matchResponseBrowser(customConfig);

                customConfig = {
                    ...config,
                    requestUrl: "/advanced/post-mock",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "BREADCRUMB-ID": "bar",
                    },
                    body: JSON.stringify({ hej: "2" }),
                };
                matchResponseBrowser(customConfig);

                /* Get first saved value based by BREADCRUMB-ID */
                customConfig = {
                    ...config,
                    requestUrl: "/advanced/reading-mock",
                    headers: {
                        "BREADCRUMB-ID": "foo",
                    },
                };
                const response = matchResponseBrowser(customConfig);
                expect(response).to.deep.equal({
                    body: { hej: "1" },
                    status: 200,
                    delay: 0,
                });
            });
        });
    });
});
