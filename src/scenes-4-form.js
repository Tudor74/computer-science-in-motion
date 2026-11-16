/* ===================== Music era 4 · Keys, form and the orchestra (1750–1900) ===================== */
// Notation is drawn from SVG primitives (no music fonts). Notes are diatonic steps with C4 = 0 plus an
// accidental (−1 flat, 0 natural, +1 sharp), and durations in crotchets (1 = crotchet, 2 = minim, 0.5 = quaver).
const M4_LETTER=[0,2,4,5,7,9,11],M4_NAMES=['C','D','E','F','G','A','B'];
const M4_midi=(st,acc=0)=>60+12*Math.floor(st/7)+M4_LETTER[((st%7)+7)%7]+acc;
const M4_name=(st,acc=0)=>M4_NAMES[((st%7)+7)%7]+(acc>0?'♯':acc<0?'♭':'');
const M4_ACC=a=>a>0?'♯':a<0?'♭':'♮';
// A treble staff: top line at y, line gap g. Bottom line is E4 (step 2).
const M4_y=(st,y,g)=>y+4*g-(st-2)*g/2;
function M4_staff(x,y,w,g=10,col=C.ink){
 let out='';for(let i=0;i<5;i++)out+=L(x,y+i*g,x+w,y+i*g,'#8aa1ae',1.2);
 // A simplified treble clef drawn with paths: a spiral round the G line (step 4) and a tall stem.
 const cx=x+14,gy=M4_y(4,y,g);
 out+=P(`M${cx+2} ${y+5.4*g} L${cx+2} ${y-1.4*g} C${cx+2} ${y-2.2*g} ${cx+9} ${y-1.6*g} ${cx+6} ${y-.4*g} C${cx+3} ${y+.8*g} ${cx-8} ${y+1.8*g} ${cx-8} ${gy+.6*g} C${cx-8} ${gy+2*g} ${cx+9} ${gy+2*g} ${cx+9} ${gy+.4*g} C${cx+9} ${gy-.9*g} ${cx-2} ${gy-1.1*g} ${cx-3} ${gy+.2*g}`,col,1.8);
 return out;
}
// One note. dur: 4 semibreve, 3 dotted minim, 2 minim, 1.5 dotted crotchet, 1 crotchet, .5 quaver. showAcc: draw accidental.
function M4_note(x,st,acc,dur,y,g,col=C.ink,showAcc=true){
 let out='';const ny=M4_y(st,y,g);
 for(let s=0;s>=st;s-=2)if(s<=0)out+=L(x-g*1.1,M4_y(s,y,g),x+g*1.1,M4_y(s,y,g),'#8aa1ae',1.2);
 for(let s=12;s<=st;s+=2)out+=L(x-g*1.1,M4_y(s,y,g),x+g*1.1,M4_y(s,y,g),'#8aa1ae',1.2);
 const filled=dur<2;
 out+=`<ellipse cx="${fmt(x)}" cy="${fmt(ny)}" rx="${fmt(g*.62)}" ry="${fmt(g*.44)}" transform="rotate(-20 ${fmt(x)} ${fmt(ny)})" fill="${filled?col:'#fff'}" stroke="${col}" stroke-width="1.6"/>`;
 if(dur<4){const up=st<6,sx=up?x+g*.58:x-g*.58,sy=up?ny-g*3.4:ny+g*3.4;out+=L(sx,ny,sx,sy,col,1.5);
  if(dur===.5||dur===.75)out+=P(`M${sx} ${sy} q ${g*.9} ${up?g*.8:-g*.8} ${g*.5} ${up?g*2:-g*2}`,col,1.5)}
 if(dur===3||dur===1.5||dur===.75)out+=Ci(x+g*1.05,ny-(st%2===0?g*.25:0),1.8,col);
 if(showAcc&&acc!==null&&acc!==undefined&&acc!==0)out+=TF(x-g*1.45,ny+g*.42,M4_ACC(acc),Math.round(g*1.5),col);
 return out;
}
const M4_bar=(x,y,g)=>L(x,y,x,y+4*g,'#8aa1ae',1.4);
// Lay out a melody on a staff, highlighting note index hl. notes: [{st,acc,dur}]. Returns svg.
function M4_melody(notes,x0,y,w,g,hl=-1,col=C.ink,hlCol=C.coral,opts={}){
 const beats=sum(notes.map(n=>n.dur)),inner=w-46;let out=M4_staff(x0,y,w,g),bt=0;
 const per=opts.bar||4;
 notes.forEach((n,i)=>{const x=x0+40+inner*(bt+.35)/Math.max(beats,1);if(n.rest){out+=R(x-5,y+1.6*g,10,g*.6,col,'none',1)}else out+=M4_note(x,n.st,n.acc||0,n.dur,y,g,i===hl?hlCol:col,opts.acc!==false);bt+=n.dur;
  if(bt%per===0&&bt<beats)out+=M4_bar(x0+40+inner*(bt+.05)/beats,y,g)});
 out+=M4_bar(x0+w-2,y,g)+L(x0+w+1,y,x0+w+1,y+4*g,'#8aa1ae',3);
 return out;
}
// A one-octave-plus keyboard; marks: {midi: colour}.
function M4_keys(x,y,w,lo,hi,marks={},h=46){
 const whites=[];for(let m=lo;m<=hi;m++)if(![1,3,6,8,10].includes(m%12))whites.push(m);
 const kw=w/whites.length;let out='';
 whites.forEach((m,i)=>out+=R(x+i*kw,y,kw-1,h,marks[m]||'#fff','#8aa1ae',2));
 whites.forEach((m,i)=>{if(m+1<=hi&&[0,2,5,7,9].includes(m%12))out+=R(x+(i+1)*kw-kw*.3,y,kw*.6,h*.6,marks[m+1]||C.dark,'none',2)});
 return out;
}
// Scale builder: tonic letter step and accidental, interval pattern in semitones → [{st,acc}].
function M4_scale(st0,acc0,pattern){
 const out=[{st:st0,acc:acc0}];let midi=M4_midi(st0,acc0),st=st0;
 for(const s of pattern){midi+=s;st++;out.push({st,acc:midi-M4_midi(st,0)})}
 return out;
}
const M4_PAT={major:[2,2,1,2,2,2,1],natural:[2,1,2,2,1,2,2],harmonic:[2,1,2,2,1,3,1],melodic:[2,1,2,2,2,2,1]};
const M4_TONICS=[['C',0,0],['G',4,0],['D',1,0],['A',5,0],['F',3,0],['B♭',6,-1],['E♭',2,-1]];
// Playback: schedule notes with AUDIO.seq and step a playhead with ctx.every; 'tick' updates s.pos.
function M4_play(s,ctx,notes,bpm=100,o={}){
 const beat=60/bpm;let t=0;const seq=[],starts=[];
 for(const n of notes){starts.push(t);if(!n.rest){const hz=n.hz||midiHz(M4_midi(n.st,n.acc||0)+(o.shift||0));seq.push({hz,at:t,dur:Math.max(.12,n.dur*beat*.92)});if(n.chord)n.chord.forEach(m=>seq.push({hz:midiHz(m),at:t,dur:n.dur*beat*.92,gain:.07}))}t+=n.dur*beat}
 AUDIO.seq(seq,{type:o.type||'triangle',partials:o.partials||null,gain:o.gain||.14});
 s.t0=performance.now();s.starts=starts.map(x=>x*1000);s.total=t*1000;s.pos=0;s.token=(s.token||0)+1;ctx.every(60,'tick',s.token);
}
function M4_tick(s,tok){if(Number(tok)!==s.token)return 'stop';const el=performance.now()-s.t0;if(el>=s.total){s.pos=-1;return 'stop'}let i=0;while(i+1<s.starts.length&&s.starts[i+1]<=el)i++;s.pos=i}

/* ---------- Lesson: major-minor ---------- */
SCENE({id:'major-minor',name:'The major scale',tag:'Tone, tone, semitone…',
 definition:'A seven-note scale built from the step pattern tone, tone, semitone, tone, tone, tone, semitone. Starting the same pattern on any note gives the major scale of that key.',
 example:'C major uses only white keys. G major needs one sharp (F♯) and F major one flat (B♭), because the semitones must fall between the 3rd–4th and 7th–8th notes.',
 desc:'A staff showing a major scale on the chosen tonic with tone and semitone brackets under each step, above a keyboard with the scale’s keys coloured.',
 research:['Rameau (1722). Traité de l’harmonie: the major mode as a system built on the tonic.','Aldwell & Schachter (2011). Harmony and Voice Leading, 4th edn: scales and key signatures.'],
 dur:10,hint:'Choose a tonic. The pattern of tones (T) and semitones (S) stays the same, so sharps or flats appear where they are needed. Press Play to hear it.',
 init:()=>({t:0,pos:-1}),
 watch(p){return {t:Math.min(6,Math.floor(p*7)),pos:-1}},
 ui:[{choose:M4_TONICS.map((k,i)=>[i,k[0]+' major']),label:'Tonic',get:s=>s.t,act:'tonic'},{b:'Play ▶',act:'play'}],
 on:{tonic(s,v){s.t=Number(v);s.pos=-1},play(s,a,ctx){const k=M4_TONICS[s.t];M4_play(s,ctx,M4_scale(k[1],k[2],M4_PAT.major).map(n=>({...n,dur:1})),120)},tick:M4_tick},
 draw(s){
  const k=M4_TONICS[s.t],sc=M4_scale(k[1],k[2],M4_PAT.major),g=11,x0=40,y=62;let out=heading(k[0]+' major: the same pattern on a new starting note');
  out+=M4_staff(x0,y,520,g);
  sc.forEach((n,i)=>{const x=x0+80+i*58;out+=M4_note(x,n.st,n.acc,1,y,g,i===s.pos?C.coral:C.ink);out+=TF(x,y+4*g+38,M4_name(n.st,n.acc),14,C.ink)});
  M4_PAT.major.forEach((st,i)=>{const x=x0+80+i*58+29,semi=st===1;out+=R(x-15,y+4*g+50,30,22,semi?C.coralp:C.pale,'none',6)+TBF(x,y+4*g+66,semi?'S':'T',13,semi?C.coral:C.blue)});
  const marks={};sc.forEach(n=>marks[M4_midi(n.st,n.acc)]=C.blue);
  out+=M4_keys(90,254,420,M4_midi(k[1],k[2])-(k[1]>=4?12:0)>=60?60:48,84,marks,56);
  const acc=sc.slice(0,7).filter(n=>n.acc).map(n=>M4_name(n.st,n.acc));
  return {svg:out,phase:`${k[0]} major: ${sc.map(n=>M4_name(n.st,n.acc)).join(' ')}. ${acc.length?'It needs '+acc.join(', ')+' to keep the semitones between notes 3–4 and 7–8.':'Only white keys: the semitones fall naturally between E–F and B–C.'}`};
 }});

const M4_MINOR=[['natural','Natural minor'],['harmonic','Harmonic minor'],['melodic','Melodic minor (rising)']];
const M4_MTONICS=[['A',5,0,-7],['E',2,0,0],['D',1,0,0],['C',0,0,0]];
SCENE({id:'major-minor-forms',name:'Three forms of the minor scale',tag:'Natural, harmonic, melodic',
 definition:'The natural minor scale follows the pattern T S T T S T T. The harmonic minor raises the 7th note so it leans into the tonic; the melodic minor also raises the 6th on the way up to smooth the leap that creates.',
 example:'A natural minor is all white keys from A. A harmonic minor adds G♯; A melodic minor (rising) adds F♯ and G♯, and traditionally falls back as natural minor.',
 desc:'Three versions of a minor scale on one staff choice, with the raised notes highlighted and the step pattern shown.',
 research:['Aldwell & Schachter (2011). Harmony and Voice Leading: the three forms of minor.','Rameau (1722). Traité de l’harmonie, on the raised leading note in minor.'],
 dur:10,hint:'Choose a form and a tonic. Coloured notes are the raised 6th or 7th. Play to hear how the raised 7th pulls up to the tonic.',
 init:()=>({form:'harmonic',t:0,pos:-1}),
 watch(p){return {form:M4_MINOR[Math.min(2,Math.floor(p*3))][0],t:0,pos:-1}},
 ui:[{choose:M4_MINOR,label:'Form',get:s=>s.form,act:'form'},{choose:M4_MTONICS.map((k,i)=>[i,k[0]+' minor']),label:'Tonic',get:s=>s.t,act:'tonic'},{b:'Play ▶',act:'play'}],
 on:{form(s,v){s.form=v;s.pos=-1},tonic(s,v){s.t=Number(v);s.pos=-1},play(s,a,ctx){const k=M4_MTONICS[s.t];M4_play(s,ctx,M4_scale(k[1]+k[3],k[2],M4_PAT[s.form]).map(n=>({...n,dur:1})),120)},tick:M4_tick},
 draw(s){
  const k=M4_MTONICS[s.t],nat=M4_scale(k[1]+k[3],k[2],M4_PAT.natural),sc=M4_scale(k[1]+k[3],k[2],M4_PAT[s.form]),g=11,x0=40,y=70;
  let out=heading(`${k[0]} ${M4_MINOR.find(m=>m[0]===s.form)[1].toLowerCase()}`);
  out+=M4_staff(x0,y,520,g);
  sc.forEach((n,i)=>{const x=x0+80+i*58,raised=n.acc!==nat[i].acc;out+=M4_note(x,n.st,n.acc,1,y,g,i===s.pos?C.coral:raised?C.green:C.ink);out+=TF(x,y+4*g+38,M4_name(n.st,n.acc),14,raised?C.green:C.ink,'middle',raised?'font-weight="700"':'')});
  M4_PAT[s.form].forEach((st,i)=>{const x=x0+80+i*58+29,lab=st===1?'S':st===2?'T':'T+S';out+=R(x-17,y+4*g+50,34,22,st===1?C.coralp:st===3?C.amberp:C.pale,'none',6)+TBF(x,y+4*g+66,lab,13,st===1?C.coral:st===3?C.amber:C.blue)});
  out+=TF(300,y+4*g+108,s.form==='natural'?'Same notes as its relative major, starting on the 6th degree.':s.form==='harmonic'?'Raised 7th: a semitone below the tonic, as in major. Gap of three semitones (T+S) between 6 and 7.':'Raised 6th and 7th going up remove that awkward gap; descending melodies usually return to natural minor.',14,C.muted);
  return {svg:out,phase:`${k[0]} ${s.form} minor: ${sc.map(n=>M4_name(n.st,n.acc)).join(' ')}. The green notes are raised compared with the natural minor.`};
 }});

// Frère Jacques (traditional French round, public domain), first two bars twice.
const M4_FRERE=[0,1,2,0,0,1,2,0,2,3,4,2,3,4].map((st,i)=>({st,acc:0,dur:[10,13].includes(i)?2:1}));
M4_FRERE.splice(11,1);M4_FRERE.splice(10,0,{st:4,acc:0,dur:2});
const M4_REL=[['major','C major'],['parallel','C minor (parallel)'],['relative','A minor (relative)']];
function M4_frereIn(key){
 return M4_FRERE.map(n=>{if(key==='major')return n;if(key==='relative')return {...n,st:n.st-2,acc:0};
  const deg=((n.st%7)+7)%7;return {...n,acc:[2,5,6].includes(deg)?-1:0}});
}
SCENE({id:'major-minor-relative-parallel',name:'Relative and parallel keys',tag:'Same notes, or same tonic',
 definition:'A relative minor shares its notes and key signature with a major key but starts on its 6th note (C major and A minor). A parallel minor shares the tonic but changes notes (C major and C minor).',
 example:'Frère Jacques in C major, then in C minor (E, A and B become E♭, A♭, B♭), then in A minor (every note moves down to the relative scale).',
 desc:'One traditional tune drawn on a staff in the chosen key, with changed notes highlighted, beside a panel explaining which notes are shared.',
 research:['Dalla Bella, Peretz, Rousseau & Gosselin (2001). A developmental study of the affective value of tempo and mode in music. Cognition 80, B1–B10.','Fritz et al. (2009). Universal recognition of three basic emotions in music. Current Biology 19, 573–576.'],
 dur:10,hint:'Choose a key and press Play. Notice which version changes notes and which keeps them. Ask yourself whether the minor version really sounds sad.',
 init:()=>({key:'parallel',pos:-1}),
 watch(p){return {key:M4_REL[Math.min(2,Math.floor(p*3))][0],pos:-1}},
 ui:[{choose:M4_REL,label:'Key',get:s=>s.key,act:'key'},{b:'Play ▶',act:'play'}],
 on:{key(s,v){s.key=v;s.pos=-1},play(s,a,ctx){M4_play(s,ctx,M4_frereIn(s.key),132)},tick:M4_tick},
 draw(s){
  const notes=M4_frereIn(s.key),g=10,y=64;let out=heading('Frère Jacques in '+M4_REL.find(r=>r[0]===s.key)[1]);
  out+=M4_staff(30,y,540,g);
  let bt=0;const beats=sum(notes.map(n=>n.dur));
  notes.forEach((n,i)=>{const x=72+490*(bt+.35)/beats,changed=s.key==='parallel'&&n.acc!==0;out+=M4_note(x,n.st,n.acc,n.dur,y,g,i===s.pos?C.coral:changed?C.purple:C.ink);bt+=n.dur;if(bt%4===0&&bt<beats)out+=M4_bar(72+490*(bt+.05)/beats,y,g)});
  out+=M4_bar(568,y,g);
  const box1=s.key==='major'?['C major: C D E F G A B','The original tune.']:s.key==='parallel'?['C minor: C D E♭ F G A♭ B♭','Same tonic C; three notes lowered (purple).']:['A minor: A B C D E F G','Same notes as C major; the tune is moved to start on A.'];
  out+=R(60,196,480,70,'#fff',C.grid,10)+TB(300,224,box1[0],17,C.ink)+T(300,250,box1[1],15,C.muted);
  out+=R(60,280,480,74,C.amberp,'none',10)+TF(300,304,'Does minor sound sad? Children in one study only used mode',14,C.ink)+TF(300,324,'for sad/happy judgements from about age 6; tempo mattered earlier.',14,C.ink)+TF(300,344,'The link is learned and shaped by culture, not built into the notes.',14,C.ink);
  return {svg:out,phase:s.key==='parallel'?'Parallel minor: same starting note, three notes lowered a semitone. Many Western listeners hear it as darker, but that association is learned.':s.key==='relative'?'Relative minor: every note comes from the same set as C major, but the tune now centres on A.':'The tune in C major, the reference version.'};
 }});

/* ---------- Lesson: modulation ---------- */
const M4_PIVOT=[
 {ch:[48,64,67,72],name:'C',c:'I',g:'',key:'C',say:'C major: chord I, the home chord of C.'},
 {ch:[45,64,69,72],name:'Am',c:'vi',g:'ii',key:'pivot',say:'A minor is chord vi in C and also chord ii in G. It belongs to both keys: the pivot.'},
 {ch:[50,66,69,72],name:'D7',c:'(V7 of V)',g:'V7',key:'G',say:'D7 contains F♯, a note not in C major. It is the dominant seventh of G, so the ear now hears G as home.'},
 {ch:[43,62,67,71],name:'G',c:'',g:'I',key:'G',say:'G major: chord I of the new key. The music has modulated from C to G.'}];
SCENE({id:'modulation',name:'Modulation by a pivot chord',tag:'Changing key smoothly',
 definition:'Modulation is moving from one key to another within a piece. A pivot chord belongs to both keys, so the music can turn on it without a jolt.',
 example:'C → Am → D7 → G: A minor is vi in C and ii in G; the D7 adds F♯ and confirms G as the new tonic.',
 desc:'Four chords on a strip, each with its Roman numeral in C major and in G major; the pivot chord is highlighted as belonging to both, and a key-colour band changes from C to G.',
 research:['Schoenberg (1954). Structural Functions of Harmony: pivot chords and regions.','Aldwell & Schachter (2011). Harmony and Voice Leading: modulation by common chord.'],
 dur:10,hint:'Step through the four chords and press Play chord to hear each one. Watch where the key band changes colour.',
 init:()=>({}),
 ui:[{b:'Play chord ♪',act:'play'},{b:'Play all ▶',act:'all'}],
 on:{play(s,a,ctx){const c=M4_PIVOT[ctx.k];if(c)AUDIO.chord(c.ch.map(midiHz),{dur:1.2,type:'triangle'});return 'keep'},all(s){M4_PIVOT.forEach((c,i)=>AUDIO.chord(c.ch.map(midiHz),{dur:.9,at:i*.95,type:'triangle'}));return 'keep'}},
 trace(){return M4_PIVOT.map((c,i)=>({i,say:c.say}))},
 draw(s,f,X){
  let out=heading('From C major to G major through a shared chord');const k=f.i;
  out+=TB(70,98,'in C:',15,C.blue,'end')+TB(70,252,'in G:',15,C.green,'end');
  M4_PIVOT.forEach((c,i)=>{const x=100+i*120,on=i<=k,cur=i===k;
   out+=R(x,110,100,120,!on?'#f4f6f7':c.key==='C'?C.pale:c.key==='G'?C.greenp:C.amberp,cur?C.coral:'none',12);
   out+=TB(x+50,160,c.name,26,on?C.ink:C.line)+TF(x+50,186,c.ch.slice(1).map(m=>noteName(m).replace(/\d/,'')).join(' '),13,on?C.muted:C.line);
   if(c.c)out+=TB(x+50,98,c.c,15,on?C.blue:C.line);if(c.g)out+=TB(x+50,252,c.g,15,on?C.green:C.line);
   if(c.key==='pivot'&&on)out+=TB(x+50,212,'pivot',13,C.amber)});
  const band=k<1?'C':k<2?'pivot':'G';out+=R(100,280,460,26,'#eef2f4','none',8);
  out+=R(100,280,120*Math.min(k+1,4)-20,26,band==='C'?C.blue:band==='pivot'?C.amber:C.green,'none',8)+TBF(330,298,band==='C'?'heard as: C major':band==='pivot'?'heard as: either key':'heard as: G major',13,'#fff');
  out+=TF(300,340,'Closest keys are a fifth apart: they share six of their seven notes.',14,C.muted);
  return {svg:out,phase:f.say};
 }});

// Key signatures: count of sharps (+) or flats (−) for closely related keys of C major.
const M4_RELATED=[['C major',0,'home key'],['G major',1,'dominant'],['F major',-1,'subdominant'],['A minor',0,'relative minor'],['E minor',1,'relative of the dominant'],['D minor',-1,'relative of the subdominant'],['D major',2,'two steps away'],['E♭ major',-3,'distant']];
const M4_SHARP_ST=[10,7,11,8,5,9,6],M4_FLAT_ST=[6,9,5,8,4,7,3];
function M4_keysig(x,y,g,n,col=C.ink){let out='';const list=n>0?M4_SHARP_ST:M4_FLAT_ST;for(let i=0;i<Math.abs(n);i++)out+=TF(x+i*11,M4_y(list[i],y,g)+g*.45,n>0?'♯':'♭',Math.round(g*1.6),col);return out}
SCENE({id:'modulation-closely-related',name:'Closely related keys',tag:'Keys that share most notes',
 definition:'Closely related keys differ from the home key by at most one sharp or flat. Classical composers modulated most often to these: the dominant, the subdominant and the relative keys.',
 example:'From C major the nearest keys are G major (one sharp), F major (one flat), and the minors A, E and D. D major (two sharps) is one step further.',
 desc:'A grid of key cards with their key signatures drawn on small staves; choosing one compares its notes with C major and counts how many differ.',
 research:['Schoenberg (1954). Structural Functions of Harmony: chart of regions.','Rosen (1971). The Classical Style: tonic–dominant polarity.'],
 dur:9,hint:'Press a key card. The number of changed notes tells you how far the music has travelled from C. Play hears its scale.',
 init:()=>({k:1,pos:-1}),
 watch(p){return {k:Math.min(7,Math.floor(p*8)),pos:-1}},
 ui:[{b:'Play scale ▶',act:'play'}],
 on:{pick(s,v){s.k=Number(v);s.pos=-1},play(s,a,ctx){const tonics={'C major':[0,0,'major'],'G major':[4,0,'major'],'F major':[3,0,'major'],'A minor':[-2,0,'natural'],'E minor':[2,0,'natural'],'D minor':[1,0,'natural'],'D major':[1,0,'major'],'E♭ major':[2,-1,'major']};const t=tonics[M4_RELATED[s.k][0]];M4_play(s,ctx,M4_scale(t[0],t[1],M4_PAT[t[2]]).map(n=>({...n,dur:.5})),120)},tick:M4_tick},
 draw(s,f,X){
  let out=heading('How far is each key from C major?');
  M4_RELATED.forEach((k,i)=>{const col=i%4,row=Math.floor(i/4),x=40+col*132,y=58+row*112,on=i===s.k,far=Math.abs(k[1]);
   const inner=R(x,y,120,100,on?C.pale:'#fff',on?C.blue:C.grid,10)+M4_staff(x+6,y+14,108,7)+M4_keysig(x+40,y+14,7,k[1])+TBF(x+60,y+72,k[0],14,C.ink)+TF(x+60,y+90,k[2],12,far<=1?C.green:C.coral);
   out+=hit(X,'pick',i,`${k[0]}, ${Math.abs(k[1])} ${k[1]>=0?'sharps':'flats'}`,inner)});
  const k=M4_RELATED[s.k],d=Math.abs(k[1]);
  out+=R(60,292,480,64,d<=1?C.greenp:C.coralp,'none',10)+TB(300,318,`${k[0]}: ${d===0?'no sharps or flats':d+(k[1]>0?' sharp':' flat')+(d>1?'s':'')}`,17,C.ink)+TF(300,342,d===0?'Shares all seven notes with C major.':d===1?'Shares six of seven notes: closely related.':`Changes ${d} notes: a bigger journey.`,14,C.ink);
  return {svg:out,phase:`${k[0]} (${k[2]}) differs from C major by ${d} note${d===1?'':'s'}. ${d<=1?'Closely related keys like this were the usual destinations.':'Distant keys were saved for surprises and development sections.'}`};
 }});

const M4_PLAN=[{key:'C',lab:'Theme in C (tonic)',w:4,col:'#1772b7',ch:[48,60,64,67]},{key:'G',lab:'Moves to G (dominant)',w:3,col:'#2c776c',ch:[43,59,62,67]},{key:'Am',lab:'Wanders to A minor',w:2,col:'#7156a6',ch:[45,60,64,69]},{key:'Dm',lab:'Passes through D minor',w:2,col:'#9a6200',ch:[50,62,65,69]},{key:'G7',lab:'Dominant prepares home',w:1,col:'#c45238',ch:[43,59,62,65]},{key:'C',lab:'Home: C again',w:4,col:'#1772b7',ch:[48,60,64,67]}];
SCENE({id:'modulation-timeline',name:'A key journey through a piece',tag:'Away and home again',
 definition:'In much eighteenth- and nineteenth-century music the key itself has a plot: establish home, travel to related keys, build tension, and return home at the end.',
 example:'A short piece might go C major → G major → A minor → D minor → G7 → C major. The return home feels like resolution because of the journey.',
 desc:'A horizontal strip of coloured key segments for an illustrative piece; a playhead moves along it and pressing a segment plays its chord.',
 research:['Rosen (1971). The Classical Style: the large-scale key plan as drama.','Caplin (1998). Classical Form: tonal structure of themes and sections.'],
 dur:10,hint:'Press any segment to hear its chord, or Play the journey. The key plan here is illustrative, not a particular piece.',
 init:()=>({sel:0}),
 watch(p){return {sel:-1,head:p}},
 ui:[{b:'Play the journey ▶',act:'all'}],
 on:{seg(s,v){s.sel=Number(v);AUDIO.chord(M4_PLAN[s.sel].ch.map(midiHz),{dur:1.1,type:'triangle'})},all(s){let t=0;M4_PLAN.forEach(p=>{AUDIO.chord(p.ch.map(midiHz),{dur:p.w*.38,at:t,type:'triangle'});t+=p.w*.4})}},
 draw(s,f,X){
  let out=heading('An illustrative key plan: away and home');const tot=sum(M4_PLAN.map(p=>p.w));let x=40;
  M4_PLAN.forEach((p,i)=>{const w=520*p.w/tot,on=i===s.sel;out+=hit(X,'seg',i,p.lab,R(x+2,110,w-4,70,p.col,on?C.ink:'none',8,`opacity="${on||s.sel<0?1:.75}"`)+TBF(x+w/2,152,p.key,18,'#fff'));
   out+=TF(x+w/2,206+(i%2)*20,p.lab,12.5,C.ink);x+=w});
  if(s.head!==undefined){const hx=40+520*s.head;out+=L(hx,96,hx,192,C.ink,2.5)+`<polygon points="${fmt(hx)},96 ${fmt(hx-6)},86 ${fmt(hx+6)},86" fill="${C.ink}"/>`}
  out+=TB(40,272,'tension',14,C.coral,'start');
  let px=40;const tens=[0,.45,.6,.7,.95,0];let d='';M4_PLAN.forEach((p,i)=>{const w=520*p.w/tot;d+=(i?'L':'M')+fmt(px)+' '+fmt(340-tens[i]*60)+' L'+fmt(px+w)+' '+fmt(340-tens[i]*60)+' ';px+=w});
  out+=P(d,C.coral,2.5)+L(40,340,560,340,C.line,1.5);
  const cur=s.sel>=0?M4_PLAN[s.sel]:null;
  return {svg:out,phase:cur?`${cur.lab}. The further from home, the more the ear expects a return.`:'Tension rises as the music moves away from C and is released when the dominant G7 leads home.'};
 }});

/* ---------- Lesson: motif ---------- */
// Beethoven, Symphony No. 5 (1808): quaver rest, three quavers G, then a long E♭ (public domain).
const M4_MOTIF={original:[{rest:true,dur:.5},{st:4,acc:0,dur:.5},{st:4,acc:0,dur:.5},{st:4,acc:0,dur:.5},{st:2,acc:-1,dur:2}]};
M4_MOTIF.repetition=[...M4_MOTIF.original,...M4_MOTIF.original];
M4_MOTIF.sequence=[...M4_MOTIF.original,{rest:true,dur:.5},{st:3,acc:0,dur:.5},{st:3,acc:0,dur:.5},{st:3,acc:0,dur:.5},{st:1,acc:0,dur:2}];
M4_MOTIF.inversion=[{rest:true,dur:.5},{st:4,acc:0,dur:.5},{st:4,acc:0,dur:.5},{st:4,acc:0,dur:.5},{st:6,acc:-1,dur:2}];
M4_MOTIF.augmentation=[{rest:true,dur:1},{st:4,acc:0,dur:1},{st:4,acc:0,dur:1},{st:4,acc:0,dur:1},{st:2,acc:-1,dur:4}];
M4_MOTIF.fragmentation=[{rest:true,dur:.5},{st:4,acc:0,dur:.5},{st:4,acc:0,dur:.5},{st:4,acc:0,dur:.5},{st:5,acc:-1,dur:.5},{st:5,acc:-1,dur:.5},{st:5,acc:-1,dur:.5},{st:6,acc:0,dur:.5},{st:6,acc:0,dur:.5},{st:6,acc:0,dur:.5}];
const M4_MOTIF_SAY={original:'Short–short–short–long: three repeated Gs falling a third to E♭. Four notes, instantly recognisable.',repetition:'Repetition: the motif said twice. Beethoven repeats it straight away, a step lower.',sequence:'Sequence: the same shape restarted on a different pitch (G G G E♭, then F F F D).',inversion:'Inversion: the falling third becomes a rising third (G G G B♭). Same rhythm, mirrored direction.',augmentation:'Augmentation: every note value doubled. The motif is slower but keeps its shape.',fragmentation:'Fragmentation: only the three short notes are kept and passed upwards, building urgency.'};
SCENE({id:'motif',name:'Motif and its development',tag:'Four notes, a whole movement',
 definition:'A motif is a short, recognisable musical idea. Composers develop it by repeating it, moving it to new pitches (sequence), turning it upside down (inversion), stretching it (augmentation) or using just part of it (fragmentation).',
 example:'Beethoven’s Fifth Symphony (1808) opens with short–short–short–long and builds much of the first movement from that rhythm.',
 desc:'The opening motif of Beethoven’s Fifth on a staff, transformed by the chosen technique, with its pitch contour drawn underneath.',
 research:['Beethoven (1808). Symphony No. 5 in C minor, Op. 67.','Schoenberg (1967). Fundamentals of Musical Composition: the motif and its variation.'],
 dur:12,hint:'Choose a transformation and press Play. The rhythm or the shape survives each change, which is why the ear still recognises the motif.',
 init:()=>({tr:'original',pos:-1}),
 watch(p){const ks=Object.keys(M4_MOTIF_SAY);return {tr:ks[Math.min(5,Math.floor(p*6))],pos:-1}},
 ui:[{choose:Object.keys(M4_MOTIF_SAY).map(k=>[k,k[0].toUpperCase()+k.slice(1)]),label:'Transformation',get:s=>s.tr,act:'tr'},{b:'Play ▶',act:'play'}],
 on:{tr(s,v){s.tr=v;s.pos=-1},play(s,a,ctx){M4_play(s,ctx,M4_MOTIF[s.tr],108,{type:'sawtooth',gain:.09})},tick:M4_tick},
 draw(s){
  const notes=M4_MOTIF[s.tr];let out=heading(s.tr==='original'?'Beethoven’s Fifth: the motif':s.tr[0].toUpperCase()+s.tr.slice(1)+' of the motif');
  out+=M4_melody(notes,30,70,540,11,s.pos,C.ink,C.coral,{bar:s.tr==='augmentation'?8:4});
  // Contour: pitch of each sounding note against time.
  const beats=sum(notes.map(n=>n.dur));let bt=0,pts=[];notes.forEach(n=>{if(!n.rest)pts.push([70+490*(bt+.35)/beats,330-(M4_midi(n.st,n.acc)-60)*7]);bt+=n.dur});
  out+=TB(40,224,'contour',13,C.muted,'start')+L(70,340,560,340,C.line,1.5);
  out+=P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),C.blue,2.5)+pts.map(p=>Ci(p[0],p[1],4.5,C.blue)).join('');
  return {svg:out,phase:M4_MOTIF_SAY[s.tr]};
 }});

SCENE({id:'motif-shapes',name:'Shape a motif yourself',tag:'Retrograde and inversion',
 definition:'Because a motif is defined by its rhythm and contour, the same transformations can be applied to any short idea: play it backwards (retrograde), upside down (inversion), or both.',
 example:'A rising C–D–G becomes G–D–C in retrograde, and C–B♭–F in inversion around C. The rhythm keeps them recognisable.',
 desc:'Four editable notes on a staff with up and down presses, and three smaller staves showing the original, its retrograde and its inversion.',
 research:['Schoenberg (1967). Fundamentals of Musical Composition: motif variation by inversion and retrograde.','Bach (1747). The Musical Offering: canons by inversion and retrograde (crab canon).'],
 dur:9,hint:'Press the arrows above or below each note to change your motif. The retrograde and inversion update. Play any of the three.',
 init:()=>({m:[0,1,4,2],pos:-1}),
 watch(p){const r=rng(3);const k=Math.floor(p*4);const m=[0,1,4,2];for(let i=0;i<k;i++)m[i%4]+=(i%2?-1:2);return {m,pos:-1}},
 ui:[{b:'Play original',act:'play',arg:'o'},{b:'Play retrograde',act:'play',arg:'r'},{b:'Play inversion',act:'play',arg:'i'}],
 on:{up(s,i){s.m[i]=Math.min(10,s.m[i]+1)},down(s,i){s.m[i]=Math.max(-3,s.m[i]-1)},
  play(s,w,ctx){const n=w==='r'?s.m.slice().reverse():w==='i'?s.m.map(v=>2*s.m[0]-v):s.m;M4_play(s,ctx,n.map((st,i)=>({st,acc:0,dur:i===3?2:1})),120)},tick:M4_tick},
 draw(s,f,X){
  let out=heading('Your motif, backwards and upside down');const g=10;
  out+=M4_staff(40,70,300,g);
  s.m.forEach((st,i)=>{const x=110+i*60,ny=M4_y(st,70,g);out+=M4_note(x,st,0,i===3?2:1,70,g,C.ink);
   out+=hit(X,'up',i,`Raise note ${i+1}`,R(x-12,40,24,18,C.pale,C.line,5)+TBF(x,54,'▲',12,C.blue))+hit(X,'down',i,`Lower note ${i+1}`,R(x-12,158,24,18,C.pale,C.line,5)+TBF(x,172,'▼',12,C.blue))});
  out+=TF(190,200,'your motif: '+s.m.map(st=>M4_name(st)).join(' '),14,C.ink);
  const ret=s.m.slice().reverse(),inv=s.m.map(v=>2*s.m[0]-v);
  [['retrograde',ret,C.purple],['inversion',inv,C.green]].forEach(([nm,arr,col],j)=>{const x0=360,y0=58+j*150;out+=TBF(x0+110,y0-4,nm,14,col)+M4_staff(x0,y0+10,220,8);arr.forEach((st,i)=>out+=M4_note(x0+70+i*40,st,0,i===3?2:1,y0+10,8,col));out+=TF(x0+110,y0+100,arr.map(st=>M4_name(st)).join(' '),13,col)});
  return {svg:out,phase:`Original ${s.m.map(st=>M4_name(st)).join('–')}; retrograde ${ret.map(st=>M4_name(st)).join('–')}; inversion around ${M4_name(s.m[0])}: ${inv.map(st=>M4_name(st)).join('–')}. Inversion here mirrors step by step on the white-key scale.`};
 }});

// Antecedent–consequent period in C major (written for this page).
const M4_ANT=[{st:0,dur:1},{st:2,dur:1},{st:4,dur:1},{st:2,dur:1},{st:3,dur:1},{st:2,dur:1},{st:1,dur:2}].map(n=>({...n,acc:0}));
const M4_CON=[{st:0,dur:1},{st:2,dur:1},{st:4,dur:1},{st:2,dur:1},{st:3,dur:1},{st:1,dur:1},{st:0,dur:2}].map(n=>({...n,acc:0}));
SCENE({id:'motif-period',name:'Question and answer phrases',tag:'From motif to theme',
 definition:'Motifs combine into phrases. A classical period pairs a question phrase (antecedent) that ends unresolved, often on the dominant, with an answer phrase (consequent) that starts the same way but ends home on the tonic.',
 example:'The question ends on D over a G chord (a half cadence); the answer repeats the opening and closes on C (a perfect cadence).',
 desc:'Two four-bar phrases on staves with their endings marked: the first ends on a half cadence, the second on a perfect cadence.',
 research:['Caplin (1998). Classical Form: the period, antecedent and consequent.','Koch (1782–93). Versuch einer Anleitung zur Composition: phrase and cadence in eighteenth-century theory.'],
 dur:9,hint:'Play the question, then the answer. Which one sounds finished? Play both to hear the pair.',
 init:()=>({pos:-1,which:null}),
 watch(p){return {pos:-1,which:p<.5?'q':'a'}},
 ui:[{b:'Play question',act:'play',arg:'q'},{b:'Play answer',act:'play',arg:'a'},{b:'Play both',act:'play',arg:'b'}],
 on:{play(s,w,ctx){s.which=w;const q=M4_ANT.map((n,i)=>({...n,chord:i===6?[43,47,50]:i===0?[48,52,55]:null})),a=M4_CON.map((n,i)=>({...n,chord:i===6?[48,52,55]:i===5?[43,47,50]:i===0?[48,52,55]:null}));M4_play(s,ctx,w==='q'?q:w==='a'?a:[...q,...a],120)},tick:M4_tick},
 draw(s){
  let out=heading('A period: question, then answer');
  out+=TB(40,72,'Question (antecedent)',14,C.amber,'start')+M4_melody(M4_ANT,40,84,520,9,s.which==='q'||s.which==='b'?s.pos:-1,C.ink,C.coral);
  out+=TB(40,212,'Answer (consequent)',14,C.green,'start')+M4_melody(M4_CON,40,224,520,9,s.which==='a'?s.pos:s.which==='b'&&s.pos>=7?s.pos-7:-1,C.ink,C.coral);
  out+=R(470,62,90,22,C.amberp,'none',6)+TBF(515,78,'half cadence',12,C.amber)+R(470,202,90,22,C.greenp,'none',6)+TBF(515,218,'perfect cadence',12,C.green);
  out+=TF(300,360,'Same opening, different ending: the ear hears a question answered.',14,C.muted);
  return {svg:out,phase:'The question stops on D, the 2nd degree, over the dominant chord G: it sounds open. The answer begins identically but ends on C over the tonic chord: closed.'};
 }});

/* ---------- Lesson: sonata-form ---------- */
const M4_SONATA=[{id:'p1',sec:'Exposition',part:'First subject',a:0,b:12,key:'tonic'},{id:'tr',sec:'Exposition',part:'Transition',a:12,b:18,key:'moving'},{id:'p2',sec:'Exposition',part:'Second subject',a:18,b:30,key:'dominant'},{id:'cl',sec:'Exposition',part:'Closing',a:30,b:35,key:'dominant'},{id:'dev',sec:'Development',part:'Development',a:35,b:60,key:'wandering'},{id:'r1',sec:'Recapitulation',part:'First subject',a:60,b:72,key:'tonic'},{id:'rtr',sec:'Recapitulation',part:'Transition (altered)',a:72,b:78,key:'tonic'},{id:'r2',sec:'Recapitulation',part:'Second subject',a:78,b:90,key:'tonic'},{id:'coda',sec:'Coda',part:'Coda',a:90,b:100,key:'tonic'}];
const M4_KEYCOL={tonic:'#1772b7',dominant:'#2c776c',moving:'#9a6200',wandering:'#7156a6',relative:'#c45238'};
const M4_SONATA_SAY={p1:'The first subject sets out the home key with a strong, memorable theme.',tr:'The transition modulates, often energetically, towards the second key.',p2:'The second subject arrives in a contrasting key, usually the dominant in a major-key movement.',cl:'Closing material confirms the new key with cadences. The exposition is often repeated.',dev:'The development fragments the themes and travels through distant keys, building tension.',r1:'The recapitulation returns the first subject in the home key: the moment of homecoming.',rtr:'The transition is rewritten so that it no longer leaves home.',r2:'The second subject now comes back in the tonic, resolving the contrast of the exposition.',coda:'An optional coda adds a final affirmation of the tonic.'};
SCENE({id:'sonata-form',name:'Sonata form',tag:'Exposition, development, recapitulation',
 definition:'Sonata form is a common plan for the first movements of classical symphonies, sonatas and quartets: an exposition presents two subjects in contrasting keys, a development explores them, and a recapitulation brings both back in the home key.',
 example:'In a C major movement: first subject in C, second subject in G, development through several keys, then both subjects in C.',
 desc:'A horizontal timeline of a movement divided into exposition, development, recapitulation and coda, each part coloured by its key; a playhead moves along it and parts can be pressed.',
 research:['Rosen (1980/1988). Sonata Forms.','Hepokoski & Darcy (2006). Elements of Sonata Theory.'],
 dur:12,hint:'Press any part of the timeline to read what happens there and hear its key chord. Colours show the key: blue home, green dominant, purple wandering.',
 init:()=>({sel:'p2'}),
 watch(p){const pc=p*100;const cur=M4_SONATA.find(x=>pc>=x.a&&pc<=x.b)||M4_SONATA[8];return {sel:cur.id,head:p}},
 on:{part(s,v){s.sel=v;const sec=M4_SONATA.find(x=>x.id===v);const ch={tonic:[48,60,64,67],dominant:[43,59,62,67],moving:[50,62,66,69],wandering:[44,60,63,68]}[sec.key];AUDIO.chord(ch.map(midiHz),{dur:1,type:'triangle'})}},
 draw(s,f,X){
  let out=heading('The plan of a sonata-form movement (major key)');
  const x0=30,W=540,y=120;
  [['Exposition',0,35],['Development',35,60],['Recapitulation',60,90],['Coda',90,100]].forEach(([n,a,b])=>{const xa=x0+W*a/100,xb=x0+W*b/100;out+=L(xa,74,xa,96,C.line,1.5)+TB((xa+xb)/2,90,n,14,C.ink)});
  out+=L(x0+W,74,x0+W,96,C.line,1.5);
  M4_SONATA.forEach(p=>{const xa=x0+W*p.a/100,w=W*(p.b-p.a)/100,on=p.id===s.sel;out+=hit(X,'part',p.id,`${p.sec}: ${p.part}`,R(xa+1,y,w-2,56,M4_KEYCOL[p.key],on?C.ink:'none',6,`opacity="${on?1:.82}"`))});
  if(s.head!==undefined){const hx=x0+W*s.head;out+=L(hx,y-10,hx,y+66,C.ink,2.5)}
  // Repeat sign after exposition.
  const rx=x0+W*.35;out+=TBF(rx-6,y+80,':‖',14,C.muted);
  const sel=M4_SONATA.find(x=>x.id===s.sel);
  out+=R(40,210,520,74,'#fff',C.grid,10)+TB(300,236,`${sel.sec} · ${sel.part}`,17,M4_KEYCOL[sel.key])+TF(300,262,sel.key==='wandering'?'key: many keys, often far from home':'key: '+sel.key+(sel.key==='tonic'?' (home)':''),14,C.muted);
  [['tonic','home key'],['dominant','dominant'],['moving','moving'],['wandering','wandering']].forEach(([k,l],i)=>out+=R(70+i*120,306,16,16,M4_KEYCOL[k],'none',4)+TF(92+i*120,319,l,13,C.ink,'start'));
  out+=TF(300,352,'Proportions are typical, not fixed: real movements vary a lot.',13,C.muted);
  return {svg:out,phase:M4_SONATA_SAY[sel.id]};
 }});

SCENE({id:'sonata-form-keys',name:'Sonata form in major and minor',tag:'Where the second subject goes',
 definition:'The second subject’s key depends on the home key. In a major-key movement it is usually the dominant; in a minor-key movement it is usually the relative major. In the recapitulation both return to the tonic, so a minor-key second subject often returns in minor.',
 example:'C major home: second subject in G major. C minor home: second subject in E♭ major, returning in C minor (or sometimes C major).',
 desc:'Two parallel key plans, one for a major home key and one for minor, showing the key of each section and a chord you can hear.',
 research:['Rosen (1980/1988). Sonata Forms: tonal plans in major and minor.','Hepokoski & Darcy (2006). Elements of Sonata Theory: secondary-theme keys.'],
 dur:9,hint:'Choose a home key and press a section to hear its key. Watch the second subject change key between exposition and recapitulation.',
 init:()=>({home:'minor',sel:1}),
 watch(p){return {home:p<.5?'major':'minor',sel:Math.min(3,Math.floor((p*2%1)*4))}},
 ui:[{choose:[['major','C major home'],['minor','C minor home']],label:'Home key',get:s=>s.home,act:'home'}],
 on:{home(s,v){s.home=v},sec(s,v){s.sel=Number(v);const c=M4_KEYPLAN[s.home][s.sel].ch;AUDIO.chord(c.map(midiHz),{dur:1.1,type:'triangle'})}},
 draw(s,f,X){
  const plan=M4_KEYPLAN[s.home];let out=heading(s.home==='major'?'C major home: second subject in the dominant':'C minor home: second subject in the relative major');
  plan.forEach((p,i)=>{const x=40+i*132,on=i===s.sel;out+=hit(X,'sec',i,`${p.part} in ${p.key}`,R(x,90,120,130,p.col,on?C.ink:'none',10,`opacity="${on?1:.85}"`)+TBF(x+60,124,p.part,13,'#fff')+TB(x+60,170,p.key,22,'#fff'));
   if(i<3)out+=arrow(x+122,155,x+130,155,C.muted,2,6)});
  out+=TF(106,244,'exposition',13,C.muted)+TF(306,244,'development',13,C.muted)+TF(434,244,'recapitulation',13,C.muted);
  out+=R(40,270,520,76,'#fff',C.grid,10)+TB(300,298,`Second subject: ${plan[1].key} → ${plan[3].key}`,17,C.ink)+TF(300,324,s.home==='major'?'Contrast of tonic and dominant, resolved when both themes share the tonic.':'Major contrast in the exposition; the return in minor makes the ending darker.',14,C.muted);
  return {svg:out,phase:`${plan[s.sel].part}: ${plan[s.sel].key}. ${s.home==='minor'?'Minor-key movements usually move to the relative major, which shares the key signature.':'Major-key movements usually move to the dominant, a fifth higher.'}`};
 }});
const M4_KEYPLAN={major:[{part:'First subject',key:'C major',col:'#1772b7',ch:[48,60,64,67]},{part:'Second subject',key:'G major',col:'#2c776c',ch:[43,59,62,67]},{part:'Development',key:'many keys',col:'#7156a6',ch:[45,60,64,69]},{part:'Both subjects',key:'C major',col:'#1772b7',ch:[48,60,64,67]}],
 minor:[{part:'First subject',key:'C minor',col:'#1772b7',ch:[48,60,63,67]},{part:'Second subject',key:'E♭ major',col:'#c45238',ch:[51,63,67,70]},{part:'Development',key:'many keys',col:'#7156a6',ch:[44,60,63,68]},{part:'Both subjects',key:'C minor',col:'#1772b7',ch:[48,60,63,67]}]};

const M4_SONATA_HIST=[{y:1765,who:'Haydn',what:'Symphonies and string quartets help establish the plan (Haydn wrote over 100 symphonies).'},{y:1784,who:'Mozart',what:'Piano concertos and symphonies use two contrasting subjects with great flexibility.'},{y:1808,who:'Beethoven',what:'Symphony No. 5 stretches the development and coda far beyond earlier proportions.'},{y:1826,who:'Reicha',what:'Anton Reicha describes the form in his composition treatise, after the music existed.'},{y:1845,who:'A. B. Marx',what:'Adolf Bernhard Marx names and codifies “sonata form” in his textbook.'},{y:1846,who:'Clara Schumann',what:'Piano Trio in G minor, Op. 17: a sonata-form first movement by a leading pianist-composer.'},{y:1850,who:'Fanny Hensel',what:'Her Piano Trio, Op. 11, is published after her death in 1847.'}];
SCENE({id:'sonata-form-history',name:'Practice first, theory later',tag:'Who made sonata form',
 definition:'Composers developed sonata form in practice during the second half of the eighteenth century. The name and the textbook description came decades later, from theorists such as Reicha and A. B. Marx.',
 example:'Haydn and Mozart never used the term “sonata form”; Marx codified it in 1845, partly by describing Beethoven.',
 desc:'A timeline from 1760 to 1860 with dots for composers and theorists; pressing a dot shows a short note about their role.',
 research:['Marx (1845). Die Lehre von der musikalischen Komposition, vol. 3.','Reicha (1824–26). Traité de haute composition musicale.','Reich (1985). Clara Schumann: The Artist and the Woman.','Todd (2010). Fanny Hensel: The Other Mendelssohn.'],
 dur:10,hint:'Press each dot. Notice that the textbook description arrives long after the music that it describes.',
 init:()=>({sel:4}),
 watch(p){return {sel:Math.min(6,Math.floor(p*7))}},
 on:{pick(s,v){s.sel=Number(v)}},
 draw(s,f,X){
  let out=heading('Sonata form: practice first, theory later');const x=y=>40+520*(y-1760)/100;
  out+=L(40,150,560,150,C.line,3);for(let y=1760;y<=1860;y+=20)out+=L(x(y),144,x(y),156,C.line,2)+TF(x(y),176,y,13,C.muted);
  M4_SONATA_HIST.forEach((h,i)=>{const theory=['Reicha','A. B. Marx'].includes(h.who),cx=x(h.y),cy=theory?110:190,on=i===s.sel;out+=L(cx,150,cx,cy,C.line,1.5)+hit(X,'pick',i,`${h.who}, ${h.y}`,Ci(cx,cy,on?11:8,theory?C.purple:C.blue,on?C.ink:'none')+TF(cx,theory?cy-18:cy+26,h.who,13,C.ink))});
  out+=TF(50,72,'theorists',13,C.purple,'start')+TF(50,236,'composers',13,C.blue,'start');
  const h=M4_SONATA_HIST[s.sel];out+=R(40,262,520,86,'#fff',C.grid,10)+TB(300,290,`${h.y} · ${h.who}`,17,C.ink)+TF(300,316,h.what,14,C.ink);
  if(h.who==='Fanny Hensel'||h.who==='Clara Schumann')out+=TF(300,338,h.who==='Fanny Hensel'?'Family pressure kept most of her music unpublished in her lifetime; some songs appeared under Felix’s name.':'She also faced doubts about women composing, and later focused on performing.',12.5,C.muted);
  return {svg:out,phase:`${h.who} (${h.y}): ${h.what}`};
 }});

/* ---------- Lesson: theme-variation ---------- */
// "Ah! vous dirai-je, maman" (French folk song, public domain; tune of Twinkle Twinkle), first 8 bars.
const M4_TWINKLE=[0,0,4,4,5,5,4,3,3,2,2,1,1,0].map((st,i)=>({st,acc:0,dur:[6,13].includes(i)?2:1}));
const M4_VARS={
 theme:{n:M4_TWINKLE,say:'The theme: a simple folk tune in C major, two four-bar phrases.'},
 rhythm:{n:M4_TWINKLE.flatMap(n=>n.dur===2?[{...n,dur:.5},{...n,dur:.5},{...n,dur:1}]:[{...n,dur:.5},{...n,dur:.5}]),say:'Rhythmic variation: the same pitches, but each beat divided into quavers. Busier, same outline.'},
 ornament:{n:M4_TWINKLE.flatMap((n,i)=>{const nx=M4_TWINKLE[i+1];return n.dur===2||!nx?[n]:[{...n,dur:.5},{st:Math.round((n.st+nx.st)/2)===n.st?n.st+1:Math.round((n.st+nx.st)/2),acc:0,dur:.5}]}),say:'Melodic ornament: passing and neighbour notes fill the gaps, the way Mozart decorates the tune.'},
 minor:{n:M4_TWINKLE.map(n=>({...n,acc:[2,5,6].includes(((n.st%7)+7)%7)?-1:0})),say:'Change of mode: the tune in C minor. E, A and B are lowered. A classic variation set nearly always includes one minor variation.'},
 harmony:{n:M4_TWINKLE.map((n,i)=>({...n,chord:[[48,52,55],null,[45,48,52],null,[41,45,48],null,[48,52,55],[41,45,50],null,[48,52,55],null,[43,47,50],null,[48,52,55]][i]})),say:'New harmony: the melody is unchanged, but the chords underneath change colour (C, A minor, F…).'}};
SCENE({id:'theme-variation',name:'Theme and variations',tag:'Same tune, new clothes',
 definition:'Theme and variations is a form in which a theme is stated and then repeated several times, each time changed in rhythm, melody, mode, harmony or texture while staying recognisable.',
 example:'Mozart wrote twelve variations (K. 265, around 1781) on the French song “Ah! vous dirai-je, maman”, the tune English speakers know as Twinkle, Twinkle, Little Star.',
 desc:'The first eight bars of a folk theme on a staff, rewritten according to the chosen variation, with a short explanation of what changed.',
 research:['Mozart (c. 1781). Twelve Variations on “Ah! vous dirai-je, maman”, K. 265.','Sisman (2001). Variations. Grove Music Online.'],
 dur:12,hint:'Choose a variation and press Play. Listen for what stays the same: usually the melody’s outline or the phrase structure.',
 init:()=>({v:'ornament',pos:-1}),
 watch(p){const ks=Object.keys(M4_VARS);return {v:ks[Math.min(4,Math.floor(p*5))],pos:-1}},
 ui:[{choose:Object.keys(M4_VARS).map(k=>[k,k==='theme'?'Theme':k==='rhythm'?'Rhythm':k==='ornament'?'Ornament':k==='minor'?'Minor':'Harmony']),label:'Variation',get:s=>s.v,act:'v'},{b:'Play ▶',act:'play'}],
 on:{v(s,v){s.v=v;s.pos=-1},play(s,a,ctx){M4_play(s,ctx,M4_VARS[s.v].n,s.v==='rhythm'?100:120)},tick:M4_tick},
 draw(s){
  const notes=M4_VARS[s.v].n;let out=heading(s.v==='theme'?'The theme':'Variation: '+s.v);
  out+=M4_melody(notes,20,74,560,10,s.pos,C.ink,C.coral);
  if(s.v==='harmony'){let bt=0;const beats=sum(notes.map(n=>n.dur));notes.forEach(n=>{if(n.chord)out+=TBF(60+500*(bt+.35)/beats,190,noteName(n.chord[0]).replace(/\d/,'')+(n.chord[1]-n.chord[0]===3?'m':''),14,C.purple);bt+=n.dur})}
  out+=R(40,214,520,70,'#fff',C.grid,10)+TF(300,244,M4_VARS[s.v].say.split(':')[0],16,C.ink,'middle','font-weight="700"')+TF(300,268,M4_VARS[s.v].say.split(':').slice(1).join(':').trim().slice(0,84),13.5,C.muted);
  out+=TF(300,318,'Mozart’s set (K. 265, c. 1781) has twelve variations on this tune.',14,C.muted);
  return {svg:out,phase:M4_VARS[s.v].say};
 }});

SCENE({id:'theme-variation-build',name:'Build your own variation',tag:'Change one thing at a time',
 definition:'Each variation keeps some elements of the theme and changes others. Choosing which elements to keep is what makes a variation set hang together.',
 example:'Keep the melody and change the mode; keep the harmony and change the rhythm; or keep only the bass line, as in a passacaglia.',
 desc:'A control panel of four switches (mode, rhythm, tempo, octave) and a matrix showing which elements of the theme are kept or changed, above the resulting melody.',
 research:['Sisman (2001). Variations. Grove Music Online: melodic, harmonic and character variation types.','Schoenberg (1967). Fundamentals of Musical Composition: the theme and variations.'],
 dur:9,hint:'Turn changes on and off, then Play. The matrix shows how much of the theme survives; with every change on, is it still recognisable?',
 init:()=>({minor:true,rhythm:false,fast:false,octave:false,pos:-1}),
 watch(p){const k=Math.floor(p*5);return {minor:k>=1,rhythm:k>=2,fast:k>=3,octave:k>=4,pos:-1}},
 ui:[{b:'Mode',act:'tog',arg:'minor'},{b:'Rhythm',act:'tog',arg:'rhythm'},{b:'Tempo',act:'tog',arg:'fast'},{b:'Octave',act:'tog',arg:'octave'},{b:'Play ▶',act:'play'}],
 on:{tog(s,k){s[k]=!s[k];s.pos=-1},play(s,a,ctx){M4_play(s,ctx,M4_build(s),s.fast?168:112,{shift:s.octave?12:0})},tick:M4_tick},
 draw(s){
  let out=heading('Which parts of the theme survive?');
  const rows=[['Melody outline',!s.minor&&!s.rhythm],['Notes of the scale',!s.minor],['Rhythm',!s.rhythm],['Tempo',!s.fast],['Register',!s.octave],['Phrase lengths',true]];
  rows.forEach(([n,keep],i)=>{const y=60+i*26;out+=TF(140,y+16,n,14,C.ink,'end')+R(160,y,90,22,keep?C.greenp:C.coralp,'none',6)+TBF(205,y+16,keep?'kept':'changed',13,keep?C.green:C.coral)});
  const kept=rows.filter(r=>r[1]).length;out+=counter(300,60,'elements kept',kept+' of 6',kept>=3?C.green:C.coral,130)+TF(470,82,kept<=2?'barely recognisable':kept<=4?'clearly a variation':'close to the theme',14,C.muted);
  out+=M4_melody(M4_build(s),20,236,560,9,s.pos,C.ink,C.coral);
  return {svg:out,phase:`${kept} of 6 elements kept. ${kept<=2?'Change too much and listeners lose the thread; most variation sets keep the phrase lengths and harmony.':'Enough survives for listeners to follow the theme.'}`};
 }});
function M4_build(s){let n=M4_TWINKLE.map(x=>({...x}));if(s.minor)n=n.map(x=>({...x,acc:[2,5,6].includes(((x.st%7)+7)%7)?-1:0}));if(s.rhythm)n=n.flatMap(x=>x.dur===2?[{...x,dur:1.5},{...x,dur:.5}]:[{...x,dur:.75},{...x,dur:.25}]);return n}

const M4_SETS=[{y:1741,who:'J. S. Bach',what:'Goldberg Variations, BWV 988',n:'30 variations on a bass line, framed by an aria'},{y:1781,who:'Mozart',what:'Variations on “Ah! vous dirai-je, maman”, K. 265',n:'12 variations on a folk tune (dated c. 1781)'},{y:1823,who:'Beethoven',what:'Diabelli Variations, Op. 120',n:'33 variations on a waltz by Anton Diabelli'},{y:1853,who:'Clara Schumann',what:'Variations on a Theme by Robert Schumann, Op. 20',n:'7 variations on a theme by her husband'},{y:1861,who:'Brahms',what:'Variations and Fugue on a Theme by Handel, Op. 24',n:'25 variations and a fugue'}];
SCENE({id:'theme-variation-sets',name:'Famous variation sets',tag:'A form that lasted',
 definition:'Theme and variations was popular from the Baroque to the Romantic era and beyond, for display, teaching and tribute. Composers often varied themes by others, including friends and family.',
 example:'Clara Schumann’s Op. 20 (1853) varies a theme by Robert Schumann; Brahms then wrote variations on the same theme (Op. 9) as a tribute to both.',
 desc:'A timeline of five well-known variation sets from 1741 to 1861 with bars sized by the number of variations; pressing one shows details.',
 research:['Sisman (2001). Variations. Grove Music Online.','Reich (1985). Clara Schumann: The Artist and the Woman.','Kinderman (1987). Beethoven’s Diabelli Variations.'],
 dur:9,hint:'Press a bar to read about the set. Bar height shows the number of variations.',
 init:()=>({sel:3}),
 watch(p){return {sel:Math.min(4,Math.floor(p*5))}},
 on:{pick(s,v){s.sel=Number(v)}},
 draw(s,f,X){
  let out=heading('Five variation sets across 120 years');const nums=[30,12,33,7,25];
  M4_SETS.forEach((v,i)=>{const x=60+i*100,h=nums[i]*5,on=i===s.sel;out+=hit(X,'pick',i,`${v.who}, ${v.y}`,R(x,230-h,70,h,on?C.purple:C.purplep,on?C.ink:'none',6)+TBF(x+35,224-h,nums[i],15,C.purple));out+=TF(x+35,252,v.who,13,C.ink)+TF(x+35,270,v.y,13,C.muted)});
  const v=M4_SETS[s.sel];out+=R(40,288,520,62,'#fff',C.grid,10)+TB(300,312,v.what,15,C.ink)+TF(300,336,v.n,14,C.muted);
  return {svg:out,phase:`${v.who} (${v.y}): ${v.what}. ${v.n}.`};
 }});

/* ---------- Lesson: orchestration ---------- */
const M4_SEATS=[{fam:'strings',n:'1st violins',x:150,y:270,col:'#2c776c'},{fam:'strings',n:'2nd violins',x:205,y:215,col:'#2c776c'},{fam:'strings',n:'violas',x:395,y:215,col:'#2c776c'},{fam:'strings',n:'cellos',x:450,y:270,col:'#2c776c'},{fam:'strings',n:'double basses',x:500,y:200,col:'#2c776c'},
 {fam:'woodwind',n:'flutes',x:270,y:175,col:'#1772b7'},{fam:'woodwind',n:'oboes',x:330,y:175,col:'#1772b7'},{fam:'woodwind',n:'clarinets',x:270,y:140,col:'#1772b7'},{fam:'woodwind',n:'bassoons',x:330,y:140,col:'#1772b7'},
 {fam:'brass',n:'horns',x:185,y:125,col:'#9a6200'},{fam:'brass',n:'trumpets',x:290,y:100,col:'#9a6200'},{fam:'brass',n:'trombones',x:355,y:100,col:'#9a6200'},{fam:'brass',n:'tuba',x:415,y:110,col:'#9a6200'},
 {fam:'percussion',n:'timpani',x:300,y:68,col:'#c45238'},{fam:'percussion',n:'percussion',x:410,y:66,col:'#c45238'}];
const M4_FAM={strings:'Strings: the largest family, playing most of the time. Many players per part.',woodwind:'Woodwind: flutes, oboes, clarinets and bassoons, usually two of each in a classical orchestra.',brass:'Brass: horns, trumpets, trombones and tuba. Loud, so seated at the back.',percussion:'Percussion: timpani tuned to the key, plus drums and cymbals added in the 1800s.'};
SCENE({id:'orchestration',name:'The orchestra',tag:'Families of instruments',
 definition:'A symphony orchestra groups instruments into four families: strings, woodwind, brass and percussion. Seating puts the quieter, more numerous strings at the front and the loud brass and percussion at the back.',
 example:'A late-1700s orchestra might have about 30–40 players; by the late 1800s orchestras of 80–100 were common.',
 desc:'A plan of a concert stage with the conductor at the front and coloured groups for each section; pressing a family highlights its sections.',
 research:['Berlioz (1844). Grand traité d’instrumentation et d’orchestration modernes.','Spitzer & Zaslaw (2004). The Birth of the Orchestra: History of an Institution, 1650–1815.'],
 dur:9,hint:'Press a family. This is one common seating plan; orchestras arrange themselves in several ways.',
 init:()=>({fam:'woodwind'}),
 watch(p){const fs=Object.keys(M4_FAM);return {fam:fs[Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:Object.keys(M4_FAM).map(f=>[f,f[0].toUpperCase()+f.slice(1)]),label:'Family',get:s=>s.fam,act:'fam'}],
 on:{fam(s,v){s.fam=v}},
 draw(s,f,X){
  let out=heading('One common seating plan');
  out+=P('M60 320 Q300 10 540 320 Z',C.line,2,'#f7f9fa');
  M4_SEATS.forEach(seat=>{const on=seat.fam===s.fam;out+=hit(X,'fam',seat.fam,`${seat.n} (${seat.fam})`,Ci(seat.x,seat.y,on?22:18,on?seat.col:tint(seat.col,.65),on?C.ink:'none'))+TF(seat.x,seat.y+(seat.y>250?36:-26)+(seat.y<90?52:0),seat.n,12.5,on?C.ink:C.muted)});
  out+=R(270,318,60,22,C.dark,'none',6)+TBF(300,334,'conductor',12,'#fff');
  out+=R(40,352,520,24,'none','none',0)+TF(300,368,M4_FAM[s.fam],13.5,C.ink);
  return {svg:out,phase:M4_FAM[s.fam]+' Seating varies; this is one widely used layout.'};
 }});

// Approximate sounding ranges (MIDI numbers); illustrative partial strengths for each timbre.
const M4_INST=[{n:'Piccolo',lo:74,hi:108,col:'#1772b7',p:[1,.15,.05]},{n:'Flute',lo:60,hi:96,col:'#1772b7',p:[1,.25,.1,.04]},{n:'Oboe',lo:58,hi:91,col:'#1772b7',p:[1,.9,.8,.6,.5,.35,.25]},{n:'Clarinet',lo:50,hi:91,col:'#1772b7',p:[1,.05,.6,.05,.4,.05,.25]},{n:'Bassoon',lo:34,hi:75,col:'#1772b7',p:[.6,1,.7,.5,.4,.3]},
 {n:'Horn',lo:35,hi:77,col:'#9a6200',p:[1,.6,.35,.2,.1]},{n:'Trumpet',lo:52,hi:84,col:'#9a6200',p:[1,.85,.7,.6,.5,.4,.3,.2]},{n:'Trombone',lo:40,hi:72,col:'#9a6200',p:[1,.8,.6,.5,.4,.3]},{n:'Tuba',lo:26,hi:65,col:'#9a6200',p:[1,.6,.3,.15]},
 {n:'Violin',lo:55,hi:100,col:'#2c776c',p:[1,.5,.33,.25,.2,.16,.14]},{n:'Viola',lo:48,hi:88,col:'#2c776c',p:[1,.6,.4,.3,.2,.15]},{n:'Cello',lo:36,hi:81,col:'#2c776c',p:[1,.7,.5,.35,.25,.2]},{n:'Double bass',lo:28,hi:67,col:'#2c776c',p:[1,.7,.45,.3,.2]}];
SCENE({id:'orchestration-ranges',name:'Instrument ranges',tag:'Who can play this note?',
 definition:'Each instrument has a range of notes it can play. Orchestrators choose instruments partly by range: a melody high up suits violin or flute; a deep bass line suits cello, double bass, bassoon or tuba.',
 example:'Middle C (C4) lies within the range of nine of these thirteen instruments; a top C (C7) leaves only the piccolo, flute and violin.',
 desc:'Horizontal bars showing the approximate sounding range of thirteen orchestral instruments against a keyboard axis, with a movable note line marking which can play it.',
 research:['Adler (2016). The Study of Orchestration, 4th edn: instrument ranges.','Berlioz (1844). Grand traité d’instrumentation et d’orchestration modernes.'],
 dur:10,hint:'Slide the note. Instruments that can play it light up; press one to hear the note in an illustrative synthetic timbre. Ranges are approximate.',
 init:()=>({m:60,sel:9}),
 watch(p){return {m:Math.round(28+p*78),sel:-1}},
 ui:[{range:'m',label:'Note',min:26,max:108,get:s=>s.m,act:'note',show:v=>noteName(v)}],
 on:{note(s,v){s.m=v},inst(s,i){s.sel=Number(i);const ins=M4_INST[s.sel];if(s.m>=ins.lo&&s.m<=ins.hi)AUDIO.tone(midiHz(s.m),{dur:1,partials:ins.p,gain:.14})}},
 draw(s,f,X){
  let out=heading('Approximate sounding ranges');const x0=130,W=440,lo=24,hi=110,xm=m=>x0+W*(m-lo)/(hi-lo);
  M4_INST.forEach((ins,i)=>{const y=52+i*21,can=s.m>=ins.lo&&s.m<=ins.hi;out+=TF(x0-8,y+13,ins.n,12.5,can?C.ink:C.muted,'end')+hit(X,'inst',i,`${ins.n}, ${noteName(ins.lo)} to ${noteName(ins.hi)}`,R(xm(ins.lo),y+2,xm(ins.hi)-xm(ins.lo),14,can?ins.col:tint(ins.col,.7),i===s.sel?C.ink:'none',4))});
  for(let m=24;m<=108;m+=12)out+=L(xm(m),48,xm(m),330,'#e4ecf0',1)+TF(xm(m),346,'C'+(m/12-1),12.5,C.muted);
  out+=L(xm(s.m),44,xm(s.m),332,C.coral,2.5)+TBF(xm(s.m),364,noteName(s.m)+' · '+midiHz(s.m).toFixed(0)+' Hz',13,C.coral);
  const n=M4_INST.filter(i=>s.m>=i.lo&&s.m<=i.hi).length;
  return {svg:out,phase:`${noteName(s.m)} (${midiHz(s.m).toFixed(1)} Hz): ${n} of ${M4_INST.length} instruments can play it. Ranges are approximate and vary with the player and the instrument.`};
 }});

const M4_DOUBLE=['Flute','Oboe','Clarinet','Violin','Horn'];
SCENE({id:'orchestration-doubling',name:'Doubling and blending',tag:'Mixing instrumental colours',
 definition:'Orchestrators often give the same melody to two or more instruments at once (doubling). Because each instrument has its own pattern of overtones, the combination makes a new colour; Berlioz’s 1844 treatise is a famous guide to these blends.',
 example:'Flute and oboe together sound brighter and more focused than either alone; violin doubled by clarinet sounds warmer.',
 desc:'Checkboxes for five instruments and a spectrum chart adding up their harmonic strengths into the blended timbre of a single note.',
 research:['Berlioz (1844). Grand traité d’instrumentation et d’orchestration modernes.','Helmholtz (1863). Die Lehre von den Tonempfindungen: timbre as the pattern of partials.'],
 dur:10,hint:'Switch instruments on and off and press Play. The bars add each instrument’s overtones. These timbres are simplified illustrations, not recordings.',
 init:()=>({on:{Flute:true,Oboe:true}}),
 watch(p){const k=Math.floor(p*5);const on={};M4_DOUBLE.slice(0,k+1).forEach(n=>on[n]=true);return {on}},
 ui:M4_DOUBLE.map(n=>({b:n,act:'tog',arg:n})).concat([{b:'Play ▶',act:'play'}]),
 on:{tog(s,n){s.on={...s.on,[n]:!s.on[n]}},play(s){const list=M4_DOUBLE.filter(n=>s.on[n]);const notes=[{m:67,at:0},{m:72,at:.5},{m:76,at:1},{m:74,at:1.5}];list.forEach(n=>{const ins=M4_INST.find(i=>i.n===n);notes.forEach(x=>AUDIO.tone(midiHz(x.m),{at:x.at,dur:.48,partials:ins.p,gain:.12/Math.sqrt(list.length)}))})}},
 draw(s,f,X){
  const list=M4_DOUBLE.filter(n=>s.on[n]);let out=heading(list.length?list.join(' + '):'Choose instruments to double the melody');
  const H=8,tot=new Array(H).fill(0);list.forEach(n=>{const p=M4_INST.find(i=>i.n===n).p;for(let h=0;h<H;h++)tot[h]+=p[h]||0});
  const mx=Math.max(1,...tot);
  for(let h=0;h<H;h++){const x=150+h*50;let y=300;list.forEach(n=>{const ins=M4_INST.find(i=>i.n===n),v=(ins.p[h]||0)/mx*200;out+=R(x,y-v,36,v,ins.col,'#fff',2,`opacity="${.45+.11*list.indexOf(n)}"`);y-=v});out+=TF(x+18,320,h+1,13,C.muted)}
  out+=TF(300,346,'harmonic number (1 = the note you hear as the pitch)',13,C.muted)+L(140,300,560,300,C.line,1.5);
  M4_DOUBLE.forEach((n,i)=>out+=R(24,64+i*30,16,16,s.on[n]?M4_INST.find(x=>x.n===n).col:'#fff',C.line,4)+TF(48,77+i*30,n,13,s.on[n]?C.ink:C.muted,'start'));
  const odd=list.length===1&&list[0]==='Clarinet';
  return {svg:out,phase:list.length?`${list.join(' and ')}: the stacked bars are the blended overtone pattern.${odd?' The clarinet alone has strong odd harmonics and weak even ones, giving its hollow tone.':' A new pattern means a new colour, even though the pitch is the same.'} (Illustrative timbres.)`:'Switch on at least one instrument.'};
 }});
