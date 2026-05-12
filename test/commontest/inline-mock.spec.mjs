import { describe, expect, inject, it } from "vitest";

const hostname = inject("hostname");

describe("inline mock", function () {
    it("should return the default response when no request parameter matches", async () => {
        expect.assertions(2);
        const res = await fetch(`http://${hostname}/inline/resource`, {
            method: "get",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(body).to.deep.equal({ message: "inline default response" });
    });

    it("should return the matched response for a matching request parameter", async () => {
        expect.assertions(2);
        const res = await fetch(
            `http://${hostname}/inline/resource?type=premium`,
            { method: "get" },
        );
        const body = await res.json();
        expect(res.status).to.equal(201);
        expect(body).to.deep.equal({ message: "inline premium response" });
    });

    it("should return the matched response for a matching post body", async () => {
        expect.assertions(2);
        const res = await fetch(`http://${hostname}/inline/resource`, {
            method: "post",
            body: JSON.stringify({ action: "create" }),
            headers: { "Content-Type": "application/json" },
        });
        const body = await res.json();
        expect(res.status).to.equal(201);
        expect(body).to.deep.equal({ message: "inline post response" });
    });

    it("config should throw when inline mock is missing meta.url", async () => {
        expect.assertions(1);
        const { default: apimock } = await import("../../src/main");
        expect(() =>
            apimock.config({ defaultResponse: { status: 200, body: {} } }),
        ).toThrow("Inline Mock must have meta.url defined");
    });

    it("should return 500 when requesting an inline mock missing meta.method", async () => {
        expect.assertions(1);
        const res = await fetch(
            `http://${hostname}/inline-no-method/resource`,
            {
                method: "get",
            },
        );
        expect(res.status).to.equal(500);
    });
});
