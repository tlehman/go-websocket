describe("Pair", function() {
  it("has an equals method that behaves well", function() {
    var P = new Pair(2,3);
    var Q = new Pair(2,3);

    expect(P.equals(Q)).toBe(true);
  });

  it("has an left method that returns a reference to the left", function() {
  });

  it("has a right method that returns a reference to the right", function() {
  });
});

