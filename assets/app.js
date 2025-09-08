let currentPage = 'home';
let isAnimating = false;
let lastScrollTop = 0;

document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initModal();
    initAnimations();
    initStats();
    initScrollEffects();
    initParticleEffects();
    initLoadingAnimations();
});

function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('href').substring(1);
            showPage(targetPage);

            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function showPage(pageId) {
    if (isAnimating || pageId === currentPage) return;

    isAnimating = true;
    const currentPageEl = document.querySelector('.page.active');
    const targetPageEl = document.getElementById(pageId);

    if (!targetPageEl) {
        isAnimating = false;
        return;
    }

    currentPageEl.style.opacity = '0';
    currentPageEl.style.transform = 'translateX(-50px)';

    setTimeout(() => {
        currentPageEl.classList.remove('active');
        targetPageEl.classList.add('active');
        targetPageEl.style.opacity = '0';
        targetPageEl.style.transform = 'translateX(50px)';

        setTimeout(() => {
            targetPageEl.style.opacity = '1';
            targetPageEl.style.transform = 'translateX(0)';
            isAnimating = false;

            triggerPageAnimations(pageId);
        }, 50);
    }, 200);

    currentPage = pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initModal() {
    const modal = document.getElementById('contactModal');
    const closeBtn = document.querySelector('.close');
    const form = document.querySelector('.contact-form');

    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleFormSubmission();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

function openContact() {
    const modal = document.getElementById('contactModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
        const firstInput = modal.querySelector('input');
        if (firstInput) firstInput.focus();
    }, 300);
}

function closeModal() {
    const modal = document.getElementById('contactModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function handleFormSubmission() {
    const form = document.querySelector('.contact-form');
    const formData = new FormData(form);

    showNotification('¡Gracias por tu mensaje! Te contactaremos pronto.', 'success');

    closeModal();
    form.reset();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(45deg, #4CAF50, #45a049)' : 'linear-gradient(45deg, #2196F3, #1976D2)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(notification);

    // ya me dio pereza seguir :c
}