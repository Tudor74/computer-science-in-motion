/* ===================== Techno era 4 · Berlin (1989–2004) ===================== */
// Loops schedule one beat of sound at a time from the tick handler and move a playhead with ctx.every.
// Nothing sounds unless the learner pressed Play. The voices are simplified models, not circuit emulations.
const X4_NOTE='Simplified model, not a circuit emulation.';
const X4_V={
 kick:(at,g=1,hard=0)=>AUDIO.kick({at,from:170+hard*60,to:50+hard*8,decay:.3-hard*.08,gain:.3*g,click:.012-hard*.006}),
 ch:(at,g=1,cut=8000)=>AUDIO.hit({at,dur:.04,gain:.07*g,type:'highpass',cutoff:cut}),
 oh:(at,g=1)=>AUDIO.hit({at,dur:.22,gain:.065*g,type:'highpass',cutoff:7000}),
 clap:(at,g=1)=>{for(const d of [0,.011,.022])AUDIO.hit({at:at+d,dur:.02,gain:.085*g,type:'bandpass',cutoff:1300,q:1.2});AUDIO.hit({at:at+.03,dur:.13,gain:.095*g,type:'bandpass',cutoff:1300,q:1.2})}
};
function X4_loop(spec,extra={}){
 const tick=(s,tok)=>{if(!s.playing||Number(tok)!==s.tok)return 'stop';const N=spec.N(s),st=spec.ms(s)/1000;s.pos=(s.pos+1)%N;
  if(s.pos%4===0)for(let k=0;k<4;k++)spec.step(s,s.pos+k,k*st+.03);
  return 'keep'};
 return {...extra,tick,
  play(s,a,ctx){s.tok=(s.tok||0)+1;if(s.playing){s.playing=false;AUDIO.stopAll();return 'keep'}s.playing=true;s.pos=-1;tick(s,s.tok);ctx.every(spec.ms(s),'tick',s.tok);return 'keep'}};
}
function X4_restart(s,ctx,spec,H){if(s.playing){s.tok=(s.tok||0)+1;s.pos=-1;AUDIO.stopAll();H.tick(s,s.tok);ctx.every(spec.ms(s),'tick',s.tok)}}
const X4_pos=(s,X,N)=>X&&X.try?(s.playing?s.pos:-1):Math.floor(((X&&X.p)||0)*N*2)%N;
const X4_stepMs=bpm=>60000/bpm/4;
function X4_wrap(text,max){const out=[];let line='';for(const w of String(text).split(' ')){if((line+' '+w).trim().length>max&&line){out.push(line);line=w}else line=(line+' '+w).trim()}if(line)out.push(line);return out}
function X4_para(x,y,text,max,size=14,col=C.ink){return X4_wrap(text,max).map((l,i)=>T(x,y+i*(size*1.28+5),l,size,col,'start')).join('')}
// A scene of pressable cards: items [{chip,title,when,text}], optional art(item,index) drawn at the foot of the card.
function X4_cards(def){
 const items=def.items,n=items.length;
 SCENE({id:def.id,name:def.name,tag:def.tag,definition:def.definition,example:def.example,desc:def.desc,research:def.research,dur:def.dur||12,hint:def.hint||'Press each card in turn, or use Next.',
  init:()=>({i:0}),watch(p){return {i:Math.min(n-1,Math.floor(p*n))}},
  ui:[{b:'Next',act:'next'}],
  on:{pick(s,v){s.i=Number(v);return 'keep'},next(s){s.i=(s.i+1)%n;return 'keep'}},
  draw(s,f,X){
   const it=items[s.i],w=(540-(n-1)*6)/n;let out=heading(def.head||def.name);
   items.forEach((q,i)=>{const x=30+i*(w+6),on=i===s.i;out+=hit(X,'pick',i,q.title,R(x,48,w,34,on?C.blue:'#fff',on?C.blue:C.line,8)+TF(x+w/2,70,q.chip,12,on?'#fff':C.ink))});
   out+=R(30,98,540,226,'#fff',C.grid,10)+TB(48,128,it.title,16,C.ink,'start');
   if(it.when)out+=TF(552,128,it.when,13,C.muted,'end');
   out+=X4_para(48,158,it.text,58);
   if(def.art)out+=def.art(it,s.i);
   if(def.foot)out+=T(300,356,def.foot,14,C.muted);
   return {svg:out,phase:it.note||def.phase||it.text};
  }});
}

/* ---------- after-the-wall ---------- */
X4_cards({id:'after-the-wall',name:'After the Wall',tag:'A divided city suddenly has room',
 definition:'When the Berlin Wall opened on 9 November 1989, the eastern half of the city was full of empty buildings whose owners were unknown or gone. Young people from both sides used them for parties, and techno became the music of that moment.',
 example:'Within two years of the Wall opening, clubs were running in a department-store vault, a wartime bunker and a disused power station, all in what had been East Berlin or the border strip.',
 desc:'Six cards from West Berlin’s acid house cellar of 1988 to the clubs that opened in the East by 1993.',
 research:['Denk, F. & von Thülen, S. (2014). Der Klang der Familie: Berlin, Techno and the Fall of the Wall. Trans. J. Sabin. Books on Demand.','Rapp, T. (2010). Lost and Sound: Berlin, Techno and the Easyjet Set. Innervisions.','Sicko, D. (2010). Techno Rebels. 2nd edn. Wayne State University Press.'],
 foot:'Dates as given in Denk & von Thülen’s oral history.',
 items:[
  {chip:'1988',title:'Ufo',when:'1988',text:'West Berlin’s first acid house club opens in a Kreuzberg cellar. It is tiny, unlicensed and soon moves, but the people who run it will open Tresor three years later.'},
  {chip:'July 89',title:'The first Love Parade',when:'1 July 1989',text:'About 150 people follow one small van with a sound system down the Kurfürstendamm. The DJ Dr Motte registers it as a political demonstration, four months before the Wall opens.'},
  {chip:'Nov 89',title:'The Wall opens',when:'9 November 1989',text:'East Germans cross freely for the first time since 1961. Young East Berliners who had taped Western radio shows about electronic music can now go to the clubs they heard about.'},
  {chip:'1990',title:'Empty buildings',when:'1990',text:'Factories, bunkers and offices in the East stand empty, and nobody is sure who owns them. Parties move in for a night, a month or a year. Reunification follows on 3 October.'},
  {chip:'1991–93',title:'The clubs',when:'1991–1993',text:'Tresor opens in March 1991, then Planet, the Bunker in a wartime air-raid shelter in 1992, and E-Werk in a former electricity substation in 1993.'},
  {chip:'All night',title:'No closing time',when:'since 1949',text:'West Berlin abolished its closing hour for bars in 1949, and the reunited city kept that rule. Parties could run until morning, and later through whole weekends.'}]});

const X4_LP=[[1989,150],[1990,2000],[1991,6000],[1992,15000],[1993,30000],[1994,110000],[1995,280000],[1996,750000],[1997,1000000],[1998,800000],[1999,1500000]];
SCENE({id:'after-the-wall-loveparade',name:'The Love Parade grows',tag:'From 150 people to over a million',
 definition:'The Love Parade began in 1989 as a march of about 150 people behind one van. Ten years later it filled the centre of Berlin, and techno had gone from a few cellars to a mass event.',
 example:'Attendance is estimated at about 6,000 in 1991, about 110,000 in 1994 and about a million in 1997. Each bar on a logarithmic scale is ten times the one a step below.',
 desc:'Bars of estimated attendance for each year from 1989 to 1999 on a logarithmic scale, with a year slider.',
 research:['Denk, F. & von Thülen, S. (2014). Der Klang der Familie. Books on Demand.','Borneman, J. & Senders, S. (2000). Politics without a head: is the “Love Parade” a new form of political identification? Cultural Anthropology 15(2), 294–317.','Helbing, D. & Mukerji, P. (2012). Crowd disasters as systemic failures: analysis of the Love Parade disaster. EPJ Data Science 1, 7.'],
 dur:11,hint:'Move the year. The figures are organisers’ and press estimates and differ between sources.',
 init:()=>({y:1994}),watch(p){return {y:1989+Math.min(10,Math.floor(p*11))}},
 ui:[{range:'y',label:'Year',min:1989,max:1999,step:1,get:s=>s.y,act:'y'}],
 on:{y(s,v){s.y=Number(v);return 'keep'}},
 draw(s){
  let out=heading('Love Parade attendance, 1989–1999');const px=80,pw=470,py=62,ph=200,Y=v=>py+ph-(Math.log10(v)-2)/(6.4-2)*ph,bw=pw/11;
  out+=R(px,py,pw,ph,'#fff',C.grid,6);
  for(const [v,l] of [[100,'100'],[1000,'1,000'],[10000,'10,000'],[100000,'100,000'],[1000000,'1 million']])out+=L(px,Y(v),px+pw,Y(v),C.grid,1)+TF(px-6,Y(v)+4,l,12,C.muted,'end');
  X4_LP.forEach(([y,v],i)=>{const on=y===s.y,x=px+i*bw+5;out+=R(x,Y(v),bw-10,py+ph-Y(v),on?C.coral:(y<=s.y?C.blue:'#cfe0eb'),'none',3);if(i%2===0)out+=TF(x+(bw-10)/2,py+ph+17,String(y),12,C.muted)});
  const cur=X4_LP.find(q=>q[0]===s.y)[1],first=150;
  out+=counter(124,290,'year',String(s.y),C.blue,110)+counter(246,290,'estimated crowd',cur.toLocaleString('en-GB'),C.coral,150)+counter(408,290,'times the first parade','×'+Math.round(cur/first).toLocaleString('en-GB'),C.purple,150);
  out+=T(300,362,'Estimates; sources differ, sometimes by a factor of two.',14,C.muted);
  return {svg:out,phase:`In ${s.y} the parade drew an estimated ${cur.toLocaleString('en-GB')} people. It later lost its status as a demonstration, left Berlin after 2006, and ended after a crowd crush at the 2010 event in Duisburg killed 21 people.`};
 }});

const X4_COND=[['Empty buildings','Factories, bunkers and offices left unused when East German firms closed.'],['Unclear ownership','Nobody knew who owned many properties, so nobody stopped temporary use.'],['No closing hour','Bars and clubs could stay open all night and all weekend.'],['Cheap rent','Artists and organisers could live on little while they built something.']];
SCENE({id:'after-the-wall-spaces',name:'Why Berlin?',tag:'Four conditions at once',
 definition:'Historians of the Berlin scene point to conditions that came together after 1989: empty buildings, unclear ownership, no closing hour and low rents. Each existed elsewhere; having all four in a capital city was unusual.',
 example:'A power station with no owner to object, no law saying when to close and no rent to speak of can become a club. Take away any one condition and it becomes much harder.',
 desc:'Four conditions as switches, and a bar showing how much room they leave for clubs. The bar is an illustration, not a measurement.',
 research:['Denk, F. & von Thülen, S. (2014). Der Klang der Familie. Books on Demand.','Rapp, T. (2010). Lost and Sound. Innervisions.','Colomb, C. (2012). Pushing the urban frontier: temporary uses of space, city marketing, and the creative city discourse in 2000s Berlin. Journal of Urban Affairs 34(2), 131–152.'],
 dur:10,hint:'Switch conditions off one at a time and read what changes. The bar is an illustrative model.',
 init:()=>({c:[1,1,1,1]}),watch(p){const n=Math.min(4,Math.floor(p*5));return {c:[0,1,2,3].map(i=>i<n?1:0)}},
 ui:[{b:'All on',act:'all'}],
 on:{tog(s,v){const i=Number(v);s.c[i]=s.c[i]?0:1;return 'keep'},all(s){s.c=[1,1,1,1];return 'keep'}},
 draw(s,f,X){
  const n=s.c.filter(Boolean).length;let out=heading(n===4?'All four: a city with room to experiment':n===0?'None: an ordinary, regulated city':`${n} of 4 conditions`);
  X4_COND.forEach((q,i)=>{const x=30+(i%2)*276,y=50+Math.floor(i/2)*96,on=!!s.c[i];
   out+=hit(X,'tog',i,`${q[0]}: ${on?'on':'off'}. Press to switch.`,R(x,y,264,86,on?C.greenp:'#fff',on?C.green:C.line,10)+TBF(x+16,y+26,(on?'✓ ':'')+q[0],14,on?C.green:C.muted,'start'))+X4_wrap(q[1],36).map((l,k)=>TF(x+16,y+48+k*17,l,12,C.muted,'start')).join('')});
  const lvl=[0,.08,.25,.55,1][n];
  out+=TF(30,262,'room for clubs (illustrative)',13,C.muted,'start')+R(30,270,540,22,'#e9f0f4','none',8)+R(30,270,540*lvl,22,C.green,'none',8);
  out+=T(300,326,n===4?'Berlin, 1990–1993.':'Each missing condition closes off most of the possibilities.',15,C.ink)+T(300,356,'An illustration of the argument, not measured data.',13,C.muted);
  return {svg:out,phase:`With ${n} of the four conditions in place. Urban researchers call this “temporary use”: activity that fills the gap between one use of a building and the next. In Berlin the gap lasted years, and some of the temporary clubs became permanent.`};
 }});

/* ---------- tresor ---------- */
X4_cards({id:'tresor',name:'Tresor',tag:'A club in a bank vault',
 definition:'Tresor (“vault” or “safe”) opened in March 1991 in the basement strongroom of the former Wertheim department store, in the empty strip beside where the Wall had stood. It became the best-known of the first Berlin techno clubs.',
 example:'Dancers went down a staircase and through a steel door into a low room lined with rusting safe-deposit boxes. The sound had nowhere to go, and neither did the heat.',
 desc:'Five cards about the building, the room, the people who opened it, the floor upstairs and the club’s move in 2007, with a drawing of safe-deposit boxes.',
 research:['Denk, F. & von Thülen, S. (2014). Der Klang der Familie. Books on Demand.','Rapp, T. (2010). Lost and Sound. Innervisions.','Sicko, D. (2010). Techno Rebels. Wayne State University Press.'],
 foot:'Schematic drawing; not a plan of the building.',
 art:(it,i)=>{let o='';for(let r=0;r<2;r++)for(let c=0;c<18;c++)o+=R(60+c*27,262+r*26,23,22,i===1?'#b9c4cb':'#e3e9ed','#9aa9b3',2)+Ci(60+c*27+11.5,262+r*26+11,2.5,'#7d8c96');return o},
 items:[
  {chip:'Place',title:'The Wertheim vault',when:'Leipziger Strasse',text:'The department store above was bombed in the war and cleared; its basement vault survived under a vacant lot near Potsdamer Platz.'},
  {chip:'Room',title:'Steel and concrete',when:'March 1991',text:'A low ceiling, bars, thick walls and rows of forced-open safe-deposit boxes. The room is small and loud, with fog and a strobe.'},
  {chip:'People',title:'Who opened it',when:'1991',text:'Dimitri Hegemann, Achim Kohlberger and Johnnie Stieler, who had run the Ufo club. They find the vault while looking for a new space.'},
  {chip:'Upstairs',title:'Globus',when:'1991–2005',text:'The ground floor, called Globus, plays house; the vault below plays harder techno. A record label, Tresor Records, starts in the same year.'},
  {chip:'Move',title:'Closed and reopened',when:'2005–2007',text:'The lease ends and the site is redeveloped in 2005. Tresor reopens in 2007 in a former heating power plant on Köpenicker Strasse.'}]});

X4_cards({id:'tresor-axis',name:'Detroit–Berlin',tag:'Records one way, bookings the other',
 definition:'In the early 1990s Detroit producers found in Berlin the audience and income they lacked at home, and Berlin found in Detroit a sound and a lineage. Records, DJs and collaborations moved between the two cities.',
 example:'The first release on Tresor’s record label, in 1991, was by X-101: Mike Banks, Jeff Mills and Robert Hood of Detroit’s Underground Resistance.',
 desc:'Five cards about links between the two cities, each with an arrow showing which way the music or the people travelled.',
 research:['Sicko, D. (2010). Techno Rebels. Wayne State University Press.','Denk, F. & von Thülen, S. (2014). Der Klang der Familie. Books on Demand.','Brown Jr., D. (2022). Assembling a Black Counter Culture. Primary Information.'],
 foot:'Brown (2022) stresses that the music’s origin is Black Detroit.',
 art:(it)=>{const y=284,a=it.dir;let o=R(70,y-18,120,36,C.pale,'none',10)+TBF(130,y+5,'Detroit',14,C.blue)+R(410,y-18,120,36,C.purplep,'none',10)+TBF(470,y+5,'Berlin',14,C.purple);
  if(a!=='BD')o+=arrow(200,y-6,400,y-6,C.blue,2.5);if(a!=='DB')o+=arrow(400,y+8,200,y+8,C.purple,2.5);return o},
 items:[
  {chip:'Shop',dir:'DB',title:'Hard Wax',when:'1989',text:'Mark Ernestus opens the record shop Hard Wax in Kreuzberg and imports Detroit and Chicago twelve-inches. Berlin DJs learn the music from its racks.'},
  {chip:'X-101',dir:'DB',title:'A first release',when:'1991',text:'Tresor Records starts with X-101, by Mike Banks, Jeff Mills and Robert Hood of Underground Resistance.'},
  {chip:'DJs',dir:'DB',title:'Detroit DJs in the vault',when:'1991–93',text:'Jeff Mills, Blake Baxter, Juan Atkins and others play Tresor. Mills’s album “Waveform Transmission Vol. 1” comes out on the label in 1992.'},
  {chip:'3MB',dir:'both',title:'Working together',when:'1992–93',text:'Moritz von Oswald and Thomas Fehlmann, as 3MB, make records with Juan Atkins and with Eddie Fowlkes. A 1993 Tresor compilation is subtitled “Berlin–Detroit: A Techno Alliance”.'},
  {chip:'Credit',dir:'both',title:'Who gained what',when:'',text:'Detroit artists gained fees, labels and recognition that American radio and clubs did not offer them. Berlin gained a music. Later European histories often left Detroit out, which writers such as DeForrest Brown Jr. have corrected.'}]});

const X4_BANDS=[[120,128,'Detroit and Chicago, late 1980s',C.blue],[128,138,'Berlin clubs, about 1991',C.purple],[138,150,'“Tekkno”, about 1992–93',C.coral]];
const X4_HSPEC={ms:s=>X4_stepMs(s.bpm),N:()=>16,step(s,i,at){const hard=clamp((s.bpm-124)/26,0,1);if(i%4===0)X4_V.kick(at,1,hard);if(i%4===2)X4_V.oh(at,.9);else X4_V.ch(at,.7)}};
const X4_HH=X4_loop(X4_HSPEC,{bpm(s,v,ctx){s.bpm=Number(v);X4_restart(s,ctx,X4_HSPEC,X4_HH);return 'keep'}});
SCENE({id:'tresor-harder',name:'Faster and harder',tag:'What a few BPM do',
 definition:'In the first years after the Wall, Berlin DJs pushed the music faster and harder than the Detroit and Chicago records it came from. A rise from about 125 to 140 beats per minute, with a shorter, sharper kick, changes how a room moves.',
 example:'At 124 BPM a beat lasts 484 ms. At 145 BPM it lasts 414 ms: seventy milliseconds less, and about 1,260 more kicks in an hour.',
 desc:'A tempo ruler from 118 to 150 BPM with three shaded ranges for typical tempos, a marker at the chosen tempo and a simple drum loop.',
 research:['Denk, F. & von Thülen, S. (2014). Der Klang der Familie. Books on Demand.','Reynolds, S. (2013). Energy Flash. Faber.','Butler, M. J. (2006). Unlocking the Groove. Indiana University Press.'],
 dur:10,hint:'Press Play and move the tempo slowly upward. The ranges are typical and approximate. '+X4_NOTE,
 init:()=>({bpm:124,playing:false,pos:-1}),watch(p){return {bpm:Math.round(120+p*28),playing:false,pos:-1}},
 ui:[{b:'Play / stop',act:'play'},{range:'bpm',label:'Tempo',min:118,max:150,step:1,get:s=>s.bpm,act:'bpm',show:v=>v+' BPM'}],
 on:X4_HH,
 draw(s,f,X){
  const x0=60,w=480,X1=v=>x0+(v-118)/(150-118)*w,pos=X4_pos(s,X,16);let out=heading(s.bpm<128?'A steady, rolling tempo':s.bpm<138?'Faster: less room between kicks':'Hard and fast');
  X4_BANDS.forEach(([a,b,l,col],i)=>{out+=R(X1(a),80,X1(b)-X1(a),34,col,'none',4,'opacity=".28"')+L(X1(a),134+i*20,X1(b),134+i*20,col,3)+TF(X1(b)+8>470?X1(a)-8:X1(b)+8,138+i*20,l,12,col,X1(b)+8>470?'end':'start')});
  out+=L(x0,114,x0+w,114,C.line,2);for(const v of [120,130,140,150])out+=L(X1(v),108,X1(v),120,C.line,2)+TF(X1(v),72,String(v),12,C.muted);
  out+=L(X1(s.bpm),62,X1(s.bpm),114,C.ink,3)+Ci(X1(s.bpm),62,6,C.ink);
  for(let i=0;i<16;i++)out+=Ci(84+i*29,212,i%4===0?9:4,i===pos?C.amber:(i%4===0?C.blue:'#a9c3d3'));
  const beat=60000/s.bpm;
  out+=counter(84,236,'tempo',s.bpm+' BPM',C.blue,130)+counter(234,236,'one beat lasts',Math.round(beat)+' ms',C.purple,130)+counter(384,236,'kicks in an hour',(s.bpm*60).toLocaleString('en-GB'),C.coral,130);
  out+=T(300,320,'Typical ranges, approximate; individual records vary widely.',14,C.ink)+T(300,352,X4_NOTE,13,C.muted);
  return {svg:out,phase:`At ${s.bpm} BPM a beat lasts ${Math.round(beat)} ms, and an hour holds ${(s.bpm*60).toLocaleString('en-GB')} kicks. In this model the kick also gets shorter and sharper as the tempo rises, as it did on the harder records of 1992–93.`};
 }});

/* ---------- minimal ---------- */
const X4_LAY=[['Kick',C.blue],['Hat',C.green],['Clap',C.coral],['Bass',C.purple],['Chord',C.amber],['Lead',C.ink]];
const X4_BASS=[33,0,0,33,0,0,36,0,33,0,0,33,0,31,0,0],X4_LEAD=[0,0,69,0,72,0,0,69,0,0,76,0,74,0,72,0];
const X4_MSPEC={ms:()=>X4_stepMs(126),N:()=>16,step(s,i,at){const st=X4_stepMs(126)/1000,L_=s.on;
 if(L_[0]&&i%4===0)X4_V.kick(at);if(L_[1]){if(i%4===2)X4_V.oh(at,.9);else if(i%2)X4_V.ch(at,.7)}
 if(L_[2]&&(i===4||i===12))X4_V.clap(at,.9);
 if(L_[3]&&X4_BASS[i])AUDIO.acid(midiHz(X4_BASS[i]),{at,dur:st*1.4,gain:.11,type:'square',cutoff:260,env:500,res:4,decay:.12});
 if(L_[4]&&(i===3||i===11))AUDIO.chord([57,60,64].map(midiHz),{at,dur:.22,type:'sawtooth',gain:.07,attack:.005,release:.15});
 if(L_[5]&&X4_LEAD[i])AUDIO.tone(midiHz(X4_LEAD[i]),{at,dur:st*.9,type:'triangle',gain:.07,attack:.004,release:.08})}};
const X4_MH=X4_loop(X4_MSPEC,{lay(s,v){const i=Number(v);s.on[i]=s.on[i]?0:1;return 'keep'},strip(s){s.on=[1,1,0,1,0,0];return 'keep'},all(s){s.on=[1,1,1,1,1,1];return 'keep'}});
SCENE({id:'minimal',name:'Minimal',tag:'Take things away and listen',
 definition:'Minimal techno removes everything a track can do without. With only a kick, a hat and a bass figure left, small details that a busy track would hide become the whole event.',
 example:'Start with six layers and switch off the lead, the chord and the clap. What remains is not half a track. It is a different one, in which you notice the bass rhythm.',
 desc:'Six layers of an original loop as switches, each drawn as a row of the steps it plays, with a count of layers left.',
 research:['Hood, R. (1994). Minimal Nation [album]. Axis / M-Plant.','Sherburne, P. (2004). Digital discipline: minimalism in house and techno. In Cox, C. & Warner, D. (eds), Audio Culture. Continuum.','Butler, M. J. (2006). Unlocking the Groove. Indiana University Press.'],
 dur:12,hint:'Press Play with everything on, then switch layers off one at a time. Changes are heard from the next beat. '+X4_NOTE,
 init:()=>({on:[1,1,1,1,1,1],playing:false,pos:-1}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {on:[[1,1,1,1,1,1],[1,1,1,1,1,0],[1,1,1,1,0,0],[1,1,0,1,0,0]][k],playing:false,pos:-1}},
 ui:[{b:'Play / stop',act:'play'},{b:'Strip it back',act:'strip'},{b:'Everything on',act:'all'}],
 on:X4_MH,
 draw(s,f,X){
  const pos=X4_pos(s,X,16),n=s.on.filter(Boolean).length,x0=150,cw=26;let out=heading(n>=5?'A full loop':n>=3?'Fewer layers, more attention on each':n?'Almost nothing left':'Silence');
  const plays=[i=>i%4===0,i=>i%4===2||i%2===1,i=>i===4||i===12,i=>!!X4_BASS[i],i=>i===3||i===11,i=>!!X4_LEAD[i]];
  X4_LAY.forEach(([name,col],r)=>{const y=52+r*34,on=!!s.on[r];
   out+=hit(X,'lay',r,`${name}: ${on?'on':'off'}. Press to switch.`,R(30,y,106,28,on?col:'#fff',on?col:C.line,8)+TF(83,y+19,name,13,on?'#fff':C.muted));
   for(let i=0;i<16;i++)out+=R(x0+i*cw+1.5,y+3,cw-3,22,plays[r](i)?(on?col:'#d5dee4'):(i%4===0?'#eaf0f4':'#f6f8fa'),i===pos&&on&&plays[r](i)?C.amber:'none',3)});
  if(pos>=0)out+=L(x0+pos*cw+cw/2,48,x0+pos*cw+cw/2,256,C.amber,1.5,'opacity=".6"');
  out+=counter(160,268,'layers playing',n+' of 6',C.blue,130)+counter(310,268,'tempo','126 BPM',C.green,130);
  out+=T(300,340,n<=3&&n>0?'With so little, each sound has to earn its place.':'Switch layers off and notice what you start to hear.',15,C.ink)+T(300,364,X4_NOTE,12,C.muted);
  return {svg:out,phase:`${n} of 6 layers are playing. Robert Hood’s 1994 album “Minimal Nation” is usually named as the record that stripped techno back to drums, a bass line and a groove, with nothing that is not needed. ${X4_NOTE}`};
 }});

const X4_VSPEC={ms:()=>X4_stepMs(126),N:()=>64,step(s,i,at){const prog=i/63,cut=4000+prog*(s.amt/100)*8000;if(i%4===0)X4_V.kick(at);X4_V.ch(at,(i%2?.7:1)*(1+prog*s.amt/200),cut)}};
const X4_VH=X4_loop(X4_VSPEC,{amt(s,v){s.amt=Number(v);return 'keep'}});
SCENE({id:'minimal-variation',name:'Small changes, long spans',tag:'One knob, turned slowly',
 definition:'With few elements, change comes from turning one control slowly over many bars. A hi-hat that brightens across four bars creates tension and expectation without a single new note.',
 example:'Set the change to zero and the four bars are identical. Set it high and by the fourth bar the hat has opened up and grown louder, so that the loop seems to be going somewhere.',
 desc:'Four bars on a timeline with a line showing the hi-hat’s brightness rising across them by the chosen amount, and a playhead.',
 research:['Butler, M. J. (2006). Unlocking the Groove (on gradual process in techno). Indiana University Press.','Sherburne, P. (2004). Digital discipline. In Audio Culture. Continuum.','Reich, S. (1968). Music as a gradual process. In Writings on Music (2002). Oxford University Press.'],
 dur:10,hint:'Press Play and listen through four bars at zero, then raise the amount. Changes are heard from the next beat. '+X4_NOTE,
 init:()=>({amt:60,playing:false,pos:-1}),watch(p){return {amt:Math.round(p*100),playing:false,pos:-1}},
 ui:[{b:'Play / stop',act:'play'},{range:'amt',label:'Change over four bars',min:0,max:100,step:5,get:s=>s.amt,act:'amt',show:v=>v+'%'}],
 on:X4_VH,
 draw(s,f,X){
  const pos=X4_pos(s,X,64),x0=60,w=480,y0=210,h=120;let out=heading(s.amt===0?'Four identical bars':s.amt<50?'A slow, slight opening':'The hat opens across four bars');
  out+=R(x0,y0-h,w,h,'#fff',C.grid,6)+TF(x0,y0-h-8,'hi-hat brightness',13,C.muted,'start');
  for(let b=0;b<4;b++){out+=L(x0+b*w/4,y0-h,x0+b*w/4,y0,C.grid,1.5)+TF(x0+b*w/4+w/8,y0+17,'bar '+(b+1),12,C.muted)}
  const Y=pr=>y0-12-pr*(s.amt/100)*(h-28);out+=L(x0,Y(0),x0+w,Y(1),C.green,3)+L(x0,y0-12,x0+w,y0-12,C.line,1.5,'stroke-dasharray="4 4"');
  if(pos>=0){const px=x0+(pos+.5)/64*w;out+=L(px,y0-h,px,y0,C.amber,2)+Ci(px,Y(pos/63),6,C.amber)}
  const top=Math.round(4000+(s.amt/100)*8000);
  out+=counter(124,246,'starts at','4,000 Hz',C.blue,130)+counter(274,246,'ends at',top.toLocaleString('en-GB')+' Hz',C.green,130)+counter(424,246,'notes added','none',C.purple,130);
  out+=T(300,330,'The pattern never changes; the sound of it does.',15,C.ink)+T(300,358,X4_NOTE,13,C.muted);
  return {svg:out,phase:`Across four bars the hat’s filter moves from 4,000 Hz to ${top.toLocaleString('en-GB')} Hz. Gradual change of this kind, heard over minutes on a dance floor, is how a minimal track builds tension. ${X4_NOTE}`};
 }});

X4_cards({id:'minimal-people',name:'Who made minimal',tag:'Detroit, Berlin, Windsor, Cologne',
 definition:'Minimal was not one invention. Producers in several cities reduced techno in different ways in the early 1990s, and by the 2000s “minimal” named a whole style associated with Berlin.',
 example:'Robert Hood stripped tracks to drums and a riff; Basic Channel dissolved chords into echo; Plastikman slowed and emptied the acid line.',
 desc:'Six cards on producers and labels, from 1993 to the mid-2000s.',
 research:['Sicko, D. (2010). Techno Rebels. Wayne State University Press.','Sherburne, P. (2001). The rules of reduction. The Wire 209.','Rapp, T. (2010). Lost and Sound. Innervisions.','Reynolds, S. (2013). Energy Flash. Faber.'],
 foot:'Each is described by documented releases only.',
 items:[
  {chip:'Hood',title:'Robert Hood',when:'Detroit, 1994',text:'A founding member of Underground Resistance. “Minimal Nation” (1994) reduces techno to drum machine, bass figure and a few stabbing notes, and gives the style a name.'},
  {chip:'BC',title:'Basic Channel',when:'Berlin, 1993–95',text:'Moritz von Oswald and Mark Ernestus release nine twelve-inches in which chords are smeared by echo and filtering over a steady pulse. The approach becomes dub techno.'},
  {chip:'Hawtin',title:'Plastikman',when:'Windsor, Ontario, 1993–98',text:'Richie Hawtin, across the river from Detroit, makes slow, sparse acid as Plastikman: “Sheet One” (1993), “Musik” (1994) and the near-empty “Consumed” (1998).'},
  {chip:'Bell',title:'Daniel Bell',when:'Detroit, 1990s',text:'As DBX he makes dry, clicking tracks from very few sounds. Berlin producers of the next decade name him as a model.'},
  {chip:'Köln',title:'Cologne',when:'1998 on',text:'Wolfgang Voigt and the Kompakt label pair reduced rhythms with pop melody. The critic Philip Sherburne coins “microhouse” in 2001 for the wider turn to tiny sounds.'},
  {chip:'2000s',title:'Berlin minimal',when:'2000s',text:'Ricardo Villalobos (“Alcachofa”, 2003), the Perlon label and others play long, shifting, percussive sets. Cheap flights bring weekend visitors, and “minimal” becomes the city’s export.'}]});

/* ---------- berghain-era ---------- */
X4_cards({id:'berghain-era',name:'The Berghain era',tag:'From a railway depot to cultural heritage',
 definition:'By the 2000s Berlin’s clubs were established institutions. Berghain, opened in 2004 in a former power plant, became the best-known techno club in the world, and in 2024 Germany listed Berlin’s techno culture as intangible cultural heritage.',
 example:'The club that began as a gay fetish night in a railway freight depot was, by 2016, treated by a German court as a cultural venue for tax purposes, alongside concert halls.',
 desc:'Six cards from the Ostgut club of 1998 to the heritage listing of 2024.',
 research:['Rapp, T. (2010). Lost and Sound: Berlin, Techno and the Easyjet Set. Innervisions.','Garcia, L.-M. (2016). Techno-tourism and post-industrial neo-romanticism in Berlin’s electronic dance music scenes. Tourist Studies 16(3), 276–295.','German Commission for UNESCO (2024). Nationwide Inventory of Intangible Cultural Heritage: Techno culture in Berlin.'],
 foot:'Details as reported in the press and in Rapp (2010).',
 items:[
  {chip:'1998',title:'Ostgut',when:'1998–2003',text:'A club opens in a disused railway freight depot in Friedrichshain, growing out of the gay fetish party Snax. It closes when the site is cleared for an arena.'},
  {chip:'2004',title:'Berghain opens',when:'2004',text:'The same team reopens in a former heating power plant built in the 1950s, on the border of Kreuzberg and Friedrichshain, which gives the club its name.'},
  {chip:'Rooms',title:'Two floors',when:'',text:'The main hall, about 18 metres high, plays techno. Panorama Bar upstairs plays house. The label Ostgut Ton begins in 2005 with the club’s resident DJs.'},
  {chip:'Rules',title:'No photographs',when:'',text:'Phone cameras are covered with stickers at the door and there are no mirrors in the toilets. The stated aim is a room where people need not think about being watched.'},
  {chip:'2016',title:'“Culture”, says a court',when:'2016',text:'A tax court rules that the club’s nights count as cultural events, like concerts, and so qualify for the lower rate of sales tax.'},
  {chip:'2024',title:'Heritage',when:'2024',text:'Germany adds “techno culture in Berlin” to its national inventory of intangible cultural heritage, kept under the UNESCO convention, after a campaign by clubs and DJs.'}]});

const X4_DEV=[['Phone speaker',400,'Almost everything below about 400 Hz is missing; you hear the kick’s click, not its body.'],['Laptop',180,'The upper bass comes through. The lowest octave of a kick does not.'],['Headphones',25,'Good headphones reach the bottom of the range, though you do not feel it in the body.'],['Club system',30,'Subwoofers move enough air for bass to be felt in the chest as well as heard.']];
const X4_SBANDS=[['Sub-bass',20,60,C.purple],['Bass',60,250,C.blue],['Mids',250,4000,C.green],['Highs',4000,16000,C.amber]];
SCENE({id:'berghain-era-soundsystem',name:'The sound system',tag:'Bass you feel, not only hear',
 definition:'Techno is made for large sound systems. Much of a kick drum’s energy lies below 100 Hz, where small speakers produce almost nothing, so the same track is a different experience in a club.',
 example:'A kick that falls to 45 Hz is powerful on subwoofers and nearly silent on a phone. Play the same drum an octave higher, at 90 Hz, and the phone can manage some of it.',
 desc:'Four frequency bands from sub-bass to highs on a logarithmic scale, with a line showing roughly how low each kind of speaker can reach, and two versions of a kick to play.',
 research:['Fink, R. (2018). Below 100 Hz: toward a musicology of bass culture. In Fink, Latour & Wallmark (eds), The Relentless Pursuit of Tone. Oxford University Press.','Hove, M. J., Marie, C., Bruce, I. C. & Trainor, L. J. (2014). Superior time perception for lower musical pitch explains why bass-ranged instruments lay down musical rhythms. PNAS 111(28), 10383–10388.','Cameron, D. J. et al. (2022). Undetectable very-low frequency sound increases dancing at a live concert. Current Biology 32(21), R1222–R1223.'],
 dur:11,hint:'Choose what you are listening on, then play both kicks. On small speakers the low one may nearly vanish. Speaker limits are rough guides.',
 init:()=>({d:1}),watch(p){return {d:Math.min(3,Math.floor(p*4))}},
 ui:[{choose:X4_DEV.map((q,i)=>[i,q[0]]),label:'Listening on',get:s=>s.d,act:'d'},{b:'Kick down to 45 Hz',act:'low'},{b:'Same kick, to 90 Hz',act:'high'}],
 on:{d(s,v){s.d=Number(v);return 'keep'},low(s){AUDIO.kick({from:150,to:45,decay:.45,gain:.3});return 'keep'},high(s){AUDIO.kick({from:300,to:90,decay:.45,gain:.3});return 'keep'}},
 draw(s){
  const x0=60,w=480,lf=v=>x0+Math.log(v/20)/Math.log(800)*w,dv=X4_DEV[s.d];let out=heading(dv[0]+': reaches down to about '+dv[1]+' Hz');
  X4_SBANDS.forEach(([n,a,b,col])=>{const heard=b>dv[1];out+=R(lf(a)+1,70,lf(b)-lf(a)-2,70,col,'none',6,`opacity="${heard?(a<dv[1]?.5:.85):.14}"`)+TBF((lf(a)+lf(b))/2,110,n,13,heard?'#fff':C.muted)});
  for(const [v,l] of [[20,'20'],[60,'60'],[250,'250'],[1000,'1k'],[4000,'4k'],[16000,'16k Hz']])out+=TF(lf(v),158,l,12,C.muted);
  out+=L(lf(dv[1]),58,lf(dv[1]),146,C.ink,3)+TF(lf(dv[1])+(s.d===0?8:-8),54,'lowest it plays',12,C.ink,s.d===0?'start':'end');
  out+=Ci(lf(45),184,7,C.coral)+TF(lf(45)-12,188,'45 Hz kick',12,C.coral,'end')+Ci(lf(90),184,7,C.blue)+TF(lf(90)+12,188,'90 Hz kick',12,C.blue,'start');
  out+=R(30,222,540,84,'#fff',C.grid,10)+X4_para(48,250,dv[2],58);
  out+=T(300,334,'Speaker limits are rough guides and vary between models.',14,C.muted)+T(300,360,X4_NOTE,12,C.muted);
  return {svg:out,phase:`${dv[0]}: ${dv[2]} Research suggests low-pitched sounds carry the beat best (Hove et al. 2014), and one concert study found people danced about 12% more when very low bass was switched on, without noticing it (Cameron et al. 2022).`};
 }});

SCENE({id:'berghain-era-long-sets',name:'Long sets',tag:'The arithmetic of a night',
 definition:'Berlin clubs are known for long DJ sets and for parties that run from Saturday night into Monday. Over many hours a DJ plays far more records, and shapes a longer arc, than in a one-hour festival slot.',
 example:'An eight-hour set at 130 BPM contains 62,400 beats. If each record is heard for about five minutes, that is 96 records and 95 transitions between them.',
 desc:'Sliders for the length of a set, its tempo and how long each record is heard, with the number of records drawn as blocks along a timeline.',
 research:['Rapp, T. (2010). Lost and Sound. Innervisions.','Butler, M. J. (2014). Playing with Something That Runs: Technology, Improvisation, and Composition in DJ and Laptop Performance. Oxford University Press.','Brewster, B. & Broughton, F. (2006). Last Night a DJ Saved My Life. Headline.'],
 dur:10,hint:'Compare a one-hour set with an eight-hour one. The minutes per record are your choice, not a rule.',
 init:()=>({h:8,bpm:130,m:5}),watch(p){return {h:Math.max(1,Math.round(1+p*9)),bpm:130,m:5}},
 ui:[{range:'h',label:'Set length',min:1,max:10,step:1,get:s=>s.h,act:'h',show:v=>v+' h'},{range:'bpm',label:'Tempo',min:120,max:140,step:1,get:s=>s.bpm,act:'bpm',show:v=>v+' BPM'},{range:'m',label:'Each record heard for',min:3,max:8,step:1,get:s=>s.m,act:'m',show:v=>v+' min'}],
 on:{h(s,v){s.h=Number(v);return 'keep'},bpm(s,v){s.bpm=Number(v);return 'keep'},m(s,v){s.m=Number(v);return 'keep'}},
 draw(s){
  const recs=Math.round(s.h*60/s.m),beats=s.h*60*s.bpm,x0=40,w=520;let out=heading(s.h<=2?'A short set: a few records, one idea':s.h>=6?'A long set: room for a slow arc':'A medium set');
  out+=R(x0,60,w,54,'#fff',C.grid,6);const bw=w/recs;for(let i=0;i<recs;i++)out+=R(x0+i*bw+.6,64,Math.max(1,bw-1.2),46,i%2?'#9cc3dd':C.blue,'none',1.5);
  for(let k=0;k<=s.h;k++)out+=L(x0+k/s.h*w,114,x0+k/s.h*w,122,C.line,1.5)+(s.h<=5||k%2===0?TF(x0+k/s.h*w,138,k+' h',12,C.muted):'');
  out+=TF(x0,52,'each block is one record',13,C.muted,'start');
  out+=counter(40,162,'records',String(recs),C.blue,120)+counter(173,162,'transitions',String(Math.max(0,recs-1)),C.purple,120)+counter(306,162,'beats',beats.toLocaleString('en-GB'),C.coral,120)+counter(439,162,'bars of four',(beats/4).toLocaleString('en-GB'),C.green,120);
  out+=R(60,226,480,62,'#fff',C.grid,10)+TMF(300,250,`${s.h} h × 60 × ${s.bpm} BPM = ${beats.toLocaleString('en-GB')} beats`,14,C.ink)+TMF(300,274,`${s.h*60} min ÷ ${s.m} min = ${recs} records`,14,C.blue);
  out+=T(300,326,'More records means more chances to change direction slowly.',15,C.ink)+T(300,356,'Arithmetic only; real sets vary from record to record.',13,C.muted);
  return {svg:out,phase:`${s.h} hour${s.h>1?'s':''} at ${s.bpm} BPM is ${beats.toLocaleString('en-GB')} beats. Hearing each record for about ${s.m} minutes means ${recs} records and ${Math.max(0,recs-1)} transitions, which is why long sets are described as journeys and short ones as showcases.`};
 }});
