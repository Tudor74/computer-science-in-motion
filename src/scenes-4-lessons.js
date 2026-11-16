/* Abiogenesis era 4 · An RNA world?: lessons, sources and connections. */
SOURCE('a4-crick-1968',{title:'Crick, F. H. C. (1968). The origin of the genetic code. Journal of Molecular Biology 38, 367–379.'});
SOURCE('a4-orgel-1968',{title:'Orgel, L. E. (1968). Evolution of the genetic apparatus. Journal of Molecular Biology 38, 381–393.'});
SOURCE('a4-gilbert-1986',{title:'Gilbert, W. (1986). Origin of life: the RNA world. Nature 319, 618.'});
SOURCE('a4-kruger-1982',{title:'Kruger, K. et al. (1982). Self-splicing RNA: autoexcision and autocyclization of the ribosomal RNA intervening sequence of Tetrahymena. Cell 31, 147–157.'});
SOURCE('a4-guerrier-1983',{title:'Guerrier-Takada, C., Gardiner, K., Marsh, T., Pace, N. & Altman, S. (1983). The RNA moiety of ribonuclease P is the catalytic subunit of the enzyme. Cell 35, 849–857.'});
SOURCE('a4-zaug-1986',{title:'Zaug, A. J. & Cech, T. R. (1986). The intervening sequence RNA of Tetrahymena is an enzyme. Science 231, 470–475.'});
SOURCE('a4-nissen-2000',{title:'Nissen, P., Hansen, J., Ban, N., Moore, P. B. & Steitz, T. A. (2000). The structural basis of ribosome activity in peptide bond synthesis. Science 289, 920–930.'});
SOURCE('a4-mills-1967',{title:'Mills, D. R., Peterson, R. L. & Spiegelman, S. (1967). An extracellular Darwinian experiment with a self-duplicating nucleic acid molecule. PNAS 58, 217–224.'});
SOURCE('a4-lincoln-2009',{title:'Lincoln, T. A. & Joyce, G. F. (2009). Self-sustained replication of an RNA enzyme. Science 323, 1229–1232.'});
SOURCE('a4-johnston-2001',{title:'Johnston, W. K., Unrau, P. J., Lawrence, M. S., Glasner, M. E. & Bartel, D. P. (2001). RNA-catalyzed RNA polymerization: accurate and general RNA-templated primer extension. Science 292, 1319–1325.'});
SOURCE('a4-wochner-2011',{title:'Wochner, A., Attwater, J., Coulson, A. & Holliger, P. (2011). Ribozyme-catalyzed transcription of an active ribozyme. Science 332, 209–212.'});
SOURCE('a4-attwater-2013',{title:'Attwater, J., Wochner, A. & Holliger, P. (2013). In-ice evolution of RNA polymerase ribozyme activity. Nature Chemistry 5, 1011–1018.'});
SOURCE('a4-horning-2016',{title:'Horning, D. P. & Joyce, G. F. (2016). Amplification of RNA by an RNA polymerase ribozyme. PNAS 113, 9786–9791.'});
SOURCE('a4-eigen-1971',{title:'Eigen, M. (1971). Selforganization of matter and the evolution of biological macromolecules. Naturwissenschaften 58, 465–523.'});
SOURCE('a4-eigen-schuster-1977',{title:'Eigen, M. & Schuster, P. (1977). The hypercycle: a principle of natural self-organization. Naturwissenschaften 64, 541–565.'});
SOURCE('a4-maynard-smith-1979',{title:'Maynard Smith, J. (1979). Hypercycles and the origin of life. Nature 280, 445–446.'});
SOURCE('a4-drake-1991',{title:'Drake, J. W. (1991). A constant rate of spontaneous mutation in DNA-based microbes. PNAS 88, 7160–7164.'});
SOURCE('a4-crotty-2001',{title:'Crotty, S., Cameron, C. E. & Andino, R. (2001). RNA virus error catastrophe: direct molecular test by using ribavirin. PNAS 98, 6895–6900.'});
SOURCE('a4-powner-2009',{title:'Powner, M. W., Gerland, B. & Sutherland, J. D. (2009). Synthesis of activated pyrimidine ribonucleotides in prebiotically plausible conditions. Nature 459, 239–242.'});
SOURCE('a4-patel-2015',{title:'Patel, B. H., Percivalle, C., Ritson, D. J., Duffy, C. D. & Sutherland, J. D. (2015). Common origins of RNA, protein and lipid precursors in a cyanosulfidic protometabolism. Nature Chemistry 7, 301–307.'});
SOURCE('a4-becker-2019',{title:'Becker, S. et al. (2019). Unified prebiotically plausible synthesis of pyrimidine and purine RNA ribonucleotides. Science 366, 76–82.'});
SOURCE('a4-ferris-1996',{title:'Ferris, J. P., Hill, A. R., Liu, R. & Orgel, L. E. (1996). Synthesis of long prebiotic oligomers on mineral surfaces. Nature 381, 59–61.'});
SOURCE('a4-orgel-2004',{title:'Orgel, L. E. (2004). Prebiotic chemistry and the origin of the RNA world. Critical Reviews in Biochemistry and Molecular Biology 39, 99–123.'});
SOURCE('a4-biology',{title:'Biology In Motion: the RNA world and the error threshold in the context of all of biology.',url:'https://biology-in-motion.puter.site/'});

LESSON({id:'ribozymes',name:'Ribozymes',short:'Ribozymes',stage:'rna',year:'1967–2000',level:'Introduction',
 why:'RNA can both carry information and catalyse reactions, which could break the chicken-and-egg loop between DNA and proteins.',
 prior:['miller-urey','oparin-haldane'],references:['a4-crick-1968','a4-orgel-1968','a4-gilbert-1986','a4-kruger-1982','a4-guerrier-1983','a4-zaug-1986','a4-nissen-2000','a4-biology'],
 ids:['ribozymes','ribozymes-splice','ribozymes-ribosome']});
LESSON({id:'replicators',name:'Replicators',short:'Replicators',stage:'rna',year:'1965–2018',level:'Core',
 why:'Molecules that copy themselves, or each other, can evolve by natural selection in a test tube: the step from chemistry to biology.',
 prior:['ribozymes'],references:['a4-mills-1967','a4-lincoln-2009','a4-johnston-2001','a4-wochner-2011','a4-attwater-2013','a4-horning-2016'],
 ids:['replicators','replicators-cross','replicators-polymerase']});
LESSON({id:'error-threshold',name:'The error threshold',short:'Error threshold',stage:'rna',year:'1971–today',level:'Advanced',
 why:'Copying errors limit how much information a replicator can keep, which sets a hard puzzle for the first genes.',
 prior:['replicators'],references:['a4-eigen-1971','a4-eigen-schuster-1977','a4-maynard-smith-1979','a4-drake-1991','a4-crotty-2001'],
 ids:['error-threshold','error-threshold-paradox','error-threshold-hypercycle']});
LESSON({id:'nucleotide-synthesis',name:'Making nucleotides',short:'Nucleotides',stage:'rna',year:'1861–2019',level:'Core',
 why:'An RNA world needs its letters to form and join without enzymes; new routes have made this far less implausible.',
 prior:['ribozymes','miller-urey'],references:['a4-powner-2009','a4-patel-2015','a4-becker-2019','a4-ferris-1996','a4-orgel-2004'],
 ids:['nucleotide-synthesis','nucleotide-synthesis-cyanosulfidic','nucleotide-synthesis-wetdry']});

THREAD({id:'a4-selection',name:'Selection without cells',ids:['replicators','replicators-cross','error-threshold','evolution-in-the-lab']});
THREAD({id:'a4-cooperation',name:'Cooperation and compartments',ids:['error-threshold-hypercycle','autocatalytic-sets','protocells','membrane-growth']});
THREAD({id:'a4-chemistry',name:'Chemistry of the first molecules',ids:['miller-urey','meteorite-chemistry','nucleotide-synthesis','nucleotide-synthesis-wetdry','hydrothermal-vents']});
