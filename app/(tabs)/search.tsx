// ...existing styles...
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
// ...existing code...
import { getBooks, initDatabase, updateBook } from "../../hooks/useDatabase";

const tagOptions = ["liked", "dislike", "want to own", "never read again"];
const ratingOptions = [1, 2, 3, 4, 5];
const spicyOptions = [1, 2, 3, 4, 5];

export default function SearchScreen() {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editBook, setEditBook] = useState<any | null>(null);
  // ...existing code...
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<any[]>([]);
  const [selectedSpicy, setSelectedSpicy] = useState<number | null>(null);

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
    if (selectedSpicy) {
      results = results.filter((b) => b.spicyLevel === selectedSpicy);
    }
    setFilteredBooks(results);
  }, [search, selectedTags, selectedRating, selectedSpicy, books]);

  const handleSaveEdit = async () => {
    if (editBook && editBook.id) {
      await updateBook(editBook);
      const allBooks = await getBooks();
      setBooks(allBooks);
      setEditModalVisible(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Edit Book Modal */}
      {editModalVisible && editBook && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Book</Text>
            <Text style={styles.modalLabel}>Title</Text>
            <TextInput
              value={editBook.title || ""}
              onChangeText={(text) => setEditBook({ ...editBook, title: text })}
              style={styles.modalInput}
            />
            <Text style={styles.modalLabel}>Author</Text>
            <TextInput
              value={editBook.author || ""}
              onChangeText={(text) =>
                setEditBook({ ...editBook, author: text })
              }
              style={styles.modalInput}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBtn}
                onPress={handleSaveEdit}
              >
                <Text style={styles.modalBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
              accessibilityLabel={`Tag: ${tag}`}
              accessibilityRole="button"
              accessibilityHint={`Toggle tag ${tag}`}
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
              accessibilityLabel={`Rating: ${num} stars`}
              accessibilityRole="button"
              accessibilityHint={`Filter books by ${num} star rating`}
            >
              <Text style={styles.filterChipText}>{"★".repeat(num)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.filterRow}>
          {spicyOptions.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.filterChip,
                selectedSpicy === level && styles.filterChipSelected,
              ]}
              onPress={() =>
                setSelectedSpicy(selectedSpicy === level ? null : level)
              }
              accessibilityLabel={`Spicy Level: ${level}`}
              accessibilityRole="button"
              accessibilityHint={`Filter books by spicy level ${level}`}
            >
              <Text style={styles.filterChipText}>{`Spicy ${level}`}</Text>
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
              accessibilityLabel={`Book card: ${item.title || "Book"}`}
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
              <Text
                style={styles.bookAuthor}
                allowFontScaling={true}
                numberOfLines={1}
              >
                {item.author || ""}
              </Text>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => {
                  setEditBook(item);
                  setEditModalVisible(true);
                }}
                accessibilityLabel={`Edit book: ${item.title || "Book"}`}
                accessibilityRole="button"
              >
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText} allowFontScaling={true}>
              No results found.
            </Text>
          }
        />
      </View>
    </View>
  );
  // End of SearchScreen
}

const styles = StyleSheet.create({
  bookImage: {
    width: 160,
    height: 220,
    borderRadius: 14,
    marginBottom: 16,
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
    minWidth: 200,
    maxWidth: "75%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalCard: {
    width: 320,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    alignItems: "stretch",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4f8cff",
    marginBottom: 18,
    textAlign: "center",
  },
  modalLabel: {
    fontSize: 15,
    color: "#333",
    marginBottom: 6,
    fontWeight: "bold",
  },
  modalInput: {
    backgroundColor: "#f5f7fa",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  modalBtn: {
    backgroundColor: "#4f8cff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginHorizontal: 8,
  },
  modalBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  bookAuthor: {
    fontSize: 15,
    color: "#4f8cff",
    fontWeight: "bold",
    marginTop: 6,
    marginBottom: 2,
    textAlign: "center",
  },
  editBtn: {
    marginTop: 8,
    backgroundColor: "#4f8cff",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 18,
    alignSelf: "center",
    elevation: 2,
  },
  editBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 1,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 32,
  },
});
