/* ===================== Levin Lab In Motion · Era 7 · Basal cognition ===================== */
// Sensing, memory and choice without brains; the lab's frameworks (TAME, the cognitive light cone, navigating
// morphospace); memory in models of gene networks; and the published argument over whether any of this is cognition.
// Every picture is a pure function of state, frame and X. Every number on screen is computed here by a toy model
// (a run-and-tumble walker, a Stentor response ladder, a Physarum tube network, a set-point loop, coupled cells,
// a walker in a toy shape space, a small gene network). The only literals are published values (years, the count of
// networks in a paper), each with a research line. Frameworks are labelled as frameworks, debates as debates.

/* ---- shared helpers ---- */
const L7_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const L7_rng=n=>rng(L7_mix(n));
const L7_note=(s,y=368)=>TF(300,y,s,13,C.muted);
const L7_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const L7_n=(v,d=0)=>{const r=Math.round(v*Math.pow(10,d))/Math.pow(10,d);return (r<0?'−':'')+Math.abs(r).toFixed(d)};
const L7_pct=v=>Math.round(v*100)+'%';
function L7_tile(x,y,w,label,value,col=C.blue){return R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,15,col)}
// Lines of fixed-size text from (x,y), one array entry per line.
function L7_lines(x,y,lines,size=13,col=C.ink,anchor='start',lh=17){return lines.map((s,i)=>TF(x,y+i*lh,s,size,col,anchor)).join('')}
// The six evidence labels, each with its own colour pair. The badge is drawn beside the claim it applies to.
const L7_LABELS={rep:['Replicated finding',C.green,C.greenp],single:['Single-lab finding',C.blue,C.pale],frame:['Framework or hypothesis',C.purple,C.purplep],
 spec:['Speculation',C.amber,C.amberp],debate:['Criticism and debate',C.coral,C.coralp],model:['Simplified model',C.dark,'#eef2f4']};
const L7_badgeW=k=>Math.round(L7_LABELS[k][0].length*7.1+18);
function L7_badge(x,y,k,anchor='start'){const [lab,ink,fill]=L7_LABELS[k],w=L7_badgeW(k),x0=anchor==='end'?x-w:anchor==='middle'?x-w/2:x;
 return R(x0,y,w,20,fill,ink,10,k==='model'?'stroke-dasharray="4 3" stroke-width="1.4"':'stroke-width="1.4"')+TBF(x0+w/2,y+14.5,lab,12.5,ink)}
// Several badges in a row from x, left to right (or right to left with anchor 'end').
function L7_badges(x,y,keys,anchor='start'){let out='',cx=x;for(const k of keys){out+=L7_badge(cx,y,k,anchor);cx+=(anchor==='end'?-1:1)*(L7_badgeW(k)+8)}return out}
// A tap-to-read card: title lines, a source line and a coloured label.
function L7_card(X,act,i,x,y,w,h,lines,who,lab,on,aria){
 const [t,ink,fill]=L7_LABELS[lab];
 let inner=R(x,y,w,h,on?fill:'#fff',on?ink:C.grid,8)+L7_lines(x+10,y+19,lines,13,C.ink,'start',16)+TF(x+10,y+h-9,who,12.5,C.muted,'start');
 return hit(X,act,i,aria||lines.join(' '),inner);
}

/* ===================== Lesson: basal-cognition ===================== */
// Scene 1: run and tumble. A toy bacterium in a 2D dish moves at constant speed; at each step it may tumble to a new random
// heading. With memory, it compares the log concentration now with a running average of the last few steps and
// tumbles less while things improve. With no memory it cannot tell up-gradient from down-gradient.
const L7_CH={W:120,H:70,sx:100,sy:35,steps:240,p0:.3,gain:7,v:1.4};
const L7_conc=(x,y)=>1/(1+((x-L7_CH.sx)**2+(y-L7_CH.sy)**2)/900);
function L7_walk(mem,seed){
 const r=L7_rng(seed),pts=[];let x=14,y=35,th=r()*2*Math.PI,m=Math.log(L7_conc(x,y)),tumbles=0;
 pts.push([x,y]);
 for(let t=0;t<L7_CH.steps;t++){
  const c=Math.log(L7_conc(x,y)),sgn=mem>1?c-m:0;
  m+= (c-m)/Math.max(1,mem);
  const p=clamp(L7_CH.p0*Math.exp(-L7_CH.gain*sgn*10),.03,.9);
  if(r()<p){th=r()*2*Math.PI;tumbles++}
  x+=L7_CH.v*Math.cos(th);y+=L7_CH.v*Math.sin(th);
  if(x<1){x=1;th=Math.PI-th}if(x>L7_CH.W-1){x=L7_CH.W-1;th=Math.PI-th}
  if(y<1){y=1;th=-th}if(y>L7_CH.H-1){y=L7_CH.H-1;th=-th}
  pts.push([x,y]);
 }
 return {pts,tumbles};
}
const L7_dist=p=>Math.hypot(p[0]-L7_CH.sx,p[1]-L7_CH.sy);
// Summary over a seeded population: mean distance from the source over the second half of each run.
const L7_POPN=24;
function L7_popStats(mem,n=L7_POPN,seed0=500){let tot=0;const ends=[];
 for(let i=0;i<n;i++){const w=L7_walk(mem,seed0+i),half=w.pts.slice(L7_CH.steps/2);tot+=half.reduce((a,p)=>a+L7_dist(p),0)/half.length;ends.push(w.pts[w.pts.length-1])}
 return {mean:tot/n,ends}}
const L7_MEMS=[1,3,6,12];
SCENE({id:'basal-cognition',name:'A bacterium with a few seconds of memory',tag:'Replicated finding · Bacterial chemotaxis as sensing and memory',
 definition:'Basal cognition is the study of sensing, memory, learning and decision-making in living things without brains, or below the level of the brain. A classic case is bacterial chemotaxis. A swimming bacterium such as E. coli runs in a straight line, then tumbles and sets off in a random new direction. It is too small to compare the two ends of its body, so it compares the present with the recent past: if the attractant is rising, it tumbles less often. Macnab and Koshland showed in 1972 that cells respond to a change in concentration over time, which needs a short memory. Later work traced that memory to chemical marks added to and removed from the receptors over seconds. This is textbook microbiology, replicated in many labs.',
 example:'In the toy dish, a walker with no memory tumbles at a fixed rate and wanders. Give it a memory of a few steps and it tumbles less while the attractant rises, so it drifts towards the source. The memory length is the only change.',
 desc:'A dish with an attractant source on the right, shaded by concentration, the path of one toy bacterium with its runs and tumbles, and tiles comparing the average distance from the source with and without memory over a group of seeded runs.',
 research:['Macnab & Koshland (1972). The gradient-sensing mechanism in bacterial chemotaxis. PNAS 69, 2509–2512 (a temporal comparison: a kind of memory).','Lyon, Keijzer, Arendt & Levin (2021). Reframing cognition: getting down to biological basics. Philosophical Transactions of the Royal Society B 376, 20190750.','Toy walker written for this course: no flagella, receptors or real units.'],
 dur:12,hint:'Change the memory length and watch the path. With memory 1 the walker has no past to compare with. Try new seeds to see that one path is luck; the tiles average over many.',
 init:()=>({mem:6,seed:3}),
 trace(s){const fr=[];for(let k=1;k<=8;k++)fr.push({k,say:k<8?`Step ${k*L7_CH.steps/8} of ${L7_CH.steps}.`:'The run is over.'});return fr},
 ui:[{range:'mem',label:'Memory length (steps)',min:0,max:3,get:s=>L7_MEMS.indexOf(s.mem),act:'mem',show:v=>L7_MEMS[v]===1?'1 (no memory)':String(L7_MEMS[v])},{b:'New bacterium',act:'seed'},{b:'No memory / memory',act:'flip'}],
 on:{mem(s,v){s.mem=L7_MEMS[clamp(Math.round(+v),0,3)]},seed(s){s.seed=(s.seed%97)+1},flip(s){s.mem=s.mem===1?6:1}},
 draw(s,f,X){
  const w=L7_walk(s.mem,s.seed),u=X?X.u:1,n=Math.round(((f.k-1)+u)/8*L7_CH.steps),pts=w.pts.slice(0,n+1);
  const x0=30,y0=56,sc=4.5,MX=v=>x0+v*sc,MY=v=>y0+v*3.6;
  let out=heading(s.mem===1?'No memory: the walker cannot tell better from worse':`Memory of ${s.mem} steps: it drifts up the gradient`);
  // the dish, shaded in bands by computed concentration
  out+=R(x0,y0,L7_CH.W*sc,L7_CH.H*3.6,'#fff',C.grid,6);
  for(let gx=0;gx<24;gx++)for(let gy=0;gy<14;gy++){const cx=(gx+.5)*5,cy=(gy+.5)*5,c=L7_conc(cx,cy);out+=R(MX(gx*5),MY(gy*5),5*sc,5*3.6,C.green,'none',0,`opacity="${fmt(Math.round(c*40)/100)}"`)}
  out+=Ci(MX(L7_CH.sx),MY(L7_CH.sy),7,C.green,'#fff')+TF(MX(L7_CH.sx),MY(L7_CH.sy)-12,'source',13,C.green);
  const pp=pts.map(p=>[MX(p[0]),MY(p[1])]);
  out+=L7_poly(pp,C.blue,1.8);
  const last=pp[pp.length-1];out+=Ci(last[0],last[1],5,C.coral,'#fff');
  // tiles: averages over 24 seeded runs for this memory and for none
  const a=L7_popStats(s.mem),b=L7_popStats(1),here=L7_dist(pts[pts.length-1]);
  out+=L7_tile(30,320,165,'This walker: distance now',L7_n(here)+' units',C.coral);
  out+=L7_tile(205,320,180,`Mean distance, memory ${s.mem}`,L7_n(a.mean)+' units',C.blue);
  out+=L7_tile(395,320,175,'Mean distance, no memory',L7_n(b.mean)+' units',C.muted);
  out+=L7_badges(36,62,['rep','model']);
  const ph=s.mem===1?`With a memory of one step the walker compares the present with itself, so it tumbles at the same rate wherever it is. Over ${L7_POPN} seeded runs it averages ${L7_n(b.mean)} units from the source in the second half of the run.`:
   `The walker compares the log concentration now with its average over about ${s.mem} steps and tumbles less while that is rising. Over ${L7_POPN} seeded runs it averages ${L7_n(a.mean)} units from the source, against ${L7_n(b.mean)} with no memory. The model leaves out flagella, receptors, adaptation chemistry and real units.`;
  return {svg:out,phase:f.k<8?ph:`${w.tumbles} tumbles in ${L7_CH.steps} steps. `+ph};
 }});

// Scene 2: Jennings's Stentor. A toy ladder of avoidance responses to repeated irritation.
// Responses: bend away, reverse cilia, contract, detach. The toy steps up the ladder by 0, 1 or 2 rungs per stimulus
// (so sequences are often partial or skip steps). After contracting, the choice to detach next or contract again is a
// fair coin, following Dexter et al.'s description of that choice. A seeded group of toy cells gives the tallies.
const L7_ST=['bend away','reverse cilia','contract','detach'];
function L7_stentor(seed,skip){
 const r=L7_rng(seed),seq=[];let lev=-1;
 for(let k=0;k<8&&lev<3;k++){
  let j=r()<skip?2:1;if(lev>=0&&r()<.25)j=0;
  if(lev===2){lev=r()<.5?3:2}else lev=Math.min(3,lev+j);
  seq.push(lev);
 }
 return seq;
}
function L7_stentorStats(skip,n=200){let full=0,det=0,order=0;
 for(let i=0;i<n;i++){const q=L7_stentor(900+i,skip),u=[...new Set(q)];if(u.length===4)full++;if(q.includes(3))det++;
  let ok=true;for(let k=1;k<q.length;k++)if(q[k]<q[k-1])ok=false;if(ok)order++}
 return {full:full/n,det:det/n,n}}
SCENE({id:'basal-cognition-stentor',name:'Jennings’s Stentor, repeated in 2019',tag:'Replicated finding · A ladder of avoidance in one cell, 1906 and 2019',
 definition:'Herbert Spencer Jennings, in Behavior of the Lower Organisms (1906), described the trumpet-shaped single cell Stentor roeseli reacting to repeated irritation with a series of escalating responses: bending away, reversing its cilia, contracting, and finally detaching and swimming off. Later attempts to repeat this failed, but they used a different, more mobile species. In 2019 Joseph Dexter, Sudhakaran Prabakaran and Jeremy Gunawardena at Harvard Medical School used S. roeseli again, with video microscopy and polystyrene beads as the irritant, and found the hierarchy: real, but variable, with full sequences rare and partial ones common.',
 example:'They reported that the choice between contracting and detaching looked like a fair coin toss. The authors described the hierarchy as a form of sequential decision-making; that is their reading. The toy below copies only the shape of the result: a ladder climbed in steps of different sizes, and a coin at the last rung.',
 desc:'A schematic Stentor beside a four-rung ladder of responses; each stimulus moves a toy cell up the ladder, and tiles give tallies over a seeded group of toy cells.',
 research:['Jennings (1906). Behavior of the Lower Organisms. Columbia University Press.','Dexter, Prabakaran & Gunawardena (2019). A complex hierarchy of avoidance behaviors in a single-cell eukaryote. Current Biology 29.','Toy ladder written for this course; its step probabilities are illustrative, not the paper’s.'],
 dur:12,hint:'Press Stimulate to irritate one toy cell again and again. Change how often it skips a rung, then read the tallies over a seeded group of toy cells.',
 init:()=>({seed:4,skip:3,k:0}),
 watch(p){const runs=[4,9,15];const i=Math.min(2,Math.floor(p*3)),u=p*3-i;return {seed:runs[i],skip:3,k:Math.min(8,Math.floor(u*7))}},
 ui:[{b:'Stimulate',act:'stim'},{b:'Next toy cell',act:'next'},{range:'skip',label:'Chance of skipping a rung',min:0,max:6,get:s=>s.skip,act:'skip',show:v=>v*10+'%'}],
 on:{stim(s){s.k=Math.min(8,s.k+1)},next(s){s.seed=(s.seed%199)+1;s.k=0},skip(s,v){s.skip=clamp(Math.round(+v),0,6);s.k=0}},
 draw(s,f,X){
  const q=L7_stentor(s.seed,s.skip/10),shown=q.slice(0,s.k),lev=shown.length?shown[shown.length-1]:-1,done=shown.length===q.length&&q.length>0&&lev===3;
  let out=heading(!shown.length?'Irritate the cell and watch what it does':done?'It detached and swam away':`Response: ${L7_ST[lev]}`);
  // schematic Stentor: trumpet on a stalk, drawn by state
  const bx=110,by=300,h=lev===2?70:150,lean=lev>=0?-22:0,gone=lev===3;
  if(!gone){out+=P(`M${bx} ${by} Q${bx+lean/2} ${by-h/2} ${bx+lean} ${by-h}`,C.green,4);
   out+=P(`M${bx+lean-34} ${by-h-30} Q${bx+lean} ${by-h-6} ${bx+lean+34} ${by-h-30} L${bx+lean+6} ${by-h} L${bx+lean-6} ${by-h} Z`,C.green,2.5,C.greenp);
   if(lev===1)out+=arrow(bx+lean-30,by-h-40,bx+lean-50,by-h-60,C.coral,2,7)+arrow(bx+lean+30,by-h-40,bx+lean+50,by-h-60,C.coral,2,7);}
  else out+=Ci(bx+70,120,16,C.greenp,C.green)+arrow(bx+90,120,bx+130,100,C.green,2.5);
  out+=L(40,by,190,by,C.line,3)+TF(bx,by+20,'holdfast on a surface',13,C.muted);
  // ladder of responses
  const lx=250;L7_ST.forEach((nm,i)=>{const y=290-i*62,hitN=shown.includes(i),cur=lev===i;
   out+=R(lx,y-22,160,40,cur?C.coralp:hitN?C.pale:'#fff',cur?C.coral:hitN?C.blue:C.grid,8)+TF(lx+80,y+4,`${i+1}. ${nm}`,14,cur?C.coral:C.ink)});
  out+=TF(lx+80,70,'escalating responses',13,C.muted);
  // sequence so far
  out+=TF(430,84,'This cell so far:',13,C.muted,'start');
  shown.forEach((v,i)=>{out+=TF(430,104+i*17,`${i+1}: ${L7_ST[v]}`,13,C.ink,'start')});
  const st=L7_stentorStats(s.skip/10);
  out+=L7_tile(420,250,170,'Full 4-step sequence',L7_pct(st.full),C.blue)+L7_tile(420,304,170,'Ever detached',L7_pct(st.det),C.ink);
  out+=TF(505,364,`over ${st.n} seeded toy cells`,13,C.muted);
  out+=L7_badge(10,40,'rep')+L7_badge(590,40,'model','end');
  return {svg:out,phase:!shown.length?'A single cell with no nervous system. In the real experiments a stream of plastic beads was the irritant; here, press Stimulate.':
   done?`After ${shown.length} stimuli this toy cell left. Across ${st.n} toy cells, ${L7_pct(st.full)} went through all four responses${st.full<.5?': the ladder is there, but most runs are partial, as Dexter and colleagues reported for the real cell':'. With so few skipped rungs the toy is more orderly than the real cell, where full sequences were rare'}.`:
   `This toy cell has now ${shown.length===1?'responded once':'responded '+shown.length+' times'}. Each stimulus moves it up zero, one or two rungs; at the contraction rung a fair coin decides whether it detaches next.`};
 }});

// Scene 3: Physarum in a maze. Tero-style tube adaptation: each tube's conductance D grows with the flow through it and
// decays otherwise (growth goes with flow to the power 1.8, so busy tubes win). Pressures come from Kirchhoff's law with food A as source and food B as sink (a linear solve).
const L7_PN=[[60,190],[150,190],[150,100],[150,280],[265,100],[265,190],[265,280],[375,100],[375,190],[385,298],[485,100],[495,298],[545,190],[60,100],[60,280],[375,56]];
const L7_PE=[[0,1],[1,2],[1,3],[2,4],[3,6],[4,5],[5,6],[4,7],[6,9],[5,8],[7,10],[9,11],[10,12],[11,12],[8,12],[2,13],[3,14],[7,15]];
const L7_PLEN=L7_PE.map(([a,b])=>Math.hypot(L7_PN[a][0]-L7_PN[b][0],L7_PN[a][1]-L7_PN[b][1])/100);
// Solve A p = b by Gaussian elimination with partial pivoting.
function L7_solve(A,b){const n=b.length,M=A.map((r,i)=>r.concat([b[i]]));
 for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;[M[c],M[p]]=[M[p],M[c]];
  const d=M[c][c]||1e-12;for(let r=c+1;r<n;r++){const f=M[r][c]/d;if(f)for(let k=c;k<=n;k++)M[r][k]-=f*M[c][k]}}
 const x=new Array(n).fill(0);for(let r=n-1;r>=0;r--){let s=M[r][n];for(let k=r+1;k<n;k++)s-=M[r][k]*x[k];x[r]=s/(M[r][r]||1e-12)}return x}
// Flows for conductances D (blocked tubes have D=0). Node 12 is grounded.
function L7_flows(D){const n=L7_PN.length,A=range(n).map(()=>new Array(n).fill(0)),b=new Array(n).fill(0);
 L7_PE.forEach(([i,j],e)=>{const g=D[e]/L7_PLEN[e];A[i][i]+=g;A[j][j]+=g;A[i][j]-=g;A[j][i]-=g});
 for(let i=0;i<n;i++)A[i][i]+=1e-9;b[0]=1;A[12]=new Array(n).fill(0);A[12][12]=1;b[12]=0;
 const p=L7_solve(A,b);return L7_PE.map(([i,j],e)=>D[e]/L7_PLEN[e]*(p[i]-p[j]))}
function L7_physarum(steps,blocked){let D=L7_PE.map((_,e)=>blocked.includes(e)?0:1);
 for(let t=0;t<steps;t++){const Q=L7_flows(D);D=D.map((d,e)=>blocked.includes(e)?0:Math.max(0,d+.4*(Math.pow(Math.abs(Q[e]),1.8)-d)))}
 return {D,Q:L7_flows(D)}}
// Shortest path length from food A to food B through open tubes (Dijkstra).
function L7_shortest(blocked){const n=L7_PN.length,d=new Array(n).fill(Infinity),done=new Array(n).fill(false);d[0]=0;
 for(;;){let u=-1;for(let i=0;i<n;i++)if(!done[i]&&d[i]<Infinity&&(u<0||d[i]<d[u]))u=i;if(u<0)break;done[u]=true;
  L7_PE.forEach(([a,b],e)=>{if(blocked.includes(e))return;const v=a===u?b:b===u?a:-1;if(v>=0&&d[u]+L7_PLEN[e]<d[v])d[v]=d[u]+L7_PLEN[e]})}
 return d[12]}
SCENE({id:'basal-cognition-physarum',name:'A slime mould in a maze',tag:'Single-lab finding · Physarum finds short routes, 2000 and 2010',
 definition:'The slime mould Physarum polycephalum spends part of its life as one huge cell, a network of tubes through which its cytoplasm streams back and forth. In 2000 Toshiyuki Nakagaki, Hiroyasu Yamada and Ágota Tóth filled a small maze with it and put food at two exits: tubes in dead ends withdrew, and the cell kept the shortest route between the food sources. In 2010 Atsushi Tero, Nakagaki and colleagues let it grow over oat flakes placed like the cities around Tokyo and reported networks comparable to the rail system in cost, efficiency and fault tolerance. Both papers come from Nakagaki’s group and its collaborators.',
 example:'Tero and colleagues also wrote a simple rule that reproduces this: a tube that carries more flow thickens, and one that carries little thins. The toy below uses that kind of rule. Nobody inside the cell plans the route; it emerges from the feedback between flow and tube width.',
 desc:'A maze of tubes between food A and food B; tube width shows the computed conductance as the network adapts, and the learner can block tubes to force a new route. Tiles compare the route the network keeps with the shortest route computed directly.',
 research:['Nakagaki, Yamada & Tóth (2000). Maze-solving by an amoeboid organism. Nature 407, 470.','Tero, Takagi, Saigusa et al. (2010). Rules for biologically inspired adaptive network design. Science 327, 439–442.','Toy tube network written for this course in the spirit of the 2010 model; not its equations or parameters.'],
 dur:12,hint:'Tap a tube to block or unblock it, then move the time slider to let the network adapt. Compare the route it keeps with the shortest route.',
 init:()=>({steps:40,blocked:[]}),
 watch(p){return {steps:Math.round((p<.55?p/.55:(p-.55)/.45)*40),blocked:p<.55?[]:[10]}},
 ui:[{range:'steps',label:'Adaptation time (toy steps)',min:0,max:60,get:s=>s.steps,act:'steps'},{b:'Open all tubes',act:'open'},{b:'Block the top route',act:'top'}],
 on:{steps(s,v){s.steps=clamp(Math.round(+v),0,60)},open(s){s.blocked=[]},top(s){s.blocked=[10]},
  tube(s,e){e=+e;if(!(e>=0&&e<L7_PE.length))return 'keep';s.blocked=s.blocked.includes(e)?s.blocked.filter(x=>x!==e):s.blocked.concat([e]);return 'keep'}},
 draw(s,f,X){
  const {D,Q}=L7_physarum(s.steps,s.blocked),open=D.map(d=>d>.05);
  const kept=L7_PE.reduce((a,_,e)=>a+(open[e]?L7_PLEN[e]:0),0),total=L7_PLEN.reduce((a,b,e)=>a+(s.blocked.includes(e)?0:b),0),sp=L7_shortest(s.blocked);
  // the route carrying most flow: follow the largest flow from A
  let out=heading(s.steps===0?'The cell fills every tube at first':kept<sp*1.05?'Only the shortest route is left':'Tubes in dead ends are thinning');
  L7_PE.forEach(([a,b],e)=>{const A=L7_PN[a],B=L7_PN[b],bl=s.blocked.includes(e),w=bl?2:1.5+Math.min(1,D[e])*9;
   const inner=L(A[0],A[1],B[0],B[1],'transparent',18)+(bl?L(A[0],A[1],B[0],B[1],C.line,2,'stroke-dasharray="5 5"')+TBF((A[0]+B[0])/2,(A[1]+B[1])/2+5,'✕',15,C.coral):L(A[0],A[1],B[0],B[1],open[e]?C.amber:C.grid,w));
   out+=hit(X,'tube',e,`Tube ${e+1}${bl?', blocked':''}. Press to ${bl?'unblock':'block'}.`,inner)});
  L7_PN.forEach((p,i)=>{if(i===0||i===12)return;out+=Ci(p[0],p[1],4,C.line)});
  out+=Ci(60,190,13,C.green,'#fff')+TBF(60,195,'A',13,'#fff')+Ci(545,190,13,C.green,'#fff')+TBF(545,195,'B',13,'#fff');
  out+=TF(60,218,'food',13,C.green)+TF(560,224,'food',13,C.green);
  out+=L7_tile(30,320,170,'Tube length kept',L7_n(kept,1)+' of '+L7_n(total,1),C.amber)+L7_tile(215,322,170,'Shortest route (direct)',isFinite(sp)?L7_n(sp,1):'none',C.ink)+L7_tile(400,322,170,'Flow A→B (toy units)',L7_n(Math.abs(Q[0]),2),C.blue);
  out+=L7_badge(10,40,'single')+L7_badge(590,40,'model','end');
  return {svg:out,phase:!isFinite(sp)?'Food A and food B are cut off from each other, so no flow passes and every tube thins away.':
   s.steps===0?'At the start every open tube is equally thick. Flow from food A to food B is shared among all routes.':
   `After ${s.steps} toy steps the network keeps ${L7_n(kept,1)} units of tube out of ${L7_n(total,1)}. The shortest route, found directly by a path search, is ${L7_n(sp,1)} units. Width follows flow, and flow follows width: that loop alone finds the short route.`};
 }});

// Scene 4: what basal cognition studies. Tap a case to read what was observed, by whom, and how strong the evidence is.
const L7_CASES=[
 {nm:'E. coli',nl:['E. coli'],cap:['senses;','remembers','seconds'],lab:'rep',who:'Macnab & Koshland (1972)',obs:'Swims up attractant gradients by comparing now with a few seconds ago.',scene:'textbook, many labs'},
 {nm:'Stentor',nl:['Stentor'],cap:['escalating','responses'],lab:'rep',who:'Jennings (1906); Dexter et al. (2019)',obs:'Bends, reverses cilia, contracts, detaches; order varies.',scene:'repeated after a century'},
 {nm:'Physarum',nl:['Physarum'],cap:['keeps short','routes'],lab:'single',who:'Nakagaki et al. (2000); Tero et al. (2010)',obs:'Tube network keeps the shortest maze route; rail-like networks.',scene:'one group and its collaborators'},
 {nm:'Planarian',nl:['Planarian'],cap:['memory after','head regrowth?'],lab:'single',who:'Shomrat & Levin (2013)',obs:'Trained worms that regrew heads relearned faster (era 3).',scene:'one lab; not yet repeated'},
 {nm:'Gene-network models',nl:['Gene-network','models'],cap:['memory in','simulation'],lab:'single',who:'Biswas et al. (2021)',obs:'Computer models of real networks showed memory-like responses.',scene:'models; tests in cells are early'}];
SCENE({id:'basal-cognition-field',name:'Starting from biology, not from us',tag:'Framework or hypothesis · Pamela Lyon’s biogenic approach',
 definition:'The philosopher Pamela Lyon argued in 2006 that most work on cognition takes the human mind as its model, which she called the anthropogenic approach, and that a general theory should instead start from biology and ask what all living things need to do to survive: the biogenic approach. In 2021 Lyon, Fred Keijzer, Detlev Arendt and Michael Levin edited a two-part theme issue of Philosophical Transactions B on basal cognition, offering a working definition and a toolkit of capacities such as sensing, memory, learning and communication. František Baluška and Levin (2016) used “cognition” broadly, for acquiring, storing, processing and using information at any level, and said explicitly that they did not mean human-like thought or self-awareness.',
 example:'The field’s view, that these capacities form a continuum from bacteria to people, is a framework. The behaviours themselves are findings, of different strength: tap each case to see its evidence label. Basal cognition is about measurable behaviour; it is not a claim that cells are conscious.',
 desc:'Five cases arranged from bacteria to computer models, each with a capacity and an evidence label; tapping one shows what was observed and who reported it. A line across the top contrasts the anthropogenic and biogenic starting points.',
 research:['Lyon (2006). The biogenic approach to cognition. Cognitive Processing 7, 11–29.','Lyon, Keijzer, Arendt & Levin (2021). Reframing cognition: getting down to biological basics. Phil. Trans. R. Soc. B 376, 20190750 (introducing the theme issue “Basal cognition: conceptual tools and the view from the single cell”, with a second part, “Basal cognition: multicellularity, neurons and the cognitive lens”).','Baluška & Levin (2016). On having no head: cognition throughout biological systems. Frontiers in Psychology 7, 902.'],
 dur:12,hint:'Tap each case to read what was seen, who reported it and how strong the evidence is. The badges, not how famous a result is, say how far to trust it.',
 init:()=>({pick:-1}),
 watch(p){return {pick:Math.min(4,Math.floor(p*5))}},
 ui:[{choose:[[-1,'Overview'],[0,'E. coli'],[1,'Stentor'],[2,'Physarum'],[3,'Planarian'],[4,'Models']],label:'Case',get:s=>s.pick,act:'pick'}],
 on:{pick(s,v){s.pick=clamp(Math.round(+v),-1,4)},card(s,i){i=+i;s.pick=s.pick===i?-1:clamp(i,0,4);return 'keep'}},
 draw(s,f,X){
  let out=heading('Five cases, five strengths of evidence');
  out+=R(20,48,560,40,C.purplep,'none',8)+TF(300,64,'Anthropogenic: start from the human mind and look down',13,C.ink)+TF(300,81,'Biogenic (Lyon): start from what every living thing must do and look up',13,C.purple);
  L7_CASES.forEach((c,i)=>{const x=20+i*114,y=100,on=s.pick===i,[lab,ink,fill]=L7_LABELS[c.lab];
   const inner=R(x,y,104,118,on?fill:'#fff',on?ink:C.grid,8)+TBF(x+52,y+22,c.nl[0],13,C.ink)+(c.nl[1]?TBF(x+52,y+38,c.nl[1],13,C.ink):'')+
    L7_lines(x+52,y+56,c.cap,12.5,C.muted,'middle',14)+
    R(x+8,y+92,88,18,fill,ink,9)+TBF(x+52,y+105,c.lab==='rep'?'replicated':'single group',11.5,ink);
   out+=hit(X,'card',i,`${c.nm}: ${c.cap.join(' ')}. ${lab}. Press to read more.`,inner)});
  out+=arrow(40,236,560,236,C.line,2)+TF(40,254,'single cells',13,C.muted,'start')+TF(560,254,'tissues and models',13,C.muted,'end');
  const c=s.pick>=0?L7_CASES[s.pick]:null;
  out+=R(20,266,560,84,'#fff',C.grid,8);
  if(c){out+=TBF(32,288,c.nm+': '+c.who,13,C.ink,'start')+TF(32,308,c.obs,13,C.ink,'start')+TF(32,328,'Evidence: '+c.scene+'.',13,C.muted,'start')+L7_badge(568,330,c.lab,'end')}
  else out+=L7_lines(32,290,['The behaviours are findings of different strengths. The idea that','they form one continuum of cognition is a framework, so it carries','its own badge above the line.'],13,C.ink,'start',18);
  out+=L7_badge(10,22,'frame');
  return {svg:out,phase:c?`${c.nm}. ${c.obs} Reported by ${c.who}. Evidence: ${c.scene}. Label: ${L7_LABELS[c.lab][0].toLowerCase()}.`:'Lyon’s biogenic approach asks what any organism must do to stay alive, and treats sensing, memory and choice as answers found by evolution. The cases below are the course’s examples; their labels differ.'};
 }});

/* ===================== Lesson: tame-framework ===================== */
// Scene 1: the axis of persuadability. Four bands, from changing a system's parts to giving it reasons. The learner
// places six systems; the "suggested" placements are this course's reading of the framework, labelled as such.
const L7_BANDS=[['rewire its parts','the hardware'],['reset its set point','the goal it keeps'],['train it','reward, penalty'],['give it reasons','arguments']];
const L7_SYS=[['clock','a wind-up clock',0],['thermostat','a thermostat',1],['bacterium','a bacterium',1],['planarian','a planarian',2],['dog','a dog',2],['person','a person',3]];
SCENE({id:'tame-framework',name:'An axis of persuadability',tag:'Framework or hypothesis · TAME, Levin 2022',
 definition:'In 2022 Michael Levin set out TAME, the Technological Approach to Mind Everywhere, in Frontiers in Systems Neuroscience. It treats cognition as a continuum rather than something a system has or lacks, and proposes judging where a system sits by asking what works best to change its behaviour. He calls this an axis of persuadability: at one end, systems you can only change by rewiring their parts; further along, systems you can change by resetting a goal they keep; then systems you can train; and at the far end, systems you can persuade with reasons. Levin relates it to Daniel Dennett’s intentional stance, and stresses that where a given system lies is an empirical question, to be settled by trying interventions.',
 example:'A thermostat is not rewired to make a room warmer; you turn its dial, its set point, and it does the rest. A dog is trained, and a person can be given an argument. TAME’s proposal is that cells and tissues should be tested in the same way, rather than assumed to sit at the far left. This is a framework: a way of organising questions, offered with the claim that it leads to useful experiments.',
 desc:'A horizontal axis in four bands, from rewiring parts to giving reasons, with six systems the learner can move between bands; a panel says what kind of intervention each placement would imply.',
 research:['Levin (2022). Technological Approach to Mind Everywhere: an experimentally-grounded framework for understanding diverse bodies and minds. Frontiers in Systems Neuroscience 16, 768201.','Dennett (1987). The Intentional Stance. MIT Press (cited by Levin as closely related).','The band names and suggested placements are this course’s reading of the framework, not a figure copied from the paper.'],
 dur:12,hint:'Tap a system to move it one band along the axis, and read what that placement would mean for how you would change it. Then show the course’s reading of TAME’s placements. There is no answer key.',
 init:()=>({pos:[0,0,0,0,0,0],sel:-1,sug:0}),
 watch(p){const k=Math.min(6,Math.floor(p*7));return {pos:L7_SYS.map((q,i)=>i<k?q[2]:0),sel:k-1,sug:p>.86?1:0}},
 ui:[{b:'Show the suggested placements',act:'sug'},{b:'All to the left',act:'clear'}],
 on:{sys(s,i){i=+i;if(!(i>=0&&i<6))return 'keep';s.pos=s.pos.slice();s.pos[i]=(s.pos[i]+1)%4;s.sel=i;return 'keep'},sug(s){s.sug=s.sug?0:1},clear(s){s.pos=[0,0,0,0,0,0];s.sel=-1;s.sug=0}},
 draw(s,f,X){
  const bx=i=>110+i*120;
  let out=heading('Where does each sit?');
  L7_BANDS.forEach((b,i)=>{out+=R(bx(i)-58,50,116,252,i%2?'#f6f9fb':'#fff',C.grid,6)+TBF(bx(i),68,b[0],12.5,C.purple)+TF(bx(i),84,b[1],12,C.muted)});
  out+=arrow(52,314,588,314,C.purple,2.2)+TF(52,332,'more micromanagement',13,C.muted,'start')+TF(588,332,'more persuasion',13,C.muted,'end');
  L7_SYS.forEach((q,i)=>{const y=108+i*32,x=bx(s.pos[i]),on=s.sel===i;
   const inner=R(x-52,y-12,104,26,on?C.purplep:'#fff',on?C.purple:C.line,13)+TF(x,y+6,q[0],13,C.ink);
   out+=hit(X,'sys',i,`${q[1]}: now under “${L7_BANDS[s.pos[i]][0]}”. Press to move it along.`,inner);
   if(s.sug&&q[2]!==s.pos[i])out+=Ci(bx(q[2]),y+1,6,'none',C.purple,'stroke-dasharray="2 2"');
  });
  const agree=L7_SYS.filter((q,i)=>q[2]===s.pos[i]).length;
  out+=L7_badge(10,26,'frame');
  if(s.sug)out+=TF(590,40,`${agree} of 6 where the course reads TAME (dotted rings)`,12.5,C.purple,'end');
  const q=s.sel>=0?L7_SYS[s.sel]:null,band=q?L7_BANDS[s.pos[s.sel]]:null;
  out+=R(20,340,560,32,C.pale,'none',8)+TF(30,361,q?`To change ${q[1]} here: ${band[0]} (${band[1]}).`:'Tap a system to place it.',13,C.ink,'start');
  return {svg:out,phase:q?`You placed ${q[1]} under “${band[0]}”. On TAME’s view, that is a claim you could test: if it is right, ${band[1]} should be the most efficient way to change what it does. ${s.sug?`The course’s reading of the framework puts it under “${L7_BANDS[q[2]][0]}”.`:''}`:
   s.sug?`Dotted rings show the course’s reading of where TAME would put each system: a reading, not data. ${agree} of your 6 placements match it.`:'Six systems, all placed at the far left for now. TAME asks you to find, by experiment, how far along each one belongs.'};
 }});

// Scene 2: micromanage or reset the goal. A toy homeostatic loop: x moves towards its set point S at rate k, with seeded
// kicks. Strategy A pushes x towards the target every step from step 10 to step 40 (effort = total push). Strategy B
// rewrites S once at step 10 (effort = the size of the rewrite). Both are judged at the end, after any pushing stops.
const L7_HS={T:70,k:.15,S0:0,tgt:1,g:.5,on:10,off:40};
function L7_home(strat,kick,seed){const r=L7_rng(seed),xs=[0];let x=0,S=L7_HS.S0,eff=0;
 for(let t=1;t<=L7_HS.T;t++){let u=0;
  if(strat==='push'&&t>=L7_HS.on&&t<L7_HS.off){u=L7_HS.g*(L7_HS.tgt-x);eff+=Math.abs(u)}
  if(strat==='reset'&&t===L7_HS.on){eff+=Math.abs(L7_HS.tgt-S);S=L7_HS.tgt}
  x+=L7_HS.k*(S-x)+u+kick*(r()-.5)*.4;xs.push(x)}
 const tail=xs.slice(-10),err=tail.reduce((a,v)=>a+Math.abs(v-L7_HS.tgt),0)/tail.length;
 return {xs,eff,err,end:xs[xs.length-1]}}
SCENE({id:'tame-framework-setpoint',name:'Push the parts, or reset the goal',tag:'Framework or hypothesis · Why set points matter to TAME',
 definition:'TAME’s practical claim is about efficiency. A system that keeps something near a set point will undo your changes as soon as you stop forcing it; change the set point instead, and the system does the work and keeps the change. The lab reads several of its own experiments this way: planarians given a brief bioelectric treatment that keep regrowing two heads in later cuts (era 3), and tadpoles whose displaced face organs move towards normal positions (era 4). Those experiments are single-lab findings; reading them as set-point changes is the framework.',
 example:'In the toy loop, pushing the value to the target every step works while you push, costs effort every step, and fades once you stop. Rewriting the set point once costs a single change and lasts, because the loop itself now holds the new value. Whether real tissues keep anatomical set points in this sense is the hypothesis being tested.',
 desc:'A time plot of a toy value held near a set point, with seeded random kicks; the learner chooses to push the value directly for a period or to rewrite the set point once, and tiles compare effort spent and the final error from the target.',
 research:['Levin (2022). Technological Approach to Mind Everywhere. Frontiers in Systems Neuroscience 16, 768201.','Oviedo et al. (2010), Developmental Biology; Vandenberg, Adams & Levin (2012), Developmental Dynamics: the experiments the lab reads this way (eras 3 and 4).','Toy set-point loop written for this course; it has no anatomy, genes or bioelectricity in it.'],
 dur:12,hint:'Choose push or reset, change the size of the random kicks, and compare effort and final error. Watch what happens to the pushed value after the pushing stops.',
 init:()=>({strat:'push',kick:3,seed:2}),
 watch(p){return {strat:p<.5?'push':'reset',kick:3,seed:2}},
 ui:[{choose:[['push',`Push the value (steps ${L7_HS.on}–${L7_HS.off})`],['reset','Reset the set point once']],label:'Strategy',get:s=>s.strat,act:'strat'},{range:'kick',label:'Random kicks',min:0,max:6,get:s=>s.kick,act:'kick'},{b:'New kicks',act:'seed'}],
 on:{strat(s,v){s.strat=v==='reset'?'reset':'push'},kick(s,v){s.kick=clamp(Math.round(+v),0,6)},seed(s){s.seed=(s.seed%50)+1}},
 draw(s,f,X){
  const a=L7_home(s.strat,s.kick/3,s.seed),b=L7_home(s.strat==='push'?'reset':'push',s.kick/3,s.seed),u=X&&!X.try?clamp(X.p*2%1.0001,0,1):1;
  const x0=60,y0=66,w=500,h=190,TX=t=>x0+t/L7_HS.T*w,VY=v=>y0+h-(v+.4)/1.8*h;
  let out=heading(s.strat==='push'?'Pushing works only while you push':'One rewrite, and the loop holds it');
  out+=R(x0,y0,w,h,'#fff',C.grid,4);
  out+=R(TX(L7_HS.on),y0,TX(s.strat==='push'?L7_HS.off:L7_HS.on+1)-TX(L7_HS.on),h,C.amberp,'none',0);
  for(const [v,l] of [[0,'old set point'],[1,'target']])out+=L(x0,VY(v),x0+w,VY(v),C.line,1.2,'stroke-dasharray="4 4"')+TF(x0-6,VY(v)+4,l,12.5,C.muted,'end');
  for(const t of [0,L7_HS.on,L7_HS.off,L7_HS.T])out+=TF(TX(t),y0+h+16,t,13,C.muted);
  out+=TF(x0+w/2,y0+h+32,'time (toy steps)',13,C.muted);
  const n=Math.max(1,Math.round(u*L7_HS.T));
  out+=L7_poly(b.xs.slice(0,n+1).map((v,t)=>[TX(t),VY(v)]),C.line,1.6,'stroke-dasharray="5 4"');
  out+=L7_poly(a.xs.slice(0,n+1).map((v,t)=>[TX(t),VY(v)]),s.strat==='push'?C.coral:C.purple,2.6);
  out+=TF(TX(L7_HS.on)+4,y0+16,s.strat==='push'?'pushing':'rewrite',13,C.amber,'start');
  out+=L7_tile(60,302,160,'Effort spent',L7_n(a.eff,2),s.strat==='push'?C.coral:C.purple)+L7_tile(230,302,160,'Final error',L7_n(a.err,2),C.ink)+L7_tile(400,302,160,'Other strategy: error',L7_n(b.err,2),C.muted);
  out+=L7_badge(10,40,'frame')+L7_badge(590,40,'model','end');
  out+=L7_note('Solid: chosen strategy. Dashed: the other one, with the same kicks.',366);
  return {svg:out,phase:s.strat==='push'?`Pushing from step ${L7_HS.on} to ${L7_HS.off} cost ${L7_n(a.eff,2)} units of effort. Once it stopped, the loop pulled the value back to its old set point: the final error is ${L7_n(a.err,2)}. Rewriting the set point instead gives ${L7_n(b.err,2)}.`:
   `One rewrite of the set point cost ${L7_n(a.eff,2)} units and the loop did the rest; the final error is ${L7_n(a.err,2)}, against ${L7_n(b.err,2)} for pushing. This is the toy version of TAME’s argument; it says nothing about whether a tissue has such a set point.`};
 }});

// Scene 3: what kind of claim is it? Six statements; tapping reveals the label the course gives each and what could change it.
const L7_TCL=[
 {t:['Cognition comes in degrees,','from cells to people.'],lab:'frame',who:'Levin (2022); Levin et al. (2021)',why:'A way of seeing. Judged by whether it leads to new, testable work.'},
 {t:['Where a system sits on the axis','is an empirical question.'],lab:'frame',who:'Levin (2022)',why:'A rule for method: try interventions of each kind and compare.'},
 {t:['Two-headed worms, cut again in','plain water, regrow two heads.'],lab:'single',who:'Oviedo et al. (2010); era 3',why:'An experiment from the lab. Independent repeats would strengthen it.'},
 {t:['Bacteria compare the present','with a few seconds ago.'],lab:'rep',who:'Macnab & Koshland (1972)',why:'Textbook microbiology, confirmed in many labs.'},
 {t:['Treating tissues as goal-seeking','will find better interventions.'],lab:'frame',who:'Levin (2022)',why:'A bet about research. Track record over time will judge it.'},
 {t:['Cells are conscious.'],lab:'',who:'not claimed by basal cognition',why:'Not a claim of this framework; Levin’s 2019 paper sets consciousness aside.'}];
SCENE({id:'tame-framework-claims',name:'Which kind of claim is it?',tag:'Framework or hypothesis · Sorting TAME’s statements',
 definition:'A framework is judged differently from a finding. A finding can be repeated or fail to repeat. A framework such as TAME is judged by whether it organises what is known, makes predictions that other views do not, and leads to experiments that work. Its supporters say the cognitive lens has already suggested experiments on regeneration and bioelectricity; critics ask whether the same experiments could have been designed without it. The course labels TAME a framework or hypothesis throughout, and labels each experiment offered for it by its own evidence.',
 example:'Six statements from this lesson and the eras before it. One is a textbook finding, one a single-lab experiment, three are parts of the framework, and one is a claim that basal cognition does not make at all.',
 desc:'Six cards with statements; tapping a card reveals its evidence label, who made the claim, and what kind of evidence would change it.',
 research:['Levin (2022). Technological Approach to Mind Everywhere. Frontiers in Systems Neuroscience 16, 768201.','Levin, Keijzer, Lyon & Arendt (2021). Uncovering cognitive similarities and differences, conservation and innovation. Phil. Trans. R. Soc. B 376, 20200458 (a continuum rather than a cognitive-versus-mechanical divide).','Levin (2019). The computational boundary of a “self”. Frontiers in Psychology 10, 2688 (no claims about consciousness beyond brief remarks).'],
 dur:12,hint:'Tap each card to reveal its label and what could change it. This is not a test; the labels are the course’s, and the reasons are given.',
 init:()=>({open:[0,0,0,0,0,0],show:-1}),
 watch(p){const k=Math.min(6,Math.floor(p*7));return {open:L7_TCL.map((_,i)=>i<k?1:0),show:k-1}},
 ui:[{b:'Reveal all',act:'all'},{b:'Hide all',act:'none'}],
 on:{card(s,i){i=+i;if(!(i>=0&&i<6))return 'keep';s.open=s.open.slice();s.open[i]=1;s.show=i;return 'keep'},all(s){s.open=[1,1,1,1,1,1];s.show=-1},none(s){s.open=[0,0,0,0,0,0];s.show=-1}},
 draw(s,f,X){
  let out=heading('Finding, framework, or not claimed?');
  L7_TCL.forEach((c,i)=>{const col=i%2,row=(i/2)|0,x=20+col*286,y=62+row*89,op=s.open[i];
   const LB=c.lab?L7_LABELS[c.lab]:['Not claimed here',C.muted,'#f1f3f4'];
   let inner=R(x,y,274,82,op?LB[2]:'#fff',op?LB[1]:C.grid,8)+L7_lines(x+12,y+21,c.t,13,C.ink,'start',17)+TF(x+12,y+56,c.who,12.5,C.muted,'start');
   inner+=op?R(x+12,y+61,L7_badgeW(c.lab||'rep')+4,18,'#fff',LB[1],9)+TBF(x+12+(L7_badgeW(c.lab||'rep')+4)/2,y+74,LB[0],12,LB[1]):TF(x+12,y+75,'tap to reveal',12.5,C.muted,'start');
   out+=hit(X,'card',i,`Statement: ${c.t.join(' ')} ${op?'Label: '+LB[0]:'Press to reveal its label.'}`,inner)});
  const sh=s.show>=0?L7_TCL[s.show]:null,nOpen=s.open.reduce((a,b)=>a+b,0);
  out+=R(20,332,560,36,C.pale,'none',8)+TF(30,355,sh?sh.why:`${nOpen} of 6 revealed. Each label is the course’s judgement of the evidence.`,13,C.ink,'start');
  out+=L7_badge(590,38,'frame','end');
  return {svg:out,phase:sh?`“${sh.t.join(' ')}” ${sh.lab?'Label: '+L7_LABELS[sh.lab][0].toLowerCase()+'.':'Not a claim of basal cognition.'} ${sh.why}`:`${nOpen} of 6 statements revealed. Frameworks and findings sit side by side in this field, so each one keeps its own label.`};
 }});

/* ===================== Lesson: cognitive-light-cone ===================== */
// Scene 1: draw a system's cone. Width = how far in space its largest goal reaches; upward = how far ahead; downward =
// how far back it remembers. Levels are orders of magnitude named in words; there is no agreed way to measure them.
const L7_SPACE=['its own surface','a few cells','a tissue','a body','a territory','a region','the planet'];
const L7_SPU=['µm','10 µm','mm','10 cm','100 m','10 km','10⁴ km'];
const L7_TIME=['a second','a minute','an hour','a day','a month','years','decades'];
const L7_PRE={bacterium:[0,0,0],tissue:[2,4,4],dog:[4,2,3],person:[6,6,6]};
const L7_PRENM={bacterium:'a bacterium',tissue:'a regenerating tissue',dog:'a dog',person:'a person'};
SCENE({id:'cognitive-light-cone',name:'The size of the largest goal',tag:'Framework or hypothesis · The cognitive light cone, Levin 2019',
 definition:'In a 2019 paper in Frontiers in Psychology, “The computational boundary of a self”, Michael Levin proposed describing any system by the boundary of the events it can measure, model and try to affect. Drawn with space across and time up and down, that boundary makes a shape he calls the system’s cognitive light cone: how far away, how far ahead and how far back its largest goals reach. A bacterium’s goals span micrometres and seconds; a person can work towards something on another continent decades from now. It is a diagram for comparing very different systems, not a measurement: there is no agreed way to put numbers on it.',
 example:'The paper proposes that larger goals grew out of the basic homeostatic drive of living things, and that developmental bioelectricity, cells joined into electrical networks, is one way cells came to share goals larger than any one of them, such as building an organ of the right shape. That is a hypothesis. It makes no claim about consciousness except in brief closing remarks.',
 desc:'A space–time diagram with the present at the centre: a diamond-shaped cone whose width, upper height and lower depth the learner sets, with preset shapes for a bacterium, a regenerating tissue, a dog and a person, and a reading in words of what that cone would mean.',
 research:['Levin (2019). The computational boundary of a “self”: developmental bioelectricity drives multicellularity and scale-free cognition. Frontiers in Psychology 10, 2688.','Levin (2022). Technological Approach to Mind Everywhere. Frontiers in Systems Neuroscience 16, 768201.','The scale steps and the preset shapes are this course’s illustration; the paper gives no such numbers.'],
 dur:12,hint:'Pick a preset, then widen or lengthen the cone with the sliders and read what the framework would say a system with that cone could pursue.',
 init:()=>({sp:2,fu:4,pa:4,pre:'tissue'}),
 watch(p){const keys=['bacterium','tissue','dog','person'],k=keys[Math.min(3,Math.floor(p*4))],v=L7_PRE[k];return {sp:v[0],fu:v[1],pa:v[2],pre:k}},
 ui:[{choose:[['bacterium','Bacterium'],['tissue','Tissue'],['dog','Dog'],['person','Person']],label:'Preset',get:s=>s.pre,act:'pre'},
  {range:'sp',label:'Reach in space',min:0,max:6,get:s=>s.sp,act:'sp',show:v=>L7_SPACE[v]},{range:'fu',label:'Reach ahead',min:0,max:6,get:s=>s.fu,act:'fu',show:v=>L7_TIME[v]},{range:'pa',label:'Memory back',min:0,max:6,get:s=>s.pa,act:'pa',show:v=>L7_TIME[v]}],
 on:{pre(s,v){if(!L7_PRE[v])return;s.pre=v;[s.sp,s.fu,s.pa]=L7_PRE[v]},sp(s,v){s.sp=clamp(Math.round(+v),0,6);s.pre=''},fu(s,v){s.fu=clamp(Math.round(+v),0,6);s.pre=''},pa(s,v){s.pa=clamp(Math.round(+v),0,6);s.pre=''}},
 draw(s){
  const cx=230,cy=196,W=v=>18+v*28,Hh=v=>14+v*19;
  let out=heading(s.pre?`A cone for ${L7_PRENM[s.pre]}`:'A cone you drew');
  out+=L(40,cy,420,cy,C.line,1.5)+L(cx,52,cx,342,C.line,1.5);
  out+=TF(414,cy-8,'space →',13,C.muted,'end')+TF(cx+6,62,'future',13,C.muted,'start')+TF(cx+6,340,'past',13,C.muted,'start')+TBF(cx-8,cy-8,'now',13,C.ink,'end');
  // reference cone (bacterium) dashed, and the chosen cone
  const dia=(sp,fu,pa,col,fill,extra)=>`<polygon points="${cx-W(sp)},${cy} ${cx},${cy-Hh(fu)} ${cx+W(sp)},${cy} ${cx},${cy+Hh(pa)}" fill="${fill}" stroke="${col}" stroke-width="2.2" ${extra}/>`;
  out+=dia(s.sp,s.fu,s.pa,C.purple,C.purplep,'fill-opacity=".8"');
  if(s.pre!=='bacterium')out+=dia(0,0,0,C.green,'none','stroke-dasharray="4 3"')+TF(cx-W(0)-6,cy+16,'bacterium',12.5,C.green,'end');
  out+=TF(cx+W(s.sp),cy+18,L7_SPU[s.sp],12.5,C.purple,'middle');
  // the reading
  out+=R(436,52,154,250,'#fff',C.grid,8)+TBF(448,74,'Reads as',13,C.purple,'start');
  out+=L7_lines(448,98,['Goals that span',L7_SPACE[s.sp]+',','reaching','about '+L7_TIME[s.fu]+' ahead,','remembering','about '+L7_TIME[s.pa]+' back.'],13,C.ink,'start',19);
  out+=L7_lines(448,226,['Illustration only:','the steps are orders','of magnitude in words,','not measurements.'],12.5,C.muted,'start',17);
  out+=L7_badge(10,26,'frame');
  out+=L7_note('Schematic after Levin (2019). The shape and the scale steps are this course’s.',366);
  return {svg:out,phase:`This cone reads as goals spanning ${L7_SPACE[s.sp]}, about ${L7_TIME[s.fu]} ahead and ${L7_TIME[s.pa]} back. On the framework’s view, a bigger cone means a system can work towards larger, longer-range states of affairs. No experiment yet measures a cone; it is a way of comparing.`};
 }});

// Scene 2: cells joining. An 8×5 sheet; each junction is open or closed (seeded, by the chosen fraction), and the learner
// can isolate a patch. A disturbance at one cell spreads through open junctions (steady state of a leaky coupled network,
// Gauss–Seidel); the cells that feel at least 10% of it are that cell's reach. Connected groups are counted directly.
const L7_GW=8,L7_GH=5,L7_GN=40;
const L7_jkey=(a,b)=>a<b?a+'-'+b:b+'-'+a;
function L7_junctions(closed,seed,patch){const r=L7_rng(seed),J={};
 for(let k=0;k<L7_GN;k++){const x=k%L7_GW,y=(k/L7_GW)|0;
  for(const [dx,dy] of [[1,0],[0,1]]){const xx=x+dx,yy=y+dy;if(xx>=L7_GW||yy>=L7_GH)continue;const kk=yy*L7_GW+xx;let open=r()>=closed/10;
   const inP=q=>patch&&(q%L7_GW)>=5&&(q%L7_GW)<=6&&((q/L7_GW)|0)>=1&&((q/L7_GW)|0)<=2;if(inP(k)!==inP(kk))open=false;J[L7_jkey(k,kk)]=open}}
 return J}
function L7_groups(J){const id=new Array(L7_GN).fill(-1);let g=0;
 for(let s=0;s<L7_GN;s++){if(id[s]>=0)continue;const st=[s];id[s]=g;while(st.length){const k=st.pop(),x=k%L7_GW,y=(k/L7_GW)|0;
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=L7_GW||yy>=L7_GH)continue;const kk=yy*L7_GW+xx;if(id[kk]<0&&J[L7_jkey(k,kk)]){id[kk]=g;st.push(kk)}}}g++}
 return {id,n:g}}
function L7_spread(J,src,gj=4,gm=.25){const V=new Array(L7_GN).fill(0);
 for(let it=0;it<400;it++){let dmax=0;for(let k=0;k<L7_GN;k++){const x=k%L7_GW,y=(k/L7_GW)|0;let num=k===src?1:0,den=gm;
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=L7_GW||yy>=L7_GH)continue;const kk=yy*L7_GW+xx;if(J[L7_jkey(k,kk)]){num+=gj*V[kk];den+=gj}}
  const v=num/den;dmax=Math.max(dmax,Math.abs(v-V[k]));V[k]=v}if(dmax<1e-9)break}
 return V}
SCENE({id:'cognitive-light-cone-join',name:'Cells joining into a bigger self',tag:'Framework or hypothesis · Coupling scales up the cone',
 definition:'The 2019 paper’s central proposal is about scale. A single cell pursues goals the size of a cell. When cells join through gap junctions, they share voltage, ions and small molecules, so a disturbance in one is felt by the others and the group can respond as a unit. Levin proposes that this is how cells came to pursue goals the size of a tissue or an organ, and that a cell which disconnects shrinks back to goals the size of a cell, his framework’s reading of cancer (era 5). The physiology of coupling is well established; reading it as the growth of a self is the hypothesis.',
 example:'In the toy sheet, close junctions and the sheet breaks into separate groups; a disturbance at one cell is felt only within its own group. Isolate a patch and it becomes a unit of its own. The toy counts connections and spread; it does not contain goals.',
 desc:'A sheet of 40 model cells joined by junctions that are open or closed; a disturbance at one chosen cell spreads through open junctions, shaded by its computed size, and tiles count the separate groups, the largest group and how many cells feel the disturbance.',
 research:['Levin (2019). The computational boundary of a “self”. Frontiers in Psychology 10, 2688.','Levin (2021). Bioelectrical approaches to cancer as a problem of the scaling of the cellular self. Progress in Biophysics and Molecular Biology 165, 102–113 (era 5).','Toy coupled sheet written for this course: a leaky resistor network, not real cells.'],
 dur:12,hint:'Close more junctions with the slider, isolate the patch on the right, and tap a cell to disturb it. Read how many cells feel it and how many separate groups the sheet has.',
 init:()=>({closed:3,seed:5,patch:0,src:9}),
 watch(p){return {closed:Math.round(lerp(0,7,smooth(clamp(p*1.4,0,1)))),seed:5,patch:p>.75?1:0,src:p>.75?21:9}},
 ui:[{range:'closed',label:'Closed junctions',min:0,max:9,get:s=>s.closed,act:'closed',show:v=>v*10+'%'},{b:'Isolate the patch: on/off',act:'patch'},{b:'New pattern',act:'seed'}],
 on:{closed(s,v){s.closed=clamp(Math.round(+v),0,9)},patch(s){s.patch=s.patch?0:1},seed(s){s.seed=(s.seed%60)+1},cell(s,k){k=+k;if(k>=0&&k<L7_GN)s.src=k;return 'keep'}},
 draw(s,f,X){
  const J=L7_junctions(s.closed,s.seed,s.patch),G=L7_groups(J),V=L7_spread(J,s.src),pk=V[s.src];
  const sizes=new Array(G.n).fill(0);G.id.forEach(g=>sizes[g]++);const big=Math.max(...sizes),feel=V.filter(v=>v>=.1*pk).length;
  const cw=46,x0=116,y0=52;
  let out=heading(G.n===1?'One connected sheet':`${G.n} separate groups`);
  for(const key in J){const [a,b]=key.split('-').map(Number),ax=x0+(a%L7_GW)*cw+cw/2,ay=y0+((a/L7_GW)|0)*cw+cw/2,bx=x0+(b%L7_GW)*cw+cw/2,by=y0+((b/L7_GW)|0)*cw+cw/2;
   out+=J[key]?L(ax,ay,bx,by,C.amber,5):L((ax+bx)/2-(by-ay)/6,(ay+by)/2-(bx-ax)/6,(ax+bx)/2+(by-ay)/6,(ay+by)/2+(bx-ax)/6,C.line,2)}
  for(let k=0;k<L7_GN;k++){const x=x0+(k%L7_GW)*cw,y=y0+((k/L7_GW)|0)*cw,u=clamp(V[k]/pk,0,1),src=k===s.src;
   const inner=R(x+7,y+7,cw-14,cw-14,src?C.coral:u>=.1?C.purple:'#fff',src?C.coral:C.purple,8,u>=.1&&!src?`fill-opacity="${fmt(Math.round((.15+.75*u)*100)/100)}"`:'')+TF(x+cw/2,y+cw/2+5,String(G.id[k]+1),12,src||u>.6?'#fff':C.ink);
   out+=hit(X,'cell',k,`Cell ${k+1}, group ${G.id[k]+1}. Press to disturb it.`,inner)}
  if(s.patch)out+=R(x0+5*cw+2,y0+cw+2,2*cw-4,2*cw-4,'none',C.coral,10,'stroke-dasharray="5 4"');
  out+=L7_tile(30,346-50,170,'Separate groups',String(G.n),C.ink)+L7_tile(215,296,170,'Largest group',big+' cells',C.purple)+L7_tile(400,296,170,'Cells that feel it',feel+' of '+L7_GN,C.coral);
  out+=TF(300,360,'Numbers in cells are group labels; shading is the computed spread from the red cell.',12.5,C.muted);
  out+=L7_badge(10,26,'frame')+L7_badge(590,26,'model','end');
  return {svg:out,phase:`With ${s.closed*10}% of junctions closed${s.patch?' and the patch isolated':''}, the sheet forms ${G.n} ${G.n===1?'group':'separate groups'}; the largest has ${big} cells. A disturbance at the red cell reaches ${feel===1?'only that cell':feel+' cells'} with at least a tenth of its size. On the framework’s reading, the size of a connected unit limits the size of the goals it can share.`};
 }});

// Scene 3: borrowed from physics. In special relativity the light cone of an event is set by the speed of light: an event
// at distance x and time t later can be affected only if |x| <= c t. The learner moves c and sees which toy events fall
// inside (computed). The cognitive cone borrows the picture but has no such rule; the 3D view shows both cones.
const L7_EV=[[1,1],[3,2],[-2,1],[4,1],[-1,3],[2,4],[-4,3],[5,2]];
SCENE({id:'cognitive-light-cone-space',name:'A picture borrowed from physics',tag:'Framework or hypothesis · What the analogy keeps and what it lacks',
 definition:'In physics a light cone is exact. Nothing travels faster than light, so from here and now you can affect only events inside a cone whose slope is set by the speed of light; whether an event is inside is a matter of arithmetic. Levin borrowed the picture for cognition: the boundary of the states of affairs a system can measure, model and try to change. The borrowed cone keeps the idea of a reachable region in space and time, but it has no constant like the speed of light and no agreed measurement, so its edges are drawn by judgement. Supporters see it as a useful common picture for cells, animals and machines; it remains a framework, not a quantity.',
 example:(()=>{const [x,t]=L7_EV[1],inn=c=>Math.abs(x)<=c*t?'inside':'outside';return `With the speed limit at 1 unit of distance per unit of time, an event ${x} units away and ${t} units later is ${inn(1)} the cone; at 2 units it is ${inn(2)}. Change the speed and the computed answer changes. Ask whether next year’s harvest lies inside a dog’s cognitive cone, and there is no calculation to do.`})(),
 desc:'A space–time diagram with eight events and the physics light cone of the present, whose slope the learner sets; events inside are counted. A 3D view shows the physics cone and a schematic cognitive cone side by side.',
 research:['Levin (2019). The computational boundary of a “self”. Frontiers in Psychology 10, 2688.','Einstein (1905) and Minkowski (1908): special relativity and its space–time diagram, in any physics textbook.','Events and units are toy values for this course.'],
 dur:12,hint:'Change the speed limit and count the events inside the cone. Then switch to the cognitive cone and notice that the same question has no computed answer.',
 init:()=>({c:2,view:'phys'}),
 watch(p){return {c:p<.6?1+Math.floor(p/.6*4)/2*1:2,view:p<.6?'phys':'cog'}},
 ui:[{range:'c',label:'Speed limit (distance per time)',min:1,max:8,get:s=>Math.round(s.c*2),act:'c',show:v=>fmt(v/2)},{choose:[['phys','Physics light cone'],['cog','Cognitive light cone']],label:'Cone',get:s=>s.view,act:'view'}],
 on:{c(s,v){s.c=clamp(Math.round(+v),1,8)/2},view(s,v){s.view=v==='cog'?'cog':'phys'}},
 draw(s){
  const cx=300,cy=300,ux=48,uy=56,inside=L7_EV.filter(([x,t])=>Math.abs(x)<=s.c*t+1e-9).length,phys=s.view==='phys';
  let out=heading(phys?`${inside} of ${L7_EV.length} events inside the cone`:'Inside or outside? No rule to compute');
  const axes=L(40,cy,560,cy,C.line,1.5)+L(cx,66,cx,cy+12,C.line,1.5)+TF(560,cy+34,'distance →',13,C.muted,'end')+TF(cx+6,62,'time later ↑',13,C.muted,'start')+TBF(cx,cy+30,'here, now',13,C.ink);
  for(const v of [-4,-2,2,4])out+=TF(cx+v*ux,cy+16,v,12.5,C.muted);
  if(phys){const tt=4.15,xm=5.6,xe=Math.min(xm,s.c*tt),te=xe/s.c,pts=[[0,0],[xe,te]].concat(te<tt?[[xe,tt]]:[]).concat(te<tt?[[-xe,tt]]:[]).concat([[-xe,te]]);
   out+=`<polygon points="${pts.map(([x,t])=>fmt(cx+x*ux)+','+fmt(cy-t*uy)).join(' ')}" fill="${C.pale}" stroke="${C.blue}" stroke-width="2"/>`;
   out+=TF(cx+xe*ux-4,cy-te*uy+(te<tt?18:-8),`edge: ${fmt(s.c)} units per unit time`,12.5,C.blue,'end')}
  else{out+=P(`M${cx} ${cy} C${cx-70} ${cy-40} ${cx-200} ${cy-120} ${cx-190} ${cy-200} M${cx} ${cy} C${cx+60} ${cy-60} ${cx+230} ${cy-90} ${cx+180} ${cy-210}`,C.purple,2.2,'none','stroke-dasharray="7 5"');
   out+=TF(cx,cy-226,'edge drawn by judgement',13,C.purple)}
  out+=axes;
  L7_EV.forEach(([x,t],i)=>{const inn=Math.abs(x)<=s.c*t+1e-9,px=cx+x*ux,py=cy-t*uy;
   out+=phys?Ci(px,py,8,inn?C.blue:'#fff',C.blue)+TF(px+11,py+4,inn?'in':'out',12.5,inn?C.blue:C.muted,'start'):Ci(px,py,8,'#fff',C.purple)+TBF(px,py+4,'?',11,C.purple)});
  out+=L7_badge(10,340,'frame');
  if(phys)out+=L7_badge(590,340,'rep','end');
  out+=L7_note(phys?'Toy units. Physics: special relativity, a replicated finding.':'The cognitive cone borrows the picture, not the arithmetic.',374);
  return {svg:out,phase:phys?`With a speed limit of ${fmt(s.c)} units of distance per unit of time, ${inside} of the ${L7_EV.length} events can be reached from here and now. The count is arithmetic: |distance| ≤ speed × time.`:'In the cognitive version there is no speed limit to set and no agreed measure, so whether an event lies inside a system’s cone is a judgement about what the system can sense, model and pursue. That is why the course calls the cognitive light cone a framework for comparison, not a measurement.'};
 },
 three(s,f,X,project){
  const P=project([-4.5,4.5,-2,2,0,3.4]);let svg='';
  const ring=(ox,r,z,col,w,dash)=>{let o='';for(let i=0;i<36;i++){const a=i/36*2*Math.PI,b=(i+1)/36*2*Math.PI;o+=line3([ox+r*Math.cos(a),r*Math.sin(a),z],[ox+r*Math.cos(b),r*Math.sin(b),z],P,col,w,dash?'stroke-dasharray="4 3"':'')}return o};
  // physics cone on the left: radius = c × time; cognitive cone on the right: irregular, drawn by judgement
  for(const z of [.8,1.6,2.4,3.2])svg+=ring(-2.4,Math.min(2,s.c*z/3.2*1.6),z,C.blue,1.6,false);
  for(let i=0;i<8;i++){const a=i/8*2*Math.PI,r=Math.min(2,s.c*1.6);svg+=line3([-2.4,0,0],[-2.4+r*Math.cos(a),r*Math.sin(a),3.2],P,C.blue,1.2)}
  for(const [z,r] of [[.8,.7],[1.6,1.3],[2.4,1.5],[3.2,1.1]])svg+=ring(2.4,r,z,C.purple,1.6,true);
  svg+=line3([-4.5,0,0],[4.5,0,0],P,C.line,1.4)+line3([0,-2,0],[0,2,0],P,C.line,1.4);
  const a=P([-2.4,0,3.5]),b=P([2.4,0,3.6]),o1=P([-2.4,0,0]),o2=P([2.4,0,0]);
  svg+=Ci(o1[0],o1[1],5,C.ink)+Ci(o2[0],o2[1],5,C.ink)+TF(a[0],a[1]-6,'physics: set by c',13,C.blue)+TF(b[0],b[1]-6,'cognitive: by judgement',13,C.purple);
  return {svg:svg+TF(300,30,'Two spatial directions across, time upwards',13,C.muted),caption:'Schematic 3D view: the physics light cone (left), whose width at each time is computed from the speed limit, beside a cognitive light cone (right), whose irregular edge is only illustrative.',title:'Two kinds of cone'};
 }});

/* ===================== Lesson: morphospace-navigation ===================== */
// A toy two-dimensional shape space (0..10 on each axis). The target is the normal shape at (5,5). Rectangles are shapes
// that cannot be passed through. A fixed recipe is a list of moves written for the usual start; a goal-seeker steps
// towards the target each time, turning by 45° steps when a move is blocked. Both are computed step by step.
const L7_MS={tgt:[5,5],start:[1,1],step:.5,max:70};
const L7_OB=[[2.5,4,2,3.5]],L7_WALL=[5.5,6.5,3,8];
const L7_RECIPE=[].concat(range(8).map(()=>[0,.5]),range(8).map(()=>[.5,0]));
const L7_obs=wall=>wall?L7_OB.concat([L7_WALL]):L7_OB;
const L7_bad=(x,y,obs)=>x<0||y<0||x>10||y>10||obs.some(([a,b,c,d])=>x>a-1e-9&&x<b+1e-9&&y>c-1e-9&&y<d+1e-9);
// Recipe: apply the moves in order; stop at the first blocked move. push = {at, dx, dy} applied once.
function L7_recipe(st,obs,push){const pts=[st.slice()];let [x,y]=st,blocked=false;
 L7_RECIPE.forEach((m,i)=>{if(blocked)return;if(push&&i===push.at){x=clamp(x+push.dx,0,10);y=clamp(y+push.dy,0,10);pts.push([x,y])}
  const nx=x+m[0],ny=y+m[1];if(L7_bad(nx,ny,obs)){blocked=true;return}x=nx;y=ny;pts.push([x,y])});
 return {pts,blocked,err:Math.hypot(x-L7_MS.tgt[0],y-L7_MS.tgt[1])}}
function L7_seek(st,obs,push){const pts=[st.slice()];let [x,y]=st,stuck=false,i=0;
 for(;i<L7_MS.max;i++){if(push&&i===push.at){x=clamp(x+push.dx,0,10);y=clamp(y+push.dy,0,10);pts.push([x,y])}
  const dx=L7_MS.tgt[0]-x,dy=L7_MS.tgt[1]-y,d=Math.hypot(dx,dy);if(d<.26&&!(push&&i<push.at))break;
  const a0=Math.atan2(dy,dx),len=Math.min(L7_MS.step,Math.max(d,.01));let moved=false;
  for(const da of [0,45,-45,90,-90,135,-135]){const a=a0+da*Math.PI/180,nx=x+len*Math.cos(a),ny=y+len*Math.sin(a);
   if(!L7_bad(nx,ny,obs)&&!pts.some(p=>Math.hypot(p[0]-nx,p[1]-ny)<.2)){x=nx;y=ny;moved=true;break}}
  if(!moved){stuck=true;break}pts.push([x,y])}
 const err=Math.hypot(x-L7_MS.tgt[0],y-L7_MS.tgt[1]);if(err>.26)stuck=true;
 let len=0;for(let k=1;k<pts.length;k++)len+=Math.hypot(pts[k][0]-pts[k-1][0],pts[k][1]-pts[k-1][1]);
 return {pts,stuck,err,len}}
// Draw the space, obstacles, target and both paths; n = how many points of each path to show.
function L7_space(o){const {x0=60,y0=48,sc=29,obs,rec,seek,n=999,ax=['eye position','jaw position'],start}=o,MX=v=>x0+v*sc,MY=v=>y0+(10-v)*sc;
 let out=R(x0,y0,10*sc,10*sc,'#fff',C.grid,4);
 for(const [a,b,c,d] of obs)out+=R(MX(a),MY(d),(b-a)*sc,(d-c)*sc,C.coralp,C.coral,3,'stroke-dasharray="4 3"');
 out+=Ci(MX(5),MY(5),10,C.greenp,C.green)+TBF(MX(5),MY(5)+4,'★',12,C.green)+TF(MX(5)-14,MY(5)-10,'target',12.5,C.green,'end');
 out+=TF(x0+5*sc,y0+10*sc+18,ax[0]+' →',13,C.muted)+TF(x0-8,y0+10,'↑',13,C.muted,'end')+TF(x0-6,y0+26,ax[1].split(' ')[0],12.5,C.muted,'end')+TF(x0-6,y0+41,ax[1].split(' ').slice(1).join(' '),12.5,C.muted,'end');
 if(rec)out+=L7_poly(rec.pts.slice(0,n).map(p=>[MX(p[0]),MY(p[1])]),C.amber,2.6,'stroke-dasharray="6 4"');
 if(seek)out+=L7_poly(seek.pts.slice(0,n).map(p=>[MX(p[0]),MY(p[1])]),C.purple,2.6);
 const e=(q,col)=>{const p=q.pts[Math.min(n,q.pts.length)-1];return Ci(MX(p[0]),MY(p[1]),6,col,'#fff')};
 if(rec)out+=e(rec,C.amber);if(seek)out+=e(seek,C.purple);
 if(start)out+=Ci(MX(start[0]),MY(start[1]),7,'#fff',C.ink)+TF(MX(start[0]),MY(start[1])+20,'start',12.5,C.ink);
 return out}
SCENE({id:'morphospace-navigation',name:'Same goal, different routes',tag:'Framework or hypothesis · Development as navigation, Fields & Levin 2022',
 definition:'The psychologist William James, in The Principles of Psychology (1890), took the mark of a mind to be reaching a fixed end by varying means: iron filings move towards a magnet along whatever path they are pushed, while a lover blocked by a wall finds another way round. Chris Fields and Michael Levin (2022, Entropy) proposed using competence at navigating a space as a common measure of intelligence across very different systems, where the space can be ordinary space, the space of gene-expression states, or the space of possible body shapes, which they call morphospace. On this view an embryo or a regenerating tissue that reaches the normal shape from unusual starting points is navigating morphospace. This is a framework.',
 example:'In the toy shape space, a fixed recipe written for the usual start works from that start and goes wrong from any other. A goal-seeker that steps towards the target and turns when blocked reaches it from many starts, though not from every one. The lab offers regeneration and the “Picasso tadpoles” of era 4 as cases that look like the second.',
 desc:'A square toy shape space with a target shape, forbidden regions, a start the learner can move, and two computed paths: a fixed recipe and a goal-seeker; tiles give where each ends and how far it is from the target.',
 research:['Fields & Levin (2022). Competency in navigating arbitrary spaces as an invariant for analyzing cognition in diverse embodiments. Entropy 24, 819.','James (1890). The Principles of Psychology, chapter 1 (paraphrased here, not quoted).','Vandenberg, Adams & Levin (2012). Developmental Dynamics 241, 863–878: the “Picasso tadpoles” (era 4). The toy space is written for this course.'],
 dur:12,hint:'Move the start with the two sliders, add a wall, and compare the recipe (dashed) with the goal-seeker (solid). Find a start from which the goal-seeker also fails.',
 init:()=>({sx:2,sy:2,wall:0}),
 watch(p){const k=Math.min(3,Math.floor(p*4)),S=[[2,2],[6,14],[16,12],[20,12]];return {sx:S[k][0],sy:S[k][1],wall:k>=2?1:0,u:p*4-k}},
 ui:[{range:'sx',label:'Start: eye position',min:0,max:20,get:s=>s.sx,act:'sx',show:v=>fmt(v/2)},{range:'sy',label:'Start: jaw position',min:0,max:20,get:s=>s.sy,act:'sy',show:v=>fmt(v/2)},{b:'Wall: on/off',act:'wall'},{b:'Usual start',act:'home'}],
 on:{sx(s,v){s.sx=clamp(Math.round(+v),0,20)},sy(s,v){s.sy=clamp(Math.round(+v),0,20)},wall(s){s.wall=s.wall?0:1},home(s){s.sx=2;s.sy=2}},
 draw(s,f,X){
  const st=[s.sx/2,s.sy/2],obs=L7_obs(s.wall),bad=L7_bad(st[0],st[1],obs);
  let out='';
  if(bad){out+=heading('That start lies inside a forbidden region')+L7_space({obs,start:st});out+=L7_badge(390,318,'frame')+L7_badge(390,344,'model');return {svg:out,phase:'Move the start out of the shaded region.'}}
  const rec=L7_recipe(st,obs),sk=L7_seek(st,obs),n=X&&!X.try&&s.u!==undefined?Math.max(2,Math.round(smooth(clamp(s.u*1.3,0,1))*L7_MS.max)):999;
  out+=heading(rec.err<.26&&!sk.stuck?'From the usual start both work':!sk.stuck?'The recipe misses; the goal-seeker arrives':rec.err<.26?'Only the recipe arrives':'Both fail from here');
  out+=L7_space({obs,rec,seek:sk,n,start:st});
  out+=TBF(390,74,'Fixed recipe',13,C.amber,'start')+TF(390,92,`${L7_RECIPE.length} moves written for`,12.5,C.muted,'start')+TF(390,108,'the usual start',12.5,C.muted,'start');
  out+=L7_tile(390,118,200,'Recipe: distance from target',rec.blocked?'blocked':L7_n(rec.err,1),C.amber);
  out+=TBF(390,196,'Goal-seeker',13,C.purple,'start')+TF(390,214,'steps towards the target,',12.5,C.muted,'start')+TF(390,230,'turns when blocked',12.5,C.muted,'start');
  out+=L7_tile(390,240,200,'Goal-seeker: distance',sk.stuck?'stuck at '+L7_n(sk.err,1):L7_n(sk.err,1),C.purple);
  out+=TF(390,306,sk.stuck?'':`route length ${L7_n(sk.len,1)} units`,12.5,C.muted,'start');
  out+=L7_badge(390,318,'frame')+L7_badge(390,344,'model');
  return {svg:out,phase:`From a start at (${fmt(st[0])}, ${fmt(st[1])}) the recipe ${rec.blocked?'runs into a forbidden region or the edge of the space':rec.err<.26?'reaches the target':'ends '+L7_n(rec.err,1)+' units from the target'}, and the goal-seeker ${sk.stuck?'gets stuck '+L7_n(sk.err,1)+' units away: turning by fixed steps is not enough here':'arrives after a route of '+L7_n(sk.len,1)+' units'}. The toy is an analogy for the framework; real morphogenesis has no single walker.`};
 }});

// Scene 2: a push on the way. Both walkers start at the usual start; at a chosen step the shape is knocked sideways.
SCENE({id:'morphospace-navigation-perturb',name:'Knocked off course on the way',tag:'Framework or hypothesis · Error correction, and what else could explain it',
 definition:'A stronger test of goal-directedness than a new start is a disturbance part-way. A fixed sequence knocked sideways carries on from wherever it lands and ends in the wrong place; a process that compares where it is with where it should be can correct. The lab argues that regenerating planarians and remodelling tadpole faces behave like the second. Critics and the lab itself note that error correction does not by itself show cognition: simple local rules, such as tissues pushing until they meet, or growth that stops at a mechanical limit, can also correct errors. Telling these apart needs experiments that change the target, not only the start.',
 example:'Knock the shape in the toy and see the recipe’s final error grow with the push, while the goal-seeker’s stays near zero unless the push lands it somewhere it cannot escape.',
 desc:'The toy shape space with both walkers starting from the usual start; a push of chosen size and timing knocks each one sideways once, and tiles compare their final distance from the target.',
 research:['Fields & Levin (2022). Entropy 24, 819.','Levin (2022). Frontiers in Systems Neuroscience 16, 768201 (regeneration as goal-directed).','Toy walkers written for this course.'],
 dur:12,hint:'Set the push size and the step at which it lands, and compare final errors. Then try a push that lands the shape in or beside the shaded forbidden square.',
 init:()=>({dx:4,dy:-2,at:6}),
 watch(p){return {dx:Math.round(lerp(0,6,smooth(clamp(p*1.25,0,1)))),dy:-2,at:6}},
 ui:[{range:'dx',label:'Push across (eye)',min:-6,max:6,get:s=>s.dx,act:'dx',show:v=>fmt(v/2)},{range:'dy',label:'Push up (jaw)',min:-6,max:6,get:s=>s.dy,act:'dy',show:v=>fmt(v/2)},{range:'at',label:'Push at step',min:1,max:14,get:s=>s.at,act:'at'}],
 on:{dx(s,v){s.dx=clamp(Math.round(+v),-6,6)},dy(s,v){s.dy=clamp(Math.round(+v),-6,6)},at(s,v){s.at=clamp(Math.round(+v),1,14)}},
 draw(s){
  const obs=L7_obs(0),push={at:s.at,dx:s.dx/2,dy:s.dy/2},rec=L7_recipe([1,1],obs,push),sk=L7_seek([1,1],obs,push);
  let out=heading(s.dx===0&&s.dy===0?'No push: both reach the target':rec.err<.26?'The push happened to cancel out':'The recipe carries the error to the end');
  out+=L7_space({obs,rec,seek:sk,start:[1,1]});
  out+=L7_tile(390,70,200,'Push size',L7_n(Math.hypot(push.dx,push.dy),1)+' units at step '+s.at,C.ink);
  out+=L7_tile(390,140,200,'Recipe: final distance',rec.blocked?'blocked':L7_n(rec.err,1),C.amber);
  out+=L7_tile(390,210,200,'Goal-seeker: final distance',L7_n(sk.err,1),C.purple);
  out+=L7_lines(390,272,['Error correction is not','proof of a mind: local','rules can correct too.'],12.5,C.muted,'start',16);
  out+=L7_badge(390,318,'frame')+L7_badge(390,344,'model');
  return {svg:out,phase:`A push of ${L7_n(Math.hypot(push.dx,push.dy),1)} units at step ${s.at}: the recipe ${rec.blocked?'is pushed into a forbidden region and stops':'ends '+L7_n(rec.err,1)+' units from the target'}; the goal-seeker ends ${L7_n(sk.err,1)} away. Correction like this is what the framework looks for; other mechanisms can also produce it.`};
 }});

// Scene 3: one measure, many spaces. The same goal-seeker run in the same toy geometry, with the axes renamed for each
// kind of space Fields and Levin discuss. Each example offered for that space keeps its own evidence label.
const L7_SPACES=[
 {nm:'Ordinary space',ax:['position across','position along'],ex:'A bacterium swims up an attractant gradient.',lab:'rep',who:'Macnab & Koshland (1972)'},
 {nm:'Gene-expression space',ax:['gene A activity','gene B activity'],ex:'Models of gene networks shift to new stable states.',lab:'single',who:'Biswas et al. (2021), models'},
 {nm:'Physiological space',ax:['channel 1 strength','channel 2 strength'],ex:'Planarians in barium regrow heads that tolerate it.',lab:'single',who:'Emmons-Bell et al. (2019), era 3'},
 {nm:'Anatomical space',ax:['eye position','jaw position'],ex:'Displaced tadpole face organs move nearer normal.',lab:'single',who:'Vandenberg et al. (2012), era 4'}];
SCENE({id:'morphospace-navigation-spaces',name:'One measure, many spaces',tag:'Framework or hypothesis · Competency as an invariant',
 definition:'Fields and Levin’s proposal is that the same question, how well does a system reach its goal from new starts and around new obstacles, can be asked in any space a system acts in. A bacterium moves in ordinary space; a cell’s gene expression moves through a space of possible states; a tissue’s ion channels can change until its voltage returns to normal; an embryo’s anatomy moves through morphospace. They link this to the idea of minimising variational free energy, from work on active inference. The framework claims that competence measured this way is comparable across these cases. The examples are findings of different strengths.',
 example:'Below, one toy goal-seeker runs on one geometry four times; only the axis names change. That is the framework’s point, and also its risk: renaming axes is easy, and showing that a real system navigates a space needs experiments in that space.',
 desc:'The toy shape space with the goal-seeker’s computed path; the learner switches between four kinds of space and the axis names change while the path does not; a panel gives the example the lab offers for each space and its evidence label.',
 research:['Fields & Levin (2022). Competency in navigating arbitrary spaces as an invariant for analyzing cognition in diverse embodiments. Entropy 24, 819.','Examples: Macnab & Koshland (1972), PNAS 69; Biswas, Manicka, Hoel & Levin (2021), iScience 24, 102131; Emmons-Bell et al. (2019), iScience 22 (era 3); Vandenberg, Adams & Levin (2012), Developmental Dynamics 241 (era 4).','Toy walker written for this course.'],
 dur:12,hint:'Switch between the four spaces. The path is computed once; notice what changes and what does not, then read each example’s label.',
 init:()=>({sp:3}),
 watch(p){return {sp:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:[[0,'Ordinary'],[1,'Gene expression'],[2,'Physiological'],[3,'Anatomical']],label:'Space',get:s=>s.sp,act:'sp'}],
 on:{sp(s,v){s.sp=clamp(Math.round(+v),0,3)}},
 draw(s){
  const c=L7_SPACES[s.sp],obs=L7_obs(1),sk=L7_seek([8,6],obs);
  let out=heading(c.nm+': the same path, renamed');
  out+=L7_space({obs,seek:sk,start:[8,6],ax:c.ax});
  out+=L7_tile(390,60,200,'Goal-seeker: route length',L7_n(sk.len,1)+' units',C.purple);
  out+=R(390,124,200,170,'#fff',C.grid,8)+TBF(400,144,'Example offered',13,C.ink,'start');
  const words=c.ex.split(' '),lines=[];let cur='';for(const w of words){if((cur+' '+w).trim().length>26){lines.push(cur.trim());cur=w}else cur+=' '+w}lines.push(cur.trim());
  out+=L7_lines(400,166,lines,13,C.ink,'start',17)+L7_lines(400,170+lines.length*17,c.who.split(', '),12,C.muted,'start',15);
  out+=L7_badge(400,262,c.lab);
  out+=L7_badge(390,306,'frame')+L7_badge(390,332,'model');
  return {svg:out,phase:`${c.nm}. The toy path is ${L7_n(sk.len,1)} units long whatever the axes are called. The example the framework points to here: ${c.ex} (${c.who}; ${L7_LABELS[c.lab][0].toLowerCase()}).`};
 }});

/* ===================== Lesson: gene-network-learning ===================== */
// A toy gene network written for this course (not one of the published models). Two input signals: U (the
// "unconditioned" stimulus, which drives the response gene R directly) and S (a neutral signal). A memory gene M is
// switched on only when U and S are present together, and then keeps itself on by positive feedback (bistable:
// dM/dt = b·U·S + s·U + g·M²/(K²+M²) − M). R follows a Hill function of U + w·S·M, plus any direct S→R edge.
// Euler integration, dt = 0.05; each phase lasts L time units.
const L7_GP={b:.15,g:1.6,K:.6,w:1,L:5,dt:.05};
const L7_PH={S:['signal alone',C.blue],U:['stimulus alone',C.amber],P:['both together',C.purple],O:['rest',C.grid]};
const L7_hill=x=>x*x/(.25+x*x);
function L7_grn(phases,o={}){const {sens=0,edge=0,len=L7_GP.L}=o;let M=0,R=0;const tr=[],per=[];
 phases.forEach((ph,i)=>{const U=ph==='U'||ph==='P'?1:0,S=ph==='S'||ph==='P'?1:0;let peak=0;const L=ph==='P'?len:L7_GP.L;
  for(let t=0;t<L;t+=L7_GP.dt){M+=L7_GP.dt*(L7_GP.b*U*S+sens*U+L7_GP.g*M*M/(L7_GP.K*L7_GP.K+M*M)-M);
   const Rt=L7_hill(U+L7_GP.w*S*M+edge*S);R+=L7_GP.dt*4*(Rt-R);peak=Math.max(peak,R);tr.push([i,t/L,R,M])}
  per.push({ph,peak,M})});
 return {tr,per}}
// The response to the signal alone before any pairing, and in the last signal-alone test.
function L7_tests(per){const s=per.map((p,i)=>({...p,i})).filter(p=>p.ph==='S'),firstP=per.findIndex(p=>p.ph==='P');
 const before=s.find(p=>firstP<0||p.i<firstP),after=[...s].reverse().find(p=>firstP>=0&&p.i>firstP);return {before,after}}
function L7_timeline(G,phases,x0,y0,w,h){const n=phases.length||1,pw=w/n,RY=v=>y0+h-v*h,MY=v=>y0+h-v/1.5*h;
 let out=R(x0,y0,w,h,'#fff',C.grid,4);
 phases.forEach((ph,i)=>{const [lab,col]=L7_PH[ph];out+=R(x0+i*pw+1,y0+h+6,pw-2,20,col===C.grid?'#f1f3f4':col,'none',4,col===C.grid?'':'fill-opacity=".22"')+TF(x0+i*pw+pw/2,y0+h+21,ph==='S'?'signal':ph==='U'?'stimulus':ph==='P'?'pair':'rest',12,C.ink)});
 const pts=G.tr.map(([i,u,r])=>[x0+(i+u)*pw,RY(r)]),mp=G.tr.map(([i,u,r,m])=>[x0+(i+u)*pw,MY(m)]);
 out+=L7_poly(mp,C.purple,1.8,'stroke-dasharray="5 4"')+L7_poly(pts,C.coral,2.6);
 out+=TF(x0+6,y0+16,'response gene R (solid)',12.5,C.coral,'start')+TF(x0+w-6,y0+16,'memory gene M (dashed)',12.5,C.purple,'end');
 return out}
const L7_GRN_WATCH=['S','U','P','O','S'];
SCENE({id:'gene-network-learning',name:'Conditioning a toy gene network',tag:'Single-lab finding · Memory in models of gene networks, 2021',
 definition:'Surama Biswas, Santosh Manicka, Erik Hoel and Michael Levin (2021, iScience) took published computer models of real gene regulatory networks and ran training-style protocols on them: give one input, give another, give both together, then test. They reported several kinds of memory-like behaviour, including one resembling Pavlovian conditioning, in which a neutral input comes to trigger a response after being paired with one that already does. These are simulations of models; they show what the network equations can do, not what living cells were seen to do.',
 example:'The toy network below, written for this course, has a memory gene that switches on only when the two inputs arrive together and then keeps itself on. Test the signal alone, pair it with the stimulus, rest, and test again: the computed response to the signal alone changes after pairing.',
 desc:'A timeline of phases the learner builds (signal alone, stimulus alone, both together, rest) with computed traces of a response gene and a memory gene, and tiles comparing the response to the signal alone before and after pairing.',
 research:['Biswas, Manicka, Hoel & Levin (2021). Gene regulatory networks exhibit several kinds of memory: quantification of memory in biological and random transcriptional networks. iScience 24, 102131.','Mind In Motion, classical conditioning: Pavlov’s protocol in animals.','Toy network written for this course: four genes’ worth of equations, not a published model.'],
 dur:12,hint:'Add phases in order: test the signal alone, pair it with the stimulus, rest, then test the signal alone again. Clear and try the pairing first, or leave it out.',
 init:()=>({ph:['S','P','O','S']}),
 watch(p){return {ph:L7_GRN_WATCH.slice(0,1+Math.min(4,Math.floor(p*5)))}},
 ui:[{b:'+ Signal alone',act:'S'},{b:'+ Stimulus alone',act:'U'},{b:'+ Both together',act:'P'},{b:'+ Rest',act:'O'},{b:'Clear',act:'clear'}],
 on:{S(s){if(s.ph.length<8)s.ph=s.ph.concat(['S'])},U(s){if(s.ph.length<8)s.ph=s.ph.concat(['U'])},P(s){if(s.ph.length<8)s.ph=s.ph.concat(['P'])},O(s){if(s.ph.length<8)s.ph=s.ph.concat(['O'])},clear(s){s.ph=[]}},
 draw(s){
  const G=L7_grn(s.ph),T=L7_tests(G.per),paired=s.ph.includes('P');
  let out=heading(!s.ph.length?'Build a protocol with the buttons':T.after&&T.after.peak>.5?'After pairing, the signal alone works':paired?'Paired: now test the signal alone':'No pairing yet');
  if(s.ph.length)out+=L7_timeline(G,s.ph,40,66,520,176);else out+=R(40,66,520,176,'#fff',C.grid,4)+TF(300,156,'empty protocol',14,C.muted);
  out+=L7_tile(40,284,165,'Signal alone, before',T.before?L7_n(T.before.peak,2):'not tested',C.blue)+L7_tile(217,284,165,'Signal alone, after',T.after?L7_n(T.after.peak,2):'not tested',C.purple)+L7_tile(394,284,166,'Reported in the paper','2 of 35 networks',C.ink);
  out+=TF(477,346,'showed associative memory',12,C.muted);
  out+=L7_badge(10,40,'single')+L7_badge(590,40,'model','end');
  out+=L7_note('Peak response on a 0–1 scale, computed. The paper’s count is from Biswas et al. (2021).',366);
  return {svg:out,phase:!s.ph.length?'Add phases to build a training protocol.':T.after?`Before pairing the signal alone gave a peak response of ${L7_n(T.before?T.before.peak:0,2)}; after pairing, ${L7_n(T.after.peak,2)}. The memory gene ended at ${L7_n(G.per[G.per.length-1].M,2)} and stayed on through the rest. In the paper, 2 of 35 published network models showed this kind of associative memory.`:
   `${paired?'The pair has switched the memory gene to '+L7_n(G.per[s.ph.lastIndexOf('P')].M,2)+'. Add a test of the signal alone.':'Without a pairing phase the memory gene stays off, so the signal alone never triggers the response.'}`};
 }});

// Scene 2: controls. The same number of exposures, paired or unpaired, against stimulus only. A "sensitisable" variant lets
// the stimulus alone nudge the memory gene, so an increased response no longer needs pairing.
const L7_PROT={paired:['S','P','P','O','S'],unpaired:['S','S','U','U','O','S'],stim:['S','U','U','O','S']};
SCENE({id:'gene-network-learning-controls',name:'Is it really associative?',tag:'Simplified model · Why conditioning needs controls',
 definition:'In animal learning, a bigger response to a signal after training is not enough to show association. The response might grow because the stimulus alone made the system more responsive to everything (sensitisation), or because repeated exposure to the signal changed it. The standard controls give the same signals unpaired, or the stimulus alone, and ask whether only the paired group changed. Biswas and colleagues distinguished several memory types in their models for the same reason. The same logic applies to any claim of learning in cells.',
 example:'In the toy network as built, only the paired protocol raises the response to the signal alone, which is what association predicts. Switch on the sensitisable version, in which the stimulus by itself nudges the memory gene, and the unpaired control rises too: the increase is no longer evidence of association.',
 desc:'Three bars giving the computed response to the signal alone after a paired protocol, an unpaired protocol and a stimulus-only protocol, with a switch that makes the toy network sensitisable and a slider for the length of each pairing.',
 research:['Biswas, Manicka, Hoel & Levin (2021). iScience 24, 102131 (several memory types in network models).','Gershman, Balbi, Gallistel & Gunawardena (2021). Reconsidering the evidence for learning in single cells. eLife 10, e61907 (the long argument over controls in single-cell learning).','Toy network written for this course.'],
 dur:12,hint:'Change the pairing length and switch sensitisation on and off. Ask, each time, whether the paired bar alone stands out.',
 init:()=>({len:3,sens:0}),
 watch(p){return {len:3,sens:p>.55?1:0}},
 ui:[{range:'len',label:'Length of each pairing',min:1,max:8,get:s=>s.len,act:'len',show:v=>fmt(v/2)+' time units'},{b:'Sensitisable version: on/off',act:'sens'}],
 on:{len(s,v){s.len=clamp(Math.round(+v),1,8)},sens(s){s.sens=s.sens?0:1}},
 draw(s){
  const o={len:s.len/2,sens:s.sens?.1:0},res={};
  for(const k in L7_PROT){const G=L7_grn(L7_PROT[k],o),T=L7_tests(G.per);const lastS=G.per[G.per.length-1];res[k]={pre:G.per[0].peak,post:lastS.peak}}
  const pa=res.paired.post,un=res.unpaired.post,st=res.stim.post,assoc=pa>.5&&un<.3&&st<.3;
  let out=heading(assoc?'Only the paired protocol changed the response':pa<.3?'This pairing was too short to switch the memory on':'The controls rose too: not evidence of association');
  const bx=[110,270,430],nm=['paired','unpaired','stimulus only'],vals=[pa,un,st],cols=[C.purple,C.blue,C.amber],y0=270,H=180;
  out+=L(70,y0,540,y0,C.line,2);for(const v of [0,.5,1])out+=L(66,y0-v*H,540,y0-v*H,C.grid,1)+TF(60,y0-v*H+4,fmt(v),12.5,C.muted,'end');
  vals.forEach((v,i)=>{out+=R(bx[i]-40,y0-v*H,80,v*H,cols[i],'none',4,'fill-opacity=".75"')+TBF(bx[i],y0-v*H-8,L7_n(v,2),14,cols[i])+TF(bx[i],y0+18,nm[i],13,C.ink)});
  out+=TF(70,78,'response to the signal alone, after each protocol',12.5,C.muted,'start');
  out+=TF(300,316,'Each protocol gives the signal and the stimulus; only the first gives them together.',12.5,C.muted);
  out+=TF(300,336,s.sens?'Sensitisable: the stimulus alone nudges the memory gene.':'As built: only coincidence drives the memory gene.',13,s.sens?C.coral:C.ink);
  out+=L7_badge(10,40,'model')+L7_badge(590,40,'single','end');
  out+=L7_note('Peak responses on a 0–1 scale, computed by the toy network.',366);
  return {svg:out,phase:`Response to the signal alone after the paired protocol: ${L7_n(pa,2)}; unpaired: ${L7_n(un,2)}; stimulus only: ${L7_n(st,2)}. ${assoc?'Only pairing changed it, which is the signature of association.':pa<.3?'The memory gene never crossed its switching point, so nothing was learned.':'The controls changed as well, so the rise could come from sensitisation, not association.'}`};
 }});

// Scene 3: train or rewire? Two ways to make the toy respond to the signal: add a direct edge from the signal to the
// response gene (a genetic change), or pair the inputs (a pattern of stimulation that leaves the wiring as it is).
SCENE({id:'gene-network-learning-cells',name:'Train it or rewire it, and the test in cells',tag:'Criticism and debate · Learning in real cells is an open question',
 definition:'Biswas, Wesley Clawson and Levin (published in International Journal of Molecular Sciences, volume 24, dated 2023) extended the analysis to continuous models of gene and protein pathways, reported several kinds of memory in them, and found that memory was fairly robust to noise. They proposed that patterns of stimulation, rather than rewiring the network, could be used to change a pathway’s behaviour, for example to abolish a model’s drug-resistance-like response. Whether living cells show associative learning in their gene networks is an open experimental question. For single cells as whole organisms the argument is old: Beatrice Gelber reported conditioning in Paramecium in the mid-twentieth century, and Gershman, Balbi, Gallistel and Gunawardena (2021) argued that the usual dismissal of her results deserves a second look.',
 example:'In the toy, adding a direct edge from the signal to the response gene works at once, but it is a change to the genes. Pairing the inputs works too, if long enough, and leaves the wiring untouched. These are model results about a toy; nothing here is a treatment or a claim about any drug.',
 desc:'Two routes to the same change in a toy network: a slider for the strength of a new direct edge, and a slider for the length of a pairing; tiles give the computed response to the signal alone for each route.',
 research:['Biswas, Clawson & Levin (2023). Learning in transcriptional network models: computational discovery of pathway-level memory and effective interventions. International Journal of Molecular Sciences 24, 285.','Gershman, Balbi, Gallistel & Gunawardena (2021). Reconsidering the evidence for learning in single cells. eLife 10, e61907.','Toy network written for this course.'],
 dur:12,hint:'Use one route at a time: strengthen the new edge, or lengthen the pairing, and compare the response to the signal alone. Then read the open question in the text.',
 init:()=>({edge:0,len:6}),
 watch(p){return p<.5?{edge:Math.round(p*2*6),len:0}:{edge:0,len:Math.round((p-.5)*2*8)}},
 ui:[{range:'edge',label:'Rewire: new signal→response edge',min:0,max:6,get:s=>s.edge,act:'edge',show:v=>fmt(v/4)},{range:'len',label:'Train: pairing length',min:0,max:8,get:s=>s.len,act:'len',show:v=>fmt(v/2)}],
 on:{edge(s,v){s.edge=clamp(Math.round(+v),0,6)},len(s,v){s.len=clamp(Math.round(+v),0,8)}},
 draw(s){
  const prot=s.len>0?['S','P','O','S']:['S','O','S'],G=L7_grn(prot,{edge:s.edge/4,len:s.len/2}),pre=G.per[0].peak,post=G.per[G.per.length-1].peak,Mend=G.per[G.per.length-1].M;
  let out=heading(post>.5?(s.edge>0&&s.len===0?'Rewired: it responds, from the start':s.len>0&&s.edge===0?'Trained: same wiring, new response':'Both routes at once'):'The signal alone still does little');
  // network diagram
  const nd={S:[90,110],U:[90,230],M:[240,170],R:[400,170]};
  out+=arrowR(nd.S,nd.M,22,24,C.purple)+arrowR(nd.U,nd.M,22,24,C.purple)+curveArrow(nd.U[0]+22,nd.U[1]+4,nd.R[0]-10,nd.R[1]+22,46,C.amber,2.5)+arrowR(nd.M,nd.R,22,24,C.purple);
  out+=curveArrow(nd.M[0]-14,nd.M[1]-22,nd.M[0]+14,nd.M[1]-22,-44,C.purple,2)+TF(nd.M[0]+30,nd.M[1]-46,'keeps itself on',12.5,C.purple,'start');
  if(s.edge>0)out+=curveArrow(nd.S[0]+22,nd.S[1]-8,nd.R[0]-14,nd.R[1]-20,-50,C.coral,1.5+s.edge*.7)+TF(250,64,'new edge (rewired)',12.5,C.coral);
  for(const [k,[x,y]] of Object.entries(nd))out+=Ci(x,y,22,'#fff',k==='M'?C.purple:k==='R'?C.coral:C.ink)+TBF(x,y+5,k,15,C.ink);
  out+=TF(90,148,'signal',12.5,C.muted)+TF(90,268,'stimulus',12.5,C.muted)+TF(240,208,'memory',12.5,C.muted)+TF(400,138,'response',12.5,C.muted);
  out+=L7_tile(450,92,140,'Before (signal alone)',L7_n(pre,2),C.blue)+L7_tile(450,152,140,'After (signal alone)',L7_n(post,2),C.coral)+L7_tile(450,212,140,'Memory gene, end',L7_n(Mend,2),C.purple);
  out+=R(20,282,560,62,C.coralp,'none',8)+L7_lines(32,302,['Open question: do living cells learn this way? Tests in cells are at an early','stage, and single-cell conditioning has been argued over for decades.'],13,C.ink,'start',18);
  out+=L7_badge(10,26,'debate')+L7_badges(590,26,['model'],'end');
  out+=L7_note('Peak responses on a 0–1 scale, computed by the toy network. Not a treatment model.',366);
  return {svg:out,phase:`With the new edge at ${fmt(s.edge/4)} and a pairing of ${fmt(s.len/2)} time units, the signal alone gives ${L7_n(pre,2)} at first and ${L7_n(post,2)} at the end. ${s.edge>0?'The edge is a change to the wiring itself.':s.len>0?'The wiring is unchanged; only the history of stimulation differs.':'Neither route is in use.'} In living cells, whether gene networks learn by association remains to be shown by experiment.`};
 }});

/* ===================== Lesson: cognition-debate ===================== */
// Scene 1: where does cognition begin? Five criteria from loose to strict; each system is marked yes, no or open
// (not shown, or disputed) for each. A system counts under a definition if it is "yes" on every criterion up to it.
const L7_CRIT=['responds to its surroundings','behaviour depends on its recent past','lasting change with experience','learns by association','states with conceptual content'];
const L7_CRS=['responds','recent past','lasting change','association','concepts'];
const L7_DSYS=[['thermostat',['y','n','n','n','n']],['E. coli',['y','y','o','o','o']],['Stentor',['y','y','o','o','o']],['Physarum',['y','o','o','o','o']],['planarian',['y','y','y','o','o']],['dog',['y','y','y','y','o']]];
const L7_DEFS=[null,'close to Baluška & Levin’s broad use (2016)',null,null,'close to Fred Adams’s requirement (2018)'];
SCENE({id:'cognition-debate',name:'Where does cognition begin?',tag:'Criticism and debate · The argument over definitions',
 definition:'There is no agreed definition of cognition, and much of the argument about basal cognition is about where to draw the line. At one end, Baluška and Levin (2016) used the word for acquiring, storing, processing and using information at any level of biology. At the other, the philosopher Fred Adams, in “Cognition wars” (Studies in History and Philosophy of Science, 2018), argued that plants and bacteria respond to the here and now in hard-wired, inflexible ways, that cognition needs states with conceptual content, and that scientists who call such behaviour cognitive must mean something else by the word. Miguel Segundo-Ortin and Paco Calvo replied (2019) that the evidence shows plant behaviour to be like animal behaviour in many ways, while agreeing with Adams that fixed reactions to present stimuli are of no interest to cognitive science.',
 example:'Slide the line from loose to strict and count which systems qualify. The marks are the course’s summary of this era’s evidence; “open” means not shown or disputed. Much of the disagreement is not about the observations but about what the word should cover.',
 desc:'A table of six systems against five criteria from loose to strict, each marked yes, no or open; a slider sets where cognition begins, and the systems that meet every criterion up to that line are highlighted and counted.',
 research:['Adams (2018). Cognition wars. Studies in History and Philosophy of Science 68.','Segundo-Ortin & Calvo (2019). Are plants cognitive? A reply to Adams. Studies in History and Philosophy of Science 73.','Baluška & Levin (2016). On having no head: cognition throughout biological systems. Frontiers in Psychology 7, 902.'],
 dur:12,hint:'Move the line from the loosest criterion to the strictest and watch which systems still count. Then ask which marks are about evidence and which are about the definition.',
 init:()=>({cut:2}),
 watch(p){return {cut:Math.min(5,1+Math.floor(p*5))}},
 ui:[{range:'cut',label:'Cognition needs criteria 1 to',min:1,max:5,get:s=>s.cut,act:'cut',show:v=>v+': '+L7_CRS[v-1]}],
 on:{cut(s,v){s.cut=clamp(Math.round(+v),1,5)},col(s,i){i=+i;if(i>=0&&i<5)s.cut=i+1;return 'keep'}},
 draw(s,f,X){
  const qual=L7_DSYS.filter(([,m])=>m.slice(0,s.cut).every(v=>v==='y'));
  let out=heading(`${qual.length} of ${L7_DSYS.length} systems count`);
  const x0=130,cw=90,y0=96,rh=32;
  L7_CRS.forEach((c,i)=>{const x=x0+i*cw,on=i<s.cut;
   out+=hit(X,'col',i,`Criterion ${i+1}: ${L7_CRIT[i]}. Press to draw the line here.`,R(x+3,50,cw-6,40,on?C.coralp:'#fff',on?C.coral:C.grid,6)+TF(x+cw/2,66,(i+1)+'.',12.5,C.muted)+TF(x+cw/2,83,c,12.5,on?C.coral:C.ink))});
  L7_DSYS.forEach(([nm,m],r)=>{const y=y0+r*rh,ok=qual.some(q=>q[0]===nm);
   out+=R(14,y,x0+5*cw-14,rh-4,ok?C.greenp:'#fff','none',5)+TF(22,y+19,nm,13,ok?C.green:C.ink,'start');
   m.forEach((v,i)=>{const x=x0+i*cw+cw/2;out+=v==='y'?TBF(x,y+19,'yes',12.5,C.green):v==='n'?TF(x,y+19,'no',12.5,C.muted):TF(x,y+19,'open',12.5,C.amber)})});
  out+=L(x0+s.cut*cw,48,x0+s.cut*cw,y0+6*rh,C.coral,3,'stroke-dasharray="6 4"');
  const lab=L7_DEFS[s.cut-1];
  out+=R(14,y0+6*rh+8,572,52,C.pale,'none',8)+TF(24,y0+6*rh+28,`Line after criterion ${s.cut}: ${L7_CRIT[s.cut-1]}.`,13,C.ink,'start')+TF(24,y0+6*rh+48,lab?'This line is '+lab+'.':'Counts: '+(qual.map(q=>q[0]).join(', ')||'none')+'.',13,lab?C.coral:C.muted,'start');
  out+=L7_badge(590,22,'debate','end');
  out+=L7_note('Marks are the course’s summary of this era’s evidence. Open: not shown, or disputed.',368);
  return {svg:out,phase:`With the line after “${L7_CRIT[s.cut-1]}”, ${qual.length} of ${L7_DSYS.length} systems count: ${qual.map(q=>q[0]).join(', ')||'none'}. ${lab?'This is '+lab+'. ':''}Moving the line changes no observation; it changes what the word covers. That is why both sides can accept the same data and still disagree.`};
 }});

// Scene 2: the parallel argument over "plant neurobiology". The learner sorts each argument as mainly about evidence or
// mainly about words; the course's reading is shown after the choice, with the reason. Not a test: the reading is given.
const L7_PLA=[
 {t:['Plants have no neurons, synapses','or brain.'],who:'Alpi et al. (2007)',k:'fact',why:'An anatomical fact that no one in the exchange disputes.'},
 {t:['“Plant neurobiology” adds nothing','to plant physiology and signalling.'],who:'Alpi et al. (2007)',k:'word',why:'A judgement on whether a name and its framing help research.'},
 {t:['Replies defended the approach','and the value of its metaphors.'],who:'Brenner et al.; Trewavas (2007)',k:'word',why:'Titles: “the gain is more than the name”; “all metaphors have value”.'},
 {t:['Plants and bacteria only react,','hard-wired, to the here and now.'],who:'Adams (2018)',k:'fact',why:'Partly testable: flexible, history-dependent behaviour would count against it.'},
 {t:['Cognition needs states with','conceptual content.'],who:'Adams (2018)',k:'word',why:'A definition; evidence alone cannot settle it.'},
 {t:['Plant behaviour is like animal','behaviour in many ways.'],who:'Segundo-Ortin & Calvo (2019)',k:'fact',why:'An empirical claim, argued from published plant studies.'}];
SCENE({id:'cognition-debate-plants',name:'A parallel argument: plant neurobiology',tag:'Criticism and debate · Words, evidence, or both?',
 definition:'Basal cognition is not the first field to meet this argument. In 2007 a large group of plant scientists led by Amedeo Alpi wrote to Trends in Plant Science, under the title “Plant neurobiology: no brain, no gain?”, that there is no evidence for neurons, synapses or a brain in plants and that the term “plant neurobiology” adds nothing to plant physiology, cell biology and signalling research. Replies in the same journal, from Eric Brenner and colleagues (“the gain is more than the name”) and from Anthony Trewavas (“all metaphors have value”), defended the approach. The exchange continued into the 2018–2019 papers by Adams and by Segundo-Ortin and Calvo.',
 example:'Sorting the arguments shows two kinds of disagreement mixed together: about what plants and cells do, which experiments can settle, and about which words are useful, which they cannot. The basal-cognition debate has the same mixture. Tap a card to choose, then read the course’s reading.',
 desc:'Six cards with arguments from the plant neurobiology exchange and its sequel; the learner marks each as mainly about evidence or mainly about words, and the course’s reading appears with a reason.',
 research:['Alpi et al. (2007). Plant neurobiology: no brain, no gain? Trends in Plant Science 12, 135–136.','Brenner, Stahlberg, Mancuso, Baluška & Van Volkenburgh (2007). Plant neurobiology: the gain is more than the name. Trends in Plant Science 12, 285–286; Trewavas (2007). Plant neurobiology – all metaphors have value. Trends in Plant Science 12, 231–233.','Adams (2018), Studies in History and Philosophy of Science 68; Segundo-Ortin & Calvo (2019), same journal, 73.'],
 dur:12,hint:'Tap a card to mark it as mainly about evidence, then again for mainly about words. The course’s reading appears with its reason; you may disagree.',
 init:()=>({pick:['','','','','',''],show:-1}),
 watch(p){const k=Math.min(6,Math.floor(p*7));return {pick:L7_PLA.map((c,i)=>i<k?c.k:''),show:k-1}},
 ui:[{b:'Show the course’s readings',act:'all'},{b:'Clear',act:'clear'}],
 on:{card(s,i){i=+i;if(!(i>=0&&i<6))return 'keep';const o=['','fact','word'];s.pick=s.pick.slice();s.pick[i]=o[(o.indexOf(s.pick[i])+1)%3];s.show=i;return 'keep'},all(s){s.pick=L7_PLA.map(c=>c.k);s.show=-1},clear(s){s.pick=['','','','','',''];s.show=-1}},
 draw(s,f,X){
  const nm={fact:['about evidence',C.green],word:['about words',C.purple],'':['tap to sort',C.muted]};
  let out=heading('Evidence or words?');
  L7_PLA.forEach((c,i)=>{const col=i%2,row=(i/2)|0,x=20+col*286,y=44+row*94,pk=s.pick[i],[lab,ink]=nm[pk];
   let inner=R(x,y,274,86,pk?'#fff':'#f6f9fb',pk?ink:C.grid,8)+L7_lines(x+12,y+20,c.t,13,C.ink,'start',17)+TF(x+12,y+56,c.who,12.5,C.muted,'start')+TBF(x+12,y+76,lab,13,ink,'start');
   if(pk)inner+=TF(x+262,y+76,pk===c.k?'course agrees':'course: '+nm[c.k][0],12,C.muted,'end');
   out+=hit(X,'card',i,`${c.t.join(' ')} (${c.who}). Now: ${lab}. Press to change.`,inner)});
  const sh=s.show>=0?L7_PLA[s.show]:null,done=s.pick.filter(Boolean).length;
  out+=R(20,330,560,38,C.pale,'none',8)+TF(30,354,sh?sh.why:`${done} of 6 sorted. Most of the heat is in the cards about words.`,13,C.ink,'start');
  out+=L7_badge(590,22,'debate','end');
  return {svg:out,phase:sh?`${sh.who}: ${sh.t.join(' ')} The course reads this as mainly ${nm[sh.k][0]}. ${sh.why}`:`${done} of 6 arguments sorted. Experiments can settle the claims about evidence; the claims about words are settled, if at all, by whether the words lead to good research.`};
 }});

// Scene 3: the same observation in two vocabularies. The learner picks a result and switches between a mechanistic and a
// cognitive description; the panels show what each wording suggests trying next and the risk each one runs.
const L7_OBSV=[
 {nm:'E. coli',lab:'rep',mech:['Receptor methylation lags behind binding,','so the tumble rate tracks a change.'],cog:['The cell remembers the last few seconds','and compares them with now.'],next:'Change the timing of a step in attractant.'},
 {nm:'Stentor',lab:'rep',mech:['Repeated stimulation shifts the cell','between motor programs.'],cog:['The cell escalates its choices','when the first ones fail.'],next:'Vary how often and how long it is irritated.'},
 {nm:'Toy network',lab:'model',mech:['A bistable gene is set by coincident','inputs and gates the response.'],cog:['The network learns that the signal','predicts the stimulus.'],next:'Run unpaired and stimulus-only controls.'},
 {nm:'Planarian',lab:'single',mech:['Some lasting change outside the new','head biases relearning.'],cog:['The worm keeps a memory through','regrowing its brain.'],next:'Independent repeats; find where the change is held.'}];
SCENE({id:'cognition-debate-words',name:'Same data, two vocabularies',tag:'Criticism and debate · What the cognitive lens buys, and what it risks',
 definition:'Supporters of basal cognition, including Lyon, Levin and their co-authors, argue that cognitive words are justified when they lead to experiments that a purely mechanical description would not suggest: if a tissue behaves as if it has a goal, try changing the goal. Critics reply that such words invite anthropomorphism, reading human-like minds into simple mechanisms, and that a word stretched to cover bacteria and gene networks may stop explaining anything. Both sides accept the same observations. Basal cognition, as its proponents define it, is about measurable behaviour; it is not a claim that cells are conscious. Questions about consciousness in animals and in other systems are taken up in Consciousness In Motion, and the view that cognition depends on the body in Mind In Motion.',
 example:'For each result below, the mechanistic and the cognitive description fit the same data. Switch between them and compare what each suggests doing next and where each could mislead.',
 desc:'One observation at a time, from a bacterium, Stentor, the toy gene network or planarians, described in mechanistic or cognitive words at the learner’s choice, with what each wording suggests trying next, the risk each runs, and the evidence label of the observation.',
 research:['Lyon, Keijzer, Arendt & Levin (2021). Reframing cognition: getting down to biological basics. Phil. Trans. R. Soc. B 376, 20190750.','Adams (2018). Cognition wars. Studies in History and Philosophy of Science 68.','Levin (2022). Frontiers in Systems Neuroscience 16, 768201 (the claim that the framing should drive experiments).'],
 dur:12,hint:'Pick a result and switch between the two vocabularies. The data do not change; ask which wording suggests the better next experiment, and which one could mislead.',
 init:()=>({o:0,voc:'cog'}),
 watch(p){const k=Math.min(7,Math.floor(p*8));return {o:k>>1,voc:k%2?'cog':'mech'}},
 ui:[{choose:[[0,'E. coli'],[1,'Stentor'],[2,'Toy network'],[3,'Planarian']],label:'Result',get:s=>s.o,act:'o'},{choose:[['mech','Mechanistic words'],['cog','Cognitive words']],label:'Describe it in',get:s=>s.voc,act:'voc'}],
 on:{o(s,v){s.o=clamp(Math.round(+v),0,3)},voc(s,v){s.voc=v==='mech'?'mech':'cog'}},
 draw(s){
  const c=L7_OBSV[s.o],cog=s.voc==='cog';
  let out=heading(`${c.nm}, in ${cog?'cognitive':'mechanistic'} words`);
  out+=R(20,50,560,92,cog?C.purplep:C.pale,cog?C.purple:C.blue,10)+L7_lines(36,80,cog?c.cog:c.mech,15,C.ink,'start',24);
  out+=L7_badge(568,116,c.lab,'end');
  out+=R(20,156,272,120,'#fff',C.grid,8)+TBF(32,178,'Suggests trying',13,C.green,'start');
  out+=L7_lines(32,200,cog?['Change its “goal” or its history','and see if behaviour follows.']:['Measure the parts and their','timing directly.'],13,C.ink,'start',18);
  out+=TF(32,252,'Shared next step:',12.5,C.muted,'start')+TF(32,268,c.next,12,C.ink,'start');
  out+=R(308,156,272,120,'#fff',C.grid,8)+TBF(320,178,'Risk',13,C.coral,'start');
  out+=L7_lines(320,200,cog?['Reading a human-like mind into','a simple mechanism; a word that','covers everything explains little.']:['Missing regularities that only','show at the level of the whole','system.'],13,C.ink,'start',18);
  out+=R(20,290,560,58,C.amberp,'none',8)+L7_lines(32,312,['Not a claim about consciousness: basal cognition is about behaviour that','can be measured. See Consciousness In Motion and Mind In Motion.'],13,C.ink,'start',18);
  out+=L7_badge(568,162,'debate','end');
  return {svg:out,phase:`${c.nm}, in ${cog?'cognitive':'mechanistic'} words: ${(cog?c.cog:c.mech).join(' ')} The observation is the same either way (${L7_LABELS[c.lab][0].toLowerCase()}). ${cog?'Supporters say this wording suggests new experiments; critics say it risks anthropomorphism.':'Critics prefer this wording as safer; supporters say it can miss what the whole system is doing.'}`};
 }});
