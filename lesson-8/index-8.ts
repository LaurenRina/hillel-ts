type Type1<T>  = T extends (...args: any[]) => infer R ? R : never;

type Type2<T> = T extends (...args: infer P) => infer R ? [R, P] : never 
