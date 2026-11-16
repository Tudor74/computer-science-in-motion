/* Economics era 4 · Strategy and games: lessons, sources and connections. */
SOURCE('e4-flood-1958',{title:'Flood, M. M. (1958). Some experimental games. Management Science 5, 5–26 (the 1950 RAND experiments with Melvin Dresher).'});
SOURCE('e4-poundstone',{title:'Poundstone, W. (1992). Prisoner’s Dilemma: John von Neumann, Game Theory, and the Puzzle of the Bomb. Doubleday.',note:'History of the dilemma at RAND and Tucker’s naming of it.'});
SOURCE('e4-sally-1995',{title:'Sally, D. (1995). Conversation and cooperation in social dilemmas: a meta-analysis of experiments from 1958 to 1992. Rationality and Society 7, 58–92.'});
SOURCE('e4-rapoport-1965',{title:'Rapoport, A. & Chammah, A. M. (1965). Prisoner’s Dilemma: A Study in Conflict and Cooperation. University of Michigan Press.'});
SOURCE('e4-selten-1986',{title:'Selten, R. & Stoecker, R. (1986). End behavior in sequences of finite Prisoner’s Dilemma supergames. Journal of Economic Behavior and Organization 7, 47–70.'});
SOURCE('e4-nash-1950',{title:'Nash, J. F. (1950). Equilibrium points in n-person games. Proceedings of the National Academy of Sciences 36, 48–49.',url:'https://doi.org/10.1073/pnas.36.1.48'});
SOURCE('e4-vnm-1944',{title:'von Neumann, J. & Morgenstern, O. (1944). Theory of Games and Economic Behavior. Princeton University Press.'});
SOURCE('e4-schelling-1960',{title:'Schelling, T. C. (1960). The Strategy of Conflict. Harvard University Press.',note:'Focal points: how people coordinate when a game has several equilibria.'});
SOURCE('e4-palacios-2003',{title:'Palacios-Huerta, I. (2003). Professionals play minimax. Review of Economic Studies 70, 395–415.'});
SOURCE('e4-cournot-1838',{title:'Cournot, A. A. (1838). Recherches sur les principes mathématiques de la théorie des richesses. Hachette.'});
SOURCE('e4-axelrod-1980',{title:'Axelrod, R. (1980). Effective choice in the prisoner’s dilemma. Journal of Conflict Resolution 24, 3–25.'});
SOURCE('e4-axelrod-1984',{title:'Axelrod, R. (1984). The Evolution of Cooperation. Basic Books.'});
SOURCE('e4-axelrod-hamilton-1981',{title:'Axelrod, R. & Hamilton, W. D. (1981). The evolution of cooperation. Science 211, 1390–1396.',url:'https://doi.org/10.1126/science.7466396'});
SOURCE('e4-nowak-1992',{title:'Nowak, M. A. & Sigmund, K. (1992). Tit for tat in heterogeneous populations. Nature 355, 250–253.'});
SOURCE('e4-nowak-1993',{title:'Nowak, M. & Sigmund, K. (1993). A strategy of win-stay, lose-shift that outperforms tit-for-tat in the Prisoner’s Dilemma game. Nature 364, 56–58.'});
SOURCE('e4-nagel-1995',{title:'Nagel, R. (1995). Unraveling in guessing games: an experimental study. American Economic Review 85, 1313–1326.'});
SOURCE('e4-camerer-2004',{title:'Camerer, C. F., Ho, T.-H. & Chong, J.-K. (2004). A cognitive hierarchy model of games. Quarterly Journal of Economics 119, 861–898.'});
SOURCE('e4-stahl-1995',{title:'Stahl, D. O. & Wilson, P. W. (1995). On players’ models of other players: theory and experimental evidence. Games and Economic Behavior 10, 218–254.'});
SOURCE('e4-keynes-1936',{title:'Keynes, J. M. (1936). The General Theory of Employment, Interest and Money, chapter 12. Macmillan.'});
SOURCE('e4-vickrey-1961',{title:'Vickrey, W. (1961). Counterspeculation, auctions, and competitive sealed tenders. Journal of Finance 16, 8–37.'});
SOURCE('e4-myerson-1981',{title:'Myerson, R. B. (1981). Optimal auction design. Mathematics of Operations Research 6, 58–73.'});
SOURCE('e4-kagel-1987',{title:'Kagel, J. H., Harstad, R. M. & Levin, D. (1987). Information impact and allocation rules in auctions with affiliated private values: a laboratory study. Econometrica 55, 1275–1304.'});
SOURCE('e4-bazerman-1983',{title:'Bazerman, M. H. & Samuelson, W. F. (1983). I won the auction but don’t want the prize. Journal of Conflict Resolution 27, 618–634.'});
SOURCE('e4-hardin-1968',{title:'Hardin, G. (1968). The tragedy of the commons. Science 162, 1243–1248.',url:'https://doi.org/10.1126/science.162.3859.1243'});
SOURCE('e4-gordon-1954',{title:'Gordon, H. S. (1954). The economic theory of a common-property resource: the fishery. Journal of Political Economy 62, 124–142.'});
SOURCE('e4-ostrom-1990',{title:'Ostrom, E. (1990). Governing the Commons: The Evolution of Institutions for Collective Action. Cambridge University Press.'});
SOURCE('e4-owg-1992',{title:'Ostrom, E., Walker, J. & Gardner, R. (1992). Covenants with and without a sword: self-governance is possible. American Political Science Review 86, 404–417.'});
SOURCE('e4-cox-2010',{title:'Cox, M., Arnold, G. & Villamayor Tomás, S. (2010). A review of design principles for community-based natural resource management. Ecology and Society 15(4), 38.'});
SOURCE('e4-mind',{title:'Mind In Motion: judgement and reasoning, including loss aversion and the anchoring experiments.',url:'https://mind-in-motion.puter.site/',note:'Sister course: the psychology behind the behavioural results in this era.'});

LESSON({id:'prisoners-dilemma',name:'The prisoner’s dilemma',short:'Dilemma',stage:'games',year:'1950',level:'Introduction',
 why:'Two players who each do best by defecting end up worse off than if both had cooperated: the simplest picture of why cooperation is hard.',
 prior:['invisible-hand'],references:['e4-flood-1958','e4-poundstone','e4-sally-1995','e4-rapoport-1965','e4-selten-1986'],
 ids:['prisoners-dilemma','prisoners-dilemma-dominance','prisoners-dilemma-repeated']});
LESSON({id:'nash-equilibrium',name:'Nash equilibrium',short:'Nash',stage:'games',year:'1950',level:'Core',
 why:'A stable point where nobody gains by changing their move alone: the central idea for predicting what strategic players will do.',
 prior:['prisoners-dilemma','supply-demand'],references:['e4-nash-1950','e4-vnm-1944','e4-schelling-1960','e4-palacios-2003','e4-cournot-1838'],
 ids:['nash-equilibrium','nash-equilibrium-mixed','nash-equilibrium-cournot']});
LESSON({id:'axelrod-tournament',name:'Axelrod’s tournament',short:'Axelrod',stage:'games',year:'1980–1984',level:'Core',
 why:'When the dilemma repeats, simple strategies that are nice, retaliatory and forgiving can make cooperation thrive.',
 prior:['prisoners-dilemma'],references:['e4-axelrod-1980','e4-axelrod-1984','e4-axelrod-hamilton-1981','e4-nowak-1992','e4-nowak-1993'],
 ids:['axelrod-tournament','axelrod-tournament-play','axelrod-tournament-noise','axelrod-tournament-ecology']});
LESSON({id:'beauty-contest',name:'The beauty contest',short:'Beauty contest',stage:'games',year:'1936–1995',level:'Core',
 why:'Winning by guessing what others will guess: how many steps ahead people really think, and why it matters for markets.',
 prior:['nash-equilibrium'],references:['e4-nagel-1995','e4-stahl-1995','e4-camerer-2004','e4-keynes-1936'],
 ids:['beauty-contest','beauty-contest-levels','beauty-contest-keynes']});
LESSON({id:'auctions',name:'Auctions',short:'Auctions',stage:'games',year:'1961',level:'Core',
 why:'The rules of a sale shape how people bid: four formats, one surprising equivalence, and a bid that is always best.',
 prior:['nash-equilibrium','supply-demand'],references:['e4-vickrey-1961','e4-myerson-1981','e4-kagel-1987','e4-bazerman-1983'],
 ids:['auctions','auctions-revenue','auctions-bid']});
LESSON({id:'governing-commons',name:'Governing the commons',short:'Commons',stage:'games',year:'1968–1990',level:'Core',
 why:'Shared resources are overused when nobody limits the take, yet many communities have run commons well for centuries.',
 prior:['prisoners-dilemma','externalities'],references:['e4-hardin-1968','e4-gordon-1954','e4-ostrom-1990','e4-owg-1992','e4-cox-2010'],
 ids:['governing-commons','governing-commons-game','governing-commons-principles']});

THREAD({id:'e4-cooperation',name:'Cooperation and its problems',ids:['prisoners-dilemma','prisoners-dilemma-repeated','axelrod-tournament','governing-commons-game','public-goods-game','ultimatum-game']});
THREAD({id:'e4-participant',name:'You as the player',ids:['prisoners-dilemma','axelrod-tournament-play','beauty-contest','auctions-bid','governing-commons-game','market-experiments']});
THREAD({id:'e4-markets-strategy',name:'Strategy inside markets',ids:['nash-equilibrium-cournot','beauty-contest-keynes','auctions','supply-demand','financial-crises','agent-based-markets']});
