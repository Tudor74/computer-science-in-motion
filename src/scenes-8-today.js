/* ===================== Techno era 8 · Techno today ===================== */
// Sound only from on() handlers; loops tick once per step with ctx.every. Watch is derived from lesson time and silent.
// Voices are simplified models. Patterns are original, written "in the style"; no real track is reproduced.
const X8_now=()=>performance.now()/1000;
const X8_V={
 kick:(at=0,g=.26)=>AUDIO.kick({at,from:170,to:50,decay:.28,gain:g}),
 soft:(at=0,g=.16)=>AUDIO.kick({at,from:120,to:55,decay:.2,gain:g}),
 log:(hz,at=0)=>AUDIO.kick({at,from:hz*2.2,to:hz,decay:.34,gain:.22,click:.004}),
 hat:(at=0,g=.05)=>AUDIO.hit({at,dur:.04,gain:g,cutoff:8000}),
 shaker:(at=0,g=.03)=>AUDIO.hit({at,dur:.03,gain:g,cutoff:6000}),
 ohat:(at=0,g=.045)=>AUDIO.hit({at,dur:.2,gain:g,cutoff:7000}),
 clap:(at=0,g=.1)=>AUDIO.hit({at,type:'bandpass',cutoff:1500,q:1.2,dur:.12,gain:g}),
 stab:(at=0)=>AUDIO.chord([110,130.81,164.81],{at,dur:.14,type:'sawtooth',gain:.07,attack:.004,release:.1}),
 bass:(hz,at=0)=>AUDIO.acid(hz,{at,dur:.17,cutoff:260,env:420,res:4,gain:.13,decay:.12}),
 lead:(hz,at=0)=>AUDIO.acid(hz,{at,dur:.12,cutoff:900,env:1100,res:10,gain:.07,decay:.1})
};
function X8_loopOn(spec,extra={}){
 return {...extra,
  play(s,a,ctx){s.token=(s.token||0)+1;if(s.playing){s.playing=false;AUDIO.stopAll();return 'keep'}s.playing=true;s.pos=-1;ctx.every(spec.ms(s),'tick',s.token);return 'keep'},
  tick(s,tok){if(!s.playing||Number(tok)!==s.token)return 'stop';s.pos=(s.pos+1)%spec.N(s);spec.step(s,s.pos);return 'keep'}};
}
function X8_restart(s,ctx,spec){if(s.playing){s.token=(s.token||0)+1;s.pos=-1;ctx.every(spec.ms(s),'tick',s.token)}}
const X8_pos=(s,X,N,rate)=>X.try?(s.playing?s.pos:-1):Math.floor(X.p*rate)%N;
function X8_wrap(t,n){const out=[];let cur='';for(const w of String(t).split(' ')){if(cur&&(cur+' '+w).length>n){out.push(cur);cur=w}else cur=cur?cur+' '+w:w}if(cur)out.push(cur);return out}
const X8_text=(x,y,t,n=42,col=C.ink,lh=19)=>X8_wrap(t,n).map((l,i)=>TF(x,y+i*lh,l,13,col,'start')).join('');
function X8_card(y,h,title,sub,body,col=C.blue){return R(40,y,520,h,'#fff',C.grid,10)+R(40,y,8,h,col,'none',4)+TBF(62,y+26,title,15,col,'start')+(sub?TF(62,y+46,sub,12,C.muted,'start'):'')+X8_text(62,y+(sub?70:52),body)}

/* ---------- global-scenes ---------- */
const X8_CITIES=[
 ['detroit','Detroit',-83,42,'Movement festival, since 2000','Each May the city where techno began holds a festival in Hart Plaza on the riverfront. It started in 2000 as the Detroit Electronic Music Festival and has run as Movement since 2006.'],
 ['berlin','Berlin',13.4,52.5,'Clubs as culture','In March 2024 Germany added Berlin’s techno culture to its national list of intangible cultural heritage, after a campaign by clubs and the group Rave The Planet.'],
 ['tbilisi','Tbilisi',44.8,41.7,'Bassiani, since 2014','A club under the national football stadium, in a disused swimming pool. Police raids in May 2018 led to days of protest outside parliament, with a sound system.'],
 ['kyiv','Kyiv',30.5,50.4,'Raves after 2014','The Cxema parties began in 2014 in industrial spaces. Since the full-scale invasion of 2022, many events have run in daytime and raised money for relief.'],
 ['durban','Durban',31,-29.9,'A neighbour: gqom','Gqom grew in Durban’s townships in the early 2010s: dark, sparse, with a broken kick instead of four-on-the-floor. It is a relative of techno, not a branch of it.'],
 ['bogota','Bogotá',-74.1,4.7,'A Latin American centre','Colombia’s capital has a large club and festival scene; Baum Festival is often named among the bigger techno events in Latin America.'],
 ['tokyo','Tokyo',139.7,35.7,'A long-running scene','Ken Ishii’s releases on the Belgian label R&S in the 1990s made Tokyo techno known abroad. Until a 2016 change in the law, dancing after midnight was restricted in most venues.']];
SCENE({id:'global-scenes',name:'Scenes around the world',tag:'One sound, many cities',
 definition:'Techno began in Detroit and took root in Berlin, but it is now made and danced to on every continent. Each scene bends it to local conditions: buildings, laws, politics and the music next door.',
 example:'Tbilisi’s main club is under a football stadium. Kyiv’s parties moved to daytime. Durban grew its own neighbour, gqom, with no four-on-the-floor kick at all.',
 desc:'A schematic world map with seven cities marked, and a card about the chosen city.',
 research:'Garcia, L.-M. (2016). Techno-tourism and post-industrial neo-romanticism in Berlin’s electronic dance music scenes. Tourist Studies 16(3). · German UNESCO Commission, national inventory of intangible cultural heritage (2024). · News reporting for recent events; details are summarised cautiously.',
 dur:12,hint:'Choose a city, or press its dot on the map. The map shows positions only; it is not drawn to any exact projection.',
 init:()=>({c:'detroit'}),
 watch(p){return {c:X8_CITIES[Math.min(6,Math.floor(p*7))][0]}},
 ui:[{choose:X8_CITIES.map(c=>[c[0],c[1]]),label:'City',get:s=>s.c,act:'c'}],
 on:{c(s,v){s.c=v;return 'keep'}},
 draw(s,f,X){
  const x0=50,w=500,y0=50,h=130,px=lon=>x0+(lon+180)/360*w,py=lat=>y0+(70-lat)/125*h,c=X8_CITIES.find(q=>q[0]===s.c)||X8_CITIES[0];
  let out=heading(c[1]+': '+c[4])+R(x0,y0,w,h,'#f6f9fb',C.grid,10);
  for(const lon of [-120,-60,0,60,120])out+=L(px(lon),y0+4,px(lon),y0+h-4,C.grid,1);
  out+=L(x0+4,py(0),x0+w-4,py(0),C.grid,1.4)+TF(x0+8,py(0)-5,'equator',12,C.muted,'start');
  X8_CITIES.forEach(q=>{const on=q[0]===s.c;out+=hit(X,'c',q[0],q[1],Ci(px(q[2]),py(q[3]),on?9:6,on?C.coral:C.blue,'#fff'))});
  out+=X8_card(196,170,c[1],c[4],c[5],C.coral);
  return {svg:out,phase:c[0]==='durban'?'Scenes also grow sideways. Gqom and amapiano in South Africa, like footwork in Chicago, share machines and clubs with techno but follow their own rhythmic logic.':'A global scene does not mean one sound. Sound systems, licensing laws, empty buildings and local music all shape what techno becomes in a place.'};
 }});

const X8_TB=[
 ['2014','A club under the stadium','Bassiani opens beneath Tbilisi’s national football stadium, in a disused swimming pool. Its regular queer night becomes one of the few such spaces in the country.'],
 ['12 May 2018','The raids','Armed police raid Bassiani and another club, Café Gallery, during the night, saying they are acting against drug dealing. The clubs’ founders and dozens of others are detained.'],
 ['12–13 May','A rave at parliament','Thousands gather on Rustaveli Avenue in front of parliament. A sound system is set up and people dance in protest. The slogan is “We dance together, we fight together”.'],
 ['13 May','An apology','The interior minister addresses the crowd and apologises. Organisers pause the protest. Far-right groups hold counter-demonstrations nearby.'],
 ['After','What it showed','The club reopens. The argument about Georgia’s strict drug laws continues. The episode is often cited as a moment when a dance floor became a civil-rights platform.']];
SCENE({id:'global-scenes-tbilisi',name:'Tbilisi, May 2018',tag:'When a club became a protest',
 definition:'In some places a techno club is more than a night out: it is one of the few spaces where people who are not safe elsewhere can gather. That gives it political weight.',
 example:'After police raided two Tbilisi clubs in May 2018, thousands of people danced in front of the Georgian parliament for two days.',
 desc:'Five steps on a timeline of the May 2018 raids on Bassiani and the protest that followed, with a card for each step.',
 research:'Contemporary reporting (e.g. The Guardian, Resident Advisor, BBC, May 2018). · Details such as crowd size and the number detained differ between reports, so they are given loosely here.',
 dur:12,hint:'Step through the events. Numbers are deliberately loose where reports differ.',
 init:()=>({i:0}),
 watch(p){return {i:Math.min(4,Math.floor(p*5))}},
 ui:[{range:'i',label:'Step',min:0,max:4,step:1,get:s=>s.i,act:'i',show:v=>(Number(v)+1)+' of 5'}],
 on:{i(s,v){s.i=Number(v);return 'keep'}},
 draw(s){
  const e=X8_TB[s.i];let out=heading(e[1]);
  out+=L(80,96,520,96,C.line,3);
  X8_TB.forEach((q,k)=>{const x=80+k*110,on=k===s.i;out+=Ci(x,96,on?12:8,k<=s.i?C.coral:'#fff',k<=s.i?'#fff':C.line)+TF(x,130,q[0],12,on?C.ink:C.muted)});
  // a crowd sketch for the protest steps
  if(s.i===2||s.i===3){const r=rng(31);for(let k=0;k<46;k++){out+=Ci(70+r()*460,160+r()*12,3.2,k%5===0?C.amber:'#9db2bf')}}
  out+=X8_card(190,176,e[1],e[0],e[2],C.coral);
  return {svg:out,phase:s.i>=2?'The protest used the scene’s own tools: a sound system, a line-up, and the habit of staying all night. It is one of the clearest recent cases of club culture acting as a civic movement.':'Bassiani drew international DJs to a city with little club infrastructure, and local authorities saw it both as a showcase and as a problem.'};
 }});

const X8_STY={
 techno:{name:'Techno',bpm:130,note:'Kick on every beat, open hat between the beats, clap on 2 and 4.',rows:[['Kick',[0,4,8,12]],['Clap',[4,12]],['Hat',[2,6,10,14]]],
  step(i){if(i%4===0)X8_V.kick();if(i===4||i===12)X8_V.clap();if(i%4===2)X8_V.ohat();if(i%2===1)X8_V.hat(0,.03)}},
 gqom:{name:'Gqom',bpm:126,note:'No four-on-the-floor: a broken kick, dark stabs and space.',rows:[['Kick',[0,3,6,10,11]],['Stab',[4,12,14]],['Hat',[2,7,10,15]]],
  step(i){if([0,3,6,10,11].includes(i))X8_V.kick(0,.24);if([4,12,14].includes(i))X8_V.stab();if([2,7,10,15].includes(i))X8_V.hat(0,.04)}},
 amapiano:{name:'Amapiano',bpm:112,note:'Slower. A tuned “log drum” bass leads; shakers run underneath.',rows:[['Log drum',[0,3,7,10,13]],['Soft kick',[0,4,8,12]],['Shaker',[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]]],
  step(i){const k=[0,3,7,10,13].indexOf(i);if(k>=0)X8_V.log([55,55,65.41,49,55][k]);if(i%4===0)X8_V.soft();X8_V.shaker(0,i%2?.02:.035);if(i===4||i===12)X8_V.clap(0,.05)}}};
const X8_NB={ms:s=>60000/X8_STY[s.st].bpm/4,N:()=>16,step(s,i){X8_STY[s.st].step(i)}};
SCENE({id:'global-scenes-neighbours',name:'Techno’s neighbours',tag:'Same machines, different grid',
 definition:'Gqom from Durban and amapiano from Johannesburg and Pretoria are often heard in the same clubs as techno. They use similar tools but place the drums differently, and they are genres in their own right.',
 example:'Techno puts a kick on all four beats at about 130 BPM. Gqom breaks the kick into an uneven pattern. Amapiano is slower, around 112 BPM, and led by a pitched log-drum bass.',
 desc:'Three rows of sixteen steps showing where the main drums fall for techno, gqom or amapiano, with a playhead.',
 research:'Steingo, G. (2016). Kwaito’s Promise (background on South African electronic music). · Journalism on gqom and amapiano (e.g. Resident Advisor, The Guardian, 2016–2021). · Patterns are original and simplified, written in each style; tempos are typical values.',
 dur:11,hint:'Choose a style and press Play. These are simplified original patterns in each style, not real tracks.',
 init:()=>({st:'techno',playing:false,pos:-1}),
 watch(p){return {st:['techno','gqom','amapiano'][Math.min(2,Math.floor(p*3))],playing:false,pos:-1}},
 ui:[{choose:[['techno','Techno'],['gqom','Gqom'],['amapiano','Amapiano']],label:'Style',get:s=>s.st,act:'st'},{b:'Play / stop',act:'play'}],
 on:X8_loopOn(X8_NB,{st(s,v,ctx){s.st=v;X8_restart(s,ctx,X8_NB);return 'keep'}}),
 draw(s,f,X){
  const st=X8_STY[s.st],pos=X8_pos(s,X,16,48);let out=heading(`${st.name}: about ${st.bpm} BPM`);
  const x0=150,cw=25;
  st.rows.forEach(([name,hits],r)=>{const y=76+r*52,col=[C.blue,C.coral,C.amber][r];out+=TBF(x0-12,y+24,name,13,col,'end');
   for(let i=0;i<16;i++){const on=hits.includes(i);out+=R(x0+i*cw+1.5,y,cw-3,36,on?col:i%4===0?'#e6edf2':'#fff',i===pos?C.amber:on?'none':C.grid,5)}});
  for(let b=0;b<4;b++)out+=TF(x0+b*4*cw+cw/2,242,String(b+1),12,C.muted);
  out+=TF(x0+16*cw,242,'beats',12,C.muted,'end');
  out+=R(60,258,480,52,'#fff',C.grid,10)+X8_text(76,280,st.note,40);
  const four=s.st!=='gqom';
  out+=T(300,350,four?'A kick on every beat':'The kick avoids beats 2 and 4',15,four?C.blue:C.coral);
  return {svg:out,phase:s.st==='techno'?'The four-on-the-floor kick is techno’s most stable feature. Everything else is placed against it.':s.st==='gqom'?'Gqom removes the steady kick, so the body has to supply the pulse. That absence is its signature, and it is why gqom is a neighbour of techno, not a sub-genre.':'Amapiano’s log drum is a bass and a drum at once: a low, pitched thud that plays a syncopated line. The feel is relaxed, built on shakers and space.'};
 }});

/* ---------- credit-and-erasure ---------- */
const X8_PEOPLE=[
 ['hand','K-Hand','Kelli Hand, Detroit (1964–2021)','A DJ and producer from the first decade of Detroit techno. She founded her own label in 1990, later named Acacia Records. In 2017 Detroit’s city council honoured her as the “first lady of Detroit” techno.'],
 ['minx','DJ Minx','Detroit','A Detroit DJ and producer who founded the Women on Wax collective in 1996 to promote women DJs from the city, and later a label of the same name.'],
 ['djax','Miss Djax','Saskia Slegers, Eindhoven','Founded the label Djax Records in 1989. Its Djax-Up-Beats imprint released many Chicago and Detroit producers in Europe in the early 1990s.'],
 ['allien','Ellen Allien','Berlin','A Berlin DJ since the early 1990s, with residencies at clubs including Tresor. She founded the label BPitch Control in 1999.'],
 ['temple','Paula Temple','UK-born, Berlin-based','A producer and DJ of hard, experimental techno. Her label Noise Manifesto, started in 2015, set out to release more women and queer and trans artists.'],
 ['dijon','Honey Dijon','Chicago-born','A DJ and producer who learned the craft in Chicago’s house scene. A Black trans woman, she speaks often about the Black and queer roots of dance music, and co-produced tracks on Beyoncé’s Renaissance (2022).'],
 ['madonna','The Blessed Madonna','Marea Stamper, Chicago','Formerly talent buyer and resident DJ at the Chicago club Smartbar. She has argued publicly for fairer line-ups and safer dance floors.']];
SCENE({id:'credit-and-erasure',name:'Who gets the credit',tag:'Names that histories leave out',
 definition:'Techno was created by Black artists in Detroit, and women and queer and trans people have shaped it from the start. Popular histories have often left both out.',
 example:'K-Hand ran her own Detroit label from 1990. Miss Djax’s Dutch label carried Chicago and Detroit producers to Europe. DJ Minx built a network for women DJs in 1996.',
 desc:'A card for each of seven artists and label founders, with a short note on their documented work.',
 research:'Brown Jr., D. (2022). Assembling a Black Counter Culture. · Farrugia, R. (2012). Beyond the Dance Floor: Female DJs, Technology and Electronic Dance Music Culture. · Sicko, D. (2010). Techno Rebels, 2nd edn. · Each card states only widely documented public work.',
 dur:12,hint:'Choose a name. The cards are brief on purpose: they state only well-documented public work.',
 init:()=>({p:'hand'}),
 watch(p){return {p:X8_PEOPLE[Math.min(6,Math.floor(p*7))][0]}},
 ui:[{choose:X8_PEOPLE.map(q=>[q[0],q[1]]),label:'Artist',get:s=>s.p,act:'p'}],
 on:{p(s,v){s.p=v;return 'keep'}},
 draw(s){
  const i=Math.max(0,X8_PEOPLE.findIndex(q=>q[0]===s.p)),q=X8_PEOPLE[i];let out=heading(q[1]);
  X8_PEOPLE.forEach((r,k)=>{out+=Ci(96+k*68,74,k===i?13:9,k===i?C.purple:'#d9e3ea','#fff')});
  out+=TF(300,108,`${i+1} of ${X8_PEOPLE.length}`,12,C.muted);
  out+=X8_card(124,200,q[1],q[2],q[3],C.purple);
  out+=T(300,356,'A selection, not a ranking',14,C.muted);
  return {svg:out,phase:'Running a label, a night or a collective is how much of this work was done: it decided who got pressed, booked and heard. Those roles appear less often in histories built around star producers.'};
 }});

const X8_FACTS=[[2012,9.2],[2019,24.6],[2021,26.9]];
function X8_share(y){for(let k=0;k<X8_FACTS.length-1;k++){const [a,va]=X8_FACTS[k],[b,vb]=X8_FACTS[k+1];if(y<=b)return va+(vb-va)*(y-a)/(b-a)}return X8_FACTS[2][1]}
SCENE({id:'credit-and-erasure-lineups',name:'Counting festival line-ups',tag:'What the surveys found',
 definition:'Since 2013 the network female:pressure has counted who gets booked at electronic music festivals. Its FACTS surveys are the main source of figures on gender in line-ups.',
 example:'In the festivals surveyed, acts by women were about 9% of the line-ups in 2012 and about 27% in 2020–21, with most of the rest all-male acts.',
 desc:'A grid of one hundred squares standing for one hundred festival acts, coloured by the share that were women in the chosen year, with a line graph of the reported figures.',
 research:'female:pressure, FACTS surveys (2013–2022 editions), femalepressure.net: 9.2% female acts in 2012, 24.6% in 2019, 26.9% in 2020–21, as reported. Years between are drawn as a straight line. The surveys also count non-binary and mixed acts, which are not shown separately here.',
 dur:10,hint:'Move the year. Only 2012, 2019 and 2020–21 are reported figures here; the years between are interpolated.',
 init:()=>({y:2012}),
 watch(p){return {y:Math.round(2012+p*9)}},
 ui:[{range:'y',label:'Year',min:2012,max:2021,step:1,get:s=>s.y,act:'y'}],
 on:{y(s,v){s.y=Number(v);return 'keep'}},
 draw(s){
  const v=X8_share(s.y),n=Math.round(v),rep=X8_FACTS.some(q=>q[0]===s.y);let out=heading(`${s.y}: about ${n} in 100 acts were women`);
  for(let k=0;k<100;k++){const r=Math.floor(k/10),c=k%10;out+=R(60+c*21,60+r*21,17,17,k<n?C.purple:'#dfe7ec','none',4)}
  const x0=330,w=220,y0=250,h=170,fx=y=>x0+(y-2012)/9*w,fy=q=>y0-q/40*h;
  out+=R(x0,y0-h,w,h,'#fff',C.grid,4);for(const q of [10,20,30])out+=L(x0,fy(q),x0+w,fy(q),C.grid,1)+TF(x0-6,fy(q)+4,q+'%',12,C.muted,'end');
  out+=P(X8_FACTS.map((q,k)=>(k?'L':'M')+fmt(fx(q[0]))+' '+fmt(fy(q[1]))).join(''),C.purple,2.4,'none','stroke-dasharray="5 4"');
  X8_FACTS.forEach(q=>{out+=Ci(fx(q[0]),fy(q[1]),6,C.purple,'#fff')});
  out+=L(fx(s.y),y0-h,fx(s.y),y0,C.amber,2)+TF(x0,y0+18,'2012',12,C.muted,'start')+TF(x0+w,y0+18,'2021',12,C.muted,'end');
  out+=TF(x0+w/2,y0-h-8,'dots: reported · dashed: interpolated',12,C.muted);
  out+=counter(70,290,'women',v.toFixed(1)+'%',C.purple,110)+counter(195,290,'figure',rep?'reported':'interpolated',rep?C.green:C.amber,120)+counter(330,290,'source','FACTS survey',C.ink,130);
  out+=T(300,362,'Share of acts by women at surveyed festivals',14,C.muted);
  return {svg:out,phase:'The share roughly tripled in a decade and was still far from half. The surveys cover festivals that publish line-ups, mostly in Europe and North America, so they describe that sample, not every dance floor.'};
 }});

const X8_EVENTS=[[1981,'d','Cybotron','Juan Atkins and Rik Davis release “Alleys of Your Mind” in Detroit.'],[1985,'d','Model 500','Atkins starts the Metroplex label; “No UFO’s” follows.'],[1987,'d','Transmat','Derrick May’s label releases “Strings of Life”.'],
 [1988,'d','The name','A UK compilation, “Techno! The New Dance Sound of Detroit”, fixes the word “techno” for this music.'],[1988,'e','UK acid house','British clubs and raves take up Chicago and Detroit records.'],[1989,'d','Underground Resistance','Founded in Detroit as an independent label and collective.'],
 [1989,'e','The Wall falls','East Berlin’s empty buildings open up; the first Love Parade is held with about 150 people.'],[1991,'e','Tresor opens','A Berlin club in a former department-store vault, booking Detroit artists from the start.'],[1992,'e','A European industry','Labels, clubs and festivals across Europe now dominate techno’s sales and press.']];
SCENE({id:'credit-and-erasure-story',name:'Which came first',tag:'Detroit before Berlin',
 definition:'Techno is often described as a European, and especially a Berlin, invention. The record of releases shows the sound and the name were established in Detroit by Black artists before Berlin’s clubs opened.',
 example:'“Techno! The New Dance Sound of Detroit” came out in 1988. The Berlin Wall fell in 1989. Tresor opened in 1991, and booked Detroit artists from its first year.',
 desc:'Two timelines from 1981 to 1992, one for Detroit and one for Europe, with events appearing as the year advances and a card for the latest one.',
 research:'Sicko, D. (2010). Techno Rebels. · Brown Jr., D. (2022). Assembling a Black Counter Culture. · Denk, F. & von Thülen, S. (2014). Der Klang der Familie. · Release years are well documented; “who was first” inside Detroit is told differently by different people.',
 dur:12,hint:'Move the year forward and watch which lane fills first.',
 init:()=>({y:1986}),
 watch(p){return {y:Math.round(1981+p*11)}},
 ui:[{range:'y',label:'Year',min:1981,max:1992,step:1,get:s=>s.y,act:'y'}],
 on:{y(s,v){s.y=Number(v);return 'keep'}},
 draw(s){
  const x0=110,w=430,fx=y=>x0+(y-1981)/11*w,shown=X8_EVENTS.filter(e=>e[0]<=s.y),last=shown[shown.length-1],nd=shown.filter(e=>e[1]==='d').length,ne=shown.length-nd;
  let out=heading(ne===0?`${s.y}: so far, everything is in Detroit`:`${s.y}: Europe joins a sound that already exists`);
  [['d','Detroit',76,C.blue],['e','Europe',122,C.coral]].forEach(([k,name,y,col])=>{out+=TBF(x0-14,y+5,name,13,col,'end')+L(x0,y,x0+w,y,C.line,2);
   let seen={};X8_EVENTS.filter(e=>e[1]===k).forEach(e=>{const on=e[0]<=s.y,dx=(seen[e[0]]||0)*14;seen[e[0]]=(seen[e[0]]||0)+1;out+=Ci(fx(e[0])+dx,y,on?8:5,on?col:'#fff',on?'#fff':C.line)})});
  for(const y of [1981,1985,1989,1992])out+=TF(fx(y),156,String(y),12,C.muted);
  out+=L(fx(s.y),62,fx(s.y),140,C.amber,2);
  out+=X8_card(172,130,last?last[2]:'',last?`${last[0]} · ${last[1]==='d'?'Detroit':'Europe'}`:'',last?last[3]:'',last&&last[1]==='e'?C.coral:C.blue);
  out+=counter(150,312,'Detroit events so far',String(nd),C.blue,150)+counter(320,312,'Europe events so far',String(ne),C.coral,150);
  return {svg:out,phase:ne===0?'For most of the 1980s the story is entirely a Detroit one: small Black-owned labels, a few producers and a local radio audience.':'Europe gave techno its biggest audiences and much of its money, and writing about it followed the money. That is how the origin came to be blurred.'};
 }});

/* ---------- tools-today ---------- */
const X8_TOOLS=[
 ['1980','Roland TR-808','An analogue drum machine with a long, low kick. It sold poorly, was discontinued in 1983 and became cheap second-hand, which is how many producers got one.'],
 ['1981','Roland TB-303','A small bass synthesiser meant to accompany guitarists. It failed at that, and its squelching filter became the sound of acid.'],
 ['1983','TR-909 and MIDI','The 909 combined analogue drums with sampled cymbals. In the same year MIDI let machines from different makers play in time together.'],
 ['1995','Eurorack','Doepfer’s A-100 modular system set a format that hundreds of small makers later adopted. Modular synths returned to techno studios and stages.'],
 ['1997','Software emulation','ReBirth RB-338 put two 303s and an 808 on a home computer. From here a studio no longer needed the hardware.'],
 ['2001','Ableton Live','Software built around loops that stay in time and can be launched live. It blurred the line between producing a track and performing it.'],
 ['2010s','Clones and reissues','Roland’s TR-8 (2014) modelled the old drum machines digitally, and low-cost copies of the 303 and 808 followed, putting the classic sounds within most budgets.']];
SCENE({id:'tools-today',name:'From hardware to laptop and back',tag:'Forty years of tools',
 definition:'Techno was first made on a handful of commercial machines that happened to be cheap. Since the late 1990s the same sounds have been available in software, and since the 2010s as low-cost hardware again.',
 example:'A 1987 studio: a drum machine, a bass synth, a mixer, a tape recorder. A 2005 studio: a laptop. A 2020 studio: often a laptop and a table of small boxes.',
 desc:'Seven steps on a timeline of instruments and software from 1980 to the 2010s, with a card for each.',
 research:'Vail, M. (2014). The Synthesizer. · Roland Corporation product histories. · Butler, M. J. (2014). Playing with Something That Runs: Technology, Improvisation, and Composition in DJ and Laptop Performance. Oxford University Press.',
 dur:12,hint:'Step through the timeline. Dates are release years.',
 init:()=>({i:5}),
 watch(p){return {i:Math.min(6,Math.floor(p*7))}},
 ui:[{range:'i',label:'Step',min:0,max:6,step:1,get:s=>s.i,act:'i',show:v=>X8_TOOLS[Number(v)][0]}],
 on:{i(s,v){s.i=Number(v);return 'keep'}},
 draw(s){
  const e=X8_TOOLS[s.i];let out=heading(`${e[0]}: ${e[1]}`);
  out+=L(70,92,530,92,C.line,3);
  X8_TOOLS.forEach((q,k)=>{const x=70+k*76.6,on=k===s.i;out+=Ci(x,92,on?12:8,k<=s.i?(k<3?C.blue:k<6?C.purple:C.green):'#fff',k<=s.i?'#fff':C.line)+TF(x,126,q[0],12,on?C.ink:C.muted)});
  out+=X8_card(150,170,e[1],e[0],e[2],s.i<3?C.blue:s.i<6?C.purple:C.green);
  out+=Ci(150,346,6,C.blue)+TF(162,351,'hardware',12,C.muted,'start')+Ci(260,346,6,C.purple)+TF(272,351,'formats, software',12,C.muted,'start')+Ci(420,346,6,C.green)+TF(432,351,'hardware again',12,C.muted,'start');
  return {svg:out,phase:s.i<3?'None of these machines was designed for techno. Their limits, sixteen steps and a few knobs, became the grammar of the music.':'Each new tool made the old sounds cheaper and easier to reach. What stays scarce is the judgement about which sixteen steps to keep.'};
 }});

const X8_CLIPS={drums:['Kick only','Kick + hats','Full kit'],bass:['Root','Octaves','Busy'],lead:['Sparse','Riff','Stabs']};
const X8_TR=['drums','bass','lead'];
const X8_CL={ms:()=>60000/128/4,N:()=>16,step(s,i){
 if(i===0){X8_TR.forEach(t=>{if(s.q[t]!==undefined&&s.q[t]!==null){s.on={...s.on,[t]:s.q[t]===-1?null:s.q[t]};s.q={...s.q,[t]:null}}})}
 const d=s.on.drums,b=s.on.bass,l=s.on.lead;
 if(d!==null&&d!==undefined){if(i%4===0)X8_V.kick();if(d>=1&&i%4===2)X8_V.ohat();if(d>=2){if(i===4||i===12)X8_V.clap();if(i%2===1)X8_V.hat(0,.03)}}
 if(b!==null&&b!==undefined){if(b===0&&i%4===2)X8_V.bass(55);if(b===1&&i%2===0&&i%4!==0)X8_V.bass(i%8===2?55:110);if(b===2&&[2,3,6,9,11,14].includes(i))X8_V.bass([55,55,65.41,55,82.41,49][[2,3,6,9,11,14].indexOf(i)])}
 if(l!==null&&l!==undefined){if(l===0&&i===6)X8_V.lead(329.63);if(l===1&&[0,3,6,10].includes(i))X8_V.lead([220,261.63,220,196][[0,3,6,10].indexOf(i)]);if(l===2&&(i===3||i===11))X8_V.stab()}}};
SCENE({id:'tools-today-clips',name:'Launching clips',tag:'A track you perform',
 definition:'In clip-based software each part of a track is a short loop in a grid. The performer launches loops while the music plays, and the software waits for the next bar so that every change lands in time.',
 example:'Press “Full kit” in the middle of a bar: it lights up as queued and takes over exactly on beat 1 of the next bar.',
 desc:'A three-by-three grid of clips for drums, bass and lead; a playing clip is filled, a queued clip is outlined, and a bar of sixteen steps shows the playhead.',
 research:'Ableton Live (2001) introduced the “Session View” clip grid with launch quantisation. · Butler, M. J. (2014). Playing with Something That Runs. · A simplified model with original patterns.',
 dur:11,hint:'Press Play, then press clips. Each one waits for the next bar. Press a playing clip to stop that track.',
 init:()=>({on:{drums:0,bass:null,lead:null},q:{drums:null,bass:null,lead:null},playing:false,pos:-1}),
 watch(p){const k=Math.floor(p*6);return {on:{drums:k>=4?2:k>=1?1:0,bass:k>=2?(k>=5?2:0):null,lead:k>=3?1:null},q:{drums:null,bass:null,lead:null},playing:false,pos:-1}},
 ui:[{b:'Play / stop',act:'play'},{b:'Stop all clips',act:'none'}],
 on:X8_loopOn(X8_CL,{clip(s,v){const [t,k]=String(v).split('.');const n=Number(k);if(!s.playing){s.on={...s.on,[t]:s.on[t]===n?null:n};return 'keep'}s.q={...s.q,[t]:s.on[t]===n?-1:n};return 'keep'},
  none(s){s.on={drums:null,bass:null,lead:null};s.q={drums:null,bass:null,lead:null};return 'keep'}}),
 draw(s,f,X){
  const pos=X8_pos(s,X,16,48),nq=X8_TR.filter(t=>s.q[t]!==null&&s.q[t]!==undefined).length,np=X8_TR.filter(t=>s.on[t]!==null&&s.on[t]!==undefined).length;
  let out=heading(nq?'Queued: waiting for the next bar':np?`${np} clip${np>1?'s':''} playing`:'Nothing playing: launch a clip');
  X8_TR.forEach((t,c)=>{const x=110+c*140,col=[C.blue,C.purple,C.green][c];out+=TBF(x+60,70,t[0].toUpperCase()+t.slice(1),14,col);
   X8_CLIPS[t].forEach((name,k)=>{const on=s.on[t]===k,q=s.q[t]===k,stopq=on&&s.q[t]===-1;
    out+=hit(X,'clip',t+'.'+k,`${t} clip ${name}: ${on?'playing':q?'queued':'stopped'}. Press to ${on?'stop':'launch'}.`,R(x,82+k*52,120,42,on?col:'#fff',q||stopq?C.amber:on?'none':C.grid,8,q||stopq?'stroke-dasharray="6 4"':'')+TF(x+60,108+k*52,name,13,on?'#fff':C.ink))})});
  for(let i=0;i<16;i++)out+=R(140+i*20,256,16,12,i===pos?C.amber:i%4===0?'#cfdce5':'#eef3f6','none',3);
  out+=TF(132,266,'bar',12,C.muted,'end');
  out+=counter(130,286,'playing',String(np),C.blue,100)+counter(250,286,'queued',String(nq),nq?C.amber:C.muted,100)+counter(370,286,'changes land on','beat 1',C.green,120);
  out+=T(300,360,X.try&&!s.playing?'Press Play, then launch clips.':'Dashed outline: queued for the next bar',14,C.muted);
  return {svg:out,phase:'Launch quantisation is the software doing the DJ’s phrasing for you: whatever moment you press, the change is held until a bar line. The performer’s job becomes choosing what, not exactly when.'};
 }});

SCENE({id:'tools-today-sidechain',name:'Sidechain pumping',tag:'The kick ducks everything else',
 definition:'Sidechain compression turns one sound down whenever another sound plays. In dance music the kick drum ducks the bass and pads, which makes room for the kick and gives the track a breathing, pumping feel.',
 example:'Each kick pulls a held chord down by most of its level; the chord swells back over about a fifth of a second, just in time to be ducked again.',
 desc:'A graph over one bar of the chord’s volume, dipping at each of four kicks and recovering, with controls for how deep the dip is and how fast it recovers.',
 research:'Snoman (2009), Dance Music Manual (compression and sidechaining). · The gain curve here is a simple exponential recovery, an illustration of what a compressor’s release does. · Associated in pop writing with late-1990s French house; techno uses it more for clarity than for effect.',
 dur:10,hint:'Set the depth and the recovery time, then press Hear to listen to two bars with and without the kick ducking the chord.',
 init:()=>({depth:70,rel:180}),
 watch(p){return {depth:Math.round(Math.min(1,p*1.5)*80/5)*5,rel:p<.66?180:Math.round((180+(p-.66)*500)/10)*10}},
 ui:[{range:'depth',label:'Depth',min:0,max:95,step:5,get:s=>s.depth,act:'depth',show:v=>v+'%'},{range:'rel',label:'Recovery',min:40,max:400,step:10,get:s=>s.rel,act:'rel',show:v=>v+' ms'},{b:'Hear two bars',act:'hear'}],
 on:{depth(s,v){s.depth=Number(v);return 'keep'},rel(s,v){s.rel=Number(v);return 'keep'},
  hear(s){AUDIO.stopAll();const b=60/128,d=s.depth/100,ch=[220,261.63,329.63];for(let k=0;k<8;k++){const t=k*b;X8_V.kick(t);
   if(d<1)AUDIO.chord(ch,{at:t,dur:b+.02,type:'sawtooth',gain:.08*(1-d),attack:.004,release:.02});
   if(d>0)AUDIO.chord(ch,{at:t,dur:b+.02,type:'sawtooth',gain:.08*d,attack:Math.min(b*.9,s.rel/1000*2.3),release:.02})}return 'keep'}},
 draw(s){
  const d=s.depth/100,b=60000/128,x0=80,w=460,y0=240,h=150,g=t=>1-d*Math.exp(-(t%b)/s.rel);
  let out=heading(d===0?'No ducking: kick and chord overlap':`Each kick ducks the chord by ${s.depth}%`);
  out+=R(x0,y0-h,w,h,'#fff',C.grid,4);let pth='';for(let k=0;k<=240;k++){const t=k/240*4*b*.9999;pth+=(k?'L':'M')+fmt(x0+k/240*w)+' '+fmt(y0-h*g(t))}
  out+=P(pth,C.green,2.6);
  for(let k=0;k<4;k++){const x=x0+k*w/4;out+=R(x,y0-26,10,26,C.blue,'none',3)+TF(x+5,y0+18,'kick '+(k+1),12,C.muted,k===0?'start':'middle')}
  out+=TF(x0-8,y0-h+5,'100%',12,C.muted,'end')+TF(x0-8,y0+4,'0',12,C.muted,'end')+TF(x0+w,y0-h-8,'chord volume across one bar',12,C.muted,'end');
  const back=s.rel*Math.log(d/.1||1),ok=d>0&&back<b;
  out+=counter(90,276,'lowest level',Math.round((1-d)*100)+'%',C.green,120)+counter(230,276,'back to 90% after',d>.1?Math.round(back)+' ms':'—',C.purple,150)+counter(400,276,'one beat lasts',Math.round(b)+' ms',C.blue,120);
  out+=T(300,356,d===0?'Raise the depth to hear the pump.':ok?'The chord recovers before the next kick.':'Slow recovery: the chord never fully returns.',15,ok||d===0?C.ink:C.coral);
  return {svg:out,phase:d===0?'Without ducking, the chord’s low frequencies sit on top of the kick and blur its attack.':ok?'The dip clears a space for each kick, and the swell back between kicks adds an off-beat pulse of its own. That swell is the “pump”.':'When the recovery is slower than the gap between kicks, the chord is held down all the time and only its level changes. Producers tune the recovery to the tempo.'};
 }});

/* ---------- groove-science ---------- */
const X8_GR=[
 {k:[0,4,8,12],c:[4,12],h:[0,2,4,6,8,10,12,14]},
 {k:[0,4,8,12],c:[4,12],h:[2,6,10,14]},
 {k:[0,4,8,11,12],c:[4,12],h:[2,6,7,10,14]},
 {k:[0,3,8,11],c:[4,7,12],h:[2,6,9,10,14,15]},
 {k:[0,3,5,10,13],c:[2,7,9,14],h:[1,4,6,11,12,15]}];
// A rough syncopation count: hits that fall off the beat and are not followed by a hit on the next beat.
const X8_sync=p=>{let n=0;for(const a of [p.k,p.c]){for(const i of a){if(i%4!==0){const nb=(Math.floor(i/4)+1)*4%16;if(!a.includes(nb))n+=i%2?2:1}}}return n};
const X8_WITEK=[.45,.72,1,.7,.38];
const X8_GS={ms:()=>60000/124/4,N:()=>16,step(s,i){const p=X8_GR[s.order[s.idx]];if(p.k.includes(i))X8_V.kick();if(p.c.includes(i))X8_V.clap();if(p.h.includes(i))X8_V.hat()}};
SCENE({id:'groove-science',name:'Why some rhythms make you move',tag:'You are the listener',
 definition:'“Groove” in research means the pleasurable urge to move to music. Experiments find that rhythms with a medium amount of syncopation produce the strongest urge: too regular is dull, too irregular is confusing.',
 example:'Witek and colleagues played 50 drum patterns to listeners online. Ratings of “wanting to move” rose with syncopation and then fell: an inverted U.',
 desc:'Five drum patterns of increasing syncopation that you rate from one to five for how much they make you want to move; your ratings are plotted against an inverted-U curve.',
 research:'Witek, M. A. G., Clarke, E. F., Wallentin, M., Kringelbach, M. L. & Vuust, P. (2014). Syncopation, body-movement and pleasure in groove music. PLoS ONE 9(4), e94446 (funk drum breaks, online ratings; the inverted U has been found again in later studies, e.g. Matthews et al. 2019). · The curve here is its shape only; your five ratings are not a replication.',
 dur:11,hint:'Press Play, rate the pattern, then press Next. The order is shuffled. Your ratings stay on this page. Watch shows a simulated listener.',
 init:()=>({order:shuffled([0,1,2,3,4],nextSeed()),idx:0,rate:{},playing:false,pos:-1}),
 watch(p){const sim=[2,3,5,3,2],n=Math.floor(p*6),rate={};for(let k=0;k<Math.min(5,n);k++)rate[k]=sim[k];return {order:[0,1,2,3,4],idx:Math.min(4,n),rate,playing:false,pos:-1,sim:true}},
 ui:[{b:'Play / stop',act:'play'},{choose:[[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5']],label:'Want to move? (1 no, 5 a lot)',get:s=>s.rate[s.order[s.idx]]||0,act:'rate'},{b:'Next pattern',act:'next'},{b:'Clear my ratings',act:'clear'}],
 on:X8_loopOn(X8_GS,{rate(s,v){s.rate={...s.rate,[s.order[s.idx]]:Number(v)};return 'keep'},next(s){s.idx=(s.idx+1)%5;return 'keep'},clear(s){s.rate={};s.idx=0;return 'keep'}}),
 draw(s,f,X){
  const lv=s.order[s.idx],p=X8_GR[lv],pos=X8_pos(s,X,16,0),n=Object.keys(s.rate).length;
  let out=heading(n>=5?'Your ratings against the inverted U':`Pattern ${s.idx+1} of 5: rate it`);
  [['Kick',p.k,C.blue],['Clap',p.c,C.coral],['Hat',p.h,C.amber]].forEach(([nm,a,col],r)=>{out+=TBF(72,82+r*30,nm,13,col,'end');for(let i=0;i<16;i++)out+=R(82+i*15,66+r*30,12,22,a.includes(i)?col:i%4===0?'#e6edf2':'#fff',i===pos?C.amber:a.includes(i)?'none':C.grid,3)});
  const x0=380,w=180,y0=150,h=92,fx=k=>x0+12+k*(w-24)/4,fy=v=>y0-h*v;
  out+=R(x0,y0-h-6,w,h+6,'#fff',C.grid,4)+P(X8_WITEK.map((v,k)=>(k?'L':'M')+fmt(fx(k))+' '+fmt(fy(v*.9))).join(''),C.green,2.2,'none','stroke-dasharray="5 4"');
  for(let k=0;k<5;k++)if(s.rate[k])out+=Ci(fx(k),fy((s.rate[k]-.5)/5),6,C.coral,'#fff');
  out+=Ci(fx(lv),y0+10,4,C.amber)+TF(x0,y0+26,'regular',12,C.muted,'start')+TF(x0+w,y0+26,'irregular',12,C.muted,'end')+TF(x0+w/2,y0-h-14,'want to move',12,C.muted);
  out+=L(100,196,124,196,C.green,2.2,'stroke-dasharray="5 4"')+TF(130,200,'published shape',12,C.muted,'start')+Ci(260,196,6,C.coral,'#fff')+TF(272,200,s.sim?'simulated listener':'your ratings',12,C.muted,'start');
  out+=counter(90,222,'rated',n+' of 5',C.blue,110)+counter(215,222,'this pattern',s.rate[lv]?String(s.rate[lv]):'not yet',C.coral,120)+counter(350,222,'off-beat score',String(X8_sync(p)),C.purple,130);
  out+=R(60,284,480,50,'#fff',C.grid,10)+X8_text(76,305,n>=5?'Does your highest rating sit in the middle? Five ratings from one person can easily miss it.':'Rate all five to see your own curve beside the published shape.',40);
  out+=T(300,362,'Techno’s four-on-the-floor sits at the regular end.',14,C.muted);
  return {svg:out,phase:s.sim?'The simulated listener prefers the middle pattern. Real listeners vary: musicians and dancers tend to tolerate more syncopation.':'One explanation is prediction: a little syncopation leaves gaps where the body “fills in” the beat, which feels good. With too much, the beat cannot be predicted at all. Techno keeps the kick regular and puts its syncopation in the hats, bass and filter.'};
 }});

const X8_EV=[
 ['cameron','A concert with hidden bass','Cameron et al. (2022) switched very-low-frequency speakers (8–37 Hz) on and off every 2.5 minutes at a live show. Dancers wearing motion sensors moved about 12% more with them on, and could not tell when that was.','one concert; not yet widely repeated'],
 ['hove','Timing is clearer in the bass','Hove et al. (2014) found that the brain detects a timing error more strongly in a low tone than in a high one, and that people tap more closely to low tones. It suggests why bass instruments carry the rhythm.','lab study with simple tones'],
 ['body','Bass you can feel','Very low frequencies are picked up by the skin and the balance organs as well as the ear. This is the proposed route for the concert result, and it is still a hypothesis.','proposed mechanism']];
SCENE({id:'groove-science-bass',name:'Bass and the body',tag:'Low frequencies move people',
 definition:'Dance music is bass-heavy for a reason researchers have begun to measure: low frequencies seem to drive movement and carry timing better than high ones.',
 example:'At one concert, switching on speakers that play frequencies too low to hear clearly made the audience dance about 12% more.',
 desc:'A row of dancers drawn as dots whose spread shows how much they move with the hidden bass speakers on or off, a bar for the measured increase, and cards for three pieces of evidence.',
 research:'Cameron, D. J. et al. (2022). Undetectable very-low frequency sound increases dancing at a live concert. Current Biology 32(21), R1222–R1223 (about 11.8% more movement). · Hove, M. J., Marie, C., Bruce, I. C. & Trainor, L. J. (2014). Superior time perception for lower musical pitch explains why bass-ranged instruments lay down musical rhythms. PNAS 111(28), 10383–10388.',
 dur:11,hint:'Switch the hidden bass on and off, and read the three evidence cards. The dots are an illustration; the 12% is the published average.',
 init:()=>({vlf:'on',e:'cameron'}),
 watch(p){return {vlf:Math.floor(p*6)%2?'on':'off',e:X8_EV[Math.min(2,Math.floor(p*3))][0]}},
 ui:[{choose:[['off','Bass speakers off'],['on','On']],label:'Hidden bass',get:s=>s.vlf,act:'vlf'},{choose:X8_EV.map(q=>[q[0],q[1]]),label:'Evidence',get:s=>s.e,act:'e'},{b:'Hear a low thump',act:'hear'}],
 on:{vlf(s,v){s.vlf=v;return 'keep'},e(s,v){s.e=v;return 'keep'},hear(){AUDIO.stopAll();for(let k=0;k<4;k++)AUDIO.kick({at:k*.48,from:90,to:38,decay:.4,gain:.3});return 'keep'}},
 draw(s){
  const on=s.vlf==='on',amp=on?1.118:1,e=X8_EV.find(q=>q[0]===s.e)||X8_EV[0],r=rng(77);let out=heading(on?'Hidden bass on: about 12% more movement':'Hidden bass off: the baseline');
  out+=R(50,54,330,96,'#fff',C.grid,10);for(let k=0;k<26;k++){const x=66+k*12,base=10+r()*16,a=base*amp;out+=L(x,102-a,x,102+a,on?C.coral:'#9db2bf',3)+Ci(x,102-a,3.5,on?C.coral:'#7f97a5')}
  out+=TF(215,166,'each line: how far one dancer moves (illustration)',12,C.muted);
  out+=R(400,54,150,96,'#fff',C.grid,10)+TF(475,74,'movement',12,C.muted)+R(420,84,110,14,'#dfe7ec','none',7)+TF(475,112,'off: 100%',12,C.muted)+R(420,120,110*amp/1.2+0,14,on?C.coral:'#dfe7ec','none',7)+TF(475,146,on?'on: about 112%':'on: —',12,on?C.coral:C.muted);
  out+=X8_card(176,166,e[1],'Strength: '+e[3],e[2],e[0]==='body'?C.amber:C.green);
  out+=T(300,364,'Suggestive evidence, not settled science',14,C.muted);
  return {svg:out,phase:e[0]==='cameron'?'The striking part is that the audience could not detect the extra bass, so the effect is not a matter of taste or expectation. It is still a single event with one audience.':e[0]==='hove'?'This is a finding about hearing and timing, measured with EEG and tapping. It fits the fact that in many traditions the lowest instruments keep time.':'A plausible story, with physiology behind it, but the direct evidence in dancers is thin. Treat it as a hypothesis.'};
 }});

const X8_RANGES=[['House',118,128,C.green],['Techno',125,140,C.blue],['Hard techno',140,160,C.coral]];
SCENE({id:'groove-science-tempo',name:'Tap your tempo',tag:'Where 120–130 comes from',
 definition:'People asked to tap at a comfortable speed, and large collections of dance music, both cluster around 120 to 130 beats per minute, roughly two per second. Techno sits on and just above that range.',
 example:'Tap steadily at whatever speed feels natural for dancing. Many people land within a few BPM of 125.',
 desc:'A tempo axis from 80 to 180 BPM with a shaded band for the most common tempo, bars for typical house, techno and hard-techno ranges, and a marker for the tempo you tap.',
 research:'Moelants, D. (2002). Preferred tempo reconsidered. Proceedings of ICMPC 7 (a peak near 120–130 BPM in tapping and in music collections). · van Noorden, L. & Moelants, D. (1999). Resonance in the perception of musical pulse. Journal of New Music Research 28(1). · Genre ranges are typical values, approximate. Links to Mind In Motion and Music In Motion on entrainment.',
 dur:10,hint:'Press Tap at least four times at a speed that feels right for dancing. Timing is taken from your presses and stays on this page. Watch shows a simulated tapper.',
 init:()=>({taps:[]}),
 watch(p){const n=Math.floor(p*9),taps=[];for(let k=0;k<n;k++)taps.push(k*.476+(k%3-1)*.012);return {taps,sim:true}},
 ui:[{b:'Tap',act:'tap'},{b:'Hear my tempo',act:'hear'},{b:'Clear',act:'clear'}],
 on:{tap(s){const t=X8_now(),last=s.taps[s.taps.length-1];s.taps=(last!==undefined&&t-last>2.5?[]:s.taps).concat([t]).slice(-9);AUDIO.hit({dur:.03,gain:.05,cutoff:5000});return 'keep'},
  clear(s){s.taps=[];return 'keep'},
  hear(s){const iv=[];for(let k=1;k<s.taps.length;k++)iv.push(s.taps[k]-s.taps[k-1]);if(iv.length<3)return 'keep';const m=sum(iv)/iv.length;AUDIO.stopAll();for(let k=0;k<8;k++)X8_V.kick(k*m);return 'keep'}},
 draw(s){
  const iv=[];for(let k=1;k<s.taps.length;k++)iv.push(s.taps[k]-s.taps[k-1]);const ok=iv.length>=3,m=ok?sum(iv)/iv.length:0,bpm=ok?60/m:0,sd=ok?Math.sqrt(sum(iv.map(v=>(v-m)**2))/iv.length)*1000:0;
  let out=heading(ok?`You tapped ${bpm.toFixed(0)} BPM`:`Tap a steady beat: ${Math.max(0,4-s.taps.length)} more`);
  const x0=70,w=470,fx=v=>x0+(clamp(v,80,180)-80)/100*w;
  out+=R(fx(120),64,fx(130)-fx(120),150,C.greenp,'none',0)+TF(fx(125),58,'most common',12,C.green);
  X8_RANGES.forEach(([n,a,b,col],k)=>{out+=R(fx(a),82+k*40,fx(b)-fx(a),24,col,'none',6)+TF(fx(b)+8,99+k*40,`${n} ${a}–${b}`,12,C.muted,'start')});
  out+=L(x0,214,x0+w,214,C.line,1.5);for(const v of [80,100,120,140,160,180])out+=L(fx(v),214,fx(v),219,C.line,1.2)+TF(fx(v),234,v===180?'180 BPM':String(v),12,C.muted);
  if(ok)out+=L(fx(bpm),64,fx(bpm),214,C.amber,2.5)+Ci(fx(bpm),214,7,C.amber,'#fff');
  out+=counter(80,254,s.sim?'simulated tapper':'your tempo',ok?bpm.toFixed(1)+' BPM':'—',C.amber,150)+counter(245,254,'time between taps',ok?Math.round(m*1000)+' ms':'—',C.blue,150)+counter(410,254,'steadiness (SD)',ok?Math.round(sd)+' ms':'—',C.purple,130);
  const where=!ok?'':bpm<118?'slower than most house and techno':bpm<=130?'inside the most common band':bpm<=140?'in techno’s usual range':'in hard-techno territory';
  out+=T(300,346,ok?'Your tempo is '+where+'.':'Typical ranges are approximate.',15,C.ink);
  return {svg:out,phase:ok?'A comfortable tapping speed of about two per second is close to walking pace, which is one proposed reason for the peak. Faster styles deliberately push above it for intensity.':'Why 120–130? One idea is that the body’s movements have a natural resonance near 2 Hz, the rate of a brisk walk. The evidence is suggestive; culture and DJ convention also keep tempos close together so records can be mixed.'};
 }});
