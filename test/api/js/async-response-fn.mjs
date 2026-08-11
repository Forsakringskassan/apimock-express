export default {
    meta: {
        url: "/advanced/async-mock",
        method: "GET",
    },
    async defaultResponse() {
        await Promise.resolve();
        return {
            status: 200,
            body: { async: "response" },
        };
    },
};
