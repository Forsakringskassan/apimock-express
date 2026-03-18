import { describe, expect, inject, it } from "vitest";

const hostname = inject("hostname");

describe("advanced mockformat", function () {
    describe("bodyparameter", function () {
        it("should return the response for the first bodyparamter match", async () => {
            expect.assertions(3);
            const requestbody = { foo: "foo" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(402);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foo" });
        });

        it("should return the response for the second bodyparamter match", async () => {
            expect.assertions(3);
            const requestbody = { foo: "bar" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(200);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "bar" });
        });

        it("should return the default response if no match in bodyparameter value", async () => {
            expect.assertions(3);
            const requestbody = { foo: "asdf" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("should return the default response if no match in bodyparameter name", async () => {
            expect.assertions(3);
            const requestbody = { bar: "asdf" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
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
            const requestbody = { foo: "asdf" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter_no_defaultresponse`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(500);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({
                error: "No response could be found",
            });
        });

        it("should return the default response if no bodyparameters in mockfile", async () => {
            expect.assertions(3);
            const requestbody = { foo: "bar" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter_no_parameters`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
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

    describe("complex Bodyparameter", function () {
        it("should match two parameters on second level", async () => {
            expect.assertions(3);
            const requestbody = {
                user: {
                    firstname: "Luke",
                    lastname: "Skywalker",
                    address: { street: "Milkyway", zipcode: "12345" },
                },
                foo: "foo",
            };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter_complex_body`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(500);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({
                message: "Level 2. Firstname and lastname matches",
            });
        });

        it("should match one parameter on second level", async () => {
            expect.assertions(3);
            const requestbody = {
                user: {
                    firstname: "Luke",
                    lastname: "Macahan",
                    address: { street: "Milkyway", zipcode: "12345" },
                },
                foo: "foo",
            };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter_complex_body`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(501);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({
                message: "Level 2. Firstname matches",
            });
        });

        it("should match one parameter on third level", async () => {
            expect.assertions(3);
            const requestbody = {
                user: {
                    firstname: "Zeb",
                    lastname: "Macahan",
                    address: { street: "The wild west", zipcode: "55555" },
                },
                foo: "foo",
            };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter_complex_body`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(502);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({
                message: "Level 3. zipcode matches",
            });
        });

        it("should match one parameter on first level", async () => {
            expect.assertions(3);
            const requestbody = {
                user: {
                    firstname: "Zeb",
                    lastname: "Macahan",
                    address: { street: "The wild west", zipcode: "12345" },
                },
                foo: "bar",
            };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter_complex_body`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(503);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({
                message: "Level 1. foo matches",
            });
        });

        it("should handle a request that do not contain all of the mock parameters", async () => {
            expect.assertions(3);
            const requestbody = { foo: "bar" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter_complex_body`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(503);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({
                message: "Level 1. foo matches",
            });
        });

        it("should return the default answer if no match", async () => {
            expect.assertions(3);
            const requestbody = { asdf: "asdf" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameter_complex_body`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({
                message: "No match, default response",
            });
        });
    });

    describe("bodyparameters", function () {
        it("should return the default answer if only one of two bodyparameters matches", async () => {
            expect.assertions(3);
            const requestbody = { foo: "bar" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameters`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("should return the answer for both bodyparameters match", async () => {
            expect.assertions(3);
            const requestbody = { foo: "bar", bar: "foo" };
            const res = await fetch(
                `http://${hostname}/api/advanced/bodyparameters`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(403);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foobar" });
        });
    });

    describe("bodyparameter and requestparameter", function () {
        it("should return the default answer if only the requestparameter matches", async () => {
            expect.assertions(3);
            const requestbody = { asdf: "asdf" };
            const res = await fetch(
                `http://${hostname}/api/advanced/requestparameter_bodyparameter?foo=bar`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("should return the default answer if only the bodyparameter matches", async () => {
            expect.assertions(3);
            const requestbody = { bar: "foo" };
            const res = await fetch(
                `http://${hostname}/api/advanced/requestparameter_bodyparameter?asdf=asdf`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(201);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foofoofoo" });
        });

        it("should return the answer for requestparameter and bodyparameter match", async () => {
            expect.assertions(3);
            const requestbody = { bar: "foo" };
            const res = await fetch(
                `http://${hostname}/api/advanced/requestparameter_bodyparameter?foo=bar`,
                {
                    method: "post",
                    body: JSON.stringify(requestbody),
                    headers: { "Content-Type": "application/json" },
                },
            );
            const body = await res.json();
            expect(res.status).to.equal(404);
            expect(res.headers.get("content-type")).to.equal(
                "application/json;charset=UTF-8",
            );
            expect(body).to.deep.equal({ message: "foobar" });
        });
    });
});
