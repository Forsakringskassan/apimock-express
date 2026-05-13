export default {
    meta: {
        url: "/api/delay",
        method: "GET",
    },
    defaultResponse: {
        status: 200,
        delay: 1000,
        body: {
            message: "default",
        },
    },
};
