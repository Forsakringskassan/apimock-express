export default {
    defaultResponse(req) {
        return {
            status: 200,
            body: req,
            delay: 0,
        };
    },
};
