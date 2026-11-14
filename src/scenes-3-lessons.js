/* Stage 3 · Organise data: one lesson per term, in route order. */
LESSON({id:'array',name:'Arrays',short:'Arrays',stage:'organise',level:'Core',
 why:'Side-by-side storage puts any index one calculation away, in one, two or three dimensions, and doubling lets an array grow cheaply on average.',
 prior:['byte','loop'],references:['clrs','knuth'],ids:['array','array-2d','array-3d','dynamic-array']});
LESSON({id:'linked-list',name:'Linked lists',short:'Linked lists',stage:'organise',level:'Core',
 why:'Chaining items by pointers makes inserting cheap and lets clever pointer tricks reverse a list or spot a loop with almost no extra memory.',
 prior:['array','variable'],references:['clrs','knuth'],ids:['linked-list','list-reversal','cycle-detection']});
LESSON({id:'stack',name:'Stacks',short:'Stacks',stage:'organise',level:'Core',
 why:'Last in, first out is exactly what nesting, expression evaluation and undo need.',
 prior:['array','call-stack'],references:['clrs','sicp'],ids:['stack','bracket-matching','postfix-evaluation','undo-redo']});
LESSON({id:'queue',name:'Queues',short:'Queues',stage:'organise',level:'Core',
 why:'First in, first out is fair; opening both ends, or serving by priority instead, gives two more essential structures.',
 prior:['stack'],references:['clrs','knuth'],ids:['queue','deque','binary-heap']});
LESSON({id:'hash-function',name:'Hash functions',short:'Hashing',stage:'organise',level:'Core',
 why:'A good hash turns any key into a well-spread number; the same idea detects damaged data.',
 prior:['ascii','array'],references:['clrs','knuth'],ids:['hash-function','hash-spread','checksum']});
LESSON({id:'hash-table',name:'Hash tables',short:'Hash tables',stage:'organise',level:'Core',
 why:'A hash table finds a key in about one step, provided collisions are handled and the table grows before it gets crowded.',
 prior:['hash-function','linked-list'],references:['clrs','knuth'],ids:['hash-table','linear-probing','load-factor']});
LESSON({id:'tree',name:'Trees',short:'Trees',stage:'organise',level:'Core',
 why:'Hierarchies are everywhere; visiting every node in a chosen order, and sharing prefixes, are the first things to do with them.',
 prior:['linked-list','recursion'],references:['clrs','knuth'],ids:['tree','tree-traversal','trie']});
LESSON({id:'binary-search-tree',name:'Binary search trees',short:'Search trees',stage:'organise',level:'Core',
 why:'Keeping smaller keys left and larger keys right makes searching fast, as long as deletions keep the order and the tree stays balanced.',
 prior:['tree','conditional'],references:['clrs','knuth'],ids:['binary-search-tree','bst-deletion','bst-balance']});
LESSON({id:'graph',name:'Graphs',short:'Graphs',stage:'organise',level:'Core',
 why:'Networks of things and links can be stored as a grid or as lists, and their shape (pieces, loops, trees) decides what can be done with them.',
 prior:['tree','array'],references:['clrs','dijkstra'],ids:['graph','adjacency-matrix','graph-connectivity']});
