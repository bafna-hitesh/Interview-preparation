# Frontend SDE-2 Interview Prep: Performance, Accessibility & Security

---

## Table of Contents

- [1. Performance Optimization](#1-performance-optimization-3-hours)
  - [1.1 Core Web Vitals & Metrics](#11-core-web-vitals--metrics)
  - [1.2 Code Splitting & Lazy Loading](#12-code-splitting--lazy-loading)
  - [1.3 Image Optimization](#13-image-optimization)
  - [1.4 Bundle Size Optimization](#14-bundle-size-optimization)
  - [1.5 Rendering Performance](#15-rendering-performance)
  - [1.6 Network Performance](#16-network-performance)
  - [1.7 Performance Monitoring](#17-performance-monitoring)
- [2. Accessibility & Internationalization](#2-accessibility--internationalization-2-hours)
  - [2.1 ARIA and Semantic HTML](#21-aria-and-semantic-html)
  - [2.2 Keyboard Navigation](#22-keyboard-navigation)
  - [2.3 Screen Reader Support](#23-screen-reader-support)
  - [2.4 Internationalization (i18n)](#24-internationalization-i18n)
- [3. Front-End Security](#3-front-end-security-2-hours)
  - [3.1 XSS (Cross-Site Scripting)](#31-xss-cross-site-scripting)
  - [3.2 CSRF (Cross-Site Request Forgery)](#32-csrf-cross-site-request-forgery)
  - [3.3 CORS (Cross-Origin Resource Sharing)](#33-cors-cross-origin-resource-sharing)
  - [3.4 Authentication & Authorization](#34-authentication--authorization)
  - [3.5 Input Validation & Sanitization](#35-input-validation--sanitization)
- [Quick Reference Checklist](#quick-reference-checklist)
- [Common Interview Questions](#common-interview-questions)

---
---

## 1. PERFORMANCE OPTIMIZATION (3 hours)

### 1.1 Core Web Vitals & Metrics

#### Key Metrics You Must Know:

**LCP (Largest Contentful Paint)**
- **What it is:** Time to render the largest visible element
- **Good score:** < 2.5 seconds
- **How to optimize:**
  - Optimize images (use WebP, proper sizing)
  - Implement lazy loading
  - Use CDN for static assets
  - Preload critical resources
  - Reduce server response time

**FID (First Input Delay)**
- **What it is:** Time from user interaction to browser response
- **Good score:** < 100ms
- **How to optimize:**
  - Break up long JavaScript tasks
  - Use Web Workers for heavy computation
  - Defer non-critical JavaScript
  - Reduce JavaScript execution time

**CLS (Cumulative Layout Shift)**
- **What it is:** Visual stability - unexpected layout shifts
- **Good score:** < 0.1
- **How to optimize:**
  - Always include size attributes on images/videos
  - Don't insert content above existing content
  - Use transform animations instead of layout-changing properties
  - Reserve space for ads/embeds

**TTI (Time to Interactive)**
- **What it is:** Time until page is fully interactive
- **Target:** < 3.8 seconds on mobile
- **How to optimize:**
  - Code splitting
  - Tree shaking
  - Remove unused code
  - Optimize third-party scripts

**TTFB (Time to First Byte)**
- **What it is:** Time from navigation to first byte of response
- **Good score:** < 600ms
- **How to optimize:**
  - Use CDN
  - Enable caching
  - Optimize backend queries
  - Use HTTP/2 or HTTP/3

---

### 1.2 Code Splitting & Lazy Loading

#### Interview Question: "How do you implement code splitting in React?"

**Answer:**

```javascript
// 1. Route-based code splitting
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// 2. Component-based lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function Parent() {
  const [showHeavy, setShowHeavy] = React.useState(false);
  
  return (
    <div>
      <button onClick={() => setShowHeavy(true)}>Load Heavy Component</button>
      {showHeavy && (
        <Suspense fallback={<Spinner />}>
          <HeavyComponent />
        </Suspense>
      )}
    </div>
  );
}

// 3. Dynamic imports with preloading
function ComponentWithPreload() {
  const [Component, setComponent] = React.useState(null);
  
  // Preload on hover
  const handleMouseEnter = () => {
    import('./HeavyComponent').then(module => {
      setComponent(() => module.default);
    });
  };
  
  const handleClick = () => {
    if (!Component) {
      import('./HeavyComponent').then(module => {
        setComponent(() => module.default);
      });
    }
  };
  
  return (
    <div>
      <button onMouseEnter={handleMouseEnter} onClick={handleClick}>
        Load Component
      </button>
      {Component && <Component />}
    </div>
  );
}
```

**Webpack Configuration:**

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

---

### 1.3 Image Optimization

#### Interview Question: "How do you optimize images for web?"

**Answer:**

```javascript
// 1. Lazy loading images
function LazyImage({ src, alt, placeholder }) {
  const [imageSrc, setImageSrc] = React.useState(placeholder);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const imgRef = React.useRef();
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, [src]);
  
  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s'
      }}
    />
  );
}

// 2. Responsive images with srcset
function ResponsiveImage({ src, alt }) {
  return (
    <img
      src={src}
      srcSet={`
        ${src}?w=320 320w,
        ${src}?w=640 640w,
        ${src}?w=1024 1024w
      `}
      sizes="(max-width: 320px) 280px, (max-width: 640px) 600px, 1000px"
      alt={alt}
      loading="lazy"
    />
  );
}

// 3. Modern image formats with fallback
function ModernImage({ src, alt }) {
  return (
    <picture>
      <source srcSet={`${src}.avif`} type="image/avif" />
      <source srcSet={`${src}.webp`} type="image/webp" />
      <img src={`${src}.jpg`} alt={alt} loading="lazy" />
    </picture>
  );
}

// 4. Progressive image loading (blur-up)
function ProgressiveImage({ lowQualitySrc, highQualitySrc, alt }) {
  const [src, setSrc] = React.useState(lowQualitySrc);
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  React.useEffect(() => {
    const img = new Image();
    img.src = highQualitySrc;
    img.onload = () => {
      setSrc(highQualitySrc);
      setIsLoaded(true);
    };
  }, [highQualitySrc]);
  
  return (
    <img
      src={src}
      alt={alt}
      style={{
        filter: isLoaded ? 'none' : 'blur(10px)',
        transition: 'filter 0.3s'
      }}
    />
  );
}
```

**Key Points to Mention:**
- Use appropriate formats (WebP, AVIF for modern browsers)
- Compress images (aim for < 200KB for large images)
- Use responsive images with srcset/sizes
- Implement lazy loading
- Use CDN for delivery
- Consider aspect ratio boxes to prevent CLS

---

### 1.4 Bundle Size Optimization

#### Interview Question: "How do you reduce JavaScript bundle size?"

**Answer:**

```javascript
// 1. Tree shaking - Import only what you need
// ❌ Bad
import _ from 'lodash';
_.debounce(fn, 300);

// ✅ Good
import debounce from 'lodash/debounce';
debounce(fn, 300);

// Or use lodash-es
import { debounce } from 'lodash-es';

// 2. Dynamic imports for heavy libraries
async function processWithMoment(date) {
  const moment = await import('moment');
  return moment.default(date).format('YYYY-MM-DD');
}

// Better: Use lighter alternatives
// Instead of moment (232KB), use date-fns (13KB) or dayjs (2KB)
import { format } from 'date-fns';
format(new Date(), 'yyyy-MM-dd');

// 3. Remove console.logs in production
// babel-plugin-transform-remove-console or:
if (process.env.NODE_ENV !== 'production') {
  console.log('Debug info');
}

// 4. Analyze bundle
// Use webpack-bundle-analyzer
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};

// 5. Use production builds
// React production build is ~40% smaller
// Always build with: npm run build
```

**Techniques to Mention:**
- Tree shaking
- Minification and uglification
- Gzip/Brotli compression
- Remove unused dependencies
- Use lighter alternatives
- Code splitting
- Defer non-critical scripts

---

### 1.5 Rendering Performance

#### Interview Question: "How do you optimize React rendering performance?"

**Answer:**

```javascript
// 1. React.memo for component memoization
const ExpensiveComponent = React.memo(({ data, onAction }) => {
  console.log('Rendering ExpensiveComponent');
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      <button onClick={onAction}>Action</button>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - return true to skip re-render
  return prevProps.data === nextProps.data &&
         prevProps.onAction === nextProps.onAction;
});

// 2. useMemo for expensive computations
function DataDisplay({ items, filter }) {
  const filteredItems = React.useMemo(() => {
    console.log('Filtering items');
    return items.filter(item => item.category === filter);
  }, [items, filter]);
  
  const stats = React.useMemo(() => {
    console.log('Computing stats');
    return {
      total: filteredItems.length,
      sum: filteredItems.reduce((sum, item) => sum + item.value, 0)
    };
  }, [filteredItems]);
  
  return <div>{/* render stats */}</div>;
}

// 3. useCallback for stable function references
function Parent() {
  const [count, setCount] = React.useState(0);
  const [other, setOther] = React.useState(0);
  
  // ❌ Bad - creates new function on every render
  const handleClick = () => {
    console.log('Clicked', count);
  };
  
  // ✅ Good - stable reference
  const handleClickOptimized = React.useCallback(() => {
    console.log('Clicked', count);
  }, [count]);
  
  return (
    <div>
      <ExpensiveChild onClick={handleClickOptimized} />
      <button onClick={() => setOther(other + 1)}>Other: {other}</button>
    </div>
  );
}

// 4. Virtualization for large lists
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}

// 5. Debouncing expensive operations
function SearchComponent() {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState([]);
  
  const debouncedSearch = React.useMemo(
    () => debounce(async (searchQuery) => {
      const data = await fetch(`/api/search?q=${searchQuery}`);
      setResults(await data.json());
    }, 300),
    []
  );
  
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };
  
  return <input value={query} onChange={handleChange} />;
}

// 6. Avoid inline objects/arrays in JSX
// ❌ Bad - creates new object on every render
<Component style={{ margin: 10 }} data={[1, 2, 3]} />

// ✅ Good
const style = { margin: 10 };
const data = [1, 2, 3];
<Component style={style} data={data} />

// 7. Use keys properly
// ❌ Bad - using index as key
{items.map((item, index) => <Item key={index} {...item} />)}

// ✅ Good - using stable unique identifier
{items.map(item => <Item key={item.id} {...item} />)}
```

---

### 1.6 Network Performance

#### Interview Question: "How do you optimize network requests?"

**Answer:**

```javascript
// 1. Request batching
class RequestBatcher {
  constructor(batchFn, delay = 50) {
    this.batchFn = batchFn;
    this.delay = delay;
    this.queue = [];
    this.timeoutId = null;
  }
  
  add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      
      this.timeoutId = setTimeout(() => this.flush(), this.delay);
    });
  }
  
  async flush() {
    if (this.queue.length === 0) return;
    
    const batch = this.queue.splice(0);
    const requests = batch.map(item => item.request);
    
    try {
      const results = await this.batchFn(requests);
      batch.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      batch.forEach(item => item.reject(error));
    }
  }
}

// Usage
const userBatcher = new RequestBatcher(async (userIds) => {
  const response = await fetch(`/api/users?ids=${userIds.join(',')}`);
  return response.json();
});

// These will be batched into a single request
Promise.all([
  userBatcher.add(1),
  userBatcher.add(2),
  userBatcher.add(3)
]).then(users => console.log(users));

// 2. Request deduplication
class RequestCache {
  constructor() {
    this.cache = new Map();
    this.pending = new Map();
  }
  
  async fetch(url, options = {}) {
    const key = `${url}-${JSON.stringify(options)}`;
    
    // Return cached response
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    // Return pending request
    if (this.pending.has(key)) {
      return this.pending.get(key);
    }
    
    // Make new request
    const promise = fetch(url, options)
      .then(res => res.json())
      .then(data => {
        this.cache.set(key, data);
        this.pending.delete(key);
        return data;
      })
      .catch(error => {
        this.pending.delete(key);
        throw error;
      });
    
    this.pending.set(key, promise);
    return promise;
  }
  
  clear() {
    this.cache.clear();
    this.pending.clear();
  }
}

// 3. Resource hints
function OptimizedApp() {
  return (
    <html>
      <head>
        {/* DNS prefetch */}
        <link rel="dns-prefetch" href="https://api.example.com" />
        
        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        
        {/* Prefetch - low priority, for future navigation */}
        <link rel="prefetch" href="/dashboard.js" />
        
        {/* Preload - high priority, for current navigation */}
        <link rel="preload" href="/critical.css" as="style" />
        <link rel="preload" href="/hero-image.jpg" as="image" />
        
        {/* Prerender - highest priority (use sparingly) */}
        <link rel="prerender" href="/next-page" />
      </head>
    </html>
  );
}

// 4. HTTP/2 Server Push simulation
// Service Worker cache strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }
        
        const responseToCache = response.clone();
        caches.open('v1').then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      });
    })
  );
});

// 5. Compression
// Enable gzip/brotli on server
// nginx configuration:
// gzip on;
// gzip_types text/plain text/css application/json application/javascript;

// 6. CDN usage
const CDN_URL = 'https://cdn.example.com';
<img src={`${CDN_URL}/images/logo.png`} alt="Logo" />
```

**Key Points:**
- Use HTTP/2 multiplexing
- Enable compression (gzip/brotli)
- Implement caching strategies
- Use CDN for static assets
- Batch and deduplicate requests
- Use resource hints (prefetch, preconnect, preload)
- Implement service workers for offline support

---

### 1.7 Performance Monitoring

#### Interview Question: "How do you measure and monitor performance?"

**Answer:**

```javascript
// 1. Performance API
function measurePageLoad() {
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    
    console.log({
      // DNS lookup
      dnsTime: perfData.domainLookupEnd - perfData.domainLookupStart,
      
      // TCP connection
      tcpTime: perfData.connectEnd - perfData.connectStart,
      
      // Request/Response
      requestTime: perfData.responseEnd - perfData.requestStart,
      
      // DOM processing
      domProcessing: perfData.domComplete - perfData.domLoading,
      
      // Page load time
      loadTime: perfData.loadEventEnd - perfData.fetchStart
    });
  });
}

// 2. Custom performance marks
function measureComponentRender() {
  performance.mark('component-render-start');
  
  // ... component rendering logic
  
  performance.mark('component-render-end');
  performance.measure(
    'component-render',
    'component-render-start',
    'component-render-end'
  );
  
  const measure = performance.getEntriesByName('component-render')[0];
  console.log('Component render time:', measure.duration);
}

// 3. Web Vitals measurement
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  
  // Use sendBeacon for reliability
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/analytics', body);
  } else {
    fetch('/analytics', { body, method: 'POST', keepalive: true });
  }
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);

// 4. Long task monitoring
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.warn('Long task detected:', {
      duration: entry.duration,
      startTime: entry.startTime
    });
  }
});

observer.observe({ entryTypes: ['longtask'] });

// 5. React Profiler
import { Profiler } from 'react';

function onRenderCallback(
  id, // the "id" prop of the Profiler tree that has just committed
  phase, // either "mount" or "update"
  actualDuration, // time spent rendering
  baseDuration, // estimated time to render the entire subtree
  startTime, // when React began rendering
  commitTime, // when React committed the update
  interactions // Set of interactions belonging to this update
) {
  console.log({
    id,
    phase,
    actualDuration,
    baseDuration
  });
  
  // Send to analytics
  if (actualDuration > 16) { // Longer than one frame
    sendToAnalytics({
      metric: 'react-render',
      component: id,
      duration: actualDuration,
      phase
    });
  }
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Dashboard />
    </Profiler>
  );
}

// 6. Memory monitoring
function checkMemoryUsage() {
  if (performance.memory) {
    console.log({
      usedJSHeapSize: performance.memory.usedJSHeapSize / 1048576, // MB
      totalJSHeapSize: performance.memory.totalJSHeapSize / 1048576,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit / 1048576
    });
  }
}

// Run periodically
setInterval(checkMemoryUsage, 30000);
```

---

## 2. ACCESSIBILITY & INTERNATIONALIZATION (2 hours)

### 2.1 ARIA and Semantic HTML

#### Interview Question: "How do you make a custom dropdown accessible?"

**Answer:**

```javascript
function AccessibleDropdown({ label, options, value, onChange }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(0);
  const buttonRef = React.useRef();
  const listboxRef = React.useRef();
  
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          onChange(options[focusedIndex].value);
          setIsOpen(false);
          buttonRef.current.focus();
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        buttonRef.current.focus();
        break;
      
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) => 
            prev < options.length - 1 ? prev + 1 : prev
          );
        }
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => prev > 0 ? prev - 1 : prev);
        break;
      
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        break;
      
      case 'End':
        e.preventDefault();
        setFocusedIndex(options.length - 1);
        break;
    }
  };
  
  React.useEffect(() => {
    if (isOpen && listboxRef.current) {
      const focusedOption = listboxRef.current.children[focusedIndex];
      focusedOption?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex, isOpen]);
  
  return (
    <div className="dropdown">
      <label id="dropdown-label">{label}</label>
      
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="dropdown-label"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
      >
        {value || 'Select an option'}
      </button>
      
      {isOpen && (
        <ul
          ref={listboxRef}
          role="listbox"
          aria-labelledby="dropdown-label"
          tabIndex={-1}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              className={index === focusedIndex ? 'focused' : ''}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
                buttonRef.current.focus();
              }}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

**Key ARIA Attributes:**
- `role` - Defines element type (button, menu, dialog, etc.)
- `aria-label` - Provides accessible name
- `aria-labelledby` - References labeling element
- `aria-describedby` - References describing element
- `aria-expanded` - Indicates expanded/collapsed state
- `aria-hidden` - Hides from screen readers
- `aria-live` - Announces dynamic content changes
- `aria-required` - Indicates required form field
- `aria-invalid` - Indicates validation error
- `aria-disabled` - Indicates disabled state

---

### 2.2 Keyboard Navigation

#### Interview Question: "Implement a modal with proper keyboard navigation and focus management"

**Answer:**

```javascript
function AccessibleModal({ isOpen, onClose, title, children }) {
  const modalRef = React.useRef();
  const previousFocusRef = React.useRef();
  
  // Trap focus within modal
  React.useEffect(() => {
    if (!isOpen) return;
    
    // Save current focus
    previousFocusRef.current = document.activeElement;
    
    // Get all focusable elements
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Focus first element
    firstElement?.focus();
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        className="modal-content"
      >
        <h2 id="modal-title">{title}</h2>
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="close-button"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

// Skip navigation link (for main content)
function SkipLink() {
  return (
    <a
      href="#main-content"
      className="skip-link"
      style={{
        position: 'absolute',
        left: '-9999px',
        ':focus': {
          left: '0',
          top: '0',
          zIndex: 9999
        }
      }}
    >
      Skip to main content
    </a>
  );
}

// Roving tabindex for complex widgets
function TabList({ tabs, activeTab, onTabChange }) {
  const tabRefs = React.useRef([]);
  
  const handleKeyDown = (e, index) => {
    let newIndex = index;
    
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }
    
    tabRefs.current[newIndex]?.focus();
    onTabChange(tabs[newIndex].id);
  };
  
  return (
    <div role="tablist" aria-label="Content tabs">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={(el) => (tabRefs.current[index] = el)}
          role="tab"
          aria-selected={tab.id === activeTab}
          aria-controls={`panel-${tab.id}`}
          tabIndex={tab.id === activeTab ? 0 : -1}
          onClick={() => onTabChange(tab.id)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
```

---

### 2.3 Screen Reader Support

#### Interview Question: "How do you make dynamic content accessible to screen readers?"

**Answer:**

```javascript
// 1. Live regions for announcements
function StatusAnnouncer({ message, type = 'polite' }) {
  return (
    <div
      role="status"
      aria-live={type} // 'polite' | 'assertive' | 'off'
      aria-atomic="true"
      className="sr-only" // Visually hidden
    >
      {message}
    </div>
  );
}

// Usage
function SearchResults() {
  const [results, setResults] = React.useState([]);
  const [message, setMessage] = React.useState('');
  
  const search = async (query) => {
    const data = await fetchResults(query);
    setResults(data);
    setMessage(`Found ${data.length} results for ${query}`);
  };
  
  return (
    <div>
      <SearchInput onSearch={search} />
      <StatusAnnouncer message={message} />
      <ResultsList results={results} />
    </div>
  );
}

// 2. Visually hidden but screen reader accessible
const srOnly = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0'
};

function Button({ icon, label }) {
  return (
    <button>
      {icon}
      <span style={srOnly}>{label}</span>
    </button>
  );
}

// 3. Loading states
function LoadingButton({ isLoading, children, ...props }) {
  return (
    <button
      {...props}
      disabled={isLoading}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <span className="spinner" aria-hidden="true" />
          <span className="sr-only">Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

// 4. Form validation messages
function FormField({ label, error, required, ...inputProps }) {
  const inputId = React.useId();
  const errorId = `${inputId}-error`;
  
  return (
    <div>
      <label htmlFor={inputId}>
        {label}
        {required && <span aria-label="required">*</span>}
      </label>
      <input
        id={inputId}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && (
        <div id={errorId} role="alert" className="error">
          {error}
        </div>
      )}
    </div>
  );
}

// 5. Complex data tables
function AccessibleTable({ data, columns }) {
  return (
    <table>
      <caption>User Data Table</caption>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} scope="col">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((col, colIndex) => (
              colIndex === 0 ? (
                <th key={col.key} scope="row">
                  {row[col.key]}
                </th>
              ) : (
                <td key={col.key}>{row[col.key]}</td>
              )
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

---

### 2.4 Internationalization (i18n)

#### Interview Question: "How do you implement internationalization in a React app?"

**Answer:**

```javascript
// 1. Basic i18n setup with react-intl
import { IntlProvider, FormattedMessage, FormattedNumber, FormattedDate } from 'react-intl';

const messages = {
  en: {
    'app.greeting': 'Hello, {name}!',
    'app.itemCount': 'You have {count, plural, =0 {no items} one {# item} other {# items}}',
    'button.submit': 'Submit'
  },
  es: {
    'app.greeting': '¡Hola, {name}!',
    'app.itemCount': 'Tienes {count, plural, =0 {ningún artículo} one {# artículo} other {# artículos}}',
    'button.submit': 'Enviar'
  }
};

function App() {
  const [locale, setLocale] = React.useState('en');
  
  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <div>
        <select value={locale} onChange={(e) => setLocale(e.target.value)}>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
        
        <FormattedMessage
          id="app.greeting"
          values={{ name: 'John' }}
        />
        
        <FormattedMessage
          id="app.itemCount"
          values={{ count: 5 }}
        />
        
        <FormattedNumber value={1234.56} style="currency" currency="USD" />
        
        <FormattedDate value={new Date()} year="numeric" month="long" day="numeric" />
      </div>
    </IntlProvider>
  );
}

// 2. RTL support
function RTLProvider({ children, locale }) {
  const isRTL = ['ar', 'he', 'fa'].includes(locale);
  
  React.useEffect(() => {
    document.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
  }, [isRTL, locale]);
  
  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} lang={locale}>
      {children}
    </div>
  );
}

// CSS for RTL
// Use logical properties
const styles = {
  // Instead of margin-left
  marginInlineStart: '10px',
  
  // Instead of padding-right
  paddingInlineEnd: '20px',
  
  // Instead of text-align: left
  textAlign: 'start'
};

// Or use CSS
// [dir="rtl"] .component { ... }

// 3. Date/time formatting
function formatDate(date, locale) {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

function formatTime(date, locale) {
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  }).format(date);
}

function formatRelativeTime(date, locale) {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const diff = date - new Date();
  const days = Math.round(diff / (1000 * 60 * 60 * 24));
  
  if (Math.abs(days) < 1) {
    return rtf.format(Math.round(diff / (1000 * 60 * 60)), 'hour');
  }
  return rtf.format(days, 'day');
}

// 4. Number formatting
function formatCurrency(amount, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
}

function formatPercent(value, locale) {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
}

// 5. Pluralization
function getPluralForm(count, locale) {
  const pr = new Intl.PluralRules(locale);
  return pr.select(count); // 'zero', 'one', 'two', 'few', 'many', 'other'
}

function getItemCountMessage(count, locale) {
  const messages = {
    en: {
      zero: 'no items',
      one: '1 item',
      other: `${count} items`
    },
    ru: {
      one: `${count} предмет`,
      few: `${count} предмета`,
      many: `${count} предметов`,
      other: `${count} предметов`
    }
  };
  
  const form = getPluralForm(count, locale);
  return messages[locale][form] || messages[locale].other;
}
```

**Best Practices:**
- Always externalize strings
- Use ICU message syntax
- Support RTL layouts with logical CSS properties
- Format dates, numbers, and currencies per locale
- Handle pluralization properly
- Load translations lazily
- Use locale negotiation
- Test with pseudo-localization

---

## 3. FRONT-END SECURITY (2 hours)

### 3.1 XSS (Cross-Site Scripting)

#### Interview Question: "How do you prevent XSS attacks?"

**Answer:**

```javascript
// 1. React automatically escapes content
function SafeComponent({ userInput }) {
  // This is safe - React escapes HTML
  return <div>{userInput}</div>;
}

// 2. Dangerous: dangerouslySetInnerHTML
// ❌ NEVER do this with untrusted content
function UnsafeComponent({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// ✅ If you must use HTML, sanitize it first
import DOMPurify from 'dompurify';

function SafeHTML({ html }) {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p'],
    ALLOWED_ATTR: ['href']
  });
  
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// 3. Sanitize URLs
function isValidURL(url) {
  try {
    const parsed = new URL(url, window.location.origin);
    // Only allow http, https, mailto
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function SafeLink({ href, children }) {
  if (!isValidURL(href)) {
    console.warn('Invalid URL blocked:', href);
    return <span>{children}</span>;
  }
  
  return (
    <a
      href={href}
      rel="noopener noreferrer" // Prevent tabnabbing
      target="_blank"
    >
      {children}
    </a>
  );
}

// 4. Content Security Policy (CSP)
// Add to HTML head or HTTP headers
const cspHeader = `
  default-src 'self';
  script-src 'self' https://trusted-cdn.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
`;

// In React:
function App() {
  return (
    <html>
      <head>
        <meta httpEquiv="Content-Security-Policy" content={cspHeader} />
      </head>
      <body>
        {/* app content */}
      </body>
    </html>
  );
}

// 5. Avoid inline event handlers
// ❌ Bad
<button onclick="alert('XSS')">Click</button>

// ✅ Good
function Button() {
  const handleClick = () => {
    alert('Safe');
  };
  return <button onClick={handleClick}>Click</button>;
}

// 6. Escape user input in JSON
function escapeJSON(obj) {
  return JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

// Usage in server-side rendering
const initialData = escapeJSON({ user: userInput });
// <script>window.__INITIAL_DATA__ = {initialData}</script>
```

**XSS Prevention Checklist:**
- ✅ Use frameworks that auto-escape (React, Vue, Angular)
- ✅ Sanitize all HTML content with DOMPurify
- ✅ Validate and sanitize URLs
- ✅ Implement Content Security Policy
- ✅ Use HTTPOnly cookies for sensitive data
- ✅ Avoid dangerouslySetInnerHTML
- ✅ Escape JSON in server-side rendering
- ✅ Use textContent instead of innerHTML

---

### 3.2 CSRF (Cross-Site Request Forgery)

#### Interview Question: "How do you prevent CSRF attacks?"

**Answer:**

```javascript
// 1. CSRF Token pattern
// Server sets token in cookie
// Client sends token in header

// axios interceptor
import axios from 'axios';

// Read CSRF token from cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

axios.interceptors.request.use((config) => {
  const token = getCookie('XSRF-TOKEN');
  if (token) {
    config.headers['X-XSRF-TOKEN'] = token;
  }
  return config;
});

// 2. Double Submit Cookie pattern
async function makeSecureRequest(url, data) {
  // Generate token
  const token = crypto.randomUUID();
  
  // Set in cookie
  document.cookie = `csrf_token=${token}; SameSite=Strict; Secure`;
  
  // Send in request
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': token
    },
    body: JSON.stringify(data),
    credentials: 'include' // Include cookies
  });
  
  return response.json();
}

// 3. SameSite Cookie attribute
// Set on server:
// Set-Cookie: sessionId=abc123; SameSite=Strict; Secure; HttpOnly

// In Express:
app.use(session({
  cookie: {
    sameSite: 'strict', // or 'lax'
    secure: true, // HTTPS only
    httpOnly: true // Not accessible via JavaScript
  }
}));

// 4. Check Origin/Referer headers (server-side)
// Express middleware:
function checkOrigin(req, res, next) {
  const origin = req.get('Origin') || req.get('Referer');
  const allowedOrigins = ['https://example.com'];
  
  if (origin && allowedOrigins.some(allowed => origin.startsWith(allowed))) {
    next();
  } else {
    res.status(403).json({ error: 'Invalid origin' });
  }
}

app.post('/api/*', checkOrigin, handleRequest);

// 5. Use custom headers for AJAX requests
// Simple custom headers trigger CORS preflight
async function secureAjax(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest' // Custom header
    },
    body: JSON.stringify(data),
    credentials: 'include'
  });
}
```

**CSRF Prevention Checklist:**
- ✅ Use CSRF tokens for state-changing operations
- ✅ Set SameSite=Strict on cookies
- ✅ Verify Origin/Referer headers
- ✅ Use custom headers for AJAX
- ✅ Don't use GET for state changes
- ✅ Require re-authentication for sensitive actions

---

### 3.3 CORS (Cross-Origin Resource Sharing)

#### Interview Question: "Explain CORS and how to handle it"

**Answer:**

```javascript
// 1. Understanding CORS
// Browser blocks cross-origin requests unless server allows them

// Server-side (Express):
const cors = require('cors');

// Simple CORS (allow all)
app.use(cors());

// Configured CORS
app.use(cors({
  origin: ['https://example.com', 'https://app.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count'],
  credentials: true, // Allow cookies
  maxAge: 86400 // Cache preflight for 24 hours
}));

// Dynamic origin check
app.use(cors({
  origin: function (origin, callback) {
    const whitelist = ['https://example.com'];
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 2. Client-side handling

// Simple request (no preflight)
fetch('https://api.example.com/data', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Complex request (triggers preflight)
fetch('https://api.example.com/data', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'value'
  },
  credentials: 'include', // Send cookies
  body: JSON.stringify(data)
});

// 3. Handling CORS errors
async function fetchWithCORS(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      mode: 'cors', // Default for cross-origin requests
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.message.includes('CORS')) {
      console.error('CORS error - server must allow this origin');
      // Show user-friendly message
    }
    throw error;
  }
}

// 4. Proxy for development
// package.json (Create React App):
{
  "proxy": "http://localhost:5000"
}

// Now you can make requests to relative URLs:
fetch('/api/data'); // Proxied to http://localhost:5000/api/data

// Vite proxy configuration:
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
};

// 5. JSONP (legacy, avoid if possible)
function jsonp(url, callback) {
  const script = document.createElement('script');
  const callbackName = 'jsonp_' + Date.now();
  
  window[callbackName] = (data) => {
    callback(data);
    delete window[callbackName];
    script.remove();
  };
  
  script.src = `${url}?callback=${callbackName}`;
  document.body.appendChild(script);
}
```

**CORS Key Points:**
- Preflight requests (OPTIONS) for non-simple requests
- Simple requests: GET, POST, HEAD with safe headers
- Credentials require explicit origin (not *)
- Server must set appropriate CORS headers
- Use proxy in development

---

### 3.4 Authentication & Authorization

#### Interview Question: "How do you implement secure authentication?"

**Answer:**

```javascript
// 1. JWT Token Management
class AuthService {
  constructor() {
    this.accessToken = null;
    this.refreshToken = null;
  }
  
  async login(email, password) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const { accessToken, refreshToken } = await response.json();
    
    // Store tokens securely
    this.accessToken = accessToken;
    // Store refresh token in HttpOnly cookie (server-side)
    // Or in-memory only (most secure)
    
    return { accessToken };
  }
  
  async refreshAccessToken() {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include' // Send HttpOnly cookie
    });
    
    const { accessToken } = await response.json();
    this.accessToken = accessToken;
    return accessToken;
  }
  
  logout() {
    this.accessToken = null;
    this.refreshToken = null;
    // Call server to invalidate refresh token
    fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
  }
  
  getAccessToken() {
    return this.accessToken;
  }
}

const authService = new AuthService();

// 2. Axios interceptor with token refresh
axios.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await authService.refreshAccessToken();
        return axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// 3. Protected Route component
function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
}

// Usage
<Route path="/admin" element={
  <ProtectedRoute requiredRole="admin">
    <AdminDashboard />
  </ProtectedRoute>
} />

// 4. Secure password handling (client-side validation)
function validatePassword(password) {
  const minLength = 12;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const errors = [];
  if (password.length < minLength) {
    errors.push(`Minimum ${minLength} characters`);
  }
  if (!hasUppercase) errors.push('One uppercase letter');
  if (!hasLowercase) errors.push('One lowercase letter');
  if (!hasNumber) errors.push('One number');
  if (!hasSpecialChar) errors.push('One special character');
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// NEVER validate passwords on client only - always server-side too!

// 5. Session timeout
function useSessionTimeout(timeoutMinutes = 30) {
  const timeoutRef = React.useRef();
  const { logout } = useAuth();
  
  const resetTimeout = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      logout();
      alert('Session expired. Please log in again.');
    }, timeoutMinutes * 60 * 1000);
  }, [timeoutMinutes, logout]);
  
  React.useEffect(() => {
    // Reset on user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimeout);
    });
    
    resetTimeout();
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [resetTimeout]);
}
```

**Security Best Practices:**
- ✅ Use HTTPS always
- ✅ Store JWT in memory, not localStorage
- ✅ Use HttpOnly cookies for refresh tokens
- ✅ Implement token refresh mechanism
- ✅ Set session timeout
- ✅ Use strong password requirements
- ✅ Implement rate limiting
- ✅ Log security events
- ✅ Use RBAC for authorization
- ✅ Validate on both client and server

---

### 3.5 Input Validation & Sanitization

#### Interview Question: "How do you validate and sanitize user input?"

**Answer:**

```javascript
// 1. Form validation
const validators = {
  email: (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return 'Email is required';
    if (!regex.test(value)) return 'Invalid email format';
    return null;
  },
  
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 12) return 'Password must be at least 12 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain uppercase letter';
    if (!/[a-z]/.test(value)) return 'Password must contain lowercase letter';
    if (!/\d/.test(value)) return 'Password must contain number';
    if (!/[!@#$%^&*]/.test(value)) return 'Password must contain special character';
    return null;
  },
  
  phone: (value) => {
    const regex = /^\+?[\d\s-()]+$/;
    if (!value) return 'Phone is required';
    if (!regex.test(value)) return 'Invalid phone format';
    if (value.replace(/\D/g, '').length < 10) return 'Phone must have at least 10 digits';
    return null;
  },
  
  creditCard: (value) => {
    // Luhn algorithm
    const digits = value.replace(/\D/g, '');
    if (digits.length < 13 || digits.length > 19) return 'Invalid card number';
    
    let sum = 0;
    let isEven = false;
    
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    if (sum % 10 !== 0) return 'Invalid card number';
    return null;
  },
  
  url: (value) => {
    try {
      new URL(value);
      return null;
    } catch {
      return 'Invalid URL';
    }
  }
};

// 2. Sanitization functions
function sanitizeHTML(dirty) {
  // Use DOMPurify for real applications
  return dirty
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

function sanitizeFileName(filename) {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .slice(0, 255);
}

function sanitizeSQL(input) {
  // Use parameterized queries instead!
  // This is just for demonstration
  return input
    .replace(/'/g, "''")
    .replace(/;/g, '')
    .replace(/--/g, '');
}

// 3. Input length limits
function validateLength(value, min, max) {
  if (value.length < min) return `Minimum ${min} characters`;
  if (value.length > max) return `Maximum ${max} characters`;
  return null;
}

// 4. Whitelist validation
function validateEnum(value, allowedValues) {
  if (!allowedValues.includes(value)) {
    return `Must be one of: ${allowedValues.join(', ')}`;
  }
  return null;
}

// Usage example
const ALLOWED_ROLES = ['user', 'admin', 'moderator'];
validateEnum(userRole, ALLOWED_ROLES);

// 5. File upload validation
function validateFile(file) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  
  const errors = [];
  
  if (file.size > maxSize) {
    errors.push('File size must be less than 5MB');
  }
  
  if (!allowedTypes.includes(file.type)) {
    errors.push('File type not allowed');
  }
  
  // Check file extension as well (MIME type can be spoofed)
  const extension = file.name.split('.').pop().toLowerCase();
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf'];
  
  if (!allowedExtensions.includes(extension)) {
    errors.push('File extension not allowed');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// 6. Rate limiting (client-side)
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.requests = [];
  }
  
  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    
    return false;
  }
  
  getTimeUntilNextRequest() {
    if (this.requests.length < this.maxRequests) return 0;
    
    const oldestRequest = Math.min(...this.requests);
    return this.windowMs - (Date.now() - oldestRequest);
  }
}

// Usage
const limiter = new RateLimiter(5, 60000); // 5 requests per minute

function handleSubmit() {
  if (!limiter.canMakeRequest()) {
    const waitTime = Math.ceil(limiter.getTimeUntilNextRequest() / 1000);
    alert(`Too many requests. Please wait ${waitTime} seconds.`);
    return;
  }
  
  // Make request
}
```

---

## QUICK REFERENCE CHECKLIST

### Performance ✅
- [ ] Lazy load components and routes
- [ ] Implement code splitting
- [ ] Optimize images (WebP, lazy loading, srcset)
- [ ] Use React.memo, useMemo, useCallback
- [ ] Implement virtual scrolling for large lists
- [ ] Debounce/throttle expensive operations
- [ ] Monitor with Performance API and Web Vitals
- [ ] Minimize bundle size
- [ ] Use CDN for static assets
- [ ] Enable compression (gzip/brotli)

### Accessibility ✅
- [ ] Use semantic HTML
- [ ] Add proper ARIA attributes
- [ ] Implement keyboard navigation
- [ ] Manage focus properly
- [ ] Provide text alternatives
- [ ] Ensure color contrast (WCAG AA: 4.5:1)
- [ ] Support screen readers with live regions
- [ ] Make forms accessible
- [ ] Test with keyboard only
- [ ] Support RTL layouts

### Security ✅
- [ ] Sanitize all user input
- [ ] Implement CSP headers
- [ ] Use HTTPS everywhere
- [ ] Prevent XSS with proper escaping
- [ ] Implement CSRF tokens
- [ ] Configure CORS properly
- [ ] Store tokens securely
- [ ] Validate on client AND server
- [ ] Set secure cookie attributes
- [ ] Implement rate limiting

---

## COMMON INTERVIEW QUESTIONS

1. **"What are the Core Web Vitals?"**
   - LCP (< 2.5s), FID (< 100ms), CLS (< 0.1)

2. **"How do you optimize React performance?"**
   - React.memo, useMemo, useCallback, code splitting, virtualization

3. **"Explain ARIA roles"**
   - Provide semantic meaning for assistive technologies

4. **"How do you prevent XSS?"**
   - Sanitize input, use CSP, avoid dangerouslySetInnerHTML

5. **"What is CSRF and how to prevent it?"**
   - Use CSRF tokens, SameSite cookies, verify Origin headers

6. **"How do you implement i18n?"**
   - Use react-intl, Intl API, support RTL, format dates/numbers per locale

7. **"What is lazy loading?"**
   - Load resources only when needed to improve initial load time

8. **"Explain keyboard navigation"**
   - Tab order, focus management, keyboard shortcuts, skip links

9. **"What is CORS?"**
   - Browser security mechanism to control cross-origin requests

10. **"How do you measure performance?"**
    - Performance API, Web Vitals, Lighthouse, React Profiler

---

Good luck with your interview! 🚀

Remember: Focus on understanding concepts, not memorizing code. Be ready to explain WHY you'd use each technique.