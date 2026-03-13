# Custom Video Player - Key Learnings

---

## Video Element API

```javascript
// Properties
video.currentTime   // Current position in seconds
video.duration      // Total length
video.paused        // Boolean
video.volume        // 0 to 1
video.muted         // Boolean
video.playbackRate  // 1 = normal, 2 = 2x speed

// Methods
video.play()        // Returns Promise
video.pause()
video.load()        // Reload source

// Events
'play', 'pause', 'ended'
'timeupdate'        // Fires during playback
'loadedmetadata'    // Duration available
'volumechange'
'waiting', 'canplay' // Buffering states
```

---

## Progress Bar Scrubbing

```javascript
function seek(e) {
  const rect = progressBar.getBoundingClientRect();
  const percent = (e.clientX - rect.left) / rect.width;
  const clampedPercent = Math.max(0, Math.min(1, percent));
  video.currentTime = clampedPercent * video.duration;
}

// Handle drag
let isScrubbing = false;
progress.addEventListener('mousedown', (e) => {
  isScrubbing = true;
  seek(e);
});
document.addEventListener('mousemove', (e) => isScrubbing && seek(e));
document.addEventListener('mouseup', () => isScrubbing = false);
```

**Interview Point:** "Attach mousemove/mouseup to document, not the progress bar. Otherwise scrubbing stops when mouse leaves the bar."

---

## Time Formatting

```javascript
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}
```

---

## Fullscreen API

```javascript
// Enter fullscreen
container.requestFullscreen();  // Standard
container.webkitRequestFullscreen(); // Safari

// Exit
document.exitFullscreen();

// Check state
document.fullscreenElement  // Currently fullscreen element or null

// Listen for changes
document.addEventListener('fullscreenchange', () => {
  const isFullscreen = !!document.fullscreenElement;
});
```

---

## Picture-in-Picture

```javascript
// Enter PiP
await video.requestPictureInPicture();

// Exit
await document.exitPictureInPicture();

// Check support
if ('pictureInPictureEnabled' in document) {
  // PiP is supported
}
```

---

## Common Interview Questions

**Q: How do you handle video buffering?**
> Listen for `waiting` (buffering started) and `canplay` (can resume). Show loading spinner during buffering.

**Q: How do you implement video seeking?**
> Calculate click position relative to progress bar width, convert to percentage, multiply by duration.

**Q: Why attach mousemove to document instead of progress bar?**
> Users drag outside the bar while scrubbing. Document-level listener ensures smooth scrubbing.
