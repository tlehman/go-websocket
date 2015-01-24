describe("Queue", function() {
    it("enqueues elements", function() {
        var q = new Queue();

        q.enqueue(1);
        expect(q.empty()).toBe(false);
    });

    it("has a toString method", function() {
        var p = new Queue();
        var q = new Queue();
        
        q.enqueue(1);
        q.enqueue(2);
        q.enqueue(3);

        p.enqueue(new Pair(1,2));
        p.enqueue(new Pair(0,4));
        p.enqueue(new Pair(3,3));

        expect(p.toString()).toBe("[(1,2),(0,4),(3,3)]");
        expect(q.toString()).toBe("[1,2,3]");
    });
});

