/* ===================== Era 5 · Seeing data (1960s–2000s) ===================== */
// Colour helpers (sRGB hex ↔ components, linear light, relative luminance, interpolation along stops).
const H5_rgb=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
const H5_hex=c=>'#'+c.map(v=>pad(Math.round(clamp(v,0,255)).toString(16),2)).join('');
const H5_lin=v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)};
const H5_unlin=v=>255*(v<=.0031308?12.92*v:1.055*Math.pow(clamp(v,0,1),1/2.4)-.055);
const H5_lum=h=>{const [r,g,b]=H5_rgb(h).map(H5_lin);return .2126*r+.7152*g+.0722*b};
function H5_ramp(stops,t){t=clamp(t,0,1)*(stops.length-1);const i=Math.min(stops.length-2,Math.floor(t)),u=t-i,a=H5_rgb(stops[i]),b=H5_rgb(stops[i+1]);return H5_hex(a.map((v,k)=>lerp(v,b[k],u)))}
// A pie slice path from angle a0 to a1 (radians, 0 = 12 o'clock, clockwise).
function H5_slice(cx,cy,r,a0,a1){const p=a=>[cx+r*Math.sin(a),cy-r*Math.cos(a)],[x0,y0]=p(a0),[x1,y1]=p(a1);return `M${fmt(cx)} ${fmt(cy)}L${fmt(x0)} ${fmt(y0)}A${r} ${r} 0 ${a1-a0>Math.PI?1:0} 1 ${fmt(x1)} ${fmt(y1)}Z`}
const H5_ILLUS=(x,y,anchor='start')=>TF(x,y,'Illustrative data',12,C.muted,anchor,'font-style="italic"');

/* ---------- Lesson: visual variables (Bertin 1967) ---------- */
const H5_VALS=[12,30,21,45,8],H5_KEYS=['A','B','C','D','E'];
// Bertin's properties: selective (pick out a group), associative (group despite it), ordered, quantitative.
const H5_VARS=[
 ['position','Position',{sel:1,ass:1,ord:1,qua:1}],
 ['size','Size',{sel:1,ord:1,qua:1}],
 ['value','Value (lightness)',{sel:1,ord:1}],
 ['texture','Texture',{sel:1,ass:1,ord:1}],
 ['hue','Colour hue',{sel:1,ass:1}],
 ['orientation','Orientation',{sel:1,ass:1}],
 ['shape','Shape',{ass:1}]];
const H5_HUES=['#c45238','#2c776c','#7156a6','#1772b7','#9a6200'];
function H5_mark(kind,v,i,x,y,max=48){
 const f=v/max;
 if(kind==='size'){const r=6+Math.sqrt(f)*32;return Ci(x,y,r,C.blue)}
 if(kind==='value'){const g=Math.round(235-f*215);return R(x-26,y-26,52,52,`rgb(${g},${g},${g})`,C.line,4)}
 if(kind==='texture'){let o=R(x-26,y-26,52,52,'#fff',C.line,4);const n=1+Math.round(f*9);for(let k=1;k<=n;k++){const yy=y-26+k*52/(n+1);o+=L(x-24,yy,x+24,yy,C.ink,1.6)}return o}
 if(kind==='hue')return R(x-26,y-26,52,52,H5_HUES[[3,0,4,1,2][i]],'none',6);
 if(kind==='orientation'){const a=f*Math.PI/2,dx=28*Math.cos(a),dy=28*Math.sin(a);return L(x-dx,y+dy,x+dx,y-dy,C.ink,5)}
 if(kind==='shape'){const s=[`<circle cx="${x}" cy="${y}" r="22" fill="${C.blue}"/>`,R(x-20,y-20,40,40,C.blue,'none',2),`<polygon points="${x},${y-24} ${x+23},${y+18} ${x-23},${y+18}" fill="${C.blue}"/>`,`<polygon points="${x},${y-25} ${x+22},${y} ${x},${y+25} ${x-22},${y}" fill="${C.blue}"/>`,P(`M${x-18} ${y-18}L${x+18} ${y+18}M${x+18} ${y-18}L${x-18} ${y+18}`,C.blue,8)];return s[[2,0,4,1,3][i]]}
 return '';
}
SCENE({id:'visual-variables',name:'Visual variables',tag:'Seven ways to mark a difference',
 definition:'Bertin’s visual variables are the properties a mark on paper or screen can vary to carry data: position, size, value (lightness), texture, colour hue, orientation and shape.',
 example:'The same five numbers drawn seven ways. Only some encodings let you see which is larger; colour hue and shape can tell things apart but cannot show order.',
 research:'Bertin, J. (1967). Sémiologie graphique (Semiology of Graphics, 1983): the visual variables and their properties.',
 desc:'Five data values, A to E, drawn with one visual variable at a time, above a table of which properties that variable has.',
 dur:12,hint:'Choose an encoding and ask: can you tell which value is biggest, and by how much?',
 init:()=>({v:'size',nums:false}),
 watch(p){return {v:H5_VARS[Math.min(6,Math.floor(p*7))][0],nums:false}},
 ui:[{choose:H5_VARS.map(v=>[v[0],v[1].split(' ')[0]]),label:'Visual variable',get:s=>s.v,act:'pick'},{b:'Show the numbers',act:'nums'}],
 on:{pick(s,v){s.v=v},nums(s){s.nums=!s.nums}},
 draw(s){
  const V=H5_VARS.find(v=>v[0]===s.v);let out=heading('Encoded by '+V[1].toLowerCase());
  if(s.v==='position')out+=L(70,230,540,230,C.line,2)+TF(60,234,'0',13,C.muted,'end')+L(70,70,70,230,C.line,2)+TF(60,74,'50',13,C.muted,'end');
  H5_VALS.forEach((v,i)=>{const x=120+i*95;
   out+=s.v==='position'?Ci(x,230-v/50*160,10,C.blue):H5_mark(s.v,v,i,x,150);
   out+=TB(x,256,H5_KEYS[i],15,C.ink)+(s.nums?T(x,274,v,14,C.muted):'')});
  const props=[['sel','Selective','pick out one group'],['ass','Associative','group despite it'],['ord','Ordered','read an order'],['qua','Quantitative','read a ratio']];
  props.forEach(([k,lab,sub],j)=>{const x=20+j*142,on=!!V[2][k];out+=R(x,292,132,56,on?C.greenp:'#f4f6f7',on?C.green:C.grid,8)+TB(x+66,314,(on?'✓ ':'— ')+lab,14,on?C.green:C.muted)+TF(x+66,334,sub,12,C.muted)});
  const say={position:'Position on a common scale carries order and ratio: it is Bertin’s strongest variable.',size:'Size shows order and rough ratios, though area is usually underestimated.',value:'Lightness shows order (darker reads as more) but not ratios.',texture:'Texture density can show order, weakly.',hue:'Colour hue separates categories but has no natural order: is green more than purple?',orientation:'Orientation separates groups, but an angle is hard to read as an amount.',shape:'Shape only says “these belong together”: it carries no order at all.'}[s.v];
  return {svg:out,phase:say+' Bertin’s point: match the variable to the kind of data.'};
 }});

// Mackinlay (1986) ranked perceptual tasks by data type (after Cleveland & McGill).
const H5_MACK={quantitative:['Position','Length','Angle','Slope','Area','Volume','Density','Saturation','Hue','Texture','Connection','Containment','Shape'],
 ordinal:['Position','Density','Saturation','Hue','Texture','Connection','Containment','Length','Angle','Slope','Area','Volume','Shape'],
 nominal:['Position','Hue','Texture','Connection','Containment','Density','Saturation','Shape','Length','Angle','Slope','Area','Volume']};
SCENE({id:'visual-variables-ranking',name:'Ranking encodings by data type',tag:'The best variable depends on the data',
 definition:'An effectiveness ranking lists visual variables from most to least accurate for a kind of data: quantitative (amounts), ordinal (ordered categories) or nominal (unordered categories).',
 example:'Length is second-best for amounts but poor for categories; colour hue is the reverse. Position is first in every list.',
 research:'Mackinlay, J. (1986). Automating the design of graphical presentations of relational information. ACM Transactions on Graphics; building on Cleveland & McGill (1984).',
 desc:'Three ranked columns of visual variables for quantitative, ordinal and nominal data, with lines tracing one variable’s rank across the three.',
 dur:10,hint:'Press any variable to trace its rank across the three kinds of data.',
 init:()=>({sel:'Area'}),
 watch(p){const seq=['Position','Length','Hue','Area','Shape'];return {sel:seq[Math.min(4,Math.floor(p*5))]}},
 on:{pick(s,v){s.sel=v}},
 draw(s,f,X){
  let out=heading('Most to least accurate, by kind of data');const cols=[['quantitative',110],['ordinal',300],['nominal',490]];
  cols.forEach(([k,x])=>out+=TB(x,58,k[0].toUpperCase()+k.slice(1),15,C.ink));
  const pos=k=>{const c=cols.find(c=>c[0]===k);const i=H5_MACK[k].indexOf(s.sel);return [c[1],78+i*21]};
  out+=P(`M${pos('quantitative')[0]+62} ${pos('quantitative')[1]-4}L${pos('ordinal')[0]-62} ${pos('ordinal')[1]-4}M${pos('ordinal')[0]+62} ${pos('ordinal')[1]-4}L${pos('nominal')[0]-62} ${pos('nominal')[1]-4}`,C.coral,2.5);
  cols.forEach(([k,x])=>H5_MACK[k].forEach((v,i)=>{const y=78+i*21,on=v===s.sel;
   out+=hit(X,'pick',v,`${v}: rank ${i+1} for ${k} data`,R(x-60,y-15,120,19,on?C.coralp:i<3?'#eef5f9':'#fff',on?C.coral:'none',5)+TF(x-55,y,(i+1)+'.',12,C.muted,'start')+TF(x+8,y,v,13,on?C.coral:C.ink,'middle',on?'font-weight="700"':''))}));
  const r=cols.map(([k])=>H5_MACK[k].indexOf(s.sel)+1);
  out+=T(300,370,`${s.sel}: ${r[0]}th for amounts, ${r[1]}th for order, ${r[2]}th for categories`.replace(/\b1th/g,'1st').replace(/\b2th/g,'2nd').replace(/\b3th/g,'3rd'),14,C.ink);
  return {svg:out,phase:`${s.sel} ranks ${r.join(', ')} for quantitative, ordinal and nominal data. Mackinlay used these rankings to let a program choose a chart automatically.`};
 }});

const H5_FRUIT=[['Plum',1.2,60,3,'stone'],['Lemon',0.8,110,1,'citrus'],['Cherry',3.5,8,4,'stone'],['Orange',0.6,180,3,'citrus'],['Strawberry',2.8,15,4,'berry'],['Lime',0.5,70,1,'citrus'],['Blueberry',4.2,2,3,'berry'],['Peach',1.5,150,5,'stone']];
const H5_CATS=['berry','citrus','stone'];
SCENE({id:'visual-variables-mapping',name:'Matching variables to data',tag:'Size says “more”, hue says “different”',
 definition:'Mapping data to visuals means choosing which visual variable carries each attribute; the variable’s properties should match the attribute’s type.',
 example:'Shown by size, the categories berry, citrus and stone fruit look like small, medium and large amounts, an order the data does not have.',
 research:'Bertin (1967); Mackinlay (1986). Applied in later grammars of graphics such as Wilkinson, L. (1999). The Grammar of Graphics.',
 desc:'A scatterplot of eight fruits by price and weight; fruit type and sweetness are each encoded by a chosen visual variable, with a verdict on each choice.',
 dur:11,hint:'Choose how to show the fruit type (a category) and the sweetness (an ordered rating). Watch for a mapping that invents or hides order.',
 init:()=>({cat:'hue',sweet:'size'}),
 watch(p){const c=[['hue','size'],['size','value'],['shape','hue'],['hue','value']][Math.min(3,Math.floor(p*4))];return {cat:c[0],sweet:c[1]}},
 ui:[{choose:[['hue','Type: hue'],['shape','Type: shape'],['size','Type: size']],label:'Fruit type encoding',get:s=>s.cat,act:'cat'},{choose:[['size','Sweet: size'],['value','Sweet: lightness'],['hue','Sweet: hue']],label:'Sweetness encoding',get:s=>s.sweet,act:'sweet'}],
 on:{cat(s,v){s.cat=v;if(s.sweet===v)s.sweet=v==='size'?'value':'size'},sweet(s,v){s.sweet=v;if(s.cat===v)s.cat=v==='hue'?'shape':'hue'}},
 draw(s){
  let out=heading('Price against weight; two more attributes to show');
  const x0=60,x1=380,y0=320,y1=86,X=w=>x0+Math.sqrt(w/190)*(x1-x0),Y=p=>y0-p/4.5*(y0-y1);
  out+=L(x0,y0,x1,y0,C.line)+L(x0,y0,x0,y1,C.line)+TF((x0+x1)/2,y0+28,'weight (g, square-root scale)',13,C.muted)+TF(x0,y1-22,'price (£/kg)',13,C.muted,'start')+H5_ILLUS(x1-20,y1-22,'end');
  const shapes=['circle','square','triangle'];
  H5_FRUIT.forEach(([n,price,w,sw,cat])=>{const x=X(w),y=Y(price),ci=H5_CATS.indexOf(cat);
   let fill=C.blue,r=11,shape='circle';
   if(s.cat==='hue')fill=H5_HUES[ci];if(s.cat==='shape')shape=shapes[ci];if(s.cat==='size')r=7+ci*6;
   if(s.sweet==='size')r=5+sw*3.2;if(s.sweet==='value'){const g=Math.round(220-sw*40);fill=s.cat==='hue'?tint(H5_HUES[ci],(5-sw)*.16):`rgb(${g},${g},${g+10})`}if(s.sweet==='hue')fill=H5_HUES[sw-1];
   out+=shape==='circle'?Ci(x,y,r,fill,'#fff'):shape==='square'?R(x-r,y-r,2*r,2*r,fill,'#fff',2):`<polygon points="${fmt(x)},${fmt(y-r*1.2)} ${fmt(x+r*1.1)},${fmt(y+r*.8)} ${fmt(x-r*1.1)},${fmt(y+r*.8)}" fill="${fill}" stroke="#fff" stroke-width="2"/>`;
   out+=x>300?TF(x-r-4,y+4,n,12,C.muted,'end'):TF(x+r+4,y+4,n,12,C.muted,'start')});
  const verdict=(attr,kind,v)=>{if(kind==='nominal')return v==='size'?['✗','Size implies stone > citrus > berry: an order that does not exist.',C.coral]:['✓',`${v==='hue'?'Hue':'Shape'} separates the three types without ranking them.`,C.green];
   return v==='hue'?['✗','Hue hides the order: is purple sweeter than green?',C.coral]:['✓',`${v==='size'?'Size':'Lightness'} reads as more or less sweet.`,C.green]};
  [['Fruit type (nominal)',verdict('type','nominal',s.cat)],['Sweetness 1–5 (ordinal)',verdict('sweet','ordinal',s.sweet)]].forEach(([lab,[m,txt,col]],j)=>{const y=80+j*130;
   out+=R(400,y,190,112,col===C.green?C.greenp:C.coralp,col,10)+TBF(412,y+24,m+' '+lab,13,col,'start');
   const words=txt.split(' ');let line='',k=0;for(const w of words){if((line+' '+w).length>26){out+=TF(412,y+48+k*18,line.trim(),13,C.ink,'start');line='';k++}line+=' '+w}out+=TF(412,y+48+k*18,line.trim(),13,C.ink,'start')});
  return {svg:out,phase:'Categories need a variable that groups without ranking (hue, shape); ordered ratings need one that ranks (size, lightness). Position is already used for price and weight.'};
 }});

/* ---------- Lesson: graphical perception (Cleveland & McGill 1984) ---------- */
const H5_ENCS=[['position','Position (common scale)'],['length','Length (unaligned)'],['angle','Angle (pie)'],['area','Area (circles)']];
function H5_trials(seed){const r=rng(seed),list=[];for(let rep=0;rep<3;rep++)for(const [e] of H5_ENCS){const big=45+Math.round(r()*45),ratio=.18+r()*.72;const fill=range(5).map(()=>15+Math.round(r()*70));list.push({enc:e,big,small:Math.max(6,Math.round(big*ratio)),fill})}return shuffled(list,seed+7)}
// Draw one stimulus: two marked values A (smaller) and B (larger) among fillers, inside x 20–330.
function H5_stim(t){
 let out='';const vals=t.fill.slice();vals[1]=t.small;vals[3]=t.big;
 const mark=(x,y,l)=>Ci(x,y,9,C.coral)+TBF(x,y+4.5,l,12,'#fff');
 if(t.enc==='position'){vals.forEach((v,i)=>{const x=50+i*56,h=v*2.3;out+=R(x,300-h,38,h,i===1||i===3?'#9cc4e0':C.pale,'none',2);if(i===1)out+=mark(x+19,300-h/2,'A');if(i===3)out+=mark(x+19,300-h/2,'B')});out+=L(40,300,330,300,C.ink,1.5)}
 else if(t.enc==='length'){// Stacked bars: the marked segments do not share a baseline.
  [[30,t.small,25],[55,t.big,15]].forEach(([base,v,top],j)=>{const x=80+j*130;let y=300;[base,v,top].forEach((seg,k)=>{const h=seg*2;y-=h;out+=R(x,y,64,h,k===1?'#9cc4e0':k?C.pale:'#cfe0ec','#fff',0);if(k===1)out+=mark(x+32,y+h/2,j?'B':'A')})});out+=L(40,300,330,300,C.ink,1.5)}
 else if(t.enc==='angle'){const tot=sum(vals);let a=0;vals.forEach((v,i)=>{const a1=a+v/tot*2*Math.PI;out+=P(H5_slice(175,190,110,a,a1),'#fff',2,i===1||i===3?'#9cc4e0':[C.pale,'#cfe0ec','#e8eef2'][i%3]);const m=(a+a1)/2;if(i===1)out+=mark(175+70*Math.sin(m),190-70*Math.cos(m),'A');if(i===3)out+=mark(175+70*Math.sin(m),190-70*Math.cos(m),'B');a=a1})}
 else{const rA=Math.sqrt(t.small/100)*95,rB=Math.sqrt(t.big/100)*95;out+=Ci(105,200,rA,'#9cc4e0','#fff')+Ci(245,190,rB,'#9cc4e0','#fff')+mark(105,200,'A')+mark(245,190,'B')}
 return out;
}
SCENE({id:'graphical-perception',name:'Graphical perception',tag:'Be the participant',
 definition:'Graphical perception is how accurately people decode the quantities a chart encodes. Judgements of position on a common scale are the most accurate; angles and areas are much worse.',
 example:'Cleveland and McGill asked people what percentage the smaller marked value was of the larger. Errors grew from position, to length, to angle, to area. Heer and Bostock repeated it online in 2010 with the same order.',
 research:'Cleveland, W. S. & McGill, R. (1984). Graphical perception. Journal of the American Statistical Association. Replicated by Heer, J. & Bostock, M. (2010), CHI.',
 desc:'A chart with two marked values, A and B, encoded by position, length, angle or area, beside a chart of the learner’s own average error for each encoding.',
 dur:12,hint:'Estimate what percentage A is of B, then press Submit. Twelve trials: three per encoding. Your errors appear on the right.',
 init:()=>({seed:5,i:0,guess:50,res:[],trials:H5_trials(5)}),
 watch(p){const k=Math.min(3,Math.floor(p*4)),t=H5_trials(5).find(t=>t.enc===H5_ENCS[k][0]);return {seed:5,i:-1,demo:t,guess:50,res:[]}},
 ui:[{range:'guess',label:'A is what % of B?',min:1,max:100,get:s=>s.guess,act:'guess',show:v=>v+'%'},{b:'Submit',act:'submit'},{b:'New trials',act:'again'}],
 on:{guess(s,v){s.guess=v},submit(s){if(s.i>=s.trials.length)return;const t=s.trials[s.i],truth=100*t.small/t.big;s.res.push({enc:t.enc,err:Math.log2(Math.abs(s.guess-truth)+1/8),truth,guess:s.guess});s.i++;s.guess=50},again(s){s.seed=nextSeed()%9973+1;s.trials=H5_trials(s.seed);s.i=0;s.res=[];s.guess=50}},
 draw(s,f,X){
  const t=s.demo||s.trials[s.i];let out='';
  if(t){out+=TB(175,40,(s.demo?'':`Trial ${s.i+1} of 12 · `)+H5_ENCS.find(e=>e[0]===t.enc)[1],15,C.ink)+H5_stim(t);
   if(s.demo)out+=T(175,350,`A is ${Math.round(100*t.small/t.big)}% of B`,15,C.muted);else out+=T(175,350,`Your answer: A is ${s.guess}% of B`,15,C.blue)}
  else out+=TB(175,170,'All 12 trials done',18,C.green)+T(175,198,'Press New trials to try again',14,C.muted);
  // Results: mean log₂ error per encoding (lower is better), as in Cleveland & McGill.
  out+=R(350,50,240,300,'#fff',C.grid,10)+TB(470,74,X.try?'Your average error':'Average error',14,C.ink)+TF(470,92,'log₂(|guess − truth| + ⅛), lower is better',12,C.muted);
  H5_ENCS.forEach(([e,lab],j)=>{const r=s.res.filter(x=>x.enc===e),m=r.length?sum(r.map(x=>x.err))/r.length:null,y=118+j*50;
   out+=TF(362,y,lab.split(' (')[0],13,C.ink,'start')+R(362,y+8,210,16,'#f1f5f8','none',4);
   if(m!==null){out+=R(362,y+8,clamp(m,0,6)/6*210,16,[C.green,C.blue,C.amber,C.coral][j],'none',4)+TBF(568,y,fmt(m),13,C.ink,'end')}else out+=TF(568,y,'—',13,C.muted,'end')});
  out+=TF(470,328,'Published order: position < length',12,C.muted)+TF(470,343,'< angle < area (least to most error)',12,C.muted);
  const done=s.res.length;
  return {svg:out,phase:!X.try?'The same comparison, four ways. In the 1984 experiment, position on a common scale gave the smallest errors and angle the largest of the three they tested; later studies put circle area lower still.':done?`After ${done} trial${done>1?'s':''}: last answer ${s.res[done-1].guess}% against a true ${Math.round(s.res[done-1].truth)}%. Compare your bars with the published order.`:'Judge by eye; do not measure. The study used the same question for every encoding.'};
 }});

SCENE({id:'graphical-perception-pie-bar',name:'Pie or bar?',tag:'Same numbers, different accuracy',
 definition:'A pie chart encodes values as angles and areas; a bar chart encodes them as positions on a common scale. The bar chart makes small differences and rankings far easier to see.',
 example:'With shares of 22, 20, 19, 21 and 18%, the pie slices look equal; the bars line up and the order is plain.',
 research:'Cleveland & McGill (1984); Spence, I. & Lewandowsky, S. (1991). Displaying proportions and percentages. Applied Cognitive Psychology.',
 desc:'The same five values drawn as a pie chart and as a bar chart side by side.',
 dur:10,hint:'Pick a data set, or press a bar to grow it. Can you rank the slices without looking at the bars?',
 init:()=>({vals:[22,20,19,21,18]}),
 watch(p){const a=[22,20,19,21,18],b=[34,14,9,28,15],u=smooth(p*1.4);return {vals:a.map((v,i)=>Math.round(lerp(b[i],v,u)))}},
 ui:[{b:'Nearly equal',act:'set',arg:'22,20,19,21,18'},{b:'Distinct',act:'set',arg:'34,14,9,28,15'},{b:'One dominant',act:'set',arg:'55,12,11,13,9'}],
 on:{set(s,a){s.vals=String(a).split(',').map(Number)},grow(s,i){i=Number(i);s.vals[i]=s.vals[i]>=40?5:s.vals[i]+3}},
 draw(s,f,X){
  let out=heading('Which is largest? Which is smallest?');const tot=sum(s.vals),cols=['#1772b7','#2c776c','#7156a6','#9a6200','#c45238'];let a=0;
  s.vals.forEach((v,i)=>{const a1=a+v/tot*2*Math.PI,m=(a+a1)/2;out+=P(H5_slice(150,200,120,a,a1),'#fff',2,cols[i])+TB(150+82*Math.sin(m),200-82*Math.cos(m)+5,H5_KEYS[i],15,'#fff');a=a1});
  const mx=Math.max(...s.vals,40);out+=L(320,320,580,320,C.ink,1.5);
  s.vals.forEach((v,i)=>{const x=330+i*50,h=v/mx*230;out+=hit(X,'grow',i,`Bar ${H5_KEYS[i]}: ${v}. Press to grow.`,R(x,320-h,38,h,cols[i],'none',3))+TB(x+19,342,H5_KEYS[i],15)+TF(x+19,316-h,v,13,C.muted)});
  const order=H5_KEYS.map((k,i)=>[k,s.vals[i]]).sort((a,b)=>b[1]-a[1]).map(x=>x[0]).join(' > ');
  return {svg:out,phase:`Largest to smallest: ${order}. Bars share a baseline, so ranking needs only position; slices must be compared by angle and area, which the eye judges less accurately.`};
 }});

SCENE({id:'graphical-perception-area',name:'Area is underestimated',tag:'Stevens’ power law',
 definition:'Perceived magnitude grows as a power of physical magnitude (Stevens’ power law). For area the exponent is below 1, so a circle with twice the area looks less than twice as big.',
 example:'Scaling a circle’s radius by the value makes its area grow with the square: a value twice as big gets four times the area, exaggerating the difference. Scaling the area is correct, but because area is underestimated it still looks smaller than it is.',
 research:'Stevens, S. S. (1957). On the psychophysical law. Psychological Review. Flannery, J. J. (1971). The relative effectiveness of some common graduated point symbols. The Canadian Cartographer.',
 desc:'Pairs of circles for a value and a multiple of it: scaled by radius, scaled by area, and scaled by Flannery’s cartographic correction, with bars comparing actual and typically perceived size.',
 dur:10,hint:'Slide how many times bigger the second value is. Compare what each circle actually shows with how big it typically looks.',
 init:()=>({k:4}),
 watch(p){return {k:Math.round((1+p*7)*2)/2}},
 ui:[{range:'k',label:'Second value is',min:1,max:9,step:.5,get:s=>s.k,act:'k',show:v=>v+'×'}],
 on:{k(s,v){s.k=v}},
 draw(s){
  let out=heading(`The second value is ${s.k}× the first`);const k=s.k,base=11;
  const rows=[['Radius ∝ value',k,'area grows ×'+fmt(k*k)],['Area ∝ value',Math.sqrt(k),'area grows ×'+fmt(k)],['Flannery scaling',Math.pow(k,.5716),'area grows ×'+fmt(Math.pow(k,1.1432))]];
  rows.forEach(([lab,rs,note],j)=>{const y=70+j*92,area=rs*rs,seen=Math.pow(area,.7);
   out+=TB(20,y+8,lab,14,C.ink,'start')+TF(20,y+26,note,13,C.muted,'start');
   const r2=Math.min(44,base*rs);out+=Ci(200,y+20,base,C.pale,C.blue)+Ci(200+base+8+r2,y+20,r2,'#9cc4e0',C.blue);
   const bx=370,sc=200/Math.max(9,k*k);out+=R(bx,y+2,Math.min(205,area*sc),12,C.blue,'none',3)+TF(bx-6,y+12,'drawn',12,C.muted,'end')+R(bx,y+22,Math.min(205,seen*sc),12,C.coral,'none',3)+TF(bx-6,y+32,'looks',12,C.muted,'end')+TF(bx,y+52,`looks about ×${fmt(seen)} (value is ×${fmt(k)})`,12,C.ink,'start')});
  out+=TF(300,360,'“Looks” uses Stevens’ exponent of about 0.7 for area; real estimates vary by person and shape.',12,C.muted);
  return {svg:out,phase:`Scaling by radius exaggerates: ×${fmt(k)} becomes ×${fmt(k*k)} in area. Scaling by area is honest but is typically seen as about ×${fmt(Math.pow(k,.7))}. Cartographers such as Flannery enlarged symbols slightly to compensate; position avoids the problem.`};
 }});

/* ---------- Lesson: data-ink (Tufte 1983) ---------- */
const H5_SALES=[14,22,18,30,26,35];const H5_MONTHS=['Jan','Feb','Mar','Apr','May','Jun'];
// Non-data ink, erased in this order; weights are rough ink amounts for the ratio meter.
const H5_JUNK=[['Background panel',30],['Heavy gridlines',14],['3D shading',12],['Border box',6],['Redundant legend',8],['Bold tick marks',5]];
SCENE({id:'data-ink',name:'Data-ink',tag:'Above all else, show the data',
 definition:'Tufte’s data-ink ratio is the share of a graphic’s ink that shows data. His advice: erase non-data ink, and redundant data ink, within reason.',
 example:'The same six bars, with background, gridlines, fake 3D, a border and a legend removed one by one. The data never changes; the chart gets easier to read.',
 research:'Tufte, E. R. (1983). The Visual Display of Quantitative Information. Graphics Press.',
 desc:'A bar chart of six months losing one layer of non-data ink at a time, beside a meter of its data-ink ratio.',
 dur:12,hint:'Slide to erase non-data ink one layer at a time. Watch the data-ink meter.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(6,Math.floor(p*7))}},
 ui:[{range:'k',label:'Layers erased',min:0,max:6,get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v}},
 draw(s){
  const on=i=>s.k<=i;let out=heading(s.k?`Erased: ${H5_JUNK.slice(0,s.k).map(j=>j[0].toLowerCase()).join(', ')}`:'A chart with everything turned on');
  const x0=50,y0=320,w=330,h=240;
  if(on(0))out+=R(x0-20,y0-h-20,w+40,h+40,'#e7e3d8','none',0);
  if(on(3))out+=R(x0-20,y0-h-20,w+40,h+40,'none',C.ink,0,'stroke-width="4"');
  for(let g=0;g<=4;g++){const y=y0-g*h/4;out+=on(1)?L(x0,y,x0+w,y,'#8a8a8a',2.5):''}
  out+=L(x0,y0,x0+w,y0,C.ink,1.5);
  H5_SALES.forEach((v,i)=>{const bw=36,x=x0+14+i*52,bh=v/40*h;
   if(on(2))out+=`<polygon points="${x},${y0-bh} ${x+10},${y0-bh-10} ${x+bw+10},${y0-bh-10} ${x+bw+10},${y0-10} ${x+bw},${y0} ${x+bw},${y0-bh}" fill="#0f4f80"/>`;
   out+=R(x,y0-bh,bw,bh,C.blue,'none',0)+TF(x+bw/2,y0+18,H5_MONTHS[i],12,C.muted);
   if(s.k>=6)out+=TF(x+bw/2,y0-bh-6,v,12,C.ink);
   if(on(5))out+=L(x+bw/2,y0,x+bw/2,y0+8,C.ink,3)});
  if(on(4))out+=R(x0+w-120,y0-h-8,112,30,'#fff',C.ink,4)+R(x0+w-112,y0-h,14,14,C.blue,'none',0)+TF(x0+w-92,y0-h+12,'Sales (units)',12,C.ink,'start');
  const total=sum(H5_JUNK.map(j=>j[1]))+40,junk=sum(H5_JUNK.slice(s.k).map(j=>j[1])),ratio=40/(40+junk);
  out+=R(420,70,160,250,'#fff',C.grid,10)+TB(500,94,'Data-ink ratio',14)+R(470,110,60,170,'#f1f5f8','none',6)+R(470,110+170*(1-ratio),60,170*ratio,C.green,'none',6)+TB(500,304,Math.round(ratio*100)+'%',18,C.green);
  out+=TF(500,340,'Rough estimate',12,C.muted)+H5_ILLUS(30,364);
  return {svg:out,phase:s.k<6?`Next to go: ${H5_JUNK[s.k][0].toLowerCase()}. None of it carries data. Tufte’s qualifier matters: “within reason”; some labels and light gridlines help reading.`:'With direct value labels the bars need no gridlines at all. Erasing is a guideline, not a law: the next scenes show where it has limits.'};
 }});
// 3D companion: depth and perspective make equal bars hard to compare, the classic chartjunk.
SCENES['data-ink'].three=(s,f,X,project)=>{
 const P=project([[0,0,0],[6.6,1.4,0],[0,0,4],[6.6,1.4,4]]);
 const faces=H5_SALES.flatMap((v,i)=>prism(i*1.1,0,0,.7,.9,v/10,i===3||i===5?C.coral:C.blue));
 return {svg:paintFaces(faces,P)+axes3(P,['month','','sales'],[7,0,4]),title:'The same bars in fake 3D',caption:'April and June (coral) differ by 5 units, yet the perspective makes the nearer bar look bigger or smaller depending on the angle. Depth adds ink, not data.'};
};

const H5_SERIES=range(6).map(j=>range(12).map(m=>Math.round(40+18*Math.sin((m+j*1.7)/2.2)+j*4+(j===4&&m>6?-18:0))));
const H5_SNAMES=['North','South','East','West','Coast','Hills'];
SCENE({id:'data-ink-small-multiples',name:'Small multiples',tag:'Many small charts beat one crowded one',
 definition:'Small multiples are a series of small charts drawn on the same scale, one per group, so the eye compares them at a glance.',
 example:'Six regions’ monthly figures on one chart make a tangle; six small panels with the same axes show each shape, including the region that dropped late in the year.',
 research:'Tufte, E. R. (1983, 1990). The Visual Display of Quantitative Information; Envisioning Information. Graphics Press.',
 desc:'Six data series drawn either as one overlapping line chart or as six small panels on the same scale.',
 dur:11,hint:'Switch between one chart and small multiples, then press a region to pick it out.',
 init:()=>({view:'one',sel:4}),
 watch(p){return {view:p<.5?'one':'multi',sel:Math.min(5,Math.floor((p%.5)*12))}},
 ui:[{choose:[['one','One chart'],['multi','Small multiples']],label:'View',get:s=>s.view,act:'view'}],
 on:{view(s,v){s.view=v},sel(s,i){s.sel=Number(i)}},
 draw(s,f,X){
  let out=heading(s.view==='one'?'Six regions, one chart':'Six regions, six small charts, one scale');const cols=['#1772b7','#2c776c','#7156a6','#9a6200','#c45238','#546873'];
  const line=(vals,x0,y0,w,h,col,wd)=>P('M'+vals.map((v,m)=>`${fmt(x0+m*w/11)} ${fmt(y0-(v-10)/70*h)}`).join('L'),col,wd);
  if(s.view==='one'){out+=L(50,320,450,320,C.line)+L(50,320,50,60,C.line);H5_SERIES.forEach((v,j)=>out+=line(v,50,320,400,260,j===s.sel?cols[j]:tint(cols[j],.55),j===s.sel?3.5:2))}
  else H5_SERIES.forEach((v,j)=>{const x=40+(j%3)*140,y=70+Math.floor(j/3)*140;out+=R(x,y,128,120,j===s.sel?'#fff':'#f7fafc',j===s.sel?cols[j]:C.grid,6)+line(v,x+8,y+110,112,96,cols[j],2.2)+TF(x+64,y+16,H5_SNAMES[j],12,cols[j],'middle','font-weight="650"')});
  H5_SNAMES.forEach((n,j)=>{const y=80+j*40;out+=hit(X,'sel',j,`Pick out ${n}`,R(480,y-16,100,30,j===s.sel?tint(cols[j],.75):'#fff',cols[j],6)+TF(530,y+4,n,13,C.ink))});
  out+=H5_ILLUS(480,350);
  return {svg:out,phase:s.view==='one'?`In one chart the lines cross and hide each other; ${H5_SNAMES[s.sel]} is hard to follow without colour.`:`Same scale in every panel, so shapes compare directly: ${H5_SNAMES[4]} falls away after July. Tufte: “small multiples… answer directly by visually enforcing comparisons.”`};
 }});

SCENE({id:'data-ink-useful-junk',name:'Useful junk?',tag:'When decoration helps memory',
 definition:'Chartjunk is Tufte’s term for decoration that carries no data. Later experiments found that some embellishment does not hurt reading and can make a chart more memorable.',
 example:'Bateman and colleagues compared plain charts with heavily illustrated ones. People read both equally accurately, but recalled the illustrated charts better two to three weeks later.',
 research:'Bateman, S. et al. (2010). Useful junk? The effects of visual embellishment on comprehension and memorability of charts. CHI. Borkin, M. et al. (2013). What makes a visualization memorable? IEEE TVCG.',
 desc:'A plain bar chart and an illustrated version of the same data, followed by panels summarising what the experiment measured and found.',
 dur:12,hint:'Step through the study: two charts, two measurements, and the caveats.',
 init:()=>({}),
 trace(){return [{ph:'plain',say:'A plain chart of the same six values: minimal ink, easy to read.'},{ph:'junk',say:'An embellished version: the bars become a pictorial monster, with a big decorative title.'},{ph:'read',say:'Measured first: interpretation accuracy straight after viewing. No reliable difference between the two.'},{ph:'recall',say:'Measured again two to three weeks later: people recalled the embellished charts’ topic and message better.'},{ph:'caveat',say:'A small lab study with one style of embellishment. It does not license clutter; it shows that “less ink” is a trade-off with memorability and engagement, not a law.'}]},
 draw(s,f){
  let out=heading('Plain or embellished?');const ph=f.ph,step=['plain','junk','read','recall','caveat'].indexOf(ph);
  const plain=(x)=>{let o=L(x,250,x+220,250,C.ink,1.5);H5_SALES.forEach((v,i)=>o+=R(x+10+i*35,250-v*5,24,v*5,C.blue,'none',0));return o+TF(x+110,272,'Monthly sales',13,C.muted)};
  const junk=(x)=>{let o=R(x-6,58,232,215,'#fff5dc','none',14)+TB(x+110,84,'SALES SOAR!',20,C.coral)+L(x,250,x+220,250,C.ink,1.5);
   H5_SALES.forEach((v,i)=>{const bx=x+10+i*35,h=v*5;o+=P(`M${bx} 250V${250-h+12}Q${bx+12} ${250-h-10} ${bx+24} ${250-h+12}V250`,C.coral,2,C.coralp)+Ci(bx+7,250-h+8,2.5,C.ink)+Ci(bx+17,250-h+8,2.5,C.ink)+P(`M${bx+6} ${250-h+16}Q${bx+12} ${250-h+21} ${bx+18} ${250-h+16}`,C.ink,1.5)});return o};
  out+=plain(40)+(step>=1?junk(330):R(330,58,232,215,'#f4f6f7',C.grid,14,'stroke-dasharray="5 4"'));
  if(step>=2){out+=R(40,290,250,62,step===2?C.greenp:'#fff',C.green,10)+TB(165,312,'Reading accuracy',14,C.green)+TF(165,334,'plain ≈ embellished',13,C.ink)}
  if(step>=3){out+=R(310,290,250,62,step===3?C.amberp:'#fff',C.amber,10)+TB(435,312,'Recall after 2–3 weeks',14,C.amber)+TF(435,334,'embellished remembered better',13,C.ink)}
  if(step>=4)out+=TF(300,368,'Borkin et al. (2013) also found distinctive, human-recognisable images most memorable.',12,C.muted);
  out+=H5_ILLUS(40,58+10);
  return {svg:out,phase:f.say};
 }});

/* ---------- Lesson: mind maps (Buzan 1974) ---------- */
const H5_POOL={'Causes':['Trade','Alliances','Empire'],'Events':['1914','Somme','Armistice'],'People':['Soldiers','Leaders','Families'],'Effects':['Borders','Treaty','Memory'],'Sources':['Letters','Photos']};
const H5_BR_COLS=['#c45238','#1772b7','#2c776c','#7156a6','#9a6200'];
function H5_mindmap(br,sel,X,cx=300,cy=200,lab='First World War'){
 let out='';const n=br.length;
 br.forEach((b,j)=>{const a=-Math.PI/2+(j+.5)*2*Math.PI/Math.max(n,1),bx=cx+150*Math.cos(a),by=cy+105*Math.sin(a),col=H5_BR_COLS[j%5];
  // Buzan-style organic branch: thick near the centre, tapering outwards.
  const mx=cx+80*Math.cos(a-.25),my=cy+60*Math.sin(a-.25);
  out+=P(`M${cx} ${cy}Q${fmt(mx)} ${fmt(my)} ${fmt(bx)} ${fmt(by)}`,col,j===sel?9:7)+P(`M${cx} ${cy}Q${fmt(mx)} ${fmt(my)} ${fmt(bx)} ${fmt(by)}`,tint(col,.25),j===sel?4:3);
  b.kids.forEach((k,i)=>{const ka=a+(i-(b.kids.length-1)/2)*.42,kx=bx+70*Math.cos(ka),ky=by+50*Math.sin(ka);out+=P(`M${fmt(bx)} ${fmt(by)}Q${fmt((bx+kx)/2+6)} ${fmt((by+ky)/2-6)} ${fmt(kx)} ${fmt(ky)}`,col,2.5)+TF(kx+(Math.cos(ka)>=0?4:-4),ky-4,k,13,col,Math.cos(ka)>=0?'start':'end')});
  out+=hit(X,'sel',j,`Branch ${b.t}${j===sel?', selected':''}`,R(bx-38,by-14,76,26,j===sel?col:'#fff',col,13)+TBF(bx,by+5,b.t,13,j===sel?'#fff':col));
 });
 return out+Ci(cx,cy,46,'#fff8e1',C.amber)+TB(cx,cy-3,lab.split(' ').slice(0,2).join(' '),14,C.ink)+TB(cx,cy+15,lab.split(' ').slice(2).join(' '),14,C.ink);
}
SCENE({id:'mind-maps',name:'Mind maps',tag:'Radiating from one central idea',
 definition:'A mind map puts one central idea in the middle and radiates key words outwards on curved, coloured branches, so the hierarchy and connections are visible at once.',
 example:'Revising the First World War: Causes, Events, People and Effects branch from the centre, each with a few one-word ideas. Tony Buzan popularised the format in the 1970s.',
 research:'Buzan, T. (1974). Use Your Head. BBC Books. Earlier radial note-taking diagrams go back centuries; Buzan named and popularised the method.',
 desc:'A radial mind map with a central topic, coloured curved branches and short key words at their tips.',
 dur:11,hint:'Add branches and ideas; press a branch to choose where new ideas go.',
 init:()=>({br:[{t:'Causes',kids:['Trade','Alliances']},{t:'Events',kids:['1914']},{t:'People',kids:[]}],sel:0}),
 watch(p){const k=Math.floor(p*14),names=Object.keys(H5_POOL).slice(0,4),br=[];for(let i=0;i<k;i++){const j=i%4;if(!br[j])br[j]={t:names[j],kids:[]};else if(br[j].kids.length<H5_POOL[names[j]].length)br[j].kids.push(H5_POOL[names[j]][br[j].kids.length])}return {br:br.filter(Boolean),sel:-1}},
 ui:[{b:'Add a branch',act:'branch'},{b:'Add an idea',act:'idea'},{b:'Remove an idea',act:'remove'}],
 on:{sel(s,i){s.sel=Number(i)},branch(s){const left=Object.keys(H5_POOL).filter(k=>!s.br.some(b=>b.t===k));if(left.length){s.br.push({t:left[0],kids:[]});s.sel=s.br.length-1}},
  idea(s){const b=s.br[s.sel];if(!b)return;const pool=H5_POOL[b.t].filter(k=>!b.kids.includes(k));if(pool.length)b.kids.push(pool[0])},remove(s){const b=s.br[s.sel];if(b&&b.kids.length)b.kids.pop()}},
 draw(s,f,X){
  const out=H5_mindmap(s.br,s.sel,X);const n=sum(s.br.map(b=>b.kids.length));
  return {svg:heading('Central idea, branching key words',26)+out,phase:`${s.br.length} main branch${s.br.length===1?'':'es'}, ${n} idea${n===1?'':'s'}. Buzan’s rules: one key word per line, curved branches, colour per theme, thickest lines nearest the centre.`};
 }});

const H5_NOTES=[['Causes',['Trade rivalry','Alliances','Empires']],['Events',['1914: war begins','1916: Somme','1918: Armistice']],['Effects',['New borders','Treaty of Versailles']]];
SCENE({id:'mind-maps-formats',name:'Notes, mind map or concept map?',tag:'Three shapes for the same knowledge',
 definition:'Linear notes list ideas in order; a mind map radiates a hierarchy from one centre; a concept map links ideas with labelled arrows that state relationships.',
 example:'“Alliances → drew in → more countries” is a concept-map proposition: the link label says how two ideas relate, which neither notes nor a mind map show explicitly.',
 research:'Novak, J. D. & Gowin, D. B. (1984). Learning How to Learn. Cambridge University Press (concept maps, from Novak’s 1970s research programme).',
 desc:'The same history notes shown as an indented list, as a radial mind map, and as a concept map whose arrows carry verb phrases.',
 dur:12,hint:'Switch between the three formats. Ask what each one makes easy to see.',
 init:()=>({view:'concept'}),
 watch(p){return {view:['notes','mind','concept'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['notes','Linear notes'],['mind','Mind map'],['concept','Concept map']],label:'Format',get:s=>s.view,act:'view'}],
 on:{view(s,v){s.view=v}},
 draw(s,f,X){
  let out=heading({notes:'Linear notes: order and sequence',mind:'Mind map: hierarchy at a glance',concept:'Concept map: labelled relationships'}[s.view]);
  if(s.view==='notes'){let y=70;out+=TB(60,y,'The First World War',16,C.ink,'start');H5_NOTES.forEach(([h,items])=>{y+=34;out+=TB(80,y,h,15,C.blue,'start');items.forEach(t=>{y+=24;out+=T(110,y,'• '+t,14,C.ink,'start')})})}
  else if(s.view==='mind')out+=H5_mindmap(H5_NOTES.map(([t,k])=>({t,kids:k.map(x=>x.split(' ').slice(-1)[0])})),-1,null);
  else{const N={war:[300,72,'War (1914–18)'],all:[115,165,'Alliances'],emp:[485,165,'Empires'],cty:[115,315,'More countries'],treaty:[300,232,'Treaty of Versailles'],bord:[485,315,'New borders']};
   const E=[['all','war','drew countries into'],['emp','war','competed, causing'],['all','cty','brought in'],['war','treaty','ended with'],['treaty','bord','redrew'],['emp','bord','broke up into']];
   E.forEach(([a,b,l])=>{const A=N[a],B=N[b];out+=arrow(A[0],A[1]+(B[1]>A[1]?16:-16),B[0],B[1]+(B[1]>A[1]?-18:18),C.line,2);out+=R((A[0]+B[0])/2-62,(A[1]+B[1])/2-11,124,20,'#fff','none',4)+TF((A[0]+B[0])/2,(A[1]+B[1])/2+4,l,12,C.purple,'middle','font-style="italic"')});
   for(const k in N){const [x,y,l]=N[k];out+=R(x-74,y-16,148,32,C.pale,C.blue,16)+TF(x,y+5,l,13,C.ink,'middle','font-weight="650"')}}
  return {svg:out,phase:{notes:'Notes keep sequence and detail but hide structure: you must read everything to see how parts relate.',mind:'A mind map shows the hierarchy instantly but leaves relationships between branches unstated.',concept:'A concept map states each relationship as a proposition (“alliances drew countries into war”), so gaps and misconceptions become visible.'}[s.view]};
 }});

const H5_CLAIMS=[['Building a map yourself can help you remember the material a little better than your usual notes.','mixed','Small studies, e.g. Farrand et al. (2002) with medical students, found a modest recall benefit; generating material yourself helps memory generally (Slamecka & Graf, 1978).'],
 ['Concept maps with labelled links help learning more than reading the same text.','supported','A meta-analysis of dozens of studies (Nesbit & Adesope, 2006) found concept-map activities associated with better retention and transfer.'],
 ['Mind maps work because they engage both halves of the brain.','none','The “left-brain/right-brain learner” story is a neuromyth; both hemispheres work together in nearly all tasks.'],
 ['A mind map is always better than linear notes.','none','Effects are modest and depend on the task and learner; linear notes are better for sequences and detail.']];
const H5_VERD=[['supported','Supported',C.green],['mixed','Mixed / modest',C.amber],['none','Not supported',C.coral]];
SCENE({id:'mind-maps-evidence',name:'What the evidence says',tag:'Sorting claims about mind maps',
 definition:'Evidence for a learning technique comes from controlled comparisons: the same material learned with the technique and without it, then tested.',
 example:'Concept mapping has meta-analytic support; Buzan’s strongest claims about mind maps do not. Popular methods can be useful without every claim made for them being true.',
 research:'Farrand, P., Hussain, F. & Hennessy, E. (2002). The efficacy of the “mind map” study technique. Medical Education. Nesbit, J. C. & Adesope, O. O. (2006). Learning with concept and knowledge maps: a meta-analysis. Review of Educational Research.',
 desc:'Four claims about mind and concept maps, each with a verdict the learner chooses, checked against the published evidence.',
 dur:12,hint:'Press each claim to cycle your verdict, then press Check.',
 init:()=>({v:[null,null,null,null],checked:false}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return {v:H5_CLAIMS.map((c,i)=>i<k?c[1]:null),checked:true,upto:k}},
 ui:[{b:'Check',act:'check'}],
 on:{cyc(s,i){i=Number(i);const o=H5_VERD.map(v=>v[0]);s.v[i]=o[(o.indexOf(s.v[i])+1)%3];s.checked=false},check(s){s.checked=true}},
 draw(s,f,X){
  let out=heading('Which claims hold up?');let right=0;
  H5_CLAIMS.forEach(([c,truth,why],i)=>{const y=52+i*78,v=s.v[i],V=H5_VERD.find(x=>x[0]===v),shown=s.checked&&(s.upto===undefined||i<s.upto),ok=v===truth;if(shown&&ok)right++;
   const words=c.split(' ');let line='',rows=[];for(const w of words){if((line+' '+w).length>48){rows.push(line.trim());line=''}line+=' '+w}rows.push(line.trim());
   out+=hit(X,'cyc',i,`Claim ${i+1}: ${c} Your verdict: ${V?V[1]:'none'}. Press to change.`,R(20,y,370,70,'#fff',shown?(ok?C.green:C.coral):C.grid,8)+rows.slice(0,3).map((r,k)=>TF(32,y+20+k*17,r,13,C.ink,'start')).join(''));
   out+=R(400,y,180,30,V?tint(V[2],.82):'#f4f6f7',V?V[2]:C.grid,6)+TF(490,y+20,V?V[1]:'your verdict…',13,V?V[2]:C.muted);
   if(shown){const T0=H5_VERD.find(x=>x[0]===truth);out+=TF(490,y+52,(ok?'✓ ':'✗ ')+T0[1],13,T0[2],'middle','font-weight="700"')}});
  const say=s.checked?(s.upto!==undefined?(s.upto?H5_CLAIMS[s.upto-1][2]:'Each claim has a verdict from the research.'):`${right} of 4 match the evidence. ${H5_CLAIMS.map(c=>c[2]).join(' ')}`):'Decide for each claim: supported, mixed/modest, or not supported.';
  return {svg:out,phase:say};
 }});

/* ---------- Lesson: overview and detail (Shneiderman 1996; Furnas 1986) ---------- */
const H5_PTS=(()=>{const r=rng(91),c=[[.25,.7],[.7,.3],[.75,.75],[.35,.3]],pts=[];for(let i=0;i<64;i++){const k=i%4;pts.push({x:clamp(c[k][0]+(r()-.5)*.32,.02,.98),y:clamp(c[k][1]+(r()-.5)*.32,.02,.98),v:Math.round(5+r()*95),id:'P'+(i+1)})}return pts})();
SCENE({id:'overview-detail',name:'Overview first, zoom and filter, details on demand',tag:'Shneiderman’s mantra',
 definition:'Shneiderman’s visual information-seeking mantra: show an overview first, let people zoom in and filter out what they do not need, then give details on demand.',
 example:'64 points in four clusters: see the clusters, zoom into one, hide small values with a filter, then press a point for its exact numbers.',
 research:'Shneiderman, B. (1996). The eyes have it: a task by data type taxonomy for information visualizations. IEEE Symposium on Visual Languages.',
 desc:'A scatterplot of 64 points that can be zoomed to one quadrant, filtered by value, and queried for one point’s details.',
 dur:13,hint:'Press a quadrant to zoom, slide the filter, then press a point for details.',
 init:()=>({q:-1,min:0,sel:-1}),
 watch(p){if(p<.25)return {q:-1,min:0,sel:-1,ph:0};if(p<.5)return {q:2,min:0,sel:-1,ph:1};if(p<.75)return {q:2,min:Math.round((p-.5)*4*50),sel:-1,ph:2};return {q:2,min:50,sel:H5_PTS.findIndex(t=>t.x>.5&&t.y>.5&&t.v>=50),ph:3}},
 ui:[{range:'min',label:'Show values ≥',min:0,max:90,step:5,get:s=>s.min,act:'min'},{b:'Zoom out',act:'out'}],
 on:{zoom(s,q){s.q=Number(q);s.sel=-1},out(s){s.q=-1;s.sel=-1},min(s,v){s.min=v;if(s.sel>=0&&H5_PTS[s.sel].v<v)s.sel=-1},pt(s,i){s.sel=Number(i)}},
 draw(s,f,X){
  const steps=['Overview','Zoom','Filter','Details on demand'],ph=s.ph!==undefined?s.ph:s.sel>=0?3:s.min>0?2:s.q>=0?1:0;
  let out='';steps.forEach((t,i)=>out+=R(20+i*145,14,135,26,i===ph?C.blue:'#eef3f6','none',13)+TBF(87+i*145,32,t,13,i===ph?'#fff':C.muted));
  const x0=40,y0=55,W=380,H=290,qx=s.q%2,qy=Math.floor(s.q/2),zoom=s.q>=0;
  const map=t=>zoom?[x0+(t.x-qx*.5)*2*W,y0+(t.y-qy*.5)*2*H]:[x0+t.x*W,y0+t.y*H];
  out+=R(x0,y0,W,H,'#fff',C.grid,6);
  if(!zoom)for(let q=0;q<4;q++)out+=hit(X,'zoom',q,`Zoom into quadrant ${q+1}`,R(x0+(q%2)*W/2,y0+Math.floor(q/2)*H/2,W/2,H/2,'transparent','none',0))+(X.try?R(x0+(q%2)*W/2+2,y0+Math.floor(q/2)*H/2+2,W/2-4,H/2-4,'none',C.grid,4,'stroke-dasharray="4 4"'):'');
  out+=`<clipPath id="h5od"><rect x="${x0}" y="${y0}" width="${W}" height="${H}"/></clipPath><g clip-path="url(#h5od)">`;
  H5_PTS.forEach((t,i)=>{const [x,y]=map(t),vis=t.v>=s.min;if(!vis)return;const r=zoom?6+t.v/20:3+t.v/30;out+=hit(zoom?X:null,'pt',i,`Point ${t.id}, value ${t.v}`,Ci(x,y,r,i===s.sel?C.coral:tint(C.blue,.2),'#fff'))});
  out+='</g>';
  if(s.sel>=0){const t=H5_PTS[s.sel];out+=R(440,120,140,96,'#fff',C.coral,8)+TB(510,144,t.id,15,C.coral)+TF(510,168,`x ${fmt(t.x)}, y ${fmt(t.y)}`,13)+TF(510,188,`value ${t.v}`,13)}
  const shown=H5_PTS.filter(t=>t.v>=s.min&&(!zoom||(Math.floor(t.x*2)===qx&&Math.floor(t.y*2)===qy))).length;
  out+=counter(450,250,'points in view',shown,C.blue,120)+H5_ILLUS(x0,y0+H+20);
  return {svg:out,phase:['Overview: four clusters are visible before any detail. That shape guides where to look next.','Zoom: one quadrant fills the view; points get larger and separate.','Filter: hide what does not matter now (values below the threshold).','Details on demand: exact numbers appear only for the point you ask about.'][ph]};
 }});

const H5_WORDS=['Abacus','Babbage','Colossus','Dynabook','ENIAC','Flowchart','GUI','Hypertext','Icon','Joystick','Keyboard','Lisp','Mouse','NLS','Oscilloscope','Pointer','QWERTY','Recursion','Sketchpad','Teletype','Unix','Vector','Window','Xerox','Yarbus','Zoom'];
SCENE({id:'overview-detail-fisheye',name:'Fisheye views',tag:'Focus plus context',
 definition:'A fisheye view shows the item in focus in full detail and everything else progressively smaller, keeping context without scrolling away from it.',
 example:'A list of 26 terms: the one you point at and its neighbours are large and readable, distant entries shrink to small type, but none disappear.',
 research:'Furnas, G. W. (1986). Generalized fisheye views. CHI. Degree of interest = a priori importance − distance from the focus.',
 desc:'An alphabetical list of 26 terms where the focused term is largest and type size falls with distance, beside an ordinary scrolling window for comparison.',
 dur:11,hint:'Slide or press to move the focus. Compare with the plain scrolling list on the right.',
 init:()=>({f:12}),
 watch(p){return {f:Math.round(p*25)}},
 ui:[{range:'f',label:'Focus',min:0,max:25,get:s=>s.f,act:'f',show:v=>H5_WORDS[v]}],
 on:{f(s,v){s.f=v},pick(s,i){s.f=Number(i)}},
 draw(s,f,X){
  let out=heading('Fisheye list (left) and scrolling list (right)');
  const doi=H5_WORDS.map((w,i)=>-Math.abs(i-s.f)),hs=doi.map(d=>Math.max(7,26+d*4.2)),tot=sum(hs),sc=300/tot;let y=50;
  H5_WORDS.forEach((w,i)=>{const h=hs[i]*sc,fs=Math.max(4,Math.min(22,h*.8));if(fs>=8)out+=hit(X,'pick',i,`Focus on ${w}`,R(40,y,250,h-1,i===s.f?C.amberp:'transparent','none',3)+(fs>=11?TF(50,y+h*.72,w,fs,i===s.f?C.ink:C.muted,'start',i===s.f?'font-weight="700"':''):TF(50,y+h*.75,w,fs,C.muted,'start')));else out+=L(50,y+h/2,50+w.length*3,y+h/2,C.line,1);y+=h});
  const top=clamp(s.f-4,0,17);out+=R(330,50,240,300,'#fff',C.grid,8);
  for(let k=0;k<9;k++){const i=top+k;out+=R(338,58+k*32,224,28,i===s.f?C.amberp:'#fff','none',4)+T(350,78+k*32,H5_WORDS[i],16,i===s.f?C.ink:C.muted,'start')}
  out+=TF(450,368,`showing ${top+1}–${top+9} of 26; the rest is off-screen`,12,C.muted);
  return {svg:out,phase:`Focus: ${H5_WORDS[s.f]}. The fisheye keeps all 26 entries in view, with detail where you are looking; the scrolling list shows 9 in full and hides the rest.`};
 }});

const H5_WORLD=(()=>{const r=rng(321);let o=R(0,0,1200,760,'#eef4ef','none',0);for(let i=0;i<9;i++)o+=L(0,i*95,1200,i*95+30,'#d6dccf',10);for(let i=0;i<12;i++)o+=L(i*110,0,i*110-40,760,'#d6dccf',10);
 for(let i=0;i<40;i++){const x=r()*1150,y=r()*720;o+=R(x,y,30+r()*40,20+r()*30,['#c9d6e3','#e3d2c4','#d9cfe6'][i%3],'none',3)}
 o+=P('M0 600Q300 520 600 640T1200 560',C.blue,22,'none','opacity=".55"');
 [['Library',180,160],['Station',840,210],['Museum',520,420],['Park',1000,620],['Market',260,580],['Hospital',700,90]].forEach(([n,x,y])=>o+=Ci(x,y,16,C.coral,'#fff')+TF(x,y+38,n,26,C.ink,'middle','font-weight="700"'));return o})();
SCENE({id:'overview-detail-minimap',name:'Overview + detail',tag:'A small map that says where you are',
 definition:'An overview+detail interface shows a zoomed-in view beside a small overview of the whole, with a rectangle marking the part you are looking at.',
 example:'A city map: the main view shows streets in detail; the minimap shows the whole city and where your view sits. Reviews found that overviews help people navigate large spaces.',
 research:'Cockburn, A., Karlson, A. & Bederson, B. B. (2009). A review of overview+detail, zooming, and focus+context interfaces. ACM Computing Surveys.',
 desc:'A detailed view of part of a city map beside a minimap of the whole city with a rectangle marking the visible region.',
 dur:11,hint:'Press the minimap to move the view, and zoom in or out.',
 init:()=>({cx:520,cy:420,z:2.5}),
 watch(p){const path=[[180,160],[520,420],[840,210],[1000,620]],q=p*3,i=Math.min(2,Math.floor(q)),u=smooth(q-i);return {cx:lerp(path[i][0],path[i+1][0],u),cy:lerp(path[i][1],path[i+1][1],u),z:2.5}},
 ui:[{b:'Zoom in',act:'zin'},{b:'Zoom out',act:'zout'}],
 on:{go(s,a){const [c,r]=String(a).split(',').map(Number);s.cx=(c+.5)*300;s.cy=(r+.5)*190},zin(s){s.z=Math.min(4,s.z+.5)},zout(s){s.z=Math.max(1,s.z-.5)}},
 draw(s,f,X){
  const vw=1200/s.z/1.6,vh=vw*0.75,vx=clamp(s.cx-vw/2,0,1200-vw),vy=clamp(s.cy-vh/2,0,760-vh);
  let out=`<svg x="20" y="20" width="400" height="300" viewBox="${fmt(vx)} ${fmt(vy)} ${fmt(vw)} ${fmt(vh)}" preserveAspectRatio="xMidYMid slice">${H5_WORLD}</svg>`+R(20,20,400,300,'none',C.ink,4);
  out+=`<svg x="436" y="20" width="150" height="95" viewBox="0 0 1200 760">${H5_WORLD}</svg>`+R(436,20,150,95,'none',C.ink,3);
  const mx=436+vx/8,my=20+vy/8;out+=R(mx,my,vw/8,vh/8,'rgba(196,82,56,.15)',C.coral,2);
  if(X.try)for(let c=0;c<4;c++)for(let r=0;r<4;r++)out+=hit(X,'go',c+','+r,`Move view to column ${c+1}, row ${r+1}`,R(436+c*37.5,20+r*23.75,37.5,23.75,'transparent','none',0));
  out+=TF(511,134,'overview',13,C.muted)+counter(450,160,'zoom',fmt(s.z)+'×',C.blue,120)+TF(510,240,'The red box is',13,C.ink)+TF(510,258,'what the big view',13,C.ink)+TF(510,276,'shows.',13,C.ink);
  out+=T(220,350,'Detail view',14,C.muted);
  return {svg:out,phase:'The minimap answers “where am I?” without leaving the detail. The trade-off: the eye must switch between two views, which costs time in some tasks (Cockburn et al., 2009).'};
 }});

/* ---------- Lesson: animated bubbles (Rosling 2006) ---------- */
// Illustrative countries A–F, shaped like Gapminder's income/life-expectancy chart (not real data).
const H5_CTRY=[['A',800,12000,45,76,50,200,0],['B',2000,40000,65,82,40,70,1],['C',600,2400,40,64,30,110,2],['D',1500,9000,55,73,20,55,2],['E',9000,55000,70,83,60,90,1],['F',400,1800,38,62,10,60,3]];
const H5_REG=['#c45238','#1772b7','#2c776c','#9a6200'];
function H5_at(c,y){const u=smooth((y-1960)/60);let inc=c[1]*Math.pow(c[2]/c[1],u),life=lerp(c[3],c[4],u),pop=lerp(c[5],c[6],(y-1960)/60);if(c[0]==='D'){const d=Math.exp(-Math.pow((y-1997)/6,2));life-=12*d;inc*=1-.2*d}return {inc,life,pop}}
const H5_bx=inc=>70+(Math.log10(inc)-2.5)/(5-2.5)*470,H5_by=life=>330-(life-30)/60*270;
function H5_bubbles(year,opt={},X=null){
 let out=L(70,330,540,330,C.line)+L(70,330,70,60,C.line);
 [500,1000,5000,10000,50000].forEach(v=>{const x=H5_bx(v);out+=L(x,330,x,336,C.line)+TF(x,350,v>=1000?(v/1000)+'k':v,12,C.muted)});
 [40,60,80].forEach(v=>{const y=H5_by(v);out+=L(64,y,70,y,C.line)+TF(60,y+4,v,12,C.muted,'end')});
 out+=TF(305,368,'income per person (log scale)',12,C.muted)+TF(78,70,'life expectancy',12,C.muted,'start');
 if(opt.big!==false)out+=T(450,300,Math.round(year),52,'#dfe6ea','middle','font-weight="700"');
 H5_CTRY.forEach((c,i)=>{if(opt.trail==='all'||opt.trail===c[0]){let d='';for(let y=1960;y<=year;y+=2){const a=H5_at(c,y);d+=(d?'L':'M')+fmt(H5_bx(a.inc))+' '+fmt(H5_by(a.life))}out+=P(d,tint(H5_REG[c[7]],.35),2)}});
 H5_CTRY.forEach((c,i)=>{const a=H5_at(c,year),x=H5_bx(a.inc),y=H5_by(a.life),r=4+Math.sqrt(a.pop)*1.6;out+=hit(X,'follow',c[0],`Country ${c[0]}: follow its trail`,Ci(x,y,r,H5_REG[c[7]],'#fff','fill-opacity=".85"'))+TBF(x,y+4,c[0],12,'#fff')});
 return out;
}
SCENE({id:'animated-bubbles',name:'Animated bubble charts',tag:'Hans Rosling’s moving statistics',
 definition:'An animated bubble chart plots two measures on the axes, a third as bubble size and a fourth as colour, then moves time forward so the audience watches countries travel.',
 example:'Hans Rosling’s 2006 TED talk showed countries moving from “poor and short-lived” to “richer and longer-lived” over decades, overturning the idea of a fixed developed/developing divide.',
 research:'Rosling, H. (2006). The best stats you’ve ever seen. TED; Gapminder Foundation (Trendalyzer software).',
 desc:'Six illustrative countries as bubbles on income (log scale) against life expectancy, sized by population and coloured by region, moving from 1960 to 2020.',
 dur:14,hint:'Slide through the years, or press a bubble to follow its trail.',
 init:()=>({year:1990,trail:'D'}),
 watch(p){return {year:1960+p*60,trail:'none'}},
 ui:[{range:'year',label:'Year',min:1960,max:2020,get:s=>s.year,act:'year'},{choose:[['none','No trails'],['all','All trails']],label:'Trails',get:s=>s.trail==='all'?'all':'none',act:'trail'}],
 on:{year(s,v){s.year=v},trail(s,v){s.trail=v},follow(s,c){s.trail=s.trail===c?'none':c}},
 draw(s,f,X){
  const out=H5_bubbles(s.year,{trail:s.trail},X)+H5_ILLUS(540,52,'end');
  return {svg:out,phase:s.year>1990&&s.year<2004?'Country D’s life expectancy dips for a few years, then recovers: the kind of event a moving chart makes memorable.':'Every bubble moves up and to the right over time, at different speeds. Rosling used this to show that “the developing world” is not one group.'};
 }});

SCENE({id:'animated-bubbles-analysis',name:'Animation, trails or small multiples?',tag:'Presenting versus analysing',
 definition:'For analysis, static views of the same time series (trails or small multiples) let people compare years side by side; animation asks them to remember earlier frames.',
 example:'Robertson and colleagues found that viewers enjoyed animated bubbles and found them engaging, but made more errors and were slower when analysing trends than with traces or small multiples.',
 research:'Robertson, G., Fernandez, R., Fisher, D., Lee, B. & Stasko, J. (2008). Effectiveness of animation in trend visualization. IEEE TVCG (InfoVis).',
 desc:'The same six illustrative countries shown as an animation frame, as trails across all years, or as small multiples for each decade, with a question to answer.',
 dur:12,hint:'Choose a view, then answer: which country’s life expectancy fell for a while? Press its letter.',
 init:()=>({view:'anim',year:1975,ans:null}),
 watch(p){return {view:['anim','trails','multi'][Math.min(2,Math.floor(p*3))],year:1960+((p*3)%1)*60,ans:null}},
 ui:[{choose:[['anim','Animation'],['trails','Trails'],['multi','Small multiples']],label:'View',get:s=>s.view,act:'view'},{range:'year',label:'Year',min:1960,max:2020,get:s=>s.year,act:'year'}],
 on:{view(s,v){s.view=v},year(s,v){s.year=v},ans(s,c){s.ans=c}},
 draw(s,f,X){
  let out='';
  if(s.view==='anim')out+=H5_bubbles(s.year,{},null);
  else if(s.view==='trails')out+=H5_bubbles(2020,{trail:'all',big:false},null);
  else{for(let k=0;k<7;k++){const yr=1960+k*10,x=20+(k%4)*142,y=40+Math.floor(k/4)*160;out+=R(x,y,134,150,'#fff',C.grid,6)+TF(x+67,y+16,yr,13,C.ink,'middle','font-weight="700"');
    H5_CTRY.forEach(c=>{const a=H5_at(c,yr),bx=x+8+(Math.log10(a.inc)-2.5)/2.5*118,by=y+142-(a.life-30)/60*118;out+=Ci(bx,by,3+Math.sqrt(a.pop)*.6,H5_REG[c[7]],'#fff')+TF(bx,by-8,c[0],12,C.ink)})}}
  out+=R(450,326,140,40,'#fff',C.grid,8)+TF(456,342,'Which dipped?',12,C.ink,'start');
  H5_CTRY.forEach((c,i)=>{const on=s.ans===c[0],ok=c[0]==='D';out+=hit(X,'ans',c[0],`Answer ${c[0]}`,R(456+i*21,348,19,15,on?(ok?C.green:C.coral):'#eef3f6','none',3)+TBF(465.5+i*21,360,c[0],12,on?'#fff':C.ink))});
  return {svg:out,phase:s.ans?(s.ans==='D'?'Right: D. Notice which view made that easy. Trails show the dip as a hook; small multiples show it as a step backwards between panels.':`Not ${s.ans}. Try another view: in the animation you have to remember earlier frames.`):'Animation is good for telling a story to an audience; for finding patterns, views that put all the years on screen at once are usually faster and more accurate.'};
 }});

// Three questions from Factfulness (Rosling, Rosling & Rosling Rönnlund, 2018), with the book's answers.
const H5_QUIZ=[['In the last 20 years, the proportion of the world population living in extreme poverty has…',['almost doubled','stayed about the same','almost halved'],2],
 ['How many of the world’s 1-year-old children today have been vaccinated against some disease?',['20%','50%','80%'],2],
 ['Worldwide, 30-year-old men have spent 10 years in school on average. How many years have women of the same age?',['9 years','6 years','3 years'],0]];
SCENE({id:'animated-bubbles-factfulness',name:'Worse than chimpanzees',tag:'Rosling’s misconception tests',
 definition:'Rosling’s Gapminder tests asked people simple multiple-choice questions about global trends; most people, including experts, scored below what random guessing would give.',
 example:'A chimpanzee picking at random gets one of three answers right on average. In Gapminder’s surveys, people usually did worse, systematically choosing the most pessimistic option.',
 research:'Rosling, H., Rosling, O. & Rosling Rönnlund, A. (2018). Factfulness. Sceptre. Questions and answers as published there.',
 desc:'Three multiple-choice questions about global trends with the learner’s answers, the correct answers revealed, and a comparison with random guessing.',
 dur:13,hint:'Answer all three, then press Reveal. Compare your score with random guessing.',
 init:()=>({a:[-1,-1,-1],shown:false}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {a:[0,0,2],shown:true,upto:k}},
 ui:[{b:'Reveal',act:'reveal'},{b:'Clear',act:'clear'}],
 on:{pick(s,a){const [q,o]=String(a).split(',').map(Number);s.a[q]=o;s.shown=false},reveal(s){s.shown=true},clear(s){s.a=[-1,-1,-1];s.shown=false}},
 draw(s,f,X){
  let out=heading('Three questions about the world');let score=0;
  H5_QUIZ.forEach(([q,opts,ans],i)=>{const y=50+i*96,shown=s.shown&&(s.upto===undefined||i<s.upto);
   const words=q.split(' ');let line='',rows=[];for(const w of words){if((line+' '+w).length>70){rows.push(line.trim());line=''}line+=' '+w}rows.push(line.trim());
   rows.forEach((r,k)=>out+=TF(24,y+14+k*17,r,13,C.ink,'start'));
   opts.forEach((o,j)=>{const x=24+j*150,yy=y+18+rows.length*17,mine=s.a[i]===j,right=j===ans;
    const fill=shown&&right?C.greenp:mine?C.pale:'#fff',st=shown&&right?C.green:mine?C.blue:C.grid;
    out+=hit(X,'pick',i+','+j,`Question ${i+1}, answer: ${o}`,R(x,yy,140,30,fill,st,6)+TF(x+70,yy+20,String.fromCharCode(65+j)+'  '+o,13,C.ink))});
   if(shown&&s.a[i]===ans)score++});
  const anyAnswered=s.a.some(x=>x>=0);
  out+=R(480,60,110,150,'#fff',C.grid,8)+TF(535,84,'Random guessing',12,C.muted)+TB(535,108,'1 of 3',16,C.purple)+TF(535,140,X.try?'You':'Typical result',12,C.muted)+TB(535,164,X.try?(s.shown?`${score} of 3`:'?'):'below chance',X.try?16:13,C.blue);
  return {svg:out,phase:s.shown||!X.try?'Answers from Factfulness: almost halved; 80%; 9 years. Rosling argued that the errors are systematic, driven by instincts such as negativity and the habit of seeing the world as two groups.':anyAnswered?'Answer all three, then reveal.':'Choose an answer for each question.'};
 }});

/* ---------- Lesson: colour maps (Borland & Taylor 2007) ---------- */
const H5_MAPS={rainbow:['#00007f','#0000ff','#00ffff','#7fff7f','#ffff00','#ff0000','#7f0000'],viridis:['#440154','#3b528b','#21918c','#5ec962','#fde725'],grey:['#111111','#f0f0f0']};
const H5_FIELD=(x,y)=>clamp(.15+.6*Math.exp(-((x-.35)**2+(y-.45)**2)/.06)+.35*Math.exp(-((x-.75)**2+(y-.65)**2)/.025)+.1*x,0,1);
SCENE({id:'colour-maps',name:'Colour maps',tag:'Why the rainbow misleads',
 definition:'A colour map turns numbers into colours. A perceptually uniform map changes lightness steadily, so equal steps in data look like equal steps in colour; the rainbow does not.',
 example:'The same smooth hill drawn with a rainbow shows sharp “edges” where yellow and cyan bands appear; with a uniform map such as viridis, the slope looks as smooth as it is.',
 research:'Borland, D. & Taylor, R. M. (2007). Rainbow color map (still) considered harmful. IEEE Computer Graphics and Applications. Viridis: van der Walt & Smith (2015), matplotlib.',
 desc:'A smooth two-dimensional field drawn with a chosen colour map, beside the map’s colour bar and a graph of its lightness from low to high values.',
 dur:12,hint:'Switch maps and look for edges that are not in the data. The lightness curve shows why they appear.',
 init:()=>({m:'rainbow'}),
 watch(p){return {m:['rainbow','viridis','grey'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['rainbow','Rainbow'],['viridis','Viridis'],['grey','Greyscale']],label:'Colour map',get:s=>s.m,act:'m'}],
 on:{m(s,v){s.m=v}},
 draw(s){
  const st=H5_MAPS[s.m];let out=heading({rainbow:'Rainbow: bright bands look like edges',viridis:'Viridis: lightness rises steadily',grey:'Greyscale: honest but fewer distinguishable steps'}[s.m]);
  const nx=36,ny=24,cw=10,ch=11;for(let i=0;i<nx;i++)for(let j=0;j<ny;j++)out+=`<rect x="${30+i*cw}" y="${52+j*ch}" width="${cw+.5}" height="${ch+.5}" fill="${H5_ramp(st,H5_FIELD(i/nx,j/ny))}"/>`;
  out+=TF(210,340,'A smooth surface (no sharp edges in the data)',13,C.muted);
  for(let k=0;k<40;k++)out+=`<rect x="${410+k*4.4}" y="58" width="5" height="22" fill="${H5_ramp(st,k/39)}"/>`;
  out+=TF(410,96,'low',12,C.muted,'start')+TF(586,96,'high',12,C.muted,'end');
  out+=R(410,110,176,200,'#fff',C.grid,6)+TF(498,128,'Lightness along the map',12,C.ink);let d='';
  for(let k=0;k<=40;k++){const L0=Math.pow(H5_lum(H5_ramp(st,k/40)),1/2.2);d+=(k?'L':'M')+fmt(420+k*4)+' '+fmt(298-L0*150)}out+=P(d,C.ink,2.5);
  const mono=s.m!=='rainbow';out+=TF(498,334,mono?'Rises steadily: order is preserved':'Rises and falls: false bands',13,mono?C.green:C.coral,'middle','font-weight="650"');
  return {svg:out,phase:s.m==='rainbow'?'The eye reads lightness as “more”. The rainbow’s lightness peaks at yellow and cyan, so bright stripes appear where the data is smooth, and the order of colours must be learned.':s.m==='viridis'?'Viridis was designed so that lightness rises evenly and it still works in greyscale and for common colour-vision deficiencies.':'Greyscale preserves order perfectly, but people can tell fewer grey steps apart than coloured ones.'};
 }});

const H5_REGION=[[.1,.4,.8,.2],[.3,.9,.5,.1],[.6,.2,.0,.7],[.95,.55,.35,.45],[.15,.75,.65,.3],[.5,.05,.85,.6]];
const H5_SCH={seq:['#f7fbff','#c6dbef','#6baed6','#2171b5','#08306b'],div:['#b2182b','#ef8a62','#f7f7f7','#67a9cf','#2166ac'],cat:['#1b9e77','#d95f02','#7570b3','#e7298a','#66a61e'],rainbow:H5_MAPS.rainbow};
SCENE({id:'colour-maps-schemes',name:'Sequential, diverging, categorical',tag:'Choosing a scheme for the data',
 definition:'Sequential schemes run light to dark for amounts; diverging schemes run outwards from a meaningful midpoint; categorical schemes use distinct hues of similar lightness for unordered groups.',
 example:'Temperature change has a meaningful zero, so it suits a diverging scheme; population density suits a sequential one; land use (farm, forest, town) suits a categorical one.',
 research:'Harrower, M. & Brewer, C. A. (2003). ColorBrewer.org: an online tool for selecting colour schemes for maps. The Cartographic Journal.',
 desc:'A grid of map regions coloured by a chosen scheme for a chosen kind of data, with a verdict on whether the scheme fits.',
 dur:12,hint:'Pick the kind of data, then pick a scheme. Mismatches are flagged.',
 init:()=>({d:'div',sch:'seq'}),
 watch(p){const c=[['seq','seq'],['div','div'],['cat','cat'],['div','seq'],['cat','seq']][Math.min(4,Math.floor(p*5))];return {d:c[0],sch:c[1]}},
 ui:[{choose:[['seq','Density'],['div','Change from average'],['cat','Land use']],label:'Data',get:s=>s.d,act:'d'},{choose:[['seq','Sequential'],['div','Diverging'],['cat','Categorical'],['rainbow','Rainbow']],label:'Scheme',get:s=>s.sch,act:'sch'}],
 on:{d(s,v){s.d=v},sch(s,v){s.sch=v}},
 draw(s){
  const names={seq:'Population density (amount)',div:'Change from average (−/0/+)',cat:'Land use (farm, forest, town…)'};let out=heading(names[s.d]);
  const cols=H5_SCH[s.sch];
  for(let i=0;i<6;i++)for(let j=0;j<4;j++){const v=H5_REGION[i][j],c=s.d==='cat'?cols[Math.floor(v*4.99)%cols.length]:H5_ramp(cols,v);out+=R(40+i*58,60+j*58,54,54,c,'#fff',4)}
  const ok=s.sch===s.d,why={seq:{div:'Implies a meaningful middle that density does not have.',cat:'Unordered hues hide which areas are denser.',rainbow:'Hue order must be learned, and bright bands mislead.'},div:{seq:'Hides the zero point: decline and growth look like low and high.',cat:'Unordered hues cannot show more or less change.',rainbow:'No clear midpoint, and false bands.'},cat:{seq:'Light-to-dark implies an order between farm, forest and town.',div:'Implies opposites around a midpoint.',rainbow:'Neighbouring hues are hard to tell apart; many look ordered.'}};
  out+=R(410,70,176,160,ok?C.greenp:C.coralp,ok?C.green:C.coral,10)+TB(498,96,ok?'✓ Good match':'✗ Mismatch',16,ok?C.green:C.coral);
  const txt=ok?{seq:'Light to dark reads as less to more.',div:'Two hues meet at a neutral middle: above and below average.',cat:'Distinct hues, similar lightness: groups without an order.'}[s.d]:why[s.d][s.sch];
  const words=txt.split(' ');let line='',k=0;for(const w of words){if((line+' '+w).length>22){out+=TF(420,124+k*18,line.trim(),13,C.ink,'start');line='';k++}line+=' '+w}out+=TF(420,124+k*18,line.trim(),13,C.ink,'start');
  out+=H5_ILLUS(40,310);
  return {svg:out,phase:'Choose the scheme from the structure of the data, not from taste: amount → sequential, deviation from a midpoint → diverging, unordered groups → categorical.'};
 }});

// Simulated deuteranopia (Machado, Oliveira & Fernandes 2009, severity 1.0), applied in linear RGB.
const H5_DEUT=[[.367322,.860646,-.227968],[.280085,.672501,.047413],[-.011820,.042940,.968881]];
const H5_cvd=h=>{const c=H5_rgb(h).map(H5_lin);return H5_hex(H5_DEUT.map(r=>H5_unlin(r[0]*c[0]+r[1]*c[1]+r[2]*c[2])))};
SCENE({id:'colour-maps-cvd',name:'Colour-vision deficiency',tag:'Do not rely on red versus green',
 definition:'Colour-vision deficiency means some hues cannot be told apart; the most common form confuses reds and greens. Redundant encoding (shape, line style, direct labels) keeps a chart readable for everyone.',
 example:'Roughly 1 in 12 men and 1 in 200 women of northern European ancestry have a red–green deficiency. A red-versus-green chart can become two indistinguishable olive lines.',
 research:'Machado, G. M., Oliveira, M. M. & Fernandes, L. A. F. (2009). A physiologically-based model for simulation of color vision deficiency. IEEE TVCG.',
 desc:'A two-line chart in red and green, optionally shown through a simulation of deuteranopia, and optionally with redundant encoding by line style, markers and direct labels.',
 dur:12,hint:'Turn on the simulation, then add redundant encoding and see the chart become readable again.',
 init:()=>({sim:true,red:false}),
 watch(p){return {sim:p>=.33,red:p>=.66}},
 ui:[{choose:[['0','Normal vision'],['1','Simulated deuteranopia']],label:'Vision',get:s=>s.sim?'1':'0',act:'sim'},{choose:[['0','Colour only'],['1','Redundant encoding']],label:'Encoding',get:s=>s.red?'1':'0',act:'red'}],
 on:{sim(s,v){s.sim=v==='1'},red(s,v){s.red=v==='1'}},
 draw(s){
  const col=h=>s.sim?H5_cvd(h):h,a='#d62728',b='#2ca02c';let out=heading(s.sim?'Seen with a red–green deficiency (simulated)':'Seen with typical colour vision');
  out+=L(60,320,560,320,C.line)+L(60,320,60,60,C.line);
  const A=[200,215,190,230,250,240,270,265],B=[180,170,200,195,215,250,235,280];
  const pts=v=>v.map((y,i)=>[60+i*68,330-y*.95]);
  [[A,a,'Product A','',0],[B,b,'Product B','8 5',1]].forEach(([v,c,lab,dash,k])=>{const p=pts(v);out+=P('M'+p.map(q=>q.map(fmt).join(' ')).join('L'),col(c),4,'none',s.red&&dash?`stroke-dasharray="${dash}"`:'');
   if(s.red)p.forEach(([x,y])=>out+=k?R(x-5,y-5,10,10,col(c),'#fff',1):Ci(x,y,5.5,col(c),'#fff'));
   if(s.red)out+=TB(p[7][0]+8,p[7][1]+(k?-6:14),lab,13,col(c),'start')});
  if(!s.red)out+=R(70,70,130,54,'#fff',C.grid,6)+L(80,88,104,88,col(a),4)+TF(110,92,'Product A',13,C.ink,'start')+L(80,110,104,110,col(b),4)+TF(110,114,'Product B',13,C.ink,'start');
  out+=H5_ILLUS(60,345);
  return {svg:out,phase:s.sim&&!s.red?'Through the simulation both lines turn a similar olive: the legend no longer says which is which.':s.red?'Line style, marker shape and direct labels carry the same distinction as colour, so it survives any vision, greyscale printing or a poor projector.':'Red versus green looks clear with typical vision. Turn on the simulation to see what many readers see.'};
 }});
