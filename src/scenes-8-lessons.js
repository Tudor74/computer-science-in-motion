/* Levin Lab era 8 · Tools and open questions: lessons, sources and connections. */
SOURCE('l8-pietak2016',{title:'Pietak & Levin (2016). Exploring instructive physiological signaling with the bioelectric tissue simulation engine. Frontiers in Bioengineering and Biotechnology 4, 55.'});
SOURCE('l8-pietak2017',{title:'Pietak & Levin (2017). Bioelectric gene and reaction networks: computational modelling of genetic, biochemical and bioelectrical dynamics in pattern regulation. Journal of the Royal Society Interface 14, 20170425.'});
SOURCE('l8-law2015',{title:'Law & Levin (2015). Bioelectric memory: modeling resting potential bistability in amphibian embryos and mammalian cells. Theoretical Biology and Medical Modelling 12, 22.'});
SOURCE('l8-cervera2014',{title:'Cervera, Alcaraz & Mafe (2014). Membrane potential bistability in nonexcitable cells as described by inward and outward voltage-gated ion channels. Journal of Physical Chemistry B.'});
SOURCE('l8-brain-ghk',{title:'Brain In Motion — several ions at once (the Goldman equation).',url:'https://brain-in-motion.puter.site/#resting-potential-ghk',note:'Sister course: where the voltage of the toy cells comes from.'});
SOURCE('l8-famm2013',{title:'Famm, Litt, Tracey, Boyden & Slaoui (2013). Drug discovery: a jump-start for electroceuticals. Nature 496, 159–161.'});
SOURCE('l8-churchill2019',{title:'Churchill, Winter, Tuszynski & Levin (2019). EDEn, the electroceutical design environment: a database of ion channels, their tissue expression and small-molecule modulators. iScience 11.'});
SOURCE('l8-overington2006',{title:'Overington, Al-Lazikani & Hopkins (2006). How many drug targets are there? Nature Reviews Drug Discovery 5, 993–996.'});
SOURCE('l8-martyniuk2018',{title:'Levin & Martyniuk (2018). The bioelectric code: an ancient computational medium for dynamic control of growth and form. BioSystems 164, 76–93.'});
SOURCE('l8-adams2013',{title:'Adams, Tseng & Levin (2013). Light-activation of the Archaerhodopsin H⁺-pump reverses age-dependent loss of vertebrate regeneration: sparking system-level controls in vivo. Biology Open 2, 306–313.'});
SOURCE('l8-pai2012',{title:'Pai, Aw, Shomrat, Lemire & Levin (2012). Transmembrane voltage potential controls embryonic eye patterning in Xenopus laevis. Development 139, 313–323.'});
SOURCE('l8-plaster2001',{title:'Plaster et al. (2001). Mutations in Kir2.1 cause the developmental and episodic electrical phenotypes of Andersen’s syndrome. Cell 105, 511–519.'});
SOURCE('l8-dahal2012',{title:'Dahal et al. (2012). An inwardly rectifying K⁺ channel is required for patterning. Development 139.'});
SOURCE('l8-perathoner2014',{title:'Perathoner et al. (2014). Bioelectric signaling regulates size in zebrafish fins. PLoS Genetics 10, e1004080.'});
SOURCE('l8-stewart2021',{title:'Stewart et al. (2021). longfin causes cis-ectopic expression of the kcnh2a ether-a-go-go K⁺ channel to autonomously prolong fin outgrowth. Development 148.'});
SOURCE('l8-button2013',{title:'Button, Ioannidis, Mokrysz, Nosek, Flint, Robinson & Munafò (2013). Power failure: why small sample size undermines the reliability of neuroscience. Nature Reviews Neuroscience 14, 365–376.'});
SOURCE('l8-osc2015',{title:'Open Science Collaboration (2015). Estimating the reproducibility of psychological science. Science 349, aac4716.'});
SOURCE('l8-mind-replication',{title:'Mind In Motion — the replication crisis.',url:'https://mind-in-motion.puter.site/#replication-crisis',note:'Sister course: the general problem of findings that do not repeat.'});
SOURCE('l8-levin2021',{title:'Levin (2021). Bioelectric signaling: reprogrammable circuits underlying embryogenesis, regeneration, and cancer. Cell 184, 1971–1989.'});
SOURCE('l8-murata2005',{title:'Murata, Iwasaki, Sasaki, Inaba & Okamura (2005). Phosphoinositide phosphatase activity coupled to an intrinsic voltage sensor. Nature 435, 1239–1243.'});
SOURCE('l8-zhou2015',{title:'Zhou et al. (2015). Membrane potential modulates plasma membrane phospholipid dynamics and K-Ras signaling. Science 349, 873–876.'});
SOURCE('l8-linnebo',{title:'Øystein Linnebo. Platonism in the Philosophy of Mathematics. Stanford Encyclopedia of Philosophy.',url:'https://plato.stanford.edu/entries/platonism-mathematics/'});
SOURCE('l8-kauffman1993',{title:'Stuart Kauffman (1993). The Origins of Order: Self-Organization and Selection in Evolution. Oxford University Press.'});

LESSON({id:'bioelectric-models',name:'Simulating bioelectricity',short:'Models',stage:'frontier',year:'2014–today',level:'Introduction',
 why:'Computer models of ion flow in sheets of cells let the lab ask which voltage patterns are stable and which small changes might flip them.',
 prior:['gap-junctions'],references:['l8-pietak2016','l8-pietak2017','l8-law2015','l8-cervera2014','l8-brain-ghk'],
 ids:['bioelectric-models','bioelectric-models-bistable','bioelectric-models-flip']});
LESSON({id:'electroceuticals',name:'Ion-channel drugs',short:'Drugs',stage:'frontier',year:'2013–today',level:'Introduction',
 why:'Many existing drugs act on ion channels, so the lab has proposed using them to change voltage patterns; that proposal has so far been tested in animals and cells, not as a treatment.',
 prior:['bioelectric-models'],references:['l8-overington2006','l8-famm2013','l8-churchill2019'],
 ids:['electroceuticals','electroceuticals-senses','electroceuticals-tissues']});
LESSON({id:'bioelectric-code',name:'Reading and writing the code',short:'Code',stage:'frontier',year:'2018–today',level:'Core',
 why:'The idea of a bioelectric code ties the course together, and it is a hypothesis with partial evidence, not an established code like the genetic one.',
 prior:['electroceuticals','rewritten-pattern'],references:['l8-martyniuk2018','l8-pai2012','l8-adams2013'],
 ids:['bioelectric-code','bioelectric-code-tools','bioelectric-code-decode']});
LESSON({id:'independent-tests',name:'Who else has found it?',short:'Replication',stage:'frontier',year:'1974–today',level:'Core',
 why:'Separating results that many labs have confirmed from results reported mainly by one lab and its collaborators is how to read this field.',
 prior:['bioelectric-code'],references:['l8-plaster2001','l8-dahal2012','l8-perathoner2014','l8-stewart2021','l8-button2013','l8-osc2015','l8-mind-replication'],
 ids:['independent-tests','independent-tests-channels','independent-tests-replication']});
LESSON({id:'open-questions',name:'Open questions',short:'Open',stage:'frontier',year:'today',level:'Core',
 why:'How cells turn voltage into gene expression, how patterns are stored and how far frog and worm results carry to mammals are still unanswered.',
 prior:['independent-tests'],references:['l8-levin2021','l8-murata2005','l8-zhou2015','l8-law2015'],
 ids:['open-questions','open-questions-transduction','open-questions-storage']});
LESSON({id:'platonic-space',name:'A space of forms?',short:'Speculation',stage:'frontier',year:'2020s',level:'Core',
 why:'The lab’s most speculative idea, that forms may be drawn from a space of patterns, is philosophy offered for discussion, not a scientific result.',
 prior:['open-questions','tame-framework'],references:['l8-linnebo','l8-kauffman1993'],
 ids:['platonic-space','platonic-space-math','platonic-space-views']});

THREAD({id:'l8-bistable',name:'Cells with two resting voltages',ids:['gap-junctions','bioelectric-models-bistable','bioelectric-models-flip','open-questions-storage']});
THREAD({id:'l8-channeldrugs',name:'Changing voltage with drugs',ids:['tail-sodium','instructor-cells','brain-rescue','electroceuticals','electroceuticals-tissues']});
THREAD({id:'l8-evidence',name:'How strong is the evidence?',ids:['instructive-signals','headless-memory','independent-tests','independent-tests-replication','cognition-debate']});
THREAD({id:'l8-code',name:'Is there a bioelectric code?',ids:['induced-eyes','rewritten-pattern','bioelectric-code','bioelectric-code-decode','open-questions-transduction']});
THREAD({id:'l8-forms',name:'Where do forms come from?',ids:['morphospace-navigation','tame-framework','platonic-space','platonic-space-views']});
