describe("Graph", function() {
	it("can be built from a bunch of edges", function() {
        //      1  2  3  4
        //    1    .  o
        //    2    .  .
        //    3    .
        var p12 = new Pair(1,2),
            p22 = new Pair(2,2),
            p23 = new Pair(2,3),
            p32 = new Pair(3,2);
        var G = new Graph([new Set([p12,p22]), new Set([p22,p32]), new Set([p22,p23])]);
        expect(G.vertices.equals(new Set([p12,p22,p23,p32]))).toBe(true);
    });

    it("has an addEdge method that adds vertices", function() {
        var g = new Graph;
        g.addEdge(new Set([1,2]));
        g.addEdge(new Set([1,3]));
        expect(g.vertices.equals(new Set([1,3,2]))).toBe(true);
    });

    it("has a neighborsOf method", function() {
        var g = new Graph([new Set([1,2]), new Set([1,3])]);
        var neighbors = g.neighborsOf(1);
        console.log(neighbors.toString());
        expect(neighbors.equals(new Set([2,3]))).toBe(true);
    });

    it("has a toString method that produces an edge list representation", function() {
        var p12 = new Pair(1,2),
            p22 = new Pair(2,2),
            p23 = new Pair(2,3),
            p32 = new Pair(3,2);
        var G = new Graph([new Set([p12,p22]), new Set([p22,p32]), new Set([p22,p23])]);
        //expect(G.toString()).toBe("{{1,2}->{2,2}, {2,2}->{3,2}, {2,2}->{2,3}}")
    });
});

