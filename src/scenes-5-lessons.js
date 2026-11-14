/* Stage 5 · Machines: one lesson per term, in route order. */
LESSON({id:'fetch-decode-execute',name:'The processor cycle',short:'CPU cycle',stage:'machines',level:'Core',
 why:'A processor repeats one tiny loop of fetching, decoding and executing; the ALU, jumps and pipelining are what make that loop useful and fast.',
 prior:['logic-gate','half-adder','algorithm','loop'],references:['nand2tetris','patterson'],
 ids:['fetch-decode-execute','ma-alu','ma-jump-loop','ma-pipeline']});
LESSON({id:'machine-code',name:'Machine code and assembly',short:'Machine code',stage:'machines',level:'Core',
 why:'Instructions are numbers; addressing modes say where their data lives, and an assembler turns readable mnemonics and labels into those numbers.',
 prior:['fetch-decode-execute','binary','hexadecimal'],references:['nand2tetris','patterson'],
 ids:['machine-code','ma-addressing','ma-assembler']});
LESSON({id:'memory-hierarchy',name:'The memory hierarchy',short:'Memory',stage:'machines',level:'Core',
 why:'Fast memory is small and slow memory is big, so programs run fastest when they reuse nearby data and the system hides the layers.',
 prior:['fetch-decode-execute','array','byte'],references:['patterson','tanenbaum'],
 ids:['memory-hierarchy','ma-locality','ma-virtual-memory','ma-registers-few']});
LESSON({id:'cache',name:'Caches',short:'Cache',stage:'machines',level:'Core',
 why:'A cache decides where each block may live and when changes reach memory; those choices decide hit rates and correctness.',
 prior:['memory-hierarchy','hash-function','binary'],references:['patterson'],
 ids:['cache','ma-cache-mapping','ma-write-policy']});
LESSON({id:'compiler',name:'Compilers',short:'Compiler',stage:'machines',level:'Core',
 why:'A compiler reads text as tokens, checks them against a grammar, and improves the program before translating it.',
 prior:['machine-code','tree','finite-automaton'],references:['dragon'],
 ids:['compiler','ma-lexer','ma-syntax-error','ma-optimiser']});
LESSON({id:'interpreter',name:'Interpreters and virtual machines',short:'Interpreter',stage:'machines',level:'Core',
 why:'Between pure compiling and pure interpreting sit bytecode, virtual machines and just-in-time compilers.',
 prior:['compiler','stack'],references:['dragon','sicp'],
 ids:['interpreter','ma-bytecode-vm','ma-jit']});
LESSON({id:'process',name:'Processes and threads',short:'Processes',stage:'machines',level:'Core',
 why:'An operating system runs many programs and threads at once; sharing memory makes cooperation fast but needs locks to stay correct.',
 prior:['fetch-decode-execute','variable'],references:['tanenbaum'],
 ids:['process','ma-threads','ma-race-condition','ma-mutex']});
LESSON({id:'scheduling',name:'Scheduling and deadlock',short:'Scheduling',stage:'machines',level:'Core',
 why:'Choosing who runs next trades fairness against speed, and careless sharing of resources can freeze everything.',
 prior:['process','queue','graph'],references:['tanenbaum'],
 ids:['scheduling','ma-priority','ma-deadlock']});
THREAD({id:'ma-ordering',name:'Order matters',ids:['queue','ma-race-condition','ma-mutex','ma-deadlock']});
THREAD({id:'ma-stack-machines',name:'Stacks run programs',ids:['stack','ma-bytecode-vm']});
THREAD({id:'ma-grammar',name:'Reading text by rules',ids:['ma-lexer','ma-syntax-error','finite-automaton']});
