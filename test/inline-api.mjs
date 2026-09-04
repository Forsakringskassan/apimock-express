export default [
    {
        meta: { url: "/inline/resource", method: "GET" },
        defaultResponse: {
            status: 200,
            body: { message: "inline default response" },
        },
        responses: [
            {
                request: { parameters: { type: "premium" } },
                response: {
                    status: 201,
                    body: { message: "inline premium response" },
                },
            },
        ],
    },
    {
        meta: { url: "/inline/resource", method: "POST" },
        defaultResponse: {
            status: 200,
            body: { message: "inline post default response" },
        },
        responses: [
            {
                request: { body: { action: "create" } },
                response: {
                    status: 201,
                    body: { message: "inline post response" },
                },
            },
        ],
    },
    {
        meta: { url: "/inline-no-method/resource" },
        defaultResponse: { status: 200, body: {} },
    },
    {
        meta: { url: "/inline/path/:id", method: "GET" },
        defaultResponse: { status: 404, body: { message: "unknown path" } },
        responses: [
            {
                request: { parameters: { id: "123" } },
                response: {
                    status: 200,
                    body: { message: "path response 123" },
                },
            },
            {
                request: { parameters: { id: "456" } },
                response: {
                    status: 200,
                    body: { message: "path response 456" },
                },
            },
        ],
    },
    {
        meta: {
            url: "/inline-delay",
            method: "GET",
        },

        defaultResponse: {
            status: 200,
            delay: 1000,
            body: { message: "delayed response" },
        },
    },
];
