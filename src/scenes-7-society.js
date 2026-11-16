/* ===================== Language era 7 · Language in society ===================== */
// Variation and change, contact and creoles, endangered languages, accents and attitudes, and English around
// the world. Studies that relied on deception (matched guise, the Rubin lecture study) are shown as
// reconstructions of their published direction of effect; the learner is never deceived. Learner-as-participant:
// the dialect survey (variation-survey) and the pidgin sentence builder. Every picture is a pure function of
// state, frame and X; random processes are seeded.
const L7_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const L7_rng=n=>rng(L7_mix(n));
function L7_wrap(s,n){const out=[];let line='';for(const w of String(s).split(' ')){if(line&&(line+' '+w).length>n){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out}
const L7_para=(x,y,s,n,size=13,col=C.ink,anchor='start',lh=18)=>L7_wrap(s,n).map((l,i)=>TF(x,y+i*lh,l,size,col,anchor)).join('');
const L7_hbar=(x,y,w,h,pct,col,label)=>R(x,y,w,h,'#f1f5f7','none',4)+R(x,y,w*clamp(pct,0,100)/100,h,col,'none',4)+(label?TF(x+w*clamp(pct,0,100)/100+6,y+h/2+5,label,13,C.ink,'start'):'');
function L7_axes(x0,y0,w,h,xt,yt,xl,yl){let o=L(x0,y0,x0+w,y0,C.line,1.5)+L(x0,y0,x0,y0-h,C.line,1.5);
 xt.forEach(([v,lab])=>{o+=L(x0+v*w,y0,x0+v*w,y0+5,C.line,1.5)+TF(x0+v*w,y0+19,lab,13,C.muted)});
 yt.forEach(([v,lab])=>{o+=L(x0-5,y0-v*h,x0,y0-v*h,C.line,1.5)+TF(x0-8,y0-v*h+4,lab,13,C.muted,'end')});
 if(xl)o+=TF(x0+w/2,y0+38,xl,13,C.muted);if(yl)o+=TF(x0-8,y0-h-12,yl,13,C.muted,'start');return o}
const L7_poly=(pts,col,w=2.5,extra='')=>P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L'),col,w,'none',extra);
const L7_person=(x,y,col,k=1)=>Ci(x,y-24*k,7*k,col)+P(`M${fmt(x-10*k)} ${fmt(y)}L${fmt(x-10*k)} ${fmt(y-8*k)}Q${fmt(x-10*k)} ${fmt(y-15*k)} ${fmt(x-3*k)} ${fmt(y-15*k)}L${fmt(x+3*k)} ${fmt(y-15*k)}Q${fmt(x+10*k)} ${fmt(y-15*k)} ${fmt(x+10*k)} ${fmt(y-8*k)}L${fmt(x+10*k)} ${fmt(y)}Z`,'none',0,col);

/* =========================== variation =========================== */
// Labov (1966): percentage of /r/ in "fourth floor", by store. All-r and some-r shares as published.
const L7_STORES={saks:{name:'Saks Fifth Avenue',rank:'highest-priced',all:30,some:32},macys:{name:'Macy’s',rank:'middle-priced',all:20,some:31},klein:{name:'S. Klein',rank:'lowest-priced',all:4,some:17}};
// Share of employees pronouncing /r/ in each position, casual and emphatic (approximate shapes of Labov's figure).
const L7_POS={saks:{casual:[.63,.44],emph:[.64,.61]},macys:{casual:[.44,.27],emph:[.61,.48]},klein:{casual:[.08,.06],emph:[.18,.13]}};
SCENE({id:'variation',name:'Fourth floor',tag:'Labov’s department stores',
 definition:'Sociolinguistic variation is the patterned way speakers choose between equivalent forms, such as pronouncing or dropping the r in “fourth floor”, in step with social class and situation.',
 example:'In 1962 Labov asked shop assistants a question whose answer was “fourth floor”. Staff in the expensive store pronounced the r far more often than staff in the cheap one, and everyone pronounced it more when asked to repeat.',
 desc:'Three New York department stores; a speech bubble saying “fourth floor” with each r shown or dropped; bars for the published share of staff using r, and a simulated sample of employees.',
 research:['Labov (1966). The Social Stratification of English in New York City. Center for Applied Linguistics (store study carried out in 1962; 264 employees).','Fowler (1986) and Mather (2012) repeated the study decades later: the same ordering of stores, with r more common overall.'],
 dur:12,hint:'Choose a store and whether the reply is casual or a careful repeat, then ask ten more assistants.',
 init:()=>({store:'saks',style:'casual',n:10,seed:3}),
 watch(p){const ks=['saks','macys','klein'];return {store:ks[Math.min(2,Math.floor(p*3))],style:(p*3)%1<.5?'casual':'emph',n:Math.round(10+40*((p*3)%1)),seed:3}},
 ui:[{choose:[['saks','Saks'],['macys','Macy’s'],['klein','S. Klein']],label:'Store',get:s=>s.store,act:'store'},{choose:[['casual','Casual answer'],['emph','“Excuse me?” repeat']],label:'Style',get:s=>s.style,act:'style'},{b:'Ask ten more',act:'more'},{b:'New sample',act:'clear'}],
 on:{store(s,v){s.store=v;s.n=10},style(s,v){s.style=v},more(s){s.n=Math.min(80,s.n+10)},clear(s){s.n=10;s.seed=L7_mix(s.seed)%997+1}},
 draw(s){
  const st=L7_STORES[s.store],pos=L7_POS[s.store][s.style];let out=heading(`${st.name}: the ${st.rank} store`);
  // Speech bubble: fourth / floor, r drawn solid when pronounced by most staff in this style.
  out+=R(30,52,250,96,'#fff',C.line,12)+P('M70 147L60 170L96 147',C.line,1.5,'#fff')+L(71,147,95,147,'#fff',3);
  const w1=pos[0]>=.5,w2=pos[1]>=.5;
  const word=(y,parts)=>`<text x="50" y="${y}" font-size="26" font-weight="700" text-anchor="start">${parts.map(([t,c])=>`<tspan fill="${c}">${t}</tspan>`).join('')}</text>`;
  out+=word(92,[['fou',C.ink],['r',w1?C.coral:C.line],['th',C.ink]])+word(130,[['floo',C.ink],['r',w2?C.coral:C.line]]);
  out+=TF(176,92,`r: ${Math.round(pos[0]*100)}%`,13,C.muted,'start')+TF(176,130,`r: ${Math.round(pos[1]*100)}%`,13,C.muted,'start');
  out+=L7_person(55,226,C.purple,1.2)+TF(55,246,'assistant',13,C.muted);
  // Simulated sample of n assistants: each says fourth/floor with r at the published rates.
  const r=L7_rng(s.seed*31+(s.store==='saks'?1:s.store==='macys'?2:3)+(s.style==='emph'?7:0));let any=0;
  for(let i=0;i<s.n;i++){const a=r()<pos[0],b=r()<pos[1];if(a||b)any++;const col=a&&b?C.coral:a||b?C.amber:C.line,cx=118+(i%20)*8.6,cy=190+Math.floor(i/20)*13;out+=Ci(cx,cy,3.6,col)}
  out+=TF(118,252,`simulated: ${any} of ${s.n} used some r`,13,C.ink,'start');
  [[C.coral,'both r',118],[C.amber,'one r',190],[C.line,'none',258]].forEach(([c,l,x])=>{out+=Ci(x+4,266,4,c)+TF(x+12,270,l,13,C.muted,'start')});
  // Published bars for all three stores.
  out+=TBF(320,64,'Labov’s results (all positions)',14,C.ink,'start');
  ['saks','macys','klein'].forEach((k,i)=>{const d=L7_STORES[k],y=82+i*50,on=k===s.store;
   out+=TF(320,y+4,d.name,13,on?C.ink:C.muted,'start');
   out+=R(320,y+12,250,16,'#f1f5f7','none',4)+R(320,y+12,250*d.all/100,16,on?C.coral:C.line,'none',4)+R(320+250*d.all/100,y+12,250*d.some/100,16,on?C.amberp:'#e6ecef','none',0);
   out+=TF(320+250*(d.all+d.some)/100+6,y+25,`${d.all+d.some}%`,13,C.ink,'start')});
  out+=TF(320,240,'dark: r every time · light: some r',13,C.muted,'start');
  out+=T(300,330,s.style==='emph'?'Asked to repeat, people speak more carefully and use more r':'Casual: the first, unselfconscious answer',15,C.ink);
  out+=T(300,356,'The same words, a different pronunciation, a social pattern',14,C.muted);
  return {svg:out,phase:`${st.name}: ${st.all+st.some}% of assistants used r at least once. Labov’s point was that a tiny variable, an r, lines up with social class and with how careful the speaker is being.`};
 }});

// Trudgill (1974) Norwich: index of -in' for -ing (0 = always -ing, 100 = always -in'), by class and style.
const L7_NORWICH=[['Middle middle class',[0,0,3,28]],['Lower middle class',[0,10,15,42]],['Upper working class',[5,15,74,87]],['Middle working class',[23,44,88,95]],['Lower working class',[29,66,98,100]]];
const L7_STY=['Word list','Reading passage','Formal speech','Casual speech'];
SCENE({id:'variation-variable',name:'Walking or walkin’',tag:'A variable across class and style',
 definition:'A sociolinguistic variable is a point where speakers choose between forms with the same meaning, such as -ing or -in’ at the end of “walking”; its use is measured by how often each form appears.',
 example:'In Norwich, people of every class said -in’ more in casual speech than when reading a word list, but the working classes used it far more than the middle classes in every style.',
 desc:'Five lines, one per social class, showing how often -in’ was used in four speech styles from careful to casual.',
 research:['Trudgill (1974). The Social Differentiation of English in Norwich. Cambridge University Press (60 speakers; index of the (ng) variable).','Fischer (1958) first described -ing/-in’ as a social marker among New England schoolchildren.'],
 dur:10,hint:'Choose a speech style and a class to highlight; compare the steepness of the lines.',
 init:()=>({sty:3,cls:2}),
 watch(p){return {sty:Math.min(3,Math.floor(p*4)),cls:Math.min(4,Math.floor(p*5))}},
 ui:[{choose:L7_STY.map((l,i)=>[i,l]),label:'Style',get:s=>s.sty,act:'sty'},{choose:L7_NORWICH.map((c,i)=>[i,c[0].replace(' class','')]),label:'Class',get:s=>s.cls,act:'cls'}],
 on:{sty(s,v){s.sty=Number(v)},cls(s,v){s.cls=Number(v)}},
 draw(s){
  let out=heading('How often Norwich speakers said -in’ (Trudgill 1974)');
  const x0=80,y0=300,w=330,h=230;
  out+=L7_axes(x0,y0,w,h,L7_STY.map((l,i)=>[i/3,['word list','reading','formal','casual'][i]]),[[0,'0'],[.5,'50'],[1,'100']],'',"index of -in’");
  const cols=[C.blue,C.green,C.amber,C.coral,C.purple];
  L7_NORWICH.forEach(([n,v],i)=>{const on=i===s.cls,pts=v.map((y,j)=>[x0+j/3*w,y0-y/100*h]);out+=L7_poly(pts,on?cols[i]:C.grid,on?3.5:2);pts.forEach(p=>out+=Ci(p[0],p[1],on?5:3,on?cols[i]:C.line))});
  out+=L(x0+s.sty/3*w,y0,x0+s.sty/3*w,y0-h,C.ink,1,'stroke-dasharray="3 4"');
  const v=L7_NORWICH[s.cls][1][s.sty];
  out+=R(430,70,150,120,'#fff',C.grid,8)+L7_para(440,92,L7_NORWICH[s.cls][0],18,13,C.ink,'start',17)+TF(440,136,L7_STY[s.sty],13,C.muted,'start')+TBF(440,170,`${v}`,24,cols[s.cls],'start')+TF(482,170,'/ 100',13,C.muted,'start');
  out+=L7_para(430,214,'Every class moves the same way as speech gets more casual; the classes stay in the same order.',20,13,C.muted,'start',17);
  return {svg:out,phase:`${L7_NORWICH[s.cls][0]}, ${L7_STY[s.sty].toLowerCase()}: an index of ${v}, where 0 means always -ing and 100 always -in’. Style and class both shift the same variable.`};
 }});

// Dialect survey: the learner answers four questions; each answer is linked to where it is commonest.
// Regions follow the Harvard Dialect Survey (Vaux & Golder 2003) and BBC Voices (2005); shown as broad tendencies.
const L7_Q=[
 {q:'A fizzy sweet drink is called…',a:[['soda','US North-east, West and Florida'],['pop','US Midwest, North-west and Canada'],['coke (for any kind)','US South'],['fizzy drink / pop','Britain and Ireland']]},
 {q:'Talking to two or more people, you say…',a:[['you guys','widespread in North America'],['y’all','US South'],['youse','Ireland, Scotland, Liverpool, parts of New York and Australia'],['you (only)','many speakers everywhere']]},
 {q:'A small round loaf of bread is a…',a:[['roll','widespread'],['bap','parts of England and Ireland'],['barm or barm cake','North-west England'],['cob','East Midlands of England']]},
 {q:'“Scone” rhymes with…',a:[['gone','Scotland and northern England (and many others)'],['cone','southern England and North America'],['both','many people say both'],['never say it','no clue either way']]}];
SCENE({id:'variation-survey',name:'Which do you say?',tag:'You are the informant',
 definition:'A dialect survey asks many people which word or pronunciation they use for the same thing, and maps the answers; each answer is a data point, not a mistake.',
 example:'Answer four questions. Each answer is linked to where that form is most common, building a rough profile of the varieties you have picked up.',
 desc:'Four questions with four answers each; your answers appear as a list with the area where each form is commonest. Nothing leaves the page.',
 research:['Vaux & Golder (2003). The Harvard Dialect Survey (about 30,000 respondents).','BBC Voices (2005), analysed in Upton & Davies (2013), Analysing 21st Century British English. Routledge. Regions are broad tendencies, not boundaries.'],
 dur:12,hint:'Press an answer for each question. Your answers stay on this page and are not sent anywhere.',
 init:()=>({q:0,ans:[]}),
 watch(p){const ans=[1,0,2,0].slice(0,Math.floor(p*5));return {q:Math.min(3,ans.length),ans}},
 ui:[],
 on:{pick(s,a){const i=Number(a);s.ans=s.ans.slice(0,s.q);s.ans[s.q]=i;s.q=Math.min(3,s.q+1);return 'keep'},go(s,q){s.q=Math.min(Number(q),s.ans.length);return 'keep'},reset(s){s.q=0;s.ans=[]}},
 draw(s,f,X){
  let out=heading('A four-question dialect survey');
  for(let i=0;i<4;i++){const done=i<s.ans.length,on=i===s.q;out+=hit(X,'go',i,'Question '+(i+1),R(30+i*38,46,32,26,on?C.blue:done?C.greenp:'#f1f5f7',on?'none':C.grid,6)+TBF(46+i*38,64,String(i+1),13,on?'#fff':C.ink))}
  const Q=L7_Q[s.q];out+=TBF(30,100,Q.q,15,C.ink,'start');
  Q.a.forEach(([w],i)=>{const y=114+i*40,chosen=s.ans[s.q]===i;out+=hit(X,'pick',i,w,R(30,y,230,32,chosen?C.blue:'#fff',chosen?'none':C.line,8)+TF(44,y+21,w,14,chosen?'#fff':C.ink,'start'))});
  out+=R(290,46,290,250,'#f8fafb',C.grid,8)+TBF(304,70,'Your answers',14,C.ink,'start');
  if(!s.ans.length)out+=L7_para(304,96,'Nothing yet: press an answer on the left.',34,13,C.muted,'start',18);
  s.ans.forEach((a,i)=>{const [w,where]=L7_Q[i].a[a],y=96+i*50;out+=TBF(304,y,`${i+1}. ${w}`,13,C.ink,'start')+L7_para(304,y+18,where,36,13,C.muted,'start',16)});
  out+=T(300,326,s.ans.length===4?'Most people’s answers point to more than one place: we pick up words as we move':'Answer all four to see your profile',15,C.ink);
  out+=T(300,352,'Each form is just as correct as the others',14,C.muted);
  return {svg:out,phase:s.ans.length===4?'Large online surveys like this one turned millions of answers into maps of English. Moving house, school and the media mix the forms in any one person.':'In a dialect survey you are the informant. There are no wrong answers; the interest is in the pattern across many people.'};
 }});

/* =========================== sound-change-s-curve =========================== */
// Kroch (1989): the rise of periphrastic "do" in English questions, from Ellegård (1953). Approximate shares.
const L7_DO=[[1425,6],[1475,11],[1500,28],[1525,32],[1535,41],[1550,48],[1575,64],[1600,77],[1625,86],[1650,92],[1700,96]];
const L7_logit=(t,k,mid)=>100/(1+Math.exp(-k*(t-mid)));
SCENE({id:'sound-change-s-curve',name:'The S-curve of change',tag:'Slow, fast, slow',
 definition:'Language changes usually spread along an S-shaped curve: a new form is rare for a long time, then spreads quickly through a community, then slowly mops up the last holdouts.',
 example:'English questions once said “Know you the way?”. Between 1400 and 1700 “Do you know the way?” rose from a handful of cases to almost all, along an S-curve.',
 desc:'Historical points for “do” in English questions (Ellegård, as analysed by Kroch) with a logistic curve whose steepness and midpoint you set.',
 research:['Kroch (1989). Reflexes of grammar in patterns of language change. Language Variation and Change 1, 199–244.','Ellegård (1953). The Auxiliary Do. Almqvist & Wiksell (points shown are approximate readings of his tables). Weinreich, Labov & Herzog (1968) set out the problem of how change spreads.'],
 dur:12,hint:'Move the midpoint and the steepness until the curve runs through the points, then read the rate.',
 init:()=>({mid:1540,k:20}),
 watch(p){return {mid:Math.round(lerp(1480,1550,smooth(p))),k:Math.round(lerp(10,22,smooth(p)))}},
 ui:[{range:'mid',label:'Midpoint (year)',min:1450,max:1650,step:5,get:s=>s.mid,act:'mid'},{range:'k',label:'Steepness',min:5,max:50,step:1,get:s=>s.k,act:'k',show:v=>(v/1000).toFixed(3)+' per year'},{b:'Best fit',act:'best'}],
 on:{mid(s,v){s.mid=Number(v)},k(s,v){s.k=Number(v)},best(s){s.mid=1550;s.k=19}},
 draw(s){
  let out=heading('“Do you know…?” replacing “Know you…?”');
  const x0=80,y0=300,w=380,h=220,X=t=>x0+(t-1400)/325*w,Y=v=>y0-v/100*h,k=s.k/1000;
  out+=L7_axes(x0,y0,w,h,[[0,'1400'],[100/325,'1500'],[200/325,'1600'],[300/325,'1700']],[[0,'0%'],[.5,'50%'],[1,'100%']],'year','questions with “do”');
  const pts=[];for(let t=1400;t<=1725;t+=5)pts.push([X(t),Y(L7_logit(t,k,s.mid))]);out+=L7_poly(pts,C.blue,3);
  let err=0;L7_DO.forEach(([t,v])=>{out+=Ci(X(t),Y(v),5,C.coral);err+=(v-L7_logit(t,k,s.mid))**2});const rms=Math.sqrt(err/L7_DO.length);
  out+=L(X(s.mid),y0,X(s.mid),Y(50),C.ink,1,'stroke-dasharray="3 4"');
  const span=Math.log(81)/k;// years from 10% to 90%
  out+=R(476,70,110,150,'#fff',C.grid,8)+TF(486,92,'midpoint',13,C.muted,'start')+TBF(486,112,String(s.mid),16,C.ink,'start')+TF(486,138,'10% → 90% in',13,C.muted,'start')+TBF(486,158,`${Math.round(span)} years`,16,C.ink,'start')+TF(486,184,'fit error',13,C.muted,'start')+TBF(486,204,`${rms.toFixed(1)} points`,16,rms<6?C.green:C.coral,'start');
  out+=T(300,356,'Rare for a long time, then quickly common, then nearly universal',15,C.ink);
  return {svg:out,phase:`With this curve the change takes about ${Math.round(span)} years to go from 10% to 90%. Kroch found that the same rate fits “do” in several different sentence types, which he took as one grammatical change showing up in many places.`};
 }});

// Network model: 40 speakers on a ring, each linked to two neighbours either side, plus optional long "weak ties".
function L7_net(weak,bias,steps,seed){
 const N=40,r=L7_rng(seed),links=range(N).map(i=>[(i+1)%N,(i+2)%N,(i+N-1)%N,(i+N-2)%N]);
 if(weak){for(let k=0;k<6;k++){const a=Math.floor(r()*N),b=(a+13+Math.floor(r()*14))%N;links[a].push(b);links[b].push(a)}}
 let on=range(N).map(i=>i<3);const hist=[3];
 for(let t=0;t<steps;t++){const nx=on.slice();for(let i=0;i<N;i++){if(on[i])continue;const share=links[i].filter(j=>on[j]).length/links[i].length;if(r()<share*bias)nx[i]=true}on=nx;hist.push(on.filter(Boolean).length)}
 return {on,hist,links,N};
}
SCENE({id:'sound-change-s-curve-network',name:'Spreading through a network',tag:'Weak ties carry change',
 definition:'A new form spreads from speaker to speaker; how fast it travels depends on who talks to whom. Loose acquaintances who link separate groups, called weak ties, can carry a change between them.',
 example:'In a model of 40 speakers who talk mainly to their neighbours, a new form creeps around the ring. Add a few long-distance acquaintances and it jumps ahead and spreads faster.',
 desc:'A ring of 40 speakers coloured by whether they use the new form, with optional long links, and the number of users over time, which traces an S-curve.',
 research:['Milroy & Milroy (1985). Linguistic change, social network and speaker innovation. Journal of Linguistics 21, 339–384.','Granovetter (1973). The strength of weak ties. American Journal of Sociology 78, 1360–1380. The model here is a simple illustration, not fitted to data.'],
 dur:12,hint:'Step the model, switch weak ties on or off, and compare how long the change takes.',
 init:()=>({weak:true,bias:6,t:0,seed:5}),
 watch(p){return {weak:p>=.5,bias:6,t:Math.round(40*((p*2)%1)),seed:5}},
 ui:[{choose:[['true','With weak ties'],['false','Neighbours only']],label:'Network',get:s=>String(s.weak),act:'weak'},{range:'bias',label:'Pull of the new form',min:2,max:10,step:1,get:s=>s.bias,act:'bias',show:v=>(v/25).toFixed(2)},{b:'Step ×5',act:'step'},{b:'Run to 60',act:'run60'},{b:'New run',act:'seed'}],
 on:{weak(s,v){s.weak=v==='true';s.t=0},bias(s,v){s.bias=Number(v);s.t=0},step(s){s.t=Math.min(60,s.t+5);return 'keep'},run60(s){s.t=60;return 'keep'},seed(s){s.seed=L7_mix(s.seed)%9973+1;s.t=0}},
 draw(s){
  const m=L7_net(s.weak,s.bias/25,s.t,s.seed),full=L7_net(s.weak,s.bias/25,60,s.seed);let out=heading('A new form spreading among 40 speakers');
  const cx=150,cy=180,rr=100,pos=i=>[cx+rr*Math.cos(i/m.N*2*Math.PI-Math.PI/2),cy+rr*Math.sin(i/m.N*2*Math.PI-Math.PI/2)];
  m.links.forEach((ls,i)=>ls.forEach(j=>{if(j>i&&Math.min((j-i+m.N)%m.N,(i-j+m.N)%m.N)>2){const a=pos(i),b=pos(j);out+=L(a[0],a[1],b[0],b[1],C.amber,1.5)}}));
  for(let i=0;i<m.N;i++){const p=pos(i);out+=Ci(p[0],p[1],6.5,m.on[i]?C.coral:'#fff',m.on[i]?'none':C.line)}
  out+=TF(cx-40,306,`step ${s.t}`,13,C.muted)+TBF(cx+20,306,`${m.hist[m.hist.length-1]} of 40 use it`,15,C.coral,'start');
  const x0=320,y0=300,w=250,h=200;out+=L7_axes(x0,y0,w,h,[[0,'0'],[.5,'30'],[1,'60']],[[0,'0'],[.5,'20'],[1,'40']],'steps','speakers using it');
  out+=L7_poly(full.hist.map((v,i)=>[x0+i/60*w,y0-v/40*h]),C.grid,2)+L7_poly(m.hist.map((v,i)=>[x0+i/60*w,y0-v/40*h]),C.coral,3);
  const half=full.hist.findIndex(v=>v>=20);
  out+=T(300,352,s.weak?'Orange lines are weak ties between distant speakers':'Each speaker talks only to close neighbours',15,C.ink);
  return {svg:out,phase:half>=0?`Half the speakers use the new form by step ${half}. Grey shows the whole run; switch the weak ties to compare.`:'In this run the form has not reached half the speakers within 60 steps.'};
 }});

// Apparent time: today's age groups as a snapshot of the past. Values are illustrative.
const L7_AGES=['75+','60–74','45–59','30–44','15–29'];
SCENE({id:'sound-change-s-curve-apparent-time',name:'Change in apparent time',tag:'Reading the past from the young',
 definition:'Apparent time is the method of studying a change in progress by comparing age groups recorded at the same moment, on the assumption that people keep roughly the speech they had as young adults.',
 example:'If a new vowel is used by 10% of the over-75s and 70% of teenagers, the change probably began decades ago. Re-recording the same town later, in real time, tests the assumption.',
 desc:'Bars for five age groups recorded in one survey year, a slider for a second survey years later, and the real-time result beside the apparent-time prediction.',
 research:['Labov (1963). The social motivation of a sound change. Word 19, 273–309 (Martha’s Vineyard; age groups as evidence of change).','Sankoff & Blondeau (2007). Language change across the lifespan: /r/ in Montreal French. Language 83, 560–588: many adults did keep changing, so apparent time can underestimate a change. Values here are illustrative.'],
 dur:12,hint:'Move the years between surveys and choose whether adults keep their speech or follow the change a little.',
 init:()=>({gap:20,adult:'stable'}),
 watch(p){return {gap:Math.round(30*smooth(p)),adult:p<.6?'stable':'drift'}},
 ui:[{range:'gap',label:'Years until the re-survey',min:0,max:30,step:5,get:s=>s.gap,act:'gap'},{choose:[['stable','Adults keep their speech'],['drift','Adults drift with the change']],label:'Assumption',get:s=>s.adult,act:'adult'}],
 on:{gap(s,v){s.gap=Number(v)},adult(s,v){s.adult=v}},
 draw(s){
  let out=heading('Five age groups recorded in the same year');
  const share=a=>100/(1+Math.exp(-(a)/9));// share by birth year offset (0 = midpoint cohort)
  const births=[-36,-21,-6,9,24];
  out+=TBF(40,66,'First survey',14,C.ink,'start')+TBF(330,66,`Same people ${s.gap} years later`,14,C.ink,'start')+TF(460,306,'ages as in the first survey',13,C.muted);
  births.forEach((b,i)=>{const v=share(b),x=40+i*52;out+=R(x,270-v*1.8,38,v*1.8,C.blue,'none',3)+TF(x+19,288,L7_AGES[i],13,C.muted)+TF(x+19,262-v*1.8,Math.round(v)+'',13,C.ink)});
  // Re-survey: the same people, now s.gap years older (the oldest group has left the sample), plus a new youngest group.
  for(let i=0;i<5;i++){const drift=s.adult==='drift'&&i<4?s.gap*.8:0,vv=i<4?clamp(share(births[i+1])+drift,0,100):share(24+s.gap),x=330+i*52;
   out+=R(x,270-vv*1.8,38,vv*1.8,i<4?C.coral:C.purple,'none',3)+TF(x+19,288,i<4?L7_AGES[i+1]:'new',13,C.muted)+TF(x+19,262-vv*1.8,Math.round(vv)+'',13,C.ink)}
  out+=L(310,80,310,290,C.grid,1.5);
  out+=T(300,330,s.adult==='stable'?'If adults keep their speech, the old pattern is a reliable snapshot':'If adults also change, apparent time underestimates the speed of change',15,C.ink);
  out+=T(300,354,'Shares of speakers using the new form (illustrative values)',13,C.muted);
  return {svg:out,phase:s.adult==='stable'?'Under the stable-adult assumption the same people score as they did before; only the new youngest group (purple) moves ahead, exactly as the first survey predicted.':'Real-time re-surveys, such as Montreal’s, found that many adults did shift with a change, so age differences can understate it.'};
 }});

/* =========================== contact-creoles =========================== */
// Origins of English vocabulary (Finkenstaedt & Wolff 1973, about 80,000 dictionary words) and a sentence by word.
const L7_ORIG=[['Latin',28.3,C.blue],['French',28.2,C.purple],['Germanic (with Norse)',25,C.green],['Greek',5.3,C.amber],['Other and unknown',13.2,C.line]];
const L7_SENT=[['The','Germanic'],['jury','French'],['gave','Germanic'],['a','Germanic'],['verdict','French'],['after','Germanic'],['the','Germanic'],['skirmish','French'],['in','Germanic'],['the','Germanic'],['sky','Germanic'],['over','Germanic'],['the','Germanic'],['ancient','French'],['city','French']];
const L7_NOTE={jury:'Anglo-Norman juree, after 1066',verdict:'Anglo-Norman verdit, “true saying”',skirmish:'Old French escarmouche',ancient:'Old French ancien',city:'Old French cité, from Latin civitas',sky:'Old Norse ský, “cloud”, from Viking contact',gave:'Old English giefan, reinforced by Norse',The:'Old English þe',a:'Old English an, “one”',after:'Old English æfter',in:'Old English in',over:'Old English ofer',the:'Old English þe'};
SCENE({id:'contact-creoles',name:'Borrowing',tag:'English as a contact language',
 definition:'When speakers of different languages live side by side, words and sometimes sounds and grammar cross from one language to another. English borrowed heavily from Norse, French and Latin.',
 example:'Counted in a dictionary, more than half of English words come from French and Latin. Counted in ordinary running text, most words are Germanic, because the commonest words, like the, a, in and give, are old English.',
 desc:'A bar of dictionary word origins beside a sentence whose words you can press to see where each came from, and the share of Germanic words in the sentence.',
 research:['Finkenstaedt & Wolff (1973). Ordered Profusion: Studies in Dictionaries and the English Lexicon. Winter (about 80,000 words of the Shorter Oxford Dictionary).','Thomason & Kaufman (1988). Language Contact, Creolization, and Genetic Linguistics. University of California Press. Etymologies follow the Oxford English Dictionary.'],
 dur:10,hint:'Press words in the sentence to see their origin; compare the dictionary count with the running-text count.',
 init:()=>({w:1}),
 watch(p){return {w:Math.min(L7_SENT.length-1,Math.floor(p*L7_SENT.length))}},
 ui:[{b:'◀ Word',act:'prev'},{b:'Word ▶',act:'next'}],
 on:{word(s,a){s.w=Number(a);return 'keep'},prev(s){s.w=Math.max(0,s.w-1);return 'keep'},next(s){s.w=Math.min(L7_SENT.length-1,s.w+1);return 'keep'}},
 draw(s,f,X){
  let out=heading('Where English words come from');
  out+=TBF(30,64,'In the dictionary (Finkenstaedt & Wolff 1973)',14,C.ink,'start');let x=30;
  L7_ORIG.forEach(([n,v,c])=>{const w=v*5.4;out+=R(x,74,w,24,c,'none',0)+(v>8?TBF(x+w/2,91,Math.round(v)+'%',13,'#fff'):'');x+=w});
  L7_ORIG.forEach(([n,v,c],i)=>{const lx=30+(i%3)*190,ly=118+Math.floor(i/3)*20;out+=R(lx,ly-10,10,10,c,'none',2)+TF(lx+15,ly,n.length>26?n.slice(0,24)+'…':n,13,C.ink,'start')});
  out+=TBF(30,182,'In running text: one sentence',14,C.ink,'start');
  let cx=30,cy=210;const col={Germanic:C.green,French:C.purple,Latin:C.blue};
  L7_SENT.forEach(([w,o],i)=>{const ww=w.length*9.4+14;if(cx+ww>575){cx=30;cy+=36}const on=i===s.w;out+=hit(X,'word',i,w,R(cx,cy-18,ww,28,on?col[o]:'#fff',col[o],6)+TF(cx+ww/2,cy+1,w,15,on?'#fff':C.ink));cx+=ww+6});
  const g=L7_SENT.filter(x=>x[1]==='Germanic').length;
  const [ww,oo]=L7_SENT[s.w];
  out+=TBF(30,cy+44,`“${ww}”: ${oo}`,15,col[oo],'start')+TF(30,cy+64,L7_NOTE[ww]||'',13,C.muted,'start');
  out+=T(300,360,`${g} of ${L7_SENT.length} words in this sentence are Germanic: the everyday core stayed English`,14,C.ink);
  return {svg:out,phase:'Borrowing tends to bring in words for new things and for the language of power (law, government, food, fashion after 1066), while the commonest grammatical words stay native.'};
 }});

// Tok Pisin sentence builder (expanded pidgin, now with native speakers).
const L7_TP_SUBJ=[['mi','I'],['yu','you'],['em','he / she / it'],['mipela','we (not you)'],['yumi','we (including you)']];
const L7_TP_TAM=[['','(no marker)','present or understood from context'],['bai','will','future, from English “by and by”'],['bin','did','past'],['pinis','have … already','completed, from “finish”, after the verb']];
const L7_TP_VERB=[['go','go'],['kaikai','eat'],['save','know'],['lukim','see (it)']];
const L7_STAGES=[['Jargon','A few words, no fixed order, much gesture; used briefly between strangers.'],['Stable pidgin','Fixed vocabulary and word order, nobody’s first language, used for trade and work.'],['Expanded pidgin','Grows grammar such as tense markers and an inclusive “we”; used in towns and media.'],['Creole','Children grow up speaking it as a first language; a complete language.']];
SCENE({id:'contact-creoles-pidgin',name:'From pidgin to creole',tag:'Build a Tok Pisin sentence',
 definition:'A pidgin is a simplified contact language that no one speaks natively, made by people who share no language. When it becomes the first language of a community, it is called a creole.',
 example:'Tok Pisin, from Papua New Guinea, took most words from English but has its own grammar: “Mi bai go” means “I will go”, and “yumi” is a “we” that includes the listener.',
 desc:'A four-step line from jargon to creole, and a sentence builder for Tok Pisin with a subject, a time or aspect marker and a verb, with its English meaning.',
 research:['Mühlhäusler (1985). In Wurm & Mühlhäusler (eds), Handbook of Tok Pisin. Pacific Linguistics.','Sankoff & Laberge (1973). On the acquisition of native speakers by a language. Kivung 6: children were reshaping “bai” into a future prefix. Tok Pisin is an official language of Papua New Guinea.'],
 dur:12,hint:'Choose a subject, a marker and a verb to build a sentence; press the stages to read about each.',
 init:()=>({sub:0,tam:1,verb:0,stage:2}),
 watch(p){const k=Math.floor(p*8);return {sub:k%5,tam:k%4,verb:Math.floor(k/2)%4,stage:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:L7_TP_SUBJ.map((x,i)=>[i,x[0]]),label:'Subject',get:s=>s.sub,act:'sub'},{choose:L7_TP_TAM.map((x,i)=>[i,x[0]||'none']),label:'Marker',get:s=>s.tam,act:'tam'},{choose:L7_TP_VERB.map((x,i)=>[i,x[0]]),label:'Verb',get:s=>s.verb,act:'verb'}],
 on:{sub(s,v){s.sub=Number(v)},tam(s,v){s.tam=Number(v)},verb(s,v){s.verb=Number(v)},stage(s,a){s.stage=Number(a);return 'keep'}},
 draw(s,f,X){
  let out=heading('Jargon → pidgin → creole');
  L7_STAGES.forEach(([n],i)=>{const x=30+i*140,on=i===s.stage;out+=hit(X,'stage',i,n,R(x,46,128,34,on?C.purple:'#f1f5f7',on?'none':C.grid,8)+TF(x+64,68,n,14,on?'#fff':C.ink))+(i<3?arrow(x+128,63,x+140,63,C.line,1.5,5):'')});
  out+=L7_para(30,104,L7_STAGES[s.stage][1],80,13,C.muted,'start',17);
  const sub=L7_TP_SUBJ[s.sub],tam=L7_TP_TAM[s.tam],vb=L7_TP_VERB[s.verb];
  // Predicate marker "i" follows third-person and plural subjects (not mi or yu); bai comes before it, bin after it.
  const pm=s.sub>=2?'i':'';
  const tp=tam[0]==='pinis'?[sub[0],pm,vb[0],'pinis'].filter(Boolean).join(' '):tam[0]==='bai'?[sub[0],'bai',pm,vb[0]].filter(Boolean).join(' '):[sub[0],pm,tam[0],vb[0]].filter(Boolean).join(' ');
  const third=s.sub===2,engVerb=v=>third&&s.tam===0?(v==='go'?'goes':v==='know'?'knows':v==='eat'?'eats':'sees it'):v;
  const en=s.tam===1?`${sub[1]} will ${vb[1]}`:s.tam===2?`${sub[1]} ${vb[1]==='go'?'went':vb[1]==='eat'?'ate':vb[1]==='know'?'knew':'saw it'}`:s.tam===3?`${sub[1]} ${third?'has':'have'} already ${vb[1]==='go'?'gone':vb[1]==='eat'?'eaten':vb[1]==='know'?'known':'seen it'}`:`${sub[1]} ${engVerb(vb[1])}`;
  out+=R(30,146,540,96,'#fff',C.line,10)+TF(50,172,'Tok Pisin',13,C.muted,'start')+TBF(50,204,tp.charAt(0).toUpperCase()+tp.slice(1)+'.',24,C.purple,'start');
  out+=TF(330,172,'English',13,C.muted,'start')+L7_para(330,200,en.charAt(0).toUpperCase()+en.slice(1)+'.',28,15,C.ink,'start',20);
  out+=TF(50,232,tam[0]?`“${tam[0]}”: ${tam[2]}`:'No marker: the time comes from context',13,C.muted,'start');
  out+=L7_para(30,272,s.sub===3||s.sub===4?'Tok Pisin has two words for “we”: mipela leaves the listener out, yumi includes them, and both take the predicate marker “i”. English cannot say this in one word; many Austronesian languages of the region can.':s.sub===2?'The little word “i” is a predicate marker: it comes before the verb after “em” and plural subjects, but not after “mi” or “yu”. English has nothing like it.':'Notice what English has that Tok Pisin does not need, such as -s on “goes”, and what Tok Pisin marks that English does not.',80,13,C.ink,'start',18);
  out+=T(300,352,'Simplified, not broken: a pidgin has rules of its own',15,C.ink);
  return {svg:out,phase:'The inclusive and exclusive “we” comes from the local languages (the substrate), while most words come from English (the lexifier). Creoles mix both.'};
 }});

const L7_CREOLE_CARDS=[
 ['Bickerton’s bioprogram','Creoles share features because children fall back on an inborn default grammar.','Bickerton 1981, 1984','claim'],
 ['Hawaiʻi records','Archives show Hawaiʻi Creole took two generations, with adult immigrants’ input.','Roberts 1998, 2000','against'],
 ['Substrate features','Many creole patterns match the first speakers’ own languages.','Lefebvre 1998 and others','against'],
 ['Nicaraguan signers','Deaf children made a new sign language more regular within a few cohorts.','Senghas & Coppola 2001','for'],
 ['Creole exceptionalism','Creoles are not a special simpler type; that idea has a colonial history.','DeGraff 2003, 2005','against'],
 ['Creole prototype','Some creoles do share simpler word structure, as a statistical tendency.','McWhorter 2001','for']];
SCENE({id:'contact-creoles-debate',name:'How creoles arise',tag:'An open debate',
 definition:'Linguists disagree about why creoles in different parts of the world look alike: an inborn default grammar, the languages of the first speakers, ordinary language change under contact, or a mixture.',
 example:'Derek Bickerton argued that children in plantation Hawaiʻi created a new grammar from a pidgin in one generation. Later archive work suggested the process took longer and drew on the speakers’ own languages.',
 desc:'Six evidence cards for and against the bioprogram hypothesis, with a tally that changes as you turn them over.',
 research:['Bickerton (1981). Roots of Language. Karoma. Bickerton (1984). The language bioprogram hypothesis. Behavioral and Brain Sciences 7, 173–221.','Roberts (2000). Nativization and the genesis of Hawaiian Creole. In McWhorter (ed.), Language Change and Language Contact in Pidgins and Creoles. Benjamins. DeGraff (2003). Against creole exceptionalism. Language 79, 391–410.'],
 dur:12,hint:'Turn over the cards one by one; the evidence points different ways.',
 init:()=>({open:[0]}),
 watch(p){return {open:range(Math.min(6,1+Math.floor(p*6)))}},
 ui:[{b:'Turn all',act:'all'}],
 on:{card(s,a){const i=Number(a);s.open=s.open.includes(i)?s.open.filter(x=>x!==i):s.open.concat(i);return 'keep'},all(s){s.open=range(6)},reset(s){s.open=[]}},
 draw(s,f,X){
  let out=heading('Do children invent creole grammar?');
  L7_CREOLE_CARDS.forEach(([t,body,cite,side],i)=>{const x=30+(i%3)*184,y=46+Math.floor(i/3)*140,on=s.open.includes(i),col=side==='for'?C.green:side==='against'?C.coral:C.purple;
   out+=hit(X,'card',i,t,R(x,y,174,132,on?'#fff':'#f1f5f7',on?col:C.grid,8)+TBF(x+10,y+22,t,13,on?col:C.ink,'start')+(on?L7_para(x+10,y+42,body,24,13,C.ink,'start',16)+TF(x+10,y+122,cite,13,C.muted,'start'):TF(x+87,y+74,'press to turn',13,C.muted)))});
  const fo=s.open.filter(i=>L7_CREOLE_CARDS[i][3]==='for').length,ag=s.open.filter(i=>L7_CREOLE_CARDS[i][3]==='against').length;
  out+=TF(30,344,`supporting an inborn default: ${fo}`,14,C.green,'start')+TF(330,344,`against or complicating: ${ag}`,14,C.coral,'start');
  out+=T(300,370,'Most linguists now see several causes at work; the question is open',13,C.muted);
  return {svg:out,phase:'The bioprogram idea started a productive argument. The evidence now favours gradual formation with input from all the languages in contact, but children’s role in regularising a new language is real.'};
 }});

/* =========================== endangered-languages =========================== */
// Approximate cumulative share of the world's population covered by the N largest languages (by first-language speakers).
const L7_CUM=[[1,12],[2,18],[5,30],[10,42],[23,52],[50,63],[100,73],[300,85],[1000,95],[3000,99.4],[7000,100]];
const L7_cumAt=n=>{for(let i=1;i<L7_CUM.length;i++){const [a,va]=L7_CUM[i-1],[b,vb]=L7_CUM[i];if(n<=b){const u=(Math.log(n)-Math.log(a))/(Math.log(b)-Math.log(a));return va+(vb-va)*u}}return 100};
SCENE({id:'endangered-languages',name:'Seven thousand languages',tag:'Few big, many small',
 definition:'About 7,000 languages are spoken today, but very unevenly: a couple of dozen are the first language of half the world, while thousands have fewer than ten thousand speakers.',
 example:'The 23 largest languages are the mother tongues of roughly half of humanity. The other half of humanity speaks the remaining 6,900 or so, and about 40% of all languages are endangered.',
 desc:'A curve of how much of the world’s population speaks the largest N languages as a first language, on a log scale, with a slider for N.',
 research:['Eberhard, Simons & Fennig (eds) (2023). Ethnologue: Languages of the World, 26th edn. SIL International (counts are approximate and change with each edition).','Hammarström, Forkel, Haspelmath & Bank. Glottolog (glottolog.org). Values on the curve are approximate.'],
 dur:10,hint:'Move the slider to see how much of the world speaks the biggest languages as a first language.',
 init:()=>({n:23}),
 watch(p){return {n:Math.round(Math.exp(lerp(0,Math.log(7000),smooth(p))))}},
 ui:[{range:'n',label:'Largest languages',min:0,max:100,step:1,get:s=>Math.round(Math.log(s.n)/Math.log(7000)*100),act:'n',show:v=>String(Math.round(Math.exp(v/100*Math.log(7000))))}],
 on:{n(s,v){s.n=Math.max(1,Math.round(Math.exp(Number(v)/100*Math.log(7000))))}},
 draw(s){
  let out=heading('Share of humanity speaking the N largest languages');
  const x0=80,y0=290,w=440,h=220,X=n=>x0+Math.log(n)/Math.log(7000)*w,Y=v=>y0-v/100*h;
  out+=L7_axes(x0,y0,w,h,[[0,'1'],[Math.log(10)/Math.log(7000),'10'],[Math.log(100)/Math.log(7000),'100'],[Math.log(1000)/Math.log(7000),'1,000'],[1,'7,000']],[[0,'0%'],[.5,'50%'],[1,'100%']],'number of languages (log scale)','first-language speakers');
  const pts=[];for(let k=0;k<=80;k++){const n=Math.exp(k/80*Math.log(7000));pts.push([X(n),Y(L7_cumAt(n))])}out+=L7_poly(pts,C.blue,3);
  const v=L7_cumAt(s.n);out+=L(X(s.n),y0,X(s.n),Y(v),C.coral,1.5,'stroke-dasharray="4 4"')+L(x0,Y(v),X(s.n),Y(v),C.coral,1.5,'stroke-dasharray="4 4"')+Ci(X(s.n),Y(v),6,C.coral);
  out+=R(X(s.n)>360?x0+10:X(s.n)+14,Y(v)+10,190,46,'#fff',C.grid,8)+TBF((X(s.n)>360?x0+10:X(s.n)+14)+10,Y(v)+30,`${s.n} language${s.n>1?'s':''}`,14,C.ink,'start')+TF((X(s.n)>360?x0+10:X(s.n)+14)+10,Y(v)+48,`about ${Math.round(v)}% of people`,13,C.coral,'start');
  out+=T(300,350,'The curve is steep at first: most languages are small',15,C.ink);
  return {svg:out,phase:`The largest ${s.n} language${s.n>1?'s are':' is'} the first language of roughly ${Math.round(v)}% of people. The remaining ${(7000-s.n).toLocaleString('en-GB')} or so are shared by the other ${100-Math.round(v)}%. Values are approximate.`};
 }});

SCENE({id:'endangered-languages-transmission',name:'Passing it on',tag:'The decisive link',
 definition:'Intergenerational transmission is parents passing a language to their children. When it breaks, a language can go from thriving to endangered within two or three generations, even with many adult speakers.',
 example:'If only half of each generation’s parents speak the language to their children, the share of young speakers halves every generation: 100%, 50%, 25%, 12%.',
 desc:'Four generations of a community drawn as rows of people; the share of children who learn the language is set by a slider, and the UNESCO vitality level is shown.',
 research:['UNESCO Ad Hoc Expert Group on Endangered Languages (2003). Language Vitality and Endangerment. UNESCO (transmission is the first of nine factors).','Fishman (1991). Reversing Language Shift. Multilingual Matters. Krauss (1992). The world’s languages in crisis. Language 68, 4–10. The model is a simple illustration.'],
 dur:10,hint:'Set how many parents pass the language on and watch four generations.',
 init:()=>({pass:50}),
 watch(p){return {pass:Math.round(lerp(100,20,smooth(p)))}},
 ui:[{range:'pass',label:'Parents passing the language on',min:0,max:100,step:5,get:s=>s.pass,act:'pass',show:v=>v+'%'},{b:'Revival programme',act:'revive'}],
 on:{pass(s,v){s.pass=Number(v)},revive(s){s.pass=Math.min(100,s.pass+30)}},
 draw(s){
  let out=heading('Speakers in four generations');
  const gens=['Grandparents','Parents','Children','Grandchildren'];let share=1;const shares=[];
  gens.forEach((g,i)=>{if(i>0)share*=s.pass/100;shares.push(share);const y=78+i*58,n=Math.round(share*20);
   out+=TF(30,y+4,g,13,C.ink,'start');for(let k=0;k<20;k++)out+=L7_person(150+k*20,y+16,k<n?C.green:C.grid,.8);
   out+=TF(590,y+4,Math.round(share*100)+'%',13,C.ink,'end')});
  const youngest=shares[3]*100;const lvl=youngest>=90?['Safe','children everywhere learn it',C.green]:youngest>=50?['Vulnerable','most children learn it',C.green]:youngest>=20?['Definitely endangered','children no longer learn it at home in many families',C.amber]:youngest>=5?['Severely endangered','spoken mainly by grandparents',C.coral]:['Critically endangered','only a few older speakers',C.coral];
  out+=R(30,312,540,46,'#fff',lvl[2],8)+TBF(46,334,lvl[0],15,lvl[2],'start')+TF(46,351,`UNESCO-style level for the youngest generation: ${lvl[1]}`,13,C.muted,'start');
  return {svg:out,phase:`With ${s.pass}% of parents passing it on, about ${Math.round(youngest)}% of grandchildren speak it. A language can have many adult speakers and still be endangered if children are not learning it.`};
 }});

// Welsh speakers aged 3+ in Wales, census (percent).
const L7_WELSH=[[1901,49.9],[1911,43.5],[1921,37.1],[1931,36.8],[1951,28.9],[1961,26.0],[1971,20.8],[1981,18.9],[1991,18.7],[2001,20.8],[2011,19.0],[2021,17.8]];
const L7_REVIVE=[['Welsh','Census shows a long fall slowing after 1981, with Welsh-medium schools (from 1939) and the 1993 and 2011 language Acts.','Welsh census; Welsh Language Act 1993; Welsh Language (Wales) Measure 2011'],
 ['Hebrew','Revived as a spoken everyday language from the 1880s, after centuries of mainly written and liturgical use; now the first language of millions.','Ben-Yehuda; Fellman (1973). The Revival of a Classical Tongue'],
 ['Māori','Te Kōhanga Reo “language nests” for pre-school children from 1982; Māori an official language of New Zealand since 1987.','Māori Language Act 1987'],
 ['Hawaiian','Pūnana Leo immersion pre-schools from 1984 after a ban on Hawaiian-medium schooling (1896); now a path from pre-school to university.','Wilson & Kamanā (2001)'],
 ['Manx','The last native speaker, Ned Maddrell, died in 1974; recordings, classes and a Manx-medium primary school have brought new speakers, including children.','Isle of Man; Bunscoill Ghaelgagh (2001)']];
SCENE({id:'endangered-languages-revival',name:'Revitalisation',tag:'Languages coming back',
 definition:'Language revitalisation is deliberate work to reverse a language’s decline, usually by restoring transmission to children through schools, immersion nurseries, media and official status.',
 example:'Welsh fell from about half of the people of Wales in 1901 to about a fifth by 1971, then held roughly steady as Welsh-medium schooling grew.',
 desc:'The census share of Welsh speakers from 1901 to 2021, and cards for five revitalisation stories.',
 research:['Census of Population, England and Wales, 1901–2021: Welsh speakers aged 3 and over (ONS; values as published, 1941 not held).','Hinton & Hale (eds) (2001). The Green Book of Language Revitalization in Practice. Academic Press. Fellman (1973). The Revival of a Classical Tongue. Mouton.'],
 dur:12,hint:'Press a case to read its story; the chart shows the Welsh census.',
 init:()=>({c:0}),
 watch(p){return {c:Math.min(4,Math.floor(p*5))}},
 ui:[{choose:L7_REVIVE.map((x,i)=>[i,x[0]]),label:'Case',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=Number(v)}},
 draw(s){
  let out=heading('Welsh speakers in Wales (census, %)');
  const x0=60,y0=230,w=300,h=170,X=t=>x0+(t-1900)/122*w,Y=v=>y0-v/60*h;
  out+=L7_axes(x0,y0,w,h,[[0,'1900'],[50/122,'1950'],[100/122,'2000']],[[0,'0'],[30/60,'30'],[1,'60']],'','');
  out+=L7_poly(L7_WELSH.map(([t,v])=>[X(t),Y(v)]),C.green,3);L7_WELSH.forEach(([t,v])=>out+=Ci(X(t),Y(v),3.5,C.green));
  [[1901,49.9],[1971,20.8],[2021,17.8]].forEach(([t,v])=>out+=TF(X(t)+(t===2021?-4:6),Y(v)-8,v+'%',13,C.ink,t===2021?'end':'start'));
  const [n,body,cite]=L7_REVIVE[s.c];
  out+=R(380,46,200,276,'#fff',C.green,8)+TBF(392,70,n,16,C.green,'start')+L7_para(392,94,body,25,13,C.ink,'start',17)+L7_para(392,240,cite,27,13,C.muted,'start',15);
  out+=L7_para(30,270,'The fall slowed as children began learning Welsh at school, not only at home.',50,13,C.muted,'start',17);
  out+=T(300,356,'Revival works best when children learn the language and use it every day',15,C.ink);
  return {svg:out,phase:`${n}: ${body}`};
 }});

/* =========================== accents-attitudes =========================== */
// Lambert et al. (1960): matched guise. Direction of published effects; magnitudes illustrative.
const L7_TRAITS=['Intelligence','Good looks','Dependability','Ambition','Leadership'];
const L7_MG={english:[[.8,.6,.7,.5,.7]],french:[[.7,.5,.6,.5,.6]]};
SCENE({id:'accents-attitudes',name:'The matched guise',tag:'Same speaker, two voices',
 definition:'In a matched-guise test, listeners rate recordings of what they think are different people, but some are the same bilingual speaker in two languages or accents; differences in ratings reveal attitudes to the language, not the person.',
 example:'In Montreal in 1960, listeners rated the same speakers as more intelligent and dependable when they spoke English than when they spoke French. French-Canadian listeners did so too.',
 desc:'A diagram of one speaker recorded twice, and bars for how English-speaking and French-speaking listeners rated the English guise above the French one on five traits.',
 research:['Lambert, Hodgson, Gardner & Fillenbaum (1960). Evaluational reactions to spoken languages. Journal of Abnormal and Social Psychology 60, 44–51.','The listeners were not told the voices were the same people; this scene reconstructs the published direction of effect. Bar heights are illustrative. Giles (1970) found a similar ranking of British accents.'],
 dur:10,hint:'Choose the listeners and compare how much higher the English guise was rated on each trait.',
 init:()=>({who:'french'}),
 watch(p){return {who:p<.5?'english':'french'}},
 ui:[{choose:[['english','English-speaking listeners'],['french','French-speaking listeners']],label:'Listeners',get:s=>s.who,act:'who'}],
 on:{who(s,v){s.who=v}},
 draw(s){
  let out=heading('One speaker, two guises');
  out+=L7_person(80,150,C.purple,1.4)+TF(80,172,'one bilingual',13,C.muted)+TF(80,188,'speaker',13,C.muted);
  out+=arrow(110,110,190,82,C.blue,2)+arrow(110,130,190,158,C.coral,2);
  out+=R(196,62,150,40,'#fff',C.blue,8)+TF(271,87,'recording in English',13,C.blue)+R(196,140,150,40,'#fff',C.coral,8)+TF(271,165,'recording in French',13,C.coral);
  out+=L7_para(196,212,'Listeners hear them among other voices and rate each “person”.',22,13,C.muted,'start',17);
  out+=TBF(370,62,'English guise rated higher by:',14,C.ink,'start');
  const d=L7_MG[s.who][0];
  L7_TRAITS.forEach((t,i)=>{const y=80+i*40;out+=TF(370,y+4,t,13,C.ink,'start')+R(370,y+12,200,14,'#f1f5f7','none',4)+R(370,y+12,200*d[i],14,C.blue,'none',4)});
  out+=TF(370,284,'longer bar: bigger preference',13,C.muted,'start')+TF(370,300,'(heights illustrative)',13,C.muted,'start');
  out+=T(300,330,s.who==='french'?'French-speaking listeners also preferred the English guise':'English-speaking listeners preferred the English guise',15,C.ink);
  out+=T(300,354,'Attitudes to a language get pinned on the people who speak it',14,C.muted);
  return {svg:out,phase:'Because each pair of recordings came from the same person, the only thing that differed was the language. The result showed how the social standing of English in 1950s Montreal shaped judgements of individuals, even among French speakers.'};
 }});

// Accent prestige ranks in Britain: Giles (1970) and Coupland & Bishop (2007, BBC Voices). Middle ranks approximate.
const L7_ACC=[['Standard (RP)',1,1],['Queen’s English',null,2],['Edinburgh',null,3],['Southern Irish',4,4],['Welsh',5,9],['North American',3,5],['Yorkshire',null,12],['Cockney (London)',11,24],['Liverpool',null,29],['Birmingham',13,34]];
SCENE({id:'accents-attitudes-standard',name:'Ranking accents',tag:'Prestige that lasts',
 definition:'Standard language ideology is the widespread belief that one variety, usually that of powerful groups, is correct and the others are lesser, even though all accents are equally systematic.',
 example:'British listeners rated Received Pronunciation highest for prestige and the Birmingham accent lowest, both in 1970 and in a 2005 survey of more than 5,000 people.',
 desc:'Prestige ranks for British accents from a 1970 study (13 accents) and a 2005 study (34 accents), drawn as two columns joined by lines.',
 research:['Giles (1970). Evaluative reactions to accents. Educational Review 22, 211–227.','Coupland & Bishop (2007). Ideologised values for British accents. Journal of Sociolinguistics 11, 74–93 (BBC Voices, 5,010 respondents). Ranks other than the top and bottom are approximate.'],
 dur:10,hint:'Press an accent to follow it between the two studies.',
 init:()=>({a:9}),
 watch(p){return {a:Math.min(9,Math.floor(p*10))}},
 ui:[{choose:L7_ACC.map((x,i)=>[i,x[0]]),label:'Accent',get:s=>s.a,act:'a'}],
 on:{a(s,v){s.a=Number(v)},pick(s,a){s.a=Number(a);return 'keep'}},
 draw(s,f,X){
  let out=heading('Where accents ranked for prestige');
  const top=74,bot=250,yA=r=>top+(r-1)/12*(bot-top),yB=r=>top+(r-1)/33*(bot-top);
  out+=TBF(150,56,'1970 (of 13)',14,C.ink)+TBF(420,56,'2005 (of 34)',14,C.ink);
  out+=L(150,top,150,bot,C.grid,2)+L(420,top,420,bot,C.grid,2);
  out+=TF(138,top+4,'top',13,C.muted,'end')+TF(138,bot+4,'bottom',13,C.muted,'end');
  // Spread the 2005 labels so they never overlap, with a short leader line to each point.
  const order=L7_ACC.map((x,i)=>i).sort((i,j)=>L7_ACC[i][2]-L7_ACC[j][2]);let prev=-1e9;const ly={};
  order.forEach(i=>{const y=Math.max(yB(L7_ACC[i][2]),prev+15);ly[i]=y;prev=y});
  const shift=Math.max(0,prev-(bot+4));order.forEach(i=>ly[i]-=shift*0);
  L7_ACC.forEach(([n,a,b],i)=>{const on=i===s.a,col=on?C.coral:C.line;
   if(a&&b)out+=L(150,yA(a),420,yB(b),col,on?3:1.2);
   if(a)out+=Ci(150,yA(a),on?6:4,col);
   out+=hit(X,'pick',i,n,Ci(420,yB(b),on?6:4,col)+L(426,yB(b),440,ly[i]-4,C.grid,1)+TF(444,ly[i],n,13,on?C.coral:C.muted,'start'));
  });
  const [n,a,b]=L7_ACC[s.a];
  out+=R(150,272,300,40,'#fff',C.grid,8)+TBF(162,297,n,14,C.coral,'start')+TF(438,297,`${a?`1970: ${a} of 13 · `:''}2005: ${b} of 34`,13,C.ink,'end');
  out+=T(300,338,'The top and bottom barely moved in 35 years',15,C.ink);
  out+=T(300,360,'Ratings judge the speakers’ social standing, not how well the accent works',13,C.muted);
  return {svg:out,phase:'Linguistically, no accent is better than another. Prestige follows the social standing of the people associated with an accent, and these rankings have proved stubborn.'};
 }});

SCENE({id:'accents-attitudes-listening',name:'Hearing an accent that is not there',tag:'Expectations shape listening',
 definition:'Reverse linguistic stereotyping is when a listener’s beliefs about a speaker’s group change what they think they hear, including how accented and how clear the speech seems.',
 example:'Students heard the same recorded lecture by a native speaker of American English. Shown a photo of an Asian face, they rated the speech as more accented and did worse on a comprehension test than students shown a white face.',
 desc:'One recorded lecture with two possible photos; bars for perceived accent and comprehension score in each condition.',
 research:['Rubin (1992). Nonlanguage factors affecting undergraduates’ judgments of nonnative English-speaking teaching assistants. Research in Higher Education 33, 511–531.','Kang & Rubin (2009). Reverse linguistic stereotyping. Journal of Language and Social Psychology 28, 441–456. The students were not told the voice was the same; this scene reconstructs the direction of the result, with illustrative bar heights.'],
 dur:10,hint:'Switch the photo shown with the lecture; the recording never changes.',
 init:()=>({photo:'b'}),
 watch(p){return {photo:p<.5?'a':'b'}},
 ui:[{choose:[['a','Photo A shown'],['b','Photo B shown']],label:'Condition',get:s=>s.photo,act:'photo'}],
 on:{photo(s,v){s.photo=v}},
 draw(s){
  let out=heading('The same lecture, a different photo');
  out+=R(40,60,180,150,'#fff',C.line,10)+P('M80 100h100M80 124h70M80 148h90M80 172h60',C.grid,6)+TF(130,230,'one recording, unchanged',13,C.muted);
  out+=R(250,70,110,130,s.photo==='a'?C.pale:C.purplep,'none',10)+Ci(305,118,22,s.photo==='a'?C.blue:C.purple)+P('M268 196Q305 146 342 196',s.photo==='a'?C.blue:C.purple,0,s.photo==='a'?C.blue:C.purple)+TF(305,222,s.photo==='a'?'photo A: a white face':'photo B: an Asian face',13,C.ink);
  const acc=s.photo==='a'?.3:.65,comp=s.photo==='a'?.75:.6;
  out+=TBF(390,80,'Listeners’ ratings',14,C.ink,'start');
  out+=TF(390,108,'how accented it sounded',13,C.ink,'start')+L7_hbar(390,116,180,16,acc*100,C.coral,'')+TF(390,156,'comprehension test',13,C.ink,'start')+L7_hbar(390,164,180,16,comp*100,C.green,'');
  out+=TF(390,206,'illustrative heights;',13,C.muted,'start')+TF(390,222,'direction as published',13,C.muted,'start');
  out+=T(300,290,s.photo==='b'?'Same voice, but listeners “heard” more accent and understood less':'The baseline: the voice heard with photo A',15,C.ink);
  out+=T(300,316,'The difference came from the listener, not the speaker',15,C.ink);
  out+=T(300,352,'Communication is a two-way job: listeners can do their part',13,C.muted);
  return {svg:out,phase:'Because the recording was identical, any difference in perceived accent or comprehension came from listeners’ expectations. Training and contact can reduce the effect.'};
 }});

/* =========================== world-englishes =========================== */
const L7_CIRC=[['Inner circle','Countries where English is the main first language: the UK, Ireland, the USA, Canada, Australia, New Zealand.','about 380 million first-language speakers',C.blue,60],['Outer circle','Former colonies where English is an official or institutional second language: India, Nigeria, Singapore, Kenya, the Philippines and others.','perhaps 300–500 million second-language speakers',C.green,105],['Expanding circle','Countries where English is learned as a foreign language for international use: China, Japan, Brazil, Germany, Egypt and many more.','perhaps 0.5–1 billion learners and users',C.amber,150]];
SCENE({id:'world-englishes',name:'Three circles of English',tag:'Who speaks English?',
 definition:'World Englishes are the many established varieties of English used around the world. Kachru’s model places them in three circles: inner (first language), outer (official second language) and expanding (foreign language).',
 example:'Far more people use English as a second or foreign language than as a first: native speakers are now a minority of English users.',
 desc:'Three concentric circles with example countries and approximate speaker numbers for the chosen circle.',
 research:['Kachru (1985). Standards, codification and sociolinguistic realism: the English language in the outer circle. In Quirk & Widdowson (eds), English in the World. Cambridge University Press.','Crystal (2003). English as a Global Language, 2nd edn. Cambridge University Press (estimates are wide ranges).'],
 dur:10,hint:'Press a circle to see who is in it and roughly how many speakers it has.',
 init:()=>({c:1}),
 watch(p){return {c:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:L7_CIRC.map((x,i)=>[i,x[0]]),label:'Circle',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=Number(v)},pick(s,a){s.c=Number(a);return 'keep'}},
 draw(s,f,X){
  let out=heading('Kachru’s circles of English');
  for(let i=2;i>=0;i--){const [n,,,col,r]=L7_CIRC[i],on=i===s.c;out+=hit(X,'pick',i,n,Ci(190,212,r,on?tint(col,.75):'#f4f7f9',on?col:C.grid,'stroke-width="2"'))}
  out+=TBF(190,217,'inner',14,C.blue)+TBF(190,130,'outer',14,C.green)+TBF(190,84,'expanding',14,C.amber);
  const [n,body,num,col]=L7_CIRC[s.c];
  out+=R(380,60,200,220,'#fff',col,8)+TBF(392,84,n,15,col,'start')+L7_para(392,108,body,25,13,C.ink,'start',17)+L7_para(392,232,num,25,13,C.muted,'start',16);
  out+=T(300,374,'Most English users are in the outer and expanding circles',14,C.ink);
  return {svg:out,phase:`${n}: ${num}. Kachru argued that Indian, Nigerian or Singaporean English are varieties in their own right, with their own norms, not imperfect copies of British or American English.`};
 }});

const L7_VAR=[
 ['Indian English',[['I am knowing the answer.','Progressive with verbs of state, as in many Indian languages'],['You are coming tomorrow, isn’t it?','One invariant question tag'],['She is my cousin-sister.','Kin term showing a cousin of the same generation']]],
 ['Singapore English (Singlish)',[['Can or not?','Yes–no question by “or not”'],['Don’t worry, lah.','Discourse particle “lah” from Malay and Chinese varieties'],['He go market already.','“Already” marks completion']]],
 ['Nigerian English',[['I will flash you.','Call and hang up so the other person calls back'],['Well done!','Used as a greeting to someone working'],['I am coming.','Can mean “I’ll be right back”']]],
 ['Scottish English',[['I’m needing a coffee.','Progressive with need and want'],['It’s a wee bit cold.','“Wee” for small'],['Outwith the city.','“Outwith” means outside']]]];
SCENE({id:'world-englishes-features',name:'Features of the varieties',tag:'Systematic, not mistakes',
 definition:'Each established variety of English has regular grammatical and vocabulary features of its own, often shaped by the other languages its speakers know.',
 example:'“Can or not?” is the normal Singapore English way to ask “Is that possible?”; it follows a pattern also found in Chinese languages, not a careless shortening.',
 desc:'Four varieties of English, each with three example sentences and a note on the feature each one shows.',
 research:['Kortmann, Lunkenheimer & Ehret (eds) (2020). eWAVE: The Electronic World Atlas of Varieties of English, 3.0 (ewave-atlas.org).','Schneider (2007). Postcolonial English: Varieties around the World. Cambridge University Press. Examples are standard illustrations from the literature.'],
 dur:10,hint:'Choose a variety and press each example to read its note.',
 init:()=>({v:1,e:0}),
 watch(p){const k=Math.floor(p*12);return {v:Math.min(3,Math.floor(k/3)),e:k%3}},
 ui:[{choose:L7_VAR.map((x,i)=>[i,x[0].replace(' (Singlish)','')]),label:'Variety',get:s=>s.v,act:'v'}],
 on:{v(s,v){s.v=Number(v);s.e=0},ex(s,a){s.e=Number(a);return 'keep'}},
 draw(s,f,X){
  const [n,ex]=L7_VAR[s.v];let out=heading(n);
  ex.forEach(([sent,note],i)=>{const y=58+i*76,on=i===s.e;out+=hit(X,'ex',i,sent,R(30,y,540,64,on?'#fff':'#f6f8fa',on?C.purple:C.grid,10)+TBF(46,y+26,'“'+sent+'”',16,on?C.purple:C.ink,'start')+TF(46,y+48,note,13,on?C.ink:C.muted,'start'))});
  out+=T(300,310,'Each feature is used consistently by many speakers',15,C.ink);
  out+=T(300,336,'eWAVE maps 235 such features across 77 varieties of English',13,C.muted);
  return {svg:out,phase:`${n}: “${ex[s.e][0]}” — ${ex[s.e][1]}.`};
 }});

// Jenkins (2000) Lingua Franca Core: features that mattered for intelligibility between non-native speakers.
const L7_LFC=[['Most consonant sounds',true,'Keep p, b, t, d, k, s, z and the rest distinct'],['th as in “think”',false,'Saying “tink” or “sink” rarely caused misunderstanding'],['Puff of air on p, t, k',true,'Without it, “pin” can be heard as “bin”'],['Keeping consonant clusters',true,'Dropping sounds in “product” caused problems; adding a vowel did less harm'],['Long and short vowels',true,'“Ship” and “sheep” need their length difference'],['Exact vowel qualities',false,'Regional vowel colour was usually fine'],['Weak forms (“to” as “tə”)',false,'Full forms were often clearer'],['Stress on the key word',true,'Contrastive stress carried the meaning']];
SCENE({id:'world-englishes-lingua-franca',name:'English as a lingua franca',tag:'What matters for being understood',
 definition:'English as a lingua franca is English used between people who have different first languages. Research asks which features actually matter for mutual understanding, rather than which match a native accent.',
 example:'Between non-native speakers, saying “tink” for “think” rarely caused a misunderstanding, but losing the length difference between “ship” and “sheep” often did.',
 desc:'Eight pronunciation features, each marked core or non-core in Jenkins’s Lingua Franca Core; switch each one off in a speaker and see a rough intelligibility gauge.',
 research:['Jenkins (2000). The Phonology of English as an International Language. Oxford University Press (Lingua Franca Core).','Seidlhofer (2011). Understanding English as a Lingua Franca. Oxford University Press. The gauge is an illustration of the core/non-core idea, not a measured score; the Core itself has been debated (e.g. Dauer 2005).'],
 dur:12,hint:'Switch features off and on; core features change the gauge, non-core ones barely do.',
 init:()=>({off:[1,5]}),
 watch(p){const k=Math.floor(p*8);return {off:range(k)}},
 ui:[{b:'All on',act:'all'}],
 on:{tog(s,a){const i=Number(a);s.off=s.off.includes(i)?s.off.filter(x=>x!==i):s.off.concat(i);return 'keep'},all(s){s.off=[]}},
 draw(s,f,X){
  let out=heading('Which features help speakers understand each other?');
  L7_LFC.forEach(([n,core,why],i)=>{const y=50+i*34,on=!s.off.includes(i);out+=hit(X,'tog',i,n,R(30,y,24,24,on?C.green:'#fff',on?'none':C.line,6)+(on?P(`M36 ${y+12}l5 6l9 -11`,'#fff',2.5):'')+TF(64,y+17,n,14,C.ink,'start')+TF(270,y+17,core?'core':'non-core',13,core?C.coral:C.muted,'start'))});
  const coreOff=s.off.filter(i=>L7_LFC[i][1]).length,nonOff=s.off.filter(i=>!L7_LFC[i][1]).length,score=clamp(100-coreOff*18-nonOff*2,0,100);
  out+=R(360,50,210,220,'#fff',C.grid,8)+TBF(372,74,'Rough intelligibility',14,C.ink,'start');
  out+=R(380,90,40,160,'#f1f5f7','none',6)+R(380,90+160*(1-score/100),40,160*score/100,score>70?C.green:score>45?C.amber:C.coral,'none',6)+TBF(432,176,score+'',22,C.ink,'start')+TF(432,196,'(illustrative)',13,C.muted,'start');
  const last=s.off.length?L7_LFC[s.off[s.off.length-1]]:null;
  out+=L7_para(30,330,last?`${last[0]}: ${last[2]}.`:'All features on. Switch some off to compare core and non-core.',80,13,C.ink,'start',17);
  out+=T(300,370,'Aim for being understood internationally, not for a native accent',13,C.muted);
  return {svg:out,phase:`${coreOff} core and ${nonOff} non-core feature${coreOff+nonOff===1?'':'s'} switched off. Jenkins found that the non-core features, such as the “th” sounds, could be left to local variation without harming understanding.`};
 }});
