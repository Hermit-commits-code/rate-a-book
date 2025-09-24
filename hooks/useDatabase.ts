import * as SQLite from "expo-sqlite";
export async function updateBook(
  book: {
    id: number;
    photo?: string;
    description?: string;
    rating?: number;
    tags?: string[];
    category?: string;
    genres?: string[];
    spicyLevel?: number;
    author?: string;
    title?: string;
  },
  callback?: () => void
) {
  if (!db) {
    console.error("Database not initialized. Call initDatabase() first.");
    return;
  }
  try {
    await db.runAsync(
      `UPDATE books SET
        photo = COALESCE(?, photo),
        description = COALESCE(?, description),
        rating = COALESCE(?, rating),
        tags = COALESCE(?, tags),
        category = COALESCE(?, category),
        genres = COALESCE(?, genres),
        spicyLevel = COALESCE(?, spicyLevel),
        author = COALESCE(?, author),
        title = COALESCE(?, title)
      WHERE id = ?;`,
      book.photo ?? null,
      book.description ?? null,
      book.rating ?? null,
      book.tags ? JSON.stringify(book.tags) : null,
      book.category ?? null,
      book.genres ? JSON.stringify(book.genres) : null,
      book.spicyLevel ?? null,
      book.author ?? null,
      book.title ?? null,
      book.id
    );
    if (callback) callback();
  } catch (err) {
    console.error("Error updating book:", err);
  }
}
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
        genres TEXT,
        spicyLevel INTEGER
      );
    `);
    // Migration: If genres, spicyLevel, author, or title column doesn't exist, add them
    const columns = await db.getAllAsync("PRAGMA table_info(books);");
    const hasGenres = columns.some((col: any) => col.name === "genres");
    if (!hasGenres) {
      await db.execAsync("ALTER TABLE books ADD COLUMN genres TEXT;");
      await db.execAsync(
        "UPDATE books SET genres = json_array(category) WHERE category IS NOT NULL;"
      );
    }
    const hasSpicy = columns.some((col: any) => col.name === "spicyLevel");
    if (!hasSpicy) {
      await db.execAsync(
        "ALTER TABLE books ADD COLUMN spicyLevel INTEGER DEFAULT 1;"
      );
    }
    const hasAuthor = columns.some((col: any) => col.name === "author");
    if (!hasAuthor) {
      await db.execAsync("ALTER TABLE books ADD COLUMN author TEXT;");
    }
    const hasTitle = columns.some((col: any) => col.name === "title");
    if (!hasTitle) {
      await db.execAsync("ALTER TABLE books ADD COLUMN title TEXT;");
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
    spicyLevel: number;
  },
  callback?: () => void
) {
  if (!db) {
    console.error("Database not initialized. Call initDatabase() first.");
    return;
  }
  try {
    await db.runAsync(
      `INSERT INTO books (photo, description, rating, tags, category, genres, spicyLevel) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      book.photo,
      book.description,
      book.rating,
      JSON.stringify(book.tags),
      book.category,
      JSON.stringify(
        book.genres && book.genres.length ? book.genres : [book.category]
      ),
      book.spicyLevel
    );
    if (callback) callback();
  } catch (err) {
    console.error("Error adding book:", err);
  }
}
