/* Abiogenesis era 7 · The last common ancestor: lessons, sources and connections. */
SOURCE('a7-weiss-2016',{title:'Weiss, M. C. et al. (2016). The physiology and habitat of the last universal common ancestor. Nature Microbiology 1, 16116.',url:'https://doi.org/10.1038/nmicrobiol.2016.116'});
SOURCE('a7-moody-2024',{title:'Moody, E. R. R. et al. (2024). The nature of the last universal common ancestor and its impact on the early Earth system. Nature Ecology & Evolution 8, 1654–1666.',url:'https://doi.org/10.1038/s41559-024-02461-1'});
SOURCE('a7-boussau-2008',{title:'Boussau, B., Blanquart, S., Necsulea, A., Lartillot, N. & Gouy, M. (2008). Parallel adaptations to high temperatures in the Archaean eon. Nature 456, 942–945.'});
SOURCE('a7-lombard-2012',{title:'Lombard, J., López-García, P. & Moreira, D. (2012). The early evolution of lipid membranes and the three domains of life. Nature Reviews Microbiology 10, 507–515.'});
SOURCE('a7-crick-1968',{title:'Crick, F. H. C. (1968). The origin of the genetic code. Journal of Molecular Biology 38, 367–379.'});
SOURCE('a7-yarus-2009',{title:'Yarus, M., Widmann, J. J. & Knight, R. (2009). RNA–amino acid binding: a stereochemical era for the genetic code. Journal of Molecular Evolution 69, 406–429.'});
SOURCE('a7-wong-1975',{title:'Wong, J. T.-F. (1975). A co-evolution theory of the genetic code. PNAS 72, 1909–1912.'});
SOURCE('a7-haig-hurst-1991',{title:'Haig, D. & Hurst, L. D. (1991). A quantitative measure of error minimization in the genetic code. Journal of Molecular Evolution 33, 412–417.'});
SOURCE('a7-freeland-1998',{title:'Freeland, S. J. & Hurst, L. D. (1998). The genetic code is one in a million. Journal of Molecular Evolution 47, 238–248.'});
SOURCE('a7-koonin-2009',{title:'Koonin, E. V. & Novozhilov, A. S. (2009). Origin and evolution of the genetic code: the universal enigma. IUBMB Life 61, 99–111.'});
SOURCE('a7-osawa-1992',{title:'Osawa, S., Jukes, T. H., Watanabe, K. & Muto, A. (1992). Recent evidence for evolution of the genetic code. Microbiological Reviews 56, 229–264.'});
SOURCE('a7-ncbi-codes',{title:'NCBI. The genetic codes (translation tables).',url:'https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi'});
SOURCE('a7-gogarten-1989',{title:'Gogarten, J. P. et al. (1989). Evolution of the vacuolar H⁺-ATPase: implications for the origin of eukaryotes. PNAS 86, 6661–6665.'});
SOURCE('a7-iwabe-1989',{title:'Iwabe, N., Kuma, K., Hasegawa, M., Osawa, S. & Miyata, T. (1989). Evolutionary relationship of archaebacteria, eubacteria, and eukaryotes inferred from phylogenetic trees of duplicated genes. PNAS 86, 9355–9359.'});
SOURCE('a7-gouy-2015',{title:'Gouy, R., Baurain, D. & Philippe, H. (2015). Rooting the tree of life: the phylogenetic jury is still out. Philosophical Transactions of the Royal Society B 370, 20140329.'});
SOURCE('a7-woese-1990',{title:'Woese, C. R., Kandler, O. & Wheelis, M. L. (1990). Towards a natural system of organisms: proposal for the domains Archaea, Bacteria, and Eucarya. PNAS 87, 4576–4579.',url:'https://doi.org/10.1073/pnas.87.12.4576'});
SOURCE('a7-spang-2015',{title:'Spang, A. et al. (2015). Complex archaea that bridge the gap between prokaryotes and eukaryotes. Nature 521, 173–179.'});
SOURCE('a7-williams-2020',{title:'Williams, T. A., Cox, C. J., Foster, P. G., Szöllősi, G. J. & Embley, T. M. (2020). Phylogenomics provides robust support for a two-domains tree of life. Nature Ecology & Evolution 4, 138–147.'});
SOURCE('a7-imachi-2020',{title:'Imachi, H. et al. (2020). Isolation of an archaeon at the prokaryote–eukaryote interface. Nature 577, 519–525.'});
SOURCE('a7-forterre-2006',{title:'Forterre, P. (2006). The origin of viruses and their possible roles in major evolutionary transitions. Virus Research 117, 5–16.'});
SOURCE('a7-krupovic-2019',{title:'Krupovic, M., Dolja, V. V. & Koonin, E. V. (2019). Origin of viruses: primordial replicators recruiting capsids from hosts. Nature Reviews Microbiology 17, 449–458.'});
SOURCE('a7-lascola-2003',{title:'La Scola, B. et al. (2003). A giant virus in amoebae. Science 299, 2033.'});
SOURCE('a7-philippe-2013',{title:'Philippe, N. et al. (2013). Pandoraviruses: amoeba viruses with genomes up to 2.5 Mb reaching that of parasitic eukaryotes. Science 341, 281–286.'});
SOURCE('a7-mi-2000',{title:'Mi, S. et al. (2000). Syncytin is a captive retroviral envelope protein involved in human placental morphogenesis. Nature 403, 785–789.'});
SOURCE('a7-feschotte-2012',{title:'Feschotte, C. & Gilbert, C. (2012). Endogenous viruses: insights into viral evolution and impact on host biology. Nature Reviews Genetics 13, 283–296.'});
SOURCE('a7-biology',{title:'Biology In Motion: a sister course.',url:'https://biology-in-motion.puter.site/',note:'Its tree-of-life and genetic-code lessons cover the same ground from the biology side.'});

LESSON({id:'luca',name:'The last universal common ancestor',short:'LUCA',stage:'luca',year:'1977–today',level:'Core',
 why:'Every living cell descends from one ancestral population; reading its genes back from today’s genomes tells us what early life had already become.',
 prior:['ribozymes','proton-gradients','oldest-evidence'],references:['a7-weiss-2016','a7-moody-2024','a7-boussau-2008','a7-lombard-2012','a7-biology'],
 ids:['luca','luca-portrait','luca-dating']});
LESSON({id:'genetic-code-origin',name:'The origin of the genetic code',short:'Genetic code',stage:'luca',year:'1965–today',level:'Advanced',
 why:'The code was fixed before LUCA, and its pattern holds clues to how it arose: it limits the damage from errors far better than chance.',
 prior:['luca','ribozymes'],references:['a7-crick-1968','a7-yarus-2009','a7-wong-1975','a7-haig-hurst-1991','a7-freeland-1998','a7-koonin-2009','a7-osawa-1992','a7-ncbi-codes'],
 ids:['genetic-code-origin','genetic-code-origin-cost','genetic-code-origin-variants']});
LESSON({id:'rooting-the-tree',name:'Rooting the tree of life',short:'The root',stage:'luca',year:'1989–today',level:'Advanced',
 why:'Where the tree of life is rooted decides which branch came first and where complex cells fit; ancient duplicated genes give a way in.',
 prior:['luca'],references:['a7-gogarten-1989','a7-iwabe-1989','a7-gouy-2015','a7-woese-1990','a7-spang-2015','a7-williams-2020','a7-imachi-2020','a7-biology'],
 ids:['rooting-the-tree','rooting-the-tree-paralogs','rooting-the-tree-domains']});
LESSON({id:'viruses-origins',name:'The origins of viruses',short:'Viruses',stage:'luca',year:'1950s–today',level:'Core',
 why:'Viruses infect every branch of life, outnumber cells and leave their genes in ours, yet where they came from is still open.',
 prior:['luca','replicators'],references:['a7-forterre-2006','a7-krupovic-2019','a7-lascola-2003','a7-philippe-2013','a7-mi-2000','a7-feschotte-2012'],
 ids:['viruses-origins','viruses-origins-giants','viruses-origins-in-us']});

THREAD({id:'a7-inferring-the-past',name:'Inferring the deep past',ids:['oldest-evidence','luca','luca-dating','rooting-the-tree']});
THREAD({id:'a7-code',name:'From replicators to the code',ids:['ribozymes','error-threshold','genetic-code-origin','genetic-code-origin-cost']});
THREAD({id:'a7-energy',name:'Energy across membranes',ids:['proton-gradients','luca-portrait']});
THREAD({id:'a7-what-is-alive',name:'What counts as alive?',ids:['viruses-origins','viruses-origins-giants','defining-life']});
