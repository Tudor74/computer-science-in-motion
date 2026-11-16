/* ===================== Mind era 3 · The mind as information (1948–1975) ===================== */
// Shared helpers for this era (prefix D3_).
const D3_mean=a=>a.length?sum(a)/a.length:0;
const D3_ms=v=>Math.round(v*1000)+' ms';
const D3_nx=v=>(v*48271)%2147483647||1;
// A plot frame: ranges [lo,hi]; ticks as [value,label]. Returns {svg,X,Y}.
function D3_plot(x,y,w,h,[x0,x1],[y0,y1],xt,yt,xl,yl){
 const X=v=>x+w*clamp((v-x0)/(x1-x0),0,1),Y=v=>y+h-h*clamp((v-y0)/(y1-y0),0,1);
 let s=R(x,y,w,h,'#fff',C.grid,6);
 for(const [v,l] of yt)s+=L(x,Y(v),x+w,Y(v),'#eef3f6',1)+TF(x-7,Y(v)+5,l,13,C.muted,'end');
 for(const [v,l] of xt)s+=L(X(v),y+h,X(v),y+h+5,C.line,1.5)+TF(X(v),y+h+18,l,13,C.muted);
 if(xl)s+=TF(x+w/2,y+h+35,xl,13,C.muted);
 if(yl)s+=TF(x-42,y+h/2,yl,13,C.muted,'middle',`transform="rotate(-90 ${fmt(x-42)} ${fmt(y+h/2)})"`);
 return {svg:s,X,Y};
}
// Least-squares line y = a + b·x; null if there is too little spread.
function D3_fit(pts){
 if(pts.length<2)return null;const n=pts.length,mx=sum(pts.map(p=>p[0]))/n,my=sum(pts.map(p=>p[1]))/n;
 const sxx=sum(pts.map(p=>(p[0]-mx)**2));if(sxx<1e-9)return null;
 const b=sum(pts.map(p=>(p[0]-mx)*(p[1]-my)))/sxx;return {a:my-b*mx,b};
}
const D3_poly=(pts,col=C.blue,w=2.5,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L'),col,w,'none',extra):'';
function D3_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
// Standard normal cumulative distribution (Abramowitz & Stegun 7.1.26) and its inverse (Acklam).
function D3_Phi(z){const t=1/(1+.3275911*Math.abs(z)/Math.SQRT2),y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-z*z/2);return z>=0?(1+y)/2:(1-y)/2}
function D3_z(p){p=clamp(p,1e-6,1-1e-6);const a=[-39.69683028665376,220.9460984245205,-275.9285104469687,138.357751867269,-30.66479806614716,2.506628277459239],b=[-54.47609879822406,161.5858368580409,-155.6989798598866,66.80131188771972,-13.28068155288572],c=[-.007784894002430293,-.3223964580411365,-2.400758277161838,-2.549732539343734,4.374664141464968,2.938163982698783],d=[.007784695709041462,.3224671290700398,2.445134137142996,3.754408661907416],pl=.02425;
 const tail=q=>(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5])/((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1);
 if(p<pl)return tail(Math.sqrt(-2*Math.log(p)));if(p>1-pl)return -tail(Math.sqrt(-2*Math.log(1-p)));
 const q=p-.5,r=q*q;return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q/(((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1)}
// A response button drawn inside the diagram.
const D3_key=(X,act,arg,label,x,y,w,h,text,on=false,col=C.blue)=>hit(X,act,arg,label,R(x,y,w,h,on?C.pale:'#fff',on?col:C.line,8)+TB(x+w/2,y+h/2+6,text,15,C.ink));

/* ======================= Lesson: channel-capacity ======================= */
const D3_ABS_N=[2,3,5,9];
const D3_ABS_SIM={2:1,3:1.5,5:2.05,9:2.45};
const D3_absX=(k,n)=>90+420*(n>1?k/(n-1):.5);
// Information transmitted (mutual information, bits) from [stimulus, response] pairs.
function D3_mi(pairs){
 const N=pairs.length;if(!N)return 0;const j={},ps={},pr={};
 pairs.forEach(([a,b])=>{j[a+','+b]=(j[a+','+b]||0)+1;ps[a]=(ps[a]||0)+1;pr[b]=(pr[b]||0)+1});
 let t=0;for(const key in j){const [a,b]=key.split(',').map(Number),p=j[key]/N;t+=p*Math.log2(p/((ps[a]/N)*(pr[b]/N)))}return Math.max(0,t);
}
function D3_absNext(s,ctx){s.seed=D3_nx(s.seed);s.stim=s.seed%s.n;s.show=true;s.tok++;ctx.later(700,'hide',s.tok)}
SCENE({id:'channel-capacity',name:'How many categories can you tell apart?',tag:'Be the participant',
 definition:'In an absolute-judgement task you see one stimulus at a time and say which of several categories it belongs to. Information theory measures how many bits get through. With more categories people transmit more bits, but only up to a ceiling of roughly 2–3 bits, about 4–8 categories, for a single dimension such as pitch, loudness or position.',
 example:'Pollack (1952) found listeners could name about five tones by pitch without confusion (about 2.3 bits), however many tones he used. George Miller (1956) gathered such results under the title “the magical number seven, plus or minus two”.',
 research:'Miller, G. A. (1956). The magical number seven, plus or minus two. Psychological Review 63, 81–97; Pollack (1952), JASA 24 (tones, about 2.3 bits); Hake & Garner (1951), J. Exp. Psychol. 42 (points on a line, about 3.2 bits). The ceiling is robust; its value depends on the dimension.',
 desc:'A dot flashes on an unmarked line and you name its position from 2, 3, 5 or 9 categories; a chart compares the bits you transmit with the bits sent, against the ceiling band found in classic studies.',
 dur:12,hint:'Choose the number of categories and press Start. A dot flashes on the line: press the numbered box for where it was. Do about ten trials at each size. Your answers stay in this page.',
 init:()=>({n:5,seed:91,stim:-1,show:false,tok:0,last:null,data:{2:[],3:[],5:[],9:[]}}),
 watch(p){const i=Math.min(3,Math.floor(p*4)),n=D3_ABS_N[i],q=p*40;return {n,seed:1,stim:Math.floor(q*1.7)%n,show:q%1<.6,tok:0,last:null,data:{2:[],3:[],5:[],9:[]},sim:i+((p*4)%1>.5?1:0)}},
 ui:[{choose:D3_ABS_N.map(n=>[n,n+' categories']),label:'Categories',get:s=>s.n,act:'n'},{b:'Start',act:'go'},{b:'Clear my data',act:'clear'}],
 on:{n(s,v){s.n=Number(v);s.stim=-1;s.show=false;s.last=null},go(s,a,ctx){D3_absNext(s,ctx)},hide(s,t){if(Number(t)===s.tok)s.show=false},
  clear(s){s.data={2:[],3:[],5:[],9:[]};s.last=null;s.stim=-1;s.show=false},
  resp(s,k,ctx){if(s.stim<0)return;k=Number(k);s.data[s.n].push([s.stim,k]);s.last=[s.stim,k];D3_absNext(s,ctx)}},
 draw(s,f,X){
  const n=s.n;let out=heading(`Where was the dot? ${n} categories = ${Math.log2(n).toFixed(2)} bits each`);
  out+=L(90,80,510,80,C.line,3)+L(90,70,90,90,C.muted,2)+L(510,70,510,90,C.muted,2);
  if(s.stim>=0&&s.show)out+=Ci(D3_absX(s.stim,n),80,9,C.ink);
  const bw=Math.min(52,440/n-6);
  for(let k=0;k<n;k++){const x=D3_absX(k,n),on=!X.try&&s.show&&k===s.stim;out+=D3_key(X,'resp',k,`Position ${k+1}`,x-bw/2,104,bw,36,String(k+1),on)}
  const fb=s.last?(s.last[0]===s.last[1]?`Right: it was ${s.last[0]+1}`:`It was ${s.last[0]+1}; you said ${s.last[1]+1}`):X.try?(s.stim<0?'Press Start':'Press the box for where the dot was'):'Simulated participant';
  out+=TF(300,162,fb,13,s.last&&s.last[0]!==s.last[1]?C.coral:C.muted);
  const tk=[[0,'0'],[1,'1'],[2,'2'],[3,'3']],pl=D3_plot(110,184,290,132,[0,3.4],[0,3.4],tk,tk,'bits sent: log₂(categories)','bits transmitted');out+=pl.svg;
  out+=R(110,pl.Y(3.2),290,pl.Y(2.3)-pl.Y(3.2),C.amberp,'none',0)+TF(396,pl.Y(3.2)+16,'typical ceiling',13,C.amber,'end');
  out+=L(pl.X(0),pl.Y(0),pl.X(3.4),pl.Y(3.4),C.line,1.5,'stroke-dasharray="5 4"')+TF(pl.X(1.7)-8,pl.Y(1.7)-4,'no errors',13,C.muted,'end');
  const pts=[];
  if(X.try){D3_ABS_N.forEach(m=>{const d=s.data[m];if(d.length>=4)pts.push([Math.log2(m),D3_mi(d),m])})}
  else D3_ABS_N.slice(0,s.sim||0).forEach(m=>pts.push([Math.log2(m),D3_ABS_SIM[m],m]));
  out+=D3_poly(pts.map(p=>[pl.X(p[0]),pl.Y(p[1])]),X.try?C.coral:C.blue,2);
  pts.forEach(p=>out+=Ci(pl.X(p[0]),pl.Y(Math.min(3.4,p[1])),6,X.try?C.coral:C.blue,'#fff'));
  out+=R(430,184,156,132,'#fff',C.grid,8)+TF(508,204,X.try?'your trials':'simulated',13,C.muted);
  D3_ABS_N.forEach((m,i)=>{const d=X.try?s.data[m]:[],ok=d.filter(e=>e[0]===e[1]).length;out+=TF(442,230+i*24,`${m}:`,13,C.ink,'start')+TF(578,230+i*24,X.try?(d.length?`${d.length} · ${Math.round(100*ok/d.length)}% right`:'—'):`${D3_ABS_SIM[m]} bit${D3_ABS_SIM[m]===1?'':'s'}`,13,C.muted,'end')});
  return {svg:out,phase:pts.length>=3?'The line climbs, then bends over: past about 5–9 categories, adding categories adds confusion instead of information. With only a few trials per size the estimate runs a little high.':'With 2 categories you make almost no mistakes and pass 1 bit per answer. As categories multiply, errors creep in and the bits transmitted level off.'};
 }});

SCENE({id:'channel-capacity-bits',name:'What is a bit?',tag:'Twenty questions',
 definition:'Claude Shannon (1948) measured information in bits. One bit is the answer to one yes-or-no question between two equally likely possibilities, so finding one item among N equally likely items needs log₂ N well-chosen questions.',
 example:'For one of 32 cards, asking “is it in the top half?” five times always finds it, because 2⁵ = 32. Guessing one card at a time takes about 16 questions on average.',
 research:'Shannon, C. E. (1948). A mathematical theory of communication. Bell System Technical Journal 27, 379–423, 623–656. Psychologists adopted the measure within a few years (Miller 1953; Hick 1952).',
 desc:'A row of numbered cells with one hidden target: each question greys out the cells it rules out, and counters compare the questions used with log₂ N.',
 dur:10,hint:'Choose how many cells, then ask halving questions or guess one cell at a time, and compare how many questions each strategy needs.',
 init:()=>({N:32,lo:0,hi:31,seed:5,q:0,log:[]}),
 watch(p){const N=32,sec=21,k=Math.min(5,Math.floor(p*6.5));let lo=0,hi=31;const log=[];for(let i=0;i<k;i++){const m=(lo+hi)>>1,yes=sec>m;log.push(`Above ${m+1}? ${yes?'yes':'no'}`);if(yes)lo=m+1;else hi=m}return {N,lo,hi,seed:sec,q:k,log,secret:sec}},
 ui:[{choose:[[8,'8'],[16,'16'],[32,'32'],[64,'64']],label:'Cells',get:s=>s.N,act:'N'},{b:'Ask: is it in the upper half?',act:'halve'},{b:'Ask: is it the lowest left?',act:'guess'},{b:'New target',act:'fresh'}],
 on:{N(s,v){s.N=Number(v);s.lo=0;s.hi=s.N-1;s.q=0;s.log=[]},fresh(s){s.seed=D3_nx(s.seed);s.lo=0;s.hi=s.N-1;s.q=0;s.log=[]},
  halve(s){if(s.lo===s.hi)return;const sec=s.seed%s.N,m=(s.lo+s.hi)>>1,yes=sec>m;s.q++;s.log.push(`Above ${m+1}? ${yes?'yes':'no'}`);if(yes)s.lo=m+1;else s.hi=m},
  guess(s){if(s.lo===s.hi)return;const sec=s.seed%s.N,yes=sec===s.lo;s.q++;s.log.push(`Is it ${s.lo+1}? ${yes?'yes':'no'}`);if(yes)s.hi=s.lo;else s.lo++}},
 draw(s){
  const N=s.N,sec=s.secret!==undefined?s.secret:s.seed%N,left=s.hi-s.lo+1,done=left===1,cw=520/N;
  let out=heading(`Find 1 of ${N}: log₂ ${N} = ${Math.log2(N)} questions if each halves the options`);
  for(let i=0;i<N;i++){const x=40+i*cw,alive=i>=s.lo&&i<=s.hi,win=done&&i===sec;out+=R(x+1,60,cw-2,40,win?C.green:alive?C.pale:'#f1f4f6',alive?C.blue:'none',3);
   if(cw>=24||(cw>=12&&i%4===3)||i%8===7||i===0)out+=TF(x+cw/2,122,String(i+1),13,alive?C.ink:C.line)}
  out+=counter(40,140,'questions asked',s.q,C.blue,150)+counter(206,140,'options left',left,C.ink,150)+counter(372,140,'bits gained',(Math.log2(N/left)).toFixed(1),C.green,150);
  s.log.slice(-4).forEach((l,i)=>out+=TF(48,214+i*20,l,13,C.muted,'start'));
  const pl=D3_plot(330,206,240,110,[0,6],[0,34],[[2,'4'],[3,'8'],[4,'16'],[5,'32'],[6,'64']],[[0,'0'],[16,'16'],[32,'32']],'number of cells',null);out+=pl.svg;
  const hv=[2,3,4,5,6].map(b=>[pl.X(b),pl.Y(b)]),gv=[2,3,4,5,6].map(b=>[pl.X(b),pl.Y((2**b+1)/2)]);
  out+=D3_poly(hv,C.green,2.5)+D3_poly(gv,C.coral,2.5)+TF(340,226,'one at a time: ≈ N/2',13,C.coral,'start')+TF(340,246,'halving: log₂ N',13,C.green,'start');
  out+=TF(450,200,'questions needed on average',13,C.muted);
  return {svg:out,phase:done?`Found in ${s.q} questions. A question whose answer is equally likely to be yes or no carries exactly 1 bit; the halving strategy gets the full bit every time.`:'Each halving question removes half the remaining options, gaining 1 bit. A question that is almost always answered “no” gains much less.'};
 }});

// Hyman (1953): choice time follows the average information (entropy), not the number of alternatives.
const D3_hymanP=(n,k)=>{const w=range(n).map(i=>Math.exp(-k*i)),t=sum(w);return w.map(v=>v/t)};
const D3_H=ps=>-sum(ps.filter(p=>p>0).map(p=>p*Math.log2(p)));
SCENE({id:'channel-capacity-hick',name:'Choice time and information',tag:'Hick and Hyman',
 definition:'William Hick (1952) and Ray Hyman (1953) found that the time to choose a response grows with the information in the signal: about a fixed amount per bit. Hyman showed it is the average information (entropy) that counts, so making one light much more likely than the others speeds people up even with the same number of lights.',
 example:'With 8 equally likely lights each signal carries 3 bits. If one light comes on nearly every time, a signal carries far less than 3 bits on average, and responses are faster.',
 research:'Hick, W. E. (1952). On the rate of gain of information. QJEP 4, 11–26; Hyman, R. (1953). Stimulus information as a determinant of reaction time. J. Exp. Psychol. 45, 188–196. Robust; HCI In Motion lets you be the participant.',
 desc:'Bars show the probability of each of several lights; a chart places the resulting entropy and predicted choice time on the Hick–Hyman line.',
 dur:10,hint:'Change the number of lights and make some more likely than others. The entropy H, not the count, sets the predicted time. Constants are illustrative.',
 init:()=>({n:8,k:0}),
 watch(p){return {n:8,k:Math.round(smooth(p)*25)/10}},
 ui:[{choose:[[2,'2 lights'],[4,'4 lights'],[8,'8 lights']],label:'Lights',get:s=>s.n,act:'n'},{range:'k',label:'Uneven odds',min:0,max:25,get:s=>Math.round(s.k*10),act:'k',show:v=>v?`skew ${(v/10).toFixed(1)}`:'equal'}],
 on:{n(s,v){s.n=Number(v)},k(s,v){s.k=Number(v)/10}},
 draw(s){
  const ps=D3_hymanP(s.n,s.k),H=D3_H(ps),a=.2,b=.15,rt=a+b*H;let out=heading(`${s.n} lights · average information H = ${H.toFixed(2)} bits`);
  const bw=Math.min(52,240/s.n);ps.forEach((p,i)=>{const x=50+i*(bw+4),h=p*170;out+=R(x,240-h,bw,h,C.blue,'none',3)+TF(x+bw/2,258,String(i+1),13,C.muted)+(bw>=28?TF(x+bw/2,234-h,Math.round(p*100)+'%',13,C.ink):'')});
  out+=TF(170,284,'probability of each light',13,C.muted)+TF(170,310,'H = −Σ p log₂ p',14,C.ink);
  const pl=D3_plot(370,60,200,190,[0,3.2],[0,.8],[[0,'0'],[1,'1'],[2,'2'],[3,'3']],[[0,'0'],[.4,'0.4'],[.8,'0.8 s']],'information H (bits)',null);out+=pl.svg;
  out+=L(pl.X(0),pl.Y(a),pl.X(3.2),pl.Y(a+b*3.2),C.green,2.5);
  [1,2,4,8].forEach(m=>out+=Ci(pl.X(Math.log2(m)),pl.Y(a+b*Math.log2(m)),4,'#fff',C.green));
  out+=Ci(pl.X(H),pl.Y(rt),8,C.coral,'#fff')+TF(pl.X(H)+(H>2.2?-12:12),pl.Y(rt)-10,D3_ms(rt),13,C.coral,H>2.2?'end':'start');
  out+=TF(300,356,'RT ≈ a + b·H, with a = 0.2 s and b = 0.15 s per bit (illustrative)',13,C.muted);
  return {svg:out,phase:s.k>0?`The ${s.n} lights are not equally likely, so a signal carries only ${H.toFixed(2)} bits on average. Hyman’s participants sped up exactly as the reduced information predicts.`:`With ${s.n} equally likely lights each signal carries log₂ ${s.n} = ${Math.log2(s.n)} bits. Hick added 1 to the count (log₂(n + 1)) to include the chance that no light comes on.`};
 }});

/* ======================= Lesson: chunking ======================= */
const D3_SPAN_SIM=[[4,1],[5,1],[6,1],[7,1],[8,0],[7,1],[8,0],[7,1]];
const D3_SPAN_SEQ=[5,8,2,9,4,1,7];
function D3_digits(seed,n){const r=rng(seed),out=[];while(out.length<n){const d=Math.floor(r()*10);if(d!==out[out.length-1])out.push(d)}return out}
SCENE({id:'chunking',name:'Digit span',tag:'Be the participant',
 definition:'Memory span is the longest list a person can repeat back straight after hearing or seeing it once. For digits it is usually about seven, but Nelson Cowan (2001) argued that when rehearsal and grouping are prevented, people hold only about four chunks.',
 example:'Most adults can repeat 5 8 2 9 4 1 7 after one look, partly by saying it over and grouping it as 582-94-17. Block the inner voice and the limit falls toward four units.',
 research:'Miller (1956), Psychological Review 63; Cowan, N. (2001). The magical number 4 in short-term memory. Behavioral and Brain Sciences 24, 87–114. Digit span is highly reliable; the ~4-chunk estimate is widely accepted but debated.',
 desc:'Digits appear one at a time, then you type them back on a keypad; the list grows after a success and shrinks after a mistake, and your trials are plotted against Miller’s 7 ± 2 band and Cowan’s line at about 4 chunks.',
 dur:12,hint:'Press Start and watch the digits, then type them back in order on the keypad. The list grows by one after each success and shrinks after a mistake. Nothing you type leaves the page.',
 init:()=>({len:4,phase:'idle',seq:[],k:0,input:[],seed:3,hist:[],tok:0}),
 watch(p){const n=D3_SPAN_SIM.length,i=Math.min(n-1,Math.floor(p*n)),u=(p*n)%1,len=D3_SPAN_SIM[i][0],seq=D3_SPAN_SEQ.concat([3,6]).slice(0,len);
  const k=Math.floor(u*2.4*len),phase=k<2*len?'show':'fb';return {len,phase,seq,k,input:phase==='fb'?(D3_SPAN_SIM[i][1]?seq:seq.slice(0,-2).concat([seq[len-1],seq[len-2]])):[],hist:D3_SPAN_SIM.slice(0,i+(phase==='fb'?1:0)).map(([l,o])=>({len:l,ok:!!o})),sim:true}},
 ui:[{b:'Start',act:'go'},{b:'Delete',act:'del'},{b:'Clear my data',act:'clear'}],
 on:{go(s,a,ctx){if(s.phase==='show')return;s.seed=D3_nx(s.seed);s.seq=D3_digits(s.seed,s.len);s.k=0;s.input=[];s.phase='show';s.tok++;ctx.every(450,'tick',s.tok)},
  tick(s,t){if(Number(t)!==s.tok||s.phase!=='show')return 'stop';s.k++;if(s.k>=2*s.len){s.phase='answer';return 'stop'}},
  key(s,d){if(s.phase!=='answer')return;s.input.push(Number(d));if(s.input.length===s.len){const ok=s.input.join('')===s.seq.join('');s.hist.push({len:s.len,ok});s.phase='fb';s.len=clamp(s.len+(ok?1:-1),3,12)}},
  del(s){if(s.phase==='answer')s.input.pop()},clear(s){s.hist=[];s.len=4;s.phase='idle';s.input=[];s.seq=[]}},
 draw(s,f,X){
  let out=heading('How many digits can you hold?');
  out+=R(30,46,280,120,'#f6f9fb',C.grid,10);
  const len=s.seq.length;
  if(s.phase==='show'){if(s.k%2===1)out+=TBF(170,128,String(s.seq[(s.k-1)>>1]),64,C.ink);else out+=TF(170,112,'·',22,C.line)}
  else if(s.phase==='answer'||s.phase==='fb'){const w=Math.min(26,250/len);for(let i=0;i<len;i++){const x=170-len*w/2+i*w,d=s.input[i],ok=s.phase==='fb'&&d===s.seq[i];
    out+=R(x+2,70,w-4,36,'#fff',s.phase==='fb'?(ok?C.green:C.coral):C.line,5)+(d!==undefined?TBF(x+w/2,95,String(d),17,C.ink):'');
    if(s.phase==='fb')out+=TF(x+w/2,130,String(s.seq[i]),13,C.muted)}
   out+=TF(170,154,s.phase==='fb'?(s.input.join('')===s.seq.join('')?'All correct: one longer next time':'Not quite: grey digits were the list'):'Type the digits in order',13,C.muted)}
  else out+=TF(170,112,X.try?'Press Start':'',14,C.muted);
  for(let d=0;d<10;d++){const x=36+(d%5)*54,y=180+Math.floor(d/5)*50;out+=D3_key(X,'key',d,`Digit ${d}`,x,y,48,42,String(d))}
  out+=TF(170,300,`list length now: ${s.phase==='fb'&&!s.sim?s.len+' next':s.len}`,13,C.muted);
  const pl=D3_plot(380,52,196,236,[0,13],[2,12],[[1,'1'],[6,'6'],[12,'12']],[[2,'2'],[4,'4'],[7,'7'],[9,'9'],[12,'12']],'trial',null);out+=pl.svg;
  out+=R(380,pl.Y(9),196,pl.Y(5)-pl.Y(9),C.amberp,'none',0)+TF(572,pl.Y(9)+16,'Miller: 7 ± 2',13,C.amber,'end');
  out+=L(380,pl.Y(4),576,pl.Y(4),C.purple,2,'stroke-dasharray="6 4"')+TF(572,pl.Y(4)-6,'Cowan: ≈ 4 chunks',13,C.purple,'end');
  const h=s.hist.slice(-12);out+=D3_poly(h.map((e,i)=>[pl.X(i+1),pl.Y(e.len)]),C.line,1.5);h.forEach((e,i)=>out+=Ci(pl.X(i+1),pl.Y(e.len),6,e.ok?C.green:C.coral,'#fff'));
  const best=Math.max(0,...s.hist.filter(e=>e.ok).map(e=>e.len));
  out+=TF(478,344,best?`longest correct list: ${best}`:'green right · red wrong',14,C.ink);
  return {svg:out,phase:best?'Digits are easy to say over and to group, so spans of 6–8 are typical. Cowan’s point is that the real store holds about four chunks; rehearsal and grouping stretch what reaches it.':'The list grows after each success and shrinks after a mistake, so it settles near your span.'};
 }});

SCENE({id:'chunking-recode',name:'Recoding into chunks',tag:'Bits into octal',
 definition:'A chunk is a unit of meaning, however much raw information it contains. Miller (1956) pointed out that span is limited in chunks, not bits, so recoding many small items into fewer larger ones lets far more information be held.',
 example:'Eighteen binary digits are too many to repeat back, but read three at a time as octal digits (101 = 5) they become six items. Miller reported that Sidney Smith, after practice, could recall about 40 binary digits this way.',
 research:'Miller (1956), Psychological Review 63, on Smith’s recoding of binary digits; Ericsson, Chase & Faloon (1980), Science 208: one runner reached a digit span of about 80 using running times as chunks. Recoding gains are robust but need practice.',
 desc:'Eighteen binary digits grouped one, two or three at a time, with the recoded names below and a bar comparing the number of items to remember with a typical span.',
 dur:9,hint:'Change the group size and count the items you would have to hold. Press New string for another example.',
 init:()=>({seed:12,k:3}),
 watch(p){return {seed:12,k:[1,2,3][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[[1,'1 bit (raw)'],[2,'pairs (0–3)'],[3,'triples (octal 0–7)']],label:'Group size',get:s=>s.k,act:'k'},{b:'New string',act:'fresh'}],
 on:{k(s,v){s.k=Number(v)},fresh(s){s.seed=D3_nx(s.seed)}},
 draw(s){
  const r=rng(s.seed),bits=range(18).map(()=>r()<.5?1:0),k=s.k,n=Math.ceil(18/k);let out=heading(`18 binary digits read ${k===1?'one at a time':k===2?'in pairs':'in triples'}: ${n} items to hold`);
  bits.forEach((b,i)=>{const x=48+i*28;out+=R(x,64,24,34,b?C.blue:'#fff',b?C.blue:C.line,5)+TMF(x+12,87,String(b),15,b?'#fff':C.muted)});
  for(let g=0;g<n;g++){const x0=48+g*k*28,x1=x0+k*28-4,val=parseInt(bits.slice(g*k,g*k+k).join(''),2);
   if(k>1)out+=P(`M${x0} 106V114H${x1}V106`,C.purple,2);
   out+=R((x0+x1)/2-13,124,26,30,C.purplep,'none',6)+TBF((x0+x1)/2,145,String(val),15,C.purple)}
  out+=TF(300,178,k===1?'Each 0 or 1 is its own item':k===2?'Each pair becomes one of 0, 1, 2, 3':'Each triple becomes one octal digit, 0–7',13,C.muted);
  const bx=v=>80+v*24;out+=TF(80,214,'items to hold',13,C.muted,'start');out+=R(80,224,bx(n)-80,26,n>9?C.coral:n>7?C.amber:C.green,'none',4)+TBF(bx(n)+8,243,String(n),15,C.ink,'start');
  out+=L(bx(7),218,bx(7),258,C.ink,2,'stroke-dasharray="4 3"')+TF(bx(7),274,'typical span ≈ 7',13,C.ink);
  out+=R(40,296,520,62,'#f6f9fb','none',8)+TF(300,320,'The same trick with letters: F B I C I A N A S A is ten letters,',13,C.ink)+TF(300,342,'but only three chunks (FBI, CIA, NASA) if you know the acronyms.',13,C.ink);
  return {svg:out,phase:k===3?'Six octal digits fit comfortably within span, and each one carries 3 bits: the same 18 bits now fit. The cost is learning to recode quickly.':'Raw, the string is far over span. Recoding trades many small items for fewer meaningful ones.'};
 }});

// Chase & Simon (1973): recall of a briefly seen chess position by skill level.
const D3_REAL=[['g1','K',0],['f1','R',0],['f2','P',0],['g2','P',0],['h2','P',0],['f3','N',0],['e2','B',0],['d1','Q',0],['a1','R',0],['a2','P',0],['b2','P',0],['d4','P',0],['e3','P',0],
 ['g8','K',1],['f8','R',1],['f7','P',1],['g7','P',1],['h7','P',1],['f6','N',1],['e7','B',1],['d8','Q',1],['a8','R',1],['a7','P',1],['b7','P',1],['d5','P',1],['e6','P',1]];
const D3_CHUNKS=[[['g1','f1','f2','g2','h2'],C.green,'castled king'],[['g8','f8','f7','g7','h7'],C.green,''],[['d4','e3'],C.purple,'pawn chain'],[['d5','e6'],C.purple,''],[['f3','e2'],C.amber,'developed pieces'],[['f6','e7'],C.amber,'']];
const D3_sq=sq=>[sq.charCodeAt(0)-97,Number(sq[1])-1];
SCENE({id:'chunking-experts',name:'Chunks in chess',tag:'Expertise is memory for patterns',
 definition:'After a five-second look at a chess position from a real game, masters can put back far more pieces than beginners. Shown the same pieces placed at random, their advantage almost vanishes: experts remember familiar patterns (chunks), not more pieces.',
 example:'Chase and Simon’s master replaced about 16 pieces from a real middlegame after one look, a class A player about 8 and a beginner about 4. From random positions, all three managed only a few.',
 research:'de Groot (1946/1965). Thought and Choice in Chess; Chase, W. G. & Simon, H. A. (1973). Perception in chess. Cognitive Psychology 4, 55–81. Replicated; Gobet & Simon (1996) found masters keep a small advantage even on random positions.',
 desc:'A chessboard with a typical middlegame position, chunks outlined, or the same pieces scattered at random; bars show how many pieces players of three skill levels recalled after a five-second look.',
 dur:10,hint:'Switch between a real position and a random one, and show the chunks a player would see. The bar heights are approximate first-trial values.',
 init:()=>({kind:'real',chunks:1,seed:8}),
 watch(p){return {kind:p<.55?'real':'random',chunks:p>.2&&p<.55?1:0,seed:8}},
 ui:[{choose:[['real','Real game'],['random','Random']],label:'Position',get:s=>s.kind,act:'kind'},{choose:[[1,'Show chunks'],[0,'Hide chunks']],label:'Chunks',get:s=>s.chunks,act:'ch'},{b:'Shuffle random',act:'fresh'}],
 on:{kind(s,v){s.kind=v},ch(s,v){s.chunks=Number(v)},fresh(s){s.seed=D3_nx(s.seed);s.kind='random'}},
 draw(s){
  const c=34,bx=40,by=50;let out=heading(s.kind==='real'?'A position from a real game':'The same pieces, placed at random');
  for(let f=0;f<8;f++)for(let r=0;r<8;r++)out+=R(bx+f*c,by+(7-r)*c,c,c,(f+r)%2?'#f3efe6':'#c9b48f','none',0);
  for(let f=0;f<8;f++)out+=TF(bx+f*c+c/2,by+8*c+17,'abcdefgh'[f],13,C.muted);for(let r=0;r<8;r++)out+=TF(bx-9,by+(7-r)*c+c/2+5,String(r+1),13,C.muted,'end');
  const sqs=s.kind==='real'?D3_REAL.map(p=>D3_sq(p[0])):shuffled(range(64),s.seed).slice(0,D3_REAL.length).map(i=>[i%8,i>>3]);
  if(s.kind==='real'&&s.chunks)D3_CHUNKS.forEach(([list,col,lab])=>{const ps=list.map(D3_sq),fs=ps.map(p=>p[0]),rs=ps.map(p=>p[1]),x0=bx+Math.min(...fs)*c+2,x1=bx+(Math.max(...fs)+1)*c-2,y0=by+(7-Math.max(...rs))*c+2,y1=by+(8-Math.min(...rs))*c-2;out+=R(x0,y0,x1-x0,y1-y0,'none',col,8,'stroke-width="3"')});
  D3_REAL.forEach((p,i)=>{const [f,r]=sqs[i],x=bx+f*c+c/2,y=by+(7-r)*c+c/2;out+=Ci(x,y,13,p[2]?C.ink:'#fff',C.ink)+TBF(x,y+5,p[1],13,p[2]?'#fff':C.ink)});
  const lv=[['master',16,3],['class A',8,2.5],['beginner',4,2.5]],base=300,sc=9;
  out+=TF(468,62,'pieces recalled after 5 s',13,C.muted);
  lv.forEach(([n,real,rnd],i)=>{const x=370+i*70,v=s.kind==='real'?real:rnd;out+=R(x,base-v*sc,46,v*sc,s.kind==='real'?C.blue:C.coral,'none',4)+TBF(x+23,base-v*sc-6,s.kind==='real'?String(v):'≈'+v,13,C.ink)+TF(x+23,base+18,n,13,C.muted)});
  out+=L(360,base,576,base,C.line,1.5)+TF(468,base+44,'of 26 pieces · approximate first-trial values',13,C.muted);
  if(s.kind==='real'&&s.chunks)out+=TF(468,92,'green: castled king · purple: pawn chain',13,C.muted)+TF(468,112,'amber: developed pieces',13,C.muted);
  return {svg:out,phase:s.kind==='real'?'A master sees the castled king and pawn chain as single familiar units, so five or six chunks hold most of the board. A beginner sees 26 separate pieces.':'At random there are no familiar patterns to chunk, so the master is almost back to a beginner’s span: the expertise was in the patterns, not in a bigger memory.'};
 }});

/* ======================= Lesson: selective-attention ======================= */
const D3_INK=[['RED','#c62d2d'],['BLUE',C.blue],['GREEN',C.green],['PURPLE',C.purple]];
const D3_CONDS=['congruent','incongruent','neutral'];
function D3_stroop(seed,t){const r=rng(seed*7+t*131+1),cond=D3_CONDS[t%3],ink=Math.floor(r()*4);const word=cond==='congruent'?D3_INK[ink][0]:cond==='neutral'?'XXXX':D3_INK[(ink+1+Math.floor(r()*3))%4][0];return {cond,ink,word}}
const D3_STROOP_SIM={congruent:.6,neutral:.64,incongruent:.74};
function D3_stroopShow(s){s.trial=D3_stroop(s.seed,s.order[s.i]);s.blank=false;s.t0=performance.now()}
SCENE({id:'selective-attention',name:'The Stroop effect',tag:'Be the participant',
 definition:'Naming the ink colour of a word is slower when the word names a different colour. Reading is so practised that the word’s meaning gets in even when you try to ignore it: attention cannot simply switch reading off.',
 example:'BLUE printed in red ink takes longer to answer “red” than XXXX in red ink, and longest of all compared with RED in red.',
 research:'Stroop, J. R. (1935). Studies of interference in serial verbal reactions. J. Exp. Psychol. 18, 643–662; MacLeod, C. M. (1991). Half a century of research on the Stroop effect. Psychological Bulletin 109, 163–203. One of the most replicated findings in psychology.',
 desc:'A colour word in coloured ink, four answer buttons for the ink colour, and bars of mean response time for congruent, neutral and incongruent trials.',
 dur:11,hint:'Press Start, then press the button for the INK colour, ignoring what the word says. 24 trials take about a minute. Nothing leaves the page.',
 init:()=>({phase:'idle',i:0,order:[],trial:null,blank:false,t0:0,seed:21,tok:0,errors:0,data:{congruent:[],incongruent:[],neutral:[]}}),
 watch(p){const t=Math.floor(p*24),tr=D3_stroop(4,t),k=Math.min(3,Math.floor(p*4)),data={congruent:[],incongruent:[],neutral:[]};if(k>=1)data.neutral=[D3_STROOP_SIM.neutral];if(k>=2)data.congruent=[D3_STROOP_SIM.congruent];if(k>=3)data.incongruent=[D3_STROOP_SIM.incongruent];return {phase:'run',i:t,trial:tr,blank:(p*24)%1>.8,errors:0,data,sim:true}},
 ui:[{b:'Start',act:'go'}],
 on:{go(s){s.seed=D3_nx(s.seed);s.order=shuffled(range(24),s.seed);s.i=0;s.errors=0;s.data={congruent:[],incongruent:[],neutral:[]};s.phase='run';D3_stroopShow(s)},
  ans(s,c,ctx){if(s.phase!=='run'||s.blank)return;c=Number(c);const rt=(performance.now()-s.t0)/1000;if(c===s.trial.ink){if(rt<3)s.data[s.trial.cond].push(rt)}else s.errors++;s.blank=true;s.tok++;ctx.later(350,'next',s.tok)},
  next(s,t){if(Number(t)!==s.tok)return;s.i++;if(s.i>=24){s.phase='done';s.blank=true}else D3_stroopShow(s)}},
 draw(s,f,X){
  let out=heading('Press the INK colour, not the word');
  out+=R(150,46,300,104,'#fff',C.grid,10);
  if(s.phase==='run'&&!s.blank&&s.trial)out+=TBF(300,116,s.trial.word,46,D3_INK[s.trial.ink][1],'middle','letter-spacing="2"');
  else out+=TF(300,108,s.phase==='idle'?(X.try?'Press Start':''):s.phase==='done'?'Finished':'+',s.phase==='run'?26:15,C.muted);
  D3_INK.forEach(([n,col],j)=>{const x=40+j*134;out+=hit(X,'ans',j,`Ink colour ${n.toLowerCase()}`,R(x,164,120,42,'#fff',C.line,8)+R(x+10,175,20,20,col,'none',4)+TB(x+70,191,n.toLowerCase(),15,C.ink))});
  const base=332,sc=110;out+=L(70,base,330,base,C.line,1.5);
  D3_CONDS.forEach((c,i)=>{const d=s.data[c],m=D3_mean(d),x=88+i*82;if(d.length){const h=clamp(m,0,1.4)*sc;out+=R(x,base-h,60,h,c==='incongruent'?C.coral:c==='congruent'?C.green:C.blue,'none',4)+TBF(x+30,base-h-6,D3_ms(m),13,C.ink)}out+=TF(x+30,base+18,c,13,C.muted)});
  const ci=s.data.congruent,ii=s.data.incongruent,ok=ci.length>=2&&ii.length>=2;
  out+=R(360,226,226,110,'#fff',C.grid,8)+TF(473,248,s.sim?'simulated participant':`trial ${Math.min(s.i+1,24)} of 24 · errors ${s.errors}`,13,C.muted);
  out+=TF(473,276,'interference: incongruent − congruent',13,C.muted)+TB(473,306,ok?D3_ms(D3_mean(ii)-D3_mean(ci)):'—',20,C.coral);
  out+=TF(473,328,'often about 50–150 ms',13,C.muted);
  return {svg:out,phase:ok?(D3_mean(ii)>D3_mean(ci)?'Your incongruent trials were slower: the word’s meaning was read even though you were trying to ignore it.':'No slowing this time; with few trials, chance can hide the effect. Try another run.'):'Congruent: the word matches the ink. Incongruent: it names another colour. Neutral: XXXX. The gap between incongruent and congruent is the Stroop interference.'};
 }});

const D3_EV=[
 {id:'tone',l:'Tone',what:'a steady 400 Hz tone',v:'Usually noticed',col:C.green,lines:['Physical changes get through: Cherry’s listeners','reported a tone in the ignored ear.']},
 {id:'voice',l:'Voice change',what:'man’s voice → woman’s voice',v:'Usually noticed',col:C.green,lines:['A change of speaker (pitch and voice quality) is','noticed, even though the words are not.']},
 {id:'lang',l:'Language',what:'English → German',v:'Usually missed',col:C.coral,lines:['Listeners could not say what language the ignored','speech was in, or whether it changed.']},
 {id:'rev',l:'Backwards',what:'speech is played backwards',v:'Usually missed',col:C.coral,lines:['Reversed speech keeps the voice but loses the words;','most listeners noticed nothing odd.']},
 {id:'rep',l:'Repeated words',what:'words repeated 35 times',v:'Not remembered',col:C.coral,lines:['Moray (1959): words heard 35 times in the ignored','ear were recognised no better than new words.']},
 {id:'name',l:'Own name',what:'the listener’s own name',v:'About a third notice',col:C.amber,lines:['Moray (1959); Wood & Cowan (1995) replicated about 1 in 3,','more often in people with lower working-memory span.']}];
SCENE({id:'selective-attention-cocktail',name:'The cocktail party',tag:'Shadowing one ear',
 definition:'In dichotic listening a different message goes to each ear and the listener repeats one of them aloud (shadowing). Colin Cherry (1953) found that almost nothing of the meaning of the other message was reported, though its physical qualities were.',
 example:'Ask someone who shadowed the left ear what was said on the right: they can tell you it was a voice, perhaps a woman’s, but not what it said or even which language.',
 research:'Cherry, E. C. (1953). Some experiments on the recognition of speech, with one and with two ears. JASA 25, 975–979; Moray (1959), QJEP 11; Wood & Cowan (1995), JEP:LMC 21 (own name: about a third, replicated); Conway, Cowan & Bunting (2001).',
 desc:'A listener seen from above with a message in each ear: one ear shadowed aloud, the other ignored, with a chosen event inserted in the ignored message and whether listeners notice it.',
 dur:12,hint:'Choose which ear is shadowed and what happens in the ignored ear, then read whether listeners in the classic studies noticed it.',
 init:()=>({ear:'L',ev:5}),
 watch(p){return {ear:p<.5?'L':'R',ev:Math.min(5,Math.floor(p*6))}},
 ui:[{choose:[['L','Shadow left'],['R','Shadow right']],label:'Shadowed ear',get:s=>s.ear,act:'ear'},{choose:D3_EV.map((e,i)=>[i,e.l]),label:'In the ignored ear',get:s=>s.ev,act:'ev'}],
 on:{ear(s,v){s.ear=v},ev(s,v){s.ev=Number(v)}},
 draw(s){
  const e=D3_EV[s.ev],att=['the ship sailed out','past the lighthouse','as the fog lifted','over the quiet bay','and the gulls rose'],ign=['seven men walked','down to the market','to buy fresh bread'];
  let out=heading(`Shadowing the ${s.ear==='L'?'left':'right'} ear: what gets through from the other?`);
  const panel=(x,attended)=>{let o=R(x,52,190,190,attended?'#fff':'#f3f6f8',attended?C.blue:C.line,10)+TB(x+95,74,attended?'shadowed (repeat aloud)':'ignored',14,attended?C.blue:C.muted);
   if(attended)att.forEach((l,i)=>o+=TF(x+95,104+i*24,l,13,C.ink));
   else{ign.forEach((l,i)=>o+=TF(x+95,104+i*22,l,13,C.line));o+=R(x+10,172,170,58,C.amberp,e.col,8)+TF(x+95,194,'then:',13,C.muted)+TF(x+95,216,e.what,13,C.ink)}
   return o};
  const lx=20,rx=390;out+=panel(lx,s.ear==='L')+panel(rx,s.ear==='R');
  out+=Ci(300,150,42,'#f1e4d3',C.muted)+`<ellipse cx="256" cy="150" rx="7" ry="14" fill="#f1e4d3" stroke="${C.muted}" stroke-width="2"/><ellipse cx="344" cy="150" rx="7" ry="14" fill="#f1e4d3" stroke="${C.muted}" stroke-width="2"/>`+P('M290 118Q300 110 310 118',C.muted,2)+TF(300,206,'headphones',13,C.muted);
  out+=arrow(212,150,246,150,s.ear==='L'?C.blue:C.line,s.ear==='L'?3:1.6)+arrow(388,150,354,150,s.ear==='R'?C.blue:C.line,s.ear==='R'?3:1.6);
  out+=R(20,262,560,100,'#fff',C.grid,10)+TB(300,290,e.v,18,e.col)+TF(300,316,e.lines[0],13,C.ink)+TF(300,338,e.lines[1],13,C.ink);
  return {svg:out,phase:'Physical features (a tone, a voice change) get through; meaning mostly does not, unless it matters a great deal to you, such as your own name. That pattern is what the filter theories in the next scene try to explain.'};
 }});

const D3_MODELS=[{id:'early',n:'Early filter (Broadbent 1958)',pred:[1,0,0,0]},{id:'atten',n:'Attenuation (Treisman 1960)',pred:[1,1,1,1]},{id:'late',n:'Late selection (Deutsch & Deutsch 1963)',pred:[1,1,1,1]}];
const D3_FIND=[{n:'Meaning of the ignored ear is lost',src:'Cherry (1953)',why:'Cherry (1953): listeners report voice and tone, not words. All three models can explain this.'},
 {n:'Your own name gets through',src:'Moray (1959); Wood & Cowan (1995)',why:'Moray (1959): about a third notice. A full early filter cannot let any meaning through.'},
 {n:'“Dear Aunt Jane” across ears',src:'Gray & Wedderburn (1960)',why:'Gray & Wedderburn (1960): words split between ears are reported in meaningful order, so meaning guided selection.'},
 {n:'Shadowing follows the story',src:'Treisman (1960)',why:'Treisman (1960): when the story jumps ears, people briefly shadow the wrong ear, so the ignored ear was understood a little.'}];
SCENE({id:'selective-attention-filter',name:'Where is the filter?',tag:'Early, attenuated or late',
 definition:'Theories of attention disagree on where unattended information is stopped. Broadbent’s early filter blocks it after basic physical analysis; Treisman’s attenuation turns it down so that important words can still break through; late-selection theories let everything be understood and select only for memory and response.',
 example:'Hearing your own name from across a noisy room fits attenuation: the ignored conversation is weakened, but a word with a very low threshold, your name, still triggers recognition.',
 research:'Broadbent, D. E. (1958). Perception and Communication; Treisman, A. M. (1960). Contextual cues in selective listening. QJEP 12, 242–248; Deutsch & Deutsch (1963), Psych. Review 70; Lavie (1995), JEP:HPP 21: perceptual load decides how early selection happens.',
 desc:'A flow diagram from two ears through a sensory buffer, a filter and meaning analysis to awareness, redrawn for each theory, above a table of four classic findings and which theory explains each.',
 dur:12,hint:'Choose a theory to see where it puts the filter, and choose a finding to see which theories can explain it.',
 init:()=>({m:1,fi:1}),
 watch(p){return {m:Math.min(2,Math.floor(p*3)),fi:Math.floor(p*12)%4}},
 ui:[{choose:[[0,'Early filter'],[1,'Attenuation'],[2,'Late selection']],label:'Theory',get:s=>s.m,act:'m'},{choose:D3_FIND.map((f,i)=>[i,String(i+1)]),label:'Finding',get:s=>s.fi,act:'fi'}],
 on:{m(s,v){s.m=Number(v)},fi(s,v){s.fi=Number(v)}},
 draw(s){
  const m=D3_MODELS[s.m];let out=heading(m.n);
  const y1=86,y2=136;out+=TF(36,y1+5,'L ear',13,C.ink,'start')+TF(36,y2+5,'R ear',13,C.ink,'start');
  out+=box(96,66,96,90,'',C.pale)+TF(144,100,'sensory',13,C.ink)+TF(144,118,'buffer',13,C.ink)+arrow(76,y1,94,y1,C.blue,2.5)+arrow(76,y2,94,y2,C.muted,2);
  out+=box(326,66,110,90,'',C.greenp)+TF(381,108,'meaning',13,C.ink)+box(478,66,102,90,'',C.amberp)+TF(529,100,'awareness,',13,C.ink)+TF(529,118,'response',13,C.ink);
  const fx=s.m===2?452:258,valve=x=>P(`M${x-12} 60L${x+12} 60L${x+4} 111L${x+4} 162L${x-4} 162L${x-4} 111Z`,C.coral,2,C.coralp)+TF(x,180,'filter',13,C.coral);
  // Attended channel: full strength to the end.
  out+=arrow(194,y1,s.m===2?324:250,y1,C.blue,3)+(s.m===2?arrow(438,y1,474,y1,C.blue,3):arrow(266,y1,324,y1,C.blue,3)+arrow(438,y1,474,y1,C.blue,3));
  if(s.m===0)out+=L(194,y2,246,y2,C.muted,2)+TF(258,206,'blocked',13,C.coral);
  if(s.m===1)out+=L(194,y2,246,y2,C.muted,2)+arrow(270,y2,324,y2,C.muted,1.4,8,'stroke-dasharray="4 4"')+TF(296,206,'turned down, not off',13,C.coral);
  if(s.m===2)out+=arrow(194,y2,324,y2,C.muted,2)+L(438,y2,444,y2,C.muted,2)+TF(452,206,'selected after meaning',13,C.coral);
  out+=valve(fx);
  const ty=228;out+=TF(36,ty,'finding',13,C.muted,'start');['early','atten.','late'].forEach((h,j)=>out+=TF(420+j*62,ty,h,13,j===s.m?C.ink:C.muted));
  D3_FIND.forEach((fd,i)=>{const y=ty+12+i*24,on=i===s.fi;if(on)out+=R(28,y,556,22,C.pale,'none',4);out+=TF(36,y+16,`${i+1}. ${fd.n}`,13,C.ink,'start');
   D3_MODELS.forEach((md,j)=>out+=TBF(420+j*62,y+16,md.pred[i]?'✓':'✗',14,md.pred[i]?C.green:C.coral))});
  out+=TF(300,350,D3_FIND[s.fi].src,13,C.muted);
  return {svg:out,phase:`${D3_FIND[s.fi].why} Late selection explains everything but predicts too much: ignored meaning should then always be available. Lavie (1995) suggested selection is early when perception is heavily loaded and late when it is not.`};
 }});

/* ======================= Lesson: signal-detection ======================= */
const D3_GRID=10,D3_SIG=[3,4,5,6];
function D3_noise(seed,present,str){const r=rng(seed),g=[];for(let y=0;y<D3_GRID;y++)for(let x=0;x<D3_GRID;x++){let v=.5+.17*D3_gauss(r);if(present&&D3_SIG.includes(x)&&D3_SIG.includes(y))v+=.045*str;g.push(clamp(v,0,1))}return g}
const D3_grey=v=>{const c=Math.round(255*(1-v));return `rgb(${c},${c},${c})`};
// d′ and c from counts, with the log-linear correction.
function D3_sdt(resp){const sig=resp.filter(e=>e.p),noi=resp.filter(e=>!e.p),h=sig.filter(e=>e.r).length,fa=noi.filter(e=>e.r).length;
 const H=(h+.5)/(sig.length+1),F=(fa+.5)/(noi.length+1),zH=D3_z(H),zF=D3_z(F);return {nS:sig.length,nN:noi.length,h,fa,H,F,d:zH-zF,c:-(zH+zF)/2}}
const D3_SIM_RESP=(()=>{const r=rng(77),o=[];for(let i=0;i<30;i++){const p=i%2;o.push({p,r:r()<(p?.77:.23)?1:0})}return o})();
SCENE({id:'signal-detection',name:'Yes or no?',tag:'Be the participant',
 definition:'Signal detection theory separates two things that an accuracy score mixes up: sensitivity (d′), how well signal trials can be told from noise trials, and criterion (c), how willing someone is to say “yes”.',
 example:'Two observers each catch 80% of faint signals. One says “yes” to 40% of empty trials, the other to 5%. The second is far more sensitive; the first just says yes more readily.',
 research:'Tanner, W. P. & Swets, J. A. (1954). A decision-making theory of visual detection. Psychological Review 61, 401–409; Green, D. M. & Swets, J. A. (1966). Signal Detection Theory and Psychophysics. Wiley. A standard, robust method.',
 desc:'A grid of noisy grey squares flashes for half a second; sometimes a slightly darker patch is hidden in its centre. Your yes-or-no answers are scored as hit and false-alarm rates and placed in ROC space with curves of equal d′.',
 dur:12,hint:'Press Start. For each flash, answer Yes if you think the darker centre patch was there, No if not. 30 trials, half with the patch. Nothing leaves the page.',
 init:()=>({phase:'idle',i:0,order:[],resp:[],str:3,seed:31,tok:0}),
 watch(p){const n=Math.min(30,Math.floor(p*31));return {phase:(p*31)%1<.6?'show':'ask',i:n%30,order:D3_SIM_RESP.map(e=>e.p),resp:D3_SIM_RESP.slice(0,n),str:3,seed:5,tok:0,sim:true}},
 ui:[{range:'str',label:'Patch darkness',min:1,max:5,get:s=>s.str,act:'str'},{b:'Start',act:'go'}],
 on:{str(s,v){s.str=Number(v)},go(s,a,ctx){s.seed=D3_nx(s.seed);s.order=shuffled(range(30).map(i=>i%2),s.seed);s.i=0;s.resp=[];D3_sdShow(s,ctx)},
  mask(s,t){if(Number(t)===s.tok&&s.phase==='show')s.phase='ask'},
  ans(s,v,ctx){if(s.phase!=='show'&&s.phase!=='ask')return;s.resp.push({p:s.order[s.i],r:Number(v)});s.i++;if(s.i>=30){s.phase='done';return}s.phase='gap';s.tok++;ctx.later(350,'again',s.tok)},
  again(s,t,ctx){if(Number(t)===s.tok)D3_sdShow(s,ctx)}},
 draw(s,f,X){
  let out=heading('Was the darker patch in the middle?');
  const gx=40,gy=52,cz=20,show=s.phase==='show';
  if(show){const g=D3_noise(s.seed*97+s.i,s.order[s.i],s.str);g.forEach((v,k)=>out+=R(gx+(k%D3_GRID)*cz,gy+Math.floor(k/D3_GRID)*cz,cz,cz,D3_grey(v),'none',0))}
  else{const r=rng(999+s.i);for(let k=0;k<D3_GRID*D3_GRID;k++)out+=R(gx+(k%D3_GRID)*cz,gy+Math.floor(k/D3_GRID)*cz,cz,cz,(k+Math.floor(k/D3_GRID))%2?'#9aa7ae':'#d5dbde','none',0)}
  out+=R(gx+3*cz,gy+3*cz,4*cz,4*cz,'none',C.amber,2,'stroke-dasharray="5 4"');
  out+=TF(140,272,s.phase==='idle'?(X.try?'Press Start':''):s.phase==='done'?'Finished: see your d′':`trial ${Math.min(s.i+1,30)} of 30${show?'':' · answer now'}`,13,C.muted);
  out+=D3_key(X,'ans',1,'Yes, the patch was there',40,284,95,40,'Yes')+D3_key(X,'ans',0,'No patch',145,284,95,40,'No');
  const px=320,py=52,pw=200,ph=190,Xp=v=>px+v*pw,Yp=v=>py+ph-v*ph;out+=R(px,py,pw,ph,'#fff',C.grid,4);
  [0,.5,1].forEach(v=>out+=TF(Xp(v),py+ph+17,String(v),13,C.muted)+TF(px-6,Yp(v)+5,String(v),13,C.muted,'end'));
  out+=TF(px+pw/2,py+ph+34,'false-alarm rate',13,C.muted)+TF(px+pw+8,py+ph/2,'hit rate',13,C.muted,'start');
  out+=L(Xp(0),Yp(0),Xp(1),Yp(1),C.line,1.5,'stroke-dasharray="4 4"');
  [.5,1,2].forEach(d=>{const pts=range(41).map(i=>{const F=i/40;return [Xp(F),Yp(D3_Phi(d+D3_z(Math.max(F,1e-4))))]});out+=D3_poly(pts,C.green,1.5)});out+=TF(Xp(.97),Yp(.05),'curves: d′ = 0.5, 1, 2',13,C.green,'end');
  const st=D3_sdt(s.resp),ok=st.nS>=4&&st.nN>=4;
  if(ok)out+=Ci(Xp(st.F),Yp(st.H),8,s.sim?C.blue:C.coral,'#fff');
  out+=R(260,292,326,74,'#fff',C.grid,8);
  out+=ok?TF(423,320,`hits ${st.h}/${st.nS} · false alarms ${st.fa}/${st.nN}`,13,C.ink)+TBF(423,348,`d′ = ${st.d.toFixed(2)} · c = ${st.c.toFixed(2)}`,15,s.sim?C.blue:C.coral):TF(423,336,'Scores appear after a few trials of each kind',13,C.muted);
  return {svg:out,phase:ok?`${s.sim?'The simulated observer':'You'} said yes to ${Math.round(st.H*100)}% of patch trials and ${Math.round(st.F*100)}% of empty ones. d′ ${st.d.toFixed(1)} measures sensitivity; c ${st.c>.15?'above 0: cautious':st.c<-.15?'below 0: liberal':'near 0: neutral'} about saying yes.`:'Every answer is a hit, a miss, a false alarm or a correct rejection. Hits alone cannot tell good eyes from a habit of saying yes.'};
 }});
function D3_sdShow(s,ctx){s.phase='show';s.tok++;ctx.later(500,'mask',s.tok)}

SCENE({id:'signal-detection-criterion',name:'Sensitivity and criterion',tag:'Two overlapping curves',
 definition:'In signal detection theory each trial produces an internal value that is noisy. Noise trials and signal trials give overlapping bell curves, d′ apart in standard units. The observer says “yes” above a criterion. Moving the criterion trades misses for false alarms; only better sensitivity (larger d′) reduces both.',
 example:'A radiologist screening for cancer should set a low (liberal) criterion, because a miss costs more than a false alarm. An email filter should set a high (cautious) one, because losing real mail is worse than letting spam through.',
 research:'Green & Swets (1966). Signal Detection Theory and Psychophysics; Macmillan, N. A. & Creelman, C. D. (2005). Detection Theory: A User’s Guide, 2nd edn. Erlbaum. Equal-variance normal model, the textbook case.',
 desc:'Two bell curves for noise and signal along an axis of internal evidence, with a movable criterion line; shaded areas show hits and false alarms and the four outcome rates are listed below.',
 dur:10,hint:'Move the criterion and change d′, or pick a situation to see where its criterion should sit.',
 init:()=>({d:1.5,c:0}),
 watch(p){return p<.5?{d:1.5,c:lerp(-1.2,1.2,smooth(p*2))}:{d:lerp(.4,3,smooth(p*2-1)),c:0}},
 ui:[{range:'d',label:'Sensitivity d′',min:0,max:30,get:s=>Math.round(s.d*10),act:'d',show:v=>(v/10).toFixed(1)},{range:'c',label:'Criterion c',min:-15,max:15,get:s=>Math.round(s.c*10),act:'c',show:v=>(v/10).toFixed(1)},
  {choose:[['n','Neutral'],['scr','Cancer screening'],['spam','Spam filter']],label:'Situation',get:s=>s.c<-.3?'scr':s.c>.3?'spam':'n',act:'pre'}],
 on:{d(s,v){s.d=Number(v)/10},c(s,v){s.c=Number(v)/10},pre(s,v){s.c=v==='scr'?-.8:v==='spam'?.8:0}},
 draw(s){
  const d=s.d,k=d/2+s.c,x0=40,x1=560,lo=-3.5,hi=6,Xv=v=>x0+(v-lo)/(hi-lo)*(x1-x0),base=230,amp=150,pdf=(v,m)=>Math.exp(-((v-m)**2)/2);
  let out=heading(`d′ = ${d.toFixed(1)} · criterion c = ${s.c.toFixed(1)}`);
  const area=(m,col)=>{const pts=[[Xv(k),base]];for(let v=k;v<=hi;v+=.05)pts.push([Xv(v),base-amp*pdf(v,m)]);pts.push([Xv(hi),base]);return `<path d="M${pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L')}Z" fill="${col}" opacity=".55"/>`};
  out+=area(0,C.coralp)+area(d,C.greenp);
  const curve=m=>D3_poly(range(191).map(i=>{const v=lo+i*(hi-lo)/190;return [Xv(v),base-amp*pdf(v,m)]}),m?C.green:C.coral,2.5);
  out+=curve(0)+curve(d)+L(x0,base,x1,base,C.line,1.5);
  out+=TB(Xv(0),base-amp-8,'noise',14,C.coral)+TB(Xv(d)+(d<.8?30:0),base-amp-8-(d<.8?0:0),'signal',14,C.green,d<.8?'start':'middle');
  out+=L(Xv(k),56,Xv(k),base+8,C.ink,2.5)+TF(Xv(k),base+24,'say “yes” to the right',13,C.ink);
  const H=1-D3_Phi(k-d),F=1-D3_Phi(k);
  const tiles=[['hits',H,C.green],['misses',1-H,C.muted],['false alarms',F,C.coral],['correct rejections',1-F,C.muted]];
  tiles.forEach(([n,v,col],i)=>out+=counter(30+i*138,276,n,Math.round(v*100)+'%',col,128));
  out+=TF(300,350,'internal evidence (standard units) →',13,C.muted);
  return {svg:out,phase:s.c<-.3?'A liberal criterion: few misses, many false alarms. Right when missing the signal is costly, as in screening.':s.c>.3?'A cautious criterion: few false alarms, more misses. Right when a false alarm is costly.':'Moving the criterion swaps one kind of error for the other. Only pulling the curves apart, a larger d′, reduces both at once.'};
 }});

SCENE({id:'signal-detection-roc',name:'The ROC curve',tag:'One sensitivity, many criteria',
 definition:'A receiver operating characteristic (ROC) curve plots hit rate against false-alarm rate as the criterion moves. Every point on one curve has the same sensitivity. The area under the curve (AUC) is the chance that a random signal trial produces more evidence than a random noise trial.',
 example:'A screening test with AUC 0.9 ranks a randomly chosen patient with the disease above one without it 9 times out of 10, whichever threshold doctors then choose.',
 research:'Swets, J. A. (1988). Measuring the accuracy of diagnostic systems. Science 240, 1285–1293; Green & Swets (1966). Now standard in medicine, machine learning and weather forecasting.',
 desc:'An ROC square with the curve for the chosen d′ and a point that slides along it as the criterion moves, beside the area under the curve and the current hit and false-alarm rates.',
 dur:10,hint:'Slide the criterion to travel along the curve; raise d′ to bow the curve towards the top-left corner.',
 init:()=>({d:1.5,c:0}),
 watch(p){return {d:p<.6?1.5:lerp(1.5,3,smooth((p-.6)/.4)),c:p<.6?lerp(-1.5,1.5,smooth(p/.6)):0}},
 ui:[{range:'d',label:'Sensitivity d′',min:0,max:30,get:s=>Math.round(s.d*10),act:'d',show:v=>(v/10).toFixed(1)},{range:'c',label:'Criterion c',min:-20,max:20,get:s=>Math.round(s.c*10),act:'c',show:v=>(v/10).toFixed(1)}],
 on:{d(s,v){s.d=Number(v)/10},c(s,v){s.c=Number(v)/10}},
 draw(s){
  const d=s.d,k=d/2+s.c,H=1-D3_Phi(k-d),F=1-D3_Phi(k),auc=D3_Phi(d/Math.SQRT2);let out=heading(`d′ = ${d.toFixed(1)}: area under the curve = ${auc.toFixed(2)}`);
  const px=80,py=52,pw=250,ph=250,Xp=v=>px+v*pw,Yp=v=>py+ph-v*ph;out+=R(px,py,pw,ph,'#fff',C.grid,4);
  [0,.25,.5,.75,1].forEach(v=>out+=TF(Xp(v),py+ph+17,String(v),13,C.muted)+TF(px-6,Yp(v)+5,String(v),13,C.muted,'end'));
  out+=TF(px+pw/2,py+ph+36,'false-alarm rate',13,C.muted)+TF(px-44,py+ph/2,'hit rate',13,C.muted,'middle',`transform="rotate(-90 ${px-44} ${py+ph/2})"`);
  const roc=dd=>range(121).map(i=>{const kk=6-i*.1;return [Xp(1-D3_Phi(kk)),Yp(1-D3_Phi(kk-dd))]});
  [1,2,3].forEach(dd=>out+=D3_poly(roc(dd),C.grid,1.5));
  const pts=roc(d);out+=`<path d="M${Xp(0)} ${Yp(0)}L${pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L')}L${Xp(1)} ${Yp(0)}Z" fill="${C.greenp}" opacity=".6"/>`+D3_poly(pts,C.green,3);
  out+=L(Xp(0),Yp(0),Xp(1),Yp(1),C.line,1.5,'stroke-dasharray="4 4"')+TF(Xp(.72),Yp(.62),'chance',13,C.muted);
  out+=Ci(Xp(F),Yp(H),9,C.coral,'#fff');
  out+=R(360,64,224,236,'#fff',C.grid,10)+TF(472,90,'current criterion',13,C.muted)+TBF(472,118,`hits ${Math.round(H*100)}%`,16,C.green)+TBF(472,144,`false alarms ${Math.round(F*100)}%`,16,C.coral);
  out+=TF(472,184,'area under the curve',13,C.muted)+TB(472,214,auc.toFixed(2),26,C.ink)+TF(472,244,'0.5 = guessing, 1 = perfect',13,C.muted)+TF(472,276,'same curve for any criterion',13,C.muted);
  return {svg:out,phase:'Moving the criterion slides the point along the curve without changing the area. Only a more sensitive observer or test pushes the whole curve toward the top-left corner.'};
 }});

/* ======================= Lesson: mental-rotation ======================= */
const D3_SHAPES=[[[1,0],[2,0],[0,1],[1,1],[1,2]],[[0,0],[0,1],[1,1],[1,2],[1,3]],[[0,0],[1,0],[0,1],[1,1],[0,2]],[[1,0],[0,1],[1,1],[1,2],[1,3]]];
const D3_ANG=[0,45,90,135,180];
function D3_shape(cells,cx,cy,sz,ang,mirror,col){
 const pts=cells.map(([x,y])=>[mirror?-x:x,y]),mx=D3_mean(pts.map(p=>p[0]))+.5,my=D3_mean(pts.map(p=>p[1]))+.5,a=ang*Math.PI/180,ca=Math.cos(a),sa=Math.sin(a);
 const tr=(x,y)=>{x-=mx;y-=my;return [cx+(x*ca-y*sa)*sz,cy+(x*sa+y*ca)*sz]};
 return pts.map(([x,y])=>`<polygon points="${[[x,y],[x+1,y],[x+1,y+1],[x,y+1]].map(q=>tr(q[0],q[1]).map(fmt).join(',')).join(' ')}" fill="${col}" stroke="#fff" stroke-width="2"/>`).join('');
}
function D3_mrTrial(seed,t){const r=rng(seed*13+t*7+3),ang=D3_ANG[t%5],mir=Math.floor(t/5)%2,sign=t>=10?-1:1;return {ang,sign,mir,shape:Math.floor(r()*4)}}
const D3_MR_SIM=a=>.6+.0024*a;
function D3_mrShow(s){s.trial=D3_mrTrial(s.seed,s.order[s.i]);s.blank=false;s.t0=performance.now()}
SCENE({id:'mental-rotation',name:'Turning shapes in the mind',tag:'Be the participant',
 definition:'To decide whether two shapes are the same or mirror images, people imagine turning one to match the other. The time taken rises steadily with the angle between them, as if the image were rotated at a constant speed.',
 example:'Shepard and Metzler’s 3D block figures took about one extra second for every 50–60° of difference. Flat letters and shapes turn faster (Cooper & Shepard 1973), but the time still climbs with the angle.',
 research:'Shepard, R. N. & Metzler, J. (1971). Mental rotation of three-dimensional objects. Science 171, 701–703; Cooper, L. A. & Shepard, R. N. (1973), in Visual Information Processing, ed. W. G. Chase. Robust and widely replicated.',
 desc:'Two flat shapes, the right one turned by 0–180° and sometimes mirrored; you answer Same or Mirror, and your correct response times are plotted against angle with a fitted line.',
 dur:12,hint:'Press Start. Answer Same if the right shape is the left one turned, Mirror if it is flipped. 20 trials. Nothing leaves the page.',
 init:()=>({phase:'idle',i:0,order:[],trial:null,blank:false,t0:0,seed:41,tok:0,errors:0,data:[]}),
 watch(p){const t=Math.floor(p*20),k=Math.min(5,Math.floor(p*6));return {phase:'run',i:t,trial:D3_mrTrial(2,t),blank:false,errors:0,data:D3_ANG.slice(0,k).map(a=>({a,rt:D3_MR_SIM(a)})),sim:true}},
 ui:[{b:'Start',act:'go'}],
 on:{go(s){s.seed=D3_nx(s.seed);s.order=shuffled(range(20),s.seed);s.i=0;s.errors=0;s.data=[];s.phase='run';D3_mrShow(s)},
  ans(s,v,ctx){if(s.phase!=='run'||s.blank)return;const rt=(performance.now()-s.t0)/1000;if(Number(v)===s.trial.mir){if(rt<6)s.data.push({a:s.trial.ang,rt})}else s.errors++;s.blank=true;s.tok++;ctx.later(400,'next',s.tok)},
  next(s,t){if(Number(t)!==s.tok)return;s.i++;if(s.i>=20){s.phase='done';s.blank=true}else D3_mrShow(s)}},
 draw(s,f,X){
  let out=heading('Same shape turned, or its mirror image?');
  out+=R(40,44,240,150,'#fff',C.grid,10)+R(320,44,240,150,'#fff',C.grid,10);
  if(s.phase==='run'&&!s.blank&&s.trial){const tr=s.trial,cells=D3_SHAPES[tr.shape];out+=D3_shape(cells,160,116,24,0,0,C.blue)+D3_shape(cells,440,116,24,tr.sign*tr.ang,tr.mir,C.blue);if(!X.try)out+=TF(440,186,`${tr.ang}°${tr.mir?' · mirror':''}`,13,C.muted)}
  else out+=TF(300,124,s.phase==='done'?'Finished':X.try?'Press Start':'',15,C.muted);
  out+=D3_key(X,'ans',0,'Same shape',160,202,120,36,'Same')+D3_key(X,'ans',1,'Mirror image',320,202,120,36,'Mirror');
  const pl=D3_plot(96,252,250,80,[0,180],[0,2.5],[[0,'0°'],[90,'90°'],[180,'180°']],[[0,'0'],[1,'1'],[2,'2 s']],null,null);out+=pl.svg;
  const means=D3_ANG.map(a=>{const d=s.data.filter(e=>e.a===a).map(e=>e.rt);return d.length?[a,D3_mean(d)]:null}).filter(Boolean);
  const fit=means.length>=3?D3_fit(means):null;
  if(fit)out+=L(pl.X(0),pl.Y(fit.a),pl.X(180),pl.Y(fit.a+fit.b*180),C.green,2);
  means.forEach(m=>out+=Ci(pl.X(m[0]),pl.Y(m[1]),5,s.sim?C.blue:C.coral,'#fff'));
  out+=TF(221,372,'angle between the shapes',13,C.muted);
  out+=R(380,252,206,100,'#fff',C.grid,8)+TF(483,274,s.sim?'simulated participant':`trial ${Math.min(s.i+1,20)} of 20 · errors ${s.errors}`,13,C.muted);
  out+=fit&&fit.b>0?TF(483,302,s.sim?'rotation speed':'your rotation speed',13,C.muted)+TB(483,330,`≈ ${Math.round(1/fit.b)}° per second`,17,C.green):TF(483,316,'speed appears after 3 angles',13,C.muted);
  return {svg:out,phase:fit&&fit.b>0?`Each extra degree cost about ${Math.round(fit.b*1000)} ms: a straight line, as if you rotated an image at about ${Math.round(1/fit.b)}° per second. Shepard and Metzler’s 3D figures turned at roughly 60° per second.`:'If the image is turned at a steady speed, the time should rise in a straight line with the angle.'};
 }});

// Shepard–Metzler-style figure: 10 cubes, three bends.
const D3_SM=[[0,0,0],[1,0,0],[2,0,0],[3,0,0],[3,0,1],[3,0,2],[3,1,2],[3,2,2],[3,2,3],[3,2,4]];
function D3_smCubes(ang,mir,ox){const c=[D3_mean(D3_SM.map(p=>p[0])),D3_mean(D3_SM.map(p=>p[1]))],a=ang*Math.PI/180,ca=Math.cos(a),sa=Math.sin(a);
 return D3_SM.map(([x,y,z])=>{x=x+.5-c[0];y=(mir?-1:1)*(y+.5-c[1]);return [ox+x*ca-y*sa,x*sa+y*ca,z]})}
function D3_smFaces(cubes,col){return cubes.flatMap(([x,y,z])=>prism(x-.5,y-.5,z,1,1,1,col))}
SCENE({id:'mental-rotation-cubes',name:'Shepard and Metzler’s figures',tag:'Rotation in depth',
 definition:'Roger Shepard and Jacqueline Metzler showed people pairs of drawings of 3D block figures and asked whether they were the same object. Response time rose in a straight line with the angle between them, both for turns in the picture plane and for turns in depth.',
 example:'At 0° the answer “same” took about a second; at 180°, around four to five seconds. Turning in depth was no slower than turning in the flat picture, which suggests people rotate a 3D model, not a 2D drawing.',
 research:'Shepard, R. N. & Metzler, J. (1971). Mental rotation of three-dimensional objects. Science 171, 701–703. Replicated many times; individual rotation speeds vary widely.',
 desc:'A chart of the published straight-line rise of response time with angle beside a fixed view of two ten-cube figures, the second turned about a vertical axis; the 3D view lets you turn both.',
 dur:12,hint:'Set the angle and whether the second figure is a mirror image. In 3D, drag to look at the pair from other sides.',
 init:()=>({a:120,mir:0}),
 watch(p){return {a:Math.round(smooth(p)*180),mir:p>.8?1:0}},
 ui:[{range:'a',label:'Angle',min:0,max:180,step:20,get:s=>s.a,act:'a',show:v=>v+'°'},{choose:[[0,'Same object'],[1,'Mirror image']],label:'Second figure',get:s=>s.mir,act:'mir'}],
 on:{a(s,v){s.a=Number(v)},mir(s,v){s.mir=Number(v)}},
 draw(s){
  let out=heading(`Second figure turned ${s.a}° about the vertical${s.mir?', and mirrored':''}`);
  const pl=D3_plot(70,56,220,200,[0,180],[0,5],[[0,'0°'],[60,'60°'],[120,'120°'],[180,'180°']],[[0,'0'],[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5 s']],'angle',null);out+=pl.svg;
  const rt=a=>1+a/58;out+=L(pl.X(0),pl.Y(rt(0)),pl.X(180),pl.Y(rt(180)),C.green,3)+Ci(pl.X(s.a),pl.Y(rt(s.a)),8,C.coral,'#fff')+TF(pl.X(s.a)+(s.a>120?-12:12),pl.Y(rt(s.a))+(s.a>120?-12:24),`≈ ${rt(s.a).toFixed(1)} s`,13,C.coral,s.a>120?'end':'start');
  out+=TF(180,330,'mean time for “same” pairs (approximate)',13,C.muted);
  const Pi=([x,y,z])=>[442+(x-y)*.866*15,214+(x+y)*.5*15-z*15,x+y+z];
  out+=paintFaces(D3_smFaces(D3_smCubes(0,0,-4),C.blue).concat(D3_smFaces(D3_smCubes(s.a,s.mir,4),C.purple)),Pi);
  out+=TF(372,350,'figure A',13,C.blue)+TF(512,350,'figure B',13,C.purple);
  return {svg:out,phase:s.mir?'A mirror image can never be turned to match: people answer “different” only after rotating far enough to be sure.':'The further B is turned from A, the longer people take to say “same”: about one extra second per 50–60°.'};
 },
 three(s,f,X,project){
  const P=project([-7,7,-4,4,-.5,5]),faces=D3_smFaces(D3_smCubes(0,0,-3.6),C.blue).concat(D3_smFaces(D3_smCubes(s.a,s.mir,3.6),C.purple));
  return {svg:paintFaces(faces,P),title:'Two block figures in depth',caption:`Figure B (purple) is figure A turned ${s.a}° about the vertical${s.mir?' and mirrored, so no rotation will make them match':''}. Drag to view them from other sides.`};
 }});

const D3_MAP=[['hut',70,80],['tree',190,64],['rock',262,120],['well',92,190],['lake',196,206],['sand',262,212],['grass',160,140]];
const D3_mapPos=i=>[30+D3_MAP[i][1],46+D3_MAP[i][2]];
const D3_dist=(a,b)=>{const p=D3_mapPos(a),q=D3_mapPos(b);return Math.hypot(p[0]-q[0],p[1]-q[1])};
SCENE({id:'mental-rotation-debate',name:'Scanning a mental map',tag:'The imagery debate',
 definition:'Stephen Kosslyn and colleagues had people learn a map of an island and then, with eyes closed, mentally travel from one landmark to another. The time taken rose in a straight line with the real distance, which Kosslyn took as evidence that images are picture-like. Zenon Pylyshyn argued that people simply use what they know about travel times.',
 example:'Going from the hut to the sand takes longer in the mind than going from the hut to the tree, just as it would on the real map.',
 research:'Kosslyn, S. M., Ball, T. M. & Reiser, B. J. (1978). Visual images preserve metric spatial information. JEP:HPP 4, 47–60; Pylyshyn, Z. W. (1981). The imagery debate. Psych. Review 88, 16–45; Intons-Peterson (1983) on experimenter expectations. Still debated.',
 desc:'A fictional island with seven landmarks; choose two and a dot scans between them, while a chart plots scanning time against distance for every pair and a panel sets out the two sides of the debate.',
 dur:12,hint:'Press a landmark to start from, then another to scan to, and press Scan. Switch view to read each side of the debate.',
 init:()=>({a:0,b:5,pick:0,scan:1,view:'k',tok:0}),
 watch(p){const pairs=[[0,1],[0,6],[0,4],[0,5]],i=Math.min(3,Math.floor(p*4));return {a:pairs[i][0],b:pairs[i][1],pick:0,scan:smooth(((p*4)%1)*1.4),view:p<.75?'k':'p'}},
 ui:[{b:'Scan',act:'scan'},{choose:[['k','Kosslyn: images'],['p','Pylyshyn: knowledge']],label:'View',get:s=>s.view,act:'view'}],
 on:{lm(s,v){v=Number(v);if(s.pick===0){s.a=v;s.pick=1}else{if(v!==s.a)s.b=v;s.pick=0}s.scan=1},view(s,v){s.view=v},
  scan(s,a,ctx){s.scan=0;s.tok++;ctx.every(30,'tick',s.tok)},tick(s,t){if(Number(t)!==s.tok)return 'stop';s.scan=Math.min(1,s.scan+30/(D3_dist(s.a,s.b)*8));if(s.scan>=1)return 'stop'}},
 draw(s,f,X){
  let out=heading('Travel across an island you can only imagine');
  out+=P('M48 98C60 58 150 40 230 54C300 66 340 110 336 170C332 238 300 284 220 286C140 290 64 270 46 220C34 180 38 130 48 98Z',C.blue,2,C.pale);
  const pa=D3_mapPos(s.a),pb=D3_mapPos(s.b);out+=L(pa[0],pa[1],pb[0],pb[1],C.amber,2,'stroke-dasharray="5 4"');
  D3_MAP.forEach(([n],i)=>{const [x,y]=D3_mapPos(i),on=i===s.a||i===s.b;out+=hit(X,'lm',i,`Landmark ${n}`,Ci(x,y,9,on?C.amber:'#fff',C.ink)+TBF(x,y-14,n,13,C.ink))});
  const u=clamp(s.scan,0,1);out+=Ci(lerp(pa[0],pb[0],u),lerp(pa[1],pb[1],u),6,C.coral);
  if(X.try&&s.pick===1)out+=TF(190,330,'now press where to scan to',13,C.coral);
  const pl=D3_plot(408,56,170,126,[0,320],[0,2.4],[[0,'0'],[150,'150'],[300,'300']],[[0,'0'],[1,'1'],[2,'2 s']],'distance on the map',null);out+=pl.svg;
  for(let i=0;i<7;i++)for(let j=i+1;j<7;j++){const d=D3_dist(i,j);out+=Ci(pl.X(d),pl.Y(.9+d*.0035),3,C.line)}
  const dd=D3_dist(s.a,s.b);out+=L(pl.X(0),pl.Y(.9),pl.X(320),pl.Y(.9+320*.0035),C.green,2)+Ci(pl.X(dd),pl.Y(.9+dd*.0035),6,C.coral,'#fff');
  const txt=s.view==='k'?['Kosslyn: the image is picture-like.','Distances are kept, so moving','across more of it takes longer.','Visual cortex is often active','during imagery (Kosslyn 1995).']:['Pylyshyn: people know that','travelling further takes longer,','and they simulate that knowledge.','Expectations can shift results','(Intons-Peterson 1983).'];
  out+=R(360,240,226,128,'#fff',s.view==='k'?C.green:C.purple,10);txt.forEach((t,i)=>out+=TF(473,262+i*22,t,13,i===0?(s.view==='k'?C.green:C.purple):C.ink));
  out+=TF(493,48,'time ≈ a + b·distance (illustrative)',13,C.muted);
  return {svg:out,phase:'The straight-line result replicates; what it means does not have a settled answer. Most researchers now accept some depictive format for imagery, while agreeing that knowledge and expectations also shape the results.'};
 }});

/* ======================= Lesson: visual-search ======================= */
const D3_VS_N=[4,12,24];
function D3_vsItems(seed,cond,n,present){const r=rng(seed),cells=shuffled(range(32),seed).slice(0,n);
 return cells.map((c,i)=>{const t=present&&i===0?'T':cond==='feat'?'B':(i%2?'B':'H');return {x:70+(c%8)*64+(r()-.5)*18,y:68+Math.floor(c/8)*40+(r()-.5)*10,t}})}
const D3_bar=it=>{const col=it.t==='B'?C.blue:'#c45238',v=it.t!=='H';return v?R(it.x-4,it.y-13,8,26,col,'none',2):R(it.x-13,it.y-4,26,8,col,'none',2)};
const D3_VS_SIM={feat:[[.46,.001],[.5,.004]],conj:[[.48,.029],[.52,.067]]};
function D3_vsShow(s){const t=s.order[s.i],n=D3_VS_N[t%3],pres=Math.floor(t/3)%2;s.trial={n,pres,seed:s.seed*31+t};s.blank=false;s.t0=performance.now()}
SCENE({id:'visual-search',name:'Finding the odd one out',tag:'Be the participant',
 definition:'Searching for a target that differs by one simple feature, such as colour, is fast however many distractors there are: it pops out. Searching for a conjunction of features, such as an orange vertical among blue verticals and orange horizontals, slows down with every extra item.',
 example:'Treisman and Gelade (1980) found conjunction search took about 29 ms more per item when the target was there, and roughly twice that when it was not, while feature search stayed nearly flat.',
 research:'Treisman, A. M. & Gelade, G. (1980). A feature-integration theory of attention. Cognitive Psychology 12, 97–136. The slope difference replicates; the sharp split into two kinds of search does not (Wolfe 1998).',
 desc:'Displays of 4, 12 or 24 coloured bars; you answer whether an orange vertical bar is present, and your mean response times are plotted against the number of items for present and absent trials.',
 dur:12,hint:'Choose feature or conjunction search and press Start. Answer Present or Absent for an ORANGE VERTICAL bar. 24 trials per block. Nothing leaves the page.',
 init:()=>({cond:'conj',phase:'idle',i:0,order:[],trial:null,blank:false,t0:0,seed:51,tok:0,errors:0,data:{feat:{},conj:{}}}),
 watch(p){const cond=p<.5?'feat':'conj',q=(p%.5)*2,t=Math.floor(q*12),n=D3_VS_N[t%3],pres=(t>>1)%2,data={feat:{},conj:{}};
  const fill=(c,k)=>D3_VS_N.forEach(m=>[0,1].forEach(pr=>{const [a,b]=D3_VS_SIM[c][pr?0:1];if(k)data[c][m+'-'+pr]=[a+b*m]}));fill('feat',p>.3);fill('conj',p>.8);
  return {cond,phase:'run',i:t,trial:{n,pres,seed:7+t},blank:false,errors:0,data,sim:true}},
 ui:[{choose:[['feat','Feature search'],['conj','Conjunction search']],label:'Block',get:s=>s.cond,act:'cond'},{b:'Start',act:'go'}],
 on:{cond(s,v){s.cond=v;s.phase='idle'},go(s){s.seed=D3_nx(s.seed);s.order=shuffled(range(24),s.seed);s.i=0;s.errors=0;s.data[s.cond]={};s.phase='run';D3_vsShow(s)},
  ans(s,v,ctx){if(s.phase!=='run'||s.blank)return;const rt=(performance.now()-s.t0)/1000,tr=s.trial;if(Number(v)===tr.pres){const k=tr.n+'-'+tr.pres;if(rt<5)(s.data[s.cond][k]=s.data[s.cond][k]||[]).push(rt)}else s.errors++;s.blank=true;s.tok++;ctx.later(400,'next',s.tok)},
  next(s,t){if(Number(t)!==s.tok)return;s.i++;if(s.i>=24){s.phase='done';s.blank=true}else D3_vsShow(s)}},
 draw(s,f,X){
  let out=heading(`${s.cond==='feat'?'Feature':'Conjunction'} search: is there an orange vertical bar?`);
  out+=R(30,44,540,170,'#fff',C.grid,10);
  if(s.phase==='run'&&!s.blank&&s.trial)D3_vsItems(s.trial.seed,s.cond,s.trial.n,s.trial.pres).forEach(it=>out+=D3_bar(it));
  else out+=TF(300,134,s.phase==='done'?'Block finished':X.try?'Press Start':'+',15,C.muted);
  out+=D3_key(X,'ans',1,'Target present',160,222,130,34,'Present')+D3_key(X,'ans',0,'Target absent',310,222,130,34,'Absent');
  const pl=D3_plot(80,272,240,64,[0,26],[.3,1.9],[[4,'4'],[12,'12'],[24,'24']],[[.4,'0.4'],[1.8,'1.8 s']],null,null);out+=pl.svg;
  const slopes=[];
  ['feat','conj'].forEach(c=>[1,0].forEach(pr=>{const pts=D3_VS_N.map(m=>{const d=s.data[c][m+'-'+pr];return d&&d.length?[m,D3_mean(d)]:null}).filter(Boolean);if(!pts.length)return;
   const col=c==='feat'?C.green:C.coral,ext=pr?'':'stroke-dasharray="5 4"';out+=D3_poly(pts.map(q=>[pl.X(q[0]),pl.Y(clamp(q[1],.3,1.9))]),col,2,ext);pts.forEach(q=>out+=Ci(pl.X(q[0]),pl.Y(clamp(q[1],.3,1.9)),4,col,'#fff'));
   const fit=pts.length>=2?D3_fit(pts):null;if(fit)slopes.push([c,pr,fit.b])}));
  out+=TF(200,366,'number of items',13,C.muted);
  out+=R(350,268,236,102,'#fff',C.grid,8)+TF(468,288,s.sim?'simulated (Treisman & Gelade slopes)':`trial ${Math.min(s.i+1,24)} of 24 · errors ${s.errors}`,13,C.muted);
  slopes.slice(0,4).forEach(([c,pr,b],i)=>out+=TF(362,312+i*17,`${c==='feat'?'feature':'conjunction'}, ${pr?'present':'absent'}: ${Math.round(b*1000)} ms/item`,13,c==='feat'?C.green:C.coral,'start'));
  if(!slopes.length)out+=TF(468,326,'green: feature · orange: conjunction',13,C.muted)+TF(468,346,'solid: present · dashed: absent',13,C.muted);
  return {svg:out,phase:'A flat line means the target was found in parallel, without checking items one by one. A rising line means each extra item adds time, and absent trials rise faster because every item must be checked before saying no.'};
 }});

const D3_FIT_ITEMS=[[80,96,'tri','or'],[160,82,'cir','or'],[236,108,'tri','bl'],[96,168,'cir','bl'],[184,158,'tri','or'],[262,178,'cir','or']];
const D3_FIT_FEAT=[[80,96,'tri','bl'],[160,82,'cir','bl'],[236,108,'tri','bl'],[96,168,'cir','bl'],[184,158,'tri','or'],[262,178,'cir','bl']];
const D3_fitShape=(x,y,sh,col,r=16)=>sh==='tri'?`<polygon points="${fmt(x)},${fmt(y-r)} ${fmt(x+r)},${fmt(y+r*.8)} ${fmt(x-r)},${fmt(y+r*.8)}" fill="${col}"/>`:Ci(x,y,r*.9,col);
const D3_COLS={or:'#c45238',bl:C.blue};
SCENE({id:'visual-search-binding',name:'Feature integration',tag:'Attention as glue',
 definition:'Anne Treisman’s feature-integration theory says simple features such as colour and shape are registered in separate maps, all at once. Knowing which colour goes with which shape needs attention to visit each location in turn and bind the features together.',
 example:'Find the orange triangle among blue triangles and orange circles: neither “orange” nor “triangle” alone picks it out, so attention must step from item to item. When attention is busy elsewhere, people report illusory conjunctions, such as a blue triangle that was never there.',
 research:'Treisman & Gelade (1980), Cognitive Psychology 12; Treisman, A. & Schmidt, H. (1982). Illusory conjunctions in the perception of objects. Cognitive Psychology 14, 107–141. Illusory conjunctions replicate; the theory has been revised since.',
 desc:'A display of orange and blue triangles and circles beside a colour map, a shape map and a master map of locations with a spotlight of attention that binds features at one location at a time.',
 dur:12,hint:'Choose the search type. In conjunction search press Next item to move the spotlight; choose “attention elsewhere” to see illusory conjunctions.',
 init:()=>({mode:'conj',spot:0}),
 watch(p){return p<.25?{mode:'feat',spot:0}:p<.8?{mode:'conj',spot:Math.min(4,Math.floor((p-.25)/.55*5))}:{mode:'divert',spot:0}},
 ui:[{choose:[['feat','Feature search'],['conj','Conjunction search'],['divert','Attention elsewhere']],label:'Condition',get:s=>s.mode,act:'mode'},{b:'Next item',act:'next'}],
 on:{mode(s,v){s.mode=v;s.spot=0},next(s){if(s.mode==='conj')s.spot=Math.min(4,s.spot+1)}},
 draw(s){
  const items=s.mode==='feat'?D3_FIT_FEAT:D3_FIT_ITEMS,tgt=4;let out=heading(s.mode==='feat'?'Feature search: the orange item pops out of the colour map':s.mode==='conj'?'Conjunction search: the spotlight binds one location at a time':'Attention elsewhere: features float free');
  out+=R(30,48,290,170,'#fff',C.grid,10);
  if(s.mode==='divert'){out+=TF(175,90,'(eyes on a pair of digits; display flashes briefly)',13,C.muted);[[110,150,'tri','bl'],[175,140,'cir','or'],[240,150,'tri','or']].forEach(([x,y,sh,c])=>out+=D3_fitShape(x,y,sh,D3_COLS[c]))}
  else items.forEach(([x,y,sh,c],i)=>out+=D3_fitShape(x,y,sh,D3_COLS[c]));
  const maps=[[340,'colour map: orange',(it)=>it[3]==='or'],[466,'shape map: triangle',(it)=>it[2]==='tri']];
  maps.forEach(([mx,lab,test])=>{out+=R(mx,48,116,86,'#f6f9fb',C.grid,8)+TF(mx+58,150,lab,13,C.muted);items.forEach(it=>{if(test(it))out+=Ci(mx+8+(it[0]-30)*.34,48+6+(it[1]-48)*.42,6,C.ink)})});
  out+=R(400,170,120,86,'#f6f9fb',C.grid,8)+TF(460,272,'master map (where)',13,C.muted);items.forEach(it=>out+=Ci(400+8+(it[0]-30)*.34,170+6+(it[1]-48)*.42,4,C.line));
  if(s.mode==='conj'){const order=[0,1,2,3,4],k=order[s.spot],it=items[k];out+=Ci(it[0],it[1],28,'none',C.amber,'stroke-width="3"')+Ci(400+8+(it[0]-30)*.34,170+6+(it[1]-48)*.42,10,'none',C.amber,'stroke-width="3"');
   out+=TF(175,240,k===tgt?'Bound: orange + triangle = target found':`Item ${s.spot+1}: ${it[3]==='or'?'orange':'blue'} ${it[2]==='tri'?'triangle':'circle'}, not it`,14,k===tgt?C.green:C.ink)}
  if(s.mode==='feat')out+=TF(175,240,'One orange blob in the colour map: found at once',14,C.green);
  if(s.mode==='divert')out+=TF(175,240,'Reported: “a blue circle, an orange triangle…”',14,C.coral);
  out+=R(30,290,540,74,'#f6f9fb','none',8);
  const lines=s.mode==='feat'?['The colour map alone has a single orange item, so it can be found','without attention visiting each location in turn.']:s.mode==='conj'?['Both maps have several marks, so neither finds the target.','Attention checks location after location: time grows with the number of items.']:['With attention busy, colours and shapes were reported in wrong pairings','(Treisman & Schmidt 1982): features were seen, but not bound.'];
  lines.forEach((l,i)=>out+=TF(300,318+i*24,l,13,C.ink));
  return {svg:out,phase:'Features are cheap and parallel; bindings are costly and serial. That is the core claim of feature-integration theory, later softened by guided search.'};
 }});

SCENE({id:'visual-search-guided',name:'Search is a continuum',tag:'Similarity and guidance',
 definition:'Later work found that search efficiency does not fall into two kinds. Search slows smoothly as the target becomes more similar to the distractors and as the distractors become more varied. Jeremy Wolfe’s guided-search model has basic features guide attention towards likely targets, more or less strongly.',
 example:'A vertical line among lines tilted 60° pops out; among lines tilted 10° it has to be hunted for. Mix the distractor tilts and the hunt gets slower still.',
 research:'Duncan, J. & Humphreys, G. W. (1989). Visual search and stimulus similarity. Psychological Review 96, 433–458; Wolfe, J. M. (1998). What can 1 million trials tell us about visual search? Psychological Science 9, 33–39; Wolfe (1994), Guided Search 2.0.',
 desc:'A search display of tilted lines with one vertical target, controlled by target–distractor similarity and distractor variety, beside a scale of search slopes from efficient to inefficient with an illustrative distribution of slopes across experiments.',
 dur:10,hint:'Make the distractors more like the target, or more varied, and watch the predicted slope move along the scale. The slope formula is illustrative.',
 init:()=>({sim:.5,het:.2,seed:4}),
 watch(p){return {sim:p<.6?smooth(p/.6):1,het:p<.6?0:smooth((p-.6)/.4),seed:4}},
 ui:[{range:'sim',label:'Similarity to target',min:0,max:10,get:s=>Math.round(s.sim*10),act:'sim'},{range:'het',label:'Distractor variety',min:0,max:10,get:s=>Math.round(s.het*10),act:'het'},{b:'New display',act:'fresh'}],
 on:{sim(s,v){s.sim=Number(v)/10},het(s,v){s.het=Number(v)/10},fresh(s){s.seed=D3_nx(s.seed)}},
 draw(s){
  const tilt=60-50*s.sim,slope=2+48*Math.pow(s.sim,1.5)*(.55+.45*s.het);let out=heading(`Distractors tilted about ${Math.round(tilt)}°: ≈ ${Math.round(slope)} ms per item`);
  out+=R(30,46,300,250,'#fff',C.grid,10);const cells=shuffled(range(30),s.seed).slice(0,16),r=rng(s.seed+5);
  cells.forEach((c,i)=>{const x=60+(c%6)*48,y=72+Math.floor(c/6)*48,j=(r()-.5)*2,a=i===0?0:(i%2?1:-1)*(tilt+j*30*s.het),rad=a*Math.PI/180,dx=Math.sin(rad)*14,dy=Math.cos(rad)*14;out+=L(x-dx,y-dy,x+dx,y+dy,i===0?C.coral:C.ink,4)});
  out+=TF(180,316,'the target is the vertical line',13,C.muted);
  const sx=v=>360+v*3.6;out+=R(sx(0),74,sx(60)-sx(0),18,'url(#d3-grad)','none',4)+`<defs><linearGradient id="d3-grad"><stop offset="0" stop-color="${C.greenp}"/><stop offset="1" stop-color="${C.coralp}"/></linearGradient></defs>`;
  [0,20,40,60].forEach(v=>out+=TF(sx(v),110,String(v),13,C.muted));out+=TF(470,128,'ms per item',13,C.muted);
  out+=TF(sx(0),66,'efficient',13,C.green,'start')+TF(sx(60),66,'inefficient',13,C.coral,'end');
  out+=`<polygon points="${fmt(sx(slope))},96 ${fmt(sx(slope)-7)},82 ${fmt(sx(slope)+7)},82" fill="${C.ink}"/>`;
  const hist=v=>Math.exp(-v/14)*(1-Math.exp(-v/2.5)),hb=270;let pts=[];for(let v=0;v<=60;v++)pts.push([sx(v),hb-hist(v)*170]);
  out+=`<path d="M${sx(0)} ${hb}L${pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L')}L${sx(60)} ${hb}Z" fill="${C.pale}" stroke="${C.blue}" stroke-width="2"/>`+L(sx(0),hb,sx(60),hb,C.line,1.5);
  out+=TF(470,160,'slopes across many experiments',13,C.muted)+TF(470,288,'one continuous spread, not two groups',13,C.ink)+TF(470,308,'(shape sketched after Wolfe 1998)',13,C.muted);
  return {svg:out,phase:s.sim<.3?'Distractors very unlike the target: features guide attention straight to it, and adding items costs almost nothing.':'As similarity and variety rise, features guide attention less well, so more items are checked before the target is found. Treisman’s two kinds of search are the two ends of this scale.'};
 }});
