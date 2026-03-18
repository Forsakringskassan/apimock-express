import { describe, expect, inject, it } from "vitest";

const hostname = inject("hostname");

describe("intercepted call", function () {
    it("should handle when an earlier middleware intercepts request body", async () => {
        expect.assertions(2);
        const res = await fetch(`http://${hostname}/api/intercepted`, {
            method: "get",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(body).to.deep.equal({ id: "api" });
    });
});
