/* ===================== Era 3 · The desktop (1970s–1980s) ===================== */
// Shared period helpers: a generic early-desktop window, icons and a pointer (no logos, no product look).
function H3_pointer(x,y,col=C.ink){return `<polygon points="${fmt(x)},${fmt(y)} ${fmt(x)},${fmt(y+19)} ${fmt(x+5)},${fmt(y+14)} ${fmt(x+9)},${fmt(y+22)} ${fmt(x+12)},${fmt(y+20)} ${fmt(x+8)},${fmt(y+13)} ${fmt(x+14)},${fmt(y+13)}" fill="#fff" stroke="${col}" stroke-width="1.6" stroke-linejoin="round"/>`}
function H3_winFrame(x,y,w,h,title,front){
 let o=R(x,y,w,h,'#fff',C.dark,3)+R(x,y,w,22,front?'#eef2f4':'#fff',C.dark,3);
 if(front)for(let i=0;i<3;i++)o+=L(x+24,y+6+i*5,x+w-6,y+6+i*5,'#7b8c96',1.2);
 const tw=Math.min(w-40,title.length*8+16);o+=R(x+w/2-tw/2,y+3,tw,16,front?'#eef2f4':'#fff','none',2)+TBF(x+w/2,y+15,title,13,C.ink);
 return o;
}
function H3_closeBox(x,y){return R(x+6,y+5,12,12,'#fff',C.dark,1)}
function H3_winBody(kind,x,y,w,h){
 let o='';
 if(kind==='doc')for(let i=0;i<6&&36+i*16<h-8;i++)o+=R(x+14,y+34+i*16,w-28-(i%3)*34,6,'#c3d1da','none',3);
 else if(kind==='draw')o+=Ci(x+w*.32,y+h*.55,Math.min(34,h*.22),C.pale,C.blue)+R(x+w*.55,y+h*.3,w*.3,h*.42,C.coralp,C.coral,2);
 else for(let i=0;i<5&&34+i*20<h-10;i++)o+=Ci(x+20,y+40+i*20,5,i===0?C.blue:'#c3d1da')+R(x+32,y+37+i*20,w-50-(i%2)*30,6,'#c3d1da','none',3);
 return o;
}
// Icons centred on (x,y): document, folder, wastebasket, disk.
function H3_icon(kind,x,y,label,sel,extra=''){
 let o='';
 if(sel)o+=R(x-34,y-34,68,82,C.amberp,C.amber,8);
 if(kind==='doc')o+=P(`M${x-15} ${y-22}H${x+7}L${x+15} ${y-14}V${y+22}H${x-15}Z`,C.dark,1.8,'#fff')+P(`M${x+7} ${y-22}V${y-14}H${x+15}`,C.dark,1.4)+[0,1,2,3].map(i=>L(x-9,y-8+i*7,x+9,y-8+i*7,'#9fb3bf',1.4)).join('');
 else if(kind==='folder')o+=P(`M${x-24} ${y-14}H${x-8}L${x-3} ${y-20}H${x+10}L${x+14} ${y-14}H${x+24}V${y+20}H${x-24}Z`,C.dark,1.8,extra==='full'?C.amberp:'#fff')+L(x-24,y-8,x+24,y-8,C.dark,1.4);
 else if(kind==='trash')o+=P(`M${x-16} ${y-14}L${x-12} ${y+22}H${x+12}L${x+16} ${y-14}Z`,C.dark,1.8,extra==='full'?C.amberp:'#fff')+L(x-20,y-18,x+20,y-18,C.dark,2.2)+L(x-5,y-23,x+5,y-23,C.dark,2.2)+[-6,0,6].map(d=>L(x+d,y-8,x+d*.8,y+16,'#9fb3bf',1.4)).join('');
 else if(kind==='disk')o+=R(x-20,y-20,40,40,'#fff',C.dark,3)+R(x-10,y-20,20,13,'#c3d1da',C.dark,1)+R(x-13,y+3,26,16,'#f6f8f9',C.dark,1);
 return o+T(x,y+42,label,13,C.ink);
}

/* ---------------- wimp ---------------- */
const H3_WIN0=[{id:'a',t:'Memo',x:30,y:62,w:210,h:150,c:'doc'},{id:'b',t:'Drawing',x:118,y:126,w:220,h:160,c:'draw'},{id:'c',t:'Mail',x:196,y:74,w:190,h:140,c:'list'}];
function H3_winInit(){return {wins:H3_WIN0.map(w=>({...w})),order:['a','b','c'],closed:[]}}
function H3_raise(s,id){if(!s.order.includes(id))return;s.order=s.order.filter(i=>i!==id).concat(id)}
function H3_hidden(s,id){
 const w=s.wins.find(v=>v.id===id),above=s.order.slice(s.order.indexOf(id)+1).map(i=>s.wins.find(v=>v.id===i));let n=0,c=0;
 for(let x=w.x+5;x<w.x+w.w;x+=10)for(let y=w.y+5;y<w.y+w.h;y+=10){n++;if(above.some(a=>x>=a.x&&x<=a.x+a.w&&y>=a.y&&y<=a.y+a.h))c++}
 return n?Math.round(100*c/n):0;
}
SCENE({id:'wimp',name:'Windows, icons, menus, pointer',tag:'Overlapping windows',
 definition:'The WIMP interface shows each task in its own window. Windows overlap like papers on a desk, and the pointer brings any one to the front.',
 example:'The Xerox Alto (1973) and Star (1981) introduced overlapping windows, icons and menus driven by a mouse. Almost every desktop since has kept the same four ideas.',
 desc:'Three overlapping windows on a grey desktop, with a front-to-back list showing how much of each window is hidden.',
 research:'Thacker, McCreight, Lampson, Sproull & Boggs (1973/1979). Alto: a personal computer, Xerox PARC · Smith, Irby, Kimball & Verplank (1982). Designing the Star user interface. Byte 7(4).',
 dur:10,hint:'Press a window to bring it to the front, press its close box to close it, and nudge the front window with the buttons.',
 init:H3_winInit,
 watch(p){const s=H3_winInit(),seq=['a','b','a','c'],k=Math.min(4,Math.floor(p*5));for(let j=0;j<k;j++)H3_raise(s,seq[j]);s.cursor=k?seq[k-1]:null;return s},
 ui:[{b:'←',act:'nudge',arg:'l',aria:'Move the front window left'},{b:'→',act:'nudge',arg:'r',aria:'Move the front window right'},{b:'↑',act:'nudge',arg:'u',aria:'Move the front window up'},{b:'↓',act:'nudge',arg:'d',aria:'Move the front window down'},{b:'Reopen all',act:'reopen'}],
 on:{raise(s,id){H3_raise(s,id)},close(s,id){s.order=s.order.filter(i=>i!==id);if(!s.closed.includes(id))s.closed.push(id)},
  nudge(s,d){const id=s.order[s.order.length-1];if(!id)return;const w=s.wins.find(v=>v.id===id),dx={l:-20,r:20}[d]||0,dy={u:-20,d:20}[d]||0;w.x=clamp(w.x+dx,20,405-w.w);w.y=clamp(w.y+dy,46,348-w.h)},
  reopen(s){for(const id of s.closed)if(!s.order.includes(id))s.order.push(id);s.closed=[]}},
 draw(s,f,X){
  let out=heading('Overlapping windows, like papers on a desk')+R(20,46,385,304,'#e3e8eb','none',6);
  for(let i=0;i<4;i++)for(let j=0;j<3;j++)out+=Ci(40+i*110,70+j*110,1.5,'#c9d2d8');
  s.order.forEach((id,i)=>{const w=s.wins.find(v=>v.id===id),front=i===s.order.length-1;
   out+=hit(X,'raise',id,`${w.t} window${front?', in front':''}. Press to bring to the front.`,H3_winFrame(w.x,w.y,w.w,w.h,w.t,front)+H3_winBody(w.c,w.x,w.y,w.w,w.h));
   out+=hit(X,'close',id,`Close ${w.t}`,H3_closeBox(w.x,w.y))});
  if(s.cursor){const w=s.wins.find(v=>v.id===s.cursor);out+=H3_pointer(w.x+w.w*.6,w.y+8)}
  out+=TB(500,66,'Front to back',14,C.ink);
  [...s.order].reverse().forEach((id,i)=>{const w=s.wins.find(v=>v.id===id),hid=H3_hidden(s,id),y=78+i*48;
   out+=R(420,y,165,40,i===0?C.pale:'#fff',i===0?C.blue:C.grid,7)+TB(432,y+17,w.t,14,C.ink,'start')+TF(432,y+33,i===0?'in front, fully visible':hid+'% hidden',13,hid>40?C.coral:C.muted,'start')+R(540,y+14,36,8,'#e8eef2','none',4)+R(540,y+14,36*hid/100,8,C.coral,'none',4)});
  if(s.closed.length)out+=TF(502,240,'Closed: '+s.closed.map(id=>s.wins.find(v=>v.id===id).t).join(', '),13,C.muted);
  const front=s.order.length?s.wins.find(v=>v.id===s.order[s.order.length-1]).t:null;
  return {svg:out,phase:front?`${front} is in front. Windows behind it are partly hidden, so the screen can hold more work than fits at once: the desk metaphor trades space for overlap, and the pointer brings any window back.`:'Every window is closed. Reopen them to bring the work back.'};
 }});

const H3_DM_POS={report:[90,104],projects:[90,248],disk:[300,104],trash:[300,248]};
const H3_DM_RULES={'report>projects':['Report moved into Projects. Paper goes in folders: the metaphor holds.',true],'report>trash':['Report is in the wastebasket. Like a real bin, you can take it back out until it is emptied.',true],'projects>trash':['The whole Projects folder goes in the bin. Still a sensible desk.',true],'report>disk':['Report was copied to Floppy, not moved: the original stays put. Real paper cannot be in two places at once.',false],'projects>disk':['Projects was copied to Floppy. Dragging to another disk copies; dragging within a disk moves.',false],'disk>trash':['Floppy is ejected. Dropping a disk in the bin removes it safely, yet many people feared it would be erased.',false]};
function H3_dmInit(){return {report:'desktop',projects:'desktop',disk:'mounted',copies:0,sel:null,msg:null,ok:null,holds:0,breaks:0}}
function H3_dmDrop(s,a,b){
 const r=H3_DM_RULES[a+'>'+b];s.sel=null;
 if(!r){s.msg=b==='trash'||a==='trash'?'The wastebasket stays where it is.':'Nothing sensible happens: that is not something a desk would do either.';s.ok=null;return}
 [s.msg,s.ok]=r;if(r[1])s.holds++;else s.breaks++;
 if(a==='report'&&b==='projects')s.report='projects';if(a==='report'&&b==='trash')s.report='trash';if(a==='projects'&&b==='trash')s.projects='trash';if(b==='disk')s.copies++;if(a==='disk')s.disk='ejected';
}
function H3_dmVisible(s,n){return n==='report'?s.report==='desktop':n==='projects'?s.projects==='desktop':n==='disk'?s.disk==='mounted':true}
SCENE({id:'wimp-desktop-metaphor',name:'The desktop metaphor',tag:'Icons as office objects',
 definition:'Icons borrow the look and behaviour of office objects (documents, folders, a wastebasket) so people can guess what an action will do from what they already know.',
 example:'Dragging a document onto a folder files it, just as on a real desk. But dragging a disk onto the wastebasket ejected it, which no real bin does: metaphors help until they break.',
 desc:'A desktop with a document, a folder, a disk and a wastebasket; a panel reports whether each drag behaves like the real object it imitates.',
 research:'Smith, Irby, Kimball & Verplank (1982). Designing the Star user interface · Neale & Carroll (1997). The role of metaphors in user interface design. Handbook of Human–Computer Interaction.',
 dur:11,hint:'Press one icon to pick it up, then press another to drop it there. Which drags behave like the real objects?',
 init:H3_dmInit,
 watch(p){const s=H3_dmInit(),acts=[['report','disk'],['report','projects'],['disk','trash']],seg=p*3,k=Math.min(3,Math.floor(seg)),u=seg-k;const done=k+(k<3&&u>.8?1:0);
  for(let j=0;j<done;j++)H3_dmDrop(s,...acts[j]);if(k<3&&u<=.8){s.ghost={from:acts[k][0],to:acts[k][1],u:smooth(u/.8)}}return s},
 on:{pick(s,n){if(!s.sel){s.sel=n;s.msg=null;return}if(s.sel===n){s.sel=null;return}H3_dmDrop(s,s.sel,n)}},
 draw(s,f,X){
  let out=heading('Office objects on the screen')+R(20,46,375,304,'#e3e8eb','none',6);
  for(const n of ['report','projects','disk','trash']){if(!H3_dmVisible(s,n))continue;const [x,y]=H3_DM_POS[n];
   const kind=n==='report'?'doc':n==='projects'?'folder':n,label=n==='report'?'Report':n==='projects'?(s.report==='projects'?'Projects (1 item)':'Projects'):n==='disk'?(s.copies?`Floppy (${s.copies} copied)`:'Floppy'):(s.report==='trash'||s.projects==='trash'?'Wastebasket (full)':'Wastebasket');
   const full=(n==='projects'&&s.report==='projects')||(n==='trash'&&(s.report==='trash'||s.projects==='trash'))?'full':'';
   out+=hit(X,'pick',n,`${label}${s.sel===n?', picked up':''}. Press to ${s.sel&&s.sel!==n?'drop here':'pick up'}.`,R(x-36,y-36,72,92,'transparent','none',8)+H3_icon(kind,x,y,label,s.sel===n,full))}
  if(s.disk==='ejected')out+=TF(300,150,'(disk ejected)',13,C.muted);
  if(s.ghost){const a=H3_DM_POS[s.ghost.from],b=H3_DM_POS[s.ghost.to],x=lerp(a[0],b[0],s.ghost.u),y=lerp(a[1],b[1],s.ghost.u);out+=L(a[0],a[1],b[0],b[1],C.line,1.5,'stroke-dasharray="5 4"')+G(H3_icon(s.ghost.from==='report'?'doc':s.ghost.from==='projects'?'folder':'disk',x,y,'',false),'opacity=".55"')+H3_pointer(x+6,y+4)}
  out+=TBF(495,66,'Does the metaphor hold?',14,C.ink);
  if(s.msg){const col=s.ok===true?C.green:s.ok===false?C.coral:C.muted,fill=s.ok===true?C.greenp:s.ok===false?C.coralp:'#fff';
   out+=R(405,80,182,150,fill,col,9)+TBF(496,102,s.ok===true?'Holds ✓':s.ok===false?'Breaks ✗':'—',15,col);
   const words=s.msg.split(' ');let line='',y=124,lines=[];for(const w of words){if((line+' '+w).length>25){lines.push(line);line=w}else line=line?line+' '+w:w}lines.push(line);
   lines.slice(0,7).forEach((t,i)=>out+=TF(414,y+i*16,t,13,C.ink,'start'))}
  else out+=R(405,80,182,150,'#fff',C.grid,9)+TF(496,150,s.sel?'Now press where to drop it':'Pick up an icon',13,C.muted);
  out+=counter(405,246,'holds',s.holds,C.green,88)+counter(499,246,'breaks',s.breaks,C.coral,88);
  out+=TF(496,320,'A metaphor is a promise',13,C.muted)+TF(496,336,'about behaviour, not looks.',13,C.muted);
  return {svg:out,phase:s.msg||'Each icon promises to act like its paper-office twin. Users rely on that promise; the surprises come where the computer can do something a desk cannot.'};
 }});

const H3_MENU=['Cut','Copy','Paste','Undo','Find','Save','Print','Close'];
let H3_menuRand=rng(31);
function H3_pieSlice(cx,cy,r0,r1,a0,a1){const p=(r,a)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];const [x0,y0]=p(r1,a0),[x1,y1]=p(r1,a1),[x2,y2]=p(r0,a1),[x3,y3]=p(r0,a0);return `M${fmt(x0)} ${fmt(y0)}A${r1} ${r1} 0 0 1 ${fmt(x1)} ${fmt(y1)}L${fmt(x2)} ${fmt(y2)}A${r0} ${r0} 0 0 0 ${fmt(x3)} ${fmt(y3)}Z`}
const H3_LIN={ox:120,oy:60,x:44,y:72,w:150,h:30},H3_PIE={cx:440,cy:194,r0:24,r1:116};
function H3_itemCentre(type,i){if(type==='linear')return [H3_LIN.x+H3_LIN.w/2,H3_LIN.y+i*H3_LIN.h+H3_LIN.h/2];const a=-Math.PI/2+i*Math.PI/4;return [H3_PIE.cx+72*Math.cos(a),H3_PIE.cy+72*Math.sin(a)]}
SCENE({id:'wimp-menus',name:'Pull-down and pie menus',tag:'Menus: distance matters',
 definition:'A menu lists commands so you can recognise them instead of remembering them. How the items are laid out changes how far the pointer must travel to each one.',
 example:'In a pull-down list the eighth item is eight rows away; in a pie menu every item is the same short distance from where you clicked. Callahan, Hopkins, Weiser and Shneiderman (1988) measured pie menus as faster, with fewer errors.',
 desc:'A linear pull-down menu beside a circular pie menu, with the distance from the starting point to each item; in Try it you time your own picks.',
 research:'Callahan, Hopkins, Weiser & Shneiderman (1988). An empirical comparison of pie vs. linear menus. Proc. CHI ’88: pie menus were about 15% faster, with fewer errors.',
 dur:11,hint:'Choose a menu type, press Next trial, then press the named item as quickly as you can. Compare your average times.',
 init:()=>({type:'pie',target:null,start:0,trials:[]}),
 watch(p){const seq=[5,2,7,0],k=Math.min(3,Math.floor(p*4));return {type:'both',target:seq[k],u:smooth(Math.min(1,(p*4-k)*1.6)),trials:[]}},
 ui:[{choose:[['linear','Linear'],['pie','Pie']],label:'Menu type',get:s=>s.type,act:'type'},{b:'Next trial',act:'next'}],
 on:{type(s,v){s.type=v;s.target=null},next(s){s.target=Math.floor(H3_menuRand()*8);s.start=performance.now()},
  pick(s,a){const [type,i]=String(a).split(':');if(s.target===null||type!==s.type)return 'keep';const ms=Math.round(performance.now()-s.start);s.trials.push({type,ms,ok:Number(i)===s.target});s.target=null}},
 draw(s,f,X){
  const tgt=s.target;let out=heading(tgt!==null&&s.type!=='both'?`Pick “${H3_MENU[tgt]}” from the ${s.type} menu`:tgt!==null?`Reaching “${H3_MENU[tgt]}” in each menu`:'Linear menu or pie menu?');
  const live=t=>s.type==='both'||!X.try||s.type===t;
  // Linear menu.
  let lin=R(H3_LIN.x,H3_LIN.y-2,H3_LIN.w,H3_LIN.h*8+4,'#fff',C.dark,3);
  H3_MENU.forEach((m,i)=>{const y=H3_LIN.y+i*H3_LIN.h,on=tgt===i;const cell=R(H3_LIN.x+2,y,H3_LIN.w-4,H3_LIN.h-2,on?C.amberp:'#fff','none',2)+T(H3_LIN.x+14,y+20,m,14,C.ink,'start')+TF(H3_LIN.x+H3_LIN.w-8,y+19,Math.round(Math.hypot(H3_itemCentre('linear',i)[0]-H3_LIN.ox,H3_itemCentre('linear',i)[1]-H3_LIN.oy))+'',13,C.muted,'end');
   lin+=live('linear')?hit(X,'pick','linear:'+i,`Linear menu item ${m}`,cell):cell});
  lin+=TF(H3_LIN.x+H3_LIN.w-8,H3_LIN.y-8,'distance',13,C.muted,'end')+Ci(H3_LIN.ox,H3_LIN.oy,4,C.ink);
  out+=G(lin,live('linear')?'':'opacity=".35"');
  // Pie menu.
  let pie='';
  H3_MENU.forEach((m,i)=>{const a=-Math.PI/2+i*Math.PI/4,on=tgt===i,c=H3_itemCentre('pie',i);const cell=P(H3_pieSlice(H3_PIE.cx,H3_PIE.cy,H3_PIE.r0,H3_PIE.r1,a-Math.PI/8,a+Math.PI/8),C.dark,1.4,on?C.amberp:'#fff')+T(c[0],c[1]+5,m,14,C.ink);
   pie+=live('pie')?hit(X,'pick','pie:'+i,`Pie menu item ${m}`,cell):cell});
  pie+=Ci(H3_PIE.cx,H3_PIE.cy,4,C.ink)+TF(H3_PIE.cx,H3_PIE.cy+H3_PIE.r1+18,'every item 72 away',13,C.muted);
  out+=G(pie,live('pie')?'':'opacity=".35"');
  if(!X.try&&tgt!==null){for(const t of ['linear','pie']){const o=t==='linear'?[H3_LIN.ox,H3_LIN.oy]:[H3_PIE.cx,H3_PIE.cy],c=H3_itemCentre(t,tgt),x=lerp(o[0],c[0],s.u),y=lerp(o[1],c[1],s.u);out+=L(o[0],o[1],x,y,C.coral,2,'stroke-dasharray="4 4"')+H3_pointer(x,y)}}
  const mean=t=>{const a=s.trials.filter(r=>r.type===t&&r.ok);return a.length?Math.round(sum(a.map(r=>r.ms))/a.length)+' ms ('+a.length+')':'—'};
  const errs=s.trials.filter(r=>!r.ok).length;
  out+=X.try?TF(300,366,`Your mean: linear ${mean('linear')} · pie ${mean('pie')}${errs?` · ${errs} wrong pick${errs>1?'s':''}`:''}`,14,C.ink):TF(300,366,'Callahan et al. (1988): pie menus about 15% faster, fewer errors',14,C.muted);
  const last=s.trials[s.trials.length-1];
  return {svg:out,phase:last&&X.try?`Last pick: ${last.ms} ms${last.ok?'':', wrong item'}. Items low in a linear menu are further away, so they take longer (Fitts’s law); in a pie menu direction, not distance, tells items apart.`:'Every pie slice starts right next to the pointer and gets wider as it goes out, so all items are equally close and large. Directions are also easy to learn, so experts can flick without looking.'};
 }});

/* ---------------- dynabook ---------------- */
const H3_DYNA=[{y:1972,t:'A programming language for children',n:'Smalltalk-72'},{y:1973,t:'Windows and bitmap graphics',n:'the Alto, an “interim Dynabook”'},{y:1982,t:'A portable, flat-screen computer',n:'the first laptops'},{y:1997,t:'Wireless networking',n:'the IEEE 802.11 standard'},{y:2007,t:'Block programming for children',n:'Scratch'},{y:2010,t:'Mass-market touch tablets',n:'slates for everyone'}];
SCENE({id:'dynabook',name:'The Dynabook',tag:'A computer for children of all ages',
 definition:'Alan Kay’s 1972 vision of a book-sized personal computer that children could carry, draw on, network and program, as a medium for thinking rather than a calculator.',
 example:'Kay called the Xerox Alto an “interim Dynabook”. Most of the hardware he imagined arrived over the next 40 years; his hope that everyone would program it arrived far less completely.',
 desc:'A sketch of a slate-sized computer beside a list of the Dynabook’s features, each lighting up in the year it became real, with a timeline from 1972.',
 research:'Kay (1972). A personal computer for children of all ages. Proc. ACM National Conference · Kay & Goldberg (1977). Personal dynamic media. IEEE Computer 10(3).',
 dur:10,hint:'Slide through the years and watch which parts of the 1972 vision become real.',
 init:()=>({year:1972}),
 watch(p){return {year:1972+Math.round(smooth(p)*43)}},
 ui:[{range:'year',label:'Year',min:1972,max:2015,get:s=>s.year,act:'year'}],
 on:{year(s,v){s.year=v}},
 draw(s){
  const got=H3_DYNA.filter(f=>f.y<=s.year);let out=heading('Kay’s Dynabook, 1972, and what came true');
  out+=R(34,62,240,196,'#f3f1ea',C.dark,16)+R(52,78,204,118,'#fff',C.dark,4);
  // A turtle drawing and text on the slate's screen.
  out+=P('M90 170L90 110L150 110L150 160L110 160L110 130L130 130',C.blue,2.2)+[0,1,2,3].map(i=>R(172,104+i*16,64-(i%2)*18,6,'#c3d1da','none',3)).join('');
  for(let r=0;r<3;r++)for(let c=0;c<10;c++)out+=R(58+c*19.5,206+r*15,15,11,'#fff','#9fb3bf',2);
  if(s.year>=1997)out+=[10,18,26].map(r=>P(`M${264-r*.7} ${70-r*.7}A${r} ${r} 0 0 1 ${264+r*.7} ${70-r*.7}`,C.green,1.8)).join('');
  out+=TB(154,300,s.year,32,C.ink);
  H3_DYNA.forEach((f,i)=>{const y=58+i*44,on=f.y<=s.year;out+=R(296,y,288,38,on?C.greenp:'#fff',on?C.green:C.grid,8)+TBF(308,y+17,f.t,14,on?C.ink:C.muted,'start')+TF(308,y+32,on?`${f.y}: ${f.n}`:'not yet',13,on?C.green:C.muted,'start')});
  out+=L(40,340,580,340,C.line,3);H3_DYNA.forEach(f=>{const x=40+540*(f.y-1972)/43;out+=Ci(x,340,5,f.y<=s.year?C.green:'#fff',C.green)});
  const mx=40+540*(s.year-1972)/43;out+=`<polygon points="${fmt(mx)},334 ${fmt(mx-7)},322 ${fmt(mx+7)},322" fill="${C.ink}"/>`+TF(40,362,'1972',13,C.muted,'start')+TF(580,362,'2015',13,C.muted,'end');
  return {svg:out,phase:`By ${s.year}, ${got.length} of ${H3_DYNA.length} parts of the vision were real. The machine arrived; Kay’s deeper aim, that children would use it to build and test their own ideas, is still only partly met.`};
 }});

// Logo: FD n, BK n, RT n, LT n, PU, PD, REPEAT n [ … ]. Errors are reported, never thrown at the page.
function H3_logo(src){
 const tk=String(src).toUpperCase().replace(/\[/g,' [ ').replace(/\]/g,' ] ').trim().split(/\s+/).filter(Boolean);let i=0;const out=[];
 const num=()=>{const v=Number(tk[i++]);if(!Number.isFinite(v))throw new Error('A number was expected after '+tk[i-2]+'.');return v};
 function block(dst,inner){
  while(i<tk.length){const w=tk[i++];
   if(w===']'){if(inner)return;throw new Error('A ] has no matching [.')}
   if(w==='FD'||w==='FORWARD')dst.push({op:'FD',n:num()});else if(w==='BK'||w==='BACK')dst.push({op:'FD',n:-num()});
   else if(w==='RT'||w==='RIGHT')dst.push({op:'RT',n:num()});else if(w==='LT'||w==='LEFT')dst.push({op:'RT',n:-num()});
   else if(w==='PU'||w==='PENUP')dst.push({op:'PU'});else if(w==='PD'||w==='PENDOWN')dst.push({op:'PD'});
   else if(w==='REPEAT'){const n=Math.min(60,num());if(tk[i++]!=='[')throw new Error('REPEAT needs a list in [ ].');const body=[];block(body,true);for(let r=0;r<n;r++)dst.push(...body)}
   else throw new Error(`I don’t know how to ${w}.`);
   if(dst.length>200)throw new Error('That program makes more than 200 moves; try something shorter.');
  }
  if(inner)throw new Error('A [ is never closed.');
 }
 block(out,false);return out;
}
function H3_turtleRun(cmds,upto){let x=0,y=0,h=0,pen=true,turn=0;const segs=[];for(let i=0;i<upto;i++){const c=cmds[i];if(c.op==='FD'){const nx=x+c.n*Math.sin(h*Math.PI/180),ny=y-c.n*Math.cos(h*Math.PI/180);if(pen)segs.push([x,y,nx,ny,i]);x=nx;y=ny}else if(c.op==='RT'){h+=c.n;turn+=c.n}else pen=c.op==='PD'}return {x,y,h,segs,turn}}
const H3_LOGO_PRESETS=[['REPEAT 4 [FD 80 RT 90]','Square'],['REPEAT 3 [FD 100 RT 120]','Triangle'],['REPEAT 5 [FD 120 RT 144]','Star'],['REPEAT 36 [FD 10 RT 10]','Circle']];
SCENE({id:'dynabook-turtle',name:'Logo and the turtle',tag:'Thinking with a body',
 definition:'In Logo, children program a “turtle” that walks and turns, drawing as it goes. You can work out any program by pretending to be the turtle yourself.',
 example:'To draw a square, walk forward, turn right 90°, and repeat four times: REPEAT 4 [FD 80 RT 90]. Papert called this body-syntonic learning: the maths matches how your own body moves.',
 desc:'A drawing area where a turtle traces a shape step by step, beside the program with the current command highlighted and the turtle’s position, heading and total turning.',
 research:'Feurzeig, Papert et al. (1967). Logo at BBN · Papert (1980). Mindstorms: Children, Computers, and Powerful Ideas. Basic Books.',
 dur:12,hint:'Type a Logo program (FD, BK, RT, LT, PU, PD, REPEAT n [ … ]) or pick an example, then Step or Run.',
 init:()=>({src:'REPEAT 4 [FD 80 RT 90]'}),
 ui:[{choose:H3_LOGO_PRESETS,label:'Example programs',get:s=>s.src,act:'set'},{text:'Program',label:'Program',get:s=>s.src,act:'set',max:60}],
 on:{set(s,v){s.src=String(v)}},
 trace(s){let cmds;try{cmds=H3_logo(s.src)}catch(e){return [{err:e.message}]}return range(cmds.length+1).map(i=>({cmds,upto:i}))},
 draw(s,f,X){
  let out=heading('Play turtle: walk, turn, repeat')+R(20,46,370,304,'#fff',C.grid,8);
  if(f.err)return {svg:out+TF(205,190,'This program cannot run:',15,C.coral)+TF(205,214,f.err,13,C.ink),phase:f.err+' Logo understands FD, BK, RT, LT, PU, PD and REPEAT n [ … ].'};
  const run=H3_turtleRun(f.cmds,f.upto),ox=205,oy=236;
  out+=`<clipPath id="h3-turtle-clip"><rect x="20" y="46" width="370" height="304" rx="8"/></clipPath><g clip-path="url(#h3-turtle-clip)">`;
  for(let gx=40;gx<390;gx+=40)out+=L(gx,48,gx,348,'#eef2f4',1);for(let gy=56;gy<350;gy+=40)out+=L(22,gy,388,gy,'#eef2f4',1);
  run.segs.forEach(sg=>out+=L(ox+sg[0],oy+sg[1],ox+sg[2],oy+sg[3],sg[4]===f.upto-1?C.coral:C.blue,3));
  const tx=ox+run.x,ty=oy+run.y,a=run.h*Math.PI/180,pt=(d,o)=>[tx+d*Math.sin(a+o),ty-d*Math.cos(a+o)];const [p1,p2,p3]=[pt(14,0),pt(10,2.5),pt(10,-2.5)];
  out+=`<polygon points="${p1.map(fmt)} ${p2.map(fmt)} ${p3.map(fmt)}" fill="${C.green}" stroke="${C.ink}" stroke-width="1.2"/></g>`;
  const n=f.cmds.length,cur=f.upto-1,lo=clamp(cur-4,0,Math.max(0,n-9));
  out+=TB(492,62,'Program',14);
  for(let j=lo;j<Math.min(n,lo+9);j++){const c=f.cmds[j],y=72+(j-lo)*22,on=j===cur;out+=R(404,y,176,20,on?C.coralp:j<cur?'#f3f6f8':'#fff',on?C.coral:'none',4)+TMF(414,y+15,`${j+1}. ${c.op==='FD'?(c.n<0?'BK '+(-c.n):'FD '+c.n):c.op==='RT'?(c.n<0?'LT '+(-c.n):'RT '+c.n):c.op}`,13,j<=cur?C.ink:C.muted,'start')}
  const closed=f.upto===n&&n>0&&Math.hypot(run.x,run.y)<.5;
  out+=TF(492,290,`heading ${((run.h%360)+360)%360}°`,13,C.muted)+TBF(492,312,`total turning ${run.turn}°`,14,closed?C.green:C.ink);
  if(closed)out+=TF(492,332,run.turn%360===0?`= ${run.turn/360} × 360°: a closed trip`:'',13,C.green);
  const c=f.cmds[cur];
  return {svg:out,phase:f.upto===0?'The turtle starts in the middle, facing up. Imagine you are the turtle and walk the program yourself.':closed?`Back home after ${run.turn}° of turning. Papert’s Total Turtle Trip Theorem: a turtle that returns to where it started, facing the same way, has turned a whole number of times 360°.`:c.op==='FD'?`Walk ${c.n<0?'backwards '+(-c.n):'forward '+c.n} steps.`:c.op==='RT'?`Turn ${c.n<0?'left '+(-c.n):'right '+c.n}°.`:c.op==='PU'?'Lift the pen: move without drawing.':'Put the pen down again.'};
 }});

const H3_BRUNER_TASKS={move:{name:'Move a file',sym:'projects add: report'},copy:{name:'Copy a file',sym:'floppy add: report copy'},delete:{name:'Delete a file',sym:'report delete'},square:{name:'Draw a square',sym:'4 timesRepeat: [pen go: 50; turn: 90]'}};
const H3_BRUNER_NOTE=['Enactive: you know it in your hands. Bruner found young children think first through action; the mouse lets anyone act directly on the screen.','Iconic: you recognise a picture. Icons and windows let people see what is possible instead of remembering it.','Symbolic: you write it down. Smalltalk’s words can be combined, saved and reused in ways a gesture cannot.'];
SCENE({id:'dynabook-bruner',name:'Doing with images makes symbols',tag:'Three ways of knowing',
 definition:'Psychologist Jerome Bruner described three ways of knowing: by doing (enactive), by images (iconic) and by symbols (symbolic). Kay designed the Smalltalk interface to use all three.',
 example:'Moving a file can be a drag with the mouse (doing), a document icon dropped on a folder icon (images), or the Smalltalk expression projects add: report (symbols).',
 desc:'Three panels showing one task done by hand with a mouse, by icons, and by a written Smalltalk expression, with the current mode highlighted.',
 research:'Bruner (1966). Toward a Theory of Instruction. Harvard University Press · Kay (1990). User interface: a personal view. In Laurel (ed.), The Art of Human–Computer Interface Design.',
 dur:10,hint:'Choose a task, then press a panel to see what that way of knowing gives you.',
 init:()=>({task:'move',focus:0}),
 watch(p){const k=Math.min(2,Math.floor(p*3));return {task:'move',focus:k,u:smooth(clamp((p*3-k)*1.3,0,1))}},
 ui:[{choose:Object.entries(H3_BRUNER_TASKS).map(([k,v])=>[k,v.name]),label:'Task',get:s=>s.task,act:'task'}],
 on:{task(s,v){s.task=v},focus(s,i){s.focus=Number(i)}},
 draw(s,f,X){
  const t=H3_BRUNER_TASKS[s.task],u=s.u===undefined?1:s.u;let out=heading(t.name+', three ways');
  const titles=[['Enactive','doing'],['Iconic','images'],['Symbolic','symbols']],cols=[C.coral,C.blue,C.purple];
  titles.forEach(([a,b],i)=>{const x=20+i*190,on=s.focus===i;
   let inner=R(x,48,180,250,on?'#fff':'#f6f8f9',on?cols[i]:C.grid,10)+TB(x+90,74,a,16,cols[i])+TF(x+90,92,b,13,C.muted);
   const cx=x+90,cy=190,uu=on?u:1;
   if(i===0){const mx=cx-40+80*uu;inner+=P(`M${cx-40} 230Q${cx} 200 ${cx+40} 230`,C.line,2,'none','stroke-dasharray="5 4"')+R(mx-14,214,28,40,'#fff',C.dark,14)+L(mx,214,mx,228,C.dark,1.5)+P(`M${mx} 214Q${mx} 196 ${mx+20} 190`,C.dark,1.5);
    if(s.task==='square'){const pts=[[cx-30,175],[cx-30,115],[cx+30,115],[cx+30,175],[cx-30,175]],len=uu*4,k=Math.floor(len);let d=`M${pts[0][0]} ${pts[0][1]}`;for(let j=1;j<=Math.min(4,k);j++)d+=`L${pts[j][0]} ${pts[j][1]}`;if(k<4){const a=pts[k],b=pts[k+1],v=len-k;d+=`L${fmt(lerp(a[0],b[0],v))} ${fmt(lerp(a[1],b[1],v))}`}inner+=P(d,C.coral,3)}
    else inner+=H3_icon('doc',cx-40+80*uu,145,'',false)}
   else if(i===1){if(s.task==='square')inner+=R(cx-50,126,36,36,'#fff',C.dark,4)+R(cx-42,134,20,20,'none',C.blue,1)+arrow(cx-8,144,cx+12,144,C.line,2)+R(cx+20,120,48,48,'none',C.blue,1);
    else{const dst=s.task==='move'?'folder':s.task==='copy'?'disk':'trash';inner+=H3_icon('doc',cx-42,140,'',false)+arrow(cx-18,140,cx+14,140,C.line,2)+H3_icon(dst,cx+42,140,'',false)}}
   else{const words=t.sym.length>20?[t.sym.slice(0,t.sym.indexOf('[')),t.sym.slice(t.sym.indexOf('['))]:[t.sym];const shown=on?Math.ceil(t.sym.length*uu):t.sym.length;let used=0;
    words.forEach((w,j)=>{const part=w.slice(0,Math.max(0,shown-used));used+=w.length;inner+=TMF(cx,150+j*22,part||' ',13,C.ink)})}
   inner+=TF(cx,276,['know it in your hands','recognise, don’t recall','combine, save, reuse'][i],13,on?cols[i]:C.muted);
   out+=hit(X,'focus',i,`${a}: ${b}`,inner)});
  out+=TB(300,330,'“Doing with images makes symbols”',16,C.ink)+TF(300,352,'Kay’s slogan for the Smalltalk interface',13,C.muted);
  return {svg:out,phase:H3_BRUNER_NOTE[s.focus]};
 }});

/* ---------------- direct-manipulation ---------------- */
const H3_DM_PRINCIPLES=['Objects stay visible','Act by pointing, not typing syntax','Fast, reversible, visible results'];
SCENE({id:'direct-manipulation',name:'Direct manipulation',tag:'Drag it, don’t describe it',
 definition:'In direct manipulation you act on visible objects with physical actions, such as dragging, and see the result immediately, instead of describing what you want in a command language.',
 example:'To file a report you can type mv report.txt archive/ and hope it worked, or drag the report onto the archive folder and watch it go in. One typo in the command fails; a drag shows you what is happening all the way.',
 desc:'Moving a file two ways: typing a command in a terminal, and dragging an icon onto a folder, beside Shneiderman’s three principles marked for each method.',
 research:'Shneiderman (1983). Direct manipulation: a step beyond programming languages. IEEE Computer 16(8), 57–69.',
 dur:13,hint:'Choose a method and step through it. Add a typo to the command and compare what each method tells you.',
 init:()=>({method:'both',typo:false}),
 ui:[{choose:[['both','Both'],['command','Command'],['drag','Drag']],label:'Method',get:s=>s.method,act:'method'},{b:'Toggle a typo',act:'typo'}],
 on:{method(s,v){s.method=v},typo(s){s.typo=!s.typo}},
 trace(s){const fr=[];
  if(s.method!=='drag'){const cmd=s.typo?'mv reprot.txt archive/':'mv report.txt archive/';for(let n=0;n<=cmd.length;n+=4)fr.push({m:'cmd',cmd,typed:Math.min(n,cmd.length)});fr.push({m:'cmd',cmd,typed:cmd.length,done:true,ok:!s.typo})}
  if(s.method!=='command'){for(const g of [0,.2,.4,.6,.8,1])fr.push({m:'drag',g});fr.push({m:'drag',g:1,done:true})}
  return fr},
 draw(s,f,X){
  let out=heading(f.m==='cmd'?'Describe it: type a command':'Show it: drag the icon');
  if(f.m==='cmd'){out+=R(24,50,362,220,'#1f2b31','none',8);const lines=['$ ls','archive/   notes.txt   report.txt','$ '+f.cmd.slice(0,f.typed)+(f.done?'':'▌')];
   if(f.done){if(!f.ok)lines.push('mv: '+f.cmd.split(' ')[1]+': No such file or directory');lines.push('$ ▌')}
   lines.forEach((l,i)=>out+=TMF(38,80+i*24,l,14,i===3&&!f.ok?'#ffb39e':'#d8f0e4','start','xml:space="preserve"'));
   out+=R(24,282,362,60,'#fff',C.grid,8)+TF(205,306,f.done?(f.ok?'Success looks like… nothing at all.':'Failure: an error message to decode.'):'You must recall the command, the file name',13,f.done&&!f.ok?C.coral:C.ink)+TF(205,326,f.done?(f.ok?'You must run ls again to check.':'The files never appeared on screen.'):'and the exact syntax before anything happens.',13,C.muted)}
  else{out+=R(24,50,362,292,'#e3e8eb','none',8);const sx=100,sy=170,ex=300,ey=170,x=lerp(sx,ex,smooth(f.g)),y=lerp(sy,ey,smooth(f.g))-Math.sin(Math.PI*f.g)*40;const over=f.g>.7;
   out+=(over?R(250,118,100,110,C.amberp,C.amber,8):'')+H3_icon('folder',300,170,f.done?'archive (1 item)':'archive',false,f.done?'full':'');
   if(!f.done){out+=H3_icon('doc',sx,sy,f.g>0?'':'report.txt',false).replace(/<text[^>]*>[^<]*<\/text>$/,'')+(f.g>0?G(H3_icon('doc',x,y,'',false),'opacity=".85"'):'')+H3_pointer(x+6,y+6)}
   out+=TF(205,316,f.done?'The report is visibly inside the folder.':f.g===0?'Point at the report and press…':over?'…the folder lights up: “drop here”.':'…the icon follows your hand.',13,C.ink)}
  const isDrag=f.m==='drag';out+=TB(488,66,'Shneiderman, 1983',14);
  H3_DM_PRINCIPLES.forEach((t,i)=>{const y=82+i*62,ok=isDrag;out+=R(396,y,186,54,ok?C.greenp:C.coralp,ok?C.green:C.coral,8)+TB(410,y+22,ok?'✓':'✗',16,ok?C.green:C.coral,'start');
   const words=t.split(' ');let l1='',l2='';for(const w of words){if((l1+' '+w).length<=20&&!l2)l1=l1?l1+' '+w:w;else l2=l2?l2+' '+w:w}
   out+=TF(430,y+22,l1,13,C.ink,'start')+TF(430,y+40,l2,13,C.ink,'start')});
  out+=TF(488,290,isDrag?'All three principles hold.':'None of the three holds.',13,isDrag?C.green:C.coral);
  return {svg:out,phase:f.m==='cmd'?(f.done?(f.ok?'The command worked, but the screen does not show it: you have to ask again. Shneiderman’s point is that people should see objects and results continuously.':'A one-letter typo fails, and the message names the file you meant to type, not the one you did. Syntax is a barrier between intention and action.'):'Typing describes the action in a language: verb, object, destination, in the right order.'):(f.done?'The result is visible at once, and dragging it back would undo it. Rapid, incremental, reversible actions make experimenting safe.':'Every movement of the hand is matched on screen, so you can correct course before letting go.')};
 }});

const H3_GULF_PRESETS={cmd:{name:'Command line',ex:85,ev:75},menu:{name:'Menus and dialogs',ex:45,ev:40},dm:{name:'Direct manipulation',ex:15,ev:12}};
const H3_STAGES=[['Goal','person',[96,84]],['Plan','person',[96,126]],['Specify','person',[96,168]],['Perform','system',[504,168]],['Perceive','system',[504,252]],['Interpret','person',[96,252]],['Compare','person',[96,294]]];
SCENE({id:'direct-manipulation-gulfs',name:'The gulfs of execution and evaluation',tag:'Two gaps to cross',
 definition:'Norman described two gaps between a person and a system: the gulf of execution (how hard it is to turn an intention into actions) and the gulf of evaluation (how hard it is to tell what happened).',
 example:'A command line has a wide gulf of execution (you must recall the syntax) and of evaluation (success may print nothing). Direct manipulation narrows both: you can see what to do and what you did.',
 desc:'Two cliffs, a person and a system, separated by a gap whose width shows each gulf; a marker walks Norman’s seven stages of action across the bridges.',
 research:'Hutchins, Hollan & Norman (1985). Direct manipulation interfaces. Human–Computer Interaction 1(4) · Norman (1986). Cognitive engineering. In Norman & Draper (eds.), User Centered System Design.',
 dur:13,hint:'Pick an interface, or set how visible its actions and results are, then step through the seven stages of action.',
 init:()=>({preset:'cmd',ex:85,ev:75}),
 ui:[{choose:Object.entries(H3_GULF_PRESETS).map(([k,v])=>[k,v.name]),label:'Interface',get:s=>s.preset,act:'preset'},{range:'ex',label:'Execution gulf',min:0,max:100,step:5,get:s=>s.ex,act:'ex'},{range:'ev',label:'Evaluation gulf',min:0,max:100,step:5,get:s=>s.ev,act:'ev'}],
 on:{preset(s,v){s.preset=v;s.ex=H3_GULF_PRESETS[v].ex;s.ev=H3_GULF_PRESETS[v].ev},ex(s,v){s.ex=v;s.preset='custom'},ev(s,v){s.ev=v;s.preset='custom'}},
 trace(s){return H3_STAGES.map((_,k)=>({k}))},
 draw(s,f,X){
  const ge=40+2*s.ex,gv=40+2*s.ev,mid=300;let out=heading('Norman’s seven stages of action');
  out+=P(`M20 56H${mid-ge/2}V206H${mid-gv/2}V340H20Z`,'#c9d6de',1.5,'#eef3f6')+P(`M580 56H${mid+ge/2}V206H${mid+gv/2}V340H580Z`,'#c9d6de',1.5,'#f3f0f8');
  out+=TB(70,330,'Person',14,C.blue)+TB(530,330,'System',14,C.purple);
  out+=arrow(mid-ge/2+4,168,mid+ge/2-4,168,s.ex>60?C.coral:C.green,3)+arrow(mid+gv/2-4,252,mid-gv/2+4,252,s.ev>60?C.coral:C.green,3);
  out+=R(mid-74,120,148,32,'#fff',C.grid,6)+TBF(mid,134,'Gulf of execution',13,C.ink)+TF(mid,148,s.ex>60?'wide':s.ex>30?'middling':'narrow',13,s.ex>60?C.coral:C.green);
  out+=R(mid-74,268,148,32,'#fff',C.grid,6)+TBF(mid,282,'Gulf of evaluation',13,C.ink)+TF(mid,296,s.ev>60?'wide':s.ev>30?'middling':'narrow',13,s.ev>60?C.coral:C.green);
  H3_STAGES.forEach(([n,side,[x,y]],i)=>{const on=i===f.k,done=i<f.k;out+=R(x-50,y-15,100,30,on?(side==='person'?C.blue:C.purple):done?'#fff':'#f7f9fa',side==='person'?C.blue:C.purple,15)+TB(x,y+5,n,14,on?'#fff':C.ink)});
  for(let i=0;i<2;i++)out+=arrow(96,99+i*42,96,111+i*42,C.line,1.6);out+=arrow(96,267,96,279,C.line,1.6)+arrow(504,183,504,237,C.line,1.6);
  const say=['Goal: what do I want? (file the report)','Plan: decide on an approach.','Specify: turn the plan into exact actions. '+(s.ex>60?'With a wide gulf you must recall commands and syntax.':'The possible actions are visible, so little to recall.'),'Perform: act on the system. '+(s.ex>60?'Crossing a wide gulf of execution, slips and errors are likely.':'A short hop: point, press, drag.'),'Perceive: the system’s new state appears, or does not.','Interpret: what does that output mean? '+(s.ev>60?'A wide gulf of evaluation: silence or cryptic messages.':'The change is visible on the object itself.'),'Compare with the goal: did it work? '+(s.ex+s.ev>120?'Wide gulfs make this loop slow and error-prone.':'Narrow gulfs make the loop quick, so people explore.')][f.k];
  return {svg:out,phase:say};
 }});

const H3_UNDO_COLS=[C.blue,C.coral,C.green,C.purple];
function H3_undoState(hist,pos){const st={sq:0,ci:0,tr:true};hist.slice(0,pos).forEach(a=>{if(a==='move')st.sq=(st.sq+1)%4;else if(a==='colour')st.ci=(st.ci+1)%4;else if(a==='delete')st.tr=false});return st}
const H3_UNDO_NAMES={move:'Move square',colour:'Recolour circle',delete:'Delete triangle'};
SCENE({id:'direct-manipulation-undo',name:'Undo as a safety net',tag:'Reversible actions',
 definition:'Undo lets you reverse recent actions, one step at a time. Because mistakes can be taken back, people feel free to experiment.',
 example:'Delete a shape by mistake and Undo brings it back; Redo replays it. Turn undo off and the same slip is permanent, so people slow down and explore less.',
 desc:'A small drawing with a square, a circle and a triangle, beside a history list whose marker shows which actions are in effect and which can be redone.',
 research:'Shneiderman (1983). Direct manipulation (rapid, incremental, reversible actions) · Abowd & Dix (1992). Giving undo attention. Interacting with Computers 4(3).',
 dur:11,hint:'Make changes, then Undo and Redo. Switch undo off and see what a slip costs.',
 init:()=>({hist:[],pos:0,undoOn:true,msg:null}),
 watch(p){const ops=['move','colour','delete','undo','undo','redo'],k=Math.min(6,Math.floor(p*7));const s={hist:[],pos:0,undoOn:true};for(let j=0;j<k;j++){const o=ops[j];if(o==='undo')s.pos--;else if(o==='redo')s.pos++;else{s.hist=s.hist.slice(0,s.pos).concat(o);s.pos++}}s.last=k?ops[k-1]:null;return s},
 ui:[{b:'Move square',act:'do',arg:'move'},{b:'Recolour circle',act:'do',arg:'colour'},{b:'Delete triangle',act:'do',arg:'delete'},{b:'Undo',act:'undo'},{b:'Redo',act:'redo'},{choose:[['on','Undo on'],['off','Undo off']],label:'Undo',get:s=>s.undoOn?'on':'off',act:'undoOn'}],
 on:{do(s,a){if(a==='delete'&&!H3_undoState(s.hist,s.pos).tr){s.msg='The triangle is already gone.';return}s.hist=s.hist.slice(0,s.pos).concat(a);s.pos++;s.msg=null;s.last=a},
  undo(s){if(!s.undoOn){s.msg='Undo is switched off: that action cannot be taken back.';return}if(s.pos>0){s.pos--;s.last='undo';s.msg=null}},
  redo(s){if(!s.undoOn)return;if(s.pos<s.hist.length){s.pos++;s.last='redo';s.msg=null}},
  undoOn(s,v){s.undoOn=v==='on';if(!s.undoOn){s.hist=s.hist.slice(0,s.pos)}}},
 draw(s,f,X){
  const st=H3_undoState(s.hist,s.pos);let out=heading('Every action can be taken back');
  out+=R(20,46,370,300,'#fff',C.grid,8);
  out+=R(50+st.sq*70,90,60,60,C.pale,C.blue,4)+Ci(150,240,40,H3_UNDO_COLS[st.ci],C.ink);
  out+=st.tr?`<polygon points="300,200 260,280 340,280" fill="${C.amberp}" stroke="${C.amber}" stroke-width="2"/>`:`<polygon points="300,200 260,280 340,280" fill="none" stroke="${C.line}" stroke-width="2" stroke-dasharray="5 4"/>`+TF(300,300,s.undoOn?'deleted (can undo)':'deleted for good',13,s.undoOn?C.muted:C.coral);
  out+=TB(490,66,'History',14);
  if(!s.hist.length)out+=TF(490,100,'No actions yet',13,C.muted);
  s.hist.slice(-8).forEach((a,j)=>{const i=j+Math.max(0,s.hist.length-8),y=78+j*30,live=i<s.pos;out+=R(410,y,170,26,live?C.pale:'#fff',live?C.blue:C.grid,6,live?'':'stroke-dasharray="4 3"')+TF(422,y+18,`${i+1}. ${H3_UNDO_NAMES[a]}`,13,live?C.ink:C.muted,'start')});
  const my=78+Math.min(s.pos-Math.max(0,s.hist.length-8),8)*30-3;if(s.hist.length)out+=L(402,my,588,my,C.coral,2.5)+TF(404,my-4,'now',13,C.coral,'start');
  out+=TF(495,340,s.undoOn?`${s.pos} in effect · ${s.hist.length-s.pos} can be redone`:'Undo off: history is not kept',13,s.undoOn?C.muted:C.coral);
  return {svg:out,phase:s.msg||(s.last==='undo'?'Undo stepped back one action. The undone action stays in the list, so Redo can replay it, until you do something new.':s.last==='redo'?'Redo replayed the action that was undone.':'Each action is added to the history. Knowing any step can be reversed is what makes it safe to try things: Shneiderman’s third principle.')};
 }});

/* ---------------- keystroke-model ---------------- */
const H3_OPS={K:{t:.28,n:'Keystroke',c:C.blue},P:{t:1.1,n:'Point',c:C.coral},B:{t:.1,n:'Button',c:C.amber},H:{t:.4,n:'Home hand',c:C.purple},M:{t:1.35,n:'Mental',c:C.green}};
const H3_KLM_PRESETS={mouse:{name:'Delete a word (mouse)',ops:['H','M','P','B','B','B','B','H','M','K']},keys:{name:'Delete a word (keys)',ops:['M','K','K','K','K']}};
const H3_klmTotal=ops=>ops.reduce((a,o)=>a+H3_OPS[o].t,0);
function H3_klmBar(ops,x,y,w,h,scale,label){let o=TF(x,y-6,label,13,C.ink,'start'),cx=x;ops.forEach(op=>{const ww=H3_OPS[op].t*scale;o+=R(cx,y,Math.max(2,ww-1.5),h,H3_OPS[op].c,'none',3)+(ww>12?TBF(cx+ww/2,y+h/2+5,op,13,'#fff'):'');cx+=ww});return o+TBF(Math.min(cx+8,560),y+h/2+5,H3_klmTotal(ops).toFixed(2)+' s',13,C.ink,'start')}
SCENE({id:'keystroke-model',name:'The keystroke-level model',tag:'Predict task time on paper',
 definition:'The keystroke-level model (KLM) predicts how long an expert takes to do a task by adding up standard times for each physical and mental step: keystrokes, pointing, homing the hand, button presses and mental preparation.',
 example:'Deleting a word with the mouse (reach for the mouse, think, point, double-click, return to the keyboard, think, press Delete) is predicted at about 5.3 s; the keyboard shortcut at about 2.5 s. No user test needed.',
 desc:'Five operator chips with their standard times, and a timeline that adds them up for a method, compared with two worked examples.',
 research:'Card, Moran & Newell (1980). The keystroke-level model for user performance time with interactive systems. Communications of the ACM 23(7), 396–410.',
 dur:12,hint:'Press operator chips to build a method, or load an example. The timeline predicts an expert’s time.',
 init:()=>({ops:H3_KLM_PRESETS.mouse.ops.slice(),preset:'mouse'}),
 watch(p){const a=H3_KLM_PRESETS.mouse.ops,n=Math.min(a.length,Math.ceil(p*1.4*a.length));return {ops:a.slice(0,n),preset:'mouse',both:p>.75}},
 ui:[{choose:Object.entries(H3_KLM_PRESETS).map(([k,v])=>[k,v.name]),label:'Example',get:s=>s.preset,act:'preset'},{b:'Remove last',act:'pop'},{b:'Clear',act:'clear'}],
 on:{add(s,o){if(s.ops.length<16){s.ops.push(o);s.preset='custom'}},pop(s){s.ops.pop();s.preset='custom'},clear(s){s.ops=[];s.preset='custom'},preset(s,v){s.preset=v;s.ops=H3_KLM_PRESETS[v].ops.slice()}},
 draw(s,f,X){
  let out=heading('Add up the steps an expert must make');
  Object.entries(H3_OPS).forEach(([k,o],i)=>{const x=24+i*112;out+=hit(X,'add',k,`Add operator ${k}, ${o.n}, ${o.t} seconds`,R(x,46,104,54,'#fff',o.c,8)+TB(x+18,80,k,22,o.c)+TF(x+36,70,o.n,13,C.ink,'start')+TF(x+36,88,o.t+' s',13,C.muted,'start'))});
  const scale=440/Math.max(6,H3_klmTotal(s.ops));
  out+=H3_klmBar(s.ops,24,150,0,36,scale,'Your method: '+(s.ops.join(' ')||'(empty)'));
  out+=TB(300,226,`Predicted time: ${H3_klmTotal(s.ops).toFixed(2)} s`,22,C.ink);
  if(!X.try||s.both||true){out+=H3_klmBar(H3_KLM_PRESETS.mouse.ops,24,270,0,18,scale,'Mouse example')+H3_klmBar(H3_KLM_PRESETS.keys.ops,24,322,0,18,scale,'Keyboard example')}
  const m=s.ops.filter(o=>o==='M').length;
  return {svg:out,phase:`${s.ops.length} operators, ${m} of them mental preparation (M, 1.35 s each), which often dominates. KLM predicts skilled, error-free performance within about 20%: good enough to compare designs before building them.`};
 }});

const H3_KLM_TASKS={save:{name:'Save the file',menu:['M','P','B','B','P','B','B'],key:['M','K','K']},bold:{name:'Make a word bold',menu:['M','P','B','B','B','B','M','P','B','B','P','B','B'],key:['M','P','B','B','B','B','M','K','K']},open:{name:'Open a recent file',menu:['M','P','B','B','P','B','B','P','B','B'],key:['M','K','K','M','K','K','K','K']}};
const H3_dev=o=>o==='P'||o==='B'?'mouse':o==='K'?'keys':null;
function H3_withHoming(ops,hand){const out=[];let at=hand;for(const o of ops){const d=H3_dev(o);if(d&&d!==at){out.push('H');at=d}out.push(o)}return out}
SCENE({id:'keystroke-model-compare',name:'GOMS: choosing a method',tag:'Goals, operators, methods, selection rules',
 definition:'GOMS describes a task as Goals, the Operators that achieve them, alternative Methods, and Selection rules for choosing between methods. With keystroke-level times it predicts which method is faster.',
 example:'To save a file you can use the File menu or a keyboard shortcut. Which is faster depends on where your hand already is: the selection rule.',
 desc:'Two predicted timelines, menu and keyboard shortcut, for a chosen task and starting hand position, beside a small GOMS tree naming the selection rule.',
 research:'Card, Moran & Newell (1983). The Psychology of Human–Computer Interaction · John & Kieras (1996). The GOMS family of user interface analysis techniques. ACM TOCHI 3(4).',
 dur:10,hint:'Choose a task and where your hand starts. The model inserts a homing step (H) whenever the hand must switch devices.',
 init:()=>({task:'save',hand:'mouse',daily:40}),
 watch(p){const ks=Object.keys(H3_KLM_TASKS),k=Math.min(5,Math.floor(p*6));return {task:ks[k>>1],hand:k%2?'keys':'mouse',daily:40}},
 ui:[{choose:Object.entries(H3_KLM_TASKS).map(([k,v])=>[k,v.name]),label:'Task',get:s=>s.task,act:'task'},{choose:[['mouse','Hand on mouse'],['keys','Hand on keys']],label:'Hand starts on',get:s=>s.hand,act:'hand'},{range:'daily',label:'Times per day',min:1,max:200,get:s=>s.daily,act:'daily'}],
 on:{task(s,v){s.task=v},hand(s,v){s.hand=v},daily(s,v){s.daily=v}},
 draw(s){
  const t=H3_KLM_TASKS[s.task],a=H3_withHoming(t.menu,s.hand),b=H3_withHoming(t.key,s.hand),ta=H3_klmTotal(a),tb=H3_klmTotal(b),scale=330/Math.max(ta,tb,4);
  let out=heading(t.name+`, hand on the ${s.hand==='mouse'?'mouse':'keyboard'}`);
  out+=H3_klmBar(a,24,92,0,30,scale,'Menu: '+a.join(' '))+H3_klmBar(b,24,170,0,30,scale,'Shortcut: '+b.join(' '));
  const win=ta<=tb?'menu':'shortcut',saved=Math.abs(ta-tb)*s.daily;
  out+=TB(210,240,`${win==='menu'?'The menu':'The shortcut'} is faster by ${Math.abs(ta-tb).toFixed(2)} s`,16,C.green);
  out+=TF(210,264,`× ${s.daily} a day = ${saved>=60?(saved/60).toFixed(1)+' minutes':saved.toFixed(0)+' seconds'} saved daily`,13,C.muted);
  out+=R(410,52,172,34,C.pale,C.blue,8)+TBF(496,74,'Goal: '+t.name.toLowerCase(),13,C.ink);
  out+=L(496,86,452,112,C.line,1.5)+L(496,86,540,112,C.line,1.5);
  out+=R(410,112,84,40,win==='menu'?C.greenp:'#fff',win==='menu'?C.green:C.grid,7)+TBF(452,130,'Method A',13)+TF(452,146,'menu',13,C.muted);
  out+=R(498,112,84,40,win==='shortcut'?C.greenp:'#fff',win==='shortcut'?C.green:C.grid,7)+TBF(540,130,'Method B',13)+TF(540,146,'shortcut',13,C.muted);
  out+=R(410,168,172,92,'#fff',C.purple,8)+TBF(496,188,'Selection rule',13,C.purple)+TF(496,208,'Use whichever is quicker',13,C.ink)+TF(496,226,`from where the hand is.`,13,C.ink)+TF(496,246,`Now: ${win}.`,13,C.green);
  out+=TF(300,340,'Operators: K 0.28 · P 1.1 · B 0.1 · H 0.4 · M 1.35 seconds',13,C.muted);
  return {svg:out,phase:`Each H costs 0.4 s and is followed by thinking time. ${s.hand==='mouse'?'With the hand already on the mouse, menus avoid a trip to the keyboard.':'With the hand on the keyboard, shortcuts avoid a trip to the mouse.'} GOMS turns “which is better?” into a prediction you can check.`};
 }});

let H3_rtRand=rng(83);
SCENE({id:'keystroke-model-processor',name:'The Model Human Processor',tag:'Three processors, about a quarter of a second',
 definition:'Card, Moran and Newell modelled a person as three processors: perceptual (about 100 ms per cycle), cognitive (about 70 ms) and motor (about 70 ms). Seeing, deciding and pressing takes about 240 ms, with a range of roughly 105 to 470 ms.',
 example:'Reacting to a light takes about a quarter of a second, even when you are ready. That sets a floor for any interface: feedback faster than about 100 ms feels instant, because the perceptual cycle cannot tell it apart.',
 desc:'A chain from eye to perceptual, cognitive and motor processors with their cycle times, a lamp for a reaction-time test, and your times plotted against the model’s range.',
 research:'Card, Moran & Newell (1983). The Psychology of Human–Computer Interaction. Lawrence Erlbaum. Model Human Processor: τp ≈ 100 ms, τc ≈ 70 ms, τm ≈ 70 ms.',
 dur:10,hint:'Press Start trial, wait for the lamp to turn green, then press the lamp as fast as you can. Repeat a few times.',
 init:()=>({phase:'idle',start:0,delay:1.5,rts:[],early:0,msg:null}),
 watch(p){return {phase:'demo',p,rts:[]}},
 ui:[{b:'Start trial',act:'start'},{b:'Clear results',act:'clear'}],
 on:{start(s){if(s.phase==='wait')return;s.phase='wait';s.delay=Math.round((1+H3_rtRand()*2)*100)/100;s.start=performance.now();s.msg='Wait for green…'},
  press(s){if(s.phase!=='wait'){s.msg='Press Start trial first.';return}const t=performance.now()-s.start-s.delay*1000;s.phase='idle';
   if(t<0){s.early++;s.msg='Too early: the lamp was not green yet.'}else if(t>2000)s.msg='Over two seconds: try again when you are ready.';else{s.rts.push(Math.round(t));s.msg=`${Math.round(t)} ms`}},
  clear(s){s.rts=[];s.early=0;s.msg=null}},
 draw(s,f,X){
  let out=heading('See, decide, press: about a quarter of a second');
  const stages=[['Eye','',null],['Perceptual','100 ms (50–200)',100],['Cognitive','70 ms (25–170)',70],['Motor','70 ms (30–100)',70],['Finger','',null]];
  const t=s.phase==='demo'?s.p*240:null;let acc=0;
  stages.forEach(([n,ms,d],i)=>{const x=24+i*114,active=t!==null&&d&&t>=acc&&t<acc+d;out+=R(x,50,100,56,active?C.pale:'#fff',active?C.blue:C.grid,8)+TB(x+50,74,n,14,C.ink)+(ms?TF(x+50,94,ms,13,C.muted):'');if(d)acc+=d;if(i<4)out+=arrow(x+100,78,x+112,78,C.line,1.6,6)});
  if(t!==null){out+=L(60,126,540,126,C.grid,8)+R(60,122,480*Math.min(1,t/240),8,C.blue,'none',4)+TF(300,148,`${Math.round(t)} ms`,14,C.ink)}
  // Lamp: green after a random delay, via a CSS animation started when the trial is drawn.
  const lit=s.phase==='demo'&&s.p>.05;let lamp=`<style>@keyframes h3-go{to{fill:${C.green}}}</style>`;
  const anim=s.phase==='wait'?`style="animation:h3-go 1ms linear ${s.delay}s forwards"`:'';
  lamp+=`<circle cx="120" cy="250" r="62" fill="${lit?C.green:'#d9e1e6'}" stroke="${C.ink}" stroke-width="2" ${anim}/>`+TF(120,250,s.phase==='wait'?'wait…':'press',15,lit||s.phase==='wait'?'#fff':C.muted)+TF(120,334,s.msg||'Reaction lamp',13,s.msg&&/early|first|Over/.test(s.msg)?C.coral:C.ink);
  out+=hit(X,'press','lamp','Reaction lamp: press when it turns green',lamp);
  // Results against the model's range.
  const ax=230,aw=350,ay=290,x=v=>ax+aw*Math.min(600,v)/600;
  out+=R(x(105),ay-38,x(470)-x(105),46,C.pale,'none',4)+L(x(240),ay-44,x(240),ay+8,C.blue,2)+TF(x(240),ay-50,'model 240 ms',13,C.blue);
  out+=L(ax,ay+8,ax+aw,ay+8,C.line,2);[0,200,400,600].forEach(v=>out+=TF(x(v),ay+26,v,13,C.muted));
  s.rts.forEach((v,i)=>out+=Ci(x(v),ay-30+(i%5)*7,5,C.coral,'#fff'));
  const mean=s.rts.length?Math.round(sum(s.rts)/s.rts.length):null;
  out+=TF(ax+aw/2,ay+46,mean?`Your mean ${mean} ms over ${s.rts.length} trial${s.rts.length>1?'s':''}${s.early?` · ${s.early} too early`:''}`:'Your reaction times appear here (ms)',13,C.ink);
  return {svg:out,phase:t!==null?'A light reaches the eye; the perceptual processor takes about 100 ms to register it, the cognitive about 70 ms to decide, and the motor about 70 ms to move the finger.':mean?`Your mean is ${mean} ms. Browser timing adds a few milliseconds, but most people land inside the model’s 105–470 ms band.`:'The model predicts about 240 ms for a simple reaction. Try it yourself.'};
 }});

/* ---------------- spreadsheet ---------------- */
const H3_SS_ITEMS=['Rent','Food','Travel','Fun'];
SCENE({id:'spreadsheet',name:'The live spreadsheet',tag:'Change one number, everything updates',
 definition:'An electronic spreadsheet is a grid of cells holding numbers or formulas that refer to other cells. Change any number and every formula that depends on it is recalculated at once.',
 example:'VisiCalc (1979) let people ask “what if?” of a budget: raise the food bill and the monthly total, the yearly figures and the grand total all update instantly.',
 desc:'A small budget grid with monthly amounts, totals and yearly figures; arrows run from the selected cell to every cell that depends on it.',
 research:'Bricklin & Frankston (1979). VisiCalc, the first electronic spreadsheet for personal computers · Nardi (1993). A Small Matter of Programming: Perspectives on End User Computing. MIT Press.',
 dur:10,hint:'Press one of the monthly amounts, then move the slider. Watch the arrows: every dependant recalculates.',
 init:()=>({v:[700,250,120,80],sel:1,recalc:0}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {v:[700,250+50*k,120,80],sel:1,recalc:k*3}},
 ui:[{range:'val',label:'Selected amount',min:0,max:1000,step:10,get:s=>s.v[s.sel],act:'val'}],
 on:{sel(s,i){s.sel=Number(i)},val(s,v){s.v[s.sel]=v;s.recalc+=3}},
 draw(s,f,X){
  let out=heading('Formulas recalculate the moment you type');
  const cx=[24,48,178,288,408],y0=52,rh=34,col=['','A','B','C'];
  out+=R(24,y0,384,rh,'#eef2f4',C.grid,0);['','Item','B: per month','C: per year'].forEach((h,j)=>{if(j)out+=TBF((cx[j]+cx[j+1])/2,y0+22,h,13,C.muted)});
  const cell=(r,c)=>[(cx[c]+cx[c+1])/2,y0+rh*(r+1)+rh/2];
  for(let r=0;r<5;r++){const y=y0+rh*(r+1),tot=r===4;out+=R(24,y,24,rh,'#eef2f4',C.grid,0)+TF(36,y+22,r+1,13,C.muted);
   out+=R(48,y,130,rh,tot?'#f6f8f9':'#fff',C.grid,0)+T(58,y+22,tot?'Total':H3_SS_ITEMS[r],14,C.ink,'start',tot?'font-weight="700"':'');
   const bv=tot?sum(s.v):s.v[r],cv=bv*12,dep=!tot&&r===s.sel?false:(tot||r===s.sel);
   const bcell=R(178,y,110,rh,!tot&&r===s.sel?C.amberp:tot?C.pale:'#fff',!tot&&r===s.sel?C.amber:C.grid,0)+TM(278,y+22,'£'+bv,14,C.ink,'end',tot?'font-weight="700"':'');
   out+=tot?bcell:hit(X,'sel',r,`B${r+1}, ${H3_SS_ITEMS[r]}: £${bv}. Press to select.`,bcell);
   out+=R(288,y,120,rh,(tot||r===s.sel)?C.pale:'#fff',C.grid,0)+TM(398,y+22,'£'+cv,14,C.ink,'end',tot?'font-weight="700"':'')}
  const [sx,sy]=cell(s.sel,2);
  for(const [r,c] of [[s.sel,3],[4,2],[4,3]]){const [tx,ty]=cell(r,c);out+=curveArrow(sx+30,sy,tx-30,ty,r===4&&c===2?-30:20,C.coral,2)}
  out+=R(24,y0+rh*6+10,384,34,'#fff',C.grid,6)+TMF(34,y0+rh*6+32,`B${s.sel+1} = ${s.v[s.sel]}   C${s.sel+1} = B${s.sel+1}*12   B5 = SUM(B1:B4)`,13,C.ink,'start','xml:space="preserve"');
  out+=TB(500,72,'Dependants of B'+(s.sel+1),14,C.ink);[`C${s.sel+1} (per year)`,'B5 (total)','C5 (yearly total)'].forEach((t,i)=>out+=R(424,86+i*40,154,32,C.pale,C.blue,7)+TF(501,107+i*40,t,13,C.ink));
  out+=counter(440,220,'recalculations',s.recalc,C.coral,124);
  return {svg:out,phase:`B${s.sel+1} feeds three formulas. Change it and the sheet recalculates them in dependency order, so the answer is never stale. That instant “what if?” made the spreadsheet the first must-have personal computer program.`};
 }});

const H3_REF_PRICES=[10,25,40,8];
SCENE({id:'spreadsheet-references',name:'Relative and absolute references',tag:'Formulas that point at places',
 definition:'A spreadsheet formula refers to cells by position. When you copy it, relative references shift with the copy; absolute references (marked with $) stay fixed.',
 example:'=B2*(1+E1) copied down a row becomes =B3*(1+E2), which points at an empty cell, so the VAT vanishes. Writing $E$1 pins the reference to the VAT rate.',
 desc:'A price list where a VAT formula is copied down the column, with arrows from each copy to the cell it refers to; references to empty cells are shown in coral.',
 research:'Nardi (1993). A Small Matter of Programming: Perspectives on End User Computing. MIT Press. Spreadsheets as visual programs that point at places.',
 dur:11,hint:'Choose relative or absolute, then step to copy the formula down one row at a time.',
 init:()=>({mode:'relative'}),
 ui:[{choose:[['relative','=B2*(1+E1)'],['absolute','=B2*(1+$E$1)']],label:'Formula in C2',get:s=>s.mode,act:'mode'}],
 on:{mode(s,v){s.mode=v}},
 trace(s){return range(4).map(k=>({k}))},
 draw(s,f,X){
  let out=heading('Copy the formula down: what does it point at?');
  const y0=52,rh=40,x={A:24,B:124,C:204,E:438};
  out+=R(24,y0,410,30,'#eef2f4',C.grid,0)+TBF(74,y0+20,'A: item',13,C.muted)+TBF(164,y0+20,'B: price',13,C.muted)+TBF(318,y0+20,'C: with VAT',13,C.muted)+R(438,y0,90,30,'#eef2f4',C.grid,0)+TBF(483,y0+20,'E',13,C.muted);
  out+=R(438,y0+30,90,rh,C.pale,C.blue,0)+TM(483,y0+56,'20%',14,C.ink)+TF(483,y0+86,'E1: VAT rate',13,C.blue);
  for(let r=0;r<4;r++){const y=y0+30+r*rh,row=r+2,shown=r<=f.k,eRow=s.mode==='relative'?1+r:1,bad=s.mode==='relative'&&r>0;
   out+=R(24,y,100,rh,'#fff',C.grid,0)+T(36,y+26,['Pens','Paper','Lamp','Mug'][r],14,C.ink,'start')+R(124,y,80,rh,'#fff',C.grid,0)+TM(194,y+26,'£'+H3_REF_PRICES[r],14,C.ink,'end');
   const formula=s.mode==='relative'?`=B${row}*(1+E${eRow})`:`=B${row}*(1+$E$1)`,val=H3_REF_PRICES[r]*(1+(eRow===1?.2:0));
   out+=R(204,y,230,rh,shown?(bad?C.coralp:C.greenp):'#fff',C.grid,0);
   if(shown){out+=TMF(214,y+26,formula,13,C.ink,'start')+TM(424,y+26,'£'+val.toFixed(2),14,bad?C.coral:C.green,'end');
    if(eRow>1)out+=R(438,y0+30+(eRow-1)*rh,90,rh,'#fff',C.coral,0,'stroke-dasharray="4 3"')+TF(483,y0+30+(eRow-1)*rh+25,`E${eRow}: empty`,13,C.coral);
    out+=curveArrow(392,y+12,446,y0+30+(eRow-1)*rh+rh/2,-14,bad?C.coral:C.blue,1.8)}}
  const r=f.k,row=r+2,bad=s.mode==='relative'&&r>0;
  return {svg:out,phase:r===0?'C2 multiplies the price by 1 + the VAT rate in E1: £12.00.':bad?`Copied to C${row}, the relative reference slid down to E${row-1}, which is empty, so the VAT is silently 0. The spreadsheet shows a plausible number, not an error.`:s.mode==='absolute'?`C${row} still points at $E$1: the dollar signs pin the reference while the B reference moves with the row.`:''};
 }});

const H3_ERR_SALES=[1200,1350,1100,1500,1420,1610],H3_ERR_MONTHS=['Jan','Feb','Mar','Apr','May','Jun'];
const H3_ERR_CELLS={B8:{f:'=SUM(B2:B6)',err:'The range stops at B6, so June is left out of the total.'},B9:{f:'=B8/6',err:null},C5:{f:'1210',err:'A typed number where a formula belongs: it will not update when April changes.'}};
function H3_errFormula(id){if(H3_ERR_CELLS[id])return H3_ERR_CELLS[id].f;const c=id[0],r=Number(id.slice(1));if(c==='B')return String(H3_ERR_SALES[r-2]);return r===5?'1210':`=B${r}*1.1`}
SCENE({id:'spreadsheet-errors',name:'Spreadsheet errors',tag:'Plausible numbers, hidden mistakes',
 definition:'Because a spreadsheet shows results, not formulas, errors hide behind plausible numbers. Field audits find mistakes in most large spreadsheets.',
 example:'Raymond Panko’s review found errors in most real-world spreadsheets that were audited. In 2013 a famous economics spreadsheet was found to average a range that left out five countries (Herndon, Ash & Pollin).',
 desc:'A half-year sales sheet with a total, an average and a target column; pressing a cell reveals its formula, and two cells contain errors to find.',
 research:'Panko (1998). What we know about spreadsheet errors. Journal of End User Computing 10(2) · Herndon, Ash & Pollin (2013). Does high public debt consistently stifle economic growth? Cambridge Journal of Economics.',
 dur:11,hint:'Press cells to read their formulas in the bar below the sheet. Flag the two cells that are wrong, or reveal them.',
 init:()=>({sel:null,flags:[],reveal:false}),
 watch(p){const seq=['B3','B8','C4','C5','B9'],k=Math.min(seq.length,Math.floor(p*6));return {sel:k?seq[k-1]:null,flags:[k>=2?'B8':null,k>=4?'C5':null].filter(Boolean),reveal:k>=5}},
 ui:[{b:'Flag selected cell',act:'flag'},{b:'Reveal the errors',act:'reveal'}],
 on:{sel(s,id){s.sel=id},flag(s){if(!s.sel)return;s.flags=s.flags.includes(s.sel)?s.flags.filter(x=>x!==s.sel):s.flags.concat(s.sel)},reveal(s){s.reveal=!s.reveal}},
 draw(s,f,X){
  let out=heading('Find the two mistakes');
  const y0=50,rh=27,cx=[24,90,200,310];
  out+=R(24,y0,286,rh,'#eef2f4',C.grid,0)+TBF(57,y0+19,'A',13,C.muted)+TBF(145,y0+19,'B: sales',13,C.muted)+TBF(255,y0+19,'C: target',13,C.muted);
  const total=sum(H3_ERR_SALES.slice(0,5));
  for(let i=0;i<8;i++){const r=i+2,y=y0+rh*(i+1),label=i<6?H3_ERR_MONTHS[i]:i===6?'Total':'Average';
   out+=R(24,y,66,rh,'#f6f8f9',C.grid,0)+T(32,y+19,label,13,C.ink,'start',i>=6?'font-weight="700"':'');
   for(const c of i<6?['B','C']:['B']){const id=c+r,x=c==='B'?90:200,val=c==='B'?(i<6?H3_ERR_SALES[i]:i===6?total:Math.round(total/6)):(r===5?1210:Math.round(H3_ERR_SALES[i]*1.1)),
     isErr=H3_ERR_CELLS[id]&&H3_ERR_CELLS[id].err,flagged=s.flags.includes(id),sel=s.sel===id,fill=s.reveal&&isErr?C.coralp:flagged?C.amberp:sel?C.pale:'#fff';
    out+=hit(X,'sel',id,`Cell ${id}, value ${val}. Press to see its formula.`,R(x,y,110,rh,fill,sel?C.blue:C.grid,0)+TM(x+102,y+19,val.toLocaleString('en-GB'),13,C.ink,'end')+(flagged?TBF(x+10,y+19,'⚑',13,C.amber,'start'):''))}}
  out+=R(24,y0+rh*9+8,286,30,'#fff',C.blue,6)+TMF(34,y0+rh*9+28,s.sel?`${s.sel}  ${H3_errFormula(s.sel)}`:'Press a cell to see its formula',13,C.ink,'start','xml:space="preserve"');
  const found=s.flags.filter(id=>H3_ERR_CELLS[id]&&H3_ERR_CELLS[id].err).length;
  out+=counter(330,52,'errors flagged',`${found} of 2`,found===2?C.green:C.coral,120);
  out+=R(330,112,252,190,'#fff',C.grid,8)+TBF(456,134,'From the field',13,C.ink);
  ['Panko (1998): most audited','real-world spreadsheets had errors;','about 1–5% of formula cells.','','A 2013 audit of a famous','economics sheet found an average','that missed five countries.'].forEach((t,i)=>out+=TF(342,156+i*19,t,13,C.muted,'start'));
  const e=s.sel&&H3_ERR_CELLS[s.sel]&&H3_ERR_CELLS[s.sel].err;
  return {svg:out,phase:s.reveal?'B8 sums only January to May, and C5 holds a typed 1210 instead of =B5*1.1. Both look reasonable; neither is visible without inspecting formulas.':e&&(s.flags.includes(s.sel)||!X.try)?e:s.sel?`${s.sel} contains ${H3_errFormula(s.sel)}.`:'Results look right at a glance. The mistakes are in the formulas, which the grid hides.'};
 }});

/* ---------------- wysiwyg ---------------- */
const H3_WORDS=['The','quick','brown','fox','jumps','over','the','lazy','dog.'];
function H3_wrap(items,width,measure){const lines=[[]];let w=0;for(const it of items){const m=measure(it);if(w+m>width&&lines[lines.length-1].length){lines.push([]);w=0}lines[lines.length-1].push(it);w+=m}return lines}
SCENE({id:'wysiwyg',name:'What you see is what you get',tag:'Appearance instead of codes',
 definition:'In a WYSIWYG editor the screen shows the document as it will print, and you style text by acting on it. Markup systems instead store formatting as codes you type around the text.',
 example:'Bravo, written at Xerox PARC in 1974, was the first WYSIWYG editor. Markup systems such as Scribe (1980) kept formatting as codes like @b[quick], which only became visible when printed.',
 desc:'The same short document twice: as markup codes on the left and as formatted text on the right; styling a word changes both.',
 research:'Lampson & Simonyi (1974). Bravo, the first WYSIWYG editor, Xerox PARC · Reid (1980). Scribe: a document specification language and its compiler. PhD thesis, Carnegie Mellon.',
 dur:11,hint:'Press a word in the formatted view, then make it bold or italic. Toggle the heading. Watch the markup change.',
 init:()=>({st:H3_WORDS.map(()=>({b:0,i:0})),sel:1,head:true}),
 watch(p){const steps=[[1,'b'],[3,'i'],[7,'i'],[8,'b']],k=Math.min(4,Math.floor(p*5));const st=H3_WORDS.map(()=>({b:0,i:0}));for(let j=0;j<k;j++)st[steps[j][0]][steps[j][1]]=1;return {st,sel:k?steps[k-1][0]:null,head:p>.1}},
 ui:[{b:'Bold',act:'style',arg:'b'},{b:'Italic',act:'style',arg:'i'},{b:'Heading on/off',act:'head'}],
 on:{sel(s,i){s.sel=Number(i)},style(s,k){if(s.sel===null)return;s.st[s.sel][k]^=1},head(s){s.head=!s.head}},
 draw(s,f,X){
  let out=heading('The same document, two ways');
  out+=R(20,48,272,262,'#1f2b31','none',8)+TBF(156,70,'Markup (codes)',13,'#9fd6bd')+R(308,48,272,262,'#fff',C.grid,8)+TBF(444,70,'WYSIWYG (appearance)',13,C.blue);
  const tokens=[];if(s.head)tokens.push('@heading[Notes]','¶');H3_WORDS.forEach((w,i)=>{let t=w;if(s.st[i].i)t=`@i[${t}]`;if(s.st[i].b)t=`@b[${t}]`;tokens.push(t)});
  const ml=H3_wrap(tokens,240,t=>t==='¶'?999:(t.length+1)*7.9);ml.forEach((ln,j)=>out+=TMF(32,98+j*24,ln.filter(t=>t!=='¶').join(' '),13,'#e3f2ea','start'));
  let y=98;if(s.head){out+=TB(322,y+8,'Notes',24,C.ink,'start');y+=46}
  const k19=textSize(19,'',0,'start')/19,items=H3_WORDS.map((w,i)=>({w,i})),lines=H3_wrap(items,240,it=>(it.w.length+1)*(s.st[it.i].b?11.2:10.2)*k19);
  lines.forEach((ln,j)=>{let x=322;ln.forEach(it=>{const st=s.st[it.i],wd=it.w.length*(st.b?11.2:10.2)*k19,sel=s.sel===it.i;
   out+=hit(X,'sel',it.i,`Word ${it.w}${st.b?', bold':''}${st.i?', italic':''}. Press to select.`,R(x-3,y+j*32-20,wd+6,28,sel?C.amberp:'transparent',sel?C.amber:'none',4)+T(x,y+j*32,it.w,19,C.ink,'start',`${st.b?'font-weight="700"':''} ${st.i?'font-style="italic"':''}`));x+=wd+10})});
  out+=TF(300,336,'Markup is exact and portable; WYSIWYG shows the result as you work.',13,C.muted);
  const w=s.sel!==null?H3_WORDS[s.sel]:null;
  return {svg:out,phase:w?`“${w}” is ${s.st[s.sel].b||s.st[s.sel].i?'styled':'plain'}. In the WYSIWYG view you act on the word itself; in markup the same change wraps it in codes you must type and match exactly.`:'Two views of one document. WYSIWYG removes a translation step between what you mean and what you see.'};
 }});

// Glyph 'A' as two even–odd polygons in a unit box; coverage is sampled per pixel.
const H3_GLYPH=[[[.08,1],[.42,0],[.58,0],[.92,1],[.72,1],[.64,.76],[.36,.76],[.28,1]],[[.42,.58],[.5,.3],[.58,.58]]];
function H3_inGlyph(x,y){let inside=false;for(const poly of H3_GLYPH)for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,yi]=poly[i],[xj,yj]=poly[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside}return inside}
function H3_coverage(n,aa){const g=[];for(let r=0;r<n;r++){g.push([]);for(let c=0;c<n;c++){if(!aa){g[r].push(H3_inGlyph((c+.5)/n,(r+.5)/n)?1:0);continue}let k=0;for(let a=0;a<4;a++)for(let b=0;b<4;b++)if(H3_inGlyph((c+(a+.5)/4)/n,(r+(b+.5)/4)/n))k++;g[r].push(k/16)}}return g}
SCENE({id:'wysiwyg-bitmap-fonts',name:'Bitmap fonts and anti-aliasing',tag:'Letters made of pixels',
 definition:'On a bitmap display every letter becomes a grid of pixels. Smooth outlines must be rounded to whole pixels, which makes small text jagged unless edge pixels are shaded grey (anti-aliasing).',
 example:'At 8 pixels tall the letter A is a rough staircase. Shading each edge pixel by how much of it the outline covers fools the eye into seeing a smoother edge.',
 desc:'A letter A drawn as a vector outline over a pixel grid, with each pixel filled black or white, or shaded by coverage when anti-aliasing is on, plus an actual-size preview.',
 research:'Crow (1977). The aliasing problem in computer-generated shaded images. Communications of the ACM 20(11) · Knuth (1979). TEX and METAFONT: New Directions in Typesetting.',
 dur:11,hint:'Change the letter’s size in pixels and switch anti-aliasing on or off.',
 init:()=>({n:10,aa:false}),
 watch(p){return {n:6+Math.round((p<.5?p*2:(p-.5)*2)*14),aa:p>=.5}},
 ui:[{range:'n',label:'Height in pixels',min:5,max:32,get:s=>s.n,act:'n'},{choose:[['off','Anti-aliasing off'],['on','Anti-aliasing on']],label:'Anti-aliasing',get:s=>s.aa?'on':'off',act:'aa'}],
 on:{n(s,v){s.n=v},aa(s,v){s.aa=v==='on'}},
 draw(s){
  const n=s.n,g=H3_coverage(n,s.aa),box=280,px=box/n,x0=36,y0=56;let out=heading(`The letter A at ${n} pixels tall`);
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){const v=g[r][c],shade=Math.round(255-v*230);out+=`<rect x="${fmt(x0+c*px)}" y="${fmt(y0+r*px)}" width="${fmt(px)}" height="${fmt(px)}" fill="rgb(${shade},${shade},${Math.min(255,shade+6)})" stroke="#d5dee4" stroke-width="${n>20?.4:.8}"/>`}
  out+=H3_GLYPH.map(poly=>`<polygon points="${poly.map(([a,b])=>fmt(x0+a*box)+','+fmt(y0+b*box)).join(' ')}" fill="none" stroke="${C.coral}" stroke-width="2"/>`).join('');
  out+=TF(x0+box/2,y0+box+22,'coral: the ideal outline · grey squares: pixels',13,C.muted);
  out+=TB(480,70,'Actual size ×3',14,C.ink);const sc=3,ax=480-n*sc/2,ay=86;
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){const v=g[r][c];if(v>0){const sh=Math.round(255-v*230);out+=`<rect x="${ax+c*sc}" y="${ay+r*sc}" width="${sc}" height="${sc}" fill="rgb(${sh},${sh},${sh})"/>`}}
  const grey=g.flat().filter(v=>v>0&&v<1).length;
  out+=R(360,210,224,92,'#fff',C.grid,8)+TF(472,234,`${n} × ${n} = ${n*n} pixels`,13,C.ink)+TF(472,256,s.aa?`${grey} edge pixels shaded grey`:'every pixel is black or white',13,s.aa?C.blue:C.muted)+TF(472,278,s.aa?'edges look smoother':'edges are a staircase',13,s.aa?C.green:C.coral);
  return {svg:out,phase:s.aa?'Each edge pixel takes a grey level equal to how much of it the outline covers (sampled 16 times). The shape is blurrier up close but smoother at normal viewing distance.':'Each pixel is simply on if its centre is inside the outline. At small sizes, rounding to whole pixels distorts the strokes: a staircase on every diagonal.'};
 }});

const H3_MENUS={File:['New','Open','Save','Print'],Edit:['Undo','Cut','Copy','Paste'],View:['Zoom in','Zoom out','Grid','Rulers']};
const H3_APPS=['Writer','Painter','Mailer'],H3_TARGETS=['Copy','Save','Print','Paste','Undo','Zoom in'];
function H3_appMenus(app,mode){const names=Object.keys(H3_MENUS);if(mode==='consistent')return names.map(n=>[n,H3_MENUS[n]]);const order=shuffled(names,11+app*7);return order.map((n,j)=>[n,shuffled(H3_MENUS[n],23+app*5+j)])}
let H3_consRand=rng(57);
SCENE({id:'wysiwyg-consistency',name:'Consistency and guidelines',tag:'Same command, same place',
 definition:'Consistency means the same command works the same way, in the same place, across every application. Platform guidelines made it a rule, so skills learned in one program transfer to the next.',
 example:'Because File, Edit and View menus sit in the same order in every application, people find Copy without looking. Shuffle them per program and every program must be learned anew.',
 desc:'Three applications’ menus, laid out consistently or shuffled; in Try it you find named commands and your search times are compared.',
 research:'Apple Computer (1987). Human Interface Guidelines: The Apple Desktop Interface. Addison-Wesley · Nielsen (ed.) (1989). Coordinating User Interfaces for Consistency. Academic Press.',
 dur:11,hint:'Choose consistent or shuffled menus, press Next trial, then find the named command. Compare your mean times.',
 init:()=>({mode:'consistent',app:0,target:null,start:0,trials:[]}),
 watch(p){const k=Math.min(3,Math.floor(p*4));return {mode:'both',target:['Copy','Save','Zoom in','Paste'][k],trials:[]}},
 ui:[{choose:[['consistent','Consistent'],['shuffled','Shuffled']],label:'Layout',get:s=>s.mode,act:'mode'},{b:'Next trial',act:'next'}],
 on:{mode(s,v){s.mode=v;s.target=null},next(s){s.app=Math.floor(H3_consRand()*3);s.target=H3_TARGETS[Math.floor(H3_consRand()*H3_TARGETS.length)];s.start=performance.now()},
  pick(s,cmd){if(!s.target)return;s.trials.push({mode:s.mode,ms:Math.round(performance.now()-s.start),ok:cmd===s.target});s.target=null}},
 draw(s,f,X){
  let out='';
  if(s.mode==='both'){out+=heading(`Where is “${s.target}”?`);
   ['consistent','shuffled'].forEach((mode,row)=>{const y=row?206:58;out+=TBF(24,y+8,mode==='consistent'?'Consistent':'Shuffled per application',13,mode==='consistent'?C.green:C.coral,'start');
    H3_APPS.forEach((a,ai)=>{const x=24+ai*190;out+=R(x,y+16,180,124,'#fff',C.grid,6)+TBF(x+90,y+32,a,13,C.ink);
     H3_appMenus(ai,mode).forEach(([m,items],j)=>{const mx=x+4+j*58;out+=TBF(mx+28,y+50,m,13,C.muted);items.forEach((it,k)=>{const on=it===s.target;out+=R(mx,y+56+k*20,56,18,on?C.amberp:'#fff',on?C.amber:'none',3)+TF(mx+28,y+70+k*20,it,13,C.ink)})})})});
   return {svg:out,phase:`With consistent menus “${s.target}” sits in the same spot in all three applications, so the skill transfers. Shuffled, its place changes every time and must be searched for.`}}
  const menus=H3_appMenus(s.app,s.mode);out+=heading(s.target?`In ${H3_APPS[s.app]}, find “${s.target}”`:'Press Next trial to start');
  out+=R(40,48,520,236,'#fff',C.dark,4)+R(40,48,520,24,'#eef2f4',C.dark,4)+TBF(300,65,H3_APPS[s.app],13,C.ink);
  menus.forEach(([m,items],j)=>{const mx=56+j*168;out+=TB(mx+70,96,m,15,C.muted);items.forEach((it,k)=>{const cell=R(mx,106+k*40,140,34,'#f8fafb',C.grid,5)+T(mx+70,128+k*40,it,15,C.ink);out+=s.target?hit(X,'pick',it,`Menu item ${it}`,cell):cell})});
  const mean=m=>{const a=s.trials.filter(r=>r.mode===m&&r.ok);return a.length?Math.round(sum(a.map(r=>r.ms))/a.length)+' ms ('+a.length+')':'—'};
  out+=TF(300,316,`Your mean: consistent ${mean('consistent')} · shuffled ${mean('shuffled')}`,14,C.ink);
  const errs=s.trials.filter(r=>!r.ok).length;if(errs)out+=TF(300,338,`${errs} wrong pick${errs>1?'s':''}`,13,C.coral);
  const last=s.trials[s.trials.length-1];
  return {svg:out,phase:last?`Last search: ${last.ms} ms${last.ok?'':', wrong item'}. With consistent menus your eyes learn where things are; shuffled menus force a fresh visual search each time.`:'Each application here uses the same three menus. Choose whether they keep one shared layout or each application arranges its own.'};
 }});
