import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { getBooks, initDatabase } from "../../hooks/useDatabase";

export default function SavedBooksScreen() {
  const [books, setBooks] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await initDatabase();
      const allBooks = await getBooks();
      setBooks(allBooks);
    })();
  }, []);

  const handleBookPress = (book: any) => {
    router.push({
      pathname: "/book-details",
      params: { book: JSON.stringify(book) },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Saved Books</Text>
      {books.length === 0 ? (
        <Text style={styles.empty}>No books saved yet.</Text>
      ) : (
        books.map((book) => (
          <Pressable
            key={book.id}
            style={styles.bookCard}
            onPress={() => handleBookPress(book)}
            accessible
            accessibilityLabel={`Book card: ${book.description}`}
          >
            {book.photo ? (
              <Image source={{ uri: book.photo }} style={styles.bookImage} accessibilityLabel="Book cover photo" />
            ) : null}
            <Text style={styles.bookDesc}>{book.description}</Text>
            <Text style={styles.bookMeta}>Rating: {book.rating}</Text>
            <Text style={styles.bookMeta}>Category: {book.category}</Text>
            <Text style={styles.bookMeta}>Tags: {book.tags?.join(", ")}</Text>
          </Pressable>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#fafafa",
    minHeight: "100%",
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: "100%",
    maxWidth: 400,
    marginBottom: 20,
  },
  bookImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#eee",
  },
  bookDesc: {
    fontSize: 16,
    marginBottom: 8,
    color: "#444",
  },
  bookMeta: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
});
