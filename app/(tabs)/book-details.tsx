import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
export default function BookDetailsScreen() {
  const params = useLocalSearchParams();
  let book: any = {};
  try {
    book = params.book ? JSON.parse(params.book as string) : {};
  } catch {
    book = {};
  }

  if (!book || Object.keys(book).length === 0) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Book not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View
          style={styles.card}
          accessible
          accessibilityLabel="Book details card"
        >
          <View style={styles.coverWrapper}>
            {book.photo || book.image ? (
              <Image
                source={{ uri: book.photo || book.image }}
                style={styles.coverImage}
                resizeMode="contain"
                accessibilityLabel={`Cover image for ${book.title}`}
              />
            ) : (
              <View style={styles.coverPlaceholder}>
                <Text style={styles.coverPlaceholderText}>No Image</Text>
              </View>
            )}
            {book.favorite && (
              <View style={styles.favoriteBadge}>
                <Text style={styles.favoriteBadgeText}>★</Text>
              </View>
            )}
          </View>
          <Text style={styles.title}>{book.title ?? "Untitled"}</Text>
          <Text style={styles.author}>{book.author ?? "Unknown Author"}</Text>
          <Text style={styles.status}>{book.status ?? ""}</Text>
          {book.rating !== undefined && (
            <View style={styles.metaRow}>
              <Text style={styles.label}>Rating:</Text>
              <Text style={styles.value}>{book.rating}</Text>
            </View>
          )}
          {book.genres && book.genres.length > 0 && (
            <View style={styles.genreRow}>
              <Text style={styles.label}>Genres:</Text>
              {book.genres.map((genre: string) => (
                <View key={genre} style={styles.genreChip}>
                  <Text style={styles.genreChipText}>{genre}</Text>
                </View>
              ))}
            </View>
          )}
          {book.tags && book.tags.length > 0 && (
            <View style={styles.genreRow}>
              <Text style={styles.label}>Tags:</Text>
              {book.tags.map((tag: string) => (
                <View key={tag} style={styles.genreChip}>
                  <Text style={styles.genreChipText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
          {book.description && (
            <View style={{ width: "100%", marginTop: 12 }}>
              <Text style={styles.label}>Description:</Text>
              <Text style={styles.description}>{book.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  metaRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 12,
    marginBottom: 14,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
    fontSize: 15,
    marginRight: 4,
  },
  value: {
    fontSize: 17,
    color: "#1976d2",
    fontWeight: "bold",
  },
  screen: {
    flex: 1,
    backgroundColor: "#f5f7fa",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 12,
    alignItems: "stretch",
    maxWidth: 420,
    width: "100%",
    alignSelf: "center",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#e3e3e3",
    marginVertical: 20,
  },
  coverWrapper: {
    width: 200,
    height: 300,
    marginBottom: 22,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 8,
    alignSelf: "center",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
    backgroundColor: "#e3e3e3",
  },
  coverPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    backgroundColor: "#e3e3e3",
    alignItems: "center",
    justifyContent: "center",
  },
  coverPlaceholderText: {
    color: "#888",
    fontSize: 16,
  },
  favoriteBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#FFD700",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    zIndex: 2,
  },
  favoriteBadgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: 12,
    textAlign: "center",
  },
  author: {
    fontSize: 18,
    color: "#333",
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  status: {
    fontSize: 15,
    color: "#263238",
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 18,
    gap: 8,
  },
  genreChip: {
    backgroundColor: "#e3f2fd",
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  genreChipText: {
    fontSize: 14,
    color: "#1976d2",
    fontWeight: "600",
  },
  description: {
    fontSize: 15,
    color: "#444",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 22,
  },
});
