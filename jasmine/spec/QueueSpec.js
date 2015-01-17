describe("Queue", function() {
  it("enqueues elements", function() {
    var q = new Queue();

    q.enqueue(1);
    expect(q.empty()).toBe(false);
  });
});

