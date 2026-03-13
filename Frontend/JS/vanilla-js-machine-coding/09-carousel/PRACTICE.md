# Carousel - Practice & Interview Q&A

## Challenge 1: Multiple Slides Visible
**Time:** 20 min

Show 3 slides at once, scroll one at a time.

---

## Challenge 2: Lazy Loading Images
**Time:** 15 min

Only load images when slide is about to be shown.

---

## Challenge 3: Vertical Carousel
**Time:** 20 min

Make it scroll vertically instead of horizontally.

---

## Interview Q&A

### Beginner

**Q: Why use transform instead of changing left/margin?**
> transform is GPU-accelerated, doesn't trigger layout/reflow. margin/left cause expensive repaints.

**Q: How do you handle window resize?**
> Recalculate slide width and reposition to current slide without animation.

---

### Intermediate

**Q: How do you implement infinite scroll?**
> Modulo math: `index = ((index % total) + total) % total`. This wraps -1 to last and length to 0.

**Q: How would you add swipe momentum?**
> Track velocity (distance/time) during drag. On release, continue animation based on velocity with deceleration.

---

### Senior

**Q: How would you make this accessible?**
> - Container: `role="region"`, `aria-label`
> - Live region to announce current slide
> - Keyboard navigation (arrow keys)
> - Pause autoplay for screen reader users
> - Reduced motion preference check

**Q: How would you virtualize for 1000 slides?**
> Only render current + prev + next slides. Update DOM on slide change rather than rendering all.

---

## Self-Assessment

- [ ] Slide using CSS transform
- [ ] Support drag/swipe on desktop and mobile
- [ ] Implement prev/next/dots navigation
- [ ] Add infinite loop option
- [ ] Auto-play with pause on hover
- [ ] Handle window resize
- [ ] Keyboard navigation
