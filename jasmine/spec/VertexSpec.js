describe("Vertex", function() {
  var vertex;

  it("is empty if color is null", function() {
    vertex = new Vertex(1,2,null);
    expect(vertex.isEmpty()).toBe(true);
  });
});
