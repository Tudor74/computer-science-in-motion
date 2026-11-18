/* Brain era 6 · Brain states: lessons, sources and connections. */
// PLACEHOLDER written when the course was scaffolded, so that the build and tests run. The era author replaces this file wholesale (see docs/BRAIN-BRIEF.md).
// The lesson ids, their order and the stage id are fixed. Add SOURCE('b6-…',{title,url?}) and THREAD({id:'b6-…',name,ids}) entries here.
LESSON({id:'circadian-clock',name:'The circadian clock',short:'Body clock',stage:'state',year:'1971–2017',level:'Introduction',
 why:'A small nucleus keeps roughly 24-hour time using a loop of genes and proteins, and light resets it each day.',
 prior:[],references:[],
 ids:['circadian-clock']});
LESSON({id:'sleep-stages',name:'Sleep stages',short:'Sleep stages',stage:'state',year:'1953–1982',level:'Core',
 why:'Sleep is not one state: the EEG shows a cycle of stages through the night, including the rapid-eye-movement sleep found in 1953.',
 prior:['brain-imaging','circadian-clock'],references:[],
 ids:['sleep-stages']});
LESSON({id:'arousal-systems',name:'Arousal systems',short:'Arousal',stage:'state',year:'1949–2000',level:'Core',
 why:'Small groups of neurons in the brainstem and hypothalamus keep the cortex awake, and losing one of them causes narcolepsy.',
 prior:['neuromodulation','sleep-stages'],references:[],
 ids:['arousal-systems']});
LESSON({id:'reward-dopamine',name:'Reward and dopamine',short:'Reward',stage:'state',year:'1954–1997',level:'Core',
 why:'Dopamine neurons signal the difference between the reward expected and the reward received, a teaching signal and not simply pleasure.',
 prior:['neuromodulation','basal-ganglia'],references:[],
 ids:['reward-dopamine']});
LESSON({id:'stress-response',name:'The stress response',short:'Stress',stage:'state',year:'1936–today',level:'Core',
 why:'The brain drives a hormone chain that readies the body for a challenge, useful for minutes and harmful when it stays switched on.',
 prior:[],references:[],
 ids:['stress-response']});
LESSON({id:'hunger-homeostasis',name:'Hunger and homeostasis',short:'Hunger',stage:'state',year:'1940–1994',level:'Core',
 why:'The hypothalamus reads hormones such as leptin to balance eating against the body’s stores, which makes appetite physiology and not just willpower.',
 prior:['stress-response'],references:[],
 ids:['hunger-homeostasis']});
