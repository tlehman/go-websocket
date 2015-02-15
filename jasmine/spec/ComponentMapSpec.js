describe("ComponentMap", function() {
    //    1  2  3  4  5  6
    //  1    .  o  o  o  .
    //  2    .  .  .  .  .  <--- black component
    //  3    .
    var p21 = new Pair(2,1); //  ---
    var p22 = new Pair(2,2); //     \___ black component
    var p23 = new Pair(2,3); //     /
    var p32 = new Pair(3,2); //     |
    var p42 = new Pair(4,2); //     |
    var p52 = new Pair(5,2); //     |
    var p62 = new Pair(6,2); //     |
    var p61 = new Pair(6,1); //  ___/

    var p31 = new Pair(3,1); //  ---
    var p41 = new Pair(4,1); //     \___ white component
    var p51 = new Pair(5,1); //  ___/

    var graph = new Graph([new Set([p21,p22]), new Set([p22,p23]),
                           new Set([p22,p32]), new Set([p32,p42]),
                           new Set([p42,p52]), new Set([p52,p62]),
                           new Set([p62,p61]),

                           new Set([p31,p41]), new Set([p41,p51])]);

    it("counts the number of connected components in a graph", function() {
        var connComp = new ComponentMap(graph);
        expect(connComp.numberComponents).toEqual(2);
    });

    it("treats single vertices with no edges as a component", function() {
        var p = new Pair(8,8);
        graph.addVertex(p);
        var connComp = new ComponentMap(graph);
        expect(connComp.numberComponents).toEqual(3);
    });
});

