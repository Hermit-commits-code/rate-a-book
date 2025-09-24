import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
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

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const allBooks = await getBooks();
        setBooks(allBooks);
      })();
    }, [])
  );

  const handleBookPress = (book: any) => {
    router.push({
      pathname: "/book-details",
      params: { book: JSON.stringify(book) },
    });
  };

  const renderBook = ({ item: book }: { item: any }) => (
    <Pressable
      key={book.id}
      style={styles.bookCard}
      onPress={() => handleBookPress(book)}
      accessible
      accessibilityLabel={`Book card: ${book.description}`}
    >
      {book.photo ? (
        <Image
          source={{ uri: book.photo }}
          style={styles.bookImage}
          accessibilityLabel="Book cover photo"
        />
      ) : (
        <View style={styles.bookImagePlaceholder}>
          <Text style={styles.bookImagePlaceholderText}>No Photo</Text>
        </View>
      )}
      <Text style={styles.bookDesc}>{book.description}</Text>
      <Text style={styles.bookMeta}>Rating: {"★".repeat(book.rating)}</Text>
      <Text style={styles.bookMeta}>Category: {book.category}</Text>
      <View style={styles.tagRow}>
        {book.tags?.map((tag: string) => (
          <View key={tag} style={styles.tagChip}>
            <Text style={styles.tagChipText}>{tag}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.headerIcon}
        />
        <Text style={styles.headerTitle}>Rate-a-Book</Text>
        <Text style={styles.headerSubtitle}>Your personal book tracker</Text>
      </View>
      {books.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../../assets/images/splash-icon.png")}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyTitle}>No books saved yet</Text>
          <Text style={styles.emptySubtitle}>
            Start by adding your first book!
          </Text>
        </View>
      ) : (
        <FlatList
          data={books}
          renderItem={renderBook}
          keyExtractor={(item) => item.id?.toString()}
          numColumns={2}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 48,
    paddingBottom: 32,
    backgroundColor: "#4f8cff",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 8,
    elevation: 4,
  },
  headerIcon: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#e0eaff",
    marginBottom: 0,
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  bookCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    margin: 8,
    flex: 1,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    minWidth: 160,
    maxWidth: "48%",
  },
  bookImage: {
    width: "100%",
    height: 140,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#e3e3e3",
  },
  bookImagePlaceholder: {
    width: "100%",
    height: 140,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#e3e3e3",
    alignItems: "center",
    justifyContent: "center",
  },
  bookImagePlaceholderText: {
    color: "#888",
    fontSize: 14,
  },
  bookDesc: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  bookMeta: {
    fontSize: 14,
    color: "#4f8cff",
    marginBottom: 2,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  tagChip: {
    backgroundColor: "#e0eaff",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
  },
  tagChipText: {
    fontSize: 12,
    color: "#4f8cff",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 48,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
    opacity: 0.7,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4f8cff",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 0,
  },
});
