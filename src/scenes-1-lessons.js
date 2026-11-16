/* Biology era 1 · Cells (1665–1900): lessons, sources and connections. */
SOURCE('hooke-1665',{title:'Robert Hooke (1665), Micrographia, Observation XVIII (cork)',url:'https://www.gutenberg.org/ebooks/15491'});
SOURCE('leeuwenhoek-1677',{title:'Antoni van Leeuwenhoek (1677), Observations concerning little animals, Philosophical Transactions 12: 821–831'});
SOURCE('abbe-1873',{title:'Ernst Abbe (1873), Beiträge zur Theorie des Mikroskops und der mikroskopischen Wahrnehmung, Archiv für mikroskopische Anatomie 9',url:'https://doi.org/10.1007/BF02956173'});
SOURCE('knoll-ruska-1932',{title:'Max Knoll & Ernst Ruska (1932), Das Elektronenmikroskop, Zeitschrift für Physik 78',url:'https://doi.org/10.1007/BF01342199'});
SOURCE('harris-1999',{title:'Henry Harris (1999), The Birth of the Cell. Yale University Press (on Schleiden, Schwann, Remak and Virchow)'});
SOURCE('schwann-1839',{title:'Theodor Schwann (1839), Mikroskopische Untersuchungen über die Uebereinstimmung in der Struktur und dem Wachsthum der Thiere und Pflanzen'});
SOURCE('virchow-1858',{title:'Rudolf Virchow (1858), Die Cellularpathologie',url:'https://en.wikipedia.org/wiki/Omnis_cellula_e_cellula'});
SOURCE('stanier-1962',{title:'Roger Stanier & C. B. van Niel (1962), The concept of a bacterium, Archiv für Mikrobiologie 42: 17–35',url:'https://doi.org/10.1007/BF00425185'});
SOURCE('haldane-1926',{title:'J. B. S. Haldane (1926), On being the right size, Harper’s Magazine',url:'https://en.wikipedia.org/wiki/On_Being_the_Right_Size'});
SOURCE('krogh-1919',{title:'August Krogh (1919), The number and distribution of capillaries in muscles, Journal of Physiology 52: 409–415',url:'https://doi.org/10.1113/jphysiol.1919.sp001839'});
SOURCE('evans-fung-1972',{title:'Evan Evans & Y.-C. Fung (1972), Improved measurements of the erythrocyte geometry, Microvascular Research 4: 335–347'});
SOURCE('fick-1855',{title:'Adolf Fick (1855), Über Diffusion, Annalen der Physik 170: 59–86',url:'https://doi.org/10.1002/andp.18551700105'});
SOURCE('einstein-1905',{title:'Albert Einstein (1905), On the movement of small particles suspended in a stationary liquid, Annalen der Physik 17',url:'https://doi.org/10.1002/andp.19053220806'});
SOURCE('vant-hoff-1887',{title:'J. H. van ’t Hoff (1887), Die Rolle des osmotischen Druckes in der Analogie zwischen Lösungen und Gasen, Zeitschrift für physikalische Chemie 1',url:'https://en.wikipedia.org/wiki/Osmotic_pressure'});
SOURCE('pfeffer-1877',{title:'Wilhelm Pfeffer (1877), Osmotische Untersuchungen',url:'https://en.wikipedia.org/wiki/Wilhelm_Pfeffer'});
SOURCE('flemming-1882',{title:'Walther Flemming (1882), Zellsubstanz, Kern und Zelltheilung',url:'https://en.wikipedia.org/wiki/Walther_Flemming'});
SOURCE('hartwell-1989',{title:'Leland Hartwell & Ted Weinert (1989), Checkpoints: controls that ensure the order of cell cycle events, Science 246: 629–634',url:'https://doi.org/10.1126/science.2683079'});
SOURCE('lane-1992',{title:'David Lane (1992), p53, guardian of the genome, Nature 358: 15–16',url:'https://doi.org/10.1038/358015a0'});
SOURCE('hayflick-1961',{title:'Leonard Hayflick & Paul Moorhead (1961), The serial cultivation of human diploid cell strains, Experimental Cell Research 25: 585–621',url:'https://doi.org/10.1016/0014-4827(61)90192-6'});
SOURCE('harley-1990',{title:'Calvin Harley, A. Bruce Futcher & Carol Greider (1990), Telomeres shorten during ageing of human fibroblasts, Nature 345: 458–460',url:'https://doi.org/10.1038/345458a0'});
SOURCE('skloot-2010',{title:'Rebecca Skloot (2010), The Immortal Life of Henrietta Lacks',url:'https://en.wikipedia.org/wiki/Henrietta_Lacks'});
SOURCE('monod-1949',{title:'Jacques Monod (1949), The growth of bacterial cultures, Annual Review of Microbiology 3: 371–394',url:'https://doi.org/10.1146/annurev.mi.03.100149.002103'});
SOURCE('pasteur-1861',{title:'Louis Pasteur (1861), Mémoire sur les corpuscules organisés qui existent dans l’atmosphère',url:'https://en.wikipedia.org/wiki/Swan_neck_flask'});
SOURCE('semmelweis-1861',{title:'Ignaz Semmelweis (1861), Die Ätiologie, der Begriff und die Prophylaxis des Kindbettfiebers (trans. K. Codell Carter, 1983)',url:'https://en.wikipedia.org/wiki/Historical_mortality_rates_of_puerperal_fever'});
SOURCE('koch-1876',{title:'Robert Koch (1876), Die Ätiologie der Milzbrand-Krankheit',url:'https://en.wikipedia.org/wiki/Koch%27s_postulates'});
SOURCE('falkow-1988',{title:'Stanley Falkow (1988), Molecular Koch’s postulates applied to microbial pathogenicity, Reviews of Infectious Diseases 10 (Suppl 2): S274–S276',url:'https://doi.org/10.1093/cid/10.Supplement_2.S274'});
SOURCE('physics-im',{title:'Physics In Motion: Brownian motion and diffusion from the physics side',url:'https://physics-in-motion.puter.site/',note:'Sister course.'});

LESSON({id:'microscopes',name:'Microscopes',short:'Microscopes',stage:'cells',year:'1665–1931',level:'Introduction',
 why:'Biology as we know it began when lenses showed a world too small to see, and its limits are set by resolution, not magnification.',
 prior:[],references:['hooke-1665','leeuwenhoek-1677','abbe-1873','knoll-ruska-1932'],ids:['microscopes','microscopes-scale','microscopes-cork']});
LESSON({id:'cell-theory',name:'Cell theory',short:'Cell theory',stage:'cells',year:'1838–1858',level:'Introduction',
 why:'Every living thing is made of cells, and every cell comes from another cell: the foundation the rest of biology builds on.',
 prior:['microscopes'],references:['harris-1999','schwann-1839','virchow-1858','stanier-1962'],ids:['cell-theory','cell-theory-division','cell-theory-kinds']});
LESSON({id:'surface-volume',name:'Surface and volume',short:'Surface/volume',stage:'cells',year:'1638–1926',level:'Core',
 why:'A simple geometric rule explains why cells are small, why big animals need lungs and blood, and why red cells are flat.',
 prior:['cell-theory'],references:['haldane-1926','krogh-1919','evans-fung-1972','fick-1855'],ids:['surface-volume','surface-volume-diffusion','surface-volume-shapes']});
LESSON({id:'diffusion-osmosis',name:'Diffusion and osmosis',short:'Osmosis',stage:'cells',year:'1828–1887',level:'Core',
 why:'Random molecular motion moves substances in and out of cells, and water follows dissolved particles across membranes.',
 prior:['surface-volume'],references:['fick-1855','einstein-1905','pfeffer-1877','vant-hoff-1887','physics-im'],ids:['diffusion-osmosis','diffusion-osmosis-membrane','diffusion-osmosis-cells']});
LESSON({id:'cell-division',name:'Cell division',short:'Cell division',stage:'cells',year:'1882–1990',level:'Core',
 why:'Cells copy their chromosomes and split in two; checkpoints keep the process honest, and losing them is a road to cancer.',
 prior:['cell-theory'],references:['flemming-1882','monod-1949','hartwell-1989','lane-1992','hayflick-1961','harley-1990','skloot-2010'],ids:['cell-division','cell-division-growth','cell-division-checkpoints','cell-division-hayflick']});
LESSON({id:'germ-theory',name:'Germ theory',short:'Germ theory',stage:'cells',year:'1847–1890',level:'Core',
 why:'Microbes, not bad air or spontaneous generation, cause spoilage and many diseases; the idea transformed medicine.',
 prior:['microscopes','cell-theory'],references:['pasteur-1861','semmelweis-1861','koch-1876','falkow-1988'],ids:['germ-theory','germ-theory-semmelweis','germ-theory-koch']});

THREAD({id:'b1-size',name:'Size sets the rules',ids:['surface-volume','surface-volume-diffusion','circulation-heart','scaling-laws']});
THREAD({id:'b1-division',name:'From dividing cells to copied DNA',ids:['cell-division','cell-division-checkpoints','replication','mutation']});
THREAD({id:'b1-microbes',name:'Microbes and medicine',ids:['germ-theory','germ-theory-koch','immune-system','vaccines-herd','antibiotic-resistance']});
THREAD({id:'b1-membranes',name:'Across the membrane',ids:['diffusion-osmosis','diffusion-osmosis-membrane','membranes-pumps']});
THREAD({id:'b1-growth',name:'Doubling and its limits',ids:['cell-division-growth','logistic-growth','evolution-in-the-lab']});
