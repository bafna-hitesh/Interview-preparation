# Drawing Canvas - Key Learnings

---

## Canvas Basics

```javascript
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// Set dimensions (not CSS!)
canvas.width = 800;
canvas.height = 600;

// Drawing context settings
ctx.strokeStyle = '#000000';
ctx.lineWidth = 5;
ctx.lineCap = 'round';    // 'butt', 'round', 'square'
ctx.lineJoin = 'round';   // 'miter', 'round', 'bevel'
```

---

## Drawing Lines

```javascript
function draw(fromX, fromY, toX, toY) {
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
}
```

**Interview Point:** "Each stroke needs beginPath(), otherwise all lines connect."

---

## Getting Mouse Coordinates

```javascript
function getCoordinates(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
}
```

**Interview Point:** "clientX/Y is relative to viewport. Subtract canvas position to get canvas-relative coordinates."

---

## Touch Support

```javascript
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();  // Prevent scrolling
  const touch = e.touches[0];
  // Use touch.clientX, touch.clientY
}, { passive: false });
```

---

## Undo/Redo with Canvas Snapshots

```javascript
const history = [];
let historyIndex = -1;

function saveState() {
  history.splice(historyIndex + 1);  // Remove future states
  history.push(canvas.toDataURL());
  historyIndex++;
}

function undo() {
  if (historyIndex > 0) {
    historyIndex--;
    restoreState(history[historyIndex]);
  }
}

function restoreState(dataUrl) {
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
  img.src = dataUrl;
}
```

---

## Download Canvas as Image

```javascript
function download() {
  const link = document.createElement('a');
  link.download = 'drawing.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
```

---

## Key Properties

| Property | Purpose |
|----------|---------|
| `strokeStyle` | Line color |
| `fillStyle` | Fill color |
| `lineWidth` | Line thickness |
| `lineCap` | Line end style |
| `lineJoin` | Corner style |
| `globalAlpha` | Transparency |
| `globalCompositeOperation` | Blend mode |
