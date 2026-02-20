import path from "node:path";
import express from "express";
import mock from "./src/main";

/* eslint-disable-next-line sonarjs/x-powered-by -- only used for internal testing */
const app = express();
let server = null;

const mockConfig = [
    { url: "/api/", dir: "test/api" },
    { url: "/api2/", dir: "test/api" },
    { url: "/apiX/", dir: "test/apiX", delay: 1000 },
    { url: "/headers/", dir: "test/headers" },
    { url: "/relative-path", dir: "./test/paths/mocks" },
    { url: "/absolute-path", dir: path.resolve("test/paths/mocks") },
    { url: "/api/", dir: "test/apiX" }, // Intended to map same api url to several folders
];

mock.config(mockConfig);

app.use("/", (req, res, next) => {
    mock.mockRequest(req, res, next);
});

function startServer() {
    return new Promise((resolve, reject) => {
        server = app.listen(0, "127.0.0.1");
        server.once("error", (err) => {
            reject(err);
        });
        server.once("listening", () => {
            const addr = server.address();
            const hostname = `127.0.0.1:${addr.port}`;
            console.log("Example app listening at port", addr.port);
            resolve(hostname);
        });
    });
}

export async function setup({ provide }) {
    const hostname = await startServer();
    provide("hostname", hostname);
}

export function teardown() {
    if (!server) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        server.close((err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
            server = null;
        });
    });
}
