// Loads index.html, collects console errors, steps through every scene in Watch and Try it,
// exercises every try-it control, checks horizontal overflow, and takes sample screenshots.
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const file='file://'+path.resolve(process.env.FILE||path.resolve(__dirname,'../index.html'));
const shots=process.env.SHOTS||path.resolve(__dirname,'shots');fs.mkdirSync(shots,{recursive:true});
const only=(process.env.ONLY||'').split(',').filter(Boolean);
(async()=>{
 const b=await chromium.launch();const errors=[];
 const page=await b.newPage({viewport:{width:1100,height:900}});
 page.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errors.push(m.type()+': '+m.text())});
 page.on('pageerror',e=>errors.push('pageerror: '+e.message));
 await page.goto(file);await page.waitForTimeout(300);
 const route=await page.evaluate(()=>csApp.route);
 const drawErr=await page.evaluate(()=>csApp.drawAll());if(drawErr.length)errors.push(...drawErr.map(e=>'drawAll: '+e));
 const ids=only.length?only:route;
 for(const id of ids){if(process.env.VERBOSE)console.log('scene',id,Date.now()%100000);
  await page.evaluate(id=>{csApp.setMode('watch');csApp.go(id)},id);
  const off=await page.evaluate(id=>csApp.offsets[csApp.route.indexOf(id)],id);
  for(const dt of [0.2,3,7]){await page.evaluate(x=>csApp.seek(x),off+dt);await page.waitForTimeout(30)}
  const txt=await page.evaluate(()=>document.getElementById('drawing').textContent);
  if(/NaN|undefined|could not be drawn/.test(txt))errors.push(id+' watch text: '+txt.slice(0,160));
  await page.evaluate(()=>csApp.setMode('try'));await page.waitForTimeout(30);
  const btns=await page.$$('#try-controls button:not(:disabled)');
  for(const bt of btns){try{await bt.click({timeout:500})}catch(_){}}
  for(const r of await page.$$('#try-controls input[type=range]')){await r.evaluate(el=>{el.value=String((Number(el.min)+Number(el.max))/2|0);el.dispatchEvent(new Event('input',{bubbles:true}))})}
  for(const tx of await page.$$('#try-controls input[type=text]')){await tx.fill(process.env.TEXTIN||'abc 12')}
  const hits=await page.$$('#drawing [data-act]');for(const h of hits.slice(0,6)){try{await h.click({timeout:500})}catch(_){}}
  for(let i=0;i<40;i++)await page.evaluate(()=>csApp.step(1));
  const t2=await page.evaluate(()=>document.getElementById('drawing').textContent+' '+document.getElementById('phase').textContent);
  if(/NaN|undefined|could not be drawn/.test(t2))errors.push(id+' try text: '+t2.slice(0,200));
  if(process.env.ALLSHOTS){const clip=await page.evaluate(()=>{const r=document.querySelector('.diagram-deck').getBoundingClientRect();return {x:r.x,y:r.y+window.scrollY,width:r.width,height:r.height}});await page.screenshot({path:path.join(shots,'try-'+id+'.png'),clip,fullPage:true})}
 }
 console.log('scenes done');
 const sample=(process.env.SAMPLE||'division-of-labour,supply-demand,marginal-utility,prisoners-dilemma,multiplier,ultimatum-game,inequality-lorenz,inflation-money').split(',').filter(i=>route.includes(i));
 for(const id of sample){await page.evaluate(id=>{csApp.setMode('watch');csApp.go(id);csApp.seek(csApp.offsets[csApp.route.indexOf(id)]+4)},id);await page.waitForTimeout(80);await page.screenshot({path:path.join(shots,'desk-'+id+'.png'),fullPage:true})}
 const phone=await b.newPage({viewport:{width:375,height:800},isMobile:true,hasTouch:true});
 phone.on('pageerror',e=>errors.push('phone pageerror: '+e.message));
 for(const id of sample.slice(0,4)){await phone.goto(file+'#'+id);await phone.waitForTimeout(200);await phone.evaluate(()=>csApp.setMode('try'));await phone.waitForTimeout(60);
  const ov=await phone.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);if(ov>0)errors.push(`phone overflow ${ov}px on ${id}`);
  await phone.screenshot({path:path.join(shots,'phone-'+id+'.png'),fullPage:true})}
 console.log('shots done');
 for(const w of [320,375,760,1024]){await phone.setViewportSize({width:w,height:800});for(const m of ['watch','try'])for(const id of route){await phone.evaluate(([id,m])=>{csApp.go(id);csApp.setMode(m)},[id,m]);const ov=await phone.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);if(ov>0){errors.push(`overflow ${ov}px at ${w} (${m}) on ${id}`);break}}}
 console.log('scenes:',route.length,'checked:',ids.length,'glossary:',await page.evaluate(()=>csApp.glossary.length));
 console.log(errors.length?'ERRORS:\n'+[...new Set(errors)].join('\n'):'No console errors, no overflow.');
 await b.close();process.exit(errors.length?1:0);
})();
