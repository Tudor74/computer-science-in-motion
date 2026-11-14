/* Stage 6 · Networks: one lesson per term, in route order. */
LESSON({id:'packet',name:'Packets and layers',short:'Packets',stage:'networks',level:'Core',
 why:'Messages cross the internet as small numbered packets, wrapped in layers of headers, checked for damage, and limited by both bandwidth and latency.',
 prior:['bit','byte','graph'],references:['kurose','rfc791'],ids:['packet','encapsulation','checksum','bandwidth-latency']});
LESSON({id:'ip-routing',name:'Addresses and routing',short:'Routing',stage:'networks',level:'Core',
 why:'Every packet carries an IP address; masks decide who is local, home routers share one public address, and a countdown stops lost packets circling for ever.',
 prior:['packet','boolean','bfs'],references:['kurose','rfc791'],ids:['ip-routing','subnet-mask','nat','ttl-traceroute']});
LESSON({id:'tcp',name:'Reliable delivery with TCP',short:'TCP',stage:'networks',level:'Core',
 why:'TCP turns an unreliable network into a reliable stream: it opens a connection, keeps several segments in flight, and slows down when the network is congested.',
 prior:['packet','ip-routing','queue'],references:['kurose','rfc9293'],ids:['tcp','tcp-handshake','sliding-window','congestion-control']});
LESSON({id:'dns',name:'Names and DNS',short:'DNS',stage:'networks',level:'Core',
 why:'DNS turns names into addresses through a hierarchy of servers, with different record types and caching controlled by a time to live.',
 prior:['ip-routing','tree','cache'],references:['kurose','rfc1034'],ids:['dns','dns-records','dns-ttl']});
LESSON({id:'http',name:'The web and HTTP',short:'HTTP',stage:'networks',level:'Core',
 why:'The web is requests and responses: URLs say what to fetch, cookies add memory to a forgetful protocol, and TLS makes it private.',
 prior:['tcp','dns'],references:['kurose','rfc9110'],ids:['http','url-anatomy','cookies','tls-handshake']});
LESSON({id:'encryption',name:'Secret-key encryption',short:'Encryption',stage:'networks',level:'Core',
 why:'Scramble messages with a shared key: see why the Caesar cipher falls to counting, why a one-time pad is perfect only once, and why block ciphers need chaining.',
 prior:['ascii','boolean','bitmap'],references:['kurose','code'],ids:['encryption','one-time-pad','frequency-analysis','block-modes']});
LESSON({id:'public-key',name:'Public-key cryptography',short:'Public key',stage:'networks',level:'Advanced',
 why:'Strangers can agree secrets and lock messages in public, because some calculations are easy one way and hard to undo.',
 prior:['encryption','big-o'],references:['diffie-hellman','rsa'],ids:['public-key','diffie-hellman','factoring']});
LESSON({id:'digital-signature',name:'Signatures and trust',short:'Signatures',stage:'networks',level:'Advanced',
 why:'Hashes fingerprint messages, signatures prove who wrote them, and certificates chain that proof to authorities your browser already trusts.',
 prior:['public-key','hash-function'],references:['rsa','kurose'],ids:['digital-signature','hash-avalanche','certificate-chain','man-in-the-middle']});

THREAD({id:'nw-xor',name:'XOR at work',ids:['half-adder','one-time-pad','block-modes']});
THREAD({id:'nw-fingerprint',name:'Fingerprints of data',ids:['hash-function','checksum','hash-avalanche']});
THREAD({id:'nw-mask',name:'Bitwise AND as a filter',ids:['boolean','subnet-mask']});
THREAD({id:'nw-remember',name:'Remember answers for a while',ids:['cache','dns-ttl','cookies']});
THREAD({id:'nw-oneway',name:'Easy forwards, hard backwards',ids:['diffie-hellman','factoring','p-vs-np']});
THREAD({id:'nw-trust',name:'Proving who you are talking to',ids:['tls-handshake','certificate-chain','man-in-the-middle']});
THREAD({id:'nw-flow',name:'Rates and queues',ids:['queue','sliding-window','congestion-control']});
THREAD({id:'nw-speed',name:'Speed has two sides',ids:['memory-hierarchy','bandwidth-latency']});
THREAD({id:'nw-tables',name:'Lookup tables',ids:['hash-table','nat','dns-records']});
THREAD({id:'nw-parse',name:'Reading structured text',ids:['regular-expression','url-anatomy']});
THREAD({id:'nw-count',name:'Counting reveals patterns',ids:['ascii','frequency-analysis']});
THREAD({id:'nw-wrap',name:'Last added, first removed',ids:['call-stack','encapsulation']});
THREAD({id:'nw-states',name:'Machines that change state',ids:['finite-automaton','tcp-handshake']});
THREAD({id:'nw-hops',name:'One hop at a time',ids:['linked-list','ttl-traceroute']});
