/* ===================== Stage 2 · Instruct ===================== */
// A code panel with line numbers; the active line is highlighted.
function IN_code(lines,active,x,y,w,lh=26,size=15){
 let out=R(x,y,w,lines.length*lh+14,'#fff',C.grid,8);
 lines.forEach((ln,i)=>{const yy=y+7+i*lh;if(i===active)out+=R(x+4,yy,w-8,lh,C.amberp,C.amber,5);
  out+=T(x+16,yy+lh*.68,String(i+1),13,C.muted,'middle')+TM(x+32,yy+lh*.68,ln,size,C.ink,'start','xml:space="preserve"')});
 return out;
}
// A named memory box holding a value.
function IN_var(x,y,w,h,name,val,hl=false,old=null){
 let out=T(x+w/2,y-8,name,15,C.muted,'middle','font-weight="650"')+R(x,y,w,h,hl?C.amberp:'#fff',hl?C.amber:C.blue,9);
 if(old!==null&&old!==undefined)out+=TM(x+18,y+h/2+6,old,16,C.muted,'start','text-decoration="line-through"');
 out+=TM(x+w/2+(old!==null&&old!==undefined?14:0),y+h/2+8,val===null||val===undefined?'—':val,22,val===null||val===undefined?C.muted:C.ink,'middle','font-weight="700"');
 return out;
}
function IN_diamond(cx,cy,w,h,label,fill='#fff',stroke=C.blue,size=15){
 return `<polygon points="${cx},${cy-h/2} ${cx+w/2},${cy} ${cx},${cy+h/2} ${cx-w/2},${cy}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`+T(cx,cy+5,label,size,C.ink);
}
const IN_on=v=>v?C.amberp:'#fff',IN_onS=v=>v?C.amber:C.blue;

SCENE({id:'algorithm',name:'Algorithm',tag:'A recipe precise enough for a machine',
 definition:'A finite list of exact steps that solves a problem, so that anyone (or anything) following it gets the right answer.',
 example:'“Find the largest number”: keep the first number as the best so far; look at each remaining number and replace the best whenever you see a bigger one.',
 desc:'A list of numbers above a flowchart for finding the largest; the current item is marked, the best so far is outlined and the active step of the flowchart is highlighted.',
 dur:14,hint:'Shuffle or make a new list, or press a number to change it. Then Step or Run the same flowchart.',
 init:()=>({list:[4,9,2,7,5,8]}),
 ui:[{b:'Shuffle',act:'shuffle'},{b:'New list',act:'fresh'}],
 on:{shuffle(s){s.list=shuffled(s.list,nextSeed())},fresh(s){const r=rng(nextSeed()),n=5+Math.floor(r()*3);s.list=range(n).map(()=>1+Math.floor(r()*9))},cell(s,i){s.list[i]=s.list[i]%9+1}},
 trace(s){const a=s.list,fr=[];let best=a[0],bi=0,cmp=0;
  fr.push({node:'start',i:0,best,bi,cmp,say:`Start: take the first item, ${best}, as the best so far.`});
  for(let i=1;i<a.length;i++){
   fr.push({node:'more',i,best,bi,cmp,say:`Are there more items? Yes: item ${i+1} is ${a[i]}.`});
   cmp++;const big=a[i]>best;
   fr.push({node:'compare',i,best,bi,cmp,big,say:`Is ${a[i]} bigger than ${best}? ${big?'Yes.':'No, so the best stays '+best+'.'}`});
   if(big){best=a[i];bi=i;fr.push({node:'update',i,best,bi,cmp,say:`Update: the best so far is now ${best}.`})}
  }
  fr.push({node:'done',i:a.length,best,bi,cmp,say:`No items left, so the answer is ${best}. It took ${cmp} comparisons: one for each item after the first, however the list is ordered.`});
  return fr},
 draw(s,f,X){
  const a=s.list,n=a.length,w=60,g=8,x0=300-(n*(w+g)-g)/2;let out=heading('Find the largest number');
  a.forEach((v,i)=>{const x=x0+i*(w+g),isBest=i===f.bi,cur=i===f.i&&f.node!=='done';
   out+=hit(X,'cell',i,`Item ${i+1} is ${v}. Press to change it.`,R(x,60,w,46,cur?C.amberp:'#fff',isBest?C.green:cur?C.amber:C.line,8,isBest?'stroke-width="4"':'')+TB(x+w/2,90,v,20,C.ink));
   if(isBest)out+=T(x+w/2,54,'best',13,C.green,'middle','font-weight="700"');
   if(cur)out+=arrow(x+w/2,134,x+w/2,112,C.amber,2.5,8)+T(x+w/2,146,'item',13,C.amber);
  });
  const act=f.node,fill=k=>k===act?C.amberp:'#fff',st=k=>k===act?C.amber:C.blue;
  out+=P('M470 313H560V158H235V175',C.line,2)+arrow(235,160,235,175,C.line,2,8);
  out+=box(18,187,142,46,'best ← first item',fill('start'),C.ink,14,st('start'));
  out+=arrow(160,210,175,210,C.line,2,8)+IN_diamond(235,210,120,70,'more items?',fill('more'),st('more'),14);
  out+=arrow(295,210,345,210,C.line,2,8)+T(318,202,'yes',13,C.green);
  out+=IN_diamond(405,210,120,70,'item > best?',fill('compare'),st('compare'),14);
  out+=L(465,210,560,210,C.line,2)+T(512,202,'no',13,C.coral)+Ci(560,210,4,C.line);
  out+=arrow(405,245,405,290,C.line,2,8)+T(418,272,'yes',13,C.green,'start');
  out+=box(340,290,130,46,'best ← item',fill('update'),C.ink,14,st('update'));
  out+=arrow(235,245,235,300,C.line,2,8)+T(222,278,'no',13,C.coral,'end');
  out+=box(165,300,140,46,'answer: '+(act==='done'?f.best:'best'),fill('done'),C.ink,14,st('done'));
  out+=counter(18,300,'comparisons',f.cmp,C.blue,120);
  return {svg:out,phase:f.say};
 }});

SCENE({id:'variable',name:'Variable',tag:'A named box for a value',
 definition:'A name that refers to a stored value. Assigning a new value replaces the old one.',
 example:'After x = 3 and then y = x, changing x to 5 does not change y: assignment makes x name a new value. (With a list, y = x makes both names share the same list, so changing the list shows through both.)',
 desc:'A four-line program beside two labelled memory boxes, x and y; as each line runs, values are written, copied and replaced.',
 dur:10,hint:'Choose the starting value of x, then step through the four lines. Watch y keep its copy.',
 init:()=>({x0:3}),
 ui:[{range:'x0',label:'Start x at',min:0,max:9,get:s=>s.x0,act:'x0'}],
 on:{x0(s,v){s.x0=v}},
 trace(s){const a=s.x0,b=a+2;return [
  {line:-1,x:null,y:null,say:'Nothing has run yet, so no boxes exist.'},
  {line:0,x:a,y:null,say:`Line 1: make a box called x and put ${a} in it. “=” means “store”, not “is equal to”.`},
  {line:1,x:a,y:a,copy:true,say:`Line 2: read the value in x (${a}) and store a copy of it in a new box, y.`},
  {line:2,x:b,y:a,old:a,say:`Line 3: work out x + 2 = ${b}, then store it in x. The old ${a} is replaced.`},
  {line:3,x:b,y:a,out:`${b} ${a}`,say:`Line 4 prints ${b} ${a}. y is still ${a}: it was given a copy of a value, not a link to x.`}]},
 draw(s,f){
  let out=heading('Assignment stores a value in a named box');
  out+=IN_code([`x = ${s.x0}`,'y = x','x = x + 2','print(x, y)'],f.line,24,64,256,34,17);
  out+=IN_var(360,80,170,70,'x',f.x,f.line===0||f.line===2,f.old!==undefined?f.old:null);
  out+=IN_var(360,220,170,70,'y',f.y,f.line===1);
  if(f.copy)out+=curveArrow(530,120,530,250,-46,C.coral,2.5)+T(588,190,'copy',14,C.coral,'end');
  out+=R(24,236,256,70,C.dark,'none',8)+T(36,258,'output',13,'#b9c9d3','start')+TM(36,290,f.out?'> '+f.out:'>',18,'#fff','start');
  out+=T(300,350,'Memory: each box has a name and holds one value at a time.',14,C.muted);
  return {svg:out,phase:f.say};
 }});

SCENE({id:'conditional',name:'Conditional',tag:'Choose one path',
 definition:'An instruction that checks whether a condition is true and runs one block of steps if it is, and another (or none) if it is not.',
 example:'if temperature > 20: wear a T-shirt, else: take a coat. At exactly 20 the condition is false, so you take the coat.',
 desc:'A thermometer beside a flowchart: the question “temperature > limit?” sends the path to either a T-shirt or a coat, and the taken branch is drawn thick.',
 dur:9,hint:'Slide the temperature and the limit. Try making them exactly equal.',
 init:()=>({temp:24,limit:20}),
 watch(p){return {temp:Math.round(-5+40*p),limit:20}},
 ui:[{range:'temp',label:'Temperature',min:-5,max:35,get:s=>s.temp,act:'temp',show:v=>v+' °C'},{range:'limit',label:'Limit',min:10,max:30,get:s=>s.limit,act:'limit',show:v=>v+' °C'}],
 on:{temp(s,v){s.temp=v},limit(s,v){s.limit=v}},
 draw(s){
  const yes=s.temp>s.limit;let out=heading(`if temperature > ${s.limit}`);
  const lv=clamp((s.temp+5)/40,0,1),top=300-lv*220;
  out+=R(36,70,30,240,'#fff',C.line,15)+R(41,top,20,305-top,yes?C.coral:C.blue,'none',10)+Ci(51,316,22,yes?C.coral:C.blue)+TB(51,354,s.temp+' °C',16,C.ink);
  const ly=300-clamp((s.limit+5)/40,0,1)*220;out+=L(70,ly,96,ly,C.amber,2)+T(100,ly+5,s.limit+'°',13,C.amber,'start');
  out+=arrow(310,52,310,82,C.line,2,8);
  out+=IN_diamond(310,122,200,80,`${s.temp} > ${s.limit} ?`,'#fff',C.blue,17);
  out+=P('M410 122H495V190',wireCol(yes),wireW(yes))+T(452,114,'yes',14,yes?C.green:C.muted);
  out+=P('M210 122H195V190',wireCol(!yes),wireW(!yes))+T(202,114,'no',14,!yes?C.coral:C.muted,'end');
  out+=box(420,190,150,50,'wear a T-shirt',yes?C.amberp:'#fff',yes?C.ink:C.muted,16,yes?C.amber:C.line);
  out+=box(120,190,150,50,'take a coat',!yes?C.amberp:'#fff',!yes?C.ink:C.muted,16,!yes?C.amber:C.line);
  out+=P('M495 240V280H385',yes?C.blue:'#b9c9d3',2)+P('M195 240V280H235',!yes?C.blue:'#b9c9d3',2);
  out+=box(235,262,150,40,'go outside',C.pale,C.ink,15);
  out+=T(310,340,'Only one branch runs. Both paths meet again afterwards.',14,C.muted);
  const eq=s.temp===s.limit;
  return {svg:out,phase:eq?`${s.temp} > ${s.limit} is false because they are equal, so the “else” branch runs. Writing >= instead would change the answer at exactly ${s.limit}.`:`${s.temp} > ${s.limit} is ${yes}, so the program ${yes?'wears a T-shirt':'takes a coat'}. The other branch is skipped entirely.`};
 }});

SCENE({id:'loop',name:'Loop',tag:'Repeat steps',
 definition:'An instruction that repeats a block of steps, either a fixed number of times or while a condition stays true.',
 example:'total = 0; for i from 1 to 5: total = total + i. The body runs five times and total ends as 15.',
 desc:'A short loop program beside the variables i and total; a staircase of blocks grows one column per repetition, showing the running total.',
 dur:13,hint:'Choose n, then Step: each repetition adds the next column of blocks to the total.',
 init:()=>({n:5}),
 ui:[{range:'n',label:'n',min:1,max:10,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=v}},
 trace(s){const fr=[{line:0,i:null,total:0,it:0,say:'Set total to 0 before the loop starts.'}];let total=0;
  for(let i=1;i<=s.n;i++){fr.push({line:1,i,total,it:i-1,say:`Repetition ${i}: i takes the next value, ${i}.`});total+=i;fr.push({line:2,i,total,it:i,say:`total = ${total-i} + ${i} = ${total}.`})}
  fr.push({line:3,i:s.n,total,it:s.n,done:true,say:`The loop ran ${s.n} times and prints ${total}. The shortcut n(n+1)/2 = ${s.n*(s.n+1)/2} gives the same total without looping.`});return fr},
 draw(s,f){
  let out=heading(`Add 1 + 2 + … + ${s.n}`);
  out+=IN_code(['total = 0',`for i in 1 to ${s.n}:`,'    total = total + i','print(total)'],f.line,20,52,280,32,16);
  out+=IN_var(330,70,100,52,'i',f.i,f.line===1)+IN_var(460,70,120,52,'total',f.total,f.line===2);
  out+=counter(20,220,'repetitions',f.it+' of '+s.n,C.blue,150);
  out+=T(20,310,`1 + 2 + … + n = n(n+1)/2`,15,C.muted,'start');
  const sz=Math.min(24,150/s.n,230/s.n),x0=330,base=352;
  for(let i=1;i<=s.n;i++)for(let j=0;j<i;j++){const done=i<f.it||i===f.it&&f.line!==1,curCol=i===f.it&&f.line===2;
   out+=R(x0+(i-1)*sz,base-(j+1)*sz,sz-2,sz-2,curCol?C.coral:done?C.blue:'#fff',done||curCol?'none':C.grid,3)}
  out+=T(x0,base-s.n*sz-10,'one column per repetition',13,C.muted,'start');
  return {svg:out,phase:f.say};
 }});

const IN_FN={
 double:{name:'double(x)',rule:'2 × x',f:x=>2*x},
 square:{name:'square(x)',rule:'x × x',f:x=>x*x},
 even:{name:'isEven(x)',rule:'x mod 2 = 0 ?',f:x=>x%2===0?'true':'false'},
 length:{name:'length(word)',rule:'count the letters',f:w=>Array.from(w).length}
};
SCENE({id:'function',name:'Function',tag:'A named, reusable procedure',
 definition:'A named block of steps that takes inputs (parameters) and gives back a result (its return value). Call it by name whenever you need it.',
 example:'double(4) returns 8; double(4) always returns 8. Writing the steps once and calling them by name avoids repeating them.',
 desc:'An input card enters a machine labelled with the function’s name and rule; the output card comes out. A row below lists other calls of the same function.',
 dur:12,hint:'Choose a function and change its input. The row underneath shows that the same input always gives the same output.',
 init:()=>({f:'double',x:4,word:'cat'}),
 watch(p){const ks=['double','square','even','length'],q=p*4,i=Math.min(3,Math.floor(q));return {f:ks[i],x:[4,3,7,0][i],word:'tree',u:q-i}},
 ui:[{choose:[['double','double'],['square','square'],['even','isEven'],['length','length']],label:'Function',get:s=>s.f,act:'f'},{range:'x',label:'x',min:0,max:12,get:s=>s.x,act:'x'},{text:'Word',label:'Word',get:s=>s.word,act:'word',max:12}],
 on:{f(s,v){s.f=v},x(s,v){s.x=v},word(s,v){s.word=v}},
 draw(s,f,X){
  const fn=IN_FN[s.f],isW=s.f==='length',inp=isW?s.word:s.x,res=fn.f(inp),u=X.try?1:clamp(s.u,0,1);
  let out=heading('Same input, same output');
  const ix=lerp(30,190,smooth(u/.35)),inVis=u<.45,outVis=u>.55,ox=lerp(330,460,smooth((u-.55)/.35));
  out+=arrow(150,155,198,155,C.line,2.5)+arrow(402,155,450,155,C.line,2.5);
  if(inVis||X.try)out+=box(X.try?30:ix-10,120,120,70,isW?'“'+inp+'”':String(inp),'#fff',C.ink,isW?17:26,C.blue);
  if(outVis||X.try)out+=box(X.try?460:ox,120,120,70,String(res),C.amberp,C.ink,22,C.amber);
  out+=R(200,80,200,150,C.dark,'none',16)+TB(300,130,fn.name,20,'#fff')+T(300,162,'= '+fn.rule,16,'#cfe0ea')+T(300,206,'function',13,'#9fb6c4');
  out+=T(90,214,isW?'input word':'input x',13,C.muted);
  out+=T(520,214,'return value',13,C.muted);
  const xs=isW?['a','cat','tree','apple'].filter(w=>w!==inp).slice(0,3).concat([inp]):[...new Set([0,1,2,3,inp])].slice(-5);
  const cw=560/xs.length;
  xs.forEach((v,i)=>{const cur=v===inp,x=20+i*cw;out+=R(x+4,262,cw-8,54,cur?C.amberp:'#fff',cur?C.amber:C.grid,8)+TM(x+cw/2,286,`${fn.name.split('(')[0]}(${isW?'"'+v+'"':v})`,13,C.ink)+TB(x+cw/2,307,'→ '+fn.f(v),14,cur?C.amber:C.blue)});
  out+=T(300,350,'The caller only needs the name and the input; the steps stay hidden inside.',14,C.muted);
  return {svg:out,phase:`${fn.name.split('(')[0]}(${isW?'"'+inp+'"':inp}) returns ${res}. The input is the parameter; the result handed back is the return value.`};
 }});

const IN_CS=['def main():','    greet("NAME")','    print("done")','def greet(name):','    msg = format(name)','    print(msg)','def format(n):','    return "Hello, "+n+"!"'];
SCENE({id:'call-stack',name:'Call stack',tag:'Remembering where to return',
 definition:'The pile of active function calls. Each call pushes a frame holding its local variables; when the function returns, its frame is popped and the caller carries on where it left off.',
 example:'main calls greet, which calls format. The stack is main, greet, format; format returns first, then greet, then main.',
 desc:'A small program with three functions beside a stack of frames; frames are pushed as functions are called and popped as they return.',
 dur:13,hint:'Change the name, then step through. Each call adds a frame on top; each return removes the top frame.',
 init:()=>({name:'Ada'}),
 ui:[{text:'Name',label:'Name',get:s=>s.name,act:'name',max:8}],
 on:{name(s,v){s.name=v}},
 trace(s){const n=s.name||'?',msg=`Hello, ${n}!`;
  const M={fn:'main()',vars:''},G=v=>({fn:'greet',vars:'name = "'+n+'"'+(v?', msg = "'+msg+'"':'')}),F={fn:'format',vars:'n = "'+n+'"'};
  return [
   {line:0,stack:[M],out:[],say:'The program starts by calling main: push its frame.'},
   {line:1,stack:[M,G()],out:[],say:`main calls greet("${n}"). Push a frame for greet holding its parameter, name. main waits at line 2.`},
   {line:6,stack:[M,G(),F],out:[],say:'greet calls format(name). Push a third frame. greet waits at line 5.'},
   {line:7,stack:[M,G(),F],out:[],ret:msg,say:`format builds “${msg}” and returns it.`},
   {line:4,stack:[M,G(true)],out:[],say:'format’s frame is popped. greet resumes exactly where it waited and stores the result in msg.'},
   {line:5,stack:[M,G(true)],out:[msg],say:'greet prints the message.'},
   {line:2,stack:[M],out:[msg],say:'greet returns: pop its frame. main resumes after its call.'},
   {line:2,stack:[M],out:[msg,'done'],say:'main prints “done”.'},
   {line:-1,stack:[],out:[msg,'done'],say:'main returns and the stack is empty: the program has finished. Last in, first out.'}]},
 draw(s,f){
  let out=heading('Calls push frames; returns pop them');
  out+=IN_code(IN_CS.map(l=>l.replace('NAME',s.name||'?')),f.line,16,48,320,26,14);
  out+=R(16,276,320,82,C.dark,'none',8)+T(28,296,'output',13,'#b9c9d3','start');
  f.out.forEach((o,i)=>out+=TM(28,320+i*22,'> '+o,15,'#fff','start'));
  out+=L(372,350,584,350,C.ink,2.5)+T(478,370,'bottom of the stack',13,C.muted);
  f.stack.forEach((fr,i)=>{const y=350-(i+1)*64,top=i===f.stack.length-1;
   out+=R(372,y+4,212,58,top?C.amberp:C.pale,top?C.amber:C.line,8)+TB(384,y+26,fr.fn,15,C.ink,'start')+TMF(384,y+48,fr.vars.length>26?fr.vars.slice(0,25)+'…':fr.vars,13,C.muted,'start');
   if(top)out+=T(578,y+26,'top',13,C.amber,'end','font-weight="700"')});
  if(f.ret)out+=R(372,52,212,40,'#fff',C.coral,8)+TM(478,77,'returns "'+f.ret.slice(0,18)+'"',13,C.coral);
  return {svg:out,phase:f.say};
 }});

SCENE({id:'recursion',name:'Recursion',tag:'A function that calls itself',
 definition:'Solving a problem by calling the same function on a smaller version of it, until a base case is small enough to answer directly.',
 example:'factorial(4) = 4 × factorial(3), and so on down to the base case factorial(1) = 1. Then the answers multiply back up: 1, 2, 6, 24.',
 desc:'Nested frames for factorial calls grow downward until the base case, then each frame receives the answer from the one below and resolves.',
 dur:14,hint:'Choose n and step through: the stack grows to the base case, then unwinds with the answers.',
 init:()=>({n:4}),
 ui:[{range:'n',label:'n',min:1,max:6,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=v}},
 trace(s){const n=s.n,fr=[],fact=k=>k<=1?1:k*fact(k-1);
  for(let d=1;d<=n;d++){const k=n-d+1;fr.push({depth:d,resolved:0,mode:k===1?'base':'call',say:k===1?'factorial(1) is the base case: answer 1 directly, with no further call.':`factorial(${k}) needs factorial(${k-1}) first, so it calls itself and waits.`})}
  for(let r=1;r<n;r++){const k=r+1;fr.push({depth:n-r,resolved:r,mode:'return',say:`factorial(${k}) receives ${fact(k-1)} and returns ${k} × ${fact(k-1)} = ${fact(k)}. Its frame is popped.`})}
  fr.push({depth:0,resolved:n,mode:'done',say:`All frames have returned: factorial(${n}) = ${fact(n)}. The stack was ${n} frames deep at its deepest.`});
  return fr},
 draw(s,f){
  const n=s.n,fact=k=>k<=1?1:k*fact(k-1);let out=heading(`factorial(${n})`);
  const shown=f.mode==='return'||f.mode==='done'?n:f.depth;
  for(let i=0;i<shown;i++){const k=n-i,y=52+i*46,x=24+i*16,alive=i<f.depth,isBase=k===1,res=f.mode==='return'||f.mode==='done'?(n-i<=f.resolved?fact(k):null):(isBase&&f.mode==='base'?1:null),top=alive&&i===f.depth-1;
   const txt=isBase?'factorial(1) = 1   base case':`factorial(${k}) = ${k} × factorial(${k-1})`;
   out+=R(x,y,380-i*16,40,!alive?'#f4f6f7':top?C.amberp:isBase?C.greenp:'#fff',!alive?C.grid:top?C.amber:isBase?C.green:C.blue,8,!alive?'stroke-dasharray="5 4"':'');
   out+=TMF(x+12,y+26,txt,14,alive?C.ink:C.muted,'start','xml:space="preserve"');
   if(res!==null&&!isBase)out+=TBF(x+372-i*16,y+26,'= '+res,15,alive?C.green:C.muted,'end');
   if(i>0&&alive&&f.mode==='call')out+=arrow(x-6,y-14,x+4,y+2,C.line,2,6);
  }
  if(f.mode==='return'){const i=f.depth,y=52+i*46,x=24+i*16;out+=arrow(x+300,y+6,x+300,y-6,C.coral,2.5,8)}
  out+=counter(450,70,'stack depth',f.depth,C.blue,130)+counter(450,140,'calls made',Math.max(f.depth,f.mode==='return'||f.mode==='done'?n:0),C.purple,130);
  out+=TF(515,230,'Every recursive',13,C.muted)+TF(515,248,'call must move',13,C.muted)+TF(515,266,'toward the base case,',13,C.muted)+TF(515,284,'or it never stops.',13,C.muted);
  return {svg:out,phase:f.say};
 }});

/* ---------- Lesson scenes: each term is now a lesson of several scenes ---------- */
// A decision diamond whose label stays a fixed size (it must fit inside the shape on phones).
function IN_dia(cx,cy,w,h,label,fill='#fff',stroke=C.blue,size=13){
 return `<polygon points="${cx},${cy-h/2} ${cx+w/2},${cy} ${cx},${cy+h/2} ${cx-w/2},${cy}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`+TF(cx,cy+4.5,label,size,C.ink);
}

/* ===== Algorithm lesson ===== */
const IN_ROBOT={cols:6,rows:5,start:[0,4,0],goal:[5,0],walls:[[2,4],[2,3],[2,2],[4,1],[4,2],[4,3]],demo:'LFFFRFFFLFRFF'};
const IN_DIR=[[1,0],[0,1],[-1,0],[0,-1]],IN_DNAME=['east','south','west','north'];
function IN_robotRun(prog){
 let [x,y,d]=IN_ROBOT.start;const trail=[[x,y]];
 const fr=[{x,y,d,k:-1,trail:trail.slice(),say:'The robot starts at the bottom left, facing east. It does exactly what each command says, nothing more.'}];
 for(let k=0;k<prog.length;k++){const c=prog[k];
  if(c==='L'||c==='R'){d=(d+(c==='L'?3:1))%4;fr.push({x,y,d,k,trail:trail.slice(),say:`Command ${k+1}: turn ${c==='L'?'left':'right'}. Now facing ${IN_DNAME[d]}.`});continue}
  const nx=x+IN_DIR[d][0],ny=y+IN_DIR[d][1],wall=IN_ROBOT.walls.some(w=>w[0]===nx&&w[1]===ny),edge=nx<0||ny<0||nx>=IN_ROBOT.cols||ny>=IN_ROBOT.rows;
  if(wall||edge){fr.push({x,y,d,k,trail:trail.slice(),crash:true,say:`Command ${k+1}: forward, but there is ${wall?'a wall':'the edge'} in the way. The robot cannot guess what you meant, so it stops.`});return fr}
  x=nx;y=ny;trail.push([x,y]);fr.push({x,y,d,k,trail:trail.slice(),say:`Command ${k+1}: forward one square.`});
 }
 const last=fr[fr.length-1],ok=last.x===IN_ROBOT.goal[0]&&last.y===IN_ROBOT.goal[1];
 fr.push({...last,k:prog.length,end:true,ok,say:ok?`The robot is on the star after ${prog.length} commands. Exact steps give the same result every time they are followed.`:prog.length?'The commands have run out and the robot is not on the star. Add or change commands.':'The program is empty. Add commands with the buttons.'});
 return fr;
}
SCENE({id:'algorithm-precision',name:'Precise instructions',tag:'Machines follow instructions literally',
 definition:'An algorithm must leave nothing to guess: each step says exactly what to do, in an order that works every time.',
 example:'“Walk to the star” is too vague for a robot. “Turn left, forward 3, turn right, forward 3, …” can be followed by anything that understands the three commands.',
 desc:'A robot on a grid with walls and a star beside the list of commands it is following; the current command is highlighted and the robot’s path is drawn.',
 dur:14,hint:'Build a program with Forward, Left and Right, then Step or Run it. The robot never guesses: a wrong turn means a crash.',
 init:()=>({prog:IN_ROBOT.demo.split('')}),
 ui:[{b:'Forward',act:'add',arg:'F'},{b:'Left',act:'add',arg:'L'},{b:'Right',act:'add',arg:'R'},{b:'Undo',act:'undo'},{b:'Clear',act:'clear'},{b:'Example',act:'demo'}],
 on:{add(s,c){if(s.prog.length<20)s.prog.push(c);return 'end'},undo(s){s.prog.pop();return 'end'},clear(s){s.prog=[]},demo(s){s.prog=IN_ROBOT.demo.split('')}},
 trace(s){return IN_robotRun(s.prog)},
 draw(s,f){
  let out=heading('Follow the program exactly');const cs=48,x0=20,y0=52;
  for(let r=0;r<IN_ROBOT.rows;r++)for(let c=0;c<IN_ROBOT.cols;c++){const wall=IN_ROBOT.walls.some(w=>w[0]===c&&w[1]===r);out+=R(x0+c*cs,y0+r*cs,cs-3,cs-3,wall?C.dark:'#fff',wall?C.dark:C.grid,5)}
  const g=IN_ROBOT.goal;out+=T(x0+g[0]*cs+22.5,y0+g[1]*cs+32,'★',28,C.green);
  if(f.trail.length>1)out+=P('M'+f.trail.map(([a,b])=>`${x0+a*cs+22.5} ${y0+b*cs+22.5}`).join('L'),C.amber,4,'none','opacity=".75"');
  const rx=x0+f.x*cs+22.5,ry=y0+f.y*cs+22.5;
  out+=`<g transform="translate(${rx} ${ry}) rotate(${f.d*90})"><polygon points="15,0 -11,-11 -11,11" fill="${f.crash?C.coral:C.blue}"/></g>`;
  if(f.crash)out+=TB(rx,ry-18,'!',20,C.coral);
  out+=TB(330,66,'Program',15,C.ink,'start');
  s.prog.forEach((c,i)=>{const x=330+(i%5)*50,y=78+Math.floor(i/5)*46,cur=i===f.k;out+=R(x,y,44,38,cur?(f.crash?C.coralp:C.amberp):i<f.k?C.pale:'#fff',cur?(f.crash?C.coral:C.amber):C.grid,7)+TB(x+22,y+25,{F:'↑',L:'↺',R:'↻'}[c],18,C.ink)});
  if(!s.prog.length)out+=T(330,104,'(empty)',14,C.muted,'start');
  out+=TF(330,284,'↑ forward one square',13,C.muted,'start')+TF(330,302,'↺ turn left   ↻ turn right',13,C.muted,'start','xml:space="preserve"');
  const v=f.end?(f.ok?['Reached the star ✓',C.green,C.greenp]:['Not on the star',C.coral,C.coralp]):f.crash?['Crashed: the robot stopped',C.coral,C.coralp]:null;
  if(v)out+=R(20,310,285,40,v[2],v[1],10)+TB(162,336,v[0],16,v[1]);
  else out+=T(162,336,`${Math.max(0,f.k+1)} of ${s.prog.length} commands done`,14,C.muted);
  return {svg:out,phase:f.say};
 }});

function IN_leap(y){const a=y%4===0,b=y%100===0,c=y%400===0;return {a,b,c,leap:a&&(!b||c)}}
const IN_LEAP_CODE=['if year mod 4 ≠ 0:','    not a leap year','else if year mod 100 ≠ 0:','    leap year','else if year mod 400 ≠ 0:','    not a leap year','else:','    leap year'];
SCENE({id:'pseudocode-flowchart',name:'Pseudocode and flowcharts',tag:'One algorithm, two notations',
 definition:'Pseudocode writes an algorithm as structured, language-neutral text; a flowchart draws the same steps as boxes and decision diamonds. Both describe the algorithm, not one particular program.',
 example:'The leap-year rule: divisible by 4, except century years, except centuries divisible by 400. So 2024 and 2000 are leap years; 2023 and 1900 are not.',
 desc:'Leap-year pseudocode on the left and the equivalent flowchart on the right; the same step is highlighted in both as a year is checked.',
 dur:12,hint:'Pick a year and step through. The highlighted pseudocode line and flowchart shape always describe the same step.',
 init:()=>({year:1900}),
 ui:[{range:'year',label:'Year',min:1880,max:2040,get:s=>s.year,act:'year'},{choose:[[2023,'2023'],[2024,'2024'],[1900,'1900'],[2000,'2000']],label:'Examples',get:s=>s.year,act:'year'}],
 on:{year(s,v){s.year=Number(v)}},
 trace(s){const y=s.year,r=IN_leap(y),fr=[{line:-1,node:-1,say:`Check the year ${y}. Both notations describe exactly the same tests in the same order.`}];
  fr.push({line:0,node:0,say:`Is ${y} divisible by 4? ${y} mod 4 = ${y%4}, so ${r.a?'yes':'no'}.`});
  if(!r.a){fr.push({line:1,node:'n0',out:false,say:`Not divisible by 4: ${y} is not a leap year.`});return fr}
  fr.push({line:2,node:1,say:`Is it a century year (divisible by 100)? ${y} mod 100 = ${y%100}, so ${r.b?'yes':'no'}.`});
  if(!r.b){fr.push({line:3,node:'n1',out:true,say:`Divisible by 4 but not a century: ${y} is a leap year.`});return fr}
  fr.push({line:4,node:2,say:`Century years must also divide by 400. ${y} mod 400 = ${y%400}, so ${r.c?'yes':'no'}.`});
  fr.push(r.c?{line:7,node:'n3',out:true,say:`${y} divides by 400, so it is a leap year after all.`}:{line:5,node:'n2',out:false,say:`${y} is a century not divisible by 400, so it is not a leap year.`});
  return fr},
 draw(s,f){
  let out=heading(`Is ${s.year} a leap year?`);
  out+=TF(151,52,'pseudocode',13,C.muted)+TF(440,52,'flowchart',13,C.muted);
  out+=IN_code(IN_LEAP_CODE,f.line,12,60,280,28,14);
  const D=[[85,'divisible by 4?'],[170,'divisible by 100?'],[255,'divisible by 400?']],cx=390;
  const on=k=>f.node===k,box2=(x,y,label,k)=>R(x,y,100,34,on(k)?C.amberp:'#fff',on(k)?C.amber:C.line,8)+TF(x+50,y+22,label,13,C.ink);
  out+=arrow(cx,114,cx,141,C.line,2,7)+arrow(cx,199,cx,226,C.line,2,7)+arrow(cx,284,cx,308,C.line,2,7);
  out+=TF(cx+8,131,'yes',13,C.green,'start')+TF(cx+8,216,'yes',13,C.green,'start')+TF(cx+8,300,'yes',13,C.green,'start');
  D.forEach(([y,l],i)=>{out+=IN_dia(cx,y,150,56,l,on(i)?C.amberp:'#fff',on(i)?C.amber:C.blue)+arrow(cx+75,y,492,y,C.line,2,7)+TF(cx+83,y-7,'no',13,C.coral,'middle')});
  out+=box2(492,68,'not leap','n0')+box2(492,153,'leap','n1')+box2(492,238,'not leap','n2')+box2(cx-50,308,'leap','n3');
  if(f.out!==undefined)out+=R(12,312,280,44,f.out?C.greenp:C.coralp,f.out?C.green:C.coral,10)+TB(152,340,`${s.year}: ${f.out?'a leap year':'not a leap year'}`,16,f.out?C.green:C.coral);
  return {svg:out,phase:f.say};
 }});

const IN_LISTS={neg:[-4,-9,-2,-7],mixed:[3,-5,8,-1],pos:[2,7,4,6]};
SCENE({id:'algorithm-correctness',name:'Testing and counterexamples',tag:'One failing input is enough',
 definition:'An algorithm is correct only if it gives the right answer for every allowed input. Tests can reveal a bug; a single counterexample proves the algorithm wrong.',
 example:'“Start with best = 0, then keep anything bigger” finds the largest of 3, 8, 5. But for −4, −9, −2 it answers 0, which is not even in the list.',
 desc:'A list of numbers, the chosen version of a find-the-largest program, and the variable best changing step by step; the final answer is compared with the true largest value.',
 dur:12,hint:'Switch between the buggy and fixed versions and try different lists (press a number to raise it by 1). Find an input that breaks the buggy version.',
 init:()=>({list:IN_LISTS.neg.slice(),fixed:false}),
 ui:[{choose:[[0,'Buggy: best = 0'],[1,'Fixed: best = first']],label:'Version',get:s=>s.fixed?1:0,act:'ver'},{b:'All negative',act:'preset',arg:'neg'},{b:'Mixed',act:'preset',arg:'mixed'},{b:'All positive',act:'preset',arg:'pos'}],
 on:{ver(s,v){s.fixed=Number(v)===1;return 'end'},preset(s,k){s.list=IN_LISTS[k].slice();return 'end'},cell(s,i){i=Number(i);s.list[i]=s.list[i]>=9?-9:s.list[i]+1;return 'end'}},
 trace(s){const a=s.list,fr=[];let best=s.fixed?a[0]:0;
  fr.push({i:-1,line:0,best,say:s.fixed?`Start with best = the first item, ${a[0]}.`:'Start with best = 0. This hides an assumption: that some item is at least 0.'});
  for(let i=s.fixed?1:0;i<a.length;i++){const big=a[i]>best;if(big)best=a[i];fr.push({i,line:big?3:2,best,say:`Item ${a[i]}: ${big?`bigger, so best = ${a[i]}.`:`not bigger than ${best}, keep ${best}.`}`})}
  const truth=Math.max(...a),ok=best===truth;
  fr.push({i:a.length,line:4,best,done:true,ok,truth,say:ok?`Answer ${best}, and the true largest is ${truth}. This test passes, but passing tests cannot prove that every input works.`:`Answer ${best}, but the true largest is ${truth}. This list is a counterexample: the algorithm is wrong.`});
  return fr},
 draw(s,f,X){
  const a=s.list,n=a.length,w=74,x0=300-n*(w+10)/2;let out=heading('Find the largest number: does it always work?');
  a.forEach((v,i)=>{const x=x0+i*(w+10),cur=i===f.i;out+=hit(X,'cell',i,`Item ${i+1} is ${v}. Press to raise it by 1.`,R(x,52,w,46,cur?C.amberp:'#fff',cur?C.amber:C.line,8)+TB(x+w/2,82,v,20,v<0?C.coral:C.ink))});
  const code=s.fixed?['best = list[0]','for item in rest of list:','    if item > best:','        best = item','return best']:['best = 0','for item in list:','    if item > best:','        best = item','return best'];
  out+=IN_code(code,f.line,16,122,290,30,15);
  out+=IN_var(330,138,120,62,'best',f.best,f.line===3||f.line===0);
  out+=counter(470,146,'true largest',f.done?f.truth:'?',C.green,110);
  if(f.done)out+=R(330,236,250,70,f.ok?C.greenp:C.coralp,f.ok?C.green:C.coral,10)+TB(455,264,f.ok?'✓ This test passes':'✗ Counterexample found',16,f.ok?C.green:C.coral)+TF(455,288,f.ok?'Try an input that might break it.':`expected ${f.truth}, got ${f.best}`,13,C.ink);
  out+=T(300,354,'Testing can show a bug is present; it cannot show that none are left.',14,C.muted);
  return {svg:out,phase:f.say};
 }});

/* ===== Variable lesson ===== */
function IN_typed(op,ta,tb){
 const S=t=>t==='str',F=t=>t==='float';
 if(op==='+'){
  if(S(ta)&&S(tb))return {v:'"34"',t:'string',note:'+ joins two strings end to end (concatenation): "3" + "4" is "34", not 7.'};
  if(S(ta)||S(tb))return {err:true,v:'TypeError',t:'error',note:'Python refuses to add a string to a number: it cannot know whether you meant 7 or "34".'};
  if(F(ta)||F(tb))return {v:'7.0',t:'float',note:'Mixing an integer with a float gives a float: 7.0.'};
  return {v:'7',t:'integer',note:'Two integers add as numbers: 3 + 4 = 7.'};
 }
 if(S(ta)&&S(tb))return {err:true,v:'TypeError',t:'error',note:'Two strings cannot be multiplied together.'};
 if(S(ta)&&tb==='int')return {v:'"3333"',t:'string',note:'A string times an integer repeats it: "3" × 4 is "3333".'};
 if(S(tb)&&ta==='int')return {v:'"444"',t:'string',note:'An integer times a string repeats it: 3 × "4" is "444".'};
 if(S(ta)||S(tb))return {err:true,v:'TypeError',t:'error',note:'A string can be repeated only a whole number of times, never 3.0 or 4.0 times.'};
 if(F(ta)||F(tb))return {v:'12.0',t:'float',note:'Multiplying with a float gives a float: 12.0.'};
 return {v:'12',t:'integer',note:'Two integers multiply as numbers: 3 × 4 = 12.'};
}
function IN_bits(t,v){if(t==='int')return bin(v,8);if(t==='str')return bin(48+v,8);const e=Math.floor(Math.log2(v)),m=Math.round((v/2**e-1)*128);return `0 ${bin(127+e,8)} ${bin(m,7)}…`}
const IN_TSHOW={int:v=>String(v),float:v=>v.toFixed(1),str:v=>`"${v}"`},IN_TNAME={int:'integer',float:'float',str:'string'};
SCENE({id:'data-types',name:'Data types',tag:'The same symbols, different meanings',
 definition:'A value’s type says what kind of data it is (whole number, decimal number, text, true/false) and therefore which operations make sense and what they do.',
 example:'In Python, 3 + 4 is 7, but "3" + "4" is "34", and 3 + "4" is an error (JavaScript instead converts the 3 and gives "34"; each language has its own rules). Inside the computer the integer 3 is 00000011 while the character "3" is 00110011.',
 desc:'Two values with type labels and their stored bit patterns, an operator between them, and the result with its type, or an error.',
 dur:12,hint:'Change each value’s type and the operator. Watch the bit patterns and the result change.',
 init:()=>({ta:'int',tb:'str',op:'+'}),
 watch(p){const c=[['int','int','+'],['str','str','+'],['float','int','+'],['str','int','×'],['int','str','+']][Math.min(4,Math.floor(p*5))];return {ta:c[0],tb:c[1],op:c[2]}},
 ui:[{choose:[['int','3'],['float','3.0'],['str','"3"']],label:'Type of a',get:s=>s.ta,act:'ta'},{choose:[['+','+'],['×','×']],label:'Operator',get:s=>s.op,act:'op'},{choose:[['int','4'],['float','4.0'],['str','"4"']],label:'Type of b',get:s=>s.tb,act:'tb'}],
 on:{ta(s,v){s.ta=v},tb(s,v){s.tb=v},op(s,v){s.op=v}},
 draw(s){
  const r=IN_typed(s.op,s.ta,s.tb);let out=heading('What does a '+s.op+' b do?');
  const val=(x,t,v,name)=>{const col=t==='str'?C.purple:t==='float'?C.green:C.blue;return TF(x+95,60,name,14,C.muted)+R(x,68,190,72,'#fff',col,10)+TM(x+95,114,IN_TSHOW[t](v),28,C.ink,'middle','font-weight="700"')+R(x+50,132,90,22,col,'none',11)+TF(x+95,147,IN_TNAME[t],13,'#fff','middle','font-weight="650"')+TF(x+95,178,'stored as',13,C.muted)+TMF(x+95,198,IN_bits(t,v),13,C.ink)};
  out+=val(30,s.ta,3,'a')+val(380,s.tb,4,'b');
  out+=Ci(300,104,26,C.dark)+TB(300,113,s.op,24,'#fff');
  out+=arrow(300,134,300,232,C.line,2.5);
  out+=R(180,236,240,68,r.err?C.coralp:C.amberp,r.err?C.coral:C.amber,10)+TM(300,272,r.v,r.err?22:26,r.err?C.coral:C.ink,'middle','font-weight="700"')+TF(300,294,r.err?'error: no sensible meaning':'result: '+r.t,13,C.muted);
  out+=T(300,344,'The type decides the meaning of the operator.',14,C.muted);
  return {svg:out,phase:r.note+(s.ta==='str'?' The character "3" is stored as code 51, not as the number 3.':s.tb==='str'?' The character "4" is stored as code 52, not as the number 4.':'')};
 }});

const IN_SWAP={naive:['a = b','b = a'],temp:['temp = a','a = b','b = temp'],tuple:['a, b = b, a']};
SCENE({id:'swap-variables',name:'Swapping two values',tag:'Save before you overwrite',
 definition:'Assignment replaces a value, so swapping two variables needs somewhere to keep one value while the other is copied over it.',
 example:'With a = 5 and b = 8, writing a = b then b = a leaves both as 8. Saving temp = a first, then a = b, then b = temp, swaps them.',
 desc:'A short program beside boxes for a, b and temp; arrows show each copy, and the final values are checked against the goal.',
 dur:11,hint:'Choose a method and the starting values, then step through. Which method loses a value?',
 init:()=>({m:'naive',a:5,b:8}),
 ui:[{choose:[['naive','a = b; b = a'],['temp','with temp'],['tuple','a, b = b, a']],label:'Method',get:s=>s.m,act:'m'},{range:'a',label:'a',min:0,max:9,get:s=>s.a,act:'a'},{range:'b',label:'b',min:0,max:9,get:s=>s.b,act:'b'}],
 on:{m(s,v){s.m=v},a(s,v){s.a=v},b(s,v){s.b=v}},
 trace(s){let a=s.a,b=s.b,t=null;const fr=[{line:-1,a,b,t,say:`Before: a = ${a}, b = ${b}. Goal: a = ${s.b} and b = ${s.a}.`}];
  if(s.m==='naive'){a=b;fr.push({line:0,a,b,t,to:'a',from:'b',say:`a = b copies ${b} into a. The old value of a, ${s.a}, is gone for good.`});b=a;fr.push({line:1,a,b,t,to:'b',from:'a',say:`b = a copies a, which is now ${a}, into b.`})}
  else if(s.m==='temp'){t=a;fr.push({line:0,a,b,t,to:'t',from:'a',say:`First save a copy of a (${a}) in temp.`});a=b;fr.push({line:1,a,b,t,to:'a',from:'b',say:`Now a can safely be overwritten with b (${b}).`});b=t;fr.push({line:2,a,b,t,to:'b',from:'t',say:`Finally b takes the saved value, ${t}.`})}
  else{[a,b]=[b,a];fr.push({line:0,a,b,t,to:'ab',say:'Python works out the right-hand side (b, a) first, holding both old values, then assigns both at once. It still uses temporary storage behind the scenes.'})}
  const ok=a===s.b&&b===s.a;fr.push({line:IN_SWAP[s.m].length,a,b,t,done:true,ok,say:ok?`Swapped: a = ${a}, b = ${b}.${s.a===s.b&&s.m==='naive'?' Only because a and b started equal: choose different values to see this method fail.':''}`:`Not swapped: a = ${a}, b = ${b}. One value was overwritten before it had been copied anywhere.`});return fr},
 draw(s,f){
  let out=heading('Swap the values of a and b');
  out+=IN_code([`a = ${s.a}`,`b = ${s.b}`,...IN_SWAP[s.m]],f.line<0?-1:f.line+2,16,56,250,34,17);
  const pos={a:[330,80],b:[460,80],t:[395,220]};
  out+=IN_var(330,80,110,62,'a',f.a,f.to==='a'||f.to==='ab')+IN_var(460,80,110,62,'b',f.b,f.to==='b'||f.to==='ab');
  if(s.m==='temp')out+=IN_var(395,220,110,62,'temp',f.t,f.to==='t');
  if(f.from){const A=pos[f.from],B=pos[f.to];out+=curveArrow(A[0]+55,A[1]+(f.from==='t'?0:62),B[0]+55,B[1]+(f.to==='t'?0:62),f.to==='t'||f.from==='t'?-30:40,C.coral,2.5)}
  if(f.to==='ab')out+=curveArrow(385,150,515,150,40,C.coral,2.5)+curveArrow(515,74,385,74,40,C.coral,2.5);
  if(f.done)out+=R(16,300,568,46,f.ok?C.greenp:C.coralp,f.ok?C.green:C.coral,10)+TB(300,329,f.ok?`✓ Swapped: a = ${f.a}, b = ${f.b}`:`✗ Both hold ${f.a}: the value ${s.a} was lost`,16,f.ok?C.green:C.coral);
  return {svg:out,phase:f.say};
 }});

SCENE({id:'variable-scope',name:'Scope',tag:'Where a name can be seen',
 definition:'A variable’s scope is the part of the program where its name refers to it. A variable created inside a function is local to that call; one created at the top level is global.',
 example:'If tick() says count = 1, Python makes a new local count inside tick, and the global count stays 10. Writing global count inside tick makes it change the global one instead.',
 desc:'A program beside a global variables box and a box for the tick() call’s local variables; arrows show which count each line reads or writes.',
 dur:12,hint:'Step through, then switch on “global count” and step through again. Compare what the last line prints.',
 init:()=>({glob:false}),
 ui:[{choose:[[0,'Local count'],[1,'global count']],label:'Inside tick',get:s=>s.glob?1:0,act:'glob'}],
 on:{glob(s,v){s.glob=Number(v)===1}},
 trace(s){const g=s.glob,fr=[];
  fr.push({line:0,gc:10,local:null,call:false,out:[],use:'g',say:'count = 10 at the top level creates a global variable.'});
  const ci=g?5:4;
  fr.push({line:ci,gc:10,local:null,call:true,out:[],say:'Calling tick() creates a fresh frame for its local variables. It starts empty.'});
  if(g){fr.push({line:2,gc:10,local:null,call:true,out:[],glob:true,say:'global count tells Python: inside this function, count means the global variable.'});
   fr.push({line:3,gc:1,local:null,call:true,out:[],glob:true,use:'g',say:'count = 1 now changes the global count to 1.'});
   fr.push({line:4,gc:1,local:null,call:true,out:['1'],glob:true,use:'g',say:'print(count) reads the global count: 1.'})}
  else{fr.push({line:2,gc:10,local:1,call:true,out:[],use:'l',say:'count = 1 inside a function creates a new local count. The global count is untouched.'});
   fr.push({line:3,gc:10,local:1,call:true,out:['1'],use:'l',say:'print(count) finds the local count first: 1.'})}
  const gc=g?1:10;
  fr.push({line:ci,gc,local:null,call:false,out:['1'],say:'tick returns and its frame, with any local variables, disappears.'});
  fr.push({line:ci+1,gc,local:null,call:false,out:['1',String(gc)],use:'g',done:true,say:g?'The last print reads the global count, which tick changed: 1.':'The last print reads the global count, still 10. The two counts were different variables with the same name.'});
  return fr},
 draw(s,f){
  const code=s.glob?['count = 10','def tick():','    global count','    count = 1','    print(count)','tick()','print(count)']:['count = 10','def tick():','    count = 1','    print(count)','tick()','print(count)'];
  let out=heading('Same name, different boxes');
  out+=IN_code(code,f.line,16,52,270,30,16);
  out+=R(16,284,270,70,C.dark,'none',8)+TF(28,302,'output',13,'#b9c9d3','start');f.out.forEach((o,i)=>out+=TM(28+i*60,334,'> '+o,17,'#fff','start'));
  out+=R(316,52,268,110,'#f4f8fb',C.line,10)+TF(330,72,'global variables',13,C.muted,'start');
  out+=IN_var(390,90,140,56,'',f.gc,f.use==='g')+TB(372,124,'count',15,C.ink,'end');
  out+=R(316,190,268,140,f.call?'#fffaf0':'#f4f6f7',f.call?C.amber:C.grid,10,f.call?'':'stroke-dasharray="5 4"')+TF(330,210,f.call?'tick() frame: local variables':'no tick() call running',13,f.call?C.amber:C.muted,'start');
  if(f.call){if(f.local!==null)out+=IN_var(390,236,140,56,'',f.local,f.use==='l')+TB(372,270,'count',15,C.ink,'end');
   else out+=TF(450,262,f.glob?'count → the global one':'(empty)',14,C.muted)+(f.glob?curveArrow(450,240,520,150,-30,C.amber,2):'')}
  return {svg:out,phase:f.say};
 }});

/* ===== Conditional lesson ===== */
const IN_GRADES=[[70,'A'],[60,'B'],[50,'C']],IN_GCOL={A:C.green,B:C.blue,C:C.purple,U:C.coral};
const IN_chain=o=>o==='wrong'?IN_GRADES.slice().reverse():IN_GRADES;
const IN_grade=(sc,o)=>{const h=IN_chain(o).find(([b])=>sc>=b);return h?h[1]:'U'};
SCENE({id:'else-if-chain',name:'Else-if chains',tag:'The first true test wins',
 definition:'An if … else if … else chain checks conditions in order and runs only the branch of the first one that is true; later tests are never looked at.',
 example:'if score ≥ 70: A, else if ≥ 60: B, else if ≥ 50: C, else: U. A score of 65 fails the first test and passes the second, so it gets B. Put the ≥ 50 test first and every pass becomes a C.',
 desc:'The chain of tests with each marked true, false or skipped, above a 0 to 100 score line coloured by the grade the chain gives each score.',
 dur:12,hint:'Slide the score, then switch to the wrong order and watch the coloured bands collapse.',
 init:()=>({score:65,order:'right'}),
 watch(p){return {score:Math.round(30+66*p),order:p<.82?'right':'wrong'}},
 ui:[{range:'score',label:'Score',min:0,max:100,get:s=>s.score,act:'score'},{choose:[['right','70, 60, 50'],['wrong','50, 60, 70']],label:'Order of tests',get:s=>s.order,act:'order'}],
 on:{score(s,v){s.score=v},order(s,v){s.order=v}},
 draw(s){
  const ch=IN_chain(s.order),hi=ch.findIndex(([b])=>s.score>=b),g=hi<0?'U':ch[hi][1];let out=heading(`score = ${s.score}`);
  const rows=ch.map(([b,gr],i)=>[`${i?'else if':'if'} score ≥ ${b}:`,gr,i]).concat([['else:','U',3]]);
  rows.forEach(([c,gr,i])=>{const y=48+i*48,taken=i===(hi<0?3:hi),checked=i<=(hi<0?3:hi),st=i===3?(taken?'runs':'skipped'):taken?'true':checked?'false':'skipped';
   out+=R(30,y,540,40,taken?C.amberp:'#fff',taken?C.amber:C.grid,8)+TM(48,y+26,c,16,checked?C.ink:C.muted,'start')+TM(300,y+26,'grade '+gr,16,checked?IN_GCOL[gr]:C.muted,'start','font-weight="700"');
   out+=TF(552,y+25,st==='true'?'✓ true':st==='false'?'✗ false':st==='runs'?'✓ runs':'not checked',13,st==='true'||st==='runs'?C.green:st==='false'?C.coral:C.muted,'end')});
  const x0=40,W=520;for(let v=0;v<100;v++){const gr=IN_grade(v,s.order);out+=R(x0+v*W/100,270,W/100+.6,22,IN_GCOL[gr],'none',0,'opacity=".85"')}
  for(const v of [0,50,60,70,100])out+=L(x0+v*W/100,266,x0+v*W/100,296,C.ink,1)+TF(x0+v*W/100,312,v,13,C.muted);
  const mx=x0+s.score*W/100;out+=`<polygon points="${fmt(mx)},266 ${fmt(mx-8)},252 ${fmt(mx+8)},252" fill="${C.ink}"/>`;
  out+=T(300,346,`Grade for each score with this order: ${s.order==='wrong'?'every score from 50 up is C':'U below 50, then C, B, A'}`,14,C.muted);
  return {svg:out,phase:`${s.score} gets grade ${g}. ${hi>=0?`The ${hi===0?'first':hi===1?'second':'third'} test is the first true one, so nothing after it is checked.`:'Every test was false, so the else branch runs.'}${s.order==='wrong'?' With the ≥ 50 test first, a score of 95 also stops there: order matters.':''}`};
 }});

const IN_RIDE=(h,a)=>h>=120&&a>=8;
SCENE({id:'nested-conditions',name:'Nested conditions and AND',tag:'Two ways to require both',
 definition:'A condition can be nested inside another, so the inner test runs only when the outer one is true. Combining the tests with AND gives the same result in a single condition.',
 example:'Ride if height ≥ 120 cm and age ≥ 8. “if tall: if old enough: ride” and “if tall and old enough: ride” agree for every visitor.',
 desc:'A nested pair of decisions on the left, a single combined AND decision on the right, and a two-by-two grid of all four cases with the current visitor highlighted.',
 dur:12,hint:'Change the height and age. Both versions always agree; the grid shows all four combinations.',
 init:()=>({h:130,a:7}),
 watch(p){const c=[[130,10],[130,6],[110,10],[110,6]][Math.min(3,Math.floor(p*4))];return {h:c[0],a:c[1]}},
 ui:[{range:'h',label:'Height (cm)',min:90,max:160,step:5,get:s=>s.h,act:'h'},{range:'a',label:'Age',min:4,max:14,get:s=>s.a,act:'a'}],
 on:{h(s,v){s.h=v},a(s,v){s.a=v}},
 draw(s){
  const t=s.h>=120,o=s.a>=8,ride=t&&o;let out=heading(`height ${s.h} cm, age ${s.a}`);
  out+=T(150,52,'nested',13,C.muted)+T(450,52,'combined with AND',13,C.muted)+L(300,46,300,226,C.grid,1.5);
  const pth=(on)=>[on?C.blue:'#b9c9d3',on?4:2];
  out+=IN_dia(105,92,150,50,'height ≥ 120?',t?C.amberp:C.coralp,t?C.amber:C.coral);
  let [c1,w1]=pth(!t);out+=P('M180 92H226V110',c1,w1);
  [c1,w1]=pth(t);out+=P('M105 117V140',c1,w1);
  out+=TF(196,86,'no',13,C.coral,'start')+TF(112,134,'yes',13,C.green,'start');
  if(t)out+=IN_dia(105,165,150,50,'age ≥ 8?',o?C.amberp:C.coralp,o?C.amber:C.coral);else out+=IN_dia(105,165,150,50,'age ≥ 8?','#f4f6f7',C.grid);
  [c1,w1]=pth(t&&!o);out+=P('M180 165H226V180',c1,w1);[c1,w1]=pth(ride);out+=P('M105 190V204',c1,w1);
  out+=R(186,110,96,30,!t?C.coralp:'#fff',!t?C.coral:C.line,7)+T(234,130,'no ride',13,C.ink)+R(186,180,96,30,t&&!o?C.coralp:'#fff',t&&!o?C.coral:C.line,7)+T(234,200,'no ride',13,C.ink);
  out+=R(57,204,96,30,ride?C.greenp:'#fff',ride?C.green:C.line,7)+T(105,224,'ride',13,C.ink);
  out+=IN_dia(450,110,262,62,'height ≥ 120 and age ≥ 8?',ride?C.amberp:C.coralp,ride?C.amber:C.coral);
  [c1,w1]=pth(ride);out+=P('M400 128V176',c1,w1);[c1,w1]=pth(!ride);out+=P('M500 128V176',c1,w1);
  out+=TF(392,156,'yes',13,C.green,'end')+TF(508,156,'no',13,C.coral,'start');
  out+=R(352,176,96,30,ride?C.greenp:'#fff',ride?C.green:C.line,7)+T(400,196,'ride',13,C.ink)+R(452,176,96,30,!ride?C.coralp:'#fff',!ride?C.coral:C.line,7)+T(500,196,'no ride',13,C.ink);
  const gx=190,gy=262;out+=TF(gx+110,gy-10,'age < 8          age ≥ 8',13,C.muted,'middle','xml:space="preserve"');
  [[0,0],[0,1],[1,0],[1,1]].forEach(([r,c])=>{const tall=r===1,old=c===1,cur=tall===t&&old===o,ok=tall&&old,x=gx+c*112,y=gy+r*44;
   out+=R(x,y,106,38,cur?(ok?C.greenp:C.coralp):'#fff',cur?(ok?C.green:C.coral):C.grid,7)+T(x+53,y+24,ok?'ride':'no ride',13,ok?C.green:C.muted,'middle',cur?'font-weight="700"':'')});
  out+=T(gx-10,gy+24,'height < 120',13,C.muted,'end')+T(gx-10,gy+68,'height ≥ 120',13,C.muted,'end');
  return {svg:out,phase:`${t?'Tall enough':'Too short'} and ${o?'old enough':'too young'}, so ${ride?'they can ride':'no ride'}. ${t?'':'In the nested version the age test is never even asked. '}Both versions agree in all four cases: only one cell of the grid allows the ride.`};
 }});

const IN_OPS=[['<',(x,k)=>x<k],['<=',(x,k)=>x<=k],['==',(x,k)=>x===k],['!=',(x,k)=>x!==k],['>=',(x,k)=>x>=k],['>',(x,k)=>x>k]];
SCENE({id:'comparison-operators',name:'Comparison operators',tag:'Mind the boundary',
 definition:'Comparisons such as <, <=, ==, != , >= and > produce true or false. The difference between < and <= is just one value: the boundary itself.',
 example:'With k = 5: 5 < 5 is false but 5 <= 5 is true. == asks “equal?” (two equals signs), unlike = which stores a value.',
 desc:'Six number lines, one per comparison operator, shaded where the comparison is true; open circles exclude the boundary, filled circles include it, and a marker shows the current x.',
 dur:11,hint:'Slide x across the boundary k, especially onto it exactly. Then move k.',
 init:()=>({x:5,k:5}),
 watch(p){return {x:Math.round(p*20)/2,k:5}},
 ui:[{range:'x',label:'x',min:0,max:10,step:.5,get:s=>s.x,act:'x'},{range:'k',label:'k',min:1,max:9,get:s=>s.k,act:'k'}],
 on:{x(s,v){s.x=v},k(s,v){s.k=v}},
 draw(s){
  let out=heading(`x = ${fmt(s.x)}, k = ${s.k}`);const x0=200,U=36,px=v=>x0+v*U;
  IN_OPS.forEach(([op,fn],i)=>{const y=62+i*44,res=fn(s.x,s.k);
   out+=TM(24,y+5,`x ${op} ${s.k}`,16,C.ink,'start','font-weight="650"')+R(118,y-13,62,26,res?C.greenp:'#f4f6f7',res?C.green:C.grid,13)+TF(149,y+5,res?'true':'false',13,res?C.green:C.muted,'middle','font-weight="700"');
   out+=L(px(0),y,px(10),y,C.grid,2);
   const seg=(a,b)=>L(px(a),y,px(b),y,C.blue,6);
   if(op==='<'||op==='<=')out+=seg(0,s.k);if(op==='>'||op==='>=')out+=seg(s.k,10);if(op==='!=')out+=seg(0,s.k)+seg(s.k,10);
   const filled=op==='<='||op==='>='||op==='==';out+=Ci(px(s.k),y,7,filled?C.blue:'#fff',C.blue)});
  for(let v=0;v<=10;v++)out+=TF(px(v),334,v,13,v===s.k?C.ink:C.muted,'middle',v===s.k?'font-weight="700"':'');
  out+=L(px(s.x),46,px(s.x),318,C.coral,2,'stroke-dasharray="5 4"')+TB(px(s.x),358,'x',15,C.coral);
  const tr=IN_OPS.filter(([,fn])=>fn(s.x,s.k)).map(([op])=>op).join(', ');
  return {svg:out,phase:`For x = ${fmt(s.x)}: true for ${tr}. ${s.x===s.k?'On the boundary only <=, == and >= are true. Off-by-one bugs live exactly here.':s.x<s.k?'Below k, the “less than” tests are true.':'Above k, the “greater than” tests are true.'}`};
 }});

/* ===== Loop lesson ===== */
SCENE({id:'while-loop',name:'While loops',tag:'Repeat until a condition fails',
 definition:'A while loop checks a condition before every repetition and stops the first time it is false, so the number of repetitions depends on the data.',
 example:'while n > 1: n = n // 2 halves 37 to 18, 9, 4, 2, 1: five repetitions. Starting from 100 takes six.',
 desc:'A while-loop program beside bars for each value of n as it is halved, the condition result at each check, and a count of repetitions.',
 dur:12,hint:'Choose a starting n and step through. Count how many checks are true before the first false one.',
 init:()=>({n:37}),
 ui:[{range:'n',label:'Start n at',min:1,max:100,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=v}},
 trace(s){let n=s.n,steps=0;const hist=[n],fr=[{line:0,n,steps,hist:hist.slice(),say:`n starts at ${n}.`}];
  for(;;){const c=n>1;fr.push({line:2,n,steps,hist:hist.slice(),check:c,say:`Check the condition: is ${n} > 1? ${c?'Yes, so run the body.':'No, so the loop stops here.'}`});if(!c)break;
   n=Math.floor(n/2);steps++;hist.push(n);fr.push({line:3,n,steps,hist:hist.slice(),say:`Halve, rounding down: ${hist[hist.length-2]} // 2 = ${n}. Repetitions so far: ${steps}.`})}
  fr.push({line:5,n,steps,hist,done:true,say:`It halved ${steps} time${steps===1?'':'s'}, then the condition was false. A while loop does not know in advance how often it will run; for ${s.n} it is ⌊log₂ ${s.n}⌋ = ${Math.floor(Math.log2(s.n))}.`});return fr},
 draw(s,f){
  let out=heading(`Halve ${s.n} until it reaches 1`);
  out+=IN_code([`n = ${s.n}`,'steps = 0','while n > 1:','    n = n // 2','    steps = steps + 1','print(steps)'],f.line,16,52,250,30,16);
  if(f.check!==undefined)out+=R(16,260,250,40,f.check?C.greenp:C.coralp,f.check?C.green:C.coral,8)+TB(141,286,`${f.n} > 1 is ${f.check}`,16,f.check?C.green:C.coral);
  out+=counter(16,310,'repetitions',f.steps,C.blue,120)+counter(146,310,'n now',f.n,C.purple,120);
  const W=36,sc=230/s.n;f.hist.forEach((v,i)=>{const x=300+i*(W+5),h=Math.max(2,v*sc),cur=i===f.hist.length-1;out+=R(x,320-h,W,h,cur?C.amber:C.blue,'none',4)+TF(x+W/2,314-h,v,13,C.ink)+TF(x+W/2,340,i===0?'start':'#'+i,13,C.muted)});
  return {svg:out,phase:f.say};
 }});

SCENE({id:'nested-loops',name:'Nested loops',tag:'A loop inside a loop',
 definition:'A loop placed inside another loop runs completely for every single repetition of the outer loop, so the inner body runs (outer count) × (inner count) times.',
 example:'for i in 1..4: for j in 1..5: write i × j fills a 4 × 5 times table: the inner line runs 20 times.',
 desc:'A nested-loop program beside a grid that fills one cell per inner repetition, row by row, with the current i and j shown.',
 dur:14,hint:'Choose the numbers of rows and columns, then Step or Run. The inner loop restarts for every row.',
 init:()=>({rows:4,cols:5}),
 ui:[{range:'rows',label:'Rows',min:1,max:8,get:s=>s.rows,act:'rows'},{range:'cols',label:'Columns',min:1,max:8,get:s=>s.cols,act:'cols'}],
 on:{rows(s,v){s.rows=v},cols(s,v){s.cols=v}},
 trace(s){const fr=[{i:0,j:0,k:0,line:-1,say:'Nothing has run yet.'}];let k=0;
  for(let i=1;i<=s.rows;i++)for(let j=1;j<=s.cols;j++){k++;fr.push({i,j,k,line:2,say:j===1?`Outer loop: i = ${i}. The inner loop starts again from j = 1: cell ${i} × 1 = ${i}.`:`Inner loop: j = ${j}, so cell ${i} × ${j} = ${i*j}.`})}
  fr.push({i:s.rows,j:s.cols,k,line:3,done:true,say:`The inner body ran ${s.rows} × ${s.cols} = ${k} times. Doubling both sizes would make it four times as much work.`});return fr},
 draw(s,f){
  let out=heading(`${s.rows} rows × ${s.cols} columns`);
  out+=IN_code([`for i in 1 to ${s.rows}:`,`    for j in 1 to ${s.cols}:`,'        cell = i × j','print(table)'],f.line,16,52,262,30,15);
  out+=IN_var(30,210,100,50,'i',f.i||null,f.line===2&&f.j===1)+IN_var(160,210,100,50,'j',f.j||null,f.line===2);
  out+=counter(30,290,'inner body runs',`${f.k} of ${s.rows*s.cols}`,C.blue,230);
  const cs=Math.min(34,250/s.cols,270/s.rows),x0=310,y0=64;
  for(let j=1;j<=s.cols;j++)out+=TF(x0+(j-.5)*cs,y0-6,j,13,j===f.j?C.amber:C.muted);
  for(let i=1;i<=s.rows;i++){out+=TF(x0-10,y0+(i-.5)*cs+5,i,13,i===f.i?C.amber:C.muted,'end');
   for(let j=1;j<=s.cols;j++){const n=(i-1)*s.cols+j,done=n<=f.k,cur=n===f.k&&!f.done;out+=R(x0+(j-1)*cs,y0+(i-1)*cs,cs-3,cs-3,cur?C.amber:done?C.pale:'#fff',done?(cur?C.amber:C.blue):C.grid,4);if(done)out+=TF(x0+(j-.5)*cs-1.5,y0+(i-.5)*cs+4.5,i*j,13,C.ink)}}
  return {svg:out,phase:f.say};
 }});

const IN_OBO={
 short:{code:n=>['for i in range(1, n):','    print(i)'],vals:n=>range(n-1).map(i=>i+1),note:'range(1, n) stops before n, so the last post is missing.'},
 right:{code:n=>['for i in range(1, n + 1):','    print(i)'],vals:n=>range(n).map(i=>i+1),note:'range(1, n + 1) includes n: exactly the posts 1 to n.'},
 zero:{code:n=>['for i in range(n):','    print(i)'],vals:n=>range(n),note:'range(n) counts 0 to n − 1: the right number of posts, shifted by one.'},
 forever:{code:n=>['i = 1','while i <= n:','    print(i)','    # forgot: i = i + 1'],vals:()=>range(12).map(()=>1),note:'i never changes, so i <= n stays true for ever: an infinite loop. This demo stops after 12; a real program would hang.'}};
SCENE({id:'off-by-one',name:'Off-by-one and infinite loops',tag:'The two classic loop bugs',
 definition:'An off-by-one error makes a loop run once too often or once too few; an infinite loop never stops because its condition never becomes false.',
 example:'To print 1 to 5, range(1, 5) gives only 1 to 4. A while loop that forgets i = i + 1 prints 1 for ever.',
 desc:'A loop program beside a row of target fence posts numbered 1 to n; posts fill in as the loop prints, revealing a missing, shifted or endlessly repeated post.',
 dur:12,hint:'Choose a version and n, then Step or Run. Only one version prints exactly 1 to n.',
 init:()=>({v:'short',n:5}),
 ui:[{choose:[['short','range(1, n)'],['right','range(1, n+1)'],['zero','range(n)'],['forever','no i += 1']],label:'Version',get:s=>s.v,act:'v'},{range:'n',label:'n',min:2,max:8,get:s=>s.n,act:'n'}],
 on:{v(s,x){s.v=x},n(s,x){s.n=x}},
 trace(s){const V=IN_OBO[s.v],vals=V.vals(s.n),fr=[{k:0,printed:[],say:`Goal: print every post from 1 to ${s.n}.`}];
  vals.forEach((v,i)=>fr.push({k:i+1,printed:vals.slice(0,i+1),say:s.v==='forever'?`i is still 1, so i <= ${s.n} is still true: print 1${i?' again':''}.`:`i = ${v}: print ${v}.${v===0?' Post 0 was never wanted.':''}${i===vals.length-1?` That was the last value range gives.`:''}`}));
  const ok=s.v==='right';fr.push({k:vals.length,printed:vals,done:true,ok,say:(ok?'✓ ':'✗ ')+V.note});return fr},
 draw(s,f){
  const V=IN_OBO[s.v],code=V.code(s.n);let out=heading(`Print the posts 1 to ${s.n}`);
  out+=IN_code(code.map(l=>l.replace(/\bn\b/g,String(s.n))),s.v==='forever'?(f.k?2:1):(f.k?1:0),16,52,262,32,15);
  out+=R(16,220,262,90,C.dark,'none',8)+TF(28,240,'output',13,'#b9c9d3','start');
  out+=TMF(28,268,f.printed.slice(0,12).join(' '),15,'#fff','start')+(f.printed.length>12?TMF(28,292,'…',15,'#fff','start'):'');
  const slots=s.n+1,w=Math.min(48,270/slots),x0=310;
  for(let v=0;v<=s.n;v++){const x=x0+v*w,want=v>=1,cnt=f.printed.filter(p=>p===v).length,bad=cnt&&!want||cnt>1;
   out+=R(x+4,130,w-8,130,cnt?(bad?C.coral:C.blue):'#fff',want?C.blue:C.grid,4,cnt?'':'stroke-dasharray="5 4"');
   out+=`<polygon points="${fmt(x+4)},130 ${fmt(x+w/2)},112 ${fmt(x+w-4)},130" fill="${cnt?(bad?C.coral:C.blue):'#fff'}" stroke="${want?C.blue:C.grid}" stroke-width="2"/>`;
   out+=TF(x+w/2,282,v,14,want?C.ink:C.muted);if(cnt>1)out+=TBF(x+w/2,104,'×'+cnt,13,C.coral)}
  out+=R(x0,264,slots*w,2,C.ink,'none',0)+TF(x0+slots*w/2,306,'dashed = not printed',13,C.muted);
  if(f.done)out+=R(16,320,568,40,f.ok?C.greenp:C.coralp,f.ok?C.green:C.coral,10)+TBF(300,345,f.ok?'Exactly 1 to '+s.n:s.v==='forever'?'Never stops':'Off by one',15,f.ok?C.green:C.coral);
  return {svg:out,phase:f.say};
 }});

/* ===== Function lesson ===== */
SCENE({id:'parameters-arguments',name:'Parameters and arguments',tag:'Matching values to names',
 definition:'Parameters are the names listed in a function’s definition; arguments are the actual values passed in a call. Arguments are matched to parameters by position, or by name if you write name = value.',
 example:'def rectangle(width, height). The call rectangle(3, 5) sets width = 3 and height = 5; rectangle(5, 3) draws a different shape; rectangle(height=3, width=5) matches by name.',
 desc:'A function call with its arguments above the function definition with its parameters; arrows show which argument fills which parameter, and the resulting rectangle is drawn below.',
 dur:12,hint:'Change the two values and how the call is written. Watch the arrows and the shape.',
 init:()=>({a:3,b:5,style:'pos'}),
 watch(p){return {a:3,b:5,style:['pos','swap','kw'][Math.min(2,Math.floor(p*3))]}},
 ui:[{range:'a',label:'First value',min:1,max:8,get:s=>s.a,act:'a'},{range:'b',label:'Second value',min:1,max:8,get:s=>s.b,act:'b'},{choose:[['pos','by position'],['swap','swapped'],['kw','by name']],label:'Call style',get:s=>s.style,act:'style'}],
 on:{a(s,v){s.a=v},b(s,v){s.b=v},style(s,v){s.style=v}},
 draw(s){
  const {a,b,style}=s,width=style==='swap'?b:style==='kw'?b:a,height=style==='swap'?a:style==='kw'?a:b;
  let out=heading('Arguments fill parameters');
  const call=style==='pos'?`rectangle(${a}, ${b})`:style==='swap'?`rectangle(${b}, ${a})`:`rectangle(height=${a}, width=${b})`;
  out+=TF(20,62,'call',13,C.muted,'start')+TM(300,64,call,19,C.ink,'middle','font-weight="650"');
  const args=style==='kw'?[[`height=${a}`,'height'],[`width=${b}`,'width']]:style==='swap'?[[String(b),'width'],[String(a),'height']]:[[String(a),'width'],[String(b),'height']];
  const slot={width:200,height:400};
  args.forEach(([lab,to],i)=>{const x=i?400:200;out+=R(x-58,82,116,34,C.amberp,C.amber,17)+TMF(x,104,lab,14,C.ink,'middle','font-weight="700"');out+=arrow(x,118,slot[to],170,C.coral,2.5,8)});
  out+=TF(20,104,'arguments',13,C.amber,'start')+TF(20,194,'parameters',13,C.blue,'start');
  out+=R(142,172,116,36,'#fff',C.blue,8)+TMF(200,195,`width = ${width}`,14,C.ink)+R(342,172,116,36,'#fff',C.blue,8)+TMF(400,195,`height = ${height}`,14,C.ink);
  out+=TMF(300,228,'def rectangle(width, height):',14,C.muted);
  const cs=Math.min(14,100/Math.max(width,height)),gx=200-width*cs/2,gy=258;
  for(let r=0;r<height;r++)for(let c=0;c<width;c++)out+=R(gx+c*cs,gy+r*cs,cs-2,cs-2,C.pale,C.blue,2);
  out+=TF(gx+width*cs/2,gy-6,width+' wide',13,C.muted)+TF(gx-6,gy+height*cs/2+4,height+' tall',13,C.muted,'end');
  out+=R(360,262,200,60,'#fff',C.green,10)+TF(460,284,'returns width × height',13,C.muted)+TB(460,310,`${width} × ${height} = ${width*height}`,17,C.green);
  return {svg:out,phase:style==='kw'?`Named arguments ignore order: height=${a} goes to height and width=${b} goes to width.`:style==='swap'?`Swapping the arguments swaps the parameters: width = ${b}, height = ${a}. The area matches, but the shape is different.`:`By position: the first argument (${a}) fills the first parameter, width; the second (${b}) fills height.`};
 }});

SCENE({id:'return-vs-print',name:'Return versus print',tag:'Showing a value is not handing it back',
 definition:'print puts text on the screen for a person to read. return hands a value back to the code that called the function, so the program can keep using it.',
 example:'If double(5) only prints 10, then y = double(5) + 1 fails: the caller receives nothing (None). If it returns 10, y becomes 11.',
 desc:'Two versions of double: one prints, one returns. A screen panel shows what the person sees; a separate box shows the value the caller receives, and y is computed or an error appears.',
 dur:12,hint:'Switch between the print and return versions and step through. Compare the screen with the value handed back.',
 init:()=>({ver:'print',x:5}),
 ui:[{choose:[['print','print(x * 2)'],['return','return x * 2']],label:'Version',get:s=>s.ver,act:'ver'},{range:'x',label:'x',min:0,max:9,get:s=>s.x,act:'x'}],
 on:{ver(s,v){s.ver=v},x(s,v){s.x=v}},
 trace(s){const d=2*s.x,pr=s.ver==='print',fr=[];
  fr.push({line:3,screen:[],back:undefined,say:`The program reaches y = double(${s.x}) + 1. It must call double first.`});
  fr.push({line:1,screen:pr?[String(d)]:[],back:undefined,say:pr?`Inside double, print shows ${d} on the screen for a person. Nothing is handed back.`:`Inside double, return hands the value ${d} back to the caller. Nothing appears on screen.`});
  fr.push({line:3,screen:pr?[String(d)]:[],back:pr?'None':String(d),say:pr?'double has finished, and the caller receives None: Python’s “no value”.':`The caller receives ${d} in place of double(${s.x}).`});
  if(pr)fr.push({line:3,screen:[String(d)],back:'None',err:true,say:`None + 1 has no meaning, so the program stops with a TypeError. Seeing ${d} on the screen did not help the program at all.`});
  else{fr.push({line:3,screen:[],back:String(d),y:d+1,say:`${d} + 1 = ${d+1} is stored in y.`});fr.push({line:4,screen:[String(d+1)],back:String(d),y:d+1,say:`print(y) shows ${d+1}. Return values can be used again; printed text cannot.`})}
  return fr},
 draw(s,f){
  const pr=s.ver==='print';let out=heading(pr?'double prints its answer':'double returns its answer');
  out+=IN_code(['def double(x):',pr?'    print(x * 2)':'    return x * 2','',`y = double(${s.x}) + 1`,'print(y)'],f.line,16,52,270,32,16);
  out+=R(316,52,268,92,C.dark,'none',10)+TF(330,72,'screen (for a person)',13,'#b9c9d3','start');f.screen.forEach((o,i)=>out+=TM(330,104+i*26,'> '+o,18,'#fff','start'));
  out+=TF(450,172,'handed back to the caller',13,C.muted)+R(380,180,140,52,f.back===undefined?'#f4f6f7':f.back==='None'?C.coralp:C.amberp,f.back===undefined?C.grid:f.back==='None'?C.coral:C.amber,10)+TM(450,213,f.back===undefined?'—':f.back,20,C.ink,'middle','font-weight="700"');
  out+=IN_var(380,270,140,56,'y',f.y,f.y!==undefined);
  if(f.err)out+=R(16,240,270,58,C.coralp,C.coral,10)+TBF(151,264,'TypeError',15,C.coral)+TMF(151,286,'None + 1',14,C.ink);
  return {svg:out,phase:f.say};
 }});

const IN_MACH={add3:{l:'add 3',f:x=>x+3,e:v=>`${v} + 3`},double:{l:'double',f:x=>2*x,e:v=>`2 × ${v}`},square:{l:'square',f:x=>x*x,e:v=>`${v}²`}};
SCENE({id:'function-composition',name:'Composing functions',tag:'The output of one is the input of the next',
 definition:'Composition feeds the return value of one function straight into another: f(g(x)) means “apply g, then apply f to the result”. The order matters.',
 example:'double(add3(2)) = double(5) = 10, but add3(double(2)) = add3(4) = 7.',
 desc:'A value passes through two function machines in turn; below, the same two functions applied in the opposite order give a different answer.',
 dur:12,hint:'Choose the first and second machines and the input x. Then compare with the reversed order underneath.',
 init:()=>({first:'add3',second:'double',x:2}),
 watch(p){const sw=p>=.5;return {first:sw?'double':'add3',second:sw?'add3':'double',x:2,u:(p%.5)*2}},
 ui:[{choose:[['add3','add 3'],['double','double'],['square','square']],label:'First machine',get:s=>s.first,act:'first'},{choose:[['add3','add 3'],['double','double'],['square','square']],label:'Second machine',get:s=>s.second,act:'second'},{range:'x',label:'x',min:0,max:6,get:s=>s.x,act:'x'}],
 on:{first(s,v){s.first=v},second(s,v){s.second=v},x(s,v){s.x=v}},
 draw(s,f,X){
  const A=IN_MACH[s.first],B=IN_MACH[s.second],m=A.f(s.x),r=B.f(m),rev=A.f(B.f(s.x)),u=X.try?1:clamp(s.u,0,1);
  let out=heading(`${s.second}(${s.first}(${s.x})) = ${r}`);
  const chip=(x,v,on)=>R(x-34,124,68,44,on?C.amberp:'#fff',on?C.amber:C.blue,22)+TB(x,152,v,18,C.ink);
  const mach=(x,M,i)=>R(x-62,104,124,84,C.dark,'none',14)+TB(x,140,M.l,17,'#fff')+TF(x,164,i,13,'#9fb6c4');
  out+=arrow(84,146,148,146,C.line,2.5)+arrow(272,146,316,146,C.line,2.5)+arrow(384,146,428,146,C.line,2.5);
  out+=chip(50,s.x,u<.25)+mach(210,A,'first')+chip(350,m,u>=.25&&u<.6)+mach(490,B,'second');
  out+=TF(50,186,'x',13,C.muted)+TF(350,186,'in between',13,C.muted);
  out+=R(200,214,200,46,u>=.6?C.amberp:'#fff',u>=.6?C.amber:C.green,10)+TB(300,243,'result: '+r,18,C.green);
  out+=P('M552 146H570V237H400',C.line,2.5)+`<polygon points="400,237 409,232 409,242" fill="${C.line}"/>`;
  out+=R(40,284,520,60,'#f4f8fb',C.grid,10)+TF(300,306,'reverse the order:',13,C.muted)+TMF(300,330,`${s.first}(${s.second}(${s.x})) = ${rev}`,15,rev===r?C.green:C.coral,'middle','font-weight="700"');
  return {svg:out,phase:`${s.first}(${s.x}) = ${m}, then ${s.second}(${m}) = ${r}. In the other order the answer is ${rev}${rev===r?', the same here, but that is a coincidence of these functions.':': composition is not usually commutative.'}`};
 }});

/* ===== Call stack lesson ===== */
SCENE({id:'stack-frame-locals',name:'Frames and return addresses',tag:'Every call gets its own frame',
 definition:'Each function call gets its own frame on the call stack, holding its parameters, its local variables and the place to return to when it finishes.',
 example:'sumsq(3, 4) calls sq(3) and then sq(4). Each sq call has its own x and y; when one returns, its frame and its variables vanish.',
 desc:'A small program beside the call stack; each frame lists its local variables and the line it will return to, and partial results appear as calls return.',
 dur:14,hint:'Choose a and b, then step through. Notice that the two sq calls never share their x or y.',
 init:()=>({a:3,b:4}),
 ui:[{range:'a',label:'a',min:0,max:9,get:s=>s.a,act:'a'},{range:'b',label:'b',min:0,max:9,get:s=>s.b,act:'b'}],
 on:{a(s,v){s.a=v},b(s,v){s.b=v}},
 trace(s){const {a,b}=s,A=a*a,B=b*b,M={fn:'main program',vars:'(no local variables)',ret:''},S=p=>({fn:`sumsq(${a}, ${b})`,vars:`a = ${a}, b = ${b}`+(p?', '+p:''),ret:'back to line 6'}),Q=(x,y,which)=>({fn:`sq(${x})`,vars:`x = ${x}`+(y!==undefined?`, y = ${y}`:''),ret:`back to line 5 (${which})`});
  return [
   {line:5,stack:[M],out:[],say:`main reaches print(sumsq(${a}, ${b})) and must call sumsq first.`},
   {line:4,stack:[M,S()],out:[],say:`sumsq gets a frame holding a = ${a} and b = ${b}, and remembers to return to line 6.`},
   {line:1,stack:[M,S(),Q(a,undefined,'first sq')],out:[],say:`sumsq calls sq(${a}). A new frame: x = ${a}. It remembers to return to the left half of line 5.`},
   {line:2,stack:[M,S(),Q(a,A,'first sq')],out:[],say:`y = ${a} × ${a} = ${A} is a local variable of this sq call only.`},
   {line:4,stack:[M,S(`sq(a) = ${A}`)],out:[],say:`sq returns ${A}. Its frame, with its x and y, is popped. sumsq carries on with the right half.`},
   {line:1,stack:[M,S(`sq(a) = ${A}`),Q(b,undefined,'second sq')],out:[],say:`sumsq calls sq(${b}): a brand-new frame with its own x = ${b}.`},
   {line:2,stack:[M,S(`sq(a) = ${A}`),Q(b,B,'second sq')],out:[],say:`y = ${b} × ${b} = ${B}, in this frame only.`},
   {line:4,stack:[M,S(`sq(a) = ${A}, sq(b) = ${B}`)],out:[],say:`sq returns ${B} and is popped. sumsq adds ${A} + ${B} = ${A+B}.`},
   {line:5,stack:[M],out:[String(A+B)],say:`sumsq returns ${A+B} to line 6 and is popped; main prints ${A+B}.`}]},
 draw(s,f){
  let out=heading('Each call: its own variables, its own way back');
  out+=IN_code(['def sq(x):','    y = x * x','    return y','def sumsq(a, b):','    return sq(a) + sq(b)',`print(sumsq(${s.a}, ${s.b}))`],f.line,16,52,262,30,15);
  out+=R(16,260,262,60,C.dark,'none',8)+TF(28,278,'output',13,'#b9c9d3','start');f.out.forEach(o=>out+=TM(28,306,'> '+o,17,'#fff','start'));
  out+=L(300,350,590,350,C.ink,2.5)+TF(445,368,'bottom of the stack',13,C.muted);
  f.stack.forEach((fr,i)=>{const y=350-(i+1)*72,top=i===f.stack.length-1;
   out+=R(300,y+4,290,66,top?C.amberp:C.pale,top?C.amber:C.line,8)+TBF(312,y+24,fr.fn,15,C.ink,'start');
   if(fr.vars)out+=TMF(312,y+44,fr.vars.length>34?fr.vars.slice(0,33)+'…':fr.vars,13,C.ink,'start');
   if(fr.ret)out+=TF(312,y+62,'↩ '+fr.ret,13,C.purple,'start')});
  return {svg:out,phase:f.say};
 }});

const IN_LIMIT=9;
SCENE({id:'stack-overflow',name:'Stack overflow',tag:'When the calls never stop',
 definition:'A stack overflow happens when calls are pushed faster than they return until the call stack runs out of room, usually because a recursive function has no reachable base case.',
 example:'countdown(n) that prints n and calls countdown(n − 1) without “if n == 0: return” never stops calling. Python gives up after about 1000 frames with a RecursionError.',
 desc:'A recursive countdown program beside the call stack, which grows towards a dashed limit line; with the base case the frames unwind, without it they hit the limit.',
 dur:13,hint:'Switch the base case off and on, choose n, then Step or Run. This demo stack has room for 9 frames.',
 init:()=>({base:false,n:3}),
 ui:[{choose:[[1,'With base case'],[0,'No base case']],label:'Base case',get:s=>s.base?1:0,act:'base'},{range:'n',label:'n',min:1,max:6,get:s=>s.n,act:'n'}],
 on:{base(s,v){s.base=Number(v)===1},n(s,v){s.n=v}},
 trace(s){const fr=[],stack=[],out=[];let n=s.n;
  for(;;){stack.push(n);
   if(s.base&&n===0){fr.push({stack:stack.slice(),out:out.slice(),line:1,say:'countdown(0) hits the base case and returns at once, without another call.'});break}
   out.push(n);fr.push({stack:stack.slice(),out:out.slice(),line:3,say:`countdown(${n}) prints ${n} and calls countdown(${n-1}). Its frame waits on the stack.`});
   if(stack.length>=IN_LIMIT){fr.push({stack:stack.slice(),out:out.slice(),line:3,overflow:true,say:`There is no room for another frame: stack overflow. Without a base case the numbers just keep going: ${n-1}, ${n-2}, …`});return fr}
   n--}
  while(stack.length){const m=stack.pop();fr.push({stack:stack.slice(),out:out.slice(),line:-1,say:`countdown(${m}) finishes and its frame is popped.`})}
  fr[fr.length-1].say='Every frame has returned: the stack is empty again. The base case is what made the calls stop.';fr[fr.length-1].done=true;
  return fr},
 draw(s,f){
  let out=heading(s.base?'With a base case':'Without a base case (line 2 removed)');
  out+=IN_code(['def countdown(n):','    if n == 0: return','    print(n)','    countdown(n - 1)',`countdown(${s.n})`],f.line,16,52,270,32,16);
  if(!s.base)out+=L(48,107,250,107,C.coral,2.5);
  out+=R(16,236,270,54,C.dark,'none',8)+TF(28,253,'output',13,'#b9c9d3','start')+TMF(28,278,f.out.join(' '),15,'#fff','start');
  const fh=30,base=352,top=base-IN_LIMIT*fh;
  out+=L(320,base,580,base,C.ink,2.5)+L(320,top,580,top,C.coral,2,'stroke-dasharray="6 5"')+TF(580,top-6,'stack limit',13,C.coral,'end');
  f.stack.forEach((n,i)=>{const y=base-(i+1)*fh,topF=i===f.stack.length-1;out+=R(330,y+2,240,fh-4,f.overflow?C.coralp:topF?C.amberp:C.pale,f.overflow?C.coral:topF?C.amber:C.line,6)+TMF(450,y+20,`countdown(n = ${n})`,13,C.ink)});
  if(f.overflow)out+=R(16,298,270,54,C.coralp,C.coral,10)+TBF(151,321,'Stack overflow',16,C.coral)+TF(151,341,'RecursionError in Python',13,C.ink);
  else out+=counter(16,300,'frames on the stack',f.stack.length,C.blue,170);
  return {svg:out,phase:f.say};
 }});

/* ===== Recursion lesson ===== */
function IN_branches(depth,ang){const segs=[],a=ang*Math.PI/180;
 (function br(x,y,dir,len,d,par){const i=segs.length,x2=x+len*Math.sin(dir),y2=y-len*Math.cos(dir);segs.push({x1:x,y1:y,x2,y2,d,par,len});if(d>0){br(x2,y2,dir-a,len*.68,d-1,i);br(x2,y2,dir+a,len*.68,d-1,i)}})(215,352,0,92,depth,-1);
 return segs}
SCENE({id:'recursion-tree',name:'Recursion trees',tag:'Calls that branch',
 definition:'When a function calls itself more than once, its calls form a tree: each call is a node and its recursive calls are its children. The total number of calls can grow very quickly.',
 example:'branch(length, depth) draws a line, then calls branch twice for two shorter branches. Depth 4 makes 1 + 2 + 4 + 8 + 16 = 31 calls.',
 desc:'A fractal tree drawn one recursive call at a time; the current call is highlighted, the calls still waiting on the stack are shaded, and counters show calls made and stack depth.',
 dur:16,hint:'Choose the depth and the angle, then Run. Each branch is one call; the shaded path is the call stack at that moment.',
 init:()=>({depth:4,ang:30}),
 ui:[{range:'depth',label:'Depth',min:0,max:6,get:s=>s.depth,act:'depth'},{range:'ang',label:'Angle',min:10,max:60,step:5,get:s=>s.ang,act:'ang',show:v=>v+'°'}],
 on:{depth(s,v){s.depth=v},ang(s,v){s.ang=v}},
 trace(s){const segs=IN_branches(s.depth,s.ang),fr=segs.map((g,k)=>({k,say:g.d===0?`Call ${k+1}: depth 0, a leaf. This is the base case: draw it and return without calling again.`:`Call ${k+1}: draw a branch of length ${Math.round(g.len)}, then call branch twice for depth ${g.d-1}. The second call waits until the first has finished.`}));
  fr.push({k:segs.length-1,done:true,say:`Finished: ${segs.length} calls, which is 2${'⁰¹²³⁴⁵⁶⁷'[s.depth+1]} − 1. Adding one level of depth doubles the work.`});return fr},
 draw(s,f){
  const segs=IN_branches(s.depth,s.ang),path=new Set();let p=f.done?-1:f.k;while(p>=0){path.add(p);p=segs[p].par}
  let out=heading(`branch(depth ${s.depth})`);
  segs.slice(0,f.k+1).forEach((g,i)=>{const cur=i===f.k&&!f.done,inP=path.has(i);out+=L(g.x1,g.y1,g.x2,g.y2,cur?C.coral:inP?C.amber:g.d===0?C.green:C.dark,cur||inP?Math.max(3,1.5+g.d*1.4):1+g.d*1.2)});
  const total=segs.length,cur=segs[f.k];
  out+=counter(440,60,'calls made',`${f.k+1} of ${total}`,C.blue,145)+counter(440,122,'stack depth',f.done?0:s.depth-cur.d+1,C.amber,145);
  out+=R(440,190,145,58,'#fff',C.grid,8)+TF(512,210,'current call',13,C.muted)+TMF(512,236,f.done?'(finished)':`branch(${Math.round(cur.len)}, ${cur.d})`,14,C.coral);
  out+=TF(512,282,'coral: running now',13,C.coral)+TF(512,302,'amber: waiting',13,C.amber)+TF(512,322,'green: leaves',13,C.green);
  return {svg:out,phase:f.say};
 }});

function IN_hanoiMoves(n){const m=[];(function mv(k,a,b,c){if(!k)return;mv(k-1,a,c,b);m.push([a,c,k]);mv(k-1,b,a,c)})(n,0,1,2);return m}
const IN_PEG='ABC',IN_DISKC=[C.coral,C.amber,C.green,C.blue,C.purple,C.dark];
const IN_freshPegs=n=>[range(n).map(i=>n-i),[],[]];
SCENE({id:'towers-of-hanoi',name:'Towers of Hanoi',tag:'A recursive plan for a puzzle',
 definition:'Move a tower of disks from peg A to peg C, one disk at a time, never putting a larger disk on a smaller one. Recursively: move the top n − 1 out of the way, move the largest, then move the n − 1 back on top.',
 example:'3 disks take 7 moves; 4 disks take 15. Each extra disk doubles the moves plus one: 2ⁿ − 1.',
 desc:'Three pegs with coloured disks; the recursive solution moves one disk per step, or you can move disks yourself by pressing pegs.',
 dur:16,hint:'Watch the recursion solve it, or choose “Play yourself” and press a peg to pick up its top disk, then another peg to drop it.',
 init:()=>({n:3,mode:'solve',pegs:IN_freshPegs(3),held:null,moves:0}),
 ui:[{choose:[['solve','Watch the recursion'],['play','Play yourself']],label:'Mode',get:s=>s.mode,act:'mode'},{range:'n',label:'Disks',min:1,max:6,get:s=>s.n,act:'n'}],
 on:{mode(s,v){s.mode=v;s.pegs=IN_freshPegs(s.n);s.held=null;s.moves=0},n(s,v){s.n=v;s.pegs=IN_freshPegs(v);s.held=null;s.moves=0},
  peg(s,i){if(s.mode!=='play')return 'keep';i=Number(i);const P=s.pegs;
   if(s.held===null){if(P[i].length)s.held=i}else{const d=P[s.held][P[s.held].length-1],top=P[i][P[i].length-1];if(i!==s.held&&(top===undefined||top>d)){P[i].push(P[s.held].pop());s.moves++}s.held=null}}},
 trace(s){if(s.mode==='play')return [{play:true}];
  const pegs=IN_freshPegs(s.n),fr=[{pegs:pegs.map(p=>p.slice()),k:0,say:`Goal: move all ${s.n} disk${s.n>1?'s':''} from A to C. To move ${s.n}, first move the top ${s.n-1} out of the way to B.`}];
  IN_hanoiMoves(s.n).forEach(([a,c,d],i)=>{pegs[c].push(pegs[a].pop());fr.push({pegs:pegs.map(p=>p.slice()),k:i+1,mv:[a,c],disk:d,say:d===s.n?`Move ${i+1}: the largest disk goes from ${IN_PEG[a]} to ${IN_PEG[c]}. Now the ${s.n-1} smaller disks follow it, by the same plan.`:`Move ${i+1}: disk ${d} from ${IN_PEG[a]} to ${IN_PEG[c]}${d===1?'':` (the middle step of moving ${d} disks)`}.`})});
  fr[fr.length-1].say+=` Done in ${(1<<s.n)-1} moves, the minimum possible.`;return fr},
 draw(s,f,X){
  const pegs=f.play?s.pegs:f.pegs,moves=f.play?s.moves:f.k,min=(1<<s.n)-1;let out=heading(f.play?'Your turn: move the tower to C':`Moving ${s.n} disk${s.n>1?'s':''} from A to C`);
  const px=[120,300,480],base=318;
  pegs.forEach((p,i)=>{const lifted=f.play&&s.held===i;
   if(lifted)out+=R(px[i]-88,90,176,236,C.amberp,C.amber,10);
   out+=R(px[i]-5,130,10,base-130,C.line,'none',4);
   p.forEach((d,j)=>{const w=36+d*22,y=base-(j+1)*22-(lifted&&j===p.length-1?44:0),mv=!f.play&&f.mv&&f.mv[1]===i&&j===p.length-1;out+=R(px[i]-w/2,y,w,20,IN_DISKC[(d-1)%6],mv?C.ink:'none',8)+TF(px[i],y+15,d,13,'#fff','middle','font-weight="700"')});
   out+=TB(px[i],344,IN_PEG[i],16,C.ink);
   // The press target sits on top of the peg and its disks so any part of the peg can be pressed.
   out+=hit(X,'peg',i,`Peg ${IN_PEG[i]}: ${p.length} disks. ${s.held===null?'Press to pick up its top disk.':'Press to drop the disk here.'}`,R(px[i]-88,90,176,236,'transparent','none',10))});
  out+=R(30,base,540,8,C.dark,'none',4);
  out+=counter(30,48,'moves',`${moves}`,C.blue,110)+counter(460,48,'minimum',min,C.green,110);
  const won=pegs[2].length===s.n;
  if(won&&(f.play||f.k===min))out+=R(190,52,220,36,C.greenp,C.green,10)+TBF(300,75,f.play?(moves===min?'Solved in the minimum!':`Solved in ${moves} moves`):'Solved',15,C.green);
  return {svg:out,phase:f.play?(won?`Solved in ${moves} moves; the recursive plan needs ${min}.`:s.held===null?'Press a peg to pick up its top disk.':`Holding disk ${s.pegs[s.held][s.pegs[s.held].length-1]}. Press another peg to drop it; it must not go on a smaller disk.`):f.say};
 }});

// 3D: the recursion's call stack over time as a skyline: time runs left to right, height is stack depth.
SCENES.recursion.three=(s,f,X,project)=>{
 const fr=SCENES.recursion.trace(s),K=fr.length,cur=X.k,P=project([[0,0,0],[K,1,0],[0,0,s.n+.5],[K,1,s.n+.5]]);
 const faces=[];fr.forEach((g,t)=>{for(let j=0;j<g.depth;j++)faces.push(...prism(t+.1,0,j,.8,.8,.92,t===cur?C.coral:t<cur?C.blue:'#c9d8e2'))});
 let out=paintFaces(faces,P);const a=P([K/2,-.9,0]),b=P([-.6,0,s.n/2+.5]);
 out+=label3(a[0],a[1]+8,'time (steps) →',14,C.muted)+label3(b[0]-20,b[1],'stack depth',14,C.muted);
 return {svg:out,title:'The call stack over time',caption:`Each column is one step; its height is how many factorial frames are on the stack. The stack climbs to ${s.n} at the base case, then falls as each call returns.`};
};
