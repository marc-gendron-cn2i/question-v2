// Classement page logic
document.addEventListener('DOMContentLoaded', () => {
  const API_BASE = "https://hx9jzqon0l.execute-api.us-east-1.amazonaws.com/prod";
  const siteEl = document.getElementById("site");
  const startEl = document.getElementById("start");
  const endEl = document.getElementById("end");
  const loadBtn = document.getElementById("loadRanking");
  const loadMoreBtn = document.getElementById("loadMore");
  const exportBtn = document.getElementById("exportCSV");
  const rankingContainer = document.getElementById("rankingContainer");
  let fullRanking = [], displayIndex = 0;

  async function fetchRanking() {
    const site = siteEl.value;
    const start = startEl.value;
    const end = endEl.value;
    if (!site || !start || !end) return;

    rankingContainer.innerHTML = "<div style='color:#888;'>Chargement…</div>";
    loadMoreBtn.style.display = "none";
    exportBtn.style.display   = "none";
    fullRanking = []; displayIndex = 0;

    try {
      const resp = await fetch(`${API_BASE}/ranking?site=${site}&start=${start}&end=${end}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      fullRanking = await resp.json();
    } catch {
      rankingContainer.innerHTML = `<div style="color:red;">Erreur au chargement des données.</div>`;
      return;
    }

    if (!fullRanking.length) {
      rankingContainer.innerHTML = `<div style='color:#888;'>Aucun résultat pour ces critères.</div>`;
      return;
    }

    renderMore();
    exportBtn.style.display = "inline-block";
  }

  function renderMore() {
    const slice = fullRanking.slice(displayIndex, displayIndex+25);
    if (displayIndex === 0) {
      rankingContainer.innerHTML = `
        <div class="user-entry header">
          <span>Identifiant ArcID</span><span>Nombre de votes</span>
        </div>`;
    }
    slice.forEach(({id,count}) => {
      const div = document.createElement("div");
      div.className = "user-entry";
      div.innerHTML = `<span>${id}</span><span><b>${count}</b></span>`;
      rankingContainer.appendChild(div);
    });
    displayIndex += slice.length;
    loadMoreBtn.style.display = displayIndex < fullRanking.length ? "block" : "none";
  }
  function exportToCSV() {
    if (!fullRanking.length) return;
    const header = ['ArcID','Nombre de votes'];
    const lines  = [
      header.join(','),
      ...fullRanking.map(u => `"${u.id}","${u.count}"`)
    ];
    const csv = "\uFEFF" + lines.join("\r\n");
    const blob= new Blob([csv], { type:'text/csv;charset=utf-8;' });
    const link= URL.createObjectURL(blob);
    const a   = document.createElement('a');
    a.href = link; a.download = "classement_utilisateurs.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  loadBtn?.addEventListener("click", fetchRanking);
  loadMoreBtn?.addEventListener("click", renderMore);
  exportBtn?.addEventListener("click", exportToCSV);

  // Initialize date fields
  const today = new Date();
  const fmt = d => d.toISOString().slice(0,10);
  const endDate = new Date(today); endDate.setDate(endDate.getDate()-1);
  const startDate = new Date(today); startDate.setDate(startDate.getDate()-30);
  startEl.value = fmt(startDate);
  endEl.value   = fmt(endDate);
  startEl.max   = fmt(endDate);
  endEl.max     = fmt(endDate);
});
