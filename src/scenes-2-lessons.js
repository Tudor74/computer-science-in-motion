/* Senses era 2 · Seeing: lessons, sources and connections. */
SOURCE('s2-mach-1865',{title:'Mach, E. (1865). Über die Wirkung der räumlichen Vertheilung des Lichtreizes auf die Netzhaut. Sitzungsberichte der Akademie der Wissenschaften Wien 52, 303–322.'});
SOURCE('s2-ratliff-1965',{title:'Ratliff, F. (1965). Mach Bands: Quantitative Studies on Neural Networks in the Retina. Holden-Day.'});
SOURCE('s2-hartline-1956',{title:'Hartline, H. K., Wagner, H. G. & Ratliff, F. (1956). Inhibition in the eye of Limulus. Journal of General Physiology 39, 651–673.',url:'https://doi.org/10.1085/jgp.39.5.651'});
SOURCE('s2-chevreul',{title:'Chevreul, M. E. (1839). De la loi du contraste simultané des couleurs.',url:'https://en.wikipedia.org/wiki/Michel_Eug%C3%A8ne_Chevreul'});
SOURCE('s2-mind-rf',{title:'Mind In Motion: receptive fields and the Hermann grid, from the brain’s side.',url:'https://mind-in-motion.puter.site/'});
SOURCE('s2-wheatstone-1838',{title:'Wheatstone, C. (1838). Contributions to the physiology of vision, Part the first: on some remarkable, and hitherto unobserved, phenomena of binocular vision. Philosophical Transactions of the Royal Society 128, 371–394.',url:'https://doi.org/10.1098/rstl.1838.0019'});
SOURCE('s2-julesz-1971',{title:'Julesz, B. (1971). Foundations of Cyclopean Perception. University of Chicago Press.'});
SOURCE('s2-cutting-vishton',{title:'Cutting, J. E. & Vishton, P. M. (1995). Perceiving layout and knowing distances. In W. Epstein & S. Rogers (eds), Perception of Space and Motion, 69–117. Academic Press.'});
SOURCE('s2-howard-rogers',{title:'Howard, I. P. & Rogers, B. J. (2012). Perceiving in Depth. Oxford University Press.'});
SOURCE('s2-hci-depth',{title:'HCI In Motion: depth cues in virtual reality displays.',url:'https://hci-in-motion.puter.site/'});
SOURCE('s2-wertheimer-1912',{title:'Wertheimer, M. (1912). Experimentelle Studien über das Sehen von Bewegung. Zeitschrift für Psychologie 61, 161–265.'});
SOURCE('s2-mather-1998',{title:'Mather, G., Verstraten, F. & Anstis, S. (eds) (1998). The Motion Aftereffect: A Modern Perspective. MIT Press.'});
SOURCE('s2-newsome-1988',{title:'Newsome, W. T. & Paré, E. B. (1988). A selective impairment of motion perception following lesions of the middle temporal visual area (MT). Journal of Neuroscience 8, 2201–2211.'});
SOURCE('s2-zihl-1983',{title:'Zihl, J., von Cramon, D. & Mai, N. (1983). Selective disturbance of movement vision after bilateral brain damage. Brain 106, 313–340.'});
SOURCE('s2-segall-1966',{title:'Segall, M. H., Campbell, D. T. & Herskovits, M. J. (1966). The Influence of Culture on Visual Perception. Bobbs-Merrill.'});
SOURCE('s2-henrich-2010',{title:'Henrich, J., Heine, S. J. & Norenzayan, A. (2010). The weirdest people in the world? Behavioral and Brain Sciences 33, 61–83.',url:'https://doi.org/10.1017/S0140525X0999152X'});
SOURCE('s2-defockert-2007',{title:'de Fockert, J., Davidoff, J., Fagot, J., Parron, C. & Goldstein, J. (2007). More accurate size contrast judgments in the Ebbinghaus illusion by a remote culture. JEP: Human Perception and Performance 33, 738–742.'});
SOURCE('s2-adelson',{title:'Adelson, E. H. (1995). Checker shadow illusion.',url:'https://en.wikipedia.org/wiki/Checker_shadow_illusion'});
SOURCE('s2-dress',{title:'Lafer-Sousa, R., Hermann, K. L. & Conway, B. R. (2015). Striking individual differences in color perception uncovered by ‘the dress’ photograph. Current Biology 25, R545–R546.',url:'https://doi.org/10.1016/j.cub.2015.04.053'});
SOURCE('s2-kanwisher-1997',{title:'Kanwisher, N., McDermott, J. & Chun, M. M. (1997). The fusiform face area: a module in human extrastriate cortex specialized for face perception. Journal of Neuroscience 17, 4302–4311.'});
SOURCE('s2-thompson-1980',{title:'Thompson, P. (1980). Margaret Thatcher: a new illusion. Perception 9, 483–484.'});
SOURCE('s2-tsao-2006',{title:'Tsao, D. Y., Freiwald, W. A., Tootell, R. B. H. & Livingstone, M. S. (2006). A cortical region consisting entirely of face-selective cells. Science 311, 670–674.'});
SOURCE('s2-cfmt',{title:'Duchaine, B. & Nakayama, K. (2006). The Cambridge Face Memory Test. Neuropsychologia 44, 576–585.'});
SOURCE('s2-russell-2009',{title:'Russell, R., Duchaine, B. & Nakayama, K. (2009). Super-recognizers: people with extraordinary face recognition ability. Psychonomic Bulletin & Review 16, 252–257.'});
SOURCE('s2-mariotte',{title:'Mariotte, E. (1668). Nouvelle découverte touchant la veüe.',url:'https://en.wikipedia.org/wiki/Blind_spot_(vision)'});
SOURCE('s2-ramachandran-1992',{title:'Ramachandran, V. S. (1992). Blind spots. Scientific American 266(5), 86–91.'});
SOURCE('s2-komatsu-2006',{title:'Komatsu, H. (2006). The neural mechanisms of perceptual filling-in. Nature Reviews Neuroscience 7, 220–231.'});
SOURCE('s2-franze-2007',{title:'Franze, K. et al. (2007). Müller cells are living optical fibers in the vertebrate retina. PNAS 104, 8287–8292.',url:'https://doi.org/10.1073/pnas.0611180104'});

LESSON({id:'lateral-inhibition',name:'Lateral inhibition',short:'Edges',stage:'seeing',year:'1865–1956',level:'Introduction',
 why:'Cells that hold back their neighbours sharpen edges, which is why uniform greys look banded and grey looks lighter on black.',
 prior:['photoreceptors','opponent-colour'],references:['s2-mach-1865','s2-ratliff-1965','s2-hartline-1956','s2-chevreul','s2-mind-rf'],
 ids:['lateral-inhibition','lateral-inhibition-limulus','lateral-inhibition-contrast']});
LESSON({id:'depth-stereo',name:'Depth and stereo vision',short:'Depth',stage:'seeing',year:'1838–1971',level:'Core',
 why:'A flat image becomes a 3D world by combining cues, and two eyes add disparity, which alone can create depth.',
 prior:['eye-optics','lateral-inhibition'],references:['s2-wheatstone-1838','s2-julesz-1971','s2-cutting-vishton','s2-howard-rogers','s2-hci-depth'],
 ids:['depth-stereo','depth-stereo-disparity','depth-stereo-random-dot']});
LESSON({id:'motion-perception',name:'Seeing motion',short:'Motion',stage:'seeing',year:'1834–1988',level:'Core',
 why:'Motion is computed, not copied: we see it where there is none, see stillness drift after adaptation, and pool many dots into one direction.',
 prior:['lateral-inhibition'],references:['s2-wertheimer-1912','s2-mather-1998','s2-newsome-1988','s2-zihl-1983'],
 ids:['motion-perception','motion-perception-aftereffect','motion-perception-coherence']});
LESSON({id:'visual-illusions',name:'Visual illusions',short:'Illusions',stage:'seeing',year:'1889–2015',level:'Core',
 why:'Illusions show the assumptions vision makes about size, light and colour, and how those assumptions can differ between people.',
 prior:['lateral-inhibition','depth-stereo','trichromacy'],references:['s2-segall-1966','s2-henrich-2010','s2-defockert-2007','s2-adelson','s2-dress'],
 ids:['visual-illusions','visual-illusions-ebbinghaus','visual-illusions-checker','visual-illusions-dress']});
LESSON({id:'face-perception',name:'Faces',short:'Faces',stage:'seeing',year:'1969–2009',level:'Core',
 why:'Faces get special treatment in the brain and are read as wholes, and people differ hugely in how well they recognise them.',
 prior:['visual-illusions'],references:['s2-kanwisher-1997','s2-thompson-1980','s2-tsao-2006','s2-cfmt','s2-russell-2009'],
 ids:['face-perception','face-perception-thatcher','face-perception-variation']});
LESSON({id:'blind-spot-filling',name:'The blind spot and filling in',short:'Blind spot',stage:'seeing',year:'1660–2007',level:'Introduction',
 why:'Each eye has a hole in its view that we never notice, because the brain fills the gap with its best guess.',
 prior:['eye-optics','photoreceptors'],references:['s2-mariotte','s2-ramachandran-1992','s2-komatsu-2006','s2-franze-2007'],
 ids:['blind-spot-filling','blind-spot-filling-in','blind-spot-filling-design']});

THREAD({id:'s2-participant',name:'You as the observer',ids:['lateral-inhibition-contrast','motion-perception-aftereffect','visual-illusions','visual-illusions-ebbinghaus','face-perception-thatcher','blind-spot-filling']});
THREAD({id:'s2-inference',name:'Perception as best guess',ids:['visual-illusions-checker','visual-illusions-dress','blind-spot-filling-in','depth-stereo','multisensory-integration']});
THREAD({id:'s2-edges',name:'From edges to objects',ids:['lateral-inhibition','opponent-colour','depth-stereo-random-dot','face-perception']});
THREAD({id:'s2-culture',name:'Culture and perception',ids:['visual-illusions','visual-illusions-ebbinghaus','smell-emotion']});
