/* Physics era 4 · Waves and sound: lessons, sources and connections. */
SOURCE('p4-dalembert-1747',{title:'Jean le Rond d’Alembert (1747), Recherches sur la courbe que forme une corde tendue mise en vibration, Histoire de l’Académie royale des sciences et belles lettres de Berlin',url:'https://en.wikipedia.org/wiki/Wave_equation'});
SOURCE('p4-huygens-1690',{title:'Christiaan Huygens (1690), Traité de la lumière',url:'https://archive.org/details/treatiseonlight031310mbp'});
SOURCE('p4-feynman-1963',{title:'Feynman, Leighton & Sands (1963), The Feynman Lectures on Physics, Vol. I, chapters 47–51 (sound, waves, beats, modes, harmonics)',url:'https://www.feynmanlectures.caltech.edu/I_47.html'});
SOURCE('p4-young-1802',{title:'Thomas Young (1802), On the theory of light and colours, Philosophical Transactions of the Royal Society 92',url:'https://doi.org/10.1098/rstl.1802.0004'});
SOURCE('p4-young-1807',{title:'Thomas Young (1807), A Course of Lectures on Natural Philosophy and the Mechanical Arts (two-source water-wave interference figure)'});
SOURCE('p4-sauveur-1701',{title:'Joseph Sauveur (1701), Système général des intervalles des sons, Mémoires de l’Académie royale des sciences'});
SOURCE('p4-mersenne-1636',{title:'Marin Mersenne (1636), Harmonie universelle',url:'https://en.wikipedia.org/wiki/Mersenne%27s_laws'});
SOURCE('p4-chladni-1787',{title:'Ernst Chladni (1787), Entdeckungen über die Theorie des Klanges',url:'https://en.wikipedia.org/wiki/Ernst_Chladni'});
SOURCE('p4-helmholtz-1863',{title:'Hermann von Helmholtz (1863), Die Lehre von den Tonempfindungen (On the Sensations of Tone)'});
SOURCE('p4-boyle-1660',{title:'Robert Boyle (1660), New Experiments Physico-Mechanicall, Touching the Spring of the Air, and its Effects'});
SOURCE('p4-laplace-1816',{title:'Pierre-Simon Laplace (1816), Sur la vitesse du son dans l’air et dans l’eau, Annales de chimie et de physique 3',url:'https://en.wikipedia.org/wiki/Speed_of_sound'});
SOURCE('p4-stevens-1957',{title:'S. S. Stevens (1957), On the psychophysical law, Psychological Review 64(3)',url:'https://doi.org/10.1037/h0046162'});
SOURCE('p4-doppler-1842',{title:'Christian Doppler (1842), Über das farbige Licht der Doppelsterne und einiger anderer Gestirne des Himmels',url:'https://en.wikipedia.org/wiki/Doppler_effect'});
SOURCE('p4-buysballot-1845',{title:'C. H. D. Buys Ballot (1845), Akustische Versuche auf der Niederländischen Eisenbahn, nebst gelegentlichen Bemerkungen zur Theorie des Hrn. Prof. Doppler, Annalen der Physik 142(11)',url:'https://doi.org/10.1002/andp.18451421102'});
SOURCE('p4-mach-1887',{title:'Ernst Mach & Peter Salcher (1887), Photographische Fixirung der durch Projectile in der Luft eingeleiteten Vorgänge, Sitzungsberichte der Akademie der Wissenschaften Wien 95'});
SOURCE('p4-galileo-1638',{title:'Galileo Galilei (1638), Discourses and Mathematical Demonstrations Relating to Two New Sciences (first day: pendulums and resonance)'});
SOURCE('p4-billah-1991',{title:'K. Yusuf Billah & Robert H. Scanlan (1991), Resonance, Tacoma Narrows bridge failure, and undergraduate physics textbooks, American Journal of Physics 59(2)',url:'https://doi.org/10.1119/1.16590'});

LESSON({id:'wave-basics',name:'What a wave is',short:'Waves',stage:'waves',year:'1690–1747',level:'Introduction',
 why:'A wave moves energy without moving the medium along with it; speed, frequency, wavelength and amplitude describe it completely.',
 prior:['oscillations'],references:['p4-dalembert-1747','p4-huygens-1690','p4-feynman-1963'],ids:['wave-basics','wave-basics-speed','wave-basics-energy']});
LESSON({id:'superposition',name:'Superposition and interference',short:'Superposition',stage:'waves',year:'1700–1807',level:'Core',
 why:'Overlapping waves simply add, which explains doubling, cancelling, still nodal lines and the throb of beats.',
 prior:['wave-basics'],references:['p4-young-1802','p4-young-1807','p4-sauveur-1701'],ids:['superposition','superposition-two-sources','superposition-beats']});
LESSON({id:'standing-waves',name:'Standing waves',short:'Standing waves',stage:'waves',year:'1636–1863',level:'Core',
 why:'Waves trapped between boundaries can only fit certain wavelengths, which is why strings, plates and pipes ring at particular frequencies.',
 prior:['superposition'],references:['p4-mersenne-1636','p4-chladni-1787','p4-helmholtz-1863'],ids:['standing-waves','standing-waves-chladni','standing-waves-pipes']});
LESSON({id:'sound',name:'Sound',short:'Sound',stage:'waves',year:'1660–1816',level:'Introduction',
 why:'Sound is a pressure wave in a medium: its speed, its pressure pattern and its logarithmic loudness scale all follow from that.',
 prior:['wave-basics'],references:['p4-boyle-1660','p4-laplace-1816','p4-stevens-1957'],ids:['sound','sound-speed','sound-decibels']});
LESSON({id:'doppler',name:'The Doppler effect',short:'Doppler',stage:'waves',year:'1842–1887',level:'Core',
 why:'A moving source squeezes its waves ahead and stretches them behind; push past the speed of the waves and they pile into a shock.',
 prior:['sound','relative-motion'],references:['p4-doppler-1842','p4-buysballot-1845','p4-mach-1887'],ids:['doppler','doppler-train','doppler-mach']});
LESSON({id:'resonance',name:'Resonance',short:'Resonance',stage:'waves',year:'1638–1991',level:'Core',
 why:'Driving a system at its natural frequency makes small pushes add up; knowing when that applies, and when it does not, matters for engineering.',
 prior:['oscillations','standing-waves'],references:['p4-galileo-1638','p4-feynman-1963','p4-billah-1991'],ids:['resonance','resonance-swing','resonance-tacoma']});

THREAD({id:'interference-everywhere',name:'Interference everywhere',ids:['superposition-two-sources','double-slit','quantum-interference']});
THREAD({id:'waves-in-fields',name:'Waves without a medium',ids:['wave-basics','electromagnetic-waves','speed-of-light']});
THREAD({id:'oscillators',name:'Things that oscillate',ids:['oscillations','resonance','standing-waves']});
