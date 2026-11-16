/* ===================== Music era 2 · Writing music down (500–1600) ===================== */
// Staff steps count white-key letters from middle C: step 0 = C4, 1 = D4, … 7 = C5, −1 = B3.
const M2_W=[0,2,4,5,7,9,11],M2_LET='CDEFGAB';
const M2_mod=(a,n)=>((a%n)+n)%n;
const M2_m=(step,acc=0)=>60+M2_W[M2_mod(step,7)]+12*Math.floor(step/7)+acc;
const M2_name=step=>M2_LET[M2_mod(step,7)]+(4+Math.floor(step/7));
// y of a staff step, given the y of the bottom line and the step that sits on it.
const M2_y=(step,yb,sp,base)=>yb-(step-base)*sp/2;
function M2_lines(x0,x1,yb,sp,n=5,col=C.ink,w=1.4){let o='';for(let i=0;i<n;i++)o+=L(x0,yb-i*sp,x1,yb-i*sp,col,w);return o}
// A modern note: head, stem, flags, dot and ledger lines. beats: 4 semibreve, 2 minim, 1 crotchet, .5 quaver, .25 semiquaver (×1.5 dotted).
function M2_note(x,step,yb,sp,beats,o={}){
 const base=o.base===undefined?2:o.base,n=o.lines||5,top=base+2*(n-1),y=M2_y(step,yb,sp,base),col=o.col||C.ink;
 const dotted=[3,1.5,.75,.375].includes(beats),core=dotted?beats/1.5:beats,hollow=core>=2;let out='';
 for(let s=base-2;s>=step;s-=2)out+=L(x-sp*1.05,M2_y(s,yb,sp,base),x+sp*1.05,M2_y(s,yb,sp,base),col,1.4);
 for(let s=top+2;s<=step;s+=2)out+=L(x-sp*1.05,M2_y(s,yb,sp,base),x+sp*1.05,M2_y(s,yb,sp,base),col,1.4);
 const rx=sp*.64,ry=sp*.45;
 out+=`<ellipse cx="${fmt(x)}" cy="${fmt(y)}" rx="${fmt(rx)}" ry="${fmt(ry)}" transform="rotate(-20 ${fmt(x)} ${fmt(y)})" fill="${hollow?'#fff':col}" stroke="${col}" stroke-width="${hollow?2:1.4}"/>`;
 if(core<4){const up=step<base+4,sx=up?x+rx-1.2:x-rx+1.2,ey=up?y-sp*3.4:y+sp*3.4;out+=L(sx,y,sx,ey,col,1.6);
  const flags=core<=.25?2:core<=.5?1:0;for(let f=0;f<flags;f++){const fy=ey+(up?1:-1)*f*sp*.8;out+=P(`M${fmt(sx)} ${fmt(fy)} q ${fmt(sp*.9)} ${fmt((up?1:-1)*sp*.9)} ${fmt(sp*.6)} ${fmt((up?1:-1)*sp*2)}`,col,1.6)}}
 if(dotted){const dy=M2_mod(step-base,2)===0?-sp*.5:0;out+=Ci(x+rx+sp*.45,y+dy,2.4,col,'none')}
 return out;
}
// Square chant note (punctum).
const M2_punct=(x,y,sp,col=C.ink)=>R(x-sp*.42,y-sp*.42,sp*.84,sp*.84,col,'none',1.5);
// A clef drawn as the letter it grew from, placed on its line.
function M2_clef(x,y,letter,col=C.purple){return R(x-13,y-14,26,28,'#fff',col,6)+TB(x,y+6,letter,18,col)}
// Piano-roll view for timed parts: voices [{ev:[{m,t,d}],col,label}], playhead ph in beats.
function M2_roll(x0,y0,w,h,voices,lo,hi,total,ph,o={}){
 let out=R(x0,y0,w,h,'#fff',C.grid,8);const px=t=>x0+8+(w-16)*t/total,py=m=>y0+h-8-(h-16)*(m-lo)/Math.max(1,hi-lo);
 for(let m=Math.ceil(lo);m<=hi;m++)if(M2_mod(m,12)===0){out+=L(x0+4,py(m),x0+w-4,py(m),C.grid,1,'stroke-dasharray="3 4"')+TF(x0-4,py(m)+4,noteName(m),12,C.muted,'end')}
 if(o.bars)for(let t=0;t<=total;t+=o.bars)out+=L(px(t),y0+4,px(t),y0+h-4,C.grid,1);
 voices.forEach((v,vi)=>{for(const e of v.ev){if(e.m===null||e.m===undefined)continue;const on=ph!=null&&ph>=e.t&&ph<e.t+e.d;
  out+=R(px(e.t)+1,py(e.m)-5+(o.offset?vi*2:0),Math.max(3,px(e.t+e.d)-px(e.t)-2),10,on?v.col:tint(v.col,.55),'none',3)}});
 if(ph!=null&&ph>=0&&ph<=total)out+=L(px(ph),y0+2,px(ph),y0+h-2,C.coral,2.2);
 return out;
}
// Playing: sound is scheduled once with AUDIO.seq; a ctx.every ticker moves the playhead in the state.
function M2_play(s,ctx,events,beatSec,o={}){
 s.tok=(s.tok||0)+1;s.t0=performance.now();s.ph=0;s.playing=true;s.beat=beatSec;
 s.total=events.reduce((a,e)=>Math.max(a,e.t+e.d),0);
 const notes=[];for(const e of events)for(const m of [].concat(e.m))if(m!==null&&m!==undefined)notes.push({hz:midiHz(m),at:e.t*beatSec,dur:Math.max(.08,e.d*beatSec*.92)});
 AUDIO.stopAll();AUDIO.seq(notes,{type:o.type||'triangle',gain:o.gain||.14});ctx.every(40,'tick',s.tok);
}
function M2_tick(s,tok){if(Number(tok)!==s.tok)return 'stop';s.ph=(performance.now()-s.t0)/1000/s.beat;if(s.ph>=s.total){s.playing=false;s.ph=null;return 'stop'}return 'keep'}
function M2_halt(s){s.tok=(s.tok||0)+1;s.playing=false;s.ph=null;AUDIO.stopAll()}
const M2_tone=(m,dur=.6)=>AUDIO.tone(midiHz(m),{dur,type:'triangle',gain:.16});
// A row of piano keys from lo to hi (MIDI). opts.mark(m) → colour or null; opts.label(m) → text.
function M2_keys(X,x0,y0,w,h,lo,hi,o={}){
 const whites=[],blacks=[];for(let m=lo;m<=hi;m++)(M2_W.includes(M2_mod(m,12))?whites:blacks).push(m);
 const xOf={};whites.forEach((m,i)=>xOf[m]=x0+i*w);let out='';
 for(const m of whites){const mk=o.mark&&o.mark(m);out+=hit(X,o.act||'key',m,`${noteName(m)} key`,R(xOf[m],y0,w-2,h,mk||'#fff',C.line,4));
  if(o.label){const lb=o.label(m);if(lb)out+=TF(xOf[m]+w/2-1,y0+h-9,lb,13,mk?'#fff':C.muted)}}
 for(const m of blacks){const x=xOf[m-1]+w*.66,mk=o.mark&&o.mark(m);out+=hit(X,o.act||'key',m,`${noteName(m)} key`,R(x,y0,w*.62,h*.6,mk||C.dark,'none',3))}
 return out;
}

/* ---------- neumes-staff (c. 1025) ---------- */
const M2_UT=[0,1,3,1,2,1],M2_UT_SYL=['Ut','que-','ant','la-','xis',''];
SCENE({id:'neumes-staff',name:'Neumes and the staff',tag:'From shapes to exact pitch',
 definition:'Neumes were marks written above sung words to show the shape of a melody. Guido of Arezzo’s horizontal lines, about 1025, fixed each mark to an exact pitch.',
 example:'With no lines a singer could see that the tune went up, but not how far. Guido drew a red line for F and a yellow line for C; with four lines every pitch could be read straight from the page.',
 desc:'The same six-note phrase drawn first as neumes floating above the words, then on one, two and four lines; pale bands show how uncertain each pitch is.',
 research:'Guido of Arezzo (c. 1025). Prologus in antiphonarium; Hiley (1993). Western Plainchant: A Handbook.',
 dur:10,hint:'Choose how many lines to draw. Press a note to hear it, or Play the phrase. Watch how the uncertainty bands shrink.',
 init:()=>({lines:0}),
 watch(p){return {lines:p<.25?0:p<.5?1:p<.75?2:4}},
 ui:[{choose:[[0,'No lines'],[1,'Red F line'],[2,'F and C lines'],[4,'Four lines']],label:'Lines',get:s=>s.lines,act:'lines'},{b:'Play the phrase',act:'play'}],
 on:{lines(s,v){s.lines=Number(v)},note(s,i){M2_tone(M2_m(M2_UT[Number(i)])-12+12)},play(s,a,ctx){M2_play(s,ctx,M2_UT.map((st,i)=>({m:M2_m(st),t:i*.8,d:.8})),.5);return 'keep'},tick(s,tok){return M2_tick(s,tok)}},
 draw(s,f,X){
  const yb=250,sp=18,base=-4,n=s.lines,unc=n===0?3:n===1?2:n===2?1:0;
  let out=heading(n===0?'Neumes: the shape, not the pitch':n===4?'Four lines: every pitch is exact':`${n===1?'One line':'Two lines'}: pitch becomes clearer`);
  if(n===1||n===2)out+=L(70,M2_y(-4,yb,sp,base),540,M2_y(-4,yb,sp,base),C.coral,3)+TF(552,M2_y(-4,yb,sp,base)+4,'F',14,C.coral,'start','font-weight="700"');
  if(n===2)out+=L(70,M2_y(0,yb,sp,base),540,M2_y(0,yb,sp,base),'#d4a017',3)+TF(552,M2_y(0,yb,sp,base)+4,'C',14,C.amber,'start','font-weight="700"');
  if(n===4){out+=M2_lines(70,540,yb,sp,4);out+=M2_clef(92,M2_y(0,yb,sp,base),'C')}
  const playing=s.ph!=null&&s.ph!==undefined?Math.floor(s.ph/.8):-1;
  M2_UT.forEach((st,i)=>{const x=150+i*68,y=M2_y(st,yb,sp,base),on=i===playing;
   if(unc)out+=R(x-9,y-unc*sp/2,18,unc*sp,C.amberp,'none',6,'opacity=".8"');
   const mark=n===0?P(`M${x-11} ${y+5} Q${x-2} ${y-9} ${x+9} ${y+1}`,on?C.coral:C.ink,3.2):M2_punct(x,y,sp,on?C.coral:C.ink);
   out+=hit(X,'note',i,`Note ${i+1}${unc?'':', '+M2_name(st)}`,G(R(x-16,y-16,32,32,'transparent','none',6)+mark));
   if(M2_UT_SYL[i])out+=T(x,320,M2_UT_SYL[i],16,C.ink);
   if(n===4)out+=TF(x,yb+26,M2_name(st),13,C.muted);
  });
  out+=T(300,356,unc?`Each mark could be any of ${2*unc+1} neighbouring pitches`:'Each square sits on exactly one line or space',14,C.muted);
  return {svg:out,phase:n===0?'Early neumes, written from the 800s, rose and fell with the melody but gave no exact pitch: they reminded singers of a tune they already knew.':n===1?'A single red line marks F. Notes on or next to it can now be judged, but notes further away are still guesses.':n===2?'Guido added a yellow line for C. With two fixed pitches, almost every note can be read.':'With four lines and a C clef, a singer could learn an unfamiliar chant straight from the page; Guido claimed it cut training from ten years to one.'};
 }});

const M2_CLEFS={G2:{name:'Treble clef (G on line 2)',letter:'G',line:2,step:4},F4:{name:'Bass clef (F on line 4)',letter:'F',line:4,step:-4},C3:{name:'Alto clef (C on line 3)',letter:'C',line:3,step:0},C4:{name:'Tenor clef (C on line 4)',letter:'C',line:4,step:0}};
const M2_CLEF_OFFS=[0,2,3,5,7,9];
SCENE({id:'neumes-staff-clefs',name:'Clefs',tag:'A letter that names one line',
 definition:'A clef is a letter written on a line of the staff to say which pitch that line stands for. Today’s treble, bass and alto clefs are elaborated forms of the letters G, F and C.',
 example:'The same note head on the bottom line is E in the treble clef, G in the bass clef and F in the alto clef. Change the clef and every name changes with it.',
 desc:'A five-line staff with six fixed note heads; a clef letter sits on one line and the note names underneath change when the clef moves.',
 research:'Guido of Arezzo (c. 1025); Apel (1942). The Notation of Polyphonic Music 900–1600.',
 dur:9,hint:'Choose a clef and press the notes to hear them. The heads never move; only their names and pitches do.',
 init:()=>({clef:'G2'}),
 watch(p){return {clef:['G2','F4','C3','C4'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:Object.keys(M2_CLEFS).map(k=>[k,M2_CLEFS[k].letter+' on line '+M2_CLEFS[k].line]),label:'Clef',get:s=>s.clef,act:'clef'}],
 on:{clef(s,v){s.clef=v},note(s,i){const c=M2_CLEFS[s.clef],base=c.step-2*(c.line-1);M2_tone(M2_m(base+M2_CLEF_OFFS[Number(i)]))}},
 draw(s,f,X){
  const c=M2_CLEFS[s.clef],yb=230,sp=16,base=c.step-2*(c.line-1);let out=heading(c.name);
  out+=M2_lines(60,540,yb,sp);out+=M2_clef(90,yb-(c.line-1)*sp,c.letter);
  out+=arrow(118,yb-(c.line-1)*sp,140,yb-(c.line-1)*sp,C.purple,2,7)+TF(146,yb-(c.line-1)*sp-10,`this line is ${M2_name(c.step)}`,13,C.purple,'start');
  M2_CLEF_OFFS.forEach((off,i)=>{const st=base+off,x=230+i*55;out+=hit(X,'note',i,`Note ${i+1}: ${M2_name(st)}`,G(R(x-14,M2_y(st,yb,sp,base)-14,28,28,'transparent','none',6)+M2_note(x,st,yb,sp,1,{base})));
   out+=TB(x,yb+56,M2_name(st),15,C.blue)+TF(x,yb+74,Math.round(midiHz(M2_m(st)))+' Hz',13,C.muted)});
  out+=T(300,350,'Same heads, same lines: the clef alone decides the pitches',14,C.muted);
  return {svg:out,phase:`The ${c.letter} clef marks line ${c.line} as ${M2_name(c.step)}. Everything else is counted up and down from it, one line or space per letter.`};
 }});

const M2_READ=[0,2,4,5,4,2,1,0];
SCENE({id:'neumes-staff-read',name:'Reading a melody',tag:'Up the staff is up in pitch',
 definition:'On a staff, higher on the page means higher in pitch: each line and each space is the next letter name.',
 example:'C E G A G E D C climbs from a line below the staff, peaks on the second space and returns. You can see the arch before you hear it.',
 desc:'An eight-note melody on a treble staff with a moving playhead; note names can be shown or hidden.',
 research:'Guido of Arezzo (c. 1026). Micrologus; modern staff notation as standardised by the 1600s (Apel 1942).',
 dur:10,hint:'Press notes to hear them, or Play the melody and follow the playhead. Hide the names to practise reading.',
 init:()=>({names:1}),
 watch(p){return {names:p>.5?1:0,ph:clamp(p*1.1,0,1)*8}},
 ui:[{choose:[[1,'Show names'],[0,'Hide names']],label:'Names',get:s=>s.names,act:'names'},{b:'Play the melody',act:'play'}],
 on:{names(s,v){s.names=Number(v)},note(s,i){M2_tone(M2_m(M2_READ[Number(i)]))},play(s,a,ctx){M2_play(s,ctx,M2_READ.map((st,i)=>({m:M2_m(st),t:i,d:1})),.45);return 'keep'},tick(s,tok){return M2_tick(s,tok)}},
 draw(s,f,X){
  const yb=230,sp=16;let out=heading('Higher on the staff, higher in pitch');out+=M2_lines(60,560,yb,sp)+M2_clef(86,yb-sp,'G');
  const ph=s.ph==null?-1:s.ph;
  M2_READ.forEach((st,i)=>{const x=150+i*52,on=ph>=i&&ph<i+1,col=on?C.coral:C.ink;
   out+=hit(X,'note',i,`Note ${i+1}: ${M2_name(st)}`,G(R(x-14,M2_y(st,yb,sp,2)-14,28,28,'transparent','none',6)+M2_note(x,st,yb,sp,1,{col})));
   if(s.names)out+=TB(x,yb+52,M2_LET[M2_mod(st,7)],16,on?C.coral:C.blue)});
  if(ph>=0)out+=L(150+ph*52-26,80,150+ph*52-26,yb+30,C.coral,1.6,'stroke-dasharray="4 4"');
  out+=T(300,345,'A ledger line extends the staff downwards for middle C',14,C.muted);
  return {svg:out,phase:'The melody arches up and back down, and the note heads draw the same arch on the page. Each step up is the next letter: C, D, E, F, G, A, B, then C again.'};
 }});

/* ---------- solmisation (c. 1030) ---------- */
const M2_HYMN=[['UT','Ut queant laxis'],['RE','Resonare fibris'],['MI','Mira gestorum'],['FA','Famuli tuorum'],['SOL','Solve polluti'],['LA','Labii reatum']];
SCENE({id:'solmisation',name:'Solmisation',tag:'Ut, re, mi, fa, sol, la',
 definition:'Solmisation names the notes of a scale with sung syllables. Guido took ut, re, mi, fa, sol and la from a hymn whose lines each begin one step higher.',
 example:'Ut was later replaced by do. A seventh syllable, si (from Sancte Iohannes, the hymn’s last line), was added; English tonic sol-fa changed it to te or ti.',
 desc:'A staircase of six steps, one for each line of the hymn to St John, labelled with its syllable, its words and its starting note C to A.',
 research:'Guido of Arezzo (c. 1030). Epistola de ignoto cantu (letter to Brother Michael).',
 dur:9,hint:'Press a step to hear the note that line of the hymn starts on, or Play the whole ladder.',
 init:()=>({lit:-1}),
 watch(p){return {lit:Math.min(5,Math.floor(p*6))}},
 ui:[{b:'Play the ladder',act:'play'}],
 on:{step(s,i){s.lit=Number(i);M2_tone(M2_m(Number(i)))},play(s,a,ctx){M2_play(s,ctx,range(6).map(i=>({m:M2_m(i),t:i,d:1})),.45);return 'keep'},tick(s,tok){const r=M2_tick(s,tok);s.lit=s.ph==null?-1:Math.min(5,Math.floor(s.ph));return r}},
 draw(s,f,X){
  let out=heading('Each line of the hymn starts one step higher');
  M2_HYMN.forEach(([syl,words],i)=>{const x=60+i*84,y=300-i*38,on=s.lit===i;
   out+=hit(X,'step',i,`${syl}: ${words}, starts on ${M2_name(i)}`,G(R(x,y,80,38,on?C.blue:C.pale,'none',6)+TB(x+40,y+25,syl,17,on?'#fff':C.ink)));
   out+=TF(x+40,y+56,M2_name(i).slice(0,1),14,on?C.blue:C.muted,'middle','font-weight="700"');
   out+=TF(x+2,y-8,words,13,on?C.ink:C.muted,'start','font-style="italic"')});
  out+=T(300,54,'The syllables name positions in a scale, not fixed frequencies',13,C.muted);
  return {svg:out,phase:s.lit>=0?`${M2_HYMN[s.lit][0]}: “${M2_HYMN[s.lit][1]}” begins on ${M2_name(s.lit).slice(0,1)}. Singers learned the sound of each step by remembering the line that starts on it.`:'Guido taught singers to remember how each step sounds by linking it to a familiar hymn line. The syllables became ut, re, mi, fa, sol, la.'};
 }});

// The medieval gamut on the hand: 20 notes, simplified positions following the traditional spiral.
const M2_GAMUT=[['Γ ut',43],['A re',45],['B mi',47],['C fa ut',48],['D sol re',50],['E la mi',52],['F fa ut',53],['G sol re ut',55],['a la mi re',57],['b fa / ♮ mi',58],['c sol fa ut',60],['d la sol re',62],['e la mi',64],['f fa ut',65],['g sol re ut',67],['aa la mi re',69],['bb fa / ♮♮ mi',70],['cc sol fa',72],['dd la sol',74],['ee la',76]];
const M2_HAND_POS=[[140,182],[158,206],[178,230],[198,254],[232,206],[292,206],[352,206],[410,206],[410,162],[410,118],[410,74],[352,70],[292,66],[232,74],[232,118],[232,162],[292,162],[352,162],[352,118],[292,118]];
SCENE({id:'solmisation-hand',name:'The Guidonian hand',tag:'A keyboard you carry with you',
 definition:'Medieval teachers mapped the twenty notes of the gamut, from low G (gamma ut) to high E, onto the joints of the left hand, so a singer could point to a note.',
 example:'Pointing to the thumb tip meant gamma ut, the lowest note, which is where the word “gamut” comes from. A choirmaster could show a melody silently, joint by joint.',
 desc:'An outline of a left hand with twenty numbered joints in a spiral; the selected joint shows its medieval name and its pitch.',
 research:'Attributed to Guido of Arezzo (11th century); Berger (1981). “The hand and the art of memory”, Musica Disciplina 35.',
 dur:10,hint:'Press a joint to hear its note and see its medieval name. Follow the spiral from the thumb.',
 init:()=>({j:0}),
 watch(p){return {j:Math.min(19,Math.floor(p*20))}},
 on:{joint(s,i){s.j=Number(i);M2_tone(M2_GAMUT[s.j][1])}},
 draw(s,f,X){
  let out=heading('The gamut on the left hand (simplified)');
  out+=R(205,190,230,130,C.pale,C.line,26);for(const [x0,x1] of [[214,250],[274,310],[334,370],[392,428]])out+=R(x0,52,x1-x0,170,C.pale,C.line,16);
  out+=P('M200 268 L128 176 Q122 160 138 156 L210 222',C.line,2,C.pale);
  for(let i=1;i<20;i++){const a=M2_HAND_POS[i-1],b=M2_HAND_POS[i];out+=L(a[0],a[1],b[0],b[1],C.grid,1.4,'stroke-dasharray="3 4"')}
  M2_HAND_POS.forEach(([x,y],i)=>{const on=i===s.j;out+=hit(X,'joint',i,`Joint ${i+1}: ${M2_GAMUT[i][0]}`,G(Ci(x,y,on?13:10,on?C.blue:'#fff',on?C.blue:C.muted)+TF(x,y+4,i+1,12,on?'#fff':C.ink)))});
  const g=M2_GAMUT[s.j];out+=R(456,120,130,92,'#fff',C.grid,10)+TBF(521,148,g[0],15,C.blue)+TF(521,172,noteName(g[1]).replace('♯','#'),14,C.ink)+TF(521,194,Math.round(midiHz(g[1]))+' Hz',13,C.muted);
  out+=T(300,360,'Positions follow the traditional spiral, simplified',13,C.muted);
  return {svg:out,phase:`${s.j+1}. ${g[0]}: the syllables list each hexachord this note belongs to, so a singer knew how to move from one six-note set to the next.`};
 }});

const M2_MOV=[0,1,2,0,2,3,4],M2_KEYS={C:0,G:4,F:3,D:1},M2_FIXED=['do','re','mi','fa','sol','la','si'],M2_MOVSYL=['do','re','mi','fa','so','la','ti'];
SCENE({id:'solmisation-movable',name:'Movable and fixed do',tag:'Syllables for steps, or for pitches',
 definition:'In movable do the home note of any key is called do, so the syllables name scale steps. In fixed do, used in France, Italy and Spain, do always means C.',
 example:'The same tune in G is do re mi do mi fa so in movable do, but sol la si sol si do re in fixed do.',
 desc:'A short tune on a staff in a chosen key, with two rows of syllables underneath: movable do, which stays the same, and fixed do, which changes with the key.',
 research:'Curwen (1843). Grammar of Vocal Music (tonic sol-fa); Glover (1835). Scheme for Rendering Psalmody Congregational.',
 dur:9,hint:'Choose a key and Play. Watch which row of syllables changes and which stays the same.',
 init:()=>({key:'G'}),
 watch(p){return {key:['C','G','F','D'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:Object.keys(M2_KEYS).map(k=>[k,'Key of '+k]),label:'Key',get:s=>s.key,act:'key'},{b:'Play',act:'play'}],
 on:{key(s,v){s.key=v},play(s,a,ctx){const k=M2_KEYS[s.key];M2_play(s,ctx,M2_MOV.map((d,i)=>({m:M2_m(d+k)+(s.key==='F'&&M2_mod(d+k,7)===6?-1:0)+(s.key==='G'&&M2_mod(d+k,7)===3?1:0)+(s.key==='D'&&[0,3].includes(M2_mod(d+k,7))?1:0),t:i,d:1})),.45);return 'keep'},tick(s,tok){return M2_tick(s,tok)}},
 draw(s,f,X){
  const k=M2_KEYS[s.key],yb=200,sp=14;let out=heading(`The same tune in ${s.key} major`);
  out+=M2_lines(50,560,yb,sp)+M2_clef(74,yb-sp,'G');
  const acc=st=>{const l=M2_mod(st,7);return s.key==='G'&&l===3?'♯':s.key==='D'&&(l===3||l===0)?'♯':s.key==='F'&&l===6?'♭':''};
  const ph=s.ph==null?-1:s.ph;
  M2_MOV.forEach((d,i)=>{const st=d+k,x=140+i*58,on=ph>=i&&ph<i+1;out+=M2_note(x,st,yb,sp,1,{col:on?C.coral:C.ink});const a=acc(st);if(a)out+=TF(x-15,M2_y(st,yb,sp,2)+5,a,15,on?C.coral:C.ink,'middle');
   out+=TB(x,268,M2_MOVSYL[d],16,C.blue)+TB(x,306,M2_FIXED[M2_mod(st,7)],16,C.purple)});
  out+=TF(40,268,'movable',13,C.blue,'start')+TF(40,306,'fixed',13,C.purple,'start');
  out+=T(300,350,'Movable do follows the key; fixed do follows the letter names',13,C.muted);
  return {svg:out,phase:s.key==='C'?'In C the two systems agree. Choose another key to see them part company.':`In ${s.key}, movable do still sings do re mi do mi fa so, because the tune’s shape is unchanged; fixed do renames every note after its letter.`};
 }});

/* ---------- note-values (c. 1260 → today) ---------- */
const M2_VALUES=[['Semibreve',4,'whole note'],['Minim',2,'half note'],['Crotchet',1,'quarter note'],['Quaver',.5,'eighth note'],['Semiquaver',.25,'sixteenth note']];
SCENE({id:'note-values',name:'Note values',tag:'How long each note lasts',
 definition:'A note’s shape shows its length. Each value is half the one before: a semibreve lasts as long as two minims, four crotchets, eight quavers or sixteen semiquavers.',
 example:'If the crotchet is the beat, a minim lasts two beats and a quaver half a beat. (In US usage these are the whole, half, quarter, eighth and sixteenth notes.)',
 desc:'Five rows filling the same four beats: one semibreve, two minims, four crotchets, eight quavers and sixteen semiquavers, with a playhead moving across.',
 research:'Franco of Cologne (c. 1280). Ars cantus mensurabilis; modern values standardised by c. 1600 (Apel 1942).',
 dur:10,hint:'Choose a row and Play: you hear the crotchet beat low and the chosen value high, together.',
 init:()=>({row:2}),
 watch(p){return {row:Math.min(4,Math.floor(p*5)),ph:(p*5%1)*4}},
 ui:[{choose:M2_VALUES.map((v,i)=>[i,v[0]]),label:'Value',get:s=>s.row,act:'row'},{b:'Play with the beat',act:'play'}],
 on:{row(s,v){s.row=Number(v)},play(s,a,ctx){const len=M2_VALUES[s.row][1],ev=range(4).map(i=>({m:48,t:i,d:.3}));for(let t=0;t<4-1e-9;t+=len)ev.push({m:72,t,d:Math.min(len,.9)});M2_play(s,ctx,ev,.6,{type:'sine'});return 'keep'},tick(s,tok){return M2_tick(s,tok)}},
 draw(s,f,X){
  let out=heading('Each value is half the one above');const x0=190,w=360,ph=s.ph==null?-1:s.ph;
  M2_VALUES.forEach(([nm,len,us],r)=>{const y=80+r*56,on=r===s.row;out+=R(20,y-24,560,48,on?C.pale:'transparent','none',8);
   out+=TB(30,y+2,nm,15,on?C.blue:C.ink,'start')+TF(30,y+19,`${len===4?'4 beats':len+(len===1?' beat':' of a beat').replace('0.5 of a beat','½ beat').replace('0.25 of a beat','¼ beat').replace('2 of a beat','2 beats')}`,13,C.muted,'start');
   const n=4/len;for(let i=0;i<n;i++){const x=x0+w*(i+.5)/n,lit=on&&ph>=i*len&&ph<(i+1)*len;out+=M2_note(x,4,y+12,10,len,{base:4,lines:1,col:lit?C.coral:C.ink})}});
  for(let b=0;b<=4;b++)out+=L(x0+w*b/4,56,x0+w*b/4,340,C.grid,1,'stroke-dasharray="3 5"');
  if(ph>=0)out+=L(x0+w*ph/4,56,x0+w*ph/4,340,C.coral,2);
  const v=M2_VALUES[s.row];
  return {svg:out,phase:`${v[0]} (US: ${v[2]}): ${4/v[1]} in the time of one semibreve. Hollow heads are the longer values; flags halve the length each time.`};
 }});

const M2_ADD=[['Semibreve',4],['Dotted minim',3],['Minim',2],['Dotted crotchet',1.5],['Crotchet',1],['Quaver',.5],['Semiquaver',.25]];
const M2_TS={'2/4':2,'3/4':3,'4/4':4,'6/8':3};
SCENE({id:'note-values-bar',name:'Filling a bar',tag:'Time signatures and dots',
 definition:'A time signature says how many beats fill each bar. A dot after a note adds half its value again, so a dotted minim lasts three crotchets.',
 example:'In 3/4 a bar holds three crotchets: a dotted minim fills it exactly, but a semibreve will not fit.',
 desc:'A one-bar staff that fills with the notes the learner chooses, a meter showing beats used against beats available, and a warning if the bar overflows.',
 research:'Franco of Cologne (c. 1280); time signatures and bar lines in general use by the 1600s (Apel 1942).',
 dur:10,hint:'Choose a time signature, add notes, and Play the bar. Try to fill it exactly without overflowing.',
 init:()=>({ts:'3/4',notes:[3,1]}),
 watch(p){const k=Math.min(4,Math.floor(p*5));return {ts:'4/4',notes:[2,1,.5,.5].slice(0,k)}},
 ui:[{choose:Object.keys(M2_TS).map(k=>[k,k]),label:'Time signature',get:s=>s.ts,act:'ts'},...M2_ADD.map(([nm,v])=>({b:'+ '+nm,act:'add',arg:v})),{b:'Undo',act:'undo'},{b:'Play the bar',act:'play'}],
 on:{ts(s,v){s.ts=v},add(s,v){if(s.notes.length<12)s.notes=s.notes.concat(Number(v))},undo(s){s.notes=s.notes.slice(0,-1)},
  play(s,a,ctx){let t=0;const ev=[];s.notes.forEach((d,i)=>{ev.push({m:M2_m([4,5,6,7,6,5,4,2,4,5,4,2][i%12]),t,d});t+=d});M2_play(s,ctx,ev,.5);return 'keep'},tick(s,tok){return M2_tick(s,tok)}},
 draw(s,f,X){
  const cap=s.ts==='6/8'?3:M2_TS[s.ts],used=sum(s.notes),yb=200,sp=14;let out=heading(`${s.ts}: ${s.ts==='6/8'?'six quavers (two dotted crotchet beats)':cap+' crotchet beats'} per bar`);
  out+=M2_lines(60,540,yb,sp)+M2_clef(84,yb-sp,'G');const [tn,td]=s.ts.split('/');out+=TB(120,yb-2*sp-4,tn,20)+TB(120,yb-4,td,20);
  out+=L(540,yb,540,yb-4*sp,C.ink,2);
  let t=0;const ph=s.ph==null?-1:s.ph;const scale=380/Math.max(cap,used);
  s.notes.forEach((d,i)=>{const x=150+(t+d*.2)*scale,over=t+d>cap+1e-9,on=ph>=t&&ph<t+d;out+=M2_note(x,[4,5,6,7,6,5,4,2,4,5,4,2][i%12],yb,sp,d,{col:on?C.coral:over?C.coral:C.ink});t+=d});
  const cw=380;out+=R(110,262,cw,22,'#fff',C.grid,6)+R(110,262,cw*Math.min(1,used/cap),22,used>cap+1e-9?C.coral:Math.abs(used-cap)<1e-9?C.green:C.blue,'none',6);
  out+=TB(300,310,Math.abs(used-cap)<1e-9?`Full: ${fmt(used)} of ${cap} beats ✓`:used>cap?`Overflow: ${fmt(used)} beats in a ${cap}-beat bar`:`${fmt(used)} of ${cap} beats used`,16,used>cap+1e-9?C.coral:Math.abs(used-cap)<1e-9?C.green:C.ink);
  out+=T(300,348,s.ts==='6/8'?'In 6/8 the beat is a dotted crotchet: two beats of three quavers each':'Beats counted in crotchets',13,C.muted);
  return {svg:out,phase:Math.abs(used-cap)<1e-9?'The bar adds up exactly. Composers check this the same way: every bar’s values must sum to what the time signature promises.':used>cap?'Too many beats for one bar: the extra time belongs in the next bar, often joined with a tie.':`${fmt(cap-used)} beat${cap-used===1?'':'s'} still to fill. A dot adds half a note’s value again.`};
 }});

SCENE({id:'note-values-mensural',name:'Mensural notation',tag:'Shapes that measure time',
 definition:'Mensural notation, codified by Franco of Cologne around 1280, gave each note shape a length: the long, the breve and the semibreve. Whether each split into three (perfect) or two (imperfect) was set by context.',
 example:'In perfect time a long equals three breves; in imperfect time, two. Our “breve” and “semibreve” are those medieval names, now much longer in practice than they once were.',
 desc:'A tree dividing one long into breves and semibreves, in threes or twos depending on the chosen settings, with the old note shapes drawn at each level.',
 research:'Franco of Cologne (c. 1280). Ars cantus mensurabilis; Apel (1942). The Notation of Polyphonic Music 900–1600.',
 dur:9,hint:'Switch each level between perfect (three) and imperfect (two), then Play: you hear the long, its breves and their semibreves together.',
 init:()=>({modus:3,tempus:3}),
 watch(p){return {modus:p<.5?3:2,tempus:p<.25||(p>=.5&&p<.75)?3:2}},
 ui:[{choose:[[3,'Long = 3 breves'],[2,'Long = 2 breves']],label:'Long',get:s=>s.modus,act:'modus'},{choose:[[3,'Breve = 3 semibreves'],[2,'Breve = 2 semibreves']],label:'Breve',get:s=>s.tempus,act:'tempus'},{b:'Play',act:'play'}],
 on:{modus(s,v){s.modus=Number(v)},tempus(s,v){s.tempus=Number(v)},play(s,a,ctx){const n=s.modus*s.tempus,ev=[{m:48,t:0,d:n*.98}];for(let b=0;b<s.modus;b++)ev.push({m:55,t:b*s.tempus,d:s.tempus*.9});for(let k=0;k<n;k++)ev.push({m:67,t:k,d:.8});M2_play(s,ctx,ev,.4,{type:'sine'});return 'keep'},tick(s,tok){return M2_tick(s,tok)}},
 draw(s,f,X){
  const n=s.modus*s.tempus,ph=s.ph==null?-1:s.ph;let out=heading(`One long = ${s.modus} breves = ${n} semibreves`);
  const x0=70,w=460,unit=w/n;const longShape=(x,y,col)=>R(x-12,y-9,24,18,col,'none',1)+L(x+11,y,x+11,y+26,col,2.4),breve=(x,y,col)=>R(x-11,y-8,22,16,col,'none',1),semi=(x,y,col)=>`<polygon points="${fmt(x)},${fmt(y-10)} ${fmt(x+8)},${fmt(y)} ${fmt(x)},${fmt(y+10)} ${fmt(x-8)},${fmt(y)}" fill="${col}"/>`;
  out+=longShape(300,82,ph>=0?C.coral:C.ink)+TF(330,86,'long (longa)',13,C.muted,'start');
  for(let b=0;b<s.modus;b++){const cx=x0+(b+.5)*s.tempus*unit,on=ph>=b*s.tempus&&ph<(b+1)*s.tempus;out+=L(300,96,cx,150,C.grid,1.5)+breve(cx,160,on?C.coral:C.ink);
   for(let k=0;k<s.tempus;k++){const i=b*s.tempus+k,sx=x0+(i+.5)*unit,on2=ph>=i&&ph<i+1;out+=L(cx,170,sx,232,C.grid,1.2)+semi(sx,244,on2?C.coral:C.ink)}}
  out+=TF(x0,170,'breve (brevis)',13,C.muted,'start')+TF(x0,276,'semibreve (semibrevis)',13,C.muted,'start');
  out+=R(140,296,320,40,s.modus===3&&s.tempus===3?C.purplep:C.pale,'none',8)+TB(300,322,`${s.modus===3?'perfect':'imperfect'} long · ${s.tempus===3?'perfect':'imperfect'} breve`,15,C.ink);
  return {svg:out,phase:'Franco’s rule was that the shape tells you the kind of note, and the surrounding notes tell you whether it splits in three or two. Triple division was the default, called perfect.'};
 }});

/* ---------- modes (800s–1547) ---------- */
const M2_MODES=[['Dorian',1,5],['Phrygian',2,5],['Lydian',3,7],['Mixolydian',4,8],['Aeolian',5,9],['Ionian',0,4]];
const M2_modeTenor={Dorian:5,Phrygian:7,Lydian:7,Mixolydian:8,Aeolian:9,Ionian:4};
SCENE({id:'modes',name:'Church modes',tag:'Seven notes, different starting points',
 definition:'A mode is a scale defined by where its tones and semitones fall. The church modes use only the white keys, so each mode’s character comes from which note is home.',
 example:'Dorian runs D to D, with the semitones between 2 and 3 and between 6 and 7. Aeolian (A to A) and Ionian (C to C) were added by Glarean in 1547 and became our minor and major.',
 desc:'Two octaves of keys with the chosen mode highlighted from its final, and a row of T and S marks showing the pattern of tones and semitones.',
 research:'Glarean (1547). Dodecachordon; Hiley (1993). Western Plainchant: A Handbook.',
 dur:10,hint:'Choose a mode and Play its scale, or press keys to hear notes. Compare where the S (semitone) marks fall.',
 init:()=>({mode:'Dorian'}),
 watch(p){return {mode:M2_MODES[Math.min(5,Math.floor(p*6))][0]}},
 ui:[{choose:M2_MODES.map(m=>[m[0],m[0]]),label:'Mode',get:s=>s.mode,act:'mode'},{b:'Play the scale',act:'play'}],
 on:{mode(s,v){s.mode=v},key(s,m){M2_tone(Number(m))},play(s,a,ctx){const st=M2_MODES.find(m=>m[0]===s.mode)[1];M2_play(s,ctx,range(8).map(i=>({m:M2_m(st+i),t:i,d:1})),.42);return 'keep'},tick(s,tok){return M2_tick(s,tok)}},
 draw(s,f,X){
  const md=M2_MODES.find(m=>m[0]===s.mode),st=md[1],scale=range(8).map(i=>M2_m(st+i)),ph=s.ph==null?-1:s.ph;
  let out=heading(`${s.mode}: ${M2_LET[st]} to ${M2_LET[st]} on the white keys`);
  out+=M2_keys(X,40,70,37,130,60,83,{mark:m=>{const i=scale.indexOf(m);return i<0?null:(ph>=i&&ph<i+1?C.coral:i===0||i===7?C.blue:C.purplep)},label:m=>M2_W.includes(M2_mod(m,12))?M2_LET[M2_W.indexOf(M2_mod(m,12))]:''});
  for(let i=0;i<7;i++){const semi=scale[i+1]-scale[i]===1,x=70+i*68;out+=R(x,238,56,34,semi?C.coralp:C.pale,semi?C.coral:'none',8)+TB(x+28,261,semi?'S':'T',16,semi?C.coral:C.ink);out+=TF(x+28,288,`${M2_LET[M2_mod(st+i,7)]}–${M2_LET[M2_mod(st+i+1,7)]}`,13,C.muted)}
  out+=T(300,330,`Final (home): ${M2_LET[st]} · reciting tone: ${M2_LET[M2_mod(M2_modeTenor[s.mode],7)]}`,15,C.ink)+T(300,356,'T = tone (two semitones) · S = semitone',13,C.muted);
  return {svg:out,phase:`The pattern for ${s.mode} is ${range(7).map(i=>scale[i+1]-scale[i]===1?'S':'T').join(' ')}. Moving the starting note moves the semitones, and that changes how the music feels.`};
 }});

const M2_TUNE=[0,1,2,4,3,2,1,0];
SCENE({id:'modes-melody',name:'Final and reciting tone',tag:'Home and the note you chant on',
 definition:'Each mode has a final, where melodies come to rest, and a reciting tone (tenor), the note on which much of a psalm is chanted.',
 example:'In Dorian the final is D and the reciting tone is A. In Phrygian the reciting tone moved up to C, avoiding B, so the pattern is not always a fifth above.',
 desc:'The same melodic shape sung in each authentic mode from its final, drawn as a line over a ladder of notes; the final and reciting tone are marked.',
 research:'Hiley (1993). Western Plainchant; Powers (2001). “Mode”, Grove Music Online.',
 dur:10,hint:'Choose a mode and Play the same tune shape. The steps are identical; only the semitones move.',
 init:()=>({mode:'Dorian'}),
 watch(p){return {mode:M2_MODES[Math.min(5,Math.floor(p*6))][0],ph:(p*6%1)*8}},
 ui:[{choose:M2_MODES.map(m=>[m[0],m[0]]),label:'Mode',get:s=>s.mode,act:'mode'},{b:'Play the tune',act:'play'}],
 on:{mode(s,v){s.mode=v},play(s,a,ctx){const st=M2_MODES.find(m=>m[0]===s.mode)[1];M2_play(s,ctx,M2_TUNE.map((d,i)=>({m:M2_m(st+d),t:i,d:i===7?1.6:1})),.42);return 'keep'},tick(s,tok){return M2_tick(s,tok)}},
 draw(s,f,X){
  const md=M2_MODES.find(m=>m[0]===s.mode),st=md[1],ten=M2_modeTenor[s.mode],ph=s.ph==null?-1:s.ph;
  let out=heading(`${s.mode}: final ${M2_LET[st]}, reciting tone ${M2_LET[M2_mod(ten,7)]}`);
  const yOf=d=>300-d*30,x0=110;
  for(let d=0;d<=7;d++){const y=yOf(d),isF=d===0||d===7,isT=st+d===ten,semi=M2_m(st+d+1)-M2_m(st+d)===1&&d<7;
   out+=L(x0,y,560,y,isF?C.blue:isT?C.purple:C.grid,isF||isT?2.4:1.2)+TF(x0-12,y+5,M2_LET[M2_mod(st+d,7)],14,isF?C.blue:isT?C.purple:C.muted,'end','font-weight="700"');
   if(semi)out+=R(60,y-30,14,30,C.coralp,'none',4)+TF(54,y-12,'S',13,C.coral,'end')}
  const pts=M2_TUNE.map((d,i)=>[150+i*55,yOf(d)]);out+=P('M'+pts.map(p=>p.map(fmt).join(' ')).join(' L'),C.ink,2.4);
  pts.forEach(([x,y],i)=>out+=Ci(x,y,ph>=i&&ph<i+1?9:6,ph>=i&&ph<i+1?C.coral:C.ink));
  out+=TF(560,yOf(0)+18,'final',13,C.blue,'end')+TF(560,yOf(ten-st)-8,'reciting tone',13,C.purple,'end');
  return {svg:out,phase:`The tune climbs a fourth and comes home. In ${s.mode} the semitones (marked S) fall in different places from other modes, so the same shape sounds brighter or darker.`};
 }});

// Maqam Rast on C: C D E-half-flat F G A B-half-flat C. Neutral steps are about three quarter tones.
const M2_RAST=[0,2,3.5,5,7,9,10.5,12],M2_IONIAN=[0,2,4,5,7,9,11,12];
SCENE({id:'modes-maqam',name:'Maqam',tag:'Not just another mode',
 definition:'A maqam (plural maqamat) is a melodic system of Arabic, Turkish and related music. Like a mode it has a characteristic set of pitches, but it also has typical phrases, a path through its range and intervals between the Western semitone and tone.',
 example:'Maqam Rast on C has an E and a B lowered by roughly a quarter tone, giving “neutral” thirds and sevenths that a piano cannot play.',
 desc:'A ruler in quarter tones from C to C, with the notes of Ionian (major) above and maqam Rast below; Rast’s E and B fall between piano keys.',
 research:'Congress of Arab Music, Cairo (1932); d’Erlanger (1930–1959). La musique arabe; Marcus (1989). Arab music theory in the modern period.',
 dur:9,hint:'Play Ionian, then Rast. Listen for the E and the B. The 24-quarter-tone ruler is a theoretical convenience: performers’ intonation varies by region and phrase.',
 init:()=>({which:'rast'}),
 watch(p){return {which:p<.5?'ionian':'rast'}},
 ui:[{choose:[['ionian','Ionian (major)'],['rast','Maqam Rast']],label:'Scale',get:s=>s.which,act:'which'},{b:'Play',act:'play'}],
 on:{which(s,v){s.which=v},play(s,a,ctx){const sc=s.which==='rast'?M2_RAST:M2_IONIAN;M2_play(s,ctx,sc.map((q,i)=>({m:60+q,t:i,d:1})),.45,{type:'sine'});return 'keep'},tick(s,tok){return M2_tick(s,tok)}},
 draw(s,f,X){
  let out=heading('Ionian against maqam Rast, both on C');const x0=60,w=480,xq=q=>x0+w*q/12,ph=s.ph==null?-1:s.ph;
  for(let q=0;q<=24;q++){const x=xq(q/2),major=q%2===0;out+=L(x,170,x,major?200:188,major?C.ink:C.line,major?1.6:1)}
  out+=L(x0,185,x0+w,185,C.line,2);
  const names=['C','D','E','F','G','A','B','C'],rnames=['C','D','E½♭','F','G','A','B½♭','C'];
  M2_IONIAN.forEach((q,i)=>{const on=s.which==='ionian'&&ph>=i&&ph<i+1;out+=Ci(xq(q),130,on?13:10,on?C.coral:s.which==='ionian'?C.blue:C.pale,C.blue)+TF(xq(q),104,names[i],13,C.blue)});
  M2_RAST.forEach((q,i)=>{const on=s.which==='rast'&&ph>=i&&ph<i+1,neutral=q%1!==0;out+=Ci(xq(q),240,on?13:10,on?C.coral:s.which==='rast'?(neutral?C.purple:C.green):C.pale,neutral?C.purple:C.green)+TF(xq(q),272,rnames[i],13,neutral?C.purple:C.green)});
  out+=TF(x0-6,134,'Ionian',13,C.blue,'end')+TF(x0-6,244,'Rast',13,C.green,'end');
  out+=R(90,300,420,52,C.purplep,'none',8)+T(300,322,'E and B sit about a quarter tone below the piano’s E and B',14,C.ink)+T(300,342,'A maqam is also defined by its phrases, not only its notes',13,C.muted);
  return {svg:out,phase:s.which==='rast'?'Rast’s third and seventh are “neutral”, neither major nor minor. Musicians shape them by ear, and the exact size differs between, for example, Egyptian and Syrian practice.':'Ionian is the white-key scale from C, which became the major scale. Switch to Rast to hear the notes between the keys.'};
 }});

/* ---------- canon-round (c. 1250) ---------- */
// A round in C: the well-known “Frère Jacques” (traditional), 8 bars of 4 beats.
const M2_FJ=(()=>{const b=[[0,1],[1,1],[2,1],[0,1]],c=[[2,1],[3,1],[4,2]],d=[[4,.5],[5,.5],[4,.5],[3,.5],[2,1],[0,1]],e=[[0,1],[-3,1],[0,2]];const ev=[];let t=0;for(const bar of [b,b,c,c,d,d,e,e])for(const [st,du] of bar){ev.push({m:M2_m(st),t,d:du});t+=du}return ev})();
const M2_VCOL=[C.blue,C.coral,C.green,C.purple];
const M2_voices=n=>range(n).map(v=>M2_FJ.map(e=>({...e,t:e.t+8*v})));
SCENE({id:'canon-round',name:'Canon and round',tag:'One tune, staggered entries',
 definition:'In a canon, voices sing the same melody starting at different times. A round is a canon that loops, so each voice starts again when it reaches the end.',
 example:'“Sumer is icumen in”, copied about 1250, is the oldest surviving round, for four voices over two more singing a repeating bass. “Frère Jacques” works the same way: each voice enters two bars later.',
 desc:'A piano-roll with up to four rows, one for each voice, entering two bars apart; a playhead shows which notes sound together.',
 research:'“Sumer is icumen in”, British Library MS Harley 978 (c. 1250); Mann (1958). The Study of Fugue.',
 dur:12,hint:'Choose how many voices and Play. Each new voice enters two bars after the one before.',
 init:()=>({n:3}),
 watch(p){return {n:4,ph:p*56}},
 ui:[{range:'n',label:'Voices',min:1,max:4,get:s=>s.n,act:'n'},{b:'Play',act:'play'}],
 on:{n(s,v){s.n=v},play(s,a,ctx){M2_play(s,ctx,M2_voices(s.n).flat(),.3);return 'keep'},tick(s,tok){return M2_tick(s,tok)}},
 draw(s,f,X){
  const total=32+8*(s.n-1),ph=s.ph==null?null:s.ph;let out=heading(`${s.n} voice${s.n>1?'s':''}, each entering two bars later`);
  range(s.n).forEach(v=>{out+=M2_roll(80,56+v*72,500,62,[{ev:M2_voices(4)[v],col:M2_VCOL[v]}],52,69,56,ph,{bars:4})+TF(72,92+v*72,'voice '+(v+1),13,M2_VCOL[v],'end','font-weight="700"')});
  out+=T(300,366,`The round lasts ${total} beats with ${s.n} voice${s.n>1?'s':''}`,13,C.muted);
  return {svg:out,phase:s.n===1?'One voice is just a melody. Add voices to hear it fold over itself.':'Every voice sings the same tune. Because each two-bar section fits the same chord, any overlap still sounds consonant.'};
 }});

const M2_CHORD=[0,4,7];
SCENE({id:'canon-round-harmony',name:'Why rounds work',tag:'Every section fits one chord',
 definition:'A round only works if every section of the melody fits the same harmony, so any two sections sounding together blend.',
 example:'In “Frère Jacques” almost every beat stacks the notes C, E and G, the C major chord, so three or four voices rarely clash.',
 desc:'Beat by beat, the notes sounding in all voices are stacked on a small staff and checked against the C major chord; passing notes are flagged.',
 research:'Mann (1958). The Study of Fugue; Kennan (1959). Counterpoint.',
 dur:12,hint:'Choose the number of voices, then Step through the beats. Coral notes are outside the chord; count how few there are.',
 init:()=>({n:4}),
 ui:[{range:'n',label:'Voices',min:2,max:4,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=v},hear(s,a,ctx){const fr=SCENES['canon-round-harmony'].trace(s)[ctx.k];if(fr&&fr.notes.length)AUDIO.chord(fr.notes.map(midiHz),{dur:.8,type:'triangle'});return 'keep'}},
 trace(s){const vs=M2_voices(s.n),fr=[];for(let b=8*(s.n-1);b<32;b+=.5){const notes=vs.map(v=>{const e=v.find(e=>b>=e.t&&b<e.t+e.d);return e?e.m:null}).filter(m=>m!==null);fr.push({b,notes,out:notes.filter(m=>!M2_CHORD.includes(M2_mod(m,12))).length})}return fr},
 draw(s,f,X){
  const yb=230,sp=14;let out=heading(`Beat ${fmt(f.b-8*(s.n-1)+1)} with all ${s.n} voices sounding`);
  out+=M2_lines(170,430,yb,sp)+M2_clef(194,yb-sp,'G');
  const steps=f.notes.map(m=>{const pc=M2_mod(m,12),l=M2_W.indexOf(pc);return l+7*(Math.floor(m/12)-5)});
  steps.forEach((st,i)=>{const ok=M2_CHORD.includes(M2_mod(f.notes[i],12));out+=M2_note(290+(i%2)*26,st,yb,sp,1,{col:ok?M2_VCOL[i]:C.coral})});
  out+=hit(X,'hear',0,'Hear this beat',G(R(250,276,100,36,C.pale,'none',8)+TB(300,299,'Hear it',15,C.blue)));
  const names=f.notes.map(noteName).join(' · ');out+=T(300,340,names,15,C.ink);
  out+=T(300,364,f.out?`${f.out} note${f.out>1?'s':''} outside C–E–G (a passing note)`:'All notes belong to C–E–G',14,f.out?C.coral:C.green);
  return {svg:out,phase:f.out?'A passing note briefly steps outside the chord; it resolves on the next beat, so the clash is fleeting.':'Every voice is on a note of the C major chord, so the stack sounds like a single chord.'};
 }});

const M2_CANON=[0,2,1,3,2,4,3,1,0];
SCENE({id:'canon-round-fifth',name:'Canon at the fifth',tag:'The second voice transposed',
 definition:'In a canon at the fifth, the second voice copies the first a fifth higher. Composers must write the melody so the two lines make consonances when they overlap.',
 example:'A simple stepwise tune with the second voice entering one beat later at the fifth makes some clashing seconds and sevenths; change the delay and the clashes move.',
 desc:'Two lines of notes, the leader and the follower a chosen interval higher and a chosen delay later, with each overlapping beat labelled by its interval and coloured consonant or dissonant.',
 research:'Zarlino (1558). Le istitutioni harmoniche; Mann (1958). The Study of Fugue.',
 dur:10,hint:'Change the interval and the delay, then Play. Count the coral (dissonant) beats; good canon melodies keep them few and brief.',
 init:()=>({iv:4,delay:2}),
 watch(p){return {iv:4,delay:1+Math.min(3,Math.floor(p*4))}},
 ui:[{choose:[[0,'At the unison'],[4,'At the fifth'],[7,'At the octave']],label:'Interval',get:s=>s.iv,act:'iv'},{range:'delay',label:'Delay (beats)',min:1,max:4,get:s=>s.delay,act:'delay'},{b:'Play',act:'play'}],
 on:{iv(s,v){s.iv=Number(v)},delay(s,v){s.delay=v},play(s,a,ctx){const ev=M2_CANON.map((st,i)=>({m:M2_m(st),t:i,d:1})).concat(M2_CANON.map((st,i)=>({m:M2_m(st+s.iv),t:i+s.delay,d:1})));M2_play(s,ctx,ev,.45);return 'keep'},tick(s,tok){return M2_tick(s,tok)}},
 draw(s,f,X){
  const n=M2_CANON.length,ph=s.ph==null?-1:s.ph;let out=heading(`Follower ${['unison','','','','fifth','','','octave'][s.iv]} higher, ${s.delay} beat${s.delay>1?'s':''} later`);
  const x=i=>70+i*40,yA=st=>290-st*13,yB=st=>200-st*13;let dis=0,tot=0;
  M2_CANON.forEach((st,i)=>{out+=Ci(x(i),yA(st),7,ph>=i&&ph<i+1?C.coral:C.blue)});
  M2_CANON.forEach((st,i)=>{out+=Ci(x(i+s.delay),yB(st+s.iv)+13*s.iv-26,7,ph>=i+s.delay&&ph<i+s.delay+1?C.coral:C.purple)});
  for(let t=s.delay;t<n;t++){const a=M2_CANON[t],b=M2_CANON[t-s.delay]+s.iv,d=M2_mod(Math.abs(b-a),7),ok=[0,2,4,5].includes(d);tot++;if(!ok)dis++;
   out+=R(x(t)-14,316,28,24,ok?C.greenp:C.coralp,'none',5)+TF(x(t),333,[1,2,3,4,5,6,7][d]+(d===0&&Math.abs(b-a)>=7?'/8':''),13,ok?C.green:C.coral,'middle','font-weight="700"')}
  out+=TF(30,yA(2)+4,'leader',13,C.blue,'start')+TF(30,120,'follower',13,C.purple,'start');
  out+=T(300,366,`${dis} of ${tot} overlapping beats are dissonant (2nd, 4th or 7th)`,14,dis?C.coral:C.green);
  return {svg:out,phase:'Interval numbers count letter names: 3, 5, 6 and 8 (and 1) are consonant; 2, 4 and 7 clash. A composer shapes the melody so the clashes fall on weak beats or pass quickly.'};
 }});

/* ---------- polyphony (c. 900–1200) ---------- */
const M2_TENOR=[{m:57,t:0,d:8},{m:59,t:8,d:6},{m:57,t:14,d:10}];
const M2_DUPLUM=(()=>{const st=[4,5,6,7,6,5,4,5,6,5,4,3,4,5,6,7,8,7,6,5,4,3,4,4],ev=[];st.forEach((s,i)=>ev.push({m:M2_m(s),t:i,d:1}));return ev})();
SCENE({id:'polyphony',name:'Organum and polyphony',tag:'Many voices, each its own line',
 definition:'Polyphony is music for several independent voices. At Notre-Dame in Paris around 1200, a chant was slowed into long held notes (the tenor) while a new voice danced above it.',
 example:'Pérotin’s four-voice “Viderunt omnes” (1198) stretches single syllables of chant over dozens of seconds, with three upper voices moving in lively patterns.',
 desc:'A piano-roll with a slow chant tenor in long notes and a faster upper voice above it; the learner can hear either line alone or both together.',
 research:'Anonymous IV (c. 1280) on Léonin and Pérotin; Magnus liber organi (c. 1170–1200); Pérotin, Viderunt omnes (1198).',
 dur:11,hint:'Choose tenor only, upper voice only, or both, and Play. The upper line here is illustrative, in the Notre-Dame style.',
 init:()=>({show:'both'}),
 watch(p){return {show:p<.33?'tenor':p<.66?'upper':'both',ph:(p*3%1)*24}},
 ui:[{choose:[['tenor','Tenor only'],['upper','Upper only'],['both','Both']],label:'Voices',get:s=>s.show,act:'show'},{b:'Play',act:'play'}],
 on:{show(s,v){s.show=v},play(s,a,ctx){const ev=(s.show!=='upper'?M2_TENOR:[]).concat(s.show!=='tenor'?M2_DUPLUM:[]);M2_play(s,ctx,ev,.32,{type:'triangle'});return 'keep'},tick(s,tok){return M2_tick(s,tok)}},
 draw(s,f,X){
  let out=heading('A held chant tenor under a moving upper voice');
  const vs=[];if(s.show!=='upper')vs.push({ev:M2_TENOR,col:C.purple});if(s.show!=='tenor')vs.push({ev:M2_DUPLUM,col:C.blue});
  out+=M2_roll(80,60,500,240,vs,55,74,24,s.ph==null?null:s.ph,{bars:4});
  out+=TF(588,280,'tenor',13,C.purple,'end')+TF(588,82,'upper',13,C.blue,'end');
  out+=T(300,334,'Illustrative lines in the Notre-Dame style',13,C.muted);
  return {svg:out,phase:s.show==='tenor'?'The tenor holds each chant note for many beats: the original melody is still there, only enormously slowed.':s.show==='upper'?'The upper voice moves freely in short notes, landing on consonances with the tenor at important moments.':'Together, the slow tenor and the fast upper voice make polyphony: two independent lines heard at once.'};
 }});

const M2_CHANT=[0,1,2,1,3,2,1,0];
SCENE({id:'polyphony-parallel',name:'Parallel and free organum',tag:'Moving together or apart',
 definition:'The earliest written polyphony, described in Musica enchiriadis (about 900), added a second voice a fourth or fifth below the chant, moving in parallel. Later, free organum let the voices move in contrary and oblique motion.',
 example:'In parallel organum at the fifth, every note of the chant is doubled five letters lower. In free organum the added voice may hold still or move the opposite way.',
 desc:'A chant line and an added voice drawn as two connected lines, with the interval between them labelled at each note.',
 research:'Musica enchiriadis and Scolica enchiriadis (c. 900); Guido of Arezzo (c. 1026). Micrologus, ch. 18–19.',
 dur:9,hint:'Choose parallel fourths, parallel fifths or free organum and Play. Watch the gap between the lines.',
 init:()=>({kind:'fifth'}),
 watch(p){return {kind:p<.33?'fourth':p<.66?'fifth':'free'}},
 ui:[{choose:[['fourth','Parallel 4ths'],['fifth','Parallel 5ths'],['free','Free organum']],label:'Organum',get:s=>s.kind,act:'kind'},{b:'Play',act:'play'}],
 on:{kind(s,v){s.kind=v},play(s,a,ctx){const lo=SCENES['polyphony-parallel'].lower(s.kind);M2_play(s,ctx,M2_CHANT.map((st,i)=>({m:[M2_m(st+4),M2_m(lo[i]+4)],t:i,d:1})),.5);return 'keep'},tick(s,tok){return M2_tick(s,tok)}},
 lower(kind){return kind==='fourth'?M2_CHANT.map(s=>s-3):kind==='fifth'?M2_CHANT.map(s=>s-4):[-3,-3,-2,-3,-2,-3,-3,-4]},
 draw(s,f,X){
  const lo=this.lower(s.kind),x=i=>110+i*55,y=st=>210-st*22,ph=s.ph==null?-1:s.ph;
  let out=heading(s.kind==='free'?'Free organum: oblique and contrary motion':`Parallel organum at the ${s.kind}`);
  out+=P('M'+M2_CHANT.map((st,i)=>fmt(x(i))+' '+fmt(y(st))).join(' L'),C.blue,2.6)+P('M'+lo.map((st,i)=>fmt(x(i))+' '+fmt(y(st))).join(' L'),C.purple,2.6);
  M2_CHANT.forEach((st,i)=>{const on=ph>=i&&ph<i+1,d=st-lo[i];out+=Ci(x(i),y(st),on?9:6,on?C.coral:C.blue)+Ci(x(i),y(lo[i]),on?9:6,on?C.coral:C.purple)+L(x(i),y(st)+8,x(i),y(lo[i])-8,C.grid,1.2,'stroke-dasharray="3 3"');
   out+=TF(x(i),330,d+1,14,[3,4,7].includes(d)?C.ink:C.amber,'middle','font-weight="700"')});
  out+=TF(70,y(0)+4,'chant',13,C.blue,'end')+TF(70,y(lo[0])+4,'added',13,C.purple,'end')+TF(70,334,'interval',13,C.muted,'end');
  return {svg:out,phase:s.kind==='free'?'The added voice holds a note while the chant moves, or moves the other way: the first step towards truly independent lines.':`Every interval is a ${s.kind}: the voices move in lockstep, which sounds rich but not yet independent.`};
 }});

const M2_TYPICAL=[2,3,4,3,2,1,2,3,4,5,4,3,2],M2_WIDE=[0,4,7,9,11,12,11,9,7,11,14,12,7,4,2,0];
SCENE({id:'polyphony-hildegard',name:'Hildegard of Bingen',tag:'Chant with a soaring range',
 definition:'Hildegard of Bingen (1098–1179), abbess, writer and composer, wrote some seventy chants. Many leap and range far more widely than standard chant.',
 example:'Typical chant moves mostly by step within about an octave. Hildegard’s melodies often sweep through well over an octave, with leaps of a fifth that open phrases.',
 desc:'Two melodic lines plotted over a pitch ladder, a typical stepwise chant and a wide-ranging line in Hildegard’s style, each with a bar showing its range.',
 research:'Hildegard of Bingen (c. 1150s–1170s). Symphonia armonie celestium revelationum; Pfau (1990). Hildegard von Bingen’s “Symphonia armonie celestium revelationum”: an analysis of musical process, modality and text-setting.',
 dur:9,hint:'Choose a line and Play. Compare the range bars: these lines are illustrative, not transcriptions of particular chants.',
 init:()=>({which:'wide'}),
 watch(p){return {which:p<.5?'typical':'wide'}},
 ui:[{choose:[['typical','Typical chant'],['wide','In Hildegard’s style']],label:'Line',get:s=>s.which,act:'which'},{b:'Play',act:'play'}],
 on:{which(s,v){s.which=v},play(s,a,ctx){const l=s.which==='wide'?M2_WIDE:M2_TYPICAL;M2_play(s,ctx,l.map((st,i)=>({m:M2_m(st),t:i,d:1})),.42,{type:'sine'});return 'keep'},tick(s,tok){return M2_tick(s,tok)}},
 draw(s,f,X){
  const l=s.which==='wide'?M2_WIDE:M2_TYPICAL,ph=s.ph==null?-1:s.ph,x=i=>90+i*28,y=st=>320-st*17;
  let out=heading(s.which==='wide'?'A wide-ranging line (illustrative)':'A typical stepwise chant (illustrative)');
  for(let st=0;st<=14;st+=7)out+=L(80,y(st),540,y(st),C.grid,1,'stroke-dasharray="3 4"')+TF(74,y(st)+4,M2_name(st),13,C.muted,'end');
  out+=P('M'+l.map((st,i)=>fmt(x(i))+' '+fmt(y(st))).join(' L'),s.which==='wide'?C.purple:C.blue,2.4);
  l.forEach((st,i)=>out+=Ci(x(i),y(st),ph>=i&&ph<i+1?8:5,ph>=i&&ph<i+1?C.coral:C.ink));
  const lo=Math.min(...l),hi=Math.max(...l),semis=M2_m(hi)-M2_m(lo);
  out+=R(556,y(hi),16,y(lo)-y(hi),s.which==='wide'?C.purplep:C.pale,s.which==='wide'?C.purple:C.blue,6)+TF(564,y(lo)+22,`${semis} semitones`,13,C.ink,'middle','font-weight="700"');
  return {svg:out,phase:s.which==='wide'?`This line spans ${semis} semitones, well over an octave, with an opening leap of a fifth. Hildegard’s chants are known for this soaring range and for setting her own visionary poetry.`:`This line moves by step and spans ${semis} semitones, the compact range of most Gregorian chant.`};
 }});
