class School {
  // implement 'add area', 'remove area', 'add lecturer', and 'remove lecturer' methods

  _areas: string[] = [];
  _lecturers: object[] = []; // Name, surname, position, company, experience, courses, contacts

  get areas(): string[] {
    return this._areas;
  }

  get lecturers(): object[] {
    return this._lecturers;
  }

  addArea(area: string): void {
    this._areas.push(area);
  }

  removeArea(area: string): void {
    let indexToRemove = this._areas.indexOf(area);
    this._areas.splice(indexToRemove, 1);
  }

  addLecturer(lecturer: object): void {
    this._lecturers.push(lecturer);
  }

  removeLecturer(lecturer: object): void {
    let indexToRemove = this._lecturers.indexOf(lecturer);
    this._lecturers.splice(indexToRemove, 1);
  }
}

class Area {
  // implement getters for fields and 'add/remove level' methods
  _levels: object[] = [];
  _name: string;

  constructor(name: string) {
    this._name = name;
  }

  get name(): string {
    return this._name;
  }

  get levels(): object[] {
    return this._levels;
  }

  addLevel(level: object): void {
    this._levels.push(level);
  }

  removeLevel(level: object): void {
    let indexToRemove = this._levels.indexOf(level);
    this._levels.splice(indexToRemove, 1);
  }
}

class Level {
  // implement getters for fields and 'add/remove group' methods

  _groups: object[] = [];
  _name: string;
  _description: string;

  constructor(name: string, description: string) {
    this._name = name;
    this._description = description;
  }

  get groups(): object[] {
    return this._groups;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  addGroup(group: object): void {
    this._groups.push(group);
  }

  removeGroup(group: object): void {
    let indexToRemove = this._groups.indexOf(group);
    this._groups.splice(indexToRemove, 1);
  }
}

class Group {
  // implement getters for fields and 'add/remove student' and 'set status' methods

  directionName: string; 
  levelName: string;
  _area: string;
  _status: string;
  _students: any = []; //_students: string[] = [] 
// Modify the array so that it has a valid toSorted method*

  constructor(directionName: string, levelName: string, area: string, status: string) {
    this.directionName = directionName;
    this.levelName = levelName;
    this._area = area;
    this._status = status;
  }

  get area(): string {
    return this._area;
  }

  get status(): string {
    return this._status;
  }

  get students(): string[] {
    return this._students;
  }

  setStatus(status: string): void {
    this._status = status;
  }

  addStudent(student: string): void {
    this._students.push(student);
  }

  removeStudent(student: string): void {
    let indexToRemove = this._students.indexOf(student);
    this._students.splice(indexToRemove, 1);
  }

  showPerformance(): void {
    const sortedStudents = this._students.toSorted(
        (a: any, b: any) => b.getPerformanceRating() - a.getPerformanceRating()
    );
    return sortedStudents;
  }
}

class Student {
  // implement 'set grade' and 'set visit' methods
  _firstName: string;
  _lastName: string;
  _birthYear: number;
  _grades: {
    workName: string,
    mark: number
  }[] = []; // workName: mark
  _visits: {
    lesson: string,
    present: boolean
  }[] = []; // lesson: present

  constructor(firstName: string, lastName: string, birthYear: number) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._birthYear = birthYear;
  }

  get fullName(): string {
    return `${this._lastName} ${this._firstName}`;
  }

  set fullName(value: string) {
    [this._lastName, this._firstName] = value.split(' ');
  }

  get age(): number {
    return new Date().getFullYear() - this._birthYear;
  }

  setGrade(grade: {
    workName: string,
    mark: number
  }[]): void {
    this._grades = grade;
  }

  setVisits(visits: {
    lesson: string,
    present: boolean
  }[]): void {
    this._visits = visits;
  }

  getPerformanceRating(): number {
    const gradeValues: any = Object.values(this._grades);

    if (!gradeValues.length) return 0;

    const averageGrade = gradeValues.reduce((sum: number, grade: number) => sum + grade, 0) / gradeValues.length;
    const attendancePercentage = (this._visits.filter(present => present).length / this._visits.length) * 100;

    return (averageGrade + attendancePercentage) / 2;
  }
}