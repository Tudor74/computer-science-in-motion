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
   out+=TBF(395,y+19,L.time,15,found?C.green:C.ink)+TF(395,y+36,L.size,13,C.muted)+T(520,y+27,L.human,15,found?C.green:C.ink,'middle',found?'font-weight="700"':'');
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

/* ===================== Stage 5 lessons: further scenes ===================== */
/* ---- Fetch–decode–execute lesson ---- */
const MA_ALU_CASES=[[200,100,'ADD'],[7,7,'SUB'],[3,5,'SUB'],[12,10,'AND'],[12,10,'OR'],[12,10,'XOR']];
function MA_alu(a,b,op){let r,c=0;if(op==='ADD'){r=a+b;c=r>255?1:0}else if(op==='SUB'){r=a-b;c=a<b?1:0}else if(op==='AND')r=a&b;else if(op==='OR')r=a|b;else r=a^b;r&=255;return {r,z:r===0?1:0,n:r>>7&1,c}}
const MA_ALU_SYM={ADD:'+',SUB:'−',AND:'AND',OR:'OR',XOR:'XOR'};
SCENE({id:'ma-alu',name:'Arithmetic logic unit',tag:'Where the calculating happens',
 definition:'The part of a processor that does arithmetic (add, subtract) and logic (AND, OR, XOR) on binary numbers, and sets flags that describe the result.',
 example:'In an 8-bit ALU, 200 + 100 gives 44 with the carry flag set, because 300 does not fit in a byte. 7 − 7 sets the zero flag, which a later jump instruction can test.',
 desc:'Two 8-bit inputs flow into a V-shaped ALU; the chosen operation produces an 8-bit result, and three flag lamps show zero, negative and carry.',
 dur:12,hint:'Set A and B, pick an operation, and watch the flags. Try 7 − 7, 3 − 5 and 200 + 100.',
 init:()=>({a:200,b:100,op:'ADD'}),
 watch(p){const c=MA_ALU_CASES[Math.min(5,Math.floor(p*6))];return {a:c[0],b:c[1],op:c[2]}},
 ui:[{range:'a',label:'A',min:0,max:255,get:s=>s.a,act:'a'},{range:'b',label:'B',min:0,max:255,get:s=>s.b,act:'b'},{choose:['ADD','SUB','AND','OR','XOR'].map(o=>[o,o]),label:'Operation',get:s=>s.op,act:'op'}],
 on:{a(s,v){s.a=v},b(s,v){s.b=v},op(s,v){s.op=v}},
 draw(s,f,X){
  const R8=MA_alu(s.a,s.b,s.op),bits=v=>bin(v,8).split('').map(Number);let out=heading('The ALU: two numbers in, one result and flags out',24);
  out+=T(148,52,'A = '+s.a,15,C.ink,'middle','font-weight="650"')+bitRow(null,bits(s.a),30,60,26,null,{h:30,gap:4});
  out+=T(452,52,'B = '+s.b,15,C.ink,'middle','font-weight="650"')+bitRow(null,bits(s.b),334,60,26,null,{h:30,gap:4});
  out+=arrow(148,96,236,132,C.blue,2.4,8)+arrow(452,96,364,132,C.blue,2.4,8);
  out+=`<polygon points="150,134 272,134 300,162 328,134 450,134 392,232 208,232" fill="${C.amberp}" stroke="${C.amber}" stroke-width="2.5"/>`;
  out+=TB(300,196,s.op,24,C.amber)+T(300,220,'ALU',13,C.muted);
  out+=arrow(300,234,300,256,C.amber,2.4,8);
  out+=bitRow(null,bits(R8.r),182,262,26,null,{h:30,gap:4,on:C.green});
  const exact=s.op==='ADD'?s.a+s.b:s.op==='SUB'?s.a-s.b:R8.r;
  out+=T(300,316,`${s.a} ${MA_ALU_SYM[s.op]} ${s.b} = ${exact}${exact!==R8.r?` → stored as ${R8.r}`:''}`,16,C.ink,'middle','font-weight="650"');
  [['Z','zero',R8.z],['N','negative',R8.n],['C','carry',R8.c]].forEach(([k,l,v],i)=>{const x=470+i*44;out+=Ci(x,277,15,v?C.coral:'#fff',v?C.coral:C.line)+TB(x,282,k,13,v?'#fff':C.muted)+TF(x,306,l,11,C.muted)});
  out+=T(300,350,'Flags are single bits the next instruction can test, e.g. “jump if zero”.',13,C.muted);
  const why=[];if(R8.z)why.push('the result is 0, so Z = 1');if(R8.n)why.push('the leftmost bit is 1, so N = 1 (read as a signed number it is negative)');if(R8.c)why.push(s.op==='ADD'?'the true answer needs a ninth bit, so C = 1':'B was bigger than A, so a borrow was needed: C = 1');
  return {svg:out,phase:`The ALU works on all 8 bits at once. ${why.length?'Here '+why.join('; ')+'.':'No flags are set: the result is non-zero, its top bit is 0 and nothing overflowed.'}`};
 }});

const MA_LOOPPROG=[['LOAD',6],['SUB',7],['STORE',6],['JUMPZ',5],['JUMP',0],['HALT',0]];
function MA_loopTrace(s){
 const mem=MA_LOOPPROG.map(x=>x.slice()).concat([s.n,1]);let pc=0,acc=0,run=0;const fr=[{pc:-1,next:0,acc,cnt:s.n,run,say:`The counter in cell 6 starts at ${s.n}. The program will subtract 1 until it reaches zero, then stop.`}];
 for(let g=0;g<80;g++){const [op,arg]=mem[pc];let next=pc+1,jump=null,say='';run++;
  if(op==='LOAD'){acc=mem[arg];say=`LOAD 6: copy the counter (${acc}) into ACC.`}
  else if(op==='SUB'){acc=acc-mem[arg];say=`SUB 7: ACC − 1 = ${acc}. The ALU sets the zero flag ${acc===0?'(the result is 0)':'off (not zero yet)'}.`}
  else if(op==='STORE'){mem[arg]=acc;say=`STORE 6: the counter is now ${acc}.`}
  else if(op==='JUMPZ'){if(acc===0){next=arg;jump=[pc,arg];say='JUMPZ 5: the zero flag is set, so the program counter jumps to 5.'}else say='JUMPZ 5: not zero, so carry on with the next instruction.'}
  else if(op==='JUMP'){next=arg;jump=[pc,arg];say='JUMP 0: put 0 into the program counter. This backwards jump is what makes a loop.'}
  else {fr.push({pc,next:pc,acc,cnt:mem[6],run,halt:true,say:`HALT. ${run} instructions ran for a count of ${s.n}: about 5 per pass round the loop.`});break}
  fr.push({pc,next,acc,cnt:mem[6],run,jump,say});pc=next}
 return fr;
}
SCENE({id:'ma-jump-loop',name:'Jumps make loops',tag:'Changing the program counter',
 definition:'A jump instruction puts a new address into the program counter. A conditional jump only does so when a flag is set. Together they turn a straight list of instructions into loops and choices.',
 example:'“while count ≠ 0: count = count − 1” becomes LOAD, SUB, STORE, then “jump to the end if zero”, then “jump back to the start”.',
 desc:'A six-instruction program and its two data cells; the current instruction is highlighted, and a curved arrow shows the program counter jumping backwards to repeat or forwards to finish.',
 dur:16,hint:'Choose where the counter starts, then step. Watch the backward jump repeat the loop and the zero test end it.',
 init:()=>({n:3}),
 trace:MA_loopTrace,
 ui:[{range:'n',label:'Start count',min:1,max:6,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=v}},
 draw(s,f,X){
  let out=heading('A loop in machine code',24);const rowY=i=>48+i*38;
  MA_LOOPPROG.concat([['count',f.cnt],['one',1]]).forEach((ins,i)=>{const y=rowY(i),cur=i===f.pc,data=i>5;
   out+=T(96,y+22,i,13,C.muted)+R(110,y,190,30,cur?C.coralp:data?C.amberp:C.pale,cur?C.coral:'none',7)+TM(205,y+20,data?`${ins[1]}`:ins[0]+(ins[0]==='HALT'?'':' '+ins[1]),15,C.ink,'middle',data?'font-weight="700"':'');
   if(data)out+=T(310,y+20,ins[0],13,C.muted,'start')});
  out+=curveArrow(108,rowY(4)+15,108,rowY(0)+15,-70,f.jump&&f.jump[1]===0?C.coral:C.line,f.jump&&f.jump[1]===0?3:1.8);
  out+=curveArrow(302,rowY(3)+15,302,rowY(5)+15,-34,f.jump&&f.jump[1]===5?C.green:C.line,f.jump&&f.jump[1]===5?3:1.8);
  if(f.pc>=0&&!f.halt){const ny=rowY(f.next)+15;out+=`<polygon points="${92-14},${ny-8} ${92-2},${ny} ${92-14},${ny+8}" fill="${C.blue}"/>`}
  out+=R(390,56,190,150,'#fff',C.grid,10)+TB(485,78,'Registers',13,C.muted);
  out+=T(405,108,'PC (next)',13,C.muted,'start')+TMF(565,108,f.halt?'—':f.next,16,C.blue,'end','font-weight="700"');
  out+=T(405,140,'ACC',13,C.muted,'start')+TMF(565,140,f.acc,16,C.ink,'end','font-weight="700"');
  out+=T(405,172,'zero flag',13,C.muted,'start')+TMF(565,172,f.acc===0&&f.pc>=1?1:0,16,f.acc===0&&f.pc>=1?C.coral:C.ink,'end','font-weight="700"');
  out+=counter(390,220,'instructions run',f.run,C.purple,190);
  out+=R(390,282,190,64,C.pale,'none',10)+TF(485,302,'Same idea, high level:',12,C.muted)+TMF(485,322,'while count != 0:',13,C.ink)+TMF(485,338,'  count -= 1',13,C.ink,'middle','xml:space="preserve"');
  if(f.halt)out+=R(110,rowY(5)-2,190,34,'none',C.green,8);
  return {svg:out,phase:f.say};
 }});

function MA_pipeSchedule(s){
 const n=5,cells=[];let total=0;
 for(let i=0;i<n;i++){const delay=s.stall&&i>2?2:0;for(let j=0;j<3;j++){const c=s.pipe?i+j+delay:3*i+j;cells.push({i,j,c});total=Math.max(total,c+1)}}
 return {cells,total,n};
}
SCENE({id:'ma-pipeline',name:'Pipelining',tag:'Overlap the stages',
 definition:'Running the fetch, decode and execute stages of different instructions at the same time, like an assembly line, so that one instruction can finish in almost every clock cycle.',
 example:'Without pipelining, 5 instructions × 3 stages take 15 clock cycles. Pipelined they take 7. A jump spoils this: the processor does not know what to fetch next until the jump executes, so the pipeline stalls.',
 desc:'A grid of instructions against clock cycles; coloured cells show which stage each instruction is in at each tick, with grey bubbles where the pipeline stalls after a jump.',
 dur:13,hint:'Switch pipelining on and off, and add a jump that stalls the pipeline. Count the clock cycles.',
 init:()=>({pipe:true,stall:false}),
 ui:[{choose:[['1','Pipelined'],['0','One at a time']],label:'Mode',get:s=>s.pipe?'1':'0',act:'pipe'},{choose:[['0','No jump'],['1','I3 is a jump']],label:'Jump',get:s=>s.stall?'1':'0',act:'stall'}],
 on:{pipe(s,v){s.pipe=v==='1'},stall(s,v){s.stall=v==='1'}},
 trace(s){const S=MA_pipeSchedule(s);return range(S.total+1).map(c=>({c,S}))},
 draw(s,f,X){
  const S=f.S,cw=Math.min(36,500/15),x0=80,y0=74,rh=42,cols=['#1772b7','#7156a6','#2c776c'],names=['F','D','E'];let out=heading(s.pipe?'Pipelined: a new instruction starts every cycle':'One at a time: each instruction waits for the last',24);
  for(let c=0;c<15;c++){out+=TF(x0+c*cw+cw/2,y0-8,c+1,12,c<f.c?C.ink:C.muted)}
  out+=TF(x0-40,y0-8,'cycle',12,C.muted);
  for(let i=0;i<S.n;i++){const y=y0+i*rh;out+=TB(x0-40,y+26,'I'+(i+1)+(s.stall&&i===2?' jump':''),13,s.stall&&i===2?C.coral:C.ink);out+=R(x0,y+4,15*cw,rh-8,'#fff',C.grid,4)}
  if(s.stall&&s.pipe)for(const c of [3,4]){out+=R(x0+c*cw+2,y0+3*rh+8,cw-4,rh-16,'#e6eaec','none',4)+TF(x0+c*cw+cw/2,y0+3*rh+26,'stall',10.5,C.muted)}
  for(const cell of S.cells){if(cell.c>=f.c)continue;const x=x0+cell.c*cw,y=y0+cell.i*rh;out+=R(x+2,y+8,cw-4,rh-16,cols[cell.j],'none',4)+TBF(x+cw/2,y+26,names[cell.j],13,'#fff')}
  if(f.c>0&&f.c<=15)out+=L(x0+f.c*cw,y0-2,x0+f.c*cw,y0+S.n*rh,C.coral,2,'stroke-dasharray="4 3"');
  const done=f.c>=S.total;
  out+=counter(80,300,'clock cycles',Math.min(f.c,S.total)+(done?' (done)':''),C.blue,150)+counter(246,300,'one at a time',15,C.muted,140)+counter(402,300,'pipelined, no jump',7,C.green,170);
  out+=TF(80,364,'F = fetch · D = decode · E = execute',13,C.muted,'start');
  return {svg:out,phase:done?`All 5 instructions finish in ${S.total} cycles${s.pipe?(s.stall?': the jump cost 2 bubbles, because nothing useful could be fetched until it executed.':', against 15 one at a time. Each stage is busy with a different instruction.'):'. Each stage sits idle two-thirds of the time.'}`:`Cycle ${f.c}: ${s.pipe?'up to three instructions are in the pipeline at once, each in a different stage.':'only one instruction is in the processor; the other stages wait.'}`};
 }});

/* ---- Machine-code lesson ---- */
const MA_AMEM=[3,6,5,1,7,2,0,4],MA_REGS=[0,9,4,1];
const MA_AMODES={immediate:{fmt:a=>'#'+a,reads:0,name:'Immediate'},register:{fmt:a=>'R'+(a%4),reads:0,name:'Register'},direct:{fmt:a=>String(a),reads:1,name:'Direct'},indirect:{fmt:a=>'('+a+')',reads:2,name:'Indirect'}};
function MA_amodeVal(m,a){return m==='immediate'?a:m==='register'?MA_REGS[a%4]:m==='direct'?MA_AMEM[a]:MA_AMEM[MA_AMEM[a]]}
SCENE({id:'ma-addressing',name:'Addressing modes',tag:'Where does the operand come from?',
 definition:'The rule an instruction uses to find its value: the operand itself (immediate), a register, a memory address (direct), or an address stored in memory (indirect).',
 example:'LOAD #5 loads the number 5. LOAD 5 loads whatever is in memory cell 5. LOAD (5) looks in cell 5, finds an address there, and loads from that address: two memory trips.',
 desc:'An instruction box, four registers and eight memory cells; arrows show how many hops each addressing mode takes to reach the value it loads.',
 dur:12,hint:'Pick a mode and move the operand. Count the memory reads: registers and immediate values need none.',
 init:()=>({mode:'indirect',a:5}),
 watch(p){const ms=['immediate','register','direct','indirect'];return {mode:ms[Math.min(3,Math.floor(p*4))],a:5}},
 ui:[{choose:Object.keys(MA_AMODES).map(k=>[k,MA_AMODES[k].name]),label:'Mode',get:s=>s.mode,act:'mode'},{range:'a',label:'Operand',min:0,max:7,get:s=>s.a,act:'a'}],
 on:{mode(s,v){s.mode=v},a(s,v){s.a=v},cell(s,i){s.a=Number(i)}},
 draw(s,f,X){
  const M=MA_AMODES[s.mode],v=MA_amodeVal(s.mode,s.a),my=i=>58+i*38;let out=heading(`${M.name}: LOAD ${M.fmt(s.a)}`,24);
  out+=R(30,60,210,64,'#fff',C.blue,10)+TB(135,86,'LOAD '+M.fmt(s.a),20,C.blue)+T(135,110,'instruction',13,C.muted);
  out+=R(30,170,210,120,'#fff',C.grid,10)+T(135,190,'Registers',13,C.muted,'middle','font-weight="650"');
  MA_REGS.forEach((r,i)=>{const on=s.mode==='register'&&s.a%4===i,x=44+i*48;out+=R(x,202,40,40,on?C.greenp:C.pale,on?C.green:'none',7)+TB(x+20,228,r,15,C.ink)+TF(x+20,260,'R'+i,12,C.muted)});
  out+=TB(474,48,'Memory (address · value)',13,C.muted);
  MA_AMEM.forEach((m,i)=>{const y=my(i),first=(s.mode==='direct'||s.mode==='indirect')&&i===s.a,second=s.mode==='indirect'&&i===MA_AMEM[s.a],on=first||second;
   out+=hit(X,'cell',i,`Use ${i} as the operand`,R(414,y,120,30,second||s.mode==='direct'&&first?C.greenp:first?C.amberp:'#fff',on?(second||s.mode==='direct'?C.green:C.amber):C.line,7)+TF(424,y+20,i,12,C.muted,'start')+TMF(484,y+20,m,15,C.ink,'middle','font-weight="700"'))});
  if(s.mode==='direct'||s.mode==='indirect')out+=arrow(240,92,410,my(s.a)+15,C.amber,2.6,9);
  if(s.mode==='indirect'){const a=my(s.a)+15,b=my(MA_AMEM[s.a])+15;out+=curveArrow(536,a,536,b,a<b?-40:40,C.green,2.6)+T(586,(a+b)/2,'then',13,C.green,'end')}
  if(s.mode==='register')out+=arrow(135,124,44+(s.a%4)*48+20,200,C.green,2.6,9);
  out+=R(30,310,210,46,C.greenp,'none',10)+TB(135,339,'ACC ← '+v,18,C.green);
  out+=counter(270,310,'memory reads',M.reads,M.reads?C.coral:C.green,120);
  const say={immediate:`The value ${s.a} is written inside the instruction itself, so nothing else is read.`,register:`The operand names register R${s.a%4}, which holds ${v}. Registers are inside the processor, so no memory trip is needed.`,direct:`The operand is an address: cell ${s.a} holds ${v}. One memory read.`,indirect:`Cell ${s.a} holds ${MA_AMEM[s.a]}, which is itself an address; cell ${MA_AMEM[s.a]} holds ${v}. Two memory reads: useful for pointers.`}[s.mode];
  return {svg:out,phase:say};
 }});

const MA_ASMOP={HALT:0,LOAD:1,ADD:2,SUB:3,STORE:4,JUMP:5,JUMPZ:6};
function MA_asmSource(s){const base=[{lab:'start',op:'LOAD',arg:'count'},{op:'SUB',arg:'one'},{op:'STORE',arg:'count'},{op:'JUMPZ',arg:'done'},{op:'JUMP',arg:'start'},{lab:'done',op:'HALT'},{lab:'count',data:3},{lab:'one',data:1}];return s.extra?[{op:'LOAD',arg:'one'}].concat(base):base}
function MA_asmTrace(s){
 const src=MA_asmSource(s),sym={},fr=[{pass:0,line:-1,sym:{},out:[],say:'An assembler turns assembly language into machine code. Labels like “start” and “count” stand for addresses that are not known yet.'}];
 src.forEach((l,i)=>{if(l.lab){sym[l.lab]=i;fr.push({pass:1,line:i,sym:{...sym},out:[],say:`Pass 1, line ${i}: the label “${l.lab}” is at address ${i}. Record it in the symbol table.`})}});
 fr.push({pass:1,line:src.length,sym:{...sym},out:[],say:'Pass 1 is done: every label now has an address.'});
 const out=[];
 src.forEach((l,i)=>{const byte=l.data!==undefined?l.data:(MA_ASMOP[l.op]<<4)|(l.arg?sym[l.arg]:0);out.push(byte);fr.push({pass:2,line:i,sym:{...sym},out:out.slice(),say:l.data!==undefined?`Pass 2, line ${i}: data ${l.data} is stored as it is.`:`Pass 2, line ${i}: ${l.op} is opcode ${MA_ASMOP[l.op]}${l.arg?`, and “${l.arg}” is address ${sym[l.arg]}`:''}. Together: ${bin(byte,8).slice(0,4)} ${bin(byte,8).slice(4)}.`})});
 fr.push({pass:3,line:-1,sym:{...sym},out,say:`Done: ${out.length} bytes of machine code. ${s.extra?'Inserting a line moved every label down by one, and the assembler updated every jump for you.':'Try inserting a line: by hand you would have to fix every address; the assembler does it.'}`});
 return fr;
}
SCENE({id:'ma-assembler',name:'Assembler',tag:'From labels to addresses',
 definition:'A program that translates assembly language into machine code, replacing each mnemonic with its opcode and each label with the address it stands for.',
 example:'“JUMP start” becomes 0101 0000 because JUMP is opcode 5 and the label start is address 0. Add a line at the top and start moves to address 1; the assembler recalculates every jump.',
 desc:'Assembly source with labels on the left, a symbol table filled in during the first pass, and the machine-code bytes produced in the second pass on the right.',
 dur:15,hint:'Step through both passes, then insert a line at the top and watch every label’s address change.',
 init:()=>({extra:false}),
 trace:MA_asmTrace,
 ui:[{choose:[['0','Original'],['1','Insert a line at the top']],label:'Program',get:s=>s.extra?'1':'0',act:'extra'}],
 on:{extra(s,v){s.extra=v==='1'}},
 draw(s,f,X){
  const src=MA_asmSource(s),rh=Math.min(32,282/src.length),y0=60;let out=heading('Two passes: find the labels, then translate',24);
  out+=TF(20,y0-10,'addr',12,C.muted,'start')+TF(60,y0-10,'Assembly',12,C.muted,'start')+TF(430,y0-10,'Machine code',12,C.muted,'start');
  src.forEach((l,i)=>{const y=y0+i*rh,cur=f.line===i;out+=R(14,y,240,rh-3,cur?(f.pass===1?C.amberp:C.coralp):i%2?'#f6f9fb':'#fff',cur?(f.pass===1?C.amber:C.coral):'none',5);
   out+=TMF(26,y+rh/2+3,i,13,C.muted,'start')+(l.lab?TMF(56,y+rh/2+3,l.lab+':',13,C.purple,'start','font-weight="700"'):'')+TMF(126,y+rh/2+3,l.data!==undefined?String(l.data):l.op+(l.arg?' '+l.arg:''),13,C.ink,'start');
   if(f.out[i]!==undefined){const b=bin(f.out[i],8);out+=R(426,y,160,rh-3,f.pass===2&&cur?C.coralp:'#fff',C.grid,5)+TMF(436,y+rh/2+3,l.data!==undefined?b:b.slice(0,4),13,l.data!==undefined?C.amber:C.purple,'start','font-weight="700"')+(l.data===undefined?TMF(480,y+rh/2+3,b.slice(4),13,C.green,'start','font-weight="700"'):'')+TMF(578,y+rh/2+3,'0x'+hex(f.out[i]),12,C.muted,'end')}
  });
  out+=R(272,y0,138,150,'#fff',C.grid,10)+TF(341,y0+18,'Symbol table',13,C.muted,'middle','font-weight="650"');
  Object.entries(f.sym).forEach(([k,v],j)=>{out+=TMF(286,y0+42+j*24,k,13,C.purple,'start','font-weight="700"')+TMF(396,y0+42+j*24,v,13,C.ink,'end','font-weight="700"')});
  out+=R(272,y0+166,138,40,f.pass===1?C.amberp:f.pass===2?C.coralp:f.pass===3?C.greenp:C.pale,'none',8)+TBF(341,y0+191,f.pass===0?'ready':f.pass===3?'done':'pass '+f.pass,14,f.pass===3?C.green:C.ink);
  return {svg:out,phase:f.say};
 }});

/* ---- Memory-hierarchy lesson ---- */
function MA_locTrace(s){
 const N=6,L=s.line,fr=[],cache=[];let hits=0,miss=0;fr.push({k:-1,cache:[],hits,miss,log:{},say:`A 6 × 6 table is stored row by row in memory. Each cache line holds ${L} neighbouring cells; the cache keeps 2 lines.`});const log={};
 for(let k=0;k<N*N;k++){const r=s.order==='row'?Math.floor(k/N):k%N,c=s.order==='row'?k%N:Math.floor(k/N),addr=r*N+c,line=Math.floor(addr/L),at=cache.indexOf(line);let res;
  if(at>=0){res='H';hits++;cache.splice(at,1);cache.push(line)}else{res='M';miss++;cache.push(line);if(cache.length>2)cache.shift()}
  log[addr]=res;fr.push({k,r,c,addr,line,res,cache:cache.slice(),hits,miss,log:{...log},say:res==='H'?`Cell (${r}, ${c}) is at address ${addr}, already in a cached line: hit.`:`Cell (${r}, ${c}) is at address ${addr}: miss. Fetch line ${line} (addresses ${line*L}–${line*L+L-1}).`})}
 const last=fr.at(-1);fr.push({...last,done:true,say:`Finished: ${last.hits} hits and ${last.miss} misses. ${s.order==='row'?'Going along rows uses every cell of each fetched line before moving on.':'Going down columns jumps 6 cells each time, so a fetched line is evicted before its neighbours are used.'}`});
 return fr;
}
SCENE({id:'ma-locality',name:'Locality',tag:'Use what is nearby',
 definition:'Programs tend to reuse data they used recently (temporal locality) and data stored next to it (spatial locality). Caches fetch whole lines of neighbouring cells to take advantage of this.',
 example:'Adding up a row-major table row by row is much faster than column by column, even though it does the same additions, because each row is stored as one run of neighbouring memory cells. For a column-major table it is the other way round.',
 desc:'A 6 × 6 table on the left and the same cells laid out as one strip of memory below; cells turn green for hits and coral for misses as the table is read row by row or column by column.',
 dur:15,hint:'Choose the order and the cache-line size, then run. Compare the misses for rows and columns.',
 init:()=>({order:'row',line:3}),
 trace:MA_locTrace,
 ui:[{choose:[['row','Row by row'],['col','Column by column']],label:'Order',get:s=>s.order,act:'order'},{choose:[['2','Line: 2 cells'],['3','3 cells'],['6','6 cells']],label:'Line size',get:s=>String(s.line),act:'line'}],
 on:{order(s,v){s.order=v},line(s,v){s.line=Number(v)}},
 draw(s,f,X){
  const N=6,cs=30,gx=40,gy=60,L=s.line;let out=heading(s.order==='row'?'Reading the table row by row':'Reading the table column by column',24);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){const a=r*N+c,res=f.log[a],cur=f.addr===a&&!f.done;out+=R(gx+c*cs,gy+r*cs,cs-3,cs-3,cur?C.amberp:res==='H'?C.greenp:res==='M'?C.coralp:'#fff',cur?C.amber:res==='H'?C.green:res==='M'?C.coral:C.grid,4)+TF(gx+c*cs+cs/2-1.5,gy+r*cs+19,a,10.5,C.muted)}
  out+=TF(gx+N*cs/2,gy-8,'the table',13,C.muted);
  if(f.k>=0&&!f.done){const pts=[];for(let k=0;k<=f.k;k++){const r=s.order==='row'?Math.floor(k/N):k%N,c=s.order==='row'?k%N:Math.floor(k/N);pts.push([gx+c*cs+cs/2-1.5,gy+r*cs+cs/2-1.5])}if(pts.length>1)out+=P('M'+pts.map(p=>p.map(fmt).join(' ')).join('L'),C.blue,1.6,'none','opacity=".55"')}
  const mw=15,mx=30,my=290;out+=T(mx,my-14,'Memory, one cell after another (each box is a cache line)',13,C.muted,'start');
  for(let a=0;a<N*N;a++){const res=f.log[a],cur=f.addr===a&&!f.done;out+=R(mx+a*mw,my,mw-1,22,cur?C.amber:res==='H'?C.green:res==='M'?C.coral:'#fff',C.grid,2,'stroke-width="1"')}
  for(let l=0;l*L<N*N;l++){const cached=f.cache.includes(l);out+=R(mx+l*L*mw-1,my-3,L*mw+1,28,'none',cached?C.blue:C.line,4,cached?'stroke-width="3"':'stroke-width="1"')}
  out+=counter(300,70,'hits',f.hits,C.green,130)+counter(446,70,'misses',f.miss,C.coral,130);
  out+=R(300,134,276,108,C.pale,'none',10)+TF(438,158,'In the cache now (2 lines):',13,C.muted);
  f.cache.forEach((l,i)=>out+=TMF(438,184+i*24,`line ${l}: cells ${l*L}–${l*L+L-1}`,14,C.blue,'middle','font-weight="700"'));
  if(!f.cache.length)out+=TF(438,190,'empty',13,C.muted);
  return {svg:out,phase:f.say};
 }});

function MA_vmTrace(s){
 const frames=[null,null,null],pt=range(6).map(()=>null),fr=[{i:-1,frames:frames.slice(),pt:pt.slice(),faults:0,say:'The program sees 6 pages of virtual memory, but only 3 physical frames of RAM exist. The page table records where each page really is.'}];let faults=0,order=[];
 s.seq.forEach((p,i)=>{let res,ev=null,fi=pt[p];
  if(fi!==null)res='ok';
  else{res='fault';faults++;fi=frames.indexOf(null);if(fi<0){const old=order.shift();fi=pt[old];pt[old]=null;ev=old}frames[fi]=p;pt[p]=fi;order.push(p)}
  fr.push({i,p,res,ev,fi,frames:frames.slice(),pt:pt.slice(),faults,say:res==='ok'?`Page ${p}: the page table says frame ${fi}. The address is translated and RAM is read directly.`:ev!==null?`Page ${p}: page fault. RAM is full, so page ${ev} (loaded longest ago) goes back to disk and page ${p} is copied into frame ${fi}.`:`Page ${p}: page fault. It is not in RAM, so the operating system loads it from disk into free frame ${fi}.`})});
 return fr;
}
SCENE({id:'ma-virtual-memory',name:'Virtual memory',tag:'Every program gets its own address space',
 definition:'The operating system gives each program its own range of virtual addresses, split into pages. A page table maps each page to a frame of real memory, or notes that it is on disk.',
 example:'A program can use more memory than is installed: pages it is not using wait on disk. Touching one causes a page fault, and the operating system loads it, which takes thousands of times longer than a normal read.',
 desc:'Six virtual pages on the left, a page table in the middle, three physical frames of RAM on the right and a disk below; accesses either translate straight to a frame or cause a page fault that loads the page from disk.',
 dur:15,hint:'Press virtual pages to access them. Reusing pages already in RAM is fast; new pages cause page faults.',
 init:()=>({seq:[0,1,0,3,4,1,0,5]}),
 trace:MA_vmTrace,
 ui:[{b:'Reuse pages 0 and 1',act:'preset',arg:'local'},{b:'Touch every page',act:'preset',arg:'scan'},{b:'Clear',act:'preset',arg:'clear'}],
 on:{page(s,p){if(s.seq.length>=12)s.seq.shift();s.seq.push(Number(p));return 'end'},preset(s,k){s.seq=k==='local'?[0,1,0,1,0,1,0,1]:k==='scan'?[0,1,2,3,4,5,0,1]:[];return k==='clear'?undefined:'run'}},
 draw(s,f,X){
  let out=heading('Virtual pages → page table → physical frames',24);const py=i=>60+i*40;
  out+=TF(70,50,'Virtual pages',13,C.muted);out+=TF(240,50,'Page table',13,C.muted);out+=TF(470,50,'RAM frames',13,C.muted);
  range(6).forEach(p=>{const cur=f.p===p&&f.i>=0;out+=hit(X,'page',p,`Access virtual page ${p}`,R(30,py(p),80,32,cur?(f.res==='ok'?C.greenp:C.coralp):'#fff',cur?(f.res==='ok'?C.green:C.coral):C.line,7)+TB(70,py(p)+21,'page '+p,14,C.ink));
   const m=f.pt[p];out+=R(180,py(p),120,32,cur?C.amberp:'#fff',C.grid,6)+TMF(200,py(p)+21,p,13,C.muted,'start')+TMF(286,py(p)+21,m===null?'disk':'frame '+m,13,m===null?C.muted:C.blue,'end','font-weight="700"')});
  f.frames.forEach((p,j)=>{const y=80+j*62,cur=f.fi===j&&f.i>=0;out+=R(410,y,120,50,cur?(f.res==='ok'?C.greenp:C.coralp):p===null?'#fff':C.pale,cur?(f.res==='ok'?C.green:C.coral):C.line,8)+TF(424,y+18,'frame '+j,12,C.muted,'start')+TB(470,y+40,p===null?'free':'page '+p,15,C.ink)});
  out+=R(410,290,160,52,'#eef1f3',C.line,10)+TB(490,314,'Disk',15,C.muted)+TF(490,333,'slow, but large',12,C.muted);
  if(f.i>=0){const pyc=py(f.p)+16;out+=arrow(112,pyc,178,pyc,C.blue,2,7);
   if(f.res==='ok')out+=arrow(302,pyc,408,80+f.fi*62+25,C.green,2.4,8);
   else out+=curveArrow(490,288,535,80+f.fi*62+52,40,C.coral,2.6)}
  out+=counter(180,312,'page faults',f.faults,C.coral,120);
  if(s.seq.length)out+=TF(30,372,'Accesses: '+s.seq.join(' '),13,C.muted,'start');
  return {svg:out,phase:f.say};
 }});

SCENE({id:'ma-registers-few',name:'Why so few registers?',tag:'Speed costs space',
 definition:'Registers are the fastest storage of all because they sit inside the processor’s core, next to the ALU. They are so close and so fast precisely because there are very few of them.',
 example:'A typical core has 16 to 32 general registers of 64 bits: a few hundred bytes. Every extra register would need more wiring to the ALU, longer instruction encodings and more to save at every context switch.',
 desc:'A processor core with its block of registers wired to the ALU, beside counters for the bits an instruction needs to name a register and the bytes saved at every context switch.',
 dur:11,hint:'Change the number of registers. Watch how many bits an instruction needs to name one, and how much must be saved whenever the processor switches task.',
 init:()=>({n:16}),
 watch(p){return {n:[4,8,16,32,64][Math.min(4,Math.floor(p*5))]}},
 ui:[{choose:[['4','4'],['8','8'],['16','16'],['32','32'],['64','64']],label:'Registers',get:s=>String(s.n),act:'n'}],
 on:{n(s,v){s.n=Number(v)}},
 draw(s,f,X){
  const n=s.n,bits=Math.log2(n),cols=Math.min(8,n),rows=Math.ceil(n/cols),cw=Math.min(28,180/cols),rh=Math.min(22,150/rows);let out=heading(`${n} registers in the core`,24);
  out+=R(30,46,300,300,'#f4f7f9',C.line,14)+TF(46,66,'one processor core',12,C.muted,'start');
  out+=`<polygon points="190,96 250,96 262,112 274,96 316,96 290,150 216,150" fill="${C.amberp}" stroke="${C.amber}" stroke-width="2"/>`+TBF(253,134,'ALU',13,C.amber);
  const gw=cols*cw;for(let i=0;i<n;i++){const x=180-gw/2+(i%cols)*cw,y=176+Math.floor(i/cols)*rh;out+=R(x,y,cw-3,rh-3,C.blue,'none',3)}
  for(let k=0;k<3;k++)out+=L(232+k*14,152,180-gw/4+k*gw/4,172,C.line,1.5);
  out+=TF(180,166+rows*rh+30,`${n} × 64 bits = ${n*8} bytes`,12,C.ink,'middle','font-weight="650"');
  out+=R(360,46,210,90,'#fff',C.grid,10)+TF(465,68,'bits to name a register',13,C.muted)+TB(465,110,bits+' bits',26,C.purple);
  out+=R(360,150,210,90,'#fff',C.grid,10)+TF(465,172,'saved at every context switch',13,C.muted)+TB(465,214,n*8+' bytes',24,n>=32?C.coral:C.green);
  out+=R(360,254,210,92,C.pale,'none',10)+TF(465,276,'For comparison',13,C.muted)+TF(465,300,'cache: megabytes, ~3 ns',13,C.ink)+TF(465,322,'RAM: gigabytes, ~100 ns',13,C.ink);
  const ins=3*bits;
  return {svg:out,phase:`An ADD naming three registers spends ${ins} of its bits just on register numbers. ${n>=32?`More registers means longer instructions, longer wires (so slower access) and ${n*8} bytes to save at every context switch.`:'Few registers keep instructions short, wires short, and task switches cheap; the cache handles everything else.'}`};
 }});

/* ---- Cache lesson ---- */
function MA_mapTrace(s){
 const lines=[null,null,null,null],fr=[{i:-1,lines:lines.slice(),hits:0,miss:0,say:s.assoc==='direct'?'Direct-mapped: an address’s index bits choose exactly one line. Each line holds a block of 4 bytes.':'Fully associative: a block may go in any of the 4 lines; the least recently used one is replaced.'}];let hits=0,miss=0;
 s.seq.forEach((a,i)=>{const blk=a>>2,idx=s.assoc==='direct'?blk&3:-1,tag=s.assoc==='direct'?blk>>2:blk;let line,res,ev=null;
  if(s.assoc==='direct'){line=idx;if(lines[line]&&lines[line].tag===tag)res='H';else{res='M';if(lines[line])ev=lines[line].blk;lines[line]={tag,blk,last:i}}lines[line].last=i}
  else{line=lines.findIndex(l=>l&&l.tag===tag);if(line>=0)res='H';else{res='M';line=lines.findIndex(l=>!l);if(line<0){line=0;lines.forEach((l,j)=>{if(l.last<lines[line].last)line=j});ev=lines[line].blk}lines[line]={tag,blk}}lines[line].last=i}
  res==='H'?hits++:miss++;
  fr.push({i,a,blk,idx,tag,line,res,ev,lines:lines.map(l=>l&&{...l}),hits,miss,say:res==='H'?`Address ${a} is in block ${blk} (bytes ${blk*4}–${blk*4+3}), already in line ${line}: hit.`:`Address ${a}: miss. Block ${blk} goes into line ${line}${ev!==null?`, evicting block ${ev}${s.assoc==='direct'?' because both map to the same line':''}`:''}.`})});
 return fr;
}
SCENE({id:'ma-cache-mapping',name:'Cache mapping',tag:'Tag, index and offset',
 definition:'How a cache decides where a block of memory may live. The address is split into a tag, an index that picks the line, and an offset within the block. In a direct-mapped cache each block has exactly one possible line; an associative cache allows several.',
 example:'With 4 lines of 4 bytes, addresses 0 and 64 both have index 0. Alternating between them in a direct-mapped cache misses every time; a fully associative cache keeps both.',
 desc:'An 8-bit address split into coloured tag, index and offset fields above a four-line cache table; each access lights the chosen line as a hit or a miss.',
 dur:14,hint:'Choose the mapping, set an address and press Read, or load a pattern. Compare the “Conflict” pattern in both mappings.',
 init:()=>({seq:[0,64,0,64,0,64,1,2],assoc:'direct',addr:65}),
 trace:MA_mapTrace,
 ui:[{choose:[['direct','Direct-mapped'],['assoc','Fully associative']],label:'Mapping',get:s=>s.assoc,act:'assoc'},{range:'addr',label:'Address',min:0,max:255,get:s=>s.addr,act:'addr'},{b:'Read it',act:'read'},{b:'Conflict: 0, 64, 0…',act:'preset',arg:'conflict'},{b:'Neighbours 0–7',act:'preset',arg:'near'}],
 on:{assoc(s,v){s.assoc=v},addr(s,v){s.addr=v;return 'keep'},read(s){if(s.seq.length>=10)s.seq.shift();s.seq.push(s.addr);return 'end'},preset(s,k){s.seq=k==='conflict'?[0,64,0,64,0,64,0,64]:[0,1,2,3,4,5,6,7];return 'run'}},
 draw(s,f,X){
  const a=f.i>=0?f.a:(X.try?s.addr:s.seq[0]),b=bin(a,8),direct=s.assoc==='direct';let out=heading(direct?'Direct-mapped: the index picks one line':'Fully associative: any line will do',24);
  const fx=150,fw=34;b.split('').forEach((d,i)=>{const col=i>=6?C.green:direct&&i>=4?C.blue:C.purple;out+=R(fx+i*fw,44,fw-4,36,'#fff',col,6)+TMF(fx+i*fw+fw/2-2,68,d,17,col,'middle','font-weight="700"')});
  out+=TF(fx-14,68,`${a} =`,15,C.ink,'end','font-weight="650"');
  const lab=(i0,i1,t,col)=>TF(fx+(i0+i1)/2*fw+fw/2-2,98,t,12,col,'middle','font-weight="650"');
  out+=direct?lab(0,3,'tag',C.purple)+lab(4,5,'index',C.blue)+lab(6,7,'offset',C.green):lab(0,5,'tag',C.purple)+lab(6,7,'offset',C.green);
  const ty=116;out+=TF(60,ty,'line',12,C.muted)+TF(140,ty,'valid',12,C.muted)+TF(230,ty,'tag',12,C.muted)+TF(350,ty,'holds bytes',12,C.muted);
  f.lines.forEach((l,j)=>{const y=ty+10+j*40,cur=f.line===j&&f.i>=0;out+=R(30,y,400,34,cur?(f.res==='H'?C.greenp:C.coralp):'#fff',cur?(f.res==='H'?C.green:C.coral):C.grid,6);
   out+=TMF(60,y+22,bin(j,2),14,direct?C.blue:C.muted,'middle','font-weight="700"')+TMF(140,y+22,l?1:0,14,C.ink)+TMF(230,y+22,l?bin(l.tag,direct?4:6):'—',14,C.purple,'middle','font-weight="700"')+TMF(350,y+22,l?`${l.blk*4}–${l.blk*4+3}`:'empty',14,C.ink)});
  if(f.i>=0&&direct)out+=TF(fx+8*fw+8,68,'→ line '+bin(f.idx,2),15,C.blue,'start','font-weight="700"');
  out+=counter(456,126,'hits',f.hits,C.green,120)+counter(456,180,'misses',f.miss,C.coral,120);
  s.seq.forEach((v,i)=>{const x=30+i*54,done=i<=f.i;out+=R(x,300,48,26,i===f.i?C.amberp:'#fff',C.grid,5)+TMF(x+24,318,v,13,done?C.ink:C.muted)});
  out+=TF(30,346,'Access sequence',12,C.muted,'start');
  return {svg:out,phase:f.say};
 }});

function MA_writeTrace(s){
 const n=s.writes,fr=[{k:-1,thr:{c:null,ram:0,w:0},back:{c:null,ram:0,w:0,dirty:false},say:`The program will set x to 1, 2, … ${n}, then the cache line holding x is evicted. Main memory starts with x = 0.`}];
 const thr={c:null,ram:0,w:0},back={c:null,ram:0,w:0,dirty:false};
 for(let k=1;k<=n;k++){thr.c=k;thr.ram=k;thr.w++;back.c=k;back.dirty=true;fr.push({k,op:'w',thr:{...thr},back:{...back},say:`x = ${k}. Write-through also writes RAM now (${thr.w} slow write${thr.w>1?'s':''}). Write-back only updates the cache and marks the line dirty.`})}
 back.ram=back.c;back.w++;back.dirty=false;thr.c=null;back.c=null;
 fr.push({k:n+1,op:'evict',thr:{...thr},back:{...back},say:`The line is evicted. Write-through has nothing left to do; write-back copies the dirty value ${n} to RAM once. Slow writes: ${thr.w} against ${back.w}.`});
 return fr;
}
SCENE({id:'ma-write-policy',name:'Write-through and write-back',tag:'When does memory find out?',
 definition:'Two ways a cache can handle writes. Write-through copies every write to main memory at once. Write-back only marks the cached line as dirty and writes it to memory once, when the line is evicted.',
 example:'A loop that adds to the same total 1,000 times causes 1,000 slow memory writes with write-through, but only one with write-back. The cost is that memory is out of date until the line is written back.',
 desc:'Two lanes, each with a processor, a cache and main memory: the top lane writes through to memory on every store, the bottom lane marks the cache line dirty and writes it back once on eviction.',
 dur:12,hint:'Change how many times the program writes. Count the slow memory writes in each lane.',
 init:()=>({writes:4}),
 trace:MA_writeTrace,
 ui:[{range:'writes',label:'Writes',min:1,max:8,get:s=>s.writes,act:'w'}],
 on:{w(s,v){s.writes=v}},
 draw(s,f,X){
  let out=heading(f.op==='evict'?'Eviction: the line leaves the cache':`x = ${Math.max(0,f.k)}`,24);
  [['Write-through','thr',60],['Write-back','back',214]].forEach(([name,key,y])=>{const st=f[key],evict=f.op==='evict',w=f.op==='w';
   out+=TB(30,y,name,15,C.ink,'start');
   out+=R(30,y+14,110,74,C.pale,'none',10)+TBF(85,y+46,'CPU',15,C.ink)+TF(85,y+68,f.k>=1&&!evict?'x = '+f.k:'',13,C.blue);
   out+=R(210,y+14,140,74,st.dirty?C.amberp:'#fff',st.dirty?C.amber:C.line,10)+TF(280,y+34,'cache',12,C.muted)+TB(280,y+62,st.c===null?'—':'x = '+st.c,17,C.ink)+(st.dirty?TF(280,y+82,'dirty',12,C.amber,'middle','font-weight="700"'):'');
   out+=R(420,y+14,150,74,'#eef1f3',C.line,10)+TF(495,y+34,'main memory (slow)',12,C.muted)+TB(495,y+62,'x = '+st.ram,17,C.ink);
   out+=arrow(142,y+51,206,y+51,w?C.blue:C.line,2.2,7);
   const toRam=(key==='thr'&&w)||(key==='back'&&evict);out+=arrow(352,y+51,416,y+51,toRam?C.coral:C.line,toRam?3:1.8,8);
   out+=TF(495,y+108,`slow writes: ${st.w}`,14,toRam?C.coral:C.ink,'middle','font-weight="700"');
  });
  return {svg:out,phase:f.say};
 }});

/* ---- Compiler lesson ---- */
const MA_TOKCOL={name:C.blue,number:C.green,operator:C.purple,assign:C.amber,bracket:C.muted,error:C.coral};
function MA_lex(src){
 const s=String(src),toks=[];let i=0;
 while(i<s.length){const c=s[i];
  if(c===' '){i++;continue}
  if(/[A-Za-z_]/.test(c)){let j=i;while(j<s.length&&/[A-Za-z0-9_]/.test(s[j]))j++;toks.push({k:'name',text:s.slice(i,j),at:i,end:j});i=j}
  else if(/\d/.test(c)){let j=i;while(j<s.length&&/\d/.test(s[j]))j++;toks.push({k:'number',text:s.slice(i,j),at:i,end:j});i=j}
  else if('+-*/'.includes(c)){toks.push({k:'operator',text:c,at:i,end:i+1});i++}
  else if(c==='='){toks.push({k:'assign',text:c,at:i,end:i+1});i++}
  else if('()'.includes(c)){toks.push({k:'bracket',text:c,at:i,end:i+1});i++}
  else {toks.push({k:'error',text:c,at:i,end:i+1});i++}
 }
 return toks;
}
SCENE({id:'ma-lexer',name:'Lexical analysis',tag:'Splitting text into tokens',
 definition:'The first step of compiling: scanning the source text character by character and grouping the characters into tokens such as names, numbers and operators, while throwing away spaces.',
 example:'“total = price * 12” becomes five tokens: the name total, the symbol =, the name price, the operator * and the number 12. A character this toy language does not know, such as #, is reported as an error. Which characters are valid depends on the language: in Python, # starts a comment.',
 desc:'The source text in character cells with a bracket marking the token being read, and below it the tokens found so far as coloured chips labelled name, number, operator or symbol.',
 dur:12,hint:'Type a line of code. Spaces disappear, letters and digits group together, and symbols this toy language does not know, such as # or $, are flagged.',
 init:()=>({src:'total = price * 12'}),
 trace(s){const toks=MA_lex(s.src).slice(0,12);const fr=[{n:0,toks,say:'The lexer starts at the first character. It does not yet know what any of the text means.'}];toks.forEach((t,i)=>fr.push({n:i+1,toks,say:t.k==='error'?`“${t.text}” does not belong to any kind of token: a lexical error, reported before parsing even starts.`:`Read “${t.text}”: ${t.k==='name'?'letters (and digits) make a name':t.k==='number'?'digits make a number':t.k==='operator'?'an arithmetic operator':t.k==='assign'?'the assignment symbol':'a bracket'}.`}));fr.push({n:toks.length,toks,done:true,say:`${toks.length} tokens. ${toks.some(t=>t.k==='error')?'Fix the flagged character before the parser can run.':'These tokens go to the parser, which checks how they fit together.'}`});return fr},
 ui:[{text:'Code',label:'Code',get:s=>s.src,act:'src',max:24},{choose:[['total = price * 12','total = price * 12'],['area=(w+2)*h','area=(w+2)*h'],['x = 3 # 4','x = 3 # 4']],label:'Examples',get:s=>s.src,act:'src'}],
 on:{src(s,v){s.src=String(v)}},
 draw(s,f,X){
  const src=s.src.slice(0,24),cw=Math.min(23,540/Math.max(1,src.length)),x0=300-src.length*cw/2;let out=heading('Lexing: characters → tokens',24);
  const cur=f.n>0&&!f.done?f.toks[f.n-1]:null;
  Array.from(src).forEach((c,i)=>{const done=f.toks.slice(0,f.n).some(t=>i>=t.at&&i<t.end),inCur=cur&&i>=cur.at&&i<cur.end;out+=R(x0+i*cw,52,cw-2,34,inCur?C.amberp:done?'#eef3f6':'#fff',C.grid,4)+TMF(x0+i*cw+cw/2-1,75,c===' '?'·':c,16,c===' '?C.line:done?C.muted:C.ink)});
  if(cur)out+=P(`M${fmt(x0+cur.at*cw)} 92V98H${fmt(x0+cur.end*cw-2)}V92`,C.amber,2.4);
  out+=T(300,124,'Tokens',13,C.muted);
  let x=40,y=136;f.toks.slice(0,f.n).forEach((t,i)=>{const w=Math.max(54,t.text.length*10+22);if(x+w>570){x=40;y+=64}const col=MA_TOKCOL[t.k];
   out+=R(x,y,w,30,t.k==='error'?C.coralp:'#fff',col,7)+TMF(x+w/2,y+20,t.text,15,col,'middle','font-weight="700"')+TF(x+w/2,y+46,t.k==='assign'?'symbol':t.k,11.5,col);x+=w+10});
  out+=TF(300,330,'name · number · operator · symbol · bracket — spaces are skipped',13,C.muted);
  return {svg:out,phase:f.say};
 }});

function MA_syntaxTrace(s){
 const toks=MA_lex(s.src).filter(t=>t.k!=='error'||true).slice(0,12),fr=[{n:0,expect:'operand',depth:0,toks,say:'The parser reads tokens left to right. At the start it expects an operand: a number, a name or an opening bracket.'}];let expect='operand',depth=0,err=null;
 for(let i=0;i<toks.length&&!err;i++){const t=toks[i];let ok=true,msg;
  if(t.k==='error'){ok=false;msg=`“${t.text}” is not a valid token.`}
  else if(expect==='operand'){if(t.k==='number'||t.k==='name'){expect='operator';msg=`“${t.text}” is an operand, as expected. Next we need an operator, a closing bracket, or the end.`}else if(t.text==='('){depth++;msg='An opening bracket: still expecting an operand inside it.'}else{ok=false;msg=`Expected a number, a name or “(”, but found “${t.text}”.`}}
  else{if(t.k==='operator'){expect='operand';msg=`“${t.text}” is an operator, as expected. Now an operand must follow.`}else if(t.text===')'){if(depth>0){depth--;msg='A closing bracket matches an open one.'}else{ok=false;msg='This “)” has no matching “(”.'}}else{ok=false;msg=`Expected an operator after the operand, but found “${t.text}”. Is a + or * missing?`}}
  if(!ok)err={i,msg};
  fr.push({n:i+1,expect,depth,toks,bad:ok?null:i,say:ok?msg:'Syntax error: '+msg})}
 if(!err){const endOk=expect==='operator'&&depth===0;fr.push({n:toks.length,expect,depth,toks,end:true,bad:endOk?null:toks.length,say:endOk?'The input ends where an operand has just finished and every bracket is closed: the syntax is correct.':'Syntax error: '+(expect==='operand'?'the expression ends where an operand was still expected.':`${depth} bracket${depth>1?'s are':' is'} still open at the end.`)})}
 return fr;
}
SCENE({id:'ma-syntax-error',name:'Syntax errors',tag:'Tokens that do not fit the grammar',
 definition:'A syntax error is a sequence of tokens that breaks the grammar of the language, for example two numbers with no operator between them. The parser finds it by tracking what kind of token may come next.',
 example:'In “2 + * 3” every token is valid on its own, but after + the grammar requires an operand, not *. The compiler stops and points at the * before any code is generated.',
 desc:'A row of tokens with ticks or a cross, a chip showing whether the parser expects an operand or an operator next, a bracket-depth counter, and the error message with a caret.',
 dur:12,hint:'Type an expression or pick an example. The parser expects operand, operator, operand… and every “(” needs a “)”.',
 init:()=>({src:'2 + * 3'}),
 trace:MA_syntaxTrace,
 ui:[{text:'Expression',label:'Expression',get:s=>s.src,act:'src',max:20},{choose:[['2 + * 3','2 + * 3'],['(4 + 5','(4 + 5'],['7 8','7 8'],['3 + (2 * x)','3 + (2 * x)']],label:'Examples',get:s=>s.src,act:'src'}],
 on:{src(s,v){s.src=String(v)}},
 draw(s,f,X){
  const toks=f.toks,w=Math.min(52,540/Math.max(1,toks.length)),x0=300-toks.length*w/2;let out=heading('Parsing: does each token fit?',24);
  toks.forEach((t,i)=>{const read=i<f.n,bad=f.bad===i;out+=R(x0+i*w+3,60,w-6,40,bad?C.coralp:read?C.greenp:'#fff',bad?C.coral:read?C.green:C.grid,7)+TMF(x0+i*w+w/2,86,t.text,17,C.ink,'middle','font-weight="700"');
   if(read)out+=TBF(x0+i*w+w/2,122,bad?'✗':'✓',17,bad?C.coral:C.green)});
  if(f.bad!==null&&f.bad!==undefined){const bx=f.bad>=toks.length?x0+toks.length*w+6:x0+f.bad*w+w/2;out+=`<polygon points="${fmt(bx)},134 ${fmt(bx-8)},148 ${fmt(bx+8)},148" fill="${C.coral}"/>`}
  out+=R(60,170,220,60,f.expect==='operand'?C.pale:C.purplep,'none',10)+TF(170,192,'next we expect',13,C.muted)+TB(170,218,f.expect==='operand'?'an operand':'an operator',18,f.expect==='operand'?C.blue:C.purple);
  out+=counter(320,177,'open brackets',f.depth,f.depth?C.amber:C.muted,140);
  const err=f.bad!==null&&f.bad!==undefined;out+=R(60,256,480,70,err?C.coralp:f.end?C.greenp:'#fff',err?C.coral:f.end?C.green:C.grid,10);
  out+=TB(300,284,err?'Syntax error':f.end?'Valid expression':'Reading…',17,err?C.coral:f.end?C.green:C.muted)+TF(300,310,'operand → operator → operand → … and every “(” is closed',13,C.muted);
  return {svg:out,phase:f.say};
 }});

const MA_OPT=[
 {src:'x = 2 * 3 + y',fold:'x = 6 + y',cost:[5,3],kind:'fold'},
 {src:'z = y * 1',alg:'z = y',cost:[3,1],kind:'alg'},
 {src:'w = z + 0',alg:'w = z',cost:[3,1],kind:'alg'},
 {src:'if 4 < 3:',dead:true,cost:[4,0],kind:'dead'},
 {src:'    print(w)',dead:true,cost:[2,0],kind:'dead'},
 {src:'print(x)',cost:[2,2],kind:null}];
function MA_optAfter(l,s){if(l.kind==='fold'&&s.fold)return {text:l.fold,cost:l.cost[1]};if(l.kind==='alg'&&s.alg)return {text:l.alg,cost:l.cost[1]};if(l.kind==='dead'&&s.dead)return {text:null,cost:0};return {text:l.src,cost:l.cost[0]}}
SCENE({id:'ma-optimiser',name:'Optimisation',tag:'Same meaning, less work',
 definition:'A compiler stage that rewrites the program so it does the same thing with fewer or cheaper instructions: working out constant expressions in advance, simplifying, and removing code that can never run.',
 example:'2 * 3 is always 6, so the compiler writes 6 (constant folding). y * 1 is just y. Code inside “if 4 < 3” can never run, so it is deleted (dead-code elimination).',
 desc:'The program before optimisation on the left and after on the right; each line is checked in turn, rewritten or removed, and a counter compares the instructions needed before and after.',
 dur:13,hint:'Turn each optimisation on or off and step through the lines. Watch the instruction count.',
 init:()=>({fold:true,alg:true,dead:true}),
 ui:[{b:'Constant folding on/off',act:'t',arg:'fold'},{b:'Simplify on/off',act:'t',arg:'alg'},{b:'Dead code on/off',act:'t',arg:'dead'}],
 on:{t(s,k){s[k]=!s[k];return 'end'}},
 trace(s){const fr=[{k:-1,say:'Before optimising, the compiler has a correct but wasteful program.'}];MA_OPT.forEach((l,i)=>{const a=MA_optAfter(l,s);fr.push({k:i,say:a.text===null?`“${l.src.trim()}”: ${l.src.startsWith('if')?'4 < 3 is always false, so this branch can never run':'inside a branch that never runs'}. Removed.`:a.text!==l.src?`“${l.src}” becomes “${a.text}”: ${l.kind==='fold'?'2 * 3 is worked out now, not every time the program runs':'multiplying by 1 or adding 0 changes nothing'}.`:l.kind?`“${l.src.trim()}” is left alone because that optimisation is switched off.`:`“${l.src}” cannot be improved.`})});const b=sum(MA_OPT.map(l=>l.cost[0])),a=sum(MA_OPT.map(l=>MA_optAfter(l,s).cost));fr.push({k:MA_OPT.length,done:true,say:`Done: ${b} instructions became ${a}. The program’s output is exactly the same.`});return fr},
 draw(s,f,X){
  let out=heading('Optimising: same output, fewer instructions',24);
  [['fold','folding'],['alg','simplify'],['dead','dead code']].forEach(([k,l],i)=>{const on=s[k];out+=hit(X,'t',k,`${l}: ${on?'on':'off'}. Press to switch.`,R(70+i*160,44,140,28,on?C.greenp:'#fff',on?C.green:C.line,14)+TF(140+i*160,63,l+(on?' ✓':' ✗'),13,on?C.green:C.muted,'middle','font-weight="650"'))});
  out+=TF(30,98,'Before',13,C.muted,'start','font-weight="650"')+TF(320,98,'After',13,C.muted,'start','font-weight="650"');
  let before=0,after=0;
  MA_OPT.forEach((l,i)=>{const y=108+i*36,seen=i<=f.k,cur=i===f.k,a=MA_optAfter(l,s);if(seen){before+=l.cost[0];after+=a.cost}
   out+=R(24,y,264,30,cur?C.amberp:'#fff',cur?C.amber:C.grid,6)+TMF(36,y+20,l.src,14,C.ink,'start','xml:space="preserve"');
   if(seen){out+=arrow(292,y+15,312,y+15,C.line,1.8,6);
    if(a.text===null)out+=R(316,y,264,30,'#f2f4f5','none',6)+TF(448,y+20,'removed',13,C.muted,'middle','font-style="italic"');
    else out+=R(316,y,264,30,a.text!==l.src?C.greenp:'#fff',a.text!==l.src?C.green:C.grid,6)+TMF(328,y+20,a.text,14,C.ink,'start','xml:space="preserve"')}});
  out+=counter(120,328,'instructions before',before,C.coral,150)+counter(330,328,'after',after,C.green,150);
  return {svg:out,phase:f.say};
 }});

/* ---- Interpreter lesson ---- */
function MA_vmTrace2(s){
 const P=MA_parse(s.src);if(P.error)return [{err:P.error,say:P.error}];
 const code=P.post.map(MA_instr),stack=[],fr=[{pc:-1,code,stack:[],say:`The expression has already been compiled to ${code.length} bytecode instructions. Now a virtual machine runs them, using a stack.`}];
 P.post.forEach((n,i)=>{let say;if(n.t==='num'){stack.push(n.v);say=`PUSH ${n.v}: put ${n.v} on top of the stack.`}else{const b=stack.pop(),a=stack.pop(),r=n.op==='+'?a+b:n.op==='-'?a-b:a*b;stack.push(r);say=`${MA_instr(n)}: pop ${b} and ${a}, push ${a} ${MA_SYM[n.op]} ${b} = ${r}.`}fr.push({pc:i,code,stack:stack.slice(),say})});
 fr.push({pc:code.length,code,stack:stack.slice(),done:true,say:`The program ends with one value on the stack: ${stack[0]}. The same bytecode would run unchanged on any computer that has this virtual machine.`});
 return fr;
}
SCENE({id:'ma-bytecode-vm',name:'Bytecode and virtual machines',tag:'A pretend processor in software',
 definition:'Bytecode is a compact list of simple instructions for an imaginary processor. A virtual machine is a program that runs bytecode, so the same bytecode works on any real computer that has the virtual machine.',
 example:'Java and Python compile source code to bytecode, then a virtual machine executes it. A stack machine runs (2+3)×4 as PUSH 2, PUSH 3, ADD, PUSH 4, MUL.',
 desc:'A bytecode listing with an instruction pointer on the left and the virtual machine’s stack on the right, growing as numbers are pushed and shrinking as operators combine them.',
 dur:13,hint:'Type an expression, then step: each PUSH adds to the stack; each operator pops two values and pushes the answer.',
 init:()=>({src:'(2+3)*4'}),
 trace:MA_vmTrace2,
 ui:[{text:'Expression',label:'Expression',get:s=>s.src,act:'src',max:15},{choose:[['(2+3)*4','(2+3)×4'],['2+3*4','2+3×4'],['9-4-2','9−4−2']],label:'Examples',get:s=>s.src,act:'src'}],
 on:{src(s,v){s.src=String(v)}},
 draw(s,f,X){
  const P=MA_parse(s.src);if(f.err)return {svg:MA_errorView(P,s.src),phase:f.say};
  let out=heading('A stack-based virtual machine runs the bytecode',24);
  out+=R(30,46,220,310,'#fff',C.grid,10)+TF(140,66,'Bytecode',13,C.muted,'middle','font-weight="650"');
  const rh=Math.min(26,270/f.code.length);
  f.code.forEach((c,i)=>{const y=76+i*rh,cur=i===f.pc;out+=R(44,y,194,rh-3,cur?C.coralp:i<f.pc?'#eef3f6':'#fff',cur?C.coral:'none',5)+TMF(58,y+rh/2+3,pad(i,2)+'  '+c,13.5,cur?C.coral:i<f.pc?C.muted:C.ink,'start','xml:space="preserve"')});
  if(f.pc>=0&&f.pc<f.code.length){const y=76+f.pc*rh+rh/2-1;out+=`<polygon points="22,${y-7} 34,${y} 22,${y+7}" fill="${C.coral}"/>`}
  out+=R(300,46,270,310,C.pale,'none',10)+TF(435,66,'Stack (top is highest)',13,C.muted,'middle','font-weight="650"');
  f.stack.forEach((v,j)=>{const y=318-j*46,top=j===f.stack.length-1;out+=R(360,y,150,38,top?C.blue:'#fff',top?C.blue:C.line,8)+TB(435,y+25,v,17,top?'#fff':C.ink)});
  if(!f.stack.length)out+=TF(435,330,'empty',13,C.muted);
  out+=L(350,360,520,360,C.ink,3);
  if(f.done)out+=R(300,80,270,34,C.greenp,'none',8)+TB(435,103,'result: '+f.stack[0],16,C.green);
  return {svg:out,phase:f.say};
 }});

function MA_jitTrace(s){
 const fr=[{c:0,interp:0,jit:0,mode:'interpreted',say:`A function will be called ${s.calls} times. Interpreting it costs 10 units per call. The just-in-time compiler watches how often it is called.`}];let a=0,b=0,compiled=false;
 for(let c=1;c<=s.calls;c++){a+=10;let mode;if(compiled){b+=2;mode='compiled'}else if(c===s.thr){b+=10+25;compiled=true;mode='compiling'}else{b+=10;mode='interpreted'}
  fr.push({c,interp:a,jit:b,mode,say:mode==='compiling'?`Call ${c}: the function is now “hot”. It is interpreted once more and also compiled to machine code (25 units, paid once).`:mode==='compiled'?`Call ${c}: the compiled machine code runs in 2 units instead of 10.`:`Call ${c}: interpreted, 10 units.`})}
 const L=fr.at(-1);fr.push({...L,done:true,say:`After ${s.calls} calls: interpreting only cost ${L.interp} units; with the JIT ${L.jit}. ${L.jit<L.interp?'Compiling paid for itself because the function was called often.':(s.calls<s.thr?'The function never became hot, so it was never compiled and the two costs are the same.':'Compiling did not pay off: the function was not called often enough after it became hot.')}`});
 return fr;
}
SCENE({id:'ma-jit',name:'Just-in-time compilation',tag:'Compile only what is busy',
 definition:'A just-in-time (JIT) compiler starts by interpreting a program, counts how often each part runs, and compiles only the busy (“hot”) parts into machine code while the program is running.',
 example:'JavaScript engines in web browsers interpret a function at first. If it is called many times, they compile it, and later calls run several times faster. Code that runs once never pays the compilation cost.',
 desc:'Two bars racing to the right: the total cost of interpreting every call, and the cost with a JIT that compiles once a function is called often enough; a strip of calls shows which were interpreted and which ran compiled.',
 dur:13,hint:'Change how many times the function is called and when it counts as hot. When does compiling pay for itself?',
 init:()=>({calls:12,thr:3}),
 trace:MA_jitTrace,
 ui:[{range:'calls',label:'Calls',min:1,max:16,get:s=>s.calls,act:'calls'},{range:'thr',label:'Hot after',min:1,max:10,get:s=>s.thr,act:'thr'}],
 on:{calls(s,v){s.calls=v},thr(s,v){s.thr=v}},
 draw(s,f,X){
  let out=heading('Interpret everything, or compile what is hot?',24);const maxV=Math.max(10*s.calls,10*s.thr+25+2*s.calls,40),sc=380/maxV;
  [['Interpret only',f.interp,C.coral,70],['JIT compiler',f.jit,C.green,140]].forEach(([l,v,col,y])=>{out+=TB(30,y+22,l,14,C.ink,'start')+R(170,y,380,34,'#fff',C.grid,6)+R(170,y,Math.max(2,v*sc),34,col,'none',6)+(v*sc>40?TBF(170+v*sc-8,y+23,v,14,'#fff','end'):TBF(178+v*sc,y+23,v,14,C.ink,'start'))});
  out+=TF(170,196,'total cost (units of time)',12,C.muted,'start');
  const cw=Math.min(32,540/s.calls);out+=TF(30,232,'calls',13,C.muted,'start');
  for(let c=1;c<=s.calls;c++){const x=30+(c-1)*cw,done=c<=f.c,m=c<s.thr?'i':c===s.thr?'c':'f';out+=R(x+2,244,cw-4,40,!done?'#fff':m==='i'?C.coralp:m==='c'?C.amberp:C.greenp,!done?C.grid:m==='i'?C.coral:m==='c'?C.amber:C.green,5)+TF(x+cw/2,269,c,12,C.ink)}
  const tx=30+(s.thr-1)*cw+cw/2;out+=L(tx,238,tx,292,C.amber,2,'stroke-dasharray="3 3"')+TF(tx,306,'hot: compile',12,C.amber,'middle','font-weight="650"');
  out+=TF(30,346,'■ interpreted (10)   ■ compiling (10 + 25)   ■ compiled (2)',13,C.muted,'start');
  return {svg:out,phase:f.say};
 }});

/* ---- Process lesson ---- */
SCENE({id:'ma-threads',name:'Threads',tag:'Several paths through one program',
 definition:'A thread is one sequence of instructions being carried out. A process can contain several threads: each has its own program counter and stack, but they all share the process’s memory.',
 example:'A web browser tab might use one thread to draw the page and another to download images. Because threads share memory, one thread can see a value another has just written. Separate processes cannot ordinarily reach each other’s private memory, unless they deliberately set up shared memory.',
 desc:'On one side, two threads inside a single process sharing one variable x; on the other, two separate processes each with their own copy of x. A value written by the first is or is not seen by the second.',
 dur:12,hint:'Choose threads or processes and the value A writes, then step. Does B see it?',
 init:()=>({mode:'threads',v:5}),
 ui:[{choose:[['threads','Two threads, one process'],['procs','Two processes']],label:'Layout',get:s=>s.mode,act:'mode'},{range:'v',label:'A writes x =',min:1,max:9,get:s=>s.v,act:'v'}],
 on:{mode(s,v){s.mode=v},v(s,v){s.v=v}},
 trace(s){const th=s.mode==='threads';return [{k:0,say:th?'One process, two threads. Each thread has its own program counter and stack, but x lives in memory they share.':'Two separate processes. The operating system gives each its own memory, so each has its own x.'},{k:1,say:`A runs x = ${s.v}.`},{k:2,say:`B runs print(x) and sees ${th?s.v:0}. ${th?'Shared memory makes cooperation easy, and mistakes easy too.':'Processes are isolated: to share data they send messages, use a file, or ask the operating system for an explicitly shared memory region.'}`}]},
 draw(s,f,X){
  const th=s.mode==='threads',xa=f.k>=1?s.v:0;let out=heading(th?'Threads share their process’s memory':'Processes each have their own memory',24);
  const thread=(x,y,name,line,active)=>R(x,y,150,92,active?C.amberp:'#fff',active?C.amber:C.line,10)+TB(x+75,y+22,'Thread '+name,14,C.ink)+TMF(x+75,y+48,line,14,C.ink)+TF(x+75,y+72,'own PC · own stack',12,C.muted);
  if(th){out+=R(40,50,520,290,C.pale,C.blue,14)+TF(60,72,'Process',13,C.blue,'start','font-weight="700"');
   out+=thread(80,90,'A',`x = ${s.v}`,f.k===1)+thread(370,90,'B','print(x)',f.k===2);
   out+=R(220,232,160,76,'#fff',C.blue,10)+TF(300,254,'shared memory',12,C.muted)+TB(300,290,'x = '+xa,20,C.blue);
   if(f.k>=1)out+=arrow(170,184,250,232,C.amber,2.4,8);if(f.k>=2)out+=arrow(350,232,430,184,C.green,2.4,8)}
  else{[[30,'A',`x = ${s.v}`,1],[310,'B','print(x)',2]].forEach(([x,n,line,k])=>{out+=R(x,50,260,290,C.pale,C.blue,14)+TF(x+20,72,'Process '+n,13,C.blue,'start','font-weight="700"')+thread(x+55,90,n,line,f.k===k);
    const v=n==='A'?xa:0;out+=R(x+50,232,160,76,'#fff',C.blue,10)+TF(x+130,254,'its own memory',12,C.muted)+TB(x+130,290,'x = '+v,20,C.blue)});
   if(f.k>=1)out+=arrow(110,184,140,232,C.amber,2.4,8);if(f.k>=2)out+=arrow(440,232,420,184,C.green,2.4,8)}
  if(f.k>=2)out+=R(150,348,300,28,th?C.greenp:C.coralp,'none',8)+TBF(300,367,`B prints ${th?s.v:0}`,14,th?C.green:C.coral);
  return {svg:out,phase:f.say};
 }});

const MA_RSTEPS=['read','add','write'];
function MA_raceRun(sched,lock){
 const steps=lock?['lock','read','add','write','unlock']:MA_RSTEPS,st={A:{i:0,reg:null},B:{i:0,reg:null}};let x=0,holder=null,waits=0;const fr=[{x,st:JSON.parse(JSON.stringify(st)),holder,waits,j:-1,say:lock?'Each thread must take the lock before touching the counter, and release it afterwards.':'Each thread adds 1 to a shared counter in three steps: read it into a register, add 1, write it back.'}];
 Array.from(sched).forEach((who,j)=>{const t=st[who];if(t.i>=steps.length){fr.push({x,st:JSON.parse(JSON.stringify(st)),holder,waits,j,who,skip:true,say:`Thread ${who} has already finished.`});return}
  const op=steps[t.i];let say;
  if(op==='lock'){if(holder&&holder!==who){waits++;fr.push({x,st:JSON.parse(JSON.stringify(st)),holder,waits,j,who,blocked:true,say:`Thread ${who} wants the lock, but ${holder} holds it, so ${who} must wait.`});return}holder=who;say=`Thread ${who} takes the lock.`}
  else if(op==='read'){t.reg=x;say=`Thread ${who} reads the counter: ${x}.`}
  else if(op==='add'){t.reg++;say=`Thread ${who} adds 1 in its own register: ${t.reg}.`}
  else if(op==='write'){x=t.reg;say=`Thread ${who} writes ${t.reg} back to the counter.`}
  else {holder=null;say=`Thread ${who} releases the lock.`}
  t.i++;fr.push({x,st:JSON.parse(JSON.stringify(st)),holder,waits,j,who,op,say})});
 const L=fr.at(-1),done=st.A.i>=steps.length&&st.B.i>=steps.length;
 fr.push({...L,end:true,done,j:sched.length,say:done?(L.x===2?`Both threads finished and the counter is 2, as expected.${lock?` ${L.waits} wait${L.waits===1?'':'s'} kept them from interfering.`:''}`:`Both threads finished, but the counter is ${L.x}, not 2: one update was lost because both read the old value before either wrote.`):`Not finished yet: add more steps for ${st.A.i<steps.length?'A':''}${st.A.i<steps.length&&st.B.i<steps.length?' and ':''}${st.B.i<steps.length?'B':''}.`});
 return fr;
}
function MA_raceDraw(s,f,X,lock){
 const steps=lock?['lock','read','add','write','unlock']:MA_RSTEPS,rh=lock?40:56;let out=heading(lock?'With a lock, only one thread touches the counter at a time':'Two threads add 1 to the same counter',24);
 ['A','B'].forEach((who,c)=>{const x=c?400:30,t=f.st[who];out+=TB(x+85,58,'Thread '+who,15,c?C.purple:C.blue);
  steps.forEach((op,i)=>{const y=70+i*rh,done=i<t.i,cur=f.who===who&&!f.end&&(f.op===op&&i===t.i-1||f.blocked&&i===t.i);out+=R(x,y,170,rh-8,cur?(f.blocked?C.coralp:C.amberp):done?C.greenp:'#fff',cur?(f.blocked?C.coral:C.amber):done?C.green:C.grid,8)+TF(x+85,y+(rh-8)/2+5,{lock:'take lock',read:'read counter',add:'add 1',write:'write counter',unlock:'release lock'}[op]+(done?' ✓':''),14,C.ink)});
  out+=TF(x+85,76+steps.length*rh,'register: '+(t.reg===null?'—':t.reg),13,C.muted)});
 out+=R(230,100,140,90,'#fff',C.blue,12)+TF(300,124,'shared counter',12,C.muted)+TB(300,168,f.x,30,C.blue);
 if(lock)out+=R(230,206,140,46,f.holder?C.amberp:C.greenp,'none',10)+TBF(300,234,f.holder?'lock: '+f.holder:'lock: free',15,f.holder?C.amber:C.green);
 const sx=30;out+=TF(sx,346,'Order:',13,C.muted,'start');Array.from(s.sched).forEach((w,j)=>{const x=sx+50+j*26;out+=R(x,330,22,24,j===f.j?C.amberp:'#fff',w==='A'?C.blue:C.purple,5)+TBF(x+11,347,w,13,w==='A'?C.blue:C.purple)});
 if(f.end&&f.done)out+=R(220,270,160,36,f.x===2?C.greenp:C.coralp,'none',8)+TB(300,294,f.x===2?'2 ✓':`${f.x} ✗ (lost update)`,15,f.x===2?C.green:C.coral);
 return out;
}
SCENE({id:'ma-race-condition',name:'Race condition',tag:'When timing changes the answer',
 definition:'A bug where the result depends on the exact order in which threads happen to run. It appears when threads share data and at least one writes to it without coordination.',
 example:'Two threads each add 1 to a counter that starts at 0. If one reads, then the other reads before the first writes, both write 1: the final value is 1, not 2. Most runs work, which makes the bug hard to find.',
 desc:'Two columns of steps, one per thread, either side of a shared counter, with the chosen running order shown as a strip of A and B tiles at the bottom.',
 dur:13,hint:'Build a running order with the A and B buttons, or pick a preset. Can you find an order that loses an update?',
 init:()=>({sched:'ABABAB'}),
 ui:[{b:'A runs a step',act:'add',arg:'A'},{b:'B runs a step',act:'add',arg:'B'},{b:'A then B',act:'preset',arg:'AAABBB'},{b:'Interleaved',act:'preset',arg:'ABABAB'},{b:'Clear',act:'preset',arg:''}],
 on:{add(s,w){if(s.sched.length<8)s.sched+=w;return 'end'},preset(s,v){s.sched=v;return v?'run':undefined}},
 trace(s){return MA_raceRun(s.sched,false)},
 draw(s,f,X){return {svg:MA_raceDraw(s,f,X,false),phase:f.say}}});

SCENE({id:'ma-mutex',name:'Locks and mutual exclusion',tag:'One at a time',
 definition:'A lock (or mutex) lets only one thread at a time into a critical section, the code that touches shared data. Another thread that wants the lock has to wait until it is released.',
 example:'With a lock around “read, add 1, write”, the two threads’ updates can no longer interleave, so the counter always ends at 2. The price is waiting, and the risk of deadlock if locks are taken carelessly.',
 desc:'The same two threads and shared counter as the race condition, now with a lock: each thread must take the lock before reading and release it after writing, and a blocked thread’s step turns red.',
 dur:14,hint:'Try the interleaved order that broke the counter before. Watch B wait while A holds the lock.',
 init:()=>({sched:'ABABABABABBBBB'}),
 ui:[{b:'A runs a step',act:'add',arg:'A'},{b:'B runs a step',act:'add',arg:'B'},{b:'Interleaved',act:'preset',arg:'ABABABABABBBBB'},{b:'Clear',act:'preset',arg:''}],
 on:{add(s,w){if(s.sched.length<16)s.sched+=w;return 'end'},preset(s,v){s.sched=v;return v?'run':undefined}},
 trace(s){return MA_raceRun(s.sched,true)},
 draw(s,f,X){return {svg:MA_raceDraw(s,f,X,true),phase:f.say}}});

/* ---- Scheduling lesson ---- */
function MA_prioTrace(s){
 const jobs=[{id:'L',prio:1,len:3,arr:0,col:C.coral}];for(let a=0,k=1;a<=14;a+=2,k++)jobs.push({id:'H'+k,prio:5,len:2,arr:a,col:C.blue});
 jobs.forEach(j=>{j.left=j.len;j.wait=0});const fr=[{t:0,run:[],jobs:JSON.parse(JSON.stringify(jobs)),say:`A low-priority job L (priority 1) arrives with high-priority jobs (priority 5) arriving every 2 ticks.${s.aging?' With ageing, a waiting job gains 1 priority per tick.':''}`}];const run=[];
 for(let t=0;t<16;t++){const ready=jobs.filter(j=>j.arr<=t&&j.left>0);if(!ready.length){run.push(null);continue}
  const eff=j=>j.prio+(s.aging?j.wait:0);ready.sort((a,b)=>eff(b)-eff(a)||a.arr-b.arr);const r=ready[0];r.left--;ready.slice(1).forEach(j=>j.wait++);run.push(r.id);
  const L=jobs[0];fr.push({t:t+1,run:run.slice(),jobs:JSON.parse(JSON.stringify(jobs)),cur:r.id,say:r.id==='L'?`Tick ${t}: L finally runs (effective priority ${eff(L)}).`:`Tick ${t}: ${r.id} runs. L has waited ${L.wait} tick${L.wait===1?'':'s'}${s.aging?`; its priority has aged to ${eff(L)}`:''}.`})}
 const L=jobs[0];fr.push({...fr.at(-1),done:true,say:L.left===0?`L finished at last. Ageing stopped it starving: the longer it waited, the higher its priority grew.`:`After 16 ticks L has still not finished: it is starving, because there is always a higher-priority job ready.`});
 return fr;
}
SCENE({id:'ma-priority',name:'Priority and starvation',tag:'Important first, but not forever',
 definition:'Priority scheduling always runs the most important ready job. If important jobs keep arriving, a low-priority job may never run: starvation. Ageing fixes this by raising a job’s priority the longer it waits.',
 example:'An operating system gives the mouse pointer and audio high priority so they stay smooth, but slowly raises the priority of a waiting background backup so it does eventually finish.',
 desc:'A timeline of 16 ticks showing which job the processor runs, with a row tracking how long the low-priority job L has waited and its effective priority.',
 dur:13,hint:'Run it with ageing off, then on. Does job L ever get the processor?',
 init:()=>({aging:false}),
 ui:[{choose:[['0','Ageing off'],['1','Ageing on']],label:'Ageing',get:s=>s.aging?'1':'0',act:'aging'}],
 on:{aging(s,v){s.aging=v==='1'}},
 trace:MA_prioTrace,
 draw(s,f,X){
  const cw=30,x0=90;let out=heading(s.aging?'Priority scheduling with ageing':'Priority scheduling without ageing',24);
  out+=TB(x0-12,96,'CPU',14,C.ink,'end');for(let t=0;t<16;t++){const id=f.run[t],x=x0+t*cw;out+=R(x+1,72,cw-2,40,id?(id==='L'?C.coral:C.blue):'#fff',C.grid,4,'stroke-width="1"');if(id)out+=TBF(x+cw/2,97,id,id.length>1?11:13,'#fff');out+=TF(x+cw/2,128,t,11,C.muted)}
  const L=f.jobs[0];out+=TB(x0-12,166,'L waits',13,C.coral,'end');
  let w=0;for(let t=0;t<f.run.length;t++){const x=x0+t*cw;if(f.run[t]!=='L'&&t<16){w++;out+=R(x+5,150,cw-10,24,C.coralp,'none',4)}}
  out+=counter(90,200,'L has waited',L.wait+(L.wait===1?' tick':' ticks'),C.coral,150)+counter(256,200,'L’s priority',1+(s.aging?L.wait:0),s.aging?C.green:C.coral,130)+counter(402,200,'L still needs',L.left+(L.left===1?' tick':' ticks'),L.left?C.coral:C.green,150);
  out+=R(90,270,462,64,C.pale,'none',10)+TF(321,294,'High-priority jobs: priority 5, arrive every 2 ticks, take 2 ticks',13,C.ink)+TF(321,318,'L: priority 1, arrives at tick 0, needs 3 ticks',13,C.ink);
  return {svg:out,phase:f.say};
 }});

function MA_dineTrace(s){
 const n=s.n,forks=range(n).map(()=>null),st=range(n).map(()=>'think'),first=i=>s.rule==='left'?i:Math.min(i,(i+1)%n),second=i=>s.rule==='left'?(i+1)%n:Math.max(i,(i+1)%n);
 const snap=(extra)=>({forks:forks.slice(),st:st.slice(),...extra});const fr=[snap({say:`${n} philosophers sit round a table with one fork between each pair. Each needs both neighbouring forks to eat. Rule: ${s.rule==='left'?'everyone picks up their left fork first':'pick up the lower-numbered fork first'}.`})];
 for(let round=0;round<8;round++){let progress=false;
  for(let i=0;i<n;i++){if(st[i]==='done')continue;
   if(st[i]==='think'){const f1=first(i);if(forks[f1]===null){forks[f1]=i;st[i]='one';progress=true;fr.push(snap({who:i,say:`P${i} picks up fork ${f1}.`}))}else fr.push(snap({who:i,wait:f1,say:`P${i} wants fork ${f1}, but P${forks[f1]} has it. P${i} waits.`}))}
   else if(st[i]==='one'){const f2=second(i);if(forks[f2]===null){forks[f2]=i;fr.push(snap({who:i,eat:true,say:`P${i} picks up fork ${f2} and eats.`}));forks[first(i)]=null;forks[f2]=null;st[i]='done';progress=true;fr.push(snap({who:i,say:`P${i} finishes and puts both forks down.`}))}else fr.push(snap({who:i,wait:f2,say:`P${i} holds one fork and waits for fork ${f2}, held by P${forks[f2]}.`}))}
  }
  if(st.every(x=>x==='done')){fr.push(snap({end:true,ok:true,say:'Everyone has eaten. Taking forks in a fixed global order makes a cycle of waiting impossible.'}));return fr}
  if(!progress){fr.push(snap({end:true,dead:true,say:'Deadlock: every philosopher holds one fork and waits for the next, all the way round the table. Nobody can ever continue.'}));return fr}
 }
 return fr;
}
SCENE({id:'ma-deadlock',name:'Deadlock',tag:'Everyone waiting for everyone',
 definition:'A deadlock happens when a group of processes each hold a resource and wait for one held by the next, in a closed cycle, so none of them can ever continue.',
 example:'The dining philosophers: if every philosopher picks up their left fork, each then waits forever for their right one. Always taking the lower-numbered fork first breaks the cycle.',
 desc:'A round table with philosophers and forks; forks are coloured by who holds them, and red arrows show who is waiting for whom, closing into a cycle when the table deadlocks.',
 dur:14,hint:'Choose how many philosophers and the fork rule, then step. Which rule deadlocks?',
 init:()=>({n:4,rule:'left'}),
 ui:[{range:'n',label:'Philosophers',min:2,max:5,get:s=>s.n,act:'n'},{choose:[['left','Left fork first'],['order','Lower number first']],label:'Rule',get:s=>s.rule,act:'rule'}],
 on:{n(s,v){s.n=v},rule(s,v){s.rule=v}},
 trace:MA_dineTrace,
 draw(s,f,X){
  const n=s.n,cx=230,cy=200,pr=128,fr=78,cols=[C.blue,C.purple,C.green,C.amber,C.coral];let out=heading(f.dead?'Deadlock: a cycle of waiting':'The dining philosophers',24);
  out+=Ci(cx,cy,92,C.pale,C.line);
  const pa=i=>-Math.PI/2+i*2*Math.PI/n,fa=i=>pa(i)+Math.PI/n,pp=i=>[cx+pr*Math.cos(pa(i)),cy+pr*Math.sin(pa(i))],fp=i=>[cx+fr*Math.cos(fa(i)),cy+fr*Math.sin(fa(i))];
  if(f.wait!==undefined&&!f.end){const h=f.forks[f.wait];if(h!==null)out+=arrowR(pp(f.who),pp(h),30,32,C.coral,2.6)}
  if(f.dead)for(let i=0;i<n;i++){const h=f.forks[(i+1)%n];if(h!==null&&h!==i)out+=arrowR(pp(i),pp(h),30,32,C.coral,2.6)}
  for(let i=0;i<n;i++){const [x,y]=fp(i),h=f.forks[i];out+=`<g transform="rotate(${fmt(fa(i)*180/Math.PI+90)} ${fmt(x)} ${fmt(y)})">`+R(x-5,y-22,10,44,h===null?'#fff':cols[h],h===null?C.line:cols[h],4)+'</g>'+TF(cx+(fr-30)*Math.cos(fa(i)),cy+(fr-30)*Math.sin(fa(i))+4,'f'+i,11,C.muted)}
  for(let i=0;i<n;i++){const [x,y]=pp(i),st=f.st[i],cur=f.who===i&&!f.end;out+=Ci(x,y,28,st==='done'?C.greenp:'#fff',cur?C.ink:cols[i])+TB(x,y+5,'P'+i,15,cols[i]);
   out+=TF(x,Math.sin(pa(i))<-.3?y-36:y+44,st==='done'?'ate':st==='one'?'1 fork':'thinking',11.5,C.muted)}
  out+=R(400,70,180,96,'#fff',C.grid,10)+TF(490,92,'rule',12,C.muted)+TB(490,118,s.rule==='left'?'left fork first':'lower number first',14,C.ink)+TF(490,146,f.end?(f.dead?'result: deadlock':'result: all ate'):'running…',13,f.end?(f.dead?C.coral:C.green):C.muted,'middle','font-weight="650"');
  out+=R(400,190,180,120,C.pale,'none',10)+TF(490,212,'Deadlock needs all of:',12,C.muted,'middle','font-weight="650"');
  ['hold and wait','no taking forks away','one at a time per fork','a cycle of waiting'].forEach((t,i)=>out+=TF(412,236+i*20,'• '+t,12,i===3&&s.rule==='order'?C.green:C.ink,'start'));
  return {svg:out,phase:f.say};
 }});

/* ---- 3D companion: the memory hierarchy as a stepped pyramid ---- */
SCENES['memory-hierarchy'].three=(s,f,X,project)=>{
 const n=MA_LEVELS.length,side=i=>0.7+i*0.62,h=.42,P=project([[-2.4,-2.4,0],[2.4,2.4,0],[0,0,n*h+.2]]);let faces=[];
 MA_LEVELS.forEach((lv,i)=>{const sd=side(i),z=(n-1-i)*h,found=i===s.lvl&&f.ph!=='ask'&&f.ph!=='miss',vis=f.at>=i&&f.ph!=='done'||(f.ph==='up'&&i>=f.at)||f.ph==='done'&&i<=s.lvl;
  faces.push(...prism(-sd/2,-sd/2,z,sd,sd,h*.92,found?'#4fa392':vis?'#e2b553':i===0?'#7d9fb5':'#a9c1d0'))});
 // Shrink and shift the pyramid left so the label column on the right stays clear.
 const tx=x=>300+.82*(x-370),tyy=y=>196+.82*(y-196);
 let out=`<g transform="translate(300 196) scale(.82) translate(-370 -196)">`+paintFaces(faces,P)+'</g>';
 MA_LEVELS.forEach((lv,i)=>{const sd=side(i),z=(n-1-i)*h+h*.46,found=i===s.lvl&&f.ph!=='ask'&&f.ph!=='miss',cs=[[sd/2,-sd/2],[sd/2,sd/2],[-sd/2,sd/2],[-sd/2,-sd/2]].map(c=>P([c[0],c[1],z])),p=cs.reduce((a,b)=>b[0]>a[0]?b:a),ty=58+i*42;out+=`<path d="M${fmt(tx(p[0])+3)} ${fmt(tyy(p[1]))}L${fmt(Math.max(tx(p[0])+12,436))} ${ty}H446" fill="none" stroke="${C.line}" stroke-width="1"/>`+TF(450,ty+4,lv.name+' '+lv.time,13,found?C.green:C.ink,'start',found?'font-weight="700"':'')});
 const top=P([0,0,n*h+.05]);out+=T(tx(top[0]),tyy(top[1])-14,'fast, small',13,C.muted);
 return {svg:out,title:'The memory hierarchy as a pyramid',caption:'Each layer’s width is its size and its height above the ground is its speed: the top layer is tiny but fastest; the base is vast but slowest. The level holding the data is green.'};
};
