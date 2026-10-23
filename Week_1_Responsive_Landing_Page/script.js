/**
 * ==========================================================================
 * NovaAI — Interactive JavaScript Controller
 * Clean, Modular Vanilla JavaScript for Responsive Behaviors & Interactions
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ----------------------------------------------------------------------
    // 1. SELECTORS & STATE MANAGEMENT
    // ----------------------------------------------------------------------
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('theme-toggle');
    const billingToggle = document.getElementById('billing-toggle');
    const priceElements = document.querySelectorAll('.price-val');
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    const ctaForm = document.getElementById('cta-form');
    const ctaEmail = document.getElementById('cta-email');
    const formFeedback = document.getElementById('form-feedback');
    const backToTopBtn = document.getElementById('back-to-top');
    const announcementBar = document.querySelector('.announcement-bar');
    const closeAnnouncement = document.getElementById('close-announcement');
    const demoRunBtn = document.getElementById('demo-run-btn');
    const toast = document.getElementById('toast-notification');
    const toastMessage = document.getElementById('toast-message');
    const currentYearSpan = document.getElementById('current-year');

    // Update copyright year dynamically
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // ----------------------------------------------------------------------
    // 2. TOAST NOTIFICATION HELPER
    // ----------------------------------------------------------------------
    let toastTimeout;
    /**
     * Display a floating feedback toast
     * @param {string} message - Text to show in toast
     * @param {string} icon - Optional emoji/symbol
     */
    function showToast(message, icon = '✨') {
        if (!toast || !toastMessage) return;

        const iconSpan = toast.querySelector('.toast-icon');
        if (iconSpan) iconSpan.textContent = icon;
        toastMessage.textContent = message;

        toast.classList.add('active');

        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('active');
        }, 4000);
    }

    // ----------------------------------------------------------------------
    // 3. RESPONSIVE MOBILE NAVIGATION TOGGLE
    // ----------------------------------------------------------------------
    if (menuToggle && navMenu) {
        /**
         * Toggle mobile navigation drawer visibility
         */
        const toggleNavigation = (forcedState) => {
            const isOpen = typeof forcedState === 'boolean' 
                ? forcedState 
                : !navMenu.classList.contains('open');

            menuToggle.classList.toggle('active', isOpen);
            navMenu.classList.toggle('open', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');

            // Prevent background page scrolling when mobile menu is active
            if (window.innerWidth < 768) {
                document.body.style.overflow = isOpen ? 'hidden' : '';
            }
        };

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleNavigation();
        });

        // Close mobile menu when any navigation link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('open')) {
                    toggleNavigation(false);
                }
            });
        });

        // Close mobile drawer on Escape key press for keyboard accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('open')) {
                toggleNavigation(false);
                menuToggle.focus();
            }
        });

        // Auto-close mobile drawer when window resized past tablet breakpoint
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && navMenu.classList.contains('open')) {
                toggleNavigation(false);
            }
        });
    }

    // ----------------------------------------------------------------------
    // 4. THEME SWITCHER (DARK / LIGHT MODE WITH LOCALSTORAGE)
    // ----------------------------------------------------------------------
    if (themeToggle) {
        // Retrieve stored theme preference or fall back to system preference
        const storedTheme = localStorage.getItem('nova_theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'dark');

        document.documentElement.setAttribute('data-theme', initialTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('nova_theme', newTheme);

            showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, newTheme === 'dark' ? '🌙' : '☀️');
        });
    }

    // ----------------------------------------------------------------------
    // 5. STICKY HEADER BLUR & ELEVATION ON SCROLL
    // ----------------------------------------------------------------------
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        // Apply drop shadow and backdrop enhancement after scrolling 20px
        if (header) {
            if (currentScrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Toggle visibility of Back to Top floating button
        if (backToTopBtn) {
            if (currentScrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial run on page load

    // Back to top click handler
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ----------------------------------------------------------------------
    // 6. PRICING BILLING TOGGLE (MONTHLY VS ANNUAL DISCOUNT)
    // ----------------------------------------------------------------------
    if (billingToggle) {
        billingToggle.addEventListener('click', () => {
            const isYearly = billingToggle.getAttribute('aria-checked') === 'true';
            const nextState = !isYearly;

            billingToggle.setAttribute('aria-checked', String(nextState));

            // Animate and update plan price numbers
            priceElements.forEach(priceEl => {
                priceEl.style.opacity = '0';
                setTimeout(() => {
                    const monthlyRate = priceEl.getAttribute('data-monthly');
                    const yearlyRate = priceEl.getAttribute('data-yearly');
                    priceEl.textContent = nextState ? yearlyRate : monthlyRate;
                    priceEl.style.opacity = '1';
                }, 150);
            });

            const durationEls = document.querySelectorAll('.plan-price .duration');
            durationEls.forEach(duration => {
                if (duration.textContent.includes('seat')) {
                    duration.textContent = nextState ? '/seat /mo (billed yearly)' : '/seat /mo';
                } else {
                    duration.textContent = nextState ? '/month (billed yearly)' : '/month';
                }
            });

            showToast(nextState ? 'Yearly pricing applied (20% off!)' : 'Monthly pricing selected', '💰');
        });
    }

    // ----------------------------------------------------------------------
    // 7. INTERACTIVE FAQ ACCORDION
    // ----------------------------------------------------------------------
    if (accordionTriggers.length > 0) {
        accordionTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const parentItem = trigger.closest('.accordion-item');
                const panel = parentItem.querySelector('.accordion-panel');
                const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

                // Optional: Collapse all other open accordion panels for a clean view
                accordionTriggers.forEach(otherTrigger => {
                    if (otherTrigger !== trigger) {
                        const otherItem = otherTrigger.closest('.accordion-item');
                        const otherPanel = otherItem.querySelector('.accordion-panel');
                        otherItem.classList.remove('active');
                        otherTrigger.setAttribute('aria-expanded', 'false');
                        if (otherPanel) otherPanel.setAttribute('hidden', '');
                    }
                });

                // Toggle current item
                if (isExpanded) {
                    parentItem.classList.remove('active');
                    trigger.setAttribute('aria-expanded', 'false');
                    if (panel) panel.setAttribute('hidden', '');
                } else {
                    parentItem.classList.add('active');
                    trigger.setAttribute('aria-expanded', 'true');
                    if (panel) panel.removeAttribute('hidden');
                }
            });
        });
    }

    // ----------------------------------------------------------------------
    // 8. INTERACTIVE DEMO SIMULATION (HERO WINDOW)
    // ----------------------------------------------------------------------
    if (demoRunBtn) {
        demoRunBtn.addEventListener('click', () => {
            const promptInput = document.getElementById('demo-prompt-input');
            const speedupVal = document.getElementById('speedup-val');
            const codeBlock = document.querySelector('.code-preview code');

            demoRunBtn.disabled = true;
            demoRunBtn.textContent = 'Simulating...';

            if (promptInput) {
                promptInput.value = 'Running autonomous agent verification...';
            }

            setTimeout(() => {
                if (codeBlock) {
                    const originalContent = codeBlock.innerHTML;
                    codeBlock.innerHTML = `<span class="code-comment">// NovaAI Agent Autonomous Execution Trace</span>\n<span class="code-keyword">SUCCESS:</span> Analyzed 48 repository modules\n<span class="code-keyword">SUCCESS:</span> Generated 12 Jest unit tests with 100% coverage\n<span class="code-success">&#10003; Verification passed in 84ms! PR #104 ready for merge</span>`;

                    if (speedupVal) speedupVal.textContent = '5.4x';

                    showToast('Simulation complete: PR passed all test suites!', '🚀');

                    setTimeout(() => {
                        codeBlock.innerHTML = originalContent;
                        if (promptInput) {
                            promptInput.value = 'Optimize pipeline and auto-generate responsive unit tests...';
                        }
                        if (speedupVal) speedupVal.textContent = '4.8x';
                        demoRunBtn.disabled = false;
                        demoRunBtn.textContent = 'Run AI';
                    }, 4500);
                }
            }, 800);
        });
    }

    // ----------------------------------------------------------------------
    // 9. FORM VALIDATION & INTERACTIVE NEWSLETTER SUBMISSION
    // ----------------------------------------------------------------------
    if (ctaForm && ctaEmail) {
        ctaForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailVal = ctaEmail.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailVal) {
                setFeedback('Please enter your work email address.', 'error');
                ctaEmail.focus();
                return;
            }

            if (!emailRegex.test(emailVal)) {
                setFeedback('Please provide a valid email format (e.g., name@company.com).', 'error');
                ctaEmail.focus();
                return;
            }

            // Simulate successful API subscription
            const submitBtn = ctaForm.querySelector('.btn-submit');
            const originalBtnHtml = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span>Activating...</span>`;

            setTimeout(() => {
                setFeedback('🎉 Welcome aboard! Check your inbox to confirm your trial access.', 'success');
                showToast('Trial activation email dispatched!', '💌');
                ctaEmail.value = '';
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;

                setTimeout(() => {
                    if (formFeedback) formFeedback.textContent = '';
                }, 6000);
            }, 800);
        });

        function setFeedback(msg, type) {
            if (!formFeedback) return;
            formFeedback.textContent = msg;
            formFeedback.className = `form-feedback ${type}`;
        }
    }

    // ----------------------------------------------------------------------
    // 10. ANNOUNCEMENT BAR DISMISSAL
    // ----------------------------------------------------------------------
    if (closeAnnouncement && announcementBar) {
        closeAnnouncement.addEventListener('click', () => {
            announcementBar.style.display = 'none';
            sessionStorage.setItem('nova_announcement_dismissed', 'true');
        });

        if (sessionStorage.getItem('nova_announcement_dismissed') === 'true') {
            announcementBar.style.display = 'none';
        }
    }

    // ----------------------------------------------------------------------
    // 11. INTERSECTION OBSERVER FOR ACTIVE NAV HIGHLIGHTING
    // ----------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    if ('IntersectionObserver' in window && sections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');
                        if (href === `#${currentId}`) {
                            link.classList.add('active');
                        } else {
                            link.classList.remove('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    }
});
