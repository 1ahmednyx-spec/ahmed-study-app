const $=s=>document.querySelector(s);
const {load:loadStudyState,save:saveStudyState}=window.StudyStorage;
let S=loadStudyState();
S.courseDone=S.courseDone||{};S.courseWords=S.courseWords||[];S.courseWriting=S.courseWriting||[];S.courseExamChecks=S.courseExamChecks||{};
const save=()=>saveStudyState(S);
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
function showAlert(t){$('#alertText').textContent=t;$('#alert').style.display='block'}
$('#closeAlert').onclick=()=>$('#alert').style.display='none';

const {render:renderSched,checkReminders}=window.StudySchedule.init({state:S,save,uid,escapeHtml:esc,showAlert});

/* AI */
let AI=null;
(async()=>{try{AI=await claude.use('sample')}catch(e){}})();
const errMsg=c=>({not_granted:'لازم توافق على استخدام Claude',rate_limited:'الاستخدام كتير، جرّب بعد شوية',sampling_disabled:'الذكاء الاصطناعي غير متاح لحسابك'}[c]||'حصلت مشكلة، جرّب تاني');
const {render:renderWords}=window.StudyWords.init({
  state:S,save,uid,escapeHtml:esc,
  getAI:()=>AI,
  getErrorMessage:code=>errMsg(code),
  showAlert
});

const TN={sci:'علمي علوم',math:'علمي رياضة',lit:'أدبي'};
const SUBJ={sci:['اللغة العربية','اللغة الإنجليزية','اللغة الأجنبية الثانية','الأحياء','الكيمياء','الفيزياء','الجيولوجيا'],math:['اللغة العربية','اللغة الإنجليزية','اللغة الأجنبية الثانية','الرياضيات','الفيزياء','الكيمياء'],lit:['اللغة العربية','اللغة الإنجليزية','اللغة الأجنبية الثانية','التاريخ','الجغرافيا','الفلسفة والمنطق','علم النفس والاجتماع']};
const {render:renderNotes}=window.StudyNotes.init({
  state:S,save,uid,escapeHtml:esc,
  getAI:()=>AI,
  getTrackLabel:()=>TN[S.track],
  getErrorMessage:code=>errMsg(code)
});

const today=()=>new Date().toLocaleDateString('en-CA');
const addDays=n=>{const d=new Date();d.setDate(d.getDate()+n);return d.toLocaleDateString('en-CA')};
let plText='';
const {render:renderPrac}=window.StudyPractice.init({
  state:S,save,uid,escapeHtml:esc,showAlert,
  getAI:()=>AI,
  getTrackLabel:()=>TN[S.track],
  getSubjects:()=>SUBJ[S.track],
  getErrorMessage:code=>errMsg(code),
  setPlanText:text=>{plText=text}
});

function fillSubj(){
  const o=SUBJ[S.track].concat('مادة أخرى').map(s=>`<option>${esc(s)}</option>`).join('');
  ['#nS','#pS','#mS','#rS','#xS'].forEach(id=>{const el=$(id),v=el.value;el.innerHTML=o;if(v)el.value=v});
  $('#trk').value=S.track}
$('#trk').onchange=e=>{S.track=e.target.value;save();fillSubj()};

window.StudyEnglishCoach.init({getAI:()=>AI,errMsg,escapeHtml:esc,showAlert});

window.StudyEnglishCourse.init({state:S,save,escapeHtml:esc,showAlert});

const {render:renderMist}=window.StudyMistakes.init({state:S,save,uid,today,addDays,escapeHtml:esc});
const {pmShow}=window.StudyTools.init({state:S,save,uid,today,addDays,escapeHtml:esc,showAlert,getAI:()=>AI,errMsg,getPlanText:()=>plText,renderSched,renderNotes,renderWords,renderPrac,renderMist,fillSubjects:fillSubj});

/* Tools and personalization are initialized in feature modules. */
/* Personalization */
const COLS=['#1677E8','#2563EB','#4F46E5','#0891B2','#0F766E','#475569'];
function applyTheme(){const r=document.documentElement.style,n=S.app||'Ahmed Study Platform',theme=S.theme||'light';
  document.documentElement.dataset.theme=theme;
  $('#brandName').textContent=n;document.title=n+' | منصة أحمد التعليمية';$('#hi').textContent=S.me?`أهلًا يا ${S.me}`:'';
  const toggle=$('#themeToggle');if(toggle){toggle.textContent=theme==='dark'?'☀':'☾';toggle.setAttribute('aria-label',theme==='dark'?'تفعيل الوضع الفاتح':'تفعيل الوضع الداكن');toggle.title=theme==='dark'?'تفعيل الوضع الفاتح':'تفعيل الوضع الداكن'}
  if(S.color){r.setProperty('--brand',S.color);r.setProperty('--on-brand','#fff')}}
$('#cuCols').innerHTML=COLS.map(c=>`<button type="button" data-col="${c}" aria-label="لون" style="width:38px;height:38px;border-radius:50%;border:2px solid var(--line);margin-inline-end:8px;cursor:pointer;background:${c}"></button>`).join('');
$('#cuA').value=S.app||'';$('#cuM').value=S.me||'';
$('#themeToggle').onclick=()=>{S.theme=(S.theme||'light')==='dark'?'light':'dark';save();applyTheme()};
$('#cuA').oninput=e=>{S.app=e.target.value.trim();save();applyTheme()};
$('#cuM').oninput=e=>{S.me=e.target.value.trim();save();applyTheme()};
document.addEventListener('click',e=>{const c=e.target.dataset.col;if(c){S.color=c;save();applyTheme()}});
applyTheme();

fillSubj();renderPrac();renderMist();pmShow();
renderSched();renderNotes();renderWords();checkReminders();
// تسجيل عامل الخدمة لتشغيل التطبيق من الذاكرة المؤقتة عند توفره على HTTPS.
if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost')){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
