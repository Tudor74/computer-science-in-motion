/* Levin Lab era 6 · Xenobots: lessons, sources and connections. */
SOURCE('l6-kriegman2020',{title:'Kriegman, Blackiston, Levin & Bongard (2020). A scalable pipeline for designing reconfigurable organisms. PNAS 117(4), 1853–1859.',url:'https://doi.org/10.1073/pnas.1910837117'});
SOURCE('l6-uvm2020',{title:'University of Vermont news release (13 January 2020). Team builds the first living robots.',url:'https://www.uvm.edu/news/story/team-builds-first-living-robots',note:'Press release; quoted for the scientists’ own wording and the reported size and lifespan.'});
SOURCE('l6-hiller',{title:'Hiller & Lipson (2014). Dynamic simulation of soft multimaterial 3D-printed objects. Soft Robotics 1.',note:'The Voxelyze soft-body engine.'});
SOURCE('l6-sims',{title:'Karl Sims (1994). Evolving virtual creatures. Proceedings of SIGGRAPH ’94, 15–22.',url:'https://doi.org/10.1145/192161.192167'});
SOURCE('l6-lipson',{title:'Lipson & Pollack (2000). Automatic design and manufacture of robotic lifeforms. Nature 406, 974–978.',url:'https://doi.org/10.1038/35023115'});
SOURCE('l6-cheney',{title:'Cheney, MacCurdy, Clune & Lipson (2013). Unshackling evolution: evolving soft robots with multiple materials and a powerful generative encoding. Proceedings of GECCO ’13.'});
SOURCE('l6-jakobi',{title:'Jakobi, Husbands & Harvey (1995). Noise and the reality gap: the use of simulation in evolutionary robotics. Advances in Artificial Life (ECAL 1995), Lecture Notes in Computer Science 929.',url:'https://doi.org/10.1007/3-540-59496-5_337'});
SOURCE('l6-bio-evolution',{title:'Biology In Motion — evolution in the lab.',url:'https://biology-in-motion.puter.site/#evolution-in-the-lab',note:'Sister course: real evolution, variation and selection in bacteria.'});
SOURCE('l6-blackiston2021',{title:'Blackiston, Lederer, Kriegman, Garnier, Bongard & Levin (2021). A cellular platform for the development of synthetic living machines. Science Robotics 6(52), eabf1571.',url:'https://doi.org/10.1126/scirobotics.abf1571'});
SOURCE('l6-uvm2021',{title:'University of Vermont news release (31 March 2021). Scientists create the next generation of living robots.',url:'https://www.uvm.edu/news/story/scientists-create-next-generation-living-robots',note:'Press release; source of the memory test’s numbers as reported (3 of 10 after two hours).'});
SOURCE('l6-purcell',{title:'Purcell (1977). Life at low Reynolds number. American Journal of Physics 45, 3–11.'});
SOURCE('l6-kriegman2021',{title:'Kriegman, Blackiston, Levin & Bongard (2021). Kinematic self-replication in reconfigurable organisms. PNAS 118(49), e2112672118.',url:'https://doi.org/10.1073/pnas.2112672118'});
SOURCE('l6-vonneumann',{title:'John von Neumann (1966). Theory of Self-Reproducing Automata, edited and completed by A. W. Burks. University of Illinois Press.'});
SOURCE('l6-gumuskaya',{title:'Gumuskaya, Srivastava, Cooper, Lesser, Semegran, Garnier & Levin (2024). Motile living biobots self-construct from adult human somatic progenitor seed cells. Advanced Science 11(4), 2303575.',url:'https://doi.org/10.1002/advs.202303575'});
SOURCE('l6-tufts2023',{title:'Tufts University news release (30 November 2023). Scientists build tiny biological robots from human cells.',url:'https://now.tufts.edu/2023/11/30/scientists-build-tiny-biological-robots-human-cells',note:'Press release.'});
SOURCE('l6-coghlan',{title:'Coghlan & Leins (2020). “Living robots”: ethical questions about xenobots. American Journal of Bioethics 20(5), W1–W3.',url:'https://doi.org/10.1080/15265161.2020.1746102'});
SOURCE('l6-mestre',{title:'Mestre, Astobiza, Webster-Wood, Ryan & Saif (2024). Ethics and responsibility in biohybrid robotics research. PNAS 121(31), e2310458121.',url:'https://doi.org/10.1073/pnas.2310458121'});
SOURCE('l6-blackiston2023',{title:'Blackiston, Kriegman, Bongard & Levin (2023). Biological robots: perspectives on an emerging interdisciplinary field. Soft Robotics 10(4), 674–686.',url:'https://doi.org/10.1089/soro.2022.0142',note:'The xenobot team’s reply to questions and critiques.'});

LESSON({id:'computer-designed',name:'Designed in a computer',short:'Designed',stage:'xenobot',year:'2020',level:'Introduction',
 why:'Shapes found by a search in simulation, then built by hand from frog cells, were the first xenobots.',
 prior:['worm-regeneration'],references:['l6-kriegman2020','l6-uvm2020','l6-hiller'],
 ids:['computer-designed','computer-designed-tissues','computer-designed-check']});
LESSON({id:'evolved-designs',name:'Evolution in simulation',short:'Evolution',stage:'xenobot',year:'1994–2020',level:'Introduction',
 why:'Scoring many random body plans in a physics simulator, keeping and varying the best, is how the designs were found, and what was lost between simulation and dish matters.',
 prior:['computer-designed'],references:['l6-sims','l6-lipson','l6-cheney','l6-jakobi','l6-kriegman2020','l6-bio-evolution'],
 ids:['evolved-designs','evolved-designs-search','evolved-designs-gap']});
LESSON({id:'ciliated-xenobots',name:'Self-assembled xenobots',short:'Cilia',stage:'xenobot',year:'2021',level:'Core',
 why:'Frog skin cells left alone assembled into swimming spheres, showing that the cells themselves bring much of the behaviour.',
 prior:['computer-designed'],references:['l6-blackiston2021','l6-uvm2021','l6-purcell'],
 ids:['ciliated-xenobots','ciliated-xenobots-steer','ciliated-xenobots-memory']});
LESSON({id:'self-replication',name:'Kinematic replication',short:'Replication',stage:'xenobot',year:'2021',level:'Core',
 why:'Swimming clusters that push loose cells into piles that become new clusters were reported as a new kind of self-copying.',
 prior:['ciliated-xenobots'],references:['l6-kriegman2021','l6-vonneumann'],
 ids:['self-replication','self-replication-piles','self-replication-shape']});
LESSON({id:'anthrobots',name:'Anthrobots',short:'Anthrobots',stage:'xenobot',year:'2023–2024',level:'Core',
 why:'Moving cell clusters grown from adult human airway cells extended the work from frog embryos to human tissue in a dish.',
 prior:['ciliated-xenobots'],references:['l6-gumuskaya','l6-tufts2023'],
 ids:['anthrobots','anthrobots-tracks','anthrobots-neurons']});
LESSON({id:'organism-or-robot',name:'Organism or robot?',short:'Ethics',stage:'xenobot',year:'2020–today',level:'Core',
 why:'Calling a cluster of cells a robot or an organism changes how people judge it, and scientists and ethicists disagree about the words and the risks.',
 prior:['self-replication','anthrobots'],references:['l6-coghlan','l6-mestre','l6-blackiston2023','l6-uvm2020'],
 ids:['organism-or-robot','organism-or-robot-words','organism-or-robot-ethics']});

THREAD({id:'l6-cilia',name:'Cilia that move fluid, and bodies',ids:['cilia-debate','ciliated-xenobots-steer','anthrobots-tracks']});
THREAD({id:'l6-simreal',name:'Simulation against the real thing',ids:['computer-designed-check','evolved-designs-gap','bioelectric-models','independent-tests']});
THREAD({id:'l6-selfbuilt',name:'What cells build when left to themselves',ids:['ciliated-xenobots','anthrobots','picasso-tadpoles','morphospace-navigation']});
THREAD({id:'l6-whatisit',name:'Where does one living thing end?',ids:['boundary-of-self','organism-or-robot','tame-framework','cognitive-light-cone']});
