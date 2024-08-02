type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? 
  DeepReadonly<T[P]> : T[P];
}

type DeepRequireReadonly<T> = {
  readonly [P in keyof T]-?: T[P] extends object ? 
  DeepReadonly<T[P]> : T[P];
}

type UpperCaseKeys<T> = {
  [K in T & string as Uppercase<K>]: K
}

type ObjectToPropertyDescriptorN<T extends object> = {
  [K in keyof T]: {
    value: T[K];
    writable: boolean;
    enumerable: boolean;
    configurable: boolean;
  }
}



