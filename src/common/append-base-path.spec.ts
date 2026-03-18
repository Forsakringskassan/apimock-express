import { describe, expect, it } from "vitest";
import { type Mock } from "../helpers";
import { appendBasePath } from "./append-base-path";

describe("appendBasePath", () => {
    it("should handle an empty array of mocks without throwing an error", () => {
        expect.assertions(1);
        const result = appendBasePath([], "N/A");
        expect(result).toEqual([]);
    });

    it("should correctly prepend the basePath to all mock URLs", () => {
        expect.assertions(2);
        const basePath = "/api/v1";
        const mocks: Mock[] = [
            {
                meta: {
                    url: "/users",
                },
                defaultResponse: {},
            },
            {
                meta: {
                    url: "/products",
                },
                defaultResponse: {},
            },
        ];

        const result = appendBasePath(mocks, basePath);
        expect(result[0]?.meta?.url).toBe("/api/v1/users");
        expect(result[1]?.meta?.url).toBe("/api/v1/products");
    });

    it("should throw an error if a mock is missing meta information", () => {
        expect.assertions(1);
        const basePath = "/api/v1";
        const mocks: Mock[] = [
            {
                meta: {
                    url: "/users",
                },
                defaultResponse: {},
            },
            {
                defaultResponse: {},
            },
        ];

        expect(() => {
            appendBasePath(mocks, basePath);
        }).toThrow(
            "Not possible to append basePath, mock is missing meta information",
        );
    });
});
