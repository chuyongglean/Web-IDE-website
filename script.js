/**
 * Web IDE: AI Code Editor - Landing Page Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Mobile Menu Toggle ---
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const menuIcon = mobileMenuToggle ? mobileMenuToggle.querySelector('i') : null;

    const toggleMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.toggle('active');
        
        if (mobileMenu.classList.contains('active')) {
            if (menuIcon) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-xmark');
            }
            document.body.style.overflow = 'hidden'; // Prevent scrolling on body
        } else {
            if (menuIcon) {
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
            }
            document.body.style.overflow = ''; // Restore scrolling
        }
    };

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMenu);
    }

    // Close menu when a link inside it is clicked
    if (mobileLinks.length > 0) {
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    toggleMenu();
                }
            });
        });
    }

    // --- 2. Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for fixed navbar height (approx 80px)
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- 3. Intersection Observer for Scroll-Reveal Animations ---
    /**
     * Web IDE: Advanced Scroll Reveal Engine
     * Implements an IntersectionObserver with a specific threshold to trigger
     * aggressive 'out of space' animations. This handles both the standard
     * fade-in-up and the new directional reveal classes.
     */
    /**
     * Web IDE: High-Performance Animation Engine
     * We use a custom cubic-bezier (0.34, 1.56, 0.64, 1) for an 'Apple-style' overshoot.
     * On high-refresh rate displays (ProMotion), this timing ensures animations feel
     * integrated with the scrolling physics rather than just 'playing' on top.
     */
    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -12% 0px', // Slightly earlier trigger for a snappier arrival
        threshold: 0.15 // 15% visibility triggers the snap to maintain energy
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a small randomized delay for staggered group arrivals if not explicitly set
                if (!entry.target.style.transitionDelay) {
                    const randomDelay = (Math.random() * 0.1).toFixed(2);
                    entry.target.style.transitionDelay = `${randomDelay}s`;
                }

                entry.target.classList.add('is-visible');
                entry.target.classList.add('visible');
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    /**
     * Web IDE: Element Animation Dispatcher
     * Scans the DOM for all elements tagged with reveal classes and registers
     * them with the IntersectionObserver. This supports dynamic content loading
     * and ensures consistent site-wide motion behavior.
     */
    const animatableSelectors = [
        '.reveal-left', 
        '.reveal-right', 
        '.reveal-up', 
        '.reveal-zoom', 
        '.animate-fade-in-up'
    ];

    const registerAnimations = () => {
        const elements = document.querySelectorAll(animatableSelectors.join(','));
        
        if (elements.length > 0) {
            elements.forEach(el => {
                // Only observe if not already visible to prevent redundant triggers
                if (!el.classList.contains('is-visible') && !el.classList.contains('visible')) {
                    revealObserver.observe(el);
                }
            });
        }
    };

    // Initial registration
    registerAnimations();

    /**
     * Web IDE: Dynamic Content Observer
     * Since we might add content or navigate between subpages, we ensure
     * the animation engine re-scans for new animatable elements.
     */
    const mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                registerAnimations();
            }
        });
    });

    mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // --- 4. Marquee Interaction Enhancements ---
    /**
     * Web IDE: Marquee Control Engine
     * Validated IntersectionObserver compatibility: The child element handles the vertical 
     * reveal-up transform, while the parent .marquee-content handles the continuous horizontal
     * CSS translation. This structural isolation prevents animation matrix collisions.
     * 
     * Added JS-based event listeners to guarantee touch-to-pause behavior on mobile
     * devices (iOS Safari often ignores CSS :active without explicit touch handlers).
     */
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        const marqueeContents = document.querySelectorAll('.marquee-content');
        
        const pauseMarquee = () => marqueeContents.forEach(el => el.style.animationPlayState = 'paused');
        const playMarquee = () => marqueeContents.forEach(el => el.style.animationPlayState = 'running');

        // Desktop
        marqueeTrack.addEventListener('mouseenter', pauseMarquee);
        marqueeTrack.addEventListener('mouseleave', playMarquee);
        
        // Mobile / Touch
        marqueeTrack.addEventListener('touchstart', pauseMarquee, { passive: true });
        marqueeTrack.addEventListener('touchend', playMarquee, { passive: true });
        marqueeTrack.addEventListener('touchcancel', playMarquee, { passive: true });
    }

    // --- 5. Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            } else {
                navbar.style.boxShadow = 'none';
                navbar.style.background = 'rgba(255, 255, 255, 0.8)';
            }
        }, { passive: true });
    }
});

// --- 6. PWA: Service Worker Registration ---
// --- 7. Contact Page Interactions ---
/**
 * Handles user interactions on the contact page including clipboard copying,
 * intelligent mailto: URL generation, and focus-detection fallbacks.
 */
const setupContactInteractions = () => {
    const copyBtn = document.querySelector('.copy-email-btn');
    const contactForm = document.getElementById('contactForm');

    /**
     * Clipboard Functionality: Uses modern API with a fallback for legacy mobile browsers.
     */
    if (copyBtn) {
        copyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.getAttribute('data-email');
            const tooltip = this.querySelector('.tooltip');
            
            if (!email) return;

            const showSuccess = () => {
                this.classList.add('success');
                if (tooltip) tooltip.textContent = 'Copied!';
                setTimeout(() => {
                    this.classList.remove('success');
                    if (tooltip) tooltip.textContent = 'Copy';
                }, 2000);
            };

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(email).then(showSuccess).catch(err => {
                    console.error('Clipboard API failed:', err);
                    fallbackCopy(email, showSuccess);
                });
            } else {
                fallbackCopy(email, showSuccess);
            }
        });
    }

    function fallbackCopy(text, callback) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            callback();
        } catch (err) {
            console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textArea);
    }

    /**
     * Form Handling: Constructs a mailto: URL based on user input.
     * Includes focus detection to suggest manual copying if no email client is installed.
     */
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('Name') || 'Developer';
            const userEmail = formData.get('Email') || 'No Email Provided';
            const subjectType = formData.get('Subject') || 'Support';
            const messageBody = formData.get('Body') || '';

            // Construct readable email body
            const formattedBody = `Subject: ${subjectType}\nFrom: ${name}\nEmail: ${userEmail}\n\nMessage:\n${messageBody}`;
            
            const mailtoUrl = `mailto:webideapp@gmail.com?subject=${encodeURIComponent('[Web IDE Support] ' + subjectType)}&body=${encodeURIComponent(formattedBody)}`;

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // UI Feedback: Initiation state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Opening Mail Client...';

            // Focus Detection Logic
            // If the window loses focus, we assume the native mail app has opened successfully.
            let focusLost = false;
            const handleBlur = () => { focusLost = true; };
            window.addEventListener('blur', handleBlur, { once: true });

            // Execute trigger
            window.location.href = mailtoUrl;

            // Analyze outcome after a short threshold (1.2s)
            setTimeout(() => {
                window.removeEventListener('blur', handleBlur);
                
                if (!focusLost) {
                    // NO FOCUS LOSS: Most likely no default email client is configured
                    submitBtn.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> No client found. Try email link below.';
                    submitBtn.style.backgroundColor = '#FFB800'; // Warning Yellow
                    submitBtn.style.color = '#000000';
                    
                    // Suggest manual interaction after failure
                    const emailLink = document.querySelector('.email-link');
                    if (emailLink) {
                        emailLink.style.animation = "pulse 1.5s infinite";
                        setTimeout(() => emailLink.style.animation = "", 4500);
                    }
                } else {
                    // FOCUS LOST: Successful trigger
                    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Mail App Opened';
                    submitBtn.style.backgroundColor = 'var(--color-accent)';
                    submitBtn.style.color = 'var(--color-bg-dark)';
                    this.reset();
                }

                // Reset button appearance after long delay
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.style.color = '';
                }, 5000);
            }, 1200);
        });
    }
};

/**
 * Global Initialization Sequence
 * Ensures all specialized interactions (Contact form, PWA, Animations)
 * are initialized only after the DOM is fully interactive.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize contact-specific logic if on contact page
    if (document.getElementById('contactForm') || document.querySelector('.copy-email-btn')) {
        setupContactInteractions();
    }

    // Log initialization status for debugging in development environments
    console.log('Web IDE: Interaction Engine Initialized');
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('web/sw.js', { scope: '/' })
            .then(reg => console.log('ServiceWorker registration successful with scope:', reg.scope))
            .catch(err => console.log('ServiceWorker registration failed:', err));
    });
}
