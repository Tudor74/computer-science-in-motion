/* ===================== Curriculum: stages → lessons → terms ===================== */
const CURRICULUM={version:1,
stages:[
 {id:'represent',name:'1 · Represent',why:'Everything a computer holds is a pattern of two-state switches. Learn to read those patterns as numbers, text, pictures and logic.'},
 {id:'instruct',name:'2 · Instruct',why:'Give a machine precise steps: remember values, choose, repeat, name a procedure and let it call itself.'},
 {id:'organise',name:'3 · Organise data',why:'The shape you give data decides which questions are quick to answer.'},
 {id:'search',name:'4 · Search and sort',why:'Classic algorithms show that a cleverer method beats a faster machine. Big-O measures how much.'},
 {id:'machines',name:'5 · Machines',why:'Open the box: how a processor runs instructions, why memory has layers, how programs become instructions, and how one machine runs many programs.'},
 {id:'networks',name:'6 · Networks',why:'Split messages into packets, route them across the world, name machines, request pages and keep secrets in public.'},
 {id:'theory',name:'7 · Theory',why:'Ask what any computer could ever do: simple machines, universal machines, impossible problems and problems that may be hard.'}
],
lessons:[
 {id:'bits',name:'Bits and binary',short:'Bits',stage:'represent',why:'A bit is the smallest choice; place value turns rows of bits into numbers.',prior:[],level:'Introduction',ids:['bit','binary','byte','hexadecimal'],references:['code','cs-unplugged']},
 {id:'encoding',name:'Encoding text and images',short:'Encoding',stage:'represent',why:'An agreed table turns numbers into letters, symbols and pixels.',prior:['bits'],level:'Introduction',ids:['ascii','unicode','bitmap'],references:['unicode','code']},
 {id:'logic',name:'Boolean logic and gates',short:'Logic',stage:'represent',why:'True and false, combined by rules, become circuits that can add.',prior:['bits'],level:'Introduction',ids:['boolean','logic-gate','half-adder'],references:['code','nand2tetris']},
 {id:'algorithms',name:'Algorithms and state',short:'Algorithms',stage:'instruct',why:'An algorithm is a recipe precise enough for a machine. Variables, choices and loops are its building blocks.',prior:['bits','logic'],level:'Introduction',ids:['algorithm','variable','conditional','loop'],references:['sicp','cs-unplugged']},
 {id:'functions',name:'Functions and recursion',short:'Functions',stage:'instruct',why:'Name a procedure once and reuse it; let it call itself to solve a smaller copy of the problem.',prior:['algorithms'],level:'Introduction',ids:['function','call-stack','recursion'],references:['sicp']},
 {id:'linear',name:'Lists, stacks and queues',short:'Linear data',stage:'organise',why:'Items in a line can be stored side by side or chained by pointers, and accessed from one or both ends.',prior:['algorithms','bits'],level:'Core',ids:['array','linked-list','stack','queue'],references:['clrs','knuth']},
 {id:'lookup',name:'Hashing',short:'Hashing',stage:'organise',why:'Turn a key into a bucket number and you can find things without searching.',prior:['linear'],level:'Core',ids:['hash-function','hash-table'],references:['clrs','knuth']},
 {id:'trees',name:'Trees and graphs',short:'Trees & graphs',stage:'organise',why:'Hierarchies and networks: the shapes behind folders, search trees, maps and the web.',prior:['linear','functions'],level:'Core',ids:['tree','binary-search-tree','graph'],references:['clrs']},
 {id:'searching',name:'Searching',short:'Searching',stage:'search',why:'Look through a list, halve a sorted one, or explore a graph in waves or in depth.',prior:['linear','trees'],level:'Core',ids:['linear-search','binary-search','bfs','dfs','dijkstra'],references:['clrs','dijkstra']},
 {id:'sorting',name:'Sorting',short:'Sorting',stage:'search',why:'Four ways to put things in order, and how many comparisons each one needs.',prior:['linear','searching'],level:'Core',ids:['bubble-sort','insertion-sort','merge-sort','quick-sort'],references:['knuth','clrs']},
 {id:'complexity',name:'Measuring algorithms',short:'Big-O',stage:'search',why:'Compare methods by how their work grows, then use two strategies that change that growth.',prior:['sorting','functions'],level:'Core',ids:['big-o','divide-and-conquer','dynamic-programming'],references:['clrs','knuth']},
 {id:'cpu',name:'The processor and memory',short:'CPU',stage:'machines',why:'A processor repeats one tiny cycle billions of times a second. Memory is layered because speed is expensive.',prior:['logic','algorithms'],level:'Core',ids:['fetch-decode-execute','machine-code','memory-hierarchy','cache'],references:['nand2tetris','patterson']},
 {id:'software',name:'Compilers and operating systems',short:'Systems',stage:'machines',why:'Programs in readable languages are translated or interpreted, and an operating system shares one machine between many of them.',prior:['cpu','trees'],level:'Core',ids:['compiler','interpreter','process','scheduling'],references:['dragon','tanenbaum']},
 {id:'internet',name:'How the internet works',short:'Internet',stage:'networks',why:'Messages travel as packets, find their way by address, arrive reliably, and are named and requested in human terms.',prior:['bits','graph-lesson'],level:'Core',ids:['packet','ip-routing','tcp','dns','http'],references:['kurose','rfc791','rfc9293','rfc1034','rfc9110']},
 {id:'security',name:'Encryption and trust',short:'Security',stage:'networks',why:'Scramble messages with keys, share a lock in public, and prove who wrote something.',prior:['internet','bits'],level:'Core',ids:['encryption','public-key','digital-signature'],references:['diffie-hellman','rsa','kurose']},
 {id:'automata',name:'Machines that read',short:'Automata',stage:'theory',why:'The simplest models of computation: a machine with a few states, a pattern language, and a machine with an endless tape.',prior:['algorithms','logic'],level:'Advanced',ids:['finite-automaton','regular-expression','turing-machine'],references:['sipser','turing']},
 {id:'limits',name:'Limits of computation',short:'Limits',stage:'theory',why:'Some questions no program can answer; others may be easy to check but hard to solve.',prior:['automata','complexity'],level:'Advanced',ids:['halting-problem','p-vs-np'],references:['turing','cook','sipser']}
]};
// The lesson "graph-lesson" alias lets a lesson name trees and graphs as prior knowledge.
CURRICULUM.lessons.forEach(l=>{l.prior=l.prior.map(p=>p==='graph-lesson'?'trees':p)});

/* Up/down links: each thread connects the same idea appearing in different places. */
const THREADS=[
 {id:'place-value',name:'Place value and counting',ids:['bit','binary','hexadecimal','bitmap']},
 {id:'tables',name:'An agreed table of meanings',ids:['ascii','unicode','machine-code']},
 {id:'truth',name:'True and false as circuits',ids:['boolean','logic-gate','half-adder','fetch-decode-execute']},
 {id:'choice',name:'Making a choice',ids:['conditional','binary-search-tree','finite-automaton']},
 {id:'repeat',name:'Repetition and steps',ids:['loop','linear-search','bubble-sort','big-o']},
 {id:'self-similar',name:'Solve a smaller copy',ids:['recursion','merge-sort','quick-sort','divide-and-conquer','dynamic-programming']},
 {id:'lifo',name:'Last in, first out',ids:['call-stack','stack','dfs']},
 {id:'fifo',name:'First in, first out',ids:['queue','bfs','scheduling']},
 {id:'halving',name:'Halve the problem',ids:['binary-search','binary-search-tree','tree']},
 {id:'networks-as-graphs',name:'Networks are graphs',ids:['graph','dijkstra','ip-routing','packet']},
 {id:'lookup-fast',name:'Find without searching',ids:['array','hash-function','hash-table','cache','dns']},
 {id:'chains',name:'Follow the pointers',ids:['linked-list','tree']},
 {id:'translate',name:'Translate between languages',ids:['algorithm','compiler','interpreter','turing-machine']},
 {id:'state',name:'Memory of what happened',ids:['variable','process','tcp','http']},
 {id:'one-way',name:'Easy one way, hard the other',ids:['encryption','public-key','digital-signature','p-vs-np']},
 {id:'limits-thread',name:'What machines cannot do',ids:['regular-expression','halting-problem']},
 {id:'layers',name:'Speed versus size',ids:['byte','memory-hierarchy']},
 {id:'functions-thread',name:'Named procedures',ids:['function','call-stack']},
 {id:'insert',name:'Insert into order',ids:['insertion-sort','binary-search-tree']},
];

const SOURCES={
 'code':{title:'Charles Petzold, Code: The Hidden Language of Computer Hardware and Software (2nd edn, 2022)'},
 'cs-unplugged':{title:'CS Unplugged — computer science without a computer',url:'https://www.csunplugged.org/'},
 'unicode':{title:'The Unicode Standard',url:'https://www.unicode.org/standard/standard.html'},
 'nand2tetris':{title:'Nisan and Schocken, The Elements of Computing Systems (Nand to Tetris)',url:'https://www.nand2tetris.org/'},
 'sicp':{title:'Abelson and Sussman, Structure and Interpretation of Computer Programs'},
 'clrs':{title:'Cormen, Leiserson, Rivest and Stein, Introduction to Algorithms'},
 'knuth':{title:'Donald Knuth, The Art of Computer Programming'},
 'dijkstra':{title:'E. W. Dijkstra, “A note on two problems in connexion with graphs”, Numerische Mathematik (1959)'},
 'patterson':{title:'Patterson and Hennessy, Computer Organization and Design'},
 'dragon':{title:'Aho, Lam, Sethi and Ullman, Compilers: Principles, Techniques, and Tools'},
 'tanenbaum':{title:'Andrew Tanenbaum and Herbert Bos, Modern Operating Systems'},
 'kurose':{title:'Kurose and Ross, Computer Networking: A Top-Down Approach'},
 'rfc791':{title:'RFC 791 — Internet Protocol',url:'https://www.rfc-editor.org/rfc/rfc791'},
 'rfc9293':{title:'RFC 9293 — Transmission Control Protocol',url:'https://www.rfc-editor.org/rfc/rfc9293'},
 'rfc1034':{title:'RFC 1034 — Domain names: concepts and facilities',url:'https://www.rfc-editor.org/rfc/rfc1034'},
 'rfc9110':{title:'RFC 9110 — HTTP Semantics',url:'https://www.rfc-editor.org/rfc/rfc9110'},
 'diffie-hellman':{title:'Diffie and Hellman, “New directions in cryptography” (1976)'},
 'rsa':{title:'Rivest, Shamir and Adleman, “A method for obtaining digital signatures and public-key cryptosystems” (1978)'},
 'sipser':{title:'Michael Sipser, Introduction to the Theory of Computation'},
 'turing':{title:'A. M. Turing, “On computable numbers, with an application to the Entscheidungsproblem” (1936)'},
 'cook':{title:'Stephen Cook, “The complexity of theorem-proving procedures” (1971)'},
};

/* Header textures: a quiet stage cue, not a difficulty rating. */
const TEXTURES={
 represent:{w:24,h:24,tile:'<circle cx="12" cy="12" r="1.5" fill="currentColor"/>'},
 instruct:{w:28,h:28,tile:'<path d="M-14 28L14 0M14 28L42 0" fill="none" stroke="currentColor" stroke-width="1.2"/>'},
 organise:{w:28,h:28,tile:'<path d="M28 0H0V28" fill="none" stroke="currentColor" stroke-width="1.1"/>'},
 search:{w:40,h:40,tile:'<path d="M4 40V28M12 40V18M20 40V32M28 40V10M36 40V22" fill="none" stroke="currentColor" stroke-width="1.6"/>'},
 machines:{w:48,h:48,tile:'<path d="M0 12H18V30H36M24 0V8M24 48V36H48M6 48V36" fill="none" stroke="currentColor" stroke-width="1.1"/><circle cx="18" cy="12" r="2.4" fill="currentColor"/><circle cx="36" cy="30" r="2.4" fill="currentColor"/><circle cx="24" cy="36" r="2.4" fill="currentColor"/>'},
 networks:{w:66,h:38.105,tile:(()=>{let o='';for(const [x,y] of [[0,0],[0,38.105],[33,19.0525],[66,0],[66,38.105]]){o+=`<polygon points="${range(6).map(i=>{const a=i*Math.PI/3;return (x+22*Math.cos(a)).toFixed(2)+','+(y+22*Math.sin(a)).toFixed(2)}).join(' ')}" fill="none" stroke="currentColor" stroke-width="1.1"/>`}return o})()},
 theory:{w:90,h:77.9423,tile:(()=>{const ps=[],mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];(function d(a,b,c,n){if(!n){ps.push(`M${a[0].toFixed(2)} ${a[1].toFixed(2)}L${b[0].toFixed(2)} ${b[1].toFixed(2)}L${c[0].toFixed(2)} ${c[1].toFixed(2)}Z`);return}const ab=mid(a,b),bc=mid(b,c),ca=mid(c,a);d(a,ab,ca,n-1);d(ab,b,bc,n-1);d(ca,bc,c,n-1)})([0,77.9423],[45,0],[90,77.9423],4);return `<path d="${ps.join('')}" fill="currentColor"/>`})()},
};
