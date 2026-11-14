/* Stage 2 · Instruct: one lesson per term, in route order. */
LESSON({id:'algorithm',name:'Algorithms',short:'Algorithms',stage:'instruct',level:'Introduction',
 why:'An algorithm is a recipe precise enough for a machine: exact steps, a notation to write them in, and a way to tell whether they are right.',
 prior:['boolean'],references:['sicp','cs-unplugged'],ids:['algorithm','algorithm-precision','pseudocode-flowchart','algorithm-correctness']});
LESSON({id:'variable',name:'Variables and types',short:'Variables',stage:'instruct',level:'Introduction',
 why:'Programs remember values in named boxes; the type of a value decides what operations mean, and each name has a region where it can be seen.',
 prior:['algorithm','ascii'],references:['sicp'],ids:['variable','data-types','swap-variables','variable-scope']});
LESSON({id:'conditional',name:'Conditionals',short:'Conditionals',stage:'instruct',level:'Introduction',
 why:'Choosing between paths is how a program reacts to its data; the order of tests and the exact boundary both matter.',
 prior:['variable','boolean'],references:['sicp'],ids:['conditional','else-if-chain','nested-conditions','comparison-operators']});
LESSON({id:'loop',name:'Loops',short:'Loops',stage:'instruct',level:'Introduction',
 why:'Repetition lets a few lines do a great deal of work, as long as the loop runs the right number of times and then stops.',
 prior:['conditional'],references:['sicp','cs-unplugged'],ids:['loop','while-loop','nested-loops','off-by-one']});
LESSON({id:'function',name:'Functions',short:'Functions',stage:'instruct',level:'Introduction',
 why:'Name a procedure once, pass it values, get a value back, and build bigger behaviour by plugging functions together.',
 prior:['loop','variable'],references:['sicp'],ids:['function','parameters-arguments','return-vs-print','function-composition']});
LESSON({id:'call-stack',name:'The call stack',short:'Call stack',stage:'instruct',level:'Core',
 why:'The call stack is how a machine remembers which call is running, what its variables are, and where to go back to.',
 prior:['function'],references:['sicp','nand2tetris'],ids:['call-stack','stack-frame-locals','stack-overflow']});
LESSON({id:'recursion',name:'Recursion',short:'Recursion',stage:'instruct',level:'Core',
 why:'A function that calls itself on a smaller problem can describe trees, puzzles and whole algorithms in a few lines, provided it reaches a base case.',
 prior:['call-stack'],references:['sicp','knuth'],ids:['recursion','recursion-tree','towers-of-hanoi']});

THREAD({id:'same-bits',name:'Same bits, different meanings',ids:['ascii','data-types']});
THREAD({id:'logic-in-code',name:'Logic in code',ids:['boolean','nested-conditions']});
THREAD({id:'branching-calls',name:'Calls that branch',ids:['recursion-tree','dynamic-programming']});
THREAD({id:'runaway-stack',name:'When the stack fills up',ids:['stack-overflow','stack']});
