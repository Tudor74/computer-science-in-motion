/* ===================== Mind era 1 · Measuring the mind (1830–1900) ===================== */
// Shared helpers for this era (prefix D1_).
const D1_mean=a=>a.length?sum(a)/a.length:0;
const D1_median=a=>{if(!a.length)return 0;const b=a.slice().sort((x,y)=>x-y),m=b.length>>1;return b.length%2?b[m]:(b[m-1]+b[m])/2};
const D1_next=s=>(s.seed=(s.seed*48271)%2147483647);
// Least-squares line y = a + b·x; null with too little spread.
function D1_fit(pts){
 if(pts.length<2)return null;const n=pts.length,mx=sum(pts.map(p=>p[0]))/n,my=sum(pts.map(p=>p[1]))/n;
 const sxx=sum(pts.map(p=>(p[0]-mx)**2));if(sxx<.01)return null;
 const b=sum(pts.map(p=>(p[0]-mx)*(p[1]-my)))/sxx;return {a:my-b*mx,b};
}
// A plot frame with general ranges; the y label sits above the frame. Returns {svg,px,py}.
function D1_plot(x,y,w,h,x0,x1,y0,y1,xlab,ylab,xticks,yticks,xf=v=>v,yf=v=>v){
 const px=v=>x+w*clamp((v-x0)/(x1-x0),0,1),py=v=>y+h-h*clamp((v-y0)/(y1-y0),0,1);
 let s=R(x,y,w,h,'#fff',C.grid,6);
 for(const t of xticks)s+=L(px(t),y+h,px(t),y+h+5,C.line,1.5)+TF(px(t),y+h+18,xf(t),13,C.muted);
 for(const t of yticks)s+=L(x-5,py(t),x,py(t),C.line,1.5)+L(x,py(t),x+w,py(t),'#eef3f6',1)+TF(x-8,py(t)+5,yf(t),13,C.muted,'end');
 s+=TF(x+w/2,y+h+36,xlab,13,C.muted)+(ylab?TF(x-6,y-10,ylab,13,C.muted,'start'):'');
 return {svg:s,px,py};
}
// Word-wrapped fixed-size paragraph.
function D1_lines(text,max){const out=[];let line='';for(const w of String(text).split(' ')){if(line&&(line+' '+w).length>max){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out}
function D1_para(x,y,text,max,size=13,col=C.ink,lh=18,anchor='start'){return D1_lines(text,max).map((l,i)=>TF(x,y+i*lh,l,size,col,anchor)).join('')}
const D1_ms=v=>Math.round(v)+' ms';
// Normal distribution helpers (Abramowitz & Stegun 7.1.26).
function D1_erf(x){const t=1/(1+.3275911*Math.abs(x)),y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-x*x);return x>=0?y:-y}
const D1_Phi=z=>.5*(1+D1_erf(z/Math.SQRT2));
// Simulated participant: seeded, skewed reaction times (ms) around a base.
function D1_simRT(seed,n,base,spread,tail){const r=rng(seed);return range(n).map(()=>base+(r()+r()+r()-1.5)*spread+(-Math.log(1-r()*.98))*tail)}
// Panel note on the right.
const D1_note=(x,y,w,h,title,text,max)=>R(x,y,w,h,'#fff',C.grid,10)+TBF(x+12,y+24,title,14,C.ink,'start')+D1_para(x+12,y+46,text,max,13,C.muted,18);

/* ---------------- Lesson: Weber’s law (1834) ---------------- */
const D1_LV=[20,15,11,8,6,4.5,3,2,1.5],D1_STDS=[80,140,200];
function D1_wbTrial(s){D1_next(s);const r=rng(s.seed);s.top=r()<.5;s.ja=Math.round(r()*60);s.jb=Math.round(r()*60);return s}
const D1_wbEst=st=>st.hist.length>=6?D1_mean(st.hist.slice(-6)):null;
const D1_wbFresh=()=>({li:0,streak:0,hist:[]});
SCENE({id:'weber-law',name:'Weber’s law',tag:'Be the participant',
 definition:'Weber’s law says the smallest change you can notice, the just-noticeable difference (JND), is a fixed fraction of the amount you start with: ΔI = k · I. The fraction k is the Weber fraction.',
 example:'If you can just tell 100 g from 102 g, you will need about 204 g to tell a difference from 200 g. The step doubles with the weight; the fraction, 2%, stays the same.',
 research:'Weber, E. H. (1834). De pulsu, resorptione, auditu et tactu (lifted weights and line lengths). Levitt, H. (1971). Transformed up-down methods in psychoacoustics. JASA 49 (the 2-down 1-up staircase used here). Weber’s law holds well in the middle range of intensities (replicated many times).',
 desc:'Two horizontal lines, staggered so their ends do not line up; one is longer by a percentage that shrinks as you answer correctly. A chart plots your just-noticeable difference against the standard length, beside lines for Weber fractions of 3% and 5%.',
 dur:12,hint:'Pick a standard length and say which line is longer. Two right answers in a row make the next one harder; one wrong answer makes it easier. After 6 trials your threshold appears on the chart: try all three lengths. Your answers stay on this page.',
 init:()=>D1_wbTrial({std:140,st:{80:D1_wbFresh(),140:D1_wbFresh(),200:D1_wbFresh()},seed:777,last:null}),
 watch(p){const i=Math.min(2,Math.floor(p*3)),q=p*3-i,sim=[6,5,4.5,4,3.5,4],st={};
  D1_STDS.forEach((v,j)=>{const n=j<i?6:j===i?Math.min(6,Math.floor(q*7)):0;st[v]={li:Math.min(6,n),streak:0,hist:sim.slice(0,n)}});
  const t=Math.floor(p*18);return {std:D1_STDS[i],st,top:t%2===0,ja:(t*37)%60,jb:(t*53)%60,last:t%5!==3,sim:true}},
 ui:[{choose:D1_STDS.map(v=>[v,v+' units']),label:'Standard',get:s=>s.std,act:'std'},{b:'Top is longer',act:'ans',arg:'top'},{b:'Bottom is longer',act:'ans',arg:'bottom'},{b:'Clear my data',act:'clear'}],
 on:{std(s,v){s.std=Number(v);D1_wbTrial(s)},
  ans(s,v){const st=s.st[s.std],ok=(v==='top')===s.top;st.hist.push(D1_LV[st.li]);if(ok){if(++st.streak>=2){st.li=Math.min(D1_LV.length-1,st.li+1);st.streak=0}}else{st.li=Math.max(0,st.li-1);st.streak=0}s.last=ok;D1_wbTrial(s)},
  clear(s){D1_STDS.forEach(v=>s.st[v]=D1_wbFresh());s.last=null;D1_wbTrial(s)}},
 draw(s,f,X){
  const st=s.st[s.std],pct=D1_LV[st.li],long=s.std*(1+pct/100),lt=s.top?long:s.std,lb=s.top?s.std:long;
  let out=heading('Which line is longer?');
  out+=R(20,52,340,150,'#fff',C.grid,10)+L(40+s.ja,100,40+s.ja+lt,100,C.ink,5)+L(40+s.jb,156,40+s.jb+lb,156,C.ink,5);
  out+=TF(30,234,`Standard ${s.std} units · difference now ${pct}%`,14,C.ink,'start');
  out+=TF(30,258,`Trials at this length: ${st.hist.length}`,13,C.muted,'start');
  if(s.last!==null)out+=TF(30,282,s.last?'Last answer: right':'Last answer: wrong',13,s.last?C.green:C.coral,'start');
  if(s.sim)out+=TF(30,306,'Simulated participant (Watch mode)',13,C.purple,'start');
  const pl=D1_plot(410,70,170,200,0,240,0,16,'standard length','JND (units)',[0,80,160,240],[0,4,8,12,16]);out+=pl.svg;
  out+=L(pl.px(0),pl.py(0),pl.px(240),pl.py(240*.05),C.line,1.5,'stroke-dasharray="5 4"')+L(pl.px(0),pl.py(0),pl.px(240),pl.py(240*.03),C.line,1.5,'stroke-dasharray="5 4"');
  out+=TF(pl.px(236),pl.py(12)-6,'5%',13,C.muted,'end')+TF(pl.px(236),pl.py(7.2)+18,'3%',13,C.muted,'end');
  let n=0,ks=[];
  D1_STDS.forEach(v=>{const e=D1_wbEst(s.st[v]);if(e!==null){n++;ks.push(e);out+=Ci(pl.px(v),pl.py(e*v/100),6,X.try?C.coral:C.blue,'#fff')}});
  return {svg:out,phase:n>=2?`Your thresholds are about ${ks.map(k=>k.toFixed(1)+'%').join(', ')} of the standard. If they stay roughly the same percentage while the standard grows, the dots fall on a line through zero: Weber’s law.`:n===1?`One threshold so far: about ${ks[0].toFixed(1)}% of the standard. Try another length: Weber’s law predicts the same percentage.`:'The difference needed to notice a change grows with the size of the standard; the ratio stays roughly fixed. That ratio is the Weber fraction.'};
 }});

const D1_WF=[
 {n:'Pitch (1 kHz tone)',k:.003,u:'Hz',min:200,max:2000},
 {n:'Lifted weight',k:.02,u:'g',min:50,max:1000},
 {n:'Line length',k:.03,u:'mm',min:10,max:300},
 {n:'Brightness',k:.08,u:'cd/m²',min:10,max:1000},
 {n:'Loudness (intensity)',k:.1,u:'units',min:1,max:100},
 {n:'Saltiness',k:.2,u:'g/l',min:1,max:50}];
const D1_wfVal=(d,pos)=>d.min*Math.pow(d.max/d.min,pos/100);
const D1_round=v=>v>=100?Math.round(v):v>=10?Math.round(v*10)/10:Math.round(v*100)/100;
SCENE({id:'weber-law-fractions',name:'Weber fractions across the senses',tag:'Some senses are finer than others',
 definition:'Each sense has its own Weber fraction. A small fraction means fine discrimination: you notice a tiny proportional change. A large one means you need a big change before you notice.',
 example:'Trained listeners notice a 0.3% change in the pitch of a 1 kHz tone (about 3 Hz), but you may need about 20% more salt before soup tastes saltier.',
 research:'Weber, E. H. (1834). De tactu. Teghtsoonian, R. (1971). On the exponents in Stevens’s law and the constant in Ekman’s law. Psychological Review 78(1), 71–80. The values shown are approximate textbook figures: they vary with method, range and person.',
 desc:'Left, a standard and the smallest noticeably larger value for the chosen sense, drawn as two bars. Right, the Weber fraction of six senses as bars, from pitch (smallest) to saltiness (largest).',
 dur:12,hint:'Choose a sense (or press its bar) and move the standard. The step you need grows with the standard, but its percentage stays fixed.',
 init:()=>({i:2,pos:50}),
 watch(p){const i=Math.min(5,Math.floor(p*6));return {i,pos:Math.round(20+60*((p*6)%1))}},
 ui:[{choose:D1_WF.map((d,i)=>[i,d.n]),label:'Sense',get:s=>s.i,act:'i'},{range:'pos',label:'Standard',min:0,max:100,get:s=>s.pos,act:'pos',show:v=>''}],
 on:{i(s,v){s.i=Number(v)},pos(s,v){s.pos=Number(v)}},
 draw(s,f,X){
  const d=D1_WF[s.i],v=D1_wfVal(d,s.pos),j=v*(1+d.k),w=280*s.pos/100+20;
  let out=heading(d.n+': Weber fraction about '+(d.k*100)+'%');
  out+=TF(30,78,'standard',13,C.muted,'start')+R(30,86,w,26,C.pale,C.blue,4)+TF(30,140,'just noticeably more',13,C.muted,'start')+R(30,148,w,26,C.pale,C.blue,4)+R(30+w,148,Math.max(2,w*d.k),26,C.coral,'none',2);
  out+=TBF(30,212,`${D1_round(v)} ${d.u}`,20,C.ink,'start')+TF(30,236,'needs about',13,C.muted,'start')+TBF(30,264,`${D1_round(j)} ${d.u}`,20,C.coral,'start');
  out+=TF(30,290,`a step of ${D1_round(j-v)} ${d.u} (${d.k*100}% of the standard)`,13,C.muted,'start');
  out+=TBF(380,66,'Weber fraction k',14,C.ink,'start');
  D1_WF.forEach((e,i)=>{const y=86+i*42,sel=i===s.i,inner=R(374,y-4,212,38,sel?C.pale:'#fff',sel?C.blue:C.grid,6)+TF(382,y+12,e.n,13,C.ink,'start')+R(382,y+18,Math.max(2,e.k/.2*150),9,sel?C.blue:C.line,'none',2)+TF(382+Math.max(2,e.k/.2*150)+6,y+27,(e.k*100)+'%',13,C.muted,'start');out+=hit(X,'i',i,`${e.n}, ${e.k*100}%`,inner)});
  out+=TF(300,366,'Approximate values; they depend on method and range.',13,C.muted);
  return {svg:out,phase:`At ${D1_round(v)} ${d.u} the step you can just notice is about ${D1_round(j-v)} ${d.u}. Double the standard and the step doubles too: the fraction, ${d.k*100}%, is what stays put.`};
 }});

// Weber fraction against level: rises near threshold; for pure tones it slowly falls (the near miss).
function D1_wfLevel(mode,db){const near=Math.pow(10,-db/10);return mode==='noise'?.1+near:.35*Math.pow(10,-.007*db)+near}
SCENE({id:'weber-law-limits',name:'Where Weber’s law bends',tag:'A good law in the middle range',
 definition:'Weber’s law fails near the threshold of detection, where the fraction you need grows sharply. For pure tones it also drifts: discrimination gets slowly better as the tone gets louder, a deviation called the near miss to Weber’s law.',
 example:'A sound just above threshold may need doubling to sound louder, yet in the middle range a 10% change in white-noise intensity is enough.',
 research:'Miller, G. A. (1947). Sensitivity to changes in the intensity of white noise and its relation to masking and loudness. JASA 19, 609–619. McGill, W. J. & Goldberg, J. P. (1968). A study of the near-miss involving Weber’s law and pure-tone intensity discrimination. Perception & Psychophysics 4, 105–109. The curves here are schematic.',
 desc:'A chart of the Weber fraction against level above threshold in decibels, for white noise (flat in the middle) or a pure tone (slowly falling), with the current level marked.',
 dur:10,hint:'Move the level and compare white noise with a pure tone. Near threshold, both need large changes.',
 init:()=>({mode:'noise',db:40}),
 watch(p){return {mode:p<.5?'noise':'tone',db:Math.round(2+96*((p*2)%1))}},
 ui:[{choose:[['noise','White noise'],['tone','Pure tone']],label:'Sound',get:s=>s.mode,act:'mode'},{range:'db',label:'Level above threshold',min:0,max:100,step:1,get:s=>s.db,act:'db',show:v=>v+' dB'}],
 on:{mode(s,v){s.mode=v},db(s,v){s.db=Number(v)}},
 draw(s,f,X){
  let out=heading('The Weber fraction across the range of levels');
  const pl=D1_plot(80,70,330,230,0,100,0,.6,'level above threshold (dB)','Weber fraction ΔI / I',[0,20,40,60,80,100],[0,.2,.4,.6],v=>v,v=>v.toFixed(1));out+=pl.svg;
  for(const m of ['noise','tone']){let d='';for(let x=0;x<=100;x+=1){const y=Math.min(.6,D1_wfLevel(m,x));d+=(x?'L':'M')+fmt(pl.px(x))+' '+fmt(pl.py(y))}out+=P(d,m===s.mode?C.blue:C.line,m===s.mode?3:1.6)}
  const y=D1_wfLevel(s.mode,s.db);out+=Ci(pl.px(s.db),pl.py(Math.min(.6,y)),7,C.coral,'#fff');
  out+=R(80,70,pl.px(12)-80,230,C.coralp,'none',6,'opacity=".45"')+TF(pl.px(12)+6,292,'← near threshold',13,C.coral,'start');
  const zone=s.db<12?'Near threshold':s.mode==='noise'?'Weber holds':'The near miss';
  const txt=s.db<12?'Close to the threshold the fraction shoots up: you need a large proportional change to notice anything.':s.mode==='noise'?'For white noise the fraction is close to flat from about 20 dB up, as Weber’s law says.':'For a pure tone the fraction keeps falling slowly with level: discrimination gets finer the louder the tone.';
  out+=D1_note(432,70,156,230,zone,txt,20);
  out+=TF(250,368,`At ${s.db} dB: Weber fraction ${y.toFixed(2)}`,14,C.ink);
  return {svg:out,phase:'Weber’s law is a good description in the middle of the range, not a law of nature everywhere. Its failures near threshold were part of what led to signal detection theory.'};
 }});

/* ---------------- Lesson: Fechner’s scaling (1860) ---------------- */
SCENE({id:'fechner-scaling',name:'Fechner’s law',tag:'Count the just-noticeable steps',
 definition:'Gustav Fechner assumed that every just-noticeable difference is an equal step in sensation. Adding up JNDs, each a fixed fraction bigger than the last, gives a logarithm: sensation S = c · log(I / I₀).',
 example:'With a Weber fraction of 20%, each step multiplies the intensity by 1.2. Ten steps multiply it by about 6.2; twenty steps by about 38. Sensation climbs evenly while intensity races ahead.',
 research:'Fechner, G. T. (1860). Elemente der Psychophysik. Leipzig: Breitkopf & Härtel. The equal-JND assumption was questioned from the start and later challenged by Stevens (1957).',
 desc:'A chart of sensation (counted in JNDs) against intensity: a staircase of equal-height steps whose widths grow geometrically, following a logarithmic curve.',
 dur:10,hint:'Add steps and change the Weber fraction. Each step is the same height (one JND) but wider than the one before.',
 init:()=>({n:10,k:.2}),
 watch(p){return {n:Math.round(16*smooth(Math.min(1,p*1.2))),k:.2}},
 ui:[{range:'n',label:'JND steps',min:0,max:16,step:1,get:s=>s.n,act:'n'},{choose:[[.1,'k = 10%'],[.2,'k = 20%'],[.3,'k = 30%']],label:'Weber fraction',get:s=>s.k,act:'k'}],
 on:{n(s,v){s.n=Number(v)},k(s,v){s.k=Number(v)}},
 draw(s,f,X){
  const imax=Math.pow(1+s.k,16),pl=D1_plot(70,60,320,240,1,imax,0,16,'intensity (×  starting value)','sensation (JNDs)',[1,Math.round(imax/2),Math.round(imax)],[0,4,8,12,16]);
  let out=heading('Equal steps in sensation, growing steps in intensity')+pl.svg;
  let d='';for(let j=0;j<=200;j++){const I=1+(imax-1)*j/200;d+=(j?'L':'M')+fmt(pl.px(I))+' '+fmt(pl.py(Math.log(I)/Math.log(1+s.k)))}out+=P(d,C.line,2,'none','stroke-dasharray="5 4"');
  let st='M'+fmt(pl.px(1))+' '+fmt(pl.py(0));for(let j=1;j<=s.n;j++){const I=Math.pow(1+s.k,j);st+='H'+fmt(pl.px(I))+'V'+fmt(pl.py(j))}out+=P(st,C.blue,3);
  const In=Math.pow(1+s.k,s.n);if(s.n)out+=Ci(pl.px(In),pl.py(s.n),6,C.coral,'#fff');
  out+=R(414,60,172,240,'#fff',C.grid,10)+TF(426,86,'after',13,C.muted,'start')+TBF(426,112,`${s.n} JNDs`,20,C.blue,'start')+TF(426,140,'intensity is',13,C.muted,'start')+TBF(426,168,`× ${In<100?In.toFixed(1):Math.round(In)}`,20,C.coral,'start');
  out+=TF(426,198,`= (1 + ${s.k})^${s.n}`,13,C.muted,'start')+D1_para(426,228,'Sensation grows with the logarithm of intensity.',20,13,C.ink,18);
  return {svg:out,phase:`Each step is one JND high but ${Math.round(s.k*100)}% wider than the last. Stack them and the staircase follows a logarithm: Fechner’s law.`};
 }});

const D1_STEV=[['Brightness',.33],['Loudness',.67],['Line length',1],['Heaviness',1.45],['Electric shock',3.5]];
SCENE({id:'fechner-scaling-stevens',name:'Stevens’ power law',tag:'Ask people for numbers',
 definition:'S. S. Stevens asked people to give numbers to how strong things felt. The results followed power functions, ψ = k · Iⁿ, with an exponent n that differs by sense: below 1 the sensation grows slower than the stimulus, above 1 faster.',
 example:'Doubling a light’s intensity makes it look only about 1.26 times as bright (2^0.33), but doubling the current of an electric shock makes it feel about 11 times as strong (2^3.5).',
 research:'Stevens, S. S. (1957). On the psychophysical law. Psychological Review 64(3), 153–181. Stevens, S. S. (1975). Psychophysics. Wiley. Exponents vary with conditions; the values shown are Stevens’ typical ones.',
 desc:'Power curves for five senses on linear axes, or straight lines on log–log axes whose slope is the exponent, with the chosen sense highlighted.',
 dur:10,hint:'Pick a sense and switch between linear and log–log axes. On log–log axes every power law is a straight line, and its slope is the exponent.',
 init:()=>({i:1,log:false}),
 watch(p){return {i:Math.min(4,Math.floor(p*5)),log:p>.5}},
 ui:[{choose:D1_STEV.map((d,i)=>[i,d[0]]),label:'Sense',get:s=>s.i,act:'i'},{choose:[['lin','Linear axes'],['log','Log–log axes']],label:'Axes',get:s=>s.log?'log':'lin',act:'log'}],
 on:{i(s,v){s.i=Number(v)},log(s,v){s.log=v==='log'}},
 draw(s,f,X){
  let out=heading(s.log?'Log–log axes: straight lines, slope = exponent':'Sensation against stimulus');
  const pl=s.log?D1_plot(70,60,300,250,-1,1,-2,2,'stimulus (log₁₀, 1 = reference)','sensation (log₁₀)',[-1,0,1],[-2,-1,0,1,2]):D1_plot(70,60,300,250,0,4,0,4,'stimulus (× reference)','sensation (× reference)',[0,1,2,3,4],[0,1,2,3,4]);out+=pl.svg;
  D1_STEV.forEach(([n,e],i)=>{let d='',started=false;for(let j=0;j<=120;j++){let x,y;if(s.log){x=-1+2*j/120;y=e*x}else{x=4*j/120;y=Math.pow(x,e)}if(s.log?(y<-2||y>2):y>4){started=false;continue}d+=(started?'L':'M')+fmt(pl.px(x))+' '+fmt(pl.py(y));started=true}out+=P(d,i===s.i?C.blue:C.line,i===s.i?3.2:1.6)});
  const [nm,e]=D1_STEV[s.i];
  out+=R(392,60,194,250,'#fff',C.grid,10)+TBF(404,86,nm,15,C.ink,'start')+TF(404,112,'exponent n',13,C.muted,'start')+TBF(404,140,String(e),22,C.blue,'start');
  out+=TF(404,170,'double the stimulus:',13,C.muted,'start')+TBF(404,196,`sensation × ${Math.pow(2,e).toFixed(2)}`,16,C.coral,'start');
  out+=D1_para(404,226,e<1?'Compressive: big changes feel small.':e>1?'Expansive: small changes feel big.':'Linear: twice as long looks twice as long.',22,13,C.ink,18);
  return {svg:out,phase:`${nm}: ψ ∝ I^${e}. Fechner’s logarithm and Stevens’ power law both compress most senses, but Stevens found some, like shock, that expand.`};
 }});

const D1_ME_R=[.25,.5,1,2,4,8];
function D1_meNew(seed){return {order:shuffled(D1_ME_R.concat(D1_ME_R),seed),i:0,est:10,data:[],seed}}
SCENE({id:'fechner-scaling-estimate',name:'Magnitude estimation',tag:'Be the participant',
 definition:'In magnitude estimation you are shown a standard with a number (here 10) and give each new stimulus a number in proportion to how large it seems. Plotted on log–log axes, the answers fall near a straight line whose slope is your exponent.',
 example:'If a circle with 4 times the area looks only about 2.6 times as big, you are compressing area with an exponent of about 0.7, close to Stevens’ value.',
 research:'Stevens, S. S. (1957). On the psychophysical law. Psychological Review 64(3). Stevens, S. S. & Guirao, M. (1963). Subjective scaling of length and area and the matching of length to loudness and brightness. Journal of Experimental Psychology 66(2). Area exponents near 0.7–0.8 have been found repeatedly.',
 desc:'A standard circle labelled 10 beside a test circle; a log–log chart of your estimates against true area, with your fitted line and Stevens’ line of slope 0.7.',
 dur:12,hint:'Set a number for the test circle, where the left circle is 10, then press Submit. Twelve circles in shuffled order; then compare your exponent with Stevens’. Your answers stay on this page.',
 init:()=>D1_meNew(1957),
 watch(p){const r=rng(5),s=D1_meNew(1957),n=Math.min(12,Math.floor(p*13));for(let j=0;j<n;j++)s.data.push([s.order[j],Math.max(1,Math.round(10*Math.pow(s.order[j],.7)*(.85+.3*r())))]);s.i=n;s.sim=true;return s},
 ui:[{range:'est',label:'Your number',min:1,max:100,step:1,get:s=>s.est,act:'est'},{b:'Submit',act:'go'},{b:'Start again',act:'again'}],
 on:{est(s,v){s.est=Number(v)},go(s){if(s.i>=s.order.length)return;s.data.push([s.order[s.i],s.est]);s.i++},again(s){Object.assign(s,D1_meNew(nextSeed()))}},
 draw(s,f,X){
  const done=s.i>=s.order.length,ratio=done?1:s.order[s.i];
  let out=heading(done?'Your area exponent':`Circle ${s.i+1} of ${s.order.length}: how big, if the left one is 10?`);
  out+=R(20,52,350,240,'#fff',C.grid,10)+Ci(90,170,24,C.pale,C.blue)+TBF(90,176,'10',15,C.blue);
  if(!done)out+=Ci(255,170,24*Math.sqrt(ratio),C.coralp,C.coral);else out+=TF(255,176,'All twelve done',14,C.muted);
  out+=TF(195,280,X.try?`your number: ${s.est}`:'simulated participant',14,X.try?C.ink:C.purple);
  const pl=D1_plot(420,70,160,200,-2,3,0,7,'true area (log₂)','estimate (log₂)',[-2,0,3],[0,2,4,6]);out+=pl.svg;
  out+=L(pl.px(-2),pl.py(Math.log2(10)-1.4),pl.px(3),pl.py(Math.log2(10)+2.1),C.green,2,'stroke-dasharray="6 4"');
  const pts=s.data.map(([r,e])=>[Math.log2(r),Math.log2(e)]);for(const [x,y] of pts)out+=Ci(pl.px(x),pl.py(y),4.5,X.try&&!s.sim?C.coral:C.blue,'#fff');
  const fit=D1_fit(pts);if(fit&&pts.length>=4)out+=L(pl.px(-2),pl.py(fit.a-2*fit.b),pl.px(3),pl.py(fit.a+3*fit.b),C.coral,2.4);
  out+=TF(420,340,'dashed: Stevens, slope 0.7',13,C.green,'start')+(fit&&pts.length>=4?TF(420,360,`yours: slope ${fit.b.toFixed(2)}`,13,C.coral,'start'):'');
  return {svg:out,phase:fit&&pts.length>=4?`Your exponent for area is about ${fit.b.toFixed(2)}. Below 1 means bigger circles seem less big than their area says; Stevens found about 0.7.`:'Give each circle a number in proportion to its apparent size. Most people compress: a circle 8 times the area rarely gets a number 8 times as big.'};
 }});

/* ---------------- Lesson: Reaction time (1850–) ---------------- */
SCENE({id:'reaction-time',name:'Simple reaction time',tag:'Be the participant',
 definition:'Simple reaction time is the time from a signal to a response when there is only one signal and one response. It is never zero: sensing, deciding and moving all take time.',
 example:'Press as soon as the lamp lights. Most young adults take about 180–220 ms in the lab, and react to a sound some 30–40 ms faster than to a light.',
 research:'Luce, R. D. (1986). Response Times. Oxford University Press. Woods, D. L., et al. (2015). Factors influencing the latency of simple reaction time. Frontiers in Human Neuroscience 9, 131. Robust; a computer’s screen, sound card and keyboard add tens of milliseconds.',
 desc:'A lamp (or a speaker) and a large response pad; a strip chart of your reaction times for light and for sound, with each mean and the typical laboratory range.',
 dur:12,hint:'Choose light or sound, press Start, then press Now! (or the pad, or Space on the focused button) as soon as the signal comes. Pressing before it counts as a false start. Your times stay on this page.',
 init:()=>({mod:'light',phase:'idle',t0:0,rts:{light:[],tone:[]},early:0,seed:99,tid:0,last:null}),
 watch(p){const nL=Math.min(10,Math.floor(p*20)),nT=Math.max(0,Math.min(10,Math.floor(p*20)-10)),k=Math.floor(p*40)%4;return {mod:p<.5?'light':'tone',phase:k===2?'go':k===1?'wait':'idle',rts:{light:D1_simRT(3,nL,200,40,25),tone:D1_simRT(4,nT,165,35,22)},early:0,last:null,sim:true}},
 ui:[{choose:[['light','Light'],['tone','Sound']],label:'Signal',get:s=>s.mod,act:'mod'},{b:'Start',act:'start'},{b:'Now!',act:'now',arg:'btn'},{b:'Clear my times',act:'clear'}],
 on:{mod(s,v){s.mod=v;s.phase='idle';s.tid++},
  start(s,a,ctx){if(s.phase!=='idle')return;D1_next(s);const d=1000+Math.floor(rng(s.seed)()*2000);s.tid++;s.phase='wait';s.last=null;ctx.later(d,'fire',s.tid)},
  fire(s,id){if(Number(id)!==s.tid||s.phase!=='wait')return;s.phase='go';s.t0=performance.now();if(s.mod==='tone')AUDIO.tone(880,{dur:.3})},
  now(s){if(s.phase==='wait'){s.early++;s.phase='idle';s.tid++;s.last='early';return}if(s.phase!=='go')return;const rt=performance.now()-s.t0;s.phase='idle';if(rt<100){s.early++;s.last='early';return}if(rt<1500){s.rts[s.mod].push(rt);s.last=rt}else s.last='slow'},
  clear(s){s.rts={light:[],tone:[]};s.early=0;s.last=null;s.phase='idle';s.tid++}},
 draw(s,f,X){
  const go=s.phase==='go';let out=heading(s.phase==='wait'?'Wait for it…':go?'Now!':'Press Start, then respond to the signal');
  if(s.mod==='light')out+=Ci(150,120,46,go?'#ffd24a':'#eef2f4',go?'#c79100':C.line)+(go?Ci(150,120,60,'none','#ffd24a','opacity=".5"'):'');
  else{out+=P('M118 104h18l24-20v72l-24-20h-18z',go?C.ink:C.line,2.5,go?'#ffd24a':'#eef2f4');if(go)out+=P('M172 100q12 20 0 40M184 90q22 30 0 60',C.ink,2.5)}
  out+=hit(X,'now','pad','Response pad: press when the signal appears',R(50,196,200,80,go?C.greenp:'#f4f7f9',go?C.green:C.line,14)+TBF(150,242,'press here',16,go?C.green:C.muted));
  const msg=s.last==='early'?'False start: wait for the signal':s.last==='slow'?'Too slow, not counted':typeof s.last==='number'?`${D1_ms(s.last)}`:s.sim?'Simulated participant':'';
  if(msg)out+=TBF(150,310,msg,15,s.last==='early'||s.last==='slow'?C.coral:s.sim?C.purple:C.ink);
  out+=TF(150,336,`false starts: ${s.early}`,13,C.muted);
  const pl=D1_plot(350,60,230,250,0,2,100,500,'','reaction time (ms)',[],[100,200,300,400,500]);out+=pl.svg;
  const band=[['light',.5,180,220],['tone',1.5,140,180]];
  for(const [m,x,a,b] of band){out+=R(pl.px(x)-40,pl.py(b),80,pl.py(a)-pl.py(b),C.greenp,'none',4);out+=TF(pl.px(x),336,m==='light'?'light':'sound',13,C.muted);
   const d=s.rts[m];d.forEach((v,j)=>{out+=Ci(pl.px(x)+((j*7)%30-15),pl.py(clamp(v,100,500)),4,X.try&&!s.sim?C.coral:C.blue,'#fff','opacity=".85"')});
   if(d.length){const m2=D1_mean(d);out+=L(pl.px(x)-34,pl.py(m2),pl.px(x)+34,pl.py(m2),C.ink,3)+TF(pl.px(x)+38,pl.py(m2)+5,Math.round(m2),13,C.ink,'start')}}
  out+=TF(465,362,'green: typical lab range',13,C.green);
  const mL=D1_mean(s.rts.light),mT=D1_mean(s.rts.tone);
  return {svg:out,phase:s.rts.light.length&&s.rts.tone.length?`Your means: light ${D1_ms(mL)}, sound ${D1_ms(mT)}. In the lab sound usually wins by 30–40 ms; your computer adds its own delays to both.`:'Even the simplest response takes about a fifth of a second. Measuring it opened the mind to the stopwatch.'};
 }});

const D1_NERVE={frog:{v:27,n:'Frog sciatic nerve (Helmholtz 1850)'},human:{v:60,n:'Human motor nerve (modern value)'}};
const D1_twitch=(t,on)=>t<on?0:((t-on)/6)*Math.exp(1-(t-on)/6);
SCENE({id:'reaction-time-nerve',name:'The speed of a nerve',tag:'Helmholtz times a frog’s nerve',
 definition:'In 1850 Hermann von Helmholtz stimulated a frog’s nerve at two points at different distances from its muscle. The farther point made the muscle twitch later; dividing the extra distance by the extra time gave the conduction speed.',
 example:'Stimulating 40 mm farther along delays the twitch by about 1.5 ms: 40 mm ÷ 1.5 ms ≈ 27 m/s. Nerves are fast, but not instantaneous, so thinking takes time.',
 research:'Helmholtz, H. von (1850). Messungen über den zeitlichen Verlauf der Zuckung animalischer Muskeln und die Fortpflanzungsgeschwindigkeit der Reizung in den Nerven. Archiv für Anatomie, Physiologie und wissenschaftliche Medicin. His teacher Johannes Müller had doubted it could ever be measured.',
 desc:'A nerve leading to a muscle with two stimulation points, and below it two twitch traces on a millisecond scale; the second starts later by the extra distance divided by the speed.',
 dur:10,hint:'Change the distance between the two stimulation points and the kind of nerve. The delay between the traces gives the speed.',
 init:()=>({d:40,sp:'frog'}),
 watch(p){return {d:Math.round(10+50*smooth(p<.5?p*2:2-p*2)),sp:p<.5?'frog':'human'}},
 ui:[{range:'d',label:'Extra distance',min:10,max:60,step:5,get:s=>s.d,act:'d',show:v=>v+' mm'},{choose:[['frog','Frog'],['human','Human']],label:'Nerve',get:s=>s.sp,act:'sp'}],
 on:{d(s,v){s.d=Number(v)},sp(s,v){s.sp=v}},
 draw(s,f,X){
  const N=D1_NERVE[s.sp],dt=s.d/N.v,mx=420,near=mx-30,far=near-s.d*4;
  let out=heading(N.n);
  out+=P(`M${fmt(far-40)} 90 C${fmt(far+60)} 80 ${fmt(near-60)} 100 ${mx-10} 92`,C.amber,4)+`<ellipse cx="${mx+40}" cy="92" rx="52" ry="26" fill="${C.coralp}" stroke="${C.coral}" stroke-width="2"/>`+TF(mx+40,97,'muscle',13,C.coral);
  out+=Ci(near,92,7,C.blue)+TF(near,72,'near',13,C.blue)+Ci(far,90,7,C.purple)+TF(far,70,'far',13,C.purple);
  out+=L(far,118,near,118,C.muted,1.5)+L(far,112,far,124,C.muted,1.5)+L(near,112,near,124,C.muted,1.5)+TF((far+near)/2,140,s.d+' mm',13,C.muted);
  const pl=D1_plot(70,170,420,140,0,20,0,1.1,'time after the shock (ms)','',[0,5,10,15,20],[]);out+=pl.svg;
  for(const [on,col] of [[3,C.blue],[3+dt,C.purple]]){let d='';for(let t=0;t<=20;t+=.1)d+=(t?'L':'M')+fmt(pl.px(t))+' '+fmt(pl.py(D1_twitch(t,on)));out+=P(d,col,2.6)}
  out+=L(pl.px(3),pl.py(.95),pl.px(3+dt),pl.py(.95),C.coral,2);
  out+=R(506,170,82,140,'#fff',C.grid,8)+TF(547,192,'delay',13,C.muted)+TBF(547,214,`${dt.toFixed(2)} ms`,14,C.coral)+TF(547,244,'speed',13,C.muted)+TBF(547,270,`${N.v}`,20,C.ink)+TF(547,292,'m/s',13,C.muted);
  return {svg:out,phase:`${s.d} mm ÷ ${dt.toFixed(2)} ms = ${N.v} m/s. The twitch itself is slow; only the difference in its start matters, so the muscle’s own delay cancels out.`};
 }});

function D1_exg(x,mu,sg,tau){return Math.exp((mu-x)/tau+sg*sg/(2*tau*tau))*D1_Phi((x-mu)/sg-sg/tau)/tau}
SCENE({id:'reaction-time-distribution',name:'The shape of reaction times',tag:'Slow tails, not bell curves',
 definition:'Reaction times are skewed: most are close together, but a long tail of slow responses stretches to the right. An ex-Gaussian, a bell curve (μ, σ) plus an exponential tail (τ), describes them well.',
 example:'With μ = 350, σ = 40 and τ = 100 ms, the median is about 420 ms but the mean is 450 ms: a few slow trials pull the mean right. That is why reaction-time studies often report medians or fit the whole shape.',
 research:'Ratcliff, R. (1979). Group reaction time distributions and an analysis of distribution statistics. Psychological Bulletin 86(3), 446–461. Luce, R. D. (1986). Response Times. Whelan, R. (2008). Effective analysis of reaction time data. The Psychological Record 58, 475–482.',
 desc:'An ex-Gaussian curve of reaction times with markers for the mode, median and mean, which separate as the exponential tail grows.',
 dur:10,hint:'Grow the tail (τ) and watch the mean move away from the median and mode.',
 init:()=>({mu:350,sg:40,tau:100}),
 watch(p){return {mu:350,sg:40,tau:Math.round(10+250*smooth(p))}},
 ui:[{range:'mu',label:'μ (bell centre)',min:250,max:600,step:10,get:s=>s.mu,act:'mu',show:v=>v+' ms'},{range:'sg',label:'σ (bell spread)',min:20,max:120,step:5,get:s=>s.sg,act:'sg',show:v=>v+' ms'},{range:'tau',label:'τ (slow tail)',min:10,max:300,step:10,get:s=>s.tau,act:'tau',show:v=>v+' ms'}],
 on:{mu(s,v){s.mu=Number(v)},sg(s,v){s.sg=Number(v)},tau(s,v){s.tau=Number(v)}},
 draw(s,f,X){
  const xs=range(241).map(i=>i*5),ys=xs.map(x=>D1_exg(x,s.mu,s.sg,s.tau)),ymax=Math.max(...ys)*1.15;
  let cum=0,tot=sum(ys),med=0;for(let i=0;i<xs.length;i++){cum+=ys[i];if(cum>=tot/2){med=xs[i];break}}
  const mode=xs[ys.indexOf(Math.max(...ys))],mean=s.mu+s.tau;
  let out=heading('Reaction times have a long right tail');
  const pl=D1_plot(50,70,500,220,0,1200,0,ymax,'reaction time (ms)','',[0,200,400,600,800,1000,1200],[]);out+=pl.svg;
  let d='M'+fmt(pl.px(0))+' '+fmt(pl.py(0));xs.forEach((x,i)=>d+='L'+fmt(pl.px(x))+' '+fmt(pl.py(ys[i])));d+='L'+fmt(pl.px(1200))+' '+fmt(pl.py(0))+'Z';out+=P(d,C.blue,2.5,C.pale);
  const mk=[[mode,'mode',C.green,0],[med,'median',C.purple,1],[mean,'mean',C.coral,2]];
  for(const [v,n,c,j] of mk){out+=L(pl.px(v),pl.py(0),pl.px(v),pl.py(ymax*.92),c,2.2);out+=L(452,92+j*20,470,92+j*20,c,3)+TF(476,97+j*20,`${n} ${Math.round(v)} ms`,13,c,'start')}
  return {svg:out,phase:`Mode ${Math.round(mode)}, median ${Math.round(med)}, mean ${Math.round(mean)} ms. The tail τ moves the mean by its full size but the median by less: slow lapses mostly hurt the mean.`};
 }});

/* ---------------- Lesson: Mental chronometry (Donders, 1868) ---------------- */
const D1_DON={a:{n:'a-task: one signal, one response',t:'A red light always comes. Press either key.'},b:{n:'b-task: two signals, two responses',t:'Red: press Left. Green: press Right.'},c:{n:'c-task: respond to one, ignore the other',t:'Red: press either key. Green: do nothing.'}};
SCENE({id:'mental-chronometry',name:'Donders’ subtraction method',tag:'Be the participant',
 definition:'F. C. Donders compared three tasks. The a-task needs only detection; the c-task adds identifying the signal; the b-task adds choosing between responses. Subtracting their times should give the duration of each added mental stage.',
 example:'If a = 220 ms, c = 290 ms and b = 350 ms, then identifying took about 70 ms (c − a) and choosing the response about 60 ms (b − c).',
 research:'Donders, F. C. (1868). Over de snelheid van psychische processen. Translated by W. G. Koster (1969): On the speed of mental processes. Acta Psychologica 30, 412–431. The three-task pattern a < c < b replicates; the clean subtraction is debated (see next scene).',
 desc:'A signal light with Left and Right keys, and a bar chart of your mean times for the a, c and b tasks with the two differences marked.',
 dur:13,hint:'Choose a task, press Start and respond to the light as the task asks. Do about five trials of each, then read off the differences. Your times stay on this page.',
 init:()=>({task:'a',phase:'idle',stim:'red',t0:0,rts:{a:[],b:[],c:[]},err:0,seed:31,tid:0,msg:''}),
 watch(p){const n=Math.floor(p*15),ts=['a','c','b'],task=ts[Math.min(2,Math.floor(p*3))],k=Math.floor(p*45)%3;return {task,phase:k===1?'go':'idle',stim:Math.floor(p*45)%2?'red':'green',rts:{a:D1_simRT(7,Math.min(5,n),210,40,20),c:D1_simRT(8,Math.max(0,Math.min(5,n-5)),280,50,25),b:D1_simRT(9,Math.max(0,n-10),340,50,30)},err:0,msg:'Simulated participant',sim:true}},
 ui:[{choose:[['a','a-task'],['c','c-task'],['b','b-task']],label:'Task',get:s=>s.task,act:'task'},{b:'Start',act:'start'},{b:'Left',act:'resp',arg:'left'},{b:'Right',act:'resp',arg:'right'},{b:'Clear',act:'clear'}],
 on:{task(s,v){s.task=v;s.phase='idle';s.tid++;s.msg=''},
  start(s,a,ctx){if(s.phase!=='idle')return;D1_next(s);const r=rng(s.seed);const d=800+Math.floor(r()*1000);s.stim=s.task==='a'?'red':r()<.5?'red':'green';s.tid++;s.phase='wait';s.msg='';ctx.later(d,'fire',s.tid)},
  fire(s,id,ctx){if(Number(id)!==s.tid||s.phase!=='wait')return;s.phase='go';s.t0=performance.now();ctx.later(1500,'timeout',s.tid)},
  timeout(s,id){if(Number(id)!==s.tid||s.phase!=='go')return;s.phase='idle';if(s.task==='c'&&s.stim==='green')s.msg='Right: you held back';else{s.err++;s.msg='Too slow'}},
  resp(s,side){if(s.phase==='wait'){s.err++;s.phase='idle';s.tid++;s.msg='Too early';return}if(s.phase!=='go')return;const rt=performance.now()-s.t0;s.phase='idle';s.tid++;
   const ok=s.task==='a'?true:s.task==='b'?(side==='left')===(s.stim==='red'):s.stim==='red';
   if(ok&&rt>100){s.rts[s.task].push(rt);s.msg=D1_ms(rt)}else{s.err++;s.msg=ok?'Too early':'Wrong response'}},
  clear(s){s.rts={a:[],b:[],c:[]};s.err=0;s.msg='';s.phase='idle';s.tid++}},
 draw(s,f,X){
  const go=s.phase==='go',T0=D1_DON[s.task];let out=heading(T0.n);
  out+=TF(170,62,T0.t,13,C.muted);
  const col=s.stim==='red'?'#d6453a':'#2fa36b';out+=Ci(170,130,44,go?col:'#eef2f4',go?'#00000033':C.line);
  out+=hit(X,'resp','left','Left key',R(60,200,100,56,'#f4f7f9',C.line,10)+TBF(110,234,'Left',15,C.ink))+hit(X,'resp','right','Right key',R(180,200,100,56,'#f4f7f9',C.line,10)+TBF(230,234,'Right',15,C.ink));
  if(s.msg)out+=TBF(170,292,s.msg,15,/Too|Wrong/.test(s.msg)?C.coral:s.sim?C.purple:C.ink);
  out+=TF(170,318,`errors: ${s.err}`,13,C.muted);
  const pl=D1_plot(380,60,200,240,0,3,0,500,'','mean time (ms)',[],[0,100,200,300,400,500]);out+=pl.svg;
  const ms={};['a','c','b'].forEach((t,i)=>{const d=s.rts[t];ms[t]=d.length?D1_median(d):null;const x=pl.px(i+.5);out+=TF(x,326,t+'-task',13,C.muted)+TF(x,344,`n = ${d.length}`,13,C.muted);if(ms[t]!==null){out+=R(x-22,pl.py(ms[t]),44,pl.py(0)-pl.py(ms[t]),t===s.task?C.blue:C.line,'none',4)+TF(x,pl.py(ms[t])-6,Math.round(ms[t]),13,C.ink)}});
  const diffs=(ms.a!==null&&ms.c!==null?`identify ≈ c − a = ${Math.round(ms.c-ms.a)} ms`:'')+(ms.b!==null&&ms.c!==null?` · choose ≈ b − c = ${Math.round(ms.b-ms.c)} ms`:'');
  if(diffs)out+=TF(300,370,diffs.replace(/^ · /,''),14,C.green);
  return {svg:out,phase:diffs?`Medians: ${['a','c','b'].filter(t=>ms[t]!==null).map(t=>t+' '+Math.round(ms[t])).join(', ')} ms. Donders read the differences as the time taken by each added stage.`:'Each task adds one more thing to do between signal and response. Donders timed the difference to time the thought.'};
 }});

const D1_STG=['Encode','Compare','Choose','Execute'],D1_STB=[90,60,100,80];
SCENE({id:'mental-chronometry-subtraction',name:'Stages and the additive-factor method',tag:'From subtraction to additivity',
 definition:'Donders assumed pure insertion: adding a task stage leaves the other stages unchanged. That is hard to guarantee. Saul Sternberg proposed a weaker test: if two factors slow different stages, their effects add; if they slow the same stage, they interact.',
 example:'A blurred signal slows encoding by about 60 ms; an awkward key mapping slows response selection by about 80 ms. Together they cost about 140 ms, the sum, so they act on different stages. If the sum were exceeded, they would be sharing a stage.',
 research:'Sternberg, S. (1969). The discovery of processing stages: Extensions of Donders’ method. Acta Psychologica 30, 276–315. Wundt’s Leipzig laboratory (from 1879) built on Donders’ timing, and Külpe questioned pure insertion. Additive factors remain a standard tool.',
 desc:'A chain of four stage bars whose lengths add to the reaction time, and a two-by-two interaction chart: parallel lines when the two factors act on different stages, diverging lines when they act on the same one.',
 dur:12,hint:'Turn each factor on and off and see which stage grows. Then switch to “same stage” and watch the lines stop being parallel.',
 init:()=>({a:true,b:true,same:false}),
 watch(p){const k=Math.floor(p*8);return {a:k%2===1,b:(k>>1)%2===1,same:p>.5}},
 ui:[{choose:[['diff','Different stages'],['same','Same stage']],label:'Factors act on',get:s=>s.same?'same':'diff',act:'same'},{b:'Toggle blurred signal',act:'a'},{b:'Toggle awkward keys',act:'b'}],
 on:{same(s,v){s.same=v==='same'},a(s){s.a=!s.a},b(s){s.b=!s.b}},
 draw(s,f,X){
  const rt=(a,b)=>{const st=D1_STB.slice();if(a)st[0]+=60;if(b){if(s.same)st[0]+=80;else st[2]+=80}if(a&&b&&s.same)st[0]+=60;return st};
  const st=rt(s.a,s.b),tot=sum(st);
  let out=heading('Reaction time as a chain of stages');
  let x=30;const k=1;st.forEach((v,i)=>{const w=v*k;out+=R(x,58,w-3,40,[C.pale,C.greenp,C.amberp,C.purplep][i],[C.blue,C.green,C.amber,C.purple][i],6)+TF(x+w/2,83,D1_STG[i],13,C.ink);x+=w});
  out+=TF(30,120,`total ${tot} ms`+(s.a?' · blurred signal':'')+(s.b?' · awkward keys':''),14,C.ink,'start');
  const pl=D1_plot(70,160,260,170,0,1,250,500,'signal: clear → blurred','RT (ms)',[],[300,400,500]);out+=pl.svg;
  out+=TF(pl.px(.1),348,'clear',13,C.muted)+TF(pl.px(.9),348,'blurred',13,C.muted);
  for(const [b,c] of [[false,C.blue],[true,C.coral]]){const y0=sum(rt(false,b)),y1=sum(rt(true,b));out+=L(pl.px(.1),pl.py(y0),pl.px(.9),pl.py(y1),c,3)+Ci(pl.px(.1),pl.py(y0),5,c)+Ci(pl.px(.9),pl.py(y1),5,c)}
  out+=TF(pl.px(.92)+4,pl.py(sum(rt(true,true)))+5,'awkward',13,C.coral,'start')+TF(pl.px(.92)+4,pl.py(sum(rt(true,false)))+5,'easy keys',13,C.blue,'start');
  out+=D1_note(420,160,168,180,s.same?'Interaction':'Additive',s.same?'Both factors load the same stage, so together they cost more than the sum: the lines diverge.':'The factors load different stages, so their costs simply add: the lines are parallel.',21);
  return {svg:out,phase:s.same?'Diverging lines suggest the two factors share a stage. Sternberg used this logic to map stages without Donders’ risky pure insertion.':'Parallel lines: the cost of a blurred signal is the same whatever the keys. Additivity points to separate stages.'};
 }});

const D1_SB=[1,3,5];
SCENE({id:'mental-chronometry-sternberg',name:'Scanning short-term memory',tag:'Be the participant',
 definition:'In Sternberg’s memory-scanning task you hold a short list of digits, then decide whether a probe digit was in it. Response time rises by a constant amount for each item held, as if memory were searched one item at a time.',
 example:'Sternberg found RT ≈ 397 + 38 ms × set size, for both yes and no answers, suggesting an exhaustive search through every item.',
 research:'Sternberg, S. (1966). High-speed scanning in human memory. Science 153(3736), 652–654. The linear slope replicates well; whether the search is serial and exhaustive is still debated (e.g. parallel models fit too).',
 desc:'A digit set shown briefly, then a single probe digit with Yes and No buttons; a chart of your mean time against set size beside Sternberg’s line.',
 dur:13,hint:'Press Start, memorise the digits, then answer whether the probe was one of them as fast as you can. Set sizes of 1, 3 and 5 come in random order; aim for a few of each. Your times stay on this page.',
 init:()=>({phase:'idle',set:[],probe:0,yes:true,t0:0,n:1,data:{1:[],3:[],5:[]},err:0,seed:1966,tid:0,msg:''}),
 watch(p){const r=rng(11),k=Math.floor(p*12),data={1:[],3:[],5:[]};for(let j=0;j<k;j++){const n=D1_SB[j%3];data[n].push(470+38*n+(r()-.5)*60)}const ph=['study','blank','probe','idle'][Math.floor(p*48)%4];return {phase:ph,set:[3,8,1,6,4].slice(0,D1_SB[k%3]),probe:8,yes:true,n:D1_SB[k%3],data,err:0,msg:'Simulated participant',sim:true}},
 ui:[{b:'Start',act:'start'},{b:'Yes, it was there',act:'ans',arg:'yes'},{b:'No',act:'ans',arg:'no'},{b:'Clear',act:'clear'}],
 on:{start(s,a,ctx){if(s.phase!=='idle')return;D1_next(s);const r=rng(s.seed);s.n=D1_SB[Math.floor(r()*3)];const digs=shuffled(range(10),s.seed);s.set=digs.slice(0,s.n);s.yes=r()<.5;s.probe=s.yes?s.set[Math.floor(r()*s.n)]:digs[s.n+Math.floor(r()*(10-s.n))];s.tid++;s.phase='study';s.msg='';ctx.later(900+300*s.n,'blank',s.tid)},
  blank(s,id,ctx){if(Number(id)!==s.tid)return;s.phase='blank';ctx.later(1000,'probe',s.tid)},
  probe(s,id){if(Number(id)!==s.tid)return;s.phase='probe';s.t0=performance.now()},
  ans(s,v){if(s.phase!=='probe'){if(s.phase!=='idle'){s.err++;s.msg='Wait for the probe';s.phase='idle';s.tid++}return}const rt=performance.now()-s.t0,ok=(v==='yes')===s.yes;s.phase='idle';s.tid++;if(ok&&rt>150&&rt<3000){s.data[s.n].push(rt);s.msg=D1_ms(rt)}else{s.err++;s.msg=ok?'Not counted':'Wrong answer'}},
  clear(s){s.data={1:[],3:[],5:[]};s.err=0;s.msg='';s.phase='idle';s.tid++}},
 draw(s,f,X){
  let out=heading(s.phase==='study'?'Memorise these digits':s.phase==='blank'?'Hold them in mind…':s.phase==='probe'?'Was this digit in the set?':'Press Start for a new set');
  out+=R(30,56,300,150,'#fff',C.grid,10);
  if(s.phase==='study')s.set.forEach((d,i)=>{out+=TMF(180+(i-(s.set.length-1)/2)*44,146,d,34,C.ink,'middle','font-weight="700"')});
  if(s.phase==='probe')out+=TMF(180,150,s.probe,48,C.blue,'middle','font-weight="700"');
  if(s.phase==='blank')out+=TF(180,140,'+',30,C.muted);
  out+=hit(X,'ans','yes','Yes, the probe was in the set',R(50,222,120,48,C.greenp,C.green,10)+TBF(110,252,'Yes',15,C.green))+hit(X,'ans','no','No, it was not',R(190,222,120,48,C.coralp,C.coral,10)+TBF(250,252,'No',15,C.coral));
  if(s.msg)out+=TBF(180,300,s.msg,15,/Wrong|Wait|Not/.test(s.msg)?C.coral:s.sim?C.purple:C.ink);
  out+=TF(180,324,`errors: ${s.err}`,13,C.muted);
  const pl=D1_plot(390,64,190,226,0,6,300,900,'set size','mean RT (ms)',[0,1,3,5],[300,500,700,900]);out+=pl.svg;
  out+=L(pl.px(0),pl.py(397),pl.px(6),pl.py(397+38*6),C.green,2,'stroke-dasharray="6 4"');
  const pts=[];D1_SB.forEach(n=>{const d=s.data[n];if(d.length){const m=D1_mean(d);pts.push([n,m]);out+=Ci(pl.px(n),pl.py(m),6,X.try&&!s.sim?C.coral:C.blue,'#fff')}});
  const fit=pts.length>=2?D1_fit(pts):null;if(fit)out+=L(pl.px(0),pl.py(fit.a),pl.px(6),pl.py(fit.a+6*fit.b),C.coral,2.4);
  out+=TF(390,346,'dashed: Sternberg, 38 ms/item',13,C.green,'start')+(fit?TF(390,366,`yours: ${Math.round(fit.b)} ms/item`,13,C.coral,'start'):'');
  return {svg:out,phase:fit?`Your time rises about ${Math.round(fit.b)} ms per extra digit (Sternberg: 38). Compare slopes rather than heights: your device adds a constant delay to every trial.`:'Each extra digit held adds roughly the same time to the decision, whether the answer is yes or no.'};
 }});

/* ---------------- Lesson: Localisation (1810–1874) ---------------- */
// A schematic left hemisphere seen from the side, front to the left.
const D1_BRAIN='M30 205 C20 150 55 100 115 82 C170 66 250 66 305 88 C360 110 390 160 382 205 C376 238 352 252 325 250 C312 268 280 276 255 266 C220 262 200 262 182 268 C150 280 110 276 90 262 C60 252 36 236 30 205Z';
function D1_brain(){return P('M262 262 C268 290 274 310 280 336 L300 336 C296 310 292 288 290 262Z',C.line,2,'#efe4dc')+`<ellipse cx="322" cy="262" rx="42" ry="22" fill="#efe4dc" stroke="${C.line}" stroke-width="2"/>`+P(D1_BRAIN,'#b79c8e',2.5,'#f6ece6')+P('M95 205 C150 190 210 185 262 200',C.line,2)+P('M220 72 C212 120 195 160 182 196',C.line,2)}
const D1_GALL=[[80,130,'Firmness'],[140,100,'Benevolence'],[60,190,'Language'],[250,110,'Self-esteem'],[300,180,'Combativeness'],[200,150,'Wit']];
SCENE({id:'localisation',name:'Where in the brain?',tag:'From skull bumps to lesions',
 definition:'Is the mind spread through the whole brain or made of parts in particular places? Franz Gall’s phrenology mapped faculties to bumps on the skull without real tests. Pierre Flourens, removing parts of animals’ brains, argued the cortex worked as a whole. Paul Broca’s patients showed that one function, producing speech, depends on a particular region.',
 example:'Broca’s patient Louis Victor Leborgne could say little but “tan”, yet understood speech. After his death in 1861 Broca found damage in the left frontal lobe, now called Broca’s area.',
 research:'Gall, F. J. & Spurzheim, J. G. (1810–1819). Anatomie et physiologie du système nerveux. Flourens, P. (1824). Recherches expérimentales sur les propriétés et les fonctions du système nerveux. Broca, P. (1861). Bulletin de la Société Anatomique. Parker Jones, O., Alfaro-Almagro, F. & Jbabdi, S. (2018). An empirical, 21st century evaluation of phrenology. Cortex 106: no link between scalp shape and faculties.',
 desc:'A schematic left hemisphere seen from the side. In Gall’s view it carries faculty labels; in Flourens’ the whole cortex is shaded; in Broca’s a lesion in the left frontal lobe is marked.',
 dur:12,hint:'Step through the three views. Only one of them was built on careful observation of damage and behaviour.',
 init:()=>({v:'broca'}),
 watch(p){return {v:['gall','flourens','broca'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['gall','Gall (1810)'],['flourens','Flourens (1824)'],['broca','Broca (1861)']],label:'View',get:s=>s.v,act:'v'}],
 on:{v(s,v){s.v=v}},
 draw(s,f,X){
  let out=heading({gall:'Phrenology: faculties read from skull bumps',flourens:'Flourens: the cortex acts as a whole',broca:'Broca: speech production in the left frontal lobe'}[s.v])+D1_brain();
  if(s.v==='gall')D1_GALL.forEach(([x,y,n])=>{out+=Ci(x,y,26,C.amberp,C.amber,'stroke-dasharray="4 3" opacity=".9"')+TF(x,y+5,n,13,C.amber)});
  if(s.v==='flourens')out+=P(D1_BRAIN,C.blue,2,C.pale,'opacity=".75"')+TF(205,175,'remove any part: all functions',13,C.blue)+TF(205,193,'weaken together',13,C.blue);
  if(s.v==='broca')out+=Ci(110,190,22,'#d6453a','none','opacity=".75"')+TF(110,150,'lesion',13,'#a3281f')+TF(56,300,'front',13,C.muted)+TF(350,300,'back',13,C.muted);
  const txt={gall:'Gall felt the skulls of people he thought had strong traits. He looked for confirming cases and explained away the rest. A 2018 study of thousands of MRI scans found no link between skull shape and traits.',
   flourens:'Removing parts of birds’ cortex weakened perception and will together, so Flourens argued for one undivided mind. His animals and methods could not reveal finer specialisation.',
   broca:'Leborgne understood speech but could barely produce it. The damage Broca found at autopsy, in the left frontal lobe, became the first strong evidence that a mental function has a place.'}[s.v];
  out+=D1_note(404,60,184,280,{gall:'Untested',flourens:'Too coarse',broca:'Evidence from a lesion'}[s.v],txt,22);
  return {svg:out,phase:{gall:'Phrenology was popular for decades, but its method of picking confirming cases is a lesson in how not to test an idea.',flourens:'Flourens did real experiments, but on animals and tasks too crude to see specialised regions.',broca:'One lesion, one lost function, carefully documented: the beginning of the lesion method.'}[s.v]};
 }});

const D1_LICHT={ear:[50,300],A:[120,200],M:[300,200],mouth:[370,300],B:[210,90]};
const D1_LINK=[['ear','A'],['A','M'],['M','mouth'],['A','B'],['B','M']];
const D1_SYN={none:['No lesion','fluent','good','good','“The dog chased the ball into the garden.”'],M:['Broca’s aphasia','halting','mostly good','poor','“Dog… ball… garden.”'],A:['Wernicke’s aphasia','fluent','poor','poor','“The dog fanned the sitting thing over there.”'],'A-M':['Conduction aphasia','fluent','good','poor','Asked to repeat a sentence: “The… dog… ran… no…”'],'B-M':['Transcortical motor','halting','good','good','Repeats sentences well but says little of their own.'],'A-B':['Transcortical sensory','fluent','poor','good','Repeats questions back without understanding them.']};
SCENE({id:'localisation-aphasia',name:'Broca, Wernicke and the language model',tag:'Cut a link, predict a syndrome',
 definition:'Carl Wernicke described patients who spoke fluently but understood little, with damage further back in the left temporal lobe. He and Ludwig Lichtheim drew a model: a centre for word sounds (A), one for speech movements (M) and concepts (B), linked by pathways. Damage to each part or link predicts a different aphasia.',
 example:'Cutting the link from A to M should spare understanding and fluent speech but ruin repeating, and patients with exactly this conduction aphasia were then found.',
 research:'Wernicke, C. (1874). Der aphasische Symptomencomplex. Breslau. Lichtheim, L. (1885). On aphasia. Brain 7, 433–484. Dronkers, N. F., et al. (2007). Paul Broca’s historic cases: high resolution MR imaging of the brains of Leborgne and Lelong. Brain 130, 1432–1441 (damage reached deeper than Broca’s area). Modern models are more distributed (Hickok & Poeppel 2007).',
 desc:'The Wernicke–Lichtheim diagram: ear to A (word sounds), A to M (speech movements), M to mouth, with A and M both linked to B (concepts). A chosen lesion is crossed out and a table shows the predicted fluency, comprehension and repetition.',
 dur:12,hint:'Press a centre or a link to damage it, or pick from the list. Read the three columns: fluency, comprehension, repetition.',
 init:()=>({les:'A-M'}),
 watch(p){return {les:['none','M','A','A-M','B-M','A-B'][Math.min(5,Math.floor(p*6))]}},
 ui:[{choose:Object.keys(D1_SYN).map(k=>[k,k==='none'?'No lesion':k]),label:'Lesion',get:s=>s.les,act:'les'}],
 on:{les(s,v){s.les=v}},
 draw(s,f,X){
  const N=D1_LICHT,syn=D1_SYN[s.les];let out=heading('The Wernicke–Lichtheim model of language');
  for(const [a,b] of D1_LINK){const k=a+'-'+b,cut=s.les===k,mx=(N[a][0]+N[b][0])/2,my=(N[a][1]+N[b][1])/2;let inner=L(N[a][0],N[a][1],N[b][0],N[b][1],cut?C.coral:C.line,cut?2:4,cut?'stroke-dasharray="6 5"':'');
   if(cut)inner+=L(mx-10,my-10,mx+10,my+10,C.coral,3.5)+L(mx-10,my+10,mx+10,my-10,C.coral,3.5);
   out+=(['A-M','A-B','B-M'].includes(k)?hit(X,'les',k,'Link '+k,inner+Ci(mx,my,12,'#ffffff01')):inner)}
  const lab={ear:'ear',A:'A',M:'M',mouth:'mouth',B:'B'},sub={A:'word sounds',M:'speech movements',B:'concepts'};
  for(const k in N){const [x,y]=N[k],dmg=s.les===k,big=k.length===1;const inner=Ci(x,y,big?26:20,dmg?C.coralp:big?C.pale:'#f4f7f9',dmg?C.coral:big?C.blue:C.line)+TBF(x,y+5,lab[k],big?17:13,dmg?C.coral:C.ink)+(sub[k]?(k==='B'?TF(x,y-34,sub[k],13,C.muted):k==='A'?TF(x-32,y+5,sub[k],13,C.muted,'end'):TF(x+12,y+46,sub[k],13,C.muted,'end')):'');out+=big&&k!=='B'?hit(X,'les',k,'Centre '+k,inner):inner}
  out+=R(420,60,168,166,'#fff',C.grid,10)+TBF(432,84,syn[0],14,s.les==='none'?C.green:C.coral,'start');
  [['fluency',syn[1]],['comprehension',syn[2]],['repetition',syn[3]]].forEach(([n,v],i)=>{out+=TF(432,112+i*36,n,13,C.muted,'start')+TBF(432,130+i*36,v,14,/poor|halting/.test(v)?C.coral:C.green,'start')});
  out+=D1_para(420,250,syn[4],24,13,C.ink,18)+TF(420,356,'Samples are illustrative.',13,C.muted,'start');
  return {svg:out,phase:`${syn[0]}: fluency ${syn[1]}, comprehension ${syn[2]}, repetition ${syn[3]}. The model predicted syndromes before they were described, a strong test of a theory.`};
 }});

const D1_HOM=[['Toes',2],['Ankle',2],['Knee',2],['Hip',2],['Trunk',3],['Shoulder',3],['Elbow',3],['Wrist',3],['Hand',5],['Little finger',3],['Ring finger',3],['Middle finger',3],['Index finger',4],['Thumb',6],['Neck',2],['Brow',3],['Eyelid',3],['Face',5],['Lips',8],['Jaw',4],['Tongue',6],['Swallowing',4]];
SCENE({id:'localisation-homunculus',name:'The motor map',tag:'The body laid out on the cortex',
 definition:'In 1870 Gustav Fritsch and Eduard Hitzig made a dog’s limbs move by passing weak currents through its frontal cortex. Wilder Penfield later stimulated patients’ brains during surgery and mapped the body along a strip in front of the central sulcus: toes at the top, then leg, arm, hand, face and tongue down the side.',
 example:'The hand and lips take far more cortex than the trunk, matching how finely we control them. The drawn “homunculus” with huge hands and lips shows these proportions.',
 research:'Fritsch, G. & Hitzig, E. (1870). Über die elektrische Erregbarkeit des Grosshirns. Penfield, W. & Boldrey, E. (1937). Somatic motor and sensory representation in the cerebral cortex of man as studied by electrical stimulation. Brain 60, 389–443. Gordon, E. M., et al. (2023). A somato-cognitive action network alternates with effector regions in motor cortex. Nature 617: the map is less tidy than the cartoon. Shares here are illustrative.',
 desc:'A half-section across the top of the brain with the motor strip divided into body parts, sized by their share of cortex; the chosen part is highlighted with its share.',
 dur:12,hint:'Move along the strip from the top of the head down the side, or press a segment. Compare the hand and lips with the trunk.',
 init:()=>({i:8}),
 watch(p){return {i:Math.min(D1_HOM.length-1,Math.floor(p*D1_HOM.length))}},
 ui:[{range:'i',label:'Position on the strip',min:0,max:D1_HOM.length-1,step:1,get:s=>s.i,act:'i',show:v=>D1_HOM[v][0]}],
 on:{i(s,v){s.i=Number(v)}},
 draw(s,f,X){
  const tot=sum(D1_HOM.map(h=>h[1])),cx=80,cy=340,r0=150,r1=230,a0=-Math.PI/2,a1=-Math.PI*.02;
  let out=heading('Primary motor cortex, top of the head to the side');
  out+=P(`M${cx} ${cy-r1-20}A${r1+20} ${r1+20} 0 0 1 ${fmt(cx+(r1+20)*Math.cos(a1))} ${fmt(cy+(r1+20)*Math.sin(a1))}`,C.line,1.5,'none','stroke-dasharray="4 4"');
  let acc=0;D1_HOM.forEach(([n,w],i)=>{const b0=a0+(a1-a0)*acc/tot,b1=a0+(a1-a0)*(acc+w)/tot;acc+=w;const sel=i===s.i;
   const p=(r,a)=>fmt(cx+r*Math.cos(a))+' '+fmt(cy+r*Math.sin(a));
   const d=`M${p(r0,b0)}L${p(r1,b0)}A${r1} ${r1} 0 0 1 ${p(r1,b1)}L${p(r0,b1)}A${r0} ${r0} 0 0 0 ${p(r0,b0)}Z`;
   out+=hit(X,'i',i,n,P(d,'#fff',1.5,sel?C.coral:i%2?C.pale:'#d6e6f2'));
   if(sel){const am=(b0+b1)/2;out+=L(cx+r1*Math.cos(am),cy+r1*Math.sin(am),cx+(r1+22)*Math.cos(am),cy+(r1+22)*Math.sin(am),C.coral,2)+TBF(cx+(r1+28)*Math.cos(am),cy+(r1+28)*Math.sin(am)+5,n,14,C.coral,'start')}});
  out+=TF(cx+r1+4,cy+20,'side of the head',13,C.muted,'start');
  const [n,w]=D1_HOM[s.i];
  out+=R(436,70,152,150,'#fff',C.grid,10)+TBF(448,96,n,15,C.ink,'start')+TF(448,122,'share of the strip',13,C.muted,'start')+TBF(448,150,`${Math.round(w/tot*100)}%`,22,C.coral,'start')+D1_para(448,178,w>=5?'A large share: fine control.':'A small share: coarse control.',18,13,C.ink,18);
  return {svg:out,phase:`${n}: about ${Math.round(w/tot*100)}% of the strip (illustrative). Area follows how finely a part is controlled, not how big it is.`};
 }});

/* ---------------- Lesson: The neuron doctrine (1873–1906) ---------------- */
const D1_NEURONS=(()=>{const r=rng(1873),out=[];for(let i=0;i<70;i++){const x=50+r()*320,y=70+r()*240,parts=[];const nd=4+Math.floor(r()*3);
 for(let j=0;j<nd;j++){const a=r()*Math.PI*2,l=16+r()*22,ex=x+Math.cos(a)*l,ey=y+Math.sin(a)*l;parts.push([x,y,ex,ey,1.8]);const b=a+(r()-.5)*1.4,l2=8+r()*14;parts.push([ex,ey,ex+Math.cos(b)*l2,ey+Math.sin(b)*l2,1.2]);const c=a-(r()-.2)*1.2;parts.push([ex,ey,ex+Math.cos(c)*l2*.8,ey+Math.sin(c)*l2*.8,1])}
 const a=r()*Math.PI*2,l=70+r()*90;let px=x,py=y;for(let k=1;k<=5;k++){const nx=x+Math.cos(a)*l*k/5+Math.sin(k*1.7+i)*5,ny=y+Math.sin(a)*l*k/5+Math.cos(k*1.3+i)*5;parts.push([px,py,nx,ny,1.3]);px=nx;py=ny}
 out.push({x,y,r:4+r()*2.5,parts,rank:r()})}return out})();
SCENE({id:'neuron-doctrine',name:'The black reaction',tag:'Stain fewer cells, see more',
 definition:'Camillo Golgi’s silver stain (1873) turns only a small, seemingly random fraction of nerve cells completely black. Because so few are stained, each one stands out whole against the clear tissue. Santiago Ramón y Cajal used it to show that the nervous system is made of separate cells, neurons: the neuron doctrine.',
 example:'Stain every cell and the slide is a black tangle in which nothing can be followed. Stain about 2% and single neurons appear with every branch, separate from their neighbours.',
 research:'Golgi, C. (1873). Sulla struttura della sostanza grigia del cervello. Gazzetta Medica Italiana. Ramón y Cajal, S. (1888). Estructura de los centros nerviosos de las aves. Revista Trimestral de Histología. Why the stain picks so few cells is still not fully understood.',
 desc:'A slice of tissue in which 70 neurons are drawn; only the stained fraction is shown in black. At 100% the slide is an unreadable mass; at a few per cent, single neurons with dendrites and an axon stand out.',
 dur:10,hint:'Move the stain from 100% down to a few per cent. Which setting lets you follow one cell from end to end?',
 init:()=>({pct:3}),
 watch(p){return {pct:Math.max(2,Math.round(100*Math.pow(1-p,2.2)))}},
 ui:[{range:'pct',label:'Cells stained',min:1,max:100,step:1,get:s=>s.pct,act:'pct',show:v=>v+'%'}],
 on:{pct(s,v){s.pct=Number(v)}},
 draw(s,f,X){
  let out=heading('Golgi’s silver stain blackens only a few cells')+`<clipPath id="d1-tissue"><rect x="30" y="54" width="360" height="300" rx="10"/></clipPath>`+R(30,54,360,300,'#f3e3c4','#d8c39c',10)+'<g clip-path="url(#d1-tissue)">';
  let n=0;for(const c of D1_NEURONS){if(c.rank>=s.pct/100)continue;n++;for(const [a,b,x2,y2,w] of c.parts)out+=L(a,b,x2,y2,'#2a1d12',w);out+=Ci(c.x,c.y,c.r,'#2a1d12')}
  out+='</g>';
  out+=D1_note(408,54,180,300,`${n} of 70 cells stained`,n>25?'Too many: branches cross everywhere and no single cell can be followed. This is why many thought nerve tissue was one continuous net.':n>0?'Few enough to follow each cell. Cajal saw separate neurons whose branches touch but do not fuse.':'Nothing stained yet.',22);
  return {svg:out,phase:n>25?'With most cells stained the tissue looks like one continuous network, Golgi’s own “reticular” view.':'With a few cells stained, each neuron is a separate unit with dendrites and one axon: Cajal’s neuron doctrine.'};
 }});

const D1_CIRC={reflex:{n:'A reflex arc',cells:['sensory neuron','interneuron','motor neuron'],start:'Touch on the skin',end:'The muscle contracts'},retina:{n:'The retina (as Cajal drew it)',cells:['photoreceptor','bipolar cell','ganglion cell'],start:'Light reaches the eye',end:'Signal leaves along the optic nerve'}};
function D1_polPts(){const pts=[];for(let j=0;j<3;j++){const x0=30+j*180;pts.push([x0+8,190],[x0+50,190],[x0+170,190])}return pts}
SCENE({id:'neuron-doctrine-polarity',name:'Signals flow one way',tag:'Cajal’s law of dynamic polarisation',
 definition:'Cajal argued that each neuron passes signals in one direction: in through its dendrites and cell body, out along its axon to the next cell. Reading his drawings with that rule turns a tangle into a circuit, and he drew arrows on them to show it.',
 example:'In a reflex, a sensory neuron carries a signal from the skin to an interneuron in the spinal cord, which passes it to a motor neuron that makes the muscle contract.',
 research:'Ramón y Cajal, S. (1891). Significación fisiológica de las expansiones protoplásmicas y nerviosas de las células de la sustancia gris. Revista de Ciencias Médicas de Barcelona. Golgi and Cajal shared the 1906 Nobel Prize, and Golgi still defended the reticular theory in his lecture.',
 desc:'Three neurons in a row, each with dendrites on the left, a cell body and an axon to the right that ends against the next cell’s dendrites; a pulse travels through them step by step.',
 dur:12,hint:'Choose a circuit and step the signal through it. Notice where each neuron receives and where it sends.',
 init:()=>({circ:'reflex'}),
 trace(s){const pts=D1_polPts(),C0=D1_CIRC[s.circ],fr=[];pts.forEach((p,i)=>{const cell=C0.cells[Math.floor(i/3)],part=['dendrites','cell body','axon terminal'][i%3];fr.push({i,label:i===0?`${C0.start}: the ${cell}’s dendrites receive it`:`${cell}: ${part}`})});fr.push({i:pts.length-1,label:C0.end,done:true});return fr},
 ui:[{choose:[['reflex','Reflex arc'],['retina','Retina']],label:'Circuit',get:s=>s.circ,act:'circ'}],
 on:{circ(s,v){s.circ=v}},
 draw(s,f,X){
  const C0=D1_CIRC[s.circ],pts=D1_polPts();let out=heading(C0.n);
  for(let j=0;j<3;j++){const x0=30+j*180;for(let k=-2;k<=2;k++)out+=L(x0+8,190+k*14,x0+44,190,C.blue,2);out+=Ci(x0+50,190,13,C.pale,C.blue)+L(x0+63,190,x0+166,190,C.blue,3)+arrow(x0+100,206,x0+140,206,C.muted,1.6,7)+TF(x0+88,240,C0.cells[j],13,C.ink);
   if(j<2)out+=Ci(x0+170,190,4,C.blue)}
  if(s.circ==='reflex')out+=R(560,170,30,40,C.coralp,C.coral,6);else out+=TF(570,196,'→ brain',13,C.muted);
  out+=TF(30,140,s.circ==='reflex'?'skin':'light',13,C.amber,'start');
  if(f){const i=f.i,u=smooth(X.u==null?1:X.u),a=pts[Math.max(0,i-1)],b=pts[i],x=lerp(a[0],b[0],i?u:1),y=lerp(a[1],b[1],i?u:1);out+=Ci(x,y,9,'#ffd24a','#c79100');
   out+=R(30,280,540,56,'#fff',C.grid,10)+TF(300,314,f.label,15,f.done?C.green:C.ink)}
  return {svg:out,phase:'Dendrites receive, the axon sends. Cajal’s rule of one-way flow lets an anatomist read the direction of a circuit from its shape.'};
 }});

SCENE({id:'neuron-doctrine-synapse',name:'The gap between neurons',tag:'Too small for a light microscope',
 definition:'If neurons are separate, something must bridge them. Charles Sherrington named the junction a synapse in 1897. The gap, about 20 nm across, is ten times smaller than a light microscope can resolve, so it was only seen with the electron microscope in the 1950s. Some synapses, electrical ones, do join cells through channels, about 3.5 nm apart.',
 example:'Under a light microscope (about 200 nm resolution) the axon ending and the next cell’s membrane blur into one; under an electron microscope the cleft and the vesicles of transmitter are plain.',
 research:'Foster, M. & Sherrington, C. S. (1897). A Text Book of Physiology, 7th edn, part 3 (the word synapse). Palay, S. L. & Palade, G. E. (1955). The fine structure of neurons. Journal of Biophysical and Biochemical Cytology 1. Furshpan, E. J. & Potter, D. D. (1959). Transmission at the giant motor synapses of the crayfish. Journal of Physiology 145 (electrical synapses).',
 desc:'A synapse drawn to scale, an axon ending above and the receiving cell below with a narrow cleft between them, blurred according to the microscope’s resolution, beside a scale bar.',
 dur:10,hint:'Sharpen the resolution from a light microscope to an electron microscope, and compare a chemical synapse with an electrical one.',
 init:()=>({pos:20,kind:'chem'}),
 watch(p){return {pos:Math.round(100*smooth(p<.7?p/.7:1)),kind:p<.85?'chem':'elec'}},
 ui:[{range:'pos',label:'Resolution',min:0,max:100,step:1,get:s=>s.pos,act:'pos',show:v=>Math.round(Math.pow(10,2.4-2.4*v/100))+' nm'},{choose:[['chem','Chemical synapse'],['elec','Electrical synapse']],label:'Kind',get:s=>s.kind,act:'kind'}],
 on:{pos(s,v){s.pos=Number(v)},kind(s,v){s.kind=v}},
 draw(s,f,X){
  const res=Math.pow(10,2.4-2.4*s.pos/100),gap=s.kind==='chem'?20:3.5,k=.5,y0=176,gp=gap*k,blur=Math.max(0,res*k/2.35);
  const seen=res<gap/2;let out=heading(!seen?'Unresolved: the two cells look joined':'Resolved: a gap between two cells');
  out+=`<filter id="d1-syn-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${fmt(blur)}"/></filter>`;
  out+=`<g filter="url(#d1-syn-blur)">`+R(30,54,370,300,'#e9eef1','none',0)+P(`M60 ${y0} C60 100 120 60 215 60 C310 60 370 100 370 ${y0}Z`,C.ink,3,'#cfd8de');
  if(s.kind==='chem')for(let i=0;i<9;i++)out+=Ci(110+i*30+(i%2)*6,y0-30-(i%3)*22,10,'#fff',C.ink,'stroke-width="2"');
  out+=R(40,y0+gp,350,170,'#d9cfc4','none',0)+L(40,y0+gp,390,y0+gp,C.ink,3);
  if(s.kind==='elec')for(let i=0;i<8;i++)out+=R(90+i*34,y0-4,10,gp+8,C.purple,'none',2);
  out+='</g>';
  out+=L(420,330,420+100*k,330,C.ink,3)+TF(420+50*k,350,'100 nm',13,C.ink);
  out+=R(416,60,172,240,'#fff',C.grid,10)+TF(428,86,'resolution',13,C.muted,'start')+TBF(428,112,`${Math.round(res)} nm`,20,C.ink,'start')+TF(428,140,'gap',13,C.muted,'start')+TBF(428,166,`${gap} nm`,20,seen?C.green:C.coral,'start');
  out+=D1_para(428,196,res>150?'Light microscope: the gap is invisible.':!seen?'Better, but still blurred.':s.kind==='chem'?'Electron microscope: cleft and vesicles visible.':'Channels bridge a 3.5 nm gap.',20,13,C.ink,18);
  return {svg:out,phase:!seen?'The gap is smaller than the blur, so Cajal could not see it. He inferred it from the stained shapes; proof waited for the electron microscope.':s.kind==='chem'?'The cleft is real: neurons are separate, and chemical transmitter, stored in the round vesicles, carries the signal across.':'Electrical synapses do connect cells through channels, so Golgi was not wholly wrong: some neurons are coupled directly.'};
 }});
