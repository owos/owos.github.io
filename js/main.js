/* =============================================
   main.js – Theme toggle + nav interactions
   ============================================= */

// --- Dark / Light Mode ---
const STORAGE_KEY = 'theme';

function getPreferredTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  return 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
  // Update toggle icon
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    btn.querySelector('.icon-sun').style.display = theme === 'dark' ? 'block' : 'none';
    btn.querySelector('.icon-moon').style.display = theme === 'dark' ? 'none' : 'block';
  });
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// Apply theme immediately to avoid flash
applyTheme(getPreferredTheme());

document.addEventListener('DOMContentLoaded', () => {
  // Wire up all theme toggles
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // --- Mobile hamburger nav ---
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileNav = document.querySelector('.nav__mobile');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
  }

  // --- Abstract toggle on publication cards ---
  document.querySelectorAll('.pub-abstract-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.pub-card');
      const abstract = card.querySelector('.pub-card__abstract');
      if (!abstract) return;
      const open = abstract.classList.toggle('open');
      btn.textContent = open ? 'Hide Abstract' : 'Abstract';
    });
  });

  // --- Active nav link highlighting ---
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link[data-page]').forEach(link => {
    if (link.dataset.page === currentPath) {
      link.classList.add('active');
    }
  });

  // --- Dynamic copyright year ---
  document.querySelectorAll('.footer__year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});
