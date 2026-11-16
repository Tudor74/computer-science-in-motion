/* ===================== Senses era 7 · Touch ===================== */
// Skin receptors, acuity, vibration, pain, temperature and the body's sense of its own position.
// Every picture is a pure function of state and X. Sound plays only from on() handlers; the one phone-buzz
// button calls navigator.vibrate only from an on() handler and only when the device supports it.
// Simulated data come from seeded generators (S7_rng) and are labelled simulated or illustrative.
const S7_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const S7_rng=n=>rng(S7_mix(n));
function S7_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const S7_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
// Plot frame: returns {svg, X, Y}.
function S7_plot(x0,y0,w,h,xr,yr,o={}){
 const lx=!!o.logx,ly=!!o.logy,f=(v,l)=>l?Math.log10(v):v;
 const X=v=>x0+(f(v,lx)-f(xr[0],lx))/(f(xr[1],lx)-f(xr[0],lx))*w,Y=v=>y0+h-(f(v,ly)-f(yr[0],ly))/(f(yr[1],ly)-f(yr[0],ly))*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||33),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-7,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// A strip of spikes at times (ms) across a span.
function S7_raster(times,x0,y0,w,h,span,col=C.ink){let out=R(x0,y0,w,h,'#fff',C.grid,4);times.forEach(t=>{if(t>=0&&t<=span){const x=x0+t/span*w;out+=L(x,y0+4,x,y0+h-4,col,1.6)}});return out}
// Spike times from a rate function rate(t ms) in Hz, deterministic integrate-and-fire.
function S7_spikes(rate,span,dt=1){const out=[];let acc=.37;for(let t=0;t<=span;t+=dt){acc+=Math.max(0,rate(t))*dt/1000;if(acc>=1){out.push(t);acc-=1}}return out}
function S7_clicks(times){times.slice(0,120).forEach(t=>AUDIO.noise({dur:.005,gain:.18,at:t}))}
const S7_status=(x,y,word,col)=>R(x-4,y-15,7.6*word.length+14,21,'#fff',col,6)+TBF(x+2,y,word,12,col,'start');

/* =========================== skin-receptors =========================== */
const S7_REC={
 meissner:{name:'Meissner corpuscle',short:'Meissner',col:'#2c776c',depth:1,adapt:'fast',field:'small',codes:'flutter, slip, light stroking',share:'about 43%',unit:'FA I'},
 merkel:{name:'Merkel disc',short:'Merkel',col:'#1772b7',depth:0,adapt:'slow',field:'small',codes:'pressure, edges, shape, Braille dots',share:'about 25%',unit:'SA I'},
 pacinian:{name:'Pacinian corpuscle',short:'Pacinian',col:'#c45238',depth:3,adapt:'fast',field:'large',codes:'vibration, tool use, distant taps',share:'about 13%',unit:'FA II'},
 ruffini:{name:'Ruffini ending',short:'Ruffini',col:'#7156a6',depth:2,adapt:'slow',field:'large',codes:'skin stretch, finger position',share:'about 19%',unit:'SA II'}
};
const S7_RKEYS=['meissner','merkel','pacinian','ruffini'];
const S7_STIM=[['press','Steady press'],['flutter','Flutter 30 Hz'],['vibe','Vibration 250 Hz'],['stretch','Stretch']];
// Response 0–3 of each receptor type to each stimulus (schematic, after Johnson 2001).
const S7_RESP={press:{merkel:3,ruffini:1,meissner:1,pacinian:1},flutter:{meissner:3,merkel:1,pacinian:1,ruffini:0},vibe:{pacinian:3,meissner:1,merkel:0,ruffini:0},stretch:{ruffini:3,merkel:1,meissner:0,pacinian:0}};
const S7_RWORD=['silent','weak','on and off only','strong'];
function S7_respWord(stim,k){const v=S7_RESP[stim][k];if(v===1&&(k==='meissner'||k==='pacinian')&&stim==='press')return 'only at on and off';return ['silent','weak','','strong'][v]}
function S7_drawReceptor(k,x,y,sel){
 const c=S7_REC[k].col,w=sel?3:2;
 if(k==='meissner')return `<ellipse cx="${x}" cy="${y}" rx="9" ry="14" fill="#fff" stroke="${c}" stroke-width="${w}"/>`+L(x-6,y-6,x+6,y-6,c,1.2)+L(x-7,y,x+7,y,c,1.2)+L(x-6,y+6,x+6,y+6,c,1.2);
 if(k==='merkel')return Ci(x,y,6,c,'#fff')+L(x,y+6,x,y+20,c,1.6);
 if(k==='pacinian'){let o='';for(let r=22;r>=4;r-=6)o+=`<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r*.7}" fill="${r===22?'#fff':'none'}" stroke="${c}" stroke-width="${r===22?w:1.2}"/>`;return o}
 return `<ellipse cx="${x}" cy="${y}" rx="22" ry="7" fill="#fff" stroke="${c}" stroke-width="${w}"/>`+L(x-16,y,x+16,y,c,1.2)+L(x-12,y-3,x+12,y+3,c,1);
}
const S7_RPOS={merkel:[118,128],meissner:[176,148],ruffini:[134,224],pacinian:[196,286]};
SCENE({id:'skin-receptors',name:'Four kinds of touch receptor',tag:'Each one listens for something different',
 definition:'Hairless skin, such as the fingertip, has four kinds of mechanoreceptor. Two adapt slowly and keep firing during a steady touch; two adapt fast and fire only when something changes. Two have small receptive fields near the surface; two have large fields deeper down.',
 example:'Holding a pen, Merkel discs report the steady pressure and the edge of the barrel, Meissner corpuscles catch it starting to slip, and Pacinian corpuscles pick up the vibration as the nib scratches the paper.',
 desc:'A cross-section of fingertip skin with the four receptors at their depths, a stimulus choice, and a table of which receptors respond to it.',
 research:['Johansson, R. S. & Vallbo, Å. B. (1979). Tactile sensibility in the human hand: relative and absolute densities of four types of mechanoreceptive units in glabrous skin. Journal of Physiology 286, 283–300.','Meissner (1853), Merkel (1875), Pacini (1840) and Ruffini (1894) described the end organs. Johnson, K. O. (2001). The roles and functions of cutaneous mechanoreceptors. Current Opinion in Neurobiology 11, 455–461. Whether Ruffini endings exist in the human fingertip is debated (Paré et al. 2003).'],
 dur:12,hint:'Press a receptor to read about it, then change the stimulus and see which ones answer.',
 init:()=>({sel:'merkel',stim:'press'}),
 watch(p){const i=Math.min(3,Math.floor(p*4));return {sel:S7_RKEYS[[1,0,2,3][i]],stim:['press','flutter','vibe','stretch'][i]}},
 ui:[{choose:S7_STIM,label:'Stimulus',get:s=>s.stim,act:'stim'},{choose:S7_RKEYS.map(k=>[k,S7_REC[k].short]),label:'Receptor',get:s=>s.sel,act:'sel'}],
 on:{stim(s,v){s.stim=v;return 'keep'},sel(s,v){s.sel=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('Four receptors, four jobs');
  // Skin cross-section.
  out+=R(40,96,240,10,'#f1d9c9','none',2)+P('M40 106 Q60 96 80 106 T120 106 T160 106 T200 106 T240 106 T280 106 L280 170 L40 170 Z','none',1,'#f8e6d8')+R(40,170,240,90,'#fbeee4','none',0)+R(40,260,240,62,'#fff6cf','none',0);
  out+=TF(46,90,'epidermis',13,C.muted,'start')+TF(46,190,'dermis',13,C.muted,'start')+TF(46,316,'fat (hypodermis)',13,C.muted,'start');
  out+=arrow(160,62,160,92,C.amber,2.5)+TF(166,70,{press:'press',flutter:'flutter',vibe:'buzz',stretch:'stretch'}[s.stim],13,C.amber,'start');
  for(const k of S7_RKEYS){const [x,y]=S7_RPOS[k],sel=s.sel===k,r=S7_RESP[s.stim][k];
   let g=S7_drawReceptor(k,x,y,sel);if(r>=2)g+=Ci(x,y,26,'none',S7_REC[k].col,'stroke-dasharray="3 3" opacity=".8"');
   out+=hit(X,'sel',k,`${S7_REC[k].name}. Press to select.`,g)}
  // Table.
  out+=TBF(310,78,'Responds to “'+S7_STIM.find(z=>z[0]===s.stim)[1].toLowerCase()+'”',14,C.ink,'start');
  S7_RKEYS.forEach((k,i)=>{const y=104+i*30,r=S7_RESP[s.stim][k],sel=s.sel===k;
   out+=R(306,y-18,276,26,sel?C.pale:'#f6f9fb',sel?S7_REC[k].col:'none',6)+Ci(318,y-5,6,S7_REC[k].col)+TF(330,y,S7_REC[k].short,13,C.ink,'start');
   for(let b=0;b<3;b++)out+=R(430+b*14,y-12,11,14,b<r?S7_REC[k].col:'#e5edf2','none',2);
   out+=TF(476,y,S7_respWord(s.stim,k),13,r>=2?C.ink:C.muted,'start')});
  const R0=S7_REC[s.sel];
  out+=R(306,226,276,96,'#fff',R0.col,8)+TBF(316,248,R0.name+' ('+R0.unit+')',14,R0.col,'start');
  out+=TF(316,270,`adapts ${R0.adapt} · ${R0.field} field`,13,C.ink,'start')+TF(316,290,'codes: '+R0.codes,13,C.ink,'start')+TF(316,310,'share of hand units: '+R0.share,13,C.muted,'start');
  out+=T(300,356,'Slow pairs report what is there; fast pairs report what changes.',15,C.ink);
  const strong=S7_RKEYS.filter(k=>S7_RESP[s.stim][k]===3).map(k=>S7_REC[k].short);
  return {svg:out,phase:`A ${S7_STIM.find(z=>z[0]===s.stim)[1].toLowerCase()} drives the ${strong.join(' and ')} most. ${R0.name}s adapt ${R0.adapt} and have ${R0.field} receptive fields; they make up ${R0.share} of the roughly 17,000 touch units in the hairless skin of one hand (Johansson & Vallbo 1979). Response strengths are schematic.`};
 },
 three(s,f,X,project){
  const Pj=project([0,4,0,3,-3,.4]);let faces=[];
  faces=faces.concat(prism(0,0,-.35,4,3,.35,'#e6b9a0'),prism(0,0,-1.9,4,3,1.55,'#f6dccb'),prism(0,0,-3,4,3,1.1,'#f6e7a8'));
  let out=paintFaces(faces,Pj);
  const items=[];
  const pos={merkel:[[1,1,-.38],[1.6,1.8,-.38],[2.3,1.2,-.38],[3,2,-.38]],meissner:[[1.3,1.5,-.6],[2,.8,-.6],[2.8,1.6,-.6],[3.3,.9,-.6]],ruffini:[[1.2,2.2,-1.3],[2.6,2.4,-1.4]],pacinian:[[1.7,1.2,-2.5],[3,1.6,-2.4]]};
  const rad={merkel:4,meissner:5,ruffini:6,pacinian:10};
  for(const k of S7_RKEYS)for(const at of pos[k])items.push({at,svg:Pp=>{const p=Pp(at);return Ci(p[0],p[1],rad[k]*(s.sel===k?1.4:1),S7_REC[k].col,'#fff')}});
  out+=sortedItems(items,Pj);
  const lab=(at,t,c)=>{const p=Pj(at);return TBF(p[0],p[1],t,13,c)};
  out+=lab([4.3,3,-.1],'epidermis',C.muted)+lab([4.3,3,-1.1],'dermis',C.muted)+lab([4.3,3,-2.4],'fat',C.muted);
  return {svg:out,title:'A block of fingertip skin',caption:`Merkel discs (blue) sit at the base of the epidermis, Meissner corpuscles (green) just below in the dermal ridges, Ruffini endings (purple) mid-dermis and Pacinian corpuscles (red) deep in the fat. The selected type is drawn larger. Depths are schematic.`};
 }});

// Adaptation: firing rates over a press of given force (1–10) held for hold seconds (starting at 200 ms).
function S7_adaptRate(type,t,force,holdMs){const on=200,off=on+holdMs,F=force/10;
 if(type==='sa'){if(t<on||t>off)return 0;return F*(60+90*Math.exp(-(t-on)/250))}
 if(type==='ra'){const a=t>=on&&t<on+90?F*220*(1-(t-on)/90):0,b=t>=off&&t<off+70?F*160*(1-(t-off)/70):0;return a+b}
 const a=t>=on&&t<on+12?900*Math.min(1,F*1.5):0,b=t>=off&&t<off+10?700*Math.min(1,F*1.5):0;return a+b}
SCENE({id:'skin-receptors-adaptation',name:'Slow and fast adaptation',tag:'Steady news against change',
 definition:'A slowly adapting receptor keeps firing for as long as a touch lasts. A rapidly adapting receptor fires a burst when the touch starts and again when it stops, then falls silent.',
 example:'You stop noticing your watch on your wrist within minutes: the fast receptors have gone quiet and the slow ones report a steady, unchanging signal that the brain learns to ignore.',
 desc:'A press of adjustable force and duration, with spike trains from a slowly adapting (Merkel) unit, a rapidly adapting (Meissner) unit and a Pacinian unit.',
 research:['Adrian, E. D. & Zotterman, Y. (1926). The impulses produced by sensory nerve endings, Part 3. Journal of Physiology 61, 465–483.','Johansson, R. S. & Vallbo, Å. B. (1983). Tactile sensory coding in the glabrous skin of the human hand. Trends in Neurosciences 6, 27–32. Spike trains here are a schematic model.'],
 dur:10,hint:'Change the force and how long the press lasts. Hear each unit fire as clicks.',
 init:()=>({force:6,hold:1.4}),
 watch(p){return {force:Math.round(3+7*p),hold:Math.round((.6+1.6*p)*10)/10}},
 ui:[{range:'force',label:'Force',min:1,max:10,step:1,get:s=>s.force,act:'force'},{range:'hold',label:'Hold',min:.4,max:2.4,step:.1,get:s=>s.hold,act:'hold',show:v=>Number(v).toFixed(1)+' s'},{b:'Hear slow (Merkel)',act:'hearsa'},{b:'Hear fast (Meissner)',act:'hearra'}],
 on:{force(s,v){s.force=Number(v);return 'keep'},hold(s,v){s.hold=Number(v);return 'keep'},
  hearsa(s){S7_clicks(S7_spikes(t=>S7_adaptRate('sa',t,s.force,s.hold*1000),3000).map(t=>t/1000));return 'keep'},
  hearra(s){S7_clicks(S7_spikes(t=>S7_adaptRate('ra',t,s.force,s.hold*1000),3000).map(t=>t/1000));return 'keep'}},
 draw(s){
  const span=3000,hold=s.hold*1000;let out=heading('Who keeps talking during a steady press?');
  const x0=150,w=420;
  out+=TF(x0-10,84,'press',13,C.amber,'end')+P(`M${x0} 92 L${x0+200/span*w} 92 L${x0+260/span*w} ${92-s.force*3.6} L${x0+(200+hold)/span*w} ${92-s.force*3.6} L${x0+(260+hold)/span*w} 92 L${x0+w} 92`,C.amber,2.6);
  const rows=[['sa','Merkel (slow)',C.blue],['ra','Meissner (fast)','#2c776c'],['pc','Pacinian (fast)',C.coral]];
  rows.forEach(([k,lab,col],i)=>{const y=118+i*66,sp=S7_spikes(t=>S7_adaptRate(k,t,s.force,hold),span);
   out+=TF(x0-10,y+28,lab,13,col,'end')+S7_raster(sp,x0,y,w,44,span,col)+TF(x0+w+6,y+28,sp.length,13,C.muted,'start')});
  out+=TF(x0,330,'0',13,C.muted,'start')+TF(x0+w,330,'3 s',13,C.muted,'end')+TF(x0+w+6,108,'spikes',13,C.muted,'start');
  out+=T(300,358,'Slow units code how hard and how long; fast units code when it changes.',15,C.ink);
  const nsa=S7_spikes(t=>S7_adaptRate('sa',t,s.force,hold),span).length;
  return {svg:out,phase:`A force-${s.force} press held for ${s.hold.toFixed(1)} s: the Merkel unit fires all the way through (${nsa} spikes), its rate rising with force. The Meissner unit fires only at the start and end, and the Pacinian unit gives just a spike or two at each change. Schematic model.`};
 }});

// Densities (units per cm²), approximate, after Johansson & Vallbo (1979).
const S7_DENS={fingertip:{meissner:140,merkel:70,pacinian:22,ruffini:9},palm:{meissner:25,merkel:8,pacinian:9,ruffini:16}};
SCENE({id:'skin-receptors-density',name:'Receptor density',tag:'Why fingertips are special',
 definition:'Receptor density is how many touch units serve each square centimetre of skin. In the hand it is highest at the fingertips, mostly because the small-field Meissner and Merkel units are packed there.',
 example:'Microneurography (recording single nerve fibres through a fine needle in awake volunteers) found about 140 fast small-field units per cm² at the fingertip against about 25 in the palm.',
 desc:'A one-centimetre square of skin filled with dots for each receptor type, with bars of units per cm² for the fingertip and the palm.',
 research:['Johansson, R. S. & Vallbo, Å. B. (1979). Tactile sensibility in the human hand: relative and absolute densities of four types of mechanoreceptive units in glabrous skin. Journal of Physiology 286, 283–300. Values here are rounded readings, labelled approximate.','Vallbo, Å. B. & Hagbarth, K.-E. (1968). Activity from skin mechanoreceptors recorded percutaneously in awake human subjects. Experimental Neurology 21, 270–289.'],
 dur:8,hint:'Switch between fingertip and palm and compare the squares.',
 init:()=>({site:'fingertip'}),
 watch(p){return {site:p<.5?'fingertip':'palm'}},
 ui:[{choose:[['fingertip','Fingertip'],['palm','Palm']],label:'Skin',get:s=>s.site,act:'site'}],
 on:{site(s,v){s.site=v;return 'keep'}},
 draw(s){
  const d=S7_DENS[s.site];let out=heading('Touch units in one square centimetre');
  out+=R(40,70,250,250,'#fbf3ee',C.grid,4)+TF(165,336,`1 cm × 1 cm of ${s.site} skin`,13,C.muted);
  let seed=1;for(const k of S7_RKEYS){const r=S7_rng(seed++*97+(s.site==='palm'?5:0));for(let i=0;i<d[k];i++)out+=Ci(48+r()*234,78+r()*234,k==='pacinian'?4.5:3,S7_REC[k].col,'none','opacity=".8"')}
  const pl=S7_plot(360,80,210,200,[0,4],[0,150],{yt:[[0,'0'],[50,'50'],[100,'100'],[150,'150']],yl:'units per cm²'});out+=pl.svg;
  S7_RKEYS.forEach((k,i)=>{const x=pl.X(i+.5);out+=R(x-14,pl.Y(S7_DENS.fingertip[k]),12,pl.Y(0)-pl.Y(S7_DENS.fingertip[k]),s.site==='fingertip'?S7_REC[k].col:'#d3e0e8','none',2)+R(x+2,pl.Y(S7_DENS.palm[k]),12,pl.Y(0)-pl.Y(S7_DENS.palm[k]),s.site==='palm'?S7_REC[k].col:'#d3e0e8','none',2)+TF(x,pl.Y(0)+17,S7_REC[k].short.slice(0,4),12,C.muted)});
  out+=TF(465,320,'left bar fingertip · right bar palm',12,C.muted);
  const tot=S7_RKEYS.reduce((a,k)=>a+d[k],0);
  out+=T(300,360,`${tot} units per cm² at the ${s.site} (approximate)`,15,C.ink);
  return {svg:out,phase:s.site==='fingertip'?`The fingertip packs about ${tot} units into each square centimetre, mostly small-field Meissner (green) and Merkel (blue) units. That density is one reason a fingertip can read Braille. Values are approximate, after Johansson & Vallbo (1979).`:`The palm has about ${tot} units per square centimetre: far fewer small-field units, so finer detail is lost, while the large-field Pacinian and Ruffini units are spread more evenly. Approximate values.`};
 }});

/* =========================== touch-acuity =========================== */
// Two-point thresholds (mm), approximate readings after Weinstein (1968).
const S7_SITES=[['fingertip','Fingertip',2.5],['lip','Upper lip',5.5],['cheek','Cheek',7],['palm','Palm',10],['forehead','Forehead',15],['forearm','Forearm',35],['back','Back',40],['calf','Calf',47]];
const S7_simTP=k=>{const i=S7_SITES.findIndex(z=>z[0]===k),r=S7_rng(300+i);return Math.max(1,Math.round(S7_SITES[i][2]*(.8+.4*r())))};
SCENE({id:'touch-acuity',name:'Your two-point map',tag:'Test yourself with a paperclip',
 definition:'The two-point threshold is the smallest gap between two touching points that a person can feel as two rather than one. It is far smaller on the fingertips and lips than on the back or calf.',
 example:'Bend a paperclip so its two tips are 10 mm apart. On your fingertip you feel two clear points; on your forearm the same clip usually feels like one.',
 desc:'Bars of published two-point thresholds for eight body sites on a log scale, with the values you record drawn as dots beside them.',
 research:['Weinstein, S. (1968). Intensive and extensive aspects of tactile sensitivity as a function of body part, sex and laterality. In D. R. Kenshalo (ed.), The Skin Senses, 195–222. Thomas. Bar values here are approximate readings.','Weber, E. H. (1834). De Tactu, who first mapped the “sensory circles” of the skin with a compass.'],
 dur:10,hint:'Ask someone to touch you with one or two paperclip tips at random, find the smallest gap you call “two”, then record it. Your answers stay on this page.',
 init:()=>({site:'fingertip',mm:5,mine:{}}),
 watch(p){const n=Math.min(8,Math.floor(p*9));const mine={};S7_SITES.slice(0,n).forEach(([k])=>mine[k]=S7_simTP(k));return {site:S7_SITES[Math.max(0,n-1)][0],mm:n?mine[S7_SITES[n-1][0]]:5,mine,sim:true}},
 ui:[{choose:S7_SITES.map(z=>[z[0],z[1]]),label:'Site',get:s=>s.site,act:'site'},{range:'mm',label:'Smallest gap felt as two',min:1,max:60,step:1,get:s=>s.mm,act:'mm',show:v=>v+' mm'},{b:'Record',act:'rec'},{b:'Clear my data',act:'clear'}],
 on:{site(s,v){s.site=v;if(s.mine[v])s.mm=s.mine[v];return 'keep'},mm(s,v){s.mm=Number(v);return 'keep'},rec(s){s.mine[s.site]=s.mm;return 'keep'},clear(s){s.mine={};return 'keep'}},
 draw(s,f,X){
  let out=heading('Two-point thresholds across the body');
  const pl=S7_plot(130,60,430,250,[1,60],[0,8],{logx:true,xt:[[1,'1'],[2,'2'],[5,'5'],[10,'10'],[20,'20'],[50,'50 mm']],xl:'two-point threshold (mm, log scale)',xlDy:34});out+=pl.svg;
  S7_SITES.forEach(([k,lab,v],i)=>{const y=pl.Y(7.5-i),sel=s.site===k;
   out+=TF(122,y+5,lab,13,sel?C.ink:C.muted,'end')+R(pl.X(1),y-9,pl.X(v)-pl.X(1),18,sel?'#b9d4e6':'#dde8ef','none',3);
   if(s.mine[k])out+=Ci(pl.X(Math.min(60,s.mine[k])),y,7,C.coral,'#fff')});
  if(!s.sim&&X&&X.try)out+=L(pl.X(s.mm),pl.Y(8),pl.X(s.mm),pl.Y(0),C.amber,1.6,'stroke-dasharray="4 4"');
  out+=R(366,72,12,12,'#b9d4e6','none',2)+TF(384,83,'published (approx.)',13,C.muted,'start')+Ci(372,102,6,C.coral,'#fff')+TF(384,107,s.sim?'simulated':'your values',13,C.muted,'start');
  const n=Object.keys(s.mine).length;
  out+=T(300,372,n?`${n} of 8 sites recorded`:'Record a site to add your own dot.',15,C.ink);
  return {svg:out,phase:s.sim?'A simulated participant’s values land near the published bars: a few millimetres on the fingertip and lips, several centimetres on the back and calf. Watch shows simulated data.':n?`You recorded ${n} site${n>1?'s':''}. Compare your dots with the bars: home measurements are rough, because the two tips must touch at the same moment with the same pressure. Nothing leaves this page.`:'Pick a site, find your smallest “two” gap with a paperclip, set the slider and press Record. This is a rough home test, not a clinical measurement.'};
 }});

const S7_FIELD={fingertip:1.6,palm:4.5,forearm:14};
function S7_profile(x,gap,sig){const g=d=>Math.exp(-d*d/(2*sig*sig));return g(x-gap/2)+g(x+gap/2)}
function S7_isTwo(gap,sig){const mid=S7_profile(0,gap,sig),peak=S7_profile(gap/2,gap,sig);return gap>0&&peak>0&&mid<peak*.9}
SCENE({id:'touch-acuity-twopoint',name:'Why fields set the limit',tag:'Two bumps or one',
 definition:'Each point on the skin excites a patch of receptors around it. Two points are felt as two only when the activity they cause shows two peaks with a dip between them, which needs a gap at least about as wide as the receptive fields.',
 example:'With fingertip fields about 1.6 mm wide, two tips 4 mm apart make two clear bumps of activity. On the forearm, with fields around 14 mm wide, the same two bumps merge into one hill.',
 desc:'Two probes on a strip of skin, the receptive fields beneath them, and the summed activity profile with its central dip measured.',
 research:['Johnson, K. O. & Phillips, J. R. (1981). Tactile spatial resolution I: two-point discrimination, gap detection, grating resolution and letter recognition. Journal of Neurophysiology 46, 1177–1192.','Vallbo, Å. B. & Johansson, R. S. (1984). Properties of cutaneous mechanoreceptors in the human hand related to touch sensation. Human Neurobiology 3, 3–14. Field widths here are illustrative.'],
 dur:10,hint:'Move the probes apart and switch skin sites. Watch for the moment the two bumps separate.',
 init:()=>({site:'fingertip',gap:3}),
 watch(p){return {site:p<.5?'fingertip':'forearm',gap:p<.5?Math.round(1+10*p*2)/1:Math.round(4+56*(p-.5)*2)}},
 ui:[{choose:[['fingertip','Fingertip'],['palm','Palm'],['forearm','Forearm']],label:'Skin',get:s=>s.site,act:'site'},{range:'gap',label:'Gap',min:0,max:60,step:1,get:s=>s.gap,act:'gap',show:v=>v+' mm'}],
 on:{site(s,v){s.site=v;return 'keep'},gap(s,v){s.gap=Number(v);return 'keep'}},
 draw(s){
  const sig=S7_FIELD[s.site],span=Math.max(20,s.gap+6*sig),sc=500/span,cx=300,two=S7_isTwo(s.gap,sig);let out=heading('Two points make two bumps, or one hill');
  out+=R(50,120,500,26,'#f8e6d8','none',4)+TF(50,112,s.site+' skin',13,C.muted,'start');
  for(const sgn of [-1,1]){const x=cx+sgn*s.gap/2*sc;out+=L(x,64,x,116,C.ink,2.5)+Ci(x,118,3,C.ink)}
  // Receptive fields as small arcs.
  const step=Math.max(sig,span/30);for(let u=-span/2;u<=span/2;u+=step)out+=P(`M${fmt(cx+(u-sig)*sc)} 152 Q${fmt(cx+u*sc)} 168 ${fmt(cx+(u+sig)*sc)} 152`,'#9fb8c8',1.2);
  const pl=S7_plot(50,190,500,120,[-span/2,span/2],[0,2.1],{yl:'activity across the skin'});out+=pl.svg;
  const pts=[];for(let k=0;k<=200;k++){const x=-span/2+k*span/200;pts.push([pl.X(x),pl.Y(S7_profile(x,s.gap,sig))])}out+=S7_poly(pts,two?C.green:C.coral,2.6);
  const mid=S7_profile(0,s.gap,sig),pk=Math.max(mid,S7_profile(s.gap/2,s.gap,sig));
  out+=T(300,344,two?`Two bumps: the dip is ${Math.round((1-mid/pk)*100)}% below the peaks, so you feel two.`:'One hill: no dip, so you feel one point.',15,two?C.green:C.coral);
  out+=TF(550,184,`field ≈ ${sig} mm`,13,C.muted,'end');
  return {svg:out,phase:`At ${s.gap} mm on the ${s.site}, with fields about ${sig} mm wide, the summed activity ${two?'has a dip in the middle: two points':'is a single hill: one point'}. Wider fields need wider gaps, which is why thresholds rise from fingertip to forearm. A simplified model.`};
 }});

// Psychometric curves: two-point "two" responses vs grating orientation % correct (fingertip, simulated).
const S7_tpCurve=g=>.25+.75/(1+Math.exp(-(g-2.5)/.5));
const S7_gotCurve=w=>.5+.5*(1-Math.exp(-Math.pow(w/1.1,3)));
SCENE({id:'touch-acuity-grating',name:'A better test',tag:'Grating orientation',
 definition:'The classic two-point test is easily fooled: people say “two” even when only one point touches, using pressure and other cues. Grating orientation, telling whether a ridged dome is pressed along or across the finger, measures spatial resolution more honestly.',
 example:'On the fingertip, people correctly name a grating’s orientation 75% of the time when the ridges are about 1 mm wide, finer than most two-point thresholds suggest.',
 desc:'Response curves for the two-point test and the grating orientation test against gap or ridge width, with catch trials marked, for a simulated fingertip.',
 research:['Craig, J. C. & Johnson, K. O. (2000). The two-point threshold: not a measure of tactile spatial resolution. Current Directions in Psychological Science 9, 29–32.','Van Boven, R. W. & Johnson, K. O. (1994). The limit of tactile spatial resolution in humans. Neurology 44, 2361–2366. Curves here are simulated shapes.'],
 dur:10,hint:'Switch tests and move the gap or ridge width. Look at what happens at zero gap.',
 init:()=>({test:'two',w:2}),
 watch(p){return {test:p<.5?'two':'grating',w:Math.round((p<.5?p*2:(p-.5)*2)*50)/10}},
 ui:[{choose:[['two','Two-point'],['grating','Grating orientation']],label:'Test',get:s=>s.test,act:'test'},{range:'w',label:'Gap or ridge width',min:0,max:5,step:.1,get:s=>s.w,act:'w',show:v=>Number(v).toFixed(1)+' mm'}],
 on:{test(s,v){s.test=v;return 'keep'},w(s,v){s.w=Number(v);return 'keep'}},
 draw(s){
  let out=heading(s.test==='two'?'Two-point: “two” even for one point':'Grating orientation: a cleaner measure');
  const pl=S7_plot(80,70,300,230,[0,5],[0,1],{xt:[[0,'0'],[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5 mm']],yt:[[0,'0%'],[.5,'50%'],[.75,'75%'],[1,'100%']],xl:s.test==='two'?'gap between tips':'ridge width',yl:s.test==='two'?'said “two”':'orientation correct'});out+=pl.svg;
  const fn=s.test==='two'?S7_tpCurve:S7_gotCurve,pts=[];for(let k=0;k<=100;k++){const x=k*.05;pts.push([pl.X(x),pl.Y(fn(x))])}
  out+=S7_poly(pts,s.test==='two'?C.coral:C.green,2.6)+L(pl.X(0),pl.Y(.75),pl.X(5),pl.Y(.75),C.line,1,'stroke-dasharray="4 4"');
  if(s.test==='two')out+=Ci(pl.X(0),pl.Y(.25),7,C.amber,'#fff')+TF(pl.X(0)+12,pl.Y(.25)-10,'catch trials: one tip, still “two”',13,C.amber,'start');
  else out+=L(pl.X(.5),pl.Y(.5),pl.X(.5),pl.Y(0),C.line,1)+TF(pl.X(.1),pl.Y(.5)-8,'chance',13,C.muted,'start');
  out+=Ci(pl.X(s.w),pl.Y(fn(s.w)),7,C.ink,'#fff');
  out+=R(400,80,180,200,'#f6f9fb','none',8)+TBF(410,104,'At '+s.w.toFixed(1)+' mm',14,C.ink,'start')+TF(410,128,`${Math.round(fn(s.w)*100)}% ${s.test==='two'?'said “two”':'correct'}`,13,C.ink,'start');
  out+=TF(410,160,s.test==='two'?'Problem: people feel':'Two choices only:',13,C.muted,'start')+TF(410,180,s.test==='two'?'one firm tip as “two”':'chance is 50%, and',13,C.muted,'start')+TF(410,200,s.test==='two'?'and one light tip as':'there is no free',13,C.muted,'start')+TF(410,220,s.test==='two'?'“one”: cues other':'pressure cue to use.',13,C.muted,'start')+(s.test==='two'?TF(410,240,'than space leak in.',13,C.muted,'start'):TF(410,240,'75% at about 1 mm.',13,C.green,'start'));
  out+=T(300,366,s.test==='two'?'A test that says “two” for one point cannot measure spatial resolution.':'Ridges about 1 mm wide are the true limit at the fingertip.',15,C.ink);
  return {svg:out,phase:s.test==='two'?`Even with a single tip, a simulated participant says “two” about 25% of the time. The two-point test mixes spatial resolution with judgements about pressure, which is why Craig & Johnson (2000) argued it should be retired. Simulated curve.`:`Grating orientation runs from 50% (guessing) to near 100%; 75% correct falls at about 1 mm ridges on the fingertip (Van Boven & Johnson 1994). Simulated curve with the published threshold.`};
 }});

/* =========================== vibration =========================== */
// Detection thresholds (µm amplitude, log10) for the fast small-field (RA) and Pacinian (PC) channels. Schematic.
const S7_thrRA=f=>Math.pow(10,1+.6*Math.pow(Math.log10(f/35),2));
const S7_thrPC=f=>Math.pow(10,-1+2.6*Math.pow(Math.log10(f/250),2));
SCENE({id:'vibration',name:'Feeling vibration',tag:'Flutter and buzz',
 definition:'The skin is most sensitive to vibration at around 250 Hz, where Pacinian corpuscles respond to movements smaller than a micrometre. Below about 40 Hz a different channel, carried by Meissner corpuscles, takes over and the sensation changes from buzz to flutter.',
 example:'A phone on silent buzzes at roughly 150–250 Hz, close to the Pacinian sweet spot, so you feel it through a pocket even when the motion is tiny.',
 desc:'Detection thresholds against frequency for the flutter (Meissner) and vibration (Pacinian) channels on log axes, with the overall threshold and the current frequency.',
 research:['Verrillo, R. T. (1963). Effect of contactor area on the vibrotactile threshold. Journal of the Acoustical Society of America 35, 1962–1966.','Talbot, W. H., Darian-Smith, I., Kornhuber, H. H. & Mountcastle, V. B. (1968). The sense of flutter-vibration. Journal of Neurophysiology 31, 301–334. Bolanowski, S. J. et al. (1988). Four channels mediate the mechanical aspects of touch. JASA 84, 1680–1694. Curves here are schematic.'],
 dur:10,hint:'Sweep the frequency. “Hear it” plays the frequency as a tone: an analogy, since your ears are not your skin.',
 init:()=>({f:250}),
 watch(p){return {f:Math.round(Math.pow(10,Math.log10(5)+p*Math.log10(100)))}},
 ui:[{range:'f',label:'Frequency',min:5,max:500,step:1,get:s=>s.f,act:'f',show:v=>v+' Hz'},{b:'Hear it as a tone',act:'hear'}],
 on:{f(s,v){s.f=Number(v);return 'keep'},hear(s){if(s.f>=30)AUDIO.tone(s.f,{dur:.8,gain:.14});return 'keep'}},
 draw(s){
  const f=s.f,ra=S7_thrRA(f),pc=S7_thrPC(f),best=ra<pc?'flutter (Meissner)':'vibration (Pacinian)';let out=heading('Which channel feels it first?');
  const pl=S7_plot(90,60,330,240,[5,500],[.05,200],{logx:true,logy:true,xt:[[5,'5'],[20,'20'],[50,'50'],[100,'100'],[250,'250'],[500,'500 Hz']],yt:[[.1,'0.1'],[1,'1'],[10,'10'],[100,'100']],xl:'frequency',yl:'smallest movement felt (µm)'});out+=pl.svg;
  const a=[],b=[];for(let k=0;k<=120;k++){const x=Math.pow(10,Math.log10(5)+k/120*2);a.push([pl.X(x),pl.Y(Math.min(200,S7_thrRA(x)))]);b.push([pl.X(x),pl.Y(Math.min(200,S7_thrPC(x)))])}
  out+=S7_poly(a,'#2c776c',2.4)+S7_poly(b,C.coral,2.4);
  out+=L(pl.X(f),pl.Y(200),pl.X(f),pl.Y(.05),C.amber,1.8)+Ci(pl.X(f),pl.Y(Math.min(ra,pc)),7,C.ink,'#fff');
  out+=R(436,70,144,22,'none','none')+Ci(444,80,5,'#2c776c')+TF(454,85,'flutter channel',13,'#2c776c','start')+Ci(444,104,5,C.coral)+TF(454,109,'Pacinian channel',13,C.coral,'start');
  out+=R(436,132,144,150,'#f6f9fb','none',8)+TBF(446,156,`${f} Hz`,15,C.ink,'start')+TF(446,180,'felt first by',13,C.muted,'start')+TBF(446,200,best.split(' ')[0],14,ra<pc?'#2c776c':C.coral,'start')+TF(446,224,'threshold',13,C.muted,'start')+TBF(446,244,`${Math.min(ra,pc)<1?Math.min(ra,pc).toFixed(2):Math.round(Math.min(ra,pc))} µm`,14,C.ink,'start')+TF(446,268,f<30?'(below hearing)':'',13,C.muted,'start');
  out+=T(300,354,'Most sensitive near 250 Hz: movements of a fraction of a micrometre.',15,C.ink);
  return {svg:out,phase:`At ${f} Hz the ${best} channel has the lower threshold, about ${Math.min(ra,pc)<1?Math.min(ra,pc).toFixed(2):Math.round(Math.min(ra,pc))} µm. Below roughly 40 Hz the skin feels flutter; above it, a smooth buzz carried by Pacinian corpuscles. Schematic curves after Verrillo (1963) and Bolanowski et al. (1988).`};
 }});

const S7_PSITES=[['fingertip','Fingertip',4.5],['palm','Palm',3.8],['wrist','Wrist',2.8],['forearm','Forearm',2.2]];
SCENE({id:'vibration-phone',name:'Your phone as a vibrator',tag:'A home test',
 definition:'Sensitivity to vibration varies across the body with the density of Pacinian corpuscles and the type of skin. Hairless skin on the hand is more sensitive than the hairy skin of the forearm.',
 example:'Hold a buzzing phone against your fingertip, then your forearm. Most people rate the same buzz as stronger on the fingertip.',
 desc:'Your intensity ratings for one phone buzz at four sites, drawn beside the typical order expected from receptor density.',
 research:['Verrillo, R. T. (1966). Vibrotactile sensitivity and the frequency response of the Pacinian corpuscle. Psychonomic Science 4, 135–136. Mahns, D. A. et al. (2006). Vibrotactile frequency discrimination in human hairy skin. Journal of Neurophysiology 95, 1442–1450.','The typical ratings drawn here are illustrative, ordered by receptor density; they are not published means.'],
 dur:10,hint:'Press Buzz on a phone (if your device can vibrate), hold it to a site, rate how strong it felt, and record. Your ratings stay on this page.',
 init:()=>({site:'fingertip',rate:3,mine:{},msg:''}),
 watch(p){const n=Math.min(4,Math.floor(p*5));const mine={};S7_PSITES.slice(0,n).forEach(([k,,v],i)=>mine[k]=Math.max(1,Math.min(5,Math.round(v+(S7_rng(i+40)()-.5)))));return {site:S7_PSITES[Math.max(0,n-1)][0],rate:3,mine,msg:'',sim:true}},
 ui:[{b:'Buzz',act:'buzz'},{choose:S7_PSITES.map(z=>[z[0],z[1]]),label:'Site',get:s=>s.site,act:'site'},{range:'rate',label:'How strong (1–5)',min:1,max:5,step:1,get:s=>s.rate,act:'rate'},{b:'Record',act:'rec'},{b:'Clear my data',act:'clear'}],
 on:{buzz(s){let ok=false;try{if(typeof navigator!=='undefined'&&typeof navigator.vibrate==='function')ok=navigator.vibrate([400])}catch(_e){ok=false}s.msg=ok?'Buzzing for 0.4 s.':'This device cannot vibrate from a web page: use your phone’s own vibration setting instead.';return 'keep'},
  site(s,v){s.site=v;return 'keep'},rate(s,v){s.rate=Number(v);return 'keep'},rec(s){s.mine[s.site]=s.rate;return 'keep'},clear(s){s.mine={};return 'keep'}},
 draw(s){
  let out=heading('Where does the same buzz feel strongest?');
  const pl=S7_plot(90,64,330,230,[0,4],[0,5],{yt:[[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5']],yl:'rated strength'});out+=pl.svg;
  S7_PSITES.forEach(([k,lab,v],i)=>{const x=pl.X(i+.5);out+=R(x-22,pl.Y(v),44,pl.Y(0)-pl.Y(v),s.site===k?'#b9d4e6':'#dde8ef','none',3)+TF(x,pl.Y(0)+17,lab,13,s.site===k?C.ink:C.muted);if(s.mine[k])out+=Ci(x,pl.Y(s.mine[k]),8,C.coral,'#fff')});
  out+=R(440,80,140,24,'none','none')+R(440,74,12,12,'#b9d4e6','none',2)+TF(458,85,'typical (illustrative)',12,C.muted,'start')+Ci(446,104,6,C.coral,'#fff')+TF(458,109,s.sim?'simulated participant':'your rating',12,C.muted,'start');
  out+=R(440,130,140,140,'#f6f9fb','none',8)+TF(450,154,'Phone motors buzz',13,C.muted,'start')+TF(450,174,'at about 150–250 Hz,',13,C.muted,'start')+TF(450,194,'near the Pacinian',13,C.muted,'start')+TF(450,214,'sweet spot.',13,C.muted,'start')+TF(450,244,'Hairy skin has fewer',13,C.muted,'start')+TF(450,262,'deep receptors.',13,C.muted,'start');
  out+=T(300,340,s.msg||(Object.keys(s.mine).length?`${Object.keys(s.mine).length} of 4 sites rated`:'Buzz, hold the phone to a site, rate it and record.'),15,C.ink);
  return {svg:out,phase:s.sim?'A simulated participant rates the buzz strongest on the fingertip and weakest on the forearm, the order expected from receptor density. Watch shows simulated data.':'Compare your ratings with the typical order. Ratings are subjective and depend on how hard you press the phone, so treat this as a demonstration, not a measurement. Nothing leaves this page.'};
 }});

SCENE({id:'vibration-texture',name:'Feeling texture',tag:'Speed × ridges = frequency',
 definition:'When a fingertip slides over a fine texture, the ridges set the skin vibrating at a frequency equal to the sliding speed divided by the ridge spacing. Fine textures are felt mainly through this vibration; coarse ones through the spatial pattern of pressure.',
 example:'Sliding at 100 mm/s across ridges 0.4 mm apart makes the skin vibrate at 250 Hz, right where Pacinian corpuscles are most sensitive. Silk and sandpaper differ in the vibrations they make.',
 desc:'A fingertip sliding across a ridged surface with speed and spacing controls, the vibration waveform it produces, and whether the texture counts as fine or coarse.',
 research:['Katz, D. (1925/1989). The World of Touch, trans. L. E. Krueger. Erlbaum.','Hollins, M. & Risner, S. R. (2000). Evidence for the duplex theory of tactile texture perception. Perception & Psychophysics 62, 695–705. Weber, A. I. et al. (2013). Spatial and temporal codes mediate the tactile perception of natural textures. PNAS 110, 17107–17112.'],
 dur:10,hint:'Change how fast you slide and how far apart the ridges are, then hear the vibration as a tone.',
 init:()=>({v:100,lam:.4}),
 watch(p){return {v:Math.round(20+180*p),lam:.4}},
 ui:[{range:'v',label:'Sliding speed',min:10,max:200,step:5,get:s=>s.v,act:'v',show:v=>v+' mm/s'},{range:'lam',label:'Ridge spacing',min:.05,max:3,step:.05,get:s=>s.lam,act:'lam',show:v=>Number(v).toFixed(2)+' mm'},{b:'Hear it',act:'hear'}],
 on:{v(s,v){s.v=Number(v);return 'keep'},lam(s,v){s.lam=Number(v);return 'keep'},hear(s){const f=s.v/s.lam;if(f>=30&&f<=2000)AUDIO.tone(f,{dur:.7,gain:.13,type:'triangle'});return 'keep'}},
 draw(s){
  const f=s.v/s.lam,fine=s.lam<.2;let out=heading('Sliding turns ridges into vibration');
  const n=Math.min(60,Math.max(3,Math.round(500/(s.lam*40))));
  out+=R(50,150,500,24,'#e9e2d4','none',2);for(let i=0;i<n;i++){const x=50+(i+.5)*500/n;out+=R(x-Math.max(1,250/n),138,Math.max(2,500/n),12,'#c7b89a','none',1)}
  out+=P('M250 70 Q250 136 300 138 Q350 136 350 70','#c98f6b',2.5,'#f3d5c0')+arrow(360,106,430,106,C.amber,2.5)+TF(436,111,`${s.v} mm/s`,13,C.amber,'start');
  out+=TF(50,196,`ridges ${s.lam.toFixed(2)} mm apart`,13,C.muted,'start');
  const pts=[],cyc=Math.min(40,f/50);for(let k=0;k<=300;k++){const t=k/300;pts.push([50+t*500,262+24*Math.sin(2*Math.PI*cyc*t)])}
  out+=R(50,232,500,60,'#fff',C.grid,4)+S7_poly(pts,fine?C.coral:C.blue,1.8)+TF(50,226,'skin vibration over 20 ms (schematic)',13,C.muted,'start');
  out+=T(300,326,`${s.v} ÷ ${s.lam.toFixed(2)} = ${Math.round(f)} Hz`,17,C.ink,'middle','font-weight="650"');
  out+=T(300,356,fine?'Fine texture: felt mainly as vibration (Pacinian).':'Coarse texture: felt mainly as a pattern of pressure (Merkel).',15,fine?C.coral:C.blue);
  return {svg:out,phase:`Sliding at ${s.v} mm/s over ridges ${s.lam.toFixed(2)} mm apart vibrates the skin at ${Math.round(f)} Hz. ${fine?'Below about 0.2 mm spacing, texture is coded mostly by vibration':'At coarser spacings, the spatial pattern sensed by Merkel units dominates'}, the duplex theory of texture (Hollins & Risner 2000; Weber et al. 2013). The 0.2 mm boundary is approximate.`};
 }});

/* =========================== pain =========================== */
SCENE({id:'pain',name:'First and second pain',tag:'Two kinds of fibre',
 definition:'Pain is carried by nociceptors with two kinds of nerve fibre. Thin myelinated Aδ fibres conduct at about 5–30 m/s and give a sharp, well-located first pain; unmyelinated C fibres conduct at about 0.5–2 m/s and give a slower, duller, burning second pain.',
 example:'Stub your toe and you feel a sharp jolt at once, then a moment later a deep, spreading ache. The nerve from toe to spinal cord is about a metre long, so the two signals arrive almost a second apart.',
 desc:'A body outline with the distance from the injury, and a timeline showing when the fast Aδ and slow C signals arrive.',
 research:['Gasser, H. S. & Erlanger, J. (1929). The role of fiber size in the establishment of a nerve block by pressure or cocaine. American Journal of Physiology 88, 581–591 (Nobel Prize 1944).','Lewis, T. & Pochin, E. E. (1938). The double pain response of the human skin to a single stimulus. Clinical Science 3, 67–76. Speeds here are typical values.'],
 dur:10,hint:'Move the injury further from the brain and change the fibre speeds.',
 init:()=>({d:1.5,va:15,vc:1}),
 watch(p){return {d:Math.round((.3+1.3*p)*10)/10,va:15,vc:1}},
 ui:[{range:'d',label:'Distance to brain',min:.2,max:1.8,step:.1,get:s=>s.d,act:'d',show:v=>Number(v).toFixed(1)+' m'},{range:'va',label:'Aδ speed',min:5,max:30,step:1,get:s=>s.va,act:'va',show:v=>v+' m/s'},{range:'vc',label:'C speed',min:.5,max:2,step:.1,get:s=>s.vc,act:'vc',show:v=>Number(v).toFixed(1)+' m/s'}],
 on:{d(s,v){s.d=Number(v);return 'keep'},va(s,v){s.va=Number(v);return 'keep'},vc(s,v){s.vc=Number(v);return 'keep'}},
 draw(s){
  const ta=s.d/s.va*1000,tc=s.d/s.vc*1000;let out=heading('Sharp first, dull second');
  // Simple standing figure 0–1.8 m.
  const yb=320,ys=v=>yb-v/1.8*240;out+=Ci(90,ys(1.7),13,'#fff',C.ink)+L(90,ys(1.6),90,ys(.95),C.ink,3)+L(90,ys(.95),76,yb,C.ink,3)+L(90,ys(.95),104,yb,C.ink,3)+L(90,ys(1.4),70,ys(1),C.ink,3)+L(90,ys(1.4),110,ys(1),C.ink,3);
  const yi=ys(Math.max(0,1.7-s.d));out+=Ci(104,Math.min(yb,yi),7,C.coral,'#fff')+L(120,ys(1.7),120,Math.min(yb,yi),C.amber,2,'stroke-dasharray="4 4"')+TF(126,(ys(1.7)+Math.min(yb,yi))/2,`${s.d.toFixed(1)} m`,13,C.amber,'start');
  const span=Math.max(2000,tc*1.15);const pl=S7_plot(200,90,370,170,[0,span],[0,2],{xt:[[0,'0'],[span/2,Math.round(span/2)+''],[span,Math.round(span)+' ms']],xl:'time after the injury'});out+=pl.svg;
  out+=R(pl.X(0),pl.Y(1.75),pl.X(ta)-pl.X(0),24,'#dbe9f5','none',3)+Ci(pl.X(ta),pl.Y(1.5),9,C.blue)+TBF(pl.X(ta)+14,pl.Y(1.5)+5,`sharp: ${Math.round(ta)} ms`,13,C.blue,'start');
  out+=R(pl.X(0),pl.Y(.75),pl.X(tc)-pl.X(0),24,'#f6dfd8','none',3)+Ci(pl.X(tc),pl.Y(.5),9,C.coral)+TBF(Math.min(pl.X(tc)-14,560),pl.Y(.5)+5+(pl.X(tc)>440?-22:0),`dull: ${Math.round(tc)} ms`,13,C.coral,pl.X(tc)>440?'end':'start');
  out+=TF(200,82,'Aδ (myelinated)',13,C.blue,'start')+TF(390,82,'C (unmyelinated)',13,C.coral,'start');
  out+=T(380,300,`Gap between the two: ${Math.round(tc-ta)} ms`,15,C.ink);
  out+=T(300,354,'The same injury, two messages: a fast alarm and a slow, lasting ache.',15,C.ink);
  return {svg:out,phase:`Over ${s.d.toFixed(1)} m, Aδ fibres at ${s.va} m/s arrive after ${Math.round(ta)} ms and C fibres at ${s.vc.toFixed(1)} m/s after ${Math.round(tc)} ms: the classic “double pain”. Brain processing adds time to both; the speeds are typical values.`};
 }});

function S7_gate(small,large,desc){const sg=clamp(.6*large-.35*small+.4*desc,0,10),t=clamp(small+.25*large-1.1*sg,0,15);return {sg,t}}
SCENE({id:'pain-gate',name:'Gate control',tag:'Why rubbing helps',
 definition:'Gate control theory proposed that pain signals are adjusted in the spinal cord before they reach the brain: activity in large touch fibres, and signals coming down from the brain, can close a “gate” that small pain fibres would otherwise open.',
 example:'After banging your elbow you rub it. The rubbing drives large touch fibres, which damp the pain message at the spinal cord. Stress, attention and belief act through descending pathways.',
 desc:'A spinal circuit with pain-fibre and touch-fibre inputs, an inhibitory interneuron, descending control from the brain, and the output sent upwards, all adjustable.',
 research:['Melzack, R. & Wall, P. D. (1965). Pain mechanisms: a new theory. Science 150, 971–979.','Mendell, L. M. (2014). Constructing and deconstructing the gate theory of pain. Pain 155, 210–216: the 1965 wiring was partly wrong, but spinal and descending modulation of pain is well established. The model here is illustrative.'],
 dur:10,hint:'Turn up the pain input, then add rubbing (touch) and calm (descending control). Watch the signal sent to the brain.',
 init:()=>({small:7,large:0,desc:0}),
 watch(p){return {small:7,large:Math.round(Math.min(1,p*2)*10),desc:Math.round(Math.max(0,p*2-1)*10)}},
 ui:[{range:'small',label:'Pain fibres (small)',min:0,max:10,step:1,get:s=>s.small,act:'small'},{range:'large',label:'Rubbing (large fibres)',min:0,max:10,step:1,get:s=>s.large,act:'large'},{range:'desc',label:'Calm and attention (from brain)',min:0,max:10,step:1,get:s=>s.desc,act:'desc'}],
 on:{small(s,v){s.small=Number(v);return 'keep'},large(s,v){s.large=Number(v);return 'keep'},desc(s,v){s.desc=Number(v);return 'keep'}},
 draw(s){
  const g=S7_gate(s.small,s.large,s.desc),open=g.t/10;let out=heading('The spinal gate');
  out+=R(200,90,200,220,'#f3eef8','none',12)+TF(300,108,'spinal cord',13,C.muted);
  const wid=v=>1.5+v*.5;
  out+=L(40,160,252,160,C.coral,wid(s.small))+TF(40,150,'pain (small fibres)',13,C.coral,'start');
  out+=L(40,250,252,250,C.blue,wid(s.large))+TF(40,276,'touch (large fibres)',13,C.blue,'start');
  out+=Ci(270,205,22,'#fff',C.purple)+TBF(270,210,'SG',13,C.purple)+TF(270,246,'inhibitory cell',12,C.purple);
  out+=Ci(350,205,24,'#fff',C.ink)+TBF(350,210,'T',14,C.ink)+TF(350,246,'transmission',12,C.muted);
  out+=arrow(252,160,330,195,C.coral,2)+arrow(252,250,330,215,C.blue,2)+arrow(252,250,262,226,C.blue,1.6)+arrow(252,160,262,184,C.coral,1.4,8,'stroke-dasharray="3 3"');
  out+=L(292,205,322,205,C.purple,1.5+g.sg*.5)+Ci(323,205,4,C.purple);
  out+=L(350,40,350,90,C.green,1.5+s.desc*.4)+arrow(350,90,282,186,C.green,1.5+s.desc*.3)+TF(356,56,'from the brain',13,C.green,'start');
  out+=arrow(374,205,470,205,C.ink,1.5+g.t*.5)+TF(476,200,'to the brain',13,C.muted,'start');
  out+=R(450,226,120,22,'#e5edf2','none',4)+R(450,226,Math.min(120,g.t/10*120),22,g.t>5?C.coral:g.t>2?C.amber:C.green,'none',4)+TF(510,268,`pain signal ${g.t.toFixed(1)}`,13,C.ink);
  out+=T(300,350,g.t>5?'Gate open: a strong pain message goes up.':g.t>2?'Gate half closed.':'Gate mostly closed: little pain gets through.',15,g.t>5?C.coral:g.t>2?C.amber:C.green);
  return {svg:out,phase:`Pain input ${s.small}, rubbing ${s.large}, descending control ${s.desc}: the inhibitory cell's activity is ${g.sg.toFixed(1)} and the signal to the brain ${g.t.toFixed(1)}. Rubbing and calm both shrink it. The circuit details of 1965 were partly wrong, but the idea of spinal and descending control has held up (Mendell 2014). Illustrative model.`};
 }});

const S7_PCARDS=[
 {k:'placebo',t:'Placebo pain relief',v:'Moderate',col:C.amber,d:['Expecting relief can reduce reported pain','and pain-related brain activity (Wager','et al. 2004). Part of it is blocked by','naloxone, so endorphins play a role','(Levine et al. 1978).']},
 {k:'meta',t:'How big is it overall?',v:'Small',col:C.coral,d:['A Cochrane review of placebo versus','no treatment found small effects','overall, a little larger for pain','(about −0.28 SD), and warned of','bias in self-reports (2010).']},
 {k:'nocebo',t:'Nocebo',v:'Moderate',col:C.amber,d:['Expecting harm can increase pain and','side effects: people warned of side','effects report more of them, even on','an inert pill.','']},
 {k:'cip',t:'Living without pain',v:'Strong',col:C.green,d:['People with two broken copies of the','SCN9A gene feel no pain at all and','suffer burns, fractures and injuries','they do not notice (Cox et al. 2006).','Pain protects us.']}];
SCENE({id:'pain-placebo',name:'Pain, belief and evidence',tag:'Real, but smaller than claimed',
 definition:'Pain depends on expectation as well as injury. Placebo analgesia is real and has measurable mechanisms, but its overall size in trials is modest, and claims about it are often overstated.',
 example:'A saline injection described as a painkiller can reduce reported pain, and the drug naloxone, which blocks opioids, can undo part of that relief.',
 desc:'Four evidence cards on placebo, its overall size, nocebo and congenital insensitivity to pain, with a bar of how strong each finding is.',
 research:['Wager, T. D. et al. (2004). Placebo-induced changes in fMRI in the anticipation and experience of pain. Science 303, 1162–1167. Levine, J. D., Gordon, N. C. & Fields, H. L. (1978). The mechanism of placebo analgesia. Lancet 312, 654–657.','Hróbjartsson, A. & Gøtzsche, P. C. (2010). Placebo interventions for all clinical conditions. Cochrane Database of Systematic Reviews CD003974. Cox, J. J. et al. (2006). An SCN9A channelopathy causes congenital inability to experience pain. Nature 444, 894–898.'],
 dur:10,hint:'Press each card to read the evidence and how strong it is.',
 init:()=>({k:'placebo'}),
 watch(p){return {k:S7_PCARDS[Math.min(3,Math.floor(p*4))].k}},
 ui:[{choose:S7_PCARDS.map(c=>[c.k,c.t.split(' ').slice(0,2).join(' ')]),label:'Evidence',get:s=>s.k,act:'k'}],
 on:{k(s,v){s.k=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('What the evidence says about pain and belief');
  S7_PCARDS.forEach((c,i)=>{const x=40+(i%2)*270,y=60+Math.floor(i/2)*84,sel=s.k===c.k;
   const g=R(x,y,250,72,sel?'#fff':'#f6f9fb',sel?c.col:C.grid,8)+TBF(x+12,y+26,c.t,14,C.ink,'start')+S7_status(x+12,y+54,c.v,c.col);
   out+=hit(X,'k',c.k,`${c.t}: evidence ${c.v}. Press to read.`,g)});
  const c=S7_PCARDS.find(z=>z.k===s.k);out+=R(40,236,520,104,'#fff',c.col,8);c.d.forEach((line,i)=>{out+=TF(56,260+i*19,line,13,C.ink,'start')});
  out+=T(300,362,'Pain is real, shaped by the brain, and essential to staying safe.',15,C.ink);
  return {svg:out,phase:`${c.t}: ${c.d.join(' ').replace(/\s+/g,' ').trim()} Evidence: ${c.v.toLowerCase()}.`};
 }});

/* =========================== temperature =========================== */
// Channels and their approximate activation ranges (°C). TRPA1 cold role is debated.
const S7_TRP=[{k:'trpa1',n:'TRPA1',lo:0,hi:17,col:'#2b7bb0',feel:'painful cold (debated)'},{k:'trpm8',n:'TRPM8',lo:8,hi:26,col:'#3aa0c8',feel:'cool'},{k:'trpv3',n:'TRPV3/V4',lo:27,hi:40,col:'#e3a33a',feel:'warm'},{k:'trpv1',n:'TRPV1',lo:43,hi:60,col:'#c45238',feel:'burning heat'}];
function S7_active(temp,chem){return S7_TRP.filter(c=>{let lo=c.lo,hi=c.hi;if(chem==='menthol'&&c.k==='trpm8')hi+=10;if(chem==='capsaicin'&&c.k==='trpv1')lo=32;return temp>=lo&&temp<=hi})}
SCENE({id:'temperature',name:'Thermometers in the skin',tag:'TRP channels',
 definition:'Temperature is sensed by ion channels in nerve endings that open over particular temperature ranges. TRPV1 opens above about 43 °C and gives burning heat; TRPM8 opens below about 26 °C and gives coolness. Some chemicals open the same channels.',
 example:'Chilli feels hot because capsaicin opens TRPV1 at body temperature; mint feels cool because menthol opens TRPM8 without any change in temperature.',
 desc:'A temperature scale with the range of each channel, the channels open at the chosen temperature, and a chemical option that shifts them.',
 research:['Caterina, M. J., Schumacher, M. A., Tominaga, M., Rosen, T. A., Levine, J. D. & Julius, D. (1997). The capsaicin receptor: a heat-activated ion channel in the pain pathway. Nature 389, 816–824.','McKemy, D. D., Neuhausser, W. M. & Julius, D. (2002) and Peier, A. M. et al. (2002), both in Nature 416, on TRPM8. Nobel Prize 2021 to David Julius and Ardem Patapoutian. Ranges here are approximate.'],
 dur:10,hint:'Move the temperature, then add capsaicin or menthol and see which channels open at skin temperature.',
 init:()=>({temp:33,chem:'none'}),
 watch(p){return p<.6?{temp:Math.round(5+50*p/.6),chem:'none'}:{temp:33,chem:p<.8?'capsaicin':'menthol'}},
 ui:[{range:'temp',label:'Skin temperature',min:0,max:55,step:1,get:s=>s.temp,act:'temp',show:v=>v+' °C'},{choose:[['none','Nothing'],['capsaicin','Capsaicin (chilli)'],['menthol','Menthol (mint)']],label:'Chemical',get:s=>s.chem,act:'chem'}],
 on:{temp(s,v){s.temp=Number(v);return 'keep'},chem(s,v){s.chem=v;return 'keep'}},
 draw(s){
  const act=S7_active(s.temp,s.chem),X0=60,W=480,xs=t=>X0+t/55*W;let out=heading('Which channels open?');
  for(let t=0;t<55;t++)out+=R(xs(t),300,W/55+1,14,t<15?'#5aa0d0':t<27?'#a9d3e8':t<41?'#f2d58f':'#e07a5f','none',0);
  [0,10,20,30,40,50].forEach(t=>out+=TF(xs(t),332,t+' °C',13,C.muted));
  S7_TRP.forEach((c,i)=>{const y=96+i*46;let lo=c.lo,hi=c.hi;if(s.chem==='menthol'&&c.k==='trpm8')hi+=10;if(s.chem==='capsaicin'&&c.k==='trpv1')lo=32;const on=act.includes(c);
   out+=R(xs(c.lo),y,xs(c.hi)-xs(c.lo),22,'#eef3f6','none',5)+R(xs(lo),y,xs(Math.min(55,hi))-xs(lo),22,on?c.col:tint(c.col,.6),'none',5)+TBF(xs(lo)+6,y+16,c.n,13,on?'#fff':C.ink,'start')+TF(Math.min(xs(Math.min(55,hi))+8,520),y+16,on?c.feel:'',13,c.col,'start')});
  out+=L(xs(s.temp),82,xs(s.temp),314,C.ink,2.2)+Ci(xs(s.temp),82,6,C.ink);
  const feel=act.length?act.map(c=>c.feel).join(' + '):'neutral: no channel strongly active';
  out+=T(300,360,`${s.temp} °C${s.chem!=='none'?' with '+s.chem:''}: ${feel}`,15,C.ink);
  return {svg:out,phase:s.chem==='capsaicin'?`Capsaicin lowers TRPV1’s threshold to around body temperature, so ordinary skin at ${s.temp} °C feels like burning heat: chilli is a chemical trick, not real heat.`:s.chem==='menthol'?`Menthol makes TRPM8 open at warmer temperatures, so skin at ${s.temp} °C feels cool with no change in temperature.`:`At ${s.temp} °C: ${feel}. Channel ranges are approximate; the role of TRPA1 in cold sensing is debated.`};
 }});

function S7_adapt(bowl,min){return 32+(bowl-32)*(1-Math.exp(-min/1.2))}
SCENE({id:'temperature-bowls',name:'Three bowls of water',tag:'Warm or cool depends on before',
 definition:'Thermal sensation reports change relative to what the skin has adapted to, not absolute temperature. The same water can feel warm to one hand and cool to the other.',
 example:'Put one hand in cool water and one in warm for a minute, then both into a bowl of lukewarm water: the cool-adapted hand says “warm”, the warm-adapted hand says “cool”.',
 desc:'Left and right bowls with adjustable temperatures and soaking time, then both hands in a middle bowl, with each hand’s adapted skin temperature and what it reports.',
 research:['Locke, J. (1690). An Essay Concerning Human Understanding, Book II, chapter 8, section 21, where the three-bowl demonstration appears.','Weber, E. H. (1846). Der Tastsinn und das Gemeingefühl. Kenshalo, D. R. (1976). Correlations of temperature sensitivity in man and monkey. In Y. Zotterman (ed.), Sensory Functions of the Skin, 305–330. Adaptation model here is illustrative.'],
 dur:10,hint:'Set the two bowls and the soaking time. Try it at home with tap water no hotter than 40 °C, and never with very hot water.',
 init:()=>({left:15,right:40,min:1}),
 watch(p){return {left:15,right:40,min:Math.round(p*30)/10}},
 ui:[{range:'left',label:'Left bowl',min:10,max:40,step:1,get:s=>s.left,act:'left',show:v=>v+' °C'},{range:'right',label:'Right bowl',min:10,max:40,step:1,get:s=>s.right,act:'right',show:v=>v+' °C'},{range:'min',label:'Soak',min:0,max:3,step:.1,get:s=>s.min,act:'min',show:v=>Number(v).toFixed(1)+' min'}],
 on:{left(s,v){s.left=Number(v);return 'keep'},right(s,v){s.right=Number(v);return 'keep'},min(s,v){s.min=Number(v);return 'keep'}},
 draw(s){
  const mid=30,aL=S7_adapt(s.left,s.min),aR=S7_adapt(s.right,s.min),pL=mid-aL,pR=mid-aR;let out=heading('The same water, two opposite feelings');
  const bowl=(x,t,lab)=>P(`M${x-60} 120 Q${x-60} 190 ${x} 190 Q${x+60} 190 ${x+60} 120 Z`,C.line,2,t<20?'#b8dcef':t<33?'#e8f1f5':'#f6d3c0')+TBF(x,150,t+' °C',15,C.ink)+TF(x,110,lab,13,C.muted);
  out+=bowl(110,s.left,'left bowl')+bowl(300,mid,'then both here')+bowl(490,s.right,'right bowl');
  out+=arrow(170,160,236,160,C.line,2)+arrow(430,160,364,160,C.line,2);
  const say=v=>Math.abs(v)<1?'neutral':v>0?'warm':'cool',col=v=>Math.abs(v)<1?C.muted:v>0?C.coral:C.blue;
  out+=R(60,220,220,100,'#f6f9fb','none',8)+TBF(72,244,'Left hand',14,C.ink,'start')+TF(72,268,`skin adapted to ${aL.toFixed(1)} °C`,13,C.ink,'start')+TBF(72,296,`30 °C feels ${say(pL)}`,15,col(pL),'start');
  out+=R(320,220,220,100,'#f6f9fb','none',8)+TBF(332,244,'Right hand',14,C.ink,'start')+TF(332,268,`skin adapted to ${aR.toFixed(1)} °C`,13,C.ink,'start')+TBF(332,296,`30 °C feels ${say(pR)}`,15,col(pR),'start');
  out+=T(300,356,'Thermal sense reports change, not absolute temperature.',15,C.ink);
  return {svg:out,phase:`After ${s.min.toFixed(1)} min, the left hand’s skin has drifted to about ${aL.toFixed(1)} °C and the right to ${aR.toFixed(1)} °C. In the 30 °C bowl the left feels ${say(pL)} and the right ${say(pR)}. Locke used this in 1690 to argue that warmth is in the perceiver as well as the water. Illustrative adaptation model. Safety: tap water only, never above 40 °C.`};
 }});

const S7_FOODS=[['Bell pepper',1],['Jalapeño',5000],['Cayenne',40000],['Habanero',200000],['Carolina Reaper',1600000],['Pure capsaicin',16000000]];
const S7_trpv1=shu=>{const n=1.6,ec=30000;return Math.pow(shu,n)/(Math.pow(shu,n)+Math.pow(ec,n))};
SCENE({id:'temperature-capsaicin',name:'How hot is a chilli?',tag:'Dose and receptor',
 definition:'Chilli heat is measured in Scoville heat units, originally by diluting an extract until tasters could no longer detect it and now by measuring capsaicin chemically. More capsaicin opens more TRPV1 channels, up to a ceiling.',
 example:'A jalapeño rates a few thousand Scoville units, a habanero a few hundred thousand and pure capsaicin about sixteen million.',
 desc:'A log scale of Scoville heat units with common chillies marked, and a curve of the share of TRPV1 channels opened, with the current dose.',
 research:['Scoville, W. L. (1912). Note on capsicums. Journal of the American Pharmaceutical Association 1, 453–454. Modern ratings use HPLC (ASTA method 21.3).','Caterina, M. J. et al. (1997). The capsaicin receptor: a heat-activated ion channel in the pain pathway. Nature 389, 816–824. The dose–response curve here is illustrative, not fitted.'],
 dur:10,hint:'Slide through the chillies on the log scale and watch the share of TRPV1 channels opened.',
 init:()=>({lg:3.7}),
 watch(p){return {lg:Math.round(p*72)/10}},
 ui:[{range:'lg',label:'Heat (log₁₀ Scoville units)',min:0,max:7.2,step:.1,get:s=>s.lg,act:'lg',show:v=>Math.round(Math.pow(10,Number(v))).toLocaleString('en-GB')+' SHU'}],
 on:{lg(s,v){s.lg=Number(v);return 'keep'}},
 draw(s){
  const shu=Math.pow(10,s.lg),frac=S7_trpv1(shu);let out=heading('More capsaicin, more TRPV1 open');
  const pl=S7_plot(90,70,470,170,[1,2e7],[0,1],{logx:true,xt:[[1,'1'],[100,'100'],[1e4,'10⁴'],[1e6,'10⁶'],[1e7,'10⁷']],yt:[[0,'0%'],[.5,'50%'],[1,'100%']],xl:'Scoville heat units (log scale)',yl:'TRPV1 opened (illustrative)'});out+=pl.svg;
  const pts=[];for(let k=0;k<=140;k++){const x=Math.pow(10,k/140*7.3);pts.push([pl.X(x),pl.Y(S7_trpv1(x))])}out+=S7_poly(pts,C.coral,2.6);
  S7_FOODS.forEach(([n,v],i)=>{const x=pl.X(v);out+=L(x,pl.Y(0),x,pl.Y(0)+6,C.ink,1.4)+TF(x,286+(i%2)*18,n,12,C.ink)});
  out+=Ci(pl.X(shu),pl.Y(frac),8,C.ink,'#fff');
  out+=T(300,346,`${Math.round(shu).toLocaleString('en-GB')} SHU → ${Math.round(frac*100)}% of channels opened`,15,C.ink);
  return {svg:out,phase:`At ${Math.round(shu).toLocaleString('en-GB')} Scoville units, about ${Math.round(frac*100)}% of TRPV1 channels open in this illustrative curve. Heat feels “hot” because TRPV1 also opens above about 43 °C; the nerves cannot tell chilli from a burn. Safety: concentrated capsaicin can harm eyes and skin.`};
 }});

/* =========================== proprioception =========================== */
function S7_len(t,amt,vel){const ramp=amt/vel*1000;if(t<300)return 0;if(t<300+ramp)return (t-300)/ramp*amt;return amt}
function S7_ia(t,amt,vel){const ramp=amt/vel*1000,moving=t>=300&&t<300+ramp;return 10+30*S7_len(t,amt,vel)/10+(moving?vel*12:0)}
function S7_ii(t,amt,vel){return 10+45*S7_len(t,amt,vel)/10}
SCENE({id:'proprioception',name:'Muscle spindles',tag:'Sensors of length and speed',
 definition:'Proprioception is the sense of where your body parts are and how they are moving. Much of it comes from muscle spindles: stretch receptors inside muscles whose primary (Ia) endings report the speed of stretch and whose secondary (II) endings report the length.',
 example:'Close your eyes and touch your nose: spindles in your arm muscles tell your brain how long each muscle is and how fast it is changing, so you can steer without looking.',
 desc:'A muscle stretched to a set length at a set speed, with traces of muscle length, primary-ending firing and secondary-ending firing.',
 research:['Sherrington, C. S. (1906). The Integrative Action of the Nervous System. Yale University Press, where “proprioceptive” was coined.','Matthews, P. B. C. (1972). Mammalian Muscle Receptors and their Central Actions. Arnold. Proske, U. & Gandevia, S. C. (2012). The proprioceptive senses. Physiological Reviews 92, 1651–1697. Firing rates here are schematic.'],
 dur:10,hint:'Change how far and how fast the muscle is stretched. The primary ending jumps while it moves; the secondary tracks length.',
 init:()=>({amt:8,vel:10}),
 watch(p){return {amt:8,vel:Math.round(4+16*p)}},
 ui:[{range:'amt',label:'Stretch',min:2,max:10,step:1,get:s=>s.amt,act:'amt',show:v=>v+' mm'},{range:'vel',label:'Speed',min:2,max:20,step:1,get:s=>s.vel,act:'vel',show:v=>v+' mm/s'},{b:'Hear Ia',act:'hear'}],
 on:{amt(s,v){s.amt=Number(v);return 'keep'},vel(s,v){s.vel=Number(v);return 'keep'},hear(s){S7_clicks(S7_spikes(t=>S7_ia(t,s.amt,s.vel),2500).map(t=>t/1000));return 'keep'}},
 draw(s){
  const span=2500;let out=heading('Speed and length, reported separately');
  const pl=S7_plot(170,70,400,70,[0,span],[0,10],{yl:'muscle length (mm stretched)'});out+=pl.svg;
  const pts=[];for(let t=0;t<=span;t+=10)pts.push([pl.X(t),pl.Y(S7_len(t,s.amt,s.vel))]);out+=S7_poly(pts,C.amber,2.6);
  out+=TF(160,112,'stretch',13,C.amber,'end');
  const ia=S7_spikes(t=>S7_ia(t,s.amt,s.vel),span),ii=S7_spikes(t=>S7_ii(t,s.amt,s.vel),span);
  out+=TF(160,196,'primary (Ia)',13,C.coral,'end')+S7_raster(ia,170,170,400,44,span,C.coral)+TF(160,262,'secondary (II)',13,C.blue,'end')+S7_raster(ii,170,236,400,44,span,C.blue);
  out+=TF(170,300,'0',13,C.muted,'start')+TF(570,300,'2.5 s',13,C.muted,'end');
  // A small muscle with spindle.
  out+=`<ellipse cx="80" cy="200" rx="${26+s.amt*1.4}" ry="34" fill="#f2c9b8" stroke="${C.coral}" stroke-width="2"/>`+`<ellipse cx="80" cy="200" rx="${12+s.amt*.7}" ry="7" fill="#fff" stroke="${C.purple}" stroke-width="2"/>`+TF(80,252,'muscle and spindle',12,C.muted);
  out+=T(300,346,'Ia fires hardest while the muscle is moving; II settles on how long it is.',15,C.ink);
  return {svg:out,phase:`A ${s.amt} mm stretch at ${s.vel} mm/s: the primary ending fires ${ia.length} spikes, bursting while the muscle moves; the secondary fires ${ii.length}, rising and staying with the new length. Together they tell the brain where the limb is and where it is going. Schematic rates.`};
 }});

const S7_PERSON={typical:{n:'Typical',open:.6,closed:1.6},piezo:{n:'PIEZO2 loss',open:1.3,closed:7},neuro:{n:'Large-fibre neuropathy',open:1.1,closed:9}};
SCENE({id:'proprioception-piezo2',name:'Living without proprioception',tag:'Piezo2 and vision',
 definition:'Piezo2 is a stretch-sensitive ion channel that muscle spindles and touch receptors need. People born without working PIEZO2, and people who lose their large sensory fibres, can still move but lose track of their limbs without vision.',
 example:'Ian Waterman lost touch and proprioception below the neck after an illness at 19. He relearned to walk and work by watching every movement, and in the dark he cannot control his limbs.',
 desc:'A reaching task to a target with eyes open or closed, for a typical person, someone with PIEZO2 loss and someone with large-fibre neuropathy, showing the spread of simulated reach endpoints.',
 research:['Coste, B. et al. (2010). Piezo1 and Piezo2 are essential components of distinct mechanically activated cation channels. Science 330, 55–60. Chesler, A. T. et al. (2016). The role of PIEZO2 in human mechanosensation. New England Journal of Medicine 375, 1355–1364.','Cole, J. (1991). Pride and a Daily Marathon. Duckworth, on Ian Waterman. Reach errors here are illustrative, not measured.'],
 dur:10,hint:'Switch the person and close the eyes. Each dot is a simulated reach to the centre.',
 init:()=>({who:'typical',eyes:'open'}),
 watch(p){const i=Math.min(5,Math.floor(p*6));return {who:['typical','typical','piezo','piezo','neuro','neuro'][i],eyes:i%2?'closed':'open'}},
 ui:[{choose:[['typical','Typical'],['piezo','PIEZO2 loss'],['neuro','Neuropathy']],label:'Person',get:s=>s.who,act:'who'},{choose:[['open','Eyes open'],['closed','Eyes closed']],label:'Vision',get:s=>s.eyes,act:'eyes'}],
 on:{who(s,v){s.who=v;return 'keep'},eyes(s,v){s.eyes=v;return 'keep'}},
 draw(s){
  const p=S7_PERSON[s.who],sd=p[s.eyes],cx=200,cy=200,sc=12;let out=heading('Reaching with and without proprioception');
  out+=R(60,70,280,260,'#fff',C.grid,6)+Ci(cx,cy,sc*2,'none',C.line,'stroke-dasharray="3 3"')+Ci(cx,cy,sc*5,'none',C.line,'stroke-dasharray="3 3"')+TF(cx+sc*2+4,cy-4,'2 cm',12,C.muted,'start')+TF(cx+sc*5+4,cy-4,'5 cm',12,C.muted,'start');
  out+=L(cx-8,cy,cx+8,cy,C.ink,2)+L(cx,cy-8,cx,cy+8,C.ink,2);
  const r=S7_rng(({typical:1,piezo:2,neuro:3})[s.who]*10+(s.eyes==='open'?0:5));let errs=[];
  for(let i=0;i<20;i++){const dx=S7_gauss(r)*sd,dy=S7_gauss(r)*sd;errs.push(Math.hypot(dx,dy));out+=Ci(clamp(cx+dx*sc,66,334),clamp(cy+dy*sc,76,324),5,s.eyes==='open'?C.blue:C.coral,'#fff')}
  const mean=sum(errs)/errs.length;
  out+=R(360,80,220,240,'#f6f9fb','none',8)+TBF(372,106,p.n,15,C.ink,'start')+TF(372,130,s.eyes==='open'?'eyes open':'eyes closed',13,C.muted,'start')+TF(372,162,'average miss',13,C.muted,'start')+TBF(372,186,`${mean.toFixed(1)} cm`,17,s.eyes==='open'?C.blue:C.coral,'start');
  const note={typical:['Spindles and joint','receptors guide the hand','even in the dark.'],piezo:['Without PIEZO2, people','rely on vision; eyes','closed, reaches scatter.'],neuro:['Ian Waterman learned','to move by watching:','in the dark he cannot.']}[s.who];
  note.forEach((l,i)=>out+=TF(372,224+i*20,l,13,C.ink,'start'));
  out+=T(300,356,s.eyes==='closed'&&s.who!=='typical'?'Take away vision and proprioception’s loss is exposed.':'Vision can stand in for proprioception, at a cost in attention.',15,C.ink);
  return {svg:out,phase:`${p.n}, eyes ${s.eyes}: 20 simulated reaches miss the target by ${mean.toFixed(1)} cm on average. People with PIEZO2 loss (Chesler et al. 2016) and Ian Waterman (Cole 1991) move well with vision but poorly without it. The miss sizes are illustrative, not measured.`};
 }});

SCENE({id:'proprioception-vibration',name:'The vibration illusion',tag:'Fooling the spindles',
 definition:'Vibrating a muscle’s tendon at about 100 Hz drives its spindle endings as if the muscle were being stretched. With eyes closed, people feel the limb moving in the direction that would stretch that muscle, even though it is still.',
 example:'Vibrate the biceps tendon of a resting arm and the elbow seems to straighten slowly. Hold your nose while the biceps is vibrated and the nose can feel as if it is growing: the “Pinocchio illusion”.',
 desc:'A real forearm held still and a ghost forearm showing where it is felt to be, with vibration frequency and time sliders, and the felt angle over time.',
 research:['Goodwin, G. M., McCloskey, D. I. & Matthews, P. B. C. (1972). The contribution of muscle afferents to kinaesthesia shown by vibration induced illusions of movement and by the effects of paralysing joint afferents. Brain 95, 705–748.','Lackner, J. R. (1988). Some proprioceptive influences on the perceptual representation of body shape and orientation. Brain 111, 281–297. Drift rates here are illustrative.'],
 dur:10,hint:'Turn up the vibration and let time run. Don’t try this with power tools: it needs a proper laboratory vibrator.',
 init:()=>({hz:100,sec:6}),
 watch(p){return {hz:100,sec:Math.round(p*100)/10}},
 ui:[{range:'hz',label:'Vibration',min:0,max:120,step:5,get:s=>s.hz,act:'hz',show:v=>v+' Hz'},{range:'sec',label:'Time',min:0,max:10,step:.5,get:s=>s.sec,act:'sec',show:v=>Number(v).toFixed(1)+' s'}],
 on:{hz(s,v){s.hz=Number(v);return 'keep'},sec(s,v){s.sec=Number(v);return 'keep'}},
 draw(s){
  const rate=s.hz<20?0:Math.min(1,(s.hz-20)/80)*4,felt=Math.min(45,rate*s.sec),real=90,ex=180,ey=230,len=150;let out=heading('The arm is still; it feels like it is moving');
  const arm=(ang,col,extra)=>{const a=(180-ang)*Math.PI/180;return L(ex,ey,ex+len*Math.cos(a),ey-len*Math.sin(a),col,10,extra)};
  out+=L(ex,ey,ex-110,ey+60,C.ink,10)+Ci(ex,ey,8,C.ink);
  out+=arm(real,C.ink,'')+arm(real+felt,C.coral,'opacity=".45" stroke-dasharray="2 10"');
  out+=TF(ex-8,ey-len-12,'real',13,C.ink,'end');const fa=(180-(real+felt))*Math.PI/180;out+=TF(ex+(len+16)*Math.cos(fa),ey-(len+16)*Math.sin(fa),'felt',13,C.coral);
  if(s.hz>0)out+=P(`M${ex-30} ${ey-24} l4 -6 l4 6 l4 -6 l4 6`,C.amber,2)+TF(ex-34,ey-34,`${s.hz} Hz`,12,C.amber,'end');
  const pl=S7_plot(340,90,230,180,[0,10],[0,45],{xt:[[0,'0'],[5,'5'],[10,'10 s']],yt:[[0,'0°'],[20,'20°'],[40,'40°']],yl:'felt extension'});out+=pl.svg;
  const pts=[];for(let t=0;t<=10;t+=.2)pts.push([pl.X(t),pl.Y(Math.min(45,rate*t))]);out+=S7_poly(pts,C.coral,2.4)+Ci(pl.X(s.sec),pl.Y(felt),6,C.ink,'#fff');
  out+=T(300,350,felt>1?`Felt ${felt.toFixed(0)}° straighter than it really is.`:'No vibration, no illusion.',15,felt>1?C.coral:C.ink);
  return {svg:out,phase:`At ${s.hz} Hz on the biceps tendon, the spindles fire as if the biceps were lengthening, so after ${s.sec.toFixed(1)} s the elbow feels about ${felt.toFixed(0)}° straighter while it has not moved (Goodwin, McCloskey & Matthews 1972). Drift rates are illustrative.`};
 }});
