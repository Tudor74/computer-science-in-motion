/* Levin Lab era 3 · Planaria: lessons, sources and connections. */
SOURCE('l3-randolph',{title:'Harriet Randolph (1897). Observations and experiments on regeneration in planarians. Archiv für Entwickelungsmechanik der Organismen 5, 352–372.'});
SOURCE('l3-morgan',{title:'T. H. Morgan (1898). Experimental studies of the regeneration of Planaria maculata. Archiv für Entwickelungsmechanik der Organismen 7, 364–397.',url:'https://doi.org/10.1007/BF02161491'});
SOURCE('l3-reddien2004',{title:'Reddien & Sánchez Alvarado (2004). Fundamentals of planarian regeneration. Annual Review of Cell and Developmental Biology 20, 725–757.'});
SOURCE('l3-wagner2011',{title:'Wagner, Wang & Reddien (2011). Clonogenic neoblasts are pluripotent adult stem cells that underlie planarian regeneration. Science 332, 811–816.',url:'https://doi.org/10.1126/science.1203983'});
SOURCE('l3-petersen2008',{title:'Petersen & Reddien (2008). Smed-βcatenin-1 is required for anteroposterior blastema polarity in planarian regeneration. Science 319, 327–330.',url:'https://doi.org/10.1126/science.1149943'});
SOURCE('l3-gurley2008',{title:'Gurley, Rink & Sánchez Alvarado (2008). β-Catenin defines head versus tail identity during planarian regeneration and homeostasis. Science 319, 323–327.',url:'https://doi.org/10.1126/science.1150029'});
SOURCE('l3-nogi2005',{title:'Nogi & Levin (2005). Characterization of innexin gene expression and functional roles of gap-junctional communication in planarian regeneration. Developmental Biology 287, 314–335.'});
SOURCE('l3-oviedo2010',{title:'Oviedo, Morokuma, Walentek, Kema, Gu, Ahn, Hwang, Gojobori & Levin (2010). Long-range neural and gap junction protein-mediated cues control polarity during planarian regeneration. Developmental Biology 339, 188–199.',url:'https://doi.org/10.1016/j.ydbio.2009.12.012'});
SOURCE('l3-beane2011',{title:'Beane, Morokuma, Adams & Levin (2011). A chemical genetics approach reveals H,K-ATPase-mediated membrane voltage is required for planarian head regeneration. Chemistry & Biology 18, 77–89.'});
SOURCE('l3-durant2017',{title:'Durant, Morokuma, Fields, Williams, Adams & Levin (2017). Long-term, stochastic editing of regenerative anatomy via targeting endogenous bioelectric gradients. Biophysical Journal 112, 2231–2243.',url:'https://doi.org/10.1016/j.bpj.2017.04.011'});
SOURCE('l3-durant2016',{title:'Durant, Lobo, Hammelman & Levin (2016). Physiological controls of large-scale patterning in planarian regeneration: a molecular and computational perspective on growth and form. Regeneration 3, 78–102.',url:'https://doi.org/10.1002/reg2.54'});
SOURCE('l3-emmonsbell2015',{title:'Emmons-Bell, Durant, Hammelman, Bessonov, Volpert, Morokuma, Pinet, Adams, Pietak, Lobo & Levin (2015). Gap junctional blockade stochastically induces different species-specific head anatomies in genetically wild-type Girardia dorotocephala flatworms. International Journal of Molecular Sciences 16, 27865–27896.',url:'https://doi.org/10.3390/ijms161126065'});
SOURCE('l3-emmonsbell2019',{title:'Emmons-Bell, Durant, Tung, Pietak, Miller, Kane, Martyniuk, Davidian, Morokuma & Levin (2019). Regenerative adaptation to electrochemical perturbation in planaria: a molecular analysis of physiological plasticity. iScience 22, 147–165.',url:'https://doi.org/10.1016/j.isci.2019.11.014'});
SOURCE('l3-brain-ghk',{title:'Brain In Motion — the resting potential with several ions (Goldman’s equation).',url:'https://brain-in-motion.puter.site/#resting-potential-ghk',note:'Sister course: how channel permeabilities set a voltage.'});
SOURCE('l3-mcconnell1959',{title:'McConnell, Jacobson & Kimble (1959). The effects of regeneration upon retention of a conditioned response in the planarian. Journal of Comparative and Physiological Psychology 52, 1–5.',url:'https://doi.org/10.1037/h0048028'});
SOURCE('l3-mcconnell1962',{title:'McConnell (1962). Memory transfer through cannibalism in planarians. Journal of Neuropsychiatry 3, supplement 1.'});
SOURCE('l3-bennett1964',{title:'Bennett & Calvin (1964). Failure to train planarians reliably. Neurosciences Research Program Bulletin.'});
SOURCE('l3-shomrat2013',{title:'Shomrat & Levin (2013). An automated training paradigm reveals long-term memory in planarians and its persistence through head regeneration. Journal of Experimental Biology 216, 3799–3810.',url:'https://doi.org/10.1242/jeb.087809'});
SOURCE('l3-gershman2023',{title:'Gershman (2023). The molecular memory code and synaptic plasticity: a synthesis. BioSystems 224, 104825.'});
SOURCE('l3-mind-conditioning',{title:'Mind In Motion — classical conditioning.',url:'https://mind-in-motion.puter.site/#classical-conditioning',note:'Sister course: pairing a stimulus with a shock or a reward.'});
SOURCE('l3-mind-replication',{title:'Mind In Motion — the replication crisis.',url:'https://mind-in-motion.puter.site/#replication-crisis',note:'Sister course: why results need repeating by other labs.'});

LESSON({id:'worm-regeneration',name:'Worms that regrow',short:'Regrowth',stage:'planaria',year:'1897–2011',level:'Introduction',
 why:'Flatworms that rebuild a whole body from a small piece, using adult stem cells, are the classic test of how a body knows what to rebuild.',
 prior:['membrane-voltage'],references:['l3-randolph','l3-morgan','l3-reddien2004','l3-wagner2011','l3-petersen2008','l3-gurley2008'],
 ids:['worm-regeneration','worm-regeneration-neoblasts','worm-regeneration-polarity']});
LESSON({id:'two-headed-worms',name:'Two-headed worms',short:'Two heads',stage:'planaria',year:'2005–2011',level:'Introduction',
 why:'Briefly disturbing gap junctions, or the voltage of a wound, changed what cut fragments regrew, with no change to their genes.',
 prior:['worm-regeneration','gap-junctions'],references:['l3-nogi2005','l3-oviedo2010','l3-beane2011','l3-petersen2008','l3-gurley2008','l3-durant2016'],
 ids:['two-headed-worms','two-headed-worms-voltage','two-headed-worms-routes']});
LESSON({id:'rewritten-pattern',name:'A pattern that persists',short:'Persistence',stage:'planaria',year:'2010–2017',level:'Core',
 why:'Two-headed worms that stay two-headed through later cuts, after the drug is gone, are the lab’s main evidence that a stored pattern, not only the genome, sets what regrows.',
 prior:['two-headed-worms'],references:['l3-oviedo2010','l3-durant2017','l3-durant2016'],
 ids:['rewritten-pattern','rewritten-pattern-cryptic','rewritten-pattern-target']});
LESSON({id:'species-heads',name:'Heads of other species',short:'Other heads',stage:'planaria',year:'2015',level:'Core',
 why:'Head shapes typical of other species, appearing in genetically unchanged worms, suggested that one genome can reach several anatomies.',
 prior:['two-headed-worms'],references:['l3-emmonsbell2015','l3-durant2016'],
 ids:['species-heads','species-heads-attractor','species-heads-inside']});
LESSON({id:'barium-heads',name:'Adapting to barium',short:'Barium',stage:'planaria',year:'2019',level:'Core',
 why:'Heads that first degenerate in barium and then regrow able to tolerate it raise the question of how tissue finds a new solution.',
 prior:['worm-regeneration'],references:['l3-emmonsbell2019','l3-brain-ghk'],
 ids:['barium-heads','barium-heads-adapt','barium-heads-tests']});
LESSON({id:'headless-memory',name:'Memory without a head?',short:'Memory',stage:'planaria',year:'1959–2013',level:'Core',
 why:'A claim that a trained worm keeps something of its training after its head regrows is striking, rests mainly on one lab, and follows a disputed history.',
 prior:['worm-regeneration'],references:['l3-mcconnell1959','l3-mcconnell1962','l3-bennett1964','l3-shomrat2013','l3-gershman2023','l3-mind-conditioning','l3-mind-replication'],
 ids:['headless-memory','headless-memory-arena','headless-memory-savings']});

THREAD({id:'l3-polarity',name:'Head or tail: what decides?',ids:['worm-regeneration-polarity','two-headed-worms','two-headed-worms-voltage','two-headed-worms-routes','gap-junction-model']});
THREAD({id:'l3-patternmemory',name:'A stored body pattern',ids:['rewritten-pattern-cryptic','rewritten-pattern-target','species-heads-attractor','picasso-tadpoles','morphospace-navigation','bioelectric-code']});
THREAD({id:'l3-homeostasis',name:'Tissue that finds its way back',ids:['barium-heads-adapt','species-heads-attractor','picasso-tadpoles','tame-framework']});
THREAD({id:'l3-memory',name:'Memory outside the brain?',ids:['headless-memory-savings','gene-network-learning','cognition-debate']});
THREAD({id:'l3-replication',name:'Which results have others repeated?',ids:['headless-memory','two-headed-worms-routes','independent-tests']});
