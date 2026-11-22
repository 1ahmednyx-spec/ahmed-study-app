(function(global){
  function init({state,save,escapeHtml:esc,showAlert}) {
    const $=s=>document.querySelector(s);
    const S=state;
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
  }
  global.StudyEnglishCourse={init};
})(window);
