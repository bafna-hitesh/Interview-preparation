# Drawing Canvas - Practice & Interview Q&A

## Challenge 1: Shape Tools
**Time:** 25 min

Add rectangle and circle drawing tools.

```javascript
// Rectangle
ctx.strokeRect(x, y, width, height);

// Circle
ctx.beginPath();
ctx.arc(x, y, radius, 0, Math.PI * 2);
ctx.stroke();
```

---

## Challenge 2: Pressure Sensitivity
**Time:** 20 min

Use pointer events for pressure-sensitive line width.

```javascript
canvas.addEventListener('pointermove', (e) => {
  ctx.lineWidth = e.pressure * 20;
});
```

---

## Challenge 3: Collaborative Drawing
**Time:** 40 min

Add WebSocket support for real-time multi-user drawing.

---

## Interview Q&A

### Beginner

**Q: Why do we need `beginPath()` before each stroke?**
> Without it, ctx remembers previous path and stroke() draws everything again. Each independent stroke needs a fresh path.

**Q: How do you handle canvas resize?**
> Save current image with `toDataURL()`, resize canvas dimensions, restore image. CSS resize doesn't work - canvas needs explicit width/height.

---

### Intermediate

**Q: How would you implement an eraser?**
> Two approaches:
> 1. Draw with background color (white)
> 2. Use `globalCompositeOperation = 'destination-out'`

**Q: How do you implement undo?**
> Store canvas state (toDataURL) after each stroke in an array. Undo restores previous state. For memory efficiency, could store only the stroke commands instead.

---

### Senior

**Q: How would you optimize for many undo steps?**
> Instead of storing full canvas images:
> 1. Store draw commands (Command pattern)
> 2. Replay commands to recreate state
> 3. Keep checkpoints every N commands

**Q: How would you handle high-DPI displays?**
```javascript
const dpr = window.devicePixelRatio || 1;
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;
canvas.style.width = rect.width + 'px';
canvas.style.height = rect.height + 'px';
ctx.scale(dpr, dpr);
```

---

## Self-Assessment

- [ ] Draw smooth lines with mouse/touch
- [ ] Get correct coordinates with getBoundingClientRect
- [ ] Support both mouse and touch events
- [ ] Implement undo/redo with state history
- [ ] Download canvas as image
- [ ] Handle canvas resize properly
