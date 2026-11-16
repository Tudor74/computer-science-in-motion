// In Motion family links: the header brand link is clickable above the lesson picker and points to the
// landing page; the footer lists every course with this one marked; nothing overflows on phones.
const {chromium}=require('playwright');const path=require('path');
const file='file://'+path.resolve(process.env.FILE||path.resolve(__dirname,'../index.html'));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:900}});const errs=[],fails=[];
 p.on('pageerror',e=>errs.push(e.message));await p.goto(file);await p.waitForTimeout(300);const ok=(c,m)=>{if(!c)fails.push(m)};
 const hit=await p.evaluate(()=>{const a=document.querySelector('.brand a');const r=a.getBoundingClientRect();const el=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {href:a.href,top:el===a||a.contains(el)}});
 ok(hit.href==='https://in-motion.puter.site/','brand links to the landing page');ok(hit.top,'brand link is on top of the lesson picker');
 const fam=await p.$$eval('#family a',as=>as.map(a=>({h:a.href,cur:a.getAttribute('aria-current')})));
 ok(fam.length>=6,'footer has the hub plus at least five courses, got '+fam.length);ok(fam.filter(a=>a.cur==='page').length===1,'exactly one course marked current');
 for(const w of [320,375]){await p.setViewportSize({width:w,height:800});const ov=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);ok(ov<=0,'overflow at '+w)}
 console.log(fails.length||errs.length?'FAIL:\n'+fails.concat(errs).join('\n'):'Family links: all checks pass.');await b.close();process.exit(fails.length+errs.length?1:0)})();
