describe("Set", function() {
  it("has cardinality", function() {
    var A = new Set([2,3]);
    expect(A.cardinality()).toBe(2);
  });

  it("checks for membership", function() {
    var A = new Set(['to', 'be']);
    expect(A.member('be')).toBe(true);
    expect(A.member('not to be')).toBe(false);
  });

  it("has a subset method that behaves well", function() {
    var O = new Set;
    var A = new Set([1,2]);
    var B = new Set([1,2,3]);

    // empty set is subset of itself and all sets
    expect(O.subset(O)).toBe(true);
    expect(O.subset(A)).toBe(true);
    
    // any set is a subset of itself
    expect(A.subset(A)).toBe(true);
    // A is a subset of B
    expect(A.subset(B)).toBe(true);
    // B is not a subset of A
    expect(B.subset(A)).toBe(false);
  });

  it("has an equals method that behaves well", function() {
    var A = new Set([1,2,3]);
    var B = new Set([2,1,3]);
    var C = new Set([1,1,2,3]);

    // symmetry of equivalence
    expect(A.equals(B)).toBe(true);
    expect(B.equals(A)).toBe(true);

    expect(B.equals(C)).toBe(true);
    expect(C.equals(B)).toBe(true);


    // transitivity of equivalence
    expect(A.equals(C)).toBe(true);
  });

  it("can add elements", function() {
    var A = new Set();
    var B = new Set([2]);
    A.add(2);
    A.add(2);

    expect(A.equals(B));
  });
});

