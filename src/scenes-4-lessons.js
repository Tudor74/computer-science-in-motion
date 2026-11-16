/* Chemistry era 4 · Bonds and shapes: lessons, sources and connections. */
SOURCE('c4-lewis-1916',{title:'Lewis, G. N. (1916). The atom and the molecule. Journal of the American Chemical Society 38, 762–785.',url:'https://doi.org/10.1021/ja02261a002'});
SOURCE('c4-langmuir-1919',{title:'Langmuir, I. (1919). The arrangement of electrons in atoms and molecules. Journal of the American Chemical Society 41, 868–934.'});
SOURCE('c4-kohler-1971',{title:'Kohler, R. E. (1971). The origin of G. N. Lewis’s theory of the shared pair bond. Historical Studies in the Physical Sciences 3, 343–376.'});
SOURCE('c4-pauling-1931',{title:'Pauling, L. (1931). The nature of the chemical bond. Journal of the American Chemical Society 53, 1367–1400.'});
SOURCE('c4-pauling-1932',{title:'Pauling, L. (1932). The nature of the chemical bond. IV. The energy of single bonds and the relative electronegativity of atoms. Journal of the American Chemical Society 54, 3570–3582.'});
SOURCE('c4-pauling-book',{title:'Pauling, L. (1939; 3rd edn 1960). The Nature of the Chemical Bond. Cornell University Press.'});
SOURCE('c4-born-1919',{title:'Born, M. (1919). Eine thermochemische Anwendung der Gittertheorie. Verhandlungen der Deutschen Physikalischen Gesellschaft 21, 13–24.'});
SOURCE('c4-haber-1919',{title:'Haber, F. (1919). Betrachtungen zur Theorie der Wärmetönung. Verhandlungen der Deutschen Physikalischen Gesellschaft 21, 750–768.'});
SOURCE('c4-crc',{title:'Haynes, W. M. (ed.). CRC Handbook of Chemistry and Physics (bond energies, melting and boiling points, structures).'});
SOURCE('c4-sidgwick-1940',{title:'Sidgwick, N. V. & Powell, H. M. (1940). Bakerian Lecture: Stereochemical types and valency groups. Proceedings of the Royal Society A 176, 153–180.'});
SOURCE('c4-gillespie-1957',{title:'Gillespie, R. J. & Nyholm, R. S. (1957). Inorganic stereochemistry. Quarterly Reviews, Chemical Society 11, 339–380.'});
SOURCE('c4-gillespie-1991',{title:'Gillespie, R. J. & Hargittai, I. (1991). The VSEPR Model of Molecular Geometry. Allyn & Bacon.'});
SOURCE('c4-gillespie-2001',{title:'Gillespie, R. J. & Popelier, P. L. A. (2001). Chemical Bonding and Molecular Geometry. Oxford University Press.'});
SOURCE('c4-heitler-1927',{title:'Heitler, W. & London, F. (1927). Wechselwirkung neutraler Atome und homöopolare Bindung nach der Quantenmechanik. Zeitschrift für Physik 44, 455–472.'});
SOURCE('c4-mulliken-1932',{title:'Mulliken, R. S. (1932). Electronic structures of polyatomic molecules and valence. Physical Review 40, 55–62.'});
SOURCE('c4-lennard-jones-1929',{title:'Lennard-Jones, J. E. (1929). The electronic structure of some diatomic molecules. Transactions of the Faraday Society 25, 668–686.'});
SOURCE('c4-turner-1970',{title:'Turner, D. W., Baker, C., Baker, A. D. & Brundle, C. R. (1970). Molecular Photoelectron Spectroscopy. Wiley-Interscience.'});
SOURCE('c4-grushow-2011',{title:'Grushow, A. (2011). Is it time to retire the hybrid atomic orbital? Journal of Chemical Education 88, 860–862.'});
SOURCE('c4-latimer-1920',{title:'Latimer, W. M. & Rodebush, W. H. (1920). Polarity and ionization from the standpoint of the Lewis theory of valence. Journal of the American Chemical Society 42, 1419–1433.'});
SOURCE('c4-arunan-2011',{title:'Arunan, E. et al. (2011). Definition of the hydrogen bond (IUPAC Recommendations 2011). Pure and Applied Chemistry 83, 1637–1641.'});
SOURCE('c4-kell-1975',{title:'Kell, G. S. (1975). Density, thermal expansivity, and compressibility of liquid water from 0° to 150 °C. Journal of Chemical and Engineering Data 20, 97–105.'});
SOURCE('c4-bernal-1933',{title:'Bernal, J. D. & Fowler, R. H. (1933). A theory of water and ionic solution, with particular reference to hydrogen and hydroxyl ions. Journal of Chemical Physics 1, 515–548.'});
SOURCE('c4-marmur-1962',{title:'Marmur, J. & Doty, P. (1962). Determination of the base composition of deoxyribonucleic acid from its thermal denaturation temperature. Journal of Molecular Biology 5, 109–118.'});
SOURCE('c4-yakovchuk-2006',{title:'Yakovchuk, P., Protozanova, E. & Frank-Kamenetskii, M. D. (2006). Base-stacking and base-pairing contributions into thermal stability of the DNA double helix. Nucleic Acids Research 34, 564–574.'});
SOURCE('c4-watson-crick-1953',{title:'Watson, J. D. & Crick, F. H. C. (1953). Molecular structure of nucleic acids. Nature 171, 737–738.'});
SOURCE('c4-allred-1961',{title:'Allred, A. L. (1961). Electronegativity values from thermochemical data. Journal of Inorganic and Nuclear Chemistry 17, 215–221.'});
SOURCE('c4-mulliken-1934',{title:'Mulliken, R. S. (1934). A new electroaffinity scale. Journal of Chemical Physics 2, 782–793.'});
SOURCE('c4-allen-1989',{title:'Allen, L. C. (1989). Electronegativity is the average one-electron energy of the valence-shell electrons in ground-state free atoms. Journal of the American Chemical Society 111, 9003–9014.'});
SOURCE('c4-biology',{title:'Biology In Motion: the double helix and base pairing, from the biology side.',url:'https://biology-in-motion.puter.site/'});
SOURCE('c4-physics',{title:'Physics In Motion: quantum mechanics and the electron, from the physics side.',url:'https://physics-in-motion.puter.site/'});

LESSON({id:'lewis-structures',name:'Lewis structures',short:'Lewis structures',stage:'bonding',year:'1916',level:'Introduction',
 why:'Lewis’s idea that a bond is a shared pair of electrons, with eight electrons around most atoms, still lets chemists sketch almost any molecule in seconds. Formal charge picks the best sketch; resonance admits when no single sketch is right.',
 prior:['electron-shells','periodic-table'],references:['c4-lewis-1916','c4-langmuir-1919','c4-kohler-1971','c4-pauling-book'],
 ids:['lewis-structures','lewis-structures-cube','lewis-structures-formal-charge']});
LESSON({id:'ionic-covalent',name:'Ionic and covalent bonds',short:'Ionic–covalent',stage:'bonding',year:'1916–1932',level:'Core',
 why:'Sharing and transferring electrons are two ends of one scale. The Born–Haber cycle shows why ionic crystals form even though making the ions costs energy, and bond type predicts melting and conduction.',
 prior:['lewis-structures','electrolysis'],references:['c4-pauling-1932','c4-pauling-book','c4-born-1919','c4-haber-1919','c4-crc'],
 ids:['ionic-covalent','ionic-covalent-born-haber','ionic-covalent-properties']});
LESSON({id:'vsepr-shapes',name:'VSEPR shapes',short:'VSEPR',stage:'bonding',year:'1940–1957',level:'Core',
 why:'Counting the groups of electrons around a central atom predicts a molecule’s shape, and shape decides how molecules smell, stack, react and fit into enzymes.',
 prior:['lewis-structures'],references:['c4-sidgwick-1940','c4-gillespie-1957','c4-gillespie-1991','c4-gillespie-2001','c4-crc'],
 ids:['vsepr-shapes','vsepr-shapes-domains','vsepr-shapes-angles']});
LESSON({id:'orbitals-hybrids',name:'Orbitals, hybrids and molecular orbitals',short:'Orbitals',stage:'bonding',year:'1927–1932',level:'Further',
 why:'Quantum mechanics replaced Lewis’s dots with waves. Pauling’s hybrids explain shapes; molecular orbital theory explains what hybrids cannot, such as oxygen’s magnetism and methane’s two ionisation energies.',
 prior:['lewis-structures','vsepr-shapes','electron-shells'],references:['c4-heitler-1927','c4-pauling-1931','c4-mulliken-1932','c4-lennard-jones-1929','c4-turner-1970','c4-grushow-2011','c4-physics'],
 ids:['orbitals-hybrids','orbitals-hybrids-methane','orbitals-hybrids-mo']});
LESSON({id:'hydrogen-bonds',name:'Hydrogen bonds',short:'Hydrogen bonds',stage:'bonding',year:'1920–1962',level:'Core',
 why:'A weak attraction with enormous consequences: liquid water at room temperature, ice that floats, and DNA strands that hold together yet can be pulled apart.',
 prior:['electronegativity','vsepr-shapes'],references:['c4-latimer-1920','c4-arunan-2011','c4-kell-1975','c4-bernal-1933','c4-watson-crick-1953','c4-marmur-1962','c4-yakovchuk-2006','c4-biology','c4-crc'],
 ids:['hydrogen-bonds','hydrogen-bonds-ice','hydrogen-bonds-dna']});
LESSON({id:'electronegativity',name:'Electronegativity',short:'Electronegativity',stage:'bonding',year:'1932–1989',level:'Core',
 why:'One number per element predicts which way a bond is polarised. Pauling built it from bond energies, Mulliken from atomic energies, and the two scales broadly agree.',
 prior:['periodic-table','ionic-covalent'],references:['c4-pauling-1932','c4-allred-1961','c4-mulliken-1934','c4-allen-1989','c4-crc'],
 ids:['electronegativity','electronegativity-pauling','electronegativity-scales']});

THREAD({id:'c4-pairs',name:'Electrons in pairs',ids:['lewis-structures','lewis-structures-cube','vsepr-shapes','orbitals-hybrids-mo','electron-shells']});
THREAD({id:'c4-water',name:'Water’s strange behaviour',ids:['hydrogen-bonds','hydrogen-bonds-ice','vsepr-shapes-angles','acids-bases']});
THREAD({id:'c4-polarity',name:'From electronegativity to bond type',ids:['electronegativity','electronegativity-pauling','ionic-covalent','ionic-covalent-properties']});
THREAD({id:'c4-models',name:'Models with limits',ids:['lewis-structures-cube','orbitals-hybrids-methane','vsepr-shapes-angles','computational-chemistry']});
