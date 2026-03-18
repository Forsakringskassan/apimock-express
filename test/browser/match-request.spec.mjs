// @vitest-environment happy-dom
/* global document */
import { describe, expect, it, vi } from "vitest";
import { matchRequest } from "../../src/browser";
import advancedGetMock from "../api/js/body-fn.mjs";
import advancedPostMock from "../api/js/body-fn_post.mjs";
import basicMockPost from "./basic-mock-post.mjs";
import basicMock from "./basic-mock.mjs";

async function getMockResponse(url, method = "GET", headers = {}, body) {
    const req = new Request(url, { method, headers, body });
    return await matchRequest(
        [basicMock, basicMockPost, advancedPostMock, advancedGetMock],
        req,
    );
}

describe("browser", function () {
    describe("matchMockByRequest", function () {
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
    });
});
