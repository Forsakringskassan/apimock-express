import { describe, expect, inject, it } from "vitest";

const hostname = inject("hostname");

describe("js mocks", function () {
    it("plain file", async () => {
        expect.assertions(2);
        const requestbody = {};
        const res = await fetch(`http://${hostname}/api/js/file`, {
            method: "post",
            body: JSON.stringify(requestbody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(body).to.deep.equal({
            foo: "bar",
        });
    });

    it("default export", async () => {
        expect.assertions(2);
        const requestbody = {};
        const res = await fetch(`http://${hostname}/api/js/default-export`, {
            method: "post",
            body: JSON.stringify(requestbody),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(body).to.deep.equal({
            foo: "bar",
        });
    });

    it("remove relativ path for error message, file not found", () => {
        expect.assertions(1);
        expect("../../app/private/../v1".replace(/^(?:\.\.\/)+/, "")).to.equal(
            "app/private/../v1",
        );
    });

    it("commonjs file (.cjs)", async () => {
        expect.assertions(1);
        const res = await fetch(`http://${hostname}/api/js/commonjs`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(body).to.deep.equal({
            foo: "cjs",
        });
    });

    it("esm file (.mjs)", async () => {
        expect.assertions(1);
        const res = await fetch(`http://${hostname}/api/js/esm`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const body = await res.json();
        expect(body).to.deep.equal({
            foo: "esm",
        });
    });

    describe("mock saving values to a global state", () => {
        it("should get default value when no data saved", async () => {
            expect.assertions(1);
            const res = await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "get",
            });
            const body = await res.json();
            expect(body).to.deep.equal({
                no: "data-saved",
            });
        });

        it("should be able to post data and then retrieve the value", async () => {
            expect.assertions(1);
            await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "BREADCRUMB-ID": "foo",
                },
                body: JSON.stringify({ hej: "1" }),
            });
            await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "BREADCRUMB-ID": "bar",
                },
                body: JSON.stringify({ hej: "2" }),
            });

            /* Get first saved value based by BREADCRUMB-ID */
            const res = await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    "BREADCRUMB-ID": "foo",
                },
            });
            const body = await res.json();
            expect(body).to.deep.equal({
                hej: "1",
            });
        });

        it("saving plain text", async () => {
            expect.assertions(1);
            await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "post",
                headers: {
                    "Content-Type": "text/plain; charset=UTF-8",
                    "BREADCRUMB-ID": "plain-text",
                },
                body: "plain text to the rescue",
            });

            const res = await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "get",
                headers: {
                    "BREADCRUMB-ID": "plain-text",
                },
            });
            const body = await res.json();
            expect(body).to.deep.equal("plain text to the rescue");
        });

        it("saving a binary blob text", async () => {
            expect.assertions(1);
            const abc = new Blob(["Apimock"], { type: "text/plain" });
            const formData = new FormData();
            formData.append("text", abc, "text.txt");
            await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "post",
                headers: {
                    "BREADCRUMB-ID": "blob-text",
                },
                body: formData,
            });

            const res = await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "get",
                headers: {
                    "BREADCRUMB-ID": "blob-text",
                },
            });
            const body = await res.json();
            expect(body).to.deep.equal([
                {
                    contentType: "text/plain",
                    fileName: "text.txt",
                },
            ]);
        });

        it("saving multiple binary blob text", async () => {
            expect.assertions(1);
            const abc = new Blob(["Apimock"], { type: "text/plain" });
            const formData = new FormData();
            formData.append("text", abc, "text.txt");
            formData.append("another-file", abc, "file.txt");

            await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "post",
                headers: {
                    "BREADCRUMB-ID": "blob-text",
                },
                body: formData,
            });

            const res = await fetch(`http://${hostname}/api/js/body-fn`, {
                method: "get",
                headers: {
                    "BREADCRUMB-ID": "blob-text",
                },
            });
            const body = await res.json();
            expect(body).to.deep.equal([
                {
                    contentType: "text/plain",
                    fileName: "text.txt",
                },
                {
                    contentType: "text/plain",
                    fileName: "file.txt",
                },
            ]);
        });

        it("reqeust function", async () => {
            expect.assertions(1);
            const res = await fetch(`http://${hostname}/api/js/request-fn`, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const body = await res.json();
            expect(body).to.deep.equal({
                foo: "bar",
            });
        });
    });

    // Invalid format, which we still need to support
    it("should support invalid format where mock returns a string instead of object", async () => {
        expect.assertions(1);
        const res = await fetch(`http://${hostname}/api/js/invalid-stringify`);

        expect(await res.json()).to.deep.equal({
            invalidFormat: "support will be removed",
        });
    });

    it("should support response as function", async () => {
        expect.assertions(2);
        const res = await fetch(`http://${hostname}/api/js/response-function`, {
            method: "post",
            headers: {
                "Content-Type": "text/plain; charset=UTF-8",
            },
            body: "my request body",
        });
        expect(res.status).to.equal(201);
        expect(await res.text()).eq("my response body");
    });

    describe("request parameters", () => {
        it("should pass empty object to response function when there are no parameters in url", async () => {
            expect.assertions(2);
            const res = await fetch(
                `http://${hostname}/api/js/response-function`,
            );
            expect(res.status).to.equal(200);
            const jsonRes = await res.json();
            expect(jsonRes.parameters).to.deep.equal({});
        });

        it("should pass object to response function when there is a single parameter in url", async () => {
            expect.assertions(2);
            const res = await fetch(
                `http://${hostname}/api/js/response-function?foo=foolish`,
            );
            expect(res.status).to.equal(200);
            const jsonRes = await res.json();
            expect(jsonRes.parameters).to.deep.equal({
                foo: "foolish",
            });
        });

        it("should pass object to response function when there are multiple parameters in url", async () => {
            expect.assertions(2);
            const res = await fetch(
                `http://${hostname}/api/js/response-function?foo=foolish&bar=barish`,
            );
            expect(res.status).to.equal(200);
            const jsonRes = await res.json();
            expect(jsonRes.parameters).to.deep.equal({
                foo: "foolish",
                bar: "barish",
            });
        });

        it("should pass object to response function when there is an encoded parameter in url", async () => {
            expect.assertions(2);
            const res = await fetch(
                `http://${hostname}/api/js/response-function?foo=foolish%20value`,
            );
            expect(res.status).to.equal(200);
            const jsonRes = await res.json();
            expect(jsonRes.parameters).to.deep.equal({
                foo: "foolish value",
            });
        });

        it("should pass object to response function when there is a parameter without value", async () => {
            expect.assertions(2);
            const res = await fetch(
                `http://${hostname}/api/js/response-function?foo`,
            );
            expect(res.status).to.equal(200);
            const jsonRes = await res.json();
            expect(jsonRes.parameters).to.deep.equal({
                foo: "",
            });
        });
    });
});
