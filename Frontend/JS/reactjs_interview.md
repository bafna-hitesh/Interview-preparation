# GoTo Interview Preparation Guide - Staff Engineer Round 2

> A comprehensive study guide for React, Next.js, and Data Structures interview preparation.

---

## Part 1: React Core Concepts

### 1.1 Component Lifecycle and Rendering Behavior

**Concept:** React components go through a lifecycle of mounting, updating, and unmounting. In functional components, the `useEffect` hook handles these phases. React re-renders a component when its state changes, props change, or parent re-renders.

**Key Points:**
- Mounting: Component is created and inserted into the DOM
- Updating: Component re-renders due to state/props changes
- Unmounting: Component is removed from the DOM
- Functional components don't have lifecycle methods; use hooks instead
- Re-render ≠ DOM update (React only updates changed DOM elements)

**Interview Q: Explain the React component lifecycle in functional components.**

> **Answer:** In functional components, we use `useEffect` to handle lifecycle events:
> - **Mounting:** `useEffect(() => { /* runs once */ }, [])` with empty dependency array
> - **Updating:** `useEffect(() => { /* runs on deps change */ }, [dep1, dep2])`
> - **Unmounting:** Return a cleanup function from useEffect: `useEffect(() => { return () => { /* cleanup */ } }, [])`
> 
> The render phase is the function body itself, which runs on every re-render.

**Gotchas:**
- `useEffect` runs AFTER paint, not before (use `useLayoutEffect` for synchronous effects)
- State updates in event handlers are batched; in async callbacks, they may not be (React 18 batches all)
- A component re-renders when parent re-renders, even if props haven't changed

---

### 1.2 Virtual DOM and Reconciliation Algorithm

**Concept:** The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React uses a diffing algorithm (reconciliation) to compare the previous and new virtual DOM trees, then applies minimal updates to the real DOM.

**Key Points:**
- Virtual DOM is a programming concept, not a specific technology
- Reconciliation compares two trees using O(n) heuristic algorithm
- Two elements of different types produce different trees
- Keys help React identify which items changed in lists
- React uses "fiber" architecture for incremental rendering

**Interview Q: How does React's reconciliation algorithm work?**

> **Answer:** React's reconciliation uses two key assumptions for O(n) complexity:
> 1. **Different element types:** If root elements differ (e.g., `<div>` to `<span>`), React destroys the old tree and builds a new one
> 2. **Keys for lists:** Elements with stable keys across renders are matched; this is why we need unique keys
> 
> The algorithm:
> - Compares elements level by level (breadth-first)
> - For same type: keeps node, updates attributes/props
> - For different type: unmounts old subtree, mounts new subtree
> - For lists: uses keys to minimize moves/recreations

**Gotchas:**
- Using array index as key can cause issues when list order changes
- Keys must be unique among siblings, not globally
- Avoid creating new component instances in render (causes full remount)

---

### 1.3 Controlled vs Uncontrolled Components

**Concept:** Controlled components have their form data managed by React state. Uncontrolled components store form data in the DOM itself, accessed via refs. Controlled components are recommended for most use cases.

**Key Points:**
- Controlled: `value` prop + `onChange` handler
- Uncontrolled: uses `ref` to access DOM node, `defaultValue` for initial value
- File inputs are always uncontrolled (read-only value)
- Controlled gives you more control (validation, formatting, conditional disable)

**Interview Q: When would you use an uncontrolled component over a controlled one?**

> **Answer:** Use uncontrolled components when:
> 1. **Integrating with non-React code** - Legacy libraries that manipulate DOM directly
> 2. **File inputs** - Always uncontrolled due to security restrictions
> 3. **Simple forms** - Quick prototypes where you just need the final value
> 4. **Performance concerns** - Large forms where each keystroke re-render is costly
> 
> ```jsx
> // Controlled
> const [value, setValue] = useState('');
> <input value={value} onChange={e => setValue(e.target.value)} />
> 
> // Uncontrolled
> const inputRef = useRef();
> <input ref={inputRef} defaultValue="initial" />
> // Access: inputRef.current.value
> ```

**Gotchas:**
- Don't switch between controlled and uncontrolled (React warning)
- `defaultValue` is only for initial render; won't update if changed
- Mixing `value` without `onChange` makes input read-only

---

### 1.4 Error Boundaries and Error Handling

**Concept:** Error boundaries are React components that catch JavaScript errors in their child component tree, log errors, and display a fallback UI. They use class component lifecycle methods and cannot catch errors in event handlers, async code, or server-side rendering.

**Key Points:**
- Must be class components (no hooks equivalent yet)
- Implement `static getDerivedStateFromError()` and/or `componentDidCatch()`
- Don't catch: event handlers, async code, SSR, errors in boundary itself
- Use multiple boundaries to isolate different parts of UI
- Libraries like `react-error-boundary` provide functional alternatives

**Interview Q: How do you implement error handling in React applications?**

> **Answer:** React uses a multi-layered approach:
> 
> 1. **Error Boundaries** (for render errors):
> ```jsx
> class ErrorBoundary extends React.Component {
>   state = { hasError: false };
>   
>   static getDerivedStateFromError(error) {
>     return { hasError: true };
>   }
>   
>   componentDidCatch(error, errorInfo) {
>     logErrorToService(error, errorInfo);
>   }
>   
>   render() {
>     if (this.state.hasError) return <FallbackUI />;
>     return this.props.children;
>   }
> }
> ```
> 
> 2. **Try-catch** in event handlers and async code
> 3. **Error states** in data fetching (loading/error/success pattern)
> 4. **Global error handlers** for uncaught errors

**Gotchas:**
- Error boundaries reset on navigation; consider storing error state
- In development, React shows error overlay even with boundary
- Use `error.toString()` and `errorInfo.componentStack` for debugging

---

### 1.5 React 18+ Features

**Concept:** React 18 introduced concurrent rendering, allowing React to prepare multiple versions of the UI simultaneously. Key features include automatic batching, transitions, Suspense improvements, and new hooks.

**Key Points:**
- **Automatic Batching:** All state updates batched (even in promises, timeouts)
- **Concurrent Rendering:** React can interrupt and resume rendering
- **Transitions:** Mark non-urgent updates to keep UI responsive
- **Suspense:** Now works with lazy loading AND data fetching (with libraries)
- **Streaming SSR:** Progressive HTML streaming with selective hydration

**Interview Q: What are React 18's key improvements and how does concurrent rendering work?**

> **Answer:** React 18's concurrent rendering allows React to:
> 1. **Pause work** to handle more urgent updates
> 2. **Reuse previous work** instead of throwing it away
> 3. **Render in background** without blocking the main thread
> 
> Key features:
> - **Automatic Batching:** `setState` calls in any context are batched
> ```jsx
> // Before React 18: multiple re-renders
> // React 18: single re-render
> fetch('/api').then(() => {
>   setCount(c => c + 1);
>   setFlag(f => !f);
> });
> ```
> 
> - **useTransition:** Mark slow updates as transitions
> ```jsx
> const [isPending, startTransition] = useTransition();
> startTransition(() => setSearchQuery(input)); // Low priority
> ```
> 
> - **Suspense for Data Fetching:** Works with compatible libraries (Relay, SWR)

**Gotchas:**
- Must use `createRoot` instead of `render` for concurrent features
- Strict Mode in React 18 double-invokes effects in development
- Legacy APIs (like string refs) are deprecated

---

### 1.6 Context API Deep Dive

**Concept:** Context provides a way to pass data through the component tree without prop drilling. It's designed for data that's considered "global" for a tree of components (theme, auth, locale). Overuse can lead to performance issues.

**Key Points:**
- `createContext()` → `Provider` → `useContext()`
- All consumers re-render when context value changes
- Split contexts by update frequency (separate auth from theme)
- Memoize context value to prevent unnecessary re-renders
- Consider state management libraries for complex global state

**Interview Q: How do you optimize React Context to prevent unnecessary re-renders?**

> **Answer:** Context re-renders ALL consumers when value changes. Optimize by:
> 
> 1. **Split contexts** by update frequency:
> ```jsx
> // Bad: one context for everything
> const AppContext = createContext({ user, theme, locale });
> 
> // Good: separate contexts
> const UserContext = createContext(user);
> const ThemeContext = createContext(theme);
> ```
> 
> 2. **Memoize the value object:**
> ```jsx
> const value = useMemo(() => ({ user, login, logout }), [user]);
> return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
> ```
> 
> 3. **Memoize consumer components:**
> ```jsx
> const MemoizedComponent = React.memo(ComponentUsingContext);
> ```
> 
> 4. **Use selectors** (with libraries like use-context-selector)

**Gotchas:**
- Context is NOT a state management solution (no selectors, no middleware)
- Nested providers override parent providers of same context
- Default value in `createContext` is used only when no Provider found

---

### 1.7 Refs and Forwarding Refs

**Concept:** Refs provide a way to access DOM nodes or React elements created in the render method. They're useful for managing focus, triggering animations, or integrating with third-party DOM libraries. Ref forwarding passes a ref through a component to a child.

**Key Points:**
- `useRef()` returns mutable object that persists across renders
- Ref changes don't trigger re-renders
- `forwardRef()` passes ref to child component
- Can store any mutable value, not just DOM refs
- `useImperativeHandle` customizes the exposed ref value

**Interview Q: Explain useRef and forwardRef with use cases.**

> **Answer:** 
> 
> **useRef** creates a mutable container:
> ```jsx
> // DOM access
> const inputRef = useRef(null);
> <input ref={inputRef} />
> inputRef.current.focus();
> 
> // Storing mutable values (won't cause re-render)
> const renderCount = useRef(0);
> renderCount.current++; // Tracks renders without causing them
> 
> // Previous value pattern
> const prevValue = useRef();
> useEffect(() => { prevValue.current = value; });
> ```
> 
> **forwardRef** passes refs to children:
> ```jsx
> const FancyInput = forwardRef((props, ref) => (
>   <input ref={ref} className="fancy" {...props} />
> ));
> 
> // Parent can now access the input
> const ref = useRef();
> <FancyInput ref={ref} />
> ref.current.focus();
> ```
> 
> **useImperativeHandle** customizes exposed ref:
> ```jsx
> const FancyInput = forwardRef((props, ref) => {
>   const inputRef = useRef();
>   useImperativeHandle(ref, () => ({
>     focus: () => inputRef.current.focus(),
>     clear: () => inputRef.current.value = ''
>   }));
>   return <input ref={inputRef} />;
> });
> ```

**Gotchas:**
- Don't overuse refs; prefer declarative approach when possible
- Ref value is available in `useEffect`, not during render
- Function components can't receive refs directly (need forwardRef)

---

## Part 2: Hooks Deep Dive

### 2.1 useState - Batching, Functional Updates, Lazy Initialization

**Concept:** `useState` is the primary hook for managing local component state. It returns a state variable and a setter function. Understanding batching, functional updates, and lazy initialization is crucial for optimal usage.

**Key Points:**
- State updates are asynchronous and batched
- Use functional updates when new state depends on previous state
- Lazy initialization: pass function to avoid expensive computation on every render
- State identity matters: same value won't trigger re-render (Object.is comparison)

**Interview Q: Explain useState batching and when to use functional updates.**

> **Answer:**
> 
> **Batching:** React groups multiple state updates into a single re-render:
> ```jsx
> function handleClick() {
>   setCount(count + 1);
>   setCount(count + 1);
>   setCount(count + 1);
>   // Result: count + 1 (not +3!) - all use same stale 'count'
> }
> ```
> 
> **Functional Updates** (use when new state depends on previous):
> ```jsx
> function handleClick() {
>   setCount(c => c + 1);
>   setCount(c => c + 1);
>   setCount(c => c + 1);
>   // Result: count + 3 (each update receives latest state)
> }
> ```
> 
> **Lazy Initialization** (expensive initial computation):
> ```jsx
> // Bad: createExpensiveObject() runs every render
> const [state, setState] = useState(createExpensiveObject());
> 
> // Good: function only runs on mount
> const [state, setState] = useState(() => createExpensiveObject());
> ```

**Gotchas:**
- React 18 batches ALL updates (even in setTimeout, promises)
- Setting same value (by reference) won't trigger re-render
- Objects/arrays must be new references to trigger update

---

### 2.2 useEffect - Cleanup, Dependencies, Common Pitfalls

**Concept:** `useEffect` lets you perform side effects in functional components. It runs after render and can optionally clean up. The dependency array controls when the effect re-runs.

**Key Points:**
- Runs after every render by default (no deps array)
- Empty array `[]` = runs once on mount
- With dependencies = runs when any dependency changes
- Cleanup function runs before next effect and on unmount
- Effects run after paint (use `useLayoutEffect` for DOM measurements)

**Interview Q: What are common useEffect mistakes and how do you avoid them?**

> **Answer:**
> 
> 1. **Missing dependencies:**
> ```jsx
> // Bug: stale closure over 'count'
> useEffect(() => {
>   const id = setInterval(() => console.log(count), 1000);
>   return () => clearInterval(id);
> }, []); // Missing 'count' dependency
> 
> // Fix: include dependency or use functional update
> useEffect(() => {
>   const id = setInterval(() => setCount(c => c + 1), 1000);
>   return () => clearInterval(id);
> }, []);
> ```
> 
> 2. **Object/array dependencies:**
> ```jsx
> // Bug: new object every render → infinite loop
> useEffect(() => { fetchData(options); }, [options]);
> 
> // Fix: memoize or use primitive values
> const optionsStr = JSON.stringify(options);
> useEffect(() => { fetchData(JSON.parse(optionsStr)); }, [optionsStr]);
> // Or: useMemo for options object
> ```
> 
> 3. **Missing cleanup:**
> ```jsx
> // Bug: memory leak, updates unmounted component
> useEffect(() => {
>   fetchData().then(data => setData(data));
> }, []);
> 
> // Fix: abort controller or flag
> useEffect(() => {
>   let cancelled = false;
>   fetchData().then(data => { if (!cancelled) setData(data); });
>   return () => { cancelled = true; };
> }, []);
> ```

**Gotchas:**
- ESLint `exhaustive-deps` rule is your friend; don't disable it blindly
- Async functions can't be directly passed to useEffect
- Multiple useEffects are better than one giant effect

---

### 2.3 useCallback & useMemo - When to Use, When NOT to Use

**Concept:** `useMemo` memoizes computed values; `useCallback` memoizes functions. Both are optimization hooks that prevent unnecessary recalculations/recreations. However, they come with their own costs and should be used judiciously.

**Key Points:**
- `useMemo`: caches expensive computation results
- `useCallback`: caches function references
- Both have overhead: dependency comparison + memory
- Use when: passing to memoized children, expensive calculations, referential equality matters
- Don't use for: simple calculations, non-memoized children

**Interview Q: When should you NOT use useMemo and useCallback?**

> **Answer:** Premature optimization is the root of all evil. Avoid when:
> 
> 1. **Simple calculations:**
> ```jsx
> // Unnecessary: basic math is fast
> const double = useMemo(() => count * 2, [count]);
> // Just do: const double = count * 2;
> ```
> 
> 2. **Child doesn't use React.memo:**
> ```jsx
> // Useless: Child re-renders anyway when Parent re-renders
> const handleClick = useCallback(() => doSomething(), []);
> return <Child onClick={handleClick} />; // Child not memoized
> ```
> 
> 3. **New primitive values:**
> ```jsx
> // Pointless: primitives compared by value
> const id = useMemo(() => `user-${index}`, [index]);
> // Just do: const id = `user-${index}`;
> ```
> 
> **When TO use:**
> ```jsx
> // Good: expensive computation
> const sortedList = useMemo(() => 
>   items.sort((a, b) => complexCompare(a, b)), [items]);
> 
> // Good: referential equality for memoized child
> const MemoChild = React.memo(Child);
> const handleClick = useCallback(() => doSomething(id), [id]);
> return <MemoChild onClick={handleClick} />;
> 
> // Good: dependency in another hook
> const options = useMemo(() => ({ page, limit }), [page, limit]);
> useEffect(() => { fetchData(options); }, [options]);
> ```

**Gotchas:**
- Profile before optimizing; measure don't assume
- `useMemo` doesn't guarantee value won't be recalculated (memory pressure)
- Empty dependency array = never changes (constant function/value)

---

### 2.4 useRef - Beyond DOM Refs

**Concept:** `useRef` returns a mutable ref object whose `.current` property can hold any value. Unlike state, changing ref doesn't trigger re-render. It's commonly used for DOM access but has many other uses.

**Key Points:**
- Persists across renders without causing re-renders
- `.current` is mutable (unlike state)
- Common uses: DOM access, storing previous values, instance variables, timers
- Value is available synchronously (unlike state)

**Interview Q: What are advanced use cases for useRef beyond DOM access?**

> **Answer:**
> 
> 1. **Store previous value:**
> ```jsx
> function usePrevious(value) {
>   const ref = useRef();
>   useEffect(() => { ref.current = value; });
>   return ref.current;
> }
> 
> const prevCount = usePrevious(count);
> // prevCount has last render's count value
> ```
> 
> 2. **Track mounted state (avoid memory leaks):**
> ```jsx
> const isMounted = useRef(true);
> useEffect(() => {
>   return () => { isMounted.current = false; };
> }, []);
> 
> // In async callback:
> fetchData().then(data => {
>   if (isMounted.current) setState(data);
> });
> ```
> 
> 3. **Store interval/timeout IDs:**
> ```jsx
> const intervalRef = useRef();
> 
> const startTimer = () => {
>   intervalRef.current = setInterval(() => tick(), 1000);
> };
> const stopTimer = () => clearInterval(intervalRef.current);
> ```
> 
> 4. **Access latest value in callbacks (avoid stale closures):**
> ```jsx
> const countRef = useRef(count);
> countRef.current = count; // Always updated
> 
> const handleClick = useCallback(() => {
>   console.log(countRef.current); // Always latest
> }, []); // No dependencies needed!
> ```

**Gotchas:**
- Ref changes don't trigger re-render (use state if you need UI update)
- Don't read/write ref during render (except initialization)
- Ref is available immediately; effect runs after render

---

### 2.5 useReducer - Complex State Logic

**Concept:** `useReducer` is an alternative to `useState` for complex state logic. It accepts a reducer function and initial state, returning current state and a dispatch function. It's preferred when state logic is complex or involves multiple sub-values.

**Key Points:**
- `(state, action) => newState` pattern from Redux
- Dispatch is stable (doesn't change between renders)
- Good for: complex state, related state updates, state machines
- Can replace multiple useState calls with one reducer
- Combine with Context for "poor man's Redux"

**Interview Q: When should you use useReducer instead of useState?**

> **Answer:** Use `useReducer` when:
> 
> 1. **Complex state object:**
> ```jsx
> // Instead of multiple useState calls
> const [state, dispatch] = useReducer(reducer, {
>   loading: false,
>   error: null,
>   data: null
> });
> ```
> 
> 2. **State transitions depend on previous state:**
> ```jsx
> function reducer(state, action) {
>   switch (action.type) {
>     case 'increment':
>       return { ...state, count: state.count + 1 };
>     case 'decrement':
>       return { ...state, count: state.count - 1 };
>     case 'reset':
>       return initialState;
>     default:
>       throw new Error(`Unknown action: ${action.type}`);
>   }
> }
> ```
> 
> 3. **Passing update logic to children:**
> ```jsx
> // dispatch is stable; won't cause re-renders
> const DispatchContext = createContext();
> 
> function Parent() {
>   const [state, dispatch] = useReducer(reducer, initialState);
>   return (
>     <DispatchContext.Provider value={dispatch}>
>       <Child />
>     </DispatchContext.Provider>
>   );
> }
> 
> function Child() {
>   const dispatch = useContext(DispatchContext);
>   // dispatch identity is stable!
> }
> ```
> 
> 4. **Testing:** Reducer is pure function, easy to test in isolation

**Gotchas:**
- Reducer must be pure (no side effects)
- Return new state object (don't mutate)
- Consider Immer for complex nested updates

---

### 2.6 useContext - Performance Considerations

**Concept:** `useContext` accepts a context object and returns the current context value. When the context value changes, all components using that context will re-render. This can lead to performance issues if not managed properly.

**Key Points:**
- Subscribes component to context changes
- Re-renders on ANY context value change
- No built-in selectors (unlike Redux)
- Split contexts to minimize re-renders
- Memoize children to prevent cascading re-renders

**Interview Q: How do you prevent unnecessary re-renders with useContext?**

> **Answer:**
> 
> 1. **Split context by update frequency:**
> ```jsx
> // Separate contexts for different concerns
> const UserStateContext = createContext();
> const UserDispatchContext = createContext();
> 
> function UserProvider({ children }) {
>   const [user, dispatch] = useReducer(reducer, null);
>   return (
>     <UserStateContext.Provider value={user}>
>       <UserDispatchContext.Provider value={dispatch}>
>         {children}
>       </UserDispatchContext.Provider>
>     </UserStateContext.Provider>
>   );
> }
> ```
> 
> 2. **Memoize context value:**
> ```jsx
> function AuthProvider({ children }) {
>   const [user, setUser] = useState(null);
>   
>   const value = useMemo(() => ({
>     user,
>     login: (data) => setUser(data),
>     logout: () => setUser(null)
>   }), [user]);
>   
>   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
> }
> ```
> 
> 3. **Memoize consumers:**
> ```jsx
> const UserAvatar = React.memo(function UserAvatar() {
>   const user = useContext(UserContext);
>   return <img src={user.avatar} />;
> });
> ```
> 
> 4. **Use composition to avoid context:**
> ```jsx
> // Instead of passing user through context
> function App() {
>   const user = useUser();
>   return <Layout><Header user={user} /></Layout>;
> }
> ```

**Gotchas:**
- Context is for low-frequency updates (theme, auth)
- For high-frequency updates, consider state management libraries
- Every useContext consumer re-renders when value changes

---

### 2.7 Custom Hooks - Patterns and Best Practices

**Concept:** Custom hooks are JavaScript functions that start with "use" and can call other hooks. They allow you to extract component logic into reusable functions. Custom hooks share stateful logic, not state itself.

**Key Points:**
- Must start with "use" for ESLint rules
- Each call to a custom hook gets its own isolated state
- Can call other hooks (built-in or custom)
- Great for: data fetching, subscriptions, form handling, animations
- Return values, not JSX

**Interview Q: Design a custom hook for data fetching with loading and error states.**

> **Answer:**
> 
> ```jsx
> function useFetch(url, options = {}) {
>   const [state, dispatch] = useReducer(fetchReducer, {
>     data: null,
>     loading: true,
>     error: null
>   });
>   
>   useEffect(() => {
>     const controller = new AbortController();
>     
>     async function fetchData() {
>       dispatch({ type: 'FETCH_START' });
>       
>       try {
>         const response = await fetch(url, {
>           ...options,
>           signal: controller.signal
>         });
>         
>         if (!response.ok) throw new Error(`HTTP ${response.status}`);
>         
>         const data = await response.json();
>         dispatch({ type: 'FETCH_SUCCESS', payload: data });
>       } catch (error) {
>         if (error.name !== 'AbortError') {
>           dispatch({ type: 'FETCH_ERROR', payload: error.message });
>         }
>       }
>     }
>     
>     fetchData();
>     
>     return () => controller.abort();
>   }, [url, JSON.stringify(options)]);
>   
>   return state;
> }
> 
> function fetchReducer(state, action) {
>   switch (action.type) {
>     case 'FETCH_START':
>       return { ...state, loading: true, error: null };
>     case 'FETCH_SUCCESS':
>       return { data: action.payload, loading: false, error: null };
>     case 'FETCH_ERROR':
>       return { data: null, loading: false, error: action.payload };
>     default:
>       return state;
>   }
> }
> 
> // Usage
> function UserProfile({ userId }) {
>   const { data: user, loading, error } = useFetch(`/api/users/${userId}`);
>   
>   if (loading) return <Spinner />;
>   if (error) return <Error message={error} />;
>   return <Profile user={user} />;
> }
> ```

**Gotchas:**
- Custom hooks share logic, not state (each call is independent)
- Follow hooks rules inside custom hooks
- Consider libraries like SWR, React Query for production data fetching

---

### 2.8 React 18 Hooks (useId, useTransition, useDeferredValue)

**Concept:** React 18 introduced new hooks for concurrent features. `useId` generates unique IDs for accessibility. `useTransition` marks state updates as non-urgent. `useDeferredValue` defers updating a value until more urgent updates are done.

**Key Points:**
- `useId`: SSR-safe unique ID generation
- `useTransition`: returns [isPending, startTransition]
- `useDeferredValue`: like debouncing but integrated with React
- These hooks enable concurrent rendering optimizations

**Interview Q: Explain useTransition and useDeferredValue with examples.**

> **Answer:**
> 
> **useTransition** - for slow state updates you control:
> ```jsx
> function SearchResults() {
>   const [query, setQuery] = useState('');
>   const [results, setResults] = useState([]);
>   const [isPending, startTransition] = useTransition();
>   
>   function handleChange(e) {
>     // Urgent: update input immediately
>     setQuery(e.target.value);
>     
>     // Non-urgent: can be interrupted
>     startTransition(() => {
>       setResults(filterLargeList(e.target.value));
>     });
>   }
>   
>   return (
>     <>
>       <input value={query} onChange={handleChange} />
>       {isPending && <Spinner />}
>       <ResultsList results={results} />
>     </>
>   );
> }
> ```
> 
> **useDeferredValue** - for slow updates from props:
> ```jsx
> function SearchResults({ query }) {
>   // Defers updating until urgent work is done
>   const deferredQuery = useDeferredValue(query);
>   const isStale = query !== deferredQuery;
>   
>   // Expensive computation uses deferred value
>   const results = useMemo(
>     () => filterLargeList(deferredQuery),
>     [deferredQuery]
>   );
>   
>   return (
>     <div style={{ opacity: isStale ? 0.5 : 1 }}>
>       <ResultsList results={results} />
>     </div>
>   );
> }
> ```
> 
> **useId** - SSR-safe unique IDs:
> ```jsx
> function FormField({ label }) {
>   const id = useId();
>   return (
>     <>
>       <label htmlFor={id}>{label}</label>
>       <input id={id} />
>     </>
>   );
> }
> // Generates same ID on server and client
> ```

**Gotchas:**
- `startTransition` callback must be synchronous
- `useDeferredValue` returns same value until React has time to update
- `useId` shouldn't be used for list keys

---

## Part 3: Performance Optimization

### 3.1 React.memo, useMemo, useCallback - Proper Usage

**Concept:** These are React's primary tools for preventing unnecessary work. `React.memo` prevents component re-renders when props haven't changed. `useMemo` caches expensive calculations. `useCallback` caches function references. All use shallow comparison by default.

**Key Points:**
- `React.memo`: HOC that memoizes component output
- Custom comparison function for complex props
- All three do shallow comparison by default
- Measure before optimizing; premature optimization adds complexity
- Memory vs. CPU tradeoff

**Interview Q: How would you optimize a component that renders a large list of items?**

> **Answer:** Multi-layered optimization approach:
> 
> 1. **Memoize list items:**
> ```jsx
> const ListItem = React.memo(function ListItem({ item, onSelect }) {
>   return (
>     <div onClick={() => onSelect(item.id)}>
>       {item.name}
>     </div>
>   );
> });
> ```
> 
> 2. **Stabilize callbacks:**
> ```jsx
> function List({ items }) {
>   const [selected, setSelected] = useState(null);
>   
>   // Stable reference - won't cause ListItem re-renders
>   const handleSelect = useCallback((id) => {
>     setSelected(id);
>   }, []);
>   
>   return items.map(item => (
>     <ListItem 
>       key={item.id} 
>       item={item} 
>       onSelect={handleSelect}
>     />
>   ));
> }
> ```
> 
> 3. **Virtualization for very large lists:**
> ```jsx
> import { FixedSizeList } from 'react-window';
> 
> function VirtualizedList({ items }) {
>   const Row = ({ index, style }) => (
>     <div style={style}>{items[index].name}</div>
>   );
>   
>   return (
>     <FixedSizeList
>       height={600}
>       width={400}
>       itemCount={items.length}
>       itemSize={50}
>     >
>       {Row}
>     </FixedSizeList>
>   );
> }
> ```
> 
> 4. **Custom comparison for complex props:**
> ```jsx
> const ListItem = React.memo(ListItemComponent, (prevProps, nextProps) => {
>   return prevProps.item.id === nextProps.item.id &&
>          prevProps.item.updatedAt === nextProps.item.updatedAt;
> });
> ```

**Gotchas:**
- React.memo does shallow comparison by default
- Don't memoize everything; measure first
- Callback stability is crucial for memoized children

---

### 3.2 Code Splitting and Lazy Loading

**Concept:** Code splitting breaks your app into smaller chunks that load on demand. `React.lazy()` enables component-level code splitting. Combined with `Suspense`, it provides a seamless loading experience while reducing initial bundle size.

**Key Points:**
- `React.lazy()` enables dynamic imports for components
- Wrap lazy components in `Suspense` with fallback
- Route-based splitting is most common pattern
- Consider component-level splitting for heavy components
- Preload critical routes on hover/focus

**Interview Q: How do you implement code splitting in a React application?**

> **Answer:**
> 
> 1. **Route-based splitting (most common):**
> ```jsx
> import { lazy, Suspense } from 'react';
> import { Routes, Route } from 'react-router-dom';
> 
> // Dynamic imports - separate chunks
> const Home = lazy(() => import('./pages/Home'));
> const Dashboard = lazy(() => import('./pages/Dashboard'));
> const Settings = lazy(() => import('./pages/Settings'));
> 
> function App() {
>   return (
>     <Suspense fallback={<PageLoader />}>
>       <Routes>
>         <Route path="/" element={<Home />} />
>         <Route path="/dashboard" element={<Dashboard />} />
>         <Route path="/settings" element={<Settings />} />
>       </Routes>
>     </Suspense>
>   );
> }
> ```
> 
> 2. **Component-level splitting:**
> ```jsx
> const HeavyChart = lazy(() => import('./components/HeavyChart'));
> 
> function Dashboard() {
>   const [showChart, setShowChart] = useState(false);
>   
>   return (
>     <div>
>       <button onClick={() => setShowChart(true)}>Show Chart</button>
>       {showChart && (
>         <Suspense fallback={<ChartSkeleton />}>
>           <HeavyChart data={data} />
>         </Suspense>
>       )}
>     </div>
>   );
> }
> ```
> 
> 3. **Preloading on hover:**
> ```jsx
> const Settings = lazy(() => import('./pages/Settings'));
> 
> // Preload function
> const preloadSettings = () => import('./pages/Settings');
> 
> function NavLink() {
>   return (
>     <Link 
>       to="/settings" 
>       onMouseEnter={preloadSettings}
>       onFocus={preloadSettings}
>     >
>       Settings
>     </Link>
>   );
> }
> ```
> 
> 4. **Named exports with lazy:**
> ```jsx
> // For named exports, create intermediate module
> const MyComponent = lazy(() => 
>   import('./components').then(module => ({ default: module.MyComponent }))
> );
> ```

**Gotchas:**
- `React.lazy` only works with default exports (or use workaround)
- Suspense boundary catches all lazy children
- Error boundaries should wrap Suspense for error handling
- SSR requires additional setup (Next.js handles this)

---

### 3.3 Virtualization for Large Lists

**Concept:** Virtualization renders only visible items in a list, dramatically improving performance for large datasets. Instead of rendering thousands of DOM nodes, it renders only what fits in the viewport plus a small buffer.

**Key Points:**
- Only renders visible items (windowing)
- Maintains scroll position and behavior
- Libraries: react-window (lightweight), react-virtualized (full-featured)
- Consider for lists > 100 items or complex item components
- Works with both fixed and variable height items

**Interview Q: Implement virtualization for a list of 10,000 items.**

> **Answer:**
> 
> Using `react-window` (recommended for most cases):
> 
> ```jsx
> import { FixedSizeList, VariableSizeList } from 'react-window';
> 
> // Fixed height items
> function VirtualList({ items }) {
>   const Row = ({ index, style }) => (
>     <div style={style} className="list-item">
>       <span>{items[index].name}</span>
>       <span>{items[index].email}</span>
>     </div>
>   );
>   
>   return (
>     <FixedSizeList
>       height={600}           // Container height
>       itemCount={items.length}
>       itemSize={50}          // Row height
>       width="100%"
>     >
>       {Row}
>     </FixedSizeList>
>   );
> }
> 
> // Variable height items
> function VariableVirtualList({ items }) {
>   const listRef = useRef();
>   
>   const getItemSize = (index) => {
>     // Calculate based on content
>     return items[index].expanded ? 150 : 50;
>   };
>   
>   const Row = ({ index, style }) => (
>     <div style={style}>
>       <ExpandableItem item={items[index]} />
>     </div>
>   );
>   
>   return (
>     <VariableSizeList
>       ref={listRef}
>       height={600}
>       itemCount={items.length}
>       itemSize={getItemSize}
>       width="100%"
>     >
>       {Row}
>     </VariableSizeList>
>   );
> }
> 
> // With infinite scroll
> import { FixedSizeList } from 'react-window';
> import InfiniteLoader from 'react-window-infinite-loader';
> 
> function InfiniteList({ hasNextPage, loadMore, items }) {
>   const itemCount = hasNextPage ? items.length + 1 : items.length;
>   
>   const isItemLoaded = (index) => !hasNextPage || index < items.length;
>   
>   const Row = ({ index, style }) => {
>     if (!isItemLoaded(index)) {
>       return <div style={style}>Loading...</div>;
>     }
>     return <div style={style}>{items[index].name}</div>;
>   };
>   
>   return (
>     <InfiniteLoader
>       isItemLoaded={isItemLoaded}
>       itemCount={itemCount}
>       loadMoreItems={loadMore}
>     >
>       {({ onItemsRendered, ref }) => (
>         <FixedSizeList
>           ref={ref}
>           height={600}
>           itemCount={itemCount}
>           itemSize={50}
>           onItemsRendered={onItemsRendered}
>         >
>           {Row}
>         </FixedSizeList>
>       )}
>     </InfiniteLoader>
>   );
> }
> ```

**Gotchas:**
- Item styles must be applied via `style` prop (absolute positioning)
- Reset list when data changes: `listRef.current.resetAfterIndex(0)`
- Variable sizes need explicit reset after size changes
- Measure actual performance; small lists don't need virtualization

---

### 3.4 Avoiding Unnecessary Re-renders

**Concept:** Unnecessary re-renders happen when a component re-renders without producing different output. While React is fast, excessive re-renders can cause jank in complex UIs. Identifying and preventing them is key to React performance.

**Key Points:**
- Components re-render when: state changes, props change, parent re-renders, context changes
- React.memo prevents re-render if props haven't changed
- Stable references prevent child re-renders
- Lifting state up can reduce re-render scope
- Moving state down can isolate re-renders

**Interview Q: What causes unnecessary re-renders and how do you fix them?**

> **Answer:**
> 
> **Common causes and solutions:**
> 
> 1. **Inline object/array/function props:**
> ```jsx
> // Bad: new object every render
> <Child style={{ color: 'red' }} onClick={() => handleClick()} />
> 
> // Good: stable references
> const style = useMemo(() => ({ color: 'red' }), []);
> const handleChildClick = useCallback(() => handleClick(), []);
> <Child style={style} onClick={handleChildClick} />
> ```
> 
> 2. **State too high in tree:**
> ```jsx
> // Bad: entire App re-renders on input change
> function App() {
>   const [input, setInput] = useState('');
>   return (
>     <div>
>       <input value={input} onChange={e => setInput(e.target.value)} />
>       <ExpensiveTree />
>     </div>
>   );
> }
> 
> // Good: isolate state
> function SearchInput() {
>   const [input, setInput] = useState('');
>   return <input value={input} onChange={e => setInput(e.target.value)} />;
> }
> 
> function App() {
>   return (
>     <div>
>       <SearchInput />
>       <ExpensiveTree /> {/* Won't re-render */}
>     </div>
>   );
> }
> ```
> 
> 3. **Context causing cascading re-renders:**
> ```jsx
> // Bad: all consumers re-render when any context value changes
> const value = { user, theme, locale };
> 
> // Good: split by update frequency
> <UserContext.Provider value={user}>
>   <ThemeContext.Provider value={theme}>
>     {children}
>   </ThemeContext.Provider>
> </UserContext.Provider>
> ```
> 
> 4. **Missing memoization:**
> ```jsx
> // Child re-renders even with stable props
> function Child({ data }) { ... }
> 
> // Memoize the child
> const MemoizedChild = React.memo(Child);
> ```
> 
> **Debugging tools:**
> - React DevTools Profiler (highlight updates)
> - `console.log` in component body
> - Why Did You Render library

**Gotchas:**
- Re-renders aren't always bad; premature optimization wastes time
- Shallow comparison means new objects always trigger re-render
- Keys changing causes full remount (worse than re-render)

---

### 3.5 React DevTools Profiler Usage

**Concept:** The React DevTools Profiler records render timing information to identify performance bottlenecks. It shows what rendered, how long it took, and why components re-rendered. Essential for performance optimization.

**Key Points:**
- Record → interact → analyze
- Shows commit times and component render times
- "Why did this render?" shows re-render reasons
- Flamegraph view for hierarchical timing
- Ranked view for slowest components

**Interview Q: How do you use React DevTools Profiler to identify performance issues?**

> **Answer:**
> 
> **Step-by-step profiling workflow:**
> 
> 1. **Setup:**
> ```jsx
> // Enable profiling in production (if needed)
> // Use react-dom/profiling and scheduler/tracing-profiling
> import ReactDOM from 'react-dom/profiling';
> ```
> 
> 2. **Recording:**
> - Open React DevTools → Profiler tab
> - Click "Record" (blue circle)
> - Perform the slow interaction
> - Click "Stop"
> 
> 3. **Analysis views:**
> 
> **Flamegraph:** Shows component hierarchy and render times
> - Width = render time
> - Gray = didn't render
> - Colored = rendered (yellow/orange = slow)
> 
> **Ranked:** Components sorted by render time
> - Focus on top items first
> - Shows self time vs. total time
> 
> **Component view:** Select a component to see:
> - Props that changed
> - State that changed
> - Why it rendered
> 
> 4. **Interpreting results:**
> ```
> Component rendered because:
> - "Props changed" → check which prop, stabilize reference
> - "Parent rendered" → add React.memo
> - "Hooks changed" → check hook dependencies
> - "Context changed" → split context or memoize consumer
> ```
> 
> 5. **Programmatic profiling:**
> ```jsx
> import { Profiler } from 'react';
> 
> function onRenderCallback(
>   id,           // Profiler id
>   phase,        // "mount" or "update"
>   actualDuration, // Time spent rendering
>   baseDuration,   // Estimated time without memoization
>   startTime,
>   commitTime
> ) {
>   // Log or send to analytics
>   if (actualDuration > 16) {
>     console.warn(`Slow render: ${id} took ${actualDuration}ms`);
>   }
> }
> 
> <Profiler id="Navigation" onRender={onRenderCallback}>
>   <Navigation />
> </Profiler>
> ```

**Gotchas:**
- Development mode is slower; profile production build
- First render (mount) is always slower than updates
- Profiler adds overhead; disable in production

---

### 3.6 Bundle Size Optimization

**Concept:** Smaller bundles mean faster load times. Bundle optimization involves removing unused code (tree shaking), splitting code for lazy loading, and choosing lighter dependencies. Every kilobyte matters for initial load.

**Key Points:**
- Analyze with webpack-bundle-analyzer or source-map-explorer
- Tree shaking requires ES modules (import/export)
- Prefer specific imports over default imports
- Consider lighter alternatives for heavy libraries
- Dynamic imports for code splitting

**Interview Q: How do you analyze and reduce React bundle size?**

> **Answer:**
> 
> 1. **Analyze current bundle:**
> ```bash
> # Next.js
> ANALYZE=true npm run build
> 
> # Create React App
> npm install source-map-explorer
> npm run build
> npx source-map-explorer 'build/static/js/*.js'
> ```
> 
> 2. **Import optimization:**
> ```jsx
> // Bad: imports entire library
> import _ from 'lodash';
> import { Button } from '@mui/material';
> 
> // Good: specific imports (tree-shakeable)
> import debounce from 'lodash/debounce';
> import Button from '@mui/material/Button';
> 
> // Or use babel-plugin-import for automatic optimization
> ```
> 
> 3. **Replace heavy libraries:**
> ```
> moment.js (300KB) → date-fns (tree-shakeable) or dayjs (2KB)
> lodash (70KB) → native methods or lodash-es (tree-shakeable)
> axios (50KB) → fetch API (built-in)
> uuid (9KB) → crypto.randomUUID() (built-in)
> classnames (1KB) → template literals
> ```
> 
> 4. **Dynamic imports for heavy features:**
> ```jsx
> // Don't load chart library until needed
> const loadChart = async () => {
>   const { Chart } = await import('chart.js');
>   return Chart;
> };
> 
> // Or with React.lazy
> const HeavyEditor = lazy(() => import('monaco-editor'));
> ```
> 
> 5. **Next.js specific optimizations:**
> ```jsx
> // next.config.js
> module.exports = {
>   experimental: {
>     optimizePackageImports: ['@mui/material', 'lodash-es']
>   }
> };
> ```
> 
> 6. **Monitor in CI:**
> ```yaml
> # GitHub Action
> - name: Check bundle size
>   uses: preactjs/compressed-size-action@v2
>   with:
>     build-script: "build"
>     pattern: ".next/**/*.js"
> ```

**Gotchas:**
- Tree shaking only works with ES modules
- Some libraries export a single bundle (can't tree shake)
- SSR bundles are separate from client bundles
- Gzip/Brotli compression matters for transfer size

---

### 3.7 Web Vitals (LCP, FID, CLS)

**Concept:** Web Vitals are Google's metrics for measuring user experience. LCP (Largest Contentful Paint) measures loading, FID (First Input Delay) measures interactivity, and CLS (Cumulative Layout Shift) measures visual stability. They affect SEO rankings.

**Key Points:**
- **LCP**: Largest visible element render time (target: < 2.5s)
- **FID**: Time from first interaction to browser response (target: < 100ms)
- **CLS**: Visual stability score (target: < 0.1)
- INP (Interaction to Next Paint) is replacing FID
- Measure with Lighthouse, Chrome DevTools, or web-vitals library

**Interview Q: How do you measure and improve Core Web Vitals in a React app?**

> **Answer:**
> 
> **Measurement:**
> ```jsx
> // Install web-vitals library
> import { onLCP, onFID, onCLS, onINP, onTTFB } from 'web-vitals';
> 
> function sendToAnalytics(metric) {
>   console.log(metric.name, metric.value);
>   // Send to your analytics service
> }
> 
> onLCP(sendToAnalytics);
> onFID(sendToAnalytics);
> onCLS(sendToAnalytics);
> onINP(sendToAnalytics);
> onTTFB(sendToAnalytics);
> 
> // Next.js built-in
> export function reportWebVitals(metric) {
>   console.log(metric);
> }
> ```
> 
> **Improving LCP (Largest Contentful Paint):**
> ```jsx
> // Preload critical images
> <link rel="preload" href="/hero.jpg" as="image" />
> 
> // Use Next.js Image with priority
> import Image from 'next/image';
> <Image src="/hero.jpg" priority alt="Hero" />
> 
> // Minimize render-blocking resources
> // Use font-display: swap for custom fonts
> 
> // Server-side rendering for critical content
> export async function getServerSideProps() { }
> ```
> 
> **Improving FID/INP (Input Delay):**
> ```jsx
> // Break up long tasks
> const [isPending, startTransition] = useTransition();
> startTransition(() => {
>   setExpensiveState(newValue);
> });
> 
> // Use Web Workers for heavy computation
> const worker = new Worker('/worker.js');
> 
> // Lazy load non-critical JavaScript
> const HeavyComponent = lazy(() => import('./Heavy'));
> 
> // Debounce expensive handlers
> const handleInput = useDebouncedCallback((value) => {
>   processExpensiveSearch(value);
> }, 300);
> ```
> 
> **Improving CLS (Layout Shift):**
> ```jsx
> // Always include dimensions for images/videos
> <Image src="/img.jpg" width={800} height={600} alt="" />
> 
> // Reserve space for dynamic content
> <div style={{ minHeight: '200px' }}>
>   {isLoading ? <Skeleton /> : <Content />}
> </div>
> 
> // Avoid inserting content above existing content
> // Load fonts with font-display: optional
> 
> // Use CSS aspect-ratio
> .video-container {
>   aspect-ratio: 16 / 9;
> }
> ```

**Gotchas:**
- Lab data (Lighthouse) differs from field data (real users)
- Mobile scores are typically worse than desktop
- Third-party scripts can tank your scores
- CLS accumulates over page lifetime

---

## Part 4: Next.js Specific (App Router Focus)

### 4.1 Server Components vs Client Components

**Concept:** React Server Components (RSC) run only on the server and send zero JavaScript to the client. Client Components run on both server (SSR) and client (hydration). In Next.js App Router, components are Server Components by default.

**Key Points:**
- Server Components: default in app/ directory, no 'use client'
- Client Components: marked with 'use client' directive
- Server: can access DB, file system, secrets directly
- Client: required for interactivity, hooks, browser APIs
- Server Components can import Client Components, not vice versa

**Interview Q: When should you use Server vs Client Components in Next.js?**

> **Answer:**
> 
> **Use Server Components when:**
> - Fetching data from database/API
> - Accessing backend resources (file system, secrets)
> - Keeping large dependencies server-side
> - No interactivity needed
> - SEO-critical content
> 
> **Use Client Components when:**
> - Using hooks (useState, useEffect, etc.)
> - Adding event listeners (onClick, onChange)
> - Using browser APIs (localStorage, window)
> - Using context providers
> - Third-party libraries requiring client-side execution
> 
> ```jsx
> // Server Component (default) - app/page.tsx
> async function ProductPage({ params }) {
>   // Direct database access - no API needed
>   const product = await db.products.findById(params.id);
>   
>   return (
>     <div>
>       <h1>{product.name}</h1>
>       <p>{product.description}</p>
>       <AddToCartButton productId={product.id} /> {/* Client Component */}
>     </div>
>   );
> }
> 
> // Client Component - components/AddToCartButton.tsx
> 'use client';
> 
> import { useState } from 'react';
> 
> export function AddToCartButton({ productId }) {
>   const [isAdding, setIsAdding] = useState(false);
>   
>   async function handleClick() {
>     setIsAdding(true);
>     await addToCart(productId);
>     setIsAdding(false);
>   }
>   
>   return (
>     <button onClick={handleClick} disabled={isAdding}>
>       {isAdding ? 'Adding...' : 'Add to Cart'}
>     </button>
>   );
> }
> ```
> 
> **Composition pattern:**
> ```jsx
> // Server Component fetches data, passes to Client Component
> async function Comments({ postId }) {
>   const comments = await fetchComments(postId);
>   return <CommentList comments={comments} />; // Client Component for interactivity
> }
> ```

**Gotchas:**
- You can't import Server Components into Client Components
- Passing Server Component as children to Client Component works
- 'use client' marks the boundary; all imports become client
- Server Components can be async; Client Components cannot

---

### 4.2 SSR, SSG, ISR - When to Use Which

**Concept:** Next.js offers multiple rendering strategies. SSR (Server-Side Rendering) generates HTML per request. SSG (Static Site Generation) generates HTML at build time. ISR (Incremental Static Regeneration) combines both, serving static content while revalidating in the background.

**Key Points:**
- **SSR**: Fresh data every request, slower TTFB
- **SSG**: Fastest, but stale until rebuild
- **ISR**: Best of both - static with background updates
- App Router uses `fetch` options to control caching
- Can mix strategies within the same page

**Interview Q: Explain the rendering strategies in Next.js App Router.**

> **Answer:**
> 
> **Static (SSG) - Default:**
> ```jsx
> // Cached indefinitely (until revalidate or rebuild)
> async function Page() {
>   // fetch is cached by default
>   const data = await fetch('https://api.example.com/data');
>   return <div>{data}</div>;
> }
> 
> // Explicit static generation with params
> export async function generateStaticParams() {
>   const posts = await getPosts();
>   return posts.map(post => ({ slug: post.slug }));
> }
> ```
> 
> **Server-Side Rendering (SSR):**
> ```jsx
> // Force dynamic rendering
> async function Page() {
>   const data = await fetch('https://api.example.com/data', {
>     cache: 'no-store' // Never cache
>   });
>   return <div>{data}</div>;
> }
> 
> // Or use dynamic configuration
> export const dynamic = 'force-dynamic';
> ```
> 
> **Incremental Static Regeneration (ISR):**
> ```jsx
> // Revalidate every 60 seconds
> async function Page() {
>   const data = await fetch('https://api.example.com/data', {
>     next: { revalidate: 60 }
>   });
>   return <div>{data}</div>;
> }
> 
> // Page-level revalidation
> export const revalidate = 60;
> ```
> 
> **When to use each:**
> 
> | Strategy | Use When | Example |
> |----------|----------|---------|
> | SSG | Content rarely changes | Marketing pages, docs |
> | ISR | Content updates periodically | Blog, product listings |
> | SSR | Real-time/personalized data | Dashboard, user profile |
> 
> **On-demand revalidation:**
> ```jsx
> // app/api/revalidate/route.ts
> import { revalidatePath, revalidateTag } from 'next/cache';
> 
> export async function POST(request) {
>   revalidatePath('/blog'); // Revalidate entire path
>   revalidateTag('posts');  // Revalidate by cache tag
>   return Response.json({ revalidated: true });
> }
> ```

**Gotchas:**
- Default fetch in App Router is cached (opposite of Pages Router)
- `cookies()` or `headers()` automatically makes page dynamic
- ISR revalidation happens in background; users see stale content first
- Use `generateStaticParams` for dynamic routes in static builds

---

### 4.3 App Router vs Pages Router Differences

**Concept:** Next.js 13+ introduced the App Router with React Server Components, nested layouts, and a new data fetching model. The Pages Router is the legacy approach using `getServerSideProps`, `getStaticProps`, and file-based routing in the pages directory.

**Key Points:**
- App Router: `app/` directory, Server Components default
- Pages Router: `pages/` directory, Client Components default
- App: nested layouts with `layout.tsx`
- Pages: `_app.tsx` and `_document.tsx` for customization
- Both can coexist during migration

**Interview Q: What are the key differences between App Router and Pages Router?**

> **Answer:**
> 
> | Feature | Pages Router | App Router |
> |---------|--------------|------------|
> | Directory | `pages/` | `app/` |
> | Default | Client Components | Server Components |
> | Data Fetching | `getServerSideProps`, `getStaticProps` | `async` components, `fetch` |
> | Layouts | `_app.tsx` (single) | `layout.tsx` (nested) |
> | Loading UI | Manual | `loading.tsx` |
> | Error Handling | `_error.tsx` | `error.tsx` (nested) |
> | Metadata | `Head` component | `metadata` export |
> | API Routes | `pages/api/` | `app/api/route.ts` |
> 
> **Data Fetching comparison:**
> ```jsx
> // Pages Router
> export async function getServerSideProps({ params }) {
>   const data = await fetchData(params.id);
>   return { props: { data } };
> }
> 
> export default function Page({ data }) {
>   return <div>{data.title}</div>;
> }
> 
> // App Router
> async function Page({ params }) {
>   const data = await fetchData(params.id);
>   return <div>{data.title}</div>;
> }
> ```
> 
> **Layouts comparison:**
> ```jsx
> // Pages Router - _app.tsx (wraps all pages)
> function MyApp({ Component, pageProps }) {
>   return (
>     <Layout>
>       <Component {...pageProps} />
>     </Layout>
>   );
> }
> 
> // App Router - layout.tsx (can be nested)
> // app/layout.tsx (root)
> export default function RootLayout({ children }) {
>   return (
>     <html><body><Header />{children}<Footer /></body></html>
>   );
> }
> 
> // app/dashboard/layout.tsx (nested)
> export default function DashboardLayout({ children }) {
>   return (
>     <div className="dashboard">
>       <Sidebar />
>       <main>{children}</main>
>     </div>
>   );
> }
> ```
> 
> **Loading states:**
> ```jsx
> // Pages Router - manual
> function Page() {
>   const { data, isLoading } = useSWR('/api/data');
>   if (isLoading) return <Spinner />;
>   return <div>{data}</div>;
> }
> 
> // App Router - loading.tsx
> // app/dashboard/loading.tsx
> export default function Loading() {
>   return <DashboardSkeleton />;
> }
> ```

**Gotchas:**
- Can't use `getServerSideProps`/`getStaticProps` in App Router
- `useRouter` from `next/navigation` (App) vs `next/router` (Pages)
- Middleware works the same in both
- Client Components in App Router still SSR on first load

---

### 4.4 Data Fetching Strategies (fetch, Server Actions)

**Concept:** Next.js App Router extends the native fetch API with caching and revalidation. Server Actions allow calling server functions directly from client components without creating API endpoints. This simplifies data mutations.

**Key Points:**
- fetch: extended with caching options
- Server Actions: marked with 'use server'
- Can use any data fetching library (Prisma, Drizzle)
- Parallel fetching with Promise.all
- Sequential fetching when data depends on previous fetch

**Interview Q: How do you fetch data and handle mutations in Next.js App Router?**

> **Answer:**
> 
> **Data Fetching in Server Components:**
> ```jsx
> // Parallel fetching - faster
> async function Dashboard() {
>   const [user, posts, analytics] = await Promise.all([
>     fetch('/api/user').then(r => r.json()),
>     fetch('/api/posts').then(r => r.json()),
>     fetch('/api/analytics').then(r => r.json())
>   ]);
>   
>   return (
>     <div>
>       <UserCard user={user} />
>       <PostsList posts={posts} />
>       <Analytics data={analytics} />
>     </div>
>   );
> }
> 
> // Sequential fetching - when dependent
> async function UserPosts({ userId }) {
>   const user = await fetch(`/api/users/${userId}`).then(r => r.json());
>   const posts = await fetch(`/api/posts?author=${user.id}`).then(r => r.json());
>   
>   return <PostsList posts={posts} author={user.name} />;
> }
> ```
> 
> **Server Actions for mutations:**
> ```jsx
> // app/actions.ts
> 'use server';
> 
> import { revalidatePath } from 'next/cache';
> 
> export async function createPost(formData: FormData) {
>   const title = formData.get('title');
>   const content = formData.get('content');
>   
>   await db.posts.create({ data: { title, content } });
>   
>   revalidatePath('/posts'); // Refresh the posts page
> }
> 
> export async function deletePost(postId: string) {
>   await db.posts.delete({ where: { id: postId } });
>   revalidatePath('/posts');
> }
> ```
> 
> **Using Server Actions:**
> ```jsx
> // In Server Component - form action
> import { createPost } from './actions';
> 
> function NewPostForm() {
>   return (
>     <form action={createPost}>
>       <input name="title" required />
>       <textarea name="content" required />
>       <button type="submit">Create Post</button>
>     </form>
>   );
> }
> 
> // In Client Component - with useTransition
> 'use client';
> 
> import { useTransition } from 'react';
> import { deletePost } from './actions';
> 
> function DeleteButton({ postId }) {
>   const [isPending, startTransition] = useTransition();
>   
>   return (
>     <button
>       onClick={() => startTransition(() => deletePost(postId))}
>       disabled={isPending}
>     >
>       {isPending ? 'Deleting...' : 'Delete'}
>     </button>
>   );
> }
> ```
> 
> **Form handling with useFormState:**
> ```jsx
> 'use client';
> 
> import { useFormState } from 'react-dom';
> import { createUser } from './actions';
> 
> const initialState = { message: '', errors: {} };
> 
> function SignupForm() {
>   const [state, formAction] = useFormState(createUser, initialState);
>   
>   return (
>     <form action={formAction}>
>       <input name="email" />
>       {state.errors?.email && <p>{state.errors.email}</p>}
>       <button>Sign Up</button>
>       {state.message && <p>{state.message}</p>}
>     </form>
>   );
> }
> ```

**Gotchas:**
- Server Actions must be in files with 'use server' or inside functions with 'use server'
- Server Actions are POST requests under the hood
- Use `redirect()` from `next/navigation` inside Server Actions
- Form data is serialized; can't pass complex objects directly

---

### 4.5 Middleware and Edge Functions

**Concept:** Middleware runs before a request is completed, allowing you to modify the response by rewriting, redirecting, or modifying headers. It runs at the Edge, close to users for low latency. Common uses include auth, redirects, and A/B testing.

**Key Points:**
- Single `middleware.ts` at project root
- Runs on all routes by default; use matcher to filter
- Executes before cached content and routes
- Limited runtime (Edge) - no Node.js APIs
- Can't modify response body (only headers/redirects)

**Interview Q: How do you implement authentication middleware in Next.js?**

> **Answer:**
> 
> ```typescript
> // middleware.ts (project root)
> import { NextResponse } from 'next/server';
> import type { NextRequest } from 'next/server';
> 
> export function middleware(request: NextRequest) {
>   const token = request.cookies.get('auth-token');
>   const { pathname } = request.nextUrl;
>   
>   // Public paths that don't require auth
>   const publicPaths = ['/login', '/signup', '/api/auth'];
>   const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
>   
>   // Redirect to login if not authenticated
>   if (!token && !isPublicPath) {
>     const loginUrl = new URL('/login', request.url);
>     loginUrl.searchParams.set('from', pathname);
>     return NextResponse.redirect(loginUrl);
>   }
>   
>   // Redirect to dashboard if already logged in
>   if (token && pathname === '/login') {
>     return NextResponse.redirect(new URL('/dashboard', request.url));
>   }
>   
>   // Add custom headers
>   const response = NextResponse.next();
>   response.headers.set('x-pathname', pathname);
>   
>   return response;
> }
> 
> // Configure which routes to run middleware on
> export const config = {
>   matcher: [
>     // Match all paths except static files and images
>     '/((?!_next/static|_next/image|favicon.ico).*)',
>   ],
> };
> ```
> 
> **Geolocation-based routing:**
> ```typescript
> export function middleware(request: NextRequest) {
>   const country = request.geo?.country || 'US';
>   
>   // Redirect to country-specific page
>   if (country === 'DE' && !request.nextUrl.pathname.startsWith('/de')) {
>     return NextResponse.redirect(new URL('/de' + request.nextUrl.pathname, request.url));
>   }
>   
>   return NextResponse.next();
> }
> ```
> 
> **A/B Testing:**
> ```typescript
> export function middleware(request: NextRequest) {
>   const bucket = request.cookies.get('ab-bucket');
>   
>   if (!bucket) {
>     const response = NextResponse.next();
>     const variant = Math.random() < 0.5 ? 'control' : 'experiment';
>     response.cookies.set('ab-bucket', variant);
>     return response;
>   }
>   
>   // Rewrite to variant page
>   if (bucket.value === 'experiment') {
>     return NextResponse.rewrite(new URL('/experiment' + request.nextUrl.pathname, request.url));
>   }
>   
>   return NextResponse.next();
> }
> ```
> 
> **Rate limiting (basic):**
> ```typescript
> const rateLimit = new Map();
> 
> export function middleware(request: NextRequest) {
>   const ip = request.ip ?? 'anonymous';
>   const now = Date.now();
>   const windowMs = 60000; // 1 minute
>   const maxRequests = 100;
>   
>   const requestCount = rateLimit.get(ip) || { count: 0, start: now };
>   
>   if (now - requestCount.start > windowMs) {
>     requestCount.count = 0;
>     requestCount.start = now;
>   }
>   
>   requestCount.count++;
>   rateLimit.set(ip, requestCount);
>   
>   if (requestCount.count > maxRequests) {
>     return new NextResponse('Too Many Requests', { status: 429 });
>   }
>   
>   return NextResponse.next();
> }
> ```

**Gotchas:**
- Edge Runtime has limited APIs (no fs, limited crypto)
- Middleware can't read or modify response body
- Runs on every request matching config.matcher
- Use `unstable_allowDynamic` for dynamic code evaluation

---

### 4.6 Image and Font Optimization

**Concept:** Next.js provides built-in optimization for images and fonts. The Image component automatically resizes, optimizes formats (WebP, AVIF), and lazy loads images. Font optimization preloads fonts and eliminates layout shift.

**Key Points:**
- `next/image`: automatic optimization, lazy loading, responsive
- `next/font`: zero layout shift, self-hosting, preloading
- Images are optimized on-demand and cached
- Supports blur placeholder for better UX
- Priority prop for LCP images

**Interview Q: How do you optimize images and fonts in Next.js?**

> **Answer:**
> 
> **Image optimization:**
> ```jsx
> import Image from 'next/image';
> 
> // Basic usage
> function Hero() {
>   return (
>     <Image
>       src="/hero.jpg"
>       alt="Hero image"
>       width={1200}
>       height={600}
>       priority // Load immediately (LCP image)
>     />
>   );
> }
> 
> // Responsive images
> function ResponsiveImage() {
>   return (
>     <Image
>       src="/photo.jpg"
>       alt="Photo"
>       fill // Fill parent container
>       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
>       style={{ objectFit: 'cover' }}
>     />
>   );
> }
> 
> // With blur placeholder
> import heroImage from '@/public/hero.jpg';
> 
> function BlurredHero() {
>   return (
>     <Image
>       src={heroImage}
>       alt="Hero"
>       placeholder="blur" // Automatic blur data for static imports
>     />
>   );
> }
> 
> // Remote images (must configure domains)
> // next.config.js
> module.exports = {
>   images: {
>     remotePatterns: [
>       { protocol: 'https', hostname: 'cdn.example.com' },
>     ],
>   },
> };
> ```
> 
> **Font optimization:**
> ```jsx
> // app/layout.tsx
> import { Inter, Roboto_Mono } from 'next/font/google';
> 
> // Variable font (recommended)
> const inter = Inter({
>   subsets: ['latin'],
>   display: 'swap',
>   variable: '--font-inter',
> });
> 
> // Specific weights
> const roboto = Roboto_Mono({
>   subsets: ['latin'],
>   weight: ['400', '700'],
>   variable: '--font-roboto-mono',
> });
> 
> export default function RootLayout({ children }) {
>   return (
>     <html lang="en" className={`${inter.variable} ${roboto.variable}`}>
>       <body className={inter.className}>{children}</body>
>     </html>
>   );
> }
> 
> // In CSS/Tailwind
> // tailwind.config.js
> module.exports = {
>   theme: {
>     fontFamily: {
>       sans: ['var(--font-inter)'],
>       mono: ['var(--font-roboto-mono)'],
>     },
>   },
> };
> 
> // Local fonts
> import localFont from 'next/font/local';
> 
> const myFont = localFont({
>   src: [
>     { path: './fonts/Regular.woff2', weight: '400' },
>     { path: './fonts/Bold.woff2', weight: '700' },
>   ],
> });
> ```

**Gotchas:**
- Image `fill` prop requires parent with `position: relative`
- Remote images need domains/remotePatterns config
- `priority` should only be used for above-the-fold images
- Fonts are cached at build time; no runtime Google calls

---

### 4.7 Caching and Revalidation

**Concept:** Next.js has multiple caching layers: Request Memoization, Data Cache, Full Route Cache, and Router Cache. Understanding these helps optimize performance and ensure data freshness. Each layer can be configured independently.

**Key Points:**
- **Request Memoization**: Dedupes same fetches in one render
- **Data Cache**: Persists fetch results across requests
- **Full Route Cache**: Caches rendered HTML/RSC payload
- **Router Cache**: Client-side cache for visited routes
- `revalidatePath` / `revalidateTag` for on-demand invalidation

**Interview Q: Explain the caching layers in Next.js and how to control them.**

> **Answer:**
> 
> **The four caching layers:**
> 
> 1. **Request Memoization** (automatic, per-request):
> ```jsx
> // Same fetch called multiple times = one actual request
> async function Page() {
>   const user = await getUser(); // fetch #1
>   const posts = await getUserPosts(); // calls getUser() again
>   // getUser() is deduplicated - only one actual fetch
> }
> 
> async function getUser() {
>   return fetch('/api/user'); // Automatically memoized
> }
> ```
> 
> 2. **Data Cache** (persistent, across requests):
> ```jsx
> // Cached indefinitely (default)
> fetch('https://api.example.com/data');
> 
> // Cache with revalidation
> fetch('https://api.example.com/data', {
>   next: { revalidate: 3600 } // Revalidate every hour
> });
> 
> // No caching
> fetch('https://api.example.com/data', {
>   cache: 'no-store'
> });
> 
> // Cache with tags for targeted invalidation
> fetch('https://api.example.com/posts', {
>   next: { tags: ['posts'] }
> });
> ```
> 
> 3. **Full Route Cache** (HTML/RSC payload):
> ```jsx
> // Static routes are cached at build time
> // Dynamic routes skip this cache
> 
> // Force dynamic (skip Full Route Cache)
> export const dynamic = 'force-dynamic';
> 
> // Force static
> export const dynamic = 'force-static';
> ```
> 
> 4. **Router Cache** (client-side, 30s default):
> ```jsx
> // Automatic prefetching and caching
> import Link from 'next/link';
> <Link href="/dashboard">Dashboard</Link>
> 
> // Programmatic navigation
> import { useRouter } from 'next/navigation';
> const router = useRouter();
> router.push('/dashboard');
> router.refresh(); // Invalidate and refetch current route
> ```
> 
> **On-demand revalidation:**
> ```jsx
> // app/api/revalidate/route.ts
> import { revalidatePath, revalidateTag } from 'next/cache';
> 
> export async function POST(request: Request) {
>   const { path, tag } = await request.json();
>   
>   if (path) {
>     revalidatePath(path);       // Revalidate specific path
>     revalidatePath('/blog', 'page');   // Only the page, not layout
>     revalidatePath('/blog', 'layout'); // Layout and all child pages
>   }
>   
>   if (tag) {
>     revalidateTag(tag); // Revalidate all fetches with this tag
>   }
>   
>   return Response.json({ revalidated: true });
> }
> 
> // Usage: After content update in CMS
> await fetch('/api/revalidate', {
>   method: 'POST',
>   body: JSON.stringify({ tag: 'posts' })
> });
> ```
> 
> **Opting out of caching:**
> ```jsx
> // Page level
> export const revalidate = 0; // Same as cache: 'no-store'
> 
> // Using dynamic functions automatically opts out
> import { cookies, headers } from 'next/headers';
> 
> async function Page() {
>   const cookieStore = cookies(); // Makes page dynamic
>   // ...
> }
> ```

**Gotchas:**
- Default fetch caching is opposite of Pages Router (cached vs uncached)
- `cookies()`, `headers()` make entire page dynamic
- Router Cache on client can serve stale content for 30 seconds
- Use `revalidateTag` for fine-grained cache control

---

### 4.8 API Routes and Route Handlers

**Concept:** Route Handlers in Next.js App Router replace API Routes from Pages Router. They are defined in `route.ts` files and support standard Web Request/Response APIs. They can be static or dynamic and support multiple HTTP methods.

**Key Points:**
- File: `app/api/*/route.ts`
- Export functions named after HTTP methods (GET, POST, etc.)
- Use Web Request/Response APIs
- Can be static (cached) or dynamic
- Colocate with page files (but can't have both route.ts and page.ts in same folder)

**Interview Q: How do you create and optimize API routes in Next.js App Router?**

> **Answer:**
> 
> **Basic Route Handler:**
> ```typescript
> // app/api/users/route.ts
> import { NextRequest, NextResponse } from 'next/server';
> 
> // GET /api/users
> export async function GET(request: NextRequest) {
>   const searchParams = request.nextUrl.searchParams;
>   const limit = searchParams.get('limit') || '10';
>   
>   const users = await db.users.findMany({ take: parseInt(limit) });
>   
>   return NextResponse.json(users);
> }
> 
> // POST /api/users
> export async function POST(request: NextRequest) {
>   const body = await request.json();
>   
>   const user = await db.users.create({ data: body });
>   
>   return NextResponse.json(user, { status: 201 });
> }
> ```
> 
> **Dynamic route with params:**
> ```typescript
> // app/api/users/[id]/route.ts
> export async function GET(
>   request: NextRequest,
>   { params }: { params: { id: string } }
> ) {
>   const user = await db.users.findUnique({ where: { id: params.id } });
>   
>   if (!user) {
>     return NextResponse.json({ error: 'Not found' }, { status: 404 });
>   }
>   
>   return NextResponse.json(user);
> }
> 
> export async function DELETE(
>   request: NextRequest,
>   { params }: { params: { id: string } }
> ) {
>   await db.users.delete({ where: { id: params.id } });
>   return new NextResponse(null, { status: 204 });
> }
> ```
> 
> **Caching and revalidation:**
> ```typescript
> // Static route (cached at build time)
> export async function GET() {
>   const data = await fetch('https://api.example.com/static');
>   return NextResponse.json(data);
> }
> 
> // Dynamic route (per-request)
> export const dynamic = 'force-dynamic';
> 
> // Or use request object (automatically dynamic)
> export async function GET(request: NextRequest) {
>   const token = request.headers.get('authorization');
>   // ...
> }
> 
> // ISR-style caching
> export const revalidate = 60; // Revalidate every 60 seconds
> ```
> 
> **Streaming responses:**
> ```typescript
> export async function GET() {
>   const encoder = new TextEncoder();
>   
>   const stream = new ReadableStream({
>     async start(controller) {
>       for (let i = 0; i < 10; i++) {
>         controller.enqueue(encoder.encode(`data: ${i}\n\n`));
>         await new Promise(resolve => setTimeout(resolve, 1000));
>       }
>       controller.close();
>     },
>   });
>   
>   return new Response(stream, {
>     headers: {
>       'Content-Type': 'text/event-stream',
>       'Cache-Control': 'no-cache',
>     },
>   });
> }
> ```
> 
> **CORS handling:**
> ```typescript
> export async function OPTIONS() {
>   return new NextResponse(null, {
>     status: 204,
>     headers: {
>       'Access-Control-Allow-Origin': '*',
>       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
>       'Access-Control-Allow-Headers': 'Content-Type, Authorization',
>     },
>   });
> }
> 
> export async function GET() {
>   const response = NextResponse.json({ data: 'example' });
>   response.headers.set('Access-Control-Allow-Origin', '*');
>   return response;
> }
> ```

**Gotchas:**
- Can't have `route.ts` and `page.ts` in same folder
- Reading request body (`request.json()`) makes route dynamic
- `NextResponse.json()` is shorthand for `new Response(JSON.stringify())`
- Use `export const runtime = 'edge'` for Edge Runtime

---

## Part 5: Design Patterns & Architecture

### 5.1 Component Composition Patterns

**Concept:** Composition is the primary way to build complex UIs in React. Instead of inheritance, React encourages composing components together. Good composition leads to reusable, maintainable, and flexible component APIs.

**Key Points:**
- Favor composition over inheritance
- Use `children` prop for generic containers
- Use named slots (multiple children props) for complex layouts
- Composition enables inversion of control
- Specialized components can wrap generic ones

**Interview Q: Explain component composition and its advantages over inheritance.**

> **Answer:**
> 
> **Composition** passes components as props or children:
> ```jsx
> // Generic container (accepts any children)
> function Card({ children, title }) {
>   return (
>     <div className="card">
>       <h2>{title}</h2>
>       <div className="card-body">{children}</div>
>     </div>
>   );
> }
> 
> // Usage - compose different content
> <Card title="User Profile">
>   <Avatar user={user} />
>   <UserInfo user={user} />
> </Card>
> 
> <Card title="Settings">
>   <SettingsForm />
> </Card>
> ```
> 
> **Named slots pattern** (multiple children):
> ```jsx
> function Layout({ header, sidebar, content, footer }) {
>   return (
>     <div className="layout">
>       <header>{header}</header>
>       <aside>{sidebar}</aside>
>       <main>{content}</main>
>       <footer>{footer}</footer>
>     </div>
>   );
> }
> 
> // Usage
> <Layout
>   header={<Navigation />}
>   sidebar={<UserMenu />}
>   content={<Dashboard />}
>   footer={<Copyright />}
> />
> ```
> 
> **Specialization pattern:**
> ```jsx
> // Generic button
> function Button({ variant, children, ...props }) {
>   return <button className={`btn btn-${variant}`} {...props}>{children}</button>;
> }
> 
> // Specialized buttons (composition, not inheritance)
> function PrimaryButton(props) {
>   return <Button variant="primary" {...props} />;
> }
> 
> function DangerButton(props) {
>   return <Button variant="danger" {...props} />;
> }
> ```
> 
> **Why composition over inheritance:**
> - Inheritance creates tight coupling
> - Composition is more flexible (swap parts at runtime)
> - Easier to test individual pieces
> - Better for tree-shaking (unused components not bundled)
> - React team explicitly recommends composition

**Gotchas:**
- Avoid prop drilling through many levels (use Context)
- Don't over-abstract; composition should simplify, not complicate
- `children` is a prop like any other; can be conditional

---

### 5.2 Render Props vs HOCs vs Hooks

**Concept:** These are three patterns for sharing stateful logic between components. Render Props pass a function as children/prop. HOCs wrap components to inject props. Hooks are the modern approach, extracting logic into reusable functions.

**Key Points:**
- **Render Props**: Function as child, explicit data flow
- **HOCs**: Wrapper components, can cause prop collision
- **Hooks**: Modern standard, composable, no wrapper hell
- Hooks have largely replaced render props and HOCs
- Each pattern still has valid use cases

**Interview Q: Compare render props, HOCs, and hooks. When would you use each?**

> **Answer:**
> 
> **Render Props** - function as children:
> ```jsx
> // Render prop component
> function MouseTracker({ render }) {
>   const [position, setPosition] = useState({ x: 0, y: 0 });
>   
>   useEffect(() => {
>     const handleMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
>     window.addEventListener('mousemove', handleMove);
>     return () => window.removeEventListener('mousemove', handleMove);
>   }, []);
>   
>   return render(position);
> }
> 
> // Usage
> <MouseTracker render={({ x, y }) => (
>   <div>Mouse: {x}, {y}</div>
> )} />
> 
> // Or as children
> <MouseTracker>
>   {({ x, y }) => <div>Mouse: {x}, {y}</div>}
> </MouseTracker>
> ```
> 
> **Higher-Order Components (HOCs):**
> ```jsx
> // HOC definition
> function withMousePosition(WrappedComponent) {
>   return function WithMousePosition(props) {
>     const [position, setPosition] = useState({ x: 0, y: 0 });
>     
>     useEffect(() => {
>       const handleMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
>       window.addEventListener('mousemove', handleMove);
>       return () => window.removeEventListener('mousemove', handleMove);
>     }, []);
>     
>     return <WrappedComponent {...props} mousePosition={position} />;
>   };
> }
> 
> // Usage
> const EnhancedComponent = withMousePosition(MyComponent);
> // MyComponent receives mousePosition prop
> ```
> 
> **Custom Hooks** (modern approach):
> ```jsx
> // Custom hook
> function useMousePosition() {
>   const [position, setPosition] = useState({ x: 0, y: 0 });
>   
>   useEffect(() => {
>     const handleMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
>     window.addEventListener('mousemove', handleMove);
>     return () => window.removeEventListener('mousemove', handleMove);
>   }, []);
>   
>   return position;
> }
> 
> // Usage - clean and composable
> function MyComponent() {
>   const { x, y } = useMousePosition();
>   return <div>Mouse: {x}, {y}</div>;
> }
> ```
> 
> **Comparison:**
> 
> | Aspect | Render Props | HOCs | Hooks |
> |--------|--------------|------|-------|
> | Wrapper nesting | Yes | Yes | No |
> | Prop collision | No | Yes | No |
> | Composability | Good | Okay | Best |
> | DevTools clarity | Messy | Messy | Clean |
> | TypeScript support | Okay | Hard | Best |
> | Modern usage | Rare | Legacy | Standard |
> 
> **When to use each:**
> - **Hooks**: Default choice for new code
> - **Render Props**: When you need to render different UI based on shared logic
> - **HOCs**: Legacy code, or cross-cutting concerns like analytics wrappers

**Gotchas:**
- HOCs can break `ref` forwarding (need `forwardRef`)
- Multiple HOCs create "wrapper hell" in DevTools
- Render props can cause unnecessary re-renders if function recreated
- Hooks can only be called at top level of components

---

### 5.3 State Management Approaches (Context, Zustand, Redux)

**Concept:** State management solutions help share state across components. React Context is built-in but limited. External libraries like Zustand (lightweight) and Redux (full-featured) offer more capabilities for complex applications.

**Key Points:**
- **Context**: Built-in, good for low-frequency updates (theme, auth)
- **Zustand**: Minimal API, no boilerplate, hooks-based
- **Redux**: Predictable, middleware, DevTools, large ecosystem
- Choose based on app complexity and team familiarity
- Don't use global state for everything; local state is often better

**Interview Q: How do you choose between Context, Zustand, and Redux?**

> **Answer:**
> 
> **React Context** - Built-in, simple:
> ```jsx
> // Good for: theme, auth, locale (infrequent updates)
> const ThemeContext = createContext('light');
> 
> function ThemeProvider({ children }) {
>   const [theme, setTheme] = useState('light');
>   const value = useMemo(() => ({ theme, setTheme }), [theme]);
>   return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
> }
> 
> // Usage
> function ThemedButton() {
>   const { theme, setTheme } = useContext(ThemeContext);
>   return <button className={theme}>Toggle</button>;
> }
> ```
> 
> **Zustand** - Minimal, flexible:
> ```jsx
> // Good for: Medium apps, when you want simplicity
> import { create } from 'zustand';
> 
> const useStore = create((set, get) => ({
>   count: 0,
>   users: [],
>   increment: () => set((state) => ({ count: state.count + 1 })),
>   fetchUsers: async () => {
>     const users = await api.getUsers();
>     set({ users });
>   },
>   // Selectors built-in
>   doubleCount: () => get().count * 2,
> }));
> 
> // Usage - automatic re-render optimization
> function Counter() {
>   const count = useStore((state) => state.count); // Only re-renders when count changes
>   const increment = useStore((state) => state.increment);
>   return <button onClick={increment}>{count}</button>;
> }
> 
> // Zustand with persistence
> import { persist } from 'zustand/middleware';
> 
> const useStore = create(
>   persist(
>     (set) => ({ count: 0 }),
>     { name: 'my-storage' }
>   )
> );
> ```
> 
> **Redux Toolkit** - Full-featured:
> ```jsx
> // Good for: Large apps, complex state, team standardization
> import { createSlice, configureStore } from '@reduxjs/toolkit';
> 
> const counterSlice = createSlice({
>   name: 'counter',
>   initialState: { value: 0 },
>   reducers: {
>     increment: (state) => { state.value += 1; }, // Immer allows "mutation"
>     decrement: (state) => { state.value -= 1; },
>     incrementByAmount: (state, action) => { state.value += action.payload; },
>   },
> });
> 
> const store = configureStore({
>   reducer: { counter: counterSlice.reducer },
> });
> 
> // Usage
> function Counter() {
>   const count = useSelector((state) => state.counter.value);
>   const dispatch = useDispatch();
>   return <button onClick={() => dispatch(increment())}>{count}</button>;
> }
> ```
> 
> **Decision matrix:**
> 
> | Factor | Context | Zustand | Redux |
> |--------|---------|---------|-------|
> | Bundle size | 0 KB | ~1 KB | ~10 KB |
> | Boilerplate | Low | Very Low | Medium |
> | DevTools | Limited | Basic | Excellent |
> | Middleware | No | Yes | Yes |
> | Selectors | Manual | Built-in | Built-in |
> | Learning curve | Easy | Easy | Medium |
> | Best for | Auth, Theme | Medium apps | Large apps |

**Gotchas:**
- Context re-renders all consumers on any change (no selectors)
- Zustand store is outside React; be careful with SSR
- Redux requires more setup but offers better debugging
- Don't put everything in global state; colocate state when possible

---

### 5.4 Container/Presentational Pattern

**Concept:** This pattern separates components into "containers" (handle logic/data) and "presentational" (handle UI). While less common with hooks, it's still useful for separating concerns and improving testability.

**Key Points:**
- Containers: fetch data, manage state, handle business logic
- Presentational: receive props, render UI, no side effects
- Hooks reduced the need but pattern still valuable
- Improves testability (UI components are pure)
- Enables design system development

**Interview Q: Is the Container/Presentational pattern still relevant with hooks?**

> **Answer:**
> 
> The pattern is **less necessary** but **still valuable** for certain scenarios:
> 
> **Traditional approach (before hooks):**
> ```jsx
> // Container - handles logic
> class UserListContainer extends Component {
>   state = { users: [], loading: true };
>   
>   componentDidMount() {
>     fetchUsers().then(users => this.setState({ users, loading: false }));
>   }
>   
>   render() {
>     return <UserList users={this.state.users} loading={this.state.loading} />;
>   }
> }
> 
> // Presentational - pure UI
> function UserList({ users, loading }) {
>   if (loading) return <Spinner />;
>   return (
>     <ul>
>       {users.map(user => <li key={user.id}>{user.name}</li>)}
>     </ul>
>   );
> }
> ```
> 
> **Modern approach with hooks:**
> ```jsx
> // Custom hook replaces container
> function useUsers() {
>   const [users, setUsers] = useState([]);
>   const [loading, setLoading] = useState(true);
>   
>   useEffect(() => {
>     fetchUsers().then(data => {
>       setUsers(data);
>       setLoading(false);
>     });
>   }, []);
>   
>   return { users, loading };
> }
> 
> // Component uses hook directly
> function UserList() {
>   const { users, loading } = useUsers();
>   
>   if (loading) return <Spinner />;
>   return (
>     <ul>
>       {users.map(user => <li key={user.id}>{user.name}</li>)}
>     </ul>
>   );
> }
> ```
> 
> **When the pattern is still useful:**
> 
> 1. **Design Systems** - Presentational components are design tokens:
> ```jsx
> // Presentational (in design system)
> function Button({ variant, size, children, ...props }) {
>   return (
>     <button className={`btn btn-${variant} btn-${size}`} {...props}>
>       {children}
>     </button>
>   );
> }
> 
> // Container (in app)
> function SubmitButton() {
>   const { submit, isSubmitting } = useForm();
>   return (
>     <Button variant="primary" onClick={submit} disabled={isSubmitting}>
>       {isSubmitting ? 'Saving...' : 'Submit'}
>     </Button>
>   );
> }
> ```
> 
> 2. **Storybook/Testing** - Pure components are easier to test:
> ```jsx
> // Easy to test with different props
> <UserCard 
>   user={{ name: 'John', avatar: '/john.jpg' }}
>   onEdit={mockFn}
>   isEditing={false}
> />
> ```
> 
> 3. **Server Components in Next.js:**
> ```jsx
> // Server Component (container) - fetches data
> async function UserPage({ params }) {
>   const user = await fetchUser(params.id);
>   return <UserProfile user={user} />;
> }
> 
> // Client Component (presentational) - handles interaction
> 'use client';
> function UserProfile({ user }) {
>   return <div>{user.name}</div>;
> }
> ```

**Gotchas:**
- Don't force the pattern everywhere; hooks often suffice
- "Container" and "Presentational" are roles, not strict categories
- A component can be presentational for UI but have local state

---

### 5.5 Compound Components

**Concept:** Compound components are a pattern where a parent component shares implicit state with its children. This creates flexible, declarative APIs similar to native HTML elements like `<select>` and `<option>`.

**Key Points:**
- Parent manages state, children consume via Context
- Enables flexible composition of related components
- Common in UI libraries (tabs, accordions, menus)
- More declarative than prop drilling
- Can use `React.Children` or Context API

**Interview Q: Implement a compound component pattern for a Tabs component.**

> **Answer:**
> 
> ```jsx
> import { createContext, useContext, useState } from 'react';
> 
> // Context for sharing state
> const TabsContext = createContext();
> 
> // Parent component
> function Tabs({ defaultValue, children }) {
>   const [activeTab, setActiveTab] = useState(defaultValue);
>   
>   const value = {
>     activeTab,
>     setActiveTab,
>   };
>   
>   return (
>     <TabsContext.Provider value={value}>
>       <div className="tabs">{children}</div>
>     </TabsContext.Provider>
>   );
> }
> 
> // TabList - container for Tab buttons
> function TabList({ children }) {
>   return <div className="tab-list" role="tablist">{children}</div>;
> }
> 
> // Tab - individual tab button
> function Tab({ value, children }) {
>   const { activeTab, setActiveTab } = useContext(TabsContext);
>   const isActive = activeTab === value;
>   
>   return (
>     <button
>       role="tab"
>       aria-selected={isActive}
>       className={`tab ${isActive ? 'active' : ''}`}
>       onClick={() => setActiveTab(value)}
>     >
>       {children}
>     </button>
>   );
> }
> 
> // TabPanels - container for TabPanel content
> function TabPanels({ children }) {
>   return <div className="tab-panels">{children}</div>;
> }
> 
> // TabPanel - content for each tab
> function TabPanel({ value, children }) {
>   const { activeTab } = useContext(TabsContext);
>   
>   if (activeTab !== value) return null;
>   
>   return (
>     <div role="tabpanel" className="tab-panel">
>       {children}
>     </div>
>   );
> }
> 
> // Attach sub-components to parent
> Tabs.List = TabList;
> Tabs.Tab = Tab;
> Tabs.Panels = TabPanels;
> Tabs.Panel = TabPanel;
> 
> // Usage - clean, declarative API
> function App() {
>   return (
>     <Tabs defaultValue="tab1">
>       <Tabs.List>
>         <Tabs.Tab value="tab1">Profile</Tabs.Tab>
>         <Tabs.Tab value="tab2">Settings</Tabs.Tab>
>         <Tabs.Tab value="tab3">Notifications</Tabs.Tab>
>       </Tabs.List>
>       
>       <Tabs.Panels>
>         <Tabs.Panel value="tab1">
>           <ProfileContent />
>         </Tabs.Panel>
>         <Tabs.Panel value="tab2">
>           <SettingsContent />
>         </Tabs.Panel>
>         <Tabs.Panel value="tab3">
>           <NotificationsContent />
>         </Tabs.Panel>
>       </Tabs.Panels>
>     </Tabs>
>   );
> }
> ```
> 
> **With controlled mode:**
> ```jsx
> function Tabs({ value, onChange, defaultValue, children }) {
>   const [internalValue, setInternalValue] = useState(defaultValue);
>   
>   // Support both controlled and uncontrolled
>   const activeTab = value !== undefined ? value : internalValue;
>   const setActiveTab = onChange || setInternalValue;
>   
>   return (
>     <TabsContext.Provider value={{ activeTab, setActiveTab }}>
>       {children}
>     </TabsContext.Provider>
>   );
> }
> 
> // Controlled usage
> function App() {
>   const [tab, setTab] = useState('tab1');
>   return <Tabs value={tab} onChange={setTab}>...</Tabs>;
> }
> ```

**Gotchas:**
- Context makes components coupled (can't use Tab outside Tabs)
- Consider providing a hook for custom implementations
- Validate children if needed using `React.Children.map`
- TypeScript: properly type the context and compound components

---

### 5.6 Controlled vs Uncontrolled Patterns (Deep Dive)

**Concept:** Beyond form inputs, the controlled vs uncontrolled pattern applies to any component that manages state. Controlled components receive their state from props; uncontrolled components manage their own state internally.

**Key Points:**
- Controlled: parent owns state (single source of truth)
- Uncontrolled: component owns state (simpler API)
- Support both for flexible components
- Use `defaultValue` for uncontrolled initial value
- Controlled enables validation, conditional logic, syncing

**Interview Q: How do you design a component that supports both controlled and uncontrolled modes?**

> **Answer:**
> 
> ```jsx
> import { useState, useCallback } from 'react';
> 
> // Hook for controlled/uncontrolled state
> function useControllableState({ value, defaultValue, onChange }) {
>   const [internalValue, setInternalValue] = useState(defaultValue);
>   
>   // Determine if controlled
>   const isControlled = value !== undefined;
>   const currentValue = isControlled ? value : internalValue;
>   
>   // Unified setter
>   const setValue = useCallback((newValue) => {
>     // Call onChange if provided
>     if (onChange) {
>       const nextValue = typeof newValue === 'function' 
>         ? newValue(currentValue) 
>         : newValue;
>       onChange(nextValue);
>     }
>     
>     // Only update internal state if uncontrolled
>     if (!isControlled) {
>       setInternalValue(newValue);
>     }
>   }, [isControlled, onChange, currentValue]);
>   
>   return [currentValue, setValue];
> }
> 
> // Dropdown component supporting both modes
> function Dropdown({ 
>   value,           // Controlled value
>   defaultValue,    // Uncontrolled initial value
>   onChange,        // Change handler
>   options,
>   placeholder = 'Select...'
> }) {
>   const [selectedValue, setSelectedValue] = useControllableState({
>     value,
>     defaultValue,
>     onChange,
>   });
>   const [isOpen, setIsOpen] = useState(false);
>   
>   const selectedOption = options.find(opt => opt.value === selectedValue);
>   
>   return (
>     <div className="dropdown">
>       <button onClick={() => setIsOpen(!isOpen)}>
>         {selectedOption?.label || placeholder}
>       </button>
>       
>       {isOpen && (
>         <ul className="dropdown-menu">
>           {options.map(option => (
>             <li
>               key={option.value}
>               onClick={() => {
>                 setSelectedValue(option.value);
>                 setIsOpen(false);
>               }}
>             >
>               {option.label}
>             </li>
>           ))}
>         </ul>
>       )}
>     </div>
>   );
> }
> 
> // Usage - Uncontrolled (simplest)
> function SimpleForm() {
>   return (
>     <Dropdown
>       defaultValue="us"
>       options={countries}
>     />
>   );
> }
> 
> // Usage - Controlled (full control)
> function ControlledForm() {
>   const [country, setCountry] = useState('us');
>   
>   const handleChange = (newCountry) => {
>     // Add validation, logging, etc.
>     if (isValidCountry(newCountry)) {
>       setCountry(newCountry);
>     }
>   };
>   
>   return (
>     <Dropdown
>       value={country}
>       onChange={handleChange}
>       options={countries}
>     />
>   );
> }
> ```
> 
> **Pattern in popular libraries:**
> ```jsx
> // React Aria (Adobe)
> import { useControlledState } from '@react-stately/utils';
> 
> // Radix UI
> <Dialog.Root open={open} onOpenChange={setOpen}>
>   {/* Works controlled or uncontrolled */}
> </Dialog.Root>
> 
> // Headless UI
> <Listbox value={selected} onChange={setSelected}>
>   {/* ... */}
> </Listbox>
> ```

**Gotchas:**
- Don't switch between controlled and uncontrolled (React warning)
- If `value` is `undefined`, component is uncontrolled
- If `value` is `null`, component is controlled with null value
- Always provide `onChange` with `value` for true controlled mode

---

### 5.7 Error Boundary Patterns

**Concept:** Error boundaries provide graceful error handling in React apps. Strategic placement of error boundaries can isolate failures, provide meaningful fallback UIs, and enable recovery without full page crashes.

**Key Points:**
- Catch errors during render, lifecycle, constructors
- Don't catch: event handlers, async code, SSR errors
- Place boundaries strategically (route-level, feature-level)
- Combine with error reporting services
- Consider recovery strategies (retry, reset)

**Interview Q: How do you implement a comprehensive error handling strategy in React?**

> **Answer:**
> 
> **1. Reusable Error Boundary with reset:**
> ```jsx
> import { Component } from 'react';
> 
> class ErrorBoundary extends Component {
>   constructor(props) {
>     super(props);
>     this.state = { hasError: false, error: null };
>   }
>   
>   static getDerivedStateFromError(error) {
>     return { hasError: true, error };
>   }
>   
>   componentDidCatch(error, errorInfo) {
>     // Log to error reporting service
>     logErrorToService(error, {
>       componentStack: errorInfo.componentStack,
>       ...this.props.metadata,
>     });
>   }
>   
>   handleReset = () => {
>     this.setState({ hasError: false, error: null });
>     this.props.onReset?.();
>   };
>   
>   render() {
>     if (this.state.hasError) {
>       // Custom fallback or default
>       if (this.props.fallback) {
>         return this.props.fallback({
>           error: this.state.error,
>           reset: this.handleReset,
>         });
>       }
>       
>       return (
>         <div className="error-fallback">
>           <h2>Something went wrong</h2>
>           <button onClick={this.handleReset}>Try again</button>
>         </div>
>       );
>     }
>     
>     return this.props.children;
>   }
> }
> 
> // Usage
> <ErrorBoundary
>   fallback={({ error, reset }) => (
>     <ErrorPage error={error} onRetry={reset} />
>   )}
>   onReset={() => clearCache()}
> >
>   <App />
> </ErrorBoundary>
> ```
> 
> **2. Strategic boundary placement:**
> ```jsx
> function App() {
>   return (
>     // Root boundary - catches everything
>     <ErrorBoundary fallback={<FullPageError />}>
>       <Header /> {/* Critical - no boundary (bubbles to root) */}
>       
>       <main>
>         {/* Route boundary - isolates page errors */}
>         <ErrorBoundary fallback={<RouteError />}>
>           <Routes>
>             <Route path="/dashboard" element={
>               // Feature boundary - isolates widget errors
>               <ErrorBoundary fallback={<WidgetError />}>
>                 <Dashboard />
>               </ErrorBoundary>
>             } />
>           </Routes>
>         </ErrorBoundary>
>       </main>
>     </ErrorBoundary>
>   );
> }
> ```
> 
> **3. Using react-error-boundary library:**
> ```jsx
> import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';
> 
> function ErrorFallback({ error, resetErrorBoundary }) {
>   return (
>     <div role="alert">
>       <p>Error: {error.message}</p>
>       <button onClick={resetErrorBoundary}>Retry</button>
>     </div>
>   );
> }
> 
> function App() {
>   return (
>     <ErrorBoundary
>       FallbackComponent={ErrorFallback}
>       onError={(error, info) => logError(error, info)}
>       onReset={() => window.location.reload()}
>       resetKeys={[userId]} // Reset when userId changes
>     >
>       <Dashboard />
>     </ErrorBoundary>
>   );
> }
> 
> // Programmatic error throwing
> function DataLoader() {
>   const { showBoundary } = useErrorBoundary();
>   
>   useEffect(() => {
>     fetchData()
>       .catch(error => showBoundary(error)); // Trigger boundary
>   }, []);
> }
> ```
> 
> **4. Handling async errors:**
> ```jsx
> function useAsyncError() {
>   const [, setError] = useState();
>   
>   return useCallback((error) => {
>     setError(() => { throw error; }); // Triggers error boundary
>   }, []);
> }
> 
> function AsyncComponent() {
>   const throwError = useAsyncError();
>   
>   useEffect(() => {
>     fetchData().catch(throwError);
>   }, []);
> }
> ```
> 
> **5. Combining with Suspense:**
> ```jsx
> function App() {
>   return (
>     <ErrorBoundary fallback={<ErrorPage />}>
>       <Suspense fallback={<Loading />}>
>         <AsyncComponent />
>       </Suspense>
>     </ErrorBoundary>
>   );
> }
> ```

**Gotchas:**
- Error boundaries don't catch errors in event handlers (use try-catch)
- Development mode shows error overlay even with boundaries
- Reset doesn't guarantee child won't error again
- Consider different fallbacks for different error types

---

## Part 7: Common Interview Questions

### 7.1 Top 20 React Questions (3yr Experience Level)

#### Q1: What is the Virtual DOM and how does it improve performance?
> **Answer:** The Virtual DOM is a lightweight JavaScript representation of the actual DOM. When state changes, React creates a new Virtual DOM tree, diffs it against the previous one (reconciliation), and only updates the changed parts in the real DOM. This batching of DOM operations is more efficient than direct manipulation because DOM operations are expensive.
>
> **Key points to mention:**
> - Diffing algorithm runs in O(n) time
> - Uses heuristics: different types = different trees, keys identify list items
> - Fiber architecture allows interrupting and resuming work

#### Q2: Explain the component lifecycle in functional components.
> **Answer:** Functional components use hooks to handle lifecycle:
> - **Mounting:** `useEffect(() => {}, [])` - empty deps, runs once
> - **Updating:** `useEffect(() => {}, [deps])` - runs when deps change
> - **Unmounting:** Return cleanup function from useEffect
> - The function body itself is the "render" phase
>
> Note: `useLayoutEffect` runs synchronously after DOM mutations but before paint.

#### Q3: What's the difference between state and props?
> **Answer:**
> - **Props:** Passed from parent, read-only, component can't modify its own props
> - **State:** Managed within component, mutable via setState, triggers re-render
> - Props flow down (parent to child), state can be lifted up
> - Both changes cause re-renders

#### Q4: Why do we need keys in lists? What happens if we use index as key?
> **Answer:** Keys help React identify which items changed, were added, or removed. They should be stable, unique among siblings, and predictable.
>
> **Index as key problems:**
> - Reordering items causes incorrect component reuse
> - State gets associated with wrong items
> - Performance suffers (more DOM operations)
>
> **When index is okay:** Static lists that never reorder/filter.

#### Q5: Explain useCallback and useMemo. When should you NOT use them?
> **Answer:**
> - `useMemo`: Caches computed values, recalculates when deps change
> - `useCallback`: Caches function references, returns same function if deps unchanged
>
> **Don't use when:**
> - Simple calculations (cost of memoization > calculation)
> - Child component isn't memoized (React.memo)
> - Creating primitive values (compared by value anyway)
>
> **Rule:** Profile first, optimize later. Premature optimization adds complexity.

#### Q6: How does Context API work? What are its limitations?
> **Answer:** Context provides a way to pass data through the component tree without prop drilling.
>
> **Limitations:**
> - All consumers re-render when context value changes
> - No built-in selectors (unlike Redux)
> - Not designed for high-frequency updates
>
> **Solutions:** Split contexts, memoize values, use state management for complex cases.

#### Q7: What are React 18's key features?
> **Answer:**
> - **Automatic Batching:** All setState calls batched (even in promises, timeouts)
> - **Concurrent Rendering:** React can pause/resume rendering
> - **useTransition:** Mark updates as non-urgent
> - **useDeferredValue:** Defer updating expensive values
> - **Suspense improvements:** Works with data fetching libraries
> - **Streaming SSR:** Progressive HTML with selective hydration

#### Q8: Explain controlled vs uncontrolled components.
> **Answer:**
> - **Controlled:** React state drives the input value (`value` + `onChange`)
> - **Uncontrolled:** DOM holds the state, accessed via ref (`defaultValue` + `ref`)
>
> **When to use uncontrolled:** File inputs, integrating with non-React code, simple forms where you only need final value.
>
> **Warning:** Don't switch between controlled and uncontrolled during component lifetime.

#### Q9: What are Error Boundaries? What can't they catch?
> **Answer:** Error Boundaries are class components that catch JavaScript errors in child component tree and display fallback UI.
>
> **Can't catch:**
> - Event handler errors (use try-catch)
> - Async code (promises, setTimeout)
> - Server-side rendering errors
> - Errors in the boundary itself
>
> Use `react-error-boundary` library for functional component support.

#### Q10: How do you prevent unnecessary re-renders?
> **Answer:**
> 1. `React.memo()` for components that render same output with same props
> 2. `useCallback` for stable function references passed to memoized children
> 3. `useMemo` for expensive calculations
> 4. Move state down (closer to where it's used)
> 5. Lift content up (pass as children to avoid re-creating)
> 6. Split Context by update frequency

#### Q11: Explain useRef and its use cases beyond DOM access.
> **Answer:** `useRef` returns a mutable object (`{current: value}`) that persists across renders without causing re-renders.
>
> **Use cases:**
> - DOM element access
> - Storing previous values
> - Mutable instance variables (timer IDs)
> - Avoiding stale closures in callbacks
> - Tracking mounted state

#### Q12: What is useReducer? When would you use it over useState?
> **Answer:** `useReducer` manages complex state logic with a reducer function.
>
> **Use when:**
> - State has multiple sub-values
> - Next state depends on previous
> - State transitions are complex
> - You want to centralize state logic
> - Passing update logic to children (dispatch is stable)

#### Q13: How does React's reconciliation algorithm work?
> **Answer:** React compares old and new Virtual DOM trees using two heuristics:
> 1. Different element types produce different trees (full remount)
> 2. Keys identify elements in lists
>
> Process: Compare elements level by level, update attributes for same type, remount subtree for different types, use keys to minimize list operations.

#### Q14: Explain forwardRef and useImperativeHandle.
> **Answer:**
> - `forwardRef`: Passes ref through component to child DOM node
> - `useImperativeHandle`: Customizes what ref exposes to parent
>
> ```jsx
> const Input = forwardRef((props, ref) => {
>   const inputRef = useRef();
>   useImperativeHandle(ref, () => ({
>     focus: () => inputRef.current.focus(),
>     clear: () => inputRef.current.value = ''
>   }));
>   return <input ref={inputRef} />;
> });
> ```

#### Q15: What are Higher-Order Components (HOCs)?
> **Answer:** HOCs are functions that take a component and return a new component with additional props/behavior. They're a pattern for reusing component logic.
>
> **Issues:** Prop collision, wrapper hell, harder to type in TypeScript.
> **Modern alternative:** Custom hooks (preferred in most cases).

#### Q16: How do you handle forms in React?
> **Answer:**
> - **Simple forms:** Controlled inputs with useState
> - **Complex forms:** useReducer or form libraries (React Hook Form, Formik)
> - **Validation:** On change, on blur, or on submit
> - **React 19:** Form actions and useFormStatus
>
> **React Hook Form advantage:** Uncontrolled with refs = fewer re-renders.

#### Q17: Explain the children prop and composition patterns.
> **Answer:** `children` is a special prop that contains nested elements. It enables composition over inheritance.
>
> **Patterns:**
> - Pass components as children for flexible layouts
> - Named slots: multiple children props (`header`, `sidebar`, `content`)
> - Render props: function as children for shared logic
> - Compound components: parent shares state with children via Context

#### Q18: What is Strict Mode and what does it do?
> **Answer:** `<StrictMode>` is a development tool that:
> - Warns about deprecated lifecycle methods
> - Warns about legacy string ref API
> - Detects unexpected side effects (double-invokes render, effects)
> - Detects legacy context API
>
> In React 18, it double-invokes effects to catch cleanup issues. No production impact.

#### Q19: How do you optimize large list rendering?
> **Answer:**
> 1. **Virtualization:** Only render visible items (react-window, react-virtualized)
> 2. **Memoization:** `React.memo` on list items
> 3. **Stable keys:** Avoid index keys
> 4. **Stable callbacks:** useCallback for handlers passed to items
> 5. **Pagination/Infinite scroll:** Don't render all at once

#### Q20: What's the difference between useEffect and useLayoutEffect?
> **Answer:**
> - `useEffect`: Runs asynchronously after paint (non-blocking)
> - `useLayoutEffect`: Runs synchronously after DOM mutations, before paint
>
> **Use useLayoutEffect when:**
> - Measuring DOM elements
> - Preventing flash of incorrect content
> - Updating DOM that must be visible immediately
>
> **Warning:** useLayoutEffect blocks painting; use sparingly.

---

### 7.2 Top 10 Next.js Questions

#### Q1: Explain Server Components vs Client Components.
> **Answer:**
> - **Server Components (default):** Run only on server, zero JS to client, can access DB/filesystem directly, can be async
> - **Client Components (`'use client'`):** Run on both server (SSR) and client, required for hooks, events, browser APIs
>
> **Key rule:** Server Components can import Client Components, not vice versa. Pass Server Components as children to Client Components.

#### Q2: What are the rendering strategies in Next.js App Router?
> **Answer:**
> - **Static (SSG):** Default, cached at build time, `fetch()` is cached
> - **Dynamic (SSR):** Per-request, `cache: 'no-store'` or using `cookies()`/`headers()`
> - **ISR:** Time-based revalidation, `next: { revalidate: 60 }`
> - **On-demand:** `revalidatePath()` / `revalidateTag()`
>
> Choose based on data freshness needs vs. performance.

#### Q3: How do Server Actions work?
> **Answer:** Server Actions are async functions marked with `'use server'` that run on the server. They can be called from Client Components without creating API endpoints.
>
> ```jsx
> // actions.ts
> 'use server'
> export async function createPost(formData: FormData) {
>   await db.posts.create({...});
>   revalidatePath('/posts');
> }
> 
> // Component
> <form action={createPost}>...</form>
> ```
>
> Benefits: No API boilerplate, automatic request handling, works with forms natively.

#### Q4: Explain the caching layers in Next.js.
> **Answer:** Four layers:
> 1. **Request Memoization:** Dedupes same fetch calls in one render
> 2. **Data Cache:** Persists fetch results across requests (on server)
> 3. **Full Route Cache:** Caches HTML/RSC payload at build time
> 4. **Router Cache:** Client-side cache for visited routes (30s default)
>
> Control with: `cache: 'no-store'`, `revalidate`, `revalidatePath()`, `revalidateTag()`.

#### Q5: What's the difference between App Router and Pages Router?
> **Answer:**
> | Feature | Pages Router | App Router |
> |---------|--------------|------------|
> | Directory | `pages/` | `app/` |
> | Default | Client Components | Server Components |
> | Data Fetching | getServerSideProps | async components, fetch |
> | Layouts | Single `_app.tsx` | Nested `layout.tsx` |
> | Loading | Manual | `loading.tsx` |
> | Streaming | Limited | Full support |

#### Q6: How do you handle Middleware in Next.js?
> **Answer:** Middleware (`middleware.ts` at project root) runs before requests complete. It executes at the Edge for low latency.
>
> **Use cases:** Auth redirects, A/B testing, geolocation, request logging.
>
> **Limitations:** Can't modify response body, limited runtime (no Node APIs), runs on every matched request.
>
> Configure routes with `config.matcher`.

#### Q7: How do you optimize images and fonts in Next.js?
> **Answer:**
> - **Images (`next/image`):** Automatic optimization, lazy loading, responsive sizes, priority for LCP
> - **Fonts (`next/font`):** Zero layout shift, self-hosted, preloaded
>
> ```jsx
> import Image from 'next/image';
> import { Inter } from 'next/font/google';
> 
> const inter = Inter({ subsets: ['latin'] });
> <Image src="/hero.jpg" priority alt="" />
> ```

#### Q8: How do you handle data fetching in App Router?
> **Answer:**
> - **Server Components:** Direct `await fetch()` or DB calls
> - **Parallel fetching:** `Promise.all([fetch1(), fetch2()])`
> - **Streaming:** Loading UI with `loading.tsx` or `<Suspense>`
> - **Client Components:** SWR, React Query, or useEffect
>
> Server Actions for mutations, `revalidatePath`/`revalidateTag` for cache invalidation.

#### Q9: Explain Route Handlers vs API Routes.
> **Answer:**
> - **API Routes (Pages):** `pages/api/*.ts`, Node.js runtime
> - **Route Handlers (App):** `app/api/*/route.ts`, Web APIs (Request/Response)
>
> Route Handlers support: HTTP method exports (GET, POST), static caching, streaming responses, Edge runtime.
>
> Can't coexist with `page.tsx` in same folder.

#### Q10: How do you handle errors in Next.js App Router?
> **Answer:**
> - **`error.tsx`:** Catches errors in route segment and children
> - **`global-error.tsx`:** Catches errors in root layout
> - **`not-found.tsx`:** Custom 404 pages
>
> Error files are Client Components (need `'use client'`). They receive `error` and `reset` props. Boundaries are nested—errors bubble up to nearest boundary.

---

### 7.3 Behavioral Questions for Staff Engineer

#### Q1: Tell me about a time you made a significant architectural decision.
> **Structure your answer (STAR):**
> - **Situation:** Describe the technical context and business need
> - **Task:** What problem needed solving? What were the constraints?
> - **Action:** What options did you consider? Why did you choose your approach? How did you get buy-in?
> - **Result:** What was the outcome? Metrics if possible.
>
> **Key points to hit:**
> - Trade-offs you considered (performance vs. maintainability, speed vs. quality)
> - How you involved stakeholders
> - How you handled disagreements
> - Long-term impact of the decision

#### Q2: How do you approach mentoring junior developers?
> **Good answer includes:**
> - Creating safe environment for questions
> - Code reviews as teaching opportunities (explain why, not just what)
> - Pair programming on complex tasks
> - Encouraging ownership while providing guardrails
> - Setting up growth plans with concrete goals
> - Sharing context (why decisions were made)
>
> **Example:** "I pair program with juniors on their first complex feature, then gradually step back. In code reviews, I ask questions instead of dictating changes to develop their critical thinking."

#### Q3: Describe a time you had to push back on a requirement.
> **Structure:**
> - What was the requirement and who requested it?
> - Why did you disagree? (Technical debt, timeline, scope creep)
> - How did you communicate your concerns?
> - What alternative did you propose?
> - What was the outcome?
>
> **Key qualities to demonstrate:**
> - Respectful disagreement with data/evidence
> - Understanding business perspective
> - Proposing alternatives, not just saying no
> - Knowing when to commit even if you disagree

#### Q4: How do you stay current with technology?
> **Good answer includes:**
> - Following specific resources (newsletters, blogs, conferences)
> - Building side projects to learn hands-on
> - Participating in communities (open source, meetups)
> - Balancing new tech enthusiasm with pragmatism
> - Evaluating new tools against actual problems
>
> **Avoid:** Listing every framework you've heard of. Focus on depth and practical application.

#### Q5: Tell me about a production incident you handled.
> **Structure:**
> - What was the incident? What was the impact?
> - How did you discover/diagnose it?
> - What was your immediate response?
> - What was the root cause?
> - What did you do to prevent recurrence?
>
> **Key qualities:**
> - Calm under pressure
> - Systematic debugging
> - Communication with stakeholders
> - Blameless post-mortems
> - Process improvements

#### Q6: How do you balance technical debt vs. feature development?
> **Good answer:**
> - Track technical debt explicitly (backlog, labels)
> - Quantify impact (deployment time, bug rate, developer productivity)
> - Advocate with business language ("this slows us down by X")
> - Incorporate debt paydown into feature work (boy scout rule)
> - Prioritize debt that blocks or risks features
> - Accept some debt is okay; not all debt needs immediate payment
>
> **Example:** "I maintain a tech debt log with estimated impact. When planning sprints, I allocate 20% to debt reduction, prioritizing items that affect current feature work."

#### Q7: How do you approach code reviews?
> **Good answer includes:**
> - Focus on: correctness, maintainability, performance, security
> - Timeliness matters (don't block others)
> - Balance thoroughness with pragmatism
> - Praise good patterns, not just critique
> - Ask questions to understand intent
> - Distinguish between must-fix and nice-to-have
> - Use automation for style/formatting
>
> **For Staff level:** "I also look for architectural consistency, knowledge sharing opportunities, and whether the PR aligns with team patterns."

#### Q8: Describe a project you led from inception to delivery.
> **Structure:**
> - Project scope and business value
> - Your role in planning/design
> - How you broke down work
> - How you handled obstacles
> - Team coordination and communication
> - Delivery and outcomes
>
> **Key qualities:**
> - Technical depth AND breadth
> - Cross-functional collaboration
> - Risk identification and mitigation
> - Accountability for outcomes

#### Q9: How do you handle disagreements with colleagues?
> **Framework:**
> 1. Seek to understand their perspective first
> 2. Find common ground/shared goals
> 3. Focus on data and evidence, not opinions
> 4. Propose experiments or compromises
> 5. Disagree and commit when decision is made
> 6. Revisit decisions with new information
>
> **Key:** Show maturity, collaboration, and ability to separate ego from ideas.

#### Q10: What's your approach to system design?
> **Framework:**
> 1. **Clarify requirements:** Functional, non-functional, constraints
> 2. **Back-of-envelope estimation:** Scale, traffic, storage
> 3. **High-level design:** Major components and data flow
> 4. **Deep dive:** Critical components in detail
> 5. **Trade-offs:** Discuss alternatives considered
> 6. **Operational concerns:** Monitoring, scaling, failure modes
>
> **For Staff level:** Emphasize asking good questions, considering organizational constraints, and advocating for incremental approaches.

---

### Quick Behavioral Tips

**STAR Method:**
- **S**ituation: Set the context
- **T**ask: Describe your responsibility
- **A**ction: Explain what YOU did (not "we")
- **R**esult: Quantify impact if possible

**Staff Engineer expectations:**
- Technical depth across multiple domains
- Influence without authority
- Multiplying team effectiveness
- Long-term thinking and architecture
- Clear communication with non-technical stakeholders
- Mentorship and knowledge sharing

**Red flags to avoid:**
- Blaming others
- Not taking ownership
- Only technical answers without business context
- Inability to explain trade-offs
- "I don't know" without follow-up curiosity

---

## Quick Reference Card

### React Performance Checklist
- [ ] Use React.memo for expensive pure components
- [ ] Stabilize callbacks with useCallback when passing to memoized children
- [ ] Use useMemo for expensive calculations
- [ ] Split Context by update frequency
- [ ] Virtualize lists > 100 items
- [ ] Code split routes with React.lazy
- [ ] Profile before optimizing

### Next.js App Router Quick Reference
```typescript
// Static data fetching
const data = await fetch(url); // Cached

// Dynamic data fetching
const data = await fetch(url, { cache: 'no-store' });

// ISR
const data = await fetch(url, { next: { revalidate: 60 } });

// Tagged cache
const data = await fetch(url, { next: { tags: ['posts'] } });

// Revalidate
revalidatePath('/path');
revalidateTag('tag');
```

### Server vs Client Components
```
Server (default)         Client ('use client')
├─ async/await           ├─ useState, useEffect
├─ Direct DB access      ├─ Event handlers
├─ Secrets/env vars      ├─ Browser APIs
├─ Large dependencies    ├─ Third-party UI libs
└─ Zero JS sent          └─ Interactivity
```

---

*Last updated: February 2026*
