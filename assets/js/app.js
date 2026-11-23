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
$('#trk').onchange=e=>{S.track=e.target.value;save();fillSubj();if(window.ministryLibraryRender)window.ministryLibraryRender()};

window.StudyEnglishCoach.init({getAI:()=>AI,errMsg,escapeHtml:esc,showAlert});

window.StudyEnglishCourse.init({state:S,save,escapeHtml:esc,showAlert});
window.StudyEnglishPath.init({state:S,save,escapeHtml:esc,showAlert});
window.StudySubjectCourses.init({state:S,save,escapeHtml:esc,showAlert});
const examCenter=window.StudyExamCenter.init({state:S,save,escapeHtml:esc});
const dashboard=window.StudyDashboard.init({state:S,escapeHtml:esc});
window.dashboardRender=dashboard.render;
const smartRevision=window.StudySmartRevision.init({state:S,save,escapeHtml:esc});
window.smartReviewRender=smartRevision.render;
const smartPlanner=window.StudySmartPlanner.init({state:S,save,escapeHtml:esc});
window.smartPlannerRender=smartPlanner.render;
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
