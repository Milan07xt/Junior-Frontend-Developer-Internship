# NovaAI — Next-Generation Responsive Landing Page
> **Junior Frontend Developer Internship — Week 1 Task: Responsive Landing Page Development**

![NovaAI Preview](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Project Overview
**NovaAI** is a high-converting, modern, and fully responsive landing page built from scratch for an advanced collaborative AI engineering workspace. This project transforms a wireframe concept into an interactive, portfolio-grade web experience adhering strictly to modern web standards, semantic HTML5, cutting-edge CSS layout techniques (Flexbox & CSS Grid), and lightweight Vanilla JavaScript.

---

## 🚀 Key Features

### 1. Semantic & Accessible Architecture
- **HTML5 Landmarks**: Structured with `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<aside>`, and `<footer>`.
- **Accessibility (a11y)**: Includes keyboard skip links (`#main-content`), ARIA attributes (`aria-expanded`, `aria-label`, `aria-controls`, `aria-live`), and WCAG AAA compliant color contrast.

### 2. Modern Responsive CSS Engine
- **Layouts**: Combination of **CSS Grid** for multi-column dashboards/features and **Flexbox** for alignments, badges, and headers.
- **CSS Custom Properties (Tokens)**: Centralized design system with interchangeable palettes for **Dark** and **Light** modes.
- **Fluid Typography**: Dynamic scaling via `clamp()` across all display resolutions.
- **Micro-Interactions**: Hover lifts, subtle border gradient glows, button ripples, and animated floating badges.

### 3. Interactive Vanilla JavaScript Controller
- **Responsive Mobile Navigation**: Animated hamburger toggle opening a full-height slide drawer with focus trap and auto-close behaviors.
- **Theme Switcher**: Instant Dark / Light mode toggle with persistent state via `localStorage` and system color scheme detection.
- **Interactive Billing Switcher**: Monthly vs. Annual toggle with animated price switches and a 20% discount badge.
- **Interactive Hero Simulation**: Live simulated AI task execution inside the browser mockup.
- **Interactive FAQ Accordion**: Smoothly expanding and collapsing Q&A panels.
- **Newsletter / Trial Form Validation**: Real-time client-side email format validation with interactive feedback toasts.
- **Sticky Blur Header & Back to Top**: Smooth scrolling behaviors with observer-based active nav tracking.

---

## 📐 Wireframe Layout Hierarchy

```
+-------------------------------------------------------------------------+
| [ANNOUNCEMENT BAR] New v3.2 Autonomous Agents Are Live! [x]             |
+-------------------------------------------------------------------------+
| [LOGO: NovaAI]    Features   How-It-Works   Pricing   FAQ   [Theme] [CTA]|
+-------------------------------------------------------------------------+
|                                                                         |
|  [HERO SECTION]                                                         |
|  H1: Supercharge your team's workflow with Unified AI                   |
|  Subtext: Transform complex engineering workflows into effortless...    |
|  [Get Started Free (CTA)]  [Live Product Tour]                          |
|  Social Proof: ★★★★★ 4.9/5 (85,000+ teams)                              |
|                                                                         |
|  [HERO MOCKUP] Interactive Code / Agent Deployment Console             |
|                                                                         |
+-------------------------------------------------------------------------+
|  [METRICS STRIP] 99.98% Uptime | 4.8x Velocity | 150+ Tools | 85k Devs  |
+-------------------------------------------------------------------------+
|  [FEATURE HIGHLIGHTS (3x2 Grid)]                                        |
|  [Autonomous Agents]  [Collaborative Canvas]  [Zero-Knowledge Vault]   |
|  [Semantic Code Search][Adaptive Routing]     [Automated Refactoring]   |
+-------------------------------------------------------------------------+
|  [HOW IT WORKS] 01 Connect Repo -> 02 Configure Goal -> 03 Ship Rapidly|
+-------------------------------------------------------------------------+
|  [TESTIMONIALS] VP Engineering | CTO Vertex Labs | Head of Product     |
+-------------------------------------------------------------------------+
|  [PRICING CARDS] Monthly / Yearly (Save 20%) Switch                     |
|  Starter ($0) | Pro ($29/mo - Popular) | Enterprise ($79/mo)           |
+-------------------------------------------------------------------------+
|  [FAQ ACCORDION] Expandable questions on privacy, CI/CD, pricing       |
+-------------------------------------------------------------------------+
|  [CTA BANNER] Ready to transform workflow? [Email Input] [Start Trial]  |
+-------------------------------------------------------------------------+
|  [FOOTER] Brand & Bio | Product | Resources | Company | Legal | © 2026  |
+-------------------------------------------------------------------------+
```

---

## 📱 Responsive Breakpoint Strategy

| Breakpoint | Target Screen Type | Layout Adjustments |
| :--- | :--- | :--- |
| **> 1200px** | Desktop Displays | Full 2-column hero, 3-column features, 3-column pricing, 4-column metrics |
| **992px - 1199px** | Small Desktop / Laptops | Slightly reduced padding and font sizes, compact grid gaps |
| **768px - 991px** | Tablets (iPad portrait/landscape)| 1-column centered hero, 2-column features, stacked step cards |
| **< 768px** | Mobile Devices | Hamburger slide-out drawer, 1-column features/pricing, stacked form inputs |
| **< 480px** | Small Mobile Handsets | Fluid heading sizes (`clamp()`), full-width CTA buttons, simplified banner |

---

## 📂 File Structure

```
├── index.html       # Semantic HTML5 page structure
├── style.css        # Vanilla CSS3 styling, design tokens & media queries
├── script.js        # Vanilla JS interactive controller & state management
├── README.md        # Comprehensive documentation
└── Week_1_Responsive_Landing_Page_Report.docx # Formal internship submission report
```

---

## 💻 How to Run Locally

No external dependencies, Node build steps, or package installations are required!

1. **Direct Browser Execution**:
   Double click `index.html` to open it in any web browser (Chrome, Edge, Firefox, Safari).

2. **Using a Local Development Server**:
   ```bash
   # Using Python
   python -m http.server 3000

   # Or using Node.js npx serve
   npx serve .
   ```
   Open `http://localhost:3000` in your web browser.

---

## 🧪 Browser Compatibility

- Google Chrome (Desktop & Mobile)
- Apple Safari (macOS & iOS)
- Mozilla Firefox
- Microsoft Edge
- Opera / Brave

---

## 📄 License
This project is submitted for the Week 1 Internship Task. Open source under the MIT License.
