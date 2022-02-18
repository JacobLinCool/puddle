import EventEmitter from 'events';

declare type Events = "pool-start" | "pool-end" | "task-start" | "task-finish" | "task-error";

/**
 * Promise Pool
 */
declare class Pool extends EventEmitter {
    /** The size of the pool */
    size: number;
    private available;
    /** The tasks in the pool */
    tasks: (() => Promise<unknown>)[];
    private queue;
    private resolves;
    /** The results */
    results: unknown[];
    /**
     * Creates a new Pool instance with the given size.
     * @param size The size of the pool
     */
    constructor(size?: number);
    /** Subscribe to Event. */
    on(event: Events, listener: (...args: unknown[]) => void): this;
    /** Subscribe to Event, but only once. */
    once(event: Events, listener: (...args: unknown[]) => void): this;
    /** Remove listener from Event. */
    removeListener(event: Events, listener: (...args: unknown[]) => void): this;
    /** Remove all listeners from Event. */
    removeAllListeners(event?: Events): this;
    emit(event: Events, ...args: unknown[]): boolean;
    /** Add a task into the pool. */
    push(task: () => Promise<unknown> | unknown): void;
    /**
     * Run the tasks in the pool.
     * @returns A promise that resolves when all tasks are done
     */
    go(): Promise<unknown[]>;
    /**
     * The alias of go().
     */
    run(): Promise<unknown[]>;
    private isAvailable;
}

export { Events, Pool, Pool as default };
