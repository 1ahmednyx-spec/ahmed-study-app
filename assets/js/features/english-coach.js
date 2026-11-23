(function(global){
  function init({getAI,errMsg,escapeHtml:esc,showAlert}) {
    const $=s=>document.querySelector(s);
    let turns=[];
    const P=(t,k)=>{const m=t.match(new RegExp(k+':\\s*([\\s\\S]*?)(?=\\n(?:EN|FIX|WORD):|$)'));return m?m[1].trim():''};
    const rules=()=>{const subject=$('#cSubject').value,mode=$('#cMode').value,english=subject==='اللغة الإنجليزية'||(subject==='عام'&&(mode==='talk'||mode==='fix'));return `أنت المدرّس الذكي الشامل في Ahmed Study Platform. مهمتك تعليم الطالب وفهمه لا مجرد إعطائه الإجابة. المادة الحالية: ${subject}. المستوى: ${$('#cLvl').value}. المطلوب: ${$('#cMode').selectedOptions[0].text}. السياق: ${$('#cScn').value}.
استخدم العربية المصرية المبسطة في الشرح، واحتفظ بالمصطلحات العلمية والإنجليزية كما هي عند الحاجة. اشرح خطوة بخطوة، واذكر القانون أو القاعدة قبل التطبيق، ثم مثالًا واضحًا. في المسائل الحسابية اعرض التعويض والوحدات والتحقق من الناتج. لا تخترع معلومة أو تنسب شيئًا للمنهج دون دليل؛ إذا كانت بيانات السؤال ناقصة فاطلبها، وإذا لم تكن متأكدًا فصرّح بذلك. لا تعطِ حلًا مختصرًا بلا تفسير. في وضع الاختبار اطرح سؤالًا واحدًا في كل مرة وانتظر إجابة الطالب.
${english?'عند تدريس الإنجليزية، استخدم الإنجليزية الطبيعية المناسبة للمستوى، وصحح الأخطاء بلطف. اجعل الرد بهذا التنسيق: EN: الجواب أو المثال بالإنجليزية. FIX: التصحيح أو الشرح بالعربية. WORD: تعبير مفيد = معناه بالعربية.':'في المواد الأخرى، أجب مباشرة بتنسيق واضح وعناوين وخطوات عند الحاجة، ولا تستخدم قالب EN/FIX/WORD.'}`};
    function renderChat(){
      const bot=t=>{const en=P(t,'EN'),fx=P(t,'FIX'),w=P(t,'WORD');return `<div class="b a"><div dir="auto">${esc(en||t)}</div><div><button class="s" data-say="${esc(en||t)}">🔊 اسمع</button> <button class="s" data-tr="${esc(en||t)}">ترجم</button></div><div class="tr" style="font-size:14px;color:var(--brand)"></div>${fx?`<div class="fx">${esc(fx)}</div>`:''}${w.includes('=')?`<button class="s" data-addw="${esc(w)}">+ ${esc(w)}</button>`:''}</div>`};
      $('#cLog').innerHTML=turns.map(t=>t.role==='user'?`<div class="b u" dir="auto">${esc(t.content)}</div>`:bot(t.content)).join('')||'<div class="empty">اختار الموقف وابعت أول رسالة، حتى لو كلمة Hello</div>';
      $('#cLog').scrollTop=1e9}
    $('#cSend').onclick=async()=>{
      const m=$('#cIn').value.trim();if(!m)return;
      if(!getAI()){$('#cSt').textContent='المدرّس الذكي غير مفعّل';return}
      turns.push({role:'user',content:m});$('#cIn').value='';renderChat();$('#cSt').textContent='المدرّس بيجهّز الإجابة…';$('#cSend').disabled=true;
      try{const {text}=await getAI()([{role:'system',content:rules()},...turns],{cache:false});turns.push({role:'assistant',content:text});$('#cSt').textContent='';say(P(text,'EN')||text)}
      catch(e){turns.pop();$('#cIn').value=m;$('#cSt').textContent=errMsg(e.code)}
      $('#cSend').disabled=false;while(turns.length>12)turns.splice(0,2);renderChat()};
    $('#cClr').onclick=()=>{turns=[];renderChat()};
    
    /* Practice and plan */
    document.addEventListener('click',async e=>{
      const s=e.target.dataset.say,t=e.target.dataset.tr;
      if(s){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(s);u.lang='en-US';u.rate=.9;speechSynthesis.speak(u)}catch(x){showAlert('المتصفح مش بيدعم النطق')}}
      if(t){const box=e.target.closest('.b').querySelector('.tr');
        if(!getAI()){box.textContent='ميزة الذكاء الاصطناعي مش متاحة';return}
        box.textContent='جاري الترجمة…';
        try{box.textContent=(await getAI()('ترجم النص ده للعربية المصرية المبسطة، وارجع الترجمة بس:\n'+t)).text}catch(x){box.textContent=errMsg(x.code)}}});
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
    
    
    
    renderChat();
  }
  global.StudyEnglishCoach={init};
})(window);
