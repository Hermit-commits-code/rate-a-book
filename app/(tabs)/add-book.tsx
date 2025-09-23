import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { Appbar, Button, Chip, Menu, TextInput } from "react-native-paper";
import { addBook, initDatabase } from "../../hooks/useDatabase";

export default function AddBookScreen() {
  // State for image picker
  const [image, setImage] = useState<string | null>(null);

  // State for form fields
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const tagOptions = ["liked", "dislike", "want to own", "never read again"];

  // Category dropdown
  const [category, setCategory] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const categories = ["Fiction", "Non-Fiction", "Sci-Fi", "Biography"];

  // Image picker function
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access media library is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };
  useEffect(() => {
    (async () => {
      await initDatabase();
    })();
  }, []);

  const handleSubmit = async () => {
    await addBook(
      {
        photo: image ?? "",
        description,
        rating: rating ?? 0,
        tags,
        category,
      },
      () => {
        alert("Book saved!");
        setImage(null);
        setDescription("");
        setRating(null);
        setTags([]);
        setCategory("");
      }
    );
  };
  return (
    <ScrollView>
      <Appbar.Header>
        <Appbar.Content title="Add Book" />
      </Appbar.Header>
      <View style={{ flex: 1, alignItems: "center", padding: 16 }}>
        <Button
          mode="contained"
          onPress={pickImage}
          style={{ marginBottom: 16 }}
        >
          Pick a Book Photo
        </Button>
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 300, marginBottom: 16 }}
          />
        )}

        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          style={{ marginBottom: 16, width: "100%" }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <Button
              key={num}
              mode={rating === num ? "contained" : "outlined"}
              onPress={() => setRating(num)}
              style={{ marginHorizontal: 2 }}
            >
              {num}
            </Button>
          ))}
        </View>

        <View
          style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 16 }}
        >
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
              style={{ margin: 4 }}
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
              style={{ marginBottom: 16 }}
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
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={{ marginTop: 24 }}
        >
          Save Book
        </Button>
      </View>
    </ScrollView>
  );
}
