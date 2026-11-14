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
const T=(x,y,s,size=16,fill=C.ink,anchor='middle',extra='')=>`<text x="${fmt(x)}" y="${fmt(y)}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" ${extra}>${esc(s)}</text>`;
const TB=(x,y,s,size=16,fill=C.ink,anchor='middle',extra='')=>T(x,y,s,size,fill,anchor,'font-weight="700" '+extra);
const TM=(x,y,s,size=16,fill=C.ink,anchor='middle',extra='')=>T(x,y,s,size,fill,anchor,'class="mono" '+extra);
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
function counter(x,y,label,value,col=C.blue,w=120){return R(x,y,w,46,'#fff',C.grid,8)+T(x+w/2,y+17,label,12,C.muted)+TB(x+w/2,y+38,value,17,col)}

const SCENES={};
function SCENE(def){if(SCENES[def.id])console.warn('Duplicate scene',def.id);SCENES[def.id]=def}
// Glossary entries live beside the scenes that use them: WORD({key,title,aliases,here,contrast,example,linkContext,scene?}).
const GLOSSARY=[];
function WORD(...entries){for(const e of entries){if(GLOSSARY.some(g=>g.key===e.key)){console.warn('Duplicate word',e.key);continue}GLOSSARY.push(e)}}
