/**
 * Make sure that delay is a number or return a 0
 *
 * @internal
 */
export function parseDelay(delay: number | string | undefined): number {
    if (delay === undefined) {
        return 0;
    }
    const parsed = Number(delay);
    if (!Number.isNaN(parsed) && Number.isFinite(parsed)) {
        return parsed;
    }
    return 0;
}
