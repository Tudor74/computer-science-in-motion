// Timed experiments: replies arrive after the chosen delay via ctx.later/every, and leaving cancels them.
const {chromium}=require('playwright');const path=require('path');
const file='file://'+path.resolve(process.env.FILE||path.resolve(__dirname,'../index.html'));
(async()=>{const b=await chromium.launch();const p=await b.newPage();const errs=[],fails=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'||m.type()==='warning')errs.push(m.text())});
 await p.goto(file);await p.waitForTimeout(300);const ok=(c,m)=>{if(!c)fails.push(m)};
 const st=id=>p.evaluate(id=>{const sc=csApp.scenes[id];return JSON.parse(JSON.stringify(csApp.tryState?csApp.tryState(id):null))},id);
 const text=()=>p.$eval('#drawing',e=>e.textContent);
 // 1) time-sharing-response: set 300 ms, press, the reply arrives and is logged.
 await p.evaluate(()=>{csApp.go('time-sharing-response');csApp.setMode('try');csApp.act('delay',null,300);csApp.act('press')});
 const before=await text();await p.waitForTimeout(700);const after=await text();ok(before!==after,'time-sharing-response: reply arrived and redrew');
 // 2) response-time: press with 300 ms delay; 'got' appears.
 await p.evaluate(()=>{csApp.go('response-time');csApp.setMode('try');csApp.act('delay',null,300);csApp.act('press')});
 const b2=await text();await p.waitForTimeout(700);ok(b2!==await text(),'response-time: reply arrived and redrew');
 // 3) progress bars run A then B, then stop on their own; leaving mid-run raises no errors.
 await p.evaluate(()=>{csApp.go('response-time-progress');csApp.setMode('try');csApp.act('play')});
 await p.waitForTimeout(500);const mid=await text();await p.waitForTimeout(500);ok(mid!==await text(),'progress: bars animate');
 await p.evaluate(()=>csApp.go('response-time'));await p.waitForTimeout(400);
 await p.evaluate(()=>{csApp.go('response-time-progress');csApp.setMode('try');csApp.act('play')});await p.waitForTimeout(8000);
 const done=await text();await p.waitForTimeout(400);ok(done===await text(),'progress: ticker stops after B finishes');
 console.log(fails.length||errs.length?'FAIL:\n'+fails.concat(errs).join('\n'):'Timed experiments: all checks pass.');await b.close();process.exit(fails.length+errs.length?1:0)})();
