/* ===================== Language era 5 · Learning language (1970–today) ===================== */
// Shared helpers for this era (prefix L5_).
const L5_nx=v=>(v*48271)%2147483647||1;
const L5_mean=a=>a.length?sum(a)/a.length:0;
const L5_sig=x=>1/(1+Math.exp(-x));
const L5_IPA='font-family="Noto Sans, Segoe UI Symbol, sans-serif"';
// A plot frame: ranges [lo,hi]; ticks as [value,label]. Returns {svg,X,Y}.
function L5_plot(x,y,w,h,[x0,x1],[y0,y1],xt,yt,xl,yl){
 const X=v=>x+w*clamp((v-x0)/(x1-x0),0,1),Y=v=>y+h-h*clamp((v-y0)/(y1-y0),0,1);
 let s=R(x,y,w,h,'#fff',C.grid,6);
 for(const [v,l] of yt)s+=L(x,Y(v),x+w,Y(v),'#eef3f6',1)+TF(x-7,Y(v)+5,l,13,C.muted,'end');
 for(const [v,l] of xt)s+=L(X(v),y+h,X(v),y+h+5,C.line,1.5)+TF(X(v),y+h+18,l,13,C.muted);
 if(xl)s+=TF(x+w/2,y+h+35,xl,13,C.muted);
 if(yl)s+=TF(x-44,y+h/2,yl,13,C.muted,'middle',`transform="rotate(-90 ${fmt(x-44)} ${fmt(y+h/2)})"`);
 return {svg:s,X,Y};
}
const L5_poly=(pts,col=C.blue,w=2.5,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L'),col,w,'none',extra):'';
// A response button drawn inside the diagram (fixed-size text so it never outgrows its box).
const L5_key=(X,act,arg,label,x,y,w,h,text,on=false,col=C.blue,size=15)=>hit(X,act,arg,label,R(x,y,w,h,on?C.pale:'#fff',on?col:C.line,8)+TBF(x+w/2,y+h/2+size*.36,text,size,C.ink));
function L5_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
// Horizontal result bars: rows [label, value 0–100, colour]; returns svg.
function L5_hbars(x,y,w,rows,max=100,rowH=26,labelW=150){
 let out='';rows.forEach(([lab,v,col],i)=>{const yy=y+i*rowH;out+=TF(x+labelW-8,yy+15,lab,13,C.ink,'end')+R(x+labelW,yy+3,w-labelW,rowH-10,'#f1f5f7','none',4)+(v===null?TF(x+labelW+8,yy+15,'—',13,C.muted,'start'):R(x+labelW,yy+3,(w-labelW)*clamp(v/max,0,1),rowH-10,col,'none',4)+TF(x+labelW+(w-labelW)*clamp(v/max,0,1)+6,yy+15,Math.round(v)+'%',13,C.ink,'start'))});
 return out;
}

/* ======================= Lesson: infant-perception ======================= */
const L5_WT={
 hindi:{name:'Hindi: retroflex ʈa against dental t̪a',a:'ʈa',b:'t̪a',eng:[95,75,20],nat:'Hindi-learning'},
 salish:{name:'Nthlakampx: glottalised kʼi against qʼi',a:'kʼi',b:'qʼi',eng:[80,55,10],nat:'Nthlakampx-learning'},
 english:{name:'English: ba against da',a:'ba',b:'da',eng:[100,100,100],nat:null}};
const L5_AGES=['6–8 mo','8–10 mo','10–12 mo'];
SCENE({id:'infant-perception',name:'Citizens of the world, then specialists',tag:'Perceptual narrowing',
 definition:'Young babies can tell apart speech sounds from any language, including contrasts their parents cannot hear. Over the second half of the first year, discrimination of non-native contrasts falls away while native contrasts stay sharp or improve: perception narrows to the language around them.',
 example:'At six months, babies in English-speaking homes notice the switch between Hindi retroflex ʈa and dental t̪a. By twelve months most no longer do, while Hindi-learning babies of the same age still do.',
 research:'Werker, J. F. & Tees, R. C. (1984). Cross-language speech perception: evidence for perceptual reorganization during the first year of life. Infant Behavior and Development 7, 49–63. Replicated many times; adults can still hear some contrasts under easy test conditions (Werker & Logan 1985).',
 desc:'A baby in the conditioned head-turn procedure, beside bars for the share of English-learning infants who discriminate a contrast at 6–8, 8–10 and 10–12 months, with infants learning that language for comparison.',
 dur:12,hint:'Choose a contrast and an age group. Compare the non-native contrasts with English ba–da, which every age keeps.',
 init:()=>({c:'hindi',a:2}),
 watch(p){const c=p<.4?'hindi':p<.8?'salish':'english',u=c==='hindi'?p/.4:c==='salish'?(p-.4)/.4:(p-.8)/.2;return {c,a:Math.min(2,Math.floor(u*3))}},
 ui:[{choose:[['hindi','Hindi'],['salish','Nthlakampx'],['english','English']],label:'Contrast',get:s=>s.c,act:'c'},{choose:L5_AGES.map((a,i)=>[i,a]),label:'Age',get:s=>s.a,act:'a'}],
 on:{c(s,v){s.c=v},a(s,v){s.a=Number(v)}},
 draw(s){
  const d=L5_WT[s.c],pct=d.eng[s.a],hears=pct>=50;let out=heading('Babies hear contrasts their parents cannot');
  out+=T(300,56,d.name,14,C.muted,'middle',L5_IPA);
  // Conditioned head-turn sketch.
  out+=R(30,96,220,200,'#f7fafc',C.grid,10);
  out+=R(44,180,34,46,C.dark,'none',4)+Ci(61,196,7,'#fff')+Ci(61,214,4,'#fff');
  out+=P('M86 190Q96 203 86 216',C.muted,2)+P('M94 182Q110 203 94 224',C.muted,2);
  out+=R(176,118,62,42,hears?C.amberp:'#fff',hears?C.amber:C.line,6)+TF(207,145,hears?'toy lights':'toy',13,hears?C.amber:C.muted);
  out+=P('M110 290Q140 236 170 290Z',C.blue,2,C.pale)+Ci(140,224,22,'#f6e3d3',C.ink);
  const ex=hears?6:-4,ey=hears?-5:2;out+=Ci(133+ex,221+ey,2.5,C.ink)+Ci(147+ex,221+ey,2.5,C.ink);
  out+=T(140,128,`${d.a} … ${d.b}`,20,C.ink,'middle',L5_IPA);
  out+=TF(140,316,'Conditioned head-turn: turn when',13,C.muted)+TF(140,334,'the sound changes, see a toy',13,C.muted);
  // Bars.
  const pl=L5_plot(320,84,250,180,[0,4],[0,100],[],[[0,'0%'],[50,'50%'],[100,'100%']],null,'babies who tell them apart');out+=pl.svg;
  d.eng.forEach((v,i)=>{const cx=320+(i+.5)*250/4,h=v*1.8;out+=R(cx-20,264-h,40,h,i===s.a?C.coral:C.blue,'none',4)+TF(cx,258-h,v+'%',13,C.ink)+TF(cx,282,L5_AGES[i],13,i===s.a?C.coral:C.muted)});
  const nx=320+3.5*250/4;
  if(d.nat){out+=R(nx-20,84,40,180,C.green,'none',4)+TF(nx,78,'≈100%',13,C.ink)+TF(nx,282,'native',13,C.green)+TF(nx,298,'10–12 mo',13,C.green)}
  else out+=TF(nx,180,'(native',13,C.muted)+TF(nx,198,'for these',13,C.muted)+TF(nx,216,'babies)',13,C.muted);
  out+=TF(445,318,'Blue: English-learning infants.',13,C.muted)+TF(445,336,'Values approximate, redrawn from',13,C.muted)+TF(445,354,'Werker & Tees (1984)',13,C.muted);
  const phase=s.c==='english'?'English babies keep their own ba–da contrast at every age: narrowing removes only what the surrounding language does not use.'
   :s.a===0?`At ${L5_AGES[0].replace(' mo',' months')} nearly all English-learning babies hear ${d.a} and ${d.b} as different, though their parents cannot.`
   :s.a===1?'Between 8 and 10 months the share drops: the baby is tuning to the sounds that matter in the language around it.'
   :`By 10–12 months only about ${pct}% still notice, while ${d.nat} babies of the same age still do. Losing a contrast is a sign of learning, not of damage.`;
  return {svg:out,phase};
 }});

const L5_VOT={english:{name:'English',b:[25],labels:['b','p']},spanish:{name:'Spanish',b:[0],labels:['b','p']},thai:{name:'Thai',b:[-30,35],labels:['b','p','pʰ']}};
const L5_VCOL=[C.blue,C.coral,C.green];
function L5_ident(lang,v){const k=.3,b=L5_VOT[lang].b;if(b.length===1){const pb=1-L5_sig(k*(v-b[0]));return [pb,1-pb]}
 const p0=1-L5_sig(k*(v-b[0])),p2=L5_sig(k*(v-b[1]));return [p0,Math.max(0,1-p0-p2),p2]}
function L5_disc(lang,v){const a=L5_ident(lang,v),b=L5_ident(lang,v+20);return .5+.25*sum(a.map((x,i)=>Math.abs(x-b[i])))}
// A crude synthetic stop + vowel: burst, optional aspiration, voicing after the voice onset time.
function L5_syll(v,at){const b=at+Math.max(0,-v)/1000;
 if(v<0)AUDIO.tone(110,{dur:-v/1000,at,gain:.06,partials:[1,.4,.2],attack:.004,release:.004});
 AUDIO.noise({dur:.012,gain:.14,at:b});if(v>0)AUDIO.noise({dur:v/1000,gain:.035,at:b+.012});
 AUDIO.tone(120,{dur:.32,at:b+Math.max(v,0)/1000,gain:.14,partials:[1,.8,.6,.5,.4,.3,.2,.15],attack:.01,release:.12})}
SCENE({id:'infant-perception-categorical',name:'Voice onset time and categories',tag:'Categorical perception',
 definition:'Voice onset time (VOT) is the gap between releasing a stop consonant and the vocal folds starting to vibrate. It varies smoothly, but listeners hear it in categories: a 20 ms change across a category boundary is easy to notice, while the same change inside a category is hard. One-month-olds already show this pattern.',
 example:'For English listeners, a VOT of 10 ms sounds like “ba” and 30 ms like “pa”, while 40 ms and 60 ms both sound like “pa”. Spanish puts the boundary near 0 ms, and Thai has three categories.',
 research:'Lisker, L. & Abramson, A. S. (1964). A cross-language study of voicing in initial stops. Word 20, 384–422; Liberman et al. (1957), J. Exp. Psychol. 54; Eimas, Siqueland, Jusczyk & Vigorito (1971). Speech perception in infants. Science 171, 303–306. Robust; boundaries here are approximate.',
 desc:'A schematic of a stop consonant (burst, then voicing), identification curves for each category along the VOT scale, and the predicted discrimination of 20 ms pairs, which peaks at the category boundary.',
 dur:12,hint:'Slide the pair along the VOT scale and play it. Across a boundary the two sound like different consonants; inside a category they sound alike. The sound is a crude synthetic sketch, not real speech.',
 init:()=>({vot:10,lang:'english'}),
 watch(p){return {vot:Math.round((-50+p*100)/5)*5,lang:p<.7?'english':'thai'}},
 ui:[{range:'vot',label:'Pair starts at',min:-60,max:60,step:5,get:s=>s.vot,act:'vot',show:v=>`${v} and ${v+20} ms`},{choose:[['english','English'],['spanish','Spanish'],['thai','Thai']],label:'Listener',get:s=>s.lang,act:'lang'},{b:'Play the pair',act:'play'}],
 on:{vot(s,v){s.vot=Number(v)},lang(s,v){s.lang=v},play(s){L5_syll(s.vot,0);L5_syll(s.vot+20,.8);return 'keep'}},
 draw(s){
  const lg=L5_VOT[s.lang],v=s.vot;let out=heading(`${lg.name} listeners: where does “b” become “p”?`);
  // Waveform schematic for the first sound of the pair.
  const tx=t=>120+(t+70)*2.5;out+=L(60,96,560,96,C.grid,1.5)+TF(46,100,'time',13,C.muted,'end');
  out+=L(tx(0),68,tx(0),118,C.ink,3)+TF(tx(0),134,'burst',13,C.ink);
  let w='';const on=Math.max(v,0),st=v<0?v:on;for(let t=st;t<=130;t+=2){w+=(t===st?'M':'L')+fmt(tx(t))+' '+fmt(96-(t>=on?12:5)*Math.sin(t*.9))}
  out+=P(w,C.blue,2);if(v>0){let a='';for(let t=1;t<v;t+=1.5)a+=(t<2?'M':'L')+fmt(tx(t))+' '+fmt(96+((t*37)%7-3)*1.6);out+=P(a,C.muted,1.5)}
  out+=TF(tx(Math.max(on,8))+6,72,`voicing from ${v} ms`,13,C.blue,'start');
  // Identification.
  const pl=L5_plot(70,160,250,130,[-60,80],[0,1],[[-60,'−60'],[0,'0'],[40,'40'],[80,'80 ms']],[[0,'0'],[.5,'.5'],[1,'1']],'voice onset time',null);out+=pl.svg;
  lg.labels.forEach((lab,c)=>{const pts=[];for(let t=-60;t<=80;t+=2)pts.push([pl.X(t),pl.Y(L5_ident(s.lang,t)[c])]);out+=L5_poly(pts,L5_VCOL[c],2.5)});
  lg.labels.forEach((lab,c)=>out+=T(84+c*44,180,'“'+lab+'”',14,L5_VCOL[c],'start',L5_IPA));
  out+=R(pl.X(v),160,pl.X(v+20)-pl.X(v),130,C.amber,'none',0,'opacity=".18"')+TF(195,146,'heard as each category',13,C.muted);
  // Discrimination.
  const pd=L5_plot(380,160,190,130,[-60,60],[.5,1],[[-60,'−60'],[0,'0'],[60,'60']],[[.5,'50%'],[.75,'75%'],[1,'100%']],'pair starting VOT (ms)',null);out+=pd.svg;
  const dp=[];for(let t=-60;t<=60;t+=2)dp.push([pd.X(t),pd.Y(L5_disc(s.lang,t))]);out+=L5_poly(dp,C.purple,2.5);
  const dv=L5_disc(s.lang,v);out+=Ci(pd.X(v),pd.Y(dv),7,C.coral,'#fff')+TF(475,146,'20 ms pairs told apart',13,C.muted);
  const cross=dv>.7;out+=TF(300,336,cross?`${v} and ${v+20} ms fall in different categories: about ${Math.round(dv*100)}% correct.`:`${v} and ${v+20} ms fall in the same category: near chance (${Math.round(dv*100)}%).`,14,cross?C.green:C.coral);
  out+=TF(300,358,'Predicted from identification (approximate boundaries after Lisker & Abramson 1964)',13,C.muted);
  return {svg:out,phase:cross?'A change of just 20 ms that crosses a boundary is heard as a new consonant. Eimas and colleagues found that one- and four-month-olds, sucking on a dummy, noticed exactly these crossings.':'Inside a category, a 20 ms change is mostly not heard: the ear sorts a continuous signal into a few bins. The bins differ between languages.'};
 }});

const L5_KUHL=[['live','Live Mandarin tutor',66],['av','Same tutor on video',55],['audio','Audio recording only',54],['control','Live English (control)',56],['taiwan','Taiwanese babies, Mandarin at home',67]];
SCENE({id:'infant-perception-social',name:'Learning sounds from people, not screens',tag:'The social gate',
 definition:'Patricia Kuhl and colleagues gave 9-month-old American babies twelve 25-minute sessions of Mandarin over four weeks. Babies who heard it from a live speaker kept a Mandarin contrast that English-learning babies usually lose; babies who heard the same speakers on video or audio did not. Kuhl argued that social interaction gates early speech learning.',
 example:'After twelve play sessions with a Mandarin speaker, American babies told apart two Mandarin consonants about as well as babies growing up with Mandarin in Taiwan.',
 research:'Kuhl, P. K., Tsao, F.-M. & Liu, H.-M. (2003). Foreign-language experience in infancy: effects of short-term exposure and social interaction on phonetic learning. PNAS 100, 9096–9101; Lytle, Garcia-Sierra & Kuhl (2018), PNAS 115 (video watched with a peer). Small groups; a key result not yet tested at large scale.',
 desc:'Icons for each kind of Mandarin exposure, beside horizontal bars for the share of test trials on which babies discriminated the Mandarin contrast, with a line at chance.',
 dur:10,hint:'Choose a group to see how it was exposed to Mandarin and how it scored at test. The percentages are approximate.',
 init:()=>({c:'live'}),
 watch(p){return {c:L5_KUHL[Math.min(4,Math.floor(p*5))][0]}},
 ui:[{choose:[['live','Live tutor'],['av','Video'],['audio','Audio only'],['control','English control'],['taiwan','Taiwan']],label:'Group',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=v}},
 draw(s,f,X){
  const k=L5_KUHL.find(r=>r[0]===s.c);let out=heading('Twelve play sessions of Mandarin at nine months');
  out+=R(30,60,230,230,'#f7fafc',C.grid,10);
  const baby=(x,y)=>Ci(x,y,13,'#f6e3d3',C.ink)+P(`M${x-16} ${y+40}Q${x} ${y+8} ${x+16} ${y+40}Z`,C.blue,2,C.pale);
  out+=baby(80,200);
  if(s.c==='live'||s.c==='control'){out+=Ci(190,140,17,'#f6e3d3',C.ink)+P('M166 230Q190 160 214 230Z',C.purple,2,C.purplep)+TF(190,252,s.c==='live'?'speaks Mandarin':'speaks English',13,C.ink)}
  else if(s.c==='av'){out+=R(150,118,90,70,C.dark,C.ink,6)+Ci(195,142,12,'#f6e3d3')+R(181,156,28,24,C.purplep,'none',4)+L(195,188,195,214,C.ink,3)+TF(195,252,'on a screen',13,C.ink)}
  else if(s.c==='audio'){out+=R(170,130,40,56,C.dark,'none',5)+Ci(190,148,8,'#fff')+Ci(190,170,5,'#fff')+P('M220 140Q232 158 220 176',C.muted,2)+TF(190,252,'loudspeaker only',13,C.ink)}
  else out+=P('M150 180L195 140L240 180V230H150Z',C.green,2,C.greenp)+TF(195,252,'Mandarin at home',13,C.ink);
  out+=TF(145,96,s.c==='taiwan'?'comparison group':'12 × 25 min over 4 weeks',13,C.muted);
  out+=TF(145,282,'Test at 10–11 months',13,C.muted);
  const rows=L5_KUHL.map(r=>[r[1].length>24?r[1].slice(0,22)+'…':r[1],r[2],r[0]===s.c?C.coral:r[0]==='taiwan'?C.green:C.blue]);
  out+=TF(430,70,'Mandarin contrast told apart (% of trials)',13,C.muted);
  out+=L5_hbars(280,82,300,rows,100,34,170);
  const cx=280+170+130*.5;out+=L(cx,80,cx,256,C.ink,1.5,'stroke-dasharray="4 4"')+TF(cx,272,'chance 50%',13,C.muted);
  out+=TF(430,300,'Approximate values; small groups (about 16 each)',13,C.muted);
  out+=TF(300,336,s.c==='live'?'Live exposure: learning, close to babies raised with Mandarin.':s.c==='taiwan'?'The benchmark: babies hearing Mandarin every day.':s.c==='control'?'English play sessions: the usual decline.':'Same speech, same amount: no learning from a screen or speaker alone.',14,s.c==='live'||s.c==='taiwan'?C.green:C.coral);
  return {svg:out,phase:s.c==='av'||s.c==='audio'?'Hearing the same Mandarin from a recording left the babies no better than controls. A later study found that watching video together with another baby helped, which fits the idea that social engagement opens the gate.':'Babies who played with a live Mandarin speaker held on to a contrast that English-learning babies normally lose by 12 months. It is a striking result from small samples, so treat the exact numbers with care.'};
 }});

/* ======================= Lesson: statistical-learning ======================= */
const L5_SYL=['tu','pi','ro','go','la','bu','bi','da','ku','pa','do','ti'];
const L5_WORDS=[[0,1,2],[3,4,5],[6,7,8],[9,10,11]];
const L5_PART=[[2,6,7],[5,9,10],[8,0,1],[11,3,4]];
const L5_MIDI=[62,69,65,60,67,72,64,71,57,66,59,70];
const L5_STEP=280,L5_NW=30;
function L5_wordSeq(seed,n){const r=rng(seed),out=[];while(out.length<n){const w=Math.floor(r()*4);if(w!==out[out.length-1])out.push(w)}return out}
const L5_sylStream=(seed,n)=>L5_wordSeq(seed,n).flatMap(w=>L5_WORDS[w]);
const L5_itemText=a=>a.map(i=>L5_SYL[i]).join('');
function L5_trials(seed){const base=[];for(let w=0;w<4;w++)for(let k=0;k<2;k++)base.push([w,(w+k*2+1)%4]);const r=rng(seed+5);return shuffled(base,seed).map(([w,pw])=>({w,pw,left:r()<.5?'w':'pw'}))}
const L5_playItem=(a,at=0)=>AUDIO.seq(a.map((y,i)=>({hz:midiHz(L5_MIDI[y]),at:at+i*L5_STEP/1000,dur:.24})),{type:'triangle',gain:.13,release:.05});
const L5_SIM_ANS=[1,1,0,1,1,1,0,1];
SCENE({id:'statistical-learning',name:'Finding words in a stream',tag:'Be the participant',
 definition:'Speech has no reliable pauses between words. Jenny Saffran, Richard Aslin and Elissa Newport showed that 8-month-old babies can find word-like units anyway, by tracking which syllables tend to follow which. After two minutes of a stream made of four three-syllable nonsense words, babies told the words apart from “part-words” that straddled a word boundary.',
 example:'In the stream “…tupirogolabubidaku…”, ro is always followed by go only when the word tupiro happens to come before golabu, but tu is always followed by pi. That difference is enough to find the words.',
 research:'Saffran, J. R., Aslin, R. N. & Newport, E. L. (1996). Statistical learning by 8-month-old infants. Science 274, 1926–1928; Saffran, Newport & Aslin (1996), J. Memory and Language 35 (adults, about 76% after 21 minutes); Saffran et al. (1999), Cognition 70 (tone streams). Robust in adults; the infant effect is real but small on average (Black & Bergmann 2017).',
 desc:'A stream of 90 syllables made of four hidden words appears one syllable at a time, with a matching tone for each syllable; then eight two-choice trials ask which of two items felt more like a word, and your score is shown beside chance and the adult result.',
 dur:14,hint:'Press Start and just watch (and listen): no need to try to find the words. Then pick the item that feels more familiar on each of eight trials. Your answers stay in this page.',
 init:()=>({phase:'idle',seed:17,pos:0,t:0,ans:[],tok:0}),
 watch(p){if(p<.55)return {phase:'listen',seed:17,pos:Math.floor(p/.55*L5_NW*3),t:0,ans:[],tok:0,sim:true};const t=Math.min(8,Math.floor((p-.55)/.42*9));return {phase:t>=8?'done':'test',seed:17,pos:0,t,ans:L5_SIM_ANS.slice(0,t),tok:0,sim:true}},
 ui:[{b:'Start',act:'start'},{b:'Skip to the test',act:'skip'},{b:'New stream',act:'fresh'}],
 on:{start(s,a,ctx){AUDIO.stopAll();s.phase='listen';s.pos=0;s.t=0;s.ans=[];s.tok++;const st=L5_sylStream(s.seed,L5_NW);L5_playItem(st);ctx.every(L5_STEP,'tick',s.tok)},
  tick(s,t){if(Number(t)!==s.tok||s.phase!=='listen')return 'stop';s.pos++;if(s.pos>=L5_NW*3){s.phase='test';return 'stop'}},
  skip(s){AUDIO.stopAll();s.tok++;s.phase='test';s.t=0;s.ans=[]},
  fresh(s){AUDIO.stopAll();s.tok++;s.seed=L5_nx(s.seed);s.phase='idle';s.pos=0;s.t=0;s.ans=[]},
  pick(s,side){if(s.phase!=='test')return;const tr=L5_trials(s.seed)[s.t],chosen=side==='L'?tr.left:(tr.left==='w'?'pw':'w');s.ans.push(chosen==='w'?1:0);s.t++;if(s.t>=8)s.phase='done'},
  hear(s,side){if(s.phase!=='test')return 'keep';const tr=L5_trials(s.seed)[s.t],it=(side==='L')===(tr.left==='w')?L5_WORDS[tr.w]:L5_PART[tr.pw];L5_playItem(it);return 'keep'}},
 draw(s,f,X){
  let out=heading('Four hidden words, no pauses between them');
  const st=L5_sylStream(s.seed,L5_NW);
  if(s.phase==='idle'){
   out+=R(60,70,480,150,'#f7fafc',C.grid,10)+TF(300,104,'You will see (and hear) 90 syllables, one every 0.28 s,',14,C.ink)+TF(300,128,'with no gaps. Just watch: about 25 seconds.',14,C.ink);
   out+=TMF(300,170,L5_itemText(st.slice(0,18))+'…',17,C.muted)+TF(300,202,'Then: eight quick “which felt more like a word?” choices.',13,C.muted);
  }else if(s.phase==='listen'){
   const y=st[Math.min(st.length-1,s.pos)];out+=R(220,64,160,96,'#fff',C.blue,12)+TB(300,128,L5_SYL[y],40,C.ink);
   const from=Math.max(0,s.pos-14);out+=TMF(300,192,L5_itemText(st.slice(from,s.pos+1)),17,C.muted);
   out+=R(80,214,440,10,'#eef3f6','none',5)+R(80,214,440*(s.pos+1)/st.length,10,C.blue,'none',5)+TF(300,244,`syllable ${Math.min(s.pos+1,st.length)} of ${st.length}`,13,C.muted);
  }else{
   const trs=L5_trials(s.seed),tr=trs[Math.min(7,s.t)];
   if(s.phase==='test'){
    out+=TF(300,62,`Trial ${s.t+1} of 8: which felt more like a word from the stream?`,14,C.ink);
    const items=tr.left==='w'?[L5_WORDS[tr.w],L5_PART[tr.pw]]:[L5_PART[tr.pw],L5_WORDS[tr.w]];
    ['L','R'].forEach((side,i)=>{const x=i?320:110;out+=L5_key(X,'pick',side,`Choose ${L5_itemText(items[i])}`,x,78,170,62,L5_itemText(items[i]),false,C.blue,22);out+=L5_key(X,'hear',side,`Hear ${L5_itemText(items[i])}`,x+45,148,80,32,'▶ hear',false,C.blue,13)});
   }else out+=TF(300,96,'Done. The real words were tupiro, golabu, bidaku, padoti.',14,C.ink)+TF(300,120,'The others were part-words: the end of one word and the start of the next.',13,C.muted);
   const n=s.ans.length,you=n?100*sum(s.ans)/n:null;
   out+=TF(300,206,X.try?(n?`You chose the real word on ${sum(s.ans)} of ${n} trials`:'Your score appears here'):'Simulated participant',13,C.muted);
   out+=L5_hbars(70,216,460,[[X.try?'you':'simulated',you,C.coral],['chance',50,C.line],['adults, 21 min (1996)',76,C.blue]],100,30,170);
  }
  const done=s.phase==='done';
  return {svg:out,phase:done?'Tracking which syllable follows which is enough to pull words out of a seamless stream. With only 25 seconds of exposure, scores near chance are common; adults with 21 minutes reach about three in four.':s.phase==='listen'?'There are no pauses or stresses to help. The only clue is that syllables inside a word always follow each other, while the syllable after a word could start any of three other words.':'Each trial pairs a real word with a part-word that did occur in the stream, only less reliably. Choose by feel.'};
 }});

// Transitional probabilities from a long stream (300 words, seed 3).
const L5_TPC=(()=>{const st=L5_sylStream(3,300),c={},u={};for(let i=0;i<st.length-1;i++){u[st[i]]=(u[st[i]]||0)+1;const k=st[i]+','+st[i+1];c[k]=(c[k]||0)+1}return {c,u}})();
const L5_tp=(a,b)=>(L5_TPC.c[a+','+b]||0)/(L5_TPC.u[a]||1);
const L5_inWord=(a,b)=>L5_WORDS.some(w=>(w[0]===a&&w[1]===b)||(w[1]===a&&w[2]===b));
SCENE({id:'statistical-learning-tp',name:'Transitional probability',tag:'The statistic babies track',
 definition:'The transitional probability from syllable X to syllable Y is how often Y comes next, out of all the times X occurs. Inside a word it is high; across a word boundary it is low, because many different words can follow. Dips in transitional probability mark likely word boundaries.',
 example:'In Saffran’s stream, tu is followed by pi every time (1.0), but ro, the end of tupiro, is followed by go only about a third of the time, because any of the other three words can come next.',
 research:'Saffran, Aslin & Newport (1996), Science 274; Aslin, Saffran & Newport (1998), Psychological Science 9 (babies track probabilities, not just frequencies); Harris, Z. S. (1955). From phoneme to morpheme. Language 31, 190–222 (the idea for linguists).',
 desc:'Twelve syllables from the stream in a row, with a bar for the transitional probability across each gap: tall inside words, low at word boundaries; press a gap to see the counts behind its bar.',
 dur:10,hint:'Move along the stream with the slider and press a gap between two syllables to see how its probability was counted.',
 init:()=>({start:0,sel:2}),
 watch(p){return {start:Math.floor(p*40),sel:Math.floor(p*40)%11}},
 ui:[{range:'start',label:'Position in stream',min:0,max:160,get:s=>s.start,act:'start',show:v=>'syllable '+(v+1)}],
 on:{start(s,v){s.start=Number(v)},gap(s,v){s.sel=Number(v)}},
 draw(s,f,X){
  const st=L5_sylStream(11,60),win=st.slice(s.start,s.start+12),cw=44,x0=36;let out=heading('Where does the next syllable become unpredictable?');
  win.forEach((y,i)=>out+=R(x0+i*cw+2,62,cw-4,36,C.pale,C.blue,6)+TBF(x0+i*cw+cw/2,86,L5_SYL[y],15,C.ink));
  const base=250;out+=L(x0,base,x0+12*cw,base,C.line,1.5)+TF(x0-6,base+5,'0',13,C.muted,'end')+TF(x0-6,base-130+5,'1',13,C.muted,'end')+L(x0,base-130,x0+12*cw,base-130,'#eef3f6',1);
  for(let i=0;i<11;i++){const a=win[i],b=win[i+1],tp=L5_tp(a,b),gx=x0+(i+1)*cw,on=i===s.sel;
   out+=hit(X,'gap',i,`Gap between ${L5_SYL[a]} and ${L5_SYL[b]}: probability ${tp.toFixed(2)}`,R(gx-12,base-130*tp,24,130*tp,on?C.coral:L5_inWord(a,b)?C.blue:C.amber,'none',3)+R(gx-14,102,28,base-102,'#000','none',0,'opacity="0"'))+TF(gx,base+18,tp.toFixed(2).replace(/^0/,''),13,on?C.coral:C.muted);
   if(!L5_inWord(a,b))out+=L(gx,100,gx,base-130*tp-6,C.amber,1.5,'stroke-dasharray="3 3"')}
  const a=win[s.sel],b=win[s.sel+1],n=L5_TPC.c[a+','+b]||0,m=L5_TPC.u[a];
  out+=TF(300,288,`After “${L5_SYL[a]}”, the next syllable was “${L5_SYL[b]}” ${n} times out of ${m}: probability ${(n/m).toFixed(2)}`,14,C.ink);
  let wi=[],ac=[];for(let i=0;i<12;i++)for(let j=0;j<12;j++){const t=L5_tp(i,j);if(t>0)(L5_inWord(i,j)?wi:ac).push(t)}
  out+=TF(300,316,`Counted over a 900-syllable stream: inside words ${L5_mean(wi).toFixed(2)} on average, across word boundaries ${L5_mean(ac).toFixed(2)}`,13,C.muted);
  out+=R(150,336,14,14,C.blue,'none',3)+TF(170,348,'inside a word',13,C.muted,'start')+R(300,336,14,14,C.amber,'none',3)+TF(320,348,'across a word boundary',13,C.muted,'start');
  return {svg:out,phase:L5_inWord(a,b)?`Inside a word the next syllable is certain: ${L5_SYL[a]} is always followed by ${L5_SYL[b]}.`:`At a word boundary the probability drops to about a third, because ${L5_SYL[a]} ends a word and any of three other words can follow. The dip marks the boundary.`};
 }});

// A toy child-directed corpus: words split into syllables; utterances come from a few frames.
const L5_LEX={the:['the'],doggy:['dog','gy'],baby:['ba','by'],pretty:['pre','tty'],kitty:['ki','tty'],look:['look'],at:['at'],bottle:['bo','ttle'],banana:['ba','na','na'],more:['more']};
const L5_NOUNS=['doggy','baby','kitty','bottle','banana'];
const L5_CORPUS=(()=>{const r=rng(23),out=[];for(let i=0;i<300;i++){const N=L5_NOUNS[Math.floor(r()*5)],k=Math.floor(r()*5);out.push(k===0?['look','at','the',N]:k===1?['pretty',N]:k===2?['more',N]:k===3?['the',N]:[N])}return out})();
const L5_SEGTP=(()=>{const c={},u={};for(const utt of L5_CORPUS){const sy=utt.flatMap(w=>L5_LEX[w]);for(let i=0;i<sy.length-1;i++){u[sy[i]]=(u[sy[i]]||0)+1;c[sy[i]+' '+sy[i+1]]=(c[sy[i]+' '+sy[i+1]]||0)+1}}return (a,b)=>(c[a+' '+b]||0)/(u[a]||1)})();
// Segment one utterance: returns predicted spans [[start,end)] over its syllables, and the true spans.
function L5_segment(utt,th){const sy=utt.flatMap(w=>L5_LEX[w]),truth=[];let k=0;for(const w of utt){truth.push([k,k+L5_LEX[w].length]);k+=L5_LEX[w].length}
 const pred=[];let st=0;for(let i=0;i<sy.length-1;i++)if(L5_SEGTP(sy[i],sy[i+1])<th){pred.push([st,i+1]);st=i+1}pred.push([st,sy.length]);return {sy,truth,pred}}
function L5_score(th){let tp=0,np=0,nt=0;for(const u of L5_CORPUS){const {truth,pred}=L5_segment(u,th),ts=new Set(truth.map(x=>x.join(',')));np+=pred.length;nt+=truth.length;tp+=pred.filter(x=>ts.has(x.join(','))).length}return {prec:tp/np,rec:tp/nt}}
const L5_SHOW=[['look','at','the','doggy'],['pretty','baby'],['more','banana'],['the','kitty']];
SCENE({id:'statistical-learning-segment',name:'A segmenter built on dips',tag:'What statistics can and cannot do',
 definition:'A simple learner can cut speech wherever the transitional probability falls below a threshold. On child-directed speech it finds many real words, but it also glues together words that always appear together and can split words whose syllables are shared with other words. Real babies combine statistics with other cues such as stress and pauses.',
 example:'If a parent always says “look at”, the two words always follow each other and a statistics-only learner treats “lookat” as one word, a mistake toddlers really make.',
 research:'Saffran, Aslin & Newport (1996); Johnson, E. K. & Jusczyk, P. W. (2001). Word segmentation by 8-month-olds: when speech cues count more than statistics. J. Memory and Language 44, 548–567; Thiessen & Saffran (2003), Developmental Psychology 39. The corpus here is a toy.',
 desc:'Four example utterances from a toy child-directed corpus, cut into words wherever the transitional probability falls below the threshold; green words are right, coral ones are wrong, and gauges show precision and recall over 300 utterances.',
 dur:10,hint:'Move the threshold. Low thresholds cut rarely and glue words together; high ones cut too often and split words. Pauses between utterances always count as boundaries.',
 init:()=>({th:40}),
 watch(p){return {th:Math.round(10+p*85)}},
 ui:[{range:'th',label:'Cut where probability is below',min:5,max:95,step:5,get:s=>s.th,act:'th',show:v=>(v/100).toFixed(2)}],
 on:{th(s,v){s.th=Number(v)}},
 draw(s){
  const th=s.th/100;let out=heading(`Cut wherever the next syllable has probability below ${th.toFixed(2)}`);
  L5_SHOW.forEach((utt,r)=>{const {sy,truth,pred}=L5_segment(utt,th),ts=new Set(truth.map(x=>x.join(','))),y=66+r*58,cw=54;
   sy.forEach((x,i)=>out+=R(40+i*cw,y,cw-4,28,'#f7fafc',C.grid,5)+TF(40+i*cw+(cw-4)/2,y+19,x,13,C.ink));
   for(let i=0;i<sy.length-1;i++){const t=L5_SEGTP(sy[i],sy[i+1]);out+=TF(40+(i+1)*cw-2,y-4,t.toFixed(2).replace(/^0/,''),13,t<th?C.amber:C.line)}
   pred.forEach(([a,b])=>{const ok=ts.has(a+','+b);out+=L(42+a*cw,y+34,40+b*cw-6,y+34,ok?C.green:C.coral,4)+TF(40+a*cw,y+50,sy.slice(a,b).join(''),13,ok?C.green:C.coral,'start')});
   out+=TF(470,y+19,'“'+utt.join(' ')+'”',13,C.muted,'start')});
  const sc=L5_score(th);out+=counter(80,306,'precision: cuts that give real words',Math.round(sc.prec*100)+'%',C.green,210)+counter(310,306,'recall: real words found',Math.round(sc.rec*100)+'%',C.blue,210);
  return {svg:out,phase:th<.5?'At low thresholds the learner cuts only at sharp dips. “look at” is always followed by “the” in this corpus, so the three stay glued (“lookatthe” or longer): a statistics-only learner has no way to split words that always occur together.':th>.55?'At high thresholds the learner starts splitting real words: “ba” begins both “baby” and “banana”, so even inside those words the next syllable is uncertain.':'A middle threshold finds most words. The remaining errors come from words that always appear together and from syllables shared between words: statistics alone are not the whole story.'};
 }});

/* ======================= Lesson: word-learning ======================= */
SCENE({id:'word-learning',name:'Fast mapping',tag:'One hearing, one guess',
 definition:'Children can link a new word to a new thing after hearing it once, often by assuming that a new word does not name something that already has a name (mutual exclusivity). Susan Carey called this fast mapping. Later work showed that picking the right object is not the same as remembering the word: without more exposure, the link often fades within minutes.',
 example:'Asked to “bring me the chromium tray, not the blue one”, three- and four-year-olds pick the olive tray, though nobody has told them what chromium means.',
 research:'Carey, S. & Bartlett, E. (1978). Acquiring a single new word. Papers and Reports on Child Language Development 15, 17–29; Markman, E. M. & Wachtel, G. F. (1988), Cognitive Psychology 20 (mutual exclusivity); Horst, J. S. & Samuelson, L. K. (2008). Fast mapping but poor retention by 24-month-old infants. Infancy 13, 128–157.',
 desc:'Two trays, one blue and one an unnamed olive colour, under a spoken request; press a tray, then compare how often toddlers pick the new object with how often they remember it five minutes later.',
 dur:10,hint:'Press the tray you would bring. Then look at the chart: choosing correctly in the moment is not the same as learning the word.',
 init:()=>({pick:null}),
 watch(p){return {pick:p<.4?null:'olive'}},
 ui:[{b:'Ask again',act:'reset'}],
 on:{tray(s,v){s.pick=v},reset(s){s.pick=null}},
 draw(s,f,X){
  let out=heading('“Bring me the chromium tray, not the blue one.”');
  const tray=(x,col,id,name)=>hit(X,'tray',id,`The ${name} tray`,P(`M${x} 130L${x+140} 130L${x+124} 186L${x+16} 186Z`,s.pick===id?C.coral:C.ink,s.pick===id?4:2,col)+R(x+10,112,120,18,col,'none',4,'opacity=".7"'));
  out+=tray(80,'#3d7cc9','blue','blue')+tray(300,'#8a8f3c','olive','olive');
  out+=TF(150,212,'blue: a word the child knows',13,C.muted)+TF(370,212,'olive: no word yet',13,C.muted);
  if(s.pick)out+=TF(300,246,s.pick==='olive'?'The new word went to the thing with no name: mutual exclusivity.':'Blue already has a name, so most children choose the other tray.',14,s.pick==='olive'?C.green:C.coral);
  else out+=TF(300,246,X.try?'Press a tray':'A child hears the request once…',14,C.muted);
  const pl=L5_plot(150,268,300,70,[0,2],[0,100],[],[],null,null);out+=pl.svg;
  out+=R(190,338-62,90,62,C.green,'none',4)+R(320,338-26,90,26,C.amber,'none',4);
  out+=L(150,338-23,450,338-23,C.ink,1.5,'stroke-dasharray="4 4"')+TF(456,338-19,'chance',13,C.muted,'start');
  out+=TF(235,358,'picks the new object',13,C.green)+TF(365,358,'5 minutes later',13,C.amber)+TF(110,300,'schematic,',13,C.muted,'end')+TF(110,318,'after Horst &',13,C.muted,'end')+TF(110,336,'Samuelson 2008',13,C.muted,'end');
  return {svg:out,phase:s.pick?'Two-year-olds pick the new object well above chance, but Horst and Samuelson found that five minutes later they chose it only at chance unless the object had been seen again. Fast mapping is a first guess; learning the word takes repetition.':'Nobody explains “chromium”. The child has to work out what it names from what it is not.'};
 }});

// Cross-situational learning (Yu & Smith 2007), a 2 × 2 design with 6 words.
const L5_XWORDS=['bosa','gasser','manu','colat','kaki','regli'];
const L5_XROUNDS=[[[0,1],[2,3],[4,5]],[[0,2],[1,4],[3,5]],[[0,3],[1,5],[2,4]],[[0,5],[1,2],[3,4]]];
const L5_XPTS=[[[0,-1],[.95,-.31],[.59,.81],[-.59,.81],[-.95,-.31]],[[-1,-.4],[0,-1],[1,-.4],[.6,1],[-.6,1]],[[-1,-1],[-.2,-1],[-.2,.2],[1,.2],[1,1],[-1,1]],[[-1,0],[-.5,-.9],[.5,-.9],[1,0],[.5,.9],[0,.3],[-.5,.9]],[[0,-1],[.8,.2],[.4,.9],[-.4,.9],[-.8,.2]],[[-1,-.6],[-.4,-1],[.2,-.4],[1,-.8],[.6,.6],[0,.2],[-.6,1]]];
const L5_shape=(i,x,y,r,col=C.purple)=>`<polygon points="${L5_XPTS[i].map(([a,b])=>fmt(x+a*r)+','+fmt(y+b*r)).join(' ')}" fill="${col}" stroke="${C.ink}" stroke-width="1.6" stroke-linejoin="round"/>`;
function L5_xTrials(seed){const r=rng(seed+3);return shuffled(L5_XROUNDS.flat(),seed).map(([a,b])=>({w:r()<.5?[a,b]:[b,a],o:r()<.5?[a,b]:[b,a]}))}
function L5_xTest(seed){const r=rng(seed+9);return shuffled([0,1,2,3,4,5],seed+1).map(w=>({w,opts:shuffled([w].concat(shuffled([0,1,2,3,4,5].filter(x=>x!==w),seed+w).slice(0,3)),seed+w*7)}))}
const L5_XSIM=[1,1,1,0,1,1];
SCENE({id:'word-learning-cross',name:'Learning words across situations',tag:'Be the participant',
 definition:'In any single moment a child hears several words and sees several things, so one scene cannot say which word goes with which thing. Across many scenes, though, the right pairs keep turning up together. Chen Yu and Linda Smith showed that adults (and later infants) pick up word meanings from these co-occurrences without ever seeing a single unambiguous naming.',
 example:'You hear “bosa” and “manu” while seeing a pentagon and an L-shape, then “bosa” and “colat” with a pentagon and a notched shape. The pentagon is the only thing present both times “bosa” is heard.',
 research:'Yu, C. & Smith, L. B. (2007). Rapid word learning under uncertainty via cross-situational statistics. Psychological Science 18, 414–420 (adults, 2 × 2 trials: about 90% correct, approximate); Smith & Yu (2008), Cognition 106 (12- and 14-month-olds). Replicated; how learners do it (tracking all pairs or testing one guess) is debated (Trueswell et al. 2013).',
 desc:'Twelve scenes, each with two made-up words and two novel shapes in a random arrangement, then a test asking which of four shapes each word named; a co-occurrence grid shows why the right answers stand out.',
 dur:14,hint:'Press Start and watch twelve scenes (about three seconds each). Words and shapes are not lined up, so do not look for position. Then pick the shape for each word. Your answers stay in this page.',
 init:()=>({phase:'idle',seed:41,t:0,q:0,ans:[],tok:0}),
 watch(p){if(p<.6)return {phase:'learn',seed:41,t:Math.min(11,Math.floor(p/.6*12)),q:0,ans:[],tok:0};const q=Math.min(6,Math.floor((p-.6)/.37*7));return {phase:q>=6?'done':'test',seed:41,t:12,q,ans:L5_XSIM.slice(0,q),tok:0}},
 ui:[{b:'Start',act:'start'},{b:'New words',act:'fresh'}],
 on:{start(s,a,ctx){s.phase='learn';s.t=0;s.q=0;s.ans=[];s.tok++;ctx.every(2800,'next',s.tok)},
  next(s,t){if(Number(t)!==s.tok||s.phase!=='learn')return 'stop';s.t++;if(s.t>=12){s.phase='test';return 'stop'}},
  fresh(s){s.tok++;s.seed=L5_nx(s.seed);s.phase='idle';s.t=0;s.q=0;s.ans=[]},
  choose(s,v){if(s.phase!=='test')return;const it=L5_xTest(s.seed)[s.q];s.ans.push(Number(v)===it.w?1:0);s.q++;if(s.q>=6)s.phase='done'}},
 draw(s,f,X){
  let out=heading('Which word names which shape?');
  if(s.phase==='idle'){out+=R(70,70,460,120,'#f7fafc',C.grid,10)+TF(300,104,'Twelve scenes: two words, two shapes, never lined up.',14,C.ink)+TF(300,128,'Watch them all (about 35 seconds), then name the shapes.',14,C.ink);out+=L5_shape(0,240,164,16)+L5_shape(3,360,164,16)}
  else if(s.phase==='learn'){const tr=L5_xTrials(s.seed)[Math.min(11,s.t)];
   out+=R(110,58,380,180,'#fff',C.blue,12);tr.w.forEach((w,i)=>out+=TB(220+i*160,96,L5_XWORDS[w],24,C.ink));tr.o.forEach((o,i)=>out+=L5_shape(o,220+i*160,176,40));
   out+=TF(300,260,`scene ${Math.min(12,s.t+1)} of 12`,13,C.muted);
  }else{
   if(s.phase==='test'){const it=L5_xTest(s.seed)[s.q];out+=TF(300,62,`Word ${s.q+1} of 6: which shape is “${L5_XWORDS[it.w]}”?`,15,C.ink);
    it.opts.forEach((o,i)=>out+=hit(X,'choose',o,`Shape ${i+1}`,R(70+i*120,80,100,90,'#fff',C.line,10)+L5_shape(o,120+i*120,125,32)))}
   else out+=TF(300,90,`Done: ${sum(s.ans)} of 6 right.`,16,C.ink)+TF(300,116,'No single scene told you; only the repeated pairings did.',13,C.muted);
   const n=s.ans.length,you=n?100*sum(s.ans)/n:null;
   out+=L5_hbars(30,200,330,[[X.try?'you':'simulated',you,C.coral],['chance',25,C.line],['adults, Yu & Smith',90,C.blue]],100,30,140);
   // Co-occurrence grid.
   const gx=410,gy=200,c=22;out+=TF(gx+66,gy-6,'times heard with each shape',13,C.muted);
   for(let w=0;w<6;w++){out+=TF(gx-6,gy+w*c+16,L5_XWORDS[w],13,C.ink,'end');for(let o=0;o<6;o++){const k=w===o?4:L5_XROUNDS.flat().some(p=>(p[0]===w&&p[1]===o)||(p[1]===w&&p[0]===o))?1:0;out+=R(gx+o*c,gy+w*c,c-2,c-2,k===4?C.green:k?C.pale:'#f7fafc','none',3)+TF(gx+o*c+(c-2)/2,gy+w*c+15,String(k),13,k===4?'#fff':C.muted)}}
  }
  return {svg:out,phase:s.phase==='done'?'Each word appeared four times, always with its own shape and each time with a different partner. Counting across scenes makes the right pair the only one that keeps recurring: the green diagonal.':s.phase==='learn'?'In each scene either word could name either shape. Keep watching: the answer is only in the repeats.':'Pick the shape that was there every time you saw the word.'};
 }});

const L5_CDI_AGE=[8,10,12,14,16,18,20,22,24,26,28,30];
const L5_CDI={10:[0,0,0,2,5,12,30,55,85,140,210,290],50:[0,1,4,12,40,75,140,220,300,390,470,540],90:[3,10,25,60,150,250,350,440,520,580,620,650]};
const L5_cdiAt=(pc,a)=>{const v=L5_CDI[pc];for(let i=0;i<L5_CDI_AGE.length-1;i++)if(a<=L5_CDI_AGE[i+1]){const u=(a-L5_CDI_AGE[i])/2;return lerp(v[i],v[i+1],u)}return v[v.length-1]};
SCENE({id:'word-learning-vocabulary',name:'How fast vocabulary grows',tag:'Huge differences, no single spurt',
 definition:'Parents’ checklists of the words their child says show vocabulary growing slowly at first and then much faster in the second half of the second year. The spread between children is enormous. A sudden “vocabulary spurt” is often described, but when individual children are tracked closely, only a minority show a sharp jump; most accelerate gradually.',
 example:'At two years old, the middle child says about 300 words, but one child in ten says fewer than about 90 and one in ten more than 500, and all of them can be developing normally.',
 research:'Fenson, L. et al. (1994). Variability in early communicative development. Monographs of the Society for Research in Child Development 59(5) (the MacArthur–Bates CDI norms; values here approximate); Ganger, J. & Brent, M. R. (2004). Reexamining the vocabulary spurt. Developmental Psychology 40, 621–632.',
 desc:'Curves of words spoken by age from 8 to 30 months for children at the 10th, 50th and 90th percentiles, with a marker at the chosen age and a readout of words and words per month.',
 dur:10,hint:'Move the age and choose a percentile. Notice how wide the band is, and how smooth the median curve looks.',
 init:()=>({age:24,pc:50}),
 watch(p){return {age:Math.round(8+p*22),pc:p<.33?50:p<.66?10:90}},
 ui:[{range:'age',label:'Age',min:8,max:30,get:s=>s.age,act:'age',show:v=>v+' months'},{choose:[[10,'10th percentile'],[50,'median'],[90,'90th percentile']],label:'Child',get:s=>s.pc,act:'pc'}],
 on:{age(s,v){s.age=Number(v)},pc(s,v){s.pc=Number(v)}},
 draw(s){
  let out=heading('Words a child says, by age (parents’ checklists)');
  const pl=L5_plot(80,60,320,240,[8,30],[0,700],[[8,'8'],[12,'12'],[18,'18'],[24,'24'],[30,'30 mo']],[[0,'0'],[200,'200'],[400,'400'],[600,'600']],'age in months','words spoken');out+=pl.svg;
  const band=[];for(let a=8;a<=30;a+=.5)band.push([pl.X(a),pl.Y(L5_cdiAt(90,a))]);for(let a=30;a>=8;a-=.5)band.push([pl.X(a),pl.Y(L5_cdiAt(10,a))]);
  out+=P('M'+band.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L')+'Z','none',0,C.pale);
  [10,50,90].forEach(pc=>{const pts=[];for(let a=8;a<=30;a+=.5)pts.push([pl.X(a),pl.Y(L5_cdiAt(pc,a))]);out+=L5_poly(pts,pc===s.pc?C.coral:C.blue,pc===s.pc?3.5:1.8)});
  out+=TF(pl.X(30)-4,pl.Y(L5_cdiAt(90,30))-8,'90th',13,C.muted,'end')+TF(pl.X(30)-4,pl.Y(L5_cdiAt(50,30))-8,'median',13,C.muted,'end')+TF(pl.X(30)-4,pl.Y(L5_cdiAt(10,30))-8,'10th',13,C.muted,'end');
  const w=L5_cdiAt(s.pc,s.age),rate=(L5_cdiAt(s.pc,Math.min(30,s.age+1))-L5_cdiAt(s.pc,Math.max(8,s.age-1)))/2;
  out+=Ci(pl.X(s.age),pl.Y(w),8,C.coral,'#fff');
  out+=counter(430,70,'words at '+s.age+' months',String(Math.round(w)),C.coral,150)+counter(430,130,'new words per month',String(Math.round(rate)),C.blue,150);
  out+=TF(505,206,'Most children speed up',13,C.muted)+TF(505,224,'gradually; only a',13,C.muted)+TF(505,242,'minority show a sudden',13,C.muted)+TF(505,260,'spurt (Ganger &',13,C.muted)+TF(505,278,'Brent 2004).',13,C.muted);
  out+=TF(300,350,'Values approximate, redrawn from the MacArthur–Bates CDI norms (Fenson et al. 1994)',13,C.muted);
  return {svg:out,phase:s.age<16?'Before about 16 months most children say only a handful of words, though they understand many more.':`At ${s.age} months a child at the ${s.pc===50?'median':s.pc+'th percentile'} says about ${Math.round(w)} words. The band from the 10th to the 90th percentile spans hundreds of words: wide variation is normal.`};
 }});

/* ======================= Lesson: critical-period ======================= */
const L5_JN=[['3–7',3,7,269.3,3],['8–10',8,10,256.0,6],['11–15',11,15,235.9,10],['17–39',17,39,210.3,22]];
const L5_JN_AGES=[[3,4,5,5,6,7,7],[8,8,9,9,9,10,10,10],[11,12,12,13,14,14,15,15],[17,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,38,39]];
const L5_JNPTS=(()=>{const r=rng(77),pts=[];L5_JN.forEach((g,i)=>L5_JN_AGES[i].forEach(a=>pts.push([a,clamp(g[3]+L5_gauss(r)*g[4],150,276)])));const nat=[];for(let i=0;i<23;i++)nat.push(clamp(268.8+L5_gauss(r)*2.9,260,276));return {pts,nat}})();
SCENE({id:'critical-period',name:'Age of arrival and grammar',tag:'Johnson & Newport 1989',
 definition:'Jacqueline Johnson and Elissa Newport tested 46 Chinese and Korean speakers who had moved to the United States at ages from 3 to 39, all with years of English. Their scores on a grammar test fell steadily with age of arrival up to puberty; after that, scores were lower and varied widely but no longer tracked age.',
 example:'People who arrived at 3–7 scored like native speakers; those who arrived at 17 or later averaged about 210 of 276, with some much better and some much worse.',
 research:'Johnson, J. S. & Newport, E. L. (1989). Critical period effects in second language learning. Cognitive Psychology 21, 60–99 (arrival before 15: r ≈ −.87; after 17: r ≈ −.16); Birdsong, D. & Molis, M. (2001). J. Memory and Language 44, 235–249 (a replication with Spanish speakers found decline continuing past puberty).',
 desc:'A scatter of grammar scores (out of 276) against age of arrival, with native speakers on the left and the published group means as bars; the slider highlights a group.',
 dur:10,hint:'Move the age of arrival to see the group it falls in. The dots are simulated around the published means; the means themselves are the study’s.',
 init:()=>({age:12}),
 watch(p){return {age:Math.round(3+p*36)}},
 ui:[{range:'age',label:'Age of arrival',min:3,max:39,get:s=>s.age,act:'age',show:v=>v+' years'}],
 on:{age(s,v){s.age=Number(v)}},
 draw(s){
  let out=heading('Grammar scores of immigrants, by age of arrival');
  const pl=L5_plot(110,60,440,230,[-4,40],[150,280],[[0,'native'],[5,'5'],[10,'10'],[15,'15'],[20,'20'],[30,'30'],[39,'39']],[[150,'150'],[200,'200'],[250,'250'],[276,'276']],'age of arrival in the US (years)','score (of 276)');out+=pl.svg;
  out+=R(pl.X(15.6),60,pl.X(16.6)-pl.X(15.6),230,C.amberp,'none',0)+TF(pl.X(16.1),78,'puberty',13,C.amber);
  const g=L5_JN.find(x=>s.age>=x[1]&&s.age<=x[2])||L5_JN[3];
  L5_JN.forEach(x=>{const on=x===g;out+=L(pl.X(x[1]-.4),pl.Y(x[3]),pl.X(x[2]+.4),pl.Y(x[3]),on?C.coral:C.blue,on?4:2.5)});
  out+=L(pl.X(-1.2),pl.Y(268.8),pl.X(1.2),pl.Y(268.8),C.green,3);
  L5_JNPTS.nat.forEach((v,i)=>out+=Ci(pl.X(-1+((i*7)%10)/5),pl.Y(v),3,C.green));
  L5_JNPTS.pts.forEach(([a,v])=>{const on=a>=g[1]&&a<=g[2];out+=Ci(pl.X(a),pl.Y(v),on?4.5:3.5,on?C.coral:'#fff',on?'#fff':C.blue)});
  out+=Ci(pl.X(s.age),pl.Y(g[3]),8,'none',C.coral);
  out+=TF(300,336,`Arrived at ${g[0]}: mean ${g[3]} of 276 (natives 268.8)`,15,C.ink);
  out+=TF(300,358,'Dots simulated around the published group means (Johnson & Newport 1989, Table 2)',13,C.muted);
  return {svg:out,phase:s.age<=7?'Children who arrived by about seven became indistinguishable from native speakers on this test.':s.age<=15?'Between 8 and 15, every extra year of age at arrival cost points; across all arrivals from 3 to 15 the link was close (r ≈ −0.87). Johnson and Newport read this as a maturational limit.':'After 17, scores were lower on average but spread widely and no longer tracked age (r ≈ −0.16). Later studies dispute whether the decline really stops: amount of input, schooling and motivation all differ with age.'};
 }});

const L5_HT={r:.2,c:17.4,k:8};
const L5_rate=age=>age<L5_HT.c?L5_HT.r:L5_HT.r*Math.exp(-(age-L5_HT.c)/L5_HT.k);
function L5_prof(a,y){let e=0;for(let t=0;t<y;t+=.25)e+=L5_rate(a+t+.125)*.25;return 1-Math.exp(-e)}
SCENE({id:'critical-period-hartshorne',name:'Two thirds of a million grammar quizzes',tag:'Hartshorne, Tenenbaum & Pinker 2018',
 definition:'Joshua Hartshorne, Josh Tenenbaum and Steven Pinker analysed an online English grammar quiz taken by about 670,000 people. Fitting a learning model, they estimated that the ability to learn grammar stays high until about 17.4 years and then declines. Because learning takes decades to level off, reaching native-like grammar seems to require starting by about age 10.',
 example:'Someone who starts English at 25 can keep improving for years, but in the model they level off below a native speaker however long they continue.',
 research:'Hartshorne, J. K., Tenenbaum, J. B. & Pinker, S. (2018). A critical period for second language acquisition: evidence from 2/3 million English speakers. Cognition 177, 263–277; van der Slik, F., Schepens, J., Bongaerts, T. & van Hout, R. (2022). Language Learning 72 (a re-analysis arguing for a steadier decline). The model here is illustrative, not their fitted one.',
 desc:'Two charts from a simple learning model: proficiency against years of exposure for a chosen starting age beside a native speaker, and proficiency after 30 years against starting age, with a native-like band; the 3D view shows the whole surface.',
 dur:12,hint:'Move the starting age and the years of exposure. The rate of learning is constant until 17.4 and then falls; see where native-like becomes out of reach.',
 init:()=>({a:20,y:20}),
 watch(p){return {a:Math.round(p*36),y:30}},
 ui:[{range:'a',label:'Starting age',min:0,max:40,get:s=>s.a,act:'a',show:v=>v+' years'},{range:'y',label:'Years of exposure',min:0,max:40,get:s=>s.y,act:'y',show:v=>v+' years'}],
 on:{a(s,v){s.a=Number(v)},y(s,v){s.y=Number(v)}},
 draw(s){
  let out=heading('When you start, and how long you keep going');
  const pa=L5_plot(70,60,220,210,[0,40],[0,1],[[0,'0'],[10,'10'],[20,'20'],[30,'30'],[40,'40']],[[0,'0'],[.5,'.5'],[1,'1']],'years of exposure','proficiency (model)');out+=pa.svg;
  const cur=(a,col,w,extra='')=>{const pts=[];for(let y=0;y<=40;y+=1)pts.push([pa.X(y),pa.Y(L5_prof(a,y))]);return L5_poly(pts,col,w,extra)};
  out+=cur(0,C.blue,2,'stroke-dasharray="6 4"')+cur(s.a,C.coral,3);
  const p=L5_prof(s.a,s.y);out+=Ci(pa.X(s.y),pa.Y(p),7,C.coral,'#fff')+TF(pa.X(40)-4,pa.Y(L5_prof(0,40))+18,'from birth',13,C.blue,'end');
  const pb=L5_plot(370,60,200,210,[0,40],[0,1],[[0,'0'],[10,'10'],[17.4,'17.4'],[30,'30'],[40,'40']],[[0,'0'],[.5,'.5'],[1,'1']],'starting age','after 30 years');out+=pb.svg;
  out+=R(370,pb.Y(1),200,pb.Y(.95)-pb.Y(1),C.greenp,'none',0)+TF(565,pb.Y(.95)+14,'native-like',13,C.green,'end');
  const pts=[];for(let a=0;a<=40;a+=.5)pts.push([pb.X(a),pb.Y(L5_prof(a,30))]);out+=L5_poly(pts,C.purple,2.5);
  out+=L(pb.X(17.4),60,pb.X(17.4),270,C.amber,1.5,'stroke-dasharray="4 4"')+Ci(pb.X(s.a),pb.Y(L5_prof(s.a,30)),7,C.coral,'#fff');
  out+=TF(300,326,`Start at ${s.a}, after ${s.y} years: ${Math.round(p*100)}% of the way to the ceiling`,15,C.ink);
  out+=TF(300,350,'Illustrative model: learning rate constant to 17.4, then falling (shape after Hartshorne et al. 2018)',13,C.muted);
  return {svg:out,phase:s.a<=10?'Starting before about 10 leaves enough high-rate years for proficiency to reach the native-like band within a few decades.':s.a<17.4?'Between 10 and 17 the learning rate is still high, but too few years remain before it falls to catch up fully.':'After 17.4 the rate keeps falling, so even decades of exposure level off below native-like. Critics argue the real decline may start earlier and be steadier.'};
 },
 three(s,f,X,project){
  const n=10,sc=4,faces=[],P=project([0,sc,0,sc,0,1.6]),z=(a,y)=>L5_prof(a,y)*1.4;
  for(let i=0;i<n;i++)for(let j=0;j<n;j++){const a0=i*40/n,a1=(i+1)*40/n,y0=j*40/n,y1=(j+1)*40/n,h=(z(a0,y0)+z(a1,y1))/2.8;
   faces.push({pts:[[a0/10,y0/10,z(a0,y0)],[a1/10,y0/10,z(a1,y0)],[a1/10,y1/10,z(a1,y1)],[a0/10,y1/10,z(a0,y1)]],fill:h>.9?C.green:h>.6?C.blue:C.purple,opacity:.55+.4*h,stroke:'#ffffff'})}
  let out=paintFaces(faces,P)+axes3(P,['starting age','years','proficiency'],[4.4,4.4,1.6]);
  out+=point3([s.a/10,s.y/10,z(s.a,s.y)],P,C.coral,8,'#fff');
  return {svg:out,title:'Proficiency over starting age and years of exposure',caption:`The surface climbs with years of exposure but its ceiling sinks for later starts. The dot marks starting at ${s.a} with ${s.y} years. Drag to turn it.`};
 }});

SCENE({id:'critical-period-sign',name:'Deaf signers and late first languages',tag:'Language early, of any kind',
 definition:'Many deaf children of hearing parents meet a sign language late. Elissa Newport and Rachel Mayberry compared deaf adults who had used American Sign Language for decades but first met it at different ages. Those exposed from birth controlled its grammar best, early learners next, late learners least. Mayberry found that what matters most is having any language early: people who learned ASL late as a second language did far better than those for whom ASL was a late first language.',
 example:'Two adults both started ASL at about ten. One had grown up speaking English and became deaf later; the other had no accessible language before ASL. Years later, the first signs much more like a native.',
 research:'Newport, E. L. (1990). Maturational constraints on language learning. Cognitive Science 14, 11–28; Mayberry, R. I. (1993). First-language acquisition after childhood differs from second-language acquisition. J. Speech and Hearing Research 36, 1258–1270; Curtiss, S. (1977). Genie (a single case with severe confounds). Bars here are illustrative of the order of results.',
 desc:'Bars for deaf adults grouped by when they first met ASL, or by whether ASL was their first or second language, with a card on the case of Genie and why single cases are weak evidence.',
 dur:12,hint:'Switch between the three views. The bars show the order of the published results, not their exact values.',
 init:()=>({v:'age'}),
 watch(p){return {v:p<.4?'age':p<.75?'first':'genie'}},
 ui:[{choose:[['age','When ASL began'],['first','First or second language'],['genie','The case of Genie']],label:'View',get:s=>s.v,act:'v'}],
 on:{v(s,v){s.v=v}},
 draw(s){
  let out=heading('Decades of signing, different starting points');
  const sign=(x,y,col)=>Ci(x,y,14,'#f6e3d3',C.ink)+P(`M${x-18} ${y+46}Q${x} ${y+12} ${x+18} ${y+46}Z`,col,2,tint(col,.7))+P(`M${x-14} ${y+26}L${x-30} ${y+8}M${x+14} ${y+26}L${x+30} ${y+6}`,C.ink,2.5);
  if(s.v==='age'){
   const rows=[['from birth (native)',95,C.green],['first met at 4–6',80,C.blue],['first met at 12 or later',62,C.coral]];
   rows.forEach((r,i)=>out+=sign(80,80+i*80,r[2]));
   rows.forEach((r,i)=>{const y=96+i*80;out+=TF(130,y,r[0],14,C.ink,'start')+R(130,y+10,360*r[1]/100,22,r[2],'none',4)});
   out+=TF(300,336,'Control of ASL verb morphology after 30+ years of daily use (illustrative order)',13,C.muted);
  }else if(s.v==='first'){
   const rows=[['native signers',95,C.green],['ASL late, as a second language (English first)',85,C.blue],['ASL late, as a first language (no early language)',55,C.coral]];
   rows.forEach((r,i)=>{const y=86+i*80;out+=sign(70,y-12,r[2])+TF(120,y,r[0],14,C.ink,'start')+R(120,y+10,400*r[1]/100,22,r[2],'none',4)});
   out+=TF(300,336,'Same age of first exposure to ASL; what differs is whether any language came early (illustrative order)',13,C.muted);
  }else{
   out+=R(60,64,480,250,'#f7fafc',C.grid,10)+TB(300,96,'Genie (found in 1970, aged 13)',17,C.ink);
   ['Isolated and abused through childhood, with almost no language.','Learned many words after rescue, but grammar stayed limited.','Often cited for a critical period, yet trauma, malnutrition and','possible disability make it impossible to isolate age alone.','Her care later raised serious ethical concerns about how she','was studied. One case cannot settle the question.'].forEach((l,i)=>out+=TF(300,130+i*26,l,14,C.ink));
   out+=TF(300,336,'Curtiss (1977); Rymer (1993). Group studies like Newport’s and Mayberry’s carry more weight.',13,C.muted);
  }
  return {svg:out,phase:s.v==='age'?'Even after thirty years of daily signing, people who met ASL later in childhood used its grammar less fully. Sign languages let researchers study age of first exposure in a way spoken languages rarely allow.':s.v==='first'?'Learning a first language late has lasting effects that learning a second language late does not: early access to some language builds the foundation for any later one. This is why early sign-language access for deaf children matters.':'Single, tragic cases are vivid but confounded. The careful evidence comes from groups of people who differ mainly in when they met a language.'};
 }});

/* ======================= Lesson: bilingualism ======================= */
const L5_PB=(seed,d)=>{const r=rng(seed),out=[];for(let i=0;i<60;i++){const n=20+Math.floor(r()*100),se=Math.sqrt(2/n),obs=d+L5_gauss(r)*se,sig=obs/se>1.96,pub=r()<(sig?.68:.29);out.push({n,se,obs,sig,pub})}return out};
SCENE({id:'bilingualism',name:'The bilingual advantage that shrank',tag:'Publication bias',
 definition:'Early studies suggested that juggling two languages trains executive control, giving bilinguals an edge on tasks like the flanker or Simon task. Larger studies and meta-analyses that correct for unpublished results find little or no such advantage in adults. Part of the original picture came from which results got published.',
 example:'Angela de Bruin and colleagues followed conference abstracts on the topic: about 68% of those fully supporting an advantage were later published, against about 29% of those challenging it.',
 research:'de Bruin, A., Treccani, B. & Della Sala, S. (2015). Cognitive advantage in bilingualism: an example of publication bias? Psychological Science 26, 99–107; Paap, K. R. & Greenberg, Z. I. (2013), Cognitive Psychology 66; Lehtonen, M. et al. (2018). Is bilingualism associated with enhanced executive functioning in adults? Psychological Bulletin 144, 394–425 (152 studies, no reliable advantage after correction).',
 desc:'A funnel plot of 60 simulated studies of a true effect you choose; studies that found a significant advantage are published more often, so the published average drifts above the truth. Bars give de Bruin and colleagues’ publication rates.',
 dur:12,hint:'Choose whether to see only published studies or all of them, and the size of the true effect. The studies are simulated; only the publication rates come from the paper.',
 init:()=>({show:'pub',d:0,seed:29}),
 watch(p){return {show:p<.5?'pub':'all',d:0,seed:29}},
 ui:[{choose:[['pub','Published only'],['all','All studies run']],label:'Show',get:s=>s.show,act:'show'},{choose:[[0,'No true effect'],[.2,'Small true effect']],label:'Truth',get:s=>s.d,act:'d'},{b:'Run 60 new studies',act:'fresh'}],
 on:{show(s,v){s.show=v},d(s,v){s.d=Number(v)},fresh(s){s.seed=L5_nx(s.seed)}},
 draw(s){
  const st=L5_PB(s.seed,s.d),vis=s.show==='pub'?st.filter(x=>x.pub):st;let out=heading('What the literature shows versus what was found');
  const pl=L5_plot(80,60,300,230,[-.8,.8],[2,8],[[-.8,'−0.8'],[-.4,'−0.4'],[0,'0'],[.4,'0.4'],[.8,'0.8']],[[2,'small'],[5,''],[8,'large']],'effect size: bilinguals minus monolinguals','study size');out+=pl.svg;
  const fp=[];for(let y=2;y<=8;y+=.5)fp.push([pl.X(1.96/y),pl.Y(y)]);out+=L5_poly(fp,C.amber,1.5,'stroke-dasharray="4 4"')+TF(pl.X(.62),pl.Y(7.5),'significant →',13,C.amber,'start');
  out+=L(pl.X(s.d),60,pl.X(s.d),290,C.green,2)+TF(pl.X(s.d)-4,74,'truth',13,C.green,'end');
  st.forEach(x=>{if(s.show==='pub'&&!x.pub)return;out+=Ci(pl.X(x.obs),pl.Y(1/x.se),4.5,x.pub?C.blue:'#fff',x.pub?'#fff':C.muted)});
  const m=L5_mean(vis.map(x=>x.obs)),mall=L5_mean(st.map(x=>x.obs));out+=L(pl.X(m),60,pl.X(m),290,C.coral,2.5)+TF(pl.X(m)+4,88,'average shown',13,C.coral,'start');
  out+=counter(410,64,s.show==='pub'?'published studies':'all studies',String(vis.length),C.blue,160)+counter(410,120,'average effect shown',m.toFixed(2),C.coral,160)+counter(410,176,'average of all run',mall.toFixed(2),C.green,160);
  out+=TF(490,246,'Abstracts later published',13,C.muted)+L5_hbars(380,254,210,[['supporting',68,C.blue],['challenging',29,C.coral]],100,26,90);
  out+=TF(300,344,'Simulated studies; publication rates from de Bruin et al. (2015)',13,C.muted);
  return {svg:out,phase:s.show==='pub'?`Looking only at published work, the average effect is ${m.toFixed(2)}, though the true effect is ${s.d}. Selective publication alone can manufacture an advantage.`:`All 60 studies together average ${mall.toFixed(2)}, close to the truth of ${s.d}. Hollow dots are the studies that stayed in the drawer.`};
 }});

function L5_flTrials(seed){const base=[];for(let i=0;i<20;i++)base.push({c:i%2===0,dir:i%4<2?'L':'R'});return shuffled(base,seed)}
const L5_flStr=t=>{const a=t.dir==='L'?'←':'→',b=t.dir==='L'?'→':'←',f=t.c?a:b;return [f,f,a,f,f].join(' ')};
const L5_FLSIM=(()=>{const r=rng(5),out=[];for(let i=0;i<20;i++){const c=i%2===0;out.push({c,rt:(c?450:505)+L5_gauss(r)*40,ok:true})}return out})();
SCENE({id:'bilingualism-flanker',name:'The flanker task',tag:'Be the participant',
 definition:'In the flanker task you report the direction of a central arrow while ignoring the arrows on either side. When the flankers point the other way, people are slower: the difference is the flanker effect, a measure of how well attention filters out distraction. It was one of the main tasks used to look for a bilingual advantage.',
 example:'Answering “left” to ← ← ← ← ← is quick; answering “left” to → → ← → → takes most adults a few tens of milliseconds longer.',
 research:'Eriksen, B. A. & Eriksen, C. W. (1974). Effects of noise letters upon the identification of a target letter in a nonsearch task. Perception & Psychophysics 16, 143–149; Paap & Greenberg (2013); Lehtonen et al. (2018). The flanker effect is very robust; group differences between bilinguals and monolinguals are not.',
 desc:'Twenty trials of five arrows; press Left or Right for the middle arrow. Bars show your mean times for matching and opposing flankers, and the difference is compared with a typical flanker effect.',
 dur:12,hint:'Press Start. Look at the cross, then answer Left or Right for the middle arrow, as fast as you can while staying accurate. Your times stay in this page.',
 init:()=>({phase:'idle',seed:61,t:0,t0:0,rts:[],tok:0}),
 watch(p){const t=Math.min(20,Math.floor(p*21));return {phase:t>=20?'done':'stim',seed:61,t,t0:0,rts:L5_FLSIM.slice(0,t),tok:0,sim:true}},
 ui:[{b:'Start',act:'start'},{b:'Clear',act:'clear'}],
 on:{start(s,a,ctx){s.phase='fix';s.t=0;s.rts=[];s.tok++;ctx.later(600,'show',s.tok)},
  show(s,t){if(Number(t)!==s.tok)return;s.phase='stim';s.t0=performance.now()},
  clear(s){s.tok++;s.phase='idle';s.t=0;s.rts=[]},
  resp(s,dir,ctx){if(s.phase!=='stim')return;const tr=L5_flTrials(s.seed)[s.t],rt=performance.now()-s.t0;s.rts.push({c:tr.c,rt,ok:dir===tr.dir});s.t++;
   if(s.t>=20){s.phase='done';return}s.phase='fix';ctx.later(500,'show',s.tok)}},
 draw(s,f,X){
  let out=heading('Which way does the middle arrow point?');
  out+=R(130,56,340,96,'#fff',C.grid,12);
  if(s.phase==='stim'&&s.t<20)out+=TB(300,118,L5_flStr(L5_flTrials(s.seed)[s.t]),38,C.ink);
  else if(s.phase==='fix')out+=TB(300,116,'+',34,C.muted);
  else if(s.phase==='idle')out+=TF(300,110,'Press Start',15,C.muted);
  else out+=TF(300,110,'Done',16,C.ink);
  out+=L5_key(X,'resp','L','Left',150,166,130,44,'← Left',false,C.blue,16)+L5_key(X,'resp','R','Right',320,166,130,44,'Right →',false,C.blue,16);
  out+=TF(300,232,`trial ${Math.min(20,s.t+(s.phase==='done'?0:1))} of 20${s.sim?' · simulated participant':''}`,13,C.muted);
  const good=s.rts.filter(r=>r.ok&&r.rt<2000),mc=L5_mean(good.filter(r=>r.c).map(r=>r.rt)),mi=L5_mean(good.filter(r=>!r.c).map(r=>r.rt)),has=good.some(r=>r.c)&&good.some(r=>!r.c);
  const pl=L5_plot(110,250,250,80,[0,1000],[0,2],[[0,'0'],[500,'500'],[1000,'1000 ms']],[],null,null);out+=pl.svg;
  out+=TF(104,280,'matching',13,C.ink,'end')+TF(104,314,'opposing',13,C.ink,'end');
  if(has){out+=R(110,264,250*mc/1000,20,C.blue,'none',4)+R(110,298,250*mi/1000,20,C.coral,'none',4)}
  const fx=has?Math.round(mi-mc):null;
  out+=counter(400,252,'your flanker effect',fx===null?'—':fx+' ms',C.coral,170)+TF(485,322,'typical: tens of ms',13,C.muted)+TF(485,340,'bilingual edge: ≈ 0',13,C.muted);
  out+=TF(300,370,`errors: ${s.rts.filter(r=>!r.ok).length}`,13,C.muted);
  return {svg:out,phase:fx!==null&&s.phase==='done'?`Opposing flankers cost you ${fx} ms. Almost everyone shows this effect; what large studies do not find is a reliable difference in its size between bilinguals and monolinguals.`:'Keep your eyes on the centre. The flankers are irrelevant, but your brain processes them anyway.'};
 }});

// Code-switching and the equivalence constraint (Poplack 1980). es[c] translates en[c]; esOrd lists the concepts in Spanish order.
const L5_CS=[
 {name:'Same word order',en:['The','house','is','very','big'],es:['La','casa','es','muy','grande'],esOrd:[0,1,2,3,4]},
 {name:'Adjective position differs',en:['She','has','a','white','house'],es:['Ella','tiene','una','blanca','casa'],esOrd:[0,1,2,4,3]},
 {name:'Object pronoun position differs',en:['I','told','him','that'],es:['Yo','dije','le','eso'],esOrd:[0,2,1,3]}];
function L5_csMix(sen,k,startEs){const n=sen.en.length,enOrd=range(n),ord1=startEs?sen.esOrd:enOrd,ord2=startEs?enOrd:sen.esOrd,first=ord1.slice(0,k),rest=ord2.filter(c=>!first.includes(c));
 const ok=new Set(enOrd.slice(0,k)).size===first.length&&enOrd.slice(0,k).every(c=>sen.esOrd.slice(0,k).includes(c));
 return {words:first.map(c=>({w:(startEs?sen.es:sen.en)[c],es:startEs})).concat(rest.map(c=>({w:(startEs?sen.en:sen.es)[c],es:!startEs}))),ok}}
SCENE({id:'bilingualism-code-switching',name:'Switching languages mid-sentence',tag:'Code-switching has rules',
 definition:'Many bilinguals switch languages within a sentence. Far from random, these switches follow patterns. Shana Poplack, studying Spanish–English speakers in New York, found that switches tend to happen where the word orders of the two languages line up, so that neither language’s grammar is broken: the equivalence constraint. Other language pairs show exceptions, and rival accounts exist.',
 example:'“She has a white casa” sounds odd to many Spanish–English bilinguals, because English puts the adjective first and Spanish puts it after: the switch falls where the two orders disagree.',
 research:'Poplack, S. (1980). Sometimes I’ll start a sentence in Spanish y termino en español: toward a typology of code-switching. Linguistics 18, 581–618; Myers-Scotton, C. (1993). Duelling Languages. Oxford University Press (the Matrix Language Frame model); Marian, V. & Spivey, M. (2003), Bilingualism: Language and Cognition 6 (both languages stay active).',
 desc:'An English sentence and its Spanish translation word by word; choose where to switch and which language to start in, and the mixed sentence is shown with a verdict from the equivalence constraint.',
 dur:12,hint:'Choose a sentence, the switch point and the starting language. Switches at points where both orders agree are predicted to sound natural; this is a tendency, not a law.',
 init:()=>({i:1,k:4,es:0}),
 watch(p){const i=p<.33?0:p<.7?1:2,n=L5_CS[i].en.length;return {i,k:1+Math.floor(((p*3)%1)*(n-1)),es:0}},
 ui:[{choose:L5_CS.map((c,i)=>[i,c.name]),label:'Sentence',get:s=>s.i,act:'i'},{range:'k',label:'Switch after word',min:1,max:4,get:s=>s.k,act:'k'},{choose:[[0,'Start in English'],[1,'Start in Spanish']],label:'Start',get:s=>s.es,act:'es'}],
 on:{i(s,v){s.i=Number(v);s.k=Math.min(s.k,L5_CS[s.i].en.length-1)},k(s,v){s.k=Math.min(Number(v),L5_CS[s.i].en.length-1)},es(s,v){s.es=Number(v)}},
 draw(s){
  const sen=L5_CS[s.i],k=Math.min(s.k,sen.en.length-1),mx=L5_csMix(sen,k,!!s.es);let out=heading('Where can a sentence change language?');
  const n=sen.en.length,cw=96,x0=300-n*cw/2;
  out+=TF(x0-10,86,'English',13,C.blue,'end')+TF(x0-10,154,'Spanish',13,C.coral,'end');
  sen.en.forEach((w,c)=>{out+=R(x0+c*cw+4,64,cw-8,32,C.pale,C.blue,6)+TF(x0+c*cw+cw/2,85,w,14,C.ink)});
  sen.esOrd.forEach((c,j)=>{out+=R(x0+j*cw+4,132,cw-8,32,C.coralp,C.coral,6)+TF(x0+j*cw+cw/2,153,sen.es[c],14,C.ink);out+=L(x0+c*cw+cw/2,96,x0+j*cw+cw/2,132,c===j?C.line:C.amber,c===j?1.5:2.5)});
  // Mixed sentence.
  out+=TF(300,200,'mixed sentence',13,C.muted);let x=300-mx.words.length*cw/2;
  mx.words.forEach((o,j)=>{out+=R(x+j*cw+4,210,cw-8,34,o.es?C.coralp:C.pale,o.es?C.coral:C.blue,6)+TF(x+j*cw+cw/2,232,o.w,14,C.ink);if(j===k-1)out+=L(x+(j+1)*cw,204,x+(j+1)*cw,250,C.ink,2.5)});
  out+=TF(300,282,mx.ok?'Switch at a point where both word orders agree: predicted to sound natural':'Switch where the orders disagree: one language’s grammar is broken, predicted to be avoided',14,mx.ok?C.green:C.coral);
  out+=TF(300,312,'Amber links: words whose position differs between the two languages',13,C.muted);
  out+=TF(300,348,'After Poplack (1980). A strong tendency in her data; other language pairs show exceptions.',13,C.muted);
  return {svg:out,phase:mx.ok?'At this point the two sentences have used the same set of words, so continuing in the other language keeps every local word order legal in both.':'Here the two languages have placed different words first. Switching now forces an order that one of the languages does not allow, and fluent bilinguals tend to avoid it.'};
 }});

/* ======================= Lesson: reading-brain ======================= */
const L5_LIT=[['Unschooled, cannot read',.15,1,.8],['Learned to read as an adult',.6,.85,.9],['Schooled, fluent reader',1,.7,1]];
SCENE({id:'reading-brain',name:'The brain’s letterbox',tag:'Neuronal recycling',
 definition:'Writing is too recent for evolution to have built a reading area. Yet in fluent readers of every script, a patch of the left ventral occipito-temporal cortex responds strongly to written words: the visual word form area. Stanislas Dehaene and Laurent Cohen propose that reading recycles a region that evolved for recognising objects and faces, which then shifts partly to the right hemisphere.',
 example:'In adults in Portugal and Brazil, the left-hemisphere response to written sentences grew with reading skill, whether people had learned in childhood or as adults, while the response to faces in that spot shrank a little.',
 research:'Dehaene, S. et al. (2010). How learning to read changes the cortical networks for vision and language. Science 330, 1359–1364 (63 adults from unschooled to highly literate); Dehaene, S. & Cohen, L. (2011). The unique role of the visual word form area in reading. Trends in Cognitive Sciences 15, 254–262. Robust; bar heights here are illustrative.',
 desc:'A side view of the brain with the visual word form area marked, and bars for its response to written words and to faces, and for the right-hemisphere face response, at three levels of literacy.',
 dur:10,hint:'Choose a reader. Watch the word response grow in the left “letterbox” and the face response shift towards the right hemisphere.',
 init:()=>({lv:2}),
 watch(p){return {lv:Math.min(2,Math.floor(p*3))}},
 ui:[{choose:L5_LIT.map((l,i)=>[i,l[0].split(',')[0]]),label:'Reader',get:s=>s.lv,act:'lv'}],
 on:{lv(s,v){s.lv=Number(v)}},
 draw(s){
  const lv=L5_LIT[s.lv];let out=heading('Learning to read reshapes the visual brain');
  out+=P('M60 200C50 120 120 70 200 74C270 78 320 110 330 170C336 214 310 246 270 252C240 256 220 270 190 268C150 266 140 248 110 246C80 244 64 230 60 200Z',C.ink,2,'#f3ece6');
  out+=P('M150 120C170 110 190 116 200 130M120 170C150 160 180 170 210 160M230 110C250 130 260 150 290 160',C.line,1.5);
  out+=P('M200 268C210 290 220 300 236 304',C.ink,2);
  out+=Ci(250,236,10+lv[1]*16,C.coral,'none','opacity="'+fmt(.35+.6*lv[1])+'"')+TF(250,286,'visual word form area',13,C.coral)+TF(196,52,'left hemisphere, from the side',13,C.muted);
  const bx=380,rows=[['words, left',lv[1],C.coral],['faces, left',lv[2],C.blue],['faces, right',lv[3],C.purple]];
  rows.forEach((r,i)=>{const y=86+i*58;out+=TF(bx,y,r[0],14,C.ink,'start')+R(bx,y+8,190,22,'#f1f5f7','none',4)+R(bx,y+8,190*r[1],22,r[2],'none',4)});
  out+=TF(475,264,'response strength (illustrative)',13,C.muted);
  out+=TF(300,320,lv[0],16,C.ink)+TF(300,346,'After Dehaene et al. (2010): the same pattern in readers of other scripts',13,C.muted);
  return {svg:out,phase:s.lv===0?'Without reading, this patch responds mainly to faces and objects. Written words are just shapes.':s.lv===1?'Adults who learned to read late show the same word response, smaller but real: the region can still be recycled after childhood.':'In fluent readers the patch answers written words within about a fifth of a second, in any familiar script, while face responses lean more to the right hemisphere.'};
 }});

const L5_SPAN_TXT='The eyes jump along a line and pause for a quarter second';
const L5_spanRate=w=>Math.min(100,30+70*(1-Math.exp(-(w-1)/4.2)))*(w>=15?1:.99);
SCENE({id:'reading-brain-span',name:'How much do you see at once?',tag:'The moving window',
 definition:'In reading, the eyes do not glide: they jump (saccades) about 7–9 letters at a time and pause (fixations) for about a quarter of a second. George McConkie and Keith Rayner replaced letters outside a window around the fixation, changing the display with every eye movement. Reading was normal only when the window reached about 14–15 letters to the right of fixation but just 3–4 to the left.',
 example:'With a window of only a few letters, readers slow down sharply even though they cannot say what is wrong; at about 15 letters to the right, they read as fast as with no window at all.',
 research:'McConkie, G. W. & Rayner, K. (1975). The span of the effective stimulus during a fixation in reading. Perception & Psychophysics 17, 578–586; Rayner, K. (1998). Eye movements in reading and information processing: 20 years of research. Psychological Bulletin 124, 372–422; Pollatsek et al. (1981), Brain and Language 14 (the span reverses for Hebrew readers).',
 desc:'A sentence with letters outside a window around the fixation point replaced by x, as in the moving-window experiments, and a curve of reading speed against window size.',
 dur:10,hint:'Move the fixation along the sentence and change how many letters are visible to the right. Spaces stay visible, as in some of the original conditions. The speed curve is an illustrative shape.',
 init:()=>({fx:12,w:6}),
 watch(p){return {fx:Math.round(4+p*48),w:p<.5?4:15}},
 ui:[{range:'fx',label:'Fixation at letter',min:0,max:L5_SPAN_TXT.length-1,get:s=>s.fx,act:'fx'},{range:'w',label:'Letters visible to the right',min:1,max:20,get:s=>s.w,act:'w'}],
 on:{fx(s,v){s.fx=Number(v)},w(s,v){s.w=Number(v)}},
 draw(s){
  const txt=L5_SPAN_TXT,lo=s.fx-4,hi=s.fx+s.w;let out=heading('A window that follows your eyes');
  const shown=txt.split('').map((ch,i)=>ch===' '||(i>=lo&&i<=hi)?ch:'x').join('');
  const cw=9.6,x0=300-txt.length*cw/2;
  out+=R(x0+Math.max(0,lo)*cw-3,64,(Math.min(txt.length-1,hi)-Math.max(0,lo)+1)*cw+6,36,C.pale,'none',4);
  shown.split('').forEach((ch,i)=>out+=TMF(x0+i*cw+cw/2,88,ch,16,i>=lo&&i<=hi?C.ink:C.line));
  out+=P(`M${fmt(x0+s.fx*cw+cw/2)} 108L${fmt(x0+s.fx*cw+cw/2-6)} 120L${fmt(x0+s.fx*cw+cw/2+6)} 120Z`,C.coral,1,C.coral)+TF(x0+s.fx*cw+cw/2,138,'fixation',13,C.coral);
  out+=TF(300,166,'4 letters visible to the left, '+s.w+' to the right',13,C.muted);
  const pl=L5_plot(90,190,280,120,[1,20],[0,100],[[1,'1'],[5,'5'],[10,'10'],[15,'15'],[20,'20']],[[0,'0%'],[50,'50%'],[100,'100%']],'letters visible to the right of fixation','reading speed');out+=pl.svg;
  const pts=[];for(let w=1;w<=20;w+=.5)pts.push([pl.X(w),pl.Y(L5_spanRate(w))]);out+=L5_poly(pts,C.blue,2.5)+Ci(pl.X(s.w),pl.Y(L5_spanRate(s.w)),7,C.coral,'#fff');
  out+=L(pl.X(14.5),190,pl.X(14.5),310,C.green,1.5,'stroke-dasharray="4 4"');
  out+=TF(400,206,'Typical skilled reading',13,C.ink,'start')+TF(400,228,'fixation ≈ 200–250 ms',13,C.muted,'start')+TF(400,248,'saccade ≈ 7–9 letters',13,C.muted,'start')+TF(400,268,'10–15% jumps go back',13,C.muted,'start')+TF(400,288,'(Rayner 1998)',13,C.muted,'start');
  return {svg:out,phase:s.w<8?'With a narrow window the next word is unreadable before the eyes reach it, so readers lose the preview that normally speeds them up.':s.w<14?'Most of the benefit is already there: the next word or two is visible, at least its first letters and length.':'At about 15 letters to the right, reading is as fast as with no window. The span is lopsided because attention runs ahead in the reading direction; it flips for right-to-left scripts.'};
 }});

const L5_SEY=[['Finnish',98],['Greek',98],['German',98],['Italian',95],['Spanish',95],['Swedish',95],['Dutch',95],['French',79],['Portuguese',73],['Danish',71],['English',34]];
const L5_SEYNOTE={Finnish:'Each letter stands for one sound, almost without exception.',Greek:'Spelling to sound is highly regular for reading.',German:'Regular from spelling to sound, though less so from sound to spelling.',Italian:'Very consistent letter–sound rules.',Spanish:'Very consistent letter–sound rules.',Swedish:'Fairly consistent spelling.',Dutch:'Fairly consistent spelling.',French:'Regular for reading, but many silent letters.',Portuguese:'Vowel spellings vary with stress and context.',Danish:'Spelling and pronunciation have drifted far apart.',English:'Inconsistent: compare “though”, “through”, “tough” and “cough”.'};
SCENE({id:'reading-brain-orthography',name:'Spelling consistency and learning to read',tag:'Orthographic depth',
 definition:'Some writing systems map letters to sounds very consistently (shallow orthographies); others, like English, are full of exceptions (deep orthographies). Philip Seymour and colleagues tested children across Europe near the end of their first school year: children learning consistent spellings read almost all familiar words correctly, while English-speaking children lagged far behind.',
 example:'Finnish first-graders read nearly every familiar word correctly. Scottish children learning English, though they had started school younger, read only about a third.',
 research:'Seymour, P. H. K., Aro, M. & Erskine, J. M. (2003). Foundation literacy acquisition in European orthographies. British Journal of Psychology 94, 143–174 (values here approximate); Spencer, L. H. & Hanley, J. R. (2003), British Journal of Psychology 94 (Welsh against English learners in the same Welsh schools); Ziegler & Goswami (2005), Psychological Bulletin 131.',
 desc:'Bars for the share of familiar words read correctly near the end of the first school year in eleven European languages; press a language for a note on its spelling.',
 dur:10,hint:'Press a language to read why its spelling is easy or hard. Age at school entry differs, but comparisons of children in the same schools find the same pattern.',
 init:()=>({sel:'English'}),
 watch(p){return {sel:L5_SEY[Math.min(10,Math.floor(p*11))][0]}},
 ui:[{choose:[['English','English'],['Danish','Danish'],['French','French'],['Finnish','Finnish']],label:'Language',get:s=>s.sel,act:'sel'}],
 on:{sel(s,v){s.sel=v}},
 draw(s,f,X){
  let out=heading('Familiar words read correctly, end of first school year');
  const x0=150,w=360;out+=L(x0+w*.5,54,x0+w*.5,330,'#eef3f6',1)+TF(x0+w*.5,346,'50%',13,C.muted)+TF(x0+w,346,'100%',13,C.muted)+TF(x0,346,'0',13,C.muted);
  L5_SEY.forEach(([lg,v],i)=>{const y=56+i*25,on=lg===s.sel;out+=hit(X,'sel',lg,`${lg}: ${v}%`,TF(x0-8,y+15,lg,13,on?C.coral:C.ink,'end')+R(x0,y+3,w*v/100,18,on?C.coral:v<80?C.amber:C.blue,'none',4)+TF(x0+w*v/100+6,y+16,v+'%',13,C.ink,'start'))});
  out+=TF(300,370,`${s.sel}: ${L5_SEYNOTE[s.sel]}`,14,C.ink);
  return {svg:out,phase:s.sel==='English'?'English-speaking children need two to three times as long to reach the reading accuracy that Finnish children have after one year. The spelling system, not the children, explains most of the gap.':`${s.sel} children read ${L5_SEY.find(x=>x[0]===s.sel)[1]}% of familiar words correctly. ${L5_SEYNOTE[s.sel]}`};
 }});

const L5_DYS=[
 {c:'Dyslexic children see letters backwards.',v:0,e:'Reversals like b/d are common in all beginning readers. The core difficulty is usually with the sounds of language (Vellutino et al. 2004).'},
 {c:'Difficulty linking letters to sounds is central.',v:1,e:'Most dyslexic readers struggle to split words into sounds and map them to letters (Snowling 2000; Ramus et al. 2003).'},
 {c:'Coloured overlays or lenses fix reading.',v:0,e:'A systematic review found no good evidence that they help (Griffiths et al. 2016).'},
 {c:'Special “dyslexia fonts” improve reading.',v:0,e:'Controlled tests found no benefit over ordinary fonts (Kuster et al. 2018).'},
 {c:'Phonics with sound-awareness training helps.',v:1,e:'Systematic phonics instruction helps struggling readers, especially early (National Reading Panel 2000; Ehri et al. 2001).'},
 {c:'Dyslexia is all-or-none, like a broken part.',v:0,e:'Reading skill varies continuously; dyslexia is the low end, so prevalence depends on the cut-off (Shaywitz et al. 1992).'}];
SCENE({id:'reading-brain-dyslexia',name:'Dyslexia without the myths',tag:'Sort claim from evidence',
 definition:'Developmental dyslexia is a persistent difficulty in learning to read accurately and fluently despite adequate teaching and intelligence. Research points mostly to difficulties with the sound structure of language. Several popular claims about dyslexia and its treatment are not supported by evidence.',
 example:'A child who reads “dog” as “bog” is not seeing the page in a mirror; beginning readers of every kind confuse b and d.',
 research:'Vellutino, F. R. et al. (2004). Specific reading disability (dyslexia): what have we learned in the past four decades? J. Child Psychology and Psychiatry 45, 2–40; Shaywitz, S. E. et al. (1992). New England J. Medicine 326, 145–150; Griffiths, P. G. et al. (2016), Ophthalmic & Physiological Optics 36; Kuster, S. M. et al. (2018), Annals of Dyslexia 68.',
 desc:'Six cards with claims about dyslexia; mark each as supported or a myth, then read the evidence behind it, with a running score.',
 dur:12,hint:'For each card press ✓ if you think the evidence supports it, or ✗ if it is a myth. The evidence appears once you answer.',
 init:()=>({ans:{},sel:0}),
 watch(p){const k=Math.min(6,Math.floor(p*7)),ans={};for(let i=0;i<k;i++)ans[i]=L5_DYS[i].v;return {ans,sel:Math.max(0,k-1)}},
 ui:[],
 on:{mark(s,v){const [i,a]=String(v).split(':').map(Number);s.ans={...s.ans,[i]:a};s.sel=i},reset(s){s.ans={};s.sel=0}},
 draw(s,f,X){
  let out=heading('Supported, or a myth?');
  L5_DYS.forEach((d,i)=>{const col=i%2,row=Math.floor(i/2),x=30+col*280,y=52+row*82,a=s.ans[i],done=a!==undefined,right=done&&a===d.v;
   out+=R(x,y,260,72,done?(right?C.greenp:C.coralp):'#fff',done?(right?C.green:C.coral):C.line,10);
   const words=d.c.split(' ');let l1='',l2='';words.forEach(w=>{if((l1+' '+w).length<=34&&!l2)l1=(l1?l1+' ':'')+w;else l2=(l2?l2+' ':'')+w});
   out+=TF(x+12,y+24,l1,13,C.ink,'start')+TF(x+12,y+42,l2,13,C.ink,'start');
   if(done)out+=TBF(x+12,y+62,d.v?'Supported':'Myth',13,d.v?C.green:C.coral,'start');
   out+=hit(X,'mark',i+':1',`Card ${i+1}: supported`,R(x+176,y+46,36,22,'#fff',C.line,6)+TBF(x+194,y+62,'✓',14,C.green))+hit(X,'mark',i+':0',`Card ${i+1}: myth`,R(x+218,y+46,36,22,'#fff',C.line,6)+TBF(x+236,y+62,'✗',14,C.coral));
  });
  const n=Object.keys(s.ans).length,score=Object.entries(s.ans).filter(([i,a])=>L5_DYS[i].v===a).length,d=L5_DYS[s.sel];
  out+=TF(300,312,s.ans[s.sel]!==undefined?d.e:(X.try?'Mark a card to see its evidence.':''),13,C.ink);
  out+=TF(300,348,`${score} of ${n} right so far`,14,C.muted);
  return {svg:out,phase:n===6?`You got ${score} of 6. The well-supported picture is unglamorous: dyslexia is mostly about the sounds of language, and structured teaching of letters and sounds is what helps.`:'Popular remedies often target vision, but the strongest evidence points to the sound structure of language.'};
 }});
