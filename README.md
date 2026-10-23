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
