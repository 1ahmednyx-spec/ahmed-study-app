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

/* English expert */
let turns=[];
const P=(t,k)=>{const m=t.match(new RegExp(k+':\\s*([\\s\\S]*?)(?=\\n(?:EN|FIX|WORD):|$)'));return m?m[1].trim():''};
const rules=()=>`أنت خبير تعليم إنجليزي على أعلى مستوى، بتدرّس لطالب مصري في ثالثة ثانوي. مستواه: ${$('#cLvl').value}. الوضع: ${$('#cMode').selectedOptions[0].text}. الموقف: ${$('#cScn').value}.\nتكلم إنجليزي طبيعي بيستخدمه الناس فعلًا في الحياة اليومية بمستوى يناسبه. رد بالشكل ده بالظبط في 3 أسطر:\nEN: ردك بالإنجليزي في جملتين أو 3 على الأكتر، وفي وضع المحادثة اختم بسؤال يكمل الحوار\nFIX: تصحيح أخطاء آخر رسالة له بالعربي المبسط مع الجملة الصحيحة، أو اكتب ممتاز لو مفيش أخطاء\nWORD: كلمة أو تعبير مفيد من الموقف بالشكل english = المعنى بالعربي\nفي وضع صحّح جملتي: ضع الجملة الصحيحة في EN واشرح السبب في FIX. في وضع اشرح لي قاعدة: اشرح القاعدة بمثال إنجليزي بسيط في EN وبالتفصيل بالعربي في FIX. لو كتب بالعربي سؤالًا عن اللغة جاوبه بنفس الشكل.`;
function renderChat(){
  const bot=t=>{const en=P(t,'EN'),fx=P(t,'FIX'),w=P(t,'WORD');return `<div class="b a"><div dir="ltr">${esc(en||t)}</div><div><button class="s" data-say="${esc(en||t)}">🔊 اسمع</button> <button class="s" data-tr="${esc(en||t)}">ترجم</button></div><div class="tr" style="font-size:14px;color:var(--brand)"></div>${fx?`<div class="fx">${esc(fx)}</div>`:''}${w.includes('=')?`<button class="s" data-addw="${esc(w)}">+ ${esc(w)}</button>`:''}</div>`};
  $('#cLog').innerHTML=turns.map(t=>t.role==='user'?`<div class="b u" dir="auto">${esc(t.content)}</div>`:bot(t.content)).join('')||'<div class="empty">اختار الموقف وابعت أول رسالة، حتى لو كلمة Hello</div>';
  $('#cLog').scrollTop=1e9}
$('#cSend').onclick=async()=>{
  const m=$('#cIn').value.trim();if(!m)return;
  if(!AI){$('#cSt').textContent='ميزة الذكاء الاصطناعي مش متاحة هنا';return}
  turns.push({role:'user',content:m});$('#cIn').value='';renderChat();$('#cSt').textContent='الخبير بيكتب…';$('#cSend').disabled=true;
  try{const {text}=await AI([{role:'user',content:rules()},...turns],{cache:false});turns.push({role:'assistant',content:text});$('#cSt').textContent='';say(P(text,'EN')||text)}
  catch(e){turns.pop();$('#cIn').value=m;$('#cSt').textContent=errMsg(e.code)}
  $('#cSend').disabled=false;while(turns.length>12)turns.splice(0,2);renderChat()};
$('#cClr').onclick=()=>{turns=[];renderChat()};

/* Practice and plan */
document.addEventListener('click',async e=>{
  const s=e.target.dataset.say,t=e.target.dataset.tr;
  if(s){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s);u.lang='en-US';u.rate=.9;speechSynthesis.speak(u)}catch(x){showAlert('المتصفح مش بيدعم النطق')}}
  if(t){const box=e.target.closest('.b').querySelector('.tr');
    if(!AI){box.textContent='ميزة الذكاء الاصطناعي مش متاحة';return}
    box.textContent='جاري الترجمة…';
    try{box.textContent=(await AI('ترجم النص ده للعربية المصرية المبسطة، وارجع الترجمة بس:\n'+t)).text}catch(x){box.textContent=errMsg(x.code)}}});
(async()=>{try{const d=await claude.use('dictation');if(!d)return;DICT=d;dictInit();return;let base='',on=false;const b=null;
  d.onPartial(({text})=>{$('#cIn').value=(base+' '+text).trim()});
  d.onFinal(({text})=>{base=($('#cIn').value=(base+' '+text).trim())});
  d.onState(({state})=>{on=state==='listening';b.textContent=on?'⏹ وقّف':'🎤 اتكلم'});
  b.onclick=()=>{if(on){d.stop();return}base=$('#cIn').value.trim();d.start().catch(()=>showAlert('لازم تسمح باستخدام الميكروفون'))}}catch(e){}})();

/* Voice conversation */
let DICT=null,listening=false,rec=null;
const micBtn=$('#cMic');micBtn.hidden=false;
function speak(t){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='en-US';u.rate=.9;speechSynthesis.speak(u)}catch(x){}}
function say(t){if($('#cAuto').checked)speak(t)}
function setMic(on){listening=on;micBtn.textContent=on?'⏹ وقّف':'🎤 اتكلم'}
function finish(t){$('#cIn').value=t;if($('#cAuto').checked&&t.trim())$('#cSend').click()}
function dictInit(){let t='';
  DICT.onPartial(({text})=>{if(listening)$('#cIn').value=(t+' '+text).trim()});
  DICT.onFinal(({text})=>{t=(t+' '+text).trim();$('#cIn').value=t});
  DICT.onState(({state})=>{const on=state==='listening';if(on){t='';setMic(true)}else if(listening){const x=t;t='';setMic(false);finish(x)}})}
micBtn.onclick=()=>{
  if(listening){try{rec?rec.stop():DICT.stop()}catch(e){}return}
  speechSynthesis&&speechSynthesis.cancel();
  const viaDict=()=>{if(!DICT){showAlert('الميكروفون مش متاح هنا، اكتب بالكيبورد');return}DICT.start().catch(()=>showAlert('لازم تسمح باستخدام الميكروفون'))};
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){viaDict();return}
  try{rec=new SR();rec.lang=$('#cLang').value;rec.interimResults=true;rec.continuous=false;let txt='';
    rec.onresult=ev=>{txt=[...ev.results].map(r=>r[0].transcript).join(' ');$('#cIn').value=txt};
    rec.onerror=ev=>{setMic(false);rec=null;if(['not-allowed','service-not-allowed','audio-capture'].includes(ev.error))viaDict();else if(ev.error!=='no-speech'&&ev.error!=='aborted')showAlert('مسمعتش كويس، جرّب تاني')};
    rec.onend=()=>{if(rec){rec=null;setMic(false);finish(txt)}};
    rec.start();setMic(true)}catch(e){rec=null;viaDict()}};


/* English 2027 curriculum */
const EC_UNITS=[
 {n:1,t:1,name:'Inside the World of Care',ar:'عالم الرعاية',grammar:'Present Perfect / Present Perfect Continuous',lessons:['My Day in the Hospital','Emergency Call','Tired Hands, Caring Hearts','Beyond the White Coat','My Blog Post']},
 {n:2,t:1,name:'The Power of Machines',ar:'قوة الآلات',grammar:'Reported Statements and Commands',lessons:['Vocabulary and reading','Reported statements','Reported commands','Writing practice']},
 {n:3,t:1,name:'Protect Nature, Protect Future',ar:'احمِ الطبيعة تحمِ المستقبل',grammar:'Modal Verbs: deduction, regret and blame',lessons:['Vocabulary and reading','Modal verbs for deduction','Regret and blame','Writing practice']},
 {n:4,t:1,name:'Marine Life',ar:'الحياة البحرية',grammar:'Adjectives and Compound Adjectives',lessons:['Vocabulary and reading','Adjectives','Compound adjectives','Writing practice']},
 {n:5,t:1,name:'From Muscles to Mindset',ar:'من العضلات إلى العقلية',grammar:'Causative Verbs: have / get',lessons:['Vocabulary and reading','Have something done','Get something done','Writing practice']},
 {n:6,t:1,name:"Let's Hang Out!",ar:'هيا نقضي وقتًا ممتعًا',grammar:'Reported Questions',lessons:['Vocabulary and reading','Reported questions','Reporting verbs','Writing practice']},
 {n:7,t:2,name:'At the Airport',ar:'في المطار',grammar:'Past Perfect / Past Perfect Continuous',lessons:['Vocabulary and reading','Past Perfect','Past Perfect Continuous','Writing practice']},
 {n:8,t:2,name:'A Journey Through Time',ar:'رحلة عبر الزمن',grammar:'Active / Passive Voice',lessons:['Vocabulary and reading','Active voice','Passive voice','Writing practice']},
 {n:9,t:2,name:"The Universe's Mysteries",ar:'أسرار الكون',grammar:'Verb Patterns',lessons:['Vocabulary and reading','Verb + infinitive','Verb + gerund','Verb patterns in context']},
 {n:10,t:2,name:"Peoples' Hospitality and Kindness",ar:'كرم الضيافة واللطف',grammar:'Relative Clauses',lessons:['Vocabulary and reading','Defining relative clauses','Non-defining relative clauses','Writing practice']},
 {n:11,t:2,name:'Literature',ar:'الأدب',grammar:'Comparative / Superlative Adjectives',lessons:['Vocabulary and reading','Comparatives','Superlatives','Writing practice']},
 {n:12,t:2,name:'University Life',ar:'الحياة الجامعية',grammar:'Tag Questions',lessons:['Vocabulary and reading','Positive and negative tags','Special cases','Writing practice']}
];
const EC_GRAMMAR=[
 ['Present Perfect Simple','have / has + past participle','نتيجة حالية أو خبرة أو فعل له صلة بالحاضر.','She has finished her work.'],
 ['Present Perfect Continuous','have / has + been + V-ing','التركيز على مدة الفعل أو استمراره حتى الآن.','They have been studying for two hours.'],
 ['Reported Statements','said (that) + reported clause','نقل الكلام مع مراعاة تغيّر الضمائر والزمن عند الحاجة.','“I am tired.” → He said that he was tired.'],
 ['Reported Commands','told / asked + object + to-infinitive','نقل الأمر أو الطلب باستخدام to أو not to.','“Close the door.” → She told me to close the door.'],
 ['Modal Verbs','must / may / might / can’t + infinitive','للاستنتاج والاحتمال، وتختلف قوة التأكد حسب الفعل المساعد.','He must be at home.'],
 ['Adjectives & Compound Adjectives','adjective + noun / compound adjective','وصف الأشخاص والأشياء، وقد يتكون الوصف من كلمتين بشرطة.','a well-known writer'],
 ['Causative: have / get','have / get + object + past participle','عندما نطلب من شخص آخر تنفيذ عمل لنا.','I had my phone repaired.'],
 ['Reported Questions','asked + if / whether / question word + subject + verb','نستخدم ترتيب الجملة الخبرية ولا نستخدم ترتيب السؤال المباشر.','“Where do you live?” → He asked where I lived.'],
 ['Past Perfect Simple','had + past participle','حدث اكتمل قبل حدث آخر في الماضي.','The train had left before we arrived.'],
 ['Past Perfect Continuous','had + been + V-ing','مدة فعل استمر قبل نقطة أو حدث في الماضي.','She had been waiting for an hour.'],
 ['Active / Passive Voice','object + be + past participle','نستخدم المبني للمجهول عندما نهتم بالفعل أو المفعول به.','The bridge was built in 1990.'],
 ['Verb Patterns','verb + to-infinitive / gerund','بعض الأفعال يتبعها مصدر وبعضها يتبعها ing، ويجب حفظ النمط.','decide to go / enjoy reading'],
 ['Relative Clauses','who / which / that / whose / where','لإضافة معلومات عن اسم، وقد تكون محددة أو غير محددة.','The woman who called is my teacher.'],
 ['Comparatives & Superlatives','-er / more … than; the -est / most …','للمقارنة بين اثنين أو أكثر مع مراعاة الصفات الشاذة.','This is the most useful book.'],
 ['Tag Questions','auxiliary + pronoun?','ذيل السؤال يعكس الإثبات أو النفي في الجملة الأساسية.','You are ready, aren’t you?']
];
const EC_READER=['The Arrival at Marseilles','A Treacherous Plot','Betrayal and Arrest',"The Prison of Château d'If",'A Ray of Hope','The Secret of the Treasure','Escape to Freedom','The Island of Monte Cristo','A New Identity','Justice and Revenge','The Fall of the Guilty','A New Dawn'];
const EC_QUIZ=[
 {q:'She ____ in this hospital since 2020.',o:['works','has worked','is working','worked'],a:1,e:'since مع فترة بدأت في الماضي وما زالت مرتبطة بالحاضر؛ Present Perfect.'},
 {q:'He said, “I am busy.” → He said that he ____ busy.',o:['is','has been','was','will be'],a:2,e:'في reported speech قد يرجع المضارع إلى الماضي: am → was.'},
 {q:'“Open your books.” The teacher told us ____ our books.',o:['open','opening','to open','opened'],a:2,e:'الأمر المنقول: told + object + to + infinitive.'},
 {q:'You ____ be exhausted. You have worked all day.',o:['must','can’t','shouldn’t','needn’t'],a:0,e:'must للتأكد أو الاستنتاج القوي.'},
 {q:'I had my laptop ____ yesterday.',o:['repair','repaired','repairing','to repair'],a:1,e:'صيغة causative: have + object + past participle.'},
 {q:'She asked me where I ____.',o:['live','did live','lived','do live'],a:2,e:'في reported questions نستخدم ترتيب الجملة الخبرية.'},
 {q:'By the time we arrived, the film ____.',o:['starts','has started','had started','was starting'],a:2,e:'الحدث الأسبق في الماضي: Past Perfect.'},
 {q:'The emails ____ every morning.',o:['send','are sent','sent','are sending'],a:1,e:'المضارع البسيط المبني للمجهول: am/is/are + past participle.'},
 {q:'I enjoy ____ English stories.',o:['read','to read','reading','reads'],a:2,e:'enjoy يأتي بعده gerund (V-ing).'},
 {q:'The student ____ won the prize is my friend.',o:['which','who','where','whose'],a:1,e:'who للعاقل في relative clauses.'},
 {q:'This is ____ interesting book I have read.',o:['more','most','the most','the more'],a:2,e:'صيغة التفضيل: the most + adjective.'},
 {q:'They have finished the task, ____?',o:['haven’t they','don’t they','didn’t they','have they'],a:0,e:'الجملة مثبتة، فيأتي tag منفي وبنفس الفعل المساعد.'}
];
let ecFlashIndex=0,ecFlashOpen=false,ecQuizSet=[],ecQuizAnswers={};
function ecRender(){
 const term=$('#ecTerm').value,query=($('#ecSearch').value||'').trim().toLowerCase();
 const units=EC_UNITS.filter(u=>(term==='all'||String(u.t)===term)&&(!query||`${u.name} ${u.ar} ${u.grammar} ${u.lessons.join(' ')}`.toLowerCase().includes(query)));
 $('#ecUnitList').innerHTML=units.map(u=>`<details class="course-unit"><summary><input class="course-done" type="checkbox" data-ec-done="${u.n}" ${S.courseDone[u.n]?'checked':''} aria-label="تمت مذاكرة الوحدة ${u.n}"><span><b>Unit ${u.n}: ${esc(u.name)}</b><br><span class="course-muted">${esc(u.ar)} · الترم ${u.t===1?'الأول':'الثاني'}</span></span></summary><div class="course-unit-body"><p><b>Grammar:</b> ${esc(u.grammar)}</p><div>${u.lessons.map(x=>`<span class="course-tag">${esc(x)}</span>`).join('')}</div><p class="course-muted">راجع مفردات النصوص والأنشطة والكتابة من الكتاب المدرسي، ثم أضف الكلمات الصعبة إلى قاموسك هنا.</p><a href="https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/English_language_Sec3_tr1.pdf" target="_blank" rel="noopener">افتح الكتاب المدرسي</a></div></details>`).join('')||'<div class="empty">لا توجد نتائج مطابقة للبحث.</div>';
 const done=EC_UNITS.filter(u=>S.courseDone[u.n]).length,pct=Math.round(done/12*100);$('#ecProgressText').textContent=`${done} من 12 وحدة`;$('#ecProgressPct').textContent=pct+'%';$('#ecProgressBar').style.width=pct+'%';
 $('#ecGrammarList').innerHTML=EC_GRAMMAR.filter(g=>!query||g.join(' ').toLowerCase().includes(query)).map(g=>`<div class="course-box"><h3>${esc(g[0])}</h3><div class="course-tag" dir="ltr">${esc(g[1])}</div><p>${esc(g[2])}</p><p dir="ltr" class="course-muted"><b>Example:</b> ${esc(g[3])}</p></div>`).join('');
 $('#ecReaderList').innerHTML=EC_READER.map((ch,i)=>`<details class="course-unit"><summary><input class="course-done" type="checkbox" data-ec-reader="${i+1}" ${S.courseDone['r'+(i+1)]?'checked':''} aria-label="تمت مذاكرة الفصل ${i+1}"><span><b>Chapter ${i+1}: ${esc(ch)}</b><br><span class="course-muted">${i<6?'Part 1 — Term 1':'Part 2 — Term 2'}</span></span></summary><div class="course-unit-body"><label for="ecReaderNote${i+1}">ملاحظاتك عن الفصل</label><textarea id="ecReaderNote${i+1}" data-reader-note="${i+1}" placeholder="الشخصيات، الأحداث، الكلمات الجديدة، وأسئلة الفصل…">${esc(S.courseWriting.find(x=>x.kind==='reader'&&x.id===i+1)?.answer||'')}</textarea><button class="s" type="button" data-save-reader="${i+1}">احفظ الملاحظات</button></div></details>`).join('');
 $('#ecWordUnit').innerHTML=EC_UNITS.map(u=>`<option value="${u.n}">Unit ${u.n} — ${esc(u.name)}</option>`).join('');
 ecRenderWords();ecRenderWriting();ecRenderChecklist();
}
function ecRenderWords(){const words=S.courseWords||[];$('#ecWordList').innerHTML=words.length?words.map((w,i)=>`<div class="course-word-row"><div><div class="course-en">${esc(w.word)}</div><div>${esc(w.meaning)}</div><div class="course-muted">Unit ${w.unit||'—'}</div></div><button class="x" type="button" data-ec-word-del="${i}" aria-label="حذف">×</button></div>`).join(''):'لا توجد كلمات بعد. أضف الكلمات من كتابك لتراجعها ببطاقات.';$('#ecFlashCount').textContent=words.length?`${words.length} كلمة محفوظة`:'ابدأ بإضافة كلماتك';if(words.length){ecFlashIndex%=words.length;ecFlashOpen=false;ecShowFlash()}else $('#ecFlash').textContent='أضف كلمات من الكتاب لتبدأ المراجعة'}
function ecShowFlash(){const w=S.courseWords[ecFlashIndex];if(!w)return;$('#ecFlash').innerHTML=`<div class="w">${esc(w.word)}</div>${ecFlashOpen?`<div class="a">${esc(w.meaning)}</div>`:'<div class="hint">حاول تفتكر المعنى ثم اضغط أظهر المعنى</div>'}`}
function ecRenderWriting(){const saved=(S.courseWriting||[]).filter(x=>x.kind==='practice');$('#ecWritingSaved').innerHTML=saved.length?'<h3>إجابات محفوظة</h3>'+saved.slice(-5).reverse().map(x=>`<div class="course-box"><b>${esc(x.type)}</b><p>${esc(x.prompt)}</p><div class="sum">${esc(x.answer)}</div></div>`).join(''):''}
function ecRenderChecklist(){const items=['راجعت كلمات كل وحدة وتدربت على استخدامها في جمل','راجعت قواعد الوحدات الاثنتي عشرة وحللت عليها','تدربت على قطع Reading واستخراج الفكرة والتفاصيل','كتبت موضوعات Writing وراجعت القواعد والإملاء','تدربت على الترجمة في الاتجاهين','راجعت فصول The Count of Monte Cristo','حللت تدريبات متنوعة وراجعت أخطائي'];$('#ecExamChecklist').innerHTML=items.map((x,i)=>`<label style="display:flex;gap:8px;align-items:center"><input type="checkbox" data-ec-check="${i}" ${S.courseExamChecks[i]?'checked':''} style="width:auto">${x}</label>`).join('')}
$('#ecSearch').oninput=ecRender;$('#ecTerm').onchange=ecRender;
document.querySelectorAll('[data-course-jump]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-course-jump]').forEach(x=>x.classList.toggle('active',x===b));$('#'+b.dataset.courseJump).scrollIntoView({behavior:'smooth',block:'start'})});
document.addEventListener('change',e=>{if(e.target.dataset.ecDone){S.courseDone[e.target.dataset.ecDone]=e.target.checked;save();ecRender()}if(e.target.dataset.ecReader){S.courseDone['r'+e.target.dataset.ecReader]=e.target.checked;save()}if(e.target.dataset.ecCheck!==undefined){S.courseExamChecks[e.target.dataset.ecCheck]=e.target.checked;save()}});
document.addEventListener('click',e=>{if(e.target.dataset.ecWordDel!==undefined){S.courseWords.splice(+e.target.dataset.ecWordDel,1);save();ecRenderWords()}if(e.target.dataset.saveReader){const id=+e.target.dataset.saveReader,answer=$(`[data-reader-note="${id}"]`).value;const old=S.courseWriting.find(x=>x.kind==='reader'&&x.id===id);if(old)old.answer=answer;else S.courseWriting.push({kind:'reader',id,answer});save();showAlert('تم حفظ ملاحظات الفصل')} });
$('#ecWordForm').onsubmit=e=>{e.preventDefault();S.courseWords.push({word:$('#ecWord').value.trim(),meaning:$('#ecMeaning').value.trim(),unit:+$('#ecWordUnit').value,known:false});save();e.target.reset();ecRenderWords();showAlert('اتضافت الكلمة لقاموسك')};
$('#ecFlashShow').onclick=()=>{ecFlashOpen=true;ecShowFlash()};$('#ecFlash').onclick=()=>{ecFlashOpen=!ecFlashOpen;ecShowFlash()};$('#ecFlashNext').onclick=()=>{if(!S.courseWords.length)return;ecFlashIndex=(ecFlashIndex+1)%S.courseWords.length;ecFlashOpen=false;ecShowFlash()};$('#ecFlashKnown').onclick=()=>{if(!S.courseWords.length)return;S.courseWords.splice(ecFlashIndex,1);save();ecRenderWords()};
$('#ecWritingSave').onclick=()=>{const prompt=$('#ecWritingPrompt').value.trim(),answer=$('#ecWritingAnswer').value.trim();if(!prompt||!answer){$('#ecWritingStatus').textContent='اكتب السؤال وإجابتك أولًا';return}S.courseWriting.push({kind:'practice',type:$('#ecWritingType').value,prompt,answer,date:new Date().toISOString()});save();$('#ecWritingStatus').textContent='تم الحفظ على هذا الجهاز';$('#ecWritingAnswer').value='';ecRenderWriting()};
$('#ecQuizStart').onclick=()=>{ecQuizSet=[...EC_QUIZ].sort(()=>Math.random()-.5).slice(0,5);ecQuizAnswers={};$('#ecQuizBox').innerHTML=ecQuizSet.map((q,i)=>`<div class="course-question"><b>${i+1}. ${esc(q.q)}</b>${q.o.map((o,j)=>`<label><input type="radio" name="ecq${i}" value="${j}"> <span dir="ltr">${esc(o)}</span></label>`).join('')}<div class="course-feedback" id="ecqf${i}" hidden></div></div>`).join('')+'<button class="p" id="ecQuizSubmit" type="button">صحّح الاختبار</button><div id="ecQuizResult"></div>';$('#ecQuizSubmit').onclick=()=>{let score=0;ecQuizSet.forEach((q,i)=>{const v=document.querySelector(`input[name="ecq${i}"]:checked`),ok=v&&+v.value===q.a;if(ok)score++;const f=$('#ecqf'+i);f.hidden=false;f.textContent=(ok?'صحيح. ':'الإجابة الصحيحة: '+q.o[q.a]+'. ')+q.e});$('#ecQuizResult').innerHTML=`<div class="course-feedback"><b>نتيجتك: ${score} من ${ecQuizSet.length}</b></div>`}};
ecRender();

/* Tools */
let plText='',xQ='',xTi=null,pmI=null;
// تنزيل الملفات مباشرة من المتصفح بدل الاعتماد على بيئة Claude الخاصة.
function downloadFile(filename,data,mime='text/plain;charset=utf-8'){
  const blob=new Blob([data],{type:mime});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=filename;
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
const today=()=>new Date().toLocaleDateString('en-CA');
const addDays=n=>{const d=new Date();d.setDate(d.getDate()+n);return d.toLocaleDateString('en-CA')};
const tm=s=>String(Math.floor(Math.max(0,s)/60)).padStart(2,'0')+':'+String(Math.max(0,s)%60).padStart(2,'0');
const noAI=el=>{el.textContent='الذكاء الاصطناعي غير مفعّل في نسخة GitHub Pages الحالية. الأدوات الأساسية والحفظ المحلي يعملان.'};

$('#plAdd').onclick=async()=>{const st=$('#plSt');if(!AI)return noAI(st);st.textContent='جاري الإضافة…';
  try{const arr=await AI.json(`اليوم ${today()}. حوّل خطة المذاكرة دي لجلسات في الجدول للأيام السبعة الجاية فقط. ارجع JSON فقط: مصفوفة عناصرها {"title":"المادة وموضوع الجلسة","date":"YYYY-MM-DD","time":"HH:MM"} بحد أقصى 14 جلسة والوقت بنظام 24 ساعة.\nالخطة:\n${plText}`);
    if(!Array.isArray(arr))throw {code:'invalid_json'};
    arr.slice(0,14).forEach(x=>{if(x.title&&/^\d{4}-\d\d-\d\d$/.test(x.date)&&/^\d\d:\d\d$/.test(x.time))S.ev.push({id:uid(),title:String(x.title),d:x.date,t:x.time,lead:10,fired:false,done:false})});
    save();renderSched();st.textContent='اتضافت للجدول'}catch(e){st.textContent=errMsg(e.code)}};

const {render:renderMist}=window.StudyMistakes.init({state:S,save,uid,today,addDays,escapeHtml:esc});

$('#xGo').onclick=async()=>{const t=$('#xT').value.trim(),st=$('#xSt');
  if(!AI)return noAI(st);if(!t){st.textContent='اكتب الدرس الأول';return}
  st.textContent='جاري تجهيز الامتحان…';
  try{xQ=(await AI(`أنت مدرس يساعد الطالب على التدريب في مادة ${$('#xS').value} على الدروس التالية: 5 أسئلة اختيار من متعدد (أ، ب، ج، د) و3 أسئلة مقالية، بمستوى مناسب للثانوية العامة، واعتمد على الدروس التي أرسلها الطالب فقط. اكتب الأسئلة فقط من غير إجابات.\nالدروس:\n${t}`)).text;
    $('#xQ').textContent=xQ;$('#xA').value='';$('#xRes').innerHTML='';$('#xBox').hidden=false;st.textContent='';
    const end=Date.now()+Math.max(5,+$('#xM').value||30)*60000;clearInterval(xTi);
    const tick=()=>{const s=Math.round((end-Date.now())/1000);$('#xTm').textContent=tm(s);if(s<=0){clearInterval(xTi);showAlert('انتهى الوقت، سلّم إجاباتك')}};tick();xTi=setInterval(tick,1000)}
  catch(e){st.textContent=errMsg(e.code)}};
$('#xEnd').onclick=async()=>{clearInterval(xTi);const st=$('#xSt');st.textContent='جاري التصحيح…';
  try{const {text}=await AI(`صحّح إجابات طالب ثانوية عامة على الامتحان ده بصرامة وعدل، وبالعربي المبسط: الدرجة من 20، وكل سؤال وهل إجابته صح وإيه الصح لو غلط، وبعدين أهم 3 نقاط ضعف يراجعها.\nالأسئلة:\n${xQ}\n\nإجابات الطالب:\n${$('#xA').value.trim()||'لم يجب'}`);
    $('#xRes').innerHTML=`<div class="sum">${esc(text)}</div>`;$('#xBox').hidden=true;st.textContent=''}catch(e){st.textContent=errMsg(e.code)}};

$('#aGo').onclick=async()=>{const t=$('#aT').value.trim(),q=$('#aQ').value.trim(),st=$('#aSt');
  if(!AI)return noAI(st);if(!t||!q){st.textContent='الصق نص الدرس واكتب سؤالك';return}
  st.textContent='جاري الشرح…';
  try{const {text}=await AI(`اشرح للطالب النقطة دي بأسلوب مبسط وبأمثلة، وبالاعتماد على نص الدرس بس. لو الإجابة مش في النص قول كده بوضوح.\nالنص:\n${t}\nالسؤال: ${q}`);
    $('#aOut').innerHTML=`<div class="sum">${esc(text)}</div>`;st.textContent=''}catch(e){st.textContent=errMsg(e.code)}};

function pmShow(){$('#pmSt').textContent=`مذاكرتك الفعلية النهاردة: ${S.focus[today()]||0} دقيقة`}
$('#pmGo').onclick=()=>{clearInterval(pmI);const end=Date.now()+25*60000;
  const tick=()=>{const s=Math.round((end-Date.now())/1000);$('#pmT').textContent=tm(s);if(s<=0){clearInterval(pmI);S.focus[today()]=(S.focus[today()]||0)+25;save();pmShow();showAlert('خلصت 25 دقيقة، خد راحة 5 دقايق')}};tick();pmI=setInterval(tick,1000)};
$('#pmX').onclick=()=>{clearInterval(pmI);$('#pmT').textContent='25:00'};

$('#rGo').onclick=async()=>{const s=$('#rS').value,n=S.notes.filter(x=>x.sub===s),st=$('#rSt');
  if(!n.length){st.textContent='مفيش ملخصات محفوظة للمادة دي';return}
  try{downloadFile('revision-sheet.md',`# ورقة مراجعة: ${s}\n\n`+n.map(x=>`## ${x.title}\n${x.sum}`).join('\n\n'),'text/markdown;charset=utf-8');st.textContent='تم تجهيز ورقة المراجعة'}catch(e){st.textContent='مقدرتش أحفظ الملف'}};
$('#bkGo').onclick=async()=>{
  try{downloadFile('study-backup.json',JSON.stringify(S,null,2),'application/json;charset=utf-8');$('#bkSt').textContent='تم تنزيل النسخة الاحتياطية'}catch(e){$('#bkSt').textContent='مقدرتش أحفظ الملف'}};
$('#bkIn').onchange=async e=>{const f=e.target.files[0];if(!f)return;
  try{const d=JSON.parse(await f.text());if(!d||typeof d!=='object'||Array.isArray(d))throw 0;const arrayKeys=['ev','notes','words','prac','mist'];if(arrayKeys.some(k=>k in d&&!Array.isArray(d[k])))throw 0;if('track' in d&&!['sci','math','lit'].includes(d.track))throw 0;const allowed=['ev','notes','words','track','prac','goal','mist','focus','courseDone','courseWords','courseWriting','courseExamChecks','theme','app','me','color'];if(Object.keys(d).some(k=>!allowed.includes(k)))throw 0;Object.assign(S,d);save();renderSched();renderNotes();renderWords();renderPrac();renderMist();pmShow();fillSubj();$('#bkSt').textContent='اترجعت بياناتك'}
  catch(x){$('#bkSt').textContent='الملف ده مش نسخة صالحة'}};

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

fillSubj();renderPrac();renderChat();renderMist();pmShow();
renderSched();renderNotes();renderWords();checkReminders();
// تسجيل عامل الخدمة لتشغيل التطبيق من الذاكرة المؤقتة عند توفره على HTTPS.
if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost')){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
