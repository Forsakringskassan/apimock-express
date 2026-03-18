import { describe, expect, inject, it } from "vitest";

const hostname = inject("hostname");

describe("advanced mockformat", function () {
    describe("requestparameter", function () {
        it("should return the response for the first requestparameter match", async () => {
            expect.assertions(3);
            const res = await fetch(
                `http://${hostname}/api/advanced/requestparameter?foo=foo`,
                { method: "get" },
            );
            const body = await res.json();
            expect(res.status).to.equal(400);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foo" });
        });

        it("should return the response for the second requestparameter match", async () => {
            expect.assertions(3);
            const res = await fetch(
                `http://${hostname}/api/advanced/requestparameter?foo=bar`,
                { method: "get" },
            );
            const body = await res.json();
            expect(res.status).to.equal(200);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "bar" });
        });

        it("should return the default response if no match in requestparameter value", async () => {
            expect.assertions(3);
            const res = await fetch(
                `http://${hostname}/api/advanced/requestparameter?foo=asdf`,
                { method: "get" },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("should return the default response if no match in requestparameter name", async () => {
            expect.assertions(3);
            const res = await fetch(
                `http://${hostname}/api/advanced/requestparameter?bar=asdf`,
                { method: "get" },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("should return an error if no match and no default response", async () => {
            expect.assertions(3);
            const res = await fetch(
                `http://${hostname}/api/advanced/requestparameter_no_defaultresponse`,
                { method: "get" },
            );
            const body = await res.json();
            expect(res.status).to.equal(500);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ error: "No response could be found" });
        });

        it("should return the default response if no requestparameters in mockfile", async () => {
            expect.assertions(3);
            const res = await fetch(
                `http://${hostname}/api/advanced/requestparameter_no_parameters`,
                { method: "get" },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });
    });

    describe("requestparameters", function () {
        it("should return the default response if only one of two requestparameters matches", async () => {
            expect.assertions(3);
            const res = await fetch(
                `http://${hostname}/api/advanced/requestparameters?foo=bar`,
                { method: "get" },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("should return the answer for both requestparameters match", async () => {
            expect.assertions(3);
            const res = await fetch(
                `http://${hostname}/api/advanced/requestparameters?foo=bar&bar=foo`,
                { method: "get" },
            );
            const body = await res.json();
            expect(res.status).to.equal(401);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foobar" });
        });
    });
});
