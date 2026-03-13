# THG India Interview Prep: Accessibility & SEO
## For 3+ Years Experience Frontend Developer

---

## Table of Contents

### Part 1: Accessibility (A11Y)
- [1.1 WCAG Guidelines Overview](#11-wcag-guidelines-overview)
- [1.2 Semantic HTML - The Foundation](#12-semantic-html---the-foundation)
- [1.3 ARIA (Accessible Rich Internet Applications)](#13-aria-accessible-rich-internet-applications)
- [1.4 Keyboard Navigation](#14-keyboard-navigation)
- [1.5 Color & Visual Accessibility](#15-color--visual-accessibility)
- [1.6 Forms Accessibility](#16-forms-accessibility)
- [1.7 Images & Media Accessibility](#17-images--media-accessibility)
- [1.8 Testing Accessibility](#18-testing-accessibility)
- [1.9 Accessibility Interview Questions](#19-accessibility-interview-questions)

### Part 2: Search Engine Optimization (SEO)
- [2.1 Technical SEO Fundamentals](#21-technical-seo-fundamentals)
- [2.2 Meta Tags & HTML Head](#22-meta-tags--html-head)
- [2.3 Open Graph & Social Sharing](#23-open-graph--social-sharing)
- [2.4 Structured Data (Schema.org)](#24-structured-data-schemaorg)
- [2.5 URL Structure & Routing](#25-url-structure--routing)
- [2.6 JavaScript & SEO (Critical for SPAs)](#26-javascript--seo-critical-for-spas)
- [2.7 Core Web Vitals for SEO](#27-core-web-vitals-for-seo)
- [2.8 Sitemaps & Robots.txt](#28-sitemaps--robotstxt)
- [2.9 Internal Linking & Navigation](#29-internal-linking--navigation)
- [2.10 Handling Duplicate Content](#210-handling-duplicate-content)
- [2.11 Mobile SEO](#211-mobile-seo)
- [2.12 SEO Interview Questions](#212-seo-interview-questions)

### Part 3: Quick Reference
- [Quick Reference Checklists](#part-3-quick-reference-checklists)
- [Common Interview Questions Summary](#common-interview-questions-summary)

---

# PART 1: ACCESSIBILITY (A11Y)

## 1.1 WCAG Guidelines Overview

### What is WCAG?
Web Content Accessibility Guidelines - international standards for web accessibility.

**WCAG 2.1 Four Principles (POUR):**

| Principle | Description | Example |
|-----------|-------------|---------|
| **Perceivable** | Information must be presentable in ways users can perceive | Alt text, captions, color contrast |
| **Operable** | UI must be operable by all users | Keyboard navigation, no time limits |
| **Understandable** | Content must be understandable | Clear language, predictable behavior |
| **Robust** | Content must work with assistive technologies | Valid HTML, ARIA |

**Conformance Levels:**
- **Level A** - Minimum (basic accessibility)
- **Level AA** - Target for most websites (legal requirement in many places)
- **Level AAA** - Highest (not always achievable)

### Interview Question: "What WCAG level should we target and why?"

**Answer:**
> "Level AA is the standard target for commercial websites. It's legally required in many jurisdictions (EU, UK's Equality Act, ADA in US). Level AAA is aspirational but not always practical for all content. For e-commerce like THG, AA compliance ensures we don't exclude customers with disabilities - which represents roughly 15% of the global population."

---

## 1.2 Semantic HTML - The Foundation

### Why Semantic HTML Matters
Screen readers and assistive technologies rely on HTML semantics to convey structure and meaning.

```html
<!-- ❌ BAD: Non-semantic -->
<div class="header">
  <div class="nav">
    <div class="link" onclick="navigate()">Home</div>
  </div>
</div>
<div class="main">
  <div class="article">
    <div class="title">Product Name</div>
    <div class="text">Description...</div>
  </div>
</div>

<!-- ✅ GOOD: Semantic -->
<header>
  <nav aria-label="Main navigation">
    <a href="/">Home</a>
  </nav>
</header>
<main>
  <article>
    <h1>Product Name</h1>
    <p>Description...</p>
  </article>
</main>
```

### Key Semantic Elements

| Element | Purpose | ARIA Role (implicit) |
|---------|---------|---------------------|
| `<header>` | Page/section header | `banner` (page-level) |
| `<nav>` | Navigation links | `navigation` |
| `<main>` | Main content (one per page) | `main` |
| `<article>` | Self-contained content | `article` |
| `<section>` | Thematic grouping | `region` (with aria-label) |
| `<aside>` | Tangentially related content | `complementary` |
| `<footer>` | Footer content | `contentinfo` (page-level) |
| `<figure>` | Self-contained media | `figure` |
| `<figcaption>` | Caption for figure | - |

### Interview Question: "What's the difference between `<section>` and `<div>`?"

**Answer:**
> "`<section>` represents a thematic grouping of content with a heading, and contributes to the document outline. It should be used when the content would be listed in the document's outline. `<div>` is a generic container with no semantic meaning - use it only for styling purposes. Screen readers announce sections as regions (when labeled), but ignore divs."

---

## 1.3 ARIA (Accessible Rich Internet Applications)

### The First Rule of ARIA
> "No ARIA is better than bad ARIA"

Use ARIA only when HTML semantics are insufficient.

### Common ARIA Attributes

```javascript
// 1. Roles - Define what an element IS
<div role="button">Click me</div>        // Acts as button
<div role="alert">Error occurred</div>   // Announces immediately
<ul role="listbox">...</ul>              // Custom select
<div role="dialog">...</div>             // Modal dialog
<div role="tablist">...</div>            // Tab interface

// 2. States - Current state of element
aria-expanded="true/false"    // Expandable element
aria-selected="true/false"    // Selected item
aria-checked="true/false"     // Checkbox state
aria-pressed="true/false"     // Toggle button
aria-disabled="true/false"    // Disabled state
aria-hidden="true/false"      // Hidden from AT
aria-busy="true/false"        // Loading state
aria-invalid="true/false"     // Form validation

// 3. Properties - Unchanging characteristics
aria-label="Description"           // Accessible name
aria-labelledby="id"              // Reference to label
aria-describedby="id"             // Additional description
aria-required="true"              // Required field
aria-haspopup="menu/listbox/dialog"  // Has popup
aria-controls="id"                // Controls another element
aria-live="polite/assertive"      // Live region
aria-atomic="true/false"          // Announce all or changes
```

### Complete Accessible Component Examples

#### Accessible Custom Select/Dropdown

```javascript
function AccessibleSelect({ label, options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const listboxId = useId();
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  const selectedOption = options.find(opt => opt.value === value);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (isOpen) {
          onChange(options[activeIndex].value);
          setIsOpen(false);
          buttonRef.current?.focus();
        } else {
          setIsOpen(true);
        }
        break;
      
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setActiveIndex(prev => Math.min(prev + 1, options.length - 1));
        }
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setActiveIndex(prev => Math.max(prev - 1, 0));
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      
      case 'Home':
        e.preventDefault();
        setActiveIndex(0);
        break;
      
      case 'End':
        e.preventDefault();
        setActiveIndex(options.length - 1);
        break;
        
      default:
        // Type-ahead: jump to option starting with typed character
        const char = e.key.toLowerCase();
        const matchIndex = options.findIndex(
          opt => opt.label.toLowerCase().startsWith(char)
        );
        if (matchIndex !== -1) {
          setActiveIndex(matchIndex);
        }
    }
  };

  return (
    <div className="select-container">
      <label id={`${listboxId}-label`}>{label}</label>
      
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${listboxId}-label`}
        aria-controls={listboxId}
        aria-activedescendant={isOpen ? `option-${activeIndex}` : undefined}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
      >
        {selectedOption?.label || 'Select an option'}
        <span aria-hidden="true">▼</span>
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={`${listboxId}-label`}
          tabIndex={-1}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`option-${index}`}
              role="option"
              aria-selected={option.value === value}
              className={index === activeIndex ? 'active' : ''}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
                buttonRef.current?.focus();
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

#### Accessible Modal Dialog

```javascript
function AccessibleModal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (isOpen) {
      // Store currently focused element
      previousActiveElement.current = document.activeElement;
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Focus first focusable element or the modal itself
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusableElements?.[0]?.focus();
      
      return () => {
        document.body.style.overflow = '';
        // Restore focus when modal closes
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
        return;
      }

      // Focus trap
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements?.[0];
        const lastElement = focusableElements?.[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="modal-content"
      >
        <header className="modal-header">
          <h2 id={titleId}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="close-button"
          >
            ✕
          </button>
        </header>
        
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
```

---

## 1.4 Keyboard Navigation

### Focus Management Principles

1. **All interactive elements must be focusable**
2. **Focus order must be logical** (usually DOM order)
3. **Focus must be visible**
4. **Custom widgets need keyboard support**

### Common Keyboard Patterns

| Widget | Keys |
|--------|------|
| Button | `Enter`, `Space` - Activate |
| Link | `Enter` - Navigate |
| Checkbox | `Space` - Toggle |
| Radio buttons | `Arrow keys` - Move selection |
| Tabs | `Arrow keys` - Navigate, `Tab` - Enter/Exit |
| Menu | `Arrow keys` - Navigate, `Enter` - Select, `Escape` - Close |
| Modal | `Tab` - Cycle focus, `Escape` - Close |
| Listbox | `Arrow keys` - Navigate, `Enter` - Select |

### Skip Links

```javascript
function SkipLinks() {
  return (
    <nav aria-label="Skip links" className="skip-links">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#main-navigation" className="skip-link">
        Skip to navigation
      </a>
      <a href="#search" className="skip-link">
        Skip to search
      </a>
    </nav>
  );
}

// CSS for skip links (visible on focus)
.skip-link {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.skip-link:focus {
  position: fixed;
  top: 10px;
  left: 10px;
  width: auto;
  height: auto;
  padding: 16px 24px;
  background: #000;
  color: #fff;
  z-index: 9999;
  text-decoration: none;
}
```

### Roving Tab Index Pattern

```javascript
function TabList({ tabs, activeTab, onChange }) {
  const tabRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    let newIndex = index;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        newIndex = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
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
    onChange(tabs[newIndex].id);
  };

  return (
    <div role="tablist" aria-label="Content tabs">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          ref={(el) => (tabRefs.current[index] = el)}
          role="tab"
          id={`tab-${tab.id}`}
          aria-selected={tab.id === activeTab}
          aria-controls={`panel-${tab.id}`}
          tabIndex={tab.id === activeTab ? 0 : -1}
          onClick={() => onChange(tab.id)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function TabPanel({ id, activeTab, children }) {
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      hidden={id !== activeTab}
      tabIndex={0}
    >
      {children}
    </div>
  );
}
```

---

## 1.5 Color & Visual Accessibility

### Color Contrast Requirements

| Level | Normal Text (<18pt) | Large Text (≥18pt or 14pt bold) |
|-------|---------------------|--------------------------------|
| AA | 4.5:1 | 3:1 |
| AAA | 7:1 | 4.5:1 |

### Don't Rely on Color Alone

```javascript
// ❌ BAD: Only color indicates error
<input style={{ borderColor: hasError ? 'red' : 'gray' }} />

// ✅ GOOD: Color + icon + text
<div className="form-field">
  <input
    aria-invalid={hasError}
    aria-describedby={hasError ? 'error-message' : undefined}
    style={{ borderColor: hasError ? '#d32f2f' : '#ccc' }}
  />
  {hasError && (
    <div id="error-message" role="alert" className="error">
      <span aria-hidden="true">⚠️</span>
      <span>This field is required</span>
    </div>
  )}
</div>
```

### Focus Indicators

```css
/* Never remove focus outline without replacement */
/* ❌ BAD */
*:focus { outline: none; }

/* ✅ GOOD: Custom visible focus indicator */
:focus-visible {
  outline: 3px solid #4a90d9;
  outline-offset: 2px;
}

/* High contrast focus for dark backgrounds */
.dark-theme :focus-visible {
  outline: 3px solid #ffffff;
  outline-offset: 2px;
  box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.3);
}
```

---

## 1.6 Forms Accessibility

### Accessible Form Pattern

```javascript
function AccessibleForm() {
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={handleSubmit}
      noValidate // Use custom validation
      aria-describedby={submitted ? 'form-status' : undefined}
    >
      {/* Success/Error summary for screen readers */}
      {submitted && (
        <div
          id="form-status"
          role="alert"
          aria-live="polite"
          className="form-status"
        >
          {Object.keys(errors).length > 0 ? (
            <>
              <h2>Please correct the following errors:</h2>
              <ul>
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>
                    <a href={`#${field}`}>{message}</a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>Form submitted successfully!</p>
          )}
        </div>
      )}

      {/* Text input with error handling */}
      <div className="form-group">
        <label htmlFor="email">
          Email address
          <span aria-hidden="true" className="required">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : 'email-hint'}
          autoComplete="email"
        />
        <div id="email-hint" className="hint">
          We'll never share your email
        </div>
        {errors.email && (
          <div id="email-error" role="alert" className="error">
            {errors.email}
          </div>
        )}
      </div>

      {/* Checkbox group */}
      <fieldset>
        <legend>Notification preferences</legend>
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="news"
            name="notifications"
            value="news"
          />
          <label htmlFor="news">Newsletter updates</label>
        </div>
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="offers"
            name="notifications"
            value="offers"
          />
          <label htmlFor="offers">Special offers</label>
        </div>
      </fieldset>

      {/* Radio group */}
      <fieldset>
        <legend>
          Shipping method
          <span aria-hidden="true" className="required">*</span>
        </legend>
        <div className="radio-group">
          <input
            type="radio"
            id="standard"
            name="shipping"
            value="standard"
            aria-required="true"
          />
          <label htmlFor="standard">Standard (5-7 days)</label>
        </div>
        <div className="radio-group">
          <input
            type="radio"
            id="express"
            name="shipping"
            value="express"
          />
          <label htmlFor="express">Express (2-3 days)</label>
        </div>
      </fieldset>

      <button type="submit">Submit Order</button>
    </form>
  );
}
```

### Form Validation Announcement

```javascript
function useFormAnnouncer() {
  const [announcement, setAnnouncement] = useState('');

  const announce = (message, type = 'polite') => {
    setAnnouncement({ message, type });
    // Clear after announcement
    setTimeout(() => setAnnouncement(''), 1000);
  };

  const AnnouncerElement = () => (
    <div
      role="status"
      aria-live={announcement.type}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement.message}
    </div>
  );

  return { announce, AnnouncerElement };
}

// Usage
const { announce, AnnouncerElement } = useFormAnnouncer();

const validateField = (value) => {
  if (!value) {
    announce('Email is required', 'assertive');
    return false;
  }
  announce('Email is valid', 'polite');
  return true;
};
```

---

## 1.7 Images & Media Accessibility

### Alternative Text Guidelines

```javascript
// Informative images - describe content
<img 
  src="/product.jpg" 
  alt="Navy blue cotton t-shirt with round neck, front view"
/>

// Decorative images - empty alt
<img src="/decorative-border.svg" alt="" role="presentation" />

// Complex images - detailed description
<figure>
  <img 
    src="/chart.png" 
    alt="Sales chart showing quarterly growth"
    aria-describedby="chart-description"
  />
  <figcaption id="chart-description">
    Q1: £2.3M, Q2: £2.8M, Q3: £3.1M, Q4: £3.9M. 
    Total growth of 70% year-over-year.
  </figcaption>
</figure>

// Linked images - describe destination/action
<a href="/product/123">
  <img src="/product.jpg" alt="View Navy T-shirt details" />
</a>

// Image buttons
<button aria-label="Add to cart">
  <img src="/cart-icon.svg" alt="" aria-hidden="true" />
</button>
```

### Video Accessibility

```javascript
function AccessibleVideo({ src, title, captions, transcript }) {
  return (
    <figure>
      <video
        controls
        aria-label={title}
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        
        {/* Captions track */}
        <track
          kind="captions"
          src={captions}
          srcLang="en"
          label="English captions"
          default
        />
        
        {/* Audio description track */}
        <track
          kind="descriptions"
          src="/descriptions.vtt"
          srcLang="en"
          label="Audio descriptions"
        />
        
        {/* Fallback */}
        Your browser doesn't support video. 
        <a href={src}>Download the video</a>
      </video>
      
      <figcaption>{title}</figcaption>
      
      {/* Full transcript */}
      <details>
        <summary>View transcript</summary>
        <div className="transcript">{transcript}</div>
      </details>
    </figure>
  );
}
```

---

## 1.8 Testing Accessibility

### Automated Testing Tools

```javascript
// 1. jest-axe for unit tests
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('component has no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// 2. Cypress-axe for e2e tests
describe('Accessibility', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('homepage has no a11y violations', () => {
    cy.checkA11y();
  });

  it('modal has no a11y violations', () => {
    cy.get('[data-testid="open-modal"]').click();
    cy.checkA11y('.modal');
  });
});
```

### Manual Testing Checklist

| Test | How |
|------|-----|
| Keyboard only | Unplug mouse, navigate entire page with Tab/Enter/Arrow keys |
| Screen reader | Test with NVDA (Windows), VoiceOver (Mac), or JAWS |
| Zoom | Zoom to 200% - content should remain usable |
| Color contrast | Use browser devtools or WebAIM contrast checker |
| Reduced motion | Enable prefers-reduced-motion in OS settings |
| High contrast | Test with Windows High Contrast Mode |

### Common Screen Reader Commands

**VoiceOver (Mac):**
- `VO + H` - Open rotor for headings
- `VO + U` - Open rotor menu
- `VO + A` - Read all from current position
- `VO + Arrows` - Navigate

**NVDA (Windows):**
- `H` - Next heading
- `1-6` - Heading levels
- `F` - Next form field
- `T` - Next table
- `L` - Next list

---

## 1.9 Accessibility Interview Questions

### Q1: "How would you make a product image carousel accessible?"

**Answer:**
```javascript
function AccessibleCarousel({ products }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const liveRegionRef = useRef(null);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    // Announce to screen readers
    liveRegionRef.current?.focus();
  };

  return (
    <section aria-roledescription="carousel" aria-label="Product gallery">
      {/* Live region for announcements */}
      <div
        ref={liveRegionRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        Showing product {currentIndex + 1} of {products.length}: 
        {products[currentIndex].name}
      </div>

      {/* Pause/Play button */}
      <button
        onClick={() => setIsPaused(!isPaused)}
        aria-label={isPaused ? 'Play carousel' : 'Pause carousel'}
      >
        {isPaused ? '▶' : '⏸'}
      </button>

      {/* Slides */}
      <div
        role="group"
        aria-roledescription="slide"
        aria-label={`${currentIndex + 1} of ${products.length}`}
      >
        <img
          src={products[currentIndex].image}
          alt={products[currentIndex].altText}
        />
        <h3>{products[currentIndex].name}</h3>
      </div>

      {/* Navigation */}
      <button
        onClick={() => goToSlide(Math.max(0, currentIndex - 1))}
        aria-label="Previous slide"
        disabled={currentIndex === 0}
      >
        Previous
      </button>
      
      <button
        onClick={() => goToSlide(Math.min(products.length - 1, currentIndex + 1))}
        aria-label="Next slide"
        disabled={currentIndex === products.length - 1}
      >
        Next
      </button>

      {/* Slide indicators */}
      <div role="tablist" aria-label="Slide selection">
        {products.map((_, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}
```

### Q2: "What's the difference between aria-label, aria-labelledby, and aria-describedby?"

**Answer:**
> - `aria-label`: Provides an accessible name directly as a string. Use when no visible label exists.
> - `aria-labelledby`: References another element's ID that provides the accessible name. Use when a visible label exists but isn't programmatically associated.
> - `aria-describedby`: References element providing additional descriptive information. Announced after the name.
>
> Priority: `aria-labelledby` > `aria-label` > native label/title

```javascript
// aria-label
<button aria-label="Close dialog">✕</button>

// aria-labelledby
<h2 id="modal-title">Confirm Purchase</h2>
<div role="dialog" aria-labelledby="modal-title">...</div>

// aria-describedby
<input 
  aria-label="Password"
  aria-describedby="password-requirements"
/>
<div id="password-requirements">
  Must be at least 12 characters with uppercase, lowercase, and numbers
</div>
```

### Q3: "How do you handle focus management in a single-page application?"

**Answer:**
> When content changes dynamically in SPAs, we need to:
> 1. Move focus to new content or announce it
> 2. Update the page title
> 3. Announce loading states

```javascript
function useRouteAnnouncer() {
  const location = useLocation();
  const announcerRef = useRef(null);

  useEffect(() => {
    // Update page title
    const pageTitle = document.title;
    
    // Announce page change
    if (announcerRef.current) {
      announcerRef.current.textContent = `Navigated to ${pageTitle}`;
    }

    // Move focus to main content
    const mainContent = document.getElementById('main-content');
    mainContent?.focus();
  }, [location]);

  return (
    <div
      ref={announcerRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
}
```

---

# PART 2: SEARCH ENGINE OPTIMIZATION (SEO)

## 2.1 Technical SEO Fundamentals

### Why SEO Matters for Frontend Developers

As a frontend developer, you control:
- Page structure (headings, semantic HTML)
- Meta tags and structured data
- Performance (Core Web Vitals)
- JavaScript rendering
- URL structure
- Internal linking

### How Search Engines Work

1. **Crawling** - Googlebot discovers pages via links and sitemaps
2. **Indexing** - Pages are analyzed and stored
3. **Ranking** - Pages ranked based on relevance, quality, and other signals

---

## 2.2 Meta Tags & HTML Head

### Essential Meta Tags

```javascript
function SEOHead({ page }) {
  return (
    <head>
      {/* Character encoding - MUST be first */}
      <meta charSet="utf-8" />
      
      {/* Viewport for mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Page title - Most important SEO element */}
      <title>{page.title} | THG</title>
      
      {/* Meta description - Shown in search results */}
      <meta name="description" content={page.description} />
      
      {/* Canonical URL - Prevents duplicate content */}
      <link rel="canonical" href={page.canonicalUrl} />
      
      {/* Robots directive */}
      <meta name="robots" content="index, follow" />
      {/* Or for pages that shouldn't be indexed: */}
      {/* <meta name="robots" content="noindex, nofollow" /> */}
      
      {/* Language and region */}
      <html lang="en-GB" />
      
      {/* For multilingual sites */}
      <link rel="alternate" hrefLang="en-GB" href="https://www.thg.com/product" />
      <link rel="alternate" hrefLang="en-US" href="https://us.thg.com/product" />
      <link rel="alternate" hrefLang="de-DE" href="https://de.thg.com/product" />
      <link rel="alternate" hrefLang="x-default" href="https://www.thg.com/product" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    </head>
  );
}
```

### Title Tag Best Practices

```javascript
// E-commerce product page title patterns
const titlePatterns = {
  // Pattern: Primary Keyword - Secondary Keyword | Brand
  product: `${product.name} - ${product.category} | THG`,
  
  // Category pages
  category: `${category.name} - Shop ${category.itemCount}+ Products | THG`,
  
  // Search results
  search: `Search Results for "${query}" | THG`,
  
  // Homepage
  home: "THG - Premium Beauty, Nutrition & Lifestyle Products",
};

// Title tag rules:
// - 50-60 characters max (Google truncates longer)
// - Include primary keyword near the beginning
// - Make it unique for every page
// - Be descriptive and compelling
```

### Meta Description Best Practices

```javascript
// Good meta description structure
const metaDescription = {
  // Product page: Feature + Benefit + CTA
  product: `Shop ${product.name}. ${product.keyBenefit}. Free delivery on orders over £30.`,
  
  // Category page: What + Selection + CTA
  category: `Browse our ${category.name} collection. ${category.itemCount}+ products with free returns.`,
  
  // Length: 150-160 characters
  // Include relevant keywords naturally
  // Include a call-to-action
  // Make each one unique
};
```

---

## 2.3 Open Graph & Social Sharing

```javascript
function SocialMetaTags({ page }) {
  return (
    <>
      {/* Open Graph (Facebook, LinkedIn, etc.) */}
      <meta property="og:type" content={page.type || 'website'} />
      <meta property="og:title" content={page.title} />
      <meta property="og:description" content={page.description} />
      <meta property="og:image" content={page.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={page.url} />
      <meta property="og:site_name" content="THG" />
      <meta property="og:locale" content="en_GB" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@THG" />
      <meta name="twitter:title" content={page.title} />
      <meta name="twitter:description" content={page.description} />
      <meta name="twitter:image" content={page.image} />
      
      {/* Product-specific OG tags */}
      {page.type === 'product' && (
        <>
          <meta property="product:price:amount" content={page.price} />
          <meta property="product:price:currency" content="GBP" />
          <meta property="product:availability" content={page.inStock ? 'in stock' : 'out of stock'} />
        </>
      )}
    </>
  );
}
```

---

## 2.4 Structured Data (Schema.org)

### Why Structured Data Matters
- Enables rich snippets in search results (stars, prices, availability)
- Helps search engines understand page content
- Can increase click-through rates by 30%+

### E-commerce Product Schema

```javascript
function ProductSchema({ product }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.sku,
    mpn: product.mpn,
    brand: {
      "@type": "Brand",
      name: product.brand
    },
    offers: {
      "@type": "Offer",
      url: product.url,
      priceCurrency: "GBP",
      price: product.price,
      priceValidUntil: product.priceValidUntil,
      availability: product.inStock 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "THG"
      }
    },
    aggregateRating: product.reviews?.count > 0 ? {
      "@type": "AggregateRating",
      ratingValue: product.reviews.average,
      reviewCount: product.reviews.count
    } : undefined,
    review: product.reviews?.items?.map(review => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author
      },
      datePublished: review.date,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating
      },
      reviewBody: review.text
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Breadcrumb Schema

```javascript
function BreadcrumbSchema({ items }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <>
      {/* Visual breadcrumbs */}
      <nav aria-label="Breadcrumb">
        <ol itemScope itemType="https://schema.org/BreadcrumbList">
          {items.map((item, index) => (
            <li
              key={item.url}
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <a itemProp="item" href={item.url}>
                <span itemProp="name">{item.name}</span>
              </a>
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          ))}
        </ol>
      </nav>
      
      {/* JSON-LD schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
```

### Organization Schema

```javascript
function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "THG",
    url: "https://www.thg.com",
    logo: "https://www.thg.com/logo.png",
    sameAs: [
      "https://www.facebook.com/thg",
      "https://twitter.com/thg",
      "https://www.instagram.com/thg",
      "https://www.linkedin.com/company/thg"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+44-xxx-xxx-xxxx",
      contactType: "customer service",
      areaServed: "GB",
      availableLanguage: "English"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### FAQ Schema

```javascript
function FAQSchema({ faqs }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

## 2.5 URL Structure & Routing

### SEO-Friendly URL Best Practices

```javascript
// ✅ Good URLs
/products/mens-cotton-t-shirt-navy-blue
/category/womens-skincare
/blog/how-to-choose-protein-powder

// ❌ Bad URLs
/product?id=12345
/cat?c=456&sort=price
/p/xYz123AbC

// URL Rules:
// - Use lowercase letters
// - Use hyphens, not underscores
// - Include keywords
// - Keep them short but descriptive
// - Avoid query parameters when possible
// - Use consistent structure
```

### Dynamic Route SEO (Next.js example)

```javascript
// pages/products/[slug].js
export async function getStaticProps({ params }) {
  const product = await getProductBySlug(params.slug);
  
  return {
    props: {
      product,
    },
    revalidate: 3600, // ISR: revalidate every hour
  };
}

export async function getStaticPaths() {
  const products = await getAllProducts();
  
  return {
    paths: products.map(product => ({
      params: { slug: product.slug }
    })),
    fallback: 'blocking', // Generate new pages on-demand
  };
}

export default function ProductPage({ product }) {
  return (
    <>
      <Head>
        <title>{product.name} | THG</title>
        <meta name="description" content={product.description} />
        <link rel="canonical" href={`https://www.thg.com/products/${product.slug}`} />
      </Head>
      <ProductSchema product={product} />
      {/* Page content */}
    </>
  );
}
```

---

## 2.6 JavaScript & SEO (Critical for SPAs)

### The Problem with Client-Side Rendering

```javascript
// ❌ Problem: Google sees empty HTML
<div id="root"></div>
<script src="app.js"></script>

// Googlebot gets:
// <div id="root"></div>
// (Googlebot CAN run JavaScript, but it's slower and less reliable)
```

### Solutions for JavaScript SEO

#### 1. Server-Side Rendering (SSR)

```javascript
// Next.js SSR
export async function getServerSideProps() {
  const products = await fetchProducts();
  return { props: { products } };
}

// Benefits:
// - Full HTML sent to crawlers
// - Better initial load performance
// - Works without JavaScript
```

#### 2. Static Site Generation (SSG)

```javascript
// Next.js SSG - Best for content that doesn't change often
export async function getStaticProps() {
  const products = await fetchProducts();
  return {
    props: { products },
    revalidate: 3600 // ISR - regenerate hourly
  };
}
```

#### 3. Hybrid Approach

```javascript
// Critical content: SSR/SSG
// Interactive elements: Client-side hydration

function ProductPage({ product }) {
  // Server-rendered for SEO
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <ProductPrice price={product.price} />
      
      {/* Client-side only - not critical for SEO */}
      <Suspense fallback={<div>Loading reviews...</div>}>
        <ClientOnlyReviews productId={product.id} />
      </Suspense>
    </div>
  );
}
```

### Check If Content Is Indexed

```javascript
// Test how Google sees your page
// 1. Google Search Console > URL Inspection
// 2. View rendered HTML
// 3. Check for crawl errors

// Also test with JavaScript disabled
// Chrome DevTools > Settings > Debugger > Disable JavaScript
```

---

## 2.7 Core Web Vitals for SEO

### Google's Page Experience Signals

| Metric | Target | SEO Impact |
|--------|--------|------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | High |
| **FID** (First Input Delay) / **INP** | < 100ms | High |
| **CLS** (Cumulative Layout Shift) | < 0.1 | High |
| HTTPS | Required | Ranking factor |
| Mobile-friendly | Required | Ranking factor |
| No intrusive interstitials | Required | Can hurt rankings |

### LCP Optimization for E-commerce

```javascript
// Product images are often LCP element
function ProductImage({ src, alt, priority }) {
  return (
    <img
      src={src}
      alt={alt}
      // Preload critical images
      fetchpriority={priority ? "high" : "auto"}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      // Prevent CLS with explicit dimensions
      width={600}
      height={600}
    />
  );
}

// In <head>
<link
  rel="preload"
  as="image"
  href="/hero-image.webp"
  fetchpriority="high"
/>
```

### CLS Prevention

```javascript
// ❌ Causes CLS - image loads and pushes content down
<img src="/product.jpg" alt="Product" />

// ✅ No CLS - space reserved
<img
  src="/product.jpg"
  alt="Product"
  width="400"
  height="400"
  style={{ aspectRatio: '1/1' }}
/>

// ❌ Causes CLS - ad loads late
<div className="ad-container">
  {/* Ad loads here */}
</div>

// ✅ Reserve space for ads
<div className="ad-container" style={{ minHeight: '250px' }}>
  {/* Ad loads here */}
</div>

// Use CSS aspect-ratio for responsive images
.product-image-container {
  aspect-ratio: 4/3;
  width: 100%;
}
```

---

## 2.8 Sitemaps & Robots.txt

### XML Sitemap Generation

```javascript
// pages/sitemap.xml.js (Next.js)
function generateSiteMap(products, categories) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Static pages -->
      <url>
        <loc>https://www.thg.com</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      
      <!-- Category pages -->
      ${categories.map(cat => `
        <url>
          <loc>https://www.thg.com/category/${cat.slug}</loc>
          <lastmod>${cat.updatedAt}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
      
      <!-- Product pages -->
      ${products.map(product => `
        <url>
          <loc>https://www.thg.com/products/${product.slug}</loc>
          <lastmod>${product.updatedAt}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.6</priority>
        </url>
      `).join('')}
    </urlset>
  `;
}

export async function getServerSideProps({ res }) {
  const products = await getProducts();
  const categories = await getCategories();
  
  const sitemap = generateSiteMap(products, categories);
  
  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();
  
  return { props: {} };
}
```

### Robots.txt

```
# public/robots.txt
User-agent: *
Allow: /

# Block internal/admin pages
Disallow: /admin/
Disallow: /api/
Disallow: /checkout/
Disallow: /account/

# Block search result pages (can create duplicate content)
Disallow: /search?

# Block faceted navigation duplicates
Disallow: /*?sort=
Disallow: /*?filter=

# Sitemap location
Sitemap: https://www.thg.com/sitemap.xml
```

---

## 2.9 Internal Linking & Navigation

### SEO-Friendly Navigation

```javascript
function MainNavigation({ categories }) {
  return (
    <nav aria-label="Main navigation">
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            {/* Use actual anchor tags, not onClick handlers */}
            <a href={`/category/${category.slug}`}>
              {category.name}
            </a>
            
            {category.subcategories && (
              <ul>
                {category.subcategories.map(sub => (
                  <li key={sub.id}>
                    <a href={`/category/${sub.slug}`}>
                      {sub.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

### Internal Link Best Practices

```javascript
// ✅ Good: Descriptive anchor text
<a href="/category/protein-powders">Shop Protein Powders</a>

// ❌ Bad: Generic anchor text
<a href="/category/protein-powders">Click here</a>

// ✅ Good: Related product links
function RelatedProducts({ products }) {
  return (
    <section aria-labelledby="related-products">
      <h2 id="related-products">You Might Also Like</h2>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <a href={`/products/${product.slug}`}>
              <img src={product.image} alt="" />
              <span>{product.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

---

## 2.10 Handling Duplicate Content

### Canonical URLs

```javascript
// Same product, different URLs
// /products/protein-powder
// /products/protein-powder?color=chocolate
// /sale/protein-powder

// All should point to canonical
<link rel="canonical" href="https://www.thg.com/products/protein-powder" />

// Component implementation
function CanonicalUrl({ path }) {
  const baseUrl = 'https://www.thg.com';
  // Remove query parameters for canonical
  const canonicalPath = path.split('?')[0];
  
  return (
    <link rel="canonical" href={`${baseUrl}${canonicalPath}`} />
  );
}
```

### Pagination SEO

```javascript
function PaginatedList({ currentPage, totalPages, baseUrl }) {
  return (
    <>
      <Head>
        {/* Canonical to first page for SEO */}
        {currentPage === 1 ? (
          <link rel="canonical" href={baseUrl} />
        ) : (
          <link rel="canonical" href={`${baseUrl}?page=${currentPage}`} />
        )}
        
        {/* Prev/Next for pagination */}
        {currentPage > 1 && (
          <link rel="prev" href={`${baseUrl}?page=${currentPage - 1}`} />
        )}
        {currentPage < totalPages && (
          <link rel="next" href={`${baseUrl}?page=${currentPage + 1}`} />
        )}
      </Head>
      
      {/* Pagination UI */}
      <nav aria-label="Pagination">
        {currentPage > 1 && (
          <a href={`${baseUrl}?page=${currentPage - 1}`}>Previous</a>
        )}
        
        <span>Page {currentPage} of {totalPages}</span>
        
        {currentPage < totalPages && (
          <a href={`${baseUrl}?page=${currentPage + 1}`}>Next</a>
        )}
      </nav>
    </>
  );
}
```

---

## 2.11 Mobile SEO

### Mobile-First Indexing

Google primarily uses mobile version for indexing. Ensure:

```javascript
// 1. Responsive viewport
<meta name="viewport" content="width=device-width, initial-scale=1" />

// 2. Same content on mobile and desktop
// Don't hide important content on mobile

// 3. Touch-friendly tap targets
.button {
  min-height: 48px;
  min-width: 48px;
  padding: 12px 24px;
}

// 4. Readable font sizes
body {
  font-size: 16px; /* Minimum for mobile */
  line-height: 1.5;
}

// 5. No horizontal scrolling
.container {
  max-width: 100%;
  overflow-x: hidden;
}
```

---

## 2.12 SEO Interview Questions

### Q1: "How would you improve SEO for a React SPA?"

**Answer:**
> "For a React SPA, the main SEO challenge is JavaScript rendering. I would:
> 1. **Implement SSR or SSG** using Next.js or similar framework
> 2. **Pre-render critical pages** that need to rank well
> 3. **Add proper meta tags** in the document head using react-helmet or Next.js Head
> 4. **Implement structured data** for rich snippets
> 5. **Ensure crawlable links** - use actual `<a>` tags, not onClick handlers
> 6. **Generate XML sitemap** dynamically
> 7. **Optimize Core Web Vitals** - especially LCP and CLS
> 8. **Handle dynamic routes** with proper canonical URLs"

### Q2: "What's the relationship between accessibility and SEO?"

**Answer:**
> "Accessibility and SEO have significant overlap:
> - **Semantic HTML** helps both screen readers AND search engines understand content
> - **Heading hierarchy** (h1-h6) provides structure for both
> - **Alt text** is read by screen readers AND indexed by Google Images
> - **Page speed** (Core Web Vitals) affects both user experience AND rankings
> - **Mobile-friendliness** is required for both accessibility AND mobile-first indexing
> - **Clear navigation** helps users AND crawlers find content
> 
> Essentially, building an accessible website naturally improves SEO because both prioritize clear, well-structured, fast-loading content."

### Q3: "How do you handle SEO for dynamically loaded content?"

**Answer:**
```javascript
// Problem: Content loaded after user interaction isn't indexed

// Solution 1: Server-render critical content
export async function getServerSideProps() {
  const products = await fetchProducts();
  return { props: { products } };
}

// Solution 2: Hybrid approach
function ProductList({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts);
  
  // Initial products are server-rendered (SEO)
  // "Load more" adds client-side (not indexed, but okay)
  const loadMore = async () => {
    const more = await fetchMoreProducts();
    setProducts([...products, ...more]);
  };
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      <button onClick={loadMore}>Load More</button>
    </div>
  );
}

// Solution 3: Pagination with proper URLs
// /products?page=1, /products?page=2
// Each page is crawlable
```

### Q4: "What structured data would you implement for an e-commerce site?"

**Answer:**
> "For an e-commerce site like THG, I would implement:
> 1. **Product schema** - Name, price, availability, reviews, images
> 2. **BreadcrumbList** - For category navigation in search results
> 3. **Organization** - Company info, logo, social profiles
> 4. **WebSite with SearchAction** - Enable sitelinks search box
> 5. **FAQPage** - For product FAQ sections
> 6. **Review/AggregateRating** - Show stars in search results
> 7. **Offer** - Price, currency, availability
>
> These enable rich snippets that can significantly increase click-through rates."

---

# PART 3: QUICK REFERENCE CHECKLISTS

## Accessibility Checklist

- [ ] Use semantic HTML elements
- [ ] All images have descriptive alt text
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Forms have proper labels and error messages
- [ ] Page has skip links
- [ ] Modals trap focus and manage focus correctly
- [ ] Dynamic content announced via ARIA live regions
- [ ] Page works with screen reader
- [ ] Page works at 200% zoom
- [ ] No content relies solely on color
- [ ] Videos have captions
- [ ] Page title is descriptive

## SEO Checklist

- [ ] Unique, descriptive title tags (50-60 chars)
- [ ] Meta descriptions for all pages (150-160 chars)
- [ ] Proper heading hierarchy (one H1, logical H2-H6)
- [ ] Canonical URLs set
- [ ] XML sitemap generated and submitted
- [ ] Robots.txt configured
- [ ] Structured data implemented
- [ ] Open Graph tags for social sharing
- [ ] Core Web Vitals passing
- [ ] Mobile-friendly design
- [ ] HTTPS enabled
- [ ] Clean URL structure
- [ ] Internal linking strategy
- [ ] Critical content server-rendered

---

# COMMON INTERVIEW QUESTIONS SUMMARY

## Accessibility

1. **What are the WCAG levels and which should we target?**
2. **How do you make a custom component accessible?**
3. **What's the difference between aria-label, aria-labelledby, and aria-describedby?**
4. **How do you handle focus management in SPAs?**
5. **What's a skip link and why is it important?**
6. **How do you test for accessibility?**
7. **What is the roving tabindex pattern?**
8. **How do you make forms accessible?**
9. **What's an ARIA live region?**
10. **How do you handle keyboard navigation in custom widgets?**

## SEO

1. **How do you handle SEO in a React/SPA application?**
2. **What's the difference between SSR and SSG?**
3. **What are Core Web Vitals and how do they affect SEO?**
4. **What structured data would you implement for e-commerce?**
5. **How do you handle duplicate content?**
6. **What's a canonical URL?**
7. **How do you optimize images for SEO?**
8. **What's the relationship between accessibility and SEO?**
9. **How do you create an XML sitemap?**
10. **What should be in robots.txt?**

---

Good luck with your THG interview!

Remember:
- Accessibility is about **inclusive design** - 15% of users have disabilities
- SEO is about **discoverability** - making content findable and understandable
- Both overlap significantly in their technical implementation
- Always be ready to explain the **WHY** behind each technique
