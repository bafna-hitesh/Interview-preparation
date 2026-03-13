/**
 * Custom Video Player - Senior Developer Solution
 * 
 * Demonstrates: Video API, Custom Controls, Progress Bar,
 * Keyboard Shortcuts, Fullscreen, Picture-in-Picture
 */

const VideoPlayer = (function() {
  'use strict';

  function create(containerSelector) {
    const container = document.querySelector(containerSelector);
    const video = container.querySelector('video');
    const controls = container.querySelector('.controls');
    
    const elements = {
      playBtn: container.querySelector('.play-btn'),
      progress: container.querySelector('.progress'),
      progressFilled: container.querySelector('.progress-filled'),
      currentTime: container.querySelector('.current-time'),
      duration: container.querySelector('.duration'),
      volume: container.querySelector('.volume'),
      volumeBtn: container.querySelector('.volume-btn'),
      speed: container.querySelector('.speed'),
      fullscreenBtn: container.querySelector('.fullscreen-btn'),
      pipBtn: container.querySelector('.pip-btn')
    };

    let state = {
      isScrubbing: false,
      wasPlaying: false
    };

    // ============ PLAY/PAUSE ============
    function togglePlay() {
      video.paused ? video.play() : video.pause();
    }

    function updatePlayButton() {
      elements.playBtn.textContent = video.paused ? '▶' : '❚❚';
      elements.playBtn.setAttribute('aria-label', video.paused ? 'Play' : 'Pause');
    }

    // ============ PROGRESS BAR ============
    function updateProgress() {
      const percent = (video.currentTime / video.duration) * 100;
      elements.progressFilled.style.width = `${percent}%`;
      elements.currentTime.textContent = formatTime(video.currentTime);
    }

    function seek(e) {
      const rect = elements.progress.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      video.currentTime = percent * video.duration;
    }

    function startScrub(e) {
      state.isScrubbing = true;
      state.wasPlaying = !video.paused;
      video.pause();
      seek(e);
    }

    function scrub(e) {
      if (!state.isScrubbing) return;
      seek(e);
    }

    function stopScrub() {
      if (!state.isScrubbing) return;
      state.isScrubbing = false;
      if (state.wasPlaying) video.play();
    }

    // ============ TIME FORMATTING ============
    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function updateDuration() {
      elements.duration.textContent = formatTime(video.duration);
    }

    // ============ VOLUME ============
    function updateVolume() {
      video.volume = elements.volume.value;
      video.muted = video.volume === 0;
      updateVolumeIcon();
    }

    function toggleMute() {
      video.muted = !video.muted;
      elements.volume.value = video.muted ? 0 : video.volume || 1;
      updateVolumeIcon();
    }

    function updateVolumeIcon() {
      let icon = '🔊';
      if (video.muted || video.volume === 0) icon = '🔇';
      else if (video.volume < 0.5) icon = '🔉';
      elements.volumeBtn.textContent = icon;
    }

    // ============ PLAYBACK SPEED ============
    function updateSpeed() {
      video.playbackRate = parseFloat(elements.speed.value);
    }

    // ============ FULLSCREEN ============
    function toggleFullscreen() {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        container.requestFullscreen();
      }
    }

    function updateFullscreenButton() {
      elements.fullscreenBtn.textContent = document.fullscreenElement ? '⊙' : '⛶';
    }

    // ============ PICTURE-IN-PICTURE ============
    async function togglePiP() {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await video.requestPictureInPicture();
        }
      } catch (err) {
        console.error('PiP failed:', err);
      }
    }

    // ============ KEYBOARD SHORTCUTS ============
    function handleKeydown(e) {
      if (e.target.tagName === 'INPUT') return;
      
      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          video.currentTime -= 5;
          break;
        case 'ArrowRight':
          video.currentTime += 5;
          break;
        case 'ArrowUp':
          e.preventDefault();
          video.volume = Math.min(1, video.volume + 0.1);
          elements.volume.value = video.volume;
          break;
        case 'ArrowDown':
          e.preventDefault();
          video.volume = Math.max(0, video.volume - 0.1);
          elements.volume.value = video.volume;
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
      }
    }

    // ============ AUTO-HIDE CONTROLS ============
    let hideTimeout;
    
    function showControls() {
      controls.classList.remove('hidden');
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => {
        if (!video.paused) {
          controls.classList.add('hidden');
        }
      }, 3000);
    }

    // ============ INIT ============
    function init() {
      video.addEventListener('click', togglePlay);
      video.addEventListener('play', updatePlayButton);
      video.addEventListener('pause', updatePlayButton);
      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('loadedmetadata', updateDuration);
      video.addEventListener('volumechange', updateVolumeIcon);

      elements.playBtn?.addEventListener('click', togglePlay);
      
      elements.progress?.addEventListener('mousedown', startScrub);
      document.addEventListener('mousemove', scrub);
      document.addEventListener('mouseup', stopScrub);

      elements.volume?.addEventListener('input', updateVolume);
      elements.volumeBtn?.addEventListener('click', toggleMute);
      elements.speed?.addEventListener('change', updateSpeed);
      elements.fullscreenBtn?.addEventListener('click', toggleFullscreen);
      elements.pipBtn?.addEventListener('click', togglePiP);

      document.addEventListener('fullscreenchange', updateFullscreenButton);
      document.addEventListener('keydown', handleKeydown);

      container.addEventListener('mousemove', showControls);
      container.addEventListener('mouseleave', () => {
        if (!video.paused) controls.classList.add('hidden');
      });
    }

    init();

    return {
      play: () => video.play(),
      pause: () => video.pause(),
      seek: (time) => { video.currentTime = time; },
      setVolume: (vol) => { video.volume = vol; },
      setSpeed: (rate) => { video.playbackRate = rate; }
    };
  }

  return { create };
})();

document.addEventListener('DOMContentLoaded', () => {
  VideoPlayer.create('.player');
});
