import { matchRequest } from "@forsakringskassan/apimock-express/browser";
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

const fetchResponse = await matchRequest(
    mocks,
    new Request("/private/foo/basic"),
);

const fetchResponsePost = await matchRequest(
    mocks,
    new Request("/private/foo/basic", { method: "POST" }),
);

document.querySelector("#getResponse").textContent = JSON.stringify(
    await fetchResponse.json(),
);

document.querySelector("#postResponse").textContent = JSON.stringify(
    await fetchResponsePost.json(),
);
