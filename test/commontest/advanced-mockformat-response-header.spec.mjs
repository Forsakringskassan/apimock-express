import { describe, expect, inject, it } from "vitest";

const hostname = inject("hostname");

describe("advanced mockformat", function () {
    describe("headers", function () {
        it("post /headers/sign should respond with 302 redirect", async () => {
            expect.assertions(2);
            const res = await fetch(`http://${hostname}/headers/redirect`, {
                method: "post",
                redirect: "manual",
            });
            expect(res.status).to.equal(302);
            expect(res.headers.get("location")).to.equal("https://google.com");
        });
    });
});
