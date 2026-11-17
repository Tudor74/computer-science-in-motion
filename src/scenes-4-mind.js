/* ===================== Era 4 · How the mind reads a screen ===================== */
// Shared helpers for this era (prefix H4_).
const H4_now=()=>(typeof performance!=='undefined'&&performance.now)?performance.now():0;
const H4_mean=a=>a.length?sum(a)/a.length:null;
const H4_ms=v=>v===null||v===undefined?'—':Math.round(v)+' ms';
// A small item for visual-search displays.
function H4_item(x,y,kind,col,size=11,angle=0){
 if(kind==='square')return R(x-size,y-size,size*2,size*2,col,'none',2);
 if(kind==='bar')return `<g transform="rotate(${fmt(angle)} ${fmt(x)} ${fmt(y)})">${R(x-3,y-size-3,6,size*2+6,col,'none',2)}</g>`;
 if(kind==='T'||kind==='L'){const s=size;return `<g transform="rotate(${fmt(angle)} ${fmt(x)} ${fmt(y)})">`+(kind==='T'?P(`M${x-s} ${y-s}H${x+s}M${x} ${y-s}V${y+s}`,col,4):P(`M${x-s*.6} ${y-s}V${y+s}H${x+s}`,col,4))+'</g>'}
 return Ci(x,y,size,col);
}

/* ---------------- Lesson: Gestalt grouping ---------------- */
function H4_verdict(h,v){return h<v*.8?'rows':v<h*.8?'columns':'either'}
SCENE({id:'gestalt',name:'Grouping by proximity',tag:'Near things belong together',
 definition:'The eye groups things that are close together. Change only the spacing and the same dots switch from rows to columns.',
 example:'A grid of identical dots reads as rows when the gaps across are smaller than the gaps down, and as columns when it is the other way round. Nothing about the dots themselves changes.',
 desc:'A five-by-five grid of identical dots whose horizontal and vertical spacing changes; faint outlines show the rows or columns most people see.',
 research:'Wertheimer, M. (1923). Untersuchungen zur Lehre von der Gestalt II. Psychologische Forschung, 4, 301–350.',
 dur:10,hint:'Change the two gaps. When one gap is clearly smaller, the grid snaps into rows or columns.',
 init:()=>({h:18,v:44}),
 watch(p){const u=smooth(p);return {h:Math.round(lerp(18,46,u)),v:Math.round(lerp(46,18,u))}},
 ui:[{range:'h',label:'Gap across',min:10,max:60,get:s=>s.h,act:'h'},{range:'v',label:'Gap down',min:10,max:60,get:s=>s.v,act:'v'}],
 on:{h(s,v){s.h=v},v(s,v){s.v=v}},
 draw(s){
  const n=5,cx=205,cy=205,w=(n-1)*s.h,ht=(n-1)*s.v,x0=cx-w/2,y0=cy-ht/2,vd=H4_verdict(s.h,s.v);let out=heading('Same dots, different spacing');
  if(vd==='rows')range(n).forEach(j=>out+=R(x0-16,y0+j*s.v-15,w+32,30,'none',C.blue,15,'stroke-dasharray="5 5" opacity=".5"'));
  if(vd==='columns')range(n).forEach(i=>out+=R(x0+i*s.h-15,y0-16,30,ht+32,'none',C.coral,15,'stroke-dasharray="5 5" opacity=".5"'));
  range(n).forEach(j=>range(n).forEach(i=>out+=Ci(x0+i*s.h,y0+j*s.v,8,C.dark)));
  out+=R(400,70,180,230,'#fff',C.grid,10)+TB(490,98,'You probably see',14,C.muted)+TB(490,134,vd==='either'?'rows or columns':vd,22,vd==='rows'?C.blue:vd==='columns'?C.coral:C.purple);
  out+=T(490,180,'gap across  '+s.h,15,C.ink)+T(490,206,'gap down  '+s.v,15,C.ink);
  out+=T(490,244,vd==='either'?'Similar gaps:':'The smaller gap',13,C.muted)+T(490,262,vd==='either'?'the grouping flips':'binds the dots',13,C.muted)+T(490,280,vd==='either'?'back and forth.':'into a group.',13,C.muted);
  return {svg:out,phase:vd==='either'?'With nearly equal gaps the grid is ambiguous: most people can see rows or columns and switch between them at will.':`The gap ${vd==='rows'?'across':'down'} is smaller, so the dots group into ${vd}. Layouts use the same rule: whatever sits closest is read as one unit.`};
 }});

const H4_CUES={colour:'colour',shape:'shape',size:'size'};
SCENE({id:'gestalt-similarity',name:'Similarity versus proximity',tag:'Alike things group too',
 definition:'Things that share a colour, shape or size are grouped together. When similarity and proximity disagree, the stronger cue wins.',
 example:'Alternate the colour of each column and equal spacing reads as columns. Pull the rows apart and proximity starts to fight back.',
 desc:'A grid where alternate columns differ in colour, shape or size, while the space between rows can be widened to compete.',
 research:'Wertheimer, M. (1923). Untersuchungen zur Lehre von der Gestalt II; see also Palmer, S. E. (1999). Vision Science: Photons to Phenomenology. MIT Press.',
 dur:12,hint:'Pick the cue that makes columns alike, then widen the gap between rows until rows take over.',
 init:()=>({cue:'colour',v:24}),
 watch(p){const q=p*3,i=Math.min(2,Math.floor(q));return {cue:['colour','shape','size'][i],v:Math.round(24+40*smooth(clamp((q-i)*1.2,0,1)))}},
 ui:[{choose:[['colour','Colour'],['shape','Shape'],['size','Size']],label:'Cue',get:s=>s.cue,act:'cue'},{range:'v',label:'Gap between rows',min:24,max:70,get:s=>s.v,act:'v'}],
 on:{cue(s,v){s.cue=v},v(s,v){s.v=v}},
 draw(s){
  const n=6,h=30,x0=205-(n-1)*h/2,y0=205-(n-1)*s.v/2;let out=heading('Columns by '+s.cue+', rows by spacing');
  range(n).forEach(j=>range(n).forEach(i=>{const odd=i%2===1,x=x0+i*h,y=y0+j*s.v;
   out+=s.cue==='colour'?Ci(x,y,9,odd?C.coral:C.blue):s.cue==='shape'?H4_item(x,y,odd?'square':'circle',C.dark,8):Ci(x,y,odd?4.5:10,C.dark)}));
  const ratio=s.v/h,win=ratio<1.35?'columns':ratio<1.8?'contest':'rows';
  out+=R(400,70,180,230,'#fff',C.grid,10)+TB(490,98,'Similarity says',14,C.muted)+TB(490,124,'columns',20,C.coral)+TB(490,164,'Proximity says',14,C.muted)+TB(490,190,ratio<1.05?'nothing':'rows',20,C.blue);
  out+=T(490,236,'Row gap is '+fmt(ratio)+'× the',13,C.muted)+T(490,254,'gap across',13,C.muted)+TB(490,282,win==='contest'?'a contest':win+' win',16,win==='rows'?C.blue:win==='columns'?C.coral:C.purple);
  return {svg:out,phase:win==='columns'?`With even spacing, ${s.cue} similarity binds alternate columns. Interfaces use this when every link shares one colour.`:win==='rows'?'Once rows are far enough apart, proximity overrides similarity and you see rows. Which cue wins depends on how strong each one is; there is no fixed ratio.':`The two cues now compete. Many people see the grid flip between rows and columns. Strong colour differences usually hold out longer than small size or shape differences.`};
 }});

const H4_REGION_OPTS=[['none','Spacing only'],['region','Common region'],['lines','Connected'],['both','Both']];
SCENE({id:'gestalt-region',name:'Common region and connectedness',tag:'Boxes and lines beat spacing',
 definition:'Items inside the same enclosed area, or joined by a line, are seen as a group, even when spacing suggests otherwise.',
 example:'Cards, panels and table rows work because a shared background or border binds what is inside it more strongly than distance alone.',
 desc:'Ten dots arranged in close pairs; optional shaded regions or connecting lines group the dots across the pairs instead.',
 research:'Palmer, S. E. (1992). Common region: a new principle of perceptual grouping. Cognitive Psychology, 24, 436–447. Palmer, S. E. & Rock, I. (1994). Rethinking perceptual organization: the role of uniform connectedness. Psychonomic Bulletin & Review, 1, 29–55.',
 dur:10,hint:'Switch between spacing only, regions, lines or both, and see which pairs you read as belonging together.',
 init:()=>({mode:'region'}),
 watch(p){return {mode:H4_REGION_OPTS[Math.min(3,Math.floor(p*4))][0]}},
 ui:[{choose:H4_REGION_OPTS,label:'Grouping cue',get:s=>s.mode,act:'mode'}],
 on:{mode(s,v){s.mode=v}},
 draw(s){
  const xs=[];let x=50;for(let i=0;i<10;i++){xs.push(x);x+=i%2===0?44:70}
  const y=150,reg=s.mode==='region'||s.mode==='both',lin=s.mode==='lines'||s.mode==='both';let out=heading('Which dots belong together?');
  if(reg)for(let i=1;i<9;i+=2)out+=R(xs[i]-17,y-30,xs[i+1]-xs[i]+34,60,C.amberp,C.amber,20);
  if(lin)for(let i=1;i<9;i+=2)out+=L(xs[i],y,xs[i+1],y,C.purple,5);
  xs.forEach(px=>out+=Ci(px,y,11,C.dark));
  const pairs=s.mode==='none'?[[0,1],[2,3],[4,5],[6,7],[8,9]]:[[1,2],[3,4],[5,6],[7,8]];
  pairs.forEach(([a,b])=>out+=P(`M${xs[a]-8} 196Q${(xs[a]+xs[b])/2} 222 ${xs[b]+8} 196`,s.mode==='none'?C.blue:C.coral,2.5));
  out+=T(300,252,s.mode==='none'?'Proximity pairs the closest dots':'The region or line wins over distance',16,s.mode==='none'?C.blue:C.coral,'middle','font-weight="650"');
  // A small interface echo: the same principle as cards.
  const cards=[['Email','on'],['Texts','off'],['Calls','on']];
  cards.forEach(([lab,v],i)=>{const cx=110+i*140;out+=(reg?R(cx-58,282,116,70,'#fff',C.line,10):'')+T(cx,308,lab,15,C.ink,'middle','font-weight="600"')+R(cx-22,320,44,22,v==='on'?C.green:C.grid,'none',11)+Ci(v==='on'?cx+11:cx-11,331,8,'#fff')});
  return {svg:out,phase:s.mode==='none'?'With spacing alone, the closest dots pair up. In the cards below, nothing but distance tells you which switch belongs to which label.':`${s.mode==='lines'?'A line':'A shared region'} groups the dots across the gaps, overriding proximity. Card borders and shaded panels in interfaces rely on exactly this.`};
 }});

SCENE({id:'gestalt-form',name:'Labels near their fields',tag:'Grouping in a real form',
 definition:'In a form, each label should sit clearly closer to its own field than to any other, or the eye may pair it with the wrong one.',
 example:'If a label floats halfway between two text boxes, readers hesitate over which box it names. Moving it a few pixels closer removes the doubt.',
 desc:'A three-field form where the gap between each label and its own field can be changed; a marker shows which field each label appears to belong to.',
 research:'Applies the proximity principle of Wertheimer (1923); Koffka, K. (1935). Principles of Gestalt Psychology. Harcourt, Brace.',
 dur:10,hint:'Slide the label gap. Past the midpoint, each label starts to look as if it names the field above it.',
 init:()=>({g:30,boxes:false}),
 watch(p){return {g:Math.round(4+40*Math.sin(Math.PI*p)),boxes:false}},
 ui:[{range:'g',label:'Gap below label',min:2,max:44,get:s=>s.g,act:'g'},{b:'Group in boxes',act:'boxes'}],
 on:{g(s,v){s.g=v},boxes(s){s.boxes=!s.boxes}},
 draw(s){
  const names=['Full name','Email','Phone'],slot=96,fh=32,lh=14;let out=heading('Which field does each label name?');
  const own=s.g,other=slot-fh-lh-s.g,amb=Math.abs(own-other)<7&&!s.boxes,wrong=other<own-6&&!s.boxes;
  names.forEach((nm,i)=>{const ft=96+i*slot,ly=ft-s.g;
   if(s.boxes)out+=R(52,ly-lh-10,300,s.g+fh+lh+20,'#f6f9fb',C.line,10);
   out+=T(70,ly,nm,15,C.ink,'start','font-weight="600"')+R(70,ft,264,fh,'#fff',C.line,6);
   if(i>0){const col=amb?C.purple:wrong?C.coral:C.green;out+=arrow(350,ly-5,368,ly-5,col,2)+T(372,ly,amb?'unclear':wrong?'looks like the field above':'its own field',13,col,'start')}
  });
  out+=R(400,300,180,56,'#fff',C.grid,8)+T(490,322,'to own field: '+own,14,C.ink)+T(490,342,'to field above: '+Math.max(0,other),14,C.ink);
  return {svg:out,phase:s.boxes?'A box around each label and field binds them by common region, so even awkward spacing no longer misleads.':amb?'The label sits about halfway between two fields: proximity gives no clear answer, so readers have to work it out.':wrong?'Each label is now closer to the field above it. People scanning quickly will fill in the wrong box.':'Each label is clearly closer to its own field, so the pairs read at a glance.'};
 }});

/* ---------------- Lesson: Pre-attentive pop-out ---------------- */
function H4_searchItems(mode,n,seed){
 const r=rng(seed),cells=shuffled(range(36),seed).slice(0,n);
 return cells.map((c,i)=>{const x=50+(c%6)*52+(r()-.5)*14,y=78+Math.floor(c/6)*44+(r()-.5)*10;
  if(i===0)return {x,y,kind:'circle',col:C.coral,target:true};
  if(mode==='feature')return {x,y,kind:'circle',col:C.blue};
  return i%2?{x,y,kind:'square',col:C.coral}:{x,y,kind:'circle',col:C.blue};
 });
}
const H4_SIZES=[4,8,16,32];
// Simulated participant for Watch: feature search flat, conjunction rising (the classic pattern's shape).
const H4_SIM=(()=>{const r=rng(77),out=[];for(let k=0;k<24;k++){const mode=k%2?'conj':'feature',n=H4_SIZES[Math.floor(k/2)%4];out.push({mode,n,rt:mode==='feature'?620+1.5*n+(r()-.5)*90:640+26*n+(r()-.5)*120,ok:true})}return out})();
function H4_rtChart(trials,x0,y0,w,h){
 let out=R(x0,y0,w,h,'#fff',C.grid,8);const all=trials.filter(t=>t.ok),max=Math.max(1500,...all.map(t=>t.rt));const top=Math.ceil(max/500)*500;
 const px=i=>x0+34+i*(w-50)/3,py=v=>y0+h-26-(v/top)*(h-58);
 for(let v=0;v<=top;v+=500)out+=L(x0+30,py(v),x0+w-10,py(v),C.grid,1)+TF(x0+26,py(v)+4,v,11,C.muted,'end');
 H4_SIZES.forEach((n,i)=>out+=TF(px(i),y0+h-8,n,12,C.muted));
 out+=TF(x0+w/2,y0+14,'mean time (ms) by number of items',12,C.muted);
 for(const [mode,col] of [['feature',C.blue],['conj',C.coral]]){const pts=H4_SIZES.map((n,i)=>{const m=H4_mean(all.filter(t=>t.mode===mode&&t.n===n).map(t=>t.rt));return m===null?null:[px(i),py(m)]}).filter(Boolean);
  if(pts.length>1)out+=P('M'+pts.map(p=>p.map(fmt).join(' ')).join('L'),col,2.5);pts.forEach(p=>out+=Ci(p[0],p[1],4.5,col))}
 return out;
}
SCENE({id:'preattentive',name:'Pop-out and visual search',tag:'Be the participant',
 definition:'Some differences “pop out” at once, whatever else is on screen. Others must be searched for one item at a time, so the search slows as items are added.',
 example:'A red circle among blue circles is found instantly, even among 30. A red circle among red squares and blue circles takes longer with every extra item.',
 desc:'A visual-search display of circles and squares, and a chart of the learner’s own search times against the number of items for feature and conjunction search.',
 research:'Treisman, A. M. & Gelade, G. (1980). A feature-integration theory of attention. Cognitive Psychology, 12, 97–136.',
 dur:14,hint:'Choose a search type and a number of items, press Start trial, then click the red circle as fast as you can. Each click starts the next trial.',
 init:()=>({mode:'feature',n:8,items:null,t0:0,trials:[],seed:5,last:null}),
 watch(p){const k=Math.min(23,Math.floor(p*24)),t=H4_SIM[k];return {mode:t.mode,n:t.n,items:H4_searchItems(t.mode,t.n,31+k),t0:0,trials:H4_SIM.slice(0,k+1),seed:31+k,last:null,sim:true}},
 ui:[{choose:[['feature','Colour only'],['conj','Colour + shape']],label:'Search type',get:s=>s.mode,act:'mode'},{choose:H4_SIZES.map(n=>[n,n+' items']),label:'Number of items',get:s=>s.n,act:'n'},{b:'Start trial',act:'start'},{b:'Clear results',act:'clear'}],
 on:{mode(s,v){s.mode=v;s.items=null},n(s,v){s.n=Number(v);s.items=null},start(s){s.seed=nextSeed();s.items=H4_searchItems(s.mode,s.n,s.seed);s.t0=H4_now();s.last=null},clear(s){s.trials=[];s.items=null;s.last=null},
  pick(s,i){if(!s.items)return 'keep';const it=s.items[Number(i)],rt=H4_now()-s.t0;s.trials.push({mode:s.mode,n:s.n,rt,ok:!!it.target});s.last={rt,ok:!!it.target};s.seed=nextSeed();s.items=H4_searchItems(s.mode,s.n,s.seed);s.t0=H4_now()}},
 draw(s,f,X){
  let out=heading(s.mode==='feature'?'Find the red circle (feature search)':'Find the red circle (conjunction search)');
  out+=R(22,52,336,282,'#fff',C.grid,10);
  if(!s.items)out+=T(190,180,'Press Start trial,',16,C.muted)+T(190,204,'then click the red circle.',16,C.muted);
  else s.items.forEach((it,i)=>{const inner=H4_item(it.x,it.y,it.kind,it.col,11)+(X.try?Ci(it.x,it.y,16,'transparent'):'');out+=hit(X,'pick',i,it.target?'Target':'Distractor',inner);if(s.sim&&it.target&&X.u>.6)out+=Ci(it.x,it.y,18,'none',C.amber,'stroke-width="3"')});
  out+=H4_rtChart(s.trials,370,52,214,230);
  out+=Ci(386,300,5,C.blue)+TF(396,304,'colour only',12,C.ink,'start')+Ci(486,300,5,C.coral)+TF(496,304,'colour + shape',12,C.ink,'start');
  const nOk=s.trials.filter(t=>t.ok).length;
  out+=TF(477,328,s.sim?'simulated participant':`${nOk} correct trials`+(s.last?` · last ${H4_ms(s.last.rt)}${s.last.ok?'':' (miss)'}`:''),12,C.muted);
  const by=m=>H4_SIZES.map(n=>H4_mean(s.trials.filter(t=>t.ok&&t.mode===m&&t.n===n).map(t=>t.rt)));
  return {svg:out,phase:s.sim?'A typical pattern: finding a unique colour takes about the same time whatever the number of items, but finding a colour-and-shape combination slows with every item, because attention must bind the features one item at a time.':`Your means — colour only: ${by('feature').map(H4_ms).join(', ')}; colour + shape: ${by('conj').map(H4_ms).join(', ')} (for 4, 8, 16, 32 items). Your times include moving the pointer, so they are slower than a key-press experiment, but the slopes should still differ.`};
 }});

const H4_FEATS=[['colour','Colour'],['orientation','Tilt'],['size','Size'],['conj','Colour + tilt'],['tl','T among Ls']];
SCENE({id:'preattentive-features',name:'What pops out?',tag:'Guiding features',
 definition:'Only a few visual features guide attention before you look item by item: colour, orientation, size and motion are among the strongest. Combinations and arrangements of lines do not pop out.',
 example:'A tilted line among upright ones jumps out; a T among Ls does not, even though the letters look obviously different once you look at them.',
 desc:'A grid of items with one odd one out; the learner chooses the feature that differs and how big the difference is.',
 research:'Wolfe, J. M. & Horowitz, T. S. (2004). What attributes guide the deployment of visual attention and how do they do it? Nature Reviews Neuroscience, 5, 495–501. Healey, C. G. & Enns, J. T. (2012). Attention and visual memory in visualization and computer graphics. IEEE TVCG, 18(7), 1170–1188.',
 dur:14,hint:'Pick a feature and shrink the difference. Notice the point where the odd one stops jumping out and you have to hunt.',
 init:()=>({feat:'colour',diff:70}),
 watch(p){const q=p*5,i=Math.min(4,Math.floor(q));return {feat:H4_FEATS[i][0],diff:Math.round(80-60*smooth(clamp((q-i)*1.3,0,1)))}},
 ui:[{choose:H4_FEATS,label:'Odd feature',get:s=>s.feat,act:'feat'},{range:'diff',label:'Difference',min:0,max:90,get:s=>s.diff,act:'diff'}],
 on:{feat(s,v){s.feat=v},diff(s,v){s.diff=v}},
 draw(s){
  const cols=8,rows=5,odd=27,d=s.diff;let out=heading('Spot the odd one out');
  for(let k=0;k<cols*rows;k++){const x=90+(k%cols)*60,y=78+Math.floor(k/cols)*52,isOdd=k===odd;
   if(s.feat==='colour')out+=Ci(x,y,11,isOdd?`hsl(${210-d*1.6},62%,46%)`:'hsl(210,62%,46%)');
   else if(s.feat==='orientation')out+=H4_item(x,y,'bar',C.dark,12,isOdd?d*.9:0);
   else if(s.feat==='size')out+=Ci(x,y,isOdd?8+d/9:8,C.dark);
   else if(s.feat==='conj')out+=H4_item(x,y,'bar',isOdd?C.coral:(k%2?C.coral:C.blue),12,isOdd?0:(k%2?40:0));
   else out+=H4_item(x,y,isOdd?'T':'L',C.dark,10,(k*90)%360);
  }
  const basic=['colour','orientation','size'].includes(s.feat),pops=basic&&d>=25;
  out+=R(30,330,540,36,pops?C.greenp:C.coralp,'none',8)+TB(300,353,pops?'Pops out: found in one glance':basic?'Too small a difference: you have to search':'No pop-out: attention has to visit items one by one',15,pops?C.green:C.coral);
  return {svg:out,phase:basic?`${s.feat==='colour'?'Hue':s.feat==='orientation'?'Tilt':'Size'} is a guiding feature, but only when the difference is large enough relative to the variation among the other items.`:s.feat==='conj'?'The odd item is the only red upright bar, but red and upright both appear elsewhere. A conjunction has to be checked item by item.':'T and L are made of the same two strokes; only their arrangement differs, and arrangement does not guide attention.'};
 }});

function H4_table(seed){const r=rng(seed),idx=shuffled(range(30),seed).slice(0,5);return range(30).map(i=>idx.includes(i)?81+Math.floor(r()*19):10+Math.floor(r()*70))}
SCENE({id:'preattentive-design',name:'Designing for pop-out',tag:'Highlight what matters',
 definition:'If the important values are encoded with a guiding feature such as colour, readers find them in a glance instead of reading every number.',
 example:'Find every value over 80 in a plain table and you must read all 30 cells. Colour those values and they are found before you start reading.',
 desc:'A table of thirty numbers in which the values over 80 are shown plain, bold or coloured; the learner times how long it takes to click all of them.',
 research:'Applies Treisman & Gelade (1980) and Healey, C. G., Booth, K. S. & Enns, J. T. (1996). High-speed visual estimation using preattentive processing. ACM TOCHI, 3(2), 107–135.',
 dur:12,hint:'Choose an encoding, press Start, then click every number over 80. Compare your times for plain, bold and colour.',
 init:()=>({enc:'plain',seed:9,vals:H4_table(9),found:[],t0:0,running:false,wrong:0,res:{plain:[],bold:[],colour:[]}}),
 watch(p){const i=Math.min(2,Math.floor(p*3)),enc=['plain','bold','colour'][i],vals=H4_table(9),tg=vals.map((v,k)=>v>80?k:-1).filter(k=>k>=0),u=p*3-i;return {enc,seed:9,vals,found:tg.slice(0,Math.floor(u*[1.2,2,6][i]*tg.length/1.2)),running:true,res:{plain:[],bold:[],colour:[]},sim:true}},
 ui:[{choose:[['plain','Plain'],['bold','Bold'],['colour','Colour']],label:'Encoding',get:s=>s.enc,act:'enc'},{b:'Start',act:'start'}],
 on:{enc(s,v){s.enc=v;s.running=false;s.found=[]},start(s){s.seed=nextSeed();s.vals=H4_table(s.seed);s.found=[];s.wrong=0;s.running=true;s.t0=H4_now()},
  cell(s,i){if(!s.running)return 'keep';i=Number(i);if(s.vals[i]>80){if(!s.found.includes(i))s.found.push(i)}else s.wrong++;
   if(s.found.length===s.vals.filter(v=>v>80).length){s.res[s.enc].push(H4_now()-s.t0);s.running=false}}},
 draw(s,f,X){
  let out=heading('Click every value over 80');const x0=30,y0=56,cw=56,rh=44;
  s.vals.forEach((v,i)=>{const x=x0+(i%6)*cw,y=y0+Math.floor(i/6)*rh,big=v>80,got=s.found.includes(i);
   const show=s.running||s.sim;const col=show&&big&&s.enc==='colour'?C.coral:C.ink,wt=show&&big&&s.enc==='bold'?'font-weight="800"':'';
   const inner=R(x+2,y+2,cw-4,rh-4,got?C.greenp:'#fff',got?C.green:C.grid,6)+(show?TM(x+cw/2,y+28,v,17,col,'middle',wt):T(x+cw/2,y+28,'·',17,C.line));
   out+=hit(X,'cell',i,show?`Value ${v}`:'Hidden',inner)});
  if(!s.running&&!s.sim)out+=R(70,140,260,50,'#ffffffe6',C.line,10)+T(200,170,'Press Start to reveal',16,C.muted);
  const bx=372;out+=R(bx,56,206,220,'#fff',C.grid,8)+TB(bx+103,82,'Your times',14,C.muted);
  [['plain','Plain'],['bold','Bold'],['colour','Colour']].forEach(([k,l],j)=>{const m=H4_mean(s.res[k]);out+=T(bx+16,118+j*40,l,15,C.ink,'start')+TB(bx+190,118+j*40,m===null?'—':(m/1000).toFixed(1)+' s',15,k==='colour'?C.coral:C.ink,'end')+TF(bx+190,134+j*40,s.res[k].length+' runs',11,C.muted,'end')});
  out+=T(bx+103,252,`found ${s.found.length} of ${s.vals.filter(v=>v>80).length}`+(s.wrong?` · ${s.wrong} wrong`:''),13,C.muted);
  return {svg:out,phase:s.sim?(s.enc==='plain'?'Plain: every cell has to be read and compared with 80.':s.enc==='bold'?'Bold helps a little, but weight is a weak guiding feature among dense digits.':'Colour: the five values are located before any reading starts.'):'Only colour is a strong guiding feature here. Bold text differs mainly in thickness, which guides attention far less, so it usually helps only a little.'};
 }});

/* ---------------- Lesson: Working memory ---------------- */
function H4_digits(len,seed){const r=rng(seed);let s='';for(let i=0;i<len;i++){let d=Math.floor(r()*10);if(i&&String(d)===s[i-1])d=(d+3)%10;s+=d}return s}
const H4_SPAN_SIM=[[4,1],[5,1],[6,1],[7,1],[8,0],[7,1],[8,1],[9,0],[8,0],[7,1],[8,1],[9,0]];
function H4_staircase(hist,x0,y0,w,h){
 let out=R(x0,y0,w,h,'#fff',C.grid,8);const py=v=>y0+h-20-(v-2)*(h-36)/10,n=Math.max(8,hist.length),px=i=>x0+30+i*(w-46)/(n-1);
 out+=R(x0+26,py(9),w-36,py(5)-py(9),C.amberp,'none',3)+TF(x0+w-14,py(9)+12,'7 ± 2 digits',11,C.amber,'end');
 out+=L(x0+26,py(4),x0+w-10,py(4),C.purple,1.5,'stroke-dasharray="5 4"')+TF(x0+w-14,py(4)-4,'≈ 4 chunks',11,C.purple,'end');
 for(const v of [3,6,9,12])out+=TF(x0+18,py(v)+4,v,11,C.muted,'end');
 if(hist.length>1)out+=P('M'+hist.map((t,i)=>fmt(px(i))+' '+fmt(py(t.len))).join('L'),C.line,2);
 hist.forEach((t,i)=>out+=Ci(px(i),py(t.len),5,t.ok?C.green:C.coral));
 return out+TF(x0+w/2,y0+h-4,'trial →  (green = correct)',11,C.muted);
}
SCENE({id:'working-memory',name:'Digit span',tag:'Be the participant',
 definition:'Working memory holds a few items for a few seconds while you use them. Its capacity is small: about seven digits with rehearsal, and only about four chunks when rehearsal and grouping are prevented.',
 example:'Read 7 3 9 1 4 8 2 once, look away, and type it back. Most adults manage around seven digits; much longer strings fail.',
 desc:'A digit-span test: a row of digits to study, then a recall box; a staircase chart tracks the length of each trial, with bands for Miller’s 7 ± 2 and Cowan’s about 4 chunks.',
 research:'Miller, G. A. (1956). The magical number seven, plus or minus two. Psychological Review, 63, 81–97. Cowan, N. (2001). The magical number 4 in short-term memory. Behavioral and Brain Sciences, 24, 87–114.',
 dur:14,hint:'Show the digits, study them, press Hide, type them in the box, then Check. Right answers add a digit; wrong ones take one away.',
 init:()=>({len:4,seq:'',phase:'ready',answer:'',hist:[]}),
 watch(p){const k=Math.min(11,Math.floor(p*12)),[len]=H4_SPAN_SIM[k];return {len,seq:H4_digits(len,40+k),phase:(p*12-k)<.6?'study':'recall',answer:'',hist:H4_SPAN_SIM.slice(0,k).map(([l,o])=>({len:l,ok:!!o})),sim:true}},
 ui:[{b:'Show digits',act:'show'},{b:'Hide',act:'hide'},{text:'Answer',label:'Your answer',get:s=>s.answer,act:'type',max:14},{b:'Check',act:'check'}],
 on:{show(s){s.seq=H4_digits(s.len,nextSeed());s.phase='study';s.answer=''},hide(s){if(s.phase==='study')s.phase='recall'},type(s,v){s.answer=String(v).replace(/\D/g,'')},
  check(s){if(!s.seq||s.phase==='ready')return 'keep';const ok=s.answer===s.seq;s.hist.push({len:s.len,ok});s.phase='result';s.lastOk=ok;s.len=ok?Math.min(14,s.len+1):Math.max(3,s.len-1)}},
 draw(s){
  let out=heading('How many digits can you hold?');const seq=s.seq||'',n=Math.max(1,seq.length),w=Math.min(44,330/n),x0=200-n*w/2;
  out+=R(22,52,356,170,'#fff',C.grid,10);
  if(s.phase==='ready'||!seq)out+=T(200,130,'Press Show digits to begin.',16,C.muted)+T(200,156,`Next trial: ${s.len} digits`,14,C.muted);
  else{Array.from(seq).forEach((d,i)=>{const x=x0+i*w,shown=s.phase==='study'||s.phase==='result';const typed=s.answer[i],bad=s.phase==='result'&&typed!==d;
    out+=R(x+3,90,w-6,52,shown?C.pale:'#f3f5f6',shown?C.blue:C.grid,8)+TM(x+w/2,126,shown?d:'?',Math.min(26,w*.6),shown?C.ink:C.line,'middle','font-weight="700"');
    if(s.phase!=='study')out+=TM(x+w/2,176,typed||'_',Math.min(22,w*.55),bad?C.coral:C.green,'middle','font-weight="700"')});
   out+=TF(200,76,s.phase==='study'?'Study, then press Hide':s.phase==='recall'?'Type them in order':'',13,C.muted);
   if(s.phase==='result')out+=TB(200,208,s.lastOk?'✓ Correct: one more next time':'✗ Not quite: one fewer next time',15,s.lastOk?C.green:C.coral)}
  out+=H4_staircase(s.hist,392,52,190,170);
  out+=T(300,256,'Digit span ≈ 7 is what rehearsal and grouping let you manage.',14,C.ink)+T(300,280,'Pure capacity, with those tricks blocked, is closer to 3–5 chunks.',14,C.ink);
  out+=T(300,322,'Design rule: never make people carry information',14,C.muted)+T(300,342,'from one screen to the next in their heads.',14,C.muted);
  return {svg:out,phase:s.sim?'A typical staircase hovers around seven digits. That figure is a span for digits with rehearsal, not a rule that menus may have seven items.':'Miller’s 7 ± 2 summarised several tasks; Cowan’s review argues the core limit is about four chunks. Either way, it is small.'};
 }});

const H4_CHUNKS=[{text:'FBICIAUSABBC',meaning:[3,3,3,3],note:'FBI CIA USA BBC'},{text:'149217761066',meaning:[4,4,4],note:'1492 1776 1066'},{text:'QJXRMTKWZPLV',meaning:null,note:'no familiar groups'}];
SCENE({id:'working-memory-chunking',name:'Chunking',tag:'Fewer, bigger units',
 definition:'A chunk is a group of items you already know as one unit. Recoding a string into familiar chunks lets the same small memory hold far more.',
 example:'FBICIAUSABBC is twelve letters, but only four chunks to someone who knows FBI, CIA, USA and BBC.',
 desc:'A twelve-character string shown as single characters, as groups of three or four, or as meaningful chunks, with a count of the units to hold against a capacity of about four.',
 research:'Miller, G. A. (1956). The magical number seven, plus or minus two. Chase, W. G. & Simon, H. A. (1973). Perception in chess. Cognitive Psychology, 4, 55–81.',
 dur:12,hint:'Pick a string and a grouping. Meaningful groups only help when you already know them.',
 init:()=>({set:0,group:'meaning'}),
 watch(p){const q=p*3,i=Math.min(2,Math.floor(q)),u=q-i;return {set:i,group:u<.5?'none':'meaning'}},
 ui:[{choose:[[0,'Letters'],[1,'Years'],[2,'Random']],label:'String',get:s=>s.set,act:'set'},{choose:[['none','One by one'],['threes','In threes'],['meaning','Meaningful']],label:'Grouping',get:s=>s.group,act:'group'}],
 on:{set(s,v){s.set=Number(v)},group(s,v){s.group=v}},
 draw(s){
  const c=H4_CHUNKS[s.set],t=c.text;let sizes=s.group==='none'||(s.group==='meaning'&&!c.meaning)?Array(12).fill(1):s.group==='threes'?[3,3,3,3]:c.meaning;
  const known=!!c.meaning&&(s.group==='meaning'||(s.group==='threes'&&c.meaning.every(n=>n===3)));let out=heading('Twelve characters, how many units?');
  let x=300-(12*34+(sizes.length-1)*18)/2,pos=0;
  sizes.forEach(sz=>{out+=R(x-6,82,sz*34+12,64,known?C.greenp:s.group==='none'?'#fff':C.pale,known?C.green:C.line,12);for(let k=0;k<sz;k++)out+=TM(x+k*34+17,124,t[pos+k],26,C.ink,'middle','font-weight="700"');pos+=sz;x+=sz*34+18});
  const units=known||s.group==='none'?sizes.length:12;out+=T(300,186,s.group==='meaning'&&!c.meaning?'This string has no familiar groups, so meaningful grouping is not possible.':known?c.note:'',15,known?C.green:C.coral);
  out+=T(110,232,'Units to hold',15,C.ink,'start');for(let k=0;k<12;k++)out+=R(110+k*32,246,26,26,k<units?(units<=4?C.green:C.coral):'#f1f4f6','none',5);
  out+=L(110+4*32-3,240,110+4*32-3,280,C.purple,2.5,'stroke-dasharray="4 3"')+TF(110+4*32,296,'≈ 4',12,C.purple);
  out+=TB(300,336,!known&&s.group==='threes'?'4 groups, still 12 items':`${units} unit${units>1?'s':''}`,16,units<=4?C.green:C.coral);
  return {svg:out,phase:known?`Familiar chunks compress the string to ${units} units, within capacity. Chess masters recall real positions better than novices, but not random ones: their advantage is chunks, not a bigger memory.`:s.group==='threes'?'Grouping into threes adds rhythm and helps a little, which is why phone numbers are spaced, but unfamiliar triples are still three things each.':'Twelve separate characters overflow a working memory of about four items.'};
 }});

// Approximate recall after a distracting delay, after Peterson & Peterson (1959).
const H4_DECAY=[[0,100],[3,80],[6,55],[9,35],[12,25],[15,15],[18,10]];
function H4_recallAt(t){for(let i=1;i<H4_DECAY.length;i++){const [a,va]=H4_DECAY[i-1],[b,vb]=H4_DECAY[i];if(t<=b)return lerp(va,vb,(t-a)/(b-a))}return 10}
SCENE({id:'working-memory-recognition',name:'Recognition over recall',tag:'Show it, don’t ask for it',
 definition:'Without rehearsal, a few letters fade from short-term memory within seconds. Interfaces should let people recognise what they need on screen instead of recalling it.',
 example:'A checkout that shows the discount code where you type it is easier than one that showed it two screens earlier.',
 desc:'A curve of recall against delay with a slider for the delay, beside two versions of a three-screen task: one asks the user to remember a code, the other shows it again where it is needed.',
 research:'Peterson, L. R. & Peterson, M. J. (1959). Short-term retention of individual verbal items. Journal of Experimental Psychology, 58, 193–198. Nielsen, J. (1994). Enhancing the explanatory power of usability heuristics (recognition rather than recall). CHI ’94.',
 dur:10,hint:'Slide the delay (filled with other work) and compare the two designs.',
 init:()=>({delay:9,design:'recall'}),
 watch(p){return {delay:Math.round(18*smooth(p)),design:p<.5?'recall':'recognise'}},
 ui:[{range:'delay',label:'Seconds of other work',min:0,max:18,get:s=>s.delay,act:'delay'},{choose:[['recall','Remember it'],['recognise','Show it again']],label:'Design',get:s=>s.design,act:'design'}],
 on:{delay(s,v){s.delay=v},design(s,v){s.design=v}},
 draw(s){
  let out=heading('Memory fades fast while you do something else');const gx=330,gy=60,gw=250,gh=180,px=t=>gx+30+t/18*(gw-44),py=v=>gy+gh-24-v/100*(gh-40);
  out+=R(gx,gy,gw,gh,'#fff',C.grid,8);out+=P('M'+H4_DECAY.map(([t,v])=>fmt(px(t))+' '+fmt(py(v))).join('L'),C.purple,3);
  for(const v of [0,50,100])out+=TF(gx+24,py(v)+4,v+'%',11,C.muted,'end');for(const t of [0,6,12,18])out+=TF(px(t),gy+gh-8,t+' s',11,C.muted);
  const r=s.design==='recall'?H4_recallAt(s.delay):100;out+=Ci(px(s.delay),py(H4_recallAt(s.delay)),7,C.coral);
  out+=TF(gx+gw/2,gy+16,'recall of three letters after a delay (approx.)',11,C.muted);
  const scr=(x,title,body,col)=>R(x,96,86,120,'#fff',C.line,8)+R(x,96,86,22,C.pale,'none',8)+TF(x+43,111,title,12,C.ink)+body;
  out+=scr(20,'Screen 1',TM(63,160,'K7Q',18,C.blue,'middle','font-weight="700"')+TF(63,186,'your code',11,C.muted));
  out+=scr(124,'Screen 2',TF(167,150,'address,',12,C.muted)+TF(167,166,'delivery…',12,C.muted));
  out+=scr(228,'Screen 3',R(240,150,62,26,'#fff',C.line,4)+(s.design==='recognise'?TM(271,168,'K7Q',14,C.green,'middle','font-weight="700"')+TF(271,196,'shown again',11,C.green):TM(271,168,'?',14,C.coral)));
  out+=arrow(108,156,122,156,C.line,2)+arrow(212,156,226,156,C.line,2);
  out+=TBF(160,262,s.design==='recall'?`Chance of remembering ≈ ${Math.round(r)}%`:'Nothing to remember: 100%',17,s.design==='recall'?C.coral:C.green);
  out+=T(300,316,'Peterson & Peterson stopped rehearsal with counting backwards;',13,C.muted)+T(300,336,'real users juggle forms, chats and notifications instead.',13,C.muted);
  return {svg:out,phase:s.design==='recall'?`After about ${s.delay} seconds of other work, recall of a short code drops to roughly ${Math.round(H4_recallAt(s.delay))}%. The figures are approximate readings of the classic curve.`:'Showing the code where it is needed turns a memory task into a recognition task, which barely depends on time.'};
 }});

/* ---------------- Lesson: Affordances ---------------- */
const H4_HW={plate:{say:'push',label:'Flat plate'},handle:{say:'pull',label:'Pull handle'},bar:{say:'either',label:'Horizontal bar'}};
SCENE({id:'affordances',name:'Affordances and Norman doors',tag:'What can I do here?',
 definition:'An affordance is an action the environment makes possible for someone. Design succeeds when the visible form signals the right action without a label.',
 example:'A flat metal plate can only be pushed. A vertical handle invites pulling. A door with a handle that must be pushed needs a sign, and people still pull it.',
 desc:'A door with a chosen piece of hardware and a chosen opening direction; pressing Push or Pull shows whether the door opens, with a count of mistakes.',
 research:'Gibson, J. J. (1979). The Ecological Approach to Visual Perception. Houghton Mifflin. Norman, D. A. (1988). The Psychology of Everyday Things. Basic Books.',
 dur:12,hint:'Pick the hardware and which way the door really opens, then try Push or Pull as a passer-by would.',
 init:()=>({hw:'handle',opens:'push',sign:false,tries:0,errors:0,last:null}),
 watch(p){const cases=[['plate','push','push'],['handle','pull','pull'],['handle','push','pull'],['bar','push','pull']],i=Math.min(3,Math.floor(p*4)),[hw,opens,act]=cases[i];return {hw,opens,sign:false,tries:0,errors:0,last:(p*4-i)>.35?act:null}},
 ui:[{choose:[['plate','Flat plate'],['handle','Pull handle'],['bar','Bar']],label:'Hardware',get:s=>s.hw,act:'hw'},{choose:[['push','Opens by push'],['pull','Opens by pull']],label:'Door opens by',get:s=>s.opens,act:'opens'},{b:'Push',act:'try',arg:'push'},{b:'Pull',act:'try',arg:'pull'},{b:'Add a sign',act:'sign'}],
 on:{hw(s,v){s.hw=v;s.last=null},opens(s,v){s.opens=v;s.last=null},sign(s){s.sign=!s.sign},try(s,a){s.last=a;s.tries++;if(a!==s.opens)s.errors++}},
 draw(s){
  let out=heading('The hardware tells you what to do');const ok=s.last&&s.last===s.opens,say=H4_HW[s.hw].say;
  const open=ok?(s.opens==='push'?-24:24):0;
  out+=R(120,60,170,280,C.grid,'none',4)+`<g transform="translate(${open*.3} 0)">`+R(130+(open<0?6:0),68,150-Math.abs(open),264,'#e9d9c4',C.amber,4)+'</g>';
  const hx=250;if(s.hw==='plate')out+=R(hx-12,170,28,60,'#c8d2d8',C.muted,3);else if(s.hw==='handle')out+=R(hx-2,160,10,80,C.dark,'none',5)+L(hx-8,166,hx+3,166,C.dark,4)+L(hx-8,234,hx+3,234,C.dark,4);else out+=R(140,192,130,12,C.dark,'none',6);
  if(s.sign)out+=R(150,120,80,26,'#fff',C.ink,3)+TB(190,138,s.opens.toUpperCase(),14,C.ink);
  if(s.last)out+=arrow(s.last==='push'?60:110,214,s.last==='push'?110:60,214,ok?C.green:C.coral,4)+TB(85,250,s.last,15,ok?C.green:C.coral);
  out+=R(330,70,250,240,'#fff',C.grid,10);
  out+=TF(350,102,'Hardware says',14,C.muted,'start')+TB(560,102,say,16,say==='either'?C.purple:C.blue,'end');
  out+=TF(350,132,'Door actually opens by',14,C.muted,'start')+TB(560,132,s.opens,16,C.ink,'end');
  const mismatch=say!=='either'&&say!==s.opens;
  out+=R(346,150,218,48,mismatch?C.coralp:say==='either'?C.purplep:C.greenp,'none',8)+TB(455,180,mismatch?'A “Norman door”':say==='either'?'Ambiguous hardware':'Form matches action',15,mismatch?C.coral:say==='either'?C.purple:C.green);
  if(s.last)out+=TB(455,232,ok?'It opens':'Bump: it does not move',17,ok?C.green:C.coral);
  out+=T(455,280,s.tries?`${s.errors} wrong of ${s.tries} tries`:'',14,C.muted);
  return {svg:out,phase:mismatch?`The ${H4_HW[s.hw].label.toLowerCase()} invites people to ${say}, but the door needs a ${s.opens}. ${s.sign?'The sign helps, but people act on the hardware before they read.':'Add a sign and notice that the design, not the user, is the problem.'}`:say==='either'?'A bar across the door could be pushed or pulled, so people guess. Good hardware leaves only one sensible action.':'The visible form matches the action: no sign is needed.'};
 }});

const H4_UI=[{t:'Save',k:'btn',c:true,x:60,y:250},{t:'Cancel',k:'btn',c:true,x:180,y:250},{t:'Account',k:'head',c:false,x:60,y:80},{t:'Settings',k:'link',c:true,x:420,y:80},{t:'Email address',k:'label',c:false,x:60,y:130},{t:'New',k:'tag',c:false,x:300,y:80},{t:'Learn more',k:'link',c:true,x:320,y:250},{t:'Saved 2 min ago',k:'status',c:false,x:420,y:180}];
function H4_uiEl(e,style){
 const w=Math.max(70,e.t.length*9+24),flat=style==='flat';
 if(e.k==='btn')return flat?R(e.x,e.y,w,34,C.pale,'none',2)+T(e.x+w/2,e.y+22,e.t,15,C.blue):R(e.x,e.y+3,w,34,'#0e3b5c','none',8)+R(e.x,e.y,w,34,C.blue,'none',8)+T(e.x+w/2,e.y+22,e.t,15,'#fff','middle','font-weight="650"');
 if(e.k==='link')return T(e.x,e.y+22,e.t,15,C.blue,'start',flat?'':'text-decoration="underline"');
 if(e.k==='tag')return R(e.x,e.y+4,48,26,flat?C.pale:C.amberp,'none',flat?2:13)+T(e.x+24,e.y+22,e.t,13,flat?C.blue:C.amber,'middle','font-weight="650"');
 if(e.k==='head')return T(e.x,e.y+24,e.t,20,flat?C.blue:C.ink,'start','font-weight="700"');
 if(e.k==='label')return T(e.x,e.y+20,e.t,14,C.muted,'start')+R(e.x,e.y+28,300,30,'#fff',C.line,4);
 return T(e.x,e.y+20,e.t,14,flat?C.blue:C.muted,'start');
}
SCENE({id:'affordances-signifiers',name:'Signifiers on screen',tag:'Can I click that?',
 definition:'On a screen nothing physically affords pressing, so designers add signifiers: depth, underlines, colour and shape that announce what can be clicked.',
 example:'When buttons are flat coloured text and headings use the same colour as links, people hover and hesitate before they act.',
 desc:'A mock settings screen drawn in a flat style or with clear signifiers; the learner marks what they think is clickable and then reveals the answers.',
 research:'Norman, D. A. (2013). The Design of Everyday Things (revised edn), on signifiers. Meyer, K. (2017). Flat UI elements attract less attention and cause uncertainty. Nielsen Norman Group eye-tracking study.',
 dur:12,hint:'Choose a style, press each element you think is clickable, then Reveal. Try the flat style first.',
 init:()=>({style:'flat',guess:[],shown:false}),
 watch(p){return {style:p<.5?'flat':'clear',guess:[],shown:(p*2)%1>.6}},
 ui:[{choose:[['flat','Flat style'],['clear','Clear signifiers']],label:'Style',get:s=>s.style,act:'style'},{b:'Reveal',act:'reveal'},{b:'Clear guesses',act:'clear'}],
 on:{style(s,v){s.style=v;s.guess=[];s.shown=false},reveal(s){s.shown=true},clear(s){s.guess=[];s.shown=false},el(s,i){i=Number(i);s.shown=false;s.guess=s.guess.includes(i)?s.guess.filter(x=>x!==i):s.guess.concat(i)}},
 draw(s,f,X){
  let out=heading(s.style==='flat'?'Flat: everything looks alike':'Clear signifiers');out+=R(40,62,520,232,'#fff',C.line,10);
  H4_UI.forEach((e,i)=>{const g=s.guess.includes(i),w=Math.max(70,e.t.length*9+24);let inner=H4_uiEl(e,s.style);
   if(g)inner+=R(e.x-6,e.y-4,(e.k==='label'?312:w)+12,(e.k==='label'?66:42),'none',C.purple,8,'stroke-dasharray="5 3"');
   if(s.shown)inner+=TB(e.x+(e.k==='label'?306:w)+4,e.y+14,e.c?'✓':'✗',14,e.c?C.green:C.muted,'start');
   out+=hit(X,'el',i,`${e.t}: mark as ${g?'not ':''}clickable`,inner)});
  const hits=s.guess.filter(i=>H4_UI[i].c).length,fa=s.guess.filter(i=>!H4_UI[i].c).length,tot=H4_UI.filter(e=>e.c).length;
  out+=s.shown?TB(300,330,`Found ${hits} of ${tot} clickable · ${fa} false alarm${fa===1?'':'s'}`,16,hits===tot&&!fa?C.green:C.coral):T(300,330,'Mark what you think you can click, then press Reveal.',15,C.muted);
  return {svg:out,phase:s.style==='flat'?'In the flat style, the heading, the “New” tag and the status line share the link colour, and the buttons have no depth. Eye-tracking work found flat, weakly signified elements took longer to find and drew more uncertain looks.':'Depth and a filled colour say “button”, underlines say “link”, and grey text says “information only”. Each signifier answers “what can I do here?” before you try.'};
 }});

const H4_BURN=[['back left',150,110],['back right',260,110],['front left',150,200],['front right',260,200]];
SCENE({id:'affordances-mapping',name:'Natural mapping',tag:'Controls laid out like what they control',
 definition:'Natural mapping arranges controls in the same spatial layout as the things they control, so the right control needs no label.',
 example:'Four knobs in a row for four burners in a square force you to read labels. Knobs laid out in a square, like the burners, are understood at once.',
 desc:'A hob with four burners and four knobs, either in a row or in the same square layout; a lit burner asks which knob controls it, and errors and times are recorded.',
 research:'Chapanis, A. & Lindenbaum, L. E. (1959). A reaction time study of four control-display linkages. Human Factors, 1(4), 1–7. Norman, D. A. (1988). The Psychology of Everyday Things.',
 dur:12,hint:'Choose a knob layout, press New burner, then click the knob for the lit burner. Compare errors between layouts.',
 init:()=>({layout:'row',target:null,t0:0,res:{row:[],square:[]},last:null}),
 watch(p){const k=Math.floor(p*8),layout=k<4?'row':'square';return {layout,target:k%4,res:{row:[],square:[]},last:(p*8-k)>.5?{knob:layout==='row'&&k%4===2?1:k%4,ok:!(layout==='row'&&k%4===2)}:null,sim:true}},
 ui:[{choose:[['row','Knobs in a row'],['square','Knobs in a square']],label:'Layout',get:s=>s.layout,act:'layout'},{b:'New burner',act:'next'}],
 on:{layout(s,v){s.layout=v;s.target=null;s.last=null},next(s){s.target=Math.floor(rng(nextSeed())()*4);s.t0=H4_now();s.last=null},
  knob(s,i){if(s.target===null)return 'keep';i=Number(i);const ok=i===s.target;s.res[s.layout].push({ok,rt:H4_now()-s.t0});s.last={knob:i,ok};s.target=null}},
 draw(s,f,X){
  let out=heading('Which knob lights this burner?');out+=R(90,70,240,180,C.dark,'none',12);
  H4_BURN.forEach(([n,x,y],i)=>out+=Ci(x,y,34,i===s.target||(s.last&&i===s.last.knob&&s.last.ok)?C.coral:'#56636b','#2a3439')+Ci(x,y,16,'none','#73818a'));
  // Row order follows a common real-world row layout: BL, FL, FR, BR.
  const rowOrder=[0,2,3,1];const knobs=s.layout==='row'?rowOrder.map((b,j)=>[b,120+j*60,300]):[[0,165,278],[1,255,278],[2,165,330],[3,255,330]];
  out+=R(90,256,240,104,'#e8edf0','none',10);
  knobs.forEach(([b,x,y])=>{const lit=s.last&&s.last.knob===b,inner=Ci(x,y,17,lit?(s.last.ok?C.green:C.coral):'#fff',C.dark)+L(x,y,x,y-12,C.dark,3);out+=hit(X,'knob',b,`Knob for ${H4_BURN[b][0]}`,inner)});
  const stat=k=>{const r=s.res[k];return r.length?`${r.filter(t=>!t.ok).length} errors in ${r.length} · ${H4_ms(H4_mean(r.map(t=>t.rt)))}`:'no trials yet'};
  out+=R(360,80,220,160,'#fff',C.grid,8)+TB(470,106,'Your results',14,C.muted)+T(380,140,'Row',15,C.ink,'start')+TF(380,160,stat('row'),12,C.muted,'start')+T(380,196,'Square',15,C.ink,'start')+TF(380,216,stat('square'),12,C.muted,'start');
  if(s.last)out+=TB(470,276,s.last.ok?'Right knob':'Wrong burner',16,s.last.ok?C.green:C.coral);
  return {svg:out,phase:s.layout==='row'?'With knobs in a row, the mapping from four positions in a square to four in a line must be learned or read. In Chapanis and Lindenbaum’s study, layouts that matched the burners spatially produced the fewest errors.':'With the knobs arranged like the burners, the position of the knob is its label: no learning, no reading.'};
 }});

/* ---------------- Lesson: Mental models ---------------- */
function H4_temp(t,set){const reach=(set-15)/0.5;return set<=15?15:t<reach?15+0.5*t:set}
SCENE({id:'mental-models',name:'The thermostat myth',tag:'Two theories of heat',
 definition:'A mental model is the user’s own theory of how a system works. Wrong models lead to sensible-looking actions that do not help.',
 example:'Many people turn a thermostat right up to warm a cold room faster, as if it were a valve. A simple on–off heating system works the same at any setting: a higher one only means it stays on longer, overshooting. (Some modern boilers and heat pumps do vary their output.)',
 desc:'Room temperature over time for two thermostat settings under the real on–off behaviour, with an optional dashed line showing what the valve theory predicts.',
 research:'Kempton, W. (1986). Two theories of home heat control. Cognitive Science, 10, 75–90. Norman, D. A. (1988). The Psychology of Everyday Things.',
 dur:10,hint:'Move the setting and switch the valve theory on and off. When does the room reach 20 °C?',
 init:()=>({set:28,valve:true}),
 watch(p){return {set:Math.round(20+10*smooth(p)),valve:p>.3}},
 ui:[{range:'set',label:'Thermostat setting (°C)',min:20,max:30,get:s=>s.set,act:'set'},{b:'Valve theory on/off',act:'valve'}],
 on:{set(s,v){s.set=v},valve(s){s.valve=!s.valve}},
 draw(s){
  let out=heading('Turning it up does not heat the room faster');const gx=40,gy=56,gw=380,gh=260,px=t=>gx+40+t/40*(gw-60),py=v=>gy+gh-30-(v-14)/18*(gh-50);
  out+=R(gx,gy,gw,gh,'#fff',C.grid,8);for(const v of [15,20,25,30])out+=L(gx+36,py(v),gx+gw-10,py(v),C.grid,1)+TF(gx+30,py(v)+4,v+'°',11,C.muted,'end');for(const t of [0,10,20,30,40])out+=TF(px(t),gy+gh-10,t+' min',11,C.muted);
  out+=L(gx+36,py(20),gx+gw-10,py(20),C.green,1.5,'stroke-dasharray="6 4"')+TF(gx+gw-14,py(20)-5,'comfortable 20°',11,C.green,'end');
  const curve=set=>'M'+range(41).map(t=>fmt(px(t))+' '+fmt(py(H4_temp(t,set)))).join('L');
  out+=P(curve(20),C.blue,3)+P(curve(s.set),C.coral,3);
  if(s.valve){const rate=0.5*(s.set-15)/5;out+=P(`M${fmt(px(0))} ${fmt(py(15))}L${fmt(px(Math.min(40,(s.set-15)/rate)))} ${fmt(py(s.set))}`,C.purple,2.5,'none','stroke-dasharray="7 5"')}
  const t20=10;out+=Ci(px(t20),py(20),6,C.ink);
  out+=R(440,70,140,230,'#fff',C.grid,8)+TB(510,96,'Reaches 20°',14,C.muted)+TB(510,124,'after 10 min',17,C.ink)+T(510,146,'at any setting',13,C.muted);
  out+=L(456,172,476,172,C.blue,3)+TF(482,176,'set 20°',12,C.ink,'start')+L(456,198,476,198,C.coral,3)+TF(482,202,'set '+s.set+'°',12,C.ink,'start');
  if(s.valve)out+=L(456,224,476,224,C.purple,2.5,'stroke-dasharray="6 4"')+TF(482,228,'valve belief',12,C.ink,'start');
  out+=TF(510,268,s.set>22?`overshoots by ${s.set-20}°`:'',13,C.coral);
  return {svg:out,phase:s.valve?'The dashed line is the valve theory: a higher setting would pour in heat faster. In an on–off system both real curves rise at the same rate; the higher setting only overshoots and wastes energy.':'Under the real feedback model the heater is either on or off. The setting chooses when it stops, not how hard it works.'};
 }});

const H4_STAGES=['Goal','Plan','Specify','Perform','Perceive','Interpret','Compare'];
const H4_VARIANTS={clear:{name:'Clear design',ex:1,ev:1,notes:['Show slides on the projector.','Press the power button, then choose input.','The power key is labelled and lit.','Press it.','A light turns amber, then green.','Amber means warming up; green means on.','Picture appears: goal met.']},
 hidden:{name:'Hidden controls',ex:4,ev:1,notes:['Show slides on the projector.','Find a way to switch it on…','The remote has 40 unlabelled buttons.','Try several in turn.','A light changes.','Was that power, or input?','Not sure the goal is met.']},
 silent:{name:'No feedback',ex:1,ev:4,notes:['Show slides on the projector.','Press the power button.','The power key is labelled.','Press it.','Nothing visible for 30 seconds.','Did it work? Is it broken?','Many press again, switching it off.']}};
SCENE({id:'mental-models-gulfs',name:'The two gulfs',tag:'Seven stages of action',
 definition:'Using a system means crossing two gulfs: the gulf of execution (working out how to act) and the gulf of evaluation (working out what happened).',
 example:'A projector with an unlabelled remote widens the gulf of execution; one that shows no light while warming up widens the gulf of evaluation, so people press the button again.',
 desc:'Seven stages of action from goal to comparison, with the gulfs of execution and evaluation drawn as gaps whose width depends on the chosen design.',
 research:'Norman, D. A. (1986). Cognitive engineering. In D. A. Norman & S. W. Draper (eds), User Centered System Design. Erlbaum. Hutchins, E. L., Hollan, J. D. & Norman, D. A. (1985). Direct manipulation interfaces. Human–Computer Interaction, 1, 311–338.',
 dur:12,hint:'Choose a design and step through the seven stages. Watch which gulf widens.',
 init:()=>({v:'silent'}),
 ui:[{choose:[['clear','Clear design'],['hidden','Hidden controls'],['silent','No feedback']],label:'Design',get:s=>s.v,act:'v'}],
 on:{v(s,v){s.v=v}},
 trace(s){return H4_STAGES.map((st,i)=>({i,say:`${st}: ${H4_VARIANTS[s.v].notes[i]}`}))},
 draw(s,f,X){
  const v=H4_VARIANTS[s.v];let out=heading(v.name+': turning on a projector');
  out+=R(30,60,120,260,C.pale,'none',12)+TB(90,86,'Doing',15,C.blue)+R(450,60,120,260,C.greenp,'none',12)+TB(510,86,'Checking',15,C.green);
  const gapW=g=>40+g*30;
  const exW=gapW(v.ex),evW=gapW(v.ev);
  // All seven stages are the person's. Execution runs down the left (doing) and across the bottom; evaluation returns up the right (checking) and across the top.
  out+=R(300-evW/2,128,evW,40,v.ev>1?C.coralp:'#f1f4f6',v.ev>1?C.coral:C.grid,8)+TB(300,153,'gulf of evaluation',13,v.ev>1?C.coral:C.muted);
  out+=R(300-exW/2,236,exW,40,v.ex>1?C.coralp:'#f1f4f6',v.ex>1?C.coral:C.grid,8)+TB(300,261,'gulf of execution',13,v.ex>1?C.coral:C.muted);
  out+=arrow(450,113,150,113,C.green,2.5)+arrow(150,300,450,300,C.blue,2.5)+TF(300,105,'evaluation: what happened?',12,C.green)+TF(300,318,'execution: how do I do it?',12,C.blue);
  H4_STAGES.forEach((st,i)=>{const left=i<4,y=left?110+i*44:290-(i-4)*44;const x=left?40:40;const on=i===f.i,done=i<f.i;
   if(i<4)out+=R(42,98+i*48,96,30,on?C.blue:done?'#cfe2f1':'#fff',C.blue,15)+TF(90,118+i*48,st,13,on?'#fff':C.ink);
   else out+=R(462,98+(6-i)*48,96,30,on?C.green:done?'#cfe9e2':'#fff',C.green,15)+TF(510,118+(6-i)*48,st,13,on?'#fff':C.ink)});
  out+=R(160,186,280,38,'#fff',C.grid,8)+TF(300,210,v.notes[f.i],13,C.ink);
  return {svg:out,phase:f.say+(f.i===6?(s.v==='clear'?' Both gulfs are narrow: the person knew what to do and could see it work.':s.v==='hidden'?' The gulf of execution was wide: the right action was not visible.':' The gulf of evaluation was wide: the system gave no sign that it had heard.'):'')};
 }});

SCENE({id:'mental-models-errors',name:'Slips, mistakes and modes',tag:'Why good people press the wrong key',
 definition:'A slip is a right intention carried out wrongly; a mistake is a wrong intention. Mode errors are slips caused by a hidden state that changes what an action does.',
 example:'Typing a password with Caps Lock on is a mode error: the action is right, but an invisible mode changes its effect.',
 desc:'A sign-in box with a Caps Lock key whose state may be hidden or shown; attempts are logged and classified.',
 research:'Norman, D. A. (1981). Categorization of action slips. Psychological Review, 88(1), 1–15. Reason, J. (1990). Human Error. Cambridge University Press.',
 dur:10,hint:'The password is “secret”. Toggle Caps Lock, type, and Sign in. Then show the mode indicator and try again.',
 init:()=>({caps:true,show:false,typed:'secret',log:[]}),
 watch(p){return {caps:p<.6,show:p>.4,typed:'secret',log:p<.3?[]:p<.6?[{ok:false,caps:true,shown:false}]:[{ok:false,caps:true,shown:false},{ok:true,caps:false,shown:true}]}},
 ui:[{b:'Caps Lock',act:'caps'},{b:'Mode indicator on/off',act:'show'},{text:'Type',label:'Password',get:s=>s.typed,act:'type',max:12},{b:'Sign in',act:'go'}],
 on:{caps(s){s.caps=!s.caps},show(s){s.show=!s.show},type(s,v){s.typed=String(v).toLowerCase()},go(s){const sent=s.caps?s.typed.toUpperCase():s.typed;s.log.push({ok:sent==='secret',caps:s.caps,shown:s.show});if(s.log.length>6)s.log.shift()}},
 draw(s){
  let out=heading('The same keys, a different result');const sent=s.caps?s.typed.toUpperCase():s.typed;
  out+=R(40,60,320,190,'#fff',C.line,12)+TB(200,90,'Sign in',17,C.ink)+T(70,126,'Password',14,C.muted,'start')+R(70,136,260,38,'#fff',C.line,6)+TM(84,161,'•'.repeat(Math.min(12,sent.length)),18,C.ink,'start');
  if(s.show&&s.caps)out+=R(232,142,90,26,C.amberp,C.amber,6)+TF(277,160,'⇪ Caps on',12,C.amber);
  out+=TF(70,196,'What the computer receives:',12,C.muted,'start')+TMF(70,218,sent||'(nothing)',15,sent==='secret'?C.green:C.coral,'start','font-weight="700"');
  out+=R(380,60,200,190,'#fff',C.grid,10)+TB(480,86,'Attempts',14,C.muted);
  s.log.forEach((a,i)=>out+=TF(396,112+i*22,(a.ok?'✓ signed in':'✗ refused')+(a.caps?' · caps on':'')+(a.shown?' · shown':''),12,a.ok?C.green:C.coral,'start'));
  const types=[['Mode error','right action, hidden state',C.coral],['Capture slip','familiar habit takes over',C.purple],['Mistake','wrong goal or plan',C.blue]];
  types.forEach(([n,d,c],i)=>out+=R(40+i*182,270,170,70,i===0&&s.caps&&!s.show?C.coralp:'#fff',c,8)+TB(125+i*182,296,n,14,c)+TF(125+i*182,318,d,12,C.ink));
  return {svg:out,phase:s.caps&&!s.show?'Caps Lock is on but nothing says so. Typing the right password still fails: a classic mode error. Blaming the user misses that the state was invisible.':s.caps?'The indicator makes the mode visible at the moment it matters, so the slip can be caught before pressing Sign in.':'With Caps Lock off, the intended action has the intended result.'};
 }});

/* ---------------- Lesson: Change blindness ---------------- */
// A desk scene drawn from simple parts; one part differs between versions A and B.
const H4_CHANGES=[{part:'mug',what:'the mug changed colour'},{part:'plant',what:'a leaf disappeared from the plant'},{part:'clock',what:'the clock hand moved'},{part:'frame',what:'the picture frame vanished'},{part:'book',what:'the top book changed colour'}];
function H4_desk(change,b,X,act){
 const ch=b?H4_CHANGES[change].part:null,part=(id,inner)=>act?hit(X,act,id,'The '+id,inner+R(...H4_BOX[id],'transparent','none',4)):inner;let out='';
 out+=R(30,60,540,270,'#f6efe4','none',10)+R(30,250,540,80,'#d9c3a3','none',0)+R(70,80,150,110,'#cfe4f2',C.line,4)+L(145,80,145,190,C.line,2)+L(70,135,220,135,C.line,2);
 out+=part('frame',ch==='frame'?'':R(260,84,90,70,'#fff',C.amber,3)+P('M272 140L298 112L318 132L330 120L340 140Z',C.green,1.5,C.greenp));
 out+=part('clock',Ci(440,118,34,'#fff',C.dark)+L(440,118,440,94,C.dark,3)+(ch==='clock'?L(440,118,462,124,C.dark,3):L(440,118,456,132,C.dark,3)));
 out+=part('mug',R(110,214,40,44,ch==='mug'?C.coral:C.blue,'none',6)+P('M150 224Q166 236 150 248',ch==='mug'?C.coral:C.blue,4));
 out+=part('plant',R(470,226,46,34,'#b46a3c','none',4)+P('M493 226Q470 190 486 168',C.green,4)+P('M493 226Q514 196 506 172',C.green,4)+(ch==='plant'?'':P('M493 226Q526 214 534 192',C.green,4)));
 out+=part('book',R(260,236,120,16,C.purple,'none',2)+R(266,220,108,16,ch==='book'?C.amber:C.coral,'none',2));
 return out;
}
const H4_BOX={frame:[254,78,102,82],clock:[400,78,80,80],mug:[100,206,72,58],plant:[462,160,80,104],book:[254,214,132,42]};
SCENE({id:'change-blindness',name:'Change blindness',tag:'Be the participant',
 definition:'When a brief blank separates two versions of a scene, even large changes become hard to see: we do not keep a detailed copy of what we are not attending to.',
 example:'In the flicker task, a picture and a slightly altered copy alternate with a blank in between. People often need many cycles to spot a change that is obvious once seen.',
 desc:'A drawn desk scene alternating with an altered copy, with or without a blank between them; the learner clicks the part that changes.',
 research:'Rensink, R. A., O’Regan, J. K. & Clark, J. J. (1997). To see or not to see: the need for attention to perceive changes in scenes. Psychological Science, 8, 368–373.',
 dur:14,hint:'Press New change, which starts the flicker, then click the part that changes. Turn the blank off to see how easy it becomes.',
 init:()=>({blank:true,change:0,t0:0,found:null,results:[]}),
 ui:[{choose:[['true','With blank'],['false','No blank']],label:'Blank between',get:s=>String(s.blank),act:'blank'},{b:'New change',act:'next'}],
 on:{blank(s,v){s.blank=v==='true'||v===true;s.found=null;return 'run'},next(s){s.change=(s.change+1+Math.floor(rng(nextSeed())()*3))%H4_CHANGES.length;s.t0=H4_now();s.found=null;return 'run'},
  pick(s,part){const ok=part===H4_CHANGES[s.change].part;s.found={part,ok,ms:H4_now()-s.t0};if(ok)s.results.push({blank:s.blank,ms:s.found.ms});return ok?'end':'keep'}},
 trace(s){const fr=[];for(let k=0;k<40;k++){const ph=s.blank?k%4:(k%2)*2;fr.push({k,b:ph===2,blank:ph===1||ph===3})}fr.push({k:40,b:true,blank:false,reveal:true});return fr},
 draw(s,f,X){
  let out=heading(f.reveal?'The change: '+H4_CHANGES[s.change].what:'What changes between the pictures?');
  out+=f.blank?R(30,60,540,270,'#8f969a','none',10):H4_desk(s.change,f.b,X,'pick');
  if(f.reveal)out+=R(...H4_BOX[H4_CHANGES[s.change].part].map((v,i)=>i<2?v-4:v+8),'none',C.coral,8,'stroke-width="4"');
  const res=b=>{const r=s.results.filter(t=>t.blank===b);return r.length?(H4_mean(r.map(t=>t.ms))/1000).toFixed(1)+' s':'—'};
  out+=T(300,356,s.found?(s.found.ok?`Found in ${(s.found.ms/1000).toFixed(1)} s`:'Not that one — keep looking'):`Your mean time: with blank ${res(true)}, without ${res(false)}`,14,s.found?(s.found.ok?C.green:C.coral):C.muted);
  return {svg:out,phase:f.reveal?'Without the blank, the change creates a local flicker of motion that grabs attention at once. With the blank, every part of the scene flickers, so the change has no special signal and you must check parts one by one.':s.blank?'The blank wipes out the motion signal of the change. (The real experiments used about 240 ms per picture and 80 ms blanks; here each frame lasts longer.)':'With no blank, the change appears as motion, and motion pops out.'};
 }});

// Shapes bouncing in a box (after Most et al., 2001): count the white shapes' bounces.
const H4_MOVERS=[[60,80,1.3,.9,'#fff','c'],[300,140,-1.1,1.2,'#fff','s'],[180,250,.9,-1.3,'#fff','c'],[420,200,-1.4,-.8,'#fff','s'],[120,180,1.2,1.1,C.dark,'s'],[360,90,-.9,1.3,C.dark,'c'],[240,300,1.4,-.7,C.dark,'c'],[480,280,-1.2,-1.1,C.dark,'s']];
function H4_pos(m,t){const [x0,y0,vx,vy]=m,W=470,H=230,fold=(v,L)=>{v=((v%(2*L))+2*L)%(2*L);return v>L?2*L-v:v};const x=fold(x0-45+vx*t*12,W),y=fold(y0-70+vy*t*12,H);return [55+x,75+y]}
function H4_bounces(m,t){const [x0,y0,vx,vy]=m;return Math.floor(Math.abs(x0-45+vx*t*12)/470+ (x0-45+vx*t*12<0?1:0))+Math.floor(Math.abs(y0-70+vy*t*12)/230+(y0-70+vy*t*12<0?1:0))}
SCENE({id:'change-blindness-inattention',name:'Inattentional blindness',tag:'Looking is not seeing',
 definition:'When attention is busy with a demanding task, people often fail to notice an unexpected object, even one that passes right through the middle of the screen.',
 example:'Counting the white shapes’ bounces, many people miss a grey cross that slides across the display. Without the task, everyone sees it.',
 desc:'White and black shapes bounce inside a box while a grey cross crosses the middle part way through; at the end the learner is asked whether they noticed anything else.',
 research:'Most, S. B., Simons, D. J., Scholl, B. J., Jimenez, R., Clifford, E. & Chabris, C. F. (2001). How not to be seen. Psychological Science, 12, 9–17. Simons, D. J. & Chabris, C. F. (1999). Gorillas in our midst. Perception, 28, 1059–1074.',
 dur:16,hint:'Press Run and count how many times the white shapes touch the edge. At the end, say whether you saw anything else.',
 init:()=>({answer:null}),
 on:{yes(s){s.answer='yes';return 'end'},no(s){s.answer='no';return 'end'}},
 ui:[{b:'I saw something else',act:'yes'},{b:'Nothing else',act:'no'}],
 trace(s){return range(37).map(k=>({k,end:k===36}))},
 draw(s,f,X){
  const t=X.try?(f.k>0?f.k-1+X.u:0):f.k+X.u*(f.end?0:1);let out=heading(f.end?'Did you notice anything unusual?':'Count the white shapes’ bounces');
  out+=R(40,60,500,260,'#5c6870','none',8);
  const crossOn=t>=12&&t<=24;if(crossOn||f.end){const cx=f.end?290:560-(t-12)*40;out+=`<g opacity="${f.end?.5:1}">`+R(cx-22,184,44,12,'#b8bec2','none',2)+R(cx-6,168,12,44,'#b8bec2','none',2)+'</g>';if(f.end)out+=arrow(520,190,80,190,C.amber,2.5)+TF(300,222,'a grey cross crossed here',13,'#ffe7b0')}
  H4_MOVERS.forEach(m=>{const [x,y]=H4_pos(m,t);out+=m[5]==='c'?Ci(x,y,12,m[4],m[4]==='#fff'?'none':'#222'):R(x-12,y-12,24,24,m[4],'none',2)});
  const whites=H4_MOVERS.filter(m=>m[4]==='#fff');const count=sum(whites.map(m=>H4_bounces(m,t)));
  if(f.end)out+=TB(300,348,`White bounces: ${count}`+(s.answer?` · You answered “${s.answer==='yes'?'I saw something':'nothing else'}”`:''),15,C.ink);
  else out+=T(300,348,'Keep your eyes on the white shapes',14,C.muted);
  return {svg:out,phase:f.end?'Did you see the cross? In studies like Most et al. (2001), many people tracking the white shapes missed an unexpected object. Being similar to the ignored black shapes made it even easier to miss.':'Attention is a selective spotlight: what it is tuned to ignore can pass unnoticed, even at the centre of the screen.'};
 }});

function H4_dash(seed){const r=rng(seed);return range(12).map(()=>10+Math.floor(r()*90))}
SCENE({id:'change-blindness-design',name:'Making changes noticeable',tag:'Design for attention',
 definition:'Because people miss changes outside their attention, interfaces should mark what changed: a highlight that persists, a badge, or a short transition.',
 example:'A dashboard that silently updates one number among twelve leaves people hunting; the same update with a lasting highlight is found at once.',
 desc:'A dashboard of twelve values; pressing Refresh changes one of them, either silently or with a highlight, and the learner clicks the changed tile against the clock.',
 research:'Varakin, D. A., Levin, D. T. & Fidler, R. (2004). Unseen and unaware: implications of recent research on failures of visual awareness for human–computer interface design. Human–Computer Interaction, 19, 389–422.',
 dur:12,hint:'Choose a cue, press Refresh, then click the tile that changed. Compare times for silent and highlighted updates.',
 init:()=>({cue:'silent',seed:3,vals:H4_dash(3),changed:null,t0:0,found:null,res:{silent:[],highlight:[]}}),
 watch(p){const vals=H4_dash(3),ch=7,v2=vals.slice();v2[ch]=vals[ch]+23;const cue=p<.5?'silent':'highlight';return {cue,vals:(p*2)%1>.25?v2:vals,changed:(p*2)%1>.25?ch:null,res:{silent:[],highlight:[]},found:(p*2)%1>.8?{i:ch,ok:true}:null,sim:true}},
 ui:[{choose:[['silent','Silent'],['highlight','Highlight']],label:'Cue',get:s=>s.cue,act:'cue'},{b:'Refresh',act:'refresh'}],
 on:{cue(s,v){s.cue=v;s.changed=null;s.found=null},refresh(s){const r=rng(nextSeed());s.changed=Math.floor(r()*12);s.vals=s.vals.slice();s.vals[s.changed]=(s.vals[s.changed]+17+Math.floor(r()*40))%100;s.t0=H4_now();s.found=null},
  tile(s,i){if(s.changed===null)return 'keep';i=Number(i);const ok=i===s.changed;s.found={i,ok};if(ok){s.res[s.cue].push(H4_now()-s.t0);s.changed=null}}},
 draw(s,f,X){
  let out=heading('One value changed. Which one?');
  s.vals.forEach((v,i)=>{const x=30+(i%4)*92,y=60+Math.floor(i/4)*88,hl=s.cue==='highlight'&&i===s.changed,got=s.found&&s.found.i===i;
   out+=hit(X,'tile',i,`Tile ${i+1}: ${v}`,R(x,y,84,78,hl?C.amberp:got?(s.found.ok?C.greenp:C.coralp):'#fff',hl?C.amber:C.grid,8)+TF(x+42,y+22,'metric '+(i+1),11,C.muted)+TB(x+42,y+56,v,24,C.ink))});
  out+=R(410,60,170,240,'#fff',C.grid,8)+TB(495,86,'Your times',14,C.muted);
  [['silent','Silent'],['highlight','Highlight']].forEach(([k,l],j)=>{const m=H4_mean(s.res[k]);out+=T(426,124+j*50,l,15,C.ink,'start')+TB(566,124+j*50,m===null?'—':(m/1000).toFixed(1)+' s',15,C.ink,'end')+TF(566,142+j*50,s.res[k].length+' runs',11,C.muted,'end')});
  if(s.found&&!s.found.ok)out+=TB(495,256,'Not that one',15,C.coral);
  out+=T(300,350,s.changed!==null?'Something changed. Find it.':'Press Refresh to update the dashboard.',14,C.muted);
  return {svg:out,phase:s.cue==='silent'?'A silent update gives no signal outside the place you happen to be looking, so you have to compare from memory, which is exactly what change blindness says we are bad at.':'A highlight that stays until noticed turns the change into a pop-out colour difference, so it no longer depends on catching the moment it happened.'};
 }});

/* ---------------- Lesson: Eye movements ---------------- */
const H4_SPOTS={f1:[150,120],f2:[300,110],f3:[450,125],b1:[150,210],b2:[300,205],b3:[450,215],sign:[300,300],pic:[520,70],door:[60,180]};
const H4_PATHS={free:['f2','f1','f3','f2','pic','b2','door','f1','sign','f3'],ages:['f1','f2','f3','f1','f2','f3','f2','f1','f3','f2'],clothes:['b1','b2','b3','f1','b1','b2','b3','b2','b1','b3'],read:['sign','sign','sign','sign','f2','sign','sign','pic','sign','sign']};
const H4_DUR=[240,310,190,280,220,350,200,260,230,300];
SCENE({id:'eye-movements',name:'Saccades and fixations',tag:'The eye jumps, then looks',
 definition:'The eyes do not glide over a scene: they make rapid jumps (saccades) between brief pauses (fixations), and we take in detail only during the pauses. Where we fixate depends on the task.',
 example:'Asked to judge people’s ages, viewers fixate faces again and again; asked to remember their clothes, the same viewers look at bodies instead.',
 desc:'A simple scene of three people with a sign and a picture; a scanpath of numbered fixations, sized by duration and linked by saccades, builds up for the chosen task.',
 research:'Yarbus, A. L. (1967). Eye Movements and Vision. Plenum Press. Rayner, K. (1998). Eye movements in reading and information processing: 20 years of research. Psychological Bulletin, 124, 372–422.',
 dur:12,hint:'Choose a viewing task and step through the fixations. Same picture, different paths.',
 init:()=>({task:'ages'}),
 ui:[{choose:[['free','Look freely'],['ages','Judge ages'],['clothes','Remember clothes'],['read','Read the sign']],label:'Task',get:s=>s.task,act:'task'}],
 on:{task(s,v){s.task=v}},
 trace(s){return H4_PATHS[s.task].map((sp,i)=>({i}))},
 draw(s,f,X){
  let out=heading('Same picture, different task');out+=R(30,50,540,290,'#f6f3ee','none',10);
  [[150,'#e7c9a9'],[300,'#d9b08c'],[450,'#c8996f']].forEach(([x,c],j)=>out+=Ci(x,120,26,c)+R(x-32,152,64,100,[C.blue,C.green,C.purple][j],'none',16));
  out+=R(230,284,140,36,'#fff',C.dark,4)+TF(300,307,'EXIT · Platform 2',13,C.dark)+R(498,60,46,32,C.amberp,C.amber,3)+R(40,140,40,120,'#d9c3a3','none',3);
  const path=H4_PATHS[s.task],k=f.i,pts=path.slice(0,k+1).map((sp,j)=>{const [x,y]=H4_SPOTS[sp];return [x+((j*37)%31)-15,y+((j*53)%25)-12]});
  pts.forEach((p,j)=>{if(j>0)out+=arrow(pts[j-1][0],pts[j-1][1],p[0],p[1],C.coral,2,7);});
  pts.forEach((p,j)=>out+=Ci(p[0],p[1],6+H4_DUR[j]/40,j===k?C.coral:'#c4523888','#fff')+TF(p[0],p[1]+4,j+1,11,'#fff'));
  const tot=sum(H4_DUR.slice(0,k+1));out+=T(300,362,`${k+1} fixations · ${tot} ms of looking · saccades take only about 20–40 ms each`,13,C.muted);
  return {svg:out,phase:`Fixation ${k+1} lasts about ${H4_DUR[k]} ms. The scanpath is illustrative, in the spirit of Yarbus’s recordings: the instructions, as well as the picture, decide where the eyes go.`};
 }});

const H4_TEXT='The eye sees fine detail only in a small central region, so reading is a series of short glances along the line.';
SCENE({id:'eye-movements-fovea',name:'The moving window',tag:'How much do you see at once?',
 definition:'During a fixation in reading, useful information comes from a small window: roughly 3–4 characters to the left of fixation and about 14–15 to the right, in left-to-right scripts.',
 example:'If text outside a window around the gaze is replaced by x’s, reading speed is normal once the window extends about 15 characters to the right, and slows when it is smaller.',
 desc:'A line of text in which only a window around the fixation point is legible and the rest is masked with x’s; the window size and fixation point can be changed.',
 research:'McConkie, G. W. & Rayner, K. (1975). The span of the effective stimulus during a fixation in reading. Perception & Psychophysics, 17, 578–586. Rayner, K. (1998). Eye movements in reading. Psychological Bulletin, 124.',
 dur:12,hint:'Click a word to fixate it, and shrink or grow the window to the right.',
 init:()=>({fix:8,right:15,left:4}),
 watch(p){const words=H4_starts();return {fix:words[Math.min(words.length-1,Math.floor(p*words.length))]+1,right:15,left:4}},
 ui:[{range:'right',label:'Window right',min:1,max:24,get:s=>s.right,act:'right'},{range:'left',label:'Window left',min:0,max:10,get:s=>s.left,act:'left'}],
 on:{right(s,v){s.right=v},left(s,v){s.left=v},word(s,i){s.fix=Number(i)+1;return 'keep'}},
 draw(s,f,X){
  let out=heading('Only a small window is read at each fixation');const lines=H4_lines(),cw=9.4;
  let base=0;lines.forEach((ln,li)=>{const y=100+li*56,x0=300-ln.length*cw/2;
   Array.from(ln).forEach((ch,ci)=>{const g=base+ci,d=g-s.fix,vis=d>=-s.left&&d<=s.right;out+=TMF(x0+ci*cw+cw/2,y,ch===' '?' ':vis?ch:'x',16,vis?C.ink:'#a9b4ba','middle',g===s.fix?'font-weight="800"':'')});
   H4_starts().filter(w=>w>=base&&w<base+ln.length).forEach(w=>{const ci=w-base,len=(H4_TEXT.slice(w).match(/^\S+/)||[''])[0].length;out+=hit(X,'word',w,'Fixate this word',R(x0+ci*cw,y-20,len*cw,28,'transparent','none',3))});
   if(s.fix>=base&&s.fix<base+ln.length){const fx=x0+(s.fix-base)*cw+cw/2;out+=`<polygon points="${fmt(fx)},${y+10} ${fmt(fx-6)},${y+22} ${fmt(fx+6)},${y+22}" fill="${C.coral}"/>`+R(fx-s.left*cw-cw/2,y-24,(s.left+s.right+1)*cw,34,'none',C.coral,6,'stroke-dasharray="4 3"')}
   base+=ln.length});
  const ok=s.right>=14;out+=R(110,276,380,60,ok?C.greenp:C.amberp,'none',10)+TB(300,302,ok?'Wide enough: reading speed is about normal':'Too narrow: reading slows down',15,ok?C.green:C.amber)+T(300,324,`window: ${s.left} left, ${s.right} right of fixation`,13,C.ink);
  return {svg:out,phase:'The asymmetry follows reading direction: readers of right-to-left scripts such as Hebrew show the larger span to the left. Interfaces benefit by putting key words early in a line, where they fall inside the window.'};
 }});
// Wrap the passage into lines of at most 44 characters, keeping each line's trailing space so indices stay aligned.
function H4_lines(){const out=[];let rest=H4_TEXT;while(rest.length>44){let cut=rest.lastIndexOf(' ',44);out.push(rest.slice(0,cut+1));rest=rest.slice(cut+1)}out.push(rest);return out}
function H4_starts(){const a=[];for(let i=0;i<H4_TEXT.length;i++)if(H4_TEXT[i]!==' '&&(i===0||H4_TEXT[i-1]===' '))a.push(i);return a}

SCENE({id:'eye-movements-acuity',name:'The sharp spot',tag:'Seeing in detail takes aiming',
 definition:'Only the fovea, about 2 degrees of visual angle at the centre of gaze, sees fine detail. Acuity falls steeply outside it, which is why the eyes must keep moving.',
 example:'At a normal viewing distance of 60 cm, the sharp zone on a screen is only about 2 cm across, roughly the width of a thumbnail held at arm’s length.',
 desc:'A side view of an eye looking at a screen, with the foveal and parafoveal cones; a front view shows how large the sharp zone is on the screen at the chosen distance. A 3D view shows the cones.',
 research:'Rayner, K. (1998). Eye movements in reading and information processing. Psychological Bulletin, 124, 372–422. Strasburger, H., Rentschler, I. & Jüttner, M. (2011). Peripheral vision and pattern recognition: a review. Journal of Vision, 11(5):13.',
 dur:10,hint:'Change the viewing distance and see the sharp zone grow on the screen.',
 init:()=>({d:60}),
 watch(p){return {d:Math.round(30+60*smooth(p))}},
 ui:[{range:'d',label:'Viewing distance (cm)',min:30,max:100,get:s=>s.d,act:'d'}],
 on:{d(s,v){s.d=v}},
 draw(s){
  let out=heading('The fovea covers about 2° of what you see');const r=a=>s.d*Math.tan(a*Math.PI/180);const fov=2*r(1),para=2*r(5);
  const ex=60,ey=200,sx=60+s.d*2.6;out+=Ci(ex,ey,18,'#fff',C.dark)+Ci(ex+12,ey,6,C.dark)+R(sx,90,8,220,C.dark,'none',2);
  const ray=(a,col,w)=>{const h=Math.tan(a*Math.PI/180)*(sx-ex)*1;return L(ex+12,ey,sx,ey-h*4,col,w)+L(ex+12,ey,sx,ey+h*4,col,w)};
  out+=ray(5,C.purple,1.5)+ray(1,C.coral,2.5)+TF((ex+sx)/2,ey-70,'angles drawn ×4 for visibility',11,C.muted)+TF((ex+sx)/2,ey+66,s.d+' cm',13,C.ink);
  const fx=470,fy=200,sc=6;out+=R(380,90,180,220,'#fff',C.line,6)+Ci(fx,fy,para/2*sc,C.purplep,C.purple)+Ci(fx,fy,Math.max(2,fov/2*sc),C.coralp,C.coral);
  out+=TF(470,112,'screen, actual proportions (1 cm = 6 units)',11,C.muted)+TF(470,292,`sharp zone ≈ ${fov.toFixed(1)} cm across`,13,C.coral)+TF(470,272,`parafovea ≈ ${para.toFixed(1)} cm`,12,C.purple);
  out+=T(300,350,'Outside the coral circle, detail and colour fall off steeply.',13,C.muted);
  return {svg:out,phase:`At ${s.d} cm, 2° spans about ${fov.toFixed(1)} cm of screen. A whole paragraph cannot be seen sharply at once, which is why a single glance cannot read a screen and important cues must be noticeable in peripheral vision.`};
 },
 three(s,f,X,project){
  const d=s.d,k=a=>d*Math.tan(a*Math.PI/180),P=project([[0,0,0],[0,d,0],[-25,d,-16],[25,d,16]]);let out='';
  const scr=[[-25,d,-16],[25,d,-16],[25,d,16],[-25,d,16]];out+=poly3(scr,P,'#ffffffcc',C.line);
  const ring=(rad,col,fill)=>{const pts=range(24).map(i=>{const a=i/24*Math.PI*2;return [rad*Math.cos(a),d,rad*Math.sin(a)]});return poly3(pts,P,fill,col)+[0,6,12,18].map(i=>line3([0,0,0],pts[i],P,col,1.4)).join('')};
  out+=ring(k(10),C.line,'#e7eef3aa')+ring(k(5),C.purple,'#ece6f6cc')+ring(k(1),C.coral,'#f9e2d9');
  out+=point3([0,0,0],P,C.dark,9)+(()=>{const p=P([k(10),d,0]);return label3(p[0]+40,p[1],'10°',13,C.muted)})();
  return {svg:out,title:'Gaze cones in 3D',caption:`Cones of 2° (coral), 10° (purple) and 20° (grey) from the eye to a screen ${d} cm away, drawn to scale. The sharp cone is a thin needle.`};
 }});
