document.addEventListener('DOMContentLoaded', () => {

    // ========== HEADER SCROLL EFFECT ==========
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ========== THEME TOGGLE ==========
    const themeBtn = document.getElementById('btn-theme');
    const savedTheme = localStorage.getItem('kumkuat_theme');
    
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        if (themeBtn) themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const isLight = document.documentElement.classList.toggle('light-theme');
            localStorage.setItem('kumkuat_theme', isLight ? 'light' : 'dark');
            themeBtn.innerHTML = isLight 
                ? '<i class="fa-solid fa-sun"></i>' 
                : '<i class="fa-solid fa-moon"></i>';
        });
    }


    // ========== HAMBURGER MENU ==========
    const hamburgerBtn = document.getElementById('btn-hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    let menuOpen = false;

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', () => {
            menuOpen = !menuOpen;
            mobileMenu.classList.toggle('active', menuOpen);
            hamburgerBtn.innerHTML = menuOpen 
                ? '<i class="fa-solid fa-xmark"></i>' 
                : '<i class="fa-solid fa-bars"></i>';
            document.body.style.overflow = menuOpen ? 'hidden' : '';
        });

        // Close menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuOpen = false;
                mobileMenu.classList.remove('active');
                hamburgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
                document.body.style.overflow = '';
            });
        });
    }

    // ========== SEARCH OVERLAY ==========
    const searchOverlay = document.getElementById('search-overlay');
    const btnSearch = document.getElementById('btn-search');
    const btnSearchClose = document.getElementById('btn-search-close');
    const searchInput = document.getElementById('search-input');

    if (btnSearch && searchOverlay) {
        btnSearch.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            setTimeout(() => searchInput && searchInput.focus(), 300);
        });

        btnSearchClose.addEventListener('click', () => {
            searchOverlay.classList.remove('active');
        });

        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) searchOverlay.classList.remove('active');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                searchOverlay.classList.remove('active');
            }
        });
    }

    // ========== HERO CAROUSEL ==========
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const pauseBtn = document.getElementById('hero-pause');
    let currentSlide = 0;
    let isPaused = false;
    let slideInterval;
    const SLIDE_DURATION = 6000;

    function goToSlide(index) {
        // Remove active from all
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => {
            d.classList.remove('active');
            const progress = d.querySelector('.dot-progress');
            if (progress) {
                progress.style.animation = 'none';
                progress.offsetHeight; // reflow
                progress.style.animation = '';
            }
        });

        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');

        // Reset bg transform for Ken Burns
        slides.forEach(s => {
            const bg = s.querySelector('.hero-slide-bg');
            if (bg) bg.style.transform = 'scale(1)';
        });
        const activeBg = slides[currentSlide].querySelector('.hero-slide-bg');
        if (activeBg) {
            activeBg.style.transform = 'scale(1)';
            requestAnimationFrame(() => { activeBg.style.transform = 'scale(1.05)'; });
        }
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function startAutoPlay() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            if (!isPaused) nextSlide();
        }, SLIDE_DURATION);
    }

    // Init
    if (slides.length > 0) {
        goToSlide(0);
        startAutoPlay();
    }

    // Dot click
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const idx = parseInt(dot.dataset.index);
            goToSlide(idx);
            startAutoPlay();
        });
    });

    // Pause/play
    if (pauseBtn) {
        pauseBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            pauseBtn.innerHTML = isPaused 
                ? '<i class="fa-solid fa-play"></i>' 
                : '<i class="fa-solid fa-pause"></i>';
            
            if (isPaused) {
                dots[currentSlide].querySelector('.dot-progress').style.animationPlayState = 'paused';
            } else {
                dots[currentSlide].querySelector('.dot-progress').style.animationPlayState = 'running';
            }
        });
    }

    // ========== SCROLL REVEAL ANIMATION ==========
    const revealElements = document.querySelectorAll('.reveal-up');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ========== STAGGERED ANIMATION FOR GRIDS ==========
    const staggerContainers = document.querySelectorAll('.newswire-grid, .games-showcase-grid, .video-grid');
    
    staggerContainers.forEach(container => {
        const children = container.children;
        Array.from(children).forEach((child, i) => {
            child.style.transitionDelay = `${i * 0.08}s`;
        });
    });

    // ========== PARALLAX ON HERO ==========
    const heroCarousel = document.getElementById('hero-carousel');
    if (heroCarousel) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const heroH = heroCarousel.offsetHeight;
            if (scrolled < heroH) {
                const activeSlide = heroCarousel.querySelector('.hero-slide.active .hero-slide-bg');
                if (activeSlide) {
                    activeSlide.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
                }
            }
        });
    }
    
    // ========== APP MOCKUP SLIDER ==========
    const fmImages = [
        './assets/images/football-mates/screenshots/1.png',
        './assets/images/football-mates/screenshots/2.png',
        './assets/images/football-mates/screenshots/3.png',
        './assets/images/football-mates/screenshots/4.png'
    ];
    let fmIndex = 0;
    
    const fmCenter = document.getElementById('fm-center-img');
    const fmLeft = document.getElementById('fm-left-img');
    const fmRight = document.getElementById('fm-right-img');
    
    const fmPrev = document.getElementById('fm-prev');
    const fmNext = document.getElementById('fm-next');
    
    function updateFMSlider() {
        if(fmCenter && fmLeft && fmRight) {
            const updateSrc = () => {
                fmCenter.src = fmImages[fmIndex];
                fmLeft.src = fmImages[(fmIndex + fmImages.length - 1) % fmImages.length];
                fmRight.src = fmImages[(fmIndex + 1) % fmImages.length];
            };

            if (document.startViewTransition) {
                document.startViewTransition(() => {
                    updateSrc();
                });
            } else {
                updateSrc();
            }
        }
    }
    
    if (fmPrev && fmNext) {
        fmPrev.addEventListener('click', () => {
            fmIndex = (fmIndex + fmImages.length - 1) % fmImages.length;
            updateFMSlider();
        });
        fmNext.addEventListener('click', () => {
            fmIndex = (fmIndex + 1) % fmImages.length;
            updateFMSlider();
        });
    }

});
