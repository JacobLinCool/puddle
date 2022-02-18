import Pool from "../";

async function t<T>(result: T, wait = 0): Promise<T> {
    await new Promise((r) => setTimeout(r, wait));
    return result;
}

describe("Pool", () => {
    it("should work", async () => {
        const pool = new Pool(5);
        for (let i = 0; i < 10; i++) {
            pool.push(() => t(i + 1, 100 - i * 10));
        }
        const results = await pool.go();
        expect(results).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
});
