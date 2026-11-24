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

/* Secure AI connection: requests go to the same-origin Cloudflare Worker. */
async function requestAI(input, responseFormat = "text") {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ input, responseFormat })
  });
  let payload;
  try { payload = await response.json(); }
  catch { throw { code: "invalid_response" }; }
  if (!response.ok) {
    const providerStatus = Number.isInteger(payload?.error?.provider_status)
      ? payload.error.provider_status : undefined;
    const rawProviderCode = payload?.error?.provider_code;
    const providerCode = typeof rawProviderCode === "string" &&
      /^[A-Z][A-Z0-9_]{0,63}$/.test(rawProviderCode) ? rawProviderCode : undefined;
    throw {
      code: payload?.error?.code || "request_failed",
      providerStatus,
      providerCode
    };
  }
  if (typeof payload.text !== "string") throw { code: "invalid_response" };
  return payload.text;
}
const AI = input => requestAI(input).then(text => ({ text }));
AI.json = async input => {
  const text = await requestAI(input, "json");
  try { return JSON.parse(text); }
  catch { throw { code: "invalid_json" }; }
};
const errMsg=error=>{
  const c=typeof error==='string'?error:error?.code;
  const message=({
    rate_limited:'تم الوصول إلى حد الاستخدام مؤقتًا. انتظر قليلًا ثم حاول مجددًا.',
    missing_server_secret:'لم تتم إضافة مفتاح Gemini إلى أسرار Cloudflare بعد.',
    invalid_api_key:'رفضت Google مفتاح Gemini أو صلاحيات الوصول للمشروع. راجع إعدادات المفتاح وتفعيل الخدمة.',
    provider_bad_request:'رفضت Google صيغة الطلب المرسل إلى Gemini.',
    provider_unavailable:'خدمة Gemini غير متاحة حاليًا. حاول لاحقًا.',
    provider_error:'حدث خطأ في خدمة الذكاء الاصطناعي.',
    invalid_json:'تعذر قراءة النتيجة المنظمة. حاول مرة أخرى.'
  }[c]||'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. حاول مرة أخرى.');
  const details=[];
  if(Number.isInteger(error?.providerStatus))details.push('HTTP '+error.providerStatus);
  if(typeof error?.providerCode==='string'&&/^[A-Z][A-Z0-9_]{0,63}$/.test(error.providerCode))details.push(error.providerCode);
  return details.length?message+' (تفاصيل Google: '+details.join('، ')+')':message;
};
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
const teacherPlatforms = window.StudyTeacherPlatforms.init({state:S,save,escapeHtml:esc,showAlert});
window.teacherPlatformsRender=teacherPlatforms.render;
window.StudyPastExamArchive.init();

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
