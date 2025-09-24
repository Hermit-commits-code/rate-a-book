import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { Button, Chip, Menu, TextInput } from "react-native-paper";
import { addBook, initDatabase } from "../../hooks/useDatabase";
export default function AddBookScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const tagOptions = ["liked", "dislike", "want to own", "never read again"];
  const [category, setCategory] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const categories = ["Fiction", "Non-Fiction", "Sci-Fi", "Biography"];

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
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
      }}
    >
      <View style={{ width: "100%", maxWidth: 400 }}>
        <Button
          mode="contained"
          onPress={handleTakePhoto}
          style={{ marginBottom: 16 }}
        >
          Take Book Photo
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
