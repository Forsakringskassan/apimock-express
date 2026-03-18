import fs from "node:fs";
import { describe, expect, inject, it } from "vitest";

const hostname = inject("hostname");

describe("simple mockformat", function () {
    it("get /api/simple/users/ should return test/api/simple/users.json", async () => {
        expect.assertions(3);
        const expectedBody = fs.readFileSync("test/api/simple/users.json", {
            encoding: "utf8",
        });
        const res = await fetch(`http://${hostname}/api/simple/users/`, {
            method: "get",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(res.headers.get("content-type")).to.equal(
            "application/json;charset=UTF-8",
        );
        expect(body).to.deep.equal(JSON.parse(expectedBody));
    });

    it("get /api/simple/users/1 should return test/api/simple/users/1.json", async () => {
        expect.assertions(3);
        const expectedBody = fs.readFileSync("test/api/simple/users/1.json", {
            encoding: "utf8",
        });
        const res = await fetch(`http://${hostname}/api/simple/users/1`, {
            method: "get",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(res.headers.get("content-type")).to.equal(
            "application/json;charset=UTF-8",
        );
        expect(body).to.deep.equal(JSON.parse(expectedBody));
    });

    it("post /api/simple/users/ should return test/api/simple/users_post.json", async () => {
        expect.assertions(3);
        const expectedBody = fs.readFileSync(
            "test/api/simple/users_post.json",
            {
                encoding: "utf8",
            },
        );
        const res = await fetch(`http://${hostname}/api/simple/users/`, {
            method: "post",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(res.headers.get("content-type")).to.equal(
            "application/json;charset=UTF-8",
        );
        expect(body).to.deep.equal(JSON.parse(expectedBody));
    });

    it("put /api/simple/users/ should return test/api/simple/users/1_put.json", async () => {
        expect.assertions(3);
        const expectedBody = fs.readFileSync(
            "test/api/simple/users/1_put.json",
            {
                encoding: "utf8",
            },
        );
        const res = await fetch(`http://${hostname}/api/simple/users/1`, {
            method: "put",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(res.headers.get("content-type")).to.equal(
            "application/json;charset=UTF-8",
        );
        expect(body).to.deep.equal(JSON.parse(expectedBody));
    });

    it("delete /api/simple/users/ should return test/api/simple/users/1_delete.json", async () => {
        expect.assertions(3);
        const expectedBody = fs.readFileSync(
            "test/api/simple/users/1_delete.json",
            { encoding: "utf8" },
        );
        const res = await fetch(`http://${hostname}/api/simple/users/1`, {
            method: "delete",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(res.headers.get("content-type")).to.equal(
            "application/json;charset=UTF-8",
        );
        expect(body).to.deep.equal(JSON.parse(expectedBody));
    });

    it("path not found should return an error", async () => {
        expect.assertions(3);
        const expectedBody = "Error: Cannot find file matching glob";
        const res = await fetch(`http://${hostname}/api/simple/users/1234`, {
            method: "get",
        });
        const body = await res.text();
        expect(res.status).to.equal(500);
        expect(res.headers.get("content-type")).to.equal(
            "text/html; charset=utf-8",
        );
        expect(body).to.have.string(expectedBody);
    });

    it("get /api/apiX should get find file in apiX-folder", async () => {
        expect.assertions(3);
        const res = await fetch(`http://${hostname}/api/apiX`, {
            method: "get",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(res.headers.get("content-type")).to.equal(
            "application/json;charset=UTF-8",
        );
        expect(body).to.deep.equal({ id: "apiX" });
    });

    it("get /api/dir/ should return test/api/dir/__get.json", async () => {
        expect.assertions(3);
        const expectedBody = fs.readFileSync("test/api/dir/__get.json", {
            encoding: "utf8",
        });
        const res = await fetch(`http://${hostname}/api/dir`, {
            method: "get",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(res.headers.get("content-type")).to.equal(
            "application/json;charset=UTF-8",
        );
        expect(body).to.deep.equal(JSON.parse(expectedBody));
    });

    it("post /api/dir/ should return test/api/dir/__post.json", async () => {
        expect.assertions(3);
        const expectedBody = fs.readFileSync("test/api/dir/__post.json", {
            encoding: "utf8",
        });
        const res = await fetch(`http://${hostname}/api/dir`, {
            method: "post",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(res.headers.get("content-type")).to.equal(
            "application/json;charset=UTF-8",
        );
        expect(body).to.deep.equal(JSON.parse(expectedBody));
    });
});
