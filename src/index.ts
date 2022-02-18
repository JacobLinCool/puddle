import EventEmitter from "events";
import type { Events } from "./types";

/**
 * Promise Pool
 */
export class Pool extends EventEmitter {
    /** The size of the pool */
    public size: number;
    private available: number;
    /** The tasks in the pool */
    public tasks: (() => Promise<unknown>)[];
    private queue: Promise<void>[];
    private resolves: ((value: unknown) => void)[];
    /** The results */
    public results: unknown[];

    /**
     * Creates a new Pool instance with the given size.
     * @param size The size of the pool
     */
    constructor(size = 1) {
        super();
        this.size = size;
        this.available = size;
        this.tasks = [];
        this.queue = [];
        this.resolves = [];
        this.results = [];
    }

    /** Subscribe to Event. */
    public on(event: Events, listener: (...args: unknown[]) => void): this {
        super.on(event, listener);
        return this;
    }

    /** Subscribe to Event, but only once. */
    public once(event: Events, listener: (...args: unknown[]) => void): this {
        super.once(event, listener);
        return this;
    }

    /** Remove listener from Event. */
    public removeListener(event: Events, listener: (...args: unknown[]) => void): this {
        super.removeListener(event, listener);
        return this;
    }

    /** Remove all listeners from Event. */
    public removeAllListeners(event?: Events): this {
        super.removeAllListeners(event);
        return this;
    }

    public emit(event: Events, ...args: unknown[]): boolean {
        return super.emit(event, ...args);
    }

    /** Add a task into the pool. */
    public push(task: () => Promise<unknown> | unknown): void {
        this.tasks.push(async () => task());
    }

    /**
     * Run the tasks in the pool.
     * @returns A promise that resolves when all tasks are done
     */
    public async go(): Promise<unknown[]> {
        this.emit("pool-start");
        this.available = this.size;
        this.queue = [];
        this.resolves = [];
        this.results = [];
        for (let i = 0; i < this.tasks.length; i++) {
            await this.isAvailable();
            this.queue.push(
                (async () => {
                    this.emit("task-start", i);
                    try {
                        const result = await this.tasks[i]();
                        this.results[i] = result;
                        if (this.resolves.length > 0) this.resolves.shift()?.(true);
                        this.emit("task-finish", i, result);
                    } catch (err) {
                        this.emit("task-error", i, err);
                    }
                })(),
            );
        }
        await Promise.all(this.queue);
        this.queue = [];
        this.emit("pool-end");
        return this.results;
    }

    /**
     * The alias of go().
     */
    public run(): Promise<unknown[]> {
        return this.go();
    }

    private isAvailable(): Promise<unknown> {
        return new Promise((resolve) => {
            if (this.available > 0) {
                this.available--;
                resolve(true);
            } else this.resolves.push(resolve);
        });
    }
}

export default Pool;
export { Events };
