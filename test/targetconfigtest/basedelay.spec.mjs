import { describe, expect, inject, it } from "vitest";

const hostname = inject("hostname");

describe("basedelay", function () {
    const DELAY_TIME = 1000;

    describe("simple mockformat", function () {
        it("get /api2/hello should not be delayed", async () => {
            expect.assertions(3);
            const starttime = Date.now();
            const expectedBody = { id: "api" };
            const res = await fetch(`http://${hostname}/api2/hello`, {
                method: "get",
            });
            const endtime = Date.now();
            const executionTime = endtime - starttime;
            const body = await res.json();
            expect(res.status).to.equal(200);
            expect(body).to.deep.equal(expectedBody);
            expect(executionTime).to.be.at.most(DELAY_TIME);
        });

        it("get /apiX/hello should be delayed", async () => {
            expect.assertions(3);
            const starttime = Date.now();
            const expectedBody = { id: "apiX" };
            const res = await fetch(`http://${hostname}/apiX/hello`, {
                method: "get",
            });
            const endtime = Date.now();
            const executionTime = endtime - starttime;
            const body = await res.json();
            expect(res.status).to.equal(200);
            expect(body).to.deep.equal(expectedBody);
            expect(executionTime).to.be.at.least(DELAY_TIME);
        });
    });

    describe("advanced mockformat", function () {
        it("get /api2/helloAdv should not be delayed", async () => {
            expect.assertions(3);
            const starttime = Date.now();
            const expectedBody = { id: "api" };
            const res = await fetch(`http://${hostname}/api2/helloAdv`, {
                method: "get",
            });
            const endtime = Date.now();
            const executionTime = endtime - starttime;
            const body = await res.json();
            expect(res.status).to.equal(200);
            expect(body).to.deep.equal(expectedBody);
            expect(executionTime).to.be.at.most(DELAY_TIME);
        });

        it("get /apiX/helloAdv should be delayed", async () => {
            expect.assertions(3);
            const starttime = Date.now();
            const expectedBody = { id: "apiX" };
            const res = await fetch(`http://${hostname}/apiX/helloAdv`, {
                method: "get",
            });
            const endtime = Date.now();
            const executionTime = endtime - starttime;
            const body = await res.json();
            expect(res.status).to.equal(200);
            expect(body).to.deep.equal(expectedBody);
            expect(executionTime).to.be.at.least(DELAY_TIME);
        });
    });
});
