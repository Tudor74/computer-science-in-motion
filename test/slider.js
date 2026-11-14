// Time slider behaviour (same contract as Mathematics In Motion):
// drag right latches forward speed; hold left rewinds and releasing pauses; keys adjust speed.
const {chromium}=require('playwright');const path=require('path');
const file='file://'+path.resolve(process.env.FILE||path.resolve(__dirname,'../index.html'));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:900}});const errs=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto(file+'#loop');await p.waitForTimeout(300);
 const st=()=>p.evaluate(()=>csApp.state()),fails=[];const ok=(c,m)=>{if(!c)fails.push(m)};
 const box=await (await p.$('#speed')).boundingBox(),y=box.y+box.height/2;
 const s0=await st();ok(s0.speed===0,'starts paused');
 ok(await p.$eval('#speed-readout',e=>e.value)==='0 · Paused','readout 0 · Paused');
 const zeroX=box.x+23+(box.width-46)*s0.zero/1000;
 // Drag to roughly 2× forward and release: speed stays latched.
 await p.mouse.move(zeroX,y);await p.mouse.down();await p.mouse.move(zeroX+(box.width-46)*(1-s0.zero/1000)*2/12,y,{steps:5});await p.mouse.up();
 let s1=await st();ok(s1.speed>1.5&&s1.speed<2.6,'forward latched near 2×, got '+s1.speed);
 await p.waitForTimeout(600);let s2=await st();ok(s2.t>s1.t,'time advances forward');
 // Hold left to rewind: speed negative while held, time goes back; release pauses.
 await p.mouse.move(zeroX,y);await p.mouse.down();await p.mouse.move(box.x+30,y,{steps:5});
 const r1=await st();ok(r1.speed<-6,'rewinding near −8× while held, got '+r1.speed);
 ok(await p.$eval('#shuttle',e=>e.classList.contains('holding')),'holding class while held');
 await p.waitForTimeout(400);const r2=await st();ok(r2.t<r1.t,'time goes backwards while held');
 await p.mouse.up();await p.waitForTimeout(50);const r3=await st();ok(r3.speed===0,'release pauses, got '+r3.speed);
 ok(!(await p.$eval('#shuttle',e=>e.classList.contains('holding'))),'holding class cleared');
 // Keyboard: End = 12×, Home holds −8× and keyup pauses, arrows step by 0.1.
 await p.focus('#speed');await p.keyboard.press('End');ok((await st()).speed===12,'End = 12×');
 await p.keyboard.down('Home');ok((await st()).speed===-8,'Home = −8× while held');await p.keyboard.up('Home');ok((await st()).speed===0,'Home release pauses');
 await p.keyboard.press('ArrowRight');ok(Math.abs((await st()).speed-0.1)<1e-9,'ArrowRight +0.1');
 // Play uses the last forward speed; Pause stops; Play from Try it returns to Watch.
 await p.click('#play');ok((await st()).speed===0,'Play button pauses when playing');
 await p.click('#play');ok((await st()).speed>0,'Play resumes last forward speed');
 await p.click('#mode-try');ok((await st()).mode==='try'&&(await st()).speed===0,'Try it pauses');
 await p.click('#play');ok((await st()).mode==='watch'&&(await st()).speed>0,'Play returns to Watch and plays');
 // Rewind crosses back into the previous scene.
 const before=(await st()).index;await p.evaluate(()=>csApp.seek(csApp.offsets[csApp.route.indexOf('loop')]+0.2));
 await p.mouse.move(zeroX,y);await p.mouse.down();await p.mouse.move(box.x+30,y,{steps:3});await p.waitForTimeout(500);const back=(await st()).id;await p.mouse.up();
 ok(back==='conditional','rewind crosses into the previous topic, at '+back);
 console.log(fails.length||errs.length?'FAIL:\n'+fails.concat(errs).join('\n'):'Slider: all behaviour checks pass.');await b.close();process.exit(fails.length+errs.length?1:0)})();
