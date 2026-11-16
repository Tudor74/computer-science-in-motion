/* ===================== Music era 3 · Harmony (1600–1750) ===================== */
// Shared helpers (prefix M3_): spelling notes by letter, drawing staves and keyboards, and gentle playback.
const M3_NAT=[0,2,4,5,7,9,11],M3_LET='CDEFGAB';
const M3_ACC={'-2':'♭♭','-1':'♭','0':'','1':'♯','2':'♯♯'};
// Default spelling for each pitch class: [letter index, accidental].
const M3_ROOT=[[0,0],[1,-1],[1,0],[2,-1],[2,0],[3,0],[3,1],[4,0],[5,-1],[5,0],[6,-1],[6,0]];
const M3_INT=['unison','minor 2nd','major 2nd','minor 3rd','major 3rd','perfect 4th','tritone','perfect 5th','minor 6th','major 6th','minor 7th','major 7th','octave'];
const M3_OFF=[0,1,1,2,2,3,3,4,5,5,6,6,7];          // letters spanned by each interval (tritone as an augmented 4th)
const M3_NUM=[1,2,2,3,3,4,4,5,6,6,7,7,8];
const M3_JUST=[[1,1],[16,15],[9,8],[6,5],[5,4],[4,3],[45,32],[3,2],[8,5],[5,3],[9,5],[15,8],[2,1]];
const M3_PARTIALS=[1,.42,.22,.12,.07];
const M3_pc=m=>((m%12)+12)%12;
const M3_isBlack=m=>[1,3,6,8,10].includes(M3_pc(m));
function M3_spell(m,step){const o=Math.floor(step/7),L=step-7*o;return {step,a:m-(M3_NAT[L]+12*(o+1)),m}}
function M3_root(m){const [L,a]=M3_ROOT[M3_pc(m)],o=Math.floor((m-a-M3_NAT[L])/12)-1;return M3_spell(m,L+7*o)}
function M3_nm(n,oct=true){const L=((n.step%7)+7)%7;return M3_LET[L]+(M3_ACC[n.a]||'?')+(oct?Math.floor(n.step/7):'')}
function M3_intName(s){return s<=12?M3_INT[s]:s===24?'two octaves':'octave + '+M3_INT[s-12]}
function M3_upper(lo,s){return M3_spell(lo.m+s,lo.step+(s>12?7+M3_OFF[s-12]:M3_OFF[s]))}
function M3_class(s){const r=M3_pc(s);
 if(r===0||r===7)return {k:'perfect consonance',col:C.green,fill:C.greenp};
 if([3,4,8,9].includes(r))return {k:'imperfect consonance',col:C.blue,fill:C.pale};
 if(r===5)return {k:'consonant, but unstable over the bass',col:C.amber,fill:C.amberp};
 return {k:'dissonance',col:C.coral,fill:C.coralp}}
// Staff: treble bottom line is E4 (diatonic step 30), bass bottom line G2 (step 18). Clefs are drawn as the
// letters they grew from (G and F), not with a music font.
const M3_TREB=30,M3_BASS=18;
const M3_y=(step,base,yB,g)=>yB-(step-base)*g/2;
function M3_staff(x1,x2,yB,g,clef='treble'){
 let o='';for(let i=0;i<5;i++)o+=L(x1,yB-i*g,x2,yB-i*g,C.muted,1.2);
 o+=L(x1,yB,x1,yB-4*g,C.muted,1.2)+L(x2,yB,x2,yB-4*g,C.muted,1.2);
 const ly=clef==='bass'?yB-3*g:yB-g;
 o+=TBF(x1+15,ly+7,clef==='bass'?'F':'G',21,C.purple)+Ci(x1+26,ly,2.2,C.purple);
 return o;
}
function M3_acc(x,y,a,g,col){
 if(a>=1){const s=g*.42;let o=P(`M${fmt(x-s*.45)} ${fmt(y-g*.9)}V${fmt(y+g*.95)}M${fmt(x+s*.45)} ${fmt(y-g*1.05)}V${fmt(y+g*.8)}M${fmt(x-s*1.05)} ${fmt(y-g*.22)}L${fmt(x+s*1.05)} ${fmt(y-g*.42)}M${fmt(x-s*1.05)} ${fmt(y+g*.42)}L${fmt(x+s*1.05)} ${fmt(y+g*.22)}`,col,1.4);
  if(a===2)o+=M3_acc(x-g*.9,y,1,g,col);return o}
 if(a<=-1){let o=P(`M${fmt(x-g*.28)} ${fmt(y-g*1.35)}V${fmt(y+g*.45)}Q${fmt(x+g*.6)} ${fmt(y-g*.05)} ${fmt(x+g*.32)} ${fmt(y-g*.35)}Q${fmt(x+g*.02)} ${fmt(y-g*.6)} ${fmt(x-g*.28)} ${fmt(y-g*.05)}`,col,1.4);
  if(a===-2)o+=M3_acc(x-g*.75,y,-1,g,col);return o}
 return '';
}
function M3_ledgers(x,step,base,yB,g){let o='';
 for(let s=base-2;s>=step;s-=2){const yy=M3_y(s,base,yB,g);o+=L(x-g*1.1,yy,x+g*1.1,yy,C.ink,1.3)}
 for(let s=base+10;s<=step;s+=2){const yy=M3_y(s,base,yB,g);o+=L(x-g*1.1,yy,x+g*1.1,yy,C.ink,1.3)}
 return o}
// A note head. dur: 'w' whole (hollow, no stem), 'h' half (hollow + stem), 'q' crotchet (filled + stem).
function M3_head(x,n,base,yB,g,col,dur='w',accShift=0){
 const y=M3_y(n.step,base,yB,g),filled=dur==='q';let o=M3_ledgers(x,n.step,base,yB,g);
 o+=`<ellipse cx="${fmt(x)}" cy="${fmt(y)}" rx="${fmt(g*.66)}" ry="${fmt(g*.45)}" fill="${filled?col:'#fff'}" stroke="${col}" stroke-width="2.2" transform="rotate(-18 ${fmt(x)} ${fmt(y)})"/>`;
 if(dur==='h'||dur==='q')o+=L(x+g*.6,y-g*.15,x+g*.6,y-g*3.4,col,1.6);
 if(n.a)o+=M3_acc(x-g*1.55-accShift,y,n.a,g,col);
 return o;
}
// Several notes at one moment; seconds are offset sideways as on a printed chord.
function M3_chord(x,notes,base,yB,g,col){
 let o='',prev=-99,shifted=false;
 notes.slice().sort((a,b)=>a.step-b.step).forEach((n,i)=>{shifted=(n.step-prev===1)&&!shifted;prev=n.step;
  o+=M3_head(x+(shifted?g*1.3:0),n,base,yB,g,typeof col==='function'?col(n,i):col,'w',i%2?g*.9:0)});
 return o;
}
// A keyboard from midi lo to hi. col(m) returns a fill for a lit key or null.
function M3_keys(X,act,x0,y0,w,h,lo,hi,col){
 if(!act)X=null;
 const whites=[];for(let m=lo;m<=hi;m++)if(!M3_isBlack(m))whites.push(m);
 const ww=w/whites.length;let o='',b='';
 whites.forEach((m,i)=>{const c=col(m),x=x0+i*ww;
  o+=hit(X,act,m,`${noteName(m)}${c?', marked':''}. Press to choose.`,R(x,y0,ww-1.5,h,c||'#fff',c?C.ink:C.line,3));
  if(M3_pc(m)===0)o+=TF(x+ww/2,y0+h-8,noteName(m),12,c?'#fff':C.muted)});
 for(let m=lo;m<=hi;m++)if(M3_isBlack(m)){const i=whites.indexOf(m-1);if(i<0)continue;const c=col(m),x=x0+(i+1)*ww-ww*.31;
  b+=hit(X,act,m,`${noteName(m)}${c?', marked':''}. Press to choose.`,R(x,y0,ww*.6,h*.6,c||C.dark,C.ink,2))}
 return o+b;
}
const M3_tone=(ms,o={})=>AUDIO.chord(ms.map(midiHz),{dur:1.3,partials:M3_PARTIALS,...o});
function M3_arp(ms,step=.32,o={}){ms.forEach((m,i)=>AUDIO.tone(midiHz(m),{dur:.5,partials:M3_PARTIALS,gain:.14,at:(o.at||0)+i*step}))}

/* ---------------- Intervals ---------------- */
SCENE({id:'intervals',name:'Interval',tag:'The distance between two notes',
 definition:'An interval is the distance in pitch between two notes, counted in semitones and named by how many letter names it spans.',
 example:'C up to G spans five letter names (C D E F G) and seven semitones: a perfect fifth. C up to E♭ is a minor third, three semitones.',
 desc:'A two-octave keyboard with two marked keys, the same two notes on a stave, and the interval’s name, size in semitones and consonance class.',
 research:'Zarlino (1558). Le istitutioni harmoniche: the consonances are built from the ratios of the numbers 1 to 6 (the senario).',
 dur:13,hint:'Press two keys: the first press sets one note, the next press the other. Play sounds them one after the other, then together.',
 init:()=>({a:60,b:67,next:0}),
 watch(p){return {a:60,b:60+Math.min(12,Math.floor(p*13)),next:0}},
 ui:[{b:'Play',act:'play'}],
 on:{key(s,m){m=Number(m);if(s.next===0){s.a=m;s.next=1}else{s.b=m;s.next=0}},
  play(s){const lo=Math.min(s.a,s.b),hi=Math.max(s.a,s.b);M3_arp([lo,hi],.55);M3_tone([lo,hi],{at:1.2,dur:1.4});return 'keep'}},
 draw(s,f,X){
  const lo=Math.min(s.a,s.b),hi=Math.max(s.a,s.b),n=hi-lo,ln=M3_root(lo),un=M3_upper(ln,n),cls=M3_class(n),g=12,yB=150;
  let out=heading('How far apart are two notes?');
  out+=M3_staff(40,300,yB,g);
  out+=M3_head(110,ln,M3_TREB,yB,g,C.coral)+M3_head(175,un,M3_TREB,yB,g,C.blue)+M3_chord(250,[ln,un],M3_TREB,yB,g,n=>n===ln?C.coral:C.blue);
  out+=T(110,yB+40,M3_nm(ln),14,C.coral)+T(175,yB+40,M3_nm(un),14,C.blue)+T(250,yB+40,'together',13,C.muted);
  out+=TB(455,82,M3_intName(n),22,C.ink)+TF(455,108,`${n} semitone${n===1?'':'s'} · ${n>12?'over an octave':M3_NUM[n]+' letter'+(M3_NUM[n]===1?'':'s')}`,14,C.muted);
  out+=R(340,124,230,34,cls.fill,cls.col,17)+TBF(455,146,cls.k,13,cls.col);
  out+=M3_keys(X,'key',30,210,540,118,60,84,m=>m===s.a?C.coral:m===s.b?C.blue:null);
  return {svg:out,phase:`${M3_nm(ln)} to ${M3_nm(un)}: ${n} semitone${n===1?'':'s'}, a ${M3_intName(n)} (${cls.k}). Counting letters names the interval; counting semitones gives its exact size.`};
 }});

const M3_ORDER=[12,7,5,9,4,3,8,2,10,11,1,6];
SCENE({id:'intervals-consonance',name:'Why some intervals blend',tag:'Simple ratios, short patterns',
 definition:'Consonant intervals have frequencies in simple whole-number ratios, so their combined wave repeats after only a few cycles.',
 example:'A fifth is 3 : 2, so the pair lines up again every 2 cycles of the lower note. A minor second is 16 : 15 and needs 15 cycles.',
 desc:'Two sine waves for an interval’s lower and upper notes, and their sum, with dashed lines where the combined pattern repeats.',
 research:['Zarlino (1558). Le istitutioni harmoniche.','Helmholtz (1863). On the Sensations of Tone: consonance and shared harmonics.','Plomp & Levelt (1965). Tonal consonance and critical bandwidth, JASA 38.'],
 dur:14,hint:'Slide through the intervals and watch how long the combined wave takes to repeat. Play sounds the just-tuned pair.',
 init:()=>({i:7}),
 watch(p){return {i:M3_ORDER[Math.min(11,Math.floor(p*12))]}},
 ui:[{range:'i',label:'Interval',min:1,max:12,get:s=>s.i,act:'set',show:v=>M3_INT[v]},{b:'Play',act:'play'}],
 on:{set(s,v){s.i=v},play(s){const [n,d]=M3_JUST[s.i];AUDIO.chord([220,220*n/d],{dur:1.8,gain:.16});return 'keep'}},
 draw(s){
  const [n,d]=M3_JUST[s.i],x0=50,W=500,cyc=8,et=Math.pow(2,s.i/12);
  let out=heading(`${M3_INT[s.i]}: frequencies in the ratio ${n} : ${d}`);
  const wave=(y,amp,fn,col,w)=>{let d0='';for(let k=0;k<=400;k++){const t=k/400*cyc,yy=y-amp*fn(t);d0+=(k?'L':'M')+fmt(x0+k/400*W)+' '+fmt(yy)}return P(d0,col,w)};
  out+=TF(x0,58,'lower note',13,C.coral,'start')+wave(80,16,t=>Math.sin(2*Math.PI*t),C.coral,1.8);
  out+=TF(x0,112,'upper note',13,C.blue,'start')+wave(136,16,t=>Math.sin(2*Math.PI*t*n/d),C.blue,1.8);
  out+=TF(x0,176,'both together',13,C.ink,'start')+wave(228,24,t=>(Math.sin(2*Math.PI*t)+Math.sin(2*Math.PI*t*n/d))/2*1.6,C.ink,2.2);
  for(let k=0;k*d<=cyc;k++){const x=x0+W*(k*d)/cyc;out+=L(x,186,x,272,C.green,1.6,'stroke-dasharray="5 4"')}
  out+=TF(x0+W,290,`${cyc} cycles of the lower note`,13,C.muted,'end');
  const msg=d<=cyc?`The combined wave repeats every ${d} cycle${d===1?'':'s'} of the lower note.`:`The combined wave repeats only every ${d} cycles of the lower note, off this chart.`;
  out+=T(300,318,msg,16,d<=cyc?C.green:C.coral);
  out+=T(300,346,`Just ratio ${fmt(n/d)} · equal-tempered ${et.toFixed(3)} (close, but not exact)`,14,C.muted);
  return {svg:out,phase:`${msg} Simple ratios share many harmonics, which is one reason many listeners hear them as smooth. Culture and familiarity also shape what sounds consonant.`};
 }});

const M3_INV_ROWS=[[1,11],[2,10],[3,9],[4,8],[5,7],[6,6]];
SCENE({id:'intervals-inversion',name:'Inverting an interval',tag:'Flip the lower note up an octave',
 definition:'Inverting an interval moves its lower note up an octave. The two intervals add up to an octave: 12 semitones, and their numbers add to 9.',
 example:'C–E is a major third (4). Inverted, E–C is a minor sixth (8): 4 + 8 = 12, and 3 + 6 = 9. Major becomes minor; perfect stays perfect.',
 desc:'An interval on the left and its inversion on the right, with a table of all six pairs.',
 research:'Rameau (1722). Traité de l’harmonie: inversion as the key to treating chords by their root.',
 dur:12,hint:'Choose an interval with the slider or press a row of the table. Play sounds the interval, then its inversion.',
 init:()=>({i:4}),
 watch(p){return {i:[4,3,7,2,1,6][Math.min(5,Math.floor(p*6))]}},
 ui:[{range:'i',label:'Interval',min:1,max:11,get:s=>s.i,act:'set',show:v=>M3_INT[v]},{b:'Play',act:'play'}],
 on:{set(s,v){s.i=v},row(s,v){s.i=Number(v)},play(s){M3_tone([60,60+s.i],{dur:1});M3_tone([60+s.i,72],{at:1.2,dur:1});return 'keep'}},
 draw(s,f,X){
  const g=11,yB=130,i=s.i,j=12-i,c4=M3_root(60),up=M3_upper(c4,i),c5=M3_spell(72,c4.step+7);
  let out=heading('Inversion: the two intervals make an octave');
  out+=M3_staff(40,270,yB,g)+M3_chord(150,[c4,up],M3_TREB,yB,g,n=>n===c4?C.coral:C.blue);
  out+=M3_staff(330,560,yB,g)+M3_chord(445,[up,c5],M3_TREB,yB,g,n=>n===c5?C.coral:C.blue);
  out+=curveArrow(175,yB+28,420,yB+28,30,C.coral,2)+TF(298,yB+72,'lower note moves up an octave',13,C.coral);
  out+=T(150,58,`${M3_INT[i]} (${i})`,16,C.ink)+T(445,58,`${M3_INT[j]} (${j})`,16,C.ink);
  M3_INV_ROWS.forEach(([a,b],r)=>{const x=40+(r%3)*180,y=232+Math.floor(r/3)*44,on=a===i||b===i;
   out+=hit(X,'row',a,`${M3_INT[a]} and ${M3_INT[b]}`,R(x,y,170,36,on?C.amberp:'#fff',on?C.amber:C.grid,8)+TF(x+85,y+23,`${M3_INT[a].replace('perfect ','P').replace('major ','M').replace('minor ','m')} ↔ ${M3_INT[b].replace('perfect ','P').replace('major ','M').replace('minor ','m')}`,13,C.ink))});
  out+=T(300,345,`${i} + ${j} = 12 semitones · ${M3_NUM[i]} + ${M3_NUM[j]} = 9 · major ↔ minor, perfect ↔ perfect`,14,C.muted);
  return {svg:out,phase:`${M3_INT[i]} inverts to ${M3_INT[j]}. Inversion keeps the same two pitch letters but swaps which is on the bottom, which is why Rameau could treat C–E and E–C as the same harmony.`};
 }});

/* ---------------- Triads and chords ---------------- */
const M3_Q={maj:{n:'major',iv:[4,7]},min:{n:'minor',iv:[3,7]},dim:{n:'diminished',iv:[3,6]},aug:{n:'augmented',iv:[4,8]}};
const M3_THIRD=s=>s===4?'major 3rd':s===3?'minor 3rd':s+' semitones';
SCENE({id:'triads-chords',name:'Triad',tag:'Chords stacked in thirds',
 definition:'A triad is a chord of three notes stacked in thirds: a root, the third above it and the fifth above it.',
 example:'C–E–G is C major: a major third (4 semitones) with a minor third (3) on top. Swap the order of the thirds, C–E♭–G, and it becomes C minor.',
 desc:'A triad on a stave with brackets naming each stacked third, the outer fifth, and the same notes lit on a keyboard.',
 research:['Zarlino (1558): the major and minor triads as the two divisions of the fifth.','Rameau (1722). Traité de l’harmonie: chords built from thirds above a fundamental root.'],
 dur:14,hint:'Press any key for the root and choose a quality. Play sounds the chord, then its notes one by one.',
 init:()=>({root:60,q:'maj'}),
 watch(p){const k=Math.floor(p*8);return {root:k<4?60:67,q:['maj','min','dim','aug'][k%4]}},
 ui:[{choose:[['maj','Major'],['min','Minor'],['dim','Diminished'],['aug','Augmented']],label:'Quality',get:s=>s.q,act:'q'},{b:'Play',act:'play'}],
 on:{q(s,v){s.q=v},key(s,m){m=Number(m);s.root=m>75?m-12:m},play(s){const ms=[0,...M3_Q[s.q].iv].map(x=>s.root+x);M3_tone(ms);M3_arp(ms,.35,{at:1.4});return 'keep'}},
 draw(s,f,X){
  const q=M3_Q[s.q],r=M3_root(s.root),t3=M3_spell(s.root+q.iv[0],r.step+2),t5=M3_spell(s.root+q.iv[1],r.step+4),g=12,yB=165,cols=[C.coral,C.blue,C.green];
  let out=heading(`${M3_nm(r,false)} ${q.n}: ${M3_nm(r,false)} – ${M3_nm(t3,false)} – ${M3_nm(t5,false)}`);
  out+=M3_staff(40,240,yB,g)+M3_chord(150,[r,t3,t5],M3_TREB,yB,g,(n,i)=>cols[i]);
  const ys=[r,t3,t5].map(n=>M3_y(n.step,M3_TREB,yB,g));
  out+=P(`M262 ${fmt(ys[0])}H270V${fmt(ys[1])}H262`,C.blue,1.6)+TF(278,(ys[0]+ys[1])/2+5,`${M3_THIRD(q.iv[0])} (${q.iv[0]})`,13,C.blue,'start');
  out+=P(`M262 ${fmt(ys[1]-2)}H270V${fmt(ys[2])}H262`,C.green,1.6)+TF(278,(ys[1]+ys[2])/2+5,`${M3_THIRD(q.iv[1]-q.iv[0])} (${q.iv[1]-q.iv[0]})`,13,C.green,'start');
  const fifth=q.iv[1]===7?'perfect 5th':q.iv[1]===6?'diminished 5th':'augmented 5th';
  out+=R(400,82,170,92,'#fff',C.grid,9)+TF(485,104,'outer interval',13,C.muted)+TB(485,130,fifth,16,C.ink)+TF(485,156,`${q.iv[1]} semitones`,13,C.muted);
  out+=M3_keys(X,'key',30,232,540,100,60,83,m=>m===s.root?cols[0]:m===s.root+q.iv[0]?cols[1]:m===s.root+q.iv[1]?cols[2]:null);
  const feel={maj:'bright and stable to most Western ears',min:'darker, though still stable',dim:'tense: it wants to move',aug:'unsettled and floating'}[s.q];
  return {svg:out,phase:`Root ${M3_nm(r,false)} (coral), third ${M3_nm(t3,false)} (blue), fifth ${M3_nm(t5,false)} (green). The order of the two thirds decides the quality: ${q.n} sounds ${feel}; these associations are learned, not universal.`};
 }});

const M3_FIG={tri:[['5','3'],['6','3'],['6','4']],sev:[['7',''],['6','5'],['4','3'],['4','2']]};
const M3_INVN=['root position','first inversion','second inversion','third inversion'];
SCENE({id:'triads-chords-inversions',name:'Inversions and sevenths',tag:'Which note is in the bass?',
 definition:'A chord is inverted when a note other than its root is the lowest. A seventh chord adds a fourth note, a third above the fifth.',
 example:'C–E–G with E in the bass is C major in first inversion (figured 6/3). G–B–D–F is a dominant seventh: a major triad plus a minor seventh.',
 desc:'A chord on a stave with its bass note circled, its figured-bass numbers below and the same notes on a keyboard.',
 research:['Rameau (1722). Traité de l’harmonie: one chord, several inversions.','Figured bass as practised in the continuo era (c. 1600–1750).'],
 dur:13,hint:'Choose triad or seventh, the root and the inversion. The circled note is the bass. Play sounds the chord from the bass up.',
 init:()=>({root:67,kind:'sev',inv:0}),
 watch(p){const k=Math.min(6,Math.floor(p*7));return k<3?{root:60,kind:'tri',inv:k}:{root:67,kind:'sev',inv:k-3}},
 ui:[{choose:[['tri','Triad'],['sev','Seventh']],label:'Chord',get:s=>s.kind,act:'kind'},{choose:[[60,'C'],[65,'F'],[67,'G']],label:'Root',get:s=>s.root,act:'root'},{choose:[[0,'Root'],[1,'1st'],[2,'2nd'],[3,'3rd']],label:'Inversion',get:s=>s.inv,act:'inv'},{b:'Play',act:'play'}],
 on:{kind(s,v){s.kind=v;if(v==='tri'&&s.inv>2)s.inv=2},root(s,v){s.root=Number(v)},inv(s,v){s.inv=Math.min(Number(v),s.kind==='tri'?2:3)},
  play(s){const ns=M3_invNotes(s);M3_arp(ns.map(n=>n.m),.3);M3_tone(ns.map(n=>n.m),{at:ns.length*.3+.2});return 'keep'}},
 draw(s,f,X){
  const ns=M3_invNotes(s),r=M3_root(s.root),g=12,yB=165,bass=ns[0];
  let out=heading(`${M3_nm(r,false)} ${s.kind==='tri'?'major':'dominant seventh'}, ${M3_INVN[s.inv]}`);
  out+=M3_staff(40,300,yB,g)+M3_chord(170,ns,M3_TREB,yB,g,n=>n===bass?C.coral:n.m%12===s.root%12?C.purple:C.blue);
  out+=Ci(170,M3_y(bass.step,M3_TREB,yB,g),g*1.1,'none',C.coral,'stroke-dasharray="3 3"');
  const fig=M3_FIG[s.kind][s.inv];out+=TB(170,yB+42,fig[0],17,C.ink)+(fig[1]?TB(170,yB+68,fig[1],17,C.ink):'');
  out+=TF(240,yB+50,'figures',13,C.muted,'start');
  out+=R(345,70,225,100,'#fff',C.grid,9)+TF(457,94,'in the bass',13,C.muted)+TB(457,122,M3_nm(bass,false),22,C.coral)+TF(457,150,s.inv===0?'the root':['','the third','the fifth','the seventh'][s.inv],14,C.ink);
  out+=M3_keys(X,null,30,240,540,95,48,95,m=>ns.some(n=>n.m===m)?(m===bass.m?C.coral:C.blue):null);
  return {svg:out,phase:`The notes are the same letters in every inversion; only the bass changes. Continuo players read the figures under the bass (${fig.filter(Boolean).join('/')}) and filled in the harmony above.`};
 }});
function M3_invNotes(s){
 const iv=s.kind==='tri'?[0,4,7]:[0,4,7,10],steps=[0,2,4,6],r=M3_root(s.root);
 let ns=iv.map((v,i)=>M3_spell(s.root+v,r.step+steps[i]));
 for(let k=0;k<s.inv;k++){const n=ns.shift();ns.push(M3_spell(n.m+12,n.step+7))}
 if(ns[ns.length-1].m>84)ns=ns.map(n=>M3_spell(n.m-12,n.step-7));
 return ns;
}

const M3_KEYS={C:{m:60,step:28},G:{m:55,step:25},D:{m:62,step:29},F:{m:65,step:31},'B♭':{m:58,step:27}};
const M3_SCALE=[0,2,4,5,7,9,11],M3_RN=['I','II','III','IV','V','VI','VII'];
function M3_degree(key,d,sev){const k=M3_KEYS[key],tonic=M3_spell(k.m,k.step),out=[];
 for(let j=0;j<(sev?4:3);j++){const deg=d+2*j,oct=Math.floor(deg/7);out.push(M3_spell(k.m+M3_SCALE[deg%7]+12*oct,tonic.step+deg))}return out}
function M3_quality(ns){const a=ns[1].m-ns[0].m,b=ns[2].m-ns[0].m,c=ns[3]?ns[3].m-ns[0].m:null;
 const tri=a===4&&b===7?'maj':a===3&&b===7?'min':a===3&&b===6?'dim':'aug';return {tri,sev:c}}
function M3_roman(d,ns){const q=M3_quality(ns);let r=M3_RN[d];if(q.tri==='min'||q.tri==='dim')r=r.toLowerCase();
 if(q.sev===null)return r+(q.tri==='dim'?'°':q.tri==='aug'?'+':'');
 if(q.tri==='dim')return r+(q.sev===10?'ø7':'°7');return r+'7'}
SCENE({id:'triads-chords-roman',name:'Chords in a key',tag:'Roman numerals I to vii°',
 definition:'Building a triad on each note of a major scale gives seven chords. Roman numerals name them by scale degree: capitals for major, small letters for minor, ° for diminished.',
 example:'In C major: I = C, ii = Dm, iii = Em, IV = F, V = G, vi = Am, vii° = B diminished. The same pattern, I ii iii IV V vi vii°, holds in every major key.',
 desc:'Seven triads built on the notes of a major scale, each with its Roman numeral, coloured by quality.',
 research:['Gottfried Weber (1817–21). Versuch einer geordneten Theorie der Tonsetzkunst: Roman-numeral chord labels.','Rameau (1722): chords related by their roots.'],
 dur:14,hint:'Choose a key, add sevenths if you like, and press a chord to hear it.',
 init:()=>({key:'C',sev:false,d:4}),
 watch(p){const d=Math.min(6,Math.floor(p*7));return {key:'C',sev:p>.999,d}},
 ui:[{choose:Object.keys(M3_KEYS).map(k=>[k,k+' major']),label:'Key',get:s=>s.key,act:'key'},{choose:[['tri','Triads'],['sev','Sevenths']],label:'Chords',get:s=>s.sev?'sev':'tri',act:'sev'}],
 on:{key(s,v){s.key=v},sev(s,v){s.sev=v==='sev'},deg(s,v){s.d=Number(v);M3_tone(M3_degree(s.key,s.d,s.sev).map(n=>n.m));return 'keep'}},
 draw(s,f,X){
  const g=11,yB=170,qc={maj:C.blue,min:C.green,dim:C.coral,aug:C.purple};
  let out=heading(`The seven chords of ${s.key} major`)+M3_staff(30,575,yB,g);
  for(let d=0;d<7;d++){const ns=M3_degree(s.key,d,s.sev),q=M3_quality(ns).tri,x=105+d*68,on=d===s.d;
   out+=hit(X,'deg',d,`${M3_roman(d,ns)} chord. Press to play.`,R(x-30,58,60,180,on?C.amberp:'transparent',on?C.amber:'none',8)+M3_chord(x,ns,M3_TREB,yB,g,qc[q]));
   out+=TB(x,268,M3_roman(d,ns),17,qc[q])+TF(x,288,M3_nm(ns[0],false)+({maj:'',min:'m',dim:'dim',aug:'aug'}[q]),13,C.muted)}
  out+=TF(120,325,'major',13,C.blue)+TF(210,325,'minor',13,C.green)+TF(310,325,'diminished',13,C.coral);
  const sel=M3_degree(s.key,s.d,s.sev);
  return {svg:out,phase:`${M3_roman(s.d,sel)} in ${s.key} major is ${sel.map(n=>M3_nm(n,false)).join('–')}. Three chords are major (I, IV, V), three minor (ii, iii, vi) and one diminished (vii°), in every major key.`};
 }});

/* ---------------- Cadences ---------------- */
// SATB voicings in C major, ordered bass, tenor, alto, soprano.
const M3_CAD={
 perfect:{n:'Perfect cadence',rn:['V','I'],ch:[[43,62,67,71],[48,64,67,72]],feel:'finished: a full stop'},
 plagal:{n:'Plagal cadence',rn:['IV','I'],ch:[[53,65,69,72],[48,64,67,72]],feel:'gentle and final: the “Amen” of hymns'},
 imperfect:{n:'Imperfect cadence',rn:['I','V'],ch:[[48,64,67,72],[43,62,67,71]],feel:'open: a comma or a question'},
 interrupted:{n:'Interrupted cadence',rn:['V','vi'],ch:[[43,62,67,71],[45,60,64,72]],feel:'a surprise: the ear expected I'}};
const M3_VOICE=[{n:'bass',c:C.coral},{n:'tenor',c:C.purple},{n:'alto',c:C.green},{n:'soprano',c:C.blue}];
function M3_grand(out,xs,chords,opts={}){ // chords: arrays of midi (B,T,A,S); draws a grand staff with voice colours
 const g=11,yT=112,yBs=200;out+=M3_staff(40,560,yT,g,'treble')+M3_staff(40,560,yBs,g,'bass')+L(40,yT-4*g,40,yBs,C.muted,1.6);
 chords.forEach((ch,ci)=>{if(!ch)return;ch.forEach((m,v)=>{const n=M3_root(m),onT=v>=2,col=(opts.voiceCol||(vv=>M3_VOICE[vv].c))(v,ci);
  out+=M3_head(xs[ci]+(v===1&&ch[2]-ch[1]<=2?14:0),n,onT?M3_TREB:M3_BASS,onT?yT:yBs,g,col,'w')})});
 if(opts.lines)for(let ci=0;ci+1<chords.length;ci++){const a=chords[ci],b=chords[ci+1];if(!a||!b)continue;
  a.forEach((m,v)=>{if(opts.lines!==true&&!opts.lines(v))return;const onT=v>=2,base=onT?M3_TREB:M3_BASS,yb=onT?yT:yBs,y1=M3_y(M3_root(m).step,base,yb,g),y2=M3_y(M3_root(b[v]).step,base,yb,g);
   out+=L(xs[ci]+12,y1,xs[ci+1]-12,y2,M3_VOICE[v].c,1.6,'stroke-dasharray="5 4" opacity=".8"')})}
 return out;
}
SCENE({id:'cadences',name:'Cadence',tag:'How a phrase comes to rest',
 definition:'A cadence is the pair of chords that ends a musical phrase. Different pairs sound finished, open or surprising.',
 example:'V–I (perfect) closes like a full stop; IV–I (plagal) is the “Amen”; ending on V (imperfect) asks a question; V–vi (interrupted) dodges the expected I.',
 desc:'A grand stave with two four-part chords in C major, each voice in its own colour, with dashed lines showing how each voice moves.',
 research:['Rameau (1722). Traité de l’harmonie: cadence parfaite, cadence irrégulière and cadence rompue.','Caplin (1998). Classical Form.'],
 dur:14,hint:'Choose a cadence and press Play to hear its two chords.',
 init:()=>({c:'perfect'}),
 watch(p){return {c:['perfect','plagal','imperfect','interrupted'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:[['perfect','Perfect'],['plagal','Plagal'],['imperfect','Imperfect'],['interrupted','Interrupted']],label:'Cadence',get:s=>s.c,act:'c'},{b:'Play',act:'play'}],
 on:{c(s,v){s.c=v},play(s){const c=M3_CAD[s.c];M3_tone(c.ch[0],{dur:1});M3_tone(c.ch[1],{at:1.1,dur:1.6});return 'keep'}},
 draw(s){
  const c=M3_CAD[s.c];let out=heading(`${c.n}: ${c.rn[0]} → ${c.rn[1]} in C major`);
  out=M3_grand(out,[230,390],c.ch,{lines:true});
  out+=TB(230,248,c.rn[0],19,C.ink)+TB(390,248,c.rn[1],19,C.ink)+arrow(262,243,355,243,C.muted,1.6);
  M3_VOICE.slice().reverse().forEach((v,i)=>out+=Ci(470,64+i*22,5,v.c)+TF(482,69+i*22,v.n,13,C.ink,'start'));
  out+=R(80,282,440,46,'#fff',C.grid,10)+T(300,311,`Sounds ${c.feel}.`,16,C.ink);
  out+=TF(300,352,s.c==='plagal'?'The plagal cadence closes many hymns on the word “Amen”.':s.c==='interrupted'?'The bass rises a step to A instead of falling to C.':s.c==='imperfect'?'Phrases that end on V invite an answering phrase.':'The soprano’s B rises to C: the leading note goes home.',13,C.muted);
  return {svg:out,phase:`${c.n}: ${c.rn.join(' to ')}. It sounds ${c.feel}. Notice how little the upper voices move: most go by step or stay put.`};
 }});

const M3_V7=[[43,62,65,71],[48,60,64,72]];
const M3_VL=[null,{v:3,say:'The leading note B (soprano) rises a semitone to C, the tonic.'},{v:2,say:'The seventh F (alto) falls a semitone to E.'},
 {v:1,say:'D (tenor) falls a step to C.'},{v:0,say:'The bass leaps from G down to C, the strongest root move.'},{v:-1,say:'Every upper voice moved by step: smooth voice leading.'}];
SCENE({id:'cadences-voice-leading',name:'Voice leading',tag:'Each voice takes the shortest path',
 definition:'Voice leading is how each individual line moves from chord to chord. Good voice leading moves voices by step and resolves tense notes the way they lean.',
 example:'In V7 → I in C, the leading note B rises to C and the seventh F falls to E, each by a semitone. The bass leaps G → C.',
 desc:'A dominant seventh resolving to the tonic on a grand stave, one voice at a time, with the moving voice highlighted.',
 research:['Rameau (1722). Traité de l’harmonie.','Huron (2001). Tone and voice: a derivation of the rules of voice-leading from perceptual principles, Music Perception 19(1).'],
 dur:14,hint:'Step through to move one voice at a time. Play sounds V7 then I.',
 init:()=>({}),
 trace(){return M3_VL.map((x,k)=>({k,x,say:x?x.say:'A dominant seventh (G–B–D–F) in four voices. Each voice will move on its own.'}))},
 ui:[{b:'Play',act:'play'}],
 on:{play(){M3_tone(M3_V7[0],{dur:1});M3_tone(M3_V7[1],{at:1.1,dur:1.6});return 'keep'}},
 draw(s,f){
  const k=f.k,done=v=>{const idx=M3_VL.findIndex(x=>x&&x.v===v);return idx>0&&idx<=k},cur=f.x&&f.x.v;
  let out=heading('V7 → I in C major, one voice at a time');
  const second=M3_V7[1].map((m,v)=>done(v)||k===5?m:null);
  out=M3_grand(out,[230,390],[M3_V7[0],second.some(x=>x!==null)?second.map((m,v)=>m===null?M3_V7[0][v]:m):null],
   {voiceCol:(v,ci)=>ci===1&&second[v]===null?'#c7d3da':(cur===v||k===5?M3_VOICE[v].c:ci===0?M3_VOICE[v].c:M3_VOICE[v].c),lines:v=>done(v)||k===5});
  out+=TB(230,248,'V7',19,C.ink)+TB(390,248,'I',19,C.ink);
  if(cur!==undefined&&cur!==null&&cur>=0){out+=R(450,62,125,40,'#fff',M3_VOICE[cur].c,10)+TB(512,88,M3_VOICE[cur].n,15,M3_VOICE[cur].c)}
  out+=R(60,282,480,48,'#fff',C.grid,10)+T(300,311,f.say,14,C.ink);
  return {svg:out,phase:f.say+' Huron (2001) argues these rules help the ear hear each voice as a separate stream.'};
 }});

const M3_MEL=[76,77,79,74,76,77,74,72],M3_CHD=[[48,55,64],[53,60,65],[48,55,64],[43,55,62],[48,55,64],[53,60,65],[43,55,62],[48,55,64]];
const M3_CHN=['I','IV','I','V','I','IV','V','I'];
function M3_phrase(s){const mel=M3_MEL.slice(),ch=M3_CHD.map(c=>c.slice()),rn=M3_CHN.slice();
 if(s.endA==='perfect'){mel[2]=74;ch[2]=[43,55,62];rn[2]='V';mel[3]=72;ch[3]=[48,55,64];rn[3]='I'}
 if(s.endB==='interrupted'){mel[7]=72;ch[7]=[45,57,64];rn[7]='vi'}
 return {mel,ch,rn}}
SCENE({id:'cadences-phrase',name:'Question and answer',tag:'Phrases end with cadences',
 definition:'Many melodies come in pairs of phrases: the first ends on an open cadence like a question, the second on a closed one like an answer.',
 example:'An eight-bar tune whose bar 4 ends on V (imperfect) and bar 8 on I (perfect) forms an antecedent and consequent: a musical period.',
 desc:'An eight-bar melody on a stave with chord numerals under each bar and a playhead; the two phrase endings are highlighted.',
 research:'Caplin (1998). Classical Form: the period, an antecedent answered by a consequent.',
 dur:14,hint:'Choose how each phrase ends and press Play. Listen for which ending sounds like a question.',
 init:()=>({endA:'imperfect',endB:'perfect',ph:-1}),
 watch(p){return {endA:p<.5?'imperfect':'perfect',endB:'perfect',ph:(p*2%1)*8}},
 ui:[{choose:[['imperfect','Bar 4: open (V)'],['perfect','Bar 4: closed (I)']],label:'First phrase',get:s=>s.endA,act:'a'},{choose:[['perfect','Bar 8: I'],['interrupted','Bar 8: vi']],label:'Second phrase',get:s=>s.endB,act:'b'},{b:'Play',act:'play'}],
 on:{a(s,v){s.endA=v},b(s,v){s.endB=v},
  play(s,a,ctx){const {mel,ch}=M3_phrase(s);mel.forEach((m,i)=>{AUDIO.tone(midiHz(m),{dur:.68,at:i*.7,gain:.16,partials:M3_PARTIALS});AUDIO.chord(ch[i].map(midiHz),{dur:.68,at:i*.7,gain:.1})});
   s.t0=performance.now();s.ph=0;ctx.every(50,'tick');return 'keep'},
  tick(s){s.ph=(performance.now()-s.t0)/700;if(s.ph>=8){s.ph=-1;return 'stop'}return 'keep'}},
 draw(s){
  const {mel,rn}=M3_phrase(s),g=11,yB=150,x0=70,bw=62;let out=heading('A period: question, then answer');
  out+=M3_staff(30,x0+8*bw+8,yB,g);
  for(let i=0;i<8;i++){const x=x0+i*bw+30,end=i===3||i===7,cur=s.ph>=i&&s.ph<i+1;
   if(end)out+=R(x-27,58,54,200,i===3?C.amberp:C.greenp,'none',8);
   out+=M3_head(x,M3_root(mel[i]),M3_TREB,yB,g,cur?C.coral:C.ink);
   out+=TB(x,yB+44,rn[i],16,end?(i===3?C.amber:C.green):C.ink);
   if(i<7)out+=L(x0+(i+1)*bw,yB,x0+(i+1)*bw,yB-4*g,C.muted,1.2)}
  out+=L(x0+8*bw,yB,x0+8*bw,yB-4*g,C.ink,2.6);
  if(s.ph>=0){const x=x0+s.ph*bw;out+=L(x,52,x,yB+56,C.coral,2)}
  out+=TF(x0+2*bw,272,'antecedent (bars 1–4)',13,C.amber)+TF(x0+6*bw,272,'consequent (bars 5–8)',13,C.green);
  const qa=s.endA==='imperfect'?'Bar 4 stops on V: an open question.':'Bar 4 already closes on I, so the answer has nothing to answer.';
  const ans=s.endB==='perfect'?'Bar 8 closes on I: the answer.':'Bar 8 swerves to vi: the answer is delayed, and the tune feels unfinished.';
  out+=T(300,312,qa,15,C.ink)+T(300,338,ans,15,C.ink);
  return {svg:out,phase:`${qa} ${ans} Phrases built this way are found throughout Classical music and in many folk songs.`};
 }});

/* ---------------- Counterpoint ---------------- */
const M3_CF=[62,65,64,62,67,65,69,67,65,64,62];          // Fux’s Dorian cantus firmus
const M3_FUX=[69,69,67,69,71,72,72,71,74,73,74];         // a classic first-species line above it, after Fux
const M3_WHITE=m=>!M3_isBlack(m);
function M3_cpSpell(m){return m===73?M3_spell(73,35):M3_root(m)}
function M3_check(cp){
 const issues=[],marks=cp.map(()=>null),n=cp.length;
 for(let i=0;i<n;i++){if(cp[i]==null)continue;const d=cp[i]-M3_CF[i],r=M3_pc(d);
  if(d<0){issues.push(`Bar ${i+1}: the counterpoint crosses below the cantus firmus.`);marks[i]='bad';continue}
  if(![0,3,4,7,8,9].includes(r)){issues.push(`Bar ${i+1}: ${M3_INT[r]||'dissonance'} is a dissonance; first species uses only consonances.`);marks[i]='bad'}
  if(d===0&&i>0&&i<n-1){issues.push(`Bar ${i+1}: a unison in the middle loses the second voice.`);marks[i]='bad'}
  if(i>0&&cp[i-1]!=null){const p=cp[i-1]-M3_CF[i-1],rp=M3_pc(p),up=cp[i]-cp[i-1],low=M3_CF[i]-M3_CF[i-1];
   if((rp===7&&r===7)||(rp===0&&r===0)){if(Math.sign(up)===Math.sign(low)&&up!==0){issues.push(`Bars ${i}–${i+1}: parallel ${r===7?'fifths':'octaves'}; the two voices stop sounding independent.`);marks[i]='bad'}}
   const leap=Math.abs(up);if(leap>12||[6,10,11].includes(leap)){issues.push(`Bars ${i}–${i+1}: a leap of ${M3_INT[Math.min(12,leap)]||leap+' semitones'} is hard to sing.`);marks[i]=marks[i]||'warn'}}}
 if(cp[0]!=null&&![0,7].includes(M3_pc(cp[0]-M3_CF[0])))issues.unshift('Bar 1: begin on a perfect consonance (unison, fifth or octave).');
 if(cp[n-1]!=null&&M3_pc(cp[n-1]-M3_CF[n-1])!==0)issues.push(`Bar ${n}: end on the unison or octave.`);
 if(cp[n-2]!=null&&cp[n-2]===72)issues.push(`Bar ${n-1}: in Dorian on D, raise C to C♯ so the leading note rises to D (musica ficta).`);
 return {issues,marks};
}
SCENE({id:'counterpoint',name:'Counterpoint',tag:'Note against note',
 definition:'Counterpoint is the art of combining independent melodic lines. In first species, one note sounds against each note of a given melody, the cantus firmus.',
 example:'Against Fux’s cantus firmus D F E D G F A G F E D, a line beginning on A and ending C♯–D uses only consonances and avoids parallel fifths and octaves.',
 desc:'A cantus firmus in grey and a counterpoint line in blue on one stave, with interval numbers under each bar and a checker listing any broken rules.',
 research:['Fux (1725). Gradus ad Parnassum; English translation by Alfred Mann, The Study of Counterpoint.','Huron (2001). Tone and voice, Music Perception 19(1).'],
 dur:16,hint:'Use ▲ and ▼ above each bar to move your line. The checker flags dissonances, parallel fifths and octaves and awkward leaps. Play sings both lines.',
 init:()=>({cp:M3_FUX.slice()}),
 watch(p){const k=Math.min(11,1+Math.floor(p*11));return {cp:M3_FUX.map((m,i)=>i<k?m:null)}},
 ui:[{b:'Play',act:'play'},{b:'Fux’s line',act:'fux'},{b:'Parallel octaves',act:'octaves'},{b:'Raise or lower bar 10',act:'ficta'}],
 on:{up(s,i){i=Number(i);let m=s.cp[i]===73?72:s.cp[i];do{m++}while(!M3_WHITE(m));s.cp[i]=Math.min(81,m)},
  down(s,i){i=Number(i);let m=s.cp[i]===73?72:s.cp[i];do{m--}while(!M3_WHITE(m));s.cp[i]=Math.max(62,m)},
  fux(s){s.cp=M3_FUX.slice()},octaves(s){s.cp=M3_CF.map(m=>m+12)},
  ficta(s){if(s.cp[9]===72)s.cp[9]=73;else if(s.cp[9]===73)s.cp[9]=72},
  play(s){s.cp.forEach((m,i)=>{AUDIO.tone(midiHz(M3_CF[i]),{dur:.62,at:i*.65,gain:.12,partials:M3_PARTIALS});if(m!=null)AUDIO.tone(midiHz(m),{dur:.62,at:i*.65,gain:.13,type:'triangle'})});return 'keep'}},
 draw(s,f,X){
  const g=12,yB=175,x0=92,bw=44,{issues,marks}=M3_check(s.cp);let out=heading('First species: one note against each note');
  out+=M3_staff(30,575,yB,g);
  M3_CF.forEach((m,i)=>{const x=x0+i*bw;out+=M3_head(x,M3_root(m),M3_TREB,yB,g,'#8fa3ae');
   if(i<10)out+=L(x+bw/2,yB,x+bw/2,yB-4*g,C.line,1);
   const c=s.cp[i];if(c!=null){const col=marks[i]==='bad'?C.coral:marks[i]==='warn'?C.amber:C.blue;out+=M3_head(x,M3_cpSpell(c),M3_TREB,yB,g,col);
    const d=M3_cpSpell(c).step-M3_root(m).step,num=d===0?1:(d%7===0?8:d%7+1);out+=TB(x,yB+34,String(num),15,col)}
   if(X.try){out+=hit(X,'up',i,`Raise bar ${i+1}`,Ci(x,64,11,C.pale,C.line)+P(`M${x-5} ${68}L${x} ${60}L${x+5} ${68}Z`,C.ink,1,C.ink));
    out+=hit(X,'down',i,`Lower bar ${i+1}`,Ci(x,92,11,C.pale,C.line)+P(`M${x-5} ${88}L${x} ${96}L${x+5} ${88}Z`,C.ink,1,C.ink))}});
  out+=TF(30,yB+34,'interval',13,C.muted,'start');
  out+=Ci(100,232,5,'#8fa3ae')+TF(110,237,'cantus firmus (given)',13,C.muted,'start')+Ci(300,232,5,C.blue)+TF(310,237,'counterpoint',13,C.muted,'start');
  const shown=issues.slice(0,4);
  if(s.cp.some(m=>m==null))out+=T(300,276,'Building the line one bar at a time…',15,C.muted);
  else if(!issues.length)out+=R(100,258,400,40,C.greenp,C.green,10)+TB(300,284,'No rules broken: a correct first-species line.',15,C.green);
  else shown.forEach((t,i)=>out+=TF(40,272+i*20,'• '+t,13,C.coral,'start'));
  if(issues.length>4)out+=TF(40,352,`…and ${issues.length-4} more.`,13,C.muted,'start');
  return {svg:out,phase:issues.length?`${issues.length} problem${issues.length>1?'s':''}: ${issues[0]}`:'Every bar is a consonance, the line starts and ends on perfect consonances, and it never moves in parallel fifths or octaves with the cantus.'};
 }});

const M3_MOT={parallel:{u:[72,74,76,77],l:[65,67,69,70],say:'Parallel motion: both voices move the same way by the same interval. In parallel fifths they blend into one.'},
 similar:{u:[72,76,79,81],l:[60,62,64,67],say:'Similar motion: same direction, different distances.'},
 contrary:{u:[72,74,76,77],l:[60,59,57,55],say:'Contrary motion: one rises while the other falls; the most independent.'},
 oblique:{u:[72,74,76,74],l:[60,60,60,60],say:'Oblique motion: one voice holds while the other moves.'}};
SCENE({id:'counterpoint-motion',name:'Kinds of motion',tag:'Parallel, similar, contrary, oblique',
 definition:'Two voices can move in parallel (same direction, same interval), similar (same direction), contrary (opposite directions) or oblique (one stays still) motion.',
 example:'Contrary motion keeps voices distinct; parallel fifths and octaves make two voices sound like one thickened line, which is why strict counterpoint forbids them.',
 desc:'Two four-note voices on a stave with arrows showing their directions, and the interval between them at each step.',
 research:['Fux (1725). Gradus ad Parnassum.','Huron (2001). Tone and voice: parallel perfect intervals fuse perceptually, Music Perception 19(1).'],
 dur:13,hint:'Choose a kind of motion and press Play.',
 init:()=>({k:'contrary'}),
 watch(p){return {k:['parallel','similar','contrary','oblique'][Math.min(3,Math.floor(p*4))]}},
 ui:[{choose:[['parallel','Parallel'],['similar','Similar'],['contrary','Contrary'],['oblique','Oblique']],label:'Motion',get:s=>s.k,act:'k'},{b:'Play',act:'play'}],
 on:{k(s,v){s.k=v},play(s){const m=M3_MOT[s.k];m.u.forEach((u,i)=>{AUDIO.tone(midiHz(u),{dur:.62,at:i*.66,gain:.13,type:'triangle'});AUDIO.tone(midiHz(m.l[i]),{dur:.62,at:i*.66,gain:.12,partials:M3_PARTIALS})});return 'keep'}},
 draw(s){
  const m=M3_MOT[s.k],g=12,yB=190,xs=[150,250,350,450];let out=heading(s.k[0].toUpperCase()+s.k.slice(1)+' motion');
  out+=M3_staff(60,540,yB,g);
  xs.forEach((x,i)=>{out+=M3_head(x,M3_root(m.u[i]),M3_TREB,yB,g,C.blue)+M3_head(x,M3_root(m.l[i]),M3_TREB,yB,g,C.coral);
   const d=m.u[i]-m.l[i];out+=TB(x,yB+46,M3_INT[M3_pc(d)===0&&d>0?12:M3_pc(d)].replace('perfect ','P').replace('major ','M').replace('minor ','m'),14,M3_pc(d)===7||M3_pc(d)===0?C.amber:C.muted);
   if(i<3){const yu1=M3_y(M3_root(m.u[i]).step,M3_TREB,yB,g),yu2=M3_y(M3_root(m.u[i+1]).step,M3_TREB,yB,g),yl1=M3_y(M3_root(m.l[i]).step,M3_TREB,yB,g),yl2=M3_y(M3_root(m.l[i+1]).step,M3_TREB,yB,g);
    out+=arrow(x+14,yu1,x+86,yu2,C.blue,1.8,7)+(m.l[i]===m.l[i+1]?L(x+14,yl1,x+86,yl2,C.coral,1.8,'stroke-dasharray="4 3"'):arrow(x+14,yl1,x+86,yl2,C.coral,1.8,7))}});
  out+=TF(300,yB+70,'interval between the voices',13,C.muted);
  out+=R(60,300,480,44,'#fff',C.grid,10)+T(300,327,m.say,13.5,C.ink);
  return {svg:out,phase:m.say};
 }});

// Species examples above the first four notes of the cantus firmus. Each bar: list of {m, d, tie, rest}.
const M3_SPEC={
 1:{n:'First species: 1 : 1',bars:[[{m:69,d:'w'}],[{m:69,d:'w'}],[{m:67,d:'w'}],[{m:69,d:'w'}]],say:'One whole note against each note: every pair is a consonance.'},
 2:{n:'Second species: 2 : 1',bars:[[{m:69,d:'h'},{m:71,d:'h'}],[{m:69,d:'h'},{m:72,d:'h'}],[{m:71,d:'h'},{m:72,d:'h'}],[{m:74,d:'w'}]],say:'Two notes against one: the strong beat is consonant; a weak beat may be a dissonance only if it passes by step.'},
 3:{n:'Third species: 4 : 1',bars:[[{m:69,d:'q'},{m:71,d:'q'},{m:72,d:'q'},{m:74,d:'q'}],[{m:72,d:'q'},{m:74,d:'q'},{m:76,d:'q'},{m:77,d:'q'}],[{m:76,d:'q'},{m:74,d:'q'},{m:72,d:'q'},{m:71,d:'q'}],[{m:69,d:'w'}]],say:'Four notes against one: passing dissonances move by step between consonances.'},
 4:{n:'Fourth species: syncopation',bars:[[{rest:true,d:'h'},{m:69,d:'h',tie:true}],[{m:69,d:'h'},{m:72,d:'h',tie:true}],[{m:72,d:'h'},{m:72,d:'h',tie:true}],[{m:72,d:'h',sus:true},{m:71,d:'h'}]],say:'Notes are tied across the bar. In the last bar the held C is a dissonant seventh over D, a suspension, and it resolves down to B.'},
 5:{n:'Fifth species: florid',bars:[[{m:69,d:'h'},{m:71,d:'q'},{m:72,d:'q'}],[{m:74,d:'h'},{m:72,d:'h'}],[{m:71,d:'q'},{m:72,d:'q'},{m:74,d:'h'}],[{m:74,d:'w'}]],say:'Florid counterpoint mixes all the earlier rhythms into a freer line.'}};
const M3_DUR={w:1.6,h:.8,q:.4};
SCENE({id:'counterpoint-species',name:'The five species',tag:'Fux’s graded steps',
 definition:'Fux taught counterpoint in five species of increasing rhythmic freedom: note against note, two against one, four against one, syncopation and florid.',
 example:'Composers from Haydn and Mozart to Beethoven studied from Gradus ad Parnassum, and it is still used to teach counterpoint today.',
 desc:'The first four notes of a cantus firmus with an upper line in one of five species, using whole notes, minims, crotchets and ties.',
 research:'Fux (1725). Gradus ad Parnassum; Mann’s English translation, The Study of Counterpoint (1965).',
 dur:14,hint:'Choose a species and press Play to hear it against the cantus firmus.',
 init:()=>({sp:2}),
 watch(p){return {sp:1+Math.min(4,Math.floor(p*5))}},
 ui:[{choose:[[1,'1st'],[2,'2nd'],[3,'3rd'],[4,'4th'],[5,'5th']],label:'Species',get:s=>s.sp,act:'sp'},{b:'Play',act:'play'}],
 on:{sp(s,v){s.sp=Number(v)},play(s){const sp=M3_SPEC[s.sp];let t=0,hold=null;
  sp.bars.forEach((bar,bi)=>{AUDIO.tone(midiHz(M3_CF[bi]),{dur:1.55,at:bi*1.6,gain:.11,partials:M3_PARTIALS});let tt=bi*1.6;
   bar.forEach((n,ni)=>{const d=M3_DUR[n.d];if(!n.rest){if(hold&&hold.m===n.m&&ni===0){hold.dur+=d}else{if(hold)AUDIO.tone(midiHz(hold.m),{dur:hold.dur-.04,at:hold.at,gain:.13,type:'triangle'});hold={m:n.m,at:tt,dur:d}}}
    if(!n.tie&&hold&&!(n.rest)){AUDIO.tone(midiHz(hold.m),{dur:hold.dur-.04,at:hold.at,gain:.13,type:'triangle'});hold=null}tt+=d})});
  if(hold)AUDIO.tone(midiHz(hold.m),{dur:hold.dur-.04,at:hold.at,gain:.13,type:'triangle'});return 'keep'}},
 draw(s){
  const sp=M3_SPEC[s.sp],g=12,yB=200,x0=90,bw=120;let out=heading(sp.n)+M3_staff(30,575,yB,g);
  let prev=null;
  sp.bars.forEach((bar,bi)=>{const bx=x0+bi*bw;out+=M3_head(bx+14,M3_root(M3_CF[bi]),M3_TREB,yB,g,'#8fa3ae');
   if(bi<3)out+=L(bx+bw-16,yB,bx+bw-16,yB-4*g,C.muted,1.2);
   let off=0;bar.forEach(n=>{const x=bx+18+off*(bw-36)/1.6;
    if(n.rest)out+=R(x-7,yB-2*g-g*.5,14,g*.5,C.ink,'none',0);
    else{const col=n.sus?C.coral:C.blue;out+=M3_head(x,M3_root(n.m),M3_TREB,yB,g,col,n.d);
     if(prev&&prev.tie){const y=M3_y(M3_root(n.m).step,M3_TREB,yB,g)+g*.8;out+=P(`M${fmt(prev.x+6)} ${fmt(y)}Q${fmt((prev.x+x)/2)} ${fmt(y+12)} ${fmt(x-6)} ${fmt(y)}`,C.blue,1.6)}}
    prev={...n,x};off+=M3_DUR[n.d]})});
  out+=L(x0+4*bw-16,yB,x0+4*bw-16,yB-4*g,C.ink,2.6);
  out+=Ci(110,262,5,'#8fa3ae')+TF(120,267,'cantus firmus',13,C.muted,'start')+Ci(260,262,5,C.blue)+TF(270,267,'counterpoint',13,C.muted,'start');
  if(s.sp===4)out+=Ci(410,262,5,C.coral)+TF(420,267,'suspension',13,C.muted,'start');
  out+=R(40,292,520,48,'#fff',C.grid,10)+T(300,321,sp.say,13.5,C.ink);
  return {svg:out,phase:sp.say+' Only the first four bars are shown, so the line does not reach a final cadence.'};
 }});

/* ---------------- Temperament ---------------- */
// Cents above C for each pitch class C…B in five tuning systems (C as the reference).
const M3_TUNE={
 just:{n:'Just (5-limit, on C)',c:[0,111.73,203.91,315.64,386.31,498.04,590.22,701.96,813.69,884.36,1017.6,1088.27]},
 pyth:{n:'Pythagorean',c:[0,113.69,203.91,294.13,407.82,498.04,611.73,701.96,815.64,905.87,996.09,1109.78]},
 mean:{n:'¼-comma meantone',c:[0,76.05,193.16,310.26,386.31,503.42,579.47,696.58,772.63,889.74,1006.84,1082.89]},
 werck:{n:'Werckmeister III',c:[0,90.22,192.18,294.13,390.22,498.04,588.27,696.09,792.18,888.27,996.09,1092.18]},
 et:{n:'Equal temperament',c:[0,100,200,300,400,500,600,700,800,900,1000,1100]}};
const M3_TKEYS=['just','pyth','mean','werck','et'];
const M3_C4=261.63;
const M3_hz=(sys,pc,oct=0)=>M3_C4*Math.pow(2,(M3_TUNE[sys].c[pc]+1200*oct)/1200);
SCENE({id:'temperament',name:'Temperament',tag:'Tuning compromises',
 definition:'A temperament is a way of tuning the twelve notes so that music can move between keys. No tuning can make every interval pure in every key, so each one compromises.',
 example:'A pure major third (5 : 4) is 386 cents. Equal temperament makes every third 400 cents, about 14 cents wide, so its harmonics beat about 10 times a second around middle C.',
 desc:'The size of the major third C–E in five tuning systems, and the slow or fast beating you hear when its harmonics nearly coincide.',
 research:['Werckmeister (1691). Musicalische Temperatur.','Barbour (1951). Tuning and Temperament: A Historical Survey.','Helmholtz (1863): beating between near-coinciding harmonics.'],
 dur:14,hint:'Choose a tuning and press Play to hear the major third C–E. Listen for the wobble (beats): none in just tuning, about 10 per second in equal temperament.',
 init:()=>({sys:'et'}),
 watch(p){return {sys:M3_TKEYS[Math.min(4,Math.floor(p*5))]}},
 ui:[{choose:M3_TKEYS.map(k=>[k,M3_TUNE[k].n.replace(' (5-limit, on C)','')]),label:'Tuning',get:s=>s.sys,act:'sys'},{b:'Play C–E',act:'play'}],
 on:{sys(s,v){s.sys=v},play(s){AUDIO.chord([M3_hz(s.sys,0),M3_hz(s.sys,4)],{dur:3,partials:[1,.6,.45,.35,.28,.2],gain:.2});return 'keep'}},
 draw(s){
  let out=heading('The major third C–E in five tunings');
  M3_TKEYS.forEach((k,i)=>{const c=M3_TUNE[k].c[4],x=200+(c-380)*12,y=64+i*34,on=k===s.sys;
   out+=TF(185,y+5,M3_TUNE[k].n,13,on?C.ink:C.muted,'end')+L(200,y,440,y,C.grid,1)+Ci(Math.min(560,x),y,on?8:6,on?C.blue:'#9fb3bf')+TF(Math.min(560,x)+12,y+5,c.toFixed(1)+'¢',13,on?C.blue:C.muted,'start')});
  out+=L(200+(386.31-380)*12,52,200+(386.31-380)*12,214,C.green,1.4,'stroke-dasharray="4 3"')+TF(200+(386.31-380)*12,232,'pure 5 : 4 (386.3¢)',13,C.green);
  const fC=M3_hz(s.sys,0),fE=M3_hz(s.sys,4),beat=Math.abs(5*fC-4*fE);
  out+=TF(40,262,'beating heard over 2 seconds',13,C.muted,'start');
  let d='';for(let k=0;k<=300;k++){const t=k/300*2,env=beat<.05?1:Math.abs(Math.cos(Math.PI*beat*t));d+=(k?'L':'M')+fmt(40+k/300*520)+' '+fmt(320-env*36)}
  out+=P(d,C.purple,2)+L(40,320,560,320,C.grid,1);
  out+=TB(300,352,beat<.05?'No beating: the harmonics coincide exactly.':`About ${beat.toFixed(1)} beats per second`,16,beat<.05?C.green:C.purple);
  return {svg:out,phase:`${M3_TUNE[s.sys].n}: the third is ${M3_TUNE[s.sys].c[4].toFixed(1)} cents. The 5th harmonic of C and the 4th harmonic of E differ by ${beat.toFixed(1)} Hz, which you hear as that many beats per second.`};
 }});

const M3_PCN=['C','C♯','D','E♭','E','F','F♯','G','G♯','A','B♭','B'];
SCENE({id:'temperament-cents',name:'Cents',tag:'Measuring tiny pitch differences',
 definition:'A cent is one hundredth of an equal-tempered semitone, so an octave is 1200 cents. Cents make small tuning differences easy to compare.',
 example:'Pythagorean E is 407.8 cents above C; just E is 386.3; equal-tempered E is 400. A difference of about 5 cents is near the limit many listeners can hear in sequence.',
 desc:'Bars showing how far each of the twelve notes sits above or below equal temperament in the chosen tuning.',
 research:['Ellis (1885). On the musical scales of various nations: the cent introduced.','Barbour (1951). Tuning and Temperament.'],
 dur:12,hint:'Choose a tuning and press a note to hear it against C in that tuning.',
 init:()=>({sys:'mean',pc:4}),
 watch(p){return {sys:['pyth','just','mean','werck'][Math.min(3,Math.floor(p*4))],pc:4}},
 ui:[{choose:M3_TKEYS.map(k=>[k,M3_TUNE[k].n.replace(' (5-limit, on C)','')]),label:'Tuning',get:s=>s.sys,act:'sys'}],
 on:{sys(s,v){s.sys=v},pc(s,v){s.pc=Number(v);AUDIO.chord([M3_hz(s.sys,0),M3_hz(s.sys,s.pc)],{dur:1.8,partials:[1,.5,.35,.25],gain:.18});return 'keep'}},
 draw(s,f,X){
  const c=M3_TUNE[s.sys].c,y0=190,sc=4;let out=heading(`${M3_TUNE[s.sys].n}: cents away from equal temperament`);
  out+=L(40,y0,570,y0,C.ink,1.4)+TF(36,y0+4,'0',13,C.muted,'end')+TF(36,y0-20*sc+4,'+20',13,C.muted,'end')+TF(36,y0+20*sc+4,'−20',13,C.muted,'end');
  out+=L(40,y0-20*sc,570,y0-20*sc,C.grid,1,'stroke-dasharray="3 4"')+L(40,y0+20*sc,570,y0+20*sc,C.grid,1,'stroke-dasharray="3 4"');
  c.forEach((v,pc)=>{const dev=v-100*pc,x=58+pc*43,h=Math.max(-28,Math.min(28,dev))*sc,on=pc===s.pc;
   out+=hit(X,'pc',pc,`${M3_PCN[pc]}: ${v.toFixed(1)} cents`,R(x,h>0?y0-h:y0,30,Math.abs(h)||1.5,on?C.blue:dev>0?C.amber:C.purple,'none',3)+R(x-4,60,38,270,'transparent','none',4));
   out+=TB(x+15,316,M3_PCN[pc],14,on?C.blue:C.ink)+TF(x+15,334,(dev>0?'+':'')+dev.toFixed(0),13,C.muted)});
  out+=TF(300,56,`${M3_PCN[s.pc]} is ${c[s.pc].toFixed(1)} cents above C (equal temperament: ${100*s.pc})`,14,C.ink);
  return {svg:out,phase:`In ${M3_TUNE[s.sys].n}, ${M3_PCN[s.pc]} is ${(c[s.pc]-100*s.pc).toFixed(1)} cents from its equal-tempered place. Amber bars are sharp, purple flat; equal temperament has no bars at all.`};
 }});

SCENE({id:'temperament-keys',name:'Every key a different colour',tag:'Well temperament and the wolf',
 definition:'In meantone and well temperaments, intervals change size from key to key, so keys have different characters. Equal temperament makes every key the same.',
 example:'In ¼-comma meantone the third on C is pure, but the “third” from A♭ is about 427 cents, so harsh it was called a wolf. Werckmeister III lets every key be used, each with its own colour.',
 desc:'The size of the major third built on each of the twelve notes in the chosen tuning, compared with a pure third and equal temperament.',
 research:['Werckmeister (1691). Musicalische Temperatur.','Bach (1722). The Well-Tempered Clavier.','Lehman (2005). Bach’s extraordinary temperament: our Rosetta Stone, Early Music 33(1), a proposal that remains debated.'],
 dur:13,hint:'Choose a tuning, then press a key name to hear its major chord in that tuning.',
 init:()=>({sys:'mean',k:8}),
 watch(p){return {sys:['mean','werck','et'][Math.min(2,Math.floor(p*3))],k:-1}},
 ui:[{choose:M3_TKEYS.map(k=>[k,M3_TUNE[k].n.replace(' (5-limit, on C)','')]),label:'Tuning',get:s=>s.sys,act:'sys'}],
 on:{sys(s,v){s.sys=v},k(s,v){s.k=Number(v);const c=M3_TUNE[s.sys].c,hz=st=>M3_C4*Math.pow(2,(c[(s.k+st)%12]+(s.k+st>=12?1200:0))/1200);
  AUDIO.chord([hz(0),hz(4),hz(7)],{dur:2,partials:[1,.55,.4,.3,.22],gain:.2});return 'keep'}},
 draw(s,f,X){
  const c=M3_TUNE[s.sys].c,third=k=>{let v=c[(k+4)%12]-c[k];if(v<0)v+=1200;return v},yAt=v=>320-(v-375)*4.2;
  let out=heading(`Major thirds in every key: ${M3_TUNE[s.sys].n}`);
  for(const [v,lab,col] of [[386.31,'pure 386¢',C.green],[400,'equal 400¢',C.muted]])out+=L(52,yAt(v),572,yAt(v),col,1.3,'stroke-dasharray="5 4"')+TF(48,yAt(v)+4,lab,13,col,'end');
  for(let k=0;k<12;k++){const v=third(k),x=62+k*43,y=yAt(Math.min(432,v)),on=k===s.k,wolf=v>420;
   out+=hit(X,'k',k,`${M3_PCN[k]} major: third ${v.toFixed(1)} cents. Press to play.`,R(x,y,30,320-y,on?C.blue:wolf?C.coral:C.purple,'none',3)+R(x-5,52,40,285,'transparent','none',3));
   out+=TB(x+15,343,M3_PCN[k],14,on?C.blue:C.ink)+TF(x+15,y-6,v.toFixed(0),13,wolf?C.coral:C.muted)}
  const vs=[...Array(12).keys()].map(third),wolves=vs.filter(v=>v>420).length;
  return {svg:out,phase:s.sys==='et'?'Every third is exactly 400 cents: every key sounds the same, and none is pure.':`Thirds range from ${Math.min(...vs).toFixed(0)} to ${Math.max(...vs).toFixed(0)} cents${wolves?`; ${wolves} are wolf thirds`:''}. Bach’s “well-tempered” meant usable in every key, not necessarily equal; which tuning he used is still debated.`};
 }});

/* ---------------- Circle of fifths ---------------- */
const M3_CMAJ=['C','G','D','A','E','B','F♯','D♭','A♭','E♭','B♭','F'],M3_CMIN=['a','e','b','f♯','c♯','g♯','d♯','b♭','f','c','g','d'];
const M3_CPC=[0,7,2,9,4,11,6,1,8,3,10,5],M3_CSIG=[0,1,2,3,4,5,6,-5,-4,-3,-2,-1];
const M3_SHARPS=[38,35,39,36,33,37,34],M3_FLATS=[34,37,33,36,32,35,31],M3_SN=['F♯','C♯','G♯','D♯','A♯','E♯'],M3_FN=['B♭','E♭','A♭','D♭','G♭'];
function M3_circle(out,X,act,cx,cy,r,sel,mark){
 out+=Ci(cx,cy,r+26,'#fff',C.grid)+Ci(cx,cy,r-34,C.pale,'none');
 for(let k=0;k<12;k++){const a=-Math.PI/2+k*Math.PI/6,x=cx+r*Math.cos(a),y=cy+r*Math.sin(a),xi=cx+(r-52)*Math.cos(a),yi=cy+(r-52)*Math.sin(a),m=mark(k);
  out+=hit(X,act,k,`${M3_CMAJ[k]} major and ${M3_CMIN[k]} minor`,Ci(x,y,19,m||'#fff',m?C.ink:C.line)+TB(x,y+6,M3_CMAJ[k],15,m?'#fff':C.ink));
  out+=TF(xi,yi+5,M3_CMIN[k],13,C.muted)}
 return out;
}
function M3_keySig(out,x,yB,g,sig){
 const n=Math.abs(sig),pos=sig>0?M3_SHARPS:M3_FLATS;
 for(let i=0;i<n;i++){const y=M3_y(pos[i],M3_TREB,yB,g);out+=M3_acc(x+i*13,y,sig>0?1:-1,g,C.ink)}
 return out;
}
SCENE({id:'circle-of-fifths',name:'Circle of fifths',tag:'Keys arranged by their sharps and flats',
 definition:'The circle of fifths arranges the twelve keys so that each is a fifth above the last. Moving one step clockwise adds a sharp; anticlockwise adds a flat.',
 example:'C has no sharps; G has one (F♯); D has two (F♯, C♯). Going the other way, F has one flat (B♭). Each major key shares its signature with a relative minor: C major and A minor.',
 desc:'Twelve major keys around a circle with their relative minors inside, and the selected key’s signature on a stave.',
 research:['Diletsky (c. 1679). Grammatika: an early circle of keys.','Heinichen (1711). Der General-Bass in der Composition: the circle of keys.'],
 dur:14,hint:'Press a key on the circle to see its signature and hear its tonic chord.',
 init:()=>({k:2}),
 watch(p){return {k:[0,1,2,3,4,5,6,7,8,9,10,11][Math.min(11,Math.floor(p*12))]}},
 on:{k(s,v){s.k=Number(v);const r=48+M3_CPC[s.k];M3_tone([r,r+4,r+7]);return 'keep'}},
 draw(s,f,X){
  const k=s.k,sig=M3_CSIG[k];let out=heading('The circle of fifths');
  out=M3_circle(out,X,'k',175,205,128,k,j=>j===k?C.blue:(j===(k+1)%12||j===(k+11)%12)?'#7aa6c6':null);
  const g=11,yB=150;out+=M3_staff(360,575,yB,g);out=M3_keySig(out,400,yB,g,sig);
  out+=TB(467,72,`${M3_CMAJ[k]} major · ${M3_CMIN[k]} minor`,17,C.blue);
  const list=sig>0?M3_SN.concat(['B♯']).slice(0,sig):M3_FN.concat(['C♭']).slice(0,-sig);
  out+=T(467,190,sig===0?'no sharps or flats':`${Math.abs(sig)} ${sig>0?'sharp':'flat'}${Math.abs(sig)>1?'s':''}: ${list.join(' ')}`,14,C.ink);
  out+=TF(467,226,`a fifth up: ${M3_CMAJ[(k+1)%12]} (dominant)`,13,C.muted)+TF(467,248,`a fifth down: ${M3_CMAJ[(k+11)%12]} (subdominant)`,13,C.muted);
  out+=TF(467,290,'F♯ and G♭ are the same keys on a piano,',13,C.muted)+TF(467,308,'shown once at the bottom of the circle.',13,C.muted);
  return {svg:out,phase:`${M3_CMAJ[k]} major: ${sig===0?'no sharps or flats':Math.abs(sig)+(sig>0?' sharps':' flats')}. Its neighbours ${M3_CMAJ[(k+1)%12]} and ${M3_CMAJ[(k+11)%12]} differ by only one note, so music moves easily between them.`};
 }});

SCENE({id:'circle-of-fifths-distance',name:'Near and far keys',tag:'Distance round the circle',
 definition:'Keys close together on the circle share most of their notes; keys opposite each other share very few. That is why some modulations sound smooth and others startling.',
 example:'C major and G major share six of seven notes. C major and F♯ major share only two (B and F, written E♯ in F♯).',
 desc:'Two keys chosen on the circle, and their scales on a ring of twelve pitch classes with shared notes highlighted.',
 research:['Heinichen (1711): closely related keys.','Krumhansl (1990). Cognitive Foundations of Musical Pitch: perceived key distance follows the circle.'],
 dur:13,hint:'Press two keys on the circle (presses alternate between the first and second). Play sounds both scales.',
 init:()=>({a:0,b:1,next:0}),
 watch(p){return {a:0,b:Math.min(6,Math.floor(p*7)),next:0}},
 ui:[{b:'Play both scales',act:'play'}],
 on:{k(s,v){v=Number(v);if(s.next===0){s.a=v;s.next=1}else{s.b=v;s.next=0}},
  play(s){[s.a,s.b].forEach((k,j)=>{const r=60+M3_CPC[k]-(M3_CPC[k]>6?12:0);[0,2,4,5,7,9,11,12].forEach((v,i)=>AUDIO.tone(midiHz(r+v),{dur:.3,at:j*2.8+i*.32,gain:.13,partials:M3_PARTIALS}))});return 'keep'}},
 draw(s,f,X){
  const sa=new Set(M3_SCALE.map(v=>(M3_CPC[s.a]+v)%12)),sb=new Set(M3_SCALE.map(v=>(M3_CPC[s.b]+v)%12)),shared=[...sa].filter(x=>sb.has(x));
  const steps=Math.min(Math.abs(s.a-s.b),12-Math.abs(s.a-s.b));
  let out=heading(`${M3_CMAJ[s.a]} major and ${M3_CMAJ[s.b]} major`);
  out=M3_circle(out,X,'k',165,200,118,null,j=>j===s.a?C.coral:j===s.b?C.blue:null);
  const cx=455,cy=180,r=86;out+=Ci(cx,cy,r,'none',C.grid);
  for(let pc=0;pc<12;pc++){const a=-Math.PI/2+pc*Math.PI/6,x=cx+r*Math.cos(a),y=cy+r*Math.sin(a),A=sa.has(pc),B=sb.has(pc),both=A&&B;
   out+=Ci(x,y,15,both?C.green:A?C.coralp:B?C.pale:'#fff',both?C.green:A?C.coral:B?C.blue:C.grid)+TF(x,y+5,M3_PCN[pc],13,both?'#fff':C.ink)}
  out+=TB(cx,cy+6,`${shared.length} shared`,16,C.green);
  out+=T(455,300,`${steps} step${steps===1?'':'s'} apart on the circle`,15,C.ink)+TF(455,322,'green notes belong to both scales',13,C.muted);
  return {svg:out,phase:`${M3_CMAJ[s.a]} and ${M3_CMAJ[s.b]} are ${steps} step${steps===1?'':'s'} apart and share ${shared.length} of 7 notes. Each step round the circle swaps just one note.`};
 }});

const M3_FN_OF=['T','S','T','S','D','T','D'],M3_FCOL={T:C.blue,S:C.green,D:C.coral};
SCENE({id:'circle-of-fifths-function',name:'Harmonic function',tag:'Tonic, subdominant, dominant',
 definition:'Harmonic function groups chords by what they do: tonic chords feel at rest, subdominant chords move away, dominant chords pull back towards the tonic.',
 example:'I–IV–V–I (C–F–G–C) is tonic, subdominant, dominant, tonic: away, tension, home. Many songs use the same journey.',
 desc:'A progression builder in C major: chord cards coloured by function (T, S, D), with arrows showing each move.',
 research:['Rameau (1722). Traité de l’harmonie: tonic, dominant and subdominant.','Riemann (1893). Vereinfachte Harmonielehre: the theory of harmonic functions.'],
 dur:14,hint:'Add chords with the buttons (up to 8), then Play. The checker notes when a dominant moves to a subdominant, which is rarer in Classical music but common in rock.',
 init:()=>({prog:[0,3,4,0]}),
 watch(p){const all=[0,5,1,4,0];return {prog:all.slice(0,Math.max(1,Math.ceil(p*all.length)))}},
 ui:[...[0,1,2,3,4,5,6].map(d=>({b:['I','ii','iii','IV','V','vi','vii°'][d],act:'add',arg:d,aria:'Add chord '+['I','ii','iii','IV','V','vi','vii°'][d]})),{b:'Undo',act:'undo'},{b:'Play',act:'play'}],
 on:{add(s,d){if(s.prog.length<8)s.prog.push(Number(d))},undo(s){s.prog.pop()},
  play(s){s.prog.forEach((d,i)=>M3_tone(M3_degree('C',d,false).map(n=>n.m),{at:i*.8,dur:.75}));return 'keep'}},
 draw(s){
  let out=heading('Tonic, subdominant, dominant');const n=s.prog.length,w=66,x0=300-n*w/2;let retro=0;
  s.prog.forEach((d,i)=>{const fn=M3_FN_OF[d],x=x0+i*w,col=M3_FCOL[fn];
   out+=R(x+4,90,w-12,110,'#fff',col,10)+TB(x+w/2-2,140,M3_roman(d,M3_degree('C',d,false)),20,col)+TF(x+w/2-2,170,fn==='T'?'tonic':fn==='S'?'subdom.':'dominant',13,C.muted);
   out+=TF(x+w/2-2,190,M3_degree('C',d,false).map(n=>M3_nm(n,false)).join(''),13,C.muted);
   if(i>0){const pf=M3_FN_OF[s.prog[i-1]],bad=pf==='D'&&fn==='S';if(bad)retro++;out+=arrow(x-4,220,x+8,220,bad?C.amber:C.line,1.8,6)}});
  if(!n)out+=T(300,150,'Add a chord to begin.',16,C.muted);
  out+=R(70,250,460,34,C.pale,'none',8)+TF(300,272,'T = tonic (I, vi, iii)   S = subdominant (IV, ii)   D = dominant (V, vii°)',13,C.ink);
  const ends=n&&M3_FN_OF[s.prog[n-1]]==='T'&&s.prog[n-1]===0;
  out+=T(300,318,ends?'Ends on I: the journey comes home.':n?'Does not end on I: it stays open.':'',15,ends?C.green:C.amber);
  if(retro)out+=TF(300,344,`${retro} dominant → subdominant move${retro>1?'s':''}: rarer in Bach or Mozart, everyday in rock and pop.`,13,C.amber);
  return {svg:out,phase:`Functions: ${s.prog.map(d=>M3_FN_OF[d]).join(' → ')||'none yet'}. Rameau saw V → I as the strongest move in harmony; Riemann later grouped every chord into these three functions.`};
 }});
