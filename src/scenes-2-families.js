/* ===========================================================================
 Language era 2 · Families and sound laws (1786–1900). Helpers are prefixed L2_.
 =========================================================================== */
const L2_FONT='font-family="Noto Sans, Segoe UI Symbol, DejaVu Sans, sans-serif"';
const L2_T=(x,y,s,size=16,fill=C.ink,anchor='middle',extra='')=>T(x,y,s,size,fill,anchor,L2_FONT+' '+extra);
const L2_TB=(x,y,s,size=16,fill=C.ink,anchor='middle',extra='')=>L2_T(x,y,s,size,fill,anchor,'font-weight="700" '+extra);
const L2_TF=unscaled(L2_T),L2_TBF=unscaled(L2_TB);
function L2_wrap(s,n){const out=[];let line='';for(const w of String(s).split(' ')){if(line&&(line+' '+w).length>n){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out}
function L2_lines(x,y,lines,size=13,fill=C.ink,anchor='start',lh=17){return lines.map((s,i)=>L2_TF(x,y+i*lh,s,size,fill,anchor)).join('')}
// A word with one highlighted segment: parts = [before, segment, after].
function L2_seg(x,y,parts,size,hi,col=C.coral,anchor='middle'){const z=textSize(size,parts.join(''),x,anchor);
 return `<text x="${fmt(x)}" y="${fmt(y)}" font-size="${z}" fill="${C.ink}" text-anchor="${anchor}" ${L2_FONT}>${esc(parts[0])}<tspan fill="${hi?col:C.ink}" font-weight="${hi?700:400}">${esc(parts[1])}</tspan>${esc(parts[2])}</text>`}
function L2_chip(X,act,arg,label,x,y,w,on,aria,col=C.blue){return hit(X,act,arg,aria||label,R(x,y,w,30,on?col:'#fff',on?col:C.line,8)+L2_TF(x+w/2,y+20,label,14,on?'#fff':C.ink))}

/* ---- Sound: a small source–filter vowel synthesiser (approximate, adult male values). ---- */
const L2_F={i:[280,2250,2900],y:[280,1850,2400],ɨ:[320,1450,2400],u:[310,800,2300],ɪ:[390,1990,2550],ʊ:[440,1020,2300],e:[400,2100,2700],ø:[420,1600,2350],o:[420,800,2400],ə:[500,1450,2500],ɛ:[580,1850,2600],ɔ:[580,880,2500],æ:[680,1700,2500],a:[780,1350,2500],ɑ:[730,1100,2450]};
function L2_gain(f,F){return F.reduce((g,[Fc,B])=>g/Math.sqrt(Math.pow(1-(f*f)/(Fc*Fc),2)+Math.pow(f*B/(Fc*Fc),2)),1)}
function L2_amps(f0,F){const FB=[[F[0],80],[F[1],100],[F[2],140]],n=Math.min(40,Math.floor(4200/f0)),a=range(n).map(k=>L2_gain(f0*(k+1),FB)/Math.pow(k+1,1.6)),m=Math.max(...a);return a.map(v=>v/m)}
function L2_vowel(sym,o={}){const F=L2_F[sym];if(!F)return;const f0=o.f0||120,k=o.k||1;AUDIO.tone(f0,{partials:L2_amps(f0,F.map(v=>v*k)),dur:o.dur||.7,gain:o.gain||.16,at:o.at||0,attack:.04,release:.1})}
// Say a vowel or diphthong written in IPA, such as 'iː' or 'aɪ'. Called only from on() handlers.
function L2_say(ipa,at=0,o={}){const v=[...String(ipa).replace(/ː/g,'')].filter(ch=>L2_F[ch]);if(!v.length)return;const long=String(ipa).includes('ː');
 if(v.length===1)L2_vowel(v[0],{...o,at,dur:long?.75:.5});else{L2_vowel(v[0],{...o,at,dur:.36});L2_vowel(v[1],{...o,at:at+.3,dur:.42})}}
// A pitch glide on the vowel [a], for tones. pts: [[fraction of duration, Hz]].
function L2_glide(pts,dur=.6,at=0){const c=AUDIO.get();if(!c)return;try{const t0=c.currentTime+.02+at,osc=c.createOscillator(),g=c.createGain(),amps=L2_amps(140,L2_F.a),re=new Float32Array(amps.length+1),im=new Float32Array(amps.length+1);amps.forEach((a,i)=>im[i+1]=a);
 osc.setPeriodicWave(c.createPeriodicWave(re,im));osc.frequency.setValueAtTime(pts[0][1],t0);for(const [u,hz] of pts.slice(1))osc.frequency.linearRampToValueAtTime(hz,t0+u*dur);
 g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(.15,t0+.03);g.gain.setValueAtTime(.15,t0+dur-.08);g.gain.linearRampToValueAtTime(0,t0+dur);osc.connect(g);g.connect(AUDIO.master);osc.start(t0);osc.stop(t0+dur+.03);AUDIO.nodes.add(osc);osc.onended=()=>AUDIO.nodes.delete(osc)}catch(_){}}

/* ===================== Lesson: language-families ===================== */
const L2_LANGS=[['Sanskrit',1],['Ancient Greek',1],['Latin',1],['Old English',1],['Old Irish',1],['Finnish',0],['Hungarian',0],['Basque',0],['Arabic',0]];
const L2_WORDS={
 three:{forms:['tráyas','treîs','trēs','þrēo','trí','kolme','három','hiru','thalātha'],note:'Four of the five Indo-European words begin with t followed by r. English þ (th) is the regular partner of t elsewhere, as Grimm’s law will show.'},
 two:{forms:['dvā́','dýo','duo','twā','dá','kaksi','kettő','bi','ithnān'],note:'d in Sanskrit, Greek, Latin and Irish matches t in English. The same d : t match appears in decem/ten and dentem/tooth.'},
 brother:{forms:['bhrā́tar-','phrā́tēr','frāter','brōþor','bráthair','veli','fivér','anaia','akh'],note:'bh in Sanskrit, ph in Greek, f in Latin and b in English and Irish: one ancestral sound with regular outcomes. (In Greek the word came to mean a clan member.)'},
 mother:{forms:['mātár-','mḗtēr','māter','mōdor','máthair','äiti','anya','ama','umm'],note:'m and t (English d) line up across all five. Short words like ama and umm look alike in many unrelated families: they are “nursery” words.'},
 father:{forms:['pitár-','patḗr','pater','fæder','athair','isä','apa','aita','ab'],note:'p in Sanskrit, Greek and Latin, f in English, and nothing in Irish. Irish lost p in other words too, as in iasc “fish” beside Latin piscis.'}};
SCENE({id:'language-families',name:'Jones and the family resemblance',tag:'Sanskrit, Greek and Latin share a parent',
 definition:'A language family is a group of languages that descend from one ancestor. In 1786 William Jones argued that Sanskrit, Greek and Latin share so much, in roots and in grammar, that they must have “sprung from some common source, which, perhaps, no longer exists”.',
 example:'Sanskrit bhrātar-, Latin frāter and English brother are the same word, changed in regular ways over thousands of years. Finnish veli and Basque anaia are not related to it.',
 desc:'A table of five basic words in five Indo-European languages and four unrelated languages, with a note on the sounds that match.',
 research:'Jones, W. (1786, printed 1788). The Third Anniversary Discourse, on the Hindus. Asiatick Researches 1. Earlier observers of the resemblance include Filippo Sassetti (1585) and Gaston-Laurent Coeurdoux (1767).',
 dur:12,hint:'Choose a word and compare the languages. Then add the unrelated languages and look for the difference.',
 init:()=>({w:'brother',other:'yes'}),
 watch(p){const keys=['three','two','brother','mother','father'];return {w:keys[Math.min(4,Math.floor(p*5))],other:p>.4?'yes':'no'}},
 ui:[{choose:[['three','three'],['two','two'],['brother','brother'],['mother','mother'],['father','father']],label:'Word',get:s=>s.w,act:'w'},{choose:[['no','Indo-European only'],['yes','Add unrelated languages']],label:'Show',get:s=>s.other,act:'other'}],
 on:{w(s,v){s.w=v;return 'keep'},other(s,v){s.other=v;return 'keep'}},
 draw(s){
  const W=L2_WORDS[s.w],show=s.other==='yes';let out=heading(`“${s.w}” in ${show?'nine':'five'} languages`);
  out+=R(24,48,334,show?306:170,'#fff',C.grid,10);
  out+=TF(40,68,'language',12,C.muted,'start')+TF(176,68,'word',12,C.muted,'start');
  L2_LANGS.forEach(([name,ie],i)=>{if(!ie&&!show)return;const y=94+i*30+(ie?0:16);
   if(i===5)out+=L(36,y-26,346,y-26,C.grid,1.5)+TF(346,y-31,'not Indo-European',12,C.muted,'end');
   out+=TF(40,y,name,14,ie?C.ink:C.muted,'start')+L2_TBF(176,y,W.forms[i],18,ie?C.blue:C.muted,'start')});
  const lines=L2_wrap(W.note,27);out+=R(374,48,206,40+lines.length*18,C.pale,'none',10)+TBF(388,70,'What lines up',14,C.ink,'start')+L2_lines(388,92,lines,13,C.ink);
  if(show)out+=R(374,250,206,104,C.coralp,'none',10)+L2_lines(388,272,L2_wrap('Finnish, Hungarian, Basque and Arabic share no such pattern with them, word after word.',27),13,C.ink);
  return {svg:out,phase:show?`The Indo-European words match sound for sound in a regular way; the unrelated languages do not. One shared word proves nothing. A pattern that repeats across hundreds of basic words is what made Jones’s guess convincing.`:W.note};
 }});

const L2_PAIRS=[
 ['English much','Spanish mucho','chance','Unrelated. Much comes from Old English mycel; mucho comes from Latin multum. They converged by chance.'],
 ['English head','Latin caput','cognate','Related. Both go back to one root: Grimm’s law turns k into h and p into f or v (Old English hēafod).'],
 ['English have','Latin habēre','chance','A famous false cognate. Have matches Latin capere “take” (k → h, p → f or v), not habēre.'],
 ['English two','Latin duo','cognate','Related. Latin d regularly matches English t: duo/two, decem/ten, dentem/tooth.'],
 ['English bad','Persian bad','chance','Unrelated. Same sound and meaning, but no regular correspondences link them.'],
 ['English fish','Latin piscis','cognate','Related. Latin p matches English f (pater/father, pēs/foot), and Latin sk matches English sh.'],
 ['Mbabaram dog','English dog','chance','Unrelated. In this Australian language dog really does mean “dog”: a pure coincidence.'],
 ['English day','Latin diēs','chance','Unrelated, though they look alike. Latin d should give English t (duo/two); day comes from another root.']];
const L2_LOOK=['cognate','chance','cognate','cognate','cognate','chance','cognate','cognate']; // what “looks alike” would answer
SCENE({id:'language-families-chance',name:'Cognate or coincidence?',tag:'Why looks are a poor guide',
 definition:'Cognates are words inherited from a common ancestor. They are recognised by regular sound correspondences that recur across many words, not by looking alike: look-alikes are often chance, and real cognates often look different.',
 example:'English have looks like Latin habēre but is not related to it. Its real partner is Latin capere “take”, just as English head matches Latin caput.',
 desc:'One word pair at a time. You judge cognate or chance, then see the explanation and your score beside two strategies: “looks alike” and “regular correspondences”.',
 research:'Ringe, D. (1992). On calculating the factor of chance in language comparison. Transactions of the American Philosophical Society 82(1). · Campbell, L. (2013). Historical Linguistics: An Introduction, 3rd ed. · Dixon, R. M. W. (1991), on Mbabaram dog.',
 dur:12,hint:'Judge each pair: inherited from a common ancestor, or a chance look-alike? Your answers stay on this page.',
 init:()=>({seed:3,i:0,ans:[]}),
 watch(p){const n=Math.min(8,Math.floor(p*9)),ord=shuffled(range(8),3);return {seed:3,i:n,ans:ord.slice(0,n).map(k=>L2_LOOK[k]),sim:true}},
 ui:[{b:'Related (cognate)',act:'ans',arg:'cognate'},{b:'Chance look-alike',act:'ans',arg:'chance'},{b:'New order',act:'shuffle'}],
 on:{ans(s,v){if(s.i>=8)return 'keep';s.ans.push(v);s.i++;return 'keep'},shuffle(s){s.seed=nextSeed();s.i=0;s.ans=[];return 'keep'}},
 draw(s){
  const ord=shuffled(range(8),s.seed);let out=heading(s.sim?'A simulated learner who trusts looks':'Cognate or coincidence?');
  ord.forEach((k,j)=>{const done=j<s.i,ok=done&&s.ans[j]===L2_PAIRS[k][2];out+=Ci(216+j*24,58,8,done?(ok?C.green:C.coral):'#fff',done?'none':C.line)});
  if(s.i<8){const [a,b]=L2_PAIRS[ord[s.i]];out+=R(40,78,520,62,C.pale,'none',10)+L2_TB(170,117,a,20,C.blue)+TB(300,117,'?',20,C.muted)+L2_TB(430,117,b,20,C.purple);}
  else out+=R(40,78,520,62,C.greenp,'none',10)+TB(300,116,'All eight pairs judged',18,C.green);
  if(s.i>0){const j=s.i-1,k=ord[j],[a,b,kind,why]=L2_PAIRS[k],ok=s.ans[j]===kind;
   out+=R(40,152,520,102,'#fff',ok?C.green:C.coral,10)+TBF(56,176,`${a} · ${b}: ${kind==='cognate'?'cognates':'chance'}`,14,ok?C.green:C.coral,'start')+TF(544,176,ok?'✓ you were right':'✗ not this time',13,ok?C.green:C.coral,'end');
   out+=L2_lines(56,200,L2_wrap(why,70),13,C.ink,'start',18)}
  const n=s.i,you=range(n).filter(j=>s.ans[j]===L2_PAIRS[ord[j]][2]).length,look=range(n).filter(j=>L2_LOOK[ord[j]]===L2_PAIRS[ord[j]][2]).length;
  const rows=[[s.sim?'Simulated learner':'You',you,C.blue],['“Looks alike” rule',look,C.coral],['Regular correspondences',n,C.green]];
  rows.forEach(([lab,v,col],r)=>{const y=284+r*26;out+=TF(196,y+5,lab,13,C.ink,'end')+R(208,y-8,300,16,'#eef3f6','none',4)+(n?R(208,y-8,300*v/8,16,col,'none',4):'')+TF(516,y+5,`${v} of ${n}`,13,C.muted,'start')});
  return {svg:out,phase:n<8?'Judge whether each pair was inherited from a common ancestor or only looks alike by chance.':`Out of eight: ${s.sim?'the simulated learner':'you'} ${you}, “looks alike” ${look}, regular correspondences 8. Resemblance misleads both ways; only correspondences that repeat across many words separate cognates from chance.`};
 }});

const L2_FAMS=[['Niger–Congo',1540,700,'Swahili, Yoruba, Igbo, Zulu'],['Austronesian',1270,390,'Malay, Tagalog, Malagasy, Māori'],['Trans–New Guinea',480,3.6,'Enga, Melpa, Ekari'],['Sino-Tibetan',460,1400,'Mandarin, Cantonese, Burmese, Tibetan'],['Indo-European',450,3300,'Hindi, Spanish, English, Russian, Persian'],['Afro-Asiatic',380,500,'Arabic, Hausa, Amharic, Hebrew, Somali'],['Dravidian',85,250,'Tamil, Telugu, Kannada, Malayalam'],['Turkic',40,200,'Turkish, Uzbek, Kazakh, Uyghur']];
SCENE({id:'language-families-map',name:'The world’s families',tag:'Many languages or many speakers',
 definition:'The world’s roughly 7,000 languages fall into well over a hundred families, plus isolates such as Basque, Burushaski and Ainu that have no known relatives. Counting languages and counting speakers give very different pictures.',
 example:'Trans–New Guinea has hundreds of languages but only a few million speakers; Indo-European has about 450 languages and roughly 3 billion speakers.',
 desc:'Horizontal bars for eight large families, sorted by number of languages or by number of speakers, with example languages for the one you press.',
 research:'Eberhard, Simons & Fennig (eds.), Ethnologue: Languages of the World. · Hammarström, Forkel, Haspelmath & Bank, Glottolog. Figures here are rounded and approximate; counts depend on how languages and dialects are divided.',
 dur:10,hint:'Sort by languages or by speakers, and press a family to see some of its languages.',
 init:()=>({by:'langs',sel:4}),
 watch(p){return {by:p<.5?'langs':'speakers',sel:[0,1,4,3][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:[['langs','By number of languages'],['speakers','By number of speakers']],label:'Sort',get:s=>s.by,act:'by'}],
 on:{by(s,v){s.by=v;return 'keep'},fam(s,v){s.sel=Number(v);return 'keep'}},
 draw(s,f,X){
  const k=s.by==='langs'?1:2,ord=range(8).sort((a,b)=>L2_FAMS[b][k]-L2_FAMS[a][k]),max=Math.max(...L2_FAMS.map(r=>r[k]));
  let out=heading(s.by==='langs'?'Languages per family (approximate)':'First-language speakers, millions (approximate)');
  ord.forEach((i,r)=>{const y=66+r*31,F=L2_FAMS[i],on=i===s.sel,w=Math.max(2,330*F[k]/max);
   out+=hit(X,'fam',i,`${F[0]}: about ${F[1]} languages and ${F[2]} million speakers`,R(24,y-6,560,28,on?C.pale:'#fff','none',6)+TF(36,y+13,F[0],14,on?C.ink:C.muted,'start')+R(176,y,w,16,on?C.blue:C.line,'none',4)+TF(184+w,y+13,s.by==='langs'?`${F[1].toLocaleString('en-GB')}`:`${F[2]>=10?Math.round(F[2]).toLocaleString('en-GB'):F[2]}`,13,C.ink,'start'))});
  const F=L2_FAMS[s.sel];out+=R(24,322,560,44,C.pale,'none',8)+TBF(36,341,F[0],14,C.ink,'start')+TF(36,358,'e.g. '+F[3],13,C.ink,'start');
  return {svg:out,phase:`${F[0]}: about ${F[1].toLocaleString('en-GB')} languages and ${F[2]>=10?Math.round(F[2]).toLocaleString('en-GB'):F[2]} million first-language speakers. ${s.by==='langs'?'Diversity is greatest where many small communities have lived apart for a long time, as in New Guinea and West Africa.':'A few families spread with farming, empires and migration, so a handful of languages now have most of the speakers.'}`};
 }});

/* ===================== Lesson: comparative-method ===================== */
const L2_ROM={
 eight:{it:['o','tt','o'],es:['o','ch','o'],pt:['o','it','o'],fr:['hu','it',''],proto:'*okto',lat:'octō'},
 night:{it:['no','tt','e'],es:['no','ch','e'],pt:['no','it','e'],fr:['nu','it',''],proto:'*nokte',lat:'noctem'},
 milk:{it:['la','tt','e'],es:['le','ch','e'],pt:['le','it','e'],fr:['la','it',''],proto:'*lakte',lat:'lactem'},
 made:{it:['fa','tt','o'],es:['he','ch','o'],pt:['fe','it','o'],fr:['fa','it',''],proto:'*fakto',lat:'factum'}};
const L2_RL=[['it','Italian'],['es','Spanish'],['pt','Portuguese'],['fr','French']];
const L2_CMSTEPS=['Line up the words for one meaning in four related languages.','Find the parts that differ: Italian tt, Spanish ch, Portuguese and French it.','The same set recurs in other words. A correspondence set, not a one-off.','Ask which single older sound could become all of these by common changes.','Reconstruct the ancestor. The asterisk marks a form nobody wrote down.','Check: written Latin confirms the reconstruction.'];
SCENE({id:'comparative-method',name:'Rebuilding a lost word',tag:'The comparative method',
 definition:'The comparative method reconstructs an ancestor language from its descendants. Line up related words, find sets of sounds that correspond again and again, and work out the older sound that could have produced each set by changes known to be common.',
 example:'Italian otto, Spanish ocho, Portuguese oito and French huit all mean “eight”. The set tt : ch : it : it recurs in night and milk, and points back to an older kt: Latin octō.',
 desc:'Four Romance words for one meaning, the corresponding segments highlighted, the same set in other words, the reconstructed form, and a check against written Latin.',
 research:'Campbell, L. (2013). Historical Linguistics: An Introduction, 3rd ed., ch. 5. · Meillet, A. (1925). La méthode comparative en linguistique historique. Romance is the classic test case because Latin is written down.',
 dur:12,hint:'Choose a word, then step through the method and compare the reconstruction with Latin.',
 init:()=>({w:'eight'}),
 trace(){return L2_CMSTEPS.map((say,k)=>({k,say}))},
 ui:[{choose:[['eight','eight'],['night','night'],['milk','milk'],['made','made / done']],label:'Word',get:s=>s.w,act:'w'}],
 on:{w(s,v){s.w=v}},
 draw(s,f){
  const k=f?f.k:0,W=L2_ROM[s.w];let out=heading(`“${s.w==='made'?'made, done':s.w}” in four Romance languages`);
  L2_RL.forEach(([c,name],j)=>{const x=90+j*140;out+=TF(x,62,name,13,C.muted)+L2_seg(x,100,W[c],26,k>=1)});
  if(k>=2){const others=Object.keys(L2_ROM).filter(w=>w!==s.w);others.forEach((w,r)=>{const y=140+r*28;out+=TF(18,y,w,13,C.muted,'start');L2_RL.forEach(([c],j)=>{out+=L2_seg(90+j*140,y,L2_ROM[w][c],17,true)})})}
  if(k>=3)out+=R(40,218,520,62,C.pale,'none',10)+TBF(56,240,'Set:  tt : ch : it : it   ←   *kt',15,C.ink,'start')+L2_lines(56,262,['kt → tt (k becomes t: Italian) · kt → it (k weakens to i: Portuguese, French) · kt → it → ch (Spanish)'],12.5,C.ink);
  if(k>=4)out+=TF(150,314,'Reconstruction',13,C.muted)+L2_TB(150,344,W.proto,24,C.purple);
  if(k>=5)out+=TF(440,314,'Written Latin',13,C.muted)+L2_TB(440,344,W.lat+'  ✓',24,C.green);
  if(k>=4)out+=arrow(232,336,352,336,C.line,2);
  const extra=s.w==='made'?' Spanish hecho also shows f → h at the start, a second regular change.':'';
  return {svg:out,phase:(f?f.say:L2_CMSTEPS[0])+(k>=5?extra:'')};
 }});

const L2_SETS=[
 {name:'“hundred”',cells:[['Italian','cento','tʃ'],['Spanish','ciento','θ or s'],['French','cent','s'],['Sardinian','kentu','k']],opts:['tʃ','θ','s','k'],ans:'k',naive:'s',why:'k often shifts to tʃ or s before i and e (palatalisation); the reverse is rare. Sardinian kept the old k, and Latin centum had it too.'},
 {name:'“son”',cells:[['Italian','figlio','f'],['Spanish','hijo','silent h'],['Portuguese','filho','f'],['French','fils','f']],opts:['f','h','nothing'],ans:'f',naive:'f',why:'f → h → nothing is a known change, which happened in Spanish; h → f would be unusual. Latin filius confirms f.'},
 {name:'“life”',cells:[['Italian','vita','t'],['Spanish','vida','d (said ð)'],['Portuguese','vida','d'],['French','vie','nothing']],opts:['t','d','nothing'],ans:'t',naive:'d',why:'Between vowels t softens to d, then ð, then disappears (lenition). The chain runs one way, so the strongest sound, t, is oldest. Latin vita.'}];
SCENE({id:'comparative-method-choose',name:'Which sound came first?',tag:'Direction matters',
 definition:'When cognates disagree, the oldest sound is not simply the most common one. Linguists prefer the sound from which every attested sound can be reached by changes that happen often in the world’s languages.',
 example:'Italian cento, Spanish ciento, French cent and Sardinian kentu begin with four different sounds. Only k explains them all, because k → tʃ → s is common and the reverse is not.',
 desc:'Three correspondence sets from Romance. You pick the ancestral sound; the feedback explains the direction of change, and your score sits beside a “majority vote” strategy.',
 research:'Campbell, L. (2013). Historical Linguistics, ch. 5 (directionality). · Hock, H. H. & Joseph, B. D. (2009). Language History, Language Change and Language Relationship, 2nd ed.',
 dur:12,hint:'Press the sound you think was the ancestor, then go to the next set. Your answers stay on this page.',
 init:()=>({i:0,picks:[]}),
 watch(p){const i=Math.min(2,Math.floor(p*3));return {i,picks:L2_SETS.slice(0,i+1).map(z=>z.naive),sim:true}},
 ui:[{b:'Next set',act:'next'},{b:'Start again',act:'again'}],
 on:{pick(s,v){if(s.picks.length>s.i)return 'keep';s.picks.push(v);return 'keep'},next(s){if(s.picks.length>s.i&&s.i<2)s.i++;return 'keep'},again(s){s.i=0;s.picks=[];return 'keep'}},
 draw(s,f,X){
  const S=L2_SETS[s.i],picked=s.picks[s.i];let out=heading(`Set ${s.i+1} of 3: ${S.name}${s.sim?' · simulated majority-vote learner':''}`);
  S.cells.forEach(([lang,word,snd],j)=>{const x=84+j*144;out+=R(x-64,48,128,82,C.pale,'none',10)+TF(x,68,lang,13,C.muted)+L2_TB(x,96,word,20,C.ink)+L2_TF(x,120,`[${snd}]`,14,C.purple)});
  out+=TF(300,158,'Which sound was the ancestor?',14,C.ink);
  S.opts.forEach((o,j)=>{const x=300+(j-(S.opts.length-1)/2)*96,on=picked===o,right=picked&&o===S.ans;const inner=Ci(x,196,26,on?(right?C.green:C.coral):(right?C.greenp:'#fff'),right?C.green:C.line)+L2_TB(x,203,o==='nothing'?'∅':o,o.length>2?14:20,on?'#fff':C.ink);out+=picked?inner:hit(X,'pick',o,`Choose ${o}`,inner)});
  if(picked){const ok=picked===S.ans;out+=R(40,236,520,74,ok?C.greenp:C.coralp,'none',10)+TBF(56,256,ok?'Yes.':`Not quite: the ancestor was ${S.ans}.`,14,ok?C.green:C.coral,'start')+L2_lines(56,276,L2_wrap(S.why,74),13,C.ink,'start',17)}
  const done=s.picks.length,you=s.picks.filter((p,j)=>p===L2_SETS[j].ans).length,maj=L2_SETS.slice(0,done).filter(z=>z.naive===z.ans).length;
  out+=TF(300,340,`${s.sim?'Simulated learner':'You'}: ${you} of ${done}   ·   majority vote: ${maj} of ${done}   ·   direction of change: ${done} of ${done}`,13,C.muted);
  return {svg:out,phase:picked?(s.i<2?'Press Next set to continue.':`Finished: ${you} of 3. Voting for the most common sound fails twice here; asking which changes are natural succeeds every time.`):'Press the sound you think every language started from.'};
 }});

const L2_PIE={
 father:{pie:'*ph₂tḗr',d:[['Sanskrit','pitā́','h₂ → i'],['Greek','patḗr','h₂ → a'],['Latin','pater','h₂ → a'],['Gothic','fadar','p → f, t → d'],['Old Irish','athair','p lost']]},
 mother:{pie:'*méh₂tēr',d:[['Sanskrit','mātā́','eh₂ → ā'],['Greek','mḗtēr','eh₂ → ē'],['Latin','māter','eh₂ → ā'],['Old English','mōdor','t → d'],['Old Irish','máthair','t → th']]},
 brother:{pie:'*bʰréh₂tēr',d:[['Sanskrit','bhrā́tā','bʰ kept'],['Greek','phrā́tēr','bʰ → ph'],['Latin','frāter','bʰ → f'],['Gothic','brōþar','bʰ → b, t → þ'],['Old Irish','bráthair','bʰ → b']]},
 two:{pie:'*dwóh₁',d:[['Sanskrit','dvā́','w → v'],['Greek','dýo','w → u'],['Latin','duo','w → u'],['Gothic','twai','d → t'],['Old Irish','dá','w lost']]},
 three:{pie:'*tréyes',d:[['Sanskrit','tráyas','e → a'],['Greek','treîs','eye → ei'],['Latin','trēs','eye → ē'],['Gothic','þreis','t → þ'],['Old Irish','trí','eye → í']]}};
SCENE({id:'comparative-method-pie',name:'Proto-Indo-European',tag:'A language nobody wrote down',
 definition:'Applying the comparative method to the whole family gives Proto-Indo-European, spoken perhaps 6,000 years ago (estimates run from about 5,500 to 9,500). Its words are written with an asterisk because they are reconstructed, not attested. Some reconstructions were later confirmed by newly found languages.',
 example:'In 1879 the young Saussure argued from vowel patterns that the parent language had sounds lost in every known daughter. Hittite, deciphered in 1915–17, turned out to write one of them as ḫ, as in ḫant- “front” beside Latin ante.',
 desc:'A reconstructed root with its five descendants and the change that produced each; or the story of the laryngeal sounds confirmed by Hittite.',
 research:'Saussure, F. de (1879). Mémoire sur le système primitif des voyelles dans les langues indo-européennes. · Hrozný, B. (1915). Die Lösung des hethitischen Problems. · Kuryłowicz, J. (1927). ə indoeuropéen et ḫ hittite. · Fortson, B. W. (2010). Indo-European Language and Culture, 2nd ed.',
 dur:12,hint:'Choose a word to see its reconstructed ancestor and the changes in each branch, or switch to the Hittite evidence.',
 init:()=>({w:'father',view:'tree'}),
 watch(p){const keys=['father','mother','brother','two','three'];return p<.8?{w:keys[Math.min(4,Math.floor(p/.8*5))],view:'tree'}:{w:'father',view:'hittite'}},
 ui:[{choose:[['father','father'],['mother','mother'],['brother','brother'],['two','two'],['three','three']],label:'Word',get:s=>s.w,act:'w'},{choose:[['tree','Descendants'],['hittite','Hittite evidence']],label:'View',get:s=>s.view,act:'view'}],
 on:{w(s,v){s.w=v;s.view='tree';return 'keep'},view(s,v){s.view=v;return 'keep'}},
 draw(s){
  let out='';
  if(s.view==='tree'){const W=L2_PIE[s.w];out+=heading(`Proto-Indo-European “${s.w}”`);
   out+=R(220,48,160,52,C.purple,'none',10)+L2_TB(300,82,W.pie,22,'#fff');
   W.d.forEach(([lang,form,note],j)=>{const x=64+j*118;out+=L(300,100,x,196,C.line,2)+R(x-54,196,108,92,'#fff',C.grid,10)+TF(x,216,lang,12,C.muted)+L2_TBF(x,244,form,17,C.blue);L2_wrap(note,14).forEach((ln,r)=>{out+=L2_TF(x,266+r*15,ln,12,C.coral)})});
   out+=TF(300,322,'h₁, h₂, h₃ are “laryngeals”: lost sounds whose traces colour nearby vowels.',13,C.muted)+TF(300,342,'Forms are standard textbook reconstructions; accents simplified.',13,C.muted);
   return {svg:out,phase:`One reconstructed form explains all five descendants, each by changes that recur across that branch’s vocabulary. Gothic and Old English show the Germanic consonant shift, which the next lesson takes apart.`};}
  out+=heading('A prediction confirmed: the laryngeals');
  const steps=[['1879','Saussure','From vowel patterns alone, he infers lost sounds in the parent language.'],['1915–17','Hrozný','Deciphers Hittite, an Indo-European language from Anatolia written in cuneiform.'],['1927','Kuryłowicz','Shows Hittite writes ḫ where Saussure’s lost sound should be.']];
  steps.forEach(([yr,who,txt],j)=>{const x=24+j*192;out+=R(x,52,180,128,j===2?C.greenp:C.pale,'none',10)+TBF(x+12,74,yr,15,C.purple,'start')+TBF(x+12,94,who,14,C.ink,'start')+L2_lines(x+12,116,L2_wrap(txt,24),13,C.ink);if(j<2)out+=arrow(x+182,116,x+192,116,C.line,2,6)});
  const ex=[['PIE','*h₂énti'],['Hittite','ḫant-'],['Greek','antí'],['Latin','ante'],['Sanskrit','ánti']];
  ex.forEach(([l,w],j)=>{const x=68+j*116;out+=TF(x,218,l,13,C.muted)+L2_TB(x,248,w,j<2?21:19,j===1?C.coral:(j===0?C.purple:C.blue))});
  out+=TF(300,286,'“in front, facing”: only Hittite keeps a consonant where the others begin with a vowel',13,C.ink)+TF(300,316,'A reconstruction made before the evidence existed, then confirmed by it.',14,C.green,'middle','font-weight="650"');
  return {svg:out,phase:'Saussure’s “coefficients” were a guess about sounds no known language had. When Hittite was deciphered, it wrote ḫ in just the places his theory required. Reconstructions are hypotheses that can be tested.'};
 }});

/* ===================== Lesson: grimms-law ===================== */
const L2_GRID=[['p → f','t → θ','k → h'],['b → p','d → t','g → k'],['bʰ → b','dʰ → d','gʰ → g']];
const L2_GRW={
 foot:{src:'Latin pēs, ped-',en:'foot',ch:[['p','f',0,0],['d','t',1,1]]},
 fish:{src:'Latin piscis',en:'fish',ch:[['p','f',0,0]]},
 three:{src:'Latin trēs',en:'three',ch:[['t','th [θ]',0,1]]},
 horn:{src:'Latin cornū',en:'horn',ch:[['c [k]','h',0,2]]},
 heart:{src:'Latin cor, cord-',en:'heart',ch:[['c [k]','h',0,2],['d','t',1,1]]},
 two:{src:'Latin duo',en:'two',ch:[['d','t',1,1]]},
 knee:{src:'Latin genū',en:'knee',ch:[['g','k',1,2]]},
 brother:{src:'Sanskrit bhrātar-',en:'brother',ch:[['bh','b',2,0],['t','th',0,1]]},
 mead:{src:'Sanskrit madhu',en:'mead',ch:[['dh','d',2,1]]},
 guest:{src:'Latin hostis (h < gʰ)',en:'guest',ch:[['gʰ','g',2,2]]}};
SCENE({id:'grimms-law',name:'Grimm’s law',tag:'Nine consonants move together',
 definition:'Grimm’s law describes a shift in the consonants of early Germanic. Voiceless stops became fricatives, voiced stops lost their voice, and breathy-voiced stops became plain voiced stops. Latin, Greek and Sanskrit did not take part, so their words largely keep the older sounds (Sanskrit most faithfully).',
 example:'Latin pēs and English foot: p became f and d became t. Latin cornū and English horn: k became h.',
 desc:'A word in Latin or Sanskrit, its English cognate, the consonants that changed, and a 3 × 3 chart of the nine shifts with the active one lit.',
 research:'Grimm, J. (1822). Deutsche Grammatik, 2nd ed., vol. 1. Rasmus Rask described the correspondences in 1818 (Undersøgelse om det gamle Nordiske eller Islandske Sprogs Oprindelse).',
 dur:12,hint:'Choose a word and step through its consonants. Watch which cell of the chart each change belongs to.',
 init:()=>({w:'foot'}),
 trace(s){const W=L2_GRW[s.w],fr=[{k:-1,say:`${W.src}: the older consonants, as Latin and Sanskrit kept them.`}];W.ch.forEach(([a,b],k)=>fr.push({k,say:`${a} becomes ${b}.`}));fr.push({k:W.ch.length,done:true,say:`The result is English ${W.en}. Every word with these sounds shifted the same way.`});return fr},
 ui:[{choose:Object.keys(L2_GRW).map(k=>[k,k]),label:'English word',get:s=>s.w,act:'w'}],
 on:{w(s,v){s.w=v}},
 draw(s,f){
  const W=L2_GRW[s.w],k=f?f.k:-1,done=f&&f.done;let out=heading('Grimm’s law: the first Germanic consonant shift');
  out+=TF(150,64,W.src.split(' ')[0],13,C.muted)+L2_TB(150,98,W.src.split(' ').slice(1).join(' '),24,C.blue)+arrow(262,90,338,90,C.line,2.5)+TF(450,64,'English',13,C.muted)+L2_TB(450,98,done?W.en:'?',26,done?C.green:C.muted);
  W.ch.forEach(([a,b],j)=>{const on=j<=k,cur=j===k;out+=R(150+j*160-0,118,140,30,cur?C.coralp:(on?C.pale:'#fff'),cur?C.coral:C.grid,8)+L2_TF(220+j*160,138,`${a} → ${on?b:'…'}`,14,on?C.ink:C.muted)});
  const rows=['voiceless → fricative','voiced → voiceless','breathy → voiced'],cols=['lips','teeth','back'];
  cols.forEach((c,j)=>{out+=TF(226+j*110,182,c,13,C.muted)});
  L2_GRID.forEach((row,r)=>{out+=TF(164,214+r*48,rows[r],13,C.ink,'end');row.forEach((cell,j)=>{const act=W.ch.some((c,i)=>i<=k&&c[2]===r&&c[3]===j),cur=W.ch[k]&&W.ch[k][2]===r&&W.ch[k][3]===j;out+=R(176+j*110,192+r*48,100,36,cur?C.coral:(act?C.pale:'#fff'),cur?C.coral:C.grid,8)+L2_TF(226+j*110,215+r*48,cell,15,cur?'#fff':C.ink)})});
  return {svg:out,phase:f?f.say:'Step through the consonants.'};
 }});

const L2_GQ=[
 ['pedem','foot',['foot','pod','pad'],'p → f and d → t give foot.'],
 ['canem','dog',['hound','can','cat'],'k → h gives hound (Old English hund).'],
 ['tenuis','thin',['thin','tense','tiny'],'t → θ gives thin.'],
 ['dentem','tooth',['tooth','dent','dense'],'d → t and t → θ give tooth.'],
 ['ager','field',['acre','anger','eager'],'g → k gives acre (Old English æcer).'],
 ['quod','which, that',['what','quote','cod'],'kʷ → hw gives what (Old English hwæt).'],
 ['tū','you',['thou','to','two'],'t → θ gives thou.'],
 ['cornū','horn',['horn','corn','crown'],'k → h gives horn. Corn is related to Latin grānum instead.']];
SCENE({id:'grimms-law-quiz',name:'Apply the law',tag:'Predict the English word',
 definition:'A sound law lets you predict. Take a Latin word, apply Grimm’s law to its consonants, and you can pick out the English cognate, even when a look-alike English word is on offer.',
 example:'Latin canem “dog” predicts an English word beginning with h, not c: hound. English can and cat only look similar.',
 desc:'Eight Latin words in turn. You pick the English cognate from three options; distractors are look-alikes. Your score is shown beside the score of always choosing the closest look-alike.',
 research:'Grimm, J. (1822). Deutsche Grammatik. · Ringe, D. (2006). From Proto-Indo-European to Proto-Germanic. Oxford University Press.',
 dur:12,hint:'Use the chart: p → f, t → θ, k → h, d → t, g → k. Pick the English cognate. Your answers stay on this page.',
 init:()=>({seed:5,i:0,ans:[]}),
 watch(p){const n=Math.min(8,Math.floor(p*9));return {seed:5,i:n,ans:range(n).map(j=>L2_GQ[j][2][0]),sim:true}},
 ui:[{b:'New order',act:'again'}],
 on:{pick(s,v){if(s.i>=8)return 'keep';s.ans.push(v);s.i++;return 'keep'},again(s){s.seed=nextSeed();s.i=0;s.ans=[];return 'keep'}},
 draw(s,f,X){
  let out=heading(s.sim?'A simulated learner applying the law':'Find the English cognate');
  out+=R(24,46,552,30,C.pale,'none',8)+L2_TF(300,66,'p → f   t → θ   k → h   ·   b → p   d → t   g → k   ·   kʷ → hw',14,C.ink);
  range(8).forEach(j=>{const done=j<s.i,ok=done&&s.ans[j]===L2_GQ[j][2][0];out+=Ci(216+j*24,96,8,done?(ok?C.green:C.coral):'#fff',done?'none':C.line)});
  if(s.i<8){const [lat,gl,opts]=L2_GQ[s.i],ord=shuffled(opts,s.seed+s.i);out+=TF(300,130,`Latin, meaning “${gl}”`,13,C.muted)+L2_TB(300,164,lat,28,C.blue);
   ord.forEach((o,j)=>{const x=150+j*150;out+=hit(X,'pick',o,`English ${o}`,R(x-58,186,116,46,'#fff',C.blue,10)+L2_TB(x,216,o,20,C.ink))})}
  else out+=R(80,130,440,90,C.greenp,'none',10)+TB(300,182,'All eight done',18,C.green);
  if(s.i>0){const j=s.i-1,[lat,,opts,why]=L2_GQ[j],ok=s.ans[j]===opts[0];out+=R(40,250,520,48,ok?C.greenp:C.coralp,'none',10)+L2_TF(56,279,`${lat} → ${opts[0]}${ok?' ✓':` (you chose ${s.ans[j]})`}.  ${why}`,13,C.ink,'start')}
  const you=range(s.i).filter(j=>s.ans[j]===L2_GQ[j][2][0]).length;
  out+=TF(300,330,`${s.sim?'Simulated learner':'You'}: ${you} of ${s.i}   ·   always picking the closest look-alike: 0 of ${s.i}`,13,C.muted);
  return {svg:out,phase:s.i<8?'Apply the shifts to the Latin consonants and choose the English word they predict.':`Finished: ${you} of 8. Every distractor looked more like the Latin word than the true cognate does; the sound law beats resemblance.`};
 }});

const L2_VER={t:{grimm:'θ',before:{out:'θ (þ)',ex:'brother',ev:'Gothic brōþar, Old English brōþor; PIE *bʰréh₂tēr, accent before t'},after:{out:'ð → d',ex:'father',ev:'Gothic fadar, Old English fæder; PIE *ph₂tḗr, accent after t'}},
 s:{grimm:'s',before:{out:'s',ex:'was',ev:'Old English wæs: the accent fell before s'},after:{out:'z → r',ex:'were',ev:'Old English wǣron: the accent followed, s became z and then r'}}};
SCENE({id:'grimms-law-verner',name:'Verner’s law',tag:'An exception that proved the rule',
 definition:'Some Germanic words broke Grimm’s law: father has a d-sound where brother has th. In 1875 Karl Verner showed why. If the old accent came after the consonant, the new fricative became voiced. The accent later moved to the first syllable, hiding the cause.',
 example:'Brother and father had the same t in Proto-Indo-European. In *bʰréh₂tēr the accent came before it, giving þ; in *ph₂tḗr it came after, giving ð, later d (Gothic fadar). English was and were still show the same split for s.',
 desc:'A consonant passing through Grimm’s law and then Verner’s law, with the accent before or after it, and the English words that keep each outcome.',
 research:'Verner, K. (1877). Eine Ausnahme der ersten Lautverschiebung. Zeitschrift für vergleichende Sprachforschung 23, 97–130. · Osthoff, H. & Brugmann, K. (1878). Morphologische Untersuchungen, vol. 1, preface (sound laws without exceptions).',
 dur:12,hint:'Choose the consonant and move the accent before or after it. The outcome and a real English example follow.',
 init:()=>({c:'t',acc:'after'}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {c:k<2?'t':'s',acc:k%2?'after':'before'}},
 ui:[{choose:[['t','t'],['s','s']],label:'Consonant',get:s=>s.c,act:'c'},{choose:[['before','Accent before it'],['after','Accent after it']],label:'Accent',get:s=>s.acc,act:'acc'}],
 on:{c(s,v){s.c=v;return 'keep'},acc(s,v){s.acc=v;return 'keep'}},
 draw(s){
  const V=L2_VER[s.c],O=V[s.acc];let out=heading('Where the accent fell decided the sound');
  const syl=s.acc==='before'?['ˈCV',s.c,'V']:['CV',s.c,'ˈV'];
  out+=TF(300,62,'A word in Proto-Indo-European (schematic):',13,C.muted)+L2_seg(300,100,syl,28,true,C.purple);
  out+=TF(300,126,s.acc==='before'?'accent on the syllable before the consonant':'accent on the syllable after the consonant',13,C.purple);
  const boxes=[['Proto-Indo-European',s.c],['Grimm’s law',V.grimm],['Verner’s law',O.out],['English',O.ex]];
  boxes.forEach(([lab,val],j)=>{const x=24+j*144;out+=R(x,152,128,80,j===2?(s.acc==='after'?C.coralp:C.pale):(j===3?C.greenp:C.pale),'none',10)+TF(x+64,174,lab,12,C.muted)+L2_TB(x+64,212,val,j===3?22:24,j===3?C.green:C.ink);if(j<3)out+=arrow(x+130,192,x+142,192,C.line,2,6)});
  out+=L2_lines(40,262,L2_wrap(O.ev+'.',74),13,C.ink,'start',18);
  out+=R(40,300,520,54,'#fff',C.grid,8)+L2_lines(56,322,['Later all Germanic words took the accent on the first syllable, so the cause','vanished. English later turned the d of father into th (as in mother and gather).'],13,C.muted);
  return {svg:out,phase:s.acc==='after'?`With the accent after it, the new fricative was voiced: ${s.c==='t'?'þ became ð, then d, as in Gothic fadar':'s became z, then r, as in were'}. What looked like an exception was a second law.`:`With the accent before it, the fricative stayed voiceless: ${s.c==='t'?'þ, as in brother':'s, as in was'}. Grimm’s law alone is enough here.`};
 }});

/* ===================== Lesson: great-vowel-shift ===================== */
const L2_POS={i:[95,88],ɪ:[125,118],e:[120,150],ɛ:[145,212],æ:[160,252],a:[178,290],ə:[212,180],u:[312,88],ʊ:[288,118],o:[305,150],ɔ:[296,212],ɑ:[305,290],ø:[150,150]};
const L2_GV=[['bite','iː','aɪ',[[1400,'i'],[1550,'ə'],[1700,'a']]],['meet','eː','iː',[[1400,'e'],[1500,'i']]],['meat','ɛː','iː',[[1450,'ɛ'],[1600,'e'],[1700,'i']]],['name','aː','eɪ',[[1450,'a'],[1550,'æ'],[1650,'ɛ'],[1750,'e']]],['house','uː','aʊ',[[1400,'u'],[1550,'ə'],[1700,'a']]],['food','oː','uː',[[1400,'o'],[1500,'u']]],['boat','ɔː','oʊ',[[1500,'ɔ'],[1650,'o']]]];
const L2_OFF=[[-10,0],[10,-6],[-12,10],[8,6],[10,0],[-10,6],[0,8]];
function L2_gvAt(path,yr){if(yr<=path[0][0])return L2_POS[path[0][1]];for(let j=1;j<path.length;j++){if(yr<=path[j][0]){const a=L2_POS[path[j-1][1]],b=L2_POS[path[j][1]],u=smooth((yr-path[j-1][0])/(path[j][0]-path[j-1][0]));return [lerp(a[0],b[0],u),lerp(a[1],b[1],u)]}}return L2_POS[path[path.length-1][1]]}
function L2_trap(){return `<polygon points="70,70 330,70 330,305 160,305" fill="#fff" stroke="${C.grid}" stroke-width="2"/>`}
SCENE({id:'great-vowel-shift',name:'The Great Vowel Shift',tag:'How bite stopped sounding like beet',
 definition:'Between roughly 1400 and 1700 the long vowels of English moved. The highest ones, [iː] and [uː], became diphthongs, and the others rose one step to fill the gaps. Spelling had mostly settled before the change finished, which is why English letters no longer match their sounds.',
 example:'Chaucer said bite roughly as “beet-uh” and house as “hoose”. Today’s ee in meet was once [eː], as in German See.',
 desc:'A vowel chart with seven words moving as the year advances, and a table of their Middle English and modern vowels.',
 research:'Jespersen, O. (1909). A Modern English Grammar on Historical Principles, Part I (he named the shift). · Lass, R. (1999). Phonology and morphology. In The Cambridge History of the English Language, vol. 3. · Stenbrenden, G. F. (2016). Long-Vowel Shifts in English, c. 1050–1700, which argues the changes began earlier and were less unified. Dates here are approximate.',
 dur:12,hint:'Drag the year and watch the vowels move. Press a word in the table to hear its old vowel and then its modern one (synthetic, approximate).',
 init:()=>({yr:1400,sel:0}),
 watch(p){return {yr:Math.round(1400+p*350),sel:-1}},
 ui:[{range:'yr',label:'Year',min:1400,max:1750,step:10,get:s=>s.yr,act:'yr'}],
 on:{yr(s,v){s.yr=Number(v);return 'keep'},say(s,i){i=Number(i);s.sel=i;const G=L2_GV[i];L2_say(G[1],0);L2_say(G[2],1.05);return 'keep'}},
 draw(s,f,X){
  let out=heading(`English long vowels around ${s.yr}`)+L2_trap();
  out+=TF(80,64,'front',12,C.muted,'start')+TF(322,64,'back',12,C.muted,'end')+TF(64,92,'high',12,C.muted,'end')+TF(150,320,'low',12,C.muted,'end');
  L2_GV.forEach((G,i)=>{const pts=G[3].map(([,v])=>L2_POS[v]),[dx,dy]=L2_OFF[i];out+=P('M'+pts.map(p=>fmt(p[0]+dx)+' '+fmt(p[1]+dy)).join(' L'),C.grid,2,'none','stroke-dasharray="4 4"')});
  L2_GV.forEach((G,i)=>{const [x,y]=L2_gvAt(G[3],s.yr),[dx,dy]=L2_OFF[i],on=i===s.sel;out+=Ci(x+dx,y+dy,on?9:7,on?C.coral:C.blue,'#fff')+TF(x+dx+11,y+dy+4,G[0],12,on?C.coral:C.ink,'start')});
  out+=TF(360,64,'word',12,C.muted,'start')+TF(450,64,'c. 1400',12,C.muted)+TF(530,64,'today',12,C.muted);
  L2_GV.forEach((G,i)=>{const y=82+i*36,doneYr=G[3][G[3].length-1][0],done=s.yr>=doneYr,on=i===s.sel;
   out+=hit(X,'say',i,`Hear ${G[0]}: ${G[1]} then ${G[2]}`,R(352,y,232,30,on?C.coralp:(done?C.pale:'#fff'),on?C.coral:C.grid,8)+TBF(364,y+20,G[0],14,C.ink,'start')+L2_TF(450,y+20,`[${G[1]}]`,15,C.purple)+L2_TF(530,y+20,done?`[${G[2]}]`:'…',15,done?C.green:C.muted))});
  out+=TF(468,350,'shaded rows have finished changing',12,C.muted);
  return {svg:out,phase:s.yr<1500?'Around 1400 the high vowels [iː] and [uː] begin to break into diphthongs, and [eː] and [oː] start to rise into their place.':s.yr<1650?'The mid and low vowels rise one step each. Printers have already fixed many spellings, so the letters keep their old values.':'By about 1700 the modern pattern is in place: meet and meat have merged as [iː], and name has its [eɪ].'};
 }});

const L2_SP=[['bite','i','[iː] as in Italian vino','[aɪ]'],['meet','ee','[eː] as in German See','[iː]'],['meat','ea','[ɛː], an open e','[iː]'],['name','a','[aː] as in Italian casa','[eɪ]'],['house','ou','[uː], the French spelling for it','[aʊ]'],['food','oo','[oː] as in German Boot','[uː]'],['boat','oa','[ɔː], an open o','[oʊ]']];
SCENE({id:'great-vowel-shift-spelling',name:'Why spelling stopped matching',tag:'Print fixed the letters first',
 definition:'Middle English letters had roughly their Latin values. Printing, from Caxton’s press in 1476, and the clerks of the Chancery helped fix spellings while the vowels were still moving. The letters stayed and the sounds went on changing.',
 example:'The letter i in bite once stood for [iː], as it still does in Italian vino. The sound moved to [aɪ]; the spelling stayed.',
 desc:'A timeline from 1350 to 1760 with the vowel shift as a band and the main events that fixed spelling, plus each word’s letters, their old value and the modern sound.',
 research:'Scragg, D. G. (1974). A History of English Spelling. Manchester University Press. · Upward, C. & Davidson, G. (2011). The History of English Spelling. Wiley-Blackwell. Dates are approximate.',
 dur:10,hint:'Press a word to see what its letters meant before the shift and what they mean now.',
 init:()=>({sel:0}),
 watch(p){return {sel:Math.min(6,Math.floor(p*7))}},
 on:{w(s,v){s.sel=Number(v);return 'keep'}},
 draw(s,f,X){
  const x0=50,x1=550,X0=1350,X1=1760,tx=y=>x0+(y-X0)/(X1-X0)*(x1-x0);let out=heading('The vowels moved after the spelling settled');
  out+=R(tx(1400),70,tx(1700)-tx(1400),26,C.coralp,'none',6)+TF((tx(1400)+tx(1700))/2,88,'the Great Vowel Shift (approx.)',13,C.coral);
  out+=L(x0,112,x1,112,C.line,2);for(const y of [1400,1500,1600,1700])out+=L(tx(y),106,tx(y),118,C.line,2)+TF(tx(y),132,y,12,C.muted);
  const ev=[[1400,'Chaucer dies',0],[1430,'Chancery spelling',1],[1476,'Caxton’s press',0],[1611,'King James Bible',1],[1755,'Johnson’s Dictionary',0]];
  ev.forEach(([y,t,r])=>{out+=Ci(tx(y),112,5,C.purple)+L2_TF(Math.min(520,Math.max(70,tx(y))),152+r*18,t,12,C.purple)});
  L2_SP.forEach((W,i)=>{const x=46+i*80;out+=L2_chip(X,'w',i,W[0],x-34,192,72,i===s.sel,`Show ${W[0]}`)});
  const W=L2_SP[s.sel];out+=R(40,236,520,116,'#fff',C.grid,10);
  out+=TF(70,262,'spelling',12,C.muted,'start')+L2_TB(70,294,W[0],26,C.ink,'start')+TF(70,320,`letters: ${W[1]}`,13,C.coral,'start');
  out+=TF(230,262,'letters meant before the shift',12,C.muted,'start')+L2_lines(230,290,L2_wrap(W[2],22),15,C.purple,'start',20);
  out+=TF(430,262,'sound today',12,C.muted,'start')+L2_TB(430,294,W[3],24,C.green,'start');
  return {svg:out,phase:`In ${W[0]} the letters ${W[1]} once meant ${W[2]}. The sound became ${W[3]}, but the spelling had already settled.`};
 }});

const L2_CH={drag:{order:[[['iː','əɪ'],['uː','əʊ']],[['eː','iː'],['oː','uː']],[['ɛː','eː'],['ɔː','oː']],[['aː','ɛː']]],note:'Drag chain: the high vowels moved first, and each lower vowel was pulled up into the gap left above it.'},
 push:{order:[[['aː','ɛː']],[['ɛː','eː'],['ɔː','oː']],[['eː','iː'],['oː','uː']],[['iː','əɪ'],['uː','əʊ']]],note:'Push chain: the lower vowels rose first and crowded the ones above, until the highest vowels had to break into diphthongs.'},
 north:{order:[[['iː','əɪ']],[['eː','iː']],[['ɛː','eː']],[['aː','ɛː']]],note:'In the North and in Scots, oː had already moved forward before the shift. Nothing pushed uː, and it stayed: Scots still says hoose. Luick read this as evidence for a push chain.'}};
const L2_SLOT={iː:[150,96],eː:[150,166],ɛː:[150,236],aː:[300,302],uː:[450,96],oː:[450,166],ɔː:[450,236],əɪ:[226,58],əʊ:[374,58]};
SCENE({id:'great-vowel-shift-chain',name:'Push or drag?',tag:'A debated chain shift',
 definition:'In a chain shift, one sound’s move is linked to its neighbours’. Linguists still debate whether the Great Vowel Shift started at the top (a drag chain) or at the bottom (a push chain), or whether it was a looser set of changes over centuries.',
 example:'Northern English and Scots kept [uː] in house (“hoose”). Their [oː] had moved forward earlier, so nothing pushed [uː] up and out. That is one argument for a push chain.',
 desc:'Long vowels in their positions, with arrows appearing in the order each model proposes, step by step, and a Northern variant.',
 research:'Jespersen, O. (1909). A Modern English Grammar, Part I. · Luick, K. (1914–40). Historische Grammatik der englischen Sprache. · Lass, R. (1976). English Phonology and Phonological Theory. · Stenbrenden, G. F. (2016). Long-Vowel Shifts in English, c. 1050–1700. The order is debated.',
 dur:12,hint:'Choose a model and move through the steps to see which vowel moves first.',
 init:()=>({m:'drag',st:4}),
 watch(p){return p<.5?{m:'drag',st:Math.min(4,Math.floor(p*10))}:{m:'push',st:Math.min(4,Math.floor((p-.5)*10))}},
 ui:[{choose:[['drag','Drag chain'],['push','Push chain'],['north','Northern English']],label:'Model',get:s=>s.m,act:'m'},{range:'st',label:'Step',min:0,max:4,step:1,get:s=>s.st,act:'st'}],
 on:{m(s,v){s.m=v;return 'keep'},st(s,v){s.st=Number(v);return 'keep'}},
 draw(s){
  const M=L2_CH[s.m];let out=heading({drag:'Drag chain: the top moves first',push:'Push chain: the bottom moves first',north:'Northern English: the high back vowel stays'}[s.m]);
  out+=TF(150,334,'front',12,C.muted)+TF(450,334,'back',12,C.muted);
  for(const v of ['iː','eː','ɛː','aː','uː','oː','ɔː']){const [x,y]=L2_SLOT[v];out+=R(x-30,y-20,60,36,'#fff',C.grid,8)+L2_TF(x,y+5,v,17,C.ink)}
  if(s.m==='north')out+=R(250,146,60,36,C.greenp,C.green,8)+L2_TF(280,171,'øː',17,C.green)+L2_TF(280,200,'(already moved)',12,C.green);
  M.order.slice(0,s.st).forEach((grp,j)=>{grp.forEach(([a,b])=>{const A=L2_SLOT[a],B=L2_SLOT[b];out+=arrow(A[0]+(A[0]===B[0]?-38:0),A[1]-2,B[0]+(A[0]===B[0]?-38:0),B[1]+(B[1]<A[1]?12:0),C.coral,2.6)+(L2_SLOT[b]&&(b==='əɪ'||b==='əʊ')?R(B[0]-24,B[1]-16,48,28,C.coralp,'none',8)+L2_TF(B[0],B[1]+4,b,15,C.coral):'');out+=TF(A[0]+(A[0]===B[0]?-62:0),(A[1]+B[1])/2,String(j+1),12,C.coral)})});
  if(s.m==='north'&&s.st>=1)out+=TF(450,130,'uː stays: “hoose”',12,C.green);
  out+=L2_lines(330,286,L2_wrap(M.note,36),12.5,C.ink,'start',16);
  return {svg:out,phase:M.note+' Numbers show the order of moves.'};
 }});

/* ===================== Lesson: phonetics-ipa ===================== */
const L2_VW=[['i',88,82,'close front unrounded','Spanish sí'],['y',122,82,'close front rounded','French tu'],['ɨ',205,82,'close central unrounded','Polish ty'],['u',318,82,'close back rounded','Spanish tú'],['e',118,148,'close-mid front unrounded','French été'],['ø',152,148,'close-mid front rounded','French peu'],['o',312,148,'close-mid back rounded','Spanish no'],['ə',215,184,'mid central (schwa)','English about'],['ɛ',144,218,'open-mid front unrounded','French mère'],['ɔ',305,218,'open-mid back rounded','Italian otto'],['a',176,288,'open front unrounded','Spanish casa'],['ɑ',305,288,'open back unrounded','Southern British father']];
SCENE({id:'phonetics-ipa',name:'The International Phonetic Alphabet',tag:'One symbol for each sound',
 definition:'The International Phonetic Alphabet, begun by Paul Passy’s association in 1886–88, gives one symbol to each distinctive speech sound in any language. Vowels are placed by tongue height and frontness and by lip rounding, which acoustically correspond to the first two resonances of the mouth, F1 and F2.',
 example:'French tu has [y]: the tongue of [i] with the lips of [u]. English has no such vowel, which is why speakers of English find it hard.',
 desc:'A vowel chart with twelve symbols. Pressing one plays a synthetic version and shows its description, an example word and approximate formants. The 3D view places the vowels by F1, F2 and F3.',
 research:'International Phonetic Association (1999). Handbook of the IPA. Cambridge University Press. · Jones, D. (1917/1918), the cardinal vowels. · Peterson, G. E. & Barney, H. L. (1952). Control methods used in a study of the vowels. JASA 24. Formants here are approximate.',
 dur:12,hint:'Press a vowel to hear it and see where the tongue is. Choose the lower or higher voice to hear the same vowel from a different speaker.',
 init:()=>({sel:0,voice:'low'}),
 watch(p){return {sel:[0,3,10,7,1][Math.min(4,Math.floor(p*5))],voice:'low'}},
 ui:[{choose:[['low','Lower voice'],['high','Higher voice']],label:'Voice',get:s=>s.voice,act:'voice'},{b:'Play ▶',act:'play'}],
 on:{v(s,i){s.sel=Number(i);const V=L2_VW[s.sel];L2_vowel(V[0],s.voice==='high'?{f0:210,k:1.17,dur:.8}:{dur:.8});return 'keep'},voice(s,v){s.voice=v;return 'keep'},play(s){const V=L2_VW[s.sel];L2_vowel(V[0],s.voice==='high'?{f0:210,k:1.17,dur:.8}:{dur:.8});return 'keep'}},
 draw(s,f,X){
  let out=heading('The vowel chart')+L2_trap()+TF(80,62,'front',12,C.muted,'start')+TF(322,62,'back',12,C.muted,'end')+TF(60,86,'close',12,C.muted,'end')+TF(150,322,'open',12,C.muted,'end');
  L2_VW.forEach(([v,x,y],i)=>{const on=i===s.sel;out+=hit(X,'v',i,`Vowel ${v}: ${L2_VW[i][3]}`,Ci(x,y,15,on?C.purple:'#fff',C.purple)+L2_TB(x,y+6,v,17,on?'#fff':C.purple))});
  const V=L2_VW[s.sel],F=L2_F[V[0]],k=s.voice==='high'?1.17:1;
  out+=R(350,56,232,286,C.pale,'none',12)+L2_TB(466,118,`[${V[0]}]`,44,C.purple)+L2_lines(366,158,L2_wrap(V[3],28),14,C.ink,'start',18)+TF(366,204,'as in '+V[4],14,C.blue,'start');
  out+=TF(366,240,'approximate formants',12,C.muted,'start');['F1','F2','F3'].forEach((n,j)=>{out+=TF(366,264+j*22,`${n}  ${Math.round(F[j]*k)} Hz`,14,C.ink,'start')});
  return {svg:out,phase:`[${V[0]}] is ${V[3]}, as in ${V[4]}. Moving the tongue down raises F1; moving it forward raises F2; rounding the lips lowers F2 and F3.`};
 },
 three(s,f,X,project){
  const P=project([[0,0,0],[3,3,3]]),sx=F2=>(2400-F2)/1700*3,sz=F1=>(850-F1)/600*3,sy=F3=>(F3-2250)/700*3;let o=axes3(P,['back','F3','high'],[3,3,3]);
  L2_VW.forEach(([v],i)=>{const F=L2_F[v],q=[sx(F[1]),sy(F[2]),sz(F[0])],on=i===s.sel;o+=line3([q[0],q[1],0],q,P,C.grid,1)+point3(q,P,on?C.coral:C.purple,on?8:6);const p=P(q);o+=L2_TF(p[0]+12,p[1]-8,v,15,on?C.coral:C.purple,'start')});
  return {svg:o,title:'Vowels in formant space',caption:'Across: F2, front vowels left. Up: low F1, so close vowels sit high. Depth: F3, lowered by lip rounding, which separates [i] from [y].'};
 }});

const L2_PLACES=['bilabial','labiodental','dental','alveolar','postalveolar','palatal','velar','uvular','pharyngeal','glottal'];
const L2_MANNERS=['plosive','nasal','trill','fricative','lateral fricative','approximant','lateral approx.'];
// [manner, place, voiceless, voiced]
const L2_CONS=[[0,0,'p','b'],[0,3,'t','d'],[0,5,'c','ɟ'],[0,6,'k','ɡ'],[0,7,'q','ɢ'],[0,9,'ʔ',''],[1,0,'','m'],[1,1,'','ɱ'],[1,3,'','n'],[1,5,'','ɲ'],[1,6,'','ŋ'],[1,7,'','ɴ'],[2,0,'','ʙ'],[2,3,'','r'],[2,7,'','ʀ'],[3,0,'ɸ','β'],[3,1,'f','v'],[3,2,'θ','ð'],[3,3,'s','z'],[3,4,'ʃ','ʒ'],[3,5,'ç','ʝ'],[3,6,'x','ɣ'],[3,7,'χ','ʁ'],[3,8,'ħ','ʕ'],[3,9,'h','ɦ'],[4,3,'ɬ','ɮ'],[5,1,'','ʋ'],[5,3,'','ɹ'],[5,5,'','j'],[5,6,'','ɰ'],[6,3,'','l'],[6,5,'','ʎ'],[6,6,'','ʟ']];
const L2_EX={p:'English pin',b:'English bin',t:'English tin',d:'English din',c:'Hungarian ty in kutya “dog”',ɟ:'Hungarian gy in magyar',k:'English kin',ɡ:'English go',q:'Arabic q in qalb “heart”',ʔ:'the catch in English uh-oh',m:'English man',ɱ:'the m of English comfort, for many speakers',n:'English no',ɲ:'Spanish ñ in año',ŋ:'English sing',r:'Spanish rr in perro',ʀ:'a trilled r used by some French and German speakers',ɸ:'Japanese f in Fuji',β:'Spanish b between vowels, as in lobo',f:'English fan',v:'English van',θ:'English thin',ð:'English this',s:'English sip',z:'English zip',ʃ:'English ship',ʒ:'the s of English measure',ç:'German ch in ich',x:'German ch in Bach, Scots loch',ɣ:'Spanish g between vowels, as in lago',χ:'kh for many Arabic speakers, as in khubz “bread”',ʁ:'French r in rouge',ħ:'Arabic ḥ in ḥubb “love”',ʕ:'Arabic ʿayn, in ʿarabī',h:'English hat',ɦ:'Czech h in hrad “castle”',ɬ:'Welsh ll in Llanelli',ɹ:'English red',j:'English yes',ʋ:'Hindi v, as in vah',l:'English leaf',ʎ:'Italian gli in figlio'};
const L2_ENG=new Set(['p','b','t','d','k','ɡ','m','n','ŋ','f','v','θ','ð','s','z','ʃ','ʒ','h','ɹ','j','l']);
SCENE({id:'phonetics-ipa-consonants',name:'The consonant chart',tag:'Where and how the air is stopped',
 definition:'Consonants are described by place of articulation (where the airflow is narrowed, from the lips to the glottis), manner (stopped, nasal, trilled, rubbed, flowing round the tongue) and voicing (whether the vocal folds vibrate). The pulmonic chart puts each sound in one cell.',
 example:'[p] and [b] are both bilabial plosives; they differ only in voicing. [x], the ch of German Bach, is a voiceless velar fricative, made where [k] is made but without a full closure.',
 desc:'The pulmonic consonant chart. Pressing a symbol shows its description and an example; one option highlights the consonants of English.',
 research:'International Phonetic Association (2015 chart; 1999 Handbook). · Ladefoged, P. & Maddieson, I. (1996). The Sounds of the World’s Languages. Blackwell. Clicks, implosives and ejectives have separate tables.',
 dur:12,hint:'Press a symbol to read its name and an example. Highlight English to see how much of the chart one language uses.',
 init:()=>({sel:'x',eng:'no'}),
 watch(p){const seq=['p','b','ʃ','x','ɬ','ħ'];return {sel:seq[Math.min(5,Math.floor(p*6))],eng:p>.5?'yes':'no'}},
 ui:[{choose:[['no','All sounds'],['yes','Highlight English']],label:'Show',get:s=>s.eng,act:'eng'}],
 on:{c(s,v){s.sel=v;return 'keep'},eng(s,v){s.eng=v;return 'keep'}},
 draw(s,f,X){
  const x0=132,cw=46,y0=110,rh=26,eng=s.eng==='yes';let out=heading('Pulmonic consonants');
  L2_PLACES.forEach((p,j)=>{const x=x0+j*cw+cw/2;out+=TF(x-4,y0-14,p,13,C.muted,'start',`transform="rotate(-38 ${fmt(x-4)} ${fmt(y0-14)})"`)});
  L2_MANNERS.forEach((m,r)=>{out+=TF(x0-8,y0+r*rh+18,m,13,C.ink,'end')});
  out+=R(x0,y0,cw*10,rh*7,'#fff',C.grid,4);for(let j=1;j<10;j++)out+=L(x0+j*cw,y0,x0+j*cw,y0+rh*7,C.grid,1);for(let r=1;r<7;r++)out+=L(x0,y0+r*rh,x0+cw*10,y0+r*rh,C.grid,1);
  L2_CONS.forEach(([r,j,vl,vd])=>{[[vl,-11],[vd,11]].forEach(([sym,dx])=>{if(!sym)return;const x=x0+j*cw+cw/2+dx,y=y0+r*rh+18,on=sym===s.sel,en=eng&&L2_ENG.has(sym);
   out+=hit(X,'c',sym,`Consonant ${sym}`,(on?Ci(x,y-5,11,C.purple):(en?Ci(x,y-5,11,C.greenp):''))+L2_TF(x,y,sym,15,on?'#fff':(en?C.green:C.ink)))})});
  const row=L2_CONS.find(c=>c[2]===s.sel||c[3]===s.sel),voiced=row&&row[3]===s.sel;
  const name=row?`${voiced?'voiced':'voiceless'} ${L2_PLACES[row[1]]} ${L2_MANNERS[row[0]].replace('approx.','approximant')}`:'';
  out+=R(24,302,556,56,C.pale,'none',10)+L2_TB(60,340,`[${s.sel}]`,26,C.purple)+TBF(104,324,name,14,C.ink,'start')+L2_TF(104,346,L2_EX[s.sel]?'as in '+L2_EX[s.sel]:'rare; found in a few languages',13,C.ink,'start');
  return {svg:out,phase:eng?'English uses 21 of these symbols, plus [w], [tʃ] (church) and [dʒ] (judge), which sit outside this simple grid. Many languages use cells English never touches, such as [x], [ɬ] and [ħ].':`[${s.sel}]: ${name}. Pairs in one cell differ only in voicing: the left symbol is voiceless, the right voiced.`};
 }});

const L2_TONES={man:{syl:'ma',items:[['mā','55','mother'],['má','35','hemp'],['mǎ','214','horse'],['mà','51','to scold']]},can:{syl:'si',items:[['si1','55','poem'],['si2','25','history'],['si3','33','to try'],['si4','21','time'],['si5','23','market'],['si6','22','matter']]}};
const L2_HZ=n=>95+(n-1)*18;
function L2_contour(code){const d=[...code].map(Number);return d.length===2?[[0,d[0]],[1,d[1]]]:[[0,d[0]],[.45,d[1]],[1,d[2]]]}
SCENE({id:'phonetics-ipa-tones',name:'Tone',tag:'Pitch that changes the word',
 definition:'In a tone language, pitch distinguishes words just as consonants and vowels do. Yuen Ren Chao’s tone letters describe each tone with numbers from 1 (lowest) to 5 (highest) for the speaker’s range.',
 example:'Mandarin mā (55, high level) means “mother”, má (35, rising) “hemp”, mǎ (214, dipping) “horse” and mà (51, falling) “to scold”.',
 desc:'Pitch contours on a five-level scale for the four Mandarin tones or six Cantonese tones, with the chosen tone drawn heavier. Pressing a syllable plays a synthetic pitch glide.',
 research:'Chao, Y. R. (1930). A system of tone letters. Le Maître Phonétique 45. · Yip, M. (2002). Tone. Cambridge University Press. · Maddieson, I. (2013). Tone. In WALS Online, ch. 13: about two in five of the 527 sampled languages (220) have tone.',
 dur:12,hint:'Choose Mandarin or Cantonese and press a syllable to hear its pitch contour (synthetic, approximate).',
 init:()=>({lang:'man',sel:2}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {lang:'man',sel:k}},
 ui:[{choose:[['man','Mandarin'],['can','Cantonese']],label:'Language',get:s=>s.lang,act:'lang'},{b:'Play all ▶',act:'all'}],
 on:{lang(s,v){s.lang=v;s.sel=0;return 'keep'},t(s,i){s.sel=Number(i);const it=L2_TONES[s.lang].items[s.sel];L2_glide(L2_contour(it[1]).map(([u,n])=>[u,L2_HZ(n)]),it[1]==='214'?.75:.55);return 'keep'},
  all(s){L2_TONES[s.lang].items.forEach((it,j)=>L2_glide(L2_contour(it[1]).map(([u,n])=>[u,L2_HZ(n)]),it[1]==='214'?.75:.55,j*.85));return 'keep'}},
 draw(s,f,X){
  const T0=L2_TONES[s.lang],x0=64,x1=330,y=n=>300-(n-1)*55;let out=heading(s.lang==='man'?'The four tones of Mandarin':'The six tones of Cantonese');
  for(let n=1;n<=5;n++)out+=L(x0,y(n),x1,y(n),C.grid,1)+TF(x0-10,y(n)+4,n,13,C.muted,'end');
  out+=TF(x0-28,y(5)-14,'pitch',12,C.muted,'start')+TF((x0+x1)/2,328,'time →',12,C.muted);
  T0.items.forEach((it,i)=>{const pts=L2_contour(it[1]).map(([u,n])=>[x0+20+u*(x1-x0-40),y(n)]),on=i===s.sel;out+=P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),on?C.coral:C.line,on?5:2.2)});
  T0.items.forEach((it,i)=>{const yy=60+i*(T0.items.length>4?46:62),on=i===s.sel;out+=hit(X,'t',i,`Hear ${it[0]}, tone ${it[1]}, ${it[2]}`,R(360,yy,222,T0.items.length>4?38:50,on?C.coralp:'#fff',on?C.coral:C.grid,8)+L2_TBF(376,yy+(T0.items.length>4?25:31),it[0],18,C.ink,'start')+TF(444,yy+(T0.items.length>4?25:31),it[1],14,C.purple,'start')+TF(484,yy+(T0.items.length>4?25:31),it[2],13,C.ink,'start'))});
  const it=T0.items[s.sel];
  return {svg:out,phase:`${it[0]} (tone ${it[1]}) means “${it[2]}”. The consonant and vowel stay the same; only the pitch contour changes the word. ${s.lang==='can'?'Cantonese is written here in Jyutping romanisation.':'Pinyin marks the tones with accents over the vowel.'}`};
 }});

/* ===================== Lesson: language-trees ===================== */
const L2_BR={Celtic:[64,150],Italic:[120,236],Germanic:[176,104],Greek:[246,300],Albanian:[226,236],Baltic:[290,82],Slavic:[318,150],Armenian:[392,262],Anatolian:[340,322],'Indo-Iranian':[470,200],Tocharian:[536,108]};
const L2_ISO={satem:{name:'satem: k̑ → s or š',m:['Indo-Iranian','Baltic','Slavic','Armenian','Albanian'],col:C.coral},ao:{name:'merger of o and a',m:['Indo-Iranian','Baltic','Slavic','Germanic'],col:C.blue},dat:{name:'-m- in plural case endings',m:['Germanic','Baltic','Slavic'],col:C.green},r:{name:'-r in passive endings',m:['Italic','Celtic','Anatolian','Tocharian'],col:C.purple},aug:{name:'past-tense prefix e-',m:['Greek','Indo-Iranian','Armenian'],col:C.amber}};
const L2_TREE=[['PIE',300,64],['Anatolian',96,'leaf'],['rest',330,104],['Tocharian',150,'leaf'],['core',360,144],['West',230,186],['East',470,186]];
SCENE({id:'language-trees',name:'Trees and waves',tag:'Two pictures of descent',
 definition:'August Schleicher drew languages as a family tree, splitting cleanly like species. Johannes Schmidt answered with the wave model: changes spread outward from where they start, overlapping between neighbours, so shared features do not always nest neatly into branches.',
 example:'The satem change groups Indo-Iranian with Balto-Slavic, but the -m- case endings group Balto-Slavic with Germanic. The features cut across each other, as waves would.',
 desc:'The main branches of Indo-European on a rough map, shown either as a tree or with the spread of five shared features drawn as overlapping zones.',
 research:'Schleicher, A. (1853). Die ersten Spaltungen des indogermanischen Urvolkes; (1861–62) Compendium. · Schmidt, J. (1872). Die Verwantschaftsverhältnisse der indogermanischen Sprachen. · Fortson, B. W. (2010). Indo-European Language and Culture, 2nd ed. Features simplified.',
 dur:12,hint:'Switch between the tree and the waves, and press a feature to see which branches share it.',
 init:()=>({view:'waves',f:'satem'}),
 watch(p){return p<.3?{view:'tree',f:'satem'}:{view:'waves',f:['satem','ao','dat','r','aug'][Math.min(4,Math.floor((p-.3)/.7*5))]}},
 ui:[{choose:[['tree','Family tree'],['waves','Waves']],label:'View',get:s=>s.view,act:'view'}],
 on:{view(s,v){s.view=v;return 'keep'},f(s,v){s.f=v;s.view='waves';return 'keep'}},
 draw(s,f,X){
  let out=heading(s.view==='tree'?'Schleicher’s picture: a branching tree':'Schmidt’s picture: overlapping waves');
  if(s.view==='tree'){
   const leaves=Object.keys(L2_BR),root=[300,58],mid=[300,120];out+=Ci(root[0],root[1],7,C.purple)+TF(314,62,'Proto-Indo-European',13,C.purple,'start')+L(root[0],root[1],mid[0],mid[1],C.line,2.5);
   leaves.forEach((b,i)=>{const x=40+i*52,y=300;out+=P(`M${mid[0]} ${mid[1]} C${mid[0]} ${(mid[1]+y)/2} ${x} ${(mid[1]+y)/2} ${x} ${y}`,C.line,2)+Ci(x,y,5,C.blue)+TF(x,y+18,b.length>9?b.slice(0,8)+'.':b,12,C.ink,'end',`transform="rotate(-40 ${fmt(x)} ${fmt(y+18)})"`)});
   out+=TF(300,96,'(the order of the splits is still debated; Anatolian probably split first)',12,C.muted);
   return {svg:out,phase:'A tree says each branch inherited everything it shares with its sisters from a single common ancestor, after a clean split. That fits many facts, but not all of them.'};}
  const I=L2_ISO[s.f];
  I.m.forEach(a=>I.m.forEach(b=>{if(a<b){const A=L2_BR[a],B=L2_BR[b];out+=L(A[0],A[1],B[0],B[1],I.col,26,'opacity=".13"')}}));
  I.m.forEach(a=>{const A=L2_BR[a];out+=Ci(A[0],A[1],26,I.col,'none','opacity=".16"')});
  Object.entries(L2_BR).forEach(([b,[x,y]])=>{const on=I.m.includes(b);out+=Ci(x,y,6,on?I.col:C.line)+TF(x,y-11,b,12,on?C.ink:C.muted)});
  Object.entries(L2_ISO).forEach(([k,F],j)=>{const x=24+j*112;out+=L2_chip(X,'f',k,{satem:'satem',ao:'o/a merger',dat:'-m- endings',r:'r-passive',aug:'e- past'}[k],x,342,104,k===s.f,`Show ${F.name}`,F.col)});
  return {svg:out,phase:`${I.name}: ${I.m.join(', ')}. Compare the features: each draws a different boundary, and they cut across one another, as changes spreading between neighbours would.`};
 }});

const L2_LN=['English','German','Dutch','Swedish','French','Spanish','Italian','Russian'];
const L2_D0=[[0,.36,.33,.38,.73,.75,.74,.80],[.36,0,.12,.30,.76,.77,.76,.80],[.33,.12,0,.32,.75,.77,.76,.80],[.38,.30,.32,0,.77,.78,.77,.81],[.73,.76,.75,.77,0,.22,.20,.78],[.75,.77,.77,.78,.22,0,.15,.79],[.74,.76,.76,.77,.20,.15,0,.78],[.80,.80,.80,.81,.78,.79,.78,0]];
function L2_dist(loans){const D=L2_D0.map(r=>r.slice());if(loans==='yes'){[[4,.15],[5,.40],[6,.40]].forEach(([j,v])=>{D[0][j]=v;D[j][0]=v})}return D}
function L2_upgma(D){let cl=L2_LN.map((n,i)=>({ids:[i],node:{leaf:i,h:0}}));const avg=(a,b)=>{let t=0;for(const i of a.ids)for(const j of b.ids)t+=D[i][j];return t/(a.ids.length*b.ids.length)},joins=[];
 while(cl.length>1){let best=null;for(let i=0;i<cl.length;i++)for(let j=i+1;j<cl.length;j++){const v=avg(cl[i],cl[j]);if(!best||v<best.v-1e-9)best={i,j,v}}
  const a=cl[best.i],b=cl[best.j],node={a:a.node,b:b.node,h:best.v/2};joins.push({a:a.ids.map(i=>L2_LN[i]),b:b.ids.map(i=>L2_LN[i]),v:best.v,node});cl=cl.filter((_,k)=>k!==best.i&&k!==best.j);cl.push({ids:a.ids.concat(b.ids),node})}
 return {root:cl[0].node,joins}}
function L2_leaves(n){return n.leaf!==undefined?[n.leaf]:L2_leaves(n.a).concat(L2_leaves(n.b))}
SCENE({id:'language-trees-phylo',name:'A tree from word lists',tag:'Counting shared cognates',
 definition:'Morris Swadesh proposed comparing short lists of basic meanings (I, two, water, hand…) that are rarely borrowed. The share of cognates between two languages gives a distance, and a clustering method joins the closest pair first, building a tree step by step.',
 example:'German and Dutch share most of their basic words and join first; Spanish and Italian join next. If English’s French loanwords were counted as if inherited, English would wrongly join the Romance languages.',
 desc:'A distance table turned into a tree by average-linkage clustering (UPGMA), one join per step, with an option to count borrowings as if inherited.',
 research:'Swadesh, M. (1952). Lexico-statistic dating of prehistoric ethnic contacts. Proceedings of the American Philosophical Society 96. · Dyen, I., Kruskal, J. B. & Black, P. (1992). An Indoeuropean classification: a lexicostatistical experiment. · Sokal, R. R. & Michener, C. D. (1958), UPGMA. The distances here are illustrative.',
 dur:12,hint:'Step through the joins. Then count borrowed words as inherited and watch English move to the wrong branch.',
 init:()=>({loans:'no'}),
 trace(s){const {joins}=L2_upgma(L2_dist(s.loans));return [{k:0,say:'Start: every language is its own group.'}].concat(joins.map((j,k)=>({k:k+1,say:`Join ${j.a.join(' + ')} with ${j.b.join(' + ')}: average distance ${j.v.toFixed(2)}.`})))},
 ui:[{choose:[['no','Basic vocabulary only'],['yes','Count French loans as inherited (wrong)']],label:'Data',get:s=>s.loans,act:'loans'}],
 on:{loans(s,v){s.loans=v}},
 draw(s,f){
  const {root,joins}=L2_upgma(L2_dist(s.loans)),k=f?f.k:joins.length,ord=L2_leaves(root),y0=70,dy=32,xL=128,sc=420/.42;let out=heading(s.loans==='yes'?'Borrowings counted as inheritance':'Clustering by shared basic vocabulary');
  const pos={};ord.forEach((i,r)=>{pos['L'+i]=[xL,y0+r*dy];out+=TF(xL-10,y0+r*dy+5,L2_LN[i],14,i===0&&s.loans==='yes'?C.coral:C.ink,'end')});
  const key=n=>n.leaf!==undefined?'L'+n.leaf:null;
  joins.slice(0,k).forEach((J,j)=>{const n=J.node,pa=n.a.leaf!==undefined?pos['L'+n.a.leaf]:n.a._p,pb=n.b.leaf!==undefined?pos['L'+n.b.leaf]:n.b._p,x=xL+n.h*sc,cur=j===k-1;
   out+=L(pa[0],pa[1],x,pa[1],cur?C.coral:C.blue,2.4)+L(pb[0],pb[1],x,pb[1],cur?C.coral:C.blue,2.4)+L(x,pa[1],x,pb[1],cur?C.coral:C.blue,2.4);n._p=[x,(pa[1]+pb[1])/2]});
  out+=L(xL,330,xL+.4*sc,330,C.line,1.5);for(const v of [0,.1,.2,.3,.4])out+=L(xL+v*sc,326,xL+v*sc,334,C.line,1.5)+TF(xL+v*sc,350,(v*2).toFixed(1),12,C.muted);
  out+=TF(xL+.2*sc,368,'distance (share of basic meanings not cognate)',12,C.muted);
  return {svg:out,phase:(f?f.say:'')+(k===joins.length?(s.loans==='yes'?' English has joined the Romance languages: borrowing has been mistaken for descent.':' English, German, Dutch and Swedish form Germanic; French, Spanish and Italian form Romance; Russian joins last.'):'')};
 }});

const L2_DATES=[['Gray & Atkinson 2003',7800,9800,'Bayesian trees from basic vocabulary'],['Bouckaert et al. 2012',8000,9500,'adds geography; supports Anatolia (approx.)'],['Chang et al. 2015',5500,7500,'fixes some ancestors as known; supports the steppe (approx.)']];
SCENE({id:'language-trees-dating',name:'Dating the tree',tag:'Glottochronology and its successors',
 definition:'Glottochronology assumed basic vocabulary is replaced at a constant rate, so the share of shared cognates gives the time since a split. The constant rate failed tests, but modern Bayesian methods, which let rates vary, revived the question of when Proto-Indo-European was spoken.',
 example:'With Swadesh’s retention rate of 86% per thousand years, two languages sharing 74% of the list would have split about 1,000 years ago. Icelandic kept far more of its basic vocabulary than the formula predicts.',
 desc:'A calculator for the glottochronology formula, and a timeline comparing three recent dates for Proto-Indo-European with the farming-from-Anatolia and steppe hypotheses.',
 research:'Swadesh, M. (1955). Towards greater accuracy in lexicostatistic dating. IJAL 21. · Bergsland, K. & Vogt, H. (1962). On the validity of glottochronology. Current Anthropology 3. · Gray, R. D. & Atkinson, Q. D. (2003). Nature 426. · Bouckaert, R. et al. (2012). Science 337. · Chang, W., Cathcart, C., Hall, D. & Garrett, A. (2015). Language 91. · Haak, W. et al. (2015). Nature 522 (ancient DNA). The debate is open.',
 dur:12,hint:'Move the shared-cognate slider to see the date the formula gives, then press a study to compare their dates.',
 init:()=>({c:74,sel:0}),
 watch(p){return {c:Math.round(90-p*60),sel:Math.min(2,Math.floor(p*3))}},
 ui:[{range:'c',label:'Shared cognates',min:20,max:95,step:1,get:s=>s.c,act:'c',show:v=>v+'%'}],
 on:{c(s,v){s.c=Number(v);return 'keep'},st(s,i){s.sel=Number(i);return 'keep'}},
 draw(s,f,X){
  const t=Math.log(s.c/100)/(2*Math.log(.86));let out=heading('When did the branches split?');
  const gx=c=>60+(c-20)/75*230,gy=v=>170-v/5.5*110;out+=R(40,46,270,150,'#fff',C.grid,8);
  let d='';for(let c=20;c<=95;c++)d+=(c>20?'L':'M')+fmt(gx(c))+' '+fmt(gy(Math.log(c/100)/(2*Math.log(.86))));out+=P(d,C.blue,2.2);
  out+=Ci(gx(s.c),gy(t),6,C.coral,'#fff')+TF(175,190,'shared cognates (%)',12,C.muted)+TF(52,58,'thousand years',12,C.muted,'start');
  out+=R(326,46,254,150,C.pale,'none',10)+TBF(342,72,'Glottochronology',14,C.ink,'start')+TF(342,96,'t = ln c ÷ (2 ln 0.86)',14,C.ink,'start')+TF(342,124,`c = ${s.c}%  →  t ≈ ${t.toFixed(1)} thousand years`,14,C.coral,'start')+L2_lines(342,150,['Assumes every language loses 14%','of the list per thousand years.','Real rates vary a lot.'],12.5,C.muted);
  const x0=60,x1=560,Y0=11000,Y1=4000,tx=y=>x0+(Y0-y)/(Y0-Y1)*(x1-x0);
  out+=R(tx(9500),214,tx(8000)-tx(9500),118,C.greenp,'none',4)+TF((tx(9500)+tx(8000))/2,228,'farming from Anatolia',12,C.green)+R(tx(6500),214,tx(5500)-tx(6500),118,C.amberp,'none',4)+TF((tx(6500)+tx(5500))/2,228,'steppe herders',12,C.amber);
  L2_DATES.forEach(([who,a,b],i)=>{const y=246+i*26,on=i===s.sel;out+=hit(X,'st',i,`${who}: ${a} to ${b} years ago`,R(tx(b),y,tx(a)-tx(b),14,on?C.coral:C.line,'none',4)+TF(tx(b)-6,y+12,who,12,on?C.coral:C.ink,'end'))});
  out+=L(tx(4500),236,tx(4500),326,C.purple,2,'stroke-dasharray="4 4"')+TF(tx(4500)-4,320,'steppe ancestry spreads (aDNA)',12,C.purple,'end');
  out+=L(x0,340,x1,340,C.line,1.5);for(const y of [11000,10000,9000,8000,7000,6000,5000,4000])out+=L(tx(y),336,tx(y),344,C.line,1.5)+TF(tx(y),360,(y/1000)+'k',12,C.muted);
  out+=TF(300,376,'years ago',12,C.muted);
  const D=L2_DATES[s.sel];
  return {svg:out,phase:`The formula gives ${t.toFixed(1)} thousand years for ${s.c}% shared, but only if the rate is constant, which it is not. ${D[0]}: about ${D[1].toLocaleString('en-GB')}–${D[2].toLocaleString('en-GB')} years ago (${D[3]}). Ancient DNA has moved many researchers towards a steppe origin for most branches; the question is still debated.`};
 }});
