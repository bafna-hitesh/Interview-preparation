# Video Player - Practice & Interview Q&A

## Challenge 1: Thumbnail Preview
**Time:** 30 min

Show video thumbnail on progress bar hover.

```javascript
// Generate thumbnails at different timestamps
// Show on mouseover progress bar
```

---

## Challenge 2: Quality Selector
**Time:** 20 min

Add quality selection (720p, 1080p) without losing playback position.

---

## Challenge 3: Captions/Subtitles
**Time:** 25 min

Add support for VTT subtitle tracks with toggle.

```html
<track kind="subtitles" src="captions.vtt" srclang="en" label="English">
```

---

## Interview Q&A

### Beginner

**Q: What event fires when video can start playing?**
> `canplay` fires when enough data loaded to start. `canplaythrough` fires when enough data to play to end without buffering.

**Q: How do you get video duration?**
> Listen for `loadedmetadata` event, then access `video.duration`.

---

### Intermediate

**Q: How do you save and restore video position?**
```javascript
// Save on pause/close
localStorage.setItem('videoTime', video.currentTime);

// Restore
const saved = localStorage.getItem('videoTime');
if (saved) video.currentTime = parseFloat(saved);
```

**Q: How do you handle autoplay restrictions?**
> Modern browsers block autoplay with sound. Options:
> 1. Autoplay muted: `video.muted = true; video.play()`
> 2. Wait for user interaction
> 3. Use `play()` promise to handle rejection

---

### Senior

**Q: How would you implement adaptive bitrate streaming?**
> Use Media Source Extensions (MSE) with libraries like hls.js or dash.js. They switch quality based on bandwidth.

**Q: How do you handle video analytics?**
> Track: play/pause events, watch time, completion rate, seek patterns, quality changes, buffering events.

---

## Self-Assessment

- [ ] Control video with play/pause, seek, volume
- [ ] Format time as mm:ss or hh:mm:ss
- [ ] Implement progress bar scrubbing
- [ ] Add keyboard shortcuts
- [ ] Handle fullscreen and PiP
- [ ] Auto-hide controls during playback
