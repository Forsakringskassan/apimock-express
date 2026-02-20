import { describe, expect, inject, test } from "vitest";

const hostname = inject("hostname");

describe("Intercepted call", function () {
    test("Should handle when an earlier middleware intercepts request body", async () => {
        const res = await fetch(`http://${hostname}/api/intercepted`, {
            method: "get",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(body).to.deep.equal({ id: "api" });
    });
});
