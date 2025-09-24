// removed duplicate React import
import {
  addBook,
  deleteBook,
  getBooks,
  initDatabase,
} from "@/hooks/useDatabase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Animated,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

// AnimatedPressable: scale animation on press
import type { AccessibilityRole } from "react-native";
interface AnimatedPressableProps {
  children: ReactNode;
  style?: any;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
}
function AnimatedPressable({
  children,
  style,
  onPress,
  accessibilityLabel,
  accessibilityRole,
}: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.92,
        useNativeDriver: true,
        speed: 40,
        bounciness: 4,
      }),
      Animated.timing(rippleOpacity, {
        toValue: 0.18,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 40,
        bounciness: 4,
      }),
      Animated.timing(rippleOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  };
  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole={accessibilityRole}
        style={{ position: "relative" }}
      >
        {children}
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 12,
            backgroundColor: "#4f8cff",
            opacity: rippleOpacity,
          }}
        />
      </Pressable>
    </Animated.View>
  );
}

export default function SavedBooksScreen() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [undoBook, setUndoBook] = useState<any | null>(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      await initDatabase();
      const allBooks = await getBooks();
      setBooks(allBooks);
      setLoading(false);
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    const allBooks = await getBooks();
    setBooks(allBooks);
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      // Reset undo snackbar/book state on tab focus
      setShowSnackbar(false);
      setUndoBook(null);
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

  // Render a single book card
  const renderBook = ({ item }: { item: any }) => (
    <View style={styles.modernBookCard}>
      <View style={styles.bookImageWrapper}>
        {item.photo || item.image ? (
          <Image
            source={{ uri: item.photo || item.image }}
            style={styles.modernBookImage}
            resizeMode="contain"
            accessibilityLabel={`Cover image for ${item.title}`}
          />
        ) : (
          <View style={styles.modernBookImagePlaceholder}>
            <Text style={styles.bookImagePlaceholderText}>No Image</Text>
          </View>
        )}
        {item.favorite && (
          <View style={styles.favoriteBadge}>
            <Text style={styles.favoriteBadgeText}>★</Text>
          </View>
        )}
      </View>
      <View style={styles.cardContentStack}>
        <Text style={styles.modernBookAuthor} numberOfLines={1}>
          {item.author}
        </Text>
        <Text style={styles.modernBookDesc} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.modernBookStatus}>{item.status ?? ""}</Text>
        {/* Modern quick actions row at the bottom */}
        <View
          style={{
            flexDirection: "row",
            gap: 12,
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <AnimatedPressable
            style={styles.quickActionBtn}
            onPress={() =>
              router.push({ pathname: "/add-book", params: { edit: item.id } })
            }
            accessibilityLabel={`Edit ${item.title}`}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons
              name="pencil"
              size={28}
              color="#4f8cff"
              style={{ opacity: 0.92 }}
            />
          </AnimatedPressable>
          <AnimatedPressable
            style={styles.quickActionBtn}
            onPress={() => {
              Alert.alert("Delete Book", `Delete ${item.title}?`, [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: async () => {
                    setUndoBook(item);
                    setBooks((prev) => prev.filter((b) => b.id !== item.id));
                    setShowSnackbar(true);
                    // Remove from database
                    await deleteBook(item.id);
                  },
                },
              ]);
            }}
            accessibilityLabel={`Delete ${item.title}`}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons
              name="trash-can"
              size={28}
              color="#e53935"
              style={{ opacity: 0.92 }}
            />
          </AnimatedPressable>
          <AnimatedPressable
            style={styles.quickActionBtn}
            onPress={() => handleBookPress(item)}
            accessibilityLabel={`View details for ${item.title}`}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons
              name="information"
              size={28}
              color="#333"
              style={{ opacity: 0.92 }}
            />
          </AnimatedPressable>
        </View>
      </View>
    </View>
  );

  // Group books by genre
  const genreMap: { [genre: string]: any[] } = {};
  books.forEach((book) => {
    (book.genres || []).forEach((genre: string) => {
      if (!genreMap[genre]) genreMap[genre] = [];
      genreMap[genre].push(book);
    });
  });
  const genreList = Object.keys(genreMap);

  // Skeleton loader for loading state
  const renderLoader = () => (
    <View style={styles.grid}>
      {[...Array(4)].map((_, idx) => (
        <View key={idx} style={styles.modernBookCard}>
          <View style={styles.modernBookImagePlaceholder} />
          <View
            style={{
              height: 18,
              backgroundColor: "#e3e3e3",
              borderRadius: 4,
              marginBottom: 8,
            }}
          />
          <View
            style={{
              height: 14,
              backgroundColor: "#e3e3e3",
              borderRadius: 4,
              marginBottom: 4,
            }}
          />
        </View>
      ))}
    </View>
  );

  // Snackbar for undo
  const Snackbar = () =>
    showSnackbar && (
      <View style={styles.snackbar} accessibilityLiveRegion="polite">
        <Text style={styles.snackbarText}>Book deleted</Text>
        <Pressable
          onPress={async () => {
            if (undoBook) {
              setBooks((prev) => [undoBook, ...prev]);
              // Re-add to database
              await addBook(undoBook);
            }
            setUndoBook(null);
            setShowSnackbar(false);
          }}
          accessibilityRole="button"
          accessibilityLabel="Undo delete"
        >
          <Text style={styles.snackbarUndo}>Undo</Text>
        </Pressable>
      </View>
    );

  const styles = StyleSheet.create({
    snackbar: {
      position: "absolute",
      bottom: 90,
      left: 20,
      right: 20,
      backgroundColor: "#333",
      borderRadius: 8,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      zIndex: 100,
      elevation: 10,
    },
    snackbarText: {
      color: "#fff",
      fontSize: 15,
      fontWeight: "500",
    },
    snackbarUndo: {
      color: "#FFD700",
      fontWeight: "bold",
      fontSize: 15,
      marginLeft: 18,
    },
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
      padding: 10,
      margin: 6,
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
      aspectRatio: 2 / 3,
      borderRadius: 10,
      marginBottom: 6,
      backgroundColor: "#e3e3e3",
    },
    modernBookImagePlaceholder: {
      width: "100%",
      height: 250,
      borderRadius: 10,
      marginBottom: 6,
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
      color: "#1a237e",
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
      color: "#263238",
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

  // Main render
  return (
    <View style={styles.screen}>
      <View style={styles.thinHeader} />
      {loading ? (
        renderLoader()
      ) : books.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="book-open-variant"
            size={120}
            color="#4f8cff"
            style={styles.emptyImage}
            accessibilityLabel="No books icon"
          />
          <Text style={styles.emptyTitle}>No books saved</Text>
          <Text style={styles.emptySubtitle}>
            Add your first book to get started!
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 24 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {genreList.map((genre) => (
            <View key={genre} style={{ marginBottom: 18 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#4f8cff",
                  marginLeft: 12,
                  marginBottom: 8,
                }}
              >
                {genre}
              </Text>
              <FlatList
                data={genreMap[genre]}
                horizontal
                keyExtractor={(book) => book.id?.toString() ?? book.title}
                renderItem={renderBook}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingLeft: 8, paddingRight: 8 }}
              />
            </View>
          ))}
        </ScrollView>
      )}
      <Snackbar />
    </View>
  );
  // ...existing code...
}
