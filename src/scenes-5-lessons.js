/* Abiogenesis era 5 · Metabolism first?: lessons, sources and connections. */
SOURCE('a5-kelley-2001',{title:'Kelley, D. S. et al. (2001). An off-axis hydrothermal vent field near the Mid-Atlantic Ridge at 30° N. Nature 412, 145–149.'});
SOURCE('a5-martin-2008',{title:'Martin, W., Baross, J., Kelley, D. & Russell, M. J. (2008). Hydrothermal vents and the origin of life. Nature Reviews Microbiology 6, 805–814.'});
SOURCE('a5-baaske-2007',{title:'Baaske, P. et al. (2007). Extreme accumulation of nucleotides in simulated hydrothermal pore systems. PNAS 104, 9346–9351.'});
SOURCE('a5-preiner-2020',{title:'Preiner, M. et al. (2020). A hydrogen-dependent geochemical analogue of primordial carbon and energy metabolism. Nature Ecology & Evolution 4, 534–542.'});
SOURCE('a5-herschy-2014',{title:'Herschy, B. et al. (2014). An origin-of-life reactor to simulate alkaline hydrothermal vents. Journal of Molecular Evolution 79, 213–227.'});
SOURCE('a5-wachtershauser-1988',{title:'Wächtershäuser, G. (1988). Before enzymes and templates: theory of surface metabolism. Microbiological Reviews 52, 452–484.'});
SOURCE('a5-huber-1997',{title:'Huber, C. & Wächtershäuser, G. (1997). Activated acetic acid by carbon fixation on (Fe,Ni)S under primordial conditions. Science 276, 245–247.'});
SOURCE('a5-russell-martin-2004',{title:'Russell, M. J. & Martin, W. (2004). The rocky roots of the acetyl-CoA pathway. Trends in Biochemical Sciences 29, 358–363.'});
SOURCE('a5-kauffman-1986',{title:'Kauffman, S. A. (1986). Autocatalytic sets of proteins. Journal of Theoretical Biology 119, 1–24.'});
SOURCE('a5-hordijk-2011',{title:'Hordijk, W., Kauffman, S. A. & Steel, M. (2011). Required levels of catalysis for emergence of autocatalytic sets in models of chemical reaction systems. International Journal of Molecular Sciences 12, 3085–3101.'});
SOURCE('a5-ricardo-2004',{title:'Ricardo, A., Carrigan, M. A., Olcott, A. N. & Benner, S. A. (2004). Borate minerals stabilize ribose. Science 303, 196.'});
SOURCE('a5-eigen-schuster-1977',{title:'Eigen, M. & Schuster, P. (1977). The hypercycle: a principle of natural self-organization. Naturwissenschaften 64, 541–565.'});
SOURCE('a5-vaidya-2012',{title:'Vaidya, N. et al. (2012). Spontaneous network formation among cooperative RNA replicators. Nature 491, 72–77.'});
SOURCE('a5-mitchell-1961',{title:'Mitchell, P. (1961). Coupling of phosphorylation to electron and hydrogen transfer by a chemi-osmotic type of mechanism. Nature 191, 144–148.'});
SOURCE('a5-lane-martin-2012',{title:'Lane, N. & Martin, W. F. (2012). The origin of membrane bioenergetics. Cell 151, 1406–1416.'});
SOURCE('a5-sojo-2014',{title:'Sojo, V., Pomiankowski, A. & Lane, N. (2014). A bioenergetic basis for membrane divergence in archaea and bacteria. PLoS Biology 12, e1001926.'});
SOURCE('a5-jackson-2016',{title:'Jackson, J. B. (2016). Natural pH gradients in hydrothermal alkali vents were unlikely to have played a role in the origin of life. Journal of Molecular Evolution 83, 1–11.'});
SOURCE('a5-lane-2015',{title:'Lane, N. (2015). The Vital Question: Why Is Life the Way It Is? Profile Books.'});
SOURCE('a5-biology',{title:'Biology In Motion: a sister course.',url:'https://biology-in-motion.puter.site/',note:'Its energy era covers enzymes, membranes, ATP and chemiosmosis in living cells.'});

LESSON({id:'hydrothermal-vents',name:'Hydrothermal vents',short:'Vents',stage:'metabolism',year:'1977–today',level:'Core',
 why:'Vents on the sea floor offer heat, minerals, hydrogen and natural gradients: one of the two leading candidate settings for life’s start.',
 prior:['miller-urey','hadean-earth'],references:['a5-kelley-2001','a5-martin-2008','a5-baaske-2007','a5-herschy-2014','a5-preiner-2020'],
 ids:['hydrothermal-vents','hydrothermal-vents-pores','hydrothermal-vents-reactor']});
LESSON({id:'iron-sulfur-world',name:'The iron–sulphur world',short:'Iron–sulphur',stage:'metabolism',year:'1988–1998',level:'Core',
 why:'Wächtershäuser proposed that metabolism began on mineral surfaces, before genes; his key reactions work in the lab.',
 prior:['hydrothermal-vents'],references:['a5-wachtershauser-1988','a5-huber-1997','a5-russell-martin-2004'],
 ids:['iron-sulfur-world','iron-sulfur-world-huber','iron-sulfur-world-clusters']});
LESSON({id:'autocatalytic-sets',name:'Autocatalytic sets',short:'Autocatalysis',stage:'metabolism',year:'1861–2012',level:'Core',
 why:'Chemistry that makes its own catalysts could sustain and grow itself without a single master replicator.',
 prior:['iron-sulfur-world','replicators'],references:['a5-kauffman-1986','a5-hordijk-2011','a5-ricardo-2004','a5-eigen-schuster-1977','a5-vaidya-2012'],
 ids:['autocatalytic-sets','autocatalytic-sets-formose','autocatalytic-sets-ecology']});
LESSON({id:'proton-gradients',name:'Proton gradients',short:'Gradients',stage:'metabolism',year:'1961–today',level:'Core',
 why:'Every cell makes energy by letting protons flow across a membrane; vents offer such a gradient ready-made.',
 prior:['hydrothermal-vents'],references:['a5-mitchell-1961','a5-lane-martin-2012','a5-sojo-2014','a5-jackson-2016','a5-lane-2015','a5-biology'],
 ids:['proton-gradients','proton-gradients-vent','proton-gradients-leaky']});

THREAD({id:'a5-vent-story',name:'The vent hypothesis',ids:['hydrothermal-vents','iron-sulfur-world-huber','proton-gradients-vent','proton-gradients-leaky','luca']});
THREAD({id:'a5-self-sustaining',name:'Chemistry that sustains itself',ids:['autocatalytic-sets','autocatalytic-sets-formose','autocatalytic-sets-ecology','replicators','protocells-competition']});
THREAD({id:'a5-minerals',name:'Minerals as catalysts',ids:['iron-sulfur-world','iron-sulfur-world-clusters','hydrothermal-vents-reactor','protocells-clay']});
