(function(global){
  function init({state,save,uid,today,addDays,escapeHtml:esc,showAlert,getAI,errMsg,getPlanText,renderSched,renderNotes,renderWords,renderPrac,renderMist,fillSubjects,refreshPreferences}) {
    const $=s=>document.querySelector(s);
    const S=state;
    const ai=()=>getAI();
    let xQ='',xTi=null,pmI=null;
    // تنزيل الملفات مباشرة من المتصفح بدل الاعتماد على بيئة Claude الخاصة.
    function downloadFile(filename,data,mime='text/plain;charset=utf-8'){
      const blob=new Blob([data],{type:mime});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');a.href=url;a.download=filename;
      document.body.appendChild(a);a.click();a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
    const tm=s=>String(Math.floor(Math.max(0,s)/60)).padStart(2,'0')+':'+String(Math.max(0,s)%60).padStart(2,'0');
    const noAI=el=>{el.textContent='خدمة الذكاء الاصطناعي غير متاحة حاليًا. تحقق من إعدادات الخادم ثم حاول مرة أخرى.'};
    
    $('#plAdd').onclick=async()=>{const st=$('#plSt');if(!ai())return noAI(st);st.textContent='جاري الإضافة…';
      try{const arr=await ai().json(`اليوم ${today()}. حوّل خطة المذاكرة دي لجلسات في الجدول للأيام السبعة الجاية فقط. ارجع JSON فقط: مصفوفة عناصرها {"title":"المادة وموضوع الجلسة","date":"YYYY-MM-DD","time":"HH:MM"} بحد أقصى 14 جلسة والوقت بنظام 24 ساعة.\nالخطة:\n${getPlanText()}`);
        if(!Array.isArray(arr))throw {code:'invalid_json'};
        arr.slice(0,14).forEach(x=>{if(x.title&&/^\d{4}-\d\d-\d\d$/.test(x.date)&&/^\d\d:\d\d$/.test(x.time))S.ev.push({id:uid(),title:String(x.title),d:x.date,t:x.time,lead:10,fired:false,done:false})});
        save();renderSched();st.textContent='اتضافت للجدول'}catch(e){st.textContent=errMsg(e)}};
    
    $('#xGo').onclick=async()=>{const t=$('#xT').value.trim(),st=$('#xSt');
      if(!ai())return noAI(st);if(!t){st.textContent='اكتب الدرس الأول';return}
      st.textContent='جاري تجهيز الامتحان…';
      try{xQ=(await ai()(`أنت مدرس يساعد الطالب على التدريب في مادة ${$('#xS').value} على الدروس التالية: 5 أسئلة اختيار من متعدد (أ، ب، ج، د) و3 أسئلة مقالية، بمستوى مناسب للثانوية العامة، واعتمد على الدروس التي أرسلها الطالب فقط. اكتب الأسئلة فقط من غير إجابات.\nالدروس:\n${t}`)).text;
        $('#xQ').textContent=xQ;$('#xA').value='';$('#xRes').innerHTML='';$('#xBox').hidden=false;st.textContent='';
        const end=Date.now()+Math.max(5,+$('#xM').value||30)*60000;clearInterval(xTi);
        const tick=()=>{const s=Math.round((end-Date.now())/1000);$('#xTm').textContent=tm(s);if(s<=0){clearInterval(xTi);showAlert('انتهى الوقت، سلّم إجاباتك')}};tick();xTi=setInterval(tick,1000)}
      catch(e){st.textContent=errMsg(e)}};
    $('#xEnd').onclick=async()=>{clearInterval(xTi);const st=$('#xSt');st.textContent='جاري التصحيح…';
      try{const {text}=await ai()(`صحّح إجابات طالب ثانوية عامة على الامتحان ده بصرامة وعدل، وبالعربي المبسط: الدرجة من 20، وكل سؤال وهل إجابته صح وإيه الصح لو غلط، وبعدين أهم 3 نقاط ضعف يراجعها.\nالأسئلة:\n${xQ}\n\nإجابات الطالب:\n${$('#xA').value.trim()||'لم يجب'}`);
        $('#xRes').innerHTML=`<div class="sum">${esc(text)}</div>`;$('#xBox').hidden=true;st.textContent=''}catch(e){st.textContent=errMsg(e)}};
    
    $('#aGo').onclick=async()=>{const t=$('#aT').value.trim(),q=$('#aQ').value.trim(),st=$('#aSt');
      if(!ai())return noAI(st);if(!t||!q){st.textContent='الصق نص الدرس واكتب سؤالك';return}
      st.textContent='جاري الشرح…';
      try{const {text}=await ai()(`اشرح للطالب النقطة دي بأسلوب مبسط وبأمثلة، وبالاعتماد على نص الدرس بس. لو الإجابة مش في النص قول كده بوضوح.\nالنص:\n${t}\nالسؤال: ${q}`);
        $('#aOut').innerHTML=`<div class="sum">${esc(text)}</div>`;st.textContent=''}catch(e){st.textContent=errMsg(e)}};
    
    function pmShow(){$('#pmSt').textContent=`مذاكرتك الفعلية النهاردة: ${S.focus[today()]||0} دقيقة`}
    $('#pmGo').onclick=()=>{clearInterval(pmI);const end=Date.now()+25*60000;
      const tick=()=>{const s=Math.round((end-Date.now())/1000);$('#pmT').textContent=tm(s);if(s<=0){clearInterval(pmI);S.focus[today()]=(S.focus[today()]||0)+25;save();pmShow();showAlert('خلصت 25 دقيقة، خد راحة 5 دقايق')}};tick();pmI=setInterval(tick,1000)};
    $('#pmX').onclick=()=>{clearInterval(pmI);$('#pmT').textContent='25:00'};
    
    $('#rGo').onclick=async()=>{const s=$('#rS').value,n=S.notes.filter(x=>x.sub===s),st=$('#rSt');
      if(!n.length){st.textContent='مفيش ملخصات محفوظة للمادة دي';return}
      try{downloadFile('revision-sheet.md',`# ورقة مراجعة: ${s}\n\n`+n.map(x=>`## ${x.title}\n${x.sum}`).join('\n\n'),'text/markdown;charset=utf-8');st.textContent='تم تجهيز ورقة المراجعة'}catch(e){st.textContent='مقدرتش أحفظ الملف'}};
    const BACKUP_FORMAT='ahmed-study-platform-backup',BACKUP_VERSION=2;
    const ARRAY_KEYS=['ev','notes','words','prac','mist','courseWords','courseWriting','examHistory'];
    const OBJECT_KEYS=['focus','courseDone','courseExamChecks','subjectLessonDone','englishPathDone','smartReview','studyPlan'];
    const WEEKLY_KEY='study-v1-weekly-backups',SAFETY_KEY='study-v1-before-restore';
    let pendingRestore=null;
    const clone=value=>JSON.parse(JSON.stringify(value));
    const isRecord=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
    const backupStatus=message=>{$('#bkSt').textContent=message};
    function readWeekly(){try{const value=JSON.parse(localStorage.getItem(WEEKLY_KEY)||'[]');return Array.isArray(value)?value:[]}catch(error){return []}}
    function createWeeklyBackup(){
      try{const backups=readWeekly(),now=Date.now(),last=backups[0]&&Date.parse(backups[0].createdAt);if(last&&now-last<7*24*60*60*1000)return;
        backups.unshift({createdAt:new Date(now).toISOString(),data:clone(S)});localStorage.setItem(WEEKLY_KEY,JSON.stringify(backups.slice(0,4)));
      }catch(error){/* Browser storage may be full; downloadable backups remain available. */}
    }
    function showUndoAvailability(){$('#bkUndo').hidden=!localStorage.getItem(SAFETY_KEY)}
    function backupSummary(data){return [['مواعيد',data.ev?.length],['ملخصات',data.notes?.length],['كلمات',data.words?.length],['تدريبات',data.prac?.length],['أخطاء',data.mist?.length],['اختبارات',data.examHistory?.length]].filter(x=>Number.isFinite(x[1])).map(x=>x[0]+': '+x[1]).join(' • ')}
    function normalizeBackup(parsed){
      let data;
      if(isRecord(parsed)&&parsed.format==='ahmed-study-platform-backup'){if(parsed.version!==2||!isRecord(parsed.data))throw Error('unsupported');data=parsed.data}
      else if(isRecord(parsed))data=parsed;else throw Error('invalid');
      if(Object.keys(data).some(key=>['__proto__','prototype','constructor'].includes(key)))throw Error('unsafe');
      for(const key of ARRAY_KEYS)if(key in data&&!Array.isArray(data[key]))throw Error('invalid');
      for(const key of OBJECT_KEYS)if(key in data&&!isRecord(data[key]))throw Error('invalid');
      if('track' in data&&!['sci','math','lit'].includes(data.track))throw Error('invalid');
      if('goal' in data&&(!Number.isFinite(Number(data.goal))||Number(data.goal)<1))throw Error('invalid');
      for(const key of ['theme','app','me','color'])if(key in data&&typeof data[key]!=='string')throw Error('invalid');
      if('color' in data&&!/^#[0-9a-f]{6}$/i.test(data.color))throw Error('invalid');
      const safe={};Object.keys(data).forEach(key=>{if(!['__proto__','prototype','constructor'].includes(key))safe[key]=data[key]});return safe;
    }
    function completeState(data){
      return Object.assign({ev:[],notes:[],words:[],track:'sci',prac:[],goal:100,mist:[],focus:{},courseDone:{},courseWords:[],courseWriting:[],courseExamChecks:{},subjectLessonDone:{},englishPathDone:{},examHistory:[],smartReview:{}},clone(data));
    }
    function refreshAfterRestore(){
      save();renderSched();renderNotes();renderWords();renderPrac();renderMist();pmShow();fillSubjects();
      if(refreshPreferences)refreshPreferences();
      if(typeof global.dashboardRender==='function')global.dashboardRender();
      if(typeof global.smartReviewRender==='function')global.smartReviewRender();
      if(typeof global.examCenterRender==='function')global.examCenterRender();
    }
    $('#bkGo').onclick=()=>{
      try{const payload={format:BACKUP_FORMAT,version:BACKUP_VERSION,createdAt:new Date().toISOString(),app:'Ahmed Study Platform',data:clone(S)};
        downloadFile('ahmed-study-backup.json',JSON.stringify(payload,null,2),'application/json;charset=utf-8');
        backupStatus('تم تنزيل نسخة كاملة بإصدار 2 • '+backupSummary(payload.data));
      }catch(error){backupStatus('تعذر تجهيز النسخة الاحتياطية')}
    };
    $('#bkIn').onchange=async event=>{
      const file=event.target.files&&event.target.files[0];if(!file)return;
      $('#bkPreview').hidden=true;$('#bkRestore').disabled=true;pendingRestore=null;
      if(file.size>10*1024*1024){backupStatus('حجم الملف أكبر من الحد المسموح (10 ميجابايت)');event.target.value='';return}
      try{const parsed=JSON.parse(await file.text()),data=normalizeBackup(parsed);pendingRestore=completeState(data);
        $('#bkSummary').textContent=backupSummary(pendingRestore)||'الملف صالح، لكن لا يحتوي بيانات مسجلة بعد.';
        $('#bkVersion').textContent=parsed.format==='ahmed-study-platform-backup'?'نسخة حديثة • الإصدار '+parsed.version:'نسخة قديمة • سيتم تحويلها تلقائيًا';
        $('#bkPreview').hidden=false;$('#bkRestore').disabled=false;backupStatus('النسخة جاهزة للمعاينة. لم يتم تغيير أي بيانات بعد.');
      }catch(error){backupStatus('الملف ده مش نسخة صالحة أو إصدار غير مدعوم');$('#bkPreview').hidden=true}
      finally{event.target.value=''}
    };
    $('#bkRestore').onclick=()=>{
      if(!pendingRestore)return;
      try{const previous=clone(S);localStorage.setItem(SAFETY_KEY,JSON.stringify({createdAt:new Date().toISOString(),data:previous}));
        Object.keys(S).forEach(key=>delete S[key]);Object.assign(S,clone(pendingRestore));
        if(!save()){Object.keys(S).forEach(key=>delete S[key]);Object.assign(S,previous);throw Error('storage')}
        refreshAfterRestore();pendingRestore=null;$('#bkPreview').hidden=true;showUndoAvailability();
        backupStatus('اترجعت بياناتك بنجاح. تقدر تتراجع عن الاستعادة من زر التراجع.');
      }catch(error){backupStatus('تعذرت الاستعادة؛ لم نكمل استبدال البيانات. تأكد من مساحة التخزين.')}
    };
    $('#bkUndo').onclick=()=>{
      try{const safety=JSON.parse(localStorage.getItem(SAFETY_KEY)||'null');if(!isRecord(safety)||!isRecord(safety.data))throw Error('missing');
        const previous=clone(S);Object.keys(S).forEach(key=>delete S[key]);Object.assign(S,completeState(safety.data));
        if(!save()){Object.keys(S).forEach(key=>delete S[key]);Object.assign(S,previous);throw Error('storage')}
        localStorage.removeItem(SAFETY_KEY);refreshAfterRestore();showUndoAvailability();backupStatus('تم التراجع عن آخر استعادة وإرجاع بياناتك السابقة.');
      }catch(error){backupStatus('لم نتمكن من التراجع؛ نسخة الأمان غير متاحة أو مساحة التخزين ممتلئة.')}
    };
    createWeeklyBackup();showUndoAvailability();
    $('#bkWeekly').textContent='النسخ الأسبوعية المحفوظة على هذا المتصفح: '+readWeekly().length+' من 4. يتم إنشاء نسخة جديدة تلقائيًا عند فتح المنصة بعد مرور 7 أيام.';

    
    return {pmShow};
  }
  global.StudyTools={init};
})(window);
