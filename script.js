// ==================== ENHANCED PORTFOLIO JAVASCRIPT ====================
// Version: 3.0 - Static Hero Image & CV Download
// ==================================================================================

// ==================== PAGE STATE MANAGEMENT ====================
const PageState = {
    isScrolling: false,
    isMobileMenuOpen: false,
    currentSection: 'home',
    isAnimating: false,
    scrollDirection: 'down',
    lastScrollTop: 0,
    performanceMetrics: {
        pageLoadTime: 0,
        totalAnimations: 0
    }
};

// ==================== DYNAMIC ROLE TYPING ANIMATION ====================
const TypingAnimation = {
    roles: [
        "Full-Stack Developer",
        "Native Application Developer",
        "AI/ML Enthusiast",
        "Problem Solver",
        "Tech Innovator"
    ],
    roleIndex: 0,
    charIndex: 0,
    isDeleting: false,
    typingSpeed: 100,
    element: null,

    init() {
        this.element = document.getElementById('dynamicRole');
        if (!this.element) return;
        
        setTimeout(() => this.type(), 500);
    },

    type() {
        const currentRole = this.roles[this.roleIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentRole.substring(0, this.charIndex - 1);
            this.charIndex--;
            this.typingSpeed = 50;
        } else {
            this.element.textContent = currentRole.substring(0, this.charIndex + 1);
            this.charIndex++;
            this.typingSpeed = 100;
        }
        
        if (!this.isDeleting && this.charIndex === currentRole.length) {
            this.typingSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.roleIndex = (this.roleIndex + 1) % this.roles.length;
            this.typingSpeed = 500;
        }
        
        setTimeout(() => this.type(), this.typingSpeed);
    }
};

// ==================== NAVIGATION MANAGEMENT ====================
const NavigationManager = {
    hamburger: null,
    navMenu: null,
    navLinks: null,
    navbar: null,
    lastScrollTop: 0,
    isVisible: true,

    init() {
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.navbar = document.querySelector('.navbar');

        if (!this.hamburger || !this.navMenu) return;

        this.setupEventListeners();
        this.setupScrollBehavior();
    },

    setupEventListeners() {
        // Toggle mobile menu
        this.hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMobileMenu();
        });

        // Close menu when link clicked
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
                this.updateActiveLink(link);
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                this.closeMobileMenu();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    },

    toggleMobileMenu() {
        PageState.isMobileMenuOpen = !PageState.isMobileMenuOpen;
        this.navMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
    },

    closeMobileMenu() {
        PageState.isMobileMenuOpen = false;
        this.navMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
    },

    updateActiveLink(clickedLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
    },

    setupScrollBehavior() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
    },

    handleScroll() {
        const scrollTop = window.scrollY;
        
        // Update scroll direction
        if (scrollTop > PageState.lastScrollTop) {
            PageState.scrollDirection = 'down';
            this.hideNavbar();
        } else {
            PageState.scrollDirection = 'up';
            this.showNavbar();
        }
        
        PageState.lastScrollTop = scrollTop;
        
        // Update active nav link based on section
        this.updateActiveNavByScroll();
    },

    hideNavbar() {
        if (this.isVisible && window.scrollY > 100) {
            this.navbar.style.transform = 'translateY(-100%)';
            this.isVisible = false;
        }
    },

    showNavbar() {
        if (!this.isVisible) {
            this.navbar.style.transform = 'translateY(0)';
            this.isVisible = true;
        }
    },

    updateActiveNavByScroll() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop - 300) {
                currentSection = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        PageState.currentSection = currentSection;
    }
};

// ==================== SMOOTH SCROLLING ====================
const SmoothScrollManager = {
    init() {
        this.setupSmoothScrollLinks();
    },

    setupSmoothScrollLinks() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const target = document.querySelector(targetId);

                if (target) {
                    this.smoothScrollToElement(target);
                    NavigationManager.updateActiveLink(anchor);
                }
            });
        });
    },

    smoothScrollToElement(element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

// ==================== INTERSECTION OBSERVER FOR ANIMATIONS ====================
const AnimationManager = {
    observer: null,
    intersectingElements: new Set(),

    init() {
        this.setupIntersectionObserver();
        this.observeElements();
    },

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                    this.intersectingElements.add(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    },

    observeElements() {
        // Observe all animated elements
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            this.observer.observe(el);
        });
    },

    triggerAnimation(element) {
        const animationType = element.dataset.animation || 'fadeIn';
        element.style.animation = `${animationType} 0.8s ease-out forwards`;
    }
};

// ==================== PARALLAX MANAGER - DISABLED FOR FIXED IMAGE ====================
const ParallaxManager = {
    init() {
        // Parallax effects disabled - hero image is now fixed
        // Keeping manager structure for future use
    }
};

// ==================== CONTACT FORM MANAGER ====================
const ContactFormManager = {
    form: null,
    isSubmitting: false,

    init() {
        this.form = document.getElementById('contactForm');
        if (!this.form) return;
        this.setupFormListeners();
    },

    setupFormListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    },

    handleSubmit(e) {
        e.preventDefault();
        if (this.isSubmitting) return;

        this.isSubmitting = true;
        
        const formData = new FormData(this.form);
        
        // Simulate form submission
        setTimeout(() => {
            NotificationManager.show('✓ Message sent successfully!', 'success');
            this.form.reset();
            this.isSubmitting = false;
        }, 1000);
    }
};

// ==================== SCROLL PROGRESS MANAGER ====================
const ScrollProgressManager = {
    progressBar: null,

    init() {
        this.progressBar = document.querySelector('.scroll-progress-bar');
        if (!this.progressBar) return;
        
        window.addEventListener('scroll', () => this.updateProgress(), { passive: true });
    },

    updateProgress() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / windowHeight) * 100;
        
        if (this.progressBar) {
            this.progressBar.style.width = progress + '%';
        }
    }
};

// ==================== RIPPLE EFFECT MANAGER ====================
const RippleEffectManager = {
    init() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, a');
            if (button && button.classList.contains('ripple-effect')) {
                this.createRipple(e, button);
            }
        });
    },

    createRipple(e, element) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }
};

// ==================== STATS COUNTER MANAGER ====================
const StatsCounterManager = {
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target.querySelector('.stat-number');
                    if (statNumber && !entry.target.dataset.counted) {
                        this.animateCounter(statNumber);
                        entry.target.dataset.counted = 'true';
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.stat-item').forEach(item => observer.observe(item));
    },

    animateCounter(element) {
        const target = parseInt(element.textContent) || 0;
        const duration = 1500;
        const steps = 60;
        const increment = target / steps;
        let current = 0;

        const counter = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(counter);
            } else {
                element.textContent = Math.floor(current);
            }
        }, duration / steps);
    }
};

// ==================== TOOLTIP MANAGER ====================
const TooltipManager = {
    init() {
        document.addEventListener('mouseenter', (e) => {
            const tooltip = e.target.closest('[data-tooltip]');
            if (tooltip) {
                this.showTooltip(tooltip);
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            const tooltip = e.target.closest('[data-tooltip]');
            if (tooltip) {
                this.hideTooltip(tooltip);
            }
        }, true);
    },

    showTooltip(element) {
        const text = element.getAttribute('data-tooltip');
        const tooltipEl = document.createElement('div');
        tooltipEl.className = 'tooltip';
        tooltipEl.textContent = text;
        document.body.appendChild(tooltipEl);

        const rect = element.getBoundingClientRect();
        tooltipEl.style.left = (rect.left + rect.width / 2 - tooltipEl.offsetWidth / 2) + 'px';
        tooltipEl.style.top = (rect.top - tooltipEl.offsetHeight - 10) + 'px';

        element.dataset.tooltipElement = tooltipEl;
    },

    hideTooltip(element) {
        const tooltipEl = element.dataset.tooltipElement;
        if (tooltipEl && tooltipEl.remove) {
            tooltipEl.remove();
        }
    }
};

// ==================== LAZY LOAD MANAGER ====================
const LazyLoadManager = {
    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
        }
    }
};

// ==================== KEYBOARD SHORTCUTS ====================
const KeyboardShortcuts = {
    init() {
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    },

    handleKeyboardShortcuts(e) {
        // Alt + M to toggle mobile menu
        if (e.altKey && e.key === 'm') {
            e.preventDefault();
            NavigationManager.toggleMobileMenu();
        }
    }
};

// ==================== DARK MODE MANAGER ====================
const DarkModeManager = {
    init() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        this.updateTheme(prefersDark.matches);
        prefersDark.addEventListener('change', (e) => this.updateTheme(e.matches));
    },

    updateTheme(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }
};

// ==================== CLIPBOARD MANAGER ====================
const ClipboardManager = {
    init() {
        document.addEventListener('click', (e) => {
            const copyBtn = e.target.closest('[data-copy]');
            if (copyBtn) {
                this.copyToClipboard(copyBtn);
            }
        });
    },

    copyToClipboard(element) {
        const text = element.getAttribute('data-copy');
        navigator.clipboard.writeText(text).then(() => {
            NotificationManager.show('✓ Copied to clipboard!', 'success');
        });
    }
};

// ==================== CV DOWNLOAD MANAGER ====================
const CVDownloadManager = {
    cvFileName: 'Imam_cv.pdf',

    init() {
        // Setup CV download functionality
        console.log('✓ CV Download Manager initialized');
    },

    generateCV() {
        // Download the CV file from the same directory
        const link = document.createElement('a');
        link.href = this.cvFileName;
        link.download = this.cvFileName;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(link);
            NotificationManager.show('✓ CV downloading...', 'success');
        }, 100);
    }
};

// ==================== PERFORMANCE MONITOR ====================
const PerformanceMonitor = {
    init() {
        window.addEventListener('load', () => {
            if (window.performance) {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                PageState.performanceMetrics.pageLoadTime = pageLoadTime;
                console.log(`⏱️ Page Load Time: ${pageLoadTime}ms`);
            }
        });
    }
};

// ==================== ANALYTICS TRACKING ====================
const AnalyticsManager = {
    init() {
        this.trackPageView();
        this.trackClickEvents();
        this.trackFormSubmissions();
    },

    trackPageView() {
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                'page_path': window.location.pathname
            });
        }
    },

    trackClickEvents() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link && link.href && this.isExternalLink(link.href)) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'external_link', {
                        'link_url': link.href
                    });
                }
            }
        });
    },

    trackFormSubmissions() {
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submission', {
                        'form_name': 'contact'
                    });
                }
            });
        }
    },

    isExternalLink(href) {
        return href.includes('http') && !href.includes(window.location.hostname);
    }
};

// ==================== NOTIFICATION SYSTEM ====================
const NotificationManager = {
    queue: [],
    isShowing: false,

    show(message, type = 'info', duration = 3000) {
        const notification = {
            message,
            type,
            duration,
            id: Date.now()
        };

        this.queue.push(notification);
        this.processQueue();
    },

    processQueue() {
        if (this.isShowing || this.queue.length === 0) return;

        this.isShowing = true;
        const notification = this.queue.shift();
        this.displayNotification(notification);
    },

    displayNotification(notification) {
        const container = document.querySelector('.notification-container') || 
                         this.createContainer();

        const element = document.createElement('div');
        element.className = `notification notification-${notification.type}`;
        element.textContent = notification.message;

        container.appendChild(element);

        setTimeout(() => {
            element.remove();
            this.isShowing = false;
            this.processQueue();
        }, notification.duration);
    },

    createContainer() {
        const container = document.createElement('div');
        container.className = 'notification-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '10000';
        document.body.appendChild(container);
        return container;
    }
};

// ==================== PORTFOLIO DATA ====================
const PortfolioData = {
    profile: {
        name: "Al-Imam Uddin",
        title: "Full-Stack Developer & Software Engineer",
        email: "alimamuddin755@gmail.com",
        phone: "+88 01864719755",
        location: "Dhaka, Bangladesh",
        bio: "Fresh Graduate Software Engineer with 2+ years of hands-on full-stack development experience"
    },

    stats: {
        experience: "2+",
        projects: 5,
        achievements: 6,
        commits: 500,
        opensource: 6
    },

    skills: {
        languages: ["Java", "JavaScript", "Python", "C/C++", "PHP", "HTML5", "CSS3"],
        frontend: ["React.js", "Responsive Design", "Data Visualization"],
        backend: ["Spring Boot", "REST APIs", "WebSocket", "Spring Security"],
        databases: ["PostgreSQL", "MySQL", "MongoDB"],
        devops: ["Docker", "CI/CD", "Git", "Jenkins"]
    },

    social: {
        github: "https://github.com/Imam2719",
        linkedin: "https://linkedin.com/in/al-imam-uddin",
        twitter: "https://twitter.com",
        email: "mailto:alimamuddin755@gmail.com"
    }
};

// ==================== MAIN INITIALIZATION ====================
const App = {
    init() {
        console.log('🚀 Initializing Enhanced Portfolio...');

        // Initialize all managers
        TypingAnimation.init();
        NavigationManager.init();
        SmoothScrollManager.init();
        AnimationManager.init();
        ParallexManager.init();
        ContactFormManager.init();
        ScrollProgressManager.init();
        RippleEffectManager.init();
        StatsCounterManager.init();
        TooltipManager.init();
        LazyLoadManager.init();
        KeyboardShortcuts.init();
        DarkModeManager.init();
        ClipboardManager.init();
        CVDownloadManager.init();
        PerformanceMonitor.init();
        AnalyticsManager.init();

        this.logPortfolioInfo();
        this.setupWindowHandlers();
    },

    logPortfolioInfo() {
        console.log('%c✨ Portfolio Loaded Successfully ✨', 'color: #00d4ff; font-size: 16px; font-weight: bold;');
        console.log(`%c👤 ${PortfolioData.profile.name}`, 'color: #0099ff; font-size: 14px;');
        console.log(`%c💼 ${PortfolioData.profile.title}`, 'color: #7c3aed; font-size: 12px;');
        console.log(`%c📧 ${PortfolioData.profile.email}`, 'color: #10b981; font-size: 12px;');
        console.log(`%c📍 ${PortfolioData.profile.location}`, 'color: #f59e0b; font-size: 12px;');
        console.log('%c\n🔗 Social Links:', 'color: #00d4ff; font-size: 12px;');
        console.log(`   GitHub: ${PortfolioData.social.github}`);
        console.log(`   LinkedIn: ${PortfolioData.social.linkedin}`);
    },

    setupWindowHandlers() {
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('👋 See you later!');
            } else {
                console.log('👋 Welcome back!');
            }
        });

        // Handle online/offline
        window.addEventListener('online', () => {
            NotificationManager.show('✓ You are online', 'success');
        });

        window.addEventListener('offline', () => {
            NotificationManager.show('⚠️ You are offline', 'warning');
        });
    },

    handleResize() {
        // Handle responsive behavior
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            NavigationManager.closeMobileMenu();
        }
    }
};

// ==================== GLOBAL CV DOWNLOAD FUNCTION ====================
function downloadCV() {
    CVDownloadManager.generateCV();
}

// ==================== DOM CONTENT LOADED ====================
document.addEventListener('DOMContentLoaded', () => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    App.init();
});

// ==================== WINDOW LOAD ====================
window.addEventListener('load', () => {
    console.log(`✅ Page fully loaded in ${PageState.performanceMetrics.pageLoadTime}ms`);
    
    // Fade out loading screen if exists
    const loader = document.querySelector('.page-loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 300);
    }
});

// ==================== ENHANCED RESEARCH MODAL MANAGEMENT ====================

const ResearchModalManager = {
    papers: [
        {
            title: "Harnessing Machine Learning to Forecast Cardiovascular Disease Risk with Explainable AI",
            abstract: `Cardiovascular disease (CVD) is a leading cause of mortality worldwide, claiming approximately 18 million lives each year. Early diagnosis, effective prognosis, and timely intervention are essential to improving patient outcomes, enhancing quality of life, and reducing the global burden of CVD. With the rapid growth of clinical and epidemiological data, machine learning (ML) methodologies have emerged as powerful tools to transform disease prediction, prognosis, and personalized healthcare. In this work, various machine learning models, including Random Forest, XGBoost, LightGBM, Extra Trees, CatBoost, and a Bagging Ensemble method, were evaluated for their ability to predict cardiovascular outcomes using the Framingham Heart Study dataset. Cross-validation and grid search techniques were employed for robust hyperparameter optimization and model validation. The classification accuracies achieved were 97%,92%, 9 5 %, 9 9 %, 8 9 %, and 9 6 % respectively, with Random Forest, the Extra Trees and Bagging Ensemble demonstrating superior predictive performance across evaluation metrics. To enhance model interpretability and transparency, explainable AI (XAI) techniques, specifically SHAP (SHapley Additive exPlanations) and LIME (Local Interpretable Model-Agnostic Explanations), were utilized to interpret feature importance and model decisions. The findings aim to assist healthcare professionals in treatment planning and early cardiovascular risk assessment. The presented use case highlights the potential of combining machine learning and explainable AI to improve cardiovascular healthcare delivery.`
        },
        {
            title: "Machine Learning for Optimizing Renewable Energy and Solar Grid Efficiency",
            abstract: `Optimizing grid efficiency and guaranteeing stable energy supply depend on accurate estimate of the generation of energy, especially renewable energy. However, traditional forecasting techniques face challenges due to the inherent uncertainty and non-linear patterns in renewable energy production estimation, as it's highly depends on nature. We propose encoder-based model idea for time-series task like solar energy forecasting. Our main proposition is to examine how a simple transformer-encoder-based model perform forecasting renewable energy. Our model uses the transformer architecture's self-attention mechanism to identify intricate temporal patterns and dependencies. The model manages the non-stationary nature of solar energy data by combining residual connections with layer normalization and cyclical encoding for temporal features. We tested the suggested model on a large data set obtained from several solar power plants, showing that it performs better in terms of established error matrices. The outcomes demonstrate the model's superiority over other proposed methods, offering a reliable and expandable solar energy forecasting solution. This work offers a promising framework for incorporating machine learning into smart grid systems and advances data-driven methods to optimize renewable energy consumption and more efficient demand and response (DR) system for the power grid.`
        },
        {
            title: "Sustainable Farming Management System: A Web-Based Agricultural Decision Support Platform for Bangladesh",
            abstract: `Agricultural productivity in Bangladesh faces crit-
ical challenges including knowledge gaps between farmers and
experts, inefficient resource utilization, and lack of data-driven
decision support. This paper presents the Sustainable Farm-
ing Management System (SFMS), a comprehensive web-based
platform that addresses these challenges through systematic
digitalization of agricultural knowledge and expert consultation.
Built using Spring Boot framework with MySQL database, SFMS
implements a dual-actor architecture enabling administrators to
populate agricultural databases while farmers access personal-
ized recommendations. The platform integrates Hugging Face's
GPT-2 API for conversational agricultural assistance, OAuth2
authentication for secure access, and implements NPK-based soil
testing algorithms for precise fertilizer recommendations. Key
solutions include real-time expert consultation systems, weather-
integrated irrigation scheduling, and seasonal crop recommen-
dations based on local conditions. The system runs on port 2024
and provides RESTful APIs for seamless data exchange. Through
features like plant suitability prediction, soil health monitoring,
and pest control guidance, SFMS transforms traditional farm-
ing practices into data-driven operations, bridging the critical
knowledge gap in Bangladesh's agricultural sector.`
        }
    ],

    init() {
        // Add click event for modal overlay to close
        const modalOverlay = document.getElementById('abstractModal');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }

        // Add escape key listener
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    },

    openModal(paperIndex) {
        const paper = this.papers[paperIndex];
        if (!paper) return;

        const modal = document.getElementById('abstractModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalAbstract = document.getElementById('modalAbstract');

        if (modal && modalTitle && modalAbstract) {
            modalTitle.textContent = paper.title;
            modalAbstract.textContent = paper.abstract;

            // Prevent body scroll
            document.body.style.overflow = 'hidden';

            // Show modal with animation
            modal.classList.add('active');
        }
    },

    closeModal() {
        const modal = document.getElementById('abstractModal');
        if (modal) {
            modal.classList.remove('active');

            // Re-enable body scroll
            document.body.style.overflow = '';
        }
    }
};

// Global functions for onclick events
function openAbstractModal(index) {
    ResearchModalManager.openModal(index);
}

function closeAbstractModal() {
    ResearchModalManager.closeModal();
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    ResearchModalManager.init();
});

// ==================== BEFORE UNLOAD ====================
window.addEventListener('beforeunload', () => {
    console.log('📊 Portfolio Statistics:');
    console.log(`   Current Section: ${PageState.currentSection}`);
    console.log(`   Scroll Direction: ${PageState.scrollDirection}`);
});

console.log('✅ Enhanced Portfolio JavaScript Loaded Successfully');