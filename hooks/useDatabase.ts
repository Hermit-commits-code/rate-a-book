import * as SQLite from "expo-sqlite";
export async function getBooks(): Promise<any[]> {
  if (!db) {
    return [];
  }
  const result = await db.getAllAsync("SELECT * FROM books;");
  // Parse tags from JSON string to array
  return result.map((row: any) => ({
    ...row,
    tags: row.tags ? JSON.parse(row.tags) : [],
  }));
}

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase() {
  db = await SQLite.openDatabaseAsync("books.db");
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS books (
      id INTEGER PRIMARY KEY NOT NULL,
      photo TEXT,
      description TEXT,
      rating INTEGER,
      tags TEXT,
      category TEXT
    );
  `);
}

export async function addBook(
  book: {
    photo: string;
    description: string;
    rating: number;
    tags: string[];
    category: string;
  },
  callback?: () => void
) {
  if (!db) return;
  await db.runAsync(
    `INSERT INTO books (photo, description, rating, tags, category) VALUES (?, ?, ?, ?, ?);`,
    book.photo,
    book.description,
    book.rating,
    JSON.stringify(book.tags),
    book.category
  );
  if (callback) callback();
}
