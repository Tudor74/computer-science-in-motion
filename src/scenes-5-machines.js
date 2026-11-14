/* ===================== Stage 5 · Machines ===================== */
/* ---- A tiny accumulator machine shared by fetch–decode–execute and machine code ---- */
const MA_OPS={HALT:0,LOAD:1,ADD:2,SUB:3,STORE:4,JUMP:5};
const MA_OPNAMES=['HALT','LOAD','ADD','SUB','STORE','JUMP'];
const MA_OPDESC={HALT:'stop the machine',LOAD:'copy from memory into ACC',ADD:'ACC + memory → ACC',SUB:'ACC − memory → ACC',STORE:'copy ACC into memory',JUMP:'continue from another address'};
function MA_program(s){return [{op:'LOAD',arg:5},{op:s.op,arg:6},{op:'STORE',arg:7},{op:'HALT',arg:0},0,s.a,s.b,0]}
const MA_cellText=v=>typeof v==='object'?(v.op==='HALT'?'HALT':v.op+' '+v.arg):String(v);
function MA_fdeTrace(s){
 const mem=MA_program(s),fr=[];let pc=0,ir=null,acc=0,dec=null;
 const snap=o=>fr.push(Object.assign({pc,ir,acc,dec,mem:mem.slice()},o));
 snap({ph:'start',say:'Program and data share one memory. The program counter (PC) holds 0, the address of the first instruction.'});
 for(let guard=0;guard<8;guard++){
  const at=pc;ir=mem[at];pc=at+1;dec=null;
  snap({ph:'fetch',addr:at,say:`Fetch: the PC sends address ${at} along the address bus, and ${MA_cellText(ir)} comes back on the data bus into the instruction register (IR). The PC moves on to ${pc}.`});
  if(typeof ir!=='object'){dec={op:'data',arg:''};snap({ph:'decode',say:`Decode: ${ir} is data, not an instruction, so the machine stops.`});break}
  dec=ir;
  snap({ph:'decode',say:`Decode: the control unit splits ${MA_cellText(ir)} into an opcode (${ir.op}: ${MA_OPDESC[ir.op]})${ir.op==='HALT'?'':' and an operand (address '+ir.arg+')'}, then sets up the parts of the processor it needs.`});
  if(ir.op==='HALT'){snap({ph:'execute',halt:true,say:`Execute: HALT stops the cycle. The answer, ${mem[7]}, is now in memory cell 7.`});break}
  if(ir.op==='LOAD'){acc=mem[ir.arg];snap({ph:'execute',addr:ir.arg,dir:'in',say:`Execute: copy ${acc} from address ${ir.arg} into the accumulator (ACC).`})}
  else if(ir.op==='ADD'||ir.op==='SUB'){const v=mem[ir.arg],old=acc;acc=ir.op==='ADD'?old+v:old-v;snap({ph:'execute',addr:ir.arg,dir:'in',alu:`${old} ${ir.op==='ADD'?'+':'−'} ${v} = ${acc}`,say:`Execute: ${v} arrives from address ${ir.arg}; the arithmetic logic unit (ALU) works out ${old} ${ir.op==='ADD'?'+':'−'} ${v} = ${acc} and leaves it in ACC.`})}
  else if(ir.op==='STORE'){mem[ir.arg]=acc;snap({ph:'execute',addr:ir.arg,dir:'out',say:`Execute: copy ACC (${acc}) out to address ${ir.arg}. Then the cycle starts again with the next fetch.`})}
 }
 return fr;
}

SCENE({id:'fetch-decode-execute',name:'Fetch–decode–execute cycle',tag:'The heartbeat of a processor',
 definition:'The loop a processor repeats for every instruction: fetch it from memory, decode what it means, then execute it.',
 example:'To add two numbers the processor fetches LOAD 5, then ADD 6, then STORE 7, one cycle each. A 3 GHz processor can start billions of these cycles every second.',
 desc:'A processor with a control unit, an arithmetic logic unit and three registers (PC, IR, ACC) beside eight memory cells holding a four-instruction program and its data; arrows show each value travelling along the buses.',
 dur:16,hint:'Change the two numbers in cells 5 and 6 (press them, or use the buttons) and switch ADD to SUB, then step through the cycle.',
 init:()=>({op:'ADD',a:3,b:4}),
 trace:MA_fdeTrace,
 ui:[{choose:[['ADD','ADD'],['SUB','SUB']],label:'Second instruction',get:s=>s.op,act:'op'},{b:'Cell 5 +1',act:'inc',arg:'a'},{b:'Cell 5 −1',act:'dec',arg:'a'},{b:'Cell 6 +1',act:'inc',arg:'b'},{b:'Cell 6 −1',act:'dec',arg:'b'}],
 on:{op(s,v){s.op=v},inc(s,k){s[k]=(s[k]+1)%10},dec(s,k){s[k]=(s[k]+9)%10},cyc(s,k){s[k]=(s[k]+1)%10}},
 draw(s,f,X){
  let out=heading('Fetch → decode → execute, again and again',26);
  out+=R(16,40,300,318,'#fff',C.line,12)+TB(32,62,'CPU',14,C.muted,'start');
  ['fetch','decode','execute'].forEach((ph,i)=>{const on=f.ph===ph;out+=R(96+i*72,46,66,26,on?C.coral:C.pale,'none',13)+T(129+i*72,64,ph[0].toUpperCase()+ph.slice(1),13,on?'#fff':C.muted,'middle','font-weight="650"')});
  // Control unit
  out+=R(32,96,136,112,C.pale,f.ph==='decode'?C.coral:'none',10)+TB(100,116,'Control unit',13,C.ink);
  if(f.dec&&f.dec.op!=='data'){out+=T(44,142,'opcode: '+f.dec.op,13,C.purple,'start','font-weight="650"');if(f.dec.op!=='HALT')out+=T(44,162,'operand: '+f.dec.arg,13,C.green,'start','font-weight="650"');out+=T(44,190,f.dec.op==='HALT'?'→ stop':f.dec.op==='STORE'?'→ write to '+f.dec.arg:'→ read from '+f.dec.arg,13,C.ink,'start')}
  else out+=T(100,160,f.dec?'not an instruction':'waiting',13,C.muted);
  // ALU
  const aluOn=!!f.alu;out+=`<polygon points="32,226 92,226 100,242 108,226 168,226 146,300 54,300" fill="${aluOn?C.amberp:'#fff'}" stroke="${aluOn?C.amber:C.line}" stroke-width="2"/>`+TB(100,266,'ALU',14,C.ink)+(aluOn?TM(100,288,f.alu,13,C.amber,'middle','font-weight="700"'):'');
  out+=arrow(150,262,182,262,aluOn?C.amber:C.line,2.2,7);
  // Registers
  const reg=(y,lab,val,on)=>R(184,y,118,48,'#fff',on?C.coral:C.line,8)+T(192,y+16,lab,13,C.muted,'start')+TM(243,y+38,val,16,C.ink,'middle','font-weight="700"');
  out+=reg(96,'PC',String(f.pc),f.ph==='fetch'||f.ph==='start')+reg(156,'IR',f.ir===null?'—':MA_cellText(f.ir),f.ph==='fetch')+reg(238,'ACC',String(f.acc),f.ph==='execute'&&!f.halt);
  if(f.halt)out+=R(184,306,118,34,C.greenp,C.green,8)+TB(243,328,'halted',14,C.green);
  // Memory
  out+=TB(505,48,'Memory',14,C.muted);
  const rowY=i=>56+i*37;
  f.mem.forEach((v,i)=>{const y=rowY(i),instr=typeof v==='object',act=f.addr===i&&f.ph!=='decode',data=i===5||i===6;
   out+=T(414,y+21,i,13,C.muted);
   const inner=R(428,y,156,31,act?C.coralp:instr?C.pale:C.amberp,act?C.coral:data&&X.try?C.amber:'none',7)+TM(506,y+21,MA_cellText(v),15,C.ink,'middle',instr?'':'font-weight="700"');
   out+=data?hit(X,'cyc',i===5?'a':'b',`Memory cell ${i} holds ${v}. Press to add one.`,inner):inner;
   if(i===7)out+=T(578,y+20,'result',13,C.muted,'end');
  });
  // Buses
  const cy=i=>rowY(i)+15,dot=(x1,y1,x2,y2)=>Ci(lerp(x1,x2,smooth(X.u)),lerp(y1,y2,smooth(X.u)),6,C.coral);
  if(f.ph==='fetch'){out+=arrow(304,120,426,cy(f.addr)-5,C.amber,2.4,8)+arrow(426,cy(f.addr)+5,304,180,C.blue,2.6,8)+dot(426,cy(f.addr)+5,304,180)+T(330,108,'address',13,C.amber,'start')}
  if(f.ph==='execute'&&f.dir==='in'){out+=arrow(426,cy(f.addr),304,262,C.blue,2.6,8)+dot(426,cy(f.addr),304,262)}
  if(f.ph==='execute'&&f.dir==='out'){out+=arrow(304,262,426,cy(f.addr),C.coral,2.6,8)+dot(304,262,426,cy(f.addr))}
  out+=T(365,354,'buses',13,C.muted);
  return {svg:out,phase:f.say};
 }});

SCENE({id:'machine-code',name:'Machine code',tag:'Instructions as numbers',
 definition:'Instructions written as binary numbers that a processor can decode directly. Assembly language gives each one a readable name.',
 example:'On our tiny machine ADD 6 is the byte 0010 0110: the first four bits (0010) say “add”, the last four (0110) say “address 6”. Real processors have hundreds of opcodes.',
 desc:'An assembly instruction above its eight-bit machine-code pattern, split into a four-bit opcode and a four-bit operand, with the table of opcodes and the four lines of the program below.',
 dur:10,hint:'Pick an opcode and an operand, flip individual bits, or press a program line to decode it.',
 init:()=>({code:0x26}),
 watch(p){const prog=[0x15,0x26,0x47,0x00],i=Math.min(3,Math.floor(p*4));return {code:prog[i],line:i}},
 ui:[{choose:MA_OPNAMES.map(n=>[n,n]),label:'Opcode',get:s=>MA_OPNAMES[s.code>>4]||'',act:'op'},{range:'arg',label:'Operand',min:0,max:15,get:s=>s.code&15,act:'arg'}],
 on:{op(s,n){s.code=(MA_OPS[n]<<4)|(n==='HALT'?0:s.code&15);s.line=undefined},arg(s,v){s.code=(s.code&0xF0)|v;s.line=undefined},flip(s,i){s.code^=1<<(7-Number(i));s.line=undefined},line(s,i){s.code=[0x15,0x26,0x47,0x00][Number(i)];s.line=Number(i)}},
 draw(s,f,X){
  const opn=s.code>>4,arg=s.code&15,name=MA_OPNAMES[opn],bits=bin(s.code,8);let out=heading('Assembly language ↔ machine code',26);
  out+=TM(300,76,name?(name==='HALT'?'HALT':name+' '+arg):'??? '+arg,30,name?C.ink:C.coral,'middle','font-weight="700"');
  out+=T(300,100,name?MA_OPDESC[name]:'opcode '+bin(opn,4)+' means nothing on this machine',14,C.muted);
  const w=52,g=8,x0=300-(8*w+7*g)/2;
  bits.split('').forEach((b,i)=>{const x=x0+i*(w+g),op=i<4,col=op?C.purple:C.green,on=b==='1';
   out+=hit(X,'flip',i,`Bit ${i+1} (${op?'opcode':'operand'}): ${b}. Press to flip.`,R(x,116,w,52,on?col:'#fff',col,8)+TM(x+w/2,150,b,24,on?'#fff':col,'middle','font-weight="700"'))});
  const c1=x0+(4*w+3*g)/2,c2=x0+4*(w+g)+(4*w+3*g)/2,half=(4*w+3*g)/2;
  out+=P(`M${c1-half} 176V184H${c1+half}V176`,C.purple,2)+P(`M${c2-half} 176V184H${c2+half}V176`,C.green,2);
  out+=T(c1,206,`opcode ${bin(opn,4)} = ${name||'???'}`,15,C.purple,'middle','font-weight="650"')+T(c2,206,`operand ${bin(arg,4)} = ${arg}`,15,C.green,'middle','font-weight="650"');
  out+=T(300,236,`One byte: ${bits} = 0x${hex(s.code)} = ${s.code}`,15,C.ink);
  MA_OPNAMES.forEach((n,i)=>{const x=12+i*97,on=i===opn;out+=hit(X,'op',n,`Opcode ${n}, ${bin(i,4)}`,R(x,250,91,46,on?C.purplep:'#fff',on?C.purple:C.grid,8)+TB(x+45.5,269,n,14,on?C.purple:C.ink)+TM(x+45.5,288,bin(i,4),13,C.muted))});
  out+=T(64,336,'Program',13,C.muted,'start');
  ['LOAD 5','ADD 6','STORE 7','HALT'].forEach((t,i)=>{const x=130+i*114,on=s.line===i||[0x15,0x26,0x47,0x00][i]===s.code;out+=hit(X,'line',i,`Program line ${i}: ${t}`,R(x,312,104,38,on?C.pale:'#fff',on?C.blue:C.grid,8)+TM(x+52,336,t,14,C.ink))});
  return {svg:out,phase:name?`${name==='HALT'?'HALT':name+' '+arg} is stored as ${bits}. The processor never sees the word “${name}”; the control unit reacts to the bit pattern ${bin(opn,4)} alone. An assembler turns names into these numbers.`:`The opcode ${bin(opn,4)} has no meaning on this machine, so decoding it would fail. Only agreed patterns are instructions.`};
 }});

const MA_LEVELS=[
 {name:'Registers',time:'~0.3 ns',human:'1 second',size:'bytes'},
 {name:'Cache',time:'~3 ns',human:'10 seconds',size:'megabytes'},
 {name:'RAM',time:'~100 ns',human:'5½ minutes',size:'gigabytes'},
 {name:'SSD',time:'~100 µs',human:'4 days',size:'terabytes'},
 {name:'Hard disk',time:'~10 ms',human:'1 year',size:'terabytes'},
 {name:'Network',time:'~150 ms',human:'16 years',size:'the world'}];
function MA_tripTrace(s){
 const fr=[{at:-1,prev:-1,ph:'ask',say:`The processor needs a value that lives in ${MA_LEVELS[s.lvl].name.toLowerCase()==='ram'?'RAM':'the '+MA_LEVELS[s.lvl].name.toLowerCase()}. It always looks in the fastest place first.`}];
 for(let i=0;i<=s.lvl;i++){const L=MA_LEVELS[i];fr.push({at:i,prev:i-1,ph:i<s.lvl?'miss':'found',say:i<s.lvl?`Not in ${L.name.toLowerCase()==='ram'?'RAM':L.name.toLowerCase()} (about ${L.time.slice(1)}). Look one level further down.`:`Found in ${L.name==='RAM'?'RAM':L.name.toLowerCase()} after about ${L.time.slice(1)}. On the human scale, where a register takes 1 second, that wait is ${L.human}.`})}
 for(let i=s.lvl-1;i>=0;i--)fr.push({at:i,prev:i+1,ph:'up',say:`A copy is kept in ${MA_LEVELS[i].name==='RAM'?'RAM':MA_LEVELS[i].name.toLowerCase()} on the way back, so the next request for it will be faster.`});
 fr.push({at:-1,prev:0,ph:'done',say:`Delivered. The slowest level visited sets the cost: ${MA_LEVELS[s.lvl].time.slice(1)}, or ${MA_LEVELS[s.lvl].human} on the human scale.`});
 return fr;
}
SCENE({id:'memory-hierarchy',name:'Memory hierarchy',tag:'Fast and small, or slow and large',
 definition:'Layers of storage from tiny, very fast registers to huge, slow disks and networks. Each layer keeps copies of what the slower layer below holds.',
 example:'If reading a register took 1 second, reading RAM would take about 5 minutes, an SSD about 4 days, and fetching from a server abroad about 16 years.',
 desc:'A pyramid of registers, cache, RAM, SSD, hard disk and network, with typical access times and a human-scale comparison; a request travels down until the data is found, then a copy returns up.',
 dur:13,hint:'Press a level, or choose one, to send a request there. Compare the waits on the human scale.',
 init:()=>({lvl:5}),
 trace:MA_tripTrace,
 ui:[{choose:MA_LEVELS.map((L,i)=>[i,L.name==='Hard disk'?'Disk':L.name]),label:'Where the data lives',get:s=>s.lvl,act:'lvl'}],
 on:{lvl(s,i){s.lvl=Number(i);return 'run'}},
 draw(s,f,X){
  let out=heading('The memory hierarchy',24);const cx=175,rowY=i=>58+i*48;
  out+=T(395,50,'Access time',13,C.muted,'middle','font-weight="650"')+T(520,50,'If a register took 1 s',13,C.muted,'middle','font-weight="650"');
  MA_LEVELS.forEach((L,i)=>{const y=rowY(i),wt=70+i*40,wb=110+i*40,vis=f.at>=i&&f.ph!=='done'||(f.ph==='up'&&i>=f.at)||f.ph==='done'&&i<=s.lvl,found=i===s.lvl&&f.ph!=='ask'&&(f.ph!=='miss');
   const fill=found?C.greenp:vis?C.amberp:i===0?'#dfe9f0':'#fff',stroke=found?C.green:vis?C.amber:C.line;
   const inner=`<polygon points="${cx-wt/2},${y} ${cx+wt/2},${y} ${cx+wb/2},${y+42} ${cx-wb/2},${y+42}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`+T(cx,y+33,L.name,14,C.ink,'middle','font-weight="650"');
   out+=hit(X,'lvl',i,`Send a request to ${L.name}`,inner);
   out+=TB(395,y+19,L.time,15,found?C.green:C.ink)+T(395,y+36,L.size,13,C.muted)+T(520,y+27,L.human,15,found?C.green:C.ink,'middle',found?'font-weight="700"':'');
  });
  const yOf=a=>a<0?44:rowY(a)+11,y=lerp(yOf(f.prev),yOf(f.at),smooth(X.u));
  out+=L(cx-34,44,cx-34,yOf(Math.max(f.at,f.prev)),C.coral,1.5,'stroke-dasharray="3 4" opacity=".7"')+Ci(cx-34,y,7,f.ph==='up'||f.ph==='done'?C.green:C.coral,'#fff');
  out+=T(300,370,'Top: faster, smaller, dearer per byte. Bottom: slower, bigger, cheaper.',13,C.muted);
  return {svg:out,phase:f.say};
 }});

/* ---- LRU cache ---- */
function MA_cacheTrace(s){
 const slots=[null,null,null,null],fr=[{slots:slots.slice(),i:-1,hits:0,miss:0,say:'The cache starts empty. It has room for 4 of the 10 memory cells.'}];let hits=0,miss=0;
 s.seq.forEach((a,i)=>{const at=slots.findIndex(x=>x&&x.a===a);let res,slot,ev=null;
  if(at>=0){res='H';slot=at;hits++;slots[at]={a,last:i}}
  else{res='M';miss++;slot=slots.findIndex(x=>!x);if(slot<0){slot=0;slots.forEach((x,j)=>{if(x.last<slots[slot].last)slot=j});ev=slots[slot].a}slots[slot]={a,last:i}}
  fr.push({slots:slots.map(x=>x&&{...x}),i,res,slot,ev,a,hits,miss,say:res==='H'?`Address ${a}: hit. It is already in the cache, so it arrives quickly.`:ev!==null?`Address ${a}: miss. The cache is full, so it evicts ${ev}, the least recently used, and copies ${a} in from memory.`:`Address ${a}: miss. Fetch it from slow memory and keep a copy in an empty slot.`});
 });
 return fr;
}
SCENE({id:'cache',name:'Cache',tag:'Keep recent things close',
 definition:'A small, fast memory that keeps copies of recently used data, so repeated requests avoid the slow trip to main memory.',
 example:'A loop that reads the same few values again and again gets almost all hits; scanning through more data than fits gets almost all misses. When the cache is full, this one throws out the least recently used item.',
 desc:'A strip of memory accesses marked hit or miss, a four-slot cache, and ten memory cells; misses copy a cell up into the cache and may evict the least recently used slot.',
 dur:13,hint:'Press memory addresses to read them, or load a pattern. Repeating a few addresses gives hits; scanning many gives misses.',
 init:()=>({seq:[1,2,3,1,2,3,1,2,3,7,1,2]}),
 trace:MA_cacheTrace,
 ui:[{b:'Loop over 1, 2, 3',act:'preset',arg:'loop'},{b:'Scan 0–7 twice',act:'preset',arg:'scan'},{b:'Clear',act:'preset',arg:'clear'}],
 on:{acc(s,a){if(s.seq.length>=16)s.seq.shift();s.seq.push(Number(a));return 'end'},preset(s,k){s.seq=k==='loop'?[1,2,3,1,2,3,1,2,3,1,2,3]:k==='scan'?[0,1,2,3,4,5,6,7,0,1,2,3,4,5,6,7]:[];return k==='clear'?undefined:'run'}},
 draw(s,f,X){
  let out=heading('A 4-slot cache in front of slow memory',24);const n=s.seq.length;
  if(!n)out+=T(300,66,'No accesses yet: press an address below.',14,C.muted);
  s.seq.forEach((a,i)=>{const x=12+i*36,done=i<=f.i,res=done?MA_cacheTrace({seq:s.seq.slice(0,i+1)}).at(-1).res:null,cur=i===f.i;
   out+=R(x,40,32,30,cur?(res==='H'?C.greenp:C.coralp):'#fff',done?(res==='H'?C.green:C.coral):C.grid,6)+TM(x+16,60,a,15,done?C.ink:C.muted)+(done?T(x+16,86,res==='H'?'hit':'miss',13,res==='H'?C.green:C.coral):'')});
  out+=T(20,124,'Cache (fast)',13,C.muted,'start','font-weight="650"');
  f.slots.forEach((sl,j)=>{const x=20+j*106,cur=f.slot===j&&f.i>=0;out+=R(x,132,96,62,cur?(f.res==='H'?C.greenp:C.coralp):sl?C.pale:'#fff',cur?(f.res==='H'?C.green:C.coral):C.line,9);
   out+=sl?TM(x+48,160,'addr '+sl.a,15,C.ink,'middle','font-weight="700"')+T(x+48,182,f.i-sl.last===0?'used now':`used ${f.i-sl.last} ago`,13,C.muted):T(x+48,168,'empty',13,C.muted)});
  const tot=f.hits+f.miss||0;
  out+=counter(458,104,'hits',f.hits||0,C.green,120)+counter(458,156,'misses',f.miss||0,C.coral,120)+counter(458,208,'hit rate',tot?Math.round(100*f.hits/tot)+'%':'—',C.blue,120);
  const mx=a=>30+a*54;
  for(let a=0;a<10;a++){const cur=f.i>=0&&f.a===a;out+=hit(X,'acc',a,`Read memory address ${a}`,R(mx(a),290,48,42,cur?C.amberp:'#fff',cur?C.amber:C.line,7)+TM(mx(a)+24,317,a,17,C.ink,'middle','font-weight="650"'))}
  out+=T(300,356,'Main memory (slow): about 30 times slower than the cache',13,C.muted);
  if(f.i>=0){const sx=20+f.slot*106+48;out+=f.res==='M'?arrow(mx(f.a)+24,286,lerp(mx(f.a)+24,sx,1),198,C.coral,2.4,8)+Ci(lerp(mx(f.a)+24,sx,smooth(X.u)),lerp(286,198,smooth(X.u)),6,C.coral):''}
  return {svg:out,phase:f.say};
 }});

/* ---- A tiny expression language shared by the compiler and the interpreter ---- */
const MA_SYM={'+':'+','-':'−','*':'×'};
function MA_parse(src){
 const s=String(src).replace(/\s+/g,'').replace(/[×xX]/g,'*').replace(/[−–]/g,'-');
 if(!s)return {error:'Type an expression such as 2+3*4.',toks:[]};
 const toks=[];let i=0;
 while(i<s.length){const c=s[i];
  if(/\d/.test(c)){let j=i;while(j<s.length&&/\d/.test(s[j]))j++;const v=s.slice(i,j);if(v.length>3)return {error:'Use numbers up to 999.',toks};toks.push({k:'num',v:Number(v),text:v});i=j}
  else if('+-*()'.includes(c)){toks.push({k:'()'.includes(c)?'par':'op',v:c,text:MA_SYM[c]||c});i++}
  else return {error:`“${c}” is not part of this little language. Use digits, + − × and brackets.`,toks};
 }
 let pos=0;
 const primary=()=>{const t=toks[pos];if(!t)throw 'The expression stops too early: a number is missing at the end.';
  if(t.k==='num'){pos++;return {t:'num',v:t.v}}
  if(t.v==='('){pos++;const e=expr();if(!toks[pos]||toks[pos].v!==')')throw 'A bracket is opened but never closed.';pos++;return e}
  throw `Expected a number, but found “${t.text}”.`};
 const term=()=>{let l=primary();while(toks[pos]&&toks[pos].v==='*'){pos++;l={t:'op',op:'*',l,r:primary()}}return l};
 const expr=()=>{let l=term();while(toks[pos]&&(toks[pos].v==='+'||toks[pos].v==='-')){const op=toks[pos].v;pos++;l={t:'op',op,l,r:term()}}return l};
 try{
  const tree=expr();if(pos<toks.length)throw `Unexpected “${toks[pos].text}”: is an operator or bracket missing?`;
  const nodes=[],post=[];let ix=0;
  (function walk(n,d){if(n.t==='op')walk(n.l,d+1);n.ix=ix++;n.d=d;nodes.push(n);if(n.t==='op')walk(n.r,d+1);})(tree,0);
  (function po(n){if(n.t==='op'){po(n.l);po(n.r);n.val=n.op==='+'?n.l.val+n.r.val:n.op==='-'?n.l.val-n.r.val:n.l.val*n.r.val}else n.val=n.v;post.push(n)})(tree);
  if(nodes.length>13)return {error:'Keep it to at most 7 numbers so the tree fits on screen.',toks};
  post.forEach((n,i)=>n.po=i);
  return {toks,tree,nodes,post,depth:Math.max(...nodes.map(n=>n.d))};
 }catch(e){return {error:String(e),toks}}
}
function MA_instr(n){return n.t==='num'?'PUSH '+n.v:{'+':'ADD','-':'SUB','*':'MUL'}[n.op]}
// Draw a parse tree inside a box; mark(n) returns {fill,stroke,badge}.
function MA_drawTree(P,x0,y0,w,h,mark){
 const N=P.nodes.length,step=Math.min(60,h/(P.depth+1)),xs=n=>x0+(n.ix+.5)*w/N,ys=n=>y0+20+n.d*step;let out='';
 for(const n of P.nodes)if(n.t==='op')for(const c of [n.l,n.r]){const m=mark(c);out+=L(xs(n),ys(n),xs(c),ys(c),m.edge||C.line,2)}
 for(const n of P.nodes){const m=mark(n);out+=Ci(xs(n),ys(n),18,m.fill||'#fff',m.stroke||C.blue)+T(xs(n),ys(n)+5,n.t==='op'?MA_SYM[n.op]:n.v,n.t==='num'&&String(n.v).length>2?13:16,C.ink,'middle','font-weight="700"');
  if(m.badge!==undefined)out+=R(xs(n)+10,ys(n)-34,Math.max(26,String(m.badge).length*9+10),20,C.amberp,C.amber,6)+TM(xs(n)+10+Math.max(26,String(m.badge).length*9+10)/2,ys(n)-19,m.badge,13,C.amber,'middle','font-weight="700"')}
 return out;
}
function MA_tokenRow(toks,y,shown,opts={}){
 let out='';const w=Math.min(40,560/Math.max(1,toks.length)),x0=300-toks.length*w/2;
 toks.forEach((t,i)=>{const col=t.k==='num'?C.blue:t.k==='op'?C.purple:C.muted;out+=shown?R(x0+i*w+2,y,w-4,30,'#fff',col,6)+TM(x0+i*w+w/2,y+21,t.text,15,col,'middle','font-weight="700"'):TM(x0+i*w+w/2,y+21,t.text,17,C.ink)});
 return out;
}
function MA_errorView(P,src){return heading('Source code',26)+R(60,60,480,46,'#fff',C.line,8)+TM(300,90,src||' ',18,C.ink)+R(60,150,480,90,C.coralp,C.coral,10)+TB(300,182,'This cannot be parsed yet',17,C.coral)+T(300,212,P.error.length>64?P.error.slice(0,62)+'…':P.error,14,C.ink)}

function MA_compileTrace(s){
 const P=MA_parse(s.src);if(P.error)return [{err:P.error,say:P.error}];
 const fr=[{st:'source',say:`Source code: “${s.src}” is just text. The processor cannot run it directly.`},
  {st:'tokens',say:`Lexing: the compiler splits the text into tokens: ${P.toks.map(t=>t.text).join('  ')}. Spaces are thrown away.`},
  {st:'tree',say:'Parsing: the tokens are arranged into a parse tree. × sits lower than + and −, so it is worked out first; brackets override that.'}];
 P.post.forEach((n,i)=>fr.push({st:'gen',k:i+1,cur:n.po,say:n.t==='num'?`Code generation: a number becomes PUSH ${n.v}.`:`Code generation: both children of ${MA_SYM[n.op]} are already handled, so emit ${MA_instr(n)}, which combines the top two values.`}));
 fr.push({st:'done',k:P.post.length,say:`Done. The compiled program of ${P.post.length} instructions can be saved and run any number of times without the compiler. Running it would leave ${P.tree.val}.`});
 return fr;
}
SCENE({id:'compiler',name:'Compiler',tag:'Translate the whole program first',
 definition:'A program that translates source code into machine instructions before the program runs.',
 example:'C, Rust and Go are usually compiled. “2+3*4” becomes PUSH 2, PUSH 3, PUSH 4, MUL, ADD: instructions that can later run again and again with no compiler present.',
 desc:'Source text is split into tokens, arranged into a parse tree, and then translated node by node into a list of stack-machine instructions.',
 dur:14,shared:'ma-expr',hint:'Type an expression using digits, + − × and brackets, then step through lexing, parsing and code generation.',
 init:()=>({src:'2+3*4'}),
 trace:MA_compileTrace,
 ui:[{text:'Expression',label:'Expression',get:s=>s.src,act:'src',max:15},{choose:[['2+3*4','2+3×4'],['(2+3)*4','(2+3)×4'],['8-2-1','8−2−1']],label:'Examples',get:s=>s.src,act:'src'}],
 on:{src(s,v){s.src=String(v)}},
 draw(s,f,X){
  const P=MA_parse(s.src);if(f.err)return {svg:MA_errorView(P,s.src),phase:f.say+' A compiler reports errors before anything runs.'};
  const order=['source','tokens','tree','gen','done'],at=order.indexOf(f.st);let out=heading('Compiling: source → tokens → tree → instructions',24);
  ['Source','Tokens','Tree','Code'].forEach((l,i)=>{const on=Math.min(at,3)===i;out+=R(60+i*124,36,112,24,on?C.coral:i<at?C.pale:'#fff',on?C.coral:C.grid,12)+T(116+i*124,53,l,13,on?'#fff':C.muted,'middle','font-weight="650"')});
  out+=at===0?R(150,72,300,40,'#fff',C.line,8)+TM(300,98,s.src,18,C.ink):MA_tokenRow(P.toks,76,true);
  if(at>=2){const gen=f.k||0;out+=R(16,120,360,240,'#fff',C.grid,10)+T(28,140,'Parse tree',13,C.muted,'start');
   out+=MA_drawTree(P,26,140,340,200,n=>{const done=at>=3&&n.po<gen,cur=f.st==='gen'&&n.po===f.cur;return {fill:cur?C.coralp:done?C.greenp:'#fff',stroke:cur?C.coral:done?C.green:C.blue}})}
  out+=R(392,120,192,240,'#fff',C.grid,10)+T(404,140,'Instructions',13,C.muted,'start');
  if(at>=3){P.post.slice(0,f.k).forEach((n,i)=>{const cur=f.st==='gen'&&i===f.k-1;out+=(cur?R(400,146+i*16.5,176,16.5,C.coralp,'none',3):'')+TM(410,159+i*16.5,pad(i,2)+'  '+MA_instr(n),13,cur?C.coral:C.ink,'start')})}
  else out+=T(488,240,'none yet',13,C.muted);
  if(f.st==='done'&&P.post.length<=10)out+=R(400,330,176,24,C.greenp,'none',6)+T(488,347,'saved: ready to run',13,C.green,'middle','font-weight="650"');
  return {svg:out,phase:f.say};
 }});

function MA_interpTrace(s){
 const P=MA_parse(s.src);if(P.error)return [{err:P.error,say:P.error}];
 const fr=[{st:'source',say:`Source code: “${s.src}”. An interpreter reads it and acts on it straight away.`},
  {st:'tree',say:'The interpreter still has to understand the structure, so it builds the same parse tree as a compiler would.'}];
 P.post.forEach((n,i)=>fr.push({st:'eval',k:i+1,cur:n.po,say:n.t==='num'?`Visit ${n.v}: its value is simply ${n.v}.`:`Visit ${MA_SYM[n.op]}: both children have values, so work out ${n.l.val} ${MA_SYM[n.op]} ${n.r.val} = ${n.val} now and pass it up.`}));
 fr.push({st:'done',k:P.post.length,say:`The answer ${P.tree.val} appears at the root. No instruction list was saved: running the program again means walking the tree again. That makes starting quick but each run slower.`});
 return fr;
}
SCENE({id:'interpreter',name:'Interpreter',tag:'Translate and run as you go',
 definition:'A program that reads source code and carries it out directly, step by step, without first producing a separate machine-code program.',
 example:'Python and JavaScript start out interpreted (modern engines also compile the busiest parts on the fly). Walking the tree of (2+3)×4, the interpreter works out 2+3 = 5, then 5×4 = 20.',
 desc:'The same parse tree as the compiler, evaluated from the leaves upwards; each node gains a value badge as it is computed, and a log lists the actions taken.',
 dur:13,shared:'ma-expr',hint:'Type an expression (the same one is shared with the compiler scene) and step to watch values flow up the tree.',
 init:()=>({src:'2+3*4'}),
 trace:MA_interpTrace,
 ui:[{text:'Expression',label:'Expression',get:s=>s.src,act:'src',max:15},{choose:[['2+3*4','2+3×4'],['(2+3)*4','(2+3)×4'],['8-2-1','8−2−1']],label:'Examples',get:s=>s.src,act:'src'}],
 on:{src(s,v){s.src=String(v)}},
 draw(s,f,X){
  const P=MA_parse(s.src);if(f.err)return {svg:MA_errorView(P,s.src),phase:f.say+' An interpreter often discovers errors only when it reaches them.'};
  let out=heading('Interpreting: walk the tree and compute at once',24);
  out+=R(150,40,300,36,'#fff',C.line,8)+TM(300,64,s.src,17,C.ink);
  const k=f.k||0;
  out+=R(16,90,360,270,'#fff',C.grid,10)+T(28,110,'Parse tree',13,C.muted,'start');
  if(f.st!=='source')out+=MA_drawTree(P,26,124,340,220,n=>{const done=n.po<k,cur=f.st==='eval'&&n.po===f.cur;return {fill:cur?C.coralp:done?C.greenp:'#fff',stroke:cur?C.coral:done?C.green:C.blue,badge:done?n.val:undefined,edge:done?C.green:C.line}});
  else out+=T(196,230,'not parsed yet',14,C.muted);
  out+=R(392,90,192,270,'#fff',C.grid,10)+T(404,110,'What it does',13,C.muted,'start');
  P.post.slice(0,k).forEach((n,i)=>{const cur=f.st==='eval'&&i===k-1,txt=n.t==='num'?'read '+n.v:`${n.l.val} ${MA_SYM[n.op]} ${n.r.val} = ${n.val}`;out+=(cur?R(400,118+i*17,176,17,C.coralp,'none',3):'')+TM(410,131+i*17,txt.length>20?txt.slice(0,19)+'…':txt,13,cur?C.coral:C.ink,'start')});
  if(f.st==='done')out+=R(400,330,176,24,C.greenp,'none',6)+T(488,347,'result: '+P.tree.val,14,C.green,'middle','font-weight="700"');
  return {svg:out,phase:f.say};
 }});

/* ---- Processes ---- */
const MA_PSTATES={new:[95,86,'New'],ready:[180,200,'Ready'],running:[420,200,'Running'],waiting:[300,318,'Waiting'],terminated:[505,86,'Terminated']};
const MA_TRANS={admit:['new','ready','admit'],dispatch:['ready','running','dispatch'],timeout:['running','ready','time-out'],wait:['running','waiting','wait for I/O'],iodone:['waiting','ready','I/O done'],exit:['running','terminated','exit']};
const MA_TRANS_WHY={admit:'The operating system accepts the new process and gives it memory; it joins the ready queue.',dispatch:'The scheduler picks this process and gives it the CPU.',timeout:'Its time slice is used up, so it goes back to the ready queue to let others run.',wait:'It asked for input or output (a file, the network, a key press), so it waits without using the CPU.',iodone:'The input or output has finished, so it is ready to run again, but must queue for the CPU.',exit:'It has finished; the operating system reclaims its memory.'};
const MA_SCRIPT=['admit','dispatch','timeout','dispatch','wait','iodone','dispatch','exit'];
SCENE({id:'process',name:'Process',tag:'A program in action',
 definition:'A program that is running: its code together with its own memory, registers and state, managed by the operating system.',
 example:'Opening a web browser twice gives two processes running the same program. Each one moves between ready, running and waiting as the operating system shares out the processor.',
 desc:'A state diagram with New, Ready, Running, Waiting and Terminated; a process token moves along labelled transitions such as dispatch, time-out and wait for I/O.',
 dur:12,hint:'Move the process by pressing a labelled arrow or a button. Only the transitions allowed from its current state work.',
 init:()=>({st:'new',hist:['new'],msg:''}),
 watch(p){const k=Math.min(8,Math.floor(p*9)),u=clamp((p*9-k)/.45,0,1);let st='new';const hist=['new'];for(let i=0;i<k;i++){st=MA_TRANS[MA_SCRIPT[i]][1];hist.push(st)}return {st,prev:k?MA_TRANS[MA_SCRIPT[k-1]][0]:'new',u,last:k?MA_SCRIPT[k-1]:null,hist,msg:''}},
 ui:Object.keys(MA_TRANS).map(k=>({b:MA_TRANS[k][2][0].toUpperCase()+MA_TRANS[k][2].slice(1),act:'go',arg:k})),
 on:{go(s,k){const t=MA_TRANS[k];if(t[0]!==s.st){s.msg=`Not allowed: “${t[2]}” only works from ${MA_PSTATES[t[0]][2].toLowerCase()}, and the process is ${MA_PSTATES[s.st][2].toLowerCase()}.`;s.last=null;return}s.st=t[1];s.last=k;s.msg='';s.hist.push(s.st);if(s.hist.length>9)s.hist.shift()}},
 draw(s,f,X){
  let out=heading('Process states',24);const box=(k,on)=>{const [x,y,l]=MA_PSTATES[k];return R(x-58,y-22,116,44,on?C.pale:'#fff',on?C.blue:C.line,22)+T(x,y+5,l,15,C.ink,'middle','font-weight="650"')};
  const arrows={admit:[[118,108],[160,176],0,[112,150,'start']],dispatch:[[240,186],[360,186],-34,[300,150,'middle']],timeout:[[360,214],[240,214],-34,[300,262,'middle']],wait:[[400,224],[334,294],0,[384,282,'start']],iodone:[[268,294],[198,224],0,[216,282,'end']],exit:[[440,176],[486,110],0,[476,150,'start']]};
  for(const k in arrows){const [a,b,bend,[lx,ly,anc]]=arrows[k],valid=MA_TRANS[k][0]===s.st,last=s.last===k,col=last?C.coral:valid&&X.try?C.blue:C.line;
   out+=bend?curveArrow(a[0],a[1],b[0],b[1],bend,col,2.4):arrow(a[0],a[1],b[0],b[1],col,2.4,8);
   const lab=MA_TRANS[k][2],tw=lab.length*7.4+14,bx=anc==='start'?lx:anc==='end'?lx-tw:lx-tw/2;
   const chip=R(bx,ly-15,tw,22,last?C.coralp:valid&&X.try?'#fff':'#f6f9fb',col,11)+T(bx+tw/2,ly+1,lab,13,last?C.coral:valid?C.ink:C.muted);
   out+=valid?hit(X,'go',k,`Transition: ${lab}`,chip):chip}
  for(const k in MA_PSTATES)out+=box(k,k===s.st);
  const [x1,y1]=MA_PSTATES[s.prev||s.st],[x2,y2]=MA_PSTATES[s.st],u=s.u===undefined?1:smooth(s.u);
  out+=Ci(lerp(x1,x2,u)+(s.st==='terminated'?0:0),lerp(y1,y2,u)-30,13,s.st==='terminated'?C.muted:C.coral,'#fff')+T(lerp(x1,x2,u),lerp(y1,y2,u)-25,'P1',12,'#fff','middle','font-weight="700"');
  out+=T(300,370,'Path so far: '+s.hist.map(h=>MA_PSTATES[h][2]).join(' → '),13,C.muted);
  const phase=s.msg||(s.last?MA_TRANS_WHY[s.last]:'A new process has been created but not yet admitted. Only the operating system moves processes between these states.');
  return {svg:out,phase};
 }});

/* ---- Scheduling ---- */
const MA_PCOL=[C.blue,C.coral,C.green,C.purple];
function MA_schedule(algo,b,q){
 const n=b.length,segs=[],fin=Array(n).fill(0);let t=0;
 const add=(p,len)=>{const last=segs.at(-1);if(last&&last.p===p&&last.e===t)last.e+=len;else segs.push({p,s:t,e:t+len});t+=len};
 if(algo==='RR'){const rem=b.slice(),queue=range(n);while(queue.length){const i=queue.shift(),run=Math.min(q,rem[i]);add(i,run);rem[i]-=run;if(rem[i]>0)queue.push(i);else fin[i]=t}}
 else{const order=range(n);if(algo==='SJF')order.sort((x,y)=>b[x]-b[y]||x-y);for(const i of order){add(i,b[i]);fin[i]=t}}
 const wait=fin.map((f,i)=>f-b[i]);let switches=segs.length-1;
 return {segs,fin,wait,total:t,avg:sum(wait)/n,switches};
}
const MA_ALGO={FCFS:'First come, first served',SJF:'Shortest job first',RR:'Round robin'};
SCENE({id:'scheduling',name:'Scheduling',tag:'Sharing one processor',
 definition:'How an operating system decides which ready process runs next, and for how long.',
 example:'Round robin gives each process a short time slice in turn, so everything stays responsive. Shortest job first gives the lowest average wait, but needs to know how long jobs will take.',
 desc:'A Gantt chart of the processor’s time above one row per process; coloured blocks are running time and grey is waiting. The average waiting time is shown below.',
 dur:15,hint:'Choose a policy, change the quantum, and press − or + to change each job’s length. Watch the average wait.',
 init:()=>({algo:'RR',q:2,b:[6,3,8,2]}),
 watch(p){const third=Math.min(2,Math.floor(p*3)),algo=['FCFS','SJF','RR'][third];return {algo,q:2,b:[6,3,8,2],cursor:clamp((p*3-third)*1.3,0,1)}},
 ui:[{choose:[['FCFS','First come'],['SJF','Shortest first'],['RR','Round robin']],label:'Policy',get:s=>s.algo,act:'algo'},{range:'q',label:'Quantum',min:1,max:5,get:s=>s.q,act:'q'}],
 on:{algo(s,a){s.algo=a},q(s,v){s.q=v},inc(s,i){s.b[i]=Math.min(9,s.b[i]+1)},dec(s,i){s.b[i]=Math.max(1,s.b[i]-1)}},
 draw(s,f,X){
  const S=MA_schedule(s.algo,s.b,s.q),cur=(s.cursor===undefined?1:s.cursor)*S.total,gx=t=>140+t*440/S.total;
  let out=heading(MA_ALGO[s.algo]+(s.algo==='RR'?`, quantum ${s.q}`:''),24);
  out+=T(128,72,'CPU',14,C.muted,'end','font-weight="650"')+R(140,50,440,34,'#f6f9fb',C.grid,4);
  for(const g of S.segs){if(g.s>=cur)continue;const e=Math.min(g.e,cur);out+=R(gx(g.s),50,gx(e)-gx(g.s),34,MA_PCOL[g.p],'#fff',2);if(gx(e)-gx(g.s)>=14)out+=TB((gx(g.s)+gx(e))/2,72,'ABCD'[g.p],14,'#fff')}
  const stepT=S.total>24?4:S.total>12?2:1;for(let t=0;t<=S.total;t+=stepT)out+=L(gx(t),86,gx(t),92,C.line,1.5)+T(gx(t),106,t,13,C.muted);
  s.b.forEach((b,i)=>{const y=120+i*44,fin=S.fin[i];
   out+=TB(20,y+19,'ABCD'[i],16,MA_PCOL[i],'start');
   if(X.try)out+=hit(X,'dec',i,`Shorten job ${'ABCD'[i]}`,R(38,y,26,26,'#fff',C.line,6)+TB(51,y+19,'−',16,C.ink))+TM(80,y+19,b,15,C.ink,'middle','font-weight="700"')+hit(X,'inc',i,`Lengthen job ${'ABCD'[i]}`,R(96,y,26,26,'#fff',C.line,6)+TB(109,y+19,'+',16,C.ink));
   else out+=T(40,y+18,'needs '+b,13,C.muted,'start');
   out+=R(gx(0),y,gx(Math.min(fin,cur))-gx(0),26,'#e4ebf0','none',3);
   for(const g of S.segs)if(g.p===i&&g.s<cur)out+=R(gx(g.s),y,gx(Math.min(g.e,cur))-gx(g.s),26,MA_PCOL[i],'none',3);
   if(fin<=cur)out+=L(gx(fin),y-2,gx(fin),y+28,C.ink,2);
  });
  if(cur<S.total)out+=L(gx(cur),46,gx(cur),300,C.coral,2,'stroke-dasharray="4 3"');
  const done=cur>=S.total;
  out+=T(300,320,'Waiting: '+S.wait.map((w,i)=>'ABCD'[i]+' '+w).join(' · '),14,C.ink);
  out+=done?TB(300,352,`Average wait ${fmt(S.avg)} · ${S.switches} switch${S.switches===1?'':'es'}`,19,C.blue):T(300,352,`time ${Math.floor(cur)}`,15,C.muted);
  const why={FCFS:'Jobs run in arrival order. A long job at the front makes everyone behind it wait.',SJF:'Short jobs go first, which gives the smallest average wait, but a long job can be kept waiting.',RR:'Each job gets at most '+s.q+' unit'+(s.q===1?'':'s')+' at a time, then rejoins the queue. Response is fair, but each switch costs a little time.'}[s.algo];
  return {svg:out,phase:why+' All four jobs arrive at time 0; grey shows time spent waiting.'};
 }});
