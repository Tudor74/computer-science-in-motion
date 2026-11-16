/* Economics era 1 · Classical economics: lessons, sources and connections. */
SOURCE('e1-smith-1776',{title:'Smith, A. (1776). An Inquiry into the Nature and Causes of the Wealth of Nations. W. Strahan and T. Cadell.',url:'https://en.wikipedia.org/wiki/The_Wealth_of_Nations'});
SOURCE('e1-smith-1759',{title:'Smith, A. (1759). The Theory of Moral Sentiments.',url:'https://en.wikipedia.org/wiki/The_Theory_of_Moral_Sentiments'});
SOURCE('e1-stigler-1951',{title:'Stigler, G. J. (1951). The division of labor is limited by the extent of the market. Journal of Political Economy 59, 185–193.',url:'https://doi.org/10.1086/257075'});
SOURCE('e1-ibn-khaldun',{title:'Ibn Khaldun (1377). The Muqaddimah, trans. F. Rosenthal (1958). On cooperation and the division of crafts.',url:'https://en.wikipedia.org/wiki/Muqaddimah'});
SOURCE('e1-rothschild-2001',{title:'Rothschild, E. (2001). Economic Sentiments: Adam Smith, Condorcet, and the Enlightenment. Harvard University Press.'});
SOURCE('e1-kennedy-2009',{title:'Kennedy, G. (2009). Adam Smith and the invisible hand: from metaphor to myth. Econ Journal Watch 6, 239–263.'});
SOURCE('e1-hayek-1945',{title:'Hayek, F. A. (1945). The use of knowledge in society. American Economic Review 35, 519–530.'});
SOURCE('e1-viner-1927',{title:'Viner, J. (1927). Adam Smith and laissez faire. Journal of Political Economy 35, 198–232.',url:'https://doi.org/10.1086/253837'});
SOURCE('e1-ricardo-1817',{title:'Ricardo, D. (1817). On the Principles of Political Economy and Taxation. John Murray.',url:'https://en.wikipedia.org/wiki/On_the_Principles_of_Political_Economy_and_Taxation'});
SOURCE('e1-ruffin-2002',{title:'Ruffin, R. J. (2002). David Ricardo’s discovery of comparative advantage. History of Political Economy 34, 727–748.'});
SOURCE('e1-stolper-1941',{title:'Stolper, W. F. & Samuelson, P. A. (1941). Protection and real wages. Review of Economic Studies 9, 58–73.',url:'https://doi.org/10.2307/2967638'});
SOURCE('e1-autor-2013',{title:'Autor, D. H., Dorn, D. & Hanson, G. H. (2013). The China syndrome: local labor market effects of import competition in the United States. American Economic Review 103, 2121–2168.',url:'https://doi.org/10.1257/aer.103.6.2121'});
SOURCE('e1-malthus-1798',{title:'Malthus, T. R. (1798). An Essay on the Principle of Population. J. Johnson.',url:'https://en.wikipedia.org/wiki/An_Essay_on_the_Principle_of_Population'});
SOURCE('e1-martineau',{title:'Martineau, H. (1832–34). Illustrations of Political Economy (stories popularising Malthus and Ricardo).',url:'https://en.wikipedia.org/wiki/Harriet_Martineau'});
SOURCE('e1-un-wpp',{title:'United Nations (2022). World Population Prospects 2022.',url:'https://population.un.org/wpp/'});
SOURCE('e1-faostat',{title:'FAO. FAOSTAT: crops and livestock products (cereal production).',url:'https://www.fao.org/faostat/'});
SOURCE('e1-smil-2001',{title:'Smil, V. (2001). Enriching the Earth: Fritz Haber, Carl Bosch, and the Transformation of World Food Production. MIT Press.'});
SOURCE('e1-notestein-1945',{title:'Notestein, F. W. (1945). Population: the long view. In T. W. Schultz (ed.), Food for the World. University of Chicago Press.'});
SOURCE('e1-boserup-1965',{title:'Boserup, E. (1965). The Conditions of Agricultural Growth. Allen & Unwin.'});
SOURCE('e1-west-1815',{title:'West, E. (1815). Essay on the Application of Capital to Land.'});
SOURCE('e1-ricardo-1815',{title:'Ricardo, D. (1815). An Essay on the Influence of a Low Price of Corn on the Profits of Stock.'});
SOURCE('e1-mill-1848',{title:'Mill, J. S. (1848). Principles of Political Economy.',url:'https://en.wikipedia.org/wiki/Principles_of_Political_Economy'});
SOURCE('e1-marx-1867',{title:'Marx, K. (1867). Das Kapital, volume 1.',url:'https://en.wikipedia.org/wiki/Das_Kapital'});
SOURCE('e1-bohm-bawerk-1896',{title:'Böhm-Bawerk, E. von (1896). Karl Marx and the Close of His System.'});
SOURCE('e1-samuelson-1971',{title:'Samuelson, P. A. (1971). Understanding the Marxian notion of exploitation. Journal of Economic Literature 9, 399–431.'});

LESSON({id:'division-of-labour',name:'The division of labour',short:'Division',stage:'classical',year:'1776',level:'Introduction',
 why:'Smith opened modern economics with a pin workshop: splitting work into small tasks multiplies output, but only as far as the market allows.',
 prior:[],references:['e1-smith-1776','e1-ibn-khaldun','e1-stigler-1951'],
 ids:['division-of-labour','division-of-labour-why','division-of-labour-market']});
LESSON({id:'invisible-hand',name:'The invisible hand',short:'Invisible hand',stage:'classical',year:'1759–1776',level:'Introduction',
 why:'The most famous phrase in economics appears once in The Wealth of Nations; the idea that prices coordinate is real, and Smith also listed its limits.',
 prior:['division-of-labour'],references:['e1-smith-1776','e1-smith-1759','e1-rothschild-2001','e1-kennedy-2009','e1-hayek-1945','e1-viner-1927'],
 ids:['invisible-hand','invisible-hand-prices','invisible-hand-limits']});
LESSON({id:'comparative-advantage',name:'Comparative advantage',short:'Comparative',stage:'classical',year:'1817',level:'Core',
 why:'Ricardo showed that two countries both gain from trade even when one is better at everything, and the simple model hides costs and losers.',
 prior:['division-of-labour'],references:['e1-ricardo-1817','e1-ruffin-2002','e1-stolper-1941','e1-autor-2013'],
 ids:['comparative-advantage','comparative-advantage-ppf','comparative-advantage-limits']});
LESSON({id:'malthus-population',name:'Malthus and population',short:'Malthus',stage:'classical',year:'1798',level:'Introduction',
 why:'Malthus’s race between people and food shaped classical economics; what happened next, rising productivity and the demographic transition, did not follow his script.',
 prior:[],references:['e1-malthus-1798','e1-martineau','e1-un-wpp','e1-faostat','e1-smil-2001','e1-notestein-1945','e1-boserup-1965'],
 ids:['malthus-population','malthus-population-world','malthus-population-transition']});
LESSON({id:'diminishing-returns',name:'Diminishing returns and rent',short:'Diminishing',stage:'classical',year:'1815',level:'Core',
 why:'Extra labour on fixed land adds less and less; Ricardo built rent, profits and the case against the Corn Laws on that one idea.',
 prior:['malthus-population'],references:['e1-west-1815','e1-ricardo-1815','e1-ricardo-1817','e1-mill-1848'],
 ids:['diminishing-returns','diminishing-returns-rent','diminishing-returns-stationary']});
LESSON({id:'labour-theory-value',name:'The labour theory of value',short:'Labour value',stage:'classical',year:'1776–1867',level:'Core',
 why:'The classical economists measured value by labour; the water–diamond paradox and Marx’s critique show where that idea led, and why it was later replaced.',
 prior:['division-of-labour'],references:['e1-smith-1776','e1-ricardo-1817','e1-marx-1867','e1-bohm-bawerk-1896','e1-samuelson-1971'],
 ids:['labour-theory-value','labour-theory-value-water-diamond','labour-theory-value-marx']});

THREAD({id:'e1-specialise-trade',name:'Specialise and trade',ids:['division-of-labour','division-of-labour-market','comparative-advantage','comparative-advantage-limits','trade-globalisation']});
THREAD({id:'e1-value',name:'What sets a price?',ids:['labour-theory-value','labour-theory-value-water-diamond','marginal-utility','supply-demand']});
THREAD({id:'e1-limits-growth',name:'Limits to growth',ids:['malthus-population','malthus-population-world','diminishing-returns-stationary','solow-growth','measuring-wellbeing']});
THREAD({id:'e1-markets-and-rules',name:'Markets and their limits',ids:['invisible-hand-prices','invisible-hand-limits','externalities','governing-commons']});
