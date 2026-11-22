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
    const noAI=el=>{el.textContent='الذكاء الاصطناعي غير مفعّل في نسخة GitHub Pages الحالية. الأدوات الأساسية والحفظ المحلي يعملان.'};
    
    $('#plAdd').onclick=async()=>{const st=$('#plSt');if(!ai())return noAI(st);st.textContent='جاري الإضافة…';
      try{const arr=await ai().json(`اليوم ${today()}. حوّل خطة المذاكرة دي لجلسات في الجدول للأيام السبعة الجاية فقط. ارجع JSON فقط: مصفوفة عناصرها {"title":"المادة وموضوع الجلسة","date":"YYYY-MM-DD","time":"HH:MM"} بحد أقصى 14 جلسة والوقت بنظام 24 ساعة.\nالخطة:\n${getPlanText()}`);
        if(!Array.isArray(arr))throw {code:'invalid_json'};
        arr.slice(0,14).forEach(x=>{if(x.title&&/^\d{4}-\d\d-\d\d$/.test(x.date)&&/^\d\d:\d\d$/.test(x.time))S.ev.push({id:uid(),title:String(x.title),d:x.date,t:x.time,lead:10,fired:false,done:false})});
        save();renderSched();st.textContent='اتضافت للجدول'}catch(e){st.textContent=errMsg(e.code)}};
    
    $('#xGo').onclick=async()=>{const t=$('#xT').value.trim(),st=$('#xSt');
      if(!ai())return noAI(st);if(!t){st.textContent='اكتب الدرس الأول';return}
      st.textContent='جاري تجهيز الامتحان…';
      try{xQ=(await ai()(`أنت مدرس يساعد الطالب على التدريب في مادة ${$('#xS').value} على الدروس التالية: 5 أسئلة اختيار من متعدد (أ، ب، ج، د) و3 أسئلة مقالية، بمستوى مناسب للثانوية العامة، واعتمد على الدروس التي أرسلها الطالب فقط. اكتب الأسئلة فقط من غير إجابات.\nالدروس:\n${t}`)).text;
        $('#xQ').textContent=xQ;$('#xA').value='';$('#xRes').innerHTML='';$('#xBox').hidden=false;st.textContent='';
        const end=Date.now()+Math.max(5,+$('#xM').value||30)*60000;clearInterval(xTi);
        const tick=()=>{const s=Math.round((end-Date.now())/1000);$('#xTm').textContent=tm(s);if(s<=0){clearInterval(xTi);showAlert('انتهى الوقت، سلّم إجاباتك')}};tick();xTi=setInterval(tick,1000)}
      catch(e){st.textContent=errMsg(e.code)}};
    $('#xEnd').onclick=async()=>{clearInterval(xTi);const st=$('#xSt');st.textContent='جاري التصحيح…';
      try{const {text}=await ai()(`صحّح إجابات طالب ثانوية عامة على الامتحان ده بصرامة وعدل، وبالعربي المبسط: الدرجة من 20، وكل سؤال وهل إجابته صح وإيه الصح لو غلط، وبعدين أهم 3 نقاط ضعف يراجعها.\nالأسئلة:\n${xQ}\n\nإجابات الطالب:\n${$('#xA').value.trim()||'لم يجب'}`);
        $('#xRes').innerHTML=`<div class="sum">${esc(text)}</div>`;$('#xBox').hidden=true;st.textContent=''}catch(e){st.textContent=errMsg(e.code)}};
    
    $('#aGo').onclick=async()=>{const t=$('#aT').value.trim(),q=$('#aQ').value.trim(),st=$('#aSt');
      if(!ai())return noAI(st);if(!t||!q){st.textContent='الصق نص الدرس واكتب سؤالك';return}
      st.textContent='جاري الشرح…';
      try{const {text}=await ai()(`اشرح للطالب النقطة دي بأسلوب مبسط وبأمثلة، وبالاعتماد على نص الدرس بس. لو الإجابة مش في النص قول كده بوضوح.\nالنص:\n${t}\nالسؤال: ${q}`);
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
      try{const d=JSON.parse(await f.text());if(!d||typeof d!=='object'||Array.isArray(d))throw 0;const arrayKeys=['ev','notes','words','prac','mist'];if(arrayKeys.some(k=>k in d&&!Array.isArray(d[k])))throw 0;if('track' in d&&!['sci','math','lit'].includes(d.track))throw 0;const allowed=['ev','notes','words','track','prac','goal','mist','focus','courseDone','courseWords','courseWriting','courseExamChecks','theme','app','me','color'];if(Object.keys(d).some(k=>!allowed.includes(k)))throw 0;Object.assign(S,d);save();renderSched();renderNotes();renderWords();renderPrac();renderMist();pmShow();fillSubjects();if(refreshPreferences)refreshPreferences();$('#bkSt').textContent='اترجعت بياناتك'}
      catch(x){$('#bkSt').textContent='الملف ده مش نسخة صالحة'}};
    
    
    return {pmShow};
  }
  global.StudyTools={init};
})(window);
