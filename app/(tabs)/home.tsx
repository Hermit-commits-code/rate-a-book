import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HomeStats } from "../../components/HomeStats";
import { getBooks, initDatabase } from "../../hooks/useDatabase";

export default function HomeScreen() {
  const [books, setBooks] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await initDatabase();
      const allBooks = await getBooks();
      setBooks(allBooks);
    })();
  }, []);

  const totalBooks = books.length;
  const avgRating =
    books.length > 0
      ? (
          books.reduce((sum, b) => sum + (b.rating || 0), 0) / books.length
        ).toFixed(1)
      : "-";
  const allTags = books.flatMap((b) => b.tags || []);
  const mostUsedTag =
    allTags.length > 0
      ? allTags.sort(
          (a, b) =>
            allTags.filter((t) => t === b).length -
            allTags.filter((t) => t === a).length
        )[0]
      : "-";

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.icon}
        />
        <Text style={styles.title}>Rate-a-Book</Text>
      </View>
      <HomeStats
        totalBooks={totalBooks}
        avgRating={avgRating}
        mostUsedTag={mostUsedTag}
      />
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.push("/add-book")}
        >
          <Text style={styles.actionText}>Add Book</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.actionText}>View Library</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 48,
    paddingBottom: 24,
    backgroundColor: "#4f8cff",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 8,
    elevation: 4,
  },
  icon: {
    width: 72,
    height: 72,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: "#e0eaff",
    marginBottom: 0,
    textAlign: "center",
    alignSelf: "center",
    maxWidth: 400,
    flexWrap: "wrap",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  actionBtn: {
    backgroundColor: "#4f8cff",
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginHorizontal: 12,
    elevation: 2,
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
    textAlign: "center",
  },
  screen: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
});
