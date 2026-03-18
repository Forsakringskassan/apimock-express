// @vitest-environment happy-dom
/* global document */

import { afterEach, describe, expect, it, vi } from "vitest";
import { matchResponseBrowser } from "../../src/browser";
import basicMockPost from "./basic-mock-post.mjs";
import basicMock from "./basic-mock.mjs";

describe("browser", function () {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("basic", function () {
        const config = {
            mockdata: [basicMock, basicMockPost],
            requestUrl: "/private/foo/basic",
            method: "GET",
            bodyParameters: {},
            headers: undefined,
        };

        it("should get default GET-response", async () => {
            expect.assertions(1);
            const response = matchResponseBrowser(config);
            expect(response).to.deep.equal({
                body: { foo: "bar" },
                delay: 0,
                status: 200,
            });
        });

        it("should remove query params in url", async () => {
            expect.assertions(1);
            const customConfig = {
                ...config,
                requestUrl: "/private/foo/basic?foo=bar",
            };
            const response = matchResponseBrowser(customConfig);
            expect(response).to.deep.equal({
                body: { foo: "bar" },
                delay: 0,
                status: 200,
            });
        });

        it("should get specific GET-response", async () => {
            expect.assertions(1);
            const customConfig = {
                ...config,
                requestUrl: "/private/foo/basic?foo=bar&bar=foo",
            };
            const response = matchResponseBrowser(customConfig);
            expect(response).to.deep.equal({
                body: { message: "foobar" },
                status: 401,
                delay: 0,
            });
        });

        it("should get specific GET-response based on cookies", async () => {
            expect.assertions(1);
            vi.spyOn(document, "cookie", "get").mockImplementation(
                () => "foo=bar",
            );
            const customConfig = {
                ...config,
            };
            const response = matchResponseBrowser(customConfig);
            expect(response).to.deep.equal({
                body: "cookies",
                status: 200,
                delay: 0,
            });
        });

        it("should get default POST-response", async () => {
            expect.assertions(1);
            const customConfig = { ...config, method: "POST" };
            const response = matchResponseBrowser(customConfig);
            expect(response).to.deep.equal({
                body: { post: "bar" },
                delay: 0,
                status: 200,
            });
        });
    });
});
