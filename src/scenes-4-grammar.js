/* ===================== Language era 4 · Grammar (1957–2000) ===================== */
// Shared helpers for this era (prefix L4_).
const L4_mean=a=>a.length?sum(a)/a.length:0;
const L4_nx=v=>(v*48271)%2147483647||1;
const L4_ms=v=>Math.round(v*1000)+' ms';
const L4_FONT='font-family="Noto Sans, Segoe UI, Segoe UI Symbol, sans-serif"';
// A plot frame: ranges [lo,hi]; ticks as [value,label]. Returns {svg,X,Y}.
function L4_plot(x,y,w,h,[x0,x1],[y0,y1],xt,yt,xl,yl){
 const X=v=>x+w*clamp((v-x0)/(x1-x0),0,1),Y=v=>y+h-h*clamp((v-y0)/(y1-y0),0,1);
 let s=R(x,y,w,h,'#fff',C.grid,6);
 for(const [v,l] of yt)s+=L(x,Y(v),x+w,Y(v),'#eef3f6',1)+TF(x-7,Y(v)+5,l,13,C.muted,'end');
 for(const [v,l] of xt)s+=L(X(v),y+h,X(v),y+h+5,C.line,1.5)+TF(X(v),y+h+18,l,13,C.muted);
 if(xl)s+=TF(x+w/2,y+h+35,xl,13,C.muted);
 if(yl)s+=TF(x-44,y+h/2,yl,13,C.muted,'middle',`transform="rotate(-90 ${fmt(x-44)} ${fmt(y+h/2)})"`);
 return {svg:s,X,Y};
}
// A response button drawn inside the diagram.
const L4_key=(X,act,arg,label,x,y,w,h,text,on=false,col=C.blue,size=14)=>hit(X,act,arg,label,R(x,y,w,h,on?C.pale:'#fff',on?col:C.line,8)+TBF(x+w/2,y+h/2+5,text,size,C.ink));
// Split a long line at spaces so each piece has at most n characters.
function L4_wrap(s,n){const out=[];let cur='';for(const w of s.split(' ')){if(cur&&(cur+' '+w).length>n){out.push(cur);cur=w}else cur=cur?cur+' '+w:w}if(cur)out.push(cur);return out}
const L4_lines=(x,y,lines,size=13,fill=C.ink,anchor='start',gap=19,extra='')=>lines.map((l,i)=>TF(x,y+i*gap,l,size,fill,anchor,extra)).join('');

/* ---- Trees: a node is [label, child, child…]; a child is a node or a word (string). ---- */
const L4_isLeaf=n=>typeof n==='string';
const L4_pre=n=>n.slice(1).every(L4_isLeaf);
const L4_words=n=>L4_isLeaf(n)?[n]:n.slice(1).flatMap(L4_words);
function L4_h(n){return L4_pre(n)?0:1+Math.max(...n.slice(1).filter(k=>!L4_isLeaf(k)).map(L4_h))}
// x positions for a row of words, spaced by their length.
function L4_xs(ws,x0=30,x1=570){const w=ws.map(s=>s.length+3),t=sum(w);let acc=0;return w.map(v=>{const c=x0+(x1-x0)*(acc+v/2)/t;acc+=v;return c})}
// Draw a tree bottom-up: preterminals on the yBase line, words under them, each level dy higher. o.hl: nodes to highlight.
function L4_tree(n,xs,i0,yBase,dy,o={}){
 const hl=o.hl||[],col=hl.includes(n)?C.coral:C.blue,ws=o.wsize||14;
 if(L4_pre(n)){
  const kids=n.slice(1),x=L4_mean(kids.map((_,j)=>xs[i0+j]));let s='';
  kids.forEach((w,j)=>{s+=L(x,yBase+5,xs[i0+j],yBase+18,C.line,1.2,'stroke-dasharray="3 3"')+TF(xs[i0+j],yBase+34,w,ws,hl.includes(n)?C.coral:C.ink,'middle',L4_FONT)});
  return {svg:s+TBF(x,yBase,n[0],13,col),x,y:yBase,n:kids.length};
 }
 let s='',i=i0;const cs=[];
 for(const k of n.slice(1)){const r=L4_tree(k,xs,i,yBase,dy,o);r.node=k;cs.push(r);i+=r.n}
 const x=L4_mean(cs.map(c=>c.x)),y=yBase-L4_h(n)*dy;
 cs.forEach(c=>{const on=hl.includes(c.node);s+=L(x,y+5,c.x,c.y-15,on?C.coral:C.line,on?3:1.8)});
 return {svg:s+cs.map(c=>c.svg).join('')+TBF(x,y,n[0],14,col),x,y,n:i-i0};
}

/* ======================= Lesson: syntax-trees ======================= */
const L4_RULES={'Adj+N':'N′','Adj+N′':'N′','Det+N':'NP','Det+N′':'NP','V+NP':'VP','NP+VP':'S','P+NP':'PP'};
const L4_SENTS={
 dog:{words:[['Det','the'],['Adj','small'],['N','dog'],['V','chased'],['Det','a'],['N','cat']],seq:[1,0,2,1,0]},
 child:{words:[['Det','a'],['Adj','clever'],['N','child'],['V','read'],['Det','the'],['Adj','old'],['N','book']],seq:[1,0,3,2,1,0]}};
function L4_join(items,k){const a=items[k],b=items[k+1],r=L4_RULES[a[0]+'+'+b[0]];if(!r)return null;const out=items.slice();out.splice(k,2,[r,a,b]);return out}
function L4_mergeState(key,k){let items=L4_SENTS[key].words.map(w=>w.slice());for(const j of L4_SENTS[key].seq.slice(0,k))items=L4_join(items,j);return items}
SCENE({id:'syntax-trees',name:'Build a sentence by merging',tag:'Phrase structure',
 definition:'Sentences are not just strings of words. Words group into phrases, phrases into bigger phrases, and the whole forms a tree. In Noam Chomsky’s Syntactic Structures (1957) rules such as S → NP VP describe the tree; his later Minimalist Program (1995) reduces tree-building to one operation, Merge, which joins two units into a new one.',
 example:'“the small dog” is one unit (a noun phrase): you can replace it with “it”. “dog chased” is not a unit, even though the two words sit side by side.',
 research:'Chomsky, N. (1957). Syntactic Structures. Mouton; Chomsky, N. (1995). The Minimalist Program. MIT Press. Phrase structure itself is common ground; theories differ on the details of the labels.',
 desc:'Words with their word classes sit along the bottom; pressing a plus sign between two neighbouring units merges them into a labelled phrase if a rule allows it, growing a tree up to a single S.',
 dur:11,hint:'Press a + between two neighbouring units to merge them. A merge works only if a rule joins their labels (shown at the top). Keep going until one S covers the sentence.',
 init:()=>({key:'dog',items:L4_mergeState('dog',0),hist:[],msg:''}),
 watch(p){const k=Math.min(5,Math.floor(p*6.5));return {key:'dog',items:L4_mergeState('dog',k),hist:[],msg:''}},
 ui:[{choose:[['dog','the small dog…'],['child','a clever child…']],label:'Sentence',get:s=>s.key,act:'key'},{b:'Undo',act:'undo'}],
 on:{key(s,v){s.key=v;s.items=L4_mergeState(v,0);s.hist=[];s.msg=''},
  undo(s){if(s.hist.length){s.items=s.hist.pop();s.msg=''}},
  join(s,k){k=Number(k);const a=s.items[k],b=s.items[k+1];if(!a||!b)return;const r=L4_join(s.items,k);
   if(r){s.hist.push(s.items);s.items=r;s.msg=`${a[0]} + ${b[0]} → ${r[k][0]}`}else s.msg=`No rule joins ${a[0]} and ${b[0]} here`}},
 draw(s,f,X){
  const ws=s.items.flatMap(L4_words),xs=L4_xs(ws,30,570),yBase=286;
  let out=heading(s.items.length===1&&s.items[0][0]==='S'?'One tree: the whole sentence is an S':'Merge neighbours into phrases');
  out+=TF(300,56,'Rules: Det + N → NP · Adj + N → N′ · V + NP → VP · NP + VP → S',13,C.muted);
  let i=0;const ends=[];
  for(const it of s.items){const r=L4_tree(it,xs,i,yBase,52);out+=r.svg;ends.push([xs[i],xs[i+r.n-1]]);i+=r.n}
  for(let k=0;k+1<s.items.length;k++){const x=(ends[k][1]+ends[k+1][0])/2,ok=!!L4_RULES[s.items[k][0]+'+'+s.items[k+1][0]];
   out+=hit(X,'join',k,`Merge ${s.items[k][0]} with ${s.items[k+1][0]}`,Ci(x,352,12,'#fff',X.try?C.blue:(ok?C.blue:C.line))+TBF(x,357,'+',15,C.blue))}
  if(s.msg)out+=TF(300,84,s.msg,14,/^No/.test(s.msg)?C.coral:C.green);
  const done=s.items.length===1&&s.items[0][0]==='S';
  return {svg:out,phase:done?'Each merge made one bigger unit from two smaller ones. The subject noun phrase and the verb phrase meet only at the very top: the verb and its object form a unit, the subject and verb do not.':s.msg&&/^No/.test(s.msg)?'Not every pair of neighbours can merge: words join only into units the grammar allows. Try another +.':'Adjective and noun first, then the determiner, then verb and object, then subject and verb phrase.'};
 }});

// Two readings for each ambiguous phrase: a tree and the nodes to highlight.
function L4_ambig(){
 const tel=()=>['PP',['P','with'],['NP',['Det','the'],['N','telescope']]];
 const ppV=tel(),ppN=tel(),man1=['NP',['Det','the'],['N','man']],manN=['NP',['NP',['Det','the'],['N','man']],ppN];
 const old1=['NP',['N','men'],['Conj','and'],['N','women']],old2=['NP',['Adj','old'],['N','men']];
 return {
  tele:{label:'I saw the man with the telescope',a:{name:'Attach to the verb',tree:['S',['NP',['Pron','I']],['VP',['V','saw'],man1,ppV]],hl:[ppV],mean:['The telescope is what I saw him with:','I looked through it.']},
   b:{name:'Attach to the noun',tree:['S',['NP',['Pron','I']],['VP',['V','saw'],manN]],hl:[manN,ppN],mean:['The telescope belongs to the man:','I saw the man who had it.']}},
  old:{label:'old men and women',a:{name:'old [men and women]',tree:['NP',['Adj','old'],old1],hl:[old1],mean:['Both the men and the women are old.']},
   b:{name:'[old men] and women',tree:['NP',old2,['Conj','and'],['NP',['N','women']]],hl:[old2],mean:['Only the men are old; the women','can be any age.']}}};
}
const L4_AMB=L4_ambig();
SCENE({id:'syntax-trees-ambiguity',name:'One string, two trees',tag:'Structural ambiguity',
 definition:'The same words can be grouped in two ways, and each grouping means something different. This is structural ambiguity: the words are not ambiguous on their own, the tree is. It is strong evidence that hearers build structure, not just a chain of words.',
 example:'“I saw the man with the telescope”: if the phrase “with the telescope” joins the verb, it says how I saw; if it joins “the man”, it says which man.',
 research:'Chomsky, N. (1957). Syntactic Structures (constituent structure and ambiguity); Altmann, G. & Steedman, M. (1988). Interaction with context during human sentence processing. Cognition 30, 191–238 (context decides which attachment readers prefer).',
 desc:'Two possible trees for an ambiguous phrase, with the attached phrase and its attachment point highlighted, and the meaning each tree gives.',
 dur:10,hint:'Choose a phrase and switch between the two readings. Watch which node the highlighted phrase hangs from.',
 init:()=>({k:'tele',r:'a'}),
 watch(p){const q=Math.floor(p*4);return {k:q<2?'tele':'old',r:q%2?'b':'a'}},
 ui:[{choose:[['tele','with the telescope'],['old','old men and women']],label:'Phrase',get:s=>s.k,act:'k'},{choose:[['a','Reading 1'],['b','Reading 2']],label:'Reading',get:s=>s.r,act:'r'}],
 on:{k(s,v){s.k=v},r(s,v){s.r=v}},
 draw(s){
  const A=L4_AMB[s.k],rd=A[s.r],ws=L4_words(rd.tree),xs=L4_xs(ws,40,560),tall=s.k==='tele';
  let out=heading(`${s.r==='a'?'Reading 1':'Reading 2'}: ${rd.name}`,26);
  out+=L4_tree(rd.tree,xs,0,tall?256:226,tall?38:50,{hl:rd.hl}).svg;
  out+=R(80,312,440,56,C.coralp,'none',10)+L4_lines(300,334,rd.mean,14,C.ink,'middle',20);
  return {svg:out,phase:`Same words, different tree: ${rd.mean.join(' ')}`};
 }});

// Constituency tests on one sentence. ok: the result is a grammatical sentence of English.
const L4_TESTN=['Use a pro-form','Move to the front','Answer a question'];
const L4_TESTS=[
 {s:'the long report',from:3,to:5,r:[['The student read it on Monday.',1],['The long report, the student read on Monday.',1],['What did the student read? — The long report.',1]]},
 {s:'on Monday',from:6,to:7,r:[['The student read the long report then.',1],['On Monday, the student read the long report.',1],['When did the student read it? — On Monday.',1]]},
 {s:'read the long report',from:2,to:5,r:[['The student did so on Monday.',1],['Read the long report, the student did, on Monday.',1],['What did the student do? — Read the long report.',1]]},
 {s:'student read',from:1,to:2,r:[['The it the long report on Monday.',0],['Student read, the the long report on Monday.',0],['No question has “student read” as its answer.',0]]},
 {s:'long report on',from:4,to:6,r:[['The student read the it Monday.',0],['Long report on, the student read the Monday.',0],['No question has “long report on” as its answer.',0]]}];
const L4_TW='The student read the long report on Monday'.split(' ');
SCENE({id:'syntax-trees-tests',name:'Is it a unit? Test it',tag:'Constituency tests',
 definition:'Linguists check which strings of words form a unit (a constituent) by testing them: can the string be replaced by a single pro-form such as “it” or “then”, moved as a block, or used alone as the answer to a question? Units pass; strings that cut across the tree fail.',
 example:'“the long report” passes all three tests; “student read” fails all three, even though both are strings of neighbouring words.',
 research:'Bloomfield, L. (1933). Language. Holt (immediate constituents); Wells, R. S. (1947). Immediate constituents. Language 23, 81–117; Carnie, A. (2013). Syntax: A Generative Introduction, 3rd edn. Wiley-Blackwell. Textbook tests; no single test is perfect, so several are used together.',
 desc:'A sentence with one string highlighted, the result of applying a chosen test to it with a grammatical or ungrammatical verdict, and a grid that fills in as strings and tests are tried.',
 dur:12,hint:'Choose a string and a test, or press a cell in the grid. A string that passes the tests behaves as one unit of the tree.',
 init:()=>({i:0,t:0,seen:['0,0']}),
 watch(p){const n=Math.min(14,Math.floor(p*15)),seen=range(n+1).map(q=>`${Math.floor(q/3)},${q%3}`);return {i:Math.floor(n/3),t:n%3,seen}},
 ui:[{choose:L4_TESTS.map((d,i)=>[i,d.s]),label:'String',get:s=>s.i,act:'i'},{choose:L4_TESTN.map((n,i)=>[i,n]),label:'Test',get:s=>s.t,act:'t'}],
 on:{i(s,v){s.i=Number(v);s.seen=[...new Set(s.seen.concat(`${s.i},${s.t}`))]},t(s,v){s.t=Number(v);s.seen=[...new Set(s.seen.concat(`${s.i},${s.t}`))]},
  cell(s,a){const [i,t]=String(a).split(',').map(Number);s.i=i;s.t=t;s.seen=[...new Set(s.seen.concat(`${i},${t}`))]}},
 draw(s,f,X){
  const d=L4_TESTS[s.i],[res,ok]=d.r[s.t],xs=L4_xs(L4_TW,70,530);
  let out=heading(`Test: ${L4_TESTN[s.t].toLowerCase()}`);
  out+=R(xs[d.from]-34,58,xs[d.to]-xs[d.from]+68,34,C.amberp,'none',8);
  L4_TW.forEach((w,j)=>out+=T(xs[j],81,w,16,j>=d.from&&j<=d.to?C.ink:C.muted));
  out+=TF(300,124,res,15,ok?C.ink:C.coral,'middle',ok?'':'text-decoration="line-through"');
  out+=R(250,136,100,28,ok?C.greenp:C.coralp,'none',14)+TBF(300,155,ok?'✓ works':'✗ fails',14,ok?C.green:C.coral);
  const gx=232,cw=116,gy=188,rh=30;
  L4_TESTN.forEach((n,t)=>out+=TF(gx+cw*t+cw/2,gy-4,n,13,t===s.t?C.ink:C.muted));
  L4_TESTS.forEach((row,i)=>{const y=gy+6+i*rh;out+=TF(gx-12,y+20,row.s,13,i===s.i?C.ink:C.muted,'end');
   row.r.forEach((c,t)=>{const tried=s.seen.includes(`${i},${t}`),on=i===s.i&&t===s.t;
    out+=hit(X,'cell',`${i},${t}`,`${row.s}, ${L4_TESTN[t]}`,R(gx+cw*t+4,y+2,cw-8,rh-6,on?C.pale:'#fff',on?C.blue:C.grid,6)+TBF(gx+cw*t+cw/2,y+21,tried?(c[1]?'✓':'✗'):'?',14,tried?(c[1]?C.green:C.coral):C.line))})});
  return {svg:out,phase:ok?`“${d.s}” survives this test: it behaves as one unit.`:`“${d.s}” fails: these words are neighbours in the string but not a unit in the tree.`};
 }});

/* ======================= Lesson: recursion ======================= */
// Who did what: flea bothered dog, dog chased cat, cat bit rat, rat ate malt.
function L4_emb(type,d){const N=['flea','dog','cat','rat'],V=['bothered','chased','bit','ate'],w=[],dep=[];
 if(type==='centre'){const np={};for(let k=3;k>=3-d;k--){w.push('the',N[k]);np[k]=w.length-1}for(let k=3-d;k<=3;k++){dep.push([np[k],w.length]);w.push(V[k])}}
 else{const s0=3-d;w.push('the',N[s0]);dep.push([w.length-1,w.length]);w.push(V[s0]);for(let k=s0+1;k<=3;k++){w.push('the',N[k]);const np=w.length-1;w.push('that');dep.push([np,w.length]);w.push(V[k])}}
 w.push('the','malt');return {w,dep}}
const L4_load=(e,i)=>e.dep.filter(([a,b])=>a<=i&&i<b).length;
SCENE({id:'recursion',name:'Phrases inside phrases',tag:'Recursion and memory',
 definition:'Recursion lets a phrase contain another phrase of the same kind, without limit: a clause inside a clause inside a clause. Grammar allows any depth, but people do not cope with every kind equally. Branching to the right is easy; embedding in the centre quickly becomes impossible to follow, because each subject must be held in memory until its verb arrives.',
 example:'“the dog chased the cat that bit the rat that ate the malt” is easy. The same facts centre-embedded, “the rat the cat the dog chased bit ate the malt”, are grammatical but almost unreadable.',
 research:'Miller, G. A. & Chomsky, N. (1963). Finitary models of language users. In Handbook of Mathematical Psychology II; Gibson, E. (1998). Linguistic complexity: locality of syntactic dependencies. Cognition 68, 1–76; Karlsson, F. (2007). Constraints on multiple center-embedding of clauses. J. Linguistics 43 (corpora rarely go beyond two levels).',
 desc:'A sentence with arcs linking each subject noun to its verb, for right-branching or centre-embedded versions at a chosen depth, and bars under each word counting the subjects still waiting for their verb.',
 dur:12,hint:'Choose centre or right branching and raise the depth. Watch the arcs: centre embedding nests them, and the bars show how many subjects you must hold at once.',
 init:()=>({type:'centre',d:2}),
 watch(p){const q=Math.min(7,Math.floor(p*8));return {type:q<4?'right':'centre',d:q%4}},
 ui:[{choose:[['right','Right-branching'],['centre','Centre-embedded']],label:'Shape',get:s=>s.type,act:'type'},{range:'d',label:'Clauses inside',min:0,max:3,get:s=>s.d,act:'d',show:v=>String(v)}],
 on:{type(s,v){s.type=v},d(s,v){s.d=Number(v)}},
 draw(s){
  const e=L4_emb(s.type,s.d),n=e.w.length,xs=L4_xs(e.w,14,586),wy=176,size=n>14?13:14,cols=[C.blue,C.green,C.amber,C.coral];
  let out=heading(`${s.type==='centre'?'Centre-embedded':'Right-branching'}, ${s.d} clause${s.d===1?'':'s'} inside`);
  e.dep.forEach(([a,b],j)=>{const x1=xs[a],x2=xs[b],h=clamp(14+(x2-x1)*.32,16,108),y=wy-18,c=cols[(e.dep.length-1-j)%4];
   out+=P(`M${fmt(x1)} ${y} Q${fmt((x1+x2)/2)} ${fmt(y-h*1.6)} ${fmt(x2)} ${y}`,c,2.4)+Ci(x2,y,3.5,c)});
  e.w.forEach((w,i)=>out+=TF(xs[i],wy,w,size,e.dep.some(d=>d[0]===i)?C.ink:e.dep.some(d=>d[1]===i)?C.ink:C.muted,'middle',e.dep.some(d=>d[0]===i||d[1]===i)?'font-weight="700"':''));
  const base=300,u=22;let mx=0;
  e.w.forEach((w,i)=>{const l=L4_load(e,i);mx=Math.max(mx,l);if(l)out+=R(xs[i]-7,base-l*u,14,l*u,l>=3?C.coral:l===2?C.amber:C.blue,'none',3)});
  out+=L(14,base,586,base,C.line,1.5)+TF(20,base+20,'bars: subjects waiting for their verb at each word',13,C.muted,'start');
  out+=counter(330,318,'most held at once',String(mx),mx>=3?C.coral:C.blue,128)+counter(466,318,'words',String(n),C.ink,118);
  return {svg:out,phase:s.type==='centre'?(s.d>=2?`At the middle of the sentence ${mx} subjects are waiting for their verbs, and the verbs then arrive in reverse order. Grammar allows it; memory gives out.`:'One clause inside is fine: two subjects held, then two verbs.'):'Right-branching keeps every subject next to its verb, so at most one is ever waiting, however deep the sentence goes.'};
 }});

// Acceptability ratings, including the "missing verb" illusion (Gibson & Thomas 1999).
const L4_RITEMS=[
 {c:'right',s:'The dog chased the cat that bit the rat that ate the malt.'},
 {c:'right',s:'The nurse helped the clerk who called the patient who missed the bus.'},
 {c:'c1',s:'The rat the cat bit ate the malt.'},
 {c:'c1',s:'The patient the nurse helped missed the bus.'},
 {c:'c2',s:'The rat the cat the dog chased bit ate the malt.'},
 {c:'c2',s:'The patient the nurse the clerk called helped missed the bus.'},
 {c:'miss',s:'The rat the cat the dog chased ate the malt.'},
 {c:'miss',s:'The patient the nurse the clerk called missed the bus.'}];
const L4_RCOND=[['right','right-branching'],['c1','1 inside'],['c2','2 inside'],['miss','2 inside, a verb missing']];
const L4_RPUB={right:4.5,c1:3.8,c2:2.2,miss:2.6};
SCENE({id:'recursion-reading',name:'Rate the sentences',tag:'Be the participant',
 definition:'Acceptability ratings let linguists measure how natural sentences feel. Doubly centre-embedded sentences are rated poorly even though they are grammatical. Stranger still, if the middle verb is deleted, making the sentence ungrammatical, many readers rate it no worse, or even better: the missing-verb illusion. Memory for the early subjects has faded by the time the verbs arrive.',
 example:'“The patient the nurse the clerk called missed the bus” lacks a verb for “the nurse”, yet often sounds better than the complete version.',
 research:'Gibson, E. & Thomas, J. (1999). Memory limitations and structural forgetting: the perception of complex ungrammatical sentences as grammatical. Language and Cognitive Processes 14, 225–248; Frazier, L. (1985) first described the illusion; Vasishth, S. et al. (2010). Language and Cognitive Processes 25 (found in English but not in German, where verb-final clauses are common).',
 desc:'Eight sentences one at a time with five rating buttons from odd to natural, and bars of your average rating for each sentence type beside markers for the published pattern.',
 dur:11,hint:'Press Start, read each sentence once at normal speed and rate how natural it sounds, from 1 (very odd) to 5 (natural). Eight sentences. Your ratings stay in this page.',
 init:()=>({phase:'idle',i:0,order:[],seed:7,data:{right:[],c1:[],c2:[],miss:[]}}),
 watch(p){const k=Math.min(7,Math.floor(p*8)),sim={right:[4.6],c1:[3.9],c2:[2.1],miss:[2.7]},data={right:[],c1:[],c2:[],miss:[]};L4_RCOND.slice(0,Math.ceil((k+1)/2)).forEach(([c])=>data[c]=sim[c]);return {phase:'run',i:k,order:[0,2,4,6,1,3,5,7],data,sim:true}},
 ui:[{b:'Start',act:'go'}],
 on:{go(s){s.seed=L4_nx(s.seed);s.order=shuffled(range(8),s.seed);s.i=0;s.data={right:[],c1:[],c2:[],miss:[]};s.phase='run'},
  rate(s,v){if(s.phase!=='run')return;const it=L4_RITEMS[s.order[s.i]];s.data[it.c].push(Number(v));s.i++;if(s.i>=8)s.phase='done'}},
 draw(s,f,X){
  let out=heading(s.phase==='done'?'Finished: your ratings against the published pattern':s.sim?'Simulated participant':`Sentence ${Math.min(s.i+1,8)} of 8: how natural is it?`);
  out+=R(30,46,540,76,'#fff',C.grid,10);
  if(s.phase==='run'){const it=L4_RITEMS[s.order[s.i]],ls=L4_wrap(it.s,58);out+=L4_lines(300,ls.length>1?80:90,ls,15,C.ink,'middle',22)}
  else out+=TF(300,90,s.phase==='idle'?(X.try?'Press Start':''):'Thank you. Compare your bars with the markers.',15,C.muted);
  [1,2,3,4,5].forEach(v=>{const x=70+(v-1)*96;out+=L4_key(X,'rate',v,`Rate ${v}`,x,132,84,38,v===1?'1 odd':v===5?'5 natural':String(v))});
  const pl=L4_plot(110,196,420,120,[0,4],[1,5],[],[[1,'1'],[3,'3'],[5,'5']],null,'rating');out+=pl.svg;
  L4_RCOND.forEach(([c,lab],j)=>{const x=110+j*105+52,d=s.data[c],m=L4_mean(d);
   if(d.length){const y=pl.Y(m);out+=R(x-22,y,44,316-y,c==='miss'?C.coral:c==='c2'?C.amber:C.blue,'none',4)+TBF(x,y-6,m.toFixed(1),13,C.ink)}
   out+=L(x-30,pl.Y(L4_RPUB[c]),x+30,pl.Y(L4_RPUB[c]),C.ink,3)+L4_lines(x,334,L4_wrap(lab,14),13,C.muted,'middle',16)});
  out+=TF(570,212,'— published shape',13,C.ink,'end');
  const ok=s.data.c2.length&&s.data.miss.length;
  return {svg:out,phase:ok?(L4_mean(s.data.miss)>=L4_mean(s.data.c2)?'Like many readers, you rated the sentence with a missing verb at least as high as the complete one: by the end, memory has lost track of the first subject.':'You rated the complete sentences higher than the broken ones, unlike many readers in the studies. Individuals vary, and two items per type is very few.'):'Black lines show the published pattern (shape from Gibson and Thomas 1999; values illustrative). Bars fill in as you rate.'};
 }});

const L4_PIR=[
 {k:'hcf',l:'The claim',t:'Hauser, Chomsky & Fitch (2002)',lines:['Proposed that recursion may be the core of the','human language faculty in the narrow sense: the','one part not shared with other abilities or species.']},
 {k:'everett',l:'Everett 2005',t:'Everett (2005)',lines:['After decades of fieldwork, Daniel Everett reported','that Pirahã, spoken by a few hundred people in','Brazil, has no clauses embedded inside others,','and linked this to the speakers’ culture.']},
 {k:'nevins',l:'The reply',t:'Nevins, Pesetsky & Rodrigues (2009)',lines:['Reanalysed Everett’s published examples and argued','some do show embedding; and that even if one','language lacked it, the capacity could still be human.']},
 {k:'corpus',l:'Corpus study',t:'Futrell et al. (2016)',lines:['Coded a corpus of Pirahã stories: no clear cases of','embedding were found, but the data could not rule','it out. The question remains open.']}];
SCENE({id:'recursion-piraha',name:'Does every language embed?',tag:'An open debate',
 definition:'If recursion is the heart of human language, every language should use it. Daniel Everett’s fieldwork on Pirahã, an Amazonian language, suggested a language without clause embedding, setting off one of linguistics’ fiercest recent debates. Ideas can always be linked side by side instead of one inside another, so the question is about grammar, not about what speakers can think.',
 example:'English can say “I said that you will come” (one clause inside another) or “I spoke. You will come.” (two clauses side by side) and convey much the same thing.',
 research:'Hauser, M. D., Chomsky, N. & Fitch, W. T. (2002). Science 298, 1569–1579; Everett, D. L. (2005). Current Anthropology 46, 621–646; Nevins, A., Pesetsky, D. & Rodrigues, C. (2009). Language 85, 355–404; Futrell, R. et al. (2016). PLOS ONE 11(1): e0145289. Contested; presented here without a verdict.',
 desc:'Two ways to combine the same two ideas, one embedded and one side by side, with four cards summarising the main positions in the Pirahã recursion debate.',
 dur:12,hint:'Press each card to read a position. The diagram shows the difference the debate is about: one clause inside another, or two clauses next to each other.',
 init:()=>({k:'hcf'}),
 watch(p){return {k:L4_PIR[Math.min(3,Math.floor(p*4))].k}},
 ui:[{choose:L4_PIR.map(c=>[c.k,c.l]),label:'Position',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v}},
 draw(s,f,X){
  let out=heading('One clause inside another, or side by side?');
  out+=TF(150,62,'Embedded',14,C.blue,'middle','font-weight="700"')+TF(450,62,'Side by side',14,C.green,'middle','font-weight="700"');
  out+=R(30,72,240,76,C.pale,C.blue,10)+TF(42,98,'[ I said',15,C.ink,'start')+R(110,104,150,34,'#fff',C.blue,8)+TF(185,126,'[ that you will come ]',13,C.ink)+TF(42,134,']',15,C.ink,'start');
  out+=R(330,82,110,56,C.greenp,C.green,10)+TF(385,115,'[ I spoke. ]',14,C.ink)+R(450,82,124,56,C.greenp,C.green,10)+TF(512,115,'[ You will come. ]',13,C.ink);
  const cw=134;L4_PIR.forEach((c,i)=>{const x=24+i*(cw+6),on=c.k===s.k;out+=hit(X,'k',c.k,c.t,R(x,166,cw,40,on?C.pale:'#fff',on?C.blue:C.line,8)+TBF(x+cw/2,191,c.l,13,on?C.blue:C.ink))});
  const c=L4_PIR.find(q=>q.k===s.k);
  out+=R(24,218,552,150,'#fff',C.grid,10)+TBF(40,244,c.t,14,C.ink,'start')+L4_lines(40,272,c.lines,14,C.ink,'start',22);
  return {svg:out,phase:'Both sides agree that Pirahã speakers can express any thought; the dispute is whether the grammar ever puts one clause inside another, and what that would mean for theories of a universal grammar.'};
 }});

/* ======================= Lesson: formal-grammars ======================= */
const L4_PAT=[
 {n:1,l:'(ab)ⁿ',ex:'ababab',lvl:'Regular',at:[250,260],why:['Repeats a fixed chunk.','Two states are enough:','a finite automaton.']},
 {n:2,l:'aⁿbⁿ',ex:'aaabbb',lvl:'Context-free',at:[222,176],why:['Every a needs a matching b.','Counting without limit','needs a stack (pushdown).']},
 {n:3,l:'nested if…then',ex:'if if … then … then',lvl:'Context-free',at:[268,176],why:['Each “if” pairs with a','“then”, innermost first:','nesting, like brackets.']},
 {n:4,l:'aⁿbⁿcⁿ',ex:'aabbcc',lvl:'Context-sensitive',at:[210,128],why:['Three counts must agree.','A single stack cannot','check all three.']},
 {n:5,l:'cross-serial',ex:'N₁ N₂ N₃ V₁ V₂ V₃',lvl:'Beyond context-free',at:[250,128],why:['Swiss German links nouns','to verbs in crossing order;','Shieber (1985).']},
 {n:6,l:'copy ww',ex:'abbabb',lvl:'Context-sensitive',at:[290,128],why:['The second half repeats','the first exactly, in the','same order: not context-free.']}];
SCENE({id:'formal-grammars',name:'The Chomsky hierarchy',tag:'Grammars as machines',
 definition:'Chomsky (1956, 1959) classified grammars by what their rules may do, and each class matches a kind of machine. Regular grammars need only a fixed number of states; context-free grammars add a stack; context-sensitive grammars need working space that grows with the input; the most general need a full Turing machine. The classes nest inside each other.',
 example:'Matching brackets, like ((())), is context-free: you must remember how many are open. A machine with a fixed number of states cannot do this for any depth.',
 research:'Chomsky, N. (1956). Three models for the description of language. IRE Transactions on Information Theory 2, 113–124; Chomsky, N. (1959). On certain formal properties of grammars. Information and Control 2, 137–167; Shieber, S. M. (1985). Evidence against the context-freeness of natural language. Linguistics and Philosophy 8, 333–343.',
 desc:'Four nested regions for the language classes, each with its machine, and six string patterns placed in the smallest class that contains them, with a note on why.',
 dur:12,hint:'Press a pattern on the right, or its numbered dot, to see where it sits and what kind of memory it needs.',
 init:()=>({p:1}),
 watch(p){return {p:1+Math.min(5,Math.floor(p*6))}},
 ui:[{choose:L4_PAT.map(q=>[q.n,q.l]),label:'Pattern',get:s=>s.p,act:'p'}],
 on:{p(s,v){s.p=Number(v)}},
 draw(s,f,X){
  let out=heading('Each class of grammar needs a stronger machine');
  const regs=[[16,52,316,316,'Recursively enumerable · Turing machine','#f6f4fb',C.purple],[34,100,280,262,'Context-sensitive','#fbf3e3',C.amber],[52,148,244,208,'Context-free · a stack','#e8f2f8',C.blue],[70,196,208,154,'Regular · finite states','#e6f3ef',C.green]];
  regs.forEach(([x,y,w,h,l,fill,col])=>out+=R(x,y,w,h,fill,col,14)+TBF(x+12,y+20,l,13,col,'start'));
  const cur=L4_PAT.find(q=>q.n===s.p);
  L4_PAT.forEach(q=>{const on=q.n===s.p;out+=hit(X,'p',q.n,`Pattern ${q.l}`,Ci(q.at[0],q.at[1]+(q.lvl==='Regular'?10:0),on?14:11,on?C.coral:'#fff',on?C.coral:C.ink)+TBF(q.at[0],q.at[1]+(q.lvl==='Regular'?15:5),String(q.n),13,on?'#fff':C.ink))});
  L4_PAT.forEach((q,i)=>{const y=54+i*30,on=q.n===s.p;out+=hit(X,'p',q.n,`Pattern ${q.l}`,R(348,y,236,26,on?C.pale:'#fff',on?C.blue:C.grid,6)+TBF(362,y+18,String(q.n),13,C.muted,'start')+TF(382,y+18,q.l,13,C.ink,'start',L4_FONT))});
  out+=R(348,240,236,128,'#fff',C.grid,10)+TBF(362,262,cur.lvl,14,C.coral,'start')+TF(362,284,'e.g. '+cur.ex,13,C.ink,'start',L4_FONT)+L4_lines(362,306,cur.why,13,C.muted,'start',19);
  return {svg:out,phase:`${cur.l} is ${cur.lvl.toLowerCase()}: ${cur.why.join(' ')} Most of the grammar of human languages fits comfortably within context-free power, with a few constructions that need slightly more (Joshi’s “mildly context-sensitive”).`};
 }});

// Two machines: a finite automaton for (ab)* and a stack machine for aⁿbⁿ.
function L4_run(m,str){
 const fr=[];let st='q0',stack=[],phase='push',dead=false;
 const verdict=()=>dead?'reject':m==='fa'?(st==='q0'?'accept':'reject'):(stack.length===0?'accept':'reject');
 fr.push({i:0,st,stack:[],dead,v:verdict()});
 for(let i=0;i<str.length;i++){const c=str[i];
  if(!dead){if(m==='fa'){if(st==='q0'&&c==='a')st='q1';else if(st==='q1'&&c==='b')st='q0';else dead=true}
   else{if(c==='a'){if(phase==='push')stack.push('A');else dead=true}else{phase='pop';if(stack.length)stack.pop();else dead=true}}}
  fr.push({i:i+1,st,stack:stack.slice(),dead,v:verdict(),phase})}
 return fr;
}
SCENE({id:'formal-grammars-automaton',name:'Run the machine',tag:'States and a stack',
 definition:'A finite automaton reads a string one symbol at a time, moving between a fixed set of states; it accepts if it ends in an accepting state. It has no other memory, so it cannot count without limit. A pushdown automaton adds a stack: it can push a mark for every a and pop one for every b, which is exactly what aⁿbⁿ needs.',
 example:'For (ab)*, two states suffice: “expecting a” and “expecting b”. For aaabbb the machine must remember three a’s; with aaaaaaaaab it would need to remember nine.',
 research:'Rabin, M. O. & Scott, D. (1959). Finite automata and their decision problems. IBM J. Research and Development 3, 114–125; Chomsky, N. (1959). On certain formal properties of grammars. Information and Control 2, 137–167. Computer Science In Motion builds the same machines from the computing side.',
 desc:'An input string with a reading head, and either a two-state automaton or a push-and-pop machine with its stack drawn beside it, stepping one symbol at a time to accept or reject.',
 dur:12,hint:'Choose a machine, type a string with the a and b buttons, then step through it with Step ▶ or Run ▷.',
 init:()=>({m:'pda',str:'aaabbb'}),
 ui:[{choose:[['fa','Finite automaton: (ab)*'],['pda','Stack machine: aⁿbⁿ']],label:'Machine',get:s=>s.m,act:'m'},{b:'a',act:'add',arg:'a'},{b:'b',act:'add',arg:'b'},{b:'Delete',act:'del'},{b:'Clear',act:'clr'}],
 on:{m(s,v){s.m=v;s.str=v==='fa'?'ababab':'aaabbb'},add(s,c){if(s.str.length<12)s.str+=c},del(s){s.str=s.str.slice(0,-1)},clr(s){s.str=''}},
 trace(s){return L4_run(s.m,s.str)},
 draw(s,f,X){
  const fr=f||L4_run(s.m,s.str)[0],n=s.str.length,cw=Math.min(40,520/Math.max(1,n)),x0=300-cw*n/2;
  let out=heading(s.m==='fa'?'Finite automaton for (ab)*: two states, no other memory':'Stack machine for aⁿbⁿ: push on a, pop on b');
  if(!n)out+=TF(300,84,'(empty string)',14,C.muted);
  for(let i=0;i<n;i++){const done=i<fr.i;out+=R(x0+i*cw+2,62,cw-4,36,done?C.pale:'#fff',i===fr.i?C.coral:C.line,6)+TMF(x0+i*cw+cw/2,86,s.str[i],16,C.ink)}
  if(n){const hx=x0+Math.min(fr.i,n)*cw;out+=P(`M${fmt(hx)} 104 l-7 12 h14 z`,C.coral,1,C.coral)+TF(hx,134,fr.i<n?'reading head':'end of input',13,C.coral)}
  if(s.m==='fa'){
   const q=[[190,226,'q0','expect a'],[390,226,'q1','expect b']];
   out+=curveArrow(222,212,358,212,-40,C.ink)+TF(290,170,'a',15,C.ink)+curveArrow(358,240,222,240,-40,C.ink)+TF(290,292,'b',15,C.ink);
   q.forEach(([x,y,id,lab])=>{const on=fr.st===id&&!fr.dead;out+=Ci(x,y,30,on?C.pale:'#fff',on?C.blue:C.line,'stroke-width="3"')+TBF(x,y+6,id,16,C.ink)+TF(x,y+50,lab,13,C.muted);if(id==='q0')out+=Ci(x,y,24,'none',on?C.blue:C.line)});
   out+=arrow(120,226,158,226,C.muted,2)+TF(112,230,'start',13,C.muted,'end');
   if(fr.dead)out+=R(470,206,110,40,C.coralp,'none',8)+TBF(525,231,'stuck',15,C.coral);
  }else{
   out+=box(70,170,150,44,'push A on a',fr.phase!=='pop'&&!fr.dead?C.pale:'#fff',C.ink,14,C.line)+box(70,234,150,44,'pop A on b',fr.phase==='pop'&&!fr.dead?C.pale:'#fff',C.ink,14,C.line);
   out+=TF(145,304,'accept if the stack is empty',13,C.muted);
   const sx=330,sb=322;out+=L(sx-4,sb,sx-4,sb-170,C.ink,2)+L(sx+86,sb,sx+86,sb-170,C.ink,2)+L(sx-4,sb,sx+86,sb,C.ink,2)+TF(sx+41,sb+18,'stack',13,C.muted);
   fr.stack.forEach((c,i)=>out+=R(sx+2,sb-4-(i+1)*24,78,21,C.blue,'none',4)+TBF(sx+41,sb-9-i*24,c,13,'#fff'));
   if(fr.dead)out+=R(450,206,130,40,C.coralp,'none',8)+TBF(515,231,'stuck',15,C.coral);
  }
  const end=fr.i===n,v=fr.v==='accept';
  out+=R(450,300,130,46,end?(v?C.greenp:C.coralp):'#f1f5f7','none',10)+TBF(515,329,end?(v?'accepted':'rejected'):'reading…',15,end?(v?C.green:C.coral):C.muted);
  return {svg:out,phase:end?(v?'Accepted: the machine ended in an accepting configuration.':'Rejected: '+(fr.dead?'the machine got stuck on a symbol it had no move for.':s.m==='fa'?'it ended expecting a b.':'a’s were left on the stack.')):s.m==='pda'?`${fr.stack.length} A on the stack: one for every a not yet matched.`:'The current state is all the machine remembers.'};
 }});

// A tiny context-free grammar, expanded leftmost-first with seeded choices.
const L4_LEX={Det:['the','a'],N:['girl','dog','park','telescope'],V:['saw','liked'],P:['in','with']};
function L4_derive(seed,maxPP){
 const r=rng(seed);let form=['S'],pp=0;const fr=[{form:form.slice(),rule:'start',at:0,pp}];
 for(let step=0;step<60;step++){
  const at=form.findIndex(t=>/^[A-Z]/.test(t));if(at<0)break;const X=form[at];let rhs,rule;
  if(X==='S')rhs=['NP','VP'];
  else if(X==='NP'){const pick=pp<maxPP&&r()<.45;if(pick)pp++;rhs=pick?['Det','N','PP']:['Det','N']}
  else if(X==='VP'){const pick=pp<maxPP&&r()<.5;if(pick)pp++;rhs=pick?['V','NP','PP']:['V','NP']}
  else if(X==='PP')rhs=['P','NP'];
  else {const ws=L4_LEX[X];rhs=[ws[Math.floor(r()*ws.length)]]}
  rule=`${X} → ${rhs.join(' ')}`;form=form.slice(0,at).concat(rhs,form.slice(at+1));
  const nx=form.findIndex(t=>/^[A-Z]/.test(t));fr.push({form:form.slice(),rule,at:nx,pp,changed:[at,at+rhs.length-1]});
 }
 return fr;
}
SCENE({id:'formal-grammars-generate',name:'Generate sentences from rules',tag:'A grammar as a recipe',
 definition:'A context-free grammar is a set of rewriting rules. Start with S and keep replacing the leftmost symbol on the left of a rule by its right-hand side until only words are left. Because a noun phrase may contain a prepositional phrase, which contains a noun phrase, a handful of rules can produce endlessly many sentences.',
 example:'NP → Det N PP and PP → P NP feed each other: “the dog in the park with the telescope in the…”.',
 research:'Chomsky, N. (1957). Syntactic Structures. Mouton; Backus, J. (1959) and Naur, P. et al. (1960). Report on the algorithmic language ALGOL 60, Communications of the ACM 3, 299–314 (the same notation, BNF, now defines programming languages).',
 desc:'The grammar’s rules, the sentence form at each step of a leftmost derivation with the next symbol to rewrite highlighted, and counters for steps and prepositional phrases used.',
 dur:12,hint:'Press Step ▶ or Run ▷ to rewrite one symbol at a time. Raise the limit on PPs for longer sentences, and press New sentence for another seeded choice.',
 init:()=>({seed:5,maxPP:2}),
 ui:[{range:'maxPP',label:'Prepositional phrases allowed',min:0,max:3,get:s=>s.maxPP,act:'mp',show:v=>String(v)},{b:'New sentence',act:'seed'}],
 on:{mp(s,v){s.maxPP=Number(v)},seed(s){s.seed=L4_nx(s.seed)}},
 trace(s){return L4_derive(s.seed,s.maxPP)},
 draw(s,f,X){
  const fr=f||L4_derive(s.seed,s.maxPP)[0],toks=fr.form;
  let out=heading(fr.at<0?'Only words left: a sentence':'Rewrite the leftmost symbol');
  out+=R(20,46,560,64,'#f6f9fb',C.grid,10);
  ['S → NP VP','NP → Det N | Det N PP','VP → V NP | V NP PP','PP → P NP','Det → the | a','N → girl | dog | park | telescope','V → saw | liked','P → in | with'].forEach((r,i)=>out+=TMF(34+(i%4)*140,70+Math.floor(i/4)*24,r,13,C.ink,'start'));
  let x=24,y=150;
  toks.forEach((t,i)=>{const nt=/^[A-Z]/.test(t),w=t.length*9+(nt?20:12);if(x+w>576){x=24;y+=46}
   const isNext=i===fr.at,isNew=fr.changed&&i>=fr.changed[0]&&i<=fr.changed[1];
   out+=nt?R(x,y-22,w-6,32,isNext?C.coralp:C.pale,isNext?C.coral:C.blue,7)+TBF(x+(w-6)/2,y,t,14,isNext?C.coral:C.blue):TF(x+(w-6)/2,y,t,16,isNew?C.green:C.ink,'middle',isNew?'font-weight="700"':'');x+=w});
  out+=TF(300,y+44,fr.rule==='start'?'Start from S.':'Last rule used: '+fr.rule,14,C.muted);
  const words=toks.filter(t=>!/^[A-Z]/.test(t)).length;
  out+=counter(70,318,'prepositional phrases',String(fr.pp),C.purple,150)+counter(240,318,'words so far',String(words),C.green,120)+counter(380,318,'symbols left',String(toks.length-words),C.blue,140);
  return {svg:out,phase:fr.at<0?`Finished: “${toks.join(' ')}”. Every sentence this grammar makes has a tree, built by the same steps.`:`Next: rewrite ${toks[fr.at]}, the leftmost symbol still to expand.`};
 }});

// Nested (German), cross-serial (Swiss German) and local (English) noun–verb links. Shieber (1985).
const L4_XS={
 swiss:{lab:'Swiss German',w:['…das','mer','d’chind','em Hans','es huus','lönd','hälfe','aastriiche'],g:['that','we','the children','Hans','the house','let','help','paint'],dep:[[2,5],[3,6],[4,7]]},
 german:{lab:'Standard German',w:['…dass','wir','die Kinder','dem Hans','das Haus','streichen','helfen','ließen'],g:['that','we','the children','Hans','the house','paint','help','let'],dep:[[2,7],[3,6],[4,5]]},
 english:{lab:'English',w:['…that','we','let','the children','help','Hans','paint','the house'],g:['','','','','','','',''],dep:[[2,3],[4,5],[6,7]]}};
const L4_cross=dep=>{let c=0;for(let i=0;i<dep.length;i++)for(let j=i+1;j<dep.length;j++){const [a,b]=dep[i],[c2,d]=dep[j];if((a<c2&&c2<b&&b<d)||(c2<a&&a<d&&d<b))c++}return c};
SCENE({id:'formal-grammars-crossserial',name:'Crossing dependencies',tag:'Is language context-free?',
 definition:'Context-free grammars handle dependencies that nest, like brackets: the last one opened is the first one closed. In Swiss German (and Dutch), verbs can follow their objects in the same order, so the links cross. Stuart Shieber (1985) showed that because Swiss German also marks case on these nouns, crossing dependencies of any length put it beyond context-free power.',
 example:'“…that we let the children help Hans paint the house”: in Standard German the verbs come in reverse order (nested); in Swiss German in the same order (crossing).',
 research:'Shieber, S. M. (1985). Evidence against the context-freeness of natural language. Linguistics and Philosophy 8, 333–343; Huybregts, R. (1984); Bresnan, J., Kaplan, R. M., Peters, S. & Zaenen, A. (1982). Cross-serial dependencies in Dutch. Linguistic Inquiry 13, 613–635. Widely accepted.',
 desc:'The same clause in Swiss German, Standard German and English, with arcs joining each noun to the verb it depends on, coloured by pair, and a count of how many arcs cross.',
 dur:11,hint:'Switch between the three languages and compare the arcs: nested arcs never cross; cross-serial arcs do.',
 init:()=>({k:'swiss'}),
 watch(p){return {k:['english','german','swiss'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['english','English'],['german','Standard German'],['swiss','Swiss German']],label:'Language',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v}},
 draw(s){
  const d=L4_XS[s.k],xs=L4_xs(d.w.map(w=>w.length>6?w:w+'  '),20,580),wy=232,cols=[C.blue,C.green,C.coral],cr=L4_cross(d.dep);
  let out=heading(`${d.lab}: ${cr?cr+' crossings':'no crossings'}`);
  d.dep.forEach(([a,b],j)=>{const x1=xs[a],x2=xs[b],h=clamp(30+(x2-x1)*.42,30,150);out+=P(`M${fmt(x1)} ${wy-20} Q${fmt((x1+x2)/2)} ${fmt(wy-20-h*1.5)} ${fmt(x2)} ${wy-20}`,cols[j],3)+Ci(x1,wy-20,4,cols[j])+Ci(x2,wy-20,4,cols[j])});
  d.w.forEach((w,i)=>{const j=d.dep.findIndex(p=>p[0]===i||p[1]===i);out+=TF(xs[i],wy,w,14,j>=0?cols[j]:C.ink,'middle',(j>=0?'font-weight="700" ':'')+L4_FONT);if(d.g[i])out+=TF(xs[i],wy+22,d.g[i],13,C.muted)});
  out+=R(70,292,460,64,C.amberp,'none',10)+TF(300,318,'Meaning: “…that we let the children help Hans paint the house”',13,C.ink)+TF(300,342,s.k==='swiss'?'Verbs in the same order as their nouns: the links cross.':s.k==='german'?'Verbs in reverse order: the links nest like brackets.':'Each verb sits next to its object: no long links at all.',13,C.muted);
  return {svg:out,phase:s.k==='swiss'?'The first noun goes with the first verb, the second with the second: crossing links of unbounded length cannot be produced by any context-free grammar.':s.k==='german'?'Nested links: the first noun pairs with the last verb. A stack handles this, as for brackets.':'English avoids long links here by putting each verb next to its object.'};
 }});

/* ======================= Lesson: garden-paths ======================= */
const L4_GP=[
 ['The horse raced past the barn fell.','The horse that was raced past the barn fell.'],
 ['The boat floated down the river sank.','The boat that was floated down the river sank.'],
 ['The man warned about the fire left.','The man who was warned about the fire left.'],
 ['The dog walked to the park barked.','The dog that was walked to the park barked.'],
 ['The soldiers marched across the field ate.','The soldiers who were marched across the field ate.'],
 ['The children helped across the road waved.','The children who were helped across the road waved.'],
 ['The clown rushed to the hospital smiled.','The clown who was rushed to the hospital smiled.'],
 ['The student taught by the professor passed.','The student who was taught by the professor passed.']];
const L4_GPSIM={red:{base:.36,crit:.62},full:{base:.37,crit:.43}};
function L4_gpWords(s){const it=s.order[s.i];return L4_GP[it[0]][it[1]==='red'?0:1].split(' ')}
SCENE({id:'garden-paths',name:'Read word by word',tag:'Be the participant',
 definition:'A garden-path sentence leads the reader into one structure and then forces a different one. Self-paced reading measures this: words appear one at a time as you press a key, and the time on each word shows where reading slows. Readers pause on the final verb of “The horse raced past the barn fell”, where their first analysis collapses.',
 example:'“The horse raced past the barn fell” means “the horse that was raced past the barn fell”. The longer version removes the ambiguity, and the pause on “fell” shrinks.',
 research:'Bever, T. G. (1970). The cognitive basis for linguistic structures (the horse sentence); Just, M. A., Carpenter, P. A. & Woolley, J. D. (1982). Paradigms and processes in reading comprehension. J. Exp. Psychol.: General 111, 228–238 (moving-window reading); MacDonald, M. C., Pearlmutter, N. J. & Seidenberg, M. S. (1994). Psychological Review 101, 676–703. The slowdown at the disambiguating word is robust.',
 desc:'A moving-window display in which only the current word is visible, with bars comparing your average reading time on the final verb against the other words, for ambiguous and unambiguous sentences.',
 dur:12,hint:'Press Start, then press Next word (or Space on the reading box) to reveal each word at your normal reading pace. Eight short sentences. Each sentence is shown only once; nothing leaves the page.',
 init:()=>({phase:'idle',i:0,w:0,order:[],seed:31,t0:0,rts:[],data:{red:{base:[],crit:[]},full:{base:[],crit:[]}}}),
 watch(p){const q=p*16,i=Math.min(1,Math.floor(q/8)),w=Math.floor(q%8),order=[[0,'red'],[0,'full']],data={red:{base:[],crit:[]},full:{base:[],crit:[]}};
  if(p>.45){data.red.base=[L4_GPSIM.red.base];data.red.crit=[L4_GPSIM.red.crit]}if(p>.95){data.full.base=[L4_GPSIM.full.base];data.full.crit=[L4_GPSIM.full.crit]}
  return {phase:'read',i,w:Math.min(w,L4_GP[0][i].split(' ').length-1),order,data,sim:true}},
 ui:[{b:'Start',act:'go'},{b:'Next word',act:'next'}],
 on:{go(s){s.seed=L4_nx(s.seed);const items=shuffled(range(8),s.seed);s.order=items.map((it,j)=>[it,j%2?'full':'red']);s.i=0;s.w=0;s.rts=[];s.data={red:{base:[],crit:[]},full:{base:[],crit:[]}};s.phase='ready'},
  next(s){const now=performance.now();
   if(s.phase==='ready'){s.phase='read';s.w=0;s.rts=[];s.t0=now;return}
   if(s.phase!=='read')return;
   const ws=L4_gpWords(s);s.rts.push((now-s.t0)/1000);s.t0=now;s.w++;
   if(s.w>=ws.length){const cond=s.order[s.i][1],crit=s.rts[s.rts.length-1],mid=s.rts.slice(1,-1).filter(v=>v<3);
    if(crit<3)s.data[cond].crit.push(crit);if(mid.length)s.data[cond].base.push(L4_mean(mid));
    s.i++;s.phase=s.i>=8?'done':'ready'}}},
 draw(s,f,X){
  let out=heading(s.sim?'Simulated reader':s.phase==='done'?'Finished':s.phase==='idle'?'Moving-window reading':`Sentence ${s.i+1} of 8`);
  out+=hit(X,'next','w','Next word',R(20,48,560,74,'#fff',X.try&&(s.phase==='read'||s.phase==='ready')?C.blue:C.grid,10));
  if(s.phase==='read'&&s.order.length){const ws=L4_gpWords(s),cw=9,tot=ws.join(' ').length,x0=300-tot*cw/2;let off=0;
   ws.forEach((w,j)=>{out+=TMF(x0+off*cw,94,j===s.w?w:w.replace(/[^ ]/g,'-'),15,j===s.w?C.ink:C.line,'start');off+=w.length+1})}
  else out+=TF(300,92,s.phase==='idle'?(X.try?'Press Start':''):s.phase==='ready'?'Press Next word to begin the sentence':'Done: see your bars below',15,C.muted);
  const pl=L4_plot(100,150,330,160,[0,2],[0,.9],[],[[0,'0'],[.3,'300'],[.6,'600'],[.9,'900 ms']],null,'time per word');out+=pl.svg;
  [['red','ambiguous (“raced … fell”)'],['full','unambiguous (“that was raced”)']].forEach(([c,lab],j)=>{const d=s.data[c],cx=100+j*165+82;
   [['base','other words',C.line],['crit','final verb',c==='red'?C.coral:C.blue]].forEach(([k,kl,col],m)=>{const v=d[k];if(v.length){const y=pl.Y(L4_mean(v));out+=R(cx-48+m*52,y,44,310-y,col,'none',4)+TBF(cx-26+m*52,y-6,L4_ms(L4_mean(v)),13,C.ink)}out+=TF(cx-26+m*52,328,kl,13,C.muted)});
   out+=TF(cx,350,lab,13,C.ink)});
  const rc=s.data.red.crit,fc=s.data.full.crit,rb=s.data.red.base,fb=s.data.full.base;
  const sd=rc.length&&rb.length&&fc.length&&fb.length?(L4_mean(rc)-L4_mean(rb))-(L4_mean(fc)-L4_mean(fb)):null;
  out+=R(444,150,140,120,'#fff',C.grid,8)+TF(514,172,'extra pause on',13,C.muted)+TF(514,190,'ambiguous verb',13,C.muted)+TB(514,226,sd===null?'—':(sd>=0?'+':'')+L4_ms(sd),18,C.coral)+TF(514,254,'tens–hundreds ms',13,C.muted);
  return {svg:out,phase:sd===null?'Only the current word is shown, so your reading time on each word can be measured. Watch the final verb.':sd>0?'You slowed on the final verb of the ambiguous sentences more than in the unambiguous ones: the first structure you built had to be torn down there.':'No extra pause this time. With four sentences per type and keypress timing, noise is large; studies use dozens of items and readers.'};
 }});

const L4_PARSE={
 horse:{w:'The horse raced past the barn fell.'.split(' '),sur:[.1,.2,.3,.2,.1,.2,1],fr:[
  [0,'[NP The …','A noun phrase is starting.','ok'],[1,'[NP The horse] …','The horse is the subject.','ok'],
  [2,'[S [NP The horse] [VP raced …','“raced” is the main verb: the horse did the racing.','ok'],[3,'… [VP raced [PP past …','Racing past something.','ok'],
  [4,'… [VP raced [PP past [NP the …','A place is coming.','ok'],[5,'[S [NP The horse] [VP raced past the barn]]','A complete sentence: the horse raced past the barn.','ok'],
  [6,'[S The horse raced past the barn] fell ✗','A verb with nowhere to go: the structure breaks.','crash'],
  [6,'[S [NP The horse [RC raced past the barn]] [VP fell]]','Reanalysed: someone raced the horse past the barn; the horse fell.','fixed']]},
 old:{w:'The old man the boat.'.split(' '),sur:[.1,.2,.2,1,.3],fr:[
  [0,'[NP The …','A noun phrase is starting.','ok'],[1,'[NP The old …','“old” looks like an adjective.','ok'],
  [2,'[NP The old man] …','The subject is “the old man”; a verb should follow.','ok'],
  [3,'[NP The old man] the ✗','“the” cannot come here: there is no verb yet.','crash'],
  [3,'[NP The old] [VP man [NP the …','Reanalysed: “the old” means old people; “man” is a verb, to crew.','fixed'],
  [4,'[S [NP The old] [VP man [NP the boat]]]','Old people crew the boat.','ok']]},
 anna:{w:'While Anna dressed the baby played in the crib.'.split(' '),sur:[.1,.1,.2,.2,.2,1,.3,.2,.2],fr:[
  [0,'[Sub While …','A “while” clause is starting.','ok'],[1,'[Sub While [NP Anna] …','Anna is doing something.','ok'],
  [2,'[Sub While Anna [VP dressed …','“dressed” probably has an object.','ok'],[4,'[Sub While Anna dressed [NP the baby]] …','Anna dressed the baby.','ok'],
  [5,'[Sub While Anna dressed the baby] played ✗','“played” needs a subject, but “the baby” is taken.','crash'],
  [5,'[Sub While Anna dressed] [S [NP the baby] [VP played …','Reanalysed: Anna dressed herself; the baby played.','fixed'],
  [8,'[Sub While Anna dressed] [S the baby played in the crib]','Asked “Did Anna dress the baby?”, many readers still say yes.','linger']]}};
SCENE({id:'garden-paths-parse',name:'Inside the reader’s head',tag:'Analysis and reanalysis',
 definition:'Readers build structure word by word without waiting for the end of the sentence. When a word cannot fit, the analysis must be revised. Lyn Frazier’s garden-path model held that the reader first chooses the simplest structure, then repairs it. Later studies showed repairs are not always complete: the first misreading can linger.',
 example:'After “While Anna dressed the baby played in the crib”, many readers answer yes to “Did Anna dress the baby?”, although the sentence says she dressed herself.',
 research:'Frazier, L. (1979). On comprehending sentences: syntactic parsing strategies. PhD thesis, University of Connecticut; Frazier, L. & Rayner, K. (1982). Cognitive Psychology 14, 178–210 (eye movements); Christianson, K., Hollingworth, A., Halliwell, J. F. & Ferreira, F. (2001). Thematic roles assigned along the garden path linger. Cognitive Psychology 42, 368–407.',
 desc:'A sentence revealed word by word with the reader’s current analysis in brackets, its interpretation, a crash and reanalysis at the problem word, and bars of illustrative surprise for each word.',
 dur:12,hint:'Choose a sentence and step through it with Step ▶. Watch where the analysis breaks and how it is rebuilt.',
 init:()=>({k:'horse'}),
 ui:[{choose:[['horse','The horse raced…'],['old','The old man…'],['anna','While Anna…']],label:'Sentence',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v}},
 trace(s){return L4_PARSE[s.k].fr.map(([i,br,gu,st])=>({i,br,gu,st}))},
 draw(s,f,X){
  const d=L4_PARSE[s.k],fr=f||{i:0,br:d.fr[0][1],gu:d.fr[0][2],st:'ok'},xs=L4_xs(d.w,30,570);
  let out=heading(fr.st==='crash'?'The analysis breaks':fr.st==='fixed'?'Reanalysis':fr.st==='linger'?'Repaired, but the first reading lingers':'Building the structure word by word');
  d.w.forEach((w,j)=>out+=T(xs[j],70,w,16,j<fr.i?C.ink:j===fr.i?(fr.st==='crash'?C.coral:C.blue):'#c6d3dc','middle',j===fr.i?'font-weight="700"':'')+(j===fr.i?L(xs[j]-w.length*4.5,78,xs[j]+w.length*4.5,78,fr.st==='crash'?C.coral:C.blue,2.5):''));
  const col=fr.st==='crash'?C.coral:fr.st==='fixed'?C.green:fr.st==='linger'?C.amber:C.blue;
  out+=R(30,94,540,46,'#f6f9fb',col,10)+TMF(300,123,fr.br,13,C.ink);
  out+=L4_lines(300,166,L4_wrap(fr.gu,64),14,col,'middle',20);
  const base=330,bw=Math.min(44,480/d.w.length-6);out+=L(30,base,570,base,C.line,1.5)+TF(30,214,'surprise at each word (illustrative)',13,C.muted,'start');
  d.w.forEach((w,j)=>{if(j>fr.i)return;const h=d.sur[j]*100;out+=R(xs[j]-bw/2,base-h,bw,h,d.sur[j]>.8?C.coral:C.blue,'none',4)});
  d.w.forEach((w,j)=>out+=TF(xs[j],base+20,w.replace('.',''),13,j<=fr.i?C.muted:'#c6d3dc'));
  return {svg:out,phase:fr.gu};
 }});

SCENE({id:'garden-paths-constraints',name:'Does meaning steer the parser?',tag:'A long debate',
 definition:'Does the reader build structure from syntax alone and use meaning only later, or does everything count at once? Ferreira and Clifton (1986) found readers stumbled on reduced relatives even when the first noun could not plausibly do the action. Trueswell, Tanenhaus and Garnsey (1994), with items where the cue was stronger, found the difficulty largely vanished. Constraint-based theories say plausibility, word frequency and context are all used immediately.',
 example:'“The defendant examined by the lawyer…” misleads: defendants can examine things. “The evidence examined by the lawyer…” hardly does: evidence cannot examine anything.',
 research:'Ferreira, F. & Clifton, C. (1986). The independence of syntactic processing. J. Memory and Language 25, 348–368; Trueswell, J. C., Tanenhaus, M. K. & Garnsey, S. M. (1994). J. Memory and Language 33, 285–318; Clifton, C. et al. (2003). J. Memory and Language 49, 317–334 (some early difficulty may remain). Not fully settled.',
 desc:'A chart of the predicted extra reading time at “by the lawyer” against how plausible the first noun is as the one doing the examining, with the syntax-first and constraint-based predictions and a slider marking one noun.',
 dur:11,hint:'Slide from “evidence” (cannot examine) to “defendant” (can examine) and switch between the two theories’ predictions. Values are illustrative.',
 init:()=>({pl:20,th:'both'}),
 watch(p){return {pl:Math.round(smooth(p)*100),th:p<.35?'syntax':p<.7?'constraint':'both'}},
 ui:[{range:'pl',label:'First noun could do the examining',min:0,max:100,get:s=>s.pl,act:'pl',show:v=>v<25?'evidence':v<75?'in between':'defendant'},{choose:[['syntax','Syntax first'],['constraint','Constraint-based'],['both','Both']],label:'Theory',get:s=>s.th,act:'th'}],
 on:{pl(s,v){s.pl=Number(v)},th(s,v){s.th=v}},
 draw(s){
  const noun=s.pl<25?'evidence':s.pl<75?'(a noun in between)':'defendant';
  let out=heading('How much does “by the lawyer” slow the reader?');
  out+=TF(300,62,`“The ${noun} examined by the lawyer turned out to be unreliable.”`,14,C.ink,'middle','font-style="italic"');
  const pl=L4_plot(110,86,400,200,[0,100],[0,120],[[0,'cannot examine'],[100,'can examine']],[[60,'60'],[120,'120 ms']],null,'extra time');out+=pl.svg;
  const syn=x=>70,con=x=>8+.9*x;
  if(s.th!=='constraint')out+=P(`M${fmt(pl.X(0))} ${fmt(pl.Y(syn(0)))} L${fmt(pl.X(100))} ${fmt(pl.Y(syn(100)))}`,C.purple,3)+TF(pl.X(4),pl.Y(syn(0))-8,'syntax first: always misled at first',13,C.purple,'start');
  if(s.th!=='syntax')out+=P(`M${fmt(pl.X(0))} ${fmt(pl.Y(con(0)))} L${fmt(pl.X(100))} ${fmt(pl.Y(con(100)))}`,C.green,3)+TF(pl.X(96),pl.Y(con(100))+20,'constraint-based',13,C.green,'end');
  out+=L(pl.X(s.pl),86,pl.X(s.pl),286,C.coral,1.5,'stroke-dasharray="4 4"');
  if(s.th!=='constraint')out+=Ci(pl.X(s.pl),pl.Y(syn(s.pl)),6,C.purple);if(s.th!=='syntax')out+=Ci(pl.X(s.pl),pl.Y(con(s.pl)),6,C.green);
  out+=R(40,330,520,40,C.amberp,'none',8)+TF(300,355,'Evidence: Trueswell et al. found little pause after “evidence”; Ferreira & Clifton found one.',13,C.ink);
  return {svg:out,phase:s.pl<25?'With a noun that cannot examine anything, constraint-based theories predict almost no garden path; a strict syntax-first parser still predicts a brief one.':'When the first noun can plausibly do the action, both theories predict a garden path.'};
 }});

/* ======================= Lesson: universals ======================= */
// WALS chapter 81A (Dryer 2013): languages by dominant order of subject, object and verb.
const L4_WO=[
 {o:'SOV',n:565,lang:'Japanese',s:'Tarō ga ringo o tabeta',g:'Taro (subject) apple (object) ate',t:'Taro ate an apple.',also:'Also Hindi, Turkish, Korean, Quechua.'},
 {o:'SVO',n:488,lang:'Mandarin',s:'Wǒ chī píngguǒ',g:'I eat apple',t:'I eat apples.',also:'Also English, Swahili, Thai, Spanish.'},
 {o:'VSO',n:95,lang:'Welsh',s:'Darllenodd Siân y llyfr',g:'read Siân the book',t:'Siân read the book.',also:'Also Irish, Classical Arabic, Samoan.'},
 {o:'VOS',n:25,lang:'Malagasy',s:'Nahita ny vehivavy ny mpianatra',g:'saw the woman the student',t:'The student saw the woman.',also:'Also Tzotzil and some other Mayan languages.'},
 {o:'OVS',n:11,lang:'Hixkaryana',s:'toto yahosɨye kamara',g:'man grabbed jaguar',t:'The jaguar grabbed the man.',also:'Derbyshire (1977) showed this order exists.'},
 {o:'OSV',n:4,lang:'—',s:'',g:'',t:'',also:'Claimed for a handful of languages, such as Nadëb in Brazil; too rare and disputed to give an example here.'},
 {o:'none',n:189,lang:'—',s:'',g:'',t:'',also:'No single dominant order, e.g. German (main and subordinate clauses differ) or Warlpiri (free order, case marks roles).'}];
SCENE({id:'universals',name:'Which word orders exist?',tag:'Typology',
 definition:'Joseph Greenberg (1963) compared word order in 30 languages and found striking regularities. With today’s much larger samples, the World Atlas of Language Structures shows all six orders of subject, object and verb occur, but very unevenly: orders with the subject before the object are by far the most common.',
 example:'Of 1,188 languages with a dominant order in WALS, 1,053 (89%) put the subject before the object: SOV or SVO.',
 research:'Greenberg, J. H. (1963). Some universals of grammar with particular reference to the order of meaningful elements. In Universals of Language, MIT Press; Dryer, M. S. (2013). Order of subject, object and verb. WALS Online, chapter 81; Derbyshire, D. C. (1977). Word order universals and the existence of OVS languages. Linguistic Inquiry 8, 590–599.',
 desc:'Horizontal bars counting the languages with each dominant word order in the World Atlas of Language Structures, and an example sentence with a word-by-word gloss for the chosen order.',
 dur:12,hint:'Press an order to see an example sentence and which languages use it. Counts are languages, not families; the next scenes ask why that matters.',
 init:()=>({o:'SOV'}),
 watch(p){return {o:L4_WO[Math.min(6,Math.floor(p*7))].o}},
 ui:[{choose:L4_WO.map(w=>[w.o,w.o==='none'?'No dominant':w.o]),label:'Order',get:s=>s.o,act:'o'}],
 on:{o(s,v){s.o=v}},
 draw(s,f,X){
  let out=heading('Languages by their usual order of Subject, Object, Verb');
  L4_WO.forEach((w,i)=>{const y=56+i*40,on=w.o===s.o,bw=w.n/565*190;
   out+=hit(X,'o',w.o,`${w.o}: ${w.n} languages`,R(14,y,330,34,on?C.pale:'#fff',on?C.blue:'none',8)+TBF(28,y+23,w.o==='none'?'none':w.o,14,C.ink,'start')+R(92,y+8,Math.max(2,bw),18,on?C.coral:w.o==='none'?C.line:C.blue,'none',3)+TF(98+bw,y+23,String(w.n),13,C.ink,'start'))});
  out+=TF(180,350,'WALS 2013 · 1,377 languages',13,C.muted);
  const w=L4_WO.find(q=>q.o===s.o);
  out+=R(356,56,230,272,'#fff',C.grid,10);
  if(w.s){out+=TBF(370,82,w.lang,15,C.blue,'start')+L4_lines(370,112,L4_wrap(w.s,24),15,C.ink,'start',22,'font-weight="700" '+L4_FONT);
   const gy=112+L4_wrap(w.s,24).length*22+6;out+=L4_lines(370,gy,L4_wrap(w.g,28),13,C.muted,'start',18)+L4_lines(370,gy+L4_wrap(w.g,28).length*18+10,L4_wrap('“'+w.t+'”',28),14,C.ink,'start',19)}
  out+=L4_lines(370,w.s?262:90,L4_wrap(w.also,30),13,C.muted,'start',18);
  return {svg:out,phase:w.o==='none'?'Many languages have no single dominant order, often because case endings show who did what.':`${w.o}: ${w.n} languages in the WALS sample. ${w.o==='SOV'||w.o==='SVO'?'Subject-before-object orders dominate.':'Rarer, but it exists: no order is impossible.'}`};
 }});

// WALS chapter 95A (Dryer 2013): verb–object order against adpositions.
const L4_ADP={OVpost:472,OVpre:14,VOpost:42,VOpre:456};
SCENE({id:'universals-implications',name:'If one, then the other',tag:'Implicational universals',
 definition:'Greenberg’s most robust findings are implications: if a language has one property, it very likely has another. Languages that put the object before the verb mostly use postpositions (“Tokyo in”); languages that put the verb first mostly use prepositions (“in Tokyo”). One explanation is consistent head direction: heads tend to come on the same side of their phrases.',
 example:'English says “eat apples · in Tokyo” (heads first). Japanese says “ringo o taberu · Tōkyō de”, literally “apples eat · Tokyo in” (heads last).',
 research:'Greenberg, J. H. (1963), Universal 4; Dryer, M. S. (1992). The Greenbergian word order correlations. Language 68, 81–138; Dryer, M. S. (2013). Relationship between the order of object and verb and the order of adposition and noun phrase. WALS Online, chapter 95. Counts approximate.',
 desc:'A two-by-two table of languages by object–verb order and adposition type, with the chosen row highlighted, and mirror-image phrase trees for a head-first and a head-last language.',
 dur:11,hint:'Choose verb-first (VO) or object-first (OV) and compare the counts. The trees show the same phrases with their heads on opposite sides.',
 init:()=>({vo:'OV'}),
 watch(p){return {vo:p<.5?'VO':'OV'}},
 ui:[{choose:[['VO','Verb before object (VO)'],['OV','Object before verb (OV)']],label:'Order',get:s=>s.vo,act:'vo'}],
 on:{vo(s,v){s.vo=v}},
 draw(s){
  let out=heading(s.vo==='VO'?'VO languages mostly use prepositions':'OV languages mostly use postpositions');
  const tx=40,ty=60,cw=120,rh=48;
  out+=TF(tx+90+cw/2,ty+20,'prepositions',13,C.muted)+TF(tx+90+cw*1.5,ty+20,'postpositions',13,C.muted);
  [['VO','VOpre','VOpost'],['OV','OVpre','OVpost']].forEach(([lab,a,b],i)=>{const y=ty+30+i*rh,on=lab===s.vo,harm=lab==='VO'?a:b;
   out+=TBF(tx+40,y+30,lab,15,on?C.ink:C.muted);
   [a,b].forEach((k,j)=>{const x=tx+90+j*cw,big=k===harm;out+=R(x+4,y+4,cw-8,rh-8,on?(big?C.greenp:C.coralp):'#f4f7f9',on?(big?C.green:C.coral):'none',8)+TBF(x+cw/2,y+31,String(L4_ADP[k]),16,on?(big?C.green:C.coral):C.muted)})});
  const row=s.vo==='VO'?[L4_ADP.VOpre,L4_ADP.VOpost]:[L4_ADP.OVpost,L4_ADP.OVpre],pct=Math.round(100*row[0]/(row[0]+row[1]));
  out+=TF(tx+90+cw,ty+150,`${pct}% of ${s.vo} languages follow the pattern`,14,C.ink)+TF(tx+90+cw,ty+172,'WALS 2013, approximate',13,C.muted);
  const hf=s.vo==='OV',vp=hf?['VP',['NP','ringo o'],['V','taberu']]:['VP',['V','eat'],['NP','apples']],pp=hf?['PP',['NP','Tōkyō'],['P','de']]:['PP',['P','in'],['NP','Tokyo']];
  out+=R(372,52,214,300,'#fff',C.grid,10)+TBF(479,76,hf?'Japanese: heads last':'English: heads first',14,C.ink);
  out+=L4_tree(vp,L4_xs(L4_words(vp),396,564),0,150,46,{hl:[vp[hf?2:1]]}).svg+L4_tree(pp,L4_xs(L4_words(pp),396,564),0,270,46,{hl:[pp[hf?2:1]]}).svg;
  out+=TF(479,342,'red: the head of each phrase',13,C.coral);
  return {svg:out,phase:`${pct}% of ${s.vo} languages in the sample have ${s.vo==='VO'?'prepositions':'postpositions'}: the verb and the adposition sit on the same side of their phrases.`};
 }});

SCENE({id:'universals-debate',name:'Counting languages or families?',tag:'Galton’s problem',
 definition:'Related languages inherit their word order from a common ancestor, so counting languages can overstate a pattern: ten daughters of one ancestor are really one data point. This is Galton’s problem. Evans and Levinson (2009) argued that true universals are rare; Dunn and colleagues (2011), using family trees, found word-order correlations that differed between families. Later phylogenetic studies with larger samples found several of Greenberg’s correlations do hold.',
 example:'If one ancestor language was object-first with postpositions, all its descendants may be too, without that telling us anything about the human mind.',
 research:'Evans, N. & Levinson, S. C. (2009). The myth of language universals. Behavioral and Brain Sciences 32, 429–492; Dunn, M., Greenhill, S. J., Levinson, S. C. & Gray, R. D. (2011). Nature 473, 79–82; Croft, W. et al. (2011). Linguistic Typology 15 (reply); Jäger, G. & Wahle, J. (2021). Phylogenetic typology. Frontiers in Psychology 12. Ongoing debate.',
 desc:'A made-up set of language families drawn as trees with each language coloured by its pattern, and bars counting the supporting cases by language and by family as the largest family grows.',
 dur:11,hint:'Grow Family A and switch between counting languages and counting families. The made-up data show the statistical point, not real languages.',
 init:()=>({n:8,by:'lang'}),
 watch(p){return {n:1+Math.round(smooth(Math.min(1,p*1.6))*9),by:p<.6?'lang':'fam'}},
 ui:[{range:'n',label:'Languages in Family A',min:1,max:10,get:s=>s.n,act:'n',show:v=>String(v)},{choose:[['lang','Count languages'],['fam','Count families']],label:'Count',get:s=>s.by,act:'by'}],
 on:{n(s,v){s.n=Number(v)},by(s,v){s.by=v}},
 draw(s){
  let out=heading('Ten cousins are not ten independent cases');
  const fams=[{l:'Family A',k:Array(s.n).fill(1)},{l:'Family B',k:[1,1]},{l:'C',k:[1]},{l:'D',k:[0]},{l:'E',k:[1]}];
  let x=26;
  fams.forEach(fm=>{const w=Math.max(54,fm.k.length*24+12),cx=x+w/2;out+=Ci(cx,72,8,C.ink)+TF(cx,58,fm.l,13,C.ink);
   fm.k.forEach((h,j)=>{const lx=x+12+j*24+(w-12-fm.k.length*24)/2+6;out+=L(cx,80,lx,124,C.line,1.5)+Ci(lx,132,8,h?C.green:C.coral)});x+=w+10});
  out+=Ci(40,166,7,C.green)+TF(52,171,'follows the pattern',13,C.muted,'start')+Ci(220,166,7,C.coral)+TF(232,171,'does not',13,C.muted,'start');
  const langYes=s.n+4,langNo=1,famYes=4,famNo=1,yes=s.by==='lang'?langYes:famYes,no=s.by==='lang'?langNo:famNo;
  const pl=L4_plot(110,196,300,130,[0,2],[0,14],[],[[0,'0'],[7,'7'],[14,'14']],null,'cases');out+=pl.svg;
  [['supporting',yes,C.green],['against',no,C.coral]].forEach(([l,v,c],j)=>{const cx=110+75+j*150,y=pl.Y(v);out+=R(cx-30,y,60,326-y,c,'none',4)+TBF(cx,y-6,String(v),14,C.ink)+TF(cx,344,l,13,C.muted)});
  out+=R(430,196,156,130,'#fff',C.grid,8)+TF(508,220,s.by==='lang'?'by language':'by family',13,C.muted)+TB(508,262,`${Math.round(100*yes/(yes+no))}%`,22,C.green)+TF(508,290,'support',13,C.muted)+TF(508,310,`from ${yes+no} cases`,13,C.muted);
  return {svg:out,phase:s.by==='lang'?`Counting languages, Family A alone adds ${s.n} supporting cases, though they inherited one choice from one ancestor.`:'Counting families, Family A counts once, however many daughters it has. Real studies go further and model change along the family trees.'};
 }});

/* ======================= Lesson: sign-languages ======================= */
const L4_SIGNS={
 SUMMER:{p:'Location',loc:120,mean:'summer',pair:'UGLY and DRY',kind:'face'},
 UGLY:{p:'Location',loc:176,mean:'ugly',pair:'SUMMER and DRY',kind:'face'},
 DRY:{p:'Location',loc:226,mean:'dry',pair:'SUMMER and UGLY',kind:'face'},
 SIT:{p:'Movement',mean:'to sit (verb)',pair:'CHAIR',kind:'hands',reps:1},
 CHAIR:{p:'Movement',mean:'chair (noun)',pair:'SIT',kind:'hands',reps:2}};
const L4_PARAMS=['Handshape','Location','Movement','Palm orientation','Face and body'];
SCENE({id:'sign-languages',name:'Sign has phonology too',tag:'Stokoe’s parameters',
 definition:'William Stokoe (1960) showed that signs in American Sign Language are built from a small set of meaningless parts, just as spoken words are built from sounds: handshape, location and movement, later joined by palm orientation and facial expression. Change one part and you get a different sign. This made the case that ASL is a full language, not pantomime.',
 example:'In ASL, SUMMER, UGLY and DRY use the same bent-finger handshape and sideways movement; only the location differs (forehead, nose, chin). SIT and CHAIR differ only in movement: one motion for the verb, a small repeated motion for the noun.',
 research:'Stokoe, W. C. (1960). Sign Language Structure. Studies in Linguistics, Occasional Papers 8; Klima, E. S. & Bellugi, U. (1979). The Signs of Language. Harvard University Press; Supalla, T. & Newport, E. L. (1978). How many seats in a chair? In Understanding Language through Sign Language Research.',
 desc:'A schematic signer with the hand at one location or a pair of hands with a movement path, beside the list of sign parameters with the one that distinguishes the chosen sign highlighted.',
 dur:12,hint:'Press a sign and compare it with its partners. The drawings are schematic, not a guide to producing the signs; learn signs from Deaf signers.',
 init:()=>({k:'SUMMER'}),
 watch(p){return {k:Object.keys(L4_SIGNS)[Math.min(4,Math.floor(p*5))]}},
 ui:[{choose:Object.keys(L4_SIGNS).map(k=>[k,k]),label:'Sign',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v}},
 draw(s,f,X){
  const g=L4_SIGNS[s.k];let out=heading(`ASL ${s.k}: differs from ${g.pair} only in ${g.p.toLowerCase()}`);
  if(g.kind==='face'){
   out+=P('M120 300 Q120 340 170 350 L250 350 Q300 340 300 300',C.line,2)+Ci(210,180,82,'#fff',C.ink,'stroke-width="2"');
   out+=Ci(182,160,5,C.ink)+Ci(238,160,5,C.ink)+P('M210 166 L203 194 L214 194',C.ink,2)+P('M190 224 Q210 236 230 224',C.ink,2);
   [['forehead',120],['nose',176],['chin',226]].forEach(([l,y])=>{const on=y===g.loc;out+=TF(84,y+5,l,13,on?C.coral:C.muted,'end')+L(92,y,112,y,on?C.coral:C.line,1.5)});
   const y=g.loc;out+=arrow(170,y-14,250,y-14,C.coral,2.5)+P(`M262 ${y+18} q0 -18 -14 -22 q-8 -2 -10 6`,C.coral,5,'none')+R(254,y+16,20,30,C.coral,'none',6);
  }else{
   out+=R(110,252,200,22,'#fff',C.ink,8)+TF(210,296,'non-dominant hand: two fingers',13,C.muted);
   const hy=200;out+=R(150,hy,150,20,C.coralp,C.coral,8);
   for(let i=0;i<g.reps;i++)out+=arrow(330+i*30,hy-18,330+i*30,hy+26,C.coral,2.5);
   out+=TF(345,hy+56,g.reps>1?'small, repeated':'one movement',13,C.coral)+TF(225,hy-12,'dominant hand: two fingers',13,C.muted);
  }
  out+=R(402,56,184,226,'#fff',C.grid,10)+TBF(416,80,'Parameters',14,C.ink,'start');
  L4_PARAMS.forEach((pn,i)=>{const on=pn===g.p;out+=R(412,92+i*36,164,30,on?C.coralp:'#f4f7f9','none',6)+TF(424,112+i*36,pn,13,on?C.coral:C.ink,'start',on?'font-weight="700"':'')});
  out+=R(402,294,184,62,C.pale,'none',10)+TF(494,318,`${s.k} means`,13,C.muted)+TBF(494,342,g.mean,14,C.ink);
  return {svg:out,phase:`${s.k} and ${g.pair} are a minimal set: everything is the same except the ${g.p.toLowerCase()}, just as “pat” and “bat” differ only in their first sound.`};
 }});

// Senghas, Kita & Özyürek (2004): segmenting manner and path. Bar heights approximate.
const L4_NSL=[{k:'gest',l:'Spanish speakers’ gestures',v:.12},{k:'c1',l:'First cohort',v:.3},{k:'c2',l:'Second cohort',v:.6},{k:'c3',l:'Third cohort',v:.62}];
SCENE({id:'sign-languages-nicaragua',name:'A language is born',tag:'Nicaraguan Sign Language',
 definition:'When schools in Managua brought deaf children together from the late 1970s, they created a new sign language within a generation. Each new cohort learned from the older children and made the language more systematic. One sign of this: later signers break an event into separate pieces (“roll” then “descend”) that can be recombined, where gestures and early signers show it as one whole movement.',
 example:'To describe something rolling down a hill, a hearing speaker’s gesture spirals downwards in one movement; later cohorts of signers sign ROLL and then DESCEND.',
 research:'Kegl, J., Senghas, A. & Coppola, M. (1999). Creation through contact. In Language Creation and Language Change, MIT Press; Senghas, A., Kita, S. & Özyürek, A. (2004). Children creating core properties of language. Science 305, 1779–1782; Sandler, W. et al. (2005). PNAS 102, 2661–2665 (Al-Sayyid Bedouin Sign Language).',
 desc:'Two ways to show rolling downhill, as one combined movement or as two separate signs, and bars for how often each group splits manner from path, with the chosen group highlighted.',
 dur:12,hint:'Choose a group to see how its members tended to express rolling down a hill. Bar heights are approximate; the published finding is the rise after the first cohort.',
 init:()=>({k:'c2'}),
 watch(p){return {k:L4_NSL[Math.min(3,Math.floor(p*4))].k}},
 ui:[{choose:L4_NSL.map(g=>[g.k,g.l]),label:'Group',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v}},
 draw(s){
  const g=L4_NSL.find(q=>q.k===s.k),seg=g.v>=.5;let out=heading(seg?'Mostly split into separate signs: ROLL, then DESCEND':'Mostly one combined movement');
  out+=R(20,52,260,230,'#fff',C.grid,10);
  if(seg){out+=Ci(80,120,26,'none',C.blue,'stroke-width="3"')+arrow(106,120,110,112,C.blue,3)+TBF(80,170,'1 ROLL',14,C.blue)+arrow(190,96,236,212,C.green,3)+TBF(214,240,'2 DESCEND',14,C.green)}
  else{let d='M60 80';for(let i=0;i<=40;i++){const t=i/40,x=60+t*170+18*Math.cos(t*Math.PI*8),y=80+t*150+18*Math.sin(t*Math.PI*8);d+=` L${fmt(x)} ${fmt(y)}`}out+=P(d,C.purple,3)+TBF(150,268,'one spiralling movement',13,C.purple)}
  const pl=L4_plot(330,60,240,210,[0,4],[0,1],[],[[0,'0%'],[.5,'50%'],[1,'100%']],null,'split');out+=pl.svg;
  L4_NSL.forEach((q,i)=>{const x=330+i*60+30,y=pl.Y(q.v),on=q.k===s.k;out+=R(x-20,y,40,270-y,on?C.coral:C.blue,'none',4)+L4_lines(x,288,L4_wrap(q.l,12),13,on?C.ink:C.muted,'middle',16)});
  out+=TF(150,330,'Late 1970s onwards: new schools in Managua',13,C.muted)+TF(150,350,'bring deaf children together',13,C.muted);
  return {svg:out,phase:`${g.l}: ${seg?'manner and path are usually split into separate units, a step towards the building-block structure of language.':'manner and path usually come together in one holistic movement, as in gesture.'} The children, not adults, drove the change.`};
 }});

const L4_LES={none:{l:'No damage',v:[95,95,95]},left:{l:'Left hemisphere',v:[35,55,88]},right:{l:'Right hemisphere',v:[90,88,40]}};
SCENE({id:'sign-languages-brain',name:'Sign and the left hemisphere',tag:'Aphasia in signers',
 definition:'Sign languages are seen, not heard, and they use space for grammar. Yet studies of deaf signers after strokes, pioneered by Ursula Bellugi and colleagues, found that damage to the left hemisphere disrupts signing much as it disrupts speech, while right-hemisphere damage impairs drawing and spatial tasks but leaves sign grammar largely intact. Language, not hearing, seems to recruit the left hemisphere.',
 example:'A signer with left-hemisphere damage may sign haltingly or with errors in handshape, yet copy a drawing well; a signer with right-hemisphere damage may draw a house with missing parts yet sign fluently.',
 research:'Poizner, H., Klima, E. S. & Bellugi, U. (1987). What the Hands Reveal about the Brain. MIT Press; Hickok, G., Bellugi, U. & Klima, E. S. (1996). The neurobiology of sign language and its implications for the neural basis of language. Nature 381, 699–702; MacSweeney, M. et al. (2008). The signing brain. Trends in Cognitive Sciences 12, 432–440.',
 desc:'A schematic brain seen from above with a lesion marked on the chosen side, and bars for performance on producing signs, understanding signs and a drawing task.',
 dur:10,hint:'Choose where the damage is and compare the three bars. Values are illustrative; individual patients vary.',
 init:()=>({k:'left'}),
 watch(p){return {k:['none','left','right'][Math.min(2,Math.floor(p*3))]}},
 ui:[{choose:[['none','No damage'],['left','Left hemisphere'],['right','Right hemisphere']],label:'Damage',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v}},
 draw(s){
  const d=L4_LES[s.k];let out=heading(`${d.l}: what is affected?`);
  out+=P('M150 70 Q80 80 80 190 Q80 300 150 310 L150 70Z',C.line,2,'#f2f6f9')+P('M160 70 Q230 80 230 190 Q230 300 160 310 L160 70Z',C.line,2,'#f2f6f9');
  out+=TF(115,330,'left',13,C.muted)+TF(195,330,'right',13,C.muted)+TF(155,352,'seen from above, front at top',13,C.muted);
  if(s.k!=='none'){const x=s.k==='left'?112:198;out+=Ci(x,170,26,C.coralp,C.coral,'stroke-width="2.5"')+TBF(x,175,'✕',15,C.coral)}
  const pl=L4_plot(310,70,260,220,[0,3],[0,100],[],[[0,'0'],[50,'50'],[100,'100']],null,'performance');out+=pl.svg;
  ['making signs','understanding signs','copying a drawing'].forEach((l,i)=>{const x=310+i*86+43,y=pl.Y(d.v[i]),low=d.v[i]<60;out+=R(x-24,y,48,290-y,low?C.coral:C.blue,'none',4)+L4_lines(x,308,L4_wrap(l,11),13,C.ink,'middle',16)});
  return {svg:out,phase:s.k==='left'?'Left damage: signing breaks down although vision and hand movement are fine, as speech does after left damage in hearing people.':s.k==='right'?'Right damage: spatial drawing suffers, but the spatial grammar of sign is largely spared.':'Signing and visuospatial skills both intact. The interesting cases are the dissociations.'};
 }});
