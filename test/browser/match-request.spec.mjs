// @vitest-environment happy-dom
/* global document */
import { describe, expect, it, vi } from "vitest";
import { matchRequest } from "../../src/browser";
import asyncResponseMock from "../api/js/async-response-fn.mjs";
import advancedGetMock from "../api/js/body-fn.mjs";
import advancedPostMock from "../api/js/body-fn_post.mjs";
import delayMock from "../api/js/delay.mjs";
import basicMockPost from "./basic-mock-post.mjs";
import basicMock from "./basic-mock.mjs";
import pathParamMock from "./path-param-mock.mjs";

async function getMockResponse(url, method = "GET", headers = {}, body) {
    const req = new Request(url, { method, headers, body });
    return await matchRequest(
        [basicMock, basicMockPost, advancedPostMock, advancedGetMock],
        req,
    );
}

describe("browser", function () {
    describe("matchMockByRequest", function () {
        it("should return default GET response", async () => {
            expect.assertions(2);
            const response = await getMockResponse("/private/foo/basic", "GET");
            const body = await response.json();
            expect(body).toEqual({
                foo: "bar",
            });
            expect(response.status).toBe(200);
        });

        it("should return 404 if the url does not exactly match", async () => {
            expect.assertions(2);
            const response = await getMockResponse(
                "/private/foo/basic404",
                "GET",
            );
            const body = await response.json();
            expect(body).toEqual({
                response: "default 404 - @forsakringskassan/apimock-express",
            });
            expect(response.status).toBe(404);
        });

        it("should return 404 response if no match", async () => {
            expect.assertions(2);
            const response = await getMockResponse("/not-found", "GET", {
                "Content-Type": "application/json",
            });
            const body = await response.json();
            expect(body).toEqual({
                response: "default 404 - @forsakringskassan/apimock-express",
            });
            expect(response.status).toBe(404);
        });

        it("should get specific post request", async () => {
            expect.assertions(2);
            const response = await getMockResponse(
                "/private/foo/basic?foo=bar",
                "POST",
                { "Content-Type": "application/json" },
            );
            const body = await response.json();
            expect(body).toEqual({
                post: "bar",
            });
            expect(response.status).toBe(200);
        });

        it("should be able to find mocks based on cookies", async () => {
            expect.assertions(1);
            vi.spyOn(document, "cookie", "get").mockImplementation(
                () => "foo=bar",
            );
            const response = await getMockResponse(
                "/private/foo/basic",
                "GET",
                { "Content-Type": "application/json" },
            );

            const body = await response.text();
            expect(body).toBe("cookies");
        });

        it("should be able to save multiple binary blob text", async () => {
            expect.assertions(1);
            const abc = new Blob(["Apimock"], { type: "text/plain" });
            const formData = new FormData();
            formData.append("text", abc, "text.txt");
            formData.append("another-file", abc, "file.txt");
            await getMockResponse(
                "/advanced/post-mock",
                "POST",
                {
                    "BREADCRUMB-ID": "blob-text",
                },
                formData,
            );
            const response = await getMockResponse(
                "/advanced/reading-mock",
                "GET",
                { "BREADCRUMB-ID": "blob-text" },
            );

            const body = await response.json();

            expect(body).to.deep.equal([
                { contentType: "text/plain", fileName: "blob" },
                { contentType: "text/plain", fileName: "blob" },
            ]);
        });

        it("should delay the response when calling delay mock", async () => {
            expect.assertions(4);
            vi.useFakeTimers();

            const req = new Request("/api/delay");
            const responsePromise = matchRequest([delayMock], req);

            const spy = vi.fn();

            /* eslint-disable-next-line unicorn/prefer-await -- intentional for test */
            responsePromise.then(spy);

            await vi.advanceTimersByTimeAsync(998);
            expect(spy).not.toHaveBeenCalled();

            await vi.advanceTimersByTimeAsync(2);
            expect(spy).toHaveBeenCalled();

            const response = await responsePromise;
            const body = await response.json();
            expect(response.status).toBe(200);
            expect(body).toEqual({ message: "default" });

            vi.useRealTimers();
        });

        it("should support an async response function", async () => {
            expect.assertions(2);
            const req = new Request("/advanced/async-mock");
            const response = await matchRequest([asyncResponseMock], req);
            const body = await response.json();
            expect(response.status).toBe(200);
            expect(body).toEqual({ async: "response" });
        });
    });

    it("should match based on path parameters", async () => {
        expect.assertions(6);
        // Low ID
        const req1 = new Request("/user/123");
        const res1 = await matchRequest([pathParamMock], req1);
        const body1 = await res1.json();
        expect(res1.status).toBe(200);
        expect(body1.name).toBe("User 123 (Low ID)");

        // High ID
        const req2 = new Request("/user/600");
        const res2 = await matchRequest([pathParamMock], req2);
        const body2 = await res2.json();
        expect(res2.status).toBe(200);
        expect(body2.name).toBe("User 600 (High ID)");

        // Invalid ID
        const req3 = new Request("/user/abc");
        const res3 = await matchRequest([pathParamMock], req3);
        const body3 = await res3.json();
        expect(res3.status).toBe(200);
        expect(body3.name).toBe("Invalid ID");
    });
});
