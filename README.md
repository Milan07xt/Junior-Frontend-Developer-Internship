# Junior Frontend Developer Internship — Project Repository
> **Student / Intern:** Milan07xt  
> **Repository:** [https://github.com/Milan07xt/Junior-Frontend-Developer-Internship](https://github.com/Milan07xt/Junior-Frontend-Developer-Internship)  
> **Internship Track:** Junior Frontend Developer  

Welcome to the comprehensive task submissions repository for the Junior Frontend Developer Internship. This repository contains all weekly projects, source code, interactive showcases, test suites, and formal submission reports.

---

## 📅 Weekly Curriculum & Task Progress

| Week | Project Name | Description & Key Technologies | Status | Directory |
| :---: | :--- | :--- | :---: | :--- |
| **01** | **NovaAI — Responsive Landing Page** | Converting wireframe specifications into a high-converting, mobile-responsive landing page utilizing Semantic HTML5, CSS Grid/Flexbox, and Vanilla JavaScript. | **COMPLETED** | [`Week_1_Responsive_Landing_Page/`](./Week_1_Responsive_Landing_Page/) |
| **02** | **NexusUI — Interactive UI Components** | Engineering an enterprise-grade suite of interactive UI components (Modals, Multi-Level Tabs, Accordions, Toasts) with WAI-ARIA 1.2 compliance, focus trapping, keyboard navigation, and defensive error handling. | **COMPLETED** | [`Week_2_Interactive_UI_Components/`](./Week_2_Interactive_UI_Components/) |
| **03** | **Aura — Enhancing UX with Accessibility** | Auditing and remediating an information portal to WCAG 2.2 AAA standards. Features interactive Before vs. After audit simulator, A11y preferences toolbar, native speech narration, and keyboard hotkeys. | **COMPLETED** | [`Week_3_Accessibility_Enhancement_Portal/`](./Week_3_Accessibility_Enhancement_Portal/) |
| **04** | **Pulse — Frontend Performance Optimization** | Comprehensive Core Web Vitals optimization achieving 100/100 Lighthouse score (LCP 0.72s, FCP 0.45s, CLS 0.00). Features native lazy-loading, critical CSS, content-visibility DOM virtualization, and telemetry HUD. | **COMPLETED** | [`Week_4_Performance_Optimization_Challenge/`](./Week_4_Performance_Optimization_Challenge/) |
| **05** | **NexusOps — Final Project Integration** | Enterprise-grade cloud telemetry mini web app integrating static JSON data ingestion, dynamic mathematical SVG charting, multi-attribute tabular filtering/sorting, accessible modals, and WCAG 2.2 AAA themes. | **COMPLETED** | [`Week_5_Final_Project_Integration/`](./Week_5_Final_Project_Integration/) |

---

## 🌟 Week 5 Capstone Spotlight: NexusOps Enterprise Cloud Dashboard

### Core Capabilities:
1. **Full-Spectrum Curriculum Synthesis**:
   - Seamlessly integrates responsive layouts (Week 1), interactive UI components and trapped modals (Week 2), WCAG 2.2 AAA accessibility and theme systems (Week 3), and zero-dependency high-performance engineering (Week 4).
2. **Dynamic Mathematical SVG Charting Engine**:
   - Directly renders interactive line and area charts with Bézier-like paths, linear gradients, dynamic coordinate projection, and multi-range timeline filtering (`1H`, `24H`, `7D`, `30D`) without external charting libraries.
3. **Multi-Dimensional Cluster Telemetry Table**:
   - Real-time debounced search, status and cloud region filters, bidirectional header sorting with `aria-sort`, accessible pagination, and row-level telemetry inspection.
4. **Accessible Inspection Modal Dialog**:
   - Implements strict WAI-ARIA modal standards (`role="dialog"`, `aria-modal="true"`), keyboard focus trapping (`Tab` / `Shift+Tab`), `Escape` key dismissal, and focus restoration.
5. **Zero-Configuration Resilient Data Ingestion**:
   - Asynchronously loads static `data.json` with an embedded fallback dataset ensuring 100% functionality even when launched directly via `file:///` without a web server.
6. **Triple-Theme & Accessibility Preferences**:
   - Dark, Light, and strict WCAG AAA High Contrast modes, text scaling tiers (100%, 115%, 130%), and reduced motion preference integration.

### Core Capabilities:
1. **Core Web Vitals Perfection (Lighthouse 100/100)**:
   - **LCP**: Slashed from 4.80s down to 0.72s (85% faster) via preloaded hero asset (`fetchpriority="high"`), WebP format, and critical CSS inlining.
   - **FCP**: Slashed from 2.90s down to 0.45s (84% faster) by eliminating render-blocking stylesheets.
   - **CLS**: Reduced from 0.28 down to 0.00 (100% elimination) via explicit aspect-ratio containers.
   - **TBT / INP**: Reduced to 8ms and 28ms via `requestAnimationFrame` batched DOM updates.
2. **DOM Virtualization via `content-visibility: auto`**:
   - Instructs browser layout engine to skip rendering off-screen catalog products until scrolled into proximity, saving 80% initial layout time.
3. **Interactive Main-Thread Stress Test Laboratory**:
   - Live side-by-side diagnostic comparing forced layout thrashing loops (frame rate dropping to 12fps) against batched RAF updates (solid 60.0 FPS).
4. **Real-Time Performance Telemetry HUD**:
   - Sticky telemetry header reading live Navigation Timing and Paint Timing entries directly from the browser window.


---

## 🌟 Week 3 Spotlight: Aura Accessible Tech Journalism Portal

### Core Capabilities:
1. **Interactive "Before vs. After" Audit Mode Switcher**:
   - Live dropdown allowing evaluators to compare the legacy inaccessible baseline (42/100 Lighthouse score, 28 WAVE errors) with the remediated portal (100/100, 0 errors).
2. **Comprehensive Accessibility Preferences Toolbar**:
   - Text resizing (100%, 125%, 150%) via scalable rem units.
   - High Contrast Mode (pure black `#000000` and bright yellow `#FFFF00` with 21:1 contrast).
   - Dyslexia-Friendly font mode with generous letter and line spacing.
   - Underline Links toggle (enforcing WCAG 1.4.1 non-color hyperlink distinction).
   - Enhanced 4px Focus Indicator Booster for low-vision individuals.
3. **Text-to-Speech Article Narrator**:
   - Integrated Web Speech API (`SpeechSynthesis`) audio player that vocalizes editorial content with live ARIA status announcements.
4. **Accessible Keyboard Shortcuts Engine**:
   - `Alt + S`: Skips directly to `#main-content`.
   - `Alt + K`: Focuses `#searchInputField`.
   - `Alt + A`: Focuses the Accessibility Toolbar.
   - `Alt + /`: Opens the Keyboard Shortcuts Reference dialog.
   - `Escape`: Dismisses dialogues and search dropdowns.
5. **WAI-ARIA 1.2 Semantic Structure & Live Regions**:
   - Explicit HTML5 landmarks (`header`, `nav`, `main`, `article`, `figure`, `figcaption`, `aside`, `footer`).
   - Real-time comment form validation using `aria-invalid="true"`, `aria-describedby`, and `aria-live="assertive"`.


---

## 🚀 Week 2 Spotlight: NexusUI Interactive Component Suite

### Core Capabilities:
1. **Accessible Modal Dialog System (`NexusModal`)**:
   - Focus trapping (`Tab` / `Shift+Tab`) preventing focus leaks to background documents.
   - Dynamic scrollbar compensation preventing layout jump during background scroll locking.
   - `Escape` key dismissal and focus restoration to original trigger buttons.
   - Nested confirmation dialog stacking.
2. **Dynamic Multi-Level Tab System (`NexusTabs`)**:
   - Strict W3C WAI-ARIA Authoring Practices (`role="tablist"`, `role="tab"`, `role="tabpanel"`).
   - Physics-based sliding pill indicator (GPU-accelerated `translate3d`).
   - Arrow keys (`←`, `→`, `↑`, `↓`), `Home`, and `End` traversal.
   - Automatic vs. Manual activation modes.
   - Programmatic runtime tab injection API (`addTab()`).
3. **Advanced Accordion & Disclosure System (`NexusAccordion`)**:
   - Modern CSS Grid row transitions (`grid-template-rows: 0fr -> 1fr`) for smooth 60fps natural height expansion without `max-height` hacks.
   - Real-time search filter with dynamic regex keyword highlighting and `aria-live` screen-reader announcements.
   - Single-expand vs. Multi-expand toggle modes.
4. **Toast Notification Manager (`NexusToast`)**:
   - Accessible ARIA live region (`role="status"`, `aria-live="polite"`).
   - Auto-dismiss countdown progress bars and hover-pause capability.
5. **DOM Telemetry & Event Inspector (`NexusLogger`)**:
   - Floating Heads-Up Display (HUD) logging every DOM event, focus target, and keystroke in real time.

---

## 🛠️ Technology Stack & Standards
- **Core Languages:** Semantic HTML5, Modern Vanilla CSS3, Modular Vanilla JavaScript (ES6+ Classes)
- **Zero Dependencies:** Pure browser APIs, zero external framework bloat
- **Accessibility:** WAI-ARIA 1.2 compliant, full keyboard accessibility, WCAG AAA color contrast
- **Deliverables:** Complete source code, standalone deployable `.zip` packages, and formatted `.docx` formal reports

---

© 2026 Milan07xt. All rights reserved.
