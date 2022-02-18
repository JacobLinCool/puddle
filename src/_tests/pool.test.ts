import Pool from "../";

async function t<T>(result: T, wait = 0): Promise<T> {
    await new Promise((r) => setTimeout(r, wait));
    return result;
}

async function test_simple() {
    const pool = new Pool(5);
    for (let i = 0; i < 20; i++) {
        pool.push(() => t(i + 1, 500));
    }

    let started = 0,
        finished = 0;
    pool.on("task-start", () => started++);
    pool.on("task-finish", () => finished++);

    let pool_started = false,
        pool_finished = false;
    pool.once("pool-start", () => (pool_started = true));
    pool.once("pool-end", () => (pool_finished = true));

    const START_TIME = Date.now();
    const results = await pool.go();
    const END_TIME = Date.now();

    expect(results).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
    expect(END_TIME - START_TIME <= 2100).toBe(true);
    expect(started).toBe(20);
    expect(finished).toBe(20);
    expect(pool_started).toBe(true);
    expect(pool_finished).toBe(true);
}

async function test_error() {
    const pool = new Pool(5);
    for (let i = 0; i < 20; i++) {
        pool.push(() => {
            if (i % 5 === 0) throw new Error("error");
            return t(i + 1, 500);
        });
    }

    let started = 0,
        finished = 0,
        errors = 0;
    pool.on("task-start", () => started++);
    pool.on("task-finish", () => finished++);
    pool.on("task-error", () => errors++);

    const START_TIME = Date.now();
    const results = await pool.go();
    const END_TIME = Date.now();

    expect(results).toEqual([undefined, 2, 3, 4, 5, undefined, 7, 8, 9, 10, undefined, 12, 13, 14, 15, undefined, 17, 18, 19, 20]);
    expect(END_TIME - START_TIME <= 2100).toBe(true);
    expect(started).toBe(20);
    expect(finished).toBe(16);
    expect(errors).toBe(4);
}

describe("Pool", () => {
    test("should work", test_simple);
    test("should work with error", test_error);
});
