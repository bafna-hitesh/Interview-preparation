# HackerRank SDE 2 Frontend Interview Prep Guide

A comprehensive collection of 28 practice questions covering essential frontend topics for SDE 2 interviews.

---

## Table of Contents

1. [JavaScript Data Manipulation](#1-javascript-data-manipulation)
2. [Maps, Sets & Arrays](#2-maps-sets--arrays)
3. [Async JavaScript](#3-async-javascript)
4. [DOM Manipulation & Events](#4-dom-manipulation--events)
5. [String Parsing & Validation](#5-string-parsing--validation)
6. [React & UI Tasks](#6-react--ui-tasks)
7. [Frontend State Logic](#7-frontend-state-logic)
8. [Building Small Features - Mini Apps](#8-building-small-features---mini-apps)

---

## 1. JavaScript Data Manipulation

### Question 1: Transform Array of Objects
**Difficulty**: Easy  
**Time Limit**: 10 minutes  
**Topics**: Array.map, Array.filter, Object manipulation

#### Problem
Given an array of user objects, transform it to return only active users with their full name (firstName + lastName) and age.

#### Examples
```javascript
// Input
const users = [
  { firstName: 'John', lastName: 'Doe', age: 28, active: true },
  { firstName: 'Jane', lastName: 'Smith', age: 34, active: false },
  { firstName: 'Bob', lastName: 'Johnson', age: 45, active: true }
];

// Output
[
  { fullName: 'John Doe', age: 28 },
  { fullName: 'Bob Johnson', age: 45 }
]
```

#### Solution
```javascript
function transformActiveUsers(users) {
  return users
    .filter(user => user.active)
    .map(user => ({
      fullName: `${user.firstName} ${user.lastName}`,
      age: user.age
    }));
}
```

#### Explanation
- **filter()**: First filters to keep only users where `active` is `true`
- **map()**: Then transforms each remaining user to the new structure
- **Template literals**: Used for string concatenation to create `fullName`
- **Chaining**: Methods are chained for cleaner, more readable code

---

### Question 2: Group Items by Property
**Difficulty**: Medium  
**Time Limit**: 15 minutes  
**Topics**: Array.reduce, Object manipulation, Grouping

#### Problem
Given an array of products, group them by their category. Return an object where keys are categories and values are arrays of products in that category.

#### Examples
```javascript
// Input
const products = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 999 },
  { id: 2, name: 'Shirt', category: 'Clothing', price: 29 },
  { id: 3, name: 'Phone', category: 'Electronics', price: 699 },
  { id: 4, name: 'Pants', category: 'Clothing', price: 49 },
  { id: 5, name: 'Tablet', category: 'Electronics', price: 399 }
];

// Output
{
  Electronics: [
    { id: 1, name: 'Laptop', category: 'Electronics', price: 999 },
    { id: 3, name: 'Phone', category: 'Electronics', price: 699 },
    { id: 5, name: 'Tablet', category: 'Electronics', price: 399 }
  ],
  Clothing: [
    { id: 2, name: 'Shirt', category: 'Clothing', price: 29 },
    { id: 4, name: 'Pants', category: 'Clothing', price: 49 }
  ]
}
```

#### Solution
```javascript
function groupByCategory(products) {
  return products.reduce((acc, product) => {
    const { category } = product;
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push(product);
    return acc;
  }, {});
}

// Alternative using nullish coalescing
function groupByCategoryAlt(products) {
  return products.reduce((acc, product) => {
    const { category } = product;
    acc[category] = acc[category] ?? [];
    acc[category].push(product);
    return acc;
  }, {});
}
```

#### Explanation
- **reduce()**: Perfect for building up an object from an array
- **Accumulator pattern**: Start with empty object `{}`, build up groups
- **Dynamic keys**: Use bracket notation `acc[category]` for dynamic property access
- **Initialization check**: Ensure array exists before pushing

---

### Question 3: Merge and Deduplicate Arrays
**Difficulty**: Medium  
**Time Limit**: 15 minutes  
**Topics**: Array methods, Object comparison, Deduplication

#### Problem
Merge two arrays of user objects and remove duplicates based on the `email` field. If duplicates exist, keep the one from the second array (as it's considered more recent).

#### Examples
```javascript
// Input
const existingUsers = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' },
  { id: 3, name: 'Bob', email: 'bob@example.com' }
];

const newUsers = [
  { id: 4, name: 'Jane Updated', email: 'jane@example.com' },
  { id: 5, name: 'Alice', email: 'alice@example.com' }
];

// Output
[
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 3, name: 'Bob', email: 'bob@example.com' },
  { id: 4, name: 'Jane Updated', email: 'jane@example.com' },
  { id: 5, name: 'Alice', email: 'alice@example.com' }
]
```

#### Solution
```javascript
function mergeAndDeduplicate(existingUsers, newUsers) {
  const emailMap = new Map();
  
  // Add existing users first
  existingUsers.forEach(user => {
    emailMap.set(user.email, user);
  });
  
  // Add/overwrite with new users
  newUsers.forEach(user => {
    emailMap.set(user.email, user);
  });
  
  return Array.from(emailMap.values());
}

// Alternative using reduce
function mergeAndDeduplicateAlt(existingUsers, newUsers) {
  const combined = [...existingUsers, ...newUsers];
  
  const uniqueByEmail = combined.reduce((acc, user) => {
    acc[user.email] = user;
    return acc;
  }, {});
  
  return Object.values(uniqueByEmail);
}
```

#### Explanation
- **Map for deduplication**: Map naturally handles key uniqueness
- **Order of insertion matters**: New users added second, overwriting existing
- **Array.from()**: Converts Map values back to array
- **Alternative approach**: Using object as lookup table, then Object.values()

---

### Question 4: Multi-level Data Transformation Pipeline
**Difficulty**: Hard  
**Time Limit**: 25 minutes  
**Topics**: Complex data transformation, Chaining, Aggregation

#### Problem
Given an array of orders, transform it to create a summary by customer showing:
- Customer name
- Total orders count
- Total amount spent
- List of unique product categories purchased
- Average order value (rounded to 2 decimals)

Sort the result by total amount spent (descending).

#### Examples
```javascript
// Input
const orders = [
  { orderId: 1, customer: 'Alice', amount: 150, category: 'Electronics' },
  { orderId: 2, customer: 'Bob', amount: 75, category: 'Books' },
  { orderId: 3, customer: 'Alice', amount: 200, category: 'Clothing' },
  { orderId: 4, customer: 'Alice', amount: 50, category: 'Electronics' },
  { orderId: 5, customer: 'Bob', amount: 125, category: 'Electronics' }
];

// Output
[
  {
    customer: 'Alice',
    totalOrders: 3,
    totalAmount: 400,
    categories: ['Electronics', 'Clothing'],
    avgOrderValue: 133.33
  },
  {
    customer: 'Bob',
    totalOrders: 2,
    totalAmount: 200,
    categories: ['Books', 'Electronics'],
    avgOrderValue: 100.00
  }
]
```

#### Solution
```javascript
function createCustomerSummary(orders) {
  // Group orders by customer
  const customerMap = orders.reduce((acc, order) => {
    const { customer, amount, category } = order;
    
    if (!acc[customer]) {
      acc[customer] = {
        customer,
        orders: [],
        categories: new Set()
      };
    }
    
    acc[customer].orders.push(order);
    acc[customer].categories.add(category);
    
    return acc;
  }, {});
  
  // Transform to final format
  const summaries = Object.values(customerMap).map(data => {
    const totalAmount = data.orders.reduce((sum, o) => sum + o.amount, 0);
    const totalOrders = data.orders.length;
    
    return {
      customer: data.customer,
      totalOrders,
      totalAmount,
      categories: Array.from(data.categories),
      avgOrderValue: Math.round((totalAmount / totalOrders) * 100) / 100
    };
  });
  
  // Sort by total amount descending
  return summaries.sort((a, b) => b.totalAmount - a.totalAmount);
}
```

#### Explanation
- **Two-phase transformation**: First group, then compute aggregates
- **Set for unique values**: Categories stored in Set to avoid duplicates
- **Accumulator pattern**: Build intermediate data structure with reduce
- **Rounding precision**: `Math.round(x * 100) / 100` for 2 decimal places
- **Sort comparator**: `b - a` for descending order

---

## 2. Maps, Sets & Arrays

### Question 5: Count Occurrences Using Map
**Difficulty**: Easy  
**Time Limit**: 10 minutes  
**Topics**: Map, Counting, Iteration

#### Problem
Given an array of strings, return a Map containing each unique string and its count of occurrences.

#### Examples
```javascript
// Input
const words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple'];

// Output (as Map)
Map {
  'apple' => 3,
  'banana' => 2,
  'cherry' => 1
}
```

#### Solution
```javascript
function countOccurrences(words) {
  const countMap = new Map();
  
  for (const word of words) {
    countMap.set(word, (countMap.get(word) || 0) + 1);
  }
  
  return countMap;
}

// Alternative using reduce
function countOccurrencesAlt(words) {
  return words.reduce((map, word) => {
    map.set(word, (map.get(word) || 0) + 1);
    return map;
  }, new Map());
}
```

#### Explanation
- **Map vs Object**: Map preserves insertion order and works with any key type
- **get() with fallback**: `map.get(key) || 0` handles undefined case
- **Increment pattern**: Get current count, add 1, set new value
- **for...of**: Clean iteration over array elements

---

### Question 6: Find Duplicates Using Set
**Difficulty**: Medium  
**Time Limit**: 12 minutes  
**Topics**: Set, Array, Duplicate detection

#### Problem
Find all duplicate values in an array and return them as an array (each duplicate should appear only once in the result).

#### Examples
```javascript
// Input
const numbers = [1, 2, 3, 2, 4, 5, 3, 6, 2];

// Output
[2, 3]  // 2 and 3 are the only numbers that appear more than once
```

#### Solution
```javascript
function findDuplicates(arr) {
  const seen = new Set();
  const duplicates = new Set();
  
  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }
  
  return Array.from(duplicates);
}

// Alternative one-liner (less efficient but concise)
function findDuplicatesAlt(arr) {
  return [...new Set(arr.filter((item, index) => arr.indexOf(item) !== index))];
}
```

#### Explanation
- **Two Sets approach**: `seen` tracks all encountered values, `duplicates` collects repeats
- **O(n) complexity**: Single pass through array
- **Set for uniqueness**: Duplicates Set ensures each duplicate appears once in result
- **Alternative caveat**: `indexOf` makes it O(n²), not recommended for large arrays

---

### Question 7: Two Sum Using Map
**Difficulty**: Medium  
**Time Limit**: 15 minutes  
**Topics**: Map, Hash table, Algorithm optimization

#### Problem
Given an array of numbers and a target sum, return the indices of two numbers that add up to the target. Assume exactly one solution exists.

#### Examples
```javascript
// Input
const nums = [2, 7, 11, 15];
const target = 9;

// Output
[0, 1]  // nums[0] + nums[1] = 2 + 7 = 9

// Input
const nums2 = [3, 2, 4];
const target2 = 6;

// Output
[1, 2]  // nums[1] + nums[2] = 2 + 4 = 6
```

#### Solution
```javascript
function twoSum(nums, target) {
  const numToIndex = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (numToIndex.has(complement)) {
      return [numToIndex.get(complement), i];
    }
    
    numToIndex.set(nums[i], i);
  }
  
  return []; // No solution found
}
```

#### Explanation
- **Complement approach**: For each number, look for `target - number`
- **Map for O(1) lookup**: Store number → index mapping
- **Single pass**: Check for complement before adding current number
- **Time complexity**: O(n) vs O(n²) for brute force

---

### Question 8: LRU Cache Implementation
**Difficulty**: Hard  
**Time Limit**: 30 minutes  
**Topics**: Map, Data structure design, Cache algorithms

#### Problem
Implement an LRU (Least Recently Used) Cache with the following operations:
- `get(key)`: Get the value if key exists, otherwise return -1
- `put(key, value)`: Insert or update the value. If cache exceeds capacity, remove the least recently used item.

Both operations should run in O(1) time.

#### Examples
```javascript
const cache = new LRUCache(2); // capacity = 2

cache.put(1, 'a');
cache.put(2, 'b');
cache.get(1);       // returns 'a' (1 is now most recently used)
cache.put(3, 'c');  // evicts key 2 (least recently used)
cache.get(2);       // returns -1 (not found)
cache.put(4, 'd');  // evicts key 1
cache.get(1);       // returns -1
cache.get(3);       // returns 'c'
cache.get(4);       // returns 'd'
```

#### Solution
```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }
    
    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    
    return value;
  }
  
  put(key, value) {
    // If key exists, delete it first (to update position)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    
    // Add new key-value pair
    this.cache.set(key, value);
    
    // If over capacity, remove least recently used (first item)
    if (this.cache.size > this.capacity) {
      const lruKey = this.cache.keys().next().value;
      this.cache.delete(lruKey);
    }
  }
  
  // Helper method to see cache state
  getState() {
    return Array.from(this.cache.entries());
  }
}
```

#### Explanation
- **Map preserves insertion order**: Key insight - Map iterates in insertion order
- **Move to end on access**: Delete and re-insert to mark as most recently used
- **First key is LRU**: Due to insertion order, first key is least recently used
- **O(1) operations**: Map operations (get, set, delete) are all O(1)
- **keys().next()**: Gets first key without iterating entire map

---

## 3. Async JavaScript

### Question 9: Basic Fetch with Async/Await
**Difficulty**: Easy  
**Time Limit**: 10 minutes  
**Topics**: async/await, fetch, Error handling

#### Problem
Write a function that fetches user data from an API and returns the parsed JSON. Handle errors gracefully by returning `null` if the request fails.

#### Examples
```javascript
// Usage
const user = await fetchUser('https://api.example.com/users/1');
// Returns: { id: 1, name: 'John', email: 'john@example.com' }

// On error
const user = await fetchUser('https://api.example.com/invalid');
// Returns: null
```

#### Solution
```javascript
async function fetchUser(url) {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error.message);
    return null;
  }
}

// With timeout support
async function fetchUserWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Failed to fetch user:', error.message);
    return null;
  }
}
```

#### Explanation
- **async/await**: Clean syntax for handling promises
- **response.ok**: Check for HTTP success status (200-299)
- **try/catch**: Handles both network errors and JSON parsing errors
- **AbortController**: Enables request cancellation for timeout handling

---

### Question 10: Promise.all for Parallel Requests
**Difficulty**: Medium  
**Time Limit**: 15 minutes  
**Topics**: Promise.all, Parallel execution, Error handling

#### Problem
Fetch data from multiple API endpoints in parallel. Return an object with results keyed by endpoint name. If any request fails, include the error message for that endpoint instead of data.

#### Examples
```javascript
// Input
const endpoints = {
  users: 'https://api.example.com/users',
  posts: 'https://api.example.com/posts',
  comments: 'https://api.example.com/comments'
};

// Output (success case)
{
  users: [{ id: 1, name: 'John' }, ...],
  posts: [{ id: 1, title: 'Hello' }, ...],
  comments: [{ id: 1, text: 'Nice!' }, ...]
}

// Output (partial failure)
{
  users: [{ id: 1, name: 'John' }, ...],
  posts: { error: 'Failed to fetch: 404' },
  comments: [{ id: 1, text: 'Nice!' }, ...]
}
```

#### Solution
```javascript
async function fetchAllEndpoints(endpoints) {
  const entries = Object.entries(endpoints);
  
  const fetchPromises = entries.map(async ([name, url]) => {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return [name, data];
    } catch (error) {
      return [name, { error: `Failed to fetch: ${error.message}` }];
    }
  });
  
  const results = await Promise.all(fetchPromises);
  
  return Object.fromEntries(results);
}

// Alternative with Promise.allSettled
async function fetchAllEndpointsAlt(endpoints) {
  const entries = Object.entries(endpoints);
  
  const fetchPromises = entries.map(([name, url]) => 
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => ({ name, data, status: 'fulfilled' }))
      .catch(error => ({ name, error: error.message, status: 'rejected' }))
  );
  
  const results = await Promise.all(fetchPromises);
  
  return results.reduce((acc, result) => {
    acc[result.name] = result.status === 'fulfilled' 
      ? result.data 
      : { error: `Failed to fetch: ${result.error}` };
    return acc;
  }, {});
}
```

#### Explanation
- **Promise.all**: Executes all promises in parallel, waits for all to complete
- **Error isolation**: Each promise catches its own errors, preventing one failure from breaking all
- **Object.entries/fromEntries**: Convert between object and array of [key, value] pairs
- **Parallel vs Sequential**: Much faster than awaiting each request sequentially

---

### Question 11: Retry with Exponential Backoff
**Difficulty**: Medium  
**Time Limit**: 20 minutes  
**Topics**: Recursion, Promises, Error handling, Backoff algorithms

#### Problem
Implement a fetch wrapper that retries failed requests with exponential backoff. The delay should double after each attempt, starting from a base delay.

#### Examples
```javascript
// Usage
const data = await fetchWithRetry('https://api.example.com/data', {
  maxRetries: 3,
  baseDelay: 1000  // Start with 1 second
});

// Retry timeline:
// Attempt 1: immediate
// Attempt 2: after 1000ms (1s)
// Attempt 3: after 2000ms (2s)
// Attempt 4: after 4000ms (4s)
```

#### Solution
```javascript
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options = {}) {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 30000
  } = options;
  
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        // Calculate delay with exponential backoff
        const delayMs = Math.min(
          baseDelay * Math.pow(2, attempt),
          maxDelay
        );
        
        console.log(`Attempt ${attempt + 1} failed. Retrying in ${delayMs}ms...`);
        await delay(delayMs);
      }
    }
  }
  
  throw new Error(`Failed after ${maxRetries + 1} attempts: ${lastError.message}`);
}

// With jitter to avoid thundering herd
async function fetchWithRetryJitter(url, options = {}) {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 30000 } = options;
  
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        // Exponential backoff with jitter
        const exponentialDelay = baseDelay * Math.pow(2, attempt);
        const jitter = Math.random() * 0.3 * exponentialDelay; // 0-30% jitter
        const delayMs = Math.min(exponentialDelay + jitter, maxDelay);
        
        await delay(delayMs);
      }
    }
  }
  
  throw new Error(`Failed after ${maxRetries + 1} attempts: ${lastError.message}`);
}
```

#### Explanation
- **Exponential backoff**: `baseDelay * 2^attempt` doubles delay each time
- **Max delay cap**: Prevents excessively long waits
- **Jitter**: Random variation prevents synchronized retries (thundering herd)
- **Loop vs recursion**: Iterative approach is cleaner and avoids stack issues

---

### Question 12: Rate-Limited API Calls with Queue
**Difficulty**: Hard  
**Time Limit**: 30 minutes  
**Topics**: Async queues, Rate limiting, Concurrency control

#### Problem
Implement a rate limiter that processes API calls with a maximum of N concurrent requests and a minimum delay between requests.

#### Examples
```javascript
const rateLimiter = new RateLimiter({
  maxConcurrent: 2,
  minDelay: 100  // 100ms between requests
});

// Queue multiple requests - only 2 run at a time
const results = await Promise.all([
  rateLimiter.execute(() => fetch('/api/1')),
  rateLimiter.execute(() => fetch('/api/2')),
  rateLimiter.execute(() => fetch('/api/3')),
  rateLimiter.execute(() => fetch('/api/4')),
  rateLimiter.execute(() => fetch('/api/5'))
]);
```

#### Solution
```javascript
class RateLimiter {
  constructor(options = {}) {
    this.maxConcurrent = options.maxConcurrent || 3;
    this.minDelay = options.minDelay || 0;
    this.queue = [];
    this.running = 0;
    this.lastExecutionTime = 0;
  }
  
  async execute(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      this.processQueue();
    });
  }
  
  async processQueue() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }
    
    // Check minimum delay
    const now = Date.now();
    const timeSinceLastExecution = now - this.lastExecutionTime;
    
    if (timeSinceLastExecution < this.minDelay) {
      const waitTime = this.minDelay - timeSinceLastExecution;
      setTimeout(() => this.processQueue(), waitTime);
      return;
    }
    
    const { fn, resolve, reject } = this.queue.shift();
    this.running++;
    this.lastExecutionTime = Date.now();
    
    try {
      const result = await fn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.processQueue();
    }
  }
}

// Usage example with batch processing
async function batchFetch(urls, options = {}) {
  const limiter = new RateLimiter(options);
  
  const promises = urls.map(url => 
    limiter.execute(async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
  );
  
  return Promise.all(promises);
}
```

#### Explanation
- **Queue pattern**: Tasks wait in queue until slot available
- **Concurrency control**: Track `running` count, only start new when under limit
- **Minimum delay**: Enforce time gap between requests
- **Promise wrapping**: Each execute() returns promise resolved when task completes
- **Self-scheduling**: processQueue() calls itself to handle next item

---

## 4. DOM Manipulation & Events

### Question 13: Dynamic List with Add/Remove
**Difficulty**: Easy  
**Time Limit**: 15 minutes  
**Topics**: DOM manipulation, Event handling, createElement

#### Problem
Create functions to manage a dynamic list:
1. `addItem(text)` - Add a new item to the list
2. `removeItem(index)` - Remove item at given index
3. `getItems()` - Return array of current item texts

#### Examples
```html
<ul id="todo-list"></ul>
<input id="todo-input" type="text" />
<button id="add-btn">Add</button>
```

#### Solution
```javascript
class DynamicList {
  constructor(listId) {
    this.list = document.getElementById(listId);
    this.items = [];
  }
  
  addItem(text) {
    if (!text.trim()) return;
    
    const li = document.createElement('li');
    li.textContent = text;
    
    // Add remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.style.marginLeft = '10px';
    
    const index = this.items.length;
    removeBtn.addEventListener('click', () => {
      this.removeItem(li);
    });
    
    li.appendChild(removeBtn);
    this.list.appendChild(li);
    this.items.push(text);
    
    return li;
  }
  
  removeItem(li) {
    const index = Array.from(this.list.children).indexOf(li);
    
    if (index > -1) {
      this.list.removeChild(li);
      this.items.splice(index, 1);
    }
  }
  
  getItems() {
    return [...this.items];
  }
  
  clear() {
    this.list.innerHTML = '';
    this.items = [];
  }
}

// Usage
const todoList = new DynamicList('todo-list');

document.getElementById('add-btn').addEventListener('click', () => {
  const input = document.getElementById('todo-input');
  todoList.addItem(input.value);
  input.value = '';
});
```

#### Explanation
- **createElement**: Create elements programmatically
- **appendChild**: Add elements to DOM
- **Event binding**: Attach click handlers to remove buttons
- **Array sync**: Keep internal array in sync with DOM
- **Spread operator**: `[...this.items]` returns copy, not reference

---

### Question 14: Event Delegation Pattern
**Difficulty**: Medium  
**Time Limit**: 15 minutes  
**Topics**: Event delegation, Event bubbling, DOM traversal

#### Problem
Implement a click handler using event delegation for a list where items can be dynamically added. Clicking an item should toggle its "completed" state (strikethrough).

#### Examples
```html
<ul id="task-list">
  <li data-id="1">Task 1</li>
  <li data-id="2">Task 2</li>
  <li data-id="3">Task 3</li>
</ul>
```

#### Solution
```javascript
class TaskList {
  constructor(listId) {
    this.list = document.getElementById(listId);
    this.completedTasks = new Set();
    
    // Single event listener on parent (delegation)
    this.list.addEventListener('click', this.handleClick.bind(this));
  }
  
  handleClick(event) {
    const target = event.target;
    
    // Check if clicked element is a list item
    if (target.tagName !== 'LI') {
      return;
    }
    
    const taskId = target.dataset.id;
    
    if (this.completedTasks.has(taskId)) {
      // Uncomplete
      this.completedTasks.delete(taskId);
      target.style.textDecoration = 'none';
      target.style.opacity = '1';
    } else {
      // Complete
      this.completedTasks.add(taskId);
      target.style.textDecoration = 'line-through';
      target.style.opacity = '0.6';
    }
    
    // Emit custom event
    this.list.dispatchEvent(new CustomEvent('taskToggle', {
      detail: { taskId, completed: this.completedTasks.has(taskId) }
    }));
  }
  
  addTask(id, text) {
    const li = document.createElement('li');
    li.dataset.id = id;
    li.textContent = text;
    li.style.cursor = 'pointer';
    this.list.appendChild(li);
    return li;
  }
  
  getCompletedTasks() {
    return Array.from(this.completedTasks);
  }
}

// Usage
const taskList = new TaskList('task-list');

// Listen for toggle events
document.getElementById('task-list').addEventListener('taskToggle', (e) => {
  console.log('Task toggled:', e.detail);
});

// Dynamically add tasks - they automatically work with delegation
taskList.addTask('4', 'Task 4');
taskList.addTask('5', 'Task 5');
```

#### Explanation
- **Event delegation**: Single listener on parent handles all children
- **Event bubbling**: Clicks on children bubble up to parent
- **target.tagName**: Check what element was actually clicked
- **dataset.id**: Access data attributes via dataset property
- **Works with dynamic elements**: New items automatically handled

---

### Question 15: Debounced Search Input
**Difficulty**: Hard  
**Time Limit**: 25 minutes  
**Topics**: Debouncing, Async operations, DOM updates

#### Problem
Create a search input that:
1. Debounces user input (waits 300ms after typing stops)
2. Shows loading state while fetching
3. Displays results in a dropdown
4. Handles rapid typing correctly (cancels pending requests)

#### Examples
```html
<div class="search-container">
  <input type="text" id="search-input" placeholder="Search..." />
  <div id="loading" style="display: none;">Loading...</div>
  <ul id="results"></ul>
</div>
```

#### Solution
```javascript
function debounce(fn, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

class SearchInput {
  constructor(options) {
    this.input = document.getElementById(options.inputId);
    this.results = document.getElementById(options.resultsId);
    this.loading = document.getElementById(options.loadingId);
    this.searchFn = options.searchFn;
    this.debounceDelay = options.debounceDelay || 300;
    
    this.abortController = null;
    
    // Debounced search handler
    this.debouncedSearch = debounce(
      this.performSearch.bind(this),
      this.debounceDelay
    );
    
    this.input.addEventListener('input', this.handleInput.bind(this));
  }
  
  handleInput(event) {
    const query = event.target.value.trim();
    
    // Cancel any pending request
    if (this.abortController) {
      this.abortController.abort();
    }
    
    if (!query) {
      this.clearResults();
      return;
    }
    
    this.debouncedSearch(query);
  }
  
  async performSearch(query) {
    this.showLoading();
    
    // Create new abort controller for this request
    this.abortController = new AbortController();
    
    try {
      const results = await this.searchFn(query, this.abortController.signal);
      this.renderResults(results);
    } catch (error) {
      if (error.name === 'AbortError') {
        // Request was cancelled, ignore
        return;
      }
      this.renderError(error.message);
    } finally {
      this.hideLoading();
    }
  }
  
  showLoading() {
    this.loading.style.display = 'block';
  }
  
  hideLoading() {
    this.loading.style.display = 'none';
  }
  
  renderResults(results) {
    this.results.innerHTML = '';
    
    if (results.length === 0) {
      this.results.innerHTML = '<li class="no-results">No results found</li>';
      return;
    }
    
    results.forEach(result => {
      const li = document.createElement('li');
      li.textContent = result.name || result.title || result;
      li.dataset.id = result.id;
      li.addEventListener('click', () => this.selectResult(result));
      this.results.appendChild(li);
    });
  }
  
  renderError(message) {
    this.results.innerHTML = `<li class="error">Error: ${message}</li>`;
  }
  
  clearResults() {
    this.results.innerHTML = '';
  }
  
  selectResult(result) {
    this.input.value = result.name || result.title || result;
    this.clearResults();
    
    // Emit custom event
    this.input.dispatchEvent(new CustomEvent('resultSelected', {
      detail: result
    }));
  }
}

// Usage
const search = new SearchInput({
  inputId: 'search-input',
  resultsId: 'results',
  loadingId: 'loading',
  debounceDelay: 300,
  searchFn: async (query, signal) => {
    const response = await fetch(
      `https://api.example.com/search?q=${encodeURIComponent(query)}`,
      { signal }
    );
    if (!response.ok) throw new Error('Search failed');
    return response.json();
  }
});
```

#### Explanation
- **Debounce**: Waits for user to stop typing before searching
- **AbortController**: Cancels pending requests when new search starts
- **Loading state**: Visual feedback during async operation
- **Error handling**: Gracefully handles both abort and real errors
- **Custom events**: Emits event when result selected

---

## 5. String Parsing & Validation

### Question 16: Email Validation with Regex
**Difficulty**: Easy  
**Time Limit**: 10 minutes  
**Topics**: Regular expressions, Validation

#### Problem
Write a function to validate email addresses. Return `true` for valid emails, `false` otherwise.

#### Examples
```javascript
validateEmail('user@example.com');     // true
validateEmail('user.name@domain.org'); // true
validateEmail('user+tag@example.com'); // true
validateEmail('invalid');              // false
validateEmail('no@domain');            // false
validateEmail('@nodomain.com');        // false
validateEmail('spaces in@email.com');  // false
```

#### Solution
```javascript
function validateEmail(email) {
  // Basic validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// More comprehensive validation
function validateEmailStrict(email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

// With detailed error messages
function validateEmailWithErrors(email) {
  const errors = [];
  
  if (!email || typeof email !== 'string') {
    return { valid: false, errors: ['Email is required'] };
  }
  
  const trimmed = email.trim();
  
  if (trimmed !== email) {
    errors.push('Email should not have leading/trailing spaces');
  }
  
  if (!trimmed.includes('@')) {
    errors.push('Email must contain @');
  } else {
    const [local, domain] = trimmed.split('@');
    
    if (!local) {
      errors.push('Email must have a local part before @');
    }
    
    if (!domain) {
      errors.push('Email must have a domain after @');
    } else if (!domain.includes('.')) {
      errors.push('Domain must contain at least one dot');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

#### Explanation
- **Basic regex**: `^[^\s@]+@[^\s@]+\.[^\s@]+$` covers most cases
- **Character classes**: `[^\s@]` matches anything except whitespace and @
- **Anchors**: `^` and `$` ensure full string match
- **Trade-off**: Perfect email validation is complex; basic regex catches most issues

---

### Question 17: Parse Query String to Object
**Difficulty**: Medium  
**Time Limit**: 15 minutes  
**Topics**: String manipulation, URL parsing, Decoding

#### Problem
Parse a URL query string into an object. Handle:
- Basic key-value pairs
- URL-encoded values
- Array parameters (same key multiple times)
- Empty values

#### Examples
```javascript
// Input
parseQueryString('?name=John&age=30&city=New%20York');
// Output: { name: 'John', age: '30', city: 'New York' }

// With arrays
parseQueryString('?tag=js&tag=react&tag=node');
// Output: { tag: ['js', 'react', 'node'] }

// With empty values
parseQueryString('?search=&page=1&filter=');
// Output: { search: '', page: '1', filter: '' }
```

#### Solution
```javascript
function parseQueryString(queryString) {
  // Remove leading ? if present
  const query = queryString.startsWith('?') 
    ? queryString.slice(1) 
    : queryString;
  
  if (!query) return {};
  
  const result = {};
  
  const pairs = query.split('&');
  
  for (const pair of pairs) {
    const [encodedKey, encodedValue = ''] = pair.split('=');
    
    const key = decodeURIComponent(encodedKey);
    const value = decodeURIComponent(encodedValue);
    
    if (key in result) {
      // Convert to array if multiple values
      if (Array.isArray(result[key])) {
        result[key].push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

// Using URLSearchParams (modern approach)
function parseQueryStringModern(queryString) {
  const params = new URLSearchParams(queryString);
  const result = {};
  
  for (const key of params.keys()) {
    const values = params.getAll(key);
    result[key] = values.length > 1 ? values : values[0];
  }
  
  return result;
}

// Reverse: object to query string
function toQueryString(obj) {
  const params = new URLSearchParams();
  
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v));
    } else {
      params.append(key, value);
    }
  }
  
  return params.toString();
}
```

#### Explanation
- **decodeURIComponent**: Handles URL encoding (%20 → space)
- **Array handling**: Same key multiple times creates array
- **Default value**: `= ''` handles missing values
- **URLSearchParams**: Built-in API for query string manipulation

---

### Question 18: Template String Parser
**Difficulty**: Hard  
**Time Limit**: 25 minutes  
**Topics**: String parsing, Regex, Template engines

#### Problem
Implement a mini template engine that replaces `{{variable}}` placeholders with values from a data object. Support nested properties with dot notation.

#### Examples
```javascript
const template = 'Hello, {{user.name}}! You have {{count}} messages.';
const data = {
  user: { name: 'Alice', email: 'alice@example.com' },
  count: 5
};

parseTemplate(template, data);
// Output: 'Hello, Alice! You have 5 messages.'

// With missing values
const template2 = 'Welcome {{name}}, your role is {{role}}.';
const data2 = { name: 'Bob' };

parseTemplate(template2, data2);
// Output: 'Welcome Bob, your role is {{role}}.'
// (Missing values remain as placeholders)
```

#### Solution
```javascript
function parseTemplate(template, data) {
  const placeholderRegex = /\{\{([^}]+)\}\}/g;
  
  return template.replace(placeholderRegex, (match, path) => {
    const value = getNestedValue(data, path.trim());
    
    // Return original placeholder if value not found
    return value !== undefined ? value : match;
  });
}

function getNestedValue(obj, path) {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[key];
  }
  
  return current;
}

// Extended version with helpers and conditionals
function parseTemplateAdvanced(template, data) {
  // Handle {{#if condition}}...{{/if}}
  let result = template.replace(
    /\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (match, condition, content) => {
      const value = getNestedValue(data, condition.trim());
      return value ? parseTemplateAdvanced(content, data) : '';
    }
  );
  
  // Handle {{#each array}}...{{/each}}
  result = result.replace(
    /\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
    (match, arrayPath, itemTemplate) => {
      const array = getNestedValue(data, arrayPath.trim());
      if (!Array.isArray(array)) return '';
      
      return array.map((item, index) => {
        const itemData = { ...data, this: item, '@index': index };
        return parseTemplateAdvanced(itemTemplate, itemData);
      }).join('');
    }
  );
  
  // Handle simple variables
  result = result.replace(/\{\{([^#/][^}]*)\}\}/g, (match, path) => {
    const value = getNestedValue(data, path.trim());
    return value !== undefined ? escapeHtml(String(value)) : match;
  });
  
  return result;
}

function escapeHtml(str) {
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, char => htmlEntities[char]);
}
```

#### Explanation
- **Regex with capture group**: `/\{\{([^}]+)\}\}/g` captures content between `{{}}`
- **replace with function**: Callback receives match and captured groups
- **Nested property access**: Split path by `.` and traverse object
- **Preserve missing**: Return original placeholder if value undefined
- **HTML escaping**: Prevent XSS when using in HTML context

---

## 6. React & UI Tasks

### Question 19: Counter Component
**Difficulty**: Easy  
**Time Limit**: 10 minutes  
**Topics**: useState, Event handlers, Component state

#### Problem
Create a Counter component with:
- Increment button (+1)
- Decrement button (-1)
- Reset button (back to initial value)
- Display current count

#### Examples
```jsx
<Counter initialValue={10} />
// Displays: 10
// After clicking +: 11
// After clicking -: 10
// After clicking Reset: 10
```

#### Solution
```jsx
import React, { useState, useCallback } from 'react';

function Counter({ initialValue = 0, min = -Infinity, max = Infinity }) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => {
    setCount(prev => Math.min(prev + 1, max));
  }, [max]);
  
  const decrement = useCallback(() => {
    setCount(prev => Math.max(prev - 1, min));
  }, [min]);
  
  const reset = useCallback(() => {
    setCount(initialValue);
  }, [initialValue]);
  
  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <div className="counter-buttons">
        <button 
          onClick={decrement}
          disabled={count <= min}
          aria-label="Decrement"
        >
          -
        </button>
        <button 
          onClick={reset}
          aria-label="Reset"
        >
          Reset
        </button>
        <button 
          onClick={increment}
          disabled={count >= max}
          aria-label="Increment"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default Counter;
```

#### Explanation
- **useState**: Manages count state
- **useCallback**: Memoizes handlers (optional optimization)
- **Functional updates**: `prev => prev + 1` ensures correct value with rapid clicks
- **Props for customization**: `initialValue`, `min`, `max` make component reusable
- **Accessibility**: `aria-label` and `disabled` states

---

### Question 20: Controlled Form with Validation
**Difficulty**: Medium  
**Time Limit**: 20 minutes  
**Topics**: Controlled components, Form handling, Validation

#### Problem
Create a registration form with:
- Name (required, min 2 characters)
- Email (required, valid format)
- Password (required, min 8 characters)
- Show validation errors
- Disable submit until valid

#### Solution
```jsx
import React, { useState, useMemo } from 'react';

function RegistrationForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validate = useMemo(() => {
    const errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    return errors;
  }, [formData]);
  
  const isValid = Object.keys(validate).length === 0;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({ name: true, email: true, password: true });
    
    if (!isValid) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Submit failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getFieldError = (field) => {
    return touched[field] && validate[field];
  };
  
  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!getFieldError('name')}
          aria-describedby={getFieldError('name') ? 'name-error' : undefined}
        />
        {getFieldError('name') && (
          <span id="name-error" className="error" role="alert">
            {validate.name}
          </span>
        )}
      </div>
      
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!getFieldError('email')}
          aria-describedby={getFieldError('email') ? 'email-error' : undefined}
        />
        {getFieldError('email') && (
          <span id="email-error" className="error" role="alert">
            {validate.email}
          </span>
        )}
      </div>
      
      <div className="form-field">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={!!getFieldError('password')}
          aria-describedby={getFieldError('password') ? 'password-error' : undefined}
        />
        {getFieldError('password') && (
          <span id="password-error" className="error" role="alert">
            {validate.password}
          </span>
        )}
      </div>
      
      <button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Register'}
      </button>
    </form>
  );
}

export default RegistrationForm;
```

#### Explanation
- **Controlled inputs**: React controls input values via state
- **Touched state**: Only show errors after user interacts with field
- **useMemo for validation**: Recalculates only when formData changes
- **Accessibility**: ARIA attributes for screen readers
- **Submit handling**: Prevent default, validate, handle async submission

---

### Question 21: Bug Fix Challenge
**Difficulty**: Medium  
**Time Limit**: 15 minutes  
**Topics**: React hooks rules, Common pitfalls, Debugging

#### Problem
The following component has bugs. Find and fix them.

```jsx
// BUGGY CODE
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Bug 1: Missing dependency
  useEffect(() => {
    setLoading(true);
    fetchUser(userId).then(data => {
      setUser(data);
      setLoading(false);
    });
  }, []); // Missing userId dependency
  
  // Bug 2: Conditional hook
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Bug 3: This hook won't always run
  const [editMode, setEditMode] = useState(false);
  
  // Bug 4: Stale closure in event handler
  const handleSave = () => {
    saveUser(user).then(() => {
      console.log('Saved user:', user.name);
    });
  };
  
  return (
    <div>
      <h1>{user?.name}</h1>
      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? 'Cancel' : 'Edit'}
      </button>
      {editMode && (
        <button onClick={handleSave}>Save</button>
      )}
    </div>
  );
}
```

#### Solution
```jsx
import React, { useState, useEffect, useCallback } from 'react';

function UserProfile({ userId }) {
  // Fix 3: All hooks must be at the top, before any returns
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start true for initial load
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState(null);
  
  // Fix 1: Add userId to dependency array
  useEffect(() => {
    let isMounted = true; // Prevent state update on unmounted component
    
    setLoading(true);
    setError(null);
    
    fetchUser(userId)
      .then(data => {
        if (isMounted) {
          setUser(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [userId]); // Now re-fetches when userId changes
  
  // Fix 4: Use useCallback and include user in dependencies
  // Or better: use functional approach
  const handleSave = useCallback(async () => {
    if (!user) return;
    
    try {
      await saveUser(user);
      console.log('Saved user:', user.name);
      setEditMode(false);
    } catch (err) {
      setError('Failed to save: ' + err.message);
    }
  }, [user]); // user is now properly tracked
  
  // Fix 2: Conditional rendering happens AFTER all hooks
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  
  if (!user) {
    return <div>User not found</div>;
  }
  
  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={() => setEditMode(!editMode)}>
        {editMode ? 'Cancel' : 'Edit'}
      </button>
      {editMode && (
        <button onClick={handleSave}>Save</button>
      )}
    </div>
  );
}

export default UserProfile;
```

#### Explanation
- **Bug 1**: Missing `userId` in deps causes stale data when prop changes
- **Bug 2**: Early return before hook violates Rules of Hooks
- **Bug 3**: Hooks must be at top level, same order every render
- **Bug 4**: Without useCallback + deps, `user` may be stale in closure
- **Cleanup**: Prevent setState on unmounted component

---

### Question 22: Custom Hook for localStorage
**Difficulty**: Hard  
**Time Limit**: 25 minutes  
**Topics**: Custom hooks, localStorage, Synchronization

#### Problem
Create a custom hook `useLocalStorage` that:
- Persists state to localStorage
- Syncs across tabs
- Handles JSON serialization
- Returns same API as useState

#### Examples
```jsx
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 16);
  
  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme: {theme}
      </button>
      <input
        type="number"
        value={fontSize}
        onChange={(e) => setFontSize(Number(e.target.value))}
      />
    </div>
  );
}
```

#### Solution
```jsx
import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use default
  const getStoredValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue]);
  
  const [storedValue, setStoredValue] = useState(getStoredValue);
  
  // Update localStorage when state changes
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function like useState
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // Dispatch custom event for other tabs/windows
        window.dispatchEvent(new StorageEvent('storage', {
          key,
          newValue: JSON.stringify(valueToStore)
        }));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue));
        } catch {
          setStoredValue(event.newValue);
        }
      } else if (event.key === key && event.newValue === null) {
        // Key was removed
        setStoredValue(initialValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);
  
  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);
  
  return [storedValue, setValue, removeValue];
}

// Alternative: Modern version using useSyncExternalStore (React 18+)
function useLocalStorageModern(key, initialValue) {
  const getSnapshot = () => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  };
  
  const subscribe = (callback) => {
    const handleChange = (event) => {
      if (event.key === key || event.key === null) {
        callback();
      }
    };
    
    window.addEventListener('storage', handleChange);
    return () => window.removeEventListener('storage', handleChange);
  };
  
  const value = useSyncExternalStore(subscribe, getSnapshot);
  
  const setValue = useCallback((newValue) => {
    const valueToStore = newValue instanceof Function 
      ? newValue(getSnapshot()) 
      : newValue;
    
    localStorage.setItem(key, JSON.stringify(valueToStore));
    window.dispatchEvent(new StorageEvent('storage', { key }));
  }, [key]);
  
  return [value, setValue];
}

export default useLocalStorage;
```

#### Explanation
- **Lazy initialization**: Only read localStorage once on mount
- **JSON serialization**: Handles objects, arrays, primitives
- **Functional updates**: Support `setValue(prev => prev + 1)` syntax
- **Cross-tab sync**: Listen to `storage` event for changes in other tabs
- **SSR safety**: Check for `window` before accessing localStorage
- **Error handling**: Gracefully handle parse errors and quota issues

---

## 7. Frontend State Logic

### Question 23: Toggle/Switch Component
**Difficulty**: Easy  
**Time Limit**: 10 minutes  
**Topics**: State management, Controlled/Uncontrolled components

#### Problem
Create a Toggle component that:
- Can be controlled or uncontrolled
- Supports disabled state
- Has accessible labels

#### Solution
```jsx
import React, { useState, useId } from 'react';

function Toggle({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  onLabel = 'On',
  offLabel = 'Off'
}) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const id = useId();
  
  // Determine if controlled or uncontrolled
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;
  
  const handleToggle = () => {
    if (disabled) return;
    
    const newValue = !checked;
    
    if (!isControlled) {
      setInternalChecked(newValue);
    }
    
    onChange?.(newValue);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };
  
  return (
    <div className="toggle-container">
      {label && (
        <label htmlFor={id} className="toggle-label">
          {label}
        </label>
      )}
      
      <div
        id={id}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        className={`toggle ${checked ? 'toggle--on' : 'toggle--off'} ${disabled ? 'toggle--disabled' : ''}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        <span className="toggle-track">
          <span className="toggle-thumb" />
        </span>
        <span className="toggle-state">
          {checked ? onLabel : offLabel}
        </span>
      </div>
    </div>
  );
}

// CSS (for reference)
const styles = `
.toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.toggle--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-track {
  width: 48px;
  height: 24px;
  background: #ccc;
  border-radius: 12px;
  position: relative;
  transition: background 0.2s;
}

.toggle--on .toggle-track {
  background: #4caf50;
}

.toggle-thumb {
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.2s;
}

.toggle--on .toggle-thumb {
  transform: translateX(24px);
}
`;

export default Toggle;
```

#### Explanation
- **Controlled vs Uncontrolled**: Check if `checked` prop provided
- **Internal state**: Used only when uncontrolled
- **useId**: Generates unique ID for accessibility
- **Keyboard support**: Enter and Space to toggle
- **ARIA attributes**: `role="switch"`, `aria-checked`, `aria-disabled`

---

### Question 24: Shopping Cart State Management
**Difficulty**: Medium  
**Time Limit**: 20 minutes  
**Topics**: useReducer, Complex state, Actions

#### Problem
Implement shopping cart state management with:
- Add item to cart
- Remove item from cart
- Update item quantity
- Calculate totals
- Clear cart

#### Solution
```jsx
import React, { useReducer, useCallback, useMemo, createContext, useContext } from 'react';

// Action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART'
};

// Reducer
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingIndex = state.items.findIndex(
        item => item.id === product.id
      );
      
      if (existingIndex > -1) {
        // Update quantity of existing item
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity
        };
        return { ...state, items: newItems };
      }
      
      // Add new item
      return {
        ...state,
        items: [...state.items, { ...product, quantity }]
      };
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      const { productId } = action.payload;
      return {
        ...state,
        items: state.items.filter(item => item.id !== productId)
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== productId)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      };
    }
    
    case CART_ACTIONS.CLEAR_CART: {
      return { ...state, items: [] };
    }
    
    default:
      return state;
  }
}

// Initial state
const initialState = {
  items: []
};

// Context
const CartContext = createContext(null);

// Provider component
function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  const addItem = useCallback((product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity }
    });
  }, []);
  
  const removeItem = useCallback((productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { productId }
    });
  }, []);
  
  const updateQuantity = useCallback((productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { productId, quantity }
    });
  }, []);
  
  const clearCart = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  }, []);
  
  // Computed values
  const cartSummary = useMemo(() => {
    const itemCount = state.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
    
    const subtotal = state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    return {
      itemCount,
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  }, [state.items]);
  
  const value = {
    items: state.items,
    ...cartSummary,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook
function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Example usage
function CartDisplay() {
  const { items, itemCount, subtotal, tax, total, updateQuantity, removeItem, clearCart } = useCart();
  
  if (items.length === 0) {
    return <p>Your cart is empty</p>;
  }
  
  return (
    <div className="cart">
      <h2>Cart ({itemCount} items)</h2>
      
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <span>{item.name}</span>
            <span>${item.price}</span>
            <input
              type="number"
              min="0"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
            />
            <button onClick={() => removeItem(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      
      <div className="cart-summary">
        <p>Subtotal: ${subtotal}</p>
        <p>Tax: ${tax}</p>
        <p><strong>Total: ${total}</strong></p>
      </div>
      
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
}

export { CartProvider, useCart };
```

#### Explanation
- **useReducer**: Better for complex state with multiple actions
- **Action types**: Constants prevent typos
- **Immutable updates**: Always return new state objects
- **Context**: Share cart state across component tree
- **useMemo**: Calculate totals only when items change
- **useCallback**: Stable function references for actions

---

### Question 25: Undo/Redo Implementation
**Difficulty**: Hard  
**Time Limit**: 30 minutes  
**Topics**: State history, useReducer, Command pattern

#### Problem
Implement undo/redo functionality for a text editor or drawing app. Support:
- Undo last action
- Redo undone action
- Clear redo stack on new action
- Limit history size

#### Solution
```jsx
import React, { useReducer, useCallback, useMemo } from 'react';

// Generic undo/redo hook
function useUndoRedo(initialState, maxHistory = 50) {
  const initialHistory = {
    past: [],
    present: initialState,
    future: []
  };
  
  function historyReducer(state, action) {
    const { past, present, future } = state;
    
    switch (action.type) {
      case 'SET': {
        // New action clears future (redo stack)
        const newPast = [...past, present].slice(-maxHistory);
        return {
          past: newPast,
          present: action.payload,
          future: []
        };
      }
      
      case 'UNDO': {
        if (past.length === 0) return state;
        
        const previous = past[past.length - 1];
        const newPast = past.slice(0, -1);
        
        return {
          past: newPast,
          present: previous,
          future: [present, ...future]
        };
      }
      
      case 'REDO': {
        if (future.length === 0) return state;
        
        const next = future[0];
        const newFuture = future.slice(1);
        
        return {
          past: [...past, present],
          present: next,
          future: newFuture
        };
      }
      
      case 'RESET': {
        return {
          past: [],
          present: action.payload ?? initialState,
          future: []
        };
      }
      
      case 'CLEAR_HISTORY': {
        return {
          past: [],
          present,
          future: []
        };
      }
      
      default:
        return state;
    }
  }
  
  const [history, dispatch] = useReducer(historyReducer, initialHistory);
  
  const set = useCallback((newState) => {
    dispatch({ type: 'SET', payload: newState });
  }, []);
  
  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);
  
  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);
  
  const reset = useCallback((newState) => {
    dispatch({ type: 'RESET', payload: newState });
  }, []);
  
  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR_HISTORY' });
  }, []);
  
  const state = useMemo(() => ({
    value: history.present,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    historyLength: history.past.length,
    futureLength: history.future.length
  }), [history]);
  
  return {
    ...state,
    set,
    undo,
    redo,
    reset,
    clearHistory
  };
}

// Example: Simple text editor with undo/redo
function TextEditor() {
  const {
    value,
    set,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    historyLength
  } = useUndoRedo('');
  
  // Keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
      e.preventDefault();
      if (e.shiftKey) {
        redo();
      } else {
        undo();
      }
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
      e.preventDefault();
      redo();
    }
  }, [undo, redo]);
  
  return (
    <div className="text-editor" onKeyDown={handleKeyDown}>
      <div className="toolbar">
        <button onClick={undo} disabled={!canUndo}>
          Undo
        </button>
        <button onClick={redo} disabled={!canRedo}>
          Redo
        </button>
        <button onClick={() => reset('')}>
          Clear
        </button>
        <span className="history-info">
          History: {historyLength} states
        </span>
      </div>
      
      <textarea
        value={value}
        onChange={(e) => set(e.target.value)}
        placeholder="Type something..."
        rows={10}
      />
    </div>
  );
}

// Example: Drawing canvas with undo/redo
function DrawingCanvas() {
  const {
    value: shapes,
    set,
    undo,
    redo,
    canUndo,
    canRedo
  } = useUndoRedo([]);
  
  const addShape = useCallback((shape) => {
    set([...shapes, shape]);
  }, [shapes, set]);
  
  const addCircle = () => {
    addShape({
      id: Date.now(),
      type: 'circle',
      x: Math.random() * 400,
      y: Math.random() * 300,
      radius: 20 + Math.random() * 30,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    });
  };
  
  const addRectangle = () => {
    addShape({
      id: Date.now(),
      type: 'rectangle',
      x: Math.random() * 400,
      y: Math.random() * 300,
      width: 30 + Math.random() * 50,
      height: 30 + Math.random() * 50,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    });
  };
  
  return (
    <div className="drawing-canvas">
      <div className="toolbar">
        <button onClick={addCircle}>Add Circle</button>
        <button onClick={addRectangle}>Add Rectangle</button>
        <button onClick={undo} disabled={!canUndo}>Undo</button>
        <button onClick={redo} disabled={!canRedo}>Redo</button>
      </div>
      
      <svg width="500" height="400" style={{ border: '1px solid #ccc' }}>
        {shapes.map(shape => {
          if (shape.type === 'circle') {
            return (
              <circle
                key={shape.id}
                cx={shape.x}
                cy={shape.y}
                r={shape.radius}
                fill={shape.color}
              />
            );
          }
          if (shape.type === 'rectangle') {
            return (
              <rect
                key={shape.id}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                fill={shape.color}
              />
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
}

export { useUndoRedo, TextEditor, DrawingCanvas };
```

#### Explanation
- **Three-stack pattern**: past, present, future arrays
- **Immutable updates**: Always create new arrays
- **History limit**: Prevent memory issues with maxHistory
- **Clear future on new action**: Standard undo/redo behavior
- **Reusable hook**: Works with any state type
- **Keyboard shortcuts**: Ctrl+Z/Cmd+Z for undo, Ctrl+Y/Cmd+Shift+Z for redo

---

## 8. Building Small Features - Mini Apps

### Question 26: Searchable/Filterable List
**Difficulty**: Medium  
**Time Limit**: 25 minutes  
**Topics**: Filtering, Search, API integration

#### Problem
Create a component that:
- Fetches data from an API
- Allows searching by name
- Supports multiple filter options
- Shows loading and error states

#### Solution
```jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

function SearchableList({ apiUrl, filterOptions = [] }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  // Fetch data
  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        if (isMounted) {
          setItems(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    }
    
    fetchData();
    return () => { isMounted = false; };
  }, [apiUrl]);
  
  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = [...items];
    
    // Apply search filter
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply category filters
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        result = result.filter(item => values.includes(item[key]));
      }
    });
    
    // Apply sorting
    result.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (typeof aVal === 'string') {
        const comparison = aVal.localeCompare(bVal);
        return sortOrder === 'asc' ? comparison : -comparison;
      }
      
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });
    
    return result;
  }, [items, debouncedSearch, selectedFilters, sortBy, sortOrder]);
  
  const handleFilterChange = useCallback((filterKey, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  }, []);
  
  const handleSortChange = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  }, [sortBy]);
  
  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedFilters({});
    setSortBy('name');
    setSortOrder('asc');
  }, []);
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  
  return (
    <div className="searchable-list">
      {/* Search input */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={clearFilters}>Clear All</button>
      </div>
      
      {/* Filter options */}
      <div className="filters">
        {filterOptions.map(filter => (
          <div key={filter.key} className="filter-group">
            <label>{filter.label}</label>
            <select
              multiple={filter.multiple}
              value={selectedFilters[filter.key] || (filter.multiple ? [] : '')}
              onChange={(e) => {
                const value = filter.multiple
                  ? Array.from(e.target.selectedOptions, opt => opt.value)
                  : e.target.value ? [e.target.value] : [];
                handleFilterChange(filter.key, value);
              }}
            >
              <option value="">All</option>
              {filter.options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      
      {/* Sort controls */}
      <div className="sort-controls">
        <span>Sort by:</span>
        {['name', 'date', 'price'].map(field => (
          <button
            key={field}
            onClick={() => handleSortChange(field)}
            className={sortBy === field ? 'active' : ''}
          >
            {field} {sortBy === field && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        ))}
      </div>
      
      {/* Results count */}
      <div className="results-count">
        Showing {filteredItems.length} of {items.length} items
      </div>
      
      {/* Items list */}
      <ul className="items-list">
        {filteredItems.length === 0 ? (
          <li className="no-results">No items match your criteria</li>
        ) : (
          filteredItems.map(item => (
            <li key={item.id} className="item">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <span className="category">{item.category}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default SearchableList;
```

#### Explanation
- **Debounced search**: Prevents excessive filtering on each keystroke
- **Multiple filter types**: Search, category filters, sorting
- **useMemo**: Recalculate filtered results only when dependencies change
- **Clear filters**: Reset all filters to default state
- **Results count**: Shows how many items match current filters

---

### Question 27: CRUD Todo App with Persistence
**Difficulty**: Medium  
**Time Limit**: 30 minutes  
**Topics**: CRUD operations, localStorage, State management

#### Problem
Create a complete Todo app with:
- Add, edit, delete todos
- Mark as complete
- Filter by status
- Persist to localStorage
- Edit inline

#### Solution
```jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Custom hook for localStorage persistence
function usePersistentState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  
  return [state, setState];
}

function TodoApp() {
  const [todos, setTodos] = usePersistentState('todos', []);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  
  // Add new todo
  const addTodo = useCallback((e) => {
    e.preventDefault();
    const text = newTodo.trim();
    
    if (!text) return;
    
    const todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setTodos(prev => [todo, ...prev]);
    setNewTodo('');
  }, [newTodo, setTodos]);
  
  // Toggle completion
  const toggleTodo = useCallback((id) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, [setTodos]);
  
  // Delete todo
  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, [setTodos]);
  
  // Start editing
  const startEdit = useCallback((todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  }, []);
  
  // Save edit
  const saveEdit = useCallback((id) => {
    const text = editText.trim();
    
    if (!text) {
      deleteTodo(id);
    } else {
      setTodos(prev =>
        prev.map(todo =>
          todo.id === id ? { ...todo, text } : todo
        )
      );
    }
    
    setEditingId(null);
    setEditText('');
  }, [editText, deleteTodo, setTodos]);
  
  // Cancel edit
  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditText('');
  }, []);
  
  // Handle edit keydown
  const handleEditKeyDown = useCallback((e, id) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  }, [saveEdit, cancelEdit]);
  
  // Clear completed
  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, [setTodos]);
  
  // Toggle all
  const toggleAll = useCallback(() => {
    const allCompleted = todos.every(todo => todo.completed);
    setTodos(prev =>
      prev.map(todo => ({ ...todo, completed: !allCompleted }))
    );
  }, [todos, setTodos]);
  
  // Filtered todos
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);
  
  // Counts
  const counts = useMemo(() => ({
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  }), [todos]);
  
  return (
    <div className="todo-app">
      <h1>Todos</h1>
      
      {/* Add form */}
      <form onSubmit={addTodo} className="add-form">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          autoFocus
        />
        <button type="submit" disabled={!newTodo.trim()}>
          Add
        </button>
      </form>
      
      {todos.length > 0 && (
        <>
          {/* Toggle all */}
          <div className="toggle-all">
            <label>
              <input
                type="checkbox"
                checked={counts.active === 0}
                onChange={toggleAll}
              />
              Mark all as complete
            </label>
          </div>
          
          {/* Todo list */}
          <ul className="todo-list">
            {filteredTodos.map(todo => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? 'completed' : ''}`}
              >
                {editingId === todo.id ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                      onBlur={() => saveEdit(todo.id)}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="view-mode">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    <span
                      className="todo-text"
                      onDoubleClick={() => startEdit(todo)}
                    >
                      {todo.text}
                    </span>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTodo(todo.id)}
                    >
                      ×
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          
          {/* Footer */}
          <div className="todo-footer">
            <span className="count">
              {counts.active} item{counts.active !== 1 ? 's' : ''} left
            </span>
            
            <div className="filters">
              {['all', 'active', 'completed'].map(f => (
                <button
                  key={f}
                  className={filter === f ? 'active' : ''}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            
            {counts.completed > 0 && (
              <button className="clear-completed" onClick={clearCompleted}>
                Clear completed
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default TodoApp;
```

#### Explanation
- **Custom persistence hook**: Syncs state to localStorage
- **CRUD operations**: Create, Read, Update, Delete
- **Inline editing**: Double-click to edit, Enter to save, Escape to cancel
- **Filter tabs**: All, Active, Completed views
- **Bulk actions**: Toggle all, Clear completed
- **Counts**: Track items remaining

---

### Question 28: Autocomplete Component
**Difficulty**: Hard  
**Time Limit**: 35 minutes  
**Topics**: Debounce, Keyboard navigation, Accessibility, API integration

#### Problem
Create an autocomplete/typeahead component with:
- Debounced API calls
- Keyboard navigation (up/down arrows, Enter, Escape)
- Accessible (ARIA attributes)
- Loading and error states
- Highlight matching text

#### Solution
```jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

function Autocomplete({
  fetchSuggestions,
  onSelect,
  placeholder = 'Search...',
  debounceMs = 300,
  minChars = 2,
  maxSuggestions = 10
}) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const abortControllerRef = useRef(null);
  
  const debouncedValue = useDebounce(inputValue, debounceMs);
  
  // Fetch suggestions
  useEffect(() => {
    if (debouncedValue.length < minChars) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    async function loadSuggestions() {
      setLoading(true);
      setError(null);
      
      try {
        const results = await fetchSuggestions(
          debouncedValue,
          abortControllerRef.current.signal
        );
        
        setSuggestions(results.slice(0, maxSuggestions));
        setIsOpen(results.length > 0);
        setActiveIndex(-1);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Failed to load suggestions');
          setSuggestions([]);
        }
      } finally {
        setLoading(false);
      }
    }
    
    loadSuggestions();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedValue, fetchSuggestions, minChars, maxSuggestions]);
  
  // Handle selection
  const handleSelect = useCallback((suggestion) => {
    setInputValue(suggestion.label || suggestion.name || suggestion);
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
    onSelect?.(suggestion);
    inputRef.current?.focus();
  }, [onSelect]);
  
  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' && suggestions.length > 0) {
        setIsOpen(true);
        setActiveIndex(0);
        e.preventDefault();
      }
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
        
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          handleSelect(suggestions[activeIndex]);
        }
        break;
        
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
        
      case 'Tab':
        setIsOpen(false);
        break;
        
      default:
        break;
    }
  }, [isOpen, suggestions, activeIndex, handleSelect]);
  
  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeItem = listRef.current.children[activeIndex];
      activeItem?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);
  
  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        listRef.current &&
        !listRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Highlight matching text
  const highlightMatch = useCallback((text, query) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="highlight">{part}</mark>
      ) : (
        part
      )
    );
  }, []);
  
  const listId = 'autocomplete-list';
  const getOptionId = (index) => `autocomplete-option-${index}`;
  
  return (
    <div className="autocomplete">
      <div className="autocomplete-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listId}
          aria-activedescendant={
            activeIndex >= 0 ? getOptionId(activeIndex) : undefined
          }
          aria-autocomplete="list"
        />
        
        {loading && (
          <span className="loading-indicator" aria-live="polite">
            Loading...
          </span>
        )}
      </div>
      
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      
      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          id={listId}
          className="autocomplete-list"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => {
            const label = suggestion.label || suggestion.name || suggestion;
            const isActive = index === activeIndex;
            
            return (
              <li
                key={suggestion.id || index}
                id={getOptionId(index)}
                role="option"
                aria-selected={isActive}
                className={`autocomplete-option ${isActive ? 'active' : ''}`}
                onClick={() => handleSelect(suggestion)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {highlightMatch(label, inputValue)}
                {suggestion.description && (
                  <span className="option-description">
                    {suggestion.description}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
      
      {isOpen && suggestions.length === 0 && !loading && inputValue.length >= minChars && (
        <div className="no-results" role="status">
          No results found
        </div>
      )}
    </div>
  );
}

// Example usage
function SearchPage() {
  const fetchUsers = async (query, signal) => {
    const response = await fetch(
      `https://api.example.com/users?q=${encodeURIComponent(query)}`,
      { signal }
    );
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  };
  
  const handleSelect = (user) => {
    console.log('Selected user:', user);
  };
  
  return (
    <Autocomplete
      fetchSuggestions={fetchUsers}
      onSelect={handleSelect}
      placeholder="Search users..."
      debounceMs={300}
      minChars={2}
      maxSuggestions={8}
    />
  );
}

export default Autocomplete;
```

#### Explanation
- **Debounced input**: Waits for user to stop typing before API call
- **AbortController**: Cancels pending requests on new input
- **Keyboard navigation**: Full arrow key, Enter, Escape support
- **ARIA attributes**: `role="combobox"`, `aria-expanded`, `aria-activedescendant`
- **Highlight matching**: Regex-based text highlighting
- **Click outside**: Closes dropdown when clicking elsewhere
- **Scroll into view**: Active item scrolls into view during keyboard navigation
- **Loading/error states**: Proper feedback during async operations

---

## Quick Reference

### Array Methods
```javascript
map()       // Transform each element
filter()    // Keep elements matching condition
reduce()    // Accumulate to single value
find()      // First element matching condition
findIndex() // Index of first match
some()      // Any element matches?
every()     // All elements match?
includes()  // Contains value?
flat()      // Flatten nested arrays
flatMap()   // map + flat
```

### Object Methods
```javascript
Object.keys()         // Array of keys
Object.values()       // Array of values
Object.entries()      // Array of [key, value]
Object.fromEntries()  // Object from entries
Object.assign()       // Merge objects
{ ...obj }            // Spread (shallow copy)
```

### Map & Set
```javascript
// Map
new Map()           // Create
map.set(k, v)       // Add
map.get(k)          // Get
map.has(k)          // Check
map.delete(k)       // Remove
map.size            // Count
map.keys()          // Iterator of keys
map.values()        // Iterator of values

// Set
new Set()           // Create
set.add(v)          // Add
set.has(v)          // Check
set.delete(v)       // Remove
set.size            // Count
Array.from(set)     // To array
```

### React Hooks
```javascript
useState()          // State
useEffect()         // Side effects
useContext()        // Context value
useReducer()        // Complex state
useCallback()       // Memoize function
useMemo()           // Memoize value
useRef()            // Mutable ref
useId()             // Unique ID
```

### Time Complexity Cheat Sheet
| Operation | Array | Object | Map | Set |
|-----------|-------|--------|-----|-----|
| Access by index/key | O(1) | O(1) | O(1) | - |
| Search | O(n) | O(1) | O(1) | O(1) |
| Insert | O(n)* | O(1) | O(1) | O(1) |
| Delete | O(n) | O(1) | O(1) | O(1) |

*Array push is O(1) amortized

---

## Tips for Interview Success

1. **Clarify requirements** before coding
2. **Think aloud** - explain your approach
3. **Start simple**, then optimize
4. **Handle edge cases** (empty input, null, etc.)
5. **Test your code** with examples
6. **Know time/space complexity** of your solution
7. **Write clean, readable code** with good variable names
8. **Use modern JavaScript** (ES6+)
9. **Consider accessibility** for UI components
10. **Ask questions** if something is unclear

Good luck with your interview!
