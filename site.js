// Hamburger menu toggle
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('nav-menu');

function closeMenu() {
  menu.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open navigation menu');
}

toggle.addEventListener('click', function () {
  const isOpen = menu.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
  toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
});

menu.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('click', function (e) {
  if (!toggle.contains(e.target) && !menu.contains(e.target)) closeMenu();
});
