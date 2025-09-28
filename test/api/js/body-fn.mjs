import { state } from "./body-fn-global.mjs";

export default {
    meta: {
        url: "/advanced/reading-mock",
        method: "GET",
    },
    defaultResponse: {
        body(req) {
            const key = req.headers
                ? req.headers["breadcrumb-id"]
                : "defaultKey";
            return state.value.get(key) ?? { no: "data-saved" };
        },
    },
};
