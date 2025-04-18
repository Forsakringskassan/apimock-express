import fs from "node:fs";
import { describe, expect, test } from "vitest";
import { hostname } from "../../test-server";

describe("Multiconfig", function () {
    test("Local config GET /api2/simple/users/ should return test/api/simple/users.json", async () => {
        const expectedBody = fs.readFileSync("test/api/simple/users.json", {
            encoding: "utf-8",
        });
        const res = await fetch(`http://${hostname}/api2/simple/users/`, {
            method: "get",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(body).to.deep.equal(JSON.parse(expectedBody));
    });

    test("Multiple config GET /api2/hello should return test/api/hello.json", async () => {
        const expectedBody = '{ "id": "api" }\n';
        const res = await fetch(`http://${hostname}/api2/hello`, {
            method: "get",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(body).to.deep.equal(JSON.parse(expectedBody));
    });

    test("Multiple config GET /apiX/hello should return test/apiX/hello.json", async () => {
        const expectedBody = '{ "id": "apiX" }\n';
        const res = await fetch(`http://${hostname}/apiX/hello`, {
            method: "get",
        });
        const body = await res.json();
        expect(res.status).to.equal(200);
        expect(body).to.deep.equal(JSON.parse(expectedBody));
    });
});
