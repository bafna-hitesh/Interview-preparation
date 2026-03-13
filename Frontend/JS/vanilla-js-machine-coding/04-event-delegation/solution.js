/**
 * Event Delegation Demo - Senior Developer Solution
 * 
 * This is a THEORY-FOCUSED project for understanding event flow.
 * Asked in almost every JS interview!
 */

const EventDemo = (function() {
  'use strict';

  // ============ VISUAL DEMO OF EVENT FLOW ============
  function createBubblingDemo() {
    const container = document.querySelector('.bubbling-demo');
    const log = document.querySelector('.event-log');
    
    function logEvent(phase, element) {
      const phaseNames = { 1: 'CAPTURE', 2: 'TARGET', 3: 'BUBBLE' };
      const div = document.createElement('div');
      div.className = `log-entry phase-${phase}`;
      div.textContent = `${phaseNames[phase]}: ${element.className || element.tagName}`;
      log.appendChild(div);
      log.scrollTop = log.scrollHeight;
    }

    function clearLog() {
      log.innerHTML = '';
    }

    container.querySelectorAll('*').forEach(el => {
      el.addEventListener('click', (e) => {
        logEvent(e.eventPhase, e.currentTarget);
      }, { capture: true });

      el.addEventListener('click', (e) => {
        logEvent(e.eventPhase, e.currentTarget);
      }, { capture: false });
    });

    document.querySelector('.clear-log')?.addEventListener('click', clearLog);
  }

  // ============ EVENT DELEGATION PATTERN ============
  function createDelegationDemo() {
    const list = document.querySelector('.delegation-list');
    const addBtn = document.querySelector('.add-item');
    let counter = list?.children.length || 0;

    if (!list) return;

    list.addEventListener('click', (e) => {
      const item = e.target.closest('.list-item');
      if (!item) return;
      
      if (e.target.classList.contains('delete-btn')) {
        item.remove();
        showMessage('Deleted item');
      } else {
        item.classList.toggle('selected');
        showMessage(`${item.classList.contains('selected') ? 'Selected' : 'Deselected'}`);
      }
    });

    addBtn?.addEventListener('click', () => {
      counter++;
      const item = document.createElement('li');
      item.className = 'list-item';
      item.innerHTML = `
        <span>Item ${counter}</span>
        <button class="delete-btn">×</button>
      `;
      list.appendChild(item);
      showMessage('Added new item - no new listeners needed!');
    });

    function showMessage(text) {
      const msg = document.querySelector('.delegation-message');
      if (msg) {
        msg.textContent = text;
        msg.classList.add('show');
        setTimeout(() => msg.classList.remove('show'), 2000);
      }
    }
  }

  // ============ STOP PROPAGATION DEMO ============
  function createStopPropagationDemo() {
    const outer = document.querySelector('.stop-outer');
    const inner = document.querySelector('.stop-inner');
    const checkbox = document.querySelector('.stop-propagation-toggle');
    const log = document.querySelector('.stop-log');

    if (!outer || !inner) return;

    function logClick(name) {
      const div = document.createElement('div');
      div.textContent = `Clicked: ${name}`;
      log.appendChild(div);
    }

    outer.addEventListener('click', () => logClick('Outer'));
    
    inner.addEventListener('click', (e) => {
      if (checkbox?.checked) {
        e.stopPropagation();
        logClick('Inner (stopped)');
      } else {
        logClick('Inner');
      }
    });

    document.querySelector('.clear-stop-log')?.addEventListener('click', () => {
      log.innerHTML = '';
    });
  }

  // ============ ONCE OPTION DEMO ============
  function createOnceDemo() {
    const btn = document.querySelector('.once-btn');
    const counter = document.querySelector('.once-counter');
    let count = 0;

    if (!btn) return;

    btn.addEventListener('click', () => {
      count++;
      counter.textContent = `Clicked ${count} time (only fires once)`;
      btn.disabled = true;
    }, { once: true });

    document.querySelector('.reset-once')?.addEventListener('click', () => {
      count = 0;
      counter.textContent = 'Click the button';
      btn.disabled = false;
      btn.addEventListener('click', () => {
        count++;
        counter.textContent = `Clicked ${count} time (only fires once)`;
        btn.disabled = true;
      }, { once: true });
    });
  }

  // ============ INIT ============
  function init() {
    createBubblingDemo();
    createDelegationDemo();
    createStopPropagationDemo();
    createOnceDemo();
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => EventDemo.init());
