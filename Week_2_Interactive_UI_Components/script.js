/**
 * ============================================================================
 * NexusUI — Enterprise Interactive UI Component Architecture
 * Junior Frontend Developer Internship — Week 2 Submission
 * 
 * Features:
 *  - NexusLogger: Live event telemetry & active DOM focus monitor
 *  - NexusModal: Accessible Dialog with focus trapping, ESC close, scroll lock,
 *                and nested dialogue handling
 *  - NexusTabs: W3C APG Tablist with sliding indicator, arrow key navigation,
 *               auto/manual activation, and dynamic tab injection API
 *  - NexusAccordion: CSS Grid collapsible disclosure with live search/highlight,
 *                    multi-expand mode, and full keyboard navigation
 *  - NexusToast: Accessible ARIA live notification manager with progress timers
 *  - AppShowcase: High-level controller wiring theme, motion, and demo actions
 * ============================================================================
 */

'use strict';

/* ============================================================================
   1. TELEMETRY & EVENT LOGGER (NexusLogger)
   ============================================================================ */
class NexusLogger {
  constructor() {
    this.hud = document.getElementById('eventLoggerHud');
    this.feed = document.getElementById('hudEventFeed');
    this.counter = document.getElementById('eventCounter');
    this.metricCount = document.getElementById('metricEventsFired');
    this.activeFocusTarget = document.getElementById('activeFocusTarget');
    this.totalEvents = 0;
    this.maxEntries = 50;

    this._initFocusTracker();
  }

  log(category, message, details = null) {
    this.totalEvents++;
    if (this.counter) this.counter.textContent = this.totalEvents;
    if (this.metricCount) this.metricCount.textContent = this.totalEvents;

    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // Log to console
    console.log(`%c[NexusUI ${category.toUpperCase()}]%c ${message}`, 'color: #6366f1; font-weight: bold;', 'color: inherit;', details || '');

    if (!this.feed) return;

    const entry = document.createElement('div');
    entry.className = `hud-entry ${category.toLowerCase()}`;
    entry.innerHTML = `
      <span class="hud-time">${time}</span>
      <span class="hud-type">[${category}]</span>
      <span class="hud-msg">${this._escapeHTML(message)}</span>
    `;

    this.feed.prepend(entry);

    // Prune old logs to avoid DOM overload
    while (this.feed.children.length > this.maxEntries) {
      this.feed.removeChild(this.feed.lastChild);
    }
  }

  clear() {
    if (!this.feed) return;
    this.feed.innerHTML = `
      <div class="hud-entry system">
        <span class="hud-time">SYSTEM</span>
        <span class="hud-msg">Event logs cleared.</span>
      </div>
    `;
    this.totalEvents = 0;
    if (this.counter) this.counter.textContent = '0';
  }

  _initFocusTracker() {
    document.addEventListener('focusin', (e) => {
      if (!this.activeFocusTarget) return;
      const target = e.target;
      let label = target.tagName;
      if (target.id) {
        label += `#${target.id}`;
      } else if (target.className && typeof target.className === 'string') {
        const firstClass = target.className.trim().split(/\s+/)[0];
        if (firstClass) label += `.${firstClass}`;
      }
      this.activeFocusTarget.textContent = label;
    }, true);
  }

  _escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

// Global logger instance
const logger = new NexusLogger();


/* ============================================================================
   2. ACCESSIBLE MODAL DIALOG COMPONENT (NexusModal)
   ============================================================================ */
class NexusModal {
  // Static registry for active modal stacking
  static activeStack = [];
  static scrollbarWidth = null;

  constructor(elementOrSelector, options = {}) {
    this.modal = typeof elementOrSelector === 'string'
      ? document.querySelector(elementOrSelector)
      : elementOrSelector;

    if (!this.modal) {
      console.warn(`[NexusModal] Initialization aborted: Target modal "${elementOrSelector}" was not found in the DOM.`);
      return;
    }

    this.options = {
      closeOnEsc: true,
      closeOnBackdrop: true,
      trapFocus: true,
      onOpen: null,
      onClose: null,
      ...options
    };

    this.dialog = this.modal.querySelector('.nexus-modal-dialog') || this.modal;
    this.backdrop = this.modal.querySelector('.nexus-modal-backdrop');
    this.closeButtons = this.modal.querySelectorAll('[data-modal-close]');
    
    this.isOpen = false;
    this.previousActiveElement = null;

    // Bound listeners for precise teardown
    this._handleKeydown = this._handleKeydown.bind(this);
    this._handleBackdropClick = this._handleBackdropClick.bind(this);

    this._bindTriggers();
  }

  /**
   * Bind declarative buttons that close the modal
   */
  _bindTriggers() {
    this.closeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.close();
      });
    });

    if (this.backdrop && this.options.closeOnBackdrop) {
      this.backdrop.addEventListener('click', this._handleBackdropClick);
    }
  }

  /**
   * Open Modal dialog with focus trap & scroll lock
   */
  open() {
    if (this.isOpen) return;

    // Check live configuration overrides if present
    const configEsc = document.getElementById('modalConfigEscClose');
    if (configEsc) this.options.closeOnEsc = configEsc.checked;

    const configBackdrop = document.getElementById('modalConfigBackdropClose');
    if (configBackdrop) this.options.closeOnBackdrop = configBackdrop.checked;

    const configTrap = document.getElementById('modalConfigFocusTrap');
    if (configTrap) this.options.trapFocus = configTrap.checked;

    this.previousActiveElement = document.activeElement;

    // Add to stack
    NexusModal.activeStack.push(this);

    // Lock background scroll on the first active modal
    if (NexusModal.activeStack.length === 1) {
      NexusModal._lockScroll();
    }

    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    this.isOpen = true;

    // Add keyboard listener
    document.addEventListener('keydown', this._handleKeydown);

    // Focus the first focusable element inside the modal
    this._focusInitialElement();

    // Trigger lifecycle hooks & events
    if (typeof this.options.onOpen === 'function') {
      this.options.onOpen(this.modal);
    }

    this.modal.dispatchEvent(new CustomEvent('nexus:modal-opened', {
      bubbles: true,
      detail: { modalId: this.modal.id }
    }));

    logger.log('Modal', `Modal opened: #${this.modal.id || 'unnamed'} (Stack size: ${NexusModal.activeStack.length})`);
  }

  /**
   * Close Modal dialog and restore focus
   */
  close() {
    if (!this.isOpen) return;

    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');
    this.isOpen = false;

    // Remove keyboard listener
    document.removeEventListener('keydown', this._handleKeydown);

    // Remove from active stack
    const index = NexusModal.activeStack.indexOf(this);
    if (index > -1) {
      NexusModal.activeStack.splice(index, 1);
    }

    // Unlock background scroll if stack is now empty
    if (NexusModal.activeStack.length === 0) {
      NexusModal._unlockScroll();
    }

    // Restore focus safely
    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      try {
        this.previousActiveElement.focus();
        logger.log('Focus', `Focus restored to: ${this.previousActiveElement.tagName}#${this.previousActiveElement.id || 'trigger'}`);
      } catch (err) {
        console.warn('[NexusModal] Could not restore focus to previous element:', err);
      }
    }

    // Trigger lifecycle hooks & events
    if (typeof this.options.onClose === 'function') {
      this.options.onClose(this.modal);
    }

    this.modal.dispatchEvent(new CustomEvent('nexus:modal-closed', {
      bubbles: true,
      detail: { modalId: this.modal.id }
    }));

    logger.log('Modal', `Modal closed: #${this.modal.id || 'unnamed'}`);
  }

  /**
   * Query all interactive elements for focus trapping
   */
  _getFocusableElements() {
    const focusableSelectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[contenteditable]',
      '[tabindex]:not([tabindex="-1"])'
    ];

    return Array.from(this.modal.querySelectorAll(focusableSelectors.join(',')))
      .filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement);
  }

  _focusInitialElement() {
    // Check for explicit autofocus attribute first
    const autofocusTarget = this.modal.querySelector('[autofocus]');
    if (autofocusTarget) {
      autofocusTarget.focus();
      return;
    }

    const focusables = this._getFocusableElements();
    if (focusables.length > 0) {
      // If the first element is the close button, focus the first content control or close button
      focusables[0].focus();
    } else {
      this.dialog.setAttribute('tabindex', '-1');
      this.dialog.focus();
    }
  }

  _handleKeydown(e) {
    // Only respond to top-most active modal in the stack
    if (NexusModal.activeStack[NexusModal.activeStack.length - 1] !== this) {
      return;
    }

    // ESC key dismissal
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (this.options.closeOnEsc) {
        e.preventDefault();
        logger.log('Key', `[Escape] pressed -> Closing active modal #${this.modal.id}`);
        this.close();
      }
      return;
    }

    // Focus Trapping (Tab / Shift+Tab)
    if (e.key === 'Tab' && this.options.trapFocus) {
      const focusables = this._getFocusableElements();
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];

      if (e.shiftKey) {
        // Shift + Tab: reverse cycle
        if (document.activeElement === firstElement || !this.modal.contains(document.activeElement)) {
          e.preventDefault();
          lastElement.focus();
          logger.log('Focus', `[Shift+Tab Trap] Focus cycled to end: #${lastElement.id || lastElement.tagName}`);
        }
      } else {
        // Tab: forward cycle
        if (document.activeElement === lastElement || !this.modal.contains(document.activeElement)) {
          e.preventDefault();
          firstElement.focus();
          logger.log('Focus', `[Tab Trap] Focus cycled to start: #${firstElement.id || firstElement.tagName}`);
        }
      }
    }
  }

  _handleBackdropClick(e) {
    if (e.target === this.backdrop && this.options.closeOnBackdrop) {
      logger.log('Modal', `Backdrop clicked -> Closing modal #${this.modal.id}`);
      this.close();
    }
  }

  /**
   * Measure scrollbar width to prevent page jitter during scroll lock
   */
  static _getScrollbarWidth() {
    if (NexusModal.scrollbarWidth !== null) return NexusModal.scrollbarWidth;
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    NexusModal.scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return NexusModal.scrollbarWidth;
  }

  static _lockScroll() {
    const scrollbarWidth = NexusModal._getScrollbarWidth();
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = 'hidden';

    // Also adjust sticky header if present
    const header = document.querySelector('.app-header');
    if (header) header.style.paddingRight = `${scrollbarWidth}px`;
  }

  static _unlockScroll() {
    document.body.style.paddingRight = '';
    document.body.style.overflow = '';

    const header = document.querySelector('.app-header');
    if (header) header.style.paddingRight = '';
  }
}


/* ============================================================================
   3. DYNAMIC ACCESSIBLE TAB SYSTEM (NexusTabs)
   ============================================================================ */
class NexusTabs {
  constructor(containerOrSelector, options = {}) {
    this.container = typeof containerOrSelector === 'string'
      ? document.querySelector(containerOrSelector)
      : containerOrSelector;

    if (!this.container) {
      console.warn(`[NexusTabs] Initialization aborted: Tabs container "${containerOrSelector}" not found.`);
      return;
    }

    this.options = {
      defaultTab: 0,
      activation: this.container.dataset.activation || 'auto', // 'auto' | 'manual'
      orientation: this.container.classList.contains('vertical') ? 'vertical' : 'horizontal',
      onChange: null,
      ...options
    };

    this.tabList = this.container.querySelector('[role="tablist"]');
    this.glider = this.container.querySelector('.tab-glider');
    this.tabs = Array.from(this.container.querySelectorAll('[role="tab"]'));
    this.panels = Array.from(this.container.querySelectorAll('[role="tabpanel"]'));

    this.currentIndex = 0;
    this._handleKeydown = this._handleKeydown.bind(this);
    this._updateGliderPosition = this._updateGliderPosition.bind(this);

    this.init();
  }

  init() {
    if (!this.tabList || this.tabs.length === 0) return;

    // Set ARIA orientation
    this.tabList.setAttribute('aria-orientation', this.options.orientation);

    // Event delegation on tablist
    this.tabList.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('[role="tab"]');
      if (!tabBtn) return;
      const index = this.tabs.indexOf(tabBtn);
      if (index !== -1) {
        this.activateTab(index);
      }
    });

    this.tabList.addEventListener('keydown', this._handleKeydown);

    // Determine initial active tab
    const activeIndex = this.tabs.findIndex(tab => tab.classList.contains('active') || tab.getAttribute('aria-selected') === 'true');
    this.currentIndex = activeIndex >= 0 ? activeIndex : this.options.defaultTab;
    this.activateTab(this.currentIndex, false);

    // Responsive Glider calculation with ResizeObserver
    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(() => {
        this._updateGliderPosition();
      });
      this.resizeObserver.observe(this.tabList);
    } else {
      window.addEventListener('resize', this._updateGliderPosition);
    }

    logger.log('Tabs', `Tabs component initialized with ${this.tabs.length} tabs (Mode: ${this.options.activation})`);
  }

  /**
   * Activate specific tab by index
   */
  activateTab(index, shouldFocus = true) {
    if (index < 0 || index >= this.tabs.length) return;

    this.tabs.forEach((tab, i) => {
      const isSelected = i === index;
      const panelId = tab.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);

      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      tab.setAttribute('tabindex', isSelected ? '0' : '-1');

      if (panel) {
        panel.classList.toggle('active', isSelected);
        if (isSelected) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      }
    });

    this.currentIndex = index;
    const activeTab = this.tabs[index];
    const activePanel = document.getElementById(activeTab.getAttribute('aria-controls'));

    if (shouldFocus) {
      activeTab.focus();
    }

    this._updateGliderPosition();

    // Trigger hooks & custom events
    if (typeof this.options.onChange === 'function') {
      this.options.onChange(activeTab, activePanel);
    }

    this.container.dispatchEvent(new CustomEvent('nexus:tab-changed', {
      bubbles: true,
      detail: {
        index,
        tabId: activeTab.id,
        panelId: activePanel ? activePanel.id : null
      }
    }));

    logger.log('Tabs', `Tab activated [Index ${index}]: #${activeTab.id}`);
  }

  /**
   * Smooth physics glide positioning
   */
  _updateGliderPosition() {
    if (!this.glider || this.tabs.length === 0) return;
    const activeTab = this.tabs[this.currentIndex];
    if (!activeTab) return;

    const listRect = this.tabList.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();

    const left = tabRect.left - listRect.left + this.tabList.scrollLeft;
    const top = tabRect.top - listRect.top + this.tabList.scrollTop;
    const width = tabRect.width;
    const height = tabRect.height;

    this.glider.style.width = `${width}px`;
    this.glider.style.height = `${height}px`;
    this.glider.style.transform = `translate3d(${left}px, ${top}px, 0)`;
  }

  _handleKeydown(e) {
    const isVertical = this.options.orientation === 'vertical';
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';

    let targetIndex = null;

    switch (e.key) {
      case prevKey:
        e.preventDefault();
        targetIndex = (this.currentIndex - 1 + this.tabs.length) % this.tabs.length;
        logger.log('Key', `[${prevKey}] pressed in tabs`);
        break;

      case nextKey:
        e.preventDefault();
        targetIndex = (this.currentIndex + 1) % this.tabs.length;
        logger.log('Key', `[${nextKey}] pressed in tabs`);
        break;

      case 'Home':
        e.preventDefault();
        targetIndex = 0;
        logger.log('Key', `[Home] pressed in tabs -> Jumped to first tab`);
        break;

      case 'End':
        e.preventDefault();
        targetIndex = this.tabs.length - 1;
        logger.log('Key', `[End] pressed in tabs -> Jumped to last tab`);
        break;

      case 'Enter':
      case ' ':
        if (this.options.activation === 'manual') {
          e.preventDefault();
          this.activateTab(this.currentIndex, true);
          logger.log('Key', `[${e.key === ' ' ? 'Space' : 'Enter'}] manual activation triggered`);
        }
        return;

      default:
        return;
    }

    if (targetIndex !== null) {
      if (this.options.activation === 'auto') {
        this.activateTab(targetIndex, true);
      } else {
        // Manual mode: move focus without activating the panel
        this.currentIndex = targetIndex;
        this.tabs[targetIndex].focus();
        this._updateGliderPosition();
      }
    }
  }

  /**
   * Dynamic Tab Injection API
   */
  addTab({ id, title, content, icon = null }) {
    const safeId = id || `dynamic-tab-${Date.now()}`;
    const panelId = `panel-${safeId}`;

    // Create Tab Button
    const newTabBtn = document.createElement('button');
    newTabBtn.type = 'button';
    newTabBtn.className = 'nexus-tab-btn';
    newTabBtn.role = 'tab';
    newTabBtn.id = `tab-${safeId}`;
    newTabBtn.setAttribute('aria-selected', 'false');
    newTabBtn.setAttribute('aria-controls', panelId);
    newTabBtn.setAttribute('tabindex', '-1');

    newTabBtn.innerHTML = `
      ${icon || '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>'}
      <span>${title}</span>
    `;

    // Create Panel
    const newPanel = document.createElement('div');
    newPanel.className = 'nexus-tab-panel';
    newPanel.role = 'tabpanel';
    newPanel.id = panelId;
    newPanel.setAttribute('aria-labelledby', `tab-${safeId}`);
    newPanel.setAttribute('tabindex', '0');
    newPanel.setAttribute('hidden', '');
    newPanel.innerHTML = `
      <div class="panel-content-grid">
        <div class="panel-description">
          <h4 class="panel-title">${title}</h4>
          <div>${content}</div>
        </div>
      </div>
    `;

    // Append to DOM
    this.tabList.appendChild(newTabBtn);
    const panelsContainer = this.container.querySelector('.nexus-tab-panels');
    if (panelsContainer) panelsContainer.appendChild(newPanel);

    // Refresh collection
    this.tabs.push(newTabBtn);
    this.panels.push(newPanel);

    // Switch to new tab
    this.activateTab(this.tabs.length - 1, true);

    logger.log('Tabs', `Dynamically added new tab: "${title}" (Total: ${this.tabs.length})`);
  }

  setOrientation(orientation) {
    this.options.orientation = orientation;
    this.container.classList.remove('horizontal', 'vertical');
    this.container.classList.add(orientation);
    this.tabList.setAttribute('aria-orientation', orientation);
    this._updateGliderPosition();
    logger.log('Tabs', `Tab orientation changed to: ${orientation}`);
  }

  setActivationMode(mode) {
    this.options.activation = mode;
    this.container.dataset.activation = mode;
    logger.log('Tabs', `Tab activation mode updated: ${mode}`);
  }
}


/* ============================================================================
   4. ADVANCED ACCORDION & DISCLOSURE SYSTEM (NexusAccordion)
   ============================================================================ */
class NexusAccordion {
  constructor(containerOrSelector, options = {}) {
    this.container = typeof containerOrSelector === 'string'
      ? document.querySelector(containerOrSelector)
      : containerOrSelector;

    if (!this.container) {
      console.warn(`[NexusAccordion] Initialization aborted: Accordion container "${containerOrSelector}" not found.`);
      return;
    }

    this.options = {
      multiExpand: this.container.dataset.multiexpand === 'true',
      defaultOpenIndex: 0,
      onToggle: null,
      ...options
    };

    this.items = Array.from(this.container.querySelectorAll('[data-accordion-item]'));
    this.triggers = Array.from(this.container.querySelectorAll('.nexus-accordion-trigger'));
    this.searchInput = document.getElementById('accordionSearchInput');
    this.searchStatusBar = document.getElementById('accordionSearchStatus');
    this.emptyState = document.getElementById('accordionEmptyState');
    this.clearSearchBtn = document.getElementById('clearSearchBtn');

    // Store raw text templates for clean highlight resets
    this._cacheOriginalContent();

    this._handleKeydown = this._handleKeydown.bind(this);
    this._handleSearchInput = this._handleSearchInput.bind(this);

    this.init();
  }

  _cacheOriginalContent() {
    this.items.forEach(item => {
      const titleSpan = item.querySelector('.acc-title-text');
      const panelInner = item.querySelector('.panel-inner');
      if (titleSpan) titleSpan.dataset.originalText = titleSpan.textContent;
      if (panelInner) panelInner.dataset.originalHtml = panelInner.innerHTML;
    });
  }

  init() {
    if (this.triggers.length === 0) return;

    // Delegate click events on container
    this.container.addEventListener('click', (e) => {
      const trigger = e.target.closest('.nexus-accordion-trigger');
      if (!trigger) return;
      this.toggle(trigger);
    });

    // Keyboard navigation
    this.container.addEventListener('keydown', this._handleKeydown);

    // Initial state: Set active class on items whose trigger has aria-expanded="true"
    this.triggers.forEach(trigger => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const item = trigger.closest('[data-accordion-item]');
      if (item) item.classList.toggle('active', isExpanded);
    });

    // Wire Live Search if element exists
    if (this.searchInput) {
      this.searchInput.addEventListener('input', this._handleSearchInput);
    }

    if (this.clearSearchBtn) {
      this.clearSearchBtn.addEventListener('click', () => {
        this.resetSearch();
      });
    }

    logger.log('Accordion', `Accordion initialized with ${this.items.length} sections (MultiExpand: ${this.options.multiExpand})`);
  }

  /**
   * Toggle specific accordion item
   */
  toggle(trigger) {
    const item = trigger.closest('[data-accordion-item]');
    if (!item) return;

    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    const nextState = !isExpanded;

    if (nextState && !this.options.multiExpand) {
      // In single-expand mode, collapse all siblings
      this.triggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherItem = otherTrigger.closest('[data-accordion-item]');
          if (otherItem) otherItem.classList.remove('active');
        }
      });
    }

    // Apply new state
    trigger.setAttribute('aria-expanded', nextState ? 'true' : 'false');
    item.classList.toggle('active', nextState);

    // Custom event & lifecycle hook
    if (typeof this.options.onToggle === 'function') {
      this.options.onToggle(item, nextState);
    }

    this.container.dispatchEvent(new CustomEvent('nexus:accordion-toggled', {
      bubbles: true,
      detail: {
        triggerId: trigger.id,
        isExpanded: nextState
      }
    }));

    logger.log('Accordion', `Accordion item #${trigger.id} ${nextState ? 'expanded' : 'collapsed'}`);
  }

  expandAll() {
    this.triggers.forEach(trigger => {
      trigger.setAttribute('aria-expanded', 'true');
      const item = trigger.closest('[data-accordion-item]');
      if (item) item.classList.add('active');
    });
    logger.log('Accordion', `Expanded all ${this.triggers.length} accordion items.`);
  }

  collapseAll() {
    this.triggers.forEach(trigger => {
      trigger.setAttribute('aria-expanded', 'false');
      const item = trigger.closest('[data-accordion-item]');
      if (item) item.classList.remove('active');
    });
    logger.log('Accordion', `Collapsed all accordion items.`);
  }

  setMultiExpand(enabled) {
    this.options.multiExpand = enabled;
    this.container.dataset.multiexpand = enabled ? 'true' : 'false';
    logger.log('Accordion', `MultiExpand mode set to: ${enabled}`);
  }

  _handleKeydown(e) {
    const currentTrigger = e.target.closest('.nexus-accordion-trigger');
    if (!currentTrigger) return;

    const visibleTriggers = this.triggers.filter(t => !t.closest('[data-accordion-item]').hidden);
    const currentIndex = visibleTriggers.indexOf(currentTrigger);
    if (currentIndex === -1) return;

    let targetTrigger = null;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        targetTrigger = visibleTriggers[(currentIndex + 1) % visibleTriggers.length];
        logger.log('Key', `[ArrowDown] navigated in accordion`);
        break;

      case 'ArrowUp':
        e.preventDefault();
        targetTrigger = visibleTriggers[(currentIndex - 1 + visibleTriggers.length) % visibleTriggers.length];
        logger.log('Key', `[ArrowUp] navigated in accordion`);
        break;

      case 'Home':
        e.preventDefault();
        targetTrigger = visibleTriggers[0];
        logger.log('Key', `[Home] jumped to top accordion item`);
        break;

      case 'End':
        e.preventDefault();
        targetTrigger = visibleTriggers[visibleTriggers.length - 1];
        logger.log('Key', `[End] jumped to bottom accordion item`);
        break;

      default:
        return;
    }

    if (targetTrigger) {
      targetTrigger.focus();
    }
  }

  /**
   * Real-Time Search & Keyword Highlight Filter
   */
  _handleSearchInput(e) {
    const query = e.target.value.trim().toLowerCase();
    
    if (this.clearSearchBtn) {
      this.clearSearchBtn.hidden = query.length === 0;
    }

    if (!query) {
      this.resetSearch();
      return;
    }

    let matchCount = 0;

    this.items.forEach(item => {
      const trigger = item.querySelector('.nexus-accordion-trigger');
      const titleSpan = item.querySelector('.acc-title-text');
      const panelInner = item.querySelector('.panel-inner');

      const originalTitle = titleSpan.dataset.originalText || titleSpan.textContent;
      const originalHtml = panelInner.dataset.originalHtml || panelInner.innerHTML;

      const titleMatches = originalTitle.toLowerCase().includes(query);
      const contentMatches = panelInner.textContent.toLowerCase().includes(query);

      if (titleMatches || contentMatches) {
        matchCount++;
        item.hidden = false;
        // Auto-expand matching sections
        trigger.setAttribute('aria-expanded', 'true');
        item.classList.add('active');

        // Apply highlights safely
        this._highlightNode(titleSpan, originalTitle, query);
      } else {
        item.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
        item.classList.remove('active');
        titleSpan.textContent = originalTitle;
      }
    });

    // Update empty state & ARIA status
    if (this.emptyState) {
      this.emptyState.hidden = matchCount > 0;
    }

    if (this.searchStatusBar) {
      this.searchStatusBar.textContent = matchCount > 0 
        ? `Found ${matchCount} matching ${matchCount === 1 ? 'topic' : 'topics'} for "${query}".`
        : `No matching topics found for "${query}".`;
    }

    logger.log('Search', `Accordion filter query: "${query}" -> ${matchCount} matches found.`);
  }

  _highlightNode(node, originalText, query) {
    if (!query) {
      node.textContent = originalText;
      return;
    }
    const regex = new RegExp(`(${this._escapeRegex(query)})`, 'gi');
    node.innerHTML = originalText.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  resetSearch() {
    if (this.searchInput) this.searchInput.value = '';
    if (this.clearSearchBtn) this.clearSearchBtn.hidden = true;
    if (this.emptyState) this.emptyState.hidden = true;

    this.items.forEach(item => {
      item.hidden = false;
      const titleSpan = item.querySelector('.acc-title-text');
      if (titleSpan && titleSpan.dataset.originalText) {
        titleSpan.textContent = titleSpan.dataset.originalText;
      }
    });

    if (this.searchStatusBar) {
      this.searchStatusBar.textContent = `Showing all ${this.items.length} accordion topics.`;
    }

    logger.log('Search', 'Accordion filter reset to default state.');
  }

  _escapeRegex(string) {
    return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
  }
}


/* ============================================================================
   5. ACCESSIBLE TOAST NOTIFICATION MANAGER (NexusToast)
   ============================================================================ */
class NexusToastManager {
  constructor(containerOrSelector = '#toastContainer') {
    this.container = typeof containerOrSelector === 'string'
      ? document.querySelector(containerOrSelector)
      : containerOrSelector;

    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toastContainer';
      this.container.className = 'nexus-toast-container';
      this.container.setAttribute('role', 'status');
      this.container.setAttribute('aria-live', 'polite');
      document.body.appendChild(this.container);
    }
  }

  show({ title = '', message = '', type = 'info', duration = 4000 }) {
    const toast = document.createElement('div');
    toast.className = `nexus-toast ${type}`;

    const iconMap = {
      success: `<svg class="toast-icon text-success" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
      info: `<svg class="toast-icon text-info" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
      warning: `<svg class="toast-icon text-warning" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
      error: `<svg class="toast-icon text-danger" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`
    };

    toast.innerHTML = `
      ${iconMap[type] || iconMap.info}
      <div class="toast-content">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        <div class="toast-message">${message}</div>
      </div>
      <button type="button" class="toast-close-btn" aria-label="Dismiss notification">&times;</button>
      <div class="toast-progress-bar" style="animation-duration: ${duration}ms;"></div>
    `;

    this.container.appendChild(toast);

    let dismissTimer = setTimeout(() => this._dismiss(toast), duration);

    // Pause on hover
    toast.addEventListener('mouseenter', () => {
      clearTimeout(dismissTimer);
      const bar = toast.querySelector('.toast-progress-bar');
      if (bar) bar.style.animationPlayState = 'paused';
    });

    toast.addEventListener('mouseleave', () => {
      const bar = toast.querySelector('.toast-progress-bar');
      if (bar) bar.style.animationPlayState = 'running';
      dismissTimer = setTimeout(() => this._dismiss(toast), 1500);
    });

    // Close button click
    const closeBtn = toast.querySelector('.toast-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        clearTimeout(dismissTimer);
        this._dismiss(toast);
      });
    }

    logger.log('Toast', `[${type.toUpperCase()}] ${title}: ${message}`);
  }

  _dismiss(toast) {
    if (!toast || toast.classList.contains('toast-dismissing')) return;
    toast.classList.add('toast-dismissing');
    toast.addEventListener('transitionend', () => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, { once: true });
  }
}

const toastManager = new NexusToastManager();


/* ============================================================================
   6. SHOWCASE INTEGRATION & DEMO CONTROLLER
   ============================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Modals
  const modals = {};
  document.querySelectorAll('.nexus-modal').forEach(modalEl => {
    modals[modalEl.id] = new NexusModal(modalEl);
  });

  // Wire declarative data-modal-target buttons
  document.querySelectorAll('[data-modal-target]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.dataset.modalTarget;
      const targetModal = targetId.startsWith('#') ? targetId.slice(1) : targetId;
      if (modals[targetModal]) {
        modals[targetModal].open();
      } else {
        console.warn(`[NexusUI] Modal #${targetModal} not registered.`);
      }
    });
  });

  // 2. Initialize Tabs
  const demoTabs = new NexusTabs('#demoTabsComponent');

  // Wire Tab Toolbar controls
  const orientationSelect = document.getElementById('tabOrientationSelect');
  if (orientationSelect) {
    orientationSelect.addEventListener('change', (e) => {
      demoTabs.setOrientation(e.target.value);
    });
  }

  const activationSelect = document.getElementById('tabActivationSelect');
  if (activationSelect) {
    activationSelect.addEventListener('change', (e) => {
      demoTabs.setActivationMode(e.target.value);
    });
  }

  const addNewTabBtn = document.getElementById('addNewTabBtn');
  if (addNewTabBtn) {
    let dynamicCount = 1;
    addNewTabBtn.addEventListener('click', () => {
      demoTabs.addTab({
        title: `Telemetry #${dynamicCount}`,
        content: `
          <p><strong>Dynamic Tab Panel #${dynamicCount}</strong> was successfully injected via the NexusTabs API on runtime.</p>
          <p>All ARIA attributes (<code>role="tab"</code>, <code>aria-controls</code>, <code>tabindex</code>) and keyboard arrow navigation were bound automatically.</p>
        `
      });
      dynamicCount++;
      toastManager.show({
        type: 'success',
        title: 'Tab Created',
        message: 'New accessible tab was dynamically injected and activated.'
      });
    });
  }

  const stressTestTabsBtn = document.getElementById('stressTestTabsBtn');
  if (stressTestTabsBtn) {
    stressTestTabsBtn.addEventListener('click', () => {
      toastManager.show({
        type: 'info',
        title: 'Starting Loop',
        message: 'Cycling smoothly through all tabs automatically...'
      });
      let index = 0;
      const interval = setInterval(() => {
        demoTabs.activateTab(index, false);
        index++;
        if (index >= demoTabs.tabs.length) {
          clearInterval(interval);
          toastManager.show({
            type: 'success',
            title: 'Test Completed',
            message: 'All tab transitions rendered cleanly at 60fps.'
          });
        }
      }, 700);
    });
  }

  // 3. Initialize Accordion
  const demoAccordion = new NexusAccordion('#demoAccordion');

  const multiExpandToggle = document.getElementById('accordionMultiExpandToggle');
  if (multiExpandToggle) {
    multiExpandToggle.addEventListener('change', (e) => {
      demoAccordion.setMultiExpand(e.target.checked);
    });
  }

  const expandAllBtn = document.getElementById('expandAllAccordionBtn');
  if (expandAllBtn) {
    expandAllBtn.addEventListener('click', () => demoAccordion.expandAll());
  }

  const collapseAllBtn = document.getElementById('collapseAllAccordionBtn');
  if (collapseAllBtn) {
    collapseAllBtn.addEventListener('click', () => demoAccordion.collapseAll());
  }

  const resetSearchBtn = document.getElementById('resetSearchBtn');
  if (resetSearchBtn) {
    resetSearchBtn.addEventListener('click', () => demoAccordion.resetSearch());
  }

  // 4. Wire Interactive Form Inside Modal
  const modalForm = document.getElementById('interactiveModalForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('componentNameInput');
      const nameError = document.getElementById('nameError');

      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter a valid component name.';
        nameInput.focus();
        logger.log('Error', 'Modal form validation failed: missing component name.');
        return;
      }

      nameError.textContent = '';
      const savedName = nameInput.value.trim();
      modalForm.reset();

      // Close modal
      if (modals['formModal']) {
        modals['formModal'].close();
      }

      toastManager.show({
        type: 'success',
        title: 'Component Saved',
        message: `Successfully created and saved "${savedName}".`
      });
    });
  }

  // 5. Confirmation Modal Action (Nested action)
  const executeDeleteBtn = document.getElementById('executeDeleteBtn');
  if (executeDeleteBtn) {
    executeDeleteBtn.addEventListener('click', () => {
      if (modals['confirmModal']) {
        modals['confirmModal'].close();
      }
      logger.clear();
      toastManager.show({
        type: 'warning',
        title: 'State Reset',
        message: 'Telemetry metrics and event history were safely cleared.'
      });
    });
  }

  // Standard modal primary button
  const standardModalActionBtn = document.getElementById('standardModalActionBtn');
  if (standardModalActionBtn) {
    standardModalActionBtn.addEventListener('click', () => {
      if (modals['standardModal']) {
        modals['standardModal'].close();
      }
      toastManager.show({
        type: 'info',
        title: 'Standard Modal Action',
        message: 'You clicked the primary confirmation button in the dialog.'
      });
    });
  }

  // 6. Wire Toast Demo Buttons
  const toastSuccessBtn = document.getElementById('toastSuccessBtn');
  if (toastSuccessBtn) {
    toastSuccessBtn.addEventListener('click', () => {
      toastManager.show({
        type: 'success',
        title: 'Deployment Ready',
        message: 'All ARIA attributes and focus traps passed validation.'
      });
    });
  }

  const toastInfoBtn = document.getElementById('toastInfoBtn');
  if (toastInfoBtn) {
    toastInfoBtn.addEventListener('click', () => {
      toastManager.show({
        type: 'info',
        title: 'Keyboard Shortcut Tip',
        message: 'Use Tab to enter tabs and Arrow keys to navigate between panels.'
      });
    });
  }

  const toastWarningBtn = document.getElementById('toastWarningBtn');
  if (toastWarningBtn) {
    toastWarningBtn.addEventListener('click', () => {
      toastManager.show({
        type: 'warning',
        title: 'Resource Alert',
        message: 'Simulated high-frequency DOM event activity detected.'
      });
    });
  }

  const toastErrorBtn = document.getElementById('toastErrorBtn');
  if (toastErrorBtn) {
    toastErrorBtn.addEventListener('click', () => {
      toastManager.show({
        type: 'error',
        title: 'Simulation Error',
        message: 'Graceful fallback engaged: legacy browser support activated.'
      });
    });
  }

  // Quick Action Buttons in Hero
  const quickToastTrigger = document.getElementById('quickToastTrigger');
  if (quickToastTrigger) {
    quickToastTrigger.addEventListener('click', () => {
      toastManager.show({
        type: 'info',
        title: 'Hero Quick Launch',
        message: 'Interactive Toast system triggered from the telemetry card.'
      });
    });
  }

  const quickAccordionExpandAll = document.getElementById('quickAccordionExpandAll');
  if (quickAccordionExpandAll) {
    quickAccordionExpandAll.addEventListener('click', () => {
      demoAccordion.expandAll();
      toastManager.show({
        type: 'success',
        title: 'Accordions Expanded',
        message: 'All 5 FAQ panels are now expanded.'
      });
    });
  }

  const quickTabsCycle = document.getElementById('quickTabsCycle');
  if (quickTabsCycle) {
    quickTabsCycle.addEventListener('click', () => {
      const next = (demoTabs.currentIndex + 1) % demoTabs.tabs.length;
      demoTabs.activateTab(next, true);
    });
  }

  // 7. Theme Toggle Controller
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const htmlRoot = document.documentElement;

  // Restore saved theme
  const savedTheme = localStorage.getItem('nexus_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', nextTheme);
      localStorage.setItem('nexus_theme', nextTheme);
      logger.log('Theme', `Theme toggled to: ${nextTheme.toUpperCase()}`);
    });
  }

  // 8. Motion Preference Toggle
  const motionToggleBtn = document.getElementById('motionToggleBtn');
  if (motionToggleBtn) {
    motionToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('simulated-reduced-motion');
      const isReduced = document.body.classList.contains('simulated-reduced-motion');
      toastManager.show({
        type: 'info',
        title: 'Motion Mode',
        message: isReduced ? 'Reduced motion simulation ENABLED.' : 'Full 60fps animations RESTORED.'
      });
      logger.log('Motion', `Reduced motion preference: ${isReduced ? 'ACTIVE' : 'INACTIVE'}`);
    });
  }

  // 9. Event Logger HUD Controller
  const toggleLoggerBtn = document.getElementById('toggleLoggerBtn');
  const eventLoggerHud = document.getElementById('eventLoggerHud');
  const closeLoggerHudBtn = document.getElementById('closeLoggerHudBtn');
  const clearLogsBtn = document.getElementById('clearLogsBtn');

  if (toggleLoggerBtn && eventLoggerHud) {
    toggleLoggerBtn.addEventListener('click', () => {
      const isHidden = eventLoggerHud.hidden;
      eventLoggerHud.hidden = !isHidden;
      toggleLoggerBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      logger.log('HUD', `Event logger HUD ${isHidden ? 'opened' : 'closed'}`);
    });
  }

  if (closeLoggerHudBtn && eventLoggerHud) {
    closeLoggerHudBtn.addEventListener('click', () => {
      eventLoggerHud.hidden = true;
      if (toggleLoggerBtn) toggleLoggerBtn.setAttribute('aria-expanded', 'false');
    });
  }

  if (clearLogsBtn) {
    clearLogsBtn.addEventListener('click', () => {
      logger.clear();
    });
  }

  // 10. Documentation Code Tabs Controller
  const codeTabBtns = document.querySelectorAll('.code-tab-btn');
  const codePanels = document.querySelectorAll('.code-panel');
  codeTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      codeTabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      codePanels.forEach(p => {
        p.classList.remove('active');
        p.hidden = true;
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const targetPanel = document.getElementById(btn.getAttribute('aria-controls'));
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.hidden = false;
      }
    });
  });

  const copyCodeBtn = document.getElementById('copyCodeBtn');
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener('click', () => {
      const activeCode = document.querySelector('.code-panel.active code');
      if (activeCode) {
        navigator.clipboard.writeText(activeCode.textContent).then(() => {
          const originalText = copyCodeBtn.querySelector('span').textContent;
          copyCodeBtn.querySelector('span').textContent = 'Copied!';
          setTimeout(() => {
            copyCodeBtn.querySelector('span').textContent = originalText;
          }, 2000);
          toastManager.show({
            type: 'success',
            title: 'Copied to Clipboard',
            message: 'Code snippet copied successfully.'
          });
        });
      }
    });
  }

  // Drawer modal stat update
  const drawerModal = document.getElementById('drawerModal');
  if (drawerModal) {
    drawerModal.addEventListener('nexus:modal-opened', () => {
      const focusCountEl = document.getElementById('drawerFocusCount');
      const scrollOffsetEl = document.getElementById('drawerScrollbarOffset');
      const focusables = modals['drawerModal']._getFocusableElements();
      if (focusCountEl) focusCountEl.textContent = `${focusables.length} focusable items`;
      if (scrollOffsetEl) scrollOffsetEl.textContent = `Compensated ${NexusModal._getScrollbarWidth()}px`;
    });
  }
});
