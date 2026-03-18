import { describe, expect, inject, it } from "vitest";

const hostname = inject("hostname");

describe("examplefile", function () {
    it("nothing matches", async () => {
        expect.assertions(2);
        const requestbody = {};
        const res = await fetch(`http://${hostname}/api/examplefile`, {
            method: "post",
            body: JSON.stringify(requestbody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(res.status).to.equal(201);
        expect(body).to.deep.equal({
            message: "Nothing matches. Default response",
        });
    });

    it("one request parameter matches", async () => {
        expect.assertions(2);
        const requestbody = {};
        const res = await fetch(`http://${hostname}/api/examplefile?foo=bar`, {
            method: "post",
            body: JSON.stringify(requestbody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(res.status).to.equal(402);
        expect(body).to.deep.equal({
            message: "One parameter matches",
        });
    });

    it("two request parameters matches", async () => {
        expect.assertions(2);
        const requestbody = {};
        const res = await fetch(
            `http://${hostname}/api/examplefile?foo=bar&bar=foo`,
            {
                method: "post",
                body: JSON.stringify(requestbody),
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
        const body = await res.json();
        expect(res.status).to.equal(401);
        expect(body).to.deep.equal({
            message: "Two parameters matches",
        });
    });

    it("one body parameter matches", async () => {
        expect.assertions(2);
        const requestbody = { foo: "foo" };
        const res = await fetch(`http://${hostname}/api/examplefile`, {
            method: "post",
            body: JSON.stringify(requestbody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(res.status).to.equal(404);
        expect(body).to.deep.equal({
            message: "One body parameter matches",
        });
    });

    it("two body parameters matches", async () => {
        expect.assertions(2);
        const requestbody = {
            user: { firstname: "Luke", lastname: "Skywalker" },
        };
        const res = await fetch(`http://${hostname}/api/examplefile`, {
            method: "post",
            body: JSON.stringify(requestbody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(res.status).to.equal(403);
        expect(body).to.deep.equal({
            message: "Two body parameters matches",
        });
    });

    it("both request parameter and body matches", async () => {
        expect.assertions(2);
        const requestbody = { bar: "foo" };
        const res = await fetch(`http://${hostname}/api/examplefile?foo=bar`, {
            method: "post",
            body: JSON.stringify(requestbody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(res.status).to.equal(400);
        expect(body).to.deep.equal({
            message: "Both parameter and body matches",
        });
    });

    it("one body parameter matches. Default status", async () => {
        expect.assertions(2);
        const requestbody = { foo: "bar" };
        const res = await fetch(`http://${hostname}/api/examplefile`, {
            method: "post",
            body: JSON.stringify(requestbody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(body).to.deep.equal({
            message: "One body parameter matches. Default status",
        });
    });
});
