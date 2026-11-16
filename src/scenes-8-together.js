/* ===================== Senses era 8 · Senses together ===================== */
// Combining the senses, owning a rubber hand, synaesthesia, sensory substitution, ageing and gentle touch.
// Pictures are pure functions of state, frame and X. Experiments time with ctx.later/ctx.every in on()
// handlers, trial orders use seeded shuffles, and sound plays only from on() handlers. Flashes are single or
// paired per key press (never sustained flicker), discs are small and of moderate contrast, tones are quiet.
const S8_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const S8_rng=n=>rng(S8_mix(n));
const S8_norm=(x,m,s)=>Math.exp(-.5*((x-m)/s)**2)/(s*Math.sqrt(2*Math.PI));
const S8_poly=(pts,col,w=2.2,extra='')=>pts.length>1?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function S8_plot(x0,y0,w,h,xr,yr,o={}){
 const lg=!!o.log,tx=v=>lg?Math.log10(v):v,X=v=>x0+(tx(v)-tx(xr[0]))/(tx(xr[1])-tx(xr[0]))*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
const S8_pill=(x,y,label,fill,ink=C.ink,w)=>{const ww=w||label.length*7.2+18;return R(x,y-14,ww,20,fill,'none',10)+TBF(x+ww/2,y+1,label,13,ink)};
// Status tag in the top-right corner: robust, mixed, contested or illustrative.
const S8_TAGS={robust:['robust',C.greenp,C.green],mixed:['mixed evidence',C.amberp,C.amber],contested:['contested',C.coralp,C.coral],model:['model',C.purplep,C.purple]};
const S8_tag=k=>{const t=S8_TAGS[k];return S8_pill(590-(t[0].length*7.2+18),56,t[0],t[1],t[2])};
const S8_wrap=(x,y,text,size,col,maxCh,lh=18,anchor='start')=>{const words=text.split(' '),lines=[];let cur='';for(const w of words){if((cur+' '+w).trim().length>maxCh){lines.push(cur);cur=w}else cur=(cur+' '+w).trim()}if(cur)lines.push(cur);return lines.map((l,i)=>TF(x,y+i*lh,l,size,col,anchor)).join('')};

/* =========================== multisensory-integration =========================== */
// Ernst & Banks (2002): vision and touch judge the height of a bar; each weighted by its reliability.
function S8_combine(sv,sh,conf){const mv=55+conf/2,mh=55-conf/2,wv=(1/sv**2)/(1/sv**2+1/sh**2);return {mv,mh,wv,m:wv*mv+(1-wv)*mh,s:Math.sqrt(1/(1/sv**2+1/sh**2))}}
SCENE({id:'multisensory-integration',name:'Two senses, one estimate',tag:'Weighting by reliability',
 definition:'When two senses report the same property, the brain can combine them, giving each a weight in proportion to its reliability (one over its variance). The combined estimate is closer to the more reliable sense and more precise than either alone.',
 example:'Looking at and feeling a ridge of 55 mm, people rely mostly on vision. Blur the visual image and their judgements shift towards what their hand feels, almost exactly as the optimal weighting predicts.',
 desc:'Three bell curves for the height of a bar: one from vision, one from touch, and the combined estimate between them, with bars showing how much each sense counts.',
 research:'Ernst, M. O. & Banks, M. S. (2002). Humans integrate visual and haptic information in a statistically optimal fashion. Nature 415, 429–433 (robust; widely replicated, with exceptions reviewed by Rahnev & Denison 2018). Link: Mind In Motion covers the Bayesian theory.',
 dur:10,hint:'Make vision noisier with the first slider and watch the combined estimate slide towards touch. The conflict slider makes the two senses disagree on purpose, as in the experiment.',
 init:()=>({sv:1,sh:2,conf:4}),
 watch(p){return {sv:+(.6+3.4*smooth(p)).toFixed(2),sh:2,conf:4}},
 ui:[{range:'sv',label:'Vision noise (mm)',min:.5,max:4,step:.25,get:s=>s.sv,act:'sv'},{range:'sh',label:'Touch noise (mm)',min:.5,max:4,step:.25,get:s=>s.sh,act:'sh'},{range:'conf',label:'Conflict (mm)',min:0,max:8,step:1,get:s=>s.conf,act:'conf'}],
 on:{sv(s,v){s.sv=Number(v)},sh(s,v){s.sh=Number(v)},conf(s,v){s.conf=Number(v)}},
 draw(s){
  const c=S8_combine(s.sv,s.sh,s.conf);let out=heading('How tall is the bar? Ask both senses',26)+S8_tag('robust');
  const pl=S8_plot(50,70,350,210,[44,66],[0,1.05],{xt:[[45,'45'],[50,'50'],[55,'55'],[60,'60'],[65,'65']],xl:'perceived height (mm)'});out+=pl.svg;
  const pk=S8_norm(0,0,c.s),curve=(m,sd,col,w,extra)=>{const pts=[];for(let x=44;x<=66;x+=.2)pts.push([pl.X(x),pl.Y(S8_norm(x,m,sd)/pk)]);return S8_poly(pts,col,w,extra)};
  out+=curve(c.mv,s.sv,C.blue,2.4)+curve(c.mh,s.sh,C.amber,2.4)+curve(c.m,c.s,C.ink,3.2);
  out+=L(pl.X(c.m),pl.Y(0),pl.X(c.m),pl.Y(1),C.ink,1.2,'stroke-dasharray="4 4"');
  out+=TF(420,92,'vision',14,C.blue,'start')+TF(420,112,'touch',14,C.amber,'start')+TBF(420,132,'combined',14,C.ink,'start');
  out+=L(404,88,414,88,C.blue,3)+L(404,108,414,108,C.amber,3)+L(404,128,414,128,C.ink,3);
  const bw=150,by=180;out+=TF(420,by-12,'weight given to each sense',13,C.muted,'start');
  out+=R(420,by,bw,20,'#fff',C.grid,4)+R(420,by,bw*c.wv,20,C.blue,'none',4)+R(420+bw*c.wv,by,bw*(1-c.wv),20,C.amber,'none',4);
  out+=TF(420,by+38,`vision ${Math.round(c.wv*100)}% · touch ${Math.round((1-c.wv)*100)}%`,13,C.ink,'start');
  out+=TF(420,by+60,`combined: ${c.m.toFixed(1)} mm`,13,C.ink,'start')+TF(420,by+80,`spread ±${c.s.toFixed(2)} mm`,13,C.ink,'start');
  out+=TF(225,340,`Vision says ${c.mv.toFixed(0)} mm, touch says ${c.mh.toFixed(0)} mm.`,14,C.muted);
  return {svg:out,phase:c.wv>.7?'Vision is far more reliable here, so the combined estimate sits close to what you see. Its spread is narrower than either sense alone.':c.wv<.3?'Blurred vision now counts for little: the estimate has moved towards what the hand feels, as Ernst and Banks found.':'The two senses are similarly reliable, so the estimate falls between them, and is more precise than either.'};
 }});

// Alais & Burr (2004): the ventriloquist effect, and its reversal when the image is badly blurred.
const S8_BLUR=[['1','sharp'],['8','blurred'],['20','very blurred'],['32','extreme']],S8_AUD=8;
SCENE({id:'multisensory-integration-ventriloquism',name:'The ventriloquist',tag:'Where is the sound?',
 definition:'In the ventriloquist effect a sound seems to come from a moving mouth or a flash rather than from its real source, because vision usually locates things more precisely than hearing.',
 example:'A voice from a speaker beside a cinema screen seems to come from the actor’s lips. Alais and Burr showed the effect reverses when the visual blob is blurred enough: then the sound captures the light.',
 desc:'A screen with a sharp or blurred spot and a hidden speaker, a listener, and an arrow to where the event seems to be, plus bars for how much each sense counts.',
 research:'Alais, D. & Burr, D. (2004). The ventriloquist effect results from near-optimal bimodal integration. Current Biology 14, 257–262 (robust). Howard & Templeton (1966) named the effect. Sound and blur widths here are illustrative, in degrees.',
 dur:10,hint:'Move the sound away from the spot, then blur the spot. With a sharp spot the sound is pulled to it; with a very blurred one the sound wins.',
 init:()=>({blur:'1',off:12}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {blur:S8_BLUR[k][0],off:12}},
 ui:[{choose:S8_BLUR,label:'Spot',get:s=>s.blur,act:'blur'},{range:'off',label:'Sound offset (°)',min:-20,max:20,step:1,get:s=>s.off,act:'off'}],
 on:{blur(s,v){s.blur=v},off(s,v){s.off=Number(v)}},
 draw(s){
  const sv=Number(s.blur),wv=(1/sv**2)/(1/sv**2+1/S8_AUD**2),perc=(1-wv)*s.off;let out=heading('Where did the event happen?',26)+S8_tag('robust');
  const deg=d=>300+d*9,sy=105;
  out+=R(70,70,460,80,'#f6f9fb',C.line,6);
  for(let d=-24;d<=24;d+=8)out+=L(deg(d),150,deg(d),156,C.line,1)+TF(deg(d),172,(d>0?'+':'')+d+'°',13,C.muted);
  const g=`<defs><radialGradient id="s8blob"><stop offset="0" stop-color="${C.blue}" stop-opacity=".95"/><stop offset="1" stop-color="${C.blue}" stop-opacity="0"/></radialGradient></defs>`;
  const r=Math.min(80,8+sv*2.2);out+=g+`<circle cx="${deg(0)}" cy="${sy-8}" r="${r}" fill="url(#s8blob)" opacity="${fmt(Math.max(.3,1-sv/50))}"/>`;
  const sx=deg(s.off);out+=R(sx-8,128,14,16,C.amber,'none',3)+P(`M${sx+6} ${131}L${sx+12} ${126}V${146}L${sx+6} ${141}Z`,C.amber,1.2,C.amber);
  out+=P(`M${deg(perc)} 152l-7 12h14z`,C.coral,1.5,C.coral);
  out+=Ci(300,300,22,'#fff',C.ink)+TF(300,345,'listener',13,C.muted);
  out+=arrow(300,278,300+(deg(perc)-300)*.55,192,C.ink,2.4);
  out+=TF(50,226,'blue: the light',13,C.blue,'start')+TF(50,246,'amber: hidden speaker',13,C.amber,'start')+TF(50,266,'coral: where it seems',13,C.coral,'start');
  out+=TBF(50,300,`heard at ${perc>=0?'+':''}${perc.toFixed(1)}°`,14,C.ink,'start');
  out+=TF(560,215,'weight',13,C.muted,'end')+R(440,224,120,16,'#fff',C.grid,3)+R(440,224,120*wv,16,C.blue,'none',3)+R(440+120*wv,224,120*(1-wv),16,C.amber,'none',3);
  out+=TF(560,258,`vision ${Math.round(wv*100)}% · hearing ${Math.round((1-wv)*100)}%`,13,C.ink,'end');
  return {svg:out,phase:wv>.8?'The sharp spot is located far more precisely than the sound, so the sound is captured by it: the ventriloquist effect.':wv<.2?'With an extremely blurred spot, hearing is the better locator and now pulls the light towards the sound. The effect has reversed, as predicted.':'With some blur the two senses share the work, and the event seems to be between them.'};
 }});

// Shams, Kamitani & Shimojo (2000): one flash with two beeps is often seen as two flashes.
const S8_FC=[[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]],S8_FREP=2,S8_FN=S8_FC.length*S8_FREP;
// Approximate mean reports, after Shams et al. (2000, 2002) for fission and Andersen et al. (2004) for fusion.
const S8_FPUB={'1,0':1.05,'1,1':1.1,'1,2':1.7,'2,0':1.9,'2,1':1.6,'2,2':2};
const S8_fTrial=(seed,i)=>shuffled(range(S8_FN).map(k=>S8_FC[k%S8_FC.length]),S8_mix(seed+5))[i];
SCENE({id:'multisensory-integration-flash',name:'Hearing extra flashes',tag:'The double-flash illusion',
 definition:'In the sound-induced flash illusion, one brief flash paired with two quick beeps is often seen as two flashes. Hearing is better than vision at timing, so for counting rapid events the ear can override the eye.',
 example:'Shams and colleagues flashed a disc once while playing two beeps 57 ms apart; observers often reported two flashes. The reverse happens too: two flashes with one beep can look like one.',
 desc:'A small disc that flashes once or twice per press while zero, one or two beeps play, buttons to report how many flashes you saw, and a chart of your average reports beside the published pattern.',
 research:'Shams, L., Kamitani, Y. & Shimojo, S. (2000). What you see is what you hear. Nature 408, 788; (2002) Cognitive Brain Research 14, 147–152; Andersen, Tiippana & Sams (2004), Cognitive Brain Research 21, 301–308 (robust, individual differences large). Published values here are approximate.',
 dur:12,hint:'Sound on, headphones optional. Press Flash, watch the dot, then say how many flashes you saw. Twelve trials. At most two brief flashes per press, never a flicker. Browser timing is approximate; nothing leaves this page.',
 init:()=>({seed:3,i:0,ph:'idle',res:[]}),
 watch(p){const n=Math.min(S8_FN,Math.floor(p*(S8_FN+1))),r=S8_rng(17),res=[];for(let i=0;i<n;i++){const t=S8_fTrial(3,i),m=S8_FPUB[t.join(',')];res.push({c:t.join(','),n:r()<m-Math.floor(m)?Math.ceil(m):Math.floor(m)})}return {seed:3,i:Math.min(n,S8_FN-1),ph:['flash','gap','ask'][Math.floor(p*45)%3],res,sim:true}},
 ui:[{b:'Flash',act:'go'},{b:'New order',act:'again'}],
 on:{go(s,a,ctx){if(s.i>=S8_FN||(s.ph!=='idle'&&s.ph!=='ask'))return;const [f,b]=S8_fTrial(s.seed,s.i);
   if(b)AUDIO.seq(range(b).map(k=>({hz:3500,at:k*.057,dur:.012})),{type:'sine',gain:.12,attack:.002,release:.01});
   s.ph='flash';ctx.later(33,'ph','gap');if(f===2){ctx.later(90,'ph','flash');ctx.later(123,'ph','gap')}ctx.later(450,'ph','ask')},
  ph(s,v){s.ph=v},ans(s,v){if(s.ph!=='ask'||s.i>=S8_FN)return;const t=S8_fTrial(s.seed,s.i);s.res.push({c:t.join(','),n:Number(v)});s.i++;s.ph='idle'},
  again(s){s.seed=nextSeed();s.i=0;s.res=[];s.ph='idle'}},
 draw(s,f,X){
  let out=heading('How many flashes did you see?',26)+S8_tag('robust');const cx=140,cy=150;
  out+=R(40,70,200,160,'#eef3f6',C.line,6)+Ci(cx,cy+48,3,C.muted);
  if(s.ph==='flash')out+=Ci(cx,cy-10,22,C.blue);
  out+=TF(cx,248,s.i>=S8_FN?'all trials done':s.ph==='ask'?'how many flashes?':'look just above the small dot',13,C.muted);
  if(s.ph==='ask'&&!s.sim)[1,2,3].forEach((n,k)=>{const x=60+k*58;out+=hit(X,'ans',n,n+' flash'+(n>1?'es':''),R(x,262,48,34,'#fff',C.blue,6)+TBF(x+24,285,String(n),16,C.blue))});
  out+=TF(140,330,`trial ${Math.min(s.i+1,S8_FN)} of ${S8_FN}`,13,C.muted);
  const pl=S8_plot(320,80,250,200,[0,2.5],[.5,2.5],{yt:[[1,'1'],[1.5,'1.5'],[2,'2']],yl:'flashes reported (mean)'});out+=pl.svg;
  const groups=[[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]];
  [['1 flash',.6],['2 flashes',1.9]].forEach(([l,x])=>out+=TF(pl.X(x),pl.Y(.5)+36,l,13,C.muted));
  groups.forEach(([b,fl],k)=>{const x=pl.X(fl===1?.2+b*.4:1.5+b*.4),key=fl+','+b,pub=S8_FPUB[key],mine=s.res.filter(r=>r.c===key);
   out+=R(x-12,pl.Y(pub),24,pl.Y(.5)-pl.Y(pub),C.grid,'none',2)+TF(x,pl.Y(.5)+18,b+'♪',13,C.muted);
   if(mine.length){const m=mine.reduce((a,r)=>a+r.n,0)/mine.length;out+=Ci(x,pl.Y(Math.min(2.5,m)),6,C.coral,'#fff')}});
  out+=TF(445,340,`grey: approximate published · dots: ${s.sim?'simulated':'your'} means`,13,C.muted);
  return {svg:out,phase:'Below each group, ♪ counts the beeps. One flash with two beeps is the classic illusion: reports rise towards two. Two flashes with one beep often fuse into one.'};
 }});

/* =========================== rubber-hand =========================== */
// Botvinick & Cohen (1998): synchronous stroking makes a rubber hand feel like one's own.
const S8_own=(sync,t)=>sync?-1+2.6*(1-Math.exp(-t/25)):-1+.4*(1-Math.exp(-t/25));
const S8_drift=(sync,t)=>sync?1.8*(1-Math.exp(-t/40)):.5*(1-Math.exp(-t/40));
function S8_hand(x,y,col,fill){return P(`M${x} ${y}h60q12 0 12 10v10q0 10-12 10h-60z`,col,2,fill)+[0,1,2,3].map(k=>P(`M${x+72} ${y+3+k*7}h20`,col,6,'none','stroke-linecap="round"')).join('')}
SCENE({id:'rubber-hand',name:'The rubber hand illusion',tag:'Owning a fake hand',
 definition:'In the rubber hand illusion your real hand is hidden while a rubber hand in front of you is stroked in time with it. After a minute or so many people feel the touch on the rubber hand and feel it is theirs.',
 example:'Botvinick and Cohen stroked a hidden real hand and a visible rubber one with two paintbrushes. When the strokes were synchronous, people reported feeling the brush on the rubber hand; out of step, the feeling was much weaker.',
 desc:'A table with the real hand hidden behind a screen and a rubber hand in view, two brushes stroking in or out of step, and bars for ownership ratings and proprioceptive drift.',
 research:'Botvinick, M. & Cohen, J. (1998). Rubber hands ‘feel’ touch that eyes see. Nature 391, 756; Tsakiris & Haggard (2005), JEP:HPP 31, 80–91 (synchronous greater than asynchronous: robust). Rating and drift values here are illustrative, near typical reports.',
 dur:12,hint:'Choose in step or out of step and move the time slider. Watch the ownership rating and how far your felt hand position drifts towards the rubber hand. See the next scenes for the limits.',
 init:()=>({sync:'1',t:60}),
 watch(p){return {sync:p<.5?'1':'0',t:Math.round(((p*2)%1)*120)}},
 ui:[{choose:[['1','In step'],['0','Out of step']],label:'Stroking',get:s=>s.sync,act:'sync'},{range:'t',label:'Seconds stroked',min:0,max:120,step:5,get:s=>s.t,act:'t'}],
 on:{sync(s,v){s.sync=v},t(s,v){s.t=Number(v)}},
 draw(s){
  const sync=s.sync==='1',own=S8_own(sync,s.t),dr=S8_drift(sync,s.t);let out=heading('A brush on a hand you cannot see',26)+S8_tag('robust');
  out+=R(40,80,320,170,'#f7f1e8',C.line,8)+L(190,70,190,260,C.ink,5)+TF(115,272,'real hand (hidden)',13,C.muted)+TF(270,272,'rubber hand',13,C.muted);
  out+=S8_hand(70,150,C.line,'#e9d8c4')+S8_hand(220,150,C.coral,'#f5c9b6');
  const ph=t=>(t%1.5)/1.5,y1=ph(s.t),y2=ph(s.t+(sync?0:.75));
  out+=L(100+y1*30,128,108+y1*30,148,C.purple,4)+L(250+y2*30,128,258+y2*30,148,C.purple,4);
  out+=TF(200,310,`${sync?'in step':'out of step'} · ${s.t} s of stroking`,14,C.ink);
  const pl=S8_plot(410,90,160,150,[0,2],[-3,3],{yt:[[-3,'−3'],[0,'0'],[3,'+3']],yl:'“it felt like my hand”'});out+=pl.svg;
  out+=L(410,pl.Y(0),570,pl.Y(0),C.line,1);
  const bar=(x,v,col)=>R(x,Math.min(pl.Y(v),pl.Y(0)),40,Math.abs(pl.Y(v)-pl.Y(0)),col,'none',3);
  out+=bar(440,own,C.coral)+TF(460,pl.Y(-3)+18,'rating',13,C.muted);
  out+=TF(490,280,`drift towards rubber hand: ${dr.toFixed(1)} cm`,13,C.ink,'middle')+R(430,290,120,12,'#fff',C.grid,3)+R(430,290,120*dr/2.5,12,C.purple,'none',3);
  return {svg:out,phase:sync&&s.t>30?'In step, most people begin to feel the touch on the rubber hand within about a minute, and point to their own hand as if it had moved towards it.':!sync?'Out of step, sight and touch disagree in time, so the brain does not bind them: ratings stay low and drift is small.':'The illusion takes time to build: early on, little has changed.'};
 }});

// Shimada et al. (2009): the illusion weakens when the seen stroke lags the felt one by more than ~300 ms.
const S8_lag=d=>1.6/(1+Math.exp((d-330)/70))-.9;
SCENE({id:'rubber-hand-delay',name:'How much delay breaks it?',tag:'A window for binding',
 definition:'Sight and touch are bound into one event only if they arrive close enough in time. Delaying the seen stroke shows how wide that window is.',
 example:'Shimada and colleagues delayed video of the brush on the hand. Up to about 300 ms the illusion held; with longer delays it faded.',
 desc:'Two timelines of touches, felt and seen, with an adjustable delay between them, and a curve of illusion strength against delay.',
 research:'Shimada, S., Fukuda, K. & Hiraki, K. (2009). Rubber hand illusion under delayed visual feedback. PLoS ONE 4(7), e6185. The curve is an illustrative fit to their reported pattern (strong up to about 300 ms).',
 dur:10,hint:'Drag the delay. Below about a third of a second the brain still treats the two strokes as one event.',
 init:()=>({d:200}),
 watch(p){return {d:Math.round(p*1000/10)*10}},
 ui:[{range:'d',label:'Visual delay (ms)',min:0,max:1000,step:10,get:s=>s.d,act:'d'}],
 on:{d(s,v){s.d=Number(v)}},
 draw(s){
  let out=heading('Seen strokes arriving late',26)+S8_tag('model');const x0=60,w=480,ms=v=>x0+v/2000*w;
  out+=TF(x0,88,'felt',13,C.purple,'start')+TF(x0,128,'seen',13,C.coral,'start');
  for(let t=0;t<=1800;t+=600){out+=R(ms(t)+40,95,8,16,C.purple,'none',2)+R(ms(t+s.d)+40,135,8,16,C.coral,'none',2)}
  out+=L(x0+40,160,x0+40+w,160,C.line,1)+TF(x0+40,178,'0 s',13,C.muted,'start')+TF(x0+40+w,178,'2 s',13,C.muted,'end');
  const pl=S8_plot(100,210,420,110,[0,1000],[-1,1],{xt:[[0,'0'],[300,'300'],[600,'600'],[1000,'1000 ms']],yt:[[-1,'none'],[1,'strong']]});out+=pl.svg;
  const pts=[];for(let d=0;d<=1000;d+=10)pts.push([pl.X(d),pl.Y(S8_lag(d))]);out+=S8_poly(pts,C.coral,2.6);
  out+=Ci(pl.X(s.d),pl.Y(S8_lag(s.d)),7,C.ink,'#fff');
  return {svg:out,phase:s.d<=300?'Within about 300 ms, sight and touch are still bound together, and the illusion survives.':'Past about a third of a second, the strokes no longer feel like one event and the illusion fades.'};
 }});

const S8_RH=[
 {t:'Synchrony matters',k:'robust',b:'Across many labs, stroking in step produces stronger ownership reports than out of step (Botvinick & Cohen 1998; Tsakiris & Haggard 2005).'},
 {t:'Drift is a separate thing',k:'mixed',b:'Felt hand position can drift even when people deny ownership, so drift is not a pure measure of the illusion (Rohde, Di Luca & Ernst 2011).'},
 {t:'Suggestion and expectation',k:'contested',b:'Ownership ratings track how suggestible people are, and participants can guess what is expected (Lush et al. 2020).'},
 {t:'Brain activity',k:'robust',b:'Premotor and parietal areas respond in step with reported ownership (Ehrsson, Spence & Passingham 2004).'},
 {t:'Whole-body illusions',k:'mixed',b:'Similar tricks with video headsets make people feel located in a virtual body (Lenggenhager et al. 2007; Ehrsson 2007).'}];
SCENE({id:'rubber-hand-critique',name:'What the illusion shows',tag:'Robust and contested',
 definition:'The rubber hand illusion is one of the most used tools for studying bodily self-awareness, but the way it is measured matters: questionnaires, drift and brain responses do not always agree.',
 example:'Lush and colleagues found that how strongly people report the illusion is predicted by their general suggestibility, even under hypnosis-like instructions, which complicates what questionnaires measure.',
 desc:'Five cards on what is solid and what is debated about the rubber hand illusion, each with a status tag.',
 research:'Lush, P. et al. (2020). Trait phenomenological control predicts experience of mirror synaesthesia and the rubber hand illusion. Nature Communications 11, 4853; Rohde, Di Luca & Ernst (2011), PLoS ONE 6(6), e21659; Ehrsson, Spence & Passingham (2004), Science 305, 875–877.',
 dur:10,hint:'Press a card to read it.',
 init:()=>({c:0}),
 watch(p){return {c:Math.min(4,Math.floor(p*5))}},
 ui:[],on:{c(s,v){s.c=Number(v)}},
 draw(s,f,X){
  let out=heading('Measuring a feeling',26);
  S8_RH.forEach((c,k)=>{const y=60+k*42,on=s.c===k,t=S8_TAGS[c.k];out+=hit(X,'c',k,c.t,R(40,y,250,34,on?C.pale:'#fff',on?C.blue:C.line,6)+TF(52,y+22,c.t,14,C.ink,'start')+Ci(276,y+17,6,t[2]))});
  const c=S8_RH[s.c],t=S8_TAGS[c.k];out+=R(310,60,260,200,'#fff',C.line,8)+S8_pill(326,88,t[0],t[1],t[2])+S8_wrap(326,124,c.b,14,C.ink,34,21);
  out+=TF(300,300,'Dots: green robust · amber mixed · coral contested',13,C.muted);
  return {svg:out,phase:'The core effect of synchrony is solid; what exactly ratings and drift measure is still argued over.'};
 }});

/* =========================== synaesthesia =========================== */
// One illustrative grapheme–colour synaesthete; Simner et al. (2005) report shared tendencies (A often red, B blue, C yellow, O white).
const S8_SYN={A:'#d03a2f',B:'#2f63c4',C:'#e5c12b',D:'#7b4fb0',E:'#2c8a4a',F:'#8a5a2b',G:'#3fa36b',H:'#b04f7a',I:'#f1f1f1',O:'#ffffff',R:'#c8302a',Y:'#efd23b'};
const S8_LET=['A','B','C','D','E','F','G','H','I','O','R','Y'];
SCENE({id:'synaesthesia',name:'Coloured letters',tag:'Synaesthesia',
 definition:'Synaesthesia is a condition in which one kind of experience reliably triggers another: letters may have colours, sounds may have shapes, weekdays may have places in space. The associations are automatic and stay the same over years.',
 example:'For many grapheme–colour synaesthetes A is red and O is white, a pattern that is shared surprisingly often, perhaps because of early learning such as coloured alphabet toys.',
 desc:'A row of letters you can press to see one synaesthete’s colours, and bars for how common synaesthesia is.',
 research:'Simner, J. et al. (2006). Synaesthesia: the prevalence of atypical cross-modal experiences. Perception 35, 1024–1033 (about 4% for any type; about 1–2% grapheme–colour); Simner et al. (2005), Cognitive Neuropsychology 22, 1069–1085; Witthoft & Winawer (2013), Psychological Science 24, 258–265. The colours shown are illustrative.',
 dur:10,hint:'Press a letter to see the colour one synaesthete reports. Colours differ between people, but some tendencies are shared.',
 init:()=>({l:'A'}),
 watch(p){return {l:S8_LET[Math.min(S8_LET.length-1,Math.floor(p*S8_LET.length))]}},
 ui:[],on:{l(s,v){s.l=v}},
 draw(s,f,X){
  let out=heading('What colour is the letter A?',26)+S8_tag('robust');
  S8_LET.forEach((l,k)=>{const x=40+(k%6)*48,y=70+Math.floor(k/6)*58,on=s.l===l,col=S8_SYN[l];out+=hit(X,'l',l,'Letter '+l,R(x,y,40,46,on?'#22313a':'#fff',on?C.ink:C.line,6)+TBF(x+20,y+32,l,24,on?col:C.ink))});
  const col=S8_SYN[s.l];out+=R(40,200,280,60,'#fff',C.line,8)+R(52,212,36,36,col,C.line,6)+TF(100,236,`${s.l} looks like this to one synaesthete`,13,C.ink,'start');
  out+=TF(40,290,'Black ink still looks black; the colour is an added',13,C.muted,'start')+TF(40,308,'experience, often “in the mind’s eye”.',13,C.muted,'start');
  const pl=S8_plot(380,80,180,190,[0,2],[0,6],{yt:[[0,'0%'],[2,'2%'],[4,'4%'],[6,'6%']],yl:'share of people'});out+=pl.svg;
  out+=R(pl.X(.25),pl.Y(4.4),50,pl.Y(0)-pl.Y(4.4),C.purple,'none',3)+TF(pl.X(.5),pl.Y(4.4)-6,'~4%',13,C.ink);
  out+=R(pl.X(1.25),pl.Y(1.4),50,pl.Y(0)-pl.Y(1.4),C.blue,'none',3)+TF(pl.X(1.5),pl.Y(1.4)-6,'~1–2%',13,C.ink);
  out+=TF(pl.X(.5),pl.Y(0)+18,'any type',13,C.muted)+TF(pl.X(1.5),pl.Y(0)+18,'letter colour',13,C.muted);
  return {svg:out,phase:'Simner’s survey of unselected people found about 4% have some form of synaesthesia, far more than older self-referral studies suggested.'};
 }});

// Consistency test: two colourings of 8 letters in a seeded order.
const S8_CL=['A','B','C','E','K','M','S','T'],S8_PAL=['#d03a2f','#e98a2b','#e5c12b','#3fa36b','#2c8a8a','#2f63c4','#7b4fb0','#c45a9a','#8a5a2b','#9aa6ad','#22313a','#f4f4f4'];
const S8_cOrder=seed=>shuffled(S8_CL,S8_mix(seed+11)).concat(shuffled(S8_CL,S8_mix(seed+29)));
SCENE({id:'synaesthesia-consistency',name:'Are your colours consistent?',tag:'The test of genuineness',
 definition:'The standard test for synaesthesia is consistency: genuine synaesthetes give almost the same colour for each letter when retested months later, while other people asked to invent colours forget many of their choices within days.',
 example:'Baron-Cohen and colleagues found synaesthetes about 92% consistent after a year, against about 37% for controls retested after only a week. Online batteries now use the same idea.',
 desc:'Letters shown one at a time, twice, in mixed order, a palette of colours to press, and your consistency score beside the published figures for synaesthetes and controls.',
 research:'Baron-Cohen, S., Harrison, J., Goldstein, L. H. & Wyke, M. (1993). Coloured speech perception: is synaesthesia what happens when modularity breaks down? Perception 22, 419–426; Eagleman et al. (2007), Journal of Neuroscience Methods 159, 139–145 (robust).',
 dur:12,hint:'Pick the colour that best fits each letter, as fast as feels natural. Each letter comes back once later. Without synaesthesia, scores near a third are normal. Nothing leaves this page.',
 init:()=>({seed:6,i:0,res:[]}),
 watch(p){const n=Math.min(16,Math.floor(p*17)),r=S8_rng(9),ord=S8_cOrder(6),res=[];for(let i=0;i<n;i++){const prev=res.find(q=>q.l===ord[i]);res.push({l:ord[i],c:prev&&r()<.35?prev.c:Math.floor(r()*S8_PAL.length)})}return {seed:6,i:n,res,sim:true}},
 ui:[{b:'New order',act:'again'}],
 on:{pick(s,v){if(s.i>=16)return;const ord=S8_cOrder(s.seed);s.res.push({l:ord[s.i],c:Number(v)});s.i++},again(s){s.seed=nextSeed();s.i=0;s.res=[]}},
 draw(s,f,X){
  let out=heading('Give each letter a colour',26)+S8_tag('robust');const ord=S8_cOrder(s.seed);
  out+=R(40,64,150,130,'#fff',C.line,8);
  if(s.i<16)out+=TBF(115,148,ord[s.i],64,C.ink);else out+=TF(115,134,'done',16,C.muted);
  if(!s.sim)S8_PAL.forEach((c,k)=>{const x=210+(k%6)*44,y=70+Math.floor(k/6)*44;out+=hit(X,'pick',k,'Colour '+(k+1),R(x,y,36,36,c,C.line,6))});
  else S8_PAL.forEach((c,k)=>{const x=210+(k%6)*44,y=70+Math.floor(k/6)*44;out+=R(x,y,36,36,c,C.line,6)});
  out+=TF(115,214,`letter ${Math.min(s.i+1,16)} of 16`,13,C.muted);
  const pairs=S8_CL.map(l=>s.res.filter(r=>r.l===l)).filter(a=>a.length===2),same=pairs.filter(a=>a[0].c===a[1].c).length;
  const sc=pairs.length?same/pairs.length:null;
  const bars=[['synaesthetes, 1 year',.92,C.purple],['controls, 1 week',.37,C.grid],[s.sim?'simulated':'you',sc,C.coral]];
  bars.forEach(([l,v,col],k)=>{const y=244+k*34;out+=TF(200,y+15,l,13,C.ink,'end')+R(210,y,300,22,'#fff',C.grid,4);if(v!=null)out+=R(210,y,300*v,22,col,'none',4)+TF(520,y+16,Math.round(v*100)+'%',13,C.ink,'start');else out+=TF(220,y+16,'finish both rounds',13,C.muted,'start')});
  return {svg:out,phase:sc==null?'Your score counts letters given the same colour both times.':sc>.8?'Very high consistency: a hallmark of synaesthesia, though a short test with a small palette can flatter anyone.':'Most people land well below synaesthetes, who keep the same colours for years.'};
 }});

// Ramachandran & Hubbard (2001): a shape made of 2s hidden among 5s.
const S8_TRI={1:[4],2:[3,5],3:[2,6],4:[1,2,3,4,5,6,7]};
const S8_POP=(()=>{const g=[];for(let r=0;r<6;r++)for(let c=0;c<9;c++)g.push({r,c,d:(S8_TRI[r]||[]).includes(c)?2:5});return g})();
SCENE({id:'synaesthesia-pop-out',name:'Do the colours pop out?',tag:'A famous test, mixed results',
 definition:'If letters really trigger colours early in vision, a shape made of one digit hidden among another might pop out for synaesthetes, as a colour difference would.',
 example:'Ramachandran and Hubbard reported that two synaesthetes found a triangle of 2s among 5s faster than controls. Later group studies mostly found that synaesthetes still search item by item, with colour helping only once attention reaches a digit.',
 desc:'A grid of 5s with a triangle of 2s hidden inside, shown in black or as one synaesthete might colour it.',
 research:'Ramachandran, V. S. & Hubbard, E. M. (2001). Psychophysical investigations into the neural basis of synaesthesia. Proceedings of the Royal Society B 268, 979–983; Edquist et al. (2006), Cortex 42, 222–231 (mixed: most synaesthetes still search item by item).',
 dur:10,hint:'Look for the shape in black first, then switch on colours. Pop-out for colour is real; whether synaesthetes get it from digits is debated.',
 init:()=>({col:'0'}),
 watch(p){return {col:p<.5?'0':'1'}},
 ui:[{choose:[['0','Black ink'],['1','Coloured as reported']],label:'View',get:s=>s.col,act:'col'}],
 on:{col(s,v){s.col=v}},
 draw(s){
  let out=heading('Find the shape made of 2s',26)+S8_tag('mixed');
  S8_POP.forEach(q=>{const x=130+q.c*42,y=96+q.r*40,col=s.col==='1'?(q.d===2?C.coral:C.green):C.ink;out+=TBF(x,y,String(q.d),22,col)});
  out+=TF(300,350,s.col==='1'?'With colour, the triangle pops out at once':'In black, most people search digit by digit',14,C.muted);
  return {svg:out,phase:s.col==='1'?'A colour difference pops out without searching. The question is whether synaesthetes see this without the colours being printed; most group studies say only partly.':'Without colour, the triangle of 2s takes a careful search.'};
 }});

/* =========================== sensory-substitution =========================== */
const S8_SHAPES={cup:(x,y)=>(x>.3&&x<.62&&y>.3&&y<.82&&!(x>.36&&x<.56&&y>.3&&y<.76))||(Math.hypot(x-.68,y-.52)<.12&&Math.hypot(x-.68,y-.52)>.06),
 face:(x,y)=>{const d=Math.hypot(x-.5,y-.5);return (d<.42&&d>.36)||Math.hypot(x-.36,y-.4)<.06||Math.hypot(x-.64,y-.4)<.06||(y>.62&&y<.7&&x>.34&&x<.66&&Math.abs(y-.62-((x-.5)**2)*0.6)<.06)},
 E:(x,y)=>x>.28&&x<.72&&y>.18&&y<.82&&(x<.42||Math.abs(y-.24)<.06||Math.abs(y-.5)<.06||Math.abs(y-.76)<.06),
 person:(x,y)=>Math.hypot(x-.5,y-.2)<.09||(Math.abs(x-.5)<.07&&y>.28&&y<.6)||(Math.abs(y-.38)<.04&&x>.3&&x<.7)||(y>.58&&y<.9&&(Math.abs(x-.43+(y-.58)*.2)<.04||Math.abs(x-.57-(y-.58)*.2)<.04))};
const S8_SH=[['cup','Cup'],['face','Face'],['E','Letter E'],['person','Person']];
SCENE({id:'sensory-substitution',name:'Seeing with the skin',tag:'Tactile vision',
 definition:'Sensory substitution feeds information meant for one sense through another. A camera image can be turned into a pattern of vibration on the skin, and with practice people learn to recognise objects from it.',
 example:'In 1969 Bach-y-Rita’s blind participants sat in a dentist’s chair with 400 vibrating pins on their backs, driven by a camera. With training they could identify objects and judge where they were.',
 desc:'A simple camera image beside the vibration grid it produces, with a slider for how many vibrators there are.',
 research:'Bach-y-Rita, P., Collins, C. C., Saunders, F. A., White, B. & Scadden, L. (1969). Vision substitution by tactile image projection. Nature 221, 963–964 (a 20 × 20 array of 400 vibrators); Bach-y-Rita & Kercel (2003), Trends in Cognitive Sciences 7, 541–546.',
 dur:10,hint:'Choose an object and change the grid size. Bach-y-Rita’s chair had 20 × 20.',
 init:()=>({sh:'cup',n:20}),
 watch(p){return {sh:S8_SH[Math.min(3,Math.floor(p*4))][0],n:20}},
 ui:[{choose:S8_SH,label:'Object',get:s=>s.sh,act:'sh'},{range:'n',label:'Vibrators per side',min:6,max:32,step:2,get:s=>s.n,act:'n'}],
 on:{sh(s,v){s.sh=v},n(s,v){s.n=Number(v)}},
 draw(s){
  let out=heading('A camera image, felt on the back',26);const f=S8_SHAPES[s.sh];
  out+=R(40,70,220,220,'#fff',C.line,6);for(let i=0;i<88;i++)for(let j=0;j<88;j++)if(f((i+.5)/88,(j+.5)/88))out+=R(40+i*2.5,70+j*2.5,2.6,2.6,C.ink,'none',0);
  out+=TF(150,312,'camera image',13,C.muted);
  out+=arrow(270,180,320,180,C.blue,2.6);
  const n=s.n,c=220/n;out+=R(340,70,220,220,'#f7f1e8',C.line,6);
  for(let i=0;i<n;i++)for(let j=0;j<n;j++){let on=0;for(let a=0;a<3;a++)for(let b=0;b<3;b++)if(f((i+(a+.5)/3)/n,(j+(b+.5)/3)/n))on++;out+=Ci(340+(i+.5)*c,70+(j+.5)*c,Math.max(1,c*.32),on>=3?C.coral:'#e0d3c2')}
  out+=TF(450,312,`${n} × ${n} = ${n*n} vibrators`,13,C.muted);
  return {svg:out,phase:n<=10?'With few vibrators, objects blur into blobs; learners then rely on movement, scanning the camera to feel edges change.':'At 20 × 20 the outline survives. Learners came to feel objects as out in front of them, not as buzzing on their backs.'};
 }});

// The vOICe (Meijer 1992): scan an image left to right; height becomes pitch, brightness loudness.
const S8_VO={rise:[[0,0],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7]],fall:[[0,7],[1,6],[2,5],[3,4],[4,3],[5,2],[6,1],[7,0]],flat:[[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]],vee:[[0,7],[1,5],[2,3],[3,1],[4,1],[5,3],[6,5],[7,7]],box:[[0,2],[0,6],[1,2],[1,6],[2,2],[2,6],[3,2],[3,6],[4,2],[4,6],[5,2],[5,6],[6,2],[6,6],[7,2],[7,6]]};
const S8_VOS=[['rise','Rising line'],['fall','Falling line'],['flat','Flat line'],['vee','V shape'],['box','Two lines']],S8_vHz=row=>200*Math.pow(2,row*0.5);
SCENE({id:'sensory-substitution-voice',name:'Hearing a picture',tag:'The vOICe',
 definition:'The vOICe turns images into sound: it scans a picture from left to right, playing each bright spot as a tone whose pitch rises with height. A rising line becomes a rising sweep.',
 example:'Experienced users can locate and identify objects from these soundscapes; in some, listening activates parts of the visual cortex that normally process shape.',
 desc:'A small image, a scanning line moving across it, and buttons to play the soundscape, with higher dots playing higher notes.',
 research:'Meijer, P. B. L. (1992). An experimental system for auditory image representations. IEEE Transactions on Biomedical Engineering 39, 112–121; Amedi et al. (2007), Nature Neuroscience 10, 687–689 (visual cortex activity in trained users; small samples).',
 dur:10,hint:'Choose a shape and press Play. Sound on; the volume is low. Higher dots sound higher, and the scan takes about one second.',
 init:()=>({sh:'rise',head:-1}),
 watch(p){return {sh:S8_VOS[Math.min(4,Math.floor(p*5))][0],head:Math.floor(((p*5)%1)*9)-1}},
 ui:[{choose:S8_VOS,label:'Image',get:s=>s.sh,act:'sh'},{b:'Play',act:'play'}],
 on:{sh(s,v){s.sh=v;s.head=-1},play(s,a,ctx){AUDIO.seq(S8_VO[s.sh].map(([c,r])=>({hz:S8_vHz(r),at:c*.13,dur:.12})),{type:'sine',gain:.12});s.head=0;ctx.every(130,'tick')},
  tick(s){s.head++;if(s.head>7){s.head=-1;return 'stop'}}},
 draw(s){
  let out=heading('Left to right in time, height as pitch',26);const x0=80,y0=70,c=34;
  out+=R(x0,y0,8*c,8*c,'#22313a','none',6);
  S8_VO[s.sh].forEach(([cc,r])=>out+=Ci(x0+(cc+.5)*c,y0+(7-r+.5)*c,9,'#f4f4f4'));
  if(s.head>=0)out+=R(x0+s.head*c,y0,c,8*c,C.amber,'none',0,'opacity=".35"');
  out+=TF(x0+4*c,y0+8*c+20,'time →',13,C.muted);
  for(let r=0;r<8;r+=2)out+=TF(x0+8*c+12,y0+(7-r+.5)*c+4,Math.round(S8_vHz(r))+' Hz',13,C.muted,'start');
  out+=TF(470,90,'pitch ↑',13,C.muted,'start');
  return {svg:out,phase:'Each column is played in turn. With practice, people learn to hear lines, edges and even simple objects in these sounds.'};
 }});

const S8_SUB=[
 {t:'Tactile vision chair (1969)',k:'robust',b:'400 vibrators on the back, driven by a camera; trained users identified objects and judged distance. Bulky and never widely adopted.'},
 {t:'The vOICe (1992)',k:'mixed',b:'Image to sound on ordinary hardware; skilled users exist, but learning takes many hours and evidence comes from small groups.'},
 {t:'BrainPort (FDA 2015)',k:'mixed',b:'A camera on glasses drives an electrode grid on the tongue. Approved in the US for blind users as an aid, not a cure; daily use varies.'},
 {t:'Braille and the visual cortex',k:'robust',b:'In people blind from early life, reading Braille activates the visual cortex (Sadato et al. 1996), and disrupting it disrupts reading (Cohen et al. 1997).'},
 {t:'Uptake in daily life',k:'contested',b:'Despite decades of demonstrations, few blind people use substitution devices day to day; canes, dogs and screen readers remain the main tools.'}];
SCENE({id:'sensory-substitution-brain',name:'A brain that reassigns itself',tag:'Devices and plasticity',
 definition:'Sensory substitution works partly because the brain is flexible: areas usually devoted to one sense can take on work from another, especially after early sensory loss.',
 example:'Blind Braille readers use their visual cortex for reading by touch. Magnetic stimulation over that area makes Braille dots feel jumbled.',
 desc:'Five cards on substitution devices and the brain’s cross-modal plasticity, each with a status tag.',
 research:'Sadato, N. et al. (1996). Activation of the primary visual cortex by Braille reading in blind subjects. Nature 380, 526–528; Cohen, L. G. et al. (1997). Nature 389, 180–183; Maidenbaum, Abboud & Amedi (2014), Neuroscience & Biobehavioral Reviews 41, 3–15 (on limited uptake).',
 dur:10,hint:'Press a card to read it.',
 init:()=>({c:0}),
 watch(p){return {c:Math.min(4,Math.floor(p*5))}},
 ui:[],on:{c(s,v){s.c=Number(v)}},
 draw(s,f,X){
  let out=heading('Devices, and the brain behind them',26);
  S8_SUB.forEach((c,k)=>{const y=60+k*42,on=s.c===k,t=S8_TAGS[c.k];out+=hit(X,'c',k,c.t,R(40,y,250,34,on?C.pale:'#fff',on?C.blue:C.line,6)+TF(52,y+22,c.t,14,C.ink,'start')+Ci(276,y+17,6,t[2]))});
  const c=S8_SUB[s.c],t=S8_TAGS[c.k];out+=R(310,60,260,200,'#fff',C.line,8)+S8_pill(326,88,t[0],t[1],t[2])+S8_wrap(326,124,c.b,14,C.ink,34,21);
  out+=TF(300,300,'Dots: green robust · amber mixed · coral contested',13,C.muted);
  return {svg:out,phase:'The science of cross-modal plasticity is strong; turning it into tools people choose to use every day has been much harder.'};
 }});

/* =========================== sensory-ageing =========================== */
// Accommodation amplitude with age, approximate after Duane (1922).
const S8_DUANE=[[10,14],[20,11],[30,8.5],[40,6],[45,3.7],[50,2.2],[55,1.4],[60,1.1],[70,1],[80,1]];
const S8_lin=(tab,a)=>{for(let i=1;i<tab.length;i++)if(a<=tab[i][0]){const [x0,y0]=tab[i-1],[x1,y1]=tab[i];return y0+(y1-y0)*(a-x0)/(x1-x0)}return tab[tab.length-1][1]};
SCENE({id:'sensory-ageing',name:'Arms too short',tag:'The ageing lens',
 definition:'With age the eye’s lens stiffens and can no longer change shape enough to focus close up. The nearest point you can see sharply moves away, until reading needs glasses: presbyopia.',
 example:'A ten-year-old can focus about 7 cm from the eye. By the mid-forties the near point passes 25 cm, and people start holding menus at arm’s length.',
 desc:'An eye and a page drawn at the nearest distance the eye can focus, with an age slider and a curve of focusing power against age.',
 research:'Duane, A. (1922). Studies in monocular and binocular accommodation with their clinical applications. American Journal of Ophthalmology 5, 865–877 (values here approximate); Glasser & Campbell (1998), Vision Research 38, 209–229 (robust).',
 dur:10,hint:'Slide the age and watch the page move away. Near point (cm) = 100 ÷ focusing power (dioptres).',
 init:()=>({age:30}),
 watch(p){return {age:Math.round(10+p*70)}},
 ui:[{range:'age',label:'Age',min:10,max:80,step:1,get:s=>s.age,act:'age',show:v=>v+' years'}],
 on:{age(s,v){s.age=Number(v)}},
 draw(s){
  const A=S8_lin(S8_DUANE,s.age),np=100/A;let out=heading('How close can you focus?',26)+S8_tag('robust');
  const cm=v=>70+Math.min(100,v)*4.6;
  out+=Ci(70,130,24,'#fff',C.ink)+Ci(86,130,8,C.blue);out+=L(70,170,540,170,C.line,1);
  for(let v=0;v<=100;v+=25)out+=L(cm(v),166,cm(v),174,C.line,1)+TF(cm(v),192,v+' cm',13,C.muted);
  out+=R(cm(np)-6,100,12,60,'#fff',C.coral,3)+TF(cm(np),92,'nearest sharp',13,C.coral);
  if(np>25)out+=L(cm(25),110,cm(25),160,C.green,1.5,'stroke-dasharray="4 3"')+TF(cm(25),210,'reading distance',13,C.green);
  const pl=S8_plot(100,240,420,90,[10,80],[0,15],{xt:[[10,'10'],[30,'30'],[50,'50'],[70,'70'],[80,'80 yr']],yt:[[0,'0'],[15,'15 D']]});out+=pl.svg;
  const pts=[];for(let a=10;a<=80;a++)pts.push([pl.X(a),pl.Y(S8_lin(S8_DUANE,a))]);out+=S8_poly(pts,C.blue,2.4)+Ci(pl.X(s.age),pl.Y(A),6,C.coral,'#fff');
  out+=TF(530,250,`${A.toFixed(1)} D`,13,C.ink,'start')+TF(530,268,`${np.toFixed(0)} cm`,13,C.ink,'start');
  return {svg:out,phase:np>25?'The near point is now beyond normal reading distance: reading glasses add the focusing power the lens has lost.':'The lens still focuses closer than reading distance, so small print is comfortable.'};
 }});

// Typical high-frequency hearing loss with age (illustrative, in the spirit of ISO 7029).
const S8_HF=[[1000,.0022],[2000,.0035],[4000,.0075],[8000,.011]];
const S8_shift=(k,age)=>Math.max(0,k*(age-18)**2);
SCENE({id:'sensory-ageing-hearing',name:'High notes fade first',tag:'Hearing and age',
 definition:'Hearing usually declines with age from the top down: the hair cells at the start of the cochlea, which detect the highest pitches, wear out first. This age-related loss is called presbycusis.',
 example:'Many teenagers can hear a 17 kHz tone that most adults over 40 cannot, which is why so-called mosquito ringtones were once popular in classrooms.',
 desc:'An audiogram with typical hearing levels at four frequencies for a chosen age, and buttons to play quiet high tones.',
 research:'ISO 7029:2017. Acoustics: statistical distribution of hearing thresholds related to age and gender. Curves here are illustrative medians, not the standard’s exact values; Gates & Mills (2005), Lancet 366, 1111–1120 (robust).',
 dur:10,hint:'Slide the age. The tone buttons play quietly; laptop and phone speakers often cannot produce the highest tones, so silence may be your device. Not a hearing test: see an audiologist for that.',
 init:()=>({age:40}),
 watch(p){return {age:Math.round(20+p*60)}},
 ui:[{range:'age',label:'Age',min:18,max:85,step:1,get:s=>s.age,act:'age',show:v=>v+' years'},{b:'Play 4 kHz',act:'tone',arg:4000},{b:'Play 12 kHz',act:'tone',arg:12000},{b:'Play 16 kHz',act:'tone',arg:16000}],
 on:{age(s,v){s.age=Number(v)},tone(s,v){AUDIO.tone(Number(v),{dur:.6,gain:.05,attack:.05,release:.1})}},
 draw(s){
  let out=heading('A typical audiogram at this age',26)+S8_tag('robust');
  const pl=S8_plot(90,70,380,240,[0,3],[80,0],{xt:[[0,'1 kHz'],[1,'2 kHz'],[2,'4 kHz'],[3,'8 kHz']],yt:[[0,'0 dB'],[20,'20'],[40,'40'],[60,'60'],[80,'80']],yl:'hearing loss (dB), worse downwards'});
  out+=pl.svg;out+=R(90,pl.Y(0),380,pl.Y(20)-pl.Y(0),C.greenp,'none',0,'opacity=".6"');
  const pts=S8_HF.map(([hz,k],i)=>[pl.X(i),pl.Y(Math.min(80,S8_shift(k,s.age)))]);out+=S8_poly(pts,C.blue,2.6);
  pts.forEach(p=>out+=Ci(p[0],p[1],6,C.blue,'#fff'));
  out+=TF(490,120,`age ${s.age}`,14,C.ink,'start')+TF(490,145,`8 kHz: ${Math.round(S8_shift(.011,s.age))} dB loss`,13,C.ink,'start')+TF(490,165,`1 kHz: ${Math.round(S8_shift(.0022,s.age))} dB loss`,13,C.ink,'start');
  out+=R(490,190,14,14,C.greenp,'none',2)+TF(510,202,'normal range',13,C.green,'start');
  out+=TF(280,350,'Not a diagnosis. Curves are illustrative typical values.',13,C.muted);
  return {svg:out,phase:s.age>60?'High frequencies are now well below normal, which makes consonants like s, f and th harder to catch, especially in noise.':'Loss starts at the highest frequencies and creeps downwards over decades.'};
 }});

// Smell impairment by age, approximate after Murphy et al. (2002), Beaver Dam study.
const S8_SM=[[50,2],[55,5],[60,9],[65,14],[70,21],[75,32],[80,48],[85,62],[90,70]];
SCENE({id:'sensory-ageing-smell',name:'Smell fades quietly',tag:'Smell and age',
 definition:'The sense of smell declines with age more often than people realise, because loss is gradual and rarely noticed. It matters for safety, appetite and pleasure.',
 example:'In a large American study, about one in four adults over 53 had measurable smell impairment, rising to more than six in ten among those over 80. Most did not know.',
 desc:'A curve of the share of people with measurable smell loss by age, a marker for a chosen age, and notes on why it matters.',
 research:'Murphy, C. et al. (2002). Prevalence of olfactory impairment in older adults. JAMA 288, 2307–2312 (24.5% overall aged 53–97; 62.5% aged 80–97); Doty, R. L. et al. (1984), Science 226, 1441–1443 (robust). The curve shape is approximate.',
 dur:10,hint:'Slide the age. Self-reports badly underestimate loss, which is why smoke and gas alarms matter more with age.',
 init:()=>({age:70}),
 watch(p){return {age:Math.round(50+p*40)}},
 ui:[{range:'age',label:'Age',min:50,max:90,step:1,get:s=>s.age,act:'age',show:v=>v+' years'}],
 on:{age(s,v){s.age=Number(v)}},
 draw(s){
  const v=S8_lin(S8_SM,s.age);let out=heading('Who has lost some sense of smell?',26)+S8_tag('robust');
  const pl=S8_plot(80,70,300,230,[50,90],[0,80],{xt:[[50,'50'],[60,'60'],[70,'70'],[80,'80'],[90,'90']],yt:[[0,'0%'],[20,'20%'],[40,'40%'],[60,'60%'],[80,'80%']],xl:'age',yl:'measurable smell impairment'});out+=pl.svg;
  const pts=[];for(let a=50;a<=90;a++)pts.push([pl.X(a),pl.Y(S8_lin(S8_SM,a))]);out+=S8_poly(pts,C.purple,2.6)+Ci(pl.X(s.age),pl.Y(v),7,C.coral,'#fff');
  out+=TBF(400,110,`about ${Math.round(v)}%`,18,C.ink,'start')+TF(400,132,`at age ${s.age}`,13,C.muted,'start');
  out+=S8_wrap(400,170,'Why it matters: smoke, gas and spoiled food go unnoticed; food tastes flat, so people may add salt or eat less.',13,C.ink,24,19);
  return {svg:out,phase:'Most people with measurable loss had not noticed it, so the real burden is larger than people report.'};
 }});

/* =========================== affective-touch =========================== */
// Löken et al. (2009): C-tactile firing and pleasantness peak at slow stroking (1–10 cm/s); Aβ fibres keep rising.
const S8_ct=v=>Math.exp(-((Math.log10(v)-Math.log10(3))**2)/(2*.42**2));
const S8_ab=v=>.15+.85*Math.log10(v/.3)/2;
SCENE({id:'affective-touch',name:'A caress has its own nerves',tag:'C-tactile fibres',
 definition:'Besides the fast nerves that tell you where and how you are touched, hairy skin has slow C-tactile fibres that respond best to gentle stroking at about the speed of a caress. Their firing tracks how pleasant the touch feels.',
 example:'Löken and colleagues recorded single nerve fibres while brushing the forearm at different speeds. C-tactile fibres fired most at 1–10 cm/s, the same speeds people rated most pleasant.',
 desc:'A forearm with a brush moving at a chosen speed, and curves of C-tactile firing, fast-fibre firing and pleasantness against speed on a logarithmic scale.',
 research:'Löken, L. S., Wessberg, J., Morrison, I., McGlone, F. & Olausson, H. (2009). Coding of pleasant touch by unmyelinated afferents in humans. Nature Neuroscience 12, 547–548 (robust). Curves are illustrative normalised shapes.',
 dur:10,hint:'Move the speed. The C-tactile curve is an upside-down U peaking near 3 cm/s; the fast fibres simply fire more for faster strokes.',
 init:()=>({v:3}),
 watch(p){return {v:+Math.pow(10,-0.5+p*2).toFixed(2)}},
 ui:[{range:'v',label:'Stroking speed (cm/s)',min:.3,max:30,step:.1,get:s=>s.v,act:'v'}],
 on:{v(s,v){s.v=Number(v)}},
 draw(s,f,X){
  let out=heading('How fast is a pleasant touch?',26)+S8_tag('robust');
  out+=P('M60 120Q200 100 300 118Q320 126 300 140Q200 156 60 150Z',C.line,2,'#f1dcc8');
  const bx=70+((X&&X.p!=null?X.p*6:0)%1)*200;out+=R(bx,92,16,26,C.purple,'none',4);
  out+=TF(180,178,`brush at ${s.v.toFixed(1)} cm/s`,14,C.ink);
  const pl=S8_plot(90,210,420,120,[.3,30],[0,1.1],{log:true,xt:[[.3,'0.3'],[1,'1'],[3,'3'],[10,'10'],[30,'30 cm/s']],yt:[[0,'low'],[1,'high']]});out+=pl.svg;
  const cv=(fn,col,w,ex)=>{const pts=[];for(let k=0;k<=60;k++){const v=.3*Math.pow(100,k/60);pts.push([pl.X(v),pl.Y(fn(v))])}return S8_poly(pts,col,w,ex)};
  out+=cv(S8_ct,C.purple,2.8)+cv(v=>.9*S8_ct(v)+.05,C.coral,2,'stroke-dasharray="6 4"')+cv(S8_ab,C.blue,2);
  out+=L(pl.X(s.v),210,pl.X(s.v),330,C.ink,1.2);
  out+=TF(330,80,'C-tactile firing',13,C.purple,'start')+TF(330,98,'pleasantness (dashed)',13,C.coral,'start')+TF(330,116,'fast Aβ fibres',13,C.blue,'start');
  return {svg:out,phase:s.v>=1&&s.v<=10?'This is caress speed: C-tactile fibres fire most and people rate the touch most pleasant.':'Too slow or too fast, the touch is still felt clearly by fast fibres, but the C-tactile signal and the pleasantness drop.'};
 }});

const S8_BODY=[{id:'forearm',n:'Forearm',x:120,y:200,ct:'yes',b:'Hairy skin with plenty of C-tactile fibres: the classic test site.'},
 {id:'back',n:'Back',x:300,y:150,ct:'yes',b:'Hairy skin; slow stroking here is rated pleasant too.'},
 {id:'face',n:'Face',x:300,y:72,ct:'yes',b:'C-tactile fibres have been recorded in facial skin.'},
 {id:'palm',n:'Palm',x:470,y:230,ct:'rare',b:'Glabrous (hairless) skin. Long thought to lack C-tactile fibres; a few have now been found, so this is debated.'},
 {id:'thigh',n:'Thigh',x:250,y:290,ct:'yes',b:'Hairy skin with C-tactile fibres.'}];
SCENE({id:'affective-touch-body',name:'Where the caress nerves are',tag:'Hairy and hairless skin',
 definition:'C-tactile fibres are common in hairy skin and rare or absent in hairless (glabrous) skin like the palms, which are specialised for fast, precise touch.',
 example:'Vallbo and colleagues found C-tactile fibres in the forearm and face but not in recordings from the palm. A recent study reported a few in the palm, so the question is not fully settled.',
 desc:'A body outline with points to press, each saying whether C-tactile fibres are found there.',
 research:'Vallbo, Å. B., Olausson, H. & Wessberg, J. (1999). Unmyelinated afferents constitute a second system coding tactile stimuli of the human hairy skin. Journal of Neurophysiology 81, 2753–2763; Watkins, R. H. et al. (2021). Journal of Neurophysiology 125, 232–237 (C-tactile afferents in glabrous skin: emerging).',
 dur:10,hint:'Press a point on the body.',
 init:()=>({p:'forearm'}),
 watch(p){return {p:S8_BODY[Math.min(4,Math.floor(p*5))].id}},
 ui:[],on:{p(s,v){s.p=v}},
 draw(s,f,X){
  let out=heading('Hairy skin, hairless skin',26);
  out+=Ci(300,72,26,'#f1dcc8',C.line)+R(250,102,100,140,'#f1dcc8',C.line,30)+P('M250 120L150 210M350 120L460 220',C.line,22,'none','stroke-linecap="round"')+P('M275 240L250 330M325 240L345 330',C.line,24,'none','stroke-linecap="round"');
  S8_BODY.forEach(b=>{const on=s.p===b.id,col=b.ct==='yes'?C.purple:C.amber;out+=hit(X,'p',b.id,b.n,Ci(b.x,b.y,on?13:10,col,'#fff'))});
  const b=S8_BODY.find(q=>q.id===s.p);out+=R(400,60,180,150,'#fff',C.line,8)+TBF(410,84,b.n,15,C.ink,'start')+TF(410,106,b.ct==='yes'?'C-tactile: yes':'C-tactile: rare, debated',13,b.ct==='yes'?C.purple:C.amber,'start')+S8_wrap(410,130,b.b,13,C.ink,22,18);
  return {svg:out,phase:'A gentle stroke on the forearm engages a slow “pleasant touch” channel; the palm is built for fast, precise touch instead.'};
 }});

// Self-test: stroke your own forearm at four speeds (twice each) and rate pleasantness.
const S8_SPD=[1,3,10,30],S8_AN=8;
const S8_aOrder=seed=>shuffled(range(S8_AN).map(k=>S8_SPD[k%4]),S8_mix(seed+41));
const S8_pub=v=>1+5.2*(.9*S8_ct(v)+.05);
SCENE({id:'affective-touch-rate',name:'Rate a stroke yourself',tag:'Your own forearm',
 definition:'You can feel the speed tuning of pleasant touch on yourself by stroking your own forearm at different speeds and rating each one. Touch from someone else usually feels stronger: the brain damps self-touch.',
 example:'Stroking 10 cm in about three seconds feels soothing to most people; a quick swipe in a third of a second feels like a brush-off.',
 desc:'A guide bar that fills over the time one stroke should take, rating buttons from 1 to 7, and your ratings beside an approximate published curve.',
 research:'Löken et al. (2009), Nature Neuroscience 12, 547–548; Ackerley et al. (2014), Frontiers in Behavioral Neuroscience 8, 54; Boehme et al. (2019), PNAS 116, 2290–2299 (self-touch dampened). The published curve here is approximate.',
 dur:12,hint:'Use two fingertips on your bare forearm. Press Start, stroke about 10 cm while the bar fills, then rate how pleasant it felt. Eight strokes. Nothing leaves this page.',
 init:()=>({seed:8,i:0,ph:'idle',el:0,res:[]}),
 watch(p){const n=Math.min(S8_AN,Math.floor(p*(S8_AN+1))),r=S8_rng(31),ord=S8_aOrder(8),res=[];for(let i=0;i<n;i++)res.push({v:ord[i],r:Math.max(1,Math.min(7,Math.round(S8_pub(ord[i])-.6+r()*1.2)))});return {seed:8,i:Math.min(n,S8_AN-1),ph:'idle',el:0,res,sim:true}},
 ui:[{b:'Start stroke',act:'go'},{b:'New order',act:'again'}],
 on:{go(s,a,ctx){if(s.i>=S8_AN||s.ph!=='idle')return;s.ph='stroke';s.el=0;s.t0=performance.now();ctx.every(50,'tick')},
  tick(s){const v=S8_aOrder(s.seed)[s.i],dur=10/v*1000;s.el=Math.min(1,(performance.now()-s.t0)/dur);if(s.el>=1){s.ph='ask';return 'stop'}},
  rate(s,v){if(s.ph!=='ask')return;s.res.push({v:S8_aOrder(s.seed)[s.i],r:Number(v)});s.i++;s.ph='idle'},
  again(s){s.seed=nextSeed();s.i=0;s.res=[];s.ph='idle'}},
 draw(s,f,X){
  let out=heading('Stroke your forearm, then rate it',26)+S8_tag('robust');const v=S8_aOrder(s.seed)[Math.min(s.i,S8_AN-1)];
  out+=TF(170,78,s.i>=S8_AN?'all strokes done':`stroke ${s.i+1} of ${S8_AN}: 10 cm in ${(10/v).toFixed(1)} s`,14,C.ink);
  out+=R(40,92,260,26,'#fff',C.line,6)+R(40,92,260*(s.ph==='stroke'?s.el:s.ph==='ask'?1:0),26,C.purple,'none',6);
  out+=TF(170,140,s.ph==='stroke'?'stroke now…':s.ph==='ask'?'how pleasant was it?':'press Start stroke',13,C.muted);
  if(s.ph==='ask'&&!s.sim)[1,2,3,4,5,6,7].forEach(n=>{const x=36+(n-1)*38;out+=hit(X,'rate',n,'Rating '+n,R(x,152,32,32,'#fff',C.blue,6)+TBF(x+16,173,String(n),15,C.blue))});
  out+=TF(170,206,'1 = unpleasant · 7 = very pleasant',13,C.muted);
  const pl=S8_plot(360,70,210,220,[.7,40],[1,7],{log:true,xt:[[1,'1'],[3,'3'],[10,'10'],[30,'30']],yt:[[1,'1'],[4,'4'],[7,'7']],xl:'speed (cm/s)',yl:'pleasantness'});out+=pl.svg;
  const pts=[];for(let k=0;k<=40;k++){const vv=.7*Math.pow(40/.7,k/40);pts.push([pl.X(vv),pl.Y(S8_pub(vv))])}out+=S8_poly(pts,C.green,2,'stroke-dasharray="6 4"');
  S8_SPD.forEach(sp=>{const m=s.res.filter(r=>r.v===sp);if(m.length){const av=m.reduce((a,r)=>a+r.r,0)/m.length;out+=Ci(pl.X(sp),pl.Y(av),6,C.coral,'#fff')}});
  out+=TF(170,250,`dots: ${s.sim?'simulated':'your'} ratings`,13,C.muted)+TF(170,270,'dashed: approximate published curve',13,C.muted);
  return {svg:out,phase:'Most people rate the middle speeds highest. Self-touch is usually rated a little lower than being stroked by someone else.'};
 }});
