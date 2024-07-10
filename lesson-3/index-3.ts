interface IShape {
  name: string;
  color: string;
  calculateArea(): number;
}

interface IArea {
  printArea(): string; 
}


abstract class Shape {
  constructor (
    public readonly name: string,
    public readonly color: string, 
  ) {}

  abstract calculateArea(): number;
}

class Circle extends Shape implements IShape, IArea {
  constructor (
    name: 'circle',
    color: 'yellow',
    public side: number
  ) {
    super (name, color);
  }

  public calculateArea(): number {
    let area = Math.PI * this.side ** 2; 
    return Math.round(area); 
  };

  public printArea(): string {
    return 'π * r2'; 
  };
}

class Rectangle extends Shape implements IShape, IArea {
  constructor (
    name: 'rectangle',
    color: 'purple',
    public side: number, 
    public side2: number
  ) {
    super (name, color);
  }

  public calculateArea(): number {
    return this.side * this.side2; 
  };

  public printArea(): string {
    return 'a * b'; 
  };
}

class Square extends Shape implements IShape {
  constructor (
    name: 'square',
    color: 'blue',
    public side: number
  ) {
    super (name, color);
  }

  public calculateArea(): number {
    return this.side ** 2; 
  };
}

class Triangle extends Shape implements IShape {
  constructor (
    name: 'triangle',
    color: 'green',
    public side: number, 
    public height: number 
  ) {
    super (name, color);
  }

  public calculateArea(): number {
    return 0.5 * this.side * this.height; 
  };
}