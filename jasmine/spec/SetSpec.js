describe("Set", function() {
  it("has a cardinality", function() {
    var A = new Set([2,3]);
    expect(A.cardinality()).toBe(2);
  });
});

