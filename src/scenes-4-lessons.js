/* Music era 4 · Keys, form and the orchestra: lessons, sources and connections. */
SOURCE('m4-rameau-1722',{title:'Jean-Philippe Rameau (1722), Traité de l’harmonie réduite à ses principes naturels',url:'https://en.wikipedia.org/wiki/Trait%C3%A9_de_l%27harmonie'});
SOURCE('m4-aldwell-schachter',{title:'Edward Aldwell & Carl Schachter (2011), Harmony and Voice Leading, 4th edn, Schirmer'});
SOURCE('m4-dalla-bella-2001',{title:'Dalla Bella, Peretz, Rousseau & Gosselin (2001), A developmental study of the affective value of tempo and mode in music, Cognition 80, B1–B10',url:'https://doi.org/10.1016/S0010-0277(00)00136-0'});
SOURCE('m4-fritz-2009',{title:'Fritz et al. (2009), Universal recognition of three basic emotions in music, Current Biology 19, 573–576',url:'https://doi.org/10.1016/j.cub.2009.02.058'});
SOURCE('m4-schoenberg-1954',{title:'Arnold Schoenberg (1954), Structural Functions of Harmony'});
SOURCE('m4-schoenberg-1967',{title:'Arnold Schoenberg (1967), Fundamentals of Musical Composition, ed. Strang & Stein'});
SOURCE('m4-rosen-1971',{title:'Charles Rosen (1971), The Classical Style: Haydn, Mozart, Beethoven'});
SOURCE('m4-rosen-1988',{title:'Charles Rosen (1980, revised 1988), Sonata Forms'});
SOURCE('m4-caplin-1998',{title:'William E. Caplin (1998), Classical Form: A Theory of Formal Functions for the Instrumental Music of Haydn, Mozart, and Beethoven'});
SOURCE('m4-hepokoski-darcy',{title:'James Hepokoski & Warren Darcy (2006), Elements of Sonata Theory'});
SOURCE('m4-marx-1845',{title:'Adolf Bernhard Marx (1845), Die Lehre von der musikalischen Komposition, vol. 3',url:'https://en.wikipedia.org/wiki/Sonata_form'});
SOURCE('m4-reicha-1826',{title:'Anton Reicha (1824–26), Traité de haute composition musicale'});
SOURCE('m4-beethoven-5',{title:'Ludwig van Beethoven (1808), Symphony No. 5 in C minor, Op. 67',url:'https://imslp.org/wiki/Symphony_No.5,_Op.67_(Beethoven,_Ludwig_van)'});
SOURCE('m4-mozart-k265',{title:'W. A. Mozart (c. 1781), Twelve Variations on “Ah! vous dirai-je, maman”, K. 265',url:'https://imslp.org/wiki/12_Variations_on_%22Ah_vous_dirai-je,_Maman%22,_K.265/300e_(Mozart,_Wolfgang_Amadeus)'});
SOURCE('m4-sisman',{title:'Elaine Sisman (2001), Variations, Grove Music Online',url:'https://doi.org/10.1093/gmo/9781561592630.article.29050'});
SOURCE('m4-reich-clara',{title:'Nancy B. Reich (1985, revised 2001), Clara Schumann: The Artist and the Woman'});
SOURCE('m4-todd-fanny',{title:'R. Larry Todd (2010), Fanny Hensel: The Other Mendelssohn'});
SOURCE('m4-berlioz-1844',{title:'Hector Berlioz (1844), Grand traité d’instrumentation et d’orchestration modernes',url:'https://imslp.org/wiki/Grand_trait%C3%A9_d%27instrumentation_et_d%27orchestration_modernes,_Op.10_(Berlioz,_Hector)'});
SOURCE('m4-adler',{title:'Samuel Adler (2016), The Study of Orchestration, 4th edn, Norton'});
SOURCE('m4-spitzer-zaslaw',{title:'John Spitzer & Neal Zaslaw (2004), The Birth of the Orchestra: History of an Institution, 1650–1815'});
SOURCE('m4-helmholtz-1863',{title:'Hermann von Helmholtz (1863), Die Lehre von den Tonempfindungen (On the Sensations of Tone)'});

LESSON({id:'major-minor',name:'Major and minor',short:'Major & minor',stage:'form',year:'1700s',
 why:'Two seven-note patterns, major and minor, organise most music of this era; knowing their step patterns explains key signatures and the colour of each key.',
 prior:['intervals','pentatonic-scales','modes'],level:'Introduction',references:['m4-rameau-1722','m4-aldwell-schachter','m4-dalla-bella-2001','m4-fritz-2009'],
 ids:['major-minor','major-minor-forms','major-minor-relative-parallel']});
LESSON({id:'modulation',name:'Modulation: changing key',short:'Modulation',stage:'form',year:'1700s–1800s',
 why:'Moving between keys gives long pieces a sense of journey and return; pivot chords and closely related keys make the move smooth.',
 prior:['major-minor','cadences','circle-of-fifths'],level:'Core',references:['m4-schoenberg-1954','m4-aldwell-schachter','m4-rosen-1971','m4-caplin-1998'],
 ids:['modulation','modulation-closely-related','modulation-timeline']});
LESSON({id:'motif',name:'Motif and phrase',short:'Motif',stage:'form',year:'1808',
 why:'Big works grow from small ideas: a few notes, developed by repetition, sequence, inversion and fragmentation, then shaped into question-and-answer phrases.',
 prior:['note-values','canon-round','major-minor'],level:'Core',references:['m4-beethoven-5','m4-schoenberg-1967','m4-caplin-1998'],
 ids:['motif','motif-shapes','motif-period']});
LESSON({id:'sonata-form',name:'Sonata form',short:'Sonata form',stage:'form',year:'1750–1850',
 why:'The plan behind countless symphonies and sonatas: two subjects in contrasting keys, a development, and a homecoming in which both share the tonic.',
 prior:['modulation','motif'],level:'Core',references:['m4-rosen-1988','m4-hepokoski-darcy','m4-marx-1845','m4-reicha-1826','m4-reich-clara','m4-todd-fanny'],
 ids:['sonata-form','sonata-form-keys','sonata-form-history']});
LESSON({id:'theme-variation',name:'Theme and variations',short:'Variations',stage:'form',year:'1741–1861',
 why:'Variation shows what makes a tune itself: change its rhythm, ornaments, mode or harmony and listen to what survives.',
 prior:['motif','major-minor'],level:'Introduction',references:['m4-mozart-k265','m4-sisman','m4-schoenberg-1967','m4-reich-clara'],
 ids:['theme-variation','theme-variation-build','theme-variation-sets']});
LESSON({id:'orchestration',name:'The orchestra and orchestration',short:'Orchestra',stage:'form',year:'1844',
 why:'Composers choose instruments by family, range and colour; doubling instruments mixes their overtones into new timbres.',
 prior:['theme-variation','sonata-form'],level:'Introduction',references:['m4-berlioz-1844','m4-adler','m4-spitzer-zaslaw','m4-helmholtz-1863'],
 ids:['orchestration','orchestration-ranges','orchestration-doubling']});

THREAD({id:'m4-keys-travel',name:'Travelling between keys',ids:['circle-of-fifths','modulation-closely-related','modulation','sonata-form-keys']});
THREAD({id:'m4-transforming',name:'Transforming a melody',ids:['canon-round','motif-shapes','motif','theme-variation']});
THREAD({id:'m4-colour',name:'The colour of a sound',ids:['orchestration-doubling','fourier-timbre','instrument-resonance']});
THREAD({id:'m4-mode-feeling',name:'Does minor sound sad?',ids:['major-minor-relative-parallel','music-emotion']});
