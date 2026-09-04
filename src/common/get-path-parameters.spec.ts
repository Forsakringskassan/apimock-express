import { describe, expect, it } from "vitest";
import { getPathParameters } from "./get-path-parameters";

describe("getPathParameters", () => {
    it("should return undefined if the number of segments differs", () => {
        expect.assertions(2);
        expect(getPathParameters("/users", "/users/1")).toBeUndefined();
        expect(getPathParameters("/users/1", "/users")).toBeUndefined();
    });

    it("should return undefined if static segments do not match", () => {
        expect.assertions(2);
        expect(getPathParameters("/users", "/products")).toBeUndefined();
        expect(
            getPathParameters("/api/users", "/api/products"),
        ).toBeUndefined();
    });

    it("should return an empty object for a perfect match with no parameters", () => {
        expect.assertions(2);
        expect(getPathParameters("/users", "/users")).toEqual({});
        expect(getPathParameters("/api/v1/status", "/api/v1/status")).toEqual(
            {},
        );
    });

    it("should capture a single path parameter", () => {
        expect.assertions(1);
        const result = getPathParameters("/users/:id", "/users/123");
        expect(result).toEqual({ id: "123" });
    });

    it("should capture multiple path parameters", () => {
        expect.assertions(1);
        const result = getPathParameters(
            "/users/:userId/posts/:postId",
            "/users/alice/posts/456",
        );
        expect(result).toEqual({
            userId: "alice",
            postId: "456",
        });
    });

    it("should return undefined if a path parameter segment is empty in the request", () => {
        expect.assertions(1);
        expect(getPathParameters("/users/:id", "/users/")).toBeUndefined();
    });

    it("should handle leading slashes correctly", () => {
        expect.assertions(1);
        expect(getPathParameters("/users/:id", "/users/123")).toEqual({
            id: "123",
        });
    });

    it("should return undefined if a parameter name is missing (i.e., just ':')", () => {
        expect.assertions(1);
        expect(getPathParameters("/users/:", "/users/123")).toBeUndefined();
    });
});
