export default class PriorityQueue<T> {
  private heap: { item: T; priority: number }[] = [];

  enqueue(item: T, priority: number) {
    this.heap.push({ item, priority });
    this.bubbleUp();
  }

  dequeue(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0].item;
    const end = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.bubbleDown();
    }
    return top;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private bubbleUp() {
    let i = this.heap.length - 1;
    const element = this.heap[i];
    while (i > 0) {
      const parentIdx = Math.floor((i - 1) / 2);
      if (this.heap[parentIdx].priority <= element.priority) break;
      this.heap[i] = this.heap[parentIdx];
      i = parentIdx;
    }
    this.heap[i] = element;
  }

  private bubbleDown() {
    let i = 0;
    const length = this.heap.length;
    const element = this.heap[0];

    while (true) {
      let leftIdx = 2 * i + 1;
      let rightIdx = 2 * i + 2;
      let swap = null;

      if (leftIdx < length) {
        if (this.heap[leftIdx].priority < element.priority) {
          swap = leftIdx;
        }
      }

      if (rightIdx < length) {
        if (
          this.heap[rightIdx].priority < (swap === null ? element.priority : this.heap[leftIdx].priority)
        ) {
          swap = rightIdx;
        }
      }

      if (swap === null) break;
      this.heap[i] = this.heap[swap];
      i = swap;
    }

    this.heap[i] = element;
  }
}
