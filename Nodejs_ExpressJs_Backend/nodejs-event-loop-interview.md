# Node.js Event Loop - Interview Guide 🚀

## What is the Event Loop?

The **Event Loop** is the heart of Node.js that enables non-blocking I/O operations despite JavaScript being single-threaded. It offloads operations to the system kernel whenever possible.

> **Key Point**: Node.js is single-threaded for JavaScript execution, but uses multiple threads behind the scenes (libuv thread pool) for I/O operations.

---

## Event Loop Phases (6 Phases)

```
   ┌───────────────────────────┐
┌─>│         timers            │  ← setTimeout, setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  ← I/O callbacks deferred from previous iteration
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  ← internal use only
│  └─────────────┬─────────────┘      
│  ┌─────────────┴─────────────┐
│  │           poll            │  ← retrieve new I/O events, execute I/O callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │          check            │  ← setImmediate callbacks
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
└──┤      close callbacks      │  ← socket.on('close'), cleanup
   └───────────────────────────┘
```

### Phase Details:

| Phase | What Happens | Examples |
|-------|-------------|----------|
| **1. Timers** | Executes callbacks scheduled by `setTimeout()` and `setInterval()` | `setTimeout(() => {}, 100)` |
| **2. Pending Callbacks** | Executes I/O callbacks deferred to next iteration | System errors like TCP errors |
| **3. Idle/Prepare** | Internal use only by Node.js | — |
| **4. Poll** | Retrieves new I/O events, executes I/O related callbacks | File read, network requests |
| **5. Check** | `setImmediate()` callbacks execute here | `setImmediate(() => {})` |
| **6. Close Callbacks** | Close event callbacks | `socket.on('close')` |

---

## Microtasks vs Macrotasks (CRITICAL!)

### Microtasks (Higher Priority - Run BETWEEN phases)
- `process.nextTick()` ← **Highest priority**
- `Promise.then()`, `Promise.catch()`, `Promise.finally()`
- `queueMicrotask()`

### Macrotasks (Lower Priority - Run IN phases)
- `setTimeout()`
- `setInterval()`
- `setImmediate()`
- I/O operations
- UI rendering (browser)

### Execution Order:
```
1. Current synchronous code (Call Stack)
2. process.nextTick() queue (ALL of them)
3. Microtask queue - Promises (ALL of them)
4. One phase of Event Loop (one macrotask or batch)
5. Repeat from step 2
```

---

## Common Interview Questions & Answers

### Q1: What's the output?

```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

process.nextTick(() => console.log('4'));

console.log('5');
```

**Answer**: `1, 5, 4, 3, 2`

**Explanation**:
1. `1` - Sync code runs first
2. `5` - Sync code continues
3. `4` - `process.nextTick` runs before promises
4. `3` - Promise microtask runs next
5. `2` - `setTimeout` macrotask runs last

---

### Q2: setTimeout vs setImmediate

```javascript
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
```

**Answer**: Order is **non-deterministic** in main module!

**But inside I/O callback, `setImmediate` ALWAYS runs first**:

```javascript
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => console.log('timeout'), 0);
  setImmediate(() => console.log('immediate'));
});
// Output: immediate, timeout (ALWAYS)
```

**Why?** After I/O, we're in the poll phase. Check phase (setImmediate) comes before timers in next iteration.

---

### Q3: process.nextTick vs setImmediate

| Feature | process.nextTick | setImmediate |
|---------|-----------------|--------------|
| When | After current operation, before event loop continues | Next iteration of event loop (check phase) |
| Priority | Higher | Lower |
| Can starve I/O? | Yes ⚠️ | No |
| Use case | Critical async callbacks | Yielding to event loop |

```javascript
setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));
// Output: nextTick, setImmediate
```

---

### Q4: What's the output? (Nested callbacks)

```javascript
console.log('start');

setTimeout(() => {
  console.log('timeout 1');
  Promise.resolve().then(() => console.log('promise inside timeout'));
}, 0);

setTimeout(() => {
  console.log('timeout 2');
}, 0);

Promise.resolve().then(() => console.log('promise 1'));

console.log('end');
```

**Answer**: `start, end, promise 1, timeout 1, promise inside timeout, timeout 2`

**Explanation**: 
- Sync: start, end
- Microtasks: promise 1
- Timer 1 runs, then its microtask (promise inside timeout)
- Timer 2 runs

---

### Q5: Blocking the Event Loop

```javascript
// ❌ BAD - Blocks event loop
function blockingOperation() {
  const end = Date.now() + 5000;
  while (Date.now() < end) {} // CPU-bound blocking
}

// ✅ GOOD - Non-blocking with worker threads
const { Worker } = require('worker_threads');
```

**How to avoid blocking:**
1. Use Worker Threads for CPU-intensive tasks
2. Break large tasks into smaller chunks with `setImmediate()`
3. Use streams for large data processing
4. Offload to child processes

---

### Q6: Why doesn't setTimeout(fn, 0) execute immediately?

**Answer**: 
1. There's a minimum delay (typically 1ms in Node.js, 4ms in browsers)
2. It schedules for the **next** event loop iteration
3. Must wait for current call stack to empty
4. Must wait for all microtasks to complete

---

### Q7: Promise.resolve vs process.nextTick execution order

```javascript
Promise.resolve().then(() => console.log('promise'));
process.nextTick(() => console.log('nextTick'));
```

**Output**: `nextTick, promise`

**Why?** `process.nextTick` queue is processed before the microtask (Promise) queue.

---

### Q8: Complex Output Question

```javascript
console.log('1');

setTimeout(() => {
  console.log('2');
  process.nextTick(() => console.log('3'));
  Promise.resolve().then(() => console.log('4'));
}, 0);

Promise.resolve().then(() => {
  console.log('5');
  process.nextTick(() => console.log('6'));
});

process.nextTick(() => console.log('7'));

console.log('8');
```

**Answer**: `1, 8, 7, 5, 6, 2, 3, 4`

**Explanation**:
1. `1` - Sync
2. `8` - Sync
3. `7` - nextTick (first in queue)
4. `5` - Promise microtask
5. `6` - nextTick created by promise (runs before next macrotask)
6. `2` - setTimeout callback
7. `3` - nextTick inside setTimeout
8. `4` - Promise inside setTimeout

---

### Q9: setImmediate inside setImmediate

```javascript
setImmediate(() => {
  console.log('immediate 1');
  setImmediate(() => console.log('immediate 2'));
});

setImmediate(() => console.log('immediate 3'));
```

**Output**: `immediate 1, immediate 3, immediate 2`

**Why?** `immediate 2` is scheduled in the next check phase iteration.

---

### Q10: How does Node.js handle async operations internally?

**Answer**:
1. **JavaScript code** runs on V8 engine (single thread)
2. **Async operations** are delegated to libuv
3. **libuv** uses:
   - OS kernel for network I/O (epoll/kqueue/IOCP)
   - Thread pool (4 threads default) for file I/O, DNS, crypto
4. **Callbacks** are queued when operations complete
5. **Event loop** picks callbacks and executes them

---

## Event Loop Starvation

### What is it?
When microtasks (especially `process.nextTick`) keep adding more microtasks, preventing the event loop from advancing.

```javascript
// ⚠️ DANGER: This will starve the event loop
function recursive() {
  process.nextTick(recursive);
}
recursive();

// setTimeout will NEVER run!
setTimeout(() => console.log('This never prints'), 0);
```

### How to prevent:
Use `setImmediate` instead for recursive operations:

```javascript
function recursive() {
  setImmediate(recursive); // Allows other callbacks to run
}
```

---

## libuv Thread Pool

Node.js uses **libuv** library which has a thread pool (default: 4 threads).

### Operations using thread pool:
- File system operations (fs)
- DNS lookups (dns.lookup)
- Crypto operations
- Zlib compression

### Increase thread pool size:
```javascript
process.env.UV_THREADPOOL_SIZE = 8; // Max: 1024
```

---

## Real-World Analogy 🎯

Think of a **restaurant**:
- **Single Chef (JavaScript)**: Can only cook one dish at a time
- **Kitchen Helpers (Thread Pool)**: Prep ingredients, wash dishes in parallel
- **Order System (Event Loop)**: Manages what the chef cooks next
- **VIP Orders (nextTick)**: Always handled before regular orders
- **Online Orders (Promises)**: Second priority after VIP
- **Walk-in Customers (setTimeout)**: Served in the regular queue

---

## Execution Priority Pyramid

```
         ▲ HIGHEST PRIORITY
         │
    ┌────┴────┐
    │  Sync   │  ← Current call stack
    │  Code   │
    └────┬────┘
    ┌────┴────┐
    │nextTick │  ← process.nextTick()
    │ Queue   │
    └────┬────┘
    ┌────┴────┐
    │Microtask│  ← Promise.then(), queueMicrotask()
    │ Queue   │
    └────┬────┘
    ┌────┴────┐
    │Macrotask│  ← setTimeout, setInterval, I/O
    │ Queue   │
    └────┬────┘
    ┌────┴────┐
    │  Check  │  ← setImmediate()
    │ Phase   │
    └─────────┘
         │
         ▼ LOWEST PRIORITY
```

---

## Quick Reference Code

```javascript
// Priority demonstration
console.log('1 - Sync Start');

process.nextTick(() => console.log('2 - nextTick'));

Promise.resolve().then(() => console.log('3 - Promise'));

setImmediate(() => console.log('4 - setImmediate'));

setTimeout(() => console.log('5 - setTimeout'), 0);

console.log('6 - Sync End');

/* OUTPUT:
1 - Sync Start
6 - Sync End
2 - nextTick
3 - Promise
5 - setTimeout (or 4, non-deterministic with setImmediate in main)
4 - setImmediate (or 5)
*/
```

---

## Async/Await and Event Loop

```javascript
async function example() {
  console.log('1');
  
  await Promise.resolve();
  console.log('2'); // This is like .then()
  
  console.log('3');
}

example();
console.log('4');
```

**Output**: `1, 4, 2, 3`

**Why?** `await` pauses function execution and schedules the rest as a microtask.

---

## Node.js vs Browser Event Loop

| Feature | Node.js | Browser |
|---------|---------|---------|
| Phases | 6 phases | Single task queue |
| process.nextTick | ✅ Yes | ❌ No |
| setImmediate | ✅ Yes | ❌ No (use setTimeout(fn, 0)) |
| requestAnimationFrame | ❌ No | ✅ Yes |
| DOM events | ❌ No | ✅ Yes |
| I/O operations | ✅ File, Network | Limited |

---

## Key Takeaways for Interview ✅

1. **Event Loop** allows non-blocking I/O in single-threaded JavaScript
2. **6 phases**: timers → pending → idle → **poll** → check → close
3. **Microtasks** (nextTick, Promises) run between EVERY phase
4. **process.nextTick** > **Promises** > **setImmediate** > **setTimeout**
5. Inside I/O: `setImmediate` always before `setTimeout`
6. **Never block** the event loop with sync operations
7. Use **Worker Threads** for CPU-intensive tasks
8. **libuv thread pool** (4 threads) handles file I/O, DNS, crypto
9. `await` schedules rest of function as microtask
10. Event loop starvation happens with recursive `nextTick`

---

## Bonus: Common Mistakes

```javascript
// ❌ Mistake 1: Thinking setTimeout(fn, 0) is immediate
setTimeout(() => console.log('Not immediate!'), 0);
console.log('This runs first');

// ❌ Mistake 2: Recursive nextTick
// Can starve I/O - use setImmediate instead

// ❌ Mistake 3: Sync file operations
const data = fs.readFileSync('file.txt'); // Blocks!

// ✅ Better
fs.readFile('file.txt', (err, data) => {});

// ❌ Mistake 4: JSON parsing large files synchronously
JSON.parse(hugeString); // Blocks event loop

// ✅ Better: Use streaming JSON parser
```

---

Good luck with your interview! 🎉
