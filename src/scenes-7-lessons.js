/* Stage 7 · Theory: one lesson per term. */
LESSON({id:'finite-automaton',name:'Finite automata',short:'Automata',stage:'theory',level:'Advanced',
 why:'The simplest model of computation: a fixed set of states and one arrow per symbol, which already describes controllers, protocols and pattern matchers.',
 prior:['conditional','boolean'],references:['sipser'],ids:['finite-automaton','fa-design','fa-nondeterministic','fa-traffic-light']});
LESSON({id:'regular-expression',name:'Regular expressions',short:'Regex',stage:'theory',level:'Advanced',
 why:'Patterns are automata in disguise: see how they are built, what they can never check, and how they rewrite text in practice.',
 prior:['finite-automaton','ascii'],references:['sipser'],ids:['regular-expression','regex-to-automaton','regex-limits','regex-replace']});
LESSON({id:'turing-machine',name:'Turing machines',short:'Turing',stage:'theory',level:'Advanced',
 why:'Add an unlimited tape and you reach every computation any computer can do, including running other programs stored as data.',
 prior:['finite-automaton','algorithm'],references:['turing','sipser'],ids:['turing-machine','tm-build','tm-church-turing','tm-universal']});
LESSON({id:'halting-problem',name:'The halting problem',short:'Halting',stage:'theory',level:'Advanced',
 why:'Some questions about programs have no algorithmic answer at all, and that one impossibility spreads to almost every question about behaviour.',
 prior:['turing-machine','loop','recursion'],references:['turing','sipser'],ids:['halting-problem','halting-collatz','halting-reduction','halting-rice']});
LESSON({id:'p-vs-np',name:'P versus NP',short:'P vs NP',stage:'theory',level:'Advanced',
 why:'Among problems we can solve, some seem to need exponential time even though answers are quick to check; the gap shapes cryptography, logistics and planning.',
 prior:['big-o','halting-problem','graph'],references:['cook','sipser'],ids:['p-vs-np','pnp-growth','pnp-colouring','pnp-tsp']});
THREAD({id:'state-machines',name:'States and transitions in practice',ids:['fa-traffic-light','process']});
THREAD({id:'stored-program',name:'Programs are data',ids:['tm-universal','fetch-decode-execute']});
THREAD({id:'exponential',name:'Exponential growth',ids:['big-o','pnp-growth']});
