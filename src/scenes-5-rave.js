/* ===================== Techno era 5 · UK and rave (1987–1997) ===================== */
// Acid house summers, free parties, the Criminal Justice Act and what came after. Sound is made only in on()
// handlers: Play starts ctx.every ticks that move a playhead in the state and sound each 16th-note step. Watch
// derives the playhead from lesson time, so pictures stay deterministic and silent. All patterns are original
// and the drum and bass voices are simplified models, not circuit emulations. Crowd figures are estimates.
const X5_wrap=(str,n)=>{const out=[];let line='';for(const w of String(str).split(' ')){if(line&&(line+' '+w).length>n){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out};
const X5_para=(x,y,str,n=58,size=13,fill=C.ink,lh=19,anchor='start')=>X5_wrap(str,n).map((l,i)=>T(x,y+i*lh,l,size,fill,anchor)).join('');
const X5_num=n=>Math.round(n).toLocaleString('en-GB');
const X5_S={
 kick:(at=0)=>AUDIO.kick({at,from:170,to:50,decay:.28,gain:.26}),
 clap:(at=0)=>AUDIO.hit({at,type:'bandpass',cutoff:1500,q:1.2,dur:.12,gain:.13}),
 snare:(at=0)=>AUDIO.hit({at,type:'bandpass',cutoff:2200,q:.9,dur:.13,gain:.13}),
 hat:(at=0)=>AUDIO.hit({at,type:'highpass',cutoff:8000,dur:.04,gain:.06}),
 ohat:(at=0)=>AUDIO.hit({at,type:'highpass',cutoff:7000,dur:.2,gain:.06}),
 sub:(at=0,m=33)=>AUDIO.tone(midiHz(m),{at,dur:.3,type:'sine',gain:.2,attack:.005,release:.12}),
 acid:(m,at=0,o={})=>AUDIO.acid(midiHz(m),{at,dur:.11,gain:.1,cutoff:500,env:1500,res:12,decay:.12,...o})
};
// Shared play/stop and tick handlers. spec.ms(s): step length in ms; spec.N: steps; spec.step(s,i): sounds for step i.
function X5_seq(spec,extra={}){
 return {...extra,
  play(s,a,ctx){s.token=(s.token||0)+1;if(s.playing){s.playing=false;s.pos=-1;AUDIO.stopAll();return 'keep'}s.playing=true;s.pos=-1;ctx.every(spec.ms(s),'tick',s.token);return 'keep'},
  tick(s,tok){if(!s.playing||Number(tok)!==s.token)return 'stop';s.pos=(s.pos+1)%spec.N;spec.step(s,s.pos);return 'keep'}};
}
function X5_restart(s,ctx,spec){if(s.playing){s.token=(s.token||0)+1;s.pos=-1;ctx.every(spec.ms(s),'tick',s.token)}}
const X5_pos=(s,X,N,bpm)=>X.try?(s.playing?s.pos:-1):Math.floor(X.p*10*bpm/15)%N;
// A 16-step grid: rows=[{name,col,on:i=>bool,act?}]. Beats are tinted; the playhead column is outlined.
function X5_grid(X,y0,rows,pos,o={}){
 const x0=o.x0||100,cw=o.cw||30,rh=o.rh||28,n=o.n||16;let out='';
 rows.forEach((r,k)=>{const y=y0+k*rh;out+=T(x0-10,y+rh/2+3,r.name,13,r.mute?C.muted:C.ink,'end');
  for(let i=0;i<n;i++){const on=r.on(i),beat=i%4===0,inner=R(x0+i*cw+1.5,y+2,cw-3,rh-5,on?(r.mute?'#c9d6de':r.col||C.blue):(beat?'#e6eef3':'#fff'),on?'none':C.grid,4);
   out+=r.act?hit(X,r.act,k+':'+i,`${r.name}, step ${i+1}: ${on?'on':'off'}. Press to toggle.`,inner):inner}});
 if(pos>=0)out+=R(x0+pos*cw,y0-2,cw,rows.length*rh+1,'none',C.amber,5);
 for(let b=0;b<n/4;b++)out+=TF(x0+b*4*cw+cw/2,y0-8,String(b+1),12,C.muted);
 return out;
}
// A row of short chips over one wide panel: press a chip (or Next) to read that item.
function X5_cards(o){
 const n=o.items.length;
 SCENE({id:o.id,name:o.name,tag:o.tag,definition:o.definition,example:o.example,desc:o.desc,research:o.research,dur:o.dur||12,hint:o.hint,
  init:()=>({i:0}),
  watch(p){return {i:Math.min(n-1,Math.floor(p*n))}},
  ui:[{b:'Previous',act:'prev'},{b:'Next',act:'next'}],
  on:{pick(s,v){s.i=clamp(+v,0,n-1);return 'keep'},next(s){s.i=(s.i+1)%n;return 'keep'},prev(s){s.i=(s.i+n-1)%n;return 'keep'}},
  draw(s,f,X){
   const it=o.items[s.i],cw=568/n;let out=heading(o.heading);
   o.items.forEach((q,i)=>{const on=i===s.i;out+=hit(X,'pick',i,q.t,R(16+i*cw+2,50,cw-4,34,on?C.pale:'#fff',on?C.blue:C.grid,8)+TB(16+i*cw+cw/2,72,q.k,13,on?C.blue:C.muted))});
   out+=R(16,96,568,236,'#f6f9fb','none',10)+TB(32,124,it.t,15,C.ink,'start')+X5_para(32,152,it.body,56);
   if(it.note)out+=X5_para(32,306,it.note,60,12,C.amber,17);
   out+=T(300,360,o.foot||'',14,C.muted);
   return {svg:out,phase:it.phase};
  }});
}

/* =========================== acid-house-summer =========================== */
X5_cards({id:'acid-house-summer',name:'The acid house summers',tag:'1987–1989: from a few clubs to fields',
 definition:'Acid house reached Britain from Chicago by way of Ibiza. Between 1987 and 1989 it grew from a handful of small London and Manchester club nights into huge outdoor parties, and was nicknamed the “Second Summer of Love”.',
 example:'Shoom opened in a south London fitness centre in late 1987 and held a few hundred people. By June 1989 a single party in a Berkshire aircraft hangar drew about 11,000.',
 desc:'Six dated chips from 1987 to 1990 above a panel that describes the chosen moment.',
 research:['Collin, M. (1997). Altered State: The Story of Ecstasy Culture and Acid House. Serpent’s Tail.','Reynolds, S. (1998). Energy Flash: A Journey Through Rave Music and Dance Culture. Picador.','Garratt, S. (1998). Adventures in Wonderland: A Decade of Club Culture. Headline.'],
 hint:'Press a year, or Next, to follow the story. Crowd sizes are estimates and sources differ.',
 heading:'Britain, 1987 to 1990',foot:'Dates as given by Collin (1997) and Reynolds (1998)',
 items:[
  {k:'1987',t:'Summer 1987: Ibiza',body:'Four London DJs, Paul Oakenfold, Danny Rampling, Nicky Holloway and Johnny Walker, spent a holiday on Ibiza. At the open-air club Amnesia they heard DJ Alfredo mix Chicago house with pop, rock and soul. The eclectic style became known as “Balearic”.',phase:'The usual account starts with a holiday. The music itself was American: Chicago house and Detroit techno records, heard in a new setting.'},
  {k:'Shoom',t:'Late 1987: Shoom and the first London nights',body:'Danny and Jenni Rampling started Shoom in a fitness centre in Southwark. It held a few hundred people. Paul Oakenfold’s Spectrum and Nicky Holloway’s The Trip followed in 1988. Flyers for Shoom used the yellow smiley face.',phase:'The first clubs were small. The smiley, a design from the 1960s and 1970s, became the scene’s badge.'},
  {k:'Haçienda',t:'1988: Manchester',body:'At the Haçienda, Mike Pickering had played house since 1986 at his Nude night. In July 1988 the club launched Hot, a midweek night, with Pickering and Jon DaSilva. Northern clubs took to house and techno early and on their own terms.',phase:'The story is often told as a London one. Manchester, Sheffield, Nottingham and other northern cities had their own scenes just as early.'},
  {k:'1988',t:'1988: the “Second Summer of Love”',body:'Acid house records reached the charts and the phrase “Second Summer of Love” stuck. The drug MDMA (“ecstasy”) was part of the scene; it was and is illegal in the UK and carries real risks. In autumn 1988 tabloid papers turned from selling smiley T-shirts to campaigning against “acid” parties.',phase:'Press attention worked both ways: it alarmed the authorities and advertised the parties.',note:'The name borrows from San Francisco’s 1967 Summer of Love.'},
  {k:'1989',t:'1989: the orbital raves',body:'Promoters such as Sunrise, Energy and Biology moved to warehouses, hangars and fields around London’s M25 motorway. Locations were given out at the last minute by telephone message lines. Sunrise’s party at White Waltham airfield on 24 June 1989 drew about 11,000 people.',phase:'Scale changed everything: thousands of cars on country roads at night made the parties a policing and political matter.'},
  {k:'1990',t:'1990: the first law',body:'The Entertainments (Increased Penalties) Act 1990, introduced by the MP Graham Bright, raised the penalty for holding an unlicensed public entertainment to a fine of up to £20,000, six months in prison, or both. Large pay parties moved into licensed venues; free parties took another road.',phase:'This law aimed at commercial promoters. The free-party sound systems, who charged nothing, were the target of the next one in 1994.'}]});

const X5_AH={kick:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],clap:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],hat:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],acid:[45,0,45,57,0,45,0,48,45,0,52,45,0,45,43,0]};
const X5_AHSPEC={N:16,ms:s=>15000/s.bpm,step(s,i){if(s.on.kick&&X5_AH.kick[i])X5_S.kick();if(s.on.clap&&X5_AH.clap[i])X5_S.clap();if(s.on.hat&&X5_AH.hat[i])X5_S.ohat();if(s.on.acid&&X5_AH.acid[i])X5_S.acid(X5_AH.acid[i],0,{accent:i%4===3})}};
SCENE({id:'acid-house-summer-pattern',name:'Building an acid house beat',tag:'Four layers, one bar',
 definition:'An acid house track is built from a few machine layers that repeat every bar: a kick drum on every beat, a clap on beats two and four, an open hi-hat between the beats, and a squelching bassline.',
 example:'Switch on only the kick and you have a metronome. Add the off-beat hat and it starts to bounce. The clap gives the bar its two halves, and the bassline gives it a tune.',
 desc:'A sixteen-step grid with four rows: kick, clap, open hat and acid line. Each row can be switched on or off, and a playhead crosses the bar at the chosen tempo.',
 research:['Reynolds, S. (1998). Energy Flash. Picador.','Butler, M. J. (2006). Unlocking the Groove: Rhythm, Meter, and Musical Design in Electronic Dance Music. Indiana University Press.'],
 dur:12,hint:'Press Play, then switch layers on and off. The pattern is an original one in the style, played by simplified models of the machines.',
 init:()=>({bpm:122,on:{kick:true,clap:false,hat:false,acid:false},playing:false,pos:-1}),
 watch(p){const k=Math.floor(p*4);return {bpm:122,on:{kick:true,hat:k>=1,clap:k>=2,acid:k>=3},playing:false,pos:-1}},
 ui:[{b:'Kick',act:'tog',arg:'kick'},{b:'Clap',act:'tog',arg:'clap'},{b:'Open hat',act:'tog',arg:'hat'},{b:'Acid line',act:'tog',arg:'acid'},
  {range:'bpm',label:'Tempo (BPM)',min:112,max:132,step:1,get:s=>s.bpm,act:'bpm'},{b:'Play / stop',act:'play'}],
 on:X5_seq(X5_AHSPEC,{tog(s,v){s.on[v]=!s.on[v];return 'keep'},bpm(s,v,ctx){s.bpm=+v;X5_restart(s,ctx,X5_AHSPEC);return 'keep'}}),
 draw(s,f,X){
  const pos=X5_pos(s,X,16,s.bpm),n=['kick','clap','hat','acid'].filter(k=>s.on[k]).length;
  let out=heading(n===4?'All four layers':n?`${n} of 4 layers playing`:'Silence: switch a layer on');
  out+=X5_grid(X,84,[
   {name:'Kick',col:C.blue,on:i=>!!X5_AH.kick[i],mute:!s.on.kick},{name:'Clap',col:C.coral,on:i=>!!X5_AH.clap[i],mute:!s.on.clap},
   {name:'Open hat',col:C.green,on:i=>!!X5_AH.hat[i],mute:!s.on.hat},{name:'Acid line',col:C.purple,on:i=>!!X5_AH.acid[i],mute:!s.on.acid}],pos);
  out+=counter(100,222,'tempo',s.bpm+' BPM',C.blue,130)+counter(246,222,'one step',Math.round(15000/s.bpm)+' ms',C.purple,130)+counter(392,222,'one bar',fmt(Math.round(240000/s.bpm)/1000)+' s',C.green,130);
  out+=T(300,304,'Numbers above the grid count the four beats of the bar.',14,C.muted);
  out+=T(300,346,s.on.kick&&s.on.hat?'Kick on the beat, hat between: the basic house pulse.':'Grey rows are switched off.',15,C.ink);
  return {svg:out,phase:'Each layer is simple and repeats exactly. The interest comes from how they interlock: the kick marks the beat, the open hat answers it half a beat later, and the clap marks beats two and four.'};
 }});

const X5_EVENTS=[['Shoom, 1987',300,'a few hundred'],['Haçienda, 1988',1500,'about 1,500'],['Sunrise, June 1989',11000,'about 11,000'],['Longwick, Aug 1989',17000,'about 17,000'],['Castlemorton, 1992',30000,'20,000–40,000']];
SCENE({id:'acid-house-summer-spread',name:'How big the parties grew',tag:'Hundreds to tens of thousands',
 definition:'In under five years the largest dance events in Britain grew roughly a hundredfold, from a club holding a few hundred people to a week-long free festival attended by tens of thousands.',
 example:'On a linear scale Shoom is invisible beside Castlemorton. On a logarithmic scale, where each step is ten times bigger, you can see every stage of the growth.',
 desc:'Five bars for five events from 1987 to 1992, with a switch between a linear and a logarithmic scale and a readout for the chosen event.',
 research:['Collin, M. (1997). Altered State. Serpent’s Tail (crowd estimates).','Reynolds, S. (1998). Energy Flash. Picador.','All figures are estimates; reports at the time differed widely.'],
 dur:10,hint:'Press a bar to read its estimate, and switch between the two scales.',
 init:()=>({i:0,log:'1'}),
 watch(p){return {i:Math.min(4,Math.floor(p*5)),log:p<.5?'0':'1'}},
 ui:[{choose:[['0','Linear scale'],['1','Log scale']],label:'Scale',get:s=>s.log,act:'log'}],
 on:{log(s,v){s.log=v;return 'keep'},pick(s,v){s.i=clamp(+v,0,4);return 'keep'}},
 draw(s,f,X){
  const lg=s.log==='1',x0=190,w=380,X1=v=>lg?x0+(Math.log10(v)-2)/(Math.log10(50000)-2)*w:x0+v/40000*w;
  let out=heading('Estimated attendance at five events');
  X5_EVENTS.forEach(([name,v],i)=>{const y=70+i*44,on=i===s.i;
   out+=hit(X,'pick',i,name,R(x0,y,Math.max(3,X1(v)-x0),28,on?C.blue:'#b9d4e6','none',5)+T(x0-10,y+19,name,13,on?C.ink:C.muted,'end'))});
  (lg?[100,1000,10000]:[0,20000,40000]).forEach(v=>{out+=L(X1(v),62,X1(v),286,C.grid,1)+TF(X1(v),302,X5_num(v),12,C.muted)});
  out+=T(300,330,`${X5_EVENTS[s.i][0]}: ${X5_EVENTS[s.i][2]} people (estimate)`,15,C.ink);
  out+=T(300,360,lg?'Log scale: each gridline is ten times the last':'Linear scale: equal steps of 20,000',14,C.muted);
  return {svg:out,phase:lg?'On the log scale the growth looks steady: roughly a tenfold rise from club to orbital rave, and several times more to Castlemorton.':'On the linear scale the early clubs almost vanish. That is how the scene looked to the authorities too: small, then suddenly very large.'};
 }});

/* =========================== free-parties =========================== */
const X5_spl=(n,d)=>100+20*Math.log10(n)-20*Math.log10(d);
SCENE({id:'free-parties',name:'The sound system',tag:'Stack the boxes, feel the bass',
 definition:'A free party is built around a sound system: a mobile rig of amplifiers and loudspeaker stacks, brought to a field or warehouse and run by a collective that charges no entry. Groups such as Spiral Tribe and DiY toured Britain with theirs.',
 example:'Doubling the number of bass speakers, placed close together, adds up to 6 decibels. Doubling your distance from the stack takes about 6 decibels away again.',
 desc:'A stack of bass speakers whose size can be doubled, a listener who can be moved away, and a curve of sound level against distance with a line at 85 decibels.',
 research:['Henriques, J. (2011). Sonic Bodies: Reggae Sound Systems, Performance Techniques, and Ways of Knowing. Continuum (the Jamaican sound-system tradition these rigs descend from).','Collin, M. (1997). Altered State. Serpent’s Tail.','UK Control of Noise at Work Regulations 2005: 85 dB(A) daily exposure is the upper action value.'],
 dur:11,hint:'Change the stack and the distance. Real rigs are loud enough to damage hearing: at any event, stand back and wear earplugs.',
 init:()=>({k:2,d:8}),
 watch(p){return {k:Math.min(4,Math.floor(p*5)),d:p<.5?4:32}},
 ui:[{range:'k',label:'Bass speakers',min:0,max:4,step:1,get:s=>s.k,act:'k',show:v=>String(2**v)},{range:'d',label:'Distance from the stack',min:1,max:64,step:1,get:s=>s.d,act:'d',show:v=>v+' m'},{b:'Hear one kick',act:'kick'}],
 on:{k(s,v){s.k=clamp(+v,0,4);return 'keep'},d(s,v){s.d=clamp(+v,1,64);return 'keep'},kick(){X5_S.kick();return 'keep'}},
 draw(s){
  const n=2**s.k,spl=X5_spl(n,s.d);let out=heading(`${n} bass speaker${n>1?'s':''}, heard from ${s.d} m`);
  const cols=Math.min(4,Math.ceil(Math.sqrt(n))),rows=Math.ceil(n/cols);
  for(let i=0;i<n;i++){const c=i%cols,r=Math.floor(i/cols),x=30+c*34,y=250-(rows-r)*34+ (rows-1-r)*0;out+=R(x,y,30,30,C.dark,'none',3)+Ci(x+15,y+15,10,'#51646f','#8aa1ae')}
  out+=L(20,252,170,252,C.line,2)+T(96,274,'the stack',13,C.muted);
  const px=220,pw=350,py=250,ph=180,XX=d=>px+Math.log2(d)/6*pw,YY=v=>py-(v-60)/70*ph;
  out+=R(px,py-ph,pw,ph,'#fff',C.grid,4);
  [70,85,100,115,130].forEach(v=>{out+=L(px,YY(v),px+pw,YY(v),v===85?C.coral:C.grid,v===85?1.6:1,v===85?'stroke-dasharray="6 4"':'')+TF(px-6,YY(v)+4,String(v),12,v===85?C.coral:C.muted,'end')});
  [1,4,16,64].forEach(d=>out+=TF(XX(d),py+16,d+' m',12,C.muted));
  let dd='';for(let i=0;i<=60;i++){const d=2**(i/10);dd+=(i?'L':'M')+fmt(XX(d))+' '+fmt(YY(clamp(X5_spl(n,d),60,130)))}
  out+=P(dd,C.blue,2.6)+Ci(XX(s.d),YY(clamp(spl,60,130)),7,C.amber,'#fff');
  out+=T(px+8,YY(85)+16,'85 dB: protect your ears',12,C.coral,'start')+T(px,py-ph-8,'sound level, dB (model)',12,C.muted,'start');
  out+=counter(30,292,'level here',Math.round(spl)+' dB',spl>=85?C.coral:C.green,130)+T(380,310,'Twice the boxes: up to +6 dB.',13,C.ink)+T(380,330,'Twice the distance: −6 dB.',13,C.ink);
  out+=T(300,362,'Simple model: one box gives 100 dB at 1 m; open air, no echoes.',13,C.muted);
  return {svg:out,phase:spl>=100?'This close, the level is far above what ears can take for long. Crews and regulars wear earplugs.':spl>=85?'Still above 85 dB, the level at which UK workplace rules require hearing protection for a working day.':'Here the level has dropped below 85 dB. Outdoors, distance is the only thing that quietens a rig, which is why free parties could be heard for miles.'};
 }});

const X5_CM=[['Fri 22 May',4,'Travellers heading for the Avon Free Festival are turned away by police and moved on, county to county.'],['Sat 23 May',20,'Convoys settle on Castlemorton Common in Worcestershire. Sound systems including Spiral Tribe, DiY, Bedlam and Circus Warp set up.'],['Sun 24 May',30,'News reports on television and radio tell the whole country where it is. Thousands more arrive.'],['Mon 25 May',30,'The bank-holiday peak. Estimates of the crowd run from 20,000 to 40,000.'],['Tue 26 May',18,'Many leave after the long weekend. Local residents complain of noise and of being unable to move about.'],['Wed 27 May',10,'The site thins out. Police wait at the edges of the common.'],['Thu 28 May',5,'Most sound systems pack up.'],['Fri 29 May',1,'Police arrest members of Spiral Tribe as they leave. Thirteen are charged; all are acquitted in 1994.']];
SCENE({id:'free-parties-castlemorton',name:'Castlemorton, May 1992',tag:'A week on the common',
 definition:'Castlemorton Common Festival was a week-long free party in Worcestershire in May 1992. Travellers, ravers and several sound systems gathered there after police blocked another festival, and it became the largest free party held in Britain.',
 example:'Crowd estimates run from 20,000 to 40,000. Nobody sold tickets, so nobody counted.',
 desc:'A day slider from Friday 22 to Friday 29 May 1992, a sketch of the common filling and emptying with dots, and a note for each day.',
 research:['Collin, M. (1997). Altered State. Serpent’s Tail, ch. 6.','Reynolds, S. (1998). Energy Flash. Picador.','McKay, G. (1996). Senseless Acts of Beauty: Cultures of Resistance since the Sixties. Verso.','The crowd curve is illustrative; only the peak range is reported.'],
 dur:12,hint:'Move through the week. The size of the crowd on each day is a sketch; only the peak estimate is documented.',
 init:()=>({d:0}),
 watch(p){return {d:Math.min(7,Math.floor(p*8))}},
 ui:[{range:'d',label:'Day',min:0,max:7,step:1,get:s=>s.d,act:'d',show:v=>X5_CM[v][0]}],
 on:{d(s,v){s.d=clamp(+v,0,7);return 'keep'}},
 draw(s){
  const [day,k,note]=X5_CM[s.d];let out=heading(`${day} 1992`);
  out+=R(30,56,330,180,'#e6f1e4','#b9d3b4',14)+P('M30 190Q120 150 200 176T360 150',C.green,1.5)+T(195,76,'Castlemorton Common',13,C.green);
  const r=rng(41);for(let i=0;i<k*6;i++){const x=44+r()*302,y=92+r()*130;out+=Ci(x,y,2.6,i%9===0?C.coral:C.dark)}
  [[90,120],[250,112],[180,196]].slice(0,k>=18?3:k>=5?2:k>=4?1:0).forEach(([x,y])=>out+=R(x-12,y-9,24,18,C.purple,'none',3));
  out+=T(195,256,'dots: people · purple: sound systems',12,C.muted);
  out+=X5_CM.map((q,i)=>R(384+i*24,216-q[1]*4.4,18,q[1]*4.4,i===s.d?C.blue:'#b9d4e6','none',3)).join('')+L(380,216,580,216,C.line,1.5)+T(480,236,'crowd through the week (sketch)',12,C.muted)+T(480,68,'peak: 20,000–40,000',13,C.ink);
  out+=R(30,274,540,62,'#f6f9fb','none',10)+X5_para(46,298,note,60);
  out+=T(300,364,'Estimates only: no tickets were sold and no count was made.',13,C.muted);
  return {svg:out,phase:s.d<7?'Castlemorton showed how large a free party could become once the news spread. Its scale, and the complaints of people living nearby, were cited in Parliament during the debates that led to the 1994 Act.':'The prosecution of Spiral Tribe ended in acquittal in 1994 after a long and costly trial. By then the group had left for mainland Europe, where the “teknival” movement grew from the same model.'};
 }});

SCENE({id:'free-parties-network',name:'How word got round',tag:'No internet, a few phone lines',
 definition:'Free parties were advertised by word of mouth, photocopied flyers, pirate radio and recorded telephone messages that gave the meeting point only on the night. News spread person to person, so its reach multiplied each hour.',
 example:'If ten people each tell two others every hour, 10 becomes 30, then 90, then 270: more than 7,000 after six hours.',
 desc:'Sliders for how many people each person tells per hour and for the hours passed, with a curve of people who know on a logarithmic scale and a line at 30,000.',
 research:['Collin, M. (1997). Altered State. Serpent’s Tail (party lines and convoys).','St John, G. (2009). Technomad: Global Raving Countercultures. Equinox.','The spreading rule is an illustrative model, not data.'],
 dur:10,hint:'Change how many people each person tells and let the hours run. This is a simple doubling-style model, not a record of any real night.',
 init:()=>({k:2,h:4}),
 watch(p){return {k:2,h:Math.round(p*10)}},
 ui:[{range:'k',label:'Each person tells',min:1,max:4,step:1,get:s=>s.k,act:'k',show:v=>v+' others an hour'},{range:'h',label:'Hours since the message',min:0,max:10,step:1,get:s=>s.h,act:'h',show:v=>v+' h'}],
 on:{k(s,v){s.k=clamp(+v,1,4);return 'keep'},h(s,v){s.h=clamp(+v,0,10);return 'keep'}},
 draw(s){
  const reach=h=>Math.min(30000,10*Math.pow(1+s.k,h)),now=reach(s.h);let out=heading(`After ${s.h} hour${s.h===1?'':'s'}: about ${X5_num(now)} people know`);
  const px=90,pw=450,py=270,ph=190,XX=h=>px+h/10*pw,YY=v=>py-(Math.log10(v)-1)/(Math.log10(30000)-1)*ph;
  out+=R(px,py-ph,pw,ph,'#fff',C.grid,4);
  [10,100,1000,10000].forEach(v=>out+=L(px,YY(v),px+pw,YY(v),C.grid,1)+TF(px-6,YY(v)+4,X5_num(v),12,C.muted,'end'));
  out+=L(px,YY(30000),px+pw,YY(30000),C.coral,1.5,'stroke-dasharray="6 4"')+T(px+8,YY(30000)+16,'30,000: a Castlemorton-sized crowd',12,C.coral,'start');
  [0,2,4,6,8,10].forEach(h=>out+=TF(XX(h),py+16,h+' h',12,C.muted));
  let d='';for(let i=0;i<=100;i++){const h=i/10;d+=(i?'L':'M')+fmt(XX(h))+' '+fmt(YY(reach(h)))}
  out+=P(d,C.blue,2.6)+Ci(XX(s.h),YY(now),7,C.amber,'#fff');
  out+=T(300,318,`10 people at the start; each tells ${s.k} more every hour (×${s.k+1} an hour)`,14,C.ink);
  out+=T(300,356,'Illustrative model on a log scale: a straight line means steady multiplying.',13,C.muted);
  return {svg:out,phase:now>=30000?'The message has saturated the model’s 30,000 people. In 1992 television news did in an afternoon what word of mouth took a night to do.':'Multiplying, not adding, is why a party could go from a few carloads to thousands overnight, and why the police found convoys hard to head off.'};
 }});

/* =========================== criminal-justice-act =========================== */
X5_cards({id:'criminal-justice-act',name:'The Criminal Justice Act 1994',tag:'A law that defined a music',
 definition:'The Criminal Justice and Public Order Act 1994 gave police in England and Wales powers to stop and break up open-air “raves”. Section 63 defined the music involved as sounds “wholly or predominantly characterised by the emission of a succession of repetitive beats”.',
 example:'Under the 1994 wording, a gathering of 100 or more people in the open air, with amplified music at night likely to cause serious distress to local people, could be ordered to leave.',
 desc:'Six chips for the parts of the law, each opening a panel that paraphrases what that part says.',
 research:['Criminal Justice and Public Order Act 1994, c. 33, Part V, sections 63–66 (legislation.gov.uk).','Anti-social Behaviour Act 2003, s. 58 (amendments to section 63).','Collin, M. (1997). Altered State. Serpent’s Tail.'],
 hint:'Press each part to read what it says. The wording is paraphrased except for the short quoted phrase.',
 heading:'Sections 63 to 65, in plain words',foot:'Royal Assent: 3 November 1994',
 items:[
  {k:'What',t:'Section 63(1): what counts as a rave',body:'A gathering on land in the open air of 100 or more people, whether or not they are trespassing, at which amplified music is played during the night and which, because of its loudness, duration and timing, is likely to cause serious distress to people living nearby.',phase:'The section applied even with the landowner’s permission, unless the event was licensed.'},
  {k:'Music',t:'Section 63(1)(b): the definition of music',body:'The Act says that “music” includes sounds “wholly or predominantly characterised by the emission of a succession of repetitive beats”. It is one of very few laws to describe a musical style in its text.',phase:'The phrase was meant to catch house and techno. Read literally, it describes most dance music ever made, from marches to disco.'},
  {k:'Leave',t:'Section 63(2)–(6): the power to direct people to leave',body:'A police officer of at least superintendent rank may direct people to leave the land and take their vehicles and property if two or more are preparing a rave, ten or more are waiting for one, or ten or more are attending one. Refusing, or returning within seven days, is an offence.',phase:'The offence carried up to three months in prison, a fine, or both.'},
  {k:'Seize',t:'Section 64: entry and seizure',body:'Police may enter the land without a warrant to see whether a direction should be given, and may seize and remove vehicles and sound equipment belonging to people who ignore a direction.',phase:'For a sound system, losing the rig meant losing years of work and savings. This was the power crews feared most.'},
  {k:'5 miles',t:'Section 65: stopping people on the way',body:'If a direction has been given, a constable in uniform may stop anyone within five miles of the site whom they reasonably believe to be on the way to the gathering, and direct them not to go there.',phase:'A five-mile radius covers almost 80 square miles around a field.'},
  {k:'2003',t:'2003: the definition is widened',body:'The Anti-social Behaviour Act 2003 lowered the number of people from 100 to 20, and extended the section to gatherings in buildings where the people are trespassing.',phase:'The repetitive-beats wording is still in force today.',note:'Applies to England and Wales.'}]});

// Repetition meter: the learner's bar is played with some steps changed each bar by a seeded draw.
const X5_RBASE=[[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0]];
function X5_mutate(base,m,bar){const cur=base.map(r=>r.slice());if(!m)return cur;const r=rng(900+bar*37);const used=new Set();let n=0,guard=0;while(n<m&&guard++<200){const k=Math.floor(r()*3),i=Math.floor(r()*16),key=k+':'+i;if(used.has(key))continue;used.add(key);cur[k][i]=cur[k][i]?0:1;n++}return cur}
const X5_same=(a,b)=>a.every((r,k)=>r.every((v,i)=>v===b[k][i]));
const X5_RSPEC={N:16,ms:s=>15000/s.bpm,step(s,i){
  if(i===0){const next=X5_mutate(s.base,s.m,s.bar+1);if(s.bar>=0)s.hist=s.hist.concat([X5_same(next,s.cur)?1:0]).slice(-8);s.cur=next;s.bar++}
  if(s.cur[0][i])X5_S.kick();if(s.cur[1][i])X5_S.snare();if(s.cur[2][i])X5_S.hat()}};
SCENE({id:'criminal-justice-act-repetitive',name:'A succession of repetitive beats',tag:'Can a beat avoid repeating?',
 definition:'The 1994 Act described rave music as a “succession of repetitive beats”. One reply from musicians was to write tracks in which no two bars are the same, so that, read literally, the description would not fit.',
 example:'Autechre’s 1994 “Anti EP” included a track, “Flutter”, programmed so that no bar repeats exactly. Its sleeve advised DJs, tongue in cheek, to have a lawyer and a musicologist on hand.',
 desc:'A three-row drum grid you can edit, a slider for how many steps change at random each bar, and a strip showing whether each of the last eight bars repeated the one before.',
 research:['Criminal Justice and Public Order Act 1994, s. 63(1)(b).','Autechre (1994). Anti EP. Warp Records (sleeve text, paraphrased here).','Reynolds, S. (1998). Energy Flash. Picador.','The changing rule here is an original seeded model, not a reconstruction of “Flutter”.'],
 dur:12,hint:'Edit the grid, press Play, then raise “Steps changed each bar”. At zero every bar repeats; from one upwards no bar matches the last.',
 init:()=>({bpm:130,m:0,base:X5_RBASE.map(r=>r.slice()),cur:X5_RBASE.map(r=>r.slice()),bar:-1,hist:[],playing:false,pos:-1}),
 watch(p){const m=p<.4?0:3,bar=Math.floor(p*10*130/240),cur=X5_mutate(X5_RBASE,m,bar),hist=[];for(let b=Math.max(1,bar-7);b<=bar;b++)hist.push(X5_same(X5_mutate(X5_RBASE,m,b),X5_mutate(X5_RBASE,m,b-1))?1:0);return {bpm:130,m,base:X5_RBASE,cur,bar,hist,playing:false,pos:-1}},
 ui:[{range:'m',label:'Steps changed each bar',min:0,max:6,step:1,get:s=>s.m,act:'m'},{range:'bpm',label:'Tempo (BPM)',min:110,max:150,step:2,get:s=>s.bpm,act:'bpm'},{b:'Play / stop',act:'play'},{b:'Clear the record',act:'clear'}],
 on:X5_seq(X5_RSPEC,{m(s,v){s.m=clamp(+v,0,6);return 'keep'},bpm(s,v,ctx){s.bpm=+v;X5_restart(s,ctx,X5_RSPEC);return 'keep'},clear(s){s.hist=[];return 'keep'},
  cell(s,v){const [k,i]=String(v).split(':').map(Number);s.base[k][i]=s.base[k][i]?0:1;if(!s.playing)s.cur=s.base.map(r=>r.slice());return 'keep'}}),
 draw(s,f,X){
  const pos=X5_pos(s,X,16,s.bpm),rep=s.hist.filter(Boolean).length;
  let out=heading(s.m===0?'Every bar the same: repetitive':s.bar<1&&X.try?'Press Play: each bar will differ':'Each bar differs from the last');
  const names=['Kick','Snare','Hat'],cols=[C.blue,C.coral,C.green];
  out+=X5_grid(X,78,names.map((nm,k)=>({name:nm,col:s.cur[k]&&s.base[k]?cols[k]:cols[k],on:i=>!!s.cur[k][i],act:X.try&&!s.playing?'cell':null})),pos);
  let changed=0;s.cur.forEach((r,k)=>r.forEach((v,i)=>{if(v!==s.base[k][i]){changed++;out+=R(100+i*30+4,78+k*28+5,22,17,'none',C.amber,4)}}));
  out+=T(300,186,changed?`${changed} step${changed>1?'s':''} differ from your pattern this bar (outlined)`:'This bar is exactly your pattern',14,changed?C.amber:C.muted);
  out+=T(100,222,'last 8 bars:',13,C.muted,'start');
  for(let i=0;i<8;i++){const v=s.hist[i],x=196+i*46;out+=R(x,204,40,28,v===undefined?'#fff':v?C.coralp:C.greenp,v===undefined?C.grid:v?C.coral:C.green,6)+(v===undefined?'':TB(x+20,223,v?'same':'new',12,v?C.coral:C.green))}
  out+=counter(100,254,'bars heard',String(Math.max(0,s.bar+1)),C.blue,120)+counter(236,254,'repeats of the bar before',`${rep} of ${s.hist.length}`,rep?C.coral:C.green,200)+counter(452,254,'tempo',s.bpm+' BPM',C.purple,110);
  out+=T(300,338,X.try&&!s.playing?'Press a square to edit your pattern, then Play.':'“same”: identical to the bar before. “new”: at least one step differs.',14,C.ink);
  out+=T(300,364,'Original model; “Flutter” itself is not reproduced.',13,C.muted);
  return {svg:out,phase:s.m===0?'With no changes, each bar is identical to the last: by any reading, a succession of repetitive beats.':'Now no bar matches the one before, yet it still sounds like a steady beat. That was the musicians’ point: “repetitive” is easy to hear and hard to define in law.'};
 }});

X5_cards({id:'criminal-justice-act-protest',name:'Opposition and aftermath',tag:'1992–1995',
 definition:'The Bill that became the 1994 Act was opposed by an unusual alliance of ravers, travellers, squatters, road protesters and civil-liberties groups, who marched in London three times in 1994. It passed, and the scene changed shape rather than ending.',
 example:'After 1994 several British sound systems moved to mainland Europe, where large free “teknivals” took place in France and the Czech Republic.',
 desc:'Six dated chips from 1992 to 1995 with a panel describing each stage of the opposition to the Bill and what followed.',
 research:['McKay, G. (ed.) (1998). DiY Culture: Party and Protest in Nineties Britain. Verso.','Collin, M. (1997). Altered State. Serpent’s Tail.','St John, G. (2009). Technomad. Equinox.','March sizes are estimates and were disputed at the time.'],
 hint:'Press each date. Crowd sizes at the marches were disputed, so none are given as exact.',
 heading:'From Castlemorton to the Act',foot:'Sources: McKay (1998), Collin (1997)',
 items:[
  {k:'1992',t:'May 1992: Castlemorton',body:'The week-long free festival on Castlemorton Common, and the press coverage of it, led to calls in Parliament for new police powers over large unlicensed gatherings.',phase:'Castlemorton is usually named as the event that made the law politically certain.'},
  {k:'1993',t:'1993: the Bill is announced',body:'The government announced a Criminal Justice and Public Order Bill. Besides raves, it covered trespass, squatting, travellers’ sites, hunt saboteurs and the right to silence, which is why so many different groups opposed it.',phase:'The rave clauses were a small part of a very wide Bill.'},
  {k:'May',t:'1 May 1994: the first march',body:'A march through central London to Trafalgar Square brought sound systems, travellers and civil-liberties campaigners together. Organisers included the Advance Party, a network of sound systems, and the Freedom Network.',phase:'Sound systems on lorries turned the march itself into a moving party.'},
  {k:'July',t:'24 July 1994: the second march',body:'A larger march passed Downing Street, where there were scuffles at the gates, and again ended in Trafalgar Square.',phase:'Reports of the numbers varied several-fold between organisers and police.'},
  {k:'Oct',t:'9 October 1994: Hyde Park',body:'The third march ended in Hyde Park. A dispute over bringing sound-system lorries into the park was followed by hours of disorder between police and part of the crowd.',phase:'The Bill received Royal Assent less than a month later, on 3 November 1994.'},
  {k:'After',t:'After the Act',body:'Large free parties became rarer and riskier in England and Wales. Some sound systems left for mainland Europe and helped start the teknival circuit. Much of the music moved into licensed clubs and festivals, which grew quickly in the later 1990s.',phase:'The law did not end the music. It pushed it indoors, abroad, and into the mainstream leisure economy.'}]});

/* =========================== after-rave =========================== */
// Original one-bar patterns for six styles. k kick, s snare or clap, h hat, b bass note (MIDI) or 0.
const X5_STY=[
 {id:'house',name:'House and garage',bpm:125,k:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],s:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],h:[0,0,1,0,0,0,1,1,0,0,1,0,0,0,1,0],b:[0,0,0,36,0,0,36,0,0,0,0,39,0,0,36,0],note:'Four on the floor with a swung, skipping hat. Around 120–130 BPM.'},
 {id:'techno',name:'Techno',bpm:135,k:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],s:[0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],h:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],b:[0,33,0,0,0,33,0,0,0,33,0,0,0,33,0,33],note:'Four on the floor, off-beat hat, little melody. Around 130–140 BPM.'},
 {id:'trance',name:'Trance',bpm:140,k:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],s:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],h:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],b:[0,0,33,0,0,0,33,0,0,0,36,0,0,0,31,0],note:'Four on the floor with the bass on every off-beat. Around 135–145 BPM.'},
 {id:'hardcore',name:'Hardcore, 1992',bpm:150,k:[1,0,0,0,1,0,0,1,1,0,0,0,1,0,1,0],s:[0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0],h:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],b:[33,0,0,0,0,0,0,0,33,0,0,0,0,0,0,0],note:'A straight kick with a breakbeat on top. Around 140–155 BPM.'},
 {id:'jungle',name:'Jungle, drum and bass',bpm:165,k:[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],s:[0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0],h:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1],b:[33,0,0,0,0,0,0,0,0,0,31,0,0,0,0,0],note:'No steady kick: a fast, chopped breakbeat over slow sub-bass. Around 160–175 BPM.'},
 {id:'happy',name:'Happy hardcore',bpm:175,k:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],s:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],h:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0],b:[0,0,45,0,0,0,45,0,0,0,48,0,0,0,43,0],note:'Four on the floor again, very fast, with bright off-beat stabs. Around 165–180 BPM.'}];
const X5_stySpec={N:16,ms:s=>15000/X5_STY[s.i].bpm,step(s,i){const q=X5_STY[s.i];if(q.k[i])X5_S.kick();if(q.s[i])X5_S.snare();if(q.h[i])X5_S.hat();if(q.b[i]){if(q.b[i]<40)X5_S.sub(0,q.b[i]);else X5_S.acid(q.b[i],0,{cutoff:900,res:4,env:800})}}};
SCENE({id:'after-rave',name:'After rave: the styles split',tag:'One scene becomes many tempos',
 definition:'Around 1991–1993 the single British rave scene divided into separate styles with their own clubs, labels and tempos. Some kept the steady four-on-the-floor kick of house and techno; others built on sped-up breakbeats.',
 example:'By the mid-1990s house ran at about 125 beats per minute, techno at about 135, and jungle at about 165: too far apart to mix in one DJ set.',
 desc:'Six styles placed on a tempo scale from 110 to 190 beats per minute. Choosing one shows its one-bar drum pattern on a grid and plays it.',
 research:['Reynolds, S. (1998). Energy Flash. Picador.','Belle-Fortune, B. (2004). All Crews: Journeys Through Jungle / Drum & Bass Culture. Vision.','Butler, M. J. (2006). Unlocking the Groove. Indiana University Press.','Tempo ranges are typical values and approximate.'],
 dur:12,hint:'Choose a style and press Play. The patterns are original examples in each style; tempos are typical, not fixed.',
 init:()=>({i:1,playing:false,pos:-1}),
 watch(p){return {i:Math.min(5,Math.floor(p*6)),playing:false,pos:-1}},
 ui:[{choose:X5_STY.map((q,i)=>[i,q.name]),label:'Style',get:s=>s.i,act:'i'},{b:'Play / stop',act:'play'}],
 on:X5_seq(X5_stySpec,{i(s,v,ctx){s.i=clamp(+v,0,5);X5_restart(s,ctx,X5_stySpec);return 'keep'}}),
 draw(s,f,X){
  const q=X5_STY[s.i],pos=X5_pos(s,X,16,q.bpm);let out=heading(`${q.name}: about ${q.bpm} BPM`);
  const XX=b=>60+(b-110)/80*480;out+=L(60,78,540,78,C.line,2);
  [110,130,150,170,190].forEach(b=>out+=L(XX(b),72,XX(b),84,C.line,2)+TF(XX(b),100,String(b),12,C.muted));
  X5_STY.forEach((z,i)=>out+=hit(X,'i',i,z.name,Ci(XX(z.bpm),78,i===s.i?10:7,i===s.i?C.coral:'#fff',i===s.i?C.coral:C.blue)));
  out+=T(540,60,'beats per minute',12,C.muted,'end');
  out+=X5_grid(X,138,[{name:'Kick',col:C.blue,on:i=>!!q.k[i]},{name:'Snare',col:C.coral,on:i=>!!q.s[i]},{name:'Hat',col:C.green,on:i=>!!q.h[i]},{name:'Bass',col:C.purple,on:i=>!!q.b[i]}],pos);
  const four=[0,4,8,12].every(i=>q.k[i]);
  out+=T(300,282,four?'Kick on all four beats: four on the floor':'Kick off the grid of beats: a breakbeat',15,four?C.blue:C.coral);
  out+=X5_para(300,314,q.note,60,14,C.ink,19,'middle');
  out+=T(300,362,'Original patterns; typical tempos, approximate.',13,C.muted);
  return {svg:out,phase:four?'This style keeps the house and techno pulse: a kick on every beat. Speed and decoration change, the foundation does not.':'This style drops the steady kick. The drums follow a syncopated break, and the slow bass carries the weight: the line that led from hardcore to jungle.'};
 }});

const X5_BB=[
 {name:'Four on the floor',k:[1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],s:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],h:[0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0]},
 {name:'Breakbeat',k:[1,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0],s:[0,0,0,0,1,0,0,0,0,1,0,0,1,0,0,1],h:[1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]},
 {name:'Two-step',k:[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],s:[0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],h:[0,0,1,1,0,0,1,0,0,1,0,0,0,0,1,1]}];
const X5_bbSpec={N:16,ms:s=>15000/s.bpm,step(s,i){const q=X5_BB[s.i];if(q.k[i])X5_S.kick();if(q.s[i])X5_S.snare();if(q.h[i])X5_S.hat()}};
SCENE({id:'after-rave-breakbeat',name:'Straight kick or breakbeat',tag:'Where the kick falls',
 definition:'A four-on-the-floor beat puts a kick drum on every beat of the bar. A breakbeat moves kicks and snares off the beats, in the manner of a funk drummer’s solo “break”, so the bar feels pushed and pulled.',
 example:'Count the kicks that land on beats 1, 2, 3 and 4. Four on the floor: all four. A typical breakbeat: only the first.',
 desc:'A three-row grid showing the kick, snare and hat of the chosen pattern, counters for kicks on and off the beat, and a tempo slider.',
 research:['Butler, M. J. (2006). Unlocking the Groove. Indiana University Press (“four-on-the-floor” and “breakbeat-driven” as the two families).','Reynolds, S. (1998). Energy Flash. Picador.'],
 dur:10,hint:'Switch between the three patterns and press Play. Try the breakbeat at 165 BPM and the straight kick at 130.',
 init:()=>({i:0,bpm:132,playing:false,pos:-1}),
 watch(p){return {i:Math.min(2,Math.floor(p*3)),bpm:132,playing:false,pos:-1}},
 ui:[{choose:X5_BB.map((q,i)=>[i,q.name]),label:'Pattern',get:s=>s.i,act:'i'},{range:'bpm',label:'Tempo (BPM)',min:110,max:175,step:1,get:s=>s.bpm,act:'bpm'},{b:'Play / stop',act:'play'}],
 on:X5_seq(X5_bbSpec,{i(s,v){s.i=clamp(+v,0,2);return 'keep'},bpm(s,v,ctx){s.bpm=+v;X5_restart(s,ctx,X5_bbSpec);return 'keep'}}),
 draw(s,f,X){
  const q=X5_BB[s.i],pos=X5_pos(s,X,16,s.bpm),onb=[0,4,8,12].filter(i=>q.k[i]).length,tot=q.k.filter(Boolean).length;
  let out=heading(q.name);
  out+=X5_grid(X,88,[{name:'Kick',col:C.blue,on:i=>!!q.k[i]},{name:'Snare',col:C.coral,on:i=>!!q.s[i]},{name:'Hat',col:C.green,on:i=>!!q.h[i]}],pos);
  out+=counter(100,196,'kicks on a beat',`${onb} of 4`,C.blue,140)+counter(256,196,'kicks between beats',String(tot-onb),C.coral,150)+counter(422,196,'tempo',s.bpm+' BPM',C.purple,120);
  out+=T(300,286,'Tinted columns are the four beats of the bar.',14,C.muted);
  out+=T(300,330,s.i===0?'Every beat is marked: easy to walk, march or dance to.':s.i===1?'Kicks land between the beats; the snare answers them.':'Two kicks a bar, with gaps: the garage “two-step”.',15,C.ink);
  return {svg:out,phase:s.i===0?'House and techno keep this pattern almost without exception, which is why their records mix into one another so easily.':s.i===1?'Breakbeats came into rave from hip-hop sampling. Sped up past 160 BPM they became the drum language of jungle.':'UK garage in the late 1990s took kicks out of the bar, leaving space for bass and voices. This is an original example of the feel.'};
 }});

X5_cards({id:'after-rave-continuum',name:'Superclubs and the “hardcore continuum”',tag:'Two ways to tell the 1990s',
 definition:'After 1994 British dance music can be told as two stories: a move into large licensed “superclubs”, and a line of bass-heavy London styles that the critic Simon Reynolds named the “hardcore continuum”. The second is one writer’s thesis, and it is argued over.',
 example:'Reynolds traces hardcore to jungle, to UK garage, to grime and dubstep, each carried by pirate radio and specialist record shops. Critics reply that the line is too tidy and too centred on London.',
 desc:'Five chips: superclubs, where techno went, the continuum idea, pirate radio, and the critiques, each with a panel of text.',
 research:['Reynolds, S. (2009–2013). The Hardcore Continuum series of essays, The Wire (the thesis, labelled as his).','Reynolds, S. (1998). Energy Flash. Picador.','Collin, M. (1997). Altered State. Serpent’s Tail.','Garratt, S. (1998). Adventures in Wonderland. Headline.'],
 hint:'Press each chip. The “continuum” is a critic’s idea, presented with the objections to it.',
 heading:'Britain after 1994',foot:'The continuum is Simon Reynolds’s thesis, not a settled fact',
 items:[
  {k:'Clubs',t:'Superclubs',body:'Licensed clubs with big sound systems and guest DJs grew through the decade: the Ministry of Sound in London (opened 1991), Cream in Liverpool (1992) and Gatecrasher in Sheffield, among others. DJs became headline names and clubbing a mainstream night out.',phase:'The 1990 and 1994 laws made unlicensed events costly. Licensed venues were where the money and the crowds could safely go.'},
  {k:'Techno',t:'Where techno went',body:'Techno kept a smaller, dedicated circuit. Nights included Lost in London, the Orbit in Morley near Leeds, Pure in Edinburgh and House of God in Birmingham, a city whose hard, stripped-down records became known as the “Birmingham sound”. Glasgow’s Soma label began in 1991.',phase:'British techno looked outwards, to Detroit and Berlin, more than to the pop charts.'},
  {k:'Idea',t:'The “hardcore continuum”',body:'Simon Reynolds argued that hardcore rave, jungle, UK garage, grime and dubstep form one continuous tradition: the same parts of London, the same reliance on bass, breakbeats and MCs, and the same network of pirate stations and record shops, mutating every few years.',phase:'The idea explains why these styles share so much. It is an interpretation, set out in a series of essays for The Wire.'},
  {k:'Radio',t:'Pirate radio and dubplates',body:'Unlicensed stations broadcast from tower blocks, with phone-in shouts from listeners. Producers cut one-off acetate “dubplates” so that a DJ could play a track months before release. Both habits came from Jamaican sound-system culture.',phase:'This infrastructure, more than any one sound, is what the continuum idea says stayed constant.'},
  {k:'Critics',t:'Objections to the continuum',body:'Other writers have argued that the model is too centred on London, plays down house, techno and influences from abroad, and draws a neater family tree than the messy history supports. Reynolds has answered that it describes a tendency, not a rule.',phase:'Treat the continuum as a useful map with disputed borders.'}]});
