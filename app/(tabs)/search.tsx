import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getBooks, initDatabase } from "../../hooks/useDatabase";

const tagOptions = ["liked", "dislike", "want to own", "never read again"];
const ratingOptions = [1, 2, 3, 4, 5];

export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      await initDatabase();
      const allBooks = await getBooks();
      setBooks(allBooks);
    })();
  }, []);

  useEffect(() => {
    let results = books;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      results = results.filter(
        (b) =>
          (b.description && b.description.toLowerCase().includes(q)) ||
          (b.category && b.category.toLowerCase().includes(q))
      );
    }
    if (selectedTags.length > 0) {
      results = results.filter((b) =>
        selectedTags.every((tag) => b.tags?.includes(tag))
      );
    }
    if (selectedRating) {
      results = results.filter((b) => b.rating === selectedRating);
    }
    setFilteredBooks(results);
  }, [search, selectedTags, selectedRating, books]);

  return (
    <View style={styles.screen}>
      <View style={styles.thinHeader} />
      <View style={styles.searchBarRow}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search by title or author..."
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <View style={styles.filterRow}>
        {tagOptions.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.filterChip,
              selectedTags.includes(tag) && styles.filterChipSelected,
            ]}
            onPress={() =>
              setSelectedTags((prev) =>
                prev.includes(tag)
                  ? prev.filter((t) => t !== tag)
                  : [...prev, tag]
              )
            }
          >
            <Text style={styles.filterChipText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.filterRow}>
        {ratingOptions.map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.filterChip,
              selectedRating === num && styles.filterChipSelected,
            ]}
            onPress={() =>
              setSelectedRating(selectedRating === num ? null : num)
            }
          >
            <Text style={styles.filterChipText}>{"★".repeat(num)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredBooks}
        renderItem={({ item }) => (
          <Pressable
            key={item.id}
            style={styles.bookCard}
            accessible
            accessibilityLabel={`Book card: ${item.description}`}
          >
            {item.photo ? (
              <Image
                source={{ uri: item.photo }}
                style={styles.bookImage}
                accessibilityLabel="Book cover photo"
              />
            ) : (
              <View style={styles.bookImagePlaceholder}>
                <Text style={styles.bookImagePlaceholderText}>No Photo</Text>
              </View>
            )}
            <Text style={styles.bookDesc}>{item.description}</Text>
            <Text style={styles.bookMeta}>
              Rating: {"★".repeat(item.rating)}
            </Text>
            <Text style={styles.bookMeta}>Category: {item.category}</Text>
            <View style={styles.tagRow}>
              {item.tags?.map((tag: string) => (
                <View key={tag} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>{tag}</Text>
                </View>
              ))}
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.id?.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No results found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  screen: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
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
  searchBarRow: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 10,
    fontSize: 16,
    elevation: 2,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: "#e0eaff",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 6,
  },
  filterChipSelected: {
    backgroundColor: "#4f8cff",
  },
  filterChipText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
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
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 32,
  },
});
