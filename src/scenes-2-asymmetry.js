/* ===================== Levin Lab In Motion · Era 2 · Left and right ===================== */
// How a vertebrate embryo tells left from right: organ placement, the Nodal gene cascade, the lab's ion-flux,
// serotonin and gap-junction proposals, and the debate with the cilia-flow account.
// Every picture is a pure function of state, frame and X. Random runs use seeded generators (L2_rng).
// Every simulation carries the "Simplified model" badge; every number on screen is computed by the code below,
// except published dates and the stated model inputs.

/* ---- shared helpers ---- */
const L2_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const L2_rng=n=>rng(L2_mix(n));
// The six evidence labels of the course, with ink and background colours.
const L2_LAB={rep:['Replicated finding',C.green,C.greenp],single:['Single-lab finding',C.blue,C.pale],frame:['Framework or hypothesis',C.purple,C.purplep],spec:['Speculation',C.amber,C.amberp],debate:['Criticism and debate',C.coral,C.coralp],model:['Simplified model',C.dark,'#edf1f3']};
const L2_bw=k=>Math.round(L2_LAB[k][0].length*7.4+16);
function L2_badge(x,y,k,anchor='start'){const [t,ink,bg]=L2_LAB[k];const w=L2_bw(k),x0=anchor==='end'?x-w:anchor==='middle'?x-w/2:x;return R(x0,y,w,21,bg,ink,10)+TBF(x0+w/2,y+15,t,13,ink)}
const L2_note=(s,y=370,col=C.muted)=>TF(300,y,s,13,col);
function L2_tile(x,y,w,label,value,col=C.blue){return R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,13,C.muted)+TBF(x+w/2,y+38,value,16,col)}
const L2_r1=v=>Math.round(v*10)/10;
const L2_mv=v=>{const r=L2_r1(v);return (r<0?'−':r>0?'+':'')+fmt(Math.abs(r))+' mV'};
const L2_sgn=v=>Math.abs(v)<.005?'0':(v<0?'−':'+')+fmt(Math.abs(v));
const L2_pct=(n,d)=>d?Math.round(100*n/d)+'%':'–';
const L2_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const L2_side=v=>v<0?'left':'right';
// RT/F in millivolts at 20 °C (a frog-embryo culture temperature): computed from the gas constant, not typed.
const L2_RTF=8.314*293.15/96485*1000;

/* ---- organ placement: three organs scored in frog embryos (heart, gut, gall bladder) ---- */
// o = {heart,gut,gb}, each 'n' (usual side) or 'r' (reversed).
const L2_ORG=['heart','gut','gb'],L2_ORGNAME={heart:'heart',gut:'gut coil',gb:'gall bladder'};
function L2_cls(o){const r=L2_ORG.filter(k=>o[k]==='r').length;return r===0?'normal':r===3?'reversed':'hetero'}
const L2_CLSNAME={normal:'Normal',reversed:'Reversed',hetero:'Heterotaxic'};
// A schematic tadpole seen from below, body's left drawn on the left. Not anatomy: three markers in usual or mirrored places.
function L2_tad(x,y,o,sc=1,ring=null){
 const S=v=>v*sc,sh=o.heart==='n'?-1:1,sg=o.gb==='n'?1:-1,gs=o.gut==='n'?1:-1;
 let out=P(`M${fmt(x-S(24))} ${fmt(y-S(6))}C${fmt(x-S(26))} ${fmt(y-S(40))} ${fmt(x+S(26))} ${fmt(y-S(40))} ${fmt(x+S(24))} ${fmt(y-S(6))}C${fmt(x+S(22))} ${fmt(y+S(22))} ${fmt(x+S(8))} ${fmt(y+S(30))} ${fmt(x)} ${fmt(y+S(32))}C${fmt(x-S(8))} ${fmt(y+S(30))} ${fmt(x-S(22))} ${fmt(y+S(22))} ${fmt(x-S(24))} ${fmt(y-S(6))}Z`,ring||C.line,ring?2.6:1.6,'#fff');
 out+=P(`M${fmt(x)} ${fmt(y+S(32))}Q${fmt(x+S(6))} ${fmt(y+S(48))} ${fmt(x)} ${fmt(y+S(62))}`,C.line,1.6);
 // heart: a teardrop whose apex points to one side
 const hx=x,hy=y-S(22);
 out+=P(`M${fmt(hx-sh*S(8))} ${fmt(hy-S(5))}Q${fmt(hx)} ${fmt(hy-S(11))} ${fmt(hx+sh*S(6))} ${fmt(hy-S(4))}L${fmt(hx+sh*S(14))} ${fmt(hy+S(6))}Q${fmt(hx)} ${fmt(hy+S(6))} ${fmt(hx-sh*S(8))} ${fmt(hy-S(5))}Z`,C.coral,1.4,C.coralp);
 // gut: a coil with an arrowhead showing its turning direction
 const pts=[];for(let i=0;i<=24;i++){const a=i/24*Math.PI*1.7,r=S(3+i*.34);pts.push([x+gs*r*Math.cos(a),y+S(6)+r*Math.sin(a)])}
 out+=L2_poly(pts,C.green,1.6);const e=pts[pts.length-1],q=pts[pts.length-3];out+=arrow(q[0],q[1],e[0],e[1],C.green,1.6,S(5));
 // gall bladder
 out+=Ci(x+sg*S(15),y-S(9),S(3.6),C.amber);
 return out;
}
// Seeded embryos for a treatment of strength s (chance that the usual bias is lost) and coordination q
// (chance that each organ follows the embryo's chosen side). Each embryo keeps its own random numbers, so raising s
// only adds affected embryos.
function L2_embryos(n,s,q,seed){
 const r=L2_rng(seed),out=[];
 for(let i=0;i<n;i++){const a=r(),m=r(),u=[r(),r(),r()],aff=a<s,master=m<.5?'n':'r',o={};
  L2_ORG.forEach((k,j)=>{o[k]=!aff?'n':(u[j]<q?master:(master==='n'?'r':'n'))});out.push({...o,aff})}
 return out;
}
const L2_tally=list=>{const t={normal:0,reversed:0,hetero:0};for(const o of list)t[L2_cls(o)]++;return t};

/* ===================== Lesson: body-asymmetry ===================== */
const L2_BODY=['heart','lungs','liver','stomach'],L2_BODYNAME={heart:'Heart (apex)',lungs:'Lungs (lobes)',liver:'Liver',stomach:'Stomach'};
const L2_bodyInit=()=>({rev:{heart:0,lungs:0,liver:0,stomach:0}});
function L2_bodyClass(rev){const k=L2_BODY.filter(o=>rev[o]).length;return {k,cls:k===0?'solitus':k===L2_BODY.length?'inversus':'hetero'}}
SCENE({id:'body-asymmetry',name:'Symmetric outside, asymmetric inside',tag:'Replicated finding · organ placement in vertebrates',
 definition:'Vertebrates look nearly mirror-symmetric from outside, but the organs inside are not. In most people the heart points to the left, the stomach lies on the left, the liver mostly on the right, and the right lung has three lobes against two on the left. This is a replicated finding of anatomy, true across vertebrates in its broad plan.',
 example:'The usual arrangement is called situs solitus; a complete mirror image is situs inversus; a mixture, with some organs reversed and others not, is heterotaxy. Situs inversus by itself often causes no problems; heterotaxy can involve heart defects.',
 desc:'A schematic trunk drawn as seen from behind, so the body’s left is on the left, with heart, lungs, liver and stomach. Each organ can be mirrored, and a panel names the arrangement.',
 research:['Afzelius (1976). A human syndrome caused by immotile cilia. Science 193, 317–319: three of his four patients with immotile cilia had situs inversus, an early clue that something mobile helps set left and right.'],
 dur:10,hint:'Press an organ (or its row in the panel) to mirror it. Mirror all four for situs inversus, or only some for heterotaxy.',
 init:L2_bodyInit,
 watch(p){const s=L2_bodyInit();if(p>=1/3&&p<2/3)L2_BODY.forEach(o=>s.rev[o]=1);else if(p>=2/3){s.rev.heart=1;s.rev.stomach=1}return s},
 ui:[{b:'Usual arrangement',act:'solitus'},{b:'Mirror everything',act:'inversus'}],
 on:{flip(s,o){if(L2_BODY.includes(o))s.rev[o]=s.rev[o]?0:1},solitus(s){L2_BODY.forEach(o=>s.rev[o]=0)},inversus(s){L2_BODY.forEach(o=>s.rev[o]=1)}},
 draw(s,f,X){
  const {k,cls}=L2_bodyClass(s.rev),cx=165,sd=o=>(o==='heart'||o==='stomach'?-1:1)*(s.rev[o]?-1:1);
  let out=heading(cls==='solitus'?'The usual arrangement':cls==='inversus'?'A complete mirror image':'A mixed arrangement',30);
  out+=TF(80,62,'body’s left',13,C.muted)+TF(250,62,'body’s right',13,C.muted);
  out+=P(`M115 74C92 84 82 120 84 176C86 246 102 300 122 344L208 344C228 300 244 246 246 176C248 120 238 84 215 74Z`,C.line,2,'#fbfdfe');
  out+=L(cx,80,cx,340,C.grid,1.5,'stroke-dasharray="5 5"');
  // lungs: the three-lobed lung sits on the right in the usual plan
  let lungs='';for(const side of [-1,1]){const lx=cx+side*44,three=sd('lungs')===side;
   lungs+=`<ellipse cx="${lx}" cy="140" rx="30" ry="50" fill="#eef6fb" stroke="${C.blue}" stroke-width="2"/>`;
   lungs+=three?L(lx-26,124,lx+26,116,C.blue,1.4)+L(lx-26,154,lx+26,146,C.blue,1.4):L(lx-26,140,lx+26,132,C.blue,1.4);
   lungs+=TF(lx,84,three?'3 lobes':'2 lobes',13,C.blue)}
  out+=hit(X,'flip','lungs','Lungs: press to mirror',lungs);
  const h=sd('heart');
  out+=hit(X,'flip','heart','Heart: press to mirror',P(`M${cx-h*18} 150Q${cx} 136 ${cx+h*14} 150Q${cx+h*34} 174 ${cx+h*32} 190Q${cx+h*8} 188 ${cx-h*14} 172Q${cx-h*26} 160 ${cx-h*18} 150Z`,C.coral,2.4,C.coralp)+TBF(cx+h*36,210,'heart',13,C.coral,h<0?'end':'start'));
  const lv=sd('liver');
  out+=hit(X,'flip','liver','Liver: press to mirror',P(`M${cx-lv*34} 226L${cx+lv*72} 218Q${cx+lv*80} 252 ${cx+lv*46} 266Q${cx} 262 ${cx-lv*34} 240Z`,C.amber,2.2,C.amberp)+TF(cx+lv*30,248,'liver',13,C.amber));
  const st=sd('stomach');
  out+=hit(X,'flip','stomach','Stomach: press to mirror',`<ellipse cx="${cx+st*50}" cy="292" rx="28" ry="18" transform="rotate(${st*-24} ${cx+st*50} 292)" fill="${C.greenp}" stroke="${C.green}" stroke-width="2"/>`+TF(cx+st*50,297,'stomach',13,C.green));
  // panel
  out+=L2_badge(590,46,'rep','end');
  L2_BODY.forEach((o,i)=>{const y=86+i*44,rv=s.rev[o];
   out+=hit(X,'flip',o,`${L2_BODYNAME[o]}: ${rv?'reversed':'usual side'}. Press to mirror.`,R(318,y,272,36,rv?C.coralp:'#fff',rv?C.coral:C.grid,8)+TF(330,y+23,L2_BODYNAME[o],13,C.ink,'start')+TBF(578,y+23,rv?'reversed':'usual side',13,rv?C.coral:C.green,'end'))});
  out+=L2_tile(318,264,130,'Usual side',`${L2_BODY.length-k} of ${L2_BODY.length}`,C.green)+L2_tile(460,264,130,'Mirrored',`${k} of ${L2_BODY.length}`,C.coral);
  out+=R(318,318,272,34,cls==='solitus'?C.greenp:cls==='inversus'?C.pale:C.coralp,'none',8)+TBF(454,340,cls==='solitus'?'Situs solitus':cls==='inversus'?'Situs inversus totalis':'Heterotaxy',15,cls==='hetero'?C.coral:C.ink);
  out+=L2_note('Schematic, seen from behind. Not to scale.',372);
  const ph=cls==='solitus'?'The usual plan: heart pointing left, stomach left, liver mostly right, three lobes in the right lung. Every vertebrate embryo has to make these choices the same way, so something must tell its left from its right.':
   cls==='inversus'?'Every organ is mirrored, but they still fit together, because the whole plan flipped as one. This is why situs inversus by itself often causes no problems.':
   `Only ${k} of ${L2_BODY.length} organs are mirrored. When organs disagree about which side is which, the connections between them, especially the heart’s vessels, can go wrong. Heterotaxy is the outcome embryologists score most closely.`;
  return {svg:out,phase:ph};
 }});

// Scoring a dish of model tadpoles: the learner labels each one, the scene checks against the rule.
const L2_DISH=L2_embryos(12,.75,.72,2002);
const L2_SCORES=['?','normal','reversed','hetero'];
SCENE({id:'body-asymmetry-scoring',name:'Scoring a dish of tadpoles',tag:'Replicated finding · laterality as a readout · Simplified model dish',
 definition:'In experiments on left and right, each frog embryo is scored once it is a tadpole: is the heart, the coil of the gut and the gall bladder each on its usual side? An embryo with all three usual is normal, all three mirrored is reversed (situs inversus), and any mixture is heterotaxic. The percentages of each class are the experiment’s result.',
 example:'Levin and Mercola (1998) reported heterotaxia in frog embryos as reversals of the heart, gut and gall bladder. Scoring organ positions this way is a standard method used by many labs. A dish of 12 toy tadpoles here is generated by a seeded model, so the right answer for each is known and your percentages can be checked.',
 desc:'Twelve schematic tadpoles, each with a heart, a gut coil and a gall bladder on the usual or mirrored side. Pressing a tadpole cycles its score; a tally shows your percentages and how many agree with the rule.',
 research:['Levin & Mercola (1998). Gap junctions are involved in the early generation of left–right asymmetry. Developmental Biology 203, 90–105 (heterotaxia scored as reversals of heart, gut and gall bladder in Xenopus).'],
 dur:12,hint:'Press each tadpole to cycle its score: normal, reversed, heterotaxic. Compare all three organs with the key at the top before you decide.',
 init:()=>({sc:L2_DISH.map(()=>0)}),
 watch(p){const k=Math.floor(clamp(p*1.15,0,1)*L2_DISH.length);return {sc:L2_DISH.map((o,i)=>i<k?L2_SCORES.indexOf(L2_cls(o)):0)}},
 ui:[{b:'Clear my scores',act:'clear'}],
 on:{score(s,i){i=+i;if(i>=0&&i<L2_DISH.length)s.sc[i]=(s.sc[i]+1)%L2_SCORES.length;return 'keep'},clear(s){s.sc=L2_DISH.map(()=>0)}},
 draw(s,f,X){
  const n=L2_DISH.length,scored=s.sc.filter(v=>v>0).length,right=s.sc.filter((v,i)=>v>0&&L2_SCORES[v]===L2_cls(L2_DISH[i])).length;
  const mine={normal:0,reversed:0,hetero:0};s.sc.forEach(v=>{if(v>0)mine[L2_SCORES[v]]++});
  let out=heading('Score each tadpole',26)+L2_badge(10,40,'rep')+L2_badge(590,40,'model','end');
  // key
  out+=TF(300,80,'Usual sides in this model:',13,C.muted);
  out+=TF(150,98,'heart points left',13,C.coral)+TF(300,98,'gut turns clockwise ↻',13,C.green)+TF(450,98,'gall bladder right',13,C.amber);
  L2_DISH.forEach((o,i)=>{const cx=60+(i%6)*96,cy=160+Math.floor(i/6)*104,v=s.sc[i],lab=L2_SCORES[v],ok=v>0&&lab===L2_cls(o);
   const inner=R(cx-44,cy-46,88,100,v?'#fbfdfe':'#fff',v?(X&&X.try?(ok?C.green:C.coral):C.blue):C.grid,8)+L2_tad(cx,cy-6,o,.95)+TF(cx,cy+46,v?L2_CLSNAME[lab]:'unscored',13,v?C.ink:C.muted);
   out+=hit(X,'score',i,`Tadpole ${i+1}: ${v?L2_CLSNAME[lab]:'not scored'}. Press to change.`,inner)});
  out+=L2_tile(12,324,140,'Normal',`${mine.normal} · ${L2_pct(mine.normal,scored)}`,C.green)+L2_tile(160,324,140,'Reversed',`${mine.reversed} · ${L2_pct(mine.reversed,scored)}`,C.blue)+L2_tile(308,324,140,'Heterotaxic',`${mine.hetero} · ${L2_pct(mine.hetero,scored)}`,C.coral)+L2_tile(456,324,132,'Agree with rule',`${right} of ${scored}`,C.ink);
  const t=L2_tally(L2_DISH);
  return {svg:out,phase:scored<n?`${scored} of ${n} scored. Look at the heart’s point, the gut’s turning arrow and the gall bladder dot, and compare each with the key.`:
   right===n?`All ${n} agree with the rule: ${t.normal} normal, ${t.reversed} reversed, ${t.hetero} heterotaxic. In a real dish many more embryos are scored, and the percentages are compared with untreated controls.`:
   `${right} of ${n} agree with the rule. A tadpole is reversed only if all three organs are mirrored; one or two mirrored makes it heterotaxic.`};
 }});

const L2_RN=200;
SCENE({id:'body-asymmetry-random',name:'Why a lost bias gives about half reversed',tag:'Simplified model · what laterality percentages mean',
 definition:'If a treatment removes whatever normally biases an embryo towards its usual side, the embryo still has to choose a side, and it chooses at random. If its organs then follow that choice together, about half come out normal and half fully reversed. If the organs do not all follow, some come out heterotaxic.',
 example:'People with immotile cilia have situs inversus in roughly half of cases, as if the side were left to chance. In this toy, a weak treatment affects few embryos and raises heterotaxy only slightly; a strong one gives about as many reversed as normal. All percentages here are computed from 200 seeded toy embryos.',
 desc:'A grid of 200 toy embryos marked as normal (dot), reversed (ring) or heterotaxic (triangle), with bars for each class and the values the model predicts, for a chosen treatment strength and coordination between organs.',
 research:['Afzelius (1976), Science 193, 317–319, and later work on immotile-cilia syndrome: situs inversus in about half of patients, consistent with a side chosen by chance.','The toy is written for this course; it is not a model from any one paper.'],
 dur:12,hint:'Raise the treatment strength to remove the bias from more embryos; lower the coordination to let organs choose separately. Watch which class grows.',
 init:()=>({s:60,q:85}),
 watch(p){return {s:Math.round(clamp(p*1.2,0,1)*100),q:85}},
 ui:[{range:'s',label:'Treatment strength (% of embryos losing the bias)',min:0,max:100,step:5,get:s=>s.s,act:'s'},{range:'q',label:'Organs follow the embryo’s choice (%)',min:50,max:100,step:5,get:s=>s.q,act:'q'}],
 on:{s(s,v){s.s=clamp(Math.round(+v),0,100)},q(s,v){s.q=clamp(Math.round(+v),50,100)}},
 draw(s){
  const sv=s.s/100,q=s.q/100,list=L2_embryos(L2_RN,sv,q,1976),t=L2_tally(list),aff=list.filter(o=>o.aff).length;
  const same=Math.pow(q,3)+Math.pow(1-q,3),ex={normal:(1-sv)+sv*same/2,reversed:sv*same/2,hetero:sv*(1-same)};
  let out=heading('200 toy embryos, one treatment',26)+L2_badge(10,40,'model');
  list.forEach((o,i)=>{const x=24+(i%20)*13.4,y=82+Math.floor(i/20)*15.5,c=L2_cls(o);
   out+=c==='normal'?Ci(x,y,4.4,C.green):c==='reversed'?Ci(x,y,4.2,'#fff',C.blue):`<polygon points="${fmt(x)},${fmt(y-5.5)} ${fmt(x+5)},${fmt(y+4)} ${fmt(x-5)},${fmt(y+4)}" fill="${C.coral}"/>`});
  out+=Ci(30,252,4.4,C.green)+TF(40,257,'normal',13,C.ink,'start')+Ci(110,252,4.2,'#fff',C.blue)+TF(120,257,'reversed',13,C.ink,'start')+`<polygon points="200,246 205,256 195,256" fill="${C.coral}"/>`+TF(212,257,'heterotaxic',13,C.ink,'start');
  // bars
  const bx=310,bw=270,classes=[['normal','Normal',C.green],['reversed','Reversed',C.blue],['hetero','Heterotaxic',C.coral]];
  out+=TF(bx,74,'in this dish',13,C.muted,'start')+TF(bx+bw,74,'model expects',13,C.muted,'end');
  classes.forEach(([k,lab,col],i)=>{const y=88+i*54,w=t[k]/L2_RN*bw;
   out+=TBF(bx,y+12,lab,13,col,'start')+TBF(bx+bw,y+12,`${L2_pct(t[k],L2_RN)} · expects ${Math.round(ex[k]*100)}%`,13,col,'end')+R(bx,y+18,bw,16,'#f3f6f8','none',4)+R(bx,y+18,w,16,col,'none',4)+L(bx+ex[k]*bw,y+14,bx+ex[k]*bw,y+38,C.ink,2)});
  out+=TF(bx,262,'black tick: the model’s expected share',13,C.muted,'start');
  out+=L2_tile(20,282,180,'Embryos without bias',`${aff} of ${L2_RN}`,C.ink)+L2_tile(210,282,180,'All organs agree',`${Math.round(same*100)}% of those`,C.purple)+L2_tile(400,282,180,'Reversed : normal',t.normal?`${t.reversed} : ${t.normal}`:'–',C.blue);
  out+=L2_note('A cartoon of the logic of scoring, not a model of any real embryo or treatment.',354);
  const ph=sv===0?'No embryo loses its bias, so all 200 are normal. This is the untreated control.':
   sv>=.95&&q>=.95?`Every embryo chooses its side by chance and the organs follow together: ${t.normal} normal and ${t.reversed} reversed, close to half each. A fully randomising treatment looks like this.`:
   sv<=.25?`A weak treatment: only ${aff} embryos lose the bias, and only some of those come out heterotaxic (${t.hetero}). Heterotaxy rises slightly, which is how a weak effect often looks in a real experiment.`:
   `${aff} embryos lost the bias. Of those, about ${Math.round(same*100)}% have all three organs agreeing, split between normal and reversed; the rest are heterotaxic. Reversed and heterotaxic embryos are the experiment’s signal.`;
  return {svg:out,phase:ph};
 }});

/* ===================== Lesson: left-right-cascade ===================== */
// Word-wrap for fixed-size 13-unit text: about 6.9 units per character.
function L2_wrap(s,width){const max=Math.max(8,Math.floor(width/6.9)),out=[];let line='';for(const w of String(s).split(' ')){if((line+' '+w).trim().length>max&&line){out.push(line);line=w}else line=(line+' '+w).trim()}if(line)out.push(line);return out}
function L2_para(x,y,s,width,col=C.ink,lh=17,anchor='start'){return L2_wrap(s,width).map((l,i)=>TF(x,y+i*lh,l,13,col,anchor)).join('')}
// A chick embryo disc seen from above (dorsal side up, its left on the left). g: which regions are lit.
function L2_chick(X,g,sel,cx=160){
 let out=`<ellipse cx="${cx}" cy="208" rx="112" ry="148" fill="#fbf8f1" stroke="${C.line}" stroke-width="2"/>`;
 out+=L(cx,318,cx,164,C.muted,5)+TF(cx,340,'primitive streak',13,C.muted);
 const reg=(id,lab,inner)=>hit(X,'sel',id,lab,inner+(sel===id?'':''));
 const nodeL=g.shhL,nodeR=g.actR;
 out+=reg('nodeL','Left side of the node',P(`M${cx} 140A16 16 0 0 0 ${cx} 172Z`,sel==='nodeL'?C.ink:C.purple,sel==='nodeL'?2.6:1.6,nodeL?C.purple:'#fff'));
 out+=reg('nodeR','Right side of the node',P(`M${cx} 140A16 16 0 0 1 ${cx} 172Z`,sel==='nodeR'?C.ink:C.blue,sel==='nodeR'?2.6:1.6,nodeR?C.blue:'#fff'));
 out+=TF(cx,128,'Hensen’s node',13,C.muted);
 for(const [id,x,on,lab] of [['lpmL',cx-66,g.nodalL,'Left lateral plate'],['lpmR',cx+66,g.nodalR,'Right lateral plate']])
  out+=reg(id,lab,`<ellipse cx="${x}" cy="232" rx="22" ry="62" fill="${on?C.green:'#fff'}" fill-opacity="${on?.75:1}" stroke="${sel===id?C.ink:C.green}" stroke-width="${sel===id?2.6:1.6}" stroke-dasharray="${on?'none':'4 4'}"/>`);
 out+=TF(cx-66,312,'left',13,C.muted)+TF(cx+66,312,'right',13,C.muted);
 if(g.heart){const d=g.heart;out+=reg('heart','Heart tube',P(`M${cx} 104C${cx} 92 ${cx+d*26} 90 ${cx+d*26} 76C${cx+d*26} 64 ${cx} 62 ${cx} 52`,sel==='heart'?C.ink:C.coral,6)+TF(cx-d*16,80,'heart',13,C.coral,d>0?'end':'start'))}
 return out;
}
const L2_CSTAGE=[
 {name:'Streak forms',g:{},say:'The primitive streak forms down the middle of the chick embryo. No gene had been seen to differ between its left and right sides before this work.'},
 {name:'Node becomes sided',g:{shhL:1,actR:1},say:'At Hensen’s node, the organiser at the front of the streak, Sonic hedgehog (Shh) ends up on the left side, and activin receptor IIa on the right.'},
 {name:'Nodal-related gene on the left',g:{shhL:1,actR:1,nodalL:1},say:'Next, cNR-1, a relative of the mouse gene Nodal, comes on in the left lateral plate mesoderm, the sheet of tissue that will build much of the heart and gut wall.'},
 {name:'Heart loops',g:{shhL:1,actR:1,nodalL:1,heart:1},say:'Later the straight heart tube bends to the right. In the 1995 paper, moving activin or Shh to the other side changed this heart situs.'}];
const L2_CREG={
 nodeL:['Left side of the node','Sonic hedgehog (Shh): first across the node, then only on its left.'],
 nodeR:['Right side of the node','Activin receptor IIa on the right side. A later paper by the same group reported activin βB on the right too.'],
 lpmL:['Left lateral plate','cNR-1, related to mouse Nodal, switched on here after Shh.'],
 lpmR:['Right lateral plate','No cNR-1 here in normal embryos.'],
 heart:['Heart tube','Loops to the right in normal chick embryos: the visible result of the cascade.']};
SCENE({id:'left-right-cascade',name:'Genes on one side, 1995',tag:'Replicated finding · the first sided genes in a vertebrate embryo',
 definition:'In 1995 Michael Levin, then a graduate student in Clifford Tabin’s lab at Harvard, with Randy Johnson, Claudio Stern and Michael Kuehn, reported genes switched on in only one side of the early chick embryo. Sonic hedgehog came to lie on the left of Hensen’s node, activin receptor IIa on its right, and cNR-1, a Nodal-related gene, in the left lateral plate.',
 example:'The genes switched on in sequence, each regulating the next, well before any organ was visibly sided. Moving activin or Shh to the other side changed which way the heart looped. Nodal on the left was soon found in mouse and frog as well, so the core of this result is a replicated finding.',
 desc:'A chick embryo seen from above with its primitive streak, Hensen’s node and the two lateral plates. Stages light up Shh on the left of the node, activin receptor IIa on the right, cNR-1 in the left lateral plate, and finally the heart tube looping to the right.',
 research:['Levin, Johnson, Stern, Kuehn & Tabin (1995). A molecular pathway determining left–right asymmetry in chick embryogenesis. Cell 82, 803–814.','Levin and colleagues (1997), Developmental Biology: activin βB on the right of the node; Shh first across the node, then restricted to the left.'],
 dur:12,hint:'Move the stage slider, then press a region of the embryo (either half of the node, either lateral plate, or the heart) to read what the paper found there.',
 init:()=>({st:3,sel:'nodeL'}),
 watch(p){const st=Math.min(3,Math.floor(p*4));return {st,sel:['','nodeL','lpmL','heart'][st]}},
 ui:[{range:'st',label:'Stage',min:0,max:3,step:1,get:s=>s.st,act:'st'}],
 on:{st(s,v){s.st=clamp(Math.round(+v),0,3)},sel(s,v){if(L2_CREG[v])s.sel=v;return 'keep'}},
 draw(s,f,X){
  const S=L2_CSTAGE[s.st],g={...S.g,heart:S.g.heart?1:0};
  let out=heading(S.name,30)+L2_badge(590,44,'rep','end');
  out+=L2_chick(X,g,s.sel);
  out+=L2_note('Schematic chick embryo from above; its left is on the left.',374);
  L2_CSTAGE.forEach((t,i)=>{const y=82+i*30,on=i<=s.st;out+=Ci(306,y-4,7,on?C.blue:'#fff',C.blue)+TF(320,y,`${i+1}. ${t.name}`,13,i===s.st?C.ink:C.muted,'start',i===s.st?'font-weight="700"':'')});
  const r=L2_CREG[s.sel],shown=s.sel&&r;
  out+=R(296,212,294,140,'#fff',C.grid,8);
  if(shown){const lit={nodeL:g.shhL,nodeR:g.actR,lpmL:g.nodalL,lpmR:0,heart:g.heart}[s.sel];
   out+=TBF(310,236,r[0],14,C.ink,'start')+L2_para(310,258,lit||s.sel==='lpmR'?r[1]:'Nothing sided here yet at this stage.',270,C.ink)}
  else out+=L2_para(310,240,'Press a region of the embryo to read what was found there.',270,C.muted);
  return {svg:out,phase:S.say};
 }});

// Toy cascade: activin represses Shh on its side; Shh induces Nodal on its side; heart loops by Nodal's side.
function L2_cascade(s){const shhL=!s.act,shhR=!!s.shh;return {shhL,shhR,actL:!!s.act,actR:true,nodalL:shhL,nodalR:shhR}}
const L2_HN=40;
function L2_hearts(c,seed){const r=L2_rng(seed),out=[];for(let i=0;i<L2_HN;i++){const u=r();out.push(c.nodalL&&!c.nodalR?1:c.nodalR&&!c.nodalL?-1:(u<.5?1:-1))}return out}
SCENE({id:'left-right-cascade-switch',name:'Move the signal, move the heart',tag:'Single-lab finding · the 1995 experiment · Simplified model of the cascade',
 definition:'The 1995 paper did more than map genes. A bead soaked in activin placed on the left, or cells making Shh placed on the right, changed the sided gene pattern and the direction of heart looping. That showed the genes were part of a working chain, not only markers. The sided genes have been confirmed by many labs; this particular experiment is shown here as the 1995 paper reported it.',
 example:'In this toy chain, activin on a side switches Shh off there, Shh switches on the Nodal-related gene on its own side, and the heart loops by Nodal’s side. If Nodal is on neither side, or on both, the toy heart loops at random. The counts come from 40 seeded toy embryos.',
 desc:'A two-column chain of boxes for the embryo’s left and right (activin, Shh at the node, the Nodal-related gene, heart), two switches for the two experiments, and 40 small heart-loop arrows with a count of normal and reversed loops.',
 research:['Levin, Johnson, Stern, Kuehn & Tabin (1995), Cell 82, 803–814: manipulating the side of activin or of Shh altered heart situs.','The 40 toy embryos and their random outcomes are a cartoon written for this course.'],
 dur:12,hint:'Add an activin bead on the left, or Shh-making cells on the right, or both. Read which boxes light up and count the heart loops.',
 init:()=>({act:0,shh:0}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {act:k===2||k===3?1:0,shh:k===1||k===3?1:0}},
 ui:[{b:'Activin bead on the left: on/off',act:'act'},{b:'Shh cells on the right: on/off',act:'shh'}],
 on:{act(s){s.act=s.act?0:1},shh(s){s.shh=s.shh?0:1}},
 draw(s){
  const c=L2_cascade(s),h=L2_hearts(c,1995),nn=h.filter(v=>v>0).length,nr=L2_HN-nn;
  let out=heading(c.nodalL&&!c.nodalR?'One side: the heart loops normally':c.nodalR&&!c.nodalL?'The chain runs on the right':'No single side: the heart is left to chance',26);
  out+=L2_badge(10,40,'single')+L2_badge(20+L2_bw('single'),40,'model');
  const col=(x,lab)=>TBF(x,84,lab,14,C.ink);out+=col(110,'left')+col(240,'right');
  const row=(y,name,onL,onR,ink,extraL,extraR)=>{let o=TF(175,y-8,name,13,C.muted);
   for(const [x,on,ex] of [[110,onL,extraL],[240,onR,extraR]])o+=R(x-56,y,112,30,on?ink:'#fff',ink,8)+TBF(x,y+20,on?(ex||'on'):'off',13,on?'#fff':C.muted);return o};
  out+=row(106,'activin',c.actL,c.actR,C.blue,'bead','normal');
  out+=row(166,'Shh (node)',c.shhL,c.shhR,C.purple,'normal','added cells');
  out+=row(226,'cNR-1',c.nodalL,c.nodalR,C.green);
  for(const x of [110,240]){out+=arrow(x,138,x,154,C.line,2,7)+arrow(x,198,x,214,C.line,2,7)}
  out+=TF(175,282,'activin switches Shh off on its side;',13,C.muted)+TF(175,298,'Shh switches the gene on on its side',13,C.muted);
  // hearts
  out+=TBF(460,84,'40 toy embryos: heart loop',13,C.ink);
  h.forEach((d,i)=>{const x=362+(i%8)*28,y=112+Math.floor(i/8)*36;out+=curveArrow(x,y+11,x,y-11,d*9,d>0?C.green:C.coral,2.2)});
  out+=L2_tile(350,290,116,'Loops right',`${nn} · ${L2_pct(nn,L2_HN)}`,C.green)+L2_tile(474,290,116,'Loops left',`${nr} · ${L2_pct(nr,L2_HN)}`,C.coral);
  out+=L2_note('Arrow bending right: the usual chick heart loop. Toy outcomes, not the paper’s counts.',364);
  const ph=c.nodalL&&!c.nodalR?`The chain runs only on the left, so all ${L2_HN} toy hearts loop to the right, the usual direction.`:
   c.nodalR&&!c.nodalL?`With activin on the left and Shh on the right, the whole chain is mirrored and every toy heart loops the other way.`:
   c.nodalL?`The Nodal-related gene is on both sides, so the toy heart has no single instruction: ${nn} loop right and ${nr} left. In the 1995 experiments such changes altered heart situs.`:
   `The activin bead switched Shh off on the left, so the Nodal-related gene is on neither side: ${nn} toy hearts loop right and ${nr} left, by chance.`;
  return {svg:out,phase:ph};
 }});

// A conserved core: Nodal on the left, Lefty at the midline holding it there, Pitx2 as the left-side output.
const L2_SP={chick:['Chick','Shh on the left of the node','cNR-1 (Nodal)'],mouse:['Mouse','leftward flow at the node (lesson 6)','Nodal'],frog:['Frog','earlier signals (lessons 3–6, debated)','Xnr-1 (Nodal)']};
function L2_core(ko){const nodalL=!ko.nodal,lefty=nodalL&&!ko.lefty,nodalR=!ko.nodal&&!lefty,pitL=nodalL&&!ko.pitx2,pitR=nodalR&&!ko.pitx2;
 return {nodalL,nodalR,lefty,pitL,pitR,out:pitL&&!pitR?'usual':pitL&&pitR?'both':'none'}}
SCENE({id:'left-right-cascade-conserved',name:'Nodal, Lefty and Pitx2',tag:'Replicated finding · a conserved core found by many labs · Simplified model of its logic',
 definition:'Within three years of the chick paper, labs working on mouse and frog found the same core, now a replicated finding. Nodal is switched on in the left lateral plate; Lefty, a Nodal antagonist, is switched on at and near the midline and helps keep Nodal on the left; and the transcription factor Pitx2 is switched on on the left and carries the instruction to the organs.',
 example:'What starts the chain differs between species, and that is where the debate of this era lies: in the mouse, a fluid flow at the node; in the chick, Shh on the left of the node; in the frog, earlier signals that are still argued over. Below the starting point the chain is shared.',
 desc:'A chain of boxes for Nodal, Lefty and Pitx2 on the embryo’s left and right, with switches that remove one gene at a time in a toy version of the logic, and a timeline of the papers from 1995 to 1998.',
 research:['Collignon, Varlet & Robertson (1996), Nature 381, 155–158; Lowe et al. (1996), Nature 381, 158: Nodal on the left in the mouse.','Meno et al. (1996). Left–right asymmetric expression of the TGFβ-family member lefty in mouse embryos. Nature 381, 151–155.','Logan, Pagán-Westphal, Smith, Paganessi & Tabin (1998). The transcription factor Pitx2 mediates situs-specific morphogenesis in response to left–right asymmetric signals. Cell 94, 307–317.'],
 dur:12,hint:'Choose a species to see what starts its chain, then remove Nodal, Lefty or Pitx2 and read what the toy chain sends to the organs.',
 init:()=>({sp:'chick',ko:{nodal:0,lefty:0,pitx2:0}}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {sp:['chick','mouse','frog','chick'][k],ko:{nodal:0,lefty:k===3?1:0,pitx2:0}}},
 ui:[{choose:[['chick','Chick'],['mouse','Mouse'],['frog','Frog']],label:'Species',get:s=>s.sp,act:'sp'},{b:'Remove Nodal: on/off',act:'nodal'},{b:'Remove Lefty: on/off',act:'lefty'},{b:'Remove Pitx2: on/off',act:'pitx2'}],
 on:{sp(s,v){if(L2_SP[v])s.sp=v},nodal(s){s.ko.nodal^=1},lefty(s){s.ko.lefty^=1},pitx2(s){s.ko.pitx2^=1}},
 draw(s){
  const c=L2_core(s.ko),sp=L2_SP[s.sp];
  let out=heading(`${sp[0]}: the shared chain`,26)+L2_badge(10,40,'rep')+L2_badge(20+L2_bw('rep'),40,'model');
  out+=R(150,72,300,32,C.amberp,C.amber,8)+TF(300,93,`starts with: ${sp[1]}`,13,C.ink);
  out+=arrow(200,106,200,120,C.amber,2,7);
  const box=(x,y,lab,on,ink,ko)=>R(x-62,y,124,30,ko?'#f3f3f3':on?ink:'#fff',ko?C.muted:ink,8)+TBF(x,y+20,ko?'removed':on?lab:'off',13,ko?C.muted:on?'#fff':C.muted);
  out+=TBF(200,138,'left',13,C.ink)+TBF(400,138,'right',13,C.ink);
  out+=box(200,148,sp[2],c.nodalL,C.green,s.ko.nodal)+box(400,148,sp[2],c.nodalR,C.green,s.ko.nodal);
  out+=R(270,192,60,46,s.ko.lefty?'#f3f3f3':c.lefty?C.purple:'#fff',s.ko.lefty?C.muted:C.purple,8)+TBF(300,212,'Lefty',13,s.ko.lefty?C.muted:c.lefty?'#fff':C.muted)+TF(300,230,s.ko.lefty?'removed':'midline',13,s.ko.lefty?C.muted:c.lefty?'#fff':C.muted);
  out+=box(200,236,'Pitx2',c.pitL,C.blue,s.ko.pitx2)+box(400,236,'Pitx2',c.pitR,C.blue,s.ko.pitx2);
  out+=arrow(200,180,200,234,C.line,2,7)+arrow(400,180,400,234,C.line,2,7);
  if(!s.ko.nodal&&!c.lefty)out+=curveArrow(262,160,338,160,-14,C.coral,2.2);
  const res=c.out==='usual'?['Organs get a left-side instruction on the left','usual arrangement',C.green]:c.out==='both'?['Both sides get the left instruction','mixed, both sides left-like',C.coral]:['No side gets the instruction','sides left to chance or mixed',C.coral];
  out+=R(130,276,340,40,res[2]===C.green?C.greenp:C.coralp,'none',8)+TBF(300,293,res[0],13,res[2])+TF(300,309,`toy outcome: ${res[1]}`,13,C.ink);
  // timeline
  const ev=[[1995,'chick genes'],[1996,'Nodal, Lefty: mouse'],[1998,'Pitx2']];
  out+=L(60,338,540,338,C.line,2);ev.forEach(([y,l],i)=>{const x=110+i*190;out+=Ci(x,338,5,C.blue)+TBF(x-8,362,y,13,C.ink,'end')+TF(x,362,l,13,C.muted,'start')});
  const ph=s.ko.nodal?'With Nodal removed, nothing downstream is switched on, so in the toy the organs receive no sided instruction. Real Nodal-pathway mutants have laterality defects.':
   s.ko.lefty?'Without Lefty at the midline, Nodal in the toy spreads to the right side as well, so both sides get the left-side instruction. Lefty proteins are Nodal antagonists, and this barrier role is part of the standard picture.':
   s.ko.pitx2?'Nodal and Lefty are still sided, but with Pitx2 gone the instruction never reaches the organs in the toy.':
   `In the ${sp[0].toLowerCase()} the chain starts with ${sp[1]}. From Nodal down, chick, mouse and frog share the same left-sided chain.`;
  return {svg:out,phase:ph};
 }});

/* ===================== Lesson: ion-flux ===================== */
// Seeded positions for mRNA dots in a schematic egg.
const L2_DOTS=(()=>{const r=L2_rng(77),a=[];for(let i=0;i<54;i++){const t=r()*Math.PI*2,d=Math.sqrt(r())*.86;a.push([Math.cos(t)*d,Math.sin(t)*d])}return a})();
function L2_egg(cx,cy,R0,cells){
 let out=Ci(cx,cy,R0,'#fbf6ea',C.line);
 if(cells>=2)out+=L(cx,cy-R0,cx,cy+R0,C.muted,2);
 if(cells>=4)out+=L(cx-R0,cy,cx+R0,cy,C.muted,2);
 return out;
}
const L2_FSTAGE=['1 cell','2 cells','4 cells'];
SCENE({id:'ion-flux',name:'A pump in the first cells',tag:'Single-lab finding · H+/K+-ATPase and voltage before the sided genes (2002)',
 definition:'In 2002 Levin, Thorlin, Robinson, Nogi and Mercola reported, from Mark Mercola’s lab at Harvard Medical School, that an ion pump, the H+/K+-ATPase, acts very early in left–right patterning. In frog eggs its mRNA started evenly spread and was reported to become uneven during the first two cell divisions. In chick, its mRNA was even, but a pump-dependent voltage difference was found between the left and right sides of the primitive streak.',
 example:'Blocking the pump with drugs, or changing it genetically, scrambled the sided gene pattern and caused heterotaxia in both species. This was a peer-reviewed result from one group; which parts other labs have since confirmed is the subject of the third scene.',
 desc:'A frog egg dividing into 2 and 4 cells with dots for pump mRNA that become uneven, a chick embryo with a voltage difference across its streak, and a switch that blocks the pump to show the reported outcome.',
 research:['Levin, Thorlin, Robinson, Nogi & Mercola (2002). Asymmetries in H+/K+-ATPase and cell membrane potentials comprise a very early step in left–right patterning. Cell 111, 77–89.'],
 dur:12,hint:'Choose frog or chick, move through the stages, then block the pump to read what the paper reported.',
 init:()=>({sp:'frog',st:2,block:0}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return k<3?{sp:'frog',st:k,block:0}:{sp:'chick',st:2,block:k===4?1:0}},
 ui:[{choose:[['frog','Frog egg'],['chick','Chick embryo']],label:'Species',get:s=>s.sp,act:'sp'},{range:'st',label:'Frog stage',min:0,max:2,step:1,get:s=>s.st,act:'st'},{b:'Block the pump: on/off',act:'block'}],
 on:{sp(s,v){s.sp=v==='chick'?'chick':'frog'},st(s,v){s.st=clamp(Math.round(+v),0,2)},block(s){s.block^=1}},
 draw(s){
  let out=L2_badge(10,10,'single');
  if(s.sp==='frog'){
   const cells=[1,2,4][s.st],u=s.st/2,cx=170,cy=200,R0=118;
   out+=heading(`Frog egg, ${L2_FSTAGE[s.st]}`,52)+L2_egg(cx,cy,R0,cells);
   // dots drift into one cell as the stage advances (which cell is schematic)
   L2_DOTS.forEach(([x,y],i)=>{const tx=.45+.35*x*.5,ty=.45+.35*y*.5,px=lerp(x,tx,u*.85),py=lerp(y,ty,u*.85);out+=Ci(cx+px*R0,cy+py*R0,4,C.blue)});
   out+=TF(cx,340,s.st===0?'pump mRNA spread evenly':'pump mRNA reported to become uneven',13,C.blue);
  }else{
   out+=heading('Chick embryo, early streak',52);
   out+=`<ellipse cx="170" cy="208" rx="110" ry="140" fill="#fbf8f1" stroke="${C.line}" stroke-width="2"/>`+L(170,320,170,130,C.muted,5);
   out+=TF(170,116,'primitive streak',13,C.muted);
   if(!s.block){out+=R(76,190,60,36,C.purplep,C.purple,8)+TBF(106,213,'V₁',14,C.purple)+R(204,190,60,36,C.pale,C.blue,8)+TBF(234,213,'V₂',14,C.blue)+TF(170,252,'V₁ ≠ V₂',14,C.ink)}
   else out+=R(76,190,60,36,'#fff',C.line,8)+R(204,190,60,36,'#fff',C.line,8)+TF(170,252,'difference lost',14,C.coral);
   out+=TF(170,340,'pump mRNA even on both sides',13,C.blue);
  }
  // panel
  out+=R(318,80,272,236,'#fff',C.grid,8);
  const lines=s.block?['Pump blocked:','The sided genes came on in a scrambled pattern, and organs were placed heterotaxically, in both frog and chick.']:
   s.sp==='frog'?['Frog:','Pump mRNA was reported to start evenly and become uneven within the first two divisions, about two hours after fertilisation.']:
   ['Chick:','The pump’s mRNA is even, yet the two sides of the streak differ in membrane voltage, and the difference depends on the pump.'];
  out+=TBF(332,106,lines[0],14,s.block?C.coral:C.ink,'start')+L2_para(332,130,lines[1],248,C.ink);
  if(s.sp==='frog'&&!s.block)out+=L2_badge(332,250,'debate')+L2_para(332,290,'Walentek et al. (2012) found this mRNA even.',248,C.coral);
  out+=L2_note('Schematic. The paper’s images and measurements are not reproduced here.',370);
  return {svg:out,phase:s.block?'Blocking the pump scrambled left–right gene expression and organ placement in both species, so the pump looked necessary for the usual pattern.':s.sp==='frog'?'In the frog, the pump’s mRNA was reported to become unevenly distributed among the first cells, long before any sided gene is switched on.':'In the chick the asymmetry is not in where the pump’s mRNA is, but in the voltage it helps to make.'};
 }});

// Four cells in a ring (left dorsal, right dorsal, right ventral, left ventral). Each pump unit raises the toy cell's
// internal potassium; the Goldman equation gives each cell's own voltage; gap junctions then pull neighbours together.
const L2_Q=['LD','RD','RV','LV'],L2_QNAME={LD:'left dorsal',RD:'right dorsal',RV:'right ventral',LV:'left ventral'};
const L2_ION={Ko:5,Nai:15,Nao:145,Cli:10,Clo:110,Kbase:100,Kper:10,PNa:.04,PCl:.1,PKopen:1,PKclosed:.02};
function L2_ghk(Ki,PK){const I=L2_ION;return L2_RTF*Math.log((PK*I.Ko+I.PNa*I.Nao+I.PCl*I.Cli)/(PK*Ki+I.PNa*I.Nai+I.PCl*I.Clo))}
function L2_solve(A,b){const n=b.length,M=A.map((r,i)=>r.concat([b[i]]));for(let c=0;c<n;c++){let p=c;for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;[M[c],M[p]]=[M[p],M[c]];for(let r=0;r<n;r++){if(r===c)continue;const f=M[r][c]/M[c][c];for(let k=c;k<=n;k++)M[r][k]-=f*M[c][k]}}return M.map((r,i)=>r[n]/r[i])}
// Coupled steady state: g_m (V_i − E_i) + g Σ (V_i − V_j) = 0, with g_m = 1.
function L2_ring(E,g,links){const n=E.length,A=E.map((_,i)=>E.map((__,j)=>i===j?1:0));for(const [a,b,w] of links){const gw=g*(w===undefined?1:w);A[a][a]+=gw;A[b][b]+=gw;A[a][b]-=gw;A[b][a]-=gw}return L2_solve(A,E.slice())}
const L2_QLINKS=[[0,1],[1,2],[2,3],[3,0]];
function L2_four(s){const PK=s.k?L2_ION.PKopen:L2_ION.PKclosed,Ki=s.pumps.map(n=>L2_ION.Kbase+L2_ION.Kper*n),E=Ki.map(k=>L2_ghk(k,PK)),V=L2_ring(E,s.g,L2_QLINKS);
 const left=(V[0]+V[3])/2,right=(V[1]+V[2])/2,Eleft=(E[0]+E[3])/2,Eright=(E[1]+E[2])/2;return {Ki,E,V,left,right,diff:left-right,ediff:Eleft-Eright}}
SCENE({id:'ion-flux-voltage',name:'Uneven pumps, uneven voltage',tag:'Simplified model · a four-cell embryo with pumps, potassium channels and gap junctions',
 definition:'The H+/K+-ATPase swaps protons out for potassium in, so by itself it moves no net charge. A voltage difference appears only if the extra potassium can leak back out through potassium channels: then cells with more pumps hold more potassium and sit more negative. The lab later proposed this cooperation between the pump and potassium channels.',
 example:`In this toy, each pump unit adds ${L2_ION.Kper} mM to a cell’s potassium, and the Goldman equation gives each cell’s voltage. Gap junctions between neighbours then share current and shrink the difference. Concentrations are generic textbook values, not frog-embryo measurements. For the Goldman equation itself, see Brain In Motion’s lesson on the resting potential.`,
 desc:'Four cells of an early embryo drawn as quarters of a circle, each with a number of pump units, its computed internal potassium and voltage, and tiles for the left–right difference with and without gap-junction coupling.',
 research:['Levin et al. (2002), Cell 111, 77–89: the pump-dependent voltage difference that this toy illustrates.','Aw, Adams, Qiu & Levin (2008). H,K-ATPase protein localization and Kir4.1 function reveal concordance of three axes during early determination of left–right asymmetry. Mechanisms of Development 125, 353–372 (the potassium channel Kir4.1 as a candidate exit path for the pumped potassium).'],
 dur:12,hint:'Press a cell to add pump units (up to 4). Then close the potassium channels, and raise the gap-junction coupling, and watch the left–right difference.',
 init:()=>({pumps:[3,0,0,3],k:1,g:0}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {pumps:k===0?[0,0,0,0]:[3,0,0,3],k:k===2?0:1,g:k===3?1.5:0}},
 ui:[{b:'Potassium channels: open/closed',act:'k'},{range:'g',label:'Gap-junction coupling (relative to membrane)',min:0,max:3,step:.25,get:s=>s.g,act:'g'},{b:'Even pumps everywhere',act:'even'}],
 on:{pump(s,i){i=+i;if(i>=0&&i<4)s.pumps[i]=(s.pumps[i]+1)%5;return 'keep'},k(s){s.k^=1},g(s,v){s.g=clamp(+v,0,3)},even(s){s.pumps=[2,2,2,2]}},
 draw(s,f,X){
  const m=L2_four(s),cx=160,cy=200,R0=124;
  let out=heading(Math.abs(m.diff)<.5?'Left and right at the same voltage':`${m.diff<0?'Left':'Right'} side more negative`,26)+L2_badge(10,40,'model');
  const quad=[[-1,-1],[1,-1],[1,1],[-1,1]],vmin=-90,vmax=-20;
  L2_Q.forEach((q,i)=>{const [sx,sy]=quad[i],v=m.V[i],t=clamp((v-vmin)/(vmax-vmin),0,1);
   const start=[[-Math.PI,-Math.PI/2],[-Math.PI/2,0],[0,Math.PI/2],[Math.PI/2,Math.PI]][i],x1=cx+R0*Math.cos(start[0]),y1=cy+R0*Math.sin(start[0]),x2=cx+R0*Math.cos(start[1]),y2=cy+R0*Math.sin(start[1]);
   const fill=`rgb(${Math.round(lerp(40,236,t))},${Math.round(lerp(96,198,t))},${Math.round(lerp(170,190,t))})`;
   const inner=P(`M${cx} ${cy}L${fmt(x1)} ${fmt(y1)}A${R0} ${R0} 0 0 1 ${fmt(x2)} ${fmt(y2)}Z`,'#fff',3,fill)+R(cx+sx*62-44,cy+sy*58-26,88,52,'#fff','none',8,'fill-opacity="0.88"')+TBF(cx+sx*62,cy+sy*58-7,L2_mv(v),14,C.ink)+TF(cx+sx*62,cy+sy*58+12,`K⁺ ${m.Ki[i]} mM`,13,C.muted);
   let pumps='';for(let k=0;k<s.pumps[i];k++)pumps+=Ci(cx+sx*(24+k*14),cy+sy*92,6,C.amber,'#fff');
   out+=hit(X,'pump',i,`${L2_QNAME[q]} cell: ${s.pumps[i]} pump units, ${L2_mv(v)}. Press to add a pump.`,inner+pumps);
  });
  out+=TF(cx,64,'dorsal',13,C.muted)+TF(cx,346,'ventral',13,C.muted)+TF(32,204,'left',13,C.muted,'end')+TF(288,204,'right',13,C.muted,'start');
  out+=Ci(318,66,6,C.amber,'#fff')+TF(330,71,'= one pump unit',13,C.ink,'start');
  out+=L2_tile(320,88,130,'Left average',L2_mv(m.left),C.purple)+L2_tile(460,88,130,'Right average',L2_mv(m.right),C.blue);
  out+=L2_tile(320,146,270,'Left minus right, coupled',L2_mv(m.diff),C.ink)+L2_tile(320,204,270,'Left minus right, no coupling',L2_mv(m.ediff),C.muted);
  out+=TF(320,272,`K⁺ channels ${s.k?'open':'closed'} · coupling ${fmt(s.g)}`,13,C.ink,'start');
  out+=TF(320,292,`Outside K⁺ ${L2_ION.Ko}, Na⁺ ${L2_ION.Nao}, Cl⁻ ${L2_ION.Clo} mM;`,13,C.muted,'start')+TF(320,310,`inside Na⁺ ${L2_ION.Nai}, Cl⁻ ${L2_ION.Cli} mM`,13,C.muted,'start');
  out+=TF(320,330,`P(K:Na:Cl) ${fmt(s.k?L2_ION.PKopen:L2_ION.PKclosed)} : ${fmt(L2_ION.PNa)} : ${fmt(L2_ION.PCl)}`,13,C.muted,'start');
  out+=L2_note('Leaves out pH, the pump’s rate, cell growth and everything else a real embryo does.',370);
  const ph=!s.k?`With the potassium channels nearly closed, extra potassium inside makes little difference: the left–right gap is only ${L2_mv(m.diff)}. The pump alone moves no net charge.`:
   s.g>=1?`Gap junctions share current between neighbours, so the left–right difference shrinks from ${L2_mv(m.ediff)} to ${L2_mv(m.diff)}. Coupling can smooth out a pattern as well as carry one.`:
   Math.abs(m.ediff)<.5?'With pumps spread evenly, every cell sits at the same voltage. Put more pumps on one side to make a difference.':
   `More pumps on one side mean more potassium inside, and with open potassium channels those cells sit more negative: a left–right difference of ${L2_mv(m.diff)} with no coupling.`;
  return {svg:out,phase:ph};
 }});

// Claims about the pump and what other labs reported. a: 'agree' | 'dispute' | 'same'.
const L2_CLAIMS=[
 {c:'Blocking the pump disturbs left–right patterning in frog',a:'agree',r:'Walentek et al. 2012 (Blum lab): knockdown disrupted situs'},
 {c:'Frog pump mRNA becomes uneven by the 4-cell stage',a:'dispute',r:'Walentek et al. 2012: expression symmetric in their hands'},
 {c:'The pump acts through voltage, independently of cilia',a:'dispute',r:'Walentek et al. 2012: pump needed to build the flow’s cilia'},
 {c:'Chick: pump activity acts upstream of the node’s genes',a:'agree',r:'Gros et al. 2009: pump blockers stopped node cell movements'},
 {c:'Frog: proton flux is uneven at the 4- and 8-cell stages',a:'same',r:'Adams et al. 2006 (Levin lab); no outside test found here'}];
const L2_CAT=[['?','your call?',C.muted],['agree','another lab agrees',C.green],['dispute','another lab disagrees',C.coral],['same','only this group so far',C.blue]];
SCENE({id:'ion-flux-tests',name:'What other labs tested',tag:'Criticism and debate · which parts of the ion-flux result were tested elsewhere',
 definition:'A result becomes stronger when an independent group repeats it. Parts of the 2002 ion-flux result were later tested by Martin Blum’s lab in Germany, which works on cilia-driven flow, and by a collaboration of the Tabin and Blum labs in chick. Some parts agreed, some did not, and some have, as far as this course could confirm, been reported only by Levin’s group.',
 example:'Walentek and colleagues (2012) agreed that the frog needs the pump (ATP4a) for normal sidedness, but found its mRNA symmetric and found the pump necessary for building the cilia that make leftward flow. Gros and colleagues (2009) found that in chick, pump-blocking drugs stopped the leftward cell movements at the node. The course does not decide between the readings.',
 desc:'Five cards, each a claim from the ion-flux work, with a choice of whether another lab agreed, disagreed, or has not been found to test it. A button reveals the source behind each card.',
 research:['Walentek, Beyer, Thumberger, Schweickert & Blum (2012). ATP4a is required for Wnt-dependent Foxj1 expression and leftward flow in Xenopus left–right development. Cell Reports 1, 516–527.','Gros, Feistel, Viebahn, Blum & Tabin (2009). Cell movements at Hensen’s node establish left/right asymmetric gene expression in the chick. Science 324, 941–944.','Adams et al. (2006). Early, H+-V-ATPase-dependent proton flux is necessary for consistent left–right patterning of non-mammalian vertebrates. Development 133, 1657–1671.'],
 dur:12,hint:'Press each card’s right-hand box to choose: another lab agrees, disagrees, or only this group so far. Then show the sources.',
 init:()=>({g:L2_CLAIMS.map(()=>0),show:0}),
 watch(p){const k=Math.floor(clamp(p*1.25,0,1)*L2_CLAIMS.length);return {g:L2_CLAIMS.map((c,i)=>i<k?L2_CAT.findIndex(x=>x[0]===c.a):0),show:p>.8?1:0}},
 ui:[{b:'Show the sources',act:'show'},{b:'Clear',act:'clear'}],
 on:{pick(s,i){i=+i;if(i>=0&&i<L2_CLAIMS.length)s.g[i]=(s.g[i]+1)%L2_CAT.length;return 'keep'},show(s){s.show=1;return 'keep'},clear(s){s.g=L2_CLAIMS.map(()=>0);s.show=0}},
 draw(s,f,X){
  const picked=s.g.filter(v=>v>0).length,match=s.g.filter((v,i)=>v>0&&L2_CAT[v][0]===L2_CLAIMS[i].a).length;
  let out=heading('Who tested which claim?',26)+L2_badge(10,40,'debate')+L2_badge(590,40,'single','end');
  L2_CLAIMS.forEach((c,i)=>{const y=66+i*52,v=s.g[i],cat=L2_CAT[v],ans=L2_CAT.find(x=>x[0]===c.a);
   out+=R(10,y,580,48,'#fff',C.grid,8)+TF(22,y+20,c.c,13,C.ink,'start');
   if(s.show)out+=TF(22,y+40,c.r,13,ans[2],'start');
   out+=hit(X,'pick',i,`Claim ${i+1}: ${cat[1]}. Press to change.`,R(430,y+6,152,24,v?cat[2]:'#fff',cat[2],12)+TBF(506,y+23,cat[1],13,v?'#fff':C.muted));
   if(s.show&&v)out+=TBF(582,y+44,cat[0]===c.a?'✓ matches':'✗ see source',13,cat[0]===c.a?C.green:C.coral,'end')});
  out+=L2_tile(10,328,190,'Chosen',`${picked} of ${L2_CLAIMS.length}`,C.ink)+L2_tile(205,328,190,'Match the sources',s.show?`${match} of ${picked}`:'hidden',C.green);
  out+=TF(400,348,'“Only this group”: no outside',13,C.muted,'start')+TF(400,366,'test found by this course.',13,C.muted,'start');
  return {svg:out,phase:s.show?`${match} of ${picked} choices match the sources. Agreement on the pump’s necessity sits alongside disagreement about where its mRNA is and how it acts, which leads into the cilia debate at the end of this era.`:
   'Decide for each claim whether an independent lab’s work agrees, disagrees, or has not been found. “Agrees” here means the independent result fits the claim; it does not mean the other lab accepted the whole model.'};
 }});

/* ===================== Lesson: serotonin-flow ===================== */
// Cleavage-stage frog embryo seen from the animal pole: dorsal up, its left on the left.
function L2_cleave(cx,cy,R0,st){
 let out=Ci(cx,cy,R0,'#fbf6ea',C.line);
 if(st>=1)out+=L(cx,cy-R0,cx,cy+R0,C.muted,1.8)+L(cx-R0,cy,cx+R0,cy,C.muted,1.8);
 if(st>=2){out+=Ci(cx,cy,R0*.5,'none',C.muted);for(const a of [Math.PI/4,3*Math.PI/4,5*Math.PI/4,7*Math.PI/4])out+=L(cx+R0*.5*Math.cos(a),cy+R0*.5*Math.sin(a),cx+R0*Math.cos(a),cy+R0*Math.sin(a),C.muted,1.8)}
 return out;
}
const L2_SDOTS=(()=>{const r=L2_rng(2005),a=[];for(let i=0;i<40;i++){const t=r()*Math.PI*2,d=Math.sqrt(r())*.88;a.push([Math.cos(t)*d,Math.sin(t)*d,r()])}return a})();
const L2_SST=['egg','4 cells','16 cells'];
SCENE({id:'serotonin-flow',name:'Serotonin before nerves',tag:'Single-lab finding · serotonin in very early chick and frog embryos (2005)',
 definition:'Serotonin is best known as a neurotransmitter, but in 2005 Takahiro Fukumoto, Ido Kema and Michael Levin reported that frog eggs carry a maternal supply of it long before any nerve exists. During cleavage the supply is broken down, and what remains becomes localised; that localisation needed gap-junctional communication and the H+/K+-ATPase. Changing serotonin signalling in the right ventral cell randomised left and right.',
 example:'A companion paper by Fukumoto, Blakely and Levin reported that blocking the serotonin transporter, or the vesicle transporter that loads monoamines, randomised the heart and gut in frog embryos, with the descendants of the right ventral cell most dependent on it, and that in chick both transporters are asymmetric at Hensen’s node. These are reports from one group.',
 desc:'A frog embryo seen from the animal pole at the egg, 4-cell and 16-cell stages, with dots for serotonin that thin out and, in normal embryos, gather in the right ventral cells. Switches block gap junctions or the pump.',
 research:['Fukumoto, Kema & Levin (2005). Serotonin signaling is a very early step in patterning of the left–right axis in chick and frog embryos. Current Biology 15, 794–803.','Fukumoto, Blakely & Levin (2005). Serotonin transporter function is an early step in left–right patterning in chick and frog embryos. Developmental Neuroscience 27, 349–363.'],
 dur:12,hint:'Move through the stages, then block gap junctions or the pump and see where the serotonin ends up in the reported pattern.',
 init:()=>({st:2,cond:'normal'}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return {st:Math.min(2,k),cond:k===3?'gj':k===4?'pump':'normal'}},
 ui:[{range:'st',label:'Stage',min:0,max:2,step:1,get:s=>s.st,act:'st'},{choose:[['normal','Untreated'],['gj','Gap junctions blocked'],['pump','Pump blocked']],label:'Condition',get:s=>s.cond,act:'cond'}],
 on:{st(s,v){s.st=clamp(Math.round(+v),0,2)},cond(s,v){if(['normal','gj','pump'].includes(v))s.cond=v}},
 draw(s){
  const cx=160,cy=206,R0=112,u=s.cond==='normal'?s.st/2:0,keep=[1,.7,.45][s.st];
  let out=heading(`Serotonin, ${L2_SST[s.st]}${s.cond==='normal'?'':s.cond==='gj'?', junctions blocked':', pump blocked'}`,26)+L2_badge(10,40,'single');
  out+=L2_cleave(cx,cy,R0,s.st);
  out+=TF(cx,86,'dorsal',13,C.muted)+TF(cx,336,'ventral',13,C.muted)+TF(44,210,'left',13,C.muted,'end')+TF(276,210,'right',13,C.muted,'start');
  L2_SDOTS.forEach(([x,y,k])=>{if(k>keep)return;const tx=.55+x*.18,ty=.55+y*.18;out+=Ci(cx+lerp(x,tx,u)*R0,cy+lerp(y,ty,u)*R0,4.4,C.purple)});
  out+=R(318,74,272,232,'#fff',C.grid,8);
  const t=s.cond==='gj'?['Gap junctions blocked','The serotonin did not become localised in the reported pattern, and left–right patterning was disturbed.']:
   s.cond==='pump'?['Pump blocked','Localisation also needed H+/K+-ATPase activity. A 2006 paper from the lab reported the same for a second pump, the V-ATPase.']:
   s.st===0?['Egg','A maternal supply of serotonin is present before the first division.']:s.st===1?['4 cells','The supply is broken down during cleavage, and what remains begins to move.']:['16 cells','What remains gathers in the right ventral cells, the cells whose serotonin signalling mattered most.'];
  out+=TBF(332,100,t[0],14,s.cond==='normal'?C.ink:C.coral,'start')+L2_para(332,124,t[1],248,C.ink);
  out+=Ci(338,284,4.4,C.purple)+TF(350,289,'serotonin (schematic)',13,C.ink,'start');
  out+=L2_note('Schematic of the reported pattern; dot counts and positions are illustrative, not data.',370);
  return {svg:out,phase:s.cond==='normal'?(s.st===2?'In untreated embryos, the remaining serotonin was reported to end up on the right ventral side, long before nerves or cilia.':'A neurotransmitter turns up in a frog egg with no nervous system: one of the surprises of this work.'):'With the junctions or the pump blocked, the serotonin stayed spread out in the reported images, linking this lesson to the two before it.'};
 }});

// Electrophoresis in a row of coupled cells: a positive molecule moves through junctions, pushed towards the more
// negative end. Flux between neighbours: D (c_i e^{+φ/2} − c_{i+1} e^{−φ/2}), φ = zFΔV/RT per junction.
const L2_EN=8,L2_ET=30,L2_EDT=.01;
function L2_ephor(dv,D,tFrac){
 const phi=(dv/(L2_EN-1))/L2_RTF,a=Math.exp(phi/2),b=Math.exp(-phi/2),c=Array(L2_EN).fill(1),steps=Math.round(L2_ET*clamp(tFrac,0,1)/L2_EDT);
 for(let k=0;k<steps;k++){const j=[];for(let i=0;i<L2_EN-1;i++)j.push(D*(c[i]*a-c[i+1]*b));for(let i=0;i<L2_EN-1;i++){c[i]-=j[i]*L2_EDT;c[i+1]+=j[i]*L2_EDT}}
 const w=range(L2_EN).map(i=>Math.exp(phi*i)),W=sum(w),ss=w.map(v=>v/W*L2_EN);
 return {c,ss,phi,last:c[L2_EN-1]/L2_EN,ssLast:ss[L2_EN-1]/L2_EN,ratio:c[L2_EN-1]/c[0],ssRatio:Math.exp(phi*(L2_EN-1))};
}
SCENE({id:'serotonin-flow-electrophoresis',name:'A charged molecule drifts',tag:'Simplified model · electrophoresis through gap junctions · Framework or hypothesis for the embryo',
 definition:'The lab proposed a physical mechanism: serotonin is positively charged and small enough to pass through gap junctions, so a voltage difference across a chain of coupled cells should push it towards the more negative end, like a charged molecule in a gel. This is electrophoresis. Diffusion pushes back, and the balance sets how strongly it collects.',
 example:'In this toy row of 8 coupled cells, at steady state each cell holds e^(zFΔV/RT) times as much as its neighbour, where ΔV is the voltage step between them, so the build-up depends on the voltage, not on how open the junctions are. The coupling sets only how fast it gets there. Esser, Smith, Weaver and Levin (2006) modelled this in more detail and concluded that it was plausible within the time available.',
 desc:'A row of 8 cells with a voltage falling from one end to the other, bars for the amount of a positively charged molecule in each, the steady state as outlines, and tiles for the share in the last cell and the end-to-end ratio.',
 research:['Esser, Smith, Weaver & Levin (2006). Mathematical model of morphogen electrophoresis through gap junctions. Developmental Dynamics 235, 2144–2159.','Fukumoto, Kema & Levin (2005), Current Biology 15, 794–803: the proposal this toy illustrates.'],
 dur:12,hint:'Set the voltage difference across the row and the junction coupling, then move the time slider. Compare the bars with the outlined steady state.',
 init:()=>({dv:20,D:1,t:100}),
 watch(p){return {dv:20,D:1,t:Math.round(p*100)}},
 ui:[{range:'dv',label:'Voltage difference end to end (mV)',min:0,max:60,step:5,get:s=>s.dv,act:'dv'},{range:'D',label:'Junction coupling (model units)',min:.2,max:2,step:.2,get:s=>s.D,act:'D'},{range:'t',label:'Time (% of the model run)',min:0,max:100,step:5,get:s=>s.t,act:'t'}],
 on:{dv(s,v){s.dv=clamp(Math.round(+v),0,60)},D(s,v){s.D=clamp(Math.round(+v*10)/10,.2,2)},t(s,v){s.t=clamp(Math.round(+v),0,100)}},
 draw(s){
  const m=L2_ephor(s.dv,s.D,s.t/100),x0=40,w=66,base=250,sc=46,vmax=Math.max(3,...m.ss,...m.c);
  let out=heading(s.dv===0?'No voltage: diffusion keeps it even':'Drifting towards the negative end',26)+L2_badge(10,40,'model')+L2_badge(20+L2_bw('model'),40,'frame');
  for(let i=0;i<L2_EN;i++){const x=x0+i*w,V=-s.dv*i/(L2_EN-1),hh=m.c[i]*sc*3/vmax,hs=m.ss[i]*sc*3/vmax;
   out+=R(x+8,base-hh,w-16,hh,C.purple,'none',4)+R(x+8,base-hs,w-16,hs,'none',C.ink,4,'stroke-dasharray="4 3"');
   out+=R(x+2,base+8,w-4,40,'#fff',C.line,8)+TF(x+w/2,base+33,i===0||i===L2_EN-1?L2_mv(V):'',13,C.ink);
   if(i<L2_EN-1)out+=R(x+w-6,base+20,10,16,C.amberp,C.amber,2)}
  out+=TF(x0,base+68,'cell 1',13,C.muted,'start')+TF(x0+L2_EN*w,base+68,`cell ${L2_EN}`,13,C.muted,'end')+TF(300,base+68,'gap junctions between cells (amber)',13,C.amber);
  out+=R(400,68,12,12,C.purple,'none',2)+TF(416,79,'now',13,C.ink,'start')+R(460,68,12,12,'none',C.ink,2,'stroke-dasharray="3 2"')+TF(476,79,'steady state',13,C.ink,'start');
  out+=L2_tile(40,86,170,`Share in cell ${L2_EN} now`,Math.round(m.last*100)+'%',C.purple)+L2_tile(220,86,170,'At steady state',Math.round(m.ssLast*100)+'%',C.ink)+L2_tile(400,86,160,'Last : first now',fmt(L2_r1(m.ratio))+' : 1',C.blue);
  out+=TF(300,150,`Even share would be ${Math.round(100/L2_EN)}%. Steady-state end-to-end ratio: ${fmt(Math.round(m.ssRatio*100)/100)} : 1.`,13,C.muted);
  out+=L2_note('Toy: one molecule, fixed voltages, no binding or breakdown. Model time units.',372);
  const ph=s.dv===0?'With no voltage difference the molecule simply diffuses, and every cell ends with the same share. Electrophoresis needs the voltage gradient.':
   s.t<25?`Early in the run the molecule has barely moved. With coupling ${fmt(s.D)}, wider junctions would get it there sooner, but not further.`:
   `With ${s.dv} mV across the row, the last cell holds ${Math.round(m.last*100)}% of the molecule now, heading for ${Math.round(m.ssLast*100)}% at steady state. Doubling the voltage raises the build-up steeply, because the ratio grows exponentially with it.`;
  return {svg:out,phase:ph};
 }});

// Two published proposals for when serotonin acts in the frog.
const L2_SEROVIEW={
 early:{name:'Early: an instructive signal in cleavage',who:'Levin lab (Fukumoto et al. 2005; Vandenberg, Lemire & Levin 2013)',col:C.purple,at:[.12,.24],
  ev:['Serotonin gathers in right ventral cells during cleavage.','Extra serotonin on the left randomised sidedness.','The right ventral cells involved do not form the ciliated organ.','Cilia measures did not separate normal from mis-sided embryos.']},
 late:{name:'Late: a competence factor for Wnt',who:'Blum lab (Beyer et al. 2012)',col:C.green,at:[.42,.62],
  ev:['Serotonin is needed for Wnt signalling that specifies the tissue of the ciliated roof plate.','With serotonin signalling reduced, leftward flow and asymmetry were lost.','In this reading serotonin permits flow; flow sets the side.']}};
const L2_XST=[[0,'fertilised'],[.18,'cleavage'],[.34,'blastula'],[.5,'gastrula'],[.72,'neurula: flow (stage 15)'],[.95,'Nodal on the left (stage 19)']];
SCENE({id:'serotonin-flow-readout',name:'When does serotonin act?',tag:'Criticism and debate · two published readings · Framework or hypothesis for each',
 definition:'Two groups agree that frog embryos need serotonin signalling to set left and right, and disagree about when and how it acts. Levin’s lab proposed that serotonin is an instructive signal in the first few hours, gathering on the right before any cilia exist. Martin Blum’s lab proposed instead that it is needed later, as a factor that lets Wnt signalling build the ciliated tissue whose leftward flow then sets the side.',
 example:'Beyer and colleagues (2012) found that reducing serotonin signalling lost leftward flow and asymmetry. Vandenberg, Lemire and Levin (2013) replied with experiments they read as supporting an early, cilia-independent role, including randomisation by extra serotonin on the left. Each side presents a hypothesis; the course does not decide between them.',
 desc:'A timeline of frog development from fertilisation to Nodal on the left, with the window in which each proposal places serotonin’s action and the evidence each group offers.',
 research:['Beyer et al. (2012). Serotonin signaling is required for Wnt-dependent GRP specification and leftward flow in Xenopus. Current Biology 22, 33–39.','Vandenberg, Lemire & Levin (2013). Serotonin has early, cilia-independent roles in Xenopus left–right patterning. Disease Models & Mechanisms 6, 261–268.','Schweickert et al. (2007), Current Biology 17, 60–66: leftward flow from stage 15, Nodal on the left from stage 19.'],
 dur:12,hint:'Switch between the two readings and compare where each places serotonin on the timeline and what evidence it rests on.',
 init:()=>({v:'early'}),
 watch(p){return {v:p<.5?'early':'late'}},
 ui:[{choose:[['early','Early (Levin lab)'],['late','Late (Blum lab)'],['both','Show both windows']],label:'Reading',get:s=>s.v,act:'v'}],
 on:{v(s,v){if(['early','late','both'].includes(v))s.v=v}},
 draw(s){
  const x0=30,w=540,y=104,X=t=>x0+t*w;
  let out=heading(s.v==='both'?'Two windows for one signal':L2_SEROVIEW[s.v].name,26)+L2_badge(10,40,'debate')+L2_badge(20+L2_bw('debate'),40,'frame');
  for(const k of ['early','late']){if(s.v!=='both'&&s.v!==k)continue;const V=L2_SEROVIEW[k];out+=R(X(V.at[0]),y-20,X(V.at[1])-X(V.at[0]),40,V.col,'none',8,'fill-opacity="0.22"')+TBF((X(V.at[0])+X(V.at[1]))/2,y-26,k==='early'?'early reading':'late reading',13,V.col)}
  out+=L(x0,y,x0+w,y,C.ink,2.4);
  L2_XST.forEach(([t,l],i)=>{out+=Ci(X(t),y,5,C.ink)+TF(X(t),y+(i%2?40:22),l,13,C.muted,i===0?'start':i===L2_XST.length-1?'end':'middle')});
  const show=s.v==='both'?['early','late']:[s.v];let yy=172;
  for(const k of show){const V=L2_SEROVIEW[k];out+=TBF(30,yy,V.who,13,V.col,'start');yy+=20;
   for(const e of V.ev){if(yy>340)break;out+=Ci(36,yy-4,3,V.col)+L2_para(46,yy,e,524,C.ink);yy+=L2_wrap(e,524).length*17+3}yy+=8}
  out+=L2_note('Stage numbers are the standard frog staging used in these papers.',372);
  return {svg:out,phase:s.v==='early'?'In the early reading, a voltage gradient moves serotonin through gap junctions to the right ventral cells in the first hours, and it acts there as an instructive signal.':
   s.v==='late'?'In the late reading, serotonin is needed around gastrulation for the tissue that grows the motile cilia; the cilia’s leftward flow at stage 15 then decides the side.':'Both readings use the same signal at different times. The disagreement is part of the larger debate in the last lesson of this era.'};
 }});

/* ===================== Lesson: gap-junction-model ===================== */
// Eight cells round the animal pole, dorsal at the top, body's left on the left. Junction k joins cell k and k+1;
// junction 3 crosses the ventral midline, junction 7 the dorsal midline.
const L2_G8={
 none:{name:'Untreated',open:[1,1,1,0,1,1,1,1],out:'normal',say:'Cells are coupled all round, except across the ventral midline: a zone of isolation.'},
 blockD:{name:'Block dorsal junctions',open:[1,1,1,0,1,1,0,0],out:'hetero',say:'Blocking communication on the dorsal side induced heterotaxia.'},
 addV:{name:'Open the ventral midline',open:[1,1,1,1,1,1,1,1],out:'hetero',say:'Adding communication across the ventral side also induced heterotaxia.'},
 blockV:{name:'Block ventral junctions',open:[1,1,0,0,0,1,1,1],out:'none',say:'The reverse manipulation, blocking ventrally, was reported not to induce heterotaxia.'},
 addD:{name:'Add dorsal coupling',open:[1,1,1,0,1,1,2,2],out:'none',say:'Nor did adding communication dorsally: only the reverse of the normal pattern mattered.'}};
const L2_G8K=Object.keys(L2_G8);
function L2_ring8(cx,cy,R0,open,colFn){
 let out='';
 for(let k=0;k<8;k++){const a0=(-90+45*k)*Math.PI/180,a1=(-45+45*k)*Math.PI/180,r1=R0*.45;
  out+=P(`M${fmt(cx+r1*Math.cos(a0))} ${fmt(cy+r1*Math.sin(a0))}L${fmt(cx+R0*Math.cos(a0))} ${fmt(cy+R0*Math.sin(a0))}A${R0} ${R0} 0 0 1 ${fmt(cx+R0*Math.cos(a1))} ${fmt(cy+R0*Math.sin(a1))}L${fmt(cx+r1*Math.cos(a1))} ${fmt(cy+r1*Math.sin(a1))}A${fmt(r1)} ${fmt(r1)} 0 0 0 ${fmt(cx+r1*Math.cos(a0))} ${fmt(cy+r1*Math.sin(a0))}Z`,'#fff',3,colFn?colFn(k):'#fbf6ea')}
 for(let k=0;k<8;k++){const a=(-45+45*k)*Math.PI/180,rm=R0*.74,x=cx+rm*Math.cos(a),y=cy+rm*Math.sin(a),o=open[k];
  out+=o?Ci(x,y,o>1?9:6,C.amber,'#fff'):TB(x,y+6,'✕',17,C.coral)}
 return out;
}
SCENE({id:'gap-junction-model',name:'Junctions open on one side',tag:'Single-lab finding · gap junctions in early frog left–right patterning (1998)',
 definition:'Levin and Mercola (1998) reported that gap-junctional communication matters for left and right in the frog. Early cells are coupled to their neighbours all round the embryo except across the ventral midline, which forms a zone of isolation. Changing that pattern with drugs, or by injecting mRNAs for working or blocking connexins, disturbed organ placement.',
 example:'The effect was specific: heterotaxia followed blocking communication dorsally, or adding it ventrally, but not the reverse. The authors also placed this step upstream of the left-sided gene Xnr-1. Reported by one lab; the review numbers for each treatment are left out here because this course could not check them against the paper.',
 desc:'Eight cells round the top of an early frog embryo, joined by gap junctions (amber dots) except across the ventral midline (✕). Five experiments change which junctions are open, and the panel gives the reported outcome.',
 research:['Levin & Mercola (1998). Gap junctions are involved in the early generation of left–right asymmetry. Developmental Biology 203, 90–105.'],
 dur:12,hint:'Choose an experiment and compare which junctions are open with the outcome the paper reported.',
 init:()=>({ex:'none'}),
 watch(p){return {ex:L2_G8K[Math.min(4,Math.floor(p*5))]}},
 ui:[{choose:L2_G8K.map(k=>[k,L2_G8[k].name]),label:'Experiment',get:s=>s.ex,act:'ex'}],
 on:{ex(s,v){if(L2_G8[v])s.ex=v}},
 draw(s){
  const E=L2_G8[s.ex],cx=160,cy=206;
  let out=heading(E.name,26)+L2_badge(10,40,'single');
  out+=L2_ring8(cx,cy,116,E.open);
  out+=TF(cx,82,'dorsal',13,C.muted)+TF(cx,340,'ventral',13,C.muted)+TF(40,210,'left',13,C.muted,'end')+TF(280,210,'right',13,C.muted,'start');
  out+=TF(cx,200,'animal',13,C.muted)+TF(cx,216,'pole',13,C.muted);
  out+=R(318,70,272,250,'#fff',C.grid,8)+TBF(332,96,'Reported outcome',14,C.ink,'start');
  const col=E.out==='hetero'?C.coral:E.out==='normal'?C.green:C.blue;
  out+=R(332,108,244,32,E.out==='hetero'?C.coralp:E.out==='normal'?C.greenp:C.pale,'none',8)+TBF(454,129,E.out==='hetero'?'heterotaxia induced':E.out==='normal'?'normal sidedness':'no heterotaxia reported',14,col);
  out+=L2_para(332,164,E.say,248,C.ink);
  out+=Ci(338,284,6,C.amber,'#fff')+TF(350,289,'open junction',13,C.ink,'start')+TB(470,290,'✕',15,C.coral)+TF(482,289,'closed',13,C.ink,'start');
  out+=L2_note('Schematic. The paper manipulated junctions with drugs and connexin mRNAs.',372);
  return {svg:out,phase:E.say};
 }});

// Toy ring: each open junction carries the molecule one way faster than the other (ratio r), standing in for the
// proposed voltage-driven drift. Closed junctions split the ring into segments; each segment keeps its own amount
// and reaches the steady state c_{i+1}/c_i = r along the drift.
const L2_RN16=16;
const L2_cellAng=k=>(-90+(k+.5)*360/L2_RN16)*Math.PI/180;
function L2_ringSS(open,r,cw){
 const N=L2_RN16,c=Array(N).fill(1),cut=range(N).filter(k=>!open[k]);
 if(!cut.length||r===1)return c;
 // walk each segment in the drift direction
 const segs=[];
 for(const k of cut){const seg=[];let i=cw?(k+1)%N:k;for(let n=0;n<N;n++){seg.push(i);const j=cw?i:(i-1+N)%N;if(!open[j])break;i=cw?(i+1)%N:(i-1+N)%N}segs.push(cw?seg:seg)}
 for(const seg of segs){const w=seg.map((_,n)=>Math.pow(r,n)),W=sum(w);seg.forEach((i,n)=>c[i]=w[n]/W*seg.length)}
 return c;
}
function L2_sided(c){const N=c.length;let sx=0,tot=0;c.forEach((v,k)=>{sx+=v*Math.cos(L2_cellAng(k));tot+=v});const m=sx/tot;let pk=0;c.forEach((v,k)=>{if(v>c[pk])pk=k});return {m,pk,side:Math.abs(m)<.05?'none':m>0?'right':'left',peak:c[pk]/(tot/N)}}
const L2_ringInit=()=>({open:range(L2_RN16).map(k=>k===7?0:1),r:1.35,cw:1});
SCENE({id:'gap-junction-model-ring',name:'Break the ring',tag:'Simplified model · the lab’s ring of coupled cells with a zone of isolation',
 definition:'The lab’s model joins these results: a voltage gradient drives a signal molecule one way round a ring of coupled cells, and the zone of isolation at the ventral midline stops it, so it piles up in the cell just before the break, on the right. Where the break sits, not only how strong the drive is, would then decide the side.',
 example:'In this toy the drive is a fixed bias: each open junction passes the molecule forwards faster than backwards. Closed junctions cut the ring into segments, each segment keeps its own molecules, and at steady state each cell holds a fixed multiple of the one behind it. The sidedness read out is computed from where the molecule ends up. Every number is from the toy, which leaves out how the voltage gradient itself is made and kept.',
 desc:'Sixteen cells in a ring with gap junctions between them, any of which can be closed, bars showing the steady-state amount of a signal molecule in each cell, and a readout of which side of the embryo holds more.',
 research:['Levin & Mercola (1998), Developmental Biology 203, 90–105, and Fukumoto, Kema & Levin (2005), Current Biology 15, 794–803: the proposal this toy illustrates.','The rectifying-junction ring is a cartoon written for this course.'],
 dur:12,hint:'Press a junction to close or open it. Move the break away from the ventral midline, add a second break, or remove it, and read the side. The drift strength and direction can be changed too.',
 init:L2_ringInit,
 watch(p){const s=L2_ringInit(),k=Math.min(3,Math.floor(p*4));if(k===1){s.open[7]=1;s.open[15]=0}else if(k===2){s.open[7]=1}else if(k===3){s.open[3]=0}return s},
 ui:[{range:'r',label:'Drift: forward ÷ backward rate',min:1,max:2,step:.05,get:s=>s.r,act:'r'},{choose:[['1','Clockwise'],['0','Anticlockwise']],label:'Drift direction (as drawn)',get:s=>String(s.cw),act:'cw'},{b:'Usual break at the ventral midline',act:'usual'}],
 on:{tog(s,k){k=+k;if(k>=0&&k<L2_RN16)s.open[k]=s.open[k]?0:1;return 'keep'},r(s,v){s.r=clamp(Math.round(+v*100)/100,1,2)},cw(s,v){s.cw=v==='0'?0:1},usual(s){Object.assign(s,{open:L2_ringInit().open})}},
 draw(s,f,X){
  const c=L2_ringSS(s.open,s.r,s.cw),sd=L2_sided(c),cx=166,cy=218,R0=88,cuts=s.open.filter(o=>!o).length;
  let out=heading(sd.side==='none'?'No side chosen':`Signal collects on the ${sd.side}`,26)+L2_badge(10,40,'model')+L2_badge(20+L2_bw('model'),40,'frame');
  out+=Ci(cx,cy,R0+42,'#fbf6ea',C.grid);
  const cmax=Math.max(...c);
  for(let k=0;k<L2_RN16;k++){const a=L2_cellAng(k),x=cx+R0*Math.cos(a),y=cy+R0*Math.sin(a),len=8+34*c[k]/Math.max(cmax,2);
   out+=L(x,y,x+len*Math.cos(a),y+len*Math.sin(a),k===sd.pk&&sd.side!=='none'?C.coral:C.purple,7)+Ci(x,y,9,'#fff',C.line);
   const aj=(-90+(k+1)*360/L2_RN16)*Math.PI/180,jx=cx+(R0-24)*Math.cos(aj),jy=cy+(R0-24)*Math.sin(aj);
   out+=hit(X,'tog',k,`Junction ${k+1}: ${s.open[k]?'open':'closed'}. Press to change.`,Ci(jx,jy,9,'#fff','none')+(s.open[k]?Ci(jx,jy,5,C.amber):TB(jx,jy+5,'✕',15,C.coral)))}
  out+=curveArrow(cx-24,cy-26,cx+24,cy-26,s.cw?-14:14,C.muted,2);out+=TF(cx,cy+6,'drift',13,C.muted);
  out+=TF(cx,82,'dorsal',13,C.muted)+TF(cx,374,'ventral',13,C.muted)+TF(cx-134,222,'left',13,C.muted,'end')+TF(cx+134,222,'right',13,C.muted,'start');
  out+=L2_tile(340,72,250,'Closed junctions',String(cuts),C.ink)+L2_tile(340,128,250,'Peak cell holds',`${fmt(L2_r1(sd.peak))} × average`,C.coral);
  out+=L2_tile(340,184,250,'Right-minus-left balance',L2_sgn(Math.round(sd.m*100)/100),C.purple)+L2_tile(340,240,250,'Toy sidedness',sd.side==='none'?'none':sd.side,sd.side==='right'?C.blue:sd.side==='left'?C.green:C.muted);
  out+=L2_para(340,306,'Balance: mean of the amount times each cell’s left–right position, divided by the total.',250,C.muted,16);
  const ph=cuts===0?'With no break the molecule circulates and every cell holds the same amount: no side is chosen. In this model the zone of isolation is what turns a drift into a pattern.':
   s.r===1?'With no drift bias the molecule just spreads evenly within each segment, whatever junctions are closed.':
   cuts>1?`With ${cuts} breaks the ring is cut into ${cuts} segments, each with its own peak just before its break, so the signal is shared between places and the side is ${sd.side==='none'?'not decided':'weaker'}.`:
   `With one break, the molecule piles up in the cell just before it, ${fmt(L2_r1(sd.peak))} times the average. Move the break and the peak moves with it; the toy’s side is ${sd.side}.`;
  return {svg:out,phase:ph};
 },
 three(s,f,X,project){
  const c=L2_ringSS(s.open,s.r,s.cw),cmax=Math.max(...c),P3=project([-1.4,1.4,-1.4,1.4,0,1.6]);
  let faces=[];
  for(let k=0;k<L2_RN16;k++){const a=L2_cellAng(k),x=Math.cos(a),y=-Math.sin(a),h=.1+1.3*c[k]/Math.max(cmax,1.5);faces=faces.concat(prism(x-.09,y-.09,0,.18,.18,h,k===L2_sided(c).pk?C.coral:C.purple))}
  let out='';const ring=[];for(let i=0;i<=48;i++){const a=i/48*Math.PI*2;ring.push(P3([1.25*Math.cos(a),1.25*Math.sin(a),0]))}
  out+=L2_poly(ring.map(p=>[p[0],p[1]]),C.line,1.6);
  out+=paintFaces(faces,P3);
  const lab=(p,t)=>{const q=P3(p);return label3(q[0],q[1],t,14,C.muted)};
  out+=lab([0,1.5,0],'dorsal')+lab([0,-1.5,0],'ventral')+lab([-1.55,0,0],'left')+lab([1.55,0,0],'right');
  return {svg:out,title:'The ring of cells in 3D',caption:'Schematic 3D view: bar height is the toy’s steady-state amount in each cell of the ring.'};
 }});

const L2_CHX={intact:{name:'Intact embryo',say:'Shh came on on the left side of Hensen’s node, as usual.',ok:1},
 noL:{name:'Left half removed',say:'Embryos missing their left lateral half failed to pattern normal sided gene expression at the node.',ok:0},
 noR:{name:'Right half removed',say:'Missing the right half had the same effect: both halves were needed.',ok:0},
 low:{name:'Coupling reduced',say:'A chemical that reduces gap-junctional communication frequently unbiased the sidedness of Shh and Nodal.',ok:0}};
SCENE({id:'gap-junction-model-chick',name:'Chick: signals cross the blastoderm',tag:'Single-lab finding · gap junctions upstream of the chick node (1999)',
 definition:'Levin and Mercola (1999) turned to the chick. Embryos deprived of either their left or their right lateral half could not pattern normal sided gene expression at Hensen’s node, and reducing gap-junctional communication often unbiased Shh and Nodal. The connexin Cx43 was present across the early blastoderm but absent from the node and the primitive streak.',
 example:'Reported by one lab. They proposed that left–right information is carried one way through the outer cell layer by gap junctions, around the node and streak rather than through them, to set up Shh on the left of the node. Later, Gros and colleagues (2009) traced the Shh asymmetry at the node to leftward cell movements around it during gastrulation, movements that themselves needed H+/K+-ATPase activity.',
 desc:'A chick embryo with Cx43 shaded across the blastoderm except the node and streak, a dashed band for the proposed path of the signal, and four conditions with the reported outcome at the node.',
 research:['Levin & Mercola (1999). Gap junction-mediated transfer of left–right patterning signals in the early chick blastoderm is upstream of Shh asymmetry in the node. Development 126, 4703–4714.','Gros, Feistel, Viebahn, Blum & Tabin (2009), Science 324, 941–944: leftward cell movements at the node.'],
 dur:12,hint:'Choose a condition and compare the node’s Shh with the intact embryo.',
 init:()=>({ex:'intact'}),
 watch(p){return {ex:['intact','noL','noR','low'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:Object.keys(L2_CHX).map(k=>[k,L2_CHX[k].name]),label:'Condition',get:s=>s.ex,act:'ex'}],
 on:{ex(s,v){if(L2_CHX[v])s.ex=v}},
 draw(s){
  const E=L2_CHX[s.ex],cx=165;
  let out=heading(E.name,26)+L2_badge(10,40,'single');
  out+=`<ellipse cx="${cx}" cy="212" rx="118" ry="144" fill="#fbf8f1" stroke="${C.line}" stroke-width="2"/>`;
  // Cx43 across the blastoderm (hatched), absent from node and streak
  if(s.ex!=='noL')out+=P(`M${cx-10} 72C${cx-80} 76 ${cx-116} 140 ${cx-114} 214C${cx-112} 290 ${cx-70} 350 ${cx-10} 354Z`,C.green,1.4,C.greenp,s.ex==='low'?'fill-opacity="0.35"':'');
  if(s.ex!=='noR')out+=P(`M${cx+10} 72C${cx+80} 76 ${cx+116} 140 ${cx+114} 214C${cx+112} 290 ${cx+70} 350 ${cx+10} 354Z`,C.green,1.4,C.greenp,s.ex==='low'?'fill-opacity="0.35"':'');
  if(s.ex==='noL')out+=TF(cx-60,220,'removed',13,C.coral);if(s.ex==='noR')out+=TF(cx+60,220,'removed',13,C.coral);
  out+=L(cx,330,cx,160,C.muted,6)+Ci(cx,148,14,'#fff',C.muted);
  out+=P(`M${cx-82} 290C${cx-90} 150 ${cx-40} 102 ${cx} 102C${cx+40} 102 ${cx+90} 150 ${cx+82} 290`,C.purple,2.2,'none','stroke-dasharray="6 5"');
  out+=P(`M${cx} 134A14 14 0 0 0 ${cx} 162Z`,C.purple,1.4,E.ok?C.purple:'#fff');
  out+=TF(cx+20,152,E.ok?'Shh left':'Shh not sided',13,E.ok?C.purple:C.coral,'start');
  out+=TF(cx,368,'green: Cx43 · dashed: proposed path',13,C.muted);
  out+=R(318,70,272,200,'#fff',C.grid,8)+TBF(332,96,'Reported',14,C.ink,'start')+L2_para(332,120,E.say,248,E.ok?C.ink:C.coral);
  out+=L2_badge(332,232,'debate');
  out+=L2_para(318,296,'Gros et al. (2009) later traced the node’s Shh asymmetry to leftward cell movements.',272,C.muted);
  return {svg:out,phase:E.say};
 }});

/* ===================== Lesson: cilia-debate ===================== */
// Toy node: cilia make a leftward flow of 1 model unit; an imposed flow adds to it. Each of 40 toy embryos reads the
// net flow with its own seeded noise: net leftward gives the usual side, net rightward the mirror image.
const L2_NN=40,L2_NSIG=.35;
function L2_node(s){const nat=s.mot?-1:0,net=nat+s.imp,r=L2_rng(1998);let norm=0;for(let i=0;i<L2_NN;i++){const z=Math.sqrt(-2*Math.log(Math.max(1e-9,r())))*Math.cos(2*Math.PI*r());if(net+L2_NSIG*z<0)norm++}return {nat,net,norm,rev:L2_NN-norm}}
SCENE({id:'cilia-debate',name:'A leftward flow in the mouse node',tag:'Replicated finding · cilia-driven nodal flow in the mouse',
 definition:'In 1998 Shigenori Nonaka and colleagues in Nobutaka Hirokawa’s lab found that cells in the mouse node carry single motile cilia that spin and drive the fluid over the node to the left. Mice lacking the motor protein KIF3B had no node cilia, and their left and right were randomised. The node’s flow became the leading account of how mammals break symmetry.',
 example:'In 2002 Nonaka, Shiratori, Saijoh and Hiroshi Hamada cultured mouse embryos under an artificial flow: a rightward flow strong enough to overcome the natural one reversed situs, and an artificial flow could set the side in mutants whose cilia cannot move. Martina Brueckner’s lab then described two kinds of node cilia: motile ones that make the flow and immotile ones that sense it. These results were confirmed and extended by many groups: nodal flow in the mouse is a replicated finding.',
 desc:'A mouse node seen from below with spinning cilia and particles carried left, a switch that makes the cilia immotile, a slider for an imposed flow, and 40 toy embryos scored by the side their net flow points.',
 research:['Nonaka et al. (1998). Randomization of left–right asymmetry due to loss of nodal cilia generating leftward flow of extraembryonic fluid in mice lacking KIF3B motor protein. Cell 95, 829–837.','Nonaka, Shiratori, Saijoh & Hamada (2002). Determination of left–right patterning of the mouse embryo by artificial nodal flow. Nature 418, 96–99.','McGrath, Somlo, Makova, Tian & Brueckner (2003). Two populations of node monocilia initiate left–right asymmetry in the mouse. Cell 114, 61–73.'],
 dur:12,hint:'Make the cilia immotile, then impose a flow to the right or to the left. Watch the net flow and the count of toy embryos with the usual side.',
 init:()=>({mot:1,imp:0}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return [{mot:1,imp:0},{mot:0,imp:0},{mot:1,imp:2.5},{mot:0,imp:-1.5}][k]},
 ui:[{b:'Cilia motile / immotile',act:'mot'},{range:'imp',label:'Imposed flow (− left, + right; model units)',min:-3,max:3,step:.25,get:s=>s.imp,act:'imp'}],
 on:{mot(s){s.mot^=1},imp(s,v){s.imp=clamp(Math.round(+v*4)/4,-3,3)}},
 draw(s,f,X){
  const m=L2_node(s),cx=170,cy=196;
  let out=heading(Math.abs(m.net)<.15?'No net flow: sides by chance':m.net<0?'Net flow to the left':'Net flow to the right',26)+L2_badge(10,40,'rep')+L2_badge(20+L2_bw('rep'),40,'model');
  out+=`<ellipse cx="${cx}" cy="${cy}" rx="130" ry="92" fill="#eef6fb" stroke="${C.blue}" stroke-width="2"/>`;
  const rr=L2_rng(11);for(let i=0;i<18;i++){const x=cx-100+rr()*200,y=cy-60+rr()*120,ph=X&&!X.try?X.p*12*Math.PI:0;
   out+=L(x,y,x+(s.mot?7*Math.cos(ph+i):0),y-12+(s.mot?4*Math.sin(ph+i):0),C.dark,2)+Ci(x,y,2.4,C.dark)}
  const pr=L2_rng(23);for(let i=0;i<10;i++){let x=pr()*240,y=cy-50+pr()*100;if(X&&!X.try)x=((x+m.net*X.p*400)%240+240)%240;out+=Ci(cx-120+x,y,4,C.amber)}
  if(Math.abs(m.net)>.05)out+=arrow(cx,cy+112,cx+m.net*34,cy+112,m.net<0?C.green:C.coral,4,12);
  out+=TF(cx,cy+136,`net flow ${L2_sgn(m.net)} (natural ${L2_sgn(m.nat)}, imposed ${L2_sgn(m.net-m.nat)})`,13,C.ink);
  out+=TF(36,cy+4,'left',13,C.muted,'start')+TF(304,cy+4,'right',13,C.muted,'end')+TF(cx,90,'anterior',13,C.muted);
  out+=L2_tile(330,74,124,'Usual side',`${m.norm} of ${L2_NN}`,C.green)+L2_tile(464,74,124,'Mirrored',`${m.rev} of ${L2_NN}`,C.coral);
  for(let i=0;i<L2_NN;i++){const x=340+(i%10)*24,y=150+Math.floor(i/10)*26;out+=i<m.norm?Ci(x,y,7,C.green):Ci(x,y,6.5,'#fff',C.coral)}
  out+=TF(330,268,'dot: usual · ring: mirrored',13,C.muted,'start')+TF(330,288,`cilia ${s.mot?'motile':'immotile'}`,13,C.ink,'start');
  out+=L2_para(330,312,'Toy reading of the net flow, with noise. Not the papers’ counts.',260,C.muted,16);
  const ph=!s.mot&&Math.abs(s.imp)<.15?`Without moving cilia there is no flow, and the toy embryos choose by chance: ${m.norm} usual, ${m.rev} mirrored. Mice without node cilia were randomised in the same way.`:
   m.net>0?`The imposed rightward flow outweighs the cilia, so the net flow runs right and ${m.rev} of ${L2_NN} toy embryos are mirrored, as rightward artificial flow reversed situs in 2002.`:
   !s.mot?`With immotile cilia, an imposed leftward flow restores the usual side in ${m.norm} of ${L2_NN} toy embryos, as artificial flow could set the side of mutant embryos.`:
   `The spinning cilia push the fluid left; ${m.norm} of ${L2_NN} toy embryos take the usual side.`;
  return {svg:out,phase:ph};
 }});

// Why a spinning, tilted cilium pushes one way: the tip moves one way high above the cell surface and the other way
// close to it, where the wall slows the fluid. Push per turn ∝ the average of (sideways tip speed × height).
function L2_cilium(tiltDeg,dir,phase){
 const th=tiltDeg*Math.PI/180,H=1,rr=.6,w=dir==='cw'?1:-1,n=360;let acc=0;
 for(let i=0;i<n;i++){const ph=i/n*Math.PI*2,vx=-rr*Math.sin(ph)*w,z=H*Math.cos(th)+rr*Math.sin(ph)*Math.sin(th);acc+=vx*z}
 const net=acc/n,max=rr*rr/2,tip=phase===undefined?null:{x:rr*Math.cos(phase),z:H*Math.cos(th)+rr*Math.sin(phase)*Math.sin(th)};
 return {net,max,frac:net/max,tip,th,rr,H};
}
SCENE({id:'cilia-debate-tilt',name:'Why spinning cilia push one way',tag:'Replicated finding · posterior tilt of node cilia · Simplified model of the fluid physics',
 definition:'A cilium spinning straight up would stir the fluid round and round, with no net flow. Nonaka, Hamada and colleagues (2005) found that mouse node cilia are tilted towards the posterior. A tilted cilium sweeps one way high above the cell surface and the other way close to it, where the surface drags on the fluid, so the high stroke wins.',
 example:'In this toy, the push per turn is the average of the tip’s sideways speed times its height above the surface. It comes out proportional to the sine of the tilt: zero when upright, largest when lying flat. Reversing the spin reverses the flow. The direction of spin and the posterior tilt together turn the embryo’s front–back and top–bottom axes into a left–right one. Hirokawa’s lab reported the posterior tilt independently the same year, so it is a replicated finding.',
 desc:'A node cilium seen from behind, its tip tracing an ellipse whose upper half moves left and lower half right, an arrow for the computed push per turn, and controls for tilt and spin direction.',
 research:['Nonaka, Yoshiba, Watanabe, Ikeuchi, Goto, Marshall & Hamada (2005). De novo formation of left–right asymmetry by posterior tilt of nodal cilia. PLoS Biology 3, e268.','Okada et al. (2005). Mechanism of nodal flow: a conserved symmetry breaking event in left–right axis determination. Cell (Hirokawa lab; posterior tilt reported independently).','The height-weighted average is a cartoon of near-wall fluid drag, not the paper’s model.'],
 dur:12,hint:'Change the tilt from 0° to 90° and the direction of spin, and read the computed push per turn.',
 init:()=>({tilt:40,dir:'cw'}),
 watch(p){return {tilt:Math.round(clamp(p*1.25,0,1)*60),dir:'cw'}},
 ui:[{range:'tilt',label:'Tilt towards posterior (degrees)',min:0,max:90,step:5,get:s=>s.tilt,act:'tilt'},{choose:[['cw','Clockwise (seen from below)'],['ccw','Anticlockwise']],label:'Spin',get:s=>s.dir,act:'dir'}],
 on:{tilt(s,v){s.tilt=clamp(Math.round(+v),0,90)},dir(s,v){s.dir=v==='ccw'?'ccw':'cw'}},
 draw(s,f,X){
  const ph=X&&!X.try?X.p*16*Math.PI:Math.PI/2,c=L2_cilium(s.tilt,s.dir,ph),cx=170,base=300,sc=150;
  let out=heading(Math.abs(c.frac)<.02?'Upright: no net push':`Net push to the ${c.net<0?'left':'right'}`,26)+L2_badge(10,40,'rep')+L2_badge(20+L2_bw('rep'),40,'model');
  out+=R(20,base,300,14,C.pale,'none',2)+TF(cx,base+34,'cell surface (drag slows fluid here)',13,C.muted);
  // tip path
  const pts=[];for(let i=0;i<=72;i++){const a=i/72*Math.PI*2;pts.push([cx+c.rr*Math.cos(a)*sc,base-(c.H*Math.cos(c.th)+c.rr*Math.sin(a)*Math.sin(c.th))*sc])}
  out+=L2_poly(pts,C.line,1.6,'stroke-dasharray="4 4"');
  const w=s.dir==='cw'?1:-1,topY=base-(c.H*Math.cos(c.th)+c.rr*Math.sin(c.th))*sc,botY=base-(c.H*Math.cos(c.th)-c.rr*Math.sin(c.th))*sc;
  if(s.tilt>0){out+=arrow(cx+30*w,topY-12,cx-30*w,topY-12,C.green,3,9)+arrow(cx-30*w,botY+12,cx+30*w,botY+12,C.coral,1.8,7)}
  const tx=cx+c.tip.x*sc,tz=base-c.tip.z*sc;out+=L(cx,base,tx,tz,C.dark,3.5)+Ci(tx,tz,5,C.dark);
  out+=TF(30,90,'left',13,C.muted,'start')+TF(310,90,'right',13,C.muted,'end')+TF(cx,90,'seen from behind',13,C.muted);
  out+=L2_tile(340,80,250,'Push per turn (model units)',L2_sgn(Math.round(c.net*1000)/1000),C.ink)+L2_tile(340,136,250,'Share of the flat-cilium maximum',Math.round(Math.abs(c.frac)*100)+'%',C.purple);
  out+=L2_tile(340,192,250,'sin(tilt), for comparison',fmt(Math.round(Math.sin(c.th)*100)/100),C.muted);
  out+=L2_para(340,262,'Green: the high stroke, far from the surface, moves more fluid. Coral: the low return stroke moves less.',250,C.ink,16);
  out+=L2_note('Negative push = leftward. Toy fluid physics, not the paper’s model.',372);
  return {svg:out,phase:s.tilt===0?'Spinning straight up, the cilium’s tip stays at one height, so every stroke is matched by an equal and opposite one: no net flow.':
   `At ${s.tilt}° the high stroke moves ${s.dir==='cw'?'left':'right'} and the low stroke the other way; the push per turn is ${Math.round(Math.abs(c.frac)*100)}% of the maximum, matching sin(${s.tilt}°). ${s.dir==='cw'?'Clockwise spin with a posterior tilt gives a leftward flow, as in the mouse node.':'Spun the other way, the same cilium would push to the right.'}`};
 }});

const L2_SPEC=[
 {sp:'Mouse',flow:['yes','node: leftward flow (Nonaka et al. 1998, 2002)'],ion:['–','no early ion-flux asymmetry in this course’s sources']},
 {sp:'Frog',flow:['yes','roof-plate flow from stage 15 (Schweickert et al. 2007)'],ion:['yes','H+/K+-ATPase, V-ATPase, serotonin (Levin lab 2002–2006)']},
 {sp:'Zebrafish',flow:['yes','Kupffer’s vesicle flow (Essner et al. 2005)'],ion:['yes','V-ATPase upstream of Kupffer’s vesicle (Adams et al. 2006)']},
 {sp:'Chick',flow:['no','no motile node cilia found; cell movements (Gros et al. 2009)'],ion:['yes','pump-dependent voltage across the streak (Levin et al. 2002)']},
 {sp:'Pig',flow:['no','no ciliated node-like structure found (Gros et al. 2009)'],ion:['–','no early ion-flux asymmetry in this course’s sources']}];
SCENE({id:'cilia-debate-species',name:'Which embryos have a flow?',tag:'Criticism and debate · how universal is each mechanism?',
 definition:'If cilia-driven flow breaks symmetry in all vertebrates, every vertebrate embryo should have a ciliated organ with a leftward flow at the right time. Mouse, frog and zebrafish do: the node, the gastrocoel roof plate and Kupffer’s vesicle. Gros and colleagues (2009) found no motile cilia at the chick node and no node-like ciliated structure in the pig, and showed that leftward cell movements set the chick’s node genes instead.',
 example:'The early ion-flux results come mainly from frog, chick and zebrafish, the species the lab studied; this course found no report of them in the mouse. So the two accounts are supported in partly different species, which is one reason this remains a live debate rather than a settled question.',
 desc:'A table of five species with two columns, whether a ciliated flow organ has been reported and whether an early ion-flux asymmetry has been reported, with the source for each cell.',
 research:['Schweickert et al. (2007). Cilia-driven leftward flow determines laterality in Xenopus. Current Biology 17, 60–66.','Essner, Amack, Nyholm, Harris & Yost (2005). Kupffer’s vesicle is a ciliated organ of asymmetry in the zebrafish embryo that initiates left–right development of the brain, heart and gut. Development 132, 1247–1260.','Gros et al. (2009), Science 324, 941–944; Adams et al. (2006), Development 133, 1657–1671.'],
 dur:12,hint:'Press a species to read the evidence behind its row.',
 init:()=>({sel:3}),
 watch(p){return {sel:Math.min(4,Math.floor(p*5))}},
 ui:[{choose:L2_SPEC.map((r,i)=>[String(i),r.sp]),label:'Species',get:s=>String(s.sel),act:'sel'}],
 on:{sel(s,v){const i=+v;if(i>=0&&i<L2_SPEC.length)s.sel=i;return 'keep'}},
 draw(s,f,X){
  let out=heading('Flow organs and early ion flux',26)+L2_badge(10,40,'debate');
  out+=TBF(150,84,'Ciliated flow',13,C.ink)+TBF(260,84,'Early ion flux',13,C.ink);
  L2_SPEC.forEach((r,i)=>{const y=96+i*44,sel=i===s.sel;
   const mark=(x,v)=>v==='yes'?Ci(x,y+20,9,C.green)+TBF(x,y+25,'✓',13,'#fff'):v==='no'?Ci(x,y+20,9,'#fff',C.coral)+TBF(x,y+25,'✗',13,C.coral):TF(x,y+25,'–',15,C.muted);
   out+=hit(X,'sel',i,`${r.sp}: flow ${r.flow[0]}, ion flux ${r.ion[0]}. Press for details.`,R(10,y,300,40,sel?C.pale:'#fff',sel?C.blue:C.grid,8)+TBF(24,y+25,r.sp,14,C.ink,'start')+mark(150,r.flow[0])+mark(260,r.ion[0]))});
  const r=L2_SPEC[s.sel];
  out+=R(324,70,266,236,'#fff',C.grid,8)+TBF(338,96,r.sp,15,C.ink,'start');
  out+=TBF(338,122,'Ciliated flow:',13,C.green,'start')+L2_para(338,142,r.flow[1],240,C.ink);
  out+=TBF(338,206,'Early ion flux:',13,C.purple,'start')+L2_para(338,226,r.ion[1],240,C.ink);
  out+=TF(20,330,'✓ reported · ✗ looked for, not found · – not in the sources used here',13,C.muted,'start');
  out+=L2_note('“Not found” is not proof of absence; methods and stages differ between studies.',356);
  return {svg:out,phase:`${r.sp}: ${r.flow[1]}; ${r.ion[1]}.`};
 }});

// Published conclusions, sorted by the learner into the view their authors argue for.
const L2_POS=[
 {t:'Nonaka et al. 1998 · mouse: no node cilia, sides random',a:'flow'},
 {t:'Nonaka et al. 2002 · mouse: artificial flow sets the side',a:'flow'},
 {t:'Levin et al. 2002 · frog, chick: pump and voltage come first',a:'ion'},
 {t:'Schweickert et al. 2007 · frog: flow precedes Nodal',a:'flow'},
 {t:'Gros et al. 2009 · chick: cell movements at the node',a:'other'},
 {t:'Walentek et al. 2012 · frog: pump needed to build the flow',a:'flow'},
 {t:'Vandenberg & Levin 2013 · early origin, cilia may amplify',a:'other'},
 {t:'Blum et al. 2014 · flow-based breaking is the archetype',a:'flow'}];
const L2_PCAT=[['?','choose',C.muted],['flow','cilia flow first',C.green],['ion','ion flux first',C.purple],['other','other or both',C.blue]];
SCENE({id:'cilia-debate-positions',name:'Two readings of the same field',tag:'Criticism and debate · the authors’ own conclusions, sorted',
 definition:'The two camps read the same body of work differently. Martin Blum and colleagues (2014) reviewed both models and concluded that the evidence is best compatible with flow-based symmetry breaking as the archetypal vertebrate mode, with some open questions. Laura Vandenberg and Michael Levin (2013) argued that the data strongly support an early origin of asymmetry, and are also consistent with later roles for cilia in amplifying it.',
 example:'This scene asks only which view each paper’s own authors drew, which can be checked. It does not ask which view is right: the field has not settled how universal either mechanism is, and both camps continue to publish experiments meant to decide it.',
 desc:'Eight cards, each a published conclusion with its authors and year, to be sorted into cilia flow first, ion flux first, or other or both, with a check against what the authors themselves concluded.',
 research:['Blum, Schweickert, Vick, Wright & Danilchik (2014). Symmetry breakage in the vertebrate embryo: when does it happen and how does it work? Developmental Biology 393, 109–123.','Vandenberg & Levin (2013). A unified model for left–right asymmetry? Comparison and synthesis of molecular models of embryonic laterality. Developmental Biology 379, 1–15.','Vandenberg & Levin (2010). Far from solved: a perspective on what we know about early mechanisms of left–right asymmetry. Developmental Dynamics 239, 3131–3146.'],
 dur:14,hint:'Press each card’s box to choose which view its authors argued. Then check against their stated conclusions.',
 init:()=>({g:L2_POS.map(()=>0),show:0}),
 watch(p){const k=Math.floor(clamp(p*1.2,0,1)*L2_POS.length);return {g:L2_POS.map((c,i)=>i<k?L2_PCAT.findIndex(x=>x[0]===c.a):0),show:p>.85?1:0}},
 ui:[{b:'Check against the authors',act:'show'},{b:'Clear',act:'clear'}],
 on:{pick(s,i){i=+i;if(i>=0&&i<L2_POS.length)s.g[i]=(s.g[i]+1)%L2_PCAT.length;return 'keep'},show(s){s.show=1;return 'keep'},clear(s){s.g=L2_POS.map(()=>0);s.show=0}},
 draw(s,f,X){
  const n={flow:0,ion:0,other:0};s.g.forEach(v=>{if(v)n[L2_PCAT[v][0]]++});const picked=s.g.filter(v=>v).length,match=s.g.filter((v,i)=>v&&L2_PCAT[v][0]===L2_POS[i].a).length;
  let out=heading('What did each paper’s authors conclude?',26)+L2_badge(10,40,'debate');
  L2_POS.forEach((c,i)=>{const y=66+i*32,v=s.g[i],cat=L2_PCAT[v];
   out+=R(10,y,580,28,'#fff',C.grid,6)+TF(20,y+19,c.t,13,C.ink,'start');
   out+=hit(X,'pick',i,`${c.t}: ${cat[1]}. Press to change.`,R(436,y+3,136,22,v?cat[2]:'#fff',cat[2],11)+TBF(504,y+18,cat[1],13,v?'#fff':C.muted));
   if(s.show&&v)out+=TBF(586,y+20,cat[0]===c.a?'✓':'✗',14,cat[0]===c.a?C.green:C.coral,'end')});
  out+=L2_tile(10,326,140,'Cilia flow first',String(n.flow),C.green)+L2_tile(158,326,140,'Ion flux first',String(n.ion),C.purple)+L2_tile(306,326,140,'Other or both',String(n.other),C.blue)+L2_tile(454,326,136,'Match authors',s.show?`${match} of ${picked}`:'hidden',C.ink);
  return {svg:out,phase:s.show?`${match} of ${picked} match the authors’ own conclusions. More of these cards come from the flow side because more labs work on it; that is a count of papers, not a verdict.`:
   'Sort the papers by the view their authors argued, not by the view you find more convincing. The course takes no side on which view is right.'};
 }});

