/* ===================== Language era 8 · Language machines ===================== */
// From word-for-word translation to large language models. Every picture is a pure function of state,
// frame and X; models (n-grams, BPE merges, softmax weights) are recomputed from the learner's choices,
// never stored half-run. Samples use seeded generators; the one timed task reads performance.now()
// only inside on() handlers. All vectors, logits and attention weights marked "toy" are hand-set to
// show an idea, not measured from a real system.
const L8_poly=(pts,col,w=2.2,extra='')=>pts.length>1?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const L8_pill=(x,y,label,fill,ink=C.ink,w)=>{const ww=w||label.length*7.4+18;return R(x,y-14,ww,20,fill,'none',10)+TBF(x+ww/2,y+1,label,13,ink)};
// Word-wrap a string into lines of at most n characters.
function L8_wrap(s,n){const out=[];let line='';for(const w of String(s).split(' ')){if((line+' '+w).trim().length>n&&line){out.push(line);line=w}else line=(line+' '+w).trim()}if(line)out.push(line);return out}
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function L8_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
const L8_softmax=(zs,t=1)=>{const m=Math.max(...zs.map(z=>z/t)),e=zs.map(z=>Math.exp(z/t-m)),S=sum(e);return e.map(v=>v/S)};
const L8_cos=(a,b)=>{const d=sum(a.map((v,i)=>v*b[i])),na=Math.hypot(...a),nb=Math.hypot(...b);return na&&nb?d/(na*nb):0};
const L8_FONT='font-family="&quot;Noto Sans&quot;, &quot;Segoe UI Symbol&quot;, &quot;Segoe UI&quot;, sans-serif"';

/* =========================== machine-translation =========================== */
// Three sentences in the style of the 1954 Georgetown–IBM demonstration. Each source word has a dictionary
// entry (first-listed sense); "rules" insert function words the way the demonstration's six rules did.
const L8_MT={
 a:{src:['Мы','передаём','мысли','посредством','речи'],lat:'My peredayom mysli posredstvom rechi',
  gloss:['we','transmit','thoughts','by means of','speech'],rules:[],good:'We transmit thoughts by means of speech.'},
 b:{src:['Качество','угля','определяется','калорийностью'],lat:'Kachestvo uglya opredelyayetsya kaloriynostyu',
  gloss:['quality','coal','is determined','calorific value'],rules:[[0,'the',true],[1,'of',true],[3,'by',true]],good:'The quality of coal is determined by calorific value.'},
 c:{src:['Он','пил','воду','из','ключа'],lat:'On pil vodu iz klyucha',
  gloss:['he','drank','water','from','key'],rules:[[4,'the',true]],good:'He drank water from the spring.',bad:4}
};
SCENE({id:'machine-translation',name:'Word for word',tag:'The Georgetown–IBM demonstration, 1954',
 definition:'The first machine translation systems looked each word up in a bilingual dictionary and applied a few hand-written rules to reorder words or insert small words such as “of” and “the”.',
 example:'In 1954 an IBM 701 translated more than sixty carefully chosen Russian sentences into English using a 250-word dictionary and six rules. Chosen sentences worked; ordinary text did not.',
 desc:'A Russian sentence in Cyrillic with each word linked to its dictionary entry below, the words a rule inserts shown in amber, the resulting English, and a timeline of machine translation from 1949 to 2016.',
 research:'Weaver (1949). Translation (memorandum). Hutchins (2004). The Georgetown–IBM experiment demonstrated in January 1954. AMTA. ALPAC (1966). Language and Machines: Computers in Translation and Linguistics. National Academy of Sciences.',
 dur:12,hint:'Choose a sentence and switch the rules on and off. The third sentence uses a word with two meanings: see which one the dictionary picks.',
 init:()=>({sent:'b',rules:false}),
 watch(p){return p<.25?{sent:'a',rules:false}:p<.5?{sent:'b',rules:false}:p<.75?{sent:'b',rules:true}:{sent:'c',rules:true}},
 ui:[{choose:[['a','Sentence 1'],['b','Sentence 2'],['c','Sentence 3']],label:'Russian',get:s=>s.sent,act:'sent'},{choose:[['off','Dictionary only'],['on','Dictionary + rules']],label:'Method',get:s=>s.rules?'on':'off',act:'rules'}],
 on:{sent(s,v){s.sent=v},rules(s,v){s.rules=v==='on'}},
 draw(s){
  const d=L8_MT[s.sent];let out=heading('Look up each word, then apply a few rules',26);
  out+=TF(300,50,d.lat,13,C.muted,'middle','font-style="italic"');
  const n=d.src.length,lens=d.src.map(w=>Math.max(w.length*9.4+18,64)),tot=sum(lens)+(n-1)*12;let x=300-tot/2;const xs=[];
  d.src.forEach((w,i)=>{xs.push(x+lens[i]/2);out+=R(x,62,lens[i],32,C.pale,'none',6)+TBF(x+lens[i]/2,84,w,16,C.ink,'middle',L8_FONT);x+=lens[i]+12});
  // target row: dictionary glosses, plus rule insertions before a word
  const toks=[];d.gloss.forEach((g,i)=>{if(s.rules)d.rules.filter(r=>r[0]===i).forEach(r=>toks.push({w:r[1],rule:true}));toks.push({w:g,src:i,bad:d.bad===i})});
  const tl=toks.map(t=>t.w.length*8+16),tt=sum(tl)+(toks.length-1)*8;x=300-tt/2;
  toks.forEach((t,i)=>{const cx=x+tl[i]/2;if(t.src!==undefined)out+=arrow(xs[t.src],96,cx,148,C.line,1.6,7);
   out+=R(x,150,tl[i],28,t.rule?C.amberp:t.bad?C.coralp:'#fff',t.rule?C.amber:t.bad?C.coral:C.grid,6)+TF(cx,169,t.w,14,t.rule?C.amber:t.bad?C.coral:C.ink);x+=tl[i]+8});
  const outS=toks.map(t=>t.w).join(' ');const sentence=outS.charAt(0).toUpperCase()+outS.slice(1)+'.';
  const ok=sentence===d.good;
  out+=TF(300,208,'output',13,C.muted)+T(300,232,sentence,17,ok?C.green:C.coral,'middle','font-weight="650"');
  out+=TF(300,254,ok?'✓ reads as good English':'✗ a fluent reader would write: '+d.good,13,ok?C.green:C.coral);
  // timeline
  const ev=[[1949,'Weaver’s memo'],[1954,'Georgetown–IBM'],[1966,'ALPAC report'],[1990,'statistical MT'],[2016,'neural MT']],tx=y=>60+(y-1945)/(2020-1945)*480;
  out+=L(55,312,545,312,C.line,2);ev.forEach(([y,l],i)=>{out+=Ci(tx(y),312,5,i===1?C.blue:C.muted)+TF(tx(y),i%2?336:300,l,13,C.ink)+TF(tx(y),i%2?352:284,String(y),13,C.muted)});
  const phase=s.sent==='c'?'Ключ means “key” but also “spring” (of water) and “clef”. A dictionary that always takes the first sense says “from key”; choosing “spring” needs the context of drinking water.':!s.rules&&d.rules.length?'Dictionary glosses alone give “quality coal is determined calorific value”: the Russian case endings that mean “of” and “by” have no English word to look up.':s.rules&&d.rules.length?'The rules turn the genitive ending into “of” and the instrumental into “by”, and add “the”. The demonstration worked because its sentences were chosen to fit its rules.':'This sentence happens to translate word for word in English order, so even the dictionary alone succeeds.';
  return {svg:out,phase};
 }});

// Bar-Hillel's pen: why some ambiguities need knowledge of the world.
const L8_PEN=[
 {s:'The ink was in the pen.',need:'w',methods:['w','w','w']},
 {s:'The pig was in the pen.',need:'e',methods:['w','e','e']},
 {s:'The box was in the pen.',need:'e',methods:['w','w','e'],ctx:'Little John was looking for his toy box. Finally he found it.'},
 {s:'The pen was in the box.',need:'w',methods:['w','w','w']}
];
const L8_SENSE={w:{en:'pen for writing',fr:'stylo'},e:{en:'pen as an enclosure',fr:'enclos (parc)'}};
const L8_METHODS=['Most frequent sense','Clue words nearby','Knowledge of sizes'];
SCENE({id:'machine-translation-ambiguity',name:'The box in the pen',tag:'Bar-Hillel’s argument, 1960',
 definition:'Many words have several meanings. Choosing the right one sometimes needs no grammar at all, only knowledge of the world, such as how big things are.',
 example:'“The box was in the pen.” A writing pen is too small to hold a box, so a reader knows this pen is a playpen; Bar-Hillel argued no program of his day could know that.',
 desc:'A sentence containing “pen”, three ways a program might choose its meaning with the sense and French word each produces, marked right or wrong, and a sketch comparing the sizes of a box, a writing pen and a playpen.',
 research:'Bar-Hillel (1960). The present status of automatic translation of languages. Advances in Computers 1, 91–163 (the “box in the pen” example, Appendix III). Navigli (2009). Word sense disambiguation: a survey. ACM Computing Surveys 41(2).',
 dur:11,hint:'Choose a sentence. Compare what each method picks for “pen”, and which French word it would lead to.',
 init:()=>({k:2}),
 watch(p){return {k:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:L8_PEN.map((e,i)=>[String(i),e.s.replace('The ','').replace('.','')]),label:'Sentence',get:s=>String(s.k),act:'k'}],
 on:{k(s,v){s.k=Number(v)}},
 draw(s){
  const e=L8_PEN[s.k];let out=heading('Which “pen”? Three ways to decide',26);
  if(e.ctx)out+=TF(300,52,e.ctx,13,C.muted,'middle','font-style="italic"');
  out+=T(300,78,e.s,18,C.ink,'middle','font-weight="650"');
  L8_METHODS.forEach((m,i)=>{const y=110+i*50,pick=e.methods[i],ok=pick===e.need;
   out+=R(30,y-20,350,40,ok?C.greenp:C.coralp,'none',8)+TBF(44,y-2,m,14,C.ink,'start')+TF(44,y+14,'→ '+L8_SENSE[pick].en,13,C.muted,'start');
   out+=TF(300,y+6,'fr: '+L8_SENSE[pick].fr,13,C.ink,'middle')+TBF(368,y+6,ok?'✓':'✗',18,ok?C.green:C.coral,'end')});
  out+=TF(205,272,`needed: ${L8_SENSE[e.need].en}`,13,C.ink);
  // sizes sketch
  const bx=410;out+=R(bx,90,170,190,'#fff',C.grid,8)+TBF(bx+85,110,'sizes',13,C.muted);
  out+=R(bx+20,180,22,22,C.amberp,C.amber,2)+TF(bx+31,220,'box',13,C.ink);
  out+=R(bx+92,188,40,6,C.blue,'none',3)+TF(bx+112,220,'writing pen',13,C.ink);
  out+=P(`M${bx+20} 260 H${bx+150} M${bx+20} 238 H${bx+150}`,C.muted,1.5)+range(8).map(i=>L(bx+20+i*18.5,232,bx+20+i*18.5,264,C.muted,2)).join('')+TF(bx+85,276,'playpen (enclosure)',13,C.ink);
  out+=TF(bx+85,140,e.need==='e'?'the box only fits':'a writing pen fits',13,C.muted)+TF(bx+85,156,e.need==='e'?'in the enclosure':'the sentence as written',13,C.muted);
  out+=T(300,324,'Bar-Hillel: high-quality fully automatic translation would need “a universal encyclopedia”.',14,C.ink);
  out+=TF(300,350,'Later systems learned sense choices from huge text corpora instead of encyclopedias.',13,C.muted);
  const phase=s.k===2?'Here only knowledge of sizes gets it right: no nearby word distinguishes the two pens, and the frequent sense is the writing pen.':s.k===1?'“Pig” is a strong clue, so even a statistical method gets the enclosure; only the blind “most frequent sense” rule fails.':'All three methods agree here, because the most frequent sense happens to be the right one.';
  return {svg:out,phase};
 }});

// BLEU: n-gram overlap with a reference translation.
const L8_REF='the cat is on the mat'.split(' ');
const L8_CANDS=[
 {k:'exact',w:'the cat is on the mat'},
 {k:'sat',w:'the cat sat on the mat'},
 {k:'scramble',w:'on the mat is the cat'},
 {k:'not',w:'the cat is not on the mat'},
 {k:'the',w:'the the the the the the the'}
];
function L8_ngrams(ws,n){const out=[];for(let i=0;i+n<=ws.length;i++)out.push(ws.slice(i,i+n).join(' '));return out}
// Modified n-gram precision: each candidate n-gram counts at most as often as it appears in the reference.
function L8_prec(cand,ref,n){const c=L8_ngrams(cand,n),r=L8_ngrams(ref,n);if(!c.length)return {m:0,t:0,marks:[]};const left={};r.forEach(g=>left[g]=(left[g]||0)+1);const marks=c.map(g=>{if(left[g]>0){left[g]--;return true}return false});return {m:marks.filter(Boolean).length,t:c.length,marks}}
function L8_bleu(cand,ref,N){const ps=range(N).map(i=>L8_prec(cand,ref,i+1)),c=cand.length,r=ref.length,bp=c>r?1:Math.exp(1-r/c);
 const any0=ps.some(p=>p.m===0),score=any0?0:bp*Math.exp(sum(ps.map(p=>Math.log(p.m/p.t)))/N);return {ps,bp,score}}
SCENE({id:'machine-translation-bleu',name:'Scoring a translation',tag:'BLEU and its blind spots',
 definition:'BLEU scores a machine translation by counting how many of its word sequences (n-grams) also appear in a human reference translation, with a penalty for being too short.',
 example:'“The cat is not on the mat” shares almost every word pair with the reference “the cat is on the mat”, so it scores well, although it says the opposite.',
 desc:'A reference sentence and a candidate translation, with each candidate word and word pair marked as matched or not, bars for the one-word and two-word precisions and the brevity penalty, and the resulting score.',
 research:'Papineni, Roukos, Ward & Zhu (2002). BLEU: a method for automatic evaluation of machine translation. ACL. Callison-Burch, Osborne & Koehn (2006). Re-evaluating the role of BLEU in machine translation research. EACL. Reiter (2018). A structured review of the validity of BLEU. Computational Linguistics 44(3).',
 dur:12,hint:'Choose a candidate and compare its score with what it means. Switch between counting single words and counting word pairs too.',
 init:()=>({c:3,N:2}),
 watch(p){return {c:Math.min(4,Math.floor(p*5)),N:2}},
 ui:[{choose:L8_CANDS.map((c,i)=>[String(i),['exact','“sat”','scrambled','“not”','the×7'][i]]),label:'Candidate',get:s=>String(s.c),act:'c'},{choose:[['1','Words only'],['2','Words and pairs']],label:'Count',get:s=>String(s.N),act:'N'}],
 on:{c(s,v){s.c=Number(v)},N(s,v){s.N=Number(v)}},
 draw(s){
  const cand=L8_CANDS[s.c].w.split(' '),b=L8_bleu(cand,L8_REF,s.N);let out=heading(`BLEU-${s.N}: how many n-grams match the reference?`,26);
  const row=(ws,y,marks,lab)=>{const lens=ws.map(w=>w.length*8.4+16),tot=sum(lens)+(ws.length-1)*6;let x=300-tot/2+30;out+=TF(x-14,y+19,lab,13,C.muted,'end');ws.forEach((w,i)=>{const m=marks?marks[i]:null;out+=R(x,y,lens[i],28,m===null?C.pale:m?C.greenp:C.coralp,'none',6)+TMF(x+lens[i]/2,y+19,w,14,C.ink);x+=lens[i]+6})};
  row(L8_REF,52,null,'reference');row(cand,96,L8_prec(cand,L8_REF,1).marks,'candidate');
  if(s.N>1){const p2=L8_prec(cand,L8_REF,2),bg=L8_ngrams(cand,2);out+=TF(300,148,'word pairs: '+bg.map((g,i)=>(p2.marks[i]?'✓ ':'✗ ')+g).join('   '),13,C.ink)}
  const bx=50,by=290,bw=62;const items=b.ps.map((p,i)=>[`p${i+1} = ${p.m}/${p.t}`,p.t?p.m/p.t:0,C.blue]).concat([[`brevity ${b.bp.toFixed(2)}`,b.bp,C.purple],[`BLEU ${b.score.toFixed(2)}`,b.score,b.score>.6?C.green:C.coral]]);
  out+=L(bx-10,by,bx+items.length*(bw+22)-12,by,C.line,1.5);
  items.forEach(([l,v,col],i)=>{const x=bx+i*(bw+22),h=v*110;out+=R(x,by-h,bw,h,col,'none',4)+TF(x+bw/2,by+18,l,13,C.ink)});
  out+=TF(485,190,'meaning vs reference',13,C.muted);
  const mean=['same','different verb','same words, odd order','opposite','meaningless'][s.c];out+=TB(485,214,mean,15,[C.green,C.amber,C.amber,C.coral,C.coral][s.c]);
  out+=TF(485,250,'Standard BLEU counts',13,C.muted)+TF(485,266,'up to 4-word sequences',13,C.muted)+TF(485,282,'over a whole test set.',13,C.muted);
  out+=TF(300,350,'precision clipped: each reference word can be matched only as often as it occurs there',13,C.muted);
  const phase=s.c===4?'Seven “the”s: plain precision would be 7/7, but each “the” in the reference can be matched only twice, so p₁ = 2/7, and no word pair matches at all.':s.c===3?'Adding “not” reverses the meaning but leaves most word pairs intact: this candidate outscores “the cat sat on the mat”.':s.c===2?'Every word matches, so p₁ is perfect; only the broken word pairs show that the order is wrong.':s.c===1?'One wrong word costs one word and two word pairs.':'A perfect copy of the reference scores 1.';
  return {svg:out,phase};
 }});

/* =========================== n-grams =========================== */
// A small original corpus (written for this page). '.' ends a sentence and is a token of its own.
const L8_CORPUS=('the cat sat on the mat . the dog sat on the rug . the cat saw the dog . the dog saw the bird . '+
 'a bird sat on the wall . the cat ran to the wall . the dog ran to the park . a cat ran to the park . '+
 'the bird flew to the tree . the cat sat in the sun . the dog slept in the sun . a dog slept on the mat . '+
 'the bird sang in the tree . the cat saw a bird in the tree . the dog ran after the cat . the cat ran up the tree . '+
 'the bird flew over the wall . a dog sat by the door . the cat slept by the door . the dog saw a cat on the wall .').split(' ');
const L8_TOK=['.'].concat(L8_CORPUS);
const L8_VOCAB=[...new Set(L8_TOK)];
const L8_TEXT=L8_CORPUS.filter(w=>w!=='.').join(' ');
// counts of n-gram (joined by space) and of contexts followed by any token
const L8_CNT=(()=>{const c={};for(let n=1;n<=3;n++)for(let i=0;i+n<=L8_TOK.length;i++){const g=L8_TOK.slice(i,i+n).join(' ');c[g]=(c[g]||0)+1}return c})();
const L8_CTX=(()=>{const c={};for(let n=1;n<=2;n++)for(let i=0;i+n<L8_TOK.length;i++){const g=L8_TOK.slice(i,i+n).join(' ');c[g]=(c[g]||0)+1}return c})();
function L8_next(prev){const m={};for(let i=0;i+1<L8_TOK.length;i++)if(L8_TOK[i]===prev)m[L8_TOK[i+1]]=(m[L8_TOK[i+1]]||0)+1;return Object.entries(m).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))}
const L8_pick=(pairs,r)=>{const T=sum(pairs.map(p=>p[1]));let u=r()*T;for(const p of pairs){u-=p[1];if(u<0)return p[0]}return pairs[pairs.length-1][0]};
// Shannon-style approximations: letters (orders 0–3) or words (orders 1–2).
const L8_ORDERS=[['l0','Letters, random'],['l1','Letters by frequency'],['l2','Letter pairs'],['l3','Letter triples'],['w1','Words by frequency'],['w2','Word pairs']];
function L8_gen(order,seed){const r=rng(seed*7919+13);
 if(order[0]==='l'){const k=Number(order[1]),abc='abcdefghijklmnopqrstuvwxyz ';let out='';
  while(out.length<84){let ch;if(k===0)ch=abc[Math.floor(r()*27)];else{let pairs=[];for(let m=k-1;m>=0&&!pairs.length;m--){const ctx=m?out.slice(-m):'';if(m&&ctx.length<m)continue;const cnt={};for(let i=0;i+m<L8_TEXT.length;i++)if(L8_TEXT.slice(i,i+m)===ctx){const c2=L8_TEXT[i+m];cnt[c2]=(cnt[c2]||0)+1}pairs=Object.entries(cnt).sort((a,b)=>a[0].localeCompare(b[0]))}ch=L8_pick(pairs,r)}
   if(!(ch===' '&&(out.endsWith(' ')||!out)))out+=ch}
  return out.trim()}
 const words=[];let prev='.';const uni=Object.entries(L8_CORPUS.reduce((m,w)=>(m[w]=(m[w]||0)+1,m),{})).sort((a,b)=>a[0].localeCompare(b[0]));
 while(words.length<16){const w=order==='w1'?L8_pick(uni,r):L8_pick(L8_next(prev),r);words.push(w);prev=w}
 return words.join(' ').replace(/ \./g,'.')}
function L8_realShare(text){const toks=text.replace(/\./g,' ').split(' ').filter(Boolean);if(!toks.length)return 0;return toks.filter(t=>L8_VOCAB.includes(t)).length/toks.length}
SCENE({id:'n-grams',name:'Approximations to English',tag:'Shannon’s n-gram text',
 definition:'An n-gram model predicts each symbol from the few symbols just before it, using counts from a body of text. Generating from longer contexts gives text that looks more and more like the original language.',
 example:'Choosing letters by frequency alone gives gibberish with the right mix of e’s and spaces; choosing by letter triples already produces many real words.',
 desc:'A line of text generated by a model of the chosen order from a small built-in corpus about cats, dogs and birds, the share of its words that are real words of the corpus, and a ladder of the six orders.',
 research:'Shannon (1948). A mathematical theory of communication. Bell System Technical Journal 27, 379–423, 623–656 (section 3, “The series of approximations to English”). Markov (1913) counted letter pairs in Pushkin’s Eugene Onegin.',
 dur:12,hint:'Pick an order and press New sample a few times. Compare letter triples with word pairs. The corpus is tiny, so longer contexts mostly copy it.',
 init:()=>({o:'l3',seed:2}),
 watch(p){return {o:L8_ORDERS[Math.min(5,Math.floor(p*6))][0],seed:2}},
 ui:[{choose:L8_ORDERS.map(o=>[o[0],o[1]]),label:'Model',get:s=>s.o,act:'o'},{b:'New sample',act:'again'}],
 on:{o(s,v){s.o=v},again(s){s.seed++}},
 draw(s){
  const txt=L8_gen(s.o,s.seed),share=L8_realShare(txt);let out=heading('Text generated from counts of what follows what',26);
  out+=R(30,46,540,100,'#fff',C.grid,8);L8_wrap(txt,58).slice(0,4).forEach((l,i)=>out+=TMF(46,72+i*22,l,15,C.ink,'start'));
  out+=TF(30,166,`sample ${s.seed} · ${Math.round(share*100)}% of its words are real words from the corpus`,13,share>.8?C.green:C.ink,'start');
  const bx=30,by=190;L8_ORDERS.forEach(([k,l],i)=>{const on=k===s.o,x=bx+(i%3)*183,y=by+Math.floor(i/3)*44;out+=R(x,y,175,34,on?C.blue:C.pale,'none',8)+TBF(x+87,y+22,l,13,on?'#fff':C.ink)});
  out+=TF(300,296,'corpus: 20 short sentences, 122 words, 25 different words (written for this page)',13,C.muted);
  out+=TF(300,318,'context used:',13,C.muted);
  const ctx={l0:'none (every letter equally likely)',l1:'none (letter frequencies)',l2:'the previous letter',l3:'the previous two letters',w1:'none (word frequencies)',w2:'the previous word'}[s.o];
  out+=TB(300,342,ctx,15,C.ink);
  const phase=s.o==='l0'?'Uniform letters: about one symbol in four would be a space in English, but here it is one in 27.':s.o==='l1'?'Letter frequencies alone give the right mix of letters and word lengths, but almost no real words.':s.o==='l2'||s.o==='l3'?'With one or two letters of context, real words appear: “the”, “cat”, “sat”. The model has no idea of meaning, only of what follows what.':s.o==='w1'?'Real words in a random order: the words are right, the sentences are not.':'Word pairs give locally sensible but globally aimless sentences, the same flavour as Shannon’s second-order word approximation in 1948.';
  return {svg:out,phase};
 }});

SCENE({id:'n-grams-counts',name:'Build a sentence from counts',tag:'Bigram probabilities',
 definition:'A bigram model gives the probability of each next word from how often it followed the current word in its training text: P(next | current) = count(current next) ÷ count(current).',
 example:'In the corpus “the” is followed by something 36 times, 8 of them by “cat”, so P(cat | the) = 8 ÷ 36 ≈ 0.22.',
 desc:'The sentence built so far, bars for every word that followed its last word in the corpus with their counts and probabilities, and the probability of the whole sentence so far.',
 research:'Jelinek (1976). Continuous speech recognition by statistical methods. Proceedings of the IEEE 64(4), 532–556. Jurafsky & Martin (2025). Speech and Language Processing, 3rd ed. draft, chapter 3.',
 dur:12,hint:'Press a bar to add that word. “Most likely” always takes the tallest bar. A full stop ends the sentence; Reset starts again.',
 init:()=>({ws:['the']}),
 watch(p){const ws=['the'];const k=Math.floor(p*7);for(let i=0;i<k;i++){const nx=L8_next(ws[ws.length-1]);if(!nx.length||ws[ws.length-1]==='.')break;ws.push(nx[0][0])}return {ws}},
 ui:[{b:'Most likely',act:'top'},{b:'Undo',act:'undo'}],
 on:{add(s,w){if(s.ws[s.ws.length-1]!=='.'&&s.ws.length<14)s.ws=s.ws.concat(w)},top(s){const nx=L8_next(s.ws[s.ws.length-1]);if(nx.length&&s.ws[s.ws.length-1]!=='.'&&s.ws.length<14)s.ws=s.ws.concat(nx[0][0])},undo(s){if(s.ws.length>1)s.ws=s.ws.slice(0,-1)},reset(s){s.ws=['the']}},
 draw(s,f,X){
  const last=s.ws[s.ws.length-1],nx=last==='.'?[]:L8_next(last),tot=sum(nx.map(p=>p[1]));
  let out=heading('Each next word is chosen by how often it followed the last one',26);
  let pr=(L8_CNT['. '+s.ws[0]]||0)/L8_CTX['.'];for(let i=1;i<s.ws.length;i++)pr*=(L8_CNT[s.ws[i-1]+' '+s.ws[i]]||0)/(L8_CTX[s.ws[i-1]]||1);
  const sent=s.ws.join(' ').replace(/ \./g,'.');out+=R(30,44,540,40,'#fff',C.grid,8)+TMF(46,70,sent+(last==='.'?'':' …'),15,C.ink,'start');
  out+=TF(30,104,`P(sentence so far) = ${pr<1e-4?pr.toExponential(1):pr.toFixed(4)}  ≈ 1 in ${Math.round(1/pr).toLocaleString('en-GB')}`,13,C.ink,'start');
  if(!nx.length){out+=T(300,200,'The sentence has ended. Undo, or Reset to start again.',16,C.muted)}
  else{out+=TF(30,128,`after “${last}” (${tot} times in the corpus):`,13,C.muted,'start');
   const show=nx.slice(0,8),bw=Math.min(62,520/show.length-8);show.forEach(([w,c],i)=>{const x=40+i*(bw+8),h=c/tot*150,inner=R(x,300-h,bw,h,i?C.blue:C.green,'none',4)+TMF(x+bw/2,318,w,13,C.ink)+TF(x+bw/2,300-h-6,(c/tot).toFixed(2),13,C.ink)+TF(x+bw/2,336,`${c}×`,13,C.muted);out+=hit(X,'add',w,`Add “${w}”: followed ${last} ${c} times, probability ${(c/tot).toFixed(2)}`,inner)});
   out+=L(32,300,568,300,C.line,1.5);if(nx.length>8)out+=TF(568,356,`+${nx.length-8} rarer words`,13,C.muted,'end')}
  const phase=last==='.'?`A complete sentence with probability ${pr.toExponential(2)}. Every sentence the model can produce is built only from word pairs it has seen.`:s.ws.length===1?'The sentence starts with “the”. Its probability is how often sentences in the corpus begin with “the”.':`Each word multiplies the sentence’s probability by P(word | previous word), so long sentences quickly become very unlikely.`;
  return {svg:out,phase};
 }});

// Zero counts and add-one smoothing on unseen test sentences.
const L8_TESTS=['the bird sat on the mat .','a cat slept in the tree .','the dog flew over the park .'];
function L8_score(sent,n,smooth){const ws=['.'].concat(sent.split(' ')),V=L8_VOCAB.length,N=L8_TOK.length,rows=[];
 for(let i=1;i<ws.length;i++){const k=Math.min(n-1,i),ctx=ws.slice(i-k,i).join(' '),g=(k?ctx+' ':'')+ws[i],c=L8_CNT[g]||0,cc=k?(L8_CTX[ctx]||0):N;
  const p=smooth?(c+1)/(cc+V):(cc?c/cc:0);rows.push({w:ws[i],g,c,cc,p})}
 const zero=rows.some(r=>r.p===0),lp=zero?-Infinity:sum(rows.map(r=>Math.log(r.p)));return {rows,ppl:zero?Infinity:Math.exp(-lp/rows.length),V}}
SCENE({id:'n-grams-sparsity',name:'The zero problem',tag:'Unseen n-grams and smoothing',
 definition:'However big the training text, most possible word sequences never appear in it. An n-gram model gives them probability zero unless it is smoothed, for example by adding one to every count.',
 example:'“The dog flew over the park” is a grammatical sentence, but the corpus never has “dog flew”, so an unsmoothed bigram model rules it out completely.',
 desc:'A test sentence word by word, each word with the n-gram it is predicted from, its count in the corpus and its probability, marked coral when the count is zero, and the sentence’s perplexity.',
 research:'Chen & Goodman (1999). An empirical study of smoothing techniques for language modeling. Computer Speech & Language 13(4), 359–394. Jelinek & Mercer (1980) interpolation; Kneser & Ney (1995) improved backing-off.',
 dur:12,hint:'Choose a test sentence, the n-gram length and smoothing. Longer n-grams fit the corpus better but hit more zeros.',
 init:()=>({t:2,n:2,sm:false}),
 watch(p){return p<.33?{t:2,n:1,sm:false}:p<.66?{t:2,n:2,sm:false}:{t:2,n:2,sm:true}},
 ui:[{choose:L8_TESTS.map((t,i)=>[String(i),t.replace(' .','')]),label:'Test sentence',get:s=>String(s.t),act:'t'},{choose:[['1','Unigram'],['2','Bigram'],['3','Trigram']],label:'n',get:s=>String(s.n),act:'n'},{choose:[['off','No smoothing'],['on','Add one']],label:'Smoothing',get:s=>s.sm?'on':'off',act:'sm'}],
 on:{t(s,v){s.t=Number(v)},n(s,v){s.n=Number(v)},sm(s,v){s.sm=v==='on'}},
 draw(s){
  const r=L8_score(L8_TESTS[s.t],s.n,s.sm);let out=heading(`${['','Unigram','Bigram','Trigram'][s.n]} model, ${s.sm?'add-one smoothing':'raw counts'}`,26);
  out+=TF(40,56,'word',13,C.muted,'start')+TF(150,56,'predicted from',13,C.muted,'start')+TF(380,56,'count',13,C.muted,'end')+TF(470,56,'probability',13,C.muted,'end');
  r.rows.forEach((row,i)=>{const y=80+i*28,z=row.c===0;out+=R(30,y-18,540,24,z?C.coralp:i%2?'#fff':C.pale,'none',4);
   out+=TMF(40,y,row.w,14,C.ink,'start')+TMF(150,y,row.g.length>24?'…'+row.g.slice(-23):row.g,13,C.muted,'start')+TMF(380,y,`${row.c}/${row.cc}`,13,z?C.coral:C.ink,'end')+TMF(470,y,row.p===0?'0':row.p.toFixed(3),13,row.p===0?C.coral:C.ink,'end');
   out+=R(490,y-12,Math.min(70,row.p*140),12,row.p===0?C.coral:C.blue,'none',3)});
  const y2=80+r.rows.length*28+12;
  out+=TB(300,y2+10,r.ppl===Infinity?'perplexity: infinite (some probability is zero)':`perplexity: ${r.ppl.toFixed(1)}`,16,r.ppl===Infinity?C.coral:C.green);
  out+=TF(300,y2+34,'perplexity: how many equally likely choices the model is torn between, on average',13,C.muted)+TF(300,y2+52,`vocabulary V = ${r.V} tokens, including the full stop`,13,C.muted);
  const zeros=r.rows.filter(x=>x.c===0).map(x=>`“${x.g}”`);
  const phase=!s.sm&&zeros.length?`${zeros.slice(0,2).join(' and ')} ${zeros.length>1?'never occur':'never occurs'} in the corpus, so the model calls this grammatical sentence impossible.`:s.sm?'Adding one to every count moves a little probability to every unseen n-gram. It is crude (it takes too much from the seen ones); better methods such as Kneser–Ney followed.':'Every n-gram here was seen, so the sentence gets a finite probability.';
  return {svg:out,phase};
 }});

/* =========================== word-embeddings =========================== */
// Toy co-occurrence counts: how often each word appears near each context word (hand-set, illustrative).
const L8_CW=['pet','fur','ride','crown','rules','palace','eat','tasty','farm'];
const L8_CO={cat:[9,8,0,0,0,1,2,0,2],dog:[10,7,1,0,0,0,3,0,4],horse:[2,3,9,0,0,1,2,0,8],king:[0,0,2,8,9,7,1,0,0],queen:[1,0,1,9,8,8,1,0,0],prince:[0,0,3,6,4,8,1,0,1],apple:[0,0,0,0,0,0,9,7,5],bread:[0,0,0,0,0,1,10,8,2],cheese:[0,0,0,0,0,0,8,9,4]};
const L8_CWORDS=Object.keys(L8_CO);
SCENE({id:'word-embeddings',name:'Known by the company it keeps',tag:'The distributional hypothesis',
 definition:'Words that occur in similar contexts tend to have similar meanings. Counting each word’s neighbours turns it into a vector, and the angle between two vectors (cosine similarity) measures how alike their contexts are.',
 example:'“Cat” and “dog” both appear near “pet” and “fur”, so their vectors point almost the same way (cosine 0.97); “cat” and “bread” share few contexts (0.15).',
 desc:'A grid of toy counts, words down the side and context words across the top, darker where a word occurs more often near that context, with the chosen word’s nearest neighbours ranked by cosine similarity.',
 research:'Harris (1954). Distributional structure. Word 10, 146–162. Firth (1957). A synopsis of linguistic theory 1930–1955 (“You shall know a word by the company it keeps”). Deerwester et al. (1990). Indexing by latent semantic analysis. JASIS 41(6).',
 dur:11,hint:'Press a word on the left to see its row of counts and its nearest neighbours. The counts are invented for illustration; real systems count over billions of words.',
 init:()=>({w:'cat'}),
 watch(p){return {w:L8_CWORDS[Math.min(8,Math.floor(p*9))]}},
 ui:[{choose:L8_CWORDS.map(w=>[w,w]),label:'Word',get:s=>s.w,act:'w'}],
 on:{w(s,v){s.w=v}},
 draw(s,f,X){
  let out=heading('A word as a row of counts',26);const x0=96,y0=82,cw=30,ch=24,mx=10;
  L8_CW.forEach((c,j)=>out+=TF(x0+j*cw+cw/2+4,y0-8,c,13,C.muted,'start',`transform="rotate(-50 ${fmt(x0+j*cw+cw/2+4)} ${fmt(y0-8)})"`));
  L8_CWORDS.forEach((w,i)=>{const y=y0+i*ch,on=w===s.w;out+=hit(X,'w',w,`Word ${w}`,R(20,y+1,70,ch-2,on?C.blue:'#fff','none',5)+TBF(84,y+ch/2+5,w,13,on?'#fff':C.ink,'end'));
   L8_CO[w].forEach((v,j)=>{out+=R(x0+j*cw,y,cw-2,ch-2,tint(on?C.blue:C.purple,1-v/mx*.85),'none',2)+(v?TF(x0+j*cw+cw/2-1,y+ch/2+4,String(v),13,v>5?'#fff':C.ink):'')})});
  const me=L8_CO[s.w],nb=L8_CWORDS.filter(w=>w!==s.w).map(w=>[w,L8_cos(me,L8_CO[w])]).sort((a,b)=>b[1]-a[1]);
  const rx=400;out+=TBF(rx,74,`nearest to “${s.w}”`,14,C.ink,'start');
  nb.slice(0,5).forEach(([w,c],i)=>{const y=100+i*38;out+=TF(rx,y,w,14,C.ink,'start')+R(rx,y+6,c*130,12,i<2?C.blue:C.line,'none',3)+TF(rx+186,y+16,c.toFixed(2),13,C.muted,'end')});
  out+=TF(rx,300,`least similar: ${nb[nb.length-1][0]} (${nb[nb.length-1][1].toFixed(2)})`,13,C.muted,'start');
  out+=TF(300,322,'cosine similarity: 1 = same direction, 0 = nothing in common',13,C.muted);
  out+=TF(300,344,'toy counts, invented for illustration',13,C.muted);
  return {svg:out,phase:`“${s.w}” is closest to “${nb[0][0]}” (cosine ${nb[0][1].toFixed(2)}). Nobody told the system what any word means: the groups come only from shared contexts.`};
 }});

// Toy 3-dimensional embeddings: royalty, femaleness, age. Real embeddings have hundreds of unlabelled dimensions.
const L8_EMB={man:[.1,.05,.8],woman:[.1,.95,.8],boy:[.05,.05,.15],girl:[.05,.95,.15],king:[.95,.05,.85],queen:[.95,.95,.8],prince:[.9,.05,.2],princess:[.9,.95,.2],child:[.05,.5,.1],monarch:[1,.5,.85],person:[.1,.5,.6]};
const L8_AN=[['king','man','woman'],['prince','boy','girl'],['woman','man','boy'],['king','man','child']];
function L8_analogy(k){const [a,b,c]=L8_AN[k],v=L8_EMB[a].map((x,i)=>x-L8_EMB[b][i]+L8_EMB[c][i]);
 const rank=Object.keys(L8_EMB).map(w=>[w,L8_cos(v,L8_EMB[w])]).sort((x,y)=>y[1]-x[1]);return {a,b,c,v,rank}}
SCENE({id:'word-embeddings-analogy',name:'King − man + woman',tag:'Word vectors and analogies',
 definition:'Word2vec learns a short list of numbers for each word by predicting its neighbours in text. In such spaces some relations look like directions: the step from “man” to “woman” is roughly the same as from “king” to “queen”.',
 example:'king − man + woman lands nearest to queen. But the usual method never lets the answer be one of the three input words, which flatters the results.',
 desc:'A toy space of eleven words placed by royalty and femaleness (with age as a third dimension in 3D), arrows showing the analogy step, and the words ranked by cosine similarity to the result.',
 research:'Mikolov, Chen, Corrado & Dean (2013). Efficient estimation of word representations in vector space. arXiv:1301.3781. Mikolov, Yih & Zweig (2013). Linguistic regularities in continuous space word representations. NAACL. Nissim, van Noord & van der Goot (2020). Fair is better than sensational. Computational Linguistics 46(2).',
 dur:12,hint:'Choose an analogy. The last one asks for a royal child: see where the arithmetic lands when no single word fits. Switch to 3D and turn the space.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:L8_AN.map((a,i)=>[String(i),`${a[0]} − ${a[1]} + ${a[2]}`]),label:'Analogy',get:s=>String(s.k),act:'k'}],
 on:{k(s,v){s.k=Number(v)}},
 draw(s){
  const r=L8_analogy(s.k),px=v=>70+v[0]*220+v[2]*60,py=v=>320-v[1]*220-v[2]*36;let out=heading(`${r.a} − ${r.b} + ${r.c} = ?`,26);
  out+=R(50,60,310,282,'#fff',C.grid,6)+TF(200,362,'royalty →   (age: drawn as a diagonal shift ↗)',13,C.muted)+TF(44,54,'↑ female',13,C.muted,'start');
  Object.entries(L8_EMB).forEach(([w,v])=>{const inp=[r.a,r.b,r.c].includes(w);out+=Ci(px(v),py(v),6,inp?C.amber:C.blue)+TF(px(v)+(v[0]>.5?-10:10),py(v)+5,w,13,C.ink,v[0]>.5?'end':'start')});
  out+=arrow(px(L8_EMB[r.b]),py(L8_EMB[r.b]),px(L8_EMB[r.a]),py(L8_EMB[r.a]),C.amber,2,8,'stroke-dasharray="5 4"');
  out+=arrow(px(L8_EMB[r.c]),py(L8_EMB[r.c]),px(r.v),py(r.v),C.coral,2.4,9);out+=Ci(px(r.v),py(r.v),7,'none',C.coral,'stroke-width="2.5"');
  out+=TBF(380,74,'closest by cosine',14,C.ink,'start');
  r.rank.slice(0,5).forEach(([w,c],i)=>{const inp=[r.a,r.b,r.c].includes(w),y=100+i*34;out+=TF(380,y,w+(inp?' (input)':''),14,inp?C.muted:C.ink,'start')+R(380,y+6,c*120,11,inp?C.line:i===0?C.green:C.blue,'none',3)+TF(566,y+16,c.toFixed(3),13,C.muted,'end')});
  const best=r.rank.find(([w])=>![r.a,r.b,r.c].includes(w));
  out+=TF(380,290,'dashed: '+r.b+' → '+r.a,13,C.amber,'start')+TF(380,308,'solid: the same step from '+r.c,13,C.coral,'start');
  out+=TF(380,340,'toy 3-number vectors, hand-placed',13,C.muted,'start');
  const top=r.rank[0][0];
  const phase=s.k===3?`No word means “royal child” of either sex, so the result sits between prince and princess (best non-input answer: ${best[0]}). Analogies only work where the space happens to contain the word.`:top!==best[0]?`The nearest vector is an input word; the usual method skips it and reports ${best[0]}.`:`The step from ${r.b} to ${r.a}, added to ${r.c}, lands nearest to ${best[0]}. In real 300-number embeddings the match is much rougher.`;
  return {svg:out,phase};
 },
 three(s,f,X,project){
  const r=L8_analogy(s.k),P=project([0,1,0,1,0,1]);let out=axes3(P,['royalty','female','age'],[1.05,1.05,1.05],[0,0,0]);
  out+=arrow3(L8_EMB[r.b],L8_EMB[r.a],P,C.amber,2)+arrow3(L8_EMB[r.c],r.v,P,C.coral,2.6);
  out+=sortedItems(Object.entries(L8_EMB).map(([w,v])=>({at:v,svg:P2=>{const q=P2(v);return Ci(q[0],q[1],6,[r.a,r.b,r.c].includes(w)?C.amber:C.blue)+TF(q[0]+9,q[1]-6,w,13,C.ink,'start')}})).concat([{at:r.v,svg:P2=>{const q=P2(r.v);return Ci(q[0],q[1],8,'none',C.coral,'stroke-width="2.5"')}}]),P);
  return {svg:out,title:'The analogy in three dimensions',caption:'Royalty, femaleness and age as three axes. The coral arrow repeats the amber step from a new starting word. Real embeddings have hundreds of dimensions with no labels.'};
 }});

// Bias in embeddings and why "debiasing" by projection is not enough (toy values).
const L8_OCC=[['engineer',-.62,-.65],['programmer',-.5,-.48],['scientist',-.34,-.32],['doctor',-.18,-.16],['librarian',.28,.2],['receptionist',.45,.36],['nurse',.6,.52],['homemaker',.74,.68]];
SCENE({id:'word-embeddings-bias',name:'Bias in the vectors',tag:'Embeddings learn stereotypes',
 definition:'Embeddings learned from human text absorb its associations, including stereotypes: occupation words sit closer to “he” or to “she” in the way they are used, not the way they are defined.',
 example:'Bolukbasi and colleagues found “man is to computer programmer as woman is to homemaker” in word2vec trained on news text. Removing the he–she direction hides the bias but leaves its traces.',
 desc:'Occupation words plotted along a he–she direction and a second direction, coloured by which side they lean, with an option to remove the he–she component and lines to each word’s nearest neighbour.',
 research:'Bolukbasi, Chang, Zou, Saligrama & Kalai (2016). Man is to computer programmer as woman is to homemaker? NeurIPS. Caliskan, Bryson & Narayanan (2017). Semantics derived automatically from language corpora contain human-like biases. Science 356, 183–186. Gonen & Goldberg (2019). Lipstick on a pig. NAACL.',
 dur:11,hint:'Switch the debiasing on: the words move onto the middle line. Then show neighbours: words still cluster with their old group.',
 init:()=>({deb:false,nb:false}),
 watch(p){return p<.4?{deb:false,nb:false}:p<.7?{deb:true,nb:false}:{deb:true,nb:true}},
 ui:[{choose:[['off','Original'],['on','He–she direction removed']],label:'Vectors',get:s=>s.deb?'on':'off',act:'deb'},{choose:[['off','Hide'],['on','Show']],label:'Nearest neighbours',get:s=>s.nb?'on':'off',act:'nb'}],
 on:{deb(s,v){s.deb=v==='on'},nb(s,v){s.nb=v==='on'}},
 draw(s){
  let out=heading(s.deb?'After removing the he–she component':'Occupation words along the he–she direction',26);
  const px=g=>300+g*210,py=r=>200-r*170;out+=L(80,200,520,200,C.line,1.5)+L(300,40,300,340,C.line,1,'stroke-dasharray="4 4"');
  out+=TBF(70,205,'he',15,C.blue,'end')+TBF(530,205,'she',15,C.coral,'start')+TF(300,356,'← he · · · she →   (vertical: another direction in the space)',13,C.muted);
  const pos=L8_OCC.map(([w,g,r])=>({w,g0:g,x:px(s.deb?0:g),y:py(r),r}));
  if(s.nb)pos.forEach(p=>{const q=pos.filter(o=>o!==p).sort((a,b)=>Math.abs(a.r-p.r)-Math.abs(b.r-p.r))[0];out+=L(p.x,p.y,q.x,q.y,Math.sign(q.g0)===Math.sign(p.g0)?C.green:C.coral,1.6)});
  pos.forEach((p,i)=>{const col=p.g0<0?C.blue:C.coral;out+=Ci(p.x,p.y,6,col)+TF(p.x+(s.deb?(i%2?12:-12):p.g0<0?-10:10),p.y+5,p.w,13,C.ink,s.deb?(i%2?'start':'end'):p.g0<0?'end':'start')});
  const same=pos.filter(p=>{const q=pos.filter(o=>o!==p).sort((a,b)=>Math.abs(a.r-p.r)-Math.abs(b.r-p.r))[0];return Math.sign(q.g0)===Math.sign(p.g0)}).length;
  if(s.nb)out+=TF(560,60,`${same} of 8 nearest neighbours`,13,C.ink,'end')+TF(560,76,'are from the word’s old side',13,C.ink,'end');
  out+=TF(40,60,'toy values; colour = original lean',13,C.muted,'start');
  const phase=!s.deb?'Each word’s position along he–she reflects how the training text used it. The vectors faithfully learned a bias in the data.':!s.nb?'Hard debiasing projects every occupation onto the middle: its he–she score is now zero.':`But the second direction still separates the old groups: ${same} of 8 words’ nearest neighbours lean the same way they did before. Gonen and Goldberg showed the bias is still recoverable.`;
  return {svg:out,phase};
 }});

/* =========================== attention =========================== */
const L8_ATT_TOK=['The','animal','didn’t','cross','the','street','because','it','was','too','tired'];
// Toy attention from "it" (index 7); other tokens attend mostly locally.
function L8_attRow(q,end){const n=L8_ATT_TOK.length,w=Array(n).fill(.02);
 if(q===7){if(end==='tired'){w[1]=.55;w[5]=.08}else{w[5]=.55;w[1]=.08}w[7]=.1;w[10]=.08}
 else{w[q]=.4;if(q>0)w[q-1]+=.2;if(q<n-1)w[q+1]+=.2}
 const S=sum(w);return w.map(v=>v/S)}
SCENE({id:'attention',name:'Where to look',tag:'Attention in a sentence',
 definition:'Attention lets a model build each word’s representation as a weighted mix of all the words in the sentence. The weights say how much each other word matters for this one.',
 example:'In “the animal didn’t cross the street because it was too tired”, “it” should draw mostly on “animal”; change “tired” to “wide” and it should draw on “street”.',
 desc:'The sentence as a row of words, with arcs from the selected word to every other word, thicker for larger attention weights, and a bar chart of the weights.',
 research:'Bahdanau, Cho & Bengio (2015). Neural machine translation by jointly learning to align and translate. ICLR. Vaswani et al. (2017). Attention is all you need. NeurIPS. Uszkoreit (2017), Google Research blog, used this sentence. Jain & Wallace (2019); Wiegreffe & Pinter (2019) debate whether attention weights explain decisions.',
 dur:11,hint:'Press a word to see where it attends. Switch the last word between “tired” and “wide” and watch “it”. The weights are hand-set to illustrate.',
 init:()=>({q:7,end:'tired'}),
 watch(p){return {q:7,end:p<.5?'tired':'wide'}},
 ui:[{choose:[['tired','…too tired'],['wide','…too wide']],label:'Ending',get:s=>s.end,act:'end'}],
 on:{end(s,v){s.end=v},q(s,v){s.q=Number(v)}},
 draw(s,f,X){
  const toks=L8_ATT_TOK.slice();toks[10]=s.end;const w=L8_attRow(s.q,s.end);let out=heading(`Attention from “${toks[s.q]}”`,26);
  const lens=toks.map(t=>t.length*7.6+12),tot=sum(lens)+(toks.length-1)*8;let x=300-tot/2;const xs=[];toks.forEach((t,i)=>{xs.push(x+lens[i]/2);x+=lens[i]+8});
  const yb=190;toks.forEach((t,i)=>{if(i===s.q)return;const a=xs[s.q],b=xs[i],h=20+Math.abs(b-a)*.35;out+=P(`M${fmt(a)} ${yb-16} Q${fmt((a+b)/2)} ${fmt(Math.max(58,yb-16-h*1.4))} ${fmt(b)} ${yb-16}`,C.blue,.6+w[i]*16,'none',`opacity="${(.25+w[i]*1.4).toFixed(2)}"`)});
  x=300-tot/2;toks.forEach((t,i)=>{const on=i===s.q;out+=hit(X,'q',i,`Word ${t}`,R(x,yb-14,lens[i],28,on?C.blue:i===10?C.amberp:C.pale,'none',6)+TF(x+lens[i]/2,yb+5,t,13,on?'#fff':C.ink));x+=lens[i]+8});
  const by=330;out+=L(xs[0]-24,by,xs[10]+24,by,C.line,1.5);
  toks.forEach((t,i)=>{const h=w[i]*170;out+=R(xs[i]-12,by-h,24,h,i===s.q?C.line:C.blue,'none',3)+(w[i]>.07?TF(xs[i],by-h-5,w[i].toFixed(2),13,C.ink):'')});
  out+=TF(300,354,'weights sum to 1 · hand-set to illustrate, not taken from a trained model',13,C.muted);
  const phase=s.q!==7?'Most words attend mainly to themselves and their neighbours here. Press “it” to see a long-distance link.':s.end==='tired'?'Animals get tired, streets do not: “it” draws mostly on “animal”. A trained model has to learn this from text alone.':'Streets are wide, animals are not: now “it” draws mostly on “street”. One word at the end changes where attention goes.';
  return {svg:out,phase};
 }});

// Scaled dot-product attention with four 2-number keys and values.
const L8_KEYS=[['cat',20],['sat',110],['mat',200],['on',300]];
function L8_attCompute(qa,sharp){const q=[Math.cos(qa*Math.PI/180),Math.sin(qa*Math.PI/180)].map(v=>v*1.5),ks=L8_KEYS.map(([w,a])=>[Math.cos(a*Math.PI/180)*1.5,Math.sin(a*Math.PI/180)*1.5]);
 const sc=ks.map(k=>sharp*(q[0]*k[0]+q[1]*k[1])/Math.SQRT2),wt=L8_softmax(sc),out=[sum(ks.map((k,i)=>wt[i]*k[0])),sum(ks.map((k,i)=>wt[i]*k[1]))];return {q,ks,sc,wt,out}}
SCENE({id:'attention-compute',name:'The attention sum',tag:'softmax(q·k / √d) · v',
 definition:'Each word has a query, a key and a value vector. Attention scores every key by its dot product with the query, divides by √d, turns the scores into weights with softmax, and returns the weighted average of the values.',
 example:'A query pointing towards the key of “cat” gives “cat” the largest weight; sharpening the scores pushes almost all the weight onto that one word.',
 desc:'A circle with four key arrows and a query arrow, a table of dot products, scores and softmax weights, and the output vector as the weighted average of the values, here equal to the keys.',
 research:'Vaswani et al. (2017). Attention is all you need. NeurIPS (scaled dot-product attention, equation 1). Bridle (1990) named the softmax function.',
 dur:12,hint:'Turn the query with the angle slider and change the sharpness. Watch the weights, which always add up to 1.',
 init:()=>({qa:40,sharp:1}),
 watch(p){return {qa:Math.round(p*360)%360,sharp:1}},
 ui:[{range:'qa',label:'Query angle',min:0,max:355,step:5,get:s=>s.qa,act:'qa',show:v=>v+'°'},{range:'sharp',label:'Sharpness',min:.25,max:4,step:.25,get:s=>s.sharp,act:'sharp',show:v=>Number(v).toFixed(2)+'×'}],
 on:{qa(s,v){s.qa=Number(v)},sharp(s,v){s.sharp=Number(v)}},
 draw(s){
  const r=L8_attCompute(s.qa,s.sharp),cx=140,cy=200,sc=70;let out=heading('Score every key, softmax, then average the values',26);
  out+=Ci(cx,cy,sc*1.5,'none',C.grid)+L(cx-120,cy,cx+120,cy,C.grid,1)+L(cx,cy-120,cx,cy+120,C.grid,1);
  r.ks.forEach((k,i)=>{out+=arrow(cx,cy,cx+k[0]*sc,cy-k[1]*sc,C.purple,1.5+r.wt[i]*4,8);const lx=cx+k[0]*sc*1.22,ly=cy-k[1]*sc*1.22+5;out+=TBF(lx,ly,L8_KEYS[i][0],13,C.purple)});
  out+=arrow(cx,cy,cx+r.q[0]*sc*.8,cy-r.q[1]*sc*.8,C.coral,3,10)+TF(cx,cy+142,'coral: query · purple: keys',13,C.muted);
  out+=arrow(cx,cy,cx+r.out[0]*sc,cy-r.out[1]*sc,C.green,3,10);out+=TF(cx,cy+160,'green: output (weighted average)',13,C.green);
  const tx=290;['key','q·k','score','weight'].forEach((h,i)=>out+=TBF(tx+20+i*72,74,h,13,C.muted));
  r.ks.forEach((k,i)=>{const y=102+i*32,dot=r.q[0]*k[0]+r.q[1]*k[1];out+=TF(tx+20,y,L8_KEYS[i][0],14,C.purple)+TMF(tx+92,y,dot.toFixed(2),13,C.ink)+TMF(tx+164,y,r.sc[i].toFixed(2),13,C.ink)+R(tx+210,y-12,r.wt[i]*60,14,C.blue,'none',3)+TMF(tx+305,y,r.wt[i].toFixed(2),13,C.ink,'end')});
  out+=TF(tx+150,248,`weights add up to ${sum(r.wt).toFixed(2)}`,13,C.green);
  out+=TF(tx+150,276,`score = sharpness × q·k ÷ √2  (d = 2)`,13,C.muted);
  out+=TF(tx+150,298,`output = (${r.out[0].toFixed(2)}, ${r.out[1].toFixed(2)})`,13,C.ink);
  const top=r.wt.indexOf(Math.max(...r.wt));
  const phase=s.sharp>=3?`Sharp scores make softmax nearly pick one word: “${L8_KEYS[top][0]}” gets ${r.wt[top].toFixed(2)} of the weight.`:s.sharp<=.5?'Blunt scores spread the weight almost evenly, so the output is a blur of all four values.':`The query points closest to “${L8_KEYS[top][0]}”, which gets the largest weight (${r.wt[top].toFixed(2)}); the others still contribute.`;
  return {svg:out,phase};
 }});

SCENE({id:'attention-vs-rnn',name:'One step to anywhere',tag:'Recurrence versus self-attention',
 definition:'A recurrent network reads a sentence one word at a time, so information from the first word passes through every later step to reach the last. Self-attention connects every pair of words directly, at the cost of comparing all pairs.',
 example:'For a 50-word sentence a recurrent network needs 49 steps to carry the first word to the last; self-attention needs one, but computes 2,500 pair scores per layer.',
 desc:'Two diagrams of the same sentence: a chain of steps for a recurrent network and a web of direct links for self-attention, with counts of the path length, sequential steps and work per layer for each.',
 research:'Elman (1990). Finding structure in time. Cognitive Science 14, 179–211. Hochreiter & Schmidhuber (1997). Long short-term memory. Neural Computation 9(8). Vaswani et al. (2017). Attention is all you need, Table 1.',
 dur:11,hint:'Change the sentence length n and the vector width d. Self-attention’s work grows with n²·d, recurrence’s with n·d²: see which is cheaper.',
 init:()=>({n:12,d:64}),
 watch(p){return {n:Math.round(4+p*60),d:64}},
 ui:[{range:'n',label:'Words n',min:4,max:512,step:4,get:s=>s.n,act:'n'},{range:'d',label:'Width d',min:16,max:512,step:16,get:s=>s.d,act:'d'}],
 on:{n(s,v){s.n=Number(v)},d(s,v){s.d=Number(v)}},
 draw(s){
  let out=heading(`A sentence of ${s.n} words`,26);const m=Math.min(s.n,10),xs=range(m).map(i=>70+i*(220/(m-1)));
  out+=TBF(180,56,'recurrent network',14,C.ink)+TBF(450,56,'self-attention',14,C.ink);
  xs.forEach((x,i)=>{out+=Ci(x,110,8,i===0||i===m-1?C.coral:C.blue);if(i)out+=arrow(xs[i-1]+9,110,x-9,110,C.blue,1.6,6)});if(s.n>10)out+=TF(180,140,`(${s.n} words: ${s.n-10} more not drawn)`,13,C.muted);
  const ang=range(m).map(i=>-Math.PI/2+i*2*Math.PI/m),pt=i=>[450+70*Math.cos(ang[i]),130+60*Math.sin(ang[i])];
  for(let i=0;i<m;i++)for(let j=i+1;j<m;j++){const a=pt(i),b=pt(j);out+=L(a[0],a[1],b[0],b[1],(i===0&&j===m-1)?C.coral:C.line,(i===0&&j===m-1)?2.5:1)}
  range(m).forEach(i=>{const p=pt(i);out+=Ci(p[0],p[1],7,i===0||i===m-1?C.coral:C.blue)});
  const rows=[['longest path, first → last word',`${s.n-1} steps`,'1 step'],['steps that must run in order',`${s.n}`,'1'],['work per layer (≈ operations)',(s.n*s.d*s.d).toLocaleString('en-GB'),(s.n*s.n*s.d).toLocaleString('en-GB')]];
  rows.forEach(([l,a,b],i)=>{const y=232+i*32;out+=R(30,y-20,540,28,i%2?'#fff':C.pale,'none',4)+TF(40,y-1,l,13,C.ink,'start')+TBF(390,y-1,a,14,C.blue,'end')+TBF(555,y-1,b,14,C.purple,'end')});
  out+=TF(390,206,'recurrent',13,C.blue,'end')+TF(555,206,'attention',13,C.purple,'end');
  const cheaper=s.n<s.d?'attention':s.n>s.d?'recurrence':'neither';
  out+=TF(300,340,`work: recurrent ≈ n·d², attention ≈ n²·d, so attention is cheaper while n < d (here: ${cheaper})`,13,C.muted);
  return {svg:out,phase:s.n<s.d?'For sentences shorter than the vector width, attention is both cheaper and parallel: every word can be processed at once on a GPU.':'For very long inputs the n² pair scores dominate. Much later work tries to make attention cheaper for long documents.'};
 }});

/* =========================== large-language-models =========================== */
const L8_NEXT=[['mat',3.0],['floor',2.2],['sofa',1.9],['chair',1.5],['roof',.6],['piano',.2],['moon',-.5],['idea',-1.5]];
function L8_dist(t,topP){const pr=L8_softmax(L8_NEXT.map(x=>x[1]),t),idx=pr.map((p,i)=>i).sort((a,b)=>pr[b]-pr[a]);let c=0;const keep=new Set();for(const i of idx){if(topP>=1||c<topP-1e-9||!keep.size){keep.add(i);c+=pr[i]}}
 const kept=pr.map((p,i)=>keep.has(i)?p:0),S=sum(kept);return {pr,keep,final:kept.map(p=>p/S)}}
SCENE({id:'large-language-models',name:'Predict the next token',tag:'Temperature and sampling',
 definition:'A language model outputs a score for every possible next token; softmax turns the scores into probabilities. Temperature sharpens or flattens them, and top-p sampling keeps only the most likely tokens that together make up probability p.',
 example:'After “The cat sat on the”, “mat” is most likely. At low temperature the model nearly always says “mat”; at high temperature even “moon” appears.',
 desc:'A prompt, bars for the probability of eight possible next words at the chosen temperature with words outside the top-p set greyed out, the entropy in bits, and a row of recent samples.',
 research:'Bengio, Ducharme, Vincent & Jauvin (2003). A neural probabilistic language model. JMLR 3, 1137–1155. Holtzman, Buys, Du, Forbes & Choi (2020). The curious case of neural text degeneration. ICLR (top-p, nucleus sampling). Scores here are invented for illustration.',
 dur:12,hint:'Move the temperature and top-p, then press Sample several times. Low temperature is safe and repetitive; high temperature is varied and sometimes absurd.',
 init:()=>({t:1,p:1,samples:[],seed:3}),
 watch(p){return {t:+(0.2+p*1.8).toFixed(2),p:1,samples:[],seed:3}},
 ui:[{range:'t',label:'Temperature',min:.1,max:2,step:.1,get:s=>s.t,act:'t',show:v=>Number(v).toFixed(1)},{range:'p',label:'Top-p',min:.3,max:1,step:.05,get:s=>s.p,act:'p',show:v=>Number(v).toFixed(2)},{b:'Sample',act:'sample'},{b:'Clear samples',act:'clear'}],
 on:{t(s,v){s.t=Number(v)},p(s,v){s.p=Number(v)},clear(s){s.samples=[]},
  sample(s){const d=L8_dist(s.t,s.p),r=rng(s.seed*2654435761>>>0);s.seed++;let u=r(),k=0;for(;k<d.final.length-1;k++){u-=d.final[k];if(u<0)break}s.samples=s.samples.concat(L8_NEXT[k][0]).slice(-8)}},
 draw(s){
  const d=L8_dist(s.t,s.p),H=-sum(d.final.filter(p=>p>0).map(p=>p*Math.log2(p)));let out=heading('“The cat sat on the …”',26);
  const bx=50,by=270,bw=52;out+=L(bx-8,by,bx+8*(bw+12),by,C.line,1.5);
  L8_NEXT.forEach(([w],i)=>{const x=bx+i*(bw+12),on=d.keep.has(i),h=d.final[i]*200;out+=R(x,by-Math.max(h,1),bw,Math.max(h,1),on?C.blue:C.line,'none',4)+TMF(x+bw/2,by+18,w,13,on?C.ink:C.muted)+TF(x+bw/2,by-h-6,on?d.final[i].toFixed(2):'cut',13,on?C.ink:C.muted)});
  out+=TF(560,70,`temperature ${s.t.toFixed(1)} · top-p ${s.p.toFixed(2)}`,13,C.ink,'end')+TF(560,90,`entropy ${H.toFixed(2)} bits`,13,C.purple,'end')+TF(560,110,`${d.keep.size} of 8 words allowed`,13,C.muted,'end');
  out+=TF(40,318,'samples:',13,C.muted,'start');s.samples.forEach((w,i)=>{out+=L8_pill(100+i*60,318,w,w==='mat'?C.greenp:C.pale,C.ink,54)});
  if(!s.samples.length)out+=TF(100,318,'(press Sample)',13,C.muted,'start');
  out+=TF(300,354,'scores (logits) invented for illustration · probabilities renormalised after the top-p cut',13,C.muted);
  const phase=s.t<=.4?'At low temperature almost all the probability goes to “mat”: predictable, and in long texts prone to repeating itself.':s.t>=1.6?'At high temperature the distribution flattens and unlikely words such as “moon” get a real chance.':d.keep.size===1?'With top-p this low only the single most likely word survives, so sampling becomes the same as always taking the top choice.':s.p<.8?'Top-p removes the long tail of unlikely words before sampling, keeping variety among the sensible ones.':'Temperature 1 uses the model’s own probabilities unchanged.';
  return {svg:out,phase};
 }});

// Kaplan et al. 2020 parameter scaling law and the Chinchilla rule of thumb.
const L8_KAP={Nc:8.8e13,a:.076};
const L8_loss=N=>Math.pow(L8_KAP.Nc/N,L8_KAP.a);
const L8_sci=v=>{const e=Math.floor(Math.log10(v)),m=v/Math.pow(10,e);return `${m.toFixed(1)}×10${String(e).split('').map(c=>'⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]||'').join('')}`};
SCENE({id:'large-language-models-scaling',name:'Bigger, steadily better',tag:'Scaling laws',
 definition:'Across many experiments, a language model’s test loss fell smoothly as a power law of its number of parameters, the amount of training text and the compute used. These are empirical fits, not laws of nature.',
 example:'Kaplan and colleagues fitted loss ≈ (8.8×10¹³ ÷ N)^0.076 for N parameters. Hoffmann and colleagues later found that compute is best spent with about 20 training tokens per parameter.',
 desc:'A log–log plot of predicted loss against parameter count with the chosen model marked, and for that size the compute-optimal number of training tokens and the training compute.',
 research:'Kaplan et al. (2020). Scaling laws for neural language models. arXiv:2001.08361. Hoffmann et al. (2022). Training compute-optimal large language models (“Chinchilla”). NeurIPS. Wei et al. (2022) “emergent abilities”, questioned by Schaeffer, Miranda & Koyejo (2023). NeurIPS.',
 dur:11,hint:'Slide the model size. A tenfold increase always cuts the loss by the same fraction: that is what a straight line on log–log axes means.',
 init:()=>({lg:9}),
 watch(p){return {lg:+(6+p*6).toFixed(1)}},
 ui:[{range:'lg',label:'Parameters (log₁₀ N)',min:6,max:12,step:.1,get:s=>s.lg,act:'lg',show:v=>'10^'+Number(v).toFixed(1)}],
 on:{lg(s,v){s.lg=Number(v)}},
 draw(s){
  const N=Math.pow(10,s.lg),Lo=L8_loss(N),D=20*N,Cc=6*N*D;let out=heading('Test loss against model size (log–log)',26);
  const pl=L8_plot(70,50,300,250,[6,12],[Math.log10(1.3),Math.log10(4.2)],{xt:[[6,'10⁶'],[8,'10⁸'],[10,'10¹⁰'],[12,'10¹²']],yt:[[Math.log10(1.5),'1.5'],[Math.log10(2),'2'],[Math.log10(3),'3'],[Math.log10(4),'4']],xl:'parameters N',yl:'loss (nats per token)'});out+=pl.svg;
  out+=L8_poly(range(61).map(i=>{const x=6+i/10;return [pl.X(x),pl.Y(Math.log10(L8_loss(Math.pow(10,x))))]}),C.blue,2.6);
  out+=Ci(pl.X(s.lg),pl.Y(Math.log10(Lo)),7,C.coral)+L(pl.X(s.lg),pl.Y(Math.log10(Lo)),pl.X(s.lg),300,C.coral,1,'stroke-dasharray="3 3"');
  const rx=395;out+=TBF(rx,74,'for this model',14,C.ink,'start');
  [['parameters',L8_sci(N)],['predicted loss',Lo.toFixed(2)+' nats'],['tokens, Chinchilla rule',L8_sci(D)],['training compute ≈ 6ND',L8_sci(Cc)+' FLOP']].forEach(([l,v],i)=>{out+=TF(rx,104+i*44,l,13,C.muted,'start')+TBF(rx,122+i*44,v,15,C.ink,'start')});
  out+=TF(rx,300,'×10 parameters → loss × '+Math.pow(10,-L8_KAP.a).toFixed(3),13,C.purple,'start');
  out+=TF(300,354,'Kaplan et al. 2020 fit; a straight line on log–log axes means a power law',13,C.muted);
  return {svg:out,phase:s.lg>=11?'Extrapolating a fit far beyond the sizes it was measured on is risky, and lower loss does not by itself say which abilities appear.':'The curve has no sudden jumps. Claims that abilities “emerge” suddenly may partly reflect how they are scored (Schaeffer and colleagues, 2023).'};
 }});

// Byte-pair encoding on the toy vocabulary of Sennrich et al. (2016).
const L8_BPE_WORDS=[['low',5],['lower',2],['newest',6],['widest',3]];
function L8_bpe(k){let segs=L8_BPE_WORDS.map(([w,c])=>({sym:w.split('').concat('_'),c}));const merges=[];
 for(let step=0;step<k;step++){const cnt={};segs.forEach(({sym,c})=>{for(let i=0;i+1<sym.length;i++){const p=sym[i]+' '+sym[i+1];cnt[p]=(cnt[p]||0)+c}});
  const best=Object.entries(cnt).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0];if(!best)break;const [x,y]=best[0].split(' ');merges.push([x+y,best[1]]);
  segs=segs.map(({sym,c})=>{const o=[];for(let i=0;i<sym.length;i++){if(i+1<sym.length&&sym[i]===x&&sym[i+1]===y){o.push(x+y);i++}else o.push(sym[i])}return {sym:o,c}})}
 const total=sum(segs.map(s=>s.sym.length*s.c)),vocab=new Set(['l','o','w','e','r','n','s','t','i','d','_'].concat(merges.map(m=>m[0])));return {segs,merges,total,vocab:vocab.size}}
SCENE({id:'large-language-models-tokens',name:'What is a token?',tag:'Byte-pair encoding',
 definition:'Language models read text as tokens: frequent words become single tokens and rare words are split into pieces. Byte-pair encoding builds the pieces by repeatedly merging the most frequent adjacent pair of symbols.',
 example:'In a text with many “newest” and “widest”, the first merges are e+s, then es+t: “est” becomes a token because it is common.',
 desc:'Four words with their counts, each split into its current tokens, the list of merges so far, and the total number of tokens needed for the text and the size of the vocabulary.',
 research:'Gage (1994). A new algorithm for data compression. C Users Journal. Sennrich, Haddow & Birch (2016). Neural machine translation of rare words with subword units. ACL (the low/lower/newest/widest example). Petrov et al. (2023). Language model tokenizers introduce unfairness between languages. NeurIPS.',
 dur:11,hint:'Press Merge to apply the next most frequent pair. Watch the token count fall and the vocabulary grow.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(10,Math.floor(p*11))}},
 ui:[{b:'Merge',act:'more'},{b:'Undo',act:'less'}],
 on:{more(s){s.k=Math.min(12,s.k+1)},less(s){s.k=Math.max(0,s.k-1)},reset(s){s.k=0}},
 draw(s){
  const r=L8_bpe(s.k);let out=heading(`After ${s.k} merge${s.k===1?'':'s'}`,26);
  r.segs.forEach(({sym,c},i)=>{const y=70+i*44;out+=TF(36,y+5,`×${c}`,13,C.muted,'start');let x=74;sym.forEach(t=>{const w=t.length*9+14;out+=R(x,y-14,w,26,t.length>1?C.blue:C.pale,'none',5)+TMF(x+w/2,y+4,t,14,t.length>1?'#fff':C.ink);x+=w+4})});
  out+=TF(36,262,'_ marks the end of a word',13,C.muted,'start');
  out+=TBF(400,62,'merges',14,C.ink,'start')+(r.merges.length?'':TF(400,86,'(none yet)',13,C.muted,'start'));r.merges.slice(-9).forEach(([m,c],i)=>out+=TMF(400,86+i*20,`${r.merges.length-Math.min(9,r.merges.length)+i+1}. ${m}  (${c}×)`,13,C.ink,'start'));
  out+=counter(70,285,'tokens for the text',String(r.total),C.blue,150)+counter(240,285,'vocabulary size',String(r.vocab),C.purple,150);
  out+=TF(300,356,'Tokenisers trained mostly on English split other scripts into more, smaller pieces.',13,C.muted);
  return {svg:out,phase:s.k===0?'Every character, plus the end-of-word mark, is its own token: these 16 words need 95 tokens.':s.k<4?'The commonest pairs merge first. Frequent endings such as “est” become single tokens.':'Whole frequent words are now single tokens. The model never sees letters inside them, which is one reason language models struggle to count letters.'};
 }});

/* =========================== understanding-debate =========================== */
const L8_OCT=[
 {t:'Two people on separate islands chat over a telegraph cable.',a:'How is the weather?',b:'Sunny, warm.'},
 {t:'A clever octopus taps the cable. It sees only the patterns of the signals.',a:'Lovely day again.',b:'Yes, sunny.',oct:1},
 {t:'The octopus cuts B off and answers A itself, copying the patterns it learned.',a:'I made coconut wine.',b:'Sounds nice!',oct:2},
 {t:'A meets something new: a bear. Form alone gives the octopus no idea what to say.',a:'A bear! How do I use these sticks to fight it?',b:'??? (only fluent-sounding text)',oct:2},
 {t:'Critics reply that enough text may carry information about the world. The question is open.',a:'',b:'',oct:3}
];
SCENE({id:'understanding-debate',name:'The octopus test',tag:'Form, meaning and understanding',
 definition:'Bender and Koller argued that a system trained only on the form of language, with no access to what words refer to, cannot learn meaning in the full sense, however fluent it becomes.',
 example:'An octopus listening to a telegraph cable could learn to reply plausibly about the weather, but not to help someone build a weapon against a bear, because it has never seen sticks or bears.',
 desc:'Two islands joined by a cable, an octopus tapping it, and speech bubbles for the conversation at each of five steps of the thought experiment.',
 research:'Bender & Koller (2020). Climbing towards NLU: on meaning, form, and understanding in the age of data. ACL. Harnad (1990). The symbol grounding problem. Physica D 42, 335–346. Mitchell & Krakauer (2023). The debate over understanding in AI’s large language models. PNAS 120(13).',
 dur:12,hint:'Step through the thought experiment. At the last step, read how critics reply.',
 init:()=>({k:0}),
 watch(p){return {k:Math.min(4,Math.floor(p*5))}},
 ui:[{b:'Next step',act:'next'},{b:'Back',act:'back'}],
 on:{next(s){s.k=Math.min(4,s.k+1)},back(s){s.k=Math.max(0,s.k-1)}},
 draw(s){
  const e=L8_OCT[s.k];let out=heading(`Step ${s.k+1} of 5`,26);
  out+=P('M30 260 Q90 220 150 260 Z',C.green,2,C.greenp)+P('M450 260 Q510 220 570 260 Z',C.green,2,C.greenp);
  out+=Ci(90,226,10,C.blue)+TBF(90,282,'A',15,C.ink)+(e.oct>=2?TF(510,282,'B (cut off)',13,C.muted):TBF(510,282,'B',15,C.ink))+Ci(510,226,10,e.oct>=2?C.line:C.blue);
  out+=P('M100 262 Q300 330 500 262',C.muted,2)+(e.oct>=2?L(470,276,486,292,C.coral,3)+L(486,276,470,292,C.coral,3):'');
  if(e.oct){out+=Ci(300,312,18,C.purple)+range(6).map(i=>P(`M${284+i*6.4} 326 q-4 14 ${(i-2.5)*4} 22`,C.purple,3)).join('')+Ci(294,308,3,'#fff')+Ci(306,308,3,'#fff')}
  if(e.a){out+=R(40,90,230,72,'#fff',C.blue,10)+L8_wrap(e.a,30).map((l,i)=>TF(155,116+i*18,l,13,C.ink)).join('')+TF(155,182,'A says',13,C.muted)}
  if(e.b){out+=R(330,90,230,72,'#fff',e.oct>=2?C.purple:C.blue,10)+L8_wrap(e.b,30).map((l,i)=>TF(445,116+i*18,l,13,C.ink)).join('')+TF(445,182,e.oct>=2?'the octopus replies':'B replies',13,C.muted)}
  if(s.k===4){out+=R(40,70,520,130,'#fff',C.grid,10);['Bender & Koller: meaning needs a link between form and the world.','Replies: text describes the world, so form may carry some of it;','models given images or actions are partly grounded;','probing studies find internal models of space, time and board games.'].forEach((l,i)=>out+=TF(300,100+i*26,l,13,i?C.ink:C.purple))}
  out+=T(300,352,e.t,14,C.ink);
  return {svg:out,phase:s.k===3?'The octopus has only ever seen patterns of dots and dashes. Nothing in them links “bear” to an animal, so it cannot work out a useful answer.':s.k===4?'This is a live debate, not a settled result: researchers disagree about what “understanding” requires and how to test for it.':'So far, matching patterns is enough: A cannot tell that anything has changed.'};
 }});

// Evidence and arguments, each placed by what it is (argument or experiment) and what it bears on.
const L8_POS=[
 {y:1950,who:'Turing',k:'arg',crit:'beh',claim:'If its conversation cannot be told from a person’s, stop asking whether it “really” thinks.'},
 {y:1980,who:'Searle',k:'arg',crit:'gro',claim:'Following symbol rules, as in his “Chinese room”, is not understanding them.'},
 {y:1990,who:'Harnad',k:'arg',crit:'gro',claim:'Symbols must be grounded in perception to mean anything.'},
 {y:2020,who:'Bender & Koller',k:'arg',crit:'gro',claim:'Training on form alone cannot yield meaning (the octopus).'},
 {y:2021,who:'Bender, Gebru et al.',k:'arg',crit:'beh',claim:'Fluent output invites us to see understanding that is not there: “stochastic parrots”.'},
 {y:2023,who:'Li et al.',k:'exp',crit:'int',claim:'A model trained only on Othello move lists builds an internal map of the board.'},
 {y:2024,who:'Gurnee & Tegmark',k:'exp',crit:'int',claim:'Language models contain linear representations of place and time.'},
 {y:2023,who:'Mitchell & Krakauer',k:'arg',crit:'all',claim:'Survey: the field is split; “understanding” may need new, sharper concepts.'}
];
SCENE({id:'understanding-debate-positions',name:'What would count as understanding?',tag:'Arguments and experiments',
 definition:'People disagree partly because they use different tests of understanding: behaving like an understander, having internal models of the world, or having symbols grounded in perception and action.',
 example:'A model whose hidden states encode an Othello board passes an internal-model test while still failing a strict grounding test.',
 desc:'Cards for eight arguments and experiments from 1950 to 2024, arranged in time, highlighted according to the chosen test of understanding, with the selected card’s claim in full.',
 research:'Turing (1950). Computing machinery and intelligence. Mind 59, 433–460. Searle (1980). Minds, brains, and programs. BBS 3, 417–457. Bender, Gebru, McMillan-Major & Shmitchell (2021). On the dangers of stochastic parrots. FAccT. Li et al. (2023). Emergent world representations. ICLR. Gurnee & Tegmark (2024). Language models represent space and time. ICLR.',
 dur:12,hint:'Choose a test of understanding to see which cards bear on it, and press a card to read its claim.',
 init:()=>({crit:'gro',sel:3}),
 watch(p){const k=Math.min(7,Math.floor(p*8));return {crit:L8_POS[k].crit==='all'?'beh':L8_POS[k].crit,sel:k}},
 ui:[{choose:[['beh','Behaviour'],['int','Internal model'],['gro','Grounding']],label:'Test',get:s=>s.crit,act:'crit'}],
 on:{crit(s,v){s.crit=v},sel(s,v){s.sel=Number(v)}},
 draw(s,f,X){
  let out=heading({beh:'Test: does it behave like an understander?',int:'Test: does it build a model of the world inside?',gro:'Test: are its words tied to perception and action?'}[s.crit],26);
  L8_POS.forEach((c,i)=>{const col=i%4,row=Math.floor(i/4),x=30+col*137,y=54+row*92,on=c.crit===s.crit||c.crit==='all',sel=i===s.sel;
   out+=hit(X,'sel',i,`${c.who} ${c.y}`,R(x,y,128,80,sel?C.blue:on?C.pale:'#fff',sel?C.blue:on?C.blue:C.grid,8)+TBF(x+64,y+22,c.who.length>16?c.who.slice(0,15)+'…':c.who,13,sel?'#fff':C.ink)+TF(x+64,y+42,String(c.y),13,sel?'#fff':C.muted)+TF(x+64,y+64,c.k==='exp'?'experiment':'argument',13,sel?'#fff':c.k==='exp'?C.green:C.purple))});
  const c=L8_POS[s.sel];out+=R(30,250,540,74,'#fff',C.grid,8)+TBF(46,272,`${c.who} (${c.y})`,14,C.ink,'start');L8_wrap(c.claim,72).forEach((l,i)=>out+=TF(46,294+i*18,l,13,C.ink,'start'));
  out+=TF(300,350,'blue outline: bears on the chosen test · green: experiments · purple: arguments',13,C.muted);
  return {svg:out,phase:'The experiments are recent and narrow; the arguments are older and broad. Which you find convincing depends on which test you think matters, and that is still disputed.'};
 }});

// Winograd-style pronoun puzzles, written for this page. Each pair differs by one word that flips the answer.
const L8_WG=[
 {s:'The lorry overtook the bicycle because it was going faster.',o:['the lorry','the bicycle'],a:0},
 {s:'The lorry overtook the bicycle because it was going slower.',o:['the lorry','the bicycle'],a:1},
 {s:'Ana lent Mira her umbrella because she had forgotten hers.',o:['Ana','Mira'],a:1},
 {s:'Ana lent Mira her umbrella because she had a spare one.',o:['Ana','Mira'],a:0},
 {s:'The branch could not hold the cat because it was too thin.',o:['the branch','the cat'],a:0},
 {s:'The branch could not hold the cat because it was too heavy.',o:['the branch','the cat'],a:1},
 {s:'Tom asked Raj for directions because he was lost.',o:['Tom','Raj'],a:0},
 {s:'Tom asked Raj for directions because he knew the town.',o:['Tom','Raj'],a:1}
];
const L8_wgSim=()=>({phase:'done',order:range(8),i:8,resp:L8_WG.map((w,k)=>({k,ok:k!==5,rt:1.6+((k*37)%11)/10})),sim:true});
SCENE({id:'understanding-debate-winograd',name:'Who is “it”?',tag:'Winograd schemas: you take part',
 definition:'A Winograd schema is a pair of sentences that differ in one word, which flips what a pronoun refers to. People solve them with everyday knowledge; they were proposed as a harder test than open conversation.',
 example:'“The trophy didn’t fit in the suitcase because it was too big”: “it” is the trophy. Change “big” to “small” and “it” is the suitcase.',
 desc:'One sentence at a time with two buttons for what the pronoun refers to; at the end, your accuracy and average time beside the human accuracy reported for a large benchmark.',
 research:'Levesque, Davis & Morgenstern (2012). The Winograd schema challenge. KR (the trophy example). Sakaguchi et al. (2020). WinoGrande. AAAI (human accuracy 94%). Kocijan, Davis, Lukasiewicz, Marcus & Morgenstern (2023). The defeat of the Winograd schema challenge. Artificial Intelligence 325.',
 dur:10,hint:'Press Start, then choose who or what the pronoun refers to. Eight sentences, written for this page. Your answers stay on this page.',
 init:()=>({phase:'ready',order:[],i:0,resp:[],t0:0}),
 watch(p){return p<.4?{phase:'run',order:range(8),i:Math.floor(p*10),resp:[],sim:true}:L8_wgSim()},
 ui:[{b:'Start',act:'start'}],
 on:{start(s){s.phase='run';s.order=shuffled(range(8),nextSeed());s.i=0;s.resp=[];s.t0=performance.now()},
  ans(s,v){if(s.phase!=='run')return;const k=s.order[s.i],rt=(performance.now()-s.t0)/1000;s.resp.push({k,ok:Number(v)===L8_WG[k].a,rt});s.i++;s.t0=performance.now();if(s.i>=8)s.phase='done'}},
 draw(s,f,X){
  let out=heading(s.sim?'Simulated participant (Watch)':'Who or what does the pronoun refer to?',26);
  if(s.phase==='ready'){out+=T(300,150,'Eight short sentences. For each, choose what the pronoun refers to.',16,C.ink)+T(300,180,'Answer as quickly and accurately as you can.',15,C.muted)+TF(300,230,'Example: “The trophy didn’t fit in the suitcase because it was too big.” → the trophy',13,C.muted);return {svg:out,phase:'Press Start to begin.'}}
  if(s.phase==='run'){const w=L8_WG[s.order[s.i]];out+=TF(300,60,`sentence ${s.i+1} of 8`,13,C.muted);
   L8_wrap(w.s,46).forEach((l,i)=>out+=T(300,120+i*28,l,19,C.ink));
   w.o.forEach((o,i)=>{const x=120+i*200;out+=hit(X,'ans',i,`It refers to ${o}`,R(x,220,160,52,C.pale,C.blue,10)+TB(x+80,252,o,17,C.ink))});
   return {svg:out,phase:'One word in each sentence decides the answer.'}}
  const n=s.resp.length,ok=s.resp.filter(r=>r.ok).length,rt=sum(s.resp.map(r=>r.rt))/n;
  const bx=110,by=280;out+=L(bx-20,by,bx+330,by,C.line,1.5);
  [[s.sim?'simulated':'you',ok/n,C.blue],['people, WinoGrande',.94,C.green]].forEach(([l,v,col],i)=>{const x=bx+i*170,h=v*190;out+=R(x,by-h,120,h,col,'none',5)+TBF(x+60,by-h-8,Math.round(v*100)+'%',15,C.ink)+TF(x+60,by+18,l,13,C.ink)});
  out+=TF(470,110,`${ok} of ${n} right`,15,C.ink,'start')+TF(470,134,`mean ${rt.toFixed(1)} s each`,13,C.muted,'start');
  const wrong=s.resp.filter(r=>!r.ok).map(r=>L8_WG[r.k]);if(wrong.length)out+=TF(470,166,'missed:',13,C.coral,'start')+L8_wrap(wrong[0].s,22).slice(0,4).map((l,i)=>TF(470,184+i*16,l,13,C.muted,'start')).join('');
  out+=TF(300,350,'Large models reached around 90% on such tests by about 2019–2020 (Kocijan et al. 2023 review).',13,C.muted);
  return {svg:out,phase:'Machines now score close to people on these benchmarks. Kocijan and colleagues argue that this says less about understanding than was hoped, because models can exploit statistical cues in the datasets.'};
 }});
