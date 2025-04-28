document.addEventListener('DOMContentLoaded', function () {
    const a = 350;
    const b = 200;
    const centerX = 450;
    const centerY = 250;
    let angle = 0; // Ángulo inicial

    const planets = [
        { container: document.getElementById('planet1-container'), offset: 0 },
        { container: document.getElementById('planet2-container'), offset: Math.PI / 2 },
        { container: document.getElementById('planet3-container'), offset: Math.PI },
        { container: document.getElementById('planet4-container'), offset: (3 * Math.PI) / 2 }
    ];

    function animateOrbit() {
        angle += 0.01;

        planets.forEach(planet => {
            const x = centerX + a * Math.cos(angle + planet.offset);
            const y = centerY + b * Math.sin(angle + planet.offset);

            planet.container.style.left = `${x - 50}px`; // -50 para centrar horizontal
            planet.container.style.top = `${y - 80}px`;  // -80 para centrar vertical
        });

        requestAnimationFrame(animateOrbit);
    }

    const navItems = document.querySelectorAll('.nav-item, .submenu-item');
    const actionsButton = document.querySelector('.nav-item[data-target="acciones"]'); // Botón "Acciones"
    const bonosButton = document.querySelector('.nav-item[data-target="bonos"]'); // Botón "Bonos"

    navItems.forEach(item => {
        item.addEventListener('click', function (e) {
            if (this === actionsButton || this === bonosButton) {
                e.preventDefault();
                document.querySelectorAll('.submenu').forEach(menu => {
                    menu.style.display = 'none';
                });

                const submenu = this.nextElementSibling;
                if (submenu && submenu.classList.contains('submenu')) {
                    submenu.style.display = 'block';
                }
                return;
            }

            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');

            const target = this.getAttribute('data-target');
            const contentItems = document.querySelectorAll('.content-item');

            contentItems.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${target}-content`) {
                    content.classList.add('active');
                }
            });

            if (this.classList.contains('nav-item')) {
                const submenu = this.nextElementSibling;
                if (submenu && submenu.classList.contains('submenu')) {
                    document.querySelectorAll('.submenu').forEach(menu => {
                        if (menu !== submenu) menu.style.display = 'none';
                    });

                    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                } else {
                    document.querySelectorAll('.submenu').forEach(menu => {
                        menu.style.display = 'none';
                    });
                }
            }
        });
    });

    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');
    let currentIndex = 0;
    let autoSlideInterval;

    function updateSlide(index) {
        slider.style.transform = `translateX(-${index * 50}%)`;
        updateButtonStyles();
    }

    function updateButtonStyles() {
        if (currentIndex === 0) {
            prevButton.style.backgroundColor = '#53613e';
            nextButton.style.backgroundColor = 'gray';
        } else if (currentIndex === slides.length - 1) {
            prevButton.style.backgroundColor = 'gray';
            nextButton.style.backgroundColor = '#53613e';
        }
    }

    function slideNext() {
        if (currentIndex < slides.length - 1) {
            currentIndex++;
            updateSlide(currentIndex);
        }
    }

    function slidePrev() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlide(currentIndex);
        }
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            if (currentIndex < slides.length - 1) {
                slideNext();
            } else {
                currentIndex = 0;
                updateSlide(currentIndex);
            }
        }, 400000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    prevButton.addEventListener('click', () => {
        slidePrev();
        resetAutoSlide();
    });

    nextButton.addEventListener('click', () => {
        slideNext();
        resetAutoSlide();
    });

    // Initialize styles and start the automatic sliding
    updateButtonStyles();
    startAutoSlide();

    const navItemsWithSubmenu = document.querySelectorAll('.has-submenu > .nav-item');

    navItemsWithSubmenu.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
        });
    });

    const submenuItems = document.querySelectorAll('.submenu-item');
    submenuItems.forEach(submenuItem => {
        submenuItem.addEventListener('click', function () {
            const parentSubmenu = this.closest('.submenu');
            if (parentSubmenu) {
                parentSubmenu.style.display = 'none';
            }
        });
    });

    document.addEventListener('click', function (e) {
        const isClickInside = e.target.closest('.has-submenu');
        if (!isClickInside) {
            document.querySelectorAll('.submenu').forEach(menu => {
                menu.style.display = 'none';
            });
        }
    });

    const layoutButtons = document.querySelectorAll('.layout-button');

    layoutButtons.forEach(button => {
        button.addEventListener('click', function () {
            const container = this.closest('.iphone-placeholder');
            const risks = container.parentElement.querySelector('.risks-column');
            const benefits = container.parentElement.querySelector('.benefits-column');
            const firstImage = container.querySelector('.first-image');
            const secondImage = container.querySelector('.second-image');
            const textElement = document.querySelector('.content-item.active .dynamic-text');

            // If the button is already active, do nothing
            if (this.classList.contains('active')) {
                return;
            }

            // Toggle the active class between buttons
            container.querySelectorAll('.layout-button').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            if (this.classList.contains('horizontal')) {
                risks?.classList.add('hidden');
                benefits?.classList.add('hidden');

                firstImage.style.transform = 'rotate(-90deg) scale(1.5)';
                firstImage.style.opacity = '0';
                secondImage.style.transform = 'rotate(-90deg) scale(1.5)';
                secondImage.style.opacity = '1';

                // ✅ CAMBIO AQUÍ
                const horizontalText = textElement.getAttribute('data-horizontal-text');
                if (horizontalText) textElement.textContent = horizontalText;
            } else {
                risks?.classList.remove('hidden');
                benefits?.classList.remove('hidden');

                secondImage.style.transform = 'rotate(0deg) scale(1)';
                secondImage.style.opacity = '0';
                firstImage.style.opacity = '1';
                firstImage.style.transform = 'rotate(0deg) scale(1)';

                // ✅ CAMBIO AQUÍ
                const verticalText = textElement.getAttribute('data-vertical-text');
                if (verticalText) textElement.textContent = verticalText;
            }
        });
    });

    if (navItems.length > 0) {
        navItems[0].click();
    }
    animateOrbit();
});