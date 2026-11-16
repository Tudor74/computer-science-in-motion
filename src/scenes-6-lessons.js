/* Abiogenesis era 6 · The first cells: lessons, sources and connections. */
SOURCE('a6-oparin-1936',{title:'Oparin, A. I. (1936). The Origin of Life on Earth (in Russian; English translation 1938, Macmillan).'});
SOURCE('a6-koga-2011',{title:'Koga, S., Williams, D. S., Perriman, A. W. & Mann, S. (2011). Peptide–nucleotide microdroplets as a step towards a membrane-free protocell model. Nature Chemistry 3, 720–724.'});
SOURCE('a6-drobot-2018',{title:'Drobot, B. et al. (2018). Compartmentalised RNA catalysis in membrane-free coacervate protocells. Nature Communications 9, 3643.'});
SOURCE('a6-poudyal-2019',{title:'Poudyal, R. R. et al. (2019). Template-directed RNA polymerization and enhanced ribozyme catalysis inside membraneless compartments formed by coacervates. Nature Communications 10, 490.'});
SOURCE('a6-brangwynne-2009',{title:'Brangwynne, C. P. et al. (2009). Germline P granules are liquid droplets that localize by controlled dissolution/condensation. Science 324, 1729–1732.'});
SOURCE('a6-tang-2014',{title:'Dora Tang, T.-Y. et al. (2014). Fatty acid membrane assembly on coacervate microdroplets as a step towards a hybrid protocell model. Nature Chemistry 6, 527–533.'});
SOURCE('a6-deamer-1985',{title:'Deamer, D. W. (1985). Boundary structures are formed by organic components of the Murchison carbonaceous chondrite. Nature 317, 792–794.'});
SOURCE('a6-hargreaves-1978',{title:'Hargreaves, W. R. & Deamer, D. W. (1978). Liposomes from ionic, single-chain amphiphiles. Biochemistry 17, 3759–3768.'});
SOURCE('a6-hanczyc-2003',{title:'Hanczyc, M. M., Fujikawa, S. M. & Szostak, J. W. (2003). Experimental models of primitive cellular compartments: encapsulation, growth, and division. Science 302, 618–622.'});
SOURCE('a6-chen-2004',{title:'Chen, I. A., Roberts, R. W. & Szostak, J. W. (2004). The emergence of competition between model protocells. Science 305, 1474–1476.'});
SOURCE('a6-zhu-2009',{title:'Zhu, T. F. & Szostak, J. W. (2009). Coupled growth and division of model protocell membranes. Journal of the American Chemical Society 131, 5705–5713.'});
SOURCE('a6-mansy-2008',{title:'Mansy, S. S. et al. (2008). Template-directed synthesis of a genetic polymer in a model protocell. Nature 454, 122–125.'});
SOURCE('a6-budin-2011',{title:'Budin, I. & Szostak, J. W. (2011). Physical effects underlying the transition from primitive to modern cell membranes. PNAS 108, 5249–5254.'});
SOURCE('a6-frank-1953',{title:'Frank, F. C. (1953). On spontaneous asymmetric synthesis. Biochimica et Biophysica Acta 11, 459–463.'});
SOURCE('a6-soai-1995',{title:'Soai, K., Shibata, T., Morioka, H. & Choji, K. (1995). Asymmetric autocatalysis and amplification of enantiomeric excess of a chiral molecule. Nature 378, 767–768.'});
SOURCE('a6-viedma-2005',{title:'Viedma, C. (2005). Chiral symmetry breaking during crystallization: complete chiral purity induced by nonlinear autocatalysis and recycling. Physical Review Letters 94, 065504.'});
SOURCE('a6-glavin-2009',{title:'Glavin, D. P. & Dworkin, J. P. (2009). Enrichment of the amino acid L-isovaline by aqueous alteration on CI and CM meteorite parent bodies. PNAS 106, 5487–5492.'});
SOURCE('a6-ozturk-2023',{title:'Ozturk, S. F. et al. (2023). Origins of biological homochirality through chiral-induced spin selectivity. Science Advances 9, eadg8274.'});
SOURCE('a6-blackmond-2010',{title:'Blackmond, D. G. (2010). The origin of biological homochirality. Cold Spring Harbor Perspectives in Biology 2, a002147.'});
SOURCE('a6-biology',{title:'Biology In Motion: a sister course.',url:'https://biology-in-motion.puter.site/',note:'Its cells era covers membranes, diffusion and osmosis in living cells.'});
SOURCE('a6-physics',{title:'Physics In Motion: a sister course.',url:'https://physics-in-motion.puter.site/',note:'Polarised light and symmetry appear in its light era.'});

LESSON({id:'coacervates',name:'Coacervates',short:'Coacervates',stage:'cells',year:'1924–today',level:'Core',
 why:'Oparin’s droplets, revived: compartments without membranes that concentrate RNA, but struggle to keep their contents.',
 prior:['oparin-haldane'],references:['a6-oparin-1936','a6-koga-2011','a6-drobot-2018','a6-poudyal-2019','a6-brangwynne-2009','a6-tang-2014'],
 ids:['coacervates','coacervates-concentrate','coacervates-membraneless']});
LESSON({id:'protocells',name:'Protocells',short:'Protocells',stage:'cells',year:'1973–2004',level:'Core',
 why:'Fatty acids build hollow vesicles by themselves; clay helps, and vesicles holding RNA out-grow empty ones.',
 prior:['coacervates','meteorite-chemistry'],references:['a6-hargreaves-1978','a6-deamer-1985','a6-hanczyc-2003','a6-chen-2004','a6-biology'],
 ids:['protocells','protocells-clay','protocells-competition']});
LESSON({id:'membrane-growth',name:'Membrane growth and division',short:'Growth',stage:'cells',year:'2008–2012',level:'Core',
 why:'Fed fatty-acid vesicles grow into threads and split under gentle shear, and their leaky walls let building blocks in.',
 prior:['protocells'],references:['a6-zhu-2009','a6-mansy-2008','a6-budin-2011'],
 ids:['membrane-growth','membrane-growth-surface','membrane-growth-permeability']});
LESSON({id:'chirality',name:'Chirality',short:'Chirality',stage:'cells',year:'1848–today',level:'Core',
 why:'Life uses one hand of each molecule; chemistry makes both. How one hand won is still open.',
 prior:['miller-urey','meteorite-chemistry'],references:['a6-frank-1953','a6-soai-1995','a6-viedma-2005','a6-glavin-2009','a6-ozturk-2023','a6-blackmond-2010','a6-physics'],
 ids:['chirality','chirality-soai','chirality-viedma']});

THREAD({id:'a6-compartments',name:'Making a compartment',ids:['coacervates','coacervates-membraneless','protocells','membrane-growth','protocells-competition']});
THREAD({id:'a6-amplify',name:'Small biases, amplified',ids:['chirality-soai','autocatalytic-sets-formose','chirality-viedma','meteorite-chemistry']});
THREAD({id:'a6-feeding',name:'How early cells could feed',ids:['membrane-growth-permeability','proton-gradients-leaky','coacervates-concentrate','hydrothermal-vents-pores']});
