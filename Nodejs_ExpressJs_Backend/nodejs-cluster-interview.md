# Node.js Cluster Module - Complete Interview Guide 🚀

## What is Cluster?

**Definition**: The Cluster module allows you to create child processes (workers) that share the same server port, enabling Node.js to utilize **all CPU cores** for handling requests.

> **Key Point**: Node.js is single-threaded by default. Cluster module helps you scale across multiple CPU cores without changing your code significantly.

---

## Why Do We Need Cluster?

### The Problem:
```
Single Node.js Process:
┌─────────────────────────────────────┐
│  CPU Core 1: Node.js running ✅     │
│  CPU Core 2: Idle ❌                │
│  CPU Core 3: Idle ❌                │
│  CPU Core 4: Idle ❌                │
└─────────────────────────────────────┘
Only 25% CPU utilization on 4-core machine!
```

### The Solution (Cluster):
```
With Cluster Module:
┌─────────────────────────────────────┐
│  CPU Core 1: Worker 1 ✅            │
│  CPU Core 2: Worker 2 ✅            │
│  CPU Core 3: Worker 3 ✅            │
│  CPU Core 4: Worker 4 ✅            │
└─────────────────────────────────────┘
100% CPU utilization!
```

---

## How Cluster Works

```
                    ┌─────────────────┐
                    │  Master Process │
                    │   (Manager)     │
                    └────────┬────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
           ▼                 ▼                 ▼
    ┌──────────┐      ┌──────────┐      ┌──────────┐
    │ Worker 1 │      │ Worker 2 │      │ Worker 3 │
    │ (fork)   │      │ (fork)   │      │ (fork)   │
    └──────────┘      └──────────┘      └──────────┘
           │                 │                 │
           └─────────────────┼─────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Port 3000     │
                    │ (Shared Socket) │
                    └─────────────────┘
```

### Key Concepts:
1. **Master Process**: Creates and manages worker processes
2. **Worker Processes**: Handle actual requests (child processes)
3. **Shared Port**: All workers share the same port
4. **IPC (Inter-Process Communication)**: Master and workers communicate via messages

---

## Basic Cluster Implementation

```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  
  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  // Handle worker death
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('Starting a new worker...');
    cluster.fork(); // Restart worker
  });
  
} else {
  // Workers share the TCP connection
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`Hello from Worker ${process.pid}\n`);
  }).listen(8000);
  
  console.log(`Worker ${process.pid} started`);
}
```

### Output:
```
Master 12345 is running
Worker 12346 started
Worker 12347 started
Worker 12348 started
Worker 12349 started
```

---

## Cluster Properties & Methods

### cluster.isMaster / cluster.isPrimary
```javascript
if (cluster.isMaster) {
  // This code runs only in master process
}

// Note: isMaster is deprecated, use isPrimary in Node 16+
if (cluster.isPrimary) {
  // Master/Primary process code
}
```

### cluster.isWorker
```javascript
if (cluster.isWorker) {
  // This code runs only in worker processes
}
```

### cluster.fork()
```javascript
// Create a new worker process
const worker = cluster.fork();

// Fork with custom environment variables
const worker = cluster.fork({ PORT: 3001 });
```

### cluster.workers
```javascript
// Get all active workers (only in master)
for (const id in cluster.workers) {
  console.log(`Worker ID: ${id}, PID: ${cluster.workers[id].process.pid}`);
}
```

### worker.send() - IPC Communication
```javascript
// Master sending message to worker
worker.send({ type: 'task', data: 'Hello Worker!' });

// Worker receiving message
process.on('message', (msg) => {
  console.log('Worker received:', msg);
});

// Worker sending message to master
process.send({ type: 'result', data: 'Task completed' });

// Master receiving message from worker
worker.on('message', (msg) => {
  console.log('Master received:', msg);
});
```

---

## Load Balancing Strategies

### 1. Round-Robin (Default on Linux/macOS)
```javascript
// Requests distributed evenly across workers
// Worker 1 → Worker 2 → Worker 3 → Worker 4 → Worker 1...

cluster.schedulingPolicy = cluster.SCHED_RR; // Round Robin
```

### 2. OS-Dependent (Default on Windows)
```javascript
// Let the OS handle load balancing
cluster.schedulingPolicy = cluster.SCHED_NONE;
```

### Setting via Environment Variable:
```bash
# Round Robin
NODE_CLUSTER_SCHED_POLICY=rr node app.js

# OS handles it
NODE_CLUSTER_SCHED_POLICY=none node app.js
```

---

## Production-Ready Cluster Example

```javascript
const cluster = require('cluster');
const http = require('http');
const os = require('os');

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  console.log(`Forking ${numCPUs} workers...`);

  // Track worker restarts to prevent infinite loops
  const workerRestarts = new Map();
  const MAX_RESTARTS = 5;
  const RESTART_WINDOW = 60000; // 1 minute

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Handle worker messages
  cluster.on('message', (worker, message) => {
    console.log(`Message from worker ${worker.id}:`, message);
  });

  // Handle worker exit
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died (${signal || code})`);
    
    // Check restart count
    const now = Date.now();
    const restarts = workerRestarts.get(worker.id) || [];
    const recentRestarts = restarts.filter(t => now - t < RESTART_WINDOW);
    
    if (recentRestarts.length < MAX_RESTARTS) {
      console.log('Starting a new worker...');
      recentRestarts.push(now);
      workerRestarts.set(worker.id, recentRestarts);
      cluster.fork();
    } else {
      console.error(`Worker ${worker.id} restarted too many times. Not restarting.`);
    }
  });

  // Handle worker online
  cluster.on('online', (worker) => {
    console.log(`Worker ${worker.process.pid} is online`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    for (const id in cluster.workers) {
      cluster.workers[id].kill();
    }
    process.exit(0);
  });

} else {
  // Worker process
  const server = http.createServer((req, res) => {
    // Simulate some work
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      pid: process.pid,
      message: 'Hello from worker!',
      uptime: process.uptime()
    }));
  });

  server.listen(3000, () => {
    console.log(`Worker ${process.pid} listening on port 3000`);
  });

  // Graceful shutdown for worker
  process.on('SIGTERM', () => {
    console.log(`Worker ${process.pid} shutting down...`);
    server.close(() => {
      process.exit(0);
    });
  });
}
```

---

## Cluster with Express.js

```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  
  console.log(`Primary ${process.pid} is running`);
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
  
} else {
  const express = require('express');
  const app = express();
  
  app.get('/', (req, res) => {
    res.json({
      message: 'Hello!',
      processId: process.pid,
      workerId: cluster.worker.id
    });
  });
  
  app.get('/heavy', (req, res) => {
    // Simulate CPU-intensive task
    let sum = 0;
    for (let i = 0; i < 1e7; i++) {
      sum += i;
    }
    res.json({ sum, processId: process.pid });
  });
  
  app.listen(3000, () => {
    console.log(`Worker ${process.pid} started`);
  });
}
```

---

## Zero-Downtime Restart (Rolling Restart)

```javascript
const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  // Zero-downtime restart function
  function restartWorkers() {
    const workers = Object.values(cluster.workers);
    
    function restartWorker(workerIndex) {
      const worker = workers[workerIndex];
      if (!worker) return;
      
      // Fork new worker first
      const newWorker = cluster.fork();
      
      newWorker.on('listening', () => {
        // New worker is ready, kill old one
        worker.kill();
        
        // Restart next worker
        restartWorker(workerIndex + 1);
      });
    }
    
    restartWorker(0);
  }
  
  // Listen for restart signal
  process.on('SIGUSR2', () => {
    console.log('Received SIGUSR2 - Restarting workers...');
    restartWorkers();
  });
  
  cluster.on('exit', (worker, code, signal) => {
    if (signal !== 'SIGTERM') {
      console.log(`Worker ${worker.process.pid} crashed. Restarting...`);
      cluster.fork();
    }
  });
}
```

**Trigger restart:**
```bash
kill -SIGUSR2 <master_pid>
```

---

## Cluster vs Worker Threads

| Feature | Cluster | Worker Threads |
|---------|---------|----------------|
| **Memory** | Separate memory space | Shared memory (SharedArrayBuffer) |
| **Use Case** | Scale HTTP servers | CPU-intensive tasks |
| **Isolation** | Full process isolation | Thread-level isolation |
| **Overhead** | Higher (separate processes) | Lower (same process) |
| **Communication** | IPC (slower) | Direct (faster) |
| **Port Sharing** | ✅ Yes | ❌ No |
| **Crash Impact** | Only worker dies | Can crash main thread |

### When to Use What:
- **Cluster**: HTTP servers, APIs, web applications
- **Worker Threads**: CPU-intensive calculations, parallel processing

---

## Interview Questions & Answers

### Q1: What is the Cluster module in Node.js?
**Answer**: The Cluster module allows Node.js to spawn multiple child processes (workers) that share the same server port. It enables utilizing all CPU cores for handling concurrent requests, effectively scaling Node.js applications horizontally on a single machine.

---

### Q2: How does Cluster help in scaling Node.js applications?
**Answer**: 
1. Creates multiple worker processes (one per CPU core)
2. All workers share the same port
3. Incoming requests are distributed across workers
4. If one worker crashes, others continue serving
5. Crashed workers can be automatically restarted

---

### Q3: What is the difference between Master and Worker processes?
**Answer**:

| Master Process | Worker Process |
|----------------|----------------|
| Manages workers | Handles requests |
| Doesn't serve requests | Serves actual traffic |
| Forks workers | Executes server logic |
| Handles worker crashes | Can crash independently |
| One per application | Multiple per application |

---

### Q4: How do Master and Worker communicate?
**Answer**: Through **IPC (Inter-Process Communication)**:

```javascript
// Master to Worker
worker.send({ cmd: 'notify', data: 'Hello' });

// Worker receives
process.on('message', (msg) => {
  console.log(msg); // { cmd: 'notify', data: 'Hello' }
});

// Worker to Master
process.send({ cmd: 'response', data: 'Received' });

// Master receives
worker.on('message', (msg) => {
  console.log(msg); // { cmd: 'response', data: 'Received' }
});
```

---

### Q5: What happens if a Worker crashes?
**Answer**: 
- Only that worker dies, others continue working
- Master receives 'exit' event
- Master can automatically fork a new worker
- No data loss for other workers
- Application stays available

```javascript
cluster.on('exit', (worker, code, signal) => {
  console.log(`Worker ${worker.process.pid} died`);
  cluster.fork(); // Restart automatically
});
```

---

### Q6: How is load balancing done in Cluster?
**Answer**: Two strategies:

1. **Round-Robin** (default on Linux/macOS):
   - Master accepts connections
   - Distributes to workers in rotation
   - Even distribution guaranteed

2. **OS Scheduling** (default on Windows):
   - OS kernel handles distribution
   - May lead to uneven load

```javascript
// Set manually
cluster.schedulingPolicy = cluster.SCHED_RR; // Round Robin
```

---

### Q7: What are the disadvantages of using Cluster?
**Answer**:
1. **Memory Overhead**: Each worker is a separate process with its own memory
2. **No Shared State**: Workers don't share memory (need Redis/DB for shared data)
3. **IPC Overhead**: Communication between master/workers is slower than threads
4. **Complexity**: More code to manage workers, restarts, graceful shutdown
5. **Sticky Sessions**: Need extra setup for session-based apps

---

### Q8: How to share data between Cluster workers?
**Answer**: Workers have separate memory, so use external solutions:

```javascript
// Option 1: Redis
const redis = require('redis');
const client = redis.createClient();

// Set in any worker
await client.set('sharedKey', 'value');

// Get in any worker
const value = await client.get('sharedKey');

// Option 2: Database
// Option 3: Message Queue (RabbitMQ, Kafka)
// Option 4: IPC via Master (not recommended for heavy data)
```

---

### Q9: How to implement graceful shutdown with Cluster?
**Answer**:

```javascript
if (cluster.isPrimary) {
  process.on('SIGTERM', () => {
    console.log('Master received SIGTERM');
    
    // Tell all workers to stop accepting new requests
    for (const id in cluster.workers) {
      cluster.workers[id].send('shutdown');
    }
    
    // Wait for workers to finish, then exit
    setTimeout(() => {
      process.exit(0);
    }, 30000); // 30 second timeout
  });
} else {
  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      server.close(() => {
        console.log(`Worker ${process.pid} closed`);
        process.exit(0);
      });
    }
  });
}
```

---

### Q10: How many workers should I create?
**Answer**: 
- **General rule**: Number of CPU cores
- **I/O heavy apps**: Can use more workers (1.5x - 2x cores)
- **CPU heavy apps**: Exactly number of cores
- **Memory constrained**: Fewer workers

```javascript
const os = require('os');
const numCPUs = os.cpus().length;

// Default recommendation
const workers = numCPUs;

// I/O heavy (lots of waiting)
const workers = numCPUs * 1.5;

// Memory constrained (e.g., 512MB RAM)
const workers = Math.min(numCPUs, 2);
```

---

### Q11: Cluster vs PM2 - What's the difference?
**Answer**:

| Feature | Cluster (Native) | PM2 |
|---------|------------------|-----|
| Setup | Manual code | Simple CLI |
| Monitoring | None built-in | Dashboard, logs |
| Auto-restart | Manual implementation | Built-in |
| Load Balancing | Manual | Automatic |
| Zero-downtime | Manual code | `pm2 reload` |
| Log Management | None | Built-in rotation |

**PM2 internally uses Cluster module!**

```bash
# PM2 makes it easy
pm2 start app.js -i max  # Start with max workers
pm2 reload app           # Zero-downtime restart
pm2 monit                # Monitor workers
```

---

### Q12: Can you use Cluster with Worker Threads together?
**Answer**: Yes! Use **Cluster** for scaling HTTP servers and **Worker Threads** within each worker for CPU-intensive tasks.

```javascript
// Inside each Cluster worker
const { Worker } = require('worker_threads');

app.post('/process', async (req, res) => {
  const worker = new Worker('./heavy-task.js', {
    workerData: req.body
  });
  
  worker.on('message', (result) => {
    res.json(result);
  });
});
```

---

## Quick Code Reference

```javascript
const cluster = require('cluster');
const os = require('os');

// Check if master/primary
cluster.isPrimary // or cluster.isMaster (deprecated)

// Check if worker
cluster.isWorker

// Fork new worker
cluster.fork()

// Get all workers
cluster.workers

// Current worker (in worker process)
cluster.worker

// Worker ID
cluster.worker.id

// Send message (IPC)
worker.send(message)        // Master → Worker
process.send(message)       // Worker → Master

// Events
cluster.on('fork', (worker) => {})     // Worker forked
cluster.on('online', (worker) => {})   // Worker online
cluster.on('exit', (worker) => {})     // Worker died
cluster.on('message', (worker, msg) => {}) // Message from worker

// Worker events
worker.on('message', (msg) => {})
worker.on('error', (err) => {})
worker.on('disconnect', () => {})
```

---

## Key Takeaways for Interview ✅

1. **Cluster** = Utilize all CPU cores for Node.js
2. **Master** manages workers, **Workers** handle requests
3. **All workers** share the same port
4. **IPC** for communication between master/workers
5. **Round-Robin** is default load balancing (Linux/macOS)
6. **Workers don't share memory** - use Redis/DB for shared state
7. **PM2** uses Cluster internally and makes it easier
8. **Cluster for HTTP scaling**, **Worker Threads for CPU tasks**
9. **Graceful shutdown** = stop accepting requests, finish pending, exit
10. **Workers = CPU cores** is a good starting point

---

Good luck with your interview! 🎉
