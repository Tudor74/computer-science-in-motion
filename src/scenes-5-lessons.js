/* Era 5 · Light: lessons, sources and connections. */
SOURCE('alhaytham-optics',{title:'Ibn al-Haytham (c. 1011–1021), Kitāb al-Manāẓir (Book of Optics)',url:'https://en.wikipedia.org/wiki/Book_of_Optics'});
SOURCE('ibn-sahl-984',{title:'Ibn Sahl (984), On Burning Mirrors and Lenses — the earliest known statement of the law of refraction',url:'https://en.wikipedia.org/wiki/Ibn_Sahl'});
SOURCE('snell-law',{title:'Snell’s law: history from Ibn Sahl and Snell to Descartes',url:'https://en.wikipedia.org/wiki/Snell%27s_law'});
SOURCE('descartes-1637',{title:'René Descartes (1637), La Dioptrique and Les Météores (essays appended to the Discourse on Method)'});
SOURCE('colladon-1842',{title:'Daniel Colladon (1842), Sur les réflexions d’un rayon de lumière à l’intérieur d’une veine liquide parabolique, Comptes rendus 15'});
SOURCE('kao-1966',{title:'K. C. Kao & G. A. Hockham (1966), Dielectric-fibre surface waveguides for optical frequencies, Proceedings of the IEE 113(7)'});
SOURCE('kepler-1604',{title:'Johannes Kepler (1604), Ad Vitellionem paralipomena (Astronomiae pars optica): the retinal image'});
SOURCE('kepler-1611',{title:'Johannes Kepler (1611), Dioptrice'});
SOURCE('donders-1864',{title:'F. C. Donders (1864), On the Anomalies of Accommodation and Refraction of the Eye (New Sydenham Society, London)'});
SOURCE('galileo-1610',{title:'Galileo Galilei (1610), Sidereus Nuncius',url:'https://en.wikipedia.org/wiki/Sidereus_Nuncius'});
SOURCE('newton-1672',{title:'Isaac Newton (1672), A letter … containing his new theory about light and colors, Philosophical Transactions 6'});
SOURCE('newton-1704',{title:'Isaac Newton (1704), Opticks'});
SOURCE('young-1802',{title:'Thomas Young (1802), On the theory of light and colours, Philosophical Transactions 92'});
SOURCE('young-1804',{title:'Thomas Young (1804), The Bakerian Lecture: Experiments and calculations relative to physical optics, Philosophical Transactions 94',url:'https://en.wikipedia.org/wiki/Young%27s_interference_experiment'});
SOURCE('maxwell-1861',{title:'James Clerk Maxwell (1861), the first three-colour photograph (tartan ribbon), Royal Institution lecture',url:'https://en.wikipedia.org/wiki/Tartan_Ribbon'});
SOURCE('theodoric-rainbow',{title:'Theodoric of Freiberg (c. 1304), De iride: rainbow experiments with water-filled spheres',url:'https://en.wikipedia.org/wiki/Theodoric_of_Freiberg'});
SOURCE('huygens-1690',{title:'Christiaan Huygens (1690), Traité de la lumière'});
SOURCE('grimaldi-1665',{title:'Francesco Maria Grimaldi (1665), Physico-mathesis de lumine, coloribus, et iride'});
SOURCE('fresnel-1818',{title:'Augustin Fresnel (1818), Mémoire sur la diffraction de la lumière; the Arago (Poisson) spot',url:'https://en.wikipedia.org/wiki/Arago_spot'});
SOURCE('fraunhofer-1821',{title:'Joseph von Fraunhofer (1821), diffraction gratings and the wavelengths of solar spectral lines',url:'https://en.wikipedia.org/wiki/Joseph_von_Fraunhofer'});
SOURCE('malus-1809',{title:'Étienne-Louis Malus (1809), polarisation by reflection and the cos² law',url:'https://en.wikipedia.org/wiki/Malus%27s_law'});
SOURCE('romer-1676',{title:'Ole Rømer (1676), Démonstration touchant le mouvement de la lumière, Journal des Sçavans',url:'https://en.wikipedia.org/wiki/R%C3%B8mer%27s_determination_of_the_speed_of_light'});
SOURCE('fizeau-1849',{title:'Hippolyte Fizeau (1849), Sur une expérience relative à la vitesse de propagation de la lumière, Comptes rendus 29',url:'https://en.wikipedia.org/wiki/Fizeau%27s_measurement_of_the_speed_of_light_in_air'});
SOURCE('foucault-1850',{title:'Léon Foucault (1850), Méthode générale pour mesurer la vitesse de la lumière dans l’air et les milieux transparents, Comptes rendus 30; and (1862) 298,000 km/s',url:'https://en.wikipedia.org/wiki/Fizeau%E2%80%93Foucault_apparatus'});

LESSON({id:'reflection-refraction',name:'Reflection and refraction',short:'Refraction',stage:'light',year:'c. 1021–1637',level:'Introduction',
 why:'Light bounces at equal angles and bends by a fixed ratio of sines: two rules that explain mirrors, lenses and optical fibres.',
 prior:['wave-basics'],references:['alhaytham-optics','ibn-sahl-984','snell-law','descartes-1637','colladon-1842','kao-1966'],ids:['reflection-refraction','reflection-refraction-snell','reflection-refraction-tir']});
LESSON({id:'lenses',name:'Lenses, eyes and telescopes',short:'Lenses',stage:'light',year:'1604–1611',level:'Core',
 why:'Lenses gather rays from each point of an object to a point of an image; the same rule explains the eye, glasses and the telescopes that changed astronomy.',
 prior:['reflection-refraction'],references:['kepler-1604','kepler-1611','donders-1864','galileo-1610'],ids:['lenses','lenses-eye','lenses-telescope']});
LESSON({id:'colour-spectrum',name:'Colour and the spectrum',short:'Colour',stage:'light',year:'1672',level:'Introduction',
 why:'White light is a mixture of colours that bend by different amounts; adding lights and subtracting paints are two ways of working with that mixture.',
 prior:['reflection-refraction'],references:['newton-1672','young-1802','maxwell-1861','descartes-1637','theodoric-rainbow'],ids:['colour-spectrum','colour-spectrum-mixing','colour-spectrum-rainbow']});
LESSON({id:'double-slit',name:'Young’s double slit',short:'Double slit',stage:'light',year:'1801–1804',level:'Core',
 why:'Interference fringes showed that light behaves as a wave, and let Young measure wavelengths far smaller than anything he could see.',
 prior:['colour-spectrum','superposition'],references:['young-1804','huygens-1690','newton-1704','foucault-1850'],ids:['double-slit','double-slit-measure','double-slit-debate']});
LESSON({id:'diffraction-polarisation',name:'Diffraction and polarisation',short:'Diffraction',stage:'light',year:'1665–1821',level:'Core',
 why:'Light spreads through gaps, sorts itself by colour on gratings and vibrates across its direction of travel: three facts that only a transverse wave explains.',
 prior:['double-slit'],references:['grimaldi-1665','fresnel-1818','fraunhofer-1821','malus-1809'],ids:['diffraction-polarisation','diffraction-polarisation-grating','diffraction-polarisation-polarisers']});
LESSON({id:'speed-of-light',name:'The speed of light',short:'Speed of light',stage:'light',year:'1676–1862',level:'Core',
 why:'Light is fast but not instantaneous: astronomers timed it across the Solar System, and experimenters timed it across a few kilometres, then through water.',
 prior:['double-slit'],references:['romer-1676','fizeau-1849','foucault-1850'],ids:['speed-of-light','speed-of-light-fizeau','speed-of-light-water']});

THREAD({id:'light-wave-or-particle',name:'Wave or particle?',ids:['double-slit-debate','speed-of-light-water','photoelectric-effect','quantum-interference']});
THREAD({id:'light-speed-limit',name:'The speed of light',ids:['speed-of-light','speed-of-light-fizeau','electromagnetic-waves','special-relativity']});
THREAD({id:'light-spectra',name:'Reading light by colour',ids:['colour-spectrum','diffraction-polarisation-grating','atomic-spectra']});
THREAD({id:'light-interference',name:'Waves adding and cancelling',ids:['superposition','double-slit','diffraction-polarisation']});
