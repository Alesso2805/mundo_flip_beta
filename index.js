document.addEventListener('DOMContentLoaded', function () {
    const a = 250;
    const b = 100;
    const centerX = 300;
    const centerY = 130;
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

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Remover clase active de todos los items
            navItems.forEach(i => i.classList.remove('active'));

            // Agregar clase active al item clickeado
            this.classList.add('active');

            // Mostrar el contenido correspondiente
            const target = this.getAttribute('data-target');
            const contentItems = document.querySelectorAll('.content-item');

            contentItems.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${target}-content`) {
                    content.classList.add('active');
                }
            });

            // Manejar submenús
            if (this.classList.contains('nav-item')) {
                const submenu = this.nextElementSibling;
                if (submenu && submenu.classList.contains('submenu')) {
                    // Cerrar otros submenús
                    document.querySelectorAll('.submenu').forEach(menu => {
                        if (menu !== submenu) menu.style.display = 'none';
                    });

                    // Alternar el submenú actual
                    if (submenu.style.display === 'block') {
                        submenu.style.display = 'none';
                    } else {
                        submenu.style.display = 'block';
                    }
                } else {
                    // Cerrar todos los submenús si se clickea un item sin submenú
                    document.querySelectorAll('.submenu').forEach(menu => {
                        menu.style.display = 'none';
                    });
                }
            }
        });
    });

    // Activar el primer item por defecto
    if (navItems.length > 0) {
        navItems[0].click();
    }
    animateOrbit();
});
