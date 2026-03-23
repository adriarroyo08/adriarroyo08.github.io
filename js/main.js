/* === NAVBAR SCROLL EFFECT === */
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* === HAMBURGER MENU === */
function toggleMenu() {
  const btn = document.querySelector('.hamburger');
  const nav = document.getElementById('mobileNav');
  const isOpen = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('open');
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

function closeMenu() {
  const btn = document.querySelector('.hamburger');
  const nav = document.getElementById('mobileNav');
  btn.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  document.body.style.overflow = '';
}

/* Close menu on Escape */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

/* === SCROLL REVEAL === */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
