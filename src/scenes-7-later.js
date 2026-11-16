/* ===================== Ted Nelson era 7 · Later structures (1995–2014) ===================== */
// ZigZag's many-dimensional cells, Xanadu Space's floating documents with transclusion beams, OpenXanadu's
// documents built as lists of spans over permanent content, and parallel documents with visible connections.
// Every picture is a pure function of state, frame and X. The one timed experiment reads performance.now()
// in on() handlers and orders trials with seeded shuffles.
const T7_wrap=(str,n)=>{const out=[];let line='';for(const w of String(str).split(' ')){if(line&&(line+' '+w).length>n){out.push(line);line=w}else line=line?line+' '+w:w}if(line)out.push(line);return out};
const T7_lines=(x,y,lines,size=13,fill=C.ink,anchor='start',lh=18)=>lines.map((l,i)=>TF(x,y+i*lh,l,size,fill,anchor)).join('');
const T7_tag=(x,y,label,fill,ink=C.ink)=>{const w=label.length*7+16;return R(x,y-14,w,20,fill,'none',10)+TBF(x+w/2,y+1,label,13,ink)};

/* =========================== zigzag =========================== */
// Ten cells and three dimensions. A dimension is a set of ranks (ordered lists); a cell sits in at most one rank
// per dimension, so it has at most one neighbour each way on each dimension.
const T7_CELLS={memex:['Memex','1945'],xanadu:['Xanadu','1960'],hyper:['Hypertext','1965'],nls:['NLS demo','1968'],www:['Web','1991'],zz:['ZigZag','1990s'],
 bush:['Bush','b. 1890'],engel:['Engelbart','b. 1925'],nelson:['Nelson','b. 1937'],tbl:['Berners-Lee','b. 1955']};
const T7_DIMS={'d.time':[['memex','xanadu','hyper','nls','www','zz']],
 'd.creator':[['bush','memex'],['nelson','xanadu','hyper','zz'],['engel','nls'],['tbl','www']],
 'd.born':[['bush','engel','nelson','tbl']]};
const T7_DIMNOTE={'d.time':'works in date order','d.creator':'a person, then their works','d.born':'people in order of birth'};
function T7_rank(dim,cell){for(const r of T7_DIMS[dim]){const i=r.indexOf(cell);if(i>=0)return {r,i}}return {r:[cell],i:0}}
function T7_zzView(s,X){
 const colX=o=>300+o*112,rowY=o=>190+o*52,W=100,H=42;let out='';
 const h=T7_rank(s.x,s.cur);
 // Horizontal rank through the cursor.
 const cols=[];for(let o=-2;o<=2;o++){const j=h.i+o;if(j>=0&&j<h.r.length)cols.push([o,h.r[j]])}
 for(let k=0;k+1<cols.length;k++)out+=L(colX(cols[k][0])+W/2,rowY(0),colX(cols[k+1][0])-W/2,rowY(0),C.blue,3);
 if(h.i-2>0)out+=TF(colX(-2)-W/2-6,rowY(0)+5,'…',16,C.blue,'end');
 if(h.i+2<h.r.length-1)out+=TF(colX(2)+W/2+6,rowY(0)+5,'…',16,C.blue,'start');
 // For each cell in that rank, its rank on the vertical dimension.
 for(const [o,c] of cols){const v=T7_rank(s.y,c);
  for(let q=-2;q<=2;q++){const j=v.i+q;if(j<0||j>=v.r.length)continue;const cell=v.r[j],x=colX(o),y=rowY(q);
   if(q<2&&j+1<v.r.length)out+=L(x,y+H/2,x,rowY(q+1)-H/2,C.green,3);
   const isCur=q===0&&o===0,inner=R(x-W/2,y-H/2,W,H,isCur?C.coralp:'#fff',isCur?C.coral:(q===0?C.blue:C.green),8,isCur?'style="stroke-width:3"':'style="stroke-width:1.6"')+TBF(x,y-4,T7_CELLS[cell][0],13,C.ink)+TF(x,y+13,T7_CELLS[cell][1],13,C.muted);
   out+=hit(X,'go',cell,`${T7_CELLS[cell][0]}: move the cursor here`,inner)}
  if(v.i-2>0)out+=TF(colX(o),rowY(-2)-H/2-6,'⋮',15,C.green);
  if(v.i+2<v.r.length-1)out+=TF(colX(o),rowY(2)+H/2+16,'⋮',15,C.green);
 }
 out+=TF(20,354,`Across (blue): ${s.x}, ${T7_DIMNOTE[s.x]}`,13,C.blue,'start');
 out+=TF(20,374,`Down (green): ${s.y}, ${T7_DIMNOTE[s.y]}`,13,C.green,'start');
 return out;
}
const T7_DIMOPTS=[['d.time','d.time'],['d.creator','d.creator'],['d.born','d.born']];
SCENE({id:'zigzag',name:'ZigZag: cells on many dimensions',tag:'Two dimensions at a time',
 definition:'ZigZag (Nelson’s zzstructure) stores cells that can be connected along any number of dimensions. A view shows two dimensions at once, across and down, through a cursor cell; change the dimensions and the same cells rearrange.',
 example:'Put the cursor on Nelson. With d.creator down, his works line up below him; switch across to d.born and the people appear in order of birth, with each person’s works hanging below them.',
 desc:'A cursor cell in the centre, its rank on one dimension drawn across in blue, and for each of those cells its rank on a second dimension drawn down in green.',
 research:'Nelson, T. H. (2004). A cosmology for a different computer universe: data model, mechanisms, virtual machine and visualization infrastructure. Journal of Digital Information 5(1). Nelson developed ZigZag from the mid-1990s, partly at Keio University.',
 dur:12,hint:'Press any cell to move the cursor there. Choose which dimension runs across and which runs down.',
 init:()=>({cur:'nelson',x:'d.born',y:'d.creator'}),
 watch(p){if(p<.55){const seq=T7_DIMS['d.time'][0];return {cur:seq[Math.min(seq.length-1,Math.floor(p/.55*seq.length))],x:'d.time',y:'d.creator'}}
  return p<.8?{cur:'nelson',x:'d.born',y:'d.creator'}:{cur:'hyper',x:'d.creator',y:'d.time'}},
 ui:[{choose:T7_DIMOPTS,label:'Across',get:s=>s.x,act:'x'},{choose:T7_DIMOPTS,label:'Down',get:s=>s.y,act:'y'},{b:'Swap across and down',act:'swap'}],
 on:{go(s,c){if(T7_CELLS[c])s.cur=c;return 'keep'},x(s,v){if(v===s.y)s.y=s.x;s.x=v;return 'keep'},y(s,v){if(v===s.x)s.x=s.y;s.y=v;return 'keep'},swap(s){[s.x,s.y]=[s.y,s.x];return 'keep'}},
 draw(s,f,X){
  let out=heading('The same cells, seen along two chosen dimensions',26)+T7_zzView(s,X);
  const n=T7_CELLS[s.cur][0];
  return {svg:out,phase:`Cursor on ${n}. Across runs ${s.x} (${T7_DIMNOTE[s.x]}); down runs ${s.y} (${T7_DIMNOTE[s.y]}). Nothing was copied or moved: only the choice of dimensions changed.`};
 }});

// Ranks: inserting into a rank splices it; a cell cannot have two next cells on one dimension.
SCENE({id:'zigzag-ranks',name:'Ranks and the one-neighbour rule',tag:'Why a second dimension',
 definition:'On each dimension a cell has at most one neighbour before it and one after it, so every dimension is made of simple chains called ranks. To connect a cell to a second “next” cell, you use another dimension.',
 example:'Inserting HES (1967) into the d.time rank splices it in between Hypertext and the NLS demo. Trying to give the Memex a second next cell on d.influence is refused; a second dimension holds the extra connection.',
 desc:'Three rows of cells, one per dimension: the d.time rank, the d.influence rank, and a second influence dimension that appears when it is needed.',
 research:'Nelson, T. H. (2004). A cosmology for a different computer universe. Journal of Digital Information 5(1). The ranks descend from the zippered lists of Nelson, T. H. (1965), Complex information processing, ACM National Conference.',
 dur:10,hint:'Insert HES into the timeline, then try to give the Memex a second next cell, then use a second dimension.',
 init:()=>({hes:false,tried:false,dim2:false}),
 watch(p){return {hes:p>=.25,tried:p>=.5,dim2:p>=.75}},
 ui:[{b:'Insert HES (1967) into d.time',act:'hes'},{b:'Link Memex → NLS on d.influence',act:'tryLink'},{b:'Use a second dimension',act:'dim2'}],
 on:{hes(s){s.hes=true;return 'keep'},tryLink(s){s.tried=true;return 'keep'},dim2(s){s.dim2=true;return 'keep'},reset(s){s.hes=false;s.tried=false;s.dim2=false;return 'keep'}},
 draw(s){
  let out=heading('Each dimension is made of simple chains',26);
  const cell=(x,y,id,col=C.blue,fill='#fff',extra='')=>R(x,y,74,40,fill,col,8,'style="stroke-width:1.8" '+extra)+TBF(x+37,y+16,T7_CELLS[id]?T7_CELLS[id][0]:'HES',13,C.ink)+TF(x+37,y+33,T7_CELLS[id]?T7_CELLS[id][1]:'1967',13,C.muted);
  const chain=(ids,y,col,newId)=>{let o='';ids.forEach((id,i)=>{const x=17+i*82;if(i)o+=L(x-8,y+20,x,y+20,col,3);o+=cell(x,y,id,col,id===newId?C.greenp:'#fff')});return o};
  const time=['memex','xanadu','hyper'].concat(s.hes?['hes']:[]).concat(['nls','www','zz']);
  out+=TBF(20,58,'d.time',13,C.blue,'start')+TF(80,58,s.hes?'HES spliced in: Hypertext → HES → NLS demo':'works in date order',13,C.muted,'start');
  out+=chain(time,68,C.blue,'hes');
  out+=TBF(20,140,'d.influence',13,C.purple,'start')+TF(110,140,'Bush’s memex inspired Nelson’s Xanadu',13,C.muted,'start');
  out+=chain(['memex','xanadu'],150,C.purple);
  if(s.tried){out+=P('M 54 190 C 90 226, 340 226, 382 190',C.coral,2.4,'none','stroke-dasharray="6 5"')+cell(345,150,'nls',C.coral,'#fff','stroke-dasharray="5 4"');
   out+=TBF(440,166,'✗ refused',13,C.coral,'start')+TF(440,184,'Memex already has a',13,C.coral,'start')+TF(440,200,'next cell here',13,C.coral,'start')}
  if(s.dim2){out+=TBF(20,236,'d.influence-2',13,C.green,'start')+TF(124,236,'the extra connection, on its own dimension',13,C.muted,'start');out+=chain(['memex','nls'],246,C.green)}
  const msg=!s.hes?'Ranks behave like zippered lists: inserting a cell splices the chain.':!s.tried?'HES now sits between Hypertext and the NLS demo; every other link is unchanged.':!s.dim2?'One dimension cannot branch. Engelbart was inspired by Bush too, so that link needs somewhere else to live.':'Branching is done with more dimensions, not with more links per dimension. Each view still shows simple chains.';
  return {svg:out,phase:msg};
 }});

// The same facts as folders, a table and a zzstructure: how many steps to answer three questions.
const T7_Q=[{q:'What did Nelson make?',tree:['1 step','Open the Nelson folder.'],table:['1 row','Read along Nelson’s row.'],zz:['3 steps','Follow d.creator down from Nelson.'],path:'creator'},
 {q:'What came after Hypertext?',tree:['4 folders','Open every folder and compare dates by hand.'],table:['2 columns','Scan the later columns; order inside a decade is lost.'],zz:['3 steps','Follow d.time onwards from Hypertext.'],path:'time'},
 {q:'Who was born before Nelson?',tree:['not stored','Birth years are not part of the folder tree.'],table:['not stored','The table needs an extra column of births.'],zz:['2 steps','Follow d.born back from Nelson.'],path:'born'}];
SCENE({id:'zigzag-compare',name:'Folders, tables and zzstructure',tag:'Structure decides the questions you can ask',
 definition:'A folder tree puts each item in one place; a table forces every item into rows and columns, leaving empty cells; a zzstructure connects each cell only along the dimensions that mean something for it.',
 example:'In folders by person, “what came after Hypertext?” means opening every folder; in the zzstructure it is a walk along d.time.',
 desc:'The same ten facts drawn as a folder tree, a table or a zzstructure, beside the number of steps each needs to answer a chosen question.',
 research:'Nelson, T. H. (2004). A cosmology for a different computer universe. Journal of Digital Information 5(1). Nelson, T. H. (1974). Computer Lib/Dream Machines, on hierarchy as an imposed structure. Step counts here are worked by hand for this small example.',
 dur:12,hint:'Choose a structure and a question. The highlighted route shows how the answer is found.',
 init:()=>({view:'zz',q:1}),
 watch(p){const k=Math.min(8,Math.floor(p*9));return {view:['tree','table','zz'][k%3],q:Math.floor(k/3)}},
 ui:[{choose:[['tree','Folders'],['table','Table'],['zz','ZigZag']],label:'Structure',get:s=>s.view,act:'view'},{choose:[[0,'Nelson’s works'],[1,'After Hypertext'],[2,'Born before Nelson']],label:'Question',get:s=>s.q,act:'q'}],
 on:{view(s,v){s.view=v;return 'keep'},q(s,v){s.q=Number(v);return 'keep'}},
 draw(s){
  const Q=T7_Q[s.q],ans=Q[s.view];let out=heading('Ten facts, three structures',26);
  if(s.view==='tree'){const rows=[['Works',0],['Bush',1],['Memex 1945',2],['Nelson',1],['Xanadu 1960',2],['Hypertext 1965',2],['ZigZag 1990s',2],['Engelbart',1],['NLS demo 1968',2],['Berners-Lee',1],['Web 1991',2]];
   rows.forEach(([n,d],i)=>{const y=60+i*25,x=30+d*28,hl=(s.q===0&&(n==='Nelson'||(d===2&&i>=4&&i<=6)))||(s.q===1&&d===1);
    if(d)out+=L(x-16,y-6,x-6,y-6,C.line,1.5);out+=TF(x,y,(d<2?'▸ ':'')+n,13,hl?C.coral:C.ink,'start')})}
  else if(s.view==='table'){const cols=['','1940s','1960s','1990s'],rows=[['Bush','Memex','—','—'],['Nelson','—','Xanadu|Hypertext','ZigZag'],['Engelbart','—','NLS demo','—'],['Berners-Lee','—','—','Web']];
   const cx=j=>j?112+(j-1)*78:20,cwid=j=>j?76:90;cols.forEach((c,j)=>{out+=TBF(cx(j)+cwid(j)/2,66,c,13,C.muted)});
   rows.forEach((r,i)=>r.forEach((c,j)=>{const x=cx(j),y=78+i*56,hl=(s.q===0&&i===1&&j>0)||(s.q===1&&j>=2&&c!=='—');out+=R(x,y,cwid(j),52,c==='—'?'#f3f6f8':(hl?C.coralp:'#fff'),C.grid,4);
    const parts=c.split('|');parts.forEach((t,k)=>{out+=(j?TF:TBF)(x+cwid(j)/2,y+26+(k-(parts.length-1)/2)*17+5,t,13,c==='—'?C.line:C.ink)})}))}
  else{const works=['memex','xanadu','hyper','nls','www','zz'],people=['bush','engel','nelson','tbl'],wy=i=>66+i*44,py={bush:66,engel:128,nelson:190,tbl:252};
   works.forEach((w,i)=>{if(i)out+=L(60,wy(i-1)+16,60,wy(i)-16,s.q===1&&i>=3?C.coral:C.blue,s.q===1&&i>=3?3.5:2.5);out+=R(20,wy(i)-16,96,32,'#fff',C.blue,6)+TBF(68,wy(i)+5,T7_CELLS[w][0],13,C.ink)});
   const born=['bush','engel','nelson','tbl'];born.forEach((p,i)=>{if(i)out+=L(274,py[born[i-1]]+16,274,py[p]-16,s.q===2&&i<=2?C.coral:C.green,s.q===2&&i<=2?3.5:2,'stroke-dasharray="4 3"')});
   const creator=[['bush','memex'],['nelson','xanadu'],['engel','nls'],['tbl','www']];
   creator.forEach(([p,w])=>{out+=P(`M 226 ${py[p]} C 180 ${py[p]}, 160 ${wy(works.indexOf(w))}, 116 ${wy(works.indexOf(w))}`,s.q===0&&p==='nelson'?C.coral:C.purple,s.q===0&&p==='nelson'?3.2:1.8)});
   out+=P(`M 116 ${wy(1)+8} C 140 ${wy(1)+20}, 140 ${wy(2)-8}, 116 ${wy(2)}`,s.q===0?C.coral:C.purple,s.q===0?3.2:1.8)+P(`M 116 ${wy(2)+8} C 160 ${wy(3)}, 160 ${wy(5)-10}, 116 ${wy(5)}`,s.q===0?C.coral:C.purple,s.q===0?3.2:1.8);
   people.forEach(p=>{out+=R(226,py[p]-16,96,32,'#fff',C.green,6)+TBF(274,py[p]+5,T7_CELLS[p][0],13,C.ink)});
   out+=TF(20,340,'blue d.time · purple d.creator · green d.born',13,C.muted,'start')}
  out+=R(360,52,220,250,C.pale,'none',10)+T7_lines(374,76,T7_wrap(Q.q,26),13,C.ink).replace(/<text /g,'<text font-weight="700" ');
  out+=TF(374,124,'Answer takes',13,C.muted,'start')+TBF(374,150,ans[0],20,s.view==='zz'?C.green:(ans[0]==='not stored'?C.coral:C.ink),'start');
  out+=T7_lines(374,182,T7_wrap(ans[1],27),13,C.ink);
  return {svg:out,phase:`${Q.q} With ${s.view==='tree'?'folders':s.view==='table'?'a table':'a zzstructure'}: ${ans[0]}. ${ans[1]}`};
 }});

/* =========================== xanadu-space =========================== */
// Three documents; spans of the centre document are transcluded from two sources and joined by beams.
const T7_SPANS=[{src:'A',from:[3,4],to:[1,2],col:C.blue},{src:'B',from:[5,6],to:[5,6],col:C.green},{src:'A',from:[7,7],to:[8,8],col:C.blue}];
const T7_LW=(doc,i)=>.55+.4*((Math.imul(i+1,2654435761)>>>0)%1000/1000)*(doc==='C'?.8:1);
function T7_panel(x,title,doc,spans,side,dim){let out=TBF(x+72,56,title,13,C.ink)+R(x,64,145,240,'#fff',C.grid,6);
 for(let i=0;i<10;i++){const sp=spans.find(sp=>i>=sp[0]&&i<=sp[1]);const y=84+i*22;out+=R(x+12,y-5,121*T7_LW(doc,i),10,sp?tint(sp[2],dim(sp[3])?.75:.15):'#d5e0e7','none',3)}
 return out}
SCENE({id:'xanadu-space',name:'Xanadu Space: documents and beams',tag:'Transclusion you can see',
 definition:'In Nelson’s Xanadu Space demonstrations, documents float side by side in a 3D space and every transcluded passage is joined to its source by a visible coloured beam.',
 example:'Document C quotes two passages from Source A and one from Source B. The beams show at a glance which parts are borrowed, from where, and what surrounds them at the source.',
 desc:'Three document panels, the centre one built partly from passages of the other two, with translucent beams joining each passage to where it came from.',
 research:['Nelson, T. H. (1999). Xanalogical structure, needed now more than ever: parallel documents, deep links to content, deep versioning, and deep re-use. ACM Computing Surveys 31(4es).','Xanadu Space was shown by Nelson and colleagues as a working 3D demonstration in the late 2000s; the layout here is a simplified reconstruction.'],
 dur:10,hint:'Choose which beams to show. Press a coloured passage in Document C to pick out its beam and its source. Turn on 3D to see the documents float apart.',
 init:()=>({show:'all',sel:-1}),
 watch(p){return {show:'all',sel:p<.4?-1:Math.min(2,Math.floor((p-.4)/.2)),grow:Math.min(1,p/.35)}},
 ui:[{choose:[['all','All beams'],['A','From A'],['B','From B'],['none','No beams']],label:'Show',get:s=>s.show,act:'show'},{b:'Clear selection',act:'clear'}],
 on:{show(s,v){s.show=v;return 'keep'},pick(s,i){s.sel=Number(i);return 'keep'},clear(s){s.sel=-1;return 'keep'}},
 draw(s,f,X){
  const vis=sp=>s.show==='all'||s.show===sp.src,dim=k=>s.sel>=0&&k!==s.sel,grow=s.grow===undefined?1:s.grow;let out=heading('Every borrowed passage is joined to its source',26);
  out+=T7_panel(20,'Source A','A',T7_SPANS.map((sp,k)=>sp.src==='A'?[sp.from[0],sp.from[1],sp.col,k]:null).filter(Boolean),'r',dim);
  out+=T7_panel(435,'Source B','B',T7_SPANS.map((sp,k)=>sp.src==='B'?[sp.from[0],sp.from[1],sp.col,k]:null).filter(Boolean),'l',dim);
  out+=T7_panel(228,'Document C','C',T7_SPANS.map((sp,k)=>[sp.to[0],sp.to[1],sp.col,k]),'',dim);
  T7_SPANS.forEach((sp,k)=>{if(!vis(sp)||grow<=0)return;const y=i=>84+i*22,a0=y(sp.from[0])-8,a1=y(sp.from[1])+8,c0=y(sp.to[0])-8,c1=y(sp.to[1])+8;
   const sx=sp.src==='A'?165:435,cx=sp.src==='A'?228:372,ex=lerp(sx,cx,grow);
   out+=`<polygon points="${sx},${a0} ${fmt(ex)},${fmt(lerp(a0,c0,grow))} ${fmt(ex)},${fmt(lerp(a1,c1,grow))} ${sx},${a1}" fill="${sp.col}" fill-opacity="${dim(k)?.08:.3}" stroke="${sp.col}" stroke-opacity="${dim(k)?.2:.7}"/>`});
  T7_SPANS.forEach((sp,k)=>{const y0=84+sp.to[0]*22-9,h=(sp.to[1]-sp.to[0])*22+18;out+=hit(X,'pick',k,`Passage ${k+1} of Document C, from Source ${sp.src}`,R(236,y0,129,h,'transparent',k===s.sel?C.coral:'none',4,'style="stroke-width:2.5"'))});
  const own=10-sum(T7_SPANS.map(sp=>sp.to[1]-sp.to[0]+1));
  out+=TF(300,330,`Document C: ${10-own} of 10 lines transcluded (blue from A, green from B), ${own} written fresh`,13,C.muted);
  const sp=T7_SPANS[s.sel];
  return {svg:out,phase:sp?`Passage ${s.sel+1} of Document C comes from Source ${sp.src}, lines ${sp.from[0]+1}–${sp.from[1]+1}. The beam leads straight to it, with its neighbours still around it.`:'Blue beams lead back to Source A, green to Source B. Nothing was copied: Document C shows the source passages in place.'};
 },
 three(s,f,X,project){
  const P=project([-5.8,5.8,-.5,3,0,4.8]),zL=i=>4.1-i*.4;let faces=[];
  const panel=(x0,x1,y,name)=>{faces.push({pts:[[x0,y,0],[x1,y,0],[x1,y,4.5],[x0,y,4.5]],fill:'#ffffff',opacity:1,stroke:'#9fb6c4'})};
  panel(-5.6,-2.6,2.5,'A');panel(-1.5,1.5,0,'C');panel(2.6,5.6,2.5,'B');
  const vis=sp=>s.show==='all'||s.show===sp.src;
  T7_SPANS.forEach((sp,k)=>{if(!vis(sp))return;const a0=zL(sp.from[0])+.18,a1=zL(sp.from[1])-.18,c0=zL(sp.to[0])+.18,c1=zL(sp.to[1])-.18,ax=sp.src==='A'?-2.6:2.6,cx=sp.src==='A'?-1.5:1.5;
   faces.push({pts:[[ax,2.5,a0],[cx,0,c0],[cx,0,c1],[ax,2.5,a1]],fill:sp.col,opacity:k===s.sel?.55:.25,stroke:sp.col})});
  let out=paintFaces(faces,P);
  const line=(x0,x1,y,doc)=>{for(let i=0;i<10;i++){const z=zL(i),w=(x1-x0-.5)*T7_LW(doc,i);out+=line3([x0+.25,y,z],[x0+.25+w,y,z],P,'#c4d3dc',3)}};
  line(-5.6,-2.6,2.5,'A');line(-1.5,1.5,0,'C');line(2.6,5.6,2.5,'B');
  [['Source A',[-4.1,2.5,4.75]],['Document C',[0,0,4.75]],['Source B',[4.1,2.5,4.75]]].forEach(([t,a])=>{const q=P(a);out+=label3(q[0],q[1],t,15,C.ink,'font-weight="650"')});
  return {svg:out,title:'Documents in space',caption:'The sources float behind the document that quotes them. Each beam is a transclusion: the same content, shown in two places, with its origin always visible.'};
 }});

// Three ways to quote: copy, live embed by location, transclusion of permanent content.
SCENE({id:'xanadu-space-quote',name:'Three ways to quote',tag:'Copy, embed or transclude',
 definition:'Copying makes a disconnected duplicate. Embedding by address shows whatever the source holds now, or nothing if it disappears. Xanadu’s transclusion shows the exact content that was quoted, keeps the connection visible, and can show that a newer version exists.',
 example:'If the source author rewrites the sentence, the copy silently stays old, the embed silently changes, and the transclusion keeps the quoted words while flagging the new version.',
 desc:'Three columns, one per quoting method, each showing the quoted sentence and what happens to it when the source is edited or goes offline.',
 research:['Nelson, T. H. (1981). Literary Machines. Mindful Press: transclusion of permanent, addressable content.','Nelson, T. H. (1999). Xanalogical structure, needed now more than ever. ACM Computing Surveys 31(4es). The “offline” behaviour of transclusion is the design goal (redundant storage); it was never deployed at web scale.'],
 dur:10,hint:'Edit the source, take its server offline, or both, and compare what each column shows.',
 init:()=>({edit:false,off:false}),
 watch(p){return {edit:p>=.33,off:p>=.66}},
 ui:[{b:'Source edits the sentence',act:'edit'},{b:'Source server goes offline',act:'off'}],
 on:{edit(s){s.edit=!s.edit;return 'keep'},off(s){s.off=!s.off;return 'keep'},reset(s){s.edit=false;s.off=false;return 'keep'}},
 draw(s){
  const v1='Links should go both ways.',v2='Links should go both ways and last.';let out=heading('The source changes. What does each quotation show?',26);
  out+=R(150,46,300,40,C.pale,'none',8)+TF(160,64,'Source now:',13,C.muted,'start')+TF(160,80,s.off?'(server offline)':(s.edit?v2:v1),13,s.off?C.coral:C.ink,'start');
  const cols=[{t:'Copy and paste',txt:v1,lines:[[s.edit?'Silently out of date':'Matches the source',s.edit?C.amber:C.green],['No link to the origin',C.coral],[s.off?'Cannot be checked':'Must be checked by hand',C.amber]]},
   {t:'Embed by address',txt:s.off?'':(s.edit?v2:v1),lines:s.off?[['Blank: could not load',C.coral],['Context lost',C.coral]]:[[s.edit?'Changed without notice':'Shows the latest text',s.edit?C.amber:C.green],['Linked by location',C.amber]]},
   {t:'Transclusion (design)',txt:v1,lines:[['Shows what was quoted',C.green],['Origin always visible',C.green],[s.edit?'Newer version flagged':'No newer version',s.edit?C.blue:C.muted],[s.off?'Served from a copy':'Served from origin',s.off?C.blue:C.muted]]}];
  cols.forEach((c,i)=>{const x=20+i*193,w=176;out+=TBF(x+w/2,112,c.t,13,C.ink)+R(x,122,w,92,'#fff',C.grid,8);
   out+=R(x+10,132,w-20,56,c.txt?C.pale:'#f3f6f8',i===2?C.blue:'none',6,i===2?'style="stroke-width:2"':'');
   out+=c.txt?T7_lines(x+18,154,T7_wrap('“'+c.txt+'”',22),13,C.ink):TF(x+w/2,164,'(nothing to show)',13,C.coral);
   if(i===2)out+=TF(x+w-14,206,'↖ beam to source',13,C.blue,'end');
   c.lines.forEach(([t,col],k)=>{out+=Ci(x+10,236+k*24,5,col)+TF(x+22,241+k*24,t,13,col===C.muted?C.muted:C.ink,'start')})});
  const msg=!s.edit&&!s.off?'Before any change, all three show the same words; only the transclusion keeps a visible path to the source.':s.edit&&!s.off?'The source was rewritten. The copy is stale without knowing it; the embed changed under the quoting author; the transclusion keeps what was quoted and says a newer version exists.':!s.edit?'The source server is offline. The embed is blank; the copy survives but cannot be checked; the design for transclusion fetches the same content from another copy.':'Both at once: only the transclusion still shows what was quoted, where it came from, and that it has since changed.';
  return {svg:out,phase:msg};
 }});

// Following a quotation back to its context: Xanadu lands on the passage; the web lands on the page top.
SCENE({id:'xanadu-space-follow',name:'Following a quotation home',tag:'Context in one step',
 definition:'Because a transclusion points at exact content, following it lands on the quoted passage inside its source, with the surrounding text in view. An ordinary web link points at a whole page, so the reader then has to find the passage.',
 example:'From a quoted sentence, Xanadu opens the source at that sentence. A web link opens the top of the page; a text-fragment link (#:~:text=) can scroll to it, if the words have not changed.',
 desc:'A quoting document on the left and its source on the right, opened at the place each kind of link lands, with the steps needed to see the quotation in context.',
 research:['Nelson, T. H. (1999). Xanalogical structure, needed now more than ever. ACM Computing Surveys 31(4es): “deep links to content”.','Text fragments (#:~:text=) were proposed in the W3C Web Incubator Community Group and shipped in Chrome in 2020; they match words, so they fail if the passage is edited.'],
 dur:10,hint:'Choose the kind of link and press the quotation to follow it.',
 init:()=>({mode:'xanadu',open:false}),
 watch(p){const k=Math.min(5,Math.floor(p*6));return {mode:['xanadu','web','fragment'][Math.floor(k/2)],open:k%2===1}},
 ui:[{choose:[['xanadu','Transclusion'],['web','Web link'],['fragment','Text-fragment link']],label:'Link',get:s=>s.mode,act:'mode'},{b:'Close the source',act:'close'}],
 on:{mode(s,v){s.mode=v;s.open=false;return 'keep'},follow(s){s.open=true;return 'keep'},close(s){s.open=false;return 'keep'}},
 draw(s,f,X){
  let out=heading('Where does following a quotation take you?',26);
  out+=TBF(140,56,'Quoting document',13,C.ink)+R(20,64,240,236,'#fff',C.grid,6);
  for(let i=0;i<9;i++)if(i!==4)out+=R(32,82+i*24,216*T7_LW('C',i),10,'#d5e0e7','none',3);
  out+=hit(X,'follow',0,'The quotation: press to follow it to its source',R(28,170,224,28,s.mode==='xanadu'?C.pale:'#fff2c9',s.mode==='xanadu'?C.blue:C.amber,6,'style="stroke-width:2"')+TF(140,189,'“…the quoted passage…” '+(s.mode==='xanadu'?'⇢':'↗'),13,C.ink));
  out+=TBF(460,56,'Source',13,C.ink)+R(340,64,240,236,'#fff',C.grid,6);
  const lines=30,top=!s.open?0:s.mode==='web'?0:14;
  for(let i=0;i<9;i++){const li=top+i,y=82+i*24,isQ=li===18;out+=R(352,y,216*T7_LW('A',li),10,isQ&&s.open&&s.mode!=='web'?tint(C.blue,.3):(isQ?'#9ab4c4':'#d5e0e7'),'none',3)}
  if(s.open&&s.mode!=='web')out+=R(346,170,228,28,'none',C.blue,6,'style="stroke-width:2.5"');
  if(s.open&&s.mode==='xanadu')out+=`<polygon points="252,170 346,170 346,198 252,198" fill="${C.blue}" fill-opacity=".25"/>`;
  out+=R(570,64,8,236,'#eef3f6','none',4)+R(570,64+top/lines*236,8,9/lines*236,C.line,'none',4);
  const steps=!s.open?'—':s.mode==='web'?'1 + scroll and search':s.mode==='fragment'?'1 (if words unchanged)':'1';
  out+=counter(340,314,'steps to context',steps,s.mode==='web'?C.coral:C.green,240);
  out+=TF(20,330,s.open?(s.mode==='web'?'Landed at the top of the page.':'Landed on the passage itself.'):'Press the quotation to follow it.',13,C.muted,'start');
  const ph=!s.open?'Press the highlighted quotation to follow it to its source.':s.mode==='xanadu'?'The transclusion opens the source at the quoted passage, joined by its beam, with the surrounding text around it.':s.mode==='web'?'The web link opens the top of the source page; the reader must scroll and search for the passage, which may have moved or changed.':'The text-fragment link scrolls to the passage by matching its words. If the author edits those words, it falls back to the top of the page.';
  return {svg:out,phase:ph};
 }});

/* =========================== open-xanadu =========================== */
// Two short source texts (written for this page). A document is an edit decision list of spans over them.
const T7_SRC={S1:'Ideas connect in many directions at once.',S2:'Every quotation keeps a path back to its source.'};
function T7_words(id){const t=T7_SRC[id],out=[];let i=0;for(const w of t.split(' ')){out.push({w,start:i,len:w.length});i+=w.length+1}return out}
// Merge consecutive picks from the same source into spans that include the joining spaces.
function T7_edl(picks){const spans=[];for(const [src,k] of picks){const w=T7_words(src)[k],last=spans[spans.length-1];
  if(last&&last.src===src&&last.lastK===k-1){last.len=w.start+w.len-last.start;last.lastK=k}else spans.push({src,start:w.start,len:w.len,lastK:k})}
 return spans}
const T7_WATCH_PICKS=[['S2',0],['S2',1],['S2',2],['S2',3],['S2',4],['S1',2],['S1',3],['S1',4]];
SCENE({id:'open-xanadu',name:'A document as a list of spans',tag:'OpenXanadu’s edit decision list',
 definition:'In OpenXanadu a document is not a file of text but an edit decision list (EDL): a list of spans, each naming a source and a stretch of its content. The reader’s software fetches the spans and shows them together, with their connections.',
 example:'The span “S2, start 0, length 29” brings in “Every quotation keeps a path”; a second span from S1 adds “in many directions”. The document is just those two lines.',
 desc:'Two source texts made of words you can press, the edit decision list your presses build, and the document assembled from it with each part coloured by its source.',
 research:['Nelson, T. H. and colleagues (2014). OpenXanadu: a working demonstration of transclusive documents built from edit decision lists over sources on the web.','Nelson, T. H. (1999). Xanalogical structure, needed now more than ever. ACM Computing Surveys 31(4es).'],
 dur:12,hint:'Press words in either source, in any order, to add them to your document. Neighbouring words from the same source merge into one span.',
 init:()=>({picks:[]}),
 watch(p){return {picks:T7_WATCH_PICKS.slice(0,Math.round(p*1.15*T7_WATCH_PICKS.length))}},
 ui:[{b:'Undo last word',act:'undo'}],
 on:{add(s,a){const [src,k]=String(a).split(':');if(T7_SRC[src]&&s.picks.length<14)s.picks.push([src,Number(k)]);return 'keep'},undo(s){s.picks.pop();return 'keep'},clear(s){s.picks=[];return 'keep'}},
 draw(s,f,X){
  const col={S1:C.blue,S2:C.green};let out=heading('Press words to build a document from spans',26);
  [['S1',56],['S2',114]].forEach(([id,y])=>{out+=TBF(20,y,id,13,col[id],'start');let x=50;
   T7_words(id).forEach((w,k)=>{const wd=w.w.length*7.4+12;out+=hit(X,'add',id+':'+k,`${id} word “${w.w}”`,R(x,y-16,wd,24,tint(col[id],.85),col[id],5)+TF(x+wd/2,y+1,w.w,13,C.ink));x+=wd+5});
   out+=TF(50,y+28,`${id} · ${T7_SRC[id].length} characters, never changed`,13,C.muted,'start')});
  const spans=T7_edl(s.picks);
  out+=TBF(20,184,'Edit decision list',13,C.ink,'start');
  spans.slice(0,7).forEach((sp,i)=>{out+=TMF(20,206+i*20,`${sp.src}  start ${pad(sp.start,2,' ')}  length ${pad(sp.len,2,' ')}`,13,col[sp.src],'start')});
  if(spans.length>7)out+=TF(20,350,`+ ${spans.length-7} more spans`,13,C.muted,'start');
  if(!spans.length)out+=TF(20,206,'(empty: press a word above)',13,C.muted,'start');
  out+=TBF(300,184,'Assembled document',13,C.ink,'start')+R(300,192,280,150,'#fff',C.grid,8);
  let x=312,y=214;for(const sp of spans){const words=T7_SRC[sp.src].slice(sp.start,sp.start+sp.len).split(' ');
   for(const w of words){const wd=w.length*7.2+6;if(x+wd>572){x=312;y+=24}if(y>330)break;out+=R(x-2,y-14,wd,20,tint(col[sp.src],.82),'none',4)+TF(x+wd/2-2,y,w,13,C.ink);x+=wd+4}}
  const n=spans.length;
  return {svg:out,phase:n?`${s.picks.length} word${s.picks.length===1?'':'s'} in ${n} span${n===1?'':'s'}. The document stores only the list on the left; every word is fetched from its source and stays connected to it.`:'The document starts empty. Each word you press becomes part of a span that points into a source.'};
 }});

// Why permanent content matters: an append-only store keeps old spans valid; editing in place breaks them.
SCENE({id:'open-xanadu-permanent',name:'Spans need content that never moves',tag:'Append-only storage',
 definition:'A span names characters by position, so it only stays correct if those characters never move. Xanadu therefore never edits content in place: new text is appended, and a new version is a new list of spans over old and new content.',
 example:'The author inserts “often ” into the source. Edited in place, an old quotation that pointed at “connect” now shows “often c”. Stored append-only, the old quotation still shows “connect”, and the new version is assembled from spans.',
 desc:'The stored characters of a source with numbered positions, the source’s current version, and a quoting document whose span either still fits or now points at the wrong letters.',
 research:['Nelson, T. H. (1981). Literary Machines. Mindful Press: content is never overwritten; versions are arrangements of permanent material.','The same idea underlies append-only logs and version-control storage, for example Git’s objects (Chacon & Straub, 2014, Pro Git).'],
 dur:10,hint:'Choose how the source is stored, then edit it. Watch what the quoting document shows.',
 init:()=>({store:'append',edited:false}),
 watch(p){return {store:p<.5?'inplace':'append',edited:(p%.5)>=.2}},
 ui:[{choose:[['append','Append-only (Xanadu)'],['inplace','Edit in place']],label:'Storage',get:s=>s.store,act:'store'},{b:'Insert “often ” before “connect”',act:'edit'},{b:'Undo the edit',act:'undo'}],
 on:{store(s,v){s.store=v;s.edited=false;return 'keep'},edit(s){s.edited=true;return 'keep'},undo(s){s.edited=false;return 'keep'}},
 draw(s){
  const base=T7_SRC.S1,ins='often ',at=base.indexOf('connect'),q={start:at,len:7};
  const stored=!s.edited?base:(s.store==='append'?base+ins:base.slice(0,at)+ins+base.slice(at));
  const current=!s.edited?base:base.slice(0,at)+ins+base.slice(at);
  const shown=stored.slice(q.start,q.start+q.len),ok=shown==='connect';
  let out=heading('A quotation points at positions in the store',26);
  out+=TBF(20,56,'Stored characters',13,C.ink,'start')+TF(160,56,s.store==='append'?'(only ever added to)':'(overwritten when edited)',13,C.muted,'start');
  const cw=11.6,perRow=48;for(let i=0;i<stored.length;i++){const r=Math.floor(i/perRow),x=22+(i%perRow)*cw,y=70+r*40,inQ=i>=q.start&&i<q.start+q.len,isNew=s.edited&&(s.store==='append'?i>=base.length:(i>=at&&i<at+ins.length));
   out+=R(x,y,cw-1,22,inQ?(ok?tint(C.green,.65):tint(C.coral,.6)):(isNew?C.amberp:'#f3f7fa'),'none',2)+TMF(x+cw/2-.5,y+16,stored[i]===' '?'·':stored[i],13,C.ink);
   if(i%10===0)out+=TF(x+1,y+36,String(i),13,C.muted,'start')}
  out+=TBF(20,176,'Current version of the source',13,C.ink,'start');
  out+=R(20,184,560,32,'#fff',C.grid,6)+TMF(30,205,current,13,C.ink,'start');
  if(s.edited&&s.store==='append')out+=TMF(30,232,`= spans 0–5 + ${base.length}–${base.length+5} + 6–${base.length-1}`,13,C.muted,'start');
  out+=TBF(20,262,'A document that quoted the source earlier',13,C.ink,'start');
  out+=R(20,270,560,46,ok?C.greenp:C.coralp,'none',8)+TMF(32,290,`span: S1, start ${q.start}, length ${q.len}`,13,C.ink,'start')+TBF(32,308,`shows “${shown}”`,14,ok?C.green:C.coral,'start')+TBF(568,300,ok?'✓ still correct':'✗ now wrong',14,ok?C.green:C.coral,'end');
  const msg=!s.edited?'The quotation’s span covers positions 6–12: “connect”.':ok?'The new words were appended at the end, so positions 6–12 still hold “connect”. The new version is just a different list of spans.':'The edit shifted every later character, so the old span now covers “often c”. Every quotation of this source is silently wrong.';
  return {svg:out,phase:msg};
 }});

// Links kept apart from documents, attached to content, and publishable by anyone.
const T7_LINKS=[{id:0,name:'comment',from:[2,'A'],to:[1,'B'],col:C.blue,who:'the author'},{id:1,name:'correction',from:[5,'A'],to:[4,'B'],col:C.coral,who:'the author'},{id:2,name:'reader’s note',from:[7,'A'],to:[6,'B'],col:C.purple,who:'another reader'}];
SCENE({id:'open-xanadu-links',name:'Links that live outside documents',tag:'Xanadu links (xanalinks)',
 definition:'In Xanadu’s design a link is a separate object that points at spans of content in two or more documents. It is not written inside either document, so anyone can publish links between documents they do not own, and links stay attached when text around them changes.',
 example:'A reader publishes a note linking a sentence in Document A to a passage in Document B. Insert a new first line in A and the link still points at the same sentence, because it points at content, not at line numbers.',
 desc:'Two documents with link lines drawn between passages, and a list of the link objects, which you can switch on and off, including one published by another reader.',
 research:['Nelson, T. H. (1981). Literary Machines. Mindful Press: links as first-class objects attached to content, “unbreakable” and visible from both ends.','Annotation layers on the web, such as the W3C Web Annotation Data Model (2017), keep links outside the annotated page in a similar way.'],
 dur:10,hint:'Press a link in the list to show or hide it. Insert a line at the top of Document A and see the links stay on their passages.',
 init:()=>({on:[true,true,false],ins:false}),
 watch(p){return {on:[p>=.1,p>=.3,p>=.5],ins:p>=.75}},
 ui:[{b:'Insert a new first line in A',act:'ins'},{b:'Show all links',act:'all'}],
 on:{tog(s,i){i=Number(i);s.on[i]=!s.on[i];return 'keep'},ins(s){s.ins=!s.ins;return 'keep'},all(s){s.on=[true,true,true];return 'keep'},reset(s){s.on=[true,true,false];s.ins=false;return 'keep'}},
 draw(s,f,X){
  let out=heading('Links are objects of their own, attached to content',26);const shift=s.ins?1:0,yA=i=>78+(i+shift)*22,yB=i=>78+i*22;
  out+=TBF(95,56,'Document A',13,C.ink)+R(20,64,150,214,'#fff',C.grid,6)+TBF(505,56,'Document B',13,C.ink)+R(430,64,150,214,'#fff',C.grid,6);
  for(let i=0;i<9-shift;i++){const lk=T7_LINKS.find(l=>l.from[0]===i&&s.on[l.id]);out+=R(32,yA(i)-5,126*T7_LW('A',i),10,lk?tint(lk.col,.4):'#d5e0e7','none',3)}
  if(s.ins)out+=R(32,yA(-1)-5,110,10,C.amberp,C.amber,3);
  for(let i=0;i<9;i++){const lk=T7_LINKS.find(l=>l.to[0]===i&&s.on[l.id]);out+=R(442,yB(i)-5,126*T7_LW('B',i),10,lk?tint(lk.col,.4):'#d5e0e7','none',3)}
  T7_LINKS.forEach(l=>{if(!s.on[l.id])return;const y1=yA(l.from[0]),y2=yB(l.to[0]);out+=P(`M 170 ${y1} C 260 ${y1}, 340 ${y2}, 430 ${y2}`,l.col,2.6)+Ci(170,y1,4,l.col)+Ci(430,y2,4,l.col)});
  out+=TBF(300,300,'Link objects (stored apart from both documents)',13,C.ink);
  T7_LINKS.forEach((l,i)=>{const x=24+i*188;out+=hit(X,'tog',l.id,`Link: ${l.name}, ${s.on[l.id]?'shown':'hidden'}`,R(x,310,176,52,s.on[l.id]?tint(l.col,.85):'#f3f6f8',s.on[l.id]?l.col:C.line,8,'style="stroke-width:1.6"')+TBF(x+88,330,l.name,13,C.ink)+TF(x+88,350,'by '+l.who,13,C.muted))});
  const shown=s.on.filter(Boolean).length;
  return {svg:out,phase:s.ins?`A new first line pushed Document A down, and the ${shown} link${shown===1?'':'s'} shown moved with their passages: links point at content, not at positions on the page.`:`${shown} of 3 links shown. The reader’s note was published by someone who owns neither document; in Xanadu’s design both authors can see it.`};
 }});

/* =========================== parallel-documents =========================== */
const T7_PAIRS={
 translation:{l:['The reader follows a link.','The source stays visible.','Each quotation keeps its origin.','Versions sit side by side.'],r:['Le lecteur suit un lien.','La source reste visible.','Chaque citation garde son origine.','Les versions sont côte à côte.'],map:[0,1,2,3],lt:'English',rt:'French'},
 versions:{l:['The reader follows a link.','The source stays visible.','Each quotation keeps its origin.','Versions sit side by side.'],r:['A reader follows a link.','Its source stays in view.','Old and new sit side by side.','Each quotation keeps its origin.'],map:[0,1,3,2],lt:'Version 1',rt:'Version 2'},
 commentary:{l:['The reader follows a link.','The source stays visible.','Each quotation keeps its origin.','Versions sit side by side.'],r:['Note: like Bush’s trails.','Note: no hidden jumps.','Note: this is transclusion.','Note: Nelson’s parallel view.'],map:[0,1,2,3],lt:'Text',rt:'Commentary'}};
const T7_BAND=[C.blue,C.green,C.purple,C.amber];
SCENE({id:'parallel-documents',name:'Parallel documents',tag:'Visible connections side by side',
 definition:'Nelson’s parallel documents put related texts side by side, such as an original and its translation, two versions, or a text and its commentary, and draw the connections between corresponding parts so the reader never has to search for them.',
 example:'Beside a sentence in Version 1, a coloured band runs to the same sentence in Version 2, even where the author has moved it further down.',
 desc:'Two columns of four sentences each, with coloured bands joining each sentence to its counterpart; bands cross where the order has changed.',
 research:['Nelson, T. H. (1999). Xanalogical structure, needed now more than ever: parallel documents, deep links to content, deep versioning, and deep re-use. ACM Computing Surveys 31(4es).','Nelson, T. H. (1974). Computer Lib/Dream Machines, on side-by-side comparison of texts.'],
 dur:10,hint:'Choose a pair of documents. Press any sentence to pick out its band and its counterpart.',
 init:()=>({pair:'versions',sel:-1}),
 watch(p){const k=Math.min(5,Math.floor(p*6));return {pair:['translation','versions','commentary'][Math.floor(k/2)],sel:k%2?2:-1}},
 ui:[{choose:[['translation','Translation'],['versions','Two versions'],['commentary','Commentary']],label:'Pair',get:s=>s.pair,act:'pair'},{b:'Clear selection',act:'clear'}],
 on:{pair(s,v){s.pair=v;s.sel=-1;return 'keep'},pick(s,i){s.sel=Number(i);return 'keep'},clear(s){s.sel=-1;return 'keep'}},
 draw(s,f,X){
  const d=T7_PAIRS[s.pair],y=i=>72+i*66,H=46;let out=heading('Corresponding parts, joined by visible bands',26);
  out+=TBF(150,56,d.lt,13,C.muted)+TBF(450,56,d.rt,13,C.muted);
  d.map.forEach((j,i)=>{const dim=s.sel>=0&&s.sel!==i;out+=`<polygon points="280,${y(i)+4} 320,${y(j)+4} 320,${y(j)+H-4} 280,${y(i)+H-4}" fill="${T7_BAND[i]}" fill-opacity="${dim?.08:.35}"/>`});
  d.l.forEach((t,i)=>{const dim=s.sel>=0&&s.sel!==i;out+=hit(X,'pick',i,`${d.lt}: ${t}`,R(20,y(i),260,H,dim?'#f6f8fa':tint(T7_BAND[i],.88),dim?C.grid:T7_BAND[i],8,'style="stroke-width:1.6"')+TF(32,y(i)+28,t,13,dim?C.muted:C.ink,'start'))});
  d.r.forEach((t,j)=>{const i=d.map.indexOf(j),dim=s.sel>=0&&s.sel!==i;out+=hit(X,'pick',i,`${d.rt}: ${t}`,R(320,y(j),260,H,dim?'#f6f8fa':tint(T7_BAND[i],.88),dim?C.grid:T7_BAND[i],8,'style="stroke-width:1.6"')+TF(332,y(j)+28,t,13,dim?C.muted:C.ink,'start'))});
  const crossed=d.map.some((j,i)=>j!==i);
  return {svg:out,phase:s.sel>=0?`“${d.l[s.sel].replace(/\.$/,'')}” corresponds to “${d.r[d.map[s.sel]].replace(/\.$/,'')}”. The band makes the correspondence visible without searching.`:`${d.lt} and ${d.rt} side by side.${crossed?' Two bands cross: the author swapped the last two sentences, and the connection survives the move.':' Each band joins a part to its counterpart.'}`};
 }});

// Versions compared: a longest-common-subsequence match of sentences between adjacent versions.
const T7_VERS=[['Links join ideas.','Readers choose a path.','Quotes are copied.','Copies lose their source.'],
 ['Links join ideas.','Readers choose a path.','Quotes are transcluded.','Copies lose their source.'],
 ['Links join ideas.','Links go both ways.','Readers choose a path.','Quotes are transcluded.'],
 ['Links go both ways.','Readers choose a path.','Quotes are transcluded.','Every version is kept.']];
function T7_lcs(a,b){const n=a.length,m=b.length,t=Array.from({length:n+1},()=>Array(m+1).fill(0));
 for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)t[i][j]=a[i]===b[j]?t[i+1][j+1]+1:Math.max(t[i+1][j],t[i][j+1]);
 const pairs=[];let i=0,j=0;while(i<n&&j<m){if(a[i]===b[j]){pairs.push([i,j]);i++;j++}else if(t[i+1][j]>=t[i][j+1])i++;else j++}return pairs}
SCENE({id:'parallel-documents-versions',name:'Versions side by side',tag:'Deep versioning',
 definition:'Nelson asked that every version of a document be kept and that any two versions can be shown side by side, with unchanged parts joined and changes visible. Comparing versions this way is the job that “diff” tools later did for programmers.',
 example:'Between versions 2 and 3, “Links go both ways.” is new, “Copies lose their source.” is gone, and three sentences carry over, joined by bands.',
 desc:'Two adjacent versions of a four-sentence paragraph, with bands joining unchanged sentences, new sentences in green and removed ones in coral, and a count of each.',
 research:['Nelson, T. H. (1965). Complex information processing: a file structure for the complex, the changing and the indeterminate. ACM National Conference: keeping versions and alternatives.','Hunt, J. W. & McIlroy, M. D. (1976). An algorithm for differential file comparison. Bell Labs CSTR 41: the Unix diff, based on longest common subsequences.'],
 dur:10,hint:'Move the slider to compare each version with the next.',
 init:()=>({k:2}),
 watch(p){return {k:1+Math.min(2,Math.floor(p*3))}},
 ui:[{range:'k',label:'Compare version',min:1,max:3,step:1,get:s=>s.k,act:'k',show:v=>`${v} with ${Number(v)+1}`}],
 on:{k(s,v){s.k=clamp(Math.round(Number(v)),1,3);return 'keep'}},
 draw(s){
  const a=T7_VERS[s.k-1],b=T7_VERS[s.k],pairs=T7_lcs(a,b),y=i=>74+i*62,H=44;let out=heading(`Version ${s.k} beside version ${s.k+1}`,26);
  out+=TBF(150,56,`Version ${s.k}`,13,C.muted)+TBF(450,56,`Version ${s.k+1}`,13,C.muted);
  pairs.forEach(([i,j])=>{out+=`<polygon points="280,${y(i)+4} 320,${y(j)+4} 320,${y(j)+H-4} 280,${y(i)+H-4}" fill="${C.blue}" fill-opacity=".28"/>`});
  const keptA=new Set(pairs.map(p=>p[0])),keptB=new Set(pairs.map(p=>p[1]));
  a.forEach((t,i)=>{const k=keptA.has(i);out+=R(20,y(i),260,H,k?tint(C.blue,.88):C.coralp,k?C.blue:C.coral,8)+TF(32,y(i)+27,t,13,C.ink,'start')+(k?'':TBF(270,y(i)+27,'removed',13,C.coral,'end'))});
  b.forEach((t,j)=>{const k=keptB.has(j);out+=R(320,y(j),260,H,k?tint(C.blue,.88):C.greenp,k?C.blue:C.green,8)+TF(332,y(j)+27,t,13,C.ink,'start')+(k?'':TBF(570,y(j)+27,'new',13,C.green,'end'))});
  const kept=pairs.length,del=a.length-kept,add=b.length-kept;
  out+=counter(90,322,'kept',String(kept),C.blue)+counter(240,322,'removed',String(del),C.coral)+counter(390,322,'new',String(add),C.green);
  return {svg:out,phase:`${kept} sentences carry over unchanged, ${del} ${del===1?'was':'were'} removed and ${add} ${add===1?'is':'are'} new. Nothing is lost: version ${s.k} is still there to compare with.`};
 }});

// A small timed demonstration: find the matching sentence with and without a visible connection.
const T7_FIND=[['The memex stored trails.','Trails were kept in the memex.'],['Hypertext branches.','Text that branches is hypertext.'],['Links can go both ways.','A link may run both ways.'],['Quotes keep their source.','A quote stays tied to its origin.'],
 ['Versions sit side by side.','Old and new appear together.'],['Readers choose the path.','The path is up to the reader.'],['Content is never overwritten.','Nothing stored is written over.'],['Many dimensions at once.','Several dimensions work together.']];
const T7_SIM=[{c:'lines',ms:1150,ok:1},{c:'plain',ms:2850,ok:1},{c:'lines',ms:980,ok:1},{c:'plain',ms:3420,ok:1},{c:'plain',ms:2610,ok:0},{c:'lines',ms:1240,ok:1},{c:'plain',ms:3070,ok:1},{c:'lines',ms:1060,ok:1}];
const T7_mean=a=>a.length?sum(a)/a.length:0;
SCENE({id:'parallel-documents-search',name:'Try it: find the matching sentence',tag:'A small demonstration on you',
 definition:'When related parts of two documents are joined by a visible connection, the reader follows it instead of searching. Without one, the reader must hold the sentence in mind and scan for its partner.',
 example:'With a connecting line, most people find the partner in about a second; without it, finding a reworded partner among eight takes two or three times as long.',
 desc:'Eight sentences on the left and their reworded partners shuffled on the right. In half the trials a line joins the highlighted sentence to its partner. Afterwards, bars compare your average times.',
 research:['Chandler, P. & Sweller, J. (1991). Cognitive load theory and the format of instruction. Cognition and Instruction 8(4), 293–332: the split-attention effect, the cost of searching between related sources.','Nelson, T. H. (1999). Xanalogical structure, needed now more than ever. ACM Computing Surveys 31(4es): visible connections between parallel documents. This page is a demonstration, not a controlled study.'],
 dur:10,hint:'Press Start, then press the sentence on the right that means the same as the highlighted one. Your times stay in this page.',
 init:()=>({phase:'idle',trials:[],t:0}),
 watch(p){return p<.45?{phase:'run',demo:true,t:0,order:[3,0,1,2,4,5,6,7],conds:['lines'],right:[5,3,0,7,2,6,1,4],trials:[]}:{phase:'done',sim:true,trials:T7_SIM}},
 ui:[{b:'Start (8 trials)',act:'start'}],
 on:{start(s){s.order=shuffled(range(8),nextSeed());s.conds=shuffled(['lines','lines','lines','lines','plain','plain','plain','plain'],nextSeed());s.right=shuffled(range(8),nextSeed());s.trials=[];s.t=0;s.phase='run';s.sim=false;s.t0=performance.now();return 'keep'},
  pick(s,j){if(s.phase!=='run')return 'keep';j=Number(j);const target=s.order[s.t],ms=Math.round(performance.now()-(s.t0||performance.now()));
   s.trials.push({c:s.conds[s.t],ms,ok:j===target?1:0});s.t++;if(s.t>=8){s.phase='done';return 'keep'}
   s.right=shuffled(range(8),nextSeed());s.t0=performance.now();return 'keep'},
  clear(s){s.phase='idle';s.trials=[];s.t=0;return 'keep'}},
 draw(s,f,X){
  let out='';
  if(s.phase==='run'){const target=s.order[s.t],cond=s.conds[s.t],y=i=>58+i*38;
   out+=heading(`Trial ${s.t+1} of 8 · ${cond==='lines'?'with a connecting line':'no line'}`,26);
   T7_FIND.forEach((p,i)=>{out+=R(20,y(i),260,30,i===target?C.coralp:'#fff',i===target?C.coral:C.grid,6,i===target?'style="stroke-width:2.4"':'')+TF(30,y(i)+20,p[0],13,i===target?C.ink:C.muted,'start')});
   s.right.forEach((k,j)=>{out+=hit(X,'pick',k,`Partner sentence: ${T7_FIND[k][1]}`,R(320,y(j),260,30,'#fff',C.blue,6)+TF(330,y(j)+20,T7_FIND[k][1],13,C.ink,'start'))});
   if(cond==='lines'){const j=s.right.indexOf(target);out+=P(`M 280 ${y(target)+15} C 300 ${y(target)+15}, 300 ${y(j)+15}, 320 ${y(j)+15}`,C.coral,3)}
   if(s.demo)out+=TF(300,372,'Watch shows one trial; press Try it to take part',13,C.muted);
   return {svg:out,phase:s.demo?'In each trial one sentence is highlighted on the left; its reworded partner is somewhere on the right. Half the trials draw a line to it.':`Find the partner of “${T7_FIND[target][0].replace(/\.$/,'')}”.`}}
  if(s.phase==='idle'){out+=heading('Find the matching sentence, with and without a line',26);
   out+=R(60,80,480,150,C.pale,'none',12)+T7_lines(80,112,['Press Start. Each trial highlights one sentence on the left.','Press its reworded partner on the right, as fast as you can.','In half the trials a line shows you where it is.','Eight trials take about half a minute.','Nothing you do leaves this page.'],14,C.ink,'start',24);
   return {svg:out,phase:'Press Start to take part. Your times are measured in this page only.'}}
  const tr=s.trials,ml=T7_mean(tr.filter(t=>t.c==='lines'&&t.ok).map(t=>t.ms)),mp=T7_mean(tr.filter(t=>t.c==='plain'&&t.ok).map(t=>t.ms)),errs=tr.filter(t=>!t.ok).length;
  out+=heading(s.sim?'Results of a simulated participant':'Your results',26);
  const top=Math.max(4000,ml,mp)*1.1,bh=v=>v/top*220,base=300;
  out+=L(70,base,530,base,C.line,1.5);[0,1000,2000,3000,4000].forEach(v=>{if(v<=top){out+=L(66,base-bh(v),70,base-bh(v),C.line,1)+TF(62,base-bh(v)+4,(v/1000)+' s',13,C.muted,'end')}});
  [['With a line',ml,C.green,170],['No line',mp,C.coral,370]].forEach(([n,v,c,x])=>{out+=R(x-50,base-bh(v),100,bh(v),c,'none',6)+TBF(x,base-bh(v)-8,v?(v/1000).toFixed(2)+' s':'—',14,c)+TF(x,base+20,n,13,C.ink)});
  tr.forEach((t,i)=>{const x=t.c==='lines'?170:370,j=tr.filter((u,k)=>k<i&&u.c===t.c).length;out+=Ci(x+64+(j%2)*10,base-bh(Math.min(t.ms,top)),4,t.ok?C.ink:C.coral)});
  out+=TF(560,70,'dots: single trials',13,C.muted,'end');
  out+=TF(300,350,`${errs} wrong pick${errs===1?'':'s'} (left out of the averages)${s.sim?' · simulated data':''}`,13,C.muted);
  const ratio=ml&&mp?mp/ml:0;
  return {svg:out,phase:ratio?`Without a line you took ${ratio.toFixed(1)} times as long on average. Searching between related parts costs time and attention; a visible connection removes the search.`:'Complete trials in both conditions to compare them.'};
 }});
