// Générateur de bouton logic
document.addEventListener('DOMContentLoaded', function() {
  // Color pickers sync
  [['btnColorPicker','btnColor'],['textColorPicker','textColor'],['titleColorPicker','titleColor']]
    .forEach(([cp,tf])=>{
      const c=document.getElementById(cp), t=document.getElementById(tf);
      c?.addEventListener('input',()=>t.value=c.value);
      t?.addEventListener('input',()=>c.value=t.value);
    });
  // Background toggle
  const bgFields = document.getElementById('bgFields');
  document.getElementById('withBackground')?.addEventListener('change',function(){
    if (bgFields) bgFields.style.display = this.checked ? 'block' : 'none';
  });
  // Formatting buttons
  document.querySelectorAll('.format-buttons button').forEach(btn=>{
    btn.addEventListener('click',function(){
      const tgt=this.dataset.target||'text';
      const el=document.getElementById(tgt);
      el?.focus();
      document.execCommand(this.dataset.cmd,false,null);
    });
  });
  // Advanced options toggle
  document.getElementById('advancedOptionsToggle')?.addEventListener('click',function(){
    const p=document.getElementById('advancedOptions');
    const show = p.style.display !== 'block';
    p.style.display = show ? 'block' : 'none';
    this.textContent = show ? 'Cacher les options avancées' : 'Afficher les options avancées';
  });
  // Generate code
  document.querySelector('.generate')?.addEventListener('click',function(){
    const url = document.getElementById('url').value.trim();
    if (!url) {
      document.getElementById('previewFrame').srcdoc = '<div class="warning">⚠️ Entrer une URL.</div>';
      return;
    }
    const uid = Date.now(),
          v   = id => document.getElementById(id).value,
          w   = document.getElementById('withBackground').checked,
          txt = document.getElementById('text').innerHTML,
          btncol = v('btnColor'), txtcol = v('textColor'),
          bg = v('bgImage'), ttl = document.getElementById('overlayTitle').innerHTML,
          ts = v('titleSpacing'), tfs = v('titleFontSize'),
          tff = v('titleFontFamily'), tcol = v('titleColor'),
          bl = v('blurPercent'), blockH = v('blockHeight'),
          br = v('borderRadius'), fs = v('buttonFontSize'),
          effect = document.querySelector('input[name="hoverEffect"]:checked').value,
          hoverCss = effect === 'darken'
            ? 'filter:brightness(85%);'
            : 'filter:brightness(115%);';

    // Ensure minimum height
    let btnW = v('buttonWidth'), btnH = v('buttonHeight'),
        minH = parseInt(fs) + (w ? 16 : 32);
    if (parseInt(btnH) < minH) {
      btnH = minH + 'px';
      document.getElementById('buttonHeight').value = btnH;
    }

    // Build HTML preview
    const titleHTML = ttl ? `<div style="margin-bottom:${ts};font-size:${tfs};font-family:${tff};color:${tcol}">${ttl}</div>` : '';
    let html;
    if (w) {
      html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
  html,body{margin:0;padding:0;height:100%;overflow:hidden;}
  @import url('https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;700&display=swap');
  #wr${uid}{position:relative;width:100%;height:${blockH};display:flex;flex-direction:column;justify-content:center;align-items:center;padding:0 16px;box-sizing:border-box;}
  #wr${uid}::before{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background:url('${bg}') center/cover no-repeat;filter:blur(${bl}px);}
  #wr${uid}>*{position:relative;z-index:1;}#wr${uid} a{text-decoration:none;}
  #btn${uid}{background:${btncol};color:${txtcol};padding:8px 35px;font-size:${fs};border:none;border-radius:${br};width:${btnW};height:${btnH};display:flex;align-items:center;justify-content:center;white-space:nowrap;cursor:pointer;transition:filter .4s;}
  #btn${uid}:hover{${hoverCss}}
</style></head><body><div id="wr${uid}">${titleHTML}<a href="${url}" target="_blank"><button id="btn${uid}">${txt}</button></a></div></body></html>`;
    } else {
      html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
  html,body{margin:0;padding:0;height:100%;overflow:hidden;}
  @import url('https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;700&display=swap');
  body{display:flex;justify-content:center;align-items:center;font-family:'Red Hat Display',sans-serif;}
  #btn${uid}{background:${btncol};color:${txtcol};padding:16px;font-size:${fs};border:none;border-radius:${br};width:${btnW};height:${btnH};display:flex;align-items:center;justify-content:center;white-space:nowrap;cursor:pointer;transition:filter .4s;}
  #btn${uid}:hover{${hoverCss}}
</style></head><body><button id="btn${uid}" onclick="window.open('${url}','_blank')">${txt}</button></body></html>`;
    }
    const frame = document.getElementById('previewFrame');
    frame.srcdoc = html;
    frame.style.height = blockH;

    // Shadow DOM embed code
    const shadowCss = `:host{display:block;width:100%;}.wrapper{position:relative;display:flex;justify-content:center;align-items:center;height:${blockH};}.wrapper::before{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background-image:url('${bg}');background-size:cover;background-position:center;filter:blur(${bl}px);}.wrapper>*{position:relative;z-index:1;}.wrapper a{text-decoration:none;}button{background:${btncol};color:${txtcol};padding:16px;font-size:${fs};border:none;border-radius:${br};cursor:pointer;transition:filter .4s;}button:hover{${hoverCss}}`;
    const innerHTML = `<div class="wrapper">${titleHTML}<a href="${url}" target="_blank"><button>${txt}</button></a></div>`;
    const embedCode = `<div id="shorthand-btn-${uid}"></div><script>(function(){const c=document.getElementById("shorthand-btn-${uid}"),s=c.attachShadow({mode:"open"}),style=document.createElement("style");style.textContent=\`${shadowCss}\`;s.appendChild(style);const wrapper=document.createElement("div");wrapper.className="wrapper";wrapper.innerHTML=\`${innerHTML}\`;s.appendChild(wrapper);})();</script>`;
    document.getElementById('codeOutput').value = embedCode.trim();
  });

  // Copy button logic
  document.querySelector('.copy')?.addEventListener('click', async () => {
    const code = document.getElementById('codeOutput').value;
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.getElementById('codeOutput');
      ta.select();
      document.execCommand('copy');
    }
    alert('Code copié !');
  });
});
