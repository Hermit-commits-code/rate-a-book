import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

export default function BookDetailsScreen() {
  const params = useLocalSearchParams();
  const book = params.book ? JSON.parse(params.book as string) : null;

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Book not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={styles.card}
        accessible
        accessibilityLabel="Book details card"
      >
        <Text style={styles.title}>Book Details</Text>
        {book.photo ? (
          <Image
            source={{ uri: book.photo }}
            style={styles.bookImage}
            accessibilityLabel="Book cover photo"
          />
        ) : null}
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{book.description}</Text>
        <Text style={styles.label}>Rating:</Text>
        <Text style={styles.value}>{book.rating}</Text>
        <Text style={styles.label}>Category:</Text>
        <Text style={styles.value}>{book.category}</Text>
        <Text style={styles.label}>Tags:</Text>
        <Text style={styles.value}>{book.tags?.join(", ")}</Text>
      </View>
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
  card: {
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
    marginTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  bookImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#eee",
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
    color: "#333",
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
    color: "#444",
  },
});
