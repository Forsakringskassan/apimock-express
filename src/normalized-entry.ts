import { type Mock } from "./mockfile";

/**
 * @internal
 */
export interface NormalizedEntry {
    mockurl: string;
    mockdir: string;
    delay: number | undefined;
    inlineMock?: Mock;
}
