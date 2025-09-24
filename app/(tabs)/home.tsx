import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Appbar } from "react-native-paper";
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
      <Appbar.Header style={{ backgroundColor: "#4f8cff" }}>
        <Appbar.Content title="Home" color="#fff" />
      </Appbar.Header>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.icon}
        />
        <Text style={styles.title}>Rate-a-Book</Text>
        <Text style={styles.subtitle}>Your personal book tracker</Text>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Books</Text>
          <Text style={styles.statValue}>{totalBooks}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Avg. Rating</Text>
          <Text style={styles.statValue}>{avgRating}</Text>
        </View>
        <View style={styles.statCardWide}>
          <Text style={styles.statLabel}>Top Tag</Text>
          <Text
            style={styles.topTagValue}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {mostUsedTag}
          </Text>
        </View>
      </View>
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
  screen: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
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
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    elevation: 2,
    minWidth: 90,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statCardWide: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    elevation: 2,
    minWidth: 120,
    maxWidth: 140,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flex: 1.2,
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
    fontWeight: "600",
    textAlign: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  topTagValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
    textAlign: "center",
    paddingHorizontal: 8,
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
});
