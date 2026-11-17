/* ===================== Language era 1 · Writing (3400 BCE–1500) ===================== */
// Shared helpers for this era (prefix L1_). Signs from non-Latin scripts are drawn as SVG strokes,
// so the pictures never depend on which fonts a device has installed. All sign shapes are schematic.
function L1_lines(text,max){const out=[];let line='';for(const w of String(text).split(' ')){if(line&&(line+' '+w).length>max){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out}
function L1_para(x,y,text,max,size=13,col=C.ink,lh=18,anchor='start'){return L1_lines(text,max).map((l,i)=>TF(x,y+i*lh,l,size,col,anchor)).join('')}
const L1_note=(x,y,w,h,title,text,max)=>R(x,y,w,h,'#fff',C.grid,10)+TBF(x+12,y+24,title,14,C.ink,'start')+L1_para(x+12,y+46,text,max,13,C.muted,18);
function L1_circ(cx,cy,r,n=20){return range(n+1).map(i=>[cx+r*Math.cos(2*Math.PI*i/n),cy+r*Math.sin(2*Math.PI*i/n)])}
// Draw a sign given as strokes (polylines in a 0–100 box), centred at (cx,cy), size px across.
// o.rot: degrees (negative = anticlockwise); o.wedge: draw each segment as a cuneiform wedge;
// o.snap: straighten each segment to the nearest 45° (later, more abstract cuneiform).
function L1_sign(strokes,cx,cy,size,o={}){
 const a=(o.rot||0)*Math.PI/180,ca=Math.cos(a),sa=Math.sin(a),col=o.col||C.ink,w=o.w||Math.max(2,size*.045);
 const tp=p=>{const u=(p[0]-50)/100*size,v=(p[1]-50)/100*size;return [cx+u*ca-v*sa,cy+u*sa+v*ca]};
 let segs=[];
 for(const st of strokes){
  if(o.wedge||o.snap){for(let i=0;i<st.length-1;i++){let p0=st[i],p1=st[i+1];
    if(o.snap){const dx=p1[0]-p0[0],dy=p1[1]-p0[1],len=Math.hypot(dx,dy),ang=Math.round(Math.atan2(dy,dx)/(Math.PI/4))*(Math.PI/4);p1=[p0[0]+len*Math.cos(ang),p0[1]+len*Math.sin(ang)]}
    segs.push([p0,p1])}}
  else segs.push(st);
 }
 let out='';
 for(const st of segs){const pts=st.map(tp);
  if(o.wedge){const [x1,y1]=pts[0],[x2,y2]=pts[1],dx=x2-x1,dy=y2-y1,d=Math.hypot(dx,dy);if(d<2)continue;
   const ux=dx/d,uy=dy/d,nx=-uy,ny=ux,hw=Math.min(size*.055,d*.32);
   out+=`<polygon points="${fmt(x1-ux*hw)},${fmt(y1-uy*hw)} ${fmt(x1+nx*hw)},${fmt(y1+ny*hw)} ${fmt(x2)},${fmt(y2)} ${fmt(x1-nx*hw)},${fmt(y1-ny*hw)}" fill="${col}"/>`}
  else out+=P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join('L'),col,w,'none','stroke-linecap="round" stroke-linejoin="round"');
 }
 return out;
}
const L1_CLAY='#ecd8b4',L1_CLAYD='#b08a57',L1_CLAYI='#a07a48';
const L1_tab=(x,y,w,h)=>R(x,y,w,h,L1_CLAY,L1_CLAYD,14);
// Simple button-like chip used for in-drawing choices.
function L1_chip(X,act,arg,x,y,w,label,on,aria){return hit(X,act,arg,aria||label,R(x,y,w,28,on?C.blue:'#fff',on?C.blue:C.line,8)+TF(x+w/2,y+19,label,13,on?'#fff':C.ink))}

/* ---------------- Lesson: Clay tokens (c. 8000–3100 BCE) ---------------- */
const L1_BARLEY=[[[50,92],[50,8]],[[50,22],[34,12]],[[50,22],[66,12]],[[50,42],[34,32]],[[50,42],[66,32]],[[50,62],[34,52]],[[50,62],[66,52]]];
const L1_GOODS={
 sheep:{name:'sheep',token:'a disc with an incised cross',sign:[L1_circ(50,50,38),[[50,12],[50,88]],[[12,50],[88,50]]]},
 grain:{name:'measures of grain',token:'a cone',sign:L1_BARLEY},
 oil:{name:'jars of oil',token:'an ovoid with an incised line',sign:[[[36,12],[64,12]],[[38,12],[38,24],[22,44],[30,88],[70,88],[78,44],[62,24],[62,12]]]}};
function L1_token(kind,x,y,r,imp){
 const fill=imp?'#c9a776':'#e3c48f',st=imp?L1_CLAYI:'#8f6a3c';
 if(kind==='sheep')return Ci(x,y,r,fill,st,'stroke-width="1.5"')+L(x-r*.6,y,x+r*.6,y,st,1.5)+L(x,y-r*.6,x,y+r*.6,st,1.5);
 if(kind==='grain')return `<polygon points="${fmt(x)},${fmt(y-r)} ${fmt(x+r*.85)},${fmt(y+r*.8)} ${fmt(x-r*.85)},${fmt(y+r*.8)}" fill="${fill}" stroke="${st}" stroke-width="1.5"/>`;
 return `<ellipse cx="${fmt(x)}" cy="${fmt(y)}" rx="${fmt(r*.7)}" ry="${fmt(r)}" fill="${fill}" stroke="${st}" stroke-width="1.5"/>`+L(x-r*.5,y,x+r*.5,y,st,1.5);
}
const L1_STAGES=['Loose tokens','Tokens sealed in an envelope','Tokens pressed into a tablet','Number signs + one word sign'];
const L1_STDATE=['c. 8000–3500 BCE','c. 3500 BCE','c. 3300 BCE','c. 3100 BCE'];
// Proto-cuneiform style number signs: 10 = round impression, 1 = small elongated impression.
function L1_numerals(n,x,y,scale=1){let out='',cx=x;const tens=Math.floor(n/10),ones=n%10;
 for(let i=0;i<tens;i++){out+=Ci(cx+11*scale,y,10*scale,'#c9a776',L1_CLAYI,'stroke-width="1.5"');cx+=24*scale}
 for(let i=0;i<ones;i++){out+=`<ellipse cx="${fmt(cx+5*scale)}" cy="${fmt(y)}" rx="${fmt(4.5*scale)}" ry="${fmt(10*scale)}" fill="#c9a776" stroke="${L1_CLAYI}" stroke-width="1.5"/>`;cx+=12*scale}
 return {svg:out,end:cx};
}
SCENE({id:'clay-tokens',name:'From tokens to tablets',tag:'Counting before writing',
 definition:'Small clay tokens were used to count goods in the Near East for thousands of years. A widely cited theory holds that sealing tokens in clay envelopes, then pressing them into tablets, led to the first written signs in Mesopotamia around 3300–3100 BCE.',
 example:'Five sheep: five sheep tokens; then five impressions of a sheep token on a tablet; finally a number sign for 5 next to one sign meaning “sheep”.',
 research:['Schmandt-Besserat, D. (1992). Before Writing, vol. 1: From Counting to Cuneiform. University of Texas Press.','Zimansky, P. (1993). Review of Before Writing. Journal of Field Archaeology 20, 513–517 (questions how many token types had fixed meanings).','Nissen, H. J., Damerow, P. & Englund, R. K. (1993). Archaic Bookkeeping. University of Chicago Press.'],
 desc:'Clay tokens for a chosen commodity are shown at one of four stages: loose, sealed inside a round envelope with their impressions on the outside, pressed into a flat tablet, and finally replaced by number signs plus a single word sign.',
 dur:12,hint:'Choose a commodity, how many, and a stage. Watch the same count move from objects, to marks of objects, to a number and a word.',
 init:()=>({good:'sheep',n:5,stage:0}),
 watch(p){const stage=Math.min(3,Math.floor(p*4));return {good:['sheep','grain','oil','sheep'][stage],n:[5,4,7,6][stage],stage}},
 ui:[{choose:[['sheep','Sheep'],['grain','Grain'],['oil','Oil']],label:'Goods',get:s=>s.good,act:'good'},{range:'n',label:'How many',min:1,max:10,step:1,get:s=>s.n,act:'n'},{range:'stage',label:'Stage',min:0,max:3,step:1,get:s=>s.stage,act:'stage',show:v=>L1_STAGES[v]}],
 on:{good(s,v){s.good=v},n(s,v){s.n=Number(v)},stage(s,v){s.stage=Number(v)}},
 draw(s){
  const g=L1_GOODS[s.good];let out=heading(`${L1_STAGES[s.stage]} · ${L1_STDATE[s.stage]}`);
  if(s.stage===0){for(let i=0;i<s.n;i++)out+=L1_token(s.good,120+(i%5)*55,130+Math.floor(i/5)*70,18)}
  else if(s.stage===1){out+=Ci(200,170,110,L1_CLAY,L1_CLAYD,'stroke-width="2"')+`<circle cx="200" cy="170" r="70" fill="#f6ead3" stroke="${L1_CLAYD}" stroke-dasharray="5 4"/>`;
   for(let i=0;i<s.n;i++){const a=2*Math.PI*i/s.n;out+=L1_token(s.good,200+42*Math.cos(a)*(s.n>1?1:0),170+42*Math.sin(a)*(s.n>1?1:0),11)}
   for(let i=0;i<s.n;i++){const a=2*Math.PI*i/s.n-Math.PI/2;out+=L1_token(s.good,200+92*Math.cos(a),170+92*Math.sin(a),9,true)}
   out+=TF(200,302,'tokens inside; their marks pressed on the outside',13,C.muted)}
  else if(s.stage===2){out+=L1_tab(70,80,280,180);for(let i=0;i<s.n;i++)out+=L1_token(s.good,110+(i%5)*50,130+Math.floor(i/5)*70,15,true)}
  else{out+=L1_tab(70,80,280,180);const nm=L1_numerals(s.n,100,170,1.3);out+=nm.svg+L1_sign(g.sign,Math.min(300,nm.end+50),170,80,{col:L1_CLAYI,w:3.5});
   out+=TF(210,250,`a number sign for ${s.n}, then one sign for “${g.name}”`,13,C.muted)}
  out+=L1_note(380,70,200,210,'What changed',[`Tokens are the objects themselves: ${g.token} for ${g.name}.`,'Marks on the envelope let anyone check its contents without breaking it.','The tablet keeps only the marks; the tokens are no longer needed.','Number and thing are now separate signs: counting has become abstract.'][s.stage],27);
  return {svg:out,phase:[`${s.n} ${g.name}: one token for each.`,`The envelope records ${s.n} tokens twice: inside, and as impressions outside.`,`${s.n} impressions on a flat tablet: a record with no tokens at all.`,`One number sign and one word sign now say “${s.n} ${g.name}”. How directly tokens led to these signs is still debated.`][s.stage]};
 }});

SCENE({id:'clay-tokens-counting',name:'Concrete and abstract counting',tag:'One mark per thing, or a number',
 definition:'Early records counted by repeating a sign once for each item. Proto-cuneiform tablets instead wrote a number with a few grouped signs and named the item once, which needs far fewer marks for large counts.',
 example:'Thirty-seven sheep: 37 marks one by one, or 3 tens + 7 ones + 1 sheep sign = 11 signs.',
 research:['Nissen, H. J., Damerow, P. & Englund, R. K. (1993). Archaic Bookkeeping (several counting systems were used for different goods).','Schmandt-Besserat, D. (1992). Before Writing.'],
 desc:'Left: one token per item for the chosen count. Right: the same count written with sixties, tens and ones plus a single sign for the item. A chart below compares how many marks each method needs for counts from 1 to 60.',
 dur:10,hint:'Move the count. Compare how fast the two lines grow on the chart.',
 init:()=>({n:37}),
 watch(p){return {n:1+Math.round(smooth(p)*59)}},
 ui:[{range:'n',label:'Count',min:1,max:60,step:1,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=Number(v)}},
 draw(s){
  const marks=n=>Math.floor(n/60)+Math.floor((n%60)/10)+n%10+1;let out=heading(`Counting ${s.n} sheep`);
  out+=TBF(150,62,'One token per sheep',14,C.ink)+R(30,72,240,150,'#fff',C.grid,8);
  for(let i=0;i<s.n;i++)out+=L1_token('sheep',46+(i%10)*23,88+Math.floor(i/10)*23,8);
  out+=TBF(450,62,'Number + one word sign',14,C.ink)+L1_tab(330,72,240,150);
  let cx=345;const big=Math.floor(s.n/60),tens=Math.floor((s.n%60)/10),ones=s.n%10;
  for(let i=0;i<big;i++){out+=`<ellipse cx="${cx+12}" cy="132" rx="10" ry="22" fill="#c9a776" stroke="${L1_CLAYI}" stroke-width="1.5"/>`;cx+=28}
  const nm=L1_numerals(tens*10+ones,cx,118,.75);out+=nm.svg+L1_sign(L1_GOODS.sheep.sign,450,172,40,{col:L1_CLAYI,w:2.5});
  out+=TF(450,212,'large = 60 · round = 10 · narrow = 1',13,C.muted);
  // chart
  const x0=70,y0=350,w=480,h=90,px=n=>x0+(n-1)/59*w,py=m=>y0-m/60*h;
  out+=L(x0,y0,x0+w,y0,C.line,1.5)+L(x0,y0,x0,y0-h,C.line,1.5)+TF(x0-6,y0-h+4,'60',13,C.muted,'end')+TF(x0-6,y0+4,'0',13,C.muted,'end')+TF(x0+w,y0+18,'count →',13,C.muted,'end')+TF(x0+4,y0-h-8,'marks needed',13,C.muted,'start');
  out+=P('M'+range(60).map(i=>fmt(px(i+1))+' '+fmt(py(i+1))).join('L'),C.coral,2.5)+P('M'+range(60).map(i=>fmt(px(i+1))+' '+fmt(py(marks(i+1)))).join('L'),C.blue,2.5);
  out+=Ci(px(s.n),py(s.n),5,C.coral)+Ci(px(s.n),py(marks(s.n)),5,C.blue)+TF(px(60)-4,py(60)+16,'one each',13,C.coral,'end')+TF(px(60)-4,py(marks(60))-8,'number + word',13,C.blue,'end');
  return {svg:out,phase:`${s.n} sheep: ${s.n} tokens, or ${marks(s.n)} signs written as a number plus “sheep”. Writing the number once is what made large accounts practical.`};
 }});

const L1_CUNE={
 ox:{name:'ox',sum:'GUD',strokes:[[[30,32],[50,85],[70,32],[30,32]],[[30,32],[15,10]],[[70,32],[85,10]]]},
 barley:{name:'barley',sum:'ŠE',strokes:L1_BARLEY},
 star:{name:'sky, god',sum:'AN',strokes:[[[50,50],[50,10]],[[50,50],[50,90]],[[50,50],[10,50]],[[50,50],[90,50]],[[50,50],[22,22]],[[50,50],[78,78]],[[50,50],[78,22]],[[50,50],[22,78]]]},
 head:{name:'head',sum:'SAG',strokes:[[[25,85],[22,35],[45,14],[72,18],[85,42],[74,52],[82,66],[64,72],[60,88]]]}};
const L1_CSTAGE=[{n:'Drawn picture',d:'c. 3200 BCE',o:{}},{n:'Turned on its side',d:'3rd millennium BCE',o:{rot:-90}},{n:'Pressed wedges',d:'c. 2000 BCE',o:{rot:-90,wedge:true}},{n:'Straightened wedges',d:'c. 700 BCE',o:{rot:-90,wedge:true,snap:true}}];
SCENE({id:'clay-tokens-cuneiform',name:'From pictures to wedges',tag:'How cuneiform got its shape',
 definition:'Cuneiform began as pictures drawn in clay. Over centuries scribes turned the signs on their side and pressed them with a cut reed, so every line became a wedge; later forms straightened the wedges until the picture was no longer recognisable.',
 example:'The sign for barley (Sumerian ŠE) starts as an ear of grain and ends as a cluster of wedges.',
 research:['Walker, C. B. F. (1987). Cuneiform. British Museum Publications.','Cooper, J. S. (1996). Sumerian and Akkadian. In Daniels & Bright (eds.), The World’s Writing Systems. Oxford University Press.','When the signs were rotated is debated; the drawings here are schematic.'],
 desc:'A large sign is drawn at the chosen stage; a strip below shows the same sign at all four stages, from drawn picture, to rotated, to pressed wedges, to straightened late wedges.',
 dur:12,hint:'Choose a sign and move through the four stages. The same rules turn every picture into wedges.',
 init:()=>({sign:'barley',stage:0}),
 watch(p){const k=['barley','ox','star','head'][Math.min(3,Math.floor(p*4))],stage=Math.min(3,Math.floor((p*4%1)*4));return {sign:k,stage}},
 ui:[{choose:[['barley','Barley'],['ox','Ox'],['star','Sky, god'],['head','Head']],label:'Sign',get:s=>s.sign,act:'sign'},{range:'stage',label:'Stage',min:0,max:3,step:1,get:s=>s.stage,act:'stage',show:v=>L1_CSTAGE[v].n}],
 on:{sign(s,v){s.sign=v},stage(s,v){s.stage=Number(v)}},
 draw(s){
  const sg=L1_CUNE[s.sign],st=L1_CSTAGE[s.stage];let out=heading(`${sg.sum} “${sg.name}”: ${st.n.toLowerCase()}, ${st.d}`);
  out+=L1_tab(180,52,240,190)+L1_sign(sg.strokes,300,147,150,{...st.o,col:L1_CLAYI,w:5});
  L1_CSTAGE.forEach((c,i)=>{const x=40+i*135,on=i===s.stage;out+=R(x,262,120,110,on?C.pale:'#fff',on?C.blue:C.grid,8)+L1_sign(sg.strokes,x+60,302,58,{...c.o,col:on?C.ink:C.muted,w:2.5})+TF(x+60,350,c.n,13,on?C.ink:C.muted)+TF(x+60,366,c.d,13,C.muted)});
  return {svg:out,phase:['A recognisable picture, drawn with a pointed stylus.','The sign is turned a quarter-turn anticlockwise, as scribes wrote it in later periods.','Each line is now a wedge pressed with a reed: cuneiform means “wedge-shaped”.','Wedges are straightened to a few directions; the picture is gone and only the sign remains.'][s.stage]};
 }});

/* ---------------- Lesson: Logograms ---------------- */
const L1_DOT=c=>L1_circ(c[0],c[1],4,10);
const L1_CHN=[
 {k:'sun',py:'rì',ob:[L1_circ(50,50,36),L1_DOT([50,50])],mod:[[[25,10],[75,10],[75,90],[25,90],[25,10]],[[25,50],[75,50]]]},
 {k:'moon',py:'yuè',ob:[[[40,10],[20,35],[18,65],[40,90],[70,82],[52,62],[50,38],[70,18],[40,10]],[[38,48],[46,48]]],mod:[[[30,10],[30,80],[20,94]],[[30,10],[72,10],[72,92],[62,88]],[[30,38],[72,38]],[[30,62],[72,62]]]},
 {k:'mountain',py:'shān',ob:[[[10,82],[25,45],[40,82],[50,18],[60,82],[75,45],[90,82]],[[10,82],[90,82]]],mod:[[[50,12],[50,86]],[[20,40],[20,86]],[[80,40],[80,86]],[[20,86],[80,86]]]},
 {k:'tree',py:'mù',ob:[[[50,8],[50,92]],[[50,32],[26,12]],[[50,32],[74,12]],[[50,68],[26,90]],[[50,68],[74,90]]],mod:[[[14,34],[86,34]],[[50,8],[50,94]],[[50,38],[16,80]],[[50,38],[84,80]]]},
 {k:'person',py:'rén',ob:[[[58,8],[48,48],[32,92]],[[50,38],[72,62]]],mod:[[[52,12],[46,50],[14,92]],[[48,42],[86,92]]]},
 {k:'mouth',py:'kǒu',ob:[[[18,34],[24,80],[76,80],[82,34]],[[12,34],[88,34]]],mod:[[[24,22],[76,22],[76,82],[24,82],[24,22]]]}];
SCENE({id:'logograms',name:'Logograms',tag:'Signs for words',
 definition:'A logogram is a sign that stands for a whole word or meaningful part of a word. Chinese characters are the longest-lived example; a few began as pictures, but most combine a part that hints at meaning with a part that hints at sound.',
 example:'The character for “tree” (mù) was once a drawing of a tree with branches and roots; the modern form keeps the trunk and branches as four strokes.',
 research:['Keightley, D. N. (1978). Sources of Shang History: The Oracle-Bone Inscriptions of Bronze Age China. University of California Press.','DeFrancis, J. (1984). The Chinese Language: Fact and Fantasy. University of Hawai‘i Press (against the “ideographic” myth).','Boltz, W. G. (1994). The Origin and Early Development of the Chinese Writing System. American Oriental Society.'],
 desc:'A chosen character is drawn twice: its oracle-bone form from about 1200 BCE on the left, and its modern form on the right, with the word, its pinyin and a bar showing that picture-based characters are a small minority.',
 dur:12,hint:'Choose a character and compare its two forms. Then look at the bar: picture-like characters are the exception, not the rule.',
 init:()=>({i:3}),
 watch(p){return {i:Math.min(5,Math.floor(p*6))}},
 ui:[{choose:L1_CHN.map((c,i)=>[i,c.k[0].toUpperCase()+c.k.slice(1)]),label:'Character',get:s=>s.i,act:'i'}],
 on:{i(s,v){s.i=Number(v)}},
 draw(s){
  const c=L1_CHN[s.i];let out=heading(`“${c.k}”, pronounced ${c.py} in Mandarin`);
  out+=R(60,55,200,200,'#f7efe2',C.grid,10)+L1_sign(c.ob,160,155,150,{col:'#7a5a2c',w:4})+TF(160,276,'Oracle-bone form, c. 1200 BCE',13,C.muted);
  out+=R(340,55,200,200,'#fff',C.grid,10)+L1_sign(c.mod,440,155,150,{col:C.ink,w:9})+TF(440,276,'Modern form',13,C.muted)+arrow(272,155,328,155,C.line,2.5);
  const x0=60,w=480;out+=TF(x0,310,'Kinds of Chinese characters (approximate share)',13,C.ink,'start');
  out+=R(x0,320,w*.04,22,C.coral,'none',4)+R(x0+w*.04,320,w*.14,22,C.amber,'none',0)+R(x0+w*.18,320,w*.82,22,C.blue,'none',4);
  out+=TF(x0,362,'pictures',13,C.coral,'start')+TF(x0+w*.1,362,'other',13,C.amber,'start')+TF(x0+w,362,'meaning part + sound part (most)',13,C.blue,'end');
  return {svg:out,phase:`“${c.k[0].toUpperCase()+c.k.slice(1)}” is one of the few characters that began as a picture. Most characters are compounds with a sound part, so Chinese writing is not “pictures of ideas”.`};
 }});

function L1_icon(k,x,y,s=1){const r=v=>v*s;
 if(k==='bee')return `<ellipse cx="${x}" cy="${y}" rx="${r(18)}" ry="${r(11)}" fill="#f2c94c" stroke="${C.ink}" stroke-width="1.5"/>`+L(x-r(5),y-r(10),x-r(5),y+r(10),C.ink,3)+L(x+r(5),y-r(10),x+r(5),y+r(10),C.ink,3)+`<ellipse cx="${x-r(4)}" cy="${y-r(16)}" rx="${r(8)}" ry="${r(6)}" fill="#e1eef7" stroke="${C.line}"/>`;
 if(k==='leaf')return P(`M${x-r(20)} ${y+r(14)}Q${x-r(18)} ${y-r(18)} ${x+r(20)} ${y-r(16)}Q${x+r(16)} ${y+r(16)} ${x-r(20)} ${y+r(14)}Z`,C.green,2,C.greenp)+L(x-r(20),y+r(14),x+r(14),y-r(10),C.green,1.5);
 if(k==='eye')return P(`M${x-r(22)} ${y}Q${x} ${y-r(18)} ${x+r(22)} ${y}Q${x} ${y+r(18)} ${x-r(22)} ${y}Z`,C.ink,2,'#fff')+Ci(x,y,r(7),C.blue);
 if(k==='can')return R(x-r(13),y-r(18),r(26),r(36),'#cfd8de',C.ink,3)+`<ellipse cx="${x}" cy="${y-r(18)}" rx="${r(13)}" ry="${r(4)}" fill="#e6ecef" stroke="${C.ink}"/>`;
 if(k==='sea')return P(`M${x-r(22)} ${y-r(4)}q${r(7)} ${-r(8)} ${r(14)} 0t${r(14)} 0t${r(14)} 0`,C.blue,2.5)+P(`M${x-r(22)} ${y+r(8)}q${r(7)} ${-r(8)} ${r(14)} 0t${r(14)} 0t${r(14)} 0`,C.blue,2.5);
 return arrow(x-r(22),y+r(10),x+r(22),y-r(10),C.ink,2.5,9)+L(x-r(22),y+r(10),x-r(26),y+r(3),C.ink,2)+L(x-r(22),y+r(10),x-r(15),y+r(14),C.ink,2);
}
const L1_TILES=[['bee','bee'],['leaf','leaf'],['eye','eye'],['can','can'],['sea','sea'],['arrow','ti (arrow)']];
const L1_REBUS={belief:{say:'belief',seq:['bee','leaf'],note:'bee + leaf sounds like “belief”: pictures used only for their sound.'},
 see:{say:'I can see',seq:['eye','can','sea'],note:'eye + can + sea: “I can see”. None of the pictures means what it shows.'},
 ti:{say:'Sumerian ti “life”',seq:['arrow'],note:'In Sumerian the word for arrow was ti, and so was the word for life. The arrow sign was borrowed to write “life”.'}};
SCENE({id:'logograms-rebus',name:'The rebus principle',tag:'Pictures for sounds',
 definition:'The rebus principle uses a picture for its sound rather than its meaning. It is how picture-writing everywhere began to record speech: a sign for an easy-to-draw word is borrowed to write a hard-to-draw word that sounds the same.',
 example:'Sumerian scribes wrote ti “life” with the sign for ti “arrow”.',
 research:['Gelb, I. J. (1952). A Study of Writing. University of Chicago Press.','Daniels, P. T. & Bright, W. (eds.) (1996). The World’s Writing Systems. Oxford University Press.','Cooper, J. S. (2004). Babylonian beginnings. In Houston (ed.), The First Writing. Cambridge University Press.'],
 desc:'Picture tiles (bee, leaf, eye, can, sea, arrow) can be pressed in order to spell a target phrase by sound. The built sequence and whether it spells the target are shown.',
 dur:10,hint:'Choose a target and press the tiles in the order that spells it by sound. Clear to start again.',
 init:()=>({t:'belief',seq:[]}),
 watch(p){const keys=['belief','see','ti'],i=Math.min(2,Math.floor(p*3)),q=p*3-i,t=keys[i],seq=L1_REBUS[t].seq;return {t,seq:seq.slice(0,Math.min(seq.length,Math.floor(q*(seq.length+1.5))))}},
 ui:[{choose:[['belief','belief'],['see','I can see'],['ti','Sumerian “life”']],label:'Target',get:s=>s.t,act:'t'},{b:'Clear',act:'clear'}],
 on:{t(s,v){s.t=v;s.seq=[]},add(s,v){if(s.seq.length<4)s.seq.push(v);return 'keep'},clear(s){s.seq=[]}},
 draw(s,f,X){
  const tg=L1_REBUS[s.t],ok=s.seq.join()===tg.seq.join();let out=heading(`Spell “${tg.say}” with pictures`);
  L1_TILES.forEach(([k,lab],i)=>{const x=40+i*90;out+=hit(X,'add',k,`Add the ${lab} picture`,R(x,56,78,86,'#fff',C.line,10)+L1_icon(k,x+39,90,1)+TF(x+39,132,lab,13,C.muted))});
  out+=R(40,166,520,96,C.pale,'none',12)+TF(52,186,'Your sequence',13,C.muted,'start');
  if(!s.seq.length)out+=TF(300,226,'press tiles above',14,C.muted);
  s.seq.forEach((k,i)=>{out+=L1_icon(k,90+i*110,226,1.2)+(i<s.seq.length-1?TBF(145+i*110,232,'+',20,C.muted):'')});
  out+=R(40,280,520,86,'#fff',ok?C.green:C.grid,10)+TBF(56,306,ok?'Spelled by sound':(s.seq.length?'Not yet':'Waiting'),15,ok?C.green:C.ink,'start')+L1_para(56,330,ok?tg.note:'Say each picture’s name aloud and listen for the target.',70,13,C.muted);
  return {svg:out,phase:ok?tg.note:'Rebus writing: pick pictures for their sound, not their meaning.'};
 }});

const L1_RAD=[{r:'water',m:'clear',py:'qīng'},{r:'sun',m:'fine weather',py:'qíng'},{r:'speech',m:'ask, invite',py:'qǐng'},{r:'heart',m:'feeling',py:'qíng'},{r:'rice',m:'refined, essence',py:'jīng'}];
const L1_MAYA={logo:{n:'one word sign',blocks:[['PAKAL','shield']],note:'The shield sign alone writes the word pakal.'},syll:{n:'syllables',blocks:[['pa',''],['ka',''],['la','']],note:'pa-ka-la: three syllable signs; the final a is not pronounced, giving pakal.'},mixed:{n:'word sign + sound hint',blocks:[['PAKAL','shield'],['la','']],note:'The shield sign plus la, a phonetic complement that confirms the reading ends in -l.'}};
SCENE({id:'logograms-compound',name:'Meaning and sound together',tag:'Chinese compounds and Maya glyphs',
 definition:'Most logographic systems mix meaning and sound. A Chinese phono-semantic compound joins a meaning part (a “radical”) to a sound part; Maya scribes could write the same word with a word sign, with syllable signs, or with both.',
 example:'Sound part qīng “blue-green” + water = qīng “clear”; + sun = qíng “fine weather”. The Maya ruler K’inich Janaab Pakal’s name could be written with a shield sign or as pa-ka-la.',
 research:['DeFrancis, J. (1984). The Chinese Language: Fact and Fantasy.','Knorozov, Y. V. (1952). Ancient writing of Central America. Sovetskaya Etnografiya 3 (syllabic reading of Maya).','Coe, M. D. (1992). Breaking the Maya Code. Thames & Hudson.','Proskouriakoff, T. (1960). Historical implications of a pattern of dates at Piedras Negras. American Antiquity 25, 454–475.'],
 desc:'Chinese view: five meaning parts can each be joined to the sound part qīng, giving five words that sound alike. Maya view: three spellings of the name Pakal drawn as glyph blocks (schematic).',
 dur:12,hint:'In the Chinese view, press a meaning part to build a word. In the Maya view, press a spelling to compare.',
 init:()=>({view:'chinese',r:0,m:'logo'}),
 watch(p){return p<.6?{view:'chinese',r:Math.min(4,Math.floor(p/.6*5)),m:'logo'}:{view:'maya',r:0,m:['logo','syll','mixed'][Math.min(2,Math.floor((p-.6)/.4*3))]}},
 ui:[{choose:[['chinese','Chinese'],['maya','Maya']],label:'Script',get:s=>s.view,act:'view'}],
 on:{view(s,v){s.view=v},r(s,v){s.r=Number(v);return 'keep'},m(s,v){s.m=v;return 'keep'}},
 draw(s,f,X){
  let out;
  if(s.view==='chinese'){const d=L1_RAD[s.r];out=heading('One sound part, five meanings');
   L1_RAD.forEach((q,i)=>{out+=L1_chip(X,'r',i,40+i*106,52,96,q.r,i===s.r,`Meaning part: ${q.r}`)});
   out+=box(60,110,150,90,'',C.greenp)+TF(135,140,'meaning part',13,C.muted)+TBF(135,174,d.r,18,C.green);
   out+=TBF(232,162,'+',24,C.muted)+box(255,110,150,90,'',C.amberp)+TF(330,140,'sound part',13,C.muted)+TBF(330,174,'qīng',18,C.amber)+TF(330,192,'“blue-green”',13,C.muted);
   out+=TBF(428,162,'=',24,C.muted)+box(450,110,110,90,'',C.pale)+TBF(505,150,d.py,18,C.blue)+TF(505,176,`“${d.m}”`,13,C.ink);
   out+=L1_note(60,230,500,120,'Reading the parts',`The radical says what area of meaning the word is in; the sound part says roughly how it is pronounced. Three thousand years of sound change have blurred some links: with rice, the same sound part now reads jīng.`,72);
   return {svg:out,phase:`${d.r} + qīng → ${d.py} “${d.m}”. The sound part is a clue to pronunciation, not a picture of the idea.`}}
  const v=L1_MAYA[s.m];out=heading('Three ways to write pakal “shield”');
  Object.entries(L1_MAYA).forEach(([k,q],i)=>{out+=L1_chip(X,'m',k,60+i*165,52,150,q.n,k===s.m,`Spelling: ${q.n}`)});
  const n=v.blocks.length,bw=110,x0=300-(n*bw+(n-1)*16)/2;
  v.blocks.forEach(([t,sub],i)=>{const x=x0+i*(bw+16),big=t===t.toUpperCase()&&t.length>2;out+=R(x,110,bw,110,big?'#efe4d0':'#f6efe2','#9a7a4a',22)+TBF(x+bw/2,170,t,big?20:24,'#6b4f26')+(sub?TF(x+bw/2,196,sub,13,C.muted):'')});
  out+=TF(300,240,'glyph blocks drawn schematically',13,C.muted)+L1_note(60,256,480,100,'How it was cracked',`${v.note} Knorozov showed in 1952 that Maya signs included syllables; Proskouriakoff showed in 1960 that inscriptions record the lives of rulers.`,66);
  return {svg:out,phase:v.note};
 }});

/* ---------------- Lesson: The alphabet ---------------- */
const L1_A=[[[18,90],[50,10],[82,90]],[[30,62],[70,62]]],L1_HEAD=L1_CUNE.head.strokes;
const L1_LET={
 A:{name:'’alp',mean:'ox',st:[{s:L1_CUNE.ox.strokes},{s:[[[80,15],[22,50],[80,85]],[[54,22],[54,78]]]},{s:L1_A,rot:-22},{s:L1_A}]},
 B:{name:'bayt',mean:'house',st:[{s:[[[45,85],[20,85],[20,20],[80,20],[80,85],[62,85]]]},{s:[[[62,92],[62,26],[48,12],[32,24],[46,40],[62,40]]]},{s:[[[30,10],[30,90]],[[30,10],[66,28],[30,50],[70,70],[30,90]]]},{s:[[[30,10],[30,90]],[[30,10],[60,10],[72,22],[72,38],[60,50],[30,50]],[[30,50],[64,50],[78,62],[78,78],[64,90],[30,90]]]}]},
 M:{name:'mem',mean:'water',st:[{s:[[[8,40],[22,22],[36,40],[50,22],[64,40],[78,22],[92,40]],[[8,64],[22,46],[36,64],[50,46],[64,64],[78,46],[92,64]]]},{s:[[[12,36],[28,15],[44,36],[60,15],[60,92]]]},{s:[[[15,90],[28,10],[50,58],[72,10],[85,90]]]},{s:[[[20,90],[20,10],[50,62],[80,10],[80,90]]]}]},
 O:{name:'‘ayin',mean:'eye',st:[{s:[[[8,50],[30,28],[70,28],[92,50],[70,72],[30,72],[8,50]],L1_circ(50,50,11,12)]},{s:[L1_circ(50,50,30)]},{s:[L1_circ(50,50,30)]},{s:[L1_circ(50,50,38)]}]},
 R:{name:'rosh',mean:'head',st:[{s:L1_HEAD},{s:[[[62,92],[62,12]],[[62,12],[30,24],[62,42]]]},{s:[[[35,92],[35,10]],[[35,10],[64,16],[70,32],[60,46],[35,50]]]},{s:[[[35,92],[35,10]],[[35,10],[64,16],[70,32],[60,46],[35,50]],[[48,50],[78,92]]]}]}};
const L1_ASTAGE=[{n:'Proto-Sinaitic',d:'c. 1850 BCE'},{n:'Phoenician',d:'c. 1050 BCE'},{n:'Early Greek',d:'c. 750 BCE'},{n:'Latin',d:'c. 500 BCE'}];
SCENE({id:'alphabet',name:'The alphabet',tag:'Pictures that became letters',
 definition:'The first alphabet probably arose in Egypt or Sinai early in the second millennium BCE (often dated about 1900–1800 BCE, though place, date and makers are debated), among Semitic speakers who borrowed Egyptian pictures and used each for the first sound of its name in their own language (acrophony). It passed through Phoenician to Greek and Latin.',
 example:'A picture of an ox head, ’alp, stood for the sound at the start of ’alp; turned and simplified, it became Greek alpha and Latin A.',
 research:['Darnell, J. C. et al. (2005). Two early alphabetic inscriptions from the Wadi el-Ḥôl. Annual of the American Schools of Oriental Research 59.','Goldwasser, O. (2010). How the alphabet was born from hieroglyphs. Biblical Archaeology Review 36(2) (argues the inventors were not trained scribes; debated).','Naveh, J. (1982). Early History of the Alphabet. Magnes Press.'],
 desc:'One letter is drawn large at the chosen stage, with a strip of its four stages below: Proto-Sinaitic picture, Phoenician, early Greek and Latin. The Semitic letter name and its meaning are shown.',
 dur:12,hint:'Choose a letter and move through the stages. Say the old name aloud: its first sound is the letter’s sound.',
 init:()=>({l:'A',stage:0}),
 watch(p){const l=['A','B','M','O','R'][Math.min(4,Math.floor(p*5))],stage=Math.min(3,Math.floor((p*5%1)*4));return {l,stage}},
 ui:[{choose:Object.keys(L1_LET).map(k=>[k,k]),label:'Letter',get:s=>s.l,act:'l'},{range:'stage',label:'Stage',min:0,max:3,step:1,get:s=>s.stage,act:'stage',show:v=>L1_ASTAGE[v].n}],
 on:{l(s,v){s.l=v},stage(s,v){s.stage=Number(v)}},
 draw(s){
  const L=L1_LET[s.l],st=L.st[s.stage];let out=heading(`${s.l}: from ${L.name} “${L.mean}” · ${L1_ASTAGE[s.stage].n}, ${L1_ASTAGE[s.stage].d}`);
  out+=R(200,52,200,190,'#fff',C.grid,12)+L1_sign(st.s,300,147,140,{rot:st.rot||0,col:s.stage===0?'#8a5a2b':C.ink,w:7});
  L.st.forEach((q,i)=>{const x=40+i*135,on=i===s.stage;out+=R(x,262,120,110,on?C.pale:'#fff',on?C.blue:C.grid,8)+L1_sign(q.s,x+60,302,54,{rot:q.rot||0,col:on?C.ink:C.muted,w:3})+TF(x+60,350,L1_ASTAGE[i].n,13,on?C.ink:C.muted)+TF(x+60,366,L1_ASTAGE[i].d,13,C.muted)});
  const ph=[`A picture of ${L.mean === 'eye'?'an':'a'} ${L.mean}. Its Semitic name ${L.name} begins with the sound the sign came to stand for.`,`Phoenician traders used a simplified ${L.name}, written right to left, for a consonant.`,s.l==='O'?'Greek kept the circle but used it for a vowel, o: Greek had no use for the throat sound of ‘ayin.':'Greek borrowed the letter, often turned or reversed as writing direction changed.',`Latin, via the Etruscans, gives the form used for English today.`][s.stage];
  return {svg:out,phase:ph};
 }});

const L1_VOW=[{ph:'’alep',snd:'glottal stop ’',gr:'alpha',v:'a',g:'A'},{ph:'he',snd:'h',gr:'epsilon',v:'e',g:'E'},{ph:'yod',snd:'y',gr:'iota',v:'i',g:'I'},{ph:'‘ayin',snd:'throat sound ‘',gr:'omicron',v:'o',g:'O'},{ph:'waw',snd:'w',gr:'upsilon',v:'u',g:'Y'}];
SCENE({id:'alphabet-vowels',name:'Adding the vowels',tag:'Phoenician consonants, Greek vowels',
 definition:'Phoenician wrote only consonants: an abjad. When Greeks adopted it around 800 BCE they reused consonant letters they did not need, some for Semitic sounds Greek lacked, to write vowels, creating a full alphabet with signs for both consonants and vowels.',
 example:'Phoenician ’alep (a glottal stop) became Greek alpha, a; ‘ayin (a throat consonant) became omicron, o.',
 research:['Powell, B. B. (1991). Homer and the Origin of the Greek Alphabet. Cambridge University Press.','Swiggers, P. (1996). Transmission of the Phoenician script to the West. In Daniels & Bright (eds.), The World’s Writing Systems.','Daniels, P. T. (1990). Fundamentals of grammatology. Journal of the American Oriental Society 110, 727–731 (the terms abjad and abugida).'],
 desc:'A sentence is shown with consonants only or with vowels. Below, five Phoenician letters can be pressed to see the Greek vowel each became.',
 dur:10,hint:'Switch the sentence between consonants only and full spelling, then press each Phoenician letter to see its Greek vowel.',
 init:()=>({full:false,i:0}),
 watch(p){return {full:p>.3&&p<.5,i:Math.min(4,Math.floor(p*5))}},
 ui:[{choose:[[0,'Consonants only'],[1,'With vowels']],label:'Spelling',get:s=>s.full?1:0,act:'full'}],
 on:{full(s,v){s.full=Number(v)===1},i(s,v){s.i=Number(v);return 'keep'}},
 draw(s,f,X){
  const d=L1_VOW[s.i];let out=heading('Writing with and without vowels');
  out+=R(40,50,520,74,'#fff',C.grid,10)+TBF(300,96,s.full?'Writing without vowels is hard to read':'Wrtng wtht vwls s hrd t rd',22,s.full?C.green:C.ink);
  out+=TF(300,144,'In Semitic languages a root of consonants carries the core meaning: k-t-b “write” in Arabic kataba, kitāb, kātib.',13,C.muted);
  L1_VOW.forEach((q,i)=>{const x=40+i*104,on=i===s.i;out+=hit(X,'i',i,`Phoenician ${q.ph}`,R(x,164,94,52,on?C.blue:'#fff',on?C.blue:C.line,8)+TBF(x+47,186,q.ph,14,on?'#fff':C.ink)+TF(x+47,206,q.snd,13,on?'#fff':C.muted))});
  out+=arrow(300,226,300,256,C.line,2.5)+R(170,262,260,96,C.pale,'none',12)+TBF(230,322,d.g,44,C.blue)+TBF(280,300,`Greek ${d.gr}`,16,C.ink,'start')+TF(280,326,`now a vowel: ${d.v}`,14,C.green,'start');
  return {svg:out,phase:`${d.ph} was a consonant (${d.snd}) in Phoenician. Greek did not need the letter for that consonant, so it used it for the vowel ${d.v}.`};
 }});

const L1_TREE={
 phoenician:{n:'Phoenician',y:-1050,lane:190,note:'An abjad of 22 consonant letters, written right to left, spread by sea trade across the Mediterranean.'},
 aramaic:{n:'Aramaic',y:-800,lane:120,from:'phoenician',note:'The script of empires from Assyria to Persia; the parent of many scripts of Asia.'},
 hebrew:{n:'Hebrew (square)',y:-200,lane:62,from:'aramaic',note:'The square Hebrew script grew out of Aramaic writing; vowel points were added much later.'},
 arabic:{n:'Arabic',y:400,lane:120,from:'aramaic',note:'Developed from Nabataean, an Aramaic offshoot, by about the 4th–5th century CE; letters join within words.'},
 brahmi:{n:'Brahmi',y:-250,lane:175,from:'aramaic',dash:true,note:'The ancestor of Devanagari, Tamil, Thai and many other scripts. Whether it derives from Aramaic is debated.'},
 greek:{n:'Greek',y:-800,lane:262,from:'phoenician',note:'The first full alphabet, with letters for vowels as well as consonants.'},
 latin:{n:'Latin',y:-600,lane:322,from:'greek',note:'Reached Rome by way of the Etruscans; now the most widely used script in the world.'},
 cyrillic:{n:'Cyrillic',y:900,lane:262,from:'greek',note:'Created in the First Bulgarian Empire around 900 CE, largely from Greek letters.'}};
const L1_yx=y=>50+(y+1100)/2100*470;
SCENE({id:'alphabet-spread',name:'One alphabet, many scripts',tag:'The family of the alphabet',
 definition:'Most alphabets and abjads in use today descend from Phoenician: eastward through Aramaic to Hebrew and Arabic (and possibly to the Brahmi scripts of South Asia), westward through Greek to Latin and Cyrillic.',
 example:'Hebrew, Arabic, Greek and Latin all go back to Phoenician; Chinese characters and Hangul do not.',
 research:['Daniels, P. T. & Bright, W. (eds.) (1996). The World’s Writing Systems.','Salomon, R. (1998). Indian Epigraphy. Oxford University Press (the Brahmi origin question).','Naveh, J. (1982). Early History of the Alphabet.'],
 desc:'A family tree laid out on a time axis from 1100 BCE to 1000 CE, from Phoenician to Aramaic, Hebrew, Arabic, Brahmi (dashed, debated), Greek, Latin and Cyrillic. Pressing a script shows a note about it.',
 dur:12,hint:'Press a script on the tree to read where it came from. The dashed line is a disputed descent.',
 init:()=>({k:'greek'}),
 watch(p){const ks=Object.keys(L1_TREE);return {k:ks[Math.min(ks.length-1,Math.floor(p*ks.length))]}},
 on:{k(s,v){s.k=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('The descendants of Phoenician');
  for(const y of [-1000,-500,0,500,1000]){const x=L1_yx(y);out+=L(x,46,x,348,'#eef3f6',1)+TF(x,364,y<0?`${-y} BCE`:y===0?'1 CE':`${y} CE`,13,C.muted)}
  for(const [k,d] of Object.entries(L1_TREE))if(d.from){const a=L1_TREE[d.from];out+=P(`M${fmt(L1_yx(a.y)+40)} ${a.lane}C${fmt(L1_yx(a.y)+70)} ${a.lane} ${fmt(L1_yx(d.y)-40)} ${d.lane} ${fmt(L1_yx(d.y)-10)} ${d.lane}`,C.line,2,'none',d.dash?'stroke-dasharray="6 5"':'')}
  for(const [k,d] of Object.entries(L1_TREE)){const x=L1_yx(d.y),on=k===s.k,w=d.n.length*7.5+20;out+=hit(X,'k',k,d.n,R(x-w/2+10,d.lane-15,w,30,on?C.blue:'#fff',on?C.blue:C.line,8)+TF(x+10,d.lane+5,d.n,13,on?'#fff':C.ink))}
  return {svg:out,phase:`${L1_TREE[s.k].n}: ${L1_TREE[s.k].note}`};
 }});

/* ---------------- Lesson: Decipherment ---------------- */
function L1_hiero(k,x,y){const c='#5a4630';
 const m={stool:R(x-14,y-8,28,16,'#d9c39a',c,2),loaf:P(`M${x-15} ${y+6}A15 15 0 0 1 ${x+15} ${y+6}Z`,c,2,'#d9c39a'),rope:Ci(x,y-3,9,'none',c,'stroke-width="2.5"')+L(x,y+6,x,y+14,c,2.5),
  lion:`<ellipse cx="${x+2}" cy="${y+2}" rx="15" ry="7" fill="#d9c39a" stroke="${c}" stroke-width="2"/>`+Ci(x-14,y-5,6,'#d9c39a',c,'stroke-width="2"')+L(x+16,y,x+20,y-8,c,2),
  owl:`<ellipse cx="${x}" cy="${y}" rx="9" ry="14" fill="#d9c39a" stroke="${c}" stroke-width="2"/>`+Ci(x,y-9,5,'#fff',c,'stroke-width="1.5"'),
  reeds:P(`M${x-6} ${y+14}Q${x-10} ${y} ${x-4} ${y-14}`,c,3)+P(`M${x+6} ${y+14}Q${x+2} ${y} ${x+8} ${y-14}`,c,3),reed:P(`M${x} ${y+14}Q${x-5} ${y} ${x+2} ${y-14}`,c,3),
  cloth:R(x-6,y-14,12,28,'#d9c39a',c,3)+L(x-6,y-2,x+6,y+4,c,1.5),basket:P(`M${x-15} ${y-4}Q${x} ${y+16} ${x+15} ${y-4}Z`,c,2,'#d9c39a')+P(`M${x+10} ${y}q8 0 7 -8`,c,2),
  bird:`<ellipse cx="${x}" cy="${y}" rx="13" ry="8" fill="#d9c39a" stroke="${c}" stroke-width="2"/>`+Ci(x-12,y-8,5,'#d9c39a',c,'stroke-width="2"')+L(x-4,y+8,x-4,y+15,c,2)+L(x+4,y+8,x+4,y+15,c,2),
  slope:P(`M${x-14} ${y+10}Q${x-8} ${y-10} ${x+12} ${y-12}L${x+12} ${y+10}Z`,c,2,'#d9c39a'),rib:P(`M${x-16} ${y-4}L${x+11} ${y-4}L${x+16} ${y+4}L${x-16} ${y+4}Z`,c,2,'#d9c39a'),
  hand:R(x-15,y-5,30,10,'#d9c39a',c,4)+L(x+8,y-5,x+14,y-11,c,2),mouth:`<ellipse cx="${x}" cy="${y}" rx="15" ry="6" fill="#d9c39a" stroke="${c}" stroke-width="2"/>`};
 return m[k]||'';
}
const L1_PTOL=[['stool','p'],['loaf','t'],['rope','o'],['lion','l'],['rib','m'],['reeds','i'],['cloth','s']];
const L1_CLEO=[['slope','k'],['lion','l'],['reed','e'],['rope','o'],['stool','p'],['bird','a'],['hand','t'],['mouth','r'],['bird','a']];
const L1_RSTEP=['A decree in three scripts','Ptolemy’s name','Cleopatra’s name','Shared signs, shared sounds','Two signs for one sound'];
SCENE({id:'decipherment',name:'Cracking Egyptian',tag:'The Rosetta Stone and two royal names',
 definition:'The Rosetta Stone (196 BCE) repeats one decree in hieroglyphs, Demotic and Greek. By comparing royal names in cartouches with their Greek spellings, Champollion showed in 1822 that hieroglyphs included sound signs, and with his knowledge of Coptic went on to read the language.',
 example:'Ptolemy and Cleopatra share p, o and l, and the same signs sit in the matching places in both cartouches.',
 research:['Champollion, J.-F. (1822). Lettre à M. Dacier relative à l’alphabet des hiéroglyphes phonétiques. Paris.','Parkinson, R. (1999). Cracking Codes: The Rosetta Stone and Decipherment. British Museum Press.','Young, T. (1819). Egypt. Encyclopaedia Britannica supplement (earlier partial readings of Ptolemy).'],
 desc:'Steps through the decipherment: the three-script stone, the Ptolemy cartouche with each sign’s sound, the Cleopatra cartouche, lines joining the shared signs, and the two different signs that both stand for t. Sign shapes are schematic.',
 dur:12,hint:'Step through the five stages. Watch which signs line up between the two names.',
 init:()=>({step:0}),
 watch(p){return {step:Math.min(4,Math.floor(p*5))}},
 ui:[{range:'step',label:'Step',min:0,max:4,step:1,get:s=>s.step,act:'step',show:v=>L1_RSTEP[v]}],
 on:{step(s,v){s.step=Number(v)}},
 draw(s){
  let out=heading(L1_RSTEP[s.step]);
  if(s.step===0){out+=P('M150 60L450 60L470 120L470 340L130 340L130 120Z',C.line,2,'#e9e6e1');
   [['Hieroglyphic',80,128],['Demotic',150,196],['Ancient Greek',220,266]].forEach(([n,y,y2],i)=>{out+=TBF(300,y+6+i*18,n,14,C.ink);for(let r=0;r<3;r++)out+=L(160,y+28+i*18+r*12,440,y+28+i*18+r*12,['#8d7a5c','#9b8f7c','#7b8a96'][i],i===0?5:2.5,i===0?'stroke-dasharray="6 5"':'')});
   return {svg:out,phase:'The same decree in three scripts: Greek could be read, so it was a key to the other two.'}}
  const row=(signs,y,lab,hl,cap)=>{const w=signs.length*46+20,x0=300-w/2;let o=R(x0,y-30,w,60,'#f4ecdc','#8d7a5c',30)+TF(x0-10,y+5,lab,13,C.ink,'end');
   signs.forEach(([k,snd],i)=>{const x=x0+30+i*46,on=hl&&hl(i,snd);o+=(on?Ci(x,y,21,on==='t'?C.coralp:C.amberp):'')+L1_hiero(k,x,y)+(cap?TBF(x,y+50,snd,15,on?(on==='t'?C.coral:C.amber):C.muted):'')});return {svg:o,x:i=>x0+30+i*46}};
  const shared=s.step>=3?{p:1,o:1,l:1}:{},hl=(i,snd)=>s.step===4&&snd==='t'?'t':(shared[snd]?'s':false);
  const a=row(L1_PTOL,110,'Ptolemy',hl,true);out+=a.svg;
  if(s.step>=2){const b=row(L1_CLEO,250,'Cleopatra',hl,true);out+=b.svg;
   if(s.step===3)[[0,4],[2,3],[3,1]].forEach(([i,j])=>{out+=L(a.x(i),140,b.x(j),222,C.amber,2,'stroke-dasharray="5 4"')});
   if(s.step===4)out+=L(a.x(1),140,b.x(6),222,C.coral,2,'stroke-dasharray="5 4"')}
  out+=TF(300,350,'Sign shapes drawn schematically; the names are spelled by sound inside each cartouche.',13,C.muted);
  return {svg:out,phase:['','Each sign in Ptolemy’s cartouche lines up with a sound in the Greek name Ptolemaios.','Cleopatra, from an obelisk at Philae, gives a second name to test the readings.','p, o and l sit where the Greek spellings predict, in both names: the signs are sounds.','t is written with a loaf in one name and a hand in the other: two signs for one sound, which Champollion correctly accepted.'][s.step]};
 }});

const L1_LB=[['ko','no','so'],['ko','no','si','jo'],['a','mi','ni','so'],['a','mi','ni','si','jo'],['tu','ri','so'],['tu','ri','si','jo']];
const L1_PLACE=['Knossos','Knossian','Amnisos','Amnisian','Tylissos','Tylissian'];
function L1_lbGlyph(syl,x,y,col){let h=0;for(const ch of syl)h=(h*31+ch.charCodeAt(0))%997;const r=rng(h+7);let o='';
 const n=2+Math.floor(r()*2);for(let i=0;i<n;i++){const t=Math.floor(r()*4),a=-9+r()*18,b=-12+r()*24;
  o+=t===0?L(x-10,y+a*.6,x+10,y+a*.6,col,2.5):t===1?L(x+b*.5,y-13,x+b*.5,y+13,col,2.5):t===2?Ci(x+a*.6,y+b*.4,5,'none',col,'stroke-width="2.2"'):P(`M${fmt(x-9)} ${fmt(y+10)}L${fmt(x)} ${fmt(y-12)}L${fmt(x+9)} ${fmt(y+10)}`,col,2.2)}
 return o}
const L1_KSTEP=['Unknown signs','Kober: same stem, different endings','Ventris: a grid of sounds','Ventris: guess the place names','Blegen: a tripod tablet'];
SCENE({id:'decipherment-kober',name:'Cracking Linear B',tag:'Kober’s grids, Ventris’s guess',
 definition:'Linear B, a script of Bronze Age Crete and Greece, was deciphered without any bilingual text. Alice Kober showed that words changed their endings, revealing which signs shared consonants; Michael Ventris arranged the signs in a grid and in 1952 tested place-name guesses, which revealed an early form of Greek.',
 example:'ko-no-so “Knossos” and ko-no-si-jo “Knossian” share a stem; so and si share their consonant s.',
 research:['Kober, A. E. (1946). Inflection in Linear Class B. American Journal of Archaeology 50, 268–276.','Ventris, M. & Chadwick, J. (1953). Evidence for Greek dialect in the Mycenaean archives. Journal of Hellenic Studies 73, 84–103.','Blegen, C. W. (1953). An inscribed tablet from Pylos. Archaiologike Ephemeris (the tripod tablet, PY Ta 641).','Fox, M. (2013). The Riddle of the Labyrinth. Ecco (on Kober’s contribution).'],
 desc:'Six Linear B words are shown as rows of signs (drawn schematically). The steps highlight shared stems and changed endings, place the signs into a consonant-by-vowel grid, assign sounds from place names, and finally show the word ti-ri-po-de beside tripod pictures.',
 dur:14,hint:'Step through how the script was cracked. Nothing gives the sounds until the last guesses, yet the grid already shows which signs belong together.',
 init:()=>({step:0}),
 watch(p){return {step:Math.min(4,Math.floor(p*5))}},
 ui:[{range:'step',label:'Step',min:0,max:4,step:1,get:s=>s.step,act:'step',show:v=>L1_KSTEP[v]}],
 on:{step(s,v){s.step=Number(v)}},
 draw(s){
  let out=heading(L1_KSTEP[s.step]);const known=s.step>=3;
  if(s.step===4){out+=R(70,60,460,200,'#efe6d6','#9a8466',10);const tri=(x)=>L(x-16,170,x+16,170,'#6b5636',3)+L(x-12,170,x-18,206,'#6b5636',3)+L(x,170,x,206,'#6b5636',3)+L(x+12,170,x+18,206,'#6b5636',3)+P(`M${x-14} 170Q${x} 150 ${x+14} 170`,'#6b5636',3);
   ['ti','ri','po','de'].forEach((q,i)=>{out+=L1_lbGlyph(q,130+i*44,110,'#6b5636')+TBF(130+i*44,145,q,15,C.blue)});out+=tri(380)+tri(450);
   out+=TF(300,240,'ti-ri-po-de = Greek tripode, “two tripods”, next to pictures of tripods',13,C.ink);
   out+=L1_note(70,276,460,82,'Confirmation, 1953','A newly found tablet from Pylos spelled tripod words next to pictures of tripods, using Ventris’s values: strong evidence the decipherment was right.',68);
   return {svg:out,phase:'The tripod tablet: Ventris’s sounds give Greek words that match the pictures beside them.'}}
  L1_LB.forEach((w,j)=>{const y=74+j*44,stem=w.length===3||w.length===4&&w[3]==='so'?w.length-1:w.length-2;
   w.forEach((q,i)=>{const x=60+i*40,end=s.step>=1&&i>=stem;out+=(end?R(x-17,y-17,34,34,q==='si'||q==='so'?C.amberp:C.coralp,'none',6):'')+L1_lbGlyph(q,x,y,C.ink)+(known?TBF(x,y+27,q,13,C.blue):'')});
   if(known)out+=TF(280,y+5,L1_PLACE[j],13,C.green,'start')});
  if(s.step>=2){const rows=['','k','n','m','r','s','t','j'],cols=['a','e','i','o','u'],gx=380,gy=72,cw=38,rh=34;
   out+=R(gx-36,gy-26,cw*5+46,rh*8+34,'#fff',C.grid,8);
   cols.forEach((c,i)=>{out+=TF(gx+i*cw+cw/2,gy-8,known?c:`v${i+1}`,13,C.muted)});
   rows.forEach((r,j)=>{out+=TF(gx-8,gy+j*rh+rh/2+5,known?(r||'–'):`c${j+1}`,13,C.muted,'end');
    cols.forEach((c,i)=>{const syl=r+c,used=L1_LB.some(w=>w.includes(syl));if(used)out+=L1_lbGlyph(syl,gx+i*cw+cw/2,gy+j*rh+rh/2,(syl==='so'||syl==='si')?C.amber:C.ink)})})}
  return {svg:out,phase:['Six words in an unknown script. No one knows the language or a single sound.','Endings alternate while the stem stays: Kober inferred that the changing signs share a consonant but differ in vowel.','Signs sharing a consonant go in one row, signs sharing a vowel in one column, still without sounds.','Guessing three Cretan place names fills the grid; other words then read as Greek, which surprised Ventris himself.',''][s.step]};
 }});

const L1_DEC=[
 {n:'Egyptian hieroglyphs',bi:'yes',lang:'yes (Coptic)',corpus:'large',st:'Deciphered 1822',ok:true},
 {n:'Linear B',bi:'no',lang:'yes (Greek)',corpus:'thousands of tablets',st:'Deciphered 1952',ok:true},
 {n:'Maya glyphs',bi:'partial (Landa, 1566)',lang:'yes (Mayan languages)',corpus:'large',st:'Mostly read since the 1950s–1990s',ok:true},
 {n:'Linear A',bi:'no',lang:'no',corpus:'about 1,400 short texts',st:'Undeciphered',ok:false},
 {n:'Indus script',bi:'no',lang:'no',corpus:'about 4,000 very short texts',st:'Undeciphered; even whether it is writing is debated',ok:false},
 {n:'Rongorongo',bi:'no',lang:'yes (Rapa Nui)',corpus:'about 26 objects',st:'Undeciphered',ok:false}];
SCENE({id:'decipherment-odds',name:'Why some scripts stay silent',tag:'What a decipherer needs',
 definition:'Decipherments succeed when there is enough text, a known language related to the one written, and ideally a bilingual inscription. Scripts lacking all three, such as Linear A and the Indus script, remain unread despite many attempts.',
 example:'Linear B had no bilingual, but it wrote Greek, a known language, and there were thousands of tablets.',
 research:['Robinson, A. (2002). Lost Languages: The Enigma of the World’s Undeciphered Scripts. McGraw-Hill.','Farmer, S., Sproat, R. & Witzel, M. (2004). The collapse of the Indus-script thesis. Electronic Journal of Vedic Studies 11(2).','Rao, R. P. N. et al. (2009). Entropic evidence for linguistic structure in the Indus script. Science 324, 1165 (and the replies it drew).'],
 desc:'A table of six scripts with three columns: is there a bilingual, is the language known, how much text survives, and the status. Pressing a row highlights it. Corpus sizes are approximate.',
 dur:10,hint:'Press each script and compare the three columns with its status.',
 init:()=>({i:3}),
 watch(p){return {i:Math.min(5,Math.floor(p*6))}},
 on:{i(s,v){s.i=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Text, language and a bilingual');const cx=[30,190,285,370];
  ['Script','Bilingual?','Language?','Surviving text'].forEach((h,i)=>{out+=TBF(cx[i]+(i?0:6),66,h,13,C.muted,'start')});
  L1_DEC.forEach((d,i)=>{const y=78+i*40,on=i===s.i,ck=v=>v.startsWith('yes')||v.startsWith('partial');
   out+=hit(X,'i',i,d.n,R(22,y,556,34,on?C.pale:'#fff',on?C.blue:C.grid,6)+TF(cx[0]+6,y+22,d.n,13,d.ok?C.ink:C.coral,'start')+TF(cx[1],y+22,ck(d.bi)?'✓':'✗',14,ck(d.bi)?C.green:C.coral,'start')+TF(cx[2],y+22,ck(d.lang)?'✓':'✗',14,ck(d.lang)?C.green:C.coral,'start')+TF(cx[3],y+22,d.corpus,13,C.ink,'start'))});
  const d=L1_DEC[s.i];out+=R(22,324,556,44,d.ok?C.greenp:C.coralp,'none',8)+TBF(36,345,d.n+':',14,C.ink,'start')+TF(36,362,`${d.st}.`,13,C.ink,'start');
  return {svg:out,phase:`${d.n}: ${d.st.toLowerCase()}. Corpus sizes are approximate.`};
 }});

/* ---------------- Lesson: Printing ---------------- */
const L1_BOOKS=[['14th c. manuscripts',2.7],['15th c. manuscripts',5],['Printed 1454–1500',12.6],['Printed 16th c.',217],['Printed 17th c.',532]];
SCENE({id:'printing',name:'Copies by hand and by press',tag:'The arithmetic of print',
 definition:'Copying a book by hand takes the same effort for every copy. Printing front-loads the effort, setting the type once, after which each extra copy is cheap. After Gutenberg’s press (c. 1450) the number of books in Europe rose by orders of magnitude.',
 example:'A 200-page book: a scribe copying 4 pages a day needs 50 days per copy; a press needs about 100 days to set the type once, then well under an hour of press time per copy (illustrative rates).',
 research:['Eisenstein, E. L. (1979). The Printing Press as an Agent of Change. Cambridge University Press.','Buringh, E. & van Zanden, J. L. (2009). Charting the “rise of the West”: manuscripts and printed books in Europe. Journal of Economic History 69(2), 409–445 (book output estimates, rounded here).'],
 desc:'Time view: bars compare days to make the chosen number of copies by scribe and by press, with illustrative rates. Output view: estimated books produced in Europe per period, on a logarithmic scale, from Buringh and van Zanden.',
 dur:12,hint:'In the time view, raise the number of copies and see where the press wins. Then switch to the output view.',
 init:()=>({view:'time',pages:200,copies:20}),
 watch(p){return p<.6?{view:'time',pages:200,copies:1+Math.round(smooth(p/.6)*99)}:{view:'out',pages:200,copies:100}},
 ui:[{choose:[['time','Time per job'],['out','Books in Europe']],label:'View',get:s=>s.view,act:'view'},{range:'pages',label:'Pages',min:20,max:600,step:10,get:s=>s.pages,act:'pages'},{range:'copies',label:'Copies',min:1,max:300,step:1,get:s=>s.copies,act:'copies'}],
 on:{view(s,v){s.view=v},pages(s,v){s.pages=Number(v)},copies(s,v){s.copies=Number(v)}},
 draw(s){
  if(s.view==='out'){let out=heading('Estimated books produced in Western Europe');const x0=200,w=360,lg=v=>Math.log10(v*1e6),px=v=>x0+(lg(v)-6)/(9-6)*w;
   for(const t of [1e6,1e7,1e8,1e9]){const x=x0+(Math.log10(t)-6)/3*w;out+=L(x,60,x,300,'#eef3f6',1)+TF(x,318,t>=1e9?'1 billion':t>=1e8?'100 million':t>=1e7?'10 million':'1 million',13,C.muted)}
   L1_BOOKS.forEach(([n,v],i)=>{const y=74+i*44;out+=TF(x0-10,y+20,n,13,C.ink,'end')+R(x0,y+4,Math.max(4,px(v)-x0),26,i<2?C.amber:C.blue,'none',4)+TF(px(v)+6,y+22,v>=100?`${v} million`:`${v} million`,13,C.ink,'start')});
   out+=TF(300,350,'Estimates rounded from Buringh & van Zanden (2009); log scale.',13,C.muted);
   return {svg:out,phase:'In about fifty years of printing, Europe made more books than in the previous century of hand copying; the next century made far more again.'}}
  const scribe=s.pages*s.copies/4,set=s.pages/2,press=set+s.pages*s.copies/3600;let out=heading(`${s.copies} ${s.copies===1?'copy':'copies'} of a ${s.pages}-page book`);
  const mx=Math.max(scribe,press),sc=420/mx;
  out+=TF(130,96,'Scribe',14,C.ink,'end')+R(140,78,Math.max(3,scribe*sc),30,C.amber,'none',4)+TF(Math.min(560,148+scribe*sc),98,`${Math.round(scribe).toLocaleString('en-GB')} days`,13,C.ink,scribe*sc>380?'end':'start');
  out+=TF(130,152,'Press',14,C.ink,'end')+R(140,134,Math.max(3,set*sc),30,C.purple,'none',4)+R(140+set*sc,134,Math.max(2,(press-set)*sc),30,C.blue,'none',4)+TF(Math.min(560,148+press*sc),154,`${Math.round(press).toLocaleString('en-GB')} days`,13,C.ink,press*sc>380?'end':'start');
  out+=Ci(150,192,6,C.purple)+TF(162,197,'setting the type (once)',13,C.muted,'start')+Ci(340,192,6,C.blue)+TF(352,197,'printing every copy',13,C.muted,'start');
  out+=L1_note(40,222,520,130,'Rates used (illustrative)','A scribe copies about 4 pages a day. Setting type takes about half a day per page; a hand press then prints about 3,600 impressions a day. Real figures varied widely; the shape of the comparison is what matters: the press wins once more than two copies are needed.',78);
  return {svg:out,phase:press<scribe?`The press is ${Math.round(scribe/press)} times faster for ${s.copies} copies.`:'For one or two copies, hand copying is still at least as quick as setting type.'};
 }});

const L1_EVENTS=[{y:'868',n:'Diamond Sutra',d:'Oldest dated printed book: a woodblock scroll found at Dunhuang.'},{y:'c. 1040',n:'Bi Sheng',d:'Movable type of baked clay, described by Shen Kuo in China.'},{y:'1377',n:'Jikji',d:'Oldest surviving book printed with movable metal type, in Korea.'},{y:'c. 1450',n:'Gutenberg',d:'Metal type cast in a hand mould, oil-based ink and a screw press, in Mainz.'}];
SCENE({id:'printing-movable',name:'Movable type',tag:'Set it once, print it many times',
 definition:'Movable type uses a separate piece, a sort, for each character. Sorts are set in a line, inked and pressed onto paper, then taken apart and reused. Type is a mirror image, so the print reads the right way round.',
 example:'To print WORD, the compositor sets the sorts for W, O, R, D, each reversed, and the print reads WORD.',
 research:['Tsien, T.-H. (1985). Paper and Printing. In Needham (ed.), Science and Civilisation in China 5(1). Cambridge University Press.','Kapr, A. (1996). Johann Gutenberg: The Man and His Invention. Scolar Press.'],
 desc:'A type case of letters can be pressed to set sorts in a composing stick, drawn mirror-reversed. Print shows the impression reading normally. A timeline of four milestones in printing can be pressed for notes.',
 dur:12,hint:'Press letters to set type (it appears reversed), then Print. Press a date on the timeline to read about it.',
 init:()=>({set:['W','O','R','D'],printed:false,e:3}),
 watch(p){const w='PRINT'.split(''),n=Math.min(5,Math.floor(p*7));return {set:w.slice(0,n),printed:p>.75,e:Math.min(3,Math.floor(p*4))}},
 ui:[{b:'Print',act:'print'},{b:'Clear',act:'clear'}],
 on:{add(s,v){if(s.set.length<10){s.set.push(v);s.printed=false}return 'keep'},print(s){s.printed=s.set.length>0},clear(s){s.set=[];s.printed=false},e(s,v){s.e=Number(v);return 'keep'}},
 draw(s,f,X){
  let out=heading('Set the type, then print');const letters='ABCDEFGHIJKLMNOPRSTUW'.split('');
  letters.forEach((c,i)=>{const x=36+(i%7)*38,y=52+Math.floor(i/7)*38;out+=hit(X,'add',c,`Set the letter ${c}`,R(x,y,32,32,'#f4ecdc','#9a8466',4)+TBF(x+16,y+22,c,15,C.ink))});
  out+=R(310,52,260,108,'#fff',C.grid,8)+TF(322,72,'Composing stick (type is reversed)',13,C.muted,'start');
  s.set.forEach((c,i)=>{const x=544-i*24;out+=R(x-11,88,22,34,'#b8b8b8','#6b6b6b',2)+`<g transform="translate(${x} 113) scale(-1 1)">${TBF(0,0,c,18,'#222')}</g>`});
  out+=R(310,170,260,70,'#fffdf7',C.grid,6)+TF(322,188,'Printed sheet',13,C.muted,'start')+(s.printed?TBF(440,226,s.set.join(''),24,C.ink):TF(440,222,'press Print',13,C.muted));
  out+=L(40,300,560,300,C.line,2);L1_EVENTS.forEach((e,i)=>{const x=80+i*150,on=i===s.e;out+=hit(X,'e',i,`${e.y}: ${e.n}`,Ci(x,300,9,on?C.blue:'#fff',C.blue,'stroke-width="2"')+TF(x,284,e.y,13,on?C.blue:C.ink)+TF(x,326,e.n,13,on?C.blue:C.muted))});
  out+=TF(300,360,L1_EVENTS[s.e].d,13,C.ink);
  return {svg:out,phase:s.printed?`Mirror-image sorts print ${s.set.join('')} the right way round; afterwards they go back in the case for reuse.`:'Each sort is reversed so that the printed image reads correctly.'};
 }});

const L1_SORTS=[{k:'modern',n:'English type case',v:100,d:'Upper and lower case, figures and punctuation: roughly a hundred sorts.'},{k:'b42',n:'Gutenberg’s 42-line Bible',v:290,d:'Gutenberg imitated handwriting with many ligatures and abbreviations: around 290 different sorts.'},{k:'hangul',n:'Korean (Hangul syllables)',v:2350,d:'24 letters, but printed as syllable blocks; a standard set of common blocks has 2,350.'},{k:'chinese',n:'Chinese, daily use',v:3500,d:'About 3,500 characters cover most everyday text; complete sets of type ran to tens of thousands of pieces.'}];
SCENE({id:'printing-sorts',name:'How many pieces of type?',tag:'Why scripts printed differently',
 definition:'The number of distinct sorts a printer needs depends on the script. A few dozen letters suit movable type well; thousands of characters make woodblocks, which carve a whole page at once, competitive for centuries in East Asia.',
 example:'An English case needs about a hundred different sorts; printing everyday Chinese needs thousands, each in several copies.',
 research:['Tsien, T.-H. (1985). Paper and Printing (Wang Zhen’s wooden type, c. 1300).','Kapr, A. (1996). Johann Gutenberg (the sorts of the 42-line Bible).','KS X 1001 (Korean standard character set: 2,350 common Hangul syllables).'],
 desc:'Bars on a logarithmic scale compare the number of distinct sorts needed for an English type case, Gutenberg’s Bible, Korean syllable blocks and everyday Chinese. Pressing a bar shows a note. Values are approximate.',
 dur:10,hint:'Press each bar. Notice that the scale goes up by factors of ten.',
 init:()=>({k:'b42'}),
 watch(p){return {k:L1_SORTS[Math.min(3,Math.floor(p*4))].k}},
 on:{k(s,v){s.k=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('Distinct pieces of type needed (approximate)');const x0=230,w=330,px=v=>x0+Math.log10(v)/4*w;
  for(const t of [1,10,100,1000,10000]){const x=px(t);out+=L(x,56,x,250,'#eef3f6',1)+TF(x,268,t.toLocaleString('en-GB'),13,C.muted)}
  L1_SORTS.forEach((d,i)=>{const y=64+i*46,on=d.k===s.k;out+=hit(X,'k',d.k,d.n,TF(x0-10,y+21,d.n,13,on?C.blue:C.ink,'end')+R(x0,y+4,px(d.v)-x0,28,on?C.blue:C.line,'none',4)+TBF(px(d.v)+6,y+23,d.v.toLocaleString('en-GB'),13,C.ink,'start'))});
  const d=L1_SORTS.find(q=>q.k===s.k);out+=L1_note(40,286,520,78,d.n,d.d,80);
  return {svg:out,phase:`${d.n}: about ${d.v.toLocaleString('en-GB')} distinct sorts. The more distinct signs, the more type to cast, store and sort back.`};
 }});

/* ---------------- Lesson: Scripts of the world ---------------- */
const L1_TYPES={
 logo:{n:'Logographic',ex:'Chinese characters (with sound parts)',signs:[['WRITE','one sign for the word']],count:3500,d:'One sign per word or meaningful part: thousands of signs.'},
 syll:{n:'Syllabary',ex:'Japanese kana, Cherokee, Linear B',signs:[['ka',''],['ta',''],['ba','']],count:70,d:'One sign per syllable: usually 40 to 90 signs.'},
 abjad:{n:'Abjad',ex:'Phoenician, Hebrew, Arabic',signs:[['k',''],['t',''],['b','']],count:25,d:'Consonants only; the reader supplies the vowels.'},
 abugida:{n:'Abugida',ex:'Devanagari, Ge’ez (Ethiopic)',signs:[['k','(a)'],['t','(a)'],['b','(a)']],count:50,d:'Each consonant sign carries a default vowel; marks change it.'},
 alpha:{n:'Alphabet',ex:'Greek, Latin, Cyrillic',signs:[['k',''],['a',''],['t',''],['a',''],['b',''],['a','']],count:26,d:'Separate letters for consonants and vowels.'},
 feat:{n:'Featural',ex:'Hangul',signs:[['k','tongue back'],['a',''],['t','tongue tip'],['a',''],['b','lips'],['a','']],count:24,d:'Letter shapes show how each sound is made.'}};
SCENE({id:'scripts-of-the-world',name:'Kinds of writing system',tag:'What a sign stands for',
 definition:'Writing systems differ in what a sign stands for: a word or morpheme (logographic), a syllable (syllabary), a consonant (abjad), a consonant with a built-in vowel (abugida), a consonant or vowel (alphabet), or a sound’s features (featural). Real scripts often mix types.',
 example:'The Arabic word kataba “he wrote” is k-t-b in an abjad, ka-ta-ba in a syllabary and k-a-t-a-b-a in an alphabet.',
 research:['Daniels, P. T. (1990). Fundamentals of grammatology. Journal of the American Oriental Society 110 (abjad, abugida).','Sampson, G. (1985). Writing Systems. Hutchinson (featural).','Daniels, P. T. & Bright, W. (eds.) (1996). The World’s Writing Systems.'],
 desc:'The word kataba is written as boxes according to the chosen type of system, with example scripts. A bar chart compares typical numbers of signs for each type on a logarithmic scale.',
 dur:12,hint:'Choose a type and see how kataba is written, then compare how many signs each type needs.',
 init:()=>({t:'abjad'}),
 watch(p){const k=Object.keys(L1_TYPES);return {t:k[Math.min(5,Math.floor(p*6))]}},
 ui:[{choose:Object.entries(L1_TYPES).map(([k,v])=>[k,v.n]),label:'Type',get:s=>s.t,act:'t'}],
 on:{t(s,v){s.t=v}},
 draw(s){
  const d=L1_TYPES[s.t];let out=heading(`${d.n}: kataba “he wrote”`);
  const n=d.signs.length,bw=n>3?62:96,gap=12,x0=300-(n*bw+(n-1)*gap)/2;
  d.signs.forEach(([t,sub],i)=>{const x=x0+i*(bw+gap);out+=R(x,56,bw,80,s.t==='feat'?C.greenp:C.pale,C.line,8)+TBF(x+bw/2,sub?98:104,t,t.length>3?16:24,C.blue)+(sub?TF(x+bw/2,122,sub,13,C.muted):'')});
  out+=TF(300,160,`${d.d} Examples: ${d.ex}.`,13,C.ink);
  const x0b=170,w=380,px=v=>x0b+Math.log10(v)/4*w;
  for(const t of [10,100,1000]){const x=px(t);out+=L(x,182,x,348,'#eef3f6',1)+TF(x,364,t.toLocaleString('en-GB'),13,C.muted)}
  Object.entries(L1_TYPES).forEach(([k,v],i)=>{const y=184+i*27,on=k===s.t;out+=TF(x0b-10,y+16,v.n,13,on?C.blue:C.ink,'end')+R(x0b,y+3,px(v.count)-x0b,18,on?C.blue:C.line,'none',3)+TF(px(v.count)+6,y+16,`~${v.count.toLocaleString('en-GB')}`,13,C.muted,'start')});
  return {svg:out,phase:`${d.n}: ${d.d} Typical sign counts are rough; most real scripts mix more than one type.`};
 }});

// Hangul jamo as strokes in a 0–100 box.
const L1_J={
 g:{s:[[[15,22],[80,22],[80,88]]],r:'g',name:'ㄱ g/k',art:'the back of the tongue touching the soft palate'},
 k:{s:[[[15,22],[80,22],[80,88]],[[15,52],[80,52]]],r:'k',name:'ㅋ k (breathy)',art:'ㄱ with an added stroke: a stronger, breathy k'},
 n:{s:[[[20,15],[20,80],[86,80]]],r:'n',name:'ㄴ n',art:'the tongue tip touching the ridge behind the teeth'},
 d:{s:[[[18,20],[82,20]],[[20,20],[20,80],[86,80]]],r:'d',name:'ㄷ d/t',art:'ㄴ with an added stroke: the tongue tip makes a full stop'},
 m:{s:[[[20,20],[80,20],[80,82],[20,82],[20,20]]],r:'m',name:'ㅁ m',art:'the shape of the closed mouth'},
 b:{s:[[[22,12],[22,86]],[[78,12],[78,86]],[[22,46],[78,46]],[[22,86],[78,86]]],r:'b',name:'ㅂ b/p',art:'ㅁ with added strokes: the lips burst open'},
 s:{s:[[[52,14],[14,86]],[[46,42],[86,86]]],r:'s',name:'ㅅ s',art:'the shape of a tooth'},
 ng:{s:[L1_circ(50,52,32)],r:'',name:'ㅇ silent / ng',art:'the round throat: silent at the start of a syllable, ng at the end'},
 h:{s:[[[40,8],[60,8]],[[18,24],[82,24]],L1_circ(50,64,24)],r:'h',name:'ㅎ h',art:'the throat circle with added strokes: breath'}};
const L1_V={a:{s:[[[40,8],[40,92]],[[40,50],[70,50]]],r:'a',v:1},eo:{s:[[[60,8],[60,92]],[[30,50],[60,50]]],r:'eo',v:1},i:{s:[[[50,8],[50,92]]],r:'i',v:1},
 o:{s:[[[8,70],[92,70]],[[50,40],[50,70]]],r:'o',v:0},u:{s:[[[8,30],[92,30]],[[50,30],[50,62]]],r:'u',v:0},eu:{s:[[[8,50],[92,50]]],r:'eu',v:0}};
const L1_FIN={none:'',g:'k',n:'n',m:'m',ng:'ng',b:'p'};
function L1_block(c,v,fn,x,y,size,col){const V=L1_V[v],Jc=L1_J[c],hasF=fn!=='none',w=size,h=size,o={col,w:Math.max(3,size*.05)};let out='';
 const put=(strokes,bx,by,bw,bh)=>L1_sign(strokes,bx+bw/2,by+bh/2,Math.min(bw,bh),o);
 const top=hasF?h*.58:h;
 if(V.v){out+=put(Jc.s,x,y,w*.6,top)+put(V.s,x+w*.52,y,w*.48,top)}
 else{out+=put(Jc.s,x+w*.2,y,w*.6,hasF?h*.34:h*.55)+put(V.s,x,y+(hasF?h*.3:h*.48),w,hasF?h*.3:h*.5)}
 if(hasF)out+=put(L1_J[fn].s,x+w*.22,y+h*.62,w*.56,h*.38);
 return out}
SCENE({id:'scripts-of-the-world-hangul',name:'Hangul',tag:'A script designed from the mouth',
 definition:'Hangul was created under King Sejong of Korea in 1443 and published in 1446. Its basic consonant letters picture the speech organs that make each sound, extra strokes mark stronger sounds, and letters are grouped into syllable blocks.',
 example:'ㅎ h + ㅏ a + ㄴ n stack into one block, read han.',
 research:['Hunminjeongeum Haerye (1446), the explanatory text published with the script.','Kim-Renaud, Y.-K. (ed.) (1997). The Korean Alphabet: Its History and Structure. University of Hawai‘i Press.','Sampson, G. (1985). Writing Systems (calls Hangul a featural script).'],
 desc:'A syllable block is built from a chosen first consonant, vowel and optional final consonant, drawn as strokes with its romanisation. A panel explains how the chosen consonant’s shape reflects how it is made.',
 dur:12,hint:'Choose a first consonant, a vowel and a final consonant. Vertical vowels sit to the right, horizontal ones underneath.',
 init:()=>({c:'h',v:'a',f:'n'}),
 watch(p){const seq=[['h','a','n'],['s','a','n'],['m','o','m'],['b','a','b'],['g','u','none'],['k','eo','ng']],i=Math.min(5,Math.floor(p*6));return {c:seq[i][0],v:seq[i][1],f:seq[i][2]}},
 ui:[{choose:Object.keys(L1_J).map(k=>[k,L1_J[k].name.split(' ')[0]]),label:'First',get:s=>s.c,act:'c'},{choose:Object.keys(L1_V).map(k=>[k,k]),label:'Vowel',get:s=>s.v,act:'v'},{choose:Object.keys(L1_FIN).map(k=>[k,k==='none'?'none':L1_J[k].name.split(' ')[0]]),label:'Final',get:s=>s.f,act:'f'}],
 on:{c(s,v){s.c=v},v(s,v){s.v=v},f(s,v){s.f=v}},
 draw(s){
  const rom=L1_J[s.c].r+L1_V[s.v].r+L1_FIN[s.f];let out=heading(`One syllable block: ${rom}`);
  out+=R(50,56,220,220,'#fff',C.grid,12)+L1_block(s.c,s.v,s.f,80,86,160,C.ink)+TBF(160,310,rom,26,C.blue);
  out+=TF(160,336,L1_V[s.v].v?'vertical vowel: written to the right':'horizontal vowel: written below',13,C.muted);
  const J=L1_J[s.c];out+=L1_note(300,56,270,130,`Consonant ${J.name.split(' ').slice(1).join(' ')}`,`Shape shows ${J.art}.`,34);
  out+=R(300,200,270,150,'#fff',C.grid,10)+TBF(312,222,'Basic shapes and added strokes',13,C.ink,'start');
  [['g','k'],['n','d'],['m','b']].forEach(([a,b],i)=>{const y=262+i*0;const x=320+i*86;out+=L1_sign(L1_J[a].s,x+14,262,30,{col:C.ink,w:3})+arrow(x+32,262,x+48,262,C.line,2,6)+L1_sign(L1_J[b].s,x+64,262,30,{col:C.blue,w:3})});
  out+=TF(435,310,'one more stroke = a stronger sound',13,C.muted)+TF(435,330,'(g→k, n→d, m→b)',13,C.muted);
  return {svg:out,phase:`${rom}: ${L1_J[s.c].name.split(' ')[1]||'silent'} + ${s.v}${s.f==='none'?'':' + '+L1_FIN[s.f]}, built into a single block. Letters are learned in an afternoon, as Sejong intended.`};
 }});

const L1_CHV=['a','e','i','o','u','v'];
const L1_CHR=['','g','h','l','m','n','qu','s','d','dl','ts','w','y'];
const L1_LOOK={a:'D',e:'R',i:'T',la:'W',mi:'H'};
SCENE({id:'scripts-of-the-world-cherokee',name:'Sequoyah’s syllabary',tag:'Writing invented by one person',
 definition:'Sequoyah, a Cherokee silversmith who did not read English, created a syllabary for Cherokee by about 1821. Each sign stands for a syllable; the Cherokee Nation adopted it and literacy spread quickly, with a bilingual newspaper from 1828.',
 example:'The syllable ga has its own sign, unrelated in shape to gi or go. Some signs borrow Latin letter shapes with unrelated sounds: the sign for a looks like D.',
 research:['Walker, W. & Sarbaugh, J. (1993). The early history of the Cherokee syllabary. Ethnohistory 40(1), 70–94.','Cushman, E. (2011). The Cherokee Syllabary: Writing the People’s Perseverance. University of Oklahoma Press.','Kroeber, A. L. (1940). Stimulus diffusion. American Anthropologist 42, 1–20.'],
 desc:'A grid of Cherokee syllables, romanised, with consonants in rows and the six vowels a, e, i, o, u and v in columns. Pressing a cell shows the syllable; for a few, the Latin letter its sign resembles is shown.',
 dur:12,hint:'Press syllables in the grid. The script has 85 signs today (86 originally): a sign for every syllable, not every sound.',
 init:()=>({r:3,c:0}),
 watch(p){const seq=[[0,0],[0,1],[0,2],[3,0],[4,2],[1,0],[7,3]],i=Math.min(6,Math.floor(p*7));return {r:seq[i][0],c:seq[i][1]}},
 on:{cell(s,v){const [r,c]=String(v).split(',').map(Number);s.r=r;s.c=c;return 'keep'}},
 draw(s,f,X){
  let out=heading('The Cherokee syllabary, romanised');const gx=60,gy=58,cw=40,rh=22;
  L1_CHV.forEach((v,i)=>{out+=TBF(gx+i*cw+cw/2,gy-2,v,13,C.muted)});
  L1_CHR.forEach((r,j)=>{out+=TF(gx-8,gy+j*rh+16,r||'–',13,C.muted,'end');
   L1_CHV.forEach((v,i)=>{const syl=r+v,on=j===s.r&&i===s.c,gone=syl==='mv';out+=hit(X,'cell',j+','+i,`Syllable ${syl}`,R(gx+i*cw+2,gy+j*rh+3,cw-4,rh-3,on?C.blue:'#fff',gone?C.coral:C.grid,4)+TF(gx+i*cw+cw/2,gy+j*rh+18,syl,13,on?'#fff':gone?C.coral:C.ink))})});
  const syl=L1_CHR[s.r]+L1_CHV[s.c],lk=L1_LOOK[syl];
  out+=R(330,56,240,140,'#fff',C.grid,10)+TBF(450,110,syl,34,C.blue);
  out+=TF(450,140,syl==='mv'?'mv: a sign later dropped from the syllabary':lk?`its sign looks like Latin ${lk}`:'its own distinct sign',13,C.muted);
  out+=lk?TBF(450,180,lk,22,C.ink):'';
  out+=L1_note(330,210,240,150,'One person’s invention','Sequoyah knew that marks on paper could carry speech, but not how English letters worked. He invented a new system for Cherokee, an example of “stimulus diffusion”.',32);
  return {svg:out,phase:`${syl}: one sign for a whole syllable. Cherokee speakers who knew the spoken language could learn to read it in weeks.`};
 }});
