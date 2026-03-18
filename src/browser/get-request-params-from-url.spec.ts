import { describe, expect, it } from "vitest";
import { getRequestParamsFromUrl } from "./get-request-params-from-url";

describe("getRequestParams", function () {
    it("should generate empty object if no params defined", () => {
        expect.assertions(1);
        expect(getRequestParamsFromUrl("/private/api")).toEqual({});
    });

    it("should generate object with parameters", () => {
        expect.assertions(1);
        expect(getRequestParamsFromUrl("/private/api?bar=foo&foo=bar")).toEqual(
            {
                bar: "foo",
                foo: "bar",
            },
        );
    });
});
