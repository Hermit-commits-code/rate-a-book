import * as SQLite from "expo-sqlite";
export async function deleteBook(bookId: number) {
  if (!db) {
    console.error("Database not initialized. Call initDatabase() first.");
    return;
  }
  try {
    await db.runAsync("DELETE FROM books WHERE id = ?;", bookId);
  } catch (err) {
    console.error("Error deleting book:", err);
  }
}
export async function getBooks(): Promise<any[]> {
  if (!db) {
    console.error("Database not initialized. Call initDatabase() first.");
    return [];
  }
  try {
    const result = await db.getAllAsync("SELECT * FROM books;");
    // Parse tags and genres from JSON string to array
    return result.map((row: any) => ({
      ...row,
      tags: row.tags ? JSON.parse(row.tags) : [],
      genres: row.genres
        ? JSON.parse(row.genres)
        : row.category
        ? [row.category]
        : [],
    }));
  } catch (err) {
    console.error("Error fetching books:", err);
    return [];
  }
}

let db: SQLite.SQLiteDatabase | null = null;

export async function initDatabase() {
  try {
    db = await SQLite.openDatabaseAsync("books.db");
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY NOT NULL,
        photo TEXT,
        description TEXT,
        rating INTEGER,
        tags TEXT,
        category TEXT,
        genres TEXT
      );
    `);
    // Migration: If genres column doesn't exist, add it
    const columns = await db.getAllAsync("PRAGMA table_info(books);");
    const hasGenres = columns.some((col: any) => col.name === "genres");
    if (!hasGenres) {
      await db.execAsync("ALTER TABLE books ADD COLUMN genres TEXT;");
      // Migrate existing books: set genres to [category] for each book
      await db.execAsync(
        "UPDATE books SET genres = json_array(category) WHERE category IS NOT NULL;"
      );
    }
  } catch (err) {
    console.error("Error initializing database:", err);
    db = null;
  }
}

export async function addBook(
  book: {
    photo: string;
    description: string;
    rating: number;
    tags: string[];
    category: string;
    genres: string[];
  },
  callback?: () => void
) {
  if (!db) {
    console.error("Database not initialized. Call initDatabase() first.");
    return;
  }
  try {
    await db.runAsync(
      `INSERT INTO books (photo, description, rating, tags, category, genres) VALUES (?, ?, ?, ?, ?, ?);`,
      book.photo,
      book.description,
      book.rating,
      JSON.stringify(book.tags),
      book.category,
      JSON.stringify(
        book.genres && book.genres.length ? book.genres : [book.category]
      )
    );
    if (callback) callback();
  } catch (err) {
    console.error("Error adding book:", err);
  }
}
