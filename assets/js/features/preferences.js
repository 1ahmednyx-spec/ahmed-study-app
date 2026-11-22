(function(global){
  function init({state,save}) {
    const $=s=>document.querySelector(s);
    const S=state;
    const COLS=['#1677E8','#2563EB','#4F46E5','#0891B2','#0F766E','#475569'];
    function applyTheme(){const r=document.documentElement.style,n=S.app||'Ahmed Study Platform',theme=S.theme||'light';
      document.documentElement.dataset.theme=theme;
      $('#brandName').textContent=n;document.title=n+' | منصة أحمد التعليمية';$('#hi').textContent=S.me?`أهلًا يا ${S.me}`:'';
      const toggle=$('#themeToggle');if(toggle){toggle.textContent=theme==='dark'?'☀':'☾';toggle.setAttribute('aria-label',theme==='dark'?'تفعيل الوضع الفاتح':'تفعيل الوضع الداكن');toggle.title=theme==='dark'?'تفعيل الوضع الفاتح':'تفعيل الوضع الداكن'}
      if(S.color){r.setProperty('--brand',S.color);r.setProperty('--on-brand','#fff')}}
    $('#cuCols').innerHTML=COLS.map(c=>`<button type="button" data-col="${c}" aria-label="لون" style="width:38px;height:38px;border-radius:50%;border:2px solid var(--line);margin-inline-end:8px;cursor:pointer;background:${c}"></button>`).join('');
    function refresh(){applyTheme();$('#cuA').value=S.app||'';$('#cuM').value=S.me||''}
    $('#cuA').value=S.app||'';$('#cuM').value=S.me||'';
    $('#themeToggle').onclick=()=>{S.theme=(S.theme||'light')==='dark'?'light':'dark';save();applyTheme()};
    $('#cuA').oninput=e=>{S.app=e.target.value.trim();save();applyTheme()};
    $('#cuM').oninput=e=>{S.me=e.target.value.trim();save();applyTheme()};
    document.addEventListener('click',e=>{const c=e.target.dataset.col;if(c){S.color=c;save();applyTheme()}});
    refresh();
    return {refresh};
  }
  global.StudyPreferences={init};
})(window);
