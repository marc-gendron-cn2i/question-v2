// js/modules/menuOutils.js

// Écouteur unique sur tout le document pour gérer sidebar et sous-menus
document.addEventListener('click', (e) => {
  // 1️⃣ Bouton de collapse/expand du sidebar
  const toggleBtn = e.target.closest('#sidebarToggle');
  if (toggleBtn) {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    const ic = toggleBtn.querySelector('i');
    ic.classList.toggle('fa-chevron-right');
    ic.classList.toggle('fa-chevron-left');
    // Refermer tous les sous-menus quand on collapse
    if (sidebar.classList.contains('collapsed')) {
      document.querySelectorAll('.submenu').forEach(sub => sub.style.display = 'none');
    }
    return;
  }

  // 2️⃣ Boutons de sous-menu (déploiement et navigation)
  const btn = e.target.closest('.menu-toggle');
  if (btn) {
    // Si data-url, redirection directe
    const url = btn.dataset.url;
    if (url) {
      if (window.location.pathname !== url) {
        window.location.href = url;
      }
      return;
    }
    // Sinon, toggle du sous-menu
    const sub = btn.nextElementSibling;
    sub.style.display = (sub.style.display === 'block') ? 'none' : 'block';
    const ic = btn.querySelector('.toggle-icon');
    if (ic) {
      ic.classList.toggle('fa-chevron-up');
      ic.classList.toggle('fa-chevron-down');
    }
  }
});

