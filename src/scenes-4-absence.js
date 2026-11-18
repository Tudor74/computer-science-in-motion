/* ===================== Consciousness In Motion · Era 4 · Sleep, dreams and anaesthesia ===================== */
// Dreams, lucid dreams, anaesthesia, disorders of consciousness, the split brain and psychedelics.
// Every picture is a pure function of state, frame and X. Simulated people and recordings use seeded generators
// (K4_rng) and are labelled as simulated, schematic or toy in the picture. No sound is used in this era.
// Nothing here alternates on its own: there are no ctx.every or ctx.later timers in this file.
const K4_mix=n=>{let x=(Math.round(n)+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const K4_rng=n=>rng(K4_mix(n));
function K4_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const K4_poly=(pts,col,w=2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const K4_pct=(k,n)=>n?Math.round(100*k/n)+'%':'–';
const K4_lines=(x,y,lines,size=13,fill=C.ink,anchor='start',dy=17)=>lines.map((l,i)=>TF(x,y+i*dy,l,size,fill,anchor)).join('');
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function K4_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-7,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// A grid of dots, n in all, the first k filled: an icon array.
function K4_array(x,y,n,k,cols,gap,r,colOn=C.coral,colOff='#d5e0e7',isOn=null){let out='';for(let i=0;i<n;i++){const on=isOn?isOn(i):i<k;out+=Ci(x+(i%cols)*gap,y+Math.floor(i/cols)*gap,r,on?colOn:colOff)}return out}
// A horizontal bar with a value label.
function K4_hbar(x,y,w,h,frac,col,label){return R(x,y,w,h,'#f1f5f8','none',4)+R(x,y,w*clamp(frac,0,1),h,col,'none',4)+(label?TBF(x+w+8,y+h/2+5,label,13,C.ink,'start'):'')}
const K4_tick=ok=>ok?'✓':'✗';
function K4_wrap(str,n){const out=[];let cur='';for(const w of String(str).split(' ')){if(cur&&(cur+' '+w).length>n){out.push(cur);cur=w}else cur=cur?cur+' '+w:w}if(cur)out.push(cur);return out}

/* =========================== dreaming =========================== */
// A schematic night: [start minute, end minute, stage]. REM periods lengthen towards morning and deep sleep
// (N3) comes early. REM totals 112 of 480 minutes (23%), N3 95 minutes (20%): typical proportions for a young adult.
const K4_NIGHT=[[0,5,'W'],[5,12,'N1'],[12,30,'N2'],[30,70,'N3'],[70,82,'N2'],[82,90,'R'],[90,115,'N2'],[115,150,'N3'],[150,168,'N2'],[168,185,'R'],[185,225,'N2'],[225,245,'N3'],[245,268,'N2'],[268,295,'R'],[295,355,'N2'],[355,385,'R'],[385,440,'N2'],[440,470,'R'],[470,480,'W']];
const K4_stageAt=t=>(K4_NIGHT.find(g=>t>=g[0]&&t<g[1])||K4_NIGHT[K4_NIGHT.length-1])[2];
const K4_STY={W:72,R:98,N1:124,N2:150,N3:176};
const K4_STN={W:'awake',R:'REM sleep',N1:'light sleep (N1)',N2:'stage N2 sleep',N3:'deep sleep (N3)'};
// Report rates. "dream": Dement & Kleitman (1957), 152 of 191 REM and 11 of 160 non-REM awakenings.
// "any": the broader question of Foulkes (1962), who reported mental content on about 87% of REM and 74% of non-REM awakenings.
const K4_RATE={dream:{R:152/191,N:11/160},any:{R:.87,N:.74}};
function K4_wake(seed,i,t,q){const st=K4_stageAt(t);if(st==='W')return null;const u=K4_rng(seed*977+i*131+Math.round(t))();return {t,st,q,rep:u<K4_RATE[q][st==='R'?'R':'N']}}
const K4_WATCH_T=[45,86,128,176,236,282,330,372,412,456];
const K4_hm=t=>Math.floor(t/60)+' h '+pad(Math.round(t%60),2)+' min';
SCENE({id:'dreaming',name:'Dreaming',tag:'Wake the sleeper and ask',
 definition:'Dreaming is experience during sleep. The only way to find out whether a sleeper was dreaming is to wake them and ask, so the science of dreams rests on reports given after awakening.',
 example:'In 1953 Eugene Aserinsky and Nathaniel Kleitman found periods of sleep with rapid eye movements (REM). Dement and Kleitman then woke sleepers: 152 of 191 REM awakenings (80%) gave a dream report, against 11 of 160 (7%) from other sleep. When Foulkes asked the broader question “was anything going through your mind?”, most non-REM awakenings gave a report too.',
 desc:'A hypnogram of one schematic night with REM periods marked, a time cursor, dots for each awakening, and a table of reports from REM and non-REM sleep beside the published counts.',
 research:['Aserinsky & Kleitman (1953). Regularly occurring periods of eye motility, and concomitant phenomena, during sleep. Science 118, 273–274.','Dement & Kleitman (1957). The relation of eye movements during sleep to dream activity. Journal of Experimental Psychology 53, 339–346.','Foulkes (1962). Dream reports from different stages of sleep. Journal of Abnormal and Social Psychology 65, 14–25. (Robust: reports from both REM and non-REM sleep have been found many times; the exact rates depend on the question asked.)'],
 dur:12,hint:'Move the time, wake the simulated sleeper and build up a tally. Then change the question and wake them again.',
 init:()=>({t:86,q:'dream',log:[],seed:7}),
 watch(p){const t=Math.round(480*p);return {t,q:'dream',seed:7,log:K4_WATCH_T.filter(x=>x<=t).map((x,i)=>K4_wake(7,i,x,'dream'))}},
 ui:[{range:'t',label:'Time asleep',min:0,max:480,step:2,get:s=>s.t,act:'t',show:v=>K4_hm(Number(v))},{b:'Wake the sleeper',act:'wake'},{b:'Wake 20 times at random',act:'many'},{choose:[['dream','“Were you dreaming?”'],['any','“Was anything going through your mind?”']],label:'Question asked',get:s=>s.q,act:'q'},{b:'Clear',act:'clear'}],
 on:{t(s,v){s.t=Number(v);return 'keep'},q(s,v){s.q=v==='any'?'any':'dream';return 'keep'},clear(s){s.log=[];return 'keep'},
  wake(s){const w=K4_wake(s.seed,s.log.length,s.t,s.q);if(w)s.log.push(w);if(s.log.length>120)s.log.shift();return 'keep'},
  many(s){s.seed=nextSeed();const r=K4_rng(s.seed);let n=0,g=0;while(n<20&&g++<200){const t=6+Math.floor(r()*232)*2;const w=K4_wake(s.seed,s.log.length,t,s.q);if(w){s.log.push(w);n++}}while(s.log.length>120)s.log.shift();return 'keep'}},
 draw(s){
  const X=t=>62+t/480*500,st=K4_stageAt(s.t);let out=heading('One night of sleep: wake the sleeper and ask');
  out+=R(62,56,500,136,'#fff',C.grid,4);
  for(const k of ['W','R','N1','N2','N3'])out+=T(56,K4_STY[k]+4,k==='W'?'Awake':k==='R'?'REM':k,13,k==='R'?C.coral:C.muted,'end')+L(62,K4_STY[k],562,K4_STY[k],'#eef3f6',1);
  let d='';K4_NIGHT.forEach((g,i)=>{const y=K4_STY[g[2]];d+=(i?' L':'M')+fmt(X(g[0]))+' '+y+' L'+fmt(X(g[1]))+' '+y});out+=P(d,C.blue,2);
  K4_NIGHT.filter(g=>g[2]==='R').forEach(g=>{out+=L(X(g[0]),K4_STY.R,X(g[1]),K4_STY.R,C.coral,7)});
  for(let h=0;h<=8;h+=2)out+=T(X(h*60),208,h+' h',13,C.muted);
  out+=L(X(s.t),58,X(s.t),190,C.amber,2);
  s.log.filter(w=>w.q===s.q).forEach(w=>{out+=Ci(X(w.t),K4_STY[w.st],5,w.rep?C.green:'#fff',w.rep?'#fff':C.muted)});
  const mine=s.log.filter(w=>w.q===s.q),rem=mine.filter(w=>w.st==='R'),non=mine.filter(w=>w.st!=='R'),rk=rem.filter(w=>w.rep).length,nk=non.filter(w=>w.rep).length;
  out+=TB(62,236,'Woken from',13,C.muted,'start')+TB(250,236,'Awakenings',13,C.muted)+TB(360,236,'Reports',13,C.muted)+TB(562,236,'Published',13,C.muted,'end');
  out+=R(56,244,512,26,C.coralp,'none',6)+TB(62,262,'REM sleep',13,C.coral,'start')+T(250,262,String(rem.length),13,C.ink)+TB(360,262,rem.length?`${rk} (${K4_pct(rk,rem.length)})`:'–',13,C.ink)+T(562,262,s.q==='dream'?'152 of 191 (80%)':'about 87%',13,C.ink,'end');
  out+=R(56,272,512,26,C.pale,'none',6)+TB(62,290,'Non-REM sleep',13,C.blue,'start')+T(250,290,String(non.length),13,C.ink)+TB(360,290,non.length?`${nk} (${K4_pct(nk,non.length)})`:'–',13,C.ink)+T(562,290,s.q==='dream'?'11 of 160 (7%)':'about 74%',13,C.ink,'end');
  out+=T(62,316,s.q==='dream'?'Dement & Kleitman 1957 · simulated sleeper':'Foulkes 1962 · simulated sleeper',13,C.muted,'start');
  const last=s.log[s.log.length-1];
  out+=T(300,356,st==='W'?'The sleeper is awake at this time.':`Cursor at ${K4_hm(s.t)}: ${K4_STN[st]}`,15,st==='R'?C.coral:C.ink);
  return {svg:out,phase:!mine.length?'The night runs in cycles of roughly 90 minutes. Deep sleep comes early; REM periods (coral) get longer towards morning. Green dots will mark awakenings that gave a report, hollow dots those that gave none.':s.q==='any'?`With the broader question, reports come from most awakenings in both kinds of sleep (${nk} of ${non.length} non-REM here). So REM sleep and dreaming are not the same thing: non-REM reports are usually shorter and more thought-like, but they are experience during sleep. The simulated sleeper follows the published rates.`:`${last&&last.q===s.q?`Woken from ${K4_STN[last.st]}: ${last.rep?'a dream report':'no dream to report'}. `:''}Asked “were you dreaming?”, the sleeper reports a dream from ${rk} of ${rem.length} REM awakenings and ${nk} of ${non.length} non-REM awakenings. In 1957 this looked like proof that dreams happen in REM sleep. Now change the question.`};
 }});

const K4_LESION=[
 {id:'none',name:'No lesion',rem:true,dream:true,say:'With no damage, REM sleep appears every 90 minutes or so and awakenings give dream reports.'},
 {id:'pons',name:'Pons (brainstem)',rem:false,dream:true,say:'Damage to the pons can abolish or nearly abolish REM sleep. Solms counted 26 published cases; loss of dreaming was reported in one of them. Dreaming seems able to continue without REM sleep.'},
 {id:'pto',name:'Parietal–temporal–occipital junction',rem:true,dream:false,say:'Damage here, at the back of the cortex, left REM sleep in place, yet patients said they had stopped dreaming altogether. REM sleep can continue without dreams.'},
 {id:'front',name:'Deep frontal white matter (both sides)',rem:true,dream:false,say:'Damage to fibres deep in both frontal lobes, the region once cut in prefrontal leucotomy, was also followed by loss of dreaming with REM sleep preserved.'}];
SCENE({id:'dreaming-separable',name:'REM sleep without dreams',tag:'Two things that come apart',
 definition:'REM sleep is a physiological state defined by recordings; dreaming is an experience known from reports. Mark Solms argued from patients with brain damage that each can occur without the other, so they must depend on different brain mechanisms.',
 example:'Among 361 neurological patients, Solms found people who said they no longer dreamed after damage to the back of the cortex or deep in the frontal lobes, although such damage spares the brainstem machinery of REM sleep. Brainstem damage that removes REM sleep seldom came with a reported loss of dreaming.',
 desc:'A side view of the brain with four choices of lesion site, and two indicators showing whether REM sleep and dream reports remain, plus a grid recording the combinations seen.',
 research:['Solms (1997). The Neuropsychology of Dreams. Erlbaum.','Solms (2000). Dreaming and REM sleep are controlled by different brain mechanisms. Behavioral and Brain Sciences 23, 843–850. (Contested: Hobson and others replied in the same issue that brainstem lesions rarely remove REM sleep completely and that few such patients were woken and asked.)'],
 dur:12,hint:'Choose where the damage is and read the two indicators. Find a case of each: REM sleep without dreaming, and dreaming without REM sleep.',
 init:()=>({site:'none',seen:['none']}),
 watch(p){const k=Math.min(3,Math.floor(p*4)),ids=K4_LESION.map(l=>l.id);return {site:ids[k],seen:ids.slice(0,k+1)}},
 ui:[{choose:K4_LESION.map(l=>[l.id,l.id==='pto'?'Back of cortex':l.id==='front'?'Deep frontal':l.id==='pons'?'Pons':'No lesion']),label:'Site of damage',get:s=>s.site,act:'site'},{b:'Clear grid',act:'clear'}],
 on:{site(s,v){if(K4_LESION.some(l=>l.id===v)){s.site=v;if(!s.seen.includes(v))s.seen.push(v)}return 'keep'},clear(s){s.seen=[s.site];return 'keep'}},
 draw(s,f,X){
  const le=K4_LESION.find(l=>l.id===s.site)||K4_LESION[0];let out=heading('Does dreaming need REM sleep?');
  // Side view, front to the left.
  out+=P('M62 190 C52 120 110 66 180 68 C250 66 300 110 298 170 C298 205 270 228 232 228 L150 228 C100 232 66 222 62 190 Z',C.line,2.5,'#f4f8fa');
  out+=`<ellipse cx="252" cy="244" rx="38" ry="22" fill="#f4f8fa" stroke="${C.line}" stroke-width="2.5"/>`+P('M186 226 L200 300 L226 300 L222 226 Z',C.line,2.5,'#f4f8fa');
  out+=T(58,92,'front',13,C.muted,'start')+T(300,92,'back',13,C.muted,'end');
  const spot=(id,cx,cy,rx,ry,lab,lx,ly,anchor)=>{const on=s.site===id;return hit(X,'site',id,`Damage at: ${lab}`,`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${on?C.coral:'#fff'}" stroke="${C.coral}" stroke-width="2" ${on?'':'stroke-dasharray="5 4"'}/>`)+T(lx,ly,lab,13,on?C.coral:C.muted,anchor)};
  out+=spot('pto',258,150,24,20,'back of cortex',258,120,'middle')+spot('front',112,176,24,14,'deep frontal',112,152,'middle')+spot('pons',206,262,13,16,'pons',176,270,'end');
  out+=T(180,330,'Schematic side view; sites are approximate.',13,C.muted);
  const tile=(y,lab,ok,yes,no)=>R(330,y,240,54,ok?C.greenp:C.coralp,'none',8)+T(342,y+21,lab,13,C.muted,'start')+TB(342,y+43,ok?yes:no,15,ok?C.green:C.coral,'start');
  out+=tile(60,'REM sleep in the recording',le.rem,'present','lost or nearly lost')+tile(122,'Dream reports',le.dream,'continue','stop');
  // 2×2 grid of combinations seen.
  out+=TB(330,204,'Combinations you have seen',13,C.muted,'start');
  const cell=(cx,cy,rem,dream,lab)=>{const got=s.seen.some(id=>{const l=K4_LESION.find(q=>q.id===id);return l.rem===rem&&l.dream===dream}),now=le.rem===rem&&le.dream===dream;return R(cx,cy,118,44,got?C.amberp:'#f6f9fb',now?C.amber:'none',6)+TF(cx+59,cy+19,lab[0],13,got?C.ink:C.muted)+TF(cx+59,cy+36,lab[1],13,got?C.ink:C.muted)};
  out+=cell(330,212,true,true,['REM sleep','with dreams'])+cell(452,212,true,false,['REM sleep','no dreams'])+cell(330,260,false,true,['no REM sleep','with dreams'])+cell(452,260,false,false,['no REM sleep','no dreams']);
  out+=T(300,360,le.id==='none'?'Usually REM sleep and dreams come together.':le.rem?'REM sleep continues, but the dreams have stopped.':'REM sleep is lost, but dreaming is still reported.',15,le.id==='none'?C.ink:C.coral);
  return {svg:out,phase:`${le.name}. ${le.say} ${le.id==='none'?'':'This is contested: the brainstem cases are few, and critics note that most of those patients were never woken in a laboratory and asked.'}`};
 }});

// Twelve simulated awakenings. Most follow the published pattern (little slow-wave activity over the back of
// the cortex before a dream report); each has a 13% chance of going the other way, so the rule scores about 87%.
function K4_hzTrials(seed){const r=K4_rng(seed);return range(12).map(()=>{const dream=r()<.5,odd=r()<.13,low=dream!==odd;return {dream,low,post:low?.08+.3*r():.62+.3*r(),front:.15+.7*r(),st:r()<.35?'REM':'NREM'}})}
const K4_hzRule=tr=>tr.filter(t=>t.low===t.dream).length;
const K4_blue=v=>tint('#174a80',clamp(1-v,0,1)*.92);
SCENE({id:'dreaming-hot-zone',name:'Predicting a dream',tag:'Slow waves at the back of the head',
 definition:'In serial-awakening studies, sleepers are woken many times a night while their brain waves are recorded with a dense cap of electrodes. Francesca Siclari and colleagues found that less slow-wave activity over the back of the cortex just before waking went with a report of experience, in REM and non-REM sleep alike.',
 example:'Sleepers wore 256 electrodes and were woken again and again. Reports fell into three kinds: an experience with content, an experience whose content was forgotten, and no experience. In a follow-up with 7 sleepers, watching the back of the cortex in real time predicted the report on about 87% of awakenings.',
 desc:'A top view of a head with electrodes coloured by slow-wave activity at the front and back, a prompt to predict dream or no dream, a row of twelve results, and bars comparing the learner, a simple rule and the published accuracy.',
 research:['Siclari, Baird, Perogamvros, Bernardi, LaRocque, Riedner, Boly, Postle & Tononi (2017). The neural correlates of dreaming. Nature Neuroscience 20, 872–878. (One laboratory; the real-time test used 7 sleepers. The link is a correlate, not an explanation.)','Nielsen (2000). A review of mentation in REM and NREM sleep. Behavioral and Brain Sciences 23, 851–866.'],
 dur:14,hint:'Look at the back of the head, predict, then press Next awakening. Twelve awakenings make a set. Your answers stay on this page.',
 init:()=>({seed:23,i:0,ans:[]}),
 watch(p){const tr=K4_hzTrials(23),k=Math.min(12,Math.floor(p*13));return {seed:23,i:k,ans:tr.slice(0,k).map(t=>t.low)}},
 ui:[{b:'Dream',act:'say',arg:'d'},{b:'No dream',act:'say',arg:'n'},{b:'Next awakening',act:'next'},{b:'New night',act:'fresh'}],
 on:{say(s,a){if(s.i<12&&s.ans[s.i]===undefined)s.ans[s.i]=a==='d';return 'keep'},next(s){if(s.i<12&&s.ans[s.i]!==undefined)s.i++;return 'keep'},fresh(s){s.seed=nextSeed();s.i=0;s.ans=[];return 'keep'}},
 draw(s,f,X){
  const tr=K4_hzTrials(s.seed),done=s.i>=12,t=tr[Math.min(11,s.i)],answered=!done&&s.ans[s.i]!==undefined,cx=150,cy=190;
  let out=heading(X.try?'Dream or no dream? Predict from the recording':'Simulated participant: predicting from the recording');
  const score=s.ans.filter((a,i)=>a===tr[i].dream).length,nAns=s.ans.length;
  out+=P(`M${cx-10} ${cy-96} L${cx} ${cy-110} L${cx+10} ${cy-96}`,C.line,2.5)+Ci(cx,cy,94,'#fbfdfe',C.line);
  out+=T(cx,cy-116,'front',13,C.muted)+T(cx,cy+116,'back · dashed: the back zone',13,C.coral);
  if(!done){const jr=K4_rng(s.seed*31+s.i);for(let gy=-3;gy<=3;gy++)for(let gx=-3;gx<=3;gx++){if(Math.hypot(gx,gy)>3.4)continue;const base=gy<=-1?t.front:gy>=1?t.post:(t.front+t.post)/2;out+=Ci(cx+gx*24,cy+gy*24,9,K4_blue(clamp(base+(jr()-.5)*.16,0,1)),'#8aa5b8','stroke-width="1"')}
   out+=`<ellipse cx="${cx}" cy="${cy+48}" rx="80" ry="40" fill="none" stroke="${C.coral}" stroke-width="2" stroke-dasharray="6 5"/>`}
  else out+=T(cx,cy+4,'Set complete',14,C.muted);
  out+=T(30,337,'Slow waves:',13,C.muted,'start');[0,.25,.5,.75,1].forEach((v,i)=>{out+=R(176+i*22,324,20,16,K4_blue(v),'#8aa5b8',3)});out+=T(176,354,'less',13,C.muted,'start')+T(284,354,'more',13,C.muted,'end');
  out+=R(300,56,280,300,'#fff',C.grid,8);
  if(!done){out+=TB(314,82,`Awakening ${s.i+1} of 12`,15,C.ink,'start')+T(314,102,`${t.st==='REM'?'REM':'non-REM'} sleep · simulated`,13,C.muted,'start');
   if(!answered)out+=K4_lines(314,132,['Before waking, was the sleeper','having an experience?','Press Dream or No dream.'],13,C.ink);
   else{const ok=s.ans[s.i]===t.dream;out+=R(310,116,260,62,ok?C.greenp:C.coralp,'none',6)+TB(320,138,t.dream?'Report: “I was dreaming.”':'Report: “Nothing at all.”',14,C.ink,'start')+T(320,160,`You said ${s.ans[s.i]?'dream':'no dream'}: ${ok?'right':'not this time'}.`,13,ok?C.green:C.coral,'start')+T(320,196,t.low===t.dream?'The back zone followed the usual pattern.':'This awakening went against the pattern.',13,C.muted,'start')}}
  else{out+=TB(314,82,'Twelve awakenings',15,C.ink,'start');
   out+=T(314,112,'You',13,C.muted,'start')+K4_hbar(314,118,170,16,score/12,C.blue,`${score} of 12 (${K4_pct(score,12)})`);
   out+=T(314,156,'Rule: quiet back zone',13,C.muted,'start')+K4_hbar(314,162,170,16,K4_hzRule(tr)/12,C.green,`${K4_hzRule(tr)} of 12 (${K4_pct(K4_hzRule(tr),12)})`);
   out+=T(314,200,'Published real-time prediction',13,C.muted,'start')+K4_hbar(314,206,170,16,.87,C.amber,'about 87%')}
  out+=T(314,252,'Results so far',13,C.muted,'start');
  for(let i=0;i<12;i++){const a=s.ans[i],col=a===undefined?'#eef3f6':a===tr[i].dream?C.green:C.coral;out+=R(314+i*21,260,17,17,col,i===s.i&&!done?C.amber:'none',4)}
  out+=T(314,300,nAns?`${score} of ${nAns} right so far`:'No answers yet',13,C.ink,'start')+T(314,334,'Schematic map, not real EEG.',13,C.muted,'start');
  return {svg:out,phase:done?`You scored ${score} of 12. The simple rule “little slow-wave activity at the back means a dream” scores ${K4_hzRule(tr)} of 12 on this set, and Siclari’s group reached about 87% in real sleepers. The front of the head was a distraction: its slow waves did not predict the report. The finding is a correlate from one laboratory, and it does not say why activity there should go with experience.`:answered?(t.low===t.dream?`${t.dream?'Little slow-wave activity over the back of the cortex, and the sleeper reported a dream.':'Strong slow waves over the back of the cortex, and the sleeper reported nothing.'} The sleep stage did not decide it: the same pattern held in REM and non-REM sleep.`:'An exception. The published rule is a tendency, not a law: it was right on most awakenings, not all.'):'Each dot is an electrode, darker where slow waves were stronger just before the awakening, relative to the average for that sleep stage. Compare the front of the head with the dashed zone at the back.'};
 }});

/* =========================== lucid-dreaming =========================== */
// Eye-movement (EOG) trace: irregular REM saccades that decay, plus an agreed signal of left-right-left-right
// held deflections in one 5-second segment. Returns [[t,v]] sampled 20 times a second.
function K4_eog(seed,sigSeg,amp=1,dur=30,sweeps=2,t0=null,ph=.6){
 const r=K4_rng(seed),ev=[];let t=.4;
 const a0=t0===null?sigSeg*5+.5:t0,on=sigSeg>=0&&sweeps>0,end=a0+sweeps*2*ph;
 while(t<dur){const a=(r()-.5)*1.2;if(!on||t<a0-.4||t>end+.3)ev.push([t,a,false]);t+=.3+r()*1.1}
 if(on){for(let i=0;i<sweeps*2;i++)ev.push([a0+i*ph,(i%2?-1:1)*amp,true]);ev.push([end,0,false])}
 ev.sort((a,b)=>a[0]-b[0]);
 const pts=[];let v=0,hold=false,k=0;for(let i=0;i<=dur*20;i++){const tt=i/20;while(k<ev.length&&ev[k][0]<=tt){v=ev[k][1];hold=ev[k][2];k++}pts.push([tt,v]);if(!hold)v*=.87}
 return pts;
}
// Low-voltage mixed EEG (REM or waking with eyes open), alpha rhythm, stage N2 with a spindle and K-complex, and chin EMG.
function K4_eeg(seed,kind,dur,step=.02){const r=K4_rng(seed),ph=range(5).map(()=>r()*6.283),pts=[];
 for(let i=0;i<=dur/step;i++){const t=i*step;let v;
  if(kind==='alpha')v=.62*(1+.3*Math.sin(t*1.7+ph[0]))*Math.sin(6.283*10*t+ph[1]);
  else if(kind==='n2')v=.3*Math.sin(6.283*1.1*t+ph[0])+.16*Math.sin(6.283*4*t+ph[1])+.6*Math.exp(-Math.pow((t-dur*.3)/.35,2))*Math.sin(6.283*13*t)+.95*Math.exp(-Math.pow((t-dur*.72)/.16,2))-.7*Math.exp(-Math.pow((t-dur*.72-.3)/.22,2));
  else v=.2*Math.sin(6.283*5*t+ph[0])+.16*Math.sin(6.283*8.3*t+ph[1])+.13*Math.sin(6.283*14*t+ph[2])+.1*Math.sin(6.283*23*t+ph[3]);
  pts.push([t,v])}
 return pts}
function K4_emg(seed,level,dur,step=.02){const r=K4_rng(seed),pts=[];for(let i=0;i<=dur/step;i++)pts.push([i*step,(r()-.5)*2*level]);return pts}
const K4_lane=(pts,x0,w,dur,y,amp,col,wd=1.6)=>K4_poly(pts.map(([t,v])=>[x0+t/dur*w,y-v*amp]),col,wd);
SCENE({id:'lucid-dreaming',name:'Lucid dreaming',tag:'A signal from inside the dream',
 definition:'A lucid dream is a dream in which the dreamer knows they are dreaming. Because the eyes still move in REM sleep while the rest of the body is paralysed, a lucid dreamer can send a signal agreed in advance: looking left, right, left, right.',
 example:'In April 1975 at the University of Hull, Keith Hearne recorded the first such signals from Alan Worsley, asleep in REM. Stephen LaBerge and colleagues at Stanford did the same independently and published in 1981. The recording gives the report a time stamp: this is when the dreamer says they knew.',
 desc:'A thirty-second sleep recording with brain waves, eye movements and chin muscle tone; the eye trace is divided into six segments and the learner picks the one holding the left-right-left-right signal.',
 research:['Hearne (1978). Lucid dreams: an electro-physiological and psychological study. PhD thesis, University of Liverpool (signals recorded 1975).','LaBerge, Nagel, Dement & Zarcone (1981). Lucid dreaming verified by volitional communication during REM sleep. Perceptual and Motor Skills 52, 727–732. (Robust: signal-verified lucid dreams have been recorded in many laboratories.)','Saunders, Roe, Smith & Clegg (2016). Lucid dreaming incidence: a quality effects meta-analysis of 50 years of research. Consciousness and Cognition 43, 197–215.'],
 dur:12,hint:'Press the five-second segment of the eye trace that holds the agreed signal: four large, even swings. Then try a weak signal.',
 init:()=>({seed:5,amp:'clear',pick:null,n:0,right:0}),
 watch(p){return {seed:5,amp:'clear',pick:p>.55?K4_rng(5*13)()*6|0:null,n:0,right:0,scan:Math.min(1,p/.55)}},
 ui:[{choose:[['clear','Clear signal'],['weak','Weak signal']],label:'Signal',get:s=>s.amp,act:'amp'},{b:'New recording',act:'fresh'}],
 on:{pick(s,a){if(s.pick===null){s.pick=Number(a);s.n++;if(s.pick===(K4_rng(s.seed*13)()*6|0))s.right++}return 'keep'},fresh(s){s.seed=nextSeed();s.pick=null;return 'keep'},amp(s,v){s.amp=v==='weak'?'weak':'clear';s.seed=nextSeed();s.pick=null;return 'keep'}},
 draw(s,f,X){
  const seg=K4_rng(s.seed*13)()*6|0,x0=40,w=520,eog=K4_eog(s.seed,seg,s.amp==='weak'?.6:1,30,2,null,.9);
  let out=heading(X.try?'Find the signal in the eye-movement trace':'A signal sent from inside REM sleep');
  out+=T(40,58,'Brain waves (EEG): low and mixed, as in REM sleep',13,C.muted,'start')+K4_lane(K4_eeg(s.seed+1,'rem',30,.05),x0,w,30,76,26,C.ink,1.2);
  out+=T(40,108,'Eye movements (EOG): up is a look to the left, down to the right',13,C.muted,'start');
  for(let i=0;i<6;i++){const sx=x0+i*w/6,isSig=i===seg,shown=s.pick!==null,fill=shown&&isSig?C.greenp:shown&&i===s.pick?C.coralp:'#fff';
   out+=hit(X,'pick',i,`Segment ${i+1}, seconds ${i*5} to ${i*5+5}`,R(sx+1,116,w/6-2,120,fill,shown&&isSig?C.green:C.grid,4))}
  out+=K4_lane(eog,x0,w,30,176,46,C.blue,2);
  if(s.pick!==null){const a0=seg*5+.5;['L','R','L','R'].forEach((c,i)=>{out+=TB(x0+(a0+i*.9+.45)/30*w,131,c,13,C.green)})}
  if(!X.try&&s.pick===null&&s.scan!==undefined)out+=L(x0+s.scan*w,116,x0+s.scan*w,236,C.amber,2);
  for(let i=0;i<=6;i++)out+=T(x0+i*w/6,252,i*5+(i===6?' s':''),13,C.muted);
  out+=T(40,278,'Chin muscle (EMG): flat, the body is paralysed',13,C.muted,'start')+K4_lane(K4_emg(s.seed+2,.06,30,.1),x0,w,30,294,26,C.ink,1.2);
  out+=T(560,320,'Simulated recording',13,C.muted,'end');
  out+=T(300,356,s.pick===null?(X.try?'Which segment holds left, right, left, right?':'Scanning the trace for four large, even swings…'):s.pick===seg?`Found it${X.try?`: ${s.right} of ${s.n} recordings read correctly.`:': left, right, left, right.'}`:`The signal was in the green segment (${s.right} of ${s.n} correct).`,15,s.pick===null?C.ink:s.pick===seg?C.green:C.coral);
  return {svg:out,phase:s.pick===null?'Ordinary REM eye movements are irregular flicks of different sizes. The agreed signal is different: large, even swings to the left and right, held briefly, in a fixed count. The brain waves and the slack chin muscle show that the sleeper is still in REM sleep.':s.pick===seg?'That is the signal. On waking, the dreamer reports having become lucid and signalled, and the recording shows the signal during unbroken REM sleep. The match between the two is the evidence.':'Not that one: those were ordinary REM flicks, uneven in size and timing. Scorers of real recordings face the same problem, which is why the signal is agreed beforehand and usually repeated.'+(s.amp==='weak'?' Weak signals are a real difficulty with inexperienced dreamers.':'')};
 }});

const K4_EPOCH=[
 {name:'A',eeg:'alpha',emg:.75,sig:true,c:[false,false,true],say:'The eye signal is there, but the brain waves show the regular alpha rhythm of relaxed waking and the chin muscle is active. This person is awake.'},
 {name:'B',eeg:'rem',emg:.05,sig:false,c:[true,true,false],say:'REM sleep, and the sleeper may say afterwards that the dream was lucid. Without the agreed signal there is only the report: the dream is not signal-verified.'},
 {name:'C',eeg:'rem',emg:.05,sig:true,c:[true,true,true],say:'Brain waves of REM sleep, a slack chin muscle and the agreed signal together: a signal-verified lucid dream.'},
 {name:'D',eeg:'n2',emg:.28,sig:false,c:[false,false,false],say:'A sleep spindle and a large K-complex mark stage N2 sleep, some muscle tone remains, and there is no signal.'}];
SCENE({id:'lucid-dreaming-verified',name:'Is the dreamer really asleep?',tag:'Three channels, one verdict',
 definition:'A lucid dream is called signal-verified when the agreed eye signal appears while the recording shows unbroken REM sleep: low, mixed brain waves and no tone in the chin muscle. All three channels have to agree.',
 example:'The first objection to lucid dreaming was that the “dreamers” had briefly woken up. A person lying awake with eyes shut shows a regular alpha rhythm of about 10 cycles a second and an active chin muscle. A signal with those is a signal from waking.',
 desc:'Eight seconds of brain waves, eye movements and chin muscle activity for one of four epochs, with buttons to judge whether it counts as a signal-verified lucid dream and a checklist of the three criteria.',
 research:['LaBerge, Nagel, Dement & Zarcone (1981). Perceptual and Motor Skills 52, 727–732.','Rechtschaffen & Kales (1968). A Manual of Standardized Terminology, Techniques and Scoring System for Sleep Stages of Human Subjects (the scoring rules for sleep stages).','Baird, Mota-Rolim & Dresler (2019). The cognitive neuroscience of lucid dreaming. Neuroscience and Biobehavioral Reviews 100, 305–323. (The criteria are standard; lucid dreams remain rare in the laboratory, so samples are small.)'],
 dur:14,hint:'Choose an epoch, look at all three channels, and give your verdict. There are four epochs to judge.',
 init:()=>({ep:0,v:[null,null,null,null]}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {ep:k,v:K4_EPOCH.map((e,i)=>i<k||(i===k&&(p*4-k)>.5)?e.c.every(Boolean):null)}},
 ui:[{choose:K4_EPOCH.map((e,i)=>[i,'Epoch '+e.name]),label:'Recording',get:s=>s.ep,act:'ep'},{b:'Counts as verified',act:'v',arg:'y'},{b:'Does not count',act:'v',arg:'n'},{b:'Start again',act:'fresh'}],
 on:{ep(s,v){s.ep=clamp(Number(v)|0,0,3);return 'keep'},v(s,a){if(s.v[s.ep]===null)s.v[s.ep]=a==='y';return 'keep'},fresh(s){s.v=[null,null,null,null];s.ep=0;return 'keep'}},
 draw(s,f,X){
  const e=K4_EPOCH[s.ep],x0=40,w=350,D=8,truth=e.c.every(Boolean),v=s.v[s.ep];
  let out=heading('Does this epoch count as a verified lucid dream?');
  out+=TB(40,58,`Epoch ${e.name}`,14,C.ink,'start')+T(390,58,'8 seconds · simulated',13,C.muted,'end');
  out+=R(x0,66,w,248,'#fff',C.grid,6);
  out+=T(46,84,'Brain waves (EEG)',13,C.muted,'start')+K4_lane(K4_eeg(40+s.ep,e.eeg,D,.0125),x0,w,D,116,26,C.ink,1.2);
  out+=L(x0,150,x0+w,150,'#eef3f6',1)+T(46,168,'Eye movements (EOG)',13,C.muted,'start')+K4_lane(e.eeg==='n2'?K4_emg(9,.04,D,.1):K4_eog(60+s.ep,e.sig?0:-1,1,D,2,2.4),x0,w,D,202,26,C.blue,2);
  out+=L(x0,236,x0+w,236,'#eef3f6',1)+T(46,254,'Chin muscle (EMG)',13,C.muted,'start')+K4_lane(K4_emg(80+s.ep,e.emg,D,.0125),x0,w,D,284,26,C.ink,1);
  out+=TB(408,84,'Three criteria',13,C.muted,'start');
  ['REM brain waves','Chin muscle slack','Agreed eye signal'].forEach((lab,i)=>{const y=96+i*40,show=v!==null;out+=R(404,y,176,32,show?(e.c[i]?C.greenp:C.coralp):'#f6f9fb','none',6)+T(412,y+21,lab,13,C.ink,'start')+(show?TB(572,y+22,K4_tick(e.c[i]),16,e.c[i]?C.green:C.coral,'end'):T(572,y+21,'?',13,C.muted,'end'))});
  out+=R(404,220,176,54,v===null?'#f6f9fb':v===truth?C.greenp:C.coralp,'none',6);
  out+=v===null?T(412,242,'Your verdict?',13,C.muted,'start'):TB(412,242,truth?'Verified':'Not verified',14,truth?C.green:C.coral,'start')+T(412,262,v===truth?'You agreed.':'You said otherwise.',13,C.muted,'start');
  K4_EPOCH.forEach((q,i)=>{const a=s.v[i];out+=R(404+i*45,284,40,28,a===null?'#eef3f6':a===q.c.every(Boolean)?C.green:C.coral,i===s.ep?C.amber:'none',6)+TB(424+i*45,303,q.name,13,a===null?C.muted:'#fff')});
  const nd=s.v.filter(a=>a!==null).length,ok=s.v.filter((a,i)=>a!==null&&a===K4_EPOCH[i].c.every(Boolean)).length;
  out+=T(300,352,nd?`${ok} of ${nd} epochs judged as a sleep scorer would`:'Judge each epoch: A, B, C and D',15,C.ink);
  return {svg:out,phase:v===null?'Check each channel in turn. REM sleep has low, irregular brain waves and a flat chin muscle; relaxed waking has a regular alpha rhythm and muscle tone; stage N2 has spindles and K-complexes.':e.say+(nd===4?' Only one of the four counts. The rule is strict on purpose: it gives up some real lucid dreams to keep out waking signals.':'')};
 }});

// Konkoly et al. (2021): 158 trials in signal-verified lucid REM sleep. 29 correct (18.4%), 5 incorrect (3.2%),
// 28 ambiguous (17.7%), 96 with no response (60.8%). 29+5+28+96 = 158.
const K4_KON=[['correct',29,'Correct'],['incorrect',5,'Wrong'],['ambiguous',28,'Unclear'],['none',96,'No reply']];
function K4_konTrial(seed,i){const r=K4_rng(seed*53+i*7),a=3+Math.floor(r()*6),b=a-1-Math.floor(r()*Math.min(4,a-1)),ans=a-b,u=r()*158;
 const out=u<29?'correct':u<34?'incorrect':u<62?'ambiguous':'none';let shown=out==='correct'?ans:out==='incorrect'?(ans===1?2:ans-1):0;return {a,b,ans,out,shown,ts:seed*53+i*7+1}}
function K4_konTrace(t){
 if(t.out==='correct'||t.out==='incorrect')return K4_eog(t.ts,0,1,12,t.shown,3).map(([x,v],i,arr)=>[x,x<2.6||x>3.2+t.shown*1.2?v*.3:v]);
 const base=K4_eog(t.ts,-1,1,12).map(([x,v])=>[x,v*.3]);if(t.out==='none')return base;
 const r=K4_rng(t.ts+5);const bumps=range(3).map(()=>[3+r()*4,(r()<.5?-1:1)*(.35+.25*r()),.25+.5*r()]);
 return base.map(([x,v])=>[x,v+sum(bumps.map(([c,a,wd])=>a*Math.exp(-Math.pow((x-c)/wd,2))))]);
}
const K4_konMatch=(t,read)=>t.out==='ambiguous'?read==='u':t.out==='none'?read==='0':read===String(t.shown);
SCENE({id:'lucid-dreaming-dialogue',name:'Talking with a dreamer',tag:'Questions in, answers out',
 definition:'In two-way communication, experimenters put a question to a person who is in a lucid dream, and the dreamer answers during the dream with eye movements or small facial twitches, without waking up.',
 example:'Asked “8 minus 6” through a speaker while in REM sleep, one dreamer answered with two left-right eye signals. Karen Konkoly and colleagues ran 158 such trials in verified lucid dreams across four laboratories: 18% of answers were correct, 3% wrong, 18% unclear, and on 61% there was no response.',
 desc:'A sum put to a simulated lucid dreamer, the eye-movement trace that follows, buttons to read the answer, and a bar chart of outcomes for the simulated dreamer beside the published percentages.',
 research:['Konkoly, Appel, Chabani, … & Paller (2021). Real-time dialogue between experimenters and dreamers during REM sleep. Current Biology 31, 1417–1427. (Four laboratories, 36 participants; most trials got no answer.)'],
 dur:14,hint:'Press Ask a sum, count the left-right swings in the trace and choose what you read. Ask 20 more fills the chart quickly.',
 init:()=>({seed:3,n:1,read:[null]}),
 watch(p){const n=1+Math.min(19,Math.floor(p*20));return {seed:3,n,read:range(n).map(i=>{const t=K4_konTrial(3,i);return t.out==='ambiguous'?'u':t.out==='none'?'0':String(t.shown)}),sim:true}},
 ui:[{b:'Ask a sum',act:'ask'},{choose:[['1','1'],['2','2'],['3','3'],['4','4'],['u','Unclear'],['0','No signal']],label:'I read the answer as',get:s=>s.read[s.n-1]||'',act:'read'},{b:'Ask 20 more',act:'many'},{b:'New dreamer',act:'fresh'}],
 on:{ask(s){if(s.n<400){s.n++;s.read.push(null)}return 'keep'},read(s,v){if(s.read[s.n-1]===null)s.read[s.n-1]=String(v);return 'keep'},many(s){for(let i=0;i<20&&s.n<400;i++){s.n++;s.read.push('auto')}return 'keep'},fresh(s){s.seed=nextSeed();s.n=1;s.read=[null];return 'keep'}},
 draw(s,f,X){
  const t=K4_konTrial(s.seed,s.n-1),rd=s.read[s.n-1],x0=40,w=520;
  let out=heading(s.sim?'Simulated dreamer: questions put during lucid REM sleep':'Ask a sum, then read the dreamer’s eyes');
  out+=R(40,48,250,40,C.amberp,'none',8)+TB(52,74,`Trial ${s.n}: “${t.a} minus ${t.b}”`,15,C.ink,'start');
  out+=T(560,66,'spoken softly, without waking',13,C.muted,'end')+T(560,84,'the sleeper · simulated',13,C.muted,'end');
  out+=R(x0,96,w,96,'#fff',C.grid,6)+K4_lane(K4_konTrace(t),x0,w,12,144,36,C.blue,2);
  out+=T(46,112,'Eye movements after the question',13,C.muted,'start')+T(554,186,'12 s',13,C.muted,'end');
  const shown=rd!==null&&rd!=='auto';
  out+=T(40,212,!shown?(rd==='auto'?'Scored automatically.':'Count the large left-right swings: one pair for each unit.'):`You read ${rd==='u'?'“unclear”':rd==='0'?'“no signal”':rd}. ${t.out==='correct'?`The dreamer signalled ${t.shown}: correct.`:t.out==='incorrect'?`The dreamer signalled ${t.shown}; the sum makes ${t.ans}.`:t.out==='ambiguous'?'Scorers could not agree on a count.':'There was no signal in the trace.'}`,13,shown?(K4_konMatch(t,rd)?C.green:C.coral):C.muted,'start');
  // Outcome chart.
  const all=range(s.n).map(i=>K4_konTrial(s.seed,i)),done=all.filter((q,i)=>s.read[i]!==null),pl=K4_plot(80,232,300,84,[0,4],[0,70],{yt:[[0,'0'],[30,'30%'],[60,'60%']]});out+=pl.svg;
  K4_KON.forEach(([key,cnt,lab],i)=>{const mine=done.length?100*done.filter(q=>q.out===key).length/done.length:0,pub=100*cnt/158;
   out+=R(pl.X(i)+14,pl.Y(Math.min(70,mine)),22,pl.Y(0)-pl.Y(Math.min(70,mine)),C.blue,'none',3)+R(pl.X(i)+40,pl.Y(pub),22,pl.Y(0)-pl.Y(pub),C.amber,'none',3)+T(pl.X(i)+38,334,lab,13,C.muted)});
  out+=R(400,236,14,14,C.blue,'none',3)+T(420,248,`Simulated: ${done.length} trial${done.length===1?'':'s'}`,13,C.ink,'start')+R(400,260,14,14,C.amber,'none',3)+T(420,272,'Published: 158',13,C.ink,'start');
  const mineRead=s.read.map((r,i)=>[r,all[i]]).filter(([r])=>r!==null&&r!=='auto');
  out+=T(400,300,mineRead.length?`Read right: ${mineRead.filter(([r,q])=>K4_konMatch(q,r)).length} of ${mineRead.length}`:'No readings yet',13,C.muted,'start');
  out+=T(300,362,'Published: 18% correct · 3% wrong · 18% unclear · 61% no response',15,C.ink);
  return {svg:out,phase:done.length<3?'The dreamer hears the sum as part of the dream, works it out, and signals the answer with left-right eye movements. In the published trials, questions were also given as flashes of light or taps, and some dreamers answered with facial muscle twitches.':`So far ${done.filter(q=>q.out==='correct').length} of ${done.length} trials gave a correct answer. Published: 29 of 158 correct (18%), 5 wrong, 28 unclear and 96 with no response. Correct answers outnumbered wrong ones by about six to one, which chance would not give, but most questions went unanswered. Dreamers later described the questions arriving as part of the dream, for example as a voice from outside it.`};
 }});

/* =========================== anaesthesia =========================== */
// Schematic curves against a made-up scale of anaesthetic level (0 to 10). Only the order is taken from the
// literature: memory goes first, then responsiveness, and experience may outlast both. Not data, not dosing.
const K4_AN={rec:x=>1/(1+Math.exp((x-2.5)/.45)),resp:x=>1/(1+Math.exp((x-4.5)/.5)),exp:x=>1/(1+Math.exp((x-7.5)/.8))};
const K4_AN_M=[['rec','Remembers afterwards',C.purple,'Later recall is measured by asking afterwards, with a fixed set of questions (the Brice interview) or by waiting for patients to speak up. It is the first thing to go: light levels of anaesthetic already block new memories.'],
 ['resp','Responds to a command',C.blue,'Responsiveness is measured at the time: “open your eyes”, “squeeze my hand”. It is what an observer can see, and it is what monitoring in theatre is built around.'],
 ['exp','Has some experience',C.coral,'Experience cannot be measured directly. The evidence is indirect: people woken from sedation often describe dreams, and a few respond to commands that they later cannot remember.']];
SCENE({id:'anaesthesia',name:'Anaesthesia',tag:'Three things that fade separately',
 definition:'General anaesthesia is a reversible, drug-induced state in which a person does not respond to surgery and does not remember it. Responding, experiencing and remembering are three different things, and anaesthetic drugs do not switch them off together.',
 example:'On 16 October 1846 in Boston, William Morton gave ether to Edward Gilbert Abbott while John Collins Warren removed a tumour from his neck. Abbott lay still, and said afterwards that he had felt scratching but no pain. Sanders and colleagues later named three states: connected consciousness, disconnected consciousness (such as a dream) and unconsciousness.',
 desc:'Three schematic curves against anaesthetic level, for later recall, response to command and having some experience, with a movable marker, three read-outs and the name of the resulting state.',
 research:['Bigelow (1846). Insensibility during surgical operations produced by inhalation. Boston Medical and Surgical Journal 35, 309–317.','Sanders, Tononi, Laureys & Sleigh (2012). Unresponsiveness ≠ unconsciousness. Anesthesiology 116, 946–959.','Noreika et al. (2011). Consciousness lost and found: subjective experiences in an unresponsive state. Brain and Cognition 77, 327–334. (The order of the three curves is well supported; their exact shapes here are schematic.)'],
 dur:12,hint:'Slide the level and watch the three measures separate. Choose a measure to see how it is taken. Nothing here is medical advice.',
 init:()=>({x:3.5,m:'resp'}),
 watch(p){return {x:Math.round(100*p)/10,m:p<.33?'rec':p<.66?'resp':'exp'}},
 ui:[{range:'x',label:'Anaesthetic level (schematic)',min:0,max:10,step:.5,get:s=>s.x,act:'x',show:v=>Number(v).toFixed(1)},{choose:K4_AN_M.map(m=>[m[0],m[1]]),label:'How is it measured?',get:s=>s.m,act:'m'}],
 on:{x(s,v){s.x=Number(v);return 'keep'},m(s,v){if(K4_AN[v])s.m=v;return 'keep'}},
 draw(s){
  let out=heading('Remembering, responding and experiencing fade separately');
  const pl=K4_plot(64,62,290,206,[0,10],[0,100],{xt:[[0,'0'],[5,'5'],[10,'10']],yt:[[0,'0'],[50,'50%'],[100,'100%']],xl:'anaesthetic level (made-up scale)',yl:'chance, schematic'});out+=pl.svg;
  K4_AN_M.forEach(([k,lab,col])=>{const pts=[];for(let i=0;i<=100;i++)pts.push([pl.X(i/10),pl.Y(100*K4_AN[k](i/10))]);out+=K4_poly(pts,col,k===s.m?3.6:2)});
  out+=L(pl.X(s.x),64,pl.X(s.x),266,C.amber,2);K4_AN_M.forEach(([k,lab,col])=>{out+=Ci(pl.X(s.x),pl.Y(100*K4_AN[k](s.x)),5.5,col,'#fff')});
  K4_AN_M.forEach(([k,lab,col],i)=>{const y=62+i*58,v=K4_AN[k](s.x);out+=R(380,y,200,50,k===s.m?C.amberp:'#fff',k===s.m?C.amber:C.grid,8)+T(390,y+19,['Recall afterwards','Response to command','Some experience'][i],13,C.muted,'start')+R(390,y+28,120,12,'#eef3f6','none',4)+R(390,y+28,120*v,12,col,'none',4)+TB(572,y+40,Math.round(100*v)+'%',14,col,'end')});
  const resp=K4_AN.resp(s.x)>.5,ex=K4_AN.exp(s.x)>.5,name=resp?'Connected: responds to the outside world':ex?'Unresponsive, experience still likely':'Unresponsive, experience unlikely';
  out+=R(380,238,200,66,resp?C.pale:ex?C.coralp:'#eef3f6','none',8)+T(390,258,'State at this level',13,C.muted,'start')+TB(390,278,resp?'Connected':ex?'Disconnected':'Unconscious',15,C.ink,'start')+T(390,296,resp?'responds to the world':ex?'may be dreaming':'no experience expected',13,C.ink,'start');
  out+=T(64,322,'Schematic: order from studies; shapes are not data.',13,C.muted,'start');
  out+=T(300,356,name,15,resp?C.blue:ex?C.coral:C.ink);
  const m=K4_AN_M.find(q=>q[0]===s.m);
  return {svg:out,phase:`${m[3]} ${resp?(K4_AN.rec(s.x)<.5?'At this level the person still answers, yet will probably remember nothing of it later.':'At this level the person answers and will remember.'):ex?'Here the body no longer responds, but that alone does not show that experience has stopped: unresponsive is not the same as unconscious.':'At deep levels all three are gone, which is the aim of general anaesthesia for surgery.'}`};
 }});

const K4_AGENT={
 awake:{name:'No drug',target:'none',resp:'yes',rep:'not applicable',pci:'high',say:'Awake. GABA-A receptors open briefly when GABA binds, letting chloride in to quieten the cell, and NMDA receptors pass excitatory current. A magnetic pulse to the cortex sets off a long, complex echo.'},
 propofol:{name:'Propofol',target:'GABA-A: enhanced',resp:'no',rep:'usually nothing',pci:'low',say:'Propofol binds the GABA-A receptor and keeps its channel open for longer, so more chloride enters and the cell is harder to excite. The volatile gases such as sevoflurane also enhance GABA-A receptors, among other actions. In Sarasso’s study, volunteers woken from propofol reported no experience, and the echo of a magnetic pulse was simple and local.'},
 ketamine:{name:'Ketamine',target:'NMDA: blocked',resp:'no',rep:'vivid, dream-like',pci:'high, as in waking',say:'Ketamine plugs the pore of the NMDA receptor, a channel for excitatory signals. At anaesthetic levels the body does not respond, yet the volunteers in Sarasso’s study described long, vivid dream-like experiences afterwards, and the echo of a magnetic pulse stayed as complex as in waking.'}};
SCENE({id:'anaesthesia-receptors',name:'How anaesthetics act',tag:'Two receptors, two kinds of absence',
 definition:'Most general anaesthetics, including propofol and the volatile gases, strengthen inhibition at GABA-A receptors. Ketamine instead blocks NMDA receptors, and can leave vivid experience behind an unresponsive body.',
 example:'For decades anaesthetics were thought to work by dissolving in the fatty cell membrane, because their potency follows their solubility in oil (Meyer 1899, Overton 1901). In 1984 Franks and Lieb showed that they act on a protein with no membrane present, and the search turned to receptors.',
 desc:'A cell membrane with a GABA-A receptor and an NMDA receptor, showing which one the chosen drug acts on, beside read-outs of responsiveness, reports on waking and the complexity of the brain’s response to a magnetic pulse.',
 research:['Franks & Lieb (1984). Do general anaesthetics act by competitive binding to specific receptors? Nature 310, 599–601.','Franks (2008). General anaesthesia: from molecular targets to neuronal pathways of sleep and arousal. Nature Reviews Neuroscience 9, 370–386.','Sarasso, Boly, Napolitani, … Laureys & Massimini (2015). Consciousness and complexity during unresponsiveness induced by propofol, xenon, and ketamine. Current Biology 25, 3099–3105. (Small groups of healthy volunteers.)'],
 dur:12,hint:'Choose a drug and compare the receptor it acts on with what people report on waking. Nothing here is medical advice.',
 init:()=>({a:'propofol'}),
 watch(p){return {a:p<.3?'awake':p<.65?'propofol':'ketamine'}},
 ui:[{choose:[['awake','No drug'],['propofol','Propofol'],['ketamine','Ketamine']],label:'Drug',get:s=>s.a,act:'a'}],
 on:{a(s,v){if(K4_AGENT[v])s.a=v;return 'keep'}},
 draw(s){
  const g=K4_AGENT[s.a]||K4_AGENT.awake,pro=s.a==='propofol',ket=s.a==='ketamine';let out=heading('Where the drug acts, and what is left');
  out+=T(40,74,'outside the nerve cell',13,C.muted,'start')+R(40,150,300,44,C.amberp,'none',4)+T(40,304,'inside the nerve cell',13,C.muted,'start');
  const chan=(x,col,open)=>R(x-26,140,20,64,col,'none',6)+R(x+6,140,20,64,col,'none',6)+R(x-6,150,12,44,open?'#fff':'#fff','none',0);
  out+=chan(120,C.green,true)+chan(260,C.purple,!ket);
  out+=TB(120,100,'GABA-A receptor',13,C.green)+T(120,118,'inhibits the cell',13,C.muted)+TB(260,100,'NMDA receptor',13,C.purple)+T(260,118,'excites the cell',13,C.muted);
  out+=arrow(120,128,120,236,C.green,pro?7:2.5,pro?13:9)+T(120,256,pro?'more chloride in':'chloride in',13,C.green);
  if(pro)out+=Ci(150,158,8,C.coral,'#fff')+TB(190,150,'propofol',13,C.coral)+T(120,274,'channel held open longer',13,C.coral);
  if(ket)out+=Ci(260,172,7,C.coral,'#fff')+TB(260,256,'ketamine',13,C.coral)+T(260,274,'blocks the pore',13,C.coral);
  else out+=arrow(260,128,260,236,C.purple,2.5)+T(260,256,'sodium, calcium in',13,C.purple);
  out+=T(190,330,'Schematic of two receptor channels',13,C.muted);
  const tile=(y,lab,val,col)=>R(366,y,214,50,'#fff',C.grid,8)+T(376,y+19,lab,13,C.muted,'start')+TB(376,y+40,val,14,col,'start');
  out+=tile(56,'Main receptor target',g.target,s.a==='awake'?C.muted:C.coral)+tile(112,'Responds to commands',g.resp,g.resp==='yes'?C.green:C.coral)+tile(168,'Report on waking',g.rep,ket?C.coral:C.ink)+tile(224,'Echo of a pulse (PCI)',g.pci,g.pci==='low'?C.muted:C.blue);
  out+=T(366,296,'Source: Sarasso et al. 2015',13,C.muted,'start');
  out+=T(300,358,s.a==='awake'?'Awake: both receptors work normally.':pro?'Propofol: unresponsive, and nothing to report.':'Ketamine: unresponsive, yet vivid experience is reported.',15,ket?C.coral:C.ink);
  return {svg:out,phase:g.say+(s.a==='awake'?'':' Two people who look the same from outside, still and silent, can be in different states. See the lesson on perturbational complexity for how the echo is measured.')};
 }});

// Isolated forearm technique: Sanders et al. (2017), 12 of 260 patients (4.6%) responded to command after intubation.
const K4_IFT_P=12/260;
const K4_iftResp=(seed,i)=>{const r=K4_rng(seed*2609+i*3);r();return r()<K4_IFT_P};
const K4_IFT_SEED=15;
SCENE({id:'anaesthesia-forearm',name:'The isolated forearm',tag:'A hand left free to answer',
 definition:'Muscle relaxants used in surgery paralyse the body, so a patient could not move even if aware. In the isolated forearm technique a cuff on the arm is inflated before the relaxant is given, keeping the drug out of the hand, which stays free to squeeze in answer to a command.',
 example:'Tunstall introduced the technique in 1977 during caesarean sections. In an international study, 12 of 260 patients (4.6%, about 1 in 20) squeezed on command just after the breathing tube was placed. Almost none of them remembered it afterwards.',
 desc:'An arm with an inflated cuff that keeps muscle relaxant out of the forearm and hand, and a grid of 260 simulated patients in which those who squeezed on command are marked, beside the published count.',
 research:['Tunstall (1977). Detecting wakefulness during general anaesthesia for caesarean section. British Medical Journal 1, 1321.','Sanders, Gaskell, Raz, … & Sleigh (2017). Incidence of connected consciousness after tracheal intubation: a prospective, international, multicenter cohort study of the isolated forearm technique. Anesthesiology 126, 214–222. (One study; the moment tested is just after intubation, when anaesthesia is often lightest.)'],
 dur:12,hint:'Ask patients one at a time, or all 260, and compare your group with the published one. New group draws a different 260. Nothing here is medical advice.',
 init:()=>({seed:K4_IFT_SEED,n:0}),
 watch(p){return {seed:K4_IFT_SEED,n:p<.4?0:Math.round(260*smooth((p-.4)/.55)),step:p<.14?0:p<.27?1:p<.4?2:3}},
 ui:[{b:'Ask one patient',act:'one'},{b:'Ask all 260',act:'all'},{b:'New group',act:'fresh'}],
 on:{one(s){if(s.n<260)s.n++;return 'keep'},all(s){s.n=260;return 'keep'},fresh(s){s.seed=nextSeed();s.n=0;return 'keep'}},
 draw(s,f,X){
  const k=range(s.n).filter(i=>K4_iftResp(s.seed,i)).length,last=s.n?K4_iftResp(s.seed,s.n-1):false,step=s.step===undefined?3:s.step;
  let out=heading('“If you can hear me, squeeze my hand”');
  // The arm: shoulder at the left, hand at the right.
  const drug=step>=1;
  out+=R(40,150,104,40,drug?C.purplep:'#f6ece4',C.line,10)+R(170,154,86,32,'#f6ece4',C.line,10)+R(142,140,30,60,C.dark,'none',6);
  out+=last&&s.n?Ci(270,170,17,'#f6ece4',C.coral)+P('M262 160 Q274 164 264 170 Q276 174 264 180',C.coral,2):Ci(266,170,14,'#f6ece4',C.line)+L(278,162,296,158,C.line,5)+L(280,170,300,170,C.line,5)+L(278,178,296,182,C.line,5);
  out+=TB(157,132,'cuff',13,C.ink)+T(92,214,drug?'relaxant':'upper arm',13,drug?C.purple:C.muted)+T(92,235,drug?'in the blood':'',13,C.purple)+T(226,214,'forearm and hand',13,C.muted)+T(226,235,'still able to move',13,C.muted);
  if(drug)out+=arrow(60,120,128,120,C.purple,2.5)+T(94,110,'stopped here',13,C.purple);
  if(step>=2)out+=R(150,66,150,34,C.amberp,'none',10)+TB(225,88,'“Squeeze my hand”',13,C.ink);
  out+=T(170,270,!s.n?(step<1?'1. The cuff is inflated.':step<2?'2. The relaxant is given.':'3. The command is spoken.'):last?`Patient ${s.n} squeezed.`:`Patient ${s.n} did not move.`,13,last&&s.n?C.coral:C.ink);
  out+=T(170,300,'Schematic · simulated patients',13,C.muted);
  out+=T(322,62,'260 patients, one dot each',13,C.muted,'start')+K4_array(326,76,260,0,26,9.6,3.6,C.coral,'#d5e0e7',i=>i<s.n&&K4_iftResp(s.seed,i));
  for(let i=0;i<s.n;i++)if(!K4_iftResp(s.seed,i))out+=Ci(326+(i%26)*9.6,76+Math.floor(i/26)*9.6,3.6,'#8aa5b8');
  out+=counter(322,184,'squeezed, this group',s.n?`${k} of ${s.n} (${(100*k/s.n).toFixed(1)}%)`:'none asked yet',C.coral,250)+counter(322,238,'published (Sanders 2017)','12 of 260 (4.6%)',C.ink,250);
  out+=T(322,306,'Grey: asked, no response.',13,C.muted,'start')+T(322,324,'Coral: squeezed.',13,C.muted,'start');
  out+=T(300,356,'About 1 patient in 20 answered; almost none recalled it later.',15,C.ink);
  return {svg:out,phase:s.n<260?(step<3?'The cuff is inflated above the forearm before the muscle relaxant is injected, so the drug reaches the rest of the body but not the hand.':'The anaesthetist speaks the command and watches the hand. A squeeze is a response to the outside world while the rest of the body is paralysed: what Sanders and colleagues call connected consciousness.'):`In this group ${k} of 260 squeezed (${(100*k/260).toFixed(1)}%); the published study found 12 of 260 (4.6%). A different 260 patients would give a slightly different count. Responding at the time and remembering later are different measures: hardly any of the patients who squeezed could recall it afterwards.`};
 }});

// Three ways of counting awareness under general anaesthesia, and three very different rates.
const K4_COUNT=[
 {id:'ift',name:'Hand squeeze at the time',rate:12/260,src:'12 of 260 · Sanders 2017',say:'Asked at the moment, with a hand kept free of the muscle relaxant, about 1 patient in 22 responded just after the breathing tube was placed. This measures responsiveness at one moment, not memory.'},
 {id:'int',name:'Interview afterwards',rate:25/19575,src:'25 of 19,575 · Sebel 2004',say:'Asked a fixed set of questions after the operation, 25 of 19,575 patients (0.13%, about 1 in 780) recalled being aware. This measures experience that was also remembered.'},
 {id:'rep',name:'Patients’ own reports',rate:1/19000,src:'1 in 19,000 · NAP5 2014',say:'Counting only patients who came forward by themselves, the fifth UK National Audit Project found about 1 report in 19,000 general anaesthetics. This measures recall that the person also chose to report.'}];
SCENE({id:'anaesthesia-counting',name:'How often are people aware?',tag:'The answer depends on how you ask',
 definition:'Awareness with recall means being conscious during general anaesthesia and remembering it afterwards. How common awareness appears to be depends on the measure: a response at the time, recall drawn out by an interview, or a report the patient volunteers.',
 example:'Three large studies give three rates: about 1 in 22 patients responded to a command at the time, about 1 in 780 recalled awareness when interviewed, and about 1 in 19,000 reported it unprompted. The gaps between them are the gaps between responding, remembering and telling.',
 desc:'Three bars on a logarithmic scale for three ways of counting awareness under anaesthesia, with the chosen method highlighted, and the number of patients each rate would mean for a chosen number of operations.',
 research:['Sanders et al. (2017). Anesthesiology 126, 214–222 (isolated forearm, 260 patients).','Sebel, Bowdle, Ghoneim, Rampil, Padilla, Gan & Domino (2004). The incidence of awareness during anesthesia: a multicenter United States study. Anesthesia & Analgesia 99, 833–839.','Pandit et al. (2014). 5th National Audit Project (NAP5) on accidental awareness during general anaesthesia: summary of main findings and risk factors. British Journal of Anaesthesia 113, 549–559. (All three are large studies; they differ in patients, timing and method, so the rates are not directly comparable.)'],
 dur:12,hint:'Choose how awareness is counted, then change the number of operations. Nothing here is medical advice.',
 init:()=>({m:'int',n:20000}),
 watch(p){return {m:p<.33?'ift':p<.66?'int':'rep',n:20000}},
 ui:[{choose:K4_COUNT.map(c=>[c.id,c.name]),label:'Counted by',get:s=>s.m,act:'m'},{range:'n',label:'Operations',min:1000,max:100000,step:1000,get:s=>s.n,act:'n',show:v=>Number(v).toLocaleString('en-GB')}],
 on:{m(s,v){if(K4_COUNT.some(c=>c.id===v))s.m=v;return 'keep'},n(s,v){s.n=Number(v);return 'keep'}},
 draw(s,f,X){
  const x0=214,w=330,XL=r=>x0+(Math.log10(r)+5)/5*w,cur=K4_COUNT.find(c=>c.id===s.m)||K4_COUNT[0];let out=heading('Three ways to count, three different answers');
  [[1e-5,'1 in 100,000'],[1e-4,'10,000'],[1e-3,'1,000'],[1e-2,'100'],[1e-1,'10'],[1,'1 in 1']].forEach(([r,l])=>{out+=L(XL(r),64,XL(r),200,C.grid,1)+T(XL(r),215,l.replace('1 in 100,000','100,000').replace('1 in 1','1'),13,C.muted)});
  out+=T(x0+w/2,232,'one patient in this many · each step is ten times rarer',13,C.muted);
  K4_COUNT.forEach((c,i)=>{const y=72+i*44,on=c.id===s.m;
   out+=hit(X,'m',c.id,`${c.name}: 1 in ${Math.round(1/c.rate).toLocaleString('en-GB')}`,R(30,y-4,540,38,on?C.amberp:'#fff',on?C.amber:'none',6)+TBF(38,y+13,c.name,13,C.ink,'start')+TF(38,y+29,c.src,13,C.muted,'start')+R(x0,y+3,XL(c.rate)-x0,20,on?C.coral:'#9cbad0','none',4)+TB(XL(c.rate)+6,y+18,'1 in '+Math.round(1/c.rate).toLocaleString('en-GB'),13,C.ink,'start'))});
  out+=TB(40,256,`In ${s.n.toLocaleString('en-GB')} operations, if each study’s rate held:`,13,C.ink,'start');
  K4_COUNT.forEach((c,i)=>{const v=s.n*c.rate;out+=counter(40+i*180,264,i===0?'would squeeze':i===1?'recall at interview':'report unprompted',v<10?v.toFixed(1):Math.round(v).toLocaleString('en-GB'),c.id===s.m?C.coral:C.ink,168)});
  out+=T(40,332,'Different patients and methods: compare sizes, not decimals.',13,C.muted,'start');
  out+=T(300,360,`${cur.name}: about 1 in ${Math.round(1/cur.rate).toLocaleString('en-GB')}`,15,C.coral);
  return {svg:out,phase:cur.say+' Each step from left to right on the scale is ten times rarer. The three figures do not contradict one another; they answer three different questions.'};
 }});

/* =========================== disorders-of-consciousness =========================== */
const K4_STATES=[['coma','Coma',[74,262]],['uws','Unresponsive wakefulness',[236,262]],['mcs','Minimally conscious',[236,186]],['lis','Locked-in syndrome',[236,110]]];
const K4_CASES=[
 {a:'coma',t:['Eyes stay closed, even when the','person is spoken to or touched firmly.','There is no cycle of sleep and waking.'],why:'Coma: no eye opening and no sleep–wake cycle. It rarely lasts more than a few weeks.'},
 {a:'uws',t:['Eyes open in the day and close at','night. Movements are reflexes only;','nothing follows a request.'],why:'Unresponsive wakefulness: wakeful, with sleep–wake cycles, but no behaviour that shows awareness.'},
 {a:'mcs',t:['On several occasions the eyes follow','a mirror moved slowly across','the person’s view.'],why:'Minimally conscious: following a moving mirror with the eyes, reproducibly, is a sign of awareness on the bedside scale.'},
 {a:'mcs',t:['Squeezes a hand when asked on some','attempts but not on others. The','response is seen on repeated days.'],why:'Minimally conscious: command-following that is inconsistent but reproducible.'},
 {a:'lis',t:['Cannot move the limbs or speak.','Answers questions reliably by','looking up for yes.'],why:'Locked-in syndrome: full awareness with almost complete paralysis. It is not a disorder of consciousness, but it can be mistaken for one.'},
 {a:'uws',t:['Eyes are open. The person startles','at a loud noise and grimaces, but','shows no response linked to requests.'],why:'Unresponsive wakefulness: startle and grimacing are reflexes and do not show awareness of the surroundings.'}];
SCENE({id:'disorders-of-consciousness',name:'Disorders of consciousness',tag:'Awake is not the same as aware',
 definition:'After severe brain injury a person may be in a coma (eyes closed, no sleep–wake cycle), in unresponsive wakefulness (eyes open at times, but no behavioural sign of awareness) or in a minimally conscious state (inconsistent but reproducible signs of awareness).',
 example:'Jennett and Plum described the vegetative state in 1972; Laureys and colleagues proposed the name unresponsive wakefulness syndrome in 2010. The diagnosis rests on behaviour at the bedside, and it is hard: when 44 people diagnosed by clinical consensus were re-examined with a standard scale, 18 (41%) showed signs of awareness.',
 desc:'A chart with wakefulness along the bottom and signs of awareness up the side, on which coma, unresponsive wakefulness, the minimally conscious state and locked-in syndrome are placed, beside a described bedside observation to classify.',
 research:['Jennett & Plum (1972). Persistent vegetative state after brain damage: a syndrome in search of a name. Lancet 299, 734–737.','Giacino et al. (2002). The minimally conscious state: definition and diagnostic criteria. Neurology 58, 349–353.','Laureys et al. (2010). Unresponsive wakefulness syndrome: a new name for the vegetative state or apallic syndrome. BMC Medicine 8, 68.','Schnakers et al. (2009). Diagnostic accuracy of the vegetative and minimally conscious state. BMC Neurology 9, 35. (The categories are standard; where the boundaries lie is still debated.)'],
 dur:14,hint:'Read the description and choose the state that fits. These are teaching descriptions, not real people, and nothing here is medical advice.',
 init:()=>({seed:4,i:0,ans:[]}),
 watch(p){const k=Math.min(6,Math.floor(p*7)),ord=shuffled(range(6),4);return {seed:4,i:Math.min(5,k),ans:ord.slice(0,k).map(j=>K4_CASES[j].a)}},
 ui:[{b:'Coma',act:'say',arg:'coma'},{b:'Unresponsive wakefulness',act:'say',arg:'uws'},{b:'Minimally conscious',act:'say',arg:'mcs'},{b:'Locked-in',act:'say',arg:'lis'},{b:'Next description',act:'next'},{b:'Start again',act:'fresh'}],
 on:{say(s,a){if(s.ans[s.i]===undefined)s.ans[s.i]=a;return 'keep'},next(s){if(s.ans[s.i]!==undefined&&s.i<5)s.i++;return 'keep'},fresh(s){s.seed=nextSeed();s.i=0;s.ans=[];return 'keep'}},
 draw(s,f,X){
  const ord=shuffled(range(6),s.seed),c=K4_CASES[ord[s.i]],a=s.ans[s.i],score=s.ans.filter((v,i)=>v===K4_CASES[ord[i]].a).length;
  let out=heading('Wakefulness and awareness are two different things');
  out+=R(34,62,244,232,'#fff',C.grid,6)+arrow(46,284,268,284,C.muted,1.6)+arrow(46,284,46,72,C.muted,1.6);
  out+=T(160,312,'wakefulness (eyes open)',13,C.muted)+T(52,84,'signs of awareness',13,C.muted,'start');
  K4_STATES.forEach(([id,name,[x,y]])=>{const on=a!==undefined&&c.a===id,mine=a===id;out+=hit(X,'say',id,name,Ci(x,y,on?13:10,on?C.green:mine?C.coral:id==='lis'?'#fff':C.pale,on?C.green:mine?C.coral:id==='lis'?C.purple:C.blue))+(id==='coma'?TB(x,y-20,'Coma',13,C.ink):TB(x-18,y+5,id==='uws'?'Unresponsive':id==='mcs'?'Minimally conscious':'Locked-in',13,C.ink,'end'))});
  out+=T(218,136,'(aware, cannot move)',13,C.muted,'end')+T(218,212,'(signs come and go)',13,C.muted,'end');
  out+=R(296,62,284,128,C.amberp,'none',8)+TB(308,84,`Description ${s.i+1} of 6`,13,C.muted,'start')+K4_lines(308,110,c.t,14,C.ink,'start',21);
  if(a===undefined)out+=T(308,214,'Which state fits best?',13,C.muted,'start');
  else{const ok=a===c.a;out+=R(296,198,284,50,ok?C.greenp:C.coralp,'none',8)+TB(308,219,ok?'That fits the criteria.':'The criteria point elsewhere:',13,ok?C.green:C.coral,'start')+TB(308,239,K4_STATES.find(q=>q[0]===c.a)[1],14,C.ink,'start')}
  for(let i=0;i<6;i++){const v=s.ans[i];out+=R(308+i*26,262,20,20,v===undefined?'#eef3f6':v===K4_CASES[ord[i]].a?C.green:C.coral,i===s.i?C.amber:'none',5)}
  out+=T(476,277,`${score} of ${s.ans.length} so far`,13,C.ink,'start');
  out+=T(296,312,'Teaching cases, not real people.',13,C.muted,'start');
  out+=T(300,356,a===undefined?'Eyes open shows wakefulness. Awareness needs more than that.':s.ans.length===6?`You matched ${score} of 6 descriptions to the criteria.`:'Press Next description to continue.',15,C.ink);
  return {svg:out,phase:a===undefined?'Wakefulness is judged from eye opening and sleep–wake cycles. Awareness is judged from behaviour that could not be a reflex: following a command, tracking a moving object, answering yes or no. The two usually go together, but after brain injury they can separate.':c.why+' Bedside signs can be missed when they are rare or when the person cannot move, which is why repeated, standardised examination matters, and why the next two scenes look past behaviour altogether.'};
 }});

// Mental imagery as a code: tennis (motor imagery, supplementary motor area) for yes, walking through the home
// (place imagery, parahippocampal and parietal regions) for no. One question in six gives no clear activity.
const K4_Q=[['Is your father’s name Alexander?',true],['Is your father’s name Thomas?',false],['Do you have any brothers?',true],['Do you have any sisters?',false],['Have you ever been to France?',true],['Have you ever been to Japan?',false]];
function K4_qTrials(seed){const r=K4_rng(seed),blank=Math.floor(r()*6);return shuffled(range(6),seed+1).map((j,i)=>{const yes=K4_Q[j][1],none=i===blank;return {q:K4_Q[j][0],yes,none,sma:none?.1+.14*r():yes?.68+.25*r():.08+.18*r(),ppa:none?.1+.14*r():yes?.08+.18*r():.68+.25*r()}})}
const K4_qTruth=t=>t.none?'x':t.yes?'y':'n';
SCENE({id:'disorders-of-consciousness-imagery',name:'Answering by imagination',tag:'Tennis for yes, home for no',
 definition:'In the mental imagery task a person in a scanner is asked to imagine playing tennis or walking through their home. The two kinds of imagery activate different brain regions, so a person who cannot move can still follow a command, and can even answer yes or no.',
 example:'In 2006 a woman who met the bedside criteria for the vegetative state was asked to imagine each activity. Her brain responses could not be told apart from those of healthy volunteers. In 2010, 5 of 54 patients could do this, and one of them answered five of six yes–no questions correctly; the sixth gave no clear activity.',
 desc:'A top view of a brain with a motor-imagery region and place-imagery regions that light up according to the task, two activity bars with a threshold, and a set of six yes–no questions to decode.',
 research:['Owen, Coleman, Boly, Davis, Laureys & Pickard (2006). Detecting awareness in the vegetative state. Science 313, 1402.','Monti, Vanhaudenhuyse, Coleman, Boly, Pickard, Tshibanda, Owen & Laureys (2010). Willful modulation of brain activity in disorders of consciousness. New England Journal of Medicine 362, 579–589. (Replicated by several groups with fMRI and EEG; a negative result does not show that awareness is absent.)'],
 dur:14,hint:'Try the two imagery tasks first. Then choose Questions and decode each answer from the two bars: tennis means yes, home means no.',
 init:()=>({task:'tennis',seed:9,i:0,ans:[]}),
 watch(p){if(p<.2)return {task:'tennis',seed:9,i:0,ans:[]};if(p<.4)return {task:'home',seed:9,i:0,ans:[]};const tr=K4_qTrials(9),k=Math.min(6,Math.floor((p-.4)/.6*7));return {task:'q',seed:9,i:Math.min(5,k),ans:tr.slice(0,k).map(K4_qTruth)}},
 ui:[{choose:[['tennis','Imagine tennis'],['home','Imagine walking at home'],['q','Questions']],label:'Task',get:s=>s.task,act:'task'},{b:'Yes',act:'say',arg:'y'},{b:'No',act:'say',arg:'n'},{b:'Cannot tell',act:'say',arg:'x'},{b:'Next question',act:'next'},{b:'New set',act:'fresh'}],
 on:{task(s,v){if(['tennis','home','q'].includes(v))s.task=v;return 'keep'},say(s,a){if(s.task==='q'&&s.ans[s.i]===undefined)s.ans[s.i]=a;return 'keep'},next(s){if(s.task==='q'&&s.ans[s.i]!==undefined&&s.i<5)s.i++;return 'keep'},fresh(s){s.seed=nextSeed();s.i=0;s.ans=[];s.task='q';return 'keep'}},
 draw(s,f,X){
  const tr=K4_qTrials(s.seed),t=tr[s.i],q=s.task==='q',sma=q?t.sma:s.task==='tennis'?.86:.12,ppa=q?t.ppa:s.task==='home'?.84:.1,a=q?s.ans[s.i]:undefined,cx=130,cy=196;
  let out=heading(q?'Decode the answer: tennis means yes, home means no':'Following a command without moving');
  out+=`<ellipse cx="${cx}" cy="${cy}" rx="88" ry="108" fill="#f4f8fa" stroke="${C.line}" stroke-width="2.5"/>`+L(cx,92,cx,300,C.line,1.5)+T(cx,80,'front',13,C.muted)+T(cx,322,'back',13,C.muted);
  out+=`<ellipse cx="${cx}" cy="${cy-42}" rx="30" ry="15" fill="${tint(C.coral,1-sma)}" stroke="${C.coral}" stroke-width="2"/>`;
  for(const dx of [-34,34])out+=`<ellipse cx="${cx+dx}" cy="${cy+44}" rx="17" ry="24" fill="${tint(C.blue,1-ppa)}" stroke="${C.blue}" stroke-width="2"/>`;
  out+=T(cx,342,'Schematic top view',13,C.muted);
  const bx=250,base=262,H=150;out+=L(bx-6,base,bx+150,base,C.line,1.5);
  [[sma,C.coral,'movement','imagery'],[ppa,C.blue,'place','imagery']].forEach(([v,col,l1,l2],i)=>{const x=bx+10+i*72;out+=R(x,base-H*v,46,H*v,col,'none',4)+T(x+23,base+17,l1,13,col)+T(x+23,base+38,l2,13,col)});
  out+=L(bx-6,base-H*.45,bx+150,base-H*.45,C.muted,1.5,'stroke-dasharray="5 4"')+T(bx-6,80,'activity (simulated)',13,C.muted,'start')+T(bx-6,101,'dashed: threshold',13,C.muted,'start');
  out+=R(416,56,164,250,'#fff',C.grid,8);
  if(!q){out+=TB(426,80,'Instruction',13,C.muted,'start')+K4_lines(426,102,s.task==='tennis'?['“Imagine playing','tennis.”']:['“Imagine walking','through the rooms','of your home.”'],14,C.ink,'start',20);
   out+=K4_lines(426,190,s.task==='tennis'?['The movement-imagery','region responds, as it','does in healthy','volunteers.']:['The place-imagery','regions respond, as','they do in healthy','volunteers.'],13,C.muted)}
  else{out+=TB(426,80,`Question ${s.i+1} of 6`,13,C.muted,'start')+K4_lines(426,102,K4_wrap(t.q,21),14,C.ink,'start',19);
   if(a===undefined)out+=K4_lines(426,176,['Read the bars, then','press Yes, No or','Cannot tell.'],13,C.muted);
   else{const tru=K4_qTruth(t),ok=a===tru;out+=R(422,158,152,58,ok?C.greenp:C.coralp,'none',6)+TBF(430,180,tru==='x'?'No clear signal':tru==='y'?'Signal: yes':'Signal: no',14,C.ink,'start')+TF(430,202,ok?'You read it correctly.':'You read it differently.',13,ok?C.green:C.coral,'start')+TF(430,240,tru!=='x'?`True answer: ${t.yes?'yes':'no'}`:'Not a wrong answer.',13,C.muted,'start')}
   for(let i=0;i<6;i++){const v=s.ans[i];out+=R(426+i*24,262,19,19,v===undefined?'#eef3f6':v===K4_qTruth(tr[i])?C.green:C.coral,i===s.i?C.amber:'none',5)}
   out+=T(426,298,`${s.ans.filter((v,i)=>v===K4_qTruth(tr[i])).length} of ${s.ans.length} read right`,13,C.ink,'start')}
  out+=T(300,366,!q?(s.task==='tennis'?'Imagining tennis: the movement region is active.':'Imagining a walk at home: the place regions are active.'):a===undefined?'Which region is above the threshold?':t.none?'Silence is not an answer, and not evidence of absence.':`Movement imagery means yes; place imagery means no.`,15,C.ink);
  return {svg:out,phase:!q?'Imagining a complex movement engages the supplementary motor area near the top of the brain; imagining moving through a familiar place engages parahippocampal and parietal regions further back. Keeping an image going for 30 seconds on request, and stopping on request, is hard to explain as a reflex.':a===undefined?'The simulated patient was told: to answer yes, imagine tennis; to answer no, imagine walking through your home. Each question is followed by a scan.':t.none?'Neither region responded. The person may have been asleep, may not have heard, or may have been unable to keep the image going. Monti’s patient also gave five clear answers and one scan with no clear activity. A missing response cannot show that awareness is missing.':`The pattern decodes as ${t.yes?'yes':'no'}, which is the true answer. The answer was produced by imagination alone, by someone who showed no response at the bedside. After six questions, compare your count with the published five of six.`};
 }});

// Covert command-following: published counts, and a toy calculation of what a negative test means.
const K4_STUDY=[
 {id:'monti',name:'Monti 2010',k:5,n:54,what:'fMRI imagery task'},
 {id:'claassen',name:'Claassen 2019',k:16,n:104,what:'EEG, days after injury'},
 {id:'bodien',name:'Bodien 2024',k:60,n:241,what:'fMRI or EEG, six centres'}];
const K4_post=(prior,sens)=>prior*(1-sens)/(prior*(1-sens)+(1-prior));
SCENE({id:'disorders-of-consciousness-covert',name:'Hidden awareness',tag:'What a negative result cannot show',
 definition:'Cognitive motor dissociation is the name given when a person shows no response to commands at the bedside, yet brain recordings show that they are following those commands. Studies find it in a substantial minority of people tested.',
 example:'In the largest study so far, 60 of 241 people (25%) with no visible response to commands showed command-following on fMRI or EEG. But the same tests picked up only 43 of 112 people (38%) who could follow commands at the bedside, so the tests miss many people who are certainly aware.',
 desc:'A grid of dots for the people tested in one of three studies with those who followed commands covertly filled in, beside a toy calculation showing how little a negative test lowers the chance of hidden awareness.',
 research:['Monti et al. (2010). New England Journal of Medicine 362, 579–589 (5 of 54).','Claassen et al. (2019). Detection of brain activation in unresponsive patients with acute brain injury. New England Journal of Medicine 380, 2497–2505 (16 of 104).','Bodien et al. (2024). Cognitive motor dissociation in disorders of consciousness. New England Journal of Medicine 391, 598–608 (60 of 241; 43 of 112 with bedside command-following).','Schiff (2015). Cognitive motor dissociation following severe brain injuries. JAMA Neurology 72, 1413–1415. (Found repeatedly; rates vary with method, timing and who is tested.)'],
 dur:12,hint:'Choose a study, then move the two sliders in the toy calculation. It is a way to think about tests, not a guide to any person’s condition.',
 init:()=>({st:'bodien',prior:25,sens:38}),
 watch(p){return {st:p<.25?'monti':p<.5?'claassen':'bodien',prior:25,sens:p<.6?38:Math.round(38+(p-.6)/.4*52)}},
 ui:[{choose:K4_STUDY.map(q=>[q.id,q.name]),label:'Study',get:s=>s.st,act:'st'},{range:'prior',label:'Chance of hidden awareness before the test',min:5,max:50,step:5,get:s=>s.prior,act:'prior',show:v=>v+'%'},{range:'sens',label:'Share of aware people the test detects',min:20,max:90,step:2,get:s=>s.sens,act:'sens',show:v=>v+'%'}],
 on:{st(s,v){if(K4_STUDY.some(q=>q.id===v))s.st=v;return 'keep'},prior(s,v){s.prior=Number(v);return 'keep'},sens(s,v){s.sens=Number(v);return 'keep'}},
 draw(s){
  const st=K4_STUDY.find(q=>q.id===s.st)||K4_STUDY[2],post=K4_post(s.prior/100,s.sens/100);let out=heading('Following commands with no visible response');
  out+=TB(34,58,st.name,14,C.ink,'start')+T(34,76,st.what,13,C.muted,'start');
  out+=K4_array(40,92,st.n,st.k,20,11.4,4.2,C.coral,'#cfdbe3');
  out+=TB(34,262,`${st.k} of ${st.n} (${K4_pct(st.k,st.n)})`,16,C.coral,'start')+K4_lines(34,282,['followed commands in the recording,','with none visible at the bedside.'],13,C.ink);
  out+=R(292,48,290,270,'#fff',C.grid,8)+TB(304,70,'Toy calculation: a negative test',13,C.purple,'start');
  out+=T(304,98,'Before the test',13,C.muted,'start')+K4_hbar(304,104,200,16,s.prior/100,C.blue,s.prior+'%');
  out+=T(304,146,'After a negative test',13,C.muted,'start')+K4_hbar(304,152,200,16,post,C.coral,Math.round(100*post)+'%');
  out+=K4_lines(304,196,[`If the test detects ${s.sens}% of aware`,`people, it misses ${100-s.sens}% of them.`,`A negative result moves ${s.prior}% to ${Math.round(100*post)}%.`],13,C.ink);
  out+=K4_lines(304,262,['Assumes no false positives. Published:','43 of 112 (38%) detected (Bodien 2024).'],13,C.muted);
  out+=T(300,354,`A negative test lowers the chance from ${s.prior}% to ${Math.round(100*post)}%, not to zero.`,15,C.ink);
  return {svg:out,phase:`${st.name}: ${st.k} of ${st.n} people tested (${K4_pct(st.k,st.n)}) showed covert command-following; ${st.what}. The toy calculation uses Bayes’ rule: ${s.prior}% × ${100-s.sens}% missed, divided by that plus the ${100-s.prior}% who are not aware, gives ${Math.round(100*post)}%. With a test that detects only ${s.sens}% of aware people, a negative result ${s.sens<60?'changes little':'tells you more, but still not everything'}. A person may fail the task because they are asleep, cannot hear, cannot understand language or cannot hold an image for 30 seconds. Nothing here is a prognosis or medical advice.`};
 }});

/* =========================== split-brain-unity =========================== */
function K4_shape(kind,x,y,r,col){return kind===0?Ci(x,y,r,col):kind===1?R(x-r,y-r,2*r,2*r,col,'none',2):`<polygon points="${fmt(x)},${fmt(y-r*1.1)} ${fmt(x+r*1.1)},${fmt(y+r*.9)} ${fmt(x-r*1.1)},${fmt(y+r*.9)}" fill="${col}"/>`}
const K4_SHAPE_N=['circle','square','triangle'];
// Classic picture: the left hemisphere (speech, right hand) sees the right visual field; the right hemisphere
// (left hand) sees the left visual field. Without access the simulated patient guesses among three shapes.
const K4_knows=(field,resp)=>(field==='R')===(resp!=='left');
function K4_sbTrial(seed,i,field,resp){const r=K4_rng(seed*71+i*13),shape=Math.floor(r()*3),knows=K4_knows(field,resp);return {field,resp,shape,knows,ok:r()<(knows?.95:1/3)}}
const K4_RESP=[['say','Speech'],['left','Left hand'],['right','Right hand']];
SCENE({id:'split-brain-unity',name:'Split brains and unity',tag:'The classic picture',
 definition:'In a split-brain operation the corpus callosum, the main bundle of fibres joining the two hemispheres, is cut to control severe epilepsy. In the classic experiments each hemisphere responded only to what it alone had been shown, which raised the question of whether consciousness itself had been divided.',
 example:'A shape is shown briefly to the left of where the patient is looking, so it reaches only the right hemisphere. Asked what they saw, the patient says “nothing”: speech is run by the left hemisphere. Yet the left hand, controlled by the right hemisphere, can pick the shape out by touch.',
 desc:'A view from above of a simulated patient facing a screen, with pathways from each half of the visual field to the opposite hemisphere and a cut between the hemispheres, beside a table of correct responses for each field and each way of responding.',
 research:['Gazzaniga, Bogen & Sperry (1962). Some functional effects of sectioning the cerebral commissures in man. PNAS 48, 1765–1769.','Sperry (1968). Hemisphere deconnection and unity in conscious awareness. American Psychologist 23, 723–733. (Nobel Prize 1981. The findings are robust in the patients studied; the conclusion that there are two separate minds is contested, as the next two scenes show.)'],
 dur:14,hint:'Choose the side of the screen and how the simulated patient answers, then show the shape. Fill all six cells of the table.',
 init:()=>({field:'L',resp:'say',log:[],seed:6}),
 watch(p){const combos=[['R','say'],['R','right'],['R','left'],['L','say'],['L','right'],['L','left']],k=Math.min(5,Math.floor(p*6)),log=[];combos.slice(0,k+1).forEach(([f,r],j)=>{for(let i=0;i<10;i++)log.push(K4_sbTrial(6,j*10+i,f,r))});return {field:combos[k][0],resp:combos[k][1],log,seed:6}},
 ui:[{choose:[['L','Left of fixation'],['R','Right of fixation']],label:'Shape shown',get:s=>s.field,act:'field'},{choose:K4_RESP,label:'Answer by',get:s=>s.resp,act:'resp'},{b:'Show the shape',act:'go'},{b:'Ten trials in every cell',act:'all'},{b:'Clear',act:'clear'}],
 on:{field(s,v){s.field=v==='R'?'R':'L';return 'keep'},resp(s,v){if(K4_RESP.some(r=>r[0]===v))s.resp=v;return 'keep'},
  go(s){s.log.push(K4_sbTrial(s.seed,s.log.length,s.field,s.resp));if(s.log.length>600)s.log.shift();return 'keep'},
  all(s){s.seed=nextSeed();for(const f of ['L','R'])for(const [r] of K4_RESP)for(let i=0;i<10;i++)s.log.push(K4_sbTrial(s.seed,s.log.length,f,r));while(s.log.length>600)s.log.shift();return 'keep'},clear(s){s.log=[];return 'keep'}},
 draw(s,f,X){
  const last=s.log[s.log.length-1],fl=s.field==='L',cur=last&&last.field===s.field&&last.resp===s.resp?last:null;
  let out=heading('What each hemisphere can report');
  out+=R(60,50,260,40,C.dark,'none',6)+Ci(190,70,4,'#fff')+K4_shape(cur?cur.shape:0,fl?120:260,70,10,'#f4d27a');
  out+=T(120,106,'left field',13,C.muted)+T(260,106,'right field',13,C.muted);
  out+=L(120,112,222,160,fl?C.coral:C.line,fl?3:1.6)+L(260,112,158,160,fl?C.line:C.coral,fl?1.6:3);
  out+=`<ellipse cx="190" cy="200" rx="74" ry="56" fill="#f4f8fa" stroke="${C.line}" stroke-width="2.5"/>`+R(186,142,8,116,'#fff','none',0)+P('M190 146 l-4 12 l8 12 l-8 12 l8 12 l-8 12 l8 12 l-8 12 l4 12',C.coral,2);
  out+=TB(152,196,'LEFT',13,fl?C.muted:C.coral)+TF(152,214,'speech',13,C.muted)+TB(228,196,'RIGHT',13,fl?C.coral:C.muted)+TF(228,214,'no speech',13,C.muted);
  out+=T(108,192,'callosum',13,C.coral,'end')+T(108,213,'cut',13,C.coral,'end');
  const act=s.resp;
  out+=L(214,250,92,300,act==='left'?C.blue:C.line,act==='left'?3:1.6)+L(166,250,288,300,act==='right'?C.blue:C.line,act==='right'?3:1.6);
  out+=Ci(80,312,13,act==='left'?C.pale:'#fff',act==='left'?C.blue:C.line)+T(80,342,'left hand',13,C.muted)+Ci(300,312,13,act==='right'?C.pale:'#fff',act==='right'?C.blue:C.line)+T(300,342,'right hand',13,C.muted);
  if(act==='say')out+=R(132,296,116,30,C.pale,C.blue,10)+TB(190,316,cur?(cur.knows?`“A ${K4_SHAPE_N[cur.shape]}.”`:'“Nothing.”'):'speech',13,C.ink);
  // Results table.
  out+=TB(356,66,'Correct · simulated patient',13,C.muted,'start')+T(356,84,'Answer by speech or hand:',13,C.muted,'start');
  K4_RESP.forEach(([id,lab],j)=>{out+=T(430+j*62,106,lab.replace(' hand',''),13,C.muted)});
  ['L','R'].forEach((fd,i)=>{const y=114+i*56;out+=T(356,y+20,fd==='L'?'Left':'Right',13,C.ink,'start')+T(356,y+41,'field',13,C.ink,'start');
   K4_RESP.forEach(([id],j)=>{const tr=s.log.filter(t=>t.field===fd&&t.resp===id),k=tr.filter(t=>t.ok).length,on=fd===s.field&&id===s.resp,hi=tr.length>=4&&k/tr.length>.7;
    out+=hit(X,'cell',fd+id,`${fd==='L'?'Left':'Right'} field, ${id}`,R(402+j*62,y,56,50,!tr.length?'#f6f9fb':hi?C.greenp:C.coralp,on?C.amber:'none',6)+TB(430+j*62,y+31,tr.length?`${k}/${tr.length}`:'–',14,C.ink))})});
  out+=K4_lines(356,246,['Without access the patient','guesses among three shapes,','so about 1 in 3 is right by chance.'],13,C.muted);
  out+=T(300,366,!cur?'Press Show the shape.':cur.knows?`The ${fl?'right':'left'} hemisphere saw it and controls this response.`:act==='say'?'The speaking hemisphere did not see the shape.':'This hand is run by the hemisphere that did not see it.',15,cur&&!cur.knows?C.coral:C.ink);
  return {svg:out,phase:!s.log.length?'Each half of the visual field projects to the opposite hemisphere. Normally the corpus callosum shares the information at once. With it cut, the left hemisphere, which speaks and moves the right hand, and the right hemisphere, which moves the left hand, each know only their own half.':`${cur?(cur.knows?`Shown a ${K4_SHAPE_N[cur.shape]} on the ${fl?'left':'right'}, the patient ${act==='say'?'names it':'picks it out with the '+act+' hand'}${cur.ok?'':' (a rare slip)'}. `:`Shown a ${K4_SHAPE_N[cur.shape]} on the ${fl?'left':'right'}, the patient ${act==='say'?'says “nothing”, and a forced guess is':'reaches with the '+act+' hand and the choice is'} ${cur.ok?'right by luck':'wrong'}. `):''}In the classic picture the table splits cleanly: right-field shapes can be named and picked by the right hand; left-field shapes only by the left hand. Sperry concluded that each hemisphere had its own awareness. Mind In Motion covers these experiments in more detail.`};
 }});
SCENES['split-brain-unity'].on.cell=function(s,a){s.field=String(a)[0]==='R'?'R':'L';const r=String(a).slice(1);if(K4_RESP.some(q=>q[0]===r))s.resp=r;return 'keep'};

// Pinto et al. (2017): presence and location reported well above chance everywhere, whatever the response;
// comparison across the midline at chance. Simulated to follow that pattern, not the published numbers.
const K4_PINTO={detect:['Was anything shown?',.92],locate:['Where was it?',.86],compare:['Same or different across the midline?',.5]};
function K4_pintoRun(seed,key,p){const r=K4_rng(seed*37+key.split('').reduce((a,c)=>a*31+c.charCodeAt(0)>>>0,7));let k=0;for(let i=0;i<20;i++)if(r()<p)k++;return k}
SCENE({id:'split-brain-unity-pinto',name:'Split perception, one agent?',tag:'A result that does not fit',
 definition:'In 2017 Yair Pinto and colleagues tested two split-brain patients and found that they could report whether and where a stimulus had appeared anywhere in the visual field, with either hand or in speech. What they could not do was compare stimuli across the midline. The authors’ summary: split perception, but undivided consciousness.',
 example:'A patient shown a small circle far to the left could say so aloud and could point to it with the right hand, both of which the classic picture rules out. Shown one shape on each side, the same patient could not say whether the two matched.',
 desc:'A grid with the visual field down the side and the way of responding across the top; pressing a cell runs twenty simulated trials and marks cells where the result disagrees with the classic picture.',
 research:['Pinto, Neville, Otten, Corballis, Lamme, de Haan, Foschi & Fabri (2017). Split brain: divided perception but undivided consciousness. Brain 140, 1231–1237.','Volz & Gazzaniga (2017). Interaction in isolation: 50 years of insights from split-brain research. Brain 140, 2051–2060. (Contested: two patients, tested many years after surgery; critics point to cross-cueing and to pathways below the cortex.)'],
 dur:14,hint:'Choose a task, then press each cell to run 20 trials. Amber cells are results the classic picture did not predict.',
 init:()=>({task:'detect',done:{},seed:8}),
 watch(p){const task=p<.4?'detect':p<.7?'locate':'compare',done={};for(const t of ['detect','locate','compare'])if(t===task||(t==='detect'&&p>=.4)||(t==='locate'&&p>=.7))for(const fd of (t==='compare'?['B']:['L','R']))K4_RESP.forEach(([id],j)=>{const q=t===task?(t==='detect'?p/.4:t==='locate'?(p-.4)/.3:(p-.7)/.3):1;if((fd==='R'?3:0)+j<q*7)done[t+fd+id]=1});return {task,done,seed:8}},
 ui:[{choose:[['detect','Was anything shown?'],['locate','Where was it?'],['compare','Same or different?']],label:'Task',get:s=>s.task,act:'task'},{b:'Run every cell',act:'all'},{b:'New patient',act:'fresh'}],
 on:{task(s,v){if(K4_PINTO[v])s.task=v;return 'keep'},cell(s,a){s.done[s.task+a]=1;return 'keep'},all(s){for(const fd of (s.task==='compare'?['B']:['L','R']))for(const [id] of K4_RESP)s.done[s.task+fd+id]=1;return 'keep'},fresh(s){s.seed=nextSeed();s.done={};return 'keep'}},
 draw(s,f,X){
  const [qn,p]=K4_PINTO[s.task],cmp=s.task==='compare',rows=cmp?[['B','One shape on each side']]:[['L','Shown in the left field'],['R','Shown in the right field']];
  let out=heading('Pinto-style trials on a simulated patient');
  out+=TB(40,62,`Task: ${qn}`,14,C.ink,'start')+T(560,62,'20 trials a cell',13,C.muted,'end');
  out+=T(40,92,'Answers by:',13,C.muted,'start');K4_RESP.forEach(([id,lab],j)=>{out+=TB(231+j*128,92,lab,13,C.muted)});
  let odd=0,ran=0;
  rows.forEach(([fd,lab],i)=>{const y=102+i*98;out+=K4_lines(40,y+34,lab.split(' in the ').length>1?[lab.split(' in the ')[0]+' in the',lab.split(' in the ')[1]]:['One shape on','each side'],13,C.ink,'start',18);
   K4_RESP.forEach(([id],j)=>{const key=s.task+fd+id,did=!!s.done[key],k=K4_pintoRun(s.seed,key,p),classic=!cmp&&K4_knows(fd,id),clash=did&&!classic&&k>=15;if(did)ran++;if(clash)odd++;
    out+=hit(X,'cell',fd+id,`${lab}, ${id}: run 20 trials`,R(170+j*128,y,122,86,!did?'#f6f9fb':clash?C.amberp:k>=15?C.greenp:'#eef3f6',clash?C.amber:C.grid,8)+(did?TB(231+j*128,y+34,`${k} of 20`,17,C.ink)+TF(231+j*128,y+54,k>=15?'well above chance':'near chance',13,k>=15?C.green:C.muted):TF(231+j*128,y+38,'press to run',13,C.muted))+TF(231+j*128,y+74,classic?'classic: can report':'classic: cannot',13,classic?C.muted:C.coral))})});
  out+=T(40,cmp?222:312,cmp?'Chance is 10 of 20. Simulated to follow the published pattern.':'Simulated to follow the published pattern, not its numbers.',13,C.muted,'start');
  if(cmp)out+=K4_lines(40,252,['Here the classic picture and the new data agree:','what is seen on one side cannot be compared','with what is seen on the other.'],13,C.ink);
  out+=T(300,356,!ran?'Press a cell to run its trials.':cmp?'Comparing across the midline stays near chance.':odd?`${odd} cell${odd>1?'s':''} the classic picture did not predict`:'So far the classic picture holds; try the other cells.',15,odd&&!cmp?C.amber:C.ink);
  return {svg:out,phase:cmp?'Neither hemisphere, and neither hand, can say whether a shape on the left matches a shape on the right. Visual information is still not shared across the cut. Whatever unifies the patient’s report of where things are, it does not let them put the two half-fields together.':`In the classic picture a stimulus in the left field can be reported only by the left hand, and one in the right field only by speech or the right hand. Pinto’s two patients reported presence and position accurately in every cell${odd?', including the amber ones':''}. This is contested. Volz and Gazzaniga argue that such patients, years after surgery, learn to pass hints between the hemispheres by small movements (cross-cueing), and that pathways below the cortex can carry crude information about position.`};
 }});

const K4_ACC={
 two:{name:'Two streams',full:'Two streams of awareness, one in each hemisphere (Sperry 1968)',h:[[true,'Predicted directly: the speaking hemisphere never saw the shape, and the other one did.'],[false,'Needs an extra assumption: cross-cueing between the hemispheres, some control of both arms by each hemisphere, or pathways below the cortex.'],[true,'Predicted directly: each stream has only its own half of the visual field.']]},
 one:{name:'One agent',full:'One conscious agent whose perception is split (Pinto et al. 2017)',h:[[false,'Needs an extra assumption: Pinto’s patients did not show this, so the classic result must depend on the patient, the task or the time since surgery.'],[true,'Predicted directly: one agent has access to both half-fields and to every way of responding.'],[true,'Accepted as the starting point: the two half-fields are perceived, but they are not joined into one scene.']]}};
const K4_FIND=[['Classic','A shape on the left: “I saw nothing”,','yet the left hand picks it out.'],['Pinto 2017','Presence and position reported anywhere,','by either hand or by speech.'],['Both','Shapes on opposite sides of the','midline cannot be compared.']];
SCENE({id:'split-brain-unity-accounts',name:'How many minds?',tag:'Two accounts, neither complete',
 definition:'The unity of consciousness is the fact that a person’s experiences at one time seem to belong together in a single field. Split-brain patients are the hardest test of it. One account says the operation leaves two streams of awareness; another says there is still one conscious agent whose perception is split.',
 example:'Thomas Nagel argued in 1971 that there may be no whole number of minds in a split-brain patient: in everyday life they act as one person, and in the laboratory as two. Later philosophers have defended two minds in one person (Schechter) and a single stream that switches between hemispheres (Bayne).',
 desc:'Three findings listed down the page; for the chosen account each finding can be pressed to show whether the account predicts it directly or needs an extra assumption, with a tally for each account.',
 research:['Nagel (1971). Brain bisection and the unity of consciousness. Synthese 22, 396–413.','Bayne (2008). The unity of consciousness and the split-brain syndrome. Journal of Philosophy 105, 277–300.','Schechter (2018). Self-Consciousness and “Split” Brains: The Minds’ I. Oxford University Press.','de Haan et al. (2020). Split-brain: what we know now and why this is important for understanding consciousness. Neuropsychology Review 30, 224–233. (Unresolved: few patients, and the two accounts explain different findings.)'],
 dur:12,hint:'Choose an account, then press each finding to see how the account deals with it. Compare the two tallies.',
 init:()=>({acc:'two',open:{}}),
 watch(p){const acc=p<.5?'two':'one',q=(p<.5?p:p-.5)/.5,open={};for(let i=0;i<3;i++){if(p>=.5)open['two'+i]=1;if(i<q*3.3)open[acc+i]=1}return {acc,open}},
 ui:[{choose:[['two','Two streams'],['one','One agent, split perception']],label:'Account',get:s=>s.acc,act:'acc'},{b:'Show all',act:'all'},{b:'Hide all',act:'clear'}],
 on:{acc(s,v){if(K4_ACC[v])s.acc=v;return 'keep'},open(s,a){s.open[s.acc+a]=1;s.last=Number(a);return 'keep'},all(s){for(const k in K4_ACC)for(let i=0;i<3;i++)s.open[k+i]=1;return 'keep'},clear(s){s.open={};return 'keep'}},
 draw(s,f,X){
  const A=K4_ACC[s.acc];let out=heading('One finding fits each account badly');
  out+=TB(40,58,A.full,13,C.purple,'start');
  K4_FIND.forEach(([src,l1,l2],i)=>{const y=70+i*76,op=!!s.open[s.acc+i],ok=A.h[i][0];
   out+=hit(X,'open',i,`Finding ${i+1}: ${l1} ${l2}`,R(34,y,532,66,!op?'#fff':ok?C.greenp:C.amberp,!op?C.grid:ok?C.green:C.amber,8)+TB(46,y+20,src,13,C.muted,'start')+TF(46,y+39,l1,13,C.ink,'start')+TF(46,y+56,l2,13,C.ink,'start')+(op?TB(556,y+26,ok?'predicted':'needs an extra',13,ok?C.green:C.amber,'end')+TB(556,y+48,ok?'directly':'assumption',13,ok?C.green:C.amber,'end'):T(556,y+38,'press to test',13,C.muted,'end')))});
  const tally=k=>{const n=[0,1,2].filter(i=>s.open[k+i]),d=n.filter(i=>K4_ACC[k].h[i][0]).length;return n.length?`${d} of ${n.length} direct`:'not tested'};
  out+=TB(40,316,'Two streams:',13,C.ink,'start')+T(160,316,tally('two'),13,C.muted,'start')+TB(320,316,'One agent:',13,C.ink,'start')+T(424,316,tally('one'),13,C.muted,'start');
  out+=T(300,356,'Each account handles two findings and strains at a third.',15,C.ink);
  const li=s.last!==undefined&&s.open[s.acc+s.last]?s.last:[0,1,2].filter(i=>s.open[s.acc+i]).pop();
  return {svg:out,phase:li===undefined?`${A.full}. Press a finding to see whether this account predicts it or has to add something.`:`${A.name}, finding ${li+1}. ${A.h[li][1]} Neither account is established: the evidence comes from a handful of patients, and the claim that a split brain holds two separate minds is as contested as the claim that it holds one.`};
 }});

/* =========================== psychedelics =========================== */
// Schematic ratings for the receptor-blocking design of Vollenweider et al. (1998). Heights show direction only.
const K4_PSY={'pla-none':5,'pla-ket':5,'pla-hal':5,'psi-none':78,'psi-ket':9,'psi-hal':74};
const K4_PRE=[['none','Nothing first'],['ket','Ketanserin first'],['hal','Haloperidol first']];
SCENE({id:'psychedelics',name:'Psychedelics',tag:'One receptor does most of the work',
 definition:'The classic psychedelics, including LSD, psilocybin and mescaline, alter perception, thought and the sense of self. Their effects depend mainly on one target: the serotonin 2A receptor. Block that receptor first and the effects of psilocybin largely fail to appear.',
 example:'Albert Hofmann first made LSD in 1938 and discovered its effects in April 1943. In 1998 Franz Vollenweider’s group gave volunteers psilocybin after ketanserin, which blocks serotonin 2A receptors: the changes in experience were prevented. After haloperidol, which blocks dopamine D2 receptors, the changes in perception remained.',
 desc:'A nerve-cell membrane with a serotonin 2A receptor and a dopamine D2 receptor, showing which is occupied by the drug and by the blocker chosen, beside bars for the sessions run so far.',
 research:['Hofmann (1980). LSD: My Problem Child. McGraw-Hill (his own account of 1943).','Vollenweider, Vollenweider-Scherpenhuyzen, Bäbler, Vogel & Hell (1998). Psilocybin induces schizophrenia-like psychosis in humans via a serotonin-2 agonist action. NeuroReport 9, 3897–3902. (The receptor finding is robust and has been repeated with LSD; the original study was small.)','Nichols (2016). Psychedelics. Pharmacological Reviews 68, 264–355.'],
 dur:12,hint:'Choose what is given first and what follows, then press Run session. Run all six combinations. This describes laboratory research, not advice of any kind.',
 init:()=>({drug:'psi',pre:'none',ran:['psi-none']}),
 watch(p){const all=['pla-none','psi-none','psi-ket','psi-hal'],k=Math.min(3,Math.floor(p*4)),[d,pr]=all[k].split('-');return {drug:d,pre:pr,ran:all.slice(0,k+1)}},
 ui:[{choose:K4_PRE,label:'Given first',get:s=>s.pre,act:'pre'},{choose:[['pla','Placebo'],['psi','Psilocybin']],label:'Then',get:s=>s.drug,act:'drug'},{b:'Run session',act:'run'},{b:'Clear',act:'clear'}],
 on:{pre(s,v){if(K4_PRE.some(q=>q[0]===v))s.pre=v;return 'keep'},drug(s,v){s.drug=v==='pla'?'pla':'psi';return 'keep'},run(s){const k=s.drug+'-'+s.pre;if(!s.ran.includes(k))s.ran.push(k);return 'keep'},clear(s){s.ran=[];return 'keep'}},
 draw(s){
  const psi=s.drug==='psi',ket=s.pre==='ket',hal=s.pre==='hal',active=psi&&!ket,key=s.drug+'-'+s.pre;let out=heading('Block one receptor and the effects do not appear');
  out+=T(40,62,'outside the nerve cell',13,C.muted,'start')+R(40,150,270,36,C.amberp,'none',4)+T(40,282,'inside the nerve cell',13,C.muted,'start');
  const rec=(x,col,name,sub)=>R(x-16,128,32,80,col,'none',8)+P(`M${x-16} 132 Q${x} 150 ${x+16} 132`,'#fff',3)+TB(x,92,name,13,col)+T(x,110,sub,13,C.muted);
  out+=rec(110,C.purple,'Serotonin 2A','receptor')+rec(240,C.green,'Dopamine D2','receptor');
  if(ket)out+=R(100,120,20,16,C.dark,'none',4)+TB(150,134,'blocked',13,C.dark,'start');
  if(psi)out+=Ci(ket?70:110,ket?106:128,8,C.coral,'#fff')+T(ket?44:92,ket?128:132,ket?'shut out':'binds',13,C.coral,ket?'start':'end');
  if(hal)out+=R(230,120,20,16,C.dark,'none',4)+TB(264,134,'blocked',13,C.dark,'start');
  if(active)out+=arrow(110,212,110,262,C.coral,4)+T(124,246,'signal into the cell',13,C.coral,'start');
  out+=T(175,308,'Schematic. In the body psilocybin',13,C.muted)+T(175,329,'becomes psilocin, which binds.',13,C.muted);
  const pl=K4_plot(372,70,206,170,[0,6],[0,100],{yt:[[0,'none'],[100,'strong']],yl:'effect (schematic)'});out+=pl.svg;
  Object.keys(K4_PSY).forEach((k,i)=>{const x=pl.X(i)+5,ran=s.ran.includes(k),v=K4_PSY[k],on=k===key;
   out+=ran?R(x,pl.Y(v),24,pl.Y(0)-pl.Y(v),k.startsWith('psi')?C.coral:'#9cbad0',on?C.amber:'none',3):R(x,pl.Y(0)-8,24,8,'#eef3f6',on?C.amber:'none',3);
   out+=T(x+12,256,k.endsWith('none')?'–':k.endsWith('ket')?'K':'H',13,C.muted)});
  out+=T(pl.X(1.5),274,'placebo',13,C.muted)+T(pl.X(4.5),274,'psilocybin',13,C.coral);
  out+=T(372,298,'First: – nothing, K ketanserin,',13,C.muted,'start')+T(372,316,'H haloperidol',13,C.muted,'start');
  out+=T(300,358,!s.ran.includes(key)?'Press Run session to see this combination.':!psi?'Placebo: little change, whatever came first.':ket?'Serotonin 2A blocked: the effects are prevented.':hal?'Dopamine D2 blocked: perception still changes.':'Psilocybin alone: perception changes strongly.',15,active&&s.ran.includes(key)?C.coral:C.ink);
  return {svg:out,phase:`${s.ran.length} of 6 combinations run. ${ket&&psi?'With the serotonin 2A receptor occupied by ketanserin, psilocin has nowhere to act and volunteers report little change. This is the main evidence that this one receptor is where the effects begin.':hal&&psi?'Blocking dopamine D2 receptors did not prevent the changes in perception, so those do not run through dopamine.':psi?'Psilocin activates serotonin 2A receptors, which are dense on large neurons of the cortex.':'Placebo sessions are the comparison. In practice volunteers can usually tell which session is which, a problem taken up two scenes on.'} Knowing the receptor does not explain why activating it changes experience in the way it does. Bar heights are schematic.`};
 }});

// Lempel–Ziv complexity (the LZ76 phrase count, Kaspar & Schuster 1987) of a binary sequence.
function K4_lz(b){const n=b.length;let i=0,c=1,l=1,k=1,kmax=1;if(n<2)return n;
 for(;;){if(b[i+k-1]===b[l+k-1]){k++;if(l+k>n){c++;break}}else{if(k>kmax)kmax=k;i++;if(i===l){c++;l+=kmax;if(l+1>n)break;i=0;k=1;kmax=1}else k=1}}
 return c}
// Toy signals: a slow rhythm of amplitude a plus irregular activity of amplitude 1−a (first-order autoregressive
// noise with coefficient rho). The state names label the published direction of the effect; the signals are not EEG.
const K4_DIV={sleep:{name:'Deep sleep',a:.8,rho:.6,col:C.blue,dir:'lower than waking (Schartner 2017)'},wake:{name:'Awake, resting',a:.4,rho:.6,col:C.green,dir:'the baseline'},psy:{name:'Psychedelic',a:.38,rho:.54,col:C.coral,dir:'a little higher than waking (Schartner 2017)'},noise:{name:'Random noise',a:0,rho:0,col:C.muted,dir:'the highest possible, with no mind at all'}};
const K4_DN=240;
function K4_sig(st,seed){const d=K4_DIV[st],r=K4_rng(seed*19+st.length*101+st.charCodeAt(0)),ph=r()*6.283,x=[];let e=0;for(let t=0;t<K4_DN;t++){e=d.rho*e+Math.sqrt(1-d.rho*d.rho)*K4_gauss(r);x.push(d.a*1.6*Math.sin(6.283*t/48+ph)+(1-d.a)*e)}return x}
function K4_score(st,seed){const x=K4_sig(st,seed),m=x.slice().sort((a,b)=>a-b)[K4_DN/2],b=x.map(v=>v>m?1:0);return {x,b,lz:K4_lz(b)*Math.log2(K4_DN)/K4_DN}}
const K4_DKEYS=['sleep','wake','psy','noise'];
SCENE({id:'psychedelics-diversity',name:'Signal diversity',tag:'A toy score, and what it does not mean',
 definition:'Signal diversity is how unpredictable a brain recording is, often scored by Lempel–Ziv complexity: the number of different patterns needed to describe the signal. It falls in deep sleep and under propofol, and was found to rise a little under psilocybin, LSD and ketamine. The entropic-brain hypothesis proposes that this richer, less ordered activity underlies the psychedelic state.',
 example:'Carhart-Harris and colleagues expected psilocybin to increase brain activity and found the opposite: reduced blood flow in hub regions, in 15 volunteers. In 2014 they proposed the entropic brain as a hypothesis. In 2017 Schartner and colleagues reported higher signal diversity than in normal waking for three drugs.',
 desc:'A toy signal for the chosen state with its binary version beneath, and a chart of Lempel–Ziv scores for samples from deep sleep, waking, a psychedelic state and random noise.',
 research:['Carhart-Harris et al. (2012). Neural correlates of the psychedelic state as determined by fMRI studies with psilocybin. PNAS 109, 2138–2143.','Carhart-Harris et al. (2014). The entropic brain: a theory of conscious states informed by neuroimaging research with psychedelic drugs. Frontiers in Human Neuroscience 8, 20. (A hypothesis; contested.)','Schartner, Carhart-Harris, Barrett, Seth & Muthukumaraswamy (2017). Increased spontaneous MEG signal diversity for psychoactive doses of ketamine, LSD and psilocybin. Scientific Reports 7, 46421. (Small samples; the increases are modest.)','Schartner et al. (2017). Global and local complexity of intracranial EEG decreases during NREM sleep. Neuroscience of Consciousness 2017, niw022.'],
 dur:14,hint:'Choose a state and press New sample to add its score to the chart, or add ten of each. Then look at where random noise falls.',
 init:()=>({st:'wake',seed:2,pts:{sleep:[],wake:[2],psy:[],noise:[]}}),
 watch(p){const n=Math.floor(p*11),pts={};K4_DKEYS.forEach((k,j)=>{pts[k]=range(clamp(n-j,0,8)).map(i=>100+i)});const st=K4_DKEYS[Math.min(3,Math.floor(p*4))];return {st,seed:pts[st].length?pts[st][pts[st].length-1]:100,pts}},
 ui:[{choose:K4_DKEYS.map(k=>[k,K4_DIV[k].name]),label:'State',get:s=>s.st,act:'st'},{b:'New sample',act:'one'},{b:'Ten of each',act:'ten'},{b:'Clear',act:'clear'}],
 on:{st(s,v){if(K4_DIV[v]){s.st=v;const a=s.pts[v];if(a.length)s.seed=a[a.length-1]}return 'keep'},one(s){s.seed=nextSeed()%100000;s.pts[s.st].push(s.seed);if(s.pts[s.st].length>40)s.pts[s.st].shift();return 'keep'},
  ten(s){for(const k of K4_DKEYS)for(let i=0;i<10;i++){s.pts[k].push(nextSeed()%100000);if(s.pts[k].length>40)s.pts[k].shift()}s.seed=s.pts[s.st][s.pts[s.st].length-1];return 'keep'},clear(s){for(const k of K4_DKEYS)s.pts[k]=[];return 'keep'}},
 draw(s,f,X){
  const d=K4_DIV[s.st],sc=K4_score(s.st,s.seed),x0=40,w=520;let out=heading('Toy model: how varied is the signal?');
  out+=TB(40,58,d.name+' · toy signal',13,d.col,'start')+TB(560,58,`Lempel–Ziv score ${sc.lz.toFixed(2)}`,13,C.ink,'end');
  out+=R(x0,64,w,62,'#fff',C.grid,4)+K4_poly(sc.x.map((v,i)=>[x0+i/(K4_DN-1)*w,95-clamp(v,-2.4,2.4)*11.5]),d.col,1.6);
  let strip='';for(let i=0;i<K4_DN;i++)if(sc.b[i])strip+=`M${fmt(x0+i*w/K4_DN)} 132h${fmt(w/K4_DN)}v10h-${fmt(w/K4_DN)}z`;out+=R(x0,132,w,10,'#eef3f6','none',0)+P(strip,'none',0,C.dark);
  out+=T(40,158,'Above or below its middle value: the sequence that is scored',13,C.muted,'start');
  const XS=v=>190+clamp(v,0,1.3)/1.3*370;
  [0,.5,1].forEach(v=>{out+=L(XS(v),170,XS(v),308,C.grid,1)+T(XS(v),324,v===0?'0':v===.5?'0.5':'1.0',13,C.muted)});out+=T(560,324,'score',13,C.muted,'end');
  K4_DKEYS.forEach((k,i)=>{const y=186+i*32,q=K4_DIV[k],vals=s.pts[k].map(sd=>K4_score(k,sd).lz),on=k===s.st;
   out+=hit(X,'st',k,q.name,R(34,y-14,532,28,on?C.amberp:'#fff',on?C.amber:'none',6)+TB(42,y+5,q.name,13,q.col,'start'));
   vals.forEach((v,j)=>{out+=Ci(XS(v),y+((j%3)-1)*5,4,q.col,'#fff','stroke-width="1" opacity=".85"')});
   if(vals.length>1){const m=sum(vals)/vals.length;out+=L(XS(m),y-12,XS(m),y+12,C.ink,2.5)}});
  const mean=k=>{const v=s.pts[k].map(sd=>K4_score(k,sd).lz);return v.length?sum(v)/v.length:null},mw=mean('wake'),mp=mean('psy'),mn=mean('noise');
  out+=T(300,358,s.st==='noise'?'Pure noise scores highest of all: diversity is not awareness.':`Published direction for this state: ${d.dir}`,15,s.st==='noise'?C.coral:C.ink);
  return {svg:out,phase:`This sample scores ${sc.lz.toFixed(2)}. The score counts the new patterns met while reading the black-and-white sequence from left to right, scaled so that a random sequence scores about 1. ${mw!==null&&mp!==null?`Your means so far: waking ${mw.toFixed(2)}, psychedelic ${mp.toFixed(2)}${mn!==null?`, noise ${mn.toFixed(2)}`:''}. The two overlap, as the published data do: the difference appears in group averages. `:''}The toy shows the published direction only. Two cautions: random noise beats every brain state, so a higher score cannot mean “more conscious” or a “higher” state; and the entropic-brain idea is a hypothesis that later results fit only in part.`};
 }});

// Toy trial: a true drug effect of 0.3 standard deviations, and an expectancy effect of 0.6 for believing you
// received the drug. Both numbers are invented to show the logic. If a share g of each arm guesses its own arm
// correctly, the arms differ in belief by 2g − 1, so the apparent effect is 0.3 + 0.6 × (2g − 1).
const K4_TRUE=.3,K4_EXPECT=.6;
const K4_apparent=g=>K4_TRUE+K4_EXPECT*(2*g-1);
const K4_ci=n=>1.96*Math.sqrt(2/n);
SCENE({id:'psychedelics-evidence',name:'Limits of the evidence',tag:'Small samples and broken blinding',
 definition:'A trial is blind when participants cannot tell whether they received the drug or the placebo. With psychedelics nearly everyone can tell, so their expectations may shape the results. Add small samples and volunteers who chose to take part, and many findings are less certain than they sound.',
 example:'A volunteer who feels the walls breathing knows they did not get the placebo. If they also hoped the drug would help, their later ratings may rise for that reason alone. Many imaging studies of the psychedelic state have had 15 to 20 participants, most with previous experience of the drugs.',
 desc:'A toy trial: an axis of effect size showing the true effect, the apparent effect and its 95% interval, which change with the number of participants per group and the share who correctly guess which group they are in.',
 research:['Muthukumaraswamy, Forsyth & Lumley (2021). Blinding and expectancy confounds in psychedelic randomized controlled trials. Expert Review of Clinical Pharmacology 14, 1133–1152.','Button et al. (2013). Power failure: why small sample size undermines the reliability of neuroscience. Nature Reviews Neuroscience 14, 365–376.','Carhart-Harris et al. (2012). PNAS 109, 2138–2143 (15 volunteers per imaging study, all with previous experience of psychedelics).'],
 dur:12,hint:'Move the two sliders. Watch how the apparent effect drifts from the true one as blinding fails, and how the interval narrows with more people.',
 init:()=>({n:15,g:90}),
 watch(p){return p<.5?{n:15,g:Math.round(50+90*p)}:{n:Math.round(15+(p-.5)/.5*185),g:95}},
 ui:[{range:'g',label:'Correctly guess their own group',min:50,max:100,step:5,get:s=>s.g,act:'g',show:v=>v+'%'},{range:'n',label:'Participants per group',min:10,max:200,step:5,get:s=>s.n,act:'n',show:v=>v+''}],
 on:{g(s,v){s.g=Number(v);return 'keep'},n(s,v){s.n=Number(v);return 'keep'}},
 draw(s){
  const g=s.g/100,app=K4_apparent(g),ci=K4_ci(s.n),XE=v=>80+(clamp(v,-.6,1.8)+.6)/2.4*460;let out=heading('Toy trial: what broken blinding and small samples do');
  out+=R(40,56,520,170,'#fff',C.grid,6);
  [-.5,0,.5,1,1.5].forEach(v=>{out+=L(XE(v),64,XE(v),204,v===0?C.line:C.grid,v===0?2:1)+T(XE(v),220,v===0?'0':(v>0?'+':'−')+Math.abs(v),13,C.muted)});
  out+=T(300,244,'effect of the drug, in standard deviations (toy numbers)',13,C.muted);
  out+=L(XE(K4_TRUE),70,XE(K4_TRUE),168,C.green,2.5,'stroke-dasharray="6 5"')+TB(XE(K4_TRUE),82,'true 0.3',13,C.green,'end','dx="-6"');
  out+=L(XE(app-ci),140,XE(app+ci),140,C.coral,5)+L(XE(app-ci),130,XE(app-ci),150,C.coral,2.5)+L(XE(app+ci),130,XE(app+ci),150,C.coral,2.5)+Ci(XE(app),140,8,C.coral,'#fff');
  out+=TB(XE(app),122,`measured ${app.toFixed(2)}`,13,C.coral,app>1.1?'end':'start','dx="'+(app>1.1?-10:10)+'"');
  out+=T(XE(app),192,`95% interval ${(app-ci).toFixed(2)} to ${(app+ci).toFixed(2)}`,13,C.muted,app>.9?'end':app<.1?'start':'middle');
  out+=counter(40,262,'belief gap between groups',Math.round(100*(2*g-1))+' points',C.ink,168)+counter(216,262,'added by expectation','+'+(K4_EXPECT*(2*g-1)).toFixed(2),C.coral,168)+counter(392,262,'interval half-width','±'+ci.toFixed(2),C.ink,168);
  out+=T(40,330,'Toy model: both effect sizes (0.3, 0.6) are invented.',13,C.purple,'start');
  out+=T(300,360,app-ci>0?(g>.6?'“Significant”, but part of the effect is expectation.':'The interval excludes zero and sits on the true effect.'):'The interval includes zero: too few people to tell.',15,C.ink);
  return {svg:out,phase:`With ${s.g}% of each group guessing correctly, the groups differ in belief by ${Math.round(100*(2*g-1))} points, and expectation adds ${(K4_EXPECT*(2*g-1)).toFixed(2)} to a true effect of 0.30: the trial measures ${app.toFixed(2)}. With ${s.n} people per group the 95% interval is ±${ci.toFixed(2)}. More participants narrow the interval, but they do not remove the bias: a large unblinded trial is precisely wrong. Real psychedelic studies also draw on volunteers who chose to take part, often with earlier experience of the drugs. None of this shows that the reported effects are unreal; it shows why they are hard to pin down.`};
 }});
