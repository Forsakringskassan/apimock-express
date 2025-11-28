# @forsakringskassan/apimock-express

> A middleware for the grunt-contrib-connect plugin that mocks a REST api with json-files from the filesystem. Makes it easy to develop and test your client code independent of the server.

This was originally forked from [grunt-connect-apimock][grunt-connect-apimock] via the Express fork [apimock-express][apimock-express].

[grunt-connect-apimock]: https://bitbucket.org/ljohansson/grunt-connect-apimock/src/master/
[apimock-express]: https://bitbucket.org/bjorn-persson/apimock-express/src/master/

Major differences from the original:

- Works with both Express and Connect (without specifically requiring Grunt).
- Supports both `.mjs/.cjs/.js` and `.json` mocks.
- Supports wildcards as the final path component.
- Improved and configurable logging.
- Helpers such as `defineMock` to assist IDE writing mocks.
- Typescript support.
- Builtin Vite Plugin.

## Usage

> npm install --save-dev @forsakringskassan/apimock-express

### With Connect

```js
const apimock = require("@forsakringskassan/apimock-express");
const http = require("http");
const connect = require("connect");

const app = connect();

/* setup mocks */
apimock.config([
    { url: "/api/foo", dir: "tests/mock/foo" },
    { url: "/api/bar", dir: "tests/mock/bar" },
]);

/* install middleware */
app.use("/", apimock.mockRequest);

http.createServer(app).listen(3000);
```

### With Express

```js
const apimock = require("@forsakringskassan/apimock-express");
const express = require("express");

const app = express();

/* setup mocks */
apimock.config([
    { url: "/api/foo", dir: "tests/mock/foo" },
    { url: "/api/bar", dir: "tests/mock/bar" },
]);

/* install middleware */
app.use("/", apimock.mockRequest);

app.listen(3000);
```

### With Vite

```ts
import { defineConfig } from "vite";
import { vitePlugin as apimockPlugin } from "@forsakringskassan/apimock-express";

export default defineConfig({
    plugins: [
        apimockPlugin([
            { url: "/api/foo", dir: "tests/mock/foo" },
            { url: "/api/bar", dir: "tests/mock/bar" },
        ]),
    ],
});
```

### With Vue CLI

`vue.config.js`

```js
const { defineConfig } = require("@vue/cli-service");
const apimock = require("@forsakringskassan/apimock-express");

apimock.config([
    { url: "/api/foo", dir: "tests/mock/foo" },
    { url: "/api/bar", dir: "tests/mock/bar" },
]);

module.exports = defineConfig({
    devServer: {
        before(app) {
            /* install middleware */
            app.use("*", apimock.mockRequest);
        },
    },
});
```

## Mock file and directory structure

The mocked API consistst of a number of `.mjs/.cjs/.js` or `.json` files in a directory structure that represents the API.

E.g. with this configuration `{ "url": "/myApp/api/", "dir": "mymockdirectory" }`, then apimock works like this:

| Method   | Request              | Filename                              |
| -------- | -------------------- | ------------------------------------- |
| `GET`    | `/myApp/api/users`   | `mymockdirectory/users.json`          |
| `POST`   | `/myApp/api/users`   | `mymockdirectory/users_post.json`     |
| `GET`    | `/myApp/api/users/1` | `mymockdirectory/users/1.json`        |
| `PUT`    | `/myApp/api/users/1` | `mymockdirectory/users/1_put.json`    |
| `DELETE` | `/myApp/api/users/1` | `mymockdirectory/users/1_delete.json` |

The format of the files can be in a simple or an advanced format.

- When using the simple format, the file content will be returned as the body of the response and http-status 200.
- When using the advanced format, it is possible to specify different responses and different http-status depending on the request parameters, body parameters, request headers or cookies of the request.

### Wildcard / global file

If a file with the format `__default.json` exists in the folder, that one will be used if a specific file is not found.

## Mock Configuration

### `apimock.config`

**Type:** `object` or `array` of objects

An object containing the config of the apimock.
See below.
Can also be an array of objects if you want to mock different url:s to separate directories.

```js
apimock.config([
    { url: "/api1/", dir: "test/api1" },
    { url: "/api2/", dir: "test/api2", delay: 500 },
]);
```

#### `url`

**Type:** `String`

**Required:** yes

The beginning of the url for your REST-api that you want to mock.

#### `dir`

**Type:** `String`

**Required:** yes

The directory where your mock files for the apimock is located.
The location is relative to the current working directory.

#### `delay`

**Type:** `Number`

**Required:** no

**Default value:** 0

The base delay (in milliseconds) for all requests to this url, before the mock will respond.

## File format

The mock files can be written as either JSON or JS in a simple or an advanced format.

Use the simple format if it is ok to get the same response body and HTTP-status 200 for any request data.

If you need to get different responses or HTTP-status depending on the request parameters, the request body, the request headers or cookies use the advanced format.

### Simple format

This is simple.
The content of the file will be returned as the body of the response with HTTP-status 200.

`mymockdirectory/users.json`:

```json
[
    { "userId": 1, "name": "Fred Flintstone" },
    { "userId": 2, "name": "Barney Rubble" }
]
```

### Advanced format

The apimock will switch to advanced format if the object in the file has the variable `responses` or/and the variable `defaultResponse ` on the root level that is != undefined.
If none of the variables are defined then the content is considered as simple format.

`mymockdirectory/users.json`:

```json
{
    "responses": [
        {
            "request": {
                "cookies": {
                    "myapi": "no-users"
                }
            },
            "response": {
                "status": 200,
                "body": []
            }
        }
    ],
    "defaultResponse": {
        "status": 200,
        "body": [
            { "userId": 1, "name": "Fred Flintstone" },
            { "userId": 2, "name": "Barney Rubble" }
        ]
    }
}
```

#### defaultResponse

**Type:** `Object`

**Required:** yes

The default response that will be retured if none of the requests in the responses array matches.

#### defaultResponse.status

**Type:** `Number`

**Required:** no

**Default value:** 200

The HTTP-status.

#### defaultResponse.body

**Type:** `Object`

**Required:** yes

The response body.

#### defaultResponse.delay

**Type:** `Number`

**Required:** no

**Default value:** 0

The delay in milliseconds before the mock will respond.

#### responses

**Type:** `Array`

**Required:** no

An array of objects that contains the required request and the response that will be returned.

#### responses.request

**Type:** `Object`

**Required:** yes

Describing the matching criteria.

#### responses.request.parameters

**Type:** `Object`

**Required:** no

Names and values of the request parametes that needs to be matched for this response.

#### responses.request.body

**Type:** `Object`

**Required:** no

Names and values of the request body parametes that needs to be matched for this response.

#### responses.request.headers

**Type:** `Object`

**Required:** no

Names and values of the request headers parametes that needs to be matched for this response.

#### responses.request.cookies

**Type:** `Object`

**Required:** no

Names and values of the request cookies that needs to be matched for this response.

#### responses.response

**Type:** `Object`

**Required:** yes

Describing the response that will be retured if the request matches.

#### responses.response.status

**Type:** `Number`

**Required:** no

**Default value:** 200

The HTTP-status.

#### responses.response.body

**Type:** `Object`

**Required:** yes

The response body.

#### responses.response.delay

**Type:** `Number`

**Required:** no

**Default value:** 0

The delay in milliseconds before the mock will respond.

## Examples

Different responses depending on the request parameters:

```json
{
    "responses": [
        {
            "request": {
                "parameters": {
                    "foo": "bar",
                    "bar": "foo"
                }
            },
            "response": {
                "status": 401,
                "body": {
                    "message": "Two parameters matches"
                }
            }
        },
        {
            "request": {
                "parameters": {
                    "foo": "bar"
                }
            },
            "response": {
                "status": 402,
                "body": {
                    "message": "One parameter matches"
                }
            }
        }
    ],
    "defaultResponse": {
        "status": 201,
        "body": {
            "message": "Nothing matches. Default response"
        }
    }
}
```

Different responses depending on the request body:

```json
{
    "responses": [
        {
            "request": {
                "body": {
                    "user": { "firstname": "Luke", "lastname": "Skywalker" }
                }
            },
            "response": {
                "status": 403,
                "body": {
                    "message": "Two body parameters matches"
                }
            }
        },
        {
            "request": {
                "body": {
                    "foo": "bar"
                }
            },
            "response": {
                "status": 404,
                "body": {
                    "message": "One body parameter matches"
                }
            }
        }
    ],
    "defaultResponse": {
        "status": 201,
        "body": {
            "message": "Nothing matches. Default response"
        }
    }
}
```

A combination of request parameter and request body

```json
{
    "responses": [
        {
            "request": {
                "parameters": {
                    "foo": "bar"
                },
                "body": {
                    "bar": "foo"
                }
            },
            "response": {
                "status": 400,
                "body": {
                    "message": "Both parameter and body matches"
                }
            }
        }
    ],
    "defaultResponse": {
        "status": 201,
        "body": {
            "message": "Nothing matches. Default response"
        }
    }
}
```

Different responses depending on the request headers:

```json
{
    "responses": [
        {
            "request": {
                "headers": {
                    "header1": "one",
                    "header2": "two"
                }
            },
            "response": {
                "status": 401,
                "body": {
                    "message": "When the headers header1=one and header2=two"
                }
            }
        }
    ],
    "defaultResponse": {
        "status": 201,
        "body": {
            "message": "Nothing matches. Default response"
        }
    }
}
```

Different responses depending on the request cookies:

```json
{
    "responses": [
        {
            "request": {
                "cookies": {
                    "foo": "foo"
                }
            },
            "response": {
                "status": 400,
                "body": {
                    "message": "When cookie foo=foo"
                }
            }
        }
    ],
    "defaultResponse": {
        "status": 201,
        "body": {
            "message": "Nothing matches. Default response"
        }
    }
}
```

Delaying a response:

```json
{
    "responses": [
        {
            "request": {
                "parameters": {
                    "foo": "foo"
                }
            },
            "response": {
                "status": 200,
                "body": {
                    "message": "Delayed 500 milliseconds"
                },
                "delay": 500
            }
        }
    ],
    "defaultResponse": {
        "status": 200,
        "body": {
            "message": "Delayed 1000 milliseconds"
        },
        "delay": 1000
    }
}
```

### Using Helpers

It is often simpler to setup mocks using the provided helper functions.

#### The `createMockByCookie(...)` Helper Function

The `createMockByCookie(...)` helper function sets up mock responses according to a specific cookie.
If used correctly, Typescript can also help to provide type safety for the cookie and its possible values.

```ts
import {
    createMockByCookie,
    type MockCookieValue,
} from "@forsakringskassan/apimock-express/helpers";

interface MyResponseType {
    message: string;
}

export const getSomethingMockCookie = {
    name: "api-get-something",
    values: {
        foo: "foo-200",
        bar: "bar-200",
        foobar: "foobar-500",
    },
} as const; // { ... } as const is important to get proper type safety

// The type below can also be used by consumer for getting the cookie name and its possible values
export type GetSomethingMockCookie = typeof getSomethingMockCookie;

export default createMockByCookie<
    MockCookieValue<GetSomethingMockCookie>,
    MyResponseType
>({
    meta: {
        title: "GET /something",
    },
    cookieName: getSomethingMockCookie.name,
    responses: {
        "foo-200": {
            label: "Foo (200)",
            body: { message: "yay" },
        },
        "bar-200": {
            label: "Bar (200)",
            body: { message: "nay" },
        },
        "foobar-500": {
            label: "Foo (500)",
            status: 500,
        },
    },
    defaultResponse: {
        label: "Default (200)",
        body: { message: "default" },
    },
});
```

### More Examples

For more examples see the tests in test/

## Browser mode

The matchRequest helper lets you run API mocks entirely in the browser.
It accepts an array of mock definitions (created with defineMock) and a native Fetch `Request` object, and returns a simulated Fetch `Response` that behaves like a real response.

```javascript
import { matchRequest } from "@forsakringskassan/apimock-express/browser";
import { defineMock } from "@forsakringskassan/apimock-express/helpers";

// Create basic mock
const mock = defineMock({
    meta: {
        url: "/private/foo/basic",
        method: "GET",
    },
    defaultResponse: {
        body: {
            foo: "bar",
        },
    },
});

const req = new Request("/private/foo/basic", { method: "GET" });
const fetchResponse = await matchRequest([mock], req);

console.log(fetchResponse.status); // => 200
console.log(await fetchResponse.json()); // => {"foo": "bar"}
```
