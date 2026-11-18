/* =====================================================================
 Consciousness era 6 · Theories: five rival accounts and one head-to-head test.
 Every theory lesson has the same three parts: the claim, what it predicts, and what counts against it.
 No theory is given the last word. Toy models are labelled as toys in the picture. Nothing here flashes,
 no sound is used, and the learner's marks and answers stay on the page.
 ===================================================================== */

// ---- shared helpers (prefix K6_) ----
const K6_wrap=(str,max)=>{const out=[];let line='';for(const w of String(str).split(' ')){if(line&&(line+' '+w).length>max){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out};
// Fixed-size wrapped paragraph; returns svg.
const K6_para=(x,y,str,max,fill=C.ink,anchor='start',lh=17,size=13)=>K6_wrap(str,max).map((l,i)=>TF(x,y+i*lh,l,size,fill,anchor)).join('');
// A badge that marks a toy or schematic inside the picture.
const K6_badgeW=label=>label.length*7.3+20;
const K6_toy=(x,y,label='Toy model')=>R(x,y,K6_badgeW(label),22,C.amberp,C.amber,11)+TBF(x+K6_badgeW(label)/2,y+15.5,label,13,C.amber);
const K6_poly=(pts,col,w=2.5,extra='')=>P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra);
const K6_pct=v=>Math.round(v*100)+'%';
// Normal distribution: density and cumulative probability (Abramowitz & Stegun 7.1.26, error below 2e-7).
const K6_pdf=(x,m,sd)=>Math.exp(-(x-m)*(x-m)/(2*sd*sd))/(sd*Math.sqrt(2*Math.PI));
const K6_erf=x=>{const t=1/(1+.3275911*Math.abs(x)),y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-x*x);return x>=0?y:-y};
const K6_cdf=z=>.5*(1+K6_erf(z/Math.SQRT2));
// Filled area under a curve f between xa and xb (data units), on a baseline at pixel y0.
function K6_area(f,xa,xb,X,y0,scale,fill,op=.5){if(xb<=xa)return '';let d=`M${fmt(X(xa))} ${fmt(y0)}`;for(let i=0;i<=40;i++){const v=xa+(xb-xa)*i/40;d+=` L${fmt(X(v))} ${fmt(y0-f(v)*scale)}`}return P(d+` L${fmt(X(xb))} ${fmt(y0)} Z`,'none',0,fill,`fill-opacity="${op}"`)}
function K6_curve(f,xa,xb,X,y0,scale,col,w=2.5,extra=''){const pts=[];for(let i=0;i<=120;i++){const v=xa+(xb-xa)*i/120;pts.push([X(v),y0-f(v)*scale])}return K6_poly(pts,col,w,extra)}
const K6_SUP='⁰¹²³⁴⁵⁶⁷⁸⁹';
const K6_sup=n=>String(n).split('').map(ch=>ch==='-'?'⁻':K6_SUP[Number(ch)]).join('');
// A number given as its base-10 logarithm, written as "4.1 × 10⁹⁰" (or in full when small).
function K6_sci(lg){if(lg<6)return Math.round(Math.pow(10,lg)).toLocaleString('en-GB');const e=Math.floor(lg),m=Math.pow(10,lg-e);return `${m.toFixed(1)==='10.0'?'1.0':m.toFixed(1)} × 10${K6_sup(m.toFixed(1)==='10.0'?e+1:e)}`}

/* =========================== global-workspace =========================== */
const K6_GW=[['Face','sight'],['Voice','hearing'],['Itch','touch']];
const K6_GW_TH=6,K6_GW_ATT=3;
// Toy competition: score = strength + attention bonus; the single highest score enters if it reaches the threshold.
function K6_gwScore(s){const sc=s.a.map((v,i)=>v+(s.att===i?K6_GW_ATT:0)),m=Math.max(...sc),w=sc.filter(v=>v===m).length===1?sc.indexOf(m):-1;return {sc,w,m,on:w>=0&&m>=K6_GW_TH}}
SCENE({id:'global-workspace',name:'One stage, many listeners',tag:'The claim: consciousness is broadcast',
 definition:'Global workspace theory, proposed by Bernard Baars in 1988, says the brain is a crowd of specialised processors working unconsciously in parallel. A content becomes conscious when it wins a competition for a shared workspace and is broadcast to all the others at once. Stanislas Dehaene, Michel Kerszberg and Jean-Pierre Changeux gave it a neural form in 1998: long-range neurons, dense in prefrontal and parietal cortex, that link distant areas.',
 example:'Baars compared it to a theatre: one actor in the spotlight, heard by a large audience sitting in the dark. The theory predicts that conscious contents come one at a time and that broadcasting shows up as sudden, widespread brain activity. Against it: when no report is asked for, some of that activity vanishes (scene 3).',
 desc:'Three processors with adjustable strengths compete for a central workspace; the winner, if it passes a threshold, is broadcast to memory, speech, planning and evaluation.',
 research:['Baars, B. J. (1988). A Cognitive Theory of Consciousness. Cambridge University Press.','Dehaene, S., Kerszberg, M. & Changeux, J.-P. (1998). A neuronal model of a global workspace in effortful cognitive tasks. PNAS 95, 14529–14534.','Status: a leading theory, not an established one; the competition shown here is a toy.'],
 dur:12,hint:'Set the three strengths and choose where attention goes. Only one content can win, and only if its score reaches 6.',
 init:()=>({a:[4,5,3],att:-1}),
 watch(p){return p<.34?{a:[4,5,3],att:-1}:p<.67?{a:[4,5,3],att:1}:{a:[Math.round(lerp(4,10,smooth((p-.67)/.25))),5,3],att:1}},
 ui:[{range:'a0',label:'Face: strength',min:0,max:10,step:1,get:s=>s.a[0],act:'a0'},{range:'a1',label:'Voice: strength',min:0,max:10,step:1,get:s=>s.a[1],act:'a1'},{range:'a2',label:'Itch: strength',min:0,max:10,step:1,get:s=>s.a[2],act:'a2'},
  {choose:[[-1,'Nowhere'],[0,'Face'],[1,'Voice'],[2,'Itch']],label:'Attention on',get:s=>s.att,act:'att'}],
 on:{a0(s,v){s.a[0]=Number(v);return 'keep'},a1(s,v){s.a[1]=Number(v);return 'keep'},a2(s,v){s.a[2]=Number(v);return 'keep'},att(s,v){s.att=Number(v);return 'keep'}},
 draw(s){
  const g=K6_gwScore(s),cx=300,cy=176;let out=heading('Many processors, one broadcast');
  K6_GW.forEach((c,i)=>{const y=58+i*86,win=g.on&&g.w===i,sc=g.sc[i];
   out+=R(24,y,156,66,win?C.pale:'#fff',win?C.blue:C.grid,8)+TBF(36,y+21,c[0],15,C.ink,'start')+TF(168,y+21,c[1],13,C.muted,'end');
   out+=TF(36,y+39,`score ${s.a[i]}${s.att===i?' + 3 = '+sc:''}`,13,win?C.blue:C.ink,'start');
   out+=R(36,y+47,132,9,'#eef3f6','none',4)+R(36,y+47,132*sc/13,9,win?C.blue:'#9bb4c4','none',4)+L(36+132*K6_GW_TH/13,y+44,36+132*K6_GW_TH/13,y+59,C.coral,2);
   out+=win?arrow(180,y+33,cx-60,cy+(i-1)*22,C.blue,3):L(180,y+33,cx-62,cy+(i-1)*22,C.line,1.6,'stroke-dasharray="4 5"')});
  out+=Ci(cx,cy,58,g.on?C.pale:'#fff',g.on?C.blue:C.line)+TBF(cx,cy-74,'Workspace',14,C.ink)+(g.on?TB(cx,cy+7,K6_GW[g.w][0],19,C.blue):TF(cx,cy+5,'empty',14,C.muted));
  ['Memory','Speech','Planning','Judging value'].forEach((nm,i)=>{const y=56+i*64;
   out+=R(446,y,130,42,g.on?C.greenp:'#fff',g.on?C.green:C.grid,8)+TF(511,y+26,nm,14,g.on?C.green:C.muted);
   out+=g.on?arrow(cx+60,cy+(i-1.5)*18,444,y+21,C.green,2.4):L(cx+62,cy+(i-1.5)*18,444,y+21,C.grid,1.6,'stroke-dasharray="4 5"')});
  out+=K6_toy(24,326)+TF(118,341.5,'Rule: the single highest score enters if it reaches 6 (red mark).',13,C.muted,'start');
  out+=TF(300,368,g.on?`“${K6_GW[g.w][0]}” is available to every system at once; the other two stay local.`:g.w<0?'A tie: in this toy neither content enters.':'No score reaches 6: all three are processed locally and none is broadcast.',13,g.on?C.blue:C.ink);
  return {svg:out,phase:g.on?`${K6_GW[g.w][0]} wins with a score of ${g.m} and is broadcast: on the theory, that is what it is for the ${K6_GW[g.w][0].toLowerCase()} to be conscious. The losing contents are still processed, unconsciously.`:g.w<0?'Two contents are tied. A real brain’s noise would break the tie; the toy leaves the workspace empty.':`The strongest content scores ${g.m}, short of 6, so nothing ignites. Attention adds 3 to one content and can push it over.`};
 }});

const K6_bump=(t,m,w)=>Math.exp(-(t-m)*(t-m)/(2*w*w));
const K6_sig=(t,m,w)=>1/(1+Math.exp(-(t-m)/w));
// Schematic activity (0..1) in four regions at t ms after a brief stimulus, on a seen or an unseen trial.
function K6_ign(t,seen){const late=seen?K6_sig(t,300,22):0;
 return {late,vis:clamp(.9*K6_bump(t,110,45)+.5*late,0,1),temp:clamp(.8*K6_bump(t,180,55)+.6*late,0,1),par:clamp(.18*K6_bump(t,250,60)+.95*late,0,1),pfc:clamp(.14*K6_bump(t,270,60)+.95*late,0,1)}}
SCENE({id:'global-workspace-ignition',name:'Late and everywhere',tag:'What it predicts: ignition',
 definition:'If consciousness is a broadcast, a seen stimulus and an unseen one should start out alike and then part company. Early activity in sensory areas should be similar. Then, on seen trials only, activity should “ignite”: a late, sudden, self-sustaining spread that reaches prefrontal and parietal cortex.',
 example:'In masking experiments the brain’s response to seen and unseen stimuli diverged from roughly 300 ms, with a large, all-or-none difference across frontal and parietal sites (Sergent et al. 2005; Del Cul et al. 2007). Against the prediction: these studies asked for a report on every trial, and later work without reports found part of the late activity missing.',
 desc:'A schematic side view of the brain with four regions whose activity changes with time after a stimulus, beside time courses for a sensory area and the prefrontal–parietal workspace, on seen and unseen trials.',
 research:['Dehaene, S. & Changeux, J.-P. (2011). Experimental and theoretical approaches to conscious processing. Neuron 70, 200–227.','Sergent, C., Baillet, S. & Dehaene, S. (2005). Nature Neuroscience 8, 1391–1400; Del Cul, A., Baillet, S. & Dehaene, S. (2007). PLoS Biology 5, e260.','Status: the late divergence is well replicated when reports are required; what it reflects is contested (Pitts et al. 2014).'],
 dur:12,hint:'Drag the time forward on an unseen trial, then on a seen one. The two agree at first and differ after about 300 ms.',
 init:()=>({t:350,seen:1}),
 watch(p){return p<.5?{t:Math.round(p*2*600/10)*10,seen:0}:{t:Math.round((p-.5)*2*600/10)*10,seen:1}},
 ui:[{range:'t',label:'Time after the stimulus',min:0,max:600,step:10,get:s=>s.t,act:'t',show:v=>v+' ms'},{choose:[[1,'Seen trial'],[0,'Unseen trial']],label:'Trial',get:s=>s.seen,act:'seen'}],
 on:{t(s,v){s.t=Number(v);return 'keep'},seen(s,v){s.seen=Number(v);return 'keep'}},
 draw(s){
  const a=K6_ign(s.t,s.seen);let out=heading('The same start, a different ending');
  out+=P('M35 172 A125 96 0 1 1 285 172 A125 96 0 1 1 35 172','#c7d6e0',2,'#f6f9fb');
  const N={pfc:[82,160,'prefrontal'],par:[188,106,'parietal'],temp:[170,222,'temporal'],vis:[252,180,'visual']};
  if(a.late>.05){const ks=Object.keys(N);for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)out+=L(N[ks[i]][0],N[ks[i]][1],N[ks[j]][0],N[ks[j]][1],C.blue,2.5,`stroke-opacity="${fmt(a.late*.8)}"`)}
  for(const k in N){const [x,y,nm]=N[k];out+=Ci(x,y,17,'#fff',C.blue)+Ci(x,y,17,C.blue,'none',`fill-opacity="${fmt(.08+.92*a[k])}"`)+TF(x,y+(k==='par'?-24:33),nm,13,C.ink)}
  out+=TF(52,292,'front',13,C.muted)+TF(268,292,'back',13,C.muted);
  out+=TBF(160,318,`${s.t} ms · ${s.seen?'seen':'unseen'} trial`,14,s.seen?C.blue:C.muted);
  const x0=352,y0=64,w=216,h=176,X=t=>x0+t/600*w,Y=v=>y0+h-v*h;
  out+=L(x0,y0+h,x0+w,y0+h,C.line,2)+L(x0,y0,x0,y0+h,C.line,2);
  [0,300,600].forEach(t=>out+=L(X(t),y0+h,X(t),y0+h+5,C.line,1.5)+TF(X(t),y0+h+19,t,13,C.muted));
  out+=TF(x0+w/2,y0+h+38,'ms after the stimulus',13,C.muted)+TF(x0-4,y0-8,'activity',13,C.muted,'start');
  const tr=k=>{const pts=[];for(let t=0;t<=600;t+=10)pts.push([X(t),Y(K6_ign(t,s.seen)[k])]);return pts};
  out+=K6_poly(tr('vis'),C.amber,2.4,'stroke-dasharray="6 4"')+K6_poly(tr('pfc'),C.blue,3);
  out+=L(X(s.t),y0,X(s.t),y0+h,C.coral,1.6)+Ci(X(s.t),Y(a.vis),5,C.amber,'#fff')+Ci(X(s.t),Y(a.pfc),5,C.blue,'#fff');
  out+=L(352,296,378,296,C.amber,2.4,'stroke-dasharray="6 4"')+TF(384,300,'visual area',13,C.amber,'start')+L(352,316,378,316,C.blue,3)+TF(384,320,'prefrontal and parietal',13,C.blue,'start');
  out+=K6_toy(24,340,'Schematic of the prediction, not data');
  return {svg:out,phase:s.t<200?'Early on, the visual response is the same whether or not the stimulus will be seen. On the theory this stage is unconscious.':!s.seen?'On an unseen trial the activity fades without spreading. The stimulus was processed, and may still nudge behaviour, but was never broadcast.':s.t<300?'Just before ignition: the frontal and parietal response is still small.':'Ignition: frontal, parietal and sensory areas now sustain one another. The theory predicts this is late, sudden and all-or-none.'};
 }});

const K6_CATS={fits:['Fits the theory',C.green,C.greenp],against:['Counts against',C.coral,C.coralp],disputed:['Disputed',C.amber,C.amberp]};
const K6_GWF=[
 {t:'When a masked stimulus is seen, brain activity after about 300 ms is larger and far more widespread than when the same stimulus goes unseen.',src:'Sergent et al. 2005; Del Cul et al. 2007',usual:'fits',
  read:'This is the ignition the theory predicts. The caution: people reported on every trial, so some of the late activity may belong to reporting, not to seeing.'},
 {t:'When people see a stimulus but are not asked to report it, the late P3b brain wave can disappear.',src:'Pitts et al. 2014; Cohen et al. 2020',usual:'against',
  read:'The P3b was long offered as a signature of conscious access. Supporters reply that the theory requires broadcast, not this one wave. Either way the P3b can no longer be treated as a marker of consciousness.'},
 {t:'In monkeys watching two rival images, with no report required, prefrontal neurons still followed which image was dominant.',src:'Kapoor et al. 2022',usual:'fits',
  read:'Prefrontal involvement without report is what the theory needs. Critics reply that following the percept does not show the activity is required for it.'},
 {t:'In the adversarial test, prefrontal activity showed the predicted burst when a picture appeared, but not when it disappeared.',src:'Cogitate Consortium, first presented 2023',usual:'against',
  read:'The burst at offset was a prediction agreed in advance, so its absence counts against the theory as stated. It does not show that there is no workspace (see the last lesson of this era).'},
 {t:'People with large areas of prefrontal cortex damaged or removed can still report rich experience.',src:'Boly et al. 2017; Odegaard, Knight & Lau 2017',usual:'disputed',
  read:'Boly and colleagues take this to show the front is not needed for experience. Odegaard, Knight and Lau reply that the damage was incomplete and that subtler losses went untested. Unresolved.'}];
SCENE({id:'global-workspace-against',name:'Weighing the workspace',tag:'What counts against it',
 definition:'A theory earns its keep by the findings it could have got wrong. For global workspace theory the main pressure comes from no-report experiments, which remove the need to answer on each trial, and from the adversarial test first presented in 2023. The theory still predicts ignition and prefrontal–parietal involvement; the question is which findings bear that out.',
 example:'Five findings follow. Some fit the theory, some count against it and one is read both ways. Sort each, then compare with how it is usually read. A further objection is philosophical: critics such as Ned Block say the theory explains access to information, not experience itself.',
 desc:'Five findings shown one at a time; the learner sorts each as fitting the theory, counting against it or disputed, and then sees the usual reading and the reply to it.',
 research:['Pitts, M. A. et al. (2014). Gamma band activity and the P3 reflect post-perceptual processes, not visual awareness. NeuroImage 101, 337–350.','Cohen, M. A. et al. (2020). Journal of Neuroscience 40, 4925–4935; Kapoor, V. et al. (2022). Nature Communications 13, 1535.','Boly, M. et al. (2017) and Odegaard, B., Knight, R. T. & Lau, H. (2017). Journal of Neuroscience 37. Status: contested throughout; no finding here proves or refutes the theory.'],
 dur:15,hint:'Sort each finding, then read how it is usually taken. Disagreeing with the usual reading is allowed: several of these are argued over. Your sorting stays on this page.',
 init:()=>({i:0,ans:K6_GWF.map(()=>null)}),
 watch(p){const n=K6_GWF.length,i=Math.min(n-1,Math.floor(p*n)),u=p*n-i;return {i,ans:K6_GWF.map((it,j)=>j<i||(j===i&&u>.4)?it.usual:null),sim:true}},
 ui:[{choose:Object.keys(K6_CATS).map(k=>[k,K6_CATS[k][0]]),label:'Your sorting',get:s=>s.ans[s.i]||'',act:'ans'},{b:'Next finding',act:'next'},{b:'Previous',act:'prev'}],
 on:{ans(s,v){s.ans[s.i]=v;return 'keep'},next(s){s.i=(s.i+1)%K6_GWF.length;return 'keep'},prev(s){s.i=(s.i+K6_GWF.length-1)%K6_GWF.length;return 'keep'},go(s,v){s.i=Number(v);return 'keep'}},
 draw(s,f,X){
  const n=K6_GWF.length,it=K6_GWF[s.i],a=s.ans[s.i];let out=heading('Five findings: for, against or disputed?');
  K6_GWF.forEach((q,j)=>{const x=300+(j-(n-1)/2)*46,c=s.ans[j]?K6_CATS[s.ans[j]]:null;
   out+=hit(X,'go',j,`Finding ${j+1}${s.ans[j]?', sorted as '+K6_CATS[s.ans[j]][0]:''}`,Ci(x,58,14,c?c[2]:'#fff',j===s.i?C.ink:c?c[1]:C.line)+TBF(x,62.5,j+1,13,C.ink))});
  out+=R(40,80,520,108,'#fff',C.grid,8)+TBF(56,101,`Finding ${s.i+1} of ${n}`,13,C.muted,'start')+K6_para(56,121,it.t,76)+TF(56,178,it.src,13,C.muted,'start');
  if(a){const u=K6_CATS[it.usual];
   out+=R(40,198,520,126,u[2],'none',8)+TBF(56,220,'Usual reading: '+u[0].toLowerCase(),14,u[1],'start')+K6_para(56,241,it.read,76);
   out+=TF(56,314,s.sim?'Simulated learner (Watch)':`You sorted it as “${K6_CATS[a][0].toLowerCase()}”${a===it.usual?', the usual reading.':'. Researchers disagree here too.'}`,13,C.muted,'start')}
  else out+=R(40,198,520,126,'#f6f9fb','none',8)+TF(300,258,'Sort this finding to see how it is usually read.',13,C.muted)+TF(300,278,'There is room for disagreement on several of them.',13,C.muted);
  const done=s.ans.filter(Boolean).length;
  out+=TF(300,352,`${done} of ${n} sorted · no single finding settles the theory either way`,13,C.muted);
  return {svg:out,phase:a?`Finding ${s.i+1} is usually read as “${K6_CATS[it.usual][0].toLowerCase()}”. Notice that each reading comes with a reply from the other side.`:'Read the finding and decide: is it what a broadcast theory expects, the opposite, or still in dispute?'};
 }});

/* =========================== integrated-information =========================== */
// Toy score in the spirit of Φ: over every one-way cut (from part P to the rest Q), count the connections severed;
// the score is the smallest count. It counts wires, not information, and is not IIT's measure.
function K6_cuts(nodes,edges){const n=nodes.length,out=[];for(let m=1;m<(1<<n)-1;m++){const inP=new Set(nodes.filter((_,i)=>m>>i&1)),P=nodes.filter(v=>inP.has(v)),Q=nodes.filter(v=>!inP.has(v));
 out.push({P,Q,c:edges.filter(e=>inP.has(e[0])&&!inP.has(e[1])&&nodes.includes(e[1])).length})}return out}
const K6_phi=(nodes,edges)=>nodes.length<2?0:Math.min(...K6_cuts(nodes,edges).map(c=>c.c));
const K6_E3=[['A','B'],['B','A'],['B','C'],['C','B'],['C','A'],['A','C']];
const K6_N3={A:[150,86],B:[62,238],C:[238,238]};
const K6_PRE3={chain:[1,0,1,0,0,0],ring:[1,0,1,0,1,0],all:[1,1,1,1,1,1],pair:[1,1,0,0,0,0]};
function K6_complex3(edges){let best=null;for(const sub of [['A','B','C'],['A','B'],['A','C'],['B','C']]){const e=edges.filter(x=>sub.includes(x[0])&&sub.includes(x[1])),v=K6_phi(sub,e);if(!best||v>best.v)best={sub,v}}return best}
SCENE({id:'integrated-information',name:'A whole that is more than its parts',tag:'The claim: experience is integrated information',
 definition:'Integrated information theory (IIT), proposed by Giulio Tononi in 2004, starts from experience itself. It lists properties it takes every experience to have (each is definite, structured, specific, unified and bounded) and asks what a physical system must be like to have them. Its answer: a system is conscious to the degree that its parts constrain one another as a whole, beyond what the parts do separately. That quantity is written Φ (phi).',
 example:'Cut a system in two. If nothing is lost, it was never one thing, and Φ is zero. The theory predicts that wiring matters and behaviour does not: a loop can be conscious where a one-way chain doing the same job cannot. Against it: Φ cannot be calculated for a real brain, and the theory credits very simple lattices with experience (scenes 3 and 4).',
 desc:'Three nodes with six possible one-way connections that the learner switches on and off, a table counting the connections severed by each one-way cut, and the smallest count shown as a toy score.',
 research:['Tononi, G. (2004). An information integration theory of consciousness. BMC Neuroscience 5, 42.','Oizumi, M., Albantakis, L. & Tononi, G. (2014). From the phenomenology to the mechanisms of consciousness: Integrated Information Theory 3.0. PLoS Computational Biology 10, e1003588.','Status: contested. The score here is a toy that counts connections; IIT’s Φ is defined over cause–effect structure and is far harder to compute.'],
 dur:12,hint:'Press the on/off tags to rewire the three nodes, or pick a preset. The score is the weakest one-way link: the fewest connections any cut would sever.',
 init:()=>({e:K6_PRE3.ring.slice(),pre:'ring'}),
 watch(p){const k=['chain','ring','all','pair'][Math.min(3,Math.floor(p*4))];return {e:K6_PRE3[k].slice(),pre:k}},
 ui:[{choose:[['chain','Chain'],['ring','Ring'],['all','All six'],['pair','Pair + spare']],label:'Preset',get:s=>s.pre,act:'pre'}],
 on:{pre(s,v){s.pre=v;s.e=K6_PRE3[v].slice();return 'keep'},flip(s,i){s.e[Number(i)]=s.e[Number(i)]?0:1;s.pre='';return 'keep'}},
 draw(s,f,X){
  const edges=K6_E3.filter((_,i)=>s.e[i]),cuts=K6_cuts(['A','B','C'],edges),phi=Math.min(...cuts.map(c=>c.c)),cx=K6_complex3(edges);
  let out=heading('Cut it every way: what is the weakest link?'),tags='';
  K6_E3.forEach((e,i)=>{const a=K6_N3[e[0]],b=K6_N3[e[1]],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy),ux=dx/d,uy=dy/d,bend=44,x1=a[0]+ux*27,y1=a[1]+uy*27,x2=b[0]-ux*29,y2=b[1]-uy*29;
   out+=s.e[i]?curveArrow(x1,y1,x2,y2,bend,C.blue,2.6):'';
   const mx=(a[0]+b[0])/2-uy*bend/2,my=(a[1]+b[1])/2+ux*bend/2;
   tags+=hit(X,'flip',i,`Connection ${e[0]} to ${e[1]}: ${s.e[i]?'on':'off'}. Press to switch.`,R(mx-17,my-11,34,22,s.e[i]?C.blue:'#fff',s.e[i]?C.blue:C.line,11)+TBF(mx,my+4.5,s.e[i]?'on':'off',13,s.e[i]?'#fff':C.muted))});
  out+=tags;
  for(const k in K6_N3){const [x,y]=K6_N3[k],inC=cx.v>0&&cx.sub.includes(k);out+=Ci(x,y,25,inC?C.greenp:'#fff',inC?C.green:C.blue)+TB(x,y+6,k,18,C.ink)}
  out+=TF(150,306,X&&X.try?'press a tag to switch that connection':'each arrow is a one-way connection',13,C.muted);
  out+=TBF(322,66,'One-way cut',13,C.muted,'start')+TBF(570,66,'severed',13,C.muted,'end');
  cuts.forEach((c,i)=>{const y=76+i*26,min=c.c===phi;out+=(min?R(314,y,262,24,C.coralp,'none',6):'')+TF(322,y+17,`${c.P.join(', ')}  →  ${c.Q.join(', ')}`,13,C.ink,'start')+TBF(566,y+17,c.c,14,min?C.coral:C.ink,'end')});
  out+=TBF(322,256,`Toy score: the smallest count = ${phi}`,15,phi?C.green:C.coral,'start');
  out+=TF(322,278,cx.v>0?`Most integrated part: ${cx.sub.join(', ')} (score ${cx.v})`:'No part is integrated: nothing loops back',13,cx.v>0?C.green:C.muted,'start');
  if(cx.v>0)out+=TF(322,298,'Green nodes belong to that part.',13,C.muted,'start');
  out+=R(24,334,552,28,C.amberp,C.amber,8)+TBF(300,353,'A toy in the spirit of Φ, not IIT’s measure: it counts wires, not information',13,C.amber);
  return {svg:out,phase:phi===0?(cx.v>0?`Some cut severs nothing, so the three nodes are not one integrated whole and the toy score is 0. The pair ${cx.sub.join(' and ')} is integrated on its own (score ${cx.v}); the theory would say the experience, if any, belongs to that part.`:'Some cut severs nothing: no signal ever returns to where it started. A purely one-way system scores 0, however much it computes.'):`Every one-way cut severs at least ${phi} connection${phi>1?'s':''}, so the three nodes hang together as a whole. On IIT, integration of this kind, measured properly, is what consciousness is.`};
 }});

const K6_ARCH={chain:['Forward chain','Signals only ever move left to right, as in a purely feedforward network.'],modules:['Separate modules','Many small one-way circuits side by side that do not talk to one another: IIT’s picture of the cerebellum.'],lattice:['Two-way lattice','Each unit both drives and is driven by its neighbours: IIT’s picture of the back of the cortex.']};
// A link between two units of radius 14 with small arrowheads (one-way, or both ways).
function K6_link(a,b,col,two){const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1,ux=dx/d,uy=dy/d,x1=a[0]+ux*16,y1=a[1]+uy*16,x2=b[0]-ux*16,y2=b[1]-uy*16,mx=(x1+x2)/2,my=(y1+y2)/2;
 return two?arrow(mx,my,x2,y2,col,2,6)+arrow(mx,my,x1,y1,col,2,6):arrow(x1,y1,x2,y2,col,2,6)}
function K6_archNet(arch,n){const nodes=[],edges=[],id=(r,c)=>r+'_'+c;for(let c=0;c<n;c++)for(let r=0;r<2;r++)nodes.push(id(r,c));
 for(let c=0;c<n;c++){
  if(arch==='modules')edges.push([id(0,c),id(1,c)]);
  if(arch==='chain'&&c<n-1)for(let r=0;r<2;r++)for(let q=0;q<2;q++)edges.push([id(r,c),id(q,c+1)]);
  if(arch==='lattice'){edges.push([id(0,c),id(1,c)],[id(1,c),id(0,c)]);if(c<n-1)for(let r=0;r<2;r++)edges.push([id(r,c),id(r,c+1)],[id(r,c+1),id(r,c)])}}
 return {nodes,edges}}
SCENE({id:'integrated-information-predictions',name:'Wiring, not numbers',tag:'What it predicts: the back of the cortex, not the cerebellum',
 definition:'Because Φ depends on how parts constrain one another, IIT makes predictions about anatomy. The physical basis of experience should lie where connections are dense and two-way, which it takes to be a “hot zone” at the back of the cortex. The cerebellum should contribute little, though it holds most of the brain’s neurons, because its circuits are largely separate and one-way. And a purely feedforward system has zero Φ whatever it can do.',
 example:'The cerebellum has about 69 billion of the brain’s roughly 86 billion neurons, the cerebral cortex about 16 billion. People who lose much of the cerebellum have trouble with movement and coordination but remain conscious. That fits IIT, though it does not single it out: other theories also leave the cerebellum out. Against these predictions, the 2023 adversarial test did not find the sustained synchrony IIT expected at the back of the cortex.',
 desc:'A network of two rows of units in one of three wirings (forward chain, separate modules, two-way lattice) whose size the learner sets, with its toy integration score, beside bars for neuron counts in the cerebellum and cerebral cortex.',
 research:['Tononi, G. & Koch, C. (2015). Consciousness: here, there and everywhere? Philosophical Transactions of the Royal Society B 370, 20140167.','Azevedo, F. A. C. et al. (2009). Equal numbers of neuronal and nonneuronal cells make the human brain an isometrically scaled-up primate brain. Journal of Comparative Neurology 513, 532–541.','Status: the anatomy is robust; that it supports IIT in particular is contested.'],
 dur:12,hint:'Choose a wiring, then add units. Watch whether the toy score changes as the network grows.',
 init:()=>({arch:'modules',n:4}),
 watch(p){const k=Math.min(2,Math.floor(p*3));return {arch:['chain','modules','lattice'][k],n:2+Math.min(4,Math.floor((p*3-k)*5))}},
 ui:[{choose:[['chain','Forward chain'],['modules','Separate modules'],['lattice','Two-way lattice']],label:'Wiring',get:s=>s.arch,act:'arch'},{range:'n',label:'Size',min:2,max:6,step:1,get:s=>s.n,act:'n',show:v=>2*v+' units'}],
 on:{arch(s,v){s.arch=v;return 'keep'},n(s,v){s.n=Number(v);return 'keep'}},
 draw(s){
  const net=K6_archNet(s.arch,s.n),phi=K6_phi(net.nodes,net.edges),pos=id=>{const [r,c]=id.split('_').map(Number);return [56+c*52,r?206:112]};
  let out=heading(K6_ARCH[s.arch][0]+': more units, same wiring');
  const seen=new Set();for(const e of net.edges){const a=pos(e[0]),b=pos(e[1]),two=net.edges.some(x=>x[0]===e[1]&&x[1]===e[0]);
   if(two){const key=[e[0],e[1]].sort().join('|');if(seen.has(key))continue;seen.add(key);out+=K6_link(a,b,C.blue,true)}else out+=K6_link(a,b,C.muted,false)}
  for(const id of net.nodes){const [x,y]=pos(id);out+=Ci(x,y,14,phi?C.greenp:'#fff',phi?C.green:C.blue)}
  out+=counter(36,246,'units',String(2*s.n),C.ink,120)+counter(170,246,'toy score',String(phi),phi?C.green:C.coral,150);
  out+=K6_para(36,312,K6_ARCH[s.arch][1],50,C.muted);
  out+=TBF(478,64,'Neurons (billions)',13,C.ink);
  const base=246,sc=2.1;[[430,69,'cerebellum',C.muted],[526,16,'cerebral cortex',C.green]].forEach(([x,v,nm,col])=>{out+=R(x-30,base-v*sc,60,v*sc,col==='#546873'?'#b7c6d0':C.greenp,col,4)+TBF(x,base-v*sc-7,v,14,C.ink)+TF(x,base+18,nm,13,C.ink)});
  out+=L(384,base,574,base,C.line,2)+TF(478,286,'Azevedo et al. 2009',13,C.muted)+TF(478,304,'IIT: the count does not matter',13,C.muted);
  out+=K6_toy(360,336,'Toy score, not IIT’s Φ');
  return {svg:out,phase:s.arch==='lattice'?`With ${2*s.n} units wired both ways, every one-way cut severs at least ${phi} connections. The lattice stays one integrated whole as it grows.`:s.arch==='modules'?`${s.n} separate modules, ${2*s.n} units, toy score 0: you can cut between modules without severing anything. Adding modules adds neurons but no integration, which is how IIT explains the cerebellum.`:`A forward chain of ${2*s.n} units scores 0 at any size: cutting from later units back to earlier ones severs nothing, because nothing runs backwards.`};
 }});

// Two-part splits of n elements: 2^(n-1) - 1. Returned as a base-10 logarithm so that large n stay finite.
const K6_lgSplits=n=>n<=50?Math.log10(Math.pow(2,n-1)-1):(n-1)*Math.log10(2);
function K6_duration(lgSec){const sec=Math.pow(10,Math.min(lgSec,300));
 if(lgSec<0)return 'under a second';if(sec<120)return Math.round(sec)+' seconds';if(sec<7200)return Math.round(sec/60)+' minutes';if(sec<172800)return Math.round(sec/3600)+' hours';
 const lgY=lgSec-Math.log10(31557600);if(lgY<0)return Math.round(sec/86400)+' days';if(lgY<3)return Math.round(Math.pow(10,lgY)).toLocaleString('en-GB')+' years';return K6_sci(lgY)+' years'}
SCENE({id:'integrated-information-partitions',name:'Too many ways to cut',tag:'Against it: Φ cannot be computed for a brain',
 definition:'To find Φ you must find the cut that does the least damage, which means trying the cuts. The number of ways to split a system in two doubles with every element added: for n elements it is 2ⁿ⁻¹ − 1. IIT’s full recipe is far heavier still, since it also considers every subset of elements and every state. In practice Φ has been calculated exactly only for systems of a handful of elements.',
 example:'With 10 elements there are 511 two-part splits. With 302, the number of neurons in the worm C. elegans, there are about 4 × 10⁹⁰, more than the roughly 10⁸⁰ atoms in the observable universe. This is the practical objection to the theory: its predictions about real brains rest on approximations and on arguments about anatomy, not on measured values of Φ. Supporters reply that a quantity can be real though hard to compute; critics reply that a theory whose central quantity cannot be measured is hard to test.',
 desc:'A slider for the number of elements, a graph of the number of two-part splits on a logarithmic scale with a line for the number of atoms in the observable universe, and the time needed to try every split at a billion a second.',
 research:['Oizumi, M., Albantakis, L. & Tononi, G. (2014). PLoS Computational Biology 10, e1003588.','Mayner, W. G. P. et al. (2018). PyPhi: a toolbox for integrated information theory. PLoS Computational Biology 14, e1006343.','Status: the combinatorial explosion is arithmetic and not disputed; what follows from it for the theory is.'],
 dur:10,hint:'Slide the number of elements up from 2. Find where trying every split would take longer than the age of the universe, about 14 billion years.',
 init:()=>({n:10}),
 watch(p){return {n:Math.round(lerp(2,302,smooth(p)))}},
 ui:[{range:'n',label:'Elements in the system',min:2,max:302,step:1,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=Number(v);return 'keep'}},
 draw(s){
  const lg=K6_lgSplits(s.n),x0=64,y0=62,w=318,h=214,X=n=>x0+n/302*w,Y=v=>y0+h-v/100*h;
  let out=heading('Every added element doubles the work');
  out+=L(x0,y0+h,x0+w,y0+h,C.line,2)+L(x0,y0,x0,y0+h,C.line,2);
  [[0,'1'],[20,'10²⁰'],[40,'10⁴⁰'],[60,'10⁶⁰'],[80,'10⁸⁰'],[100,'10¹⁰⁰']].forEach(([v,l])=>out+=L(x0-5,Y(v),x0,Y(v),C.line,1.5)+TF(x0-8,Y(v)+4,l,13,C.muted,'end'));
  [[2,'2'],[100,'100'],[200,'200'],[302,'302']].forEach(([v,l])=>out+=L(X(v),y0+h,X(v),y0+h+5,C.line,1.5)+TF(X(v),y0+h+19,l,13,C.muted));
  out+=TF(x0+w/2,y0+h+38,'elements (302 = neurons in the worm C. elegans)',13,C.muted);
  out+=L(x0,Y(80),x0+w,Y(80),C.amber,1.6,'stroke-dasharray="6 4"')+TF(x0+6,Y(80)-6,'atoms in the observable universe, about 10⁸⁰',13,C.amber,'start');
  out+=L(X(2),Y(0),X(302),Y(K6_lgSplits(302)),C.blue,2.6)+L(X(s.n),Y(lg),X(s.n),y0+h,C.coral,1.4,'stroke-dasharray="3 4"')+Ci(X(s.n),Y(lg),6,C.coral,'#fff');
  out+=counter(404,62,'elements',String(s.n),C.ink,172)+counter(404,118,'two-part splits',(s.n>20?'≈ ':'')+K6_sci(lg),C.coral,172)+counter(404,174,'at a billion a second',K6_duration(lg-9),C.blue,172);
  out+=K6_para(404,246,'IIT’s full calculation is heavier still: this counts only splits into two parts.',26,C.muted);
  return {svg:out,phase:s.n<=30?`${s.n} elements can be split in two in ${K6_sci(lg)} ways: quick work for a computer.`:lg-9-Math.log10(31557600)<Math.log10(1.38e10)?`${s.n} elements: about ${K6_sci(lg)} splits, or ${K6_duration(lg-9)} at a billion a second. Still tiny beside a brain.`:`${s.n} elements: about ${K6_sci(lg)} splits. At a billion a second that takes ${K6_duration(lg-9)}, longer than the age of the universe. A human cortex has about 16 billion neurons.`};
 }});

const K6_parity=x=>{let p=0;return x.map(b=>(p^=b))};
SCENE({id:'integrated-information-against',name:'Same behaviour, different verdict',tag:'Against it: unfolding, lattices and a public row',
 definition:'Three objections stand out. The unfolding argument (Doerig and colleagues, 2019): any network with loops can be rebuilt as a longer network without loops that gives the same outputs, yet IIT says only the looped one is conscious, so no experiment on behaviour could test it. Scott Aaronson (2014) showed that simple, regular lattices can have more Φ than a human brain; Tononi accepted the consequence. And in 2023 an open letter signed by over 100 researchers called IIT pseudoscience, while others, some of them critics of IIT, replied that the label was unjustified.',
 example:'Both networks below compute the same thing, whether the number of 1s so far is odd. One uses a loop; the other spends one unit per time step. IIT predicts a difference in experience where there is none in behaviour. Its defenders reply that this is the point: on their view consciousness is a matter of what a system is, not of what it does.',
 desc:'Four input bits the learner can flip, fed to a two-unit network with a loop and to a four-unit chain without one; both show the same outputs, with toy integration scores of 1 and 0. A 3D view stacks the loop through time.',
 research:['Doerig, A., Schurger, A., Hess, K. & Herzog, M. H. (2019). The unfolding argument: why IIT and other causal structure theories cannot explain consciousness. Consciousness and Cognition 72, 49–59.','Aaronson, S. (2014). Why I am not an integrated information theorist (or, the unconscious expander). Shtetl-Optimized blog.','IIT-Concerned et al. (2023). The integrated information theory of consciousness as pseudoscience. PsyArXiv. Status: all three objections are contested by the theory’s supporters.'],
 dur:12,hint:'Flip the input bits. The two networks always agree, though only one contains a loop. Switch to 3D to see the loop stretched out through time.',
 init:()=>({x:[0,1,0,1]}),
 watch(p){const k=Math.min(15,Math.floor(p*8))*2+1;return {x:[k>>3&1,k>>2&1,k>>1&1,k&1]}},
 ui:[{b:'Flip all four',act:'all'}],
 on:{flip(s,i){s.x[Number(i)]^=1;return 'keep'},all(s){s.x=s.x.map(b=>b^1);return 'keep'}},
 draw(s,f,X){
  const y=K6_parity(s.x),loop=K6_phi(['H','M'],[['H','M'],['M','H']]),chain=K6_phi(['1','2','3','4'],[['1','2'],['2','3'],['3','4']]);
  let out=heading('A loop and a chain that do the same job',26);
  out+=TF(212,64,'input bits',13,C.muted,'end')+bitRow(X,s.x,222,44,32,'flip',{gap:8})+TF(388,64,X&&X.try?'press to flip':'one per time step',13,C.muted,'start');
  const cell=(x,yy,b,col)=>R(x-14,yy,28,26,b?col:'#fff',b?col:C.line,6)+TMF(x,yy+18.5,b,14,b?'#fff':C.muted,'middle','font-weight="700"');
  out+=R(24,88,268,218,'#fff',C.grid,8)+TBF(158,110,'With a loop: 2 units',14,C.ink);
  out+=arrow(104,124,104,148,C.muted,2)+TF(112,138,'input',13,C.muted,'start')+curveArrow(128,164,188,164,-20,C.blue,2.4)+curveArrow(188,188,128,188,-20,C.blue,2.4);
  out+=Ci(104,176,24,C.greenp,C.green)+TB(104,182,'H',17,C.ink)+Ci(212,176,24,C.greenp,C.green)+TB(212,182,'M',17,C.ink);
  out+=TF(158,226,'M holds H’s last value and feeds it back',13,C.muted)+TF(60,256,'out',13,C.muted,'end');
  y.forEach((b,i)=>out+=cell(88+i*46,238,b,C.green));
  out+=TBF(158,292,`toy score ${loop}`,14,C.green);
  out+=R(308,88,268,218,'#fff',C.grid,8)+TBF(442,110,'Unfolded: 4 units, no loop',14,C.ink);
  [0,1,2,3].forEach(i=>{const x=346+i*64;out+=arrow(x,124,x,154,C.muted,2)+(i<3?arrow(x+19,176,x+45,176,C.muted,2.2):'')+Ci(x,176,18,'#fff',C.blue)+TF(x,181,i+1,14,C.ink)+cell(x,238,y[i],C.blue)});
  out+=TF(442,226,'each unit handles one time step',13,C.muted)+TBF(442,292,`toy score ${chain}`,14,C.coral);
  out+=TBF(300,326,`Outputs agree: ${y.join(', ')} and ${y.join(', ')}`,14,C.ink);
  out+=R(24,338,552,28,C.amberp,C.amber,8)+TBF(300,357,'Toy scores in the spirit of Φ, not IIT’s measure',13,C.amber);
  return {svg:out,phase:`For the input ${s.x.join(', ')} both networks output ${y.join(', ')}: a 1 whenever the number of 1s so far is odd. No test of behaviour can tell them apart, yet only the loop is integrated. Critics call that untestable; supporters say behaviour was never the measure.`};
 },
 three(s,f,X,project){
  const y=K6_parity(s.x),H=t=>[t*3,0,0],M=t=>[t*3+1.5,0,2.4],I=t=>[t*3,-3,0],mix=(a,b,u)=>a.map((v,i)=>v+(b[i]-v)*u),P=project([[-.8,-3.6,-.5],[11.6,.6,3]]);let out='';
  for(let t=0;t<4;t++){out+=arrow3(mix(I(t),H(t),.1),mix(I(t),H(t),.72),P,C.muted,2)+arrow3(mix(H(t),M(t),.2),mix(H(t),M(t),.8),P,C.blue,2.6);if(t<3)out+=arrow3(mix(M(t),H(t+1),.2),mix(M(t),H(t+1),.8),P,C.coral,2.6)}
  out+=sortedItems([0,1,2,3].flatMap(t=>[{at:H(t),svg:Q=>{const q=Q(H(t));return Ci(q[0],q[1],17,y[t]?C.green:'#fff',C.green)+TBF(q[0],q[1]+5,'H',14,y[t]?'#fff':C.ink)}},
   {at:M(t),svg:Q=>{const q=Q(M(t));return Ci(q[0],q[1],15,'#fff',C.blue)+TBF(q[0],q[1]+5,'M',13,C.ink)}},
   {at:I(t),svg:Q=>{const q=Q(I(t));return TBF(q[0],q[1]+16,`step ${t+1}: ${s.x[t]}`,13,C.muted)}}]),P);
  return {svg:out,title:'The loop, stretched out through time',caption:'Each step of the loop is drawn as its own layer. H passes its value to M (blue), and M hands it to H at the next step (coral). Build every layer as separate units and the result has no loop at all, yet gives the same outputs. Grey arrows are the inputs; filled H units are outputting 1.'};
 }});

/* =========================== higher-order =========================== */
const K6_HOT={'11':['Conscious','You consciously see red. The higher-order state does the work without being noticed itself.',C.green],
 '10':['Unconscious','Red is registered and can guide behaviour, but there is nothing it is like for you. The theory reads blindsight this way.',C.muted],
 '01':['Conscious?','It would seem to you that you see red, though no state registers it. Rosenthal accepts this; critics call it the empty case.',C.amber],
 '00':['Nothing','No state to be aware of, and no awareness of one.',C.muted]};
SCENE({id:'higher-order',name:'Aware of being in a state',tag:'The claim: a state is conscious when you are aware of it',
 definition:'Higher-order theories start from an everyday thought: a mental state you are in no way aware of being in is not a conscious state. David Rosenthal (1986) turned this into a theory. A first-order state, such as the visual system registering red, becomes conscious when it is accompanied by a suitable higher-order state that represents you as being in it. The higher-order state need not be conscious itself.',
 example:'The theory predicts that perception and awareness of perceiving can come apart, and that brain areas beyond the sensory ones, especially prefrontal cortex, matter for awareness more than for performance. Against it: what if the higher-order state occurs with no first-order state beneath it? And does the theory demand too much of infants and animals? (Scene 3.)',
 desc:'Two stacked boxes, a first-order state registering red and a higher-order state representing oneself as seeing red, each switched on or off, with the theory’s verdict for each of the four combinations.',
 research:['Rosenthal, D. M. (1986). Two concepts of consciousness. Philosophical Studies 49, 329–359.','Rosenthal, D. M. (2005). Consciousness and Mind. Oxford University Press.','Lau, H. & Rosenthal, D. (2011). Empirical support for higher-order theories of conscious awareness. Trends in Cognitive Sciences 15, 365–373. Status: a major family of theories; contested.'],
 dur:12,hint:'Switch each state on and off and read the verdict. Try the case with a higher-order state and nothing below it.',
 init:()=>({fo:1,ho:1}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {fo:[1,1,0,0][k],ho:[1,0,1,0][k]}},
 ui:[{choose:[[1,'Present'],[0,'Absent']],label:'First-order state',get:s=>s.fo,act:'fo'},{choose:[[1,'Present'],[0,'Absent']],label:'Higher-order state',get:s=>s.ho,act:'ho'}],
 on:{fo(s,v){s.fo=v===undefined||v===''?1-s.fo:Number(v);return 'keep'},ho(s,v){s.ho=v===undefined||v===''?1-s.ho:Number(v);return 'keep'}},
 draw(s,f,X){
  const v=K6_HOT[''+s.ho+s.fo];let out=heading('Two levels, four cases');
  const lvl=(y,on,title,sub,col,pale,act)=>hit(X,act,'',`${title}: ${on?'present':'absent'}. Press to switch.`,R(120,y,250,66,on?pale:'#fff',on?col:C.line,8,on?'':'stroke-dasharray="6 5"')+TBF(245,y+26,title,15,on?C.ink:C.muted)+TF(245,y+47,on?sub:'absent',13,on?col:C.muted));
  out+=lvl(84,s.ho,'Higher-order state','“I am seeing red”',C.purple,C.purplep,'ho')+lvl(222,s.fo,'First-order state','vision registers red',C.blue,C.pale,'fo');
  out+=(s.ho?arrow(245,152,245,218,C.purple,2.6):L(245,152,245,218,C.line,1.6,'stroke-dasharray="4 5"'))+TF(254,190,'is about',13,s.ho?C.purple:C.muted,'start');
  out+=Ci(54,255,20,'#c8432b')+TF(54,294,'red light',13,C.muted)+(s.fo?arrow(76,255,116,255,C.blue,2.4):L(76,255,116,255,C.line,1.6,'stroke-dasharray="4 5"'));
  out+=R(392,84,184,204,'#fff',C.grid,8)+TF(484,106,'On the theory',13,C.muted)+TB(484,134,v[0],18,v[2])+K6_para(404,160,v[1],25);
  out+=TF(300,326,'The verdicts are the theory’s own; other theories read the same cases differently.',13,C.muted);
  return {svg:out,phase:s.fo&&s.ho?'Both states are present, so the seeing is conscious. Take away the higher-order state and, on this theory, the very same visual processing carries on unconsciously.':s.fo?'Only the first-order state: processing without awareness. Notice that the theory locates the difference between conscious and unconscious seeing outside the visual state itself.':s.ho?'Only the higher-order state. Ned Block (2011) argues this case breaks the theory: if the higher-order state is enough, the first-order state does no work; if it is not, the theory is wrong about what makes a state conscious.':'Neither state is present.'};
 }});

const K6_HA={mu:1,sd:1},K6_HB_SD=2,K6_HC=1.5;
// Evidence for the correct answer is normal(mu, sd). Correct when it is above 0; “seen” when it is beyond ±1.5.
const K6_hoStats=(mu,sd)=>({pc:K6_cdf(mu/sd),seen:1-K6_cdf((K6_HC-mu)/sd)+K6_cdf((-K6_HC-mu)/sd)});
SCENE({id:'higher-order-matched',name:'Same accuracy, different awareness',tag:'What it predicts: awareness can change while performance holds',
 definition:'If awareness depends on a higher-order state, it should be possible to change how often people say they saw something while leaving how well they do on the task untouched. Hakwan Lau and Richard Passingham (2006) found such a case: two mask timings gave equal accuracy at telling two shapes apart, but people said “seen” more often at one timing than the other. The difference went with activity in dorsolateral prefrontal cortex, not visual cortex.',
 example:'In the toy below, condition A has a weak signal and little noise. Condition B is noisier: raise its signal until accuracy matches A, and its “seen” rate is still about twice as high, because a fixed standard for “seen” is crossed more often when the evidence swings more widely. Against the prediction: the result rests on what people say, a later attempt to shift awareness by stimulating prefrontal cortex (Rounis et al. 2010) did not replicate (Bor et al. 2017), and prefrontal activity may reflect reporting.',
 desc:'Two bell curves of evidence, for a quiet condition A and a noisier condition B whose signal strength the learner sets, with each condition’s accuracy and rate of “seen” reports from a signal-detection sketch.',
 research:['Lau, H. C. & Passingham, R. E. (2006). Relative blindsight in normal observers and the neural correlate of visual consciousness. PNAS 103, 18763–18768.','Rounis, E. et al. (2010). Cognitive Neuroscience 1, 165–175; not replicated by Bor, D. et al. (2017). PLoS ONE 12, e0171793.','Status: the matched-performance design is widely used; its interpretation is contested. For d′ and criterion see Mind In Motion, signal detection.'],
 dur:12,hint:'Raise the signal in condition B until its accuracy matches condition A (84%). Then compare how often each condition says “seen”.',
 init:()=>({mu:1}),
 watch(p){return {mu:Math.round(lerp(.6,2,smooth(Math.min(1,p*1.5)))*10)/10}},
 ui:[{range:'mu',label:'Signal strength in condition B',min:0,max:4,step:.1,get:s=>s.mu,act:'mu',show:v=>Number(v).toFixed(1)}],
 on:{mu(s,v){s.mu=Number(v);return 'keep'}},
 draw(s){
  const A=K6_hoStats(K6_HA.mu,K6_HA.sd),B=K6_hoStats(s.mu,K6_HB_SD),X=v=>36+(v+6)/14*340,match=Math.abs(A.pc-B.pc)<.011;
  let out=heading('Match the accuracy, then compare the reports',26);
  const panel=(top,mu,sd,title,st)=>{const y0=top+82,f=v=>K6_pdf(v,mu,sd),sc=165;
   let o=TBF(36,top,title,13,C.ink,'start')+K6_area(f,-6,-K6_HC,X,y0,sc,C.blue,.28)+K6_area(f,K6_HC,8,X,y0,sc,C.blue,.28)+K6_area(f,-6,0,X,y0,sc,C.coral,.4);
   o+=L(36,y0,376,y0,C.line,2)+K6_curve(f,-6,8,X,y0,sc,C.ink,2.2)+L(X(0),y0-74,X(0),y0+4,C.muted,1.6);
   o+=L(X(K6_HC),y0-74,X(K6_HC),y0,C.blue,1.6,'stroke-dasharray="5 4"')+L(X(-K6_HC),y0-74,X(-K6_HC),y0,C.blue,1.6,'stroke-dasharray="5 4"');
   o+=counter(392,top+6,'correct',K6_pct(st.pc),C.ink,84)+counter(484,top+6,'says “seen”',K6_pct(st.seen),C.blue,92);return o};
  out+=panel(56,K6_HA.mu,K6_HA.sd,'A: weak signal, little noise (fixed)',A)+panel(176,s.mu,K6_HB_SD,'B: more noise; you set the signal',B);
  out+=TF(X(0),276,'0',13,C.muted)+TF(X(-3.4),276,'wrong',13,C.coral)+TF(X(4.6),276,'right, with strong evidence',13,C.blue);
  out+=TF(392,160,'red: errors · blue: “seen”',13,C.muted,'start');
  out+=match?TBF(300,306,`Matched at ${K6_pct(A.pc)} correct, yet “seen” on ${K6_pct(A.seen)} of trials in A and ${K6_pct(B.seen)} in B`,13,C.green):TF(300,306,`B is ${K6_pct(B.pc)} correct. Move its signal until it matches A’s ${K6_pct(A.pc)}.`,13,C.ink);
  out+=K6_toy(24,326,'Toy signal-detection sketch')+TF(250,341.5,'The published result is described in the text.',13,C.muted,'start');
  return {svg:out,phase:match?`Accuracy is now equal, ${K6_pct(A.pc)} in both, but B says “seen” on ${K6_pct(B.seen)} of trials and A on ${K6_pct(A.seen)}. Performance and reported awareness have come apart, as higher-order theories predict they can.`:B.pc<A.pc?`B is less accurate than A (${K6_pct(B.pc)} against ${K6_pct(A.pc)}) and yet already says “seen” on ${K6_pct(B.seen)} of trials. Raise the signal to match accuracy.`:`B is now more accurate than A. Lower the signal until both are at ${K6_pct(A.pc)}.`};
 }});

const K6_HOV=[['A thought with full concepts','The higher-order state is a thought that uses concepts of oneself and of seeing, like those needed to talk about one’s own mind.',3,1,
  'The cost: explicit tests of such concepts are usually passed only at about four years old (Wimmer & Perner 1983). If the theory needed them, infants and most animals would feel nothing, which few accept.'],
 ['A minimal, wordless thought','The higher-order state is a thought, but one needing only the barest concepts and no language. This is Rosenthal’s reply to the worry about infants and animals.',2,2,
  'The cost: it is hard to say what evidence would show that a newborn or a fish does or does not have such thoughts, so the theory becomes harder to test.'],
 ['An automatic reality check','No thought at all: an automatic mechanism judges whether sensory activity reflects the world now, as opposed to noise or imagination. This is Lau’s perceptual reality monitoring.',1,3,
  'The cost: critics ask why a check of this kind, which sounds like more unconscious processing, should make the difference between experience and none.']];
SCENE({id:'higher-order-against',name:'How much is too much?',tag:'What counts against it',
 definition:'Two objections press hardest. First, the theory seems to demand too much: if a conscious state needs a thought about one’s own mind, then infants and most animals, who show little sign of such thoughts, would not be conscious. Second, the empty higher-order state: Ned Block (2011) argues that if a higher-order state alone gives experience, the first-order state is idle, and the theory is no longer about what makes a state conscious.',
 example:'Defenders answer the first objection by asking less of the higher-order state. But the less it asks, the less clear it is why that state should bring experience with it. The theory still predicts that awareness can shift while performance holds; the dispute is over what the higher-order state has to be. The dial shows three versions and what critics say each one costs.',
 desc:'A dial with three versions of the higher-order requirement, from a full conceptual thought to an automatic check, each with a description, two bars summarising critics’ worries and the cost of that version.',
 research:['Block, N. (2011). The higher order approach to consciousness is defunct. Analysis 71, 419–431.','Lau, H. (2022). In Consciousness We Trust: The Cognitive Neuroscience of Subjective Experience. Oxford University Press.','Wimmer, H. & Perner, J. (1983). Cognition 13, 103–128. Status: an open philosophical dispute; the worry levels shown are a summary, not measurements.'],
 dur:12,hint:'Choose how demanding the higher-order state must be. Each answer to one objection makes the other sharper.',
 init:()=>({v:0}),
 watch(p){return {v:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:K6_HOV.map((h,i)=>[i,['Full concepts','Minimal thought','Automatic check'][i]]),label:'The higher-order state is',get:s=>s.v,act:'v'}],
 on:{v(s,v){s.v=Number(v);return 'keep'}},
 draw(s,f,X){
  const h=K6_HOV[s.v];let out=heading('What must the higher-order state be?',26);
  out+=L(100,58,500,58,C.line,3)+TF(100,88,'asks most',13,C.muted)+TF(500,88,'asks least',13,C.muted);
  K6_HOV.forEach((q,i)=>{const x=100+i*200;out+=hit(X,'v',i,q[0],Ci(x,58,i===s.v?13:9,i===s.v?C.purple:'#fff',C.purple))});
  out+=R(40,100,520,84,C.purplep,'none',8)+TBF(56,122,h[0],15,C.purple,'start')+K6_para(56,142,h[1],76);
  const pips=(y,label,lv,col)=>{let o=TF(56,y+15,label,13,C.ink,'start');for(let i=0;i<3;i++)o+=R(442+i*40,y,34,20,i<lv?col:'#fff',i<lv?col:C.line,5);return o};
  out+=pips(198,'Worry: it leaves out infants and most animals',h[2],C.coral)+pips(228,'Worry: it no longer explains why there is experience',h[3],C.amber);
  out+=K6_para(56,274,h[4],76,C.ink);
  out+=K6_toy(24,340,'Schematic summary of a debate, not measurements');
  return {svg:out,phase:s.v===0?'The demanding version is clear about what the higher-order state is, and pays for it: it seems to exclude creatures most people take to be conscious.':s.v===1?'Rosenthal’s reply widens the circle. Critics answer that the theory now turns on thoughts nobody knows how to detect.':'Lau’s version needs only a mechanism, which brains of many kinds might have. Critics say the price is that the link to experience is now asserted, not explained.'};
 }});

/* =========================== predictive-processing =========================== */
const K6_SIGNAL=2;
function K6_post(pm,ps,ss){const a=1/(ps*ps),b=1/(ss*ss);return {mean:(pm*a+K6_SIGNAL*b)/(a+b),sd:Math.sqrt(1/(a+b)),w:b/(a+b)}}
SCENE({id:'predictive-processing',name:'The brain’s best guess',tag:'The claim: perception is controlled prediction',
 definition:'Hermann von Helmholtz argued in the 1860s that perception is unconscious inference: the brain works out the likeliest cause of its sensory signals. Predictive processing makes this a design for the whole brain. Higher levels predict the activity of lower ones, and only the errors travel upward (Rao and Ballard 1999). Karl Friston’s free-energy principle generalises the idea, and Andy Clark (2013) and Anil Seth have drawn out what it means for experience: what you perceive is the brain’s best guess, which Seth calls a controlled hallucination.',
 example:'A faint light is really at +2, but you expected it at −2. With equal confidence in each, you see it at 0, halfway. Make the senses noisier and the percept slides towards the expectation. The view predicts that expectations shape what is experienced, and when. Against it: this is an account of how the brain works, and it becomes a theory of consciousness only with additions (scene 3).',
 desc:'Three bell curves on one axis for the prediction, the sensory signal and the resulting percept, with sliders for where the prediction is, how sure it is and how noisy the senses are.',
 research:['Helmholtz, H. von (1867). Handbuch der physiologischen Optik.','Rao, R. P. N. & Ballard, D. H. (1999). Predictive coding in the visual cortex. Nature Neuroscience 2, 79–87; Friston, K. (2010). The free-energy principle: a unified brain theory? Nature Reviews Neuroscience 11, 127–138.','Clark, A. (2013). Whatever next? Behavioral and Brain Sciences 36, 181–204; Seth, A. (2021). Being You. Faber. Status: an influential framework; the mathematics is covered in Mind In Motion (Bayesian perception, predictive processing).'],
 dur:12,hint:'Move the prediction, then change how sure it is and how noisy the senses are. The percept goes to whichever source is more reliable.',
 init:()=>({pm:-2,ps:1.5,ss:1.5}),
 watch(p){return {pm:-2,ps:1.5,ss:Math.round(lerp(.6,3,smooth(p))*10)/10}},
 ui:[{range:'pm',label:'Where the light is expected',min:-4,max:4,step:.5,get:s=>s.pm,act:'pm',show:v=>Number(v).toFixed(1)},{range:'ps',label:'Doubt about the prediction',min:.5,max:3,step:.1,get:s=>s.ps,act:'ps',show:v=>Number(v).toFixed(1)},{range:'ss',label:'Sensory noise',min:.5,max:3,step:.1,get:s=>s.ss,act:'ss',show:v=>Number(v).toFixed(1)}],
 on:{pm(s,v){s.pm=Number(v);return 'keep'},ps(s,v){s.ps=Number(v);return 'keep'},ss(s,v){s.ss=Number(v);return 'keep'}},
 draw(s){
  const po=K6_post(s.pm,s.ps,s.ss),X=v=>50+(v+6)/12*500,y0=252,sc=160/Math.max(K6_pdf(0,0,s.ps),K6_pdf(0,0,s.ss),K6_pdf(0,0,po.sd));let out=heading('What you see lies between prediction and signal');
  [[C.purple,'prediction',70,'stroke-dasharray="7 5"'],[C.amber,'sensory signal (at +2)',210,''],[C.blue,'percept',420,'']].forEach(([c,l,x,e])=>out+=L(x,56,x+26,56,c,3,e)+TF(x+32,60,l,13,c,'start'));
  out+=K6_area(v=>K6_pdf(v,po.mean,po.sd),-6,6,X,y0,sc,C.blue,.18)+L(50,y0,550,y0,C.line,2);
  for(let v=-6;v<=6;v+=2)out+=L(X(v),y0,X(v),y0+5,C.line,1.5)+TF(X(v),y0+19,v>0?'+'+v:v,13,C.muted);
  out+=K6_curve(v=>K6_pdf(v,s.pm,s.ps),-6,6,X,y0,sc,C.purple,2.4,'stroke-dasharray="7 5"')+K6_curve(v=>K6_pdf(v,K6_SIGNAL,s.ss),-6,6,X,y0,sc,C.amber,2.4)+K6_curve(v=>K6_pdf(v,po.mean,po.sd),-6,6,X,y0,sc,C.blue,3.2);
  out+=L(X(po.mean),y0-K6_pdf(po.mean,po.mean,po.sd)*sc,X(po.mean),y0,C.blue,1.6,'stroke-dasharray="3 4"');
  out+=counter(50,290,'percept at',(po.mean>0?'+':'')+po.mean.toFixed(2),C.blue,130)+counter(194,290,'weight on the signal',K6_pct(po.w),C.amber,160)+counter(368,290,'on the prediction',K6_pct(1-po.w),C.purple,150);
  out+=K6_toy(24,346,'Schematic');
  return {svg:out,phase:po.w>.7?`The senses are trusted (${K6_pct(po.w)}), so the light is seen close to where it is, at ${po.mean.toFixed(2)}.`:po.w<.3?`The senses are noisy, so the percept sits at ${po.mean.toFixed(2)}, near the expectation. On this view you are seeing mostly your own prediction.`:`Signal and prediction share the weight (${K6_pct(po.w)} to ${K6_pct(1-po.w)}), and the light is seen at ${po.mean.toFixed(2)}: not where it is, and not where it was expected.`};
 }});

const K6_TSD=.5;
// Probability that a tone is present, given evidence e (0 = typical silence, 1 = typical tone) and expectation p.
const K6_tonePost=(p,e)=>{const a=p*K6_pdf(e,1,K6_TSD),b=(1-p)*K6_pdf(e,0,K6_TSD);return a/(a+b)};
SCENE({id:'predictive-processing-hallucination',name:'Hearing what you expect',tag:'What it predicts: strong expectations make experience',
 definition:'If experience is the brain’s best guess, a strong enough expectation should produce a percept with almost no input to support it, and a matching expectation should bring a real stimulus into awareness sooner. Both have been reported. After a light had been repeatedly paired with a faint tone, people often reported hearing the tone when only the light came (Powers, Mathys and Corlett 2017). And stimuli people expect are detected at lower visibility and break into awareness faster (Melloni and colleagues 2011; Pinto and colleagues 2015).',
 example:'In the toy listener below the ear’s evidence is 0.1, about what silence gives. With a 50% expectation of a tone the listener is 17% sure and reports none. Raise the expectation to 90% and the same evidence gives 65%: a tone is “heard”. Against the prediction as support for a theory of consciousness: these studies show that expectation shapes what is reported, which most theories also allow.',
 desc:'Two bell curves for the evidence produced by silence and by a tone, with the current evidence marked, beside bars for the expectation and the resulting belief that a tone is present, both set by sliders.',
 research:['Powers, A. R., Mathys, C. & Corlett, P. R. (2017). Pavlovian conditioning–induced hallucinations result from overweighting of perceptual priors. Science 357, 596–600.','Melloni, L. et al. (2011). Journal of Neuroscience 31, 1386–1396; Pinto, Y. et al. (2015). Expectations accelerate entry of visual stimuli into awareness. Journal of Vision 15(8), 13.','Status: expectation effects on reports are well supported; the toy’s numbers are Bayes’ rule, not data.'],
 dur:12,hint:'Leave the evidence near 0 (silence) and raise the expectation. Find the point where the listener reports a tone that was never played.',
 init:()=>({p:.5,e:.1}),
 watch(p){return {p:Math.round(lerp(.2,.95,smooth(p))*20)/20,e:.1}},
 ui:[{range:'p',label:'Expectation of a tone',min:.05,max:.95,step:.05,get:s=>s.p,act:'p',show:v=>K6_pct(Number(v))},{range:'e',label:'Evidence from the ear',min:-.5,max:1.5,step:.1,get:s=>s.e,act:'e',show:v=>Number(v).toFixed(1)}],
 on:{p(s,v){s.p=Number(v);return 'keep'},e(s,v){s.e=Number(v);return 'keep'}},
 draw(s){
  const post=K6_tonePost(s.p,s.e),X=v=>40+(v+1.5)/4*310,y0=236,sc=104,hear=post>.5;let out=heading('The same evidence, a different expectation');
  out+=L(40,y0,350,y0,C.line,2)+K6_curve(v=>K6_pdf(v,0,K6_TSD),-1.5,2.5,X,y0,sc,C.muted,2.4)+K6_curve(v=>K6_pdf(v,1,K6_TSD),-1.5,2.5,X,y0,sc,C.amber,2.4);
  out+=TF(X(0),y0-K6_pdf(0,0,K6_TSD)*sc-8,'silence',13,C.muted)+TF(X(1),y0-K6_pdf(1,1,K6_TSD)*sc-8,'tone',13,C.amber);
  [[0,'0'],[1,'1']].forEach(([v,l])=>out+=L(X(v),y0,X(v),y0+5,C.line,1.5)+TF(X(v),y0+19,l,13,C.muted));
  out+=TF(195,y0+40,'evidence (0 = usual silence, 1 = usual tone)',13,C.muted);
  out+=L(X(s.e),72,X(s.e),y0,C.coral,2)+TBF(X(s.e),66,'this trial',13,C.coral);
  const base=236,bh=150,bar=(x,v,col,l1,l2)=>R(x-28,base-v*bh,56,v*bh,col,'none',4)+TBF(x,base-v*bh-7,K6_pct(v),14,C.ink)+TF(x,base+19,l1,13,C.ink)+TF(x,base+36,l2,13,C.ink);
  out+=L(396,base,576,base,C.line,2)+L(396,base-bh/2,576,base-bh/2,C.muted,1.4,'stroke-dasharray="5 4"')+TF(486,base-bh/2-6,'50%',13,C.muted);
  out+=bar(440,s.p,'#c9b8e6','expected','beforehand')+bar(532,post,hear?C.blue:'#9bb4c4','belief','after');
  out+=TBF(300,306,hear?(s.e<.5?'Reports a tone, on evidence that looks like silence':'Reports a tone'):(s.e>.5?'Reports no tone, on evidence that looks like one':'Reports no tone'),15,hear?C.blue:C.ink);
  out+=K6_toy(24,326,'Toy listener')+TF(140,341.5,'It reports a tone when its belief passes 50%.',13,C.muted,'start');
  return {svg:out,phase:`Expecting a tone ${K6_pct(s.p)} of the time and given evidence of ${s.e.toFixed(1)}, the listener ends up ${K6_pct(post)} sure a tone was there. ${hear&&s.e<.5?'The expectation has done what the ear did not: this is the sense in which a percept can be a prediction.':!hear&&s.e>.5?'Here a strong expectation of silence overrides fair evidence of a tone.':'Change the expectation and watch the belief move with the evidence held still.'}`};
 }});

const K6_PPV=[['Prediction alone','What it says','The brain predicts its input at every level and passes up only the errors. This describes perception, action and learning. It does not say which predictions are experienced.',
  'The gap','Prediction errors occur without awareness: the brain’s response to an odd tone survives in sleep and in some unresponsive patients (Bekinschtein et al. 2009; Strauss et al. 2015).'],
 ['Add a broadcast','What is conscious','The prediction that wins the competition and is made available across the whole brain (Whyte & Smith 2021, combining prediction with a global workspace).',
  'Open question','Then the broadcast is doing the explaining, and the objections to workspace theory apply here as well.'],
 ['Add the living body','What is conscious','Experience is rooted in predictions that regulate the body: heartbeat, breathing, chemistry. Emotion and the sense of self come first; seeing the world is built on top (Seth 2013, 2021).',
  'Open question','Why should regulating a body feel like anything? And the view ties experience to living things, which those who think a computer could be conscious dispute.']];
SCENE({id:'predictive-processing-against',name:'A framework in need of an extra step',tag:'What counts against it',
 definition:'Predictive processing was built to explain how brains perceive, act and learn, and it applies to unconscious processing as much as to conscious. Taken alone it does not say what separates the two. That is the strongest objection to treating it as a theory of consciousness: each version that does say what is conscious gets there by adding something, and the addition then carries the claim.',
 example:'Choose a version. Prediction alone leaves a gap. Add a global broadcast and you have a workspace theory in predictive dress. Add the living body, as Anil Seth does, and experience becomes tied to staying alive. The framework still predicts that expectation shapes experience; the question is what else is needed. Supporters see the flexibility as a strength, since one framework can host several theories.',
 desc:'A three-level hierarchy with predictions flowing down and errors flowing up, to which the learner adds either a brain-wide broadcast or a regulated body, with what each version says is conscious and the question it leaves open.',
 research:['Bekinschtein, T. A. et al. (2009). Neural signature of the conscious processing of auditory regularities. PNAS 106, 1672–1677; Strauss, M. et al. (2015). PNAS 112, E1353–E1362.','Whyte, C. J. & Smith, R. (2021). The predictive global neuronal workspace. Progress in Neurobiology 199, 101918.','Seth, A. K. (2013). Interoceptive inference, emotion, and the embodied self. Trends in Cognitive Sciences 17, 565–573. Status: predictive processing is a framework; each consciousness claim built on it is contested.'],
 dur:12,hint:'Start with prediction alone, then try each addition. Ask of each: which part is doing the work of explaining experience?',
 init:()=>({v:0}),
 watch(p){return {v:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:K6_PPV.map((q,i)=>[i,q[0]]),label:'Version',get:s=>s.v,act:'v'}],
 on:{v(s,v){s.v=Number(v);return 'keep'}},
 draw(s){
  const q=K6_PPV[s.v];let out=heading('Prediction explains perceiving. What explains experiencing?',26);
  if(s.v===1)out+=R(40,50,236,222,C.greenp,C.green,14,'stroke-dasharray="7 5"')+TBF(158,286,'broadcast brain-wide',13,C.green);
  ['Higher level','Middle level','Sensory level'].forEach((nm,i)=>{const y=62+i*70;out+=R(84,y,148,40,s.v===1&&i===0?C.pale:'#fff',C.blue,8)+TF(158,y+25,nm,14,C.ink);
   if(i<2)out+=arrow(118,y+42,118,y+68,C.blue,2.4)+arrow(198,y+68,198,y+42,C.coral,2.4)});
  out+=TF(110,121,'predictions',13,C.blue,'end')+TF(206,121,'errors',13,C.coral,'start');
  if(s.v===2)out+=R(84,290,148,40,C.coralp,C.coral,8)+TF(158,315,'the body’s state',14,C.ink)+arrow(118,244,118,288,C.blue,2.4)+arrow(198,288,198,244,C.coral,2.4);
  else out+=arrow(158,300,158,246,C.muted,2.2)+TF(158,318,'signals from the senses',13,C.muted);
  out+=R(300,50,276,290,'#fff',C.grid,8)+TB(438,76,q[0],16,C.ink)+TBF(314,102,q[1],13,C.blue,'start')+K6_para(314,121,q[2],39);
  const n1=K6_wrap(q[2],39).length,y2=121+n1*17+10;
  out+=TBF(314,y2,q[3],13,C.coral,'start')+K6_para(314,y2+19,q[4],39);
  out+=K6_toy(24,346,'Schematic');
  return {svg:out,phase:s.v===0?'With prediction alone there is nothing to mark some predictions as conscious and others not, and prediction errors are found in states where people report no experience.':s.v===1?'This version says a great deal about the content of experience, and borrows workspace theory’s answer to what makes it conscious.':'This version makes a bold claim that the others do not: that experience depends on being a living, self-regulating body. That is a prediction of sorts, though not yet one with an agreed test.'};
 }});

/* =========================== attention-schema =========================== */
const K6_OBJ=['apple','bell','breeze'];
SCENE({id:'attention-schema',name:'A sketch of attention',tag:'The claim: awareness is the brain’s model of its own attention',
 definition:'Michael Graziano’s attention schema theory begins with control. Attention is a real process: some signals in the brain are boosted and their rivals suppressed. To control anything well, a brain needs a model of it, as it keeps a body schema to control the limbs. So the brain keeps a simplified model of its own attention. That model describes attention not as competing signals but as an inner grasp of things, and when we say we are aware, the theory says, we are reading out the model.',
 example:'Attention settles on the apple. The schema records only “I am aware of the apple”. Ask the system how, and it has nothing to say about neurons, because the sketch leaves them out. The theory predicts that attention without awareness is possible but poorly controlled (scene 2). Against it: critics say it explains why we claim awareness, not awareness itself (scene 3).',
 desc:'On the left, three signals competing in the brain with one boosted; on the right, the brain’s simplified description of that process as awareness of one object, and its answer when asked how it is aware.',
 research:['Graziano, M. S. A. & Kastner, S. (2011). Human consciousness and its relationship to social neuroscience: a novel hypothesis. Cognitive Neuroscience 2, 98–113.','Graziano, M. S. A. (2013). Consciousness and the Social Brain. Oxford University Press.','Status: a minority theory with a clear mechanism; contested. The signal strengths shown are illustrative.'],
 dur:12,hint:'Move attention between the three things, then ask the system how it is aware. Compare what is happening with what it says.',
 init:()=>({o:0,ask:0}),
 watch(p){return {o:Math.min(2,Math.floor(p*2.4)),ask:p>.72?1:0}},
 ui:[{choose:K6_OBJ.map((o,i)=>[i,'The '+o]),label:'Attention is on',get:s=>s.o,act:'o'},{b:'Ask it how it is aware',act:'ask'}],
 on:{o(s,v){s.o=Number(v);return 'keep'},ask(s){s.ask=s.ask?0:1;return 'keep'}},
 draw(s){
  const ob=K6_OBJ[s.o];let out=heading('What attention is, and what the brain says about it',26);
  out+=R(24,48,270,246,'#fff',C.grid,8)+TBF(159,72,'Attention itself',15,C.ink)+TF(159,91,'signals competing in the brain',13,C.muted);
  K6_OBJ.forEach((o,i)=>{const y=112+i*56,on=i===s.o,v=on?9:[2,3,2][i];
   out+=TF(40,y+15,o,14,on?C.blue:C.ink,'start')+R(104,y,170,20,'#eef3f6','none',5)+R(104,y,170*v/10,20,on?C.blue:'#b7c6d0','none',5)+L(104+85,y-4,104+85,y+24,C.muted,1.4,'stroke-dasharray="3 3"');
   out+=TF(104,y+38,on?'boosted':'suppressed',13,on?C.blue:C.muted,'start')});
  out+=TF(159,284,'dashed line: strength with no attention',13,C.muted);
  out+=R(306,48,270,246,C.purplep,'none',8)+TBF(441,72,'The attention schema',15,C.purple)+TF(441,91,'the brain’s sketch of that process',13,C.muted);
  out+=Ci(352,150,24,'#fff',C.purple)+TF(352,155,'me',14,C.ink)+arrow(380,150,450,150,C.purple,3)+R(454,130,106,40,'#fff',C.purple,8)+TF(507,155,'the '+ob,14,C.ink);
  out+=TBF(441,206,`“I am aware of the ${ob}.”`,14,C.ink);
  out+=s.ask?TF(441,236,'“How?”',13,C.muted)+TBF(441,256,'“I just am. I grasp it directly.”',13,C.purple)+TF(441,278,'no neurons, no competition in the sketch',13,C.muted):TF(441,246,'no mention of signals or neurons',13,C.muted);
  out+=TF(300,318,'The sketch is simple: that makes it useful for control, and wrong in detail.',13,C.ink);
  out+=K6_toy(24,340,'Schematic');
  return {svg:out,phase:s.ask?'Asked how it is aware, the system can only consult its sketch, which contains no mechanism. So it reports a direct, inner awareness that is not a physical process. On the theory, that report is what needs explaining, and this is the explanation.':`The signal for the ${ob} is boosted and its rivals are held down. The schema compresses all of that into one simple claim: I am aware of the ${ob}.`};
 }});

// Toy control loop: a spotlight is pulled off its target by three distractors. With a model the controller knows where
// the spotlight is now; without one it only learns where it was 3 steps ago.
function K6_track(model,D){const k=.3,d=3,xs=[0];for(let t=0;t<120;t++){const pull=(t>=15&&t<25)||(t>=85&&t<95)?D*.15:(t>=50&&t<60)?-D*.15:0,known=model?xs[t]:xs[Math.max(0,t-d)];xs.push(xs[t]+pull-k*known)}
 return {xs,err:sum(xs.map(Math.abs))/xs.length}}
SCENE({id:'attention-schema-control',name:'Steering with and without a map',tag:'What it predicts: awareness helps control attention',
 definition:'If awareness is the brain’s model of attention, its job is control. Engineers know that a controller with a model of what it steers can act on where the thing is now; one without a model can only react to old news. So the theory predicts that attention can still be drawn to something you are not aware of, but will be held and released less well. Webb, Kean and Graziano (2016) reported this pattern: a cue people did not notice still pulled their attention, and that attention was less stable.',
 example:'In the toy, three distractors tug a spotlight off its target. With a model, the controller corrects at once and the spotlight stays close. Without one, it learns where the spotlight was three steps late, so it overshoots and swings. Against the prediction: few studies have tested it, and other theories also expect unaware attention to behave differently.',
 desc:'A graph of a spotlight’s distance from its target over time while three distractors pull it away, with and without an internal model in the controller, and the average distance for each.',
 research:['Webb, T. W., Kean, H. H. & Graziano, M. S. A. (2016). Effects of awareness on the control of attention. Journal of Cognitive Neuroscience 28, 842–851.','Webb, T. W. & Graziano, M. S. A. (2015). The attention schema theory: a mechanistic account of subjective awareness. Frontiers in Psychology 6, 500.','Status: a small literature, mostly from one laboratory; treat as preliminary. The control loop is a toy.'],
 dur:12,hint:'Switch the model off and on, and make the distractors stronger. Compare the average distance from the target in the two cases.',
 init:()=>({m:1,D:6}),
 watch(p){return {m:p<.5?1:0,D:6}},
 ui:[{choose:[[1,'With a model'],[0,'Without a model']],label:'Controller',get:s=>s.m,act:'m'},{range:'D',label:'Distractor strength',min:1,max:10,step:1,get:s=>s.D,act:'D'}],
 on:{m(s,v){s.m=Number(v);return 'keep'},D(s,v){s.D=Number(v);return 'keep'}},
 draw(s){
  const a=K6_track(s.m,s.D),b=K6_track(1-s.m,s.D),x0=56,y0=60,w=500,h=190,X=t=>x0+t/120*w,Y=v=>y0+h/2-clamp(v,-9,9)/9*h/2;
  let out=heading('Three tugs on the spotlight');
  [[15,25],[50,60],[85,95]].forEach(([p,q])=>out+=R(X(p),y0,X(q)-X(p),h,C.amberp,'none',0)+TF((X(p)+X(q))/2,y0+h+16,'distractor',13,C.amber));
  out+=L(x0,y0,x0,y0+h,C.line,2)+L(x0,Y(0),x0+w,Y(0),C.green,2,'stroke-dasharray="6 4"')+TF(x0+8,Y(0)-7,'target',13,C.green,'start')+TF(x0-6,y0+10,'off',13,C.muted,'end')+TF(x0-6,y0+h,'off',13,C.muted,'end');
  out+=K6_poly(b.xs.map((v,t)=>[X(t),Y(v)]),'#b7c6d0',2)+K6_poly(a.xs.map((v,t)=>[X(t),Y(v)]),s.m?C.blue:C.coral,3);
  out+=TF(x0+w/2,y0+h+34,'time →',13,C.muted);
  out+=counter(56,292,s.m?'with a model (shown)':'without a model (shown)',a.err.toFixed(2),s.m?C.blue:C.coral,200)+counter(270,292,s.m?'without a model (grey)':'with a model (grey)',b.err.toFixed(2),C.muted,200);
  out+=TF(484,311,'average distance',13,C.muted,'start')+TF(484,328,'from the target',13,C.muted,'start');
  out+=K6_toy(24,346,'Toy control loop, not a model of the brain');
  const wm=s.m?a.err:b.err,wo=s.m?b.err:a.err;
  return {svg:out,phase:s.m?`With a model the spotlight is pulled away but is steadied at once: average distance ${wm.toFixed(2)}, against ${wo.toFixed(2)} without the model.`:`Without a model the controller is always three steps behind, so the spotlight overshoots and swings back: average distance ${wo.toFixed(2)}, ${(wo/wm).toFixed(1)} times the ${wm.toFixed(2)} achieved with a model. Attention still works; it is just badly steered.`};
 }});

const K6_ASV=[['Nothing is left','You are with Graziano, and close to the illusionists met in era 8. Once the brain’s claim to awareness is explained, there is no further fact. The best objection: the seeming is itself an experience, so it has been renamed, not explained away.'],
 ['Something is left','You are with the theory’s critics. David Chalmers calls explaining our reports the meta-problem and holds that the hard problem remains after it. The best objection: if every word we say about experience is explained without the extra something, what is the evidence for it?'],
 ['Not sure','A defensible place to stand: the field is divided on exactly this. What the two sides agree on is that explaining why we say we are conscious is real progress whichever of them is right.']];
SCENE({id:'attention-schema-against',name:'Explaining the claim or the thing?',tag:'What counts against it',
 definition:'The main objection is that attention schema theory explains why a brain says it is aware, and why it finds awareness mysterious, but not why there is any experience at all. Graziano accepts the description and rejects the criticism: on his view the belief in an inner experience beyond the model is exactly what the model produces, so there is nothing further to explain. Critics answer that this changes the subject.',
 example:'The theory does predict things that can be checked: that attention and awareness can come apart, and that control suffers when they do. But the dispute here is not about data. It turns on whether explaining the report is enough, and on that the learner’s judgement is as good as anyone’s. Choose an answer to see whose company it puts you in and the best objection to it.',
 desc:'Two lists, what the theory explains and what is disputed, above three possible answers to whether anything is left once the claim to awareness is explained, each with the view it matches and the best objection.',
 research:['Graziano, M. S. A. (2013). Consciousness and the Social Brain. Oxford University Press.','Chalmers, D. J. (2018). The meta-problem of consciousness. Journal of Consciousness Studies 25(9–10), 6–61.','Status: a philosophical disagreement with no agreed answer; see illusionism in era 8.'],
 dur:12,hint:'There is no right answer here. Pick the one closest to your view and read the objection to it. Your choice stays on this page.',
 init:()=>({v:-1}),
 watch(p){return {v:Math.min(2,Math.floor(p*3.6)-1),sim:true}},
 ui:[{choose:K6_ASV.map((q,i)=>[i,q[0]]),label:'Once the claim is explained',get:s=>s.v,act:'v'}],
 on:{v(s,v){s.v=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('If the saying is explained, is the feeling?',26);
  out+=R(24,46,270,150,C.greenp,'none',8)+TBF(40,70,'The theory explains',14,C.green,'start');
  ['why we say we are aware','why awareness seems non-physical','how attention is kept under control'].forEach((l,i)=>out+=TBF(42,98+i*28,'✓',14,C.green,'start')+TF(62,98+i*28,l,13,C.ink,'start'));
  out+=R(306,46,270,150,C.amberp,'none',8)+TBF(322,70,'Disputed',14,C.amber,'start')+K6_para(322,98,'whether anything remains once the saying is explained: why being aware feels like something at all',36);
  K6_ASV.forEach((q,i)=>{const x=24+i*188;out+=hit(X,'v',i,q[0],R(x,208,176,36,i===s.v?C.purple:'#fff',C.purple,8)+TBF(x+88,231,q[0],14,i===s.v?'#fff':C.purple))});
  out+=s.v<0?TF(300,290,'Choose the answer closest to your own view.',13,C.muted)+TF(300,310,'There is no agreed answer; philosophers divide on it.',13,C.muted):K6_para(40,270,K6_ASV[s.v][1],80);
  if(s.sim&&s.v>=0)out+=TF(300,364,'Simulated learner (Watch)',13,C.muted);
  return {svg:out,phase:s.v<0?'The theory’s strength and its weakness are the same feature: it explains the claim to awareness, and says the claim is all there is.':s.v===0?'On this answer the theory is complete in principle. Notice the objection is not about evidence: it is about what counts as explaining experience.':s.v===1?'On this answer the theory is true as far as it goes and stops short. Notice that the objection asks what evidence the extra something could ever leave.':'Holding the question open is a position many researchers take.'};
 }});

/* =========================== adversarial-collaboration =========================== */
// Schematic predicted time courses for a picture shown from 0 to d seconds.
const K6_iitTrace=(t,d)=>K6_sig(t,.12,.03)*(1-K6_sig(t,d+.12,.03));
const K6_gnwTrace=(t,d)=>clamp(K6_bump(t,.3,.07)+K6_bump(t,d+.3,.07)+.06*K6_sig(t,.2,.03)*(1-K6_sig(t,d+.2,.03)),0,1);
SCENE({id:'adversarial-collaboration',name:'Rivals design the test together',tag:'An experiment both sides agreed could hurt them',
 definition:'Theories of consciousness have mostly been tested by their own supporters, on experiments chosen to suit them. In an adversarial collaboration, a term from Daniel Kahneman, rivals agree in advance on an experiment and on what result would count against each of them. The Cogitate consortium, led by Lucia Melloni, Liad Mudrik and Michael Pitts, did this for global neuronal workspace theory (GNWT) and integrated information theory (IIT), with the experiments run by laboratories committed to neither.',
 example:'One test varied how long a clearly visible picture stayed on screen: 0.5, 1 or 1.5 seconds. IIT predicts that activity at the back of the cortex lasts exactly as long as the experience. GNWT predicts a burst of prefrontal activity when the picture enters consciousness and another when it leaves, with little in between. Different durations pull the two predictions apart. What counts against each is what the test then found (next scene).',
 desc:'A bar showing how long a picture is on screen, above two schematic predicted time courses: sustained activity at the back of the cortex for IIT, and prefrontal bursts at onset and offset for GNWT.',
 research:['Melloni, L., Mudrik, L., Pitts, M. & Koch, C. (2021). Making the hard problem of consciousness easier. Science 372, 911–912.','Mellers, B., Hertwig, R. & Kahneman, D. (2001). Do frequency representations eliminate conjunction effects? An exercise in adversarial collaboration. Psychological Science 12, 269–275.','Status: the method is widely welcomed; these curves are the agreed predictions drawn schematically, not results.'],
 dur:12,hint:'Change how long the picture is shown and watch the two predictions change in different ways. A good test is one where rival predictions differ.',
 init:()=>({d:1}),
 watch(p){return {d:[.5,1,1.5][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[[.5,'0.5 s'],[1,'1 s'],[1.5,'1.5 s']],label:'Picture shown for',get:s=>s.d,act:'d'}],
 on:{d(s,v){s.d=Number(v);return 'keep'}},
 draw(s){
  const X=t=>70+(t+.2)/2.6*480,d=s.d;let out=heading('One design, two different predictions');
  out+=R(X(0),48,X(d)-X(0),16,C.dark,'none',4)+TF(X(d)+8,61,`picture on screen: ${d} s`,13,C.ink,'start');
  const panel=(y0,f,col,title)=>{const pts=[];for(let i=0;i<=260;i++){const t=-.2+i/100;pts.push([X(t),y0-f(t,d)*58])}
   return TBF(70,y0-70,title,13,col,'start')+L(70,y0,550,y0,C.line,2)+K6_poly(pts,col,3)};
  [X(0),X(d)].forEach(x=>out+=L(x,66,x,90,C.muted,1.2,'stroke-dasharray="3 4"')+L(x,108,x,202,C.muted,1.2,'stroke-dasharray="3 4"')+L(x,222,x,296,C.muted,1.2,'stroke-dasharray="3 4"'));
  out+=panel(170,K6_iitTrace,C.purple,'IIT: the back of the cortex stays active while the picture lasts');
  out+=panel(284,K6_gnwTrace,C.blue,'GNWT: a prefrontal burst at the start, and again at the end');
  [0,.5,1,1.5,2].forEach(t=>out+=L(X(t),296,X(t),301,C.line,1.5)+TF(X(t),316,t+' s',13,C.muted));
  out+=K6_toy(24,340,'Predictions, drawn schematically');
  return {svg:out,phase:`With the picture shown for ${d} s, IIT expects about ${d} s of sustained activity at the back, and GNWT expects two brief prefrontal bursts ${d} s apart. Lengthen the picture and one prediction stretches while the other only moves its second burst.`};
 }});

const K6_PRED=[['IIT','Activity at the back of the cortex lasts','as long as the picture does','found','Largely found, in parts of visual cortex.','activity at the back lasts as long as the picture'],
 ['IIT','Areas at the back stay synchronised','for as long as the picture lasts','not','Not found: synchrony was brief, not sustained.','areas at the back stay synchronised throughout'],
 ['GNWT','A burst of prefrontal activity when','the picture disappears','not','Not found, though the burst at onset was.','a prefrontal burst when the picture goes off'],
 ['GNWT','Prefrontal activity carries what is','seen, in all its aspects','partly','Partly: its category, but not its orientation.','prefrontal activity carries all that is seen']];
const K6_RES={found:['Found',C.green,C.greenp],partly:['Partly',C.amber,C.amberp],not:['Not found',C.coral,C.coralp]};
SCENE({id:'adversarial-collaboration-predictions',name:'Mark your card first',tag:'You take part: predict, then see the results',
 definition:'The first Cogitate experiment recorded brain activity in more than 250 people with three methods (fMRI, MEG and electrodes placed in the brain for medical reasons) while they looked at clearly visible faces, objects, letters and meaningless symbols. Each theory’s supporters had signed up to specific predictions. Four of them are listed here. Before looking at the results, mark what you expect.',
 example:'The first results were presented in 2023. Each theory had predictions that held and at least one that failed: IIT’s sustained synchrony within the back of the cortex was not found, and GNWT’s burst of prefrontal activity when the picture went off was not found. These are predictions and what counted against them, both at once. Neither theory was confirmed, and neither was refuted.',
 desc:'Four predictions, two from each theory, each with three choices (found, partly, not found) that the learner marks before pressing a button to reveal what the experiment reported.',
 research:['Cogitate Consortium et al. (2025). Adversarial testing of global neuronal workspace and integrated information theories of consciousness. Nature (first presented and posted as a preprint in 2023).','Melloni, L. et al. (2021). Science 372, 911–912.','Status: results from one large preregistered study; contested in interpretation. Saying either theory was proved or refuted overstates them.'],
 dur:14,hint:'Mark each prediction as found, partly found or not found, then press Show the results. Guessing wrong is no failure: the theories’ own supporters expected all four. Your marks stay on this page.',
 init:()=>({g:[null,null,null,null],shown:0}),
 watch(p){const k=Math.floor(p*6.5),sim=['found','found','not','found'];return {g:sim.map((v,i)=>i<k?v:null),shown:k>=5?1:0,sim:true}},
 ui:[{b:'Show the results',act:'show'},{b:'Start again',act:'again'}],
 on:{mark(s,v){const [i,k]=String(v).split(':');if(!s.shown)s.g[Number(i)]=k;return 'keep'},show(s){s.shown=1;return 'keep'},again(s){s.g=[null,null,null,null];s.shown=0;return 'keep'}},
 draw(s,f,X){
  let out=heading(s.shown?'What the experiment reported':'What do you expect the experiment found?',26);
  K6_PRED.forEach((q,i)=>{const y=42+i*64;out+=R(24,y,552,56,'#fff',C.grid,8)+R(32,y+15,52,26,q[0]==='IIT'?C.purplep:C.pale,'none',13)+TBF(58,y+33,q[0],13,q[0]==='IIT'?C.purple:C.blue);
   if(s.shown){const r=K6_RES[q[3]],ok=s.g[i]===q[3];out+=TF(94,y+24,q[5],13,C.ink,'start')+TF(94,y+42,q[4],13,r[1],'start')+R(476,y+6,92,24,r[1],'none',12)+TBF(522,y+23,r[0],13,'#fff')+TF(522,y+47,s.g[i]?(ok?'as you marked':'you: '+K6_RES[s.g[i]][0].toLowerCase()):'not marked',13,C.muted);return}
   out+=TF(94,y+24,q[1],13,C.ink,'start')+TF(94,y+42,q[2],13,C.ink,'start');
   [['found',356,60],['partly',420,60],['not',484,84]].forEach(([k,x,w])=>{const r=K6_RES[k],mine=s.g[i]===k;
    out+=hit(X,'mark',i+':'+k,`${q[0]} prediction ${i+1}: mark as ${r[0]}`,R(x,y+14,w,28,mine?r[2]:'#fff',mine?C.ink:C.line,14)+TBF(x+w/2,y+33,r[0],13,mine?C.ink:C.muted))})});
  const marked=s.g.filter(Boolean).length,right=s.g.filter((g,i)=>g===K6_PRED[i][3]).length;
  if(s.shown)out+=TBF(300,318,s.sim?`Simulated learner (Watch): ${right} of 4 called correctly`:marked?`You called ${right} of the ${marked} you marked.`:'You marked none, so there is nothing to score.',14,C.ink)+TF(300,342,'Each theory’s supporters had expected their own two to be found.',13,C.muted);
  else out+=TF(300,322,`${marked} of 4 marked${s.sim?' · simulated learner (Watch)':''}`,13,C.muted)+TF(300,344,'Mark all four before you look. That is what the theories had to do.',13,C.ink);
  return {svg:out,phase:s.shown?'IIT: posterior activity tracked how long the picture lasted, but the sustained synchrony it predicted was missing. GNWT: prefrontal cortex carried the category of the picture but not, for example, its orientation, and showed no burst when the picture went off. Each theory was challenged on a point it had agreed to.':'Fixing predictions before the data arrive is what makes a result informative. Afterwards, almost any outcome can be explained.'};
 }});

const K6_HEAD=[['“Workspace theory refuted”','Overstated. One agreed prediction failed (the burst at offset) and one was met only in part, while others held. A failed prediction calls for the theory to be revised or its claim narrowed; it does not show there is no workspace.'],
 ['“Integrated information refuted”','Overstated. The sustained synchrony it predicted was missing, but its prediction about duration largely held. The “pseudoscience” letter of 2023 was a separate argument, about whether the theory’s core claims can be tested at all.'],
 ['“Integrated information wins”','Overstated. It failed a prediction its own supporters had signed, and the test covered only some of what either theory claims. Passing more of a short list is not confirmation.'],
 ['“Both challenged, neither settled”','This is close to the consortium’s own summary: the results fit some predictions of each theory and substantially challenge key claims of both. Less exciting, and more accurate.']];
SCENE({id:'adversarial-collaboration-headlines',name:'What the results do and do not show',tag:'Neither confirmed, neither refuted',
 definition:'When the results came out, each side could point to a success and each had to explain a failure. Supporters of both theories argued that the prediction that failed was not central to their view; others replied that agreeing predictions in advance was meant to rule out exactly that move. What can be said safely is narrower than most headlines: on the tests that were run, neither theory was fully confirmed and neither was refuted.',
 example:'Four headlines of the kind that appeared follow. Pick the one you think is fair, then read why the others overreach. Both theories still predict what they did, less the failed predictions if their supporters accept them; what counts against each is now on record, agreed beforehand. More collaborations of this kind, on other theories, are under way.',
 desc:'A scoreboard of four predictions and their results above four possible headlines; choosing a headline shows whether it is fair and why.',
 research:['Cogitate Consortium et al. (2025). Adversarial testing of global neuronal workspace and integrated information theories of consciousness. Nature.','IIT-Concerned et al. (2023). The integrated information theory of consciousness as pseudoscience. PsyArXiv.','Status: any statement that the 2023 tests proved or refuted a theory is overstated.'],
 dur:12,hint:'Choose the headline you think the results support. The explanations say what each one gets right and wrong.',
 init:()=>({v:-1}),
 watch(p){return {v:Math.min(3,Math.floor(p*4.6)-1)}},
 ui:[{choose:[[0,'Workspace refuted'],[1,'IIT refuted'],[2,'IIT wins'],[3,'Both challenged']],label:'Headline',get:s=>s.v,act:'v'}],
 on:{v(s,v){s.v=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Four headlines, one fair',26);
  K6_PRED.forEach((q,i)=>{const y=40+i*29,r=K6_RES[q[3]];out+=R(24,y,552,25,'#fff',C.grid,6)+TBF(36,y+17.5,q[0],13,q[0]==='IIT'?C.purple:C.blue,'start')+TF(84,y+17.5,q[5],13,C.ink,'start')+R(478,y+2.5,90,20,r[2],'none',10)+TBF(523,y+17,r[0],13,r[1])});
  K6_HEAD.forEach((h,i)=>{const x=24+(i%2)*280,y=164+Math.floor(i/2)*46,on=i===s.v;out+=hit(X,'v',i,'Headline: '+h[0],R(x,y,272,38,on?C.dark:'#fff',C.dark,6)+TBF(x+136,y+24,h[0],13,on?'#fff':C.ink))});
  out+=s.v<0?TF(300,300,'Which headline would you run? Press one.',13,C.muted):K6_para(32,280,K6_HEAD[s.v][1],82,s.v===3?C.green:C.ink);
  return {svg:out,phase:s.v<0?'Each theory had one prediction that failed outright. The question is what that licenses anyone to say.':s.v===3?'The fair headline is the dull one. A single study, however large, moves the balance of evidence; it rarely ends a theory.':'This headline says more than the results support. Look at the scoreboard: the theory in question both passed and failed.'};
 }});

const K6_TL=[['1998','A bet in Bremen','At a conference in Bremen, the neuroscientist Christof Koch bets the philosopher David Chalmers a case of wine that the neural correlates of consciousness will be found within 25 years.'],
 ['2019','Rivals sign up','The Templeton World Charity Foundation funds experiments designed jointly by supporters of rival theories. The Cogitate consortium takes on global neuronal workspace theory and IIT.'],
 ['2021','The plan in print','Lucia Melloni, Liad Mudrik, Michael Pitts and Christof Koch describe the approach in Science: predictions fixed in advance, and experiments run by laboratories with no stake in the outcome.'],
 ['Jun 2023','First results','The results are presented in New York. Each theory passes some tests and fails one it had agreed to. At the same meeting Koch concedes the bet and hands Chalmers the wine.'],
 ['Sep 2023','The letter','An open letter signed by over 100 researchers calls IIT pseudoscience. Others, including some of its critics, reply that the label is unjustified and harms the field.'],
 ['2025','Peer review','The full results appear in Nature. Some predictions of each theory held, and key claims of both were challenged. The debate over what follows continues.']];
SCENE({id:'adversarial-collaboration-bet',name:'Twenty-five years and a case of wine',tag:'How the story has gone so far',
 definition:'In 1998 Christof Koch bet David Chalmers that within 25 years science would have found the neural correlates of consciousness: the brain activity that goes with experience. In 2023 the two agreed that it had not, and Koch paid up. The adversarial collaboration reported that same summer. Its lasting contribution may be the method more than the verdict: rivals stating beforehand what would count against them.',
 example:'Step through the events. Then set your own confidence that an agreed theory will exist 25 years from now. No theory in this era is established; each still makes its predictions, and each has findings that count against it. There is no right setting for the slider, and the people best placed to know have been wrong before.',
 desc:'A timeline of six events from the 1998 bet to the 2025 publication, with a description of the selected event, and a slider for the learner’s own confidence that the question will be settled in 25 years.',
 research:['Melloni, L., Mudrik, L., Pitts, M. & Koch, C. (2021). Making the hard problem of consciousness easier. Science 372, 911–912.','Cogitate Consortium et al. (2025). Nature. IIT-Concerned et al. (2023). PsyArXiv.','Status: the dates are a matter of record; what the episode shows about the field is a matter of opinion.'],
 dur:15,hint:'Press Next or a dot to move through the events. Then set your own confidence; it is not scored and stays on this page.',
 init:()=>({i:0,c:50}),
 watch(p){return {i:Math.min(5,Math.floor(p*6)),c:50}},
 ui:[{b:'Next event',act:'next'},{b:'Previous',act:'prev'},{range:'c',label:'My confidence in an agreed theory within 25 years',min:0,max:100,step:5,get:s=>s.c,act:'c',show:v=>v+'%'}],
 on:{next(s){s.i=(s.i+1)%K6_TL.length;return 'keep'},prev(s){s.i=(s.i+K6_TL.length-1)%K6_TL.length;return 'keep'},go(s,v){s.i=Number(v);return 'keep'},c(s,v){s.c=Number(v);return 'keep'}},
 draw(s,f,X){
  const e=K6_TL[s.i];let out=heading('From a bet to a test');
  out+=L(56,96,544,96,C.line,3);
  K6_TL.forEach((q,i)=>{const x=64+i*94.4,on=i===s.i;out+=hit(X,'go',i,q[0]+': '+q[1],Ci(x,96,on?12:8,on?C.coral:i<s.i?C.blue:'#fff',on?C.coral:C.blue))+TF(x,72,q[0],13,on?C.coral:C.muted,'middle',on?'font-weight="700"':'')});
  out+=R(40,120,520,112,'#fff',C.grid,8)+TBF(56,144,`${e[0]} · ${e[1]}`,15,C.coral,'start')+K6_para(56,166,e[2],76);
  out+=TF(40,262,'Your confidence that a theory of consciousness is agreed 25 years from now',13,C.ink,'start');
  out+=R(40,274,440,20,'#eef3f6','none',10)+R(40,274,440*s.c/100,20,C.purple,'none',10)+TBF(492,290,s.c+'%',15,C.purple,'start');
  out+=TF(40,318,'In 1998 Koch was confident enough to stake a case of wine. He lost.',13,C.muted,'start');
  out+=TF(40,338,'Chalmers bet the other way and won. Neither knows how the next 25 years will go.',13,C.muted,'start');
  return {svg:out,phase:`${e[0]}: ${e[1].toLowerCase()}. ${s.i===3?'Note what was conceded: not that consciousness cannot be explained, only that it had not been explained yet.':s.i===5?'Peer-reviewed publication did not change the outline of the results first presented in 2023.':s.i===4?'The letter and the replies to it were about how science should treat an unusual theory, more than about any one result.':'Move on to see what happened next.'}`};
 }});
