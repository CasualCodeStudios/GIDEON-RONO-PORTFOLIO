
/* ─── CANVAS PARTICLE FIELD (Corporate-Toned Cyberpunk) ─── */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [], stars = [], gridLines = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Stars
for (let i = 0; i < 100; i++) {
  stars.push({ x:Math.random(), y:Math.random(), r:Math.random()*.9+.1, a:Math.random()*.6+.2 });
}

// Grid lines (subtle)
for (let i = 0; i < 6; i++) {
  gridLines.push({ x:Math.random(), vy:Math.random()*.0003+.0001, life:Math.random() });
}

function spawnParticle() {
  return {
    x: Math.random() * W,
    y: H + 110,
    vx: (Math.random() - 0.5) * 2,
    vy: -(Math.random() * 4.2 + 0.3),
    life: 2,
    decay: Math.random() * 1.004 + 0.005,
    size: Math.random() * 42.5 + 9.9,
    isCyan: Math.random() > 0.4
  };
}

for (let i = 0; i < 50; i++) {
  let p = spawnParticle();
  p.y = Math.random() * H;
  particles.push(p);
}

let frame = 0;
function drawBg() {
  ctx.clearRect(0, 0, W, H);

  // Deep navy gradient bg
  let grad = ctx.createRadialGradient(W*.45, H*.35, 0, W*.5, H*.5, H);
  grad.addColorStop(0, '#071828');
  grad.addColorStop(0.45, '#050f1a');
  grad.addColorStop(1, '#020a13');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Subtle corner glow (blue)
  let cornerGlow = ctx.createRadialGradient(W, 0, 0, W, 0, W*.6);
  cornerGlow.addColorStop(0, 'rgba(0,150,200,0.04)');
  cornerGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = cornerGlow;
  ctx.fillRect(0, 0, W, H);

  // Green accent glow (bottom left)
  let greenGlow = ctx.createRadialGradient(0, H, 0, 0, H, H*.4);
  greenGlow.addColorStop(0, 'rgba(45, 179, 52, 0.4)');
  greenGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = greenGlow;
  ctx.fillRect(0, 0, W, H);

  // Stars
  stars.forEach(s => {
    let flicker = s.a + Math.sin(frame * 0.015 + s.x * 8) * 0.2;
    ctx.beginPath();
    ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(180,220,255,${Math.max(0,Math.min(.8,flicker))})`;
    ctx.fill();
  });

  // Floating particles
  if (frame % 4 === 0 && particles.length < 65) particles.push(spawnParticle());
  particles.forEach((p, i) => {
    p.x += p.vx; p.y += p.vy; p.life -= p.decay;
    if (p.life <= 0 || p.y < -10) { particles[i] = spawnParticle(); return; }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
    if (p.isCyan) {
      ctx.fillStyle = `rgba(0,196,232,${p.life * 0.5})`;
    } else {
      ctx.fillStyle = `rgba(62,201,138,${p.life * 0.45})`;
    }
    ctx.fill();
  });

  // Scan line (very subtle)
  let scanY = (frame * 0.5) % H;
  let scanGrad = ctx.createLinearGradient(0, scanY - 80, 0, scanY + 80);
  scanGrad.addColorStop(0, 'transparent');
  scanGrad.addColorStop(.5, 'rgba(0,196,232,0.012)');
  scanGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = scanGrad;
  ctx.fillRect(0, scanY - 80, W, 160);

  frame++;
  requestAnimationFrame(drawBg);
}
drawBg();

/* ─── 3D CARD TILT ─── */
const cardWrapper = document.getElementById('card-wrapper');
const profileCard = document.getElementById('profile-card');
let targetRX = 0, targetRY = 0, currentRX = 0, currentRY = 0;

document.addEventListener('mousemove', e => {
  const rect = cardWrapper.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const dx = (e.clientX - cx) / (window.innerWidth / 2);
  const dy = (e.clientY - cy) / (window.innerHeight / 2);
  targetRY = dx * 24;
  targetRX = -dy * 20;
});

document.addEventListener('mouseleave', () => { targetRX = 0; targetRY = 0; });

function animateCard() {
  currentRX += (targetRX - currentRX) * 0.07;
  currentRY += (targetRY - currentRY) * 0.07;
  profileCard.style.transform = `rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;
  requestAnimationFrame(animateCard);
}
animateCard();

/* ─── CUSTOM CURSOR ─── */
const isFine = window.matchMedia('(pointer:fine)').matches;
if (isFine) {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });

  function animateCursor() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a,button,.role-card,.teaching-card,.project-card,.highlight-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '46px'; ring.style.height = '46px';
      ring.style.borderColor = 'rgba(0,196,232,0.7)';
      dot.style.transform = 'translate(-50%,-50%) scale(1.8)';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '30px'; ring.style.height = '30px';
      ring.style.borderColor = 'rgba(0,196,232,0.4)';
      dot.style.transform = 'translate(-50%,-50%) scale(1)';
    });
  });
}

/* ─── NAV SCROLL ─── */
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => mainNav.classList.toggle('scrolled', window.scrollY > 80), {passive:true});

/* ─── HAMBURGER ─── */
const toggle = document.getElementById('navToggle');
const drawer = document.getElementById('navDrawer');
toggle.addEventListener('click', () => {
  const open = toggle.classList.toggle('open');
  drawer.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
function closeDrawer() {
  toggle.classList.remove('open');
  drawer.classList.remove('open');
  document.body.style.overflow = '';
}

/* ─── SCROLL TO TOP ─── */
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > window.innerHeight * 0.8);
}, {passive:true});
scrollTopBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

/* ─── INTERSECTION OBSERVER ─── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, {threshold:0.07});
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 6 * 70) + 'ms';
  io.observe(el);
});

/* ─── ACCORDION ─── */
function toggleAccordion(key) {
  const panel = document.getElementById('panel-' + key);
  const btn = document.querySelector(`#acc-${key} .acc-trigger`);
  const isOpen = panel.classList.contains('open');
  document.querySelectorAll('.acc-panel-wrap').forEach(p => p.classList.remove('open'));
  document.querySelectorAll('.acc-trigger').forEach(b => b.classList.remove('active'));
  document.body.style.overflow = '';
  if (!isOpen) {
    panel.classList.add('open');
    btn.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}
function closeAccordion(key) {
  document.getElementById('panel-' + key).classList.remove('open');
  document.querySelector(`#acc-${key} .acc-trigger`).classList.remove('active');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.acc-panel-wrap').forEach(p => p.classList.remove('open'));
    document.querySelectorAll('.acc-trigger').forEach(b => b.classList.remove('active'));
    document.body.style.overflow = '';
  }
});

/* ─── FORM ─── */
function handleForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = 'Message Sent ✓';
  btn.style.background = 'linear-gradient(135deg,#1a7a50,#3ec98a)';
  setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 3500);
}
function handleNewsletter(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const orig = btn.textContent;
  btn.textContent = 'Subscribed ✓';
  btn.style.opacity = '.7';
  setTimeout(() => { btn.textContent = orig; btn.style.opacity = ''; }, 3500);
}