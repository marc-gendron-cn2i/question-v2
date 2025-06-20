// Analytics page logic
document.addEventListener('DOMContentLoaded', () => {
  const siteEl = document.getElementById('site');
  const dateEl = document.getElementById('date');
  const loadBtn = document.getElementById('loadData');
  const resultsContainer = document.getElementById('resultsContainer');
  const ctx = document.getElementById('hourlyChart')?.getContext('2d');
  let chart;

  async function loadResults() {
    const site = siteEl.value;
    const date = dateEl.value;
    if (!site || !date) return;
    const pollId = `${site}_${date}`;
    let pollData;
    try {
      const resp = await fetch(`https://hx9jzqon0l.execute-api.us-east-1.amazonaws.com/prod/poll/${pollId}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      pollData = await resp.json();
    } catch (err) {
      resultsContainer.innerHTML = `<div style="color:red;">Erreur chargement sondage : ${err.message}</div>`;
      return;
    }

    const total = pollData.votes.reduce((a,b)=>a+b,0);
    resultsContainer.innerHTML = `
      <h3 style="margin-bottom:1rem;">${pollData.question}</h3>
      ${pollData.options.map((opt,i) => {
        const pct = total ? Math.round((pollData.votes[i]/total)*100) : 0;
        return `
          <div class="result">
            <div class="flex">
              <span>${opt}</span>
              <span><b>${pct}%</b></span>
            </div>
            <div style="background:#eee;border-radius:4px;height:6px;">
              <div class="bar" style="width:${pct}%;"></div>
            </div>
          </div>`;
      }).join('')}
      <div class="meta"><b>${total}</b> répondant${total>1?'s':''}</div>
    `;

    let hoursUTC;
    try {
      const resp2 = await fetch(`https://hx9jzqon0l.execute-api.us-east-1.amazonaws.com/prod/hourly?pollId=${pollId}`);
      if (!resp2.ok) throw new Error(`HTTP ${resp2.status}`);
      hoursUTC = await resp2.json();
    } catch (err) {
      console.error('Erreur horaire :', err);
      return;
    }

    const offsetH = -new Date().getTimezoneOffset()/60;
    const hoursLocal = new Array(24).fill(0);
    for (let h=0; h<24; h++) {
      const loc = (h + offsetH + 24) % 24;
      hoursLocal[loc] = hoursUTC[h] || 0;
    }
    const labels = hoursLocal.map((_,i)=>`${i.toString().padStart(2,'0')}h`);

    const dataChart = {
      labels,
      datasets: [{
        label:"Votes par heure (heure locale)",
        data:hoursLocal,
        fill:false,
        tension:0.2,
        borderColor:"#d51D2C",
        backgroundColor:"#d51D2C"
      }]
    };
    if (chart) chart.destroy();
    if (ctx) {
      chart = new Chart(ctx, {
        type:'line',
        data: dataChart,
        options:{
          scales:{
            y:{ beginAtZero:true, title:{ display:true, text:"Nombre de votes" }},
            x:{ title:{ display:true, text:"Heure de la journée" }}
          }
        }
      });
    }
  }

  loadBtn?.addEventListener('click', loadResults);

  // Initialize date input
  const today = new Date().toISOString().split('T')[0];
  dateEl.value = today;
  dateEl.max   = today;
});
