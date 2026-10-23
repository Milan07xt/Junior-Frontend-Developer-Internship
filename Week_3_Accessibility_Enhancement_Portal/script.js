/**
 * ============================================================================
 * Aura — Accessible Tech Journalism & WCAG 2.2 AAA Engine
 * Junior Frontend Developer Internship — Week 3 Submission
 * 
 * Features:
 *  - A11yPreferences: Font size scaling, high contrast, dyslexia font,
 *                     focus booster, underline links, and light/dark theme
 *  - AuditSimulator: Dynamic "Before vs. After" Remediation switcher
 *  - SpeechArticleNarrator: SpeechSynthesis article reader with ARIA status
 *  - SpyScrollTOC: IntersectionObserver table of contents tracker
 *  - AccessibleSearch: Keyboard-navigable autocomplete with aria-expanded
 *  - AccessibleForms: Real-time validation with aria-invalid & aria-describedby
 *  - AccessibleModals: Strict focus trapping, ESC close, & focus restoration
 *  - KeyboardHotkeys: Alt+S, Alt+K, Alt+A, Alt+/, Escape shortcuts
 * ============================================================================
 */

'use strict';

/* ============================================================================
   1. ACCESSIBLE TOAST MANAGER (WCAG 4.1.3 Live Region)
   ============================================================================ */
class A11yToast {
  static show(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toastRegion');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `a11y-toast ${type}`;
    toast.innerHTML = `
      <span class="toast-text">${message}</span>
      <button type="button" class="toast-close-btn" aria-label="Dismiss notification">&times;</button>
    `;

    container.appendChild(toast);

    const timer = setTimeout(() => {
      A11yToast.dismiss(toast);
    }, duration);

    toast.querySelector('.toast-close-btn').addEventListener('click', () => {
      clearTimeout(timer);
      A11yToast.dismiss(toast);
    });
  }

  static dismiss(toast) {
    if (!toast || toast.classList.contains('dismissing')) return;
    toast.classList.add('dismissing');
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 200);
  }
}


/* ============================================================================
   2. ACCESSIBILITY PREFERENCES CONTROLLER (WCAG 1.4 & 2.1)
   ============================================================================ */
class A11yPreferencesManager {
  constructor() {
    this.html = document.documentElement;
    this.body = document.body;

    this.fontScaleButtons = document.querySelectorAll('[data-scale]');
    this.contrastBtn = document.getElementById('highContrastToggle');
    this.dyslexiaBtn = document.getElementById('dyslexiaFontToggle');
    this.underlineBtn = document.getElementById('underlineLinksToggle');
    this.focusBoosterBtn = document.getElementById('focusBoosterToggle');
    this.themeBtn = document.getElementById('themeModeToggle');

    this.init();
  }

  init() {
    // Restore preferences from localStorage
    const savedScale = localStorage.getItem('aura_scale') || 'normal';
    const savedContrast = localStorage.getItem('aura_contrast') || 'normal';
    const savedDyslexia = localStorage.getItem('aura_dyslexia') === 'true';
    const savedUnderline = localStorage.getItem('aura_underline') === 'true';
    const savedFocusBooster = localStorage.getItem('aura_focus_booster') === 'true';
    const savedTheme = localStorage.getItem('aura_theme') || 'light';

    this.setFontScale(savedScale, false);
    this.setHighContrast(savedContrast === 'high', false);
    this.setDyslexiaFont(savedDyslexia, false);
    this.setUnderlineLinks(savedUnderline, false);
    this.setFocusBooster(savedFocusBooster, false);
    this.setTheme(savedTheme, false);

    this.bindEvents();
  }

  bindEvents() {
    // Font scale buttons
    this.fontScaleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.setFontScale(btn.dataset.scale);
      });
    });

    // High Contrast toggle
    if (this.contrastBtn) {
      this.contrastBtn.addEventListener('click', () => {
        const isHigh = this.html.getAttribute('data-contrast') === 'high';
        this.setHighContrast(!isHigh);
      });
    }

    // Dyslexia font toggle
    if (this.dyslexiaBtn) {
      this.dyslexiaBtn.addEventListener('click', () => {
        const isActive = this.body.classList.contains('dyslexia-font');
        this.setDyslexiaFont(!isActive);
      });
    }

    // Underline links toggle
    if (this.underlineBtn) {
      this.underlineBtn.addEventListener('click', () => {
        const isActive = this.body.classList.contains('underline-links');
        this.setUnderlineLinks(!isActive);
      });
    }

    // Focus booster toggle
    if (this.focusBoosterBtn) {
      this.focusBoosterBtn.addEventListener('click', () => {
        const isActive = this.body.classList.contains('focus-booster');
        this.setFocusBooster(!isActive);
      });
    }

    // Theme toggle
    if (this.themeBtn) {
      this.themeBtn.addEventListener('click', () => {
        const currentTheme = this.html.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(nextTheme);
      });
    }
  }

  setFontScale(scale, notify = true) {
    this.html.setAttribute('data-font-size', scale);
    localStorage.setItem('aura_scale', scale);

    this.fontScaleButtons.forEach(b => {
      const isSelected = b.dataset.scale === scale;
      b.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });

    if (notify) {
      A11yToast.show(`Text size adjusted to ${scale === 'normal' ? '100%' : scale === 'large' ? '125%' : '150%'}.`);
    }
  }

  setHighContrast(enable, notify = true) {
    if (enable) {
      this.html.setAttribute('data-contrast', 'high');
      localStorage.setItem('aura_contrast', 'high');
      if (this.contrastBtn) this.contrastBtn.setAttribute('aria-pressed', 'true');
      if (notify) A11yToast.show('High Contrast Mode (21:1 pure black & yellow) activated.');
    } else {
      this.html.setAttribute('data-contrast', 'normal');
      localStorage.setItem('aura_contrast', 'normal');
      if (this.contrastBtn) this.contrastBtn.setAttribute('aria-pressed', 'false');
      if (notify) A11yToast.show('Standard high-contrast color scheme restored.');
    }
  }

  setDyslexiaFont(enable, notify = true) {
    this.body.classList.toggle('dyslexia-font', enable);
    localStorage.setItem('aura_dyslexia', enable ? 'true' : 'false');
    if (this.dyslexiaBtn) this.dyslexiaBtn.setAttribute('aria-pressed', enable ? 'true' : 'false');
    if (notify) {
      A11yToast.show(enable ? 'Dyslexia-friendly high-legibility typography activated.' : 'Standard typography restored.');
    }
  }

  setUnderlineLinks(enable, notify = true) {
    this.body.classList.toggle('underline-links', enable);
    localStorage.setItem('aura_underline', enable ? 'true' : 'false');
    if (this.underlineBtn) this.underlineBtn.setAttribute('aria-pressed', enable ? 'true' : 'false');
    if (notify) {
      A11yToast.show(enable ? 'Explicit underline indicators applied to all hyperlinks.' : 'Standard link styling restored.');
    }
  }

  setFocusBooster(enable, notify = true) {
    this.body.classList.toggle('focus-booster', enable);
    localStorage.setItem('aura_focus_booster', enable ? 'true' : 'false');
    if (this.focusBoosterBtn) this.focusBoosterBtn.setAttribute('aria-pressed', enable ? 'true' : 'false');
    if (notify) {
      A11yToast.show(enable ? 'Enhanced 4px high-visibility focus indicators enabled.' : 'Standard 3px focus rings active.');
    }
  }

  setTheme(theme, notify = true) {
    this.html.setAttribute('data-theme', theme);
    localStorage.setItem('aura_theme', theme);
    const themeLabel = document.getElementById('themeToggleLabel');
    if (themeLabel) themeLabel.textContent = theme === 'dark' ? 'Dark' : 'Light';
    if (notify) {
      A11yToast.show(`${theme === 'dark' ? 'Dark' : 'Light'} theme enabled with WCAG AAA compliant contrast.`);
    }
  }
}


/* ============================================================================
   3. AUDIT SIMULATOR: BEFORE VS. AFTER REMEDIATION
   ============================================================================ */
class AuditSimulatorManager {
  constructor() {
    this.toggle = document.getElementById('auditModeToggle');
    this.badge = document.getElementById('auditModeBadge');
    this.scoreVal = document.getElementById('scorecardNumericVal');
    this.ratingLabel = document.getElementById('scorecardRatingLabel');
    this.toolLabel = document.getElementById('scorecardAuditTool');

    this.init();
  }

  init() {
    if (!this.toggle) return;

    this.toggle.addEventListener('change', (e) => {
      const mode = e.target.value;
      this.applyMode(mode);
    });

    // Run simulator button in sidebar
    const simBtn = document.getElementById('runLiveAuditSimulatorBtn');
    if (simBtn) {
      simBtn.addEventListener('click', () => {
        A11yToast.show('Running automated WCAG 2.2 rules engine... Conformance: 100/100, 0 violations.');
      });
    }
  }

  applyMode(mode) {
    if (mode === 'legacy') {
      document.body.classList.add('mode-legacy');
      if (this.badge) this.badge.textContent = 'LEGACY INACCESSIBLE MODE (42/100)';
      if (this.scoreVal) this.scoreVal.textContent = '42';
      if (this.ratingLabel) this.ratingLabel.textContent = '28 Critical Violations Detected';
      if (this.toolLabel) this.toolLabel.textContent = 'WAVE & Lighthouse Failures Active';

      A11yToast.show(
        'Simulating legacy state: low-contrast grays applied, focus rings suppressed, and contrast errors simulated for demonstration.',
        'warning',
        6000
      );
    } else {
      document.body.classList.remove('mode-legacy');
      if (this.badge) this.badge.textContent = 'WCAG 2.2 AAA REMEDIATED MODE';
      if (this.scoreVal) this.scoreVal.textContent = '100';
      if (this.ratingLabel) this.ratingLabel.textContent = 'Perfect Accessibility';
      if (this.toolLabel) this.toolLabel.textContent = 'Audited via Google Lighthouse 12.0';

      A11yToast.show(
        'Remediated mode restored: WCAG 2.2 AAA contrast, semantic landmarks, and full keyboard operability active.',
        'success'
      );
    }
  }
}


/* ============================================================================
   4. TEXT-TO-SPEECH ARTICLE NARRATOR (Web Speech API)
   ============================================================================ */
class SpeechArticleNarrator {
  constructor() {
    this.playBtn = document.getElementById('audioPlayToggleBtn');
    this.playText = document.getElementById('audioPlayBtnText');
    this.playIcon = this.playBtn ? this.playBtn.querySelector('.play-icon') : null;
    this.pauseIcon = this.playBtn ? this.playBtn.querySelector('.pause-icon') : null;
    this.status = document.getElementById('audioStatusLive');
    this.isPlaying = false;
    this.synth = window.speechSynthesis;

    this.init();
  }

  init() {
    if (!this.playBtn) return;

    if (!('speechSynthesis' in window)) {
      this.playBtn.disabled = true;
      if (this.status) this.status.textContent = 'Speech synthesis not supported in this browser.';
      return;
    }

    this.playBtn.addEventListener('click', () => {
      if (this.isPlaying) {
        this.stop();
      } else {
        this.play();
      }
    });
  }

  play() {
    const article = document.querySelector('.article-body-content');
    if (!article) return;

    this.synth.cancel();

    const textToRead = article.innerText;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.isPlaying = true;
      this.playBtn.setAttribute('aria-pressed', 'true');
      if (this.playText) this.playText.textContent = 'Pause Narration';
      if (this.playIcon) this.playIcon.hidden = true;
      if (this.pauseIcon) this.pauseIcon.hidden = false;
      if (this.status) this.status.textContent = 'Reading article aloud...';
      A11yToast.show('Article text narration started.');
    };

    utterance.onend = () => {
      this.stop();
      if (this.status) this.status.textContent = 'Narration completed.';
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      this.stop();
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) this.synth.cancel();
    this.isPlaying = false;
    if (this.playBtn) this.playBtn.setAttribute('aria-pressed', 'false');
    if (this.playText) this.playText.textContent = 'Listen to Article';
    if (this.playIcon) this.playIcon.hidden = false;
    if (this.pauseIcon) this.pauseIcon.hidden = true;
    if (this.status) this.status.textContent = 'Narration paused.';
  }
}


/* ============================================================================
   5. READING PROGRESS TRACKER (WCAG Visual Indicator)
   ============================================================================ */
class ReadingProgressTracker {
  constructor() {
    this.bar = document.getElementById('readingProgressFill');
    this.track = document.getElementById('readingProgressBar');
    this.article = document.getElementById('article-spotlight');

    if (this.bar && this.article) {
      window.addEventListener('scroll', () => this.update(), { passive: true });
      this.update();
    }
  }

  update() {
    const rect = this.article.getBoundingClientRect();
    const articleHeight = this.article.offsetHeight;
    const windowHeight = window.innerHeight;

    let progress = 0;
    if (rect.top <= 0) {
      const scrolled = -rect.top;
      progress = Math.min(100, Math.max(0, (scrolled / (articleHeight - windowHeight)) * 100));
    }

    this.bar.style.transform = `scaleX(${progress / 100})`;
    if (this.track) {
      this.track.setAttribute('aria-valuenow', Math.round(progress));
    }
  }
}


/* ============================================================================
   6. SPY-SCROLL TABLE OF CONTENTS (IntersectionObserver)
   ============================================================================ */
class SpyScrollTOC {
  constructor() {
    this.links = document.querySelectorAll('.toc-link');
    this.sections = document.querySelectorAll('.content-section');

    this.init();
  }

  init() {
    if (!('IntersectionObserver' in window) || this.sections.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          this.links.forEach(link => {
            const matches = link.getAttribute('href') === `#${id}`;
            if (matches) {
              link.setAttribute('aria-current', 'location');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, {
      rootMargin: '-10% 0px -70% 0px'
    });

    this.sections.forEach(s => observer.observe(s));
  }
}


/* ============================================================================
   7. ACCESSIBLE SITE SEARCH (Keyboard Navigable & Live Suggestions)
   ============================================================================ */
class AccessibleSearchManager {
  constructor() {
    this.form = document.getElementById('site-search');
    this.input = document.getElementById('searchInputField');
    this.dropdown = document.getElementById('searchLiveResults');

    this.sampleArticles = [
      { title: 'Designing for Neurodiversity and Assistive Technologies', url: '#section-perceivable' },
      { title: 'Perceivable Architecture & Meaningful Content Guidelines', url: '#section-perceivable' },
      { title: 'Operable Controls & Dual-Layer Focus Navigation', url: '#section-operable' },
      { title: 'Understandable Interfaces & Cognitive Predictability', url: '#section-understandable' },
      { title: 'Robust Engineering & Screen Reader Compatibility', url: '#section-robust' },
      { title: 'Automating WCAG AAA Contrast Audits Across CI/CD Pipelines', url: '#related-articles' }
    ];

    this.init();
  }

  init() {
    if (!this.input || !this.dropdown) return;

    this.input.addEventListener('input', (e) => this.handleInput(e));
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!this.form.contains(e.target)) {
        this.close();
      }
    });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = this.input.value.trim();
      if (val) {
        A11yToast.show(`Searching portal database for "${val}"... (Displaying matching sections)`);
      }
    });
  }

  handleInput(e) {
    const query = e.target.value.trim().toLowerCase();
    if (!query) {
      this.close();
      return;
    }

    const matches = this.sampleArticles.filter(a => a.title.toLowerCase().includes(query));

    if (matches.length > 0) {
      this.dropdown.innerHTML = matches.map((item, idx) => `
        <div class="search-live-item" role="option" id="search-opt-${idx}" tabindex="-1" data-url="${item.url}">
          ${item.title}
        </div>
      `).join('');

      this.dropdown.hidden = false;
      this.input.setAttribute('aria-expanded', 'true');

      // Wire item clicks
      this.dropdown.querySelectorAll('.search-live-item').forEach(item => {
        item.addEventListener('click', () => {
          window.location.hash = item.dataset.url;
          this.close();
        });
      });
    } else {
      this.dropdown.innerHTML = `<div class="search-live-item" style="color: var(--text-subtle);">No matching topics found.</div>`;
      this.dropdown.hidden = false;
      this.input.setAttribute('aria-expanded', 'true');
    }
  }

  handleKeydown(e) {
    if (e.key === 'Escape') {
      this.close();
    }
  }

  close() {
    this.dropdown.hidden = true;
    this.input.setAttribute('aria-expanded', 'false');
  }
}


/* ============================================================================
   8. ACCESSIBLE FORM VALIDATION & COMMUNITY DIALOGUE
   ============================================================================ */
class AccessibleFormManager {
  constructor() {
    this.form = document.getElementById('accessibleCommentForm');
    this.nameInput = document.getElementById('commentAuthorName');
    this.emailInput = document.getElementById('commentAuthorEmail');
    this.commentText = document.getElementById('commentBodyText');
    this.charCounter = document.getElementById('charCounter');
    this.statusFeedback = document.getElementById('formSubmissionStatus');
    this.commentsList = document.getElementById('commentsContainer');
    this.badge = document.getElementById('commentCountBadge');

    this.init();
  }

  init() {
    if (!this.form) return;

    // Live character counter
    if (this.commentText && this.charCounter) {
      this.commentText.addEventListener('input', () => {
        const count = this.commentText.value.length;
        this.charCounter.textContent = `${count} / 500 characters`;
        if (count > 500) {
          this.charCounter.style.color = 'var(--color-danger)';
        } else {
          this.charCounter.style.color = 'var(--text-subtle)';
        }
      });
    }

    // Submit listener
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Newsletter form
    const newsForm = document.getElementById('sidebarNewsletterForm');
    if (newsForm) {
      newsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('newsletterEmailInput');
        const err = document.getElementById('newsletterError');
        const note = document.getElementById('newsletterSuccessFeedback');

        if (!email.value || !email.value.includes('@')) {
          email.setAttribute('aria-invalid', 'true');
          err.textContent = 'Please provide a valid email format (e.g. user@domain.com).';
          email.focus();
          return;
        }

        email.setAttribute('aria-invalid', 'false');
        err.textContent = '';
        newsForm.reset();
        note.textContent = '✓ Subscribed with privacy-first standards.';
        A11yToast.show('Subscribed to the Accessible Engineering Digest.');
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    let hasErrors = false;
    const nameErr = document.getElementById('nameError');
    const emailErr = document.getElementById('emailError');
    const commentErr = document.getElementById('commentError');

    // Name Validation
    if (!this.nameInput.value.trim()) {
      this.nameInput.setAttribute('aria-invalid', 'true');
      nameErr.textContent = 'Please enter your full name.';
      if (!hasErrors) this.nameInput.focus();
      hasErrors = true;
    } else {
      this.nameInput.setAttribute('aria-invalid', 'false');
      nameErr.textContent = '';
    }

    // Email Validation
    const emailVal = this.emailInput.value.trim();
    if (!emailVal || !emailVal.includes('@') || !emailVal.includes('.')) {
      this.emailInput.setAttribute('aria-invalid', 'true');
      emailErr.textContent = 'Please enter a valid email address.';
      if (!hasErrors) this.emailInput.focus();
      hasErrors = true;
    } else {
      this.emailInput.setAttribute('aria-invalid', 'false');
      emailErr.textContent = '';
    }

    // Comment Text Validation
    if (!this.commentText.value.trim()) {
      this.commentText.setAttribute('aria-invalid', 'true');
      commentErr.textContent = 'Please write a comment or insight.';
      if (!hasErrors) this.commentText.focus();
      hasErrors = true;
    } else if (this.commentText.value.length > 500) {
      this.commentText.setAttribute('aria-invalid', 'true');
      commentErr.textContent = 'Comment must be under 500 characters.';
      if (!hasErrors) this.commentText.focus();
      hasErrors = true;
    } else {
      this.commentText.setAttribute('aria-invalid', 'false');
      commentErr.textContent = '';
    }

    if (hasErrors) return;

    // Render new comment dynamically into semantic <ol>
    const newAuthor = this.nameInput.value.trim();
    const newBody = this.commentText.value.trim();

    const li = document.createElement('li');
    li.className = 'comment-item';
    li.innerHTML = `
      <article class="comment-card" aria-label="Comment by ${newAuthor}">
        <div class="comment-header">
          <div class="comment-author-info">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80" 
                 alt="Avatar of ${newAuthor}" 
                 class="comment-avatar">
            <div>
              <h4 class="comment-author-name">${newAuthor}</h4>
              <time datetime="${new Date().toISOString()}" class="comment-date">Just now</time>
            </div>
          </div>
          <span class="a11y-verified-tag">Verified Contributor</span>
        </div>
        <div class="comment-body">
          <p>${this._escape(newBody)}</p>
        </div>
      </article>
    `;

    this.commentsList.prepend(li);

    // Update count badge
    const total = this.commentsList.children.length;
    if (this.badge) this.badge.textContent = `${total} Comments`;

    this.form.reset();
    if (this.charCounter) this.charCounter.textContent = '0 / 500 characters';
    if (this.statusFeedback) {
      this.statusFeedback.textContent = '✓ Your comment was published successfully!';
      setTimeout(() => { this.statusFeedback.textContent = ''; }, 4000);
    }

    A11yToast.show('Your accessible contribution has been published.');
  }

  _escape(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
}


/* ============================================================================
   9. ACCESSIBLE MODAL DIALOGS (Strict Focus Trap & Keyboard Navigation)
   ============================================================================ */
class AccessibleModalManager {
  constructor() {
    this.modals = {
      keyboardHelp: document.getElementById('keyboardShortcutsModal'),
      auditDetail: document.getElementById('auditDetailModal')
    };

    this.activeModal = null;
    this.previousFocus = null;

    this.init();
  }

  init() {
    // Open triggers
    const kbBtn1 = document.getElementById('openKeyboardHelpBtn');
    const kbBtn2 = document.getElementById('footerKeyboardHelpBtn');
    const auditBtn = document.getElementById('openAuditModalBtn');

    if (kbBtn1) kbBtn1.addEventListener('click', () => this.open(this.modals.keyboardHelp));
    if (kbBtn2) kbBtn2.addEventListener('click', () => this.open(this.modals.keyboardHelp));
    if (auditBtn) auditBtn.addEventListener('click', () => this.open(this.modals.auditDetail));

    // Global dialog close triggers
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    // Keydown listener for Esc and Tab trapping
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }

  open(modal) {
    if (!modal) return;
    this.previousFocus = document.activeElement;
    this.activeModal = modal;

    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    // Focus the first focusable element inside the modal
    const focusables = this.getFocusableElements(modal);
    if (focusables.length > 0) {
      focusables[0].focus();
    }
  }

  close() {
    if (!this.activeModal) return;

    this.activeModal.hidden = true;
    document.body.style.overflow = '';
    this.activeModal = null;

    // Restore focus
    if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
      this.previousFocus.focus();
    }
  }

  handleKeydown(e) {
    if (!this.activeModal) return;

    // ESC to close
    if (e.key === 'Escape') {
      e.preventDefault();
      this.close();
      return;
    }

    // Tab Focus Trap
    if (e.key === 'Tab') {
      const focusables = this.getFocusableElements(this.activeModal);
      if (focusables.length === 0) return;

      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl || !this.activeModal.contains(document.activeElement)) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl || !this.activeModal.contains(document.activeElement)) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  }

  getFocusableElements(container) {
    const selectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];
    return Array.from(container.querySelectorAll(selectors.join(',')))
      .filter(el => el.offsetWidth > 0 || el.offsetHeight > 0);
  }
}


/* ============================================================================
   10. GLOBAL INITIALIZER & KEYBOARD SHORTCUTS
   ============================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const a11yPrefs = new A11yPreferencesManager();
  const auditSim = new AuditSimulatorManager();
  const speechReader = new SpeechArticleNarrator();
  const progressTracker = new ReadingProgressTracker();
  const spyTOC = new SpyScrollTOC();
  const searchMgr = new AccessibleSearchManager();
  const formMgr = new AccessibleFormManager();
  const modalMgr = new AccessibleModalManager();

  // Active Focus Tracker in Demo Box
  const focusTrackerDisplay = document.getElementById('activeFocusTracker');
  if (focusTrackerDisplay) {
    document.addEventListener('focusin', (e) => {
      const target = e.target;
      let label = target.tagName;
      if (target.id) label += `#${target.id}`;
      else if (target.textContent) label += ` ("${target.textContent.trim().slice(0, 15)}...")`;
      focusTrackerDisplay.textContent = label;
    });
  }

  // Article Bookmark Button
  const bookmarkBtn = document.getElementById('bookmarkArticleBtn');
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener('click', () => {
      const isSaved = bookmarkBtn.getAttribute('aria-pressed') === 'true';
      bookmarkBtn.setAttribute('aria-pressed', isSaved ? 'false' : 'true');
      const textSpan = bookmarkBtn.querySelector('span');
      if (textSpan) textSpan.textContent = isSaved ? 'Save' : 'Saved!';
      A11yToast.show(isSaved ? 'Article removed from saved bookmarks.' : 'Article saved to your personal reading list.');
    });
  }

  // Share Article Link Button
  const shareBtn = document.getElementById('copyShareLinkBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        A11yToast.show('Article hyperlink copied to clipboard.');
      });
    });
  }

  // Global Keyboard Shortcuts (Alt + S, Alt + K, Alt + A, Alt + /)
  document.addEventListener('keydown', (e) => {
    if (e.altKey) {
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        const main = document.getElementById('main-content');
        if (main) main.focus();
        A11yToast.show('Focused Main Content landmark via Alt + S shortcut.');
      } else if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInputField');
        if (searchInput) searchInput.focus();
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        const toolbar = document.getElementById('a11y-toolbar');
        if (toolbar) {
          const firstBtn = toolbar.querySelector('button');
          if (firstBtn) firstBtn.focus();
        }
      } else if (e.key === '/' || e.key === '?') {
        e.preventDefault();
        modalMgr.open(modalMgr.modals.keyboardHelp);
      }
    }
  });

  console.log('%cAura Accessibility Engine Initialized', 'color: #3730a3; font-weight: bold; font-size: 14px;');
  console.log('WCAG 2.2 AAA Conformance Standards Active. Press Alt + / for keyboard hotkeys.');
});
