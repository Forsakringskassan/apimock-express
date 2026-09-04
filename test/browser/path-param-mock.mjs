import { defineMock } from "../../src/helpers";

export default defineMock({
    meta: {
        url: "/user/:id",
        method: "GET",
    },
    responses: [
        {
            // Match all requests to /user/:id and handle the logic in a DynamicResponse
            request: {},
            response: async (req) => {
                const id = Math.trunc(Number(req.parameters.id));
                if (Number.isNaN(id)) {
                    return {
                        status: 200,
                        body: { name: "Invalid ID" },
                    };
                }
                if (id < 500) {
                    return {
                        status: 200,
                        body: { name: `User ${id} (Low ID)` },
                    };
                }
                return {
                    status: 200,
                    body: { name: `User ${id} (High ID)` },
                };
            },
        },
    ],
    defaultResponse: {
        status: 200,
        body: { name: "Unknown User" },
    },
});
