/* ===================== Runtime: route, clock, modes, map, glossary ===================== */
// Lessons come from LESSON() calls in the stage files; a stage with none keeps its lessons from curriculum.js.
// Old grouped lesson ids (e.g. 'bits', 'sorting') map to the lesson of their first term, for glossary context labels.
const LEGACY_LESSON=Object.fromEntries(CURRICULUM.lessons.map(l=>[l.id,l.ids[0]]));
CURRICULUM.lessons=CURRICULUM.stages.flatMap(st=>{const mine=LESSONS.filter(l=>l.stage===st.id);return mine.length?mine:CURRICULUM.lessons.filter(l=>l.stage===st.id)});
THREADS.push(...EXTRA_THREADS);
const stages=Object.fromEntries(CURRICULUM.stages.map(s=>[s.id,s]));
const lessons=Object.fromEntries(CURRICULUM.lessons.map(l=>[l.id,l]));
const route=CURRICULUM.lessons.flatMap(l=>l.ids);
const lessonOf={};CURRICULUM.lessons.forEach(l=>l.ids.forEach(id=>lessonOf[id]=l.id));
// Connections may name scenes from stages not in this build (per-stage test builds): keep only routed ones.
for(const th of THREADS)th.ids=th.ids.filter(id=>route.includes(id));
const missing=route.filter(id=>!SCENES[id]);
if(missing.length)throw new Error('Scenes missing for: '+missing.join(', '));
const DUR=id=>SCENES[id].dur||8;
const offsets=[];let TOTAL=0;for(const id of route){offsets.push(TOTAL);TOTAL+=DUR(id)}
const LEAD=.4;
function indexAt(time){let lo=0,hi=route.length-1;time=clamp(time,0,TOTAL);while(lo<hi){const mid=(lo+hi+1)>>1;if(offsets[mid]<=time)lo=mid;else hi=mid-1}return lo}
function localP(i,time){const d=DUR(route[i]);return clamp((time-offsets[i]-LEAD)/(d-2*LEAD-.2),0,1)}

/* ---- Glossary word links ---- */
const WORDS=Object.fromEntries(GLOSSARY.map(g=>[g.key,g]));
const aliases=GLOSSARY.flatMap(g=>g.aliases.map(a=>({alias:a,key:g.key}))).sort((a,b)=>b.alias.length-a.alias.length);
const aliasKey=new Map(aliases.map(a=>[a.alias.toLowerCase(),a]));
const reEscape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const wordPattern=new RegExp('(^|[^A-Za-z0-9-])('+aliases.map(a=>reEscape(a.alias)).join('|')+')(?=$|[^A-Za-z0-9])','gi');
// Link each glossary word once per block; never link the block's own topic word.
function markedHTML(input,exclude=null){
 const src=String(input),seen=new Set(exclude?[exclude]:[]);let html='',cur=0,m;wordPattern.lastIndex=0;
 while((m=wordPattern.exec(src))!==null){
  const start=m.index+m[1].length,tok=m[2],al=aliasKey.get(tok.toLowerCase()),key=al&&al.key;
  // Upper-case operator names (AND, OR, NOT) must not capture ordinary words.
  if(!key||seen.has(key)||(/^[A-Z]+$/.test(al.alias)&&tok!==al.alias))continue;seen.add(key);
  html+=esc(src.slice(cur,start));
  let b=`<button type="button" class="word" data-word="${esc(key)}" aria-label="${esc(tok)}: show meaning">${esc(tok)}</button>`;
  const after=src.slice(start+tok.length),punct=after.match(/^[.,;:!?)]/);
  if(punct){b=`<span class="word-tail">${b}${esc(punct[0])}</span>`;cur=start+tok.length+1}else cur=start+tok.length;
  html+=b;
 }
 return html+esc(src.slice(cur));
}
function setWords(el,input,exclude=null){const sig=JSON.stringify([input,exclude]);if(el.dataset.src!==sig){el.innerHTML=markedHTML(input,exclude);el.dataset.src=sig}}

/* ---- State ---- */
let t=0,speed=0,lastForward=1,lastFrame=null,mode='watch',shown=-1,lastPainted=-1;
const watchInit={},watchTrace={};
const tryStore={};let tryK=0,tryU=1,tryFrames=null,runTimer=null,tweenStart=0,trySceneId=null;
const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const svg=$('drawing');
function cur(){return route[indexAt(t)]}
function initOf(id){if(!watchInit[id])watchInit[id]=SCENES[id].init?SCENES[id].init():{};return watchInit[id]}
function traceOfWatch(id){if(!watchTrace[id])watchTrace[id]=SCENES[id].trace(initOf(id));return watchTrace[id]}
function tryKey(sc){return sc.shared||sc.id}
function tryState(sc){const k=tryKey(sc);if(!tryStore[k])tryStore[k]=sc.init?sc.init():{};return tryStore[k]}

/* ---- Drawing ---- */
function paint(){
 const i=indexAt(t),id=route[i],sc=SCENES[id];let s,f=null,X;
 if(mode==='try'){
  s=tryState(sc);const n=tryFrames?tryFrames.length:0;tryK=clamp(tryK,0,Math.max(0,n-1));
  X={p:1,try:true,k:tryK,n,u:tryU};f=n?tryFrames[tryK]:null;
 }else{
  const p=localP(i,t);
  if(sc.trace){s=initOf(id);const fr=traceOfWatch(id),n=fr.length,k=Math.min(n-1,Math.floor(p*n*1.0001));X={p,try:false,k,n,u:clamp(p*n-k,0,1)};f=fr[k]}
  else{s=sc.watch?sc.watch(p):initOf(id);X={p,try:false,k:0,n:0,u:p}}
 }
 let out;
 try{out=sc.draw(s,f,X)||{}}catch(err){console.error('Draw failed in',id,err);out={svg:T(300,190,'This diagram could not be drawn.',18,C.coral),phase:String(err.message)}}
 // Keep keyboard focus on the same interactive target across a redraw.
 const fk=document.activeElement&&svg.contains(document.activeElement)?document.activeElement.getAttribute('data-key'):null;
 svg.innerHTML=`<title id="diagram-title">${esc(sc.name)}</title><desc id="diagram-desc">${esc(sc.desc||sc.definition)}</desc>`+(out.svg||'');
 svg.dataset.mode=mode;
 if(fk){const el=svg.querySelector(`[data-key="${CSS.escape(fk)}"]`);if(el)el.focus({preventScroll:true})}
 setWords($('phase'),out.phase||(f&&f.say)||'');
 if(sc.three&&updateViewPane(sc,i))render3D(sc,s,f,X);else if(sc.three)updateViewPane(sc,i);else{$('three-panel').hidden=true;$('two-panel').inert=false;$('two-panel').removeAttribute('aria-hidden')}
 if(mode==='try')updateStepStatus();
 const prog=mode==='try'?offsets[i]/TOTAL:t/TOTAL;
 $('progress-fill').style.width=(100*prog)+'%';$('progress').setAttribute('aria-valuenow',String(Math.round(100*prog)));
}
/* ---- 2D/3D view (as in Mathematics In Motion) ---- */
let viewMode='auto',viewReveal=0,last3D=null,turning=null;const SLIDE=.6,three=$('three-drawing');
function paneProgress(sc,i){
 if(!sc.three||viewMode==='2d')return 0;
 if(viewMode==='3d')return 1;
 if(mode==='try')return 0; // In Try it, Auto keeps the interactive 2D diagram in front.
 const local=t-offsets[i],half=DUR(sc.id)/2;
 if(reduced)return local>=half?1:0;
 return smooth(clamp((local-half)/SLIDE,0,1));
}
function updateViewPane(sc,i){
 viewReveal=paneProgress(sc,i);const pane=$('three-panel'),two=$('two-panel'),show=!!sc.three&&viewReveal>0;
 pane.hidden=!sc.three;pane.style.visibility=show?'visible':'hidden';
 pane.style.transform=`translateX(${((1-viewReveal)*100).toFixed(4)}%)`;pane.dataset.sliding=String(viewReveal>0&&viewReveal<1);
 two.inert=viewReveal>0;pane.inert=viewReveal<1;
 two.setAttribute('aria-hidden',String(viewReveal>=1));pane.setAttribute('aria-hidden',String(viewReveal<1));
 $('three-reset').hidden=viewReveal<1;
 for(const b of document.querySelectorAll('[data-view]'))b.setAttribute('aria-pressed',String(b.dataset.view===viewMode));
 return show;
}
function render3D(sc,s,f,X){
 last3D={sc,s,f,X};let o;
 try{o=sc.three(s,f,X,makeProject)||{}}catch(err){console.error('3D draw failed in',sc.id,err);o={svg:T(300,190,'This 3D view could not be drawn.',18,C.coral),caption:String(err.message)}}
 three.innerHTML=`<title>${esc(o.title||sc.name+' in 3D')}</title><desc>${esc(o.caption||'')}</desc>`+(o.svg||'');
 setWords($('three-caption'),(o.caption||'')+' Drag to turn.');
}
function redraw3D(){if(last3D)render3D(last3D.sc,last3D.s,last3D.f,last3D.X)}
function chooseView(m){if(!['2d','auto','3d'].includes(m))return;setSpeed(0);stopRun();viewMode=m;lastPainted=-1;paint()}
function installThree(){
 for(const b of document.querySelectorAll('[data-view]'))b.addEventListener('click',()=>chooseView(b.dataset.view));
 $('three-reset').addEventListener('click',()=>{setSpeed(0);camera={yaw:.62,pitch:.55};redraw3D()});
 three.addEventListener('pointerdown',e=>{
  if(e.isPrimary===false||e.pointerType==='mouse'&&e.button!==0)return;
  setSpeed(0);turning={id:e.pointerId,x:e.clientX,y:e.clientY,yaw:camera.yaw,pitch:camera.pitch,touch:e.pointerType==='touch'};three.classList.add('turning');
  try{three.setPointerCapture(e.pointerId)}catch(_){}
 });
 three.addEventListener('pointermove',e=>{if(!turning||e.pointerId!==turning.id)return;camera.yaw=turning.yaw+(e.clientX-turning.x)*.008;if(!turning.touch)camera.pitch=clamp(turning.pitch+(e.clientY-turning.y)*.006,.15,1.15);redraw3D()});
 const endTurn=e=>{if(!turning||e.pointerId!==undefined&&e.pointerId!==turning.id)return;const id=turning.id;turning=null;three.classList.remove('turning');try{if(three.hasPointerCapture(id))three.releasePointerCapture(id)}catch(_){}};
 window.addEventListener('pointerup',endTurn,true);window.addEventListener('pointercancel',endTurn,true);three.addEventListener('lostpointercapture',endTurn);
 three.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key)){e.preventDefault();e.stopPropagation();setSpeed(0);
  if(e.key==='Home')camera={yaw:.62,pitch:.55};if(e.key==='ArrowLeft')camera.yaw-=.12;if(e.key==='ArrowRight')camera.yaw+=.12;if(e.key==='ArrowUp')camera.pitch=clamp(camera.pitch+.08,.15,1.15);if(e.key==='ArrowDown')camera.pitch=clamp(camera.pitch-.08,.15,1.15);redraw3D()}});
}
function showScene(){
 const i=indexAt(t),id=route[i];if(i===shown)return;shown=i;
 const sc=SCENES[id],les=lessons[lessonOf[id]],st=stages[les.stage],li=les.ids.indexOf(id);
 $('view-controls').hidden=!sc.three;viewMode='auto';camera={yaw:.62,pitch:.55};
 $('term').textContent=sc.name;setWords($('definition'),sc.definition,id);setWords($('example'),sc.example,id);
 $('eyebrow').textContent=`${st.name} · ${les.year||st.years||''}${sc.tag?' · '+sc.tag:''}`;
 const res=[].concat(sc.research||[]);$('research').innerHTML=res.length?'<b>Research</b> '+res.map(r=>esc(r)).join(' · '):'';
 setWords($('lesson-why'),'Why this lesson: '+les.why);
 const prior=(les.prior||[]).filter(k=>lessons[k]);
 $('lesson-prior').innerHTML=prior.length?'Builds on: '+prior.map(k=>`<button type="button" data-lesson="${k}">${esc(lessons[k].name)}</button>`).join(''):'Builds on: nothing yet. This is a starting point.';
 $('counter').textContent=`${li+1} / ${les.ids.length}`;$('counter').setAttribute('aria-label',`Topic ${li+1} of ${les.ids.length} in this lesson`);
 updateHeader(les);renderMap(id);updateTransport();
 $('replay').setAttribute('aria-label','Replay '+sc.name);
 $('sources').innerHTML=(les.references||[]).map(k=>SOURCES[k]).filter(Boolean).map(s=>`<li>${s.url?`<a href="${esc(s.url)}" rel="noopener">${esc(s.title)}</a>`:esc(s.title)}${s.note?' — '+esc(s.note):''}</li>`).join('');
 $('announcement').textContent=`${les.name}. ${sc.name}. ${sc.definition}`;
 if(location.hash.slice(1)!==id){try{history.replaceState(null,'','#'+id)}catch(_){}}
 if(mode==='try')enterTry(true);
}
let headerLesson=null;
function updateHeader(les){
 if(headerLesson===les.id)return;headerLesson=les.id;
 $('topic-title').textContent=les.name;
 $('route-select').value=les.id;
 const tex=TEXTURES[les.stage]||TEXTURES.represent;
 const siblings=CURRICULUM.lessons.filter(l=>l.stage===les.stage),frac=siblings.length>1?siblings.indexOf(les)/(siblings.length-1):0;
 $('topic-texture').innerHTML=`<defs><pattern id="tile" patternUnits="userSpaceOnUse" width="${tex.w}" height="${tex.h}" patternTransform="scale(${(1-.12*frac).toFixed(3)})">${tex.tile}</pattern></defs><rect width="100%" height="100%" fill="url(#tile)"/>`;
}

/* ---- Local map ---- */
function threadFor(id){return THREADS.find(th=>th.ids.includes(id))||null}
function neighbours(id){const i=route.indexOf(id),th=threadFor(id),j=th?th.ids.indexOf(id):-1;return {left:route[i-1]||null,right:route[i+1]||null,up:th&&th.ids[j-1]||null,down:th&&th.ids[j+1]||null,th}}
function renderMap(id){
 const nb=neighbours(id),sym={up:'↑',left:'←',right:'→',down:'↓'};
 $('local-map').dataset.flat=String(!nb.up&&!nb.down);
 $('map-caption').textContent=nb.th&&(nb.up||nb.down)?'↑↓ Connection: '+nb.th.name:'← → Along the learning route';
 for(const d of ['up','left','right','down']){
  const b=$('map-'+d),n=nb[d];b.hidden=!n;b.disabled=!n;b.dataset.node=n||'';$('wire-'+d).style.visibility=n?'visible':'hidden';
  if(n){const les=lessons[lessonOf[n]];b.innerHTML=`<small>${sym[d]} ${esc(les.short||les.name)}</small><b>${esc(SCENES[n].name)}</b>`;b.setAttribute('aria-label',`${d}: ${SCENES[n].name}, ${les.name}. ${d==='left'||d==='right'?'Along the route':'Connection: '+nb.th.name}`)}
 }
 $('map-current').innerHTML=`<small>You are here</small><b>${esc(SCENES[id].name)}</b>`;
}

/* ---- Clock ---- */
/* Time slider, ported unchanged from Mathematics In Motion: raw 0–1000, with zero at a measured point.
   Left of zero rewinds up to 8× while held (release pauses); right of zero latches forward up to 12×. */
const slider=$('speed'),shuttle=$('shuttle');
let zero=170,activePointer=null,held=false,keyboardHeld=false;
function speedText(){return speed===0?'0 · Paused':`${fmt(Math.abs(speed))}× ${speed<0?'rewind':'forward'}`}
function rawToRate(raw){raw=Number(raw);const tolerance=9;if(Math.abs(raw-zero)<=tolerance)return 0;return raw<zero?-8*(zero-raw)/zero:12*(raw-zero)/(1000-zero)}
function rateToRaw(rate){return rate<0?zero*(1+rate/8):zero+(1000-zero)*rate/12}
function updateTransport(){
 const i=indexAt(t),playing=speed!==0;
 $('play').dataset.playing=String(playing);$('play-label').textContent=playing?'Pause':'Play';
 $('play').setAttribute('aria-label',playing?'Pause playback':'Play at '+fmt(lastForward)+' times speed');
 slider.value=String(Math.round(rateToRaw(speed)));
 slider.setAttribute('aria-valuetext',speed===0?'Paused':speed<0?`Rewinding at ${fmt(-speed)} times normal speed; release to pause`:`Forward at ${fmt(speed)} times normal speed; this speed stays set`);
 $('speed-readout').value=speedText();
 const pv=route[i-1],nx=route[i+1];
 $('previous').disabled=!pv;$('next').disabled=!nx;
 $('previous').setAttribute('aria-label',pv?'Previous topic: '+SCENES[pv].name:'No previous topic');
 $('next').setAttribute('aria-label',nx?'Next topic: '+SCENES[nx].name:'No next topic');
}
function setSpeed(v){speed=clamp(Number(v)||0,-8,12);if(speed>0)lastForward=speed;updateTransport()}
// Keep diagram labels near a 12.4px minimum on screen: the 600-unit drawing is scaled down on phones.
function measureText(){
 const w=svg.getBoundingClientRect().width;
 const next=w>0?clamp(Math.round((12.4/16)*600/w*100)/100,1,1.28):1;
 if(next!==TS){TS=next;svg.dataset.textScale=String(TS);paint()}
}
function measureAll(){measureText();measureSlider()}
function measureSlider(){
 const available=Math.max(80,slider.getBoundingClientRect().width-46);
 // Preserve a short rewind throw; spend the additional width on forward speed.
 const rewindTravel=Math.min(112,available*.24);
 zero=Math.round(1000*rewindTravel/available);
 shuttle.style.setProperty('--zero',(100*zero/1000)+'%');
 updateTransport();
}
function beginHold(e){
 if(e.isPrimary===false||(e.pointerType==='mouse'&&e.button!==0))return;
 if(held&&activePointer!==null&&activePointer!==e.pointerId)return;
 held=true;activePointer=e.pointerId;shuttle.classList.add('holding');
 try{slider.setPointerCapture(e.pointerId)}catch(_e){}
 if(e.pointerType==='touch'||e.pointerType==='pen'){try{if(typeof navigator.vibrate==='function')navigator.vibrate(12)}catch(_e){}}
}
function endHold(e){
 if(e&&activePointer!==null&&e.pointerId!==undefined&&e.pointerId!==activePointer)return;
 const id=activePointer;
 held=false;activePointer=null;keyboardHeld=false;shuttle.classList.remove('holding');
 // The native handle returns to zero immediately; forward speed remains latched.
 if(speed<0)setSpeed(0);else updateTransport();
 try{if(id!==null&&slider.hasPointerCapture(id))slider.releasePointerCapture(id)}catch(_e){}
}
function speedKeys(e){
 const keys=['ArrowLeft','ArrowRight','ArrowDown','ArrowUp','Home','End','PageUp','PageDown'];
 if(!keys.includes(e.key))return;
 e.preventDefault();keyboardHeld=true;shuttle.classList.add('holding');
 if(mode==='try')setMode('watch');
 let next=speed;
 if(e.key==='Home')next=-8;
 else if(e.key==='End')next=12;
 else if(e.key==='ArrowRight'||e.key==='ArrowUp')next=Math.round((speed+.1)*10)/10;
 else if(e.key==='ArrowLeft'||e.key==='ArrowDown')next=Math.round((speed-.1)*10)/10;
 else if(e.key==='PageUp')next=speed+.5;
 else if(e.key==='PageDown')next=speed-.5;
 setSpeed(next);
}
function advance(now){
 if(lastFrame===null){lastFrame=now;return}
 const dt=clamp((now-lastFrame)/1000,0,.25);lastFrame=now;
 if(speed===0||mode==='try'||document.hidden)return;
 t=clamp(t+dt*speed,0,TOTAL);if(t===TOTAL||t===0&&speed<0)setSpeed(0);
}
function loop(now){
 advance(now);
 if(mode==='try'&&tryU<1){tryU=reduced?1:clamp((now-tweenStart)/320,0,1);paint()}
 else if(mode==='watch'&&t!==lastPainted){lastPainted=t;showScene();paint()}
 requestAnimationFrame(loop);
 window.addEventListener('hashchange',()=>{const i=route.indexOf(decodeURIComponent(location.hash.slice(1)));if(i>=0&&i!==indexAt(t))goTo(i)});
}
function goTo(i,keepMode=true){
 i=clamp(i,0,route.length-1);t=offsets[i];lastPainted=-1;shown=-1;
 if(!keepMode&&mode==='try')setMode('watch');
 showScene();paint();
}
function playPause(){
 if(mode==='try')setMode('watch');
 if(speed!==0){setSpeed(0);return}
 if(t>=TOTAL-.01)t=0;
 setSpeed(lastForward||1);
}
function replay(){if(mode==='try')setMode('watch');t=offsets[indexAt(t)];lastPainted=-1;setSpeed(lastForward||1)}

/* ---- Try it mode ---- */
function stopRun(){if(runTimer){clearInterval(runTimer);runTimer=null}const b=$('try-run');if(b){b.textContent='Run ▷';b.setAttribute('aria-pressed','false')}}
function startRun(){
 stopRun();if(!tryFrames||tryFrames.length<2)return;
 if(tryK>=tryFrames.length-1){tryK=0}
 const b=$('try-run');if(b){b.textContent='Pause ❚❚';b.setAttribute('aria-pressed','true')}
 runTimer=setInterval(()=>{if(tryK>=tryFrames.length-1){stopRun();return}stepBy(1)},reduced?900:620);
}
function stepBy(d){if(!tryFrames)return;const k=clamp(tryK+d,0,tryFrames.length-1);if(k===tryK)return;tryK=k;tweenStart=performance.now();tryU=d>0&&!reduced?0:1;paint()}
function recompute(sc){tryFrames=sc.trace?sc.trace(tryState(sc)):null}
function updateStepStatus(){const el=$('try-step');if(!el)return;const n=tryFrames?tryFrames.length:0;el.textContent=n?`Step ${tryK+1} of ${n}`:'';
 for(const [id,dis] of [['try-back',tryK<=0],['try-first',tryK<=0],['try-step-btn',tryK>=n-1]]){const b=$(id);if(b)b.disabled=dis}}
function doAct(name,arg,value){
 const sc=SCENES[cur()],s=tryState(sc);const h=sc.on&&sc.on[name];
 if(!h){console.warn('No handler',name,'in',sc.id);return}
 let r;try{r=h(s,value!==undefined?value:arg,{k:tryK,frames:tryFrames})}catch(err){console.error(err);return}
 if(sc.trace){const old=tryK;recompute(sc);tryK=r==='keep'?clamp(old,0,tryFrames.length-1):r==='end'?tryFrames.length-1:0}
 if(r!=='keep')stopRun();
 tryU=1;syncControls();paint();
 if(r==='run')startRun();
}
function buildControls(sc){
 const box=$('try-controls');box.innerHTML='';
 const rowA=document.createElement('div');rowA.className='try-row';
 const s=tryState(sc);
 for(const [ci,c] of (sc.ui||[]).entries()){
  if(c.b){const b=document.createElement('button');b.type='button';b.textContent=c.b;if(c.aria)b.setAttribute('aria-label',c.aria);b.addEventListener('click',()=>doAct(c.act,c.arg));rowA.appendChild(b)}
  else if(c.range){const lab=document.createElement('label'),inp=document.createElement('input'),out=document.createElement('output');
   lab.textContent=c.label+' ';inp.type='range';inp.min=c.min;inp.max=c.max;inp.step=c.step||1;inp.value=c.get(s);inp.dataset.ctl=ci;out.value=c.show?c.show(c.get(s)):c.get(s);
   inp.addEventListener('input',()=>{doAct(c.act,null,Number(inp.value))});lab.append(inp,out);rowA.appendChild(lab)}
  else if(c.text){const lab=document.createElement('label'),inp=document.createElement('input');lab.textContent=c.label+' ';inp.type='text';inp.value=c.get(s);inp.maxLength=c.max||24;inp.dataset.ctl=ci;inp.spellcheck=false;inp.autocomplete='off';
   inp.addEventListener('input',()=>doAct(c.act,null,inp.value));lab.appendChild(inp);rowA.appendChild(lab)}
  else if(c.choose){const g=document.createElement('div');g.className='seg';g.setAttribute('role','group');g.setAttribute('aria-label',c.label||'Choose');g.dataset.ctl=ci;
   for(const [v,l] of c.choose){const b=document.createElement('button');b.type='button';b.textContent=l;b.dataset.value=v;b.setAttribute('aria-pressed',String(String(c.get(s))===String(v)));b.addEventListener('click',()=>doAct(c.act,v));g.appendChild(b)}
   if(c.label){const lab=document.createElement('span');lab.className='sr-only';lab.textContent=c.label;rowA.appendChild(lab)}rowA.appendChild(g)}
 }
 const reset=document.createElement('button');reset.type='button';reset.textContent='Reset';reset.setAttribute('aria-label','Reset to the starting example');
 reset.addEventListener('click',()=>{delete tryStore[tryKey(sc)];recompute(sc);tryK=0;stopRun();buildControls(sc);paint()});
 rowA.appendChild(reset);box.appendChild(rowA);
 if(sc.trace){
  const rowB=document.createElement('div');rowB.className='try-row';rowB.setAttribute('role','group');rowB.setAttribute('aria-label','Step through');
  rowB.innerHTML=`<button type="button" id="try-first" aria-label="Back to the first step">⏮</button><button type="button" id="try-back" aria-label="Previous step">◀ Back</button><button type="button" id="try-step-btn" aria-label="Next step">Step ▶</button><button type="button" id="try-run" aria-pressed="false">Run ▷</button><span class="step-status" id="try-step" aria-live="off"></span>`;
  box.appendChild(rowB);
  $('try-first').addEventListener('click',()=>{stopRun();tryK=0;tryU=1;paint()});
  $('try-back').addEventListener('click',()=>{stopRun();stepBy(-1)});
  $('try-step-btn').addEventListener('click',()=>{stopRun();stepBy(1)});
  $('try-run').addEventListener('click',()=>runTimer?stopRun():startRun());
 }
 $('try-hint').textContent=sc.hint||'Change the input and watch the diagram respond.';
}
function syncControls(){
 const sc=SCENES[cur()],s=tryState(sc);
 for(const el of $('try-controls').querySelectorAll('[data-ctl]')){
  const c=sc.ui[Number(el.dataset.ctl)];
  if(c.range){if(document.activeElement!==el)el.value=c.get(s);el.nextSibling.value=c.show?c.show(c.get(s)):c.get(s)}
  else if(c.text){if(document.activeElement!==el)el.value=c.get(s)}
  else if(c.choose){for(const b of el.querySelectorAll('button'))b.setAttribute('aria-pressed',String(String(c.get(s))===String(b.dataset.value)))}
 }
}
function enterTry(sceneChanged){
 const sc=SCENES[cur()];
 if(trySceneId!==sc.id||!sceneChanged){trySceneId=sc.id;recompute(sc);tryK=0;tryU=1;stopRun();buildControls(sc)}
}
function setMode(m){
 if(m===mode)return;mode=m;
 $('mode-watch').setAttribute('aria-pressed',String(m==='watch'));$('mode-try').setAttribute('aria-pressed',String(m==='try'));
 $('try-panel').hidden=m!=='try';$('deck-note').textContent=m==='try'?'Your input · step by step':'Animated · deterministic';
 $('phase').setAttribute('aria-live',m==='try'?'polite':'off');
 if(m==='try'){setSpeed(0);trySceneId=null;enterTry(false)}else{stopRun();trySceneId=null}
 lastPainted=-1;paint();
}
function onSvgAct(e){
 if(mode!=='try')return;const g=e.target.closest('[data-act]');if(!g||!svg.contains(g))return;
 if(e.type==='keydown'&&e.key!=='Enter'&&e.key!==' ')return;
 e.preventDefault();doAct(g.dataset.act,g.dataset.arg);
}

/* ---- Word dialog ---- */
const dlg=$('word-dialog');let wordTrail=[],curWord=null,wordOrigin=null;
function showWord(key,origin,remember=true){
 const g=WORDS[key];if(!g)return;
 if(!dlg.open){wordTrail=[];curWord=null;wordOrigin=origin||document.activeElement;setSpeed(0);stopRun();dlg.showModal()}
 if(remember&&curWord&&curWord!==key)wordTrail.push(curWord);curWord=key;
 $('word-title').textContent=g.title;const ctx=lessons[g.linkContext]||lessons[LEGACY_LESSON[g.linkContext]]||lessons[lessonOf[g.scene||g.key]];
 $('word-context').textContent=(ctx?ctx.name:'Human–computer interaction')+' · word meaning';
 setWords($('word-meaning'),g.here,key);setWords($('word-contrast'),g.contrast,key);setWords($('word-example'),g.example,key);
 $('word-detail').hidden=false;$('word-browser').hidden=true;
 $('word-back').hidden=false;$('word-back').textContent=wordTrail.length?'← Previous word':'← All words';
 const target=g.scene||(SCENES[key]&&route.includes(key)?key:null);$('word-goto').hidden=!target||target===cur();$('word-goto').dataset.node=target||'';
 $('word-title').focus();dlg.scrollTop=0;
}
function fillWordList(){
 const q=$('word-search').value.trim().toLowerCase();
 const list=GLOSSARY.filter(g=>(g.title+' '+g.aliases.join(' ')).toLowerCase().includes(q)).sort((a,b)=>a.title.localeCompare(b.title,'en-GB'));
 $('word-list').innerHTML=list.map(g=>`<button type="button" data-word="${esc(g.key)}">${esc(g.title)}</button>`).join('');
 $('word-list-count').textContent=`${list.length} of ${GLOSSARY.length} meanings`;
}
function showAllWords(origin){
 if(!dlg.open){wordOrigin=origin||document.activeElement;setSpeed(0);stopRun();dlg.showModal()}
 wordTrail=[];curWord=null;$('word-title').textContent='Word meanings';$('word-context').textContent='Search every lesson';
 $('word-detail').hidden=true;$('word-browser').hidden=false;$('word-back').hidden=true;$('word-goto').hidden=true;
 $('word-search').value='';fillWordList();$('word-search').focus();
}
function closeWords(resume){if(!dlg.open)return;dlg.close();if(wordOrigin&&wordOrigin.isConnected)wordOrigin.focus({preventScroll:true});if(resume&&mode==='watch')setSpeed(lastForward||1)}

/* ---- Lesson picker ---- */
function installPicker(){
 $('route-select').innerHTML=CURRICULUM.stages.map(st=>`<optgroup label="${esc(st.name)}">${CURRICULUM.lessons.filter(l=>l.stage===st.id).map(l=>`<option value="${l.id}">${CURRICULUM.lessons.indexOf(l)+1}. ${esc(l.name)}</option>`).join('')}</optgroup>`).join('');
 $('route-select').addEventListener('change',e=>{const l=lessons[e.target.value];if(l)goTo(route.indexOf(l.ids[0]))});
}

/* ---- Boot ---- */
try{
 installPicker();
 $('mode-watch').addEventListener('click',()=>setMode('watch'));
 $('mode-try').addEventListener('click',()=>setMode('try'));
 installThree();
 svg.addEventListener('click',onSvgAct);svg.addEventListener('keydown',onSvgAct);
 $('previous').addEventListener('click',()=>goTo(indexAt(t)-1));
 $('next').addEventListener('click',()=>goTo(indexAt(t)+1));
 $('play').addEventListener('click',playPause);$('replay').addEventListener('click',replay);
 slider.addEventListener('input',()=>{if(mode==='try')setMode('watch');setSpeed(rawToRate(slider.value))});
 slider.addEventListener('pointerdown',beginHold);
 slider.addEventListener('lostpointercapture',endHold);
 slider.addEventListener('keydown',speedKeys);
 slider.addEventListener('keyup',e=>{if(['ArrowLeft','ArrowRight','ArrowDown','ArrowUp','Home','End','PageUp','PageDown'].includes(e.key))endHold()});
 slider.addEventListener('blur',()=>{if(keyboardHeld||held||speed<0)endHold()});
 window.addEventListener('pointerup',endHold,true);
 window.addEventListener('pointercancel',endHold,true);
 window.addEventListener('blur',()=>endHold());
 document.addEventListener('visibilitychange',()=>{endHold();lastFrame=performance.now()});
 for(const d of ['up','left','right','down'])$('map-'+d).addEventListener('click',e=>{const n=e.currentTarget.dataset.node;if(n)goTo(route.indexOf(n))});
 $('local-map').addEventListener('keydown',e=>{const dirs={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down'};if(dirs[e.key]){e.preventDefault();const n=neighbours(cur())[dirs[e.key]];if(n){goTo(route.indexOf(n));$('local-map').focus()}}});
 $('lesson-prior').addEventListener('click',e=>{const b=e.target.closest('[data-lesson]');if(b)goTo(route.indexOf(lessons[b.dataset.lesson].ids[0]))});
 $('words').addEventListener('click',e=>showAllWords(e.currentTarget));
 $('word-close').addEventListener('click',()=>closeWords(false));
 $('word-resume').addEventListener('click',()=>closeWords(true));
 $('word-back').addEventListener('click',()=>{if(wordTrail.length)showWord(wordTrail.pop(),null,false);else showAllWords()});
 $('word-goto').addEventListener('click',()=>{const n=$('word-goto').dataset.node;closeWords(false);if(n)goTo(route.indexOf(n))});
 $('word-search').addEventListener('input',fillWordList);
 dlg.addEventListener('cancel',e=>{e.preventDefault();closeWords(false)});
 document.addEventListener('click',e=>{const w=e.target.closest('[data-word]');if(w){e.preventDefault();showWord(w.dataset.word,w)}});
 document.addEventListener('keydown',e=>{
  if(dlg.open)return;
  const typing=/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName);
  if(e.key===' '&&!typing&&e.target.tagName!=='BUTTON'&&!e.target.closest('[data-act]')){e.preventDefault();playPause()}
  if(e.key==='Escape'&&!typing){endHold();setSpeed(0);stopRun()}
 });
 const start=route.indexOf(decodeURIComponent(location.hash.slice(1)));
 setSpeed(0);goTo(start>=0?start:0);
 measureAll();
 if(typeof ResizeObserver==='function'){const ro=new ResizeObserver(measureAll);ro.observe(shuttle);ro.observe(svg)}else window.addEventListener('resize',measureAll);
 requestAnimationFrame(loop);
 // Read-only inspection hooks for automated checks; no network.
 window.csApp={route,scenes:SCENES,glossary:GLOSSARY,lessons:CURRICULUM.lessons,
  state:()=>({viewMode,viewReveal,camera:{...camera},hasThree:!!SCENES[cur()].three,t,speed,mode,textScale:TS,zero,index:indexAt(t),id:cur(),k:tryK,n:tryFrames?tryFrames.length:0,total:TOTAL}),
  go:id=>goTo(route.indexOf(id)),seek:x=>{setSpeed(0);t=clamp(x,0,TOTAL);lastPainted=-1},offsets,
  setMode,chooseView,act:(n,a,v)=>doAct(n,a,v),step:d=>stepBy(d===undefined?1:d),drawAll:()=>{const errs=[];for(const id of route){const sc=SCENES[id];for(const p of [0,.3,.6,1]){try{let s,f=null,X;if(sc.trace){s=sc.init();const fr=sc.trace(s);const k=Math.min(fr.length-1,Math.floor(p*fr.length));f=fr[k];X={p,try:false,k,n:fr.length,u:.5}}else{s=sc.watch?sc.watch(p):(sc.init?sc.init():{});X={p,try:false,k:0,n:0,u:p}}const o=sc.draw(s,f,X);if(!o||!o.svg)errs.push(id+' empty at '+p)}catch(err){errs.push(id+': '+err.message)}}}return errs}};
}catch(err){
 console.error(err);$('status').className='note';$('status').setAttribute('role','alert');$('status').textContent='The lessons could not start: '+err.message;
}
})();
