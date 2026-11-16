/* ===================== Biology era 5 · Energy and chemistry ===================== */
// Enzymes, membranes and pumps, photosynthesis, respiration and ATP, homeostasis and scaling laws.
// Most scenes are small deterministic models the learner steers; classic experiments are rerun on screen.
// Every picture is a pure function of state, frame and X; any scatter comes from seeded generators.
const B5_mix=n=>{let x=(n+0x9e3779b9)>>>0;x=Math.imul(x^(x>>>16),0x85ebca6b)>>>0;x=Math.imul(x^(x>>>13),0xc2b2ae35)>>>0;return ((x^(x>>>16))>>>0)||1};
const B5_rng=n=>rng(B5_mix(n));
function B5_gauss(r){const u=Math.max(1e-9,r()),v=r();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
const B5_poly=(pts,col,w=2.2,extra='')=>pts.length?P('M'+pts.map(p=>fmt(p[0])+' '+fmt(p[1])).join(' L'),col,w,'none',extra):'';
const B5_num=(v,d=1)=>Number(v).toFixed(d);
// Plot frame: returns {svg, X, Y} mapping data to drawing units.
function B5_plot(x0,y0,w,h,xr,yr,o={}){
 const X=v=>x0+(v-xr[0])/(xr[1]-xr[0])*w,Y=v=>y0+h-(v-yr[0])/(yr[1]-yr[0])*h;
 let svg=R(x0,y0,w,h,'#fff',C.grid,4);
 (o.xt||[]).forEach(([v,l])=>{svg+=L(X(v),y0+h,X(v),y0+h+4,C.line,1)+TF(X(v),y0+h+17,l,13,C.muted)});
 (o.yt||[]).forEach(([v,l])=>{svg+=L(x0-4,Y(v),x0,Y(v),C.line,1)+TF(x0-7,Y(v)+4,l,13,C.muted,'end')});
 if(o.xl)svg+=TF(x0+w/2,y0+h+(o.xlDy||34),o.xl,13,C.muted);
 if(o.yl)svg+=TF(x0,y0-8,o.yl,13,C.muted,'start');
 return {svg,X,Y};
}
const B5_clipY=(v,yr)=>clamp(v,yr[0],yr[1]);

/* ================================================================ enzymes */
// Michaelis–Menten: the learner measures initial rates at chosen substrate levels and fits Vmax and Km.
const B5_V=8,B5_K=2.5;
const B5_mm=(S,V,K)=>V*S/(K+S);
function B5_assay(S,i){const r=B5_rng(i*97+Math.round(S*10)+3);return Math.max(0,B5_mm(S,B5_V,B5_K)*(1+.05*B5_gauss(r))+.08*B5_gauss(r))}
const B5_WATCH_S=[.5,1,2,3,5,8,12,20];
const B5_rms=(data,V,K)=>data.length?Math.sqrt(data.reduce((a,d)=>a+(d.v-B5_mm(d.S,V,K))**2,0)/data.length):NaN;

SCENE({id:'enzymes',name:'Enzyme kinetics',tag:'Michaelis and Menten, 1913',
 definition:'An enzyme’s rate rises with substrate concentration and levels off at a maximum, Vmax, when every enzyme molecule is busy. The Michaelis constant, Km, is the substrate concentration that gives half that maximum.',
 example:'With Vmax = 8 µmol/min and Km = 2.5 mM, a 2.5 mM solution runs at 4 µmol/min; a 20 mM solution runs at about 7.1, close to the ceiling.',
 desc:'A plot of measured reaction rate against substrate concentration, with the learner’s fitted Michaelis–Menten curve, its Vmax and Km marked, and the fit error.',
 research:'Michaelis, L. & Menten, M. L. (1913). Die Kinetik der Invertinwirkung. Biochemische Zeitschrift 49, 333–369. Briggs & Haldane (1925) gave the steady-state derivation; Johnson & Goody (2011) translated and refitted the original invertase data.',
 dur:12,hint:'Pick a substrate concentration and press Measure the rate; take several. Then move the Vmax and Km sliders until the curve passes through your points.',
 init:()=>({S:2,data:[],fv:5,fk:6}),
 watch(p){const n=Math.min(8,Math.floor(p*10)),u=smooth((p-.5)/.42);return {S:B5_WATCH_S[Math.max(0,n-1)],data:B5_WATCH_S.slice(0,n).map((S,i)=>({S,v:B5_assay(S,i)})),fv:lerp(5,B5_V,u),fk:lerp(6,B5_K,u),sim:true}},
 ui:[{range:'S',label:'Substrate concentration [S]',min:.5,max:20,step:.5,get:s=>s.S,act:'S',show:v=>v+' mM'},{b:'Measure the rate',act:'measure'},
  {range:'fv',label:'Your Vmax',min:1,max:12,step:.1,get:s=>s.fv,act:'fv',show:v=>Number(v).toFixed(1)+' µmol/min'},
  {range:'fk',label:'Your Km',min:.2,max:10,step:.1,get:s=>s.fk,act:'fk',show:v=>Number(v).toFixed(1)+' mM'},{b:'Clear the data',act:'clear'}],
 on:{S(s,v){s.S=Number(v);return 'keep'},measure(s){if(s.data.length<24)s.data.push({S:s.S,v:B5_assay(s.S,s.data.length)});return 'keep'},
  fv(s,v){s.fv=Number(v);return 'keep'},fk(s,v){s.fk=Number(v);return 'keep'},clear(s){s.data=[];return 'keep'}},
 draw(s){
  let out=heading('Rate against substrate: fit Vmax and Km',26);
  const pl=B5_plot(70,56,300,236,[0,20],[0,10],{xt:[[0,'0'],[5,'5'],[10,'10'],[15,'15'],[20,'20']],yt:[[0,'0'],[2,'2'],[4,'4'],[6,'6'],[8,'8'],[10,'10']],xl:'substrate [S] (mM)',yl:'initial rate v (µmol/min)'});
  out+=pl.svg;
  out+=L(pl.X(s.S),56,pl.X(s.S),292,C.pale,6);
  out+=L(70,pl.Y(s.fv),370,pl.Y(s.fv),C.coral,1.5,'stroke-dasharray="6 5"')+TF(366,pl.Y(s.fv)-6,'Vmax',13,C.coral,'end');
  if(s.fk<=20)out+=L(pl.X(s.fk),292,pl.X(s.fk),pl.Y(s.fv/2),C.coral,1.5,'stroke-dasharray="3 4"')+L(70,pl.Y(s.fv/2),pl.X(s.fk),pl.Y(s.fv/2),C.coral,1.5,'stroke-dasharray="3 4"')+TF(pl.X(s.fk)+5,pl.Y(s.fv/2)+16,'Km',13,C.coral,'start');
  out+=B5_poly(range(81).map(i=>{const S=i/4;return [pl.X(S),pl.Y(clamp(B5_mm(S,s.fv,s.fk),0,10))]}),C.coral,2.6);
  s.data.forEach(d=>out+=Ci(pl.X(d.S),pl.Y(clamp(d.v,0,10)),5.5,C.blue,'#fff'));
  const e=B5_rms(s.data,s.fv,s.fk);
  out+=R(392,56,190,236,C.pale,'none',10);
  out+=TBF(404,80,s.sim?'A simulated fit':'Your fit',15,C.ink,'start');
  out+=TF(404,106,`Vmax ${B5_num(s.fv)} µmol/min`,14,C.coral,'start')+TF(404,128,`Km ${B5_num(s.fk)} mM`,14,C.coral,'start');
  out+=TF(404,158,`${s.data.length} measurement${s.data.length===1?'':'s'}`,14,C.blue,'start');
  out+=TF(404,180,s.data.length?`fit error ${B5_num(e,2)} µmol/min`:'no data yet',14,C.ink,'start');
  out+=TF(404,212,'At [S] = Km the rate is',13,C.muted,'start')+TF(404,229,'half of Vmax.',13,C.muted,'start');
  out+=TF(404,258,'Well past Km, adding',13,C.muted,'start')+TF(404,275,'substrate barely helps.',13,C.muted,'start');
  out+=TF(300,350,'v = Vmax · [S] / (Km + [S])',15,C.ink);
  out+=TF(300,372,s.data.length>=4&&e<.35?'Good fit: the curve runs through the scatter of your points.':'Measure at low and high [S]: low values pin down Km, high ones Vmax.',13,C.muted);
  return {svg:out,phase:'Each dot is one measured initial rate, with a few per cent of measurement noise. Low concentrations fix the slope and so Km; high ones show the ceiling, Vmax. Maud Menten and Leonor Michaelis showed in 1913 that this one curve describes invertase, and it describes many enzymes since.'};
 }});

// Lock and key against induced fit, with a 3D view of the pocket.
const B5_SUBS={match:{n:'the substrate',c:C.coral},wrong:{n:'a wrong shape',c:C.amber},inh:{n:'a competitive inhibitor',c:C.purple}};
function B5_seatY(sub,ins){return sub==='wrong'?lerp(46,148,Math.min(1,ins/.7)):lerp(52,182,ins)}
function B5_open(model,sub,ins){return model==='induced'?(sub==='wrong'?1:ins<.8?1:(1-ins)/.2):0}
SCENE({id:'enzymes-active-site',name:'The active site',tag:'Lock and key, induced fit',
 definition:'The active site is a pocket in the enzyme whose shape and charges fit its substrate. Fischer’s lock and key pictured a rigid fit; Koshland’s induced fit says the pocket closes around the right molecule as it binds.',
 example:'A molecule shaped like the substrate but unable to react, a competitive inhibitor, can sit in the pocket and block it.',
 desc:'An enzyme cut through its active site, with a choice of the substrate, a wrongly shaped molecule or a competitive inhibitor, and a choice of rigid or induced-fit pocket; a 3D view shows the pocket as blocks.',
 research:'Fischer, E. (1894). Einfluss der Configuration auf die Wirkung der Enzyme. Berichte der deutschen chemischen Gesellschaft 27, 2985–2993. Koshland, D. E. (1958). Application of a theory of enzyme specificity to protein synthesis. PNAS 44, 98–104.',
 dur:12,hint:'Choose a molecule and a model, then slide it into the pocket. Try the 3D view and drag to turn it.',
 init:()=>({sub:'match',model:'induced',ins:0}),
 watch(p){const i=Math.min(2,Math.floor(p*3)),q=p*3-i;return {sub:['match','wrong','inh'][i],model:p<.5?'lock':'induced',ins:smooth(q/.6)}},
 ui:[{choose:[['match','The substrate'],['wrong','A wrong shape'],['inh','An inhibitor']],label:'Molecule',get:s=>s.sub,act:'sub'},
  {choose:[['lock','Lock and key'],['induced','Induced fit']],label:'Model',get:s=>s.model,act:'model'},
  {range:'ins',label:'Bring it in',min:0,max:100,step:5,get:s=>Math.round(s.ins*100),act:'ins',show:v=>v+'%'}],
 on:{sub(s,v){s.sub=v;return 'keep'},model(s,v){s.model=v;return 'keep'},ins(s,v){s.ins=Number(v)/100;return 'keep'}},
 draw(s){
  const w=B5_open(s.model,s.sub,s.ins)*14,sub=B5_SUBS[s.sub],y=B5_seatY(s.sub,s.ins),seated=s.ins>=.999;
  let out=heading(s.model==='lock'?'Lock and key: a rigid pocket (Fischer, 1894)':'Induced fit: the pocket closes (Koshland, 1958)',26);
  out+=P(`M140 180 L${270-w} 180 L${270-w} 222 L300 250 L${330+w} 222 L${330+w} 180 L460 180 Q482 262 410 322 Q300 366 190 322 Q118 262 140 180 Z`,C.blue,2.5,C.pale);
  out+=TF(300,312,'enzyme',14,C.blue);
  if(s.sub==='wrong')out+=Ci(300,y,34,C.amberp,C.amber);
  else{const pts=[[-27,0],[-27,40],[0,66],[27,40],[27,0]];
   if(s.sub==='match'&&seated){[-1,1].forEach(side=>{const dx=side*9,half=side<0?[[-27,0],[-27,40],[0,66],[0,0]]:[[0,0],[0,66],[27,40],[27,0]];out+=P('M'+half.map(q=>fmt(300+q[0]+dx)+' '+fmt(y+q[1])).join(' L')+' Z',sub.c,2,C.coralp)});
    out+=TF(300,y-10,'bond broken',13,C.coral)}
   else out+=P('M'+pts.map(q=>fmt(300+q[0])+' '+fmt(y+q[1])).join(' L')+' Z',sub.c,2,s.sub==='inh'?C.purplep:C.coralp);}
  let msg;
  if(s.sub==='wrong')msg=s.ins>.7?'Too wide: it rests on the rim and cannot reach the site.':'A molecule of the wrong shape approaches.';
  else if(!seated)msg=s.model==='induced'&&s.ins<.8?'The pocket is open and loose until the molecule is nearly in.':'The molecule slides into the active site.';
  else msg=s.sub==='match'?'Held and strained, the bond breaks: two products leave.':'It fits and binds, but cannot react: the site is blocked.';
  out+=TF(300,60,`Bringing in ${sub.n}`,15,sub.c);
  out+=TF(300,372,msg,14,C.ink);
  out+=TF(60,200,s.model==='lock'?'rigid':'flexible',13,C.muted,'start');
  return {svg:out,phase:'Fischer’s lock and key explains why enzymes are so choosy. Koshland’s induced fit adds that the protein moves: the pocket tightens around the right molecule, which helps explain why some near-miss molecules bind but are not changed. Competitive inhibitors exploit the fit, and many drugs work this way.'};
 },
 three(s,f,X,project){
  const P=project([-1.8,1.8,-1,1,0,3.3]),w=B5_open(s.model,s.sub,s.ins)*.28,ins=s.ins,col=B5_SUBS[s.sub].c;
  let faces=[...prism(-1.6,-.8,0,3.2,1.6,.8,'#8fb9d9'),...prism(-1.6,-.8,.8,1.25-w,1.6,.9,'#8fb9d9'),...prism(.35+w,-.8,.8,1.25-w,1.6,.9,'#8fb9d9')];
  if(s.sub==='wrong'){const z=lerp(3.2,1.7,Math.min(1,ins/.7));faces=faces.concat(prism(-.55,-.5,z,1.1,1,.7,col))}
  else{const z=lerp(3.2,.82,ins);if(s.sub==='match'&&ins>=.999){faces=faces.concat(prism(-.36,-.4,z,.33,.8,.86,col),prism(.03,-.4,z,.33,.8,.86,col))}else faces=faces.concat(prism(-.32,-.4,z,.64,.8,.86,col))}
  return {svg:paintFaces(faces,P),title:'The pocket in three dimensions',caption:'Blue blocks are the enzyme and the gap between its walls is the active site. With induced fit the walls stand apart until the right molecule is nearly in, then close on it. The wrong shape is too wide to enter.'};
 }});

// Competitive and non-competitive inhibition, in direct and double-reciprocal form.
SCENE({id:'enzymes-inhibitors',name:'Inhibitors',tag:'Competitive or not',
 definition:'A competitive inhibitor competes for the active site, so more substrate can outcompete it: Km rises but Vmax is unchanged. A non-competitive inhibitor binds elsewhere and disables the enzyme: Vmax falls but Km stays the same.',
 example:'With the inhibitor at twice its dissociation constant, competitive inhibition triples the apparent Km; non-competitive inhibition cuts Vmax to a third.',
 desc:'Rate curves with and without an inhibitor, shown directly or as a Lineweaver–Burk double-reciprocal plot, where the two kinds of inhibition pivot about different axes.',
 research:'Lineweaver, H. & Burk, D. (1934). The determination of enzyme dissociation constants. Journal of the American Chemical Society 56, 658–666. Cornish-Bowden, A. (2012). Fundamentals of Enzyme Kinetics, 4th edn: the double-reciprocal plot distorts errors, so fits are now done on the curve itself.',
 dur:12,hint:'Choose the kind of inhibitor, change how much there is, and switch to the double-reciprocal plot to see which line pivots.',
 init:()=>({type:'comp',I:2,view:'mm'}),
 watch(p){const seg=Math.min(3,Math.floor(p*4)),q=p*4-seg;return {type:seg<2?'comp':'non',view:seg%2?'lb':'mm',I:4*smooth(q/.7)}},
 ui:[{choose:[['comp','Competitive'],['non','Non-competitive']],label:'Inhibitor',get:s=>s.type,act:'type'},
  {range:'I',label:'Inhibitor [I] / Ki',min:0,max:5,step:.25,get:s=>s.I,act:'I',show:v=>Number(v).toFixed(2)},
  {choose:[['mm','Rate against [S]'],['lb','Double reciprocal']],label:'Plot',get:s=>s.view,act:'view'}],
 on:{type(s,v){s.type=v;return 'keep'},I(s,v){s.I=Number(v);return 'keep'},view(s,v){s.view=v;return 'keep'}},
 draw(s){
  const Ka=s.type==='comp'?B5_K*(1+s.I):B5_K,Va=s.type==='comp'?B5_V:B5_V/(1+s.I);
  let out=heading(s.type==='comp'?'A competitive inhibitor: Km rises, Vmax stays':'A non-competitive inhibitor: Vmax falls, Km stays',26);
  if(s.view==='mm'){
   const pl=B5_plot(70,56,320,236,[0,20],[0,10],{xt:[[0,'0'],[5,'5'],[10,'10'],[15,'15'],[20,'20']],yt:[[0,'0'],[2,'2'],[4,'4'],[6,'6'],[8,'8'],[10,'10']],xl:'substrate [S] (mM)',yl:'rate v (µmol/min)'});
   out+=pl.svg+B5_poly(range(81).map(i=>[pl.X(i/4),pl.Y(B5_mm(i/4,B5_V,B5_K))]),C.muted,2,'stroke-dasharray="7 5"')+B5_poly(range(81).map(i=>[pl.X(i/4),pl.Y(B5_mm(i/4,Va,Ka))]),C.coral,2.8);
  }else{
   const xr=[-.6,2],yr=[0,4.2],pl=B5_plot(70,56,320,236,xr,yr,{xt:[[-.4,'−0.4'],[0,'0'],[1,'1'],[2,'2']],yt:[[0,'0'],[1,'1'],[2,'2'],[3,'3'],[4,'4']],xl:'1/[S] (per mM)',yl:'1/v (min per µmol)'});
   out+=pl.svg+L(pl.X(0),56,pl.X(0),292,C.grid,1.5);
   const line=(V,K,col,w,ex)=>{const f=x=>(K/V)*x+1/V,x0=Math.max(xr[0],-1/K);let xa=x0,xb=xr[1];if(f(xb)>yr[1])xb=(yr[1]-1/V)*V/K;return L(pl.X(xa),pl.Y(f(xa)),pl.X(xb),pl.Y(f(xb)),col,w,ex)};
   out+=line(B5_V,B5_K,C.muted,2,'stroke-dasharray="7 5"')+line(Va,Ka,C.coral,2.8,'');
   out+=Ci(pl.X(0),pl.Y(1/Va),5,C.coral)+Ci(pl.X(-1/Ka),pl.Y(0),5,C.coral);
   out+=TF(pl.X(0)+8,pl.Y(1/Va)+18,'1/Vmax',13,C.coral,'start')+TF(pl.X(-1/Ka),pl.Y(0)-10,'−1/Km',13,C.coral);
  }
  out+=R(410,56,172,236,C.pale,'none',10);
  out+=TBF(422,80,'Apparent values',15,C.ink,'start');
  out+=TF(422,106,`Vmax ${B5_num(Va,2)}`,14,C.coral,'start')+TF(422,126,`Km ${B5_num(Ka,2)} mM`,14,C.coral,'start');
  out+=TF(422,154,'Without inhibitor:',13,C.muted,'start')+TF(422,172,`Vmax ${B5_V}, Km ${B5_K} mM`,13,C.muted,'start');
  out+=TF(422,206,'dashed: no inhibitor',13,C.muted,'start')+TF(422,224,'coral: with inhibitor',13,C.coral,'start');
  out+=TF(422,256,s.view==='lb'?'Lines meet on the':'More substrate can',13,C.ink,'start')+TF(422,273,s.view==='lb'?(s.type==='comp'?'1/v axis: same Vmax.':'1/[S] axis: same Km.'):(s.type==='comp'?'outcompete it.':'not rescue it.'),13,C.ink,'start');
  out+=TF(300,350,s.type==='comp'?'Km × (1 + [I]/Ki), Vmax unchanged':'Vmax ÷ (1 + [I]/Ki), Km unchanged',15,C.ink);
  return {svg:out,phase:'Telling the two kinds apart was one of the first uses of Lineweaver and Burk’s straight-line plot. It is still drawn in textbooks, but taking reciprocals magnifies the noise in the slowest measurements, so modern labs fit the curve directly.'};
 }});

// Temperature: faster with heat until the protein unfolds.
const B5_ENZ={human:{n:'A human enzyme',Tm:45.5,c:C.blue},taq:{n:'Taq polymerase',Tm:84,c:C.coral}};
function B5_tRate(T,Tm,shift=0){return Math.pow(2,(T-25)/10)/(1+Math.exp((T-(Tm-shift))/2.5))}
function B5_tCurve(Tm,shift){const ys=range(101).map(T=>B5_tRate(T,Tm,shift)),m=Math.max(...ys);return {ys:ys.map(y=>y/m),opt:ys.indexOf(m),max:m}}
SCENE({id:'enzymes-temperature',name:'Heat and enzymes',tag:'Faster, then unfolded',
 definition:'Warming speeds up an enzyme reaction, roughly doubling it for every 10 °C, until the protein starts to unfold (denature) and loses its shape. The peak of the curve is called the optimum temperature.',
 example:'Taq polymerase, from bacteria in Yellowstone’s hot springs, keeps working near 75 °C, which is why it is used to copy DNA in PCR.',
 desc:'Relative rate against temperature for a human enzyme and for Taq polymerase, combining the speed-up from heat with the fraction of protein still folded, with a cartoon of the protein at the chosen temperature.',
 research:'Brock, T. D. & Freeze, H. (1969). Thermus aquaticus gen. n. and sp. n., a nonsporulating extreme thermophile. Journal of Bacteriology 98, 289–297. Saiki, R. K. et al. (1988). Primer-directed enzymatic amplification of DNA with a thermostable DNA polymerase. Science 239, 487–491. Daniel, R. M. & Danson, M. J. (2010). A new understanding of how temperature affects the catalytic activity of enzymes. Trends in Biochemical Sciences 35, 584–591.',
 dur:10,hint:'Move the temperature, switch enzyme, and try a long assay: the apparent optimum moves lower because more protein unfolds during the measurement.',
 init:()=>({T:37,enz:'human',long:false}),
 watch(p){return {T:Math.round(100*p),enz:p<.55?'human':'taq',long:false}},
 ui:[{range:'T',label:'Temperature',min:0,max:100,step:1,get:s=>s.T,act:'T',show:v=>v+' °C'},
  {choose:[['human','Human enzyme'],['taq','Taq polymerase']],label:'Enzyme',get:s=>s.enz,act:'enz'},
  {choose:[['short','Short assay'],['long','Long assay']],label:'Assay',get:s=>s.long?'long':'short',act:'long'}],
 on:{T(s,v){s.T=Number(v);return 'keep'},enz(s,v){s.enz=v;return 'keep'},long(s,v){s.long=v==='long';return 'keep'}},
 draw(s){
  const shift=s.long?4:0;let out=heading('Rate against temperature',26);
  const pl=B5_plot(70,56,320,236,[0,100],[0,1.1],{xt:[[0,'0'],[20,'20'],[40,'40'],[60,'60'],[80,'80'],[100,'100']],yt:[[0,'0'],[.5,'0.5'],[1,'1']],xl:'temperature (°C)',yl:'rate, relative to its peak'});
  out+=pl.svg;
  Object.entries(B5_ENZ).forEach(([k,e])=>{const c=B5_tCurve(e.Tm,shift),on=k===s.enz;out+=B5_poly(c.ys.map((y,T)=>[pl.X(T),pl.Y(y)]),e.c,on?3:1.6,on?'':'opacity=".45"');
   out+=TF(pl.X(c.opt),pl.Y(1)-8,`${e.n.split(' ')[0]==='A'?'human':'Taq'} peak ${c.opt} °C`,13,e.c)});
  const e=B5_ENZ[s.enz],c=B5_tCurve(e.Tm,shift),y=c.ys[s.T];
  out+=L(pl.X(s.T),56,pl.X(s.T),292,C.ink,1.5,'stroke-dasharray="3 4"')+Ci(pl.X(s.T),pl.Y(y),6.5,e.c,'#fff');
  const folded=1/(1+Math.exp((s.T-(e.Tm-shift))/2.5));
  out+=R(410,56,172,236,C.pale,'none',10)+TBF(422,80,e.n,14,e.c,'start');
  out+=TF(422,104,`at ${s.T} °C`,14,C.ink,'start')+TF(422,126,`rate ${Math.round(y*100)}% of peak`,14,C.ink,'start')+TF(422,148,`folded ${Math.round(folded*100)}%`,14,C.ink,'start');
  // protein cartoon: compact when folded, a loose chain when unfolded
  const cx=496,cy=222;
  if(folded>.5){out+=Ci(cx,cy,34,'#fff',e.c);out+=P(`M${cx-22} ${cy} q8 -18 16 0 t16 0 t16 0`,e.c,2.5)+P(`M${cx-18} ${cy-14} q8 -12 18 0 t18 0`,e.c,2)+P(`M${cx-18} ${cy+14} q8 12 18 0 t18 0`,e.c,2)}
  else out+=P(`M${cx-66} ${cy} q11 -22 22 0 t22 0 t22 0 t22 0 t22 0 t22 0`,e.c,2.5);
  out+=TF(cx,276,folded>.5?'folded: active':'unfolded: inactive',13,C.muted);
  out+=TF(300,350,s.long?'Long assay: more unfolds while you measure, so the peak looks lower.':'Below the peak heat helps; above it the protein falls apart.',13,C.ink);
  return {svg:out,phase:'The curve is two effects multiplied: molecules move faster in the warm, and the fraction of folded protein collapses above a melting point. The “optimum” is not a fixed property: it depends on how long the assay runs. Taq polymerase made PCR practical because it survives the near-boiling steps that separate DNA strands.'};
 }});

/* ================================================================ membranes-pumps */
// Gorter & Grendel (1925): lipids from red cells spread as a film cover about twice the cells' surface.
const B5_film=A=>A>=2.4?0:A>=2?10*(2.4-A)/.4:Math.min(45,10+70*(2-A)/.3);
SCENE({id:'membranes-pumps',name:'Membranes',tag:'Gorter and Grendel’s trough, 1925',
 definition:'A cell membrane is a double layer of lipid molecules, a bilayer, with water-loving heads facing out on both sides and oily tails hidden inside.',
 example:'Lipids extracted from red blood cells and spread on water covered about twice the area of the cells’ surface: enough for exactly two layers.',
 desc:'A trough of water with lipid molecules spread on it and a movable barrier that compresses the film, beside a plot of film pressure against area and a comparison with the cells’ total surface.',
 research:'Gorter, E. & Grendel, F. (1925). On bimolecular layers of lipoids on the chromocytes of the blood. Journal of Experimental Medicine 41, 439–443. Bar, R. S., Deamer, D. W. & Cornwell, D. G. (1966). Surface area of human erythrocyte lipids: reinvestigation of experiments on plasma membrane. Science 153, 1010–1012.',
 dur:10,hint:'Push the barrier in and watch the pressure. Where the film suddenly resists, read off its area and compare it with the cells’ surface.',
 init:()=>({b:100}),
 watch(p){return {b:Math.round(100-62*smooth(p/.85))}},
 ui:[{range:'b',label:'Barrier position (film area)',min:30,max:100,step:1,get:s=>s.b,act:'b',show:v=>(Number(v)/20).toFixed(2)+' units'}],
 on:{b(s,v){s.b=Number(v);return 'keep'}},
 draw(s){
  const A=s.b/20,pi=B5_film(A),xb=60+480*s.b/100;let out=heading('Spreading the lipids of red blood cells on water',26);
  out+=R(60,50,480,70,'#fff',C.line,4)+R(62,84,476,34,'#d6ebf7','none',2)+L(xb,44,xb,126,C.dark,5);
  out+=TF(xb+8,66,'barrier',13,C.muted,'start');
  const n=36,sp=(xb-72)/n;for(let i=0;i<n;i++){const x=66+sp*(i+.5);out+=L(x,80,x,62,C.amber,1.6)+Ci(x,84,Math.min(5,sp*.45),C.coral)}
  out+=TF(66,140,'side view: lipid heads (coral) in the water, tails up into the air',13,C.muted,'start');
  const pl=B5_plot(70,166,300,150,[0,5],[0,50],{xt:[[0,'0'],[1,'1'],[2,'2'],[3,'3'],[4,'4'],[5,'5']],yt:[[0,'0'],[25,'25'],[50,'50']],xl:'film area (units of the cells’ surface)',yl:'film pressure (mN/m)'});
  out+=pl.svg+B5_poly(range(101).map(i=>{const a=1.5+i*.035;return [pl.X(a),pl.Y(B5_film(a))]}),C.muted,1.8)+Ci(pl.X(A),pl.Y(pi),6,C.coral,'#fff');
  out+=L(pl.X(2),166,pl.X(2),316,C.green,1.5,'stroke-dasharray="4 4"');
  const bx=400,bw=80;
  out+=TBF(bx,184,'Compare areas',14,C.ink,'start');
  out+=R(bx,196,bw*1,18,C.green,'none',3)+TF(bx+bw+6,210,'cells’ surface',13,C.green,'start');
  out+=R(bx,224,Math.min(180,bw*A),18,C.coral,'none',3)+TF(bx,258,`film now ${B5_num(A,2)}×`,13,C.coral,'start');
  out+=TF(bx,290,pi>=10?'Packed tight at about 2×:':'Still spread out:',13,C.ink,'start')+TF(bx,307,pi>=10?'two layers of lipid.':'push the barrier in.',13,C.ink,'start');
  return {svg:out,phase:'Gorter and Grendel found the extracted lipid film became solid at about twice the cells’ surface area, and concluded the membrane is two molecules thick. They were right, but partly by luck: later work found they had extracted too little lipid and underestimated the cell area, two errors that roughly cancelled (Bar, Deamer and Cornwell, 1966). Singer and Nicolson’s fluid mosaic (1972) added proteins floating in the bilayer.'};
 }});

// Diffusion, carriers and pumps: flux against the concentration difference.
const B5_ROUTES={diff:{n:'Simple diffusion',c:C.blue},fac:{n:'Carrier (facilitated)',c:C.green},pump:{n:'Pump (active)',c:C.coral}};
function B5_flux(route,out,inn,atp){if(route==='diff')return .4*(out-inn);if(route==='fac')return 4*(out/(2+out)-inn/(2+inn));return atp?2.5:0}
SCENE({id:'membranes-pumps-transport',name:'Crossing the membrane',tag:'Diffusion, carriers and pumps',
 definition:'Small oily molecules diffuse straight through the bilayer at a rate proportional to the concentration difference. Carrier proteins speed up diffusion for molecules like glucose but saturate. Pumps spend energy, usually ATP, to move molecules against their gradient.',
 example:'With the inside already richer than the outside, diffusion and carriers move molecules out; only a pump keeps moving them in.',
 desc:'A membrane with molecules on each side and an arrow for the net flow, beside a plot of net inward flow against outside concentration for diffusion, a carrier and a pump.',
 research:'Fick, A. (1855). Über Diffusion. Annalen der Physik 170, 59–86. Singer, S. J. & Nicolson, G. L. (1972). The fluid mosaic model of the structure of cell membranes. Science 175, 720–731. Skou, J. C. (1957). The influence of some cations on an adenosine triphosphatase from peripheral nerves. Biochimica et Biophysica Acta 23, 394–401.',
 dur:12,hint:'Set the concentrations outside and inside, choose a route, and switch the ATP off to see the pump stop.',
 init:()=>({route:'fac',out:8,inn:2,atp:true}),
 watch(p){const i=Math.min(2,Math.floor(p*3));return {route:['diff','fac','pump'][i],out:Math.round(20*smooth((p*3-i)/.8)),inn:4,atp:true}},
 ui:[{choose:[['diff','Diffusion'],['fac','Carrier'],['pump','Pump']],label:'Route',get:s=>s.route,act:'route'},
  {range:'out',label:'Outside',min:0,max:20,step:1,get:s=>s.out,act:'out',show:v=>v+' mM'},{range:'inn',label:'Inside',min:0,max:20,step:1,get:s=>s.inn,act:'inn',show:v=>v+' mM'},
  {choose:[['on','ATP on'],['off','ATP off']],label:'Energy',get:s=>s.atp?'on':'off',act:'atp'}],
 on:{route(s,v){s.route=v;return 'keep'},out(s,v){s.out=Number(v);return 'keep'},inn(s,v){s.inn=Number(v);return 'keep'},atp(s,v){s.atp=v==='on';return 'keep'}},
 draw(s){
  const J=B5_flux(s.route,s.out,s.inn,s.atp),rt=B5_ROUTES[s.route];let out=heading(rt.n,26);
  out+=R(132,48,20,282,'#f3dfa8','none',3)+TF(76,60,'outside',13,C.muted)+TF(214,60,'inside',13,C.muted);
  const dots=(n,x0,x1,seed,col)=>{const r=B5_rng(seed);let o='';for(let i=0;i<n;i++)o+=Ci(lerp(x0,x1,r()),lerp(76,318,r()),3.6,col);return o};
  out+=dots(Math.round(s.out*1.6),26,124,11,C.blue)+dots(Math.round(s.inn*1.6),160,262,12,C.blue);
  if(s.route==='fac')out+=R(128,150,28,46,C.greenp,C.green,8);
  if(s.route==='pump')out+=R(126,150,32,46,C.coralp,C.coral,8)+TF(142,214,s.atp?'ATP':'no ATP',13,s.atp?C.coral:C.muted);
  if(Math.abs(J)>.05){const len=Math.min(90,14+Math.abs(J)*11),y=128;out+=J>0?arrow(142-len/2,y,142+len/2,y,rt.c,4):arrow(142+len/2,y,142-len/2,y,rt.c,4)}
  out+=TF(142,346,Math.abs(J)<.05?'no net flow':J>0?`net flow in: ${B5_num(J,2)}`:`net flow out: ${B5_num(-J,2)}`,14,rt.c);
  const pl=B5_plot(330,56,250,224,[0,20],[-8,8],{xt:[[0,'0'],[10,'10'],[20,'20']],yt:[[-8,'−8'],[0,'0'],[8,'+8']],xl:'outside concentration (mM)',yl:'net inward flow (relative)'});
  out+=pl.svg+L(330,pl.Y(0),580,pl.Y(0),C.grid,1.5);
  Object.entries(B5_ROUTES).forEach(([k,r])=>{out+=B5_poly(range(41).map(i=>[pl.X(i/2),pl.Y(clamp(B5_flux(k,i/2,s.inn,s.atp),-8,8))]),r.c,k===s.route?3:1.5,k===s.route?'':'opacity=".45"')});
  out+=Ci(pl.X(s.out),pl.Y(clamp(J,-8,8)),6,rt.c,'#fff');
  out+=TF(330,350,'blue: diffusion · green: carrier · coral: pump',13,C.muted,'start');
  return {svg:out,phase:s.route==='diff'?'Diffusion is passive: flow is proportional to the difference across the membrane and reverses when the inside is richer.':s.route==='fac'?'A carrier is still passive, so it only ever runs downhill, but it is fast at low concentrations and levels off when every carrier is busy, like an enzyme.':'A pump moves molecules in at a steady rate whatever the gradient, as long as it has ATP. Switch the energy off and it stops.'};
 }});

// The sodium–potassium pump's cycle: 3 Na+ out, 2 K+ in, 1 ATP.
const B5_PUMP=['Open to the inside: three Na⁺ bind.','ATP gives the pump a phosphate.','It flips to face outside and releases three Na⁺.','Two K⁺ bind from outside.','The phosphate leaves.','It flips back and releases two K⁺ inside.'];
SCENE({id:'membranes-pumps-cycle',name:'The sodium–potassium pump',tag:'Skou, 1957',
 definition:'The sodium–potassium pump is a membrane protein that uses one ATP to push three sodium ions out of the cell and bring two potassium ions in, building the gradients that nerves and kidneys rely on.',
 example:'Ten turns of the cycle move 30 Na⁺ out and 20 K⁺ in for 10 ATP, and export 10 net positive charges.',
 desc:'A pump protein in the membrane stepping through its six-stage cycle, with counters for sodium out, potassium in, ATP used and net charge moved.',
 research:'Skou, J. C. (1957). The influence of some cations on an adenosine triphosphatase from peripheral nerves. Biochimica et Biophysica Acta 23, 394–401. Post, R. L. & Jolly, P. C. (1957). The linkage of sodium, potassium, and ammonium active transport across the human erythrocyte membrane. Biochimica et Biophysica Acta 25, 118–128 (the 3:2 ratio).',
 dur:12,hint:'Press Next step to walk through one cycle, or run ten at once. Notice that each turn exports one positive charge.',
 init:()=>({step:0,cycles:0}),
 watch(p){const t=Math.floor(p*12.99);return {step:t%6,cycles:Math.floor(t/6)}},
 ui:[{b:'Next step',act:'next'},{b:'Run ten cycles',act:'ten'},{b:'Reset counters',act:'reset'}],
 on:{next(s){s.step++;if(s.step>5){s.step=0;s.cycles++}return 'keep'},ten(s){s.cycles+=10;return 'keep'},reset(s){s.step=0;s.cycles=0;return 'keep'}},
 draw(s){
  const st=s.step,openOut=st>=2&&st<=4,na=s.cycles*3+(st>=3?3:0),k=s.cycles*2,atp=s.cycles+(st>=2?1:0);
  let out=heading('One turn of the sodium–potassium pump',26);
  out+=TF(40,64,'outside the cell',13,C.muted,'start')+TF(40,300,'inside the cell',13,C.muted,'start');
  out+=R(20,160,380,60,'#f3dfa8','none',4);
  // pump: two halves forming a channel open up or down
  const cx=210,gap=openOut?[18,4]:[4,18];
  out+=P(`M${cx-50} 140 L${cx-gap[0]} 140 L${cx-gap[1]} 240 L${cx-50} 240 Z`,C.blue,2.5,C.pale)+P(`M${cx+50} 140 L${cx+gap[0]} 140 L${cx+gap[1]} 240 L${cx+50} 240 Z`,C.blue,2.5,C.pale);
  const ion=(x,y,t)=>Ci(x,y,13,t==='Na'?C.amberp:C.purplep,t==='Na'?C.amber:C.purple)+TF(x,y+5,t==='Na'?'Na⁺':'K⁺',13,t==='Na'?C.amber:C.purple);
  if(st===0)[[-24,266],[24,266],[0,292]].forEach(([dx,y])=>out+=ion(cx+dx,y,'Na'));
  if(st===1)[[-16,206],[16,206],[0,232]].forEach(([dx,y])=>out+=ion(cx+dx,y,'Na'));
  if(st===2)[[-60,100],[0,84],[60,100]].forEach(([dx,y])=>out+=ion(cx+dx,y,'Na'));
  if(st===3||st===4)[[-12,170],[12,206]].forEach(([dx,y])=>out+=ion(cx+dx,y,'K'));
  if(st===5)[[-50,276],[50,276]].forEach(([dx,y])=>out+=ion(cx+dx,y,'K'));
  if(st>=1&&st<=3)out+=Ci(cx+62,190,11,C.coral)+TF(cx+62,195,'P',13,'#fff');
  if(st===1)out+=TF(cx+62,262,'ATP → ADP',13,C.coral);
  out+=R(420,56,162,236,C.pale,'none',10)+TBF(432,80,'Counters',15,C.ink,'start');
  out+=TF(432,108,`Na⁺ pumped out ${na}`,14,C.amber,'start')+TF(432,132,`K⁺ brought in ${k}`,14,C.purple,'start')+TF(432,156,`ATP used ${atp}`,14,C.coral,'start')+TF(432,180,`net charge out +${na-k}`,14,C.ink,'start');
  out+=TF(432,214,`cycles completed ${s.cycles}`,13,C.muted,'start');
  out+=TF(432,248,'3 out, 2 in: the pump',13,C.muted,'start')+TF(432,265,'makes a voltage too.',13,C.muted,'start');
  out+=TBF(300,334,`Step ${st+1} of 6`,15,C.blue)+TF(300,358,B5_PUMP[st],14,C.ink);
  return {svg:out,phase:'Jens Skou found an enzyme in crab nerves that split ATP only when both sodium and potassium were present, and realised it was the pump itself (Nobel Prize, 1997). The pump runs constantly and takes a large share of a resting body’s energy, often quoted at around a fifth, and much more in nerve tissue; estimates vary by tissue and method.'};
 }});

/* ================================================================ photosynthesis */
// Van Helmont's willow (1648): 164 lb of tree, 2 oz of soil. Where did the mass come from?
SCENE({id:'photosynthesis',name:'Where does a tree’s mass come from?',tag:'Van Helmont’s willow, 1648',
 definition:'Photosynthesis builds sugar from carbon dioxide and water using light: 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂. Almost all of a plant’s dry mass is carbon and oxygen taken from the air.',
 example:'Van Helmont grew a 5 lb willow for five years in 200 lb of dried soil. The tree reached about 169 lb; the soil lost only about 2 oz.',
 desc:'Van Helmont’s potted willow growing year by year, with the tree’s and the soil’s mass, and a breakdown of where the gained mass came from once the learner has guessed.',
 research:'van Helmont, J. B. (1648). Ortus Medicinae (the willow experiment). Hershey, D. R. (2003). Misconceptions about Helmont’s willow experiment. Plant Science Bulletin 49, 78–83.',
 dur:10,hint:'Grow the tree, then choose where you think its mass came from. The breakdown appears after your guess.',
 init:()=>({yr:5,guess:null}),
 watch(p){return {yr:Math.min(5,Math.round(p*7*10)/10),guess:p>.75?'air':null}},
 ui:[{range:'yr',label:'Years of growth',min:0,max:5,step:.5,get:s=>s.yr,act:'yr',show:v=>v+' years'},
  {choose:[['soil','From the soil'],['water','From the water'],['air','From the air']],label:'Your guess',get:s=>s.guess,act:'guess'}],
 on:{yr(s,v){s.yr=Number(v);return 'keep'},guess(s,v){s.guess=v;return 'keep'}},
 draw(s){
  const u=s.yr/5,tree=5+164.2*u,soil=200-.125*u;let out=heading('Five years, a willow and a pot of soil',26);
  out+=P('M60 250 L80 340 L220 340 L240 250 Z',C.dark,2,'#c7a37a')+TF(150,304,'soil',14,'#fff');
  const h=30+110*u,cr=16+44*u;out+=L(150,250,150,250-h,'#7a5a3a',6+8*u)+Ci(150,250-h,cr,C.greenp,C.green);
  out+=TF(150,364,`tree ${B5_num(tree)} lb · soil ${B5_num(soil,3)} lb`,14,C.ink);
  out+=R(290,56,292,110,C.pale,'none',10);
  out+=TF(302,80,`Tree gained ${B5_num(tree-5)} lb`,15,C.green,'start');
  out+=TF(302,104,`Soil lost ${B5_num(.125*u*16,1)} oz (${B5_num(.125*u,3)} lb)`,15,C.dark,'start');
  out+=TF(302,130,'He watered it only with rainwater',13,C.muted,'start')+TF(302,148,'and concluded the tree was made of water.',13,C.muted,'start');
  if(!s.guess)out+=TF(436,220,'Where did the mass come from?',14,C.ink)+TF(436,244,'Choose your guess below.',13,C.muted);
  else{
   const seg=[['water held in the wood',.5,C.blue],['carbon and oxygen from CO₂',.46,C.green],['hydrogen from water',.035,'#6aa4c8'],['minerals from soil',.005,C.amber]];
   out+=TBF(300,196,`You said: ${({soil:'the soil',water:'the water',air:'the air'})[s.guess]}`,14,s.guess==='air'?C.green:C.coral,'start');
   let x=300;seg.forEach(([n,f,c])=>{out+=R(x,208,Math.max(2,f*280),26,c,'none',2);x+=f*280});
   seg.forEach(([n,f,c],i)=>out+=R(300,250+i*22,12,12,c,'none',2)+TF(318,261+i*22,`${n} ≈ ${f<.01?'<1':Math.round(f*100)}%`,13,C.ink,'start'));
  }
  return {svg:out,phase:s.guess?'About half of fresh wood is water. Nearly all the dry matter is carbon and oxygen fixed from carbon dioxide in the air; water supplies the hydrogen, and the soil only a little mineral. The shares here are illustrative for wood. Van Helmont was right that soil was not the source, but nobody yet knew that air contained a gas plants could use.':'Van Helmont’s careful weighing ruled out the soil. His answer, water, was half right: he could not know about carbon dioxide, which was not identified until the 1750s.'};
 }});

// Priestley (1771) and Ingenhousz (1779): plants restore air, but only in the light.
function B5_jar(o){const r=[];let O=21;const day0=o.occ==='candle'?16:15.5;for(let d=0;d<=12;d+=.25){if(d<.25)O=21;else if(d<.5)O=day0;else O=clamp(O+(o.plant?(o.light?.25:-.1):0)*.25,10,21);r.push([d,O])}return r}
SCENE({id:'photosynthesis-priestley',name:'Restoring the air',tag:'Priestley and Ingenhousz',
 definition:'A burning candle or a breathing animal uses up the oxygen in a sealed jar. A green plant in light puts oxygen back; in the dark it does not.',
 example:'Priestley found that a sprig of mint left for some days in air where a candle had gone out let the candle burn again. Ingenhousz showed this needed light and the green parts of the plant.',
 desc:'A sealed jar with a candle or a mouse, with or without mint, in light or dark, beside the oxygen level over twelve days and the day the candle could be relit.',
 research:'Priestley, J. (1772). Observations on different kinds of air. Philosophical Transactions of the Royal Society 62, 147–264. Ingenhousz, J. (1779). Experiments upon Vegetables, Discovering Their Great Power of Purifying the Common Air in the Sun-shine.',
 dur:10,hint:'Choose what goes in the jar and whether it stands in the light. Oxygen levels are modern, illustrative values.',
 init:()=>({occ:'candle',plant:true,light:true}),
 watch(p){const i=Math.min(3,Math.floor(p*4));return [{occ:'candle',plant:false,light:true},{occ:'candle',plant:true,light:true},{occ:'candle',plant:true,light:false},{occ:'mouse',plant:true,light:true}][i]},
 ui:[{choose:[['candle','Candle'],['mouse','Mouse']],label:'In the jar',get:s=>s.occ,act:'occ'},
  {choose:[['yes','With mint'],['no','No plant']],label:'Plant',get:s=>s.plant?'yes':'no',act:'plant'},
  {choose:[['light','In light'],['dark','In the dark']],label:'Light',get:s=>s.light?'light':'dark',act:'light'}],
 on:{occ(s,v){s.occ=v;return 'keep'},plant(s,v){s.plant=v==='yes';return 'keep'},light(s,v){s.light=v==='light';return 'keep'}},
 draw(s){
  const data=B5_jar(s),relit=data.find(([d,O])=>d>1&&O>=17.5);let out=heading('Air “injured” by a flame, and restored by a plant',26);
  out+=R(30,56,200,250,s.light?'#fff8de':'#dfe5ea','none',12);
  out+=P('M60 290 L60 120 Q60 80 130 80 Q200 80 200 120 L200 290',C.line,2.5)+L(44,292,216,292,C.dark,4);
  if(s.occ==='candle')out+=R(80,240,20,50,'#fff',C.dark,3)+P('M90 238 q-6 -10 0 -20 q6 10 0 20 Z',relit?C.amber:C.muted,1.5,relit?'#ffd36b':'none');
  else out+=P('M70 286 q4 -22 26 -22 q22 0 26 22 Z',C.dark,2,'#cfc6bd')+Ci(76,266,5,'#cfc6bd',C.dark);
  if(s.plant){out+=L(160,290,160,200,C.green,3);[[148,230],[172,220],[146,206],[172,196]].forEach(([x,y])=>out+=P(`M160 ${y+6} Q${x} ${y-8} ${x+(x<160?-6:6)} ${y+4}`,C.green,2,C.greenp))}
  out+=TF(130,326,s.light?'standing in the light':'kept in the dark',13,C.muted);
  const pl=B5_plot(290,56,290,224,[0,12],[10,22],{xt:[[0,'0'],[3,'3'],[6,'6'],[9,'9'],[12,'12']],yt:[[12,'12'],[16,'16'],[21,'21']],xl:'days',yl:'oxygen in the jar (%)'});
  out+=pl.svg+L(290,pl.Y(17.5),580,pl.Y(17.5),C.amber,1.5,'stroke-dasharray="5 4"')+TF(296,pl.Y(17.5)-6,'enough to relight',13,C.amber,'start');
  out+=B5_poly(data.map(([d,O])=>[pl.X(d),pl.Y(O)]),C.green,2.8);
  out+=TF(435,350,relit?`${s.occ==='candle'?'Candle relit':'Air good again'} on about day ${Math.ceil(relit[0])}`:'The air is never restored.',14,relit?C.green:C.coral);
  return {svg:out,phase:'Priestley’s results were not always repeatable, partly because he did not control the light. Ingenhousz showed within a few years that only green parts in sunlight restore the air, and that in the dark plants spoil it slightly, as animals do. Oxygen itself was isolated by Priestley and by Scheele in the 1770s and named by Lavoisier.'};
 }});

// Engelmann (1882): oxygen-seeking bacteria crowd where the light is used.
const B5_G=(x,m,s)=>Math.exp(-(((x-m)/s)**2)/2);
const B5_abs0=w=>B5_G(w,430,14)+.75*B5_G(w,662,10)+.9*B5_G(w,453,14)+.55*B5_G(w,642,10);
const B5_ABSMAX=Math.max(...range(301).map(i=>B5_abs0(400+i)));
const B5_absorb=w=>B5_abs0(w)/B5_ABSMAX;
const B5_act0=w=>.85*B5_G(w,440,26)+B5_G(w,675,14)+.28*B5_G(w,560,55);
const B5_ACTMAX=Math.max(...range(301).map(i=>B5_act0(400+i)));
const B5_action=w=>B5_act0(w)/B5_ACTMAX;
function B5_wl(w){let r=0,g=0,b=0;if(w<440){r=(440-w)/40*.6;b=1}else if(w<490){g=(w-440)/50;b=1}else if(w<510){g=1;b=(510-w)/20}else if(w<580){r=(w-510)/70;g=1}else if(w<645){r=1;g=(645-w)/65}else r=1;const f=w>680?.4+.6*(700-w)/20:1;return '#'+[r,g,b].map(v=>Math.round(clamp(v*f,0,1)*230+20).toString(16).padStart(2,'0')).join('')}
SCENE({id:'photosynthesis-engelmann',name:'Which colours drive it?',tag:'Engelmann’s bacteria, 1882',
 definition:'An action spectrum shows how strongly each colour of light drives photosynthesis. It matches the absorption of chlorophyll: strong in blue and red, weak in green.',
 example:'Engelmann shone a tiny spectrum along a strand of alga. Oxygen-seeking bacteria crowded at the red and blue parts and avoided the green.',
 desc:'A strand of green alga lit by a spectrum, with bacteria gathering where oxygen is released, above the action spectrum and chlorophyll’s absorption.',
 research:'Engelmann, T. W. (1882). Über Sauerstoffausscheidung von Pflanzenzellen im Mikrospektrum. Pflügers Archiv 27, 485–489. Curves are approximate shapes; the green dip is filled partly by carotenoids and by light passing through thick leaves.',
 dur:10,hint:'Sweep a narrow band of light along the strand, or switch to the full spectrum to see where the bacteria gather.',
 init:()=>({mode:'band',wl:660}),
 watch(p){return p<.6?{mode:'band',wl:Math.round(400+300*p/.6)}:{mode:'full',wl:660}},
 ui:[{choose:[['band','Narrow band'],['full','Full spectrum']],label:'Light',get:s=>s.mode,act:'mode'},
  {range:'wl',label:'Band colour (wavelength)',min:400,max:700,step:5,get:s=>s.wl,act:'wl',show:v=>v+' nm'}],
 on:{mode(s,v){s.mode=v;return 'keep'},wl(s,v){s.wl=Number(v);return 'keep'}},
 draw(s){
  const X=w=>60+(w-400)/300*480;let out=heading('Bacteria gather where the alga makes oxygen',26);
  for(let w=400;w<700;w+=5){const lit=s.mode==='full'||Math.abs(w-s.wl)<=15;out+=R(X(w),146,X(w+5)-X(w)+.6,14,lit?B5_wl(w):'#e3e8ec','none',0)}
  out+=R(60,108,480,12,C.green,'none',6);
  const r=B5_rng(5);for(let i=0;i<60;i++){const w=400+i*5+2.5,lit=s.mode==='full'||Math.abs(w-s.wl)<=15,n=lit?Math.round(9*B5_action(w)):0;for(let j=0;j<n;j++){out+=Ci(X(w)+(r()-.5)*7,114+(r()<.5?-1:1)*(10+r()*18),2.2,C.dark)}}
  out+=TF(60,66,'aerobic bacteria (dots) swim towards oxygen',13,C.muted,'start');
  const pl=B5_plot(60,196,480,110,[400,700],[0,1.05],{xt:[[400,'400'],[500,'500'],[600,'600'],[700,'700 nm']],yt:[]});
  out+=pl.svg+B5_poly(range(61).map(i=>[pl.X(400+i*5),pl.Y(B5_absorb(400+i*5))]),C.green,2,'stroke-dasharray="6 4"')+B5_poly(range(61).map(i=>[pl.X(400+i*5),pl.Y(B5_action(400+i*5))]),C.coral,2.6);
  if(s.mode==='band')out+=L(pl.X(s.wl),196,pl.X(s.wl),306,C.ink,1.5,'stroke-dasharray="3 4"');
  out+=TF(60,350,'coral: action spectrum · dashed green: chlorophyll absorption (approximate)',13,C.muted,'start');
  out+=TF(540,184,s.mode==='band'?`band at ${s.wl} nm: drive ${Math.round(B5_action(s.wl)*100)}%`:'full spectrum',13,C.ink,'end');
  return {svg:out,phase:'Engelmann used living bacteria as oxygen meters. The crowding at red and blue shows that the light chlorophyll absorbs is the light that drives photosynthesis. Green is reflected, which is why leaves look green, though it is not wasted entirely: some is absorbed deeper in the leaf and by other pigments.'};
 }});

// Ruben & Kamen (1941): heavy oxygen shows that O2 comes from water; van Niel's sulphur bacteria.
const B5_LAB={water:{n:'heavy oxygen in the water',w:.85,co2:.2,o2:.85},co2:{n:'heavy oxygen in the CO₂',w:.2,co2:.68,o2:.2},h2s:{n:'van Niel’s sulphur bacteria'}};
SCENE({id:'photosynthesis-oxygen',name:'Where the oxygen comes from',tag:'Ruben and Kamen, 1941',
 definition:'The oxygen gas released in photosynthesis comes from splitting water, not from carbon dioxide. The oxygen atoms of CO₂ end up in the sugar.',
 example:'When the water was enriched in the heavy isotope oxygen-18, the oxygen gas released was enriched by the same amount; labelling the carbon dioxide left the gas at background level.',
 desc:'The overall equation with labelled oxygen atoms coloured, and bars for the share of heavy oxygen in the water, the carbon dioxide and the oxygen produced; or van Niel’s sulphur-bacteria equation, which suggested the answer first.',
 research:'Ruben, S., Randall, M., Kamen, M. & Hyde, J. L. (1941). Heavy oxygen (O18) as a tracer in the study of photosynthesis. Journal of the American Chemical Society 63, 877–879. van Niel, C. B. (1931). On the morphology and physiology of the purple and green sulphur bacteria. Archiv für Mikrobiologie 3, 1–112. Values are approximate.',
 dur:10,hint:'Choose which ingredient carries the heavy oxygen and follow the coloured atoms to the products.',
 init:()=>({lab:'water'}),
 watch(p){return {lab:p<.4?'water':p<.75?'co2':'h2s'}},
 ui:[{choose:[['water','Label the water'],['co2','Label the CO₂'],['h2s','Sulphur bacteria']],label:'Experiment',get:s=>s.lab,act:'lab'}],
 on:{lab(s,v){s.lab=v;return 'keep'}},
 draw(s){
  let out=heading(s.lab==='h2s'?'Van Niel: sulphur bacteria release sulphur, not oxygen':'Following heavy oxygen through photosynthesis',26);
  const hw=s.lab==='water',hc=s.lab==='co2',hot=C.coral,cold=C.blue;
  const mol=(x,y,t,c)=>R(x,y,92,34,c===hot?C.coralp:C.pale,c,8)+TF(x+46,y+23,t,15,c);
  if(s.lab==='h2s'){
   out+=mol(40,80,'CO₂',cold)+mol(150,80,'2 H₂S',C.amber)+arrow(258,97,302,97,C.ink,2.5)+mol(310,80,'sugar',cold)+mol(412,80,'2 S',C.amber)+mol(310,130,'H₂O',cold);
   out+=TF(300,214,'CO₂ + 2 H₂S → (CH₂O) + H₂O + 2 S',16,C.ink);
   out+=TF(300,246,'Here the sulphur comes from the H₂S the bacteria split.',14,C.ink);
   out+=TF(300,272,'By analogy, van Niel argued, plants split water: CO₂ + 2 H₂O → (CH₂O) + H₂O + O₂.',13,C.muted);
   out+=TF(300,300,'The oxygen gas would then come from water, which the 1941 isotope work tested.',13,C.muted);
  }else{
   out+=mol(30,70,'6 CO₂',hc?hot:cold)+mol(30,118,'12 H₂O',hw?hot:cold)+arrow(132,108,190,108,C.ink,2.5);
   out+=mol(200,46,'C₆H₁₂O₆',hc?hot:cold)+mol(200,94,'6 O₂',hw?hot:cold)+mol(200,142,'6 H₂O',hc?hot:cold);
   out+=TF(150,206,'coral = carries the heavy label',13,hot);
   const L5=B5_LAB[s.lab],pl=B5_plot(340,60,230,170,[0,3],[0,1],{yt:[[0,'0'],[.2,'0.2'],[.5,'0.5'],[1,'1.0']],yl:'heavy oxygen (%)'});
   out+=pl.svg+L(340,pl.Y(.2),570,pl.Y(.2),C.muted,1.2,'stroke-dasharray="4 4"');
   [['water',L5.w],['CO₂',L5.co2],['O₂ made',L5.o2]].forEach(([n,v],i)=>{const x=pl.X(i+.5);out+=R(x-24,pl.Y(v),48,pl.Y(0)-pl.Y(v),i===2?C.green:C.blue,'none',3)+TF(x,pl.Y(v)-6,v.toFixed(2),13,C.ink)+TF(x,252,n,13,C.muted)});
   out+=TF(455,278,'dashed line: natural level, 0.20%',13,C.muted);
   out+=TF(300,310,hw?'The O₂ matches the water: the gas comes from water.':'The O₂ stays at the natural level: none of it comes from CO₂.',14,C.ink);
   out+=TF(300,336,'Labelled CO₂ oxygen ends up in the sugar and the new water instead.',13,C.muted);
  }
  return {svg:out,phase:'Writing the equation with 12 H₂O on the left and 6 H₂O on the right makes the bookkeeping honest: all 12 oxygen atoms of the O₂ come from water. Ruben and Kamen’s experiments had complications, because oxygen exchanges slowly between water and carbonate, and later work with better controls confirmed the conclusion.'};
 }});

/* ================================================================ respiration-atp */
// Lavoisier & Laplace (1783): an animal's heat matches slow combustion.
SCENE({id:'respiration-atp',name:'Respiration is slow burning',tag:'Lavoisier and Laplace’s ice calorimeter',
 definition:'Respiration releases energy from food by the same overall chemistry as burning, combining it with oxygen to give carbon dioxide and water, but slowly and in controlled steps.',
 example:'A guinea pig in an ice calorimeter melted about 13 ounces of ice in 10 hours. Burning enough charcoal to make the same carbon dioxide would melt about 10½ ounces.',
 desc:'Two ice calorimeters, one holding a guinea pig and one burning charcoal, with melted water collecting over the hours and a comparison scaled to equal carbon dioxide.',
 research:'Lavoisier, A.-L. & Laplace, P.-S. (1783). Mémoire sur la chaleur. Mémoires de l’Académie royale des sciences. Kleiber, M. (1961). The Fire of Life. Values are as usually reported and approximate.',
 dur:10,hint:'Run the hours forward and compare the meltwater from the animal with that from charcoal making the same carbon dioxide.',
 init:()=>({h:10}),
 watch(p){return {h:Math.round(10*smooth(p/.85)*2)/2}},
 ui:[{range:'h',label:'Hours',min:0,max:10,step:.5,get:s=>s.h,act:'h',show:v=>v+' h'}],
 on:{h(s,v){s.h=Number(v);return 'keep'}},
 draw(s){
  const a=1.3*s.h,c=1.04*s.h;let out=heading('Heat from an animal and from charcoal, measured in melted ice',26);
  const cal=(x,label,icon,melt)=>{let o=R(x,56,180,190,'#e7f2fa',C.line,10)+R(x+30,86,120,120,'#fff',C.line,8)+TF(x+90,76,'ice jacket',13,C.muted);
   o+=icon(x+90,150);o+=L(x+90,246,x+90,262,C.blue,3);o+=R(x+50,262,80,60,'#fff',C.dark,4)+R(x+52,320-Math.min(56,melt*3.6),76,Math.min(56,melt*3.6),'#9ccbe8','none',2);
   o+=TF(x+90,344,`${label}: ${B5_num(melt)} oz`,14,C.ink);return o};
  out+=cal(60,'guinea pig',(x,y)=>P(`M${x-34} ${y+20} q6 -36 36 -36 q30 0 34 36 Z`,C.dark,2,'#d8b48a')+Ci(x-26,y-2,5,'#d8b48a',C.dark),a);
  out+=cal(330,'charcoal, same CO₂',(x,y)=>P(`M${x-26} ${y+22} h52 l-8 -18 h-36 Z`,C.dark,2,'#3a3a3a')+P(`M${x} ${y-2} q-10 -14 0 -28 q10 14 0 28 Z`,C.amber,1.5,'#ffd36b'),c);
  out+=TF(300,372,s.h>0?`The animal gave ${Math.round(a/c*100)}% of the heat of burning: close, as Lavoisier hoped.`:'Run the hours forward.',14,C.ink);
  return {svg:out,phase:'Lavoisier and Laplace concluded that respiration is a slow combustion and that animal heat comes from it. The match was rough: the animal gave somewhat more heat. Part of the gap is real, because food also contains hydrogen that burns to water without making carbon dioxide, and part is error in a hard measurement.'};
 }});

// ATP from one glucose, stage by stage; with and without oxygen.
const B5_STAGES=[{n:'Glycolysis',where:'cytoplasm',atp:2,nadh:2,fadh:0},{n:'Link reaction',where:'matrix',atp:0,nadh:2,fadh:0},{n:'Krebs cycle',where:'matrix',atp:2,nadh:6,fadh:2},{n:'Electron transport',where:'inner membrane',atp:0,nadh:0,fadh:0}];
function B5_yield(stage,o2){if(!o2)return {atp:stage>=1?2:0,ox:0};let atp=0,nadh=0,fadh=0;for(let i=0;i<Math.min(stage,3);i++){atp+=B5_STAGES[i].atp;nadh+=B5_STAGES[i].nadh;fadh+=B5_STAGES[i].fadh}const ox=stage>=4?Math.round(2*1.5+8*2.5+fadh*1.5):0;return {atp:atp+ox,ox,nadh,fadh}}
SCENE({id:'respiration-atp-yield',name:'How much ATP?',tag:'From one glucose',
 definition:'ATP is the cell’s energy currency. Glycolysis makes 2 ATP from a glucose without oxygen; with oxygen, the Krebs cycle and electron transport chain raise the total to about 30–32.',
 example:'Without oxygen, muscle turns pyruvate into lactate to keep glycolysis going and gets only 2 ATP per glucose.',
 desc:'The stages of respiration as steps, with an ATP bar growing as each stage is added, a switch for oxygen, and the older textbook count of 38 for comparison.',
 research:'Hinkle, P. C. (2005). P/O ratios of mitochondrial oxidative phosphorylation. Biochimica et Biophysica Acta 1706, 1–11 (about 2.5 ATP per NADH, 1.5 per FADH₂). Krebs, H. A. & Johnson, W. A. (1937). The role of citric acid in intermediate metabolism in animal tissues. Enzymologia 4, 148–156.',
 dur:10,hint:'Step through the stages with and without oxygen. The modern count of about 30–32 replaced the 36–38 in older textbooks.',
 init:()=>({stage:4,o2:true}),
 watch(p){return {stage:Math.min(4,Math.floor(p*6)),o2:p<.85}},
 ui:[{b:'Previous stage',act:'prev'},{b:'Next stage',act:'next'},{choose:[['on','Oxygen present'],['off','No oxygen']],label:'Oxygen',get:s=>s.o2?'on':'off',act:'o2'}],
 on:{prev(s){s.stage=Math.max(0,s.stage-1);return 'keep'},next(s){s.stage=Math.min(4,s.stage+1);return 'keep'},o2(s,v){s.o2=v==='on';return 'keep'}},
 draw(s){
  const y=B5_yield(s.stage,s.o2);let out=heading(s.o2?'Respiration with oxygen':'Without oxygen: glycolysis and fermentation',26);
  B5_STAGES.forEach((st,i)=>{const on=i<s.stage&&(s.o2||i===0),yy=56+i*68;out+=R(30,yy,270,52,on?C.greenp:'#f1f5f7',on?C.green:C.line,10);
   out+=TBF(44,yy+22,st.n,14,on?C.ink:C.muted,'start')+TF(44,yy+42,st.where,13,C.muted,'start');
   const g=i===3?(s.o2&&s.stage>=4?`+${y.ox} ATP`:''):(on?`+${st.atp} ATP${st.nadh?`, ${st.nadh} NADH`:''}${st.fadh?`, ${st.fadh} FADH₂`:''}`:'');
   out+=TF(290,yy+42,g,13,C.green,'end');
   if(i<3)out+=arrow(145,yy+52,145,yy+66,C.line,2,6)});
  if(!s.o2&&s.stage>=1)out+=R(30,328,270,34,C.amberp,'none',8)+TF(165,350,'pyruvate → lactate (or ethanol)',13,C.amber);
  const pl=B5_plot(330,56,90,272,[0,1],[0,40],{yt:[[0,'0'],[10,'10'],[20,'20'],[30,'30'],[40,'40']],yl:'ATP'});
  out+=pl.svg+R(pl.X(.15),pl.Y(y.atp),pl.X(.85)-pl.X(.15),pl.Y(0)-pl.Y(y.atp),C.green,'none',3);
  out+=L(330,pl.Y(38),420,pl.Y(38),C.coral,1.5,'stroke-dasharray="5 4"')+TF(426,pl.Y(38)+4,'old textbook: 38',13,C.coral,'start');
  out+=L(330,pl.Y(32),420,pl.Y(32),C.muted,1.5,'stroke-dasharray="3 3"')+TF(426,pl.Y(32)+4,'modern: 30–32',13,C.muted,'start');
  out+=y.atp>=4?TBF(375,pl.Y(y.atp)+22,String(y.atp),16,'#fff'):TBF(375,pl.Y(y.atp)-8,String(y.atp),16,C.green);
  out+=TF(426,200,'per glucose',13,C.muted,'start');
  out+=TF(426,240,s.o2?'NADH and FADH₂ pay':'Fermentation recycles',13,C.ink,'start')+TF(426,257,s.o2?'out only in the last stage.':'NADH but adds no ATP.',13,C.ink,'start');
  return {svg:out,phase:'Most of the ATP comes at the end, when electrons from NADH and FADH₂ flow to oxygen. Older books assumed 3 ATP per NADH and 2 per FADH₂, giving 36–38; measured ratios are nearer 2.5 and 1.5, and some energy is spent moving molecules into the mitochondrion, so about 30–32 is the modern estimate.'};
 }});

// Mitchell's chemiosmosis (1961) and Jagendorf & Uribe's acid bath (1966).
SCENE({id:'respiration-atp-chemiosmosis',name:'A proton gradient makes ATP',tag:'Mitchell’s chemiosmosis',
 definition:'In chemiosmosis, the electron transport chain pumps protons (H⁺) across a membrane, and the protons flowing back through ATP synthase drive it to make ATP, like water through a mill.',
 example:'Chloroplast membranes soaked in acid and then moved to an alkaline bath made ATP in complete darkness: the gradient alone was enough.',
 desc:'A membrane with pumps moving protons across it and ATP synthase letting them back, with the gradient, the ATP made and the heat lost; an uncoupler can be added, or the acid-bath experiment run.',
 research:'Mitchell, P. (1961). Coupling of phosphorylation to electron and hydrogen transfer by a chemi-osmotic type of mechanism. Nature 191, 144–148. Jagendorf, A. T. & Uribe, E. (1966). ATP formation caused by acid–base transition of spinach chloroplasts. PNAS 55, 170–177.',
 dur:12,hint:'Change the pumping rate and add the uncoupler; then try the acid bath, choosing how alkaline the second bath is.',
 init:()=>({mode:'cell',pump:60,unc:false,ph:8}),
 watch(p){return p<.35?{mode:'cell',pump:Math.round(100*p/.35),unc:false,ph:8}:p<.65?{mode:'cell',pump:80,unc:true,ph:8}:{mode:'bath',pump:0,unc:false,ph:Math.round(4+5*(p-.65)/.35)}},
 ui:[{choose:[['cell','Working membrane'],['bath','Acid bath (1966)']],label:'Experiment',get:s=>s.mode,act:'mode'},
  {range:'pump',label:'Electron flow (pumping)',min:0,max:100,step:5,get:s=>s.pump,act:'pump',show:v=>v+'%'},
  {choose:[['off','No uncoupler'],['on','Add uncoupler']],label:'Uncoupler',get:s=>s.unc?'on':'off',act:'unc'},
  {range:'ph',label:'Second bath pH',min:4,max:9,step:.5,get:s=>s.ph,act:'ph',show:v=>'pH '+v}],
 on:{mode(s,v){s.mode=v;return 'keep'},pump(s,v){s.pump=Number(v);return 'keep'},unc(s,v){s.unc=v==='on';return 'keep'},ph(s,v){s.ph=Number(v);return 'keep'}},
 draw(s){
  let grad,atp,heat;
  if(s.mode==='cell'){const leak=.2+(s.unc?3:0),use=1;grad=(s.pump/100)/(leak+use);atp=use*grad;heat=leak*grad}
  else{grad=Math.max(0,s.ph-4)/5;atp=Math.max(0,grad-.25)/.75*.8;heat=0}
  let out=heading(s.mode==='cell'?'Pumped protons drive ATP synthase':'The acid bath: a gradient without light',26);
  out+=R(20,170,400,40,'#f3dfa8','none',4)+TF(30,60,s.mode==='cell'?'space between membranes':'inside the thylakoid (pH 4)',13,C.muted,'start')+TF(30,300,s.mode==='cell'?'matrix':'outside: the second bath',13,C.muted,'start');
  const nTop=Math.round(4+26*Math.min(1,grad)),nBot=Math.round(14-10*Math.min(1,grad)),top=shuffled(range(30),91),bot=shuffled(range(14),92);
  for(let i=0;i<nTop;i++){const c=top[i];out+=TF(44+(c%10)*38,84+Math.floor(c/10)*26,'H⁺',13,C.coral)}
  for(let i=0;i<nBot;i++){const c=bot[i];out+=TF(44+(c%7)*34,258+Math.floor(c/7)*26,'H⁺',13,C.coral)}
  if(s.mode==='cell'){[70,150].forEach(x=>{out+=R(x,162,44,56,C.purplep,C.purple,8);if(s.pump>0)out+=arrow(x+22,212,x+22,150,C.purple,2.5,7)});out+=TF(132,234,'electron transport pumps',13,C.purple)}
  out+=R(300,160,40,60,C.greenp,C.green,8)+Ci(320,240,22,C.greenp,C.green)+TF(320,246,'ATP',13,C.green);
  if(atp>.02)out+=arrow(320,150,320,206,C.coral,2.5,7);
  out+=TF(320,284,'ATP synthase',13,C.green);
  if(s.mode==='cell'&&s.unc)out+=R(222,166,26,48,C.amberp,C.amber,6)+arrow(235,160,235,214,C.amber,2.5,7)+TF(235,230,'leak',13,C.amber);
  out+=R(440,56,142,250,C.pale,'none',10);
  const bar=(y,label,v,col)=>R(452,y,Math.max(2,118*Math.min(1,v)),14,col,'none',3)+TF(452,y-6,label,13,C.ink,'start');
  out+=bar(90,'proton gradient',grad,C.coral)+bar(140,'ATP made',atp,C.green)+bar(190,'heat',heat,C.amber);
  out+=TF(452,236,s.mode==='bath'?`jump from pH 4 to ${s.ph}`:s.unc?'Uncoupler: protons':'',13,C.ink,'start');
  out+=TF(452,253,s.mode==='bath'?(atp>.02?'ATP made in the dark':'too small a jump'):s.unc?'leak back as heat':'',13,C.ink,'start');
  out+=TF(300,350,s.mode==='cell'?'Pumping charges the battery; the synthase spends it to make ATP.':'No light, no electron flow: only the pH difference across the membrane.',13,C.muted);
  return {svg:out,phase:s.mode==='cell'?'An uncoupler makes the membrane leaky, so the energy escapes as heat. The uncoupler 2,4-dinitrophenol was sold as a slimming drug in the 1930s and killed people by overheating. Brown fat uses a natural leak, a protein called UCP1, to keep newborns warm.':'Peter Mitchell’s idea was widely doubted in the 1960s because it needed no high-energy chemical intermediate. Jagendorf and Uribe’s acid bath, which made ATP from a pH jump alone, was some of the strongest early evidence. Mitchell won the Nobel Prize in 1978.'};
 }});

/* ================================================================ homeostasis */
// Body temperature with negative feedback: shivering and sweating against the surroundings.
function B5_temp(E,fb,set){const k=.05,M=.6,g=2,out=[];let T=37,Tn=37;for(let t=0;t<=120;t+=.5){out.push([t,T,Tn]);const resp=fb?clamp(g*(set-T),-6,4):0;T+=.5*(M+resp-k*(T-E));Tn+=.5*(M-k*(Tn-E))}return out}
SCENE({id:'homeostasis',name:'Keeping steady',tag:'Bernard and Cannon',
 definition:'Homeostasis is the body’s work of keeping its internal conditions, such as temperature and blood sugar, within narrow limits. Most of it is negative feedback: a change triggers a response that pushes back.',
 example:'In a cold room, shivering makes heat and core temperature stays near 37 °C. Without that feedback the body would drift towards the room’s temperature.',
 desc:'Core temperature over two hours after moving into a new surrounding temperature, with feedback (shivering or sweating) and without it, and a fever option that raises the set point.',
 research:'Bernard, C. (1865). Introduction à l’étude de la médecine expérimentale (the milieu intérieur). Cannon, W. B. (1932). The Wisdom of the Body. Norton. The model here is a cartoon with one heat balance and one effector.',
 dur:10,hint:'Change the surroundings and switch the feedback off to see why it matters. Fever raises the set point: the body then shivers to heat itself up.',
 init:()=>({E:5,fb:true,set:37}),
 watch(p){return {E:Math.round(-10+55*p),fb:true,set:37}},
 ui:[{range:'E',label:'Surroundings',min:-10,max:45,step:1,get:s=>s.E,act:'E',show:v=>v+' °C'},
  {choose:[['on','Feedback on'],['off','Feedback off']],label:'Feedback',get:s=>s.fb?'on':'off',act:'fb'},
  {choose:[['37','Normal (37 °C)'],['39','Fever (39 °C)']],label:'Set point',get:s=>String(s.set),act:'set'}],
 on:{E(s,v){s.E=Number(v);return 'keep'},fb(s,v){s.fb=v==='on';return 'keep'},set(s,v){s.set=Number(v);return 'keep'}},
 draw(s){
  const d=B5_temp(s.E,s.fb,s.set),last=d[d.length-1],T=last[1],resp=s.fb?clamp(2*(s.set-T),-6,4):0;
  let out=heading('Core temperature after moving into new surroundings',26);
  const pl=B5_plot(70,56,320,236,[0,120],[0,60],{xt:[[0,'0'],[30,'30'],[60,'60'],[90,'90'],[120,'120']],yt:[[0,'0'],[20,'20'],[37,'37'],[60,'60']],xl:'minutes',yl:'core temperature (°C)'});
  out+=pl.svg+R(70,pl.Y(38),320,pl.Y(36)-pl.Y(38),C.green,'none',0,'opacity=".22"');
  out+=L(70,pl.Y(clamp(s.E,0,60)),390,pl.Y(clamp(s.E,0,60)),C.amber,1.2,'stroke-dasharray="3 4"')+TF(386,pl.Y(clamp(s.E,0,60))-5,'surroundings',13,C.amber,'end');
  out+=B5_poly(d.map(q=>[pl.X(q[0]),pl.Y(clamp(q[2],0,60))]),C.muted,2,'stroke-dasharray="7 5"');
  if(s.fb)out+=B5_poly(d.map(q=>[pl.X(q[0]),pl.Y(clamp(q[1],0,60))]),C.blue,2.8);
  out+=R(410,56,172,236,C.pale,'none',10)+TBF(422,80,'After two hours',14,C.ink,'start');
  out+=TF(422,106,s.fb?`with feedback ${B5_num(T)} °C`:'feedback switched off',14,C.blue,'start');
  out+=TF(422,128,`without ${B5_num(last[2])} °C`,14,C.muted,'start');
  out+=TF(422,162,!s.fb?'No response':resp>.3?'Shivering: making heat':resp<-.3?'Sweating: losing heat':'Little response needed',14,resp>.3?C.coral:resp<-.3?C.blue:C.ink,'start');
  out+=TF(422,194,`set point ${s.set} °C`,13,C.muted,'start');
  out+=TF(422,226,'Feedback holds it close',13,C.muted,'start')+TF(422,243,'to the set point, but',13,C.muted,'start')+TF(422,260,'not exactly on it.',13,C.muted,'start');
  out+=TF(300,350,'blue: with feedback · dashed: without · green band: 36–38 °C',13,C.muted);
  return {svg:out,phase:'Claude Bernard argued that a stable “internal environment” is the condition for a free life; Walter Cannon named the process homeostasis. Negative feedback never cancels a disturbance completely: a small error remains, which is what drives the response. In fever the set point itself is raised, which is why a feverish person shivers while already hot.'};
 }});

// Blood glucose after a meal, with insulin feedback; type 1 and type 2 diabetes.
function B5_glucose(mode,meal,dose){const out=[];let G=5,X=0,I=0;const beta=mode==='healthy'?1:mode==='t2'?.5:0,Si=mode==='t2'?.1:1;
 for(let t=0;t<=300;t++){out.push([t,G]);const Ra=meal*.2*(t/45)*Math.exp(1-t/45);let sec=beta*Math.max(0,G-5)*.2;if(mode==='t1'&&dose>0)sec+=dose*.05*(t/30)*Math.exp(1-t/30);
  I+=sec-.08*I;X+=.04*I-.04*X;G+=Ra-.012*(G-4.6)-Si*.06*X*G/5+(G<4?.03*(4-G):0);G=Math.max(2.5,G)}
 return out}
SCENE({id:'homeostasis-glucose',name:'Blood sugar',tag:'Insulin and its discovery',
 definition:'After a meal, rising blood glucose triggers the pancreas to release insulin, which makes muscle, fat and liver take glucose up until the level falls back. In type 1 diabetes the insulin-making cells are lost; in type 2 the body responds weakly to insulin.',
 example:'A healthy person’s glucose usually peaks below about 8 mmol/L after a meal and is back near 5 within two to three hours.',
 desc:'Blood glucose over five hours after a meal for a healthy person, someone with type 1 diabetes with or without injected insulin, and someone with type 2 diabetes, against the usual healthy range.',
 research:'Banting, F. G., Best, C. H., Collip, J. B., Campbell, W. R. & Fletcher, A. A. (1922). Pancreatic extracts in the treatment of diabetes mellitus. Canadian Medical Association Journal 12, 141–146. Bergman, R. N. et al. (1979). Quantitative estimation of insulin sensitivity. American Journal of Physiology 236, E667–E677. The model is illustrative, not clinical.',
 dur:10,hint:'Choose a person and a meal size; for type 1, add an insulin dose before eating.',
 init:()=>({mode:'healthy',meal:1,dose:0}),
 watch(p){const i=Math.min(3,Math.floor(p*4));return [{mode:'healthy',meal:1,dose:0},{mode:'t2',meal:1,dose:0},{mode:'t1',meal:1,dose:0},{mode:'t1',meal:1,dose:6}][i]},
 ui:[{choose:[['healthy','Healthy'],['t1','Type 1'],['t2','Type 2']],label:'Person',get:s=>s.mode,act:'mode'},
  {range:'meal',label:'Meal size',min:.5,max:2,step:.25,get:s=>s.meal,act:'meal',show:v=>'×'+v},
  {range:'dose',label:'Injected insulin (type 1)',min:0,max:10,step:1,get:s=>s.dose,act:'dose',show:v=>v+' units'}],
 on:{mode(s,v){s.mode=v;return 'keep'},meal(s,v){s.meal=Number(v);return 'keep'},dose(s,v){s.dose=Number(v);return 'keep'}},
 draw(s){
  const d=B5_glucose(s.mode,s.meal,s.dose),peak=Math.max(...d.map(q=>q[1])),at2=d[120][1];
  let out=heading({healthy:'A healthy response to a meal',t1:'Type 1 diabetes: no insulin of its own',t2:'Type 2 diabetes: insulin works weakly'}[s.mode],26);
  const pl=B5_plot(70,56,320,236,[0,300],[0,20],{xt:[[0,'0'],[60,'1'],[120,'2'],[180,'3'],[240,'4'],[300,'5 h']],yt:[[0,'0'],[4,'4'],[7.8,'7.8'],[12,'12'],[20,'20']],xl:'hours after the meal',yl:'blood glucose (mmol/L)'});
  out+=pl.svg+R(70,pl.Y(7.8),320,pl.Y(4)-pl.Y(7.8),C.greenp,'none',0,'opacity=".7"');
  out+=B5_poly(d.map(q=>[pl.X(q[0]),pl.Y(clamp(q[1],0,20))]),s.mode==='healthy'?C.blue:C.coral,2.8);
  out+=L(pl.X(120),56,pl.X(120),292,C.muted,1.2,'stroke-dasharray="3 4"');
  out+=R(410,56,172,236,C.pale,'none',10)+TBF(422,80,'Readings',14,C.ink,'start');
  out+=TF(422,106,`peak ${B5_num(peak)} mmol/L`,14,C.ink,'start')+TF(422,128,`at 2 hours ${B5_num(at2)}`,14,at2>7.8?C.coral:C.green,'start');
  out+=TF(422,162,at2>7.8?'Above the usual range':'Back within range',14,at2>7.8?C.coral:C.green,'start');
  out+=TF(422,196,'green band: 4–7.8 mmol/L,',13,C.muted,'start')+TF(422,213,'a common two-hour limit',13,C.muted,'start');
  if(s.mode==='t1')out+=TF(422,248,s.dose?`with ${s.dose} units injected`:'no insulin given',13,C.ink,'start');
  const lo=Math.min(...d.map(q=>q[1]));if(lo<4)out+=TF(422,270,`dips to ${B5_num(lo)}: too low`,13,C.coral,'start');
  out+=TF(300,350,'An illustrative model with insulin feedback; real responses vary widely.',13,C.muted);
  return {svg:out,phase:'Insulin was first purified for use in people in Toronto in 1921–22 by Frederick Banting, Charles Best, James Collip and John Macleod; before it, type 1 diabetes was fatal. The Nobel Prize went to Banting and Macleod, who shared it with Best and Collip. Here the injected insulin arrives slowly, so a dose too large or too early can push glucose below the range, a real danger in treatment.'};
 }});

// Delayed negative feedback oscillates: x'(t) = −g·x(t−τ).
function B5_delay(g,tau){const dt=.02,n=Math.round(20/dt),lag=Math.round(tau/dt),x=new Float64Array(n+1);x[0]=1;for(let i=0;i<n;i++){const past=i-lag>=0?x[i-lag]:1;x[i+1]=x[i]-dt*g*past}return x}
SCENE({id:'homeostasis-delay',name:'When feedback is slow',tag:'Delays make oscillations',
 definition:'Negative feedback with a delay can overshoot: by the time the correction arrives, it is too late and too strong, and the system swings. For the simplest delayed feedback, it settles only if gain × delay is below π/2 ≈ 1.57.',
 example:'In heart failure, slow blood circulation delays the signal from blood carbon dioxide to the brain, and breathing can cycle between deep and shallow (Cheyne–Stokes breathing).',
 desc:'A disturbance corrected by negative feedback with an adjustable strength and delay, plotted over time, with the gain × delay product against the stability limit.',
 research:'Mackey, M. C. & Glass, L. (1977). Oscillation and chaos in physiological control systems. Science 197, 287–289. Hayes, N. D. (1950). Roots of the transcendental equation associated with a certain difference-differential equation. Journal of the London Mathematical Society 25, 226–232 (the π/2 limit).',
 dur:10,hint:'Raise the delay or the strength. Below about 0.37 the return is smooth; above 1.57 the swings grow.',
 init:()=>({g:1,tau:1}),
 watch(p){return {g:1,tau:Math.round(2*p*20)/20}},
 ui:[{range:'g',label:'Feedback strength',min:.2,max:3,step:.1,get:s=>s.g,act:'g',show:v=>Number(v).toFixed(1)},
  {range:'tau',label:'Delay',min:0,max:2,step:.05,get:s=>s.tau,act:'tau',show:v=>Number(v).toFixed(2)+' s'}],
 on:{g(s,v){s.g=Number(v);return 'keep'},tau(s,v){s.tau=Number(v);return 'keep'}},
 draw(s){
  const x=B5_delay(s.g,s.tau),gt=s.g*s.tau;let out=heading('A disturbance and its correction',26);
  const pl=B5_plot(70,56,360,230,[0,20],[-2,2],{xt:[[0,'0'],[5,'5'],[10,'10'],[15,'15'],[20,'20 s']],yt:[[-2,'−2'],[0,'0'],[1,'1'],[2,'2']],xl:'time',yl:'distance from the set point'});
  out+=pl.svg+L(70,pl.Y(0),430,pl.Y(0),C.green,1.5);
  out+=B5_poly(range(501).map(i=>[pl.X(i*.04),pl.Y(clamp(x[i*2],-2,2))]),C.blue,2.6);
  const status=gt<1/Math.E?['Smooth return',C.green]:gt<Math.PI/2?['Damped swings',C.amber]:['Growing swings',C.coral];
  out+=R(450,56,132,230,C.pale,'none',10)+TBF(462,80,'gain × delay',14,C.ink,'start')+TBF(462,108,gt.toFixed(2),20,status[1],'start');
  out+=TF(462,134,status[0],14,status[1],'start');
  const sc=v=>276-v/3*104;out+=L(470,sc(0),470,sc(3),C.line,6);
  [[1/Math.E,'0.37'],[Math.PI/2,'1.57']].forEach(([v,l])=>out+=L(462,sc(v),478,sc(v),C.ink,1.5)+TF(484,sc(v)+4,l,13,C.muted,'start'));
  out+=Ci(470,sc(Math.min(3,gt)),6,status[1],'#fff');
  out+=TF(300,346,'Strong, fast feedback is good; strong, slow feedback swings.',14,C.ink);
  return {svg:out,phase:'The same mathematics appears in thermostats, populations and economies. Below 1/e the correction simply decays; up to π/2 it rings and settles; beyond that each correction overshoots the last. Mackey and Glass called illnesses that arise this way “dynamical diseases”.'};
 }});

/* ================================================================ scaling-laws */
// Kleiber's law: basal metabolic rate against body mass on log–log axes.
const B5_ANIM=[['mouse',.025],['rat',.3],['rabbit',2.5],['cat',4],['dog',15],['sheep',50],['human',70],['pig',150],['cow',500],['horse',600],['elephant',3700]];
const B5_KL=B5_ANIM.map(([n,m],i)=>{const r=B5_rng(40+i);return {n,m,B:3.4*Math.pow(m,.75)*Math.exp(.12*B5_gauss(r))}});
function B5_klFit(b){const lx=B5_KL.map(d=>Math.log10(d.m)),ly=B5_KL.map(d=>Math.log10(d.B)),la=sum(ly.map((y,i)=>y-b*lx[i]))/ly.length,rms=Math.sqrt(sum(ly.map((y,i)=>(y-la-b*lx[i])**2))/ly.length);return {la,rms}}
const B5_klBest=(()=>{const lx=B5_KL.map(d=>Math.log10(d.m)),ly=B5_KL.map(d=>Math.log10(d.B)),mx=sum(lx)/lx.length,my=sum(ly)/ly.length;return sum(lx.map((x,i)=>(x-mx)*(ly[i]-my)))/sum(lx.map(x=>(x-mx)**2))})();
SCENE({id:'scaling-laws',name:'Kleiber’s law',tag:'Metabolism and body size',
 definition:'Larger animals use more energy, but less per kilogram. Across mammals, resting metabolic rate grows roughly as body mass to the power ¾, a relation called Kleiber’s law.',
 example:'An elephant is about 150,000 times heavier than a mouse but uses only about 7,500 times as much energy at rest.',
 desc:'Resting metabolic rate against body mass for eleven mammals on log–log axes, with a fitted line whose slope, the scaling exponent, the learner sets.',
 research:'Kleiber, M. (1932). Body size and metabolism. Hilgardia 6, 315–353. White, C. R. & Seymour, R. S. (2003). Mammalian basal metabolic rate is proportional to body mass²ᐟ³. PNAS 100, 4046–4049. Points here are generated from Kleiber’s relation with scatter, for illustration.',
 dur:10,hint:'Move the exponent and watch the fit error; try the presets ⅔, ¾ and 1. With real data the best exponent is still argued over.',
 init:()=>({b:1}),
 watch(p){return {b:Math.round(lerp(1,.75,smooth(p/.8))*100)/100}},
 ui:[{range:'b',label:'Exponent (slope)',min:.5,max:1.1,step:.01,get:s=>s.b,act:'b',show:v=>Number(v).toFixed(2)},{b:'⅔',act:'pre',arg:'.6667'},{b:'¾',act:'pre',arg:'.75'},{b:'1',act:'pre',arg:'1'}],
 on:{b(s,v){s.b=Number(v);return 'keep'},pre(s,v){s.b=Number(v);return 'keep'}},
 draw(s){
  const f=B5_klFit(s.b);let out=heading('Resting metabolic rate against body mass',26);
  const pl=B5_plot(80,56,330,236,[-2,4],[-1,4],{xt:[[-2,'0.01'],[-1,'0.1'],[0,'1'],[1,'10'],[2,'100'],[3,'1000'],[4,'10⁴']],yt:[[-1,'0.1'],[0,'1'],[1,'10'],[2,'100'],[3,'1000'],[4,'10⁴']],xl:'body mass (kg, log scale)',yl:'resting rate (W, log scale)'});
  out+=pl.svg+L(pl.X(-2),pl.Y(clamp(f.la-2*s.b,-1,4)),pl.X(4),pl.Y(clamp(f.la+4*s.b,-1,4)),C.coral,2.4);
  B5_KL.forEach((d,i)=>{const x=pl.X(Math.log10(d.m)),y=pl.Y(Math.log10(d.B));out+=Ci(x,y,5.5,C.blue,'#fff');if(['mouse','human','elephant','rabbit','horse'].includes(d.n))out+=TF(x+(d.n==='elephant'?-8:8),y+(['horse','human','rabbit'].includes(d.n)?18:-8),d.n,13,C.ink,d.n==='elephant'?'end':'start')});
  out+=R(430,56,152,236,C.pale,'none',10)+TBF(442,80,`exponent ${s.b.toFixed(2)}`,15,C.coral,'start');
  out+=TF(442,106,`fit error ${f.rms.toFixed(3)}`,14,C.ink,'start')+TF(442,124,'(log₁₀ units)',13,C.muted,'start');
  out+=TF(442,156,`best for these: ${B5_klBest.toFixed(2)}`,14,C.blue,'start');
  out+=TF(442,190,'Slope 1: every kilo',13,C.muted,'start')+TF(442,207,'costs the same.',13,C.muted,'start');
  out+=TF(442,236,'Below 1: big bodies',13,C.muted,'start')+TF(442,253,'are cheaper per kilo.',13,C.muted,'start');
  out+=TF(300,350,`per kilogram, a mouse uses about ${Math.round(Math.pow(3700/.025,1-.75))} times as much as an elephant`,13,C.ink);
  return {svg:out,phase:'On log–log axes a power law is a straight line whose slope is the exponent. Kleiber’s ¾ became a textbook rule, but the value is debated: White and Seymour found close to ⅔ for basal rates once body temperature and digestion are controlled, and exponents differ between groups and with activity.'};
 }});

// A billion heartbeats? Heart rate falls and lifespan rises with size.
const B5_HB=[['mouse',.025,600,2],['rabbit',2.5,205,9],['dog',15,90,13],['horse',500,40,30],['elephant',4000,30,65],['human',70,70,80]];
SCENE({id:'scaling-laws-heartbeats',name:'A billion heartbeats?',tag:'Heart rate, lifespan and size',
 definition:'Heart rate falls with body size roughly as mass to the power −¼, and lifespan rises roughly as mass to the power ¼, so many mammals get a similar number of heartbeats in a lifetime: around a billion.',
 example:'A mouse’s heart beats about 600 times a minute for 2 years; an elephant’s about 30 times a minute for 65 years: about 0.6 and 1 billion beats.',
 desc:'Heart rate against body mass on log axes with the −¼ line, and bars for lifetime heartbeats of six mammals, including the human outlier.',
 research:'Levine, H. J. (1997). Rest heart rate and life expectancy. Journal of the American College of Cardiology 30, 1104–1106. Calder, W. A. (1984). Size, Function, and Life History. Harvard University Press. Rates and lifespans are approximate.',
 dur:10,hint:'Press an animal to see its numbers. Humans are the odd one out.',
 init:()=>({pick:'mouse'}),
 watch(p){return {pick:B5_HB[Math.min(5,Math.floor(p*6))][0]}},
 ui:B5_HB.map(a=>({b:a[0][0].toUpperCase()+a[0].slice(1),act:'pick',arg:a[0]})),
 on:{pick(s,v){s.pick=v;return 'keep'}},
 draw(s,f,X){
  let out=heading('Heart rate and lifetime heartbeats',26);
  const pl=B5_plot(70,56,240,220,[-2,4],[1,3],{xt:[[-2,'0.01'],[0,'1'],[2,'100'],[4,'10⁴ kg']],yt:[[1,'10'],[2,'100'],[3,'1000']],xl:'body mass (log scale)',yl:'heart rate (beats/min)'});
  out+=pl.svg+L(pl.X(-2),pl.Y(Math.log10(241)+.5),pl.X(4),pl.Y(Math.log10(241)-1),C.coral,2,'stroke-dasharray="7 5"');
  out+=TF(306,110,'≈ 241 · M^−¼',13,C.coral,'end');
  B5_HB.forEach(([n,m,hr])=>{const on=n===s.pick;out+=hit(X,'pick',n,n,Ci(pl.X(Math.log10(m)),pl.Y(Math.log10(hr)),on?8:5.5,on?C.coral:C.blue,'#fff'))});
  const beats=a=>a[2]*60*24*365.25*a[3]/1e9;
  B5_HB.forEach((a,i)=>{const y=60+i*36,on=a[0]===s.pick,w=beats(a)/3.2*150;out+=hit(X,'pick',a[0],a[0],R(400,y,Math.max(3,w),20,on?C.coral:C.blue,'none',3)+TF(394,y+15,a[0],13,on?C.coral:C.ink,'end'))+TF(404+Math.max(3,w),y+15,beats(a).toFixed(1),13,C.ink,'start')});
  out+=TF(470,290,'billion beats in a lifetime',13,C.muted);
  const a=B5_HB.find(q=>q[0]===s.pick);
  out+=TF(300,326,`${a[0]}: ${a[1]} kg, about ${a[2]} beats a minute, about ${a[3]} years`,14,C.ink);
  out+=TF(300,350,a[0]==='human'?'Humans live far longer than their size predicts: about 3 billion beats.':`≈ ${beats(a).toFixed(1)} billion beats: close to the mammal norm.`,13,a[0]==='human'?C.coral:C.muted);
  return {svg:out,phase:'The regularity is real but rough. It follows from heart rate scaling as M^−¼ and lifespan as about M^¼. Many animals break it: bats, birds and especially humans, with medicine and safer lives, live far longer than their heart rate suggests. It is a pattern, not a fixed budget you can spend faster or slower.'};
 }});

// Why ¾? Surface and volume, and the competing explanations.
const B5_THEORIES={rubner:{n:'Rubner’s surface law (1883)',e:'⅔',t:'Heat is lost through the skin, which grows as mass to the ⅔ power, so a warm-blooded animal’s heat production should too. Fits some data well, including White & Seymour’s basal rates.'},kleiber:{n:'Kleiber’s ¾ (1932)',e:'¾',t:'An empirical fit across animals from mice to steers. It became a textbook rule, more from its tidy number than from a theory.'},wbe:{n:'West, Brown & Enquist (1997)',e:'¾',t:'Derived ¾ from branching, space-filling supply networks such as blood vessels. Influential, but its mathematics and assumptions have been strongly criticised (Kozłowski & Konarzewski 2004).'},glazier:{n:'Glazier (2005)',e:'⅔ to 1',t:'The exponent is not universal: it varies with activity level, lifestyle and group, from about ⅔ to 1. Many biologists now favour this view.'}};
SCENE({id:'scaling-laws-surface',name:'Why not ⅔?',tag:'Surface, volume and theories',
 definition:'When a body grows, its surface grows as size squared but its volume as size cubed, so surface per unit volume falls. Larger animals have relatively less skin to lose heat through.',
 example:'A cube twice as wide has 4 times the surface but 8 times the volume, so half the surface per unit volume.',
 desc:'A cube scaled by a size factor with its surface, volume and their ratio, and a choice of explanations for the scaling exponent with their status.',
 research:'Rubner, M. (1883). Über den Einfluss der Körpergrösse auf Stoff- und Kraftwechsel. Zeitschrift für Biologie 19, 535–562. West, G. B., Brown, J. H. & Enquist, B. J. (1997). A general model for the origin of allometric scaling laws in biology. Science 276, 122–126. Kozłowski, J. & Konarzewski, M. (2004). Functional Ecology 18, 283–289. Glazier, D. S. (2005). Biological Reviews 80, 611–662.',
 dur:10,hint:'Grow the cube and watch the ratio fall; then read the four explanations. The debate is not settled.',
 init:()=>({k:2,th:'rubner'}),
 watch(p){return {k:Math.round((1+4*smooth(p/.5))*2)/2,th:p<.55?'rubner':p<.7?'kleiber':p<.85?'wbe':'glazier'}},
 ui:[{range:'k',label:'Size factor',min:1,max:5,step:.5,get:s=>s.k,act:'k',show:v=>'×'+v},
  {choose:[['rubner','Surface (⅔)'],['kleiber','Kleiber (¾)'],['wbe','Networks (¾)'],['glazier','It varies']],label:'Explanation',get:s=>s.th,act:'th'}],
 on:{k(s,v){s.k=Number(v);return 'keep'},th(s,v){s.th=v;return 'keep'}},
 draw(s){
  const k=s.k,side=24*k,ox=40,oy=300,d=side*.45;let out=heading('Surface against volume as a body grows',26);
  out+=P(`M${ox} ${oy} h${side} v${-side} h${-side} Z`,C.blue,2,C.pale)+P(`M${ox} ${oy-side} l${d} ${-d} h${side} l${-d} ${d} Z`,C.blue,2,'#cfe3f2')+P(`M${ox+side} ${oy} l${d} ${-d} v${-side} l${-d} ${d} Z`,C.blue,2,'#b4d4ec');
  out+=TF(ox+side/2,oy+22,`side ×${k}`,13,C.ink);
  out+=R(250,56,150,130,C.pale,'none',10);
  out+=TF(262,82,`surface ×${(k*k).toFixed(k%1?2:0)}`,14,C.ink,'start')+TF(262,106,`volume ×${(k**3).toFixed(k%1?3:0)}`,14,C.ink,'start')+TF(262,136,`surface per volume`,14,C.coral,'start')+TF(262,156,`÷${k}`,14,C.coral,'start');
  const T5=B5_THEORIES[s.th];out+=R(250,204,332,140,'#fff',C.line,10);
  out+=TBF(262,228,T5.n,14,C.ink,'start')+TBF(570,228,T5.e,14,C.coral,'end');
  const words=T5.t.split(' ');let line='',ly=252;words.forEach(w=>{if((line+' '+w).length>48){out+=TF(262,ly,line.trim(),13,C.ink,'start');line=w;ly+=18}else line+=' '+w});out+=TF(262,ly,line.trim(),13,C.ink,'start');
  out+=TF(300,370,'Bigger bodies keep heat better; how that sets the exponent is still argued.',13,C.muted);
  return {svg:out,phase:'Rubner’s dogs suggested heat production follows surface area. Kleiber’s wider data suggested ¾, and West, Brown and Enquist offered a network theory for it that drew both praise and detailed criticism. The honest summary is that the exponent depends on which animals and which state you measure.'};
 }});
