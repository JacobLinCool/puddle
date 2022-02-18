# puddle

Pooling? Maybe.

## Usage

```javascript
import Pool from "@jacoblincool/puddle";
// const Pool = require("@jacoblincool/puddle");

// An example task
async function task(id) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return id;
}

// Create a pool with a maximum of 4 tasks
const pool = new Pool(4);

// Add tasks to the pool
for (let i = 0; i < 20; i++) {
    pool.push(() => task(i + 1));
}

// Subscribe to the pool's events
pool.on("task-start", (idx) => {
    console.log(`Task ${idx} started`);
});
pool.on("task-finish", (idx, result) => {
    console.log(`Task ${idx} ended with result ${result}`);
});

// Run the tasks
const results = await pool.go();
console.log(results);
```
