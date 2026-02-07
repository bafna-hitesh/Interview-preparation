# JavaScript Complete Interview Guide
## Single Source for GoTo Round 2 - Staff Engineer Interview

---

## Table of Contents

### PART A: CORE JAVASCRIPT FUNDAMENTALS
- [Section 1: Execution Context and Memory](#section-1-execution-context-and-memory)
- [Section 2: Scope and Closures](#section-2-scope-and-closures)
- [Section 3: `this` Keyword Deep Dive](#section-3-this-keyword-deep-dive)
- [Section 4: Prototypes and Inheritance](#section-4-prototypes-and-inheritance)
- [Section 5: Type System and Coercion](#section-5-type-system-and-coercion)
- [Section 6: ES6+ Features (Complete)](#section-6-es6-features-complete)

### PART B: ASYNCHRONOUS JAVASCRIPT (CRITICAL)
- [Section 7: Event Loop Deep Dive](#section-7-event-loop-deep-dive)
- [Section 8: Promises Mastery](#section-8-promises-mastery)
- [Section 9: Async/Await Patterns](#section-9-asyncawait-patterns)

### PART C: IMPLEMENTATIONS (INTERVIEW FAVORITES)
- [Section 10: Must-Know Polyfills](#section-10-must-know-polyfills)
- [Section 11: Utility Functions](#section-11-utility-functions)
- [Section 11B: Practical Interview Utilities](#section-11b-practical-interview-utilities)
- [Section 12: Data Structure Implementations](#section-12-data-structure-implementations)
- [Section 13: Promise Implementations](#section-13-promise-implementations)

### PART D: DOM AND BROWSER (FRONTEND SPECIFIC)
- [Section 14: DOM Manipulation](#section-14-dom-manipulation)
- [Section 15: Events Deep Dive](#section-15-events-deep-dive)
- [Section 16: Browser APIs](#section-16-browser-apis)

### PART E: OUTPUT PREDICTION QUESTIONS (25+ Questions)
- [Section 17: Hoisting Questions](#section-17-hoisting-questions)
- [Section 18: Closure Questions](#section-18-closure-questions)
- [Section 19: `this` Keyword Questions](#section-19-this-keyword-questions)
- [Section 20: Event Loop Questions](#section-20-event-loop-questions)
- [Section 21: Prototype Questions](#section-21-prototype-questions)
- [Section 22: Tricky Edge Cases](#section-22-tricky-edge-cases)
- [Section 23: Bonus Quick-Fire Questions](#section-23-bonus-quick-fire-questions)

### PART F: CODING PATTERNS FOR LIVE INTERVIEWS
- [Section 24: Problem-Solving Approach](#section-24-problem-solving-approach)
- [Section 25: Common Interview Patterns](#section-25-common-interview-patterns)
- [Section 26: Quick Reference - Complexity Cheat Sheet](#section-26-quick-reference---complexity-cheat-sheet)
- [Section 27: Final Interview Tips](#section-27-final-interview-tips)

---

---

# PART A: CORE JAVASCRIPT FUNDAMENTALS

---

## Section 1: Execution Context and Memory

### 1.1 How JavaScript Engine Works

JavaScript is **single-threaded** with a **synchronous** execution model, but can handle async operations via the event loop.

```
┌─────────────────────────────────────────────────────────┐
│                    JavaScript Engine (V8)                │
│  ┌─────────────────┐    ┌─────────────────────────────┐ │
│  │   Memory Heap   │    │         Call Stack          │ │
│  │                 │    │                             │ │
│  │  Objects, Arrays│    │  Function Execution Context │ │
│  │  Functions      │    │                             │ │
│  └─────────────────┘    └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────┐
│                      Web APIs                            │
│    setTimeout, fetch, DOM events, localStorage           │
└─────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐    ┌─────────────────────────┐
│   Callback Queue        │    │   Microtask Queue       │
│   (Macrotask Queue)     │    │   (Job Queue)           │
│   setTimeout, setInterval│    │   Promises, queueMicro  │
└─────────────────────────┘    └─────────────────────────┘
```

### 1.2 Execution Context

Every time JavaScript code runs, it runs inside an **Execution Context**.

**Types of Execution Context:**
1. **Global Execution Context (GEC)** - Created when script first runs
2. **Function Execution Context (FEC)** - Created when a function is invoked
3. **Eval Execution Context** - Created inside eval() (rarely used)

**Two Phases of Execution Context:**

```javascript
// PHASE 1: Creation Phase (Memory Allocation)
// - Creates Variable Object (VO)
// - Sets up Scope Chain
// - Determines value of 'this'
// - Hoists variables (var → undefined, let/const → TDZ, functions → complete)

// PHASE 2: Execution Phase
// - Executes code line by line
// - Assigns values to variables
// - Executes function calls
```

**Example:**
```javascript
var a = 10;
function greet(name) {
    var message = 'Hello';
    return message + ' ' + name;
}
var result = greet('John');

// Creation Phase for Global Context:
// a = undefined
// greet = function reference (fully hoisted)
// result = undefined

// Execution Phase:
// a = 10
// greet('John') is called → New FEC created
// result = 'Hello John'
```

### 1.3 Call Stack

The **Call Stack** is a LIFO (Last In, First Out) data structure that tracks function execution.

```javascript
function first() {
    console.log('First');
    second();
    console.log('First End');
}

function second() {
    console.log('Second');
    third();
    console.log('Second End');
}

function third() {
    console.log('Third');
}

first();

// Call Stack progression:
// 1. [Global]
// 2. [Global, first]
// 3. [Global, first, second]
// 4. [Global, first, second, third]
// 5. [Global, first, second]  ← third() returns
// 6. [Global, first]          ← second() returns
// 7. [Global]                 ← first() returns

// Output:
// First
// Second
// Third
// Second End
// First End
```

**Stack Overflow:**
```javascript
function recursive() {
    recursive(); // No base case
}
recursive(); // RangeError: Maximum call stack size exceeded
```

### 1.4 Hoisting Deep Dive

**Hoisting** is JavaScript's behavior of moving declarations to the top of their scope during the creation phase.

#### Variable Hoisting

```javascript
// What you write:
console.log(a); // undefined (not ReferenceError!)
var a = 5;
console.log(a); // 5

// How JS interprets it:
var a;           // Declaration hoisted
console.log(a);  // undefined
a = 5;           // Assignment stays
console.log(a);  // 5
```

#### let/const Hoisting (TDZ)

```javascript
// let and const ARE hoisted, but in Temporal Dead Zone
console.log(a); // ReferenceError: Cannot access 'a' before initialization
let a = 5;

// TDZ exists from start of block to declaration
{
    // TDZ for 'x' starts here
    console.log(x); // ReferenceError
    let x = 10;     // TDZ ends here
}
```

#### Function Hoisting

```javascript
// Function declarations are FULLY hoisted
greet(); // Works! Output: "Hello"
function greet() {
    console.log('Hello');
}

// Function expressions are NOT fully hoisted
sayHi(); // TypeError: sayHi is not a function
var sayHi = function() {
    console.log('Hi');
};
// sayHi is hoisted as undefined (var), not as function
```

#### Hoisting Priority

```javascript
// Function declarations take precedence over variable declarations
var foo = 'bar';
function foo() {
    return 'function';
}
console.log(typeof foo); // 'string' (assignment overwrites)

// But during hoisting phase:
console.log(typeof foo); // 'function' (function hoisted first)
var foo = 'bar';
function foo() {
    return 'function';
}
```

**Interview Question:**
```javascript
// What's the output?
var a = 1;
function a() {}
console.log(typeof a); // ?

// Answer: 'number'
// During hoisting: function a is hoisted first, then var a (ignored since a exists)
// During execution: a = 1 overwrites the function
```

### 1.5 Temporal Dead Zone (TDZ)

TDZ is the period between entering a scope and the variable being declared.

```javascript
let x = 'outer';

function example() {
    // TDZ for inner 'x' starts here (due to let x below)
    console.log(x); // ReferenceError, NOT 'outer'!
    let x = 'inner';
}

// Why? JS knows 'x' will be declared in this scope, so it's in TDZ
```

**TDZ with Default Parameters:**
```javascript
// TDZ applies to default parameters too
function example(a = b, b = 2) {
    console.log(a, b);
}
example(); // ReferenceError: Cannot access 'b' before initialization

// Fix:
function example(b = 2, a = b) {
    console.log(a, b); // 2, 2
}
```

### 1.6 Memory Management: Stack vs Heap

```javascript
// STACK: Primitives (fixed size, fast access)
let a = 10;        // Stored in stack
let b = 'hello';   // Stored in stack
let c = true;      // Stored in stack

// HEAP: Objects (dynamic size, slower access)
let obj = { name: 'John' };  // Reference in stack, object in heap
let arr = [1, 2, 3];         // Reference in stack, array in heap
let func = function() {};    // Reference in stack, function in heap
```

**Pass by Value vs Reference:**
```javascript
// Primitives: Pass by Value (copy is made)
let x = 10;
let y = x;    // y gets a COPY of x
y = 20;
console.log(x); // 10 (unchanged)

// Objects: Pass by Reference (same memory location)
let obj1 = { name: 'John' };
let obj2 = obj1;  // obj2 points to SAME object
obj2.name = 'Jane';
console.log(obj1.name); // 'Jane' (changed!)

// BUT reassignment creates new reference
let obj3 = { name: 'John' };
let obj4 = obj3;
obj4 = { name: 'Jane' }; // obj4 now points to NEW object
console.log(obj3.name);  // 'John' (unchanged)
```

### 1.7 Garbage Collection

JavaScript uses **automatic garbage collection** - you don't manually free memory.

**Mark and Sweep Algorithm:**
1. Starts from "roots" (global object, currently executing functions)
2. Marks all objects reachable from roots
3. Sweeps (deletes) unmarked objects

```javascript
// Object becomes garbage when no references point to it
let obj = { data: 'important' };
obj = null; // Original object is now garbage, will be collected

// Circular references (modern GC handles this)
function createCircular() {
    let obj1 = {};
    let obj2 = {};
    obj1.ref = obj2;
    obj2.ref = obj1;
    // When function ends, both become unreachable and collected
}
```

### 1.8 Memory Leaks and Prevention

**Common Memory Leaks:**

```javascript
// 1. Accidental Global Variables
function leak() {
    leaked = 'I am global!'; // Missing 'var/let/const'
}
// Fix: Use 'use strict' or always declare variables

// 2. Forgotten Timers
let data = fetchHugeData();
setInterval(() => {
    processData(data); // 'data' can never be garbage collected
}, 1000);
// Fix: Clear intervals when done
const timer = setInterval(() => {}, 1000);
clearInterval(timer);

// 3. Closures holding references
function outer() {
    const hugeArray = new Array(1000000).fill('data');
    return function inner() {
        console.log(hugeArray.length); // hugeArray kept in memory
    };
}
const leak = outer(); // hugeArray stays in memory as long as 'leak' exists

// 4. Detached DOM nodes
const button = document.getElementById('btn');
document.body.removeChild(button);
// If 'button' variable still exists, DOM node stays in memory
// Fix: button = null;

// 5. Event listeners not removed
element.addEventListener('click', handler);
// Fix: element.removeEventListener('click', handler);
```

---

## Section 2: Scope and Closures

### 2.1 Lexical Scope

**Lexical scope** means scope is determined by where variables are declared in the source code, not where they're called.

```javascript
let globalVar = 'global';

function outer() {
    let outerVar = 'outer';
    
    function inner() {
        let innerVar = 'inner';
        console.log(innerVar);  // 'inner' - own scope
        console.log(outerVar);  // 'outer' - parent scope
        console.log(globalVar); // 'global' - global scope
    }
    
    inner();
}

outer();
// inner() can access outerVar because it's lexically inside outer()
// This is determined at write-time, not run-time
```

### 2.2 Scope Chain

When a variable is accessed, JS looks up the **scope chain**:
1. Current scope
2. Parent scope
3. Parent's parent scope
4. ... until Global scope
5. If not found → ReferenceError

```javascript
let a = 1;

function first() {
    let b = 2;
    
    function second() {
        let c = 3;
        
        function third() {
            let d = 4;
            console.log(a, b, c, d); // Can access all!
        }
        third();
    }
    second();
}
first();

// Scope chain for third():
// third scope → second scope → first scope → global scope
```

### 2.3 Block Scope (ES6)

```javascript
// var: Function scoped (ignores blocks)
if (true) {
    var x = 10;
}
console.log(x); // 10 (accessible outside block!)

// let/const: Block scoped
if (true) {
    let y = 20;
    const z = 30;
}
console.log(y); // ReferenceError
console.log(z); // ReferenceError

// Block scope in loops
for (let i = 0; i < 3; i++) {
    // Each iteration gets its own 'i'
}
console.log(i); // ReferenceError

for (var j = 0; j < 3; j++) {
    // Same 'j' shared across iterations
}
console.log(j); // 3 (accessible!)
```

### 2.4 Closures

**A closure is a function that remembers its lexical scope even when executed outside that scope.**

```javascript
function createCounter() {
    let count = 0; // This variable is "enclosed"
    
    return function() {
        count++;
        return count;
    };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
// 'count' persists because the returned function "closes over" it
```

### 2.5 Closure Examples (5 Practical Uses)

#### Example 1: Data Privacy / Encapsulation
```javascript
function createBankAccount(initialBalance) {
    let balance = initialBalance; // Private variable
    
    return {
        deposit(amount) {
            if (amount > 0) {
                balance += amount;
                return balance;
            }
        },
        withdraw(amount) {
            if (amount > 0 && amount <= balance) {
                balance -= amount;
                return balance;
            }
            return 'Insufficient funds';
        },
        getBalance() {
            return balance;
        }
    };
}

const account = createBankAccount(100);
console.log(account.getBalance()); // 100
account.deposit(50);
console.log(account.getBalance()); // 150
console.log(account.balance);      // undefined (private!)
```

#### Example 2: Function Factory
```javascript
function multiply(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = multiply(2);
const triple = multiply(3);
const quadruple = multiply(4);

console.log(double(5));    // 10
console.log(triple(5));    // 15
console.log(quadruple(5)); // 20
```

#### Example 3: Memoization
```javascript
function memoize(fn) {
    const cache = {}; // Closure over cache
    
    return function(...args) {
        const key = JSON.stringify(args);
        if (cache[key]) {
            console.log('From cache');
            return cache[key];
        }
        console.log('Computing...');
        const result = fn(...args);
        cache[key] = result;
        return result;
    };
}

const expensiveFn = (n) => {
    // Simulate expensive operation
    let result = 0;
    for (let i = 0; i < n * 1000000; i++) {
        result += i;
    }
    return result;
};

const memoizedFn = memoize(expensiveFn);
memoizedFn(10); // Computing... (slow)
memoizedFn(10); // From cache (fast)
```

#### Example 4: Event Handlers with State
```javascript
function createClickCounter(buttonId) {
    let clicks = 0;
    
    document.getElementById(buttonId).addEventListener('click', function() {
        clicks++;
        console.log(`Button clicked ${clicks} times`);
    });
}

createClickCounter('myButton');
// Each click increments the enclosed 'clicks' variable
```

#### Example 5: Partial Application
```javascript
function greet(greeting, name) {
    return `${greeting}, ${name}!`;
}

function partial(fn, ...fixedArgs) {
    return function(...remainingArgs) {
        return fn(...fixedArgs, ...remainingArgs);
    };
}

const sayHello = partial(greet, 'Hello');
const sayHi = partial(greet, 'Hi');

console.log(sayHello('John')); // 'Hello, John!'
console.log(sayHi('Jane'));    // 'Hi, Jane!'
```

### 2.6 Classic Closure Interview Question

```javascript
// The famous setTimeout in loop problem
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000);
}
// Output: 3, 3, 3 (NOT 0, 1, 2!)
// Why? All callbacks share the same 'i', which is 3 after loop ends

// Solution 1: Use let (block scope)
for (let i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000);
}
// Output: 0, 1, 2 (each iteration gets its own 'i')

// Solution 2: Use IIFE to create new scope
for (var i = 0; i < 3; i++) {
    (function(j) {
        setTimeout(function() {
            console.log(j);
        }, 1000);
    })(i);
}
// Output: 0, 1, 2

// Solution 3: Use bind or third param of setTimeout
for (var i = 0; i < 3; i++) {
    setTimeout(function(j) {
        console.log(j);
    }, 1000, i);
}
// Output: 0, 1, 2
```

### 2.7 IIFE (Immediately Invoked Function Expression)

```javascript
// Basic IIFE
(function() {
    console.log('I run immediately!');
})();

// IIFE with parameters
(function(name) {
    console.log('Hello, ' + name);
})('John');

// IIFE returning a value
const result = (function() {
    return 42;
})();

// Arrow function IIFE
(() => {
    console.log('Arrow IIFE');
})();

// Named IIFE (useful for recursion)
(function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
})(5); // 120
```

**Why Use IIFE?**
1. Avoid polluting global scope
2. Create private scope
3. Module pattern (pre-ES6)

### 2.8 Module Pattern

```javascript
const Calculator = (function() {
    // Private variables
    let result = 0;
    
    // Private function
    function validate(n) {
        return typeof n === 'number' && !isNaN(n);
    }
    
    // Public API (revealed)
    return {
        add(n) {
            if (validate(n)) result += n;
            return this;
        },
        subtract(n) {
            if (validate(n)) result -= n;
            return this;
        },
        multiply(n) {
            if (validate(n)) result *= n;
            return this;
        },
        getResult() {
            return result;
        },
        reset() {
            result = 0;
            return this;
        }
    };
})();

Calculator.add(10).multiply(2).subtract(5);
console.log(Calculator.getResult()); // 15
console.log(Calculator.result);       // undefined (private)
```

---

## Section 3: `this` Keyword Deep Dive

### 3.1 What is `this`?

`this` is a special keyword that refers to the **execution context** of a function. Its value is determined by **how** a function is called, not where it's defined.

### 3.2 Four Binding Rules

#### Rule 1: Default Binding
When a function is called as a standalone function, `this` refers to:
- **Global object** (window in browser, global in Node) in non-strict mode
- **undefined** in strict mode

```javascript
function showThis() {
    console.log(this);
}
showThis(); // window (browser) or global (Node)

// Strict mode
'use strict';
function showThisStrict() {
    console.log(this);
}
showThisStrict(); // undefined
```

#### Rule 2: Implicit Binding
When a function is called as a method of an object, `this` refers to the object.

```javascript
const person = {
    name: 'John',
    greet() {
        console.log(`Hello, I'm ${this.name}`);
    }
};

person.greet(); // "Hello, I'm John" (this = person)

// Nested objects: this refers to the IMMEDIATE object
const company = {
    name: 'TechCorp',
    employee: {
        name: 'John',
        introduce() {
            console.log(`I'm ${this.name}`);
        }
    }
};

company.employee.introduce(); // "I'm John" (this = employee, not company)
```

#### Rule 3: Explicit Binding (call, apply, bind)

```javascript
function greet(greeting, punctuation) {
    console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const person = { name: 'John' };

// call: pass arguments individually
greet.call(person, 'Hello', '!'); // "Hello, I'm John!"

// apply: pass arguments as array
greet.apply(person, ['Hi', '?']); // "Hi, I'm John?"

// bind: returns new function with 'this' bound
const boundGreet = greet.bind(person);
boundGreet('Hey', '.'); // "Hey, I'm John."

// bind with partial application
const sayHello = greet.bind(person, 'Hello');
sayHello('!'); // "Hello, I'm John!"
```

#### Rule 4: `new` Binding
When a function is called with `new`, `this` refers to the newly created object.

```javascript
function Person(name, age) {
    // 'this' is a new empty object {}
    this.name = name;
    this.age = age;
    // Implicit: return this;
}

const john = new Person('John', 30);
console.log(john.name); // 'John'
console.log(john.age);  // 30

// What 'new' does:
// 1. Creates new empty object {}
// 2. Sets prototype: {}.__proto__ = Person.prototype
// 3. Calls Person() with 'this' = new object
// 4. Returns the object (unless function returns an object)
```

### 3.3 Binding Precedence

From highest to lowest:
1. **new binding** (highest)
2. **Explicit binding** (call, apply, bind)
3. **Implicit binding** (method call)
4. **Default binding** (lowest)

```javascript
function foo() {
    console.log(this.a);
}

const obj1 = { a: 1, foo };
const obj2 = { a: 2 };

// Implicit vs Explicit: Explicit wins
obj1.foo.call(obj2); // 2 (not 1)

// Explicit vs new: new wins
const BoundFoo = foo.bind({ a: 3 });
const instance = new BoundFoo();
console.log(instance.a); // undefined (new object, not bound object)
```

### 3.4 Arrow Functions and `this`

Arrow functions **do not** have their own `this`. They inherit `this` from their **lexical scope** (where they're defined).

```javascript
const person = {
    name: 'John',
    
    // Regular method: 'this' depends on how it's called
    regularGreet: function() {
        console.log(`Regular: ${this.name}`);
    },
    
    // Arrow method: 'this' is lexical (from enclosing scope)
    arrowGreet: () => {
        console.log(`Arrow: ${this.name}`);
    }
};

person.regularGreet(); // "Regular: John"
person.arrowGreet();   // "Arrow: undefined" (this = window/global)

// Arrow functions are useful in callbacks:
const person2 = {
    name: 'Jane',
    friends: ['Alice', 'Bob'],
    
    // Problem with regular function:
    listFriendsWrong() {
        this.friends.forEach(function(friend) {
            console.log(`${this.name} knows ${friend}`);
            // this.name is undefined! 'this' is lost in callback
        });
    },
    
    // Solution 1: Arrow function
    listFriendsArrow() {
        this.friends.forEach((friend) => {
            console.log(`${this.name} knows ${friend}`);
            // Works! Arrow inherits 'this' from listFriendsArrow
        });
    },
    
    // Solution 2: Store 'this'
    listFriendsSelf() {
        const self = this;
        this.friends.forEach(function(friend) {
            console.log(`${self.name} knows ${friend}`);
        });
    },
    
    // Solution 3: Use bind
    listFriendsBind() {
        this.friends.forEach(function(friend) {
            console.log(`${this.name} knows ${friend}`);
        }.bind(this));
    }
};
```

### 3.5 Common `this` Pitfalls

#### Pitfall 1: Losing `this` in callbacks
```javascript
const button = {
    text: 'Click me',
    click() {
        console.log(`Button says: ${this.text}`);
    }
};

button.click(); // "Button says: Click me"

// Passing method as callback loses 'this'
setTimeout(button.click, 1000); // "Button says: undefined"

// Solutions:
setTimeout(() => button.click(), 1000);      // Arrow wrapper
setTimeout(button.click.bind(button), 1000); // Bind
```

#### Pitfall 2: Event handlers
```javascript
class Button {
    constructor(text) {
        this.text = text;
    }
    
    handleClick() {
        console.log(`Clicked: ${this.text}`);
    }
    
    // WRONG: 'this' will be the DOM element
    attachWrong(element) {
        element.addEventListener('click', this.handleClick);
    }
    
    // CORRECT: Bind or arrow function
    attachCorrect(element) {
        element.addEventListener('click', this.handleClick.bind(this));
        // OR
        element.addEventListener('click', () => this.handleClick());
    }
}
```

#### Pitfall 3: Nested functions
```javascript
const obj = {
    value: 42,
    getValue() {
        function inner() {
            return this.value; // 'this' is window/undefined!
        }
        return inner();
    }
};

console.log(obj.getValue()); // undefined

// Fix with arrow function:
const objFixed = {
    value: 42,
    getValue() {
        const inner = () => {
            return this.value; // Arrow inherits 'this'
        };
        return inner();
    }
};

console.log(objFixed.getValue()); // 42
```

### 3.6 `this` Interview Questions

```javascript
// Question 1: What's the output?
const obj = {
    name: 'Object',
    getName: () => this.name,
    getName2() { return this.name; }
};
console.log(obj.getName());  // undefined (arrow, this = global)
console.log(obj.getName2()); // 'Object' (regular method)

// Question 2: What's the output?
function foo() {
    console.log(this.a);
}
const obj1 = { a: 2, foo };
const obj2 = { a: 3, foo };

obj1.foo();        // 2
obj2.foo();        // 3
obj1.foo.call(obj2); // 3

// Question 3: What's the output?
const obj = {
    a: 1,
    getA() {
        return this.a;
    }
};
const getA = obj.getA;
console.log(getA()); // undefined (lost this)
console.log(obj.getA()); // 1

// Question 4: What's the output?
function Foo() {
    this.a = 1;
    return { a: 2 };
}
const foo = new Foo();
console.log(foo.a); // 2 (returned object overrides)

function Bar() {
    this.a = 1;
    return 42; // Primitives are ignored
}
const bar = new Bar();
console.log(bar.a); // 1
```

---

## Section 4: Prototypes and Inheritance

### 4.1 Everything is an Object (Almost)

```javascript
// Primitives are not objects but can behave like them
const str = 'hello';
console.log(str.toUpperCase()); // 'HELLO'
// JS temporarily wraps primitive in String object, calls method, discards wrapper

// Check types:
console.log(typeof 'string');   // 'string'
console.log(typeof 42);         // 'number'
console.log(typeof true);       // 'boolean'
console.log(typeof undefined);  // 'undefined'
console.log(typeof null);       // 'object' (famous bug!)
console.log(typeof {});         // 'object'
console.log(typeof []);         // 'object'
console.log(typeof function(){}); // 'function'
```

### 4.2 Prototype Chain

Every object has an internal `[[Prototype]]` link to another object. This forms a chain ending at `null`.

```
                    null
                      ▲
                      │ [[Prototype]]
              Object.prototype
              { toString, hasOwnProperty, ... }
                      ▲
                      │ [[Prototype]]
              Array.prototype
              { map, filter, forEach, ... }
                      ▲
                      │ [[Prototype]]
                  [1, 2, 3]
```

```javascript
const arr = [1, 2, 3];

// Property lookup:
arr.length;       // Found on arr itself
arr.map();        // Found on Array.prototype
arr.toString();   // Found on Object.prototype
arr.foo;          // undefined (not found anywhere in chain)

// Verify the chain:
console.log(arr.__proto__ === Array.prototype);           // true
console.log(Array.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__ === null);         // true
```

### 4.3 `__proto__` vs `prototype` vs `Object.getPrototypeOf()`

```javascript
// __proto__: The actual link to prototype (accessor property)
// Every object has __proto__

// prototype: Only exists on FUNCTIONS
// It's the object that will become __proto__ of instances

function Person(name) {
    this.name = name;
}
Person.prototype.greet = function() {
    return `Hello, ${this.name}`;
};

const john = new Person('John');

// john.__proto__ points to Person.prototype
console.log(john.__proto__ === Person.prototype); // true

// Object.getPrototypeOf() - modern way to get prototype
console.log(Object.getPrototypeOf(john) === Person.prototype); // true

// Object.setPrototypeOf() - set prototype (not recommended for performance)
Object.setPrototypeOf(john, { greet: () => 'Hi!' });
```

### 4.4 Property Lookup and Shadowing

```javascript
function Animal(name) {
    this.name = name;
}
Animal.prototype.speak = function() {
    return `${this.name} makes a sound`;
};

const dog = new Animal('Dog');

// Property lookup:
console.log(dog.name);  // 'Dog' (own property)
console.log(dog.speak()); // 'Dog makes a sound' (from prototype)

// Property shadowing:
dog.speak = function() {
    return `${this.name} barks!`;
};
console.log(dog.speak()); // 'Dog barks!' (own property shadows prototype)

// Check if property is own or inherited:
console.log(dog.hasOwnProperty('name'));  // true
console.log(dog.hasOwnProperty('speak')); // true (after shadowing)

const cat = new Animal('Cat');
console.log(cat.hasOwnProperty('speak')); // false (inherited)
```

### 4.5 Creating Objects

```javascript
// Method 1: Object literal
const obj1 = { name: 'John' };

// Method 2: Constructor function
function Person(name) {
    this.name = name;
}
const obj2 = new Person('John');

// Method 3: Object.create()
const proto = { greet() { return `Hello, ${this.name}`; } };
const obj3 = Object.create(proto);
obj3.name = 'John';

// Method 4: ES6 Class
class PersonClass {
    constructor(name) {
        this.name = name;
    }
}
const obj4 = new PersonClass('John');

// Object.create(null) - object with no prototype
const bareObj = Object.create(null);
console.log(bareObj.toString); // undefined (no inherited methods!)
// Useful for creating clean hash maps
```

### 4.6 ES6 Classes (Syntactic Sugar)

```javascript
// ES6 Class
class Animal {
    constructor(name) {
        this.name = name;
    }
    
    speak() {
        return `${this.name} makes a sound`;
    }
    
    // Static method (on class, not instances)
    static isAnimal(obj) {
        return obj instanceof Animal;
    }
    
    // Getter
    get info() {
        return `Animal: ${this.name}`;
    }
    
    // Setter
    set nickname(nick) {
        this._nickname = nick;
    }
}

// Is equivalent to:
function AnimalOld(name) {
    this.name = name;
}
AnimalOld.prototype.speak = function() {
    return `${this.name} makes a sound`;
};
AnimalOld.isAnimal = function(obj) {
    return obj instanceof AnimalOld;
};
```

### 4.7 Inheritance with `extends` and `super`

```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }
    
    speak() {
        return `${this.name} makes a sound`;
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name); // MUST call super() before using 'this'
        this.breed = breed;
    }
    
    speak() {
        return `${this.name} barks!`; // Override parent method
    }
    
    parentSpeak() {
        return super.speak(); // Call parent method
    }
}

const buddy = new Dog('Buddy', 'Golden Retriever');
console.log(buddy.speak());       // 'Buddy barks!'
console.log(buddy.parentSpeak()); // 'Buddy makes a sound'

// Prototype chain:
// buddy → Dog.prototype → Animal.prototype → Object.prototype → null
```

### 4.8 `instanceof` vs `typeof`

```javascript
// typeof: Returns string indicating type of primitive/function
console.log(typeof 'hello');     // 'string'
console.log(typeof 42);          // 'number'
console.log(typeof true);        // 'boolean'
console.log(typeof undefined);   // 'undefined'
console.log(typeof null);        // 'object' (bug!)
console.log(typeof {});          // 'object'
console.log(typeof []);          // 'object' (arrays are objects!)
console.log(typeof function(){}); // 'function'
console.log(typeof Symbol());    // 'symbol'
console.log(typeof BigInt(1));   // 'bigint'

// instanceof: Checks prototype chain
console.log([] instanceof Array);   // true
console.log([] instanceof Object);  // true
console.log({} instanceof Array);   // false
console.log({} instanceof Object);  // true

// Better type checking:
console.log(Object.prototype.toString.call([]));     // '[object Array]'
console.log(Object.prototype.toString.call({}));     // '[object Object]'
console.log(Object.prototype.toString.call(null));   // '[object Null]'
console.log(Object.prototype.toString.call(/regex/)); // '[object RegExp]'
console.log(Object.prototype.toString.call(new Date())); // '[object Date]'

// Array.isArray() for arrays
console.log(Array.isArray([]));  // true
console.log(Array.isArray({}));  // false
```

---

## Section 5: Type System and Coercion

### 5.1 Primitive Types (7) + Object

```javascript
// 7 Primitive Types:
// 1. string
// 2. number
// 3. boolean
// 4. undefined
// 5. null
// 6. symbol (ES6)
// 7. bigint (ES11)

// + Object (non-primitive)

// Primitives are immutable
let str = 'hello';
str[0] = 'H'; // Does nothing
console.log(str); // 'hello'

// Objects are mutable
let obj = { a: 1 };
obj.a = 2;
console.log(obj.a); // 2
```

### 5.2 Type Coercion

JavaScript automatically converts types when needed.

#### ToNumber Coercion
```javascript
Number('42');        // 42
Number('42px');      // NaN
Number('');          // 0
Number(' ');         // 0
Number(true);        // 1
Number(false);       // 0
Number(null);        // 0
Number(undefined);   // NaN
Number([]);          // 0
Number([1]);         // 1
Number([1,2]);       // NaN
Number({});          // NaN

// Implicit coercion with mathematical operators
'5' - 2;   // 3 (string to number)
'5' * 2;   // 10
'5' / 2;   // 2.5
'5' + 2;   // '52' (number to string! + prefers strings)
```

#### ToString Coercion
```javascript
String(42);          // '42'
String(true);        // 'true'
String(false);       // 'false'
String(null);        // 'null'
String(undefined);   // 'undefined'
String([1, 2, 3]);   // '1,2,3'
String({});          // '[object Object]'
String({ toString: () => 'custom' }); // 'custom'
```

#### ToBoolean Coercion (Truthy/Falsy)
```javascript
// FALSY values (only these 8):
Boolean(false);      // false
Boolean(0);          // false
Boolean(-0);         // false
Boolean(0n);         // false (BigInt zero)
Boolean('');         // false
Boolean(null);       // false
Boolean(undefined);  // false
Boolean(NaN);        // false

// EVERYTHING else is TRUTHY:
Boolean('false');    // true (non-empty string!)
Boolean('0');        // true
Boolean([]);         // true (empty array!)
Boolean({});         // true (empty object!)
Boolean(function(){}); // true
Boolean(-1);         // true
Boolean(Infinity);   // true
```

### 5.3 `==` vs `===`

```javascript
// === (Strict Equality): No type coercion
5 === 5;        // true
5 === '5';      // false (different types)
null === undefined; // false

// == (Abstract Equality): Type coercion happens
5 == '5';       // true (string converted to number)
null == undefined; // true (special rule)
0 == false;     // true
'' == false;    // true
[] == false;    // true ([].toString() = '', '' == false)
[] == 0;        // true
[] == '';       // true

// Weird cases:
[] == ![];      // true! ([] is truthy, ![] is false, [] == false is true)
NaN == NaN;     // false (NaN is not equal to anything, including itself)
```

**Recommendation:** Always use `===` except when explicitly checking for `null` or `undefined`:
```javascript
// Checking for null or undefined
if (value == null) {
    // value is null OR undefined
}
// Equivalent to:
if (value === null || value === undefined) {
    // ...
}
```

### 5.4 `typeof` Quirks

```javascript
// The null bug
typeof null; // 'object' (historical bug, can't be fixed)

// Arrays are objects
typeof []; // 'object'

// Functions have their own type
typeof function() {}; // 'function'

// NaN is a number
typeof NaN; // 'number'

// typeof with undeclared variables doesn't throw
typeof undeclaredVar; // 'undefined' (not ReferenceError)
```

### 5.5 NaN Handling

```javascript
// NaN: Not a Number
console.log(typeof NaN); // 'number' (ironic!)

// NaN is the only value not equal to itself
NaN === NaN; // false
NaN == NaN;  // false

// Checking for NaN:
isNaN(NaN);       // true
isNaN('hello');   // true (coerces to NaN first, then checks)
isNaN(undefined); // true

// Better: Number.isNaN() (ES6) - no coercion
Number.isNaN(NaN);       // true
Number.isNaN('hello');   // false (no coercion)
Number.isNaN(undefined); // false

// Other ways:
const x = NaN;
x !== x; // true (only NaN has this property)
Object.is(x, NaN); // true
```

### 5.6 Symbol

```javascript
// Symbol: Unique identifier
const sym1 = Symbol('description');
const sym2 = Symbol('description');
console.log(sym1 === sym2); // false (always unique)

// Use case 1: Unique property keys
const ID = Symbol('id');
const user = {
    name: 'John',
    [ID]: 12345
};
console.log(user[ID]); // 12345
console.log(Object.keys(user)); // ['name'] (Symbols not included)

// Use case 2: Well-known Symbols
// Symbol.iterator, Symbol.toStringTag, Symbol.hasInstance, etc.

// Global Symbol registry
const globalSym = Symbol.for('app.id');
const sameSym = Symbol.for('app.id');
console.log(globalSym === sameSym); // true

// Get key from global symbol
console.log(Symbol.keyFor(globalSym)); // 'app.id'
```

---

## Section 6: ES6+ Features (Complete)

### 6.1 var vs let vs const

```javascript
// var: Function scoped, hoisted as undefined
function varExample() {
    console.log(x); // undefined (hoisted)
    var x = 10;
    if (true) {
        var x = 20; // Same variable!
    }
    console.log(x); // 20
}

// let: Block scoped, hoisted but in TDZ
function letExample() {
    // console.log(y); // ReferenceError: TDZ
    let y = 10;
    if (true) {
        let y = 20; // Different variable (new block)
        console.log(y); // 20
    }
    console.log(y); // 10
}

// const: Block scoped, must be initialized, cannot be reassigned
const z = 10;
// z = 20; // TypeError: Assignment to constant
// const a; // SyntaxError: Missing initializer

// BUT const objects/arrays can be mutated
const obj = { a: 1 };
obj.a = 2; // OK
obj.b = 3; // OK
// obj = {}; // TypeError: Cannot reassign

const arr = [1, 2, 3];
arr.push(4); // OK
// arr = []; // TypeError: Cannot reassign
```

### 6.2 Destructuring

```javascript
// Object destructuring
const user = { name: 'John', age: 30, city: 'NYC' };

const { name, age } = user;
console.log(name, age); // 'John' 30

// With renaming
const { name: userName, age: userAge } = user;
console.log(userName, userAge); // 'John' 30

// With default values
const { country = 'USA' } = user;
console.log(country); // 'USA'

// Nested destructuring
const data = {
    user: {
        profile: {
            name: 'John',
            settings: { theme: 'dark' }
        }
    }
};
const { user: { profile: { name: n, settings: { theme } } } } = data;
console.log(n, theme); // 'John' 'dark'

// Array destructuring
const colors = ['red', 'green', 'blue'];
const [first, second] = colors;
console.log(first, second); // 'red' 'green'

// Skip elements
const [, , third] = colors;
console.log(third); // 'blue'

// Rest pattern
const [head, ...tail] = colors;
console.log(head, tail); // 'red' ['green', 'blue']

// Swap variables
let a = 1, b = 2;
[a, b] = [b, a];
console.log(a, b); // 2 1

// Function parameter destructuring
function greet({ name, age = 18 }) {
    console.log(`${name} is ${age}`);
}
greet({ name: 'John' }); // 'John is 18'
```

### 6.3 Spread and Rest Operators

```javascript
// SPREAD: Expands iterable into individual elements

// Array spread
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5]; // [1, 2, 3, 4, 5]
const arrCopy = [...arr1];   // Shallow copy

// Object spread
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 }; // { a: 1, b: 2, c: 3 }
const objCopy = { ...obj1 };    // Shallow copy

// Override properties (last wins)
const merged = { ...obj1, b: 99 }; // { a: 1, b: 99 }

// Function calls
const numbers = [1, 2, 3];
Math.max(...numbers); // 3

// REST: Collects remaining elements

// Function parameters
function sum(...nums) {
    return nums.reduce((a, b) => a + b, 0);
}
sum(1, 2, 3, 4); // 10

// Destructuring rest
const [first, ...rest] = [1, 2, 3, 4];
console.log(rest); // [2, 3, 4]

const { a, ...others } = { a: 1, b: 2, c: 3 };
console.log(others); // { b: 2, c: 3 }
```

### 6.4 Template Literals and Tagged Templates

```javascript
// Basic template literals
const name = 'John';
const greeting = `Hello, ${name}!`;

// Multi-line strings
const html = `
    <div>
        <h1>${name}</h1>
    </div>
`;

// Expressions
const a = 5, b = 10;
console.log(`Sum: ${a + b}`); // 'Sum: 15'

// Tagged templates
function highlight(strings, ...values) {
    return strings.reduce((result, str, i) => {
        return `${result}${str}<mark>${values[i] || ''}</mark>`;
    }, '');
}

const item = 'coffee';
const price = 5;
highlight`I bought ${item} for $${price}`;
// 'I bought <mark>coffee</mark> for $<mark>5</mark>'

// Common use: SQL query builders, i18n, styling
```

### 6.5 Arrow Functions

```javascript
// Syntax variations
const add = (a, b) => a + b;
const square = x => x * x;
const greet = () => 'Hello';
const multiline = (a, b) => {
    const sum = a + b;
    return sum;
};

// Returning objects (wrap in parentheses)
const makeObj = (a, b) => ({ x: a, y: b });

// Key differences from regular functions:
// 1. No own 'this' (lexical)
// 2. No 'arguments' object
// 3. Cannot be used as constructors (no 'new')
// 4. No 'prototype' property

// When NOT to use arrow functions:
// 1. Object methods (need 'this')
const obj = {
    value: 42,
    getValue: () => this.value, // WRONG: 'this' is not obj
    getValueCorrect() { return this.value; } // CORRECT
};

// 2. Event handlers (might need 'this' to be the element)
// 3. Constructors
// 4. When you need 'arguments'
```

### 6.6 Default Parameters

```javascript
function greet(name = 'Guest', greeting = 'Hello') {
    return `${greeting}, ${name}!`;
}

greet();              // 'Hello, Guest!'
greet('John');        // 'Hello, John!'
greet('John', 'Hi');  // 'Hi, John!'
greet(undefined, 'Hey'); // 'Hey, Guest!' (undefined triggers default)

// Default values are evaluated at call time
function append(value, array = []) {
    array.push(value);
    return array;
}
append(1); // [1]
append(2); // [2] (new array each time, not [1, 2])

// Can use previous parameters
function createUser(name, id = name.toLowerCase()) {
    return { name, id };
}
createUser('John'); // { name: 'John', id: 'john' }

// Can use function calls
function getDefault() {
    console.log('Computing default...');
    return 42;
}
function example(value = getDefault()) {
    return value;
}
example(10); // 10 (getDefault not called)
example();   // 'Computing default...' then 42
```

### 6.7 Optional Chaining (`?.`)

```javascript
const user = {
    name: 'John',
    address: {
        city: 'NYC'
    }
};

// Without optional chaining
const zip = user.address && user.address.zip; // undefined

// With optional chaining
const zip2 = user.address?.zip; // undefined (no error)
const country = user.address?.country?.code; // undefined

// With arrays
const users = [{ name: 'John' }];
users[0]?.name; // 'John'
users[5]?.name; // undefined (no error)

// With function calls
const obj = {
    greet() { return 'Hello'; }
};
obj.greet?.(); // 'Hello'
obj.goodbye?.(); // undefined (not called, no error)

// With bracket notation
const prop = 'name';
user?.[prop]; // 'John'
```

### 6.8 Nullish Coalescing (`??`) vs OR (`||`)

```javascript
// || returns first truthy value (or last value)
0 || 'default';      // 'default' (0 is falsy)
'' || 'default';     // 'default' ('' is falsy)
false || 'default';  // 'default'
null || 'default';   // 'default'

// ?? returns first defined value (not null/undefined)
0 ?? 'default';      // 0 (0 is defined!)
'' ?? 'default';     // '' ('' is defined!)
false ?? 'default';  // false
null ?? 'default';   // 'default'
undefined ?? 'default'; // 'default'

// Use case: Preserving 0 or empty string
function getPort(config) {
    return config.port ?? 3000; // 0 is valid port
}
getPort({ port: 0 }); // 0 (not 3000)

function getMessage(input) {
    return input ?? 'No message'; // '' is valid message
}
getMessage(''); // '' (not 'No message')
```

### 6.9 Logical Assignment Operators (ES2021)

```javascript
// ||= (OR assignment)
let a = null;
a ||= 'default'; // a = 'default'

let b = 'existing';
b ||= 'default'; // b = 'existing' (already truthy)

// ??= (Nullish assignment)
let c = 0;
c ??= 10; // c = 0 (0 is not null/undefined)

let d = null;
d ??= 10; // d = 10

// &&= (AND assignment)
let e = 'value';
e &&= 'new value'; // e = 'new value' (was truthy, so assign)

let f = null;
f &&= 'new value'; // f = null (was falsy, skip assignment)

// Practical use cases
const config = {};
config.debug ??= false;     // Set default if not defined
config.verbose ||= true;    // Set if falsy
user.data &&= sanitize(user.data); // Only sanitize if exists
```

### 6.10 for...of vs for...in

```javascript
const arr = ['a', 'b', 'c'];

// for...of: Iterates over VALUES (iterables: arrays, strings, maps, sets)
for (const value of arr) {
    console.log(value); // 'a', 'b', 'c'
}

// for...in: Iterates over KEYS (enumerable properties)
for (const index in arr) {
    console.log(index); // '0', '1', '2' (strings!)
}

// for...in on objects
const obj = { a: 1, b: 2, c: 3 };
for (const key in obj) {
    console.log(key, obj[key]); // 'a' 1, 'b' 2, 'c' 3
}

// CAUTION: for...in includes inherited properties
Array.prototype.customMethod = function() {};
const arr2 = [1, 2, 3];
for (const key in arr2) {
    console.log(key); // '0', '1', '2', 'customMethod' (!!)
}

// Fix: Use hasOwnProperty
for (const key in arr2) {
    if (arr2.hasOwnProperty(key)) {
        console.log(key); // '0', '1', '2'
    }
}

// Best practice: Use for...of for arrays, Object.keys/entries for objects
```

### 6.11 Map, Set, WeakMap, WeakSet

```javascript
// MAP: Key-value pairs where keys can be ANY type
const map = new Map();

map.set('string', 'value1');
map.set(42, 'value2');
map.set({ key: 'obj' }, 'value3');

map.get('string'); // 'value1'
map.has(42);       // true
map.size;          // 3
map.delete(42);

// Initialize from array
const map2 = new Map([
    ['a', 1],
    ['b', 2]
]);

// Iteration
for (const [key, value] of map2) {
    console.log(key, value);
}
map2.forEach((value, key) => console.log(key, value));

// SET: Unique values only
const set = new Set([1, 2, 2, 3, 3, 3]);
console.log([...set]); // [1, 2, 3]

set.add(4);
set.has(2);    // true
set.delete(2);
set.size;      // 3

// Common use: Remove duplicates
const unique = [...new Set([1, 1, 2, 2, 3])]; // [1, 2, 3]

// WEAKMAP: Keys must be objects, garbage collected when no other refs
const weakMap = new WeakMap();
let obj = { data: 'value' };
weakMap.set(obj, 'metadata');
obj = null; // Object can now be garbage collected

// Use case: Private data, caching DOM nodes
const privateData = new WeakMap();
class User {
    constructor(name) {
        privateData.set(this, { name });
    }
    getName() {
        return privateData.get(this).name;
    }
}

// WEAKSET: Objects only, garbage collected
const weakSet = new WeakSet();
let obj2 = { id: 1 };
weakSet.add(obj2);
weakSet.has(obj2); // true
obj2 = null; // Can be garbage collected
```

### 6.12 Generators and Iterators

```javascript
// Generator function (function*)
function* numberGenerator() {
    yield 1;
    yield 2;
    yield 3;
}

const gen = numberGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// Generators are iterable
for (const num of numberGenerator()) {
    console.log(num); // 1, 2, 3
}

// Infinite generator
function* infiniteSequence() {
    let i = 0;
    while (true) {
        yield i++;
    }
}

// Two-way communication
function* twoWay() {
    const x = yield 'First';
    const y = yield x + 10;
    return x + y;
}

const gen2 = twoWay();
console.log(gen2.next());    // { value: 'First', done: false }
console.log(gen2.next(5));   // { value: 15, done: false } (x = 5)
console.log(gen2.next(20));  // { value: 25, done: true } (y = 20, return 5 + 20)

// Custom iterator
const range = {
    from: 1,
    to: 5,
    [Symbol.iterator]() {
        let current = this.from;
        const last = this.to;
        return {
            next() {
                if (current <= last) {
                    return { value: current++, done: false };
                }
                return { done: true };
            }
        };
    }
};

for (const num of range) {
    console.log(num); // 1, 2, 3, 4, 5
}
```

### 6.13 Proxy and Reflect

```javascript
// Proxy: Intercept and customize object operations
const target = { name: 'John', age: 30 };

const handler = {
    get(target, prop) {
        console.log(`Getting ${prop}`);
        return prop in target ? target[prop] : 'Not found';
    },
    set(target, prop, value) {
        console.log(`Setting ${prop} to ${value}`);
        if (prop === 'age' && typeof value !== 'number') {
            throw new TypeError('Age must be a number');
        }
        target[prop] = value;
        return true;
    }
};

const proxy = new Proxy(target, handler);
proxy.name;        // 'Getting name' → 'John'
proxy.unknown;     // 'Getting unknown' → 'Not found'
proxy.age = 31;    // 'Setting age to 31'
// proxy.age = 'old'; // TypeError

// Practical use cases:

// 1. Validation
const validator = {
    set(obj, prop, value) {
        if (prop === 'age') {
            if (!Number.isInteger(value) || value < 0) {
                throw new TypeError('Age must be a positive integer');
            }
        }
        obj[prop] = value;
        return true;
    }
};

// 2. Default values
const withDefaults = new Proxy({}, {
    get(target, prop) {
        return prop in target ? target[prop] : 0;
    }
});

// 3. Negative array indices
const createArray = (arr) => new Proxy(arr, {
    get(target, prop) {
        const index = Number(prop);
        if (index < 0) {
            return target[target.length + index];
        }
        return target[prop];
    }
});

const arr = createArray([1, 2, 3, 4, 5]);
arr[-1]; // 5
arr[-2]; // 4

// Reflect: Provides methods for interceptable operations
Reflect.get(target, 'name');      // 'John'
Reflect.set(target, 'age', 25);   // true
Reflect.has(target, 'name');      // true
Reflect.deleteProperty(target, 'age');
Reflect.ownKeys(target);          // ['name']
```

---

# PART B: ASYNCHRONOUS JAVASCRIPT (CRITICAL)

---

## Section 7: Event Loop Deep Dive

### 7.1 JavaScript Runtime Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         JAVASCRIPT ENGINE                            │
│  ┌────────────────────────┐   ┌────────────────────────────────────┐│
│  │      MEMORY HEAP       │   │           CALL STACK               ││
│  │                        │   │                                    ││
│  │  Objects, Functions,   │   │   Tracks function execution        ││
│  │  Variables stored here │   │   LIFO (Last In, First Out)        ││
│  └────────────────────────┘   └────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ Hands off async operations
                                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           WEB APIs                                   │
│    (Provided by Browser, NOT JavaScript)                            │
│    • setTimeout / setInterval                                        │
│    • fetch / XMLHttpRequest                                          │
│    • DOM Events (click, scroll, etc.)                               │
│    • localStorage / sessionStorage                                   │
│    • Geolocation, Canvas, WebSockets, etc.                          │
└─────────────────────────────────────────────────────────────────────┘
                                        │
                    When async operation completes, callback goes to:
                                        │
         ┌──────────────────────────────┴────────────────────────────┐
         │                                                            │
         ▼                                                            ▼
┌─────────────────────────────┐              ┌─────────────────────────────┐
│    MACROTASK QUEUE          │              │     MICROTASK QUEUE         │
│    (Callback/Task Queue)    │              │     (Job Queue)             │
│                             │              │                             │
│  • setTimeout callbacks     │              │  • Promise .then/.catch     │
│  • setInterval callbacks    │              │  • queueMicrotask()         │
│  • setImmediate (Node)      │              │  • MutationObserver         │
│  • I/O operations           │              │  • async/await continuation │
│  • UI rendering events      │              │                             │
│  • requestAnimationFrame    │              │  HIGHER PRIORITY!           │
└─────────────────────────────┘              └─────────────────────────────┘
         │                                                            │
         └──────────────────────────┬─────────────────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     EVENT LOOP      │
                         │                     │
                         │  Continuously checks│
                         │  if Call Stack is   │
                         │  empty, then moves  │
                         │  tasks to stack     │
                         └─────────────────────┘
```

### 7.2 Event Loop Algorithm

```javascript
// Event Loop Pseudocode:
while (true) {
    // 1. Execute all SYNCHRONOUS code in Call Stack
    executeCallStack();
    
    // 2. When Call Stack is EMPTY:
    
    // 3. Execute ALL microtasks (until microtask queue is empty)
    while (microtaskQueue.length > 0) {
        const microtask = microtaskQueue.shift();
        executeTask(microtask);
        // Note: New microtasks added during execution are also processed!
    }
    
    // 4. Render/Paint if needed (requestAnimationFrame callbacks)
    if (needsRender) {
        executeAnimationFrameCallbacks();
        render();
    }
    
    // 5. Execute ONE macrotask (if any)
    if (macrotaskQueue.length > 0) {
        const macrotask = macrotaskQueue.shift();
        executeTask(macrotask);
    }
    
    // 6. Go back to step 1
}
```

### 7.3 Execution Order: The Key Rule

```
SYNC CODE → ALL MICROTASKS → ONE MACROTASK → ALL MICROTASKS → ONE MACROTASK → ...
```

```javascript
console.log('1: Sync Start');

setTimeout(() => {
    console.log('2: setTimeout (Macrotask)');
}, 0);

Promise.resolve().then(() => {
    console.log('3: Promise (Microtask)');
});

console.log('4: Sync End');

// Output:
// 1: Sync Start
// 4: Sync End
// 3: Promise (Microtask)
// 2: setTimeout (Macrotask)

// Explanation:
// 1. Sync: console.log('1'), setTimeout (schedules macro), Promise (schedules micro), console.log('4')
// 2. Call stack empty → Process ALL microtasks → console.log('3')
// 3. Microtask queue empty → Process ONE macrotask → console.log('2')
```

### 7.4 Output Prediction Questions (10+ Questions)

#### Question 1: Basic Order
```javascript
console.log('A');

setTimeout(() => console.log('B'), 0);

Promise.resolve().then(() => console.log('C'));

console.log('D');

// Output: A, D, C, B
// Sync (A, D) → Microtask (C) → Macrotask (B)
```

#### Question 2: Nested Promises
```javascript
console.log('1');

setTimeout(() => {
    console.log('2');
    Promise.resolve().then(() => console.log('3'));
}, 0);

Promise.resolve().then(() => {
    console.log('4');
    setTimeout(() => console.log('5'), 0);
});

console.log('6');

// Output: 1, 6, 4, 2, 3, 5

// Explanation:
// Sync: 1, 6
// Microtask: 4 (schedules macrotask 5)
// Macrotask: 2 (schedules microtask 3)
// Microtask: 3
// Macrotask: 5
```

#### Question 3: Multiple Microtasks
```javascript
Promise.resolve().then(() => console.log('1'));
Promise.resolve().then(() => console.log('2'));
setTimeout(() => console.log('3'), 0);
Promise.resolve().then(() => console.log('4'));

// Output: 1, 2, 4, 3
// All microtasks (1, 2, 4) before any macrotask (3)
```

#### Question 4: Microtask Creating Microtask
```javascript
Promise.resolve().then(() => {
    console.log('1');
    Promise.resolve().then(() => console.log('2'));
});

Promise.resolve().then(() => console.log('3'));

setTimeout(() => console.log('4'), 0);

// Output: 1, 3, 2, 4

// Explanation:
// Microtasks are processed until queue is EMPTY
// 1 runs, schedules 2
// 3 runs
// 2 runs (added during microtask phase, still processed)
// Then macrotask 4
```

#### Question 5: async/await Order
```javascript
async function foo() {
    console.log('1');
    await Promise.resolve();
    console.log('2');
}

console.log('3');
foo();
console.log('4');

// Output: 3, 1, 4, 2

// Explanation:
// console.log('3') - sync
// foo() called - console.log('1') - sync
// await pauses foo, rest of foo becomes microtask
// console.log('4') - sync
// Microtask: console.log('2')
```

#### Question 6: async/await with setTimeout
```javascript
async function async1() {
    console.log('async1 start');
    await async2();
    console.log('async1 end');
}

async function async2() {
    console.log('async2');
}

console.log('script start');

setTimeout(() => {
    console.log('setTimeout');
}, 0);

async1();

new Promise((resolve) => {
    console.log('promise1');
    resolve();
}).then(() => {
    console.log('promise2');
});

console.log('script end');

// Output:
// script start
// async1 start
// async2
// promise1
// script end
// async1 end
// promise2
// setTimeout
```

#### Question 7: Promise Constructor is Sync!
```javascript
console.log('1');

new Promise((resolve) => {
    console.log('2');
    resolve();
    console.log('3');
}).then(() => {
    console.log('4');
});

console.log('5');

// Output: 1, 2, 3, 5, 4

// Key insight: Promise constructor executor is SYNCHRONOUS
// Only .then() callback is async (microtask)
```

#### Question 8: Chained .then()
```javascript
Promise.resolve()
    .then(() => {
        console.log('1');
        return Promise.resolve();
    })
    .then(() => {
        console.log('2');
    });

Promise.resolve()
    .then(() => {
        console.log('3');
    })
    .then(() => {
        console.log('4');
    });

// Output: 1, 3, 2, 4

// Explanation:
// Microtask 1: logs '1', returns Promise (adds extra microtask tick)
// Microtask 2: logs '3'
// Microtask 3: (from returned Promise resolution)
// Microtask 4: logs '2'
// Microtask 5: logs '4'

// Actually: 1, 3, 4, 2 in some environments due to Promise resolution timing
// The key point: returning a Promise adds delay
```

#### Question 9: setTimeout vs setImmediate vs process.nextTick (Node.js)
```javascript
// Node.js only
setTimeout(() => console.log('setTimeout'), 0);
setImmediate(() => console.log('setImmediate'));
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('Promise'));

// Output (most likely):
// nextTick
// Promise
// setTimeout OR setImmediate (order varies)
// setImmediate OR setTimeout

// Priority in Node.js:
// process.nextTick > Promise > setTimeout/setImmediate
```

#### Question 10: queueMicrotask
```javascript
console.log('1');

queueMicrotask(() => {
    console.log('2');
});

Promise.resolve().then(() => console.log('3'));

setTimeout(() => console.log('4'), 0);

queueMicrotask(() => {
    console.log('5');
});

console.log('6');

// Output: 1, 6, 2, 3, 5, 4
// queueMicrotask and Promise.then are both microtasks, processed in order
```

#### Question 11: requestAnimationFrame
```javascript
console.log('1');

requestAnimationFrame(() => {
    console.log('2: rAF');
});

setTimeout(() => {
    console.log('3: setTimeout');
}, 0);

Promise.resolve().then(() => {
    console.log('4: Promise');
});

console.log('5');

// Output: 1, 5, 4, 3, 2 OR 1, 5, 4, 2, 3
// rAF runs before next paint, timing varies relative to setTimeout
// Microtasks (Promise) always before macrotasks (setTimeout, rAF)
```

### 7.5 Common Misconceptions

```javascript
// Misconception 1: setTimeout(fn, 0) runs immediately
// Reality: It runs after sync code AND all microtasks

// Misconception 2: Promises are async
// Reality: Only .then/.catch/.finally callbacks are async
//          Promise constructor is SYNCHRONOUS

new Promise((resolve) => {
    console.log('Sync!'); // This runs immediately
    resolve();
});

// Misconception 3: await makes everything async
// Reality: Code BEFORE await in async function is synchronous

async function demo() {
    console.log('Before await - SYNC');
    await somePromise;
    console.log('After await - ASYNC (microtask)');
}
demo();
console.log('After calling demo - SYNC');
// Output: Before await, After calling demo, After await

// Misconception 4: Microtasks wait for macrotasks
// Reality: ALL microtasks run before the NEXT macrotask
```

---

## Section 8: Promises Mastery

### 8.1 Promise States

```javascript
// A Promise has 3 states:
// 1. PENDING   - Initial state, neither fulfilled nor rejected
// 2. FULFILLED - Operation completed successfully (resolved)
// 3. REJECTED  - Operation failed

// State transitions (can only happen ONCE):
// pending → fulfilled
// pending → rejected
// fulfilled → X (cannot change)
// rejected  → X (cannot change)

const promise = new Promise((resolve, reject) => {
    // resolve() → state becomes 'fulfilled'
    // reject()  → state becomes 'rejected'
    // Can only call one, subsequent calls are ignored
    
    resolve('Success');
    reject('Error');  // Ignored - already resolved
    resolve('Again'); // Ignored - already resolved
});
```

### 8.2 Promise Constructor

```javascript
const promise = new Promise((resolve, reject) => {
    // Executor function - runs SYNCHRONOUSLY
    
    // Simulate async operation
    setTimeout(() => {
        const success = Math.random() > 0.5;
        if (success) {
            resolve('Data received'); // Fulfill with value
        } else {
            reject(new Error('Failed to fetch')); // Reject with reason
        }
    }, 1000);
});

// Consuming the promise
promise
    .then((value) => {
        console.log('Success:', value);
    })
    .catch((error) => {
        console.log('Error:', error.message);
    });
```

### 8.3 .then(), .catch(), .finally() Chaining

```javascript
// .then(onFulfilled, onRejected) - handles both cases
promise.then(
    (value) => console.log('Success:', value),
    (error) => console.log('Error:', error)
);

// .catch(onRejected) - handles only rejection (same as .then(null, onRejected))
promise.catch((error) => console.log('Error:', error));

// .finally(onFinally) - runs regardless of outcome, no arguments
promise.finally(() => console.log('Cleanup'));

// Chaining - each .then returns a NEW promise
fetch('/api/user')
    .then(response => response.json())     // Returns promise
    .then(user => fetch(`/api/posts/${user.id}`))
    .then(response => response.json())
    .then(posts => console.log(posts))
    .catch(error => console.error(error))  // Catches any error in chain
    .finally(() => console.log('Done'));

// What .then returns determines next promise's value:
Promise.resolve(1)
    .then(x => x + 1)           // Returns 2
    .then(x => { return x + 1 }) // Returns 3
    .then(x => { x + 1 })       // Returns undefined (no return!)
    .then(x => Promise.resolve(x + 1)) // Returns Promise, waits for it
    .then(console.log);         // NaN (undefined + 1)
```

### 8.4 Error Propagation

```javascript
// Errors propagate down the chain until caught
Promise.reject('Error!')
    .then(() => console.log('1')) // Skipped
    .then(() => console.log('2')) // Skipped
    .catch(err => {
        console.log('Caught:', err); // 'Caught: Error!'
        return 'Recovered';
    })
    .then(val => console.log('Continue:', val)); // 'Continue: Recovered'

// Throwing in .then also rejects
Promise.resolve()
    .then(() => {
        throw new Error('Oops');
    })
    .catch(err => console.log(err.message)); // 'Oops'

// Re-throwing errors
Promise.reject('Error')
    .catch(err => {
        console.log('Logging:', err);
        throw err; // Re-throw to propagate
    })
    .catch(err => console.log('Final handler:', err));

// IMPORTANT: Unhandled rejections
Promise.reject('Unhandled'); // Warning: UnhandledPromiseRejection

// Always add a .catch() at the end of chains!
```

### 8.5 Promise.all()

Waits for ALL promises to fulfill. **Fails fast** on first rejection.

```javascript
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(2);
const p3 = Promise.resolve(3);

Promise.all([p1, p2, p3])
    .then(values => console.log(values)); // [1, 2, 3]

// Fail-fast behavior:
const p4 = Promise.reject('Error!');

Promise.all([p1, p2, p4, p3])
    .then(values => console.log(values))    // Never called
    .catch(err => console.log('Failed:', err)); // 'Failed: Error!'

// Practical use: Parallel API calls
async function fetchAllUsers(ids) {
    const promises = ids.map(id => fetch(`/api/user/${id}`));
    const responses = await Promise.all(promises);
    return Promise.all(responses.map(r => r.json()));
}

// Non-promise values are auto-wrapped
Promise.all([1, 2, Promise.resolve(3)])
    .then(console.log); // [1, 2, 3]

// Empty array resolves immediately
Promise.all([]).then(console.log); // []
```

### 8.6 Promise.allSettled()

Waits for ALL promises to settle (fulfill or reject). **Never short-circuits**.

```javascript
const p1 = Promise.resolve('Success 1');
const p2 = Promise.reject('Error 2');
const p3 = Promise.resolve('Success 3');

Promise.allSettled([p1, p2, p3])
    .then(results => {
        console.log(results);
        // [
        //   { status: 'fulfilled', value: 'Success 1' },
        //   { status: 'rejected', reason: 'Error 2' },
        //   { status: 'fulfilled', value: 'Success 3' }
        // ]
        
        // Process results:
        results.forEach(result => {
            if (result.status === 'fulfilled') {
                console.log('Value:', result.value);
            } else {
                console.log('Error:', result.reason);
            }
        });
    });

// Use case: When you need all results regardless of failures
async function fetchMultipleAPIs(urls) {
    const promises = urls.map(url => fetch(url).then(r => r.json()));
    const results = await Promise.allSettled(promises);
    
    const successes = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);
    
    const failures = results
        .filter(r => r.status === 'rejected')
        .map(r => r.reason);
    
    return { successes, failures };
}
```

### 8.7 Promise.race()

Returns first promise to **settle** (fulfill OR reject).

```javascript
const slow = new Promise(resolve => setTimeout(() => resolve('Slow'), 2000));
const fast = new Promise(resolve => setTimeout(() => resolve('Fast'), 100));

Promise.race([slow, fast])
    .then(value => console.log(value)); // 'Fast'

// If first to settle is rejection:
const error = new Promise((_, reject) => setTimeout(() => reject('Error!'), 50));

Promise.race([slow, fast, error])
    .catch(err => console.log(err)); // 'Error!' (first to settle)

// Use case 1: Timeout wrapper
function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), ms);
    });
    return Promise.race([promise, timeout]);
}

// Use case 2: First response wins
const api1 = fetch('https://api1.example.com/data');
const api2 = fetch('https://api2.example.com/data');
Promise.race([api1, api2]).then(response => response.json());
```

### 8.8 Promise.any()

Returns first promise to **fulfill**. Only rejects if ALL reject.

```javascript
const p1 = Promise.reject('Error 1');
const p2 = new Promise(resolve => setTimeout(() => resolve('Success'), 100));
const p3 = Promise.reject('Error 3');

Promise.any([p1, p2, p3])
    .then(value => console.log(value)); // 'Success' (first fulfilled)

// All reject → AggregateError
Promise.any([
    Promise.reject('Error 1'),
    Promise.reject('Error 2'),
    Promise.reject('Error 3')
])
    .catch(err => {
        console.log(err instanceof AggregateError); // true
        console.log(err.errors); // ['Error 1', 'Error 2', 'Error 3']
    });

// Use case: Fastest successful response
async function fetchFromMirrors(urls) {
    const promises = urls.map(url => 
        fetch(url).then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
        })
    );
    return Promise.any(promises); // First successful response
}

// Comparison:
// Promise.race()  → First to SETTLE (fulfill or reject)
// Promise.any()   → First to FULFILL (ignores rejections until all fail)
```

### 8.9 Creating Resolved/Rejected Promises

```javascript
// Immediately resolved promise
const resolved = Promise.resolve('value');
const resolved2 = Promise.resolve({ data: 123 });

// Immediately rejected promise
const rejected = Promise.reject(new Error('Something went wrong'));

// Useful for:
// 1. Converting values to promises
function maybeAsync(value) {
    return Promise.resolve(value);
}

// 2. Starting a promise chain
Promise.resolve()
    .then(() => step1())
    .then(() => step2());

// 3. Returning early in async conditions
function fetchUser(id) {
    if (!id) {
        return Promise.reject(new Error('ID required'));
    }
    return fetch(`/api/user/${id}`);
}

// 4. Promise.resolve with a promise returns the same promise
const p = new Promise(resolve => resolve('test'));
Promise.resolve(p) === p; // true (same reference)
```

### 8.10 Promisifying Callbacks

```javascript
// Convert callback-based functions to promises

// Node.js callback style: (err, result) => {}
function readFileCallback(path, callback) {
    // Simulated
    setTimeout(() => {
        if (path) {
            callback(null, 'file contents');
        } else {
            callback(new Error('Path required'));
        }
    }, 100);
}

// Promisified version:
function readFilePromise(path) {
    return new Promise((resolve, reject) => {
        readFileCallback(path, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Usage:
readFilePromise('/path/to/file')
    .then(contents => console.log(contents))
    .catch(err => console.error(err));

// Generic promisify function:
function promisify(fn) {
    return function(...args) {
        return new Promise((resolve, reject) => {
            fn(...args, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    };
}

const readFile = promisify(readFileCallback);
readFile('/path').then(console.log);

// Node.js has built-in: util.promisify()
const util = require('util');
const fs = require('fs');
const readFileAsync = util.promisify(fs.readFile);
```

---

## Section 9: Async/Await Patterns

### 9.1 How async/await Works Under the Hood

```javascript
// async function always returns a Promise
async function example() {
    return 42;
}
example().then(console.log); // 42

// Equivalent to:
function exampleManual() {
    return Promise.resolve(42);
}

// await pauses execution until Promise settles
async function fetchData() {
    console.log('Before await');
    const result = await fetch('/api/data'); // Pauses here
    console.log('After await');
    return result;
}

// What await does:
// 1. Pauses the async function
// 2. Waits for the Promise to settle
// 3. Resumes with the fulfilled value
// 4. OR throws the rejected reason
```

### 9.2 Error Handling Patterns

```javascript
// Pattern 1: try/catch block
async function fetchUser(id) {
    try {
        const response = await fetch(`/api/user/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const user = await response.json();
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw error; // Re-throw to propagate, or return default
    }
}

// Pattern 2: .catch() on the Promise
async function fetchUserAlt(id) {
    const response = await fetch(`/api/user/${id}`)
        .catch(err => {
            console.error('Network error:', err);
            return null;
        });
    
    if (!response) return null;
    return response.json();
}

// Pattern 3: Wrapper function for cleaner code
async function to(promise) {
    try {
        const result = await promise;
        return [null, result];
    } catch (error) {
        return [error, null];
    }
}

// Usage:
async function example() {
    const [error, data] = await to(fetch('/api/data'));
    if (error) {
        console.error('Error:', error);
        return;
    }
    console.log('Data:', data);
}

// Pattern 4: Error handling at call site
async function riskyOperation() {
    throw new Error('Something went wrong');
}

riskyOperation()
    .then(result => console.log(result))
    .catch(error => console.error(error)); // Handle at call site
```

### 9.3 Parallel vs Sequential Execution

```javascript
// SEQUENTIAL: One after another (SLOW!)
async function sequential() {
    const user = await fetchUser(1);     // Wait...
    const posts = await fetchPosts(1);   // Then wait...
    const comments = await fetchComments(1); // Then wait...
    return { user, posts, comments };
}
// Total time: fetchUser + fetchPosts + fetchComments

// PARALLEL: All at once (FAST!)
async function parallel() {
    const [user, posts, comments] = await Promise.all([
        fetchUser(1),
        fetchPosts(1),
        fetchComments(1)
    ]);
    return { user, posts, comments };
}
// Total time: max(fetchUser, fetchPosts, fetchComments)

// PARALLEL with independent error handling:
async function parallelSafe() {
    const [userResult, postsResult, commentsResult] = await Promise.allSettled([
        fetchUser(1),
        fetchPosts(1),
        fetchComments(1)
    ]);
    
    return {
        user: userResult.status === 'fulfilled' ? userResult.value : null,
        posts: postsResult.status === 'fulfilled' ? postsResult.value : null,
        comments: commentsResult.status === 'fulfilled' ? commentsResult.value : null
    };
}

// Start parallel, await later:
async function parallelStartLater() {
    // Start all immediately (don't await yet)
    const userPromise = fetchUser(1);
    const postsPromise = fetchPosts(1);
    
    // Do other stuff...
    console.log('Fetching in background...');
    
    // Now wait for results
    const user = await userPromise;
    const posts = await postsPromise;
    
    return { user, posts };
}
```

### 9.4 Common Mistakes

```javascript
// Mistake 1: await in forEach (doesn't wait!)
async function processItems(items) {
    items.forEach(async (item) => {
        await processItem(item); // This doesn't wait!
    });
    console.log('Done'); // Logs before processing finishes!
}

// Fix: Use for...of for sequential
async function processItemsSequential(items) {
    for (const item of items) {
        await processItem(item);
    }
    console.log('Done'); // Actually done
}

// Fix: Use Promise.all for parallel
async function processItemsParallel(items) {
    await Promise.all(items.map(item => processItem(item)));
    console.log('Done');
}

// Mistake 2: Forgetting await
async function fetchData() {
    const response = fetch('/api/data'); // Missing await!
    console.log(response); // Promise object, not data!
}

// Mistake 3: Unnecessary await
async function getUser() {
    return await fetchUser(); // Unnecessary await
}
// Better:
async function getUser() {
    return fetchUser(); // Just return the promise
}

// Mistake 4: await outside async function
function example() {
    const data = await fetch('/api'); // SyntaxError!
}
// Fix: Make function async, or use .then()

// Mistake 5: try/catch not catching all errors
async function example() {
    try {
        const p1 = fetch('/api/1');
        const p2 = fetch('/api/2');
        // If p1 rejects while p2 is being created, error escapes!
        const [r1, r2] = await Promise.all([p1, p2]);
    } catch (e) {
        // Might not catch all errors
    }
}
// Better: Create promises inside Promise.all
async function exampleFixed() {
    try {
        const [r1, r2] = await Promise.all([
            fetch('/api/1'),
            fetch('/api/2')
        ]);
    } catch (e) {
        // Now catches all errors
    }
}
```

### 9.5 Top-Level Await (ES2022)

```javascript
// In ES modules (.mjs or type="module"), you can use await at top level

// Before: Had to wrap in async IIFE
(async () => {
    const data = await fetch('/api/data');
    console.log(await data.json());
})();

// Now: Direct top-level await
const response = await fetch('/api/config');
const config = await response.json();
export { config };

// Use cases:
// 1. Dynamic imports
const module = await import(`./locale/${language}.js`);

// 2. Database connection
const db = await connectToDatabase();
export { db };

// 3. Feature detection
const hasFeature = await checkFeature();
const impl = hasFeature ? await import('./fast.js') : await import('./fallback.js');
```

### 9.6 Async Iterators and for-await-of

```javascript
// Async generator
async function* asyncGenerator() {
    yield await Promise.resolve(1);
    yield await Promise.resolve(2);
    yield await Promise.resolve(3);
}

// for-await-of loop
async function example() {
    for await (const value of asyncGenerator()) {
        console.log(value); // 1, 2, 3
    }
}

// Practical use: Paginated API
async function* fetchAllPages(baseUrl) {
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
        const response = await fetch(`${baseUrl}?page=${page}`);
        const data = await response.json();
        
        yield data.items;
        
        hasMore = data.hasMore;
        page++;
    }
}

async function processAllData() {
    for await (const items of fetchAllPages('/api/items')) {
        for (const item of items) {
            console.log(item);
        }
    }
}

// Async iterable from array of promises
async function processPromises(promises) {
    for await (const result of promises) {
        console.log(result);
    }
}

const promises = [
    fetch('/api/1').then(r => r.json()),
    fetch('/api/2').then(r => r.json()),
    fetch('/api/3').then(r => r.json())
];
processPromises(promises); // Processes as each resolves
```

### 9.7 Practical Async Patterns

```javascript
// Pattern 1: Retry with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            const delay = baseDelay * Math.pow(2, i);
            console.log(`Retry ${i + 1} after ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Usage:
const data = await retryWithBackoff(() => fetch('/api/unstable'));

// Pattern 2: Timeout wrapper
function withTimeout(promise, ms, errorMessage = 'Timeout') {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(errorMessage)), ms);
    });
    return Promise.race([promise, timeout]);
}

// Usage:
try {
    const data = await withTimeout(fetch('/api/slow'), 5000, 'Request timed out');
} catch (e) {
    if (e.message === 'Request timed out') {
        console.log('Operation took too long');
    }
}

// Pattern 4: Sequential promise execution
async function sequential(promiseFns) {
    const results = [];
    for (const fn of promiseFns) {
        results.push(await fn());
    }
    return results;
}

// Usage:
const tasks = [
    () => fetch('/api/1'),
    () => fetch('/api/2'),
    () => fetch('/api/3')
];
const results = await sequential(tasks);
```

---

# PART C: IMPLEMENTATIONS (INTERVIEW FAVORITES)

This section contains **must-know implementations** frequently asked in interviews. Practice writing these from scratch.

---

## Section 10: Must-Know Polyfills

### 10.1 Function.prototype.bind()

```javascript
// bind() creates a new function with 'this' bound to provided value

Function.prototype.myBind = function(context, ...boundArgs) {
    const fn = this; // The function being bound
    
    return function(...args) {
        return fn.apply(context, [...boundArgs, ...args]);
    };
};

// Test:
function greet(greeting, punctuation) {
    return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: 'John' };
const boundGreet = greet.myBind(person, 'Hello');
console.log(boundGreet('!')); // 'Hello, John!'
```

### 10.2 Function.prototype.call()

```javascript
// call() invokes function with specified 'this' and individual arguments

Function.prototype.myCall = function(context, ...args) {
    // Handle null/undefined context
    context = context ?? globalThis;
    
    // Convert primitives to objects
    if (typeof context !== 'object') {
        context = Object(context);
    }
    
    // Create unique property to avoid collisions
    const fnKey = Symbol('fn');
    
    // Attach function to context
    context[fnKey] = this;
    
    // Call the function
    const result = context[fnKey](...args);
    
    // Clean up
    delete context[fnKey];
    
    return result;
};

// Test:
function introduce(age, city) {
    return `I'm ${this.name}, ${age} years old from ${city}`;
}

const person = { name: 'John' };
console.log(introduce.myCall(person, 30, 'NYC')); // "I'm John, 30 years old from NYC"
```

### 10.3 Function.prototype.apply()

```javascript
// apply() is same as call() but takes arguments as array

Function.prototype.myApply = function(context, args = []) {
    context = context ?? globalThis;
    
    if (typeof context !== 'object') {
        context = Object(context);
    }
    
    const fnKey = Symbol('fn');
    context[fnKey] = this;
    
    const result = context[fnKey](...args);
    
    delete context[fnKey];
    
    return result;
};

// Test:
const numbers = [5, 6, 2, 3, 7];
console.log(Math.max.myApply(null, numbers)); // 7
```

### 10.4 Array.prototype.map()

```javascript
Array.prototype.myMap = function(callback, thisArg) {
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }
    
    const result = [];
    
    for (let i = 0; i < this.length; i++) {
        // Check if index exists (handles sparse arrays)
        if (i in this) {
            result[i] = callback.call(thisArg, this[i], i, this);
        }
    }
    
    return result;
};

// Test:
const nums = [1, 2, 3];
console.log(nums.myMap(x => x * 2)); // [2, 4, 6]

// With thisArg:
const multiplier = { factor: 3 };
console.log(nums.myMap(function(x) {
    return x * this.factor;
}, multiplier)); // [3, 6, 9]
```

### 10.5 Array.prototype.filter()

```javascript
Array.prototype.myFilter = function(callback, thisArg) {
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }
    
    const result = [];
    
    for (let i = 0; i < this.length; i++) {
        if (i in this) {
            if (callback.call(thisArg, this[i], i, this)) {
                result.push(this[i]);
            }
        }
    }
    
    return result;
};

// Test:
const nums = [1, 2, 3, 4, 5];
console.log(nums.myFilter(x => x % 2 === 0)); // [2, 4]
```

### 10.6 Array.prototype.reduce()

```javascript
Array.prototype.myReduce = function(callback, initialValue) {
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }
    
    const hasInitialValue = arguments.length >= 2;
    
    if (this.length === 0 && !hasInitialValue) {
        throw new TypeError('Reduce of empty array with no initial value');
    }
    
    let accumulator = hasInitialValue ? initialValue : this[0];
    let startIndex = hasInitialValue ? 0 : 1;
    
    for (let i = startIndex; i < this.length; i++) {
        if (i in this) {
            accumulator = callback(accumulator, this[i], i, this);
        }
    }
    
    return accumulator;
};

// Test:
const nums = [1, 2, 3, 4];
console.log(nums.myReduce((acc, curr) => acc + curr, 0)); // 10
console.log(nums.myReduce((acc, curr) => acc + curr));    // 10 (no initial value)

// Edge case: empty array
try {
    [].myReduce((a, b) => a + b); // Throws TypeError
} catch (e) {
    console.log(e.message);
}
```

### 10.7 Array.prototype.flat()

```javascript
// Recursive implementation
Array.prototype.myFlat = function(depth = 1) {
    const result = [];
    
    const flatten = (arr, d) => {
        for (const item of arr) {
            if (Array.isArray(item) && d > 0) {
                flatten(item, d - 1);
            } else {
                result.push(item);
            }
        }
    };
    
    flatten(this, depth);
    return result;
};

// Test:
const nested = [1, [2, [3, [4]]]];
console.log(nested.myFlat());      // [1, 2, [3, [4]]]
console.log(nested.myFlat(2));     // [1, 2, 3, [4]]
console.log(nested.myFlat(Infinity)); // [1, 2, 3, 4]
```

### 10.8 Array.prototype.flatMap()

```javascript
Array.prototype.myFlatMap = function(callback, thisArg) {
    return this.myMap(callback, thisArg).myFlat(1);
};

// More efficient single-pass implementation
Array.prototype.myFlatMapOptimized = function(callback, thisArg) {
    const result = [];
    
    for (let i = 0; i < this.length; i++) {
        if (i in this) {
            const mapped = callback.call(thisArg, this[i], i, this);
            if (Array.isArray(mapped)) {
                result.push(...mapped);
            } else {
                result.push(mapped);
            }
        }
    }
    
    return result;
};

// Test:
const arr = [1, 2, 3];
console.log(arr.myFlatMap(x => [x, x * 2])); // [1, 2, 2, 4, 3, 6]
console.log(arr.myFlatMap(x => x * 2));      // [2, 4, 6]
```

### 10.9 Object.assign()

```javascript
Object.myAssign = function(target, ...sources) {
    if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }
    
    const to = Object(target);
    
    for (const source of sources) {
        if (source != null) {
            // Get own enumerable properties (including Symbols)
            const keys = [
                ...Object.keys(source),
                ...Object.getOwnPropertySymbols(source).filter(
                    sym => Object.propertyIsEnumerable.call(source, sym)
                )
            ];
            
            for (const key of keys) {
                to[key] = source[key];
            }
        }
    }
    
    return to;
};

// Test:
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };
console.log(Object.myAssign(target, source1, source2)); // { a: 1, b: 2, c: 3 }
```

### 10.10 Object.create()

```javascript
Object.myCreate = function(proto, propertiesObject) {
    if (proto !== null && typeof proto !== 'object') {
        throw new TypeError('Object prototype may only be an Object or null');
    }
    
    // Create empty constructor
    function F() {}
    F.prototype = proto;
    
    const obj = new F();
    
    // Add properties if provided
    if (propertiesObject !== undefined) {
        Object.defineProperties(obj, propertiesObject);
    }
    
    // Handle null prototype
    if (proto === null) {
        obj.__proto__ = null;
    }
    
    return obj;
};

// Test:
const parent = { greet() { return 'Hello'; } };
const child = Object.myCreate(parent);
console.log(child.greet()); // 'Hello'

const nullProto = Object.myCreate(null);
console.log(nullProto.toString); // undefined (no prototype)
```

### 10.11 Array.from()

```javascript
Array.myFrom = function(arrayLike, mapFn, thisArg) {
    if (arrayLike == null) {
        throw new TypeError('Cannot convert undefined or null to object');
    }
    
    const result = [];
    const hasMapFn = typeof mapFn === 'function';
    
    // Handle iterables
    if (arrayLike[Symbol.iterator]) {
        let i = 0;
        for (const item of arrayLike) {
            result.push(hasMapFn ? mapFn.call(thisArg, item, i) : item);
            i++;
        }
    } else {
        // Handle array-like objects
        const len = arrayLike.length >>> 0;
        for (let i = 0; i < len; i++) {
            const item = arrayLike[i];
            result.push(hasMapFn ? mapFn.call(thisArg, item, i) : item);
        }
    }
    
    return result;
};

// Test:
console.log(Array.myFrom('hello')); // ['h', 'e', 'l', 'l', 'o']
console.log(Array.myFrom([1, 2, 3], x => x * 2)); // [2, 4, 6]
console.log(Array.myFrom({ length: 3 }, (_, i) => i)); // [0, 1, 2]
```

### 10.12 instanceof Operator

```javascript
function myInstanceOf(obj, Constructor) {
    if (obj === null || typeof obj !== 'object') {
        return false;
    }
    
    let proto = Object.getPrototypeOf(obj);
    
    while (proto !== null) {
        if (proto === Constructor.prototype) {
            return true;
        }
        proto = Object.getPrototypeOf(proto);
    }
    
    return false;
}

// Test:
class Animal {}
class Dog extends Animal {}

const dog = new Dog();
console.log(myInstanceOf(dog, Dog));    // true
console.log(myInstanceOf(dog, Animal)); // true
console.log(myInstanceOf(dog, Object)); // true
console.log(myInstanceOf(dog, Array));  // false
console.log(myInstanceOf([], Array));   // true
```

---

## Section 11: Utility Functions

### 11.1 Debounce

```javascript
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Test:
const debouncedSearch = debounce((query) => {
    console.log('Searching for:', query);
}, 300);

// Typing quickly...
debouncedSearch('h');
debouncedSearch('he');
debouncedSearch('hel');
debouncedSearch('hell');
debouncedSearch('hello');
// Only logs "Searching for: hello" after 300ms
```

### 11.2 Throttle

```javascript
function throttle(func, delay) {
    let lastCall = 0;
    let timeoutId = null;
    
    return function(...args) {
        const now = Date.now();
        const timeSinceLastCall = now - lastCall;
        
        if (timeSinceLastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                lastCall = Date.now();
                func.apply(this, args);
            }, delay - timeSinceLastCall);
        }
    };
}

// Test:
const throttledScroll = throttle(() => {
    console.log('Scroll event at:', Date.now());
}, 1000);

// Rapid scroll events...
// Only logs at most once per second
```

### 11.3 Deep Clone

```javascript
function deepClone(obj, hash = new WeakMap()) {
    // Handle primitives and null
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    // Handle circular references
    if (hash.has(obj)) {
        return hash.get(obj);
    }
    
    // Handle Date
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    // Handle RegExp
    if (obj instanceof RegExp) {
        return new RegExp(obj.source, obj.flags);
    }
    
    // Handle Map
    if (obj instanceof Map) {
        const clone = new Map();
        hash.set(obj, clone);
        obj.forEach((value, key) => {
            clone.set(deepClone(key, hash), deepClone(value, hash));
        });
        return clone;
    }
    
    // Handle Set
    if (obj instanceof Set) {
        const clone = new Set();
        hash.set(obj, clone);
        obj.forEach(value => {
            clone.add(deepClone(value, hash));
        });
        return clone;
    }
    
    // Handle Array
    if (Array.isArray(obj)) {
        const clone = [];
        hash.set(obj, clone);
        obj.forEach((item, index) => {
            clone[index] = deepClone(item, hash);
        });
        return clone;
    }
    
    // Handle Object
    const clone = Object.create(Object.getPrototypeOf(obj));
    hash.set(obj, clone);
    
    // Clone own properties (including Symbols)
    const keys = [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)];
    for (const key of keys) {
        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        if (descriptor.value !== undefined) {
            descriptor.value = deepClone(descriptor.value, hash);
        }
        Object.defineProperty(clone, key, descriptor);
    }
    
    return clone;
}

// Test:
const original = {
    name: 'John',
    date: new Date(),
    regex: /test/gi,
    nested: { a: 1, b: [2, 3] },
    map: new Map([['key', 'value']]),
    set: new Set([1, 2, 3])
};
original.circular = original; // Circular reference

const cloned = deepClone(original);
console.log(cloned.nested === original.nested); // false (different reference)
console.log(cloned.circular === cloned);        // true (circular preserved)
```

### 11.4 Deep Equal

```javascript
function deepEqual(a, b) {
    // Strict equality (handles primitives, same reference)
    if (a === b) return true;
    
    // Handle null/undefined
    if (a === null || b === null) return a === b;
    if (a === undefined || b === undefined) return a === b;
    
    // Handle NaN
    if (Number.isNaN(a) && Number.isNaN(b)) return true;
    
    // Must both be objects
    if (typeof a !== 'object' || typeof b !== 'object') return false;
    
    // Handle Date
    if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime();
    }
    
    // Handle RegExp
    if (a instanceof RegExp && b instanceof RegExp) {
        return a.source === b.source && a.flags === b.flags;
    }
    
    // Handle Array
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    
    // Handle Map
    if (a instanceof Map && b instanceof Map) {
        if (a.size !== b.size) return false;
        for (const [key, value] of a) {
            if (!b.has(key) || !deepEqual(value, b.get(key))) {
                return false;
            }
        }
        return true;
    }
    
    // Handle Set
    if (a instanceof Set && b instanceof Set) {
        if (a.size !== b.size) return false;
        for (const value of a) {
            if (!b.has(value)) return false;
        }
        return true;
    }
    
    // Compare object keys
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    
    if (keysA.length !== keysB.length) return false;
    
    for (const key of keysA) {
        if (!keysB.includes(key)) return false;
        if (!deepEqual(a[key], b[key])) return false;
    }
    
    return true;
}

// Test:
console.log(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true
console.log(deepEqual([1, [2, 3]], [1, [2, 3]])); // true
console.log(deepEqual(new Date('2024-01-01'), new Date('2024-01-01'))); // true
console.log(deepEqual(NaN, NaN)); // true
```

### 11.5 Memoization

```javascript
// Basic memoization
function memoize(fn) {
    const cache = new Map();
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (cache.has(key)) {
            return cache.get(key);
        }
        
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Memoization with custom key function and cache limit
function memoizeAdvanced(fn, {
    getKey = (...args) => JSON.stringify(args),
    maxSize = Infinity
} = {}) {
    const cache = new Map();
    
    function memoized(...args) {
        const key = getKey(...args);
        
        if (cache.has(key)) {
            // Move to end (most recently used)
            const value = cache.get(key);
            cache.delete(key);
            cache.set(key, value);
            return value;
        }
        
        const result = fn.apply(this, args);
        
        // Evict oldest if at capacity
        if (cache.size >= maxSize) {
            const oldestKey = cache.keys().next().value;
            cache.delete(oldestKey);
        }
        
        cache.set(key, result);
        return result;
    }
    
    memoized.cache = cache;
    memoized.clear = () => cache.clear();
    
    return memoized;
}

// Test:
const expensiveFn = (n) => {
    console.log('Computing...');
    return n * 2;
};

const memoizedFn = memoize(expensiveFn);
console.log(memoizedFn(5)); // Computing... 10
console.log(memoizedFn(5)); // 10 (from cache, no "Computing...")
console.log(memoizedFn(10)); // Computing... 20
```

### 11.6 Curry

```javascript
// Simple curry for known arity
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function(...moreArgs) {
                return curried.apply(this, [...args, ...moreArgs]);
            };
        }
    };
}

// Infinite curry (for unknown arity)
function infiniteCurry(fn) {
    return function curried(...args) {
        return function(...moreArgs) {
            if (moreArgs.length === 0) {
                return fn.apply(this, args);
            }
            return curried.apply(this, [...args, ...moreArgs]);
        };
    };
}

// Test:
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
console.log(curriedAdd(1, 2, 3)); // 6

// Infinite curry test:
const sum = infiniteCurry((...nums) => nums.reduce((a, b) => a + b, 0));
console.log(sum(1)(2)(3)(4)()); // 10
```

### 11.7 Compose and Pipe

```javascript
// Compose: Right to left execution
function compose(...fns) {
    if (fns.length === 0) return (x) => x;
    if (fns.length === 1) return fns[0];
    
    return function(x) {
        return fns.reduceRight((acc, fn) => fn(acc), x);
    };
}

// Pipe: Left to right execution
function pipe(...fns) {
    if (fns.length === 0) return (x) => x;
    if (fns.length === 1) return fns[0];
    
    return function(x) {
        return fns.reduce((acc, fn) => fn(acc), x);
    };
}

// Async compose
function composeAsync(...fns) {
    return function(x) {
        return fns.reduceRight(
            (acc, fn) => acc.then(fn),
            Promise.resolve(x)
        );
    };
}

// Test:
const addOne = x => x + 1;
const double = x => x * 2;
const square = x => x * x;

const composed = compose(square, double, addOne);
console.log(composed(2)); // ((2 + 1) * 2)² = 36

const piped = pipe(addOne, double, square);
console.log(piped(2)); // ((2 + 1) * 2)² = 36 (same because symmetric)

const piped2 = pipe(addOne, square, double);
console.log(piped2(2)); // ((2 + 1)² * 2) = 18
```

### 11.8 Once

```javascript
function once(fn) {
    let called = false;
    let result;
    
    return function(...args) {
        if (called) {
            return result;
        }
        
        called = true;
        result = fn.apply(this, args);
        return result;
    };
}

// Test:
const initialize = once(() => {
    console.log('Initializing...');
    return { initialized: true };
});

console.log(initialize()); // 'Initializing...' { initialized: true }
console.log(initialize()); // { initialized: true } (no log, cached result)
console.log(initialize()); // { initialized: true } (no log, cached result)
```

### 11.9 Retry with Exponential Backoff

```javascript
async function retry(fn, maxRetries = 3, baseDelay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            const delay = baseDelay * Math.pow(2, i);
            console.log(`Retry ${i + 1} after ${delay}ms`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Test:
let attempts = 0;
const unreliableFn = async () => {
    attempts++;
    if (attempts < 3) throw new Error('Failed');
    return 'Success!';
};

retry(unreliableFn, 5, 1000).then(console.log); // Success! (after 2 retries)
```

### 11.10 Sleep / Delay

```javascript
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// With value
function delay(ms, value) {
    return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

// Test:
async function example() {
    console.log('Start');
    await sleep(1000);
    console.log('After 1 second');
    
    const result = await delay(500, 'Hello');
    console.log(result); // 'Hello' after 500ms
}
```

### 11.11 Chunk Array

```javascript
function chunk(array, size) {
    if (size <= 0) {
        throw new Error('Size must be positive');
    }
    
    const result = [];
    
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    
    return result;
}

// Generator version (memory efficient for large arrays)
function* chunkGenerator(array, size) {
    for (let i = 0; i < array.length; i += size) {
        yield array.slice(i, i + size);
    }
}

// Test:
console.log(chunk([1, 2, 3, 4, 5], 2)); // [[1, 2], [3, 4], [5]]
console.log(chunk([1, 2, 3, 4, 5, 6], 3)); // [[1, 2, 3], [4, 5, 6]]

for (const c of chunkGenerator([1, 2, 3, 4, 5], 2)) {
    console.log(c); // [1, 2], [3, 4], [5]
}
```

### 11.12 Flatten and Unflatten Object

```javascript
// Flatten nested object to dot notation
function flattenObject(obj, prefix = '') {
    const result = {};
    
    for (const key in obj) {
        if (!obj.hasOwnProperty(key)) continue;
        
        const newKey = prefix ? `${prefix}.${key}` : key;
        const value = obj[key];
        
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            Object.assign(result, flattenObject(value, newKey));
        } else {
            result[newKey] = value;
        }
    }
    
    return result;
}

// Unflatten dot notation to nested object
function unflattenObject(obj) {
    const result = {};
    
    for (const key in obj) {
        const keys = key.split('.');
        let current = result;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            current[k] = current[k] || {};
            current = current[k];
        }
        
        current[keys[keys.length - 1]] = obj[key];
    }
    
    return result;
}

// Test:
const nested = {
    a: 1,
    b: {
        c: 2,
        d: {
            e: 3
        }
    }
};

const flat = flattenObject(nested);
console.log(flat); // { 'a': 1, 'b.c': 2, 'b.d.e': 3 }

console.log(unflattenObject(flat)); // Original nested structure
```

### 11.13 Get and Set by Path

```javascript
// Get value by path
function get(obj, path, defaultValue = undefined) {
    const keys = Array.isArray(path) ? path : path.split('.');
    let result = obj;
    
    for (const key of keys) {
        if (result === null || result === undefined) {
            return defaultValue;
        }
        result = result[key];
    }
    
    return result === undefined ? defaultValue : result;
}

// Set value by path
function set(obj, path, value) {
    const keys = Array.isArray(path) ? path : path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const nextKey = keys[i + 1];
        
        if (!(key in current)) {
            // Create array if next key is numeric, otherwise object
            current[key] = /^\d+$/.test(nextKey) ? [] : {};
        }
        
        current = current[key];
    }
    
    current[keys[keys.length - 1]] = value;
    return obj;
}

// Test:
const obj = { a: { b: { c: 1 } } };

console.log(get(obj, 'a.b.c'));      // 1
console.log(get(obj, 'a.b.d', 'default')); // 'default'
console.log(get(obj, 'x.y.z'));      // undefined

set(obj, 'a.b.d', 2);
console.log(obj); // { a: { b: { c: 1, d: 2 } } }

set(obj, 'x.y.z', 3);
console.log(obj); // { a: {...}, x: { y: { z: 3 } } }
```

---

## Section 11B: Practical Interview Utilities

These are commonly asked practical utilities that complement the core functions above.

### 11B.1 Parse Query String

```javascript
// Parse URL query string to object
function parseQueryString(queryString) {
    const query = queryString.startsWith('?') ? queryString.slice(1) : queryString;
    const result = {};
    
    if (!query) return result;
    
    query.split('&').forEach(pair => {
        const [key, value] = pair.split('=').map(decodeURIComponent);
        
        if (result[key]) {
            // Handle multiple values with same key
            if (Array.isArray(result[key])) {
                result[key].push(value);
            } else {
                result[key] = [result[key], value];
            }
        } else {
            result[key] = value;
        }
    });
    
    return result;
}

// Test:
const qs = '?name=John&age=30&hobbies=reading&hobbies=gaming';
console.log(parseQueryString(qs));
// { name: 'John', age: '30', hobbies: ['reading', 'gaming'] }

// Reverse: Object to query string
function toQueryString(obj) {
    return Object.entries(obj)
        .flatMap(([key, value]) => {
            if (Array.isArray(value)) {
                return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
        .join('&');
}

console.log(toQueryString({ name: 'John', age: 30 })); // 'name=John&age=30'
```

### 11B.2 Format Phone Number

```javascript
function formatPhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    const digits = phoneNumber.replace(/\D/g, '');
    
    if (digits.length !== 10) {
        return 'Invalid phone number';
    }
    
    // Format: (XXX) XXX-XXXX
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

// Test:
console.log(formatPhoneNumber('1234567890'));    // (123) 456-7890
console.log(formatPhoneNumber('123-456-7890')); // (123) 456-7890
console.log(formatPhoneNumber('(123) 456-7890')); // (123) 456-7890
```

### 11B.3 Extract Hashtags

```javascript
function extractHashtags(text) {
    const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
    const matches = [...text.matchAll(hashtagRegex)];
    return matches.map(match => match[1]);
}

// Return unique hashtags
function extractUniqueHashtags(text) {
    const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
    const matches = [...text.matchAll(hashtagRegex)];
    return [...new Set(matches.map(match => match[1]))];
}

// Test:
const post = "Loving #JavaScript! #ES2024 #WebDev is amazing. #react #JavaScript";
console.log(extractHashtags(post)); // ['JavaScript', 'ES2024', 'WebDev', 'react', 'JavaScript']
console.log(extractUniqueHashtags(post)); // ['JavaScript', 'ES2024', 'WebDev', 'react']
```

### 11B.4 Email Validation

```javascript
function isValidEmail(email) {
    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// More comprehensive validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        return { valid: false, reason: 'Invalid format' };
    }
    
    if (email.length > 254) {
        return { valid: false, reason: 'Email too long' };
    }
    
    const [local, domain] = email.split('@');
    
    if (local.length > 64) {
        return { valid: false, reason: 'Local part too long' };
    }
    
    return { valid: true };
}

// Test:
console.log(isValidEmail('test@example.com')); // true
console.log(isValidEmail('invalid.email@'));   // false
console.log(validateEmail('user@example.com')); // { valid: true }
```

### 11B.5 Credit Card Validation (Luhn Algorithm)

```javascript
function validateCreditCard(cardNumber) {
    // Remove spaces and dashes
    const cleaned = cardNumber.replace(/[\s-]/g, '');
    
    // Check if only digits
    if (!/^\d+$/.test(cleaned)) {
        return { valid: false, reason: 'Invalid characters' };
    }
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i]);
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    const valid = sum % 10 === 0;
    
    if (!valid) {
        return { valid: false, reason: 'Failed Luhn check' };
    }
    
    // Identify card type
    let type = 'Unknown';
    if (/^4/.test(cleaned)) type = 'Visa';
    else if (/^5[1-5]/.test(cleaned)) type = 'Mastercard';
    else if (/^3[47]/.test(cleaned)) type = 'American Express';
    
    return { valid: true, type, last4: cleaned.slice(-4) };
}

// Test:
console.log(validateCreditCard('4532-1488-0343-6467')); // Valid Visa
console.log(validateCreditCard('1234-5678-9012-3456')); // Invalid
```

### 11B.6 Group By Property

```javascript
function groupBy(array, key) {
    return array.reduce((acc, item) => {
        const groupKey = typeof key === 'function' ? key(item) : item[key];
        
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(item);
        
        return acc;
    }, {});
}

// Test:
const users = [
    { id: 1, name: 'Alice', department: 'Engineering' },
    { id: 2, name: 'Bob', department: 'Marketing' },
    { id: 3, name: 'Charlie', department: 'Engineering' },
    { id: 4, name: 'Diana', department: 'HR' }
];

console.log(groupBy(users, 'department'));
// {
//   Engineering: [{ id: 1, ... }, { id: 3, ... }],
//   Marketing: [{ id: 2, ... }],
//   HR: [{ id: 4, ... }]
// }

// With function key:
const numbers = [1, 2, 3, 4, 5, 6];
console.log(groupBy(numbers, n => n % 2 === 0 ? 'even' : 'odd'));
// { odd: [1, 3, 5], even: [2, 4, 6] }
```

### 11B.7 Array Intersection

```javascript
function findIntersection(...arrays) {
    if (arrays.length === 0) return [];
    
    const result = new Set(arrays[0]);
    
    for (let i = 1; i < arrays.length; i++) {
        const currentSet = new Set(arrays[i]);
        for (const item of result) {
            if (!currentSet.has(item)) {
                result.delete(item);
            }
        }
    }
    
    return Array.from(result);
}

// Test:
const arr1 = [1, 2, 3, 4, 5];
const arr2 = [2, 3, 5, 6, 7];
const arr3 = [3, 5, 8, 9];

console.log(findIntersection(arr1, arr2));       // [2, 3, 5]
console.log(findIntersection(arr1, arr2, arr3)); // [3, 5]
```

### 11B.8 Merge and Deduplicate

```javascript
function mergeAndDeduplicate(arr1, arr2, keyFn = (item) => item.id) {
    const merged = [...arr1, ...arr2];
    
    // Use Map to deduplicate by key
    const uniqueMap = new Map();
    merged.forEach(item => {
        const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
        uniqueMap.set(key, item);
    });
    
    return Array.from(uniqueMap.values());
}

// Test:
const products1 = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 25 }
];
const products2 = [
    { id: 2, name: 'Mouse', price: 25 }, // duplicate
    { id: 3, name: 'Keyboard', price: 75 }
];

console.log(mergeAndDeduplicate(products1, products2));
// [{ id: 1, ... }, { id: 2, ... }, { id: 3, ... }]

// Sort by price after merge:
const merged = mergeAndDeduplicate(products1, products2);
const sorted = merged.sort((a, b) => b.price - a.price);
console.log(sorted); // Sorted by price descending
```

### 11B.9 Flatten Nested Data with Transform

```javascript
function flattenNested(categories) {
    return categories.flatMap(category => 
        category.products.map(product => ({
            ...product,
            category: category.name
        }))
    );
}

// Test:
const categories = [
    {
        name: 'Electronics',
        products: [
            { id: 1, name: 'Phone', price: 699 },
            { id: 2, name: 'Tablet', price: 499 }
        ]
    },
    {
        name: 'Books',
        products: [
            { id: 3, name: 'JavaScript Guide', price: 39 }
        ]
    }
];

console.log(flattenNested(categories));
// [
//   { id: 1, name: 'Phone', price: 699, category: 'Electronics' },
//   { id: 2, name: 'Tablet', price: 499, category: 'Electronics' },
//   { id: 3, name: 'JavaScript Guide', price: 39, category: 'Books' }
// ]
```

### 11B.10 Rate Limiter

```javascript
class RateLimiter {
    constructor(maxRequests, perMilliseconds) {
        this.maxRequests = maxRequests;
        this.perMilliseconds = perMilliseconds;
        this.queue = [];
        this.timestamps = [];
    }
    
    async execute(fn) {
        return new Promise((resolve, reject) => {
            this.queue.push({ fn, resolve, reject });
            this.processQueue();
        });
    }
    
    processQueue() {
        if (this.queue.length === 0) return;
        
        const now = Date.now();
        
        // Remove old timestamps
        this.timestamps = this.timestamps.filter(
            time => now - time < this.perMilliseconds
        );
        
        // Can we make a request?
        if (this.timestamps.length < this.maxRequests) {
            const { fn, resolve, reject } = this.queue.shift();
            this.timestamps.push(now);
            
            fn()
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    setTimeout(() => this.processQueue(), 0);
                });
        } else {
            // Wait and try again
            const oldestTimestamp = this.timestamps[0];
            const waitTime = this.perMilliseconds - (now - oldestTimestamp);
            setTimeout(() => this.processQueue(), waitTime);
        }
    }
}

// Test:
const limiter = new RateLimiter(3, 1000); // 3 requests per second

async function fetchWithLimit(id) {
    return limiter.execute(async () => {
        console.log(`Fetching ${id} at ${Date.now()}`);
        return { id, data: `Result ${id}` };
    });
}

// Make 6 requests - will be rate limited to 3 per second
async function testRateLimiter() {
    const promises = [];
    for (let i = 1; i <= 6; i++) {
        promises.push(fetchWithLimit(i));
    }
    const results = await Promise.all(promises);
    console.log('All done:', results);
}
```

### 11B.11 Async Pipeline

```javascript
// Pipeline: Execute async functions in sequence
async function pipeline(...fns) {
    return async function(initialValue) {
        let result = initialValue;
        for (const fn of fns) {
            result = await fn(result);
        }
        return result;
    };
}

// Test:
async function fetchData() {
    await new Promise(r => setTimeout(r, 100));
    return [1, 2, 3, 4, 5];
}

async function double(numbers) {
    await new Promise(r => setTimeout(r, 100));
    return numbers.map(n => n * 2);
}

async function filterEven(numbers) {
    await new Promise(r => setTimeout(r, 100));
    return numbers.filter(n => n % 2 === 0);
}

async function sum(numbers) {
    await new Promise(r => setTimeout(r, 100));
    return numbers.reduce((a, b) => a + b, 0);
}

// Usage:
const process = await pipeline(fetchData, double, filterEven, sum);
process().then(result => console.log('Result:', result)); // Result: 12

// With error handling
async function pipelineWithErrorHandling(...fns) {
    return async function(initialValue) {
        let result = initialValue;
        for (let i = 0; i < fns.length; i++) {
            try {
                result = await fns[i](result);
            } catch (error) {
                throw new Error(`Pipeline failed at step ${i + 1}: ${error.message}`);
            }
        }
        return result;
    };
}
```

---

## Section 12: Data Structure Implementations

### 12.1 LRU Cache (MUST KNOW)

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
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        this.cache.set(key, value);
        if (this.cache.size > this.capacity) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
    }
    
    // Helper method to see current state
    toString() {
        return Array.from(this.cache.entries());
    }
}

// Test:
const cache = new LRUCache(3);
cache.put(1, 'one');
cache.put(2, 'two');
cache.put(3, 'three');
console.log(cache.get(1)); // 'one', moves 1 to end
cache.put(4, 'four');      // removes key 2
console.log(cache.get(2)); // -1 (not found)
console.log(cache.toString()); // [[3, 'three'], [1, 'one'], [4, 'four']]
```

### 12.2 EventEmitter / PubSub (MUST KNOW)

```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    // Subscribe to an event
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
        
        // Return unsubscribe function
        return () => this.off(event, callback);
    }
    
    // Subscribe once
    once(event, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
    
    // Unsubscribe
    off(event, callback) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(cb => cb !== callback);
    }
    
    // Emit event
    emit(event, ...args) {
        if (!this.events[event]) return;
        this.events[event].forEach(callback => {
            callback(...args);
        });
    }
    
    // Remove all listeners
    removeAllListeners(event) {
        if (event) {
            delete this.events[event];
        } else {
            this.events = {};
        }
    }
}

// Test:
const emitter = new EventEmitter();

const unsubscribe = emitter.on('message', (data) => {
    console.log('Received:', data);
});

emitter.on('message', (data) => {
    console.log('Also received:', data);
});

emitter.once('init', () => {
    console.log('Initialized (only once)');
});

emitter.emit('message', 'Hello'); // Both listeners fire
emitter.emit('init'); // Fires once
emitter.emit('init'); // Doesn't fire

unsubscribe(); // Remove first listener
emitter.emit('message', 'World'); // Only second listener fires
```

### 12.3 Stack with Min/Max in O(1)

```javascript
class MinStack {
    constructor() {
        this.stack = [];
        this.minStack = [];
    }
    
    push(val) {
        this.stack.push(val);
        
        // Push to minStack if empty or val <= current min
        if (this.minStack.length === 0 || val <= this.getMin()) {
            this.minStack.push(val);
        }
    }
    
    pop() {
        const val = this.stack.pop();
        
        // If popped value is current min, pop from minStack too
        if (val === this.getMin()) {
            this.minStack.pop();
        }
        
        return val;
    }
    
    top() {
        return this.stack[this.stack.length - 1];
    }
    
    getMin() {
        return this.minStack[this.minStack.length - 1];
    }
    
    isEmpty() {
        return this.stack.length === 0;
    }
}

// Test:
const minStack = new MinStack();
minStack.push(3);
minStack.push(5);
console.log(minStack.getMin()); // 3
minStack.push(2);
minStack.push(1);
console.log(minStack.getMin()); // 1
minStack.pop();
console.log(minStack.getMin()); // 2
minStack.pop();
console.log(minStack.getMin()); // 3
```

### 12.5 Queue using Two Stacks

```javascript
class Queue {
    constructor() {
        this.inbox = [];
        this.outbox = [];
    }
    
    enqueue(val) {
        this.inbox.push(val);
    }
    
    dequeue() {
        if (this.outbox.length === 0) {
            // Transfer all from inbox to outbox
            while (this.inbox.length > 0) {
                this.outbox.push(this.inbox.pop());
            }
        }
        return this.outbox.pop();
    }
    
    peek() {
        if (this.outbox.length === 0) {
            while (this.inbox.length > 0) {
                this.outbox.push(this.inbox.pop());
            }
        }
        return this.outbox[this.outbox.length - 1];
    }
    
    isEmpty() {
        return this.inbox.length === 0 && this.outbox.length === 0;
    }
    
    size() {
        return this.inbox.length + this.outbox.length;
    }
}

// Test:
const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
console.log(queue.dequeue()); // 1
console.log(queue.peek());    // 2
queue.enqueue(4);
console.log(queue.dequeue()); // 2
```

### 12.6 LinkedList (Singly)

```javascript
class ListNode {
    constructor(val) {
        this.val = val;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }
    
    // Add to end
    append(val) {
        const node = new ListNode(val);
        
        if (!this.head) {
            this.head = node;
            this.tail = node;
        } else {
            this.tail.next = node;
            this.tail = node;
        }
        
        this.size++;
        return this;
    }
    
    // Add to beginning
    prepend(val) {
        const node = new ListNode(val);
        
        if (!this.head) {
            this.head = node;
            this.tail = node;
        } else {
            node.next = this.head;
            this.head = node;
        }
        
        this.size++;
        return this;
    }
    
    // Insert at index
    insertAt(index, val) {
        if (index < 0 || index > this.size) {
            throw new Error('Index out of bounds');
        }
        
        if (index === 0) return this.prepend(val);
        if (index === this.size) return this.append(val);
        
        const node = new ListNode(val);
        let current = this.head;
        
        for (let i = 0; i < index - 1; i++) {
            current = current.next;
        }
        
        node.next = current.next;
        current.next = node;
        this.size++;
        
        return this;
    }
    
    // Remove at index
    removeAt(index) {
        if (index < 0 || index >= this.size) {
            throw new Error('Index out of bounds');
        }
        
        let removed;
        
        if (index === 0) {
            removed = this.head;
            this.head = this.head.next;
            if (this.size === 1) this.tail = null;
        } else {
            let current = this.head;
            for (let i = 0; i < index - 1; i++) {
                current = current.next;
            }
            removed = current.next;
            current.next = current.next.next;
            if (index === this.size - 1) {
                this.tail = current;
            }
        }
        
        this.size--;
        return removed.val;
    }
    
    // Find value
    find(val) {
        let current = this.head;
        let index = 0;
        
        while (current) {
            if (current.val === val) return index;
            current = current.next;
            index++;
        }
        
        return -1;
    }
    
    // Reverse list
    reverse() {
        let prev = null;
        let current = this.head;
        this.tail = this.head;
        
        while (current) {
            const next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }
        
        this.head = prev;
        return this;
    }
    
    // Convert to array
    toArray() {
        const arr = [];
        let current = this.head;
        while (current) {
            arr.push(current.val);
            current = current.next;
        }
        return arr;
    }
}

// Test:
const list = new LinkedList();
list.append(1).append(2).append(3);
console.log(list.toArray()); // [1, 2, 3]
list.prepend(0);
console.log(list.toArray()); // [0, 1, 2, 3]
list.reverse();
console.log(list.toArray()); // [3, 2, 1, 0]
```

### 12.7 Trie (Prefix Tree)

```javascript
class TrieNode {
    constructor() {
        this.children = new Map();
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }
    
    // Insert word
    insert(word) {
        let node = this.root;
        
        for (const char of word) {
            if (!node.children.has(char)) {
                node.children.set(char, new TrieNode());
            }
            node = node.children.get(char);
        }
        
        node.isEndOfWord = true;
    }
    
    // Search exact word
    search(word) {
        const node = this._findNode(word);
        return node !== null && node.isEndOfWord;
    }
    
    // Check if any word starts with prefix
    startsWith(prefix) {
        return this._findNode(prefix) !== null;
    }
    
    // Get all words with prefix (autocomplete)
    getWordsWithPrefix(prefix) {
        const node = this._findNode(prefix);
        if (!node) return [];
        
        const words = [];
        this._collectWords(node, prefix, words);
        return words;
    }
    
    // Delete word
    delete(word) {
        this._delete(this.root, word, 0);
    }
    
    // Helper: Find node at end of prefix
    _findNode(prefix) {
        let node = this.root;
        
        for (const char of prefix) {
            if (!node.children.has(char)) {
                return null;
            }
            node = node.children.get(char);
        }
        
        return node;
    }
    
    // Helper: Collect all words from node (DFS)
    _collectWords(node, prefix, words) {
        if (node.isEndOfWord) {
            words.push(prefix);
        }
        
        for (const [char, childNode] of node.children) {
            this._collectWords(childNode, prefix + char, words);
        }
    }
    
    // Helper: Delete word recursively
    _delete(node, word, index) {
        if (index === word.length) {
            if (!node.isEndOfWord) return false;
            node.isEndOfWord = false;
            return node.children.size === 0;
        }
        
        const char = word[index];
        if (!node.children.has(char)) return false;
        
        const shouldDelete = this._delete(
            node.children.get(char), 
            word, 
            index + 1
        );
        
        if (shouldDelete) {
            node.children.delete(char);
            return node.children.size === 0 && !node.isEndOfWord;
        }
        
        return false;
    }
}

// Test:
const trie = new Trie();
trie.insert('apple');
trie.insert('app');
trie.insert('application');
trie.insert('banana');

console.log(trie.search('app'));       // true
console.log(trie.search('appl'));      // false
console.log(trie.startsWith('app'));   // true
console.log(trie.getWordsWithPrefix('app')); // ['app', 'apple', 'application']
```

### 12.8 Binary Heap (MinHeap / Priority Queue)

```javascript
class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    // Get parent/child indices
    _parent(i) { return Math.floor((i - 1) / 2); }
    _leftChild(i) { return 2 * i + 1; }
    _rightChild(i) { return 2 * i + 2; }
    
    // Swap elements
    _swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
    
    // Bubble up (after insert)
    _heapifyUp(index) {
        while (index > 0) {
            const parentIndex = this._parent(index);
            if (this.heap[parentIndex] <= this.heap[index]) break;
            this._swap(parentIndex, index);
            index = parentIndex;
        }
    }
    
    // Bubble down (after extract)
    _heapifyDown(index) {
        while (true) {
            let smallest = index;
            const left = this._leftChild(index);
            const right = this._rightChild(index);
            
            if (left < this.heap.length && this.heap[left] < this.heap[smallest]) {
                smallest = left;
            }
            if (right < this.heap.length && this.heap[right] < this.heap[smallest]) {
                smallest = right;
            }
            
            if (smallest === index) break;
            
            this._swap(index, smallest);
            index = smallest;
        }
    }
    
    // Insert value - O(log n)
    insert(val) {
        this.heap.push(val);
        this._heapifyUp(this.heap.length - 1);
    }
    
    // Extract min - O(log n)
    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this._heapifyDown(0);
        
        return min;
    }
    
    // Peek min - O(1)
    peek() {
        return this.heap[0] ?? null;
    }
    
    size() {
        return this.heap.length;
    }
    
    isEmpty() {
        return this.heap.length === 0;
    }
}

// MaxHeap (just flip comparisons)
class MaxHeap extends MinHeap {
    _heapifyUp(index) {
        while (index > 0) {
            const parentIndex = this._parent(index);
            if (this.heap[parentIndex] >= this.heap[index]) break;
            this._swap(parentIndex, index);
            index = parentIndex;
        }
    }
    
    _heapifyDown(index) {
        while (true) {
            let largest = index;
            const left = this._leftChild(index);
            const right = this._rightChild(index);
            
            if (left < this.heap.length && this.heap[left] > this.heap[largest]) {
                largest = left;
            }
            if (right < this.heap.length && this.heap[right] > this.heap[largest]) {
                largest = right;
            }
            
            if (largest === index) break;
            
            this._swap(index, largest);
            index = largest;
        }
    }
    
    extractMax() {
        return this.extractMin(); // Same logic, just max due to comparison change
    }
}

// Test:
const minHeap = new MinHeap();
[5, 3, 8, 1, 2, 9].forEach(n => minHeap.insert(n));

console.log(minHeap.extractMin()); // 1
console.log(minHeap.extractMin()); // 2
console.log(minHeap.extractMin()); // 3
console.log(minHeap.peek());       // 5
```

---

## Section 13: Promise Implementations

### 13.1 Promise from Scratch

```javascript
class MyPromise {
    constructor(executor) {
        this.state = 'pending';
        this.value = undefined;
        this.handlers = [];
        
        const resolve = (value) => {
            if (this.state !== 'pending') return;
            
            // Handle thenable
            if (value && typeof value.then === 'function') {
                value.then(resolve, reject);
                return;
            }
            
            this.state = 'fulfilled';
            this.value = value;
            this.handlers.forEach(h => this._handle(h));
        };
        
        const reject = (reason) => {
            if (this.state !== 'pending') return;
            this.state = 'rejected';
            this.value = reason;
            this.handlers.forEach(h => this._handle(h));
        };
        
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }
    
    _handle(handler) {
        if (this.state === 'pending') {
            this.handlers.push(handler);
            return;
        }
        
        const cb = this.state === 'fulfilled' ? handler.onFulfilled : handler.onRejected;
        
        if (!cb) {
            if (this.state === 'fulfilled') {
                handler.resolve(this.value);
            } else {
                handler.reject(this.value);
            }
            return;
        }
        
        // Execute asynchronously
        queueMicrotask(() => {
            try {
                const result = cb(this.value);
                handler.resolve(result);
            } catch (error) {
                handler.reject(error);
            }
        });
    }
    
    then(onFulfilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            this._handle({
                onFulfilled: typeof onFulfilled === 'function' ? onFulfilled : null,
                onRejected: typeof onRejected === 'function' ? onRejected : null,
                resolve,
                reject
            });
        });
    }
    
    catch(onRejected) {
        return this.then(null, onRejected);
    }
    
    finally(onFinally) {
        return this.then(
            value => MyPromise.resolve(onFinally()).then(() => value),
            reason => MyPromise.resolve(onFinally()).then(() => { throw reason; })
        );
    }
    
    static resolve(value) {
        if (value instanceof MyPromise) return value;
        return new MyPromise(resolve => resolve(value));
    }
    
    static reject(reason) {
        return new MyPromise((_, reject) => reject(reason));
    }
}

// Test:
const p = new MyPromise((resolve) => {
    setTimeout(() => resolve('Hello'), 100);
});

p.then(val => val + ' World')
 .then(console.log); // 'Hello World'
```

### 13.2 Promise.all Implementation

```javascript
MyPromise.all = function(promises) {
    return new MyPromise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError('Argument must be an array'));
        }
        
        if (promises.length === 0) {
            return resolve([]);
        }
        
        const results = [];
        let completed = 0;
        
        promises.forEach((promise, index) => {
            MyPromise.resolve(promise)
                .then(value => {
                    results[index] = value;
                    completed++;
                    
                    if (completed === promises.length) {
                        resolve(results);
                    }
                })
                .catch(reject); // Fail fast on first rejection
        });
    });
};

// Test:
MyPromise.all([
    MyPromise.resolve(1),
    MyPromise.resolve(2),
    MyPromise.resolve(3)
]).then(console.log); // [1, 2, 3]
```

### 13.3 Promise.race Implementation

```javascript
MyPromise.race = function(promises) {
    return new MyPromise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError('Argument must be an array'));
        }
        
        promises.forEach(promise => {
            MyPromise.resolve(promise).then(resolve, reject);
        });
    });
};
```

### 13.4 Promise.allSettled Implementation

```javascript
MyPromise.allSettled = function(promises) {
    return new MyPromise((resolve) => {
        if (!Array.isArray(promises)) {
            return resolve([]);
        }
        
        if (promises.length === 0) {
            return resolve([]);
        }
        
        const results = [];
        let completed = 0;
        
        promises.forEach((promise, index) => {
            MyPromise.resolve(promise)
                .then(value => {
                    results[index] = { status: 'fulfilled', value };
                })
                .catch(reason => {
                    results[index] = { status: 'rejected', reason };
                })
                .finally(() => {
                    completed++;
                    if (completed === promises.length) {
                        resolve(results);
                    }
                });
        });
    });
};
```

### 13.5 Promise.any Implementation

```javascript
MyPromise.any = function(promises) {
    return new MyPromise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError('Argument must be an array'));
        }
        
        if (promises.length === 0) {
            return reject(new AggregateError([], 'All promises were rejected'));
        }
        
        const errors = [];
        let rejectedCount = 0;
        
        promises.forEach((promise, index) => {
            MyPromise.resolve(promise)
                .then(resolve) // First to fulfill wins
                .catch(reason => {
                    errors[index] = reason;
                    rejectedCount++;
                    
                    if (rejectedCount === promises.length) {
                        reject(new AggregateError(errors, 'All promises were rejected'));
                    }
                });
        });
    });
};
```

### 13.6 Concurrent Promise Executor (like p-limit)

```javascript
function pLimit(concurrency) {
    const queue = [];
    let activeCount = 0;
    
    const next = () => {
        activeCount--;
        if (queue.length > 0) {
            queue.shift()();
        }
    };
    
    const run = async (fn, resolve, reject) => {
        activeCount++;
        try {
            const result = await fn();
            resolve(result);
        } catch (error) {
            reject(error);
        }
        next();
    };
    
    const enqueue = (fn) => {
        return new Promise((resolve, reject) => {
            const task = () => run(fn, resolve, reject);
            
            if (activeCount < concurrency) {
                task();
            } else {
                queue.push(task);
            }
        });
    };
    
    return enqueue;
}

// Test:
const limit = pLimit(2); // Max 2 concurrent

const tasks = [1, 2, 3, 4, 5].map(i => 
    limit(() => new Promise(resolve => {
        console.log(`Start ${i}`);
        setTimeout(() => {
            console.log(`End ${i}`);
            resolve(i);
        }, 1000);
    }))
);

Promise.all(tasks).then(console.log);
// Starts 1, 2 immediately
// When 1 or 2 ends, starts 3
// When another ends, starts 4
// etc.
```

### 13.7 Promise with Timeout

```javascript
function promiseWithTimeout(promise, ms, errorMessage = 'Operation timed out') {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(errorMessage)), ms);
    });
    
    return Promise.race([promise, timeout]);
}

// Cancelable version
function promiseWithTimeoutCancelable(promise, ms) {
    let timeoutId;
    
    const timeout = new Promise((_, reject) => {
        timeoutId = setTimeout(() => {
            reject(new Error('Operation timed out'));
        }, ms);
    });
    
    return Promise.race([promise, timeout]).finally(() => {
        clearTimeout(timeoutId);
    });
}

// Test:
const slowOperation = new Promise(resolve => 
    setTimeout(() => resolve('Done'), 5000)
);

promiseWithTimeout(slowOperation, 1000)
    .then(console.log)
    .catch(err => console.log(err.message)); // 'Operation timed out'
```

---

# PART D: DOM AND BROWSER (FRONTEND SPECIFIC)

---

## Section 14: DOM Manipulation

### 14.1 DOM Tree Structure

```
                        document
                            │
                        <html>
                       /      \
                  <head>      <body>
                    │         /    \
                 <title>   <div>   <script>
                            │
                          <p>
                          │
                      "Hello"
```

**Node Types:**
```javascript
// Common node types
Node.ELEMENT_NODE     // 1  - <div>, <p>, etc.
Node.TEXT_NODE        // 3  - Text content
Node.COMMENT_NODE     // 8  - <!-- comment -->
Node.DOCUMENT_NODE    // 9  - document
Node.DOCUMENT_TYPE_NODE // 10 - <!DOCTYPE html>

// Check node type
const div = document.querySelector('div');
console.log(div.nodeType); // 1 (ELEMENT_NODE)
console.log(div.nodeName); // 'DIV'
```

### 14.2 Selecting Elements

```javascript
// By ID - returns single element or null
const element = document.getElementById('myId');

// By class - returns live HTMLCollection
const elements = document.getElementsByClassName('myClass');

// By tag - returns live HTMLCollection
const divs = document.getElementsByTagName('div');

// By name attribute - returns live NodeList
const inputs = document.getElementsByName('email');

// querySelector - returns first match or null
const first = document.querySelector('.myClass');
const nested = document.querySelector('div > p.highlight');

// querySelectorAll - returns static NodeList
const all = document.querySelectorAll('.myClass');
const multiple = document.querySelectorAll('div, p, span');

// Selector examples
document.querySelector('#id');           // By ID
document.querySelector('.class');        // By class
document.querySelector('div');           // By tag
document.querySelector('[data-id]');     // Has attribute
document.querySelector('[data-id="5"]'); // Attribute value
document.querySelector('div.class');     // Tag with class
document.querySelector('ul > li');       // Direct child
document.querySelector('ul li');         // Any descendant
document.querySelector('li:first-child'); // Pseudo-selector
document.querySelector('input:checked'); // Pseudo-selector
```

### 14.3 Live vs Static Collections

```javascript
// LIVE: HTMLCollection - automatically updates when DOM changes
const liveCollection = document.getElementsByClassName('item');
console.log(liveCollection.length); // 3

document.body.innerHTML += '<div class="item">New</div>';
console.log(liveCollection.length); // 4 (auto-updated!)

// STATIC: NodeList from querySelectorAll - snapshot, doesn't update
const staticList = document.querySelectorAll('.item');
console.log(staticList.length); // 4

document.body.innerHTML += '<div class="item">Another</div>';
console.log(staticList.length); // 4 (unchanged!)

// Convert to array for array methods
const arr1 = Array.from(liveCollection);
const arr2 = [...staticList];

// NodeList has forEach, but HTMLCollection doesn't
staticList.forEach(item => console.log(item)); // Works
// liveCollection.forEach(...) // TypeError!
Array.from(liveCollection).forEach(item => console.log(item)); // Works
```

### 14.4 Creating and Modifying Elements

```javascript
// Create element
const div = document.createElement('div');
const text = document.createTextNode('Hello');
const comment = document.createComment('This is a comment');

// Set content
div.textContent = 'Safe text content';  // Escapes HTML
div.innerHTML = '<span>HTML content</span>'; // Parses HTML (XSS risk!)
div.innerText = 'Visible text only';    // Respects CSS (slower)

// Set attributes
div.id = 'myDiv';
div.className = 'container active';
div.setAttribute('data-id', '123');
div.setAttribute('aria-label', 'Main container');

// Get attributes
const id = div.getAttribute('data-id');    // '123'
const hasAttr = div.hasAttribute('data-id'); // true
div.removeAttribute('data-id');

// Dataset (data-* attributes)
div.dataset.userId = '456';     // Sets data-user-id="456"
console.log(div.dataset.userId); // '456'

// Class manipulation
div.classList.add('new-class');
div.classList.remove('old-class');
div.classList.toggle('active');        // Add if missing, remove if present
div.classList.toggle('hidden', false); // Force remove
div.classList.contains('active');      // true/false
div.classList.replace('old', 'new');

// Style manipulation
div.style.color = 'red';
div.style.backgroundColor = 'blue';    // camelCase
div.style.cssText = 'color: red; background: blue;'; // Multiple
div.style.setProperty('--custom-color', 'green'); // CSS variables

// Get computed styles
const computed = window.getComputedStyle(div);
console.log(computed.color);
console.log(computed.getPropertyValue('background-color'));
```

### 14.5 Inserting and Removing Elements

```javascript
const parent = document.getElementById('parent');
const child = document.createElement('div');

// Append (at end)
parent.appendChild(child);
parent.append(child, 'text', anotherElement); // Multiple items
parent.append('Just text'); // Can append text directly

// Prepend (at beginning)
parent.prepend(child);
parent.prepend('text', element);

// Insert at specific position
const reference = document.getElementById('reference');
parent.insertBefore(child, reference); // Before reference

// Modern insertion methods
reference.before(child);      // Insert before
reference.after(child);       // Insert after
reference.replaceWith(child); // Replace element

// insertAdjacentHTML/Element/Text
element.insertAdjacentHTML('beforebegin', '<div>Before</div>');
element.insertAdjacentHTML('afterbegin', '<div>First child</div>');
element.insertAdjacentHTML('beforeend', '<div>Last child</div>');
element.insertAdjacentHTML('afterend', '<div>After</div>');

/*
<!-- beforebegin -->
<div id="element">
  <!-- afterbegin -->
  Content
  <!-- beforeend -->
</div>
<!-- afterend -->
*/

// Remove elements
child.remove();                    // Remove self
parent.removeChild(child);         // Remove child (returns removed element)

// Replace elements
parent.replaceChild(newChild, oldChild);

// Clone elements
const shallow = element.cloneNode(false);  // Element only
const deep = element.cloneNode(true);      // With all descendants
```

### 14.6 Document Fragments (Performance)

```javascript
// Problem: Multiple DOM insertions cause multiple reflows
const list = document.getElementById('list');
for (let i = 0; i < 1000; i++) {
    const li = document.createElement('li');
    li.textContent = `Item ${i}`;
    list.appendChild(li); // 1000 reflows! Slow!
}

// Solution: Use DocumentFragment
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
    const li = document.createElement('li');
    li.textContent = `Item ${i}`;
    fragment.appendChild(li); // No reflow yet
}

list.appendChild(fragment); // Single reflow! Fast!

// Alternative: Build HTML string (be careful with XSS)
let html = '';
for (let i = 0; i < 1000; i++) {
    html += `<li>Item ${i}</li>`;
}
list.innerHTML = html; // Single reflow
```

### 14.7 Traversing the DOM

```javascript
const element = document.getElementById('myElement');

// Parent
element.parentNode;        // Parent (any node)
element.parentElement;     // Parent element only

// Children
element.childNodes;        // All child nodes (including text, comments)
element.children;          // Only element children
element.firstChild;        // First child node
element.firstElementChild; // First element child
element.lastChild;         // Last child node
element.lastElementChild;  // Last element child

// Siblings
element.previousSibling;        // Previous node
element.previousElementSibling; // Previous element
element.nextSibling;            // Next node
element.nextElementSibling;     // Next element

// Find closest ancestor matching selector
element.closest('.container'); // Finds nearest ancestor with class 'container'
element.closest('div');        // Nearest div ancestor

// Check if element matches selector
element.matches('.active');    // true/false

// Check if contains
parent.contains(child);        // true if parent contains child

// Example: Find all parent elements
function getParents(element) {
    const parents = [];
    let current = element.parentElement;
    while (current) {
        parents.push(current);
        current = current.parentElement;
    }
    return parents;
}
```

### 14.8 innerHTML vs textContent vs innerText

```javascript
const div = document.createElement('div');
div.innerHTML = '<p>Hello <span style="display:none">Hidden</span> World</p>';

// innerHTML - Gets/sets HTML markup
console.log(div.innerHTML);
// '<p>Hello <span style="display:none">Hidden</span> World</p>'

// textContent - All text content (including hidden)
console.log(div.textContent);
// 'Hello Hidden World'

// innerText - Only visible text (respects CSS)
console.log(div.innerText);
// 'Hello  World' (hidden text not included)

// Security considerations:
const userInput = '<script>alert("XSS")</script>';

// DANGEROUS - executes script!
div.innerHTML = userInput;

// SAFE - escapes HTML
div.textContent = userInput;
// Displays: <script>alert("XSS")</script>

// Performance:
// textContent is faster than innerText (doesn't check CSS)
// innerHTML is fast but has XSS risks
```

---

## Section 15: Events Deep Dive

### 15.1 Event Propagation (Capturing & Bubbling)

```
                    │ CAPTURING PHASE (1)           │
                    │ (top to bottom)               │
                    ▼                               │
┌───────────────────────────────────────────────────│────┐
│ document                                          │    │
│  ┌────────────────────────────────────────────────│──┐ │
│  │ <html>                                         │  │ │
│  │  ┌─────────────────────────────────────────────│┐ │ │
│  │  │ <body>                                      ││ │ │
│  │  │  ┌──────────────────────────────────────────┤│ │ │
│  │  │  │ <div id="parent">                        ││ │ │
│  │  │  │  ┌───────────────────────────────────────┤│ │ │
│  │  │  │  │ <button id="child"> ← TARGET PHASE (2)││ │ │
│  │  │  │  └───────────────────────────────────────┘│ │ │
│  │  │  └──────────────────────────────────────────┬┘ │ │
│  │  └─────────────────────────────────────────────┬┘ │ │
│  └────────────────────────────────────────────────┬┘ │ │
└───────────────────────────────────────────────────┬──┘ │
                    │                               │    │
                    │      BUBBLING PHASE (3)       │    │
                    │      (bottom to top)          ▲    │
                    └───────────────────────────────┘    │
```

```javascript
const parent = document.getElementById('parent');
const child = document.getElementById('child');

// Bubbling (default) - event goes UP from target
parent.addEventListener('click', () => {
    console.log('Parent clicked (bubbling)');
});

child.addEventListener('click', () => {
    console.log('Child clicked');
});

// Click on child:
// 1. "Child clicked"
// 2. "Parent clicked (bubbling)"

// Capturing - event goes DOWN to target
parent.addEventListener('click', () => {
    console.log('Parent clicked (capturing)');
}, true); // Third argument 'true' = capturing phase

// Click on child:
// 1. "Parent clicked (capturing)"
// 2. "Child clicked"
// 3. "Parent clicked (bubbling)"

// Using options object
parent.addEventListener('click', handler, {
    capture: true,    // Use capturing phase
    once: true,       // Remove after first call
    passive: true     // Won't call preventDefault (performance)
});
```

### 15.2 Event Delegation

Instead of adding listeners to many elements, add one to their parent.

```javascript
// BAD: Adding listener to each item (1000 listeners!)
document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', handleClick);
});

// GOOD: Event delegation (1 listener!)
document.getElementById('list').addEventListener('click', (e) => {
    // Check if clicked element matches what we want
    if (e.target.matches('.item')) {
        handleClick(e);
    }
    
    // Or use closest() for nested elements
    const item = e.target.closest('.item');
    if (item) {
        handleClick(e, item);
    }
});

// Practical example: Dynamic list
const todoList = document.getElementById('todo-list');

todoList.addEventListener('click', (e) => {
    // Handle delete button
    if (e.target.matches('.delete-btn')) {
        const todoItem = e.target.closest('.todo-item');
        todoItem.remove();
    }
    
    // Handle checkbox
    if (e.target.matches('.checkbox')) {
        const todoItem = e.target.closest('.todo-item');
        todoItem.classList.toggle('completed');
    }
});

// Works even for dynamically added items!
function addTodo(text) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.innerHTML = `
        <input type="checkbox" class="checkbox">
        <span>${text}</span>
        <button class="delete-btn">Delete</button>
    `;
    todoList.appendChild(li);
    // No need to add new event listeners!
}
```

### 15.3 stopPropagation vs stopImmediatePropagation vs preventDefault

```javascript
// stopPropagation(): Stops event from propagating to parent elements
child.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('Child clicked');
    // Parent handlers will NOT be called
});

// stopImmediatePropagation(): Stops propagation AND prevents other handlers on same element
child.addEventListener('click', (e) => {
    e.stopImmediatePropagation();
    console.log('First handler');
});

child.addEventListener('click', (e) => {
    console.log('Second handler'); // Never called!
});

// preventDefault(): Prevents default browser action
const link = document.querySelector('a');
link.addEventListener('click', (e) => {
    e.preventDefault(); // Link won't navigate
    console.log('Link clicked but not followed');
});

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Form won't submit
    console.log('Form submitted via JS');
    // Custom validation and AJAX submit
});

// Common use cases for preventDefault:
// - Form submission (AJAX instead)
// - Link clicks (SPA navigation)
// - Checkbox clicks (custom validation)
// - Context menu (custom right-click menu)
// - Drag and drop
```

### 15.4 Custom Events

```javascript
// Create custom event
const customEvent = new CustomEvent('userLoggedIn', {
    detail: {
        userId: 123,
        username: 'john_doe'
    },
    bubbles: true,      // Event will bubble up
    cancelable: true    // Can call preventDefault()
});

// Dispatch event
document.dispatchEvent(customEvent);

// Listen for custom event
document.addEventListener('userLoggedIn', (e) => {
    console.log('User logged in:', e.detail.username);
});

// Practical example: Component communication
class ShoppingCart {
    addItem(item) {
        // ... add item logic
        
        // Dispatch event for other components to react
        const event = new CustomEvent('cartUpdated', {
            detail: { 
                items: this.items,
                total: this.total
            },
            bubbles: true
        });
        document.dispatchEvent(event);
    }
}

// Header component listens
document.addEventListener('cartUpdated', (e) => {
    updateCartBadge(e.detail.items.length);
});

// Mini cart component listens
document.addEventListener('cartUpdated', (e) => {
    updateMiniCart(e.detail);
});
```

### 15.5 Event Listener Options

```javascript
element.addEventListener('click', handler, {
    // Capturing phase instead of bubbling
    capture: true,
    
    // Automatically remove after first invocation
    once: true,
    
    // Promise to never call preventDefault (improves scroll performance)
    passive: true,
    
    // AbortController signal for removal
    signal: controller.signal
});

// Passive listeners (important for scroll/touch performance)
// BAD: Browser waits to see if you'll call preventDefault
document.addEventListener('touchmove', (e) => {
    // Processing...
}, false);

// GOOD: Browser knows you won't preventDefault, scrolls immediately
document.addEventListener('touchmove', (e) => {
    // Processing...
}, { passive: true });

// Using AbortController to remove listeners
const controller = new AbortController();

element.addEventListener('click', handler1, { signal: controller.signal });
element.addEventListener('mouseover', handler2, { signal: controller.signal });
element.addEventListener('keydown', handler3, { signal: controller.signal });

// Remove all listeners at once
controller.abort();
```

### 15.6 Common Event Types and Properties

```javascript
// Mouse Events
element.addEventListener('click', (e) => {
    e.clientX;     // X relative to viewport
    e.clientY;     // Y relative to viewport
    e.pageX;       // X relative to document
    e.pageY;       // Y relative to document
    e.offsetX;     // X relative to element
    e.offsetY;     // Y relative to element
    e.button;      // 0=left, 1=middle, 2=right
    e.buttons;     // Bitmask of pressed buttons
    e.altKey;      // Alt key held?
    e.ctrlKey;     // Ctrl key held?
    e.shiftKey;    // Shift key held?
    e.metaKey;     // Meta/Command key held?
});

// Mouse event types
'click'        // Single click
'dblclick'     // Double click
'mousedown'    // Button pressed
'mouseup'      // Button released
'mousemove'    // Mouse moved
'mouseenter'   // Mouse entered element (no bubbling)
'mouseleave'   // Mouse left element (no bubbling)
'mouseover'    // Mouse over element (bubbles)
'mouseout'     // Mouse left element (bubbles)
'contextmenu'  // Right click

// Keyboard Events
element.addEventListener('keydown', (e) => {
    e.key;         // 'a', 'Enter', 'ArrowUp', etc.
    e.code;        // 'KeyA', 'Enter', 'ArrowUp' (physical key)
    e.keyCode;     // Deprecated numeric code
    e.repeat;      // Is key being held?
    e.altKey;
    e.ctrlKey;
    e.shiftKey;
    e.metaKey;
    
    // Prevent default for specific keys
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitForm();
    }
});

// Keyboard event types
'keydown'      // Key pressed (fires repeatedly when held)
'keyup'        // Key released
'keypress'     // Deprecated, use keydown

// Focus Events
'focus'        // Element gained focus (no bubbling)
'blur'         // Element lost focus (no bubbling)
'focusin'      // Element gained focus (bubbles)
'focusout'     // Element lost focus (bubbles)

// Form Events
'submit'       // Form submitted
'reset'        // Form reset
'change'       // Value changed (after blur for text inputs)
'input'        // Value changing (fires on each keystroke)
'invalid'      // Validation failed

// Input event example
input.addEventListener('input', (e) => {
    e.target.value;     // Current value
    e.inputType;        // 'insertText', 'deleteContentBackward', etc.
    e.data;             // Inserted character(s)
});

// target vs currentTarget
parent.addEventListener('click', (e) => {
    e.target;        // Element that was actually clicked (child)
    e.currentTarget; // Element the handler is attached to (parent)
    this;            // Same as currentTarget (not in arrow functions)
});
```

### 15.7 Event Handler Implementation

```javascript
// Implement a simple event system
class EventTarget {
    constructor() {
        this.listeners = {};
    }
    
    addEventListener(type, callback, options = {}) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        
        this.listeners[type].push({
            callback,
            once: options.once || false
        });
    }
    
    removeEventListener(type, callback) {
        if (!this.listeners[type]) return;
        
        this.listeners[type] = this.listeners[type].filter(
            listener => listener.callback !== callback
        );
    }
    
    dispatchEvent(event) {
        const type = event.type;
        if (!this.listeners[type]) return;
        
        this.listeners[type] = this.listeners[type].filter(listener => {
            listener.callback(event);
            return !listener.once;
        });
    }
}
```

---

## Section 16: Browser APIs

### 16.1 localStorage vs sessionStorage vs Cookies

```javascript
// localStorage - Persists until explicitly cleared
localStorage.setItem('user', JSON.stringify({ name: 'John' }));
const user = JSON.parse(localStorage.getItem('user'));
localStorage.removeItem('user');
localStorage.clear(); // Clear all

// sessionStorage - Cleared when tab closes
sessionStorage.setItem('tempData', 'value');
sessionStorage.getItem('tempData');

// Storage event (fires in OTHER tabs/windows)
window.addEventListener('storage', (e) => {
    console.log('Key:', e.key);
    console.log('Old value:', e.oldValue);
    console.log('New value:', e.newValue);
    console.log('URL:', e.url);
});

// Cookies
document.cookie = 'name=John; expires=Fri, 31 Dec 2024 23:59:59 GMT; path=/';
document.cookie = 'session=abc123; secure; samesite=strict';

// Read cookies (returns all as single string)
console.log(document.cookie); // "name=John; session=abc123"

// Parse cookies
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) return decodeURIComponent(value);
    }
    return null;
}

// Delete cookie (set expired date)
document.cookie = 'name=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
```

**Comparison:**
| Feature | localStorage | sessionStorage | Cookies |
|---------|-------------|----------------|---------|
| Capacity | ~5-10MB | ~5-10MB | ~4KB |
| Expires | Never | Tab close | Configurable |
| Sent to server | No | No | Yes (every request) |
| Accessible from | Same origin | Same tab | Server & client |
| API | Simple | Simple | String-based |

### 16.2 Fetch API

```javascript
// Basic GET
const response = await fetch('/api/users');
const data = await response.json();

// POST with JSON
const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: 'John', email: 'john@example.com' })
});

// IMPORTANT: fetch doesn't reject on HTTP errors!
async function fetchWithErrorHandling(url, options) {
    const response = await fetch(url, options);
    
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return response.json();
}

// Full options
fetch(url, {
    method: 'POST',              // GET, POST, PUT, DELETE, etc.
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123'
    },
    body: JSON.stringify(data),  // Request body
    mode: 'cors',                // cors, no-cors, same-origin
    credentials: 'include',      // include, same-origin, omit
    cache: 'no-cache',           // default, no-cache, reload, force-cache
    redirect: 'follow',          // follow, error, manual
    signal: controller.signal    // AbortController signal
});

// Response methods
response.json();     // Parse as JSON
response.text();     // Parse as text
response.blob();     // Parse as Blob (binary)
response.formData(); // Parse as FormData
response.arrayBuffer(); // Parse as ArrayBuffer

// Response properties
response.ok;         // true if status 200-299
response.status;     // HTTP status code
response.statusText; // Status text
response.headers;    // Headers object
response.url;        // Final URL (after redirects)
```

### 16.3 AbortController

```javascript
// Cancel a fetch request
const controller = new AbortController();

fetch('/api/data', { signal: controller.signal })
    .then(response => response.json())
    .catch(err => {
        if (err.name === 'AbortError') {
            console.log('Request was cancelled');
        }
    });

// Cancel after timeout
setTimeout(() => controller.abort(), 5000);

// Cancel on user action
cancelButton.addEventListener('click', () => {
    controller.abort();
});

// Reusable timeout fetch
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        return response;
    } finally {
        clearTimeout(timeoutId);
    }
}

// Cancel multiple requests
const controller = new AbortController();

Promise.all([
    fetch('/api/1', { signal: controller.signal }),
    fetch('/api/2', { signal: controller.signal }),
    fetch('/api/3', { signal: controller.signal })
]).catch(err => {
    if (err.name === 'AbortError') {
        console.log('All requests cancelled');
    }
});

controller.abort(); // Cancels all three
```

### 16.4 Intersection Observer (Lazy Loading)

```javascript
// Observe when elements enter/exit viewport
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log('Element is visible:', entry.target);
            
            // Lazy load image
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            
            // Stop observing once loaded
            observer.unobserve(entry.target);
        }
    });
}, {
    root: null,           // Viewport (null = browser viewport)
    rootMargin: '50px',   // Margin around root
    threshold: 0.1        // 10% visible triggers callback
});

// Observe elements
document.querySelectorAll('img[data-src]').forEach(img => {
    observer.observe(img);
});

// Practical: Infinite scroll
const sentinel = document.getElementById('sentinel');

const infiniteScrollObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        loadMoreContent();
    }
}, { threshold: 1.0 });

infiniteScrollObserver.observe(sentinel);

// Practical: Animate on scroll
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    animationObserver.observe(el);
});
```

### 16.5 MutationObserver

```javascript
// Watch for DOM changes
const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        console.log('Type:', mutation.type);
        console.log('Target:', mutation.target);
        
        if (mutation.type === 'childList') {
            console.log('Added nodes:', mutation.addedNodes);
            console.log('Removed nodes:', mutation.removedNodes);
        }
        
        if (mutation.type === 'attributes') {
            console.log('Attribute:', mutation.attributeName);
            console.log('Old value:', mutation.oldValue);
        }
    });
});

// Start observing
observer.observe(document.body, {
    childList: true,      // Watch for added/removed children
    attributes: true,     // Watch for attribute changes
    characterData: true,  // Watch for text content changes
    subtree: true,        // Watch all descendants
    attributeOldValue: true,    // Record old attribute value
    characterDataOldValue: true, // Record old text value
    attributeFilter: ['class', 'style'] // Only these attributes
});

// Stop observing
observer.disconnect();

// Practical: React to dynamically added content
const adBlocker = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.nodeType === 1 && node.matches('.ad-banner')) {
                node.remove();
            }
        });
    });
});

adBlocker.observe(document.body, { childList: true, subtree: true });
```

### 16.6 ResizeObserver

```javascript
// Watch for element size changes
const observer = new ResizeObserver((entries) => {
    entries.forEach(entry => {
        const { width, height } = entry.contentRect;
        console.log(`Element resized to ${width}x${height}`);
        
        // Responsive behavior
        if (width < 600) {
            entry.target.classList.add('compact');
        } else {
            entry.target.classList.remove('compact');
        }
    });
});

observer.observe(document.querySelector('.resizable'));

// Practical: Chart resize
const chartContainer = document.getElementById('chart');
const resizeObserver = new ResizeObserver((entries) => {
    const { width, height } = entries[0].contentRect;
    chart.resize(width, height);
});
resizeObserver.observe(chartContainer);
```

### 16.7 requestAnimationFrame

```javascript
// Smooth animations at 60fps
let position = 0;
const element = document.getElementById('animated');

function animate() {
    position += 2;
    element.style.transform = `translateX(${position}px)`;
    
    if (position < 500) {
        requestAnimationFrame(animate);
    }
}

requestAnimationFrame(animate);

// Cancel animation
let animationId;

function startAnimation() {
    animationId = requestAnimationFrame(function animate() {
        // Animation logic
        animationId = requestAnimationFrame(animate);
    });
}

function stopAnimation() {
    cancelAnimationFrame(animationId);
}

// Throttle expensive operations to frame rate
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            // Expensive scroll handling
            updateParallax();
            ticking = false;
        });
        ticking = true;
    }
});

// Animation with timestamp
function animate(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    element.style.opacity = progress;
    
    if (progress < 1) {
        requestAnimationFrame(animate);
    }
}

const startTime = performance.now();
const duration = 1000;
requestAnimationFrame(animate);
```

### 16.8 Web Workers

```javascript
// Main thread (main.js)
const worker = new Worker('worker.js');

// Send message to worker
worker.postMessage({ type: 'calculate', data: [1, 2, 3, 4, 5] });

// Receive message from worker
worker.onmessage = (e) => {
    console.log('Result from worker:', e.data);
};

// Handle errors
worker.onerror = (e) => {
    console.error('Worker error:', e.message);
};

// Terminate worker
worker.terminate();

// Worker thread (worker.js)
self.onmessage = (e) => {
    const { type, data } = e.data;
    
    if (type === 'calculate') {
        // Heavy computation (doesn't block main thread)
        const result = data.reduce((sum, n) => {
            // Simulate heavy work
            for (let i = 0; i < 1000000; i++) {}
            return sum + n;
        }, 0);
        
        // Send result back
        self.postMessage(result);
    }
};

// Inline worker using Blob
const workerCode = `
    self.onmessage = function(e) {
        const result = e.data * 2;
        self.postMessage(result);
    };
`;

const blob = new Blob([workerCode], { type: 'application/javascript' });
const worker = new Worker(URL.createObjectURL(blob));
```

### 16.9 Performance API

```javascript
// Measure custom operations
performance.mark('start');

// ... code to measure ...

performance.mark('end');
performance.measure('myOperation', 'start', 'end');

const measure = performance.getEntriesByName('myOperation')[0];
console.log(`Operation took ${measure.duration}ms`);

// Navigation timing
const navTiming = performance.getEntriesByType('navigation')[0];
console.log('DNS lookup:', navTiming.domainLookupEnd - navTiming.domainLookupStart);
console.log('TCP connect:', navTiming.connectEnd - navTiming.connectStart);
console.log('Request time:', navTiming.responseStart - navTiming.requestStart);
console.log('Response time:', navTiming.responseEnd - navTiming.responseStart);
console.log('DOM processing:', navTiming.domComplete - navTiming.domInteractive);
console.log('Total load time:', navTiming.loadEventEnd - navTiming.navigationStart);

// Resource timing
const resources = performance.getEntriesByType('resource');
resources.forEach(resource => {
    console.log(`${resource.name}: ${resource.duration}ms`);
});

// Clear marks and measures
performance.clearMarks();
performance.clearMeasures();

// High-resolution timestamp
const start = performance.now();
// ... code ...
const end = performance.now();
console.log(`Execution time: ${end - start}ms`);
```

### 16.10 History API

```javascript
// Navigate without page reload (SPA)
history.pushState({ page: 'home' }, 'Home', '/home');
history.pushState({ page: 'about' }, 'About', '/about');

// Replace current entry (no new history entry)
history.replaceState({ page: 'updated' }, 'Updated', '/updated');

// Navigate back/forward
history.back();    // Go back
history.forward(); // Go forward
history.go(-2);    // Go back 2 pages
history.go(1);     // Go forward 1 page

// Listen for navigation (back/forward button)
window.addEventListener('popstate', (e) => {
    console.log('State:', e.state);
    // Update UI based on state
    if (e.state) {
        renderPage(e.state.page);
    }
});

// Get current state
console.log(history.state);
console.log(history.length);

// SPA Router implementation
class Router {
    constructor(routes) {
        this.routes = routes;
        window.addEventListener('popstate', () => this.handleRoute());
    }
    
    navigate(path) {
        history.pushState({ path }, '', path);
        this.handleRoute();
    }
    
    handleRoute() {
        const path = window.location.pathname;
        const route = this.routes[path] || this.routes['/404'];
        route();
    }
}

const router = new Router({
    '/': () => renderHome(),
    '/about': () => renderAbout(),
    '/404': () => render404()
});
```

### 16.11 URL and URLSearchParams

```javascript
// URL API
const url = new URL('https://example.com/path?name=John&age=30#section');

console.log(url.href);       // Full URL
console.log(url.protocol);   // 'https:'
console.log(url.host);       // 'example.com'
console.log(url.hostname);   // 'example.com'
console.log(url.port);       // ''
console.log(url.pathname);   // '/path'
console.log(url.search);     // '?name=John&age=30'
console.log(url.hash);       // '#section'
console.log(url.origin);     // 'https://example.com'

// Modify URL
url.pathname = '/new-path';
url.searchParams.set('city', 'NYC');
console.log(url.href);

// URLSearchParams
const params = new URLSearchParams('name=John&age=30');

params.get('name');        // 'John'
params.getAll('name');     // ['John']
params.has('age');         // true
params.set('age', '31');   // Update
params.append('tag', 'js'); // Add (can have multiple)
params.delete('age');      // Remove
params.toString();         // 'name=John&tag=js'

// Iterate
for (const [key, value] of params) {
    console.log(`${key}: ${value}`);
}

// From object
const paramsFromObj = new URLSearchParams({
    name: 'John',
    age: 30
});

// Get current page params
const currentParams = new URLSearchParams(window.location.search);
console.log(currentParams.get('id'));
```

---

# PART E: OUTPUT PREDICTION QUESTIONS (25+ Questions)

These questions are **interview favorites** - quick way to test fundamental understanding. Practice predicting output BEFORE reading the answer.

---

## Section 17: Hoisting Questions

### Question 17.1: var Hoisting
```javascript
console.log(a);
var a = 5;
console.log(a);
```

<details>
<summary>Answer</summary>

**Output:**
```
undefined
5
```

**Explanation:**
- `var` declarations are hoisted to top of scope
- Only declaration is hoisted, NOT the assignment
- Code is interpreted as:
```javascript
var a;           // Hoisted
console.log(a);  // undefined
a = 5;           // Assignment stays
console.log(a);  // 5
```
</details>

---

### Question 17.2: Function Declaration vs Expression
```javascript
console.log(foo);
console.log(bar);

function foo() { return 'foo'; }
var bar = function() { return 'bar'; };
```

<details>
<summary>Answer</summary>

**Output:**
```
[Function: foo]
undefined
```

**Explanation:**
- Function declarations are **fully hoisted** (entire function)
- Function expressions follow `var` hoisting rules (only variable name hoisted as `undefined`)
- `foo` is the complete function, `bar` is `undefined` because only `var bar` is hoisted
</details>

---

### Question 17.3: let/const TDZ
```javascript
console.log(a);
let a = 10;
```

<details>
<summary>Answer</summary>

**Output:**
```
ReferenceError: Cannot access 'a' before initialization
```

**Explanation:**
- `let` and `const` ARE hoisted, but they're in the **Temporal Dead Zone (TDZ)**
- TDZ exists from the start of the block until the declaration
- Accessing a variable in TDZ throws ReferenceError
</details>

---

### Question 17.4: Function vs Variable with Same Name
```javascript
var foo = 'bar';

function foo() {
    return 'function';
}

console.log(typeof foo);
```

<details>
<summary>Answer</summary>

**Output:**
```
string
```

**Explanation:**
- During hoisting: function `foo` is hoisted first, then `var foo` (ignored since name exists)
- During execution: `foo = 'bar'` overwrites the function
- Step by step:
  1. Hoisting: `function foo` is hoisted
  2. Hoisting: `var foo` is ignored (name already exists)
  3. Execution: `foo = 'bar'` overwrites
  4. Result: `foo` is a string
</details>

---

### Question 17.5: Hoisting in Block Scope
```javascript
var x = 1;

function test() {
    console.log(x);
    var x = 2;
    console.log(x);
}

test();
console.log(x);
```

<details>
<summary>Answer</summary>

**Output:**
```
undefined
2
1
```

**Explanation:**
- Inside `test()`, `var x` is hoisted to top of function scope
- The local `x` shadows the global `x` throughout the function
- Global `x` remains unchanged
```javascript
function test() {
    var x;           // Hoisted to function top
    console.log(x);  // undefined (local x)
    x = 2;
    console.log(x);  // 2
}
```
</details>

---

## Section 18: Closure Questions

### Question 18.1: Classic setTimeout Loop
```javascript
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i);
    }, 100);
}
```

<details>
<summary>Answer</summary>

**Output:**
```
3
3
3
```

**Explanation:**
- `var` is function-scoped, so there's only ONE `i` variable
- By the time callbacks execute (after 100ms), the loop has finished
- Loop ends when `i = 3`, so all callbacks log `3`
- All three closures reference the SAME `i`

**Fix with `let`:**
```javascript
for (let i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 100);
}
// Output: 0, 1, 2
// let creates new binding for each iteration
```
</details>

---

### Question 18.2: Closure Retaining Value
```javascript
function outer() {
    var x = 10;
    return function inner() {
        console.log(x);
    };
}

var x = 20;
var innerFn = outer();
innerFn();
```

<details>
<summary>Answer</summary>

**Output:**
```
10
```

**Explanation:**
- Closures remember their **lexical scope** (where they were defined)
- `inner` was defined inside `outer`, where `x = 10`
- The global `x = 20` is irrelevant - closure captures the local `x`
- This is lexical (static) scoping, not dynamic scoping
</details>

---

### Question 18.3: Multiple Closures
```javascript
function createCounter() {
    let count = 0;
    return {
        increment: function() { count++; },
        getCount: function() { return count; }
    };
}

const counter1 = createCounter();
const counter2 = createCounter();

counter1.increment();
counter1.increment();
counter2.increment();

console.log(counter1.getCount());
console.log(counter2.getCount());
```

<details>
<summary>Answer</summary>

**Output:**
```
2
1
```

**Explanation:**
- Each call to `createCounter()` creates a NEW `count` variable
- `counter1` and `counter2` have their own separate `count`
- They don't share state - each closure has its own environment
</details>

---

### Question 18.4: Closure with Loop and IIFE
```javascript
for (var i = 0; i < 3; i++) {
    (function(j) {
        setTimeout(function() {
            console.log(j);
        }, 100);
    })(i);
}
```

<details>
<summary>Answer</summary>

**Output:**
```
0
1
2
```

**Explanation:**
- IIFE creates a new scope for each iteration
- Parameter `j` captures the current value of `i`
- Each callback closes over its own `j` (0, 1, 2)
- This is the classic fix for the `var` loop problem before `let` existed
</details>

---

### Question 18.5: Closure Modifying Outer Variable
```javascript
function outer() {
    let x = 1;
    
    function inner() {
        x++;
        console.log(x);
    }
    
    inner();
    inner();
    console.log(x);
}

outer();
```

<details>
<summary>Answer</summary>

**Output:**
```
2
3
3
```

**Explanation:**
- `inner` has access to `x` in outer's scope via closure
- Each call to `inner()` modifies the SAME `x`
- First `inner()`: x becomes 2, logs 2
- Second `inner()`: x becomes 3, logs 3
- Final `console.log(x)`: logs 3
</details>

---

## Section 19: `this` Keyword Questions

### Question 19.1: Method Called as Function
```javascript
const obj = {
    name: 'Object',
    getName: function() {
        return this.name;
    }
};

const getName = obj.getName;
console.log(getName());
```

<details>
<summary>Answer</summary>

**Output:**
```
undefined
```
(or `""` in browser if `window.name` is empty string)

**Explanation:**
- When `getName` is assigned to a variable and called, it loses its `this` context
- Called as a standalone function → default binding → `this` is global/undefined
- `this.name` is `undefined` (strict mode) or `window.name` (non-strict)
</details>

---

### Question 19.2: Arrow Function this
```javascript
const obj = {
    name: 'Object',
    regularFunc: function() {
        console.log('Regular:', this.name);
    },
    arrowFunc: () => {
        console.log('Arrow:', this.name);
    }
};

obj.regularFunc();
obj.arrowFunc();
```

<details>
<summary>Answer</summary>

**Output:**
```
Regular: Object
Arrow: undefined
```

**Explanation:**
- Regular function: `this` is determined by how it's called (implicit binding → `obj`)
- Arrow function: `this` is lexical, inherited from where it's **defined**
- Arrow is defined at the object literal level, where `this` is global/undefined
- Arrow functions should NOT be used as object methods when you need `this`
</details>

---

### Question 19.3: Nested Function this
```javascript
const obj = {
    name: 'Object',
    method: function() {
        console.log('Method:', this.name);
        
        function nested() {
            console.log('Nested:', this.name);
        }
        nested();
    }
};

obj.method();
```

<details>
<summary>Answer</summary>

**Output:**
```
Method: Object
Nested: undefined
```

**Explanation:**
- `method()` is called on `obj` → `this` is `obj`
- `nested()` is called as a standalone function → default binding
- Nested function doesn't inherit `this` from outer function
- Fix: Use arrow function, `bind()`, or `const self = this`
</details>

---

### Question 19.4: Explicit Binding
```javascript
function greet() {
    console.log(this.name);
}

const person1 = { name: 'John' };
const person2 = { name: 'Jane' };

greet.call(person1);
greet.apply(person2);

const boundGreet = greet.bind(person1);
boundGreet.call(person2);
```

<details>
<summary>Answer</summary>

**Output:**
```
John
Jane
John
```

**Explanation:**
- `call(person1)`: explicitly sets `this` to `person1` → "John"
- `apply(person2)`: explicitly sets `this` to `person2` → "Jane"
- `bind(person1)` creates new function with `this` permanently bound to `person1`
- `boundGreet.call(person2)`: `call` cannot override `bind` → still "John"
</details>

---

### Question 19.5: Constructor this
```javascript
function Person(name) {
    this.name = name;
    return { name: 'Returned Object' };
}

const p1 = new Person('John');
console.log(p1.name);

function Animal(name) {
    this.name = name;
    return 'Just a string';
}

const a1 = new Animal('Dog');
console.log(a1.name);
```

<details>
<summary>Answer</summary>

**Output:**
```
Returned Object
Dog
```

**Explanation:**
- `new` creates new object and sets `this` to it
- If constructor returns an **object**, that object is used instead
- If constructor returns a **primitive**, it's ignored and `this` is returned
- `Person` returns an object → that object is used
- `Animal` returns a string (primitive) → ignored, `this` is returned
</details>

---

## Section 20: Event Loop Questions

### Question 20.1: Basic Async Order
```javascript
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');
```

<details>
<summary>Answer</summary>

**Output:**
```
1
4
3
2
```

**Explanation:**
- Sync code runs first: `1`, `4`
- Microtasks (Promise) before macrotasks (setTimeout)
- Order: Sync → Microtasks → Macrotasks

Timeline:
1. Log '1' (sync)
2. setTimeout callback → macrotask queue
3. Promise.then callback → microtask queue
4. Log '4' (sync)
5. Call stack empty → process microtasks → Log '3'
6. Process macrotasks → Log '2'
</details>

---

### Question 20.2: Nested Promises
```javascript
console.log('start');

Promise.resolve()
    .then(() => {
        console.log('promise1');
        return Promise.resolve();
    })
    .then(() => {
        console.log('promise2');
    });

Promise.resolve()
    .then(() => {
        console.log('promise3');
    })
    .then(() => {
        console.log('promise4');
    });

console.log('end');
```

<details>
<summary>Answer</summary>

**Output:**
```
start
end
promise1
promise3
promise4
promise2
```

**Explanation:**
- Sync: 'start', 'end'
- First tick microtasks: 'promise1', 'promise3'
- 'promise1' returns a Promise, which adds extra tick before 'promise2' resolves
- 'promise4' runs before 'promise2' because of that extra tick
- Returning a Promise in `.then()` adds delay!
</details>

---

### Question 20.3: Promise Constructor is Sync
```javascript
console.log('1');

new Promise((resolve) => {
    console.log('2');
    resolve();
    console.log('3');
}).then(() => {
    console.log('4');
});

console.log('5');
```

<details>
<summary>Answer</summary>

**Output:**
```
1
2
3
5
4
```

**Explanation:**
- Promise executor (callback in `new Promise()`) runs **synchronously**
- Only `.then()` callback is asynchronous (microtask)
- `resolve()` doesn't stop execution - code after it still runs
- Order: 1 → 2 → 3 → 5 (all sync) → 4 (microtask)
</details>

---

### Question 20.4: async/await Order
```javascript
async function foo() {
    console.log('foo start');
    await bar();
    console.log('foo end');
}

async function bar() {
    console.log('bar');
}

console.log('script start');
foo();
console.log('script end');
```

<details>
<summary>Answer</summary>

**Output:**
```
script start
foo start
bar
script end
foo end
```

**Explanation:**
- 'script start' (sync)
- `foo()` is called
- 'foo start' (sync - before await)
- `await bar()` - 'bar' is logged (sync part of bar)
- `await` pauses `foo`, rest becomes microtask
- 'script end' (sync)
- Microtask: 'foo end'

**Key insight:** Code BEFORE `await` in async function is synchronous!
</details>

---

### Question 20.5: setTimeout vs Promise with 0 delay
```javascript
setTimeout(() => console.log('timeout1'), 0);
setTimeout(() => console.log('timeout2'), 0);

Promise.resolve().then(() => {
    console.log('promise1');
    setTimeout(() => console.log('timeout3'), 0);
});

Promise.resolve().then(() => console.log('promise2'));
```

<details>
<summary>Answer</summary>

**Output:**
```
promise1
promise2
timeout1
timeout2
timeout3
```

**Explanation:**
- All sync code runs first (none here except scheduling)
- Process ALL microtasks: 'promise1', 'promise2'
- 'promise1' schedules 'timeout3' (added to macrotask queue)
- Process ONE macrotask: 'timeout1'
- Check microtasks (none)
- Process ONE macrotask: 'timeout2'
- Check microtasks (none)
- Process ONE macrotask: 'timeout3'
</details>

---

## Section 21: Prototype Questions

### Question 21.1: Property Shadowing
```javascript
function Animal(name) {
    this.name = name;
}
Animal.prototype.name = 'Default';
Animal.prototype.speak = function() {
    return this.name;
};

const dog = new Animal('Buddy');
const cat = new Animal();

console.log(dog.speak());
console.log(cat.speak());
console.log(dog.hasOwnProperty('name'));
console.log(cat.hasOwnProperty('name'));
```

<details>
<summary>Answer</summary>

**Output:**
```
Buddy
undefined
true
true
```

**Explanation:**
- `dog.name = 'Buddy'` (own property, shadows prototype)
- `cat.name = undefined` (own property! assigned in constructor)
- Both have own `name` property, even `cat` (assigned `undefined`)
- `cat.speak()` returns `undefined`, not 'Default', because own property takes precedence
- If we did `const cat = Object.create(Animal.prototype)`, it would return 'Default'
</details>

---

### Question 21.2: Prototype Chain
```javascript
function A() {}
A.prototype.x = 1;

function B() {}
B.prototype = Object.create(A.prototype);
B.prototype.y = 2;

const obj = new B();
console.log(obj.x);
console.log(obj.y);
console.log(obj.hasOwnProperty('x'));
console.log(obj.hasOwnProperty('y'));
```

<details>
<summary>Answer</summary>

**Output:**
```
1
2
false
false
```

**Explanation:**
- `obj` has no own properties
- `obj.x` is found on `A.prototype` (through prototype chain)
- `obj.y` is found on `B.prototype`
- Prototype chain: `obj → B.prototype → A.prototype → Object.prototype → null`
- `hasOwnProperty` returns false because both are inherited
</details>

---

### Question 21.3: instanceof
```javascript
function Animal() {}
function Dog() {}

Dog.prototype = Object.create(Animal.prototype);

const dog = new Dog();

console.log(dog instanceof Dog);
console.log(dog instanceof Animal);
console.log(dog instanceof Object);

Dog.prototype = {};

console.log(dog instanceof Dog);
console.log(dog instanceof Animal);
```

<details>
<summary>Answer</summary>

**Output:**
```
true
true
true
false
true
```

**Explanation:**
- `instanceof` checks if constructor's `prototype` is in object's prototype chain
- Initially: `dog.__proto__ === Dog.prototype` (which links to Animal.prototype)
- After reassigning `Dog.prototype = {}`:
  - `dog`'s internal prototype chain is unchanged
  - `Dog.prototype` now points to different object
  - `dog.__proto__` no longer matches `Dog.prototype` → `false`
  - `Animal.prototype` is still in `dog`'s chain → `true`
</details>

---

## Section 22: Tricky Edge Cases

### Question 22.1: Type Coercion
```javascript
console.log([] + []);
console.log([] + {});
console.log({} + []);
console.log(1 + '2' + 3);
console.log(1 + 2 + '3');
```

<details>
<summary>Answer</summary>

**Output:**
```
""
"[object Object]"
"[object Object]"   (or 0 if {} is parsed as block)
"123"
"33"
```

**Explanation:**
- `[] + []`: Both convert to "" → "" + "" = ""
- `[] + {}`: "" + "[object Object]" = "[object Object]"
- `{} + []`: In some contexts, `{}` is a block, `+[]` = 0. In expression context: "[object Object]"
- `1 + '2' + 3`: Left to right → "12" + 3 = "123"
- `1 + 2 + '3'`: Left to right → 3 + '3' = "33"
</details>

---

### Question 22.2: Equality Comparisons
```javascript
console.log(null == undefined);
console.log(null === undefined);
console.log(NaN === NaN);
console.log([] == false);
console.log([] == ![]);
```

<details>
<summary>Answer</summary>

**Output:**
```
true
false
false
true
true
```

**Explanation:**
- `null == undefined`: Special rule, they're only `==` to each other
- `null === undefined`: Different types → false
- `NaN === NaN`: NaN is never equal to anything, including itself!
- `[] == false`: [] → "" → 0, false → 0, 0 == 0 → true
- `[] == ![]`: ![] = false, [] == false → true (same as above)
</details>

---

### Question 22.3: Object as Key
```javascript
const a = {};
const b = { key: 'b' };
const c = { key: 'c' };

a[b] = 123;
a[c] = 456;

console.log(a[b]);
console.log(a);
```

<details>
<summary>Answer</summary>

**Output:**
```
456
{ '[object Object]': 456 }
```

**Explanation:**
- Object keys must be strings (or Symbols)
- `b` and `c` are both converted to string: `"[object Object]"`
- Both `a[b]` and `a[c]` use the SAME key
- `a[c] = 456` overwrites `a[b] = 123`
- Use `Map` if you need objects as keys!
</details>

---

### Question 22.4: typeof and Arrays
```javascript
console.log(typeof []);
console.log(typeof null);
console.log(typeof function(){});
console.log(Array.isArray([]));
console.log([] instanceof Array);
console.log([] instanceof Object);
```

<details>
<summary>Answer</summary>

**Output:**
```
object
object
function
true
true
true
```

**Explanation:**
- `typeof []`: Arrays are objects → "object"
- `typeof null`: Famous JS bug → "object" (should be "null")
- `typeof function(){}`: Functions get special treatment → "function"
- `Array.isArray([])`: Correct way to check for arrays
- `[] instanceof Array`: true
- `[] instanceof Object`: true (Arrays inherit from Object)
</details>

---

### Question 22.5: Default Parameters and TDZ
```javascript
function example(a = b, b = 2) {
    console.log(a, b);
}

example();
```

<details>
<summary>Answer</summary>

**Output:**
```
ReferenceError: Cannot access 'b' before initialization
```

**Explanation:**
- Default parameters are evaluated left to right
- When evaluating `a = b`, `b` hasn't been initialized yet
- Parameters have their own TDZ!
- Fix: `function example(b = 2, a = b)` works fine
</details>

---

### Question 22.6: parseInt Gotchas
```javascript
console.log(parseInt('123'));
console.log(parseInt('123abc'));
console.log(parseInt('abc123'));
console.log(parseInt('0.5'));
console.log(parseInt(0.0000005));
```

<details>
<summary>Answer</summary>

**Output:**
```
123
123
NaN
0
5
```

**Explanation:**
- `parseInt('123')`: Normal parsing → 123
- `parseInt('123abc')`: Parses until non-digit → 123
- `parseInt('abc123')`: Starts with non-digit → NaN
- `parseInt('0.5')`: Parses until `.` → 0
- `parseInt(0.0000005)`: Number converts to "5e-7", parses "5" → 5!

**Lesson:** Always use `Number()` or `parseFloat()` for decimals!
</details>

---

### Question 22.7: Spread vs Object.assign
```javascript
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { ...obj1 };
const obj3 = Object.assign({}, obj1);

obj2.a = 10;
obj2.b.c = 20;

console.log(obj1.a);
console.log(obj1.b.c);
console.log(obj3.b.c);
```

<details>
<summary>Answer</summary>

**Output:**
```
1
20
20
```

**Explanation:**
- Both spread and `Object.assign` do **shallow** copy
- Primitives (`a`) are copied by value → changing `obj2.a` doesn't affect `obj1.a`
- Objects (`b`) are copied by reference → all three point to SAME `{ c: 2 }`
- Changing `obj2.b.c` affects `obj1.b.c` AND `obj3.b.c`
- Use deep clone if you need independent nested objects
</details>

---

### Question 22.8: Arguments Object
```javascript
function example(a, b) {
    console.log(arguments.length);
    arguments[0] = 10;
    console.log(a);
}

example(1, 2, 3);
```

<details>
<summary>Answer</summary>

**Output:**
```
3
10
```

**Explanation:**
- `arguments` is array-like object with all passed arguments
- `arguments.length` is 3 (3 arguments passed)
- In non-strict mode, `arguments` and named parameters are linked
- Changing `arguments[0]` also changes `a`
- In strict mode, they would be separate!
</details>

---

### Question 22.9: Comma Operator
```javascript
const x = (1, 2, 3);
console.log(x);

const y = (console.log('a'), console.log('b'), 'result');
console.log(y);
```

<details>
<summary>Answer</summary>

**Output:**
```
3
a
b
result
```

**Explanation:**
- Comma operator evaluates left to right, returns the LAST value
- `(1, 2, 3)` → evaluates 1, 2, 3, returns 3
- Second example: logs 'a', logs 'b', returns 'result'
- Rarely used, but appears in minified code
</details>

---

### Question 22.10: Short-circuit Evaluation
```javascript
console.log(0 && 'hello');
console.log(1 && 'hello');
console.log('' || 'default');
console.log('value' || 'default');
console.log(null ?? 'default');
console.log(0 ?? 'default');
```

<details>
<summary>Answer</summary>

**Output:**
```
0
hello
default
value
default
0
```

**Explanation:**
- `&&` returns first falsy value OR last value if all truthy
- `||` returns first truthy value OR last value if all falsy
- `??` returns right side only if left is `null` or `undefined`
- `0 && 'hello'`: 0 is falsy → returns 0
- `0 ?? 'default'`: 0 is NOT null/undefined → returns 0
</details>

---

## Section 23: Bonus Quick-Fire Questions

### Q23.1
```javascript
console.log(3 > 2 > 1);
```
<details><summary>Answer</summary>

`false` — `(3 > 2)` is `true`, then `true > 1` → `1 > 1` → `false`
</details>

### Q23.2
```javascript
console.log(typeof typeof 1);
```
<details><summary>Answer</summary>

`"string"` — `typeof 1` is `"number"`, `typeof "number"` is `"string"`
</details>

### Q23.3
```javascript
console.log(0.1 + 0.2 === 0.3);
```
<details><summary>Answer</summary>

`false` — Floating point precision: `0.1 + 0.2 = 0.30000000000000004`
</details>

### Q23.4
```javascript
console.log(!!'');
console.log(!!'false');
```
<details><summary>Answer</summary>

`false`, `true` — Empty string is falsy, non-empty string is truthy (even "false")
</details>

### Q23.5
```javascript
console.log([1, 2] + [3, 4]);
```
<details><summary>Answer</summary>

`"1,23,4"` — Arrays convert to strings: "1,2" + "3,4" = "1,23,4"
</details>

### Q23.6
```javascript
console.log(+'123');
console.log(+true);
console.log(+[]);
console.log(+{});
```
<details><summary>Answer</summary>

`123`, `1`, `0`, `NaN` — Unary `+` converts to number
</details>

### Q23.7
```javascript
const arr = [1, 2, 3];
arr[10] = 10;
console.log(arr.length);
console.log(arr[5]);
```
<details><summary>Answer</summary>

`11`, `undefined` — Sparse array, length is highest index + 1
</details>

### Q23.8
```javascript
console.log([] == ![]);
console.log({} == !{});
```
<details><summary>Answer</summary>

`true`, `false`
- `[] == ![]`: `[] == false` → `0 == 0` → `true`
- `{} == !{}`: `{} == false` → `"[object Object]" == 0` → `NaN == 0` → `false`
</details>

---

# PART F: CODING PATTERNS FOR LIVE INTERVIEWS

---

## Section 24: Problem-Solving Approach

### 24.1 The UMPIRE Method

When given a coding problem, follow this structured approach:

```
U - Understand the problem
M - Match with known patterns
P - Plan your approach
I - Implement the solution
R - Review your code
E - Evaluate complexity
```

### 24.2 Understanding the Problem (First 2-3 Minutes)

**Ask clarifying questions:**

```javascript
// Example problem: "Find duplicates in an array"

// Questions to ask:
// 1. Input clarification
"What type of elements? Numbers, strings, objects?"
"Can the array be empty? What should I return then?"
"Are there negative numbers? Floating points?"
"What's the expected size? (helps choose algorithm)"

// 2. Output clarification
"Return the duplicate values, or their indices?"
"If a value appears 3 times, include it once or twice?"
"Should the result be sorted?"
"Return array, set, or count?"

// 3. Edge cases
"What if there are no duplicates?"
"What about null/undefined values?"

// 4. Constraints
"Can I modify the original array?"
"Any memory constraints? (in-place required?)"
"Time complexity requirements?"
```

### 24.3 Think Out Loud

**Narrate your thought process:**

```javascript
// Example: Finding two numbers that sum to target

"Let me think about this...

My first thought is brute force - check every pair.
That would be O(n²) which might be too slow for large arrays.

I could sort first, then use two pointers...
That's O(n log n) for sorting plus O(n) for finding.

Or I could use a hash map to store complements...
One pass through the array, O(n) time and O(n) space.

The hash map approach seems optimal. Let me implement that.

I'll iterate through the array...
For each number, I check if (target - num) exists in my map...
If yes, I found my pair. If no, I add current num to the map."

// Then implement:
function twoSum(nums, target) {
    const seen = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (seen.has(complement)) {
            return [seen.get(complement), i];
        }
        
        seen.set(nums[i], i);
    }
    
    return []; // No solution found
}
```

### 24.4 Handle Edge Cases

**Always consider and handle:**

```javascript
function safeFunction(arr, target) {
    // 1. Null/undefined inputs
    if (!arr || !Array.isArray(arr)) {
        return null; // or throw Error
    }
    
    // 2. Empty array
    if (arr.length === 0) {
        return [];
    }
    
    // 3. Single element
    if (arr.length === 1) {
        return arr[0] === target ? [0] : [];
    }
    
    // 4. Invalid target
    if (typeof target !== 'number' || Number.isNaN(target)) {
        throw new Error('Invalid target');
    }
    
    // Main logic...
}

// Common edge cases checklist:
// - Empty input ([], "", null, undefined)
// - Single element
// - All same elements
// - Already sorted / reverse sorted
// - Negative numbers
// - Duplicates
// - Very large numbers (overflow)
// - Special values (0, -1, Infinity, NaN)
```

### 24.5 Discuss Time and Space Complexity

```javascript
// Always analyze after implementation:

function findDuplicate(nums) {
    const seen = new Set();        // Space: O(n) worst case
    
    for (const num of nums) {      // Time: O(n) - single pass
        if (seen.has(num)) {       // O(1) lookup
            return num;
        }
        seen.add(num);             // O(1) insertion
    }
    
    return -1;
}

// "The time complexity is O(n) where n is the array length.
//  We iterate through the array once, and Set operations are O(1).
//  
//  The space complexity is O(n) in the worst case,
//  where we might store almost all elements before finding a duplicate.
//  Best case is O(1) if we find duplicate at the start."
```

### 24.6 Optimize Iteratively

```javascript
// Start with brute force, then optimize

// Version 1: Brute Force - O(n²)
function hasDuplicate_v1(nums) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] === nums[j]) return true;
        }
    }
    return false;
}

// Version 2: Sort first - O(n log n)
function hasDuplicate_v2(nums) {
    nums.sort((a, b) => a - b);
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] === nums[i - 1]) return true;
    }
    return false;
}

// Version 3: Hash Set - O(n) time, O(n) space
function hasDuplicate_v3(nums) {
    const seen = new Set();
    for (const num of nums) {
        if (seen.has(num)) return true;
        seen.add(num);
    }
    return false;
}

// Version 4: One-liner (same complexity as v3)
function hasDuplicate_v4(nums) {
    return new Set(nums).size !== nums.length;
}

// Discuss tradeoffs:
// "v3 is optimal for time but uses extra space.
//  v2 is good if we can modify the array and want O(1) space.
//  v4 is cleanest but always processes all elements."
```

### 24.7 When You're Stuck

```javascript
// 1. Start with a simple example
"Let me trace through with [1, 2, 3, 2]..."

// 2. Try brute force first
"What's the simplest solution, even if it's slow?"

// 3. Look for patterns
"Is there a pattern I can exploit?"
"Does sorting help?"
"Can I use extra space to speed things up?"

// 4. Break into smaller problems
"Can I solve a simpler version first?"
"What if the array was sorted?"

// 5. Work backwards
"If I had the answer, how did I get there?"

// 6. Ask for a hint (it's okay!)
"I'm considering using a hash map here, does that sound reasonable?"
```

---

## Section 25: Common Interview Patterns

### 25.1 Two Pointers

```javascript
// Pattern: Use two pointers moving towards each other or in same direction

// Example 1: Two Sum in Sorted Array
function twoSumSorted(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        const sum = nums[left] + nums[right];
        
        if (sum === target) {
            return [left, right];
        } else if (sum < target) {
            left++;  // Need larger sum
        } else {
            right--; // Need smaller sum
        }
    }
    
    return [-1, -1];
}

// Example 2: Remove Duplicates in Place
function removeDuplicates(nums) {
    if (nums.length === 0) return 0;
    
    let writePointer = 1;
    
    for (let readPointer = 1; readPointer < nums.length; readPointer++) {
        if (nums[readPointer] !== nums[readPointer - 1]) {
            nums[writePointer] = nums[readPointer];
            writePointer++;
        }
    }
    
    return writePointer;
}

// Example 3: Container With Most Water
function maxArea(heights) {
    let left = 0;
    let right = heights.length - 1;
    let maxWater = 0;
    
    while (left < right) {
        const width = right - left;
        const height = Math.min(heights[left], heights[right]);
        maxWater = Math.max(maxWater, width * height);
        
        // Move the shorter line
        if (heights[left] < heights[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
}

// Example 4: Is Palindrome
function isPalindrome(s) {
    // Remove non-alphanumeric and lowercase
    s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        if (s[left] !== s[right]) {
            return false;
        }
        left++;
        right--;
    }
    
    return true;
}
```

### 25.2 Sliding Window

```javascript
// Pattern: Maintain a window that slides through the array

// Example 1: Maximum Sum Subarray of Size K
function maxSumSubarray(nums, k) {
    if (nums.length < k) return null;
    
    // Calculate sum of first window
    let windowSum = 0;
    for (let i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    
    let maxSum = windowSum;
    
    // Slide the window
    for (let i = k; i < nums.length; i++) {
        windowSum += nums[i] - nums[i - k]; // Add new, remove old
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}

// Example 2: Longest Substring Without Repeating Characters
function lengthOfLongestSubstring(s) {
    const seen = new Map(); // char -> last index
    let maxLength = 0;
    let start = 0;
    
    for (let end = 0; end < s.length; end++) {
        const char = s[end];
        
        // If char seen and within current window, shrink window
        if (seen.has(char) && seen.get(char) >= start) {
            start = seen.get(char) + 1;
        }
        
        seen.set(char, end);
        maxLength = Math.max(maxLength, end - start + 1);
    }
    
    return maxLength;
}

// Example 3: Minimum Window Substring
function minWindow(s, t) {
    if (s.length < t.length) return '';
    
    // Count required characters
    const required = new Map();
    for (const char of t) {
        required.set(char, (required.get(char) || 0) + 1);
    }
    
    let left = 0;
    let minLen = Infinity;
    let minStart = 0;
    let matched = 0;
    const window = new Map();
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        window.set(char, (window.get(char) || 0) + 1);
        
        // Check if this char satisfies requirement
        if (required.has(char) && window.get(char) === required.get(char)) {
            matched++;
        }
        
        // Try to shrink window
        while (matched === required.size) {
            if (right - left + 1 < minLen) {
                minLen = right - left + 1;
                minStart = left;
            }
            
            const leftChar = s[left];
            window.set(leftChar, window.get(leftChar) - 1);
            
            if (required.has(leftChar) && window.get(leftChar) < required.get(leftChar)) {
                matched--;
            }
            
            left++;
        }
    }
    
    return minLen === Infinity ? '' : s.substring(minStart, minStart + minLen);
}
```

### 25.3 Hash Map / Frequency Counter

```javascript
// Pattern: Use hash map to count occurrences or store lookups

// Example 1: Two Sum (classic)
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    
    return [];
}

// Example 2: Group Anagrams
function groupAnagrams(strs) {
    const map = new Map();
    
    for (const str of strs) {
        // Create key by sorting characters
        const key = str.split('').sort().join('');
        
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key).push(str);
    }
    
    return Array.from(map.values());
}

// Example 3: First Non-Repeating Character
function firstUniqChar(s) {
    const count = new Map();
    
    // Count occurrences
    for (const char of s) {
        count.set(char, (count.get(char) || 0) + 1);
    }
    
    // Find first with count 1
    for (let i = 0; i < s.length; i++) {
        if (count.get(s[i]) === 1) {
            return i;
        }
    }
    
    return -1;
}

// Example 4: Valid Anagram
function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    
    const count = new Map();
    
    for (const char of s) {
        count.set(char, (count.get(char) || 0) + 1);
    }
    
    for (const char of t) {
        if (!count.has(char) || count.get(char) === 0) {
            return false;
        }
        count.set(char, count.get(char) - 1);
    }
    
    return true;
}

// Example 5: Subarray Sum Equals K
function subarraySum(nums, k) {
    const prefixSumCount = new Map([[0, 1]]); // sum -> count
    let currentSum = 0;
    let count = 0;
    
    for (const num of nums) {
        currentSum += num;
        
        // If (currentSum - k) exists, we found subarrays
        if (prefixSumCount.has(currentSum - k)) {
            count += prefixSumCount.get(currentSum - k);
        }
        
        prefixSumCount.set(currentSum, (prefixSumCount.get(currentSum) || 0) + 1);
    }
    
    return count;
}
```

### 25.4 Recursion with Memoization

```javascript
// Pattern: Recursion + cache for overlapping subproblems

// Example 1: Fibonacci
function fib(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 1) return n;
    
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
    return memo[n];
}

// Example 2: Climbing Stairs
function climbStairs(n, memo = {}) {
    if (n in memo) return memo[n];
    if (n <= 2) return n;
    
    memo[n] = climbStairs(n - 1, memo) + climbStairs(n - 2, memo);
    return memo[n];
}

// Example 3: Coin Change
function coinChange(coins, amount, memo = {}) {
    if (amount in memo) return memo[amount];
    if (amount === 0) return 0;
    if (amount < 0) return -1;
    
    let minCoins = Infinity;
    
    for (const coin of coins) {
        const result = coinChange(coins, amount - coin, memo);
        if (result >= 0) {
            minCoins = Math.min(minCoins, result + 1);
        }
    }
    
    memo[amount] = minCoins === Infinity ? -1 : minCoins;
    return memo[amount];
}

// Example 4: Longest Common Subsequence
function longestCommonSubsequence(text1, text2) {
    const memo = new Map();
    
    function lcs(i, j) {
        if (i >= text1.length || j >= text2.length) return 0;
        
        const key = `${i},${j}`;
        if (memo.has(key)) return memo.get(key);
        
        let result;
        if (text1[i] === text2[j]) {
            result = 1 + lcs(i + 1, j + 1);
        } else {
            result = Math.max(lcs(i + 1, j), lcs(i, j + 1));
        }
        
        memo.set(key, result);
        return result;
    }
    
    return lcs(0, 0);
}

// Convert to Bottom-Up DP:
function longestCommonSubsequenceDP(text1, text2) {
    const m = text1.length, n = text2.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = m - 1; i >= 0; i--) {
        for (let j = n - 1; j >= 0; j--) {
            if (text1[i] === text2[j]) {
                dp[i][j] = 1 + dp[i + 1][j + 1];
            } else {
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
            }
        }
    }
    
    return dp[0][0];
}
```

### 25.5 Tree Traversal (DFS & BFS)

```javascript
// DFS Traversals
function preorder(root, result = []) {
    if (!root) return result;
    result.push(root.val);       // Visit
    preorder(root.left, result);  // Left
    preorder(root.right, result); // Right
    return result;
}

function inorder(root, result = []) {
    if (!root) return result;
    inorder(root.left, result);   // Left
    result.push(root.val);        // Visit
    inorder(root.right, result);  // Right
    return result;
}

function postorder(root, result = []) {
    if (!root) return result;
    postorder(root.left, result);  // Left
    postorder(root.right, result); // Right
    result.push(root.val);         // Visit
    return result;
}

// BFS (Level Order)
function levelOrder(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}

// Example: Maximum Depth of Binary Tree
function maxDepth(root) {
    if (!root) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// Example: Validate BST
function isValidBST(root, min = -Infinity, max = Infinity) {
    if (!root) return true;
    
    if (root.val <= min || root.val >= max) {
        return false;
    }
    
    return isValidBST(root.left, min, root.val) && 
           isValidBST(root.right, root.val, max);
}

// Example: Invert Binary Tree
function invertTree(root) {
    if (!root) return null;
    
    [root.left, root.right] = [root.right, root.left];
    invertTree(root.left);
    invertTree(root.right);
    
    return root;
}
```

### 25.6 Backtracking

```javascript
// Pattern: Try all possibilities, backtrack when invalid

// Example 1: Permutations
function permute(nums) {
    const result = [];
    
    function backtrack(current, remaining) {
        if (remaining.length === 0) {
            result.push([...current]);
            return;
        }
        
        for (let i = 0; i < remaining.length; i++) {
            current.push(remaining[i]);
            backtrack(
                current,
                [...remaining.slice(0, i), ...remaining.slice(i + 1)]
            );
            current.pop(); // Backtrack
        }
    }
    
    backtrack([], nums);
    return result;
}

// Example 2: Subsets
function subsets(nums) {
    const result = [];
    
    function backtrack(start, current) {
        result.push([...current]);
        
        for (let i = start; i < nums.length; i++) {
            current.push(nums[i]);
            backtrack(i + 1, current);
            current.pop(); // Backtrack
        }
    }
    
    backtrack(0, []);
    return result;
}

// Example 3: Combination Sum
function combinationSum(candidates, target) {
    const result = [];
    
    function backtrack(start, current, remaining) {
        if (remaining === 0) {
            result.push([...current]);
            return;
        }
        if (remaining < 0) return;
        
        for (let i = start; i < candidates.length; i++) {
            current.push(candidates[i]);
            backtrack(i, current, remaining - candidates[i]); // Can reuse
            current.pop(); // Backtrack
        }
    }
    
    backtrack(0, [], target);
    return result;
}

// Example 4: Letter Combinations of Phone Number
function letterCombinations(digits) {
    if (!digits) return [];
    
    const map = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    };
    
    const result = [];
    
    function backtrack(index, current) {
        if (index === digits.length) {
            result.push(current);
            return;
        }
        
        for (const letter of map[digits[index]]) {
            backtrack(index + 1, current + letter);
        }
    }
    
    backtrack(0, '');
    return result;
}
```

### 25.7 Array Manipulation Patterns

```javascript
// Rotate Array
function rotate(nums, k) {
    k = k % nums.length;
    
    function reverse(start, end) {
        while (start < end) {
            [nums[start], nums[end]] = [nums[end], nums[start]];
            start++;
            end--;
        }
    }
    
    reverse(0, nums.length - 1);  // Reverse all
    reverse(0, k - 1);            // Reverse first k
    reverse(k, nums.length - 1);  // Reverse rest
}

// Move Zeroes to End
function moveZeroes(nums) {
    let insertPos = 0;
    
    for (let i = 0; i < nums.length; i++) {
        if (nums[i] !== 0) {
            [nums[insertPos], nums[i]] = [nums[i], nums[insertPos]];
            insertPos++;
        }
    }
}

// Product of Array Except Self (without division)
function productExceptSelf(nums) {
    const n = nums.length;
    const result = new Array(n).fill(1);
    
    // Left products
    let leftProduct = 1;
    for (let i = 0; i < n; i++) {
        result[i] = leftProduct;
        leftProduct *= nums[i];
    }
    
    // Right products
    let rightProduct = 1;
    for (let i = n - 1; i >= 0; i--) {
        result[i] *= rightProduct;
        rightProduct *= nums[i];
    }
    
    return result;
}

// Find Peak Element
function findPeakElement(nums) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (nums[mid] > nums[mid + 1]) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    
    return left;
}
```

### 25.8 String Manipulation Patterns

```javascript
// Reverse Words in String
function reverseWords(s) {
    return s.trim().split(/\s+/).reverse().join(' ');
}

// Longest Palindromic Substring (Expand Around Center)
function longestPalindrome(s) {
    let start = 0, maxLen = 0;
    
    function expandAroundCenter(left, right) {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            if (right - left + 1 > maxLen) {
                start = left;
                maxLen = right - left + 1;
            }
            left--;
            right++;
        }
    }
    
    for (let i = 0; i < s.length; i++) {
        expandAroundCenter(i, i);     // Odd length
        expandAroundCenter(i, i + 1); // Even length
    }
    
    return s.substring(start, start + maxLen);
}

// String Compression
function compress(chars) {
    let write = 0;
    let read = 0;
    
    while (read < chars.length) {
        const char = chars[read];
        let count = 0;
        
        while (read < chars.length && chars[read] === char) {
            read++;
            count++;
        }
        
        chars[write++] = char;
        if (count > 1) {
            for (const digit of String(count)) {
                chars[write++] = digit;
            }
        }
    }
    
    return write;
}

// Valid Parentheses
function isValid(s) {
    const stack = [];
    const pairs = { ')': '(', '}': '{', ']': '[' };
    
    for (const char of s) {
        if (char in pairs) {
            if (stack.pop() !== pairs[char]) {
                return false;
            }
        } else {
            stack.push(char);
        }
    }
    
    return stack.length === 0;
}
```

---

## Section 26: Quick Reference - Complexity Cheat Sheet

### Time Complexity

| Operation | Array | Object/Map | Set |
|-----------|-------|------------|-----|
| Access by index | O(1) | - | - |
| Access by key | - | O(1) | - |
| Search | O(n) | O(1) | O(1) |
| Insert at end | O(1)* | O(1) | O(1) |
| Insert at start | O(n) | O(1) | O(1) |
| Delete | O(n) | O(1) | O(1) |

### Common Algorithm Complexities

| Algorithm | Time | Space |
|-----------|------|-------|
| Binary Search | O(log n) | O(1) |
| Two Pointers | O(n) | O(1) |
| Sliding Window | O(n) | O(1) to O(k) |
| Hash Map Lookup | O(n) | O(n) |
| BFS/DFS Tree | O(n) | O(h) height |
| BFS/DFS Graph | O(V + E) | O(V) |
| Quick Sort | O(n log n) avg | O(log n) |
| Merge Sort | O(n log n) | O(n) |
| Heap Operations | O(log n) | O(1) |

### Sorting Comparison

```javascript
// Built-in sort (Tim Sort) - O(n log n)
arr.sort((a, b) => a - b);

// For small arrays (< ~10), insertion sort is often faster
// For nearly sorted data, insertion sort is O(n)
// For random data, Quick Sort average is O(n log n)
```

---

## Section 27: Final Interview Tips

### Before the Interview

```
1. Test your environment (camera, mic, internet, IDE)
2. Have water nearby
3. Keep the job description handy
4. Prepare questions to ask them
5. Review your resume - they may ask about your projects
```

### During the Interview

```
1. Greet warmly, be professional but personable
2. Listen carefully to the problem - don't rush to code
3. Ask clarifying questions
4. Think out loud - let them see your process
5. Start with a working solution, then optimize
6. Test your code with examples
7. Discuss complexity
8. If stuck, ask for hints - it's okay!
9. Stay calm if you make mistakes
```

### Code Quality Tips

```javascript
// 1. Use meaningful variable names
// BAD
const x = arr.filter(i => i > 0);

// GOOD
const positiveNumbers = numbers.filter(num => num > 0);

// 2. Add brief comments for complex logic
function findKthLargest(nums, k) {
    // Use min-heap of size k
    // Heap top will be kth largest
    const heap = new MinHeap();
    // ...
}

// 3. Handle edge cases first
function findMax(arr) {
    if (!arr || arr.length === 0) return null;
    // Main logic...
}

// 4. Keep functions small and focused
// 5. Use early returns to reduce nesting
```

### Questions to Ask Interviewer

```
1. What does a typical day look like for this role?
2. What are the biggest challenges the team is facing?
3. How do you measure success in this position?
4. What's the tech stack? Any plans to change it?
5. What do you enjoy most about working here?
6. What are the next steps in the interview process?
```

---

# GUIDE COMPLETE

## Summary of What's Covered

| Part | Sections | Key Topics |
|------|----------|------------|
| **A** | 1-6 | Execution Context, Hoisting, Closures, `this`, Prototypes, ES6+ |
| **B** | 7-9 | Event Loop, Promises, async/await |
| **C** | 10-13 | Polyfills, Utilities, Data Structures, Promise implementations |
| **D** | 14-16 | DOM Manipulation, Events, Browser APIs |
| **E** | 17-23 | 28 Output Prediction Questions |
| **F** | 24-27 | Problem-Solving Approach, Coding Patterns, Tips |

## Top 15 Things to Practice

1. **LRU Cache** - O(1) implementation
2. **Debounce/Throttle** - With all options
3. **EventEmitter** - Full implementation
4. **Promise.all** - Implementation
5. **Deep Clone** - Handle all types
6. **Event Loop Output** - Predict correctly
7. **Closure Questions** - setTimeout loop
8. **`this` Binding** - All 4 rules
9. **Two Pointers** - Multiple problems
10. **Sliding Window** - Variable size
11. **Tree Traversal** - BFS and DFS
12. **Backtracking** - Permutations, subsets
13. **Memoization** - Recursive to DP
14. **Event Delegation** - Why and how
15. **Prototype Chain** - How lookup works

---

**Good luck with your GoTo interview! You've got this!**
