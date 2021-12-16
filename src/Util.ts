export namespace Util {
    export function Clone<T>(obj: T): T {
        return JSON.parse(JSON.stringify(obj))
    }

    export function Clamp(num: number, min: number, max: number): number {
        return Math.min(max, Math.max(min, num))
    }

    export function Range(min: number, max: number): Array<number> {
        return Array.from({ length: max - min + 1 }, (_, i) => i + min)
    }
}
