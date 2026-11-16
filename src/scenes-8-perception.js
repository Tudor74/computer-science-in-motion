/* ===================== Music era 8 · Music and the mind ===================== */
// Listening experiments. Sound comes only from on() handlers (AUDIO); every picture is a pure function of
// state, frame and X. Trial orders use seeded shuffles; per-item seeds are hashed (M8_mix) so that
// neighbouring seeds do not give near-identical "random" values.
const M8_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const M8_rng=n=>rng(M8_mix(n));
// Standard normal from a seeded generator (Box–Muller).
function M8_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const M8_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
function M8_corr(a,b){const n=a.length;if(n<2)return NaN;const ma=sum(a)/n,mb=sum(b)/n;let sab=0,saa=0,sbb=0;for(let i=0;i<n;i++){const x=a[i]-ma,y=b[i]-mb;sab+=x*y;saa+=x*x;sbb+=y*y}return saa&&sbb?sab/Math.sqrt(saa*sbb):NaN}
const M8_mean=a=>a.length?sum(a)/a.length:NaN;
const M8_sd=a=>{if(a.length<2)return NaN;const m=M8_mean(a);return Math.sqrt(sum(a.map(x=>(x-m)**2))/(a.length-1))};
const M8_gcd=(a,b)=>b?M8_gcd(b,a%b):a;
const M8_pc=m=>((Math.round(m)%12)+12)%12;
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function M8_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-7,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// Roughness of two sine tones: the Plomp & Levelt (1965) curve in Sethares's (1993) parameterisation,
// scaled so its peak is 1. Peak at about a quarter of a critical band.
const M8_PLMAX=Math.exp(-3.51*0.2204)-Math.exp(-5.75*0.2204);
function M8_pl(df,fmin){const s=0.24/(0.0207*fmin+18.96),x=s*Math.abs(df);return (Math.exp(-3.51*x)-Math.exp(-5.75*x))/M8_PLMAX}
// Critical bandwidth in Hz (Zwicker & Terhardt 1980 approximation).
const M8_cb=f=>25+75*Math.pow(1+1.4*Math.pow(f/1000,2),0.69);
// Krumhansl & Kessler (1982) probe-tone profiles, tonic first.
const M8_KKMAJ=[6.35,2.23,3.48,2.33,4.38,4.09,2.52,5.19,2.39,3.66,2.29,2.88];
const M8_KKMIN=[6.33,2.68,3.52,5.38,2.60,3.53,2.54,4.75,3.98,2.69,3.34,3.17];
const M8_PCN=['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];

/* ---- Sound helpers (call only from on() handlers) ---- */
function M8_complex(f0,harms,o={}){const g=(o.gain||.22)/Math.sqrt(Math.max(1,harms.length));harms.forEach(n=>AUDIO.tone(f0*n,{dur:o.dur||1.2,at:o.at||0,gain:g*(o.amp?o.amp(n):1)}))}
// Shepard tone: octave-spaced sine partials under a fixed bell-shaped envelope on log frequency.
const M8_shepW=f=>Math.exp(-.5*Math.pow((Math.log2(f)-Math.log2(480))/1.1,2));
function M8_shepard(step,o={}){const base=16.3516*Math.pow(2,(((step%12)+12)%12)/12);for(let k=0;k<10;k++){const f=base*Math.pow(2,k);if(f<25||f>9000)continue;AUDIO.tone(f,{dur:o.dur||.5,at:o.at||0,gain:.22*M8_shepW(f)})}}
function M8_melody(midis,ioi,o={}){AUDIO.seq(midis.map((m,i)=>({hz:midiHz(m),at:i*ioi,dur:ioi*.9})),{type:'triangle',gain:o.gain||.16,at:o.at||0})}
function M8_click(at,o={}){AUDIO.tone(o.hz||1000,{dur:.05,at,gain:o.gain||.22,attack:.002,release:.02})}

/* ---- A small keyboard of hit targets ---- */
const M8_WHITE=[0,2,4,5,7,9,11];
function M8_keys(X,x0,y0,ww,h,lo,hi,act,mark){
 const pos={};let xi=0,out='';
 for(let m=lo;m<=hi;m++)if(M8_WHITE.includes(M8_pc(m))){pos[m]={x:x0+xi*ww+ww/2,black:false};xi++}
 for(let m=lo;m<=hi;m++)if(!M8_WHITE.includes(M8_pc(m))&&pos[m-1])pos[m]={x:pos[m-1].x+ww/2,black:true};
 for(let m=lo;m<=hi;m++){const p=pos[m];if(!p||p.black)continue;out+=hit(X,act,m,'Key '+noteName(m),R(p.x-ww/2,y0,ww,h,(mark&&mark(m))||'#fff',C.ink,3))}
 for(let m=lo;m<=hi;m++){const p=pos[m];if(!p||!p.black)continue;out+=hit(X,act,m,'Key '+noteName(m),R(p.x-ww*.32,y0,ww*.64,h*.6,(mark&&mark(m))||C.dark,C.ink,3))}
 return {svg:out,pos,width:xi*ww};
}
// A strip of note heads on a pitch grid (a simple piano roll), for showing short melodies.
function M8_roll(notes,x0,y0,w,h,lo,hi,o={}){
 let out=R(x0,y0,w,h,'#fff',C.grid,4);const n=Math.max(notes.length,o.slots||notes.length),step=w/Math.max(1,n),yy=m=>y0+h-6-(m-lo)/(hi-lo||1)*(h-12);
 notes.forEach((m,i)=>{const hl=o.hl===i;out+=R(x0+i*step+2,yy(m)-5,step-4,10,hl?C.coral:(o.col||C.blue),'none',4)});
 return out;
}

/* =========================== missing-fundamental =========================== */
const M8_F0=200,M8_AMP=[1,.85,.75,.65,.55,.5];
function M8_onHarms(s){const h=[];s.on.forEach((v,i)=>{if(v)h.push(i+1)});return h}
SCENE({id:'missing-fundamental',name:'Missing fundamental',tag:'Pitch from a pattern',
 definition:'A sound made only of the harmonics of a note, without the note itself, is still heard at the pitch of that missing note.',
 example:'Play 400, 600, 800, 1000 and 1200 Hz together. There is no energy at 200 Hz, yet the pitch you hear is 200 Hz, because the combined wave still repeats every 5 ms.',
 desc:'Six harmonic bars of a 200 Hz note above their combined waveform; removing the lowest bars leaves the waveform repeating every 5 milliseconds.',
 research:'Schouten (1940). The residue: a new component in subjective sound analysis. Seebeck (1841) and Ohm (1843) disputed the same effect a century earlier.',
 dur:10,hint:'Press bars to switch harmonics on and off, then Play. Compare with the plain 200 Hz tone. Headphones help.',
 init:()=>({on:[0,1,1,1,1,1]}),
 watch(p){return {on:p<.3?[1,1,1,1,1,1]:p<.65?[0,1,1,1,1,1]:[0,0,1,1,1,1]}},
 ui:[{b:'Play',act:'play'},{b:'Play 200 Hz alone',act:'pure'},{b:'All harmonics',act:'all'},{b:'Remove 200 Hz',act:'nofund'}],
 on:{tog(s,i){s.on[Number(i)]^=1},play(s){M8_complex(M8_F0,M8_onHarms(s),{amp:n=>M8_AMP[n-1]})},pure(){AUDIO.tone(M8_F0,{dur:1.2,gain:.22})},all(s){s.on=[1,1,1,1,1,1]},nofund(s){s.on=[0,1,1,1,1,1]}},
 draw(s,f,X){
  const h=M8_onHarms(s),g=h.reduce((a,b)=>M8_gcd(a,b),0);let out=heading('Harmonics of 200 Hz, with or without 200 Hz itself',26);
  const sx=v=>60+v/1300*500;out+=R(50,40,520,136,'#fff',C.grid,4);
  for(let n=1;n<=6;n++){const x=sx(n*M8_F0),on=!!s.on[n-1],bh=M8_AMP[n-1]*104;
   const bar=on?R(x-17,172-bh,34,bh,n===1?C.coral:C.blue,'none',4):R(x-17,172-bh,34,bh,'none',C.line,4,'stroke-dasharray="5 4"');
   out+=hit(X,'tog',n-1,`${n*M8_F0} Hz: ${on?'on':'off'}. Press to switch.`,R(x-26,42,52,132,'transparent','none',4)+bar);
   out+=TF(x,191,String(n*M8_F0),13,on?C.ink:C.muted)}
  out+=TF(560,191,'Hz',13,C.muted,'end');
  out+=R(50,206,520,112,'#fff',C.grid,4);
  if(!h.length)out+=T(310,267,'All harmonics are off: silence.',15,C.muted);
  else{const pts=[];let mx=0;const ys=[];for(let i=0;i<=320;i++){const t=i/320*15e-3;let y=0;h.forEach(n=>y+=M8_AMP[n-1]*Math.sin(2*Math.PI*n*M8_F0*t));ys.push(y);mx=Math.max(mx,Math.abs(y))}
   ys.forEach((y,i)=>pts.push([60+i/320*500,262-y/(mx||1)*44]));
   const per=5/g;for(let k=1;k*per<15.001;k++){const x=60+k*per/15*500;out+=L(x,210,x,314,C.amber,1.4,'stroke-dasharray="4 4"')}
   out+=M8_poly(pts,C.ink,1.8)+TF(64,224,`combined wave repeats every ${fmt(per)} ms`,13,C.amber,'start')}
  ['0','5','10','15 ms'].forEach((l,i)=>out+=TF(60+i*500/3,334,l,13,C.muted));
  const pitch=h.length?M8_F0*g:0,low=h.length?M8_F0*h[0]:0;
  if(h.length)out+=T(300,364,`Lowest component ${low} Hz · repeating pattern gives a pitch of about ${pitch} Hz`,15,C.ink);
  const phase=!h.length?'Switch on some harmonics to hear a tone.':!s.on[0]&&g===1?`There is nothing at 200 Hz, yet the wave still repeats every 5 ms, so the brain hears 200 Hz. The pitch follows the spacing of the harmonics (200 Hz), not the lowest one present (${low} Hz).`:s.on[0]?'With the fundamental present, the pitch is 200 Hz and the wave repeats every 5 ms.':`Only harmonics that are multiples of ${g} remain, so the wave repeats every ${fmt(5/g)} ms and the pitch jumps to ${pitch} Hz.`;
  return {svg:out,phase};
 }});

const M8_TARGETS=[150,175,200,225,250];
const M8_matchOrder=s=>shuffled(M8_TARGETS,M8_mix(s.seed));
function M8_classify(f0,m){const r=m/f0;for(const [k,l] of [[1,'the missing fundamental'],[2,'an octave above it'],[3,'the lowest component'],[4,'the second component']])if(Math.abs(r/k-1)<.06)return l;return 'none of the expected pitches'}
SCENE({id:'missing-fundamental-match',name:'Match the pitch',tag:'You are the listener',
 definition:'A pitch-matching test: listen to a sound with no fundamental, then tune a pure tone until it seems to have the same pitch.',
 example:'For harmonics 3, 4 and 5 of 150 Hz (450, 600 and 750 Hz), most listeners set the pure tone near 150 Hz, a frequency absent from the sound, not near 450 Hz.',
 desc:'A pitch-matching experiment: each match is plotted against the true missing fundamental, with lines for the fundamental, its octave and the lowest component.',
 research:'Schouten (1940); Houtsma & Goldstein (1972). The perception of musical intervals: evidence for the central origin of the pitch of complex tones. Octave errors are common in matching tasks.',
 dur:10,hint:'Play the mystery sound, slide your tone until it matches, then Record. Five trials, each with a different missing fundamental.',
 init:()=>({seed:1,i:0,match:300,res:[]}),
 watch(p){const n=Math.min(5,Math.floor(p*6)),r=M8_rng(77),o=M8_matchOrder({seed:1}),res=[];for(let i=0;i<n;i++){const f0=o[i],e=1+.02*M8_gauss(r);res.push({f0,m:Math.round((i===3?2:1)*f0*e)})}return {seed:1,i:n,match:n?res[n-1].m:300,res,sim:true}},
 ui:[{b:'Play mystery sound',act:'play'},{range:'match',label:'Your tone',min:100,max:900,step:1,get:s=>s.match,act:'match',show:v=>v+' Hz'},{b:'Play your tone',act:'mine'},{b:'Record match',act:'rec'},{b:'Start again',act:'again'}],
 on:{play(s){if(s.i<5)M8_complex(M8_matchOrder(s)[s.i],[3,4,5],{dur:1.2})},mine(s){AUDIO.tone(s.match,{dur:1.2,gain:.2})},match(s,v){s.match=v},
  rec(s){if(s.i>=5)return;s.res.push({f0:M8_matchOrder(s)[s.i],m:s.match});s.i++},again(s){s.seed=nextSeed();s.i=0;s.res=[]}},
 draw(s,f,X){
  let out=heading('Tune a pure tone to the mystery sound',26);
  out+=TB(150,66,s.i<5?`Trial ${s.i+1} of 5`:'All five trials done',17,C.ink);
  const last=s.res[s.res.length-1];
  if(last){const c=M8_classify(last.f0,last.m);out+=R(20,86,260,150,'#f6f9fb','none',8)+TF(32,108,'Last trial revealed:',13,C.muted,'start')+TF(32,130,`components ${last.f0*3}, ${last.f0*4}, ${last.f0*5} Hz`,14,C.ink,'start')
   +TF(32,152,`missing fundamental ${last.f0} Hz`,14,C.blue,'start')+TF(32,174,`your match ${last.m} Hz`,14,C.ink,'start')+TBF(32,200,`→ ${c}`,14,c.startsWith('the missing')?C.green:C.amber,'start')}
  else out+=TF(150,130,'The sound has three components.',14,C.muted)+TF(150,150,'Its fundamental is missing.',14,C.muted)+TF(150,178,'What pitch do you hear?',15,C.ink);
  out+=TF(150,262,s.sim?'Simulated listener (Watch)':'Your matches',13,C.muted);
  const pl=M8_plot(330,48,240,252,[140,260],[100,900],{xt:[[150,'150'],[200,'200'],[250,'250']],yt:[[100,'100'],[300,'300'],[500,'500'],[700,'700'],[900,'900']],xl:'missing fundamental (Hz)',yl:'your match (Hz)'});out+=pl.svg;
  const line=(k,col,dash,lab)=>{const a=Math.max(140,100/k),b=Math.min(260,900/k);out+=L(pl.X(a),pl.Y(k*a),pl.X(b),pl.Y(k*b),col,2,dash?'stroke-dasharray="6 5"':'')+TF(pl.X(b)-4,pl.Y(k*b)-6,lab,13,col,'end')};
  line(1,C.blue,false,'fundamental');line(2,C.muted,true,'octave');line(3,C.coral,false,'lowest part');
  s.res.forEach(r=>out+=Ci(pl.X(r.f0),pl.Y(clamp(r.m,100,900)),6,C.ink,'#fff'));
  const nF=s.res.filter(r=>M8_classify(r.f0,r.m).startsWith('the missing')).length,nL=s.res.filter(r=>M8_classify(r.f0,r.m)==='the lowest component').length;
  if(s.res.length)out+=T(300,370,`${nF} of ${s.res.length} matches near the missing fundamental · ${nL} near the lowest component`,14,C.ink);
  return {svg:out,phase:s.res.length?'Points on the blue line mean you heard a pitch that is not physically present. Points on the dashed line are octave errors, which are common and still follow the harmonic spacing.':'Each trial plays harmonics 3, 4 and 5 of a hidden fundamental between 150 and 250 Hz. Match its pitch with the pure tone.'};
 }});

const M8_BASS=[[28,'E1'],[33,'A1'],[38,'D2'],[43,'G2']];
const M8_spk=(f,cut)=>1/Math.sqrt(1+Math.pow(cut/f,4));
SCENE({id:'missing-fundamental-speaker',name:'Bass from small speakers',tag:'The brain fills in the bottom',
 definition:'Small speakers cannot reproduce low bass notes, but they still play the upper harmonics, and the ear rebuilds the missing low pitch from them.',
 example:'A phone speaker barely produces 55 Hz, yet a bass A1 (55 Hz) still sounds like A1, because 110, 165, 220 Hz and higher harmonics get through.',
 desc:'Harmonics of a bass note on a log frequency axis, with a small speaker’s response curve cutting the lowest ones.',
 research:'Schouten (1940); Larsen & Aarts (2005). Audio Bandwidth Extension (psychoacoustic “virtual bass”), Wiley.',
 dur:9,hint:'Choose a bass note and the speaker’s cut-off, then compare the full sound with the speaker version. On a laptop both may sound alike, which is the point.',
 init:()=>({m:33,cut:150}),
 watch(p){return {m:33,cut:Math.round(40+p*220)}},
 ui:[{choose:M8_BASS.map(([m,n])=>[m,n]),label:'Bass note',get:s=>s.m,act:'note'},{range:'cut',label:'Speaker cut-off',min:40,max:300,step:5,get:s=>s.cut,act:'cut',show:v=>v+' Hz'},{b:'Full sound',act:'full'},{b:'Through small speaker',act:'small'}],
 on:{note(s,v){s.m=Number(v)},cut(s,v){s.cut=v},full(s){M8_complex(midiHz(s.m),range(8).map(i=>i+1),{amp:n=>1/n,dur:1.4})},small(s){const f0=midiHz(s.m);M8_complex(f0,range(8).map(i=>i+1),{amp:n=>M8_spk(n*f0,s.cut)/n,dur:1.4})}},
 draw(s){
  const f0=midiHz(s.m),name=(M8_BASS.find(b=>b[0]===s.m)||[0,noteName(s.m)])[1];let out=heading(`${name} (${fmt(f0)} Hz) through a small speaker`,26);
  const lx=f=>60+(Math.log10(f)-Math.log10(25))/(Math.log10(1000)-Math.log10(25))*500;
  out+=R(50,44,520,220,'#fff',C.grid,4);
  out+=R(50,44,Math.max(0,lx(s.cut)-50),220,'#fbefe9','none',4)+TF(56,62,'speaker too small to move air here',13,C.coral,'start');
  const pts=[];for(let i=0;i<=200;i++){const f=25*Math.pow(40,i/200);pts.push([lx(f),258-M8_spk(f,s.cut)*190])}out+=M8_poly(pts,C.coral,2.4);
  for(let n=1;n<=8;n++){const f=n*f0;if(f>1000)break;const x=lx(f),a=190/n,g=M8_spk(f,s.cut);out+=R(x-6,258-a,12,a,C.pale,C.line,3)+R(x-6,258-a*g,12,a*g,C.blue,'none',3)}
  [25,50,100,200,500,1000].forEach(f=>out+=TF(lx(f),282,String(f),13,C.muted));out+=TF(560,282,'Hz',13,C.muted,'end');
  const g1=M8_spk(f0,s.cut);
  out+=T(300,316,`The ${fmt(f0)} Hz fundamental comes out at ${Math.round(g1*100)}% · harmonics above ${s.cut} Hz pass well`,15,C.ink);
  out+=TF(300,340,'pale = original harmonic · blue = what the speaker plays · coral = speaker response',13,C.muted);
  return {svg:out,phase:g1<.3?`The speaker hardly produces ${fmt(f0)} Hz, but the higher harmonics still repeat every ${fmt(1000/f0)} ms, so you still hear ${name}. Phone and laptop speakers rely on this every day.`:`At this cut-off the speaker still reproduces much of the fundamental; lower the cut-off slider to imitate a phone speaker.`};
 }});

/* =========================== consonance-roughness =========================== */
const M8_SEPS=[4,8,15,25,35,50,75,110,140];
const M8_sepOrder=s=>shuffled(M8_SEPS,M8_mix(s.seed+100));
SCENE({id:'consonance-roughness',name:'Roughness and consonance',tag:'Rate it yourself',
 definition:'Two pure tones sound rough when their frequencies are close enough to interact in the ear, most of all at about a quarter of a critical band apart; further apart they sound smooth again.',
 example:'400 Hz with 425 Hz sounds harsh and buzzing; 400 Hz with 540 Hz sounds smooth, even though neither pair is a “nice” musical interval.',
 desc:'A roughness rating experiment: your ratings for pairs of pure tones are plotted over the Plomp–Levelt roughness curve, which peaks near a quarter of a critical band.',
 research:'Plomp & Levelt (1965). Tonal consonance and critical bandwidth. JASA 38. Curve as parameterised by Sethares (1993); critical band after Zwicker & Terhardt (1980).',
 dur:10,hint:'Play each pair of pure tones, then rate it from 1 (smooth) to 5 (rough). Nine pairs, all starting at 400 Hz.',
 init:()=>({seed:1,i:0,res:[]}),
 watch(p){const n=Math.min(9,Math.floor(p*10)),o=M8_sepOrder({seed:1}),r=M8_rng(91),res=[];for(let i=0;i<n;i++){const d=o[i];res.push({d,r:clamp(Math.round(1+4*M8_pl(d,400)+.6*M8_gauss(r)),1,5)})}return {seed:1,i:n,res,sim:true}},
 ui:[{b:'Play pair',act:'play'},{b:'1 smooth',act:'rate',arg:1},{b:'2',act:'rate',arg:2},{b:'3',act:'rate',arg:3},{b:'4',act:'rate',arg:4},{b:'5 rough',act:'rate',arg:5},{b:'Start again',act:'again'}],
 on:{play(s){if(s.i<9)AUDIO.chord([400,400+M8_sepOrder(s)[s.i]],{dur:1.3,gain:.24})},rate(s,v){if(s.i>=9)return;s.res.push({d:M8_sepOrder(s)[s.i],r:Number(v)});s.i++},again(s){s.seed=nextSeed();s.i=0;s.res=[]}},
 draw(s){
  let out=heading('How rough do two pure tones sound?',26);
  const cb=M8_cb(450),pl=M8_plot(70,58,490,232,[0,150],[0,1.05],{xt:[[0,'0'],[25,'25'],[50,'50'],[75,'75'],[100,'100'],[150,'150 Hz']],yt:[[0,'smooth'],[1,'rough']],xl:'difference between the two tones (Hz), starting at 400 Hz'});out+=pl.svg;
  const pts=[];for(let i=0;i<=150;i++)pts.push([pl.X(i),pl.Y(M8_pl(i,400))]);out+=M8_poly(pts,C.coral,2.6);
  out+=L(pl.X(cb),58,pl.X(cb),290,C.muted,1.4,'stroke-dasharray="5 4"')+TF(pl.X(cb)-4,74,`critical band ≈ ${Math.round(cb)} Hz`,13,C.muted,'end');
  out+=TF(pl.X(25)+6,pl.Y(1)+16,'peak ≈ ¼ band',13,C.coral,'start');
  s.res.forEach(r=>out+=Ci(pl.X(r.d),pl.Y((r.r-1)/4),6,C.blue,'#fff'));
  const rr=M8_corr(s.res.map(r=>r.r),s.res.map(r=>M8_pl(r.d,400)));
  out+=T(300,352,s.i<9?`Pair ${s.i+1} of 9 · difference hidden until you rate it`:'All nine pairs rated',15,C.ink);
  if(s.res.length>=4&&isFinite(rr))out+=T(300,374,`${s.sim?'Simulated listener':'Your ratings'} agree with the curve: r = ${rr.toFixed(2)}`,14,rr>.6?C.green:C.amber);
  return {svg:out,phase:'Blue dots are ratings, coral is the Plomp–Levelt curve. Roughness rises fast for small differences, peaks near a quarter of the critical band and fades once the tones fall in separate bands.'};
 }});

SCENE({id:'consonance-roughness-beats',name:'Beats, roughness, two tones',tag:'Three zones',
 definition:'As two pure tones move apart you hear first slow beats (loudness wobbling), then roughness, then two separate smooth tones.',
 example:'440 and 443 Hz throb three times a second, as when tuning a guitar; 440 and 480 Hz sound rough; 440 and 600 Hz sound like two clear notes.',
 desc:'The loudness envelope of two summed tones over half a second, above a scale of frequency difference divided into beats, roughness and separate tones.',
 research:'Helmholtz (1863), On the Sensations of Tone; Zwicker & Fastl (1990), Psychoacoustics: Facts and Models. Zone edges are approximate and depend on frequency.',
 dur:9,hint:'Slide the difference between the tones and press Play. Listen for where throbbing turns into roughness.',
 init:()=>({d:3}),
 watch(p){return {d:Math.round(Math.pow(150,p)*10)/10}},
 ui:[{range:'d',label:'Difference',min:0,max:150,step:.5,get:s=>s.d,act:'d',show:v=>v+' Hz'},{b:'Play 440 Hz + 440 Hz + difference',act:'play'}],
 on:{d(s,v){s.d=v},play(s){AUDIO.chord([440,440+s.d],{dur:2,gain:.24})}},
 draw(s){
  const d=s.d,cb=M8_cb(440+d/2);let out=heading(`440 Hz and ${fmt(440+d)} Hz played together`,26);
  const pl=M8_plot(60,52,500,140,[0,500],[0,2.1],{xt:[[0,'0'],[100,'100'],[200,'200'],[300,'300'],[400,'400'],[500,'500 ms']],yt:[[0,'0'],[2,'2']],yl:'loudness envelope'});out+=pl.svg;
  const pts=[];for(let i=0;i<=500;i++){const t=i/1000;pts.push([pl.X(i),pl.Y(2*Math.abs(Math.cos(Math.PI*d*t)))])}out+=M8_poly(pts,C.blue,2);
  const zx=v=>60+Math.min(v,150)/150*500,zy=246;
  out+=R(zx(0),zy,zx(15)-zx(0),30,C.greenp,'none',4)+R(zx(15),zy,zx(Math.min(cb,150))-zx(15),30,C.coralp,'none',4)+R(zx(Math.min(cb,150)),zy,zx(150)-zx(Math.min(cb,150)),30,C.pale,'none',4);
  out+=TF((zx(0)+zx(15))/2,zy+20,'beats',13,C.green)+TF((zx(15)+zx(cb))/2,zy+20,'roughness',13,C.coral)+TF((zx(cb)+zx(150))/2+4,zy+20,'two tones',13,C.blue);
  [0,25,50,75,100,125,150].forEach(v=>out+=TF(zx(v),zy+46,String(v),13,C.muted));out+=TF(560,zy+62,'difference (Hz)',13,C.muted,'end');
  out+=`<polygon points="${fmt(zx(d))},${zy-2} ${fmt(zx(d)-7)},${zy-14} ${fmt(zx(d)+7)},${zy-14}" fill="${C.ink}"/>`;
  const zone=d<1?'one steady tone':d<15?'slow beats':d<cb?'roughness':'two separate tones';
  out+=T(300,370,`${fmt(d)} Hz apart: ${zone}${d>=1&&d<15?` (${fmt(d)} throbs per second)`:''}`,15,C.ink);
  return {svg:out,phase:d<15?'The two waves drift in and out of step, so the loudness rises and falls at the difference frequency: beats. Tuners listen for them to disappear.':d<cb?'The wobble is now too fast to follow as loudness changes; it is heard as a rasping roughness instead.':'The tones are more than a critical band apart, so the ear resolves them separately and the roughness fades.'};
 }});

const M8_RATIOS=[[1,1],[6,5],[5,4],[4,3],[3,2],[5,3],[2,1]];
const M8_IVN=['unison','minor 2nd','major 2nd','minor 3rd','major 3rd','perfect 4th','tritone','perfect 5th','minor 6th','major 6th','minor 7th','major 7th','octave'];
const M8_DISS={};
function M8_dissCurve(kind){if(M8_DISS[kind])return M8_DISS[kind];const f1=261.63,K=kind==='sine'?1:6,a=range(K).map(k=>Math.pow(.88,k)),v=[];
 for(let c=0;c<=1200;c+=5){const f2=f1*Math.pow(2,c/1200);let D=0;for(let i=0;i<K;i++)for(let j=0;j<K;j++){const p=f1*(i+1),q=f2*(j+1);D+=a[i]*a[j]*M8_pl(p-q,Math.min(p,q))}v.push(D)}
 const mx=Math.max(...v);return M8_DISS[kind]=v.map(x=>x/mx)}
SCENE({id:'consonance-roughness-intervals',name:'Why fifths sound smooth',tag:'Harmonics line up',
 definition:'For notes with harmonics, roughness between neighbouring harmonics dips wherever the two notes form a simple ratio, which is why octaves, fifths and fourths sound smooth.',
 example:'At a perfect fifth (3:2) the third harmonic of the lower note coincides with the second of the upper note, so few harmonics clash. A semitone higher, many pairs fall a quarter of a critical band apart.',
 desc:'A dissonance curve across an octave for two notes with six harmonics each, dipping at simple ratios; with pure sine tones the dips vanish.',
 research:'Helmholtz (1863); Plomp & Levelt (1965); Sethares (1993). Local consonance and the relationship between timbre and scale. JASA 94.',
 dur:10,hint:'Slide the interval and play it. Switch to pure sine tones and watch the dips disappear: the smoothness of a fifth comes from the harmonics.',
 init:()=>({c:700,kind:'harm'}),
 watch(p){return {c:Math.round(p*1200),kind:'harm'}},
 ui:[{range:'c',label:'Interval',min:0,max:1200,step:1,get:s=>s.c,act:'c',show:v=>v+' cents'},{choose:[['harm','6 harmonics'],['sine','pure sines']],label:'Tone colour',get:s=>s.kind,act:'kind'},{b:'Play interval',act:'play'}],
 on:{c(s,v){s.c=v},kind(s,v){s.kind=v},play(s){const f1=261.63,f2=f1*Math.pow(2,s.c/1200),K=s.kind==='sine'?1:6;[f1,f2].forEach(f=>{for(let k=1;k<=K;k++)AUDIO.tone(f*k,{dur:1.5,gain:.16*Math.pow(.88,k-1)/Math.sqrt(K)})})}},
 draw(s){
  const v=M8_dissCurve(s.kind);let out=heading(`Two ${s.kind==='sine'?'pure sine tones':'notes with six harmonics'} from middle C`,26);
  const pl=M8_plot(60,52,500,226,[0,1200],[0,1.05],{yt:[[0,'0'],[1,'max']],yl:'roughness (dissonance)'});out+=pl.svg;
  out+=M8_poly(v.map((y,i)=>[pl.X(i*5),pl.Y(y)]),C.coral,2.4);
  M8_RATIOS.forEach(([a,b])=>{const c=1200*Math.log2(a/b),x=pl.X(c);out+=L(x,278,x,284,C.line,1)+TF(x,298,`${a}:${b}`,13,C.muted)});
  const yv=v[Math.round(s.c/5)],x=pl.X(s.c);out+=L(x,52,x,278,C.blue,1.6)+Ci(x,pl.Y(yv),6,C.blue,'#fff');
  const near=M8_RATIOS.map(([a,b])=>({a,b,c:1200*Math.log2(a/b)})).sort((p,q)=>Math.abs(p.c-s.c)-Math.abs(q.c-s.c))[0];
  out+=T(300,330,`${s.c} cents ≈ ${M8_IVN[Math.round(s.c/100)]} · nearest simple ratio ${near.a}:${near.b} (${Math.round(near.c)} cents)`,15,C.ink);
  out+=T(300,354,`roughness here: ${yv.toFixed(2)} of the maximum`,14,C.muted);
  return {svg:out,phase:s.kind==='sine'?'With pure tones only the region just above unison is rough; there are no dips at fifths or thirds. Consonance of intervals comes largely from the harmonics.':'Each dip is an interval where harmonics coincide: octave, fifth, fourth, sixths and thirds. Equal-tempered intervals sit close to, but not exactly on, the dips.'};
 }});

/* =========================== expectation =========================== */
const M8_probeOrder=s=>shuffled(range(12),M8_mix(s.seed+200));
SCENE({id:'expectation',name:'Expectation and tonal fit',tag:'The probe-tone test',
 definition:'After hearing a key, listeners judge some notes as fitting much better than others: the tonic best, then the fifth and third, with notes outside the scale worst.',
 example:'After a C major cadence, C sounds like home, G and E fit well, and F♯ or C♯ sound out of place. Krumhansl and Kessler measured these ratings for every note.',
 desc:'A probe-tone experiment: your 1–7 fit ratings for the twelve notes after a key context, as bars, beside Krumhansl and Kessler’s published profile.',
 research:'Krumhansl & Kessler (1982). Tracing the dynamic changes in perceived tonal organization. Psychological Review 89. Meyer (1956), Emotion and Meaning in Music.',
 dur:11,hint:'Play the key context and probe, then rate how well the last note fits (1 poor, 7 great). Twelve probes in a random order.',
 init:()=>({mode:'major',seed:1,i:0,r:Array(12).fill(null)}),
 watch(p){const n=Math.min(12,Math.floor(p*13)),o=M8_probeOrder({seed:1}),rr=M8_rng(55),r=Array(12).fill(null);for(let i=0;i<n;i++){const pc=o[i];r[pc]=clamp(Math.round(M8_KKMAJ[pc]+.8*M8_gauss(rr)),1,7)}return {mode:'major',seed:1,i:n,r,sim:true}},
 ui:[{choose:[['major','C major'],['minor','C minor']],label:'Key',get:s=>s.mode,act:'mode'},{b:'Play context + probe',act:'play'},...range(7).map(k=>({b:k===0?'1 poor':k===6?'7 great':String(k+1),act:'rate',arg:k+1})),{b:'New order',act:'again'}],
 on:{mode(s,v){s.mode=v;s.i=0;s.r=Array(12).fill(null)},again(s){s.seed=nextSeed();s.i=0;s.r=Array(12).fill(null)},
  play(s){if(s.i>=12)return;const ch=s.mode==='major'?[[60,64,67],[60,65,69],[59,62,67],[60,64,67]]:[[60,63,67],[60,65,68],[59,62,67],[60,63,67]];ch.forEach((c,k)=>AUDIO.chord(c.map(midiHz),{dur:.55,at:k*.6,gain:.2}));M8_shepard(M8_probeOrder(s)[s.i],{at:2.7,dur:.9})},
  rate(s,v){if(s.i>=12)return;s.r[M8_probeOrder(s)[s.i]]=Number(v);s.i++}},
 draw(s){
  const kk=s.mode==='major'?M8_KKMAJ:M8_KKMIN;let out=heading(`How well does each note fit ${s.mode==='major'?'C major':'C minor'}?`,26);
  const pl=M8_plot(60,56,500,214,[0,12],[1,7.2],{yt:[[1,'1'],[4,'4'],[7,'7']],yl:'fit rating'});out+=pl.svg;
  const cw=500/12;
  for(let pc=0;pc<12;pc++){const x=60+pc*cw;if(s.r[pc]!==null)out+=R(x+8,pl.Y(s.r[pc]),cw-16,pl.Y(1)-pl.Y(s.r[pc]),C.blue,'none',3);out+=TF(x+cw/2,288,M8_PCN[pc],13,C.ink)}
  out+=M8_poly(kk.map((v,pc)=>[60+pc*cw+cw/2,pl.Y(v)]),C.coral,2.2);kk.forEach((v,pc)=>out+=Ci(60+pc*cw+cw/2,pl.Y(v),4.5,C.coral));
  const rated=range(12).filter(pc=>s.r[pc]!==null),rr=M8_corr(rated.map(pc=>s.r[pc]),rated.map(pc=>kk[pc]));
  out+=TF(60,312,`blue = ${s.sim?'simulated listener':'you'}`,13,C.blue,'start')+TF(560,312,'coral = Krumhansl & Kessler’s listeners',13,C.coral,'end');
  out+=T(300,342,s.i<12?`Probe ${s.i+1} of 12 (which note is hidden until you rate it)`:'All twelve probes rated',15,C.ink);
  if(rated.length>=4&&isFinite(rr))out+=T(300,366,`Agreement with the published profile: r = ${rr.toFixed(2)}`,14,rr>.6?C.green:C.amber);
  return {svg:out,phase:'The published profile peaks at the tonic, then the fifth and third, and dips for notes outside the scale. Listeners without training produce a similar shape, learned from exposure to the music around them.'};
 }});

const M8_TUNES=[{name:'Twinkle',notes:[60,60,67,67,69,69,67],next:65},{name:'Ode to Joy',notes:[64,64,65,67,67,65,64,62,60,60,62,64],next:64},{name:'Frère Jacques',notes:[60,62,64,60,60,62,64,60,64,65],next:67}];
function M8_nextProbs(notes){const last=notes[notes.length-1],w=[];for(let m=60;m<=76;m++)w.push(Math.pow(M8_KKMAJ[M8_pc(m)],2)*Math.exp(-Math.abs(m-last)/2.5));const z=sum(w);return w.map(x=>x/z)}
SCENE({id:'expectation-melody',name:'What comes next?',tag:'Surprise in bits',
 definition:'Listeners continuously predict the next note. Expected notes are usually close in pitch and stable in the key; an unexpected note carries more surprise, measurable in bits.',
 example:'After “Twinkle, twinkle, little star” (C C G G A A G) most people expect F next, a step down to a stable note. A leap to C♯ would be highly surprising.',
 desc:'A short melody above a bar chart of predicted probabilities for the next note and a keyboard; pressing a key shows its probability and its surprise in bits.',
 research:'Huron (2006). Sweet Anticipation: Music and the Psychology of Expectation. Narmour (1990); Krumhansl & Kessler (1982). The model here is a simplified toy: proximity × tonal fit.',
 dur:10,hint:'Choose a tune, then press the key you expect next. Your choice is played after the tune, with its probability and surprise.',
 init:()=>({t:0,pick:null}),
 watch(p){return {t:Math.min(2,Math.floor(p*3)),pick:null,showNext:true}},
 ui:[{choose:M8_TUNES.map((t,i)=>[i,t.name]),label:'Tune',get:s=>s.t,act:'tune'},{b:'Play tune',act:'play'},{b:'Play tune + most expected',act:'best'}],
 on:{tune(s,v){s.t=Number(v);s.pick=null},play(s){M8_melody(M8_TUNES[s.t].notes,.38)},
  best(s){const tn=M8_TUNES[s.t],pr=M8_nextProbs(tn.notes),m=60+pr.indexOf(Math.max(...pr));M8_melody(tn.notes.concat(m),.38)},
  pick(s,m){s.pick=Number(m);M8_melody(M8_TUNES[s.t].notes.slice(-4).concat(s.pick),.38)}},
 draw(s,f,X){
  const tn=M8_TUNES[s.t],pr=M8_nextProbs(tn.notes),best=60+pr.indexOf(Math.max(...pr));let out=heading(`${tn.name}: which note comes next?`,26);
  out+=M8_roll(tn.notes.concat(s.pick!==null?[s.pick]:[]),60,40,500,70,58,78,{slots:tn.notes.length+1,hl:s.pick!==null?tn.notes.length:-1});
  const kb=M8_keys(X,90,276,42,74,60,76,'pick',m=>m===s.pick?C.amberp:null);
  for(let m=60;m<=76;m++){const p=kb.pos[m];if(!p)continue;const h=pr[m-60]*360;out+=R(p.x-(p.black?6:9),268-h,p.black?12:18,h,m===best?C.green:C.blue,'none',3)}
  out+=TF(80,140,'predicted chance of each next note',13,C.muted,'start');
  out+=kb.svg;
  let line;if(s.pick!==null){const p=pr[s.pick-60],rank=1+pr.filter(x=>x>p).length;line=`${noteName(s.pick)}: chance ${Math.round(p*100)}%, surprise ${(-Math.log2(p)).toFixed(1)} bits (rank ${rank}) · the tune continues with ${noteName(tn.next)}`}
  else line=s.showNext?`Most expected: ${noteName(best)} (${Math.round(Math.max(...pr)*100)}%) · the tune actually continues with ${noteName(tn.next)}`:'Press the key you expect next.';
  out+=T(300,370,line,14,C.ink);
  return {svg:out,phase:'Surprise in bits is −log₂(probability): a note with a 1 in 2 chance carries 1 bit, a 1 in 32 chance carries 5 bits. Composers balance the expected with the surprising; Huron argues the pleasure lies partly in predictions coming true.'};
 }});

const M8_KF=[{name:'Twinkle',notes:[60,60,67,67,69,69,67,65,65,64,64,62,62,60]},{name:'Greensleeves',notes:[57,60,62,64,65,64,62,59,55,57,59,60,57,57,56,57,59,56,52]},{name:'D major scale',notes:[62,64,66,67,69,71,73,74]}];
function M8_keyCorrs(notes){const d=Array(12).fill(0);notes.forEach(m=>d[M8_pc(m)]++);const res=[];for(const [prof,q] of [[M8_KKMAJ,'major'],[M8_KKMIN,'minor']])for(let k=0;k<12;k++)res.push({k,q,r:M8_corr(d,range(12).map(pc=>prof[(pc-k+12)%12]))});return res}
SCENE({id:'expectation-key-finding',name:'Finding the key',tag:'Krumhansl–Schmuckler',
 definition:'The key of a melody can be estimated by counting how often each note occurs and comparing that pattern with the probe-tone profile of every major and minor key.',
 example:'“Twinkle” uses C, G and E most and never C♯, so its counts correlate best with the C major profile.',
 desc:'A melody strip, correlations with all 24 major and minor key profiles as two rows of bars, and a keyboard for adding notes.',
 research:'Krumhansl (1990). Cognitive Foundations of Musical Pitch, Oxford University Press (the Krumhansl–Schmuckler key-finding algorithm). Counts here ignore note durations.',
 dur:10,hint:'Choose a tune or build your own by pressing keys. The bars show how well your notes fit each key.',
 init:()=>({preset:0,notes:M8_KF[0].notes.slice()}),
 watch(p){const i=Math.min(2,Math.floor(p*3));return {preset:i,notes:M8_KF[i].notes.slice()}},
 ui:[{choose:M8_KF.map((t,i)=>[i,t.name]),label:'Tune',get:s=>s.preset,act:'preset'},{b:'Play',act:'play'},{b:'Undo',act:'undo'},{b:'Clear',act:'clear'}],
 on:{preset(s,v){s.preset=Number(v);s.notes=M8_KF[s.preset].notes.slice()},play(s){M8_melody(s.notes,.32)},undo(s){s.notes.pop()},clear(s){s.notes=[]},add(s,m){if(s.notes.length<24){s.notes.push(Number(m));AUDIO.tone(midiHz(Number(m)),{dur:.35,type:'triangle',gain:.16})}}},
 draw(s,f,X){
  let out=heading('Which key fits these notes best?',26);
  out+=M8_roll(s.notes,60,38,500,56,50,78,{slots:Math.max(8,s.notes.length)});
  if(!s.notes.length)out+=T(310,72,'Press keys below to add notes.',14,C.muted);
  const rs=s.notes.length>1?M8_keyCorrs(s.notes):[],cw=500/12;
  ['major','minor'].forEach((q,row)=>{const y0=118+row*76;out+=TF(56,y0+18,q,13,C.muted,'end');
   for(let k=0;k<12;k++){const r=(rs.find(e=>e.k===k&&e.q===q)||{r:NaN}).r,x=60+k*cw;out+=R(x+4,y0,cw-8,52,'#f6f9fb','none',3);
    if(isFinite(r)&&r>0)out+=R(x+4,y0+52-r*52,cw-8,r*52,C.blue,'none',3);out+=TF(x+cw/2,y0+68,M8_PCN[k],13,C.ink)}});
  const kb=M8_keys(X,75,276,30,62,52,76,'add',null);out+=kb.svg;
  const top=rs.filter(e=>isFinite(e.r)).sort((a,b)=>b.r-a.r);
  out+=T(300,366,top.length?`Best fit: ${M8_PCN[top[0].k]} ${top[0].q} (r = ${top[0].r.toFixed(2)}) · next: ${M8_PCN[top[1].k]} ${top[1].q} (${top[1].r.toFixed(2)})`:'Add at least two notes.',15,C.ink);
  return {svg:out,phase:'Each bar is the correlation between your note counts and a key’s profile. Relative keys (C major and A minor) share notes, so they often come close; the order and length of notes, ignored here, help listeners decide.'};
 }});

/* =========================== music-emotion =========================== */
const M8_SCALES={major:[0,2,4,5,7,9,11,12],minor:[0,2,3,5,7,8,10,12]};
const M8_TUNE_STEPS=[0,1,2,3,4,3,2,1,0];
const M8_REG={low:-12,mid:0,high:12};
function M8_va(s){const ar=clamp(((s.tempo-50)/150)*1.2+(s.loud/100-.5)*.9+(s.reg==='high'?.15:s.reg==='low'?-.15:0)-.6,-1,1);
 const va=clamp((s.mode==='major'?.45:-.45)+((s.tempo-120)/80)*.25+(s.reg==='high'?.15:s.reg==='low'?-.15:0)-(s.loud>85?.15:0),-1,1);return {ar,va}}
const M8_EMO=[{tempo:160,mode:'major',loud:80,reg:'high'},{tempo:60,mode:'minor',loud:25,reg:'low'},{tempo:70,mode:'major',loud:30,reg:'mid'},{tempo:170,mode:'minor',loud:95,reg:'low'}];
SCENE({id:'music-emotion',name:'Music and emotion',tag:'Cues listeners use',
 definition:'Listeners judge the emotion a piece expresses from cues such as tempo, loudness, pitch register and mode. Tempo and loudness are read similarly across cultures; mode is more learned.',
 example:'A fast, loud, high melody tends to sound happy or excited; the same notes slow, soft and low tend to sound sad or tender.',
 desc:'A valence–arousal plane with a dot placed by the chosen tempo, mode, loudness and register, beside a list of the cues and their typical directions.',
 research:'Juslin & Laukka (2003). Communication of emotions in vocal expression and music performance. Psych. Bulletin 129. Balkwill & Thompson (1999); Fritz et al. (2009) Current Biology. Weights here are illustrative.',
 dur:10,hint:'Change tempo, mode, loudness and register, then Play the same tune. Notice which cue moves the dot most.',
 init:()=>({tempo:120,mode:'major',loud:50,reg:'mid'}),
 watch(p){return {...M8_EMO[Math.min(3,Math.floor(p*4))]}},
 ui:[{range:'tempo',label:'Tempo',min:50,max:200,step:5,get:s=>s.tempo,act:'tempo',show:v=>v+' bpm'},{choose:[['major','major'],['minor','minor']],label:'Mode',get:s=>s.mode,act:'mode'},{range:'loud',label:'Loudness',min:0,max:100,step:5,get:s=>s.loud,act:'loud',show:v=>v+'%'},{choose:[['low','low'],['mid','middle'],['high','high']],label:'Register',get:s=>s.reg,act:'reg'},{b:'Play',act:'play'}],
 on:{tempo(s,v){s.tempo=v},mode(s,v){s.mode=v},loud(s,v){s.loud=v},reg(s,v){s.reg=v},play(s){const sc=M8_SCALES[s.mode];M8_melody(M8_TUNE_STEPS.map(k=>60+M8_REG[s.reg]+sc[k]),60/s.tempo,{gain:.05+.2*s.loud/100})}},
 draw(s){
  const {ar,va}=M8_va(s);let out=heading('Same tune, different cues',26);
  const cx=440,cy=190,R0=128;out+=R(cx-R0,cy-R0,2*R0,2*R0,'#fff',C.grid,6)+L(cx-R0,cy,cx+R0,cy,C.line,1.4)+L(cx,cy-R0,cx,cy+R0,C.line,1.4);
  out+=TF(cx+R0-6,cy-R0+18,'happy',13,C.green,'end')+TF(cx-R0+6,cy-R0+18,'angry, afraid',13,C.coral,'start')+TF(cx-R0+6,cy+R0-8,'sad',13,C.purple,'start')+TF(cx+R0-6,cy+R0-8,'calm, tender',13,C.blue,'end');
  out+=TF(cx,cy-R0-6,'energetic',13,C.muted)+TF(cx,cy+R0+18,'calm',13,C.muted)+TF(cx-R0-6,cy+4,'−',15,C.muted,'end')+TF(cx+R0+6,cy+4,'+',15,C.muted,'start');
  out+=Ci(cx+va*R0*.9,cy-ar*R0*.9,11,C.amber,'#fff');
  const rows=[['Tempo',`${s.tempo} bpm`,'faster → more energetic'],['Mode',s.mode,'major → brighter (learned)'],['Loudness',`${s.loud}%`,'louder → more energetic'],['Register',s.reg==='mid'?'middle':s.reg,'higher → brighter']];
  rows.forEach(([a,b,c],i)=>{const y=64+i*58;out+=R(22,y,270,48,'#f6f9fb','none',6)+TB(34,y+20,a,14,C.ink,'start')+T(280,y+20,b,14,C.blue,'end')+TF(34,y+39,c,13,C.muted,'start')});
  out+=TF(300,346,'Dot position: illustrative weights summarising typical Western listener judgements, not a measurement.',13,C.muted);
  out+=TF(300,366,'horizontal: negative ↔ positive · vertical: calm ↔ energetic',13,C.muted);
  return {svg:out,phase:'Tempo and loudness shape perceived energy for listeners from many cultures; the major-happy, minor-sad link is weaker and learned. Fritz and colleagues (2009) found that Mafa listeners in Cameroon still recognised happy, sad and scary Western excerpts above chance.'};
 }});

const M8_MECH=['Brain stem reflex','Evaluative conditioning','Emotional contagion','Visual imagery','Episodic memory','Musical expectancy'];
const M8_SCEN=[{t:['A sudden loud chord','makes you jump.'],a:0,why:'Sudden, loud or dissonant sounds trigger fast, built-in alarm responses.'},
 {t:['A tune that always played in your favourite café','calms you, though no single memory comes to mind.'],a:1,why:'Repeated pairing of music with a pleasant setting conditions the feeling.'},
 {t:['A cello phrase sounds like someone sighing,','and you start to feel sad yourself.'],a:2,why:'You mimic the expression you perceive in the music, as with a sad voice.'},
 {t:['The music conjures a wide, sunlit landscape','and you feel at ease.'],a:3,why:'Images evoked by the music carry their own feelings.'},
 {t:['A song brings back the evening','you met an old friend.'],a:4,why:'A specific remembered event returns with its emotion.'},
 {t:['The chord you were sure would come','does not, and you feel a shiver.'],a:5,why:'Confirmed or violated predictions about how the music continues.'}];
SCENE({id:'music-emotion-mechanisms',name:'How music moves us',tag:'Six mechanisms',
 definition:'Music can induce emotions through several different mechanisms, from fast reflexes to memories and expectations, and a single piece can use several at once.',
 example:'A sudden fortissimo startles you through a reflex; the same piece can also remind you of a wedding through episodic memory.',
 desc:'A scenario card and six mechanism buttons; choosing a mechanism shows whether it matches and why.',
 research:'Juslin & Västfjäll (2008). Emotional responses to music: the need to consider underlying mechanisms. Behavioral and Brain Sciences 31. Later extended to eight mechanisms (BRECVEMA; Juslin 2013).',
 dur:12,hint:'Read each scenario and press the mechanism you think explains it. Use Next and Back to move between scenarios.',
 init:()=>({i:0,picks:Array(6).fill(null)}),
 watch(p){const i=Math.min(5,Math.floor(p*6)),picks=Array(6).fill(null);for(let k=0;k<=i;k++)picks[k]=M8_SCEN[k].a;return {i,picks,sim:true}},
 ui:[{b:'◀ Back',act:'move',arg:-1},{b:'Next ▶',act:'move',arg:1}],
 on:{pick(s,k){s.picks[s.i]=Number(k)},move(s,d){s.i=clamp(s.i+Number(d),0,5)}},
 draw(s,f,X){
  const sc=M8_SCEN[s.i],pk=s.picks[s.i];let out=heading(`Scenario ${s.i+1} of 6: which mechanism?`,26);
  out+=R(40,42,520,74,'#f6f9fb','none',10)+T(300,72,sc.t[0],16,C.ink)+T(300,96,sc.t[1],16,C.ink);
  M8_MECH.forEach((m,k)=>{const x=40+(k%3)*176,y=136+Math.floor(k/3)*62,chosen=pk===k,right=k===sc.a,show=pk!==null;
   const fill=show&&right?C.greenp:chosen?C.coralp:'#fff',stroke=show&&right?C.green:chosen?C.coral:C.line;
   out+=hit(X,'pick',k,`${m}${chosen?' (chosen)':''}`,R(x,y,168,52,fill,stroke,8)+TF(x+84,y+31,m,14,C.ink))});
  const score=s.picks.filter((p,k)=>p===M8_SCEN[k].a).length,done=s.picks.filter(p=>p!==null).length;
  if(pk!==null)out+=T(300,290,pk===sc.a?`✓ ${M8_MECH[sc.a]}`:`Not quite: ${M8_MECH[sc.a]}`,16,pk===sc.a?C.green:C.coral)+TF(300,314,sc.why,14,C.ink);
  out+=T(300,354,`${score} of ${done} answered correctly${s.sim?' (Watch shows the answers)':''}`,14,C.muted);
  return {svg:out,phase:'Juslin and Västfjäll argued that research had mixed these mechanisms together. Telling them apart explains why the same piece moves different listeners differently, and why emotions felt can differ from emotions the music expresses.'};
 }});

const M8_MOZ=[{k:'claim',name:'The 1993 claim'},{k:'chabris',name:'Chabris 1999'},{k:'pietschnig',name:'Pietschnig 2010'},{k:'arousal',name:'Arousal explanation'}];
SCENE({id:'music-emotion-mozart',name:'The “Mozart effect”',tag:'Checking a famous claim',
 definition:'The claim that listening to Mozart makes people smarter. The original finding was a small, brief gain on one spatial task, and later research traced most of it to mood and arousal rather than Mozart.',
 example:'Listening to any music you enjoy, or an exciting story, before a puzzle can give a similar brief boost. Mozart has no special power.',
 desc:'A bar chart of published effect sizes for the Mozart effect, from the original claim to two meta-analyses and the arousal explanation.',
 research:'Rauscher, Shaw & Ky (1993) Nature 365; Chabris (1999) Nature 400; Pietschnig, Voracek & Formann (2010) Intelligence 38; Thompson, Schellenberg & Husain (2001) Psychological Science 12. Effect sizes approximate.',
 dur:12,hint:'Step through the evidence. Effect sizes are in Cohen’s d: 0.2 is small, 0.5 medium.',
 init:()=>({v:0}),
 watch(p){return {v:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:M8_MOZ.map((m,i)=>[i,m.name]),label:'Evidence',get:s=>s.v,act:'v'}],
 on:{v(s,v){s.v=Number(v)}},
 draw(s){
  let out=heading('Does Mozart make you smarter?',26);
  const bars=[{l:'Chabris: Mozart vs silence or relaxation',d:.09,from:1},{l:'Pietschnig: Mozart vs no music',d:.37,from:2},{l:'Pietschnig: other music vs no music',d:.38,from:2},{l:'Pietschnig: Mozart vs other music',d:.15,from:2}];
  const x0=300,sc=420;out+=L(x0,60,x0,250,C.line,1.4);[0,.2,.5].forEach(v=>{const x=x0+v*sc;out+=L(x,60,x,250,C.grid,1)+TF(x,268,v===0?'0':v===.2?'0.2 small':'0.5 medium',13,C.muted)});
  bars.forEach((b,i)=>{const y=70+i*44,on=s.v>=b.from;out+=TF(x0-10,y+20,b.l,13,on?C.ink:C.line,'end');if(on)out+=R(x0,y+6,b.d*sc,22,i===3?C.coral:C.blue,'none',4)+TBF(x0+b.d*sc+8,y+22,b.d.toFixed(2),13,C.ink,'start')});
  const txt=[['Rauscher, Shaw and Ky (1993): 36 students scored about 8–9 points higher on a spatial reasoning task','after 10 minutes of a Mozart sonata. The gain lasted 10–15 minutes. It was never an IQ claim.'],
   ['Chabris (1999) pooled 16 studies: the average gain was tiny, about 1.4 IQ-scale points,','and fits a brief boost in arousal rather than anything special about Mozart.'],
   ['Pietschnig and colleagues (2010) pooled about 40 studies: any music gives about the same small gain','over silence. Mozart versus other music is small, and larger effects came mostly from one laboratory.'],
   ['Thompson, Schellenberg and Husain (2001): upbeat Mozart beat slow, sad Albinoni, but the difference','vanished once mood and arousal were taken into account. Enjoyment and alertness do the work.']][s.v];
  out+=R(30,288,540,70,'#f6f9fb','none',8)+TF(300,316,txt[0],13,C.ink)+TF(300,340,txt[1],13,C.ink);
  return {svg:out,phase:'A small, short-lived effect on one task became a popular myth that music makes babies smarter. The careful conclusion: music can briefly lift mood and alertness, which helps a little on some tasks.'};
 }});

/* =========================== beat-entrainment =========================== */
const M8_NCLK=16;
function M8_asyn(s){const out=[];if(!s.clicks.length)return out;s.clicks.forEach((c,i)=>{if(i<3)return;let best=null;s.taps.forEach(t=>{if(Math.abs(t-c)<=s.ioi/2&&(best===null||Math.abs(t-c)<Math.abs(best-c)))best=t});if(best!==null)out.push({i,a:best-c})});return out}
SCENE({id:'beat-entrainment',name:'Keeping the beat',tag:'Tap along',
 definition:'When people tap along to a steady beat they usually tap slightly before the click, by tens of milliseconds, without noticing: the negative mean asynchrony.',
 example:'Non-musicians tapping to a metronome typically lead the clicks by roughly 20–80 ms; trained musicians lead by less and vary less.',
 desc:'A tapping experiment: sixteen metronome clicks and a large tap pad; each tap’s timing relative to the nearest click is plotted, with the typical range shaded.',
 research:'Repp (2005). Sensorimotor synchronization: a review of the tapping literature. Psychonomic Bulletin & Review 12; Repp & Su (2013) update, 20.',
 dur:10,hint:'Press Start, then tap along. For accurate timing focus the TAP pad and press the Space bar: mouse clicks register on release, which adds a delay.',
 init:()=>({ioi:600,phase:'idle',clicks:[],taps:[],t0:0,token:0,head:-1}),
 watch(p){const r=M8_rng(33),ioi=600,clicks=range(M8_NCLK).map(i=>i*ioi),n=Math.floor(p*(M8_NCLK+1)),taps=[];for(let i=0;i<Math.min(n,M8_NCLK);i++)taps.push(clicks[i]-45+25*M8_gauss(r));return {ioi,phase:n>=M8_NCLK?'done':'run',clicks,taps,t0:0,head:Math.min(n,M8_NCLK)-1,sim:true}},
 ui:[{range:'ioi',label:'Beat interval',min:300,max:1200,step:50,get:s=>s.ioi,act:'ioi',show:v=>v+' ms'},{b:'Start',act:'start'},{b:'Tap',act:'tap'}],
 on:{ioi(s,v){s.ioi=v},
  start(s,a,ctx){const c=AUDIO.get(),lat=c?((c.outputLatency||0)+(c.baseLatency||0))*1000:0,lead=800;s.t0=performance.now()+lead;s.clicks=range(M8_NCLK).map(i=>s.t0+i*s.ioi+lat);s.taps=[];s.phase='run';s.head=-1;s.token++;
   range(M8_NCLK).forEach(i=>M8_click((lead+i*s.ioi)/1000,{hz:i%4===0?1320:880}));ctx.every(25,'tick',s.token)},
  tick(s,tok){if(Number(tok)!==s.token)return 'stop';const now=performance.now();s.head=Math.min(M8_NCLK-1,Math.floor((now-s.t0)/s.ioi));if(now>s.t0+M8_NCLK*s.ioi+300){s.phase='done';return 'stop'}},
  tap(s){if(s.phase==='run')s.taps.push(performance.now())}},
 draw(s,f,X){
  let out=heading('Tap along with the clicks',26);
  for(let i=0;i<M8_NCLK;i++){const x=60+i*32,on=i===s.head;out+=Ci(x,62,i%4===0?10:7,on?C.amber:'#fff',on?C.amber:C.line)}
  out+=hit(X,'tap','pad','Tap pad: press Space or Enter on each click',R(30,110,200,190,s.phase==='run'?C.pale:'#f6f9fb',C.blue,14)+TB(130,214,'TAP',30,C.blue));
  out+=TF(130,320,s.phase==='idle'?'Press Start':s.phase==='run'?'Tap on every click':'Finished',14,C.ink);
  const pl=M8_plot(290,100,280,200,[0,M8_NCLK+1],[-200,200],{yt:[[-200,'−200'],[-100,'−100'],[0,'0'],[100,'+100'],[200,'+200 ms']],xt:[[4,'4'],[8,'8'],[12,'12'],[16,'16']],xl:'click number',yl:'tap minus click (ms)'});out+=pl.svg;
  out+=R(290,pl.Y(-20),280,pl.Y(-80)-pl.Y(-20),C.greenp,'none',0)+TF(566,pl.Y(-50)+4,'typical',13,C.green,'end');
  out+=L(290,pl.Y(0),570,pl.Y(0),C.muted,1.2);
  const as=s.sim?s.taps.map((t,i)=>({i,a:t-s.clicks[i]})).filter(e=>e.i>=3):M8_asyn(s);
  as.forEach(e=>out+=Ci(pl.X(e.i+1),pl.Y(clamp(e.a,-200,200)),5,C.blue,'#fff'));
  const vals=as.map(e=>e.a),m=M8_mean(vals),sd=M8_sd(vals);
  out+=T(430,362,vals.length>=3?`mean ${m<0?'−':'+'}${Math.abs(Math.round(m))} ms · spread (SD) ${Math.round(sd)} ms · ${vals.length} taps`:'The first three clicks are for settling in.',14,C.ink);
  return {svg:out,phase:s.sim?'A simulated tapper leads the clicks by about 45 ms, inside the range typical for non-musicians.':vals.length>=3?(m<0?'You tapped ahead of the clicks on average, as most people do. One explanation: the brain synchronises the felt touch with the heard click, and touch signals take longer to arrive.':'You tapped after the clicks on average. Device delays (mouse release, audio output) can shift this; try the Space bar with the pad focused.'):'Each dot will show how far each tap was from its click. Below zero means early.'};
 }});

function M8_phaseSim(s){const N=30,r=M8_rng(17),A=[-30],P=[600];for(let n=0;n<N-1;n++){const Cn=n<10?600:600+s.step,e=s.noise?8*M8_gauss(r):0;A.push((1-s.alpha)*A[n]+P[n]-Cn+e);P.push(P[n]-s.beta*A[n])}return A}
SCENE({id:'beat-entrainment-tempo',name:'Following a tempo change',tag:'Error correction',
 definition:'People stay with a beat by correcting each tap a little, in proportion to the last error. When the tempo changes, these partial corrections bring the taps back in step over several beats.',
 example:'If the metronome suddenly slows, your next taps come too early; you shift each one later by part of the error and adjust your inner tempo, and within a few taps you are back in step.',
 desc:'A simulated tapper’s asynchronies over thirty beats, with a tempo change at beat ten, governed by phase-correction and period-correction sliders.',
 research:'Repp (2005); Vorberg & Wing (1996). Modeling variability and dependence in timing. In Handbook of Perception and Action. This is the linear phase-and-period correction model, simulated.',
 dur:10,hint:'Change the correction strengths and the tempo step. Then press Hear to listen to the metronome change at beat ten.',
 init:()=>({alpha:.4,beta:.1,step:-60,noise:1}),
 watch(p){return {alpha:.4,beta:.1,step:-60,noise:1,upto:Math.max(2,Math.floor(p*30))}},
 ui:[{range:'alpha',label:'Phase correction α',min:0,max:1,step:.05,get:s=>s.alpha,act:'alpha'},{range:'beta',label:'Period correction β',min:0,max:.5,step:.05,get:s=>s.beta,act:'beta'},{range:'step',label:'Tempo change',min:-100,max:100,step:10,get:s=>s.step,act:'step',show:v=>(v>0?'+':'')+v+' ms'},{choose:[[1,'with timing noise'],[0,'no noise']],label:'Noise',get:s=>s.noise,act:'noise'},{b:'Hear',act:'hear'}],
 on:{alpha(s,v){s.alpha=v},beta(s,v){s.beta=v},step(s,v){s.step=v},noise(s,v){s.noise=Number(v)},hear(s){let t=0;for(let i=0;i<20;i++){M8_click(t,{hz:i===10?1320:880});t+=(i<10?600:600+s.step)/1000}}},
 draw(s){
  const A=M8_phaseSim(s),n=s.upto||30;let out=heading(`Metronome ${s.step>0?'slows':s.step<0?'speeds up':'stays'} at beat 10${s.step?` (${s.step>0?'+':''}${s.step} ms)`:''}`,26);
  const pl=M8_plot(70,52,490,236,[0,31],[-160,160],{yt:[[-150,'−150'],[0,'0'],[150,'+150 ms']],xt:[[1,'1'],[10,'10'],[20,'20'],[30,'30']],xl:'tap number',yl:'tap minus click'});out+=pl.svg;
  out+=L(pl.X(10.5),52,pl.X(10.5),288,C.amber,1.4,'stroke-dasharray="5 4"')+TF(pl.X(10.5)+5,70,'tempo change',13,C.amber,'start')+L(70,pl.Y(0),560,pl.Y(0),C.muted,1.2);
  const pts=A.slice(0,n).map((a,i)=>[pl.X(i+1),pl.Y(clamp(a,-160,160))]);out+=M8_poly(pts,C.blue,2);pts.forEach(p=>out+=Ci(p[0],p[1],3.5,C.blue));
  const after=A.slice(10);let k=after.findIndex((a,i)=>i>0&&after.slice(i).every(x=>Math.abs(x-A[9])<25));
  out+=T(300,352,s.alpha===0&&s.beta===0?'No correction: the taps drift away from the clicks for good.':k>0?`Back in step about ${k} taps after the change`:'Not settled within 20 taps',15,C.ink);
  return {svg:out,phase:'α is the share of the last error corrected at once; β adjusts the inner tempo. With α near 1 the taps snap back but overreact to noise; with α near 0 they drift. Measured values are well below 1, so corrections are partial.'};
 }});

SCENE({id:'beat-entrainment-range',name:'How fast can we follow?',tag:'Limits of timing',
 definition:'People can synchronise taps with beats from about one every 100–200 ms up to about one every 1.8 seconds; outside this range taps become impossible or turn into reactions.',
 example:'At 600 ms between beats (100 bpm) tapping feels natural; at 2.5 s between beats people stop anticipating and start reacting to each click.',
 desc:'A logarithmic scale of beat intervals from 80 ms to 2.4 s, divided into too fast, synchronisation possible and too slow, with the comfortable range marked.',
 research:'Repp (2005); Fraisse (1982). Rhythm and tempo, in The Psychology of Music; London (2012). Hearing in Time, Oxford University Press. Limits vary between people and tasks.',
 dur:9,hint:'Slide the beat interval and press Play to hear eight clicks at that rate.',
 init:()=>({ioi:600}),
 watch(p){return {ioi:Math.round(80*Math.pow(30,p))}},
 ui:[{range:'ioi',label:'Beat interval',min:80,max:2400,step:10,get:s=>s.ioi,act:'ioi',show:v=>`${v} ms (${Math.round(60000/v)} bpm)`},{b:'Play 8 beats',act:'play'}],
 on:{ioi(s,v){s.ioi=v},play(s){for(let i=0;i<8;i++)M8_click(i*s.ioi/1000,{hz:i%4===0?1320:880})}},
 draw(s){
  let out=heading(`${s.ioi} ms between beats = ${Math.round(60000/s.ioi)} beats per minute`,26);
  const lx=v=>50+(Math.log(v)-Math.log(80))/(Math.log(2400)-Math.log(80))*500,y=130;
  out+=R(lx(80),y,lx(150)-lx(80),56,C.coralp,'none',6)+R(lx(150),y,lx(1800)-lx(150),56,C.greenp,'none',6)+R(lx(1800),y,lx(2400)-lx(1800),56,C.purplep,'none',6);
  out+=R(lx(500),y-22,lx(750)-lx(500),16,C.amberp,C.amber,4)+TF((lx(500)+lx(750))/2,y-30,'comfortable for most adults',13,C.amber);
  out+=TF((lx(80)+lx(150))/2,y+34,'too fast',13,C.coral)+TF((lx(150)+lx(1800))/2,y+34,'synchronisation works',14,C.green)+TF((lx(1800)+lx(2400))/2,y+34,'too slow',13,C.purple);
  [100,200,500,1000,2000].forEach(v=>out+=L(lx(v),y+56,lx(v),y+62,C.line,1)+TF(lx(v),y+78,`${v} ms`,13,C.muted));
  [[100,'600 bpm'],[300,'200'],[600,'100'],[1500,'40']].forEach(([v,l])=>out+=TF(lx(v),y+98,l,13,C.muted));out+=TF(560,y+98,'bpm',13,C.muted,'end');
  const x=lx(clamp(s.ioi,80,2400));out+=`<polygon points="${fmt(x)},${y-2} ${fmt(x-8)},${y-16} ${fmt(x+8)},${y-16}" fill="${C.ink}"/>`+L(x,y,x,y+56,C.ink,2);
  const zone=s.ioi<150?'Too fast to tap on every beat: people tap every second or fourth beat instead.':s.ioi>1800?'So slow that people stop predicting and start reacting, so taps come after the clicks.':s.ioi>=500&&s.ioi<=750?'Near the rate many adults choose when asked to tap at a comfortable speed.':'People can synchronise here, anticipating each beat.';
  out+=T(300,290,zone,14,C.ink);
  out+=TF(300,330,'Zone edges are approximate: Repp (2005) gives about 100 ms and 1.8 s; they shift with age and training.',13,C.muted);
  return {svg:out,phase:'Musical tempos mostly sit inside the band where we can predict beats. Very fast notes are grouped into slower beats, and very slow pulses are subdivided.'};
 }});

/* =========================== auditory-illusions =========================== */
SCENE({id:'auditory-illusions',name:'The endless staircase',tag:'Shepard tones',
 definition:'A Shepard tone is a chord of notes an octave apart under a fixed bell-shaped loudness curve. Stepping it up by semitones seems to rise for ever, yet after twelve steps it is exactly where it began.',
 example:'Press Step up twelve times: each step sounds higher, but the twelfth tone is identical to the first. The same trick drives endlessly rising sounds in film scores.',
 desc:'The partials of a Shepard tone on a log frequency axis under a fixed bell curve, a pitch-class clock, and a staircase that loops back on itself.',
 research:'Shepard (1964). Circularity in judgments of relative pitch. JASA 36. Risset (1969) made a continuously gliding version.',
 dur:12,hint:'Press Step up or Step down to hear one step, or Play twelve steps. Watch the partials slide under the fixed curve and wrap around.',
 init:()=>({step:0}),
 watch(p){return {step:Math.floor(p*24)}},
 ui:[{b:'Step up',act:'up'},{b:'Step down',act:'down'},{b:'Play 12 steps up',act:'run'}],
 on:{up(s){s.step++;M8_shepard(s.step,{dur:.6})},down(s){s.step--;M8_shepard(s.step,{dur:.6})},run(s){for(let k=1;k<=12;k++)M8_shepard(s.step+k,{at:(k-1)*.42,dur:.4});s.step+=12}},
 draw(s){
  const pc=((s.step%12)+12)%12;let out=heading(`Shepard tone, step ${s.step} (pitch class ${M8_PCN[pc]})`,26);
  const lx=f=>50+(Math.log2(f)-Math.log2(20))/(Math.log2(10000)-Math.log2(20))*500;out+=R(40,40,520,170,'#fff',C.grid,4);
  const env=[];for(let i=0;i<=200;i++){const f=20*Math.pow(500,i/200);env.push([lx(f),196-M8_shepW(f)*140])}out+=M8_poly(env,C.coral,2,'stroke-dasharray="6 4"');
  const base=16.3516*Math.pow(2,pc/12);for(let k=0;k<10;k++){const f=base*Math.pow(2,k);if(f<20||f>10000)continue;const h=M8_shepW(f)*140;out+=L(lx(f),196,lx(f),196-h,C.blue,4)}
  [50,100,200,500,1000,2000,5000].forEach(f=>out+=TF(lx(f),226,f>=1000?(f/1000)+'k':String(f),13,C.muted));out+=TF(560,226,'Hz',13,C.muted,'end');
  const cx=120,cy=300,r=52;out+=Ci(cx,cy,r,'#fff',C.line);for(let k=0;k<12;k++){const a=-Math.PI/2+k*Math.PI/6;out+=TF(cx+Math.cos(a)*(r+12),cy+Math.sin(a)*(r+12)+4,M8_PCN[k],13,k===pc?C.blue:C.muted)}
  const a=-Math.PI/2+pc*Math.PI/6;out+=arrow(cx,cy,cx+Math.cos(a)*(r-8),cy+Math.sin(a)*(r-8),C.blue,2.5);
  for(let k=0;k<12;k++){const x=250+k*24,y=350-k*8;out+=R(x,y,22,350-y+16,k===pc?C.blue:C.pale,'none',2)}
  out+=curveArrow(530,262,262,350,-40,C.amber,2)+TF(420,252,'…and round again',13,C.amber);
  return {svg:out,phase:'Each step moves every partial up a semitone. The top partials fade out under the curve while new ones fade in at the bottom, so there is no top or bottom to the sound: only its pitch class (chroma) changes.'};
 },
 three(s,f,X,project){
  const P=project([[-1.2,-1.2,0],[1.2,1.2,3.2]]),pc=((s.step%12)+12)%12,pts=[];for(let m=0;m<=36;m++){const a=m*Math.PI/6;pts.push([Math.cos(a),Math.sin(a),m/12])}
  let out='';for(let m=0;m<36;m++)out+=line3(pts[m],pts[m+1],P,C.line,2);
  for(let k=0;k<12;k++){const a=k*Math.PI/6;out+=line3([Math.cos(a)*1.15,Math.sin(a)*1.15,0],[Math.cos(a),Math.sin(a),0],P,C.grid,1)}
  const circ=[];for(let m=0;m<=48;m++){const a=m*Math.PI/24;circ.push([Math.cos(a),Math.sin(a),0])}for(let m=0;m<48;m++)out+=line3(circ[m],circ[m+1],P,C.coral,2);
  const h=((s.step%36)+36)%36;out+=point3(pts[h],P,C.blue,9)+point3([Math.cos(pc*Math.PI/6),Math.sin(pc*Math.PI/6),0],P,C.coral,9);
  const q=P(pts[h]);out+=label3(q[0]+16,q[1]-12,'ordinary note',13,C.blue,'text-anchor="start"');const q2=P([Math.cos(pc*Math.PI/6),Math.sin(pc*Math.PI/6),0]);out+=label3(q2[0]+16,q2[1]+18,'Shepard tone',13,C.coral,'text-anchor="start"');
  return {svg:out,title:'The pitch helix',caption:'Pitch has two parts: height (up the helix) and chroma (around it). An ordinary note climbs the helix; a Shepard tone has chroma but no height, so it lives on the flat circle and can circle for ever.'};
 }});

const M8_tritoneOrder=s=>shuffled(range(12),M8_mix(s.seed+300));
SCENE({id:'auditory-illusions-tritone',name:'The tritone paradox',tag:'Up or down?',
 definition:'Two Shepard tones a tritone apart (half an octave) have no physical “up” or “down”, yet listeners hear them clearly rising or falling, and different listeners hear the same pair differently.',
 example:'For one listener C then F♯ falls, while for another the same pair rises. Each listener is consistent, and their pattern depends on which pitch classes they hear as “high”.',
 desc:'A pitch-class circle coloured by how often each starting note was heard to fall, built from your up-or-down answers to twelve tritone pairs.',
 research:'Deutsch (1986). A musical paradox. Music Perception 3; Deutsch (1991) linked listeners’ patterns to the pitch range of the speech they grew up with. Patterns vary between people.',
 dur:11,hint:'Play each pair, then answer: did it go up or down? Twelve pairs in a random order; you can do more rounds.',
 init:()=>({seed:1,i:0,ans:{}}),
 watch(p){const n=Math.min(12,Math.floor(p*13)),o=M8_tritoneOrder({seed:1}),ans={};for(let i=0;i<n;i++){const pc=o[i];ans[pc]=[pc>=4&&pc<=9?1:0,1]}return {seed:1,i:n,ans,sim:true}},
 ui:[{b:'Play pair',act:'play'},{b:'It went up',act:'answer',arg:0},{b:'It went down',act:'answer',arg:1},{b:'Another round',act:'again'}],
 on:{play(s){if(s.i>=12)return;const pc=M8_tritoneOrder(s)[s.i];M8_shepard(pc,{dur:.55});M8_shepard(pc+6,{at:.65,dur:.55})},
  answer(s,v){if(s.i>=12)return;const pc=M8_tritoneOrder(s)[s.i],a=s.ans[pc]||[0,0];s.ans[pc]=[a[0]+Number(v),a[1]+1];s.i++},again(s){s.seed=nextSeed();s.i=0}},
 draw(s){
  let out=heading('Does each tritone pair go up or down for you?',26);
  const cx=180,cy=208,r0=50,r1=128;
  for(let pc=0;pc<12;pc++){const a0=-Math.PI/2+(pc-.5)*Math.PI/6,a1=a0+Math.PI/6,a=s.ans[pc],fr=a?a[0]/a[1]:null;
   const col=fr===null?'#f1f5f7':fr>.5?C.coral:fr<.5?C.blue:C.amber;
   const pth=`M${fmt(cx+r0*Math.cos(a0))} ${fmt(cy+r0*Math.sin(a0))}L${fmt(cx+r1*Math.cos(a0))} ${fmt(cy+r1*Math.sin(a0))}A${r1} ${r1} 0 0 1 ${fmt(cx+r1*Math.cos(a1))} ${fmt(cy+r1*Math.sin(a1))}L${fmt(cx+r0*Math.cos(a1))} ${fmt(cy+r0*Math.sin(a1))}A${r0} ${r0} 0 0 0 ${fmt(cx+r0*Math.cos(a0))} ${fmt(cy+r0*Math.sin(a0))}Z`;
   out+=`<path d="${pth}" fill="${col}" stroke="#fff" stroke-width="2"/>`;const am=(a0+a1)/2;out+=TF(cx+(r0+r1)/2*Math.cos(am),cy+(r0+r1)/2*Math.sin(am)+5,M8_PCN[pc],14,fr===null?C.muted:'#fff')}
  out+=TF(cx,cy+4,'first note',13,C.muted);
  const lg=[[C.coral,'heard falling'],[C.blue,'heard rising'],[C.amber,'mixed'],['#f1f5f7','not tried yet']];lg.forEach(([c,l],i)=>{out+=R(350,92+i*30,18,18,c,c==='#f1f5f7'?C.line:'none',4)+TF(376,106+i*30,l,14,C.ink,'start')});
  const tried=Object.keys(s.ans).length;out+=TF(350,240,s.i<12?`Pair ${s.i+1} of 12`:'Round complete',15,C.ink,'start')+TF(350,264,`${tried} of 12 starting notes tried`,13,C.muted,'start');
  if(s.sim)out+=TF(350,288,'Watch shows one simulated listener',13,C.muted,'start');
  out+=TF(300,360,'Most listeners hear a coherent half of the circle as falling; where that half sits differs from person to person.',13,C.muted);
  return {svg:out,phase:'Physically each pair is ambiguous: every partial moves up or down by the same half-octave. Your brain resolves it using a sense of which pitch classes are “high”, which Deutsch found differs systematically between listeners.'};
 }});

// Risset's accelerating rhythm, simplified: pulse layers double in rate over one cycle while fading
// in and out under a fixed bell, so the beat seems to speed up for ever.
function M8_risset(T){const out=[];for(let k=0;k<4;k++){const base=Math.pow(2,k);for(let n=1;n<500;n++){const t=T*Math.log2(1+n*Math.LN2/(base*T));if(t>=T)break;const rate=base*Math.pow(2,t/T),w=Math.exp(-.5*Math.pow((Math.log2(rate)-2)/.8,2));out.push({t,k,w})}}return out}
SCENE({id:'auditory-illusions-risset',name:'The endless accelerando',tag:'Risset rhythm',
 definition:'Layers of a pulse at different speeds, each speeding up while the fastest fades out and a slow one fades in, make a beat that seems to accelerate for ever.',
 example:'Like a Shepard tone in time: the rhythm keeps getting faster, yet after each cycle it sounds just as it did before.',
 desc:'Four rows of clicks, each doubling in rate over one cycle, with dot size showing loudness under a fixed bell curve of rates.',
 research:'Risset (1970s) and Shepard (1964). This page uses a simplified version in which layers restart each cycle; Risset’s construction aligns the layers so the loop is seamless.',
 dur:10,hint:'Choose the cycle length and press Play to hear two cycles. Notice that it never seems to arrive anywhere faster.',
 init:()=>({T:8}),
 watch(p){return {T:8,head:p}},
 ui:[{range:'T',label:'Cycle length',min:4,max:16,step:1,get:s=>s.T,act:'T',show:v=>v+' s'},{b:'Play two cycles',act:'play'}],
 on:{T(s,v){s.T=v},play(s){const ev=M8_risset(s.T);for(const c of [0,1])ev.forEach(e=>{if(e.w>.08)M8_click(c*s.T+e.t,{hz:700+e.k*0,gain:.24*e.w})})}},
 draw(s){
  const ev=M8_risset(s.T);let out=heading(`Four pulse layers over one ${s.T}-second cycle`,26);
  out+=R(80,48,480,240,'#fff',C.grid,4);
  for(let k=0;k<4;k++){const y=258-k*60;out+=TF(72,y+5,`${Math.pow(2,k)}→${Math.pow(2,k+1)}/s`,13,C.muted,'end')+L(80,y,560,y,C.grid,1)}
  ev.forEach(e=>{const x=80+e.t/s.T*480,y=258-e.k*60;out+=Ci(x,y,2+e.w*6,C.blue,'none',`opacity="${fmt(.15+.85*e.w)}"`)});
  if(s.head!==undefined){const x=80+s.head*480;out+=L(x,48,x,288,C.amber,2)}
  out+=TF(320,310,'time through one cycle →',13,C.muted);
  out+=T(300,346,'Big dots are loud. The loud layer is always near 4 pulses a second,',14,C.ink)+T(300,368,'while every layer speeds up: so the beat always seems to be accelerating.',14,C.ink);
  return {svg:out,phase:'At the end of a cycle each layer has reached the next layer’s starting speed, so the whole pattern can start again. Simplified here: the loop has a small seam.'};
 }});
