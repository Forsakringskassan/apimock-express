import { describe, expect, inject, it } from "vitest";

const hostname = inject("hostname");

describe("advanced mockformat", function () {
    describe("cookies", function () {
        it("should return the response for the first cookie match", async () => {
            expect.assertions(3);
            const headers = {
                Cookie: "foo=foo",
            };
            const res = await fetch(`http://${hostname}/api/advanced/cookie`, {
                method: "get",
                headers,
            });
            const body = await res.json();
            expect(res.status).to.equal(400);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foo" });
        });

        it("should return the response for the second cookie match", async () => {
            expect.assertions(3);
            const headers = {
                Cookie: "foo=bar",
            };
            const res = await fetch(`http://${hostname}/api/advanced/cookie`, {
                method: "get",
                headers,
            });
            const body = await res.json();
            expect(res.status).to.equal(200);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "bar" });
        });

        it("should return the default response if no match", async () => {
            expect.assertions(3);
            const headers = {
                Cookie: "asdf=asdf",
            };
            const res = await fetch(`http://${hostname}/api/advanced/cookie`, {
                method: "get",
                headers,
            });
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("should return the default response if no cookies in mockfile", async () => {
            expect.assertions(3);
            const headers = {
                Cookie: "foo=foo",
            };
            const res = await fetch(
                `http://${hostname}/api/advanced/cookie_no_cookies`,
                {
                    method: "get",
                    headers,
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("should return the default response if no cookies in request", async () => {
            expect.assertions(3);
            const headers = {};
            const res = await fetch(`http://${hostname}/api/advanced/cookie`, {
                method: "get",
                headers,
            });
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });
    });
});
