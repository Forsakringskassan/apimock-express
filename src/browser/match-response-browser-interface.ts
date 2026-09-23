import { type Mock } from "../mockfile";
import { type HttpMethod } from "./http-method";

/**
 * @internal
 */
export interface MatchResponseBrowserInterface {
    mockdata: Mock[];
    requestUrl: string;
    method: HttpMethod;
    body: string;
    bodyParameters: Record<string, unknown>;
    headers: Record<string, string | string[] | undefined>;
}
