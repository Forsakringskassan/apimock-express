export default {
    responses: [
        {
            request: {
                headers: {
                    "X-Foo": "1",
                },
            },
            response: {
                body: {
                    foo: "bar",
                },
            },
        },
    ],
    defaultResponse: {
        body() {
            return {
                foo: "esm-body-fn",
            };
        },
    },
};
