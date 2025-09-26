import {state} from "./body-fn-global.mjs";

export default {
    defaultResponse: {
        body(req) {
            const key = req.headers['breadcrumb-id'];
            state.value.set(key, req.body);
            return {};
        },
    },
};
