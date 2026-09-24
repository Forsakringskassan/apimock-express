// eslint-disable-next-line import-x/extensions -- intended
import workerUrl from "./mockServiceWorker.js?url";
import { setupWorker } from "@forsakringskassan/apimock-express/browser";
import { defineMock } from "@forsakringskassan/apimock-express/helpers";

const mocks = [
    defineMock({
        meta: {
            url: "/private/foo/basic",
            method: "GET",
        },
        defaultResponse: {
            body: {
                mock: "GET",
            },
        },
    }),
    defineMock({
        meta: {
            url: "/private/foo/basic",
            method: "POST",
        },
        defaultResponse: {
            body: {
                mock: "POST",
            },
        },
    }),
];

console.log({ workerUrl });
await setupWorker(workerUrl, mocks, { type: "classic" });

const fetchResponse = await fetch("/private/foo/basic");

const fetchResponsePost = await fetch("/private/foo/basic", {
    method: "POST",
});

document.querySelector("#getResponse").textContent = JSON.stringify(
    await fetchResponse.json(),
);

document.querySelector("#postResponse").textContent = JSON.stringify(
    await fetchResponsePost.json(),
);
