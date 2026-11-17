/* ===================== Era 1 · Lights and switches (1940s–1960s) ===================== */
const H1_PANEL='#2c3a42',H1_LABEL='#c9d4da';
const H1_val=b=>b.reduce((a,x)=>a*2+x,0);
const H1_pop=v=>{let c=0;while(v){c+=v&1;v>>>=1}return c};
function H1_lamp(x,y,on,r=10){return (on?Ci(x,y,r+6,'#ffcf4a','none','opacity=".28"'):'')+Ci(x,y,r,on?'#ffcf4a':'#4b5961',on?'#e0a800':'#3a464d')}
function H1_lever(X,act,arg,x,y,up,label){
 const inner=R(x-10,y,20,44,'#1d262c','#55646c',5)+L(x,y+22,x,up?y+5:y+39,'#e8edf0',5)+Ci(x,up?y+5:y+39,5,'#fff');
 return hit(X,act,arg,`${label}: ${up?'up (1)':'down (0)'}. Press to flip.`,inner);
}
function H1_button(X,act,label,x,y,w=84,h=26){return hit(X,act,'',label,R(x,y,w,h,'#46545c','#6a7b84',6)+T(x+w/2,y+18,label,13,'#f2f5f7','middle','font-weight="650"'))}
const H1_secs=ms=>ms===null||ms===undefined?'—':(ms/1000).toFixed(1)+' s';
const H1_mean=a=>a.length?sum(a)/a.length:null;

/* ---------- Lesson: front panel ---------- */
SCENE({id:'front-panel',name:'Front panel',tag:'Switches in, lamps out',
 definition:'The first interface was the machine’s own control panel: rows of toggle switches to enter binary values, and rows of lamps showing what was in memory and in the registers.',
 example:'To load a program, an operator set eight switches to one instruction’s bits, pressed Deposit, and repeated that for every instruction. The answer came back as a row of lit lamps.',
 research:'Burks, Goldstine & von Neumann (1946). Preliminary discussion of the logical design of an electronic computing instrument: the stored-program design that panels loaded by hand.',
 desc:'A dark control panel with rows of address, data and accumulator lamps above eight toggle switches and four buttons; a memory table beside it.',
 dur:12,hint:'Flip switches to make a number, press Deposit to store it at the lit address, then Run: the machine adds every memory cell and shows the total on the accumulator lamps.',
 init:()=>({mem:[5,12,7,0,0,0,0,0],addr:3,sw:[0,0,0,0,1,0,0,1]}),
 ui:[{b:'Load address',act:'load'},{b:'Deposit',act:'deposit'},{b:'Examine next',act:'examine'},{b:'Run (add memory)',act:'run'},{b:'Clear memory',act:'clear'}],
 on:{sw(s,i){s.sw[Number(i)]^=1},load(s){s.addr=H1_val(s.sw)&7},deposit(s){s.mem[s.addr]=H1_val(s.sw);s.addr=(s.addr+1)&7},examine(s){s.addr=(s.addr+1)&7},run(){return 'run'},clear(s){s.mem=s.mem.map(()=>0);s.addr=0}},
 trace(s){const fr=[{ph:'idle'}];let acc=0;for(let i=0;i<8;i++){acc=(acc+s.mem[i])&255;fr.push({ph:'run',i,acc})}fr.push({ph:'halt',i:7,acc});return fr},
 draw(s,f,X){
  const run=f.ph!=='idle',a=run?f.i:s.addr,data=s.mem[a],acc=run?f.acc:0,cx=i=>62+i*42;
  let out=heading('Switches in, lamps out')+R(16,44,404,322,H1_PANEL,'none',10);
  const row=(label,y,v,from=0)=>{let o=TF(30,y-18,label,13,H1_LABEL,'start','letter-spacing="1"');for(let i=from;i<8;i++)o+=H1_lamp(cx(i),y,(v>>(7-i))&1);return o+TB(398,y+5,String(v),15,'#fff')};
  out+=row('ADDRESS',96,a,5)+row('DATA',150,data)+row('ACCUMULATOR',204,acc);
  out+=TF(30,240,'SWITCHES',13,H1_LABEL,'start','letter-spacing="1"');
  for(let i=0;i<8;i++)out+=H1_lever(X,'sw',i,cx(i),248,s.sw[i],'Switch '+(i+1));
  out+=TB(398,276,String(H1_val(s.sw)),15,'#ffcf4a');
  out+=H1_button(X,'load','LOAD ADDR',24,312,90)+H1_button(X,'deposit','DEPOSIT',122,312,90)+H1_button(X,'examine','EXAMINE',220,312,90)+H1_button(X,'run','RUN',318,312,90);
  out+=TB(510,62,'Memory',15);
  s.mem.forEach((v,i)=>{const y=88+i*32,on=i===a;out+=R(432,y-18,156,26,on?'#fdf0c8':'#fff',on?C.amber:C.grid,5)+TMF(446,y,i,13,C.muted,'start')+TMF(468,y,bin(v,8),14,C.ink,'start')+TF(580,y,v,13,C.muted,'end')});
  out+=T(510,352,run?(f.ph==='halt'?'Halted':'Running'):'Stopped',14,run?C.coral:C.muted,'middle','font-weight="650"');
  const phase=f.ph==='idle'?`The address lamps show cell ${a}; the data lamps show what it holds (${data}). Every value went in through the switches, one bit at a time.`
   :f.ph==='run'?`Step ${f.i+1}: the machine adds cell ${f.i} (${s.mem[f.i]}). The accumulator lamps now read ${bin(f.acc,8)} = ${f.acc}.`
   :`Halted. The only output is a row of lamps: ${bin(acc,8)}, which the operator reads as ${acc}.`;
  return {svg:out,phase};
 }});

const H1_pat=seed=>{const r=rng(seed);r();return Math.floor(r()*4096)};
function H1_groupXs(g){const gap=g==='none'?0:16,n=Number(g)||12,xs=range(12).map(i=>i*34+Math.floor(i/n)*gap),w=xs[11];return xs.map(x=>x+300-w/2)}
SCENE({id:'front-panel-reading',name:'Reading lamps in groups',tag:'Chunking bits',
 definition:'Long rows of bits are hard to read and copy. Panels grouped switches and lamps in threes or fours so operators could read each group as one octal or hexadecimal digit.',
 example:'101100111010 is twelve separate things to remember. Read in threes it is 5 4 7 2: four octal digits.',
 research:'Miller (1956). The magical number seven, plus or minus two: recoding binary digits into octal groups let people hold far more bits.',
 desc:'Twelve lamps above twelve switches, spaced either evenly or in groups of three or four, with each group’s digit shown; below, the learner’s copying times and errors for each grouping.',
 dur:11,hint:'Copy the lamps onto the switches, then press Check. Try each grouping several times and compare your times and errors.',
 init:()=>({group:'3',target:0b101100111010,input:0,trials:[],t0:null,last:null}),
 watch(p){const g=p<.34?'none':p<.67?'3':'4',sub=(p*3)%1,shown=Math.floor(smooth(clamp(sub*1.3,0,1))*12),t=0b101100111010;return {group:g,target:t,input:t&((0xFFF<<(12-shown))&0xFFF),trials:[],t0:null,demo:true,last:null}},
 ui:[{choose:[['none','No grouping'],['3','Threes (octal)'],['4','Fours (hex)']],label:'Grouping',get:s=>s.group,act:'group'},{b:'Check my copy',act:'check'},{b:'New pattern',act:'next'}],
 on:{group(s,v){s.group=v},flip(s,i){if(s.t0===null)s.t0=performance.now();s.input^=1<<(11-Number(i))},
  next(s){s.target=H1_pat(nextSeed());s.input=0;s.t0=performance.now()},
  check(s){const err=H1_pop(s.target^s.input),ms=s.t0===null?null:performance.now()-s.t0;s.trials.push({g:s.group,ms,err});s.trials=s.trials.slice(-30);s.last={err,ms};s.target=H1_pat(nextSeed());s.input=0;s.t0=performance.now()}},
 draw(s,f,X){
  const xs=H1_groupXs(s.group),n=Number(s.group)||0;let out=heading('Copy twelve lamps onto twelve switches')+R(20,44,560,170,H1_PANEL,'none',10);
  out+=TF(36,66,'LAMPS',13,H1_LABEL,'start','letter-spacing="1"')+TF(36,152,'SWITCHES',13,H1_LABEL,'start','letter-spacing="1"');
  xs.forEach((x,i)=>{out+=H1_lamp(x,92,(s.target>>(11-i))&1,11)+H1_lever(X,'flip',i,x,158,(s.input>>(11-i))&1,'Switch '+(i+1))});
  if(n)for(let g=0;g<12/n;g++){const a=xs[g*n],b=xs[g*n+n-1],v=(s.target>>(12-(g+1)*n))&((1<<n)-1);out+=L(a-8,118,b+8,118,'#7d8d95',1.5)+TB((a+b)/2,140,v.toString(16).toUpperCase(),17,'#ffcf4a')}
  if(s.demo)out+=T(300,262,'Grouped lamps are read as digits: fewer, larger chunks to hold in mind.',15,C.ink)+T(300,290,'In Try it you copy patterns yourself and your times are compared.',14,C.muted);
  else{
   out+=TB(300,240,'Your copies',15);
   const rows=[['none','No grouping'],['3','Threes (octal)'],['4','Fours (hex)']];
   const means=rows.map(([g])=>H1_mean(s.trials.filter(t=>t.g===g&&t.ms!==null).map(t=>t.ms))),mx=Math.max(1,...means.filter(v=>v!==null));
   rows.forEach(([g,lab],j)=>{const y=266+j*32,tr=s.trials.filter(t=>t.g===g),m=means[j],err=sum(tr.map(t=>t.err));
    out+=TF(40,y+5,lab,13,g===s.group?C.ink:C.muted,'start',g===s.group?'font-weight="700"':'')+R(160,y-9,280,18,'#eef3f6','none',4)+(m!==null?R(160,y-9,280*m/mx,18,C.blue,'none',4):'')+TF(450,y+5,tr.length?`${H1_secs(m)} · ${err} wrong bits · ${tr.length} tries`:'no tries yet',13,C.ink,'start')});
  }
  const phase=s.demo?'The same twelve bits, shown plain, in threes and in fours. Grouping does not change the data, only how many chunks a reader must hold.':s.last?`Last copy: ${s.last.err} wrong bit${s.last.err===1?'':'s'} in ${H1_secs(s.last.ms)}. Most people copy grouped patterns faster and with fewer slips, because each group is one remembered digit.`:'Flip the switches until they match the lamps, then press Check. Timing starts with your first switch.';
  return {svg:out,phase};
 }});

function H1_bugProg(seed){const r=rng(seed);r();const vals=shuffled([1,2,3,4,5,6,7,8,9],seed).slice(0,3),bug=Math.floor(r()*3);
 const lines=[['LOAD',8],['ADD',9],['ADD',10],['STORE',11],['HALT',null]],wrong=lines.map(l=>l.slice());wrong[bug][1]=bug===0?9:wrong[bug][1]===9?10:8;
 return {vals,bug,lines,wrong}}
SCENE({id:'front-panel-bug',name:'Single-stepping a bug',tag:'Debugging by lamplight',
 definition:'Before screens and debuggers, programmers found mistakes by stepping the machine one instruction at a time and comparing the lamps with what they expected.',
 example:'On 9 September 1947 the Harvard Mark II team taped a moth into their logbook: “First actual case of bug being found.” The word was older, but the page made it famous.',
 research:'Harvard Mark II logbook (9 September 1947), kept by Grace Hopper’s team: the moth found in relay 70, panel F.',
 desc:'A five-line program listing with expected and actual accumulator values, a panel of program-counter and accumulator lamps, and a logbook card about the 1947 moth.',
 dur:11,hint:'Step through the program. When the lamps stop matching the expected value, press that line to name the bug. New program hides the mistake somewhere else.',
 init:()=>({seed:3,guess:null}),
 ui:[{b:'New program',act:'fresh'}],
 on:{guess(s,i){s.guess=Number(i);return 'keep'},fresh(s){s.seed=nextSeed();s.guess=null}},
 trace(s){const P=H1_bugProg(s.seed),mem={8:P.vals[0],9:P.vals[1],10:P.vals[2]};let acc=0,exp=0;const fr=[{pc:-1,acc,exp}];
  P.wrong.forEach((l,i)=>{const good=P.lines[i];if(l[0]==='LOAD'){acc=mem[l[1]];exp=mem[good[1]]}else if(l[0]==='ADD'){acc+=mem[l[1]];exp+=mem[good[1]]}fr.push({pc:i,acc,exp})});return fr},
 draw(s,f,X){
  const P=H1_bugProg(s.seed);let out=heading('Step, compare, find the bug');
  [['line',40],['instruction',112],['expected',212],['lamps',282]].forEach(([h,x])=>out+=TBF(x,66,h,13,C.muted));
  const fr=this.trace(s);
  P.wrong.forEach((l,i)=>{const y=92+i*34,done=i<=f.pc,row=fr[i+1],bad=done&&row.acc!==row.exp,cur=i===f.pc,first=bad&&!fr.slice(1,i+1).some(r=>r.acc!==r.exp);
   const inner=R(20,y-18,290,28,cur?C.amberp:'#fff',first?C.coral:bad?'#e3a08f':cur?C.amber:C.grid,6,bad&&!first?'stroke-dasharray="5 4"':'')+TMF(40,y,i,14,C.muted)+TMF(112,y,l[0]+(l[1]!==null?' '+l[1]:''),15,C.ink)+TF(212,y,done&&l[0]!=='STORE'&&l[0]!=='HALT'?String(row.exp):'',14,C.green)+TF(282,y,done&&l[0]!=='STORE'&&l[0]!=='HALT'?String(row.acc):'',14,bad?C.coral:C.ink,'middle','font-weight="700"');
   out+=hit(X,'guess',i,`Line ${i}: ${l[0]} ${l[1]??''}. Press if this is the bug.`,inner)});
  out+=TF(165,276,`Cells 8, 9, 10 hold the prices ${P.vals.join(', ')};`,13,C.muted)+TF(165,296,`the total should be ${sum(P.vals)}.`,13,C.muted);
  out+=R(332,44,256,150,H1_PANEL,'none',10)+TF(346,66,'PROGRAM COUNTER',13,H1_LABEL,'start');
  for(let i=0;i<3;i++)out+=H1_lamp(360+i*26,88,(Math.max(0,f.pc)>>(2-i))&1,8);
  out+=TF(346,126,'ACCUMULATOR',13,H1_LABEL,'start');for(let i=0;i<8;i++)out+=H1_lamp(360+i*26,150,(f.acc>>(7-i))&1,8);
  out+=TB(460,184,`= ${f.acc}`,15,'#fff');
  out+=R(332,206,256,118,'#f6f1e3','#d9cfb3',4)+TF(346,228,'9 Sept 1947 · Harvard Mark II',13,C.ink,'start','font-weight="650"')+TF(346,252,'Relay 70, panel F (moth) in relay.',13,C.ink,'start')+TF(346,276,'“First actual case of bug',13,C.ink,'start','font-style="italic"')+TF(346,298,'being found.”',13,C.ink,'start','font-style="italic"')+Ci(560,280,9,'#8a7a5a')+L(548,272,572,288,'#8a7a5a',2)+L(548,288,572,272,'#8a7a5a',2);
  let verdict='';if(s.guess!==null)verdict=s.guess===P.bug?`Found it: line ${P.bug} reads the wrong cell.`:s.guess>P.bug?`Line ${s.guess} is wrong only because the error started earlier.`:`Not line ${s.guess}: its lamps matched what was expected.`;
  if(verdict)out+=T(300,354,verdict,15,s.guess===P.bug?C.green:C.coral,'middle','font-weight="650"');
  const phase=f.pc<0?'Single-step: run one instruction, read the lamps, compare with what you expected. The first mismatch points at the bug.':`Line ${f.pc}: ${P.wrong[f.pc][0]}${P.wrong[f.pc][1]!==null?' '+P.wrong[f.pc][1]:''}. Lamps show ${f.acc}${f.acc!==f.exp?`, but ${f.exp} was expected`:' as expected'}.`;
  return {svg:out,phase};
 }});

/* ---------- Lesson: punched cards ---------- */
const H1_ROWS=['12','11','0','1','2','3','4','5','6','7','8','9'];
function H1_holes(ch){const c=ch.charCodeAt(0);
 if(ch===' ')return [];if(c>=48&&c<=57)return [ch];
 if(c>=65&&c<=73)return ['12',String(c-64)];if(c>=74&&c<=82)return ['11',String(c-73)];if(c>=83&&c<=90)return ['0',String(c-81)];
 if(ch==='-')return ['11'];if(ch==='&')return ['12'];if(ch==='/')return ['0','1'];return null}
SCENE({id:'punched-cards',name:'Punched card',tag:'Data you can hold',
 definition:'A stiff card whose holes encode data: each column holds one character, given by which of its twelve rows are punched.',
 example:'Herman Hollerith’s cards tabulated the 1890 US census. In the later 80-column code, a digit is one hole; a letter is a digit hole plus a “zone” hole in row 12, 11 or 0.',
 research:'Hollerith (1889). US patent 395,782, Art of Compiling Statistics: cards read by electrical contacts for the 1890 census.',
 desc:'A cream punched card with sixteen columns and twelve rows; each column’s holes encode the character printed at its top.',
 dur:10,hint:'Type letters, digits and spaces. Press any column to decode its holes.',
 init:()=>({text:'HOLLERITH 1890',sel:null}),
 watch(p){const t='HOLLERITH 1890';return {text:t.slice(0,Math.max(1,Math.ceil(p*t.length))),sel:null}},
 ui:[{text:'Text',label:'Punch',get:s=>s.text,act:'text',max:16}],
 on:{text(s,v){s.text=v.toUpperCase().slice(0,16);s.sel=null},col(s,i){s.sel=Number(i)}},
 draw(s,f,X){
  const chars=Array.from(s.text.padEnd(16,' ')).slice(0,16);let out=heading('One column, one character');
  out+=P('M66 50H570V334H50V66Z','#c7b98f',1.5,'#f3ead2');
  H1_ROWS.forEach((r,j)=>out+=TF(66,100+j*20,r,13,'#8b7d58','middle'));
  chars.forEach((ch,c)=>{const x=96+c*30,hs=H1_holes(ch),sel=s.sel===c;
   let inner=R(x-13,56,26,274,sel?'#e5d7ad':'transparent','none',3)+TMF(x,74,ch===' '?'':ch,14,hs?C.ink:C.coral,'middle','font-weight="700"');
   H1_ROWS.forEach((r,j)=>{const y=100+j*20;inner+=hs&&hs.includes(r)?R(x-5,y-12,10,15,'#2b2b2b','none',1):Ci(x,y-4,1.6,'#cbbd94')});
   out+=hit(X,'col',c,`Column ${c+1}: ${ch===' '?'blank':ch}`,inner)});
  out+=L(56,82,570,82,'#c7b98f',1);
  let msg='Rows 12, 11 and 0 are the “zones”; rows 1–9 pick the digit within a zone.';
  if(s.sel!==null){const ch=chars[s.sel],hs=H1_holes(ch);msg=ch===' '?`Column ${s.sel+1}: no holes, a space.`:hs?`Column ${s.sel+1}: holes ${hs.join(' + ')} → “${ch}”`:`Column ${s.sel+1}: “${ch}” has no code here.`}
  out+=T(300,360,msg,15,C.ink);
  return {svg:out,phase:'A–I use zone 12, J–R zone 11, S–Z zone 0, plus one digit hole. Machines read the holes with brushes or pins that closed an electrical circuit.'};
 }});

SCENE({id:'punched-cards-batch',name:'Batch turnaround',tag:'Waiting for the result',
 definition:'In batch processing you handed in a deck of cards and collected the printout hours later. Each run revealed a mistake or two, so the length of that wait set the pace of all work.',
 example:'With a three-hour turnaround, a program with four bugs took most of two working days. At a terminal, the same fixes took under an hour.',
 research:'Sackman, Erikson & Grant (1968). Exploratory experimental studies comparing online and offline programming performance (CACM): online debugging took less time, but differences between programmers were far larger.',
 desc:'Two timelines across a working day: batch runs, each a long grey wait followed by a short fix, and terminal runs with one-minute waits.',
 dur:11,hint:'Change the turnaround and the number of bugs. Each run finds one bug; the last run is clean.',
 init:()=>({turn:180,bugs:4}),
 ui:[{range:'turn',label:'Turnaround (min)',min:5,max:480,step:5,get:s=>s.turn,act:'turn'},{range:'bugs',label:'Bugs',min:1,max:8,get:s=>s.bugs,act:'bugs'}],
 on:{turn(s,v){s.turn=v},bugs(s,v){s.bugs=v}},
 trace(s){return range(s.bugs+2).map(i=>({i}))},
 draw(s,f,X){
  const runs=s.bugs+1,fix=10,batch=runs*(s.turn+fix),term=runs*(1+fix),span=Math.max(480,batch),x0=130,W=440,sx=m=>x0+W*m/span;
  let out=heading('Each run finds one mistake');
  for(let d=480;d<span;d+=480){const x=sx(d);out+=L(x,70,x,236,C.line,1.5,'stroke-dasharray="4 4"')+TF(x,258,`end of day ${d/480}`,13,C.muted)}
  const lane=(y,label,wait)=>{let o=TF(20,y+24,label,13,C.ink,'start','font-weight="650"');for(let r=0;r<Math.min(runs,f.i);r++){const t=r*(wait+fix);o+=R(sx(t),y,Math.max(1.5,sx(t+wait)-sx(t)),34,'#d6dee3','none',3)+R(sx(t+wait),y,Math.max(4,sx(t+wait+fix)-sx(t+wait)),34,r===runs-1?C.green:C.blue,'none',3)}return o};
  out+=lane(90,'Batch',s.turn)+lane(170,'Terminal',1);
  out+=TF(20,140,`wait ${s.turn} min`,13,C.muted,'start')+TF(20,220,'wait 1 min',13,C.muted,'start');
  const hm=m=>`${Math.floor(m/60)} h ${m%60} min`;
  out+=counter(60,284,'runs needed',runs,C.ink,140)+counter(220,284,'batch: working time',hm(batch),C.coral,170)+counter(410,284,'terminal',hm(term),C.green,140);
  return {svg:out,phase:f.i===0?'Grey is waiting for the machine; blue is fixing. With batch processing the waiting dominates.':f.i<=runs?`Run ${Math.min(f.i,runs)} of ${runs}${f.i===runs?': clean at last':': one more bug found and fixed'}. Batch so far: ${hm(Math.min(f.i,runs)*(s.turn+fix))}.`:`Done. Batch: ${hm(batch)}${batch>480?`, about ${(batch/480).toFixed(1)} working days`:''}. Terminal: ${hm(term)}. Shorter feedback loops let people try more ideas.`};
 }});

const H1_CARDS=[['PAY 0042 SMITH J','PAY 0024 SMITH J'],['INV 1187 JONES A','INV 1187 JONSE A'],['QTY 0350 BOLT M6','QTY 0530 BOLT M6']];
SCENE({id:'punched-cards-verify',name:'Key verification',tag:'Typing everything twice',
 definition:'To catch typing slips, a second operator re-keyed each card on a verifier. Any column where the two keyings disagreed was flagged and checked against the original form.',
 example:'If each operator mistypes 1 key in 100, a single keying leaves about 100 errors in 10,000 characters; double keying leaves only those where both slip the same way.',
 research:'Barchard & Pace (2011). Preventing human error: the impact of data entry methods on data accuracy (Computers in Human Behavior): double entry was far more accurate than visual checking.',
 desc:'A source form, the first operator’s punched line, and the learner’s re-keyed line with disagreeing columns flagged; below, a model of errors left after single and double keying.',
 dur:10,hint:'Re-key the card from the form above. Columns where you and the first operator disagree are flagged. Then change the error rate.',
 init:()=>({card:0,mine:'',p:1}),
 watch(p){const t=H1_CARDS[0][0];return {card:0,mine:t.slice(0,Math.floor(smooth(p)*t.length)),p:1}},
 ui:[{text:'Re-key',label:'Re-key the card',get:s=>s.mine,act:'mine',max:20},{range:'p',label:'Error rate %',min:.1,max:5,step:.1,get:s=>s.p,act:'p'},{b:'Next card',act:'next'}],
 on:{mine(s,v){s.mine=v.toUpperCase()},p(s,v){s.p=v},next(s){s.card=(s.card+1)%H1_CARDS.length;s.mine=''}},
 draw(s){
  const [orig,first]=H1_CARDS[s.card],mine=s.mine.slice(0,orig.length),cw=30,x0=300-orig.length*cw/2;let out=heading('Two keyings, compared column by column');
  out+=R(150,46,300,34,'#fff',C.grid,6)+TF(164,68,'Form:',13,C.muted,'start')+TMF(300,69,orig,17,C.ink,'middle','font-weight="700"');
  let flags=0;
  Array.from(orig).forEach((_,i)=>{const x=x0+i*cw,a=first[i],b=mine[i],typed=b!==undefined,bad=typed&&a!==b;if(bad)flags++;
   out+=R(x+2,104,cw-4,36,'#f3ead2','#c7b98f',3)+TMF(x+cw/2,128,a===' '?'':a,16,C.ink);
   out+=R(x+2,150,cw-4,36,typed?(bad?C.coralp:'#fff'):'#f6f8f9',bad?C.coral:C.grid,3)+TMF(x+cw/2,174,typed&&b!==' '?b:'',16,bad?C.coral:C.ink);
   if(bad)out+=`<polygon points="${x+cw/2-6},${100} ${x+cw/2+6},${100} ${x+cw/2},${92}" fill="${C.coral}"/>`});
  out+=TF(x0-8,127,'card',13,C.muted,'end')+TF(x0-8,173,'you',13,C.muted,'end');
  out+=T(300,214,mine.length<orig.length?`Keyed ${mine.length} of ${orig.length} columns · ${flags} flagged`:flags?`${flags} column${flags>1?'s':''} flagged: check the form to see who slipped.`:'No disagreements: the card is verified.',15,flags?C.coral:C.ink);
  const p=s.p/100,single=10000*p,dbl=10000*p*p/30;
  out+=TB(300,250,'Errors left in 10,000 characters (simple model)',14);
  const bar=(y,lab,v,col)=>{const w=Math.max(2,380*Math.min(1,Math.log10(1+v)/Math.log10(1+500)));return TF(110,y+13,lab,13,C.ink,'end')+R(120,y,w,20,col,'none',4)+TF(128+w,y+15,v<1?v.toFixed(2):Math.round(v),13,C.ink,'start')};
  out+=bar(266,'one keying',single,C.coral)+bar(300,'verified',dbl,C.green)+TF(300,346,'Double keying misses an error only when both operators make the same slip in the same column.',13,C.muted);
  return {svg:out,phase:'Verification does not know which keying is right; it only shows where they disagree, so a person checks the source. That is why it catches almost every slip.'};
 }});

/* ---------- Lesson: command line ---------- */
function H1_tty(c){const [cmd,...rest]=c.split(/\s+/),arg=rest.join(' ');
 if(cmd==='help')return ['commands: ls cat echo who date help'];if(cmd==='ls')return ['notes   prog.f   data'];
 if(cmd==='cat')return arg==='notes'?['tape drive 2 is slow today']:arg==='data'?['3 5 4']:arg==='prog.f'?['      PRINT *, 3+5+4','      END']:['cat: '+(arg||'?')+': no such file'];
 if(cmd==='who')return ['ada    tty1','grace  tty2','you    tty3'];if(cmd==='date')return ['MON JAN 15 10:42 1973'];if(cmd==='echo')return [arg];return ['?']}
const H1_TTY_DEMO=['$ who','ada    tty1','grace  tty2','you    tty3','$ ls','notes   prog.f   data','$ cat notes','tape drive 2 is slow today','$ lst','?'];
SCENE({id:'command-line',name:'Command line',tag:'A conversation in text',
 definition:'A command-line interface is a typed conversation: you type a command, the computer types a reply. On a teletype both sides were printed on a roll of paper.',
 example:'A teletype printed about 10 characters a second, so a full 72-character line took over 7 seconds. Commands were short because typing and printing were slow.',
 research:'Ritchie & Thompson (1974). The UNIX time-sharing system (CACM): terse commands such as ls and cat, designed for slow terminals.',
 desc:'A roll of teletype paper with sprocket holes, printing a session of typed commands and replies, with a print head at the end of the last line.',
 dur:12,hint:'Type a command and press Send. Known commands: help, ls, cat notes, who, date, echo. Anything else gets “?”.',
 init:()=>({lines:['LOGIN: you','$ ls','notes   prog.f   data'],cmd:'cat notes'}),
 watch(p){const all=H1_TTY_DEMO.join('\n'),n=Math.floor(smooth(p)*all.length);return {lines:all.slice(0,n).split('\n'),cmd:'',demo:true}},
 ui:[{text:'Command',label:'Command',get:s=>s.cmd,act:'type',max:30},{b:'Send ⏎',act:'send'}],
 on:{type(s,v){s.cmd=v},send(s){const c=s.cmd.trim();if(!c)return;s.lines.push('$ '+c,...H1_tty(c));s.lines=s.lines.slice(-14);s.cmd=''}},
 draw(s){
  let out=P('M70 30H530V350H70Z','#d9cfb3',1.5,'#f6f1e3');
  for(let y=44;y<350;y+=24)out+=Ci(84,y,4,'#e2d8bd')+Ci(516,y,4,'#e2d8bd');
  const lines=s.lines.slice(-12);
  lines.forEach((l,i)=>{const y=330-(lines.length-1-i)*25;out+=TMF(104,y,l,16,l.startsWith('$')?C.ink:'#3d5a6b','start',l.startsWith('$')?'font-weight="700" xml:space="preserve"':'xml:space="preserve"')});
  const last=lines[lines.length-1]||'',hx=104+Math.min(400,last.length*9.6);out+=R(hx+2,316,10,18,C.ink,'none',1,'opacity=".75"');
  return {svg:out,phase:s.demo?'Every character took a tenth of a second to print. Mistyping “ls” as “lst” earned the famous one-character reply: “?”.':'The computer only understands commands you already know. There is nothing on the paper to choose from.'};
 }});

const H1_TASKS=[{t:'List the files here',a:'ls',o:['ls','dir','list','show']},{t:'Copy a file',a:'cp',o:['copy','cp','dup','cpy']},{t:'Delete a file',a:'rm',o:['del','erase','rm','rmv']},{t:'Show the current folder',a:'pwd',o:['pwd','where','cwd','here']},{t:'Search for text in files',a:'grep',o:['find','grep','search','seek']},{t:'Change folder',a:'cd',o:['chdir','go','cd','into']}];
function H1_answer(s,ans){const t=H1_TASKS[s.i],ok=ans===t.a,ms=s.t0===null?null:performance.now()-s.t0;s.results.push({m:s.mode,ok,ms});s.results=s.results.slice(-40);s.last={ok,ans,want:t.a};s.i=(s.i+1)%H1_TASKS.length;s.typed='';s.t0=performance.now()}
SCENE({id:'command-line-recall',name:'Recall versus recognition',tag:'Remember it or pick it',
 definition:'Recall means producing something from memory; recognition means picking it out when you see it. Recognition is much easier, which is why menus beat memorised commands for occasional users.',
 example:'You may not recall that “grep” searches text, but shown grep, find, search and seek, many people can pick it.',
 research:['Shepard (1967). Recognition memory for words, sentences and pictures: people recognised hundreds of studied pictures almost perfectly.','Nielsen (1994): “recognition rather than recall” became a usability heuristic.'],
 desc:'A terminal asking for a command typed from memory beside four labelled choices; below, the learner’s accuracy and time for each mode.',
 dur:10,hint:'Choose a mode. Recall: type the command and press Submit. Recognition: press the right choice. Compare your speed and accuracy.',
 init:()=>({mode:'recall',i:0,typed:'',t0:null,results:[],last:null}),
 watch(p){const k=Math.floor(p*4)%2;return {mode:k?'recognition':'recall',i:4,typed:'grep'.slice(0,Math.floor((p*4%1)*5)),t0:null,results:[],last:null,demo:true}},
 ui:[{choose:[['recall','Recall: type it'],['recognition','Recognition: pick it']],label:'Mode',get:s=>s.mode,act:'mode'},{text:'Command',label:'Type',get:s=>s.typed,act:'type',max:10},{b:'Submit',act:'submit'}],
 on:{mode(s,v){s.mode=v;s.t0=performance.now()},type(s,v){if(s.t0===null)s.t0=performance.now();s.typed=v},submit(s){if(s.mode!=='recall')return 'keep';H1_answer(s,s.typed.trim())},pick(s,v){if(s.mode!=='recognition')return 'keep';H1_answer(s,v)}},
 draw(s,f,X){
  const t=H1_TASKS[s.i],rec=s.mode==='recognition';let out=heading('Type it from memory, or pick it from a list?');
  out+=R(20,52,270,150,'#1f2a30',!rec?C.amber:'none',10)+TF(36,78,'RECALL',13,H1_LABEL,'start','letter-spacing="1"')+TF(36,108,t.t,14,'#e8edf0','start');
  out+=TMF(36,152,'$ '+(rec?'':s.typed)+(rec?'':'▌'),18,'#9fe2a4','start','xml:space="preserve"');
  out+=R(310,52,270,150,'#fff',rec?C.amber:C.grid,10)+TF(326,78,'RECOGNITION',13,C.muted,'start','letter-spacing="1"');
  shuffled(t.o,s.i+7).forEach((o,j)=>{const x=326+(j%2)*124,y=96+Math.floor(j/2)*48;out+=hit(X,'pick',o,`Choose ${o}`,R(x,y,112,38,rec?C.pale:'#f3f5f6',rec?C.blue:C.grid,8)+TM(x+56,y+25,o,16,rec?C.ink:C.muted))});
  if(s.demo)out+=T(300,250,'Recall asks you to produce the word; recognition only asks you to spot it.',15,C.ink)+T(300,278,'In Try it the page times you on both and compares.',14,C.muted);
  else{out+=TB(300,232,'Your answers',15);
   [['recall','Recall'],['recognition','Recognition']].forEach(([m,lab],j)=>{const r=s.results.filter(x=>x.m===m),ok=r.filter(x=>x.ok).length,ms=H1_mean(r.filter(x=>x.ms!==null).map(x=>x.ms)),y=260+j*34;
    out+=TF(40,y+5,lab,14,C.ink,'start','font-weight="650"')+TF(170,y+5,r.length?`${ok} of ${r.length} right`:'no answers yet',14,C.ink,'start')+TF(330,y+5,r.length?'average '+H1_secs(ms):'',14,C.muted,'start')});
   if(s.last)out+=T(300,350,s.last.ok?`Right: ${s.last.want}.`:`“${s.last.ans||'(blank)'}” is not it; the command was ${s.last.want}.`,15,s.last.ok?C.green:C.coral,'middle','font-weight="650"')}
  return {svg:out,phase:s.demo?'Same task, two kinds of memory. Graphical menus later turned most commands into recognition.':rec?'Recognition: the answer is on the screen; you only need to spot it.':'Recall: nothing on the screen helps; you must bring the word back from memory.'};
 }});

const H1_CMDS=[['ls','list files'],['cat','show a file'],['cp','copy'],['mv','move'],['rm','delete'],['cd','change folder'],['pwd','current folder'],['grep','search text'],['echo','print text'],['who','who is logged in']];
function H1_lev(a,b){const d=range(b.length+1);for(let i=1;i<=a.length;i++){let prev=d[0];d[0]=i;for(let j=1;j<=b.length;j++){const tmp=d[j];d[j]=Math.min(d[j]+1,d[j-1]+1,prev+(a[i-1]===b[j-1]?0:1));prev=tmp}}return d[b.length]}
function H1_msg(cmd,style){const c=cmd.trim().split(/\s+/)[0]||'',known=H1_CMDS.find(k=>k[0]===c);
 if(known)return {ok:true,text:`${c}: runs normally (${known[1]})`};
 if(style==='terse')return {text:'?'};if(style==='code')return {text:'ERROR 127'};
 const best=H1_CMDS.map(k=>[k,H1_lev(c,k[0])]).sort((a,b)=>a[1]-b[1])[0];
 return {text:best[1]<=2?`${c}: no such command. Did you mean “${best[0][0]}” (${best[0][1]})?`:`${c}: no such command. Type “help” to list commands.`}}
SCENE({id:'command-line-errors',name:'Error messages',tag:'When the computer says “?”',
 definition:'An error message is the interface’s only help when something goes wrong. Specific, constructive messages that suggest a fix let people recover far faster than codes or a bare “?”.',
 example:'The early Unix editor ed answered almost every mistake with a single “?”. A helpful message names the problem and suggests the likely fix.',
 research:'Shneiderman (1982). System message design: guidelines and experimental results — rewritten, specific messages improved users’ success in correcting errors.',
 desc:'Three terminal panels show the same mistyped command answered tersely with a question mark, with an error code, and with a specific suggestion.',
 dur:10,hint:'Type a mistyped command (try “lst”, “grpe”, “cta”) and compare the three replies. Choose which style the picture highlights.',
 init:()=>({cmd:'lst',style:'helpful'}),
 watch(p){const cs=['lst','grpe','cta','sl'],k=Math.min(3,Math.floor(p*4));return {cmd:cs[k],style:['terse','code','helpful'][Math.floor(p*12)%3]}},
 ui:[{text:'Command',label:'Mistyped command',get:s=>s.cmd,act:'cmd',max:16},{choose:[['terse','Terse'],['code','Code'],['helpful','Helpful']],label:'Highlight',get:s=>s.style,act:'style'}],
 on:{cmd(s,v){s.cmd=v},style(s,v){s.style=v}},
 draw(s){
  let out=heading('Same mistake, three replies');
  [['terse','Terse (as in ed, 1971)'],['code','Error code'],['helpful','Specific and constructive']].forEach(([st,lab],j)=>{const y=50+j*104,on=s.style===st,m=H1_msg(s.cmd,st);
   out+=R(40,y,520,90,'#1f2a30',on?C.amber:'none',10)+TF(56,y+24,lab,13,on?'#ffcf4a':H1_LABEL,'start','font-weight="650"')+TMF(56,y+50,'$ '+s.cmd,16,'#e8edf0','start','xml:space="preserve"')+TMF(56,y+76,m.text.length>52?m.text.slice(0,51)+'…':m.text,m.text.length>40?13:16,m.ok?'#9fe2a4':'#ffb4a0','start','xml:space="preserve"')});
  const h=H1_msg(s.cmd,'helpful');
  return {svg:out,phase:h.ok?'That command exists, so all three styles simply run it.':'Only the third reply says what went wrong and how to fix it. Good messages are specific, polite, and suggest the next step.'};
 }});

/* ---------- Lesson: time-sharing ---------- */
SCENE({id:'time-sharing',name:'Time-sharing',tag:'One computer, many people',
 definition:'Time-sharing gives each user a short slice of the processor in turn, so quickly that everyone feels they have the machine to themselves.',
 example:'With 6 users and 50 ms slices, the longest wait for your turn is 6 × 50 = 300 ms. Typing at a terminal felt like a conversation instead of a queue.',
 research:['Licklider (1960). Man–Computer Symbiosis: people and computers thinking together in real time.','Corbató, Merwin-Daggett & Daley (1962). An experimental time-sharing system (CTSS).'],
 desc:'Terminals arranged in a ring around a central processor; a pointer moves from terminal to terminal, giving each a slice of time; counters show the wait for a turn.',
 dur:11,hint:'Change the number of users and the slice length. Keep the wait for a turn under a tenth of a second and the machine feels like yours.',
 init:()=>({n:6,q:50}),
 watch(p){return {n:2+Math.min(10,Math.floor(p*11)),q:50}},
 ui:[{range:'n',label:'Users',min:1,max:12,get:s=>s.n,act:'n'},{range:'q',label:'Slice (ms)',min:10,max:200,step:10,get:s=>s.q,act:'q'}],
 on:{n(s,v){s.n=v},q(s,v){s.q=v}},
 draw(s,f,X){
  const cx=180,cy=208,r=128,cur=X.try?0:Math.floor(X.p*48)%s.n,wait=s.n*s.q;let out=heading('Each user gets a slice in turn');
  for(let i=0;i<s.n;i++){const a=-Math.PI/2+i*2*Math.PI/s.n,x=cx+r*Math.cos(a),y=cy+r*Math.sin(a),on=i===cur;
   out+=L(cx,cy,x,y,on?C.amber:C.grid,on?3:1.5)+R(x-22,y-16,44,32,on?C.amberp:'#fff',on?C.amber:C.line,6)+TF(x,y+5,'user '+(i+1),13,C.ink)}
  out+=Ci(cx,cy,30,C.dark)+TB(cx,cy+6,'CPU',15,'#fff');
  const zone=wait<=100?['feels instant',C.green]:wait<=1000?['a noticeable pause',C.amber]:['slow: attention drifts',C.coral];
  out+=counter(360,70,'users',s.n,C.ink,100)+counter(470,70,'slice',s.q+' ms',C.ink,110)+counter(360,130,'longest wait for your turn',wait>=1000?(wait/1000).toFixed(1)+' s':wait+' ms',zone[1],220);
  out+=T(470,212,zone[0],16,zone[1],'middle','font-weight="650"');
  out+=TF(470,252,'Each slice is short, but with more',13,C.muted)+TF(470,272,'users the wait for a turn grows.',13,C.muted);
  return {svg:out,phase:`The processor serves user ${cur+1}, then moves on. With ${s.n} users and ${s.q} ms slices, nobody waits more than about ${wait} ms for a turn.`};
 }});

const H1_logX=sec=>60+480*(Math.log10(clamp(sec,.01,20))+2)/(Math.log10(20)+2);
SCENE({id:'time-sharing-response',name:'Response time limits',tag:'0.1 s, 1 s, 10 s',
 definition:'How long a reply takes changes how it feels. About 0.1 s feels instant; about 1 s keeps your train of thought; beyond about 10 s attention wanders to something else.',
 example:'A button that answers in 0.08 s feels like you did it yourself. One that takes 8 s needs a progress indicator, or people press it again.',
 research:['Miller, R. B. (1968). Response time in man–computer conversational transactions.','Card, Robertson & Mackinlay (1991): the 0.1 s, 1 s and 10 s levels used in interface design.'],
 desc:'A large button, a logarithmic time line from a hundredth of a second to twenty seconds with bands for instant, noticed and too slow, and dots for each measured wait.',
 dur:11,hint:'Set the delay, then press the button in the picture and wait for the answer. Try 0.05 s, 0.8 s and 5 s and notice how each feels.',
 init:()=>({delay:800,pending:false,pressedAt:null,history:[]}),
 watch(p){const ds=[80,800,8000],k=Math.min(2,Math.floor(p*3)),u=clamp((p*3-k)*1.3,0,1);return {delay:ds[k],pending:u<1,demoT:ds[k]/1000*u,history:ds.slice(0,k).map(d=>({delay:d,ms:d}))}},
 ui:[{range:'delay',label:'Delay (ms)',min:0,max:12000,step:50,get:s=>s.delay,act:'delay'},{b:'Press',act:'press'}],
 on:{delay(s,v){s.delay=v},
  press(s,a,ctx){if(s.pending&&performance.now()-s.pressedAt<s.delay+800)return 'keep';s.pending=true;s.pressedAt=performance.now();
   ctx.later(s.delay,'arrive');return 'keep'},
  arrive(s){if(!s.pending)return 'keep';s.pending=false;s.history.push({delay:s.delay,ms:Math.round(performance.now()-s.pressedAt)});s.history=s.history.slice(-8);return 'keep'}},
 draw(s,f,X){
  let out=heading('How long can an answer take?');
  out+=hit(X,'press','','Press: send the request',R(40,56,200,60,s.pending?'#d6dee3':C.blue,'none',12)+TB(140,93,s.pending?'Waiting…':'Run query',18,s.pending?C.muted:'#fff'));
  const last=s.history[s.history.length-1];
  out+=T(420,80,s.pending?(s.demoT!==undefined?`${s.demoT.toFixed(2)} s and counting`:'Waiting for the answer…'):last?`Answer arrived after ${(last.ms/1000).toFixed(2)} s`:'Press the button',16,s.pending?C.amber:C.ink,'middle','font-weight="650"');
  out+=T(420,104,`Delay set to ${(s.delay/1000).toFixed(2)} s`,14,C.muted);
  const bands=[[.01,.1,C.greenp,'feels instant'],[.1,1,'#eef6e3','noticed, flow kept'],[1,10,C.amberp,'attention holds'],[10,20,C.coralp,'attention lost']];
  bands.forEach(([a,b,col,lab])=>{const x1=H1_logX(a),x2=H1_logX(b);out+=R(x1,170,x2-x1,60,col,'none',0)+TF((x1+x2)/2,160,lab,13,C.ink)});
  [.01,.1,1,10].forEach(v=>{const x=H1_logX(v);out+=L(x,170,x,238,C.line,1.5)+TF(x,256,v<1?v+' s':v+' s',13,C.muted)});
  out+=TF(H1_logX(20),256,'20 s',13,C.muted);
  const dx=H1_logX(Math.max(.01,s.delay/1000));out+=`<polygon points="${fmt(dx)},236 ${fmt(dx-8)},250 ${fmt(dx+8)},250" fill="${C.blue}"/>`;
  if(s.demoT!==undefined&&s.pending)out+=Ci(H1_logX(Math.max(.01,s.demoT)),200,9,C.blue);
  s.history.forEach((h,i)=>out+=Ci(H1_logX(Math.max(.01,h.ms/1000)),200,7,C.dark,'#fff'));
  out+=TF(300,296,'Dots: your measured waits (log scale: each step is ten times longer)',13,C.muted);
  out+=TF(300,330,'Above 1 s show progress; above 10 s let people do something else.',14,C.ink);
  return {svg:out,phase:'Below 0.1 s cause and effect feel linked; up to 1 s you notice the delay but keep thinking; after about 10 s people switch tasks. These limits come from human attention, not from computers.'};
 }});

function H1_mva(N,S,Z){const out=[];let Q=0;for(let k=1;k<=N;k++){const Rr=S*(1+Q),Xt=k/(Rr+Z);Q=Xt*Rr;out.push({R:Rr,X:Xt})}return out}
SCENE({id:'time-sharing-queue',name:'More users, slower replies',tag:'The knee of the curve',
 definition:'A shared computer stays responsive until it is nearly fully busy; then each extra user adds a full share of waiting. Response time rises in a sharp “knee”.',
 example:'If each request needs 0.5 s of processor time and people think for 20 s between requests, about 41 users can share the machine before replies slow sharply.',
 research:['Scherr (1965). An analysis of time-shared computer systems: measurements of MIT’s CTSS matched a simple queueing model.','Reiser & Lavenberg (1980). Mean-value analysis of closed multichain queuing networks (Journal of the ACM 27(2)).'],
 desc:'A graph of response time against number of users: flat at first, then rising along a straight asymptote after a marked knee; a dot marks the chosen number of users.',
 dur:11,hint:'Change users, thinking time and processor time per request. Watch where the knee falls.',
 init:()=>({n:20,z:20,sv:.5}),
 watch(p){return {n:1+Math.floor(smooth(p)*59),z:20,sv:.5}},
 ui:[{range:'n',label:'Users',min:1,max:60,get:s=>s.n,act:'n'},{range:'z',label:'Thinking time (s)',min:2,max:60,get:s=>s.z,act:'z'},{range:'sv',label:'Processor time (s)',min:.1,max:2,step:.1,get:s=>s.sv,act:'sv'}],
 on:{n(s,v){s.n=v},z(s,v){s.z=v},sv(s,v){s.sv=v}},
 draw(s){
  const N=60,res=H1_mva(N,s.sv,s.z),maxR=Math.max(2,...res.map(r=>r.R)),x=k=>70+300*(k-1)/(N-1),y=r=>300-220*r/maxR;let out=heading('Response time as users are added');
  out+=L(70,300,370,300,C.line,1.5)+L(70,80,70,300,C.line,1.5)+TF(220,330,'users',13,C.muted)+TF(24,190,'reply (s)',13,C.muted,'middle','transform="rotate(-90 24 190)"');
  [0,maxR/2,maxR].forEach(v=>out+=TF(62,y(v)+5,v.toFixed(1),13,C.muted,'end'));[1,20,40,60].forEach(k=>out+=TF(x(k),318,k,13,C.muted));
  const knee=(s.sv+s.z)/s.sv;
  out+=P('M'+range(N).map(i=>fmt(x(i+1))+' '+fmt(y(Math.max(s.sv,(i+1)*s.sv-s.z)))).join('L'),C.muted,1.5,'none','stroke-dasharray="5 4"');
  out+=P('M'+res.map((r,i)=>fmt(x(i+1))+' '+fmt(y(r.R))).join('L'),C.blue,3);
  if(knee<=N)out+=L(x(knee),84,x(knee),300,C.amber,1.5,'stroke-dasharray="3 3"')+TF(x(knee),76,'knee ≈ '+knee.toFixed(0),13,C.amber);
  const cur=res[s.n-1];out+=Ci(x(s.n),y(cur.R),7,C.coral,'#fff');
  const util=Math.min(1,cur.X*s.sv);
  out+=counter(410,80,'reply time',cur.R.toFixed(2)+' s',cur.R>1?C.coral:C.green,170)+counter(410,140,'processor busy',Math.round(util*100)+'%',C.ink,170)+counter(410,200,'requests per minute',Math.round(cur.X*60),C.ink,170);
  out+=TF(495,280,'Dashed: the limits for',13,C.muted)+TF(495,300,'one request alone and',13,C.muted)+TF(495,320,'for a saturated machine',13,C.muted);
  return {svg:out,phase:`With ${s.n} users the processor is ${Math.round(util*100)}% busy and a reply takes about ${cur.R.toFixed(2)} s. Past the knee near ${knee.toFixed(0)} users, every extra user adds about ${s.sv} s to everyone’s wait.`};
 }});

/* ---------- Lesson: light pen ---------- */
const H1_BLIPS=[[130,150],[250,130],[272,250],[150,284],[208,206],[106,226]];
SCENE({id:'light-pen',name:'Light pen',tag:'Pointing at the screen',
 definition:'A light pen is a photocell in a pen. A vector screen draws its shapes one after another; the pen fires when the beam passes under it, and the timing tells the computer which shape you pointed at.',
 example:'SAGE air-defence operators in the late 1950s pointed a light gun at a radar blip to ask the computer about that aircraft: an early, large-scale use of pointing at a screen, inherited from MIT’s Whirlwind.',
 research:'Astrahan & Jacobs (1983). History of the design of the SAGE computer, the AN/FSQ-7 (Annals of the History of Computing): consoles with light guns.',
 desc:'A round radar screen with six blips drawn in order by the beam, a light pen touching one of them, and a timeline of one refresh showing when the pen’s photocell fires.',
 dur:11,hint:'Press any blip to touch it with the pen. The pen only knows when it saw light; the computer turns that moment into a blip.',
 init:()=>({pen:null}),
 watch(p){return {pen:4,beam:Math.floor(p*30)%6}},
 on:{pick(s,i){s.pen=Number(i)}},
 draw(s,f,X){
  const beam=s.beam!==undefined?s.beam:(s.pen!==null?s.pen:0);let out=Ci(190,206,150,'#0f2a22','#3f6b5c');
  [50,100].forEach(r=>out+=Ci(190,206,r,'none','#245345','stroke-dasharray="3 5"'));
  for(let k=0;k<beam;k++){const a=H1_BLIPS[k],b=H1_BLIPS[k+1];out+=L(a[0],a[1],b[0],b[1],'#2f7a5a',1,'stroke-dasharray="2 4"')}
  H1_BLIPS.forEach(([x,y],k)=>{const now=k===beam;out+=hit(X,'pick',k,`Blip T${k+1}`,(now?Ci(x,y,16,'#7dffb4','none','opacity=".3"'):'')+Ci(x,y,now?8:6,now?'#c8ffe0':'#5fd39a')+TF(x+16,y-10,'T'+(k+1),13,'#9fe2c0','start'))});
  if(s.pen!==null){const [x,y]=H1_BLIPS[s.pen];out+=P(`M${x+6} ${y+6}L${x+70} ${y+90}`,'#cfd8dc',9)+P(`M${x+4} ${y+4}L${x+10} ${y+11}`,'#ffcf4a',4)}
  out+=TB(480,60,'One refresh: 20 ms',15);
  for(let k=0;k<6;k++){const x=372+k*36,on=k===beam,pen=k===s.pen;out+=R(x,78,32,34,on?'#d8f5e6':'#fff',pen?C.coral:on?C.green:C.grid,5)+TF(x+16,100,'T'+(k+1),13,C.ink)}
  out+=TF(372,130,'0 ms',13,C.muted,'start')+TF(588,130,'20 ms',13,C.muted,'end');
  if(s.pen!==null){const t=(s.pen*20/6).toFixed(1);out+=R(366,156,224,92,'#fff',C.coral,8)+TF(478,182,`Photocell fires at ${t} ms`,14,C.ink)+TF(478,206,`→ the beam was drawing T${s.pen+1}`,14,C.coral,'middle','font-weight="650"')+TF(478,232,`height ${(8+s.pen*3)*1000} ft · ${380+s.pen*25} knots`,13,C.muted)}
  else out+=TF(478,200,'Point the pen at a blip.',14,C.muted);
  return {svg:out,phase:'The screen keeps no picture: the beam redraws every blip many times a second. The pen sees a flash as the beam passes, and the computer checks what it was drawing at that instant.'};
 }});

SCENE({id:'light-pen-refresh',name:'Refresh and flicker',tag:'Drawing faster than the eye',
 definition:'A CRT image fades within milliseconds and must be redrawn. If redrawing is slower than the eye’s flicker-fusion rate, the picture visibly flickers.',
 example:'A vector display that could draw 60,000 short lines a second refreshed 1,000 lines 60 times a second: steady. At 3,000 lines it managed only 20: a shimmering mess.',
 research:'Ferry (1892) and Porter (1902): the critical flicker frequency rises with the logarithm of brightness (the Ferry–Porter law).',
 desc:'A graph of screen brightness over 100 milliseconds rising at each redraw and fading between; bars compare the refresh rate with the eye’s flicker threshold.',
 dur:11,hint:'Add lines to the drawing or raise the brightness. When the refresh rate falls below the flicker threshold, the image flickers.',
 init:()=>({lines:1500,bright:50}),
 watch(p){return {lines:Math.round(500+3500*smooth(p)),bright:50}},
 ui:[{range:'lines',label:'Lines drawn',min:100,max:4000,step:100,get:s=>s.lines,act:'lines'},{range:'bright',label:'Brightness',min:1,max:100,get:s=>s.bright,act:'bright'}],
 on:{lines(s,v){s.lines=v},bright(s,v){s.bright=v}},
 draw(s,f,X){
  const hz=Math.min(120,60000/s.lines),cff=35+12*Math.log10(s.bright),period=1000/hz,steady=hz>=cff;let out=heading('Redraw before the glow fades');
  out+=L(40,240,400,240,C.line,1.5)+L(40,80,40,240,C.line,1.5)+TF(220,262,'time: 100 ms',13,C.muted)+TF(30,160,'glow',13,C.muted,'middle','transform="rotate(-90 30 160)"');
  const pts=range(201).map(i=>{const t=i/2,ph=t%period;return [40+360*t/100,240-150*Math.exp(-ph/6)]});out+=P('M'+pts.map(p=>p.map(fmt).join(' ')).join('L'),steady?C.blue:C.coral,2);
  const glow=X.try?.6:Math.exp(-((X.p*400)%period)/6);
  out+=R(430,78,140,90,'#0f2a22','none',8)+L(452,123,548,123,'#7dffb4',3,`opacity="${steady?.9:fmt(.2+.8*glow)}"`)+TF(500,186,steady?'looks steady':'flickers',14,steady?C.green:C.coral,'middle','font-weight="650"');
  const bar=(y,lab,v,col)=>TF(430,y+14,lab,13,C.ink,'start')+R(430,y+20,140*v/120,14,col,'none',3)+TF(574,y+32,Math.round(v)+' Hz',13,C.ink,'end');
  out+=bar(210,'refresh rate',hz,steady?C.blue:C.coral)+bar(256,'flicker threshold',cff,C.amber);
  out+=TF(220,300,`${s.lines} lines at 60,000 lines a second → ${Math.round(hz)} redraws a second`,14,C.ink);
  return {svg:out,phase:steady?`${Math.round(hz)} Hz is above this brightness’s flicker threshold (~${Math.round(cff)} Hz), so the glow is refreshed before you can see it fade.`:`Only ${Math.round(hz)} Hz: below the ~${Math.round(cff)} Hz threshold, so each fade is visible. Brighter screens need even faster refresh.`};
 }});

const H1_LOAD={vertical:.3,tilted:.2,desk:.1};
const H1_endure=f=>f*100<=15?Infinity:(1236.5/Math.pow(f*100-15,.618)-72.5);
SCENE({id:'light-pen-fatigue',name:'Arm fatigue',tag:'“Gorilla arm”',
 definition:'Pointing at an upright screen means holding the arm up. Shoulder muscles tire within minutes, so long sessions with light pens, and later touch screens, became uncomfortable: “gorilla arm”.',
 example:'Holding the arm out at about 30% of its strength can be sustained for only a few minutes; at a desk-level surface the load can be held almost indefinitely.',
 research:['Rohmert (1960): endurance time falls steeply as the share of maximum strength rises.','Hincapié-Ramos, Guo, Moghadasian & Irani (2014). Consumed Endurance: a metric to quantify arm fatigue of mid-air interactions (CHI).'],
 desc:'A side view of a person reaching to a screen that is upright, tilted or flat; a gauge shows how much of the arm’s endurance has been used.',
 dur:10,hint:'Choose the screen’s angle and how long you keep pointing. The gauge estimates how much of your arm’s endurance you have used.',
 init:()=>({screen:'vertical',min:3}),
 watch(p){return {screen:p<.5?'vertical':'desk',min:Math.round(1+9*((p*2)%1))}},
 ui:[{choose:[['vertical','Upright'],['tilted','Tilted'],['desk','Flat on desk']],label:'Screen',get:s=>s.screen,act:'screen'},{range:'min',label:'Minutes pointing',min:1,max:30,get:s=>s.min,act:'min'}],
 on:{screen(s,v){s.screen=v},min(s,v){s.min=v}},
 draw(s){
  const f=H1_LOAD[s.screen],E=H1_endure(f),used=E===Infinity?0:Math.min(2,s.min*60/E);let out=heading('Hold your arm out to point');
  out+=L(40,330,330,330,C.line,2)+Ci(120,108,18,'none',C.ink)+L(120,126,120,226,C.ink,4)+L(120,226,100,326,C.ink,4)+L(120,226,140,326,C.ink,4);
  const hand={vertical:[230,140],tilted:[220,200],desk:[200,236]}[s.screen];out+=L(120,146,hand[0],hand[1],C.blue,5)+Ci(hand[0],hand[1],5,C.blue);
  if(s.screen==='vertical')out+=R(238,80,14,170,C.dark,'none',3);else if(s.screen==='tilted')out+=P('M226 250L296 160',C.dark,12);else out+=R(170,240,150,12,C.dark,'none',3)+L(240,252,240,330,C.line,4);
  const gx=380,gw=190;out+=TB(gx+gw/2,86,'Endurance used',15)+R(gx,100,gw,26,'#eef3f6','none',6)+R(gx,100,gw*Math.min(1,used),26,used>=1?C.coral:used>.6?C.amber:C.green,'none',6)+TB(gx+gw/2,119,E===Infinity?'sustainable':Math.round(used*100)+'%',14,used>.5?'#fff':C.ink);
  out+=counter(gx,150,'shoulder load (rough)',Math.round(f*100)+'% of max',C.ink,gw)+counter(gx,210,'endurance at this load',E===Infinity?'hours':(E/60).toFixed(1)+' min',E===Infinity?C.green:C.coral,gw);
  out+=TF(gx+gw/2,290,'Loads are rough illustrations;',13,C.muted)+TF(gx+gw/2,310,'the curve is Rohmert’s.',13,C.muted);
  return {svg:out,phase:E===Infinity?'At desk height the arm is supported and the load is low enough to hold for a long time.':`At about ${Math.round(f*100)}% of maximum strength the arm lasts around ${(E/60).toFixed(1)} minutes. After ${s.min} minute${s.min>1?'s':''} you have used ${Math.round(Math.min(2,used)*100)}% of it.`};
 }});

/* ---------- Lesson: vigilance ---------- */
function H1_clockRun(seed){const r=rng(seed);r();const fr=[];let pos=0,last=-5;for(let k=0;k<60;k++){const dbl=k>3&&k-last>4&&r()<.16;if(dbl)last=k;pos=(pos+(dbl?2:1))%100;fr.push({k,pos,dbl})}return fr}
SCENE({id:'vigilance',name:'Vigilance',tag:'Watching for rare signals',
 definition:'Vigilance is the ability to keep detecting rare signals over a long watch. Detection falls within the first half hour, a pattern found when radar operators missed submarines.',
 example:'In Mackworth’s clock test a pointer stepped once a second around a dial; occasionally it jumped twice as far. Watchers missed more of these double jumps as the session went on.',
 research:'Mackworth (1948). The breakdown of vigilance during prolonged visual search (Quarterly Journal of Experimental Psychology).',
 desc:'A clock dial with a pointer that steps once per tick and occasionally jumps double; counters show hits, misses and false alarms, and a schematic curve shows detection falling over a two-hour watch.',
 dur:14,hint:'Press Run, watch the pointer, and press “Double jump!” each time it jumps twice as far. At the end the double jumps are revealed.',
 init:()=>({seed:5,marks:[]}),
 ui:[{b:'Double jump!',act:'mark'},{b:'New watch',act:'fresh'}],
 on:{mark(s,_,ctx){s.marks.push(ctx.k);return 'keep'},fresh(s){s.seed=nextSeed();s.marks=[]}},
 trace(s){return H1_clockRun(s.seed)},
 draw(s,f,X){
  const fr=H1_clockRun(s.seed),end=X.k>=X.n-1,cx=170,cy=206,r=136;let out=heading('Spot the rare double jump');
  out+=Ci(cx,cy,r,'#fff',C.line);for(let i=0;i<100;i++){const a=-Math.PI/2+i*2*Math.PI/100,l=i%10?6:12;out+=L(cx+(r-l)*Math.cos(a),cy+(r-l)*Math.sin(a),cx+r*Math.cos(a),cy+r*Math.sin(a),C.muted,i%10?1:2)}
  const a=-Math.PI/2+f.pos*2*Math.PI/100,showDbl=f.dbl&&(!X.try||end);
  out+=L(cx,cy,cx+(r-18)*Math.cos(a),cy+(r-18)*Math.sin(a),showDbl?C.coral:C.ink,4)+Ci(cx,cy,7,C.ink);
  if(showDbl)out+=T(cx,cy+56,'double jump',15,C.coral,'middle','font-weight="700"');
  const upto=fr.slice(0,X.k+1),dbls=upto.filter(x=>x.dbl).map(x=>x.k),marks=s.marks.filter(m=>m<=X.k);
  const hits=dbls.filter(d=>marks.some(m=>m>=d&&m<=d+2)).length,fa=marks.filter(m=>!dbls.some(d=>m>=d&&m<=d+2)).length,misses=dbls.filter(d=>d<X.k-2).length-hits;
  out+=counter(340,60,'tick',`${X.k+1} of ${X.n}`,C.ink,110)+counter(460,60,'hits',X.try?hits:'—',C.green,110)+counter(340,116,'misses',X.try?Math.max(0,misses):'—',C.coral,110)+counter(460,116,'false alarms',X.try?fa:'—',C.amber,110);
  if(X.try&&end)out+=TF(455,192,`There were ${fr.filter(x=>x.dbl).length} double jumps.`,14,C.ink);
  out+=TF(455,226,'Schematic, after Mackworth (1948):',13,C.muted);
  out+=L(350,330,570,330,C.line,1.5)+L(350,250,350,330,C.line,1.5)+P('M350 256C380 258 395 286 430 290S520 296 570 298',C.blue,2.5)+TF(350,348,'0',13,C.muted)+TF(570,348,'2 h',13,C.muted,'end')+TF(356,248,'detected',13,C.muted,'start');
  return {svg:out,phase:X.try?(end?`Watch over: ${hits} hits, ${Math.max(0,misses)} misses, ${fa} false alarms. Real sessions lasted two hours; the decline appears within the first half hour.`:'Single steps are the noise; double jumps are the signal. Rare signals are easy to miss once attention fades.'):'The pointer steps once each tick. Coral marks a double jump: rare, and easily missed when it happens only now and then.'};
 }});

const H1_erf=x=>{const sg=Math.sign(x);x=Math.abs(x);const t=1/(1+.3275911*x);return sg*(1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-.284496736)*t+.254829592)*t*Math.exp(-x*x))};
const H1_Phi=x=>.5*(1+H1_erf(x/Math.SQRT2));
const H1_pdf=x=>Math.exp(-x*x/2)/Math.sqrt(2*Math.PI);
SCENE({id:'vigilance-sdt',name:'Signal detection',tag:'Hits, misses, false alarms',
 definition:'Signal detection theory separates how distinguishable a signal is (sensitivity, d′) from how willing an observer is to say “yes” (the criterion). Moving the criterion trades misses for false alarms.',
 example:'A cautious radar operator who reports only strong blips makes few false alarms but misses faint aircraft. Moving the criterion cannot improve both at once; only better sensitivity can.',
 research:'Green & Swets (1966). Signal Detection Theory and Psychophysics.',
 desc:'Two overlapping bell curves, noise and signal, with a vertical criterion line; the shaded areas to its right are hits and false alarms, and a small ROC curve shows the trade-off.',
 dur:11,hint:'Slide the criterion to trade misses for false alarms. Raise d′ to separate the curves and improve both.',
 init:()=>({d:1.5,c:.9}),
 watch(p){return {d:1.5,c:-1+3.5*smooth(p)}},
 ui:[{range:'d',label:'Sensitivity d′',min:0,max:3,step:.1,get:s=>s.d,act:'d'},{range:'c',label:'Criterion',min:-1.5,max:4,step:.1,get:s=>s.c,act:'c'}],
 on:{d(s,v){s.d=v},c(s,v){s.c=v}},
 draw(s){
  const x=v=>30+360*(v+3)/9,y=h=>290-440*h;let out=heading('Where do you draw the line?');
  out+=L(30,290,390,290,C.line,1.5);
  const curve=(mu,col)=>P('M'+range(121).map(i=>{const v=-3+9*i/120;return fmt(x(v))+' '+fmt(y(H1_pdf(v-mu)))}).join('L'),col,2.5);
  const area=(mu,col)=>{const pts=range(61).map(i=>{const v=s.c+(6-s.c)*i/60;return fmt(x(v))+' '+fmt(y(H1_pdf(v-mu)))});return P(`M${fmt(x(s.c))} 290L${pts.join('L')}L${fmt(x(6))} 290Z`,'none',0,col,'opacity=".45"')};
  out+=area(0,C.coral)+area(s.d,C.blue)+curve(0,C.coral)+curve(s.d,C.blue);
  out+=L(x(s.c),70,x(s.c),296,C.ink,2.5)+TF(x(s.c),64,'say “yes” →',13,C.ink,'start');
  out+=TF(x(0),y(H1_pdf(0))-8,'noise',13,C.coral)+TF(x(s.d),y(H1_pdf(0))-24,'signal',13,C.blue);
  const H=1-H1_Phi(s.c-s.d),F=1-H1_Phi(s.c);
  out+=counter(30,312,'hits',Math.round(H*100)+'%',C.blue,110)+counter(150,312,'misses',Math.round((1-H)*100)+'%',C.muted,110)+counter(270,312,'false alarms',Math.round(F*100)+'%',C.coral,120);
  const rx=430,ry=90,rw=150;out+=R(rx,ry,rw,rw,'#fff',C.grid,0)+L(rx,ry+rw,rx+rw,ry,C.grid,1,'stroke-dasharray="3 3"')+TF(rx+rw/2,ry+rw+20,'false alarms',13,C.muted)+TF(rx-8,ry+rw/2,'hits',13,C.muted,'end');
  out+=P('M'+range(81).map(i=>{const c=-4+11*i/80;return fmt(rx+rw*(1-H1_Phi(c)))+' '+fmt(ry+rw-rw*(1-H1_Phi(c-s.d)))}).join('L'),C.blue,2);
  out+=Ci(rx+rw*F,ry+rw-rw*H,6,C.ink,'#fff')+TB(rx+rw/2,ry-12,'ROC curve',14);
  return {svg:out,phase:`d′ = ${s.d.toFixed(1)}: ${Math.round(H*100)}% hits with ${Math.round(F*100)}% false alarms. Moving the line only slides the dot along the curve; better displays push the curve towards the top-left corner.`};
 }});

SCENE({id:'vigilance-alarms',name:'Alarm fatigue',tag:'When most alarms are false',
 definition:'When real events are rare, even a sensitive alarm produces mostly false alarms. People learn this and respond to fewer alarms: the “cry-wolf” effect.',
 example:'If 1 check in 50 is a real problem and the alarm wrongly fires on 5% of the rest, only about 2 in 7 alarms are real.',
 research:['Breznitz (1984). Cry Wolf: The Psychology of False Alarms.','Bliss, Gilson & Deaton (1995). Human probability matching behaviour in response to alarms of varying reliability (Ergonomics).'],
 desc:'A grid of one hundred alarm bells coloured real or false according to the rates chosen, with counters for how many alarms are real and how often people tend to respond.',
 dur:10,hint:'Make real events rarer or the alarm more trigger-happy, and watch the share of real alarms fall.',
 init:()=>({base:50,hit:95,fa:5}),
 watch(p){return {base:Math.round(2+198*smooth(p)),hit:95,fa:5}},
 ui:[{range:'base',label:'One real event in',min:2,max:200,get:s=>s.base,act:'base'},{range:'hit',label:'Caught (%)',min:50,max:99,get:s=>s.hit,act:'hit'},{range:'fa',label:'False alarm rate (%)',min:1,max:20,get:s=>s.fa,act:'fa'}],
 on:{base(s,v){s.base=v},hit(s,v){s.hit=v},fa(s,v){s.fa=v}},
 draw(s){
  const real=1000/s.base,tr=real*s.hit/100,fl=(1000-real)*s.fa/100,ppv=tr/(tr+fl),nReal=Math.round(ppv*100);let out=heading('Out of 100 alarms, how many are real?');
  for(let i=0;i<100;i++){const x=40+(i%10)*30,y=60+Math.floor(i/10)*28,isR=i<nReal;out+=P(`M${x} ${y+18}Q${x} ${y} ${x+10} ${y}Q${x+20} ${y} ${x+20} ${y+18}Z`,'none',0,isR?C.blue:C.coralp)+Ci(x+10,y+21,3,isR?C.blue:C.coral)}
  out+=TF(190,354,'blue: real problem · pale: false alarm',13,C.muted);
  out+=counter(370,64,'real alarms',nReal+' in 100',C.blue,200)+counter(370,124,'alarms per 1,000 checks',Math.round(tr+fl),C.ink,200)+counter(370,184,'real events missed per 1,000',(real-tr).toFixed(1),C.coral,200);
  out+=TF(470,268,'People tend to answer about the same',13,C.ink)+TF(470,288,'share of alarms as are real',13,C.ink)+TF(470,308,`(probability matching): ~${nReal}%`,13,C.ink,'middle','font-weight="700"');
  return {svg:out,phase:`With one real event in ${s.base}, only ${nReal} of every 100 alarms are real. Responses drop accordingly, so the rare real alarm may be ignored. Fewer, more reliable alarms work better.`};
 }});
