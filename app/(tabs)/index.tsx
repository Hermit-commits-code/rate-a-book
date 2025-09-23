import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { getBooks, initDatabase } from "../../hooks/useDatabase";

export default function SavedBooksScreen() {
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      await initDatabase();
      const allBooks = await getBooks();
      setBooks(allBooks);
    })();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Saved Books</Text>
      {books.length === 0 ? (
        <Text style={styles.empty}>No books saved yet.</Text>
      ) : (
        books.map((book) => (
          <View key={book.id} style={styles.bookCard}>
            {book.photo ? (
              <Image source={{ uri: book.photo }} style={styles.bookImage} />
            ) : null}
            <Text style={styles.bookDesc}>{book.description}</Text>
            <Text style={styles.bookMeta}>Rating: {book.rating}</Text>
            <Text style={styles.bookMeta}>Category: {book.category}</Text>
            <Text style={styles.bookMeta}>Tags: {book.tags?.join(", ")}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    marginTop: 32, // Add top margin for better spacing
  },
  empty: {
    textAlign: "center",
    color: "#888",
    marginTop: 32,
  },
  bookCard: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
  },
  bookImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  bookDesc: {
    fontSize: 16,
    marginBottom: 4,
  },
  bookMeta: {
    fontSize: 14,
    color: "#555",
  },
});
