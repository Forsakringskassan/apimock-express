import { describe, expect, inject, it } from "vitest";

const hostname = inject("hostname");

describe("advanced mockformat", function () {
    describe("errors", function () {
        it("should return the default response if only default response", async () => {
            expect.assertions(3);
            const res = await fetch(
                `http://${hostname}/api/advanced/only_defaultresponse`,
                { method: "get" },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("should return an empty string if no body in only default response", async () => {
            expect.assertions(3);
            const res = await fetch(
                `http://${hostname}/api/advanced/only_defaultresponse_no_body`,
                { method: "get" },
            );
            const body = await res.text();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.equal("");
        });

        it("should return the default status if no status in only default response", async () => {
            expect.assertions(3);
            const res = await fetch(
                `http://${hostname}/api/advanced/only_defaultresponse_no_status`,
                { method: "get" },
            );
            const body = await res.json();
            expect(res.status).to.equal(200);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("should return an error if the file is malformed", async () => {
            expect.assertions(3);
            const res = await fetch(
                `http://${hostname}/api/advanced/malformedfile`,
                { method: "get" },
            );
            const body = await res.json();
            expect(res.status).to.equal(500);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({
                error: "Malformed mockfile. See server log",
            });
        });

        it("should return an error if the input body is malformed", async () => {
            expect.assertions(3);
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter`,
                {
                    method: "post",
                    body: "{",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(500);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ error: "Malformed input body" });
        });

        it("should not parse the body, but return the default response if input body is not json", async () => {
            expect.assertions(3);
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter`,
                {
                    method: "post",
                    body: "foo=bar",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });
    });
});
