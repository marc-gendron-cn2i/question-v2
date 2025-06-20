// Sidebar toggling and submenu logic
const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebarToggle');

if (sidebar && toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    const ic = toggleBtn.querySelector('i');
    ic.classList.toggle('fa-chevron-right');
    ic.classList.toggle('fa-chevron-left');
    if (sidebar.classList.contains('collapsed')) {
      document.querySelectorAll('.submenu').forEach(sub => sub.style.display = 'none');
    }
  });
}

// Submenu toggles and navigation
document.querySelectorAll('.menu-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const url = btn.dataset.url;
    if (url) {
      if (window.location.pathname !== url) {
        window.location.href = url;
      }
      return;
    }
    const sub = btn.nextElementSibling;
    sub.style.display = sub.style.display === 'block' ? 'none' : 'block';
    const ic = btn.querySelector('.toggle-icon');
    if (ic) {
      ic.classList.toggle('fa-chevron-up');
      ic.classList.toggle('fa-chevron-down');
    }
  });
});
