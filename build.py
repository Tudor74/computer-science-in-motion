#!/usr/bin/env python3
"""Concatenate src/ into one offline index.html. STUB=1 fills missing scenes (development only)."""
import os, re, glob
root=os.path.dirname(os.path.abspath(__file__))
src=lambda p: open(os.path.join(root,'src',p),encoding='utf-8').read()
parts=[src('core.js')]+[open(p,encoding='utf-8').read() for p in sorted(glob.glob(os.path.join(root,'src','scenes-*.js')))]
parts.append(src('curriculum.js'))
if os.environ.get('STUB'):
    parts.append("for(const l of CURRICULUM.lessons)for(const id of l.ids)if(!SCENES[id])SCENE({id,name:id+' (stub)',definition:'Stub.',example:'',init:()=>({}),draw:()=>({svg:T(300,190,'stub '+id,20),phase:'stub'})});")
parts.append(src('app.js'))
script='\n'.join(parts)
assert '</script' not in script.lower(), 'script must not contain a closing script tag'
html=src('shell.html').replace('/*__SCRIPT__*/',script)
out=os.environ.get('OUT') or os.path.join(root,'index.html')
open(out,'w',encoding='utf-8').write(html)
print('index.html', len(html.encode()), 'bytes')
