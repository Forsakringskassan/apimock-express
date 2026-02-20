import { describe, expect, inject, test } from "vitest";

const hostname = inject("hostname");

describe("Advanced mockformat", function () {
    describe("Headers", function () {
        test("POST /headers/sign should respond with 302 redirect", async () => {
            const res = await fetch(`http://${hostname}/headers/redirect`, {
                method: "post",
                redirect: "manual",
            });
            expect(res.status).to.equal(302);
            expect(res.headers.get("location")).to.equal("https://google.com");
        });
    });
});
