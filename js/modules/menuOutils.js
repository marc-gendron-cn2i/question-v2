// js/modules/menuOutils.js
document.addEventListener('click', (e) => {
  // 1) bouton de collapse/expand
  const collapseBtn = e.target.closest('#sidebarToggle');
  if (collapseBtn) {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');

    const ic = collapseBtn.querySelector('i');
    ic.classList.toggle('fa-chevron-left');
    ic.classList.toggle('fa-chevron-right');

    // refermer tous les sous-menus si collapsed
    if (sidebar.classList.contains('collapsed')) {
      sidebar.querySelectorAll('.submenu').forEach(sub => sub.style.display = 'none');
    }
    return;
  }

  // 2) menu-toggle (chevrons + navigation)
  const mt = e.target.closest('.menu-toggle');
  if (mt) {
    // navigation directe
    const url = mt.dataset.url;
    if (url) {
      if (location.pathname !== url) location.href = url;
      return;
    }
    // toggle du sous-menu
    const sub = mt.nextElementSibling;
    sub.style.display = sub.style.display === 'block' ? 'none' : 'block';

    const ic = mt.querySelector('.toggle-icon');
    ic.classList.toggle('fa-chevron-down');
    ic.classList.toggle('fa-chevron-up');
  }
});
