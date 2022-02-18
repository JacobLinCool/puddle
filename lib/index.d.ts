import EventEmitter from 'events';

declare type Events = "pool-start" | "pool-end" | "task-start" | "task-finish" | "task-error";

declare class Pool extends EventEmitter {
    size: number;
    private available;
    tasks: (() => Promise<unknown>)[];
    private queue;
    private resolves;
    results: unknown[];
    constructor(size?: number);
    on(event: Events, listener: (...args: unknown[]) => void): this;
    once(event: Events, listener: (...args: unknown[]) => void): this;
    removeListener(event: Events, listener: (...args: unknown[]) => void): this;
    removeAllListeners(event?: Events): this;
    emit(event: Events, ...args: unknown[]): boolean;
    push(task: () => Promise<unknown> | unknown): void;
    go(): Promise<unknown[]>;
    run(): Promise<unknown[]>;
    private isAvailable;
}

export { Events, Pool, Pool as default };
