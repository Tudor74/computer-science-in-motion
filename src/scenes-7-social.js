/* ===================== Mind era 7 · Minds among others ===================== */
// Development, theory of mind, conformity, obedience, dissonance and the replication crisis.
// Studies that deceived or distressed people (Asch, Milgram, the Stanford Prison Experiment) are shown only as
// reconstructions of published data; the learner is never deceived. Learner-as-participant scenes: line
// judgements made alone (conformity), the free-choice paradigm (cognitive-dissonance-choice) and the replication
// quiz. Every picture is a pure function of state, frame and X; trial order is seeded.
const D7_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const D7_rng=n=>rng(D7_mix(n));
function D7_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
// Standard normal CDF (Abramowitz & Stegun 7.1.26 for erf).
function D7_phi(z){const x=Math.abs(z)/Math.SQRT2,t=1/(1+.3275911*x),y=1-((((1.061405429*t-1.453152027)*t+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-x*x);return z>=0?.5+.5*y:.5-.5*y}
function D7_wrap(s,n){const out=[];let line='';for(const w of String(s).split(' ')){if(line&&(line+' '+w).length>n){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out}
const D7_para=(x,y,s,n,size=13,col=C.ink,anchor='start',lh=18)=>D7_wrap(s,n).map((l,i)=>TF(x,y+i*lh,l,size,col,anchor)).join('');
function D7_person(x,y,col,k=1){const a=v=>fmt(v);return Ci(x,y-27*k,8*k,col)+P(`M${a(x-11*k)} ${a(y)}L${a(x-11*k)} ${a(y-9*k)}Q${a(x-11*k)} ${a(y-16*k)} ${a(x-4*k)} ${a(y-16*k)}L${a(x+4*k)} ${a(y-16*k)}Q${a(x+11*k)} ${a(y-16*k)} ${a(x+11*k)} ${a(y-9*k)}L${a(x+11*k)} ${a(y)}Z`,'none',0,col)}
// Speech bubble with a tail pointing down-left to (tx,ty).
function D7_bubble(x,y,w,h,tx,ty,fill='#fff',stroke=C.line){return P(`M${fmt(x+18)} ${fmt(y+h-1)}L${fmt(tx)} ${fmt(ty)}L${fmt(x+38)} ${fmt(y+h-1)}`,stroke,1.5,fill)+R(x,y,w,h,fill,stroke,10)+L(x+19,y+h-1,x+37,y+h-1,fill,3)}
// Horizontal percentage bar with value label.
function D7_hbar(x,y,w,h,pct,col,label){return R(x,y,w,h,'#f1f5f7','none',4)+R(x,y,w*clamp(pct,0,100)/100,h,col,'none',4)+(label?TF(x+w*clamp(pct,0,100)/100+6,y+h/2+5,label,13,C.ink,'start'):'')}

/* =========================== conservation =========================== */
const D7_V=80*80*110; // same water: cylinder volume ∝ width² × height
function D7_glass(x,base,w,h,label){
 return R(x-w/2,base-h,w,h,'#bcd9ee','none',2)+L(x-w/2,base-h,x+w/2,base-h,C.blue,2)
  +P(`M${fmt(x-w/2-4)} ${base-196}L${fmt(x-w/2-4)} ${base+3}L${fmt(x+w/2+4)} ${base+3}L${fmt(x+w/2+4)} ${base-196}`,C.ink,2.2)+TF(x,base+22,label,13,C.muted);
}
function D7_childSays(age,w){
 if(Math.abs(w-80)<2)return {t:'They are the same.',ok:true,why:'The glasses match, so there is nothing to explain.'};
 const taller=w<80;
 if(age<=5)return {t:taller?'The tall one has more!':'The low one has less!',ok:false,why:'Centres on one dimension, the height of the water, and ignores the width.'};
 if(age===6)return {t:taller?'The tall one… or the same? The tall one.':'Maybe less… or the same?',ok:false,why:'Transitional: notices the width as well as the height, but cannot yet reconcile them.'};
 const k=age%3;
 return {t:['It’s the same: you only poured it.','The same: it’s taller but thinner.','The same: pour it back and you’ll see.'][k],ok:true,why:['Identity','Compensation','Reversibility'][k]+': one of the three reasons Piaget heard from children who conserve.'};
}
SCENE({id:'conservation',name:'Conservation of liquid',tag:'Taller is not more',
 definition:'Conservation is understanding that an amount stays the same when only its appearance changes, as when water is poured into a glass of a different shape.',
 example:'Pour the same water into a tall, thin glass. Many 4- and 5-year-olds say the tall glass has more; most 7- and 8-year-olds say it is the same, because you only poured it.',
 desc:'Two glasses with the same water, one wider and one narrower, beside a child’s answer that changes with the child’s age.',
 research:['Piaget & Szeminska (1941/1952). The Child’s Conception of Number. Routledge & Kegan Paul.','Piaget (1952) placed conservation at the start of the concrete-operational stage, around age 7. Later work found the age depends strongly on how the question is asked (next scene).'],
 dur:10,hint:'Change the width of the second glass and the child’s age, and read what the child says and why.',
 init:()=>({w:62,age:5}),
 watch(p){return {w:p<.2?80:Math.round(lerp(80,62,smooth((p-.2)/.25))),age:p<.65?5:8}},
 ui:[{range:'w',label:'Second glass width',min:62,max:130,step:2,get:s=>s.w,act:'w'},{range:'age',label:'Child’s age',min:4,max:9,step:1,get:s=>s.age,act:'age',show:v=>v+' years'},{b:'Same glass again',act:'same'}],
 on:{w(s,v){s.w=v},age(s,v){s.age=v},same(s){s.w=80}},
 draw(s){
  const h=D7_V/(s.w*s.w);let out=heading('The same water in two glasses');
  out+=D7_glass(105,290,80,110,'first glass')+D7_glass(240,290,s.w,h,'after pouring');
  out+=TF(172,330,`water heights: 110 and ${Math.round(h)}`,13,C.muted);
  const a=D7_childSays(s.age,s.w);
  out+=D7_person(400,300,C.purple,1.3)+TBF(400,328,`age ${s.age}`,14,C.purple);
  out+=D7_bubble(340,70,240,96,392,234,'#fff',a.ok?C.green:C.coral)+D7_para(352,96,'“'+a.t+'”',27,15,C.ink,'start',21);
  out+=D7_para(432,206,a.why,22,13,a.ok?C.green:C.coral,'start',17);
  out+=T(300,362,a.ok?'Conserves: the amount is judged by what was done, not by how it looks':'Does not conserve yet: the amount is judged by how the water looks',15,C.ink);
  return {svg:out,phase:a.ok?'The child reasons about what was done to the water, so the change of shape does not change the amount.':'Piaget called this centration: the child attends to the most striking dimension, height, and ignores the compensating width.'};
 }});

const D7_MD=[['Experimenter spreads the row on purpose',16],['A “naughty teddy” spreads it by accident',62]];
SCENE({id:'conservation-number',name:'The naughty teddy',tag:'How the question is asked',
 definition:'A version of Piaget’s number task in which the row of counters is disturbed by accident rather than on purpose, which changes how many children conserve.',
 example:'When the experimenter deliberately spreads one row, only about one child in six aged 4–6 says the rows still match. When a toy teddy messes it up “by accident”, about six in ten do.',
 desc:'Two rows of six counters, one row spread out, with bars for the proportion of children who said the numbers were still the same in each version.',
 research:['McGarrigle & Donaldson (1974). Conservation accidents. Cognition 3, 341–350 (80 children aged 4–6).','Donaldson (1978). Children’s Minds. Moore & Frye (1986) argued that some children may simply miss the change when the teddy makes it.'],
 dur:10,hint:'Choose who spreads the row and how far, then compare the two versions.',
 init:()=>({who:'teddy',spread:6}),
 watch(p){return {who:p<.5?'adult':'teddy',spread:Math.round(10*smooth((p%.5)/.3))}},
 ui:[{choose:[['adult','Experimenter, on purpose'],['teddy','Teddy, by accident']],label:'Who spreads the row',get:s=>s.who,act:'who'},{range:'spread',label:'Spread',min:0,max:10,step:1,get:s=>s.spread,act:'spread'}],
 on:{who(s,v){s.who=v},spread(s,v){s.spread=v}},
 draw(s){
  let out=heading('Are there still the same number?');
  const gap=40+s.spread*5,w0=5*40,w1=5*gap,x0=270-w0/2,x1=270-w1/2;
  for(let i=0;i<6;i++){out+=Ci(x0+i*40,80,13,C.blue)+Ci(x1+i*gap,135,13,C.coral)}
  out+=TF(30,85,'row 1',13,C.muted,'start')+TF(30,140,'row 2',13,C.muted,'start');
  if(s.who==='teddy'){const tx=540,ty=128;out+=Ci(tx-14,ty-26,8,'#b07a4a')+Ci(tx+14,ty-26,8,'#b07a4a')+Ci(tx,ty-12,20,'#c48a55')+Ci(tx,ty+26,22,'#c48a55')+Ci(tx-7,ty-15,2.5,C.ink)+Ci(tx+7,ty-15,2.5,C.ink)+TF(tx,ty+66,'naughty teddy',13,C.muted)}
  else out+=D7_person(545,160,C.ink,1.1)+TF(545,184,'experimenter',13,C.muted);
  out+=TBF(30,212,'Children who said “the same” (McGarrigle & Donaldson 1974)',14,C.ink,'start');
  D7_MD.forEach(([l,v],i)=>{const y=232+i*46,on=(i===1)===(s.who==='teddy');out+=TF(30,y+4,l,13,on?C.ink:C.muted,'start')+D7_hbar(30,y+12,440,16,v,on?(i?C.green:C.coral):C.line,'about '+v+'%')});
  out+=T(300,362,s.who==='teddy'?'An accident makes the question sound innocent: many more children conserve':'A deliberate change hints that the answer should change too',15,C.ink);
  return {svg:out,phase:s.who==='teddy'?'With the teddy, the question no longer implies that something important happened. Many children who “failed” Piaget’s version show they can conserve number.':'Asking the same question twice, after deliberately changing something, may suggest to a child that a new answer is expected. Children are reading the social situation as well as the counters.'};
 }});

const D7_EP=[['Parent and infant come into the room','PI'],['Infant explores; parent sits nearby','PI'],['A stranger comes in and talks','PIS'],['Parent leaves: first separation','IS'],['Parent returns: first reunion','PI'],['Parent leaves the infant alone','I'],['Stranger comes back','IS'],['Parent returns: second reunion','PI']];
const D7_CLS={A:['Avoidant','Ignores or turns away from the parent on reunion; shows little distress when left.'],B:['Secure','Upset when left, seeks contact on reunion, is soon comforted and goes back to play.'],C:['Resistant','Very upset; seeks contact on reunion but also resists it, and is hard to settle.']};
const D7_ATT={USA:[21,65,14],'Great Britain':[22,75,3],Germany:[35,57,8],Japan:[5,68,27],Israel:[7,64,29]};
SCENE({id:'conservation-attachment',name:'The Strange Situation',tag:'Separation and reunion',
 definition:'A standard laboratory procedure of eight short episodes in which a one-year-old is twice separated from and reunited with a parent; the reunions are used to classify attachment.',
 example:'On the parent’s return, a securely attached infant goes to the parent, is comforted and returns to play; an avoidant infant looks away.',
 desc:'A timeline of the eight episodes, the people in the room during the chosen episode, the reunion pattern for each attachment class, and the share of each class in several countries.',
 research:['Ainsworth, Blehar, Waters & Wall (1978). Patterns of Attachment. Erlbaum.','van IJzendoorn & Kroonenberg (1988). Cross-cultural patterns of attachment: a meta-analysis of the Strange Situation. Child Development 59, 147–156 (figures shown are approximate). Variation within countries was larger than between them.'],
 dur:12,hint:'Step through the eight episodes, choose an attachment pattern to see the reunion, and choose a country.',
 init:()=>({ep:4,cls:'B',country:'USA'}),
 watch(p){const ks=Object.keys(D7_ATT);return {ep:Math.min(7,Math.floor(p*8)),cls:['B','A','C'][Math.min(2,Math.floor(p*3))],country:ks[Math.min(4,Math.floor(p*5))]}},
 ui:[{b:'◀ Episode',act:'prev'},{b:'Episode ▶',act:'next'},{choose:[['A','Avoidant'],['B','Secure'],['C','Resistant']],label:'Pattern',get:s=>s.cls,act:'cls'},{choose:Object.keys(D7_ATT).map(k=>[k,k]),label:'Country',get:s=>s.country,act:'country'}],
 on:{prev(s){s.ep=Math.max(0,s.ep-1)},next(s){s.ep=Math.min(7,s.ep+1)},cls(s,v){s.cls=v},country(s,v){s.country=v},ep(s,v){s.ep=Number(v)}},
 draw(s,f,X){
  let out=heading('Eight episodes of about three minutes each',24);
  for(let i=0;i<8;i++){const x=36+i*68,on=i===s.ep,re=i===4||i===7;out+=hit(X,'ep',i,'Episode '+(i+1),R(x,38,62,30,on?C.blue:re?C.amberp:'#f1f5f7',on?'none':C.grid,6)+TBF(x+31,58,String(i+1),14,on?'#fff':C.ink))}
  out+=TF(300,90,`${s.ep+1}. ${D7_EP[s.ep][0]}`,14,C.ink);
  out+=R(30,102,270,150,'#f8fafb',C.grid,8);const who=D7_EP[s.ep][1];
  out+=R(130,222,70,10,C.amberp,'none',3)+TF(165,246,'toys',13,C.muted);
  if(who.includes('P'))out+=D7_person(80,226,C.purple,1.2)+TF(80,246,'parent',13,C.muted);
  if(who.includes('S'))out+=D7_person(255,226,C.muted,1.2)+TF(255,246,'stranger',13,C.muted);
  out+=Ci(who.includes('P')&&(s.ep===4||s.ep===7)&&s.cls!=='A'?112:165,206,11,C.coral)+TF(who.includes('P')&&(s.ep===4||s.ep===7)&&s.cls!=='A'?112:165,190,'infant',13,C.coral);
  const reunion=s.ep===4||s.ep===7,c=D7_CLS[s.cls];
  out+=R(316,102,264,150,reunion?C.amberp:'#fff',C.grid,8)+TBF(330,126,reunion?`Reunion · ${c[0]} pattern`:`${c[0]} pattern`,14,C.ink,'start');
  out+=D7_para(330,150,reunion?c[1]:'The reunions (episodes 5 and 8) are the key moments. '+c[1],34,13,C.ink,'start',18);
  const d=D7_ATT[s.country];let x=120;const cols=[C.amber,C.green,C.coral];
  out+=TBF(30,284,s.country,14,C.ink,'start');
  d.forEach((v,i)=>{const w=v*4.4;out+=R(x,270,w,22,cols[i],'none',0)+(v>=6?TBF(x+w/2,286,v+'%',13,'#fff'):'');x+=w});
  out+=TF(120,312,'avoidant',13,C.amber,'start')+TF(300,312,'secure',13,C.green)+TF(560,312,'resistant',13,C.coral,'end');
  out+=T(300,350,'Most infants everywhere are classed as secure; the other patterns vary by place',15,C.ink);
  return {svg:out,phase:`${s.country}: about ${d[0]}% avoidant, ${d[1]}% secure, ${d[2]}% resistant. The procedure was designed in Baltimore; in places where infants are rarely left with strangers, the same separation may be far more stressful, so the categories do not mean quite the same thing everywhere.`};
 }});

const D7_DOLL=[['“Give me the doll you like to play with best”',67,32],['“Give me the doll that is a nice doll”',59,38],['“Give me the doll that looks bad”',17,59],['“Give me the doll that is a nice colour”',60,38]];
SCENE({id:'conservation-dolls',name:'The doll studies',tag:'Children and race',
 definition:'Kenneth and Mamie Phipps Clark asked Black children aged 3 to 7 to choose between a white doll and a brown doll in answer to simple questions, to study how segregation shaped their sense of self.',
 example:'In 1947, about two-thirds of the 253 children chose the white doll as the one they would like to play with best, and most chose the brown doll as the one that “looks bad”.',
 desc:'Paired bars for four of the Clarks’ questions, showing the share of children who chose the white or the brown doll.',
 research:['Clark & Clark (1947). Racial identification and preference in Negro children. In Newcomb & Hartley (eds), Readings in Social Psychology. Holt.','Cited in Brown v. Board of Education (1954), footnote 11. Hraba & Grant (1970) found most Black children in Lincoln, Nebraska, preferred the Black doll.'],
 dur:10,hint:'Choose a question to highlight it. Read the note on what the method can and cannot show.',
 init:()=>({q:0}),
 watch(p){return {q:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:[['0','Play with'],['1','Nice doll'],['2','Looks bad'],['3','Nice colour']],label:'Question',get:s=>String(s.q),act:'q'}],
 on:{q(s,v){s.q=Number(v)}},
 draw(s){
  let out=heading('Which doll? Black children aged 3–7, 1947 (n = 253)',24);
  out+=Ci(470,56,10,'#f1d9c4')+R(460,68,20,26,'#f1d9c4','none',6)+TF(500,84,'white doll',13,C.muted,'start');
  out+=Ci(470,112,10,'#7a4a2e')+R(460,124,20,26,'#7a4a2e','none',6)+TF(500,140,'brown doll',13,C.muted,'start');
  D7_DOLL.forEach(([q,w,b],i)=>{const y=58+i*66,on=i===s.q;
   out+=TF(30,y,q,13,on?C.ink:C.muted,'start');
   out+=D7_hbar(30,y+8,300,16,w,on?'#d8b291':C.line,w+'%')+D7_hbar(30,y+28,300,16,b,on?'#7a4a2e':C.line,b+'%')});
  out+=R(30,326,540,40,'#f6f9fb','none',8)+D7_para(42,344,'A forced choice between two dolls shows preference under one set of conditions, not self-esteem; results changed as times changed.',84,13,C.ink,'start',17);
  return {svg:out,phase:'The Clarks’ work grew out of Mamie Phipps Clark’s master’s research at Howard University. It was cited by the US Supreme Court in 1954 as evidence that segregation harmed children. Later studies questioned the method and found different choices after the civil-rights era.'};
 }});

/* =========================== theory-of-mind =========================== */
const D7_SA=['Sally puts her marble in the basket.','Sally goes out for a walk.','While she is away, Anne moves the marble to the box.','Sally comes back. She wants her marble.','Where will Sally look first?','What children answered (Baron-Cohen et al. 1985)'];
SCENE({id:'theory-of-mind',name:'Sally and Anne',tag:'A false belief',
 definition:'Theory of mind is the ability to think about what others believe, want and know, including beliefs that differ from what is actually true.',
 example:'Sally did not see Anne move the marble, so Sally still believes it is in the basket. Saying “the basket” shows you can reason about her false belief.',
 desc:'A six-step story with a basket, a box, two dolls and a marble, ending with the question of where Sally will look and the answers of three groups of children.',
 research:['Wimmer & Perner (1983). Beliefs about beliefs. Cognition 13, 103–128.','Baron-Cohen, Leslie & Frith (1985). Does the autistic child have a “theory of mind”? Cognition 21, 37–46. Later critiques: Milton (2012), the double empathy problem; Gernsbacher & Yergeau (2019).'],
 dur:12,hint:'Step through the story. At step 5, press the basket or the box to answer, then see what children said.',
 init:()=>({fr:0,ans:null}),
 watch(p){const fr=Math.min(5,Math.floor(p*6));return {fr,ans:fr>=4&&p>.75?'basket':null}},
 ui:[{b:'◀ Back',act:'back'},{b:'Next ▶',act:'next'},{b:'Answer: basket',act:'basket'},{b:'Answer: box',act:'box'}],
 on:{back(s){s.fr=Math.max(0,s.fr-1)},next(s){s.fr=Math.min(5,s.fr+1)},ans(s,v){s.ans=v==='box'?'box':'basket';s.fr=Math.max(s.fr,4)},box(s){s.ans='box';s.fr=Math.max(s.fr,4)},basket(s){s.ans='basket';s.fr=Math.max(s.fr,4)}},
 draw(s,f,X){
  let out=heading(`${Math.min(s.fr,5)+1}. ${D7_SA[s.fr]}`,26);
  if(s.fr<5){
   const inBox=s.fr>=2;
   out+=R(20,250,560,6,C.grid,'none',2);
   const basket=P('M140 205L150 248L210 248L220 205Z',C.amber,2.5,C.amberp)+P('M150 205Q180 170 210 205',C.amber,2.5);
   const boxS=R(330,205,80,43,'#d7e7f3',C.blue,4)+L(330,215,410,215,C.blue,2);
   out+=hit(X,'ans','basket','The basket',G(basket))+TF(180,274,'basket',13,C.muted);
   out+=hit(X,'ans','box','The box',G(boxS))+TF(370,274,'box',13,C.muted);
   out+=Ci(inBox?370:180,inBox?230:228,8,C.coral);
   if(s.fr===2)out+=curveArrow(190,200,360,200,-60,C.coral,2);
   const sallyX=s.fr===0?100:s.fr===1?545:s.fr>=3?480:545;
   if(s.fr!==1&&s.fr!==2)out+=D7_person(sallyX,248,C.coral,1.4)+TF(sallyX,290,'Sally',13,C.coral);
   else out+=R(520,120,60,130,'#f1f5f7',C.grid,4)+TF(550,112,'door',13,C.muted)+TF(550,290,'Sally is out',13,C.coral);
   out+=D7_person(s.fr===2?440:270,248,C.blue,1.4)+TF(s.fr===2?440:270,290,'Anne',13,C.blue);
   if(s.fr>=3&&s.ans){out+=D7_bubble(420,52,150,64,470,188,'#fff',C.coral)+TF(495,80,'“My marble is',13,C.ink)+TF(495,98,'in the basket.”',13,C.ink)}
   if(s.fr===4&&!s.ans)out+=T(300,330,'Press the basket or the box',16,C.blue);
   if(s.ans)out+=T(300,330,s.ans==='basket'?'Right: she did not see the move, so she believes it is still in the basket':'That is where the marble is, but Sally does not know it moved',15,s.ans==='basket'?C.green:C.coral);
  }else{
   const g=[['Typically developing, about 4½ years (n = 27)',85],['Down syndrome (n = 14)',86],['Autistic children (n = 20)',20]];
   g.forEach(([l,v],i)=>{const y=74+i*62;out+=TF(40,y,l,13,C.ink,'start')+D7_hbar(40,y+10,420,20,v,i===2?C.amber:C.green,v+'% said basket')});
   if(s.ans)out+=TF(40,274,`Your answer: ${s.ans}`,14,s.ans==='basket'?C.green:C.coral,'start');
   out+=R(30,288,540,72,'#f6f9fb','none',8)+D7_para(42,308,'Many autistic people pass such tasks, and misunderstanding runs both ways between autistic and non-autistic people. A single failed test does not show a missing ability.',84,13,C.ink,'start',18);
  }
  return {svg:out,phase:s.fr<4?'Follow what Sally saw, not where the marble really is.':s.fr===4?'Most adults answer “basket” at once. Most 3-year-olds answer “box”, where the marble really is.':'In 1985 most autistic children in the study said “box”. The authors proposed a specific difficulty with theory of mind; later research and autistic scholars have challenged how far that explanation goes.'};
 }});

const D7_tomP=m=>1/(1+Math.exp(-(m-44)/7));
SCENE({id:'theory-of-mind-age',name:'When children pass',tag:'A curve with age',
 definition:'Across many studies, the proportion of children who pass false-belief tasks rises steeply between about 3 and 5 years of age.',
 example:'At 3 years (36 months) most children fail; by about 44 months half pass; by 5 years most pass.',
 desc:'A rising curve of the percentage of children passing a false-belief test against age in months, with groups of simulated children tested at chosen ages.',
 research:['Wellman, Cross & Watson (2001). Meta-analysis of theory-of-mind development. Child Development 72, 655–684 (178 studies). The curve here is a logistic summary of that pattern, not their exact fit.','Callaghan et al. (2005): similar timing in Canada, India, Peru, Samoa and Thailand. Onishi & Baillargeon (2005) reported looking-time evidence at 15 months; several replications failed (Kulke et al. 2018).'],
 dur:10,hint:'Pick an age and test a class of 20 simulated children. Each press adds a point; the curve is the summary of real studies.',
 init:()=>({age:36,pts:[],n:0}),
 watch(p){const ages=[30,36,42,48,54,60,66],k=Math.min(7,Math.floor(p*8));const pts=[];for(let i=0;i<k;i++){const r=D7_rng(500+i);let c=0;for(let j=0;j<20;j++)if(r()<D7_tomP(ages[i]))c++;pts.push([ages[i],c*5])}return {age:ages[Math.max(0,k-1)],pts,n:k,sim:true}},
 ui:[{range:'age',label:'Age',min:30,max:72,step:3,get:s=>s.age,act:'age',show:v=>`${v} months (${fmt(v/12)} years)`},{b:'Test 20 children',act:'test'},{b:'Clear',act:'clear'}],
 on:{age(s,v){s.age=v},test(s){const r=D7_rng(900+s.n*7+s.age);let c=0;for(let j=0;j<20;j++)if(r()<D7_tomP(s.age))c++;s.pts.push([s.age,c*5]);s.n++;if(s.pts.length>24)s.pts.shift()},clear(s){s.pts=[]}},
 draw(s){
  let out=heading('Percentage passing a false-belief task, by age',26);
  const x0=70,y0=56,w=480,h=230,X=m=>x0+(m-12)/60*w,Y=v=>y0+h-v/100*h;
  out+=R(x0,y0,w,h,'#fff',C.grid,4);
  [0,25,50,75,100].forEach(v=>out+=L(x0,Y(v),x0+w,Y(v),C.grid,1)+TF(x0-8,Y(v)+4,v+'%',13,C.muted,'end'));
  [12,24,36,48,60,72].forEach(m=>out+=TF(X(m),y0+h+18,String(m),13,C.muted));
  out+=TF(x0+w/2,y0+h+38,'age in months',13,C.muted);
  out+=L(x0,Y(50),x0+w,Y(50),C.amber,1.5,'stroke-dasharray="6 5"')+TF(x0+w-6,Y(50)-6,'chance',13,C.amber,'end');
  const pts=[];for(let m=24;m<=72;m+=1)pts.push(fmt(X(m))+' '+fmt(Y(100*D7_tomP(m))));out+=P('M'+pts.join(' L'),C.blue,3);
  out+=TF(x0+10,y0+20,'blue curve: summary of studies',13,C.blue,'start');
  out+=Ci(X(15),Y(50),7,'none',C.purple,'stroke-dasharray="3 3" stroke-width="2"')+TF(X(15)+12,Y(50)+28,'looking-time tasks,',13,C.purple,'start')+TF(X(15)+12,Y(50)+45,'15 months: contested',13,C.purple,'start');
  out+=L(X(s.age),y0,X(s.age),y0+h,C.coral,1.5);
  s.pts.forEach(([m,v])=>out+=Ci(X(m),Y(v),6,C.coral,'#fff'));
  out+=T(300,350,`At ${s.age} months the summary curve gives about ${Math.round(100*D7_tomP(s.age))}% passing`,15,C.ink);
  return {svg:out,phase:(s.sim?'Simulated classes (Watch). ':'')+'Each class of 20 scatters around the curve, as real samples do. Simpler, non-verbal versions suggest some understanding earlier, but those infant findings have been hard to replicate.'};
 }});

const D7_UC=['A tube of sweets. What do you think is inside?','Open it: it is full of pencils!','Close the tube again.','Two questions'];
SCENE({id:'theory-of-mind-contents',name:'The surprising tube',tag:'Forgetting your own belief',
 definition:'The unexpected-contents task: a child sees a familiar sweets tube, learns it holds pencils, and is asked what they first thought was inside and what a friend will think.',
 example:'Many 3-year-olds say they always thought it held pencils, and that a friend will think so too; most 5-year-olds say “sweets” to both.',
 desc:'A closed and an opened tube, then a child’s answers to two questions, which change with age.',
 research:['Perner, Leekam & Wimmer (1987). Three-year-olds’ difficulty with false belief. British Journal of Developmental Psychology 5, 125–137.','Gopnik & Astington (1988). Children’s understanding of representational change. Child Development 59, 26–37.'],
 dur:10,hint:'Step through and choose the child’s age to see how the two answers change.',
 init:()=>({fr:0,age:3}),
 watch(p){return {fr:Math.min(3,Math.floor(p*5)),age:p<.85?3:5}},
 ui:[{b:'◀ Back',act:'back'},{b:'Next ▶',act:'next'},{choose:[['3','Age 3'],['4','Age 4'],['5','Age 5']],label:'Child’s age',get:s=>String(s.age),act:'age'}],
 on:{back(s){s.fr=Math.max(0,s.fr-1)},next(s){s.fr=Math.min(3,s.fr+1)},age(s,v){s.age=Number(v)}},
 draw(s){
  let out=heading(`${s.fr+1}. ${D7_UC[s.fr]}`,26);
  const open=s.fr===1;
  out+=R(80,90,90,190,'#f3c9d9',C.coral,14)+TBF(125,190,'SWEETS',14,C.coral,'middle','transform="rotate(-90 125 190)"');
  if(open){out+=R(80,62,90,24,'#fff',C.coral,8);for(let i=0;i<5;i++){const x=92+i*16;out+=R(x,40,9,70,i%2?C.amber:C.blue,'none',2)+P(`M${x} 40L${x+4.5} 30L${x+9} 40Z`,'none',0,'#e8d7b0')}}
  else out+=R(76,80,98,18,C.coral,'none',8);
  if(s.fr===3){
   const a=s.age===3?['Pencils.','Pencils.']:s.age===4?['Sweets… no, pencils.','Sweets.']:['Sweets!','Sweets — they haven’t seen inside.'];
   out+=D7_person(250,300,C.purple,1.3)+TBF(250,326,`age ${s.age}`,14,C.purple);
   out+=TF(300,90,'“What did you think was inside,',13,C.ink,'start')+TF(300,108,'before we opened it?”',13,C.ink,'start');
   out+=R(300,120,270,44,'#fff',a[0].startsWith('Pencils')?C.coral:C.green,10)+TF(316,148,a[0],14,C.ink,'start');
   out+=TF(300,196,'“What will your friend think is inside?”',13,C.ink,'start');
   out+=R(300,208,270,44,'#fff',a[1].startsWith('Pencils')?C.coral:C.green,10)+TF(316,236,a[1],14,C.ink,'start');
  }else out+=D7_para(230,150,s.fr===0?'Most children say “sweets”. So would you.':s.fr===1?'The tube is full of pencils.':'The tube looks just as it did at the start.',34,15,C.ink,'start',22);
  out+=T(300,362,s.fr<3?'Watch for the moment the child’s own earlier belief disappears':s.age===3?'Three-year-olds often report their old belief as if it had always been the new one':'Older children keep track of what they, and others, used to believe',15,C.ink);
  return {svg:out,phase:s.fr<3?'The same logic as Sally and Anne, but about the child’s own past belief.':'Gopnik and Astington found 3-year-olds struggle as much with their own past false belief as with another person’s, suggesting a general change in understanding how beliefs represent the world.'};
 }});

/* =========================== conformity =========================== */
function D7_lines(seed,i){const r=D7_rng(seed*31+i*7+3);const std=Math.round(70+r()*60),pos=Math.floor(r()*3);
 const d1=Math.round(18+r()*22),d2=Math.round(18+r()*22);let o=[std+(r()<.5?-d1:d1),std+(r()<.5?-d2:d2)];
 if(Math.abs(o[0]-o[1])<12)o[1]=std+(o[0]>std?-d2:d2);
 const comps=[];let k=0;for(let j=0;j<3;j++)comps.push(j===pos?std:clamp(o[k++],35,145));return {std,comps,correct:pos}}
function D7_cards(X,t,base,act,mark){
 let out=R(40,60,150,186,'#fff',C.grid,8)+L(115,base,115,base-t.std,C.ink,5)+TF(115,base+22,'standard',13,C.muted);
 out+=R(220,60,340,186,'#fff',C.grid,8);
 t.comps.forEach((len,j)=>{const x=290+j*100,col=mark&&mark(j)||C.ink;out+=hit(X,act,j,'Line '+'ABC'[j],R(x-36,64,72,190,'transparent','none',4)+L(x,base,x,base-len,col,5))+TBF(x,base+22,'ABC'[j],15,col)});
 return out}
SCENE({id:'conformity',name:'Asch’s lines',tag:'Judging alone, and in a group',
 definition:'Conformity is changing a judgement or behaviour to match a group. Solomon Asch measured it with an easy line-matching task in which a group of confederates gave a wrong answer.',
 example:'Alone, people matched the lines almost without error. Facing a unanimous wrong majority, about 37% of answers on critical trials went along with it; about a quarter of people never did.',
 desc:'A standard line beside three comparison lines. In Watch, a reconstructed group answers aloud in turn; in Try it you judge the lines alone and compare your error rate with Asch’s results.',
 research:['Asch (1951; 1956). Studies of independence and conformity: a minority of one against a unanimous majority. Psychological Monographs 70(9).','Friend, Rafferty & Bramel (1990). A puzzling misinterpretation of the Asch “conformity” study. European Journal of Social Psychology 20, 29–44.'],
 dur:12,hint:'Press the comparison line that matches the standard. You judge alone: no one here pretends to disagree. Nothing you do leaves this page.',
 init:()=>({seed:5,i:0,res:[]}),
 watch(p){return {sim:true,k:Math.min(8,Math.floor(p*10))}},
 ui:[{b:'Start again',act:'again'}],
 on:{pick(s,j){if(s.i>=8)return 'keep';const t=D7_lines(s.seed,s.i);s.res.push(Number(j)===t.correct);s.i++;return 'keep'},again(s){s.seed=nextSeed()%100000;s.i=0;s.res=[]}},
 draw(s,f,X){
  if(s.sim){
   const t={std:100,comps:[80,100,125],correct:1};let out=heading('A critical trial, reconstructed: seven confederates say “A”',24)+D7_cards(null,t,212,'x',j=>j===1?C.green:null);
   for(let j=0;j<8;j++){const x=70+j*66,me=j===6,said=j<s.k;out+=D7_person(x,330,me?C.blue:C.muted,.9);
    if(said)out+=TBF(x,270,me?'?':'A',16,me?C.blue:C.coral);}
   out+=TF(70+6*66,350,'participant',13,C.blue);
   out+=TF(300,370,'Correct answer: B. The real participant answered seventh of eight.',13,C.muted);
   return {svg:out,phase:s.k<7?'One after another, the confederates give the same wrong answer.':'Across critical trials, about 37% of answers went with the majority. About 25% of people never yielded, and most answers stayed independent.'};
  }
  let out=heading(s.i<8?`Trial ${s.i+1} of 8: which line matches the standard?`:'Your results beside Asch’s',24);
  if(s.i<8)out+=D7_cards(X,D7_lines(s.seed,s.i),212,'pick');
  else out+=R(40,60,520,170,'#f6f9fb','none',8)+D7_para(60,96,'Asch’s control participants, judging alone like you, made errors on under 1% of trials. With a unanimous wrong majority the same task produced errors on about 37% of critical trials. The lines were just as easy; the group was the difference.',62,14,C.ink,'start',21);
  const n=s.res.length,err=s.res.filter(x=>!x).length;
  const rows=[['You, alone',n?100*err/n:0,C.blue,n?`${err} of ${n} wrong`:'no trials yet'],['Asch, alone',.7,C.green,'under 1%'],['Asch, with a wrong majority',36.8,C.coral,'about 37%']];
  rows.forEach(([l,v,c,lab],i)=>{const y=262+i*30;out+=TF(40,y+13,l,13,C.ink,'start')+D7_hbar(240,y,240,18,v,c,lab)});
  return {svg:out,phase:s.i<8?'Judge each pair carefully; there is no time limit.':'Textbooks often say people “conformed”. In fact about two-thirds of answers on critical trials were independent: Asch’s own title spoke of independence.'};
 }});

const D7_ASZ=[[1,3],[2,13],[3,32],[4,35],[8,32],[15,31]];
SCENE({id:'conformity-size',name:'Size of the majority',tag:'Three is enough; one ally breaks it',
 definition:'In Asch’s variations, conformity rose sharply up to a majority of about three and then levelled off; a single partner who gave the right answer cut it to a fraction.',
 example:'One confederate produced almost no yielding; three produced about a third of answers going along; with one truthful partner, yielding fell to about 5%.',
 desc:'A row of people with the chosen majority size, and bars of the percentage of conforming answers for each size, with the effect of one dissenting partner.',
 research:['Asch (1955). Opinions and social pressure. Scientific American 193(5), 31–35.','Asch (1956), Psychological Monographs 70(9). Percentages are approximate readings of Asch’s reported results.'],
 dur:10,hint:'Choose the size of the wrong majority, and add a partner who gives the right answer.',
 init:()=>({n:3,partner:'0'}),
 watch(p){return {n:Math.min(5,Math.floor(p*6)),partner:p>.85?'1':'0'}},
 ui:[{choose:D7_ASZ.map((d,i)=>[String(i),d[0]===15?'10–15':String(d[0])]),label:'Wrong majority',get:s=>String(s.n),act:'n'},{choose:[['0','No partner'],['1','One truthful partner']],label:'Partner',get:s=>s.partner,act:'partner'}],
 on:{n(s,v){s.n=Number(v)},partner(s,v){s.partner=v}},
 draw(s){
  const [size,val]=D7_ASZ[s.n],partner=s.partner==='1';let out=heading(`${size===15?'10–15':size} giving the wrong answer${partner?', plus one ally':''}`,24);
  const people=size+1+(partner?1:0),sp=Math.min(48,520/people);
  for(let j=0;j<people;j++){const x=300-(people-1)*sp/2+j*sp,me=j===people-1,ally=partner&&j===people-2;out+=D7_person(x,120,me?C.blue:ally?C.green:C.muted,Math.min(1,sp/40))}
  out+=TF(300,146,'grey: wrong majority · green: truthful partner · blue: participant',13,C.muted);
  const x0=80,y0=170,h=140,bw=50;
  D7_ASZ.forEach(([n,v],i)=>{const x=x0+i*70,on=i===s.n&&!partner;out+=R(x,y0+h-v/40*h,bw,v/40*h,on?C.coral:C.line,'none',3)+TBF(x+bw/2,y0+h-v/40*h-6,v+'%',13,on?C.coral:C.muted)+TF(x+bw/2,y0+h+18,n===15?'10–15':String(n),13,C.muted)});
  const px=x0+6*70+10;out+=R(px,y0+h-5.5/40*h,bw,5.5/40*h,partner?C.green:C.line,'none',3)+TBF(px+bw/2,y0+h-5.5/40*h-6,'5.5%',13,partner?C.green:C.muted)+TF(px+bw/2,y0+h+18,'+ ally',13,C.muted);
  out+=TF(x0+210,y0+h+38,'size of the wrong majority',13,C.muted);
  out+=T(300,370,partner?'One ally restores confidence: conforming answers fall to about 5%':`About ${val}% of answers on critical trials went with the majority`,15,C.ink);
  return {svg:out,phase:partner?'Unanimity matters more than numbers. Even a partner who gave a different wrong answer reduced yielding in later studies.':'Beyond three or four people, adding more confederates added little.'};
 }});

SCENE({id:'conformity-culture',name:'Time, culture and the textbook story',tag:'A child of its time?',
 definition:'Replications of Asch’s study in many countries and decades show that the size of the effect depends on when, where and with whom it is run.',
 example:'A 1980 replication with British students found 1 conforming answer in 396 trials; a meta-analysis of 133 studies found more conformity in collectivist cultures and less in later US samples.',
 desc:'Three views: a declining trend over time in US studies, higher conformity in collectivist than individualist samples, and Asch’s own answers split into independent and conforming.',
 research:['Bond & Smith (1996). Culture and conformity: a meta-analysis of studies using Asch’s line judgment task. Psychological Bulletin 119, 111–137 (133 studies, 17 countries).','Perrin & Spencer (1980). The Asch effect: a child of its time? Bulletin of the BPS 33, 405–406. Henrich, Heine & Norenzayan (2010). The weirdest people in the world? BBS 33, 61–83.'],
 dur:12,hint:'Switch between the three views.',
 init:()=>({lens:'who'}),
 watch(p){return {lens:['time','culture','who'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['time','Over time'],['culture','Across cultures'],['who','Asch’s answers']],label:'View',get:s=>s.lens,act:'lens'}],
 on:{lens(s,v){s.lens=v}},
 draw(s){
  let out='';
  if(s.lens==='time'){
   out+=heading('US studies: conformity declined, 1952–1994',24)+R(70,60,460,220,'#fff',C.grid,4);
   out+=P('M90 110 C200 130 320 190 510 230',C.coral,3)+TF(520,84,'trend (illustrative shape)',13,C.coral,'end');
   ['1950s','1960s','1970s','1980s','1990s'].forEach((l,i)=>out+=TF(110+i*100,300,l,13,C.muted));
   out+=TF(80,78,'more conformity',13,C.muted,'start');
   out+=Ci(380,262,6,C.blue)+TF(372,258,'UK students, 1980: 1 in 396',13,C.blue,'end');
   out+=D7_para(40,328,'Bond & Smith found the effect fell over time in US samples. Perrin & Spencer (1981) later found Asch-like levels among young people on probation: who is tested matters.',86,13,C.ink,'start',18);
  }else if(s.lens==='culture'){
   out+=heading('Collectivist samples conformed more',24);
   [['Individualist samples',.45,C.blue],['Collectivist samples',.9,C.coral]].forEach(([l,v,c],i)=>{const x=150+i*200;out+=R(x,270-v*170,120,v*170,c,'none',4)+TF(x+60,292,l,13,C.ink)});
   out+=TF(300,316,'relative effect sizes, illustrative',13,C.muted);
   out+=D7_para(40,338,'Most psychology participants have been Western, educated and from rich democracies (WEIRD). Results from them may not hold elsewhere.',86,13,C.ink,'start',18);
  }else{
   out+=heading('Asch’s critical trials: most answers were independent',24);
   for(let i=0;i<100;i++){const x=110+(i%20)*19,y=70+Math.floor(i/20)*22;out+=R(x,y,15,15,i<37?C.coral:C.green,'none',3)}
   out+=TF(110,200,'each square: 1% of answers on critical trials',13,C.muted,'start');
   out+=TBF(110,232,'37% conforming',14,C.coral,'start')+TBF(490,232,'63% independent',14,C.green,'end');
   out+=D7_para(40,270,'About a quarter of participants never yielded, and only a few yielded on nearly every trial. Asch saw his results as evidence of independence under pressure; later retellings stressed the yielding.',84,14,C.ink,'start',20);
  }
  return {svg:out,phase:s.lens==='time'?'Conformity is not a fixed human constant: it shifts with the times and the people tested.':s.lens==='culture'?'Bond and Smith found that cultural values predicted conformity better than many features of the procedure.':'Friend, Rafferty and Bramel (1990) showed how textbooks turned a study of independence into a story of conformity.'};
 }});

/* =========================== obedience =========================== */
const D7_STOP=[[300,5],[315,4],[330,2],[345,1],[360,1],[375,1],[450,26]];
const D7_MAXV=(()=>{const a=[];D7_STOP.forEach(([v,n])=>{for(let i=0;i<n;i++)a.push(v)});return a})();
const D7_LAB=['Slight','Moderate','Strong','V. strong','Intense','Extreme','Danger','XXX'];
SCENE({id:'obedience',name:'Milgram’s shock board',tag:'Reconstructed, not re-run',
 definition:'Obedience is following the instructions of an authority. Stanley Milgram measured how far people would go when told to give increasingly strong electric shocks to a learner, who was in fact an actor receiving none.',
 example:'In the first study, all 40 men went to at least 300 volts, and 26 of them (65%) went to the final 450-volt switch. Students and psychiatrists had predicted almost no one would.',
 desc:'A board of 30 switches from 15 to 450 volts, 40 dots for the participants that grey out when each stopped, and the learner’s own guess beside the result.',
 research:['Milgram (1963). Behavioral study of obedience. Journal of Abnormal and Social Psychology 67, 371–378.','Baumrind (1964). Some thoughts on ethics of research: after reading Milgram’s “Behavioral study of obedience”. American Psychologist 19, 421–423.'],
 dur:12,hint:'First guess how many of 40 people went to 450 volts, then raise the voltage or press Reveal. Participants were deceived and many were distressed; this page only replays the published numbers.',
 init:()=>({v:0,guess:2,shown:false}),
 watch(p){return {v:Math.round(Math.min(450,p*1.15*450)/15)*15,guess:null,shown:p>.88}},
 ui:[{range:'guess',label:'Your guess: reach 450 V',min:0,max:40,step:1,get:s=>s.guess,act:'guess',show:v=>v+' of 40'},{range:'v',label:'Voltage',min:0,max:450,step:15,get:s=>s.v,act:'v',show:v=>v+' V'},{b:'Reveal result',act:'reveal'}],
 on:{guess(s,v){s.guess=v},v(s,v){s.v=v;if(v>=450)s.shown=true},reveal(s){s.v=450;s.shown=true}},
 draw(s){
  let out=heading('Shock generator, 15 to 450 volts (1963 baseline)',24);
  for(let i=0;i<30;i++){const x=30+i*18.2,v=15*(i+1),on=v<=s.v;out+=R(x,42,14,24,on?(v>300?C.coral:C.amber):'#f1f5f7',C.line,3)}
  D7_LAB.forEach((l,i)=>out+=TF(30+i*4*18.2+(i===7?14:34),i%2?100:84,l,13,i>=6?C.coral:C.muted));
  const going=D7_MAXV.filter(m=>m>=s.v).length;
  for(let i=0;i<40;i++){const x=46+(i%10)*28,y=130+Math.floor(i/10)*30,on=D7_MAXV[i]>=s.v;out+=Ci(x,y,10,on?C.blue:'#dfe6ea')}
  out+=TBF(172,262,`${going} of 40 still continuing at ${s.v} V`,14,C.ink);
  out+=R(330,120,250,150,'#f6f9fb','none',8);
  out+=TF(344,144,s.guess===null?'Predictions before the study:':`Your guess: ${s.guess} of 40`,14,C.ink,'start');
  out+=TF(344,168,'Yale seniors: about 1% (0.5 of 40)',13,C.muted,'start')+TF(344,188,'Psychiatrists: about 1 in 1,000',13,C.muted,'start');
  out+=s.shown?TBF(344,222,'Result: 26 of 40 (65%)',15,C.coral,'start')+TF(344,246,'all 40 reached 300 V',13,C.coral,'start'):TF(344,222,'Result hidden until 450 V',13,C.muted,'start');
  out+=R(30,288,550,64,'#fff4ec','none',8)+D7_para(42,308,'The “learner” was an actor and no shocks were given, but participants believed they might be. Many sweated, trembled or laughed nervously. Studies like this led to modern ethics review.',80,13,C.ink,'start',18);
  return {svg:out,phase:'The first people stopped at 300 volts, when the learner pounded on the wall. Milgram’s conclusion was not that people are cruel, but that ordinary people can be drawn into harmful acts by a situation and an authority.'};
 }});

const D7_VAR=[['Learner in another room (baseline)',65,'The 1963 set-up: the learner is heard only pounding on the wall.'],['Learner’s voice heard',62.5,'Protests and screams are heard through the wall.'],['Learner in the same room',40,'Seeing the learner’s suffering lowers obedience.'],['Teacher must hold his hand on plate',30,'Physical contact lowers it further.'],['Orders given by telephone',20.5,'An absent authority loses much of its pull.'],['Run-down office, Bridgeport',47.5,'Away from Yale’s prestige, obedience falls a little.'],['Two peers refuse to go on',10,'Seeing others defy the experimenter frees people to stop.'],['An ordinary man gives the orders',20,'Without a scientist’s authority, few continue.'],['Women as teachers',65,'The same rate as men, though women reported more stress.']];
SCENE({id:'obedience-variations',name:'Milgram’s variations',tag:'Obedience depends on the situation',
 definition:'Milgram ran many versions of the procedure, changing one feature at a time, and found that the proportion going to 450 volts ranged from about 10% to 65%.',
 example:'Moving the learner into the same room cut full obedience from 65% to 40%; when two other “teachers” refused, only 10% continued.',
 desc:'Horizontal bars for the percentage of participants who went to 450 volts in nine versions, with the average over all versions marked.',
 research:['Milgram (1974). Obedience to Authority: An Experimental View. Harper & Row.','Haslam, Loughnan & Perry (2014). Meta-Milgram: an empirical synthesis of the obedience experiments. PLoS ONE 9(4), e93927 (mean across conditions about 44%).'],
 dur:12,hint:'Press a version, or step through them, to read what changed.',
 init:()=>({i:0}),
 watch(p){return {i:Math.min(8,Math.floor(p*9))}},
 ui:[{b:'◀ Previous',act:'prev'},{b:'Next ▶',act:'next'}],
 on:{prev(s){s.i=(s.i+8)%9},next(s){s.i=(s.i+1)%9},pick(s,v){s.i=Number(v)}},
 draw(s,f,X){
  let out=heading('Went all the way to 450 volts',24);
  const x0=270,w=250;
  out+=L(x0+w*.436,40,x0+w*.436,312,C.purple,1.5,'stroke-dasharray="5 4"')+TF(x0+w*.436+4,50,'average of all versions, 44%',13,C.purple,'start');
  D7_VAR.forEach(([l,v],i)=>{const y=60+i*28,on=i===s.i;out+=hit(X,'pick',i,l,R(20,y-2,560,24,on?C.pale:'transparent','none',4)+TF(30,y+14,l,13,on?C.ink:C.muted,'start')+D7_hbar(x0,y+2,w,16,v,on?C.coral:C.line,v+'%'))});
  out+=T(300,350,D7_VAR[s.i][2],15,C.ink);
  return {svg:out,phase:'The same people would have behaved very differently in a different version. Obedience was a property of the situation, especially the authority’s presence and legitimacy, as much as of the person.'};
 }});

const D7_PRODS=['“Please continue.”','“The experiment requires that you continue.”','“It is absolutely essential that you continue.”','“You have no other choice, you must go on.”'];
SCENE({id:'obedience-critiques',name:'What the archives showed',tag:'Second looks at famous studies',
 definition:'Later analyses of Milgram’s archives and of the Stanford Prison Experiment questioned what the studies measured, and how much the people running them shaped the results.',
 example:'In a partial replication, every participant who heard the only real order, “You have no other choice, you must go on”, refused to continue.',
 desc:'Three views: Milgram’s four prods and how people responded to them, how many participants believed the shocks were real, and problems with the Stanford Prison Experiment.',
 research:['Burger (2009). Replicating Milgram: would people still obey today? American Psychologist 64, 1–11. Burger, Girgis & Manning (2011), Social Psychological and Personality Science 2, 460–466.','Perry (2012). Behind the Shock Machine. Haslam & Reicher (2012), PLoS Biology 10(11). Le Texier (2019). Debunking the Stanford Prison Experiment. American Psychologist 74, 823–839.'],
 dur:12,hint:'Switch between the three views.',
 init:()=>({lens:'prods'}),
 watch(p){return {lens:['prods','belief','prison'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['prods','The four prods'],['belief','Did they believe?'],['prison','Stanford prison']],label:'View',get:s=>s.lens,act:'lens'}],
 on:{lens(s,v){s.lens=v}},
 draw(s){
  let out='';
  if(s.lens==='prods'){
   out+=heading('Milgram’s prods, in order',24);
   D7_PRODS.forEach((p,i)=>{const y=50+i*44;out+=R(40+i*20,y,400,34,i===3?C.coralp:C.pale,'none',6)+TF(54+i*20,y+22,`${i+1}. ${p}`,14,C.ink,'start')});
   out+=TF(500,236,'only prod 4 is an order:',13,C.coral,'end')+TF(500,254,'no one obeyed it (2011)',13,C.coral,'end');
   out+=TBF(40,272,'Continued past 150 volts',14,C.ink,'start');
   out+=TF(40,296,'Milgram 1963 (voice condition)',13,C.ink,'start')+D7_hbar(280,284,220,16,82.5,C.amber,'82.5%');
   out+=TF(40,322,'Burger 2009 (stopped at 150 V)',13,C.ink,'start')+D7_hbar(280,310,220,16,70,C.coral,'70%');
   out+=TF(40,358,'People went on when persuaded the research was worthwhile, not when simply ordered.',13,C.muted,'start');
  }else if(s.lens==='belief'){
   out+=heading('Did participants believe the shocks were real?',24);
   const b=[['Fully believed',56,C.coral],['Believed, with some doubts',24,C.amber],['Had real doubts',11,C.blue],['Thought probably not',6,C.purple],['Sure there were none',3,C.muted]];
   let x=40;b.forEach(([l,v,c])=>{out+=R(x,60,v*5.2,34,c,'none',0)+(v>=6?TBF(x+v*2.6,82,v+'%',13,'#fff'):'');x+=v*5.2});
   b.forEach(([l,v,c],i)=>out+=R(40,118+i*24,14,14,c,'none',3)+TF(62,130+i*24,`${l} (${v}%)`,13,C.ink,'start'));
   out+=TF(40,262,'Milgram’s follow-up questionnaire (1974), rounded',13,C.muted,'start');
   out+=D7_para(40,290,'Gina Perry’s archive work found the experimenter often improvised beyond the script, and reported an unpublished analysis suggesting that those who fully believed were more likely to stop.',86,13,C.ink,'start',18);
  }else{
   out+=heading('The Stanford Prison Experiment (1971)',24);
   const cards=[['What is claimed','Ordinary students given the role of guards became cruel within days; the study was stopped after six of a planned fourteen days.'],['What later work found','Guards were briefed and encouraged to be tough. Students who read the set-up could guess what was expected (Banuazizi & Movahedi 1975).'],['A different design','The BBC Prison Study (Reicher & Haslam 2006) found guards did not drift into tyranny without leadership and shared identity.']];
   cards.forEach(([t,b],i)=>{const x=24+i*188;out+=R(x,48,176,250,i?'#f6f9fb':C.coralp,'none',8)+TBF(x+12,74,t,14,C.ink,'start')+D7_para(x+12,100,b,22,13,C.ink,'start',18)});
   out+=TF(300,330,'With no control group, the study could not show what caused the guards’ behaviour.',13,C.muted);
  }
  return {svg:out,phase:s.lens==='prods'?'Haslam and Reicher argue for “engaged followership”: people continued because they identified with the scientist’s goals, not because they blindly obeyed.':s.lens==='belief'?'If many participants doubted the deception, the results measure something more complicated than obedience to a believed harm.':'Demand characteristics: when participants can tell what the experimenter hopes to see, they may act it out.'};
 }});

/* =========================== cognitive-dissonance =========================== */
const D7_COG=[['Smoking causes cancer',5,'against'],['It costs a lot',2,'against'],['I enjoy it',3,'for'],['It calms me down',2,'for'],['Grandad smoked and lived to 90',1,'for'],['The risks are exaggerated',2,'for']];
// After quitting, the pull of the old pleasures fades (importance 1).
const D7_imp=(s,i)=>i===0?s.risk:s.quit&&D7_COG[i][2]==='for'?1:D7_COG[i][1];
function D7_dis(s){let d=0,c=0;D7_COG.forEach(([l,w,side],i)=>{if(!s.on[i])return;const imp=D7_imp(s,i);const dissonant=s.quit?side==='for':side==='against';if(dissonant)d+=imp;else c+=imp});return {d,c,m:d+c?d/(d+c):0}}
SCENE({id:'cognitive-dissonance',name:'Dissonance and its reduction',tag:'Changing the mind to fit the act',
 definition:'Cognitive dissonance is the discomfort of holding beliefs that conflict with each other or with what you do. Festinger proposed that people reduce it by changing a behaviour, changing a belief, or adding new beliefs.',
 example:'A smoker who knows that smoking causes cancer can quit, decide the risk is exaggerated, or remember a grandfather who smoked and lived to 90.',
 desc:'The thought “I smoke” linked to beliefs that clash with it or support it, each weighted by importance, with a gauge for the proportion that clash.',
 research:['Festinger (1957). A Theory of Cognitive Dissonance. Stanford University Press: magnitude grows with the number and importance of dissonant elements relative to consonant ones.'],
 dur:12,hint:'Press beliefs to switch them on or off, or try the three ways to reduce dissonance.',
 init:()=>({on:[1,1,1,1,0,0],risk:5,quit:false}),
 watch(p){return p<.25?{on:[1,1,1,1,0,0],risk:5,quit:false}:p<.5?{on:[1,1,1,1,1,1],risk:5,quit:false}:p<.75?{on:[1,1,1,1,1,1],risk:2,quit:false}:{on:[1,1,1,1,0,0],risk:5,quit:true}},
 ui:[{b:'Add excuses',act:'excuse'},{b:'Play down the risk',act:'trivial'},{b:'Quit smoking',act:'quit'}],
 on:{tog(s,i){i=Number(i);s.on[i]=s.on[i]?0:1},excuse(s){s.on[4]=1;s.on[5]=1},trivial(s){s.risk=s.risk>2?2:5},quit(s){s.quit=!s.quit},reset(s){s.on=[1,1,1,1,0,0];s.risk=5;s.quit=false}},
 draw(s,f,X){
  const r=D7_dis(s);let out=heading('Beliefs around a behaviour',24);
  out+=R(220,44,160,40,C.ink,'none',8)+TBF(300,70,s.quit?'I have quit':'I smoke',16,'#fff');
  const left=[],right=[];D7_COG.forEach((c,i)=>{const dissonant=s.quit?c[2]==='for':c[2]==='against';(dissonant?left:right).push(i)});
  const chip=(i,x,y,dis)=>{const on=!!s.on[i],imp=D7_imp(s,i),col=dis?C.coral:C.green;
   return L(x+(x<300?250:0),y+16,300,84,on?col:C.grid,1.5,on?'':'stroke-dasharray="4 4"')+hit(X,'tog',i,D7_COG[i][0]+(on?', on':', off'),R(x,y,250,32,on?(dis?C.coralp:C.greenp):'#fff',on?col:C.grid,8)+TF(x+10,y+21,D7_COG[i][0],13,on?C.ink:C.muted,'start')+TBF(x+240,y+21,'●'.repeat(imp),11,on?col:C.line,'end'))};
  out+=TBF(30,112,'Clash (dissonant)',14,C.coral,'start')+TBF(570,112,'Fit (consonant)',14,C.green,'end');
  left.forEach((i,k)=>out+=chip(i,22,124+k*40,true));right.forEach((i,k)=>out+=chip(i,328,124+k*40,false));
  out+=TF(300,296,'dots show importance',13,C.muted);
  out+=R(100,312,400,20,'#f1f5f7','none',6)+R(100,312,400*r.m,20,C.coral,'none',6)+TBF(300,352,`Dissonance: ${Math.round(r.m*100)}% of the weight clashes`,15,C.coral);
  return {svg:out,phase:s.quit?'Quitting turns the health facts into support for the new behaviour. Only the missed pleasures still clash, and their pull fades.':s.risk<5?'Playing down the risk lowers its importance, so the clash weighs less.':'Adding excuses does not remove the clash; it dilutes it with more consonant beliefs.'};
 }});

const D7_FC=[['control','No payment, no lie',-0.45],['1','Paid $1 to say it was fun',1.35],['20','Paid $20 to say it was fun',-0.05]];
SCENE({id:'cognitive-dissonance-compliance',name:'One dollar or twenty',tag:'Insufficient justification',
 definition:'In the induced-compliance paradigm, people are led to say something they do not believe. Dissonance theory predicts that the smaller the reward, the more they change their belief to match what they said.',
 example:'Students who were paid $1 to tell the next person a boring task was fun later rated it as more enjoyable than students paid $20.',
 desc:'A board of pegs being turned, beside bars for how enjoyable the task was rated in each condition on a scale from −5 to +5.',
 research:['Festinger & Carlsmith (1959). Cognitive consequences of forced compliance. Journal of Abnormal and Social Psychology 58, 203–210.','Bem (1967) offered self-perception as an alternative explanation. Vaidis et al. (2024), a large multilab replication of an induced-compliance paradigm, found no reliable attitude change.'],
 dur:10,hint:'Choose a condition. The ratings are the published means from 1959; read the replication note.',
 init:()=>({c:'1'}),
 watch(p){return {c:['control','1','20'][Math.min(2,Math.floor(p*3))],turn:p}},
 ui:[{choose:D7_FC.map(c=>[c[0],c[0]==='control'?'Control':'$'+c[0]]),label:'Condition',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=v}},
 draw(s){
  let out=heading('How enjoyable was the boring task? (1959)',24);
  out+=R(30,50,180,180,'#f3e6d4',C.amber,8);const a=(s.turn||0)*720;
  for(let i=0;i<16;i++){const x=58+(i%4)*42,y=78+Math.floor(i/4)*42,ang=(a+i*0)%360;out+=R(x-9,y-9,18,18,'#c9a26e',C.amber,3,`transform="rotate(${fmt(ang/4)} ${x} ${y})"`)}
  out+=TF(120,252,'an hour turning pegs',13,C.muted);
  const x0=240,zx=x0+170,sc=30;
  out+=L(zx,48,zx,232,C.ink,1.5)+TF(zx,250,'0',13,C.muted)+TF(zx-150,250,'−5',13,C.muted)+TF(zx+150,250,'+5',13,C.muted);
  D7_FC.forEach(([k,l,v],i)=>{const y=60+i*60,on=k===s.c,w=v*sc,col=on?(v>0?C.green:C.coral):C.line;out+=TF(x0,y,l,13,on?C.ink:C.muted,'start')+R(Math.min(zx,zx+w),y+8,Math.abs(w)||2,22,col,'none',3)+TBF(v>=0?zx+w+6:zx+w-6,y+24,(v>0?'+':v<0?'−':'')+fmt(Math.abs(v)),13,on?C.ink:C.muted,v>=0?'start':'end')});
  out+=R(30,272,540,74,'#fff4ec','none',8)+D7_para(42,292,'Replication status: a 2024 multilab test of a modern version of this paradigm did not find the predicted attitude change. The classic result may be smaller, or narrower, than textbooks suggest.',88,13,C.ink,'start',18);
  const v=D7_FC.find(c=>c[0]===s.c)[2];
  return {svg:out,phase:s.c==='1'?'$1 is not enough to justify the lie, so — the theory says — students resolved the dissonance by deciding the task was not so bad.':s.c==='20'?'$20 (a lot in 1959) justified the lie, so there was little dissonance and little change.':`The control group rated the task ${fmt(v)}: dull, as intended.`};
 }});

const D7_ITEMS=['A weekend by the sea','A new bicycle','A cookery course','A concert ticket','A shelf of novels','A set of houseplants','A board-game evening','A year’s museum pass'];
function D7_pair(r1){const idx=range(8).sort((a,b)=>r1[b]-r1[a]||a-b).slice(0,6);let best=null;for(let a=0;a<idx.length;a++)for(let b=a+1;b<idx.length;b++){const i=idx[a],j=idx[b],sc=Math.abs(r1[i]-r1[j])*100-(r1[i]+r1[j]);if(!best||sc<best.sc)best={i,j,sc}}return [best.i,best.j]}
function D7_choiceSim(p){const r1=[7,6,4,7,5,3,6,5],pair=D7_pair(r1),s={stage:'rate1',i:0,r1:[],pair:null,pick:null,r2:[],sim:true};
 const k=Math.floor(p*12);if(k<8){s.i=k;s.r1=r1.slice(0,k);return s}
 s.r1=r1;s.pair=pair;if(k<9){s.stage='choose';return s}s.pick=pair[0];if(k<10){s.stage='rate2';s.r2=[];return s}s.stage='done';s.r2=[r1[pair[0]]+1,r1[pair[1]]-1];return s}
SCENE({id:'cognitive-dissonance-choice',name:'Choosing changes liking',tag:'You are the participant',
 definition:'The free-choice paradigm: people rate items, choose between two they rated about equally, and rate them again. Dissonance theory predicts the chosen item rises and the rejected one falls, a “spreading of alternatives”.',
 example:'Rate a concert ticket and a weekend by the sea both 7, choose the weekend, and afterwards you may rate it 8 and the concert 6.',
 desc:'Rate eight items from 1 to 9, choose between the two closest favourites, rate those two again, then see the change in each.',
 research:['Brehm (1956). Postdecision changes in the desirability of alternatives. Journal of Abnormal and Social Psychology 52, 384–389.','Chen & Risen (2010). How choice affects and reflects preferences: revisiting the free-choice paradigm. JPSP 99, 573–594: part of the spread can arise from rating noise alone.'],
 dur:12,hint:'Rate each item honestly by pressing 1–9. Your ratings stay in this page and are never sent anywhere.',
 init:()=>({stage:'rate1',i:0,r1:[],pair:null,pick:null,r2:[]}),
 watch:D7_choiceSim,
 ui:[{b:'Start again',act:'again'}],
 on:{rate(s,v){v=Number(v);if(s.stage==='rate1'){s.r1.push(v);s.i++;if(s.i>=8){s.pair=D7_pair(s.r1);s.stage='choose'}}else if(s.stage==='rate2'){s.r2.push(v);if(s.r2.length>=2)s.stage='done'};return 'keep'},
  pick(s,v){if(s.stage!=='choose')return 'keep';const j=Number(v);s.pick=s.pair[j];if(j===1)s.pair=[s.pair[1],s.pair[0]];s.stage='rate2';s.r2=[];return 'keep'},
  again(s){Object.assign(s,{stage:'rate1',i:0,r1:[],pair:null,pick:null,r2:[]})}},
 draw(s,f,X){
  let out='';const scale=(y,act)=>{let o='';for(let v=1;v<=9;v++){const x=100+(v-1)*50;o+=hit(X,act,v,'Rate '+v,Ci(x,y,19,'#fff',C.blue,'stroke-width="2"')+TBF(x,y+5,String(v),15,C.blue))}return o+TF(100,y+40,'not at all',13,C.muted)+TF(500,y+40,'very much',13,C.muted)};
  if(s.stage==='rate1'){
   out+=heading(`Step 1 · How much would you like this? (${s.i+1} of 8)`,26);
   out+=R(150,70,300,70,C.pale,'none',10)+TBF(300,112,D7_ITEMS[s.i],18,C.ink)+scale(200,'rate');
   out+=TF(300,300,`${s.r1.length} rated`,13,C.muted);
  }else if(s.stage==='choose'){
   out+=heading('Step 2 · You can have one of these. Which?',26);
   s.pair.forEach((it,j)=>{const x=60+j*260;out+=hit(X,'pick',j,D7_ITEMS[it],R(x,90,220,110,C.pale,C.blue,10)+TBF(x+110,140,D7_ITEMS[it],15,C.ink)+TF(x+110,166,`you rated it ${s.r1[it]}`,13,C.muted))});
   out+=TF(300,240,'These were the two favourites you rated most alike.',13,C.muted);
  }else if(s.stage==='rate2'){
   const it=s.pair[s.r2.length];
   out+=heading(`Step 3 · Rate it again (${s.r2.length+1} of 2)`,26)+R(150,70,300,70,C.pale,'none',10)+TBF(300,112,D7_ITEMS[it],18,C.ink)+scale(200,'rate');
  }else{
   out+=heading('Before and after your choice',26);
   const [ch,rej]=s.pair,d1=s.r2[0]-s.r1[ch],d2=s.r2[1]-s.r1[rej],spread=d1-d2;
   [[ch,'chosen',s.r1[ch],s.r2[0],C.green],[rej,'rejected',s.r1[rej],s.r2[1],C.coral]].forEach(([it,lab,a,b,c],k)=>{const x=80+k*250;
    out+=TBF(x+80,64,`${lab}: ${D7_ITEMS[it]}`,13,c);[[a,'before'],[b,'after']].forEach(([v,t],m)=>{const bx=x+30+m*70,h=v*18;out+=R(bx,240-h,50,h,m?c:C.line,'none',4)+TBF(bx+25,234-h,String(v),13,C.ink)+TF(bx+25,258,t,13,C.muted)})});
   out+=T(300,296,`Spread of alternatives: ${spread>0?'+':''}${spread} (${d1>=0?'+':''}${d1} for the chosen, ${d2>=0?'+':''}${d2} for the rejected)`,15,spread>0?C.green:C.ink);
   out+=D7_para(40,322,'Brehm found a positive spread on average. Chen and Risen showed that choosing also reveals preferences your first rating missed, so some spread appears even without dissonance.',80,13,C.ink,'start',18);
  }
  return {svg:out,phase:s.sim?'Simulated participant (Watch): the chosen item rises and the rejected item falls.':s.stage==='done'?'One person’s spread is noisy; studies average many people and compare with a control that rates twice before choosing.':'There are no right answers: rate how much you would like each thing.'};
 }});

/* =========================== replication-crisis =========================== */
const D7_PROJ=[['Reproducibility Project (2015)',36,'100 studies from three psychology journals: 97% of originals were significant, but only 36% of replications; average effect size fell from r = 0.40 to 0.20.'],['Many Labs 1 (2014)',77,'13 classic effects, 36 samples: 10 replicated clearly, 1 weakly and 2 not at all (shown as 10 of 13).'],['Many Labs 2 (2018)',54,'28 findings across about 125 samples worldwide: 15 of 28 replicated, and variation between samples was small.'],['Social Sciences Replication Project (2018)',62,'21 experiments from Nature and Science: 13 of 21 replicated, with effects about half as large as the originals.']];
SCENE({id:'replication-crisis',name:'How many findings replicate?',tag:'The crisis, in numbers',
 definition:'The replication crisis is the discovery, from about 2011, that many published findings in psychology and other sciences did not come out the same when independent teams repeated them.',
 example:'When 270 researchers repeated 100 published psychology studies, about a third gave a significant result again, and the effects were on average half the size.',
 desc:'Bars for the share of findings that replicated in four large replication projects, with details of the selected project.',
 research:['Open Science Collaboration (2015). Estimating the reproducibility of psychological science. Science 349, aac4716.','Klein et al. (2014; 2018). Many Labs 1 and 2. Social Psychology 45, 142–152; AMPPS 1, 443–490. Camerer et al. (2018). Nature Human Behaviour 2, 637–644.'],
 dur:12,hint:'Press a project to read what it did and found.',
 init:()=>({i:0}),
 watch(p){return {i:Math.min(3,Math.floor(p*4))}},
 ui:[{b:'◀ Previous',act:'prev'},{b:'Next ▶',act:'next'}],
 on:{prev(s){s.i=(s.i+3)%4},next(s){s.i=(s.i+1)%4},pick(s,v){s.i=Number(v)}},
 draw(s,f,X){
  let out=heading('Share of findings that replicated',24);
  D7_PROJ.forEach(([l,v],i)=>{const y=52+i*50,on=i===s.i;out+=hit(X,'pick',i,l,R(20,y-4,560,44,on?C.pale:'transparent','none',6)+TF(32,y+12,l,13,on?C.ink:C.muted,'start')+D7_hbar(32,y+18,420,16,v,on?C.coral:C.line,v+'%'))});
  out+=R(20,262,560,86,'#f6f9fb','none',8)+D7_para(34,284,D7_PROJ[s.i][2],84,14,C.ink,'start',20);
  return {svg:out,phase:'Different projects chose different studies and used different criteria, so the rates are not directly comparable. Together they show that a single significant published result is weaker evidence than it was taken to be.'};
 }});

function D7_t(a,b){const n1=a.length,n2=b.length,m1=sum(a)/n1,m2=sum(b)/n2;let s1=0,s2=0;a.forEach(v=>s1+=(v-m1)**2);b.forEach(v=>s2+=(v-m2)**2);const df=n1+n2-2,se=Math.sqrt((s1+s2)/df*(1/n1+1/n2))||1e-9,t=(m1-m2)/se,z=t*(1-1/(4*df))/Math.sqrt(1+t*t/(2*df));return 2*(1-D7_phi(Math.abs(z)))}
function D7_trim(a){const m=sum(a)/a.length,sd=Math.sqrt(sum(a.map(v=>(v-m)**2))/(a.length-1));return a.filter(v=>Math.abs(v-m)<=2*sd)}
function D7_study(seed,o){const r=D7_rng(seed);const draw=n=>range(n).map(()=>{const x=D7_gauss(r);return [x,.5*x+Math.sqrt(.75)*D7_gauss(r)]});
 let g1=draw(20),g2=draw(20);const ext=[draw(10),draw(10)];
 const sig=(a,b)=>{const tests=[[a.map(v=>v[0]),b.map(v=>v[0])]];if(o.a){tests.push([a.map(v=>v[1]),b.map(v=>v[1])]);tests.push([a.map(v=>(v[0]+v[1])/2),b.map(v=>(v[0]+v[1])/2)])}
  for(const [x,y] of tests){if(D7_t(x,y)<.05)return true;if(o.c&&D7_t(D7_trim(x),D7_trim(y))<.05)return true}return false};
 if(sig(g1,g2))return true;return o.b?sig(g1.concat(ext[0]),g2.concat(ext[1])):false}
const D7_FPC={};
function D7_fp(o){const k=(o.a?'a':'')+(o.b?'b':'')+(o.c?'c':'');if(!D7_FPC[k]){const res=[];for(let i=0;i<1000;i++)res.push(D7_study(4000+i,o));D7_FPC[k]=res}return D7_FPC[k]}
SCENE({id:'replication-crisis-paths',name:'The garden of forking paths',tag:'Finding effects that are not there',
 definition:'Undisclosed flexibility in analysis, such as measuring several outcomes, adding participants after peeking, or dropping awkward data points, makes false positives far more common than the 5% the p-value promises.',
 example:'With no real effect at all, testing two outcome measures and adding ten more participants if the first look fails pushes the false-positive rate from 5% to about 14%.',
 desc:'A grid of 100 simulated studies of a non-existent effect, coloured when they reached p < .05, with the false-positive rate for the chosen analysis choices beside Simmons and colleagues’ figures.',
 research:['Simmons, Nelson & Simonsohn (2011). False-positive psychology: undisclosed flexibility in data collection and analysis allows presenting anything as significant. Psychological Science 22, 1359–1366.','Gelman & Loken (2013). The garden of forking paths. Simulation here: 1,000 studies, 20 per group, two outcomes correlated 0.5.'],
 dur:12,hint:'Switch on the researcher’s choices one at a time and watch the false positives grow. There is no real effect in any of these studies.',
 init:()=>({a:'0',b:'0',c:'0'}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {a:k>=1?'1':'0',b:k>=2?'1':'0',c:k>=3?'1':'0'}},
 ui:[{choose:[['0','One measure'],['1','Two measures']],label:'Outcome measures',get:s=>s.a,act:'a'},{choose:[['0','Fixed sample'],['1','Peek, add 10']],label:'Sample size',get:s=>s.b,act:'b'},{choose:[['0','Keep all data'],['1','Drop outliers']],label:'Outliers',get:s=>s.c,act:'c'}],
 on:{a(s,v){s.a=v},b(s,v){s.b=v},c(s,v){s.c=v}},
 draw(s){
  const o={a:s.a==='1',b:s.b==='1',c:s.c==='1'},res=D7_fp(o),rate=100*res.filter(Boolean).length/res.length;
  let out=heading('100 studies of an effect that does not exist',24);
  for(let i=0;i<100;i++){const x=48+(i%10)*24,y=62+Math.floor(i/10)*24;out+=R(x,y,18,18,res[i]?C.coral:'#e4ecf1','none',4)}
  out+=TF(48,318,'coral: “significant” (a false positive)',13,C.coral,'start');
  out+=TBF(330,70,'False-positive rate',14,C.ink,'start');
  out+=D7_hbar(330,82,190,18,5*100/30,C.line,'')+TF(330,118,'promised: 5%',13,C.muted,'start');
  out+=D7_hbar(330,128,190,18,rate*100/30,C.coral,'')+TBF(330,166,`these choices: ${fmt(rate)}%`,14,C.coral,'start');
  out+=TBF(330,198,'Simmons et al. (2011)',13,C.ink,'start');
  [['two measures','9.5%'],['add 10 per group','7.7%'],['both','14.4%'],['four choices combined','60.7%']].forEach(([l,v],i)=>out+=TF(330,220+i*20,l,13,C.muted,'start')+TF(560,220+i*20,v,13,C.ink,'end'));
  const on=[o.a&&'two measures',o.b&&'peeking',o.c&&'dropping outliers'].filter(Boolean);
  out+=T(300,356,on.length?`Using ${on.join(', ')}: about ${Math.round(rate)}% false positives`:'One planned test: about 5% false positives, as promised',15,C.ink);
  return {svg:out,phase:'Each choice looks reasonable on its own. Together, and unreported, they let chance masquerade as discovery. Preregistering the analysis closes these paths.'};
 }});

const D7_QZ=[['Anchoring on an arbitrary number','h','Replicated strongly in Many Labs 1 (2014).'],['Ego depletion (willpower runs out)','f','23-lab test found almost no effect (Hagger et al. 2016).'],['Power poses change hormones','f','Ranehill et al. (2015) found no hormone change; feelings of power: weak.'],['Reading “elderly” words slows walking','f','Doyen et al. (2012) failed to replicate Bargh et al. (1996).'],['A pen-held smile makes cartoons funnier','m','Failed in a 17-lab test (2016); a 2022 multilab study found a small effect.'],['Gain versus loss framing','h','Replicated in Many Labs 1 (2014).'],['Images of money shift political views','f','Failed in Many Labs 1 (2014).'],['Testing yourself improves recall','h','Robust across hundreds of studies (Rowland 2014).']];
SCENE({id:'replication-crisis-quiz',name:'Which ones held up?',tag:'Predict, then check',
 definition:'Researchers and even lay people can predict fairly well which findings will replicate: surprising, small-sample effects with weak evidence fail more often.',
 example:'In a prediction market run alongside the Reproducibility Project, bets on which studies would replicate were right about 71% of the time.',
 desc:'Eight well-known findings, each with buttons to predict whether it held up, and the actual replication status revealed afterwards.',
 research:['Dreber et al. (2015). Using prediction markets to estimate the reproducibility of scientific research. PNAS 112, 15343–15347.','Hagger et al. (2016); Wagenmakers et al. (2016); Coles et al. (2022), Nature Human Behaviour 6, 1731–1742; Klein et al. (2014).'],
 dur:12,hint:'For each finding, press Held or Failed, then Reveal. Your answers stay in this page.',
 init:()=>({g:Array(8).fill(null),shown:false}),
 watch(p){const g=['h','f','h','f','h','h','f','h'].map((v,i)=>p>i*.07?v:null);return {g,shown:p>.65,sim:true}},
 ui:[{b:'Reveal',act:'reveal'},{b:'Clear',act:'clear'}],
 on:{g(s,v){const [i,a]=String(v).split(':');s.g[Number(i)]=a;return 'keep'},reveal(s){s.shown=true},clear(s){s.g=Array(8).fill(null);s.shown=false}},
 draw(s,f,X){
  let out=heading('Predict: did each finding hold up?',24),score=0,n=0;
  D7_QZ.forEach(([l,t,note],i)=>{const y=46+i*36;
   out+=TF(24,y+20,l,13,C.ink,'start');
   [['h','Held',334],['f','Failed',400]].forEach(([k,lab,x])=>{const on=s.g[i]===k;out+=hit(X,'g',i+':'+k,lab+': '+l,R(x,y+4,58,24,on?C.blue:'#fff',C.blue,6)+TF(x+29,y+21,lab,13,on?'#fff':C.blue))});
   if(s.shown){const lab={h:'Held',f:'Failed',m:'Mixed'}[t],col={h:C.green,f:C.coral,m:C.amber}[t];out+=TBF(470,y+21,lab,13,col,'start');
    if(s.g[i]){n++;score+=t==='m'?.5:s.g[i]===t?1:0}}});
  if(s.shown){out+=T(300,350,n?`Your score: ${fmt(score)} of ${n} (mixed counts half) · prediction markets: about 71%`:'Make some predictions, then reveal',15,C.ink)}
  else out+=TF(300,350,'Make your predictions, then press Reveal',14,C.muted);
  return {svg:out,phase:s.shown?'Ego depletion: 23 labs found almost no effect (Hagger et al. 2016). Power poses: no hormone change (Ranehill et al. 2015). Elderly priming failed (Doyen et al. 2012). Pen-held smiles: failed in 17 labs in 2016, a small effect in a 2022 multilab study. Money priming failed in Many Labs 1, where anchoring and framing replicated; the testing effect is robust.':'Large, simple, well-measured effects (anchoring, testing) tend to replicate; subtle priming effects in small samples tend not to.'};
 }});

const D7_pow=(d,n)=>{const ncp=d*Math.sqrt(n/2);return D7_phi(ncp-1.96)+D7_phi(-ncp-1.96)};
SCENE({id:'replication-crisis-fixes',name:'Power and preregistration',tag:'How science is fixing itself',
 definition:'Statistical power is the chance a study detects an effect that is really there. Preregistration and registered reports fix the hypothesis and analysis before the data are seen.',
 example:'With 20 people per group and a moderate effect (d = 0.4), a study has only about a 1 in 4 chance of detecting it; about 100 per group are needed for 80% power.',
 desc:'A curve of statistical power against sample size for the chosen effect size, and bars comparing the share of positive results in standard papers and in registered reports.',
 research:['Cohen (1962). The statistical power of abnormal-social psychological research. Button et al. (2013), Nature Reviews Neuroscience 14, 365–376.','Nosek, Ebersole, DeHaven & Mellor (2018). The preregistration revolution. PNAS 115, 2600–2606. Scheel, Schijen & Lakens (2021). AMPPS 4(2): 96% positive results in standard reports versus 44% in registered reports.'],
 dur:10,hint:'Change the number of people per group and the size of the true effect.',
 init:()=>({n:20,d:4}),
 watch(p){return {n:Math.round(lerp(10,150,smooth(p))/5)*5,d:4}},
 ui:[{range:'n',label:'People per group',min:5,max:150,step:5,get:s=>s.n,act:'n'},{range:'d',label:'True effect size d',min:1,max:10,step:1,get:s=>s.d,act:'d',show:v=>fmt(v/10)}],
 on:{n(s,v){s.n=v},d(s,v){s.d=v}},
 draw(s){
  const d=s.d/10,pw=D7_pow(d,s.n);let out=heading(`Power to detect d = ${fmt(d)} (two groups, p < .05)`,24);
  const x0=60,y0=50,w=300,h=220,X=n=>x0+(n-5)/145*w,Y=v=>y0+h-v*h;
  out+=R(x0,y0,w,h,'#fff',C.grid,4);
  [0,.5,.8,1].forEach(v=>out+=TF(x0-6,Y(v)+4,Math.round(v*100)+'%',13,C.muted,'end'));
  out+=L(x0,Y(.8),x0+w,Y(.8),C.green,1.5,'stroke-dasharray="6 5"')+TF(x0+6,Y(.8)-6,'80% target',13,C.green,'start');
  const pts=[];for(let n=5;n<=150;n+=1)pts.push(fmt(X(n))+' '+fmt(Y(D7_pow(d,n))));out+=P('M'+pts.join(' L'),C.blue,3);
  [5,50,100,150].forEach(n=>out+=TF(X(n),y0+h+18,String(n),13,C.muted));out+=TF(x0+w/2,y0+h+38,'people per group',13,C.muted);
  out+=Ci(X(s.n),Y(pw),7,C.coral,'#fff');
  out+=TBF(400,64,'Positive results reported',14,C.ink,'start');
  [['Standard papers',96,C.coral],['Registered reports',44,C.green]].forEach(([l,v,c],i)=>{const x=410+i*90,bh=v*1.7;out+=R(x,250-bh,60,bh,c,'none',4)+TBF(x+30,244-bh,v+'%',13,C.ink)+TF(x+30,270,l.split(' ')[0],13,C.muted)+TF(x+30,286,l.split(' ')[1],13,C.muted)});
  out+=T(300,352,`${s.n} per group: a real effect of d = ${fmt(d)} would be detected ${Math.round(pw*100)}% of the time`,15,C.ink);
  return {svg:out,phase:'Small studies miss real effects and, when they do find something, exaggerate it. Registered reports are accepted before the results are known, so null results get published too.'};
 }});
