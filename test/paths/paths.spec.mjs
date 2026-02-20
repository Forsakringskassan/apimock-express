import { describe, expect, test } from "vitest";
import { hostname } from "../../test-server";

/**
 * @param {string} value
 * @returns {string}
 */
function normalizePath(value) {
    return value.replace(process.cwd(), "<rootDir>").replaceAll("\\", "/");
}

describe("relative path mocks", function () {
    test("GET - should find json file", async () => {
        const res = await fetch(
            `http://${hostname}/relative-path/endpoint-json`,
            { method: "get" },
        );
        expect(res.status).to.equal(200);
    });

    test("GET - should find js file", async () => {
        const res = await fetch(
            `http://${hostname}/relative-path/endpoint-js`,
            { method: "get" },
        );
        expect(res.status).to.equal(200);
    });

    test("GET - should handle missing file", async () => {
        const res = await fetch(`http://${hostname}/absolute-path/missing`, {
            method: "get",
        });
        const body = normalizePath(await res.text());
        expect(res.status).to.equal(500);
        expect(body).toMatchInlineSnapshot(
            `"Error: Error: Cannot find file matching glob "<rootDir>/test/paths/mocks/missing.*{js,json}""`,
        );
    });
});

describe("absolute path mocks", function () {
    test("GET - should find json file", async () => {
        const res = await fetch(
            `http://${hostname}/absolute-path/endpoint-json`,
            { method: "get" },
        );
        expect(res.status).to.equal(200);
    });

    test("GET - should find js file", async () => {
        const res = await fetch(
            `http://${hostname}/absolute-path/endpoint-js`,
            { method: "get" },
        );
        expect(res.status).to.equal(200);
    });

    test("GET - should handle missing file", async () => {
        const res = await fetch(`http://${hostname}/absolute-path/missing`, {
            method: "get",
        });
        const body = normalizePath(await res.text());
        expect(res.status).to.equal(500);
        expect(body).toMatchInlineSnapshot(
            `"Error: Error: Cannot find file matching glob "<rootDir>/test/paths/mocks/missing.*{js,json}""`,
        );
    });
});
