// @vitest-environment happy-dom

import { describe, expect, it, vi } from "vitest";
import { getCookies } from "./get-cookies";

describe("getCookies", function () {
    it("parse cookies into object", () => {
        expect.assertions(1);
        vi.spyOn(document, "cookie", "get").mockImplementation(
            () =>
                "tz=Europe%2FStockholm; preferredMode=light; _octo=GH__; cpuBucket=lg",
        );
        expect(getCookies()).toEqual({
            _octo: "GH__",
            cpuBucket: "lg",
            preferredMode: "light",
            tz: "Europe/Stockholm",
        });
    });

    it("should generate empty object if no cookies defined", () => {
        expect.assertions(1);
        vi.spyOn(document, "cookie", "get").mockImplementation(() => "");
        expect(getCookies()).toEqual({});
    });
});
