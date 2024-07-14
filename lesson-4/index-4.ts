//1
interface Type {
  [key: string]: number | string;
  [key: number]: number | string;
  [key: symbol]: number | string;
}

//2
interface Func {
  [key: string]: (() => any);
}

//3
interface Arr {
  [key: number]: string[];
}

//4
interface Prop {
  name: string;
  [key: string]: string;
}

//5
interface Index {
  [key: number]: string;
}

interface AddIndex extends Index {
  name: string;
  age: number;
}

//6
function func<T> (obj: {[key: string]: T}): boolean {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] !== 'number') {
        return false;
      }
    }
  }
  return true;
}
