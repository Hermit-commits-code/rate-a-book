import { useFocusEffect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getBooks, initDatabase } from "../../hooks/useDatabase";
export default function SavedBooksScreen() {
  // Add deleteBook function
  const deleteBook = async (bookId: number) => {
    // You may want to add a confirmation dialog here
    try {
      const { deleteBook } = await import("../../hooks/useDatabase");
      await deleteBook(bookId);
      // Refresh list
      const allBooks = await getBooks();
      setBooks(allBooks);
    } catch (err) {
      console.error("Failed to delete book", err);
    }
  };
  const [books, setBooks] = useState<any[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await initDatabase();
      const allBooks = await getBooks();
      setBooks(allBooks);
      // Collect all unique genres from books
      const genreSet = new Set<string>();
      allBooks.forEach((book) => {
        if (Array.isArray(book.genres)) {
          book.genres.forEach((g: string) => genreSet.add(g));
        } else if (book.category) {
          genreSet.add(book.category);
        }
      });
      setGenres(Array.from(genreSet));
    })();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const allBooks = await getBooks();
        setBooks(allBooks);
        // Update genres on focus
        const genreSet = new Set<string>();
        allBooks.forEach((book) => {
          if (Array.isArray(book.genres)) {
            book.genres.forEach((g: string) => genreSet.add(g));
          } else if (book.category) {
            genreSet.add(book.category);
          }
        });
        setGenres(Array.from(genreSet));
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
      style={styles.modernBookCard}
      onPress={() => handleBookPress(book)}
      accessible
      accessibilityLabel={`Book card: ${book.description}`}
    >
      <View style={styles.bookImageWrapper}>
        {book.photo ? (
          <Image
            source={{ uri: book.photo }}
            style={styles.modernBookImage}
            accessibilityLabel="Book cover photo"
          />
        ) : (
          <View style={styles.modernBookImagePlaceholder}>
            <Text style={styles.bookImagePlaceholderText}>No Photo</Text>
          </View>
        )}
        {/* Gradient overlay for readability */}
        <View style={styles.gradientOverlay} />
        {/* Favorite badge */}
        {book.favorite && (
          <View style={styles.favoriteBadge}>
            <Text style={styles.favoriteBadgeText}>★</Text>
          </View>
        )}
        {/* Quick actions row */}
        <View style={styles.quickActionsRow}>
          {/* Edit button: open book details in edit mode */}
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() =>
              router.push({
                pathname: "/book-details",
                params: { book: JSON.stringify(book), edit: "true" },
              })
            }
            accessibilityLabel="Edit book"
          >
            <Text style={styles.quickActionIcon}>✎</Text>
          </TouchableOpacity>
          {/* Delete button: remove book and refresh list */}
          <TouchableOpacity
            style={styles.quickActionBtn}
            onPress={() => deleteBook(book.id)}
            accessibilityLabel="Delete book"
          >
            <Text style={styles.quickActionIcon}>🗑️</Text>
          </TouchableOpacity>
          {/* Share button: already works */}
          <TouchableOpacity style={styles.quickActionBtn}>
            <Text style={styles.quickActionIcon}>↗</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text
        style={styles.modernBookAuthor}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {book.author || "Unknown Author"}
      </Text>
      {/* Description removed from card. Only shown in book details modal. */}
      <View style={styles.modernMetaRow}>
        <Text style={styles.modernBookStatus}>{book.status || "To Read"}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.thinHeader} />
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
          data={genres}
          keyExtractor={(genre) => genre}
          renderItem={({ item: genre }) => {
            // Find all books in this genre (support multiple genres per book)
            const genreBooks = books.filter((book) => {
              if (Array.isArray(book.genres)) {
                return book.genres.includes(genre);
              } else if (book.category) {
                return book.category === genre;
              }
              return false;
            });
            if (genreBooks.length === 0) return null;
            return (
              <View style={{ marginBottom: 24 }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginLeft: 16,
                    marginBottom: 8,
                    color: "#4f8cff",
                  }}
                >
                  {genre}
                </Text>
                <FlatList
                  data={genreBooks}
                  keyExtractor={(item) => item.id?.toString()}
                  renderItem={renderBook}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingLeft: 12, paddingRight: 12 }}
                />
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/add-book")}
        accessibilityLabel="Add a new book"
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  favoriteBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FFD700",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 2,
  },
  favoriteBadgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  quickActionsRow: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    gap: 8,
    zIndex: 2,
  },
  quickActionBtn: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 12,
    padding: 4,
    marginLeft: 2,
  },
  modernBookCard: {
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
    minWidth: 190,
    maxWidth: 210,
  },
  modernBookImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#e3e3e3",
  },
  modernBookImagePlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#e3e3e3",
    alignItems: "center",
    justifyContent: "center",
  },
  bookImageWrapper: {
    position: "relative",
    width: "100%",
    height: 200,
    marginBottom: 8,
  },
  bookImageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.04)",
  },
  quickActions: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
    padding: 4,
    zIndex: 2,
  },
  quickActionIcon: {
    fontSize: 18,
    color: "#888",
    fontWeight: "bold",
  },
  modernBookAuthor: {
    fontSize: 15,
    color: "#4f8cff",
    fontWeight: "600",
    marginBottom: 2,
    textAlign: "center",
  },
  modernBookDesc: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
    textAlign: "center",
  },
  modernBookStatus: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600",
    marginLeft: 4,
    textAlign: "center",
  },
  cardContentStack: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginBottom: 2,
    marginTop: 2,
  },
  modernMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 4,
    gap: 4,
  },
  modernBookMeta: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600",
    maxWidth: 60,
    textAlign: "center",
    marginHorizontal: 2,
  },
  modernTagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 2,
    gap: 2,
  },
  modernTagChip: {
    backgroundColor: "#e0eaff",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginRight: 2,
    marginBottom: 2,
  },
  modernTagChipText: {
    fontSize: 12,
    color: "#4f8cff",
    fontWeight: "600",
    letterSpacing: 0.1,
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: "#4f8cff",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  fabText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: -2,
  },
  screen: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  // header styles removed
  thinHeader: {
    height: 32,
    backgroundColor: "#4f8cff",
    width: "100%",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 24,
    paddingTop: 12,
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
