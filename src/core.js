(function(){
'use strict';
/* ===========================================================================
 Computer Science In Motion — v0.1. One offline file: no network, no libraries.

 SCENE API (every term is one scene; see SCENE() calls below)
   id, name, tag, definition, example, desc      text shown beside the diagram
   dur        seconds of playback for this scene (default 8)
   init()     -> state      default input: used for Watch and for Try it's reset
   watch(p)   -> state      optional; state as a pure function of p in [0,1]
                            (only for scenes without trace)
   trace(s)   -> [frame]    optional; discrete steps (each frame may carry .say)
   draw(s,f,X)-> {svg,phase}  pure: same (s,f,X) gives the same picture
                 X = {p, try, k, n, u}: time, mode, step index, step count, tween
   ui: [...]  Try it controls: {b:'Label',act}, {range,label,min,max,step,get,act},
              {text,label,get,act,max}, {choose:[[value,label]],get,act}
   on: {act(s,arg,ctx)}  handlers for buttons and for SVG [data-act] targets.
              Return 'keep' to keep the step position; 'end' to jump to the last
              step; 'run' to start running; otherwise steps restart at 0.
   shared     optional key: scenes with the same key share one Try it state.
   hint       one line telling the learner what they can change.
 Watch mode is deterministic: a scene's picture depends only on lesson time.
 Try it mode is driven only by the learner's state and step position.

 HCI ADDITIONS
   research   string or [strings]: the original study, demo or book behind the scene, shown as
              "Research: Author (year) …". Cite only real, checkable work.
   year       on a LESSON: the date or decade shown in the eyebrow (e.g. '1954').
   Experiments: in Try it the learner can be the participant. on() handlers may read
   performance.now() to time responses and store results in the state; draw() stays pure.
   For delays use the handler's ctx: ctx.later(ms,act,arg) and ctx.every(ms,act,arg) (stops when the
   handler returns 'stop'); both are cancelled when the scene or mode changes.
   Use rng()/shuffled()/nextSeed() for trial order, never Math.random.

 SOUND (from Music In Motion)
   Sound comes from AUDIO (below): only on the learner's action, gentle volumes, stopped on scene/mode change.
   Pictures stay deterministic; a scene never needs sound to be understood (captions say what you would hear).
   Notes: midiHz(m), noteName(m); 12-tone equal temperament unless a scene is about tuning.

 INTERACTION DESIGN NOTE: every scene lets the learner operate the structure Nelson described, rather than read
   about it. Roots: tie memex items into trails, file one card in many places. Hypertext: zip an outline to a
   draft, choose a route through a film, compare versions word by word. Systems: fold an NLS outline, chord
   on a keyset, annotate a poem in FRESS, stretch a paragraph. Computer Lib: flip the two-sided book, sort
   cybercrud from real limits, merge drafts. Xanadu: build an essay from transclusions, link both ways,
   address by tumbler. Web: watch one-way links rot and pages drift. Later: steer a ZigZag cursor along
   chosen dimensions, follow transclusion beams. Legacy: find your way with and without a map, rank pages by
   backlinks, address content by its hash. Accounts that differ (Wired 1995) are shown side by side.
=========================================================================== */
const $=id=>document.getElementById(id);
const C={ink:'#192c37',muted:'#546873',blue:'#1772b7',pale:'#e1eef7',line:'#abc3d3',coral:'#c45238',coralp:'#f9e2d9',green:'#2c776c',greenp:'#dceee8',purple:'#7156a6',purplep:'#ece6f6',amber:'#9a6200',amberp:'#fbefd5',paper:'#ffffff',grid:'#d9e4eb',dark:'#2b3d47'};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=v=>{v=clamp(v,0,1);return v*v*(3-2*v)};
const lerp=(a,b,u)=>a+(b-a)*u;
const fmt=n=>Math.abs(Number(n))<.005?'0':Number(n).toFixed(2).replace(/\.?0+$/,'');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const range=n=>Array.from({length:n},(_,i)=>i);
const sum=a=>a.reduce((x,y)=>x+y,0);
const pad=(s,n,c='0')=>String(s).padStart(n,c);
const bin=(v,n)=>pad((v>>>0).toString(2),n).slice(-n);
const hex=(v,n=2)=>pad(v.toString(16).toUpperCase(),n);
// A fixed pseudo-random generator: the same seed always gives the same "random" data.
function rng(seed){let x=seed>>>0||1;return ()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x/4294967296}}
function shuffled(a,seed){const r=rng(seed),b=a.slice();for(let i=b.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
let shuffleSeed=11;const nextSeed=()=>(shuffleSeed=(shuffleSeed*48271)%2147483647);

/* ---- SVG primitives (viewBox 600×380) ---- */
// Diagram text scale (as in Mathematics In Motion): on narrow screens the 600-wide drawing shrinks,
// so labels are enlarged to stay readable. Small labels grow fully; large ones by a bounded amount.
let TS=1;
function textSize(size,s,x,anchor){
 let z=TS===1?size:size<=15?size*TS:size+15*(TS-1);
 // A centred full-width line shrinks back to fit inside the drawing rather than overflow it.
 if(x===300&&anchor==='middle'){const est=String(s).length*z*.56;if(est>580)z=Math.max(size,z*580/est)}
 return Math.round(z*10)/10;
}
const T=(x,y,s,size=16,fill=C.ink,anchor='middle',extra='')=>`<text x="${fmt(x)}" y="${fmt(y)}" font-size="${textSize(size,s,x,anchor)}" fill="${fill}" text-anchor="${anchor}" ${extra}>${esc(s)}</text>`;
const TB=(x,y,s,size=16,fill=C.ink,anchor='middle',extra='')=>T(x,y,s,size,fill,anchor,'font-weight="700" '+extra);
// Fixed-size text: for tightly packed labels (digit stacks, side legends, dense tables) that must not grow on phones.
const unscaled=fn=>(...a)=>{const o=TS;TS=1;try{return fn(...a)}finally{TS=o}};
const TM=(x,y,s,size=16,fill=C.ink,anchor='middle',extra='')=>T(x,y,s,size,fill,anchor,'class="mono" '+extra);
const TF=unscaled(T),TBF=unscaled(TB),TMF=unscaled(TM);
const R=(x,y,w,h,fill=C.pale,stroke='none',rx=8,extra='')=>`<rect x="${fmt(x)}" y="${fmt(y)}" width="${fmt(Math.max(0,w))}" height="${fmt(Math.max(0,h))}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="2" ${extra}/>`;
const L=(x1,y1,x2,y2,stroke=C.line,w=2,extra='')=>`<line x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;
const Ci=(x,y,r,fill=C.blue,stroke='none',extra='')=>`<circle cx="${fmt(x)}" cy="${fmt(y)}" r="${fmt(r)}" fill="${fill}" stroke="${stroke}" stroke-width="2" ${extra}/>`;
const P=(d,stroke=C.blue,w=2,fill='none',extra='')=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const G=(inner,extra='')=>`<g ${extra}>${inner}</g>`;
function arrow(x1,y1,x2,y2,col=C.blue,w=2.5,head=9,extra=''){
 const dx=x2-x1,dy=y2-y1,d=Math.hypot(dx,dy);if(d<1)return '';
 const ux=dx/d,uy=dy/d,bx=x2-ux*head,by=y2-uy*head;
 return L(x1,y1,bx,by,col,w,extra)+`<polygon points="${fmt(x2)},${fmt(y2)} ${fmt(bx-uy*head*.55)},${fmt(by+ux*head*.55)} ${fmt(bx+uy*head*.55)},${fmt(by-ux*head*.55)}" fill="${col}"/>`;
}
// Arrow between two circles of radius r (stops at the rims).
function arrowR(a,b,r1,r2,col=C.blue,w=2.5){const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1;return arrow(a[0]+dx/d*r1,a[1]+dy/d*r1,b[0]-dx/d*r2,b[1]-dy/d*r2,col,w)}
// Curved arrow (quadratic) with a bend; returns svg.
function curveArrow(x1,y1,x2,y2,bend=30,col=C.blue,w=2.2){
 const mx=(x1+x2)/2,my=(y1+y2)/2,dx=x2-x1,dy=y2-y1,d=Math.hypot(dx,dy)||1,cx=mx-dy/d*bend,cy=my+dx/d*bend;
 const tx=x2-cx,ty=y2-cy,td=Math.hypot(tx,ty)||1,ux=tx/td,uy=ty/td,h=8,bx=x2-ux*h,by=y2-uy*h;
 return P(`M${fmt(x1)} ${fmt(y1)} Q${fmt(cx)} ${fmt(cy)} ${fmt(bx)} ${fmt(by)}`,col,w)+`<polygon points="${fmt(x2)},${fmt(y2)} ${fmt(bx-uy*h*.55)},${fmt(by+ux*h*.55)} ${fmt(bx+uy*h*.55)},${fmt(by-ux*h*.55)}" fill="${col}"/>`;
}
const heading=(s,y=30)=>T(300,y,s,18,C.ink,'middle','font-weight="650"');
// A labelled box with centred text.
function box(x,y,w,h,label,fill=C.pale,ink=C.ink,size=17,stroke='none',mono=false,rx=8){
 return R(x,y,w,h,fill,stroke,rx)+(mono?TM:T)(x+w/2,y+h/2+size*.36,label,size,ink);
}
// Interactive wrapper: in Try it mode a target becomes a focusable button.
function hit(X,act,arg,label,inner){
 if(!X||!X.try)return inner;
 return `<g class="hit" data-act="${esc(act)}" data-arg="${esc(arg)}" data-key="${esc(act+':'+arg)}" tabindex="0" role="button" aria-label="${esc(label)}">${inner}</g>`;
}
// A row of bit cells; returns svg. bits: array of 0/1, highlight: optional set of indices.
function bitRow(X,bits,x0,y,w,act,opts={}){
 const h=opts.h||w,gap=opts.gap||6;let out='';
 bits.forEach((b,i)=>{const x=x0+i*(w+gap),on=!!b,hl=opts.hl&&opts.hl.includes(i);
  const inner=R(x,y,w,h,on?(opts.on||C.blue):'#fff',hl?C.coral:(on?(opts.on||C.blue):C.line),7)+TM(x+w/2,y+h/2+h*.17,on?'1':'0',Math.round(h*.48),on?'#fff':C.muted,'middle','font-weight="700"');
  out+=act?hit(X,act,i,`Bit ${i+1}: ${on?1:0}. Press to flip.`,inner):inner;
 });
 return out;
}
// Vertical bars for sorting-style arrays.
function bars(vals,x0,base,w,scale,colour,label=true){let out='';vals.forEach((v,i)=>{const col=typeof colour==='function'?colour(i,v):colour;out+=R(x0+i*w+3,base-v*scale,w-6,v*scale,col,'none',4);if(label)out+=T(x0+i*w+w/2,base+18,v,14,C.muted)});return out}
// Graph drawing: nodes {id:[x,y]}, edges [[a,b,w?]], styles via callbacks.
function graphSVG(X,nodes,edges,o={}){
 let out='';const r=o.r||20;
 for(const e of edges){const a=nodes[e[0]],b=nodes[e[1]],st=o.edge?o.edge(e):{};
  if(o.directed)out+=arrowR(a,b,r,r+2,st.col||C.line,st.w||2.5);else out+=L(a[0],a[1],b[0],b[1],st.col||C.line,st.w||2.5,st.extra||'');
  if(e[2]!==undefined&&o.weights!==false){const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2;const wi=R(mx-13,my-12,26,22,'#fff',st.col||C.line,6)+T(mx,my+5,e[2],14,C.ink);out+=o.edgeAct?hit(X,o.edgeAct,e[0]+'-'+e[1],`Edge ${e[0]} to ${e[1]}, weight ${e[2]}. Press to change.`,wi):wi}
 }
 for(const id in nodes){const [x,y]=nodes[id],st=o.node?o.node(id):{};
  const inner=Ci(x,y,r,st.fill||'#fff',st.stroke||C.blue)+T(x,y+6,st.label||id,st.size||17,st.ink||C.ink,'middle','font-weight="650"');
  out+=o.nodeAct?hit(X,o.nodeAct,id,st.aria||`Node ${id}`,inner):inner;
  if(st.badge)out+=T(x,y+r+17,st.badge,13,st.badgeInk||C.muted);
 }
 return out;
}
// A small "counter" tile used for live counts (comparisons, steps, hops…).
function counter(x,y,label,value,col=C.blue,w=120){return R(x,y,w,46,'#fff',C.grid,8)+TF(x+w/2,y+17,label,12,C.muted)+TBF(x+w/2,y+38,value,17,col)}

/* ---- Projected 3D (as in Mathematics In Motion): plain SVG, no WebGL. ----
 A scene opts in with three(s,f,X,project) -> {svg, caption, title}. Call project(bounds) with a list of
 [x,y,z] points (or [x0,x1,y0,y1,z0,z1]) to get P: [x,y,z] -> [sx,sy,depth] fitted to the panel,
 using the shared camera, which the learner turns by dragging. z is up. */
let camera={yaw:.62,pitch:.55};
function makeProject(bounds){
 const raw=([x,y,z])=>{const a=x*Math.cos(camera.yaw)-y*Math.sin(camera.yaw),b=x*Math.sin(camera.yaw)+y*Math.cos(camera.yaw);return [a,-b*Math.sin(camera.pitch)-z*Math.cos(camera.pitch),-b*Math.cos(camera.pitch)+z*Math.sin(camera.pitch)]};
 const pts=[];if(Array.isArray(bounds[0])){for(const point of bounds)pts.push(raw(point))}else{for(const x of [bounds[0],bounds[1]])for(const y of [bounds[2],bounds[3]])for(const z of [bounds[4],bounds[5]])pts.push(raw([x,y,z]))}
 const xs=pts.map(v=>v[0]),ys=pts.map(v=>v[1]),xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys),scale=Math.min(440/(xmax-xmin||1),270/(ymax-ymin||1));
 return a=>{const q=raw(a);return [300+(q[0]-(xmin+xmax)/2)*scale,196+(q[1]-(ymin+ymax)/2)*scale,q[2]]};
}
const label3=(x,y,value,size=16,fill=C.ink,extra='')=>T(x,y,value,size,fill,'middle',extra);
function line3(a,b,P,colour=C.line,width=2,extra=''){const p=P(a),q=P(b);return L(p[0],p[1],q[0],q[1],colour,width,extra)}
function arrow3(a,b,P,colour=C.blue,width=3){const p=P(a),q=P(b);return arrow(p[0],p[1],q[0],q[1],colour,width)}
function point3(a,P,colour=C.blue,r=6,stroke='none'){const p=P(a);return Ci(p[0],p[1],r,colour,stroke)}
function poly3(points,P,fill,stroke=C.line,extra=''){return `<polygon points="${points.map(v=>P(v).slice(0,2).map(fmt).join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="1.4" stroke-linejoin="round" ${extra}/>`}
// A box as six faces; paintFaces draws faces back to front.
function prism(x,y,z,dx,dy,dz,col=C.blue,extra=''){
 const a=[x,y,z],b=[x+dx,y,z],c=[x+dx,y+dy,z],d=[x,y+dy,z],A=[x,y,z+dz],B=[x+dx,y,z+dz],D=[x,y+dy,z+dz],E=[x+dx,y+dy,z+dz];
 return [{pts:[a,b,c,d],fill:col},{pts:[a,b,B,A],fill:col},{pts:[b,c,E,B],fill:col},{pts:[c,d,D,E],fill:col},{pts:[d,a,A,D],fill:col},{pts:[A,B,E,D],fill:col}].map((f,i)=>({...f,opacity:i===5?1:i===2?.78:.64,extra}));
}
function tint(hex,amount){if(hex.length===4)hex='#'+hex.slice(1).split('').map(c=>c+c).join('');const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));return '#'+rgb.map(v=>Math.round(v+(255-v)*amount).toString(16).padStart(2,'0')).join('')}
function paintFaces(faces,P){return faces.map(f=>({...f,depth:f.pts.reduce((a,p)=>a+P(p)[2],0)/f.pts.length})).sort((a,b)=>a.depth-b.depth).map(f=>{
 let out=poly3(f.pts,P,tint(f.fill,f.opacity===undefined?0:(1-f.opacity)*.8),f.stroke||'#6c8d9f',f.extra||'');
 if(f.label!==undefined){const mid=f.pts.reduce((a,v)=>a.map((q,i)=>q+v[i]/f.pts.length),[0,0,0]),p=P(mid);out+=label3(p[0],p[1]+6,f.label,f.size||17,f.ink||C.ink,'font-weight="650"')}
 return out;
}).join('')}
// Depth-sorted mixed items: [{at:[x,y,z], svg:(P)=>string}] drawn back to front (for spheres, labels, nodes).
function sortedItems(items,P){return items.map(it=>({...it,d:P(it.at)[2]})).sort((a,b)=>a.d-b.d).map(it=>it.svg(P)).join('')}
function axes3(P,labels=['x','y','z'],end=[3,3,3],from=[0,0,0]){
 let out='';[[end[0],from[1],from[2]],[from[0],end[1],from[2]],[from[0],from[1],end[2]]].forEach((a,i)=>{out+=arrow3(from,a,P,C.muted,1.7);const q=P(a);out+=label3(q[0]+(i===0?15:i===1?-17:0),q[1]+(i===2?-12:20),labels[i],15,C.muted)});
 return out;
}

/* ---- Sound (Music In Motion): a small offline synthesiser on the Web Audio API. ----
 Sound plays only in response to the learner (Try it buttons, presses on the diagram) or a Watch scene's
 explicit "hear it" control, never on its own. Everything stops on scene or mode change and with Mute.
 AUDIO.tone(hz,{dur,type,gain,at,partials,attack,release}) · AUDIO.chord([hz…],opts) · AUDIO.seq([{hz,at,dur}…],opts)
 AUDIO.noise({dur,gain,at}) · AUDIO.stopAll() · AUDIO.now() (seconds, for scheduling) · midiHz(m) · noteName(m)
 partials: array of harmonic amplitudes [1,.5,.33…] for timbre (a PeriodicWave). Volumes are kept gentle. */
const midiHz=m=>440*Math.pow(2,(m-69)/12);
const NOTE_NAMES=['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
const noteName=m=>NOTE_NAMES[((Math.round(m)%12)+12)%12]+(Math.floor(Math.round(m)/12)-1);
const AUDIO={ctx:null,muted:false,nodes:new Set(),master:null,
 get(){if(this.muted)return null;try{if(!this.ctx){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;this.ctx=new A();this.master=this.ctx.createGain();this.master.gain.value=.8;this.master.connect(this.ctx.destination)}if(this.ctx.state==='suspended')this.ctx.resume();return this.ctx}catch(_){return null}},
 now(){const c=this.get();return c?c.currentTime:0},
 _env(c,g,t0,dur,gain,attack,release){g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(gain,t0+attack);g.gain.setValueAtTime(gain,t0+Math.max(attack,dur-release));g.gain.linearRampToValueAtTime(0,t0+dur)},
 tone(hz,o={}){const c=this.get();if(!c||!(hz>0))return;const {dur=.6,type='sine',gain=.16,at=0,attack=.01,release=.18,partials=null}=o;
  try{const t0=c.currentTime+at,osc=c.createOscillator(),g=c.createGain();
   if(partials){const re=new Float32Array(partials.length+1),im=new Float32Array(partials.length+1);partials.forEach((a,i)=>im[i+1]=a);osc.setPeriodicWave(c.createPeriodicWave(re,im))}else osc.type=type;
   osc.frequency.setValueAtTime(hz,t0);this._env(c,g,t0,dur,Math.min(gain,.35),attack,Math.min(release,dur/2));osc.connect(g);g.connect(this.master);osc.start(t0);osc.stop(t0+dur+.02);
   this.nodes.add(osc);osc.onended=()=>this.nodes.delete(osc)}catch(_){}},
 chord(hzs,o={}){const g=(o.gain||.16)/Math.max(1,Math.sqrt(hzs.length));hzs.forEach(h=>this.tone(h,{...o,gain:g}))},
 seq(notes,o={}){for(const n of notes)this.tone(n.hz,{...o,...n,at:(o.at||0)+(n.at||0)})},
 noise(o={}){const c=this.get();if(!c)return;const {dur=.08,gain=.12,at=0}=o;try{const len=Math.max(1,Math.floor(c.sampleRate*dur)),buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0),r=rng(len);for(let i=0;i<len;i++)d[i]=(r()*2-1)*(1-i/len);
  const src=c.createBufferSource(),g=c.createGain();src.buffer=buf;g.gain.value=Math.min(gain,.3);src.connect(g);g.connect(this.master);src.start(c.currentTime+at);this.nodes.add(src);src.onended=()=>this.nodes.delete(src)}catch(_){}},
 stopAll(){for(const n of this.nodes){try{n.stop()}catch(_){}}this.nodes.clear()},
 setMuted(m){this.muted=m;if(m)this.stopAll()}};

const SCENES={};
function SCENE(def){if(SCENES[def.id])console.warn('Duplicate scene',def.id);SCENES[def.id]=def}
/* Lessons are registered by each stage file, in route order:
   LESSON({id,name,short,stage,why,prior:[lesson ids],level,references:[source keys],ids:[scene ids]}).
   THREAD({id,name,ids:[scene ids]}) adds an up/down connection on the local map. */
const LESSONS=[],EXTRA_THREADS=[];
function LESSON(def){if(LESSONS.some(l=>l.id===def.id))console.warn('Duplicate lesson',def.id);LESSONS.push(def)}
function THREAD(def){EXTRA_THREADS.push(def)}
// Further reading for a lesson's references: SOURCE('fitts-1954',{title:'…',url:'…'}).
const SOURCES={};
function SOURCE(key,def){SOURCES[key]=def}
// Glossary entries live beside the scenes that use them: WORD({key,title,aliases,here,contrast,example,linkContext,scene?}).
const GLOSSARY=[];
function WORD(...entries){for(const e of entries){if(GLOSSARY.some(g=>g.key===e.key)){console.warn('Duplicate word',e.key);continue}GLOSSARY.push(e)}}
