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
 example:'colou?r matches both “color” and “colour”. Every regular expression can be turned into a finite automaton, and back again.',
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
  out+=T(x0+n*cw+12,yD+20,'D does the',13,C.coral,'start')+T(x0+n*cw+12,yD+36,'opposite',13,C.coral,'start');
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
