export type EventArgsT<T> = any[];
export type EventCbT<T extends any[] | [] = any[]> = (...args: T)=>void;

export class HomeEvent {
    public readonly args: any[];
    constructor(public readonly name: string | number | symbol, ...args: any) {
        this.args = args;

    }
}