// Кожний нотаток має назву, зміст, дату створення і редагування та статус.
// Нотатки бувають двох типів. Дефолтні та такі, які вимагають підтвердження при
// редагуванні.
type NoteType = "default" | "created";

interface INote {
  name: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  status: "pending" | "completed";
  type: NoteType;
}

interface ITodoList {
  notes: INote[];
}

// Окремо необхідно розширити поведінку списку та додати можливість пошуку нотатка
// за ім'ям або змістом.

type Constructor<T = {}> = new (...args: any[]) => T;

interface ISearchByNameContent {
  notes: INote[];
  searchByName(filter: string): INote[];
  searchByContent(filter: string): INote[];
}

function SearchByNameContent<T extends Constructor>(originalClass: T) {
  class ReplacementClass extends originalClass implements ISearchByNameContent {
    notes: INote[];

    constructor(...args: any[]) {
      super(...args);
      this.notes = [];
    }

    searchByName(filter: string): INote[] {
      return this.notes.filter((note: INote) => {
        return note.name.toLowerCase().includes(filter.toLowerCase());
      });
    }

    searchByContent(filter: string): INote[] {
      return this.notes.filter((note: INote) => {
        return note.content.toLowerCase().includes(filter.toLowerCase());
      });
    }
  }

  return ReplacementClass;
}

// Також окремо необхідно розширити список можливістю сортування нотаток за
// статусом або часом створення.

interface ISearchByStatusChangedAt {
  notes: INote[];
  searchByStatus(filter: string): INote[];
  searchByCreatedAt(filter: Date): INote[];
}

function SearchByStatusChangedAt<T extends Constructor>(originalClass: T) {
  class ReplacementClass
    extends originalClass
    implements ISearchByStatusChangedAt
  {
    notes: INote[];

    constructor(...args: any[]) {
      super(...args);
      this.notes = [];
    }

    searchByStatus(filter: "pending" | "completed"): INote[] {
      return this.notes.filter((note: INote) => {
        return note.status.includes(filter);
      });
    }

    searchByCreatedAt(filter: Date): INote[] {
      return this.notes.filter((note: INote) => {
        return note.createdAt.toDateString() === filter.toDateString();
      });
    }
  }

  return ReplacementClass;
}

// Вам необхідно написати додаток Todo list. У списку нотаток повинні бути методи
// для додавання нового запису, видалення, редагування та отримання повної
// інформації про нотатку за ідентифікатором, а так само отримання списку всіх
// нотаток. Крім цього, у користувача має бути можливість позначити нотаток, як
// виконаний, і отримання інформації про те, скільки всього нотаток у списку і
// скільки залишилося невиконаними. Нотатки не повинні бути порожніми.

@SearchByNameContent
@SearchByStatusChangedAt
class TodoList implements ITodoList {
  notes: INote[] = [];

  constructor(notes: INote[]) {
    this.notes = notes;
  }

  addNote(name: string, content: string, type: NoteType = "created"): void {
    if (!name || !content) {
      throw new Error("Name and content are empty.");
    }

    const newNote: INote = {
      name,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "pending",
      type,
    };

    this.notes.push(newNote);
  }

  removeNote(note: INote): INote[] {
    let noteId = this.notes.indexOf(note);
    return this.notes.splice(noteId, 1);
  }

  editNote(note: INote, newName: string, newContent: string): void {
    let noteId = this.notes.indexOf(note);
    let noteToChange = this.notes[noteId];

    if (noteToChange !== undefined && noteToChange.type === "created") {
      const confirmation = confirm(
        `Are you sure you want to edit note "${note.name}"?`
      );
      if (!confirmation) {
        return;
      }
    }

    if (noteToChange !== undefined) {
      noteToChange.name = newName || note.name;
      noteToChange.content = newContent || note.content;
      noteToChange.updatedAt = new Date();
    }
  }

  getNoteInfo(note: INote): INote | undefined {
    let noteId = this.notes.indexOf(note);
    let noteToFind = this.notes[noteId];

    return noteToFind;
  }

  getAllNotesInfo(): INote[] {
    return this.notes;
  }

  markNoteAsDone(note: INote): void {
    let noteId = this.notes.indexOf(note);
    let noteToMark = this.notes[noteId];

    if (noteToMark !== undefined) {
      noteToMark.status = "completed";
      noteToMark.updatedAt = new Date();
    }
  }

  getAllNotesAmount(): number {
    return this.notes.length;
  }

  getUndoneNotesAmount(note: INote): number {
    return this.notes.filter((note) => note.status === "pending").length;
  }
}
