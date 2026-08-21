/**
 * TRIPULACIÓN ECLÉCTICA | GREEN VALLEY HAVEN
 * Lógica Principal e Interactividad (main.js)
 * Funcionalidades: Partículas Canvas, Filtros, Modales, Web Audio API,
 * ScrollSpy, 3D Tilt, Formulario interactivo y WhatsApp Redirection.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. BASE DE DATOS LOCAL DE LA TRIPULACIÓN (EXPEDIENTES SECRETOS)
       ========================================================================== */
    const animalDatabase = {
        marita: {
            name: "Marita",
            species: "Gato Calicó de Ojos Hipnóticos",
            title: "La Observadora de la Noche",
            badge: "🐱 Detective Mística",
            level: "Nivel 45",
            accentColor: "#10b981",
            photo: "img/marita.jpg",
            quote: "«Si te miro fijamente a las 3 AM desde una esquina oscura, no temas... solo estoy calibrando las frecuencias del universo.»",
            lore: "Marita llegó a Green Valley envuelta en un aura enigmática. Dueña de un sigilo absoluto y de un juicio ocular que desarmaría a cualquier culpable. Sus ojos son capaces de detectar dimensiones que nosotros ni sospechamos, aunque la mayor parte del día prefiere canalizar su energía cósmica en siestas al sol.",
            skills: [
                { name: "Sigilo Felino", val: 98 },
                { name: "Juicio Silencioso", val: 100 },
                { name: "Caza de Luces", val: 92 },
                { name: "Paciencia Zen", val: 85 }
            ],
            diet: "Atún gourmet, bocaditos de salmón y rayos solares tibios.",
            waText: "Hola!%20Vengo%20desde%20la%20web%20a%20consultar%20sobre%20Marita,%20la%20Observadora%20de%20la%20Noche%20%F0%9F%90%B1%E2%9C%A8"
        },
        megan: {
            name: "Megan",
            species: "Perra Guardiana de Gran Corazón",
            title: "La Guardiana del Pan",
            badge: "🐕 Custodia del Trigo",
            level: "Nivel 80",
            accentColor: "#3b82f6",
            photo: "img/megan.jpg",
            quote: "«¿Eso que cruje en tu mano es una corteza de pan? Da igual lo que digas, mi olfato nunca se equivoca.»",
            lore: "Megan es el alma protectora y dulce del refugio. A pesar de su porte imponente, su corazón es tan blando como la miga de pan recién horneada. Posee una habilidad biológica inigualable para escuchar cuando se abre una bolsa de pan a 500 metros a la redonda.",
            skills: [
                { name: "Olfato de Panadería", val: 100 },
                { name: "Ternura Incondicional", val: 96 },
                { name: "Lealtad a la Manada", val: 100 },
                { name: "Defensa del Hogar", val: 90 }
            ],
            diet: "Pedacitos de pan crujiente, croquetas premium y caricias en el lomo.",
            waText: "Hola!%20Vengo%20a%20traerle%20un%20trozo%20de%20pan%20a%20Megan%20la%20Guardiana%20%F0%9F%A5%96%F0%9F%90%95"
        },
        huevancas: {
            name: "Huevancas",
            species: "Pinscher Miniatura Supersónico",
            title: "El Acróbata del Equipo",
            badge: "⚡ Acróbata Bípedo",
            level: "Nivel 99",
            accentColor: "#f59e0b",
            photo: "img/huevancas.jpg",
            quote: "«Las cuatro patas son para los ordinarios. Yo camino erguido para mirar al mundo a los ojos.»",
            lore: "Huevancas desafía diariamente las leyes de la física y la gravedad. Capaz de mantenerse parado en dos patas saludando a quien pase por la cerca y de dar brincos que alcanzan la altura de tus hombros. Su cuerpo es pequeño, pero su valentía es la de un dragón mitológico.",
            skills: [
                { name: "Equilibrio Bípedo", val: 99 },
                { name: "Salto Vertical", val: 98 },
                { name: "Energía Atómica", val: 100 },
                { name: "Carisma Imparable", val: 95 }
            ],
            diet: "Snacks proteicos crujientes, galletas para perros y aplausos.",
            waText: "Hola!%20Quiero%20saber%20m%C3%A1s%20sobre%20las%20acrobacias%20de%20Huevancas%20%F0%9F%90%B6%E2%9A%A1"
        },
        exequiel: {
            name: "Exequiel Palac",
            species: "Ovis Aries Mítica (Oveja Rosa)",
            title: "La Oveja Rosa Fabulosa",
            badge: "🐑 Entidad Legendaria",
            level: "Nivel 64",
            accentColor: "#ec4899",
            photo: "img/exequiel.jpg",
            quote: "«En un mundo de lana blanca, ser de un rosa brillante no es una opción, es una declaración de moda.»",
            lore: "Nacida según la leyenda en los biomas más raros de los videojuegos de supervivencia y acogida con honores en Green Valley. Su lana fosforescente de color fucsia la convierte en la celebridad estética del santuario. Nunca pasa desapercibida.",
            skills: [
                { name: "Glamour Mítico", val: 100 },
                { name: "Rareza de Spawn", val: 100 },
                { name: "Fotogenia Extrema", val: 97 },
                { name: "Pastoreo con Estilo", val: 90 }
            ],
            diet: "Pasto tierno seleccionado, flores silvestres comestibles y piropos.",
            waText: "Hola!%20Quiero%20conocer%20a%20la%20legendaria%20oveja%20rosa%20Exequiel%20Palac%20%F0%9F%90%91%E2%9C%A8"
        }
    };

    /* Número de teléfono base para WhatsApp */
    const PHONE_NUMBER = "5493764658115";

    /* ==========================================================================
       2. EFECTOS DE SONIDO SINTETIZADOS (WEB AUDIO API)
       ========================================================================== */
    let audioCtx = null;

    function playSoundEffect(type = 'click') {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const now = audioCtx.currentTime;

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(520, now);
                osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (type === 'open') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(320, now);
                osc.frequency.exponentialRampToValueAtTime(640, now + 0.18);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
                osc.start(now);
                osc.stop(now + 0.18);
            } else if (type === 'filter') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
            }
        } catch (e) {
            // Silencioso en navegadores sin soporte
        }
    }

    /* ==========================================================================
       3. NAVEGACIÓN MÓVIL (HAMBURGER MENU) & HEADER SCROLL
       ========================================================================== */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('active');
            navToggle.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
            playSoundEffect('click');
        });

        // Cerrar menú al hacer clic en cualquier enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Efecto de Header Scrolled
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       4. SCROLLSPY (ACTIVAR ENLACE ACTIVO SEGÚN LA SECCIÓN VISIBLE)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id], main');

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPosition >= top && scrollPosition < top + height) {
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

    /* ==========================================================================
       5. BOTÓN FLOTANTE "VOLVER ARRIBA"
       ========================================================================== */
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            playSoundEffect('click');
        });
    }

    /* ==========================================================================
       6. FILTRO DE TARJETAS POR ESPECIE
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const animalCards = document.querySelectorAll('.animal-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            playSoundEffect('filter');

            const filterValue = btn.getAttribute('data-filter');

            animalCards.forEach(card => {
                const cardSpecies = card.getAttribute('data-species');

                if (filterValue === 'all' || cardSpecies === filterValue) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ==========================================================================
       7. MODAL DINÁMICO ("VER FICHA SECRETA")
       ========================================================================== */
    const modalBackdrop = document.getElementById('animalModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalBody = document.getElementById('modalBody');
    const inspectButtons = document.querySelectorAll('.btn-inspect');

    function openModal(animalKey) {
        const data = animalDatabase[animalKey];
        if (!data) return;

        modalBody.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; padding-right: 2rem;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="width: 12px; height: 12px; border-radius: 50%; background: ${data.accentColor}; box-shadow: 0 0 10px ${data.accentColor};"></span>
                    <span style="font-size: 0.8rem; font-weight: 800; color: ${data.accentColor}; text-transform: uppercase;">${data.badge}</span>
                </div>
                <span style="font-family: var(--font-mono); font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">${data.level}</span>
            </div>

            <h2 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 4px;">
                ${data.name}
            </h2>
            <h4 style="font-size: 0.95rem; font-weight: 700; color: ${data.accentColor}; margin-bottom: 1.2rem;">
                ${data.species}
            </h4>

            <div style="background: rgba(255, 255, 255, 0.05); border-left: 3px solid ${data.accentColor}; padding: 12px 16px; border-radius: 0 14px 14px 0; margin-bottom: 1.4rem; font-style: italic; color: #e2e8f0; font-size: 0.9rem; line-height: 1.5;">
                ${data.quote}
            </div>

            <div style="margin-bottom: 1.3rem;">
                <h5 style="color: #fff; font-size: 0.85rem; font-weight: 800; text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.5px;">
                    <i class="fa-solid fa-scroll" style="color: ${data.accentColor};"></i> Expediente & Biografía
                </h5>
                <p style="color: #94a3b8; font-size: 0.9rem; line-height: 1.6;">
                    ${data.lore}
                </p>
            </div>

            <div style="margin-bottom: 1.3rem;">
                <h5 style="color: #fff; font-size: 0.85rem; font-weight: 800; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.5px;">
                    <i class="fa-solid fa-chart-simple" style="color: ${data.accentColor};"></i> Atributos de Combate & Ternura
                </h5>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${data.skills.map(s => `
                        <div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 700; color: #cbd5e1; margin-bottom: 3px;">
                                <span>${s.name}</span>
                                <span>${s.val}%</span>
                            </div>
                            <div style="width: 100%; height: 5px; background: rgba(255,255,255,0.08); border-radius: 10px; overflow: hidden;">
                                <div style="width: ${s.val}%; height: 100%; background: ${data.accentColor}; box-shadow: 0 0 8px ${data.accentColor};"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div style="margin-bottom: 1.8rem;">
                <h5 style="color: #fff; font-size: 0.85rem; font-weight: 800; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px;">
                    <i class="fa-solid fa-bowl-food" style="color: ${data.accentColor};"></i> Menú Favorito
                </h5>
                <p style="color: #94a3b8; font-size: 0.88rem;">${data.diet}</p>
            </div>

            <a href="https://wa.me/${PHONE_NUMBER}?text=${data.waText}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="btn btn-wa-action" 
               style="width: 100%; justify-content: center; padding: 0.95rem; font-size: 0.95rem;">
                <i class="fa-brands fa-whatsapp" style="font-size: 1.1rem;"></i> Chatear sobre ${data.name}
            </a>
        `;

        modalBackdrop.classList.add('active');
        modalBackdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        playSoundEffect('open');
    }

    function closeModal() {
        modalBackdrop.classList.remove('active');
        modalBackdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        playSoundEffect('click');
    }

    inspectButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            openModal(target);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                closeModal();
            }
        });
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
            closeModal();
        }
    });

    /* ==========================================================================
       8. EFECTO 3D TILT EN LAS TARJETAS (SOLO PANTALLAS CON CURSOR/MOUSE)
       ========================================================================== */
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        animalCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
            });
        });
    }

    /* ==========================================================================
       9. FORMULARIO INTERACTIVO CON ENLACE DIRECTO A WHATSAPP
       ========================================================================== */
    const contactForm = document.getElementById('quickContactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            playSoundEffect('open');

            const name = document.getElementById('userName').value.trim();
            const animal = document.getElementById('favoriteAnimal').value;
            const message = document.getElementById('userMessage').value.trim();

            const fullMessage = `¡Hola Green Valley! 👋%0A%0A` +
                                `*Nombre:* ${encodeURIComponent(name)}%0A` +
                                `*Animal Favorito:* ${encodeURIComponent(animal)}%0A` +
                                `*Mensaje:* ${encodeURIComponent(message)}%0A%0A` +
                                `_Enviado desde la Landing Page de la Tripulación Ecléctica 🐾_`;

            const waUrl = `https://wa.me/${PHONE_NUMBER}?text=${fullMessage}`;

            // Abrir WhatsApp en nueva pestaña
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        });
    }

    /* ==========================================================================
       10. CANVA DE FONDO: PARTÍCULAS / LUCIÉRNAGAS INTERACTIVAS
       ========================================================================== */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        let animationFrameId;

        function setCanvasDimensions() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', () => {
            setCanvasDimensions();
            initParticles();
        });
        setCanvasDimensions();

        const colorPalette = [
            '#10b981', // Verde Marita
            '#3b82f6', // Azul Megan
            '#f59e0b', // Ámbar Huevancas
            '#ec4899'  // Rosa Exequiel
        ];

        class Particle {
            constructor() {
                this.init();
            }

            init() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2.2 + 0.8;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                this.alpha = Math.random() * 0.5 + 0.2;
                this.alphaDelta = (Math.random() * 0.01 + 0.005) * (Math.random() < 0.5 ? 1 : -1);
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Animación de respiración de brillo
                this.alpha += this.alphaDelta;
                if (this.alpha <= 0.1 || this.alpha >= 0.7) {
                    this.alphaDelta = -this.alphaDelta;
                }

                // Rebote suave en los límites
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.init();
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = Math.max(0, this.alpha);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 12;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        function initParticles() {
            particlesArray = [];
            // Ajustar densidad de partículas según el tamaño de la pantalla
            const count = window.innerWidth < 768 ? 25 : 55;
            for (let i = 0; i < count; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            animationFrameId = requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

});
