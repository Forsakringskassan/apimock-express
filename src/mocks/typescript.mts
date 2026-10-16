import { defineMock } from "../helpers";

interface CustomInterface {
    content: string;
}

const response: CustomInterface = {
    content: "Response from typescript file",
};

/* eslint-disable-next-line unicorn/no-top-level-side-effects -- pure function */
export default defineMock({
    defaultResponse: {
        status: 201,
        body: response,
    },
});
