/* ===================== Senses era 6 · Taste and flavour ===================== */
// Five tastes and the tongue-map myth, smell from the inside (retronasal), pheromones, smell and emotion,
// smell training and the "trillion smells" debate. Smell cannot travel through a screen, so the learner
// does home tests or rates from memory; Watch shows a labelled simulated participant. Every picture is a
// pure function of state; anything random is seeded.
const S6_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const S6_rng=n=>rng(S6_mix(n));
const S6_poly=(pts,col,w=2.4,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
// A pressable box (a button in Try it, plain in Watch).
function S6_btn(X,act,arg,label,x,y,w,h,text,o={}){
 const lines=Array.isArray(text)?text:[text];
 const inner=R(x,y,w,h,o.fill||'#fff',o.stroke||C.line,9,o.sel?'stroke-width="3"':'stroke-width="1.5"')+lines.map((t,i)=>TF(x+w/2,y+h/2+5+(i-(lines.length-1)/2)*17,t,o.size||14,o.ink||C.ink,'middle',o.bold?'font-weight="700"':'')).join('');
 return hit(X,act,arg,label,inner);
}
// Plot frame mapping data to drawing units.
function S6_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-13,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
// A status chip: evidence level in a word.
const S6_STATUS={est:['Established',C.green,C.greenp],mod:['Moderate evidence',C.blue,C.pale],mixed:['Mixed evidence',C.amber,C.amberp],cand:['Candidate',C.purple,C.purplep],no:['Not supported',C.coral,C.coralp],myth:['Myth',C.coral,C.coralp],debated:['Debated',C.amber,C.amberp]};
function S6_chip(x,y,k,anchor='start'){const [t,c,b]=S6_STATUS[k],w=t.length*7.4+18,x0=anchor==='end'?x-w:x;return R(x0,y,w,22,b,c,11,'stroke-width="1.2"')+TF(x0+w/2,y+15.5,t,13,c,'middle','font-weight="700"')}
// Wrap a string into lines of at most n characters.
function S6_wrap(s,n){const out=[];let cur='';s.split(' ').forEach(w=>{if((cur+' '+w).trim().length>n){if(cur)out.push(cur);cur=w}else cur=(cur+' '+w).trim()});if(cur)out.push(cur);return out}
const S6_lines=(x,y,lines,size=14,fill=C.ink,anchor='start',gap=18)=>lines.map((t,i)=>TF(x,y+i*gap,t,size,fill,anchor)).join('');

/* =========================================================== five-tastes */
const S6_TASTES=[
 {k:'sweet',name:'Sweet',col:'#c0508a'},{k:'salty',name:'Salty',col:'#2f6db3'},{k:'sour',name:'Sour',col:'#9a7a00'},
 {k:'bitter',name:'Bitter',col:'#2c776c'},{k:'umami',name:'Umami',col:'#8a4b1f'}];
// Tongue regions: [x, y, name]. The myth map assigns one taste per region; measurements find all tastes everywhere.
const S6_REG=[[200,296,'Tip'],[150,236,'Front sides'],[250,236,'Front sides'],[146,160,'Back sides'],[254,160,'Back sides'],[200,112,'Back']];
const S6_MYTH=['sweet','salty','salty','sour','sour','bitter'];
// Illustrative relative sensitivity by region for each taste (all regions respond; differences are small).
const S6_MEAS={sweet:[1,.88,.88,.82,.82,.84],salty:[.95,1,1,.9,.9,.85],sour:[.86,.95,.95,1,1,.88],bitter:[.8,.84,.84,.9,.9,1],umami:[.9,.92,.92,.9,.9,.92]};
function S6_tongue(){return P('M200 336 C118 336 104 220 112 140 C120 82 158 70 200 70 C242 70 280 82 288 140 C296 220 282 336 200 336 Z','#b4646e',2.5,'#f3c6c8')+L(200,90,200,316,'#d99aa0',2,'stroke-dasharray="5 6"')}
SCENE({id:'five-tastes',name:'The tongue-map myth',tag:'Every part of the tongue tastes everything',
 definition:'Taste (gustation) detects a few qualities in the mouth: sweet, salty, sour, bitter and umami. Receptors for all of them are found in taste buds across the whole tongue.',
 example:'The school diagram with “sweet at the tip, bitter at the back” comes from a 1942 misreading of a 1901 German thesis that found only small differences between regions.',
 desc:'A tongue with six regions coloured by how strongly they respond to one chosen taste, switchable between the textbook myth and what measurements show.',
 research:'Hänig, D. P. (1901). Zur Psychophysik des Geschmackssinnes. Philosophische Studien 17. Boring, E. G. (1942). Sensation and Perception in the History of Experimental Psychology (the misreading). Collings, V. B. (1974). Human taste response as a function of locus of stimulation on the tongue and soft palate. Perception & Psychophysics 16. Chandrashekar et al. (2006). Nature 444. Status: the map is a myth.',
 dur:10,hint:'Choose a taste, then switch between the myth map and the measured picture. Region shading shows relative response.',
 init:()=>({t:'sweet',view:'myth'}),
 watch(p){return {t:S6_TASTES[Math.min(4,Math.floor(p*5))].k,view:p<.5?'myth':'measured'}},
 ui:[{choose:S6_TASTES.map(t=>[t.k,t.name]),label:'Taste',get:s=>s.t,act:'t'},{choose:[['myth','Myth map'],['measured','Measured']],label:'Picture',get:s=>s.view,act:'view'}],
 on:{t(s,v){s.t=v;return 'keep'},view(s,v){s.view=v;return 'keep'}},
 draw(s){
  const T6=S6_TASTES.find(t=>t.k===s.t),myth=s.view==='myth';
  let out=heading(myth?'The myth: one taste per region':'Measured: all regions respond',26)+S6_tongue();
  const vals=S6_REG.map((r,i)=>myth?(S6_MYTH[i]===s.t?1:.08):S6_MEAS[s.t][i]);
  S6_REG.forEach((r,i)=>{out+=Ci(r[0],r[1],24,T6.col,'#fff',`fill-opacity="${fmt(.12+.78*vals[i])}"`)});
  out+=TF(200,356,'Tongue seen from above: tip at the bottom',13,C.muted);
  // Right panel: bars by region.
  out+=TBF(330,62,`${T6.name}: response by region`,15,C.ink,'start');
  const names=['Tip','Front, left','Front, right','Back, left','Back, right','Back'];
  names.forEach((n,i)=>{const y=82+i*36;out+=TF(330,y+16,n,13,C.muted,'start')+R(430,y+3,140,18,'#fff',C.grid,4)+R(430,y+3,140*vals[i],18,T6.col,'none',4)});
  if(myth&&s.t==='umami')out+=R(326,302,256,46,C.coralp,'none',8)+S6_lines(336,321,['Umami is missing from the myth map:','it was not accepted in the West until the 1980s.'],13,C.coral);
  else out+=S6_chip(330,312,myth?'myth':'est')+TF(330+(myth?70:116),327,myth?'Boring 1942':'Collings 1974',13,C.muted,'start');
  return {svg:out,phase:myth?`The myth map gives ${T6.name.toLowerCase()} one region. Hänig’s 1901 data showed only small differences in threshold around the edge of the tongue; the 1942 redrawing turned “slightly more sensitive” into “only here”. Try it yourself: a little sugar on the back of the tongue tastes sweet.`:`Every region responds to ${T6.name.toLowerCase()}. The differences are small (the bars are illustrative only). Taste buds anywhere carry receptors for all five qualities, and the soft palate and throat taste too.`};
 }});

const S6_REC={
 sweet:{rec:'T1R2 + T1R3 pair',sig:'Sugars: energy',status:'est',more:'One receptor pair detects sugars and sweeteners such as aspartame and stevia.'},
 umami:{rec:'T1R1 + T1R3 pair',sig:'Glutamate: protein',status:'est',more:'Shares T1R3 with sweet. Inosinate and guanylate boost it strongly.'},
 bitter:{rec:'About 25 TAS2R receptors',sig:'Possible poisons',status:'est',more:'Many receptors, each tuned to several compounds; genes vary, so bitterness differs between people.'},
 salty:{rec:'ENaC channel (low salt)',sig:'Sodium: minerals',status:'mixed',more:'ENaC explains appealing low salt; how very salty food is detected is still being worked out.'},
 sour:{rec:'OTOP1 proton channel',sig:'Acids: unripe or spoiled',status:'est',more:'Identified only in 2018–2019, when the OTOP1 channel was shown to carry the sour signal.'}};
const S6_CAND=[['fat','Fat (“oleogustus”)','Running et al. 2015: fatty acids give a distinct, unpleasant quality. Receptors CD36 and GPR120 are candidates.'],['kokumi','Kokumi','“Richness” from some peptides via the calcium-sensing receptor. Mostly studied in Japan; debated as a taste.'],['starch','Starch','Lapis et al. 2016: people may sense starch breakdown products. Early evidence only.']];
SCENE({id:'five-tastes-receptors',name:'Five receptors, five signals',tag:'What each taste tells the body',
 definition:'Each basic taste has its own receptor molecules in taste cells, and each signals something useful: energy, protein, minerals, acidity or possible poison.',
 example:'Sweet and umami share one receptor half (T1R3); bitter uses about 25 different receptors, which is why people disagree about bitter foods.',
 desc:'Five taste cards, each with its receptor, what it signals and how well established it is, plus three candidate extra tastes.',
 research:'Chandrashekar, J. et al. (2006). The receptors and cells for mammalian taste. Nature 444, 288–294. Tu, Y.-H. et al. (2018). An evolutionarily conserved gene family encodes proton-selective ion channels. Science 359; Teng, B. et al. (2019) on OTOP1 and sour. Running, C. A., Craig, B. A. & Mattes, R. D. (2015). Oleogustus. Chemical Senses 40. Lapis, T. J. et al. (2016). Chemical Senses 41.',
 dur:10,hint:'Press a taste card, or one of the candidate “sixth tastes” at the bottom.',
 init:()=>({t:'sweet',cand:''}),
 watch(p){const i=Math.min(7,Math.floor(p*8));return i<5?{t:S6_TASTES[i].k,cand:''}:{t:'sweet',cand:S6_CAND[i-5][0]}},
 on:{t(s,v){s.t=v;s.cand='';return 'keep'},cand(s,v){s.cand=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('Five tastes, five receptors',26);
  S6_TASTES.forEach((t,i)=>{const sel=!s.cand&&s.t===t.k;out+=S6_btn(X,'t',t.k,`${t.name} taste`,24+i*112,46,100,44,t.name,{sel,stroke:t.col,ink:t.col,bold:true,fill:sel?'#fff':'#fbfbfd'})});
  if(!s.cand){const r=S6_REC[s.t],T6=S6_TASTES.find(t=>t.k===s.t);
   out+=R(24,104,552,150,'#fff',T6.col,10,'stroke-width="1.5"');
   out+=TBF(44,134,T6.name,18,T6.col,'start')+S6_chip(556,118,r.status,'end');
   out+=TF(44,164,'Receptor:',13,C.muted,'start')+TBF(124,164,r.rec,15,C.ink,'start');
   out+=TF(44,192,'Signals:',13,C.muted,'start')+TBF(124,192,r.sig,15,C.ink,'start');
   out+=S6_lines(44,222,S6_wrap(r.more,66),14,C.ink);}
  else{const c=S6_CAND.find(c=>c[0]===s.cand);
   out+=R(24,104,552,150,'#fff',C.purple,10,'stroke-width="1.5"')+TBF(44,134,c[1],18,C.purple,'start')+S6_chip(556,118,'debated','end');
   out+=S6_lines(44,166,S6_wrap(c[2],66),14,C.ink);}
  out+=TF(24,286,'Candidate sixth tastes (press one):',13,C.muted,'start');
  S6_CAND.forEach((c,i)=>{out+=S6_btn(X,'cand',c[0],`Candidate taste: ${c[1]}`,24+i*186,296,174,40,c[1],{sel:s.cand===c[0],stroke:C.purple,ink:C.purple})});
  out+=TF(300,364,'Smells, textures and heat (chilli) are not tastes, though they shape flavour.',13,C.muted);
  return {svg:out,phase:s.cand?'Candidate tastes need a receptor, a nerve pathway and a distinct quality that people can name. Fat has some of each; kokumi and starch are earlier in the chain of evidence.':'Taste is a small, old sense: a handful of receptors, each answering one yes-or-no question about food. Most of what we call flavour comes from smell, as the next lesson shows.'};
 }});

// Yamaguchi (1967): umami intensity y (as MSG equivalent, g/dL) = u + 1218·u·v, with u = MSG and v = IMP in g/dL.
const S6_umami=(u,v)=>u+1218*u*v;
SCENE({id:'five-tastes-umami',name:'Umami and its synergy',tag:'Kombu plus bonito: Ikeda’s taste',
 definition:'Umami is the savoury taste of glutamate, named by Kikunae Ikeda in 1908. Ribonucleotides such as inosinate (IMP) multiply it: together they taste far stronger than either alone.',
 example:'Japanese dashi pairs kombu (glutamate) with bonito flakes (inosinate); Western stocks pair meat with tomato or parmesan for the same reason.',
 desc:'Sliders for glutamate and inosinate concentrations, with the perceived umami strength on a log scale from Yamaguchi’s synergy formula.',
 research:'Ikeda, K. (1908; English translation 2002, Chemical Senses 27, 847–849). Yamaguchi, S. (1967). The synergistic taste effect of monosodium glutamate and disodium 5′-inosinate. Journal of Food Science 32, 473–478 (y = u + 1218uv). Zhang, F. et al. (2008). PNAS 105 (how IMP binds the receptor). Status: established.',
 dur:10,hint:'Move the glutamate and inosinate sliders. Try a little of both against a lot of one.',
 init:()=>({u:5,v:0}),
 watch(p){return p<.4?{u:Math.round(1+p/.4*9),v:0}:{u:5,v:Math.round((p-.4)/.6*25)}},
 ui:[{range:'u',label:'Glutamate (MSG)',min:0,max:10,get:s=>s.u,act:'u',show:v=>(v/100).toFixed(2)+' g/dL'},{range:'v',label:'Inosinate (IMP)',min:0,max:25,get:s=>s.v,act:'v',show:v=>(v/1000).toFixed(3)+' g/dL'}],
 on:{u(s,v){s.u=Number(v);return 'keep'},v(s,v){s.v=Number(v);return 'keep'}},
 draw(s){
  const u=s.u/100,v=s.v/1000,y=S6_umami(u,v),alone=u;
  let out=heading('Umami synergy: glutamate × inosinate',26);
  const pl=S6_plot(70,62,300,230,[0,1],[-3,1],{yt:[[-3,'0.001'],[-2,'0.01'],[-1,'0.1'],[0,'1']],yl:'strength (g/dL of MSG that tastes the same)'});
  out+=pl.svg;
  const bar=(x,val,col,lab)=>{const lv=val>0?clamp(Math.log10(val),-3,1):-3;return R(x,pl.Y(lv),70,pl.Y(-3)-pl.Y(lv),col,'none',4)+TF(x+35,312,lab,13,C.ink)};
  out+=bar(110,alone,'#c9a27a','Glutamate')+bar(210,y,'#8a4b1f','Together');
  out+=TF(145,pl.Y(alone>0?clamp(Math.log10(alone),-3,1):-3)-8,alone>0?alone.toFixed(2):'0',13,C.ink)+TF(245,pl.Y(y>0?clamp(Math.log10(y),-3,1):-3)-8,y>0?y.toFixed(2):'0',13,C.ink);
  out+=TF(110,336,'IMP alone has almost no umami taste.',13,C.muted,'start');
  const k=alone>0?y/alone:0;
  out+=R(392,62,190,230,C.pale,'none',10)+TBF(487,94,'Boost',15,C.ink)+TBF(487,136,alone>0?`×${k<10?k.toFixed(1):Math.round(k)}`:'—',34,'#8a4b1f');
  out+=S6_lines(404,176,['y = u + 1218·u·v','u = MSG, v = IMP','(both in g/dL)','Yamaguchi 1967'],13,C.ink,'start',20);
  out+=S6_chip(404,262,'est');
  return {svg:out,phase:v===0?'With glutamate alone, strength simply follows the amount. Now add a little inosinate.':`Adding ${(v*1000).toFixed(0)} mg/dL of inosinate makes the glutamate taste ${k.toFixed(0)} times stronger. Inosinate binds next to glutamate on the receptor and holds it in place (Zhang et al. 2008), which is why stock makers pair kombu with bonito, or meat with tomato.`};
 }});

/* =========================================================== retronasal-smell */
const S6_FOODS=[['strawberry','Strawberry',['sweet','sour'],'strawberry'],['coffee','Coffee',['bitter'],'roasted coffee'],['cinnamon','Cinnamon toast',['sweet'],'cinnamon']];
function S6_head(){
 // Simplified side view facing right: nose at right, mouth below, throat at left.
 return P('M90 340 L90 210 C90 120 150 62 240 60 C330 58 380 92 392 150 L430 186 L404 196 L410 222 L398 230 L404 250 C404 286 370 300 330 300 L300 340 Z','#8a6f63',2.4,'#f6e6dd')
  +P('M250 150 C300 140 360 150 400 186','#c8a597',2,'#fbefe8')+P('M250 238 C300 236 360 240 398 238','#c8a597',2,'#fbefe8')
  +P('M250 150 C232 170 232 222 250 238','#c8a597',2,'none')+R(262,118,90,14,'#e7b86b','#b0842f',6)+TF(307,112,'smell receptors',13,'#8a5f1a');
}
SCENE({id:'retronasal-smell',name:'Smelling from the inside',tag:'Most of “taste” is smell',
 definition:'Retronasal smell is smell from the inside: as you chew and breathe out, aromas rise from the back of the mouth into the nose. The brain reports the result as taste, but it is smell.',
 example:'With your nose pinched, a strawberry tastes sweet and a little sour; release the nose and “strawberry” arrives.',
 desc:'A side view of the head with the two routes to the smell receptors, a pinch switch, and bars for what reaches the brain from a chosen food.',
 research:'Rozin, P. (1982). “Taste–smell confusions” and the duality of the olfactory sense. Perception & Psychophysics 31, 397–401. Shepherd, G. M. (2006). Smell images and the flavour system in the human brain. Nature 444. Murphy, Cain & Bartoshuk (1977). Mutual action of taste and olfaction. Sensory Processes 1. Status: established.',
 dur:10,hint:'Choose a food, a route and whether the nose is pinched. Breathing out through the nose carries the aroma in.',
 init:()=>({food:'strawberry',route:'retro',pinch:'open'}),
 watch(p){return {food:'strawberry',route:p<.33?'ortho':'retro',pinch:p<.66?'open':'pinched'}},
 ui:[{choose:S6_FOODS.map(f=>[f[0],f[1]]),label:'Food',get:s=>s.food,act:'food'},{choose:[['ortho','Sniffing'],['retro','Chewing']],label:'Route',get:s=>s.route,act:'route'},{choose:[['open','Nose open'],['pinched','Nose pinched']],label:'Nose',get:s=>s.pinch,act:'pinch'}],
 on:{food(s,v){s.food=v;return 'keep'},route(s,v){s.route=v;return 'keep'},pinch(s,v){s.pinch=v;return 'keep'}},
 draw(s){
  const fd=S6_FOODS.find(f=>f[0]===s.food),pinched=s.pinch==='pinched',ortho=s.route==='ortho';
  // Pinching stops airflow through the nose, so neither route delivers aroma (the trapped air does not move).
  const aroma=pinched?0:1;
  let out=heading(ortho?'Sniffing: aroma enters at the front':'Chewing: aroma rises from the back',26)+S6_head();
  if(ortho){out+=arrow(470,176,412,190,aroma?C.blue:C.line,2.4)+arrow(400,184,330,140,aroma?C.blue:C.line,2.4)+Ci(486,174,10,'#e05a6a')+TF(486,206,'food',13,C.muted)}
  else{out+=Ci(320,262,11,'#e05a6a')+TF(320,290,'food',13,C.muted)+curveArrow(300,256,236,186,-30,aroma?C.blue:C.line,2.4)+arrow(240,176,280,134,aroma?C.blue:C.line,2.4)}
  if(pinched)out+=R(402,176,34,54,'none',C.coral,8,'stroke-width="3" stroke-dasharray="5 4"')+TF(420,246,'pinched',13,C.coral);
  out+=TF(80,360,'Side view (simplified). Tongue taste is not drawn.',13,C.muted,'start');
  // Right panel: what reaches the brain.
  const tasteOn=!ortho;
  out+=R(452,52,132,234,C.pale,'none',10)+TBF(518,76,'Brain gets',14,C.ink);
  const rows=[['taste',tasteOn?fd[2].join(' + '):'nothing',tasteOn],['smell',aroma?fd[3]:'nothing',!!aroma]];
  rows.forEach((r,i)=>{const y=96+i*70;out+=TF(464,y+14,r[0],13,C.muted,'start')+R(464,y+20,108,28,r[2]?'#fff':'#eef2f5',r[2]?C.blue:C.line,6)+TF(518,y+39,r[1].length>14?r[1].slice(0,13)+'…':r[1],13,r[2]?C.ink:C.muted)});
  const name=ortho?(aroma?`smells of ${fd[3]}`:'no smell'):(aroma?fd[1].toLowerCase():fd[2].join(' and '));
  out+=TBF(518,248,ortho?'You notice:':'You call it:',13,C.ink)+TF(518,268,name.length>16?name.slice(0,15)+'…':name,13,C.blue);
  return {svg:out,phase:ortho?(pinched?'With the nose pinched no air moves through it, so even a sniff brings in no aroma.':`Sniffing brings ${fd[3]} aroma in through the nostrils: smell from the outside.`):(pinched?`Chewing with the nose pinched: the tongue still reports ${fd[2].join(' and ')}, but no aroma can travel up the back route without airflow. This is what most people mean when food tastes of nothing.`:`Chewing with the nose open: breathing out carries ${fd[3]} aroma up behind the palate. The brain files it as taste, which is why Rozin called smell a dual sense.`)};
 }});

const S6_JB_Q1=[['basic','Only sweet (or sour)'],['vague','Some flavour, could not name it'],['named','Named the flavour']];
const S6_JB_Q2=[['burst','Flavour arrived'],['same','No change']];
SCENE({id:'retronasal-smell-jellybean',name:'The pinched-nose test',tag:'Try it with a sweet or a jelly bean',
 definition:'In the pinched-nose test you eat a flavoured sweet with your nose closed, then open it. The rush of flavour on opening is retronasal smell arriving.',
 example:'Most people can tell only that the sweet is sweet (and perhaps sour) until they let go of their nose.',
 desc:'Step-by-step instructions for a home test, buttons to record what you noticed with the nose pinched and after releasing it, and the typical pattern for comparison.',
 research:'Mozell, M. M. et al. (1969). Nasal chemoreception in flavor identification. Archives of Otolaryngology 90, 367–373 (identification falls sharply with the nose closed). Rozin 1982. Status: robust and easy to repeat.',
 dur:10,hint:'Only do this with a food that is safe for you. Hold your nose, chew and swallow normally, then let go. Your answers stay in this page.',
 init:()=>({q1:'',q2:'',sim:false}),
 watch(p){return {q1:p<.33?'':'basic',q2:p<.66?'':'burst',sim:true}},
 ui:[{choose:S6_JB_Q1,label:'Nose pinched, I noticed',get:s=>s.q1,act:'q1'},{choose:S6_JB_Q2,label:'After letting go',get:s=>s.q2,act:'q2'},{b:'Clear my answers',act:'clear'}],
 on:{q1(s,v){s.q1=v;s.sim=false;return 'keep'},q2(s,v){s.q2=v;s.sim=false;return 'keep'},clear(s){s.q1='';s.q2='';s.sim=false;return 'keep'}},
 draw(s){
  let out=heading('The pinched-nose test',26);
  const steps=['1. Choose a sweet with a clear flavour.','2. Pinch your nose shut and keep it shut.','3. Chew. What can you tell about it?','4. Let go of your nose while still chewing.'];
  out+=R(20,44,560,104,C.pale,'none',10)+S6_lines(36,68,steps,14,C.ink,'start',22);
  const who=s.sim?'Simulated participant':'You';
  out+=TBF(30,180,who,15,C.blue,'start')+TBF(330,180,'Typical result',15,C.coral,'start');
  const a1=S6_JB_Q1.find(q=>q[0]===s.q1),a2=S6_JB_Q2.find(q=>q[0]===s.q2);
  out+=TF(30,208,'Nose pinched:',13,C.muted,'start')+TF(30,230,a1?a1[1]:'— not answered yet',14,a1?C.ink:C.muted,'start');
  out+=TF(30,264,'After letting go:',13,C.muted,'start')+TF(30,286,a2?a2[1]:'— not answered yet',14,a2?C.ink:C.muted,'start');
  out+=TF(330,208,'Nose pinched:',13,C.muted,'start')+TF(330,230,'Sweet or sour only',14,C.ink,'start');
  out+=TF(330,264,'After letting go:',13,C.muted,'start')+TF(330,286,'A rush of named flavour',14,C.ink,'start');
  out+=L(306,166,306,300,C.grid,1.5);
  const match=s.q1&&s.q2?(s.q1==='basic'&&s.q2==='burst'?'Your result matches the usual pattern.':s.q1==='named'?'Naming it with the nose shut is uncommon: perhaps a strong taste cue, or a leaky pinch.':'A partial match: the usual pattern is “only sweet”, then a rush of flavour.'):'Record both answers to compare.';
  out+=R(20,316,560,44,s.q1&&s.q2?C.greenp:'#f4f6f8','none',8)+TF(300,343,match,14,s.q1&&s.q2?C.green:C.muted);
  return {svg:out,phase:'Pinching the nose stops air moving through it, so aroma cannot reach the smell receptors from the mouth. The tongue still reports sweet and sour. When you let go, the out-breath carries the aroma up the back route and the flavour “appears”. Mozell and colleagues found people named far fewer flavours with the nose closed.'};
 }});

SCENE({id:'retronasal-smell-cold',name:'Why food is bland with a cold',tag:'Blocked nose, missing flavour',
 definition:'A blocked nose reduces the airflow that carries aroma from the mouth to the smell receptors, so flavour fades while the basic tastes stay.',
 example:'With a heavy cold, soup tastes of salt and little else; as the nose clears, the flavour comes back.',
 desc:'A congestion slider showing the airflow reaching the smell receptors, the share of flavour from aroma that survives, and the basic tastes, which stay constant.',
 research:'Rozin 1982. Hummel, T. & Livermore, A. on airflow and retronasal smell. Doty, R. L. (2015). Handbook of Olfaction and Gustation. The curve shape here is illustrative; the qualitative effect is well established.',
 dur:10,hint:'Move the congestion slider. Taste bars stay put; the aroma bar follows airflow.',
 init:()=>({c:0}),
 watch(p){return {c:Math.round(p*100)}},
 ui:[{range:'c',label:'Nasal blockage',min:0,max:100,step:5,get:s=>s.c,act:'c',show:v=>v+'%'}],
 on:{c(s,v){s.c=Number(v);return 'keep'}},
 draw(s){
  const flow=1-s.c/100,aroma=flow*flow*(3-2*flow);
  let out=heading('A cold: taste stays, flavour fades',26);
  const pl=S6_plot(70,60,280,220,[0,100],[0,100],{xt:[[0,'0%'],[50,'50%'],[100,'100%']],yt:[[0,'0'],[50,'50'],[100,'100']],xl:'nasal blockage',yl:'aroma reaching receptors (%)'});
  out+=pl.svg;const pts=[];for(let c=0;c<=100;c+=2){const fl=1-c/100;pts.push([pl.X(c),pl.Y(100*fl*fl*(3-2*fl))])}
  out+=S6_poly(pts,C.blue)+Ci(pl.X(s.c),pl.Y(100*aroma),7,C.blue,'#fff');
  out+=TF(70,350,'Curve shape is illustrative.',13,C.muted,'start');
  out+=R(380,60,200,220,C.pale,'none',10)+TBF(480,86,'Soup with a cold',14,C.ink);
  const bars=[['salty',1,'#2f6db3'],['umami',1,'#8a4b1f'],['aroma',aroma,C.blue]];
  bars.forEach((b,i)=>{const y=108+i*52;out+=TF(394,y+12,b[0],13,C.muted,'start')+R(394,y+18,172,20,'#fff',C.grid,4)+R(394,y+18,172*b[1],20,b[2],'none',4)});
  out+=TF(480,276,aroma>.7?'tastes like soup':aroma>.3?'muted flavour':'salty water',13,C.ink);
  return {svg:out,phase:s.c<20?'With a clear nose, aroma from the soup reaches the smell receptors on every out-breath.':s.c<70?'Partial blockage cuts the airflow, and the flavour turns muted while saltiness stays.':'With the nose almost blocked, little aroma arrives: you taste salt and savouriness but not “chicken” or “tomato”. Taste itself is unchanged by a cold.'};
 }});

/* =========================================================== pheromones */
// A moth upwind of a pheromone source: plume puffs are seeded; the moth surges upwind while in the plume.
function S6_moth(wind,t){
 const r=S6_rng(17),puffs=[];
 for(let i=0;i<46;i++){const age=((t*1.4+i/46)%1),x=110+age*390*(wind?1:.25),spread=wind?6+age*44:20+age*70,y=190+(r()*2-1)*spread+(wind?Math.sin(age*9+i)*10:0);puffs.push([x,y,age])}
 return puffs;
}
SCENE({id:'pheromones',name:'Pheromones in animals',tag:'A moth follows one molecule upwind',
 definition:'A pheromone is a chemical signal, released by one animal, that triggers a specific response in another of the same species. The first identified was bombykol, the silkmoth’s sex attractant.',
 example:'A male silkmoth detects bombykol with feathery antennae and walks upwind in zigzags, wings fanning, surging while it is inside the scent plume. (Domesticated silkmoths cannot fly; flying moths track a plume in the same way.)',
 desc:'A wind tunnel with a female silkmoth releasing bombykol on the left; a wind switch and time slider show the plume and the male’s upwind path.',
 research:'Butenandt, A. et al. (1959). Über den Sexuallockstoff des Seidenspinners Bombyx mori. Zeitschrift für Naturforschung B 14 (bombykol, from about 500,000 moths). Kaissling, K.-E. & Priesner, E. (1970). Die Riechschwelle des Seidenspinners. Naturwissenschaften 57 (single molecules fire receptor cells). Karlson & Lüscher (1959) coined “pheromone”. Status: established in insects and many mammals.',
 dur:10,hint:'Switch the wind on and off and move through time. Without wind the plume has no direction to follow.',
 init:()=>({wind:'on',t:40}),
 watch(p){return {wind:p<.7?'on':'off',t:Math.round((p%.7)/.7*100)}},
 ui:[{choose:[['on','Wind on'],['off','Still air']],label:'Air',get:s=>s.wind,act:'wind'},{range:'t',label:'Time',min:0,max:100,get:s=>s.t,act:'t',show:v=>v+' s'}],
 on:{wind(s,v){s.wind=v;return 'keep'},t(s,v){s.t=Number(v);return 'keep'}},
 draw(s){
  const wind=s.wind==='on',tt=s.t/100;
  let out=heading(wind?'The male heads upwind in the plume':'Still air: no direction to follow',26);
  out+=R(40,70,520,240,'#f7fafc',C.grid,8);
  if(wind)for(let i=0;i<4;i++)out+=arrow(70+i*130,88,120+i*130,88,C.line,1.5);
  out+=TF(300,84,wind?'wind':'',13,C.muted);
  S6_moth(wind,tt).forEach(p=>{if(p[0]<556)out+=Ci(p[0],p[1],4+3*p[2],'#c0508a','none',`fill-opacity="${fmt(.55*(1-p[2]))}"`)});
  out+=Ci(100,190,12,'#8a6f63')+TF(100,226,'female',13,C.ink);
  // Male path: in wind, zigzag upwind from x=520 towards the source; in still air, loops.
  const pts=[];const N=Math.round(tt*60);
  for(let i=0;i<=N;i++){const u=i/60;pts.push(wind?[520-360*u,190+Math.sin(u*28)*(38*(1-u)+6)]:[440+50*Math.cos(u*12),190+60*Math.sin(u*12)])}
  if(pts.length>1)out+=S6_poly(pts,C.blue,2,'stroke-dasharray="4 4"');
  const m=pts[pts.length-1]||[520,190];out+=P(`M${fmt(m[0]-12)} ${fmt(m[1]-8)} L${fmt(m[0])} ${fmt(m[1])} L${fmt(m[0]-12)} ${fmt(m[1]+8)}`,C.blue,3)+Ci(m[0],m[1],5,C.blue);
  out+=TF(m[0],m[1]-16,'male',13,C.blue);
  out+=S6_chip(40,324,'est')+TF(160,339,'Pheromones are well shown in insects and many mammals.',13,C.ink,'start');
  return {svg:out,phase:wind?'The plume breaks into patchy filaments. While the male is in scent he surges upwind; when he loses it he casts side to side until he finds it again. A single bombykol molecule can fire one of his receptor cells.':'Without wind the scent spreads in every direction and gives no bearing: the male circles. Heading upwind on contact with odour is the key behaviour, not following a gradient.'};
 }});

const S6_PHER=[
 {k:'vno',t:'A pheromone organ',claim:'Humans detect pheromones with a vomeronasal organ, as mice do.',ev:'Adult humans have at most a tiny pit with no working receptor neurons; most of the genes are broken (pseudogenes).',st:'no'},
 {k:'sync',t:'Menstrual synchrony',claim:'Women living together synchronise their cycles (McClintock 1971).',ev:'Larger later studies found no synchrony beyond chance (Yang & Schank 2006; Ziomkiewicz 2006).',st:'no'},
 {k:'andro',t:'Androstadienone',claim:'A molecule in male sweat is a human pheromone.',ev:'Effects on mood and attention are small and inconsistent; never shown to meet the pheromone test (Wyatt 2015).',st:'mixed'},
 {k:'mhc',t:'Sweaty T-shirts and MHC',claim:'People prefer the body odour of partners with different immune genes (Wedekind 1995).',ev:'Replications are mixed; a review found inconsistent results (Havlicek & Roberts 2009).',st:'mixed'},
 {k:'nipple',t:'Newborns and the breast',claim:'Secretions from areolar glands help newborns find the nipple (Doucet 2009).',ev:'Suggestive behavioural evidence; the molecule has not been identified.',st:'cand'},
 {k:'spray',t:'“Pheromone” perfumes',claim:'Sprays sold to make you more attractive.',ev:'No good evidence that any of them work.',st:'myth'}];
SCENE({id:'pheromones-human',name:'Human pheromones?',tag:'Six claims and their evidence',
 definition:'No human pheromone has been identified by the standards used for animals: a specific molecule, released naturally, that reliably triggers a specific response.',
 example:'The menstrual-synchrony story from 1971 is still widely repeated, though larger studies did not find it.',
 desc:'Six cards with a claim about human pheromones; press one to see the evidence and its status.',
 research:'Wyatt, T. D. (2015). The search for human pheromones: the lost decades and the necessity of returning to first principles. Proceedings of the Royal Society B 282, 20142994. McClintock, M. K. (1971). Nature 229. Yang, Z. & Schank, J. C. (2006). Human Nature 17. Wedekind, C. et al. (1995). Proc. R. Soc. B 260. Havlicek, J. & Roberts, S. C. (2009). Psychoneuroendocrinology 34. Doucet, S. et al. (2009). PLoS ONE 4.',
 dur:12,hint:'Press a card to see what the evidence says.',
 init:()=>({k:'sync'}),
 watch(p){return {k:S6_PHER[Math.min(5,Math.floor(p*6))].k}},
 on:{k(s,v){s.k=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('Human pheromones: claims and evidence',26);
  S6_PHER.forEach((c,i)=>{const x=24+(i%3)*188,y=44+Math.floor(i/3)*56,sel=s.k===c.k,col=S6_STATUS[c.st][1];out+=S6_btn(X,'k',c.k,c.t,x,y,176,46,S6_wrap(c.t,22),{sel,stroke:sel?col:C.line,size:13})});
  const c=S6_PHER.find(c=>c.k===s.k);
  out+=R(24,166,552,180,'#fff',S6_STATUS[c.st][1],10,'stroke-width="1.5"');
  out+=TBF(44,194,c.t,17,C.ink,'start')+S6_chip(556,178,c.st,'end');
  out+=TF(44,222,'Claim',13,C.muted,'start')+S6_lines(44,242,S6_wrap(c.claim,68),14,C.ink);
  out+=TF(44,286,'Evidence',13,C.muted,'start')+S6_lines(44,306,S6_wrap(c.ev,68),14,C.ink);
  return {svg:out,phase:'Human body odour certainly carries information: people can recognise kin, and smell changes with illness and emotion. But a pheromone is a specific molecule with a specific effect, and Wyatt (2015) argues the field spent decades testing molecules chosen without first finding a real response to explain.'};
 }});

// Two cycles of different length: onset difference (days, folded to the nearest) over months.
function S6_onsetDiff(a,b,days){const out=[];let ta=0,tb=3;while(ta<=days){while(tb+b<=ta)tb+=b;const d1=ta-tb,d2=tb+b-ta;out.push([ta,Math.min(Math.abs(d1),Math.abs(d2))]);ta+=a}return out}
SCENE({id:'pheromones-synchrony',name:'Synchrony by chance',tag:'Why cycles seem to converge',
 definition:'Two repeating cycles of slightly different lengths drift in and out of step on their own. Seen over a few months, the drifting can look like synchronising.',
 example:'With cycles of 28 and 30 days, onsets that start 3 days apart drift apart and come back together over about 14 cycles, a little over a year.',
 desc:'Two cycle lengths and the gap between their onsets plotted over 18 months; there is no interaction in this model, only arithmetic.',
 research:'Schank, J. C. (2001). Menstrual-cycle synchrony: problems and new directions for research. Journal of Comparative Psychology 115, 3–15. Yang & Schank (2006). Wilson, H. C. (1992). A critical review of menstrual synchrony research. Psychoneuroendocrinology 17. Status: synchrony not supported.',
 dur:10,hint:'Change the second cycle length. The model has no influence between the two people at all.',
 init:()=>({b:30}),
 watch(p){return {b:26+Math.round(p*8)}},
 ui:[{range:'b',label:'Second cycle length',min:24,max:35,get:s=>s.b,act:'b',show:v=>v+' days'}],
 on:{b(s,v){s.b=Number(v);return 'keep'}},
 draw(s){
  const a=28,pts=S6_onsetDiff(a,s.b,540);
  let out=heading('Two cycles, no interaction',26);
  const pl=S6_plot(70,60,470,220,[0,540],[0,18],{xt:[[0,'0'],[90,'3'],[180,'6'],[270,'9'],[360,'12'],[450,'15'],[540,'18']],yt:[[0,'0'],[6,'6'],[12,'12'],[18,'18']],xl:'months',yl:'days between onsets'});
  out+=pl.svg+R(pl.X(0),pl.Y(3),470,pl.Y(0)-pl.Y(3),C.greenp,'none',0,'fill-opacity="0.8"')+TF(pl.X(536),pl.Y(1.5)+4,'“in sync”',13,C.green,'end');
  out+=S6_poly(pts.map(p=>[pl.X(p[0]),pl.Y(Math.min(18,p[1]))]),C.blue,2.4);
  pts.forEach(p=>{out+=Ci(pl.X(p[0]),pl.Y(Math.min(18,p[1])),3.5,C.blue)});
  const inSync=pts.filter(p=>p[1]<=3).length;
  out+=TF(70,350,`Person A: 28 days · Person B: ${s.b} days · onsets within 3 days in ${inSync} of ${pts.length} cycles`,13,C.ink,'start');
  return {svg:out,phase:s.b===a?'Equal cycle lengths keep the starting gap for ever, without any interaction.':`The gap shrinks and grows by ${Math.abs(s.b-a)} day${Math.abs(s.b-a)>1?'s':''} each cycle. A study that happens to catch the shrinking part will report “synchrony”; one that runs longer sees the gap open again. Schank (2001) showed this is enough to explain the early reports.`};
 }});

/* =========================================================== smell-emotion */
const S6_ODOURS=[['vanilla','Vanilla (vanillin)'],['clove','Cloves (eugenol)'],['rose','Rose (phenylethyl alcohol)'],['pineapple','Pineapple sweet (ethyl butyrate)'],['cheese','Sweaty feet (isovaleric acid)'],['lemon','Lemon peel (limonene)']];
function S6_odourOrder(seed){return shuffled(range(6),S6_mix(seed))}
SCENE({id:'smell-emotion',name:'Pleasant or unpleasant?',tag:'Rate six smells from memory',
 definition:'Odour pleasantness (hedonic value) is the first thing people judge about a smell. Across cultures, people largely agree on which smells are pleasant, though individuals differ a lot.',
 example:'In a study across nine cultures, vanillin was rated most pleasant and isovaleric acid (the smell of sweaty feet and some cheeses) least.',
 desc:'Rate six smells you know, from 1 (very unpleasant) to 7 (very pleasant), in a seeded order. Your ratings appear beside how much of the variation in a large study came from the molecule, the person and the culture.',
 research:'Arshamian, A. et al. (2022). The perception of odor pleasantness is shared across cultures. Current Biology 32, 2061–2066 (variance roughly: molecule 41%, individual 54%, culture 6%; values approximate). Khan, R. M. et al. (2007). Predicting odor pleasantness from odorant structure. Journal of Neuroscience 27.',
 dur:12,hint:'Press a rating for each smell as it comes up. Rating from memory is not the same as smelling, but the ranking is usually similar. Your answers stay in this page.',
 init:()=>({seed:6,i:0,r:{}}),
 watch(p){const n=Math.min(6,Math.floor(p*7)),sim={vanilla:6,clove:5,rose:5,pineapple:5,cheese:2,lemon:6},r={};S6_odourOrder(6).slice(0,n).forEach(k=>{r[S6_ODOURS[k][0]]=sim[S6_ODOURS[k][0]]});return {seed:6,i:n,r,sim:true}},
 ui:[{b:'Start again',act:'again'}],
 on:{rate(s,v){if(s.i>=6)return 'keep';const k=S6_odourOrder(s.seed)[s.i];s.r[S6_ODOURS[k][0]]=Number(v);s.i++;s.sim=false;return 'keep'},again(s){s.seed=nextSeed();s.i=0;s.r={};s.sim=false;return 'keep'}},
 draw(s,f,X){
  let out=heading('Rate six smells from memory',26);
  if(s.i<6){const k=S6_odourOrder(s.seed)[s.i];
   out+=R(20,42,560,84,C.pale,'none',10)+TF(300,64,`Smell ${s.i+1} of 6`,13,C.muted)+TBF(300,90,S6_ODOURS[k][1],17,C.ink);
   for(let v=1;v<=7;v++)out+=S6_btn(X,'rate',v,`Rate ${v}`,44+(v-1)*74,100,58,22,String(v),{size:13});
  }else out+=R(20,42,560,84,C.greenp,'none',10)+TBF(300,78,s.sim?'Simulated participant: all six rated':'All six rated',16,C.green)+TF(300,104,'Press Start again for a new order.',13,C.ink);
  out+=TF(44,140,'1 = very unpleasant',13,C.muted,'start')+TF(556,140,'7 = very pleasant',13,C.muted,'end');
  // Your ratings as bars.
  out+=TBF(24,170,s.sim?'Simulated ratings':'Your ratings',14,C.blue,'start');
  S6_ODOURS.forEach((o,i)=>{const y=180+i*28,v=s.r[o[0]];out+=TF(24,y+16,o[1].split(' (')[0],13,C.ink,'start')+R(150,y+4,150,16,'#fff',C.grid,4)+(v?R(150,y+4,150*v/7,16,v>=5?C.green:v<=3?C.coral:C.amber,'none',4)+TF(308,y+17,String(v),13,C.ink,'start'):'')});
  // Study variance split.
  out+=R(340,160,240,190,C.pale,'none',10)+TBF(460,184,'What varies (9 cultures)',14,C.ink);
  const parts=[['molecule',41,C.blue],['person',54,C.purple],['culture',6,C.amber]];
  parts.forEach((p,i)=>{const y=200+i*34;out+=TF(354,y+16,p[0],13,C.ink,'start')+R(430,y+4,130,18,'#fff',C.grid,4)+R(430,y+4,130*p[1]/60,18,p[2],'none',4)+TF(566,y+17,p[1]+'%','13',C.ink,'end')});
  out+=TF(460,318,'approximate, Arshamian 2022',13,C.muted)+TF(460,338,'vanillin top, isovaleric acid bottom',13,C.muted);
  const v=s.r.vanilla,c=s.r.cheese;
  return {svg:out,phase:s.i<6?'Rate each smell as you remember it. There are no right answers: this is about how the ranking compares.':(v&&c&&v>c?`${s.sim?'The simulated participant':'You'} rated vanilla above sweaty feet, as nearly everyone does. Arshamian and colleagues found the molecule explains a large share of pleasantness, the individual even more, and culture very little.`:'Your ranking differs from the usual one for vanilla and sweaty feet: individual differences are large, so this happens. Culture, surprisingly, explains only a small share.')};
 }});

SCENE({id:'smell-emotion-naming',name:'Naming smells',tag:'Some languages have words for smells',
 definition:'Codability is how consistently speakers of a language name something. English speakers name colours consistently but struggle to name smells; speakers of Jahai, a language of the Malay Peninsula, name smells as easily as colours.',
 example:'Asked to name cinnamon, English speakers gave long, varied descriptions (“sweet, like chewing gum”); Jahai speakers used a small set of abstract smell words.',
 desc:'Bars for naming agreement on colours and smells, for English and Jahai speakers, from Majid and Burenhult’s 2014 study (heights approximate).',
 research:'Majid, A. & Burenhult, N. (2014). Odors are expressible in language, as long as you speak the right language. Cognition 130, 266–270. Wnuk, E. & Majid, A. (2014). Revisiting the limits of language: the odor lexicon of Maniq. Cognition 131. Majid, A. et al. (2018). PNAS 115 (20 languages). Bar heights are approximate; the pattern is the published finding.',
 dur:10,hint:'Choose a group to highlight. The point is the gap between colours and smells, not the exact heights.',
 init:()=>({g:'english'}),
 watch(p){return {g:p<.5?'english':'jahai'}},
 ui:[{choose:[['english','English speakers'],['jahai','Jahai speakers']],label:'Group',get:s=>s.g,act:'g'}],
 on:{g(s,v){s.g=v;return 'keep'}},
 draw(s){
  const data={english:[.62,.12],jahai:[.58,.55]};
  let out=heading('How consistently do people name them?',26);
  const pl=S6_plot(90,56,300,230,[0,4],[0,1],{yt:[[0,'0'],[.5,'0.5'],[1,'1']],yl:'naming agreement (approximate)'});
  out+=pl.svg;
  [['english','English'],['jahai','Jahai']].forEach(([g,name],gi)=>{const d=data[g],on=s.g===g;
   ['colours','smells'].forEach((k,j)=>{const x=pl.X(gi*2+j+.2),w=pl.X(.6)-pl.X(0);out+=R(x,pl.Y(d[j]),w,pl.Y(0)-pl.Y(d[j]),j?'#c0508a':C.blue,'none',4,`fill-opacity="${on?1:.3}"`)});
   out+=TF(pl.X(gi*2+1),306,name,14,on?C.ink:C.muted)});
  out+=R(100,64,14,14,C.blue,'none',3)+TF(120,76,'colours',13,C.ink,'start')+R(196,64,14,14,'#c0508a','none',3)+TF(216,76,'smells',13,C.ink,'start');
  out+=R(410,56,170,230,C.pale,'none',10);
  out+=S6_lines(422,82,s.g==='english'?['English speakers','describe smells by','sources: “like','lemon”, “like a','barbecue”. Answers','vary widely.']:['Jahai has about a','dozen abstract','smell words, like','our colour words.','Hunting and foraging','life uses them daily.'],13,C.ink,'start',20);
  out+=TF(90,346,'The Maniq of Thailand show the same pattern (Wnuk & Majid 2014).',13,C.muted,'start');
  return {svg:out,phase:s.g==='english'?'English speakers name colours consistently but give scattered answers for smells. For a long time this was taken as a limit of the human brain.':'Jahai speakers name smells as consistently as colours. So the difficulty English speakers have is about language and culture, not a fixed limit of human smell.'};
 }});

SCENE({id:'smell-emotion-label',name:'The label changes the smell',tag:'Cheddar or body odour?',
 definition:'Verbal labels change how pleasant a smell seems, and even change activity in the brain’s reward areas. The same molecule can be judged pleasant or disgusting depending on what you are told it is.',
 example:'Isovaleric acid with cheddar flavour was rated more pleasant when labelled “cheddar cheese” than “body odour”.',
 desc:'One test odour with a choice of label; a pleasantness gauge and a small brain-activity bar for the orbitofrontal cortex (illustrative values; the direction is the published finding).',
 research:'de Araujo, I. E. et al. (2005). Cognitive modulation of olfactory processing. Neuron 46, 671–679. Herz, R. S. & von Clef, J. (2001). The influence of verbal labeling on the perception of odors. Perception 30, 381–391. Bar heights illustrative.',
 dur:10,hint:'Switch the label. Nothing about the smell changes.',
 init:()=>({lab:'cheese'}),
 watch(p){return {lab:p<.5?'cheese':'body'}},
 ui:[{choose:[['cheese','“Cheddar cheese”'],['body','“Body odour”'],['none','No label']],label:'Label',get:s=>s.lab,act:'lab'}],
 on:{lab(s,v){s.lab=v;return 'keep'}},
 draw(s){
  const val={cheese:.6,none:.35,body:.15}[s.lab],ofc={cheese:.75,none:.45,body:.3}[s.lab];
  let out=heading('Same molecule, different label',26);
  out+=R(40,52,520,70,C.pale,'none',10)+TF(300,78,'Test odour: isovaleric acid with cheddar flavour',14,C.ink);
  out+=TBF(300,106,s.lab==='none'?'(no label shown)':`Label shown: ${s.lab==='cheese'?'“Cheddar cheese”':'“Body odour”'}`,15,C.blue);
  // Gauge.
  const cx=180,cy=280,r=100;out+=P(`M${cx-r} ${cy} A${r} ${r} 0 0 1 ${cx+r} ${cy}`,C.grid,14);
  const ang=Math.PI*(1-val),nx=cx+Math.cos(ang)*(r-6),ny=cy-Math.sin(ang)*(r-6);
  out+=arrow(cx,cy,nx,ny,C.ink,3)+TF(cx-r,cy+22,'unpleasant',13,C.coral)+TF(cx+r,cy+22,'pleasant',13,C.green)+TBF(cx,156,'Pleasantness',14,C.ink);
  out+=R(360,150,200,170,'#fff',C.grid,8)+TBF(460,174,'Brain reward area',13,C.ink)+TF(460,192,'(orbitofrontal cortex)',13,C.muted);
  out+=R(410,300-100*ofc,100,100*ofc,C.purple,'none',4)+L(400,300,520,300,C.line,1.5);
  out+=TF(300,350,'Values illustrative; the direction is from de Araujo et al. 2005.',13,C.muted);
  return {svg:out,phase:s.lab==='cheese'?'Told it is cheese, people rate the smell as more pleasant, and the orbitofrontal cortex responds more strongly.':s.lab==='body'?'Told it is body odour, the identical smell is rated much less pleasant. Smell judgements are built partly from expectation.':'Without a label, people find this smell hard to place and rate it in between.'};
 }});

/* =========================================================== smell-training */
const S6_KIT=[['rose','Rose','phenylethyl alcohol','#c0508a'],['eucalyptus','Eucalyptus','eucalyptol','#2c776c'],['lemon','Lemon','citronellal','#b08900'],['clove','Clove','eugenol','#8a4b1f']];
SCENE({id:'smell-training',name:'Smell training',tag:'Four jars, twice a day, for 12 weeks',
 definition:'Smell training (olfactory training) means sniffing a set of strong odours on purpose, twice a day, for months, while thinking about each smell. It is used to help recovery after smell loss.',
 example:'The original kit used rose, eucalyptus, lemon and clove, each sniffed for about 10 seconds, morning and evening.',
 desc:'The four jars of the original study and a calendar slider counting sessions and sniffs over 12 weeks.',
 research:'Hummel, T. et al. (2009). Effects of olfactory training in patients with olfactory loss. The Laryngoscope 119, 496–499. Sorokowska, A. et al. (2017). Effects of olfactory training: a meta-analysis. Rhinology 55, 17–26. Status: moderate evidence; a cheap, safe option recommended in guidelines.',
 dur:10,hint:'Move through the 12 weeks. The routine matters more than the exact smells.',
 init:()=>({d:14}),
 watch(p){return {d:Math.round(p*84)}},
 ui:[{range:'d',label:'Day',min:0,max:84,get:s=>s.d,act:'d',show:v=>'day '+v}],
 on:{d(s,v){s.d=Number(v);return 'keep'}},
 draw(s){
  let out=heading('The smell-training routine',26);
  S6_KIT.forEach((k,i)=>{const x=40+i*136;out+=R(x,52,104,86,'#fff',k[3],12,'stroke-width="2"')+R(x+26,44,52,14,k[3],'none',4)+TBF(x+52,92,k[1],15,k[3])+TF(x+52,114,k[2],13,C.muted)});
  // Calendar: 12 weeks × 7 days.
  out+=TF(40,166,'12 weeks, each square a day (filled = done)',13,C.muted,'start');
  for(let w=0;w<12;w++)for(let d=0;d<7;d++){const n=w*7+d,x=40+w*44,y=176+d*20;out+=R(x,y,38,16,n<s.d?C.green:'#fff',n<s.d?'none':C.grid,3)}
  const sessions=s.d*2,sniffs=sessions*4;
  out+=TF(40,340,`Sessions: ${sessions} · sniffs: ${sniffs} · about ${Math.round(sniffs*10/60)} minutes in total`,14,C.ink,'start');
  out+=S6_chip(556,326,'mod','end');
  return {svg:out,phase:s.d<84?'Each session: sniff each jar for about 10 seconds and try to recall the smell. Little time, but it has to be kept up for months.':'Twelve weeks: 168 sessions and 672 sniffs, about two hours in total. In Hummel’s 2009 study, more trained patients improved than untrained ones, but the routine did not help everyone.'};
 }});

// Seeded mini-trial: improvement probabilities for control (spontaneous) and trained (spontaneous + effect).
function S6_trial(seed,effect,n=40){const r=S6_rng(seed),c=[],t=[];for(let i=0;i<n;i++){c.push(r()<.08);t.push(r()<.08+effect)}return {c,t}}
SCENE({id:'smell-training-trial',name:'Does training work?',tag:'Why a control group matters',
 definition:'After smell loss many people recover on their own. A trial needs a control group, which does not train, to tell how much improvement training adds beyond natural recovery.',
 example:'Hummel’s 2009 study found that about 28% of trained patients improved by a meaningful amount, against about 6% of untrained patients (approximate).',
 desc:'A seeded mini-trial of 40 trained and 40 untrained patients, with a slider for the true training effect, showing each patient as a dot and the improvement rates.',
 research:'Hummel, T. et al. (2009). The Laryngoscope 119 (about 28% against 6% improved meaningfully; approximate). Sorokowska et al. (2017). Rhinology 55 (meta-analysis). Kattar, N. et al. (2021). Olfactory training for postviral olfactory dysfunction: systematic review. Otolaryngology–Head and Neck Surgery 164. Simulated patients; spontaneous recovery set at 8%.',
 dur:10,hint:'Set the true training effect and press New trial for another random sample.',
 init:()=>({e:20,seed:3}),
 watch(p){return {e:Math.round(p*30),seed:3}},
 ui:[{range:'e',label:'True extra improvement from training',min:0,max:40,step:5,get:s=>s.e,act:'e',show:v=>'+'+v+'%'},{b:'New trial',act:'again'}],
 on:{e(s,v){s.e=Number(v);return 'keep'},again(s){s.seed=nextSeed();return 'keep'}},
 draw(s){
  const tr=S6_trial(s.seed,s.e/100),nc=tr.c.filter(Boolean).length,nt=tr.t.filter(Boolean).length;
  let out=heading('A small trial: 40 trained, 40 not',26);
  const grid=(arr,x0,lab,col)=>{let o=TBF(x0+110,62,lab,14,col);arr.forEach((v,i)=>{const x=x0+(i%8)*28,y=76+Math.floor(i/8)*28;o+=Ci(x+12,y+12,10,v?col:'#fff',v?'none':C.line)});return o};
  out+=grid(tr.c,30,'No training',C.muted)+grid(tr.t,330,'Trained',C.green);
  out+=TF(300,234,'filled dot = improved by a meaningful amount',13,C.muted);
  const bar=(x,v,col,lab)=>R(x,330-v*2.2,90,v*2.2,col,'none',4)+TF(x+45,346,lab,13,C.ink)+TF(x+45,326-v*2.2,v.toFixed(0)+'%',13,C.ink);
  out+=bar(100,nc/40*100,C.muted,'no training')+bar(240,nt/40*100,C.green,'trained');
  out+=R(390,252,190,96,C.pale,'none',10)+S6_lines(402,276,['Training adds about',`${Math.round((nt-nc)/40*100)} points here.`,'Without the control,','it would look like '+Math.round(nt/40*100)+'%.'],13,C.ink,'start',18);
  return {svg:out,phase:`In this sample ${nc} of 40 untrained and ${nt} of 40 trained patients improved. Spontaneous recovery happens in both groups, so only the difference counts as the effect of training. Small trials vary a lot from sample to sample: press New trial a few times.`};
 }});

// Recovery after COVID-19 smell loss: share recovered by day (approximate, after Tan et al. 2022).
const S6_COVID=[[0,0],[30,74],[60,86],[90,90],[180,96]];
function S6_covidAt(d){for(let i=1;i<S6_COVID.length;i++)if(d<=S6_COVID[i][0]){const a=S6_COVID[i-1],b=S6_COVID[i],u=(d-a[0])/(b[0]-a[0]);return a[1]+(b[1]-a[1])*smooth(u)}return 96}
SCENE({id:'smell-training-covid',name:'Smell loss after COVID-19',tag:'Most recover; a few do not',
 definition:'Sudden smell loss was one of the commonest symptoms of early COVID-19 variants. Most people recover within weeks to months; a minority still have problems after six months.',
 example:'A pooled analysis estimated that about three in four people had recovered smell after a month and about 96% by six months (approximate).',
 desc:'A days slider over an approximate recovery curve, with a 100-person grid showing who has and has not recovered by that day.',
 research:'Tan, B. K. J. et al. (2022). Prognosis and persistence of smell and taste dysfunction in patients with covid-19: meta-analysis with parametric cure modelling of recovery curves. BMJ 378, e069503 (about 74% at 30 days, 86% at 60, 90% at 90, 96% at 180; approximate). Butowt, R. & von Bartheld, C. S. (2021) on the mechanism (support cells, not neurons). Values approximate.',
 dur:10,hint:'Move through the days after smell loss.',
 init:()=>({d:30}),
 watch(p){return {d:Math.round(p*180)}},
 ui:[{range:'d',label:'Days since smell loss',min:0,max:180,step:5,get:s=>s.d,act:'d',show:v=>v+' days'}],
 on:{d(s,v){s.d=Number(v);return 'keep'}},
 draw(s){
  const pct=S6_covidAt(s.d);
  let out=heading('Recovering smell after COVID-19',26);
  const pl=S6_plot(70,60,290,220,[0,180],[0,100],{xt:[[0,'0'],[60,'60'],[120,'120'],[180,'180']],yt:[[0,'0%'],[50,'50%'],[100,'100%']],xl:'days',yl:'recovered (approximate)'});
  out+=pl.svg;const pts=[];for(let d=0;d<=180;d+=3)pts.push([pl.X(d),pl.Y(S6_covidAt(d))]);out+=S6_poly(pts,C.blue);
  S6_COVID.slice(1).forEach(p=>{out+=Ci(pl.X(p[0]),pl.Y(p[1]),4,C.blue)});
  out+=L(pl.X(s.d),60,pl.X(s.d),280,C.coral,1.5,'stroke-dasharray="4 4"');
  const n=Math.round(pct);
  for(let i=0;i<100;i++){const x=396+(i%10)*18,y=64+Math.floor(i/10)*20;out+=Ci(x,y,7,i<n?C.green:C.coral)}
  out+=TF(486,284,`${n} of 100 recovered`,14,C.ink)+TF(70,348,'Grid: green recovered, coral still affected.',13,C.muted,'start');
  return {svg:out,phase:s.d<60?'Many people recover within the first month, because the virus mainly damages support cells in the nose, which regrow quickly, rather than the smell neurons themselves.':'By six months about 4 in 100 still have trouble, and some have parosmia, where smells are distorted. Smell training is a recommended option for them; its evidence is moderate.'};
 }});

/* =========================================================== how-many-smells */
// Discrimination of two 30-component mixtures by the fraction of components that differ (illustrative logistic).
const S6_disc=f=>1/3+(2/3)/(1+Math.exp(-(f-.51)*14));
SCENE({id:'how-many-smells',name:'Telling mixtures apart',tag:'The method behind the trillion',
 definition:'In a triangle test you smell three samples, two identical and one different, and pick the odd one out. Guessing gives one in three.',
 example:'Bushdid and colleagues mixed 30 of 128 odorants. On average, people told two mixtures apart only when more than about half their components differed.',
 desc:'Two 30-component mixtures drawn as dots from a pool of 128, a slider for how many components differ, and the share of correct triangle-test answers (curve illustrative).',
 research:'Bushdid, C., Magnasco, M. O., Vosshall, L. B. & Keller, A. (2014). Humans can discriminate more than 1 trillion olfactory stimuli. Science 343, 1370–1372. Curve shape illustrative; the average threshold (mixtures sharing less than about 51% of their components) is from the paper.',
 dur:10,hint:'Change how many of the 30 components differ between the two mixtures.',
 init:()=>({k:15}),
 watch(p){return {k:Math.round(p*30)}},
 ui:[{range:'k',label:'Components that differ',min:0,max:30,get:s=>s.k,act:'k',show:v=>v+' of 30'}],
 on:{k(s,v){s.k=Number(v);return 'keep'}},
 draw(s){
  const f=s.k/30,pc=S6_disc(f);
  let out=heading('Two mixtures of 30 smells each',26);
  // Pool of 128 as a 16×8 grid; mixture A uses 0..29, B shares 30−k of them and adds k others.
  for(let i=0;i<128;i++){const x=40+(i%16)*16,y=56+Math.floor(i/16)*16,a=i<30,b=i<30-s.k||(i>=30&&i<30+s.k);
   out+=R(x,y,12,12,a&&b?C.purple:a?C.blue:b?'#c0508a':'#fff',a||b?'none':C.grid,3)}
  out+=R(40,198,12,12,C.blue,'none',3)+TF(58,208,'only in A',13,C.ink,'start')+R(130,198,12,12,'#c0508a','none',3)+TF(148,208,'only in B',13,C.ink,'start')+R(220,198,12,12,C.purple,'none',3)+TF(238,208,'in both',13,C.ink,'start');
  const pl=S6_plot(340,56,230,160,[0,1],[0,1],{xt:[[0,'0%'],[.5,'50%'],[1,'100%']],yt:[[1/3,'⅓'],[1,'1']],xl:'share of components differing',yl:'correct'});
  out+=pl.svg;const pts=[];for(let x=0;x<=1;x+=.02)pts.push([pl.X(x),pl.Y(S6_disc(x))]);
  out+=S6_poly(pts,C.blue)+L(pl.X(0),pl.Y(1/3),pl.X(1),pl.Y(1/3),C.line,1,'stroke-dasharray="4 4"')+Ci(pl.X(f),pl.Y(pc),6,C.coral,'#fff');
  out+=TF(340,286,`${Math.round(pc*100)}% correct (chance 33%)`,14,C.ink,'start');
  out+=TF(40,262,'Pool: 128 odorants. Each mixture: 30.',13,C.muted,'start');
  out+=TF(40,346,'Curve illustrative; average threshold about half differing (Bushdid 2014).',13,C.muted,'start');
  return {svg:out,phase:f<.4?'With most components shared, the two mixtures smell the same and answers sit near chance.':f<.6?'Around half the components differing, people start to tell the mixtures apart.':'With most components different, the odd one out is usually found.'};
 }});

// Toy count in the spirit of Bushdid 2014: number of 30-of-128 mixtures divided by how many lie within
// half the indistinguishable distance (sphere packing; k components swapped). Done in log10 to stay accurate.
function S6_lc(n,k){let s=0;for(let i=1;i<=k;i++)s+=Math.log10(n-k+i)-Math.log10(i);return s}
function S6_log10Count(d){const k=Math.floor(d*30/2);let ball=0;const terms=[];for(let j=0;j<=k;j++)terms.push(S6_lc(30,j)+S6_lc(98,j));const m=Math.max(...terms);ball=m+Math.log10(terms.reduce((a,t)=>a+Math.pow(10,t-m),0));return S6_lc(128,30)-ball}
SCENE({id:'how-many-smells-estimate',name:'One trillion?',tag:'A small change, a huge swing',
 definition:'The “one trillion smells” estimate was extrapolated from how different two mixtures must be to be told apart. Critics showed that the answer depends enormously on the assumptions.',
 example:'Changing the assumed discrimination threshold a little moves the estimate by many powers of ten, from far below a trillion to far above it.',
 desc:'A slider for the share of components that must differ before mixtures can be told apart, and a log-scale count of distinguishable mixtures from a toy version of the calculation.',
 research:'Bushdid et al. (2014). Science 343 (1.7 trillion). Meister, M. (2015). On the dimensionality of odor space. eLife 4, e07865. Gerkin, R. C. & Castro, J. B. (2015). The number of olfactory stimuli that humans can discriminate is still unknown. eLife 4, e08127. This is a toy calculation, not Bushdid’s exact method. Status: contested.',
 dur:10,hint:'Move the threshold. Watch the powers of ten, not the exact number.',
 init:()=>({d:51}),
 watch(p){return {d:30+Math.round(p*50)}},
 ui:[{range:'d',label:'Share that must differ',min:30,max:80,get:s=>s.d,act:'d',show:v=>v+'%'}],
 on:{d(s,v){s.d=Number(v);return 'keep'}},
 draw(s){
  const lg=S6_log10Count(s.d/100);
  let out=heading('How many smells? It depends',26);
  const pl=S6_plot(80,60,300,230,[30,80],[0,24],{xt:[[30,'30%'],[50,'50%'],[70,'70%']],yt:[[6,'10⁶'],[12,'10¹²'],[18,'10¹⁸'],[24,'10²⁴']],xl:'share of components that must differ',yl:'distinguishable mixtures (toy count)'});
  out+=pl.svg;const pts=[];for(let d=30;d<=80;d+=1){const v=S6_log10Count(d/100);pts.push([pl.X(d),pl.Y(clamp(v,0,24))])}
  out+=S6_poly(pts,C.blue)+L(pl.X(30),pl.Y(12.23),pl.X(80),pl.Y(12.23),C.coral,1.5,'stroke-dasharray="6 4"')+TF(pl.X(79),pl.Y(12.23)-6,'Bushdid: 1.7 × 10¹²',13,C.coral,'end');
  out+=Ci(pl.X(s.d),pl.Y(clamp(lg,0,24)),7,C.blue,'#fff');
  out+=R(400,60,180,230,C.pale,'none',10)+TBF(490,90,'Toy estimate',14,C.ink)+TBF(490,130,lg<1?'about 1':`10^${lg.toFixed(1)}`,24,C.blue);
  out+=S6_lines(412,170,['A shift of a few','per cent in the','threshold moves','the count by','many powers of ten.'],13,C.ink,'start',19);
  out+=S6_chip(80,328,'debated')+TF(176,343,'Meister 2015; Gerkin & Castro 2015',13,C.muted,'start');
  return {svg:out,phase:'The count is the number of possible mixtures divided by how many sit too close to tell apart. Because both numbers are astronomically large, small changes in the assumed threshold or in how “distance” is measured change the answer by orders of magnitude. The true number of smells people can tell apart is unknown, but probably very large.'};
 }});

const S6_EST=[
 {k:'ch',t:'Crocker & Henderson 1927',v:4,lab:'≈ 10,000',note:'Four “primary” smells, each rated 0–8: 9⁴ = 6,561 combinations, rounded to “10,000”. A guess built on a theory now abandoned.',st:'myth'},
 {k:'tone',t:'Tones (as quoted)',v:5.53,lab:'≈ 340,000',note:'Number of tones people can tell apart, as quoted by Bushdid et al. for comparison.',st:'mod'},
 {k:'col',t:'Colours (as quoted)',v:6.6,lab:'2.3–7.5 million',note:'Number of colours people can tell apart, as quoted by Bushdid et al. Colour has three receptor types; smell has about 400.',st:'mod'},
 {k:'bush',t:'Bushdid et al. 2014',v:12.23,lab:'≈ 1.7 trillion',note:'Extrapolated from triangle tests on 30-component mixtures. Widely reported; the method was challenged within a year.',st:'debated'}];
SCENE({id:'how-many-smells-estimates',name:'From “10,000” to “a trillion”',tag:'Where the famous numbers came from',
 definition:'Popular numbers for how many smells we can detect come from very different methods. The old “10,000” came from a theory of four primary smells; the “trillion” came from extrapolating mixture tests.',
 example:'The 1927 estimate multiplied four imagined primary smells, each with nine strengths: 9 × 9 × 9 × 9 = 6,561.',
 desc:'Four estimates on a logarithmic scale; press one to see where it came from and how far to trust it.',
 research:'Crocker, E. C. & Henderson, L. F. (1927). Analysis and classification of odors. American Perfumer and Essential Oil Review 22. Bushdid et al. (2014). Science 343 (quoting colour and tone figures). Gerkin & Castro (2015); Meister (2015). Status: the true number is unknown.',
 dur:10,hint:'Press an estimate.',
 init:()=>({k:'ch'}),
 watch(p){return {k:S6_EST[Math.min(3,Math.floor(p*4))].k}},
 on:{k(s,v){s.k=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('How many? Four famous numbers',26);
  const x0=50,x1=550,lx=v=>x0+(v/13)*(x1-x0);
  out+=L(x0,110,x1,110,C.line,2);
  for(let p=0;p<=12;p+=3)out+=L(lx(p),104,lx(p),116,C.line,1.5)+TF(lx(p),134,p?`10${['','','','³','','','⁶','','','⁹','','','¹²'][p]}`:'1',13,C.muted);
  S6_EST.forEach((e,i)=>{const sel=s.k===e.k,col=S6_STATUS[e.st][1],y=66-((i%2)*0);out+=Ci(lx(e.v),110,sel?9:6,col,'#fff');
   out+=S6_btn(X,'k',e.k,e.t,24+i*140,152,128,48,S6_wrap(e.t,18),{sel,stroke:sel?col:C.line,size:13})});
  const e=S6_EST.find(e=>e.k===s.k);
  out+=R(24,214,552,130,'#fff',S6_STATUS[e.st][1],10,'stroke-width="1.5"')+TBF(44,242,e.t,16,C.ink,'start')+TBF(44,268,e.lab,18,S6_STATUS[e.st][1],'start')+S6_chip(556,228,e.st,'end');
  out+=S6_lines(44,296,S6_wrap(e.note,68),14,C.ink);
  out+=TF(300,70,'log scale: each step is ten times more',13,C.muted);
  return {svg:out,phase:'None of these is a measured count. The honest answer is that people can tell apart a very large number of smells, probably far more than 10,000, but the exact figure depends on assumptions nobody has pinned down.'};
 }});
