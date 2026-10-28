/* LLENO DE TIZNE — comportamiento compartido (sin librerías) */

// Cuántos textos caben en cada pestaña del Archivo.
// Si agregas más textos, las pestañas (Bloque I, II, III...) se crean solas.
const TEXTOS_POR_BLOQUE = 5;

const ROMANOS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

/* ---------- MENÚ MÓVIL ---------- */
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('header nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const abierto = nav.classList.toggle('abierto');
    menuToggle.setAttribute('aria-expanded', abierto);
    menuToggle.textContent = abierto ? 'Cerrar' : 'Menú';
  });

  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('abierto');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = 'Menú';
  }));
}

/* ---------- MODALES (proyectos y galería) ---------- */
let ultimoFoco = null;

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  ultimoFoco = document.activeElement;
  modal.classList.add('active');
  document.body.classList.add('modal-abierto');
  const cerrar = modal.querySelector('.close-modal');
  if (cerrar) cerrar.focus();
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.classList.remove('active');
  if (!document.querySelector('.modal-overlay.active')) document.body.classList.remove('modal-abierto');
  if (ultimoFoco) ultimoFoco.focus();
}

document.querySelectorAll('[data-modal]').forEach(el => {
  el.addEventListener('click', () => openModal(el.dataset.modal));
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(overlay.id); });
  const cerrar = overlay.querySelector('.close-modal');
  if (cerrar) cerrar.addEventListener('click', () => closeModal(overlay.id));
});

document.querySelectorAll('[data-cerrar]').forEach(el => {
  el.addEventListener('click', () => closeModal(el.closest('.modal-overlay').id));
});

/* ---------- VISOR DE FOTOS: un pop-up para toda la galería ---------- */
const visor = document.getElementById('visor');
const fotos = Array.from(document.querySelectorAll('.gallery-card[data-evento]'));
let fotoActual = 0;

function mostrarFoto(i) {
  fotoActual = (i + fotos.length) % fotos.length;
  const d = fotos[fotoActual].dataset;
  const marco = visor.querySelector('.visor-foto');
  marco.innerHTML = '';
  if (d.foto) {
    const img = document.createElement('img');
    img.src = d.foto;
    img.alt = d.evento;
    marco.appendChild(img);
  } else {
    marco.innerHTML = `<div class="gallery-placeholder-text">[ Registro visual ${d.folio} ]<br>Foto pendiente</div>`;
  }
  visor.querySelector('.visor-folio').textContent = `Registro ${d.folio} / ${String(fotos.length).padStart(2, '0')}`;
  visor.querySelector('#visor-evento').textContent = d.evento;
  [['fecha', d.fecha], ['lugar', d.lugar], ['fotografo', d.fotografo]].forEach(([campo, valor]) => {
    const fila = visor.querySelector('.visor-' + campo);
    fila.hidden = !valor;
    fila.querySelector('dd').textContent = valor || '';
  });
  const ctx = visor.querySelector('.visor-contexto');
  ctx.hidden = !d.contexto;
  ctx.textContent = d.contexto || '';
}

if (visor && fotos.length) {
  fotos.forEach((f, i) => f.addEventListener('click', () => { mostrarFoto(i); openModal('visor'); }));
  visor.querySelector('.visor-ant').addEventListener('click', () => mostrarFoto(fotoActual - 1));
  visor.querySelector('.visor-sig').addEventListener('click', () => mostrarFoto(fotoActual + 1));
  visor.querySelector('.visor-nav').hidden = fotos.length < 2;
  document.addEventListener('keydown', e => {
    if (!visor.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') mostrarFoto(fotoActual - 1);
    if (e.key === 'ArrowRight') mostrarFoto(fotoActual + 1);
  });
}

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
});

/* ---------- ARCHIVO: pestañas automáticas + filtros por género ---------- */
const archivo = document.querySelector('.archive-list');

if (archivo) {
  const items = Array.from(archivo.querySelectorAll('.archive-item'));
  const tabsBox = document.querySelector('.archive-tabs-container');
  const filtros = document.querySelectorAll('.filter-btn');
  let generoActual = 'all';
  let bloqueActual = 0;

  // Numerar cada texto (01, 02, 03...)
  items.forEach((item, i) => {
    const num = document.createElement('span');
    num.className = 'archive-num';
    num.textContent = String(i + 1).padStart(2, '0');
    item.prepend(num);
  });

  const vacio = document.createElement('p');
  vacio.className = 'archive-empty';
  vacio.textContent = '[ Sin textos de este género todavía. El carbón sigue ardiendo. ]';
  archivo.appendChild(vacio);

  function render() {
    const visibles = items.filter(it => generoActual === 'all' || it.dataset.category === generoActual);
    const totalBloques = Math.max(1, Math.ceil(visibles.length / TEXTOS_POR_BLOQUE));
    if (bloqueActual >= totalBloques) bloqueActual = 0;

    // Pestañas
    tabsBox.innerHTML = '';
    tabsBox.hidden = totalBloques < 2;
    for (let b = 0; b < totalBloques; b++) {
      const desde = b * TEXTOS_POR_BLOQUE + 1;
      const hasta = Math.min((b + 1) * TEXTOS_POR_BLOQUE, visibles.length);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tab-btn' + (b === bloqueActual ? ' active' : '');
      btn.textContent = `Bloque ${ROMANOS[b] || b + 1} (${desde}-${hasta})`;
      btn.addEventListener('click', () => { bloqueActual = b; render(); });
      tabsBox.appendChild(btn);
    }

    // Items
    items.forEach(it => { it.hidden = true; });
    visibles
      .slice(bloqueActual * TEXTOS_POR_BLOQUE, (bloqueActual + 1) * TEXTOS_POR_BLOQUE)
      .forEach(it => { it.hidden = false; });

    vacio.hidden = visibles.length > 0;
  }

  function filtrar(genero) {
    generoActual = genero;
    bloqueActual = 0;
    filtros.forEach(f => f.classList.toggle('active', f.dataset.filter === genero));
    render();
  }

  filtros.forEach(f => f.addEventListener('click', () => filtrar(f.dataset.filter)));

  // Enlaces del footer: "Poesía", "Crónica"... filtran el archivo
  document.querySelectorAll('[data-filtrar]').forEach(a => {
    a.addEventListener('click', () => filtrar(a.dataset.filtrar));
  });

  render();
}

/* ---------- NAV: resalta la sección visible ---------- */
const enlacesNav = document.querySelectorAll('header nav a[href*="#"]');

if (enlacesNav.length && 'IntersectionObserver' in window) {
  const obs = new IntersectionObserver(entradas => {
    entradas.forEach(en => {
      if (!en.isIntersecting) return;
      enlacesNav.forEach(a => a.classList.toggle('activo', a.hash === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  document.querySelectorAll('main section[id]').forEach(s => obs.observe(s));
}

/* ---------- CONTACTO: abre el correo con el mensaje armado ---------- */
const form = document.querySelector('.contact-form');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const destino = form.dataset.correo;
    const nombre = form.querySelector('#nombre').value.trim();
    const correo = form.querySelector('#correo').value.trim();
    const mensaje = form.querySelector('#mensaje').value.trim();
    const asunto = encodeURIComponent(`Propuesta desde Lleno de Tizne — ${nombre}`);
    const cuerpo = encodeURIComponent(`${mensaje}\n\n— ${nombre} (${correo})`);
    window.location.href = `mailto:${destino}?subject=${asunto}&body=${cuerpo}`;
    const status = form.querySelector('.form-status');
    if (status) status.textContent = '> Mensaje entregado al carbón. Se abrirá tu programa de correo.';
  });
}

const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- PORTADA: ceniza que cae, brasas que suben, el cursor las agita ---------- */
const lienzo = document.getElementById('hollin');

if (lienzo && lienzo.getContext) {
  const ctx = lienzo.getContext('2d');
  const hero = lienzo.parentElement;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cursor = { x: -9999, y: -9999, activo: false };
  let ancho = 0, alto = 0, particulas = [], visible = true, ultimo = 0;

  const nueva = (enCualquierAltura) => {
    const brasa = Math.random() < 0.16;      // unas cuantas chispas rojas que suben
    return {
      brasa,
      x: brasa ? ancho * (0.45 + Math.random() * 0.5) : Math.random() * ancho,
      y: enCualquierAltura ? Math.random() * alto : (brasa ? alto + 10 : -10),
      t: brasa ? 1 + Math.random() * 2 : 1 + Math.random() * 3,
      vy: brasa ? -(0.3 + Math.random() * 0.7) : 0.15 + Math.random() * 0.5,
      vx: 0,
      fase: Math.random() * Math.PI * 2,
      gris: 110 + Math.floor(Math.random() * 110),
      a: brasa ? 0.5 + Math.random() * 0.5 : 0.2 + Math.random() * 0.5,
      giro: Math.random() * Math.PI,
    };
  };

  function medir() {
    ancho = hero.clientWidth;
    alto = hero.clientHeight;
    lienzo.width = ancho * dpr;
    lienzo.height = alto * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const total = Math.round(Math.min(170, (ancho * alto) / 9000));
    particulas = Array.from({ length: total }, () => nueva(true));
  }

  function dibujar(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.giro);
    const a = p.brasa ? p.a * (0.6 + 0.4 * Math.sin(p.fase * 6)) : p.a;
    ctx.fillStyle = p.brasa ? `rgba(255,${40 + (p.gris % 30)},25,${a})` : `rgba(${p.gris},${p.gris},${p.gris},${a})`;
    // ceniza = esquirlas rectas, nunca círculos
    ctx.fillRect(-p.t / 2, -p.t / 2, p.t, p.t * 0.6);
    ctx.restore();
  }

  function cuadro(ahora) {
    if (!visible) return;
    const dt = Math.min(3, (ahora - ultimo) / 16.7 || 1);
    ultimo = ahora;
    ctx.clearRect(0, 0, ancho, alto);

    for (const p of particulas) {
      p.fase += 0.012 * dt;
      // el cursor sopla la ceniza
      if (cursor.activo) {
        const dx = p.x - cursor.x, dy = p.y - cursor.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 16000) {
          const f = (1 - d2 / 16000) * 0.9;
          const d = Math.sqrt(d2) || 1;
          p.vx += (dx / d) * f;
          p.vy += (dy / d) * f * 0.6;
        }
      }
      p.vx *= 0.94;
      const objetivo = p.brasa ? -(0.35 + p.t * 0.15) : 0.15 + p.t * 0.08;
      p.vy += (objetivo - p.vy) * 0.02;
      p.x += (p.vx + Math.sin(p.fase) * 0.35) * dt;
      p.y += p.vy * dt;
      p.giro += 0.01 * dt;
      if (p.y > alto + 12 || p.y < -12 || p.x < -20 || p.x > ancho + 20) Object.assign(p, nueva(false));
      dibujar(p);
    }
    requestAnimationFrame(cuadro);
  }

  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    cursor.x = e.clientX - r.left;
    cursor.y = e.clientY - r.top;
    cursor.activo = true;
  });
  hero.addEventListener('pointerleave', () => { cursor.activo = false; });

  medir();
  let espera;
  window.addEventListener('resize', () => { clearTimeout(espera); espera = setTimeout(medir, 150); });

  if (sinMovimiento) {
    particulas.forEach(dibujar);
  } else {
    new IntersectionObserver(([en]) => {
      const antes = visible;
      visible = en.isIntersecting;
      if (visible && !antes) { ultimo = performance.now(); requestAnimationFrame(cuadro); }
    }).observe(hero);
    requestAnimationFrame(cuadro);
  }
}

/* ---------- TACHONES: en celular se revelan al tocar ---------- */
document.querySelectorAll('.tachon').forEach(t => {
  t.setAttribute('tabindex', '0');
  t.addEventListener('click', () => t.classList.toggle('visto'));
});

/* ---------- ENTRADAS TIPO IMPRENTA ---------- */
const porRevelar = document.querySelectorAll(
  '.section-title, .about-grid > *, .archive-item, .gallery-card, .project-card, .contact-container > *, .text-container'
);

if ('IntersectionObserver' in window && !sinMovimiento) {
  const impresor = new IntersectionObserver(entradas => {
    entradas.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('impreso');
      impresor.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });

  porRevelar.forEach(el => { el.classList.add('revelar'); impresor.observe(el); });
}

/* ---------- LECTURA: barra de avance ---------- */
const barra = document.querySelector('.barra-lectura');
const textoLeido = document.querySelector('.text-container');

if (barra && textoLeido) {
  const avanzar = () => {
    const r = textoLeido.getBoundingClientRect();
    const cabecera = document.querySelector('header').offsetHeight;
    const total = r.height - window.innerHeight + cabecera;
    const hecho = total <= 0 ? 1 : Math.min(1, Math.max(0, (cabecera - r.top) / total));
    barra.style.transform = `scaleX(${hecho})`;
  };
  window.addEventListener('scroll', avanzar, { passive: true });
  avanzar();
}
