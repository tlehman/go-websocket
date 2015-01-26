describe("ComponentMap", function() {
    //      1  2  3  4  5
    //    1    .  o  o  o
    //    2    .  .
    //    3     
    var p12 = new Pair(1,2); //  ---
    var p22 = new Pair(2,2); //     \___ black component
    var p23 = new Pair(2,3); //  ___/

    var p13 = new Pair(1,3); //  ---
    var p14 = new Pair(1,4); //     \___ white component
    var p15 = new Pair(1,5); //  ___/

    var graph = new Graph([new Set([p12,p22]), new Set([p22,p23]), new Set([p13,p14]), new Set([p14,p15])]);

    it("counts the number of connected components in a graph", function() {
        var connComp = new ComponentMap(graph, 9);
        expect(connComp.numberComponents).toEqual(2);
    });
});

