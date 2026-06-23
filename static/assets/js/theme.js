// Theme toggle — persists across pages using localStorage.
(function () {
  const STORAGE_KEY = 'refurbity-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.querySelector('.toggle-icon').textContent = theme === DARK ? '☀️' : '🌙';
      btn.querySelector('.toggle-label').textContent = theme === DARK ? 'Light' : 'Dark';
      btn.setAttribute('aria-label', theme === DARK ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || LIGHT;
    const next = current === DARK ? LIGHT : DARK;
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  // Apply saved theme immediately on load to avoid flash of wrong theme.
  const saved = localStorage.getItem(STORAGE_KEY) || LIGHT;
  applyTheme(saved);

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(saved);
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.addEventListener('click', toggleTheme);
  });
})();
