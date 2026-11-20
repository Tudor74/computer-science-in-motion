/* Levin Lab era 4 · Frog faces, eyes and tails: lessons, sources and connections. */
SOURCE('l4-vandenberg2011',{title:'Vandenberg, Morrie & Adams (2011). V-ATPase-dependent ectodermal voltage and pH regionalization are required for craniofacial morphogenesis. Developmental Dynamics 240, 1889–1904.',url:'https://doi.org/10.1002/dvdy.22685'});
SOURCE('l4-tufts2011',{title:'Tufts Now (18 July 2011). The face of a frog: time-lapse video reveals never-before-seen bioelectric pattern.',url:'https://now.tufts.edu/2011/07/18/face-frog-time-lapse-video-reveals-never-seen-bioelectric-pattern',note:'University news release about the 2011 paper, with the time-lapse video.'});
SOURCE('l4-pai2012',{title:'Pai, Aw, Shomrat, Lemire & Levin (2012). Transmembrane voltage potential controls embryonic eye patterning in Xenopus laevis. Development 139, 313–323.',url:'https://doi.org/10.1242/dev.073759'});
SOURCE('l4-blackiston2013',{title:'Blackiston & Levin (2013). Ectopic eyes outside the head in Xenopus tadpoles provide sensory data for light-mediated learning. Journal of Experimental Biology 216, 1031–1040.'});
SOURCE('l4-beck2003',{title:'Beck, Christen & Slack (2003). Molecular pathways needed for regeneration of spinal cord and muscle in a vertebrate. Developmental Cell 5, 429–439.',url:'https://doi.org/10.1016/S1534-5807(03)00233-8'});
SOURCE('l4-adams2007',{title:'Adams, Masi & Levin (2007). H⁺ pump-dependent changes in membrane voltage are an early mechanism necessary and sufficient to induce Xenopus tail regeneration. Development 134, 1323–1335.',url:'https://doi.org/10.1242/dev.02812'});
SOURCE('l4-adams2013',{title:'Adams, Tseng & Levin (2013). Light-activation of the Archaerhodopsin H⁺-pump reverses age-dependent loss of vertebrate regeneration: sparking system-level controls in vivo. Biology Open 2, 306–313.',url:'https://doi.org/10.1242/bio.20133665'});
SOURCE('l4-tseng2010',{title:'Tseng, Beane, Lemire, Masi & Levin (2010). Induction of vertebrate regeneration by a transient sodium current. Journal of Neuroscience 30, 13192–13200.',url:'https://doi.org/10.1523/JNEUROSCI.3315-10.2010'});
SOURCE('l4-vandenberg2012',{title:'Vandenberg, Adams & Levin (2012). Normalized shape and location of perturbed craniofacial structures in the Xenopus tadpole reveal an innate ability to achieve correct morphology. Developmental Dynamics 241, 863–878.',url:'https://doi.org/10.1002/dvdy.23770'});
SOURCE('l4-pinet2019',{title:'Pinet, Deolankar, Leung & McLaughlin (2019). Adaptive correction of craniofacial defects in pre-metamorphic Xenopus laevis tadpoles involves thyroid hormone-independent tissue remodeling. Development 146, dev175893.',url:'https://doi.org/10.1242/dev.175893'});
SOURCE('l4-herrerarincon2018',{title:'Herrera-Rincon et al. (2018). Brief local application of progesterone via a wearable bioreactor induces long-term regenerative response in adult Xenopus hindlimb. Cell Reports 25, 1593–1609.',url:'https://doi.org/10.1016/j.celrep.2018.10.010'});
SOURCE('l4-murugan2022',{title:'Murugan, Vigran, Miller, Golding, Pham, Sperry, Rasmussen-Ivey, Kane, Kaplan & Levin (2022). Acute multidrug delivery via a wearable bioreactor facilitates long-term limb regeneration and functional recovery in adult Xenopus laevis. Science Advances 8, eabj2164.',url:'https://doi.org/10.1126/sciadv.abj2164'});
SOURCE('l4-brain-pump',{title:'Brain In Motion — the pump that keeps the gradients.',url:'https://brain-in-motion.puter.site/#resting-potential-pump',note:'Sister course: Nernst potentials, the Goldman balance and the Na⁺/K⁺ pump, step by step.'});
SOURCE('l4-bio-pumps',{title:'Biology In Motion — membranes and pumps.',url:'https://biology-in-motion.puter.site/#membranes-pumps',note:'Sister course: how pumps and channels move ions across membranes.'});

LESSON({id:'electric-face',name:'The electric face',short:'Face',stage:'frog',year:'2011',level:'Introduction',
 why:'A voltage dye showed a pattern on the embryo’s surface that resembled the face that would later form there, and disturbing the proton pump behind it changed the face.',
 prior:['voltage-dyes'],references:['l4-vandenberg2011','l4-tufts2011','l4-adams2013','l4-bio-pumps'],
 ids:['electric-face','electric-face-align','electric-face-block']});
LESSON({id:'induced-eyes',name:'Eyes outside the head',short:'Eyes',stage:'frog',year:'2012–2013',level:'Introduction',
 why:'Setting cells to a narrow range of voltage was reported to start eye formation in places where eyes never form, and grafted eyes far from the brain could still feed a learned behaviour.',
 prior:['electric-face'],references:['l4-pai2012','l4-blackiston2013','l4-brain-pump'],
 ids:['induced-eyes','induced-eyes-recruit','induced-eyes-see']});
LESSON({id:'tail-regeneration',name:'Tails that regrow',short:'Tails',stage:'frog',year:'2003–2013',level:'Core',
 why:'Tadpoles that regrow their tails, except for a few stages when they cannot, made a clean test of whether a change in ion flow and voltage can restore regrowth.',
 prior:['membrane-voltage'],references:['l4-beck2003','l4-adams2007','l4-adams2013'],
 ids:['tail-regeneration','tail-regeneration-pump','tail-regeneration-light']});
LESSON({id:'tail-sodium',name:'A sodium pulse',short:'Sodium',stage:'frog',year:'2010',level:'Core',
 why:'A one-hour treatment that forces sodium into cells, given once, was reported to restart a whole regrowth programme.',
 prior:['tail-regeneration'],references:['l4-tseng2010','l4-beck2003','l4-adams2007','l4-adams2013'],
 ids:['tail-sodium','tail-sodium-pulse','tail-sodium-tools']});
LESSON({id:'picasso-tadpoles',name:'“Picasso” tadpoles',short:'Picasso',stage:'frog',year:'2012',level:'Core',
 why:'Faces built with structures in the wrong places were largely corrected as the tadpoles grew, which the lab reads as tissues working towards a target shape.',
 prior:['electric-face'],references:['l4-vandenberg2012','l4-pinet2019'],
 ids:['picasso-tadpoles','picasso-tadpoles-measure','picasso-tadpoles-readings']});
LESSON({id:'leg-regrowth',name:'A frog leg regrows',short:'Leg',stage:'frog',year:'2018–2022',level:'Core',
 why:'Adult frogs normally regrow only a spike after losing a leg; a single day of treatment was reported to give a longer-lasting, more leg-like regrowth. Not medical advice.',
 prior:['tail-sodium'],references:['l4-herrerarincon2018','l4-murugan2022'],
 ids:['leg-regrowth','leg-regrowth-cocktail','leg-regrowth-limits']});

THREAD({id:'l4-protonpump',name:'Proton pumps and voltage',ids:['ion-flux','electric-face-block','tail-regeneration-pump','tail-regeneration-light']});
THREAD({id:'l4-targetshape',name:'Working towards a target shape',ids:['rewritten-pattern','picasso-tadpoles','picasso-tadpoles-readings','morphospace-navigation']});
THREAD({id:'l4-regrowth',name:'Switching regrowth back on',ids:['two-headed-worms','tail-regeneration','tail-sodium-pulse','leg-regrowth-cocktail','electroceuticals']});
THREAD({id:'l4-neededenough',name:'Necessary, sufficient or instructive?',ids:['instructive-signals','induced-eyes','tail-sodium-tools']});
