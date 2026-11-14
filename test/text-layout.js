// Text layout check: compares diagram labels at a phone width (enlarged text) with desktop (scale 1).
// Reports labels that leave the 600×380 drawing or overlap another label, only where the phone
// layout is worse than desktop. Usage: node test/text-layout.js [width]
const {chromium}=require('playwright');const path=require('path');
const file='file://'+path.resolve(process.env.FILE||path.resolve(__dirname,'../index.html'));
const width=Number(process.argv[2]||375);
const probe=()=>{const svg=document.getElementById('drawing');const boxes=[...svg.querySelectorAll('text')].filter(t=>t.textContent.trim()).map(t=>{const b=t.getBBox();return {s:t.textContent.trim().slice(0,24),x:b.x,y:b.y,w:b.width,h:b.height}});
 const out=boxes.filter(b=>b.x<-1||b.y<-1||b.x+b.w>601||b.y+b.h>381).map(b=>'outside: '+b.s);
 const ov=[];for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],c=boxes[j];const ix=Math.min(a.x+a.w,c.x+c.w)-Math.max(a.x,c.x),iy=Math.min(a.y+a.h,c.y+c.h)-Math.max(a.y,c.y);
  if(ix>2&&iy>2){const area=ix*iy,small=Math.min(a.w*a.h,c.w*c.h);if(small>0&&area/small>.18)ov.push(`overlap: “${a.s}” × “${c.s}”`)}}
 return out.concat(ov)};
async function survey(page){
 const ids=await page.evaluate(()=>csApp.route);const res={};
 for(const id of ids){const set=new Set();
  for(const dt of [1,3.5,6]){await page.evaluate(([id,dt])=>{csApp.setMode('watch');csApp.go(id);csApp.seek(csApp.offsets[csApp.route.indexOf(id)]+dt)},[id,dt]);await page.waitForTimeout(40);(await page.evaluate(probe)).forEach(x=>set.add('watch '+x))}
  await page.evaluate(()=>csApp.setMode('try'));await page.waitForTimeout(30);(await page.evaluate(probe)).forEach(x=>set.add('try '+x));
  for(let k=0;k<6;k++)await page.evaluate(()=>csApp.step(1));await page.waitForTimeout(400);(await page.evaluate(probe)).forEach(x=>set.add('try '+x));
  res[id]=set}
 return res}
(async()=>{const b=await chromium.launch();
 const desk=await b.newPage({viewport:{width:1100,height:900}});await desk.goto(file);await desk.waitForTimeout(300);
 const phone=await b.newPage({viewport:{width,height:800},isMobile:true,hasTouch:true});await phone.goto(file);await phone.waitForTimeout(300);
 console.log('text scale at',width,'px:',await phone.evaluate(()=>csApp.state().textScale),'· desktop:',await desk.evaluate(()=>csApp.state().textScale));
 const A=await survey(desk),B=await survey(phone);let n=0;
 for(const id in B){const extra=[...B[id]].filter(x=>!A[id].has(x));if(extra.length){n+=extra.length;console.log(id+':\n  '+extra.join('\n  '))}}
 console.log(n?`${n} new layout problems at ${width}px`:`No new text layout problems at ${width}px`);await b.close()})();
