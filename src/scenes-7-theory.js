/* ===================== Stage 7 · Theory ===================== */
// Finite automata: positions, transitions [from,to,symbol,bend], start and accepting states.
const TH_DFA={
 div3:{name:'Divisible by 3',alphabet:'01',start:'0',accept:['0'],sample:'1001',
  pos:{'0':[120,240],'1':[300,240],'2':[480,240]},labels:{'0':'r0','1':'r1','2':'r2'},
  edges:[['0','0','0'],['0','1','1',-34],['1','0','1',-34],['1','2','0',-34],['2','1','0',-34],['2','2','1']],
  note:'Each state remembers the remainder so far. Reading a bit doubles the number and adds the bit.'},
 even1:{name:'Even number of 1s',alphabet:'01',start:'E',accept:['E'],sample:'10110',
  pos:{E:[190,240],O:[410,240]},labels:{E:'even',O:'odd'},
  edges:[['E','E','0'],['E','O','1',-40],['O','E','1',-40],['O','O','0']],
  note:'Two states are enough: the machine only needs to remember whether it has seen an even or odd number of 1s.'},
 endsab:{name:'Ends in “ab”',alphabet:'ab',start:'S',accept:['B'],sample:'abbab',
  pos:{S:[110,240],A:[300,240],B:[490,240]},labels:{S:'start',A:'saw a',B:'saw ab'},
  edges:[['S','S','b'],['S','A','a',-30],['A','A','a'],['A','B','b',-30],['B','A','a',-30],['B','S','b',-118]],
  note:'The machine forgets everything except the last letter or two, which is all it needs.'}
};
function TH_dfaStep(m,st,ch){const e=m.edges.find(e=>e[0]===st&&e[2]===ch);return e?e[1]:null}
function TH_clean(m,s){return Array.from(s).filter(c=>m.alphabet.includes(c)).slice(0,12).join('')}
function TH_selfLoop(x,y,r,label,col,w){const d=`M${x-11} ${y-r+3}C${x-44} ${y-r-56} ${x+44} ${y-r-56} ${x+12} ${y-r+3}`;return P(d,col,w)+`<polygon points="${x+12},${y-r+3} ${x+19},${y-r-8} ${x+6},${y-r-7}" fill="${col}"/>`+TB(x,y-r-48,label,15,col===C.line?C.muted:col)}
function TH_drawDFA(m,cur,used,accepted){
 let out='';const r=30;
 for(const e of m.edges){const a=m.pos[e[0]],b=m.pos[e[1]],on=used&&used[0]===e[0]&&used[1]===e[1]&&used[2]===e[2],col=on?C.coral:C.line,w=on?3.5:2.2;
  if(e[0]===e[1]){out+=TH_selfLoop(a[0],a[1],r,e[2],col,w);continue}
  // curveArrow bends towards mid + n·bend, so use that same control point for the rim points and label.
  const bend=e[3]||0,dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy),nx=-dy/d,ny=dx/d;
  const cx=(a[0]+b[0])/2+nx*bend,cy=(a[1]+b[1])/2+ny*bend,toward=(p,q)=>{const vx=q[0]-p[0],vy=q[1]-p[1],vd=Math.hypot(vx,vy)||1;return [p[0]+vx/vd*r,p[1]+vy/vd*(r+2)]};
  const [sx,sy]=toward(a,[cx,cy]),[ex,ey]=toward(b,[cx,cy]);
  out+=curveArrow(sx,sy,ex,ey,bend,col,w);
  const mx=(a[0]+b[0])/2+nx*bend*.5,my=(a[1]+b[1])/2+ny*bend*.5;
  out+=R(mx-11,my-12,22,22,'#fff','none',6)+TB(mx,my+5,e[2],15,on?C.coral:C.muted);
 }
 const st=m.pos[m.start];out+=arrow(st[0]-r-38,st[1],st[0]-r-2,st[1],C.ink,2.2)+T(st[0]-r-38,st[1]-9,'start',13,C.muted,'start');
 for(const id in m.pos){const [x,y]=m.pos[id],acc=m.accept.includes(id),isCur=id===cur;
  out+=Ci(x,y,r,isCur?(accepted===false?C.coral:C.blue):'#fff',isCur?(accepted===false?C.coral:C.blue):C.ink);
  if(acc)out+=Ci(x,y,r-6,'none',isCur?'#fff':C.ink);
  out+=TB(x,y+5,m.labels[id],m.labels[id].length>4?12:15,isCur?'#fff':C.ink);
 }
 return out;
}
SCENE({id:'finite-automaton',name:'Finite automaton',tag:'A machine with a few states',
 definition:'A machine that reads its input one symbol at a time, moving between a fixed, finite set of states, and accepts or rejects at the end.',
 example:'A ticket barrier or a traffic light is a finite automaton. The machine here decides whether a binary number is divisible by 3 using only three states, however long the number is.',
 desc:'An input tape above a state diagram; the current state is filled, the transition just used is highlighted, and accepting states have a double ring.',
 dur:11,hint:'Pick a machine and type a string (only its alphabet is kept). Step through and watch which state you end in.',
 init:()=>({m:'div3',input:'1001'}),
 ui:[{choose:[['div3','÷ 3'],['even1','Even 1s'],['endsab','Ends ab']],label:'Machine',get:s=>s.m,act:'machine'},{text:'Input',label:'Input',get:s=>s.input,act:'input',max:12}],
 on:{machine(s,v){s.m=v;s.input=TH_DFA[v].sample},input(s,v){s.input=TH_clean(TH_DFA[s.m],v)}},
 trace(s){const m=TH_DFA[s.m],inp=TH_clean(m,s.input);let st=m.start;const fr=[{pos:0,st,used:null,inp}];
  for(let i=0;i<inp.length;i++){const nx=TH_dfaStep(m,st,inp[i]);fr.push({pos:i+1,st:nx,used:[st,nx,inp[i]],inp});st=nx}
  fr.push({pos:inp.length,st,used:null,inp,done:true,ok:m.accept.includes(st)});return fr},
 draw(s,f,X){
  const m=TH_DFA[s.m],inp=f.inp;let out=heading(m.name);
  const w=34,x0=300-Math.max(1,inp.length)*w/2;
  if(!inp.length)out+=T(300,72,'(empty input)',14,C.muted);
  Array.from(inp).forEach((c,i)=>{const read=i<f.pos;out+=R(x0+i*w,52,w-3,36,i===f.pos-1&&!f.done?C.coralp:read?'#e9eef1':'#fff',C.grid,5)+TM(x0+i*w+w/2-1.5,77,c,19,read?C.muted:C.ink)});
  const hx=x0+Math.min(f.pos,inp.length)*w-1.5;out+=`<polygon points="${fmt(hx)},94 ${fmt(hx-7)},106 ${fmt(hx+7)},106" fill="${C.coral}"/>`+T(hx,122,'read head',12,C.coral);
  out+=TH_drawDFA(m,f.st,f.used,f.done?f.ok:undefined);
  if(f.done)out+=R(150,316,300,44,f.ok?C.greenp:C.coralp,f.ok?C.green:C.coral,10)+TB(300,344,f.ok?'Accepted ✓':'Rejected ✗',19,f.ok?C.green:C.coral);
  else out+=T(300,344,f.used?`Read “${f.used[2]}”: ${m.labels[f.used[0]]} → ${m.labels[f.used[1]]}`:'Start in the start state',16,C.ink);
  return {svg:out,phase:f.done?`The input ends in state “${m.labels[f.st]}”, which is ${f.ok?'':'not '}an accepting state. ${m.note}`:`${m.note} The machine has no other memory: no counter and no tape to write on.`};
 }});

const TH_REGEX=[
 {src:'colou?r',flags:'gi',sample:'color, colour, colouur',parts:[['lit','c'],['lit','o'],['lit','l'],['lit','o'],['opt','u'],['lit','r']],say:'“u?” means the u is optional: zero or one of it.'},
 {src:'[0-9]+',flags:'g',sample:'Call 0161 or 999 now',parts:[['plus','0–9']],say:'“[0-9]” means any one digit; “+” means one or more, so the loop below may repeat.'},
 {src:'ca(t|r)s?',flags:'gi',sample:'cat cars cap cats',parts:[['lit','c'],['lit','a'],['alt',['t','r']],['opt','s']],say:'“(t|r)” chooses one branch; “s?” is optional.'},
 {src:'[a-z]+@[a-z]+\\.uk',flags:'gi',sample:'jo@shop.uk, me@x.com',parts:[['plus','a–z'],['lit','@'],['plus','a–z'],['lit','.'],['lit','u'],['lit','k']],say:'A simplified address pattern: letters, @, letters, then “.uk”.'}
];
function TH_railroad(parts,y,litOn){
 let out='',x=40;const segs=[];
 const unit=p=>p[0]==='lit'?42:p[0]==='opt'?70:p[0]==='alt'?80:96;
 const total=sum(parts.map(unit))+(parts.length-1)*12,scale=Math.min(1,500/total);
 x=300-total*scale/2;out+=Ci(x-14,y,6,C.ink);
 parts.forEach((p,i)=>{const w=unit(p)*scale,cx=x+w/2,on=litOn===i,col=on?C.coral:C.blue,fill=on?C.coralp:'#fff';
  if(p[0]==='lit')out+=L(x-12,y,x,y,C.ink,2)+R(x,y-17,w,34,fill,col,17)+TM(cx,y+6,p[1],17,C.ink);
  else if(p[0]==='opt')out+=L(x-12,y,x+w,y,C.ink,2)+P(`M${x} ${y}Q${x} ${y-40} ${cx} ${y-40}Q${x+w} ${y-40} ${x+w} ${y}`,C.ink,2)+R(cx-20,y-17,40,34,fill,col,17)+TM(cx,y+6,p[1],17,C.ink)+T(cx,y-46,'optional',12,C.muted);
  else if(p[0]==='plus')out+=L(x-12,y,x+w,y,C.ink,2)+R(x+8,y-17,w-16,34,fill,col,8)+TM(cx,y+6,p[1],16,C.ink)+P(`M${x+w-4} ${y}Q${x+w-4} ${y+38} ${cx} ${y+38}Q${x+4} ${y+38} ${x+4} ${y}`,C.ink,2)+`<polygon points="${fmt(x+4)},${y+2} ${fmt(x)},${y+12} ${fmt(x+9)},${y+12}" fill="${C.ink}"/>`+T(cx,y+54,'repeat',12,C.muted);
  else if(p[0]==='alt'){out+=L(x-12,y,x,y,C.ink,2)+P(`M${x} ${y}Q${x+10} ${y-26} ${x+22} ${y-26}H${x+w-22}Q${x+w-10} ${y-26} ${x+w} ${y}`,C.ink,2)+P(`M${x} ${y}Q${x+10} ${y+26} ${x+22} ${y+26}H${x+w-22}Q${x+w-10} ${y+26} ${x+w} ${y}`,C.ink,2);
   p[1].forEach((b,j)=>{const yy=y+(j?26:-26);out+=R(cx-17,yy-15,34,30,fill,col,15)+TM(cx,yy+6,b,16,C.ink)})}
  x+=w;if(i<parts.length-1){out+=L(x,y,x+12,y,C.ink,2);x+=12}
 });
 return out+L(x,y,x+12,y,C.ink,2)+Ci(x+14,y,6,'#fff',C.ink)+Ci(x+14,y,3,C.ink);
}
SCENE({id:'regular-expression',name:'Regular expression',tag:'A pattern is a machine',
 definition:'A compact pattern describing a set of strings, built from letters, choices (|), optional parts (?) and repetition (* and +).',
 example:'colou?r matches both “color” and “colour”. Every regular expression can be turned into a finite automaton, and back again. That holds for regular expressions in the mathematical sense; the regex engines in programming languages (PCRE, Perl, Python) add extras such as backreferences that no finite automaton can match.',
 desc:'A railroad diagram of the pattern, a path that a matching string can follow from left to right, above a test sentence with matches highlighted.',
 dur:12,hint:'Pick a pattern and edit the test text. Highlighted parts are matches: strings with a route through the diagram.',
 init:()=>({i:0,text:TH_REGEX[0].sample}),
 watch(p){const i=Math.min(3,Math.floor(p*4));return {i,text:TH_REGEX[i].sample,dot:(p*4-i)}},
 ui:[{choose:TH_REGEX.map((r,i)=>[i,r.src]),label:'Pattern',get:s=>s.i,act:'pick'},{text:'Test text',label:'Test text',get:s=>s.text,act:'text',max:28}],
 on:{pick(s,v){s.i=Number(v);s.text=TH_REGEX[s.i].sample},text(s,v){s.text=v}},
 draw(s,f,X){
  const rx=TH_REGEX[s.i],re=new RegExp(rx.src,rx.flags),text=s.text.slice(0,28);let out=heading('/'+rx.src+'/');
  const lit=s.dot===undefined?-1:Math.min(rx.parts.length-1,Math.floor(smooth(clamp(s.dot*1.3,0,1))*rx.parts.length));
  out+=TH_railroad(rx.parts,130,lit);
  const ms=[];let m;re.lastIndex=0;while((m=re.exec(text))!==null){if(!m[0].length){re.lastIndex++;continue}ms.push([m.index,m.index+m[0].length,m[0]])}
  const cw=Math.min(19,540/Math.max(1,text.length)),x0=300-text.length*cw/2;
  out+=R(24,226,552,62,'#fff',C.grid,10);
  Array.from(text).forEach((c,i)=>{const inM=ms.some(([a,b])=>i>=a&&i<b);if(inM)out+=R(x0+i*cw,238,cw,38,C.amberp,'none',3);out+=TM(x0+i*cw+cw/2,264,c,Math.min(18,cw*1.05),inM?C.ink:C.muted,'middle',inM?'font-weight="700"':'')});
  ms.forEach(([a,b])=>out+=L(x0+a*cw+2,282,x0+b*cw-2,282,C.amber,3));
  out+=T(300,318,ms.length?`${ms.length} match${ms.length>1?'es':''}: ${ms.map(x=>'“'+x[2]+'”').join(', ')}`:'No matches',16,ms.length?C.ink:C.coral);
  out+=T(300,350,'Read left to right; any route from start to finish spells a matching string.',14,C.muted);
  return {svg:out,phase:rx.say+' Regular expressions cannot count without limit: no regular expression matches exactly the strings with equal numbers of a’s and b’s.'};
 }});

const TH_TM={
 inc:{name:'Binary +1',alphabet:'01',sample:'1011',start:'right',
  rules:[['right','0','0','R','right'],['right','1','1','R','right'],['right','_','_','L','carry'],['carry','1','0','L','carry'],['carry','0','1','L','halt'],['carry','_','1','L','halt']],
  say:'Move right to the end, then add 1 from the right, carrying left past 1s.'},
 flip:{name:'Flip every bit',alphabet:'01',sample:'10010',start:'flip',
  rules:[['flip','0','1','R','flip'],['flip','1','0','R','flip'],['flip','_','_','L','halt']],
  say:'Swap 0 and 1 in each cell, moving right until a blank.'},
 add:{name:'Unary addition',alphabet:'1+',sample:'111+11',start:'find+',
  rules:[['find+','1','1','R','find+'],['find+','+','1','R','to end'],['to end','1','1','R','to end'],['to end','_','_','L','erase'],['erase','1','_','L','halt']],
  say:'3 + 2 written as 111+11: turn the + into a 1, then rub out one 1 at the end.'}
};
function TH_tmRun(m,input){
 const tape={};Array.from(input).forEach((c,i)=>tape[i]=c);let head=0,st=m.start;const fr=[];
 const snap=(rule,note)=>fr.push({tape:{...tape},head,st,rule,note});
 snap(null);
 for(let n=0;n<80&&st!=='halt';n++){const sym=tape[head]||'_',ri=m.rules.findIndex(r=>r[0]===st&&r[1]===sym);
  if(ri<0){st='stuck';snap(null,'No rule for this state and symbol, so the machine stops.');break}
  const r=m.rules[ri];if(r[2]==='_')delete tape[head];else tape[head]=r[2];head+=r[3]==='R'?1:-1;st=r[4];snap(ri)}
 return fr;
}
SCENE({id:'turing-machine',name:'Turing machine',tag:'An endless tape and a rule table',
 definition:'A model computer: a head reads and writes symbols on an unlimited tape, following a finite table of rules “in this state, reading this symbol, write, move, change state”.',
 example:'Alan Turing described it in 1936. Anything a modern computer can calculate, a Turing machine can calculate too, given enough time and tape.',
 desc:'A strip of tape cells with the read–write head marked, the machine’s current state, and its rule table with the rule just used highlighted.',
 dur:13,hint:'Choose a machine and type its input. Step to see each rule fire: read, write, move, change state.',
 init:()=>({m:'inc',input:'1011'}),
 ui:[{choose:[['inc','Binary +1'],['flip','Flip bits'],['add','Unary add']],label:'Machine',get:s=>s.m,act:'machine'},{text:'Input',label:'Tape',get:s=>s.input,act:'input',max:10}],
 on:{machine(s,v){s.m=v;s.input=TH_TM[v].sample},input(s,v){const m=TH_TM[s.m];s.input=Array.from(v).filter(c=>m.alphabet.includes(c)).slice(0,10).join('')}},
 trace(s){return TH_tmRun(TH_TM[s.m],s.input)},
 draw(s,f,X){
  const m=TH_TM[s.m],cw=40,lo=f.head-6;let out=heading(m.name);
  const prev=X.k>0&&X.n?null:null;
  for(let i=0;i<13;i++){const idx=lo+i,c=f.tape[idx]||'_',x=40+i*cw,isH=idx===f.head;
   out+=R(x,56,cw-2,46,isH?C.amberp:'#fff',isH?C.amber:C.grid,4)+TM(x+cw/2-1,87,c==='_'?'':c,22,C.ink)+(c==='_'?T(x+cw/2-1,86,'·',18,C.line):'')}
  out+=T(30,84,'…',18,C.muted)+T(572,84,'…',18,C.muted);
  const hx=40+6*cw+cw/2-1;out+=`<polygon points="${hx},108 ${hx-10},124 ${hx+10},124" fill="${C.amber}"/>`;
  const done=f.st==='halt'||f.st==='stuck';
  out+=R(hx-62,128,124,34,done?C.greenp:C.blue,'none',17)+TB(hx,151,f.st==='halt'?'halted':f.st,15,done?C.green:'#fff');
  const rx=60,ry=184,cwr=[100,72,72,62,100];
  ['state','read','write','move','next'].forEach((h,j)=>out+=TB(rx+sum(cwr.slice(0,j))+cwr[j]/2,ry,h,13,C.muted));
  m.rules.forEach((r,i)=>{const y=ry+10+i*25,on=f.rule===i;out+=R(rx-6,y,sum(cwr)+12,23,on?C.coralp:i%2?'#f6f9fb':'#fff',on?C.coral:'none',5);
   r.forEach((v,j)=>out+=TM(rx+sum(cwr.slice(0,j))+cwr[j]/2,y+16,v==='_'?'blank':v,13,on?C.ink:C.muted,'middle',on?'font-weight="700"':''))});
  const tapeStr=Object.keys(f.tape).map(Number).sort((a,b)=>a-b).map(k=>f.tape[k]).join('');
  out+=T(300,370,done?`Halted after ${X.k} steps. Tape now reads ${tapeStr||'(blank)'}.`:`Step ${X.k}: ${f.rule===null?'start':'rule '+(f.rule+1)+' fired'}`,14,done?C.green:C.muted);
  return {svg:out,phase:f.note||(f.rule===null?m.say:`In state “${m.rules[f.rule][0]}” reading ${m.rules[f.rule][1]==='_'?'a blank':m.rules[f.rule][1]}: write ${m.rules[f.rule][2]==='_'?'a blank':m.rules[f.rule][2]}, move ${m.rules[f.rule][3]==='R'?'right':'left'}, go to “${m.rules[f.rule][4]}”.`)};
 }});

// Halting: a table of programs run on programs, and the contrary program D built from its diagonal.
const TH_HALT0=[['H','L','H','H','L'],['L','L','H','L','H'],['H','H','H','L','L'],['L','H','L','H','H'],['H','L','L','L','L']];
SCENE({id:'halting-problem',name:'Halting problem',tag:'A question no program can answer',
 definition:'The question “given any program and input, will it eventually stop?” No algorithm can answer it correctly for every program.',
 example:'Suppose a perfect checker existed. Build program D: “ask the checker what program P does when fed itself, then do the opposite”. Asking about D on itself has no consistent answer.',
 desc:'A grid of programs against inputs, each cell H for halts or L for loops; the diagonal is flipped to build a new row, D, that differs from every row.',
 dur:14,hint:'Press any cell to change what that program does. However you fill the table, D’s row disagrees with every row on the diagonal.',
 init:()=>({cells:TH_HALT0.map(r=>r.slice())}),
 on:{cell(s,a){const [i,j]=String(a).split(',').map(Number);s.cells[i][j]=s.cells[i][j]==='H'?'L':'H'}},
 trace(s){const fr=[{phase:'table'}];for(let i=0;i<5;i++)fr.push({phase:'flip',i});for(let i=0;i<5;i++)fr.push({phase:'compare',i});fr.push({phase:'end'});return fr},
 draw(s,f,X){
  let out=heading('Programs run on programs');const x0=150,y0=62,cw=74,rh=40,n=5;
  for(let j=0;j<n;j++)out+=TB(x0+j*cw+cw/2,y0,'P'+(j+1),14,C.muted);out+=T(x0-28,y0,'input →',12,C.muted);
  const flipped=f.phase==='table'?-1:f.phase==='flip'?f.i:4,cmp=f.phase==='compare'?f.i:f.phase==='end'?5:-1;
  for(let i=0;i<n;i++){const y=y0+12+i*rh;out+=TB(x0-28,y+26,'P'+(i+1),15,cmp===i?C.coral:C.ink);
   for(let j=0;j<n;j++){const v=s.cells[i][j],diag=i===j,x=x0+j*cw;
    const inner=R(x+4,y+4,cw-8,rh-8,diag?(i<=flipped?C.amberp:'#fff8e8'):'#fff',diag?C.amber:(cmp===i&&j===i?C.coral:C.grid),6)+TB(x+cw/2,y+26,v==='H'?'halts':'loops',14,v==='H'?C.blue:C.purple);
    out+=hit(X,'cell',i+','+j,`Program ${i+1} on input ${j+1}: ${v==='H'?'halts':'loops'}. Press to change.`,inner)}}
  const yD=y0+12+n*rh+18;out+=TB(x0-28,yD+26,'D',17,C.coral);
  for(let j=0;j<n;j++){const x=x0+j*cw;if(j<=flipped){const v=s.cells[j][j]==='H'?'L':'H';out+=R(x+4,yD+4,cw-8,rh-8,C.coralp,C.coral,6)+TB(x+cw/2,yD+26,v==='H'?'halts':'loops',14,C.coral);
    if(j===flipped&&f.phase==='flip')out+=curveArrow(x+cw/2+18,y0+12+j*rh+rh-4,x+cw/2+18,yD+4,-16,C.amber,2)}
   else out+=R(x+4,yD+4,cw-8,rh-8,'#fff',C.grid,6,'stroke-dasharray="4 4"')}
  out+=TF(x0+n*cw+12,yD+20,'D does the',13,C.coral,'start')+TF(x0+n*cw+12,yD+36,'opposite',13,C.coral,'start');
  let say;
  if(f.phase==='table')say='Each row is a program; each column is a program given as its input. Suppose a perfect checker could fill in every cell correctly.';
  else if(f.phase==='flip')say=`D, given P${f.i+1}, asks the checker about P${f.i+1} on P${f.i+1} (${s.cells[f.i][f.i]==='H'?'halts':'loops'}) and does the opposite: it ${s.cells[f.i][f.i]==='H'?'loops':'halts'}.`;
  else if(f.phase==='compare')say=`Could D be P${f.i+1}? No: they disagree on input P${f.i+1}, the diagonal cell.`;
  else say='D differs from every program in the list, yet D is a program the checker could be used to build. So no perfect halting checker can exist.';
  if(f.phase==='end')out+=R(100,yD+48,400,30,C.coralp,'none',8)+TB(300,yD+68,'Contradiction: the perfect checker cannot exist',14,C.coral);
  return {svg:out,phase:say};
 }});

const TH_NUMS=[3,34,4,12,5,2];
SCENE({id:'p-vs-np',name:'P versus NP',tag:'Easy to check, hard to find?',
 definition:'P is the class of problems a computer can solve quickly (in polynomial time). NP is the class whose proposed answers can be checked quickly. Whether P = NP is the most famous open question in computer science.',
 example:'Subset sum: from 3, 34, 4, 12, 5, 2, pick numbers adding to 9. Checking “4 + 5” takes a moment; finding it may mean trying many of the 2ⁿ possible subsets.',
 desc:'Number tiles that can be selected, a running total compared with the target, and a counter of how many subsets a brute-force search has tried, beside a table of how 2ⁿ outgrows n.',
 dur:14,hint:'Press numbers to make your own guess; checking it is instant. Then Step or Run to watch brute force try every subset in turn.',
 init:()=>({sel:[],target:9}),
 ui:[{range:'target',label:'Target',min:1,max:60,get:s=>s.target,act:'target'}],
 on:{pick(s,i){i=Number(i);s.sel=s.sel.includes(i)?s.sel.filter(x=>x!==i):s.sel.concat(i)},target(s,v){s.target=v}},
 trace(s){const n=TH_NUMS.length,fr=[{mask:s.sel.reduce((m,i)=>m|1<<i,0),mine:true}];let found=0;
  for(let m=1;m<1<<n;m++){const tot=TH_NUMS.reduce((a,v,i)=>a+(m>>i&1?v:0),0);if(tot===s.target)found++;fr.push({mask:m,tried:m,found})}return fr},
 draw(s,f,X){
  const n=TH_NUMS.length,mask=f.mask,tot=TH_NUMS.reduce((a,v,i)=>a+(mask>>i&1?v:0),0),ok=tot===s.target&&mask!==0;
  let out=heading(`Find numbers that add up to ${s.target}`);
  TH_NUMS.forEach((v,i)=>{const on=mask>>i&1,x=60+i*84;out+=hit(X,'pick',i,`Number ${v}: ${on?'chosen':'not chosen'}. Press to toggle.`,R(x,56,68,56,on?C.blue:'#fff',on?C.blue:C.line,10)+TB(x+34,92,v,22,on?'#fff':C.ink))});
  const parts=TH_NUMS.filter((v,i)=>mask>>i&1);
  out+=T(300,146,parts.length?parts.join(' + ')+' = '+tot:'Nothing chosen yet',19,C.ink);
  out+=R(150,160,300,40,ok?C.greenp:'#fff',ok?C.green:C.grid,10)+TB(300,186,ok?`✓ Checked: equals ${s.target}`:mask?`✗ ${tot} ≠ ${s.target}`:'Check: add them up',16,ok?C.green:mask?C.coral:C.muted);
  out+=counter(470,154,'subsets tried',f.mine?'—':`${f.tried} of ${(1<<n)-1}`,C.purple,118);
  if(!f.mine)out+=T(529,216,`${f.found} found so far`,13,f.found?C.green:C.muted);
  const rows=[[6,'6','64'],[20,'20','about 1 million'],[40,'40','about 1 trillion'],[80,'80','more than atoms in a person']];
  out+=TB(130,246,'n numbers',13,C.muted)+TB(280,246,'check an answer',13,C.green)+TB(460,246,'try every subset (2ⁿ)',13,C.coral);
  rows.forEach((r,i)=>{const y=270+i*25;out+=R(60,y-17,480,23,i%2?'#f6f9fb':'#fff','none',5)+T(130,y,r[0],15,C.ink)+T(280,y,'≈ '+r[1]+' additions',14,C.green)+T(460,y,r[2],14,C.coral)});
  return {svg:out,phase:f.mine?'Checking a proposed answer takes one addition per number, so subset sum is in NP. Nobody knows a method that always finds an answer quickly; if someone did, P would equal NP.':`Brute force is on subset ${f.tried}: ${parts.join(' + ')||'—'} = ${tot}. Each extra number doubles the work, while checking grows by only one addition.`};
 }});

/* ===================== Stage 7 · lesson scenes ===================== */
// Merge [from,to,symbol] triples into labelled edges; a pair with a reverse arrow bends apart.
function TH_pairs(list){
 const map=new Map();for(const [a,b,c,extra] of list){const k=a+'>'+b;if(!map.has(k))map.set(k,[a,b,[],extra]);map.get(k)[2].push(c)}
 return [...map.values()].map(([a,b,syms,extra])=>[a,b,syms.join(','),a!==b&&map.has(b+'>'+a)?-28:0,extra]);
}
// A state diagram with any number of active states (for nondeterminism) and highlighted arrows.
function TH_net(m,o={}){
 const r=o.r||26,act=o.active||[],used=o.used||[];let out='';
 for(const e of m.edges){const a=m.pos[e[0]],b=m.pos[e[1]],on=used.some(u=>u[0]===e[0]&&u[1]===e[1]),col=on?C.coral:C.line,w=on?3.4:2.2;
  if(e[0]===e[1]){out+=TH_selfLoop(a[0],a[1],r,e[2],col,w);continue}
  const bend=e[3]||0,dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy),nx=-dy/d,ny=dx/d;
  const cx=(a[0]+b[0])/2+nx*bend,cy=(a[1]+b[1])/2+ny*bend,tw=(p,q)=>{const vx=q[0]-p[0],vy=q[1]-p[1],vd=Math.hypot(vx,vy)||1;return [p[0]+vx/vd*r,p[1]+vy/vd*(r+2)]};
  const [sx,sy]=tw(a,[cx,cy]),[ex,ey]=tw(b,[cx,cy]);out+=curveArrow(sx,sy,ex,ey,bend,col,w);
  const mx=(a[0]+b[0])/2+nx*bend*.5,my=(a[1]+b[1])/2+ny*bend*.5,lw=String(e[2]).length*8+12;
  out+=R(mx-lw/2,my-11,lw,22,'#fff','none',6)+TBF(mx,my+5,e[2],14,on?C.coral:C.muted);
 }
 if(m.start){const st=m.pos[m.start];out+=arrow(st[0]-r-34,st[1],st[0]-r-2,st[1],C.ink,2.2)+TF(st[0]-r-34,st[1]-9,'start',13,C.muted,'start')}
 for(const id in m.pos){const [x,y]=m.pos[id],acc=(m.accept||[]).includes(id),on=act.includes(id),fill=on?(o.fail?C.coral:C.blue):'#fff';
  out+=Ci(x,y,r,fill,on?fill:C.ink);if(acc)out+=Ci(x,y,r-5,'none',on?'#fff':C.ink);
  const lab=(m.labels&&m.labels[id])||id;out+=TBF(x,y+5,lab,lab.length>3?13:15,on?'#fff':C.ink)}
 return out;
}
// An input tape with a read head after `pos` symbols.
function TH_tape(str,pos,y,x0,w=28,done=false){
 let out='';const chars=Array.from(str);
 if(!chars.length)out+=TF(x0,y+22,'(empty input)',13,C.muted,'start');
 chars.forEach((c,i)=>{const read=i<pos;out+=R(x0+i*w,y,w-3,32,i===pos-1&&!done?C.coralp:read?'#e9eef1':'#fff',C.grid,5)+TMF(x0+i*w+w/2-1.5,y+23,c,18,read?C.muted:C.ink)});
 const hx=x0+Math.min(pos,chars.length)*w-1.5;out+=`<polygon points="${fmt(hx)},${y+38} ${fmt(hx-7)},${y+50} ${fmt(hx+7)},${y+50}" fill="${C.coral}"/>`;
 return out;
}
const TH_bits=(v,n=10)=>Array.from(v).filter(c=>c==='0'||c==='1').slice(0,n).join('');

/* ---- Finite automaton lesson ---- */
const TH_DESIGN={
 has11:{tr:{A:{0:'A',1:'B'},B:{0:'A',1:'C'},C:{0:'C',1:'C'}},acc:['C'],input:'10110',say:'This wiring accepts strings that contain 11: B means “the last symbol was 1”, C means “seen 11 somewhere”.'},
 even0:{tr:{A:{0:'B',1:'A'},B:{0:'A',1:'B'},C:{0:'C',1:'C'}},acc:['A'],input:'0100',say:'This wiring counts 0s two at a time: A means “an even number of 0s so far”. State C is never reached.'},
 blank:{tr:{A:{0:'A',1:'A'},B:{0:'B',1:'B'},C:{0:'C',1:'C'}},acc:[],input:'101',say:'Every arrow loops back to its own state, and nothing is accepted. Press the table cells to wire up a machine of your own.'}};
const TH_TESTS=['','1','11','0110','1010','111','0000','1001'];
const TH_designCopy=k=>({preset:k,tr:JSON.parse(JSON.stringify(TH_DESIGN[k].tr)),acc:TH_DESIGN[k].acc.slice(),input:TH_DESIGN[k].input});
const TH_designRun=(s,str)=>{let st='A';for(const ch of str)st=s.tr[st][ch];return st};
SCENE({id:'fa-design',name:'Designing an automaton',tag:'Wire up your own machine',
 definition:'Designing a finite automaton means deciding what each state should remember, then drawing one arrow per state and symbol.',
 example:'To accept strings containing 11 you only need to remember three things: nothing useful yet, “the last symbol was 1”, and “seen 11”.',
 desc:'A three-state machine drawn beside its transition table and a list of test strings that are accepted or rejected.',
 dur:11,hint:'Press a table cell to send that arrow to another state, and press a ✓ cell to make a state accepting. The test strings update at once.',
 init:()=>TH_designCopy('has11'),
 ui:[{choose:[['has11','Contains 11'],['even0','Even 0s'],['blank','Blank']],label:'Start from',get:s=>s.preset,act:'preset'},{text:'Input',label:'Input',get:s=>s.input,act:'input',max:10}],
 on:{preset(s,v){Object.assign(s,TH_designCopy(v))},input(s,v){s.input=TH_bits(v)},
  cell(s,a){const [st,sym]=String(a).split(','),o=['A','B','C'];s.tr[st][sym]=o[(o.indexOf(s.tr[st][sym])+1)%3];s.preset='custom'},
  acc(s,st){s.acc=s.acc.includes(st)?s.acc.filter(x=>x!==st):s.acc.concat(st).sort();s.preset='custom'},load(s,v){s.input=v}},
 trace(s){let st='A';const fr=[{pos:0,st,used:null}];Array.from(s.input).forEach((ch,i)=>{const nx=s.tr[st][ch];fr.push({pos:i+1,st:nx,used:[st,nx]});st=nx});
  fr.push({pos:s.input.length,st,used:null,done:true,ok:s.acc.includes(st)});return fr},
 draw(s,f,X){
  let out=heading('A machine you can rewire');
  const m={pos:{A:[70,250],B:[185,138],C:[300,250]},start:'A',accept:s.acc,edges:TH_pairs(['A','B','C'].flatMap(st=>['0','1'].map(sym=>[st,s.tr[st][sym],sym])))};
  out+=TH_net(m,{active:[f.st],used:f.used?[f.used]:[],fail:f.done&&!f.ok});
  out+=TH_tape(s.input,f.pos,292,24,28,f.done);
  if(f.done)out+=TB(24,368,f.ok?'Accepted ✓':'Rejected ✗',16,f.ok?C.green:C.coral,'start');
  const tx=360;out+=TBF(390,58,'state',13,C.muted)+TBF(445,58,'on 0',13,C.muted)+TBF(500,58,'on 1',13,C.muted)+TBF(558,58,'accept',13,C.muted);
  ['A','B','C'].forEach((st,i)=>{const y=68+i*40;out+=R(tx,y,60,32,f.st===st?C.blue:'#fff',C.grid,6)+TBF(390,y+21,st,15,f.st===st?'#fff':C.ink);
   ['0','1'].forEach((sym,j)=>{const x=425+j*55;out+=hit(X,'cell',st+','+sym,`From ${st} on ${sym} go to ${s.tr[st][sym]}. Press to change.`,R(x,y,40,32,'#fff',C.blue,6)+TBF(x+20,y+21,'→'+s.tr[st][sym],15,C.ink))});
   const acc=s.acc.includes(st);out+=hit(X,'acc',st,`State ${st} is ${acc?'':'not '}accepting. Press to change.`,R(535,y,48,32,acc?C.greenp:'#fff',acc?C.green:C.line,6)+TBF(559,y+21,acc?'✓':'·',16,acc?C.green:C.muted))});
  out+=TBF(360,208,'Test strings',13,C.ink,'start');
  TH_TESTS.forEach((str,i)=>{const x=360+(i>>2)*115,y=218+(i%4)*30,ok=s.acc.includes(TH_designRun(s,str));
   out+=hit(X,'load',str,`Test “${str||'empty'}”: ${ok?'accepted':'rejected'}. Press to load it.`,R(x,y,108,26,'#fff',C.grid,5)+TMF(x+8,y+18,str||'ε',14,C.ink,'start')+TBF(x+96,y+18,ok?'✓':'✗',15,ok?C.green:C.coral))});
  const pre=TH_DESIGN[s.preset];
  return {svg:out,phase:f.done?`The input ends in state ${f.st}, which is ${f.ok?'':'not '}accepting. ${pre?pre.say:'Check your design against every test string, not just one.'}`:(f.used?`Read “${s.input[f.pos-1]}”: ${f.used[0]} → ${f.used[1]}. `:'Start in A. ')+(pre?pre.say:'Each state has exactly one arrow for 0 and one for 1, so the machine never has to guess.')};
 }});

const TH_NFA={
 ends01:{name:'Ends in 01',pos:{q0:[110,232],q1:[300,232],q2:[490,232]},start:'q0',accept:['q2'],d:{q0:{0:['q0','q1'],1:['q0']},q1:{1:['q2']},q2:{}},sample:'10101',say:'On a 0 the machine may stay in q0 or guess that this 0 is the second-to-last symbol.'},
 has11:{name:'Contains 11',pos:{q0:[110,232],q1:[300,232],q2:[490,232]},start:'q0',accept:['q2'],d:{q0:{0:['q0'],1:['q0','q1']},q1:{1:['q2']},q2:{0:['q2'],1:['q2']}},sample:'0110',say:'On a 1 the machine may stay in q0 or guess that the pair 11 starts here.'}};
const TH_ORDER=['q0','q1','q2'];
const TH_setName=a=>a.length?'{'+a.map(x=>x.slice(1)).join(',')+'}':'∅';
function TH_nfaTrace(s){const m=TH_NFA[s.m];let act=[m.start];const fr=[{pos:0,act,used:[],hist:[act]}];
 Array.from(s.input).forEach((ch,i)=>{const used=[],nx=new Set();act.forEach(q=>((m.d[q]||{})[ch]||[]).forEach(t=>{used.push([q,t]);nx.add(t)}));
  act=TH_ORDER.filter(q=>nx.has(q));fr.push({pos:i+1,act,used,hist:fr[fr.length-1].hist.concat([act])})});
 const last=fr[fr.length-1];fr.push({...last,used:[],done:true,ok:act.some(q=>m.accept.includes(q))});return fr}
SCENE({id:'fa-nondeterministic',name:'Nondeterministic automaton',tag:'Follow every choice at once',
 definition:'A nondeterministic finite automaton (NFA) may have several arrows for the same symbol. It accepts if any sequence of choices ends in an accepting state.',
 example:'To accept strings ending in 01, an NFA simply “guesses” which 0 is second to last. Tracking the set of states it could be in turns it back into an ordinary machine.',
 desc:'An input tape above a three-state NFA in which several states can be lit at once, and a row showing the set of active states after each symbol.',
 dur:11,hint:'Pick a machine and type a string of 0s and 1s. Step to watch the set of possible states spread and shrink. Switch to 3D to see each set as a corner of a cube.',
 init:()=>({m:'ends01',input:'10101'}),
 ui:[{choose:[['ends01','Ends in 01'],['has11','Contains 11']],label:'Machine',get:s=>s.m,act:'machine'},{text:'Input',label:'Input',get:s=>s.input,act:'input',max:10}],
 on:{machine(s,v){s.m=v;s.input=TH_NFA[v].sample},input(s,v){s.input=TH_bits(v)}},
 trace:TH_nfaTrace,
 draw(s,f,X){
  const m=TH_NFA[s.m];let out=heading(m.name+' — nondeterministic');
  const n=Array.from(s.input).length;out+=TH_tape(s.input,f.pos,46,300-n*15,30,f.done);
  const edges=TH_pairs(TH_ORDER.flatMap(q=>['0','1'].flatMap(c=>((m.d[q]||{})[c]||[]).map(t=>[q,t,c]))));
  out+=TH_net({...m,edges},{active:f.act,used:f.used,fail:f.done&&!f.ok});
  out+=TF(24,292,'Active set after each symbol (each set is one state of an equivalent ordinary machine):',13,C.muted,'start');
  const k=f.hist.length,cw=Math.min(62,552/k);
  f.hist.forEach((a,i)=>{const cur=i===k-1;out+=R(24+i*cw,302,cw-4,30,cur?C.blue:a.length?C.pale:C.coralp,'none',6)+TMF(24+i*cw+(cw-4)/2,322,TH_setName(a),13,cur?'#fff':C.ink)});
  if(f.done)out+=TB(300,364,f.ok?'Accepted ✓ — some choice of path ends in an accepting state':'Rejected ✗ — no path ends in an accepting state',15,f.ok?C.green:C.coral);
  return {svg:out,phase:f.done?`The final set is ${TH_setName(f.act)}. ${f.ok?'It contains the accepting state q2, so at least one sequence of guesses works.':f.act.length?'None of these states is accepting.':'Every thread of the computation has died out.'} Subset construction: each set becomes one state of a deterministic machine, so an NFA with n states needs at most 2ⁿ.`:`${m.say} Instead of guessing, keep every possibility: the machine is in all lit states at once.`};
 },
 three(s,f,X,project){
  const P=project([[0,0,0],[2,2,2],[-.5,-.5,-.5],[2.5,2.5,2.5]]),corner=a=>TH_ORDER.map(q=>a.includes(q)?2:0);
  const subsets=range(8).map(v=>TH_ORDER.filter((q,i)=>v>>i&1)),key=a=>a.join(','),seen=new Set(f.hist.map(key));let out='';
  for(let v=0;v<8;v++)for(let b=0;b<3;b++){const w=v^(1<<b);if(w>v)out+=line3(corner(subsets[v]),corner(subsets[w]),P,'#d6e2ea',1.5)}
  for(let i=1;i<f.hist.length;i++){if(key(f.hist[i])!==key(f.hist[i-1]))out+=arrow3(corner(f.hist[i-1]),corner(f.hist[i]),P,C.coral,2.5)}
  out+=sortedItems(subsets.map(a=>({at:corner(a),svg:P=>{const p=P(corner(a)),cur=key(a)===key(f.act),vis=seen.has(key(a));const lab=TH_setName(a),w=lab.length*8+16;return R(p[0]-w/2,p[1]-14,w,28,cur?C.blue:vis?C.pale:'#fff',cur||vis?C.blue:C.line,14)+TMF(p[0],p[1]+5,lab,13,cur?'#fff':vis?C.ink:C.muted,'middle','font-weight="650"')}})),P);
  return {svg:out,title:'Sets of states as cube corners',caption:`Each corner is one set of NFA states: a state of the equivalent deterministic machine. This input visits ${seen.size} of the 8 corners. Moving along an edge adds or removes one state.`};
 }});

const TH_LIGHT_NAMES={G:'Go',A:'Amber',R:'Walk',RA:'R+A'};
function TH_lightRun(events){let st='G',wait=false;const log=[];
 for(const ev of events){const from=st;let note;
  if(ev==='button'){if(st==='G'||st==='RA'){note=wait?'already requested':'request remembered';wait=true}else note='ignored for now'}
  else if(st==='G'){if(wait){st='A';wait=false;note='someone waiting: change'}else note='nobody waiting: stay'}
  else if(st==='A'){st='R';note='red: pedestrians cross'}else if(st==='R'){st='RA';note='crossing time over'}else{st='G';note='back to green'}
  log.push({ev,from,to:st,note})}
 return {st,wait,log}}
const TH_LIGHT_DEMO=['timer','button','timer','timer','timer','button','timer','timer'];
SCENE({id:'fa-traffic-light',name:'State machine in practice',tag:'A pedestrian crossing',
 definition:'Many everyday controllers are finite state machines: a few states, and events that move between them. The current state is all the controller needs to remember.',
 example:'A UK puffin crossing, the modern pedestrian crossing, cycles green → amber → red (walk) → red and amber → green; the older pelican crossing used flashing amber instead of red and amber. Pressing the button only matters when the lights are green; the timer moves everything else on.',
 desc:'A traffic light and pedestrian signal beside the controller’s state diagram; the latest event and its arrow are highlighted, with a short log of events.',
 dur:12,hint:'Press the button and fire the timer in any order. Some events change the state, some are only remembered, and some are ignored.',
 init:()=>({events:[]}),
 watch:p=>({events:TH_LIGHT_DEMO.slice(0,Math.min(TH_LIGHT_DEMO.length,Math.floor(p*(TH_LIGHT_DEMO.length+1))))}),
 ui:[{b:'Press the button',act:'press'},{b:'Timer fires',act:'tick'}],
 on:{press(s){if(s.events.length<40)s.events.push('button')},tick(s){if(s.events.length<40)s.events.push('timer')}},
 draw(s,f,X){
  const run=TH_lightRun(s.events),st=run.st,last=run.log[run.log.length-1];let out=heading('A crossing controller is a state machine');
  out+=R(40,58,70,190,C.dark,'none',14);
  [['R','#ef5a3c',96],['A','#f6b400',153],['G','#3fcf72',210]].forEach(([k,col,y])=>{const lit=st===k||(st==='RA'&&(k==='R'||k==='A'))||(st==='R'&&k==='R');out+=Ci(75,y,22,lit?col:'#4b5c66')});
  const walk=st==='R';out+=R(130,92,80,92,C.dark,'none',10)+TBF(170,128,walk?'WALK':'WAIT',15,walk?'#7ee08f':'#ff8a73')+TF(170,156,walk?'green figure':'red figure',13,'#c9d2d6');
  out+=R(130,200,80,38,run.wait?C.amberp:'#fff',run.wait?C.amber:C.line,8)+TBF(170,224,run.wait?'pressed':'button',13,run.wait?C.amber:C.muted);
  const m={pos:{G:[300,130],A:[515,130],R:[515,262],RA:[300,262]},labels:TH_LIGHT_NAMES,start:'G',edges:[['G','G','button / timer',0],['G','A','timer',0],['A','R','timer',0],['R','RA','timer',0],['RA','G','timer',0]]};
  out+=TH_net(m,{active:[st],used:last&&!(last.ev==='button'&&last.from!=='G')?[[last.from,last.to]]:[]});
  out+=TF(407,158,'(if waiting)',13,C.muted,'middle');
  out+=TBF(232,304,'Latest events',13,C.ink,'start');
  run.log.slice(-3).reverse().forEach((e,i)=>out+=TF(232,324+i*19,`${e.ev==='button'?'button':'timer'}: ${TH_LIGHT_NAMES[e.from]} → ${TH_LIGHT_NAMES[e.to]} (${e.note})`,13,i?C.muted:C.ink,'start'));
  if(!run.log.length)out+=TF(232,324,'No events yet: the lights rest on green.',13,C.muted,'start');
  return {svg:out,phase:last?`${last.ev==='button'?'Button pressed':'Timer fired'} in state ${TH_LIGHT_NAMES[last.from]}: ${last.note}. The controller remembers only its state and one “someone is waiting” flag, which is itself one extra bit of state.`:'The lights rest on green for cars until someone presses the button and the timer fires.'};
 }});

/* ---- Regular expression lesson ---- */
const TH_R2A=[
 {src:'ab*c',tokens:['a','b*','c'],pos:{S:[100,226],A:[300,226],F:[500,226]},start:'S',accept:['F'],list:[['S','A','a',0],['A','A','b',1],['A','F','c',2]],sample:'abbc',say:'Each letter becomes one arrow; b* becomes a loop you may go round any number of times, including none.'},
 {src:'(ab)*',tokens:['(','a','b',')*'],pos:{S:[200,226],A:[400,226]},start:'S',accept:['S'],list:[['S','A','a',1],['A','S','b',2]],sample:'abab',say:'The star turns the whole group into a cycle back to the start, and the start is accepting because zero repetitions are allowed.'},
 {src:'a(b|c)d',tokens:['a','(b|c)','d'],pos:{S:[80,226],A:[240,226],B:[400,226],F:[550,226]},start:'S',accept:['F'],list:[['S','A','a',0],['A','B','b',1],['A','B','c',1],['B','F','d',2]],sample:'acd',say:'A choice (b|c) becomes two arrows between the same pair of states.'}];
SCENE({id:'regex-to-automaton',name:'From pattern to machine',tag:'Every regular expression is an automaton',
 definition:'Any regular expression can be converted into a finite automaton that accepts exactly the strings the pattern matches, which is how many search tools run patterns.',
 example:'ab*c becomes three states: an arrow for a, a loop for b*, and an arrow for c into the accepting state.',
 desc:'A regular expression split into pieces above the automaton built from it; the piece being used and its arrow are highlighted as an input string is read.',
 dur:11,hint:'Choose a pattern and type a string using a, b, c and d. Each step lights the arrow and the piece of the pattern it came from.',
 init:()=>({i:0,input:TH_R2A[0].sample}),
 ui:[{choose:TH_R2A.map((r,i)=>[i,r.src]),label:'Pattern',get:s=>s.i,act:'pick'},{text:'Input',label:'Input',get:s=>s.input,act:'input',max:10}],
 on:{pick(s,v){s.i=Number(v);s.input=TH_R2A[s.i].sample},input(s,v){s.input=Array.from(v).filter(c=>'abcd'.includes(c)).slice(0,10).join('')}},
 trace(s){const r=TH_R2A[s.i];let st=r.start;const fr=[{pos:0,st,used:null,piece:-1}];
  for(let i=0;i<s.input.length;i++){const ch=s.input[i],e=r.list.find(e=>e[0]===st&&e[2]===ch);
   if(!e){fr.push({pos:i+1,st,dead:true,ch,used:null,piece:-1});return fr.concat([{pos:i+1,st,dead:true,ch,done:true,ok:false,piece:-1}])}
   fr.push({pos:i+1,st:e[1],used:[e[0],e[1]],piece:e[3]});st=e[1]}
  fr.push({pos:s.input.length,st,done:true,ok:r.accept.includes(st),piece:-1});return fr},
 draw(s,f,X){
  const r=TH_R2A[s.i];let out=heading('/'+r.src+'/ as a machine');
  const n=s.input.length;out+=TH_tape(s.input,f.pos,46,300-n*15,30,f.done);
  out+=TH_net({...r,edges:TH_pairs(r.list.map(e=>[e[0],e[1],e[2]]))},{active:[f.st],used:f.used?[f.used]:[],fail:f.dead||(f.done&&!f.ok)});
  const tw=r.tokens.map(t=>t.length*13+22),total=sum(tw)+(tw.length-1)*8;let x=300-total/2;
  out+=TF(300,284,'Pattern pieces',13,C.muted);
  r.tokens.forEach((t,i)=>{const on=i===f.piece;out+=R(x,294,tw[i],34,on?C.coralp:'#fff',on?C.coral:C.grid,8)+TMF(x+tw[i]/2,317,t,16,on?C.coral:C.ink,'middle','font-weight="700"');x+=tw[i]+8});
  if(f.done)out+=TB(300,364,f.ok?'Match ✓':'No match ✗',16,f.ok?C.green:C.coral);
  return {svg:out,phase:f.dead?`There is no arrow for “${f.ch}” from here, so the machine stops and the pattern does not match.`:f.done?(f.ok?'The whole input was read and the machine ends in an accepting state: the pattern matches.':'The input ran out before reaching an accepting state: no match.')+' '+r.say:r.say};
 }});

const TH_LIMIT_DEMO=[[2,2],[3,3],[3,2],[5,5],[5,3]];
function TH_counterRun(k,n,m){const steps=[];let c=0,dead=false;
 for(let i=0;i<n;i++){const before=c;c=Math.min(c+1,k-1);steps.push({ch:'a',c,stuck:before===c})}
 for(let i=0;i<m;i++){c-=1;if(c<0){dead=true}steps.push({ch:'b',c:dead?'×':c,dead});if(dead)break}
 for(let i=steps.length;i<n+m;i++)steps.push({ch:i<n?'a':'b',c:'×',dead:true});
 return {steps,accept:!dead&&c===0}}
SCENE({id:'regex-limits',name:'What patterns cannot do',tag:'No finite machine counts forever',
 definition:'A finite automaton, and so a regular expression, cannot check that a string is aⁿbⁿ (n a’s followed by exactly n b’s) for every n: it would need unlimited memory.',
 example:'With k states, the k + 1 prefixes a⁰ … aᵏ cannot all end in different states, so two counts i < j share one. Then aⁱbⁱ and aʲbⁱ end in the same state: the machine accepts both or rejects both, and one verdict is wrong. Balanced brackets fail for the same reason.',
 desc:'A string of a’s and b’s with the counting machine’s state under each letter, a row of counting states, and the machine’s verdict compared with the truth.',
 dur:13,hint:'Give the machine more or fewer states, then choose how many a’s and b’s. Find an input where the machine’s answer is wrong.',
 init:()=>({k:4,n:5,m:3}),
 watch(p){const [n,m]=TH_LIMIT_DEMO[Math.min(4,Math.floor(p*5))];return {k:4,n,m}},
 ui:[{range:'k',label:'States',min:2,max:7,get:s=>s.k,act:'k'},{range:'n',label:'a’s',min:0,max:9,get:s=>s.n,act:'n'},{range:'m',label:'b’s',min:0,max:9,get:s=>s.m,act:'m'}],
 on:{k(s,v){s.k=v},n(s,v){s.n=v},m(s,v){s.m=v}},
 draw(s){
  const run=TH_counterRun(s.k,s.n,s.m),truth=s.n===s.m,wrong=run.accept!==truth;let out=heading('Can a finite machine check aⁿbⁿ?');
  const L=s.n+s.m,cw=Math.min(32,552/Math.max(1,L)),x0=300-L*cw/2;
  if(!L)out+=TF(300,96,'(empty string: zero a’s and zero b’s)',13,C.muted);
  run.steps.forEach((st,i)=>{const x=x0+i*cw;out+=R(x+2,58,cw-4,32,st.ch==='a'?C.pale:C.purplep,'none',6)+TMF(x+cw/2,80,st.ch,17,C.ink);
   out+=R(x+2,96,cw-4,26,st.stuck?C.amberp:'#fff',st.stuck?C.amber:st.dead?C.coral:C.grid,5)+TMF(x+cw/2,114,String(st.c),14,st.dead?C.coral:C.ink)});
  out+=TF(x0-6,114,'state',13,C.muted,'end');
  const k=s.k,sp=Math.min(84,500/Math.max(1,k-1)),sx=300-(k-1)*sp/2,cy=200,last=run.steps.length?run.steps[run.steps.length-1].c:0;
  for(let i=0;i<k-1;i++){const x=sx+i*sp;out+=curveArrow(x+16,cy-10,x+sp-16,cy-10,-14,C.blue,1.8)+curveArrow(x+sp-16,cy+10,x+16,cy+10,-14,C.purple,1.8);
   out+=TF(x+sp/2,cy-24,'a',13,C.blue)+TF(x+sp/2,cy+33,'b',13,C.purple)}
  out+=TH_selfLoop(sx+(k-1)*sp,cy,20,'a',C.amber,2);
  for(let i=0;i<k;i++){const x=sx+i*sp,on=last===i;out+=Ci(x,cy,20,on?C.blue:'#fff',i===0?C.green:C.ink)+TBF(x,cy+5,i,15,on?'#fff':C.ink)}
  out+=TF(sx,cy+52,'0 = accept',13,C.green);
  out+=R(60,272,220,52,'#fff',C.grid,9)+TF(170,292,'Machine says',13,C.muted)+TB(170,314,run.accept?'accept':'reject',16,run.accept?C.green:C.coral);
  out+=R(320,272,220,52,'#fff',C.grid,9)+TF(430,292,'Truth: equal counts?',13,C.muted)+TB(430,314,truth?'yes':'no',16,truth?C.green:C.coral);
  out+=wrong?R(150,334,300,34,C.coralp,C.coral,8)+TB(300,356,'Fooled: the machine is wrong here',15,C.coral):T(300,356,s.n>=k?'Right this time, but try another b count':'Correct: the count fits in its states',14,C.muted);
  const stuck=run.steps.findIndex(x=>x.stuck);
  return {svg:out,phase:stuck>=0?`After ${k-1} a’s the machine is in its last counting state, so every further a lands in the same state (amber). It cannot tell ${k-1} a’s from ${k} or more; some input will fool it. Adding states only moves the problem further along.`:`With ${k} states the machine can count up to ${k-1} a’s. Here n = ${s.n} fits, so it answers correctly. Try more a’s than it has states.`};
 }});

const TH_REPL=[
 {name:'Dates',src:'(\\d\\d)/(\\d\\d)/(\\d{4})',flags:'gd',tpl:'$3-$2-$1',sample:'Due 14/11/2026 or 01/12/2026',say:'Groups capture day, month and year; the replacement writes them back in a new order, turning UK dates into ISO 8601 dates.'},
 {name:'Names',src:'(\\w+), (\\w+)',flags:'gd',tpl:'$2 $1',sample:'Lovelace, Ada',say:'Group 1 captures the surname and group 2 the first name; the replacement swaps them.'},
 {name:'Spaces',src:'\\s+',flags:'gd',tpl:' ',sample:'too    many   spaces',say:'No groups here: every run of whitespace is replaced by a single space.'}];
const TH_GCOL=[C.muted,C.blue,C.green,C.purple];
function TH_replace(r,text){
 const re=new RegExp(r.src,r.flags),inCol=Array(text.length).fill(-1),out=[];let m,cur=0;
 while((m=re.exec(text))!==null){if(!m[0].length){re.lastIndex++;continue}
  for(let i=m.index;i<m.index+m[0].length;i++)inCol[i]=0;
  for(let g=1;g<m.length;g++)if(m.indices[g])for(let i=m.indices[g][0];i<m.indices[g][1];i++)inCol[i]=g;
  for(let i=cur;i<m.index;i++)out.push([text[i],-1]);
  r.tpl.split(/(\$\d)/).filter(Boolean).forEach(tok=>{if(/^\$\d$/.test(tok)){const g=Number(tok[1]);Array.from(m[g]||'').forEach(c=>out.push([c,g]))}else Array.from(tok).forEach(c=>out.push([c,0]))});
  cur=m.index+m[0].length}
 for(let i=cur;i<text.length;i++)out.push([text[i],-1]);
 re.lastIndex=0;const first=new RegExp(r.src,r.flags.replace('g','')).exec(text);
 return {inCol,out,first}}
SCENE({id:'regex-replace',name:'Search and replace',tag:'Capture groups in practice',
 definition:'In practice, regular expressions find text and rewrite it. Brackets capture parts of each match as numbered groups, and $1, $2… put them back in the replacement.',
 example:'Search (\\d\\d)/(\\d\\d)/(\\d{4}) and replace with $3-$2-$1: 14/11/2026 becomes 2026-11-14.',
 desc:'The text before and after a search-and-replace, with each captured group coloured the same in both, and the captured values listed.',
 dur:10,hint:'Choose a rule and edit the text. Matching parts are underlined; each group keeps its colour as it moves.',
 init:()=>({i:0,text:TH_REPL[0].sample}),
 watch(p){const i=Math.min(2,Math.floor(p*3));return {i,text:TH_REPL[i].sample}},
 ui:[{choose:TH_REPL.map((r,i)=>[i,r.name]),label:'Rule',get:s=>s.i,act:'pick'},{text:'Text',label:'Text',get:s=>s.text,act:'text',max:30}],
 on:{pick(s,v){s.i=Number(v);s.text=TH_REPL[s.i].sample},text(s,v){s.text=v.slice(0,30)}},
 draw(s){
  const r=TH_REPL[s.i],text=s.text.slice(0,30),res=TH_replace(r,text);let out=heading('Find /'+r.src.replace(/\\\\/g,'\\')+'/');
  const maxL=Math.max(text.length,res.out.length,1),cw=Math.min(18,560/maxL),row=(chars,y,underline)=>{let o='';const x0=300-chars.length*cw/2;
   chars.forEach(([c,g],i)=>{const x=x0+i*cw;if(g>0)o+=R(x,y-24,cw,32,tint(TH_GCOL[g],.82),'none',3);if(g===0&&underline)o+=R(x,y-24,cw,32,'#eef2f4','none',3);
    o+=TMF(x+cw/2,y,c===' '?'·':c,Math.min(18,cw*1.1),g>0?TH_GCOL[g]:g===0?C.ink:C.muted,'middle',g>=0?'font-weight="700"':'');if(underline&&g>=0)o+=L(x+1,y+10,x+cw-1,y+10,C.amber,2)});return o};
  out+=TF(24,82,'Before',13,C.muted,'start')+row(Array.from(text).map((c,i)=>[c,res.inCol[i]]),122,true);
  out+=arrow(300,148,300,196,C.line,2.5)+R(318,158,170,28,'#fff',C.grid,6)+TMF(403,177,'→ '+(r.tpl===' '?'“ ”':r.tpl),14,C.ink);
  out+=TF(24,222,'After',13,C.muted,'start')+row(res.out,262,false);
  if(res.first&&res.first.length>1)res.first.slice(1).forEach((g,i)=>{const x=300+(i-(res.first.length-2)/2)*170;out+=R(x-76,300,152,34,tint(TH_GCOL[i+1],.82),'none',8)+TMF(x,322,`$${i+1} = ${g}`,15,TH_GCOL[i+1],'middle','font-weight="700"')});
  else out+=TF(300,322,res.first?'This rule has no capture groups.':'No match in this text.',14,C.muted);
  return {svg:out,phase:r.say+' Real search tools turn the pattern into an automaton first, so even long files are scanned in one pass.'};
 }});

/* ---- Turing machine lesson ---- */
// Draws 13 tape cells centred on the head (blank cells show a dot).
function TH_tapeWindow(tape,head,y,cw=40,x0=40){let out='';
 for(let i=0;i<13;i++){const idx=head-6+i,c=tape[idx]||'_',x=x0+i*cw,isH=idx===head;
  out+=R(x,y,cw-2,44,isH?C.amberp:'#fff',isH?C.amber:C.grid,4)+(c==='_'?TF(x+cw/2-1,y+28,'·',18,C.line):TMF(x+cw/2-1,y+30,c,21,C.ink))}
 const hx=x0+6*cw+cw/2-1;return out+`<polygon points="${hx},${y+50} ${hx-9},${y+64} ${hx+9},${y+64}" fill="${C.amber}"/>`}
const TH_BUILD={
 beaver:{rules:[['A','_','1','R','B'],['A','1','1','L','B'],['B','_','1','L','A'],['B','1','1','R','halt']],say:'The two-state “busy beaver”: it halts after 6 steps leaving four 1s, the most any two-state machine of this kind can write before halting.'},
 runaway:{rules:[['A','_','1','R','B'],['A','1','1','R','B'],['B','_','_','R','A'],['B','1','1','R','A']],say:'No rule ever leads to halt, so this machine runs to the right for ever, writing a 1 in every other cell.'},
 eraser:{rules:[['A','_','_','R','halt'],['A','1','_','R','A'],['B','_','_','L','halt'],['B','1','1','L','B']],say:'Starting on a blank cell, A halts at once. Edit the rules to make something more interesting.'}};
const TH_buildCopy=k=>({preset:k,rules:TH_BUILD[k].rules.map(r=>r.slice())});
const TH_CYCLE={2:['1','_'],3:['L','R'],4:['A','B','halt']};
SCENE({id:'tm-build',name:'Writing a rule table',tag:'Program a Turing machine',
 definition:'Programming a Turing machine means filling in its rule table: for every state and symbol read, what to write, which way to move and which state to enter next.',
 example:'With just two states and the symbols blank and 1 there are only a handful of rows, yet some tables halt quickly, some run for ever, and telling which is which gets hard fast.',
 desc:'A strip of tape with the read–write head, the machine’s state, and a four-row rule table whose write, move and next-state cells can be changed.',
 dur:12,hint:'Press a write, move or next cell to change that rule, then Step or Run. The machine starts on a blank tape in state A.',
 init:()=>TH_buildCopy('beaver'),
 ui:[{choose:[['beaver','Busy beaver'],['runaway','Runaway'],['eraser','Eraser']],label:'Start from',get:s=>s.preset,act:'preset'}],
 on:{preset(s,v){Object.assign(s,TH_buildCopy(v))},rule(s,a){const [i,c]=String(a).split(',').map(Number),opts=TH_CYCLE[c];s.rules[i][c]=opts[(opts.indexOf(s.rules[i][c])+1)%opts.length];s.preset='custom'}},
 trace(s){return TH_tmRun({start:'A',rules:s.rules},'')},
 draw(s,f,X){
  let out=heading('A two-state machine on a blank tape');out+=TH_tapeWindow(f.tape,f.head,50);
  const done=f.st==='halt'||f.st==='stuck',limit=!done&&X.k===X.n-1&&X.n>=80;
  out+=R(238,124,124,32,done?C.greenp:C.blue,'none',16)+TB(300,146,f.st==='halt'?'halted':f.st==='stuck'?'stuck':'state '+f.st,15,done?C.green:'#fff');
  const cols=[['state',70],['read',70],['write',80],['move',80],['next',90]],tx=34;let x=tx;
  cols.forEach(([h,w])=>{out+=TBF(x+w/2,180,h,13,C.muted);x+=w});
  s.rules.forEach((r,i)=>{const y=190+i*40,on=f.rule===i;x=tx;out+=R(tx-4,y-2,398,36,on?C.coralp:'none',on?C.coral:'none',7);
   r.forEach((v,j)=>{const w=cols[j][1],txt=v==='_'?'blank':v;if(j>=2)out+=hit(X,'rule',i+','+j,`Rule ${i+1} ${cols[j][0]}: ${txt}. Press to change.`,R(x+6,y+2,w-12,28,'#fff',C.blue,6)+TMF(x+w/2,y+21,txt,15,C.ink));else out+=TMF(x+w/2,y+21,txt,15,C.muted);x+=w})});
  const ones=Object.values(f.tape).filter(c=>c==='1').length;
  out+=counter(458,188,'steps',X.k,C.blue,120)+counter(458,244,'1s on tape',ones,C.purple,120);
  out+=TF(518,322,done?'Halted ✓':limit?'Still running…':'Running',14,done?C.green:limit?C.coral:C.muted);
  const pre=TH_BUILD[s.preset];
  return {svg:out,phase:done?`Halted after ${X.k} steps with ${ones} 1s on the tape. ${pre?pre.say:''}`:limit?`Still running after ${X.k} steps. This one may run for ever; no general method can decide that for every rule table.`:f.rule===null?(pre?pre.say:'Your own rule table: every state and symbol has exactly one rule.'):`State ${s.rules[f.rule][0]} reads ${s.rules[f.rule][1]==='_'?'a blank':s.rules[f.rule][1]}: write ${s.rules[f.rule][2]==='_'?'a blank':s.rules[f.rule][2]}, move ${s.rules[f.rule][3]==='R'?'right':'left'}, go to ${s.rules[f.rule][4]}.`};
 }});

function TH_regMachine(a,b){const fr=[{pc:1,a,b}];let pc=1;for(let n=0;n<40&&pc!==4;n++){if(pc===1)pc=b===0?4:2;else if(pc===2){b--;pc=3}else{a++;pc=1}fr.push({pc,a,b})}return fr}
function TH_rewrite(a,b){const N=k=>'S'.repeat(k)+'Z',fr=[];for(let j=0;j<=b;j++)fr.push('S'.repeat(j)+'add('+N(a)+','+N(b-j)+')');fr.push(N(a+b));return fr}
SCENE({id:'tm-church-turing',name:'Church–Turing thesis',tag:'Many models, one notion of computable',
 definition:'The Church–Turing thesis says that anything that can be computed by a step-by-step method can be computed by a Turing machine. Very different models turn out to compute exactly the same functions.',
 example:'Adding two numbers on a Turing machine, on a machine with two counters, and by rewriting symbols with rules all give the same answer, by different routes and in different numbers of steps.',
 desc:'Three columns compute a + b at the same time: a Turing machine tape, a register machine with its program and registers, and a term being rewritten by two rules.',
 dur:13,hint:'Choose a and b, then step. All three models reach the same answer; count how many steps each one needs.',
 init:()=>({a:2,b:3}),
 ui:[{range:'a',label:'a',min:0,max:4,get:s=>s.a,act:'a'},{range:'b',label:'b',min:0,max:4,get:s=>s.b,act:'b'}],
 on:{a(s,v){s.a=v},b(s,v){s.b=v}},
 trace(s){const tm=TH_tmRun(TH_TM.add,'1'.repeat(s.a)+'+'+'1'.repeat(s.b)),rm=TH_regMachine(s.a,s.b),rw=TH_rewrite(s.a,s.b),n=Math.max(tm.length,rm.length,rw.length);
  return range(n).map(k=>({k,tm:tm[Math.min(k,tm.length-1)],rm:rm[Math.min(k,rm.length-1)],rw:rw[Math.min(k,rw.length-1)],lens:[tm.length-1,rm.length-1,rw.length-1]}))},
 draw(s,f,X){
  let out=heading(`Three ways to compute ${s.a} + ${s.b}`);const ans=s.a+s.b,cols=[[10,'Turing machine'],[208,'Register machine'],[406,'Rewriting rules']];
  cols.forEach(([x,t],i)=>{const fin=f.k>=f.lens[i];out+=R(x,48,184,272,'#fff',fin?C.green:C.grid,10)+TB(x+92,72,t,15,C.ink)+counter(x+32,256,'steps',Math.min(f.k,f.lens[i]),fin?C.green:C.blue,120)});
  // Turing machine column: the whole tape, head marked.
  const tape=f.tm.tape,keys=Object.keys(tape).map(Number),lo=Math.min(0,...keys,f.tm.head),hi=Math.max(lo+4,...keys,f.tm.head),cw=Math.min(20,168/(hi-lo+1));
  for(let i=lo;i<=hi;i++){const x=18+(i-lo)*cw,c=tape[i]||'_',on=i===f.tm.head;out+=R(x,100,cw-2,30,on?C.amberp:'#fff',on?C.amber:C.grid,3)+(c==='_'?'':TMF(x+cw/2-1,121,c,14,C.ink))}
  out+=TF(102,152,'unary: 111 means 3',13,C.muted)+TMF(102,180,'state: '+(f.tm.st==='halt'?'halted':f.tm.st),13,C.ink)+TF(102,206,'turn + into 1,',13,C.muted)+TF(102,224,'rub out the last 1',13,C.muted);
  // Register machine column.
  ['1 if b = 0 goto 4','2 b ← b − 1','3 a ← a + 1; goto 1','4 halt'].forEach((ln,i)=>{const on=f.rm.pc===i+1;out+=R(216,90+i*26,168,22,on?C.coralp:'none','none',4)+TMF(222,106+i*26,ln,13,on?C.ink:C.muted,'start')});
  out+=R(230,200,62,40,C.pale,'none',7)+TF(261,214,'a',13,C.muted)+TBF(261,234,f.rm.a,16,C.blue)+R(300,200,62,40,C.pale,'none',7)+TF(331,214,'b',13,C.muted)+TBF(331,234,f.rm.b,16,C.purple);
  // Rewriting column.
  out+=TMF(414,104,'add(x,Sy) → S add(x,y)',13,C.muted,'start')+TMF(414,124,'add(x,Z) → x',13,C.muted,'start');
  const term=f.rw,lines=term.length>20?[term.slice(0,Math.ceil(term.length/2)),term.slice(Math.ceil(term.length/2))]:[term];
  lines.forEach((l,i)=>out+=TMF(498,170+i*20,l,13,C.ink));out+=TF(498,224,'S = “one more”, Z = zero',13,C.muted);
  const allDone=f.k>=Math.max(...f.lens);
  out+=allDone?R(110,330,380,36,C.greenp,C.green,9)+TB(300,353,`All three agree: ${s.a} + ${s.b} = ${ans}`,16,C.green):T(300,353,'Step to run all three side by side',14,C.muted);
  return {svg:out,phase:allDone?`Same function, different machinery: the Turing machine took ${f.lens[0]} steps, the register machine ${f.lens[1]} and rewriting ${f.lens[2]}. Every reasonable model of step-by-step computation has turned out to compute exactly the same functions.`:'Each model follows its own simple rules. None of them is “more powerful” than the others in what it can compute, only in how many steps it takes.'};
 }});

const TH_ABBR={right:'r',carry:'c',halt:'h',flip:'f'};
const TH_code=r=>`${TH_ABBR[r[0]]}${r[1]}→${r[2]}${r[3]}${TH_ABBR[r[4]]}`;
SCENE({id:'tm-universal',name:'Universal Turing machine',tag:'A program is just data',
 definition:'A universal Turing machine reads the rule table of another machine, written on its own tape, and simulates that machine step by step. It is the idea behind the stored-program computer.',
 example:'Write the +1 machine’s six rules on the tape, followed by the input 1011. The universal machine looks up the matching rule each step and applies it, ending with 1100.',
 desc:'One tape holding a program region (encoded rules) and a data region; the universal machine scans the rules to find the one matching the simulated state and symbol, then applies it.',
 dur:14,hint:'Choose which program sits on the tape and edit the data. Step to watch the lookup: compare each rule with the current state and symbol, then apply the match.',
 init:()=>({m:'inc',input:'1011'}),
 ui:[{choose:[['inc','+1 program'],['flip','Flip program']],label:'Program',get:s=>s.m,act:'machine'},{text:'Data',label:'Data',get:s=>s.input,act:'input',max:6}],
 on:{machine(s,v){s.m=v},input(s,v){s.input=TH_bits(v,6)}},
 trace(s){const m=TH_TM[s.m],sim=TH_tmRun(m,s.input),fr=[{sim:0,scan:-1}];
  for(let i=0;i+1<sim.length;i++){const ri=sim[i+1].rule;if(ri===null||ri===undefined)break;for(let j=0;j<=ri;j++)fr.push({sim:i,scan:j,match:j===ri});fr.push({sim:i+1,scan:ri,applied:true})}
  fr.push({sim:sim.length-1,scan:-1,done:true});return fr.map((x,k)=>({...x,sims:sim,uk:k}))},
 draw(s,f,X){
  const m=TH_TM[s.m],sf=f.sims[f.sim],rules=m.rules;let out=heading('One tape: the program, then the data');
  const rw=Math.min(62,372/rules.length);
  out+=R(6,58,rules.length*rw+8,58,C.purplep,'none',8)+TF(10,134,'program region (the rules, encoded)',13,C.purple,'start');
  rules.forEach((r,j)=>{const x=10+j*rw,on=f.scan===j,col=on?(f.match||f.applied?C.green:C.amber):C.purple;
   out+=R(x,64,rw-4,46,on?(f.match||f.applied?C.greenp:C.amberp):'#fff',col,6)+TMF(x+(rw-4)/2,93,TH_code(r),13,C.ink);
   if(on)out+=`<polygon points="${fmt(x+(rw-4)/2)},116 ${fmt(x+(rw-4)/2-7)},128 ${fmt(x+(rw-4)/2+7)},128" fill="${col}"/>`});
  const sx=Math.max(rules.length*rw+22,392);out+=TBF(sx,94,'#',20,C.muted);
  const dw=24,d0=sx+16;for(let i=0;i<7;i++){const idx=sf.head-3+i,c=sf.tape[idx]||'_',x=d0+i*dw,on=idx===sf.head;out+=R(x,64,dw-2,46,on?C.amberp:'#fff',on?C.amber:C.grid,4)+(c==='_'?TF(x+dw/2-1,92,'·',16,C.line):TMF(x+dw/2-1,94,c,17,C.ink))}
  out+=TF(d0+84,134,'data region',13,C.blue);
  out+=R(40,160,240,44,'#fff',C.grid,9)+TF(160,178,'simulated state, symbol',13,C.muted)+TMF(160,197,`${sf.st} , ${sf.tape[sf.head]||'blank'}`,15,C.ink,'middle','font-weight="700"');
  const scans=f.uk,simSteps=f.sim;
  out+=counter(320,158,'simulated steps',simSteps,C.blue,120)+counter(452,158,'universal steps',scans,C.purple,124);
  out+=TF(300,240,'Rule code: state, read → write, move, next state (r = right, c = carry, f = flip, h = halt)',13,C.muted);
  const now=f.done?(sf.st==='halt'?'The simulated machine has halted.':'No rule matches, so the simulation stops.'):f.applied?`Applied ${TH_code(rules[f.scan])} to the data region.`:f.scan>=0?(f.match?`${TH_code(rules[f.scan])} matches (${sf.st}, ${sf.tape[sf.head]||'_'}).`:`${TH_code(rules[f.scan])} does not match; try the next rule.`):'Start: the universal machine reads the program region first.';
  out+=T(300,282,now,15,f.match||f.applied?C.green:C.ink);
  const final=Object.keys(f.sims[f.sims.length-1].tape).map(Number).sort((a,b)=>a-b).map(k=>f.sims[f.sims.length-1].tape[k]).join('');
  if(f.done)out+=R(110,312,380,38,C.greenp,C.green,9)+TB(300,336,`Result on the data region: ${final||'(blank)'}`,15,C.green);
  return {svg:out,phase:f.done?`The universal machine needed ${scans} steps to simulate ${simSteps}: slower, but it can run any machine whose rules are written on its tape. Change the program region and the same machine does something else.`:'The universal machine never changes. Only the program region differs between tasks, just as one computer runs many programs stored in memory.'};
 }});

/* ---- Halting problem lesson ---- */
function TH_collatz(n){const a=[n];while(n!==1&&a.length<400){n=n%2?3*n+1:n/2;a.push(n)}return a}
SCENE({id:'halting-collatz',name:'Why not just run it?',tag:'Waiting cannot decide halting',
 definition:'Running a program and waiting cannot settle whether it halts: if it has not stopped yet, it might stop later or never. There is no point at which waiting longer becomes pointless.',
 example:'“While n ≠ 1: halve n if it is even, otherwise replace it by 3n + 1.” Starting at 27 it takes 111 steps and climbs to 9232 before reaching 1. Nobody has proved it halts for every starting number.',
 desc:'A chart of the values a Collatz program passes through, on a logarithmic scale, with a dashed line marking how long a tester is willing to wait.',
 dur:12,hint:'Pick a starting number and set your patience. If the program has not halted by your deadline, you cannot tell “slow” from “never”.',
 init:()=>({n:27,patience:60}),
 watch:p=>({n:27,patience:Math.round(10+p*130),reveal:p}),
 ui:[{range:'n',label:'Start n',min:1,max:100,get:s=>s.n,act:'n'},{range:'patience',label:'Patience',min:5,max:150,get:s=>s.patience,act:'pat'},{b:'n = 27',act:'n27'}],
 on:{n(s,v){s.n=v},pat(s,v){s.patience=v},n27(s){s.n=27}},
 draw(s){
  const seq=TH_collatz(s.n),steps=seq.length-1,peak=Math.max(...seq),span=Math.max(steps,s.patience,10);let out=heading('while n ≠ 1: n = n / 2 if even, else 3n + 1');
  const X0=60,X1=580,Y0=290,Y1=60,xs=i=>X0+(X1-X0)*i/span,ys=v=>Y0-(Y0-Y1)*Math.log10(v)/4.2;
  for(const v of [1,10,100,1000,10000]){out+=L(X0,ys(v),X1,ys(v),'#e3ebef',1)+TF(X0-6,ys(v)+4,v,13,C.muted,'end')}
  const shown=s.reveal===undefined?seq.length:Math.max(2,Math.ceil(seq.length*Math.min(1,s.reveal*1.2)));
  const pts=seq.slice(0,shown).map((v,i)=>[xs(i),ys(v)]),seen=pts.slice(0,Math.min(pts.length,s.patience+1)),late=pts.slice(Math.min(pts.length-1,s.patience));
  if(late.length>1)out+=P('M'+late.map(p=>p.map(fmt).join(' ')).join('L'),'#b9c9d3',2);
  if(seen.length>1)out+=P('M'+seen.map(p=>p.map(fmt).join(' ')).join('L'),C.blue,2.4);
  const px=xs(Math.min(s.patience,span));out+=L(px,Y1-4,px,Y0,C.coral,2,'stroke-dasharray="6 5"')+TF(px,Y1-10,'your deadline',13,C.coral,px>500?'end':px<100?'start':'middle');
  out+=TF(X0,Y0+20,'0',13,C.muted)+TF(X1,Y0+20,span+' steps',13,C.muted,'end');
  const ok=steps<=s.patience;
  out+=R(40,318,250,48,ok?C.greenp:C.amberp,ok?C.green:C.amber,9)+TF(165,336,'Your test',13,C.muted)+TB(165,357,ok?'halted ✓':'gave up — still running?',15,ok?C.green:C.amber);
  out+=R(310,318,250,48,'#fff',C.grid,9)+TF(435,336,'Truth for n = '+s.n,13,C.muted)+TB(435,357,`halts after ${steps} steps (peak ${peak})`,14,C.ink);
  return {svg:out,phase:ok?`It halted within your deadline, so this time waiting gave an answer. But a “no” from waiting is never reliable: you only ever see the blue part.`:`Your deadline passed at step ${s.patience}, but this run needs ${steps}. Waiting cannot distinguish “slow” from “never”, which is why halting needs a cleverer test, and Turing showed none exists.`};
 }});

const TH_RED={
 hello:{q:'Does it ever print “hello”?',short:'prints hello?',code:['run P on w','(output hidden)','print "hello"'],yes:'prints hello'},
 line:{q:'Does it ever reach line 10?',short:'reaches line 10?',code:['run P on w','line 10: stop'],yes:'reaches line 10'},
 virus:{q:'Does it ever delete a file?',short:'deletes a file?',code:['run P on w','(in a sandbox)','delete a file'],yes:'deletes a file'}};
SCENE({id:'halting-reduction',name:'Reduction',tag:'If you could decide X, you could decide halting',
 definition:'A reduction turns one problem into another. If a decider for question X would let us decide halting, then X is undecidable too.',
 example:'To ask “does P halt on w?”, build P′: “run P on w, then print hello”. P′ prints hello exactly when P halts, so a perfect hello-detector would be a halting detector.',
 desc:'A chain of boxes: a program P and input w, the built program P′, an imagined decider for question X, its answer, and the conclusion that halting would be decided.',
 dur:13,hint:'Choose the question and whether P halts. Step through the construction to see that the X-decider’s answer always equals “does P halt?”.',
 init:()=>({x:'hello',p:'halts'}),
 ui:[{choose:Object.keys(TH_RED).map(k=>[k,{hello:'Prints hello?',line:'Reaches line 10?',virus:'Deletes a file?'}[k]]),label:'Question X',get:s=>s.x,act:'x'},{choose:[['halts','P halts'],['loops','P loops']],label:'Program P',get:s=>s.p,act:'p'}],
 on:{x(s,v){s.x=v},p(s,v){s.p=v}},
 trace(){return range(6).map(k=>({k}))},
 draw(s,f,X){
  const r=TH_RED[s.x],halts=s.p==='halts',k=f.k;let out=heading('Reduce halting to “'+r.short+'”');
  out+=R(10,56,96,100,k>=0?C.pale:'#fff',C.blue,9)+TBF(58,78,'P',15,C.blue);
  (halts?['count to','a million,','then stop']:['while true:','  pass']).forEach((l,i)=>out+=TMF(18,100+i*17,l,13,C.ink,'start','xml:space="preserve"'));
  out+=TF(58,150,'input w',13,C.muted);
  out+=arrow(106,106,118,106,C.line,2.2);
  out+=R(120,56,150,100,k>=1?C.purplep:'#fff',k>=1?C.purple:C.grid,9)+TBF(195,76,'P′ =',14,C.purple);
  if(k>=1)r.code.forEach((ln,i)=>out+=TMF(130,98+i*18,ln,13,C.ink,'start'));
  out+=arrow(270,106,282,106,C.line,2.2);
  out+=R(284,56,112,100,k>=2?C.amberp:'#fff',k>=2?C.amber:C.grid,9)+TBF(340,80,'X-decider',14,k>=2?C.amber:C.muted)+TF(340,102,'(imagined)',13,C.muted)+TF(340,126,'asks about P′',13,C.ink);
  out+=arrow(396,106,408,106,C.line,2.2);
  out+=R(410,56,70,100,k>=3?(halts?C.greenp:C.coralp):'#fff',k>=3?(halts?C.green:C.coral):C.grid,9)+(k>=3?TB(445,112,halts?'yes':'no',18,halts?C.green:C.coral):TF(445,112,'?',16,C.muted));
  out+=arrow(480,106,492,106,C.line,2.2);
  out+=R(494,56,98,100,k>=4?C.pale:'#fff',k>=4?C.blue:C.grid,9)+(k>=4?TBF(543,100,halts?'P halts':'P never',14,C.blue)+TBF(543,120,halts?'on w':'halts',14,C.blue):TF(543,110,'…',16,C.muted));
  out+=TF(300,180,`P′ ${r.yes} exactly when P halts on w.`,14,k>=1?C.ink:C.muted);
  const lines=['Step 1: take any program P and input w.','Step 2: build P′, which only reaches the last line if P halts.','Step 3: hand P′ to the imagined decider for “'+r.q+'”','Step 4: its answer is '+(halts?'yes':'no')+', because P '+(halts?'halts':'loops for ever')+'.','Step 5: so the X-decider would decide halting for any P and w.','Step 6: halting is undecidable, so no X-decider can exist.'];
  lines.slice(0,k+1).forEach((ln,i)=>out+=TF(30,206+i*22,ln,13,i===k?C.ink:C.muted,'start'));
  if(k>=5)out+=R(180,334,240,34,C.coralp,C.coral,9)+TB(300,357,'X is undecidable too',15,C.coral);
  return {svg:out,phase:k>=5?`Any question about what programs do, like “${r.q}”, can be wired up this way, so none of them has a perfect general decider.`:`If P ${halts?'halts, P′ moves on to its last line':'loops for ever, P′ never reaches its last line'}, so the decider for X would answer ${halts?'yes':'no'}: the same answer as “does P halt on w?”.`};
 }});

const TH_RICE=[
 ['Does the code contain a while loop?','t','Just read the text and look.'],
 ['Does it ever divide by zero?','b','Depends on what happens when it runs.'],
 ['Is the program longer than 100 lines?','t','Count the lines.'],
 ['Does it ever modify other files (a virus)?','b','Behaviour: undecidable in general.'],
 ['Does it halt on every input?','b','A stronger form of the halting problem.'],
 ['Does it mention a variable called x?','t','A search through the text.'],
 ['Does it return 0 when given 5?','b','You would have to know what it computes.'],
 ['Does it follow the language’s grammar?','t','Parsers check this in finite time.']];
SCENE({id:'halting-rice',name:'Rice’s theorem',tag:'Behaviour versus text',
 definition:'Rice’s theorem: every non-trivial question about what a program does (its behaviour) is undecidable. Questions about the program’s text can often be answered.',
 example:'“Does this code contain the word while?” is easy. “Does this code ever divide by zero?” has no perfect general checker, so real tools answer “yes”, “no” or “maybe”.',
 desc:'Eight questions about programs, each with buttons to sort it as a question about the text or about behaviour, and a check that marks each choice right or wrong.',
 dur:12,hint:'For each question, choose “text” or “behaviour”, then press Check. Behaviour questions are the undecidable ones.',
 init:()=>({guess:{},reveal:false}),
 watch(p){const k=Math.min(8,Math.floor(p*9.5)),g={};for(let i=0;i<k;i++)g[i]=TH_RICE[i][1];return {guess:g,reveal:k>=8}},
 ui:[{b:'Check my answers',act:'check'}],
 on:{set(s,a){const [i,v]=String(a).split(',');s.guess[i]=s.guess[i]===v?undefined:v;s.reveal=false},check(s){s.reveal=true}},
 draw(s,f,X){
  let out=heading('Text or behaviour?');out+=TBF(468,56,'text',13,C.green)+TBF(546,56,'behaviour',13,C.purple);
  let right=0;
  TH_RICE.forEach(([q,kind,why],i)=>{const y=64+i*36,g=s.guess[i],ok=g===kind;if(s.reveal&&ok)right++;
   out+=R(10,y,414,30,s.reveal&&g?(ok?C.greenp:C.coralp):i%2?'#f6f9fb':'#fff','none',6)+TF(20,y+20,q,13,C.ink,'start');
   if(s.reveal&&g)out+=TBF(412,y+20,ok?'✓':'✗',15,ok?C.green:C.coral,'end');
   [['t',468,C.green],['b',546,C.purple]].forEach(([v,x,col])=>{const sel=g===v;out+=hit(X,'set',i+','+v,`${q} — ${v==='t'?'about the text':'about behaviour'}${sel?', chosen':''}. Press to choose.`,R(x-34,y+2,68,26,sel?col:'#fff',col,13)+TBF(x,y+20,sel?'●':'○',14,sel?'#fff':col))})});
  out+=s.reveal?R(110,356-8,380,30,'#fff',C.grid,8)+TB(300,368-4,`${right} of 8 sorted correctly`,15,right===8?C.green:C.ink):'';
  const wrong=s.reveal?TH_RICE.findIndex((r,i)=>s.guess[i]&&s.guess[i]!==r[1]):-1;
  return {svg:out,phase:s.reveal?(wrong>=0?`“${TH_RICE[wrong][0]}” is about ${TH_RICE[wrong][1]==='t'?'the text':'behaviour'}: ${TH_RICE[wrong][2]} `:'')+'Behaviour questions are undecidable in general (Rice’s theorem), so antivirus tools and code checkers approximate: they sometimes say “maybe”.':'Text questions only need you to read the program. Behaviour questions need you to know what it will do when it runs, and that is where undecidability bites.'};
 }});

/* ---- P versus NP lesson ---- */
const TH_SPEEDS=[1,10,100,1000,1e6];
const TH_GROW=[['n²',B=>Math.floor(Math.sqrt(B)),C.green],['n³',B=>Math.floor(Math.cbrt(B)),C.blue],['2ⁿ',B=>Math.floor(Math.log2(B)),C.amber],['n!',B=>{let n=1,f=1;while(f*(n+1)<=B){n++;f*=n}return n},C.coral]];
const TH_big=v=>v>=1e9?(v/1e9).toFixed(1)+' billion':v>=1e6?(v/1e6).toFixed(1)+' million':v>=1e4?Math.round(v/1e3)+' thousand':String(v);
SCENE({id:'pnp-growth',name:'Faster computers do not help',tag:'Polynomial versus exponential',
 definition:'For a polynomial-time algorithm, a faster computer lets you solve much bigger problems. For an exponential one, even a million-times-faster computer adds only a few items.',
 example:'In one hour at a billion steps a second, an n² method handles about 1.9 million items; a 2ⁿ method handles 41. A million times faster: about 1.9 billion items, but only 61.',
 desc:'Horizontal bars on a logarithmic scale showing the largest problem size solvable in one hour for n², n³, 2ⁿ and n! steps, at a chosen computer speed.',
 dur:11,hint:'Make the computer faster and watch how much bigger each problem can get. The polynomial bars leap; the exponential ones barely move.',
 init:()=>({sp:0}),
 watch:p=>({sp:Math.min(4,Math.floor(p*5))}),
 ui:[{choose:TH_SPEEDS.map((v,i)=>[i,['×1','×10','×100','×1000','×10⁶'][i]]),label:'Computer speed',get:s=>s.sp,act:'sp'}],
 on:{sp(s,v){s.sp=Number(v)}},
 draw(s){
  const speed=TH_SPEEDS[s.sp],B=3.6e12*speed;let out=heading('Largest problem solved in one hour');
  out+=TF(300,54,`${['1','10','100','1000','1 000 000'][s.sp]}× a computer doing a billion steps per second`,14,C.muted);
  const X0=110,X1=560,xs=v=>X0+(X1-X0)*Math.log10(Math.max(1,v))/10;
  for(let e=0;e<=10;e+=2){const x=xs(10**e);out+=L(x,72,x,300,'#e3ebef',1)+TF(x,318,e===0?'1':'10'+(e===10?'¹⁰':'⁰¹²³⁴⁵⁶⁷⁸⁹'[e]),13,C.muted)}
  TH_GROW.forEach(([nm,fn,col],i)=>{const y=86+i*54,n=fn(B),base=fn(3.6e12);
   out+=TB(X0-14,y+24,nm,17,col,'end')+R(X0,y,Math.max(4,xs(n)-X0),36,col,'none',6);
   const lab=`n = ${TH_big(n)}`+(s.sp?(i<2?`  (×${fmt(n/base)})`:`  (+${n-base})`):'');
   const inside=xs(n)-X0>220;out+=TF(inside?X0+10:xs(n)+8,y+23,lab,14,inside?'#fff':C.ink,'start','font-weight="650"')});
  out+=TF(300,344,'Polynomial: speed multiplies the size you can handle. Exponential: it only adds a little.',14,C.ink);
  const n2=TH_GROW[0][1](B),e2=TH_GROW[2][1](B);
  return {svg:out,phase:`At this speed: n² reaches about ${TH_big(n2)} items, 2ⁿ only ${e2}. That is why computer scientists care whether a problem has a polynomial-time algorithm, and why P versus NP matters.`};
 }});

const TH_GRAPHS={
 map:{nodes:{A:[70,110],B:[70,270],C:[170,190],D:[270,110],E:[270,270],F:[370,190],G:[370,320]},edges:[['A','B'],['A','C'],['B','C'],['C','D'],['C','E'],['D','E'],['D','F'],['E','F'],['E','G'],['F','G']]},
 k4:{nodes:{A:[110,110],B:[330,110],C:[110,300],D:[330,300]},edges:[['A','B'],['A','C'],['A','D'],['B','C'],['B','D'],['C','D']]}};
const TH_PAL=['#fff','#e8735a','#4a9fd8','#f2c14e'],TH_PALN=['none','red','blue','yellow'];
function TH_colourSearch(g){const ids=Object.keys(g.nodes),fr=[],col={};let tries=0,found=null;
 const ok=(v,c)=>g.edges.every(([a,b])=>!((a===v&&col[b]===c)||(b===v&&col[a]===c)));
 (function go(i){if(found||fr.length>140)return;if(i===ids.length){found={...col};return}
  for(let c=1;c<=3&&!found;c++){tries++;const good=ok(ids[i],c);col[ids[i]]=c;fr.push({col:{...col},node:ids[i],c,good,tries});if(good)go(i+1);delete col[ids[i]]}})(0);
 fr.push({col:found||{},done:true,found:!!found,tries});return fr}
SCENE({id:'pnp-colouring',name:'Colouring a map',tag:'Easy to check, hard to find',
 definition:'Graph 3-colouring asks: can every node get one of three colours so that no edge joins two nodes of the same colour? Checking a colouring is quick; finding one may need search. It is NP-complete.',
 example:'Timetabling exams so that no student has two at once is a colouring problem: exams are nodes, shared students are edges, time slots are colours.',
 desc:'A graph whose nodes can be coloured red, blue or yellow; clashing edges turn coral. A backtracking search tries colours node by node and counts its attempts.',
 dur:14,hint:'Press nodes to colour them yourself; clashes show instantly. Then Step or Run to watch a backtracking search. Try the four-node graph too.',
 init:()=>({g:'map',col:{}}),
 ui:[{choose:[['map','Seven nodes'],['k4','Four, all joined']],label:'Graph',get:s=>s.g,act:'g'}],
 on:{g(s,v){s.g=v;s.col={}},node(s,id){s.col[id]=((s.col[id]||0)+1)%4}},
 trace(s){return [{col:s.col,mine:true}].concat(TH_colourSearch(TH_GRAPHS[s.g]))},
 draw(s,f,X){
  const g=TH_GRAPHS[s.g],col=f.col;let out=heading(f.mine?'Colour it so no edge joins equal colours':'Backtracking search');
  let clashes=0;
  for(const [a,b] of g.edges){const p=g.nodes[a],q=g.nodes[b],bad=col[a]&&col[a]===col[b];if(bad)clashes++;out+=L(p[0],p[1],q[0],q[1],bad?C.coral:C.line,bad?4.5:2.5)}
  for(const id in g.nodes){const [x,y]=g.nodes[id],c=col[id]||0,cur=!f.mine&&f.node===id;
   out+=hit(X,'node',id,`Node ${id}: ${TH_PALN[c]}. Press to change colour.`,Ci(x,y,24,TH_PAL[c],cur?C.ink:C.muted)+TBF(x,y+5,id,15,C.ink));if(cur)out+=Ci(x,y,31,'none',f.good?C.green:C.coral)}
  const coloured=Object.values(col).filter(Boolean).length,n=Object.keys(g.nodes).length;
  out+=R(410,64,176,96,'#fff',C.grid,9)+TF(498,86,'Check (verifier)',13,C.muted)+TBF(498,112,clashes?clashes+' clash'+(clashes>1?'es':''):coloured===n?'valid ✓':'no clashes yet',15,clashes?C.coral:coloured===n?C.green:C.ink)+TF(498,138,`${coloured} of ${n} coloured`,13,C.muted);
  if(!f.mine)out+=counter(438,176,'colours tried',f.tries,C.purple,120);
  if(f.done)out+=R(400,244,190,40,f.found?C.greenp:C.coralp,f.found?C.green:C.coral,9)+TB(495,269,f.found?'Found a colouring':'Impossible with 3',15,f.found?C.green:C.coral);
  out+=TF(495,316,'Checking: look at each',13,C.muted)+TF(495,334,'edge once. Finding: may',13,C.muted)+TF(495,352,'need to try 3ⁿ colourings.',13,C.muted);
  return {svg:out,phase:f.mine?'Checking a proposed colouring takes one look per edge, which is why 3-colouring is in NP. Finding one is another matter: no known method is fast for every graph.':f.done?(f.found?`The search found a valid colouring after ${f.tries} attempts by backing up whenever it hit a clash.`:`All ${f.tries} attempts failed: four nodes all joined to each other need four colours.`)+' 3-colouring is NP-complete: a fast method for it would give fast methods for every problem in NP.':`Try ${TH_PALN[f.c]} for ${f.node}: ${f.good?'no clash, so move on to the next node.':'it clashes with a neighbour, so try the next colour or back up.'}`};
 }});

const TH_CITIES={
 a:{pts:[[70,190],[160,80],[200,300],[300,170],[340,60],[380,300]],say:'From some starting cities the greedy tour is noticeably longer: always taking the nearest city can strand you far from home. Try each start.'},
 b:{pts:[[60,90],[120,300],[220,150],[300,320],[360,90],[390,230]],say:'Greedy is quick and often close, but it gives no guarantee of finding the shortest tour.'}};
const TH_dist=(p,q)=>Math.hypot(p[0]-q[0],p[1]-q[1]);
const TH_tourLen=(pts,t)=>t.reduce((a,c,i)=>a+TH_dist(pts[c],pts[t[(i+1)%t.length]]),0);
function TH_best(pts){const n=pts.length,rest=range(n).slice(1);let best=null,bl=Infinity,count=0;
 (function perm(a,used){if(a.length===n){count++;const l=TH_tourLen(pts,a);if(l<bl-1e-9){bl=l;best=a.slice()}return}for(const c of rest)if(!used.has(c)){used.add(c);a.push(c);perm(a,used);a.pop();used.delete(c)}})([0],new Set());
 return {tour:best,len:bl,count}}
function TH_greedy(pts,start){const t=[start],left=new Set(range(pts.length).filter(i=>i!==start));while(left.size){const last=pts[t[t.length-1]];let b=null,bd=Infinity;for(const c of left){const d=TH_dist(last,pts[c]);if(d<bd){bd=d;b=c}}t.push(b);left.delete(b)}return t}
SCENE({id:'pnp-tsp',name:'Heuristics and approximation',tag:'Good answers fast',
 definition:'When an exact answer is too slow to find, a heuristic finds a good answer quickly without a guarantee. The travelling salesperson problem asks for the shortest round trip through every city.',
 example:'Nearest neighbour: from each city, go to the closest unvisited one. With 6 cities there are only 60 different round trips to check, but with 20 there are about 6 × 10¹⁶.',
 desc:'Six cities with a greedy nearest-neighbour tour drawn step by step, then the shortest possible tour overlaid, with both lengths compared.',
 dur:13,hint:'Press a city to start the greedy tour there, or choose another map. Step to build the tour, then compare it with the best one found by checking every route.',
 init:()=>({set:'a',start:0}),
 ui:[{choose:[['a','Map 1'],['b','Map 2']],label:'Map',get:s=>s.set,act:'set'}],
 on:{set(s,v){s.set=v;s.start=0},start(s,i){s.start=Number(i)}},
 trace(s){const pts=TH_CITIES[s.set].pts,g=TH_greedy(pts,s.start),fr=[];for(let k=1;k<=g.length;k++)fr.push({k,g});fr.push({k:g.length,g,closed:true});fr.push({k:g.length,g,closed:true,best:TH_best(pts)});return fr},
 draw(s,f,X){
  const c=TH_CITIES[s.set],pts=c.pts,n=pts.length;let out=heading('Nearest neighbour versus the best tour');
  if(f.best){const t=f.best.tour;t.forEach((a,i)=>{const p=pts[a],q=pts[t[(i+1)%n]];out+=L(p[0],p[1],q[0],q[1],C.green,7,'opacity=".35"')})}
  for(let i=0;i+1<f.k;i++){const p=pts[f.g[i]],q=pts[f.g[i+1]];out+=arrow(p[0],p[1],q[0],q[1],C.blue,2.6)}
  if(f.closed){const p=pts[f.g[n-1]],q=pts[f.g[0]];out+=arrow(p[0],p[1],q[0],q[1],C.blue,2.6,9,'stroke-dasharray="6 4"')}
  pts.forEach((p,i)=>{const st=i===s.start,vis=f.g.slice(0,f.k).includes(i);out+=hit(X,'start',i,`City ${i+1}${st?', the start':''}. Press to start here.`,Ci(p[0],p[1],15,st?C.blue:vis?C.pale:'#fff',C.blue)+TBF(p[0],p[1]+5,i+1,14,st?'#fff':C.ink))});
  const gl=f.closed?TH_tourLen(pts,f.g):null;
  out+=R(420,64,170,60,'#fff',C.grid,9)+TF(505,84,'Greedy tour',13,C.blue)+TBF(505,110,gl?Math.round(gl)+' units':`${f.k} of ${n} cities`,16,C.blue);
  if(f.best){const ratio=gl/f.best.len;out+=R(420,134,170,60,'#fff',C.grid,9)+TF(505,154,`Best of ${f.best.count/2} tours`,13,C.green)+TBF(505,180,Math.round(f.best.len)+' units',16,C.green)+TB(505,222,ratio>1.0005?`greedy is ${Math.round((ratio-1)*100)}% longer`:'greedy found the best',14,ratio>1.0005?C.coral:C.green)}
  out+=TF(505,262,'Round trips to check:',13,C.muted);[[6,'60'],[10,'181 440'],[20,'6 × 10¹⁶']].forEach(([k,v],i)=>out+=TF(505,282+i*20,`${k} cities: ${v}`,13,C.ink));
  return {svg:out,phase:f.best?`${c.say} Checking all ${f.best.count/2} distinct tours is fine for 6 cities, hopeless for 60. Many real routing tools use heuristics like this and settle for a slightly longer route.`:f.closed?'Every city visited: return home to close the tour.':`Nearest neighbour: from city ${f.g[f.k-1]+1}, go to the closest city not yet visited.`};
 }});
