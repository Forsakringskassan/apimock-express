// @vitest-environment happy-dom

import { describe, expect, it } from "vitest";
import { appendBasePath, matchRequest } from "../../src/browser";
import { generateForBrowser } from "../../src/main";

const mockData = await generateForBrowser("test/generateForBrowser", {
    rootPath: process.cwd(),
});

describe("generateForBrowser", function () {
    describe("generateForBrowser", function () {
        it("should return default response for .js", async () => {
            expect.assertions(2);
            const request = new Request(
                "http://localhost/deeply/private/fancyApi",
            );
            const response = await matchRequest(mockData, request);
            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({ foo: "bar" });
        });

        it("should return post", async () => {
            expect.assertions(2);
            const request = new Request(
                "http://localhost/deeply/private/fancyApi",
                { method: "POST" },
            );
            const response = await matchRequest(mockData, request);
            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({
                message: "file uploaded with fancy api",
            });
        });

        it("should return default response for .json", async () => {
            expect.assertions(2);
            const request = new Request("http://localhost/deeply/private/json");
            const response = await matchRequest(mockData, request);
            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({ foo: "json" });
        });

        it("should return default response for .cjs", async () => {
            expect.assertions(2);
            const request = new Request(
                "http://localhost/deeply/private/commonjs",
            );
            const response = await matchRequest(mockData, request);
            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({ foo: "cjs" });
        });

        it("should return default response for .esm", async () => {
            expect.assertions(2);
            const request = new Request("http://localhost/deeply/private/esm");
            const response = await matchRequest(mockData, request);
            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({ foo: "esm" });
        });

        it("should be able to define base api path", async () => {
            expect.assertions(2);
            const prefixedMockData = await generateForBrowser(
                "test/generateForBrowser",
                {
                    rootPath: process.cwd(),
                    baseApiPath: "/api/prefix",
                },
            );
            const request = new Request(
                "http://localhost/api/prefix/deeply/private/commonjs",
            );
            const response = await matchRequest(prefixedMockData, request);
            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({ foo: "cjs" });
        });

        it("should be able to append a basePath afterwards with using appendBasePath", async () => {
            expect.assertions(2);
            const baseMockData = await generateForBrowser(
                "test/generateForBrowser",
                {
                    rootPath: process.cwd(),
                },
            );
            const prefixedMockData = appendBasePath(
                baseMockData,
                "/api/prefix",
            );
            const request = new Request(
                "http://localhost/api/prefix/deeply/private/commonjs",
            );
            const response = await matchRequest(prefixedMockData, request);
            expect(response.status).toBe(200);
            expect(await response.json()).toEqual({ foo: "cjs" });
        });
    });
});
