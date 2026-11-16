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
   if(ok)bin(code,7).split('').forEach((b,j)=>out+=TMF(x+w/2,224+j*17,b,14,b==='1'?C.ink:C.muted));
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

// 3D companion (reference example for the three() API): up to three bits are the corners of a cube.
SCENES.bit.three=(s,f,X,project)=>{
 const n=Math.min(3,s.bits.length),bits=s.bits.slice(-n),P=project([[0,0,0],[2,2,2],[-.4,-.4,-.4],[2.4,2.4,2.4]]);
 const corner=v=>[(v&1)*2,(v>>1&1)*2,(v>>2&1)*2],cur=parseInt(bits.join(''),2),total=1<<n;let out='';
 for(let v=0;v<total;v++)for(let b=0;b<n;b++){const w=v^(1<<b);if(w>v){const on=v===cur||w===cur;out+=line3(corner(v),corner(w),P,on?C.blue:C.line,on?3:2)}}
 out+=sortedItems(range(total).map(v=>({at:corner(v),svg:P=>{const p=P(corner(v)),on=v===cur;return Ci(p[0],p[1],on?26:21,on?C.blue:'#fff',on?C.blue:C.line)+TM(p[0],p[1]+5,bin(v,n),14,on?'#fff':C.ink,'middle','font-weight="700"')}})),P);
 return {svg:out,title:'Bit patterns as corners',caption:n===1?'One bit: two ends of a line.':n===2?'Two bits: the four corners of a square. Neighbours differ in exactly one bit.':`Three bits: the ${total} corners of a cube. Each edge flips exactly one bit${s.bits.length>3?' (showing the last three bits)':''}.`};
};

/* ===================== Stage 1 lessons: further scenes ===================== */
/* ---- Lesson: bit ---- */
SCENE({id:'yes-no-questions',name:'Information as yes/no answers',tag:'Each answer is one bit',
 definition:'One bit of information is the answer to one yes/no question that splits the possibilities exactly in half.',
 example:'To find a number from 0 to 15, ask “is it 8 or more?”, then halve again. Four questions always suffice, and the four answers spell the number in binary.',
 desc:'A row of numbered tiles; each yes/no question greys out half of the remaining tiles, and the answers collect as a row of bits.',
 dur:11,hint:'Press a tile to choose the secret number, or change how many possibilities there are. Then step through the questions.',
 init:()=>({N:16,secret:11}),
 ui:[{choose:[[8,'8 numbers'],[16,'16'],[32,'32']],label:'Possibilities',get:s=>s.N,act:'size'}],
 on:{pick(s,v){s.secret=Number(v)},size(s,v){s.N=Number(v);s.secret=Math.min(s.secret,s.N-1)}},
 trace(s){const q=Math.log2(s.N);let lo=0,hi=s.N,ans=[];const fr=[{lo,hi,ans:[],i:-1}];
  for(let i=0;i<q;i++){const mid=(lo+hi)/2,yes=s.secret>=mid;ans=ans.concat(yes?1:0);if(yes)lo=mid;else hi=mid;fr.push({lo,hi,mid,yes,ans,i})}return fr},
 draw(s,f,X){
  const N=s.N,q=Math.log2(N),rows=N>16?2:1,per=N/rows,w=N===8?58:32,g=N===8?8:4,x0=300-(per*(w+g)-g)/2;let out=heading(`Find a number from 0 to ${N-1} with yes/no questions`);
  for(let v=0;v<N;v++){const x=x0+(v%per)*(w+g),y=64+Math.floor(v/per)*48,live=v>=f.lo&&v<f.hi,sec=v===s.secret;
   out+=hit(X,'pick',v,`Make ${v} the secret number`,R(x,y,w,40,live?(sec?C.amberp:'#fff'):'#e9eef1',sec?C.amber:live?C.blue:C.grid,6)+TF(x+w/2,y+26,v,N>16?13:16,live?C.ink:C.line,'middle',sec?'font-weight="700"':''))}
  const qy=rows>1?186:150;
  out+=f.i<0?T(300,qy+28,'The answerer knows the secret (amber). The asker only hears yes or no.',15,C.muted)
   :R(110,qy,380,46,'#fff',C.grid,10)+T(300,qy+29,`Q${f.i+1}: is it ${f.mid} or more?  ${f.yes?'Yes → 1':'No → 0'}`,17,C.ink,'middle','font-weight="650"');
  const bw=46,bx=300-(q*(bw+8)-8)/2,by=qy+70;
  for(let i=0;i<q;i++){const b=f.ans[i];out+=R(bx+i*(bw+8),by,bw,46,b===undefined?'#fff':b?C.blue:'#fff',b===undefined?C.grid:C.blue,7,b===undefined?'stroke-dasharray="4 4"':'')+TM(bx+i*(bw+8)+bw/2,by+31,b===undefined?'?':b,22,b?'#fff':C.ink,'middle','font-weight="700"')}
  const done=f.ans.length===q;
  out+=T(300,by+76,done?`Answers ${f.ans.join('')} = ${s.secret} in binary: ${q} questions, ${q} bits`:`${f.hi-f.lo} possibilities left`,16,done?C.green:C.muted,'middle',done?'font-weight="700"':'');
  return {svg:out,phase:done?`Each answer halved the possibilities, so ${q} answers pin down one of ${N}: log₂ ${N} = ${q} bits. A question that does not split evenly gives less than one bit on average.`:f.i<0?'A good question rules out half of what is left, whatever the answer.':`${f.yes?'Yes':'No'}: keep ${f.lo} to ${f.hi-1}. Half the candidates are gone.`};
 }});

SCENE({id:'signal-levels',name:'Bits on a wire',tag:'Two levels survive noise',
 definition:'A bit travels as one of two voltage levels, and the receiver compares each sample with a threshold halfway between them.',
 example:'With 0 V for 0 and 5 V for 1, noise of ±1 V does no harm: anything above 2.5 V still reads as 1. Having only two widely spaced levels is what makes digital signals robust.',
 desc:'A noisy voltage trace carrying eight bits, a dashed threshold line, the bits sent above and the bits read below, with misreads marked in coral.',
 dur:10,hint:'Raise the noise until bits start to flip, then move the threshold away from halfway and watch errors appear sooner.',
 init:()=>({noise:1,th:2.5}),
 watch(p){return {noise:Math.round(p*32)/10,th:2.5}},
 ui:[{range:'noise',label:'Noise',min:0,max:4,step:.1,get:s=>s.noise,act:'noise',show:v=>'±'+Number(v).toFixed(1)+' V'},{range:'th',label:'Threshold',min:.5,max:4.5,step:.1,get:s=>s.th,act:'th',show:v=>Number(v).toFixed(1)+' V'}],
 on:{noise(s,v){s.noise=v},th(s,v){s.th=v}},
 draw(s){
  const bits=[1,0,1,1,0,0,1,0],per=12,r=rng(29),x0=70,dx=480/(bits.length*per),Y=v=>262-clamp(v,-1.6,6.6)*28;let out=heading('Sent as two voltage levels; read against a threshold');
  const vs=[];bits.forEach(b=>{for(let k=0;k<per;k++)vs.push(b*5+(r()*2-1)*s.noise)});
  out+=L(x0,Y(5),x0+480,Y(5),C.grid,1,'stroke-dasharray="2 4"')+L(x0,Y(0),x0+480,Y(0),C.grid,1,'stroke-dasharray="2 4"');
  out+=TF(60,Y(5)+5,'5 V',13,C.muted,'end')+TF(60,Y(0)+5,'0 V',13,C.muted,'end');
  out+=P('M'+vs.map((v,i)=>fmt(x0+i*dx)+' '+fmt(Y(v))).join('L'),C.blue,1.8);
  out+=L(x0,Y(s.th),x0+480,Y(s.th),C.amber,2,'stroke-dasharray="7 5"')+TF(x0+480,Y(s.th)-7,'threshold',13,C.amber,'end');
  let errs=0;
  bits.forEach((b,i)=>{const cx=x0+(i*per+per/2)*dx,v=vs[i*per+per/2],got=v>s.th?1:0,bad=got!==b;if(bad)errs++;
   out+=TB(cx,62,b,17,C.ink)+Ci(cx,Y(v),5,bad?C.coral:C.green)+R(cx-17,318,34,34,bad?C.coralp:'#fff',bad?C.coral:C.grid,6)+TB(cx,341,got,17,bad?C.coral:C.ink)});
  out+=TF(x0-8,62,'sent',13,C.muted,'end')+TF(x0-8,340,'read',13,C.muted,'end');
  return {svg:out,phase:errs?`${errs} of 8 bits misread. Noise pushed a sample across the threshold. Real links add error-detecting codes and resend damaged data.`:s.noise>0?`Noise of ±${Number(s.noise).toFixed(1)} V, yet every bit is read correctly: a sample only has to land on the right side of ${Number(s.th).toFixed(1)} V.`:'A clean signal: every sample sits exactly at 0 V or 5 V.'};
 }});

/* ---- Lesson: binary ---- */
SCENE({id:'binary-addition',name:'Binary addition',tag:'Columns and carries',
 definition:'Add binary numbers column by column from the right, exactly as in decimal: 1 + 1 = 10, so write 0 and carry 1.',
 example:'0101 (5) + 0011 (3): 1 + 1 = 10, carry 1; 0 + 1 + 1 = 10, carry 1; 1 + 0 + 1 = 10, carry 1; 0 + 0 + 1 = 1. The answer is 1000 (8).',
 desc:'Two eight-bit numbers stacked for column addition, with carries written above and the sum appearing column by column from the right.',
 dur:13,hint:'Choose the two numbers, then step through the columns. Try 255 + 1 to see the carry fall off the end.',
 init:()=>({a:45,b:27}),
 ui:[{range:'a',label:'First',min:0,max:255,get:s=>s.a,act:'a'},{range:'b',label:'Second',min:0,max:255,get:s=>s.b,act:'b'}],
 on:{a(s,v){s.a=v},b(s,v){s.b=v}},
 trace(s){const A=bin(s.a,8),B=bin(s.b,8),sum=Array(8).fill(null),carry=Array(9).fill(null);let c=0;const fr=[{col:null,sum:sum.slice(),carry:carry.slice()}];
  for(let j=7;j>=0;j--){const a=+A[j],b=+B[j],d=a+b+c;sum[j]=d%2;const cin=c;c=d>>1;carry[j]=c;fr.push({col:j,a,b,cin,d,sum:sum.slice(),carry:carry.slice()})}
  fr.push({col:-1,sum:sum.slice(),carry:carry.slice(),done:true,over:c});return fr},
 draw(s,f){
  const A=bin(s.a,8),B=bin(s.b,8),cw=50,x0=120,y={c:84,a:136,b:184,s:258};let out=heading('Add column by column, carrying to the left');
  if(f.col!==null&&f.col>=0)out+=R(x0+f.col*cw+3,y.c-26,cw-6,y.s-y.c+40,C.amberp,'none',8);
  for(let j=0;j<8;j++){const x=x0+j*cw+cw/2;
   out+=TMF(x,y.a,A[j],24,C.ink)+TMF(x,y.b,B[j],24,C.ink);
   if(f.sum[j]!==null)out+=TMF(x,y.s,f.sum[j],26,C.blue,'middle','font-weight="700"');
   const cin=j<7?f.carry[j+1]:null;if(cin)out+=TMF(x,y.c,'1',16,C.coral,'middle','font-weight="700"');}
  if(f.carry[0])out+=R(x0-cw+6,y.s-30,cw-12,40,f.done?C.coralp:'#fff',C.coral,6)+TMF(x0-cw/2,y.s,'1',26,C.coral,'middle','font-weight="700"')+TF(x0-cw/2,y.s+30,'9th bit',13,C.coral);
  if(f.carry[0])out+=TMF(x0-cw/2,y.c,'1',16,C.coral,'middle','font-weight="700"');
  out+=TB(x0-14,y.b,'+',24,C.ink,'end')+L(x0-cw,y.b+20,x0+8*cw,y.b+20,C.ink,2);
  out+=TF(x0+8*cw+12,y.a,'= '+s.a,15,C.muted,'start')+TF(x0+8*cw+12,y.b,'= '+s.b,15,C.muted,'start');
  if(f.done)out+=TBF(x0+8*cw+12,y.s,'= '+(s.a+s.b),16,C.blue,'start');
  out+=TF(x0-cw/2,y.c,'carry',13,C.muted,'end');
  if(f.done)out+=T(300,330,f.over?`${s.a} + ${s.b} = ${s.a+s.b} needs nine bits: in one byte the carry is lost and the answer wraps to ${(s.a+s.b)&255}.`:`${s.a} + ${s.b} = ${s.a+s.b}`,15,f.over?C.coral:C.green,'middle','font-weight="650"');
  return {svg:out,phase:f.done?'Every column uses the same small rule: add two bits and a carry, write one bit, pass one bit on. That rule is exactly what a full adder circuit does.':f.col===null?'Start at the right-hand column, as in decimal addition.':`Column ${8-f.col}: ${f.a} + ${f.b}${f.cin?' + 1 carried':''} = ${f.d} = ${bin(f.d,2)} in binary, so write ${f.d%2} and carry ${f.d>>1}.`};
 }});

SCENE({id:'decimal-to-binary',name:'Converting to binary',tag:'Divide by 2, keep the remainders',
 definition:'To write a whole number in binary, divide by 2 repeatedly and keep each remainder; read the remainders from the last to the first.',
 example:'13 ÷ 2 = 6 r 1, 6 ÷ 2 = 3 r 0, 3 ÷ 2 = 1 r 1, 1 ÷ 2 = 0 r 1. Reading upwards gives 1101.',
 desc:'A column of divisions by two with each remainder highlighted, and an arrow showing the remainders read from bottom to top.',
 dur:12,hint:'Choose any number up to 255 and step through the divisions. Each remainder is the next binary digit from the right.',
 init:()=>({n:45}),
 ui:[{range:'n',label:'Number',min:0,max:255,get:s=>s.n,act:'n'}],
 on:{n(s,v){s.n=v}},
 trace(s){let n=s.n;const rows=[];const fr=[{rows:[]}];do{const q=Math.floor(n/2),r=n%2;rows.push([n,q,r]);fr.push({rows:rows.slice()});n=q}while(n>0);fr.push({rows:rows.slice(),done:true});return fr},
 draw(s,f){
  let out=heading(`Write ${s.n} in binary`);const y0=72,rh=32;
  f.rows.forEach(([n,q,r],i)=>{const y=y0+i*rh,last=i===f.rows.length-1&&!f.done;
   out+=R(60,y-21,320,28,last?C.amberp:'none','none',6)+TMF(70,y,`${pad(n,3,' ')} ÷ 2 = ${pad(q,3,' ')}`,17,C.ink,'start','xml:space="preserve"')+TF(270,y,'remainder',13,C.muted,'start')+TMF(356,y,r,20,C.coral,'middle','font-weight="700"')});
  if(f.done){const top=y0-6,bot=y0+(f.rows.length-1)*rh;out+=arrow(400,bot,400,top-14,C.coral,2.5)+TF(412,(top+bot)/2,'read',13,C.coral,'start')+TF(412,(top+bot)/2+17,'upwards',13,C.coral,'start');
   const bits=f.rows.map(r=>r[2]).reverse().join('');out+=R(150,y0+f.rows.length*rh+4,300,46,C.greenp,C.green,10)+TBF(300,y0+f.rows.length*rh+34,`${s.n} = ${bits} in binary`,20,C.green)}
  return {svg:out,phase:f.done?`The first remainder is the 1s place, the next the 2s place, and so on, which is why the digits are read from the bottom up. Check: ${f.rows.map(r=>r[2]).reverse().join('')} = ${s.n}.`:f.rows.length?`Each remainder says whether the number is odd: that is its lowest binary digit. Halving moves to the next place.`:'Divide by 2 and note whether anything is left over.'};
 }});

/* ---- Lesson: byte ---- */
const R1_UNITS=[['kilo','kB','kibi','KiB',1],['mega','MB','mebi','MiB',2],['giga','GB','gibi','GiB',3],['tera','TB','tebi','TiB',4]];
SCENE({id:'storage-units',name:'Kilobytes and kibibytes',tag:'Powers of 10 or of 2',
 definition:'Storage is counted in bytes with prefixes. A kilobyte (kB) is 1,000 bytes; a kibibyte (KiB) is 1,024 = 2¹⁰ bytes. The gap grows with each step up.',
 example:'A drive sold as 1 TB holds 10¹² bytes, but a computer counting in powers of 2 shows it as about 931 GiB. Nothing is missing; the units differ.',
 desc:'Four rows comparing decimal and binary prefixes, with a bar showing how far apart they are, above a drive-size conversion.',
 dur:10,hint:'Change the drive size to see how many binary gibibytes your computer will report.',
 init:()=>({tb:1}),
 watch(p){return {tb:1,row:Math.min(3,Math.floor(p*4.4))}},
 ui:[{range:'tb',label:'Drive size (TB)',min:1,max:16,get:s=>s.tb,act:'tb'}],
 on:{tb(s,v){s.tb=v}},
 draw(s){
  let out=heading('Decimal prefixes count in 1000s; binary ones in 1024s');const n=s.row===undefined?3:s.row;
  R1_UNITS.forEach(([dn,ds,bn,bs,k],i)=>{const y=58+i*58,on=i<=n,gap=(2**(10*k)/10**(3*k)-1)*100;
   out+=R(20,y,560,50,on?'#fff':'#f3f6f8',i===n?C.blue:C.grid,8);
   out+=TF(34,y+21,`${ds} = 10${'³⁶⁹'[i]||'¹²'} = ${(10**(3*k)).toLocaleString('en-GB')}`,13,C.ink,'start')+TF(34,y+40,`${bs} = 2${['¹⁰','²⁰','³⁰','⁴⁰'][i]} = ${(2**(10*k)).toLocaleString('en-GB')}`,13,C.purple,'start');
   if(on)out+=R(372,y+16,gap*16,18,C.amberp,C.amber,4)+TBF(372+gap*16+8,y+30,`+${gap.toFixed(1)}%`,13,C.amber,'start');
  });
  const bytes=s.tb*1e12,gib=bytes/2**30;
  out+=R(20,298,560,64,C.pale,'none',10)+T(300,322,`${s.tb} TB = ${s.tb} × 10¹² bytes`,15,C.ink)+TB(300,348,`= ${gib.toLocaleString('en-GB',{maximumFractionDigits:0})} GiB as your computer counts`,16,C.blue);
  return {svg:out,phase:`The gap is 2.4% for kilo, 4.9% for mega, 7.4% for giga and 10% for tera. ${[8,11].includes(s.tb)?'An':'A'} ${s.tb} TB drive appears as ${(gib).toFixed(0)} GiB, often labelled “GB”.`};
 }});

SCENE({id:'twos-complement',name:'Negative numbers (two’s complement)',tag:'The top bit counts as negative',
 definition:'In two’s complement the leftmost bit is worth minus its usual value, so the same bit patterns can represent negative numbers. In 4 bits the weights are −8, 4, 2, 1.',
 example:'1101 = −8 + 4 + 1 = −3. To negate, flip every bit and add 1: 0011 (3) → 1100 → 1101 (−3). Adding 7 + 1 wraps round to −8.',
 desc:'Sixteen four-bit patterns arranged round a circle with their signed values, beside the current pattern under its weights −8, 4, 2, 1.',
 dur:11,hint:'Count with +1 and −1 past 7 or −8 to see the wrap, or press Negate to watch flip-and-add-one.',
 init:()=>({v:-3,ovf:false,neg:false}),
 watch(p){const k=Math.min(15,Math.floor(p*16));return {v:k<8?k:k-16,ovf:false}},
 ui:[{range:'v',label:'Value',min:-8,max:7,get:s=>s.v,act:'set'},{b:'+1',act:'inc',aria:'Add one'},{b:'−1',act:'dec',aria:'Subtract one'},{b:'Negate',act:'neg'}],
 on:{set(s,v){s.v=v;s.ovf=false;s.neg=false},inc(s){s.ovf=s.v===7;s.v=s.v===7?-8:s.v+1;s.neg=false},dec(s){s.ovf=s.v===-8;s.v=s.v===-8?7:s.v-1;s.neg=false},neg(s){s.ovf=s.v===-8;s.neg={from:s.v};s.v=s.v===-8?-8:-s.v}},
 draw(s,f,X){
  const u=s.v&15,cx=172,cy=212,rad=118;let out=heading('Four bits, signed: weights −8, 4, 2, 1');
  out+=Ci(cx,cy,rad,'none',C.grid);
  for(let i=0;i<16;i++){const a=-Math.PI/2+i*Math.PI/8,x=cx+rad*Math.cos(a),y=cy+rad*Math.sin(a),sv=i<8?i:i-16,on=i===u;
   out+=hit(X,'set',sv,`Pattern ${bin(i,4)} is ${sv}`,Ci(x,y,20,on?C.blue:i<8?'#fff':C.coralp,on?C.blue:i<8?C.line:C.coral)+TMF(x,y+5,bin(i,4),13,on?'#fff':C.ink,'middle','font-weight="650"'));
   out+=TF(cx+(rad+32)*Math.cos(a),cy+(rad+32)*Math.sin(a)+5,String(sv).replace('-','−'),14,i<8?C.blue:C.coral,'middle','font-weight="700"')}
  out+=TF(cx,cy-8,'7 + 1',13,C.muted)+TF(cx,cy+10,'wraps to −8',13,C.muted);
  const bits=bin(u,4).split('').map(Number),W=[-8,4,2,1];
  bits.forEach((b,i)=>{const x=346+i*58;out+=TBF(x+24,70,W[i],16,i===0?C.coral:C.muted)+R(x,80,48,48,b?(i===0?C.coral:C.blue):'#fff',b?(i===0?C.coral:C.blue):C.line,7)+TMF(x+24,112,b,24,b?'#fff':C.muted,'middle','font-weight="700"')});
  const parts=bits.map((b,i)=>b?W[i]:0).filter(Boolean);
  const neg=x=>String(x).replace('-','−');
  out+=T(460,160,parts.length?parts.map(neg).join(' + ')+' = '+neg(s.v):'0',16,C.ink);
  out+=TF(346,194,`As unsigned: ${u}`,14,C.muted,'start')+TBF(346,216,`As signed: ${String(s.v).replace('-','−')}`,15,C.blue,'start');
  if(s.neg){const from=s.neg.from,fu=from&15,flip=(~fu)&15;out+=R(340,236,240,92,'#fff',C.grid,8)+TF(352,258,`Negate ${from}: ${bin(fu,4)}`,14,C.ink,'start')+TF(352,280,`flip every bit → ${bin(flip,4)}`,14,C.ink,'start')+TF(352,302,`add 1 → ${bin((flip+1)&15,4)} = ${s.v}`,14,C.green,'start','font-weight="700"')+(s.ovf?TF(352,322,'−8 has no positive partner in 4 bits',13,C.coral,'start'):'')}
  else if(s.ovf)out+=R(340,244,240,52,C.coralp,C.coral,8)+TBF(460,267,'Overflow: wrapped round',14,C.coral)+TF(460,286,'the true answer needs 5 bits',13,C.ink);
  return {svg:out,phase:`${u===s.v?`${bin(u,4)} means ${u} either way: patterns starting with 0 are the same signed or unsigned.`:`${bin(u,4)} means ${u} unsigned but ${String(s.v).replace('-','−')} signed.`} The circuit that adds unsigned numbers also adds signed ones correctly; only the reading changes. Positives start with 0, negatives with 1.`};
 }});

const R1_FLOATS=[[0.1,'0.1'],[0.5,'0.5'],[3.75,'3.75'],[-2.5,'−2.5'],[1/3,'1/3'],[16777217,'16 777 217']];
function R1_f32(v){const dv=new DataView(new ArrayBuffer(4));dv.setFloat32(0,v);return dv.getUint32(0)}
SCENE({id:'floating-point',name:'Floating point',tag:'Scientific notation in binary',
 definition:'A floating-point number stores a sign, an exponent and a fraction (mantissa), like scientific notation in base 2. Most decimals, such as 0.1, can only be stored approximately.',
 example:'0.1 becomes 1.6 × 2⁻⁴, but 1.6 has no exact binary fraction, so it is rounded: as a 32-bit float (shown here) 0.1 is stored as 0.100000001490116…, and as a 64-bit double, the default in most languages, as 0.1000000000000000055… That 64-bit rounding is why 0.1 + 0.2 shows as 0.30000000000000004.',
 desc:'Thirty-two bit cells split into sign, exponent and mantissa fields, with the decoded value and the rounding error below.',
 dur:12,hint:'Pick a value and compare what is stored with what you asked for. 0.5 and 3.75 are exact; 0.1 and 1/3 are not.',
 init:()=>({i:0}),
 watch(p){return {i:Math.min(5,Math.floor(p*6))}},
 ui:[{choose:R1_FLOATS.map(([v,l],i)=>[i,l]),label:'Value',get:s=>s.i,act:'pick'}],
 on:{pick(s,v){s.i=Number(v)}},
 draw(s){
  const [v,label]=R1_FLOATS[s.i],u=R1_f32(v),bits=bin(u,32),sg=u>>>31,e=(u>>>23)&255,m=u&0x7FFFFF,stored=Math.fround(v),frac=1+m/2**23;
  let out=heading(`${label} as a 32-bit float`);const cw=16.5,x0=36;
  bits.split('').forEach((b,i)=>{const col=i===0?C.purple:i<9?C.coral:C.blue,x=x0+i*cw;out+=R(x,58,cw-2,34,b==='1'?col:'#fff',col,4)+TMF(x+(cw-2)/2,80,b,13,b==='1'?'#fff':col,'middle','font-weight="700"')});
  out+=TBF(x0+7,112,'sign',13,C.purple)+TBF(x0+5*cw,112,'exponent (8 bits)',13,C.coral)+TBF(x0+20.5*cw,112,'mantissa (23 bits)',13,C.blue);
  const ex=String(e-127).replace('-','−');const rows=[[`sign ${sg}`,sg?'negative':'positive',C.purple],[`exponent ${e}`,`2^(${e} − 127) = 2^${ex}`,C.coral],[`mantissa`,`1 + ${m.toLocaleString('en-GB')}/2²³ = ${frac.toFixed(9)}`,C.blue]];
  rows.forEach(([a,b,c],i)=>{const y=148+i*28;out+=TBF(40,y,a,14,c,'start')+TF(170,y,b,14,C.ink,'start')});
  out+=R(30,232,540,40,'#fff',C.grid,8)+TF(44,258,`stored: ${sg?'−':''}${frac.toFixed(9)} × 2^${ex} = ${stored.toPrecision(17).replace(/0+$/,'').replace(/\.$/,'')}`,15,C.ink,'start');
  const err=Math.abs(stored-v),exact=err===0;
  out+=TB(300,300,exact?'Exact: this value is a sum of powers of 2':`Error: ${err.toExponential(2)}`,16,exact?C.green:C.coral);
  out+=TF(300,338,'In 64-bit doubles: 0.1 + 0.2 = 0.30000000000000004',14,C.muted);
  return {svg:out,phase:exact?`${label} is exactly representable: it needs only a few powers of 2.`:v>16e6?'Above 2²⁴ the 23-bit mantissa cannot hold every whole number, so 16 777 217 rounds to 16 777 216.':`${label} would need an endless binary fraction, so it is rounded to the nearest value the 23 mantissa bits allow. Compare floating-point results with a tolerance, never with ==.`};
 }});

/* ---- Lesson: hexadecimal ---- */
SCENES.hexadecimal.three=(s,f,X,project)=>{
 const P=project([[0,0,0],[3,3,3],[-.3,-.3,-.3],[3.6,3.6,3.6]]),k=3/255,pt=[s.r*k,s.g*k,s.b*k],col='#'+hex(s.r)+hex(s.g)+hex(s.b);let out='';
 const corners=range(8).map(i=>[i&1,i>>1&1,i>>2&1]);
 corners.forEach((a,i)=>corners.forEach((b,j)=>{if(j>i&&Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2])===1)out+=line3(a.map(v=>v*3),b.map(v=>v*3),P,C.line,1.6)}));
 out+=line3([pt[0],pt[1],0],pt,P,C.muted,1.4,'stroke-dasharray="4 4"')+line3([pt[0],0,0],[pt[0],pt[1],0],P,C.muted,1.4,'stroke-dasharray="4 4"')+line3([0,pt[1],0],[pt[0],pt[1],0],P,C.muted,1.4,'stroke-dasharray="4 4"');
 out+=sortedItems(corners.map(c=>({at:c.map(v=>v*3),svg:P=>{const q=P(c.map(v=>v*3));return Ci(q[0],q[1],9,'#'+c.map(v=>v?'FF':'00').join(''),C.ink)}})).concat([{at:pt,svg:P=>{const q=P(pt);return Ci(q[0],q[1],17,col,C.ink)+R(q[0]-38,q[1]+22,76,22,'#fff','none',6,'opacity=".85"')+TBF(q[0],q[1]+38,col,14,C.ink)}}]),P);
 const mid=P([1.5,1.5,1.5]);
 for(const [c,nm,ink] of [[[3,0,0],'red',C.coral],[[0,3,0],'green',C.green],[[0,0,3],'blue',C.blue],[[0,0,0],'black',C.ink],[[3,3,3],'white',C.muted]]){const q=P(c),dx=q[0]-mid[0],dy=q[1]-mid[1],d=Math.hypot(dx,dy)||1;out+=TF(q[0]+dx/d*30,q[1]+dy/d*24+5,nm,13,ink,'middle','font-weight="650"')}
 return {svg:out,title:'The RGB colour cube',caption:`Every 24-bit colour is a point in a cube: red, green and blue each run from 00 to FF. ${col} sits at (${s.r}, ${s.g}, ${s.b}). The corners are black, white and the six pure mixtures.`};
};
SCENE({id:'hex-nibbles',name:'Hex digits and nibbles',tag:'Sixteen four-bit patterns',
 definition:'Each hexadecimal digit names one of the sixteen 4-bit patterns (a nibble), so converting between hex and binary is a lookup, digit by digit.',
 example:'0x2F: 2 = 0010 and F = 1111, so 0x2F = 0010 1111 = 47. No arithmetic is needed to go from hex to binary.',
 desc:'A four-by-four table of the sixteen hex digits with their bit patterns, above a hex number expanded into groups of four bits.',
 dur:10,hint:'Type a hex number, or press digits in the table to add them. Each digit expands into exactly four bits.',
 init:()=>({hex:'2F'}),
 watch(p){return {hex:'C0FFEE'.slice(0,Math.max(1,Math.ceil(p*6)))}},
 ui:[{text:'Hex',label:'Hex number',get:s=>s.hex,act:'set',max:6},{b:'Delete digit',act:'del'}],
 on:{set(s,v){s.hex=String(v).toUpperCase().replace(/^0X/,'').replace(/[^0-9A-F]/g,'').slice(0,6)},add(s,d){if(s.hex.length<6)s.hex+=d},del(s){s.hex=s.hex.slice(0,-1)}},
 draw(s,f,X){
  let out=heading('Sixteen nibbles, sixteen hex digits');const used=new Set(s.hex.split(''));
  for(let i=0;i<16;i++){const d=hex(i,1),x=28+(i%4)*138,y=46+Math.floor(i/4)*42,on=used.has(d);
   out+=hit(X,'add',d,`Add digit ${d}`,R(x,y,130,36,on?C.amberp:'#fff',on?C.amber:C.grid,7)+TBF(x+20,y+24,d,17,C.blue)+TMF(x+72,y+24,bin(i,4),15,C.ink)+TF(x+118,y+24,i,13,C.muted,'end'))}
  const n=s.hex.length,w=Math.min(92,560/Math.max(1,n)),x0=300-n*w/2;
  if(!n)out+=T(300,270,'Type or press some hex digits.',16,C.muted);
  s.hex.split('').forEach((d,i)=>{const x=x0+i*w+w/2;out+=TB(x,240,d,24,C.blue)+L(x-w/2+8,250,x+w/2-8,250,C.grid,2)+TMF(x,274,bin(parseInt(d,16),4),Math.min(17,w/3.6),C.ink)});
  if(n){const v=parseInt(s.hex,16);out+=T(300,322,`0x${s.hex} = ${v.toLocaleString('en-GB')} in decimal`,17,C.ink,'middle','font-weight="650"')+TF(300,348,`${n} hex digit${n>1?'s':''} = ${4*n} bits${n%2===0?' = '+n/2+' byte'+(n>2?'s':''):''}`,14,C.muted)}
  return {svg:out,phase:'Because 16 = 2⁴, every hex digit lines up with exactly four bits. Programmers read colours, memory addresses and machine code in hex for this reason.'};
 }});

SCENE({id:'hex-dump',name:'Memory dump in hex',tag:'Addresses and bytes',
 definition:'A hex dump lists memory or a file as rows of bytes in hexadecimal, each row starting with its address, with the matching text alongside.',
 example:'“Hi!” is stored as 48 69 21 at addresses 0x00, 0x01 and 0x02. Programmers read dumps like this when debugging files and network data.',
 desc:'Rows of eight hex bytes, each row labelled with its starting address, beside the characters those bytes encode; one byte is highlighted.',
 dur:10,hint:'Type some text, then press any byte to see its address, value and character.',
 init:()=>({text:'Hello, world! 42',sel:7}),
 watch(p){const t='Hello, world! 42';const k=Math.min(t.length-1,Math.floor(p*t.length));return {text:t,sel:k,shown:k+1}},
 ui:[{text:'Text',label:'Text',get:s=>s.text,act:'set',max:24}],
 on:{set(s,v){s.text=v;s.sel=null},byte(s,i){s.sel=Number(i)}},
 draw(s,f,X){
  const bytes=Array.from(new TextEncoder().encode(s.text)).slice(0,32),shown=s.shown===undefined?bytes.length:s.shown;let out=heading('address · bytes in hex · the same bytes as text');
  out+=TBF(50,70,'address',13,C.muted)+TBF(274,70,'bytes',13,C.muted)+TBF(538,70,'text',13,C.muted);
  for(let r=0;r*8<Math.max(1,bytes.length);r++){const y=84+r*46;out+=TMF(50,y+27,'0x'+hex(r*8),15,C.purple);
   for(let j=0;j<8;j++){const i=r*8+j;if(i>=bytes.length)break;const b=bytes[i],vis=i<shown,on=i===s.sel,x=100+j*44;
    out+=hit(X,'byte',i,`Address 0x${hex(i)}: byte ${hex(b)}`,R(x,y,40,38,on?C.amber:'#fff',on?C.amber:C.grid,6)+TMF(x+20,y+25,vis?hex(b):'··',15,on?'#fff':C.ink,'middle','font-weight="650"'));
    const ch=b>=32&&b<127?String.fromCharCode(b):'·';out+=R(474+j*14,y+6,13,26,on?C.amberp:'none','none',3)+TMF(480+j*14,y+25,vis?ch:' ',15,on?C.ink:b>=32&&b<127?C.ink:C.muted,'middle','xml:space="preserve"')}}
  if(!bytes.length)out+=T(300,120,'Type some text to see its bytes.',16,C.muted);
  const i=s.sel;if(i!==null&&i<bytes.length){const b=bytes[i];out+=R(80,284,440,52,C.pale,'none',10)+T(300,316,`Address 0x${hex(i)} (${i}) holds 0x${hex(b)} = ${b} = ${b>=32&&b<127?'“'+String.fromCharCode(b)+'”':'part of a multi-byte character'}`,15,C.ink)}
  return {svg:out,phase:`${bytes.length} bytes. Each row covers 8 addresses, so the address column counts up by 8 (0x08 = 8, 0x10 = 16). Bytes that are not printable ASCII show as a dot.`};
 }});

/* ---- Lesson: ascii ---- */
const R1_CTRL={9:'TAB',10:'LF',13:'CR'};
function R1_ctrlBytes(text,style){const out=[];for(const ch of text.replace(/\\n/g,'\n').replace(/\\t/g,'\t')){if(ch==='\n'){if(style!=='LF')out.push(13);if(style!=='CR')out.push(10)}else out.push(ch.codePointAt(0))}return out.slice(0,16)}
SCENE({id:'control-characters',name:'Control characters',tag:'Invisible codes that shape text',
 definition:'Codes 0 to 31 in ASCII are control characters: they do not print a symbol but tell a device what to do, such as start a new line (LF, 10) or jump to the next tab stop (TAB, 9).',
 example:'Windows ends a line with two codes, CR LF (13 10); Linux and macOS use LF (10) alone. A file moved between them can show stray symbols or run all on one line.',
 desc:'A small text display above the codes actually stored, with the invisible control characters drawn in amber and named.',
 dur:10,hint:'Type text using \\n for a new line and \\t for a tab, then switch the line-ending style and watch the stored codes change.',
 init:()=>({text:'Hi\\nyou\\tall',style:'LF'}),
 watch(p){return {text:'Hi\\nyou\\tall',style:p<.5?'LF':'CRLF'}},
 ui:[{text:'Text',label:'Text',get:s=>s.text,act:'set',max:20},{choose:[['LF','LF (Unix)'],['CRLF','CR LF (Windows)'],['CR','CR (old Mac)']],label:'Line ending',get:s=>s.style,act:'style'}],
 on:{set(s,v){s.text=v},style(s,v){s.style=v}},
 draw(s){
  const real=s.text.replace(/\\n/g,'\n').replace(/\\t/g,'\t'),lines=real.split('\n').slice(0,3),codes=R1_ctrlBytes(s.text,s.style);let out=heading('What you see, and what is stored');
  out+=R(30,46,540,104,'#fff',C.grid,10)+TF(44,66,'display',13,C.muted,'start');
  lines.forEach((ln,i)=>{let x=60;const y=92+i*24;for(const ch of ln){if(ch==='\t'){const nx=60+(Math.floor((x-60)/40)+1)*40;out+=arrow(x+2,y-5,nx-4,y-5,C.amber,1.6,6);x=nx}else{out+=TMF(x+5,y,ch,17,C.ink);x+=10.2}}});
  const n=codes.length,w=Math.min(66,540/Math.max(8,Math.ceil(n/2))),per=Math.ceil(n/2)||1;
  codes.forEach((c,i)=>{const r=Math.floor(i/Math.max(per,8)),j=i%Math.max(per,8),x=30+j*w,y=176+r*82,ctl=c<32;
   out+=R(x+3,y,w-6,46,ctl?C.amberp:'#fff',ctl?C.amber:C.grid,7)+TBF(x+w/2,y+20,ctl?(R1_CTRL[c]||'^'+String.fromCharCode(c+64)):String.fromCodePoint(c),15,ctl?C.amber:C.ink)+TMF(x+w/2,y+39,c,13,C.muted)});
  const ctl=codes.filter(c=>c<32).length;
  out+=T(300,358,`${n} codes stored, ${ctl} of them invisible control characters`,14,C.muted);
  return {svg:out,phase:s.style==='CRLF'?'CR (carriage return) moved a teleprinter’s head back to the left; LF (line feed) rolled the paper up. Windows still stores both.':s.style==='CR'?'Classic Mac OS used CR alone. Text from it opened elsewhere can appear as one long line.':'A single LF (10) ends each line on Linux and macOS. The tab (9) is one code, however wide it looks.'};
 }});

SCENE({id:'text-sorting',name:'Sorting text by code',tag:'Why “Zebra” comes before “apple”',
 definition:'Comparing text by character codes puts every capital letter before every lowercase one, and compares digits one at a time, so plain code order is not dictionary order.',
 example:'By code, “Zebra” (Z = 90) comes before “apple” (a = 97), and “10” before “9” because “1” (49) is less than “9” (57). A dictionary comparison ignores case and reads whole numbers.',
 desc:'Two lists of the same words, one in character-code order and one in dictionary order, joined by lines that cross wherever the orders disagree.',
 dur:10,hint:'Edit the comma-separated words, then compare code order with case-insensitive or dictionary order.',
 init:()=>({words:'apple,Banana,cherry,Zebra,10,9,éclair',mode:'dict'}),
 watch(p){return {words:'apple,Banana,cherry,Zebra,10,9,éclair',mode:p<.5?'case':'dict',reveal:clamp((p%.5)*3,0,1)}},
 ui:[{text:'Words',label:'Words',get:s=>s.words,act:'set',max:48},{choose:[['case','Ignore case'],['dict','Dictionary']],label:'Right-hand order',get:s=>s.mode,act:'mode'}],
 on:{set(s,v){s.words=v},mode(s,v){s.mode=v}},
 draw(s){
  const ws=[...new Set(s.words.split(',').map(w=>w.trim()).filter(Boolean))].slice(0,7);
  const byCode=ws.slice().sort((a,b)=>a<b?-1:a>b?1:0),col=new Intl.Collator('en-GB',{sensitivity:'base',numeric:true});
  const right=ws.slice().sort(s.mode==='dict'?col.compare:(a,b)=>{const x=a.toLowerCase(),y=b.toLowerCase();return x<y?-1:x>y?1:0});
  let out=heading('The same words in two orders');const rh=38,y0=70;
  out+=TBF(150,58,'By character code',14,C.ink)+TBF(450,58,s.mode==='dict'?'Dictionary order':'Ignoring case',14,C.blue);
  const rv=s.reveal===undefined?1:s.reveal;let crosses=0;
  byCode.forEach((w,i)=>{const j=right.indexOf(w),y=y0+i*rh,y2=y0+j*rh;if(i!==j)crosses++;out+=P(`M240 ${y+16}C305 ${y+16} 295 ${y2+16} 360 ${y2+16}`,i===j?C.line:C.coral,i===j?1.5:2.2,'none',`opacity="${rv}"`)});
  byCode.forEach((w,i)=>{const y=y0+i*rh,c=w.codePointAt(0);out+=R(60,y,180,32,'#fff',C.grid,6)+TMF(72,y+22,w.length>11?w.slice(0,10)+'…':w,15,C.ink,'start')+TF(230,y+21,`${String.fromCodePoint(c)} ${c}`,13,C.muted,'end')});
  right.forEach((w,i)=>{const y=y0+i*rh;out+=R(360,y,180,32,'#fff',C.blue,6)+TMF(372,y+22,w.length>14?w.slice(0,13)+'…':w,15,C.ink,'start')});
  out+=TF(300,y0+Math.max(1,ws.length)*rh+22,'digits 48–57 · A–Z 65–90 · a–z 97–122 · é 233',13,C.muted);
  return {svg:out,phase:crosses?`${crosses} words move. Code order compares one character code at a time, so capitals, digits and accents land in surprising places. Real software sorts with language-aware rules.`:'Both orders agree for these words.'};
 }});

/* ---- Lesson: unicode ---- */
const R1_BLOCKS=[['Basic Latin (ASCII)',0x0,0x7F],['Latin-1 Supplement',0x80,0xFF],['Greek',0x370,0x3FF],['Cyrillic',0x400,0x4FF],['Arabic',0x600,0x6FF],['Devanagari',0x900,0x97F],['CJK ideographs',0x4E00,0x9FFF],['Hangul syllables',0xAC00,0xD7AF],['Emoji and pictographs',0x1F300,0x1FAFF]];
SCENE({id:'code-point-map',name:'Scripts in the code space',tag:'Blocks of code points',
 definition:'Unicode arranges its code points in blocks, one or more per writing system, from Basic Latin at U+0000 up to emoji beyond U+1F300.',
 example:'“A” is U+0041 in Basic Latin, “Ж” is U+0416 in Cyrillic, “中” is U+4E2D among the CJK ideographs, and “😀” is U+1F600. Over 150,000 characters are assigned.',
 desc:'A list of Unicode blocks with their code-point ranges; each character typed appears as a chip in the block it belongs to.',
 dur:10,hint:'Type characters from any language or an emoji and watch which block each one falls into.',
 init:()=>({text:'Aé Ω Ж ع अ 中 한 😀'}),
 watch(p){const a=Array.from('Aé Ω Ж ع अ 中 한 😀');return {text:a.slice(0,Math.max(1,Math.ceil(p*a.length))).join('')}},
 ui:[{text:'Text',label:'Text',get:s=>s.text,act:'set',max:20}],
 on:{set(s,v){s.text=v}},
 draw(s){
  const chars=[...new Set(Array.from(s.text).filter(c=>c.trim()))].slice(0,14);let out=heading('Where characters live in Unicode');const rh=30,y0=48;
  const rows=R1_BLOCKS.concat([['Other blocks',-1,-1]]),placed=rows.map(()=>[]);
  chars.forEach(c=>{const cp=c.codePointAt(0);let k=rows.findIndex(([,a,b])=>cp>=a&&cp<=b);if(k<0)k=rows.length-1;placed[k].push(c)});
  rows.forEach(([nm,a,b],i)=>{const y=y0+i*rh,on=placed[i].length>0;out+=R(20,y,560,rh-4,on?'#fff':'#f3f6f8',on?C.blue:'none',6)+TF(30,y+18,nm,13,on?C.ink:C.muted,'start','font-weight="650"');
   if(a>=0)out+=TMF(250,y+18,`U+${hex(a,4)}–${hex(b,4)}`,13,C.muted,'start');
   placed[i].slice(0,5).forEach((c,j)=>{const x=392+j*37;out+=R(x,y+2,34,rh-8,C.amberp,'none',5)+TF(x+17,y+19,c,15,C.ink)})});
  out+=TF(300,y0+rows.length*rh+16,'Up to U+FFFF is the Basic Multilingual Plane; emoji live in plane 1, above U+FFFF.',13,C.muted);
  return {svg:out,phase:chars.length?chars.map(c=>`${c} = U+${hex(c.codePointAt(0),4)}`).join(', ')+'. Each block keeps one script together, so related characters have nearby numbers.':'Type some characters.'};
 }});

SCENE({id:'mojibake',name:'Mojibake',tag:'Bytes read with the wrong table',
 definition:'Mojibake is garbled text produced when bytes written in one encoding are read back using another.',
 example:'“Café” saved as UTF-8 stores é as the two bytes C3 A9. Read those bytes as Latin-1 and each becomes its own character: “CafÃ©”.',
 desc:'Three rows: the characters typed, the UTF-8 bytes that store them, and the characters you get when those bytes are decoded with a chosen table.',
 dur:10,hint:'Type text with accents or symbols, then switch between reading the bytes correctly (UTF-8) and wrongly (Latin-1).',
 init:()=>({text:'Café ½ €',as:'latin1'}),
 watch(p){return {text:'Café ½ €',as:'latin1',stage:p<.3?1:p<.6?2:3}},
 ui:[{text:'Text',label:'Text',get:s=>s.text,act:'set',max:12},{choose:[['utf8','Read as UTF-8'],['latin1','Read as Latin-1']],label:'Decode with',get:s=>s.as,act:'as'}],
 on:{set(s,v){s.text=v},as(s,v){s.as=v}},
 draw(s){
  const stage=s.stage||3,enc=new TextEncoder(),chars=Array.from(s.text).slice(0,10);let bytes=[];const spans=[];
  chars.forEach(c=>{const b=Array.from(enc.encode(c));spans.push([bytes.length,b.length,c]);bytes=bytes.concat(b)});bytes=bytes.slice(0,16);
  const n=bytes.length,w=Math.min(40,560/Math.max(1,n)),x0=300-n*w/2,cols=[C.blue,C.green,C.purple,C.coral];let out=heading('Typed → stored as UTF-8 bytes → read back');
  out+=TF(20,82,'typed',13,C.muted,'start')+TF(20,170,'bytes',13,C.muted,'start')+TF(20,256,'read',13,C.muted,'start');
  spans.forEach(([st,len,c],k)=>{if(st>=n)return;const l=Math.min(len,n-st),x=x0+st*w,col=cols[(len-1)%4];out+=R(x+2,62,l*w-4,34,'#fff',col,7)+T(x+l*w/2,86,c===' '?'␣':c,18,C.ink);
   if(stage>=2)out+=P(`M${x+4} 104L${x+4} 112L${x+l*w-4} 112L${x+l*w-4} 104`,col,1.6)});
  if(stage>=2)bytes.forEach((b,i)=>{const sp=spans.find(([st,len])=>i>=st&&i<st+len),col=cols[(sp[1]-1)%4],x=x0+i*w;out+=R(x+2,150,w-4,34,b>127?col:'#fff',col,6)+TMF(x+w/2,172,hex(b),Math.min(14,w*.42),b>127?'#fff':col,'middle','font-weight="700"')});
  let bad=false;
  if(stage>=3){if(s.as==='utf8')spans.forEach(([st,len,c])=>{if(st>=n)return;const l=Math.min(len,n-st),x=x0+st*w;out+=R(x+2,236,l*w-4,34,C.greenp,C.green,7)+T(x+l*w/2,260,c===' '?'␣':c,18,C.ink)});
   else bytes.forEach((b,i)=>{const x=x0+i*w,ch=b>=0x80&&b<0xA0?'·':String.fromCharCode(b),wrong=b>127;if(wrong)bad=true;out+=R(x+2,236,w-4,34,wrong?C.coralp:'#fff',wrong?C.coral:C.grid,6)+T(x+w/2,260,ch===' '?'␣':ch,17,wrong?C.coral:C.ink)});
   const shown=s.as==='utf8'?s.text:bytes.map(b=>b>=0x80&&b<0xA0?'·':String.fromCharCode(b)).join('');
   out+=R(80,298,440,46,s.as==='utf8'||!bad?C.greenp:C.coralp,'none',10)+TB(300,328,'“'+shown+'”',19,s.as==='utf8'||!bad?C.green:C.coral)}
  return {svg:out,phase:stage<3?'Each character becomes one to four bytes. Only the bytes are saved; the encoding is an agreement about how to read them.':s.as==='utf8'?'Read with the same table it was written in, the text comes back intact.':bad?'Latin-1 treats every byte as a separate character, so each multi-byte character falls apart into two or three odd symbols.':'Plain ASCII text reads the same in both tables, which is why the problem often hides until an accent appears.'};
 }});

/* ---- Lesson: bitmap ---- */
function R1_scene(u,v){
 const sun=Math.hypot(u-.72,(v-.3)*.6)<.13,hill=v>.66+.1*Math.sin(u*7);
 return sun?[1,.86,.25]:hill?[.12+.3*u,.7-.25*(v-.6),.18]:[.18+.8*v,.4+.45*v,.95-.45*v];
}
function R1_quant(c,bpp){
 if(bpp===1){const y=.3*c[0]+.59*c[1]+.11*c[2];return y>.5?[1,1,1]:[0,0,0]}
 const L=2**(bpp/3)-1;return c.map(x=>Math.round(x*L)/L);
}
const R1_hexc=c=>'#'+c.map(x=>hex(Math.round(x*255))).join('');
SCENE({id:'colour-depth',name:'Colour depth and resolution',tag:'How many bits per pixel',
 definition:'Colour depth is the number of bits stored for each pixel; resolution is how many pixels there are. File size is width × height × bits per pixel.',
 example:'With 24 bits per pixel (8 each for red, green and blue) there are 16.7 million colours. A 1920 × 1080 photo then needs about 6.2 MB before compression.',
 desc:'A small landscape drawn with a chosen number of bits per pixel and a chosen grid size, beside the number of colours and the file size.',
 dur:11,hint:'Change bits per pixel and resolution. Watch smooth gradients turn into bands, and the size change.',
 init:()=>({bpp:6,res:24}),
 watch(p){return {bpp:[1,3,6,12,24][Math.min(4,Math.floor(p*5))],res:24}},
 ui:[{choose:[[1,'1 bit'],[3,'3'],[6,'6'],[12,'12'],[24,'24']],label:'Bits per pixel',get:s=>s.bpp,act:'bpp'},{choose:[[12,'12 × 6'],[24,'24 × 12'],[48,'48 × 24']],label:'Resolution',get:s=>s.res,act:'res'}],
 on:{bpp(s,v){s.bpp=Number(v)},res(s,v){s.res=Number(v)}},
 draw(s){
  const w=s.res,h=w/2,cs=360/w;let out=heading(`${s.bpp} bit${s.bpp>1?'s':''} per pixel, ${w} × ${h} pixels`);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)out+=`<rect x="${fmt(24+x*cs)}" y="${fmt(52+y*cs)}" width="${fmt(cs+.4)}" height="${fmt(cs+.4)}" fill="${R1_hexc(R1_quant(R1_scene(x/(w-1),y/(h-1)),s.bpp))}"/>`;
  out+=R(24,52,360,180,'none',C.grid,2);
  const colours=2**s.bpp,bytes=w*h*s.bpp/8,photo=1920*1080*s.bpp/8/1e6;
  out+=R(400,52,180,180,'#fff',C.grid,10)+TF(490,80,'colours available',13,C.muted)+TBF(490,106,colours.toLocaleString('en-GB'),18,C.blue)+TF(490,140,'this image',13,C.muted)+TBF(490,164,`${bytes.toLocaleString('en-GB')} bytes`,16,C.ink)+TF(490,196,'a 1920 × 1080 photo',13,C.muted)+TBF(490,220,`${photo.toFixed(1)} MB`,16,C.ink);
  out+=T(300,268,`size = ${w} × ${h} pixels × ${s.bpp} bits ÷ 8 = ${bytes.toLocaleString('en-GB')} bytes`,15,C.ink);
  out+=TF(300,300,s.bpp===1?'1 bit: each pixel is black or white':s.bpp===24?'8 bits per channel: 256 levels of each primary':`${s.bpp/3} bit${s.bpp>3?'s':''} per channel: ${2**(s.bpp/3)} levels of red, green and blue`,14,C.muted);
  return {svg:out,phase:s.bpp<12?'Too few levels and smooth skies break into visible bands (posterisation). More bits per pixel cost proportionally more storage.':'At high depth the bands vanish. Doubling the resolution quadruples the pixel count, and so the size.'};
 }});

const R1_RLE0=['0000000000000000','0000011111100000','0001111111111000','0001111111111000','0000011111100000','0000000000000000'];
function R1_runs(row){const r=[];let cur='0',n=0;for(const ch of row){if(ch===cur)n++;else{r.push(n);cur=ch;n=1}}r.push(n);return r}
SCENE({id:'run-length-encoding',name:'Run-length encoding',tag:'Compress repeated pixels',
 definition:'Run-length encoding stores a row as the lengths of its runs of identical values instead of every value, which shrinks images with large flat areas.',
 example:'The row 0000011111100000 becomes 5, 6, 5: five off, six on, five off. A row that alternates 0101… gets longer, not shorter.',
 desc:'A grid of black and white pixels with each row’s run lengths beside it, and the total size before and after encoding.',
 dur:11,hint:'Paint pixels, or load a preset. Long runs compress well; busy patterns do not.',
 init:()=>({rows:R1_RLE0.slice()}),
 watch(p){return {rows:R1_RLE0.slice(),upto:Math.min(6,Math.floor(p*7))}},
 ui:[{b:'Shape',act:'preset',arg:'shape'},{b:'Stripes',act:'preset',arg:'stripes'},{b:'Checkerboard',act:'preset',arg:'check'},{b:'Blank',act:'preset',arg:'blank'}],
 on:{px(s,a){const [r,c]=String(a).split(',').map(Number);const row=s.rows[r].split('');row[c]=row[c]==='1'?'0':'1';s.rows[r]=row.join('')},
  preset(s,k){s.rows=k==='shape'?R1_RLE0.slice():k==='stripes'?range(6).map(i=>i%2?'1111111111111111':'0000000000000000'):k==='check'?range(6).map(i=>range(16).map(j=>(i+j)%2).join('')):range(6).map(()=>'0'.repeat(16))}},
 draw(s,f,X){
  const cs=22,x0=24,y0=60,upto=s.upto===undefined?6:s.upto;let out=heading('Store the length of each run, not every pixel');let total=0;
  s.rows.forEach((row,i)=>{row.split('').forEach((b,j)=>out+=hit(X,'px',i+','+j,`Row ${i+1}, column ${j+1}`,R(x0+j*cs,y0+i*34,cs-2,30,b==='1'?C.dark:'#fff',C.grid,3)));
   const runs=R1_runs(row);total+=runs.length;if(i<upto){let x=400;runs.slice(0,9).forEach((n,k)=>{const on=k%2===1;out+=R(x,y0+i*34+3,22,24,on?C.dark:C.pale,'none',4)+TMF(x+11,y0+i*34+20,n,13,on?'#fff':C.ink,'middle','font-weight="700"');x+=25});if(runs.length>9)out+=TF(x+4,y0+i*34+20,'…',14,C.muted,'start')}});
  const raw=96,enc=total*5;
  out+=TF(400,y0-8,'runs (off, on, off…)',13,C.muted,'start');
  if(upto>=6)out+=R(24,272,552,76,enc<raw?C.greenp:C.coralp,'none',10)+T(300,298,`raw: 6 rows × 16 bits = ${raw} bits`,15,C.ink)+TB(300,328,`encoded: ${total} runs × 5 bits = ${enc} bits (${enc<raw?Math.round(100-100*enc/raw)+'% smaller':Math.round(100*enc/raw-100)+'% larger'})`,15,enc<raw?C.green:C.coral);
  return {svg:out,phase:enc<raw?'Flat areas become a few numbers, so the image shrinks with no loss: decoding gives back exactly the same pixels. Fax machines and the PNG and GIF formats use related ideas.':'Many short runs cost more than the raw bits. No lossless method can shrink every input.'};
 }});

/* ---- Lesson: boolean ---- */
SCENES.boolean.three=(s,f,X,project)=>{
 const P=project([[0,0,0],[2,2,2],[-.4,-.4,-.4],[2.5,2.5,2.5]]),val=(a,b,c)=>(a&b)|(c?0:1),cur=[s.a,s.b,s.c];let out='';
 const cs=range(8).map(i=>[i>>2&1,i>>1&1,i&1]);
 cs.forEach((p,i)=>cs.forEach((q,j)=>{if(j>i&&p.reduce((d,v,k)=>d+Math.abs(v-q[k]),0)===1)out+=line3(p.map(v=>v*2),q.map(v=>v*2),P,C.line,1.6)}));
 out+=axes3(P,['A','B','C'],[2.7,2.7,2.7]);
 out+=sortedItems(cs.map(c=>({at:c.map(v=>v*2),svg:P=>{const q=P(c.map(v=>v*2)),on=val(...c),me=c.every((v,k)=>v===cur[k]);return (me?Ci(q[0],q[1],27,'none',C.coral):'')+Ci(q[0],q[1],19,on?C.blue:'#fff',on?C.blue:C.line)+TMF(q[0],q[1]+5,c.join(''),13,on?'#fff':C.ink,'middle','font-weight="700"')}})),P);
 return {svg:out,title:'Inputs as cube corners',caption:`Each corner is one truth-table row (A, B, C). Blue corners make (A AND B) OR NOT C true: the face C = 0 plus 111. Ringed: the current input ${cur.join('')}.`};
};
SCENE({id:'de-morgan',name:'De Morgan’s laws',tag:'NOT swaps AND with OR',
 definition:'De Morgan’s laws: NOT (A AND B) equals (NOT A) OR (NOT B), and NOT (A OR B) equals (NOT A) AND (NOT B).',
 example:'“Not both raining and cold” is the same as “not raining, or not cold”. Programmers use the laws to simplify conditions such as !(x > 0 && y > 0).',
 desc:'Both sides of the chosen law evaluated for the current inputs, beside a four-row table showing the two sides agree on every row.',
 dur:11,hint:'Flip A and B and switch between the two laws. The two columns of the table always match.',
 init:()=>({a:1,b:0,law:1}),
 watch(p){const q=p<.5?p*2:(p-.5)*2,r=Math.min(3,Math.floor(q*4));return {a:r>>1&1,b:r&1,law:p<.5?1:2}},
 ui:[{choose:[[1,'NOT (A AND B)'],[2,'NOT (A OR B)']],label:'Law',get:s=>s.law,act:'law'}],
 on:{law(s,v){s.law=Number(v)},tog(s,k){s[k]^=1}},
 draw(s,f,X){
  const one=s.law===1,L1=(a,b)=>one?1-(a&b):1-(a|b),R1=(a,b)=>one?(1-a)|(1-b):(1-a)&(1-b),inner=one?s.a&s.b:s.a|s.b,lv=L1(s.a,s.b),rv=R1(s.a,s.b);
  let out=heading(one?'NOT (A AND B)  =  (NOT A) OR (NOT B)':'NOT (A OR B)  =  (NOT A) AND (NOT B)');
  out+=toggle(X,'tog','a',22,56,s.a,'A')+toggle(X,'tog','b',22,140,s.b,'B');
  out+=R(120,52,210,124,'#fff',C.grid,10)+R(370,52,210,124,'#fff',C.grid,10)+TB(350,120,'=',28,C.ink);
  out+=TMF(225,82,`${s.a} ${one?'AND':'OR'} ${s.b} = ${inner}`,15,C.ink)+TMF(225,112,`NOT ${inner} = ${lv}`,15,C.ink)+R(195,128,60,36,lv?C.blue:'#fff',C.blue,8)+TBF(225,152,lv,18,lv?'#fff':C.blue);
  out+=TMF(475,82,`NOT ${s.a} = ${1-s.a}, NOT ${s.b} = ${1-s.b}`,14,C.ink)+TMF(475,112,`${1-s.a} ${one?'OR':'AND'} ${1-s.b} = ${rv}`,15,C.ink)+R(445,128,60,36,rv?C.blue:'#fff',C.blue,8)+TBF(475,152,rv,18,rv?'#fff':C.blue);
  const rows=[[0,0],[0,1],[1,0],[1,1]].map(([a,b])=>[a,b,L1(a,b),R1(a,b)]);
  out+=truthTable(170,192,['A','B','left','right'],rows,s.a*2+s.b,66,30);
  return {svg:out,phase:`Both sides give ${lv}. Pushing a NOT inside the brackets flips each input and swaps ${one?'AND for OR':'OR for AND'}; the table shows the two columns are identical, so the expressions are equivalent.`};
 }});

const R1_FN=['FALSE','AND','A AND NOT B','A','NOT A AND B','B','XOR','OR','NOR','XNOR','NOT B','A OR NOT B','NOT A','NOT A OR B','NAND','TRUE'];
SCENE({id:'sixteen-functions',name:'All sixteen two-input functions',tag:'Every possible truth table',
 definition:'A function of two Boolean inputs has four rows in its truth table, each output 0 or 1, so there are exactly 2⁴ = 16 different two-input functions.',
 example:'AND outputs 0001 down the rows 00, 01, 10, 11; OR outputs 0111; XOR 0110. Several of the sixteen ignore an input entirely, and two are constant.',
 desc:'A small truth table whose outputs can be set, beside a four-by-four grid of all sixteen functions with the matching one highlighted.',
 dur:12,hint:'Press the output cells to build any truth table and see which named function it is.',
 init:()=>({code:'0110'}),
 watch(p){return {code:bin(Math.min(15,Math.floor(p*16)),4)}},
 on:{out(s,i){i=Number(i);const c=s.code.split('');c[i]=c[i]==='1'?'0':'1';s.code=c.join('')},pick(s,i){s.code=bin(Number(i),4)}},
 draw(s,f,X){
  const idx=parseInt(s.code,2);let out=heading('Four rows, two choices each: 2⁴ = 16 functions');
  out+=TBF(50,70,'A',14,C.muted)+TBF(90,70,'B',14,C.muted)+TBF(146,70,'out',14,C.coral);
  [[0,0],[0,1],[1,0],[1,1]].forEach(([a,b],i)=>{const y=82+i*44,v=s.code[i];out+=TMF(50,y+26,a,17,C.ink)+TMF(90,y+26,b,17,C.ink)+hit(X,'out',i,`Output for A=${a}, B=${b} is ${v}. Press to flip.`,R(120,y,52,38,v==='1'?C.blue:'#fff',C.blue,7)+TMF(146,y+26,v,18,v==='1'?'#fff':C.blue,'middle','font-weight="700"'))});
  out+=TBF(110,290,R1_FN[idx],15,C.coral);
  for(let i=0;i<16;i++){const x=194+(i%4)*99,y=48+Math.floor(i/4)*72,on=i===idx;
   out+=hit(X,'pick',i,`Choose ${R1_FN[i]}`,R(x,y,95,64,on?C.amberp:'#fff',on?C.amber:C.grid,8)+TF(x+47.5,y+24,R1_FN[i],13,on?C.ink:C.muted,'middle',on?'font-weight="700"':'')+TMF(x+47.5,y+48,bin(i,4),16,on?C.coral:C.ink,'middle','font-weight="650"'))}
  return {svg:out,phase:`${s.code} is ${R1_FN[idx]}. Each tile lists its outputs for the rows 00, 01, 10, 11. Only a handful get their own gate symbols; NAND alone can build them all.`};
 }});

/* ---- Lesson: logic-gate ---- */
const R1_N=(a,b)=>(a&b)?0:1;
SCENE({id:'nand-universal',name:'NAND builds everything',tag:'One gate is enough',
 definition:'NAND is universal: NOT, AND, OR, and therefore every logic circuit, can be built from NAND gates alone.',
 example:'NOT A is NAND(A, A). A AND B is NOT(NAND(A, B)). A OR B is NAND(NOT A, NOT B). Chips are often made mostly of NAND gates for this reason.',
 desc:'A small circuit made only of NAND gates that behaves as the chosen gate; live wires are thick and blue and a lamp shows the output.',
 dur:12,hint:'Pick NOT, AND or OR, then flip the inputs. The NAND circuit always agrees with the gate it imitates.',
 init:()=>({target:'OR',a:1,b:0}),
 watch(p){const ts=['NOT','AND','OR'],q=p*3,i=Math.min(2,Math.floor(q)),r=Math.min(3,Math.floor((q-i)*4));return {target:ts[i],a:r>>1&1,b:r&1}},
 ui:[{choose:[['NOT','NOT'],['AND','AND'],['OR','OR']],label:'Build',get:s=>s.target,act:'target'}],
 on:{target(s,v){s.target=v},tog(s,k){s[k]^=1}},
 draw(s,f,X){
  const {a,b}=s;let out=heading(`${s.target} made only from NAND gates`),o;
  const W=(d,v)=>P(d,wireCol(v),wireW(v));
  if(s.target==='NOT'){o=R1_N(a,a);out+=toggle(X,'tog','a',30,140,a,'A')+W('M104 160H200V140H250',a)+W('M200 160V180H250',a)+Ci(200,160,5,wireCol(a))+gateShape('NAND',250,120)+W('M350 160H446',o)+lamp(476,160,o,'NOT A = '+o)}
  else if(s.target==='AND'){const n=R1_N(a,b);o=R1_N(n,n);out+=toggle(X,'tog','a',30,90,a,'A')+toggle(X,'tog','b',30,190,b,'B')+W('M104 110H150V140H190',a)+W('M104 210H150V180H190',b)+gateShape('NAND',190,120)+W('M290 160H330V140H370',n)+W('M330 160V180H370',n)+Ci(330,160,5,wireCol(n))+gateShape('NAND',370,120)+W('M470 160H500',o)+lamp(530,160,o,'out = '+o)+TF(310,250,`NAND = ${n}`,13,C.muted)}
  else{const na=R1_N(a,a),nb=R1_N(b,b);o=R1_N(na,nb);out+=toggle(X,'tog','a',30,60,a,'A')+toggle(X,'tog','b',30,240,b,'B')+W('M104 80H140V60H170',a)+W('M140 80V100H170',a)+Ci(140,80,5,wireCol(a))+W('M104 260H140V240H170',b)+W('M140 260V280H170',b)+Ci(140,260,5,wireCol(b))+gateShape('NAND',170,40)+gateShape('NAND',170,220)+W('M270 80H320V140H360',na)+W('M270 260H320V180H360',nb)+gateShape('NAND',360,120)+W('M460 160H496',o)+lamp(526,160,o,'out = '+o)+TF(290,66,`NOT A = ${na}`,13,C.muted,'start')+TF(280,286,`NOT B = ${nb}`,13,C.muted,'start')}
  const ref=s.target==='NOT'?1-a:s.target==='AND'?a&b:a|b,count={NOT:1,AND:2,OR:3}[s.target];
  out+=T(300,360,`${count} NAND gate${count>1?'s':''} · ${s.target==='NOT'?'NOT '+a:a+' '+s.target+' '+b} = ${ref} ${o===ref?'✓':''}`,15,C.green,'middle','font-weight="650"');
  return {svg:out,phase:s.target==='NOT'?'Feed the same signal into both inputs: NAND(A, A) = NOT A.':s.target==='AND'?'NAND is AND followed by NOT, so a second NAND used as NOT undoes the inversion.':'By De Morgan’s law, A OR B = NOT(NOT A AND NOT B) = NAND(NOT A, NOT B).'};
 }});

SCENE({id:'multiplexer',name:'Multiplexer',tag:'A switch made of gates',
 definition:'A multiplexer passes one of several inputs to its output, chosen by select lines. A 2-to-1 multiplexer computes (A AND NOT S) OR (B AND S).',
 example:'Inside a processor, multiplexers choose which register feeds the arithmetic unit, or whether the next instruction comes from the next address or a jump target.',
 desc:'A multiplexer symbol with inputs A and B and a select line S; the chosen path through it is drawn thick, and a lamp shows the output.',
 dur:10,hint:'Flip S to choose which input passes through, then flip A and B and watch only the chosen one matter.',
 init:()=>({a:1,b:0,s:1}),
 watch(p){const r=Math.min(7,Math.floor(p*8));return {s:r>>2&1,a:r>>1&1,b:r&1}},
 on:{tog(s,k){s[k]^=1}},
 draw(s,f,X){
  const o=s.s?s.b:s.a;let out=heading('out = (A AND NOT S) OR (B AND S)');
  out+=toggle(X,'tog','a',40,110,s.a,'A')+toggle(X,'tog','b',40,210,s.b,'B')+toggle(X,'tog','s',263,300,s.s,'S');
  out+=P('M114 130H250',wireCol(s.a),wireW(s.a))+P('M114 230H250',wireCol(s.b),wireW(s.b))+P('M300 300V262',wireCol(s.s),wireW(s.s));
  out+=`<polygon points="250,80 350,120 350,240 250,280" fill="#fff" stroke="${C.dark}" stroke-width="2.5"/>`;
  out+=TF(264,134,'0',13,C.muted,'start')+TF(264,234,'1',13,C.muted,'start');
  out+=P(s.s?'M250 230L300 205L350 180':'M250 130L300 155L350 180',C.amber,4)+P(s.s?'M250 130L300 155L350 180':'M250 230L300 205L350 180',C.grid,2,'none','stroke-dasharray="4 4"');
  out+=P('M350 180H470',wireCol(o),wireW(o))+lamp(500,180,o,'out = '+o);
  out+=TF(300,70,'MUX',14,C.muted,'middle','font-weight="700"');
  return {svg:out,phase:`S = ${s.s}, so the output copies ${s.s?'B':'A'} (${o}). The other input can change freely without affecting the output.`};
 }});

SCENE({id:'sr-latch',name:'Latch: memory from gates',tag:'Two gates that remember',
 definition:'A latch is two gates wired in a loop, each feeding the other, so the circuit holds a bit after its inputs return to 0. Set makes Q = 1; Reset makes Q = 0.',
 example:'Press Set and release: Q stays 1. Press Reset and release: Q stays 0. Every register and memory cell builds on this feedback idea.',
 desc:'Two cross-coupled NOR gates with Set and Reset inputs and output Q, above a timing diagram of S, R and Q over time.',
 dur:13,hint:'Add Set and Reset pulses, then step through time. Q only changes on a pulse and holds its value in between.',
 init:()=>({events:['S','R','S','S','R']}),
 ui:[{b:'Pulse Set',act:'add',arg:'S'},{b:'Pulse Reset',act:'add',arg:'R'},{b:'Clear',act:'clear'}],
 on:{add(s,e){s.events=s.events.concat(e).slice(-7);return 'end'},clear(s){s.events=[]}},
 trace(s){let q=0;const fr=[{t:-1,S:0,R:0,q,hist:[]}],hist=[];
  s.events.forEach(e=>{const S=e==='S'?1:0,R=e==='R'?1:0;if(S)q=1;if(R)q=0;hist.push([S,R,q]);fr.push({t:hist.length-1,S,R,q,hist:hist.slice(),pulse:e});hist.push([0,0,q]);fr.push({t:hist.length-1,S:0,R:0,q,hist:hist.slice()})});
  return fr},
 draw(s,f){
  const S=f.S,Rs=f.R,q=f.q,nq=S&&Rs?0:1-q;let out=heading('Set–reset latch: feedback holds one bit');
  out+=TBF(110,74,'R = '+Rs,14,Rs?C.coral:C.muted,'end')+P('M116 70H230',wireCol(Rs),wireW(Rs))+TBF(110,234,'S = '+S,14,S?C.coral:C.muted,'end')+P('M116 230H230',wireCol(S),wireW(S));
  out+=P('M330 90H360V140L205 165V190H230',wireCol(q),wireW(q))+P('M330 210H375V160L190 128V110H230',wireCol(nq),wireW(nq));
  out+=gateShape('NOR',230,50)+gateShape('NOR',230,170);
  out+=P('M360 90H450',wireCol(q),wireW(q))+lamp(478,90,q,'Q = '+q)+TF(420,214,`not Q = ${nq}`,13,C.muted,'start');
  const n=Math.max(1,f.hist.length),x0=120,sw=Math.min(60,450/Math.max(n,6)),rows=[['S',0,C.coral],['R',1,C.coral],['Q',2,C.blue]];
  rows.forEach(([nm,k,col],r)=>{const yb=290+r*30;out+=TBF(x0-12,yb-2,nm,14,col,'end');let d='';f.hist.forEach((h,i)=>{const y=yb-(h[k]?18:0);d+=(i?'L':'M')+(x0+i*sw)+' '+y+'L'+(x0+(i+1)*sw)+' '+y});if(d)out+=P(d,col,2.2);out+=L(x0,yb+2,x0+450,yb+2,C.grid,1)});
  if(f.t>=0)out+=R(x0+f.t*sw,262,sw,90,C.amber,'none',3,'opacity=".18"');
  return {svg:out,phase:f.t<0?'Start with Q = 0. Each output feeds back into the other gate, so the pair settles in a stable state.':f.pulse?`A ${f.pulse==='S'?'Set':'Reset'} pulse forces Q to ${q}.`:`Both inputs are back to 0, yet Q stays ${q}: the feedback loop remembers.`};
 }});

/* ---- Lesson: half-adder ---- */
SCENE({id:'full-adder',name:'Full adder',tag:'Add two bits and a carry',
 definition:'A full adder adds three bits, A, B and a carry in, giving a sum bit and a carry out. It is two half adders joined by an OR gate.',
 example:'1 + 1 + 1 = 3 = 11 in binary: sum 1, carry out 1. One full adder per column is all that binary addition needs.',
 desc:'Inputs A, B and carry in pass through two half adders; their carries meet at an OR gate. Lamps show the sum and carry out.',
 dur:10,hint:'Flip A, B and carry in. The lamps read carry-out then sum as a two-bit number equal to A + B + Cin.',
 init:()=>({a:1,b:1,c:1}),
 watch(p){const r=Math.min(7,Math.floor(p*8));return {a:r>>2&1,b:r>>1&1,c:r&1}},
 on:{tog(s,k){s[k]^=1}},
 draw(s,f,X){
  const s1=s.a^s.b,c1=s.a&s.b,sum=s1^s.c,c2=s1&s.c,co=c1|c2;let out=heading('Two half adders and an OR gate');
  out+=toggle(X,'tog','a',20,50,s.a,'A')+toggle(X,'tog','b',20,126,s.b,'B')+toggle(X,'tog','c',20,230,s.c,'Cin');
  const W=(d,v)=>P(d,wireCol(v),wireW(v));
  out+=W('M94 70H120V85H140',s.a)+W('M94 146H120V135H140',s.b);
  out+=R(140,60,110,100,'#fff',C.dark,8)+TBF(195,105,'half',14,C.ink)+TBF(195,123,'adder',14,C.ink);
  out+=W('M250 85H275V165H300',s1)+W('M94 250H280V215H300',s.c)+W('M250 135H265V312H430',c1);
  out+=R(300,140,110,100,'#fff',C.dark,8)+TBF(355,185,'half',14,C.ink)+TBF(355,203,'adder',14,C.ink);
  out+=TF(258,80,`${s1}`,13,C.muted,'start')+TF(256,126,`${c1}`,13,C.muted,'start');
  out+=W('M410 165H450V110H490',sum)+lamp(520,110,sum,'sum = '+sum);
  out+=W('M410 215H420V272H430',c2)+gateShape('OR',430,252)+W('M522 292H536',co)+lamp(552,292,co,'');
  out+=TBF(552,350,'carry = '+co,14,C.ink);
  out+=TBF(260,368,`${s.a} + ${s.b} + ${s.c} = ${s.a+s.b+s.c} = ${co}${sum} in binary`,16,C.blue);
  return {svg:out,phase:`The first half adder adds A and B; the second adds the carry in. At most one of them can produce a carry, so an OR gate combines them: carry out = ${co}.`};
 }});

SCENE({id:'ripple-carry',name:'Ripple-carry adder',tag:'Chain full adders together',
 definition:'A ripple-carry adder chains one full adder per bit; each passes its carry to the next, so the carry ripples from the lowest bit to the highest.',
 example:'Adding 1011 (11) and 0110 (6): each column waits for the carry from the column on its right. The result 10001 (17) needs a fifth bit: overflow for 4 bits.',
 desc:'Four full-adder boxes side by side, lowest bit on the right, with the bits of each number above, sum bits below and carries passing leftwards.',
 dur:12,hint:'Choose two 4-bit numbers and step: each adder can only finish once the carry from its right has arrived.',
 init:()=>({a:11,b:6}),
 ui:[{range:'a',label:'A',min:0,max:15,get:s=>s.a,act:'a'},{range:'b',label:'B',min:0,max:15,get:s=>s.b,act:'b'}],
 on:{a(s,v){s.a=v},b(s,v){s.b=v}},
 trace(s){let c=0;const sums=[],cs=[0];const fr=[{k:0,sums:[],cs:[0]}];for(let i=0;i<4;i++){const a=s.a>>i&1,b=s.b>>i&1,d=a+b+c;sums.push(d&1);c=d>>1;cs.push(c);fr.push({k:i+1,sums:sums.slice(),cs:cs.slice(),i,a,b,d})}fr.push({k:4,sums,cs,done:true});return fr},
 draw(s,f){
  let out=heading('Four full adders: the carry ripples leftwards');const X0=[442,322,202,82];
  out+=TMF(300,62,`A = ${bin(s.a,4)} (${s.a})   B = ${bin(s.b,4)} (${s.b})`,15,C.ink,'middle','xml:space="preserve"');
  for(let i=0;i<4;i++){const x=X0[i],done=i<f.k,cur=!f.done&&i===f.k-1;
   out+=TMF(x+28,108,s.a>>i&1,18,C.ink)+TMF(x+72,108,s.b>>i&1,18,C.ink)+arrow(x+28,114,x+28,146,C.line,2,7)+arrow(x+72,114,x+72,146,C.line,2,7);
   out+=R(x,150,100,74,cur?C.amberp:done?'#fff':'#f3f6f8',cur?C.amber:done?C.blue:C.grid,9)+TBF(x+50,184,'full',13,C.ink)+TBF(x+50,202,'adder',13,C.ink)+TF(x+50,140,'bit '+i,13,C.muted);
   if(done){out+=arrow(x+50,226,x+50,252,C.blue,2,7)+TMF(x+50,280,f.sums[i],22,C.blue,'middle','font-weight="700"')}
   const cin=f.cs[i];if(cin!==undefined)out+=arrow(x+128,187,x+102,187,cin?C.coral:C.line,cin?3:2,7)+TF(x+115,180,cin,13,cin?C.coral:C.muted)}
  const cout=f.cs[4];if(cout!==undefined)out+=arrow(80,187,40,187,cout?C.coral:C.line,cout?3:2,7)+TF(60,178,cout,13,cout?C.coral:C.muted)+TF(40,214,'carry out',13,C.muted,'middle');
  if(f.done){const tot=s.a+s.b;out+=R(110,302,380,52,cout?C.coralp:C.greenp,'none',10)+TB(300,334,cout?`${s.a} + ${s.b} = ${tot} needs 5 bits: overflow`:`${s.a} + ${s.b} = ${bin(tot,4)} = ${tot}`,17,cout?C.coral:C.green)}
  return {svg:out,phase:f.done?'Each stage had to wait for the one on its right, so the delay grows with the number of bits. Real 64-bit processors use carry-lookahead logic to compute carries in parallel.':f.k===0?'The lowest bit starts with a carry in of 0.':`Bit ${f.i}: ${f.a} + ${f.b} + carry ${f.cs[f.i]} = ${f.d}, so sum ${f.d&1} and carry ${f.d>>1} to bit ${f.i+1}.`};
 }});
