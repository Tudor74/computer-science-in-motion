# Dimensions In Motion: brief for era authors

Dimensions In Motion runs on the shared In Motion engine, on branch `dimensions`, with sound available but rarely needed. It is a course on space beyond three dimensions: how mathematicians learned to count dimensions, build and see four-dimensional shapes, describe surfaces and curved spaces from inside, classify higher manifolds, and use many-dimensional spaces in science and data. Follow the order of discovery within each era, and let each era build on the ones before it.

The course is built around shapes and spaces the learner can make and measure on a screen:
- objects built step by step: a point slid into a segment, a square, a cube and a tesseract; edges of a square glued into a torus; a two-joint arm swept out into its torus of positions
- objects turned and sliced: a tesseract passing through 3-space, rotating in the xw plane, unfolding into its net of eight cubes; a sphere passing through Flatland
- counts and measurements the learner can check: vertices, edges and faces of polytopes by formula and by counting; V − E + F on any cut-up surface; a triangle's angle sum on a sphere; a coastline measured with shorter and shorter rulers
- surprises the learner predicts first and then computes: the volume of the unit n-ball, the angle between random directions, how far a cube's corners reach

Where the learner predicts or measures, draw their answer next to the computed one.

**Every number on screen is computed.** No count, volume, angle or coordinate is typed into a scene as a literal: vertex, edge and face counts of an n-cube come from 2^(n−k)·C(n,k) (and, where the shape is drawn, from counting its generated vertex and edge lists, which must agree with the formula); Euler characteristics come from counting the cells of the drawn complex; ball volumes from π^(n/2)/Γ(n/2+1); angles from dot products of the vectors drawn. The only literals allowed are historical facts (dates, published measurements such as Richardson's coastline data, record bounds) and they carry a `research` line. When a number is large, compute it exactly (BigInt where needed) and format it; when it is rounded, say to how many places.

**Read first**
- `docs/HCI-BRIEF.md`: general rules, `LESSON` fields, research lines, experiments, text and 3D.
- `docs/MIND-BRIEF.md`: rules for the learner as participant (privacy, no deception), and how to present work that must not be re-run.
- `docs/MUSIC-BRIEF.md`: sound rules (`AUDIO` only from `on` handlers).
- `docs/PHYSICS-BRIEF.md`: the physics course's route, including its relativity lessons, which this course links to for the physics.
- `docs/SENSES-BRIEF.md` on branch `senses` (`git show senses:docs/SENSES-BRIEF.md`): the safety rules this course inherits, chiefly no flicker.

**Reference scenes**
- `git show main:src/scenes-1-represent.js` and `git show main:src/scenes-4-search.js`: the Watch/Try it pattern, `trace`, `hit()`, `three()`, `LESSON()` and `WORD()`.
- `git show physics:src/scenes-8-modern.js` (Physics' `special-relativity` and `general-relativity`). Link to it rather than repeat the physics.
- `git show main:src/scenes-3-organise.js` (CS's `graph`): graphs as vertices and edges, useful for polytope skeletons and for persistent homology.
- `git show hci:src/scenes-2-pointing.js` (a timed experiment), if an era asks the learner to estimate before it reveals.

## The route: fixed lesson ids

Each lesson id is also the id of the lesson's first scene. `prior` and `THREAD` entries may use any of these ids, across eras.

| Era (stage id) | Lessons |
| --- | --- |
| 1 `count` | coordinates, degrees-of-freedom, flatland, shadows-projection, n-distance, what-is-dimension |
| 2 `polytope` | building-cubes, counting-parts, simplex-cross, regular-polytopes, special-polytopes, euler-formula |
| 3 `seeing` | slicing, schlegel-diagrams, rotation-4d, unfolding-nets, hinton-cubes, stereographic |
| 4 `surface` | manifold-idea, gluing-diagrams, orientability, klein-projective, euler-genus, surface-classification |
| 5 `curvature` | theorema-egregium, non-euclidean, geodesics, riemann-lecture, spacetime, curvature-inside |
| 6 `manifold` | three-manifolds, poincare-conjecture, geometrisation, knots-4d, exotic-spheres, dimension-four |
| 7 `surprise` | ball-volume, near-surface, nearly-perpendicular, sphere-packing, curse-dimensionality, cube-corners |
| 8 `work` | configuration-space, phase-space, data-dimensions, fractal-dimension, persistent-homology, extra-dimensions |

In era 4, `euler-genus` comes before `surface-classification` because the classification is stated in terms of the Euler characteristic. Two ids resemble lessons elsewhere in the family (Physics' `special-relativity` and `general-relativity` sit behind `spacetime` and `curvature-inside`; CS has `graph`). The courses are separate pages, so ids do not clash; go further here and point to the other course for what it has done.

### Lesson notes

"Conjecture", "open", "unconfirmed" and "debated" below are instructions: say so on screen, in the scene's `definition`, `example` or `research` line.

**Era 1: counting dimensions**
- `coordinates`: Descartes's *La Géométrie* (1637) and Fermat's work on loci (circulated in the 1630s, printed 1679) turn curves into equations and points into pairs of numbers; a third coordinate for space; a list of n numbers as a point in n dimensions (Cayley 1843, Grassmann 1844). The learner places points by coordinates in 1, 2 and 3 dimensions, then reads a point given as four numbers and sees that nothing about the rule changed.
- `degrees-of-freedom`: Lagrange's *Mécanique analytique* (1788) describes a system by as many independent coordinates as it has freedoms. A bead on a wire (1), a counter on a table (2), a point in space (3), a rigid body in space (6: three for position, three for orientation), a hand or a molecule with many more. The learner adds constraints (a wire, a hinge, a rod) and watches the computed count of freedoms fall. This is the bridge to `configuration-space`.
- `flatland`: Edwin A. Abbott, *Flatland: A Romance of Many Dimensions* (1884), narrated by A. Square; Hinton's essay "What is the Fourth Dimension?" (1880) came first. A sphere passing through the plane appears as a point, a growing circle, a shrinking circle; the circle's radius is computed from the sphere's height, √(r² − h²). Then the analogy one step up: a 4-ball passing through our space appears as a growing and shrinking ball. Mention plainly that Flatland is also a satire of Victorian rules about class and women; no need to dwell. Mark as discredited the 1870s spiritualist use of the fourth dimension (Zöllner's séances with the medium Henry Slade, 1877–78).
- `shadows-projection`: a shadow drops one direction. A cube's shadow under parallel light is a square face-on and a regular hexagon along a long diagonal; compute the outline as the convex hull of the projected corners. Stringham (1880) published the first drawings of projected four-dimensional polytopes. The learner turns a cube and matches its shadow, then is shown a 3D "shadow" of a tesseract and asked what it must be the shadow of.
- `n-distance`: Pythagoras applied one coordinate at a time gives d = √(Σ(xᵢ − yᵢ)²); the diagonal of a unit n-cube is √n; the dot product gives angles in any dimension. The learner adds a dimension at a time to a box and watches the computed diagonal grow (√2, √3, 2, …); in 4D the long diagonal of the unit cube is exactly 2.
- `what-is-dimension`: Cantor's 1877 letter to Dedekind ("Je le vois, mais je ne le crois pas"), matching the points of a square one to one with those of a line by interleaving decimal digits (the learner interleaves digits and sees the matching; flag the 0.0999… = 0.1000… repair Cantor needed). Peano's curve (1890) fills a square continuously but is not one to one. Brouwer (1911) proves no continuous one-to-one matching with continuous inverse exists between spaces of different dimension (invariance of dimension), and in 1913 gives a topological definition of dimension; Lebesgue's covering idea (1911) and Menger and Urysohn (early 1920s) complete the theory. Keep the proofs out; give the statements and the pictures (the learner draws successive stages of a space-filling curve). Say that "dimension" now has several meanings that agree on ordinary spaces (topological, the number of coordinates of a manifold, and the fractal dimensions of era 8).

**Era 2: hypercubes and polytopes**
- `building-cubes`: slide a point to make a segment, the segment to make a square, the square to make a cube, the cube in a fourth perpendicular direction to make a tesseract (Hinton's word, *A New Era of Thought*, 1888). Each step doubles the vertices and adds an edge from each old vertex to its copy. Generate the vertex list as all 0/1 strings of length n and the edges as pairs differing in one place, and draw the tesseract by projection. The learner moves a slider from 0 to 1 to slide the copy out, and steps n from 0 to 5 or 6.
- `counting-parts`: the n-cube has 2^(n−k)·C(n,k) parts of dimension k: choose which k coordinates vary and fix the other n−k at 0 or 1. Tesseract: 16 vertices, 32 edges, 24 squares, 8 cubes. Show a table for n = 0…8 computed from the formula and, for n ≤ 6, from the generated skeleton, with a check mark where they agree. The learner predicts the next row before it is revealed. The recursion f_k(n) = 2·f_k(n−1) + f_(k−1)(n−1) comes straight from the sliding picture.
- `simplex-cross`: the n-simplex (n+1 corners all joined: triangle, tetrahedron, 5-cell) has C(n+1, k+1) parts of dimension k; the cross-polytope (2n corners ±eᵢ: square, octahedron, 16-cell) has 2^(k+1)·C(n, k+1); it is the dual of the n-cube (centres of the cube's faces). The learner builds the simplex by adding a point joined to everything, and the cross-polytope by adding a pair of points on a new axis.
- `regular-polytopes`: Ludwig Schläfli's *Theorie der vielfachen Kontinuität* (written 1850–52, published 1901) finds six regular polytopes in 4D and three in each dimension from 5 up; Schläfli symbols {p,q,r}. Explain why with angles: around an edge of a 4D polytope, the dihedral angles of the cells meeting there must add to less than 360°; compute those angles for each candidate {p,q,r} and let the learner see which survive. Credit Alicia Boole Stott, who without formal training found the 4D regular polytopes' three-dimensional sections and coined the English word "polytope" (1900). H. S. M. Coxeter's *Regular Polytopes* (1948) is the standard reference.
- `special-polytopes`: the 24-cell {3,4,3} (24 octahedral cells; self-dual; no analogue in any other dimension), the 120-cell {5,3,3} (120 dodecahedra, 600 vertices) and the 600-cell {3,3,5} (600 tetrahedra, 120 vertices). Counts (V, E, F, C): 24-cell 24, 96, 96, 24; 120-cell 600, 1200, 720, 120; 600-cell 120, 720, 1200, 600. Generate the coordinates (24-cell: permutations of (±1, ±1, 0, 0); 600-cell vertices from the 120 unit icosians or the standard coordinate list), find edges as nearest-neighbour pairs, and count; never type the counts. The learner turns a projection and highlights one cell and its neighbours. Rendering the 120-cell is costly: precompute in `init` and keep the drawing light.
- `euler-formula`: Euler's V − E + F = 2 (letter to Goldbach 1750, published 1758; Descartes had an equivalent result unpublished); the 4D form V − E + F − C = 0; the alternating sum 1 − (−1)^n for any convex n-polytope (Schläfli stated it; Poincaré proved the general Euler–Poincaré formula, 1893–95). The learner checks it on every polytope from the era, computed from the generated parts, and on a non-convex "picture frame" polyhedron, where it gives 0, previewing `euler-genus`. Mention Lakatos's *Proofs and Refutations* (1976) for the history of counterexamples.

**Era 3: seeing the fourth dimension**
- `slicing`: pass a tesseract through 3-space in a chosen orientation and draw the slice. Cube-first, the slice is a constant cube; edge-first it is a growing and shrinking prism; vertex-first it grows as a tetrahedron, becomes a truncated tetrahedron, and is a regular octahedron at the middle (the slice x₁+x₂+x₃+x₄ = 2 of the unit tesseract). Compute slices by intersecting the hyperplane with the 32 edges and taking the convex hull; do not draw the expected shape by hand. Alicia Boole Stott's sections of the 4D polytopes (1900) are the historical reference. The learner moves the slicing height and switches orientation; the 3D view suits this scene.
- `schlegel-diagrams`: Victor Schlegel (1883, 1886) projects a polytope from a point just outside one cell, so that cell is the frame and the rest sit inside without overlap; compare a perspective projection with a parallel one. The learner moves the viewpoint closer and further and watches the "cube inside a cube" appear and distort. Say that the inner cube is not smaller in 4D: all eight cells are identical.
- `rotation-4d`: rotations in 4D turn a plane (xy, xz, xw, yz, yw, zw: six planes, C(4,2)) and fix the perpendicular plane; a double rotation turns two perpendicular planes at once and fixes only the centre; when both angles are equal the rotation is isoclinic (Clifford). Quaternions describe 4D rotations (Hamilton 1843; Cayley 1855). Compute the number of rotation planes as C(n,2) for any n. The learner sets the two angles with sliders and watches the projected tesseract appear to turn inside out in the xw rotation; explain why (the inner and outer cells swap places). Keep rotation slow: no fast spinning.
- `unfolding-nets`: Dürer's *Underweysung der Messung* (1525) gave nets of polyhedra; a cube has 11 nets; a tesseract has 261 (Turney 1984). Salvador Dalí's *Crucifixion (Corpus Hypercubus)* (1954, Metropolitan Museum of Art) shows one net of eight cubes. The learner folds a cube's net with a slider, then watches the 4D fold that closes the tesseract's net (in projection). Say that Dalí painted a net, a 3D unfolding, not the 4D object.
- `hinton-cubes`: Charles Howard Hinton, *A New Era of Thought* (1888) and *The Fourth Dimension* (1904), taught with sets of coloured cubes: memorise the colours of every slice of a tesseract and build the whole in the mind. Rebuild a simple version: colour each vertex, edge, face and cell of the tesseract by which coordinates vary, and let the learner step through the slices and name the colours. Mark Hinton's wider claims that practice gives a direct perception of 4D as his own, not established.
- `stereographic`: stereographic projection maps a sphere minus one point onto flat space, sending circles to circles or lines (Ptolemy and Hipparchus used it for the plane; it works in any dimension). Applied to the 3-sphere in 4D, it lets us draw the Hopf fibration (Hopf 1931): the 3-sphere filled by great circles, any two linked once, one circle for each point of an ordinary 2-sphere. The learner picks points on the 2-sphere and sees their circles appear, linked. With care: the Hopf map is mathematics; mark claims linking it to consciousness or to the shape of the universe as unsupported.

**Era 4: surfaces**
- `manifold-idea`: Riemann's 1854 lecture introduces "manifoldness" (*Mannigfaltigkeit*); the modern definition by charts comes later (Weyl 1913, Whitney 1936). A manifold is locally flat: an atlas of overlapping maps, like a world atlas; a sphere needs at least two charts. The learner zooms into points on a sphere, a torus and a figure-eight curve: zoomed in, the first two look flat, the crossing point of the figure eight never does.
- `gluing-diagrams`: a square with edges glued by arrows: one pair gives a cylinder, both pairs a torus (as in the game *Asteroids*, 1979), one flipped a Klein bottle, both flipped a projective plane; Poincaré's *Analysis Situs* (1895) uses such diagrams. The learner moves a ship off one edge and sees where it comes back; for the torus, it also sees the square rolled into a doughnut in 3D.
- `orientability`: Möbius and Listing found the one-sided strip independently in 1858 (Listing published first, 1861; Möbius in 1865). A non-orientable surface contains a loop that brings a traveller back mirror-reversed. The learner walks a little asymmetric figure round a Möbius strip and round a cylinder, and cuts strips along the middle and a third of the way across to see the results (computed from the gluing, not stored).
- `klein-projective`: Klein's bottle (1882) and the real projective plane; Steiner's Roman surface (1844) and Boy's surface (1901) as immersions in 3-space that must pass through themselves. In 4D they fit without self-intersection: use the extra coordinate as colour, and show that where the 3D picture crosses itself the two sheets have different colours, so in 4D they do not meet. Euler characteristics: Klein bottle 0, projective plane 1.
- `euler-genus`: V − E + F does not depend on how a surface is cut up, so it is a property of the surface: 2 for a sphere, 0 for a torus, 2 − 2g for g handles (orientable), 2 − k for k cross-caps (non-orientable). Lhuilier (1813) noticed that polyhedra with holes break Euler's formula. The learner triangulates a surface (more and more finely, by clicking) and the computed V − E + F never changes. Leads to Gauss–Bonnet in era 5.
- `surface-classification`: every closed surface is a sphere with g handles or a sphere with k cross-caps; orientability and Euler characteristic decide which (Möbius 1863 and Jordan 1866 for the orientable case; Dehn & Heegaard 1907; the first complete rigorous proof Brahana 1921, for triangulated surfaces; Radó proved in 1925 that every surface can be triangulated). Show that a torus with a cross-cap equals three cross-caps (Dyck 1888). The learner cuts and re-glues a gluing diagram and the computed invariants stay the same until it reaches the normal form.

**Era 5: curvature**
- `theorema-egregium`: Gauss, *Disquisitiones generales circa superficies curvas* (1827, printed 1828): the product of principal curvatures (Gaussian curvature) depends only on distances within the surface. Why no flat map of the Earth keeps all distances; why a pizza slice stiffens when you curve it across. A cylinder has zero Gaussian curvature, a sphere of radius r has 1/r², a saddle negative. The learner bends a sheet and sees its computed curvature stay at zero, then tries to flatten a spherical cap.
- `non-euclidean`: Euclid's fifth postulate; Lobachevsky (1829) and János Bolyai (1832) build geometry without it; Gauss had similar unpublished ideas; Beltrami (1868) gives a model on the pseudosphere, Klein (1871) and Poincaré (1882) the disc models. In hyperbolic geometry the angle sum of a triangle is π minus its area (curvature −1); on a sphere of radius 1 it is π plus its area. The learner draws triangles in the Poincaré disc and on a sphere and reads the computed angle sum against the computed area. Escher's *Circle Limit* prints (1958–60), drawn with Coxeter's help, are a good picture.
- `geodesics`: Johann Bernoulli posed finding shortest paths on surfaces (1697–98); Euler (1732) and later Gauss treated them. On a sphere geodesics are great circles; on a cylinder they are helices, straight when unrolled. Show that a geodesic is locally shortest, not always globally (going the long way round a great circle). The learner picks two cities and compares the great circle with the straight line on a Mercator map, distances computed from coordinates.
- `riemann-lecture`: Bernhard Riemann's habilitation lecture, 10 June 1854, "Über die Hypothesen, welche der Geometrie zu Grunde liegen", published by Dedekind in 1868: spaces of any dimension, with distances given by a metric that can vary from place to place, curvature measured in every 2D direction through a point. The number of independent components of the curvature in n dimensions is n²(n²−1)/12: 1, 6, 20 for n = 2, 3, 4 (compute it). Riemann asked whether physical space is curved and said it was a question for experiment.
- `spacetime`: Einstein (1905) and Minkowski's lecture "Raum und Zeit" (Cologne, 1908): events are points in a four-dimensional spacetime, and the interval s² = (ct)² − x² − y² − z² is the same for every observer. Say clearly that time here is a fourth coordinate with a different sign in the geometry, not a fourth direction of space, and that the rest of the course's "fourth dimension" is spatial. The learner boosts a frame and watches coordinates change while the computed interval does not. Einstein's general relativity (1915) makes the spacetime curved; link to Physics In Motion's `special-relativity` and `general-relativity` (`https://physics-in-motion.puter.site/#special-relativity`).
- `curvature-inside`: an inhabitant can measure curvature without leaving the space: angle sums of triangles, the circumference of circles (less than 2πr on a sphere), and parallel transport (Levi-Civita 1917), where an arrow carried round a loop comes back turned by the enclosed curvature (Gauss–Bonnet; Bonnet 1848). The learner carries an arrow round a loop on a sphere and reads the computed turn against the enclosed area. Mark as debated the story that Gauss's survey triangle (Hohenhagen, Brocken, Inselsberg) was meant to test the geometry of space. Cosmological measurements (Planck Collaboration 2018) find the universe's spatial curvature consistent with zero within small error; say this does not decide whether space is finite.

**Era 6: higher manifolds**
- `three-manifolds`: three-dimensional spaces you could live in: the 3-torus (a cube with opposite faces glued; flying out of one face you come back through the opposite one, and you see copies of yourself in every direction); the Poincaré dodecahedral space (Poincaré 1904; described as a dodecahedron with opposite faces glued after a tenth of a turn by Weber & Seifert, 1933). The learner flies through a 3-torus and sees the repeating view, computed by tiling. Mark Luminet et al.'s 2003 proposal of a dodecahedral universe as not supported by later searches for matching circles in the cosmic background (Cornish et al. 2004).
- `poincare-conjecture`: Poincaré (1904) asks whether every closed, simply connected three-manifold is the 3-sphere. Smale proves the analogue for dimensions 5 and up (1961), Freedman for dimension 4 (1982); Hamilton's Ricci flow (1982); Grigori Perelman's preprints (2002–03) finish the proof; checked by Kleiner–Lott, Morgan–Tian and Cao–Zhu (2006); Perelman declined the Fields Medal (2006) and the Clay Millennium Prize (2010). The learner tries to shrink loops on a sphere (they always shrink) and on a torus (some cannot). Do not attempt Ricci flow beyond a cartoon of a curve smoothing under curve-shortening flow, labelled as an analogy.
- `geometrisation`: William Thurston's conjecture (announced 1982): every closed three-manifold can be cut along spheres and tori into pieces, each with one of eight geometries (Euclidean, spherical, hyperbolic, S²×ℝ, H²×ℝ, Nil, Sol, the universal cover of SL(2,ℝ)). Thurston proved it for a large class (Haken manifolds); Perelman's work proved it in full. Most three-manifolds are hyperbolic. The learner looks at the three simplest geometries from inside (triangles' angle sums, from era 5).
- `knots-4d`: Kelvin's vortex atoms (1867) set Tait making knot tables (1870s–80s); the trefoil and figure-eight; knot invariants (Alexander 1928, Jones 1984). In four dimensions every knotted circle comes undone: lift one strand into the fourth direction (shown as colour), move it past the other, put it back. But 2-dimensional spheres can be knotted in 4D (Artin 1925). The learner changes crossings to untie a knot in 3D, then uses the fourth direction instead. Say that whether a given knot is the unknot can be decided by computer (Haken 1961), but no polynomial-time method is known.
- `exotic-spheres`: John Milnor (1956) finds a 7-dimensional manifold that is a sphere topologically but not smoothly; Kervaire & Milnor (1963) count 28 oriented smooth structures on the 7-sphere. Explain "smooth structure" as a choice of which functions count as smooth, with the analogy of a crumpled versus a smooth ball, labelled as an analogy. Give the table of known counts only from Kervaire–Milnor and later published work you are sure of. Mark as open whether the 4-sphere has an exotic smooth structure (the smooth Poincaré conjecture in dimension 4).
- `dimension-four`: Freedman (1982) classifies simply connected closed four-manifolds topologically; Donaldson (1983), using gauge theory from physics, shows many of them have no smooth structure; together they give exotic smooth structures on ℝ⁴ (Gompf; Taubes 1987 shows there are uncountably many), while every ℝⁿ with n ≠ 4 has exactly one. Credit Karen Uhlenbeck's analytic work on gauge theory, on which Donaldson's methods build. Say plainly that why four is special is not fully understood; no claim that it explains why spacetime has four dimensions.

**Era 7: high-dimensional surprises**
- `ball-volume`: V(n) = π^(n/2)/Γ(n/2+1), computed with the recursion V(n) = (2π/n)·V(n−2) from V(0) = 1, V(1) = 2. It peaks at n = 5 (about 5.264) and falls towards 0; the surface area peaks at n = 7. The learner first guesses whether the unit ball's volume grows forever, then plots the computed values for n = 1…30. Explain the fall as each new direction contributing a factor less than one once n > 2π. Date the formula only from a source you are sure of (it was known by the mid-19th century).
- `near-surface`: the fraction of a ball's volume within distance ε of its surface is 1 − (1 − ε)^n, which approaches 1 as n grows: in 100 dimensions 99.997% lies in the outer tenth. The same holds for the cube and for the orange-peel picture. Then concentration of measure (Lévy 1919–22; Milman 1971): on a high-dimensional sphere most of the area is near any equator. The learner samples random points in a ball (seeded `rng`), and the histogram of their computed radii piles up near 1 as n increases.
- `nearly-perpendicular`: the cosine between two random unit vectors in n dimensions has mean 0 and standard deviation 1/√n, so in 1000 dimensions random directions are typically within about 2° of a right angle. The learner draws pairs of random vectors (seeded) and builds the histogram of computed angles for n = 2, 10, 100, 1000. Link forward to `data-dimensions`: this is why random projections (Johnson & Lindenstrauss 1984) preserve distances.
- `sphere-packing`: Kepler's conjecture (1611) that the cannonball packing is densest in 3D, density π/√18 ≈ 0.7405, proved by Hales (1998; published 2005; formally checked by the Flyspeck project, 2014–17). Kissing numbers: 2, 6, 12, 24 in dimensions 1–4 (12 argued by Newton and Gregory in 1694, proved by Schütte & van der Waerden 1953; 24 by Musin 2003), 240 in 8 (the E8 lattice), 196,560 in 24 (the Leech lattice, Leech 1965–67), both settled by Odlyzko & Sloane and by Levenshtein (1979). Maryna Viazovska (2016) proves E8 is the densest packing in 8D, and with Cohn, Kumar, Miller and Radchenko the Leech lattice in 24D (2016–17); Fields Medal 2022. Compute kissing numbers of the drawn lattices by counting shortest vectors (240 for E8 from its root list). Mark as open the densest packing and the kissing number in most dimensions, and give bounds only from sources you are sure of.
- `curse-dimensionality`: Richard Bellman's phrase (*Dynamic Programming*, 1957): covering a space at a fixed spacing needs exponentially many samples (10 per axis gives 10ⁿ). Nearest neighbours become nearly as far as the farthest ones (Beyer et al. 1999); computing the ratio of nearest to farthest distance for random points as n grows shows it. The learner sets the grid spacing and dimension and reads the computed sample count; then sees the distance ratio approach 1. Say that real data often lies near a lower-dimensional set, which is why methods still work.
- `cube-corners`: the unit cube's corners lie √n/2 from its centre while its inscribed ball has radius 1/2; the inscribed ball's share of the cube's volume, V(n)/2ⁿ, falls to 0. The classic puzzle: in a cube of side 4 put 2ⁿ unit balls at the corners; the central ball touching them all has radius √n − 1, which pokes out of the cube once n > 9. The learner raises n and watches the computed central radius cross the wall. Corners carry most of the cube's volume in high dimensions.

**Era 8: dimensions at work**
- `configuration-space`: the space of all positions of a system. A two-joint planar arm has two angles, each wrapping round, so its configuration space is a torus; obstacles in the workspace become forbidden regions on the torus (Lozano-Pérez 1983 for robot motion planning). The learner moves the arm (sliders for the joint angles) and watches its point move on the torus drawn as a square with glued edges, then plans a path round an obstacle. Links to `gluing-diagrams` and `degrees-of-freedom`.
- `phase-space`: positions and momenta together (Liouville 1838; Boltzmann 1872; Gibbs, *Elementary Principles in Statistical Mechanics*, 1902). A pendulum's state is a point in a plane (angle, angular velocity), and its swings are closed curves; N particles in space need 6N dimensions. Poincaré's sections; Lorenz (1963): a three-dimensional system whose orbits settle on a strange attractor. The learner starts the pendulum at different energies and watches the computed orbit in phase space; integrate with a stable method (leapfrog) and show energy stays near constant.
- `data-dimensions`: a table with n columns makes each row a point in n dimensions; Pearson (1901) and Hotelling (1933) find principal components, the directions of greatest spread. The learner rotates a cloud of points to find the view with the most spread, then compares with the computed first component and its explained variance. Use synthetic data generated from a seed, never real personal data. Say that projections and embeddings (PCA, t-SNE 2008, UMAP 2018) can distort distances and clusters (Wattenberg, Viégas & Johnson 2016), and that a picture of an embedding is not proof of structure.
- `fractal-dimension`: Lewis Fry Richardson's measurements of coastlines and borders (published posthumously, 1961): measured length grows as the ruler shrinks; Mandelbrot's "How long is the coast of Britain?" (*Science*, 1967) reads the slope of log length against log ruler as a dimension (about 1.25 for Britain's west coast from Richardson's data); Hausdorff's 1918 definition (published 1919) allows non-whole dimensions. Exact values: Koch curve log 4/log 3 ≈ 1.262, Sierpiński triangle log 3/log 2 ≈ 1.585; compute them by box counting and compare with the formula. The learner measures a generated Koch coastline with shorter rulers and fits the slope. Say that a real coastline's dimension holds only over a range of scales.
- `persistent-homology`: Betti numbers count components, loops and voids (Betti 1871; Poincaré 1895; Emmy Noether's reformulation as groups, 1925, credited). Persistent homology (Edelsbrunner, Letscher & Zomorodian 2000–02; Zomorodian & Carlsson 2005; Carlsson's "Topology and data", 2009) grows balls round data points and records when features are born and die, shown as a barcode (Ghrist 2008). The learner moves the radius over a noisy circle of points and watches the computed barcode: one long loop bar, many short ones. Compute the barcode for small point sets exactly (union-find for components; a small boundary-matrix reduction for loops). Say that results depend on choices of distance and scale and that long bars are evidence, not proof, of real structure.
- `extra-dimensions`: Nordström (1914) and Kaluza (1919 letter to Einstein, published 1921) put gravity in five dimensions and find electromagnetism inside; Oskar Klein (1926) curls the fifth dimension into a tiny circle. String theory needs ten dimensions (M-theory eleven), with six or seven curled up; large extra dimensions (Arkani-Hamed, Dimopoulos & Dvali 1998) would change gravity at short range. The learner walks along a thin cylinder that looks one-dimensional from far away. Mark string theory and all extra dimensions as unconfirmed by experiment: short-range gravity tests and collider searches have found none so far. No claims of evidence for parallel universes.

## Files and naming

- **Your files:** `src/scenes-N-<stageid>.js`, `src/scenes-N-lessons.js` and `src/scenes-N-words.js` (for example `src/scenes-3-seeing.js`). They exist already as placeholders: one card per lesson, so that the build and tests run. Replace all three wholesale, including the `DN_placeholder` helper.
- **Helper names:** every top-level name in your files is prefixed `DN_` (for example `D3_`). All era files share one scope.
- **Source and thread keys:** `dN-<word>` (for example `SOURCE('d2-schlafli',…)`, `THREAD({id:'d2-euler',…})`).
- **Scene ids:** the lesson's first scene has the lesson id; the others are `<lesson-id>-<word>`.
- **Scenes per lesson:** 3, or 4 where the topic is rich.
- **Do not edit:** the engine (`core.js`, `app.js`, `shell.html`), the tests, `curriculum.js`, or other eras' files. If the engine needs a change, say so in your report.
- **Order:** register lessons in route order, with the `id`, `stage` and `prior` ids as in the placeholders.
- **Shared code:** if two eras need the same geometry (n-cube vertex lists, 4D rotation and projection), each era writes its own `DN_` copy; do not reach into another era's helpers.

## Dimensions rules

### Order of discovery
Tell each topic in the order it was found out, with the people, the dates and the argument that changed minds, including the false starts and the doubts (Cantor's disbelief at his own result, the long refusal of non-Euclidean geometry, Lhuilier's polyhedra with holes that broke Euler's formula, the spiritualists' fourth dimension).

### Computed, not typed
Every count, coordinate, angle, length, volume and invariant on screen comes from code that computes it from the shape drawn or from the formula named beside it (see the paragraph at the top). Where a scene states a formula, check it in Try it against a direct count or a simulation. Use seeded `rng()` for random samples so pictures stay deterministic. A test that searches for literal counts is not provided, so check this yourself and report it.

### Link, do not repeat
- Physics In Motion covers special and general relativity (`https://physics-in-motion.puter.site/#special-relativity`, `#general-relativity`). Send the learner there for the physics with a sentence and a `SOURCE` entry, and keep this course on the geometry.
- Computer Science In Motion covers graphs (`https://computer-science-in-motion.puter.site/#graph`).
- Mathematics In Motion (`https://mathematics-in-motion.puter.site/`) is the general mathematics course; link to it for background rather than re-teaching algebra or trigonometry.

### Safety and comfort
- Never flash at more than 3 per second, and avoid large high-contrast flicker (WCAG 2.3.1). Rotating and sliced figures move slowly and smoothly; a 4D rotation never spins fast, and the learner can pause any motion.
- Avoid motion that can cause discomfort: no full-screen zooming or rapid camera swings in the 3D view.
- Sound only from `on` handlers, at the default volume or below; every scene works with sound off.
- Colour is never the only code: where the fourth coordinate is shown as colour (Hinton's cubes, Klein bottle, knots), also show it by label, pattern or a numeric readout.

### Honesty
Mark these as conjecture, open, unconfirmed, debated or wrong:
- string theory, M-theory and any extra dimensions in physics (unconfirmed by experiment)
- the dodecahedral universe and other proposed shapes of space (not supported, or undecided)
- the smooth Poincaré conjecture in dimension 4 (open)
- densest packings and kissing numbers outside the settled dimensions (open)
- Gauss's survey triangle as a test of the geometry of space (debated)
- the fourth dimension as a route to the spirit world (Zöllner and Slade: discredited)
- Hinton's claim that practice gives direct 4D perception (his claim, not established)
- "the fourth dimension is time": in relativity time is a fourth coordinate with its own geometry, not a fourth direction of space
- a tesseract drawing as the tesseract itself: every picture is a projection, slice or net, and say which
- claims tying the Hopf fibration, E8 or exotic spheres to consciousness, a "theory of everything" or the universe's shape (unsupported unless a peer-reviewed source says so, and then label it as a proposal)
- PCA, t-SNE or persistent homology pictures as proof of structure in data

Claims from 2025–2026: include them only if you are certain of the source; otherwise leave them out. Cite only real, checkable work in `research` lines and `SOURCE` entries, and prefer the original paper or book.

### Credit
Credit people often left out:
- Alicia Boole Stott (4D polytope sections; the word "polytope")
- Ludwig Schläfli
- Hermann Grassmann
- János Bolyai
- Emmy Noether (homology as groups)
- Karen Uhlenbeck (gauge theory analysis behind four-dimensional topology)
- Maryam Mirzakhani (geometry of hyperbolic surfaces; Fields Medal 2014), in `non-euclidean` or `surface-classification`
- Maryna Viazovska
- Lewis Fry Richardson
- Oskar Klein and Theodor Kaluza, both, for the fifth dimension

## Sound and 3D

- **Sound:** rarely needed. Possible uses: a soft click each time a slicing plane crosses a vertex, or a tone whose pitch follows a computed quantity; always from `on` handlers and never needed to understand the scene.
- **3D:** this course uses it more than most, since much of it is about seeing. Good cases: a cube's shadow, tesseract slices, a projected tesseract rotating, a folding net, the torus from a gluing diagram, a Klein bottle immersion, a 3-torus fly-through, a two-joint arm's torus. Aim for one or two per era, at most three in era 3. A 4D object is always rotated and projected by the scene's own code, and the 3D view only turns the camera on the projected result; say so in the caption.

## Glossary

- Add `WORD` entries for key terms and people, keyed `person-<surname>`.
- Check `grep -h "key:'" src/scenes-*-words.js` before adding. The placeholders define `dimension`, `polytope`, `tesseract`, `manifold`, `curvature`, `three-manifold`, `unit-ball` and `configuration-space`, one in each era's words file; keep or rewrite your era's entry.
- Every era's words file must keep at least one entry with at least one alias: an empty alias list makes the glossary's word pattern empty and the page loops forever.
- Aliases are matched as whole words, case-insensitively; avoid aliases so common they would link every sentence (not "space", "point" or "line").
- A person belongs to the era where they first appear in the notes above.

## Build and test your era only

```sh
S=<a scratch directory outside the repository>
cd /home/user/dimensions-in-motion
STAGES=N OUT=$S/dN.html python3 build.py
FILE=$S/dN.html SHOTS=$S/shots-dN ALLSHOTS=1 SAMPLE=<one id> timeout 900 node test/check.js
FILE=$S/dN.html timeout 900 node test/text-layout.js 375
FILE=$S/dN.html timeout 900 node test/text-layout.js 320
FILE=$S/dN.html SHOTS=$S/shots-dN timeout 300 node test/three.js
```

A one-era build keeps only that era's lessons, so `prior` ids and `THREAD` scenes from other eras are dropped for the test and return in the full build. `test/timed.js` uses another course's ids; ignore it.

After the tests:
- Look at every `try-*.png` and `three-*.png` and fix what you find.
- Check the models numerically, in a script: n-cube, simplex and cross-polytope part counts against generated skeletons; the 24-, 120- and 600-cell counts and their Euler sums; slice shapes against the hyperplane intersection; V − E + F of every triangulated surface; angle sums against area on the sphere and in the disc; n-ball volumes against the closed form; histogram means and spreads against 1/√n; lattice kissing numbers; box-counting dimensions against log 4/log 3 and log 3/log 2; pendulum energy drift.
- Write scripts with the Write tool, not shell heredocs containing JS.
- Never delete files other than replacing your era's three. Do not commit. Stay on branch `dimensions`.

**Final report:** for each lesson, list its scene ids with one line each: "interaction — why — research cited (status)". Then give the 3D scenes, the numerical checks, the numbers you confirmed are computed rather than typed, the claims labelled as conjecture, open or unconfirmed, the facts you are least sure of, and any problems left.
