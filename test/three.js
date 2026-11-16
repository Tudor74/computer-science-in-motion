// 2D/3D toggle behaviour (as in Mathematics In Motion), checked on every scene that has a 3D view.
const {chromium}=require('playwright');const path=require('path'),fs=require('fs');
const file='file://'+path.resolve(process.env.FILE||path.resolve(__dirname,'../index.html'));
const shots=process.env.SHOTS||path.resolve(__dirname,'shots');fs.mkdirSync(shots,{recursive:true});
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:900}});const errs=[],fails=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.text())});
 await p.goto(file);await p.waitForTimeout(300);
 const ok=(c,m)=>{if(!c)fails.push(m)};const st=()=>p.evaluate(()=>csApp.state());
 const ids=await p.evaluate(()=>csApp.route.filter(id=>csApp.scenes[id].three));
 const plain=await p.evaluate(()=>csApp.route.find(id=>!csApp.scenes[id].three));
 await p.evaluate(id=>csApp.go(id),plain);ok(await p.$eval('#view-controls',e=>e.hidden),'toggle hidden on a 2D-only scene');
 for(const id of ids){
  await p.evaluate(id=>{csApp.setMode('watch');csApp.go(id)},id);
  ok(!(await p.$eval('#view-controls',e=>e.hidden)),id+': toggle visible');
  const off=await p.evaluate(id=>csApp.offsets[csApp.route.indexOf(id)],id),dur=await p.evaluate(id=>csApp.scenes[id].dur||8,id);
  await p.evaluate(x=>csApp.seek(x),off+dur*.25);await p.waitForTimeout(40);ok((await st()).viewReveal===0,id+': Auto shows 2D in the first half');
  await p.evaluate(x=>csApp.seek(x),off+dur*.5+1.2);await p.waitForTimeout(60);ok((await st()).viewReveal===1,id+': Auto shows 3D in the second half');
  const txt=await p.$eval('#three-drawing',e=>e.textContent);if(/NaN|undefined|could not be drawn/.test(txt))fails.push(id+': bad 3D text '+txt.slice(0,80));
  await p.screenshot({path:path.join(shots,'three-'+id+'.png'),clip:await p.evaluate(()=>{const r=document.querySelector('.diagram-deck').getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height}})});
  // Drag turns the camera and pauses.
  await p.click('#play');await p.$eval('#three-drawing',e=>e.scrollIntoView({block:'center'}));const box=await (await p.$('#three-drawing')).boundingBox();const y0=(await st()).camera.yaw;
  await p.mouse.move(box.x+200,box.y+150);await p.mouse.down();await p.mouse.move(box.x+300,box.y+160,{steps:4});await p.mouse.up();
  const s1=await st();ok(s1.speed===0,id+': turning pauses');ok(Math.abs(s1.camera.yaw-y0)>.3,id+': drag turns');
  await p.click('#three-reset');ok(Math.abs((await st()).camera.yaw-.62)<1e-9,id+': reset view');
  await p.click('#view-2d');await p.waitForTimeout(30);ok((await st()).viewReveal===0&&(await st()).viewMode==='2d',id+': 2D pins 2D');
  await p.click('#view-3d');await p.waitForTimeout(30);ok((await st()).viewReveal===1,id+': 3D pins 3D');
  await p.evaluate(()=>csApp.setMode('try'));await p.waitForTimeout(30);ok((await st()).viewReveal===1,id+': 3D stays in Try it when chosen');
  for(let k=0;k<5;k++)await p.evaluate(()=>csApp.step(1));
  await p.click('#view-auto');await p.waitForTimeout(30);ok((await st()).viewReveal===0,id+': Auto keeps 2D in Try it');
 }
 console.log('3D scenes:',ids.length,ids.join(', '));
 console.log(fails.length||errs.length?'FAIL:\n'+[...new Set(fails.concat(errs))].join('\n'):'3D toggle: all checks pass.');await b.close();process.exit(fails.length+errs.length?1:0)})();
