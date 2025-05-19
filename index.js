document.addEventListener('DOMContentLoaded', () => {
    
    // Variables y funciones para la sección de volatilidad
    const volatilidades = [
        { "Acción": "Acciones Perú", "Volatilidad 10 años": "22.79%", "Volatilidad 15 años": "22.64%", "Volatilidad 3 años": "22.14%", "Volatilidad 5 años": "25.00%" },
        { "Acción": "Acciones Europeas", "Volatilidad 10 años": "21.11%", "Volatilidad 15 años": "23.72%", "Volatilidad 3 años": "20.30%", "Volatilidad 5 años": "22.27%" },
        { "Acción": "Cobra achorada", "Volatilidad 10 años": "17.64%", "Volatilidad 15 años": "17.05%", "Volatilidad 3 años": "16.98%", "Volatilidad 5 años": "18.47%" },
        { "Acción": "Real Estate ", "Volatilidad 10 años": "0.25%", "Volatilidad 15 años": "0.51%", "Volatilidad 3 años": "0.18%", "Volatilidad 5 años": "0.19%" },
        { "Acción": "Inflación Perú", "Volatilidad 10 años": "0.23%", "Volatilidad 15 años": "0.21%", "Volatilidad 3 años": "0.28%", "Volatilidad 5 años": "0.27%" },
        { "Acción": "Depósito a Plazo", "Volatilidad 10 años": "6.35%", "Volatilidad 15 años": "5.53%", "Volatilidad 3 años": "6.58%", "Volatilidad 5 años": "7.58%" },
        { "Acción": "Panda Zen", "Volatilidad 10 años": "5.22%", "Volatilidad 15 años": "4.57%", "Volatilidad 3 años": "6.26%", "Volatilidad 5 años": "6.34%" },
        { "Acción": "Bonos Latam", "Volatilidad 10 años": "5.58%", "Volatilidad 15 años": "5.15%", "Volatilidad 3 años": "4.80%", "Volatilidad 5 años": "5.79%" }
    ];

    const selectors = [
        document.getElementById('investmentSelector'),
        document.getElementById('investmentSelector2')
    ];

    const selectedValues = [
        selectors[0].querySelector('.title').textContent.trim(),
        selectors[1].querySelector('.title').textContent.trim()
    ];


    function actualizarVolatilidad(selectorIdx, title, sub) {
        const key = `Volatilidad ${aniosSeleccionados} años`;
        const fullTitle = (title + ' ' + sub).trim().toLowerCase();
        const match = volatilidades.find(v => v["Acción"].trim().toLowerCase() === fullTitle);

        if (match && match[key]) {
            document.getElementById(`volatilidadValor${selectorIdx === 0 ? '' : '2'}`).innerText = match[key];
        } else {
            document.getElementById(`volatilidadValor${selectorIdx === 0 ? '' : '2'}`).innerText = 'N/A';
        }
    }


    selectors.forEach((selector, idx) => {
        const toggle = selector.querySelector('.selected');
        const titleEl = selector.querySelector('.title');
        const subEl = selector.querySelector('.subtitle');

        toggle.addEventListener('click', () => {
            selector.classList.toggle('open');
        });

        selector.querySelectorAll('.options li').forEach(li => {
            li.addEventListener('click', () => {
                const selectedTitle = li.dataset.title;
                const selectedSub = li.dataset.sub;

                const otherIdx = idx === 0 ? 1 : 0;
                const otherSelector = selectors[otherIdx];
                const otherTitleEl = otherSelector.querySelector('.title');
                const otherSubEl = otherSelector.querySelector('.subtitle');

                const prevThisTitle = selectedValues[idx];          // Guardamos el valor actual de este selector
                const prevOtherTitle = selectedValues[otherIdx];    // Guardamos el valor actual del otro selector

                // Actualizar selección actual
                titleEl.textContent = selectedTitle;
                subEl.textContent = selectedSub;
                selector.classList.remove('open');
                selectedValues[idx] = selectedTitle;

                // Si hay conflicto, restablecer el otro selector al valor anterior del actual
                if (selectedValues[otherIdx] === selectedTitle) {
                    const prevOption = Array.from(otherSelector.querySelectorAll('.options li'))
                        .find(opt => opt.dataset.title === prevThisTitle);

                    if (prevOption) {
                        const newTitle = prevOption.dataset.title;
                        const newSub = prevOption.dataset.sub;

                        otherTitleEl.textContent = newTitle;
                        otherSubEl.textContent = newSub;
                        selectedValues[otherIdx] = newTitle;

                        if (typeof actualizarVolatilidad === 'function') {
                            actualizarVolatilidad(otherIdx, newTitle, newSub);
                        }
                    }
                }

                if (typeof actualizarVolatilidad === 'function') {
                    actualizarVolatilidad(idx, selectedTitle, selectedSub);
                }
            });
        });

        // Cerrar si se hace clic fuera
        document.addEventListener('click', e => {
            if (!selector.contains(e.target)) {
                selector.classList.remove('open');
            }
        });
    });


    // Actualización del texto editable con valor por defecto
    const investment = document.getElementById('wt1-investment');
    const years = document.getElementById('wt1-years');

    [investment, years].forEach(el => {
        el.addEventListener('focus', function() {
            if (el.textContent === el.getAttribute('data-default')) {
                el.textContent = '';
            }
        });

        el.addEventListener('blur', function() {
            if (el.textContent === '') {
                el.textContent = el.getAttribute('data-default');
            }
        });

        // Validar que solo se ingresen números
        el.addEventListener('input', () => {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const cursorPosition = range.startOffset;

            el.textContent = el.textContent.replace(/[^0-9]/g, '');

            // Restaurar la posición del cursor
            range.setStart(el.firstChild, Math.min(cursorPosition, el.textContent.length));
            range.setEnd(el.firstChild, Math.min(cursorPosition, el.textContent.length));
            selection.removeAllRanges();
            selection.addRange(range);
        });

        // Prevenir pegar letras
        el.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text');
            const numbersOnly = text.replace(/[^0-9]/g, '');
            document.execCommand('insertText', false, numbersOnly);
        });
    });

    // FUNCION PARA EL MOVIMIENTO ELIPTICO DE IMAGENES (VARIABLES Y FUNCIONES)

    const a = 250;
    const b = 150;
    const centerX = 300;
    const centerY = 190;
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

    // ---------------------------------------------------------------------- //

    // SECCION DE SLIDER (VARIABLES Y FUNCIONES)

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
        }, 100000000);
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

    // ---------------------------------------------------------------------- //

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

    const compararBtn = document.getElementById('compararBtn');

    compararBtn.addEventListener('click', () => {
        const yearsInput = document.getElementById('wt1-years');
        const years = parseInt(yearsInput.textContent.trim()) || yearsInput.dataset.default;

        const selector1 = document.querySelector('#investmentSelector .selected');
        const selector2 = document.querySelector('#investmentSelector2 .selected');

        const opcion1 = selector1 ? selector1.querySelector('.title').textContent.trim() : null;
        const opcion2 = selector2 ? selector2.querySelector('.title').textContent.trim() : null;

        if (!opcion1 || !opcion2) {
            alert('Selecciona dos opciones para comparar.');
            return;
        }

        const key = `Volatilidad ${years} años`;

        // Find the volatility for the selected funds
        const match1 = volatilidades.find(v => v["Acción"].trim().toLowerCase() === opcion1.toLowerCase());
        const match2 = volatilidades.find(v => v["Acción"].trim().toLowerCase() === opcion2.toLowerCase());

        const volatilidad1 = match1 ? match1[key] || 'N/A' : 'N/A';
        const volatilidad2 = match2 ? match2[key] || 'N/A' : 'N/A';

        // Update the HTML elements with the volatility values
        const firstVolatilityElement = document.getElementById('volatilidadValor');
        const secondVolatilityElement = document.getElementById('volatilidadValor2');

        if (firstVolatilityElement) {
            firstVolatilityElement.textContent = volatilidad1;
        }

        if (secondVolatilityElement) {
            secondVolatilityElement.textContent = volatilidad2;
        }

        console.log(`Volatilidad de ${opcion1}: ${volatilidad1}`);
        console.log(`Volatilidad de ${opcion2}: ${volatilidad2}`);
    });

});