/* Biology era 3 · Heredity: lessons, sources and connections. */
SOURCE('b3-mendel-1866',{title:'Mendel, G. (1866). Versuche über Pflanzen-Hybriden (Experiments on Plant Hybridization). Verhandlungen des naturforschenden Vereines in Brünn 4, 3–47.',url:'https://en.wikipedia.org/wiki/Experiments_on_Plant_Hybridization'});
SOURCE('b3-fisher-1936',{title:'Fisher, R. A. (1936). Has Mendel’s work been rediscovered? Annals of Science 1, 115–137.'});
SOURCE('b3-franklin-2008',{title:'Franklin, A., Edwards, A. W. F., Fairbanks, D. J., Hartl, D. L. & Seidenfeld, T. (2008). Ending the Mendel–Fisher Controversy. University of Pittsburgh Press.'});
SOURCE('b3-punnett-1905',{title:'Punnett, R. C. (1905). Mendelism. Cambridge: Macmillan and Bowes.'});
SOURCE('b3-bateson-1909',{title:'Bateson, W. (1909). Mendel’s Principles of Heredity. Cambridge University Press.'});
SOURCE('b3-landsteiner-1901',{title:'Landsteiner, K. (1901). Über Agglutinationserscheinungen normalen menschlichen Blutes. Wiener klinische Wochenschrift 14, 1132–1134.'});
SOURCE('b3-bernstein-1924',{title:'Bernstein, F. (1924). Ergebnisse einer biostatistischen zusammenfassenden Betrachtung über die erblichen Blutstrukturen des Menschen. Klinische Wochenschrift 3, 1495–1497.'});
SOURCE('b3-sutton-1903',{title:'Sutton, W. S. (1903). The chromosomes in heredity. Biological Bulletin 4, 231–251.'});
SOURCE('b3-stevens-1905',{title:'Stevens, N. M. (1905). Studies in spermatogenesis with especial reference to the “accessory chromosome”. Carnegie Institution of Washington Publication 36.'});
SOURCE('b3-morgan-1910',{title:'Morgan, T. H. (1910). Sex limited inheritance in Drosophila. Science 32, 120–122.',url:'https://doi.org/10.1126/science.32.812.120'});
SOURCE('b3-sturtevant-1913',{title:'Sturtevant, A. H. (1913). The linear arrangement of six sex-linked factors in Drosophila, as shown by their mode of association. Journal of Experimental Zoology 14, 43–59.',url:'https://doi.org/10.1002/jez.1400140104'});
SOURCE('b3-haldane-1919',{title:'Haldane, J. B. S. (1919). The combination of linkage values and the calculation of distances between the loci of linked factors. Journal of Genetics 8, 299–309.'});
SOURCE('b3-hardy-1908',{title:'Hardy, G. H. (1908). Mendelian proportions in a mixed population. Science 28, 49–50.',url:'https://doi.org/10.1126/science.28.706.49'});
SOURCE('b3-weinberg-1908',{title:'Weinberg, W. (1908). Über den Nachweis der Vererbung beim Menschen. Jahreshefte des Vereins für vaterländische Naturkunde in Württemberg 64, 368–382.'});
SOURCE('b3-farrell-2008',{title:'Farrell, P. M. (2008). The prevalence of cystic fibrosis in the European Union. Journal of Cystic Fibrosis 7, 450–453.'});
SOURCE('b3-wright-1922',{title:'Wright, S. (1922). Coefficients of inbreeding and relationship. American Naturalist 56, 330–338.'});
SOURCE('b3-wright-1931',{title:'Wright, S. (1931). Evolution in Mendelian populations. Genetics 16, 97–159.'});
SOURCE('b3-fisher-1930',{title:'Fisher, R. A. (1930). The Genetical Theory of Natural Selection. Oxford: Clarendon Press.'});
SOURCE('b3-kimura-1968',{title:'Kimura, M. (1968). Evolutionary rate at the molecular level. Nature 217, 624–626.',url:'https://doi.org/10.1038/217624a0'});
SOURCE('b3-buri-1956',{title:'Buri, P. (1956). Gene frequency in small populations of mutant Drosophila. Evolution 10, 367–402.'});
SOURCE('b3-hoelzel-1993',{title:'Hoelzel, A. R., Halley, J., O’Brien, S. J. et al. (1993). Elephant seal genetic variation and the use of simulation models to investigate historical population bottlenecks. Journal of Heredity 84, 443–449.'});
SOURCE('b3-mckusick-1964',{title:'McKusick, V. A., Egeland, J. A., Eldridge, R. & Krusen, D. E. (1964). Dwarfism in the Amish I. The Ellis–van Creveld syndrome. Bulletin of the Johns Hopkins Hospital 115, 306–336.'});
SOURCE('b3-nilsson-ehle-1909',{title:'Nilsson-Ehle, H. (1909). Kreuzungsuntersuchungen an Hafer und Weizen. Lunds Universitets Årsskrift.'});
SOURCE('b3-fisher-1918',{title:'Fisher, R. A. (1918). The correlation between relatives on the supposition of Mendelian inheritance. Transactions of the Royal Society of Edinburgh 52, 399–433.'});
SOURCE('b3-galton-1886',{title:'Galton, F. (1886). Regression towards mediocrity in hereditary stature. Journal of the Anthropological Institute 15, 246–263.'});
SOURCE('b3-lewontin-1970',{title:'Lewontin, R. C. (1970). Race and intelligence. Bulletin of the Atomic Scientists 26(3), 2–8.'});
SOURCE('b3-visscher-2008',{title:'Visscher, P. M., Hill, W. G. & Wray, N. R. (2008). Heritability in the genomics era: concepts and misconceptions. Nature Reviews Genetics 9, 255–266.',url:'https://doi.org/10.1038/nrg2322'});
SOURCE('b3-mind',{title:'Mind In Motion: Bayes’ rule and base rates, the reasoning behind the test-cross.',url:'https://mind-in-motion.puter.site/',note:'A sister course in the In Motion family.'});

LESSON({id:'mendel-crosses',name:'Mendel’s crosses',short:'Mendel',stage:'heredity',year:'1856–1866',level:'Introduction',
 why:'Counting thousands of peas showed that heredity comes in discrete factors that are hidden and reappear, not in a blend.',
 prior:['natural-selection','cell-theory'],references:['b3-mendel-1866','b3-fisher-1936','b3-franklin-2008'],
 ids:['mendel-crosses','mendel-crosses-seven','mendel-crosses-dihybrid']});
LESSON({id:'punnett-squares',name:'Punnett squares',short:'Punnett',stage:'heredity',year:'1905',level:'Core',
 why:'A simple grid turns Mendel’s rules into predictions, and shows what dominance, codominance and test-crosses mean.',
 prior:['mendel-crosses'],references:['b3-punnett-1905','b3-bateson-1909','b3-landsteiner-1901','b3-bernstein-1924','b3-mind'],
 ids:['punnett-squares','punnett-squares-testcross','punnett-squares-blood']});
LESSON({id:'chromosomes-linkage',name:'Chromosomes and linkage',short:'Chromosomes',stage:'heredity',year:'1902–1913',level:'Core',
 why:'Mendel’s factors turned out to sit on chromosomes: they separate in meiosis, can be tied to sex, and can be mapped in a line.',
 prior:['cell-division','punnett-squares'],references:['b3-sutton-1903','b3-stevens-1905','b3-morgan-1910','b3-sturtevant-1913','b3-haldane-1919'],
 ids:['chromosomes-linkage','chromosomes-linkage-whiteeye','chromosomes-linkage-map']});
LESSON({id:'hardy-weinberg',name:'Hardy–Weinberg',short:'Hardy–Weinberg',stage:'heredity',year:'1908',level:'Core',
 why:'Moving from families to whole populations shows that genes alone do not change frequencies, and lets us count hidden carriers.',
 prior:['punnett-squares','natural-selection'],references:['b3-hardy-1908','b3-weinberg-1908','b3-farrell-2008','b3-wright-1922'],
 ids:['hardy-weinberg','hardy-weinberg-carriers','hardy-weinberg-inbreeding']});
LESSON({id:'genetic-drift',name:'Genetic drift',short:'Drift',stage:'heredity',year:'1930–1968',level:'Core',
 why:'Chance alone changes small populations: alleles are lost or fixed without any selection.',
 prior:['hardy-weinberg'],references:['b3-wright-1931','b3-fisher-1930','b3-kimura-1968','b3-buri-1956','b3-hoelzel-1993','b3-mckusick-1964'],
 ids:['genetic-drift','genetic-drift-buri','genetic-drift-bottleneck']});
LESSON({id:'quantitative-traits',name:'Quantitative traits',short:'Many genes',stage:'heredity',year:'1886–1918',level:'Advanced',
 why:'Many small Mendelian effects make smooth variation; heritability measures it, and is widely misread.',
 prior:['mendel-crosses','hardy-weinberg','artificial-selection'],references:['b3-nilsson-ehle-1909','b3-fisher-1918','b3-galton-1886','b3-lewontin-1970','b3-visscher-2008'],
 ids:['quantitative-traits','quantitative-traits-regression','quantitative-traits-heritability']});

THREAD({id:'b3-synthesis',name:'Mendel meets Darwin',ids:['natural-selection','mendel-crosses','hardy-weinberg','quantitative-traits','finches-beaks']});
THREAD({id:'b3-chance',name:'Chance in heredity',ids:['mendel-crosses','genetic-drift','genetic-drift-buri','speciation','evolution-in-the-lab']});
THREAD({id:'b3-factors-to-molecules',name:'From factors to molecules',ids:['cell-division','chromosomes-linkage','chromosomes-linkage-map','double-helix','sequencing']});
THREAD({id:'b3-health',name:'Genes and health',ids:['hardy-weinberg-carriers','hardy-weinberg-inbreeding','mutation','crispr']});
