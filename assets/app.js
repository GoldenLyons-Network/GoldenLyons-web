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
    initBuildsGallery();
    initTeamSections();
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
    const closeBtn = modal.querySelector('.close');
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

    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatableElements = document.querySelectorAll('.service-card, .community-card, .service-item, .link-card, .stat-item');

    animatableElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
        el.style.transition = 'al 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        observer.observe(el);
    });
}

function triggerPageAnimations(pageId) {
    const pageElements = document.querySelectorAll(`#${pageId} .service-card, #${pageId} .community-card, #${pageId} .service-item, #${pageId} .link-card`);

    if (pageId === 'builds') {
        initBuildsGallery();
    }

    if (['hosting', 'development', 'builds', 'community'].includes(pageId)) {
        initTeamSection(pageId);
    }

    pageElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('animate-in');
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function initStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach((stat, index) => {
        const target = +stat.getAttribute('data-count');
        const duration = 2000;
        const increment = target / (duration / 50);
        let count = 0;

        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(count);
            }
        }, 16);

        stat.style.animationDelay = `${index * 0.2}s`;
    });
}

function initScrollEffects() {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });
}

function updateScrollEffects() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (currentPage === 'home') {
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroBackground = hero.querySelector('.hero-background');
            if (heroBackground) {
                heroBackground.style.transform = `translateY(${scrollTop * 0.5}px)`;
            }
        }

        const orbs = document.querySelectorAll('.gradient-orb');
        orbs.forEach((orb, index) => {
            const speed = 0.3 + (index * 0.1);
            orb.style.transform = `translate(${scrollTop * speed * 0.1}px, ${scrollTop + speed}px) scale(${1 + scrollTop * 0.0001})`;
        });
    }

    ticking = false;
}

function initParticleEffects() {
    createFloatingPartciles();
    initMouseTracker();
}

function createFloatingPartciles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(255, 215, 0, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: floatUp ${Math.random() * 10 * 10}s linear infinite;
            animation-delay: ${Math.random() * 10}s;
            pointer-events: none;
        `;

        hero.appendChild(particle);
    }
}

function initMouseTracker() {
    document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const xPercent = (clientX / innerWidth) * 100;
        const yPercent = (clientY / innerHeight) * 100;

        const hero = document.querySelector('.hero');
        if (hero && currentPage === 'home') {
            const orbs = document.querySelectorAll('.gradient-orb');
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.02;
                orb.style.transform = `translate(${(xPercent - 50) * speed}px, ${(yPercent - 50) * speed}px) scale(${1 + (xPercent + yPercent) * 0.0001})`;
            });
        }
    });
}

function initLoadingAnimations() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';

        setTimeout(() => {
            heroContent.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 500);
    } 

    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 1000 + index * 150);
    });
}

function scrollToServices() {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const ripple = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            btn.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

document.addEventListener('click', () => {
    if (event.target.matches('a[href^="#"]')) {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
});

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (currentPage === 'home') {
            const hero = document.querySelector('.hero');
            if (hero) {
                const particles = hero.querySelectorAll('.floating-particle');
                particles.forEach(particle => {
                    particles.style.left = Math.random() * 100 + '%';
                    particles.style.top = Math.random() * 100 + '%';
                });
            }
        }
    }, 250);
});

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }

    @keyframes floatUp {
        from {
            opacity: 1;
            transform: translateY(100vh) rotate(0deg);
        }

        10% {
            opacity: 1;
        }
        
        90% {
            opacity: 1;
        }
        to {
            opacity: 0;
            transform: translateY(-100px) rotate(360deg);
        }
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
    }

    .floating-particle {
        z-index: 1;
    }

    .animate-in {
        animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(style);

window.addEventListener('error', (e) => {
    console.error('An error occurred while loading the page.', e.error);
});

console.log('GoldenLyons website loaded successfully.');

const buildsData = [
    {
        id: 1,
        src: "assets/images/builds_galery/sonnybuilding_3697606792822677663s2025-9-8-19.59.910_story (1).webp",
        title: "Dungeon Japonesa",
        description: "Impresionante dungeon con estilo japones",
        category: "japan"
    },
    {
        id: 2,
        src: "assets/images/builds_galery/sonnybuilding_3699974073259261421s2025-9-8-19.59.735_story (1).webp",
        title: "Doomreach",
        description: "El guardian que lo dio todo para proteger Doomreach",
        category: "art"
    },
    {
        id: 3,
        src: "assets/images/builds_galery/sonnybuilding_3707203666116227847s2025-9-8-19.58.571_story (1).webp",
        title: "Mina PvP",
        description: "Mina PvP con diseño artístico y funcional, ambientado en un bosque antiguo",
        category: "art"
    },
    {
        id: 4,
        src: "assets/images/builds_galery/sonnybuilding_449873478_843625661040409_140798670910144250_n.webp",
        title: "Dominio de la inteligencia artificial (KOTH)",
        description: "Diseño funcional y estético",
        category: "cyberpunk"
    },
    {
        id: 5,
        src: "assets/images/builds_galery/sonnybuilding_447595139_370299119397427_1844663276953019748_n.webp",
        title: "Dominio de Mjolnir (KOTH)",
        description: "Diseño funcional y estético",
        category: "nordic"
    },
    {
        id: 6,
        src: "assets/images/builds_galery/sonnybuilding_445701563_440033838646079_1149062904118469741_n.webp",
        title: "Puerto de los Titanes Hundidos",
        description: "Diseño funcional y estético",
        category: "chinese"
    },
    {
        id: 7,
        src: "assets/images/builds_galery/sonnybuilding_446103786_411250735070932_3751586677511358294_n.webp",
        title: "Santuario de Jade",
        description: "Santuario repleto de tesoros custodiado por un rey ambicioso",
        category: "art"
    },
    {
        id: 8,
        src: "assets/images/builds_galery/sonnybuilding_387265678_1622834588126914_3819432723491743319_n.webp",
        title: "Palacio del Izun",
        description: "Un colosal templo oriental custodiado por montañas, símbolo de armonía y poder ancestral",
        category: "japan"
    },
    {
        id: 9,
        src: "assets/images/builds_galery/sonnybuilding_294169396_618290282825010_211628421592229299_n.jpg",
        title: "Molino del Lago",
        description: "Granja tradicional con un molino y torres que vigilan el agua cercana",
        category: "mediaeval"
    },
    {
        id: 10,
        src: "assets/images/builds_galery/sonnybuilding_294169396_618290282825010_211628421592229299_n.jpg",
        title: "El glorioso palacio de Epoch",
        description: "Ciudad costera con un palacio y una imponente estatua de un guerrero espartano, simbolizando fuerza y protección.",
        category: "greek"
    }
];

function initBuildsGallery() {
    const galleryContainer = document.getElementById('buildsGallery');

    if (!galleryContainer) return;

    galleryContainer.innerHTML = '';

    buildsData.forEach(build => {
        const galleryItem = document.createElement('div');
        galleryItem.className = `gallery-item ${build.category}`;
        galleryItem.dataset.category = build.category;

        galleryItem.innerHTML = `
            <img src="${build.src}" alt="${build.title}" loading="lazy">
            <div class="gallery-overlay">
                <h3 class="gallery-title">${build.title}</h3>
                <p class="gallery-desc">${build.description}</p>
            </div>
        `;

        galleryItem.addEventListener('click', () => openImageModal(build.id));
        galleryContainer.appendChild(galleryItem);
    });

    initGalleryFilters();
}

function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));

            button.classList.add('active');

            const filter = button.dataset.filter;
            filterGallery(filter);
        });
    });
}

function filterGallery(category) {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0) scale(1)';
            }, 50);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px) scale(0.95)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

function openImageModal(imageId) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const caption = document.getElementById('modalCaption');

    const build = buildsData.find(item => item.id === imageId);

    if (build) {
        modal.style.display = 'block';
        modalImg.src = build.src;
        modalImg.alt = build.title;

        caption.innerHTML = `
            <h3>${build.title}</h3>
            <p>${build.description}</p>
        `;

        document.body.style.overflow = 'hidden';
        setupModalNavigation(imageId);
    }
}

function setupModalNavigation(currentId) {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const closeBtn = document.querySelector('.close-modal');
    const modal = document.getElementById('imageModal');

    const currentIndex = buildsData.findIndex(item => item.id === currentId);

    const navigateTo = (direction) => {
        let newIndex;

        if (direction === 'next') {
            newIndex = (currentIndex + 1) % buildsData.length;
        } else {
            newIndex = (currentIndex - 1 + buildsData.length) % buildsData.length;
        }

        openImageModal(buildsData[newIndex].id);
    };

    prevBtn.onclick = () => navigateTo('prev');
    nextBtn.onclick = () => navigateTo('next');

    closeBtn.onclick = closeImageModal;

    modal.onclick = (e) => {
        if (e.target === modal) {
            closeImageModal();
        }
    };

    const keyHandler = (e) => {
        if (e.key === 'Escape') {
            closeImageModal();
        } else if (e.key === 'ArrowLeft') {
            navigateTo('prev');
        } else if (e.key === 'ArrowRight') {
            navigateTo('next');
        }
    };

    document.addEventListener('keydown', keyHandler);

    modal._keyHandler = keyHandler;
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    if (modal._keyHandler) {
        document.removeEventListener('keydown', modal._keyHandler);
        delete modal._keyHandler;
    }
}

function handleKeyNavigation(e) {
    if (e.key === 'Escape') {
        closeImageModal();
    } else if (e.key === 'ArrowLeft') {
        document.querySelector('.prev-btn').click();
    } else if (e.key === 'ArrowRight') {
        document.querySelector('.next-btn').click();
    }
}

const teamData = {
    hosting: [
        {
            id: "hosting_1",
            name: "7Str1kes",
            role: "Especialista en Infraestructura & Redes",
            avatar: "assets/images/team/hosting/hosting-7str1kes.png",
            image: "assets/images/team/hosting/hosting-7str1kes.png",
            description: "",
            skills: ["Servidores", "Redes", "Seguridad", "Optimización", "Instalaciones"]
        }
    ],
    development: [
        {
            id: "dev_1",
            name: "7Str1kes",
            role: "Jefe de Desarrollo",
            avatar: "assets/images/team/development/development-7str1kes.png",
            image: "assets/images/team/development/development-7str1kes.png",
            description: "",
            skills: ["Java", "JavaScript", "Python", "Bases de Datos"]
        }
    ],
    builds: [
        {
            id: "builder_1",
            name: "SonnyBuilding",
            role: "Jefe de Construcción",
            avatar: "assets/images/team/builds/builds-sonnybuilding.png",
            image: "assets/images/team/builds/builds-sonnybuilding.png",
            description: "",
            skills: ["Medieval", "Detalles", "FAWE", "Estructuras", "Arceon", "VoxelSniper"]
        }
    ],
    community: [
        {
            id: "community_1",
            name: "xLolee",
            role: "Jefa de Comunidad & Diseño",
            avatar: "assets/images/team/community/community-xlolee.png",
            image: "assets/images/team/community/community-xlolee.png",
            description: "",
            skills: ["Photoshop", "Diseño", "Branding", "Publicidad"]
        }
    ]
};

function initTeamSections() {
    initTeamSection('hosting');
    initTeamSection('development');
    initTeamSection('builds');
    initTeamSection('community');
}

function initTeamSection(section) {
    const teamSection = document.querySelector(`#${section} .team-grid`);

    if (!teamSection) return;

    const members = teamData[section];

    if (!members || members.length === 0) return;

    teamSection.innerHTML = '';

    members.forEach(member => {
        const memberElement = document.createElement('div');
        memberElement.className = 'team-member';
        memberElement.dataset.member = member.id;

        memberElement.innerHTML = `
            <div class="member-avatar">
                <img src="${member.avatar}" alt="${member.name}">
            </div>
            <div class="member-info">
                <h3>${member.name}</h3>
                <p>${member.role}</p>
            </div>
        `;

        memberElement.addEventListener('click', () => openMemberModal(member));
        teamSection.appendChild(memberElement);
    });
}

function openMemberModal(member) {
    const modal = document.getElementById('memberModal');
    const modalImg = document.getElementById('modalMemberImg');
    const modalName = document.getElementById('modalMemberName');
    const modalRole = document.getElementById('modalMemberRole');
    const modalDesc = document.getElementById('modalMemberDescription');
    const modalSkills = document.getElementById('modalMemberSkills');

    if (!modal || !modalImg) return;

    modalImg.src = member.image;
    modalImg.alt = member.name;
    modalName.textContent = member.name;
    modalRole.textContent = member.role;
    modalDesc.textContent = member.description;

    modalSkills.innerHTML = '';
    if (member.skills && member.skills.length > 0) {
        member.skills.forEach(skill => {
            const skillElement = document.createElement('span');
            skillElement.className = 'skill-tag';
            skillElement.textContent = skill;
            modalSkills.appendChild(skillElement);
        });
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => closeMemberModal();

    modal.onclick = (e) => {
        if (e.target === modal) {
            closeMemberModal();
        }
    };

    document.addEventListener('keydown', handleMemberModalKeydown);
}

function closeMemberModal() {
    const modal = document.getElementById('memberModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.removeEventListener('keydown', handleMemberModalKeydown);
}

function handleMemberModalKeydown(e) {
    if (e.key === 'Escape') {
        closeMemberModal();
    }
}

