/* ===================== Stage 1 · Represent ===================== */
// A two-position switch used for inputs throughout the logic lessons.
function toggle(X,act,arg,x,y,on,label){
 const inner=R(x,y,74,40,on?C.blue:'#fff',on?C.blue:C.line,20)+Ci(on?x+54:x+20,y+20,14,on?'#fff':C.line)+T(x+37,y+62,label+' = '+(on?1:0),15,C.ink,'middle','font-weight="650"');
 return hit(X,act,arg,`Input ${label} is ${on?1:0}. Press to switch.`,inner);
}
function lamp(x,y,on,label){return Ci(x,y,24,on?'#ffd24a':'#eef2f4',on?'#c79100':C.line)+(on?Ci(x,y,34,'none','#ffd24a','opacity=".5"'):'')+T(x,y+52,label,15,C.ink,'middle','font-weight="650"')}
const wireCol=v=>v?C.blue:'#b9c9d3',wireW=v=>v?5:3;
function gateShape(type,x,y,col=C.dark){
 let d,bubble=false;
 if(type==='AND'||type==='NAND'){d=`M${x} ${y}H${x+45}A40 40 0 0 1 ${x+45} ${y+80}H${x}Z`;bubble=type==='NAND'}
 else if(type==='OR'||type==='XOR'||type==='NOR'){d=`M${x} ${y}Q${x+28} ${y+40} ${x} ${y+80}Q${x+62} ${y+80} ${x+92} ${y+40}Q${x+62} ${y} ${x} ${y}Z`;bubble=type==='NOR'}
 else {d=`M${x} ${y+5}L${x+78} ${y+40}L${x} ${y+75}Z`;bubble=true}
 let out=P(d,col,2.5,'#fff');
 if(type==='XOR')out+=P(`M${x-11} ${y}Q${x+17} ${y+40} ${x-11} ${y+80}`,col,2.5);
 if(bubble)out+=Ci(type==='NOT'?x+86:x+93,y+40,7,'#fff',col);
 out+=T(x+(type==='NOT'?30:38),y+46,type,14,C.muted,'middle','font-weight="700"');
 return out;
}
const GATES={AND:(a,b)=>a&b,OR:(a,b)=>a|b,NOT:a=>a?0:1,XOR:(a,b)=>a^b,NAND:(a,b)=>(a&b)?0:1};
function truthTable(x,y,cols,rows,active,cw=44,rh=28){
 let out='';cols.forEach((c,j)=>out+=TB(x+j*cw+cw/2,y+19,c,14,j===cols.length-1?C.coral:C.muted));
 rows.forEach((r,i)=>{const yy=y+rh*(i+1),on=i===active;out+=R(x-4,yy+2,cw*cols.length+8,rh-4,on?C.amberp:'none',on?C.amber:'none',6);r.forEach((v,j)=>out+=TM(x+j*cw+cw/2,yy+19,v,15,j===r.length-1?(v?C.blue:C.muted):C.ink,'middle',on?'font-weight="700"':''))});
 return out;
}

SCENE({id:'bit',name:'Bit',tag:'The smallest choice',
 definition:'A bit is a single choice between two states, written 0 and 1.',
 example:'A light switch is one bit: off or on. Two bits give four patterns (00, 01, 10, 11); every extra bit doubles the number of patterns.',
 desc:'A row of bit cells beside a grid listing every pattern those bits can make; the current pattern is highlighted.',
 dur:9,hint:'Press a bit to flip it. Add or remove bits and watch the number of patterns double or halve.',
 init:()=>({bits:[1]}),
 watch(p){const n=p<.25?1:p<.5?2:p<.75?3:4,v=Math.floor(p*48)%(1<<n);return {bits:bin(v,n).split('').map(Number)}},
 ui:[{b:'Add a bit',act:'add'},{b:'Remove a bit',act:'remove'}],
 on:{flip(s,i){s.bits[i]^=1},add(s){if(s.bits.length<5)s.bits.unshift(0)},remove(s){if(s.bits.length>1)s.bits.shift()}},
 draw(s,f,X){
  const n=s.bits.length,w=64,x0=300-(n*(w+8)-8)/2,v=parseInt(s.bits.join(''),2);let out=heading(n===1?'One bit: two possible states':`${n} bits: 2${'⁰¹²³⁴⁵'[n]} = ${1<<n} patterns`);
  s.bits.forEach((b,i)=>out+=Ci(x0+i*(w+8)+w/2,74,11,b?'#ffd24a':'#eef2f4',b?'#c79100':C.line));
  out+=bitRow(X,s.bits,x0,96,w,'flip');
  const total=1<<n,cols=total<=4?total:total<=8?4:8,cw=Math.min(118,560/cols),rows=Math.ceil(total/cols),rh=Math.min(40,150/rows);
  for(let i=0;i<total;i++){const cx=300-(cols*cw)/2+(i%cols)*cw,cy=200+Math.floor(i/cols)*rh,on=i===v;out+=R(cx+4,cy,cw-8,rh-6,on?C.blue:'#fff',on?C.blue:C.grid,6)+TM(cx+cw/2,cy+rh/2+2,bin(i,n),Math.min(17,rh*.5),on?'#fff':C.muted)}
  out+=T(300,366,`Each extra bit doubles the count: ${range(n).map(i=>2).join(' × ')} = ${total}`,15,C.muted);
  return {svg:out,phase:`The pattern ${s.bits.join('')} is one of ${total} possible patterns. A bit has no meaning on its own; we agree what each pattern stands for.`};
 }});

SCENE({id:'binary',name:'Binary number',tag:'Place value with twos',
 definition:'A way of writing numbers using only 0 and 1, where each place is worth twice the place to its right.',
 example:'101101 means 32 + 8 + 4 + 1 = 45. Decimal places are worth 1, 10, 100…; binary places are worth 1, 2, 4, 8, 16…',
 desc:'Eight bit cells under their place values 128 down to 1; the values of the 1 bits add up to the decimal number shown.',
 dur:10,hint:'Press bits to switch place values on and off, or count with +1 and −1. Watch the carry ripple left.',
 init:()=>({v:45}),
 watch(p){return {v:Math.min(45,Math.floor(smooth(p)*46))}},
 ui:[{b:'+1',act:'inc',aria:'Add one'},{b:'−1',act:'dec',aria:'Subtract one'},{b:'× 2 (shift left)',act:'shl'},{b:'÷ 2 (shift right)',act:'shr'}],
 on:{flip(s,i){s.v^=1<<(7-i)},inc(s){s.v=(s.v+1)&255},dec(s){s.v=(s.v+255)&255},shl(s){s.v=(s.v<<1)&255},shr(s){s.v>>=1}},
 draw(s,f,X){
  const bits=bin(s.v,8).split('').map(Number),w=58,g=10,x0=300-(8*w+7*g)/2;let out=heading('Each place is worth twice the next');
  bits.forEach((b,i)=>{const x=x0+i*(w+g);out+=TB(x+w/2,74,String(1<<(7-i)),17,b?C.blue:C.muted)+T(x+w/2,92,'2'+'⁷⁶⁵⁴³²¹⁰'[i],12,C.muted)});
  out+=bitRow(X,bits,x0,104,w,'flip');
  const parts=bits.map((b,i)=>b?1<<(7-i):0).filter(Boolean);
  out+=T(300,214,parts.length?parts.join(' + '):'no places switched on',20,C.ink);
  out+=TB(300,282,`${bits.join('')} in binary = ${s.v} in decimal`,26,C.blue);
  out+=T(300,330,'Decimal places: … 1000, 100, 10, 1. Binary places: … 8, 4, 2, 1.',15,C.muted);
  return {svg:out,phase:`Add the place values under each 1: ${parts.length?parts.join(' + ')+' = '+s.v:'0'}. Adding 1 to a run of 1s turns them to 0 and carries left, just as 999 + 1 = 1000.`};
 }});

SCENE({id:'byte',name:'Byte',tag:'Eight bits make a byte',
 definition:'A group of 8 bits, which can hold 256 different patterns: the numbers 0 to 255.',
 example:'Memory and file sizes are counted in bytes. A byte holding 255 (11111111) plus 1 overflows to 0 if there is no ninth bit to carry into.',
 desc:'A byte of eight cells above a number line from 0 to 255 with a marker at the current value; an overflow warning appears when the value wraps.',
 dur:9,hint:'Slide the value or press +1 near 255 to see overflow. Each bit can also be flipped directly.',
 init:()=>({v:250,wrapped:false}),
 watch(p){const k=Math.floor(p*16),raw=244+k;return {v:raw%256,wrapped:raw>255}},
 ui:[{range:'v',label:'Value',min:0,max:255,get:s=>s.v,act:'set'},{b:'+1',act:'inc',aria:'Add one'}],
 on:{set(s,v){s.v=v;s.wrapped=false},inc(s){s.wrapped=s.v===255;s.v=(s.v+1)&255},flip(s,i){s.v^=1<<(7-i);s.wrapped=false}},
 draw(s,f,X){
  const bits=bin(s.v,8).split('').map(Number);let out=heading('1 byte = 8 bits = 256 patterns');
  out+=T(70,95,'carry?',13,s.wrapped?C.coral:C.muted)+R(44,104,52,52,s.wrapped?C.coralp:'#fff',s.wrapped?C.coral:C.grid,7,'stroke-dasharray="5 4"')+TM(70,138,s.wrapped?'1':'',24,C.coral);
  out+=bitRow(X,bits,110,104,52,'flip',{gap:6});
  out+=L(60,236,540,236,C.line,3);for(const v of [0,64,128,192,255]){const x=60+480*v/255;out+=L(x,230,x,242,C.line,2)+T(x,262,v,13,C.muted)}
  const mx=60+480*s.v/255;out+=`<polygon points="${fmt(mx)},228 ${fmt(mx-9)},212 ${fmt(mx+9)},212" fill="${C.blue}"/>`+TB(mx,204,s.v,17,C.blue);
  out+=s.wrapped?R(110,286,380,58,C.coralp,C.coral,10)+TB(300,311,'Overflow: 255 + 1 wrapped round to 0',17,C.coral)+T(300,333,'The carry needed a ninth bit, and the byte has none.',14,C.ink)
   :T(300,318,`Smallest 00000000 = 0, largest 11111111 = 255`,16,C.muted);
  return {svg:out,phase:s.wrapped?'The answer 256 needs nine bits. A fixed-size byte drops the carry, so the count wraps to zero, like a car mileometer rolling over.':`${bits.join('')} is ${s.v}. Eight places give 2⁸ = 256 patterns, so a byte counts from 0 to 255.`};
 }});

SCENE({id:'hexadecimal',name:'Hexadecimal',tag:'Four bits per digit',
 definition:'Base 16: the digits 0–9 then A–F, where each hex digit stands for exactly four bits.',
 example:'The web colour #1772B7 is three bytes: 17 red, 72 green, B7 blue. B7 = 1011 0111 = 183.',
 desc:'Three bytes for red, green and blue, each split into two four-bit halves with their hex digits, beside a swatch of the resulting colour.',
 dur:9,hint:'Mix a colour with the three sliders. Each byte splits into two 4-bit halves; each half is one hex digit.',
 init:()=>({r:23,g:114,b:183}),
 watch(p){const cs=[[23,114,183],[196,82,56],[44,119,108],[255,210,74]],q=p*3,i=Math.min(2,Math.floor(q)),u=smooth(q-i);const a=cs[i],b=cs[i+1];return {r:Math.round(lerp(a[0],b[0],u)),g:Math.round(lerp(a[1],b[1],u)),b:Math.round(lerp(a[2],b[2],u))}},
 ui:[{range:'r',label:'Red',min:0,max:255,get:s=>s.r,act:'r'},{range:'g',label:'Green',min:0,max:255,get:s=>s.g,act:'g'},{range:'b',label:'Blue',min:0,max:255,get:s=>s.b,act:'b'}],
 on:{r(s,v){s.r=v},g(s,v){s.g=v},b(s,v){s.b=v}},
 draw(s){
  const code='#'+hex(s.r)+hex(s.g)+hex(s.b);let out=heading('Each hex digit is exactly four bits');
  [['Red',s.r,C.coral],['Green',s.g,C.green],['Blue',s.b,C.blue]].forEach(([n,v,col],j)=>{const y=70+j*92,bits=bin(v,8);
   out+=TB(24,y+32,n,15,col,'start');
   for(let h=0;h<2;h++){const x=90+h*150,nib=bits.slice(h*4,h*4+4);out+=R(x,y+8,136,38,'#fff',C.grid,7);nib.split('').forEach((b,i)=>out+=TM(x+19+i*33,y+34,b,19,b==='1'?C.ink:C.muted));
    out+=P(`M${x+10} ${y+52}Q${x+68} ${y+66} ${x+126} ${y+52}`,C.line,1.6)+TB(x+68,y+82,hex(v,2)[h],20,col)}
   out+=T(410,y+34,'= '+v,17,C.muted,'start');
  });
  out+=R(470,70,110,180,code,C.grid,12)+TB(525,280,code,18,C.ink);
  out+=T(300,360,'0000 = 0 … 1001 = 9, 1010 = A … 1111 = F',15,C.muted);
  return {svg:out,phase:`${code}: red ${hex(s.r)} = ${s.r}, green ${hex(s.g)} = ${s.g}, blue ${hex(s.b)} = ${s.b}. Two hex digits always describe one byte, which is why programmers read hex rather than long runs of bits.`};
 }});

SCENE({id:'ascii',name:'Character encoding (ASCII)',tag:'Letters as numbers',
 definition:'An agreed table that gives each character a number, so text can be stored as bits. ASCII uses 7 bits for 128 characters.',
 example:'In ASCII, “A” is 65 (1000001) and “a” is 97: lowercase letters are exactly 32 further on. The digit “7” is 55, not 7.',
 desc:'Each character of a short word with its ASCII number and its seven-bit pattern underneath.',
 dur:9,hint:'Type up to 8 characters. Letters, digits, spaces and punctuation are in ASCII; accented letters are not.',
 init:()=>({text:'Hi 7!'}),
 watch(p){const w='Hello!';return {text:w.slice(0,Math.max(1,Math.ceil(p*w.length)))}},
 ui:[{text:'Text',label:'Text',get:s=>s.text,act:'set',max:8}],
 on:{set(s,v){s.text=v}},
 draw(s){
  const chars=Array.from(s.text).slice(0,8);let out=heading('Every character is a number in an agreed table');
  if(!chars.length)out+=T(300,190,'Type something to encode it.',18,C.muted);
  const w=Math.min(78,560/Math.max(1,chars.length)),x0=300-chars.length*w/2;
  chars.forEach((ch,i)=>{const x=x0+i*w,code=ch.codePointAt(0),ok=code<128;
   out+=R(x+4,64,w-8,70,ok?'#fff':C.coralp,ok?C.blue:C.coral,9)+TM(x+w/2,112,ch===' '?'␣':ch,34,ok?C.ink:C.coral);
   out+=arrow(x+w/2,140,x+w/2,170,C.line,2,7);
   out+=TB(x+w/2,196,ok?code:'—',20,ok?C.blue:C.coral);
   if(ok)bin(code,7).split('').forEach((b,j)=>out+=TM(x+w/2,224+j*17,b,14,b==='1'?C.ink:C.muted));
   else out+=T(x+w/2,236,'not',13,C.coral)+T(x+w/2,252,'ASCII',13,C.coral);
  });
  out+=T(300,366,'A–Z: 65–90 · a–z: 97–122 · 0–9: 48–57 · space: 32',14,C.muted);
  const bad=chars.filter(c=>c.codePointAt(0)>127);
  return {svg:out,phase:bad.length?`“${bad.join('')}” has no ASCII number. ASCII covers only 128 characters, mostly English, which is why Unicode was needed.`:`“${chars.join('')}” is stored as ${chars.map(c=>c.codePointAt(0)).join(', ')}. The computer stores only the numbers; the table gives them meaning.`};
 }});

SCENE({id:'unicode',name:'Unicode and UTF-8',tag:'One table for every script',
 definition:'Unicode gives every character in every writing system a number (a code point). UTF-8 stores each code point as 1 to 4 bytes.',
 example:'“a” is U+0061 and takes 1 byte; “é” is U+00E9 and takes 2; “€” takes 3; the emoji 😀 (U+1F600) takes 4. Plain ASCII text is already valid UTF-8.',
 desc:'Each character with its Unicode code point and the one to four UTF-8 bytes that store it; the first byte’s leading bits show how many bytes follow.',
 dur:10,hint:'Type any text, including accents, symbols or emoji, or pick an example. Watch the byte count grow.',
 init:()=>({text:'aé€😀'}),
 watch(p){const w=Array.from('aé€😀');return {text:w.slice(0,Math.max(1,Math.ceil(p*4))).join('')}},
 ui:[{text:'Text',label:'Text',get:s=>s.text,act:'set',max:12},{choose:[['aé€😀','Mixed'],['日本','Japanese'],['Ωμέγα','Greek'],['🎉👍','Emoji']],label:'Examples',get:s=>s.text,act:'set'}],
 on:{set(s,v){s.text=v}},
 draw(s){
  const cps=Array.from(s.text).slice(0,5),enc=new TextEncoder();let out=heading('Code point → 1 to 4 bytes');
  if(!cps.length)out+=T(300,190,'Type something to encode it.',18,C.muted);
  const w=Math.min(116,580/Math.max(1,cps.length)),x0=300-cps.length*w/2;let total=0;
  const cols=[C.blue,C.green,C.purple,C.coral];
  cps.forEach((ch,i)=>{const x=x0+i*w,cp=ch.codePointAt(0),bytes=Array.from(enc.encode(ch)),col=cols[bytes.length-1];total+=bytes.length;
   out+=R(x+5,58,w-10,62,'#fff',col,9)+T(x+w/2,102,ch,30,C.ink);
   out+=TM(x+w/2,140,'U+'+hex(cp,4),14,C.muted);
   bytes.forEach((b,j)=>{const y=154+j*44,bits=bin(b,8),lead=j===0?(bytes.length===1?1:bytes.length+1):2;
    out+=R(x+8,y,w-16,38,j===0?col:'#fff',col,7)+TM(x+w/2,y+16,hex(b),14,j===0?'#fff':col,'middle','font-weight="700"');
    out+=`<text x="${fmt(x+w/2)}" y="${y+32}" font-size="11" text-anchor="middle" class="mono"><tspan fill="${j===0?'#ffe7b0':C.coral}" font-weight="700">${bits.slice(0,lead)}</tspan><tspan fill="${j===0?'#fff':C.muted}">${bits.slice(lead)}</tspan></text>`});
   out+=T(x+w/2,345,bytes.length+(bytes.length>1?' bytes':' byte'),13,col,'middle','font-weight="650"');
  });
  out+=T(300,370,`${cps.length} character${cps.length===1?'':'s'}, ${total} byte${total===1?'':'s'} in UTF-8`,14,C.muted);
  return {svg:out,phase:'The highlighted leading bits announce the length: 0… is a 1-byte character, 110… starts 2 bytes, 1110… starts 3, 11110… starts 4, and every continuation byte begins 10….'};
 }});

const SMILEY=[0b00111100,0b01000010,0b10100101,0b10000001,0b10100101,0b10011001,0b01000010,0b00111100];
SCENE({id:'bitmap',name:'Bitmap image',tag:'Pictures as grids of numbers',
 definition:'A picture stored as a grid of pixels, where each pixel’s colour is a number. In a 1-bit image each pixel is simply on or off.',
 example:'An 8 × 8 black-and-white icon needs 64 bits: 8 bytes, one per row. Colour photos use 3 bytes per pixel (red, green, blue).',
 desc:'An eight-by-eight grid of pixels forming a face; beside each row is the byte that stores it in binary and decimal.',
 dur:10,hint:'Press pixels to paint them. Each row is one byte; watch its value change.',
 init:()=>({rows:SMILEY.slice()}),
 watch(p){const k=Math.floor(p*64);return {rows:SMILEY.map((r,i)=>{const shown=clamp(k-i*8,0,8);return r&(0xFF<<(8-shown)&0xFF)}),scan:k}},
 ui:[{b:'Invert',act:'invert'},{b:'Clear',act:'clear'},{b:'Mirror',act:'mirror'}],
 on:{px(s,a){const [r,c]=String(a).split(',').map(Number);s.rows[r]^=1<<(7-c)},invert(s){s.rows=s.rows.map(r=>r^255)},clear(s){s.rows=s.rows.map(()=>0)},mirror(s){s.rows=s.rows.map(r=>parseInt(bin(r,8).split('').reverse().join(''),2))}},
 draw(s,f,X){
  let out=heading('Each row of 8 pixels is one byte');const cs=34,x0=36,y0=56;
  s.rows.forEach((r,i)=>{bin(r,8).split('').forEach((b,j)=>{const on=b==='1',scan=s.scan!==undefined&&i*8+j===s.scan;out+=hit(X,'px',i+','+j,`Row ${i+1}, column ${j+1}: ${on?'on':'off'}`,R(x0+j*cs,y0+i*cs,cs-2,cs-2,on?C.dark:'#fff',scan?C.coral:C.grid,3))});
   const y=y0+i*cs+cs/2+5;out+=TM(340,y,bin(r,8),17,C.ink,'start')+T(450,y,'= '+r,16,C.muted,'start')+TM(520,y,'0x'+hex(r),15,C.muted,'start')});
  out+=T(162,y0+8*cs+26,'8 × 8 = 64 pixels',14,C.muted)+T(450,y0+8*cs+26,'8 rows = 8 bytes',14,C.muted);
  return {svg:out,phase:'Reading left to right, a dark pixel is 1 and a light one 0. A screen only ever receives numbers like these; resolution and colour depth decide how many.'};
 }});

const BOOL_ROWS=range(8).map(i=>{const a=i>>2&1,b=i>>1&1,c=i&1;return [a,b,c,(a&b)|(c?0:1)]});
SCENE({id:'boolean',name:'Boolean logic',tag:'Calculating with true and false',
 definition:'Algebra on the two values true (1) and false (0), using AND, OR and NOT.',
 example:'“Go outside if it is warm AND dry, OR if you have NOT got homework.” With warm = 1, dry = 0, homework = 1 the answer is 0.',
 desc:'An expression tree for (A AND B) OR NOT C, with each node coloured by its value, beside the full eight-row truth table with the current row highlighted.',
 dur:10,hint:'Press A, B or C in the tree, or press any row of the table to load those inputs.',
 init:()=>({a:1,b:0,c:1}),
 watch(p){const r=Math.min(7,Math.floor(p*8));return {a:r>>2&1,b:r>>1&1,c:r&1}},
 on:{tog(s,k){s[k]^=1},row(s,i){i=Number(i);s.a=i>>2&1;s.b=i>>1&1;s.c=i&1}},
 draw(s,f,X){
  const and=s.a&s.b,not=s.c?0:1,out1=and|not;let out=heading('(A AND B) OR NOT C');
  const node=(x,y,lab,v,act,arg)=>{const inner=R(x-38,y-22,76,44,v?C.blue:'#fff',v?C.blue:C.line,22)+TB(x,y+6,lab,16,v?'#fff':C.ink);return act?hit(X,act,arg,`${lab}. Press to switch.`,inner):inner};
  const ed=(x1,y1,x2,y2,v)=>L(x1,y1,x2,y2,wireCol(v),wireW(v));
  out+=ed(170,90,100,170,and)+ed(170,90,250,170,not)+ed(100,170,50,270,s.a)+ed(100,170,150,270,s.b)+ed(250,170,250,270,s.c);
  out+=node(170,90,'OR = '+out1,out1)+node(100,170,'AND = '+and,and)+node(250,170,'NOT = '+not,not);
  out+=node(50,270,'A = '+s.a,s.a,'tog','a')+node(150,270,'B = '+s.b,s.b,'tog','b')+node(250,270,'C = '+s.c,s.c,'tog','c');
  const r=s.a*4+s.b*2+s.c;
  out+=truthTable(360,50,['A','B','C','out'],BOOL_ROWS,r,52,33);
  if(X.try)BOOL_ROWS.forEach((_,i)=>out+=hit(X,'row',i,`Load row ${i+1}`,R(356,50+33*(i+1)+2,216,29,'transparent','none',6)));
  out+=T(170,340,'Values flow upward from the inputs',14,C.muted);
  return {svg:out,phase:`A AND B is ${and} (both must be 1); NOT C is ${not}; OR gives ${out1} because ${out1?'at least one side is 1':'neither side is 1'}. Eight rows cover every possible input.`};
 }});

SCENE({id:'logic-gate',name:'Logic gate',tag:'Boolean logic in hardware',
 definition:'A tiny circuit that computes one Boolean operation, such as AND, OR or NOT, on electrical signals.',
 example:'An AND gate lights its output only when both inputs are on. Billions of gates, built from transistors, make up a processor.',
 desc:'Two input switches feed a gate symbol whose output lights a lamp; live wires are drawn thick and blue, and the matching truth-table row is highlighted.',
 dur:12,hint:'Pick a gate, then flip the input switches. The lit row of the truth table always matches the lamp.',
 init:()=>({gate:'AND',a:1,b:0}),
 watch(p){const gs=['AND','OR','NOT','XOR','NAND'],q=p*5,i=Math.min(4,Math.floor(q)),sub=Math.min(3,Math.floor((q-i)*4));return {gate:gs[i],a:sub>>1&1,b:sub&1}},
 ui:[{choose:[['AND','AND'],['OR','OR'],['NOT','NOT'],['XOR','XOR'],['NAND','NAND']],label:'Gate',get:s=>s.gate,act:'gate'}],
 on:{gate(s,g){s.gate=g},tog(s,k){s[k]^=1}},
 draw(s,f,X){
  const one=s.gate==='NOT',o=GATES[s.gate](s.a,s.b);let out=heading(s.gate+' gate');
  const gx=250,gy=120;
  out+=toggle(X,'tog','a',30,one?140:90,s.a,'A');if(!one)out+=toggle(X,'tog','b',30,190,s.b,'B');
  if(one)out+=P(`M104 160H${gx}`,wireCol(s.a),wireW(s.a));
  else out+=P(`M104 110H190V140H${gx}`,wireCol(s.a),wireW(s.a))+P(`M104 210H190V180H${gx-(s.gate==='XOR'?4:0)}`,wireCol(s.b),wireW(s.b));
  out+=gateShape(s.gate,gx,gy);
  const ox=one?gx+93:gx+(s.gate==='NAND'?100:92);out+=P(`M${ox} 160H470`,wireCol(o),wireW(o))+lamp(500,160,o,'out = '+o);
  const rows=one?[[0,1],[1,0]]:[[0,0],[0,1],[1,0],[1,1]].map(([a,b])=>[a,b,GATES[s.gate](a,b)]);
  out+=truthTable(one?250:220,250,one?['A','out']:['A','B','out'],rows,one?s.a:s.a*2+s.b,50,24);
  const rule={AND:'1 only when both inputs are 1',OR:'1 when at least one input is 1',NOT:'flips its single input',XOR:'1 when the inputs differ',NAND:'NOT AND: 0 only when both are 1'}[s.gate];
  return {svg:out,phase:`${s.gate} gives ${rule}. With ${one?'A = '+s.a:'A = '+s.a+', B = '+s.b} the output is ${o}.${s.gate==='NAND'?' Every other gate can be built from NAND gates alone.':''}`};
 }});

SCENE({id:'half-adder',name:'Half adder',tag:'Gates that add',
 definition:'A circuit that adds two single bits, producing a sum bit (from XOR) and a carry bit (from AND).',
 example:'1 + 1 = 2, which is 10 in binary: sum 0, carry 1. Chain adders together, passing the carry along, and a processor can add whole bytes.',
 desc:'Inputs A and B feed both an XOR gate, giving the sum, and an AND gate, giving the carry; lamps show the two-bit result.',
 dur:10,hint:'Flip A and B. The two lamps read as a two-digit binary number: carry then sum.',
 init:()=>({a:1,b:1}),
 watch(p){const r=Math.min(3,Math.floor(p*4));return {a:r>>1&1,b:r&1}},
 on:{tog(s,k){s[k]^=1}},
 draw(s,f,X){
  const sm=s.a^s.b,cy=s.a&s.b;let out=heading('Sum = A XOR B · Carry = A AND B');
  out+=toggle(X,'tog','a',24,96,s.a,'A')+toggle(X,'tog','b',24,216,s.b,'B');
  out+=P('M98 116H160V100H260',wireCol(s.a),wireW(s.a))+P('M160 116V220H260',wireCol(s.a),wireW(s.a))+Ci(160,116,5,wireCol(s.a));
  out+=P('M98 236H190V140H256',wireCol(s.b),wireW(s.b))+P('M190 236V260H260',wireCol(s.b),wireW(s.b))+Ci(190,236,5,wireCol(s.b));
  out+=gateShape('XOR',260,80)+gateShape('AND',260,200);
  out+=P('M352 120H460',wireCol(sm),wireW(sm))+P('M346 240H460',wireCol(cy),wireW(cy));
  out+=lamp(490,120,sm,'sum = '+sm)+lamp(490,240,cy,'carry = '+cy);
  out+=TB(300,350,`${s.a} + ${s.b} = ${cy}${sm} in binary = ${s.a+s.b}`,20,C.blue);
  return {svg:out,phase:cy?'Both inputs are 1, so the sum bit is 0 and a 1 carries into the next place: 1 + 1 = 10.':`Only ${s.a+s.b===0?'zeros':'one input'} is on, so no carry is needed; the sum bit is ${sm}.`};
 }});
