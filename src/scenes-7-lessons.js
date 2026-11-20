/* Levin Lab era 7 · Basal cognition: lessons, sources and connections. */
SOURCE('l7-jennings',{title:'Herbert Spencer Jennings (1906). Behavior of the Lower Organisms. Columbia University Press.'});
SOURCE('l7-dexter2019',{title:'Dexter, Prabakaran & Gunawardena (2019). A complex hierarchy of avoidance behaviors in a single-cell eukaryote. Current Biology 29.'});
SOURCE('l7-macnab1972',{title:'Macnab & Koshland (1972). The gradient-sensing mechanism in bacterial chemotaxis. PNAS 69, 2509–2512.',url:'https://doi.org/10.1073/pnas.69.9.2509'});
SOURCE('l7-nakagaki2000',{title:'Nakagaki, Yamada & Tóth (2000). Maze-solving by an amoeboid organism. Nature 407, 470.',url:'https://doi.org/10.1038/35035159'});
SOURCE('l7-tero2010',{title:'Tero, Takagi, Saigusa et al. (2010). Rules for biologically inspired adaptive network design. Science 327, 439–442.'});
SOURCE('l7-lyon2006',{title:'Pamela Lyon (2006). The biogenic approach to cognition. Cognitive Processing 7, 11–29.',url:'https://doi.org/10.1007/s10339-005-0016-8'});
SOURCE('l7-lyon2021',{title:'Lyon, Keijzer, Arendt & Levin (2021). Reframing cognition: getting down to biological basics. Philosophical Transactions of the Royal Society B 376, 20190750.',url:'https://doi.org/10.1098/rstb.2019.0750',note:'Introduces the theme issue “Basal cognition: conceptual tools and the view from the single cell”; its second part is “Basal cognition: multicellularity, neurons and the cognitive lens”.'});
SOURCE('l7-levin2021b',{title:'Levin, Keijzer, Lyon & Arendt (2021). Uncovering cognitive similarities and differences, conservation and innovation. Philosophical Transactions of the Royal Society B 376, 20200458.',url:'https://doi.org/10.1098/rstb.2020.0458'});
SOURCE('l7-baluska2016',{title:'Baluška & Levin (2016). On having no head: cognition throughout biological systems. Frontiers in Psychology 7, 902.',url:'https://doi.org/10.3389/fpsyg.2016.00902'});
SOURCE('l7-tame',{title:'Levin (2022). Technological Approach to Mind Everywhere: an experimentally-grounded framework for understanding diverse bodies and minds. Frontiers in Systems Neuroscience 16, 768201.',url:'https://doi.org/10.3389/fnsys.2022.768201'});
SOURCE('l7-dennett',{title:'Daniel Dennett (1987). The Intentional Stance. MIT Press.'});
SOURCE('l7-levin2019',{title:'Levin (2019). The computational boundary of a “self”: developmental bioelectricity drives multicellularity and scale-free cognition. Frontiers in Psychology 10, 2688.',url:'https://doi.org/10.3389/fpsyg.2019.02688'});
SOURCE('l7-fields2022',{title:'Fields & Levin (2022). Competency in navigating arbitrary spaces as an invariant for analyzing cognition in diverse embodiments. Entropy 24, 819.',url:'https://doi.org/10.3390/e24060819'});
SOURCE('l7-james',{title:'William James (1890). The Principles of Psychology, volume 1, chapter 1. Henry Holt.',note:'The fixed end reached by varying means; paraphrased in this course.'});
SOURCE('l7-biswas2021',{title:'Biswas, Manicka, Hoel & Levin (2021). Gene regulatory networks exhibit several kinds of memory: quantification of memory in biological and random transcriptional networks. iScience 24, 102131.',url:'https://doi.org/10.1016/j.isci.2021.102131'});
SOURCE('l7-biswas2023',{title:'Biswas, Clawson & Levin (2023). Learning in transcriptional network models: computational discovery of pathway-level memory and effective interventions. International Journal of Molecular Sciences 24, 285.',url:'https://doi.org/10.3390/ijms24010285'});
SOURCE('l7-gershman2021',{title:'Gershman, Balbi, Gallistel & Gunawardena (2021). Reconsidering the evidence for learning in single cells. eLife 10, e61907.',url:'https://doi.org/10.7554/eLife.61907'});
SOURCE('l7-adams2018',{title:'Fred Adams (2018). Cognition wars. Studies in History and Philosophy of Science 68.'});
SOURCE('l7-segundo2019',{title:'Segundo-Ortin & Calvo (2019). Are plants cognitive? A reply to Adams. Studies in History and Philosophy of Science 73.'});
SOURCE('l7-alpi2007',{title:'Alpi et al. (2007). Plant neurobiology: no brain, no gain? Trends in Plant Science 12, 135–136.'});
SOURCE('l7-brenner2007',{title:'Brenner, Stahlberg, Mancuso, Baluška & Van Volkenburgh (2007). Plant neurobiology: the gain is more than the name. Trends in Plant Science 12, 285–286.',url:'https://doi.org/10.1016/j.tplants.2007.06.005'});
SOURCE('l7-trewavas2007',{title:'Trewavas (2007). Plant neurobiology – all metaphors have value. Trends in Plant Science 12, 231–233.'});
SOURCE('l7-mind-conditioning',{title:'Mind In Motion — classical conditioning.',url:'https://mind-in-motion.puter.site/#classical-conditioning',note:'Sister course: Pavlov’s protocol and its controls in animals.'});
SOURCE('l7-mind-embodied',{title:'Mind In Motion — embodied cognition.',url:'https://mind-in-motion.puter.site/#embodied-cognition',note:'Sister course: the view that cognition depends on the body.'});
SOURCE('l7-con-animal',{title:'Consciousness In Motion — animal consciousness.',url:'https://consciousness-in-motion.puter.site/#animal-consciousness',note:'Sister course: a separate question from basal cognition.'});
SOURCE('l7-con-sentience',{title:'Consciousness In Motion — markers of sentience.',url:'https://consciousness-in-motion.puter.site/#sentience-markers'});
SOURCE('l7-con-panpsychism',{title:'Consciousness In Motion — illusionism, panpsychism and the combination problem.',url:'https://consciousness-in-motion.puter.site/#illusionism-panpsychism-combination'});

LESSON({id:'basal-cognition',name:'Basal cognition',short:'Basal',stage:'cognition',year:'1906–today',level:'Introduction',
 why:'Sensing, memory and decision-making in organisms without brains have been studied for over a century, and give the lab’s ideas their wider setting.',
 prior:['membrane-voltage'],references:['l7-macnab1972','l7-jennings','l7-dexter2019','l7-nakagaki2000','l7-tero2010','l7-lyon2006','l7-lyon2021','l7-baluska2016'],
 ids:['basal-cognition','basal-cognition-stentor','basal-cognition-physarum','basal-cognition-field']});
LESSON({id:'tame-framework',name:'The TAME framework',short:'TAME',stage:'cognition',year:'2022',level:'Introduction',
 why:'A proposal to treat mind as a continuum and judge it by which interventions work is the lab’s main framework, and is offered as a framework, not a result.',
 prior:['basal-cognition'],references:['l7-tame','l7-dennett','l7-levin2021b','l7-levin2019'],
 ids:['tame-framework','tame-framework-setpoint','tame-framework-claims']});
LESSON({id:'cognitive-light-cone',name:'The cognitive light cone',short:'Light cone',stage:'cognition',year:'2019',level:'Core',
 why:'Drawing the largest goal a system can pursue as a region in space and time is a picture for comparing very different systems.',
 prior:['tame-framework'],references:['l7-levin2019','l7-tame'],
 ids:['cognitive-light-cone','cognitive-light-cone-join','cognitive-light-cone-space']});
LESSON({id:'morphospace-navigation',name:'Navigating morphospace',short:'Morphospace',stage:'cognition',year:'2022',level:'Core',
 why:'Treating development as travel through a space of possible shapes turns regeneration into a kind of problem-solving, as a proposal.',
 prior:['cognitive-light-cone','picasso-tadpoles'],references:['l7-fields2022','l7-james','l7-tame'],
 ids:['morphospace-navigation','morphospace-navigation-perturb','morphospace-navigation-spaces']});
LESSON({id:'gene-network-learning',name:'Learning in gene networks',short:'Gene networks',stage:'cognition',year:'2021–2023',level:'Core',
 why:'Computer models of gene networks were reported to show memory-like responses, which raises the question of what training a cell could mean.',
 prior:['basal-cognition'],references:['l7-biswas2021','l7-biswas2023','l7-gershman2021','l7-mind-conditioning'],
 ids:['gene-network-learning','gene-network-learning-controls','gene-network-learning-cells']});
LESSON({id:'cognition-debate',name:'Is it really cognition?',short:'Debate',stage:'cognition',year:'2007–today',level:'Core',
 why:'Critics say that words such as goal, memory and mind stretched to cells risk explaining nothing, and the argument over definitions is part of the science.',
 prior:['tame-framework','gene-network-learning'],references:['l7-adams2018','l7-segundo2019','l7-alpi2007','l7-brenner2007','l7-trewavas2007','l7-lyon2021','l7-con-animal','l7-con-sentience','l7-con-panpsychism','l7-mind-embodied'],
 ids:['cognition-debate','cognition-debate-plants','cognition-debate-words']});

THREAD({id:'l7-setpoints',name:'Goals kept by tissues',ids:['barium-heads-adapt','rewritten-pattern-target','tame-framework-setpoint','morphospace-navigation-perturb','picasso-tadpoles']});
THREAD({id:'l7-scale',name:'How big is a self?',ids:['cell-coupling-reach','boundary-of-self','cognitive-light-cone-join','organism-or-robot']});
THREAD({id:'l7-learning',name:'Learning without a brain?',ids:['basal-cognition','headless-memory-savings','gene-network-learning-controls','cognition-debate']});
THREAD({id:'l7-labels',name:'Finding or framework?',ids:['instructive-signals-sort','tame-framework-claims','cognition-debate-plants']});
