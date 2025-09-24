import React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface HomeStatsProps {
  totalBooks: number;
  avgRating: string;
  mostUsedTag: string;
}

export const HomeStats: React.FC<HomeStatsProps> = ({
  totalBooks,
  avgRating,
  mostUsedTag,
}) => (
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
      <Text style={styles.topTagValue} numberOfLines={2} ellipsizeMode="tail">
        {mostUsedTag}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    minWidth: 90,
    elevation: 2,
    marginHorizontal: 4,
  },
  statCardWide: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    minWidth: 120,
    elevation: 2,
    marginHorizontal: 4,
  },
  statLabel: {
    fontSize: 15,
    color: "#4f8cff",
    fontWeight: "bold",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    color: "#263238",
    fontWeight: "bold",
  },
  topTagValue: {
    fontSize: 16,
    color: "#ff9800",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 2,
  },
});
