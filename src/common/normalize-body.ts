interface FileStub {
    fileName: string;
    contentType: string;
}

/**
 * @internal
 */
export function normalizeBody(
    headers: Record<string, string | string[] | undefined>,
    body: string,
): unknown {
    const contentTypeHeader = headers["content-type"];

    if (!contentTypeHeader) {
        return body;
    }

    const contentTypeValue = Array.isArray(contentTypeHeader)
        ? (contentTypeHeader[0] ?? "")
        : contentTypeHeader;

    const [type, params] = contentTypeValue.trim().toLowerCase().split(";", 2);

    switch (type) {
        case "application/json":
            try {
                return JSON.parse(body);
            } catch {
                return body;
            }
        case "multipart/form-data": {
            const boundary = params.split("=", 2)[1];
            let messages = body.split(new RegExp(`--${boundary}(?:--)?`, "i"));
            messages = messages.filter(Boolean);

            const files: FileStub[] = [];
            const contentTypeRegex = /content-type:\s*([^\n\r;]+)/i;
            const filenameRegex = /filename="(.*?)"/;
            for (const message of messages) {
                const contentType = contentTypeRegex.exec(message);
                const fileName = filenameRegex.exec(message);
                if (contentType && fileName) {
                    files.push({
                        contentType: contentType[1],
                        fileName: fileName[1],
                    });
                }
            }
            return files;
        }
        case "text/plain":
        default:
            return body;
    }
}
