export default {
    async defaultResponse(req) {
        await Promise.resolve();
        return {
            status: 200,
            body: req,
            delay: 0,
        };
    },
};
