/* ============================================
   MAGRISKY — script.js
   ============================================ */

(function () {
    'use strict';

    /* ---------- Header scroll effect ---------- */
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('backToTop');

    function onScroll() {
        const y = window.scrollY;
        if (y > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        if (y > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    /* ---------- Back to top ---------- */
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ---------- Mobile menu ---------- */
    const menuToggle = document.getElementById('menuToggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        const open = navbar.classList.toggle('open');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('open')) {
                navbar.classList.remove('open');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    });

    /* ---------- Active link on scroll ---------- */
    const sections = document.querySelectorAll('section[id]');
    function setActiveLink() {
        const scrollY = window.scrollY + 120;
        sections.forEach((section) => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach((l) => {
                    l.classList.remove('active');
                    if (l.getAttribute('href') === '#' + id) {
                        l.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', setActiveLink, { passive: true });

    /* ---------- Reveal on scroll ---------- */
    const revealEls = document.querySelectorAll(
        '.service-card, .advantage-item, .gallery-item, .about-content, .about-card, .contact-info, .contact-form, .section-header'
    );
    revealEls.forEach((el) => el.classList.add('reveal'));

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
        );
        revealEls.forEach((el) => io.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('visible'));
    }

    /* ---------- Counter animation in hero ---------- */
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10) || 0;
                const duration = 1600;
                const startTime = performance.now();
                function tick(now) {
                    const progress = Math.min((now - startTime) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(target * eased);
                    if (progress < 1) requestAnimationFrame(tick);
                    else el.textContent = target;
                }
                requestAnimationFrame(tick);
                counterObserver.unobserve(el);
            });
        },
        { threshold: 0.5 }
    );
    counters.forEach((c) => counterObserver.observe(c));

    /* ---------- Contact form validation ---------- */
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');

    function showError(id, msg) {
        const errEl = document.getElementById(id);
        if (errEl) errEl.textContent = msg;
    }
    function clearError(id) {
        const errEl = document.getElementById(id);
        if (errEl) errEl.textContent = '';
    }
    function validEmail(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }
    function validPhone(v) {
        return /^[0-9+\-\s()]{6,}$/.test(v);
    }

    function validateField(field) {
        const name = field.name;
        const value = field.value.trim();
        const errId = name + 'Error';
        field.classList.remove('invalid');

        if (field.required && value === '') {
            field.classList.add('invalid');
            showError(errId, 'Ce champ est requis.');
            return false;
        }
        if (name === 'email' && value && !validEmail(value)) {
            field.classList.add('invalid');
            showError(errId, 'Email invalide.');
            return false;
        }
        if (name === 'phone' && value && !validPhone(value)) {
            field.classList.add('invalid');
            showError(errId, 'Téléphone invalide (chiffres, +, -, espaces uniquement).');
            return false;
        }
        if (name === 'message' && value && value.length < 10) {
            field.classList.add('invalid');
            showError(errId, 'Le message doit contenir au moins 10 caractères.');
            return false;
        }
        if (name === 'name' && value && value.length < 2) {
            field.classList.add('invalid');
            showError(errId, 'Nom trop court.');
            return false;
        }
        clearError(errId);
        return true;
    }

    if (form) {
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach((f) => {
            f.addEventListener('blur', () => validateField(f));
            f.addEventListener('input', () => {
                if (f.classList.contains('invalid')) validateField(f);
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let ok = true;
            fields.forEach((f) => {
                if (!validateField(f)) ok = false;
            });
            if (!ok) {
                const firstInvalid = form.querySelector('.invalid');
                if (firstInvalid) firstInvalid.focus();
                return;
            }
            // Simuler l'envoi (à remplacer par un vrai backend)
            successMsg.hidden = false;
            form.reset();
            setTimeout(() => {
                successMsg.hidden = true;
            }, 6000);
            window.scrollTo({
                top: successMsg.offsetTop - 100,
                behavior: 'smooth'
            });
        });
    }

    /* ---------- Footer year ---------- */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
