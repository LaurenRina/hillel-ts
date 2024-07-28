function filterArray<TArray, TCondition> (array: TArray[], condition: TCondition): TArray[] {
  function useCondition(): void {
    condition != null;
  }
  return array.filter(useCondition);
}

class Stack<T> {
  private items: T[] = [];

  public push(item: T): void {
    this.items.push(item);
  }

  public pop(): void {
    this.items.pop();
  }

  public peek(): void {
    this.items[0];
  }
}

class Dictionary<K extends string, V> {
  private arr: {[key: string]: V} = {};

  public set(key: K, value: V): void {
    this.arr[key] = value;
  }

  public get(): void {
    console.log(Object.getOwnPropertyNames(this.arr));
  }

  public has(): void {
    for (let key in this.arr) {
      if (this.arr.hasOwnProperty(key)) {
        console.log("Key:", key, ", Value:", this.arr[key]);
      }
    }
  }
}