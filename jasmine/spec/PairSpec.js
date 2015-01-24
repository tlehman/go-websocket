describe("Pair", function() {
    it("has an equals method that behaves well", function() {
        var P = new Pair(2,3);
        var Q = new Pair(2,3);

        expect(P.equals(Q)).toBe(true);
    });

    var x = {a: [42,87], b: "heisenborg"}
    var y = {c: 2}
    var A = new Pair(x,y);

    it("has an left method that returns a reference to the left", function() {
        expect(A.left()).toBe(x);
    });

    it("has a right method that returns a reference to the right", function() {
        expect(A.right()).toBe(y);
    });

    it("has a toString method that returns a standard representation of a pair", function() {
        var P = new Pair(3,10);
        expect(P.toString()).toBe("(3,10)");
    });
});

