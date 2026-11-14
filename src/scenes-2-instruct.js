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
 example:'After x = 3 and then y = x, y holds its own copy of 3. Changing x later to 5 does not change y.',
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
