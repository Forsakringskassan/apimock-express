import { describe, expect, inject, it } from "vitest";

const hostname = inject("hostname");

/**
 * @param {string} value
 * @returns {string}
 */
function normalizePath(value) {
    return value.replace(process.cwd(), "<rootDir>").replaceAll("\\", "/");
}

describe("relative path mocks", function () {
    it("get - should find json file", async () => {
        expect.assertions(1);
        const res = await fetch(
            `http://${hostname}/relative-path/endpoint-json`,
            { method: "get" },
        );
        expect(res.status).to.equal(200);
    });

    it("get - should find js file", async () => {
        expect.assertions(1);
        const res = await fetch(
            `http://${hostname}/relative-path/endpoint-js`,
            { method: "get" },
        );
        expect(res.status).to.equal(200);
    });

    it("get - should handle missing file", async () => {
        expect.assertions(2);
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
    it("get - should find json file", async () => {
        expect.assertions(1);
        const res = await fetch(
            `http://${hostname}/absolute-path/endpoint-json`,
            { method: "get" },
        );
        expect(res.status).to.equal(200);
    });

    it("get - should find js file", async () => {
        expect.assertions(1);
        const res = await fetch(
            `http://${hostname}/absolute-path/endpoint-js`,
            { method: "get" },
        );
        expect(res.status).to.equal(200);
    });

    it("get - should handle missing file", async () => {
        expect.assertions(2);
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
