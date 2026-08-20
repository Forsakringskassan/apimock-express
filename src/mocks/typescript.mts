import { defineMock } from "../helpers";

interface CustomInterface {
    content: string;
}

const response: CustomInterface = {
    content: "Response from typescript file",
};

export default defineMock({
    defaultResponse: {
        status: 201,
        body: response,
    },
});
