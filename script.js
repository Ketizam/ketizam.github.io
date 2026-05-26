/* ══════════════════════════════════════════
   script.js — Galería Fotográfica
   · Filtros por categoría
   · Lightbox con navegación
   · Animaciones por scroll (IntersectionObserver)
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Datos de fotos para el lightbox ───
     El orden debe coincidir con data-index en el HTML.
     Al agregar una foto nueva, añade un objeto al final de este array. */
  const photos = [
    { src: 'imgs/monserrate.JPG', title: 'Monserrate', desc: 'Bogotá, Colombia · 2026' },
    { src: 'imgs/plaza.JPG', title: 'Plaza', desc: 'Bogotá · 2026' },
    { src: 'imgs/torso.JPG', title: 'Torso',desc: 'Bogotá · 2026' },
    { src: 'imgs/resistencia.jpeg', title: 'Mural',desc: 'Universidad Nacional · 2026' },
    { src: 'imgs/producto_1.jpg', title: 'Producto audifonos',desc: 'Serie Temática · 2026' },
    { src: 'imgs/producto_2.jpg', title: 'Producto auriculares',desc: 'Serie Temática  · 2026' },
    { src: 'imgs/sobrenubes.jpg', title: 'Volando',      desc: 'Bogotá · 2025' },
    { src: 'imgs/montañas.jpg', title: 'Montañas',desc: 'Boyacá · 2024' },
    { src: 'imgs/castillo.jpg', title: 'Cartagena',desc: 'Castillo San Felipe · 2024' },
    { src: 'imgs/parchao.jpg', title: 'Relajado',desc: 'Gato parchao · 2025' },
  ];

  /* ─── Referencias DOM ─── */
  const grid       = document.getElementById('galleryGrid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lbImg');
  const lbTitle    = document.getElementById('lbTitle');
  const lbDesc     = document.getElementById('lbDesc');
  const lbClose    = document.getElementById('lbClose');
  const lbPrev     = document.getElementById('lbPrev');
  const lbNext     = document.getElementById('lbNext');

  let currentIndex = 0;
  let visibleIndices = []; // índices visibles según filtro activo

  /* ────────────────────────────────────────
     FILTROS
  ──────────────────────────────────────── */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      const items  = grid.querySelectorAll('.photo-item');

      items.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hidden', !match);
      });

      buildVisibleIndices(filter);
    });
  });

  function buildVisibleIndices(filter) {
    const items = grid.querySelectorAll('.photo-item');
    visibleIndices = [];
    items.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        visibleIndices.push(Number(item.querySelector('.photo-expand').dataset.index));
      }
    });
  }
  buildVisibleIndices('all'); // inicializar

  /* ────────────────────────────────────────
     LIGHTBOX
  ──────────────────────────────────────── */
  function openLightbox(index) {
    currentIndex = index;
    const photo = photos[index];
    if (!photo) return;

    lbImg.src     = photo.src;
    lbImg.alt     = photo.title;
    lbTitle.textContent = photo.title;
    lbDesc.textContent  = photo.desc;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  function navigateLightbox(dir) {
    const pos = visibleIndices.indexOf(currentIndex);
    let next  = pos + dir;
    if (next < 0) next = visibleIndices.length - 1;
    if (next >= visibleIndices.length) next = 0;
    openLightbox(visibleIndices[next]);
  }

  // Botones de expandir en cada foto
  grid.addEventListener('click', e => {
    const btn = e.target.closest('.photo-expand');
    if (!btn) return;
    openLightbox(Number(btn.dataset.index));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click',  () => navigateLightbox(-1));
  lbNext.addEventListener('click',  () => navigateLightbox(1));

  // Cerrar al hacer click fuera de la imagen
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Teclado
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigateLightbox(-1);
    if (e.key === 'ArrowRight')  navigateLightbox(1);
  });

  /* ────────────────────────────────────────
     ANIMACIONES DE ENTRADA (scroll)
  ──────────────────────────────────────── */
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // escalonado suave
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  grid.querySelectorAll('.photo-item').forEach(item => observer.observe(item));


});
