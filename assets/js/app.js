const $=s=>document.querySelector(s);
const {load:loadStudyState,save:saveStudyState}=window.StudyStorage;
let S=loadStudyState();
S.courseDone=S.courseDone||{};S.courseWords=S.courseWords||[];S.courseWriting=S.courseWriting||[];S.courseExamChecks=S.courseExamChecks||{};S.subjectLessonDone=S.subjectLessonDone||{};S.englishPathDone=S.englishPathDone||{};S.examHistory=Array.isArray(S.examHistory)?S.examHistory:[];
const save=()=>saveStudyState(S);
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
function showAlert(t){$('#alertText').textContent=t;$('#alert').style.display='block'}
$('#closeAlert').onclick=()=>$('#alert').style.display='none';

const {render:renderSched,checkReminders}=window.StudySchedule.init({state:S,save,uid,escapeHtml:esc,showAlert});

/* AI gateway — the API key stays on the Cloudflare Worker. */
const AI_ENDPOINT='https://sparkling-disk-d582ahmed-study-ai.1ahmednyx.workers.dev';
const AI=async(input)=>{
  const messages=Array.isArray(input)?input:[];
  const systemInstruction=messages.filter(item=>item.role==='system').map(item=>item.content).join('\n\n');
  const prompt=messages.length
    ? messages.filter(item=>item.role!=='system').map(item=>`${item.role==='assistant'?'المدرّس':'الطالب'}: ${item.content}`).join('\n\n')
    : String(input??'');
  const response=await fetch(AI_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt,systemInstruction})});
  const data=await response.json().catch(()=>({}));
  if(!response.ok){const code=data.error|| (response.status===429?'rate_limited':'request_failed');throw {code};}
  if(typeof data.text!=='string'||!data.text.trim())throw {code:'empty_response'};
  return {text:data.text.trim(),json:()=>{try{return JSON.parse(data.text)}catch(error){throw {code:'invalid_json'}}}};
};
AI.json=async prompt=>{const result=await AI(prompt);return result.json()};
const errMsg=c=>({
  rate_limited:'وصلنا للحد المؤقت للاستخدام. انتظر دقيقة ثم جرّب مرة أخرى.',
  provider_rate_limited:'وصلنا إلى حد Gemini المجاني حاليًا. جرّب لاحقًا.',
  provider_auth_error:'مفتاح Gemini غير صحيح أو لا يملك صلاحية الاستخدام. راجع السر في Cloudflare.',
  provider_unavailable:'خدمة الذكاء الاصطناعي غير متاحة مؤقتًا. حاول لاحقًا.',
  server_not_configured:'لم يتم إعداد مفتاح Gemini داخل Cloudflare بعد.',
  input_too_large:'الرسالة طويلة جدًا. اختصرها ثم أعد المحاولة.',
  origin_not_allowed:'هذا الموقع غير مسموح له باستخدام المدرّس.',
  empty_response:'لم يصل رد من المدرّس. حاول مرة أخرى.'
}[c]||'تعذر الاتصال بالمدرّس الذكي. تأكد من نشر Worker ثم حاول مرة أخرى.');
const {render:renderWords}=window.StudyWords.init({
  state:S,save,uid,escapeHtml:esc,
  getAI:()=>AI,
  getErrorMessage:code=>errMsg(code),
  showAlert
});

const TN={sci:'علمي علوم',math:'علمي رياضة',lit:'أدبي'};
const SUBJ={sci:['اللغة العربية','اللغة الأجنبية الأولى','الأحياء','الكيمياء','الفيزياء','اللغة الأجنبية الثانية','التربية الدينية','التربية الوطنية'],math:['اللغة العربية','اللغة الأجنبية الأولى','الرياضيات','الكيمياء','الفيزياء','اللغة الأجنبية الثانية','التربية الدينية','التربية الوطنية'],lit:['اللغة العربية','اللغة الأجنبية الأولى','التاريخ','الجغرافيا','الإحصاء','اللغة الأجنبية الثانية','التربية الدينية','التربية الوطنية']};
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
window.StudyEnglishPath.init({state:S,save,escapeHtml:esc,showAlert});
window.StudySubjectCourses.init({state:S,save,escapeHtml:esc,showAlert});
const examCenter=window.StudyExamCenter.init({state:S,save,escapeHtml:esc});
const dashboard=window.StudyDashboard.init({state:S,escapeHtml:esc});
window.dashboardRender=dashboard.render;
const smartRevision=window.StudySmartRevision.init({state:S,save,escapeHtml:esc});
window.smartReviewRender=smartRevision.render;
window.examCenterRender=examCenter.render;
window.StudyMinistryLibrary.init();

const {render:renderMist}=window.StudyMistakes.init({state:S,save,uid,today,addDays,escapeHtml:esc});

/* Preferences must initialize before tools receive its refresh callback. */
const {refresh:refreshPreferences}=window.StudyPreferences.init({state:S,save});
const {pmShow}=window.StudyTools.init({state:S,save,uid,today,addDays,escapeHtml:esc,showAlert,getAI:()=>AI,errMsg,getPlanText:()=>plText,renderSched,renderNotes,renderWords,renderPrac,renderMist,fillSubjects:fillSubj,refreshPreferences});

/* Tools and personalization are initialized in feature modules. */

fillSubj();renderPrac();renderMist();pmShow();
renderSched();renderNotes();renderWords();checkReminders();
// تسجيل عامل الخدمة لتشغيل التطبيق من الذاكرة المؤقتة عند توفره على HTTPS.
if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost')){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
