/* ===================== Language era 3 · Structure (1916–1960) ===================== */
// Shared helpers for this era (prefix L3_).
const L3_IPA=`font-family="'Noto Sans','Segoe UI Symbol','DejaVu Sans',sans-serif"`;
const L3_mean=a=>a.length?sum(a)/a.length:0;
// A plot frame: ranges [lo,hi]; ticks as [value,label]. Returns {svg,X,Y}.
function L3_plot(x,y,w,h,[x0,x1],[y0,y1],xt,yt,xl,yl){
 const X=v=>x+w*clamp((v-x0)/(x1-x0),0,1),Y=v=>y+h-h*clamp((v-y0)/(y1-y0),0,1);
 let s=R(x,y,w,h,'#fff',C.grid,6);
 for(const [v,l] of yt)s+=L(x,Y(v),x+w,Y(v),'#eef3f6',1)+TF(x-7,Y(v)+5,l,13,C.muted,'end');
 for(const [v,l] of xt)s+=L(X(v),y+h,X(v),y+h+5,C.line,1.5)+TF(X(v),y+h+18,l,13,C.muted);
 if(xl)s+=TF(x+w/2,y+h+35,xl,13,C.muted);
 if(yl)s+=TF(x-40,y+h/2,yl,13,C.muted,'middle',`transform="rotate(-90 ${fmt(x-40)} ${fmt(y+h/2)})"`);
 return {svg:s,X,Y};
}
// Least-squares line y = a + b·x; null if there is too little spread.
function L3_fit(pts){
 if(pts.length<2)return null;const n=pts.length,mx=sum(pts.map(p=>p[0]))/n,my=sum(pts.map(p=>p[1]))/n;
 const sxx=sum(pts.map(p=>(p[0]-mx)**2));if(sxx<1e-9)return null;
 const b=sum(pts.map(p=>(p[0]-mx)*(p[1]-my)))/sxx;return {a:my-b*mx,b};
}
function L3_corr(pts){
 if(pts.length<3)return 0;const n=pts.length,mx=sum(pts.map(p=>p[0]))/n,my=sum(pts.map(p=>p[1]))/n;
 const sxy=sum(pts.map(p=>(p[0]-mx)*(p[1]-my))),sxx=sum(pts.map(p=>(p[0]-mx)**2)),syy=sum(pts.map(p=>(p[1]-my)**2));
 return sxx>0&&syy>0?sxy/Math.sqrt(sxx*syy):0;
}
const L3_poly=(pts,col=C.blue,w=2.5,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L'),col,w,'none',extra):'';
// A response button drawn inside the diagram.
const L3_key=(X,act,arg,label,x,y,w,h,text,on=false,col=C.blue,size=15,dim=false)=>hit(X,act,arg,label,R(x,y,w,h,dim?'#eef2f4':on?C.pale:'#fff',on?col:C.line,8)+TBF(x+w/2,y+h/2+size*.36,text,size,dim?C.line:C.ink));
function L3_wrap(s,n){const words=s.split(' '),lines=[];let cur='';for(const w of words){if(cur&&(cur+' '+w).length>n){lines.push(cur);cur=w}else cur=cur?cur+' '+w:w}if(cur)lines.push(cur);return lines}
// One line of text built from coloured pieces: parts = [[text, colour, bold?], …].
function L3_rich(x,y,parts,size=15,anchor='start',mono=true){
 return `<text x="${fmt(x)}" y="${fmt(y)}" font-size="${size}" text-anchor="${anchor}"${mono?' class="mono"':''}>`+parts.map(([t,c,b])=>`<tspan fill="${c||C.ink}"${b?' font-weight="700"':''}>${esc(t)}</tspan>`).join('')+'</text>';
}
const L3_MEMO={};
const L3_memo=(k,f)=>L3_MEMO[k]||(L3_MEMO[k]=f());

// A public-domain text for counting: the opening of Alice’s Adventures in Wonderland (Lewis Carroll, 1865).
const L3_ALICE=`Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, “and what is the use of a book,” thought Alice “without pictures or conversations?” So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her. There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, “Oh dear! Oh dear! I shall be late!” (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge. In another moment down went Alice after it, never once considering how in the world she was to get out again. The rabbit-hole went straight on like a tunnel for some way, and then dipped suddenly down, so suddenly that Alice had not a moment to think about stopping herself before she found herself falling down a very deep well. Either the well was very deep, or she fell very slowly, for she had plenty of time as she went down to look about her and to wonder what was going to happen next. First, she tried to look down and make out what she was coming to, but it was too dark to see anything; then she looked at the sides of the well, and noticed that they were filled with cupboards and book-shelves; here and there she saw maps and pictures hung upon pegs. She took down a jar from one of the shelves as she passed; it was labelled “ORANGE MARMALADE”, but to her great disappointment it was empty: she did not like to drop the jar for fear of killing somebody underneath, so managed to put it into one of the cupboards as she fell past it. “Well!” thought Alice to herself, “after such a fall as this, I shall think nothing of tumbling down stairs! How brave they’ll all think me at home! Why, I wouldn’t say anything about it, even if I fell off the top of the house!” (Which was very likely true.) Down, down, down. Would the fall never come to an end? “I wonder how many miles I’ve fallen by this time?” she said aloud. “I must be getting somewhere near the centre of the earth. Let me see: that would be four thousand miles down, I think—” (for, you see, Alice had learnt several things of this sort in her lessons in the schoolroom, and though this was not a very good opportunity for showing off her knowledge, as there was no one to listen to her, still it was good practice to say it over) “—yes, that’s about the right distance—but then I wonder what Latitude or Longitude I’ve got to?” (Alice had no idea what Latitude was, or Longitude either, but thought they were nice grand words to say.)`;
const L3_tokens=t=>t.toLowerCase().replace(/’/g,"'").match(/[a-z]+(?:'[a-z]+)?/g)||[];
function L3_rank(words){const c={};for(const w of words)c[w]=(c[w]||0)+1;return Object.entries(c).sort((a,b)=>b[1]-a[1]||(a[0]<b[0]?-1:1))}
const L3_AW=L3_tokens(L3_ALICE);
// Miller’s (1957) monkey: random letters and spaces, cut into “words” at the spaces.
function L3_monkey(letters,spaceP,seed,n=3000){const r=rng(seed),ab='abcdefghijklmnopqrstuvwxyz'.slice(0,letters);let t='';for(let i=0;i<n;i++)t+=r()<spaceP?' ':ab[Math.floor(r()*letters)];return t.split(' ').filter(Boolean)}
// Upper-case letters and single spaces only, for the letter-level models.
const L3_LETTERS=L3_ALICE.toUpperCase().replace(/[’']/g,'').replace(/[^A-Z]+/g,' ').trim();
const L3_SYMS='ABCDEFGHIJKLMNOPQRSTUVWXYZ ';

/* ======================= Lesson: saussure-sign ======================= */
const L3_LANGS=['English','French','German','Spanish','Swahili','Finnish','Turkish','Japanese','Mandarin','Hindi'];
const L3_SIGNS={
 tree:['tree','arbre','Baum','árbol','mti','puu','ağaç','ki','shù','peṛ'],
 dog:['dog','chien','Hund','perro','mbwa','koira','köpek','inu','gǒu','kuttā'],
 water:['water','eau','Wasser','agua','maji','vesi','su','mizu','shuǐ','pānī'],
 moon:['moon','lune','Mond','luna','mwezi','kuu','ay','tsuki','yuèliang','chā̃d'],
 woof:['woof','ouaf','wau wau','guau','—','hau hau','hav hav','wan wan','wāng wāng','bhau bhau']};
const L3_CONCEPTS=[['tree','a tree'],['dog','a dog'],['water','water'],['moon','the moon'],['woof','a dog’s bark']];
function L3_icon(k,x,y){
 if(k==='tree')return R(x-8,y+5,16,40,'#8a6a4a','none',3)+Ci(x,y-15,34,C.green)+Ci(x-24,y,20,C.green)+Ci(x+24,y,20,C.green);
 if(k==='dog'||k==='woof'){let s=P(`M${x-38} ${y+5}Q${x-40} ${y-18} ${x-12} ${y-16}L${x+14} ${y-16}Q${x+22} ${y-36} ${x+40} ${y-30}Q${x+48} ${y-20} ${x+38} ${y-8}L${x+30} ${y+2}Q${x+26} ${y+12} ${x+18} ${y+12}L${x-30} ${y+12}Z`,C.ink,2,'#c9a77c');
  s+=L(x-28,y+12,x-28,y+34,C.ink,4)+L(x-12,y+12,x-12,y+34,C.ink,4)+L(x+12,y+12,x+12,y+34,C.ink,4)+L(x+24,y+10,x+24,y+34,C.ink,4)+Ci(x+34,y-22,2.5,C.ink);
  if(k==='woof')s+=P(`M${x+44} ${y-46}l12 -8M${x+48} ${y-32}h15M${x+44} ${y-18}l12 8`,C.coral,3);return s}
 if(k==='water'){let s='';for(let i=0;i<4;i++)s+=P(`M${x-44} ${y-24+i*16}q11 -9 22 0t22 0t22 0t22 0`,C.blue,3);return s}
 return Ci(x,y,34,'#f3d27a')+Ci(x+17,y-10,30,'#f6f9fb');
}
SCENE({id:'saussure-sign',name:'The arbitrary sign',tag:'Saussure',
 definition:'Ferdinand de Saussure described a word as a sign with two sides joined in the mind: the signified (the concept) and the signifier (the sound pattern). The link between them is arbitrary: nothing about the sounds of tree makes it fit trees, which is why every language uses different ones.',
 example:'A tree is tree, arbre, Baum, árbol, mti, puu, ağaç and ki. Even words that copy a sound, like a dog’s bark, differ: woof, ouaf, wau wau, wan wan, hav hav.',
 research:'Saussure, F. de (1916). Cours de linguistique générale, edited from students’ lecture notes by Bally & Sechehaye. Arbitrariness is a strong tendency, not an absolute rule: sound symbolism exists (next scene).',
 desc:'A picture of one concept beside the word for it in ten languages, with Saussure’s two-sided sign drawn as an oval: concept above, sound pattern below.',
 dur:10,hint:'Choose a concept and compare the words. Try “a dog’s bark”: even imitative words are shaped by each language’s own sounds. Spellings are romanised.',
 init:()=>({k:'tree'}),
 watch(p){return {k:L3_CONCEPTS[Math.min(4,Math.floor(p*5))][0]}},
 ui:[{choose:L3_CONCEPTS,label:'Concept',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v}},
 draw(s){
  const k=s.k,words=L3_SIGNS[k],name=L3_CONCEPTS.find(c=>c[0]===k)[1];
  let out=heading(k==='woof'?'Copying a sound: similar, never the same':'One idea, ten unrelated words');
  out+=R(24,50,160,150,'#f6f9fb',C.grid,10)+L3_icon(k,104,116)+TF(104,192,name,13,C.muted);
  out+=R(34,216,140,112,'#fff',C.blue,56)+L(42,272,166,272,C.blue,1.5);
  out+=TF(104,240,'signified',13,C.muted)+TBF(104,260,name,14,C.ink)+TF(104,292,'signifier',13,C.muted)+TBF(104,312,`“${words[0]}”`,14,C.blue);
  L3_LANGS.forEach((lg,i)=>{const c=i%2,r=Math.floor(i/2),x=200+c*192,y=50+r*56;
   out+=R(x,y,184,48,'#fff',C.grid,8)+TF(x+10,y+19,lg,13,C.muted,'start')+TBF(x+10,y+40,words[i],17,words[i]==='—'?C.line:C.ink,'start',L3_IPA)});
  out+=TF(390,354,'Spellings romanised; tones and long vowels marked',13,C.muted);
  return {svg:out,phase:k==='woof'?'Imitative words share a family likeness because they copy a real sound, but each language fits the bark to its own sound system. That is Saussure’s point: even here the form is partly convention.':'The concept is the same everywhere; the sounds share nothing. Learning a word means learning a convention your community agreed on, not discovering a natural name.'};
 }});

// Bouba–kiki: [rounded name, sharp name, made up for this page?]
const L3_BK=[['bouba','kiki',0],['maluma','takete',0],['lomo','kitik',1],['mula','tizzi',1]];
const L3_BK_SIM={order:[0,3,5,6,1,2,7,4],sides:[0,1,1,0,1,0,0,1],ans:[1,1,1,1,1,0,1,1]};
function L3_blob(x,y,r,col){const pts=range(73).map(i=>{const a=i/72*2*Math.PI,q=r*(1+.13*Math.sin(5*a)+.05*Math.sin(3*a+1));return [x+q*Math.cos(a),y+q*Math.sin(a)]});return P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L')+'Z',C.ink,2,col)}
function L3_star(x,y,r,col){const j=[1,.9,1.05,.85,1,.95,1.08,.88,.97];const pts=range(18).map(i=>{const a=i/18*2*Math.PI-Math.PI/2,q=i%2?r*.42:r*j[i/2];return [x+q*Math.cos(a),y+q*Math.sin(a)]});return P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L')+'Z',C.ink,2,col)}
SCENE({id:'saussure-sign-bouba',name:'Bouba and kiki',tag:'Be the participant',
 definition:'Sound symbolism is a systematic link between sounds and meanings. Shown a rounded shape and a spiky one, most people call the rounded one “bouba” or “maluma” and the spiky one “kiki” or “takete”. It is a real exception to arbitrariness, though a modest one: it shapes a few words, not whole vocabularies.',
 example:'Wolfgang Köhler used maluma and takete in 1929. Ramachandran and Hubbard (2001) reported about 95% agreement for bouba and kiki. A test in 25 languages found the effect in most of them, with 72% matching overall (Ćwiek et al. 2022).',
 research:'Köhler, W. (1929). Gestalt Psychology; Ramachandran, V. S. & Hubbard, E. M. (2001). Synaesthesia — a window into perception, thought and language. J. Consciousness Studies 8(12); Ćwiek, A. et al. (2022). The bouba/kiki effect is robust across cultures and writing systems. Phil. Trans. R. Soc. B 377 (replicated across 25 languages; weaker in some).',
 desc:'Two shapes, one rounded and one spiky, swap sides from trial to trial; you press the one with the given name, and your match rate is drawn beside two published results.',
 dur:10,hint:'Press Start, then press the shape you think has the name shown. Eight trials; the shapes swap sides at random. Two of the four name pairs are classic, two were made up for this page. Your answers stay in this page.',
 init:()=>({seed:5,order:[],sides:[],i:-1,ans:[]}),
 watch(p){const i=Math.min(8,Math.floor(p*9));return {seed:0,order:L3_BK_SIM.order,sides:L3_BK_SIM.sides,i,ans:L3_BK_SIM.ans.slice(0,i),sim:true}},
 ui:[{b:'Start',act:'go'}],
 on:{go(s){s.seed=nextSeed();s.order=shuffled(range(8),s.seed);const r=rng(s.seed+7);s.sides=range(8).map(()=>r()<.5?0:1);s.i=0;s.ans=[]},
  pick(s,side){if(s.i<0||s.i>=8)return;const t=s.order[s.i],roundSide=s.sides[s.i],pickedRound=Number(side)===roundSide,wantRound=(t&1)===0;s.ans.push(pickedRound===wantRound?1:0);s.i++}},
 draw(s,f,X){
  const n=s.ans.length,ok=sum(s.ans);let out='';
  if(s.i>=0&&s.i<8){const t=s.order[s.i],pair=L3_BK[t>>1],name=pair[t&1],rs=s.sides[s.i];
   out+=heading(`Which shape is called “${name}”?`)+TF(300,54,`Trial ${s.i+1} of 8${pair[2]?' · a made-up pair':''}`,13,C.muted);
   const sh=side=>{const x=side?440:160,round=side===rs;return hit(X,'pick',side,`The ${round?'rounded':'spiky'} shape on the ${side?'right':'left'}`,R(x-100,70,200,160,'#fff',C.grid,12)+(round?L3_blob(x,150,58,C.purplep):L3_star(x,150,70,C.amberp)))};
   out+=sh(0)+sh(1);
  }else if(s.i>=8){out+=heading(`Done: you matched ${ok} of 8`)+L3_blob(200,140,50,C.purplep)+L3_star(400,140,62,C.amberp)+TBF(200,222,'bouba · maluma',15,C.purple)+TBF(400,222,'kiki · takete',15,C.amber)}
  else{out+=heading('Which name fits which shape?')+L3_blob(200,140,50,C.purplep)+L3_star(400,140,62,C.amberp)+TF(300,222,X.try?'Press Start':'',13,C.muted)}
  const bx=250,bw=310,bars=[[X.try?'you':'simulated',n?ok/n:null,X.try?C.coral:C.blue],['Ramachandran & Hubbard 2001',.95,C.green],['Ćwiek et al. 2022, 25 languages',.72,C.green]];
  out+=TF(300,256,'share of “sound-symbolic” matches',13,C.muted);
  bars.forEach(([lab,v,col],i)=>{const y=268+i*30;out+=TF(bx-8,y+16,lab,13,C.ink,'end')+R(bx,y,bw,20,'#f1f5f7','none',4)+(v===null?TF(bx+8,y+15,'—',13,C.muted,'start'):R(bx,y,bw*v,20,col,'none',4)+TBF(bx+bw*v-6,y+15,Math.round(v*100)+'%',13,'#fff','end'))});
  out+=L(bx+bw/2,264,bx+bw/2,358,C.muted,1,'stroke-dasharray="3 3"')+TF(bx+bw/2+4,374,'50% = chance',13,C.muted,'start');
  return {svg:out,phase:n>=8?(ok>=6?`You matched ${ok} of 8, like most people. Rounded vowels (o, u) and soft consonants (b, m, l) feel round; i, k and t feel sharp.`:`You matched ${ok} of 8. Not everyone follows the pattern, and in some languages the effect is weak: it is a tendency, not a law.`):'Most people match rounded shapes with o, u, b, m and l, and spiky ones with i, k and t. The effect is real but small next to the arbitrariness of most words.'};
 }});

const L3_FIELDS={
 sheep:{title:'An animal and its meat',cells:['the live animal','its meat'],rows:[['English',[[0,0,'sheep'],[1,1,'mutton']]],['French',[[0,1,'mouton']]]],note:'Saussure’s own example: French mouton covers what English splits into sheep and mutton, so the two words do not have the same value.'},
 river:{title:'Flowing water',cells:['big, ends in the sea','big, ends in a river','small'],rows:[['English',[[0,1,'river'],[2,2,'stream']]],['French',[[0,0,'fleuve'],[1,1,'rivière'],[2,2,'ruisseau']]]],note:'English divides by size; French also asks where the water ends up. Neither division is in the water itself.'},
 wood:{title:'Trees, wood and forests',cells:['a tree','wood (material)','a small wood','a large forest'],rows:[['English',[[0,0,'tree'],[1,2,'wood'],[3,3,'forest']]],['French',[[0,0,'arbre'],[1,2,'bois'],[3,3,'forêt']]],['German',[[0,0,'Baum'],[1,1,'Holz'],[2,3,'Wald']]],['Danish',[[0,1,'træ'],[2,3,'skov']]]],note:'After Hjelmslev (1943), simplified. Danish træ is both a tree and its wood; German Wald covers small woods and big forests alike.'}};
SCENE({id:'saussure-sign-value',name:'Meaning by difference',tag:'Value',
 definition:'For Saussure a word’s meaning, its value, depends on the other words beside it. Languages carve the same experience into different pieces, so a word means “this and not those”. Translating word by word fails where the boundaries fall in different places.',
 example:'English has sheep for the animal and mutton for the meat; French mouton covers both. Danish træ means both a tree and the wood it is made of.',
 research:'Saussure, F. de (1916). Cours de linguistique générale (the mouton example); Hjelmslev, L. (1943). Prolegomena to a Theory of Language (the tree–wood–forest field, simplified here).',
 desc:'A strip divided into kinds of experience, with each language drawn as a row of bands showing which words cover which part; pressing a row draws its boundaries across the others.',
 dur:10,hint:'Choose a field, then press a language’s row to draw its boundaries over the others. The bands show where each word stops.',
 init:()=>({f:'wood',hl:0}),
 watch(p){const ks=['sheep','river','wood'],i=Math.min(2,Math.floor(p*3)),u=(p*3)%1;return {f:ks[i],hl:Math.min(L3_FIELDS[ks[i]].rows.length-1,Math.floor(u*L3_FIELDS[ks[i]].rows.length))}},
 ui:[{choose:[['sheep','Sheep'],['river','Rivers'],['wood','Wood']],label:'Field',get:s=>s.f,act:'f'}],
 on:{f(s,v){s.f=v;s.hl=0},row(s,i){s.hl=Number(i)}},
 draw(s,f,X){
  const F=L3_FIELDS[s.f],n=F.cells.length,x0=130,w=440,cw=w/n,rows=F.rows,rh=Math.min(56,190/rows.length);
  let out=heading(F.title);
  F.cells.forEach((c,i)=>{const lines=L3_wrap(c,cw>140?24:13);lines.forEach((l,j)=>out+=TF(x0+cw*(i+.5),62+j*16,l,13,C.muted))});
  rows.forEach(([lg,segs],ri)=>{const y=100+ri*(rh+8),on=ri===s.hl;
   let inner=R(x0-110,y,100,rh,on?C.pale:'#fff',on?C.blue:C.grid,8)+TBF(x0-60,y+rh/2+5,lg,14,C.ink);
   segs.forEach(([a,b,word],si)=>{const x=x0+a*cw+3,ww=(b-a+1)*cw-6;inner+=R(x,y,ww,rh,si%2?C.greenp:C.purplep,on?C.ink:'none',8)+TBF(x+ww/2,y+rh/2+6,word,16,C.ink)});
   out+=hit(X,'row',ri,`Draw the ${lg} boundaries`,inner)});
  const top=96,bot=100+rows.length*(rh+8);
  rows[s.hl][1].forEach(([a])=>{if(a>0)out+=L(x0+a*cw,top,x0+a*cw,bot,C.coral,2.5,'stroke-dasharray="6 4"')});
  out+=TF(x0+w,bot+18,`dashed: where ${rows[s.hl][0]} draws its lines`,13,C.coral,'end');
  L3_wrap(F.note,70).forEach((l,j)=>out+=TF(300,bot+46+j*18,l,13,C.ink));
  return {svg:out,phase:F.note};
 }});

/* ======================= Lesson: phonemes ======================= */
const L3_PLANGS=['English','Japanese','Hindi','Korean'];
const L3_CONTR={
 pb:{name:'[p] and [b]',a:'p',b:'b',v:{English:[1,'pin – bin'],Japanese:[1,'pan ‘bread’ – ban ‘turn’'],Hindi:[1,'pal ‘moment’ – bal ‘strength’'],Korean:[0,'[b] is just how /p/ sounds between vowels']}},
 lr:{name:'[l] and [r]',a:'l',b:'ɾ',v:{English:[1,'light – right'],Japanese:[0,'one sound, said [ɾ] or [l]; no pair of words depends on it'],Hindi:[1,'kal ‘yesterday’ – kar ‘do’'],Korean:[0,'[ɾ] between vowels, [l] at the end of a syllable']}},
 asp:{name:'[p] and aspirated [pʰ]',a:'p',b:'pʰ',v:{English:[0,'pin [pʰɪn] but spin [spɪn]: both are /p/'],Japanese:[0,'aspiration varies but never changes a word'],Hindi:[1,'pal ‘moment’ – phal ‘fruit’'],Korean:[1,'pul ‘fire’ – pʰul ‘grass’']}},
 ss:{name:'[s] and [ʃ]',a:'s',b:'ʃ',v:{English:[1,'sip – ship'],Japanese:[1,'sakai ‘border’ – shakai ‘society’'],Hindi:[1,'sāl ‘year’ – shāl ‘shawl’'],Korean:[0,'a sh-like [ɕ] is how /s/ sounds before [i]']}}};
SCENE({id:'phonemes',name:'Phonemes and minimal pairs',tag:'Sounds that matter',
 definition:'A phoneme is a sound that can change one word into another in a particular language. Two sounds belong to different phonemes if a minimal pair exists, two words differing only in those sounds. If they never distinguish words, they are allophones: variants of one phoneme, chosen by position.',
 example:'English pin and bin prove /p/ and /b/ are separate phonemes. The puff of air after p in pin is absent in spin, but no English word turns on it; in Hindi and Korean the same puff separates words.',
 research:'Sapir, E. (1925). Sound patterns in language. Language 1, 37–51; Trubetzkoy, N. S. (1939). Grundzüge der Phonologie. Examples follow standard descriptions of each language.',
 desc:'Two sounds shown in phonetic symbols, and four cards for English, Japanese, Hindi and Korean saying whether the pair is two phonemes or one, with a minimal pair or the rule for the variants.',
 dur:10,hint:'Choose a pair of sounds and compare the four languages. Green means the sounds can change a word; amber means they are variants of one phoneme.',
 init:()=>({c:'lr'}),
 watch(p){return {c:['pb','lr','asp','ss'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:[['pb','p / b'],['lr','l / r'],['asp','p / pʰ'],['ss','s / sh']],label:'Sounds',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=v}},
 draw(s){
  const K=L3_CONTR[s.c];let out=heading(`Is ${K.name} one sound or two?`);
  out+=R(200,46,90,54,'#fff',C.blue,10)+TBF(245,84,K.a,28,C.blue,'middle',L3_IPA)+R(310,46,90,54,'#fff',C.blue,10)+TBF(355,84,K.b,28,C.blue,'middle',L3_IPA);
  L3_PLANGS.forEach((lg,i)=>{const c=i%2,r=Math.floor(i/2),x=24+c*282,y=116+r*118,[two,ex]=K.v[lg];
   out+=R(x,y,270,106,two?C.greenp:C.amberp,'none',10)+TBF(x+14,y+26,lg,16,C.ink,'start')+TBF(x+256,y+26,two?'two phonemes':'one phoneme',14,two?C.green:C.amber,'end');
   L3_wrap(two?'Minimal pair: '+ex:ex,36).slice(0,3).forEach((l,j)=>out+=TF(x+14,y+52+j*18,l,13,C.ink,'start',L3_IPA))});
  out+=TF(300,366,'Hindi, Japanese and Korean words romanised',13,C.muted);
  const n=sum(L3_PLANGS.map(l=>K.v[l][0]));
  return {svg:out,phase:`The same pair of sounds is ${n===4?'contrastive in all four languages':n===0?'contrastive in none':`two phonemes in ${n} of these languages and one in ${4-n}`}. A phoneme is defined by what a language does with a sound, not by the sound alone: this is why Japanese speakers can find English light and right hard to tell apart, and English speakers miss Hindi aspiration.`};
 }});

// Categorical perception along a voice-onset-time continuum.
const L3_VOTS=[0,10,20,30,40,50,60];
const L3_pubPa=v=>1/(1+Math.exp(-(v-25)/3.5));
function L3_playVOT(v){AUDIO.noise({dur:.012,gain:.14});if(v>0)AUDIO.noise({dur:v/1000,gain:.035,at:.012});AUDIO.tone(120,{type:'sawtooth',dur:.3,gain:.08,at:.012+v/1000,attack:.006})}
function L3_votWave(v,x0,y,w){
 let s=R(x0,y-40,w,80,'#fff',C.grid,8)+L(x0+10,y,x0+w-10,y,C.grid,1);const sc=3.2,b=x0+40;
 s+=L(b,y-30,b,y+30,C.ink,3)+L(b+4,y-18,b+4,y+18,C.ink,2);
 const r=rng(11);let d='';for(let x=b+8;x<b+8+v*sc;x+=3)d+=`M${fmt(x)} ${fmt(y-(r()-.5)*16)}L${fmt(x+1.5)} ${fmt(y+(r()-.5)*16)}`;
 if(v>0)s+=P(d,C.muted,1.2);
 const vs=b+8+v*sc;let wv='';for(let x=vs;x<x0+w-14;x+=2)wv+=(wv?'L':'M')+fmt(x)+' '+fmt(y-24*Math.sin((x-vs)/6)*Math.exp(-((x-vs)/400)));
 s+=P(wv,C.blue,2);
 s+=L(b,y+34,vs,y+34,C.coral,2)+TF(b-6,y+56,'burst',13,C.ink,'start')+TF(Math.max(b+70,vs+8),y+56,`voicing starts: VOT ${v} ms`,13,C.coral,'start');
 return s;
}
SCENE({id:'phonemes-categorical',name:'Hearing in categories',tag:'Be the participant',
 definition:'Voice onset time (VOT) is the gap between releasing a stop like p or b and the start of voicing. It varies smoothly, but English listeners hear an abrupt switch: short gaps sound like “ba”, longer ones like “pa”, with a boundary around 20–30 ms. This is categorical perception.',
 example:'Played a continuum in 10 ms steps, English listeners label 0–20 ms as “ba” and 40–60 ms as “pa” almost every time, and change their minds over a few milliseconds near 25 ms. Languages put the boundary in different places.',
 research:'Liberman, A. M. et al. (1957). The discrimination of speech sounds within and across phoneme boundaries. J. Exp. Psychol. 54; Lisker, L. & Abramson, A. S. (1964). A cross-language study of voicing in initial stops. Word 20; Kuhl, P. & Miller, J. D. (1975) found chinchillas share the boundary; McMurray et al. (2002) showed listeners still register differences within a category. Our sound is a crude click–hiss–buzz synthesis, not real speech.',
 desc:'A waveform sketch shows the burst, a hiss of aspiration and the start of voicing; you label 14 sounds as “ba” or “pa”, and the share of “pa” answers at each delay is drawn beside a typical English identification curve.',
 dur:12,hint:'Press Start, listen, then press “It was ba” or “It was pa”. Fourteen sounds in random order. The synthesis is crude, so trust your ear. You can also move the slider and press Hear it again to explore. Your answers stay in this page.',
 init:()=>({v:30,order:[],i:-1,resp:{},seed:3}),
 watch(p){const resp={};const k=Math.floor(p*15);const ord=[30,0,60,20,40,10,50,30,0,60,20,40,10,50];const r=rng(4);ord.slice(0,k).forEach(v=>{(resp[v]=resp[v]||[]).push(r()<L3_pubPa(v)?1:0)});return {v:ord[Math.min(13,k)],order:ord,i:k<14?k:14,resp,sim:true}},
 ui:[{b:'Start',act:'go'},{b:'Hear it again',act:'hear'},{b:'It was “ba”',act:'ans',arg:'ba'},{b:'It was “pa”',act:'ans',arg:'pa'},{range:'v',label:'Explore VOT',min:0,max:60,step:10,get:s=>s.v,act:'v',show:v=>v+' ms'}],
 on:{go(s){s.seed=nextSeed();s.order=shuffled(L3_VOTS.concat(L3_VOTS),s.seed);s.i=0;s.resp={};L3_playVOT(s.order[0])},
  hear(s){L3_playVOT(s.i>=0&&s.i<s.order.length?s.order[s.i]:s.v)},
  play(s){if(s.i>=0&&s.i<s.order.length)L3_playVOT(s.order[s.i])},
  ans(s,a,ctx){if(s.i<0||s.i>=s.order.length)return;const v=s.order[s.i];(s.resp[v]=s.resp[v]||[]).push(a==='pa'?1:0);s.i++;if(s.i<s.order.length)ctx.later(450,'play')},
  v(s,x){if(s.i<0||s.i>=s.order.length)s.v=Number(x)}},
 draw(s,f,X){
  const active=s.i>=0&&s.i<s.order.length;let out=heading('Where does “ba” turn into “pa”?');
  if(active&&X.try)out+=R(30,50,540,80,'#f6f9fb',C.grid,8)+TBF(300,96,`Sound ${s.i+1} of ${s.order.length}: listen, then answer`,16,C.ink);
  else out+=L3_votWave(active?s.order[s.i]:s.v,30,90,540);
  const pl=L3_plot(90,170,300,150,[0,60],[0,1],L3_VOTS.map(v=>[v,String(v)]),[[0,'0%'],[.5,'50%'],[1,'100%']],'voice onset time (ms)','heard as “pa”');out+=pl.svg;
  out+=L3_poly(range(61).map(v=>[pl.X(v),pl.Y(L3_pubPa(v))]),C.green,2.5,'stroke-dasharray="6 4"');
  const pts=L3_VOTS.filter(v=>s.resp[v]&&s.resp[v].length).map(v=>[v,L3_mean(s.resp[v])]);
  const col=X.try?C.coral:C.blue;out+=L3_poly(pts.map(p=>[pl.X(p[0]),pl.Y(p[1])]),col,2);pts.forEach(p=>out+=Ci(pl.X(p[0]),pl.Y(p[1]),6,col,'#fff'));
  out+=R(412,170,170,150,'#fff',C.grid,8)+L(424,192,452,192,C.green,2.5,'stroke-dasharray="6 4"')+TF(458,197,'typical English',13,C.ink,'start')+Ci(438,218,6,col,'#fff')+TF(458,223,X.try?'your answers':'simulated',13,C.ink,'start');
  const done=sum(Object.values(s.resp).map(a=>a.length));
  out+=TF(497,256,X.try?(done?`${done} of 14 answered`:'press Start'):`${done} answered`,13,C.muted)+TF(497,280,'the published curve',13,C.muted)+TF(497,298,'is schematic, after',13,C.muted)+TF(497,314,'Lisker & Abramson',13,C.muted);
  return {svg:out,phase:pts.length>=5?'If your curve jumps from mostly “ba” to mostly “pa” across one or two steps, you are hearing categories: equal steps of 10 ms do not sound equally different.':'English places the ba–pa boundary around 25 ms. Spanish and French put it near zero, so their p sounds like an English b to English ears.'};
 }});

// Distinctive features: [symbol, place, manner, voice, in English]
const L3_FEAT=[['p',0,0,0,1],['b',0,0,1,1],['t',1,0,0,1],['d',1,0,1,1],['k',2,0,0,1],['g',2,0,1,1],
 ['f',0,1,0,1],['v',0,1,1,1],['s',1,1,0,1],['z',1,1,1,1],['x',2,1,0,0],['ɣ',2,1,1,0],
 ['m̥',0,2,0,0],['m',0,2,1,1],['n̥',1,2,0,0],['n',1,2,1,1],['ŋ̊',2,2,0,0],['ŋ',2,2,1,1]];
const L3_PLACE=['labial','alveolar','velar'],L3_MANNER=['stop','fricative','nasal'];
const L3_CLASSES={none:()=>false,voiced:p=>p[3]===1,voiceless:p=>p[3]===0,stops:p=>p[2]===0,nasals:p=>p[2]===2,labials:p=>p[1]===0,velars:p=>p[1]===2};
const L3_find=(pl,mn,vc)=>L3_FEAT.find(p=>p[1]===pl&&p[2]===mn&&p[3]===vc);
SCENE({id:'phonemes-features',name:'Distinctive features',tag:'Sounds as bundles',
 definition:'Roman Jakobson and colleagues proposed that phonemes are bundles of a few yes-or-no features, such as voiced or voiceless, and where and how the sound is made. Rules of grammar refer to these features, so sounds that share a feature form a natural class that behaves alike.',
 example:'p, t and k share [−voice, stop]; m, n and ŋ share [nasal]. The English plural is /s/ after voiceless sounds (cats) and /z/ after voiced ones (dogs): the rule mentions the feature, not a list.',
 research:'Jakobson, R., Fant, G. & Halle, M. (1952). Preliminaries to Speech Analysis; Chomsky, N. & Halle, M. (1968). The Sound Pattern of English. Simplified here to three features.',
 desc:'A grid of consonants by place (labial, alveolar, velar) and manner (stop, fricative, nasal), voiceless and voiced side by side; pressing a sound shows its features, buttons change one feature at a time, and a class choice highlights every sound that shares it.',
 dur:10,hint:'Press a consonant, then change one feature at a time and see which sound you land on. Choose a class to see which sounds share a feature. Grey symbols are not English phonemes.',
 init:()=>({sel:0,cls:'none'}),
 watch(p){const seq=[0,1,13,15,9,8,2,4];return {sel:seq[Math.min(7,Math.floor(p*8))],cls:['none','voiced','stops','nasals'][Math.min(3,Math.floor(p*4))]}},
 ui:[{b:'Flip voicing',act:'voice'},{b:'Next manner',act:'manner'},{b:'Next place',act:'place'},{choose:[['none','No class'],['voiced','Voiced'],['stops','Stops'],['nasals','Nasals'],['labials','Labials']],label:'Natural class',get:s=>s.cls,act:'cls'}],
 on:{pick(s,i){s.sel=Number(i)},cls(s,v){s.cls=v},
  voice(s){const p=L3_FEAT[s.sel];s.sel=L3_FEAT.indexOf(L3_find(p[1],p[2],1-p[3]))},
  manner(s){const p=L3_FEAT[s.sel];s.sel=L3_FEAT.indexOf(L3_find(p[1],(p[2]+1)%3,p[3]))},
  place(s){const p=L3_FEAT[s.sel];s.sel=L3_FEAT.indexOf(L3_find((p[1]+1)%3,p[2],p[3]))}},
 draw(s,f,X){
  const p=L3_FEAT[s.sel],inCls=L3_CLASSES[s.cls]||L3_CLASSES.none;let out=heading('Consonants as bundles of features');
  const gx=150,gy=74,cw=130,ch=58;
  L3_PLACE.forEach((pl,i)=>out+=TBF(gx+cw*(i+.5),gy-8,pl,14,C.muted));
  L3_MANNER.forEach((mn,j)=>out+=TBF(gx-14,gy+ch*(j+.5)+5,mn,14,C.muted,'end'));
  L3_FEAT.forEach((q,i)=>{const x=gx+q[1]*cw+(q[3]?66:6),y=gy+q[2]*ch+6,on=i===s.sel,cl=inCls(q);
   out+=hit(X,'pick',i,`Select ${q[0]}`,R(x,y,58,46,on?C.blue:cl?C.amberp:'#fff',on?C.blue:C.grid,8)+TBF(x+29,y+31,q[0],22,on?'#fff':q[4]?C.ink:C.line,'middle',L3_IPA))});
  out+=TF(gx+cw*1.5,gy+3*ch+22,'left of each pair: voiceless · right: voiced',13,C.muted);
  const fb=`[${p[3]?'+':'−'}voice, ${L3_PLACE[p[1]]}, ${L3_MANNER[p[2]]}]`;
  out+=R(40,300,520,64,'#f6f9fb',C.grid,10)+TBF(60,326,p[0],22,C.blue,'start',L3_IPA)+TF(100,326,fb,15,C.ink,'start');
  const note=p[4]?(p[2]===0||p[2]===1?`English plural after ${p[0]}: ${p[3]?'/z/ (as in dogs)':p[1]===1&&p[2]===1?'/ɪz/ (as in buses)':'/s/ (as in cats)'}`:'nasals are voiced in English, so plurals add /z/'):(p[2]===2?'not English: voiceless nasals occur in Burmese and Icelandic':'not English: as in German Bach (x) or Spanish lago (ɣ)');
  out+=TF(60,350,note,13,C.muted,'start',L3_IPA);
  return {svg:out,phase:s.cls!=='none'?`The highlighted sounds share one feature, so a single rule can mention them all. ${s.cls==='voiced'?'Voiced sounds take /z/ in the English plural.':'Children and sound changes treat such classes as units.'}`:`${p[0]} is ${fb}. Change one feature and you land on a neighbour: that is why p and b, or t and n, feel related.`};
 }});

/* ======================= Lesson: morphology ======================= */
const L3_SW={subj:[['ni','I','1SG'],['u','you','2SG'],['a','he/she','3SG'],['tu','we','1PL'],['wa','they','3PL']],
 tense:[['na','PRS','present'],['li','PST','past'],['ta','FUT','future']],
 obj:[['','',''],['ni','me','1SG'],['ku','you','2SG'],['m','him/her','3SG'],['wa','them','3PL']]};
const L3_REFL={'1SG':'myself','2SG':'yourself','3SG':'himself/herself','1PL':'ourselves','3PL':'themselves'};
function L3_swahili(si,ti,oi){
 const S=L3_SW.subj[si],T=L3_SW.tense[ti],O=L3_SW.obj[oi],refl=O[0]&&O[2]===S[2];
 const parts=[[S[0],S[2]],[T[0],T[1]]];if(O[0])parts.push(refl?['ji','REFL']:[O[0],O[2]+'.OBJ']);parts.push(['penda','love']);
 const third=S[2]==='3SG',verb=T[0]==='na'?(third?'loves':'love'):T[0]==='li'?'loved':'will love';
 const en=`${S[1]==='he/she'?'he/she':S[1]} ${verb}${O[0]?' '+(refl?L3_REFL[S[2]]:O[1]):''}`;
 return {parts,word:parts.map(p=>p[0]).join(''),en:en[0].toUpperCase()+en.slice(1),refl};
}
SCENE({id:'morphology',name:'Building words from parts',tag:'Morphemes',
 definition:'A morpheme is the smallest part of a word with a meaning or grammatical job. Languages like Swahili build verbs by stringing morphemes into fixed slots: who does it, when, to whom, and the verb itself. Linguists write them with hyphens and a gloss line underneath.',
 example:'Swahili ni-ta-ku-penda is “I will love you”: ni- “I”, -ta- future, -ku- “you”, -penda “love”. Swap one slot and the meaning changes predictably: a-li-wa-penda, “he or she loved them”.',
 research:'Bloomfield, L. (1933). Language; Ashton, E. O. (1944). Swahili Grammar; Comrie, Haspelmath & Bickel (2008). The Leipzig Glossing Rules (for the gloss line).',
 desc:'A Swahili verb drawn as a row of coloured slots, subject, tense, object and root, with the gloss under each morpheme, the whole word above and an English translation below.',
 dur:10,hint:'Change the subject, tense and object and watch one slot change at a time. Make the subject and object the same person to see the reflexive -ji-.',
 init:()=>({si:0,ti:2,oi:2}),
 watch(p){const seq=[[0,2,2],[0,1,2],[2,1,4],[3,0,3],[4,2,1],[0,0,1]],i=Math.min(5,Math.floor(p*6));const [si,ti,oi]=seq[i];return {si,ti,oi}},
 ui:[{choose:L3_SW.subj.map((x,i)=>[i,x[0]+'- '+x[1]]),label:'Subject',get:s=>s.si,act:'si'},{choose:L3_SW.tense.map((x,i)=>[i,'-'+x[0]+'- '+x[2]]),label:'Tense',get:s=>s.ti,act:'ti'},{choose:L3_SW.obj.map((x,i)=>[i,x[0]?'-'+x[0]+'- '+x[1]:'no object']),label:'Object',get:s=>s.oi,act:'oi'}],
 on:{si(s,v){s.si=Number(v)},ti(s,v){s.ti=Number(v)},oi(s,v){s.oi=Number(v)}},
 draw(s){
  const w=L3_swahili(s.si,s.ti,s.oi);let out=heading('A Swahili verb, slot by slot');
  out+=TBF(300,84,w.word,32,C.ink);
  const cols=[C.purplep,C.amberp,C.greenp,C.pale],names=['subject','tense','object','verb root'];
  const ws=w.parts.map(p=>Math.max(80,p[0].length*20+30)),tot=sum(ws)+(ws.length-1)*10;let x=300-tot/2;
  w.parts.forEach((p,i)=>{const kind=w.parts.length===3&&i===2?3:i,cw=ws[i];
   out+=R(x,110,cw,64,cols[kind],'none',10)+TBF(x+cw/2,150,p[0]+(i<w.parts.length-1?'-':''),24,C.ink)+TF(x+cw/2,196,p[1],14,C.ink,'middle','class="mono"')+TF(x+cw/2,218,names[kind],13,C.muted);x+=cw+10});
  out+=TBF(300,262,`‘${w.en}’`,20,C.blue);
  out+=TF(300,300,'Gloss abbreviations: SG/PL singular/plural, 1/2/3 person, PRS present, PST past, FUT future, OBJ object, REFL reflexive',13,C.muted);
  out+=TF(300,336,w.refl?'Same person as subject and object: Swahili uses the reflexive -ji-, “self”.':'Each slot holds one meaning, and each meaning has its own slot: this is agglutination.',13,C.ink);
  return {svg:out,phase:`${w.word}: ${w.parts.map(p=>p[0]).join('-')}. Linguists line up form and gloss so that a reader who knows no Swahili can see exactly which part means what.`};
 }});

const L3_TYPES=[
 {lang:'Mandarin',type:'isolating',parts:[['wǒ','I'],['mǎi','buy'],['le','PFV'],['shū','book']],word:'wǒ mǎi le shū',tr:'I bought a book (or books)',note:'Each word is a single morpheme; tense and number come from separate words or context.'},
 {lang:'Turkish',type:'agglutinating',parts:[['ev','house'],['ler','PL'],['im','1SG.POSS'],['de','LOC']],word:'evlerimde',tr:'in my houses',note:'Each ending carries one meaning and stays easy to see.'},
 {lang:'Latin',type:'fusional',parts:[['am','love'],['ā','THEME'],['bō','FUT.1SG']],word:'amābō',tr:'I will love',note:'The ending -bō packs future tense, first person and singular into one piece that cannot be split.'},
 {lang:'Inuktitut',type:'polysynthetic',parts:[['tusaa','hear'],['tsiaq','well'],['junnaq','able'],['nngit','NEG'],['tualuu','very'],['junga','1SG']],word:'tusaatsiarunnanngittualuujunga',tr:'I can’t hear very well',note:'A whole English sentence is one word. Sounds change at the joins, so the parts are not simply strung together.'},
 {lang:'English',type:'mixed',parts:[['un','NOT'],['break','break'],['able','able']],word:'unbreakable',tr:'cannot be broken',note:'English mixes types: un-break-able strings parts together, while sang packs “sing + past” into one vowel change.'}];
const L3_INDEX=[['Vietnamese',1.06],['English',1.68],['Swahili',2.55],['Sanskrit',2.59],['West Greenlandic',3.72]];
SCENE({id:'morphology-typology',name:'How languages build words',tag:'Morphological types',
 definition:'Languages differ in how much they pack into a word. Isolating languages use mostly one-morpheme words; agglutinating ones add clear, separable endings; fusional ones merge several meanings into one ending; polysynthetic ones build whole sentences into a word. These are points on a continuum, and most languages mix types.',
 example:'Turkish ev-ler-im-de is “in my houses”, one meaning per piece. Latin amā-bō is “I will love”, with future, first person and singular fused in -bō.',
 research:'Sapir, E. (1921). Language; Greenberg, J. H. (1960). A quantitative approach to the morphological typology of language. IJAL 26, 178–194 (index of synthesis: morphemes per word in 100-word samples; values approximate).',
 desc:'One word from the chosen language split into morphemes with glosses, its type named, and a scale of Greenberg’s index of synthesis (average morphemes per word) with five languages marked.',
 dur:10,hint:'Choose a language to see one word broken into its parts and where the language sits on the scale of morphemes per word.',
 init:()=>({t:1}),
 watch(p){return {t:Math.min(4,Math.floor(p*5))}},
 ui:[{choose:L3_TYPES.map((t,i)=>[i,t.lang]),label:'Language',get:s=>s.t,act:'t'}],
 on:{t(s,v){s.t=Number(v)}},
 draw(s){
  const T=L3_TYPES[s.t];let out=heading(`${T.lang}: ${T.type}`);
  out+=TBF(300,80,T.word,T.word.length>20?22:28,C.ink,'middle',L3_IPA)+TF(300,104,`‘${T.tr}’`,15,C.blue);
  const ws=T.parts.map(p=>Math.max(62,Math.max(p[0].length*10,p[1].length*8)+20)),tot=sum(ws)+(ws.length-1)*6,sc=Math.min(1,560/tot);let x=300-tot*sc/2;
  T.parts.forEach((p,i)=>{const w=ws[i]*sc;out+=R(x,122,w,58,i%2?C.greenp:C.purplep,'none',8)+TBF(x+w/2,148,p[0],16,C.ink,'middle',L3_IPA)+TF(x+w/2,170,p[1],13,C.ink,'middle','class="mono"');x+=w+6*sc});
  L3_wrap(T.note,72).forEach((l,j)=>out+=TF(300,206+j*18,l,13,C.ink));
  const x0=70,x1=530,X=v=>x0+(x1-x0)*(v-1)/3;
  out+=TF(300,262,'index of synthesis: average morphemes per word (Greenberg 1960)',13,C.muted)+L(x0,300,x1,300,C.line,3);
  [1,2,3,4].forEach(v=>out+=L(X(v),294,X(v),306,C.muted,1.5)+TF(X(v),322,String(v),13,C.muted));
  L3_INDEX.forEach(([lg,v],i)=>{const on=lg===T.lang||(T.lang==='Inuktitut'&&lg==='West Greenlandic');out+=Ci(X(v),300,on?8:6,on?C.coral:C.blue,'#fff')+TF(X(v),i%2?346:282,`${lg} ${v}`,13,on?C.coral:C.ink)});
  return {svg:out,phase:`${T.note} The index is an average over running text, so it places languages on a scale rather than in boxes.`};
 }});

// The wug test: [word, answer 0 = /s/, 1 = /z/, 2 = /ɪz/, used by Berko?]
const L3_WUGS=[['wug',1,1],['gutch',2,1],['lun',1,1],['tass',2,1],['bik',0,0],['zop',0,0],['nizz',2,1],['cra',1,1]];
const L3_PL=['/s/ as in cats','/z/ as in dogs','/ɪz/ as in horses'];
function L3_wugBird(x,y,col){return P(`M${x-26} ${y+10}Q${x-30} ${y-24} ${x} ${y-26}Q${x+28} ${y-24} ${x+26} ${y+10}Q${x} ${y+22} ${x-26} ${y+10}Z`,C.ink,2,col)+Ci(x+8,y-10,3,C.ink)+P(`M${x+20} ${y-8}l12 4l-12 4`,C.ink,2,C.amber)+L(x-8,y+18,x-10,y+30,C.ink,2.5)+L(x+8,y+18,x+10,y+30,C.ink,2.5)}
SCENE({id:'morphology-wug',name:'The wug test',tag:'Be the participant',
 definition:'Jean Berko (1958) showed children pictures of made-up creatures, “This is a wug. Now there are two of them. There are two…?”, and they answered “wugs” with the right ending. Children could not have heard these words, so they must know a rule, not just a list.',
 example:'The English plural has three forms chosen by the last sound: /s/ after voiceless sounds (cats), /z/ after voiced sounds (dogs) and /ɪz/ after hissing and hushing sounds (horses, churches).',
 research:'Berko, J. (1958). The child’s learning of English morphology. Word 14, 150–177 (wug, gutch, lun, tass, nizz and cra are among her items; bik and zop are made up here). Replicated many times; the test now has versions for many languages.',
 desc:'A cartoon creature appears with a made-up name; you pick the plural ending as /s/, /z/ or /ɪz/ for eight words, and a table checks your answers against the rule that depends on the final sound.',
 dur:10,hint:'Press Start. For each made-up word, say “two ___s” aloud and choose the ending you hear. Your answers stay in this page.',
 init:()=>({order:[],i:-1,ans:[],seed:9}),
 watch(p){const i=Math.min(8,Math.floor(p*9));const order=[0,1,2,3,4,5,6,7];return {order,i,ans:order.slice(0,i).map(k=>k===6?1:L3_WUGS[k][1]),sim:true}},
 ui:[{b:'Start',act:'go'},{b:'/s/ as in cats',act:'a',arg:0},{b:'/z/ as in dogs',act:'a',arg:1},{b:'/ɪz/ as in horses',act:'a',arg:2}],
 on:{go(s){s.seed=nextSeed();s.order=shuffled(range(8),s.seed);s.i=0;s.ans=[]},a(s,v){if(s.i<0||s.i>=8)return;s.ans.push(Number(v));s.i++}},
 draw(s,f,X){
  const active=s.i>=0&&s.i<8;let out='';
  if(active){const w=L3_WUGS[s.order[s.i]][0];out+=heading(`This is a ${w}. Now there are two.`)+L3_wugBird(120,110,C.pale)+L3_wugBird(390,110,C.pale)+L3_wugBird(470,110,C.pale)+TBF(300,182,`There are two ${w}___`,20,C.ink)+TF(300,206,`Word ${s.i+1} of 8: which ending?`,13,C.muted)}
  else{out+=heading(s.i>=8?'Your plurals against the rule':'Can you make a plural for a word you never heard?')+L3_wugBird(260,110,C.pale)+L3_wugBird(340,110,C.pale)+TF(300,182,X.try&&s.i<0?'Press Start':'',13,C.muted)}
  const n=s.ans.length;out+=R(30,222,540,140,'#fff',C.grid,8);
  for(let j=0;j<8;j++){const c=j%4,r=Math.floor(j/4),x=40+c*132,y=236+r*62;
   if(j<n){const k=s.order[j],[w,right]=L3_WUGS[k],ok=s.ans[j]===right;out+=TBF(x,y+16,w+(['s','s','es'][right]),15,C.ink,'start')+TF(x,y+36,`you: ${['/s/','/z/','/ɪz/'][s.ans[j]]}${ok?' ✓':' · rule: '+['/s/','/z/','/ɪz/'][right]}`,13,ok?C.green:C.coral,'start',L3_IPA)}
   else out+=TF(x,y+16,'—',13,C.line,'start')}
  const ok=sum(s.ans.map((a,j)=>a===L3_WUGS[s.order[j]][1]?1:0));
  return {svg:out,phase:n>=8?`${ok} of 8 follow the rule. The ending depends only on the last sound: hissing sounds (s, z, ch) take /ɪz/, other voiceless sounds take /s/, everything else /z/. You applied it to words you had never met.`:'Berko’s four-year-olds already added the right ending to wug most of the time. Irregular words like feet and mice show the same rule at work when children say “foots” and “mouses”.'};
 }});

/* ======================= Lesson: zipf-law ======================= */
function L3_zipfPlot(ranked,x,y,w,h,col,ref){
 const pts=ranked.map(([,c],i)=>[Math.log10(i+1),Math.log10(c)]),xm=Math.max(2.6,Math.ceil(Math.log10(ranked.length)*10)/10+.1),ym=Math.max(1.8,Math.ceil(Math.log10(ranked[0]?ranked[0][1]:1)*10)/10+.1);
 const pl=L3_plot(x,y,w,h,[0,xm],[0,ym],[[0,'1'],[1,'10'],[2,'100']].concat(xm>3?[[3,'1000']]:[]),[[0,'1'],[1,'10']].concat(ym>2?[[2,'100']]:[]),'rank (log scale)','count (log)');
 let s=pl.svg;if(ref)s+=L3_poly(ref.map(p=>[pl.X(p[0]),pl.Y(p[1])]),C.line,2,'stroke-dasharray="5 4"');
 if(pts.length){const top=pts[0][1];s+=L(pl.X(0),pl.Y(top),pl.X(Math.min(xm,top)),pl.Y(top-Math.min(xm,top)),C.green,2,'stroke-dasharray="6 4"')}
 let last='';pts.forEach(p=>{const k=Math.round(pl.X(p[0]))+','+Math.round(pl.Y(p[1]));if(k!==last)s+=Ci(pl.X(p[0]),pl.Y(p[1]),2.8,col);last=k});
 return {svg:s,pts,fit:L3_fit(pts)};
}
SCENE({id:'zipf-law',name:'Zipf’s law',tag:'Rank and frequency',
 definition:'George Kingsley Zipf noticed that if you rank the words of a text by how often they occur, the count falls roughly as one over the rank: the second word appears about half as often as the first, the tenth about a tenth as often. On logarithmic axes this is a straight line with slope near −1.',
 example:'In the million-word Brown corpus, the makes up about 7% of all words and of about 3.5%. A few words do most of the work; about half of the different words in a text appear only once.',
 research:'Zipf, G. K. (1935). The Psycho-Biology of Language; Zipf (1949). Human Behavior and the Principle of Least Effort; Piantadosi, S. T. (2014). Zipf’s word frequency law in natural language: a critical review. Psychonomic Bulletin & Review 21 (robust across languages; its explanation is debated).',
 desc:'The words of the opening of Alice’s Adventures in Wonderland ranked by count on log–log axes, with a slope-of-−1 guide, a fitted slope and a table of the top words showing rank × count.',
 dur:12,hint:'Slide how much of the text to count. Watch the points settle towards a straight line, and check whether rank × count stays roughly level in the table.',
 init:()=>({n:L3_AW.length}),
 watch(p){return {n:Math.max(60,Math.round(L3_AW.length*smooth(Math.min(1,p*1.2))))}},
 ui:[{range:'n',label:'Words counted',min:60,max:L3_AW.length,step:20,get:s=>s.n,act:'n',show:v=>v+' words'}],
 on:{n(s,v){s.n=Number(v)}},
 draw(s){
  const ranked=L3_rank(L3_AW.slice(0,s.n)),hapax=ranked.filter(r=>r[1]===1).length;let out=heading(`${s.n} words of Alice, ${ranked.length} different ones`);
  const z=L3_zipfPlot(ranked,80,52,300,250,C.blue);out+=z.svg;
  out+=TF(240,370,'dashed green: slope −1, Zipf’s ideal',13,C.green);
  out+=R(410,52,172,214,'#fff',C.grid,8)+TF(424,74,'rank',13,C.muted,'start')+TF(456,74,'word',13,C.muted,'start')+TF(530,74,'count',13,C.muted,'end')+TF(574,74,'r×c',13,C.muted,'end');
  ranked.slice(0,7).forEach(([w,c],i)=>{const y=98+i*24;out+=TF(424,y,String(i+1),13,C.ink,'start')+TBF(456,y,w,14,C.ink,'start')+TF(530,y,String(c),13,C.ink,'end')+TF(574,y,String((i+1)*c),13,C.blue,'end')});
  out+=counter(410,280,'fitted slope',z.fit?z.fit.b.toFixed(2):'—',C.blue,82)+counter(500,280,'used once',Math.round(100*hapax/ranked.length)+'%',C.ink,82);
  return {svg:out,phase:`The fitted slope is ${z.fit?z.fit.b.toFixed(2):'—'}. In a short text the tail is a staircase of words seen once or twice, which flattens the fit; in millions of words the line is close to −1 over many decades of rank.`};
 }});

const L3_ALICE_REF=L3_memo('aliceref',()=>L3_rank(L3_AW).map(([,c],i)=>[Math.log10(i+1),Math.log10(c)]));
SCENE({id:'zipf-law-monkey',name:'A monkey at a typewriter',tag:'Is Zipf’s law deep?',
 definition:'George Miller (1957) pointed out that random typing, letters and spaces pressed at random, also produces a rank–frequency curve close to Zipf’s, because short random strings are both more likely and more varied in number. So the law alone does not prove anything special about meaning.',
 example:'With 6 letters and a space pressed 20% of the time, one-letter “words” are common and long ones rare, and the ranked counts fall in near-straight steps on log–log axes.',
 research:'Miller, G. A. (1957). Some effects of intermittent silence. American Journal of Psychology 70, 311–314; Li, W. (1992). Random texts exhibit Zipf’s-law-like word frequency distribution. IEEE Trans. Information Theory 38; Piantadosi (2014) argues real language shows Zipf-like structure that random typing cannot explain, such as frequency tied to meaning.',
 desc:'A sample of random “text”, and its words ranked by count on log–log axes beside the curve for the Alice passage, with the fitted slope.',
 dur:10,hint:'Change the number of letters and how often the space bar is hit, or press New typing. Compare the steps of the random curve with the smooth Alice curve (dashed grey).',
 init:()=>({letters:6,sp:20,seed:3}),
 watch(p){return {letters:[4,6,10,26][Math.min(3,Math.floor(p*4))],sp:20,seed:3}},
 ui:[{range:'letters',label:'Letters',min:3,max:26,get:s=>s.letters,act:'letters'},{range:'sp',label:'Space',min:8,max:40,get:s=>s.sp,act:'sp',show:v=>v+'%'},{b:'New typing',act:'fresh'}],
 on:{letters(s,v){s.letters=Number(v)},sp(s,v){s.sp=Number(v)},fresh(s){s.seed=nextSeed()%100000}},
 draw(s){
  const words=L3_monkey(s.letters,s.sp/100,s.seed),ranked=L3_rank(words);let out=heading(`Random typing: ${s.letters} letters, space ${s.sp}%`);
  out+=R(30,44,540,32,'#f6f9fb',C.grid,6)+TMF(42,66,words.slice(0,14).join(' ').slice(0,58),14,C.ink,'start');
  const z=L3_zipfPlot(ranked,80,96,330,210,C.amber,L3_ALICE_REF);out+=z.svg;
  out+=TF(245,366,'grey dashed: Alice · green dashed: slope −1',13,C.muted);
  out+=counter(440,96,'“words” made',String(words.length),C.ink,130)+counter(440,152,'different ones',String(ranked.length),C.ink,130)+counter(440,208,'fitted slope',z.fit?z.fit.b.toFixed(2):'—',C.amber,130);
  out+=TF(505,282,'most common:',13,C.muted)+TBF(505,302,ranked.slice(0,3).map(r=>r[0]).join(' · '),14,C.ink);
  return {svg:out,phase:'Random typing makes a staircase, because every string of the same length is equally likely, but its overall trend is Zipf-like. A straight log–log line is common in nature, so the interesting question is which other properties of word frequencies random processes fail to reproduce.'};
 }});

function L3_brevity(src){
 const words=src==='alice'?L3_AW:L3_monkey(6,.2,3),ranked=L3_rank(words),bins=[[1,1],[2,2],[3,4],[5,8],[9,16],[17,1e9]];
 const rows=bins.map(([a,b])=>{const ws=ranked.filter(r=>r[1]>=a&&r[1]<=b);return {lab:b>1e8?`${a}+`:a===b?String(a):`${a}–${b}`,n:ws.length,len:L3_mean(ws.map(r=>r[0].length))}});
 return {rows,r:L3_corr(ranked.map(([w,c])=>[Math.log10(c),w.length])),ranked};
}
SCENE({id:'zipf-law-brevity',name:'Frequent words are short',tag:'Law of abbreviation',
 definition:'Zipf’s law of abbreviation says that the more often a word is used, the shorter it tends to be. Speakers save effort on the words they say most. A study of about a thousand languages found the pattern in every one (Bentz & Ferrer-i-Cancho 2016).',
 example:'The commonest English words, the, of, and, a, to, are one to three letters long; words used once in a text average nearly twice that. Long words that become common get clipped: omnibus to bus, telephone to phone.',
 research:'Zipf, G. K. (1935). The Psycho-Biology of Language; Bentz, C. & Ferrer-i-Cancho, R. (2016). Zipf’s law of abbreviation as a language universal. Proc. Leiden Workshop on Capturing Phylogenetic Algorithms (about 1,000 languages); random typing shows the pattern too (Miller 1957), so it needs care to interpret.',
 desc:'Bars of average word length for groups of words by how often they appear in the text, with the correlation between frequency and length, for the Alice passage or for random typing.',
 dur:10,hint:'Compare Alice with random typing. Both show frequent words as short, which is why researchers test the law against random baselines.',
 init:()=>({src:'alice'}),
 watch(p){return {src:p<.6?'alice':'monkey'}},
 ui:[{choose:[['alice','Alice'],['monkey','Random typing']],label:'Text',get:s=>s.src,act:'src'}],
 on:{src(s,v){s.src=v}},
 draw(s){
  const B=L3_brevity(s.src);let out=heading(s.src==='alice'?'Alice: how long are common words?':'Random typing: same question');
  const pl=L3_plot(90,60,330,230,[0,6],[0,s.src==='alice'?9:7],[],[[0,'0'],[2,'2'],[4,'4'],[6,'6']].concat(s.src==='alice'?[[8,'8']]:[]),null,'letters per word');out+=pl.svg;
  B.rows.forEach((r,i)=>{const x=pl.X(i)+8,w=pl.X(1)-pl.X(0)-16;if(r.n)out+=R(x,pl.Y(r.len),w,pl.Y(0)-pl.Y(r.len),s.src==='alice'?C.blue:C.amber,'none',4)+TF(x+w/2,pl.Y(r.len)-6,r.len.toFixed(1),13,C.ink);out+=TF(x+w/2,308,r.lab,13,C.muted)});
  out+=TF(255,330,'times the word appears in the text',13,C.muted);
  out+=counter(440,60,'correlation',B.r.toFixed(2),C.blue,140)+TF(510,130,'(log count vs length;',13,C.muted)+TF(510,148,'negative = frequent',13,C.muted)+TF(510,166,'words are shorter)',13,C.muted);
  out+=TF(510,200,'commonest words:',13,C.muted);B.ranked.slice(0,4).forEach(([w],i)=>out+=TBF(510,222+i*20,w,14,C.ink));
  return {svg:out,phase:s.src==='alice'?`Words seen once average ${B.rows[0].len.toFixed(1)} letters; words seen 17 times or more average ${B.rows[5].len.toFixed(1)}. Effort is saved where it matters most.`:'Random typing shows the same slope for a trivial reason: short strings repeat by chance. The finding in real languages counts because it holds after such baselines are allowed for.'};
 }});

/* ======================= Lesson: redundancy-entropy ======================= */
const L3_GUESS=['THERE IS NO REVERSE ON A MOTORCYCLE','DOWN DOWN DOWN WOULD THE FALL NEVER COME TO AN END','THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG'];
function L3_bounds(counts){
 const N=counts.length;if(!N)return null;const q=range(29).map(i=>counts.filter(c=>c===i).length/N);
 let up=0,lo=0;for(let i=1;i<=27;i++){if(q[i]>0)up+=q[i]*Math.log2(1/q[i]);lo+=i*(q[i]-q[i+1])*Math.log2(i)}
 return {up,lo:Math.max(0,lo),q};
}
const L3_SIMG=(()=>{const r=rng(42);return range(60).map(()=>{const v=r();return v<.62?1:v<.78?2:v<.87?3:4+Math.floor(r()*6)})})();
SCENE({id:'redundancy-entropy',name:'Guess the next letter',tag:'Be the participant',
 definition:'Claude Shannon (1951) measured how predictable English is by asking people to guess a text one letter at a time and counting how many guesses each letter took. From those counts he bounded the entropy of English: about 0.6 to 1.3 bits per letter when readers can see the earlier text, against 4.75 bits if all 27 symbols were equally likely.',
 example:'After “THERE IS NO REVERSE ON A MOTORCY”, almost everyone guesses C, L, E first time. Most letters need one guess; a few, at the start of a new word, need many.',
 research:'Shannon, C. E. (1951). Prediction and entropy of printed English. Bell System Technical Journal 30, 50–64 (the motorcycle sentence is his example); Cover, T. & King, R. (1978) estimated about 1.3 bits per letter by betting. Bounds from a few dozen letters are rough.',
 desc:'A sentence revealed letter by letter, coloured by how many guesses each letter took, with a 27-key keyboard for guessing, a histogram of guess counts and Shannon’s upper and lower bounds on bits per letter.',
 dur:12,hint:'Guess the next letter by pressing keys (␣ is the space). A wrong key is greyed out; keep going until you hit it. Choose another sentence to try again. Your guesses stay in this page.',
 init:()=>({si:0,pos:0,tries:0,wrong:[],counts:[]}),
 watch(p){const S=L3_GUESS[0],pos=Math.min(S.length,Math.floor(p*S.length*1.05));return {si:0,pos,tries:0,wrong:[],counts:L3_SIMG.slice(0,pos),sim:true}},
 ui:[{choose:L3_GUESS.map((g,i)=>[i,['Motorcycle','Alice','Fox'][i]]),label:'Sentence',get:s=>s.si,act:'si'},{b:'Skip this letter',act:'skip'}],
 on:{si(s,v){s.si=Number(v);s.pos=0;s.tries=0;s.wrong=[];s.counts=[]},
  key(s,ch){const S=L3_GUESS[s.si];if(s.pos>=S.length)return;const c=ch==='_'?' ':ch;if(s.wrong.includes(c))return;
   if(c===S[s.pos]){s.counts.push(Math.min(27,s.tries+1));s.pos++;s.tries=0;s.wrong=[]}else{s.wrong.push(c);s.tries++}},
  skip(s){const S=L3_GUESS[s.si];if(s.pos<S.length){s.counts.push(0);s.pos++;s.tries=0;s.wrong=[]}}},
 draw(s,f,X){
  const S=L3_GUESS[s.si],len=S.length,cw=Math.min(15,540/len),x0=300-len*cw/2,cts=s.counts.filter(c=>c>0),B=L3_bounds(cts);
  let out=heading('How many guesses does each letter take?');
  for(let i=0;i<len;i++){const x=x0+i*cw,c=s.counts[i];
   if(i<s.pos){out+=(S[i]===' '?'':TMF(x+cw/2,70,S[i],Math.min(16,cw+2),C.ink));out+=R(x+1,78,cw-2,6,c===0?C.line:c===1?C.green:c<=3?C.amber:C.coral,'none',2)}
   else out+=(i===s.pos?R(x+1,54,cw-2,22,C.pale,C.blue,3):'')+Ci(x+cw/2,70,1.6,C.line)}
  const hx=40,hw=260,hy=104,hh=90,mx=Math.max(1,...range(10).map(i=>cts.filter(c=>(i<9?c===i+1:c>=10)).length));
  out+=R(hx-10,hy-8,hw+20,hh+40,'#fff',C.grid,8);
  for(let i=0;i<10;i++){const n=cts.filter(c=>(i<9?c===i+1:c>=10)).length,bh=hh*n/mx,x=hx+i*26;out+=R(x+3,hy+hh-bh,20,bh,i===0?C.green:i<3?C.amber:C.coral,'none',3)+TF(x+13,hy+hh+16,i<9?String(i+1):'10+',13,C.muted)}
  out+=TF(hx+hw-2,hy+8,'guesses needed',13,C.muted,'end');
  out+=counter(330,96,'letters done',String(cts.length),C.ink,116)+counter(454,96,'upper bound',B?B.up.toFixed(2)+' bits':'—',C.coral,120)+counter(330,148,'all 27 equal',(Math.log2(27)).toFixed(2)+' bits',C.muted,116)+counter(454,148,'lower bound',B?B.lo.toFixed(2)+' bits':'—',C.green,120);
  const keys=L3_SYMS.split('');keys.forEach((k,i)=>{const r=Math.floor(i/9),c=i%9,x=48+c*57,y=222+r*40,dim=s.wrong.includes(k);out+=L3_key(X,'key',k===' '?'_':k,`Guess ${k===' '?'space':k}`,x,y,51,34,k===' '?'␣':k,false,C.blue,15,dim)});
  const done=s.pos>=len;
  return {svg:out,phase:done?`Done. Your counts bound English between ${B?B.lo.toFixed(2):'—'} and ${B?B.up.toFixed(2):'—'} bits per letter. Shannon’s readers, with longer passages, came out between about 0.6 and 1.3: English is roughly three-quarters predictable.`:'Each letter you get first time carries almost no new information. The more guesses a letter takes, the more surprising it was.'};
 }});

// Letter n-gram models of the Alice passage, in the style of Shannon’s (1948) approximations.
function L3_ngram(k){return L3_memo('ng'+k,()=>{const m={},t=L3_LETTERS;for(let i=k;i<t.length;i++){const c=t.slice(i-k,i),n=t[i];(m[c]=m[c]||{})[n]=(m[c][n]||0)+1}return m})}
function L3_blockH(n){return L3_memo('bh'+n,()=>{if(!n)return 0;const c={},t=L3_LETTERS;let N=0;for(let i=0;i+n<=t.length;i++){const g=t.slice(i,i+n);c[g]=(c[g]||0)+1;N++}return -sum(Object.values(c).map(v=>v/N*Math.log2(v/N)))})}
const L3_F=k=>k===0?Math.log2(27):L3_blockH(k)-L3_blockH(k-1);
function L3_pick(dist,r){const tot=sum(Object.values(dist));let x=r()*tot;for(const [ch,v] of Object.entries(dist)){x-=v;if(x<=0)return ch}return Object.keys(dist)[0]}
function L3_gen(order,seed,len=150){
 const r=rng(seed);if(order==='w'){const ranked=L3_rank(L3_AW),d={};ranked.forEach(([w,c])=>d[w]=c);let t='';while(t.length<len)t+=L3_pick(d,r).toUpperCase()+' ';return t.slice(0,len)}
 let t='';for(let i=0;i<len;i++){if(order===0){t+=L3_SYMS[Math.floor(r()*27)];continue}
  let k=order-1,dist=null;while(k>=0&&!dist){const ctx=k?(' '.repeat(k)+t).slice(-k):'';dist=L3_ngram(k)[ctx];k--}t+=L3_pick(dist,r)}
 return t;
}
const L3_SHAN=[4.75,4.03,3.32,3.1];
SCENE({id:'redundancy-entropy-approx',name:'Approximations to English',tag:'Shannon’s n-grams',
 definition:'Shannon (1948) generated text from statistics of real English: first random letters, then letters with their real frequencies, then letters chosen given the one or two before. Each step looks more like English, and the entropy per letter falls as the model sees more context.',
 example:'Random letters give gibberish like XFOML RXKHRJFFJUJ. With letter pairs counted, text gains English-like syllables (ON IE ANTSOUTINYS ARE T INCTORE), and with word frequencies it produces real words in a meaningless order.',
 research:'Shannon, C. E. (1948). A mathematical theory of communication. Bell System Technical Journal 27 (the approximations); Shannon (1951), BSTJ 30 (the values F0 = 4.75, F1 = 4.03, F2 = 3.32, F3 = 3.1 bits from large tables of English). Language machines in era 8 take the same idea to words.',
 desc:'A paragraph of text generated from letter statistics of the Alice passage at the chosen order, with a bar chart of entropy per letter at each order beside Shannon’s values from large English tables.',
 dur:12,hint:'Choose an order and press Generate again. Orders 3 and 4 copy whole chunks of Alice: our sample is only about 4,000 letters, so high-order statistics overfit and their entropy looks too low.',
 init:()=>({o:2,seed:1}),
 watch(p){const os=[0,1,2,3,4,'w'];return {o:os[Math.min(5,Math.floor(p*6))],seed:1}},
 ui:[{choose:[[0,'Random'],[1,'Letters'],[2,'Pairs'],[3,'Triples'],[4,'Fours'],['w','Words']],label:'Order',get:s=>s.o,act:'o'},{b:'Generate again',act:'fresh'}],
 on:{o(s,v){s.o=v==='w'?'w':Number(v)},fresh(s){s.seed=nextSeed()%100000}},
 draw(s){
  const t=L3_gen(s.o,s.seed);let out=heading(s.o==='w'?'Words chosen by frequency':s.o===0?'Every symbol equally likely':`Each letter chosen given the ${s.o-1} before`);
  if(s.o===1)out=heading('Letters with their real frequencies');
  out+=R(24,46,552,94,'#f6f9fb',C.grid,8);L3_wrap(t.replace(/ +/g,' '),56).slice(0,4).forEach((l,j)=>out+=TMF(38,70+j*21,l,15,C.ink,'start'));
  const pl=L3_plot(90,170,330,150,[0,5],[0,5],[],[[0,'0'],[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5']],null,'bits per letter');out+=pl.svg;
  const labs=['random','letters','pairs','triples','fours'];
  for(let k=0;k<5;k++){const F=Math.max(0,L3_F(k)),x=pl.X(k)+10,w=pl.X(1)-pl.X(0)-20,on=k===s.o;out+=R(x,pl.Y(F),w,pl.Y(0)-pl.Y(F),on?C.blue:C.pale,'none',4)+TF(x+w/2,pl.Y(F)-6,F.toFixed(2),13,C.ink)+TF(x+w/2,338,labs[k],13,on?C.blue:C.muted);
   if(k<4)out+=L(x-2,pl.Y(L3_SHAN[k]),x+w+2,pl.Y(L3_SHAN[k]),C.coral,3)}
  out+=R(436,170,146,150,'#fff',C.grid,8)+R(450,190,24,12,C.pale,'none',3)+TF(482,201,'this passage',13,C.ink,'start')+L(450,224,474,224,C.coral,3)+TF(482,229,'Shannon’s',13,C.ink,'start')+TF(482,247,'large tables',13,C.ink,'start')+TF(509,282,'one passage of',13,C.muted)+TF(509,300,'~4,000 letters',13,C.muted);
  return {svg:out,phase:s.o==='w'?'Choosing whole words by frequency gives real words in a meaningless order: frequency alone does not make grammar.':`Each extra letter of context lowers the entropy. ${s.o>=3?'Here the drop is exaggerated: with so little text, the model mostly copies Alice back.':'Shannon’s figures from large tables (red marks) fall more slowly.'}`};
 }});

const L3_DEL='So she was considering in her own mind, as well as she could, for the hot day made her feel very sleepy and stupid, whether the pleasure of making a daisy chain would be worth the trouble of getting up and picking the daisies.';
function L3_delete(text,mode,frac,seed){
 const r=rng(seed),out=[];let removed=0,letters=0;
 if(mode==='halves'){for(const w of text.split(' ')){const keep=Math.ceil(w.replace(/[^a-z]/gi,'').length/2);let k=0;const chars=w.split('').map(ch=>{if(!/[a-z]/i.test(ch))return [ch,0];letters++;k++;if(k>keep){removed++;return [ch,1]}return [ch,0]});out.push(...chars,[' ',0])}return {chars:out,removed,letters}}
 for(const ch of text){if(/[a-z]/i.test(ch)){letters++;const del=mode==='vowels'?/[aeiou]/i.test(ch):r()<frac;if(del)removed++;out.push([ch,del?1:0])}else out.push([ch,0])}
 return {chars:out,removed,letters};
}
SCENE({id:'redundancy-entropy-deletion',name:'Redundancy: losing letters',tag:'Why we can read damaged text',
 definition:'Because English is predictable, much of any text is redundant: it could be removed and still recovered. Shannon (1948) estimated English at roughly 50% redundant over stretches of about eight letters, and later work put it nearer 75% when readers use long context.',
 example:'Remove every vowel, “S sh ws cnsdrng n hr wn mnd”, and the sentence is still mostly readable. Redundancy is why typos rarely stop us, and why speech survives a noisy room.',
 research:'Shannon, C. E. (1948). A mathematical theory of communication. BSTJ 27 (“roughly 50%”); Shannon (1951). BSTJ 30 (0.6–1.3 bits per letter, about 75% redundancy); Rayner, K. et al. (2006). Raeding wrods with jubmled lettres. Psychological Science 17 (scrambled letters cost reading time even when readable).',
 desc:'A sentence from Alice with letters removed at random, all vowels removed, or the back half of every word removed, with a count of letters lost; a button reveals the missing letters in colour.',
 dur:10,hint:'Choose how to damage the text and how much, try to read it, then press Reveal. Random loss is harder than losing vowels at the same rate, because vowels are the most predictable letters.',
 init:()=>({mode:'random',frac:30,seed:2,rev:false}),
 watch(p){const m=['random','random','vowels','halves'][Math.min(3,Math.floor(p*4))];return {mode:m,frac:p<.25?20:45,seed:2,rev:(p*4)%1>.7}},
 ui:[{choose:[['random','Random letters'],['vowels','All vowels'],['halves','Ends of words']],label:'Damage',get:s=>s.mode,act:'mode'},{range:'frac',label:'Random loss',min:0,max:80,step:5,get:s=>s.frac,act:'frac',show:v=>v+'%'},{b:'Reveal',act:'rev'},{b:'New damage',act:'fresh'}],
 on:{mode(s,v){s.mode=v;s.rev=false},frac(s,v){s.frac=Number(v);s.rev=false},rev(s){s.rev=!s.rev},fresh(s){s.seed=nextSeed()%100000;s.rev=false}},
 draw(s){
  const D=L3_delete(L3_DEL,s.mode,s.frac/100,s.seed),pct=Math.round(100*D.removed/D.letters);
  let out=heading(`${pct}% of the letters are gone. Can you still read it?`);
  const lines=[];let cur=[],len=0;const words=[];let w=[];D.chars.forEach(c=>{w.push(c);if(c[0]===' '){words.push(w);w=[]}});if(w.length)words.push(w);
  words.forEach(wd=>{if(len+wd.length>48&&cur.length){lines.push(cur);cur=[];len=0}cur.push(...wd);len+=wd.length});if(cur.length)lines.push(cur);
  out+=R(24,48,552,lines.length*30+24,'#f6f9fb',C.grid,8);
  lines.forEach((ln,j)=>out+=L3_rich(44,78+j*30,ln.map(([ch,d])=>d?(s.rev?[ch,C.coral,1]:['_',C.line]):[ch,C.ink]),17));
  const y=72+lines.length*30+24;
  out+=counter(40,y,'letters removed',`${D.removed} of ${D.letters}`,C.coral,160)+counter(220,y,'Shannon (1948)','≈ 50% redundant',C.green,170)+counter(410,y,'Shannon (1951)','≈ 75% redundant',C.green,160);
  return {svg:out,phase:s.mode==='vowels'?'Vowels carry little information in English text, so losing all of them leaves the sentence readable: the consonants pin down the words.':s.mode==='halves'?'The starts of words carry most of their information; ends can often be guessed from the beginning and the sentence around them.':pct>=60?'Past about half, random loss starts to defeat even a good reader: the redundancy is used up.':'Up to a point you fill the gaps without effort, using spelling patterns, grammar and the story so far.'};
 }});

/* ======================= Lesson: linguistic-relativity ======================= */
const L3_blue=i=>`hsl(212,62%,${82-i*3}%)`;
const L3_BLUEPAIRS=[[7,10],[10,7],[8,11],[11,8],[9,12],[12,9],[1,4],[4,1],[3,6],[14,17],[17,14],[15,18]];
const L3_cross=([a,b])=>(a<10)!==(b<10);
SCENE({id:'linguistic-relativity',name:'Russian blues',tag:'Be the participant',
 definition:'Linguistic relativity is the idea that the language you speak affects how you think. The strong version, that language determines thought, is not supported. A weak version has evidence: words can speed up or bias perception and memory, especially in quick tasks.',
 example:'Russian has two basic words for blue: goluboy (light) and siniy (dark). Winawer and colleagues found Russian speakers were faster to tell two blues apart when they fell on different sides of that boundary; English speakers showed no such edge, and a verbal distraction task removed it for Russians.',
 research:'Winawer, J. et al. (2007). Russian blues reveal effects of language on color discrimination. PNAS 104, 7780–7785; Whorf, B. L. (1956). Language, Thought and Reality; Regier & Kay (2009). Language, thought, and color: Whorf was half right. Trends in Cognitive Sciences 13 (weak effects supported; strong determinism rejected).',
 desc:'A target blue above two choices; you press the one that matches while your response time is recorded, and your average times for pairs within and across the Russian light–dark boundary are compared with the published pattern.',
 dur:12,hint:'Press Start. A blue square appears at the top: press the lower square that matches it, as fast as you can while staying accurate. Twelve trials. Your times stay in this page.',
 init:()=>({order:[],i:-1,side:[],t0:0,rt:[],seed:4,last:null}),
 watch(p){const i=Math.min(12,Math.floor(p*13)),order=range(12),side=[0,1,1,0,1,0,0,1,1,0,1,0];const rt=order.slice(0,i).map(k=>L3_cross(L3_BLUEPAIRS[k])?620:700);return {order,i,side,t0:0,rt,seed:4,last:null,sim:true}},
 ui:[{b:'Start',act:'go'},{b:'Left',act:'ans',arg:0},{b:'Right',act:'ans',arg:1}],
 on:{go(s){s.seed=nextSeed();s.order=shuffled(range(12),s.seed);const r=rng(s.seed+3);s.side=range(12).map(()=>r()<.5?0:1);s.i=0;s.rt=[];s.last=null;s.t0=performance.now()},
  next(s){s.t0=performance.now()},
  ans(s,v,ctx){if(s.i<0||s.i>=12)return;const ok=Number(v)===s.side[s.i],t=performance.now()-s.t0;s.rt.push(ok?t:null);s.last=ok;s.i++;s.t0=performance.now()+1e9;if(s.i<12)ctx.later(400,'next')}},
 draw(s,f,X){
  const active=s.i>=0&&s.i<12;let out=heading(active?'Which lower square matches the top one?':'Light blue or dark blue?');
  if(active){const [tg,fo]=L3_BLUEPAIRS[s.order[s.i]],sd=s.side[s.i];
   out+=R(140,50,80,64,L3_blue(tg),'none',6);
   [0,1].forEach(k=>out+=hit(X,'ans',k,`${k?'Right':'Left'} square`,R(k?190:90,132,80,64,L3_blue(k===sd?tg:fo),'none',6)));
   out+=TF(180,220,`Trial ${s.i+1} of 12${s.last===false?' · last answer was wrong':''}`,13,s.last===false?C.coral:C.muted)}
  else out+=TF(180,130,X.try?(s.i>=12?'Done: see your times':'Press Start'):'Simulated participant',14,C.muted);
  // the shade strip with the Russian boundary
  for(let i=0;i<20;i++)out+=R(30+i*15,252,15,40,L3_blue(i),'none',0);
  out+=L(180,244,180,300,C.coral,2.5)+TF(105,318,'голубой goluboy',13,C.ink)+TF(255,318,'синий siniy',13,C.ink)+TF(180,342,'Russian boundary (position illustrative)',13,C.coral);
  const mean=f=>{const v=s.rt.map((t,j)=>t!==null&&f(L3_BLUEPAIRS[s.order[j]])?t:null).filter(t=>t!==null);return v.length?L3_mean(v):null};
  const within=mean(p=>!L3_cross(p)),across=mean(L3_cross);
  out+=R(340,50,240,300,'#fff',C.grid,10)+TBF(460,74,X.try?'your average times':'simulated times',14,C.ink);
  const mx=Math.max(900,within||0,across||0),bar=(y,lab,v,col)=>TF(352,y+15,lab,13,C.ink,'start')+R(430,y,130,20,'#f1f5f7','none',4)+(v?R(430,y,130*v/mx,20,col,'none',4)+TF(556,y+15,Math.round(v)+' ms',13,C.ink,'end'):TF(438,y+15,'—',13,C.muted,'start'));
  out+=bar(90,'same name',within,C.blue)+bar(120,'across names',across,C.coral);
  out+=TBF(460,176,'published pattern',14,C.ink)+TF(352,200,'Russian speakers: faster',13,C.ink,'start')+TF(352,218,'across the boundary',13,C.ink,'start')+TF(352,244,'English speakers: no',13,C.ink,'start')+TF(352,262,'difference',13,C.ink,'start')+TF(352,288,'Russians under verbal load:',13,C.ink,'start')+TF(352,306,'advantage disappears',13,C.ink,'start')+TF(352,334,'(Winawer et al. 2007)',13,C.muted,'start');
  return {svg:out,phase:within&&across?`Your across-name pairs averaged ${Math.round(across)} ms and same-name pairs ${Math.round(within)} ms. If you are not a Russian speaker, little or no difference is the expected result.`:'The colours are the same for everyone; what differs is how quickly a language’s names help tell them apart. That is a small, measurable effect, not a different world view.'};
 }});

const L3_SNOWVIEW=[['growth','How the number grew'],['english','English snow words'],['count','Counting words']];
const L3_SNOWBARS=[[1911,4,'Boas: 4 roots',C.green],[1940,6,'Whorf: “several”',C.amber],[1978,50,'popular books: “dozens”',C.coral],[1984,100,'press: “100”',C.coral]];
SCENE({id:'linguistic-relativity-snow',name:'The snow-words myth',tag:'A myth examined',
 definition:'A famous claim says “Eskimo” languages have dozens or hundreds of words for snow, proving that language reflects or shapes thought. The number grew by retelling: Franz Boas listed four roots in 1911, and later writers inflated it. Counting words is also meaningless in languages that build new words freely.',
 example:'Boas gave aput ‘snow on the ground’, qana ‘falling snow’, piqsirpoq ‘drifting snow’ and qimuqsuq ‘a snowdrift’. English has snow, sleet, slush, blizzard, flurry, drift and powder, and skiers have many more.',
 research:'Boas, F. (1911). Handbook of American Indian Languages; Whorf (1940). Science and linguistics; Martin, L. (1986). “Eskimo words for snow”: a case study in the genesis and decay of an anthropological example. American Anthropologist 88, 418–423; Pullum, G. K. (1991). The Great Eskimo Vocabulary Hoax. Krupnik & Müller-Wille (2010) document rich sea-ice and snow terminology in some Inuit dialects, which is unsurprising for experts in any domain.',
 desc:'Three views: a timeline of how the claimed number of snow words grew, a set of English snow words, and Boas’s four roots beside a note on why words cannot be counted in a polysynthetic language.',
 dur:10,hint:'Step through the three views. The point is not that Inuit languages lack snow words, but that the famous number was invented and that “how many words” has no fixed answer.',
 init:()=>({v:'growth',yr:1990}),
 watch(p){const v=L3_SNOWVIEW[Math.min(2,Math.floor(p*3))][0];return {v,yr:v==='growth'?1900+Math.round(Math.min(1,p*3)*90):1990}},
 ui:[{choose:L3_SNOWVIEW,label:'View',get:s=>s.v,act:'v'},{range:'yr',label:'Year',min:1900,max:1990,step:5,get:s=>s.yr,act:'yr'}],
 on:{v(s,x){s.v=x},yr(s,x){s.yr=Number(x)}},
 draw(s){
  let out='';
  if(s.v==='growth'){out+=heading(`Claimed number of snow words, by ${s.yr}`);
   const pl=L3_plot(90,56,460,230,[1900,1990],[0,110],[[1900,'1900'],[1920,'1920'],[1940,'1940'],[1960,'1960'],[1980,'1980']],[[0,'0'],[50,'50'],[100,'100']],null,'words claimed');out+=pl.svg;
   L3_SNOWBARS.forEach(([y,n,lab,col],i)=>{if(y>s.yr)return;out+=R(pl.X(y)-12,pl.Y(n),24,pl.Y(0)-pl.Y(n),col,'none',4)+TF(pl.X(y)+(i===3?-16:16),pl.Y(n)+(i>=2?18:-8),lab,13,C.ink,i===3?'end':'start')});
   out+=TF(320,330,'Retellings as traced by Martin (1986) and Pullum (1991); later figures approximate',13,C.muted)}
  else if(s.v==='english'){out+=heading('English has plenty of snow words too');
   const ws=['snow','snowflake','sleet','slush','blizzard','flurry','snowdrift','powder','hardpack','crust','firn','cornice','avalanche','whiteout','graupel','spindrift'];
   ws.forEach((w,i)=>{const c=i%4,r=Math.floor(i/4),x=40+c*134;out+=R(x,60+r*56,124,44,i%2?C.pale:C.greenp,'none',8)+TBF(x+62,88+r*56,w,15,C.ink)});
   out+=TF(300,300,'Skiers, climbers and meteorologists add more. Experts in any domain coin',13,C.ink)+TF(300,320,'words for the distinctions they need, so a big vocabulary shows interest,',13,C.ink)+TF(300,340,'not a different way of seeing.',13,C.ink)}
  else{out+=heading('Boas’s four roots, and the counting problem');
   [['aput','snow on the ground'],['qana','falling snow'],['piqsirpoq','drifting snow'],['qimuqsuq','a snowdrift']].forEach(([w,g],i)=>{const x=40+i*134;out+=R(x,56,124,70,C.purplep,'none',8)+TBF(x+62,84,w,15,C.ink)+TF(x+62,108,g,13,C.ink)});
   out+=TF(300,160,'In polysynthetic languages one root takes many endings, so each root gives',13,C.ink)+TF(300,180,'an open-ended number of words (see Inuktitut in “How languages build words”).',13,C.ink);
   out+=TF(300,214,'English works the same way with phrases: snow on the ground, falling snow…',13,C.ink)+TF(300,234,'Count phrases and English has unlimited snow “words” too.',13,C.ink);
   out+=R(60,260,480,80,'#f6f9fb',C.grid,10)+TBF(300,290,'So “how many words for snow?” has no fixed answer',15,C.coral)+TF(300,316,'Whatever the count, it does not show that speakers see snow differently.',13,C.ink)}
  return {svg:out,phase:s.v==='growth'?'The number rose with retelling, not with new research. Laura Martin traced it back through textbooks to Boas’s four roots.':s.v==='english'?'A rich vocabulary follows from what a community cares about. It is evidence of attention, not of a language shaping perception.':'Without an agreed definition of “word”, the famous number cannot even be stated precisely, let alone tested.'};
 }});

// Animals in a row: room 1 order as seen left to right.
const L3_ANIMALS=[['cow',C.amberp],['pig',C.coralp],['hen',C.greenp]];
function L3_animal(X,act,k,x,y,on=false){const [n,col]=L3_ANIMALS[k];const inner=Ci(x,y,22,col,on?C.blue:C.ink)+TBF(x,y+5,n,13,C.ink)+P(`M${x+22} ${y-6}l10 6l-10 6`,C.ink,2,C.ink);return act?hit(X,act,k,`Place the ${n}`,inner):inner}
SCENE({id:'linguistic-relativity-space',name:'Left, right, north, south',tag:'Spatial frames',
 definition:'Languages describe space in different frames. English mostly uses a relative frame, left and right of the speaker. Some languages, such as Guugu Yimithirr in Australia and Tzeltal in Mexico, mostly use an absolute frame, like north and south or uphill and downhill, even for small objects on a table.',
 example:'In the animals-in-a-row task you see toys in a line, turn round to a second table and rebuild the line. Dutch speakers mostly kept the left-to-right order; Tzeltal speakers mostly kept the compass order, which looks reversed.',
 research:'Levinson, S. C. (2003). Space in Language and Cognition. Cambridge University Press; Haviland, J. B. (1998). Guugu Yimithirr cardinal directions. Ethos 26; Li, P. & Gleitman, L. (2002). Turning the tables: language and spatial reasoning. Cognition 83 (English speakers shifted with the setting); Levinson et al. (2002) replied. The debate about cause continues.',
 desc:'Two rooms seen from the participant’s position, the second turned round; you rebuild the row of three animals on the second table, and the scene says whether you kept the left-to-right (relative) or the compass (absolute) order.',
 dur:10,hint:'Remember the row on table 1. You then turn round to face table 2. Press the animals in the order you would place them, left to right. There is no right answer; the scene tells you which frame you used.',
 init:()=>({place:[]}),
 watch(p){const u=Math.min(1,p*1.4),abs=p>.5;const seq=abs?[2,1,0]:[0,1,2];return {place:seq.slice(0,Math.min(3,Math.floor((abs?(p-.5)*2:p*2)*4)))}},
 ui:[{b:'Clear table 2',act:'clear'}],
 on:{put(s,k){k=Number(k);if(s.place.length<3&&!s.place.includes(k))s.place.push(k)},clear(s){s.place=[]}},
 draw(s,f,X){
  let out=heading('Turn round and rebuild the row');
  const room=(x,title,north)=>{let r=R(x,46,260,170,'#f6f9fb',C.grid,10)+TBF(x+14,68,title,14,C.ink,'start')+R(x+40,86,180,70,'#e8d9c2','none',8);
   const cy=north?92:150;r+=L(x+236,north?110:80,x+236,north?80:110,C.coral,2.5)+P(north?`M${x+230} 86l6 -8l6 8`:`M${x+230} 104l6 8l6 -8`,C.coral,2.5)+TBF(x+236,north?74:126,'N',13,C.coral);
   r+=Ci(x+130,196,10,C.blue)+P(`M${x+124} 184l6 -10l6 10`,C.blue,2.5,C.blue)+TF(x+150,201,'you',13,C.blue,'start');return r};
  out+=room(20,'Table 1',true)+room(320,'Table 2 (turned round)',false);
  [0,1,2].forEach(k=>out+=L3_animal(X,null,k,90+k*60,121));
  s.place.forEach((k,j)=>out+=L3_animal(X,null,k,390+j*60,121));
  for(let j=s.place.length;j<3;j++)out+=Ci(390+j*60,121,22,'none',C.line,'stroke-dasharray="4 4"');
  out+=TF(300,238,'Press the animals in the order you place them, left to right:',13,C.muted);
  [0,1,2].forEach(k=>out+=s.place.includes(k)?L3_animal(X,null,k,230+k*70,272,true):L3_animal(X,'put',k,230+k*70,272));
  let verdict='';if(s.place.length===3){const rel=s.place.join()==='0,1,2',abs=s.place.join()==='2,1,0';verdict=rel?'Relative frame: you kept the order as seen from your body.':abs?'Absolute frame: you kept the compass order (cow to the west).':'Neither frame: a mixed order.'}
  out+=R(40,306,520,58,'#fff',C.grid,8)+TBF(300,330,verdict||'Dutch speakers: mostly relative · Tzeltal speakers: mostly absolute',14,verdict?C.blue:C.ink)+TF(300,352,'Levinson (2003); Li & Gleitman (2002) found settings and landmarks shift answers',13,C.muted);
  return {svg:out,phase:verdict?verdict+' Speakers of absolute-frame languages tend to make the other choice; whether the language causes the habit, or both follow from culture and terrain, is still argued.':'On table 1 the cow is on your left and also to the west. Once you turn round those two descriptions point opposite ways, so your choice reveals which one you remembered.'};
 }});
