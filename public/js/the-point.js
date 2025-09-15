    document.addEventListener('DOMContentLoaded', () => {
            // 1. Interactive Header
            const title = document.getElementById('main-title');
            if (title) {
                const text = title.innerText;
                title.innerHTML = '';
                text.split('').forEach(char => {
                    const span = document.createElement('span');
                    span.textContent = char === ' ' ? '\u00A0' : char;
                    title.appendChild(span);
                });
            }

            // 2. Custom Cursor
            const cursor = document.getElementById('custom-cursor');
            if (cursor) {
                window.addEventListener('mousemove', e => {
                    cursor.style.left = e.clientX + 'px';
                    cursor.style.top = e.clientY + 'px';
                });
                document.querySelectorAll('a, button, .poi-card').forEach(el => {
                    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
                    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
                });
            }
            
            // 3. Scroll Follower & Parallax
            const oblio = document.getElementById('oblio');
            const shapes = document.querySelectorAll('.shape');
            const progressIndicator = document.getElementById('scroll-progress-indicator');
            const chapterSections = document.querySelectorAll('.chapter');
            const scrollIndicator = document.getElementById('scroll-down-indicator');

            // 4. Scroll Progress Bar
            const progressBar = document.getElementById('scroll-progress-bar');
            function setupProgressBar() {
                if(progressBar) {
                    // Clear existing markers before recalculating
                    progressBar.querySelectorAll('.progress-marker').forEach(marker => marker.remove());
                    
                    document.querySelectorAll('.chapter').forEach(chapter => {
                        const marker = document.createElement('div');
                        marker.className = 'progress-marker';
                        const chapterTop = chapter.offsetTop;
                        const totalHeight = document.body.scrollHeight - window.innerHeight;
                        if (totalHeight > 0) {
                            marker.style.top = `${(chapterTop / totalHeight) * 100}%`;
                            progressBar.appendChild(marker);
                        }
                    });
                }
            }
            
            // Initial setup
            setupProgressBar();
            // Debounced resize to avoid performance issues
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(setupProgressBar, 100);
            });


            window.addEventListener('scroll', () => {
                const scrollY = window.scrollY;
                const totalHeight = document.body.scrollHeight - window.innerHeight;
                const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;

                if (oblio) {
                    const rotation = scrollY / 5;
                    const scale = 1 + Math.sin(scrollY / 100) * 0.1;
                    oblio.style.transform = `translateY(-50%) rotate(${rotation}deg) scale(${scale})`;
                }
                
                shapes.forEach((shape, index) => {
                    const speed = index === 0 ? 0.2 : 0.1;
                    shape.style.transform = `translateY(${scrollY * speed}px)`;
                });

                if (progressIndicator) {
                    progressIndicator.style.height = `${progress}%`;
                }

                if (scrollIndicator) {
                    if (scrollY > 50) {
                        scrollIndicator.classList.add('is-hidden');
                    } else {
                        scrollIndicator.classList.remove('is-hidden');
                    }
                }
            });

            // 5. Chapter Reveal
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            }, { rootMargin: '0px', threshold: 0.2 });
            document.querySelectorAll('.chapter').forEach(chapter => observer.observe(chapter));

            // 6. Mobile Menu
            const mobileToggle = document.getElementById('mobile-nav-toggle');
            const mobileMenu = document.getElementById('mobile-menu');
            if(mobileToggle && mobileMenu) {
                mobileToggle.addEventListener('click', () => {
                    mobileMenu.classList.toggle('is-open');
                });
                mobileMenu.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => mobileMenu.classList.remove('is-open'));
                });
            }
            
            // 7. Flippable POI Cards
            document.querySelectorAll('.poi-card').forEach(card => {
                card.addEventListener('click', () => {
                    card.classList.toggle('is-flipped');
                });
            });
        });