import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Chip, Menu, TextInput } from "react-native-paper";

import { addBook, initDatabase } from "../../hooks/useDatabase";

// Modularized styles
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f5f7fa",
  },
  formCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  photoBtn: {
    marginBottom: 18,
    backgroundColor: "#1976d2",
  },
  photoBtnLabel: {
    color: "#fff",
    fontWeight: "bold",
  },
  bookImage: {
    width: 200,
    height: 300,
    marginBottom: 18,
    borderRadius: 14,
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#e3e3e3",
  },
  descriptionInput: {
    marginBottom: 18,
    width: "100%",
    backgroundColor: "#f5f7fa",
    borderRadius: 10,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 18,
  },
  ratingBtn: {
    marginHorizontal: 4,
    borderRadius: 8,
    borderColor: "#e3e3e3",
    backgroundColor: "#fff",
  },
  ratingBtnActive: {
    borderColor: "#1976d2",
    backgroundColor: "#1976d2",
  },
  ratingLabel: {
    color: "#1976d2",
    fontWeight: "bold",
  },
  ratingLabelActive: {
    color: "#fff",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 18,
  },
  tagChip: {
    margin: 6,
    backgroundColor: "#e3f2fd",
    borderRadius: 16,
  },
  tagChipSelected: {
    backgroundColor: "#ff9800",
  },
  tagText: {
    color: "#1976d2",
    fontWeight: "bold",
  },
  tagTextSelected: {
    color: "#fff",
  },
  categoryBtn: {
    marginBottom: 18,
    backgroundColor: "#e3e3e3",
  },
  categoryBtnSelected: {
    backgroundColor: "#1976d2",
  },
  categoryLabel: {
    color: "#1976d2",
    fontWeight: "bold",
  },
  categoryLabelSelected: {
    color: "#fff",
  },
  spicyLevelSection: {
    marginBottom: 22,
  },
  spicyLevelHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  spicyLevelTitle: {
    fontWeight: "bold",
    color: "#d32f2f",
    fontSize: 16,
    marginRight: 8,
  },
  spicyLevelValue: {
    color: "#1976d2",
    fontWeight: "bold",
  },
  spicyLevelBarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  spicyBar: {
    height: 18,
    width: 32,
    borderRadius: 6,
    marginRight: 0, // overridden inline for spacing
  },
  spicyBarText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 13,
    lineHeight: 18,
  },
  saveBtn: {
    marginTop: 28,
    backgroundColor: "#ff9800",
  },
  saveBtnLabel: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default function AddBookScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const tagOptions = ["liked", "dislike", "want to own", "never read again"];
  const [category, setCategory] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const categories = ["Fiction", "Non-Fiction", "Sci-Fi", "Biography"];
  const [spicyLevel, setSpicyLevel] = useState(1);

  useEffect(() => {
    (async () => {
      await initDatabase();
    })();
  }, []);

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera is required!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    await addBook(
      {
        photo: image ?? "",
        description,
        rating: rating ?? 0,
        tags,
        category,
        genres: category ? [category] : [],
        spicyLevel: spicyLevel,
      },
      () => {
        alert("Book saved!");
        setImage(null);
        setDescription("");
        setRating(null);
        setTags([]);
        setCategory("");
        setSpicyLevel(1);
      }
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formCard}>
        <Button
          mode="contained"
          onPress={handleTakePhoto}
          style={styles.photoBtn}
          labelStyle={styles.photoBtnLabel}
        >
          Take Book Photo
        </Button>
        {image && <Image source={{ uri: image }} style={styles.bookImage} />}
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          style={styles.descriptionInput}
          underlineColor="#1976d2"
          activeUnderlineColor="#1976d2"
        />
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((num) => (
            <Button
              key={num}
              mode={rating === num ? "contained" : "outlined"}
              onPress={() => setRating(num)}
              style={[
                styles.ratingBtn,
                rating === num && styles.ratingBtnActive,
              ]}
              labelStyle={[
                styles.ratingLabel,
                rating === num && styles.ratingLabelActive,
              ]}
            >
              {num}
            </Button>
          ))}
        </View>
        <View style={styles.tagsRow}>
          {tagOptions.map((tag) => (
            <Chip
              key={tag}
              selected={tags.includes(tag)}
              onPress={() =>
                setTags((prev) =>
                  prev.includes(tag)
                    ? prev.filter((t) => t !== tag)
                    : [...prev, tag]
                )
              }
              style={[
                styles.tagChip,
                tags.includes(tag) && styles.tagChipSelected,
              ]}
              textStyle={[
                styles.tagText,
                tags.includes(tag) && styles.tagTextSelected,
              ]}
            >
              {tag}
            </Chip>
          ))}
        </View>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              onPress={() => setMenuVisible(true)}
              style={[
                styles.categoryBtn,
                category && styles.categoryBtnSelected,
              ]}
              labelStyle={[
                styles.categoryLabel,
                category && styles.categoryLabelSelected,
              ]}
            >
              {category ? category : "Select Category"}
            </Button>
          }
        >
          {categories.map((cat) => (
            <Menu.Item
              key={cat}
              onPress={() => {
                setCategory(cat);
                setMenuVisible(false);
              }}
              title={cat}
            />
          ))}
        </Menu>
        {/* Spicy Level Selector */}
        <View style={styles.spicyLevelSection}>
          <View style={styles.spicyLevelHeader}>
            <Text style={styles.spicyLevelTitle}>Spicy Level</Text>
            <Text style={styles.spicyLevelValue}>{`(${spicyLevel}/5)`}</Text>
          </View>
          <View style={styles.spicyLevelBarRow}>
            {[1, 2, 3, 4, 5].map((level) => {
              let bg;
              if (level <= spicyLevel) {
                if (level <= 2) bg = "#43a047";
                else if (level === 3 || level === 4) bg = "#ff9800";
                else bg = "#d32f2f";
              } else {
                bg = "#e0e0e0";
              }
              return (
                <View
                  key={level}
                  style={[
                    styles.spicyBar,
                    {
                      backgroundColor: bg,
                      borderWidth: level === spicyLevel ? 2 : 0,
                      borderColor:
                        level === spicyLevel ? "#1976d2" : "transparent",
                      marginRight: level < 5 ? 6 : 0,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.spicyBarText,
                      { color: level <= spicyLevel ? "#fff" : "#888" },
                    ]}
                    onPress={() => setSpicyLevel(level)}
                  >
                    {level}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.saveBtn}
          labelStyle={styles.saveBtnLabel}
        >
          Save Book
        </Button>
      </View>
    </ScrollView>
  );
}
