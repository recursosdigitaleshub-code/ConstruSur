/* ============================================
   ConstruSur Uruguay - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // === HEADER SCROLL ===
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        lastScroll = currentScroll;
    });

    // === MOBILE MENU ===
    const menuToggle = document.getElementById('menuToggle');
    const mainMenu = document.getElementById('mainMenu');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mainMenu.classList.toggle('open');
    });

    // Close menu on link click
    mainMenu.querySelectorAll('.header__menu-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mainMenu.classList.remove('open');
        });
    });

    // === ACTIVE NAV LINK ===
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__menu-link');

    function updateActiveNav() {
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // === SCROLL TO TOP ===
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // === COUNTER ANIMATION ===
    function animateCounters() {
        const counters = document.querySelectorAll('.stats__number[data-count]');

        counters.forEach(counter => {
            if (counter.dataset.animated) return;

            const target = parseInt(counter.dataset.count);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            counter.dataset.animated = 'true';

            const update = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            };

            requestAnimationFrame(update);
        });
    }

    // === INTERSECTION OBSERVER - ANIMATIONS ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });

    // Stats counter observer
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    // === PROJECT TABS ===
    const tabs = document.querySelectorAll('.projects__tab');
    const projectCards = document.querySelectorAll('.project-card');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.tab;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter projects
            projectCards.forEach(card => {
                if (category === 'todos' || card.dataset.category === category) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // === FAQ ACCORDION ===
    const faqQuestions = document.querySelectorAll('.faq__question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = answer.classList.contains('open');

            // Close all
            document.querySelectorAll('.faq__answer').forEach(a => a.classList.remove('open'));
            document.querySelectorAll('.faq__question').forEach(q => q.setAttribute('aria-expanded', 'false'));

            // Toggle current
            if (!isOpen) {
                answer.classList.add('open');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // === CONTACT FORM ===
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    const modalClose = document.getElementById('modalClose');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation
        const nombre = document.getElementById('nombre').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const zona = document.getElementById('zona').value.trim();
        const servicio = document.getElementById('servicio').value;
        const mensaje = document.getElementById('mensaje').value.trim();

        if (!nombre || !telefono || !zona || !servicio || !mensaje) {
            return;
        }

        // Phone validation (Uruguay format)
        const phonePattern = /^[\d\s\+\-]{7,15}$/;
        if (!phonePattern.test(telefono)) {
            const telInput = document.getElementById('telefono');
            telInput.style.borderColor = '#E74C3C';
            telInput.focus();
            setTimeout(() => { telInput.style.borderColor = ''; }, 3000);
            return;
        }

        // Show success modal
        successModal.classList.add('active');
        contactForm.reset();
    });

    // Close modal
    modalClose.addEventListener('click', () => {
        successModal.classList.remove('active');
    });

    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            successModal.classList.remove('active');
        }
    });

    // === SMOOTH SCROLL FOR ANCHOR LINKS ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});

// === FADE IN UP ANIMATION KEYFRAME ===
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
