// Basic interactive behaviors: reveal on scroll, animated numbers, simple parallax

// Update year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal on scroll using IntersectionObserver
const reveals = document.querySelectorAll('.reveal');
const obsOptions = { root: null, rootMargin: '0px', threshold: 0.12 };
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    }
  });
}, obsOptions);
reveals.forEach(el => revealObserver.observe(el));

// Animated counters
const counters = document.querySelectorAll('.num');
const counterObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.getAttribute('data-target');
      const duration = 1800; // ms
      let start = null;
      function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    }
  });
}, {threshold: 0.5});
counters.forEach(c => counterObserver.observe(c));

// Simple parallax for hero background relative to scroll
const hero = document.getElementById('hero');
window.addEventListener('scroll', () => {
  if (!hero) return;
  const sc = window.scrollY;
  const layer = hero.querySelector('.bg-layer');
  if (layer) layer.style.transform = `translateY(${sc * -0.06}px)`;
});

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const href = a.getAttribute('href');
    if (href.length>1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
      }
    }
  });
});

// Small touch: hover tilt on gallery items
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach(item => {
  item.addEventListener('mousemove', e=>{
    const rect = item.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    item.style.transform = `perspective(800px) rotateX(${ -y * 6 }deg) rotateY(${ x * 6 }deg) translateY(-6px)`;
  });
  item.addEventListener('mouseleave', ()=>{
    item.style.transform = '';
  });
});

// Fallback for broken images
window.addEventListener('error', (e)=>{
  if (e.target.tagName === 'IMG') {
    e.target.style.background = 'linear-gradient(135deg, rgba(255,105,0,0.06), rgba(0,120,255,0.04))';
    e.target.src = '';
  }
}, true);