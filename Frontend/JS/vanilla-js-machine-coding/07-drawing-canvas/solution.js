/**
 * Drawing Canvas - Senior Developer Solution
 * 
 * Demonstrates: Canvas API, Mouse/Touch Events, State Management,
 * Undo/Redo (Command Pattern), Color Picker, Line Width
 */

const DrawingApp = (function() {
  'use strict';

  function create(canvasSelector) {
    const canvas = document.querySelector(canvasSelector);
    const ctx = canvas.getContext('2d');
    
    const state = {
      isDrawing: false,
      lastX: 0,
      lastY: 0,
      color: '#000000',
      lineWidth: 5,
      tool: 'brush',
      history: [],
      historyIndex: -1
    };

    // ============ SETUP ============
    function resizeCanvas() {
      const rect = canvas.parentElement.getBoundingClientRect();
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      ctx.putImageData(imageData, 0, 0);
      setupContext();
    }

    function setupContext() {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = state.lineWidth;
      ctx.strokeStyle = state.color;
    }

    // ============ DRAWING ============
    function getCoordinates(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function startDrawing(e) {
      e.preventDefault();
      state.isDrawing = true;
      const { x, y } = getCoordinates(e);
      state.lastX = x;
      state.lastY = y;
    }

    function draw(e) {
      if (!state.isDrawing) return;
      e.preventDefault();
      
      const { x, y } = getCoordinates(e);
      
      ctx.beginPath();
      ctx.moveTo(state.lastX, state.lastY);
      ctx.lineTo(x, y);
      
      if (state.tool === 'eraser') {
        ctx.strokeStyle = '#ffffff';
      } else {
        ctx.strokeStyle = state.color;
      }
      
      ctx.lineWidth = state.lineWidth;
      ctx.stroke();
      
      state.lastX = x;
      state.lastY = y;
    }

    function stopDrawing() {
      if (state.isDrawing) {
        state.isDrawing = false;
        saveState();
      }
    }

    // ============ HISTORY (Undo/Redo) ============
    function saveState() {
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push(canvas.toDataURL());
      state.historyIndex++;
      
      if (state.history.length > 50) {
        state.history.shift();
        state.historyIndex--;
      }
    }

    function undo() {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        restoreState(state.history[state.historyIndex]);
      } else if (state.historyIndex === 0) {
        state.historyIndex = -1;
        clearCanvas();
      }
    }

    function redo() {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        restoreState(state.history[state.historyIndex]);
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

    // ============ TOOLS ============
    function setColor(color) {
      state.color = color;
      ctx.strokeStyle = color;
    }

    function setLineWidth(width) {
      state.lineWidth = width;
      ctx.lineWidth = width;
    }

    function setTool(tool) {
      state.tool = tool;
    }

    function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      saveState();
    }

    function download() {
      const link = document.createElement('a');
      link.download = 'drawing.png';
      link.href = canvas.toDataURL();
      link.click();
    }

    // ============ EVENT LISTENERS ============
    function init() {
      resizeCanvas();
      setupContext();
      saveState();

      canvas.addEventListener('mousedown', startDrawing);
      canvas.addEventListener('mousemove', draw);
      canvas.addEventListener('mouseup', stopDrawing);
      canvas.addEventListener('mouseout', stopDrawing);

      canvas.addEventListener('touchstart', startDrawing, { passive: false });
      canvas.addEventListener('touchmove', draw, { passive: false });
      canvas.addEventListener('touchend', stopDrawing);

      window.addEventListener('resize', resizeCanvas);

      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
          e.preventDefault();
          if (e.shiftKey) redo();
          else undo();
        }
      });
    }

    init();

    return {
      setColor,
      setLineWidth,
      setTool,
      clear: clearCanvas,
      undo,
      redo,
      download
    };
  }

  return { create };
})();

// ============ USAGE ============
document.addEventListener('DOMContentLoaded', () => {
  const app = DrawingApp.create('#canvas');

  document.querySelector('#color')?.addEventListener('input', (e) => {
    app.setColor(e.target.value);
  });

  document.querySelector('#lineWidth')?.addEventListener('input', (e) => {
    app.setLineWidth(e.target.value);
    document.querySelector('#lineWidthValue').textContent = e.target.value;
  });

  document.querySelectorAll('[data-tool]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-tool]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      app.setTool(btn.dataset.tool);
    });
  });

  document.querySelector('#clear')?.addEventListener('click', app.clear);
  document.querySelector('#undo')?.addEventListener('click', app.undo);
  document.querySelector('#redo')?.addEventListener('click', app.redo);
  document.querySelector('#download')?.addEventListener('click', app.download);
});
